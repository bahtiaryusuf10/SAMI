import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportingYear = searchParams.get('year');

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc(
      'get_ami_report',
      {
        p_report_year: reportingYear ? parseInt(reportingYear) : null,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching ami report data: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
        return NextResponse.json({ data: null });
    }

    return NextResponse.json({
        data: data[0],
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
