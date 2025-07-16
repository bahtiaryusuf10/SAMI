import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get('province');
  const year = searchParams.get('year');

  if (!province) {
    return NextResponse.json(
      { message: 'Parameter "province" dibutuhkan.' },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc(
      'get_workplace_distribution_by_province',
      {
        p_province_name: province,
        p_graduation_year: year ? parseInt(year) : null,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching drill down lokasi bekerja data: ${error.message}`
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
