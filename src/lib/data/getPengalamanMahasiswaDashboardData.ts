import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getPengalamanMahasiswaDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAgregatMahasiswa,
    prestasiMahasiswa,
    top5MitraMbkm,
    distribusiMbkm,
    korelasiPrestasiDanIpk,

  ] = await Promise.all([
    supabase.rpc('get_students_aggregated_info', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_achievement_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_top5_mbkm_partners', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_mbkm_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_gpa_vs_achievement_data', {
      p_report_year: reportingYear,
    }),
  ]);

  if (infoAgregatMahasiswa.error) {
    console.error('Error persentase:', infoAgregatMahasiswa.error);
    throw new Error('Gagal mengambil data agregat mahasiswa');
  }
  if (prestasiMahasiswa.error) {
    console.error('Error persentase:', prestasiMahasiswa.error);
    throw new Error('Gagal mengambil data prestas mahasiswa');
  }
  if (top5MitraMbkm.error) {
    console.error('Error persentase:', top5MitraMbkm.error);
    throw new Error('Gagal mengambil data top 5 mitra MBKM');
  }
  if (distribusiMbkm.error) {
    console.error('Error persentase:', distribusiMbkm.error);
    throw new Error('Gagal mengambil data distribusi kategori MBKM');
  }
  if (korelasiPrestasiDanIpk.error) {
    console.error('Error persentase:', korelasiPrestasiDanIpk.error);
    throw new Error('Gagal mengambil data korelasi prestasi dan IPK');
  }

  return {
    InfoAgregatMahasiswa: infoAgregatMahasiswa.data,
    PrestasiMahasiswa: prestasiMahasiswa.data,
    Top5MitraMbkm: top5MitraMbkm.data,
    DistribusiMbkm: distribusiMbkm.data,
    KorelasiPrestasiDanIpk: korelasiPrestasiDanIpk.data,
  };
}
