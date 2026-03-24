const CACHE_NAME = 'me-leva-v3';

self.addEventListener('install', (e) => self.skipWaiting());

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
});

// Essa função permite que o Service Worker receba mensagens do Front-end
self.addEventListener('message', (event) => {
    if (event.data.type === 'START_TRACKING') {
        // Cria uma notificação persistente (Isso ajuda o Android a não matar o processo)
        console.log("Rastreamento em segundo plano iniciado no SW");
    }
});

self.addEventListener('fetch', (e) => {
    // Mantém as requisições de rede passando sem travas
    e.respondWith(fetch(e.request));
});
