#!/usr/bin/env node
/**
 * Embeds GOOGLE_MAPS_API_KEY into las-vegas-zip-code-map/index.html at build time.
 * Runs whenever the env var is set (GitHub Actions secret or Vercel env), or on
 * Vercel (VERCEL=1), or with FORCE_MAPS_INJECT=1 locally. Does not commit the key.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { ensureMapsHints } = require('../lib/cdn-hints');

const root = path.join(__dirname, '..');
const MAPS_HTML_FILES = [
  path.join(root, 'las-vegas-zip-code-map', 'index.html'),
  path.join(root, 'nearby-amenities', 'index.html'),
  path.join(root, 'nearby-amenities.html'),
  path.join(root, 'index.html'),
  path.join(root, 'community', 'index.html'),
  path.join(root, 'living-in-skye-summit', 'index.html'),
  path.join(root, 'homes-for-sale-skye-summit', 'index.html'),
  path.join(root, 'search', 'index.html'),
];

function loadDotEnv() {
  const envPath = path.join(root, '.env');
  if (!fs.existsSync(envPath)) return;
  const txt = fs.readFileSync(envPath, 'utf8');
  for (const line of txt.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const k = trimmed.slice(0, eq).trim();
    let v = trimmed.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (k === 'GOOGLE_MAPS_API_KEY' && !process.env.GOOGLE_MAPS_API_KEY) {
      process.env.GOOGLE_MAPS_API_KEY = v;
    }
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

loadDotEnv();

const onVercel = process.env.VERCEL === '1';
const forceLocal = process.env.FORCE_MAPS_INJECT === '1';
const key = (process.env.GOOGLE_MAPS_API_KEY || '').trim();

if (!key && !onVercel && !forceLocal) {
  console.log(
    'inject-google-maps-key: skipped (set GOOGLE_MAPS_API_KEY, or FORCE_MAPS_INJECT=1 locally with .env)'
  );
  process.exit(0);
}

const metaRe = /<meta\s+name="google-maps-api-key"\s+content="[^"]*"\s*\/?>/i;
const replacement = key
  ? `<meta name="google-maps-api-key" content="${escapeAttr(key)}">`
  : `<meta name="google-maps-api-key" content="">`;

let updated = 0;
for (const htmlPath of MAPS_HTML_FILES) {
  if (!fs.existsSync(htmlPath)) continue;
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (!metaRe.test(html)) continue;
  html = html.replace(metaRe, replacement);
  html = ensureMapsHints(html, { preconnect: Boolean(key) });
  fs.writeFileSync(htmlPath, html);
  updated += 1;
}

if (updated === 0) {
  console.error('inject-google-maps-key: no files contained google-maps-api-key meta');
  process.exit(1);
}

if (key) {
  console.log(
    `inject-google-maps-key: embedded key in ${updated} file(s) (enable Maps JavaScript API + Places API; restrict by HTTP referrer).`
  );
} else {
  console.log(
    `inject-google-maps-key: GOOGLE_MAPS_API_KEY empty; cleared meta in ${updated} file(s).`
  );
}
