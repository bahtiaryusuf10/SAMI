'use client';

import { DosenUI } from '@/components/masters/DosenUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function DosenClient({ filter }: { filter: number | null }) {
  const pageKey = 'dosen';

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
  const apiUrlDosen = `/api/dosen/data?year=${activeReportingYear || ''}`;
  const {
    data: resultDosen,
    error: errorDosen,
    isLoading: isLoadingDosen,
  } = useSWR(apiUrlDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
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
    dedupingInterval: 900000,
  });

  const data = {
    dataDosen: {
      data: resultDosen?.data,
      isLoading: isLoadingDosen,
      error: errorDosen,
    },
    importLog: {
      data: resultImportLog?.data,
      isLoading: isLoadingImportLog,
      error: errorImportLog,
    },
  };

  return <DosenUI pageKey={pageKey} data={data} />;
}
