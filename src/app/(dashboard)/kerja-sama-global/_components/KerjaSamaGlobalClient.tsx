'use client';

import { KerjaSamaGlobalUI } from '@/components/dashboards/KerjaSamaGlobalUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function KerjaSamaGlobalClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'kerja-sama-global';

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
  const apiUrlInfoAgregatKerjaSama = `/api/kerja-sama-global/info-agregat-kerja-sama`;
  const {
    data: resultInfoAgregatKerjaSama,
    error: errorInfoAgregatKerjaSama,
    isLoading: isLoadingInfoAgregatKerjaSama,
  } = useSWR(apiUrlInfoAgregatKerjaSama, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlTrenKerjaSamaPerTahun = `/api/kerja-sama-global/tren-kerja-sama-per-tahun?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTrenKerjaSamaPerTahun,
    error: errorTrenKerjaSamaPerTahun,
    isLoading: isLoadingTrenKerjaSamaPerTahun,
  } = useSWR(apiUrlTrenKerjaSamaPerTahun, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiStatusKerjaSama = `/api/kerja-sama-global/distribusi-status-kerja-sama?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiStatusKerjaSama,
    error: errorDistribusiStatusKerjaSama,
    isLoading: isLoadingDistribusiStatusKerjaSama,
  } = useSWR(apiUrlDistribusiStatusKerjaSama, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiTingkatKerjaSama = `/api/kerja-sama-global/distribusi-tingkat-kerja-sama?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiTingkatKerjaSama,
    error: errorDistribusiTingkatKerjaSama,
    isLoading: isLoadingDistribusiTingkatKerjaSama,
  } = useSWR(apiUrlDistribusiTingkatKerjaSama, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiJenisMitra = `/api/kerja-sama-global/distribusi-jenis-mitra?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiJenisMitra,
    error: errorDistribusiJenisMitra,
    isLoading: isLoadingDistribusiJenisMitra,
  } = useSWR(apiUrlDistribusiJenisMitra, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
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
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatKerjaSama: {
      data: resultInfoAgregatKerjaSama?.data,
      isLoading: isLoadingInfoAgregatKerjaSama,
      error: errorInfoAgregatKerjaSama,
    },
    trenKerjaSamaPerTahun: {
      data: resultTrenKerjaSamaPerTahun?.data,
      isLoading: isLoadingTrenKerjaSamaPerTahun,
      error: errorTrenKerjaSamaPerTahun,
    },
    distribusiStatusKerjaSama: {
      data: resultDistribusiStatusKerjaSama?.data,
      isLoading: isLoadingDistribusiStatusKerjaSama,
      error: errorDistribusiStatusKerjaSama,
    },
    distribusiTingkatKerjaSama: {
      data: resultDistribusiTingkatKerjaSama?.data,
      isLoading: isLoadingDistribusiTingkatKerjaSama,
      error: errorDistribusiTingkatKerjaSama,
    },
    distribusiJenisMitra: {
      data: resultDistribusiJenisMitra?.data,
      isLoading: isLoadingDistribusiJenisMitra,
      error: errorDistribusiJenisMitra,
    },
    importLog: {
      data: resultImportLog?.data,
      isLoading: isLoadingImportLog,
      error: errorImportLog,
    },
  };

  return <KerjaSamaGlobalUI pageKey={pageKey} dashboardData={dashboardData} />;
}
