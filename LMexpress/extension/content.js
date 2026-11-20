// content.js for Legend Express Agar.io Extension
/*MIT License*/

/*
 * Loads Legend Mod in place of agar.io's own page:
 *   agar.io/ and agar.io/legendmod...  -> Legend Mod's play.html
 *   agar.io/captcha                     -> the captcha helper page (the bots open it)
 * Every other agar.io path is left alone.
 *
 * The page is fetched by background.js, which checks it came over https with a
 * 2xx status, and is then written over agar.io.
 */

/* Change to make browsers fetch a fresh play.html instead of a cached copy */
const pageVersion = 2;
const legendPage = 'https://www.legendmod.ml/play.html?' + pageVersion;
const captchaPage = 'https://www.legendmod.ml/ogario/captcha.html';
const modVersion = chrome.runtime.getManifest().version;

// Check enabled state before proceeding
chrome.storage.local.get({ enabled: true }, (result) => {
    const isEnabled = result.enabled !== false;
    console.log('[Legend Express] Extension status:', isEnabled ? 'Enabled' : 'Disabled');

    const path = location.pathname.toLowerCase();

    if (!isEnabled) {
        // If we are on a mod-redirected page but extension is disabled, go back to vanilla agar.io
        if (path.startsWith('/legendmod')) {
            console.log('[Legend Express] Redirecting to vanilla agar.io...');
            location.href = 'https://agar.io/' + location.hash;
        }
        return;
    }

    if (path === '/' || path.startsWith('/legendmod')) {
        loadLegendPage();
    } else if (path === '/captcha' || path === '/captcha/') {
        /* The bots open agar.io/captcha and expect the captcha helper page there. */
        loadPage(captchaPage, false);
    }
});

function loadLegendPage() {
    /*
     * LMexpress.js reads the launch link (?sip=, ?pass=, ?replay=...) from localStorage "url".
     * Save it on every Legend load. It used to be saved on agar.io/ only, so a later
     * visit to agar.io/legendmod re-applied the previous link's server or replay.
     */
    try {
        localStorage.setItem('url', location.href);
    } catch (e) {
        console.error('[LMexpress] Could not save the launch link', e);
    }
    loadPage(legendPage, true);
}

/* Fetch a page through background.js and write it over agar.io */
function loadPage(pageUrl, isLegendPage) {
    /* Stop agar.io's own page; the fetched page replaces it */
    document.documentElement.innerHTML = '';

    chrome.runtime.sendMessage({ type: 'fetch', url: pageUrl }, (response) => {
        /* lastError: the background worker could not answer (e.g. the extension was just reloaded) */
        const problem = chrome.runtime.lastError ? chrome.runtime.lastError.message
            : !response ? 'no answer from the extension'
            : response.error ? response.error
            : '';
        if (problem) {
            console.error('[LMexpress] Could not load page ' + pageUrl + ' (' + problem + ')');
            showLoadError(pageUrl, problem);
            return;
        }
        const html = isLegendPage ? addInitCall(response.data) : response.data;
        document.open();
        document.write(html);
        document.close();
    });
}

/* Add the mod's init(<version>) call at the end of the Legend page's body, after its own scripts */
function addInitCall(html) {
    /* JSON quoting, with "<" escaped so the version text can never close the script tag */
    const version = JSON.stringify(modVersion).replace(/</g, '\\u003c');
    const call = '<script>' +
        'if (typeof init === "function") { init(' + version + '); }' +
        ' else { console.error("[LMexpress] init() is missing: LMexpress.js did not load"); }' +
        '</script>';
    const bodyEnd = html.toLowerCase().lastIndexOf('</body>');
    if (bodyEnd === -1) {
        return html + call;
    }
    return html.slice(0, bodyEnd) + call + html.slice(bodyEnd);
}

/* agar.io's page is already gone, so say what failed instead of leaving a blank tab */
function showLoadError(url, problem) {
    const page = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Legend Express</title></head>' +
        '<body style="background:#111;color:#eee;font:16px sans-serif;padding:40px;">' +
        '<h2>Legend Express could not load Legend Mod</h2>' +
        '<p>' + escapeHtml(url) + ' (' + escapeHtml(problem) + ')</p>' +
        '<p><a style="color:#6cf;" href="' + escapeHtml(location.href) + '">Try again</a>' +
        ' &middot; To play agar.io without the mod, switch the extension off in its popup.</p>' +
        '</body></html>';
    document.open();
    document.write(page);
    document.close();
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (ch) => {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
}
