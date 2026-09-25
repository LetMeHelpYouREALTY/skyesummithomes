#!/usr/bin/env node
/**
 * Assert Cloudflare hosted Images URL construction (no API token required).
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const cf = require('../lib/cloudflare-images');
const cdn = require('../lib/image-cdn');

assert.strictEqual(cf.ACCOUNT_HASH, 'byE6BTe9lNqo21V57n4aPQ');
assert.strictEqual(cf.ACCOUNT_ID, '2cc579c1ec9e426ed585e933ebf4753b');
assert.strictEqual(
  cf.customIdFromGitPath('/images/hero/sunset-home.jpg'),
  'hero-sunset-home'
);
assert.strictEqual(
  cf.deliveryUrl('hero-sunset-home', 'hero'),
  'https://imagedelivery.net/byE6BTe9lNqo21V57n4aPQ/hero-sunset-home/hero'
);
assert.strictEqual(cf.variantForSize({ width: 120 }), 'avatar');
assert.strictEqual(cf.variantForSize({ width: 900 }), 'card');
assert.strictEqual(cf.variantForSize({ width: 960 }), 'w960');
assert.strictEqual(cf.variantForSize({ width: 1280 }), 'section');
assert.strictEqual(cf.variantForSize({ width: 1600 }), 'hero');
assert.strictEqual(cf.variantForSize({}), 'public');
assert.strictEqual(cf.flexibleVariant(960), 'w=960,fit=scale-down');
assert.strictEqual(
  cdn.cdnUrl('/images/hero/sunset-home.jpg', { width: 1600 }),
  '/images/hero/sunset-home.jpg'
);
assert.strictEqual(cdn.isHosted('/images/hero/sunset-home.jpg'), false);

const mapPath = path.join(__dirname, '../lib/cloudflare-image-ids.json');
const orig = fs.readFileSync(mapPath, 'utf8');
try {
  fs.writeFileSync(
    mapPath,
    `${JSON.stringify({ '/images/hero/sunset-home.jpg': 'hero-sunset-home' }, null, 2)}\n`
  );
  delete require.cache[require.resolve('../lib/image-cdn')];
  const hosted = require('../lib/image-cdn');
  assert.strictEqual(hosted.isHosted('/images/hero/sunset-home.jpg'), true);
  assert.strictEqual(
    hosted.cdnUrl('/images/hero/sunset-home.jpg', { width: 1600 }),
    'https://imagedelivery.net/byE6BTe9lNqo21V57n4aPQ/hero-sunset-home/hero'
  );
  assert.strictEqual(
    hosted.hostedSrcset('/images/hero/sunset-home.jpg', [960, 1600]),
    'https://imagedelivery.net/byE6BTe9lNqo21V57n4aPQ/hero-sunset-home/w960 960w, https://imagedelivery.net/byE6BTe9lNqo21V57n4aPQ/hero-sunset-home/hero 1600w'
  );
  assert.strictEqual(
    hosted.cdnUrl('/images/hero/sunset-home.webp', { width: 1600 }),
    'https://imagedelivery.net/byE6BTe9lNqo21V57n4aPQ/hero-sunset-home/hero'
  );
} finally {
  fs.writeFileSync(mapPath, orig);
}

const map = JSON.parse(orig);
const mapped = Object.keys(map).length;
console.log(
  `assert-cloudflare-images: ok (map ${mapped} ids; hosted HTML after CLOUDFLARE_API_TOKEN upload)`
);
