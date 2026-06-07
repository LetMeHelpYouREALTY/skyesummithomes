#!/usr/bin/env node
/**
 * Replace missing OG/social image paths with the verified agent headshot.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');

const root = path.join(__dirname, '..');
const OG_URL = `${C.SITE}${C.OG_IMAGE_PATH}`;

const BROKEN = [
  '/images/skye-summit-hero.jpg',
  '/images/skye-summit-community.jpg',
  '/images/skye-summit-sell.jpg',
  '/images/skye-summit-valuation.jpg',
  '/images/skye-summit-relocation.jpg',
];

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
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
    if (name.isFile() && name.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  let html = fs.readFileSync(filePath, 'utf8');
  let next = html;
  for (const broken of BROKEN) {
    const fullBroken = `${C.SITE}${broken}`;
    next = next.split(fullBroken).join(OG_URL);
    next = next.split(broken).join(C.OG_IMAGE_PATH);
  }
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`normalize-og-images: updated ${updated} HTML file(s) → ${OG_URL}`);
