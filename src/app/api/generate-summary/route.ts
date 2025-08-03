import { createSummaryChain } from '@/lib/summaryAgent';
import { promptTemplates } from '@/lib/summaryTemplate';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { pageKey, data } = await request.json();

    const template = promptTemplates[pageKey];
    if (!template) {
      return NextResponse.json({ error: 'Konteks halaman tidak valid.' }, { status: 400 });
    }

    const summaryChain = createSummaryChain(template);
    const dataString = JSON.stringify(data, null, 2);
    const summary = await summaryChain.invoke({ kpi_data_string: dataString });

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Gagal membuat ringkasan.' }, { status: 500 });
  }
}
