const CACHE_NAME = 'fastshark-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/favicon.ico',
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  
  if (!url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

  
      return fetch(event.request)
        .then((response) => {

          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));

          return response;
        })
        .catch(() => caches.match('/index.html'))
    })
  );
});