'use client';

import { MainDashboardUI } from '@/components/dashboards/MainDashboardUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function MainDashboardClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'main-dashboard';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatRingkasan: useApiData(
      `/api/main-dashboard/info-agregat-ringkasan?year=${yearParam}`
    ),
    infoAgregatTambahan: useApiData(
      `/api/main-dashboard/info-agregat-tambahan?year=${yearParam}`
    ),
    detailCapaianKpi: useApiData(
      `/api/main-dashboard/detail-capaian-kpi?year=${yearParam}`
    ),
    distribusiCapaianKpi: useApiData(
      `/api/main-dashboard/distribusi-capaian-kpi?year=${yearParam}`
    ),
    trenSkorCapaianKpi: useApiData(
      `/api/main-dashboard/tren-skor-capaian-kpi?year=${yearParam}`
    ),
  };

  return <MainDashboardUI pageKey={pageKey} dashboardData={dashboardData} />;
}
