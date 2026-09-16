'use strict';

/**
 * Cloudflare Images (hosted) — public delivery constants.
 *
 * Docs (2026-04-21): https://developers.cloudflare.com/images/optimization/hosted-images/serve-uploaded-images/
 * URL: https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/<VARIANT_NAME>
 *
 * Account hash is public (it appears in every delivery URL). Git `/images/` is the origin backup.
 */

const ACCOUNT_ID = '2cc579c1ec9e426ed585e933ebf4753b';
const ACCOUNT_HASH = 'byE6BTe9lNqo21V57n4aPQ';
const DELIVERY_HOST = 'https://imagedelivery.net';
const DEFAULT_VARIANT = 'public';

function customIdFromGitPath(gitPath) {
  const normalized = String(gitPath || '')
    .replace(/\\/g, '/')
    .replace(/^\//, '');
  return normalized
    .replace(/^images\//, '')
    .replace(/\.(jpe?g|png|webp)$/i, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-');
}

function deliveryUrl(imageId, variant) {
  const id = String(imageId || '').replace(/^\/+|\/+$/g, '');
  const name = variant || DEFAULT_VARIANT;
  return `${DELIVERY_HOST}/${ACCOUNT_HASH}/${id}/${name}`;
}

module.exports = {
  ACCOUNT_ID,
  ACCOUNT_HASH,
  DELIVERY_HOST,
  DEFAULT_VARIANT,
  customIdFromGitPath,
  deliveryUrl,
};
