'use client';

import { KerjaSamaGlobalUI } from '@/components/dashboards/KerjaSamaGlobalUI';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function KerjaSamaGlobalClient() {
  const pageKey = 'kerja-sama-global';

  // Fetch Data
  const apiUrlInfoAgregatKerjasama = `/api/kerja-sama-global/info-agregat-kerja-sama`;
  const {
    data: resultInfoAgregatKerjasama,
    error: errorInfoAgregatKerjasama,
    isLoading: isLoadingInfoAgregatKerjasama,
  } = useSWR(apiUrlInfoAgregatKerjasama, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 10000,
  });

  const dashboardData = {
    infoAgregatKerjasama: {
      data: resultInfoAgregatKerjasama?.data,
      isLoading: isLoadingInfoAgregatKerjasama,
      error: errorInfoAgregatKerjasama,
    },
  };

  return <KerjaSamaGlobalUI pageKey={pageKey} dashboardData={dashboardData}/>;
}
