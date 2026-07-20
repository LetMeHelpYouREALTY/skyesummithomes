#!/usr/bin/env node
/**
 * Injects RealScout office listings immediately below the hero on every
 * marketing page, with maximized appointment CTAs so buyers click listing photos.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const R = require('../lib/realscout-config');

const root = path.join(__dirname, '..');

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
  'research',
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

function appointmentCtaGroup(extraClass = '') {
  return `
                <div class="rs-appt-cta ${extraClass}" role="group" aria-label="Book a showing or consultation">
                    <a href="/contact" class="btn btn-primary btn-large rs-appt-cta__primary">Book a free showing appointment</a>
                    <a href="tel:${C.PHONE_TEL}" class="btn btn-secondary btn-large">Call ${C.PHONE_DISPLAY}</a>
                    <a href="${C.SMS_URL}" class="btn btn-secondary btn-large">Text to book</a>
                </div>`;
}

function widgetSectionHtml() {
  return `
        <!-- ${R.MARKER} -->
        <section id="${R.SECTION_ID}" class="realscout-listings-section realscout-listings-section--interactive" aria-labelledby="realscout-listings-title">
            <div class="container">
                <p class="rs-kicker"><i class="fas fa-hand-pointer" aria-hidden="true"></i> Tap any home photo to open details</p>
                <h2 id="realscout-listings-title">Homes you can tour now — click a photo</h2>
                <p class="section-description rs-lead">Browse active Las Vegas office listings while you wait on Skye Summit Master Plan releases. <strong>Click any listing image</strong> to see the full home, then book a showing with Dr. Jan Duffy.</p>
                ${appointmentCtaGroup('rs-appt-cta--top')}
                <div class="rs-widget-shell" id="rs-widget-shell">
                    ${widgetBodyHtml()}
                </div>
                <div class="rs-click-prompt" role="note">
                    <p><i class="fas fa-images" aria-hidden="true"></i> <strong>Tip:</strong> Click the home photo that fits your search — we&rsquo;ll help you schedule a private tour or virtual walkthrough.</p>
                </div>
                ${appointmentCtaGroup('rs-appt-cta--bottom')}
                <p class="realscout-mls-note">Listing data courtesy of MLS. <a href="/mls-disclaimer">MLS listing data notice</a> · Prefer a curated shortlist? <a href="/contact">Request an appointment</a> · <a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a></p>
            </div>
        </section>`;
}

function stickyAppointmentBarHtml() {
  return `
    <!-- ${R.STICKY_MARKER} -->
    <aside class="appt-sticky" role="complementary" aria-label="Book an appointment">
        <div class="appt-sticky__inner">
            <p class="appt-sticky__copy"><strong>Ready to tour?</strong> Book a free appointment with Dr. Jan Duffy.</p>
            <div class="appt-sticky__actions">
                <a href="/contact" class="btn btn-primary appt-sticky__book">Book appointment</a>
                <a href="tel:${C.PHONE_TEL}" class="btn btn-secondary appt-sticky__call">Call ${C.PHONE_DISPLAY}</a>
                <a href="#${R.SECTION_ID}" class="btn btn-secondary appt-sticky__browse">Browse homes</a>
            </div>
        </div>
    </aside>`;
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
        min-height: 640px;
        display: block;
        margin: 0;
      }
      .realscout-listings-section--interactive {
        padding: 2.5rem 0 3rem;
        background: linear-gradient(180deg, #f0f6fc 0%, #ffffff 42%);
        border-top: 1px solid rgba(10, 37, 64, 0.08);
        border-bottom: 1px solid rgba(10, 37, 64, 0.06);
      }
      .rs-kicker {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.8125rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #1e5a8a;
        margin: 0 0 0.65rem;
      }
      .realscout-listings-section--interactive h2 {
        color: #0a2540;
        font-size: clamp(1.6rem, 3vw, 2.15rem);
        margin-bottom: 0.75rem;
        text-align: center;
      }
      .rs-lead {
        max-width: 44rem;
        margin: 0 auto 1.25rem;
        text-align: center;
        color: #334155;
        font-size: 1.05rem;
      }
      .rs-widget-shell {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        background: #fff;
        box-shadow: 0 12px 40px rgba(10, 37, 64, 0.12);
        border: 1px solid rgba(58, 141, 222, 0.25);
        padding: 0.75rem;
        margin: 1rem 0;
        min-height: 640px;
      }
      .rs-widget-shell::after {
        content: "Click a photo →";
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 2;
        pointer-events: none;
        background: #0a2540;
        color: #fff;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 0.45rem 0.7rem;
        border-radius: 999px;
        opacity: 0.92;
        animation: rsPulse 2.4s ease-in-out infinite;
      }
      @keyframes rsPulse {
        0%, 100% { transform: translateY(0); opacity: 0.88; }
        50% { transform: translateY(-3px); opacity: 1; }
      }
      .rs-appt-cta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
        margin: 1rem 0 1.25rem;
      }
      .rs-appt-cta .btn {
        min-width: min(100%, 14rem);
      }
      .rs-appt-cta__primary {
        box-shadow: 0 8px 24px rgba(58, 141, 222, 0.35);
      }
      .rs-click-prompt {
        text-align: center;
        background: #fff7ed;
        border: 1px solid #fdba74;
        border-radius: 8px;
        padding: 0.85rem 1rem;
        margin: 0.5rem 0 1rem;
        color: #9a3412;
      }
      .rs-click-prompt p { margin: 0; }
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
      .appt-sticky {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1200;
        background: rgba(10, 37, 64, 0.96);
        color: #fff;
        box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.18);
        padding: 0.75rem 1rem;
      }
      .appt-sticky__inner {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem 1rem;
        align-items: center;
        justify-content: space-between;
      }
      .appt-sticky__copy {
        margin: 0;
        font-size: 0.95rem;
        flex: 1 1 16rem;
      }
      .appt-sticky__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .appt-sticky .btn {
        white-space: nowrap;
      }
      .appt-sticky__book {
        background: #3a8dde;
        border-color: #3a8dde;
      }
      body {
        padding-bottom: 5.5rem;
      }
      @media (max-width: 768px) {
        realscout-office-listings,
        .rs-widget-shell { min-height: 520px; }
        .rs-widget-shell::after { top: 0.65rem; right: 0.65rem; font-size: 0.68rem; }
        .appt-sticky__copy { font-size: 0.875rem; }
        .appt-sticky__actions { width: 100%; }
        .appt-sticky__actions .btn { flex: 1 1 auto; text-align: center; }
      }
    </style>`;
}

function stripRealscout(html) {
  return html
    .replace(/\s*<!-- REALSCOUT_WIDGET_BEGIN -->[\s\S]*?<\/section>\s*/gi, '\n')
    .replace(
      /\s*<!-- APPOINTMENT_CTA_STICKY_BEGIN -->[\s\S]*?<\/aside>\s*/gi,
      '\n'
    )
    .replace(/\s*<aside class="appt-sticky"[\s\S]*?<\/aside>\s*/gi, '\n')
    .replace(/\s*<script[^>]*data-realscout-loader[^>]*><\/script>\s*/gi, '\n')
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

/** Always place widget immediately after hero / service-hero (before AEO/geo). */
function injectAfterHero(html) {
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

function injectStickyBar(html) {
  if (html.includes(R.STICKY_MARKER) || /class="appt-sticky"/i.test(html)) {
    return html;
  }
  const bar = stickyAppointmentBarHtml();
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${bar}\n</body>`);
  }
  return html + bar;
}

let updated = 0;
for (const filePath of listHtmlFiles(root)) {
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
  let next = injectHeadEmbed(injectAfterHero(html));
  next = injectStickyBar(next);

  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`inject-realscout-widget: updated ${updated} HTML file(s)`);
