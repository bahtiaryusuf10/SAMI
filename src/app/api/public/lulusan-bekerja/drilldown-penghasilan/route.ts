import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const reportingYear = searchParams.get('year');

  if (!category) {
    return NextResponse.json(
      { message: 'Parameter "category" dibutuhkan.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc('get_income_by_category', {
      p_income_category: category,
      p_report_year: reportingYear ? parseInt(reportingYear) : null,
    });

    if (error) {
      throw new Error(
        `Error fetching drill down penghasilan data: ${error.message}`
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
