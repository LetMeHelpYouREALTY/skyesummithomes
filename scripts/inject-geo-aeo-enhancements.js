#!/usr/bin/env node
/**
 * Injects GEO context blocks and Speakable schema for AEO quick-answer sections.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');

const root = path.join(__dirname, '..');
const enrichmentPath = path.join(root, 'lib/parallel-seo-enrichment.json');

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
    if (name.isFile() && name.name.endsWith('.html') && name.name !== '404.html') {
      out.push(full);
    }
  }
  return out;
}

function loadEntities() {
  const defaults = C.GEO_CONTEXT_ENTITIES;
  if (!fs.existsSync(enrichmentPath)) return defaults;
  try {
    const data = JSON.parse(fs.readFileSync(enrichmentPath, 'utf8'));
    const list = [...(data.localEntities || []), ...(data.geoKeywords || [])];
    const filtered = list
      .map((s) => String(s).trim())
      .filter((s) =>
        /skye summit|olympia|vertice|215 beltway|red rock|centennial/i.test(s)
      );
    if (filtered.length >= 2) {
      return [...new Set([...defaults, ...filtered])].slice(0, 8);
    }
  } catch {
    /* fall through */
  }
  return defaults;
}

function geoBlock() {
  return `
        <section class="geo-context" aria-label="Skye Summit Master Plan service area">
            <div class="container">
                <h2 class="geo-context__title">${C.GEO_CONTEXT_TITLE}</h2>
                <p class="geo-context__text">${C.GEO_CONTEXT_TEXT}</p>
            </div>
        </section>`;
}

function speakableSchema() {
  return `<script type="application/ld+json" data-geo-speakable>
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".aeo-quick-answer__text"]
      }
    }
    </script>`;
}

function stripGeo(html) {
  return html
    .replace(/\s*<!-- GEO_CONTEXT_BEGIN -->[\s\S]*?<\/section>\s*/gi, '\n')
    .replace(/\s*<section class="geo-context"[\s\S]*?<\/section>\s*/gi, '\n')
    .replace(
      /\s*<script type="application\/ld\+json" data-geo-speakable>[\s\S]*?<\/script>\s*/gi,
      '\n'
    );
}

let updated = 0;

for (const filePath of listHtmlFiles(root)) {
  let html = stripGeo(fs.readFileSync(filePath, 'utf8'));
  const block = geoBlock();

  let next = html;
  if (/<section class="aeo-quick-answer"/i.test(html)) {
    next = html.replace(
      /(<section class="aeo-quick-answer"[\s\S]*?<\/section>)/i,
      `$1\n<!-- GEO_CONTEXT_BEGIN -->${block}`
    );
  } else if (/id="realscout-listings"/i.test(html)) {
    // Prefer after RealScout so the office widget stays directly under the hero
    next = html.replace(
      /(<section[^>]*id="realscout-listings"[^>]*>[\s\S]*?<\/section>)/i,
      `$1\n<!-- GEO_CONTEXT_BEGIN -->${block}`
    );
  } else if (/<main[^>]*>/i.test(html)) {
    next = html.replace(/<main[^>]*>/i, (m) => `${m}\n<!-- GEO_CONTEXT_BEGIN -->${block}`);
  }

  if (!/data-geo-speakable/i.test(next) && /<\/head>/i.test(next)) {
    next = next.replace(/<\/head>/i, `    ${speakableSchema()}\n</head>`);
  }

  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`inject-geo-aeo-enhancements: updated ${updated} HTML file(s)`);
