#!/usr/bin/env node
/**
 * Sets page-specific og:image / twitter:image from the per-page hero registry.
 * Git /images/hero/* is the origin; Cloudflare CDN can wrap the same paths.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { heroForFile, absoluteUrl } = require('../lib/hero-images');

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
  return heroForFile(rel).src;
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

function ensureTwitterImage(html, imageUrl) {
  if (/<meta[^>]+(?:name|property)=["']twitter:image["']/i.test(html)) {
    return setMetaContent(html, 'name', 'twitter:image', imageUrl);
  }
  if (/<meta[^>]+property=["']og:image["']/i.test(html)) {
    return html.replace(
      /(<meta[^>]+property=["']og:image["'][^>]*>)/i,
      `$1\n    <meta name="twitter:image" content="${imageUrl}">`
    );
  }
  return html;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  const imagePath = ogPathForFile(filePath);
  const imageUrl = absoluteUrl(imagePath);
  let html = fs.readFileSync(filePath, 'utf8');
  let next = setMetaContent(html, 'property', 'og:image', imageUrl);
  next = setMetaContent(next, 'property', 'twitter:image', imageUrl);
  next = ensureTwitterImage(next, imageUrl);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`sync-site-images: updated ${updated} HTML file(s) from heroForFile()`);
