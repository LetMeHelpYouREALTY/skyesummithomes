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

function loadGeoContext() {
  if (!fs.existsSync(enrichmentPath)) {
    return { title: C.GEO_CONTEXT_TITLE, text: C.GEO_CONTEXT_TEXT };
  }
  try {
    const data = JSON.parse(fs.readFileSync(enrichmentPath, 'utf8'));
    const entities = [...(data.localEntities || []), ...(data.geoKeywords || [])]
      .map((s) => String(s).trim())
      .filter((s) => /skye summit master plan|olympia|vertice|century|woodside|215 beltway|red rock/i.test(s))
      .slice(0, 4);
    const entityPhrase =
      entities.length >= 2
        ? ` Near ${entities.slice(1, 3).join(' and ')}.`
        : '';
    return {
      title: C.GEO_CONTEXT_TITLE,
      text: `${C.GEO_CONTEXT_TEXT}${entityPhrase}`,
    };
  } catch {
    return { title: C.GEO_CONTEXT_TITLE, text: C.GEO_CONTEXT_TEXT };
  }
}

function geoBlock() {
  const ctx = loadGeoContext();
  return `
        <section class="geo-context" aria-label="Skye Summit Master Plan service area">
            <div class="container">
                <h2 class="geo-context__title">${ctx.title}</h2>
                <p class="geo-context__text">${ctx.text}</p>
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
