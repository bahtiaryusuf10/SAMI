import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getMainDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAgregatRingkasan,
    infoAgregatTambahan,
    detailCapaianKpi,
    distribusiCapaianKpi,
    trenSkorCapaianKpi,
  ] = await Promise.all([
    supabase.rpc('get_kpi_achievement_summary', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_additional_aggregated_main_info', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_all_kpi_details', { p_report_year: reportingYear }),
    supabase.rpc('get_kpi_bullet_chart_data', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_kpi_score_trend', {
      p_end_year: reportingYear,
    }),
  ]);

  if (infoAgregatRingkasan.error) {
    console.error('Error persentase:', infoAgregatRingkasan.error);
    throw new Error('Gagal mengambil data agregat ringkasan');
  }
  if (infoAgregatTambahan.error) throw new Error('Gagal mengambil data agregat tambahan');
  if (detailCapaianKpi.error) throw new Error('Gagal mengambil data detail capaian IKU');
  if (distribusiCapaianKpi.error) throw new Error('Gagal mengambil data distribusi capaian IKU');
  if (trenSkorCapaianKpi.error)
    throw new Error('Gagal mengambil data tren skor capaian IKU');

  return {
    InfoAgregatRingkasan: infoAgregatRingkasan.data,
    InfoAgregatTambahan: infoAgregatTambahan.data,
    DetailCapaianKpi: detailCapaianKpi.data,
    DistribusiCapaianKpi: distribusiCapaianKpi.data,
    TrenSkorCapaianKpi: trenSkorCapaianKpi.data,
  };
}
