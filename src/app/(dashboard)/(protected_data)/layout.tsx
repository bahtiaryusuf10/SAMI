import { getUserWithPermissions } from '@/lib/utils/serverPermission';
import { redirect } from 'next/navigation';

export default async function ProtectedDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasPermission } = await getUserWithPermissions();

  if (!hasPermission('view:data_master')) {
    redirect('/forbidden');
  }

  return <>{children}</>;
}
