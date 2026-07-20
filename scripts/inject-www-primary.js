#!/usr/bin/env node
/**
 * Ensures apex (skyesummithomes.com) client-side redirect to www on every HTML page.
 * Server-side 301/308 is in vercel.json; this backs up GSC canonical consolidation.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const MARKER = 'data-www-primary-redirect';

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
]);

const APEX_REDIRECT = `<script ${MARKER}>
      (function () {
        var host = location.hostname;
        var path = location.pathname;
        var params = new URLSearchParams(location.search);
        // Legacy site-search query param → clean /search hub
        if (params.has('s') && (path === '/' || path === '/search' || path === '/search/')) {
          location.replace('https://www.skyesummithomes.com/search');
          return;
        }
        if (host === 'skyesummithomes.com') {
          location.replace('https://www.skyesummithomes.com' + path + location.search + location.hash);
        }
      })();
    </script>`;

const LEGACY_APEX_RE =
  /<script>\s*if \(location\.hostname === 'skyesummithomes\.com'\)[\s\S]*?<\/script>\s*/i;

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

function injectApexRedirect(html) {
  let next = html.replace(LEGACY_APEX_RE, '');
  if (new RegExp(MARKER, 'i').test(next)) return next;

  const charsetRe = /(<meta\s+charset=["'][^"']+["']\s*\/?>)/i;
  if (charsetRe.test(next)) {
    return next.replace(charsetRe, `$1\n    ${APEX_REDIRECT}`);
  }

  const headRe = /(<head[^>]*>)/i;
  if (headRe.test(next)) {
    return next.replace(headRe, `$1\n    ${APEX_REDIRECT}`);
  }

  return next;
}

let updated = 0;
const files = listHtmlFiles(root);

for (const filePath of files) {
  const html = fs.readFileSync(filePath, 'utf8');
  const next = injectApexRedirect(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(
  `inject-www-primary: processed ${files.length} HTML file(s), updated ${updated}`
);
