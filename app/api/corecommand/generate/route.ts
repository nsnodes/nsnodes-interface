import { NextRequest, NextResponse } from 'next/server';
import { generateCoreCommandIdeas } from '@/lib/services/anthropic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode, context, count = 1, existingTitles = [] } = body;

    if (mode !== 'random' && mode !== 'context') {
      return NextResponse.json(
        { error: 'Invalid mode. Use "random" or "context"' },
        { status: 400 }
      );
    }

    if (mode === 'context' && !context) {
      return NextResponse.json(
        { error: 'Context is required when mode is "context"' },
        { status: 400 }
      );
    }

    const ideas = await generateCoreCommandIdeas(mode, context, count, existingTitles);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error in /api/corecommand/generate:', error);

    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'AI features require API key configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate ideas' },
      { status: 500 }
    );
  }
}
