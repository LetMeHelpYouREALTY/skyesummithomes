#!/usr/bin/env node
/**
 * Moves JSON-LD blocks from <head> to just before </body> to reduce head parse work.
 * Keeps redirect/verification scripts in head.
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

function deferJsonLd(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return html;

  const headInner = headMatch[1];
  const jsonLdRe =
    /\s*<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi;
  const blocks = headInner.match(jsonLdRe);
  if (!blocks || blocks.length === 0) return html;

  let newHead = headInner.replace(jsonLdRe, '\n');
  newHead = newHead.replace(/\s*<!--\s*[^>]*Schema\s*-->\s*/gi, '\n');
  let out = html.replace(headMatch[0], `<head>${newHead}</head>`);
  const bundle = blocks.join('\n');
  if (/<\/body>/i.test(out)) {
    out = out.replace(/<\/body>/i, `${bundle}\n</body>`);
  }
  return out;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  const html = fs.readFileSync(filePath, 'utf8');
  const next = deferJsonLd(html);
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`defer-jsonld: moved JSON-LD to body end on ${updated} HTML file(s)`);
