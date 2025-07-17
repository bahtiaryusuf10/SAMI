import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const activityType = searchParams.get('activityType');
  const year = searchParams.get('year');

  if (!activityType) {
    return NextResponse.json(
      { error: 'Parameter activityType dibutuhkan.' },
      { status: 400 }
    );
  }
  
  const supabase = await createSupabaseServerClient();
  
  try {
    const { data, error } = await supabase.rpc(
      'get_lecturers_by_activity',
      {
        p_activity_type: activityType,
        p_report_year: year ? parseInt(year): null,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching drill down aktivitas luar kampus data: ${error.message}`
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
