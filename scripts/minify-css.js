#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'styles.css');
const source = fs.readFileSync(cssPath, 'utf8');

let CleanCSS;
try {
  CleanCSS = require('clean-css');
} catch {
  console.warn('minify-css: clean-css not installed; skipping');
  process.exit(0);
}

const result = new CleanCSS({
  level: 1,
  format: false,
}).minify(source);

if (result.errors.length) {
  console.error('minify-css: errors', result.errors);
  process.exit(1);
}

fs.writeFileSync(cssPath, result.styles);
console.log(
  `minify-css: ${source.length} → ${result.styles.length} bytes (${Math.round((1 - result.styles.length / source.length) * 100)}% smaller)`
);
