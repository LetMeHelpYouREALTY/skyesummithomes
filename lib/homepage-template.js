'use strict';

const C = require('./gbp-constants');
const R = require('./realscout-config');
const { graphScriptHtml } = require('./schema-graph');

const GSC_TOKEN = 'wKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI';
const PAGE_UPDATED = '2026-06-26';

const FAQS = [
  {
    q: 'Is the Skye Summit Master Plan open for move-in today?',
    a: 'No. Olympia Companies lists the community as <strong>coming Fall 2027</strong>. KB Home Vertice sales <strong>may</strong> open early 2027. This site tracks planned updates—not active Skye Summit resale inventory.',
  },
  {
    q: 'How do I join the interest list?',
    a: 'Use the <a href="/skye-summit-interest-list">interest list page</a> or <a href="/contact">contact form</a>. Dr. Jan Duffy sends builder and timeline updates as Olympia Companies and builders release information.',
  },
  {
    q: 'What is Dr. Jan Duffy\'s role with Skye Summit?',
    a: 'Dr. Jan Duffy is an independent buyer\'s representative and Nevada REALTOR® (license S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties. She is <strong>not</strong> employed by Olympia Companies or any builder.',
  },
  {
    q: 'Can I buy a home nearby while I wait?',
    a: 'Yes. Browse <a href="#nearby-homes">nearby homes available now</a> in Northwest Las Vegas, Centennial Hills, Skye Hills, and the 89166 area—separate from future Skye Summit Master Plan phases.',
  },
  {
    q: 'When may KB Home Vertice sales open?',
    a: 'KB Home Vertice at Skye Summit includes 299 homesites; sales <strong>may</strong> open early 2027 while homesite work continues (<em>Las Vegas Review-Journal</em>, Jan. 8, 2026; <a href="/skye-summit-timeline">timeline updated June 6, 2026</a>).',
  },
  {
    q: 'When is the broader master plan expected to launch?',
    a: 'Olympia Companies targets a <strong>Fall 2027</strong> community launch for the 505-acre Skye Summit Master Plan (<em>Las Vegas Review-Journal</em>, Jan. 8, 2026). Dates may change—verify with builders before you commit.',
  },
];

function faqHtml() {
  return FAQS.map(
    (f, i) => `
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i + 1}">
                            <span>${f.q}</span>
                            <i class="fas fa-chevron-down" aria-hidden="true"></i>
                        </button>
                        <div class="faq-answer" id="faq-answer-${i + 1}" role="region">
                            <p>${f.a}</p>
                        </div>
                    </div>`
  ).join('');
}

function faqJsonLd() {
  const strip = (s) =>
    s
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
      })),
      url: `${C.SITE}/`,
    },
    null,
    2
  );
}

