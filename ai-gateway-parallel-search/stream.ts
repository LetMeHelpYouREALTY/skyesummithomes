import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gateway, streamText } from 'ai';

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, '.env.local') });

const prompt =
  process.argv.slice(2).join(' ') ||
  'What are the latest developments in AI agents in 2026?';

if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
  console.error('Missing AI_GATEWAY_API_KEY in .env.local');
  process.exit(1);
}

console.log('streamText + gateway.tools.parallelSearch()\n');

const result = streamText({
  model: 'openai/gpt-5.4',
  prompt,
  tools: {
    parallel_search: gateway.tools.parallelSearch({ maxResults: 8 }),
  },
});

for await (const part of result.fullStream) {
  if (part.type === 'text-delta') process.stdout.write(part.text);
  if (part.type === 'tool-call') console.log(`\n[tool-call] ${part.toolName}`);
  if (part.type === 'tool-result') console.log(`[tool-result] ${part.toolName}`);
}

console.log('\n\nUsage:', await result.usage);
console.log('Finish:', await result.finishReason);
