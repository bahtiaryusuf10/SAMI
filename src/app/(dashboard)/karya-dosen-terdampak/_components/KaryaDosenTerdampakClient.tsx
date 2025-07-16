'use client';

import { KaryaDosenTerdampakUI } from '@/components/dashboards/KaryaDosenTerdampakUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function KaryaDosenTerdampakClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'karya-dosen-terdampak';

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
  const apiUrlInfoAgregatKaryaDosen = `/api/karya-dosen-terdampak/info-agregat-karya-dosen-terdampak?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAgregatKaryaDosen,
    error: errorInfoAgregatKaryaDosen,
    isLoading: isLoadingInfoAgregatKaryaDosen,
  } = useSWR(apiUrlInfoAgregatKaryaDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatKaryaDosen: {
      data: resultInfoAgregatKaryaDosen?.data,
      isLoading: isLoadingInfoAgregatKaryaDosen,
      error: errorInfoAgregatKaryaDosen,
    },
  };

  return (
    <KaryaDosenTerdampakUI pageKey={pageKey} dashboardData={dashboardData} />
  );
}
