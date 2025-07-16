'use client';

import { AktivitasDosenUI } from '@/components/dashboards/AktivitasDosenUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function AktivitasDosenClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'aktivitas-dosen';

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
  const apiUrlInfoAgregatAktivitasDosen = `/api/aktivitas-dosen/info-agregat-aktivitas-dosen?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAgregatAktivitasDosen,
    error: errorInfoAgregatAktivitasDosen,
    isLoading: isLoadingInfoAgregatAktivitasDosen,
  } = useSWR(apiUrlInfoAgregatAktivitasDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiAktivitasDosen = `/api/aktivitas-dosen/distribusi-aktivitas-dosen?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiAktivitasDosen,
    error: errorDistribusiAktivitasDosen,
    isLoading: isLoadingDistribusiAktivitasDosen,
  } = useSWR(apiUrlDistribusiAktivitasDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiAktivitasMengajarDosen = `/api/aktivitas-dosen/distribusi-aktivitas-mengajar-dosen?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiAktivitasMengajarDosen,
    error: errorDistribusiAktivitasMengajarDosen,
    isLoading: isLoadingDistribusiAktivitasMengajarDosen,
  } = useSWR(apiUrlDistribusiAktivitasMengajarDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatAktivitasDosen: {
      data: resultInfoAgregatAktivitasDosen?.data,
      isLoading: isLoadingInfoAgregatAktivitasDosen,
      error: errorInfoAgregatAktivitasDosen,
    },
    distribusiAktivitasDosen: {
      data: resultDistribusiAktivitasDosen?.data,
      isLoading: isLoadingDistribusiAktivitasDosen,
      error: errorDistribusiAktivitasDosen,
    },
    distribusiAktivitasMengajarDosen: {
      data: resultDistribusiAktivitasMengajarDosen?.data,
      isLoading: isLoadingDistribusiAktivitasMengajarDosen,
      error: errorDistribusiAktivitasMengajarDosen,
    },
  };

  return <AktivitasDosenUI pageKey={pageKey} dashboardData={dashboardData} />;
}
