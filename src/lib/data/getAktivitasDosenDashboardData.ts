import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getAktivitasDosenDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAgregatAktivitasDosen,
    distribusiPersentaseAktivitasDosen,
    distribusiAktivitasDosen,
    distribusiMembinaLomba,
    sumberDanaPenelitianPkm,

  ] = await Promise.all([
    supabase.rpc('get_lecturer_activity_aggregated_info', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_percentage_activity_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_activity_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_achievement_supervisor', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_research_service_fund_comparison', {
      p_report_year: reportingYear,
    }),
  ]);

  if (infoAgregatAktivitasDosen.error) {
    console.error('Error persentase:', infoAgregatAktivitasDosen.error);
    throw new Error('Gagal mengambil data agregat aktivitas dosen');
  }
  if (distribusiPersentaseAktivitasDosen.error) {
    console.error('Error persentase:', distribusiPersentaseAktivitasDosen.error);
    throw new Error('Gagal mengambil data distribusi persentase aktivitas dosen');
  }
  if (distribusiAktivitasDosen.error) {
    console.error('Error persentase:', distribusiAktivitasDosen.error);
    throw new Error('Gagal mengambil data distribusi aktivitas dosen');
  }
  if (distribusiMembinaLomba.error) {
    console.error('Error persentase:', distribusiMembinaLomba.error);
    throw new Error('Gagal mengambil data distribusi membina lomba');
  }
  if (sumberDanaPenelitianPkm.error) {
    console.error('Error persentase:', sumberDanaPenelitianPkm.error);
    throw new Error('Gagal mengambil data sumber dana penelitian');
  }

  return {
    InfoAgregatAktivitasDosen: infoAgregatAktivitasDosen.data,
    DistribusiPersentaseAktivitasDosen: distribusiPersentaseAktivitasDosen.data,
    DistribusiAktivitasDosen: distribusiAktivitasDosen.data,
    DistribusiMembinaLomba: distribusiMembinaLomba.data,
    SumberDanaPenelitianPkm: sumberDanaPenelitianPkm.data,
  };
}
