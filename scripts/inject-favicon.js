#!/usr/bin/env node
/**
 * Injects Dr. Jan Duffy brand favicon link tags into every HTML page.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const MARKER = 'data-brand-favicon';

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
]);

const FAVICON_BLOCK = `<!-- BRAND_FAVICON_BEGIN -->
    <link ${MARKER} rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <!-- BRAND_FAVICON_END -->`;

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

function injectFavicon(html) {
  const blockRe =
    /<!--\s*BRAND_FAVICON_BEGIN\s-->[\s\S]*?<!--\s*BRAND_FAVICON_END\s-->\s*/i;
  let next = html.replace(blockRe, '');

  // Remove any prior unmarked favicon links we may have added
  next = next.replace(
    /\s*<link[^>]*(?:rel=["'](?:shortcut )?icon["']|rel=["']apple-touch-icon["']|rel=["']manifest["'])[^>]*>\s*/gi,
    '\n'
  );

  const charsetRe = /(<meta\s+charset=["'][^"']+["']\s*\/?>)/i;
  if (charsetRe.test(next)) {
    return next.replace(charsetRe, `$1\n    ${FAVICON_BLOCK}`);
  }

  const headRe = /<head([^>]*)>/i;
  if (headRe.test(next)) {
    return next.replace(headRe, `<head$1>\n    ${FAVICON_BLOCK}`);
  }

  return next;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  const html = fs.readFileSync(filePath, 'utf8');
  const next = injectFavicon(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`inject-favicon: updated ${updated} HTML file(s)`);
