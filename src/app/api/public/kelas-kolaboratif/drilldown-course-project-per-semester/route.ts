import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const semester = searchParams.get('semester');
  const yearReporting = searchParams.get('year');

  if (!semester) {
    return NextResponse.json(
      { message: 'Parameter "semester" dibutuhkan.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc('get_case_method_course_details_by_semester', {
      p_semester: semester,
      p_report_year: yearReporting ? parseInt(yearReporting) : null,
    });

    if (error) {
      throw new Error(
        `Error fetching drill down detail mata kuliah data: ${error.message}`
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
