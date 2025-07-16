'use client';

import { KelasKolaboratifUI } from '@/components/dashboards/KelasKolaboratifUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function KelasKolaboratifClient() {
  const pageKey = 'kelas-kolaboratif';

  const activeReportingYear = useDashboardSettingsStore(
    (state) => state.pageSettings[pageKey]?.activeReportingYear
  );

  // Fetch Data
  const apiUrlInfoAgregatKelasKolaboratif = `/api/kelas-kolaboratif/info-agregat-kelas-kolaboratif?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAgregatKelasKolaboratif,
    error: errorInfoAgregatKelasKolaboratif,
    isLoading: isLoadingInfoAgregatKelasKolaboratif,
  } = useSWR(apiUrlInfoAgregatKelasKolaboratif, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
    // refreshInterval: 300000, // auto-update (re-fetch) after 5 minutes
  });

  const dashboardData = {
    infoAgregatKelasKolaboratif: {
      data: resultInfoAgregatKelasKolaboratif?.data,
      isLoading: isLoadingInfoAgregatKelasKolaboratif,
      error: errorInfoAgregatKelasKolaboratif,
    },
  };

  return <KelasKolaboratifUI pageKey={pageKey} dashboardData={dashboardData} />;
}
