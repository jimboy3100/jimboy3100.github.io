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

/*
 * rules_legend.json sends agar.io/ to agar.io/legendmod/, a small page of agar.io's own (its 404 page;
 * content.js puts the address back): agar.io's front page made the browser download its game scripts
 * and ads next to Legend Mod's, although content.js stops that page before they run.
 * The rule follows the on/off switch, so with the switch off agar.io/ is agar.io's page again.
 */
const legendRuleset = 'legend_page';
function syncLegendRules() {
    return new Promise((resolve) => {
        chrome.storage.local.get({ enabled: true }, (result) => {
            const on = result.enabled !== false;
            const change = on ? { enableRulesetIds: [legendRuleset] } : { disableRulesetIds: [legendRuleset] };
            chrome.declarativeNetRequest.updateEnabledRulesets(change, () => {
                if (chrome.runtime.lastError) console.error('[LMexpress] Could not switch the agar.io rule: ' + chrome.runtime.lastError.message);
                resolve(on);
            });
        });
    });
}
/* an update or a browser start can bring back the manifest's default (on) */
chrome.runtime.onInstalled.addListener(() => { syncLegendRules(); });
chrome.runtime.onStartup.addListener(() => { syncLegendRules(); });
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled) syncLegendRules();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    /* content.js, before it leaves agar.io/legendmod with the switch off: the rule must be off first */
    if (request && request.type === 'syncRules' && sender.id === chrome.runtime.id) {
        syncLegendRules().then((on) => sendResponse({ on }));
        return true;
    }
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
