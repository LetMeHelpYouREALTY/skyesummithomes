'use strict';

const C = require('./gbp-constants');
const {
  COMMUNITY,
  FEATURED_PLACES,
  PAGE_PATH,
  embedFallbackUrl,
  clientConfig,
  formatAddress,
  directionsUrl,
} = require('./amenity-map-config');
const { IDS } = require('./schema-graph');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function staticPlaceListHtml(options = {}) {
  const { compact = false } = options;
  const items = compact ? FEATURED_PLACES.slice(0, 6) : FEATURED_PLACES;
  const lis = items
    .map(
      (p) =>
        `<li><strong>${escapeHtml(p.name)}</strong> — ${escapeHtml(formatAddress(p))}` +
        (p.note ? ` <span class="amenity-map-static__note">(${escapeHtml(p.note)})</span>` : '') +
        ` · <a href="${directionsUrl(p)}" rel="noopener noreferrer" target="_blank">Directions</a></li>`
    )
    .join('\n                        ');
  return `<ul class="amenity-map-static__list">${lis}</ul>`;
}

/**
 * Reusable amenity map block (homepage + cluster pages).
 * @param {{ heading?: string, compact?: boolean, showFullLink?: boolean }} opts
 */
function amenityMapSectionHtml(opts = {}) {
  const heading =
    opts.heading || `Life Near ${COMMUNITY.shortName}`;
  const compact = Boolean(opts.compact);
  const showFullLink = opts.showFullLink !== false;
  const useH1 = Boolean(opts.useH1);
  const headingTag = useH1 ? 'h1' : 'h2';
  const configJson = JSON.stringify(clientConfig()).replace(/</g, '\\u003c');

  return `
        <!-- AMENITY_MAP_SECTION_BEGIN -->
        <section class="amenity-map-section" aria-labelledby="amenity-map-section-title">
            <div class="container">
                <${headingTag} id="amenity-map-section-title">${escapeHtml(heading)}</${headingTag}>
                <p class="amenity-map-section__lead">Explore dining, parks, grocery, healthcare, and daily conveniences around the ${escapeHtml(COMMUNITY.name)} in northwest Las Vegas—beyond the <a href="https://www.rtcsnv.com/projects/215-beltway/" target="_blank" rel="noopener noreferrer">215 Beltway</a> near <a href="https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon" target="_blank" rel="noopener noreferrer">Red Rock Canyon</a>.</p>
                <div class="amenity-map-widget" data-amenity-map data-compact="${compact ? 'true' : 'false'}">
                    <script type="application/json" class="amenity-map-config">${configJson}</script>
                    <div class="amenity-map-widget__filters" role="tablist" aria-label="Filter nearby places by category"></div>
                    <div class="amenity-map-widget__layout">
                        <div class="amenity-map-widget__map-wrap">
                            <div class="amenity-map-widget__map" role="application" aria-label="Interactive map of places near ${escapeHtml(COMMUNITY.shortName)}" style="min-height:420px;"></div>
                            <div class="amenity-map-fallback" hidden>
                                <iframe title="Map centered on ${escapeHtml(COMMUNITY.shortName)}, Las Vegas" loading="lazy" referrerpolicy="no-referrer-when-downgrade" width="600" height="420" src="${embedFallbackUrl()}"></iframe>
                            </div>
                        </div>
                        <div class="amenity-map-widget__sidebar">
                            <h3 class="amenity-map-widget__sidebar-title">Featured nearby places</h3>
                            ${staticPlaceListHtml({ compact })}
                            <p class="amenity-map-widget__status" aria-live="polite"></p>
                        </div>
                    </div>
                </div>
                ${showFullLink ? `<p class="amenity-map-section__more"><a href="${PAGE_PATH}">See the full nearby amenities guide for ${escapeHtml(COMMUNITY.shortName)}</a></p>` : ''}
            </div>
        </section>
        <!-- AMENITY_MAP_SECTION_END -->`;
}

