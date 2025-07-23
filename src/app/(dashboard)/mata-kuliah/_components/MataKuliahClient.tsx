'use client';

import { MataKuliahUI } from '@/components/masters/MataKuliahUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function MahsiswaClient({ filter }: { filter: number | null }) {
  const pageKey = 'mata-kuliah';

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
  const apiUrlMataKuliah = `/api/mata-kuliah/data?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultMataKuliah,
    error: errorMataKuliah,
    isLoading: isLoadingMataKuliah,
  } = useSWR(apiUrlMataKuliah, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
    // refreshInterval: 300000, // auto-update (re-fetch) after 5 minutes
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

  const data = {
    dataMataKuliah: {
      data: resultMataKuliah?.data,
      isLoading: isLoadingMataKuliah,
      error: errorMataKuliah,
    },
    importLog: {
      data: resultImportLog?.data,
      isLoading: isLoadingImportLog,
      error: errorImportLog,
    },
  };

  return <MataKuliahUI pageKey={pageKey} data={data} />;
}
