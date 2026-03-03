const CACHE_NAME = 'me-leva-v1';

// Instala o Service Worker e limpa caches antigos
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Essencial para o Chrome liberar o botão de "Instalar"
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return new Response("Você está offline, mas o app continua tentando conectar.");
        })
    );
});
