#!/usr/bin/env node
/**
 * Quick pre-flight checks for Google Search Console readiness (CI / local).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const SITE = 'https://www.skyesummithomes.com';
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

process.exit(failed > 0 ? 1 : 0);
