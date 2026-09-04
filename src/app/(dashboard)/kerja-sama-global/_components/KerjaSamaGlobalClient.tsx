'use client';

import { KerjaSamaGlobalUI } from '@/components/dashboards/KerjaSamaGlobalUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function KerjaSamaGlobalClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'kerja-sama-global';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatKerjaSama: useApiData(
      `/api/kerja-sama-global/info-agregat-kerja-sama`
    ),
    trenKerjaSamaPerTahun: useApiData(
      `/api/kerja-sama-global/tren-kerja-sama-per-tahun?year=${yearParam}`
    ),
    distribusiStatusKerjaSama: useApiData(
      `/api/kerja-sama-global/distribusi-status-kerja-sama?year=${yearParam}`
    ),
    distribusiTingkatKerjaSama: useApiData(
      `/api/kerja-sama-global/distribusi-tingkat-kerja-sama?year=${yearParam}`
    ),
    distribusiJenisMitra: useApiData(
      `/api/kerja-sama-global/distribusi-jenis-mitra?year=${yearParam}`
    ),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return <KerjaSamaGlobalUI pageKey={pageKey} dashboardData={dashboardData} />;
}
