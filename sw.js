/**
 * TradeMitra Service Worker — Modern Network-First PWA Engine
 * Auto-activates updates so phone PWA always runs latest code without reinstalling
 */
const CACHE_NAME = 'trademitra-app-v12';

// Core shell assets to pre-cache on install for offline functionality
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './app.css?v=20261030_v12',
  './app.js?v=20261030_v12',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Core asset pre-cache note:', err.message);
      });
    })
  );
  // Force new service worker to activate immediately without waiting for browser restart
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      // Claim all active PWA clients immediately after caches are cleaned
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // 1. Only intercept HTTP/HTTPS GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  if (!event.request.url.startsWith('http')) {
    return;
  }

  const url = event.request.url;

  // 2. Bypass cache for real-time cloud APIs, database calls, and Telegram
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebaseio.com') ||
    url.includes('identitytoolkit.googleapis.com') ||
    url.includes('securetoken.googleapis.com') ||
    url.includes('api.telegram.org') ||
    url.includes('/.netlify/functions/') ||
    url.includes('/api/quote') ||
    url.includes('/api/batch') ||
    url.includes('query1.finance.yahoo.com') ||
    url.includes('yahoo.com')
  ) {
    return;
  }

  // 3. NETWORK-FIRST STRATEGY:
  // Always attempt network first so updates, stock quotes, and latest code arrive immediately.
  // Fall back to cache only when the device is completely offline.
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful same-origin (basic) and CDN (cors) responses
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Offline fallback: check cache for requested resource
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // For navigation (page visit) when offline, return cached index.html
        if (event.request.mode === 'navigate') {
          const fallback = await caches.match('./index.html') || await caches.match('./');
          if (fallback) return fallback;
        }

        // Return standard 503 if both network and cache fail
        return new Response('Network unavailable (Offline)', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});
