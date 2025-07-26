'use client';

import { accountColumns, AkunUI } from '@/components/masters/AkunUI';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function AkunClient() {
  // Fetch Data
  const apiUrlAkun = `/api/kelola-akun/akun`;
  const {
    data: resultAkun,
    error: errorAkun,
    isLoading: isLoadingAkun,
    mutate,
  } = useSWR(apiUrlAkun, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlRole = `/api/kelola-akun/hak-akses/roles`;
  const { data: resultRole } = useSWR(apiUrlRole, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const data = {
    dataAkun: {
      data: resultAkun?.data,
      isLoading: isLoadingAkun,
      error: errorAkun,
    },
  };

  const columnsWithActions = accountColumns(
    resultAkun,
    mutate,
    resultRole?.data
  );

  return <AkunUI data={data} columns={columnsWithActions} />;
}
