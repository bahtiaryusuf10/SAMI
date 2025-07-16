export async function handleImportFile(file: File, type: string, url: string, year: string, sourceUrl?:string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  if (year) formData.append('year', year);
  if (sourceUrl) formData.append('sourceUrl', sourceUrl);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    body: formData,
  });

  const result = await response.json().catch(() => {
    throw new Error('Respons dari server tidak valid.');
  });

  if (!response.ok) {
    throw new Error(result.error || 'Terjadi kegagalan di server.');
  }

  return result;
}
