'use client';

import { StandarInternasionalUI } from '@/components/dashboards/StandarInternasionalUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function StandarInternasionalClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'standar-internasional';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAkreditasi: useApiData(
      `/api/standar-internasional?year=${yearParam}`
    ),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return (
    <StandarInternasionalUI pageKey={pageKey} dashboardData={dashboardData} />
  );
}
