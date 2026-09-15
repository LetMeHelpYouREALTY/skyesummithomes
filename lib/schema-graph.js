'use strict';

const C = require('./gbp-constants');

const IDS = {
  website: `${C.SITE}/#website`,
  organization: `${C.SITE}/#organization`,
  person: `${C.SITE}/#person`,
  agent: `${C.SITE}/#agent`,
  localBusiness: `${C.SITE}/#localbusiness`,
  masterPlan: `${C.SITE}/#skye-summit-master-plan`,
};

function openingHoursSpecification() {
  return C.OPENING_HOURS_SPEC.map((spec) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: spec.dayOfWeek,
    opens: spec.opens,
    closes: spec.closes,
  }));
}

function schemaAreaServed() {
  return [{ '@type': 'Place', '@id': IDS.masterPlan, name: C.SERVICE_AREA_GBP }];
}

function buildOrganization() {
  return {
    '@type': 'Organization',
    '@id': IDS.organization,
    name: C.BROKERAGE,
    url: C.SITE,
    logo: `${C.SITE}/images/agents/dr-jan-duffy.jpg`,
    sameAs: C.SAME_AS,
  };
}

function buildPerson() {
  return {
    '@type': 'Person',
    '@id': IDS.person,
    name: C.AGENT_NAME,
    jobTitle: `${C.AGENT_TITLE} · ${C.AGENT_ROLE}`,
    description: C.AGENT_SITE_DESCRIPTION,
    telephone: C.PHONE_TEL,
    email: C.EMAIL,
    url: C.SITE,
    image: `${C.SITE}/images/agents/dr-jan-duffy.jpg`,
    identifier: C.LICENSE,
    knowsAbout: C.SCHEMA_KNOWS_ABOUT,
    worksFor: { '@id': IDS.organization },
    sameAs: C.SAME_AS,
  };
}

function buildMasterPlanPlace() {
  return {
    '@type': ['Place', 'Residence'],
    '@id': IDS.masterPlan,
    name: C.SERVICE_AREA_GBP,
    alternateName: 'Skye Summit Homes',
    description: `${C.MASTER_PLAN_SIZE} Olympia Companies master-planned community coming ${C.MASTER_PLAN_LAUNCH} in northwest Las Vegas beyond the 215 Beltway near Red Rock Canyon—about 3,500 homes planned; KB Home Vertice first village.`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: C.SKYE_SUMMIT_AREA_LAT,
      longitude: C.SKYE_SUMMIT_AREA_LNG,
    },
    containedInPlace: {
      '@type': 'City',
      name: C.CITY,
      addressRegion: C.REGION,
      addressCountry: 'US',
    },
    developer: {
      '@type': 'Organization',
      name: 'Olympia Companies',
      url: 'https://www.olympiacompanies.com/',
    },
    numberOfHousingUnits: 3500,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Trails', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Parks', value: true },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Desert-conscious landscaping',
        value: true,
      },
    ],
  };
}

function buildRealEstateAgent() {
  return {
    '@type': 'RealEstateAgent',
    '@id': IDS.agent,
    name: `${C.AGENT_NAME}, ${C.AGENT_TITLE}`,
    jobTitle: `${C.AGENT_TITLE} · ${C.AGENT_ROLE}`,
    description: C.AGENT_SITE_DESCRIPTION,
    telephone: C.PHONE_TEL,
    email: C.EMAIL,
    url: C.SITE,
    image: `${C.SITE}/images/agents/dr-jan-duffy.jpg`,
    identifier: C.LICENSE,
    license: C.LICENSE,
    foundingDate: C.OPENING_DATE,
    priceRange: '$$$',
    memberOf: { '@id': IDS.organization },
    worksFor: { '@id': IDS.organization },
    areaServed: [
      ...schemaAreaServed(),
      { '@type': 'City', name: 'Las Vegas' },
      { '@type': 'Place', name: 'Centennial Hills' },
      { '@type': 'Place', name: 'Northwest Las Vegas' },
    ],
    knowsAbout: C.SCHEMA_KNOWS_ABOUT,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Skye Summit Realtor Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Skye Summit buyer representation',
            url: `${C.SITE}/buy`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Skye Summit new construction guidance',
            url: `${C.SITE}/new-construction-skye-summit`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Skye Summit interest list',
            url: `${C.SITE}/skye-summit-interest-list`,
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Skye Summit seller consultation',
            url: `${C.SITE}/sell`,
          },
        },
      ],
    },
    sameAs: C.SAME_AS,
    address: {
      '@type': 'PostalAddress',
      streetAddress: C.STREET,
      addressLocality: C.CITY,
      addressRegion: C.REGION,
      postalCode: C.POSTAL,
      addressCountry: 'US',
    },
  };
}

