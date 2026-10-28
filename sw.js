/**
 * TradeMitra Service Worker — Modern Network-First PWA Engine
 * Auto-activates updates so phone PWA always runs latest code without reinstalling
 */
const CACHE_NAME = 'trademitra-app-v4';

self.addEventListener('install', (event) => {
  // Force new service worker to activate immediately without waiting for browser restart
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Delete any old caches immediately
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  // Claim all active PWA clients immediately
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let cloud APIs pass straight through to the network
  if (
    event.request.url.includes('firestore.googleapis.com') ||
    event.request.url.includes('firebase') ||
    event.request.url.includes('telegram.org') ||
    event.request.url.includes('/.netlify/') ||
    event.request.url.includes('yahoo.com') ||
    event.request.url.includes('query1.finance')
  ) {
    return;
  }

  // NETWORK-FIRST: Always try network first to get newest code.
  // Fall back to cache only when user is offline.
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
