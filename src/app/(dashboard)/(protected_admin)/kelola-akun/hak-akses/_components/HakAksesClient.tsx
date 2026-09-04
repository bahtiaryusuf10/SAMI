'use client';

import { HakAksesUI } from '@/components/masters/HakAksesUI';
import { useApiData } from '@/hooks/useApiData';

export default function HakAksesClient() {
  const permission = useApiData(`/api/kelola-akun/hak-akses/permissions`);
  const role = useApiData(`/api/kelola-akun/hak-akses/roles`);
  const rolePermission = useApiData(
    `/api/kelola-akun/hak-akses/role-permissions`
  );

  const data = {
    dataPermission: permission,
    dataRole: role,
    dataRolePermission: rolePermission,
  };

  return <HakAksesUI data={data} mutate={rolePermission.mutate} />;
}
