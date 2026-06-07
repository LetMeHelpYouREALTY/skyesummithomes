# Google Search Console — Setup for skyesummithomes.com

This site is prepared for [Google Search Console](https://search.google.com/search-console) with **www** as the canonical host.

## What is already in the repo

| Item | Location / URL |
|------|----------------|
| Sitemap | `https://www.skyesummithomes.com/sitemap.xml` |
| Robots | `https://www.skyesummithomes.com/robots.txt` |
| DNS verification (TXT) | `google-site-verification=wKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI` (Cloudflare — see `CLOUDFLARE-DNS-SETUP.md`) |
| HTML file verification | `/googlewKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI.html` |
| HTML meta verification | Injected on every page at build via `scripts/inject-gsc-verification.js` |
| Apex → www redirects | `vercel.json` + client script on homepage |
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

## 5. Link Analytics (optional)

1. Search Console → **Settings** → **Associations**
2. Link your **Google Analytics 4** property when GA4 is added to the site (`SETUP-INSTRUCTIONS.md`).

## 6. Monitor known issues

| Issue | Doc |
|-------|-----|
| Apex 404s (`/invest`, `/buy`, etc.) | `GSC-404-FIX.md` |
| “Alternate page with proper canonical” on non-www | `GSC-404-FIX.md` — fix apex 301 |
| **“Page with redirect”** (http/apex homepage URLs) | See below |
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

## 7. Ongoing maintenance

When you add a new public page:

1. Add a `<url>` entry in `sitemap.xml` (www URL, no trailing slash except homepage `/`).
2. Set `<lastmod>` to the publish date.
3. Redeploy; resubmit sitemap in Search Console if needed.
4. Run `npm run validate:gsc` before merging.

## Environment variable

| Variable | Purpose |
|----------|---------|
| `GOOGLE_SITE_VERIFICATION` | Meta tag `content` value (defaults to the token above) |

Set in Vercel only if you rotate verification for a new GSC property.
