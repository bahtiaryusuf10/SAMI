import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeInt, normalizeTitleCase } from '../_shared/transform.ts';
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
      
      const dataRows = await parseMultiSheetFile(file, ['Jurnal', 'Seminar']);
      
      if (dataRows.length === 0) { 
        throw new Error("File tidak berisi data di tab 'Jurnal' atau 'Seminar'.") 
      }
      
      const recordsToImport = dataRows.map(row => {
        const record = {
          type: row.tipe, // Ambil nama tab
          lecturers: row['nama author'],
          title: row['judul artikel'],
          source_category: row['sumber'],
          journal_conference_name: row.tipe === 'Jurnal' ? row['nama jurnal, nomor, edisi'] : row['nama conference, nomor, edisi'],
          students: row.mahasiswa || null,
          year: normalizeInt(row.tahun),
          category: normalizeTitleCase(row.jenis),
          article_url: row['url artikel'],
          sum_of_citation: row['jumlah sitasi'],
          indexed_scopus_wos: row['terindeks scopus/wos'] || null,
          institution_level: row['tingkat mitra'] || null,
          institution: row.mitra || null,
        };
        return record;
      });

      const successCount = await processAndUpsertInBatches(supabase, recordsToImport, 'import_journal_conferences_batch');

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