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

## Second check: Git repository link (likely your issue)

| Where you push | Where Vercel listens (today) |
|----------------|------------------------------|
| `LetMeHelpYouREALTY/skyesummithomes` | **`DrJanDuffy/skyesummithomes`** |

Cloud agent pushes go to **LetMeHelpYouREALTY**. The Vercel project `skyesummithomes` is still wired to **DrJanDuffy/skyesummithomes**, so those pushes **do not start a deployment**.

**Fix (pick one):**

1. **GitHub Actions deploy (automated in this repo)**  
   Add secret **`VERCEL_TOKEN`** on **LetMeHelpYouREALTY/skyesummithomes** (Settings → Secrets → Actions).  
   Pushes to `main` run [`.github/workflows/vercel-production.yml`](./.github/workflows/vercel-production.yml).  
   See [AUDIT-AND-FIX.md](./AUDIT-AND-FIX.md) for live 404 findings.

2. **Reconnect Vercel Git**  
   Vercel → [skyesummithomes](https://vercel.com/janet-duffys-projects/skyesummithomes) → Settings → Git → disconnect → connect **`LetMeHelpYouREALTY/skyesummithomes`** → Production branch **`main`**.

3. **Push to the repo Vercel already uses**  
   Merge your work into `DrJanDuffy/skyesummithomes` `main` (mirror, PR, or change `origin` if you own that repo).

After reconnecting, push `main` again:

```bash
git push origin main
```

## Third check: Framework preset (Next.js vs static)

Vercel **Project Settings** may still show **Next.js**, which makes remote `vercel build` fail with:

`Error: No Next.js version detected`

This repo sets **`"framework": null`** in `vercel.json` (static / Other). The GitHub workflow uses **`vercel build` + `deploy --prebuilt`** so that config is used instead of the dashboard preset.

**Optional dashboard fix:** Vercel → skyesummithomes → Settings → General → Framework Preset → **Other**.

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
