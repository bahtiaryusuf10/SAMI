import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeInt, normalizeName } from '../_shared/transform.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { parseFile, processAndUpsertInBatches } from '../_shared/utils.ts';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PROCESSING_TIME = 45000; // 45 detik

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
      
      const dataRows = await parseFile(file);
      
      if (dataRows.length === 0) { 
        throw new Error("File tidak berisi data.") 
      }

      const recordsToImport = dataRows.map(row => {
        const primaryMethod = row['metode pembelajaran'];
        const secondaryMethod = row['sebutkan jika menggunakan metode lainnya (selain case method & team based project)'];

        return {
          course_id: row['kode mata kuliah'],
          name: normalizeName(row['nama mata kuliah']),
          study_program: row['program studi pengampu (contoh pengisian: s1 pendidikan geografi)'],
          package_category: row['jenis matakuliah pada program sarjana (s1)'],
          credits: normalizeInt(row['bobot total sks mata kuliah']),
          in_semester: normalizeInt(row.semester),
          learning_method: primaryMethod || secondaryMethod || null
        };
      });

      const successCount = await processAndUpsertInBatches(supabase, recordsToImport, 'import_courses_batch');

      return { 
        message: `${successCount} dari ${recordsToImport.length} data mata kuliah berhasil diimport.` 
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