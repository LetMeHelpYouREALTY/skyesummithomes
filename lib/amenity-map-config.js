'use strict';

const C = require('./gbp-constants');

/**
 * Skye Summit Master Plan map center — northwest Las Vegas corridor beyond the 215 Beltway.
 * WGS84 aligned with lib/gbp-constants.js SKYE_SUMMIT_AREA_* and City of Las Vegas
 * Skye Summit planning exhibits (west of Sheep Mountain Pkwy alignment; Tropical Pkwy south).
 */
const COMMUNITY = {
  name: 'Skye Summit Master Plan',
  shortName: 'Skye Summit',
  city: 'Las Vegas',
  region: 'NV',
  lat: C.SKYE_SUMMIT_AREA_LAT,
  lng: C.SKYE_SUMMIT_AREA_LNG,
  zoom: 13,
  coordinateSource:
    'City of Las Vegas Skye Summit planning exhibits + skyesummit.com; matches SKYE_SUMMIT_AREA_LAT/LNG in lib/gbp-constants.js',
};

const PAGE_PATH = '/nearby-amenities';

const CATEGORIES = [
  {
    id: 'parks',
    label: 'Parks',
    ariaLabel: 'Show parks and recreation near Skye Summit',
    primaryTypes: ['park', 'national_park'],
  },
  {
    id: 'grocery',
    label: 'Grocery',
    ariaLabel: 'Show grocery stores near Skye Summit',
    primaryTypes: ['grocery_store', 'supermarket'],
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    ariaLabel: 'Show hospitals and doctors near Skye Summit',
    primaryTypes: ['hospital', 'doctor'],
  },
  {
    id: 'golf',
    label: 'Golf',
    ariaLabel: 'Show golf courses near Skye Summit',
    primaryTypes: ['golf_course'],
  },
  {
    id: 'fitness',
    label: 'Fitness',
    ariaLabel: 'Show gyms and fitness centers near Skye Summit',
    primaryTypes: ['gym', 'fitness_center'],
  },
  {
    id: 'restaurants',
    label: 'Restaurants',
    ariaLabel: 'Show restaurants near Skye Summit',
    primaryTypes: ['restaurant'],
  },
  {
    id: 'cafes',
    label: 'Cafes',
    ariaLabel: 'Show cafes near Skye Summit',
    primaryTypes: ['cafe', 'coffee_shop'],
  },
  {
    id: 'shopping',
    label: 'Shopping',
    ariaLabel: 'Show shopping near Skye Summit',
    primaryTypes: ['shopping_mall', 'department_store'],
  },
  {
    id: 'schools',
    label: 'Schools',
    ariaLabel: 'Show schools near Skye Summit',
    primaryTypes: ['school', 'primary_school', 'secondary_school'],
  },
  {
    id: 'pharmacies',
    label: 'Pharmacies',
    ariaLabel: 'Show pharmacies near Skye Summit',
    primaryTypes: ['pharmacy', 'drugstore'],
  },
  {
    id: 'parking',
    label: 'Parking',
    ariaLabel: 'Show parking near Skye Summit',
    primaryTypes: ['parking'],
  },
];

/**
 * Curated places — name and address verified against official operator sites (sourceUrl).
 */
