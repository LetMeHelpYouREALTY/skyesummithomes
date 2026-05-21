#!/usr/bin/env node
/**
 * Regenerates sitemap.xml from core routes + guide slugs.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const { GUIDE_SLUGS } = require('../lib/guide-nav');

const root = path.join(__dirname, '..');
const today = new Date().toISOString().slice(0, 10);

const ROUTES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/about', priority: '0.9', changefreq: 'monthly' },
  { loc: '/community', priority: '0.9', changefreq: 'monthly' },
  ...GUIDE_SLUGS.map((slug) => ({
    loc: `/${slug}`,
    priority: slug.includes('faq') || slug.includes('realtor') ? '0.9' : '0.82',
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

const urls = ROUTES.map(
  (r) => `    <url>
        <loc>${C.SITE}${r.loc === '/' ? '/' : r.loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${r.changefreq}</changefreq>
        <priority>${r.priority}</priority>
    </url>`
).join('\n\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${urls}

</urlset>
`;

fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log(`update-sitemap: wrote ${ROUTES.length} URL(s), lastmod ${today}`);
