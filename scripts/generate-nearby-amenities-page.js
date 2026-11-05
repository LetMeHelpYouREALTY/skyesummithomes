#!/usr/bin/env node
/**
 * Generates /nearby-amenities (index.html + flat nearby-amenities.html).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');
const { COMMUNITY, PAGE_PATH } = require('../lib/amenity-map-config');
const {
  amenityMapSectionHtml,
  categoryCopySections,
  faqSectionHtml,
  trustCtaHtml,
  itemListSchemaJson,
  faqSchemaJson,
  placeSchemaJson,
  escapeHtml,
} = require('../lib/amenity-map-html');
const { IDS } = require('../lib/schema-graph');
const { guideFooterListHtml } = require('../lib/guide-nav');
const { ensureMapsHints } = require('../lib/cdn-hints');

const root = path.join(__dirname, '..');
const SITE = C.SITE;
const GSC_TOKEN = 'wKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI';
const canonical = `${SITE}${PAGE_PATH}`;
const title = `Nearby Amenities in ${COMMUNITY.shortName}, Las Vegas | Dr. Jan Duffy REALTOR®`;
const description = `Interactive map and guide to grocery, parks, healthcare, golf, schools, and shopping near the Skye Summit Master Plan in northwest Las Vegas. Call ${C.PHONE_DISPLAY}.`;
const ogImage = `${SITE}/images/sections/section-nearby-attractions.jpg`;

function renderPage() {
  const mapSection = amenityMapSectionHtml({
    heading: `Nearby Amenities in ${COMMUNITY.shortName}, Las Vegas`,
    compact: false,
    showFullLink: false,
    useH1: true,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script data-www-primary-redirect>
      (function () {
        var host = location.hostname;
        var path = location.pathname;
        var www = 'https://www.skyesummithomes.com';
        if (path.length > 1 && path.charAt(path.length - 1) === '/') {
          path = path.slice(0, -1);
          location.replace(www + path + location.search + location.hash);
          return;
        }
        if (host === 'skyesummithomes.com') {
          location.replace(www + path + location.search + location.hash);
        }
      })();
    </script>
    <!-- BRAND_FAVICON_BEGIN -->
    <link data-brand-favicon rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <!-- BRAND_FAVICON_END -->
    <meta name="google-site-verification" content="${GSC_TOKEN}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="Dr. Jan Duffy, REALTOR®">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="geo.region" content="US-NV">
    <meta name="geo.placename" content="${escapeHtml(COMMUNITY.name)}, Las Vegas">
    <meta name="geo.position" content="${COMMUNITY.lat};${COMMUNITY.lng}">
    <meta name="ICBM" content="${COMMUNITY.lat}, ${COMMUNITY.lng}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escapeHtml(C.GBP_BUSINESS_NAME)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${ogImage}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${ogImage}">
    <title>${escapeHtml(title)}</title>
    <link rel="canonical" href="${canonical}">
    <link rel="dns-prefetch" href="https://imagedelivery.net">
    <meta name="google-maps-api-key" content="">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
    <link rel="preload" href="/styles.css?v=20260721about1" as="style">
    <link rel="stylesheet" href="/styles.css?v=20260721about1">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" media="print" onload="this.media='all'">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "${canonical}#webpage",
      "name": ${JSON.stringify(`Nearby Amenities in ${COMMUNITY.shortName}, Las Vegas`)},
      "description": ${JSON.stringify(description)},
      "url": ${JSON.stringify(canonical)},
      "inLanguage": "en-US",
      "about": { "@id": "${IDS.masterPlan}" },
      "author": { "@id": "${IDS.agent}" },
      "publisher": { "@id": "${IDS.localBusiness}" }
    }
    </script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE}/" },
        { "@type": "ListItem", "position": 2, "name": "Community", "item": "${SITE}/community" },
        { "@type": "ListItem", "position": 3, "name": "Nearby amenities", "item": ${JSON.stringify(canonical)} }
      ]
    }
    </script>
    <script type="application/ld+json">
${placeSchemaJson()}
    </script>
    <script type="application/ld+json">
${itemListSchemaJson()}
    </script>
    <script type="application/ld+json">
${faqSchemaJson()}
    </script>
</head>
<body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <header class="header" role="banner">
        <nav class="nav" aria-label="Main navigation">
            <div class="nav-brand">
                <a href="/" class="nav-logo" aria-label="Skye Summit Homes — Home">
                    <span class="nav-logo-skye">Skye</span><span class="nav-logo-summit"> Summit</span>
                </a>
            </div>
            <ul class="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/community">Communities</a></li>
                <li><a href="${PAGE_PATH}" class="active">Amenities</a></li>
                <li><a href="/homes-for-sale-skye-summit">Homes</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span class="hamburger"></span>
            </button>
        </nav>
    </header>

    <main id="main-content" role="main">
        <nav class="container amenity-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> &rsaquo; <a href="/community">Community</a> &rsaquo; <span aria-current="page">Nearby amenities</span>
        </nav>
        <section class="aeo-quick-answer" aria-labelledby="amenity-aeo">
            <div class="container">
                <h2 id="amenity-aeo" class="aeo-quick-answer__title">In plain terms</h2>
                <p class="aeo-quick-answer__text">Skye Summit sits in northwest Las Vegas beyond the 215 Beltway with Red Rock Canyon to the west and Centennial Hills shopping, grocery, and healthcare along Durango Dr. Use the map to explore categories, then call ${escapeHtml(C.PHONE_DISPLAY)} for buyer representation on the master plan.</p>
            </div>
        </section>
${mapSection}
${categoryCopySections()}
${faqSectionHtml()}
${trustCtaHtml()}
    </main>

    <footer class="footer" role="contentinfo">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Dr. Jan Duffy, REALTOR®</h3>
                    <p>Berkshire Hathaway HomeServices Nevada Properties</p>
                    <p><a href="tel:${C.PHONE_TEL}">${escapeHtml(C.PHONE_DISPLAY)}</a> · <a href="mailto:${C.EMAIL}">${escapeHtml(C.EMAIL)}</a></p>
                </div>
                <div class="footer-section">
                    <h4>Guides</h4>
                    <ul>
${guideFooterListHtml()}
                        <li><a href="${PAGE_PATH}">Nearby amenities</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Dr. Jan Duffy, REALTOR® ${escapeHtml(C.LICENSE)}.</p>
            </div>
        </div>
    </footer>
    <script src="/script.js"></script>
    <script src="/nearby-amenities/amenity-map.js" defer></script>
</body>
</html>
`;
}

const html = ensureMapsHints(renderPage(), { preconnect: false });
const outDir = path.join(root, 'nearby-amenities');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'index.html'), html);
fs.writeFileSync(path.join(root, 'nearby-amenities.html'), html);
console.log('generate-nearby-amenities-page: wrote nearby-amenities/index.html');
