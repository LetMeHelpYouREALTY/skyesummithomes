'use strict';

const C = require('./gbp-constants');

const SITE = C.SITE;

/** Verified image paths (files must exist under /images) */
const PATHS = {
  HERO: '/images/hero/sunset-home.jpg',
  COMMUNITY: '/images/hero/master-plan-aerial.jpg',
  SELL: '/images/hero/sell-home.jpg',
  VALUATION: '/images/hero/valuation-home.jpg',
  RELOCATION: '/images/hero/relocation.jpg',
  AGENT: '/images/hero/dr-jan-portrait.jpg',
  NEW_CONSTRUCTION: '/images/hero/hero-new-construction.jpg',
  RED_ROCK: '/images/hero/red-rock-vista.jpg',
  OFFICE: '/images/hero/office-consult.jpg',
  SCHOOLS: '/images/hero/schools-campus.jpg',
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

/** Root HTML filename → OG/Twitter image path (Discover: ≥1200px) */
const PAGE_OG = {
  'index.html': PATHS.HERO,
  'sell.html': PATHS.SELL,
  'valuation.html': PATHS.VALUATION,
  'relocate.html': PATHS.RELOCATION,
  'community.html': '/images/hero/hero-community-lifestyle.jpg',
  'buy.html': '/images/hero/hero-buy-skye-summit.jpg',
  'invest.html': PATHS.HERO,
  'homes-for-sale-skye-summit.html': '/images/hero/hero-homes-for-sale.jpg',
  'new-construction-skye-summit.html': '/images/hero/hero-new-construction.jpg',
  'contact.html': '/images/hero/hero-contact-consult.jpg',
  'about.html': PATHS.AGENT,
  'office-location.html': '/images/hero/hero-office-southern-highlands.jpg',
  'skye-summit-schools.html': '/images/hero/hero-schools-campus-unique.jpg',
  'living-in-skye-summit.html': '/images/hero/hero-living-trails.jpg',
  'skye-summit-faq.html': '/images/hero/hero-faq-red-rock.jpg',
  'blog.html': '/images/hero/hero-blog-market.jpg',
  'skye-summit-realtor.html': '/images/hero/hero-realtor-consult.jpg',
};

module.exports = {
  PATHS,
  url,
  HOME_GALLERY,
  GALLERY_DISCLAIMER,
  PAGE_OG,
};
