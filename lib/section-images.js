'use strict';

/**
 * H2 / H3 visual registry — unique photos matching section headings.
 * Files live under /images/sections and /images/features (git backup).
 */

const SECTION_DIR = '/images/sections';
const FEATURE_DIR = '/images/features';

/** @typedef {{ src: string, alt: string, caption: string }} VisualSpec */

/** Heading regex → visual (first match wins). */
const H2_VISUALS = [
  {
    test: /how can i help/i,
    src: `${SECTION_DIR}/section-how-can-i-help.jpg`,
    alt: 'Buyer, seller, valuation, and zip-map paths for Skye Summit Homes in northwest Las Vegas',
    caption: 'Choose a Skye Summit path — buy, sell, valuation, or map',
  },
  {
    test: /elevated lifestyle/i,
    src: `${SECTION_DIR}/section-elevated-lifestyle.jpg`,
    alt: 'Las Vegas valley view from elevated desert ridge near Red Rock Canyon and Skye Summit Master Plan',
    caption: 'Elevated northwest Las Vegas views near Red Rock Canyon',
  },
  {
    test: /master plan guides|master plan at a glance|coming fall 2027/i,
    src: `${SECTION_DIR}/section-master-plan-guides.jpg`,
    alt: 'Aerial of a 505-acre desert master-planned community representing Skye Summit Master Plan Las Vegas',
    caption: 'Skye Summit Master Plan guides — Fall 2027',
  },
  {
    test: /frequently asked|questions about this page|questions about/i,
    src: `${SECTION_DIR}/section-faq.jpg`,
    alt: 'Red Rock Canyon overlook near Skye Summit answering frequently asked questions',
    caption: 'Skye Summit FAQ — local answers',
  },
  {
    test: /news|market update|blog/i,
    src: `${SECTION_DIR}/section-market-news.jpg`,
    alt: 'Skye Summit Las Vegas real estate news and market updates',
    caption: 'Skye Summit market news',
  },
  {
    test: /guide to finding a home|your guide/i,
    src: `${SECTION_DIR}/section-how-can-i-help.jpg`,
    alt: 'Guide to finding a home in Skye Summit Las Vegas with Dr. Jan Duffy',
    caption: 'Your Skye Summit home search guide',
  },
  {
    test: /\b(sell your|selling process|seller marketing|listing your home)\b/i,
    src: `${SECTION_DIR}/section-selling-process.jpg`,
    alt: 'Twilight desert home curb appeal for Skye Summit seller marketing in Las Vegas',
    caption: 'Sell with Skye Summit market expertise',
  },
  {
    test: /\b(buy in|buying in|how to buy|first-time buyer|buyer steps)\b/i,
    src: `${SECTION_DIR}/section-buying-process.jpg`,
    alt: 'New-construction buyer process for Skye Summit Homes Las Vegas',
    caption: 'Skye Summit buyer representation steps',
  },
  {
    test: /valuation|what you.?ll receive|estimate/i,
    src: `${SECTION_DIR}/section-valuation.jpg`,
    alt: 'Professional home valuation visit for a northwest Las Vegas desert home',
    caption: 'Free Skye Summit home valuation',
  },
  {
    test: /office contact|business hours|google reviews|skye summit \| homes by dr\. jan/i,
    src: `${SECTION_DIR}/section-google-maps-office.jpg`,
    alt: 'Southern Highlands Las Vegas office park matching Google Maps pin for Dr. Jan Duffy',
    caption: 'Office, hours, and Google Maps — same NAP as Google',
  },
  {
    test: /new construction|builder|vertice|woodside/i,
    src: `${SECTION_DIR}/section-new-construction.jpg`,
    alt: 'Desert contemporary great room representing Skye Summit new construction Las Vegas',
    caption: 'New construction interiors planned for Skye Summit',
  },
  {
    test: /relocat|move to/i,
    src: `${SECTION_DIR}/section-relocation.jpg`,
    alt: 'Relocation to a northwest Las Vegas desert home near Skye Summit Master Plan',
    caption: 'Relocate to Skye Summit and northwest Las Vegas',
  },
  {
    test: /invest|roi|rental/i,
    src: `${SECTION_DIR}/section-investment.jpg`,
    alt: 'Twilight desert contemporary home representing northwest Las Vegas new-construction investment',
    caption: 'Invest in northwest Las Vegas new construction',
  },
  {
    test: /living in|lifestyle|trails|outdoors/i,
    src: `${SECTION_DIR}/section-elevated-lifestyle.jpg`,
    alt: 'Desert trails and mountain views for living in Skye Summit Las Vegas',
    caption: 'Living near Red Rock Canyon',
  },
  {
    test: /hoa|amenities|community park/i,
    src: `${SECTION_DIR}/section-master-plan-guides.jpg`,
    alt: 'Master-planned community amenities and parks planned for Skye Summit Las Vegas',
    caption: 'Skye Summit HOA and amenities',
  },
  {
    test: /school/i,
    src: '/images/hero/hero-schools-campus-unique.jpg',
    alt: 'Clark County public school campus near Skye Summit and Centennial Hills Las Vegas',
    caption: 'School campuses and commute times near Skye Summit',
  },
  {
    test: /zip|search|map/i,
    src: '/images/hero/hero-zip-map.jpg',
    alt: 'Las Vegas Valley neighborhoods for zip-code search near Skye Summit',
    caption: 'Search Las Vegas Valley by zip code',
  },
  {
    test: /contact|appointment|consultation/i,
    src: `${SECTION_DIR}/section-google-maps-office.jpg`,
    alt: 'Book a Skye Summit appointment at the Southern Highlands Las Vegas office',
    caption: 'Book a Skye Summit consultation',
  },
];

const H3_VISUALS = [
  {
    test: /unmatched views|outdoors|red rock/i,
    src: `${FEATURE_DIR}/feature-red-rock-views.jpg`,
    alt: 'Red Rock Canyon sandstone vista near Skye Summit Master Plan northwest Las Vegas',
    caption: 'Red Rock Canyon views',
  },
  {
    test: /modern homes|new construction/i,
    src: `${FEATURE_DIR}/feature-modern-homes.jpg`,
    alt: 'Modern desert new-construction home style planned for Skye Summit Las Vegas',
    caption: 'Modern desert new construction',
  },
  {
    test: /community & convenience|convenience|parks/i,
    src: `${FEATURE_DIR}/feature-community-parks.jpg`,
    alt: 'Desert community park and walking path in a northwest Las Vegas master plan',
    caption: 'Parks and trails in the master plan',
  },
];

function matchVisual(text, list) {
  const hay = String(text || '').replace(/<[^>]+>/g, ' ').trim();
  for (const item of list) {
    if (item.test.test(hay)) {
      return {
        src: item.src,
        alt: item.alt,
        caption: item.caption,
      };
    }
  }
  return null;
}

function visualForH2(headingText) {
  return matchVisual(headingText, H2_VISUALS);
}

function visualForH3(headingText) {
  return matchVisual(headingText, H3_VISUALS);
}

module.exports = {
  SECTION_DIR,
  FEATURE_DIR,
  H2_VISUALS,
  H3_VISUALS,
  visualForH2,
  visualForH3,
};