const FEATURED_PLACES = [
  {
    name: 'Red Rock Canyon National Conservation Area',
    schemaType: 'Park',
    category: 'parks',
    streetAddress: '1000 Scenic Loop Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89161',
    sourceUrl:
      'https://www.blm.gov/visit/red-rock-canyon-nca',
  },
  {
    name: 'Floyd Lamb Park at Tule Springs',
    schemaType: 'Park',
    category: 'parks',
    streetAddress: '9200 Tule Springs Rd',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89134',
    sourceUrl:
      'https://www.lasvegasnevada.gov/Residents/Parks-Facilities/Floyd-Lamb-Park',
    note: '680-acre city park',
  },
  {
    name: 'Craig Ranch Regional Park',
    schemaType: 'Park',
    category: 'parks',
    streetAddress: '628 W Craig Rd',
    locality: 'North Las Vegas',
    region: 'NV',
    postalCode: '89032',
    sourceUrl:
      'https://www.northlasvegasnevada.gov/departments/parks-and-recreation/parks/craig-ranch-regional-park',
    note: '170-acre regional park',
  },
  {
    name: "Smith's Food and Drug",
    schemaType: 'GroceryStore',
    category: 'grocery',
    streetAddress: '7130 N Durango Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
    sourceUrl: 'https://www.smithsfoodanddrug.com/stores/grocery/nv/las-vegas/montecito-marketplace/706/00332',
  },
  {
    name: 'Albertsons',
    schemaType: 'GroceryStore',
    category: 'grocery',
    streetAddress: '6971 N Durango Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
    sourceUrl: 'https://local.albertsons.com/nv/las-vegas/6971-n-durango-dr.html',
  },
  {
    name: 'Whole Foods Market',
    schemaType: 'GroceryStore',
    category: 'grocery',
    streetAddress: '2475 S Town Center Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89135',
    sourceUrl: 'https://www.wholefoodsmarket.com/stores/summerlin',
  },
  {
    name: 'Centennial Hills Hospital Medical Center',
    schemaType: 'Hospital',
    category: 'healthcare',
    streetAddress: '6900 N Durango Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
    sourceUrl: 'https://www.centennialhillshospital.com/',
  },
  {
    name: 'TPC Las Vegas',
    schemaType: 'GolfCourse',
    category: 'golf',
    streetAddress: '9851 Canyon Run Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89144',
    sourceUrl: 'https://tpc.com/lasvegas/',
  },
  {
    name: 'Angel Park Golf Club',
    schemaType: 'GolfCourse',
    category: 'golf',
    streetAddress: '100 S Rampart Blvd',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89145',
    sourceUrl: 'https://www.angelpark.com/',
  },
  {
    name: "Bear's Best Las Vegas",
    schemaType: 'GolfCourse',
    category: 'golf',
    streetAddress: '11111 W Flamingo Rd',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89135',
    sourceUrl: 'https://www.bearsbestlv.com/',
  },
  {
    name: 'Centennial Hills YMCA',
    schemaType: 'ExerciseGym',
    category: 'fitness',
    streetAddress: '6601 N Buffalo Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89131',
    sourceUrl: 'https://www.ymcasouthernnv.org/locations/centennial-hills-ymca',
  },
  {
    name: 'Target',
    schemaType: 'Store',
    category: 'shopping',
    streetAddress: '7557 N Rainbow Blvd',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
    sourceUrl: 'https://www.target.com/sl/las-vegas-centennial-hills/2185',
  },
  {
    name: 'Centennial High School',
    schemaType: 'School',
    category: 'schools',
    streetAddress: '10200 Centennial Pkwy',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
    sourceUrl: 'https://www.ccsd.net/schools/centennial-high-school',
    note: 'Clark County School District; assignments vary by Skye Summit address',
  },
  {
    name: 'Gilcrease Nature Sanctuary',
    schemaType: 'Park',
    category: 'parks',
    streetAddress: '8103 Racel St',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89131',
    sourceUrl: 'https://www.gilrasc.org/',
    note: 'Wildlife sanctuary; visit by appointment',
  },
];

function embedFallbackUrl() {
  const q = `${COMMUNITY.lat},${COMMUNITY.lng}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${COMMUNITY.zoom}&output=embed`;
}

function clientConfig() {
  return {
    community: COMMUNITY,
    categories: CATEGORIES,
    searchRadiusMeters: 5000,
    maxResults: 10,
    pagePath: PAGE_PATH,
    featuredPlaces: FEATURED_PLACES.map((p) => ({
      name: p.name,
      category: p.category,
      address: formatAddress(p),
      note: p.note || '',
    })),
  };
}

function formatAddress(p) {
  const parts = [p.streetAddress, `${p.locality}, ${p.region} ${p.postalCode}`].filter(
    Boolean
  );
  return parts.join(', ');
}

function directionsUrl(place) {
  const q = encodeURIComponent(`${place.name}, ${formatAddress(place)}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

module.exports = {
  COMMUNITY,
  CATEGORIES,
  FEATURED_PLACES,
  PAGE_PATH,
  embedFallbackUrl,
  clientConfig,
  formatAddress,
  directionsUrl,
};
