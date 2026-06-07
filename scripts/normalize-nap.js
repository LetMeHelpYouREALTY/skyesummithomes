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

const OLD_GBP_DESCRIPTIONS = [
  "Skye Summit | Homes by Dr. Jan Duffy operates from the Berkshire Hathaway HomeServices Nevada Properties office at 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141. Dr. Jan Duffy, REALTOR® (license S.0197614.LLC), serves as the buyer's representative for Skye Summit and northwest Las Vegas—including new construction interest, nearby Skye Canyon resale, and seller services.",
  "Skye Summit | Homes by Dr. Jan Duffy at the Berkshire Hathaway HomeServices Nevada Properties office. Dr. Jan Duffy, REALTOR®, is the buyer's representative for Skye Summit and northwest Las Vegas.",
  'Skye Summit Las Vegas real estate specialist with expertise in new construction homes and elevated community properties',
  'Real estate office for Skye Summit and northwest Las Vegas — Berkshire Hathaway HomeServices Nevada Properties.',
];

const OLD_HYPERLOCAL_LEADS = [
  "Skye Summit | Homes by Dr. Jan Duffy shares the Berkshire Hathaway HomeServices office below. Dr. Jan Duffy, REALTOR®, is your buyer's representative for Skye Summit and northwest Las Vegas purchases.",
];

const REPLACEMENTS = [
  [FOOTER_OLD, FOOTER_NEW],
  ['"name": "Dr. Jan Duffy Real Estate"', `"name": ${JSON.stringify(C.GBP_BUSINESS_NAME)}`],
  [
    'Service area: Las Vegas, NV 89141 and Skye Summit · Centennial Hills · Northwest Las Vegas',
    'Office: Las Vegas, NV 89141 · Serves Skye Summit, Centennial Hills & northwest Las Vegas (89166 area)',
  ],
  [
    'Serving clients since 2009',
    `Licensed since ${C.OPENING_DATE_DISPLAY}`,
  ],
];

for (const oldDesc of OLD_GBP_DESCRIPTIONS) {
  REPLACEMENTS.push([oldDesc, C.GBP_DESCRIPTION]);
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
