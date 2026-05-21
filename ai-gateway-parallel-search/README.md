# AI Gateway + Parallel Search

Uses [Vercel AI Gateway](https://vercel.com/docs/ai-gateway/capabilities/web-search) built-in **Parallel Search** (`gateway.tools.parallelSearch()`) with any language model.

Based on [Parallel × Vercel](https://docs.parallel.ai/integrations/vercel) and [AI Gateway Web Search](https://vercel.com/docs/ai-gateway/capabilities/web-search).

## Prerequisites

- Vercel CLI: `npm i -g vercel`
- `AI_GATEWAY_API_KEY` in `.env.local` (same key as other AI Gateway demos)
- Parallel Search enabled on your AI Gateway account (via [Vercel Marketplace → Parallel](https://vercel.com/marketplace/parallel) if needed)

## Setup

```bash
cd ai-gateway-parallel-search
npm install
```

## Run

```bash
npm run search
npm run search -- "Latest news about Skye Summit Las Vegas real estate"
```

Uses `gateway.tools.parallelSearch()` from the `ai` package (see [Parallel × Vercel](https://docs.parallel.ai/integrations/vercel)). The Gateway runs search as a **provider-executed** tool; `index.ts` then synthesizes an answer from those results when the model stops with `tool-calls` only.

```bash
npm run search          # generateText + synthesis (recommended CLI)
npm run search:stream   # streamText example from Vercel docs
```

## Alternative: `@parallel-web/ai-sdk-tools`

For direct Parallel API keys (not routed only through Gateway tools), see `@parallel-web/ai-sdk-tools` and the [Web Search Agent cookbook](https://ai-sdk.dev/cookbook/node/web-search-agent#parallel-web).
