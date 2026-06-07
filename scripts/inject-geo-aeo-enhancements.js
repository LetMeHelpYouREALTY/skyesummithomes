#!/usr/bin/env node
/**
 * Injects GEO context blocks and Speakable schema for AEO quick-answer sections.
 */
'use strict';

const fs = require('fs');
const path = require('path');

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

const DEFAULT_ENTITIES = [
  'Skye Summit',
  'Centennial Hills',
  'Red Rock Canyon',
  'Northwest Las Vegas',
  '215 Beltway',
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
    if (name.isFile() && name.name.endsWith('.html') && name.name !== '404.html') {
      out.push(full);
    }
  }
  return out;
}

function loadEntities() {
  if (!fs.existsSync(enrichmentPath)) return DEFAULT_ENTITIES;
  try {
    const data = JSON.parse(fs.readFileSync(enrichmentPath, 'utf8'));
    const list = [...(data.localEntities || []), ...(data.geoKeywords || [])];
    const uniq = [...new Set(list.map((s) => String(s).trim()).filter(Boolean))];
    return uniq.slice(0, 8);
  } catch {
    return DEFAULT_ENTITIES;
  }
}

function geoBlock(entities) {
  const list = entities.slice(0, 6).join(', ');
  return `
        <section class="geo-context" aria-label="Northwest Las Vegas service area">
            <div class="container">
                <h2 class="geo-context__title">Northwest Las Vegas &amp; Skye Summit area</h2>
                <p class="geo-context__text">Dr. Jan Duffy serves buyers and sellers across ${list}, and nearby northwest Las Vegas communities. <a href="/las-vegas-zip-code-map">Search by zip code</a> or <a href="/contact">schedule a consult</a>.</p>
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

const MARKER = 'GEO_CONTEXT_BEGIN';
const entities = loadEntities();
const block = geoBlock(entities);
let updated = 0;

for (const filePath of listHtmlFiles(root)) {
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('aeo-quick-answer')) continue;

  let changed = false;

  if (!html.includes(MARKER)) {
    html = html.replace(
      /(<section class="aeo-quick-answer"[\s\S]*?<\/section>)/i,
      `$1\n        <!-- ${MARKER} -->${block}`
    );
    changed = true;
  }

  if (!html.includes('data-geo-speakable')) {
    html = html.replace(/<\/head>/i, `    ${speakableSchema()}\n</head>`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    updated += 1;
  }
}

console.log(`inject-geo-aeo-enhancements: updated ${updated} HTML file(s)`);
