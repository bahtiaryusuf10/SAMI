'use server'

import { getUserWithPermissions } from '@/lib/utils/serverPermission';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, newRoleId: string) {
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
  
  const { error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update({ role_id: newRoleId })
    .eq('id', userId);

  if (updateError) {
    return { error: `Gagal memperbarui peran: ${updateError.message}` };
  }

  revalidatePath('/kelola-akun/akun');
  return { success: true };
}

export async function deleteUser(userId: string) {
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

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (deleteError) {
    return { error: `Gagal menghapus pengguna: ${deleteError.message}` };
  }

  revalidatePath('/kelola-akun/akun');
  return { success: true };
}