// Service Worker for Skye Summit Real Estate Website
// Bump CACHE_* when shipping HTML/CSS changes users must see immediately.
const CACHE_NAME = 'skye-summit-v4';
const RUNTIME_CACHE = 'skye-summit-runtime-v4';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/sitemap.xml',
    '/robots.txt'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) =>
                cache.addAll(STATIC_ASSETS.map((url) => new Request(url, { cache: 'reload' })))
            )
            .catch(() => {})
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event — HTML: network-first (avoid stale homepage); other assets: cache-first
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') {
        return;
    }
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    const isNavigation =
        event.request.mode === 'navigate' || event.request.destination === 'document';

    if (isNavigation) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (response && response.status === 200 && response.type === 'basic') {
                        const copy = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
                    }
                    return response;
                })
                .catch(() =>
                    caches
                        .match(event.request)
                        .then((cached) => cached || caches.match('/index.html'))
                )
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request)
                .then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
        })
    );
});

