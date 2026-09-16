#!/usr/bin/env node
/**
 * Injects crawlable <figure> photos next to H2/H3 headings on every page.
 * Matches heading copy so each section visual supports the topic (GBP photo signals).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { visualForH2, visualForH3 } = require('../lib/section-images');
const { cdnUrl, isHosted, hostedSrcset } = require('../lib/image-cdn');

const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
  'lib',
  'images',
]);

const SKIP_FILES = new Set([
  '404.html',
  'privacy.html',
  'terms.html',
  'mls-disclaimer.html',
]);

const MEDIA_BEGIN = '<!-- SECTION_VISUAL_BEGIN -->';
const MEDIA_END = '<!-- SECTION_VISUAL_END -->';
const FEATURE_BEGIN = '<!-- FEATURE_VISUAL_BEGIN -->';
const FEATURE_END = '<!-- FEATURE_VISUAL_END -->';

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

function headingText(inner) {
  return String(inner || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shouldSkipH2(attrs, inner) {
  const blob = `${attrs} ${inner}`;
  if (
    /hero-title|page-title|nav-|footer-|aeo-quick-answer|aeo-core-|geo-context|sr-only|realscout-listings|visually-hidden/i.test(
      blob
    )
  ) {
    return true;
  }
  const text = headingText(inner);
  if (/^in plain terms$/i.test(text)) return true;
  if (/homes you can tour now/i.test(text)) return true;
  if (/local context$/i.test(text)) return true;
  if (/^map$/i.test(text)) return true;
  return false;
}

function pictureHtml(visual, { width, height, eager }) {
  const loading = eager ? 'eager' : 'lazy';
  const alt = escapeAttr(visual.alt);
  if (isHosted(visual.src)) {
    const src = cdnUrl(visual.src, { width });
    const srcset = hostedSrcset(
      visual.src,
      Number(width) <= 900 ? [width] : [960, width]
    );
    const sizes =
      Number(width) <= 900
        ? '(max-width: 768px) 100vw, 420px'
        : '(max-width: 768px) 100vw, 920px';
    return `<img class="section-visual__img" src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" width="${width}" height="${height}" loading="${loading}" decoding="async">`;
  }
  const src = cdnUrl(visual.src, { width });
  const base = String(visual.src).replace(/\.(jpe?g|png)$/i, '');
  const webp = `${base}.webp`;
  const webp960 = `${base}-960.webp`;
  const jpg960 = `${base}-960.jpg`;
  const hasWebp = fs.existsSync(path.join(root, webp.replace(/^\//, '')));
  const hasWebp960 = fs.existsSync(path.join(root, webp960.replace(/^\//, '')));
  const hasJpg960 = fs.existsSync(path.join(root, jpg960.replace(/^\//, '')));
  const webpSrcset = [
    hasWebp960 ? `${cdnUrl(webp960, { width: 960 })} 960w` : null,
    hasWebp ? `${cdnUrl(webp, { width })} 1280w` : null,
  ]
    .filter(Boolean)
    .join(', ');
  const jpgSrcset = [
    hasJpg960 ? `${cdnUrl(jpg960, { width: 960 })} 960w` : null,
    `${src} 1280w`,
  ]
    .filter(Boolean)
    .join(', ');

  const img = `<img class="section-visual__img" src="${hasJpg960 ? cdnUrl(jpg960, { width: 960 }) : src}" srcset="${jpgSrcset}" sizes="(max-width: 768px) 100vw, 920px" alt="${alt}" width="${width}" height="${height}" loading="${loading}" decoding="async">`;
  if (webpSrcset) {
    return `<picture><source type="image/webp" srcset="${webpSrcset}" sizes="(max-width: 768px) 100vw, 920px">${img}</picture>`;
  }
  return img;
}

function h2Figure(visual) {
  return `
            ${MEDIA_BEGIN}
            <figure class="section-visual" data-geo-place="Skye Summit Master Plan, Las Vegas, NV">
                ${pictureHtml(visual, { width: 1280, height: 720, eager: false })}
                <figcaption class="section-visual__caption">${escapeHtml(visual.caption)}</figcaption>
            </figure>
            ${MEDIA_END}`;
}

function h3Figure(visual) {
  return `${FEATURE_BEGIN}<figure class="feature-visual">
                ${pictureHtml(visual, { width: 900, height: 675, eager: false })}
                <figcaption class="visually-hidden">${escapeHtml(visual.caption)}</figcaption>
            </figure>${FEATURE_END}`;
}

function stripInjected(html) {
  return html
    .replace(new RegExp(`\\s*${MEDIA_BEGIN}[\\s\\S]*?${MEDIA_END}\\s*`, 'gi'), '\n')
    .replace(new RegExp(`${FEATURE_BEGIN}[\\s\\S]*?${FEATURE_END}`, 'gi'), '');
}

function injectH2(html, unmatched) {
  return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    if (shouldSkipH2(attrs, inner)) return full;
    const visual = visualForH2(inner);
    if (!visual) {
      unmatched.add(headingText(inner));
      return full;
    }
    return `${full}${h2Figure(visual)}`;
  });
}

function injectFeatureBlocks(html) {
  return html.replace(
    /<div class="feature"[^>]*>[\s\S]*?<\/div>/gi,
    (block) => {
      if (block.includes(FEATURE_BEGIN)) return block;
      const h3 = block.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
      if (!h3) return block;
      const visual = visualForH3(h3[1]);
      if (!visual) return block;
      return block.replace(
        /(<div class="feature"[^>]*>)/i,
        `$1\n                    ${h3Figure(visual)}\n`
      );
    }
  );
}

function injectServiceCards(html) {
  return html.replace(
    /<a\b([^>]*class="[^"]*service-card(?!--)[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi,
    (full, attrs, inner) => {
      if (/service-card-small|service-card-title/.test(attrs)) return full;
      if (inner.includes(FEATURE_BEGIN)) return full;
      const h3 = inner.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
      if (!h3) return full;
      const visual = visualForH3(h3[1]);
      if (!visual) return full;
      return `<a${attrs}>\n                    ${h3Figure(visual)}\n${inner}</a>`;
    }
  );
}

function processFile(filePath, unmatched) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (
    SKIP_FILES.has(path.basename(filePath)) ||
    /(^|\/)(privacy|terms|mls-disclaimer)(\/|$)/.test(rel)
  ) {
    return false;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripInjected(html);
  const next = injectServiceCards(injectFeatureBlocks(injectH2(html, unmatched)));
  if (next === html) return false;
  fs.writeFileSync(filePath, next);
  return true;
}

const unmatched = new Set();
let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  if (processFile(filePath, unmatched)) updated += 1;
}

const leftover = [...unmatched].sort();
console.log(
  `inject-section-images: updated ${updated} HTML file(s); cdn ${cdnUrl('/images/hero/sunset-home.jpg')}`
);
if (leftover.length) {
  console.log(`inject-section-images: unmatched H2 (${leftover.length}): ${leftover.join(' | ')}`);
}
