'use strict';

/**
 * H2 / H3 visual registry — unique photos matching section headings.
 * Files live under /images/sections and /images/features (git backup).
 */

const SECTION_DIR = '/images/sections';
const FEATURE_DIR = '/images/features';
const HERO_DIR = '/images/hero';

/** @typedef {{ src: string, alt: string, caption: string }} VisualSpec */

/** Heading regex → visual (first match wins). More specific patterns first. */
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
    test: /common questions|frequently asked|questions about this page|questions about/i,
    src: `${SECTION_DIR}/section-faq.jpg`,
    alt: 'Red Rock Canyon overlook near Skye Summit answering frequently asked questions',
    caption: 'Skye Summit FAQ — local answers',
  },
  {
    test: /why i chose/i,
    src: `${SECTION_DIR}/section-community-welcome.jpg`,
    alt: 'Desert master-planned neighborhood representing why Dr. Jan Duffy focuses on Skye Summit Las Vegas',
    caption: 'Why Skye Summit is the focus',
  },
  {
    test: /credentials/i,
    src: `${SECTION_DIR}/section-credentials.jpg`,
    alt: 'Nevada real estate license credentials for Dr. Jan Duffy, Skye Summit REALTOR in Las Vegas',
    caption: 'Licensed Nevada REALTOR® — S.0197614.LLC',
  },
  {
    test: /my approach/i,
    src: `${SECTION_DIR}/section-testimonials.jpg`,
    alt: 'Consultation desk for a data-driven Skye Summit buyer representation approach in Las Vegas',
    caption: 'A clear, data-first Skye Summit process',
  },
  {
    test: /clients say|success stories|what skye summit/i,
    src: `${SECTION_DIR}/section-testimonials.jpg`,
    alt: 'Las Vegas real estate consultation setting for Skye Summit client feedback',
    caption: 'Skye Summit buyer and seller results',
  },
  {
    test: /let'?s (work|analyze|plan|discuss)|ready to find|ready to experience|ready to see|personalized skye summit guidance|prefer to talk/i,
    src: `${SECTION_DIR}/section-guidance-cta.jpg`,
    alt: 'Book a Skye Summit Homes consultation with Dr. Jan Duffy in Las Vegas',
    caption: 'Get personalized Skye Summit guidance',
  },
  {
    test: /welcome to skye summit/i,
    src: `${SECTION_DIR}/section-community-welcome.jpg`,
    alt: 'Welcome view of a northwest Las Vegas desert master-planned community like Skye Summit',
    caption: 'Welcome to the Skye Summit Master Plan',
  },
  {
    test: /daily life|who lives/i,
    src: `${SECTION_DIR}/section-daily-life.jpg`,
    alt: 'Walking trail and pocket park in a northwest Las Vegas desert neighborhood near Skye Summit',
    caption: 'Daily life near Red Rock Canyon',
  },
  {
    test: /lighting and entries|safety & security/i,
    src: `${SECTION_DIR}/section-community-entries.jpg`,
    alt: 'Lighted landscaped community entry in a northwest Las Vegas master-planned neighborhood',
    caption: 'Community lighting and entries',
  },
  {
    test: /nearby attractions/i,
    src: `${SECTION_DIR}/section-nearby-attractions.jpg`,
    alt: 'Red Rock Canyon sandstone cliffs near Skye Summit Master Plan northwest Las Vegas',
    caption: 'Red Rock Canyon and nearby northwest Las Vegas destinations',
  },
  {
    test: /financing|pre-approval/i,
    src: `${SECTION_DIR}/section-financing.jpg`,
    alt: 'Mortgage pre-approval paperwork for buying new construction in Skye Summit Las Vegas',
    caption: 'Financing and pre-approval for Skye Summit buyers',
  },
  {
    test: /office hours|connect with me|schedule your|book a showing/i,
    src: `${SECTION_DIR}/section-office-hours.jpg`,
    alt: 'Southern Highlands Las Vegas office hours for Skye Summit Homes by Dr. Jan Duffy',
    caption: 'Office hours — Sun–Sat 8:00 AM–8:00 PM',
  },
  {
    test: /address|gps/i,
    src: `${SECTION_DIR}/section-google-maps-office.jpg`,
    alt: '11411 Southern Highlands Pkwy Las Vegas NV 89141 office matching the Google Maps pin',
    caption: 'Office address and GPS — same NAP as Google',
  },
  {
    test: /service area/i,
    src: `${HERO_DIR}/hero-zip-map.jpg`,
    alt: 'Las Vegas Valley service area for Skye Summit Homes buyer representation',
    caption: 'Northwest Las Vegas and Skye Summit service area',
  },
  {
    test: /numbers that matter/i,
    src: `${SECTION_DIR}/section-investment.jpg`,
    alt: 'Twilight desert home representing northwest Las Vegas new-construction investment metrics',
    caption: 'Investment numbers for northwest Las Vegas new construction',
  },
  {
    test: /find your perfect neighborhood|buyer paths/i,
    src: `${HERO_DIR}/hero-zip-map.jpg`,
    alt: 'Las Vegas Valley neighborhoods for Skye Summit and northwest home search',
    caption: 'Find your northwest Las Vegas neighborhood',
  },
  {
    test: /view available homes|skye summit listings/i,
    src: `${HERO_DIR}/hero-homes-for-sale.jpg`,
    alt: 'Skye Summit homes for sale and tourable listings northwest Las Vegas',
    caption: 'View available homes near Skye Summit',
  },
  {
    test: /why join before launch/i,
    src: `${HERO_DIR}/hero-interest-list.jpg`,
    alt: 'Join the Skye Summit interest list before Fall 2027 builder launch',
    caption: 'Why join the Skye Summit interest list',
  },
  {
    test: /working with dr\. jan|why work with dr\. jan/i,
    src: `${HERO_DIR}/hero-realtor-consult.jpg`,
    alt: 'Work with Dr. Jan Duffy, Skye Summit REALTOR in Las Vegas',
    caption: 'Working with Dr. Jan Duffy',
  },
  {
    test: /realtor resources|more skye summit resources/i,
    src: `${SECTION_DIR}/section-realtor-resources.jpg`,
    alt: 'Skye Summit realtor resource guides for northwest Las Vegas homebuyers',
    caption: 'Skye Summit realtor resources',
  },
  {
    test: /why buyers choose|why families choose/i,
    src: `${SECTION_DIR}/section-community-welcome.jpg`,
    alt: 'Northwest Las Vegas master-planned homes near Red Rock Canyon that attract Skye Summit buyers',
    caption: 'Why buyers choose Skye Summit',
  },
  {
    test: /school planning checklist/i,
    src: `${HERO_DIR}/hero-schools-campus-unique.jpg`,
    alt: 'Clark County school campus near Skye Summit and Centennial Hills Las Vegas',
    caption: 'School names and commute times near Skye Summit',
  },
  {
    test: /news|market update|blog|days on market|homes sold|stay updated|this week in/i,
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
    test: /\b(sell your|selling process|seller marketing|listing your home|staging|worth more than)\b/i,
    src: `${SECTION_DIR}/section-selling-process.jpg`,
    alt: 'Twilight desert home curb appeal for Skye Summit seller marketing in Las Vegas',
    caption: 'Sell with Skye Summit market expertise',
  },
  {
    test: /\b(buy in|buying in|how to buy|first-time buyer|buyer steps|buyer checklist|who.?s buying|why use dr\. jan to buy)\b/i,
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
    test: /office contact|google reviews|skye summit \| homes by dr\. jan/i,
    src: `${SECTION_DIR}/section-google-maps-office.jpg`,
    alt: 'Southern Highlands Las Vegas office park matching Google Maps pin for Dr. Jan Duffy',
    caption: 'Office, hours, and Google Maps — same NAP as Google',
  },
  {
    test: /new construction|builder|vertice|woodside|compare builders/i,
    src: `${SECTION_DIR}/section-new-construction.jpg`,
    alt: 'Desert contemporary great room representing Skye Summit new construction Las Vegas',
    caption: 'New construction interiors planned for Skye Summit',
  },
  {
    test: /relocat|move to|things to know before moving/i,
    src: `${SECTION_DIR}/section-relocation.jpg`,
    alt: 'Relocation to a northwest Las Vegas desert home near Skye Summit Master Plan',
    caption: 'Relocate to Skye Summit and northwest Las Vegas',
  },
  {
    test: /invest|roi|rental|investment profiles|why investors/i,
    src: `${SECTION_DIR}/section-investment.jpg`,
    alt: 'Twilight desert contemporary home representing northwest Las Vegas new-construction investment',
    caption: 'Invest in northwest Las Vegas new construction',
  },
  {
    test: /living in|lifestyle|trails|outdoors|clubs for active/i,
    src: `${SECTION_DIR}/section-elevated-lifestyle.jpg`,
    alt: 'Desert trails and mountain views for living in Skye Summit Las Vegas',
    caption: 'Living near Red Rock Canyon',
  },
  {
    test: /hoa|amenities|community park|planned community features|questions to ask on tour/i,
    src: `${SECTION_DIR}/section-master-plan-guides.jpg`,
    alt: 'Master-planned community amenities and parks planned for Skye Summit Las Vegas',
    caption: 'Skye Summit HOA and amenities',
  },
  {
    test: /school/i,
    src: `${HERO_DIR}/hero-schools-campus-unique.jpg`,
    alt: 'Clark County public school campus near Skye Summit and Centennial Hills Las Vegas',
    caption: 'School campuses and commute times near Skye Summit',
  },
  {
    test: /timeline overview/i,
    src: `${HERO_DIR}/hero-timeline-2027.jpg`,
    alt: 'Skye Summit Master Plan Fall 2027 timeline earthwork northwest Las Vegas',
    caption: 'Skye Summit build-out timeline',
  },
  {
    test: /side-by-side/i,
    src: `${HERO_DIR}/hero-vs-summerlin.jpg`,
    alt: 'Desert mountain vista for comparing Skye Summit and Summerlin Las Vegas',
    caption: 'Skye Summit vs Summerlin',
  },
  {
    test: /market resources/i,
    src: `${HERO_DIR}/hero-home-prices.jpg`,
    alt: 'Skye Summit home prices and market resources northwest Las Vegas',
    caption: 'Skye Summit market resources',
  },
  {
    test: /personal help in skye|real estate specialist/i,
    src: `${HERO_DIR}/hero-realtor-consult.jpg`,
    alt: 'Dr. Jan Duffy Skye Summit realtor consultation at Berkshire Hathaway Nevada Properties',
    caption: 'Personal Skye Summit REALTOR® help',
  },
  {
    test: /start your northwest/i,
    src: `${HERO_DIR}/hero-northwest-valley.jpg`,
    alt: 'Northwest Las Vegas streetscape for starting a Skye Summit area home search',
    caption: 'Start your northwest Las Vegas search',
  },
  {
    test: /\bhours\b/i,
    src: `${SECTION_DIR}/section-office-hours.jpg`,
    alt: 'Business hours for Skye Summit Homes by Dr. Jan Duffy in Las Vegas',
    caption: 'Hours — Sun–Sat 8:00 AM–8:00 PM',
  },
  {
    test: /zip|search|map/i,
    src: `${HERO_DIR}/hero-zip-map.jpg`,
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
    test: /buying in skye summit/i,
    src: `${FEATURE_DIR}/feature-buy-path.jpg`,
    alt: 'Buy a new-construction home in Skye Summit Master Plan northwest Las Vegas',
    caption: 'Buying in Skye Summit',
  },
  {
    test: /selling your home/i,
    src: `${FEATURE_DIR}/feature-sell-path.jpg`,
    alt: 'Sell a desert contemporary home near Skye Summit Las Vegas',
    caption: 'Selling your home',
  },
  {
    test: /free valuation/i,
    src: `${FEATURE_DIR}/feature-valuation-path.jpg`,
    alt: 'Free professional home valuation for northwest Las Vegas near Skye Summit',
    caption: 'Free valuation',
  },
  {
    test: /las vegas zip map|zip code map/i,
    src: `${FEATURE_DIR}/feature-map-path.jpg`,
    alt: 'Las Vegas Valley zip code map for Skye Summit neighborhood search',
    caption: 'Las Vegas zip map',
  },
  {
    test: /skye summit realtor/i,
    src: `${FEATURE_DIR}/feature-realtor-path.jpg`,
    alt: 'Skye Summit REALTOR consultation path with Dr. Jan Duffy Las Vegas',
    caption: 'Skye Summit REALTOR®',
  },
  {
    test: /unmatched views|outdoors|red rock canyon/i,
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
    test: /community & convenience|convenience|parks & trails|parks/i,
    src: `${FEATURE_DIR}/feature-community-parks.jpg`,
    alt: 'Desert community park and walking path in a northwest Las Vegas master plan',
    caption: 'Parks and trails in the master plan',
  },
  {
    test: /master plan hub/i,
    src: `${HERO_DIR}/master-plan-aerial.jpg`,
    alt: 'Skye Summit Master Plan hub aerial northwest Las Vegas',
    caption: 'Master plan hub',
  },
  {
    test: /interest list/i,
    src: `${HERO_DIR}/hero-interest-list.jpg`,
    alt: 'Join the Skye Summit interest list for builder updates Las Vegas',
    caption: 'Interest list',
  },
  {
    test: /kb home vertice/i,
    src: `${HERO_DIR}/hero-kb-vertice.jpg`,
    alt: 'KB Home Vertice at Skye Summit new construction style Las Vegas',
    caption: 'KB Home Vertice',
  },
  {
    test: /fall 2027 timeline/i,
    src: `${HERO_DIR}/hero-timeline-2027.jpg`,
    alt: 'Skye Summit Fall 2027 timeline northwest Las Vegas',
    caption: 'Fall 2027 timeline',
  },
  {
    test: /\bfaq\b/i,
    src: `${HERO_DIR}/hero-faq-red-rock.jpg`,
    alt: 'Skye Summit FAQ Red Rock Canyon Las Vegas',
    caption: 'Skye Summit FAQ',
  },
  {
    test: /^schools$/i,
    src: `${HERO_DIR}/hero-schools-campus-unique.jpg`,
    alt: 'Schools near Skye Summit Las Vegas campus exterior',
    caption: 'Schools near Skye Summit',
  },
  {
    test: /living here/i,
    src: `${HERO_DIR}/hero-living-trails.jpg`,
    alt: 'Living in Skye Summit desert trails northwest Las Vegas',
    caption: 'Living here',
  },
  {
    test: /hoa guide/i,
    src: `${HERO_DIR}/hero-hoa-amenities.jpg`,
    alt: 'Skye Summit HOA amenities northwest Las Vegas',
    caption: 'HOA guide',
  },
  {
    test: /centennial hills/i,
    src: `${HERO_DIR}/hero-centennial-hills.jpg`,
    alt: 'Centennial Hills real estate near Skye Summit Las Vegas',
    caption: 'Centennial Hills',
  },
  {
    test: /home prices/i,
    src: `${HERO_DIR}/hero-home-prices.jpg`,
    alt: 'Skye Summit home prices northwest Las Vegas',
    caption: 'Home prices',
  },
  {
    test: /first-time buyers/i,
    src: `${HERO_DIR}/hero-first-time-buyer.jpg`,
    alt: 'First-time buyer guide for Skye Summit Las Vegas',
    caption: 'First-time buyers',
  },
  {
    test: /vs summerlin/i,
    src: `${HERO_DIR}/hero-vs-summerlin.jpg`,
    alt: 'Skye Summit vs Summerlin comparison Las Vegas',
    caption: 'vs Summerlin',
  },
  {
    test: /northwest las vegas/i,
    src: `${HERO_DIR}/hero-northwest-valley.jpg`,
    alt: 'Northwest Las Vegas real estate near Skye Summit',
    caption: 'Northwest Las Vegas',
  },
  {
    test: /office &|office and map/i,
    src: `${HERO_DIR}/hero-office-southern-highlands.jpg`,
    alt: 'Office and Google Map for Skye Summit Homes Las Vegas',
    caption: 'Office and map',
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