function categoryCopySections() {
  return `
        <section class="amenity-copy" aria-labelledby="amenity-dining-title">
            <div class="container">
                <h2 id="amenity-dining-title">Dining &amp; cafes</h2>
                <p>Centennial Hills and the northwest valley corridor along N Durango Dr and Rainbow Blvd include national chains and local spots. Drive times vary by route and time of day—plan roughly 15–25 minutes to many Centennial Hills restaurants from the Skye Summit area (approximate).</p>
            </div>
        </section>
        <section class="amenity-copy" aria-labelledby="amenity-parks-title">
            <div class="container">
                <h2 id="amenity-parks-title">Parks &amp; recreation</h2>
                <p><a href="https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon" target="_blank" rel="noopener noreferrer">Red Rock Canyon National Conservation Area</a> (1000 Scenic Loop Dr) is the signature outdoor destination west of Skye Summit. <a href="https://www.lasvegasnevada.gov/Residents/Parks-Facilities/Floyd-Lamb-Park" target="_blank" rel="noopener noreferrer">Floyd Lamb Park at Tule Springs</a> (9200 Tule Springs Rd) offers ponds, trails, and picnic areas. <a href="https://www.northlasvegasnevada.gov/departments/parks-and-recreation/parks/craig-ranch-regional-park" target="_blank" rel="noopener noreferrer">Craig Ranch Regional Park</a> (628 W Craig Rd, North Las Vegas) is a 170-acre regional park north of the corridor. Gilcrease Nature Sanctuary (8103 Racel St) is a wildlife sanctuary open to visitors by appointment.</p>
            </div>
        </section>
        <section class="amenity-copy" aria-labelledby="amenity-golf-title">
            <div class="container">
                <h2 id="amenity-golf-title">Golf</h2>
                <p>Public courses in the northwest and Summerlin corridor include <a href="https://tpc.com/lasvegas/" target="_blank" rel="noopener noreferrer">TPC Las Vegas</a> (9851 Canyon Run Dr), <a href="https://www.angelpark.com/" target="_blank" rel="noopener noreferrer">Angel Park Golf Club</a> (100 S Rampart Blvd), and <a href="https://www.bearsbestlv.com/" target="_blank" rel="noopener noreferrer">Bear's Best Las Vegas</a> (11111 W Flamingo Rd). Confirm tee times and membership rules directly with each facility.</p>
            </div>
        </section>
        <section class="amenity-copy" aria-labelledby="amenity-health-title">
            <div class="container">
                <h2 id="amenity-health-title">Healthcare</h2>
                <p>Centennial Hills Hospital Medical Center (6900 N Durango Dr) is a full-service hospital in the Centennial Hills area east of the Skye Summit corridor. Urgent care and specialty clinics cluster along Durango and Buffalo Dr. Always confirm network participation with your insurer.</p>
            </div>
        </section>
        <section class="amenity-copy" aria-labelledby="amenity-shopping-title">
            <div class="container">
                <h2 id="amenity-shopping-title">Grocery &amp; shopping</h2>
                <p>Smith's Food and Drug (7130 N Durango Dr) and Albertsons (6971 N Durango Dr) anchor grocery shopping in Centennial Hills. Whole Foods Market at 2475 S Town Center Dr serves the Summerlin side of the valley. Target (7557 N Rainbow Blvd) and other retailers along Durango and Rainbow support everyday errands.</p>
            </div>
        </section>
        <section class="amenity-copy" aria-labelledby="amenity-schools-title">
            <div class="container">
                <h2 id="amenity-schools-title">Schools</h2>
                <p>Skye Summit addresses will fall within <a href="https://www.ccsd.net/" target="_blank" rel="noopener noreferrer">Clark County School District</a> boundaries once street assignments are published. Centennial High School (10200 Centennial Pkwy) serves parts of the northwest valley—verify elementary, middle, and high school assignments with CCSD using the exact lot address. See our <a href="/skye-summit-schools">Skye Summit schools guide</a>.</p>
            </div>
        </section>
        <section class="amenity-copy" aria-labelledby="amenity-commute-title">
            <div class="container">
                <h2 id="amenity-commute-title">Commute &amp; key destinations</h2>
                <p>Skye Summit sits beyond the 215 Beltway in northwest Las Vegas. Approximate drive times (traffic-dependent):</p>
                <ul>
                    <li><strong>Downtown Summerlin</strong> — often 20–35 minutes via Charleston Blvd or the 215 Beltway.</li>
                    <li><strong>Las Vegas Strip</strong> — often 30–45 minutes depending on route and time of day.</li>
                    <li><strong><a href="https://www.harryreidairport.com/" target="_blank" rel="noopener noreferrer">Harry Reid International Airport</a></strong> — often 35–50 minutes via the 215 Beltway and I-15.</li>
                    <li><strong>Centennial Hills Hospital</strong> — often 10–20 minutes east toward Durango Dr.</li>
                </ul>
                <p class="amenity-copy__disclaimer">All commute ranges are approximate—verify with your navigation app at your planned travel time.</p>
            </div>
        </section>`;
}

