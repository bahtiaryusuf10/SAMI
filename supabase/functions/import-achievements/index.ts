import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeInt } from '../_shared/transform.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { parseMultiSheetFile, processAndUpsertInBatches } from '../_shared/utils.ts';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PROCESSING_TIME = 60000; // 60 detik

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Proses melebihi batas waktu maksimal (${MAX_PROCESSING_TIME / 1000} detik).`)), MAX_PROCESSING_TIME)
  );
    
  try {
    const mainPromise = (async() => {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!, 
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      const formData = await req.formData();
      const file = formData.get('file');
      
      if (!(file instanceof File)) { 
        throw new Error("File tidak ditemukan.") 
      }
      
      if (file.size > MAX_FILE_SIZE) { 
        throw new Error(`Ukuran file melebihi batas maksimal (${MAX_FILE_SIZE / 1024 / 1024}MB).`) 
      }
      
      const dataRows = await parseMultiSheetFile(file, ['Prestasi Lengkap', 'Prestasi Non-Akademik Mahasiswa', 'Prestasi Akademik Mahasiswa']);
      
      if (dataRows.length === 0) { 
        throw new Error("File tidak berisi data di tab 'Penelitian' atau 'Pengabdian'.") 
      }
      
      const recordsToImport = dataRows.map(row => {
        let record = {};
        const tipe = row.tipe;

        if (tipe === 'Prestasi Lengkap') {
          record = {
            year: normalizeInt(row.tahun),
            field: row.bidang,
            achievement: row.prestasi,
            name: row.perlombaan,
            category: row.kategori,
            level: row.tingkat,
            student_id: row.nim,
            mentor_name: row.pembimbing
          };
        } 
        else if (tipe === 'Prestasi Non-Akademik Mahasiswa' || tipe === 'Prestasi Akademik Mahasiswa') {
          let level = 'Lokal/Wilayah';
          if (String(row.nasional).trim().toUpperCase() === 'V') level = 'Nasional';
          if (String(row.internasional).trim().toUpperCase() === 'V') level = 'Internasional';
          
          record = {
            name: row['nama kegiatan'],
            year: normalizeInt(row['waktu perolehan (yyyy)']),
            level: level,
            achievement: row['prestasi yang dicapai'],
            category: tipe === 'Prestasi Akademik Mahasiswa' ? 'Akademik' : 'Non-Akademik',
            student_id: null,
            field: null,
            mentor_name: null
          };
        }
        return record;
      });

      const successCount = await processAndUpsertInBatches(supabase, recordsToImport, 'import_achievements_batch');

      return { 
        message: `${successCount} dari ${recordsToImport.length} data berhasil diimport.` 
      };
    })();
    
    const result = await Promise.race([mainPromise, timeoutPromise]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});