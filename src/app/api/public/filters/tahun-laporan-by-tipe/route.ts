import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
   const typesParam = searchParams.get('types');

   if (!typesParam) {
    return NextResponse.json({ error: 'Parameter "types" wajib diisi.' }, { status: 400 });
  }

  const importTypes = typesParam.split(',');  
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase.rpc('get_available_report_years_by_type', {
    p_import_types: importTypes,
  });

  if (error)
    return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json(data);
}