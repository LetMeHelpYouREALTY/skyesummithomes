#!/usr/bin/env node
/**
 * Injects RealScout office listings below the hero on marketing pages.
 * Uses RealScout's official head embed (script once + styles) and body widget.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const R = require('../lib/realscout-config');

const root = path.join(__dirname, '..');
const { isHomepageManaged } = require('../lib/build-skip');

const SKIP_FILES = new Set([
  '404.html',
  'privacy.html',
  'terms.html',
  'mls-disclaimer.html',
]);

function shouldSkip(filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  if (rel === '404.html') return true;
  if (/^(privacy|terms|mls-disclaimer)(\/|$)/.test(rel)) return true;
  if (SKIP_FILES.has(path.basename(filePath))) return true;
  return false;
}

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
      if (name.name.startsWith('google')) continue;
      out.push(full);
    }
  }
  return out;
}

function widgetBodyHtml() {
  return `<realscout-office-listings
                    agent-encoded-id="${R.AGENT_ENCODED_ID}"
                    sort-order="${R.SORT_ORDER}"
                    listing-status="${R.LISTING_STATUS}"
                    property-types="${R.PROPERTY_TYPES}"
                    price-min="${R.PRICE_MIN}"
                    price-max="${R.PRICE_MAX}"></realscout-office-listings>`;
}

function widgetSectionHtml() {
  return `
        <!-- ${R.MARKER} -->
        <section id="${R.SECTION_ID}" class="realscout-listings-section" aria-labelledby="realscout-listings-title">
            <div class="container">
                <h2 id="realscout-listings-title">Nearby homes available now</h2>
                <p class="section-description">MLS listings in Northwest Las Vegas, Centennial Hills, Skye Hills, and the 89166 area—not future Skye Summit Master Plan inventory. Browse while you follow master plan updates.</p>
                ${widgetBodyHtml()}
                <p class="realscout-mls-note">Listing data courtesy of MLS. <a href="/mls-disclaimer">MLS listing data notice</a> · <a href="/contact">Questions? Contact Dr. Jan Duffy</a> · <a href="tel:+17029308222">(702) 930-8222</a></p>
            </div>
        </section>`;
}

function headEmbedHtml() {
  return `
    <link rel="dns-prefetch" href="${R.EMBED_ORIGIN}">
    <link rel="dns-prefetch" href="${R.API_ORIGIN}">
    <link rel="preconnect" href="${R.EMBED_ORIGIN}" crossorigin>
    <link rel="preconnect" href="${R.API_ORIGIN}" crossorigin>
    <script src="${R.SCRIPT_URL}" type="module"></script>
    <style data-realscout-styles>
      realscout-office-listings {
        --rs-listing-divider-color: rgb(101, 141, 172);
        width: 100%;
        min-height: 480px;
        display: block;
        margin: 1.5rem 0 1rem;
      }
      .realscout-mls-note {
        font-size: 0.85rem;
        color: #64748b;
        margin-top: 0.75rem;
        text-align: center;
      }
      .realscout-fallback {
        display: none;
        text-align: center;
        padding: 2rem 1rem;
        background: #f7f9fc;
        border-radius: 8px;
        border: 2px dashed #3a8dde;
        color: #0a2540;
      }
      .realscout-listings-section.realscout-error .realscout-fallback {
        display: block;
      }
      .realscout-listings-section.realscout-error realscout-office-listings {
        display: none;
      }
    </style>`;
}

function stripRealscout(html) {
  return html
    .replace(
      /\s*<!-- REALSCOUT_WIDGET_BEGIN -->[\s\S]*?<\/section>\s*/gi,
      '\n'
    )
    .replace(
      /\s*<script[^>]*data-realscout-loader[^>]*><\/script>\s*/gi,
      '\n'
    )
    .replace(
      /\s*<script[^>]*realscout-web-components\.umd\.js[^>]*><\/script>\s*/gi,
      '\n'
    )
    .replace(/\s*<style data-realscout-styles>[\s\S]*?<\/style>\s*/gi, '\n')
    .replace(
      /\s*<link rel="dns-prefetch" href="https:\/\/em\.realscout\.com">\s*/gi,
      '\n'
    )
    .replace(
      /\s*<link rel="dns-prefetch" href="https:\/\/www\.realscout\.com">\s*/gi,
      '\n'
    )
    .replace(
      /\s*<link rel="preconnect" href="https:\/\/em\.realscout\.com"[^>]*>\s*/gi,
      '\n'
    )
    .replace(
      /\s*<link rel="preconnect" href="https:\/\/www\.realscout\.com"[^>]*>\s*/gi,
      '\n'
    )
    .replace(
      /\s*<style>\s*realscout-office-listings[\s\S]*?<\/style>\s*/gi,
      '\n'
    )
    .replace(
      /\s*<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?realscout[\s\S]*?<\/script>\s*/gi,
      '\n'
    )
    .replace(
      /\s*<script>(?![^<]*application\/ld\+json)[\s\S]*?realscout-office-listings[\s\S]*?<\/script>\s*/gi,
      '\n'
    );
}

function injectHeadEmbed(html) {
  if (
    /<script[^>]*realscout-web-components\.umd\.js[^>]*><\/script>/i.test(html) &&
    /data-realscout-styles/i.test(html)
  ) {
    return html;
  }
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${headEmbedHtml()}\n</head>`);
  }
  return html;
}

function injectAfterHero(html) {
  if (html.includes(R.MARKER)) {
    return html
      .replace(
        /<section id="realscout-listings" class="realscout-listings-section listings"[^>]*>/i,
        `<section id="${R.SECTION_ID}" class="realscout-listings-section" aria-labelledby="realscout-listings-title">`
      )
      .replace(
        /<realscout-office-listings[\s\S]*?<\/realscout-office-listings>/i,
        widgetBodyHtml()
      );
  }

  const block = widgetSectionHtml();

  const patterns = [
    /(<section[^>]*class="[^"]*\bhero(?:--home)?\b[^"]*"[^>]*>[\s\S]*?<\/section>)/i,
    /(<section[^>]*class="[^"]*\bservice-hero\b[^"]*"[^>]*>[\s\S]*?<\/section>)/i,
    /(<section[^>]*class="[^"]*\bhero\b[^"]*"[^>]*>[\s\S]*?<\/section>)/i,
  ];

  for (const re of patterns) {
    if (re.test(html)) {
      return html.replace(re, `$1${block}`);
    }
  }

  if (/<main[^>]*>/i.test(html)) {
    return html.replace(/(<main[^>]*>)/i, `$1${block}`);
  }

  return html;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
  if (isHomepageManaged(root, filePath)) continue;
  if (shouldSkip(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    const stripped = stripRealscout(html);
    if (stripped !== html) {
      fs.writeFileSync(filePath, stripped);
      updated += 1;
    }
    continue;
  }

  let html = stripRealscout(fs.readFileSync(filePath, 'utf8'));
  const next = injectHeadEmbed(injectAfterHero(html));

  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`inject-realscout-widget: updated ${updated} HTML file(s)`);
