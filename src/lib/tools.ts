const SUPABASE_FUNCTION_URL =
  'https://hvpvmczjpfwysvzbwhhn.supabase.co/functions/v1/quick-endpoint';

export const querySupabaseTool = {
  name: 'querySupabase',
  description: `Gunakan untuk menjawab pertanyaan berbasis data.`,
  func: async (query: string) => {
    const supaRes = await fetch(SUPABASE_FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: query }),
    });

    const data = await supaRes.json();

    console.log('Hasil Query :', data);

    return {
      data,
    };
  },
};
