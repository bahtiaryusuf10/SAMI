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
    dedupingInterval: 900000,
  });

  const apiUrlDistribusiPersentaseAktivitasDosen = `/api/aktivitas-dosen/distribusi-persentase-aktivitas-dosen?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiPersentaseAktivitasDosen,
    error: errorDistribusiPersentaseAktivitasDosen,
    isLoading: isLoadingDistribusiPersentaseAktivitasDosen,
  } = useSWR(apiUrlDistribusiPersentaseAktivitasDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
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
    dedupingInterval: 900000,
  });

  const apiUrlDistribusiMembinaLomba = `/api/aktivitas-dosen/distribusi-membina-lomba?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiMembinaLomba,
    error: errorDistribusiMembinaLomba,
    isLoading: isLoadingDistribusiMembinaLomba,
  } = useSWR(apiUrlDistribusiMembinaLomba, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlSumberDanaPenelitianPkm = `/api/aktivitas-dosen/sumber-dana-penelitian-pkm?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultSumberDanaPenelitianPkm,
    error: errorSumberDanaPenelitianPkm,
    isLoading: isLoadingSumberDanaPenelitianPkm,
  } = useSWR(apiUrlSumberDanaPenelitianPkm, fetcher, {
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
    infoAgregatAktivitasDosen: {
      data: resultInfoAgregatAktivitasDosen?.data,
      isLoading: isLoadingInfoAgregatAktivitasDosen,
      error: errorInfoAgregatAktivitasDosen,
    },
    distribusiPersentaseAktivitasDosen: {
      data: resultDistribusiPersentaseAktivitasDosen?.data,
      isLoading: isLoadingDistribusiPersentaseAktivitasDosen,
      error: errorDistribusiPersentaseAktivitasDosen,
    },
    distribusiAktivitasDosen: {
      data: resultDistribusiAktivitasDosen?.data,
      isLoading: isLoadingDistribusiAktivitasDosen,
      error: errorDistribusiAktivitasDosen,
    },
    distribusiMembinaLomba: {
      data: resultDistribusiMembinaLomba?.data,
      isLoading: isLoadingDistribusiMembinaLomba,
      error: errorDistribusiMembinaLomba,
    },
    sumberDanaPenelitianPkm: {
      data: resultSumberDanaPenelitianPkm?.data,
      isLoading: isLoadingSumberDanaPenelitianPkm,
      error: errorSumberDanaPenelitianPkm,
    },
    importLog: {
      data: resultImportLog?.data,
      isLoading: isLoadingImportLog,
      error: errorImportLog,
    },
  };

  return <AktivitasDosenUI pageKey={pageKey} dashboardData={dashboardData} />;
}
