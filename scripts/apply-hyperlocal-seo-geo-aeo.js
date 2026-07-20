#!/usr/bin/env node
/**
 * Applies Parallel deep-research hyperlocal SEO / GEO / AEO to root HTML pages:
 * titles, meta descriptions, H1s, AEO quick answers, related links, entity strip,
 * Place/Speakable reinforcement, footer quick links.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const {
  PAGE_SEO,
  ENTITY_LINKS,
  FOOTER_QUICK_LINKS,
  FOOTER_AREA_LINKS,
} = require('../lib/hyperlocal-seo');

const root = path.join(__dirname, '..');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setMetaContent(html, attr, key, value) {
  const re = new RegExp(
    `(<meta\\s+${attr}=["']${key}["']\\s+content=")[^"]*(")`,
    'i'
  );
  if (re.test(html)) return html.replace(re, `$1${escapeHtml(value)}$2`);
  const re2 = new RegExp(
    `(<meta\\s+content=")[^"]*("\\s+${attr}=["']${key}["'])`,
    'i'
  );
  if (re2.test(html)) return html.replace(re2, `$1${escapeHtml(value)}$2`);
  return html;
}

function setTitle(html, title) {
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  }
  return html;
}

function setH1(html, seo) {
  if (seo.h1Main && seo.h1Sub) {
    const next = `<span class="hero-title-main">${escapeHtml(seo.h1Main)}</span> <span class="hero-title-sub">${escapeHtml(seo.h1Sub)}</span>`;
    if (/<h1[^>]*id="hero-title"[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
      return html.replace(
        /(<h1[^>]*id="hero-title"[^>]*>)[\s\S]*?(<\/h1>)/i,
        `$1${next}$2`
      );
    }
  }
  if (seo.h1) {
    // Prefer first main H1 in service-hero or page
    if (/<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)) {
      return html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${escapeHtml(seo.h1)}</h1>`);
    }
  }
  return html;
}

function entityStripHtml() {
  const links = ENTITY_LINKS.slice(0, 8)
    .map(
      (e) =>
        `<a href="${e.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(e.anchors[0])}</a>`
    )
    .join(' · ');
  return `
        <!-- HYPERLOCAL_ENTITIES_BEGIN -->
        <nav class="hyperlocal-entities" aria-label="Skye Summit local entities">
            <div class="container">
                <p class="hyperlocal-entities__label">Skye Summit local context</p>
                <p class="hyperlocal-entities__links">${links}</p>
            </div>
        </nav>`;
}

function relatedHtml(related) {
  if (!related?.length) return '';
  const items = related
    .map((href) => {
      const label =
        FOOTER_QUICK_LINKS.find((l) => l.href === href)?.label ||
        FOOTER_AREA_LINKS.find((l) => l.href === href)?.label ||
        href.replace(/^\//, '').replace(/-/g, ' ');
      return `<li><a href="${href}">${escapeHtml(label)}</a></li>`;
    })
    .join('');
  return `
        <!-- HYPERLOCAL_RELATED_BEGIN -->
        <section class="hyperlocal-related" aria-labelledby="hyperlocal-related-title">
            <div class="container">
                <h2 id="hyperlocal-related-title">Skye Summit realtor resources</h2>
                <ul class="hyperlocal-related__list">${items}</ul>
            </div>
        </section>`;
}

function placeSchemaHtml() {
  const place = {
    '@context': 'https://schema.org',
    '@type': ['Place', 'Residence'],
    '@id': `${C.SITE}/skye-summit-master-plan/#place`,
    name: 'Skye Summit Master Plan',
    alternateName: 'Skye Summit',
    description:
      "A 505-acre Olympia Companies master-planned community in northwest Las Vegas, planned for approximately 3,500 homes with KB Home's Vertice as the first village.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: C.CITY,
      addressRegion: C.REGION,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: C.SKYE_SUMMIT_AREA_LAT,
      longitude: C.SKYE_SUMMIT_AREA_LNG,
    },
    containedInPlace: { '@type': 'City', name: C.CITY },
    developer: {
      '@type': 'Organization',
      name: 'Olympia Companies',
      url: 'https://www.olympiacompanies.com/',
    },
    numberOfHousingUnits: 3500,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Trails', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parks', value: true },
    ],
  };
  return `<script type="application/ld+json" data-skye-summit-place>\n${JSON.stringify(place, null, 2)}\n    </script>`;
}

function speakableHtml() {
  return `<script type="application/ld+json" data-geo-speakable>
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".aeo-quick-answer__text", ".hyperlocal-lead"]
      }
    }
    </script>`;
}

function footerQuickLinksHtml() {
  const quick = FOOTER_QUICK_LINKS.map(
    (l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`
  ).join(' · ');
  const areas = FOOTER_AREA_LINKS.map(
    (l) => `<a href="${l.href}">${escapeHtml(l.label)}</a>`
  ).join(' · ');
  return `
                <!-- HYPERLOCAL_FOOTER_LINKS_BEGIN -->
                <p class="footer-hyperlocal-links"><strong>Quick links:</strong> ${quick}</p>
                <p class="footer-hyperlocal-links"><strong>Areas:</strong> ${areas}</p>
                <p class="footer-hyperlocal-links"><strong>Realtor services:</strong> <a href="/skye-summit-realtor">Skye Summit REALTOR®</a> · <a href="/buy">Buyer representation</a> · <a href="/skye-summit-interest-list">Interest list</a> · <a href="/new-construction-skye-summit">New construction</a></p>`;
}

function stripBlocks(html) {
  return html
    .replace(/\s*<!-- HYPERLOCAL_ENTITIES_BEGIN -->[\s\S]*?<\/nav>\s*/gi, '\n')
    .replace(/\s*<!-- HYPERLOCAL_RELATED_BEGIN -->[\s\S]*?<\/section>\s*/gi, '\n')
    .replace(/\s*<!-- HYPERLOCAL_FOOTER_LINKS_BEGIN -->[\s\S]*?(?=<div class="footer-bottom"|<\/div>\s*<div class="footer-bottom")/gi, '\n')
    .replace(
      /\s*<script type="application\/ld\+json" data-skye-summit-place>[\s\S]*?<\/script>\s*/gi,
      '\n'
    );
}

