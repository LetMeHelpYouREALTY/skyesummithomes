'use strict';

/**
 * Hyperlocal SEO / GEO / AEO map derived from Parallel deep research
 * (skye-summit-hyperlocal-seo-geo-aeo). Maps actual site filenames → strategy.
 */

const C = require('./gbp-constants');

/** Authoritative entity links — first-mention GEO lever */
const ENTITY_LINKS = [
  {
    name: 'Red Rock Canyon National Conservation Area',
    href: 'https://www.blm.gov/programs/national-conservation-lands/nevada/red-rock-canyon',
    anchors: ['Red Rock Canyon', 'Red Rock Canyon National Conservation Area'],
  },
  {
    name: 'Olympia Companies',
    href: 'https://www.olympiacompanies.com/',
    anchors: ['Olympia Companies'],
  },
  {
    name: 'KB Home',
    href: 'https://www.kbhome.com/',
    anchors: ['KB Home', "KB Home's Vertice", 'KB Home Vertice'],
  },
  {
    name: 'Woodside Homes',
    href: 'https://www.woodsidehomes.com/',
    anchors: ['Woodside Homes'],
  },
  {
    name: 'Skye Canyon',
    href: 'https://www.skyecanyon.com/',
    anchors: ['Skye Canyon'],
  },
  {
    name: 'Centennial Hills',
    href: 'https://en.wikipedia.org/wiki/Centennial_Hills,_Las_Vegas',
    anchors: ['Centennial Hills'],
  },
  {
    name: 'Clark County School District',
    href: 'https://ccsd.net/',
    anchors: ['Clark County School District', 'CCSD'],
  },
  {
    name: 'Harry Reid International Airport',
    href: 'https://www.harryreidairport.com/',
    anchors: ['Harry Reid International Airport'],
  },
  {
    name: 'Greater Las Vegas Association of REALTORS®',
    href: 'https://www.glvar.org/',
    anchors: ['Greater Las Vegas Association of REALTORS®', 'GLVAR'],
  },
];

const FOOTER_QUICK_LINKS = [
  { href: '/skye-summit-master-plan', label: 'Skye Summit Master Plan' },
  { href: '/kb-home-vertice-skye-summit', label: 'KB Home Vertice' },
  { href: '/woodside-homes-skye-summit', label: 'Woodside Homes' },
  { href: '/new-construction-skye-summit', label: 'New Construction' },
  { href: '/skye-summit-schools', label: 'Schools' },
  { href: '/skye-summit-hoa', label: 'HOA' },
  { href: '/skye-summit-home-prices', label: 'Prices' },
  { href: '/skye-summit-timeline', label: 'Timeline' },
  { href: '/skye-summit-vs-summerlin', label: 'vs Summerlin' },
  { href: '/skye-summit-faq', label: 'FAQ' },
  { href: '/skye-summit-realtor', label: 'Buyer Rep' },
  { href: '/contact', label: 'Contact' },
];

const FOOTER_AREA_LINKS = [
  { href: '/centennial-hills-real-estate', label: 'Centennial Hills' },
  { href: '/northwest-las-vegas-real-estate', label: 'Northwest Las Vegas' },
  { href: '/skye-summit-vs-summerlin', label: 'Summerlin comparison' },
  { href: '/community', label: 'Skye Summit community' },
  { href: '/living-in-skye-summit', label: 'Living in Skye Summit' },
];

/** Sitewide AEO answer (40–60 words) — realtor-service focused */
const SITEWIDE_QUICK_ANSWER =
  'Skye Summit is Olympia Companies\' 505-acre master-planned community in northwest Las Vegas beyond the 215 Beltway, planned for about 3,500 homes beside Red Rock Canyon. KB Home\'s Vertice (299 homesites) may open sales early 2027, with Woodside Homes also planned. Dr. Jan Duffy, REALTOR® (S.0197614.LLC), is the buyer\'s representative — call (702) 930-8222.';

/**
 * Per-page SEO / AEO. Keys = root HTML filenames.
 * Titles/metas/H1s adapted to this site's real URL structure (/buy not /skye-summit-buy).
 */
