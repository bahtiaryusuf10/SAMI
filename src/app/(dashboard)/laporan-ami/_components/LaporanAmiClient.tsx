'use client';

import { LaporanAmiUI } from '@/components/dashboards/LaporanAmiUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function LaporanAmiClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'laporan-ami';

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
  const apiUrlLaporanAmi = `/api/laporan-ami?year=${activeReportingYear || ''}`;
  const {
    data: resultLaporanAmi,
    error: errorLaporanAmi,
    isLoading: isLoadingLaporanAmi,
  } = useSWR(apiUrlLaporanAmi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
    // refreshInterval: 300000, // auto-update (re-fetch) after 5 minutes
  });

  const data = {
    infoLaporan: {
      data: resultLaporanAmi?.data,
      isLoading: isLoadingLaporanAmi,
      error: errorLaporanAmi,
    },
  };

  return <LaporanAmiUI pageKey={pageKey} data={data} />;
}
