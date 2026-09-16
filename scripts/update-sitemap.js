#!/usr/bin/env node
/**
 * Regenerates sitemap.xml from core routes + guide slugs.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const { GUIDE_SLUGS } = require('../lib/guide-nav');
const { heroForFile, absoluteUrl } = require('../lib/hero-images');

const root = path.join(__dirname, '..');
const today = new Date().toISOString().slice(0, 10);

function resolveHtmlPath(loc) {
  if (loc === '/') {
    return path.join(root, 'index.html');
  }
  const slug = loc.slice(1);
  const nested = path.join(root, slug, 'index.html');
  if (fs.existsSync(nested)) {
    return nested;
  }
  const flat = path.join(root, `${slug}.html`);
  if (fs.existsSync(flat)) {
    return flat;
  }
  return null;
}

function lastmodForRoute(loc) {
  const htmlPath = resolveHtmlPath(loc);
  if (!htmlPath) {
    return today;
  }
  return fs.statSync(htmlPath).mtime.toISOString().slice(0, 10);
}

const ROUTES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/about', priority: '0.9', changefreq: 'monthly' },
  { loc: '/community', priority: '0.9', changefreq: 'monthly' },
  ...GUIDE_SLUGS.map((slug) => ({
    loc: `/${slug}`,
    priority:
      slug === 'skye-summit-master-plan'
        ? '0.95'
        : slug.includes('interest-list') || slug.includes('kb-home')
          ? '0.9'
          : slug.includes('faq') || slug.includes('realtor')
            ? '0.9'
            : '0.82',
    changefreq: 'monthly',
  })),
  { loc: '/las-vegas-zip-code-map', priority: '0.85', changefreq: 'monthly' },
  { loc: '/search', priority: '0.75', changefreq: 'monthly' },
  { loc: '/sell', priority: '0.9', changefreq: 'monthly' },
  { loc: '/buy', priority: '0.9', changefreq: 'monthly' },
  { loc: '/valuation', priority: '0.9', changefreq: 'monthly' },
  { loc: '/invest', priority: '0.8', changefreq: 'monthly' },
  { loc: '/relocate', priority: '0.8', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.9', changefreq: 'monthly' },
  { loc: '/office-location', priority: '0.85', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.7', changefreq: 'weekly' },
  { loc: '/homes-for-sale-skye-summit', priority: '0.85', changefreq: 'weekly' },
  { loc: '/privacy', priority: '0.4', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.4', changefreq: 'yearly' },
  { loc: '/mls-disclaimer', priority: '0.5', changefreq: 'yearly' },
];

const urls = ROUTES.map((r) => {
  const htmlPath =
    r.loc === '/'
      ? 'index.html'
      : `${r.loc.slice(1)}.html`;
  const hero = heroForFile(htmlPath);
  const imageLoc = absoluteUrl(hero.src);
  return `    <url>
        <loc>${C.SITE}${r.loc === '/' ? '/' : r.loc}</loc>
        <lastmod>${lastmodForRoute(r.loc)}</lastmod>
        <changefreq>${r.changefreq}</changefreq>
        <priority>${r.priority}</priority>
        <image:image>
            <image:loc>${imageLoc}</image:loc>
            <image:title>${escapeXml(hero.name || C.GBP_BUSINESS_NAME)}</image:title>
            <image:caption>${escapeXml(hero.caption || hero.alt)}</image:caption>
            <image:geo_location>Las Vegas, NV</image:geo_location>
        </image:image>
    </url>`;
}).join('\n\n');

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${urls}

</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`update-sitemap: wrote ${ROUTES.length} URL(s), lastmod ${today}`);
