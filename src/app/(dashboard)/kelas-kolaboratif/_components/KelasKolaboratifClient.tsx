'use client';

import { KelasKolaboratifUI } from '@/components/dashboards/KelasKolaboratifUI';
import { useDashboardSettingsStore } from '@/stores/dashboardSettings';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function KelasKolaboratifClient({
  filter,
}: {
  filter: number | null;
}) {
  const pageKey = 'kelas-kolaboratif';

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

  const apiUrlDistribusiCaseProject = `/api/kelas-kolaboratif/distribusi-mata-kuliah-case-project?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiCaseProject,
    error: errorDistribusiCaseProject,
    isLoading: isLoadingDistribusiCaseProject,
  } = useSWR(apiUrlDistribusiCaseProject, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlTop5DosenCaseProject = `/api/kelas-kolaboratif/top5-dosen-case-project?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultTop5DosenCaseProject,
    error: errorTop5DosenCaseProject,
    isLoading: isLoadingTop5DosenCaseProject,
  } = useSWR(apiUrlTop5DosenCaseProject, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiJenisMataKuliah = `/api/kelas-kolaboratif/distribusi-jenis-mata-kuliah?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiJenisMataKuliah,
    error: errorDistribusiJenisMataKuliah,
    isLoading: isLoadingDistribusiJenisMataKuliah,
  } = useSWR(apiUrlDistribusiJenisMataKuliah, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const apiUrlDistribusiMetodeMataKuliah = `/api/kelas-kolaboratif/distribusi-metode-mata-kuliah?year=${
    activeReportingYear || ''
  }`;
  const {
    data: resultDistribusiMetodeMataKuliah,
    error: errorDistribusiMetodeMataKuliah,
    isLoading: isLoadingDistribusiMetodeMataKuliah,
  } = useSWR(apiUrlDistribusiMetodeMataKuliah, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatKelasKolaboratif: {
      data: resultInfoAgregatKelasKolaboratif?.data,
      isLoading: isLoadingInfoAgregatKelasKolaboratif,
      error: errorInfoAgregatKelasKolaboratif,
    },
    distribusiCaseProject: {
      data: resultDistribusiCaseProject?.data,
      isLoading: isLoadingDistribusiCaseProject,
      error: errorDistribusiCaseProject,
    },
    top5DosenCaseProject: {
      data: resultTop5DosenCaseProject?.data,
      isLoading: isLoadingTop5DosenCaseProject,
      error: errorTop5DosenCaseProject,
    },
    distribusiJenisMataKuliah: {
      data: resultDistribusiJenisMataKuliah?.data,
      isLoading: isLoadingDistribusiJenisMataKuliah,
      error: errorDistribusiJenisMataKuliah,
    },
    distribusiMetodeMataKuliah: {
      data: resultDistribusiMetodeMataKuliah?.data,
      isLoading: isLoadingDistribusiMetodeMataKuliah,
      error: errorDistribusiMetodeMataKuliah,
    },
  };

  return <KelasKolaboratifUI pageKey={pageKey} dashboardData={dashboardData} />;
}
