import { parse } from "https://deno.land/std@0.224.0/csv/mod.ts";
import * as xlsx from 'https://esm.sh/xlsx';
import { normalizeHeaders } from './transform.ts';

// Fungsi untuk memetakan dan mentransformasi satu baris data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapAndTransformRow(row: Record<string, any>, columnConfig: any): Record<string, any> {
  const mapped = {};
  
  for (const [fileKey, dbField] of Object.entries(columnConfig.mappings)) {
    const rawValue = row[fileKey];

    if (rawValue !== undefined) {
      const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
      const transformFn = columnConfig.transforms[dbField];
      mapped[dbField] = transformFn ? transformFn(value) : value;
    }
  }

  return mapped;
}

// Fungsi untuk mem-parse file (CSV atau XLSX)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parseFile(file: File): Promise<Record<string, any>[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let dataRowsAsObjects: Record<string, any>[] = [];

  if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
    const content = await file.text();
    const lines = content.replace(/\r\n/g, '\n').trim().split('\n');
    
    if (lines.length < 2) {
      throw new Error("File CSV harus memiliki setidaknya satu baris header dan satu baris data.");
    }

    const headerLine = lines[0];
    const headers = parse(headerLine)[0];
    const dataContent = lines.slice(1).join('\n');
    
    dataRowsAsObjects = parse(dataContent, {
      columns: headers
    });
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(new Uint8Array(buffer), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    dataRowsAsObjects = xlsx.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });
  } else {
    throw new Error("Format file tidak didukung. Harap gunakan .csv atau .xlsx");
  }

  return normalizeHeaders(dataRowsAsObjects);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parseMultiSheetFile(file: File, sheetNames: string[]): Promise<Record<string, any>[]> {
  if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx'))) {
    throw new Error("Fungsi ini hanya mendukung file .xlsx untuk format multi-tab.");
  }

  const buffer = await file.arrayBuffer();
  const workbook = xlsx.read(new Uint8Array(buffer), { type: 'array' });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allRows: Record<string, any>[] = [];

  for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet) {
      const sheetRows = xlsx.utils.sheet_to_json(worksheet, { raw: false, dateNF: 'yyyy-mm-dd' });
      
      const typedRows = sheetRows.map(row => ({
        ...row,
        'Tipe': sheetName // Tipe tabs: 'Penelitian' atau 'Pengabdian'
      }));
      
      allRows = [...allRows, ...typedRows];
    } else {
      console.warn(`Tab bernama "${sheetName}" tidak ditemukan di dalam file.`);
    }
  }

  return normalizeHeaders(allRows);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function processAndUpsertInBatches(supabase: SupabaseClient, records: Record<string, any>[], rpc: string, year?: number) {
  const BATCH_SIZE = 100;
  let totalSuccess = 0;
  let recordsBatch = [];
  
  // Upsert untuk memasukkan data baru atau memperbarui data lama jika ada konflik pada 'student_id'
  for (let i = 0; i < records.length; i++) {
    recordsBatch.push(records[i]);
    
    // Jika batch sudah penuh atau ini adalah iterasi terakhir
    if (recordsBatch.length === BATCH_SIZE || i === records.length - 1) {
      console.log(`--- Memproses Batch yang Dimulai dari Baris ${i - recordsBatch.length + 2} ---`);
      console.log(JSON.stringify(recordsBatch, null, 2)); 
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { p_records: recordsBatch };
      if (year !== undefined) payload.p_year = year;

      const { data, error } = await supabase.rpc(rpc, payload);

      if (error) {
        // Jika terjadi error pada satu batch, lemparkan error untuk menghentikan proses
        console.error(`Error pada batch yang dimulai dari baris ${i - recordsBatch.length + 2}:`, error);
        throw new Error(`Gagal memproses batch. Error: ${error.message}`);
      }
      // Kosongkan batch untuk iterasi selanjutnya
      totalSuccess += typeof data === 'number' ? data : 0;
      recordsBatch = [];
    }
  }

  return totalSuccess;
}