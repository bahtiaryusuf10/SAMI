import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeInt, normalizeGpa } from '../_shared/transform.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { parseFile, mapAndTransformRow, processAndUpsertInBatches } from '../_shared/utils.ts';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PROCESSING_TIME = 25000; // 25 detik 

const columnConfig = {
  // Peta dari nama kolom di file CSV/Excel ke nama kolom di database
  mappings: {
    "nim": "student_id",
    "nama": "name",
    "l/p": "gender",
    "angkatan": "cohort_year",
    "jalur masuk": "admission_path",
    "keterangan jalur masuk": "admission_path_description",
    "status": "status",
    "sks": "course_credits",
    "ipk": "gpa",
    "lama studi(smt)": "study_duration",
  },
  // Fungsi transformasi/pembersihan untuk setiap kolom database
  transforms: {
    cohort_year: normalizeInt,
    course_credits: normalizeInt,
    gpa: normalizeGpa,
    study_duration: normalizeInt,
  }
};

Deno.serve(async (req) => {
  // Cek method request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Proses melebihi batas waktu maksimal (${MAX_PROCESSING_TIME / 1000} detik).`)), MAX_PROCESSING_TIME)
  );

  let file: File | null = null;
  let formData: FormData | null = null;
  let year: number | null = null;

  try {
    // public schema
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    formData = await req.formData();
    file = formData.get('file');
    year = Number(formData.get('year'));

    const mainPromise = (async() => {
  
      if (!(file instanceof File)) {
        throw new Error("File tidak ditemukan.");
      }
  
      if (file.size > MAX_FILE_SIZE) { 
        throw new Error(`Ukuran file melebihi batas maksimal (${MAX_FILE_SIZE / 1024 / 1024}MB).`);
      }
  
      // Parse file menjadi array of objects
      const dataRows = await parseFile(file);
  
      if (dataRows.length === 0) {
        throw new Error("File tidak berisi data.");
      }
  
      // Transformasi semua baris data
      const recordsToImport = dataRows.map(row => mapAndTransformRow(row, columnConfig));
  
      // Proses batch
      const successCount = await processAndUpsertInBatches(supabase, recordsToImport, 'import_students_batch', year);
  
      return { 
        message: `${successCount} dari ${recordsToImport.length} data mahasiswa berhasil diproses.` 
      };
      })();

    const result = await Promise.race([mainPromise, timeoutPromise]);

    await supabase.from('import_logs').insert({
        import_type: 'students',
        year: Number(formData.get('year')),
        file_name: file.name,
        file_size_kb: (file.size / 1024).toFixed(2),
        rows_processed: (result as { message: string }).message.split(' ')[0],
        status: 'Sukses',
        source_file_url: formData.get('sourceUrl'),
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    if (file && formData) {
      await supabase.from('import_logs').insert({
          import_type: 'students',
          year: Number(formData.get('year')),
          file_name: file.name,
          status: `Gagal: ${err.message}`,
      });
    }

    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});