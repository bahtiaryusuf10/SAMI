import { chatChain } from '@/lib/agent';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    const userMessage = messages[messages.length - 1]?.content || '';

    const response = await chatChain.invoke({
      question: userMessage,
    });

    console.log('Response Endpoint : ', response);

    return NextResponse.json({ message: response }, { status: 200 });
  } catch (err) {
    console.error('Error in POST handler:', err);

    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    );
  }
}
