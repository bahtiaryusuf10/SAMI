'use client';

import { LulusanBekerjaUI } from '@/components/dashboards/LulusanBekerjaUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function LulusanBekerjaClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'lulusan-bekerja';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatLulusan: useApiData(
      `/api/lulusan-bekerja/info-agregat-lulusan?year=${yearParam}`
    ),
    lokasiBekerja: useApiData(
      `/api/lulusan-bekerja/lokasi-bekerja?year=${yearParam}`
    ),
    statusLulusan: useApiData(
      `/api/lulusan-bekerja/status-lulusan?year=${yearParam}`
    ),
    waktuTungguBekerja: useApiData(
      `/api/lulusan-bekerja/waktu-tunggu-bekerja?year=${yearParam}`
    ),
    rentangPenghasilan: useApiData(
      `/api/lulusan-bekerja/rentang-penghasilan?year=${yearParam}`
    ),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return <LulusanBekerjaUI pageKey={pageKey} dashboardData={dashboardData} />;
}
