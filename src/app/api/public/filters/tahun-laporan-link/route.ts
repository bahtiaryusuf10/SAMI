import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_available_report_link_years');

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
}
