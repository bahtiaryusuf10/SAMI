import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getKaryaDosenTerdampakDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAgregatKaryaDosen,
    distribusiTingkatPublikasi,
    trenPublikasiPerTahun,
    trenSitasiPerDosen,
    top5DosenPublikasi,
  ] = await Promise.all([
    supabase.rpc('get_impacted_publication_aggregated_info', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_publication_level_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_publication_trend_by_level', {
      p_start_year: reportingYear ? reportingYear - 2 : null,
      p_end_year: reportingYear ? reportingYear : null,
    }),
    supabase.rpc('get_top_lecturer_citation_trend', {
      p_start_year: reportingYear ? reportingYear - 2 : null,
      p_end_year: reportingYear ? reportingYear : null,
    }),
    supabase.rpc('get_top_lecturer_publication_by_year', {
      p_start_year: reportingYear ? reportingYear - 2 : null,
      p_end_year: reportingYear ? reportingYear : null,
    }),
  ]);

  if (infoAgregatKaryaDosen.error) {
    console.error('Error persentase:', infoAgregatKaryaDosen.error);
    throw new Error('Gagal mengambil data agregat karya dosen terdampak');
  }
  if (distribusiTingkatPublikasi.error) {
    console.error('Error persentase:', distribusiTingkatPublikasi.error);
    throw new Error('Gagal mengambil data distribusi tingkat publikasi');
  }
  if (trenPublikasiPerTahun.error) {
    console.error('Error persentase:', trenPublikasiPerTahun.error);
    throw new Error('Gagal mengambil data tren publikasi per tahun');
  }
  if (trenSitasiPerDosen.error) {
    console.error('Error persentase:', trenSitasiPerDosen.error);
    throw new Error('Gagal mengambil data tren sitasi per dosen');
  }
  if (top5DosenPublikasi.error) {
    console.error('Error persentase:', top5DosenPublikasi.error);
    throw new Error('Gagal mengambil data tren sitasi per dosen');
  }

  return {
    InfoAgregatKaryaDosen: infoAgregatKaryaDosen.data,
    DistribusiTingkatPublikasi: distribusiTingkatPublikasi.data,
    TrenPublikasiPerTahun: trenPublikasiPerTahun.data,
    TrenSitasiPerDosen: trenSitasiPerDosen.data,
    Top5DosenPublikasi: top5DosenPublikasi.data,
  };
}
