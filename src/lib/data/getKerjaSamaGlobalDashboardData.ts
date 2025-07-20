import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getKerjaSamaGlobalDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAgregatKerjaSama,
    trenKerjaSamaPerTahun,
    distribusiStatusKerjaSama,
    distribusiTingkatKerjaSama,
    distribusiJenisMitra,
  ] = await Promise.all([
    supabase.rpc('get_cooperation_aggregated_info'),
    supabase.rpc('get_cooperation_trend', {
      p_start_year: reportingYear ? reportingYear - 2 : null,
      p_end_year: reportingYear ? reportingYear : null,
    }),
    supabase.rpc('get_cooperation_status_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_cooperation_level_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_cooperation_by_partner_type', {
      p_report_year: reportingYear,
    }),
  ]);

  if (infoAgregatKerjaSama.error) {
    console.error('Error persentase:', infoAgregatKerjaSama.error);
    throw new Error('Gagal mengambil data agregat karya dosen terdampak');
  }
  if (trenKerjaSamaPerTahun.error) {
    console.error('Error persentase:', trenKerjaSamaPerTahun.error);
    throw new Error('Gagal mengambil data distribusi tingkat publikasi');
  }
  if (distribusiStatusKerjaSama.error) {
    console.error('Error persentase:', distribusiStatusKerjaSama.error);
    throw new Error('Gagal mengambil data tren publikasi per tahun');
  }
  if (distribusiTingkatKerjaSama.error) {
    console.error('Error persentase:', distribusiTingkatKerjaSama.error);
    throw new Error('Gagal mengambil data tren sitasi per dosen');
  }
  if (distribusiJenisMitra.error) {
    console.error('Error persentase:', distribusiJenisMitra.error);
    throw new Error('Gagal mengambil data tren sitasi per dosen');
  }

  return {
    InfoAgregatKerjaSama: infoAgregatKerjaSama.data,
    TrenKerjaSamaPerTahun: trenKerjaSamaPerTahun.data,
    DistribusiStatusKerjaSama: distribusiStatusKerjaSama.data,
    DistribusiTingkatKerjaSama: distribusiTingkatKerjaSama.data,
    DistribusiJenisMitra: distribusiJenisMitra.data,
  };
}
