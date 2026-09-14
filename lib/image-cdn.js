'use strict';

/**
 * Cloudflare Images / Image Resizing URLs with git (`/images/...`) as backup.
 *
 * Production default: git paths served from Vercel.
 * When CLOUDFLARE_IMAGES_ENABLED=1, HTML points at images.skyesummithomes.com
 * (Cloudflare Worker, orange-cloud OK — this hostname is not the Vercel site).
 *
 * Hosted Images (optional): CLOUDFLARE_IMAGES_ACCOUNT_HASH + lib/cloudflare-image-ids.json
 * → https://imagedelivery.net/<hash>/<id>/public
 */

const path = require('path');
const fs = require('fs');

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

function cfEnabled() {
  return process.env.CLOUDFLARE_IMAGES_ENABLED === '1';
}

function cfHost() {
  return (process.env.CLOUDFLARE_IMAGES_HOST || DEFAULT_CF_HOST).replace(/\/$/, '');
}

function accountHash() {
  return process.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH || '';
}

/**
 * @param {string} gitPath e.g. /images/hero/sunset-home.jpg
 * @param {{ width?: number, variant?: string }} [opts]
 */
function cdnUrl(gitPath, opts = {}) {
  if (!gitPath) return gitPath;
  if (/^https?:\/\//i.test(gitPath)) return gitPath;
  const normalized = gitPath.startsWith('/') ? gitPath : `/${gitPath}`;
  if (!cfEnabled()) return normalized;

  const ids = loadIdMap();
  const hash = accountHash();
  const customId = ids[normalized];
  if (hash && customId) {
    const variant = opts.variant || 'public';
    return `https://imagedelivery.net/${hash}/${customId}/${variant}`;
  }

  const width = opts.width || 1600;
  const quality = opts.quality || 80;
  return `${cfHost()}${normalized}?w=${width}&q=${quality}`;
}

function originUrl(gitPath) {
  const normalized = gitPath.startsWith('/') ? gitPath : `/${gitPath}`;
  return `${GIT_ORIGIN}${normalized}`;
}

module.exports = {
  GIT_ORIGIN,
  DEFAULT_CF_HOST,
  cfEnabled,
  cfHost,
  cdnUrl,
  originUrl,
};
