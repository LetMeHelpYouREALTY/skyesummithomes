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

### 5. Image CDN (`images.skyesummithomes.com`) — optional, orange-cloud OK

Keep **www** and apex on **DNS only** (Vercel). The image hostname is a separate Cloudflare Worker and **can** be proxied.

- [ ] Add DNS CNAME: `images` → the Worker route (or `skyesummithomes-images.<account>.workers.dev`)
- [ ] Proxy status: **Proxied** (orange cloud)
- [ ] Deploy `cloudflare/skyesummithomes-images` (`npx wrangler deploy`)
- [ ] Enable Image Resizing / Transformations on the zone
- [ ] Set Vercel env `CLOUDFLARE_IMAGES_ENABLED=1` and `CLOUDFLARE_IMAGES_HOST=https://images.skyesummithomes.com`
- [ ] Optional upload to Cloudflare Images: `CLOUDFLARE_API_TOKEN` + `npm run images:cloudflare`

Git `/images/` on Vercel remains the origin backup. Until the env flag is set, HTML uses those git paths.

---

**Estimated Time**: 15-20 minutes  
**DNS Propagation**: 24-48 hours  
**SEO Impact**: Redirect issue should resolve within 1-2 weeks

