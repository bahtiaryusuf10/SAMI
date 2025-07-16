import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const category = searchParams.get('category');
  const year = searchParams.get('year');

  if (!level || !category) {
    return NextResponse.json(
      { error: 'Parameter level dan category dibutuhkan.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc(
      'get_achievement_by_category',
      {
        p_level: level,
        p_category: category,
        p_report_year: year ? parseInt(year, 10): null,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching drill down detail prestasi data: ${error.message}`
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
