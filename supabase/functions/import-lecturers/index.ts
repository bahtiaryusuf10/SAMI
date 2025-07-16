import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeName, normalizeChecked } from '../_shared/transform.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { parseFile, mapAndTransformRow, processAndUpsertInBatches } from '../_shared/utils.ts';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PROCESSING_TIME = 45000; // 45 detik

const columnConfig = {
  mappings: {
    "nama dosen": "name",
    "nidn/nidk": "lecturer_id",
    "magister/ magister terapan/ spesialis": "master_education",
    "doktor/ doktor terapan/ spesialis": "doctor_education",
    "bidang keahlian": "expertise",
    "kesesuaian dengan kompetensi inti ps": "core_competency_match",
    "jabatan akademik": "academic_rank",
    "sertifikat pendidik profesional": "has_professional_cert",
    "sertifikat kompetensi/ profesi/ industri": "certification_url",
    "mata kuliah yang diampu pada ps yang diakreditasi": "internal_courses",
    "kesesuaian bidang keahlian dengan mata kuliah yang diampu": "is_expertise_matched",
    "mata kuliah yang diampu pada ps lain": "external_courses"
  },
  transforms: {
    name: normalizeName,
    core_competency_match: normalizeChecked,
    has_professional_cert: normalizeChecked,
    is_expertise_matched: normalizeChecked,
  }
};

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
      const year = Number(formData.get('year'));
      
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

      const recordsToImport = dataRows.map(row => mapAndTransformRow(row, columnConfig))
      const successCount = await processAndUpsertInBatches(supabase, recordsToImport, 'import_lecturers_batch', year);

      return { 
        message: `${successCount} dari ${recordsToImport.length} data dosen berhasil diimport.` 
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