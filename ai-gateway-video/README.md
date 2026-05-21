# AI Gateway video generation

Generates videos with [Vercel AI Gateway](https://vercel.com/docs/ai-gateway/capabilities/video-generation) and `google/veo-3.1-generate-001` via the AI SDK [`experimental_generateVideo`](https://ai-sdk.dev/docs/ai-sdk-core/video-generation).

## Prerequisites

- Vercel CLI: `npm i -g vercel`
- Cursor / Claude Code / Codex: `npx plugins add vercel/vercel-plugin --target cursor` (or `claude` / `codex`)
- AI Gateway API key from [Vercel Dashboard → AI Gateway](https://vercel.com/dashboard)

## Setup

```bash
cd ai-gateway-video
npm install
```

Add to `.env.local`:

```env
AI_GATEWAY_API_KEY=your_key_here
```

## Generate a video

```bash
npm run generate
npm run generate -- "Sunset timelapse over Red Rock Canyon near Las Vegas"
```

Output: `generated-video.mp4` (generation often takes several minutes).

**Note:** Vercel AI Gateway requires at least **$10** in AI credits for video generation (image generation has a lower bar). Top up in [Dashboard → AI Gateway](https://vercel.com/dashboard) if you see a 402 / insufficient balance error.
