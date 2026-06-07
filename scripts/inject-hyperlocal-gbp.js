#!/usr/bin/env node
/**
 * Injects hyperlocal GBP block (NAP, hours, map, concierge services) on marketing pages.
 * Run after generate-clean-urls so /{slug}/index.html copies include the section.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const { graphScriptHtml } = require('../lib/schema-graph');

const root = path.join(__dirname, '..');
const MARKER = 'HYPERLOCAL_GBP_BEGIN';

const SKIP_FILES = new Set(['404.html']);

const LEGAL_COMPACT = new Set([
  'privacy.html',
  'terms.html',
  'mls-disclaimer.html',
]);

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
      out.push(full);
    }
  }
  return out;
}

function hyperlocalAreasLine() {
  return `<strong>Office:</strong> ${C.CITY}, ${C.REGION} ${C.POSTAL} · <strong>Service area:</strong> ${C.SERVICE_AREA_GBP} · <a href="${C.MAP_PAGE_PATH}">Office map &amp; directions</a> · <a href="/skye-summit-realtor">About Dr. Jan</a> · <a href="/skye-summit-faq">FAQ</a>`;
}

function compactAreasLine() {
  return `<strong>Office:</strong> ${C.POSTAL} · <strong>Service area:</strong> ${C.SERVICE_AREA_GBP}`;
}

function actionButtons(large = false) {
  const size = large ? ' btn-large' : '';
  return `
                <div class="gbp-action-buttons" role="group" aria-label="${C.LABEL_CONTACT_ACTIONS}">
                    <a href="tel:${C.PHONE_TEL}" class="btn btn-primary${size}"><i class="fas fa-phone" aria-hidden="true"></i> Call ${C.PHONE_DISPLAY}</a>
                    <a href="${C.SMS_URL}" class="btn btn-secondary${size}"><i class="fas fa-comment-sms" aria-hidden="true"></i> Text</a>
                    <a href="${C.MAPS_DIRECTIONS}" class="btn btn-secondary${size}" target="_blank" rel="noopener"><i class="fas fa-directions" aria-hidden="true"></i> Directions</a>
                    <a href="${C.GBP_URL}" class="btn btn-secondary${size}" target="_blank" rel="noopener"><i class="fab fa-google" aria-hidden="true"></i> Google</a>
                </div>`;
}

function compactBlock() {
  return `
        <!-- ${MARKER} -->
        <section id="hyperlocal-gbp" class="hyperlocal-gbp-section hyperlocal-gbp-section--compact" aria-labelledby="hyperlocal-gbp-title">
            <div class="container">
                <p class="hyperlocal-kicker"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${C.HYPERLOCAL_KICKER}</p>
                <h2 id="hyperlocal-gbp-title">${C.GBP_BUSINESS_NAME}</h2>
                <p class="hyperlocal-lead">${C.HYPERLOCAL_LEAD}</p>
                ${actionButtons(false)}
                <p class="hyperlocal-areas">${compactAreasLine()}</p>
            </div>
        </section>`;
}

function fullBlock() {
  const hoursHtml = C.HOURS.map(
    (h) => `<li><strong>${h.days}:</strong> ${h.time}</li>`
  ).join('\n                        ');
  const holidayHtml = C.HOLIDAY_NOTES.map((n) => `<li>${n}</li>`).join('\n                        ');
  const accessibilityHtml = C.ACCESSIBILITY.map(
    (item) => `<li><i class="fas fa-universal-access" aria-hidden="true"></i> ${item}</li>`
  ).join('\n                            ');

  return `
        <!-- ${MARKER} -->
        <section id="hyperlocal-gbp" class="hyperlocal-gbp-section" aria-labelledby="hyperlocal-gbp-title">
            <div class="container">
                <p class="hyperlocal-kicker"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${C.HYPERLOCAL_KICKER}</p>
                <h2 id="hyperlocal-gbp-title">${C.GBP_BUSINESS_NAME}</h2>
                <p class="hyperlocal-lead">${C.HYPERLOCAL_LEAD}</p>
                <div class="hyperlocal-grid">
                    <div class="hyperlocal-card">
                        <h3><i class="fas fa-key" aria-hidden="true"></i> Help for buyers</h3>
                        <ul>
                            <li>Skye Summit Master Plan early-access updates</li>
                            <li>New construction buyer representation</li>
                            <li><a href="/buy">Buying in Skye Summit</a> · <a href="/new-construction-skye-summit">New construction</a></li>
                        </ul>
                    </div>
                    <div class="hyperlocal-card">
                        <h3><i class="fas fa-tag" aria-hidden="true"></i> Help for sellers</h3>
                        <ul>
                            <li>Skye Summit Master Plan interest-list coordination</li>
                            <li>Builder and phase update briefings</li>
                            <li><a href="/contact">Join the interest list</a> · <a href="/valuation">Consultation</a></li>
                        </ul>
                    </div>
                    <div class="hyperlocal-card hyperlocal-nap">
                        <h3><i class="fas fa-building" aria-hidden="true"></i> ${C.LABEL_CONTACT_CARD}</h3>
                        <p class="hyperlocal-name"><strong>${C.GBP_BUSINESS_NAME}</strong><br>${C.AGENT_NAME}, ${C.AGENT_TITLE} · ${C.AGENT_ROLE}<br>${C.BROKERAGE}</p>
                        <p><a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a> · <a href="${C.SMS_URL}">Text</a><br><a href="mailto:${C.EMAIL}">${C.EMAIL}</a></p>
                        <p><a href="${C.MAPS_DIRECTIONS}" target="_blank" rel="noopener">${C.STREET}<br>${C.CITY}, ${C.REGION} ${C.POSTAL}</a></p>
                        <p class="hyperlocal-license">Nevada license ${C.LICENSE} · Licensed since ${C.OPENING_DATE_DISPLAY}</p>
                        <p><a href="${C.SOCIAL_FACEBOOK}" target="_blank" rel="noopener">Facebook</a> · <a href="${C.SOCIAL_LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></p>
                        <ul class="hyperlocal-accessibility">${accessibilityHtml}</ul>
                    </div>
                </div>
                ${actionButtons(true)}
                <p style="text-align:center;margin-top:0.75rem;"><a href="${C.GBP_REVIEW_URL}" class="btn btn-secondary btn-large" target="_blank" rel="noopener"><i class="fas fa-star" aria-hidden="true"></i> Write a Google review</a></p>
                <div class="hyperlocal-bottom">
                    <div class="hyperlocal-hours">
                        <h3>Business hours</h3>
                        <ul>${hoursHtml}</ul>
                        <h4>Special hours</h4>
                        <ul>${holidayHtml}</ul>
                        <p class="hyperlocal-rating"><i class="fas fa-star" aria-hidden="true"></i> <strong>${C.RATING}/5</strong> (${C.REVIEW_COUNT} Google reviews)</p>
                    </div>
                    <div class="gbp-map-embed">
                        <iframe title="Dr. Jan Duffy office — ${C.STREET}, ${C.CITY}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" width="600" height="280" src="${C.MAP_EMBED}"></iframe>
                    </div>
                </div>
                <p class="hyperlocal-areas">${hyperlocalAreasLine()}</p>
            </div>
        </section>`;
}

function schemaBlock() {
  return graphScriptHtml();
}

function stripHyperlocal(html) {
  let out = html
    .replace(/\s*<!-- HYPERLOCAL_GBP_BEGIN -->[\s\S]*?<\/section>\s*/gi, '\n')
    .replace(
      /\s*<script type="application\/ld\+json" data-hyperlocal-gbp-schema>[\s\S]*?<\/script>\s*/gi,
      '\n'
    );
  while (/<section id="hyperlocal-gbp"/i.test(out)) {
    out = out.replace(/\s*<section id="hyperlocal-gbp"[\s\S]*?<\/section>\s*/i, '\n');
  }
  return out;
}

