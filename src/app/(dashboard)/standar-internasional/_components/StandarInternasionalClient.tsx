'use client';

import { StandarInternasionalUI } from '@/components/dashboards/StandarInternasionalUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function StandarInternasionalClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'standar-internasional';

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
  const apiUrlInfoAkreditasi = `/api/standar-internasional?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAkreditasi,
    error: errorInfoAkreditasi,
    isLoading: isLoadingInfoAkreditasi,
  } = useSWR(apiUrlInfoAkreditasi, fetcher, {
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
    infoAkreditasi: {
      data: resultInfoAkreditasi?.data,
      isLoading: isLoadingInfoAkreditasi,
      error: errorInfoAkreditasi,
    },
    importLog: {
      data: resultImportLog?.data,
      isLoading: isLoadingImportLog,
      error: errorImportLog,
    },
  };

  return (
    <StandarInternasionalUI pageKey={pageKey} dashboardData={dashboardData} />
  );
}
