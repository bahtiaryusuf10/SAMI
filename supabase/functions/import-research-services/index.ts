import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeInt, normalizeName, parseCurrency } from '../_shared/transform.ts';
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
      
      const dataRows = await parseMultiSheetFile(file, ['Penelitian', 'Pengabdian']);
      
      if (dataRows.length === 0) { 
        throw new Error("File tidak berisi data di tab 'Penelitian' atau 'Pengabdian'.") 
      }
      
      const recordsToImport = dataRows.map(row => {
        const fundData = parseCurrency(row['jumlah dana']);

        const record = {
          type: row.tipe, // Ambil nama tab
          title: row.tipe === 'Penelitian' ? row['judul penelitian'] : row['judul pengabdian'],
          
          leader: row.ketua,
          members: row.anggota || null,
          students: row.mahasiswa || null,

          amount_of_fund: fundData.amount,
          fund_currency: fundData.currency,

          source: normalizeName(row.sumber),
          course_integration: row['integrasi mata kuliah'] || null,
          semester_course_plan: row['rps/bukti integrasi'] || null,

          year: normalizeInt(row.tahun),
          contract_letter: row['surat kontrak'],

          service_category: row['kategori pengabdian'] || null,
          intellectual_property_rights: row.hki || null,
          publication_url: row.publikasi || null,
        };
        return record;
      });

      const successCount = await processAndUpsertInBatches(supabase, recordsToImport, 'import_research_services_batch');

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