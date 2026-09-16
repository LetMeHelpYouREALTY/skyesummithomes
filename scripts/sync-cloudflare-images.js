#!/usr/bin/env node
/**
 * Upload git-backed images to Cloudflare hosted Images.
 *
 * Docs:
 * - Upload API: POST /accounts/{account_id}/images/v1
 * - Custom IDs: https://developers.cloudflare.com/images/storage/upload-images/upload-custom-path/
 * - Delivery: https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/public
 *
 * Requires CLOUDFLARE_API_TOKEN (Images Write). Git /images/ stays the origin backup.
 * Prefers URL import from the live Vercel origin so Cloudflare fetches the git file.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  ACCOUNT_ID,
  ACCOUNT_HASH,
  customIdFromGitPath,
  deliveryUrl,
} = require('../lib/cloudflare-images');

const root = path.join(__dirname, '..');
const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID;
const mapPath = path.join(root, 'lib/cloudflare-image-ids.json');
const GIT_ORIGIN = 'https://www.skyesummithomes.com';

const IMAGE_DIRS = [
  path.join(root, 'images/hero'),
  path.join(root, 'images/sections'),
  path.join(root, 'images/features'),
  path.join(root, 'images/property'),
  path.join(root, 'images/brand'),
  path.join(root, 'images/agents'),
];

function listImages() {
  const out = [];
  for (const dir of IMAGE_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!/\.(jpe?g|png|webp)$/i.test(name)) continue;
      if (/-960\./.test(name)) continue;
      out.push(path.join(dir, name));
    }
  }
  return out.sort();
}

function webPath(absPath) {
  return `/${path.relative(root, absPath).replace(/\\/g, '/')}`;
}

function loadMap() {
  if (!fs.existsSync(mapPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  } catch {
    return {};
  }
}

function saveMap(map) {
  fs.writeFileSync(mapPath, `${JSON.stringify(map, null, 2)}\n`);
}

const files = listImages();
console.log(
  `sync-cloudflare-images: ${files.length} git originals; delivery https://imagedelivery.net/${ACCOUNT_HASH}/<id>/public`
);

if (!token) {
  console.log(
    'CLOUDFLARE_API_TOKEN unset — not uploading. Git /images/ remains the public origin backup.\n' +
      'Create a token with Images Write, then: CLOUDFLARE_API_TOKEN=... npm run images:cloudflare'
  );
  process.exit(0);
}

let map = loadMap();
let uploaded = 0;
let existed = 0;
let failed = 0;

for (const file of files) {
  const key = webPath(file);
  const id = customIdFromGitPath(key);
  const sourceUrl = `${GIT_ORIGIN}${key}`;
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;

  if (map[key] === id) {
    existed += 1;
    continue;
  }

  try {
    const raw = execFileSync(
      'curl',
      [
        '-sS',
        '-X',
        'POST',
        endpoint,
        '-H',
        `Authorization: Bearer ${token}`,
        '-F',
        `url=${sourceUrl}`,
        '-F',
        `id=${id}`,
        '-F',
        'requireSignedURLs=false',
      ],
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    const json = JSON.parse(raw);
    if (json.success && json.result && json.result.id) {
      map[key] = json.result.id;
      uploaded += 1;
      console.log(`uploaded ${key} → ${deliveryUrl(json.result.id)}`);
      continue;
    }
    const errText = JSON.stringify(json.errors || json);
    if (/already exists|duplicate/i.test(errText)) {
      map[key] = id;
      existed += 1;
      console.log(`exists ${key} → ${deliveryUrl(id)}`);
      continue;
    }
    failed += 1;
    console.warn(`skip ${key}: ${errText.slice(0, 280)}`);
  } catch (err) {
    failed += 1;
    console.warn(`error ${key}: ${err.message}`);
  }
}

saveMap(map);
console.log(
  `sync-cloudflare-images: uploaded ${uploaded}, existed ${existed}, failed ${failed}, map ${Object.keys(map).length} ids`
);
