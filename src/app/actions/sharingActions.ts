'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

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