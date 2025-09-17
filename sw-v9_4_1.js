// sw-v9_4_1.js — offline precache + network-first HTML; scoped to /Regicide/
const CACHE = 'ryans-regicide-v9_4_1';
const ASSETS = [
  '/Regicide/index.html',
  '/Regicide/manifest.webmanifest',
  '/Regicide/icons/icon-192.png',
  '/Regicide/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k)))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isNav = req.mode === 'navigate' ||
                (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'));
  if (isNav) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => res)
        .catch(() => caches.match('/Regicide/index.html'))
    );
    return;
  }
  event.respondWith(caches.match(req).then((c) => c || fetch(req)));
});
