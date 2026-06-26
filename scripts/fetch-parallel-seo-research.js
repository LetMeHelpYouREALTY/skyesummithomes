#!/usr/bin/env node
/**
 * Fetch SEO / GEO / AEO research via Parallel Search + Task APIs.
 * Requires PARALLEL_API_KEY. Writes lib/parallel-seo-enrichment.json (merge with existing overlays).
 *
 * Usage: PARALLEL_API_KEY=... node scripts/fetch-parallel-seo-research.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const root = path.join(__dirname, '..');
const outPath = path.join(root, 'lib/parallel-seo-enrichment.json');
const guidesOutPath = path.join(root, 'lib/parallel-search-guides.json');
const apiKey = process.env.PARALLEL_API_KEY;

if (!apiKey) {
  console.error('Missing PARALLEL_API_KEY');
  process.exit(1);
}

const PAGE_MAP = {
  Homepage: 'index.html',
  'Buy Page': 'buy.html',
  'Sell Page': 'sell.html',
  'Community Page': 'community.html',
  'Invest Page': 'invest.html',
  'About Page': 'about.html',
  'Valuation Page': 'valuation.html',
  'Relocate Page': 'relocate.html',
  'Contact Page': 'contact.html',
};

const GUIDE_SLUGS = [
  'skye-summit-master-plan',
  'skye-summit-interest-list',
  'kb-home-vertice-skye-summit',
  'olympia-companies-skye-summit',
  'woodside-homes-skye-summit',
  'skye-summit-timeline',
  'new-construction-skye-summit',
  'skye-summit-hoa',
  'skye-summit-schools',
  'skye-summit-home-prices',
  'skye-summit-vs-summerlin',
  'living-in-skye-summit',
  'northwest-las-vegas-real-estate',
  'centennial-hills-real-estate',
  'skye-summit-faq',
  'skye-summit-first-time-buyer',
  'homes-for-sale-skye-summit',
];

const TASK_INPUT = `Research current SEO, GEO, and AEO content for skyesummithomes.com.

Business: Dr. Jan Duffy, REALTOR® (License S.0197614.LLC), Berkshire Hathaway HomeServices Nevada Properties.
Focus: Skye Summit Master Plan ONLY — a 505-acre Olympia Companies community coming Fall 2027 in northwest Las Vegas, beyond the 215 Beltway (~3,500 planned homes). KB Home Vertice (299 homesites, sales may open early 2027), Woodside Homes, and Century Communities are among builders.

IMPORTANT: Skye Summit Master Plan is NOT Skye Canyon (a separate established community). Do not mix Skye Canyon HOA/pricing into Skye Summit Master Plan copy.

Return factual, citation-backed quick answers and FAQs. Do not invent review counts, sales volume, or unverified pricing. Use plain language. Phone: (702) 930-8222. Office: 11411 Southern Highlands Pkwy #300, Las Vegas, NV 89141.

Include geo keywords (215 Beltway, Centennial Hills, Red Rock Canyon corridor, northwest Las Vegas) and local entities tied to the master plan area.

For guide page briefs, use slug keys exactly as listed in the schema.`;

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => {
          raw += c;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`Invalid JSON from ${url}: ${raw.slice(0, 200)}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'x-api-key': apiKey } }, (res) => {
        let raw = '';
        res.on('data', (c) => {
          raw += c;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(new Error(`Invalid JSON from ${url}`));
          }
        });
      })
      .on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function sanitize(text) {
  return String(text)
    .replace(/\btop-rated\b/gi, '')
    .replace(/\bunparalleled\b/gi, '')
    .replace(/\b500\+\s*(Vegas\s*)?families\b/gi, '')
    .replace(/\bSkye Canyon\b/gi, 'Skye Summit Master Plan')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function sanitizeFaq(faq) {
  return {
    q: sanitize(faq.q),
    a: sanitize(faq.a),
  };
}

function filterGeoList(list) {
  const deny = /skye canyon(?!\s+summit)/i;
  return [...new Set((list || []).map((s) => sanitize(String(s))).filter(Boolean))]
    .filter((s) => !deny.test(s))
    .slice(0, 12);
}

function summarizeSearch(searchResult) {
  return {
    search_id: searchResult.search_id,
    result_count: (searchResult.results || []).length,
    titles: (searchResult.results || []).slice(0, 5).map((r) => r.title),
  };
}

async function parallelSearch(objective, queries) {
  return postJson('https://api.parallel.ai/v1beta/search', {
    objective,
    search_queries: queries,
    max_results: 10,
    excerpts: { max_chars_per_result: 2500 },
  });
}

async function parallelTask() {
  const create = await postJson('https://api.parallel.ai/v1/tasks/runs', {
    input: TASK_INPUT,
    processor: 'base',
    task_spec: {
      output_schema: {
        type: 'json',
        json_schema: {
          type: 'object',
          properties: {
            geo_keywords: { type: 'array', items: { type: 'string' } },
            local_entities: { type: 'array', items: { type: 'string' } },
            aeo_recommendations: { type: 'array', items: { type: 'string' } },
            page_briefs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  page: { type: 'string' },
                  quick_answer: { type: 'string' },
                  faqs: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        q: { type: 'string' },
                        a: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
            guide_briefs: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  slug: { type: 'string' },
                  quick_answer: { type: 'string' },
                  description: { type: 'string' },
                  faqs: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        q: { type: 'string' },
                        a: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
          required: ['page_briefs', 'geo_keywords', 'local_entities'],
        },
      },
    },
  });

  const runId = create.run_id;
  if (!runId) throw new Error('Task create failed: ' + JSON.stringify(create));

  console.log(`parallel task started: ${runId}`);
  for (let i = 0; i < 40; i++) {
    await sleep(15000);
    const status = await getJson(`https://api.parallel.ai/v1/tasks/runs/${runId}`);
    console.log(`  status: ${status.status}`);
    if (status.status === 'completed') {
      const result = await getJson(`https://api.parallel.ai/v1/tasks/runs/${runId}/result`);
      return result.output?.content || result.output;
    }
    if (status.status === 'failed') {
      throw new Error('Task failed: ' + JSON.stringify(status));
    }
  }
  throw new Error('Task timed out');
}

function buildGuidePages(briefs, existing = {}) {
  const guidePages = { ...existing };
  for (const brief of briefs || []) {
    if (!brief.slug || !GUIDE_SLUGS.includes(brief.slug)) continue;
    guidePages[brief.slug] = {
      quickAnswer: sanitize(brief.quick_answer),
      ...(brief.description ? { description: sanitize(brief.description) } : {}),
      faqs: (brief.faqs || []).map(sanitizeFaq).slice(0, 4),
      source: 'parallel-task',
    };
  }
  return guidePages;
}

async function main() {
  console.log('Parallel Search: 2026 SEO/GEO/AEO best practices…');
  const searchSeo = await parallelSearch(
    '2026 SEO GEO AEO schema markup for local real estate: FAQPage, SpeakableSpecification, LocalBusiness, RealEstateAgent, BreadcrumbList',
    [
      'answer engine optimization real estate 2026',
      'generative engine optimization local business schema',
      'Google structured data real estate agent FAQ 2026',
    ]
  );

  console.log('Parallel Search: Skye Summit Master Plan current news…');
  const searchMasterPlan = await parallelSearch(
    'Skye Summit Master Plan Olympia Companies Las Vegas Fall 2027 KB Home Vertice Century Communities builders',
    [
      'Skye Summit Master Plan Olympia Companies Fall 2027',
      'KB Home Vertice Skye Summit Las Vegas',
      'Century Communities Skye Summit land purchase 2026',
    ]
  );

  console.log('Parallel Search: Northwest Las Vegas geo context…');
  const searchLocal = await parallelSearch(
    'Northwest Las Vegas real estate Centennial Hills 215 Beltway Red Rock Canyon schools CCSD',
    [
      'northwest Las Vegas master planned community 2026',
      'Centennial Hills Las Vegas real estate market',
      '215 Beltway northwest Las Vegas growth',
    ]
  );

  console.log('Parallel Search: HOA schools new construction buyer questions…');
  const searchBuyer = await parallelSearch(
    'Skye Summit Las Vegas new construction buyer FAQ HOA schools timeline interest list',
    [
      'new construction buyer representation Las Vegas builder contract',
      'Las Vegas master planned community HOA fees 2026',
      'CCSD school zoning northwest Las Vegas new homes',
    ]
  );

  fs.writeFileSync(
    guidesOutPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString().slice(0, 10),
        searches: {
          masterPlan: searchMasterPlan,
          local: searchLocal,
          buyer: searchBuyer,
        },
      },
      null,
      2
    )
  );
  console.log(`Wrote raw search cache: ${guidesOutPath}`);

  console.log('Parallel Task: page + guide briefs…');
  const taskOut = await parallelTask();

  const corePages = {};
  for (const brief of taskOut.page_briefs || []) {
    const file = PAGE_MAP[brief.page];
    if (!file) continue;
    corePages[file] = {
      quickAnswer: sanitize(brief.quick_answer),
      faqs: (brief.faqs || []).map(sanitizeFaq).slice(0, 4),
      source: 'parallel-task',
    };
  }

  let existing = {};
  if (fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  }

  const guidePages = buildGuidePages(taskOut.guide_briefs, existing.guidePages || {});

  const merged = {
    ...existing,
    generatedAt: new Date().toISOString().slice(0, 10),
    sources: ['parallel-search-api', 'parallel-task-api'],
    geoKeywords: filterGeoList(taskOut.geo_keywords),
    localEntities: filterGeoList(taskOut.local_entities),
    aeoRecommendations:
      (taskOut.aeo_recommendations || existing.aeoRecommendations || []).map(sanitize),
    corePages: { ...(existing.corePages || {}), ...corePages },
    guidePages,
    utilityPages: existing.utilityPages || {},
    searchSummaries: {
      seo: summarizeSearch(searchSeo),
      masterPlan: summarizeSearch(searchMasterPlan),
      local: summarizeSearch(searchLocal),
      buyer: summarizeSearch(searchBuyer),
    },
    rawSearchSeo: searchSeo.search_id,
    rawSearchMasterPlan: searchMasterPlan.search_id,
    rawSearchLocal: searchLocal.search_id,
    rawSearchBuyer: searchBuyer.search_id,
  };

  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log(
    `Wrote ${outPath} (${Object.keys(merged.corePages).length} core, ${Object.keys(merged.guidePages).length} guide briefs)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
