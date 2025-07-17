import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getPraktisiMengajarDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAgregatPraktisi,
    distribusiJabatanDosen,
    top5MataKuliah,
    distribusiPerusahaan,
    sertifikasiProfesi,

  ] = await Promise.all([
    supabase.rpc('get_practitioner_teaching_aggregated_info', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_academic_rank_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_top_courses_by_practitioners', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_practitioner_origin_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_certification_distribution_by_rank', {
      p_report_year: reportingYear,
    }),
  ]);

  if (infoAgregatPraktisi.error) {
    console.error('Error persentase:', infoAgregatPraktisi.error);
    throw new Error('Gagal mengambil data agregat praktisi mengajar');
  }
  if (distribusiJabatanDosen.error) {
    console.error('Error persentase:', distribusiJabatanDosen.error);
    throw new Error('Gagal mengambil data distribusi jabatan dosen tetap');
  }
  if (top5MataKuliah.error) {
    console.error('Error persentase:', top5MataKuliah.error);
    throw new Error('Gagal mengambil data top 5 mata kuliah');
  }
  if (distribusiPerusahaan.error) {
    console.error('Error persentase:', distribusiPerusahaan.error);
    throw new Error('Gagal mengambil data distribusi perusahaan');
  }
  if (sertifikasiProfesi.error) {
    console.error('Error persentase:', sertifikasiProfesi.error);
    throw new Error('Gagal mengambil data sertifikasi profesi');
  }

  return {
    InfoAgregatPraktisi: infoAgregatPraktisi.data,
    DistribusiJabatanDosen: distribusiJabatanDosen.data,
    Top5MataKuliah: top5MataKuliah.data,
    DistribusiPerusahaan: distribusiPerusahaan.data,
    SertifikasiProfesi: sertifikasiProfesi.data,
  };
}
