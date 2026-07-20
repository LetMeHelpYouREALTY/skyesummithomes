'use strict';

/**
 * Per-page hero image registry — SEO / GEO / AEO / ImageObject metadata.
 * Images are ≥1200px wide (Discover guidance) and live under /images/hero/.
 */
const C = require('./gbp-constants');

const HERO_DIR = '/images/hero';

/** Shared ImageObject location (Skye Summit / office geo) */
const CONTENT_LOCATION = {
  '@type': 'Place',
  name: 'Skye Summit Master Plan, Las Vegas, NV',
  address: {
    '@type': 'PostalAddress',
    addressLocality: C.CITY,
    addressRegion: C.REGION,
    postalCode: C.POSTAL,
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: C.GEO_LAT,
    longitude: C.GEO_LNG,
  },
};

/**
 * @typedef {object} HeroSpec
 * @property {string} src
 * @property {string} alt — SEO + GEO keywords, location/service in alt
 * @property {string} caption — visible/AEO caption
 * @property {string} name — ImageObject name
 * @property {string} description — longer GEO/AEO description
 * @property {string} [width]
 * @property {string} [height]
 */

/** @type {Record<string, HeroSpec>} */
const HERO_BY_FILE = {
  'index.html': {
    src: `${HERO_DIR}/sunset-home.jpg`,
    alt: 'Modern desert contemporary home at sunset near Red Rock Canyon in the Skye Summit Master Plan, northwest Las Vegas',
    caption: 'Skye Summit Master Plan — desert contemporary homes near Red Rock Canyon',
    name: 'Skye Summit Homes Las Vegas sunset hero',
    description:
      'Illustrative northwest Las Vegas desert home at golden hour representing buyer opportunities in Olympia Companies’ 505-acre Skye Summit Master Plan near Red Rock Canyon.',
  },
  'buy.html': {
    src: `${HERO_DIR}/new-construction.jpg`,
    alt: 'New construction desert home for sale in Skye Summit Master Plan, northwest Las Vegas buyer representation',
    caption: 'Buy in Skye Summit — new construction buyer representation',
    name: 'Buy Skye Summit Homes Las Vegas',
    description:
      'Single-story desert contemporary new construction style home for Skye Summit buyers working with Dr. Jan Duffy, REALTOR®.',
  },
  'sell.html': {
    src: `${HERO_DIR}/sell-home.jpg`,
    alt: 'Desert contemporary home ready for sale in northwest Las Vegas near Skye Summit with twilight curb appeal',
    caption: 'Sell with Skye Summit market expertise',
    name: 'Sell Your Home Skye Summit Las Vegas',
    description:
      'Twilight exterior of a modern Las Vegas desert home illustrating seller marketing for the Skye Summit and northwest valley corridor.',
  },
  'valuation.html': {
    src: `${HERO_DIR}/valuation-home.jpg`,
    alt: 'Las Vegas desert home exterior for free professional valuation by Dr. Jan Duffy Skye Summit REALTOR',
    caption: 'Free Skye Summit home valuation',
    name: 'Skye Summit Home Valuation',
    description:
      'Home exterior used for Skye Summit / northwest Las Vegas valuation consultations with Dr. Jan Duffy.',
  },
  'relocate.html': {
    src: `${HERO_DIR}/relocation.jpg`,
    alt: 'Relocating to northwest Las Vegas and Skye Summit Master Plan near Red Rock Canyon',
    caption: 'Relocate to Skye Summit & northwest Las Vegas',
    name: 'Relocate to Skye Summit Las Vegas',
    description:
      'Lifestyle imagery for buyers relocating to the Skye Summit Master Plan and northwest Las Vegas markets.',
  },
  'invest.html': {
    src: `${HERO_DIR}/property-twilight.jpg`,
    alt: 'Twilight luxury new construction investment home in northwest Las Vegas Skye Summit corridor',
    caption: 'Invest in northwest Las Vegas new construction',
    name: 'Skye Summit Investment Homes',
    description:
      'Elevated twilight home representing long-term new-construction investment interest near Skye Summit.',
  },
  'community.html': {
    src: `${HERO_DIR}/master-plan-aerial.jpg`,
    alt: 'Aerial view of master-planned community homes and park at the base of Las Vegas desert mountains near Skye Summit',
    caption: 'Skye Summit community living near Red Rock Canyon',
    name: 'Skye Summit Community Aerial',
    description:
      'Aerial of a desert master-planned neighborhood with mountain backdrop representing Skye Summit community lifestyle.',
  },
  'contact.html': {
    src: `${HERO_DIR}/office-consult.jpg`,
    alt: 'Berkshire Hathaway Southern Highlands office consultation setting for Skye Summit REALTOR Dr. Jan Duffy Las Vegas',
    caption: 'Book a Skye Summit buyer appointment',
    name: 'Contact Dr. Jan Duffy Skye Summit',
    description:
      'Bright consultation space representing appointments with Dr. Jan Duffy at the Southern Highlands (89141) office.',
  },
  'about.html': {
    src: `${HERO_DIR}/dr-jan-portrait.jpg`,
    alt: 'Dr. Jan Duffy REALTOR brand portrait for Skye Summit Homes Las Vegas buyer representation',
    caption: 'Dr. Jan Duffy — Skye Summit REALTOR®',
    name: 'About Dr. Jan Duffy',
    description:
      'Brand portrait of Dr. Jan Duffy, REALTOR® (S.0197614.LLC), Skye Summit Homes buyer’s representative.',
  },
  'office-location.html': {
    src: `${HERO_DIR}/office-consult.jpg`,
    alt: 'Office location for Dr. Jan Duffy at 11411 Southern Highlands Pkwy Las Vegas NV 89141',
    caption: 'Southern Highlands office — map & directions',
    name: 'Skye Summit Homes Office Location',
    description:
      'Office consultation setting for Berkshire Hathaway HomeServices Nevada Properties, Southern Highlands, Las Vegas 89141.',
  },
  'homes-for-sale-skye-summit.html': {
    src: `${HERO_DIR}/property-two-story.jpg`,
    alt: 'Two-story desert contemporary home representing Skye Summit homes for sale in northwest Las Vegas',
    caption: 'Skye Summit homes for sale',
    name: 'Homes for Sale Skye Summit',
    description:
      'Illustrative two-story desert home for Skye Summit MLS / RealScout listing search pages.',
  },
  'new-construction-skye-summit.html': {
    src: `${HERO_DIR}/new-construction.jpg`,
    alt: 'New construction desert home in Skye Summit Master Plan northwest Las Vegas Fall 2027',
    caption: 'Skye Summit new construction guide',
    name: 'New Construction Skye Summit',
    description:
      'Desert contemporary new construction representing KB Home Vertice and Woodside Homes planned for Skye Summit.',
  },
  'skye-summit-master-plan.html': {
    src: `${HERO_DIR}/master-plan-aerial.jpg`,
    alt: '505-acre Skye Summit Master Plan aerial style community near Red Rock Canyon Las Vegas',
    caption: 'Olympia Companies Skye Summit Master Plan',
    name: 'Skye Summit Master Plan Hub',
    description:
      'Master-planned community aerial representing Olympia Companies’ 505-acre Skye Summit Master Plan.',
  },
  'skye-summit-interest-list.html': {
    src: `${HERO_DIR}/sunset-home.jpg`,
    alt: 'Join the Skye Summit Master Plan interest list for KB Home Vertice and builder updates Las Vegas',
    caption: 'Skye Summit interest list',
    name: 'Skye Summit Interest List',
    description:
      'Sunset home hero for early-interest list signups for Skye Summit builder releases.',
  },
  'kb-home-vertice-skye-summit.html': {
    src: `${HERO_DIR}/property-single-story.jpg`,
    alt: 'KB Home Vertice at Skye Summit single-story desert new construction style northwest Las Vegas',
    caption: 'KB Home Vertice at Skye Summit',
    name: 'KB Home Vertice Skye Summit',
    description:
      'Single-story desert home style representing KB Home Vertice’s planned 299 homesites at Skye Summit.',
  },
  'olympia-companies-skye-summit.html': {
    src: `${HERO_DIR}/community-aerial.jpg`,
    alt: 'Olympia Companies Skye Summit master-planned community aerial northwest Las Vegas',
    caption: 'Olympia Companies at Skye Summit',
    name: 'Olympia Companies Skye Summit',
    description:
      'Community aerial for Olympia Companies’ role as Skye Summit Master Plan developer.',
  },
  'woodside-homes-skye-summit.html': {
    src: `${HERO_DIR}/property-two-story.jpg`,
    alt: 'Woodside Homes planned new construction style at Skye Summit Master Plan Las Vegas',
    caption: 'Woodside Homes at Skye Summit',
    name: 'Woodside Homes Skye Summit',
    description:
      'Two-story desert contemporary style representing Woodside Homes planned for Skye Summit.',
  },
  'skye-summit-timeline.html': {
    src: `${HERO_DIR}/sunset-home.jpg`,
    alt: 'Skye Summit Master Plan Fall 2027 timeline desert home northwest Las Vegas',
    caption: 'Skye Summit timeline — Fall 2027',
    name: 'Skye Summit Timeline',
    description: 'Sunset home hero for Skye Summit launch timeline and builder milestones.',
  },
  'skye-summit-realtor.html': {
    src: `${HERO_DIR}/dr-jan-portrait.jpg`,
    alt: 'Skye Summit REALTOR Dr. Jan Duffy buyer representation Las Vegas',
    caption: 'Your Skye Summit REALTOR®',
    name: 'Skye Summit REALTOR',
    description:
      'Dr. Jan Duffy brand portrait for Skye Summit buyer representation pages.',
  },
  'skye-summit-faq.html': {
    src: `${HERO_DIR}/red-rock-vista.jpg`,
    alt: 'Red Rock Canyon vista near Skye Summit Master Plan FAQ northwest Las Vegas',
    caption: 'Skye Summit FAQ — local answers',
    name: 'Skye Summit FAQ',
    description: 'Red Rock Canyon vista framing frequently asked questions about Skye Summit.',
  },
  'skye-summit-home-prices.html': {
    src: `${HERO_DIR}/valuation-home.jpg`,
    alt: 'Skye Summit home prices and market guide northwest Las Vegas desert home',
    caption: 'Skye Summit home prices',
    name: 'Skye Summit Home Prices',
    description: 'Desert home hero for Skye Summit pricing and market context.',
  },
  'skye-summit-first-time-buyer.html': {
    src: `${HERO_DIR}/property-single-story.jpg`,
    alt: 'First-time buyer guide for Skye Summit new construction northwest Las Vegas',
    caption: 'First-time buyers at Skye Summit',
    name: 'Skye Summit First-Time Buyer',
    description: 'Approachable single-story desert home for first-time Skye Summit buyers.',
  },
  'living-in-skye-summit.html': {
    src: `${HERO_DIR}/red-rock-vista.jpg`,
    alt: 'Living near Red Rock Canyon in Skye Summit Master Plan northwest Las Vegas lifestyle',
    caption: 'Living in Skye Summit',
    name: 'Living in Skye Summit',
    description: 'Red Rock Canyon vista for Skye Summit lifestyle and living guide.',
  },
  'skye-summit-hoa.html': {
    src: `${HERO_DIR}/community-aerial.jpg`,
    alt: 'Skye Summit HOA and master-planned community amenities northwest Las Vegas',
    caption: 'Skye Summit HOA guide',
    name: 'Skye Summit HOA',
    description: 'Community aerial for Skye Summit HOA and amenities overview.',
  },
  'skye-summit-schools.html': {
    src: `${HERO_DIR}/schools-campus.jpg`,
    alt: 'School campus near Skye Summit and Centennial Hills northwest Las Vegas education options',
    caption: 'Schools near Skye Summit',
    name: 'Skye Summit Schools',
    description:
      'Campus exterior representing school options near Skye Summit and Centennial Hills (school names and commute facts on page).',
  },
  'skye-summit-vs-summerlin.html': {
    src: `${HERO_DIR}/red-rock-vista.jpg`,
    alt: 'Skye Summit vs Summerlin comparison Red Rock Canyon desert mountains Las Vegas',
    caption: 'Skye Summit vs Summerlin',
    name: 'Skye Summit vs Summerlin',
    description: 'Desert mountain vista for comparing Skye Summit and Summerlin corridors.',
  },
  'northwest-las-vegas-real-estate.html': {
    src: `${HERO_DIR}/community-aerial.jpg`,
    alt: 'Northwest Las Vegas real estate aerial near Centennial Hills and Skye Summit',
    caption: 'Northwest Las Vegas real estate',
    name: 'Northwest Las Vegas Real Estate',
    description: 'Aerial neighborhood view for northwest Las Vegas market pages.',
  },
  'centennial-hills-real-estate.html': {
    src: `${HERO_DIR}/master-plan-aerial.jpg`,
    alt: 'Centennial Hills real estate near Skye Summit Master Plan Las Vegas mountains',
    caption: 'Centennial Hills real estate',
    name: 'Centennial Hills Real Estate',
    description: 'Master-plan aerial for Centennial Hills / Skye Summit adjacency pages.',
  },
  'blog.html': {
    src: `${HERO_DIR}/sunset-home.jpg`,
    alt: 'Skye Summit Las Vegas real estate blog desert home sunset',
    caption: 'Skye Summit Homes blog',
    name: 'Skye Summit Blog',
    description: 'Sunset home hero for Skye Summit market and community articles.',
  },
  'privacy.html': {
    src: `${HERO_DIR}/office-consult.jpg`,
    alt: 'Privacy policy for Skye Summit Homes by Dr. Jan Duffy Las Vegas',
    caption: 'Privacy policy',
    name: 'Privacy Policy',
    description: 'Office imagery for Skye Summit Homes privacy policy page.',
  },
  'terms.html': {
    src: `${HERO_DIR}/office-consult.jpg`,
    alt: 'Terms of use for Skye Summit Homes Las Vegas website',
    caption: 'Terms of use',
    name: 'Terms of Use',
    description: 'Office imagery for Skye Summit Homes terms of use page.',
  },
  'mls-disclaimer.html': {
    src: `${HERO_DIR}/property-two-story.jpg`,
    alt: 'MLS listing data notice for Skye Summit Homes Las Vegas',
    caption: 'MLS listing data notice',
    name: 'MLS Disclaimer',
    description: 'Home imagery for MLS attribution and listing data notice.',
  },
  'search/index.html': {
    src: `${HERO_DIR}/community-aerial.jpg`,
    alt: 'Search Las Vegas Valley homes by zip code near Skye Summit',
    caption: 'Search by zip code',
    name: 'Las Vegas Zip Search Hub',
    description: 'Community aerial for the Las Vegas Valley zip-code search hub.',
  },
  'las-vegas-zip-code-map/index.html': {
    src: `${HERO_DIR}/community-aerial.jpg`,
    alt: 'Interactive Las Vegas Valley zip code map for Skye Summit and northwest neighborhoods',
    caption: 'Las Vegas Valley zip code map',
    name: 'Las Vegas Zip Code Map',
    description: 'Aerial context image for the interactive Las Vegas zip code map tool.',
  },
};

