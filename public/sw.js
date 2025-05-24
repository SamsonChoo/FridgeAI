const CACHE_NAME = 'smart-fridge-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Check if the request is for an API route
  if (requestUrl.pathname.startsWith('/api/')) {
    // Network-first strategy for API routes
    event.respondWith(
      fetch(event.request)
        .then(async (response) => {
          // Cache the successful network response, but ONLY if it's a GET request
          if (response.ok && event.request.method === 'GET') {
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, response.clone());
          }
          return response; // Always return the network response
        })
        .catch(async () => {
          // Fallback to cache if network fails (for GET requests only)
          if (event.request.method === 'GET') { // Only fallback to cache for GET requests
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
              return cachedResponse;
            }
          }
          // If network fails for non-GET or no cache for GET, rethrow or return a specific response
          throw new Error('Network request failed and no cache available.');
        })
    );
  } else {
    // Cache-first strategy for other assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Only cache GET requests for static assets
              if (event.request.method === 'GET') {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }

              return response;
            });
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
}); 