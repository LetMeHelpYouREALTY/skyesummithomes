# Patch for `palms-place-listing-injector` (apex landing → 404 in GSC)

Add at the **start** of the `fetch()` handler (after `const url = new URL(request.url);`):

```javascript
// Skye Summit: never serve generic landing on apex; send to www (Vercel).
if (url.hostname === "skyesummithomes.com") {
  const target = new URL(request.url);
  target.hostname = "www.skyesummithomes.com";
  target.protocol = "https:";
  return Response.redirect(target.toString(), 301);
}
```

Add to `COMMUNITY_MAP`:

```javascript
skyesummithomes: "Skye Summit",
```

Redeploy `palms-place-listing-injector` after editing (Cloudflare dashboard or Wrangler).

**Alternative:** deploy `cloudflare/skyesummithomes-apex-redirect` (this repo) with route `skyesummithomes.com/*` so it runs before the palms injector.
