// Background Service Worker for LMexpress Extension
// Handles cross-origin requests that are blocked in content scripts

/* Only Legend Mod's own hosts can be fetched through this worker. */
const ALLOWED_HOSTS = ['www.legendmod.ml', 'legendmod.ml', 'jimboy3100.github.io'];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'fetch') {
        let host = '';
        try { host = new URL(request.url).hostname; } catch (e) { }
        if (!/^https:\/\//i.test(String(request.url)) || ALLOWED_HOSTS.indexOf(host) < 0) {
            sendResponse({ error: 'blocked host: ' + host });
            return false;
        }
        fetch(request.url, request.options)
            .then(response => response.text().then(data => sendResponse({ status: response.status, data })))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Keep the message channel open for sendResponse
    }
});
