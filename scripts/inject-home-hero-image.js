#!/usr/bin/env node
/**
 * Adds hero photo preload on homepage and community hero background CSS hook.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { PATHS } = require('../lib/site-images');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');

const PRELOAD = `<link rel="preload" href="${PATHS.HERO}" as="image" fetchpriority="high">`;

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/\s*<link rel="preload" href="\/images\/skye-summit-hero\.jpg"[^>]*>\s*/gi, '\n');
  if (!html.includes(PATHS.HERO)) {
    html = html.replace(/<link rel="canonical"[^>]*>/i, (m) => `${m}\n    ${PRELOAD}`);
  }
  fs.writeFileSync(indexPath, html);
}

const heroCss = `
.hero.hero--home{background-image:linear-gradient(155deg,rgba(4,21,38,.88) 0%,rgba(10,37,64,.82) 42%,rgba(30,90,138,.72) 100%),url('${PATHS.HERO}');background-size:cover;background-position:center center}
.home-gallery{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:1.25rem;margin:1.75rem 0 1rem}
.home-gallery__item{margin:0;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 8px 24px rgba(10,37,64,.08)}
.home-gallery__item img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover}
.home-gallery__item figcaption{padding:.75rem 1rem;font-size:.875rem;color:#64748b;background:#fff}
.home-gallery__note{font-size:.85rem;color:#64748b;max-width:48rem;margin:0 auto 1rem;text-align:center}
@media (min-width:768px){.home-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;

let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/\n?\.hero\.hero--home\{background-image:[^}]+\}[\s\S]*?@media \(min-width:768px\)\{\.home-gallery\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)\}\}\n?/g, '\n');
if (!css.includes('home-gallery{display:grid')) {
  css += heroCss;
}
fs.writeFileSync(cssPath, css);

console.log('inject-home-hero-image: homepage preload + hero/gallery CSS applied');
