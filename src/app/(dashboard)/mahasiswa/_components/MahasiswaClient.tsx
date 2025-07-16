'use client';

import { MahasiswaUI } from '@/components/masters/MahasiswaUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function MahsiswaClient({ filter }: { filter: number | null }) {
  const pageKey = 'mahasiswa';

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
  const apiUrlMahasiswa = `/api/mahasiswa/data?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultMahasiswa,
    error: errorMahasiswa,
    isLoading: isLoadingMahasiswa,
  } = useSWR(apiUrlMahasiswa, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
    // refreshInterval: 300000, // auto-update (re-fetch) after 5 minutes
  });

  const data = {
    dataMahasiswa: {
      data: resultMahasiswa?.data,
      isLoading: isLoadingMahasiswa,
      error: errorMahasiswa,
    },
  };

  return <MahasiswaUI pageKey={pageKey} data={data} />;
}
