#!/usr/bin/env node
/**
 * Removes duplicate legacy JSON-LD (standalone RealEstateAgent, LocalBusiness,
 * Service, Person, old FAQPage) so inject-hyperlocal-gbp can own entity @graph.
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

const KEEP_DATA_ATTRS = [
  'data-aeo-core-faq',
  'data-guide-faq',
  'data-geo-speakable',
  'data-hyperlocal-gbp-schema',
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

function hasKeepAttr(openTag) {
  return KEEP_DATA_ATTRS.some((attr) => openTag.includes(attr));
}

function parseJsonLdBlock(block) {
  const openMatch = block.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i
  );
  if (!openMatch) return null;
  if (hasKeepAttr(openMatch[0])) return { keep: true };

  const jsonText = block
    .replace(/^[\s\S]*?>/, '')
    .replace(/<\/script>\s*$/i, '')
    .trim();
  try {
    return { keep: false, data: JSON.parse(jsonText) };
  } catch {
    return { keep: true };
  }
}

function shouldRemoveLegacy(data) {
  if (!data || typeof data !== 'object') return false;

  const type = data['@type'];
  const types = Array.isArray(type) ? type : type ? [type] : [];

  if (types.includes('FAQPage') && !data['@id']) {
    return true;
  }

  if (types.includes('Person') && !data['@id']) {
    return true;
  }

  if (types.includes('RealEstateAgent') && !data['@id'] && !data['@graph']) {
    return true;
  }

  if (types.includes('LocalBusiness')) {
    if (Array.isArray(data.review) && data.review.length > 0) {
      return true;
    }
    // Duplicate of hyperlocal @graph LocalBusiness (#localbusiness)
    if (!data['@id']) {
      return true;
    }
  }

  // Standalone Service blocks without offers/review/rating trigger GSC Product snippet errors.
  // Entity coverage comes from the hyperlocal RealEstateAgent + LocalBusiness @graph.
  if (types.includes('Service') && !data['@id']) {
    return true;
  }

  if (data['@graph']) {
    return false;
  }

  return false;
}

function stripHyperlocalSchema(html) {
  return html.replace(
    /\s*<script type="application\/ld\+json" data-hyperlocal-gbp-schema>[\s\S]*?<\/script>\s*/gi,
    '\n'
  );
}

function stripLegacyCommentBlocks(html) {
  return html.replace(
    /\s*<!--\s*(RealEstateAgent|LocalBusiness|Person|FAQ)\s+Schema\s*-->\s*/gi,
    '\n'
  );
}

function consolidateJsonLd(html) {
  const scriptRe =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi;
  let removed = 0;

  const next = html.replace(scriptRe, (block) => {
    const parsed = parseJsonLdBlock(block);
    if (!parsed || parsed.keep) return block;
    if (shouldRemoveLegacy(parsed.data)) {
      removed += 1;
      return '\n';
    }
    return block;
  });

  return { html: next, removed };
}

let filesUpdated = 0;
let blocksRemoved = 0;

for (const filePath of listHtmlFiles(root)) {
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;

  html = stripHyperlocalSchema(html);
  html = stripLegacyCommentBlocks(html);

  const { html: consolidated, removed } = consolidateJsonLd(html);
  html = consolidated;
  blocksRemoved += removed;

  if (html !== before) {
    fs.writeFileSync(filePath, html);
    filesUpdated += 1;
  }
}

console.log(
  `consolidate-legacy-schema: updated ${filesUpdated} file(s), removed ${blocksRemoved} legacy JSON-LD block(s)`
);
