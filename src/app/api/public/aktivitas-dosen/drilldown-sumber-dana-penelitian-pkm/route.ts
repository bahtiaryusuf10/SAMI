import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceFund = searchParams.get('sourceFund');
  const year = searchParams.get('year');

  if (!sourceFund) {
    return NextResponse.json(
      { error: 'Parameter fund category dibutuhkan.' },
      { status: 400 }
    );
  }
  
  const supabase = await createSupabaseServerClient();
  
  try {
    const { data, error } = await supabase.rpc(
      'get_publication_details_by_fund_source',
      {
        p_fund_category: sourceFund,
        p_report_year: year ? parseInt(year): null,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching drill down kategori pendanaan penelitian & pengabdian data: ${error.message}`
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
