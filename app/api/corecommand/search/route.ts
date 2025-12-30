import { NextRequest, NextResponse } from 'next/server';
import { getCommandmentsByPopularity } from '@/lib/data/corecommand-database';
import { getAnthropicClient } from '@/lib/services/anthropic';
import type { CoreCommandment } from '@/lib/types/corecommand';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || !query.trim()) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Get all commandments
    const allCommandments = getCommandmentsByPopularity();

    // Use Anthropic for semantic search
    try {
      const client = getAnthropicClient();

      const systemPrompt = `You are a semantic search assistant for moral commandments and network society concepts.

Your task is to analyze a search query and determine which commandments are semantically relevant to it.

Consider semantic relevance, not just keyword matching. For example:
- Query "freedom" should match commandments about exit rights, voluntary association, etc.
- Query "technology" should match commandments about algorithms, compute, encryption, etc.
- Query "honesty" should match commandments about transparency, accountability, etc.

You will receive a list of commandments with their ID, title, commandment (core principle), and description.

Return your response as a valid JSON array of IDs that match the search query, ordered by relevance.
Example: ["1", "5", "12"]

Return ONLY the JSON array, no other text.`;

      // Format commandments for the prompt
      const commandmentsText = allCommandments.map(cmd =>
        `ID: ${cmd.id}\nTitle: ${cmd.title}\nCommandment: ${cmd.commandment}\nDescription: ${cmd.description}\n---`
      ).join('\n');

      const userPrompt = `Search Query: "${query}"\n\nCommandments:\n${commandmentsText}\n\nWhich commandments are semantically relevant to this search query? Return a JSON array of matching IDs.`;

      const message = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: userPrompt
        }]
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

      // Parse the response
      let matchingIds: string[] = [];
      try {
        const parsed = JSON.parse(responseText);
        matchingIds = Array.isArray(parsed) ? parsed : [];
      } catch (parseError) {
        console.error('Failed to parse search response as JSON:', responseText);
        throw new Error('Failed to parse search results');
      }

      // Filter and sort commandments based on matched IDs
      const matches = allCommandments.filter(cmd => matchingIds.includes(cmd.id));
      // Sort by the order returned by the LLM
      matches.sort((a, b) => matchingIds.indexOf(a.id) - matchingIds.indexOf(b.id));

      return NextResponse.json({ matches });

    } catch (anthropicError) {
      console.error('Anthropic search failed, falling back to text search:', anthropicError);

      // Fallback to text-based search
      const lowercaseQuery = query.toLowerCase();
      const filtered = allCommandments.filter(cmd =>
        cmd.title.toLowerCase().includes(lowercaseQuery) ||
        cmd.commandment.toLowerCase().includes(lowercaseQuery) ||
        cmd.description.toLowerCase().includes(lowercaseQuery)
      );

      return NextResponse.json({ matches: filtered });
    }
  } catch (error) {
    console.error('Error in /api/corecommand/search:', error);

    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('ANTHROPIC_API_KEY')) {
      return NextResponse.json(
        { error: 'AI search requires API key configuration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
