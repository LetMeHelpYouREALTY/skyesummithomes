# Why `git push` Did Not Update Production

**Canonical Git remote:** `git@github.com:LetMeHelpYouREALTY/skyesummithomes.git`  
All deployment docs in this repo now reference **LetMeHelpYouREALTY/skyesummithomes**. If Vercel still shows **DrJanDuffy/skyesummithomes**, reconnect Git (below).

## Root cause (most common)

**Vercel production deploys the `main` branch**, not feature branches like `cursor/seo-geo-aeo-pages-6031`.

| What you did | What Vercel does |
|--------------|------------------|
| Push to `cursor/...` branch | Preview deployment only (if enabled), **not** www.skyesummithomes.com |
| Push to `main` | **Production** deployment to your live domain |

Your SEO/GBP work was on `cursor/seo-geo-aeo-pages-6031`. Until that is merged into `main`, production stays on the last `main` deploy (live site `last-modified` was still April 2026).

## Second check: Git repository link

**Connected (correct):** **`LetMeHelpYouREALTY/skyesummithomes`** — production branch **`main`**.

Pushes to `main` on that repo should create Vercel deployments automatically.

**If Git deploys fail with “No Next.js version detected”:** set Framework Preset to **Other** in the dashboard — see [VERCEL-DASHBOARD-SETTINGS.md](./VERCEL-DASHBOARD-SETTINGS.md). Until then, [`.github/workflows/vercel-production.yml`](./.github/workflows/vercel-production.yml) still deploys via **`vercel build` + `--prebuilt`** when **`VERCEL_TOKEN`** is set.

**Historical note:** Vercel was previously linked to `DrJanDuffy/skyesummithomes`; that caused pushes to LetMeHelpYouREALTY not to update production.

## Third check: Framework preset (Next.js vs static)

Vercel **Project Settings** may still show **Next.js**, which makes remote `vercel build` fail with:

`Error: No Next.js version detected`

This repo sets **`"framework": null`** in `vercel.json` (static / Other). The GitHub workflow uses **`vercel build` + `deploy --prebuilt`** so that config is used instead of the dashboard preset.

**Dashboard fix (recommended):** Match Project Settings to production — see **[VERCEL-DASHBOARD-SETTINGS.md](./VERCEL-DASHBOARD-SETTINGS.md)** (Framework **Other**, `npm run build`, output `.`, `npm ci`).

## Fourth check: `vercel.json`

This repo uses:

- `framework`: `null` (Other — not Next.js)
- `buildCommand`: `npm run build`
- `outputDirectory`: `.`
- API route: `api/followupboss.ts` only (no duplicate `.js`)

## What to do

### Option A — Merge to main (recommended)

```bash
git checkout main
git pull origin main
git merge cursor/seo-geo-aeo-pages-6031
git push origin main
```

Then open **Vercel → Deployments** and confirm a **Production** build from `main` completes.

### Option B — Deploy a preview from your branch

Push the feature branch (already done), then in Vercel open the latest **Preview** deployment URL to verify changes before merging.

### Option C — Manual production deploy

```bash
npx vercel login
npx vercel link
npx vercel --prod
```

## Verify production updated

```bash
curl -sI https://www.skyesummithomes.com | grep -i last-modified
```

After a successful deploy, `last-modified` should be today's date. You can also check for new pages:

- https://www.skyesummithomes.com/skye-summit-realtor
- https://www.skyesummithomes.com/skye-summit-faq

## Cloudflare note

`www` uses Vercel (`x-vercel-id` in responses). Cloudflare may cache HTML; if the deploy succeeded but the site looks old, purge cache for `www.skyesummithomes.com` in Cloudflare → Caching → Purge Everything.

## GitHub webhook

If `main` pushes still do not deploy:

1. GitHub → **LetMeHelpYouREALTY/skyesummithomes** → Settings → Webhooks  
2. Confirm an active **Vercel** webhook (recent deliveries = 200)  
3. If missing: Vercel → Project → Settings → Git → **Reconnect**
