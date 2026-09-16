#!/usr/bin/env node
/**
 * Upload git-backed images to Cloudflare hosted Images and ensure variants exist.
 *
 * Hosted path (not zone transformations): git originals → Images storage.
 * www/apex stay DNS-only on Vercel.
 *
 * Docs:
 * - Upload API: POST /accounts/{account_id}/images/v1
 * - File vs URL: https://developers.cloudflare.com/images/storage/upload-images/upload-url/
 * - Custom IDs: https://developers.cloudflare.com/images/storage/upload-images/upload-custom-path/
 * - Variants: https://developers.cloudflare.com/images/optimization/hosted-images/create-variants/
 * - Batch: https://developers.cloudflare.com/images/storage/upload-images/images-batch/
 * - Delivery: https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/<VARIANT>
 *
 * Requires CLOUDFLARE_API_TOKEN (Images Write). Git /images/ stays the origin backup.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  ACCOUNT_ID,
  ACCOUNT_HASH,
  HOSTED_MAX_BYTES,
  VARIANTS,
  customIdFromGitPath,
  deliveryUrl,
} = require('../lib/cloudflare-images');

const root = path.join(__dirname, '..');
const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || ACCOUNT_ID;
const mapPath = path.join(root, 'lib/cloudflare-image-ids.json');
const GIT_ORIGIN = 'https://www.skyesummithomes.com';
const API = `https://api.cloudflare.com/client/v4/accounts/${accountId}`;

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

function curlJson(args) {
  const raw = execFileSync('curl', ['-sS', ...args], {
    encoding: 'utf8',
    maxBuffer: 12 * 1024 * 1024,
  });
  try {
    return JSON.parse(raw);
  } catch {
    return { success: false, errors: [{ message: raw.slice(0, 400) }] };
  }
}

function authArgs(bearer) {
  return ['-H', `Authorization: Bearer ${bearer}`];
}

function errorText(json) {
  return JSON.stringify(json.errors || json.messages || json);
}

const files = listImages();
console.log(
  `sync-cloudflare-images: ${files.length} git originals; delivery https://imagedelivery.net/${ACCOUNT_HASH}/<id>/<variant>`
);

if (!token) {
  console.log(
    'CLOUDFLARE_API_TOKEN unset — not uploading. Git /images/ remains the public origin backup.\n' +
      'Create a token with Images Write, then: CLOUDFLARE_API_TOKEN=... npm run images:cloudflare'
  );
  process.exit(0);
}

function alreadyThere(err) {
  return /already exists|duplicate|variant already/i.test(err);
}

function ensureVariants() {
  let created = 0;
  let existed = 0;
  for (const spec of Object.values(VARIANTS)) {
    if (spec.builtin) {
      existed += 1;
      continue;
    }
    const json = curlJson([
      '-X',
      'POST',
      `${API}/images/v1/variants`,
      ...authArgs(token),
      '-H',
      'Content-Type: application/json',
      '--data',
      JSON.stringify({
        id: spec.id,
        options: spec.options,
        neverRequireSignedURLs: spec.neverRequireSignedURLs !== false,
      }),
    ]);
    if (json.success) {
      created += 1;
      console.log(`variant ${spec.id}: created`);
      continue;
    }
    const err = errorText(json);
    if (alreadyThere(err)) {
      existed += 1;
      continue;
    }
    console.warn(`variant ${spec.id}: ${err.slice(0, 280)}`);
  }
  console.log(`sync-cloudflare-images: variants created ${created}, existed ${existed}`);
}

function enableFlexibleVariants() {
  const json = curlJson([
    '-X',
    'PATCH',
    `${API}/images/v1/config`,
    ...authArgs(token),
    '-H',
    'Content-Type: application/json',
    '--data',
    JSON.stringify({ flexible_variants: true }),
  ]);
  if (json.success) {
    console.log('sync-cloudflare-images: flexible variants enabled (w=960,fit=scale-down)');
    return;
  }
  console.warn(`flexible variants: ${errorText(json).slice(0, 280)}`);
}

function batchEndpoint() {
  const json = curlJson([...authArgs(token), `${API}/images/v1/batch_token`]);
  if (json.success && json.result && json.result.token) {
    console.log('sync-cloudflare-images: using batch.imagedelivery.net (rate-limit bypass)');
    return {
      url: 'https://batch.imagedelivery.net/images/v1',
      bearer: json.result.token,
    };
  }
  return {
    url: `${API}/images/v1`,
    bearer: token,
  };
}

function listRemote(filesById) {
  const found = {};
  let page = 1;
  for (;;) {
    const json = curlJson([
      ...authArgs(token),
      `${API}/images/v1?page=${page}&per_page=100`,
    ]);
    const images = (json.result && json.result.images) || [];
    if (!json.success) {
      console.warn(`list images: ${errorText(json).slice(0, 280)}`);
      break;
    }
    for (const image of images) {
      const id = image.id;
      if (!id) continue;
      const gitPath = image.meta && (image.meta.gitPath || image.meta.git_path);
      if (gitPath) {
        const key = gitPath.startsWith('/') ? gitPath : `/${gitPath}`;
        found[key] = id;
        continue;
      }
      if (filesById[id]) found[filesById[id]] = id;
    }
    if (images.length < 100) break;
    page += 1;
    if (page > 50) break;
  }
  return found;
}

ensureVariants();
enableFlexibleVariants();

const filesById = {};
for (const file of files) {
  filesById[customIdFromGitPath(webPath(file))] = webPath(file);
}

let map = { ...listRemote(filesById), ...loadMap() };
const upload = batchEndpoint();
let uploaded = 0;
let existed = 0;
let failed = 0;

for (const file of files) {
  const key = webPath(file);
  const id = customIdFromGitPath(key);
  const sourceUrl = `${GIT_ORIGIN}${key}`;
  const stat = fs.statSync(file);

  if (map[key] === id) {
    existed += 1;
    continue;
  }

  if (stat.size > HOSTED_MAX_BYTES) {
    failed += 1;
    console.warn(`skip ${key}: ${stat.size} bytes exceeds hosted 10 MB limit`);
    continue;
  }

  const metadata = JSON.stringify({ gitPath: key });
  let json = curlJson([
    '-X',
    'POST',
    upload.url,
    ...authArgs(upload.bearer),
    '-F',
    `file=@${file}`,
    '-F',
    `id=${id}`,
    '-F',
    'requireSignedURLs=false',
    '-F',
    `metadata=${metadata}`,
  ]);

  if (!json.success) {
    const err = errorText(json);
    if (alreadyThere(err)) {
      map[key] = id;
      existed += 1;
      saveMap(map);
      console.log(`exists ${key} → ${deliveryUrl(id)}`);
      continue;
    }
    json = curlJson([
      '-X',
      'POST',
      upload.url,
      ...authArgs(upload.bearer),
      '-F',
      `url=${sourceUrl}`,
      '-F',
      `id=${id}`,
      '-F',
      'requireSignedURLs=false',
      '-F',
      `metadata=${metadata}`,
    ]);
  }

  if (json.success && json.result && json.result.id) {
    map[key] = json.result.id;
    uploaded += 1;
    saveMap(map);
    console.log(`uploaded ${key} → ${deliveryUrl(json.result.id, 'hero')}`);
    continue;
  }

  const errText = errorText(json);
  if (alreadyThere(errText)) {
    map[key] = id;
    existed += 1;
    saveMap(map);
    console.log(`exists ${key} → ${deliveryUrl(id)}`);
    continue;
  }
  failed += 1;
  console.warn(`skip ${key}: ${errText.slice(0, 280)}`);
}

saveMap(map);
console.log(
  `sync-cloudflare-images: uploaded ${uploaded}, existed ${existed}, failed ${failed}, map ${Object.keys(map).length} ids`
);
