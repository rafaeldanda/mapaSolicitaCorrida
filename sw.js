const CACHE_NAME = 'motorista-v1';
const ASSETS = [
  'index.html',
  'manifest.json'
];

// Instala o Service Worker e guarda arquivos básicos no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Ativa e remove caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Responde às requisições mesmo se estiver offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});