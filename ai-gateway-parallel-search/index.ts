import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gateway, generateText, stepCountIs } from 'ai';

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, '.env.local') });

const prompt =
  process.argv.slice(2).join(' ') ||
  'What are the latest Las Vegas housing market trends in 2026? Use web search and cite sources.';

if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
  console.error(
    'Missing AI_GATEWAY_API_KEY (or VERCEL_OIDC_TOKEN). Add AI_GATEWAY_API_KEY to .env.local or run: vercel env pull .env.local',
  );
  process.exit(1);
}

const model = 'openai/gpt-5.4';

console.log(`Searching with Parallel via AI Gateway (${model})…\n`);

const searchStep = await generateText({
  model,
  prompt,
  tools: {
    parallel_search: gateway.tools.parallelSearch({
      mode: 'one-shot',
      maxResults: 10,
      excerpts: { maxCharsPerResult: 4000 },
    }),
  },
  stopWhen: stepCountIs(5),
});

for (const call of searchStep.toolCalls) {
  console.log(`[parallel_search] called`);
}

let answer = searchStep.text.trim();

if (!answer && searchStep.toolResults.length > 0) {
  console.log('[parallel_search] results received — synthesizing answer…\n');
  const searchPayload = searchStep.toolResults
    .filter((r) => r.toolName === 'parallel_search')
    .map((r) => r.output);

  const synthesis = await generateText({
    model,
    prompt: `User question: ${prompt}

Use only the following Parallel web search results. Cite URLs inline.

${JSON.stringify(searchPayload, null, 2)}`,
  });

  answer = synthesis.text.trim();
  console.log('Token usage (synthesis):', synthesis.usage);
}

if (!answer) {
  console.error('No answer text produced.');
  process.exit(1);
}

console.log(answer);
console.log('\nToken usage (search step):', searchStep.usage);
console.log('Finish reason (search step):', searchStep.finishReason);
