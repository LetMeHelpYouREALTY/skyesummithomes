---
name: las-vegas-zip-code-map
description: >-
  Adds an interactive Las Vegas Valley zip code directory and optional Google Maps
  overlay (circles + labeled markers), plus a /search?zip= hub and contact deep links
  for real estate sites. Covers static HTML (Vercel) and adaptation for Next.js App Router.
  Use when the user asks for a zip code map page, valley zip directory, search by zip,
  or porting the Skye Summit Homes las-vegas-zip-code-map pattern to another domain.
---

# Las Vegas Zip Code Map (reusable site pattern)

## Purpose

Deliver a **local SEO** page that lists Las Vegas Valley zip codes by region, filters by search/tabs, links to **search hub** and **contact** with `?zip=`, optionally loads **Google Maps JavaScript API** with approximate centroids per zip, and follows **NAP/schema** rules for Dr. Jan Duffy–style brokerage sites.

Reference implementation in this repo: `las-vegas-zip-code-map/index.html` + `las-vegas-zip-code-map/zip-map.js`, `search/index.html`, `contact` zip prefill.

## Stack branches

| Stack | What to do |
|-------|------------|
| **Static HTML + Vercel** | Add folder routes + `vercel.json` rewrites; no build step for the map key unless you add a small inject script. |
| **Next.js App Router** | Add `app/las-vegas-zip-code-map/page.tsx` (or route group); load Maps via `next/script` or dynamic import; put **public** Maps key in `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and pass to client map component; add `images`/CSP for `maps.googleapis.com` if using strict CSP. |

## File layout (static)

```
las-vegas-zip-code-map/
  index.html          # Uses site /styles.css + /script.js, shared header/footer; scoped inline CSS (--zip-* vars); <meta name="google-maps-api-key">
  zip-map.js          # zipData[], zipCoords{}, filters, renderCards, initMap, Maps loader (targets .zip-map-region-tab, #zipGrid, etc.)
search/
  index.html          # Hub: reads ?zip=, CTAs to listings / buy / contact?zip= / map
```

**Global chrome:** Prefer the same header/nav, footer, skip-link, back-to-top, and Font Awesome as other marketing pages. **Scope** map-specific classes (e.g. `.zip-map-hero`, `.zip-map-page-cta`) so they do not collide with global `.hero` (100vh) or `.cta-section` in `styles.css`.

## SEO and page structure

1. **One H1** per page: the map page topic (e.g. “Las Vegas Valley Zip Code Map”). Do **not** use the agent/broker name as the only H1; use a `<p>` or logo text for branding in the header.
2. **Canonical and `og:url`**: use the production origin (`https://www.example.com/...`) and stay consistent with trailing slash policy used elsewhere on the site.
3. **Breadcrumbs**: visible nav + **BreadcrumbList** JSON-LD. Use the site’s real paths (e.g. `/community` not `/communities/` if that is what exists).
4. **JSON-LD** (typical set):
   - `WebPage` with `author` → `RealEstateAgent` (or `LocalBusiness` if that matches the site’s single graph strategy).
   - `author.worksFor` → **`Organization`** (brokerage name), not nested `RealEstateAgent`.
   - `Map` with `mapType` `https://schema.org/VenueMap` and `about` → City/State.
5. **Content integrity**: do not invent review counts, “500+ team sales,” or unverified sales stats. Align “years experience” with the rest of the site (e.g. 15+ vs 30+).

## Google Maps

1. **API**: Maps **JavaScript** API; enable in Google Cloud; **HTTP referrer** restrict the key to production origin(s) and localhost for dev.
2. **Injection (static)**: `<meta name="google-maps-api-key" content="">` — empty or placeholder shows a **non-interactive placeholder**; production sets `content` to the key (or use a build-time replace from env).
3. **Loader**: append `script` with `callback=initMap`; define **`window.initMap`** before the Maps script runs. On missing/invalid key, render placeholder UI—do not fail silently with a blank box.
4. **Map UX**: `Circle` + invisible `Marker` with zip label; `InfoWindow` with same CTAs as cards. **Pan/zoom** on card click when Maps is loaded (`google.maps.event.trigger(marker, 'click')` only if `window.google` exists).

## Zip data module (`zip-map.js`)

- **`zipData`**: `{ zip, area, region, badge, neighborhoods }` — `region` matches tab filter keys (`las-vegas`, `henderson`, `north-las-vegas`, `summerlin`, `southwest`, `boulder-city`).
- **`zipCoords`**: `{ "89101": { lat, lng }, ... }` — approximate centers for markers (not legal boundaries).
- **Card CTAs** (minimum):
  - Primary: `/search/?zip=NNNNN` (hub).
  - Secondary: `/contact?zip=NNNNN`.
- **`resetFilters`**: expose on `window` if using `onclick` in HTML.

## Search hub (`/search/`)

- Parse `URLSearchParams('zip')`; validate **5-digit** US zip.
- Dynamic **title** and **contact** link: `/contact?zip=NNNNN` when valid; else `/contact`.
- CTAs: **Available homes** (e.g. `/homes-for-sale-...`), **Buy**, **Contact**, **Zip map**; short **MLS/brokerage** disclaimer if IDX/listings are involved.

## Contact integration

- When `?zip=#####` is present: show a **banner** and **prefill** the message field (or first line) with “Interested in homes near zip …” without overwriting user text if they already typed.

## Vercel (static)

Add **rewrites** if clean paths do not resolve to `index.html`:

```json
{ "source": "/search", "destination": "/search/index.html" },
{ "source": "/las-vegas-zip-code-map", "destination": "/las-vegas-zip-code-map/index.html" }
```

Add both URLs to **`sitemap.xml`**.

## Internal discovery

Link from **Communities** (or market) page hero and from **every** shared footer “Quick links” block (same anchor text site-wide, e.g. “Las Vegas zip code map”) so crawlers and users find the route from any page.

## Next.js adaptation checklist

- `generateMetadata` with unique title/description/canonical.
- Client component for map + `useEffect` loader; server component for copy/schema.
- **`next/script`** for Maps or dynamic import with `ssr: false` for map container.
- Extend **CSP** `script-src` / `connect-src` for `https://maps.googleapis.com` and `https://maps.gstatic.com` if the site uses CSP.
- Prefer **`next/image`** only for static assets; Maps tiles use the Maps API, not `next/image`.

## Verification

- Local static server: open `/las-vegas-zip-code-map/`, `/search/?zip=89141`, `/contact?zip=89141`.
- Maps: console clean when key is set; placeholder when key is empty.
- No duplicate H1; breadcrumbs match live routes.

## Copy to a new repo

1. Copy `las-vegas-zip-code-map/` and `search/` (or merge hub into existing search route).
2. Replace all **absolute URLs**, **NAP**, **license**, and **brokerage** with the target site’s single source of truth.
3. Adjust **zip list** if the market scope changes (e.g. only Henderson).
4. Register routes and sitemap; deploy and test referrer-restricted Maps key on production.
