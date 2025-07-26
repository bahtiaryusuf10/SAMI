'use client';

import useSWR from 'swr';
import { LulusanBekerjaUI } from '@/components/dashboards/LulusanBekerjaUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function LulusanBekerjaClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'lulusan-bekerja';

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
    dedupingInterval: 900000, // 15 minutes
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
    dedupingInterval: 900000,
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
    dedupingInterval: 900000,
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
    dedupingInterval: 900000,
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
    importLog: {
      data: resultImportLog?.data,
      isLoading: isLoadingImportLog,
      error: errorImportLog,
    },
  };

  return <LulusanBekerjaUI pageKey={pageKey} dashboardData={dashboardData} />;
}
