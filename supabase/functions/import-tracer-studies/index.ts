import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizeInt, normalizeDate, normalizeEmploymentStatus, normalizeCurrency, normalizeMinWage, normalizeWorkplace, normalizeFilled } from '../_shared/transform.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { parseFile, mapAndTransformRow, processAndUpsertInBatches } from '../_shared/utils.ts';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PROCESSING_TIME = 45000; // 45 detik

const columnConfig = {
  mappings: {
    "nim": "nim",
    "status": "employment_status",
    "email": "email",
    "hp": "phone_number",
    "tgl sidang": "thesis_defense_date",
    "pkts": "is_tracer_filled",
    "prov. kerja": "work_province",
    "tpt kerja": "workplace",
    "1.2 x ump": "regional_min_wage",
    "penghasilan": "income",
    "wt <= 6": "waiting_time_lt_6",
    "wt > 6": "waiting_time_gt_6",
    "input": "created_at",
    "update": "updated_at",
  },
  transforms: {
    employment_status: normalizeEmploymentStatus,
    thesis_defense_date: normalizeDate,
    is_tracer_filled: normalizeFilled,
    income: normalizeCurrency,
    regional_min_wage: normalizeMinWage,
    waiting_time_lt_6: normalizeInt,
    waiting_time_gt_6: normalizeInt,
    workplace: normalizeWorkplace,
    created_at: normalizeDate,
    updated_at: normalizeDate
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error(`Proses melebihi batas waktu maksimal (${MAX_PROCESSING_TIME / 1000} detik).`)), MAX_PROCESSING_TIME)
  );
    
  let file: File | null = null;
  let formData: FormData | null = null;

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    formData = await req.formData();
    file = formData.get('file') as File;

    const mainPromise = (async() => {
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
      const successCount = await processAndUpsertInBatches(supabase, recordsToImport, 'import_tracer_studies_batch');

      return { 
        message: `${successCount} dari ${recordsToImport.length} data tracer study berhasil diimport.` 
      };
    })();
    
    const result = await Promise.race([mainPromise, timeoutPromise]);

    await supabase.from('import_logs').insert({
        import_type: 'tracer-studies',
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
          import_type: 'tracer-studies',
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