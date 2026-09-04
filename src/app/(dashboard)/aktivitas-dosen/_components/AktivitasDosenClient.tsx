'use client';

import { AktivitasDosenUI } from '@/components/dashboards/AktivitasDosenUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function AktivitasDosenClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'aktivitas-dosen';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatAktivitasDosen: useApiData(
      `/api/aktivitas-dosen/info-agregat-aktivitas-dosen?year=${yearParam}`
    ),
    distribusiPersentaseAktivitasDosen: useApiData(
      `/api/aktivitas-dosen/distribusi-persentase-aktivitas-dosen?year=${yearParam}`
    ),
    distribusiAktivitasDosen: useApiData(
      `/api/aktivitas-dosen/distribusi-aktivitas-dosen?year=${yearParam}`
    ),
    distribusiMembinaLomba: useApiData(
      `/api/aktivitas-dosen/distribusi-membina-lomba?year=${yearParam}`
    ),
    sumberDanaPenelitianPkm: useApiData(
      `/api/aktivitas-dosen/sumber-dana-penelitian-pkm?year=${yearParam}`
    ),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return <AktivitasDosenUI pageKey={pageKey} dashboardData={dashboardData} />;
}
