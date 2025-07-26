import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getUserWithPermissions() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const isAdministrator = user.app_metadata?.user_role === 'administrator';

  let permissions: string[] = [];
  
  if (!isAdministrator) {
    const { data: permissionsData } = await supabase
      .rpc('get_user_permissions', { p_user_id: user.id });
    
    if (permissionsData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      permissions = permissionsData.map((p: { permission_name: any; }) => p.permission_name);
    }
  }

  const hasPermission = (permissionName: string): boolean => {
    if (isAdministrator) return true;
    return permissions.includes(permissionName);
  }

  return { user, permissions, isAdministrator, hasPermission};
}