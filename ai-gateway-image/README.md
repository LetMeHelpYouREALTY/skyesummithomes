# AI Gateway image generation

Generates images with [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) and `google/gemini-3.1-flash-image-preview` via the [AI SDK](https://ai-sdk.dev).

## Prerequisites

- Vercel CLI: `npm i -g vercel`
- Cursor: `npx plugins add vercel/vercel-plugin --target cursor` (when the Cursor binary is on PATH)
- AI Gateway API key from [Vercel Dashboard → AI Gateway](https://vercel.com/dashboard)

## Setup

```bash
cd ai-gateway-image
npm install
```

Add your key to `.env.local`:

```env
AI_GATEWAY_API_KEY=your_key_here
```

Or link a Vercel project and pull OIDC:

```bash
vercel link
vercel env pull .env.local
```

## Generate an image

```bash
npm run generate
# custom prompt:
npm run generate -- "Modern luxury home in Skye Summit, Las Vegas at golden hour"
```

Output: `generated-image.png` (or `.jpg` depending on model response).
