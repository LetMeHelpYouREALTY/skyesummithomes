# Google Search Console — Setup for skyesummithomes.com

This site is prepared for [Google Search Console](https://search.google.com/search-console) with **www** as the canonical host.

## WWW as primary (Search Console checklist)

Google no longer has a “preferred domain” toggle. **www** becomes primary when redirects, canonicals, and sitemap all agree:

| Signal | Status in this repo |
|--------|---------------------|
| Apex → www redirect | `vercel.json` (308) + `scripts/inject-www-primary.js` on every page |
| Canonical tags | `https://www.skyesummithomes.com/...` on all indexable pages |
| Sitemap | `https://www.skyesummithomes.com/sitemap.xml` only |
| robots.txt | Points to www sitemap |
| Internal / schema URLs | `lib/gbp-constants.js` → `SITE` uses www |

### In Google Search Console

1. **Add property** (pick one approach):
   - **Domain** → `skyesummithomes.com` (recommended — covers apex + www + http/https), or
   - **URL prefix** → `https://www.skyesummithomes.com` only
2. **Sitemaps** → submit **`https://www.skyesummithomes.com/sitemap.xml`** (never the apex URL).
3. **URL Inspection** → always test and request indexing with **www** URLs.
4. Do **not** maintain a separate apex URL-prefix property unless debugging redirects.
5. After deploy, validate apex redirect:

   ```bash
   curl -sI https://skyesummithomes.com/ | grep -iE 'HTTP|location'
   curl -sI https://skyesummithomes.com/buy | grep -iE 'HTTP|location'
   ```

   Expected: `308` or `301` with `location: https://www.skyesummithomes.com/...`

6. For **“Alternate page with proper canonical”** or **“Page with redirect”** on apex/http URLs → **Validate fix** after redirects are live (1–2 weeks recrawl).

### “Page with redirect” examples (Jul 2026)

These are **expected not to be indexed**. Canonical indexable URL is always `https://www.skyesummithomes.com/`.

| GSC example | Why it redirects | Status |
|-------------|------------------|--------|
| `https://skyesummithomes.com/` | Apex → www (308) | Correct — mark **Validate fix** |
| `http://skyesummithomes.com/` | HTTP → HTTPS → www | Correct — mark **Validate fix** |
| `http://www.skyesummithomes.com/` | HTTP → HTTPS www | Correct — mark **Validate fix** |
| `https://skyesummithomes.com/?s={search_term_string}` | Legacy SearchAction template crawl | Fixed: SearchAction removed; Edge Middleware 308 → clean `/search` |

Do **not** request indexing for apex/http URLs. After deploy, click **Validate fix** in GSC for this report.

### “Alternate page with proper canonical” (Jul 2026)

| GSC example | Why Google skipped indexing | Fix |
|-------------|----------------------------|-----|
| `https://www.skyesummithomes.com/?s={search_term_string}` | Old SearchAction template; page pointed at homepage canonical | SearchAction removed; `middleware.js` 308 → `https://www.skyesummithomes.com/search` (query stripped — no loop) |

Expected after deploy:

```bash
curl -sI 'https://www.skyesummithomes.com/?s={search_term_string}' | grep -iE 'HTTP|location'
curl -sI 'https://www.skyesummithomes.com/search?s=test' | grep -iE 'HTTP|location'
```

Both should be a **single** `308` to `https://www.skyesummithomes.com/search` (no `?s=` on the Location). Then **Validate fix** in GSC. This URL should not be indexed.

### “Redirect error” examples (Jul 2026)

| GSC example | Intended final URL | Fix |
|-------------|-------------------|-----|
| `https://skyesummithomes.com/invest` | `https://www.skyesummithomes.com/invest` | Apex → www absolute 308 (1 hop) |
| `https://www.skyesummithomes.com/las-vegas-zip-code-map/` | `https://www.skyesummithomes.com/las-vegas-zip-code-map` | Trailing slash → absolute www non-slash 308 |

These must **not** be indexed. After deploy, confirm:

```bash
curl -sI https://skyesummithomes.com/invest | grep -iE 'HTTP|location'
curl -sI https://www.skyesummithomes.com/las-vegas-zip-code-map/ | grep -iE 'HTTP|location'
```

Expected: `308` with absolute `https://www.skyesummithomes.com/...` (no trailing slash). Then **Validate fix** in GSC.

## What is already in the repo

| Item | Location / URL |
|------|----------------|
| Sitemap | `https://www.skyesummithomes.com/sitemap.xml` |
| Robots | `https://www.skyesummithomes.com/robots.txt` |
| DNS verification (TXT) | `google-site-verification=wKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI` (Cloudflare — see `CLOUDFLARE-DNS-SETUP.md`) |
| HTML file verification | `/googlewKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI.html` |
| HTML meta verification | Injected on every page at build via `scripts/inject-gsc-verification.js` |
| Apex → www redirects | `vercel.json` + `scripts/inject-www-primary.js` |
| Clean URLs | `vercel.json` rewrites + `scripts/generate-clean-urls.js` |

Run local checks:

```bash
npm run build
npm run validate:gsc
```

## 1. Add or verify the property

Choose **one** verification method (DNS is already documented for this domain):

### A. Domain property (recommended)

1. Search Console → **Add property** → **Domain** → `skyesummithomes.com`
2. Add the TXT record Google provides (or keep the existing `google-site-verification=…` TXT in Cloudflare if it matches).
3. Wait for DNS propagation, then click **Verify**.

### B. URL prefix property

1. Add property → **URL prefix** → `https://www.skyesummithomes.com`
2. Verify using:
   - **DNS** (same TXT as above), or
   - **HTML file** — upload is already done at  
     `https://www.skyesummithomes.com/googlewKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI.html`, or
   - **HTML tag** — deployed on all pages after `npm run build` on Vercel.

## 2. Submit the sitemap

1. Search Console → **Sitemaps**
2. Enter: `https://www.skyesummithomes.com/sitemap.xml`
3. Submit

Do **not** submit the non-www sitemap URL; use **www** only.

## 3. Set preferred host (URL prefix only)

For a **www** URL-prefix property, all canonicals and the sitemap already use `https://www.skyesummithomes.com`. Ensure apex `skyesummithomes.com` **301-redirects** to www (see `GSC-404-FIX.md` and `CLOUDFLARE-QUICK-ACTION.md`).

## 4. Request indexing (after deploy)

For new or updated pages:

1. **URL Inspection** → paste the **www** URL
2. **Test live URL** → **Request indexing**

Start with:

- `https://www.skyesummithomes.com/`
- `https://www.skyesummithomes.com/homes-for-sale-skye-summit`
- `https://www.skyesummithomes.com/las-vegas-zip-code-map`

**Master plan guide pages (request after deploy):**

- `https://www.skyesummithomes.com/skye-summit-master-plan`
- `https://www.skyesummithomes.com/skye-summit-interest-list`
- `https://www.skyesummithomes.com/kb-home-vertice-skye-summit`
- `https://www.skyesummithomes.com/olympia-companies-skye-summit`
- `https://www.skyesummithomes.com/skye-summit-timeline`
- `https://www.skyesummithomes.com/woodside-homes-skye-summit`

After adding pages, **resubmit** `https://www.skyesummithomes.com/sitemap.xml` in Search Console (34 URLs as of June 2026).

## 5. Link Analytics (optional)

1. Search Console → **Settings** → **Associations**
2. Link your **Google Analytics 4** property when GA4 is added to the site (`SETUP-INSTRUCTIONS.md`).

## 6. Monitor known issues

| Issue | Doc |
|-------|-----|
| Apex 404s (`/invest`, `/buy`, etc.) | `GSC-404-FIX.md` |
| “Alternate page with proper canonical” on non-www | `GSC-404-FIX.md` — fix apex 301 |
| **“Page with redirect”** (http/apex homepage URLs) | See below |
| **Not found (404)** on apex paths (`/invest`, etc.) | `GSC-404-FIX.md` — validate after apex → www redirect |
| **Alternate page with proper canonical** (`/?s={search_term_string}`) | See section above — SearchAction removed; `middleware.js` 308 → clean `/search` |
| **Product snippets** — missing offers/review/rating | See below |
| Cloudflare / DNS | `CLOUDFLARE-DNS-SETUP.md`, `CLOUDFLARE-QUICK-ACTION.md` |

After apex redirects are live, open each affected issue in Search Console and use **Validate fix**.

### “Page with redirect” (expected after fix)

Search Console may list these **non-canonical** URLs:

| URL | Expected behavior |
|-----|-------------------|
| `http://www.skyesummithomes.com/` | 301/308 → `https://www.skyesummithomes.com/` |
| `http://skyesummithomes.com/` | 301/308 → `https://www.skyesummithomes.com/` (not apex HTTPS) |
| `https://skyesummithomes.com/` | **301** → `https://www.skyesummithomes.com/` |

Google **should not** index those URLs — only **https://www.skyesummithomes.com/** is canonical. This report is normal once redirects are correct.

1. Confirm apex homepage redirect (must not return 200 on apex):

   ```bash
   curl -sI https://skyesummithomes.com/ | grep -iE 'HTTP|location'
   ```

   Expected: `301` or `308` and `location: https://www.skyesummithomes.com/`

2. In Search Console → **Page indexing** → **Page with redirect** → **Done fixing?** → **Validate fix**
3. Allow **1–2 weeks** for recrawl; the count should drop to zero.

### “Discovered – currently not indexed”

Google found URLs (usually from your **sitemap**) but has **not crawled or indexed** them yet (`Last crawled: N/A`). This is common on newer or lower-authority sites — not a robots block if pages return **200** and `index, follow`.

**Site fixes (this repo):**

- Homepage footer links to all core service pages (internal linking)
- `scripts/normalize-trailing-slash-urls.js` keeps canonicals aligned with `trailingSlash: false`
- Sitemap uses www URLs without trailing slashes

**Your steps in Search Console:**

1. Confirm sitemap submitted: `https://www.skyesummithomes.com/sitemap.xml`
2. **URL Inspection** → paste each priority URL → **Request indexing** (batch over a few days; Google limits daily requests):

   - `/about`, `/buy`, `/sell`, `/contact`, `/community`, `/invest`
   - `/homes-for-sale-skye-summit`, `/las-vegas-zip-code-map`

3. Skip low-priority legal pages (`/privacy`, `/terms`, `/mls-disclaimer`) unless you need them in search
4. **Page indexing → Discovered – currently not indexed** → monitor; count should fall as Google crawls after requests

### “Product snippets” — missing offers / review / rating

Search Console may report:

> Either "offers", "review", or "aggregateRating" should be specified

**Cause:** Legacy standalone `Service` JSON-LD on `/buy` and `/valuation` (and duplicate `LocalBusiness` on `/homes-for-sale-skye-summit`) without those fields. Google treats them as invalid Product-like snippets.

**Fix (this repo):** `scripts/consolidate-legacy-schema.js` removes duplicate standalone `Service` and `LocalBusiness` blocks. Canonical entity markup lives in the hyperlocal `@graph` (`LocalBusiness` + `RealEstateAgent` with `aggregateRating`).

After deploy:

1. **Enhancements → Product snippets** → open the issue → **Validate fix**
2. Re-test affected URLs in [Rich Results Test](https://search.google.com/test/rich-results):
   - `https://www.skyesummithomes.com/buy`
   - `https://www.skyesummithomes.com/valuation`
   - `https://www.skyesummithomes.com/homes-for-sale-skye-summit`

Re-run after deploy:

```bash
npm run build && npm run validate:gsc && npm run audit:urls
```

## 7. Ongoing maintenance

When you add a new public page:

1. Add a `<url>` entry in `sitemap.xml` (www URL, no trailing slash except homepage `/`).
2. Set `<lastmod>` to the publish date (build uses each HTML file’s modification date automatically).
3. Redeploy; resubmit sitemap in Search Console if needed.
4. Run `npm run validate:gsc` before merging.

## 8. June 2026 refresh (post–RealScout deploy)

After the RealScout widget fix (PR #25), run this checklist in Search Console:

1. **Resubmit sitemap** → `https://www.skyesummithomes.com/sitemap.xml` (34 URLs; `lastmod` reflects page file dates).
2. **Request indexing** (URL Inspection, www only) for pages updated in this release:
   - `https://www.skyesummithomes.com/` (homepage + RealScout widget)
   - `https://www.skyesummithomes.com/homes-for-sale-skye-summit`
   - `https://www.skyesummithomes.com/buy`
   - `https://www.skyesummithomes.com/skye-summit-master-plan`
3. **Validate fix** on any open issues:
   - Page with redirect (apex/http URLs)
   - Not found (404) on apex paths
   - Alternate page with proper canonical (apex `/?s=`)
4. **Live audit** after deploy:

   ```bash
   npm run build && npm run validate:gsc && npm run audit:urls
   ```

5. **Hard refresh** your browser if the old service worker cached pre-fix HTML (`sw.js` → `skye-summit-v5`).

**Repo changes in this refresh:**

| Change | GSC benefit |
|--------|-------------|
| Sitemap `lastmod` from HTML file dates | Accurate recrawl signals (not blanket “today”) |
| `<link rel="sitemap">` on all indexable pages | Easier sitemap discovery from every URL |
| `vercel.json` rewrites for 6 master-plan guides | Consistent 200s for guide URLs |
| Expanded `audit:urls` | CI/manual check of guides + sitemap/robots/verification file |

## Environment variable

| Variable | Purpose |
|----------|---------|
| `GOOGLE_SITE_VERIFICATION` | Meta tag `content` value (defaults to the token above) |

Set in Vercel only if you rotate verification for a new GSC property.
