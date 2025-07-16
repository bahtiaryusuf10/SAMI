import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getLulusanBekerjaDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const graduationYear = year;

  const [
    infoAgregatLulusan,
    lokasiResult,
    statusResult,
    waktuResult,
    penghasilanResult,
  ] = await Promise.all([
    supabase.rpc('get_graduates_aggregated_info', {
      p_graduation_year: graduationYear,
    }),
    supabase.rpc('get_work_province_distribution', {
      p_graduation_year: graduationYear,
    }),
    supabase.rpc('get_graduate_status', { p_graduation_year: graduationYear }),
    supabase.rpc('get_waiting_time_distribution', {
      p_graduation_year: graduationYear,
    }),
    supabase.rpc('get_income_distribution', {
      p_graduation_year: graduationYear,
    }),
  ]);

  if (infoAgregatLulusan.error) {
    console.error('Error persentase:', infoAgregatLulusan.error);
    throw new Error('Gagal mengambil data agregat lulusan');
  }
  if (lokasiResult.error) throw new Error('Gagal mengambil data lokasi');
  if (statusResult.error) throw new Error('Gagal mengambil data status');
  if (waktuResult.error) throw new Error('Gagal mengambil data waktu tunggu');
  if (penghasilanResult.error)
    throw new Error('Gagal mengambil data penghasilan');

  return {
    InfoAgregatLulusan: infoAgregatLulusan.data,
    LokasiBekerja: lokasiResult.data,
    StatusLulusan: statusResult.data,
    WaktuTungguBekerja: waktuResult.data,
    Penghasilan: penghasilanResult.data,
  };
}
