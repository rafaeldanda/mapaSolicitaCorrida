self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    // O Chrome mobile exige que o fetch seja interceptado
    event.respondWith(
        fetch(event.request).catch(() => new Response("Offline"))
    );
});
