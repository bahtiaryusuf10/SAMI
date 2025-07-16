'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
// import { revalidatePath } from 'next/cache';

export async function getOrCreateShareLink(
  dashboardId: string,
  durationInHours: number | null = 1
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus login.' };
  }

  const now = new Date().toISOString();

  const { data: existingLink } = await supabase
    .from('shared_dashboards')
    .select('id')
    .eq('dashboard_id', dashboardId)
    .eq('created_by', user.id)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .maybeSingle();

  if (existingLink) {
    return { success: true, shareId: existingLink.id };
  }

  const insertData: {
    dashboard_id: string;
    created_by: string;
    expires_at?: string;
  } = {
    dashboard_id: dashboardId,
    created_by: user.id,
  };

  if (durationInHours) {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + durationInHours);
    insertData.expires_at = expirationDate.toISOString();
  }

  const { data: newLink, error } = await supabase
    .from('shared_dashboards')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating share link:', error);
    return { error: 'Gagal membuat tautan baru.' };
  }

  return { success: true, shareId: newLink.id };
}

// export async function createShareLink(
//   dashboardId: string,
//   durationInHours: number | null = 1
// ) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return { error: 'Anda harus login untuk membuat tautan.' };
//   }

//   const insertData: {
//     dashboard_id: string;
//     created_by: string;
//     expires_at?: string;
//   } = {
//     dashboard_id: dashboardId,
//     created_by: user.id,
//   };

//   // Jika durasi diberikan, hitung waktu kedaluwarsa
//   if (durationInHours) {
//     const expirationDate = new Date();
//     expirationDate.setHours(expirationDate.getHours() + durationInHours);
//     insertData.expires_at = expirationDate.toISOString();
//   }

//   const { data, error } = await supabase
//     .from('shared_dashboards')
//     .insert(insertData)
//     .select('id')
//     .single();

//   if (error) {
//     console.error('Error creating share link:', error);
//     return { error: 'Gagal membuat tautan. Silakan coba lagi.' };
//   }

//   revalidatePath(`/dashboard/${dashboardId}`);

//   return { success: true, shareId: data.id };
// }

// export async function getExistingShareLink(dashboardId: string) {
//   const supabase = await createSupabaseServerClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) return { error: 'User not authenticated' };

//   const { data: existingLink } = await supabase
//     .from('shared_dashboards')
//     .select('id')
//     .eq('dashboard_id', dashboardId)
//     .eq('created_by', user.id)
//     .maybeSingle();

//   if (existingLink) {
//     return { shareId: existingLink.id };
//   }

//   return { shareId: null };
// }

// export async function createShareLink(
//   dashboardId: string,
//   durationInHours: number | null = null
// ) {
//   const supabase = await createSupabaseServerClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     return { error: 'Anda harus login untuk membuat tautan.' };
//   }

//   const { data: existingLink, error: existingError } = await supabase
//     .from('shared_dashboards')
//     .select('id')
//     .eq('dashboard_id', dashboardId)
//     .eq('created_by', user.id)
//     .maybeSingle();

//   if (existingError) {
//     console.error('Error checking existing link:', existingError);
//     return { error: 'Gagal memeriksa tautan.' };
//   }

//   if (existingLink) {
//     return { success: true, shareId: existingLink.id };
//   }

//   const insertData: {
//     dashboard_id: string;
//     created_by: string;
//     expires_at?: string;
//   } = {
//     dashboard_id: dashboardId,
//     created_by: user.id,
//   };

//   // Jika durasi diberikan, hitung waktu kedaluwarsa
//   if (durationInHours) {
//     const expirationDate = new Date();
//     expirationDate.setHours(expirationDate.getHours() + durationInHours);
//     insertData.expires_at = expirationDate.toISOString();
//   }

//   const { data: newLink, error: newError } = await supabase
//     .from('shared_dashboards')
//     .insert(insertData)
//     .select('id')
//     .single();

//   if (newError) {
//     console.error('Error creating share link:', newError);
//     return { error: 'Gagal membuat tautan. Silakan coba lagi.' };
//   }

//   revalidatePath(`/dashboard/${dashboardId}`);

//   return { success: true, shareId: newLink.id };
// }
