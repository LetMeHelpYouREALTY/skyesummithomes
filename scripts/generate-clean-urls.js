#!/usr/bin/env node
/**
 * Creates /{slug}/index.html from /{slug}.html so clean paths work on any
 * static host (Vercel, S3, etc.) without relying only on vercel.json rewrites.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

/** Root-level pages served at /slug (matches vercel.json rewrites). */
const SLUGS = [
  'about',
  'community',
  'sell',
  'buy',
  'valuation',
  'invest',
  'relocate',
  'contact',
  'blog',
  'privacy',
  'terms',
  'mls-disclaimer',
  'homes-for-sale-skye-summit',
  'skye-summit-faq',
  'skye-summit-schools',
  'living-in-skye-summit',
  'new-construction-skye-summit',
  'skye-summit-hoa',
  'centennial-hills-real-estate',
];

let created = 0;

for (const slug of SLUGS) {
  const source = path.join(root, `${slug}.html`);
  if (!fs.existsSync(source)) {
    console.warn(`generate-clean-urls: skip missing ${slug}.html`);
    continue;
  }

  const dir = path.join(root, slug);
  const dest = path.join(dir, 'index.html');

  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(source, dest);
  created += 1;
}

console.log(`generate-clean-urls: wrote ${created} index.html file(s) under /{slug}/`);
