#!/usr/bin/env node
/**
 * Homepage hero preload + shared hero-media / gallery CSS.
 * Overlays stay light so the photo remains the dominant visual (Discover + UX).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { heroForFile } = require('../lib/hero-images');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');

const homeHero = heroForFile('index.html');
const PRELOAD = `<link rel="preload" href="${homeHero.src}" as="image" fetchpriority="high">`;

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(
    /\s*<link rel="preload" href="\/images\/[^"]+" as="image"[^>]*>\s*/gi,
    '\n'
  );
  if (!html.includes(`href="${homeHero.src}"`)) {
    html = html.replace(
      /<link rel="canonical"[^>]*>/i,
      (m) => `${m}\n    ${PRELOAD}`
    );
  }
  fs.writeFileSync(indexPath, html);
}

const heroCss = `
/* Full-bleed hero photos — light shade so imagery stays visible */
.hero.hero--photo,.service-hero.hero--photo,.loc-hero.hero--photo,.zip-map-hero.hero--photo,.search-hub-hero.hero--photo{position:relative;overflow:hidden;isolation:isolate;background:#0a2540}
.hero-media{position:absolute;inset:0;margin:0;z-index:0}
.hero-media__img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
.hero-media__shade{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(155deg,rgba(4,21,38,.42) 0%,rgba(10,37,64,.28) 45%,rgba(10,37,64,.48) 100%)}
.hero.hero--photo .hero-content,.service-hero.hero--photo .container,.loc-hero.hero--photo .container,.zip-map-hero.hero--photo .container,.search-hub-hero.hero--photo .container{position:relative;z-index:2}
.hero.hero--home.hero--photo{background-image:none}
.hero.hero--home.hero--photo::before{opacity:.25}
.hero.hero--photo .hero-overlay{display:none}
.visually-hidden{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.home-gallery{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:1.25rem;margin:1.75rem 0 1rem}
.home-gallery__item{margin:0;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 8px 24px rgba(10,37,64,.08)}
.home-gallery__item img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover}
.home-gallery__item figcaption{padding:.75rem 1rem;font-size:.875rem;color:#64748b;background:#fff}
.home-gallery__note{font-size:.85rem;color:#64748b;max-width:48rem;margin:0 auto 1rem;text-align:center}
@media (min-width:768px){.home-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;

let css = fs.readFileSync(cssPath, 'utf8');
// Remove legacy heavy CSS-background hero rule and prior injected gallery/hero-media blocks
css = css.replace(
  /\n?\.hero\.hero--home\{background-image:[^}]+\}[\s\S]*?@media \(min-width:768px\)\{\.home-gallery\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)\}\}\n?/g,
  '\n'
);
css = css.replace(
  /\n?\/\* Full-bleed hero photos[\s\S]*?@media \(min-width:768px\)\{\.home-gallery\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)\}\}\n?/g,
  '\n'
);
if (!css.includes('.hero-media__img{')) {
  css += heroCss;
}
fs.writeFileSync(cssPath, css);

console.log(
  'inject-home-hero-image: light hero-media CSS + homepage preload applied'
);
