import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');
  const yearReporting = searchParams.get('year');

  if (!level) {
    return NextResponse.json(
      { message: 'Parameter "level" dibutuhkan.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc('get_publication_categories_by_level', {
      p_level: level,
      p_report_year: yearReporting ? parseInt(yearReporting) : null,
    });

    if (error) {
      throw new Error(
        `Error fetching drill down tingkat publikasi data: ${error.message}`
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
