/**
 * Service Worker for Legend Mod PWA
 * Strategy: Network-first with offline fallback
 * - Always tries network first (game needs live WebSocket)
 * - Caches static assets for faster subsequent loads
 * - Works on both Android (TWA/PWA) and iOS (Add to Home Screen)
 */

var CACHE_NAME = 'legendmod-v1';
var PRECACHE = [
    '/play.html',
    '/banners/icon128.png',
    '/banners/icon48.png',
    '/banners/profilepic_guest.png',
    '/LMexpress/master.css',
    '/css/ogario.v3.css'
];

/* Install — precache essential assets */
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(PRECACHE);
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

/* Activate — clean old caches */
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(
                names.filter(function (n) { return n !== CACHE_NAME; })
                    .map(function (n) { return caches.delete(n); })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

/* Fetch — network-first strategy */
self.addEventListener('fetch', function (e) {
    /* Don't cache WebSocket, analytics, or external API calls */
    if (e.request.url.indexOf('ws://') === 0 ||
        e.request.url.indexOf('wss://') === 0 ||
        e.request.url.indexOf('google-analytics') > -1 ||
        e.request.url.indexOf('recaptcha') > -1 ||
        e.request.url.indexOf('discord.com') > -1 ||
        e.request.url.indexOf('googleapis.com') > -1) {
        return;
    }

    e.respondWith(
        fetch(e.request).then(function (response) {
            /* Cache successful GET responses */
            if (response.ok && e.request.method === 'GET') {
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(e.request, clone);
                });
            }
            return response;
        }).catch(function () {
            /* Network failed — try cache */
            return caches.match(e.request).then(function (cached) {
                if (cached) return cached;
                /* Fallback for navigation requests */
                if (e.request.mode === 'navigate') {
                    return caches.match('/play.html');
                }
            });
        })
    );
});
