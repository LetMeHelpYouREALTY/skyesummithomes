#!/usr/bin/env node
/**
 * Places Dr. Jan Duffy’s circular brand portrait in every page hero content
 * (identity in the content stack — not a floating sticker on hero media).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');

const root = path.join(__dirname, '..');
const PORTRAIT_SRC = '/images/brand/dr-jan-hero-portrait.webp';
const PORTRAIT_FALLBACK = '/images/brand/dr-jan-hero-portrait.png';
const BEGIN = '<!-- HERO_AGENT_PORTRAIT_BEGIN -->';
const END = '<!-- HERO_AGENT_PORTRAIT_END -->';

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
]);

const ALT = `${C.AGENT_NAME}, ${C.AGENT_TITLE} — Skye Summit Homes ${C.AGENT_ROLE}, ${C.CITY}, ${C.REGION}`;

function portraitHtml(priority) {
  // Never compete with LCP hero photo for fetchpriority
  const loading = priority ? 'eager' : 'lazy';
  const alt = ALT.replace(/"/g, '&quot;');
  return `${BEGIN}
                <figure class="hero-agent">
                    <picture>
                      <source type="image/webp" srcset="${PORTRAIT_SRC}">
                      <img class="hero-agent__img" src="${PORTRAIT_FALLBACK}" alt="${alt}" width="120" height="120" decoding="async" loading="${loading}">
                    </picture>
                    <figcaption class="hero-agent__caption">${C.AGENT_NAME}, ${C.AGENT_TITLE}</figcaption>
                </figure>
                ${END}`;
}

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

function stripPortrait(html) {
  return html.replace(
    new RegExp(`\\s*${BEGIN}[\\s\\S]*?${END}\\s*`, 'gi'),
    '\n'
  );
}

function injectPortrait(html, priority) {
  let next = stripPortrait(html);
  const block = portraitHtml(priority);

  // Homepage: inside .hero-content, before kicker/h1
  if (/<div class="hero-content"[^>]*>/i.test(next)) {
    return next.replace(
      /(<div class="hero-content"[^>]*>)/i,
      `$1\n                ${block}`
    );
  }

  // Photo heroes: media block then .container (service / loc / zip / search)
  const afterMediaRe =
    /(<!--\s*PAGE_HERO_MEDIA_END\s*-->\s*<div class="(?:container|zip-map-hero-inner)"[^>]*>)/i;
  if (afterMediaRe.test(next)) {
    return next.replace(afterMediaRe, `$1\n                ${block}`);
  }

  // Fallback: service-style hero with container as first child
  const sectionRe =
    /(<section\b[^>]*class="[^"]*\b(?:service-hero|loc-hero|zip-map-hero|search-hub-hero)\b[^"]*"[^>]*>\s*<div class="container"[^>]*>)/i;
  if (sectionRe.test(next)) {
    return next.replace(sectionRe, `$1\n                ${block}`);
  }

  return next;
}

const cssSnippet = `
/* Dr. Jan brand portrait in hero content */
.hero-agent{margin:0 auto 1rem;max-width:7.5rem;text-align:center;position:relative;z-index:2}
.hero-agent__img{display:block;width:7.5rem;height:7.5rem;margin:0 auto;border-radius:50%;object-fit:cover;box-shadow:0 8px 28px rgba(0,0,0,.28)}
.hero-agent picture{display:block;width:7.5rem;height:7.5rem;margin:0 auto}
.hero-media picture{display:block;width:100%;height:100%}
.hero-media picture .hero-media__img{width:100%;height:100%;object-fit:cover;object-position:35% center}
.hero-agent__caption{margin-top:.5rem;font-size:.8rem;font-weight:600;letter-spacing:.02em;color:rgba(255,255,255,.92)}
.hero.hero--home .hero-agent{margin-bottom:1.1rem}
.service-hero .hero-agent,.loc-hero .hero-agent,.zip-map-hero .hero-agent,.search-hub-hero .hero-agent{margin-top:.25rem}
@media (max-width:480px){.hero-agent__img{width:5.75rem;height:5.75rem}.hero-agent{max-width:5.75rem}}
`;

const cssPath = path.join(root, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(
  /\n?\/\* Dr\. Jan brand portrait in hero content \*\/[\s\S]*?@media \(max-width:480px\)\{\.hero-agent__img\{width:5\.75rem;height:5\.75rem\}\.hero-agent\{max-width:5\.75rem\}\}\n?/g,
  '\n'
);
if (!css.includes('.hero-agent__img{')) {
  css += cssSnippet;
}
fs.writeFileSync(cssPath, css);

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf8');
  const next = injectPortrait(html, rel === 'index.html');
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(
  `inject-hero-agent-portrait: updated ${updated} HTML file(s); CSS ready`
);
