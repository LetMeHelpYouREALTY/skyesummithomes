# Cloudflare Quick Action Checklist

## ✅ Immediate Actions Required

### 1. Update Root Domain A Record
- [ ] Go to Cloudflare DNS
- [ ] Edit A record for `skyesummithomes.com`
- [ ] Change IP from `216.198.79.1` to Vercel's IP
  - **How to find Vercel IP**: Vercel Dashboard → Project → Settings → Domains → View DNS instructions
  - **OR** Contact Vercel support for your specific IP
- [ ] Keep Proxy status: **DNS only** (gray cloud icon)
- [ ] Save changes

### 2. Create Page Rules (Critical for SEO)

Go to **Rules → Page Rules** in Cloudflare:

**Rule 1: Non-WWW to WWW Redirect**
- [ ] Click "Create Page Rule"
- [ ] URL Pattern: `skyesummithomes.com/*`
- [ ] Settings: Forwarding URL → 301 Permanent Redirect
- [ ] Destination: `https://www.skyesummithomes.com/$1`
- [ ] Save and Deploy

**Rule 2: HTTP to HTTPS Redirect**
- [ ] Click "Create Page Rule"
- [ ] URL Pattern: `http://skyesummithomes.com/*`
- [ ] Settings: Forwarding URL → 301 Permanent Redirect
- [ ] Destination: `https://www.skyesummithomes.com/$1`
- [ ] Save and Deploy

### 3. SSL/TLS Settings
- [ ] Go to **SSL/TLS** in Cloudflare
- [ ] Set encryption mode to: **Full (strict)**
- [ ] Enable: **Always Use HTTPS**
- [ ] Enable: **Automatic HTTPS Rewrites**

### 4. Speed Settings
- [ ] Go to **Speed** → **Optimization**
- [ ] Enable: **Auto Minify** (HTML, CSS, JavaScript)
- [ ] Enable: **Brotli**
- [ ] Go to **Network**
- [ ] Enable: **HTTP/3 (with QUIC)**

## 📋 Current DNS Records (Keep These)

✅ **DO NOT CHANGE** these records:
- CNAME `www` → `1e88402ffbe247ac.vercel-dns-017.com` (DNS only)
- All MX records (email)
- All TXT records (SPF, DMARC, DKIM, Google verification, Vercel verification)

## ⚠️ Important Notes

1. **DNS Propagation**: Changes take 24-48 hours
2. **Page Rules**: Free plan allows 3 rules, Pro allows 20
3. **Proxy Status**: Keep root domain on "DNS only" (gray cloud) to avoid conflicts with Vercel
4. **Testing**: After changes, test redirects:
   - `http://skyesummithomes.com` → should redirect to `https://www.skyesummithomes.com`
   - `https://skyesummithomes.com` → should redirect to `https://www.skyesummithomes.com`

## 🔍 Verification (After 24 Hours)

1. Test redirects:
   ```bash
   curl -I http://skyesummithomes.com
   curl -I https://skyesummithomes.com
   ```
   Both should return: `301 Moved Permanently` → `https://www.skyesummithomes.com`

2. Check Google Search Console:
   - Submit updated sitemap: `https://www.skyesummithomes.com/sitemap.xml`
   - Request re-indexing of homepage
   - Monitor "Page with redirect" issue (should clear in 1-2 weeks)

3. SSL Test:
   - Visit: https://www.ssllabs.com/ssltest/analyze.html?d=www.skyesummithomes.com
   - Should get A or A+ rating

### 5. Cloudflare Images (hosted) — primary storage; git is backup

Keep **www** and apex on **DNS only** (Vercel). Do **not** orange-cloud the site.

Hosted Images (not zone transformations / Polish on www):

`https://imagedelivery.net/byE6BTe9lNqo21V57n4aPQ/<image_id>/<variant>`

Docs: [Overview](https://developers.cloudflare.com/images/) · [Serve uploaded images](https://developers.cloudflare.com/images/optimization/hosted-images/serve-uploaded-images/) · [Predefined variants](https://developers.cloudflare.com/images/optimization/hosted-images/create-variants/) · [Upload via custom path](https://developers.cloudflare.com/images/storage/upload-images/upload-custom-path/)

Named variants created by `npm run images:cloudflare`: `public` (original), `hero` (1600), `section` (1280), `card` (900), `w960` (960), `avatar` (240² cover), `og` (1200×630 cover). Cloudflare picks AVIF/WebP from the browser `Accept` header.

- [ ] Cloudflare dashboard → **Images & Stream → Hosted images**
- [ ] Create an API token with **Images Write**
- [ ] Store it as GitHub repo secret `CLOUDFLARE_API_TOKEN` (production GHA uploads on every `main` deploy)
- [ ] Optional local: `CLOUDFLARE_API_TOKEN=... npm run images:cloudflare`
  (uploads git JPEG/PNG originals with a stable custom ID — companion WebP is skipped because Images transcodes AVIF/WebP — creates variants, enables flexible variants)
- [ ] Rebuild so HTML uses `imagedelivery.net` URLs (`npm run images:inject` or `npm run build`)
- [ ] Optional Worker `images.skyesummithomes.com` for files not yet uploaded (`CLOUDFLARE_IMAGES_ENABLED=1`) — orange-cloud that hostname only

Git `/images/` on Vercel remains the origin backup. Until images are uploaded, HTML keeps those git paths.

---

**Estimated Time**: 15-20 minutes  
**DNS Propagation**: 24-48 hours  
**SEO Impact**: Redirect issue should resolve within 1-2 weeks

