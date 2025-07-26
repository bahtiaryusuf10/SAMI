'use server'

import { getUserWithPermissions } from '@/lib/utils/serverPermission';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function updateRolePermission(roleName: string, permissionName: string, hasAccess: boolean) {
  const { hasPermission } = await getUserWithPermissions();
  const isAllowed = hasPermission('manage:all_users');
  
  if (!isAllowed) {
    return { error: 'Akses ditolak: Anda tidak memiliki izin yang diperlukan.' };
  }

  const supabaseAdmin = createClient( 
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

  // find id role
  const { data: role, error: roleError } = await supabaseAdmin
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single();

  if (roleError || !role) {
    return { error: `Peran "${roleName}" tidak ditemukan.` };
  }

  // find id permission
  const { data: permission, error: permissionError } = await supabaseAdmin
    .from('permissions')
    .select('id')
    .eq('name', permissionName)
    .single();
  
  if (permissionError || !permission) {
    return { error: `Hak akses "${permissionName}" tidak ditemukan.` };
  }

  if (hasAccess) {
    const { error } = await supabaseAdmin
      .from('role_permissions')
      .insert({ role_id: role.id, permission_id: permission.id });
    
    if (error) return { error: `Gagal menambahkan hak akses: ${error.message}` };
  } else {
    const { error } = await supabaseAdmin
      .from('role_permissions')
      .delete()
      .match({ role_id: role.id, permission_id: permission.id });
      
    if (error) return { error: `Gagal menghapus hak akses: ${error.message}` };
  }

  revalidatePath('/kelola-akun/hak-akses');
  
  return { success: true };
}