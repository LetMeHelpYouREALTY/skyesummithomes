'use strict';

const C = require('./gbp-constants');

const SITE = C.SITE;

/** Verified image paths (files must exist under /images) */
const PATHS = {
  HERO: '/images/skye-summit-hero.jpg',
  COMMUNITY: '/images/skye-summit-community.jpg',
  SELL: '/images/skye-summit-sell.jpg',
  VALUATION: '/images/skye-summit-valuation.jpg',
  RELOCATION: '/images/skye-summit-relocation.jpg',
  AGENT: '/images/agents/dr-jan-duffy.jpg',
};

function url(path) {
  return `${SITE}${path}`;
}

/** Illustrative new-construction gallery — not active MLS listings */
const HOME_GALLERY = [
  {
    src: '/images/property/property-new-construction-1.jpg',
    alt: 'Illustrative two-story new construction home in northwest Las Vegas desert contemporary style',
    caption: 'Two-story desert contemporary',
  },
  {
    src: '/images/property/property-new-construction-2.jpg',
    alt: 'Illustrative single-story new construction home with desert landscaping in Las Vegas',
    caption: 'Single-story modern layout',
  },
  {
    src: '/images/property/property-new-construction-3.jpg',
    alt: 'Illustrative luxury new construction home at twilight in the Las Vegas valley',
    caption: 'Elevated northwest valley style',
  },
];

const GALLERY_DISCLAIMER =
  'Illustrative new construction styles for the Skye Summit Master Plan corridor—not a specific active listing. Join the interest list for builder releases coming Fall 2027.';

/** Root HTML filename → OG/Twitter image path */
const PAGE_OG = {
  'index.html': PATHS.HERO,
  'sell.html': PATHS.SELL,
  'valuation.html': PATHS.VALUATION,
  'relocate.html': PATHS.RELOCATION,
  'community.html': PATHS.COMMUNITY,
  'buy.html': PATHS.COMMUNITY,
  'invest.html': PATHS.COMMUNITY,
  'homes-for-sale-skye-summit.html': PATHS.COMMUNITY,
  'new-construction-skye-summit.html': PATHS.HERO,
  'contact.html': PATHS.AGENT,
  'about.html': PATHS.AGENT,
  'office-location.html': PATHS.AGENT,
};

module.exports = {
  PATHS,
  url,
  HOME_GALLERY,
  GALLERY_DISCLAIMER,
  PAGE_OG,
};
