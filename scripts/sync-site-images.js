#!/usr/bin/env node
/**
 * Sets page-specific og:image / twitter:image to verified home photos.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { PATHS, PAGE_OG, url } = require('../lib/site-images');

const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
]);

const DEFAULT_OG = url(PATHS.COMMUNITY);

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

function ogPathForFile(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (PAGE_OG[rel]) return PAGE_OG[rel];
  const base = path.basename(filePath);
  if (PAGE_OG[base]) return PAGE_OG[base];
  return PATHS.COMMUNITY;
}

function setMetaContent(html, attr, key, value) {
  const re = new RegExp(
    `(<meta\\s+${attr}=["']${key}["']\\s+content=")[^"]*(")`,
    'i'
  );
  if (re.test(html)) {
    return html.replace(re, `$1${value}$2`);
  }
  const re2 = new RegExp(
    `(<meta\\s+content=")[^"]*("\\s+${attr}=["']${key}["'])`,
    'i'
  );
  if (re2.test(html)) {
    return html.replace(re2, `$1${value}$2`);
  }
  return html;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  const imagePath = ogPathForFile(filePath);
  const imageUrl = url(imagePath);
  let html = fs.readFileSync(filePath, 'utf8');
  const next = setMetaContent(
    setMetaContent(html, 'property', 'og:image', imageUrl),
    'name',
    'twitter:image',
    imageUrl
  );
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`sync-site-images: updated ${updated} HTML file(s); default OG ${DEFAULT_OG}`);