function buildLocalBusiness() {
  return {
    '@type': ['LocalBusiness', 'RealEstateAgent'],
    '@id': IDS.localBusiness,
    name: C.GBP_BUSINESS_NAME,
    description: C.AGENT_SITE_DESCRIPTION,
    areaServed: schemaAreaServed(),
    amenityFeature: C.ACCESSIBILITY.map((name) => ({
      '@type': 'LocationFeatureSpecification',
      name,
      value: true,
    })),
    telephone: C.PHONE_TEL,
    email: C.EMAIL,
    url: C.SITE,
    image: [
      `${C.SITE}/images/agents/dr-jan-duffy.jpg`,
      `${C.SITE}${C.OG_IMAGE_PATH}`,
      `${C.SITE}/images/hero/hero-office-southern-highlands.jpg`,
    ],
    photo: [
      {
        '@type': 'ImageObject',
        contentUrl: `${C.SITE}/images/agents/dr-jan-duffy.jpg`,
        name: `${C.AGENT_NAME} headshot`,
        caption: `${C.AGENT_NAME}, ${C.AGENT_TITLE}`,
      },
      {
        '@type': 'ImageObject',
        contentUrl: `${C.SITE}${C.OG_IMAGE_PATH}`,
        name: 'Skye Summit Homes Las Vegas',
        caption: 'Skye Summit Master Plan — desert contemporary homes near Red Rock Canyon',
      },
      {
        '@type': 'ImageObject',
        contentUrl: `${C.SITE}/images/hero/hero-office-southern-highlands.jpg`,
        name: 'Southern Highlands office',
        caption: `${C.STREET}, ${C.CITY}, ${C.REGION} ${C.POSTAL}`,
      },
    ],
    priceRange: '$$$',
    mainEntityOfPage: C.SITE,
    foundingDate: C.OPENING_DATE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: C.STREET,
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
    hasMap: C.MAPS_DIRECTIONS,
    openingHoursSpecification: openingHoursSpecification(),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: C.RATING,
      reviewCount: C.REVIEW_COUNT,
      bestRating: '5',
    },
    sameAs: C.SAME_AS,
  };
}

function buildHyperlocalGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(),
      buildPerson(),
      buildMasterPlanPlace(),
      buildRealEstateAgent(),
      buildLocalBusiness(),
    ],
  };
}

function buildWebSiteSchema() {
  // No SearchAction / sitelinks searchbox: Google previously crawled a literal
  // template URL (/?s={search_term_string}) as "Page with redirect". Keep WebSite
  // for entity identity only; zip search lives at /search without schema templates.
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': IDS.website,
    name: C.GBP_BUSINESS_NAME,
    url: C.SITE,
    description: C.AGENT_SITE_DESCRIPTION,
    publisher: { '@id': IDS.localBusiness },
    author: { '@id': IDS.agent },
  };
}

function graphScriptHtml() {
  return `<script type="application/ld+json" data-hyperlocal-gbp-schema>\n${JSON.stringify(buildHyperlocalGraph(), null, 2)}\n    </script>`;
}

module.exports = {
  IDS,
  buildHyperlocalGraph,
  buildWebSiteSchema,
  buildMasterPlanPlace,
  graphScriptHtml,
  schemaAreaServed,
};
