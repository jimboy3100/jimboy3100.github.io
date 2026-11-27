// content.js for Legend Express Agar.io Extension
/*MIT License*/

/*
 * Single owner. With both Legend Express loaders installed (this extension and the userscript) only one
 * may take over agar.io's page. The one that takes over names itself first, in sessionStorage
 * "lm-loader-owner" and html[data-lm-loader], as "<extension|userscript>:<performance.timeOrigin>".
 * A record of the other loader with this page load's timeOrigin means it already owns this page, so
 * this script then does nothing. A record with another timeOrigin is from an earlier page load in this tab.
 */
const OWNER_KEY = 'lm-loader-owner';
const OWNER_ATTR = 'data-lm-loader';
const ownerMark = 'extension:' + performance.timeOrigin;
const otherLoaderOwned = otherLoaderOwns();

/*
 * Loads Legend Mod in place of agar.io's own page:
 *   agar.io/ and agar.io/legendmod...  -> Legend Mod's play.html
 *   agar.io/captcha                     -> the captcha helper page (the bots open it)
 * Every other agar.io path is left alone (the userscript, when installed, handles /hslo, /neo ...).
 * agar.io/ itself arrives here as agar.io/legendmod/ (rules_legend.json, while the switch is on): that
 * address is a small page of agar.io's own without agar.io's game scripts and ads, so the
 * browser never downloads or starts them.
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
 * (agar.io's localStorage languagemod, 1 English ... 16 Italian); never chosen: the browser's, else English. */
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
if (!otherLoaderOwned && (isLegendPath || isCaptchaPath) && mirroredOn) {
    claimOwner();
    stopAgario();
    if (isLegendPath) showLoading();
}

chrome.storage.local.get({ enabled: true }, (result) => {
    const isEnabled = result.enabled !== false;
    console.log('[Legend Express] Extension status:', isEnabled ? 'Enabled' : 'Disabled');
    try { localStorage.setItem(ENABLED_KEY, isEnabled ? '1' : '0'); } catch (e) { }
    /* the userscript runs Legend Mod on this page: leave it alone, whatever the switch says */
    if (!stopped && otherLoaderOwns()) return;

    if (!isEnabled) {
        // If we are on a mod-redirected page but extension is disabled, go back to vanilla agar.io
        if (path.startsWith('/legendmod')) {
            console.log('[Legend Express] Redirecting to vanilla agar.io...');
            /* the agar.io/ rule must be off first, or agar.io/ comes straight back here; at most once
             * in 10 s, so a rule that could not be switched off never makes a reload loop */
            const target = 'https://agar.io/' + (path === '/legendmod/' ? location.search : '') + location.hash;
            if (!recentlyDone('lmExpressLeft')) chrome.runtime.sendMessage({ type: 'syncRules' }, () => { void chrome.runtime.lastError; location.href = target; });
        } else if (stopped) {
            /* stopped on an out-of-date "on": agar.io's page again, now left alone */
            location.reload();
        }
        return;
    }

    if (!stopped) {
        if (!isLegendPath && !isCaptchaPath) return;
        /* Switched on since the last visit (the mirror said off): agar.io's page has been running and may
         * have started its game. Taking over now would leave its scripts, timers and connections running
         * beside Legend Mod, so the page is loaded once more, now taken over at its start. At most once
         * in 10 s: if the mirror could not be saved, the page is taken over late instead of reloading again. */
        if (!recentlyDone('lmExpressReload')) {
            location.reload();
            return;
        }
        claimOwner();
    }
    if (isLegendPath) {
        loadLegendPage();
    } else if (isCaptchaPath) {
        /* The bots open agar.io/captcha and expect the captcha helper page there. */
        loadPage(captchaPage, false);
    }
});