function heroForFile(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  if (HERO_BY_FILE[normalized]) return HERO_BY_FILE[normalized];
  const base = normalized.split('/').pop();
  if (base && HERO_BY_FILE[base]) return HERO_BY_FILE[base];
  // nested /slug/index.html → slug.html
  const parts = normalized.split('/');
  if (parts.length >= 2 && parts[parts.length - 1] === 'index.html') {
    const slugHtml = `${parts[parts.length - 2]}.html`;
    if (HERO_BY_FILE[slugHtml]) return HERO_BY_FILE[slugHtml];
  }
  return HERO_BY_FILE['community.html'];
}

function absoluteUrl(src) {
  if (src.startsWith('http')) return src;
  return `${C.SITE}${src}`;
}

function imageObjectJsonLd(hero) {
  const contentUrl = absoluteUrl(hero.src);
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${contentUrl}#hero`,
    contentUrl,
    url: contentUrl,
    name: hero.name,
    caption: hero.caption,
    description: hero.description,
    width: hero.width || '1600',
    height: hero.height || '900',
    encodingFormat: 'image/jpeg',
    creditText: `${C.AGENT_NAME} / Skye Summit Homes`,
    copyrightNotice: `© ${new Date().getFullYear()} ${C.AGENT_NAME}, ${C.BROKERAGE}`,
    creator: {
      '@type': 'RealEstateAgent',
      name: C.AGENT_NAME,
      url: C.SITE,
    },
    contentLocation: CONTENT_LOCATION,
    representativeOfPage: true,
  };
}

module.exports = {
  HERO_DIR,
  HERO_BY_FILE,
  CONTENT_LOCATION,
  heroForFile,
  absoluteUrl,
  imageObjectJsonLd,
};
