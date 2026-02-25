// Background Service Worker for LMexpress Extension
// Handles cross-origin requests that are blocked in content scripts

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'fetch') {
        fetch(request.url, request.options)
            .then(response => response.text())
            .then(data => sendResponse({ data }))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Keep the message channel open for sendResponse
    }
});
