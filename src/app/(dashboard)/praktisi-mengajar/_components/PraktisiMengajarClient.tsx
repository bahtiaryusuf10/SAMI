'use client';

import { PraktisiMengajarUI } from '@/components/dashboards/PraktisiMengajarUI';
import { useReportingYearFilter } from '@/hooks/useReportingYearFilter';
import { useApiData } from '@/hooks/useApiData';

export default function PraktisiMengajarClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'praktisi-mengajar';
  const activeReportingYear = useReportingYearFilter(pageKey, filter);
  const yearParam = activeReportingYear || '';

  const dashboardData = {
    infoAgregatPraktisi: useApiData(
      `/api/praktisi-mengajar/info-agregat-praktisi-mengajar?year=${yearParam}`
    ),
    distribusiJabatanDosen: useApiData(
      `/api/praktisi-mengajar/distribusi-jabatan-dosen?year=${yearParam}`
    ),
    top5MataKuliah: useApiData(
      `/api/praktisi-mengajar/top5-mata-kuliah-praktisi-mengajar?year=${yearParam}`
    ),
    distribusiPerusahaan: useApiData(
      `/api/praktisi-mengajar/distribusi-perusahaan-praktisi-mengajar?year=${yearParam}`
    ),
    sertifikasiProfesi: useApiData(
      `/api/praktisi-mengajar/sertifikasi-profesi-dosen-tetap?year=${yearParam}`
    ),
    importLog: useApiData(
      `/api/import-logs/links-for-page?year=${yearParam}&page=${pageKey}`
    ),
  };

  return <PraktisiMengajarUI pageKey={pageKey} dashboardData={dashboardData} />;
}
