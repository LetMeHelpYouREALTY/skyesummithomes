import { config } from 'dotenv';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateText } from 'ai';

const rootDir = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(rootDir, '.env.local') });

const prompt =
  process.argv.slice(2).join(' ') ||
  'A photorealistic sunset over the Las Vegas Valley with Red Rock Canyon in the distance';

if (!process.env.AI_GATEWAY_API_KEY && !process.env.VERCEL_OIDC_TOKEN) {
  console.error(
    'Missing AI_GATEWAY_API_KEY (or VERCEL_OIDC_TOKEN). Add AI_GATEWAY_API_KEY to .env.local or run: vercel env pull .env.local',
  );
  process.exit(1);
}

console.log('Generating image with google/gemini-3.1-flash-image-preview…');
console.log('Prompt:', prompt);

const result = await generateText({
  model: 'google/gemini-3.1-flash-image-preview',
  prompt,
});

const images = result.files.filter((file) =>
  file.mediaType.startsWith('image/'),
);

if (images.length === 0) {
  console.error('No image files returned.');
  if (result.text) console.error('Model text:', result.text);
  process.exit(1);
}

const image = images[0];
const extension =
  image.mediaType === 'image/jpeg'
    ? 'jpg'
    : image.mediaType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'png';
const outputPath = resolve(rootDir, `generated-image.${extension}`);

writeFileSync(outputPath, image.uint8Array);
console.log(`Saved ${outputPath} (${image.mediaType})`);
