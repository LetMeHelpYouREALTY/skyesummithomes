/**
 * Image CDN for skyesummithomes.com.
 *
 * Hostname: images.skyesummithomes.com (Cloudflare proxied — OK; this is not the Vercel apex/www).
 * Origin backup: git files on https://www.skyesummithomes.com/images/...
 *
 * GET /images/hero/sunset-home.jpg?w=1600&q=80
 * → fetch origin + Cloudflare Image Resizing (cf.image)
 *
 * Docs: https://developers.cloudflare.com/images/transform-images/transform-via-workers/
 */
const ORIGIN = 'https://www.skyesummithomes.com';

function pickFormat(accept) {
  if (/image\/avif/i.test(accept)) return 'avif';
  if (/image\/webp/i.test(accept)) return 'webp';
  return 'jpeg';
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return new Response('ok', { status: 200 });
    }

    if (!url.pathname.startsWith('/images/')) {
      return new Response('Not found', { status: 404 });
    }

    const originUrl = ORIGIN + url.pathname;
    const width = Math.min(2400, Math.max(160, parseInt(url.searchParams.get('w') || '1600', 10) || 1600));
    const quality = Math.min(95, Math.max(40, parseInt(url.searchParams.get('q') || '80', 10) || 80));
    const format = pickFormat(request.headers.get('Accept') || '');

    const upstream = await fetch(originUrl, {
      cf: {
        image: {
          width,
          quality,
          fit: 'scale-down',
          format,
        },
        cacheTtl: 31536000,
        cacheEverything: true,
      },
    });

    if (!upstream.ok) {
      const fallback = await fetch(originUrl);
      return fallback;
    }

    const headers = new Headers(upstream.headers);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Vary', 'Accept');
    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
