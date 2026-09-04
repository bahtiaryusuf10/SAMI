'use client';

import { accountColumns, AkunUI } from '@/components/masters/AkunUI';
import { useApiData } from '@/hooks/useApiData';

export default function AkunClient() {
  const akun = useApiData(`/api/kelola-akun/akun`);
  const role = useApiData(`/api/kelola-akun/hak-akses/roles`);

  const data = {
    dataAkun: akun,
  };

  const columnsWithActions = accountColumns(
    { data: akun.data },
    akun.mutate,
    role.data
  );

  return <AkunUI data={data} columns={columnsWithActions} />;
}
