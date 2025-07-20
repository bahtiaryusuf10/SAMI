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

  const apiUrlDistribusiTingkatPublikasi = `/api/karya-dosen-terdampak/distribusi-tingkat-publikasi?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiTingkatPublikasi,
    error: errorDistribusiTingkatPublikasi,
    isLoading: isLoadingDistribusiTingkatPublikasi,
  } = useSWR(apiUrlDistribusiTingkatPublikasi, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlTrenPublikasiPerTahun = `/api/karya-dosen-terdampak/tren-publikasi-per-tahun?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTrenPublikasiPerTahun,
    error: errorTrenPublikasiPerTahun,
    isLoading: isLoadingTrenPublikasiPerTahun,
  } = useSWR(apiUrlTrenPublikasiPerTahun, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlTrenSitasiPerDosen = `/api/karya-dosen-terdampak/tren-sitasi-per-dosen?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTrenSitasiPerDosen,
    error: errorTrenSitasiPerDosen,
    isLoading: isLoadingTrenSitasiPerDosen,
  } = useSWR(apiUrlTrenSitasiPerDosen, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlTop5DosenPublikasi = `/api/karya-dosen-terdampak/top5-dosen-publikasi-per-tahun?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTop5DosenPublikasi,
    error: errorTop5DosenPublikasi,
    isLoading: isLoadingTop5DosenPublikasi,
  } = useSWR(apiUrlTop5DosenPublikasi, fetcher, {
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
    distribusiTingkatPublikasi: {
      data: resultDistribusiTingkatPublikasi?.data,
      isLoading: isLoadingDistribusiTingkatPublikasi,
      error: errorDistribusiTingkatPublikasi,
    },
    trenPublikasiPerTahun: {
      data: resultTrenPublikasiPerTahun?.data,
      isLoading: isLoadingTrenPublikasiPerTahun,
      error: errorTrenPublikasiPerTahun,
    },
    trenSitasiPerDosen: {
      data: resultTrenSitasiPerDosen?.data,
      isLoading: isLoadingTrenSitasiPerDosen,
      error: errorTrenSitasiPerDosen,
    },
    top5DosenPublikasi: {
      data: resultTop5DosenPublikasi?.data,
      isLoading: isLoadingTop5DosenPublikasi,
      error: errorTop5DosenPublikasi,
    },
  };

  return (
    <KaryaDosenTerdampakUI pageKey={pageKey} dashboardData={dashboardData} />
  );
}
