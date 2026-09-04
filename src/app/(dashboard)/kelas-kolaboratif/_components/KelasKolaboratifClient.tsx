'use client';

import { KelasKolaboratifUI } from '@/components/dashboards/KelasKolaboratifUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function KelasKolaboratifClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'kelas-kolaboratif';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatKelasKolaboratif: useApiData(
      `/api/kelas-kolaboratif/info-agregat-kelas-kolaboratif?year=${yearParam}`
    ),
    distribusiCaseProject: useApiData(
      `/api/kelas-kolaboratif/distribusi-mata-kuliah-case-project?year=${yearParam}`
    ),
    top5DosenCaseProject: useApiData(
      `/api/kelas-kolaboratif/top5-dosen-case-project?year=${yearParam}`
    ),
    distribusiJenisMataKuliah: useApiData(
      `/api/kelas-kolaboratif/distribusi-jenis-mata-kuliah?year=${yearParam}`
    ),
    distribusiMetodeMataKuliah: useApiData(
      `/api/kelas-kolaboratif/distribusi-metode-mata-kuliah?year=${yearParam}`
    ),
  };

  return <KelasKolaboratifUI pageKey={pageKey} dashboardData={dashboardData} />;
}
