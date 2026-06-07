#!/usr/bin/env node
/**
 * Sitewide NAP normalization: footer GBP name, legacy schema business names.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');

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

const FOOTER_OLD = `<h3>Dr. Jan Duffy, REALTOR®</h3>
                    <p>Berkshire Hathaway HomeServices Nevada Properties</p>`;

const FOOTER_NEW = `<h3>${C.FOOTER_HEADING}</h3>
                    <p>${C.FOOTER_SUBLINE}</p>`;

const REPLACEMENTS = [
  [FOOTER_OLD, FOOTER_NEW],
  ['"name": "Dr. Jan Duffy Real Estate"', `"name": ${JSON.stringify(C.GBP_BUSINESS_NAME)}`],
  [
    'Service area: Las Vegas, NV 89141 and Skye Summit · Centennial Hills · Northwest Las Vegas',
    'Office: Las Vegas, NV 89141 · Serves Skye Summit, Centennial Hills & northwest Las Vegas (89166 area)',
  ],
];

let updated = 0;

for (const filePath of listHtmlFiles(root)) {
  let html = fs.readFileSync(filePath, 'utf8');
  let next = html;
  for (const [from, to] of REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`normalize-nap: updated ${updated} HTML file(s)`);
