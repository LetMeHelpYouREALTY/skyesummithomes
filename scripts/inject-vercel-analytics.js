#!/usr/bin/env node
/**
 * Injects Vercel Web Analytics script into every site HTML file.
 * Runs on each `npm run build` to ensure all HTML files have Web Analytics enabled.
 * 
 * This adds the Web Analytics script tag which tracks page views and visitor engagement.
 * Note: This is different from Speed Insights (/_vercel/insights/script.js) which tracks performance.
 */
'use strict';

const fs = require('fs');
const path = require('path');

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

function injectWebAnalytics(html) {
  // Check if Web Analytics script already exists
  if (html.includes('cdn.vercel-insights.com/v1/script.js')) {
    return html;
  }

  // The script tag to inject
  const scriptTag = '<script defer src="https://cdn.vercel-insights.com/v1/script.js"></script>';

  // Try to inject after the existing Speed Insights script if it exists
  const speedInsightsRe = /(<script\s+defer\s+src=["']\/_vercel\/insights\/script\.js["']><\/script>)/i;
  if (speedInsightsRe.test(html)) {
    return html.replace(speedInsightsRe, `$1\n    ${scriptTag}`);
  }

  // Try to inject after the Vercel Analytics comment if it exists
  const analyticsCommentRe = /(<!--\s*Vercel Analytics\s*-->)/i;
  if (analyticsCommentRe.test(html)) {
    return html.replace(analyticsCommentRe, `$1\n    ${scriptTag}`);
  }

  // Otherwise, inject before the closing </head> tag
  const headRe = /(<\/head>)/i;
  if (headRe.test(html)) {
    return html.replace(headRe, `    ${scriptTag}\n$1`);
  }

  return html;
}

const files = listHtmlFiles(root);
let updated = 0;

for (const filePath of files) {
  let html = fs.readFileSync(filePath, 'utf8');
  const next = injectWebAnalytics(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(
  `inject-vercel-analytics: processed ${files.length} HTML file(s), updated ${updated}`
);
