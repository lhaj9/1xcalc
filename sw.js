const CACHE_NAME = 'arb-calc-pwa-v21';
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
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
