'use strict';

const C = require('./gbp-constants');

const SITE = C.SITE;

/** Verified image paths (files must exist under /images) */
const PATHS = {
  HERO: '/images/skye-summit-hero.jpg',
  COMMUNITY: '/images/skye-summit-community.jpg',
  RED_ROCK: '/images/skye-summit-red-rock.jpg',
  SELL: '/images/skye-summit-sell.jpg',
  VALUATION: '/images/skye-summit-valuation.jpg',
  RELOCATION: '/images/skye-summit-relocation.jpg',
  AGENT: '/images/agents/dr-jan-duffy.jpg',
};

function url(path) {
  return `${SITE}${path}`;
}

/** Hyperlocal gallery — northwest valley / Red Rock corridor (illustrative, not MLS) */
const HOME_GALLERY = [
  {
    src: PATHS.COMMUNITY,
    alt: 'Aerial view of northwest Las Vegas desert homes with mountain backdrop near the Skye Summit Master Plan corridor',
    caption: 'Northwest valley homesites & mountain views',
  },
  {
    src: PATHS.RED_ROCK,
    alt: 'Red Rock Canyon National Conservation Area sandstone formations beside northwest Las Vegas — the natural edge of Skye Summit',
    caption: 'Red Rock Canyon at the community edge',
  },
  {
    src: '/images/property/property-desert-contemporary-twilight.jpg',
    alt: 'Illustrative desert contemporary new construction home at twilight in the Las Vegas valley',
    caption: 'Desert contemporary new-construction style',
  },
];

const GALLERY_DISCLAIMER =
  'Hyperlocal imagery for the Skye Summit Master Plan corridor beside Red Rock Canyon—illustrative community context, not a specific active MLS listing. Join the interest list for builder releases coming Fall 2027.';

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
