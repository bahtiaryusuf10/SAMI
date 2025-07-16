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

  const dashboardData = {
    infoAgregatPraktisi: {
      data: resultInfoAgregatPraktisi?.data,
      isLoading: isLoadingInfoAgregatPraktisi,
      error: errorInfoAgregatPraktisi,
    },
  };

  return <PraktisiMengajarUI pageKey={pageKey} dashboardData={dashboardData} />;
}
