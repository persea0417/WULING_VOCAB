// ===================================================================
// Service Worker — Cache-first for offline support
// ===================================================================

const CACHE_NAME = 'vocabmaster-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data/words.js',
  './modules/spaced-repetition.js',
  './modules/learning.js',
  './modules/quiz.js',
  './modules/stats.js',
  './modules/import.js',
  './modules/wordbook.js',
  './manifest.json'
];

// Install — cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new requests
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