function ensureAeoAnswer(html, quickAnswer) {
  if (!quickAnswer) return html;
  const text = escapeHtml(quickAnswer);
  if (/class="aeo-quick-answer__text"/i.test(html)) {
    return html.replace(
      /(<p class="aeo-quick-answer__text">)[\s\S]*?(<\/p>)/i,
      `$1${text}$2`
    );
  }
  // Insert after first H1 section when missing
  const block = `
        <section class="aeo-quick-answer" aria-label="Quick answer">
            <div class="container">
                <p class="aeo-quick-answer__label">Quick answer</p>
                <p class="aeo-quick-answer__text">${text}</p>
            </div>
        </section>`;
  if (/<\/section>/i.test(html) && /hero|service-hero/i.test(html)) {
    return html.replace(
      /(<(?:section)[^>]*class="[^"]*(?:hero|service-hero)[^"]*"[^>]*>[\s\S]*?<\/section>)/i,
      `$1\n${block}`
    );
  }
  if (/<main[^>]*>/i.test(html)) {
    return html.replace(/<main[^>]*>/i, (m) => `${m}\n${block}`);
  }
  return html;
}

function injectFooterLinks(html) {
  if (/HYPERLOCAL_FOOTER_LINKS_BEGIN/i.test(html)) return html;
  if (/footer-bottom/i.test(html)) {
    return html.replace(
      /(<div class="footer-bottom">)/i,
      `${footerQuickLinksHtml()}\n                $1`
    );
  }
  return html;
}

function injectEntities(html) {
  if (/HYPERLOCAL_ENTITIES_BEGIN/i.test(html)) return html;
  const block = entityStripHtml();
  if (/class="aeo-quick-answer"/i.test(html)) {
    return html.replace(
      /(<section class="aeo-quick-answer"[\s\S]*?<\/section>)/i,
      `$1\n${block}`
    );
  }
  if (/<\/main>/i.test(html)) {
    return html.replace(/<\/main>/i, `${block}\n    </main>`);
  }
  return html;
}

