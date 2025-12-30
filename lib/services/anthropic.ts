import Anthropic from '@anthropic-ai/sdk';

let anthropicClient: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }

    anthropicClient = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: false // Server-side only
    });
  }

  return anthropicClient;
}

export async function generateCoreCommandIdeas(
  mode: 'random' | 'context',
  context?: string,
  count: number = 1,
  existingTitles: string[] = []
): Promise<Array<{title: string, commandment: string, description: string}>> {
  const client = getAnthropicClient();

  const systemPrompt = `You are an expert on moral philosophy, network states, and Balaji Srinivasan's concept of moral innovations.

Your task is to generate compelling "moral commandments" for future network societies. Each commandment should:
1. Have a catchy, memorable title (e.g., "The Long-Attention Society")
2. Contain ONE core principle (1-2 sentences max) that challenges conventional thinking
3. Include a brief description (2-3 sentences) explaining the concept

Be bold, provocative, and visionary. Think about how technology enables new forms of social organization.

IMPORTANT: Return your response as a valid JSON array with this exact structure:
[
  {
    "title": "Society Name",
    "commandment": "The core principle in one sentence.",
    "description": "Brief explanation of what this society does and why it matters."
  }
]

Return only the JSON array, no other text.`;

  let userPrompt = '';

  // Add existing titles to avoid duplicates
  const existingTitlesText = existingTitles.length > 0
    ? `\n\nIMPORTANT: Do NOT generate any commandments with these titles (they already exist):\n${existingTitles.map(t => `- ${t}`).join('\n')}\n\nGenerate entirely new and unique ideas.`
    : '';

  if (mode === 'random') {
    userPrompt = `Generate ${count} unique moral commandment(s) for network societies. Pick diverse themes from: identity, governance, property, education, money, law, migration, data, or similar domains. Be creative and avoid clichés.${existingTitlesText}

Return only a JSON array with ${count} commandment(s).`;
  } else {
    userPrompt = `Generate ${count} moral commandment(s) for network societies based on this context: "${context}".
Create ideas that relate to or expand upon this theme. If the context is too vague, generate something adjacent and explain the connection.${existingTitlesText}

Return only a JSON array with ${count} commandment(s).`;
  }

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    try {
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', responseText);
      // Return a fallback idea
      return [{
        title: 'The Innovation Society',
        commandment: 'New ideas are the foundation of progress.',
        description: 'A society that values and rewards innovation. Creativity and experimentation are cultural norms.'
      }];
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to generate moral ideas');
  }
}

export async function improveCoreCommandWriting(
  draft: string,
  section: 'title' | 'commandment' | 'description',
  context?: string
): Promise<{improvedText: string, alternatives: string[], reason: string}> {
  const client = getAnthropicClient();

  const systemPrompt = `You are an expert editor specializing in clear, impactful writing for moral philosophy and network state concepts.

Your task is to improve user writing to be:
1. More concise and punchy
2. More memorable and quotable
3. Clearer and more precise
4. Aligned with Balaji Srinivasan's style (bold, visionary, tech-positive)

IMPORTANT: Return your response as valid JSON with this exact structure:
{
  "improvedText": "The best improved version",
  "alternatives": ["Alternative 1", "Alternative 2"],
  "reason": "Brief explanation of why these changes improve the text"
}

Return only the JSON object, no other text.`;

  let userPrompt = `Improve this ${section} for a moral commandment:\n\n"${draft}"\n\n`;

  if (context) {
    userPrompt += `Additional context: ${context}\n\n`;
  }

  const sectionConstraints = {
    title: 'Keep under 8 words maximum. Make it catchy and memorable.',
    commandment: 'Keep to 1-2 sentences maximum. Make it quotable and impactful.',
    description: 'Keep to 2-3 sentences. Be clear and explanatory.'
  };

  userPrompt += `Constraints: ${sectionConstraints[section]}\n\n`;
  userPrompt += 'Return only a JSON object with the improved text, 2-3 alternatives, and a brief reason.';

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userPrompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    try {
      const parsed = JSON.parse(responseText);
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse Claude response as JSON:', responseText);
      // Return a fallback improvement
      return {
        improvedText: draft,
        alternatives: [],
        reason: 'Unable to generate improvements. Please try again.'
      };
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    throw new Error('Failed to improve writing');
  }
}
