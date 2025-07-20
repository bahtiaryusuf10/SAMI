import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function getKelasKolaboratifDashboardData(year: number | null) {
  const supabase = await createSupabaseServerClient();

  const reportingYear = year;

  const [
    infoAgregatKelasKolaboratif,
    distribusiCaseProject,
    top5DosenCaseProject,
    distribusiJenisMataKuliah,
    distribusiMetodeMataKuliah,
  ] = await Promise.all([
    supabase.rpc('get_course_aggregated_info', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_case_method_courses_by_semester', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_top_lecturers_by_case_method_courses', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_course_type_distribution', {
      p_report_year: reportingYear,
    }),
    supabase.rpc('get_learning_method_composition', {
      p_report_year: reportingYear,
    }),
  ]);

  if (infoAgregatKelasKolaboratif.error) {
    console.error('Error persentase:', infoAgregatKelasKolaboratif.error);
    throw new Error('Gagal mengambil data agregat karya dosen terdampak');
  }
  if (distribusiCaseProject.error) {
    console.error('Error persentase:', distribusiCaseProject.error);
    throw new Error('Gagal mengambil data distribusi tingkat publikasi');
  }
  if (top5DosenCaseProject.error) {
    console.error('Error persentase:', top5DosenCaseProject.error);
    throw new Error('Gagal mengambil data tren publikasi per tahun');
  }
  if (distribusiJenisMataKuliah.error) {
    console.error('Error persentase:', distribusiJenisMataKuliah.error);
    throw new Error('Gagal mengambil data tren sitasi per dosen');
  }
  if (distribusiMetodeMataKuliah.error) {
    console.error('Error persentase:', distribusiMetodeMataKuliah.error);
    throw new Error('Gagal mengambil data tren sitasi per dosen');
  }

  return {
    InfoAgregatKelasKolaboratif: infoAgregatKelasKolaboratif.data,
    DistribusiCaseProject: distribusiCaseProject.data,
    Top5DosenCaseProject: top5DosenCaseProject.data,
    DistribusiJenisMataKuliah: distribusiJenisMataKuliah.data,
    DistribusiMetodeMataKuliah: distribusiMetodeMataKuliah.data,
  };
}
