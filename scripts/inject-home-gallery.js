#!/usr/bin/env node
/**
 * Injects illustrative home photo gallery on key marketing pages.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { HOME_GALLERY, GALLERY_DISCLAIMER } = require('../lib/site-images');

const root = path.join(__dirname, '..');
const MARKER = 'HOME_GALLERY_BEGIN';

const TARGETS = new Set([
  'community.html',
  'buy.html',
  'homes-for-sale-skye-summit.html',
  'new-construction-skye-summit.html',
  'skye-summit-master-plan.html',
]);

function galleryHtml() {
  const items = HOME_GALLERY.map(
    (item) => `
                    <figure class="home-gallery__item">
                        <img src="${item.src}" alt="${item.alt}" width="640" height="427" loading="lazy" decoding="async">
                        <figcaption>${item.caption}</figcaption>
                    </figure>`
  ).join('');

  return `
                <!-- ${MARKER} -->
                <div class="home-gallery" role="list" aria-label="Illustrative Skye Summit area new construction home styles">
                    ${items}
                </div>
                <p class="home-gallery__note">${GALLERY_DISCLAIMER}</p>`;
}

function stripGallery(html) {
  return html
    .replace(/\s*<!-- HOME_GALLERY_BEGIN -->[\s\S]*?<p class="home-gallery__note">[\s\S]*?<\/p>\s*/gi, '\n')
    .replace(/\s*<div class="home-gallery"[\s\S]*?<p class="home-gallery__note">[\s\S]*?<\/p>\s*/gi, '\n');
}

function injectGallery(html) {
  if (html.includes(MARKER)) return html;
  const block = galleryHtml();

  if (/class="listings-widget-hint"/i.test(html)) {
    return html.replace(
      /(<p class="listings-widget-hint">[\s\S]*?<\/p>)/i,
      `$1${block}`
    );
  }

  if (/<section[^>]*class="[^"]*listings[^"]*"/i.test(html)) {
    return html.replace(/(<section[^>]*class="[^"]*listings[^"]*"[\s\S]*?<div class="container">[\s\S]*?)(<\/div>\s*<\/section>)/i, `$1${block}$2`);
  }

  if (/<section[^>]*class="[^"]*service-hero[^"]*"/i.test(html)) {
    return html.replace(/(<section[^>]*class="[^"]*service-hero[^"]*"[\s\S]*?<\/section>)/i, `$1${block}`);
  }

  return html;
}

let updated = 0;
for (const name of TARGETS) {
  const filePath = path.join(root, name);
  if (!fs.existsSync(filePath)) continue;
  let html = stripGallery(fs.readFileSync(filePath, 'utf8'));
  const next = injectGallery(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`inject-home-gallery: updated ${updated} page(s)`);