function render() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script data-www-primary-redirect>
      if (location.hostname === 'skyesummithomes.com') {
        location.replace('https://www.skyesummithomes.com' + location.pathname + location.search + location.hash);
      }
    </script>
    <meta name="google-site-verification" content="${GSC_TOKEN}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Skye Summit Master Plan updates (planned Fall 2027). Join Dr. Jan Duffy's interest list for builder news. Browse nearby Northwest Las Vegas homes available now. Independent buyer's representative—(702) 930-8222.">
    <meta name="keywords" content="Skye Summit Master Plan, Olympia Companies, Fall 2027, interest list, northwest Las Vegas homes, Dr. Jan Duffy, buyer representation">
    <meta name="author" content="Dr. Jan Duffy, REALTOR®">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="geo.region" content="US-NV">
    <meta name="geo.placename" content="Skye Summit Master Plan, Las Vegas">
    <meta name="geo.position" content="${C.GEO_POSITION}">
    <meta name="ICBM" content="${C.GEO_ICBM}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Skye Summit | Homes by Dr. Jan Duffy">
    <meta property="og:url" content="${C.SITE}/">
    <meta property="og:title" content="Skye Summit Master Plan Updates | Interest List | Dr. Jan Duffy">
    <meta property="og:description" content="Planned Fall 2027 master plan updates and buyer representation from Dr. Jan Duffy. Join the interest list or browse nearby homes available now.">
    <meta property="og:image" content="${C.SITE}${C.OG_IMAGE_PATH}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Skye Summit Master Plan Updates | Dr. Jan Duffy">
    <meta name="twitter:description" content="Future community interest list + nearby Northwest Las Vegas homes. Independent REALTOR® buyer representation.">
    <title>Skye Summit Master Plan Updates | Interest List | Dr. Jan Duffy</title>
    <link rel="canonical" href="${C.SITE}/">
    <link rel="preload" href="styles.css" as="style">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap"></noscript>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" media="print" onload="this.media='all'">
    <noscript><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet"></noscript>
    <script defer src="/_vercel/insights/script.js"></script>
    <meta name="theme-color" content="#0A2540">
    <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml">
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').catch(function() {});
            });
        }
    </script>
    <link rel="dns-prefetch" href="https://em.realscout.com">
    <link rel="dns-prefetch" href="https://www.realscout.com">
    <link rel="preconnect" href="https://em.realscout.com" crossorigin>
    <link rel="preconnect" href="https://www.realscout.com" crossorigin>
    <script src="https://em.realscout.com/widgets/realscout-web-components.umd.js" type="module"></script>
    <style data-realscout-styles>
      realscout-office-listings {
        --rs-listing-divider-color: rgb(101, 141, 172);
        width: 100%;
        min-height: 480px;
        display: block;
        margin: 1.5rem 0 1rem;
      }
      .realscout-mls-note { font-size: 0.85rem; color: #64748b; margin-top: 0.75rem; text-align: center; }
    </style>
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
                <li><a href="/" class="active">Home</a></li>
                <li><a href="/skye-summit-master-plan">Master plan</a></li>
                <li><a href="/skye-summit-interest-list">Interest list</a></li>
                <li><a href="#nearby-homes">Nearby homes</a></li>
                <li><a href="/skye-summit-timeline">Timeline</a></li>
                <li><a href="/skye-summit-faq">FAQ</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                <span class="hamburger"></span>
            </button>
        </nav>
    </header>

    <!-- HOMEPAGE_MANAGED -->
    <main id="main-content" role="main">

        <section id="home" class="hero hero--home hero--future" aria-labelledby="hero-title">
            <div class="hero-content">
                <p class="status-badge" role="status"><i class="fas fa-calendar-alt" aria-hidden="true"></i> Planned community | Fall 2027</p>
                <h1 id="hero-title"><span class="hero-title-main">Skye Summit Master Plan Updates</span></h1>
                <p class="hero-subtitle">Independent buyer representation from Dr. Jan Duffy, REALTOR<sup>&reg;</sup>. Get early-access builder and timeline news for the planned Olympia Companies community—while you can still tour <strong>nearby homes available now</strong> in Northwest Las Vegas.</p>
                <p class="site-disclaimer">Independent REALTOR<sup>&reg;</sup> site. Information subject to change. Not the official developer website. Dr. Jan Duffy is not employed by Olympia Companies or any home builder.</p>
                <div class="hero-cta hero-cta-primary">
                    <a href="/skye-summit-interest-list" class="btn btn-primary btn-large">Join the interest list</a>
                    <a href="#nearby-homes" class="btn btn-secondary btn-large">Browse nearby homes now</a>
                    <a href="/contact" class="btn btn-map btn-large">Book a consultation</a>
                    <p class="hero-phone">Call <a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a></p>
                </div>
            </div>
            <div class="hero-overlay" aria-hidden="true"></div>
        </section>

        <section class="trust-strip" aria-label="Credentials">
            <div class="container trust-strip__inner">
                <div class="trust-strip__item"><i class="fas fa-handshake" aria-hidden="true"></i> Buyer's representation</div>
                <div class="trust-strip__item"><i class="fas fa-building" aria-hidden="true"></i> Berkshire Hathaway HomeServices</div>
                <div class="trust-strip__item"><i class="fas fa-id-card" aria-hidden="true"></i> License ${C.LICENSE}</div>
                <div class="trust-strip__item"><i class="fas fa-map-pin" aria-hidden="true"></i> Service area: ${C.SERVICE_AREA_GBP}</div>
            </div>
        </section>

        <section id="what-is-skye-summit" class="why-section" aria-labelledby="what-is-title">
            <div class="container">
                <h2 id="what-is-title">What is the Skye Summit Master Plan?</h2>
                <p class="section-description">A planned northwest Las Vegas community—not a move-in-ready subdivision today. Facts below are sourced from public reporting and may change.</p>
                <ul class="fact-list">
                    <li><strong>505-acre master plan</strong> beyond the 215 Beltway (<em>Las Vegas Review-Journal</em>, Jan. 8, 2026)</li>
                    <li><strong>~3,500 planned homes</strong> with integrated parks and trail systems (<em>Las Vegas Review-Journal</em>, Jan. 8, 2026; <a href="https://skyesummit.com/" target="_blank" rel="noopener noreferrer">Olympia Companies</a>)</li>
                    <li><strong>Fall 2027</strong> community launch target (<em>Las Vegas Review-Journal</em>, Jan. 8, 2026)</li>
                    <li><strong>KB Home Vertice:</strong> 299 homesites; sales <strong>may</strong> open early 2027 (<em>Las Vegas Review-Journal</em>, Jan. 8, 2026; <a href="/skye-summit-timeline">site timeline</a>, June 6, 2026)</li>
                    <li><strong>Additional builders</strong> including Woodside Homes and Century Communities have reported land purchases in the area (<em>Las Vegas Review-Journal</em>, Feb. 12, 2026)</li>
                </ul>
                <p class="guide-last-updated">Page updated <time datetime="${PAGE_UPDATED}">June 26, 2026</time>. See <a href="/skye-summit-timeline">full timeline</a> · <a href="/olympia-companies-skye-summit">Olympia overview</a> · <a href="/kb-home-vertice-skye-summit">KB Home Vertice</a></p>
            </div>
        </section>

        <section id="what-now" class="services-overview" aria-labelledby="what-now-title">
            <div class="container">
                <h2 id="what-now-title">What you can do now</h2>
                <div class="action-cards">
                    <a href="/skye-summit-interest-list" class="action-card action-card--primary">
                        <i class="fas fa-bell" aria-hidden="true"></i>
                        <h3>Join the interest list</h3>
                        <p>Get email updates on builder phases, floor plans, and pricing as the master plan advances toward Fall 2027.</p>
                    </a>
                    <a href="#nearby-homes" class="action-card">
                        <i class="fas fa-search" aria-hidden="true"></i>
                        <h3>Tour nearby Northwest Las Vegas homes</h3>
                        <p>Search active listings in Centennial Hills, Skye Hills, and the 89166 corridor—not future Skye Summit phases.</p>
                    </a>
                    <a href="/buy" class="action-card">
                        <i class="fas fa-clipboard-list" aria-hidden="true"></i>
                        <h3>Plan your move and financing</h3>
                        <p>Mortgage pre-approval, timeline planning, and buyer representation before builder contracts open.</p>
                    </a>
                </div>
            </div>
        </section>

        <!-- ${R.MARKER} -->
        <section id="nearby-homes" class="realscout-listings-section listings listings--nearby" aria-labelledby="nearby-homes-title">
            <div class="container">
                <h2 id="nearby-homes-title">Nearby homes available now</h2>
                <p class="section-description">These MLS listings are in <strong>Northwest Las Vegas / Centennial Hills / Skye Hills / 89166</strong>—not inventory inside the future Skye Summit Master Plan. Use them if you need a home before Fall 2027.</p>
                <realscout-office-listings
                    agent-encoded-id="${R.AGENT_ENCODED_ID}"
                    sort-order="${R.SORT_ORDER}"
                    listing-status="${R.LISTING_STATUS}"
                    property-types="${R.PROPERTY_TYPES}"
                    price-min="${R.PRICE_MIN}"
                    price-max="${R.PRICE_MAX}"></realscout-office-listings>
                <p class="realscout-mls-note">Listing data courtesy of MLS. <a href="/mls-disclaimer">Listing data notice</a> · <a href="/centennial-hills-real-estate">Centennial Hills guide</a> · <a href="/las-vegas-zip-code-map">Zip code map</a></p>
            </div>
        </section>

        <section id="why-jan" class="advisor advisor--compact" aria-labelledby="why-jan-title">
            <div class="container">
                <h2 id="why-jan-title">Why work with Dr. Jan Duffy</h2>
                <div class="advisor-content">
                    <div class="advisor-image">
                        <img class="agent-headshot agent-headshot--advisor" src="/images/agents/dr-jan-duffy.jpg?v=3" width="200" height="200" loading="lazy" decoding="async" alt="Dr. Jan Duffy, REALTOR®, buyer's representative">
                    </div>
                    <div class="advisor-text">
                        <p>Dr. Jan Duffy is a Nevada REALTOR® (licensed since 2009) and <strong>independent buyer's representative</strong> for the Skye Summit Master Plan. She helps buyers interpret builder timelines, compare nearby alternatives, and coordinate representation before you sign a builder contract.</p>
                        <div class="trust-badges">
                            <span class="badge">${C.BROKERAGE}</span>
                            <span class="badge">Buyer's representation</span>
                        </div>
                        <p><a href="/about">About Dr. Jan</a> · <a href="/skye-summit-realtor">Representation services</a> · <a href="/office-location">Office &amp; directions</a></p>
                    </div>
                </div>
            </div>
        </section>

        <section class="guides-compact" aria-labelledby="guides-title">
            <div class="container">
                <h2 id="guides-title">Helpful guides</h2>
                <p class="section-description">Deeper answers on timeline, builders, schools, and buying steps.</p>
                <ul class="guides-compact__links">
                    <li><a href="/skye-summit-timeline">Fall 2027 timeline</a></li>
                    <li><a href="/skye-summit-faq">FAQ</a></li>
                    <li><a href="/new-construction-skye-summit">New construction steps</a></li>
                    <li><a href="/skye-summit-schools">Schools</a></li>
                    <li><a href="/centennial-hills-real-estate">Centennial Hills market</a></li>
                    <li><a href="/northwest-las-vegas-real-estate">Northwest Las Vegas</a></li>
                </ul>
            </div>
        </section>

        <section class="faq" aria-labelledby="faq-title">
            <div class="container">
                <h2 id="faq-title">Common questions</h2>
                <div class="faq-container">${faqHtml()}
                </div>
                <p class="guide-last-updated" style="text-align:center;margin-top:1.5rem;">More answers on <a href="/skye-summit-faq">Skye Summit FAQ</a></p>
            </div>
        </section>

        <section class="cta-section" aria-labelledby="final-cta-title">
            <div class="container">
                <h2 id="final-cta-title">Get Skye Summit Master Plan updates</h2>
                <p>Join the interest list for builder news, or call to discuss nearby homes and your timeline.</p>
                <div class="cta-buttons">
                    <a href="/skye-summit-interest-list" class="btn btn-primary btn-large">Join the interest list</a>
                    <a href="tel:${C.PHONE_TEL}" class="btn btn-secondary btn-large">Call ${C.PHONE_DISPLAY}</a>
                </div>
                <p class="cta-note">Office: ${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL} · <a href="${C.MAPS_DIRECTIONS}" style="color:#fff;">Directions</a></p>
            </div>
        </section>

        <section class="office-compact" aria-labelledby="office-title">
            <div class="container">
                <h2 id="office-title">${C.GBP_BUSINESS_NAME}</h2>
                <p>${C.AGENT_NAME}, ${C.AGENT_TITLE} · ${C.AGENT_ROLE}<br>${C.BROKERAGE}</p>
                <p><a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a> · <a href="mailto:${C.EMAIL}">${C.EMAIL}</a></p>
                <p><a href="${C.MAPS_DIRECTIONS}" target="_blank" rel="noopener">${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL}</a></p>
                <p class="guide-last-updated">Hours: Sun–Sat 9 AM–6 PM · <a href="${C.GBP_URL}" target="_blank" rel="noopener">Google reviews</a></p>
            </div>
        </section>
    </main>

    <footer id="contact" class="footer" role="contentinfo">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${C.GBP_BUSINESS_NAME}</h3>
                    <p>${C.AGENT_NAME}, ${C.AGENT_TITLE} · ${C.AGENT_ROLE}<br>${C.BROKERAGE}</p>
                    <div class="contact-info">
                        <p><i class="fas fa-phone" aria-hidden="true"></i> <a href="tel:${C.PHONE_TEL}">${C.PHONE_DISPLAY}</a></p>
                        <p><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:${C.EMAIL}">${C.EMAIL}</a></p>
                    </div>
                </div>
                <div class="footer-section">
                    <h4>Master plan</h4>
                    <ul>
                        <li><a href="/skye-summit-interest-list">Interest list</a></li>
                        <li><a href="/skye-summit-timeline">Timeline</a></li>
                        <li><a href="/skye-summit-master-plan">Master plan hub</a></li>
                        <li><a href="/skye-summit-faq">FAQ</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Nearby &amp; services</h4>
                    <ul>
                        <li><a href="#nearby-homes">Nearby homes now</a></li>
                        <li><a href="/centennial-hills-real-estate">Centennial Hills</a></li>
                        <li><a href="/buy">Buyer services</a></li>
                        <li><a href="/valuation">Home valuation consult</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 ${C.AGENT_NAME}, ${C.AGENT_TITLE} ${C.LICENSE}. All rights reserved.</p>
                <div class="footer-legal">
                    <a href="/privacy">Privacy</a>
                    <a href="/terms">Terms</a>
                    <a href="/mls-disclaimer">Listing data notice</a>
                </div>
            </div>
        </div>
    </footer>

    <aside class="mobile-buyer-bar" aria-label="Quick actions">
        <a class="mobile-buyer-bar__call" href="tel:${C.PHONE_TEL}"><i class="fas fa-phone" aria-hidden="true"></i> Call</a>
        <a class="mobile-buyer-bar__listings" href="/skye-summit-interest-list">Interest list</a>
        <a class="mobile-buyer-bar__contact" href="/contact">Book</a>
    </aside>

    <button id="back-to-top" class="back-to-top" aria-label="Back to top">
        <i class="fas fa-chevron-up" aria-hidden="true"></i>
    </button>

    <script src="script.js" defer></script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "${C.SITE}/#webpage",
      "url": "${C.SITE}/",
      "name": "Skye Summit Master Plan Updates | Dr. Jan Duffy",
      "description": "Future Skye Summit Master Plan interest list and buyer representation. Nearby Northwest Las Vegas homes available now.",
      "dateModified": "${PAGE_UPDATED}",
      "about": { "@id": "${C.SITE}/#skye-summit-master-plan" },
      "author": { "@id": "${C.SITE}/#agent" }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "${C.SITE}/#website",
      "name": "${C.GBP_BUSINESS_NAME}",
      "url": "${C.SITE}",
      "description": "Skye Summit Master Plan updates and independent buyer representation from Dr. Jan Duffy, REALTOR®.",
      "publisher": { "@id": "${C.SITE}/#localbusiness" }
    }
    </script>

    <script type="application/ld+json" data-aeo-core-faq>
${faqJsonLd()}
    </script>

    ${graphScriptHtml()}
</body>
</html>`;
}

module.exports = { render, FAQS, PAGE_UPDATED };
