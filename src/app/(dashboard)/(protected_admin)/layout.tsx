import { getUserWithPermissions } from '@/lib/utils/serverPermission';
import { redirect } from 'next/navigation';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasPermission } = await getUserWithPermissions();

  if (!hasPermission('view:user_management')) {
    redirect('/forbidden');
  }

  return <>{children}</>;
}
