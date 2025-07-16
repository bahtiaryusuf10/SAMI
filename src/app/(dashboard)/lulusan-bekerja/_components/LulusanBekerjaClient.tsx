'use client';

import useSWR from 'swr';
import { LulusanBekerjaUI } from '@/components/dashboards/LulusanBekerjaUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function LulusanBekerjaClient() {
  const pageKey = 'lulusan-bekerja';

  const activeReportingYear = useDashboardSettingsStore(
    (state) => state.pageSettings[pageKey]?.activeReportingYear
  );

  // Fetch Data
  const apiUrlInfoAgregatLulusan = `/api/lulusan-bekerja/info-agregat-lulusan?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultInfoAgregatLulusan,
    error: errorInfoAgregatLulusan,
    isLoading: isLoadingInfoAgregatLulusan,
  } = useSWR(apiUrlInfoAgregatLulusan, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
    // refreshInterval: 300000, // auto-update (re-fetch) after 5 minutes
  });

  const apiUrlLokasiBekerja = `/api/lulusan-bekerja/lokasi-bekerja?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultLokasiBekerja,
    error: errorLokasiBekerja,
    isLoading: isLoadingLokasiBekerja,
  } = useSWR(apiUrlLokasiBekerja, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlStatusLulusan = `/api/lulusan-bekerja/status-lulusan?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultStatusLulusan,
    error: errorStatusLulusan,
    isLoading: isLoadingStatusLulusan,
  } = useSWR(apiUrlStatusLulusan, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlWaktuTungguBekerja = `/api/lulusan-bekerja/waktu-tunggu-bekerja?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultWaktuTungguBekerja,
    error: errorWaktuTungguBekerja,
    isLoading: isLoadingWaktuTungguBekerja,
  } = useSWR(apiUrlWaktuTungguBekerja, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlPenghasilan = `/api/lulusan-bekerja/rentang-penghasilan?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultPenghasilan,
    error: errorPenghasilan,
    isLoading: isLoadingPenghasilan,
  } = useSWR(apiUrlPenghasilan, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatLulusan: {
      data: resultInfoAgregatLulusan?.data,
      isLoading: isLoadingInfoAgregatLulusan,
      error: errorInfoAgregatLulusan,
    },
    lokasiBekerja: {
      data: resultLokasiBekerja?.data,
      isLoading: isLoadingLokasiBekerja,
      error: errorLokasiBekerja,
    },
    statusLulusan: {
      data: resultStatusLulusan?.data,
      isLoading: isLoadingStatusLulusan,
      error: errorStatusLulusan,
    },
    waktuTungguBekerja: {
      data: resultWaktuTungguBekerja?.data,
      isLoading: isLoadingWaktuTungguBekerja,
      error: errorWaktuTungguBekerja,
    },
    rentangPenghasilan: {
      data: resultPenghasilan?.data,
      isLoading: isLoadingPenghasilan,
      error: errorPenghasilan,
    },
  };

  return <LulusanBekerjaUI pageKey={pageKey} dashboardData={dashboardData} />;
}
