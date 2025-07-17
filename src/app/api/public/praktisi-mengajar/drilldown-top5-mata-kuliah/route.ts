import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseKey = searchParams.get('courseKey');
  const year = searchParams.get('year');

  if (!courseKey) {
    return NextResponse.json(
      { error: 'Parameter courseKey dibutuhkan.' },
      { status: 400 }
    );
  }
  
  const supabase = await createSupabaseServerClient();
  
  try {
    const { data, error } = await supabase.rpc(
      'get_practitioners_by_course',
      {
        p_course_key: courseKey,
        p_report_year: year ? parseInt(year): null,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching drill down mata kuliah data: ${error.message}`
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