function injectRelated(html, related) {
  const block = relatedHtml(related);
  if (!block) return html;
  if (/HYPERLOCAL_RELATED_BEGIN/i.test(html)) {
    return html.replace(
      /<!-- HYPERLOCAL_RELATED_BEGIN -->[\s\S]*?<\/section>/i,
      block.replace(/^\s*/, '')
    );
  }
  if (/id="hyperlocal-gbp"/i.test(html)) {
    return html.replace(
      /(<section[^>]*id="hyperlocal-gbp"[\s\S]*?<\/section>)/i,
      `$1\n${block}`
    );
  }
  if (/<\/main>/i.test(html)) {
    return html.replace(/<\/main>/i, `${block}\n    </main>`);
  }
  return html;
}

function ensureHeadSchemas(html) {
  if (!/data-skye-summit-place/i.test(html) && /<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `    ${placeSchemaHtml()}\n</head>`);
  }
  if (!/data-geo-speakable/i.test(html) && /<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `    ${speakableHtml()}\n</head>`);
  }
  return html;
}

let updated = 0;
for (const [fileName, seo] of Object.entries(PAGE_SEO)) {
  const filePath = path.join(root, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`skip missing ${fileName}`);
    continue;
  }
  let html = stripBlocks(fs.readFileSync(filePath, 'utf8'));
  html = setTitle(html, seo.title);
  html = setMetaContent(html, 'name', 'description', seo.description);
  html = setMetaContent(html, 'property', 'og:title', seo.title);
  html = setMetaContent(html, 'property', 'og:description', seo.description);
  html = setMetaContent(html, 'name', 'twitter:title', seo.title);
  html = setMetaContent(html, 'name', 'twitter:description', seo.description);
  html = setH1(html, seo);
  html = ensureAeoAnswer(html, seo.quickAnswer);
  html = injectEntities(html);
  html = injectRelated(html, seo.related);
  html = injectFooterLinks(html);
  html = ensureHeadSchemas(html);
  fs.writeFileSync(filePath, html);
  updated += 1;
}

// Minimal CSS hooks (append once)
const cssPath = path.join(root, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');
const extraCss = `
.hyperlocal-entities{background:linear-gradient(180deg,#f0f6fc 0,#fff 100%);padding:1.25rem 0;border-top:1px solid rgba(10,37,64,.08);border-bottom:1px solid rgba(10,37,64,.06)}
.hyperlocal-entities__label{font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#0a2540;margin:0 0 .35rem}
.hyperlocal-entities__links{font-size:.925rem;line-height:1.7;color:#334155;margin:0}
.hyperlocal-entities__links a{color:#1e5a8a;text-decoration:underline;text-underline-offset:2px}
.hyperlocal-related{padding:2.5rem 0;background:#fff}
.hyperlocal-related h2{color:#0a2540;font-size:1.5rem;margin-bottom:1rem;text-align:center}
.hyperlocal-related__list{display:flex;flex-wrap:wrap;gap:.75rem 1.25rem;justify-content:center;list-style:none;padding:0;margin:0}
.hyperlocal-related__list a{color:#0a2540;font-weight:600;text-decoration:none;border-bottom:2px solid #3a8dde}
.footer-hyperlocal-links{font-size:.85rem;line-height:1.7;color:#cbd5e1;margin:.5rem 0;max-width:1100px}
.footer-hyperlocal-links a{color:#93c5fd;text-decoration:none}
.footer-hyperlocal-links a:hover{text-decoration:underline}
.aeo-quick-answer{background:#0a2540;color:#fff;padding:1.25rem 0}
.aeo-quick-answer__label{font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#93c5fd;margin:0 0 .4rem}
.aeo-quick-answer__text{margin:0;max-width:52rem;font-size:1.05rem;line-height:1.65;color:#f8fafc}
`;
if (!css.includes('.hyperlocal-entities{')) {
  css += extraCss;
  fs.writeFileSync(cssPath, css);
}

console.log(`apply-hyperlocal-seo-geo-aeo: updated ${updated} page(s)`);
