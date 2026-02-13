const CACHE_NAME = 'vvf-cs-v156';
const CORE = [
  './',
  './Modulo_CS_v156.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : Promise.resolve()))
    ).then(() => self.clients.claim())
  );
});

// Cache-first for same-origin; network fallback; navigation -> cached HTML
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./Modulo_CS_v156.html').then(r => r || fetch(req).catch(() => r))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(resp => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      return resp;
    }))
  );
});
