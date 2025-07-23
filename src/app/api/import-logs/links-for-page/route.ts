import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || '', 10);
  const page = searchParams.get('page');

  if (!page || isNaN(year)) {
    return NextResponse.json({ error: 'Parameter tidak valid' }, { status: 400 });
  }

  const pageToImportTypesMap: Record<string, string[]> = {
    'lulusan-bekerja': ['graduates', 'tracer-studies'],
    'pengalaman-mahasiswa': ['mbkms', 'achievements', 'certificates'],
    'aktivitas-dosen': ['detasering-activities', 'teach-activities', 'research-services'],
    'praktisi-mengajar': ['practitioner-teachings', 'field-experiences'],
    'karya-dosen-terdampak': ['journal-conferences'],
    'kerja-sama-global': ['cooperations'],
    'mata-kuliah': ['courses'],
    'standar-internasional': ['accreditations'],
    'dosen': ['lecturers'],
    'mahasiswa': ['students'],
  };

  const importTypes = pageToImportTypesMap[page];
  if (!importTypes) {
    return NextResponse.json({ data: [] });
  }

  const supabase = await createSupabaseServerClient();

  try {
    const { data, error } = await supabase.rpc(
      'get_import_log_links',
      {
        p_report_year: year,
        p_import_type: importTypes,
      }
    );

    if (error) {
      throw new Error(
        `Error fetching import log data: ${error.message}`
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
