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
const apiKey = process.env.PARALLEL_API_KEY;

if (!apiKey) {
  console.error('Missing PARALLEL_API_KEY');
  process.exit(1);
}

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
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const PAGE_MAP = {
  Homepage: 'index.html',
  'Buy Page': 'buy.html',
  'Sell Page': 'sell.html',
  'Community Page': 'community.html',
  'Invest Page': 'invest.html',
};

async function parallelSearch(objective, queries) {
  return postJson('https://api.parallel.ai/v1beta/search', {
    objective,
    search_queries: queries,
    max_results: 8,
    max_chars_per_result: 2500,
  });
}

async function parallelTask() {
  const create = await postJson('https://api.parallel.ai/v1/tasks/runs', {
    input:
      'Research SEO GEO and AEO content for skyesummithomes.com: Dr. Jan Duffy REALTOR Skye Summit Las Vegas northwest. Return page briefs with quick answers and FAQs for homepage, buy, sell, community, invest. Include geo keywords and local entities near Red Rock Canyon and Centennial Hills.',
    processor: 'base',
    task_spec: {
      output_schema: {
        type: 'json',
        json_schema: {
          type: 'object',
          properties: {
            homepage_quick_answer: { type: 'string' },
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

async function main() {
  console.log('Parallel Search: SEO/GEO/AEO best practices…');
  const searchSeo = await parallelSearch(
    '2026 SEO GEO AEO best practices for local real estate agent websites FAQ schema quick answers',
    ['answer engine optimization real estate', 'generative engine optimization local business']
  );

  console.log('Parallel Search: Skye Summit local context…');
  const searchLocal = await parallelSearch(
    'Skye Summit Las Vegas community Centennial Hills Red Rock Canyon real estate',
    ['Skye Summit Las Vegas homes', 'northwest Las Vegas master planned community']
  );

  console.log('Parallel Task: page briefs…');
  const taskOut = await parallelTask();

  const corePages = {};
  for (const brief of taskOut.page_briefs || []) {
    const file = PAGE_MAP[brief.page];
    if (!file) continue;
    corePages[file] = {
      quickAnswer: sanitize(brief.quick_answer),
      faqs: (brief.faqs || []).map((f) => ({
        q: f.q,
        a: sanitize(f.a),
      })),
      source: 'parallel-task',
    };
  }

  let existing = {};
  if (fs.existsSync(outPath)) {
    existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  }

  const merged = {
    ...existing,
    generatedAt: new Date().toISOString().slice(0, 10),
    sources: ['parallel-search-api', 'parallel-task-api'],
    geoKeywords: taskOut.geo_keywords || existing.geoKeywords || [],
    localEntities: taskOut.local_entities || existing.localEntities || [],
    aeoRecommendations: taskOut.aeo_recommendations || existing.aeoRecommendations || [],
    corePages: { ...(existing.corePages || {}), ...corePages },
    rawSearchSeo: searchSeo.search_id,
    rawSearchLocal: searchLocal.search_id,
  };

  fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
  console.log(`Wrote ${outPath} (${Object.keys(merged.corePages).length} core page briefs)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
