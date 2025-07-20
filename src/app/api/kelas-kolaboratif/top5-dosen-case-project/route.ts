import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportingYear = searchParams.get('year');

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc(
      'get_top_lecturers_by_case_method_courses',
      {
        p_report_year: reportingYear ? parseInt(reportingYear) : null,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching top lecturer by case method courses data: ${error.message}`
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
