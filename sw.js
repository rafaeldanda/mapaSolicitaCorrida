const CACHE_NAME = "meleva-v2"; // muda versão sempre

self.addEventListener("install", event => {
self.skipWaiting(); // ativa novo SW imediatamente
});

self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys => {
return Promise.all(
keys.map(key => {
if (key !== CACHE_NAME) {
return caches.delete(key);
}
})
);
})
);

```
self.clients.claim(); // assume controle imediato
```

});

self.addEventListener("fetch", event => {
event.respondWith(fetch(event.request));
});
