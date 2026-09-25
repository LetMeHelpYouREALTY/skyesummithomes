'use strict';

const IMAGE_DELIVERY_ORIGIN = 'https://imagedelivery.net';
const MAPS_API_ORIGIN = 'https://maps.googleapis.com';
const MAPS_STATIC_ORIGIN = 'https://maps.gstatic.com';

const IMAGE_DELIVERY_HINT_RE =
  /\s*<link rel="(?:preconnect|dns-prefetch)" href="https:\/\/imagedelivery\.net"[^>]*>\s*/gi;
const MAPS_HINT_RE =
  /\s*<link rel="(?:preconnect|dns-prefetch)" href="https:\/\/maps\.(?:googleapis|gstatic)\.com"[^>]*>\s*/gi;

function dnsPrefetch(href) {
  return `<link rel="dns-prefetch" href="${href}">`;
}

function preconnect(href) {
  return `<link rel="preconnect" href="${href}" crossorigin>`;
}

function imageDeliveryHintTags(opts = {}) {
  const tags = [dnsPrefetch(IMAGE_DELIVERY_ORIGIN)];
  if (opts.preconnect) {
    tags.push(preconnect(IMAGE_DELIVERY_ORIGIN));
  }
  return tags.join('\n    ');
}

function mapsHintTags(opts = {}) {
  const tags = [
    dnsPrefetch(MAPS_API_ORIGIN),
    dnsPrefetch(MAPS_STATIC_ORIGIN),
  ];
  if (opts.preconnect) {
    tags.push(preconnect(MAPS_API_ORIGIN));
  }
  return tags.join('\n    ');
}

function hasHostedImageDeliveryUrl(html) {
  return /https:\/\/imagedelivery\.net\/[^\s"'<>]+\/[^\s"'<>]+/i.test(
    String(html || '')
  );
}

function stripHints(html, re) {
  return String(html || '').replace(re, '\n');
}

function insertAfterCanonicalOrHead(html, tags) {
  if (!tags) return html;
  if (/<link rel="canonical"/i.test(html)) {
    return html.replace(
      /<link rel="canonical"[^>]*>/i,
      (m) => `${m}\n    ${tags}`
    );
  }
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `    ${tags}\n</head>`);
  }
  return html;
}

function ensureImageDeliveryHints(html, opts = {}) {
  const tags = imageDeliveryHintTags(opts);
  IMAGE_DELIVERY_HINT_RE.lastIndex = 0;
  const existing = html.match(IMAGE_DELIVERY_HINT_RE) || [];
  if (html.includes(tags) && existing.length === (opts.preconnect ? 2 : 1)) {
    return html;
  }
  IMAGE_DELIVERY_HINT_RE.lastIndex = 0;
  return insertAfterCanonicalOrHead(
    stripHints(html, IMAGE_DELIVERY_HINT_RE),
    tags
  );
}

function ensureMapsHints(html, opts = {}) {
  const tags = mapsHintTags(opts);
  MAPS_HINT_RE.lastIndex = 0;
  const existing = html.match(MAPS_HINT_RE) || [];
  if (html.includes(tags) && existing.length === (opts.preconnect ? 3 : 2)) {
    return html;
  }
  MAPS_HINT_RE.lastIndex = 0;
  return insertAfterCanonicalOrHead(stripHints(html, MAPS_HINT_RE), tags);
}

module.exports = {
  IMAGE_DELIVERY_ORIGIN,
  MAPS_API_ORIGIN,
  MAPS_STATIC_ORIGIN,
  dnsPrefetch,
  preconnect,
  imageDeliveryHintTags,
  mapsHintTags,
  ensureImageDeliveryHints,
  ensureMapsHints,
  hasHostedImageDeliveryUrl,
};
