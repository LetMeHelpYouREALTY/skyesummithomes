'use strict';

/**
 * Cloudflare Images delivery with git (`/images/...`) as backup.
 *
 * Primary (hosted Images, after upload):
 *   https://imagedelivery.net/byE6BTe9lNqo21V57n4aPQ/<id>/public
 *   Cloudflare picks AVIF/WebP from Accept headers.
 *
 * Fallback (not yet uploaded): git paths on Vercel.
 * Optional Worker transforms: CLOUDFLARE_IMAGES_ENABLED=1 → images.skyesummithomes.com
 *   (orange-cloud OK — not the Vercel www host).
 */

const path = require('path');
const fs = require('fs');
const {
  ACCOUNT_HASH,
  DEFAULT_VARIANT,
  customIdFromGitPath,
  deliveryUrl,
} = require('./cloudflare-images');

const GIT_ORIGIN = 'https://www.skyesummithomes.com';
const DEFAULT_CF_HOST = 'https://images.skyesummithomes.com';

function loadIdMap() {
  const file = path.join(__dirname, 'cloudflare-image-ids.json');
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return {};
  }
}

function normalizeGitPath(gitPath) {
  if (!gitPath) return gitPath;
  if (/^https?:\/\//i.test(gitPath)) return gitPath;
  return gitPath.startsWith('/') ? gitPath : `/${gitPath}`;
}

function hostedId(gitPath) {
  const normalized = normalizeGitPath(gitPath);
  if (!normalized || /^https?:\/\//i.test(normalized)) return null;
  const ids = loadIdMap();
  return ids[normalized] || ids[normalized.replace(/^\//, '')] || null;
}

function accountHash() {
  return process.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || ACCOUNT_HASH;
}

function workerEnabled() {
  return process.env.CLOUDFLARE_IMAGES_ENABLED === '1';
}

function cfHost() {
  return (process.env.CLOUDFLARE_IMAGES_HOST || DEFAULT_CF_HOST).replace(/\/$/, '');
}

function hostedUrl(gitPath, variant) {
  const id = hostedId(gitPath);
  if (!id) return null;
  const hash = accountHash();
  if (!hash) return null;
  return deliveryUrl(id, variant || DEFAULT_VARIANT);
}

function isHosted(gitPath) {
  return Boolean(hostedUrl(gitPath));
}

/**
 * @param {string} gitPath e.g. /images/hero/sunset-home.jpg
 * @param {{ width?: number, variant?: string, quality?: number }} [opts]
 */
function cdnUrl(gitPath, opts = {}) {
  if (!gitPath) return gitPath;
  if (/^https?:\/\//i.test(gitPath)) return gitPath;
  const normalized = normalizeGitPath(gitPath);

  const hosted = hostedUrl(normalized, opts.variant);
  if (hosted) return hosted;

  if (!workerEnabled()) return normalized;

  const width = opts.width || 1600;
  const quality = opts.quality || 80;
  return `${cfHost()}${normalized}?w=${width}&q=${quality}`;
}

function originUrl(gitPath) {
  const normalized = normalizeGitPath(gitPath);
  return `${GIT_ORIGIN}${normalized}`;
}

module.exports = {
  GIT_ORIGIN,
  DEFAULT_CF_HOST,
  ACCOUNT_HASH,
  customIdFromGitPath,
  hostedId,
  hostedUrl,
  isHosted,
  workerEnabled,
  cfEnabled: workerEnabled,
  cfHost,
  cdnUrl,
  originUrl,
};
