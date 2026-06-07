#!/usr/bin/env node
/**
 * Removes legacy RealScout/listings placeholder rules from styles.css that conflict
 * with the sitewide inject-realscout-widget embed (double "Loading…" states).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');
const before = css.length;

const patterns = [
  /realscout-office-listings\{--rs-listing-divider-color:[^}]+\}realscout-office-listings::part\(listing-card\)\{[^}]+\}/g,
  /\.listings \.container:has\(realscout-office-listings:not\(:defined\)\)\{[^}]+\}/g,
  /\.listings \.container:has\(realscout-office-listings:not\(:defined\)\)::after\{[^}]+\}/g,
];

for (const re of patterns) {
  css = css.replace(re, '');
}

if (css.length !== before) {
  fs.writeFileSync(cssPath, css);
}

console.log(
  `strip-legacy-realscout-css: ${before} → ${css.length} bytes (${before - css.length} removed)`
);