function usesCompact(html) {
  return (
    /reviews-map-section|hours-section|hyperlocal-gbp-section--compact/i.test(
      html
    ) && /id="hyperlocal-gbp"/i.test(html) === false
  );
}

function shouldUseCompact(html) {
  if (/reviews-map-section|class="hours-section"/i.test(html)) return true;
  return false;
}

function injectSection(html, baseName) {
  const block =
    LEGAL_COMPACT.has(baseName) || shouldUseCompact(html)
      ? compactBlock()
      : fullBlock();
  if (/<\/main>/i.test(html)) {
    return html.replace(/<\/main>/i, `${block}\n    </main>`);
  }
  if (/<footer/i.test(html)) {
    return html.replace(/<footer/i, `${block}\n\n    <footer`);
  }
  return html;
}

function injectSchema(html) {
  if (/data-hyperlocal-gbp-schema/i.test(html)) return html;
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `    ${schemaBlock()}\n</head>`);
  }
  return html;
}

let updated = 0;
const files = listHtmlFiles(root);

for (const filePath of files) {
  const base = path.basename(filePath);
  if (SKIP_FILES.has(base)) continue;

  let html = stripHyperlocal(fs.readFileSync(filePath, 'utf8'));

  const next = injectSchema(injectSection(html, base));
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(
  `inject-hyperlocal-gbp: processed ${files.length} HTML file(s), updated ${updated}`
);
