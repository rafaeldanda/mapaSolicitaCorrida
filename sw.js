const CACHE_NAME = 'meleva-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Essencial para o Chrome habilitar o botão de instalação
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response("Offline");
        })
    );
});
