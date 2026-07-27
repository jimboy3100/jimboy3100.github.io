const CACHE_NAME = 'lm-static-v1';
const ASSETS_TO_CACHE = [
    'https://jimboy3100.github.io/jquery.min.js',
    'https://jimboy3100.github.io/protobuf.min.js',
    'https://code.jquery.com/ui/1.12.1/jquery-ui.js',
    'https://jimboy3100.github.io/bootstrap.min.js',
    'https://jimboy3100.github.io/bootstrap-colorpicker.min.js',
    'https://jimboy3100.github.io/toastr.min.js',
    'https://jimboy3100.github.io/switchery.min.js',
    'https://jimboy3100.github.io/rangeslider.min.js',
    'https://jimboy3100.github.io/perfect-scrollbar.jquery.min.js',
    'https://jimboy3100.github.io/Youtubeiframe_api.js',
    'https://jimboy3100.github.io/key-event.js',
    'https://jimboy3100.github.io/foggy.js',
    'https://jimboy3100.github.io/LanguagePackEnglish.js',
    'https://jimboy3100.github.io/LMexpress/LMexpress.sniff2.js',
    'https://jimboy3100.github.io/LMexpress/i18n.js',
    'https://jimboy3100.github.io/LMexpress/proto.decoder.js',
    'https://jimboy3100.github.io/ogario/ogario.v4.master.regionobj.js',
    'https://jimboy3100.github.io/ogario/ogario.v4.master.js',
    'https://jimboy3100.github.io/TweenMax.min.js',
    'https://jimboy3100.github.io/context-menu.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Stale-While-Revalidate Strategy for JS/CSS/Fonts
self.addEventListener('fetch', (event) => {
    const url = event.request.url;
    if (event.request.method !== 'GET') return;
    if (url.includes('socket') || url.includes('ws://') || url.includes('wss://') || url.includes('garix')) return;

    if (url.endsWith('.js') || url.endsWith('.css') || url.endsWith('.woff2') || url.includes('/ogario/') || url.includes('/LMexpress/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => cachedResponse);
                    return cachedResponse || fetchPromise;
                });
            })
        );
    }
});
