#!/usr/bin/env node
/**
 * Sitewide NAP normalization: footer GBP name, legacy schema business names, GBP description.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const C = require('../lib/gbp-constants');

const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'ai-gateway-parallel-search',
  'ai-gateway-text',
  'ai-gateway-video',
  'cloudflare',
  'attached_assets',
  'lib',
]);

function listHtmlFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.')) continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIRS.has(name.name)) continue;
      listHtmlFiles(full, out);
      continue;
    }
    if (name.isFile() && name.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

const FOOTER_OLD = `<h3>Dr. Jan Duffy, REALTOR®</h3>
                    <p>Berkshire Hathaway HomeServices Nevada Properties</p>`;

const FOOTER_NEW = `<h3>${C.FOOTER_HEADING}</h3>
                    <p>${C.FOOTER_SUBLINE}</p>`;

const HYPERLOCAL_AREAS_NEW = `<strong>Office:</strong> ${C.CITY}, ${C.REGION} ${C.POSTAL} · <strong>Service area:</strong> ${C.SERVICE_AREA_GBP} · <a href="${C.MAP_PAGE_PATH}">Office map &amp; directions</a> · <a href="/skye-summit-realtor">About Dr. Jan</a> · <a href="/skye-summit-faq">FAQ</a>`;

const OLD_GBP_DESCRIPTIONS = [
  "Skye Summit | Homes by Dr. Jan Duffy operates from the Berkshire Hathaway HomeServices Nevada Properties office at 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141. Dr. Jan Duffy, REALTOR® (license S.0197614.LLC), serves as the buyer's representative for Skye Summit and northwest Las Vegas—including new construction interest, nearby Skye Canyon resale, and seller services.",
  "Skye Summit | Homes by Dr. Jan Duffy at the Berkshire Hathaway HomeServices Nevada Properties office. Dr. Jan Duffy, REALTOR®, is the buyer's representative for Skye Summit and northwest Las Vegas.",
  'Skye Summit Las Vegas real estate specialist with expertise in new construction homes and elevated community properties',
  'Real estate office for Skye Summit and northwest Las Vegas — Berkshire Hathaway HomeServices Nevada Properties.',
  C.GBP_DESCRIPTION,
];

const OLD_HYPERLOCAL_LEADS = [
  "Skye Summit | Homes by Dr. Jan Duffy shares the Berkshire Hathaway HomeServices office below. Dr. Jan Duffy, REALTOR®, is your buyer's representative for Skye Summit and northwest Las Vegas purchases.",
  'Dr. Jan Duffy, licensed Nevada Realtor since 2009, specializes in northwest Las Vegas luxury real estate. Expert in Skye Summit homes, Summerlin properties, and Henderson communities. Office: 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141.',
];

const REPLACEMENTS = [
  [FOOTER_OLD, FOOTER_NEW],
  ['"name": "Dr. Jan Duffy Real Estate"', `"name": ${JSON.stringify(C.GBP_BUSINESS_NAME)}`],
  [
    'Service area: Las Vegas, NV 89141 and Skye Summit · Centennial Hills · Northwest Las Vegas',
    `Office: ${C.POSTAL} · Service area: ${C.SERVICE_AREA_GBP}`,
  ],
  [
    'Office: Las Vegas, NV 89141 · Serves Skye Summit, Centennial Hills & northwest Las Vegas (89166 area)',
    `Office: ${C.POSTAL} · Service area: ${C.SERVICE_AREA_GBP}`,
  ],
  [
    'Primary service area: Las Vegas, NV 89141, USA · Office serves Skye Summit, Centennial Hills & northwest Las Vegas (89166 area)',
    `Office: ${C.POSTAL} · Service area: ${C.SERVICE_AREA_GBP}`,
  ],
  [
    '<strong>Primary service area:</strong> Las Vegas, NV 89141, USA ·',
    `<strong>Office:</strong> ${C.CITY}, ${C.REGION} ${C.POSTAL} · <strong>Service area:</strong> ${C.SERVICE_AREA_GBP} ·`,
  ],
  [
    '<strong>Service area:</strong> Las Vegas, NV 89141, USA',
    `<strong>Office:</strong> ${C.POSTAL} · <strong>Service area:</strong> ${C.SERVICE_AREA_GBP}`,
  ],
  [
    '<strong>Office:</strong> Las Vegas, NV 89141 · <strong>Markets served:</strong> Skye Summit · Skye Canyon · Centennial Hills · Northwest Las Vegas (89166) · Summerlin · Henderson ·',
    HYPERLOCAL_AREAS_NEW + ' ·',
  ],
  [
    '<strong>Office:</strong> Las Vegas, NV 89141 · <strong>Service area:</strong> Skye Summit Master Plan · nearby Skye Canyon & Centennial Hills resales (89166) ·',
    HYPERLOCAL_AREAS_NEW + ' ·',
  ],
  [
    '<strong>Office:</strong> Las Vegas, NV 89141 · <strong>Service area:</strong> Skye Summit Master Plan · nearby Skye Canyon &amp; Centennial Hills resales (89166) ·',
    HYPERLOCAL_AREAS_NEW + ' ·',
  ],
  [
    'Office: Las Vegas, NV 89141 · Service area: Skye Summit Master Plan · nearby Skye Canyon & Centennial Hills resales (89166)',
    `Office: ${C.POSTAL} · Service area: ${C.SERVICE_AREA_GBP}`,
  ],
  [
    '<strong>Office:</strong> Las Vegas, NV 89141 · <strong>Service area:</strong> Skye Summit Master Plan · nearby Skye Canyon &amp; Centennial Hills resales (89166)',
    `<strong>Office:</strong> ${C.POSTAL} · <strong>Service area:</strong> ${C.SERVICE_AREA_GBP}`,
  ],
  [
    "buyer's representative for the Skye Summit Master Plan (coming Fall 2027) and nearby northwest Las Vegas resales (89166).",
    `buyer's representative for the Skye Summit Master Plan (coming ${C.MASTER_PLAN_LAUNCH}).`,
  ],
  [
    'Northwest Las Vegas &amp; Skye Summit area',
    C.GEO_CONTEXT_TITLE,
  ],
  [
    'Northwest Las Vegas & Skye Summit area',
    C.GEO_CONTEXT_TITLE,
  ],
  [
    'aria-label="Northwest Las Vegas service area"',
    'aria-label="Skye Summit Master Plan service area"',
  ],
  ['"name": "Las Vegas, NV 89141, USA"', `"name": ${JSON.stringify(C.SERVICE_AREA_GBP)}`],
  [
    'Dr. Jan Duffy specializes in Skye Summit and northwest Las Vegas',
    'Dr. Jan Duffy is the buyer\'s representative for the Skye Summit Master Plan',
  ],
  [
    'focuses on Skye Summit and northwest Las Vegas',
    'is the buyer\'s representative for the Skye Summit Master Plan',
  ],
  [
    'Dr. Jan Duffy covers Skye Summit and northwest Las Vegas in depth',
    'Dr. Jan Duffy is the buyer\'s representative for the Skye Summit Master Plan',
  ],
  [
    'Dr. Jan Duffy provides buyer and seller representation, valuations, and hyperlocal guides',
    'Dr. Jan Duffy is the buyer\'s representative for the Skye Summit Master Plan',
  ],
  [
    'one contact for buyer representation, seller marketing, and new construction in northwest Las Vegas',
    'buyer\'s representative for the Skye Summit Master Plan—early-access updates and new-construction representation',
  ],
  [
    'Concierge real estate for Skye Summit communities—one trusted advisor for your entire buy or sell journey in northwest Las Vegas.',
    'Buyer\'s representative for the Skye Summit Master Plan—early-access updates, builder coordination, and new-construction representation.',
  ],
  [
    'Dr. Jan Duffy serves buyers and sellers across Red Rock Canyon, Gilcrease Nature Sanctuary, Tule Springs Fossil Beds, Holy Mountain, Humboldt-Toiyabe National Forest, Centennial Hills, and nearby northwest Las Vegas communities.',
    'Dr. Jan Duffy is the buyer\'s representative for the Skye Summit Master Plan—a 505-acre Olympia Companies community coming Fall 2027.',
  ],
  [
    'or browse nearby Skye Canyon and Centennial Hills resales',
    'for early-access Skye Summit Master Plan updates',
  ],
  [
    'including new-construction interest and nearby Skye Canyon resales',
    'including early-access Skye Summit Master Plan updates and new-construction buyer representation',
  ],
  [
    'specializing in Skye Summit and northwest Las Vegas',
    'buyer\'s representative for the Skye Summit Master Plan',
  ],
  [
    'Serving clients since 2009',
    `Licensed since ${C.OPENING_DATE_DISPLAY}`,
  ],
  [
    'Centennial Hills real estate',
    'Skye Summit Master Plan new construction',
  ],
];

for (const oldDesc of OLD_GBP_DESCRIPTIONS) {
  REPLACEMENTS.push([oldDesc, C.AGENT_SITE_DESCRIPTION]);
}

for (const oldLead of OLD_HYPERLOCAL_LEADS) {
  REPLACEMENTS.push([oldLead, C.HYPERLOCAL_LEAD]);
}

let updated = 0;

for (const filePath of listHtmlFiles(root)) {
  let html = fs.readFileSync(filePath, 'utf8');
  let next = html;
  for (const [from, to] of REPLACEMENTS) {
    next = next.split(from).join(to);
  }
  if (next !== html) {
    fs.writeFileSync(filePath, next);
    updated += 1;
  }
}

console.log(`normalize-nap: updated ${updated} HTML file(s)`);
