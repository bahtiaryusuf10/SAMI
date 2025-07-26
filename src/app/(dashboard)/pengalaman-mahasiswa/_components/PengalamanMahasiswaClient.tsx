'use client';

import useSWR from 'swr';
import { PengalamanMahasiswaUI } from '@/components/dashboards/PengalamanMahasiswaUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function PengalamanMahasiswaClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'pengalaman-mahasiswa';

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
  const apiUrlInfoAgregatMahasiswa = `/api/pengalaman-mahasiswa/info-agregat-mahasiswa?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAgregatMahasiswa,
    error: errorInfoAgregatMahasiswa,
    isLoading: isLoadingInfoAgregatMahasiswa,
  } = useSWR(apiUrlInfoAgregatMahasiswa, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlPrestasiMahasiswa = `/api/pengalaman-mahasiswa/prestasi-mahasiswa?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultPrestasiMahasiswa,
    error: errorPrestasiMahasiswa,
    isLoading: isLoadingPrestasiMahasiswa,
  } = useSWR(apiUrlPrestasiMahasiswa, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlTop5MitraMbkm = `/api/pengalaman-mahasiswa/top5-mitra-mbkm?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTop5MitraMbkm,
    error: errorTop5MitraMbkm,
    isLoading: isLoadingTop5MitraMbkm,
  } = useSWR(apiUrlTop5MitraMbkm, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlDistribusiMbkm = `/api/pengalaman-mahasiswa/distribusi-mbkm?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiMbkm,
    error: errorDistribusiMbkm,
    isLoading: isLoadingDistribusiMbkm,
  } = useSWR(apiUrlDistribusiMbkm, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlKorelasiPrestasiDanIpk = `/api/pengalaman-mahasiswa/korelasi-prestasi-dan-ipk?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultKorelasiPrestasiDanIpk,
    error: errorKorelasiPrestasiDanIpk,
    isLoading: isLoadingKorelasiPrestasiDanIpk,
  } = useSWR(apiUrlKorelasiPrestasiDanIpk, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlImportLog = `/api/import-logs/links-for-page?year=${
    activeReportingYear || ''
  }&page=${pageKey}`;
  const {
    data: resultImportLog,
    error: errorImportLog,
    isLoading: isLoadingImportLog,
  } = useSWR(apiUrlImportLog, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const dashboardData = {
    infoAgregatMahasiswa: {
      data: resultInfoAgregatMahasiswa?.data,
      isLoading: isLoadingInfoAgregatMahasiswa,
      error: errorInfoAgregatMahasiswa,
    },
    prestasiMahasiswa: {
      data: resultPrestasiMahasiswa?.data,
      isLoading: isLoadingPrestasiMahasiswa,
      error: errorPrestasiMahasiswa,
    },
    top5MitraMbkm: {
      data: resultTop5MitraMbkm?.data,
      isLoading: isLoadingTop5MitraMbkm,
      error: errorTop5MitraMbkm,
    },
    distribusiMbkm: {
      data: resultDistribusiMbkm?.data,
      isLoading: isLoadingDistribusiMbkm,
      error: errorDistribusiMbkm,
    },
    korelasiPrestasiDanIpk: {
      data: resultKorelasiPrestasiDanIpk?.data,
      isLoading: isLoadingKorelasiPrestasiDanIpk,
      error: errorKorelasiPrestasiDanIpk,
    },
    importLog: {
      data: resultImportLog?.data,
      isLoading: isLoadingImportLog,
      error: errorImportLog,
    },
  };

  return (
    <PengalamanMahasiswaUI pageKey={pageKey} dashboardData={dashboardData} />
  );
}
