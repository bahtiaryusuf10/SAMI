'use client';

import { HakAksesUI } from '@/components/masters/HakAksesUI';
import useSWR from 'swr';

const fetcher = (url: string | URL | Request) =>
  fetch(url).then((res) => res.json());

export default function HakAksesClient() {
  // Fetch Data
  const apiUrlPermission = `/api/kelola-akun/hak-akses/permissions`;
  const {
    data: resultPermission,
    error: errorPermission,
    isLoading: isLoadingPermission,
  } = useSWR(apiUrlPermission, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlRole = `/api/kelola-akun/hak-akses/roles`;
  const {
    data: resultRole,
    error: errorRole,
    isLoading: isLoadingRole,
  } = useSWR(apiUrlRole, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const apiUrlRolePermission = `/api/kelola-akun/hak-akses/role-permissions`;
  const {
    data: resultRolePermission,
    error: errorRolePermission,
    isLoading: isLoadingRolePermission,
    mutate,
  } = useSWR(apiUrlRolePermission, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 900000,
  });

  const data = {
    dataPermission: {
      data: resultPermission?.data,
      isLoading: isLoadingPermission,
      error: errorPermission,
    },
    dataRole: {
      data: resultRole?.data,
      isLoading: isLoadingRole,
      error: errorRole,
    },
    dataRolePermission: {
      data: resultRolePermission?.data,
      isLoading: isLoadingRolePermission,
      error: errorRolePermission,
    },
  };

  return <HakAksesUI data={data} mutate={mutate} />;
}
