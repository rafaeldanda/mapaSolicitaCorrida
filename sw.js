self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Sem esse evento de fetch, o botão não aparece
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => new Response("Offline"))
    );
});
