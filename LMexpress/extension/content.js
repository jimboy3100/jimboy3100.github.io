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
/* The texts (texts.js, generated from developers/i18n/src) in the language chosen in Legend Mod
 * (agar.io's localStorage languagemod, 1 English ... 12 Dutch); never chosen: the browser's, else English. */
let chosenLanguage = null;
try { chosenLanguage = localStorage.getItem('languagemod'); } catch (e) { }
const lang = lmxExtLang(chosenLanguage);
const text = (key) => lmxExtText(key, lang);
/* the popup cannot read agar.io's storage: it shows the language saved here */
try { chrome.storage.local.set({ languagemod: lang }); } catch (e) { }

/*
 * agar.io's own page must be stopped at once: the on/off switch (chrome.storage) only answers
 * asynchronously, and the page download goes through the background worker. Meanwhile the
 * browser went on parsing agar.io's page and started its game (agario.core.js), so a slow
 * worker or download left the player in the vanilla game. The switch is mirrored in agar.io's
 * localStorage (ENABLED_KEY) so the decision is made synchronously here; when the mirror was
 * out of date, the page is reloaded once with the right state.
 */
const ENABLED_KEY = 'lmExpressEnabled';
const path = location.pathname.toLowerCase();
const isLegendPath = path === '/' || path.startsWith('/legendmod');
const isCaptchaPath = path === '/captcha' || path === '/captcha/';
let mirroredOn = true;
try { mirroredOn = localStorage.getItem(ENABLED_KEY) !== '0'; } catch (e) { }
let stopped = false;
if ((isLegendPath || isCaptchaPath) && mirroredOn) {
    stopAgario();
    if (isLegendPath) showLoading();
}

chrome.storage.local.get({ enabled: true }, (result) => {
    const isEnabled = result.enabled !== false;
    console.log('[Legend Express] Extension status:', isEnabled ? 'Enabled' : 'Disabled');
    try { localStorage.setItem(ENABLED_KEY, isEnabled ? '1' : '0'); } catch (e) { }

    if (!isEnabled) {
        // If we are on a mod-redirected page but extension is disabled, go back to vanilla agar.io
        if (path.startsWith('/legendmod')) {
            console.log('[Legend Express] Redirecting to vanilla agar.io...');
            location.href = 'https://agar.io/' + location.hash;
        } else if (stopped) {
            /* stopped on an out-of-date "on": agar.io's page again, now left alone */
            location.reload();
        }
        return;
    }

    if (isLegendPath) {
        loadLegendPage();
    } else if (isCaptchaPath) {
        /* The bots open agar.io/captcha and expect the captcha helper page there. */
        loadPage(captchaPage, false);
    }
});

/* Stop agar.io's page: no more parsing, no more of its scripts (the fetched page replaces it) */
function stopAgario() {
    if (stopped) return;
    stopped = true;
    try { window.stop(); } catch (e) { }
    try { document.documentElement.innerHTML = ''; } catch (e) { }
}

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
    /* Stop agar.io's own page (already done at document_start unless the switch was just turned on) */
    const wasStopped = stopped;
    stopAgario();
    /* the tab stayed white while the page was fetched; play.html shows its own loading screen next */
    if (isLegendPage && !wasStopped) showLoading();

    chrome.runtime.sendMessage({ type: 'fetch', url: pageUrl }, (response) => {
        /* lastError: the background worker could not answer (e.g. the extension was just reloaded) */
        const problem = chrome.runtime.lastError ? chrome.runtime.lastError.message
            : !response ? text('lmx.ext.noAnswer')
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

/* Same look as play.html's loading screen (#lm-boot), shown until the page is written */
function showLoading() {
    try {
        const box = document.createElement('div');
        box.style.cssText = 'position:fixed;inset:0;z-index:2147483000;background:#00243e;color:#fff;' +
            'font:15px/1.5 Ubuntu,Arial,sans-serif;display:flex;align-items:center;justify-content:center;text-align:center;';
        /* the same text as play.html's loading screen (boot.loading) */
        box.innerHTML = '<div><div style="font-size:26px;font-weight:700;letter-spacing:1px;">Legend Mod</div>' +
            '<div style="margin-top:10px;opacity:.85;"></div></div>';
        box.firstChild.lastChild.textContent = text('boot.loading');
        if (lang === 6) box.firstChild.lastChild.dir = 'rtl';
        document.documentElement.appendChild(box);
    } catch (e) { }
}

/* agar.io's page is already gone, so say what failed instead of leaving a blank tab */
function showLoadError(url, problem) {
    const page = '<!DOCTYPE html><html lang="' + LMX_EXT_CODES[lang - 1] + '"' + (lang === 6 ? ' dir="rtl"' : '') + '><head><meta charset="utf-8"><title>Legend Express</title></head>' +
        '<body style="background:#111;color:#eee;font:16px sans-serif;padding:40px;">' +
        '<h2>' + escapeHtml(text('lmx.ext.couldNotLoad')) + '</h2>' +
        '<p>' + escapeHtml(url) + ' (' + escapeHtml(problem) + ')</p>' +
        '<p><a style="color:#6cf;" href="' + escapeHtml(location.href) + '">' + escapeHtml(text('lmx.ext.tryAgain')) + '</a>' +
        ' &middot; ' + escapeHtml(text('lmx.ext.switchOff')) + '</p>' +
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
