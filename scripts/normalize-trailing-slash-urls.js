#!/usr/bin/env node
/**
 * Align internal links and canonicals with vercel.json trailingSlash: false.
 * Prevents GSC duplicate discovery (e.g. /las-vegas-zip-code-map/ vs /las-vegas-zip-code-map).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SITE = 'https://www.skyesummithomes.com';

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

function normalize(html) {
  let next = html;

  // Absolute www URLs with trailing slash (not homepage)
  next = next.replace(
    new RegExp(`${SITE.replace(/\./g, '\\.')}/([a-z0-9-]+)/(?=[#"\\s])`, 'gi'),
    `${SITE}/$1`
  );

  // Root-relative paths with trailing slash before ? or quote
  next = next.replace(/href="\/([a-z0-9-]+)\/(?=[?#"])/gi, 'href="/$1');
  next = next.replace(/href='\/([a-z0-9-]+)\/(?=[?#'])/gi, "href='/$1");

  return next;
}

const files = listHtmlFiles(root);
let updated = 0;

for (const filePath of files) {
  const html = fs.readFileSync(filePath, 'utf8');
  const next = normalize(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(
  `normalize-trailing-slash-urls: processed ${files.length} HTML file(s), updated ${updated}`
);
