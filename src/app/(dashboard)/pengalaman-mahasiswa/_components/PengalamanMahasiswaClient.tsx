'use client';

import { PengalamanMahasiswaUI } from '@/components/dashboards/PengalamanMahasiswaUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function PengalamanMahasiswaClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'pengalaman-mahasiswa';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatMahasiswa: useApiData(
      `/api/pengalaman-mahasiswa/info-agregat-mahasiswa?year=${yearParam}`
    ),
    prestasiMahasiswa: useApiData(
      `/api/pengalaman-mahasiswa/prestasi-mahasiswa?year=${yearParam}`
    ),
    top5MitraMbkm: useApiData(
      `/api/pengalaman-mahasiswa/top5-mitra-mbkm?year=${yearParam}`
    ),
    distribusiMbkm: useApiData(
      `/api/pengalaman-mahasiswa/distribusi-mbkm?year=${yearParam}`
    ),
    korelasiPrestasiDanIpk: useApiData(
      `/api/pengalaman-mahasiswa/korelasi-prestasi-dan-ipk?year=${yearParam}`
    ),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return (
    <PengalamanMahasiswaUI pageKey={pageKey} dashboardData={dashboardData} />
  );
}
