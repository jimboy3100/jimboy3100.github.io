// Background Service Worker for LMexpress Extension
// Fetches the Legend Mod pages for content.js (cross-origin requests are blocked in content scripts)
/*MIT License*/

/* Only these hosts are fetched, and only over https. Anything else is refused. */
const allowedHosts = ['www.legendmod.ml', 'jimboy3100.github.io'];
const requestTimeoutMs = 30000;

function isAllowedUrl(url) {
    try {
        const u = new URL(url);
        return u.protocol === 'https:' && allowedHosts.includes(u.hostname);
    } catch (e) {
        return false;
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (!request || request.type !== 'fetch') {
        return false;
    }
    /* Only this extension's own content script may ask */
    if (sender.id !== chrome.runtime.id) {
        sendResponse({ error: 'request not from this extension' });
        return false;
    }
    if (!isAllowedUrl(request.url)) {
        sendResponse({ error: 'refusing to fetch ' + request.url + ' (not https or not an allowed host)' });
        return false;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), requestTimeoutMs);

    fetch(request.url, { method: 'GET', signal: controller.signal })
        .then((response) => {
            /* An error page (404/5xx) or a redirect away from the allowed https hosts is not the page we asked for */
            if (!response.ok) {
                throw new Error('status ' + response.status);
            }
            if (response.url && !isAllowedUrl(response.url)) {
                throw new Error('redirected to ' + response.url);
            }
            return response.text();
        })
        .then((data) => sendResponse({ data }))
        .catch((error) => {
            const message = error.name === 'AbortError'
                ? 'timed out after ' + (requestTimeoutMs / 1000) + ' s'
                : error.message;
            console.error('[LMexpress] Fetch failed for ' + request.url + ': ' + message);
            sendResponse({ error: message });
        })
        .finally(() => clearTimeout(timer));

    return true; // Keep the message channel open for sendResponse
});