const PAGE_SEO = {
  'index.html': {
    title: `Skye Summit Homes Las Vegas | Dr. Jan Duffy REALTOR® ${C.PHONE_DISPLAY}`,
    description:
      "Buyer's agent for Skye Summit — Olympia Companies' 505-acre master plan beyond the 215 Beltway. KB Home Vertice opens 2027. Call Dr. Jan Duffy, REALTOR®.",
    h1Main: 'Skye Summit Homes',
    h1Sub: 'Las Vegas Master Plan Buyer Representation',
    quickAnswer: SITEWIDE_QUICK_ANSWER,
    related: ['/skye-summit-master-plan', '/buy', '/skye-summit-realtor', '/contact'],
  },
  'buy.html': {
    title: `Buy a Home in Skye Summit | Buyer's Agent | Dr. Jan Duffy`,
    description:
      'Buying in Skye Summit? Independent buyer representation for KB Home Vertice and future villages. Dr. Jan Duffy, REALTOR®. Call (702) 930-8222.',
    h1: 'How to Buy a Home in Skye Summit',
    quickAnswer:
      'To buy in Skye Summit, choose a builder (KB Home Vertice is first), pick a homesite, and sign the builder contract with independent buyer representation. Dr. Jan Duffy reviews every addendum as your Skye Summit buyer\'s agent — typically at no extra cost to you. Call (702) 930-8222.',
    related: [
      '/kb-home-vertice-skye-summit',
      '/woodside-homes-skye-summit',
      '/skye-summit-interest-list',
      '/new-construction-skye-summit',
    ],
  },
  'sell.html': {
    title: `Sell a Home in Skye Summit | Listing Agent | Dr. Jan Duffy`,
    description:
      'Skye Summit corridor listing strategy from Dr. Jan Duffy — CMA guidance, phase timing, and targeted buyer outreach. Call (702) 930-8222.',
    h1: 'Selling a Home Near Skye Summit',
    quickAnswer:
      'List with Dr. Jan Duffy for independent representation, a comparative market analysis within 24 hours, and marketing across MLS, GLVAR syndicates, and Skye Summit / Centennial Hills buyer outreach. Call (702) 930-8222.',
    related: ['/valuation', '/skye-summit-home-prices', '/skye-summit-master-plan', '/contact'],
  },
  'community.html': {
    title: 'Skye Summit Community Guide | Olympia Companies Master Plan | Las Vegas',
    description:
      'Skye Summit community overview: 505 acres, parks, trails, desert-conscious design by Olympia Companies near Red Rock Canyon. Buyer-rep updates from Dr. Jan Duffy.',
    h1: 'Skye Summit Community Guide',
    quickAnswer:
      'Skye Summit is a 505-acre Olympia Companies community in northwest Las Vegas just beyond the 215 Beltway, planned for about 3,500 homes with trails and parks beside Red Rock Canyon. Dr. Jan Duffy provides buyer representation and interest-list updates — (702) 930-8222.',
    related: [
      '/skye-summit-master-plan',
      '/living-in-skye-summit',
      '/skye-summit-hoa',
      '/skye-summit-schools',
    ],
  },
  'skye-summit-master-plan.html': {
    title: 'Skye Summit Master Plan | Olympia Companies 505 Acres | NW Las Vegas',
    description:
      'Inside the Skye Summit master plan: 505 acres, ~3,500 homes, parks, trails, KB Home Vertice, Woodside. NW Las Vegas buyer guide.',
    h1: 'The Skye Summit Master Plan Explained',
    quickAnswer:
      'The Skye Summit master plan is a 505-acre Olympia Companies community in northwest Las Vegas beyond the 215 Beltway, planned for about 3,500 homes. KB Home Vertice opens sales early 2027; Woodside Homes is also planned. Dr. Jan Duffy is the buyer\'s representative — (702) 930-8222.',
    related: [
      '/kb-home-vertice-skye-summit',
      '/woodside-homes-skye-summit',
      '/skye-summit-timeline',
      '/skye-summit-faq',
    ],
  },
  'invest.html': {
    title: 'Skye Summit Investment Property | ROI & Rental Outlook | Las Vegas',
    description:
      'Skye Summit investment analysis — absorption, rent comps, and resale risk in NW Las Vegas\'s newest master plan. From Dr. Jan Duffy, REALTOR®.',
    h1: 'Investing in Skye Summit Real Estate',
    quickAnswer:
      'Skye Summit attracts long-term investors as a new master plan in an employment-rich NW Las Vegas corridor near Red Rock Canyon, with about 3,500 planned homes. Yields vary by floor plan and phase — request a current comp set from Dr. Jan Duffy before underwriting. (702) 930-8222.',
    related: ['/skye-summit-home-prices', '/new-construction-skye-summit', '/buy', '/contact'],
  },
  'relocate.html': {
    title: 'Relocate to Skye Summit, Las Vegas | 2026 Buyer Guide',
    description:
      'Relocating to Skye Summit from out of state? Taxes, schools, commute, and builder-contract steps with a local buyer\'s rep.',
    h1: 'Relocating to Skye Summit',
    quickAnswer:
      'To relocate to Skye Summit, plan a scouting trip, retain a buyer\'s representative before you fly in, check CCSD school options, then underwrite builder contracts with Nevada-specific disclosures. Dr. Jan Duffy coordinates virtual consults and early-access updates — (702) 930-8222.',
    related: ['/skye-summit-schools', '/skye-summit-master-plan', '/buy', '/contact'],
  },
  'valuation.html': {
    title: "What's My Skye Summit Home Worth? | Free Valuation Consult",
    description:
      'Free Skye Summit corridor valuation consult from Dr. Jan Duffy, REALTOR®. Phase and builder context — not portal estimates alone.',
    h1: "What's My Skye Summit Home Worth?",
    quickAnswer:
      'For Skye Summit corridor values, use a REALTOR® CMA that weighs builder phases, lot premiums, and NW Las Vegas comps — not portal AVMs alone. Request a no-obligation consult with Dr. Jan Duffy at (702) 930-8222.',
    related: ['/sell', '/skye-summit-home-prices', '/contact'],
  },
  'contact.html': {
    title: `Contact Dr. Jan Duffy | Skye Summit REALTOR® ${C.PHONE_DISPLAY}`,
    description:
      'Call (702) 930-8222 or email DrJanSells@SkyeSummitHomes.com. Skye Summit buyer\'s agent — interest list, new construction, and consults.',
    h1: 'Contact Your Skye Summit REALTOR®',
    quickAnswer:
      'Contact Dr. Jan Duffy, REALTOR® and Skye Summit buyer\'s representative, at (702) 930-8222 or DrJanSells@SkyeSummitHomes.com. Office: 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141 (Berkshire Hathaway HomeServices Nevada Properties). Hours Sun–Sat 9 AM–6 PM.',
    related: ['/skye-summit-interest-list', '/skye-summit-realtor', '/office-location', '/buy'],
  },
  'about.html': {
    title: 'Dr. Jan Duffy — Skye Summit REALTOR® | Berkshire Hathaway Nevada',
    description:
      'About Dr. Jan Duffy, Skye Summit buyer\'s agent at Berkshire Hathaway HomeServices Nevada Properties. License #S.0197614.LLC.',
    h1: "Dr. Jan Duffy, REALTOR® — Skye Summit Buyer's Representative",
    quickAnswer:
      'Dr. Jan Duffy is a Nevada REALTOR® (license S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties and the buyer\'s representative for the Skye Summit Master Plan. Early-access updates, builder coordination, and new-construction buyer representation — (702) 930-8222.',
    related: ['/skye-summit-realtor', '/contact', '/skye-summit-master-plan', '/office-location'],
  },
  'skye-summit-realtor.html': {
    title: `Skye Summit REALTOR® | Dr. Jan Duffy Buyer Representation | ${C.PHONE_DISPLAY}`,
    description:
      'Skye Summit realtor services: buyer representation, builder coordination, interest-list access, and new-construction contract review. Dr. Jan Duffy, REALTOR®.',
    h1: 'Skye Summit REALTOR® Services',
    quickAnswer:
      'Skye Summit realtor services from Dr. Jan Duffy include independent buyer representation, interest-list coordination, builder-phase briefings, and new-construction contract review for KB Home Vertice and future villages. License S.0197614.LLC — call (702) 930-8222.',
    related: ['/buy', '/new-construction-skye-summit', '/skye-summit-interest-list', '/contact'],
  },
  'skye-summit-faq.html': {
    title: 'Skye Summit FAQ | Timeline, Builders, HOA & Prices | Dr. Jan Duffy',
    description:
      'Skye Summit FAQ: developer, timeline, builders, HOA, schools, prices — answered by your local REALTOR® buyer\'s rep.',
    h1: 'Skye Summit — Frequently Asked Questions',
    quickAnswer: SITEWIDE_QUICK_ANSWER,
    related: [
      '/skye-summit-master-plan',
      '/skye-summit-timeline',
      '/skye-summit-hoa',
      '/skye-summit-schools',
    ],
  },
  'new-construction-skye-summit.html': {
    title: 'New Construction in Skye Summit | Builders & Buyer Representation',
    description:
      'Skye Summit new construction pipeline: KB Home Vertice, Woodside Homes, floor plans, and independent buyer representation.',
    h1: 'New Construction in Skye Summit',
    quickAnswer:
      'New construction in Skye Summit starts with KB Home Vertice (299 homesites; sales may open early 2027) and Woodside Homes planned next. Hire an independent buyer\'s agent before you visit the model — Dr. Jan Duffy represents buyers, not the builder. (702) 930-8222.',
    related: [
      '/kb-home-vertice-skye-summit',
      '/woodside-homes-skye-summit',
      '/skye-summit-interest-list',
      '/buy',
    ],
  },
  'kb-home-vertice-skye-summit.html': {
    title: 'KB Home Vertice at Skye Summit | Plans, Pricing & Buyer Rep',
    description:
      'KB Home Vertice at Skye Summit — 299 homesites, floor plans, pricing windows, and independent buyer representation from Dr. Jan Duffy.',
    h1: 'KB Home Vertice at Skye Summit',
    quickAnswer:
      'Vertice at Skye Summit is KB Home\'s first village in the 505-acre master plan — about 299 homesites with sales expected early 2027 while homesite work is underway. Dr. Jan Duffy provides independent buyer representation. Call (702) 930-8222.',
    related: [
      '/new-construction-skye-summit',
      '/skye-summit-master-plan',
      '/skye-summit-interest-list',
      '/buy',
    ],
  },
  'woodside-homes-skye-summit.html': {
    title: 'Woodside Homes at Skye Summit | Plans & Updates',
    description:
      'Woodside Homes in Skye Summit — planned villages, pricing windows, and phase updates with buyer representation from Dr. Jan Duffy.',
    h1: 'Woodside Homes at Skye Summit',
    quickAnswer:
      'Woodside Homes is planned inside the Skye Summit Master Plan alongside KB Home Vertice. Exact floor plans and release timing update as Olympia Companies phases land. Join Dr. Jan Duffy\'s interest list for buyer-rep updates — (702) 930-8222.',
    related: [
      '/new-construction-skye-summit',
      '/kb-home-vertice-skye-summit',
      '/skye-summit-master-plan',
      '/contact',
    ],
  },
  'skye-summit-schools.html': {
    title: 'Schools Near Skye Summit | CCSD Zoning Guide',
    description:
      'Public, charter, and private school options serving the Skye Summit / Centennial Hills corridor. CCSD zoning explained for buyers.',
    h1: 'Schools Near Skye Summit',
    quickAnswer:
      'Skye Summit buyers should verify Clark County School District zoning for their specific homesite — boundaries can change by phase. Dr. Jan Duffy helps buyers map school options alongside commute and trail access near Red Rock Canyon. Call (702) 930-8222.',
    related: ['/relocate', '/skye-summit-master-plan', '/living-in-skye-summit', '/buy'],
  },
  'skye-summit-hoa.html': {
    title: 'Skye Summit HOA Fees & Community Association',
    description:
      'Skye Summit HOA structure, fees, and amenities — what buyers should expect before signing a builder contract.',
    h1: 'Skye Summit HOA & Community Association',
    quickAnswer:
      'Skye Summit will operate under a master community association with village-level rules as builders deliver. Final HOA fees publish with CC&Rs at sales release. Compare nearby Olympia communities like Skye Canyon for planning ranges, then confirm with Dr. Jan Duffy — (702) 930-8222.',
    related: ['/skye-summit-master-plan', '/skye-summit-home-prices', '/buy', '/skye-summit-faq'],
  },
  'skye-summit-home-prices.html': {
    title: 'Skye Summit Home Prices | Ranges & What to Expect',
    description:
      'Skye Summit price guidance by builder phase plus NW Las Vegas comps. Buyer-rep updates from Dr. Jan Duffy.',
    h1: 'Skye Summit Home Prices',
    quickAnswer:
      'Skye Summit builder pricing is not fully public until sales open (KB Home Vertice targeted early 2027). Use NW Las Vegas new-construction comps and interest-list briefings — not guesses. Dr. Jan Duffy shares phase pricing as released. (702) 930-8222.',
    related: ['/buy', '/invest', '/kb-home-vertice-skye-summit', '/valuation'],
  },
  'skye-summit-timeline.html': {
    title: 'Skye Summit Build-Out Timeline | Phases & Dates',
    description:
      'When Skye Summit opens, phase-by-phase delivery dates, and model-home milestones for buyers.',
    h1: 'Skye Summit Build-Out Timeline',
    quickAnswer:
      'Olympia Companies lists Skye Summit as coming Fall 2027, while KB Home Vertice may begin sales early 2027 during homesite work. Timelines shift with infrastructure — join the interest list with Dr. Jan Duffy for dated updates. (702) 930-8222.',
    related: [
      '/skye-summit-master-plan',
      '/kb-home-vertice-skye-summit',
      '/skye-summit-interest-list',
      '/new-construction-skye-summit',
    ],
  },
  'skye-summit-vs-summerlin.html': {
    title: 'Skye Summit vs Summerlin | Las Vegas Master Plans Compared',
    description:
      'Skye Summit vs Summerlin: developers, builders, prices, amenities, schools, and HOA compared for buyers.',
    h1: 'Skye Summit vs Summerlin',
    quickAnswer:
      'Skye Summit is a new 505-acre Olympia plan beyond the 215 near Red Rock Canyon; Summerlin is a mature Howard Hughes community with established amenities. Choose based on new-construction timing, lot premiums, and commute — Dr. Jan Duffy helps compare. (702) 930-8222.',
    related: ['/skye-summit-master-plan', '/buy', '/relocate', '/skye-summit-home-prices'],
  },
  'skye-summit-interest-list.html': {
    title: 'Skye Summit Interest List | Early Access Updates | Dr. Jan Duffy',
    description:
      'Join the Skye Summit interest list for builder releases, floor plans, and pricing alerts from your buyer\'s representative.',
    h1: 'Join the Skye Summit Interest List',
    quickAnswer:
      'The Skye Summit interest list from Dr. Jan Duffy delivers early builder news, Vertice release timing, and Woodside updates before public marketing peaks. Sign up at the contact form or call (702) 930-8222 — no obligation.',
    related: ['/contact', '/kb-home-vertice-skye-summit', '/new-construction-skye-summit', '/buy'],
  },
  'skye-summit-first-time-buyer.html': {
    title: 'First-Time Buyer Guide | Skye Summit New Construction',
    description:
      'First-time buyers in Skye Summit: pre-approval, builder contracts, contingencies, and independent representation.',
    h1: 'First-Time Buyers in Skye Summit',
    quickAnswer:
      'First-time Skye Summit buyers should get mortgage pre-approval, hire an independent buyer\'s agent before touring models, and budget for upgrades, HOA, and closing costs. Dr. Jan Duffy walks you through each step — (702) 930-8222.',
    related: ['/buy', '/new-construction-skye-summit', '/skye-summit-faq', '/contact'],
  },
  'homes-for-sale-skye-summit.html': {
    title: 'Homes for Sale Near Skye Summit | Las Vegas Listings | Dr. Jan Duffy',
    description:
      'Browse homes for sale near the Skye Summit Master Plan corridor while you track Fall 2027 builder releases with a buyer\'s rep.',
    h1: 'Homes for Sale Near Skye Summit',
    quickAnswer:
      'Active MLS homes near Skye Summit help buyers who need housing before Fall 2027 builder deliveries. Search with Dr. Jan Duffy while you stay on the Skye Summit interest list for Vertice and Woodside releases. (702) 930-8222.',
    related: ['/buy', '/skye-summit-interest-list', '/new-construction-skye-summit', '/contact'],
  },
  'living-in-skye-summit.html': {
    title: 'Living in Skye Summit | Lifestyle, Trails & Red Rock Access',
    description:
      'What living in Skye Summit will feel like: trails, desert design, Red Rock Canyon access, and NW Las Vegas conveniences.',
    h1: 'Living in Skye Summit',
    quickAnswer:
      'Living in Skye Summit means elevated homesites, desert-conscious design, and trail access toward Red Rock Canyon on the Centennial Hills edge beyond the 215. Dr. Jan Duffy helps buyers match lifestyle priorities to upcoming villages — (702) 930-8222.',
    related: ['/community', '/skye-summit-schools', '/skye-summit-hoa', '/relocate'],
  },
  'olympia-companies-skye-summit.html': {
    title: 'Olympia Companies Skye Summit | Developer Guide',
    description:
      'Olympia Companies — developer of Skye Summit, Skye Canyon, and Southern Highlands. What buyers should know.',
    h1: 'Olympia Companies & Skye Summit',
    quickAnswer:
      'Olympia Companies is developing the 505-acre Skye Summit Master Plan — the team behind Skye Canyon and Southern Highlands. Buyer representation stays independent of the developer; Dr. Jan Duffy represents you. (702) 930-8222.',
    related: ['/skye-summit-master-plan', '/new-construction-skye-summit', '/buy', '/community'],
  },
  'centennial-hills-real-estate.html': {
    title: 'Centennial Hills Real Estate | Near Skye Summit | Dr. Jan Duffy',
    description:
      'Centennial Hills homes and the adjacent Skye Summit Master Plan — buyer representation from Dr. Jan Duffy.',
    h1: 'Centennial Hills Real Estate Near Skye Summit',
    quickAnswer:
      'Centennial Hills sits east of the Skye Summit Master Plan along the 215 Beltway corridor. Buyers often compare resale inventory here with upcoming Skye Summit new construction. Dr. Jan Duffy represents both searches — (702) 930-8222.',
    related: ['/skye-summit-master-plan', '/buy', '/northwest-las-vegas-real-estate', '/homes-for-sale-skye-summit'],
  },
  'northwest-las-vegas-real-estate.html': {
    title: 'Northwest Las Vegas Real Estate | Skye Summit Corridor',
    description:
      'Northwest Las Vegas real estate focused on the Skye Summit, Centennial Hills, and Red Rock edge corridor.',
    h1: 'Northwest Las Vegas Real Estate',
    quickAnswer:
      'Northwest Las Vegas spans Centennial Hills, Skye Canyon, Providence, and the new Skye Summit Master Plan beyond the 215. Dr. Jan Duffy hyper-focuses buyer representation on Skye Summit while helping clients compare nearby inventory. (702) 930-8222.',
    related: ['/skye-summit-master-plan', '/centennial-hills-real-estate', '/buy', '/contact'],
  },
  'office-location.html': {
    title: 'Office Location | Dr. Jan Duffy Skye Summit REALTOR® | Southern Highlands',
    description:
      'Visit Dr. Jan Duffy at Berkshire Hathaway HomeServices Nevada Properties, 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141.',
    h1: 'Office Location — Skye Summit Buyer Representation',
    quickAnswer:
      'Dr. Jan Duffy\'s office is at 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141 — Berkshire Hathaway HomeServices Nevada Properties. Hours Sunday–Saturday 9 AM–6 PM. Call (702) 930-8222 for Skye Summit buyer consults.',
    related: ['/contact', '/about', '/skye-summit-realtor', '/skye-summit-master-plan'],
  },
};

module.exports = {
  ENTITY_LINKS,
  FOOTER_QUICK_LINKS,
  FOOTER_AREA_LINKS,
  SITEWIDE_QUICK_ANSWER,
  PAGE_SEO,
};
