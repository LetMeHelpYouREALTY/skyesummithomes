'use strict';

const C = require('./gbp-constants');

/**
 * Skye Summit Master Plan map center — northwest Las Vegas corridor beyond the 215 Beltway.
 * WGS84 aligned with lib/gbp-constants.js SKYE_SUMMIT_AREA_* and City of Las Vegas
 * Skye Summit planning exhibits (west of Sheep Mountain Pkwy alignment; Tropical Pkwy south).
 * Source: skyesummit.com, City planning Exhibit F vicinity map, repo schema Place geo.
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

/** Category order: master-planned family community (not 55+ condo) */
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
 * Curated, verifiable places (names + addresses only — no invented ratings or drive times).
 * Used for crawlable HTML, fallback map list, and ItemList schema.
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
  },
  {
    name: 'Floyd Lamb Park at Tule Springs',
    schemaType: 'Park',
    category: 'parks',
    streetAddress: '9200 Tule Springs Rd',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89134',
  },
  {
    name: "Smith's Food and Drug",
    schemaType: 'GroceryStore',
    category: 'grocery',
    streetAddress: '7151 N Durango Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
  },
  {
    name: 'Albertsons',
    schemaType: 'GroceryStore',
    category: 'grocery',
    streetAddress: '6971 N Durango Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
  },
  {
    name: 'Centennial Hills Hospital Medical Center',
    schemaType: 'Hospital',
    category: 'healthcare',
    streetAddress: '6900 N Durango Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
  },
  {
    name: 'Red Rock Casino Resort & Spa',
    schemaType: 'GolfCourse',
    category: 'golf',
    streetAddress: '11011 W Charleston Blvd',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89135',
    note: 'Resort with golf course and dining',
  },
  {
    name: 'Centennial Hills YMCA',
    schemaType: 'ExerciseGym',
    category: 'fitness',
    streetAddress: '6601 N Buffalo Dr',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89131',
  },
  {
    name: 'Target',
    schemaType: 'Store',
    category: 'shopping',
    streetAddress: '7557 N Rainbow Blvd',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
  },
  {
    name: 'Centennial High School',
    schemaType: 'School',
    category: 'schools',
    streetAddress: '10200 Centennial Pkwy',
    locality: 'Las Vegas',
    region: 'NV',
    postalCode: '89149',
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
    searchRadiusMeters: 12000,
    maxResults: 12,
    pagePath: PAGE_PATH,
    featuredPlaces: FEATURED_PLACES.map((p) => ({
      name: p.name,
      category: p.category,
      address: formatAddress(p),
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
