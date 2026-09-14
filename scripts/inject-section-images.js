#!/usr/bin/env node
/**
 * Injects crawlable <figure> photos next to H2/H3 headings on every page.
 * Matches heading copy so each section visual supports the topic (GBP photo signals).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { visualForH2, visualForH3 } = require('../lib/section-images');
const { cdnUrl } = require('../lib/image-cdn');

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

function pictureHtml(visual, { width, height, eager }) {
  const src = cdnUrl(visual.src, { width });
  const base = String(visual.src).replace(/\.(jpe?g|png)$/i, '');
  const webp = `${base}.webp`;
  const webp960 = `${base}-960.webp`;
  const jpg960 = `${base}-960.jpg`;
  const hasWebp = fs.existsSync(path.join(root, webp.replace(/^\//, '')));
  const hasWebp960 = fs.existsSync(path.join(root, webp960.replace(/^\//, '')));
  const hasJpg960 = fs.existsSync(path.join(root, jpg960.replace(/^\//, '')));
  const loading = eager ? 'eager' : 'lazy';
  const alt = escapeAttr(visual.alt);
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

function injectH2(html) {
  return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attrs, inner) => {
    if (/hero-title|page-title|nav-|footer-|aeo-quick-answer|aeo-core-/i.test(attrs + inner)) {
      return full;
    }
    const visual = visualForH2(inner);
    if (!visual) return full;
    return `${full}${h2Figure(visual)}`;
  });
}

function injectH3FeaturesSafer(html) {
  return html.replace(
    /<div class="feature"[^>]*>[\s\S]*?<\/div>/gi,
    (block) => {
      if (block.includes(FEATURE_BEGIN)) return block;
      const h3 = block.match(/<h3>([\s\S]*?)<\/h3>/i);
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

function processFile(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (
    SKIP_FILES.has(path.basename(filePath)) ||
    /(^|\/)(privacy|terms|mls-disclaimer)(\/|$)/.test(rel)
  ) {
    return false;
  }
  let html = fs.readFileSync(filePath, 'utf8');
  html = stripInjected(html);
  const next = injectH3FeaturesSafer(injectH2(html));
  if (next === html) return false;
  fs.writeFileSync(filePath, next);
  return true;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  if (processFile(filePath)) updated += 1;
}

console.log(`inject-section-images: updated ${updated} HTML file(s); cdn ${cdnUrl('/images/hero/sunset-home.jpg')}`);
