'use client';

import { LaporanAmiUI } from '@/components/dashboards/LaporanAmiUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function LaporanAmiClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'laporan-ami';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const data = {
    infoLaporan: useApiData(`/api/laporan-ami?year=${yearParam}`),
  };

  return <LaporanAmiUI pageKey={pageKey} data={data} />;
}
