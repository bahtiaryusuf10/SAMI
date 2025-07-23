'use client';

import useSWR from 'swr';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import { HomePageUI } from '@/components/dashboards/HomePageUI';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function HomePageClient({ filter }: { filter: number | null }) {
  const pageKey = 'home-page';

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
  const apiUrlAgregatRingkasan = `/api/home-page/info-agregat-ringkasan?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultAgregatRingkasan,
    error: errorAgregatRingkasan,
    isLoading: isLoadingAgregatRingkasan,
  } = useSWR(apiUrlAgregatRingkasan, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
    // refreshInterval: 300000, // auto-update (re-fetch) after 5 minutes
  });

  const apiUrlInfoAgregatTambahan = `/api/home-page/info-agregat-tambahan?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAgregatTambahan,
    error: errorInfoAgregatTambahan,
    isLoading: isLoadingInfoAgregatTambahan,
  } = useSWR(apiUrlInfoAgregatTambahan, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDetailCapaianKpi = `/api/home-page/detail-capaian-kpi?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDetailCapaianKpi,
    error: errorDetailCapaianKpi,
    isLoading: isLoadingDetailCapaianKpi,
  } = useSWR(apiUrlDetailCapaianKpi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiCapaianKpi = `/api/home-page/distribusi-capaian-kpi?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiCapaianKpi,
    error: errorDistribusiCapaianKpi,
    isLoading: isLoadingDistribusiCapaianKpi,
  } = useSWR(apiUrlDistribusiCapaianKpi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlTrenSkorCapaianKpi = `/api/home-page/tren-skor-capaian-kpi?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTrenSkorCapaianKpi,
    error: errorTrenSkorCapaianKpi,
    isLoading: isLoadingTrenSkorCapaianKpi,
  } = useSWR(apiUrlTrenSkorCapaianKpi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatRingkasan: {
      data: resultAgregatRingkasan?.data,
      isLoading: isLoadingAgregatRingkasan,
      error: errorAgregatRingkasan,
    },
    infoAgregatTambahan: {
      data: resultInfoAgregatTambahan?.data,
      isLoading: isLoadingInfoAgregatTambahan,
      error: errorInfoAgregatTambahan,
    },
    detailCapaianKpi: {
      data: resultDetailCapaianKpi?.data,
      isLoading: isLoadingDetailCapaianKpi,
      error: errorDetailCapaianKpi,
    },
    distribusiCapaianKpi: {
      data: resultDistribusiCapaianKpi?.data,
      isLoading: isLoadingDistribusiCapaianKpi,
      error: errorDistribusiCapaianKpi,
    },
    trenSkorCapaianKpi: {
      data: resultTrenSkorCapaianKpi?.data,
      isLoading: isLoadingTrenSkorCapaianKpi,
      error: errorTrenSkorCapaianKpi,
    },
  };

  return <HomePageUI pageKey={pageKey} dashboardData={dashboardData} />;
}
