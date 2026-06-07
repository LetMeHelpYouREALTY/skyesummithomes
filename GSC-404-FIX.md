# Google Search Console: Not Found (404) — Fix Guide

## Status (June 2026)

**Fixed in production.** Apex paths now **308-redirect** to www (verified live). GSC may still show the Jan 2026 crawl until you **Validate fix** and Google recrawls.

```bash
bash scripts/audit-live-urls.sh
```

Expected for `https://skyesummithomes.com/invest`: status **308**, location `https://www.skyesummithomes.com/invest`.

## What Google reported

These URLs returned **404** (or were not served) when crawled on the **non-www** host:

| URL | Last crawled |
|-----|----------------|
| https://skyesummithomes.com/invest | Jan 7, 2026 |
| https://skyesummithomes.com/sell | Nov 27, 2025 |
| https://skyesummithomes.com/valuation | Nov 25, 2025 |
| https://skyesummithomes.com/buy | Nov 25, 2025 |
| https://skyesummithomes.com/contact | Nov 23, 2025 |
| https://skyesummithomes.com/about | Nov 23, 2025 |

## Root cause

- **Correct site** lives on **https://www.skyesummithomes.com** (Vercel).
- **Historically**, apex (`https://skyesummithomes.com`) hit Cloudflare Workers that returned **404** for paths like `/invest`.
- **Current:** Apex DNS points to Vercel; `vercel.json` redirects all apex paths (including `/`) to **www** HTTPS.

## Code changes in this repo

1. **`scripts/generate-clean-urls.js`** — At build time, creates `/{slug}/index.html` from `/{slug}.html` so paths like `/about` work on static hosts without rewrites alone.
2. **`vercel.json`** — Apex host redirects to www (explicit `/` rule plus `/:path*`), `.html` → extensionless redirects, www canonical.
3. **`npm run build`** — Runs clean-url generation and GSC verification inject.
4. **`cloudflare/skyesummithomes-apex-redirect/`** — Optional Worker backup (301 apex → www) if apex traffic hits Cloudflare again.

## Cloudflare (only if apex 404s return)

If `curl -sI https://skyesummithomes.com/invest` ever shows **404** again, re-apply one of:

### Option A — Page rule (fastest)

1. **Rules → Page Rules → Create**
2. URL: `skyesummithomes.com/*`
3. Setting: **Forwarding URL** → **301 Permanent**
4. Destination: `https://www.skyesummithomes.com/$1`
5. Save and deploy

Repeat for `http://skyesummithomes.com/*` if needed.

### Option B — Point apex to Vercel (recommended long-term)

1. **DNS** → Edit **A** record for `skyesummithomes.com`
2. Change IP from `216.198.79.1` to Vercel’s IP (from Vercel → Project → Settings → Domains)
3. Keep proxy **DNS only** (gray cloud), not orange cloud
4. Ensure **www** CNAME stays: `1e88402ffbe247ac.vercel-dns-017.com`

See also: `CLOUDFLARE-QUICK-ACTION.md`

## Verify after DNS / page rule (24–48 hours)

```bash
curl -sI https://skyesummithomes.com/invest | grep -iE 'HTTP|location'
curl -sI https://skyesummithomes.com/about  | grep -iE 'HTTP|location'
```

**Expected:** `HTTP/2 301` and `location: https://www.skyesummithomes.com/invest` (same for each path).

Confirm www serves real titles:

```bash
curl -sL https://www.skyesummithomes.com/invest | grep -o '<title>[^<]*</title>'
```

Should include **Skye Summit** / **Investment Strategy**, not a generic “Las Vegas Homes” title.

## Google Search Console

1. Use property **https://www.skyesummithomes.com** (or **Domain** `skyesummithomes.com`).
2. **Sitemaps** → submit: `https://www.skyesummithomes.com/sitemap.xml`
3. **Page indexing → Not found (404)** → **Done fixing?** → **Validate fix**
4. **URL Inspection** → request indexing for www URLs (start with `/invest`):

   - `https://www.skyesummithomes.com/invest`
   - `https://www.skyesummithomes.com/sell`
   - `https://www.skyesummithomes.com/buy`

Validation often takes **1–2 weeks** after redirects are live. The apex URL may move from **404** to **Page with redirect** — that is correct; only **www** URLs should be indexed.

## Google Search Console: Alternate page with proper canonical tag

**Affected URLs (examples):**

- `https://skyesummithomes.com/`
- `https://skyesummithomes.com/?s={search_term_string}`

**Why:** Google crawled the **non-www** homepage. The page correctly declares `canonical` → `https://www.skyesummithomes.com/`, so Google treats apex as an **alternate** and indexes **www** instead. That is expected until apex **301-redirects** to www.

**Repo fixes:**

1. `WebSite` `SearchAction` `urlTemplate` now uses **www** (was non-www, which created the `?s=` alternate URL).
2. Early **hostname redirect** in `index.html` and `script.js` when the real site HTML is served on apex (backup until Cloudflare 301 is live).

**Permanent fix:** Same Cloudflare **Redirect Rule** or apex worker as in the 404 section above. After a **301**, GSC should reclassify apex URLs as redirects, not alternates.
