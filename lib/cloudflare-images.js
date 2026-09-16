'use strict';

/**
 * Cloudflare Images (hosted) — public delivery constants.
 *
 * Path chosen: "Use Images to host your assets" (not zone transformations).
 * www/apex stay DNS-only on Vercel. Git `/images/` is the origin backup.
 *
 * Docs (2026-09):
 * - Overview: https://developers.cloudflare.com/images/
 * - Serve: https://developers.cloudflare.com/images/optimization/hosted-images/serve-uploaded-images/
 * - Variants: https://developers.cloudflare.com/images/optimization/hosted-images/create-variants/
 * - Upload via URL: https://developers.cloudflare.com/images/storage/upload-images/upload-url/
 * - Custom IDs: https://developers.cloudflare.com/images/storage/upload-images/upload-custom-path/
 *
 * Delivery: https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/<VARIANT_NAME>
 * Account hash is public (it appears in every delivery URL).
 */

const ACCOUNT_ID = '2cc579c1ec9e426ed585e933ebf4753b';
const ACCOUNT_HASH = 'byE6BTe9lNqo21V57n4aPQ';
const DELIVERY_HOST = 'https://imagedelivery.net';
const DEFAULT_VARIANT = 'public';
const HOSTED_MAX_BYTES = 10 * 1024 * 1024;

/**
 * Named variants created at sync time. `public` is the account default (full original).
 * Fit: scale-down for in-page photos (no unexpected crop); cover only for OG cards.
 */
const VARIANTS = {
  public: { id: 'public', builtin: true },
  avatar: {
    id: 'avatar',
    options: { fit: 'cover', metadata: 'none', width: 240, height: 240 },
    neverRequireSignedURLs: true,
  },
  w960: {
    id: 'w960',
    options: { fit: 'scale-down', metadata: 'none', width: 960 },
    neverRequireSignedURLs: true,
  },
  card: {
    id: 'card',
    options: { fit: 'scale-down', metadata: 'none', width: 900 },
    neverRequireSignedURLs: true,
  },
  section: {
    id: 'section',
    options: { fit: 'scale-down', metadata: 'none', width: 1280 },
    neverRequireSignedURLs: true,
  },
  hero: {
    id: 'hero',
    options: { fit: 'scale-down', metadata: 'none', width: 1600 },
    neverRequireSignedURLs: true,
  },
  og: {
    id: 'og',
    options: { fit: 'cover', metadata: 'none', width: 1200, height: 630 },
    neverRequireSignedURLs: true,
  },
};

function customIdFromGitPath(gitPath) {
  const normalized = String(gitPath || '')
    .replace(/\\/g, '/')
    .replace(/^\//, '');
  return normalized
    .replace(/^images\//, '')
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-');
}

function encodeCustomId(imageId) {
  return String(imageId || '')
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
}

function deliveryUrl(imageId, variant, hash) {
  const id = encodeCustomId(imageId);
  const name = String(variant || DEFAULT_VARIANT).replace(/^\/+|\/+$/g, '');
  const accountHash = hash || ACCOUNT_HASH;
  return `${DELIVERY_HOST}/${accountHash}/${id}/${name}`;
}

function flexibleVariant(width, extra) {
  const w = Math.max(1, Number(width) || 1600);
  const parts = [`w=${w}`, 'fit=scale-down'];
  if (extra && typeof extra === 'object') {
    for (const [key, value] of Object.entries(extra)) {
      if (value === undefined || value === null || value === '') continue;
      parts.push(`${key}=${value}`);
    }
  }
  return parts.join(',');
}

function variantForSize(opts = {}) {
  if (opts.variant) return opts.variant;
  if (opts.flexible && opts.width) return flexibleVariant(opts.width);
  const w = Number(opts.width) || 0;
  if (!w) return DEFAULT_VARIANT;
  if (w <= 240) return 'avatar';
  if (w <= 900) return 'card';
  if (w <= 960) return 'w960';
  if (w <= 1280) return 'section';
  if (w <= 1920) return 'hero';
  return DEFAULT_VARIANT;
}

module.exports = {
  ACCOUNT_ID,
  ACCOUNT_HASH,
  DELIVERY_HOST,
  DEFAULT_VARIANT,
  HOSTED_MAX_BYTES,
  VARIANTS,
  customIdFromGitPath,
  encodeCustomId,
  deliveryUrl,
  flexibleVariant,
  variantForSize,
};