const PAGE_FAQS = [
  {
    q: 'What grocery stores are near Skye Summit?',
    a: "Smith's Food and Drug at 7130 N Durango Dr and Albertsons at 6971 N Durango Dr in Centennial Hills are common grocery runs for northwest Las Vegas master-plan buyers.",
  },
  {
    q: 'How far is Skye Summit from the Las Vegas Strip?',
    a: 'Skye Summit is in northwest Las Vegas beyond the 215 Beltway; many drivers see roughly 30–45 minutes to the Strip depending on route and traffic (approximate).',
  },
  {
    q: 'Are there hospitals near Skye Summit?',
    a: 'Centennial Hills Hospital Medical Center at 6900 N Durango Dr is a full-service hospital serving the Centennial Hills and northwest valley area.',
  },
  {
    q: 'What outdoor recreation is closest to Skye Summit?',
    a: 'Red Rock Canyon National Conservation Area (1000 Scenic Loop Dr) and Floyd Lamb Park at Tule Springs (9200 Tule Springs Rd) are major outdoor destinations west and east of the corridor.',
  },
  {
    q: 'Where do Skye Summit students go to school?',
    a: 'Assignments depend on the exact street address within Clark County School District boundaries—use CCSD zoning tools once your lot address is known and read our Skye Summit schools guide.',
  },
  {
    q: 'How do I get to Downtown Summerlin from Skye Summit?',
    a: 'Many commuters use Charleston Blvd or the 215 Beltway toward Summerlin; plan roughly 20–35 minutes in typical conditions (approximate).',
  },
  {
    q: 'Is there golf near Skye Summit?',
    a: 'TPC Las Vegas (9851 Canyon Run Dr), Angel Park Golf Club (100 S Rampart Blvd), and Bear\'s Best Las Vegas (11111 W Flamingo Rd) are public courses in the northwest and west valley corridor.',
  },
];

function faqSectionHtml() {
  const items = PAGE_FAQS.map(
    (f) => `
                    <div class="faq-item">
                        <button class="faq-question" aria-expanded="false">
                            <span>${escapeHtml(f.q)}</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="faq-answer">
                            <p>${escapeHtml(f.a)}</p>
                        </div>
                    </div>`
  ).join('');
  return `
        <section class="faq-section" aria-labelledby="amenity-faq-title">
            <div class="container">
                <h2 id="amenity-faq-title">Nearby amenities FAQ</h2>
                <div class="faq-container">${items}
                </div>
            </div>
        </section>`;
}

function trustCtaHtml() {
  return `
        <section class="cta-section amenity-trust" aria-labelledby="amenity-trust-title">
            <div class="container">
                <h2 id="amenity-trust-title">Your Skye Summit buyer's representative</h2>
                <p>${escapeHtml(C.AGENT_NAME)}, ${escapeHtml(C.AGENT_TITLE)} (${escapeHtml(C.LICENSE)}) with ${escapeHtml(C.BROKERAGE)} helps you evaluate location, commute, and builder phases for the ${escapeHtml(COMMUNITY.name)}.</p>
                <div class="cta-buttons">
                    <a href="/contact" class="btn btn-primary btn-large">Book a free appointment</a>
                    <a href="tel:${C.PHONE_TEL}" class="btn btn-secondary btn-large">Call ${escapeHtml(C.PHONE_DISPLAY)}</a>
                    <a href="${C.GBP_URL}" class="btn btn-secondary btn-large" target="_blank" rel="noopener">${escapeHtml(C.LABEL_VIEW_ON_GOOGLE)}</a>
                </div>
                <p class="cta-note">${escapeHtml(C.STREET)}, ${escapeHtml(C.CITY)}, ${escapeHtml(C.REGION)} ${escapeHtml(C.POSTAL)} · <a href="mailto:${C.EMAIL}">${escapeHtml(C.EMAIL)}</a></p>
            </div>
        </section>`;
}

function itemListSchemaJson() {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${C.SITE}${PAGE_PATH}#amenity-itemlist`,
      name: `Places near ${COMMUNITY.shortName}, Las Vegas`,
      itemListElement: FEATURED_PLACES.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': p.schemaType,
          name: p.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: p.streetAddress,
            addressLocality: p.locality,
            addressRegion: p.region,
            postalCode: p.postalCode,
            addressCountry: 'US',
          },
        },
      })),
    },
    null,
    2
  );
}

function faqSchemaJson() {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${C.SITE}${PAGE_PATH}#amenity-faq`,
      mainEntity: PAGE_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    null,
    2
  );
}

function placeSchemaJson() {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Place',
      '@id': `${C.SITE}${PAGE_PATH}#skye-summit-place`,
      name: COMMUNITY.name,
      alternateName: COMMUNITY.shortName,
      description: `${COMMUNITY.name} — Olympia Companies master-planned community in northwest Las Vegas; KB Home Vertice sales expected early 2027 with first homes targeted for spring 2027 per builder and press reports.`,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: COMMUNITY.lat,
        longitude: COMMUNITY.lng,
      },
      containedInPlace: {
        '@type': 'City',
        name: COMMUNITY.city,
        addressRegion: COMMUNITY.region,
      },
    },
    null,
    2
  );
}

function agentAreaSchemaJson() {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': IDS.agent,
      areaServed: [
        { '@id': IDS.masterPlan },
        {
          '@type': 'Place',
          name: COMMUNITY.name,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: COMMUNITY.lat,
            longitude: COMMUNITY.lng,
          },
        },
      ],
    },
    null,
    2
  );
}

module.exports = {
  amenityMapSectionHtml,
  categoryCopySections,
  faqSectionHtml,
  trustCtaHtml,
  staticPlaceListHtml,
  PAGE_FAQS,
  itemListSchemaJson,
  faqSchemaJson,
  placeSchemaJson,
  agentAreaSchemaJson,
  escapeHtml,
};
