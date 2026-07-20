#!/usr/bin/env node
/**
 * Quick pre-flight checks for Google Search Console readiness (CI / local).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SITE = 'https://www.skyesummithomes.com';
const WWW_HOST = 'www.skyesummithomes.com';
let failed = 0;

function fail(msg) {
  console.error(`validate-gsc-ready: FAIL — ${msg}`);
  failed += 1;
}

function ok(msg) {
  console.log(`validate-gsc-ready: OK — ${msg}`);
}

const robotsPath = path.join(root, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  fail('robots.txt missing');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!/Sitemap:\s*https:\/\/www\.skyesummithomes\.com\/sitemap\.xml/i.test(robots)) {
    fail('robots.txt must declare www sitemap URL');
  } else {
    ok('robots.txt references www sitemap');
  }
  if (/Crawl-delay/i.test(robots)) {
    fail('robots.txt should not use Crawl-delay (ignored by Google)');
  }
}

const sitemapPath = path.join(root, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  fail('sitemap.xml missing');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (locs.length === 0) {
    fail('sitemap.xml has no URLs');
  } else {
    ok(`sitemap.xml lists ${locs.length} URL(s)`);
  }
  for (const loc of locs) {
    if (!loc.startsWith(SITE)) {
      fail(`sitemap URL not on www canonical host: ${loc}`);
    }
    if (loc.endsWith('/') && loc !== `${SITE}/`) {
      fail(`sitemap URL has trailing slash (vercel trailingSlash: false): ${loc}`);
    }
  }
}

function listHtmlFiles(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.') || name.name === 'node_modules') continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      listHtmlFiles(full, out);
      continue;
    }
    if (name.isFile() && name.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function hasKeepAttr(openTag) {
  return /data-(?:aeo-core-faq|guide-faq|geo-speakable|hyperlocal-gbp-schema)/i.test(
    openTag
  );
}

const trailingSlashCanonicalRe =
  /rel=["']canonical["']\s+href=["']https:\/\/www\.skyesummithomes\.com\/[^/"']+\/["']/i;
let trailingSlashCanonicals = 0;
for (const filePath of listHtmlFiles(root)) {
  const html = fs.readFileSync(filePath, 'utf8');
  if (trailingSlashCanonicalRe.test(html)) {
    fail(`trailing slash in canonical: ${path.relative(root, filePath)}`);
    trailingSlashCanonicals += 1;
  }
}
if (trailingSlashCanonicals === 0) {
  ok('no trailing-slash canonicals on inner pages');
}

const SKIP_HTML = new Set([
  'googlewKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI.html',
]);

let nonWwwCanonicals = 0;
let missingApexRedirect = 0;
let nonWwwOgUrl = 0;

for (const filePath of listHtmlFiles(root)) {
  const rel = path.relative(root, filePath);
  if (SKIP_HTML.has(rel)) continue;

  const html = fs.readFileSync(filePath, 'utf8');

  const canonicalMatch = html.match(
    /rel=["']canonical["']\s+href=["']([^"']+)["']/i
  );
  if (canonicalMatch) {
    const href = canonicalMatch[1];
    if (!href.startsWith(SITE)) {
      fail(`canonical must use ${SITE}: ${rel} → ${href}`);
      nonWwwCanonicals += 1;
    }
  }

  const ogUrlMatch = html.match(
    /property=["']og:url["']\s+content=["']([^"']+)["']/i
  );
  if (ogUrlMatch && !ogUrlMatch[1].startsWith(SITE)) {
    fail(`og:url must use ${SITE}: ${rel} → ${ogUrlMatch[1]}`);
    nonWwwOgUrl += 1;
  }

  if (/rel=["']canonical["']/i.test(html) && !/data-www-primary-redirect/i.test(html)) {
    fail(`missing apex→www redirect script: ${rel}`);
    missingApexRedirect += 1;
  }

  if (/href=["']https:\/\/skyesummithomes\.com/i.test(html)) {
    fail(`absolute apex URL in HTML (use www or relative): ${rel}`);
  }
}

if (nonWwwCanonicals === 0) {
  ok('all canonicals use www host');
}
if (nonWwwOgUrl === 0) {
  ok('all og:url values use www host');
}
if (missingApexRedirect === 0) {
  ok('apex→www redirect script on canonical pages');
}

const verificationFile = path.join(
  root,
  'googlewKOftY7ctL98xgE1EW2r-2pYqOXyN109r4ZLLiRwQsI.html'
);
if (!fs.existsSync(verificationFile)) {
  fail('Google HTML verification file missing at site root');
} else {
  ok('Google HTML verification file present');
}

const indexPath = path.join(root, 'index.html');
if (fs.existsSync(indexPath)) {
  const index = fs.readFileSync(indexPath, 'utf8');
  if (!/rel=["']canonical["']\s+href=["']https:\/\/www\.skyesummithomes\.com\/?["']/i.test(index)) {
    fail('index.html missing www canonical link');
  } else {
    ok('index.html has www canonical');
  }
  if (!/name=["']google-site-verification["']/i.test(index)) {
    fail('index.html missing google-site-verification meta tag');
  } else {
    ok('index.html has google-site-verification meta');
  }
  if (!/rel=["']sitemap["']/i.test(index)) {
    fail('index.html missing sitemap link rel');
  } else {
    ok('index.html links to sitemap');
  }
}

const SAMPLE_SITEMAP_LINK = [
  'about/index.html',
  'buy/index.html',
  'skye-summit-master-plan/index.html',
  'homes-for-sale-skye-summit/index.html',
];

let missingSitemapLink = 0;
for (const rel of SAMPLE_SITEMAP_LINK) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) {
    fail(`sample page missing for sitemap link check: ${rel}`);
    continue;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  if (!/rel=["']sitemap["']/i.test(html)) {
    fail(`missing sitemap link rel: ${rel}`);
    missingSitemapLink += 1;
  }
}
if (missingSitemapLink === 0) {
  ok('sample indexable pages link to sitemap');
}

let invalidProductLikeSchema = 0;
for (const filePath of listHtmlFiles(root)) {
  const rel = path.relative(root, filePath);
  if (SKIP_HTML.has(rel)) continue;

  const html = fs.readFileSync(filePath, 'utf8');
  const scriptRe =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRe.exec(html)) !== null) {
    const openTag = match[0].slice(0, match[0].indexOf('>') + 1);
    if (hasKeepAttr(openTag)) continue;

    let data;
    try {
      data = JSON.parse(match[1].trim());
    } catch {
      continue;
    }

    const type = data['@type'];
    const types = Array.isArray(type) ? type : type ? [type] : [];

    if (types.includes('Service') && !data['@id']) {
      const hasOffer = Boolean(data.offers);
      const hasReview = Boolean(data.review);
      const hasRating = Boolean(data.aggregateRating);
      if (!hasOffer && !hasReview && !hasRating) {
        fail(`Service schema missing offers/review/aggregateRating (GSC Product snippets): ${rel}`);
        invalidProductLikeSchema += 1;
      }
    }

    if (types.includes('LocalBusiness') && !data['@id']) {
      fail(`duplicate LocalBusiness without @id (use hyperlocal @graph): ${rel}`);
      invalidProductLikeSchema += 1;
    }
  }
}

if (invalidProductLikeSchema === 0) {
  ok('no invalid standalone Service/LocalBusiness JSON-LD');
}

// JSON-LD SearchAction templates historically caused GSC "Page with redirect"
let searchActionHits = 0;
for (const filePath of listHtmlFiles(root)) {
  const rel = path.relative(root, filePath);
  if (SKIP_HTML.has(rel)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const scriptRe =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRe.exec(html)) !== null) {
    if (/SearchAction/i.test(match[1]) || /\?s=\{search_term_string\}/i.test(match[1])) {
      fail(`JSON-LD SearchAction / ?s= template must not appear: ${rel}`);
      searchActionHits += 1;
      break;
    }
  }
}
if (searchActionHits === 0) {
  ok('no JSON-LD SearchAction / ?s= templates');
}

// Legacy ?s= must be handled by Edge Middleware (vercel.json preserves query
// and previously looped /search?s= → /search?s=).
const middlewarePath = path.join(root, 'middleware.js');
if (!fs.existsSync(middlewarePath)) {
  fail('middleware.js missing (required to strip legacy ?s= query)');
} else {
  const mw = fs.readFileSync(middlewarePath, 'utf8');
  if (!/searchParams\.has\(\s*['"]s['"]\s*\)/.test(mw)) {
    fail('middleware.js must redirect requests that include ?s=');
  } else if (!/www\.skyesummithomes\.com\/search/.test(mw)) {
    fail('middleware.js must redirect ?s= URLs to www /search');
  } else {
    ok('middleware.js strips legacy ?s= to clean /search');
  }
}

const vercelPath = path.join(root, 'vercel.json');
if (fs.existsSync(vercelPath)) {
  const vercel = fs.readFileSync(vercelPath, 'utf8');
  // Guard against reintroducing the preserve-query loop on /search
  if (
    /"source":\s*"\/search"[\s\S]*?"key":\s*"s"/i.test(vercel) ||
    /"key":\s*"s"[\s\S]*?"destination":\s*"[^"]*\/search"/i.test(vercel)
  ) {
    fail(
      'vercel.json must not redirect ?s= via redirects (preserves query → 308 loop); use middleware.js'
    );
  } else {
    ok('vercel.json has no looping ?s= redirects');
  }
}

process.exit(failed > 0 ? 1 : 0);
