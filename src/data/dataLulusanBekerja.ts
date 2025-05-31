import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const supabase = createSupabaseBrowserClient();

export async function getKpiLulusanData() {
  const { data, error } = await supabase.from('kpi_lulusan').select();

  if (error) throw new Error(error.message);
  return data;
}

export async function getStatusLulusanData() {
  const { data, error } = await supabase.rpc('get_status_lulusan');

  if (error) throw new Error(error.message);
  return data;
}

export async function getJenisPekerjaanByStatus(status: string) {
  const { data, error } = await supabase.rpc('get_jenis_pekerjaan_by_status', {
    status_val: status,
  });

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data?.map((item: any) => ({
    id: item.jenis_pekerjaan,
    label: item.jenis_pekerjaan,
    value: item.jumlah,
  }));
}

export interface DetailLulusan {
  tahun: number;
  nama: string;
  jenis_pekerjaan: string;
  sesuai_bidang: string;
  waktu_tunggu: number;
  gaji: number;
  status_bekerja: string;
}
