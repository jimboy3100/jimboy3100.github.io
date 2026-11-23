// content.js for Legend Express Agar.io Extension

const version = 2;
const modVersion = chrome.runtime.getManifest().version;

// Helper for cross-origin fetch via background script.
// The background answers { status, data } or { error }; a missing answer (service worker
// gone), a network error or a non-2xx status goes to details.onerror instead of being
// written into the page.
function GM_xmlhttpRequest(details) {
    chrome.runtime.sendMessage({
        type: 'fetch',
        url: details.url,
        options: {
            method: details.method || 'GET'
        }
    }, (response) => {
        if (chrome.runtime.lastError || !response || response.error ||
            !(response.status >= 200 && response.status < 300)) {
            console.error('[Legend Express] Fetch failed:', details.url,
                (chrome.runtime.lastError && chrome.runtime.lastError.message) || (response && (response.error || response.status)));
            if (details.onerror) details.onerror(response);
            return;
        }
        if (details.onload) {
            details.onload({ responseText: response.data, status: response.status });
        }
    });
}

// Check enabled state before proceeding
chrome.storage.local.get({ enabled: true }, (result) => {
    const isEnabled = result.enabled !== false;
    console.log('[Legend Express] Extension status:', isEnabled ? 'Enabled' : 'Disabled');

    if (!isEnabled) {
        // If we are on a mod-redirected page but extension is disabled, go back to vanilla agar.io
        if (location.pathname.startsWith("/legendmod")) {
            console.log('[Legend Express] Redirecting to vanilla agar.io...');
            location.href = "https://agar.io/" + location.hash;
        }
        return;
    }

    // Check location and load mod without triggering 404 network request
    if (location.host === "agar.io" && location.pathname === "/") {
        const url = window.location.href;
        localStorage.setItem("url", url);
        history.replaceState({}, '', location.pathname + location.search + location.hash);
        runMod();
    } else if (location.host === "agar.io" && location.pathname.startsWith("/legendmod")) {
        runMod();
    } else if (location.host === "agar.io" && location.pathname === "/captcha") {
        /* The bots open agar.io/captcha and expect the captcha helper page there. */
        runMod();
    }
});

/*
 * Only "/", "/legendmod..." and "/captcha" reach runMod() (see above), so only those two
 * pages are loaded. The old other-mod modes (hslo, agartool, ogario, vanilla, delta, neo,
 * mobile) could never be reached from this extension and ran downloaded code inside the
 * page, which the Chrome Web Store does not allow; they were removed. The Tampermonkey
 * userscript (LMexpress.user.js) still offers them.
 */
function runMod() {
    document.documentElement.innerHTML = "";
    const mode = location.pathname.slice(1);
    if (mode === 'captcha') {
        Htmlscript('https://www.legendmod.ml/ogario/captcha.html');
    } else {
        Htmlscript('https://www.legendmod.ml/play.html?' + version);
    }
}

function inject(page) {
    return page.replace("</body>", "<script>init('" + modVersion + "');</script></body>");
}

/* Shown instead of a blank white page when Legend Mod cannot be loaded. */
function showLoadError() {
    document.open();
    document.write('<!doctype html><html><head><meta charset="utf-8"><title>Legend Mod</title></head>' +
        '<body style="margin:0;background:#00243e;color:#fff;font:16px Ubuntu,Arial,sans-serif;text-align:center;padding-top:20vh">' +
        '<h2 style="margin:0 0 12px">Legend Mod could not be loaded</h2>' +
        '<div style="opacity:.8">A network problem or the Legend Mod server did not answer.</div><br>' +
        '<a style="color:#ffd200" href="' + location.pathname + location.search + location.hash + '">Try again</a>' +
        ' &nbsp;·&nbsp; ' +
        '<a style="color:#ffd200" href="https://www.legendmod.ml/" target="_blank" rel="noopener">Legend Mod website</a>' +
        '</body></html>');
    document.close();
}

function Htmlscript(modwebsite) {
    GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        onload: function (legend) {
            const doc = inject(legend.responseText);
            document.open();
            document.write(doc);
            setTimeout(function () {
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, window.location.pathname + window.location.search + window.location.hash);
                }
            }, 2000);
            document.close();
        },
        onerror: showLoadError
    });
}