/* True when the other loader (the userscript) named itself owner of this page load */
function otherLoaderOwns() {
    const seen = [];
    try { seen.push(sessionStorage.getItem(OWNER_KEY)); } catch (e) { }
    try { seen.push(document.documentElement.getAttribute(OWNER_ATTR)); } catch (e) { }
    return seen.some((value) => {
        const m = /^(extension|userscript):(.+)$/.exec(value || '');
        return !!m && m[1] !== 'extension' && Number(m[2]) === performance.timeOrigin;
    });
}
function claimOwner() {
    try { sessionStorage.setItem(OWNER_KEY, ownerMark); } catch (e) { }
    markPage();
    /* agar.io/ sent to agar.io/legendmod/ by rules_legend.json: the address bar shows agar.io/ again, with
     * its ?query and #hash, before anything reads it (the launch link, Legend Mod itself) */
    if (path === '/legendmod/') {
        try { history.replaceState(history.state, '', '/' + location.search + location.hash); } catch (e) { }
    }
}
/* document.open() starts a new <html>: name the owner on it again after every page written */
function markPage() {
    try { document.documentElement.setAttribute(OWNER_ATTR, ownerMark); } catch (e) { }
}

/* True when this was already done less than 10 s ago in this tab (then it is not done again) */
function recentlyDone(key) {
    let again = false;
    try { again = Date.now() - (+sessionStorage.getItem(key) || 0) < 10000; sessionStorage.setItem(key, String(Date.now())); } catch (e) { }
    return again;
}

/* Stop agar.io's page: no more parsing, no more of its scripts (the fetched page replaces it) */
function stopAgario() {
    if (stopped) return;
    stopped = true;
    /* document.open() drops the rest of agar.io's page and its scripts. Not window.stop(): it marks the
     * page's parser as aborted, and the browser then ignores the later document.open()/write() of the
     * Legend page (the player got a white page) */
    try { writePage('<!DOCTYPE html><html><head></head><body></body></html>'); } catch (e) { }
    try { document.documentElement.innerHTML = ''; } catch (e) { }
    markPage();
}

/* Write a whole page over agar.io's: through writer.js in agar.io's own world (Firefox refuses
 * document.open() from this isolated world), here when writer.js is not there */
function writePage(html) {
    let written = false;
    try { written = !window.dispatchEvent(new CustomEvent('lmx-write-page', { detail: html, cancelable: true })); } catch (e) { }
    if (!written) {
        document.open();
        document.write(html);
        document.close();
    }
    markPage();
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
    /* per tab too: "url" is shared by every agar.io tab, so two tabs loading at once took each other's link */
    try { sessionStorage.setItem('lm-launch-url', JSON.stringify({ o: performance.timeOrigin, url: location.href })); } catch (e) { }
    loadPage(legendPage, true);
}

/* Fetch a page through background.js and write it over agar.io; a failed download is tried once more */
function loadPage(pageUrl, isLegendPage, retried) {
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
            if (!retried) {
                setTimeout(() => loadPage(pageUrl, isLegendPage, true), 1500);
                return;
            }
            showLoadError(pageUrl, problem);
            return;
        }
        writePage(isLegendPage ? addInitCall(response.data) : response.data);
    });
}

/* Add the mod's init(<version>, "extension") call at the end of the Legend page's body, after its own scripts */
function addInitCall(html) {
    /* JSON quoting, with "<" escaped so the version text can never close the script tag */
    const version = JSON.stringify(modVersion).replace(/</g, '\\u003c');
    const call = '<script>' +
        'if (typeof init === "function") { init(' + version + ', "extension"); }' +
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
    const page = '<!DOCTYPE html><html lang="' + (lang === 13 ? 'pt-BR' : lang === 7 ? 'zh-Hant' : LMX_EXT_CODES[lang - 1]) + '"' + (lang === 6 ? ' dir="rtl"' : '') + '><head><meta charset="utf-8"><title>Legend Express</title></head>' +
        '<body style="background:#111;color:#eee;font:16px sans-serif;padding:40px;">' +
        '<h2>' + escapeHtml(text('lmx.ext.couldNotLoad')) + '</h2>' +
        '<p>' + escapeHtml(url) + ' (' + escapeHtml(problem) + ')</p>' +
        '<p><a style="color:#6cf;" href="' + escapeHtml(location.href) + '">' + escapeHtml(text('lmx.ext.tryAgain')) + '</a>' +
        ' &middot; ' + escapeHtml(text('lmx.ext.switchOff')) + '</p>' +
        '</body></html>';
    writePage(page);
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (ch) => {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
}
