const CACHE_NAME = 'arb-calc-pwa-v44';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './README.md',
    './favicon.ico',
    './favicon.png',
    './icon-192.png',
    './icon-512.png',
    './apple-touch-icon.png',
    './icon-192.webp',
    './icon-512.webp',
    './css/variables.css',
    './css/base.css',
    './css/calculator.css',
    './css/slips.css',
    './css/matches.css',
    './css/modals.css',
    './css/style.css',
    './js/i18n.js',
    './js/storage.js',
    './js/calculator.js',
    './js/slips.js',
    './js/matches.js',
    './js/match-details.js',
    './js/calendar.js',
    './js/app.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // استراتيجية Network-First للملفات المحلية للتأكد من وصول التحديثات للهواتف فور النشر
    if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
