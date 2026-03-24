const CACHE_NAME = 'me-leva-v1';

self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

// Intercepta falhas de rede e mantém o app funcional
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            return new Response("Offline ou erro de conexão");
        })
    );
});
