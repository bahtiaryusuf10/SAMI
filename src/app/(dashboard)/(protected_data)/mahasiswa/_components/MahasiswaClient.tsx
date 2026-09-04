'use client';

import { MahasiswaUI } from '@/components/masters/MahasiswaUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function MahsiswaClient({ filter }: { filter: number | null }) {
  const pageKey = 'mahasiswa';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const data = {
    dataMahasiswa: useApiData(`/api/mahasiswa/data?year=${yearParam}`),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return <MahasiswaUI pageKey={pageKey} data={data} />;
}
