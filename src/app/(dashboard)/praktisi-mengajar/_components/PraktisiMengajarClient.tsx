'use client';

import { PraktisiMengajarUI } from '@/components/dashboards/PraktisiMengajarUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function PraktisiMengajarClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'praktisi-mengajar';

  // Set default filter
  const activeReportingYear = useDashboardSettingsStore(
    (state) => state.pageSettings[pageKey]?.activeReportingYear
  );

  const setActiveYear = useDashboardSettingsStore(
    (state) => state.setActiveReportingYear
  );

  useEffect(() => {
    if (activeReportingYear === undefined && filter !== null) {
      setActiveYear(pageKey, filter);
    }
  }, [filter, activeReportingYear, setActiveYear, pageKey]);

  // Fetch Data
  const apiUrlInfoAgregatPraktisi = `/api/praktisi-mengajar/info-agregat-praktisi-mengajar?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAgregatPraktisi,
    error: errorInfoAgregatPraktisi,
    isLoading: isLoadingInfoAgregatPraktisi,
  } = useSWR(apiUrlInfoAgregatPraktisi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiJabatanDosen = `/api/praktisi-mengajar/distribusi-jabatan-dosen?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiJabatanDosen,
    error: errorDistribusiJabatanDosen,
    isLoading: isLoadingDistribusiJabatanDosen,
  } = useSWR(apiUrlDistribusiJabatanDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlTop5MataKuliah = `/api/praktisi-mengajar/top5-mata-kuliah-praktisi-mengajar?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTop5MataKuliah,
    error: errorTop5MataKuliah,
    isLoading: isLoadingTop5MataKuliah,
  } = useSWR(apiUrlTop5MataKuliah, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiPerusahaan = `/api/praktisi-mengajar/distribusi-perusahaan-praktisi-mengajar?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiPerusahaan,
    error: errorDistribusiPerusahaan,
    isLoading: isLoadingDistribusiPerusahaan,
  } = useSWR(apiUrlDistribusiPerusahaan, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlSertifikasiProfesi = `/api/praktisi-mengajar/sertifikasi-profesi-dosen-tetap?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultSertifikasiProfesi,
    error: errorSertifikasiProfesi,
    isLoading: isLoadingSertifikasiProfesi,
  } = useSWR(apiUrlSertifikasiProfesi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatPraktisi: {
      data: resultInfoAgregatPraktisi?.data,
      isLoading: isLoadingInfoAgregatPraktisi,
      error: errorInfoAgregatPraktisi,
    },
    distribusiJabatanDosen: {
      data: resultDistribusiJabatanDosen?.data,
      isLoading: isLoadingDistribusiJabatanDosen,
      error: errorDistribusiJabatanDosen,
    },
    top5MataKuliah: {
      data: resultTop5MataKuliah?.data,
      isLoading: isLoadingTop5MataKuliah,
      error: errorTop5MataKuliah,
    },
    distribusiPerusahaan: {
      data: resultDistribusiPerusahaan?.data,
      isLoading: isLoadingDistribusiPerusahaan,
      error: errorDistribusiPerusahaan,
    },
    sertifikasiProfesi: {
      data: resultSertifikasiProfesi?.data,
      isLoading: isLoadingSertifikasiProfesi,
      error: errorSertifikasiProfesi,
    },
  };

  return <PraktisiMengajarUI pageKey={pageKey} dashboardData={dashboardData} />;
}
