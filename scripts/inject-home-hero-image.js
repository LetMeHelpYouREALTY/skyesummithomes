#!/usr/bin/env node
/**
 * Homepage hero: full-bleed hyperlocal photo (LCP img), preload, and CSS hooks.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { PATHS } = require('../lib/site-images');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const cssPath = path.join(root, 'styles.css');

const PRELOAD = `<link rel="preload" href="${PATHS.HERO}" as="image" fetchpriority="high">`;

const HERO_MEDIA = `
            <div class="hero-media" aria-hidden="true">
                <img class="hero-media__img" src="${PATHS.HERO}" alt="" width="1536" height="1024" fetchpriority="high" decoding="async">
            </div>`;

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  // Preload
  html = html.replace(/\s*<link rel="preload" href="\/images\/skye-summit-hero\.jpg"[^>]*>\s*/gi, '\n');
  if (!html.includes(`href="${PATHS.HERO}"`)) {
    html = html.replace(/<link rel="canonical"[^>]*>/i, (m) => `${m}\n    ${PRELOAD}`);
  }

  // Ensure full-bleed hero media img (idempotent)
  html = html.replace(/\s*<div class="hero-media"[\s\S]*?<\/div>\s*/i, '\n');
  if (/<section id="home" class="hero hero--home"/i.test(html)) {
    html = html.replace(
      /(<section id="home" class="hero hero--home"[^>]*>)/i,
      `$1${HERO_MEDIA}`
    );
  }

  // OG alt for hyperlocal hero
  html = html.replace(
    /(<meta property="og:image:alt" content=")[^"]*(")/i,
    '$1Aerial view of northwest Las Vegas desert homes near Red Rock Canyon — Skye Summit Master Plan$2'
  );

  fs.writeFileSync(indexPath, html);
}

const heroCssBlock = `
.hero.hero--home{position:relative;min-height:min(88vh,920px);overflow:hidden;padding:3.5rem 1rem 4rem;background:#0a2540;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;margin-top:80px}
.hero.hero--home::before{display:none!important;content:none!important}
.hero-media{position:absolute;inset:0;z-index:0}
.hero-media__img{display:block;width:100%;height:100%;object-fit:cover;object-position:center 42%;transform:scale(1.02)}
.hero.hero--home .hero-overlay{z-index:1;background:linear-gradient(160deg,rgba(4,21,38,.78) 0%,rgba(10,37,64,.58) 48%,rgba(10,37,64,.42) 100%)}
.hero.hero--home .hero-content{z-index:2;position:relative;max-width:1100px;padding:0 20px;animation:heroFadeUp .9s ease-out both}
@keyframes heroFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.hero.hero--home .hero-kicker{animation:heroFadeUp .85s ease-out .08s both}
.hero.hero--home .hero-cta-primary{animation:heroFadeUp .9s ease-out .18s both}
.home-gallery{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:1.25rem;margin:1.75rem 0 1rem}
.home-gallery__item{margin:0;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 8px 24px rgba(10,37,64,.08)}
.home-gallery__item img{display:block;width:100%;height:auto;aspect-ratio:3/2;object-fit:cover}
.home-gallery__item figcaption{padding:.75rem 1rem;font-size:.875rem;color:#64748b;background:#fff}
.home-gallery__note{font-size:.85rem;color:#64748b;max-width:48rem;margin:0 auto 1rem;text-align:center}
@media (min-width:768px){.home-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:768px){.hero.hero--home{min-height:min(78vh,780px);padding:2.25rem .75rem 3rem}}
`;

let css = fs.readFileSync(cssPath, 'utf8');

// Strip prior injected hero/gallery block(s)
css = css.replace(
  /\n?\.hero\.hero--home\{background-image:[^}]+\}[\s\S]*?@media \(min-width:768px\)\{\.home-gallery\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)\}\}\n?/g,
  '\n'
);
css = css.replace(
  /\n?\.hero\.hero--home\{position:relative;min-height:[^]*?@media \(max-width:768px\)\{\.hero\.hero--home\{min-height:[^}]+\}\}\n?/g,
  '\n'
);

// Neutralize early solid-gradient / SVG pattern so the photo plane wins
css = css.replace(
  /\.hero\.hero--home\{background:radial-gradient\([^}]+\}/,
  '.hero.hero--home{background:#0a2540}'
);
css = css.replace(
  /\.hero\.hero--home::before\{content:"";position:absolute;inset:0;background-image:url\("data:image\/svg\+xml,[^"]+"\);pointer-events:none;z-index:0\}/,
  '.hero.hero--home::before{content:none;display:none}'
);

if (!css.includes('hero-media__img{display:block')) {
  css += heroCssBlock;
}

fs.writeFileSync(cssPath, css);

console.log('inject-home-hero-image: hyperlocal hero media + CSS applied');
