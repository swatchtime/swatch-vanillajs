// service-worker.js
const cacheName = 'swatch-time-v1';
const filesToCache = [
  '/free/swatch/',
  '/free/swatch/index.html',
  '/free/swatch/swatch.css',
  '/free/swatch/swatch.js',
  '/free/swatch/beat-logo.jpg',
  '/free/swatch/apple-touch-icon.png',
  '/free/swatch/favicon-32x32.png',
  '/free/swatch/favicon-16x16.png',
  '/free/swatch/site.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => cache.addAll(filesToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});