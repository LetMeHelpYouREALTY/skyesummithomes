#!/usr/bin/env node
/**
 * Injects Google Search Console HTML verification meta into every site HTML file.
 * Runs on each `npm run build` (after generate-clean-urls copies slug/index.html).
 *
 * Token: GOOGLE_SITE_VERIFICATION env, .env, or default (matches Cloudflare DNS TXT).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const DEFAULT_TOKEN = 'wKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI';

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
]);

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
    if (k === 'GOOGLE_SITE_VERIFICATION' && !process.env.GOOGLE_SITE_VERIFICATION) {
      process.env.GOOGLE_SITE_VERIFICATION = v;
    }
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

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

function injectVerification(html, token) {
  const tag = `<meta name="google-site-verification" content="${escapeAttr(token)}">`;
  const existingRe =
    /<meta\s+name=["']google-site-verification["']\s+content=["'][^"']*["']\s*\/?>/i;

  if (existingRe.test(html)) {
    return html.replace(existingRe, tag);
  }

  const charsetRe = /(<meta\s+charset=["'][^"']+["']\s*\/?>)/i;
  if (charsetRe.test(html)) {
    return html.replace(charsetRe, `$1\n    ${tag}`);
  }

  const headRe = /(<head[^>]*>)/i;
  if (headRe.test(html)) {
    return html.replace(headRe, `$1\n    ${tag}`);
  }

  return html;
}

function ensure404Noindex(html) {
  if (!/<title>[^<]*not found/i.test(html)) return html;
  if (/name=["']robots["']/i.test(html)) return html;
  const tag = '<meta name="robots" content="noindex, follow">';
  const charsetRe = /(<meta\s+charset=["'][^"']+["']\s*\/?>)/i;
  if (charsetRe.test(html)) {
    return html.replace(charsetRe, `$1\n    ${tag}`);
  }
  return html;
}

loadDotEnv();

const token = (process.env.GOOGLE_SITE_VERIFICATION || DEFAULT_TOKEN).trim();
if (!token) {
  console.error('inject-gsc-verification: empty GOOGLE_SITE_VERIFICATION');
  process.exit(1);
}

const files = listHtmlFiles(root);
let updated = 0;

for (const filePath of files) {
  let html = fs.readFileSync(filePath, 'utf8');
  const next = ensure404Noindex(injectVerification(html, token));
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(
  `inject-gsc-verification: processed ${files.length} HTML file(s), updated ${updated}`
);
