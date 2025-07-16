import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getStandarInternasionalDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAkreditasi,

  ] = await Promise.all([
    supabase.rpc('get_accreditation_info', {
      p_report_year: reportingYear,
    }),
  ]);

  if (infoAkreditasi.error) {
    console.error('Error persentase:', infoAkreditasi.error);
    throw new Error('Gagal mengambil data akreditasi program studi');
  }

  return {
    InfoAkreditasi: infoAkreditasi.data,
  };
}
