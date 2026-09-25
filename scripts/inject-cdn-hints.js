#!/usr/bin/env node
/**
 * Sitewide resource hints for Cloudflare Images (and Maps on the zip-code page).
 * dns-prefetch is always cheap; preconnect only when the page already uses the host.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {
  ensureImageDeliveryHints,
  ensureMapsHints,
  hasHostedImageDeliveryUrl,
} = require('../lib/cdn-hints');

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

function mapsKeyPresent(html) {
  const match = html.match(
    /<meta\s+name="google-maps-api-key"\s+content="([^"]*)"/i
  );
  return Boolean(match && match[1].trim());
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf8');
  let next = ensureImageDeliveryHints(html, {
    preconnect: hasHostedImageDeliveryUrl(html),
  });
  if (/las-vegas-zip-code-map/i.test(rel)) {
    next = ensureMapsHints(next, { preconnect: mapsKeyPresent(next) });
  }
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`inject-cdn-hints: updated ${updated} HTML file(s)`);
