'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addReportLink(year: string, sourceUrl: string) {
  if (!year || !sourceUrl) {
    return { error: 'Tahun dan URL wajib diisi.' };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from('report_links').insert({
    year: parseInt(year, 10),
    source_url: sourceUrl,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return { error: `Gagal menyimpan data: ${error.message}` };
  }

  revalidatePath('/laporan-ami'); 

  return { success: true, message: 'Tautan laporan berhasil ditambahkan.' };
}