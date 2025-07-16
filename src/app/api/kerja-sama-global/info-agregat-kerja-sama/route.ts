import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc(
      'get_cooperation_aggregated_info'
    );

    if (error) {
      throw new Error(
        `Error fetching cooperation aggregated info data: ${error.message}`
      );
    }

    return NextResponse.json({
      data,
    });
  } catch (e) {
    if (e instanceof Error) {
      console.error('API Route Error:', e.message);
      return NextResponse.json({ message: e.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Terjadi error tak terduga' },
      { status: 500 }
    );
  }
}
