const CACHE_NAME = 'taskivo-cache-v3';
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('taskivo-cache-')).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
// Keep navigation and application requests network-first; never cache API or payment data.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(() => new Response('Taskivo is offline. Please reconnect and try again.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })));
});
