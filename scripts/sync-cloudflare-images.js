#!/usr/bin/env node
/**
 * Upload git-backed images to Cloudflare Images (optional).
 * Requires CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID.
 * Writes lib/cloudflare-image-ids.json so HTML can use imagedelivery.net.
 *
 * Docs: https://developers.cloudflare.com/images/upload-images/
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const token = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '2cc579c1ec9e426ed585e933ebf4753b';
const mapPath = path.join(root, 'lib/cloudflare-image-ids.json');

if (!token) {
  console.log(
    'sync-cloudflare-images: CLOUDFLARE_API_TOKEN unset — keeping git /images/ as origin. Worker on images.skyesummithomes.com can still resize those files.'
  );
  process.exit(0);
}

const IMAGE_DIRS = [
  path.join(root, 'images/hero'),
  path.join(root, 'images/sections'),
  path.join(root, 'images/features'),
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
  return out;
}

function customId(absPath) {
  const rel = path.relative(root, absPath).replace(/\\/g, '/');
  return rel.replace(/^images\//, '').replace(/\.(jpe?g|png|webp)$/i, '').replace(/[^a-zA-Z0-9._-]/g, '-');
}

function webPath(absPath) {
  return `/${path.relative(root, absPath).replace(/\\/g, '/')}`;
}

let map = {};
if (fs.existsSync(mapPath)) {
  try {
    map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  } catch {
    map = {};
  }
}

const files = listImages();
let uploaded = 0;
for (const file of files) {
  const id = customId(file);
  const key = webPath(file);
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`;
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
        `file=@${file}`,
        '-F',
        `id=${id}`,
      ],
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    const json = JSON.parse(raw);
    if (json.success && json.result && json.result.id) {
      map[key] = json.result.id;
      uploaded += 1;
      console.log(`uploaded ${key} → ${json.result.id}`);
    } else {
      const already = JSON.stringify(json.errors || json).includes('already exists');
      if (already) {
        map[key] = id;
        console.log(`exists ${key} → ${id}`);
      } else {
        console.warn(`skip ${key}: ${raw.slice(0, 240)}`);
      }
    }
  } catch (err) {
    console.warn(`error ${key}: ${err.message}`);
  }
}

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2) + '\n');
console.log(`sync-cloudflare-images: ${uploaded} uploaded, map ${Object.keys(map).length} ids`);
