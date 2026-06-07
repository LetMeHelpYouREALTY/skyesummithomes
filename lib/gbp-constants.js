'use strict';

/** Single source of truth — must match Google Business Profile */
module.exports = {
  SITE: 'https://www.skyesummithomes.com',
  GBP_BUSINESS_NAME: 'Skye Summit | Homes by Dr. Jan Duffy',
  GBP_CATEGORY: 'Real estate agent',
  AGENT_NAME: 'Dr. Jan Duffy',
  AGENT_TITLE: 'REALTOR®',
  AGENT_ROLE: "Buyer's Representative",
  BROKERAGE: 'Berkshire Hathaway HomeServices Nevada Properties',
  LICENSE: 'S.0197614.LLC',
  OPENING_DATE: '2009-09-20',
  PHONE_DISPLAY: '(702) 930-8222',
  PHONE_TEL: '+17029308222',
  SMS_URL: 'sms:+17029308222',
  EMAIL: 'DrJanSells@SkyeSummitHomes.com',
  STREET: '11411 Southern Highlands Pkwy #300',
  CITY: 'Las Vegas',
  REGION: 'NV',
  POSTAL: '89141',
  /** GBP service area — must match Google Business Profile */
  SERVICE_AREA_GBP: 'Skye Summit Master Plan',
  /** Supplemental copy — nearby resale corridor (not the GBP service area name) */
  SERVICE_AREA_NEARBY_VISIBLE:
    'nearby Skye Canyon & Centennial Hills resales (89166)',
  SERVICE_AREA_MARKETS_VISIBLE: 'Skye Summit Master Plan',
  GBP_DASHBOARD_SERVICE_AREAS: ['Skye Summit Master Plan'],
  HOMEPAGE_OFFICE_LINE:
    'Office at our Berkshire Hathaway Southern Highlands location (89141)—buyer\'s representative for the Skye Summit Master Plan (coming Fall 2027) and nearby northwest Las Vegas resales (89166).',
  GBP_URL: 'https://share.google/yoVmGzrpTUtHrvsnL',
  GBP_REVIEW_URL: 'https://share.google/yoVmGzrpTUtHrvsnL&action=write_review',
  SOCIAL_LINKEDIN:
    'https://www.linkedin.com/company/skye-summit-homes-by-dr-jan-duffy/',
  SOCIAL_FACEBOOK: 'https://www.facebook.com/SkyeSummitHomes',
  MAPS_DIRECTIONS:
    'https://maps.google.com/?q=11411+Southern+Highlands+Pkwy+%23300+Las+Vegas+NV+89141',
  MAP_EMBED:
    'https://www.google.com/maps?q=11411+Southern+Highlands+Pkwy+%23300+Las+Vegas+NV+89141&output=embed',
  /** WGS84 — Berkshire Hathaway office (matches GBP address) */
  GEO_LAT: 36.017598,
  GEO_LNG: -115.20417,
  GEO_POSITION: '36.017598;-115.204170',
  GEO_ICBM: '36.017598, -115.204170',
  MAP_PAGE_PATH: '/office-location',
  OSM_MAP_URL:
    'https://www.openstreetmap.org/?mlat=36.017598&mlon=-115.204170#map=17/36.017598/-115.204170',
  /** Visible hours — matches GBP main hours (Sun–Sat 9 AM–6 PM) */
  HOURS: [{ days: 'Sunday – Saturday', time: '9:00 AM – 6:00 PM' }],
  HOLIDAY_NOTES: [
    'Closed Apr 5, 2026 (Easter)',
    'Closed May 25, 2026 (Memorial Day)',
    'Closed Jul 3, 2026 (4th of July observed)',
  ],
  /** schema.org OpeningHoursSpecification */
  OPENING_HOURS_SPEC: [
    {
      dayOfWeek: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  /** Exact text from Google Business Profile — do not paraphrase */
  GBP_DESCRIPTION:
    'Dr. Jan Duffy, licensed Nevada Realtor since 2009, specializes in northwest Las Vegas luxury real estate. Expert in Skye Summit homes, Summerlin properties, and Henderson communities. Comprehensive services include buyer representation, luxury home marketing, investment property consultation, and relocation assistance. Known for market expertise, skilled negotiation, and personalized client service. Free property valuations and market analysis available. Schedule your consultation today to discover why clients choose Dr. Duffy for their real estate needs',
  HYPERLOCAL_LEAD:
    'Dr. Jan Duffy, licensed Nevada Realtor since 2009, specializes in northwest Las Vegas luxury real estate. Expert in Skye Summit homes, Summerlin properties, and Henderson communities. Office: 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141.',
  OPENING_DATE_DISPLAY: 'September 20, 2009',
  ACCESSIBILITY: [
    'Wheelchair accessible entrance',
    'Wheelchair accessible parking lot',
  ],
  /** Northwest valley — Skye Summit / Skye Canyon corridor (not office geo) */
  SKYE_SUMMIT_AREA_LAT: 36.265,
  SKYE_SUMMIT_AREA_LNG: -115.315,
  FOOTER_HEADING: 'Skye Summit | Homes by Dr. Jan Duffy',
  FOOTER_SUBLINE:
    'Dr. Jan Duffy, REALTOR® · Buyer\'s Representative<br>Berkshire Hathaway HomeServices Nevada Properties',
  SERVICE_AREAS: [
    'Skye Summit Master Plan',
    'Skye Summit',
    'Skye Canyon',
    'Centennial Hills',
    'Northwest Las Vegas',
    'Southern Highlands',
    'The Summit at Skye',
    'Summerlin',
    'Henderson',
  ],
  RATING: '4.9',
  REVIEW_COUNT: '127',
  /** Plain-language labels for buyers/sellers (not SEO jargon) */
  LABEL_CONTACT_CARD: 'Office contact & address',
  LABEL_CONTACT_ACTIONS: 'Contact Dr. Jan Duffy',
  LABEL_GOOGLE_SECTION: 'Google reviews',
  LABEL_VIEW_ON_GOOGLE: 'View on Google',
  LABEL_WRITE_REVIEW: 'Write a Google review',
  LABEL_HOURS_SOURCE: 'Hours below match our Google listing.',
  LABEL_OFFICE_SAME_AS_GOOGLE: 'same address shown on Google Maps',
  SAME_AS: [
    'https://share.google/yoVmGzrpTUtHrvsnL',
    'https://www.linkedin.com/company/skye-summit-homes-by-dr-jan-duffy/',
    'https://www.facebook.com/SkyeSummitHomes',
  ],
};
