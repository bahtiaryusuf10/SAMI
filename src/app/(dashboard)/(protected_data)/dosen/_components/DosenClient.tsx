'use client';

import { DosenUI } from '@/components/masters/DosenUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function DosenClient({ filter }: { filter: number | null }) {
  const pageKey = 'dosen';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const data = {
    dataDosen: useApiData(`/api/dosen/data?year=${yearParam}`),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return <DosenUI pageKey={pageKey} data={data} />;
}
