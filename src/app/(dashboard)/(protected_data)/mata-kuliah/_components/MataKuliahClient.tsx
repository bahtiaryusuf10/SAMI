'use client';

import { MataKuliahUI } from '@/components/masters/MataKuliahUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function MahsiswaClient({ filter }: { filter: number | null }) {
  const pageKey = 'mata-kuliah';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const data = {
    dataMataKuliah: useApiData(`/api/mata-kuliah/data?year=${yearParam}`),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return <MataKuliahUI pageKey={pageKey} data={data} />;
}
