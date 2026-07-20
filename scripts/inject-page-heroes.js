#!/usr/bin/env node
/**
 * Injects full-bleed, crawlable hero <img> + ImageObject JSON-LD on every page.
 * Aligns with Google Discover (≥1200px), vibe-coded SEO (real HTML, full URLs),
 * and GEO/AEO alt + caption metadata.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const {
  heroForFile,
  absoluteUrl,
  imageObjectJsonLd,
} = require('../lib/hero-images');

const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
]);

const MEDIA_BEGIN = '<!-- PAGE_HERO_MEDIA_BEGIN -->';
const MEDIA_END = '<!-- PAGE_HERO_MEDIA_END -->';
const SCHEMA_BEGIN = '<!-- PAGE_HERO_SCHEMA_BEGIN -->';
const SCHEMA_END = '<!-- PAGE_HERO_SCHEMA_END -->';

function listHtmlFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.')) continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIRS.has(name.name)) continue;
      listHtmlFiles(full, out);
      continue;
    }
    if (name.isFile() && name.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function stripBlocks(html) {
  return html
    .replace(
      new RegExp(
        `\\s*${MEDIA_BEGIN}[\\s\\S]*?${MEDIA_END}\\s*`,
        'gi'
      ),
      '\n'
    )
    .replace(
      new RegExp(
        `\\s*${SCHEMA_BEGIN}[\\s\\S]*?${SCHEMA_END}\\s*`,
        'gi'
      ),
      '\n'
    )
    .replace(
      /\s*<img[^>]*class="[^"]*hero-media__img[^"]*"[^>]*>\s*/gi,
      '\n'
    )
    .replace(/\s*<div class="hero-overlay"[^>]*>\s*<\/div>\s*/gi, '\n');
}

function mediaHtml(hero, { priority }) {
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? ' fetchpriority="high"' : '';
  return `${MEDIA_BEGIN}
            <figure class="hero-media" data-geo-place="Skye Summit Master Plan, Las Vegas, NV">
                <img class="hero-media__img" src="${hero.src}" alt="${escapeAttr(
    hero.alt
  )}" width="1600" height="900" decoding="async" loading="${loading}"${fetchPriority}>
                <figcaption class="hero-media__caption visually-hidden">${escapeHtml(
                  hero.caption
                )}</figcaption>
            </figure>
            <div class="hero-media__shade" aria-hidden="true"></div>
            ${MEDIA_END}`;
}

function schemaHtml(hero) {
  const json = JSON.stringify(imageObjectJsonLd(hero), null, 2);
  return `${SCHEMA_BEGIN}
    <script type="application/ld+json" data-hero-imageobject>
${json}
    </script>
    ${SCHEMA_END}`;
}

function escapeAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function ensureMaxImagePreview(html) {
  if (/max-image-preview\s*:\s*large/i.test(html)) return html;
  if (/name=["']robots["']/i.test(html)) {
    return html.replace(
      /(<meta\s+name=["']robots["']\s+content=["'])([^"']*)(["'])/i,
      (m, a, content, c) => {
        if (/max-image-preview/i.test(content)) return m;
        const next = content.trim().replace(/,?\s*$/, '');
        return `${a}${next}, max-image-preview:large${c}`;
      }
    );
  }
  return html.replace(
    /<meta\s+charset=["'][^"']+["']\s*\/?>/i,
    (m) =>
      `${m}\n    <meta name="robots" content="index, follow, max-image-preview:large">`
  );
}

function setOgImage(html, hero) {
  const imageUrl = absoluteUrl(hero.src);
  let next = html;
  const pairs = [
    ['property', 'og:image'],
    ['name', 'twitter:image'],
  ];
  for (const [attr, key] of pairs) {
    const re = new RegExp(
      `(<meta\\s+${attr}=["']${key}["']\\s+content=")[^"]*(")`,
      'i'
    );
    if (re.test(next)) {
      next = next.replace(re, `$1${imageUrl}$2`);
    } else {
      next = next.replace(
        /<link rel="canonical"[^>]*>/i,
        (m) =>
          `${m}\n    <meta ${attr}="${key}" content="${imageUrl}">`
      );
    }
  }
  // Discover-friendly dimensions
  if (!/property=["']og:image:width["']/i.test(next)) {
    next = next.replace(
      /(<meta\s+property=["']og:image["'][^>]*>)/i,
      `$1\n    <meta property="og:image:width" content="1600">\n    <meta property="og:image:height" content="900">`
    );
  } else {
    next = next
      .replace(
        /(<meta\s+property=["']og:image:width["']\s+content=")[^"]*(")/i,
        '$11600$2'
      )
      .replace(
        /(<meta\s+property=["']og:image:height["']\s+content=")[^"]*(")/i,
        '$1900$2'
      );
  }
  return next;
}

function injectIntoHeroSection(html, media, sectionRe) {
  if (!sectionRe.test(html)) return { html, ok: false };
  const next = html.replace(sectionRe, (openTag) => {
    let tag = openTag;
    if (!/\bhero--photo\b/.test(tag)) {
      tag = tag.replace(
        /class="([^"]*)"/i,
        (m, cls) => `class="${cls} hero--photo"`
      );
    }
    return `${tag}\n            ${media}`;
  });
  return { html: next, ok: next !== html };
}

function processFile(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const hero = heroForFile(rel);
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripBlocks(html);

  const isHome = rel === 'index.html';
  const media = mediaHtml(hero, { priority: isHome });
  const schema = schemaHtml(hero);

  let injected = false;
  const sectionMatchers = [
    /<section\b[^>]*class="[^"]*\bhero\b[^"]*"[^>]*>/i,
    /<section\b[^>]*class="[^"]*\bservice-hero\b[^"]*"[^>]*>/i,
    /<section\b[^>]*class="[^"]*\b(?:loc-hero|zip-map-hero|search-hub-hero)\b[^"]*"[^>]*>/i,
  ];
  for (const re of sectionMatchers) {
    if (injected) break;
    const result = injectIntoHeroSection(html, media, re);
    html = result.html;
    injected = result.ok;
  }

  // Schema before </head>
  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `    ${schema}\n</head>`);
  }

  html = ensureMaxImagePreview(html);
  html = setOgImage(html, hero);

  // Homepage LCP preload
  if (isHome) {
    html = html.replace(
      /\s*<link rel="preload" href="\/images\/[^"]+" as="image"[^>]*>\s*/gi,
      '\n'
    );
    html = html.replace(
      /<link rel="canonical"[^>]*>/i,
      (m) =>
        `${m}\n    <link rel="preload" href="${hero.src}" as="image" fetchpriority="high">`
    );
  }

  fs.writeFileSync(filePath, html);
  return injected;
}

let updated = 0;
let withMedia = 0;
for (const filePath of listHtmlFiles(root)) {
  const ok = processFile(filePath);
  updated += 1;
  if (ok) withMedia += 1;
}

console.log(
  `inject-page-heroes: processed ${updated} HTML file(s); hero media on ${withMedia}; site ${C.SITE}`
);
