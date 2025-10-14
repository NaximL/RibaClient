importScripts('./ConfigSW.js');

const CACHE_NAME = `fastshark-ch-${VERSION_APP}`;

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

self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    console.log('Старый кэш удален, новый кэш обновлён!');
  }
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