#!/usr/bin/env node
/**
 * Injects reusable amenity map sections into key pages + maps API meta tag.
 * Runs after generate-clean-urls so flat slug HTML is the source of truth.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { amenityMapSectionHtml } = require('../lib/amenity-map-html');
const { ensureMapsHints } = require('../lib/cdn-hints');

const root = path.join(__dirname, '..');

const TARGETS = [
  { file: 'index.html', heading: "What's Nearby — Life Near Skye Summit", compact: true },
  {
    file: 'community.html',
    slug: 'community',
    heading: 'Life Near Skye Summit',
    compact: true,
  },
  {
    file: 'living-in-skye-summit.html',
    slug: 'living-in-skye-summit',
    heading: 'Life Near Skye Summit',
    compact: true,
  },
  {
    file: 'homes-for-sale-skye-summit.html',
    slug: 'homes-for-sale-skye-summit',
    heading: 'Explore the neighborhood',
    compact: true,
  },
  {
    file: path.join('search', 'index.html'),
    heading: 'Skye Summit area amenities',
    compact: true,
  },
];

const SECTION_RE =
  /\s*<!-- AMENITY_MAP_SECTION_BEGIN -->[\s\S]*?<!-- AMENITY_MAP_SECTION_END -->\s*/gi;

const META_RE = /<meta\s+name="google-maps-api-key"\s+content="[^"]*"\s*\/?>/i;

function ensureMeta(html) {
  if (META_RE.test(html)) return html;
  const tag = '<meta name="google-maps-api-key" content="">';
  if (/<link rel="canonical"/i.test(html)) {
    return html.replace(/<link rel="canonical"[^>]*>/i, (m) => `${m}\n    ${tag}`);
  }
  return html.replace(/<\/head>/i, `    ${tag}\n</head>`);
}

function injectSection(html, opts) {
  const block = amenityMapSectionHtml(opts);
  const cleaned = html.replace(SECTION_RE, '\n');
  if (/<!-- AMENITY_MAP_ANCHOR -->/.test(cleaned)) {
    return cleaned.replace(
      /<!-- AMENITY_MAP_ANCHOR -->/,
      `${block}\n        <!-- AMENITY_MAP_ANCHOR -->`
    );
  }
  if (/<section class="cta-section"/i.test(cleaned)) {
    return cleaned.replace(/(\s*)(<section class="cta-section")/i, `${block}$1$2`);
  }
  if (/<footer/i.test(cleaned)) {
    return cleaned.replace(/(\s*)(<footer)/i, `${block}$1$2`);
  }
  return cleaned.replace(/<\/main>/i, `${block}\n    </main>`);
}

function ensureScript(html) {
  if (html.includes('/nearby-amenities/amenity-map.js')) return html;
  if (/<script src="\/script\.js"/i.test(html)) {
    return html.replace(
      /<script src="\/script\.js"[^>]*><\/script>/i,
      (m) => `${m}\n    <script src="/nearby-amenities/amenity-map.js" defer></script>`
    );
  }
  return html.replace(
    /<\/body>/i,
    '    <script src="/nearby-amenities/amenity-map.js" defer></script>\n</body>'
  );
}

function syncSlugIndex(slug, html) {
  const dir = path.join(root, slug);
  const dest = path.join(dir, 'index.html');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, html);
}

let updated = 0;

for (const target of TARGETS) {
  const filePath = path.join(root, target.file);
  if (!fs.existsSync(filePath)) {
    console.warn('inject-amenity-map-sections: missing', target.file);
    continue;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  html = injectSection(html, {
    heading: target.heading,
    compact: target.compact,
    showFullLink: true,
  });
  html = ensureMeta(html);
  html = ensureMapsHints(html, { preconnect: false });
  html = ensureScript(html);
  fs.writeFileSync(filePath, html);
  if (target.slug) {
    syncSlugIndex(target.slug, html);
  }
  updated += 1;
}

console.log(`inject-amenity-map-sections: updated ${updated} page(s)`);
