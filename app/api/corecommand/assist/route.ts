import { NextRequest, NextResponse } from 'next/server';
import { improveCoreCommandWriting } from '@/lib/services/anthropic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { draft, section, context } = body;

    if (!draft || !section) {
      return NextResponse.json(
        { error: 'draft and section are required' },
        { status: 400 }
      );
    }

    if (!['title', 'commandment', 'description'].includes(section)) {
      return NextResponse.json(
        { error: 'section must be title, commandment, or description' },
        { status: 400 }
      );
    }

    const improvement = await improveCoreCommandWriting(draft, section, context);

    return NextResponse.json(improvement);
  } catch (error) {
    console.error('Error in /api/corecommand/assist:', error);

    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'AI features require API key configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to improve writing' },
      { status: 500 }
    );
  }
}
