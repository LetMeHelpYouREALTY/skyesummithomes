import { config } from 'dotenv';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { experimental_generateVideo as generateVideo } from 'ai';

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, '.env.local') });

const prompt =
  process.argv.slice(2).join(' ') ||
  'Aerial drone shot at golden hour over Skye Summit homes in Las Vegas, clouds drifting slowly';

if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
  console.error(
    'Missing AI_GATEWAY_API_KEY (or VERCEL_OIDC_TOKEN). Add AI_GATEWAY_API_KEY to .env.local or run: vercel env pull .env.local',
  );
  process.exit(1);
}

console.log('Generating video with google/veo-3.1-generate-001…');
console.log('Prompt:', prompt);
console.log('This may take several minutes…');

let result;
try {
  result = await generateVideo({
    model: 'google/veo-3.1-generate-001',
    prompt,
    aspectRatio: '16:9',
    duration: 8,
    providerOptions: {
      vertex: {
        generateAudio: true,
        pollTimeoutMs: 600_000,
      },
    },
  });
} catch (error) {
  if (APICallError.isInstance(error) && error.statusCode === 402) {
    console.error(
      'AI Gateway balance too low for video generation (requires at least $10 in credits).',
    );
    console.error('Top up: https://vercel.com/dashboard → AI Gateway');
    process.exit(1);
  }
  throw error;
}

const video = result.video;
const mediaType = video.mediaType ?? 'video/mp4';
const extension =
  mediaType === 'video/mp4'
    ? 'mp4'
    : mediaType.split('/')[1]?.replace('quicktime', 'mov') ?? 'mp4';
const outputPath = resolve(rootDir, `generated-video.${extension}`);

writeFileSync(outputPath, video.uint8Array);
console.log(`Saved ${outputPath} (${mediaType})`);
