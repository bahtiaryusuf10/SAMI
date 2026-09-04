'use client';

import { KaryaDosenTerdampakUI } from '@/components/dashboards/KaryaDosenTerdampakUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function KaryaDosenTerdampakClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'karya-dosen-terdampak';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatKaryaDosen: useApiData(
      `/api/karya-dosen-terdampak/info-agregat-karya-dosen-terdampak?year=${yearParam}`
    ),
    distribusiTingkatPublikasi: useApiData(
      `/api/karya-dosen-terdampak/distribusi-tingkat-publikasi?year=${yearParam}`
    ),
    trenPublikasiPerTahun: useApiData(
      `/api/karya-dosen-terdampak/tren-publikasi-per-tahun?year=${yearParam}`
    ),
    trenSitasiPerDosen: useApiData(
      `/api/karya-dosen-terdampak/tren-sitasi-per-dosen?year=${yearParam}`
    ),
    top5DosenPublikasi: useApiData(
      `/api/karya-dosen-terdampak/top5-dosen-publikasi-per-tahun?year=${yearParam}`
    ),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return (
    <KaryaDosenTerdampakUI pageKey={pageKey} dashboardData={dashboardData} />
  );
}
