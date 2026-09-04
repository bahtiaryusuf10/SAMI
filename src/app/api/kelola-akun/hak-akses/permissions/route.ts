import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserWithPermissions } from '@/lib/utils/serverPermission';
import { NextResponse } from 'next/server';

export async function GET() {
  const { hasPermission } = await getUserWithPermissions();
  if (!hasPermission('manage:all_users')) {
    return NextResponse.json({ error: 'Akses ditolak.' }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_all_permissions');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ data });
}