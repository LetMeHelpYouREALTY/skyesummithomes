#!/usr/bin/env node
/**
 * Site-wide plain language pass for buyer/seller-facing HTML.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const { applyPlainLanguage } = require('../lib/plain-language-copy');

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

/** GBP / contact labels (run after hyperlocal inject) */
const GBP_REPLACEMENTS = [
  ['NAP (matches Google Business Profile)', C.LABEL_CONTACT_CARD],
  ['NAP matches Google Business Profile:', 'Office:'],
  ['<h4>Google Business Profile</h4>', `<h4>${C.LABEL_GOOGLE_SECTION}</h4>`],
  ['aria-label="Contact and Google Business Profile"', `aria-label="${C.LABEL_CONTACT_ACTIONS}"`],
  ['aria-label="Dr. Jan Duffy on Google Business Profile"', 'aria-label="Dr. Jan Duffy on Google"'],
  [
    'aria-label="View Dr. Jan Duffy\'s Google Business Profile"',
    `aria-label="${C.LABEL_VIEW_ON_GOOGLE}"`,
  ],
  ['same address as Google Business Profile', C.LABEL_OFFICE_SAME_AS_GOOGLE],
  [' (per Google Business Profile)', ''],
  [' per Google Business Profile', ''],
  ['aria-label="Google Business Profile"', `aria-label="${C.LABEL_GOOGLE_SECTION}"`],
];

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

function applyAll(html) {
  let next = applyPlainLanguage(html);
  for (const [from, to] of GBP_REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  return next;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  const html = fs.readFileSync(filePath, 'utf8');
  const next = applyAll(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`plain-language-site-copy: updated ${updated} HTML file(s)`);
