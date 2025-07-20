import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const yearReporting = searchParams.get('year');

  if (!status) {
    return NextResponse.json(
      { message: 'Parameter "status" dibutuhkan.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc('get_cooperation_details_by_status', {
      p_status: status,
      p_report_year: yearReporting ? parseInt(yearReporting) : null,
    });

    if (error) {
      throw new Error(
        `Error fetching drill down status kerja sama data: ${error.message}`
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
