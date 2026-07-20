#!/usr/bin/env node
/**
 * Mobile PageSpeed wins applied sitewide:
 * - Font Awesome: async (media=print onload) instead of render-blocking
 * - Montserrat: drop weight 300 (keep 400/600/700)
 * - Ensure picture CSS for hero/portrait
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const FA =
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
const FONT_OLD = 'family=Montserrat:wght@300;400;600;700';
const FONT_NEW = 'family=Montserrat:wght@400;600;700';

const ASYNC_FA = `<!-- Font Awesome: deferred -->
    <link href="${FA}" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="${FA}" rel="stylesheet"></noscript>`;

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
  'lib',
  'research',
]);

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

function hasAsyncFa(html) {
  return (
    /font-awesome\/6\.0\.0\/css\/all\.min\.css[^>]*media=["']print["']/i.test(
      html
    ) ||
    /media=["']print["'][^>]*font-awesome\/6\.0\.0\/css\/all\.min\.css/i.test(
      html
    )
  );
}

let updated = 0;
for (const file of listHtmlFiles(root)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  // Strip all Font Awesome link + noscript pairs, then re-add async once
  html = html.replace(
    /\s*(?:<!--\s*Font Awesome[\s\S]*?-->\s*)?<link[^>]*font-awesome\/6\.0\.0\/css\/all\.min\.css[^>]*>\s*(?:<noscript>\s*<link[^>]*font-awesome[^>]*>\s*<\/noscript>\s*)?/gi,
    '\n'
  );

  if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `    ${ASYNC_FA}\n</head>`);
  }

  html = html.split(FONT_OLD).join(FONT_NEW);

  if (html !== before) {
    fs.writeFileSync(file, html);
    updated += 1;
  }
}

const cssPath = path.join(root, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(
  /\/\* MOBILE_PSI_IMAGES \*\/[\s\S]*?\/\* MOBILE_PSI_IMAGES_END \*\//g,
  ''
);
css =
  css.trimEnd() +
  `
/* MOBILE_PSI_IMAGES */
.hero-media picture{display:block;width:100%;height:100%}
.hero-media picture .hero-media__img{display:block;width:100%;height:100%;object-fit:cover;object-position:35% center}
.hero-agent picture{display:block;width:100%;height:100%}
/* MOBILE_PSI_IMAGES_END */
`;
fs.writeFileSync(cssPath, css);

console.log(
  `optimize-mobile-psi: updated ${updated} HTML file(s); async FA + lighter fonts + picture CSS`
);
