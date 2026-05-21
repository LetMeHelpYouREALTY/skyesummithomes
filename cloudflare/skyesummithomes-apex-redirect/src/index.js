/**
 * 301 redirect apex (skyesummithomes.com) → www for GSC / indexing.
 * Route: skyesummithomes.com/*
 */
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname === 'skyesummithomes.com') {
      url.hostname = 'www.skyesummithomes.com';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }
    return fetch(request);
  },
};
