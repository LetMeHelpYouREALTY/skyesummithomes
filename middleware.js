/**
 * Strip legacy site-search `?s=` URLs (old WebSite SearchAction template).
 *
 * vercel.json redirects preserve query strings, which turned
 * /?s=x → /search?s=x → /search?s=x into a 308 loop. Middleware can
 * redirect to a clean absolute URL with no query.
 */
export const config = {
  matcher: ['/', '/index.html', '/search', '/search/'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  if (!url.searchParams.has('s')) {
    return;
  }

  return Response.redirect('https://www.skyesummithomes.com/search', 308);
}
