// content.js for Legend Express Agar.io Extension
/*MIT License*/

/*
 * The owner records, the agar.io/normal note, the stage records and the init call with its signal are the
 * userscript's code too (LMexpress.user.js): developers/loader-build.js writes developers/loader/shared.js into
 * both, between the lmx-shared markers. Everything else here is this extension's own adapter.
 */
/* lmx-shared:start */ /* GENERATED from developers/loader/shared.js by developers/loader-build.js: edit it there */
/* ---- single owner: with both loaders installed only one takes over agar.io's page. The one that does names
 * itself first, in sessionStorage and on <html>, as "<extension|userscript>:<performance.timeOrigin>". ---- */
var LMX_OWNER_KEY = 'lm-loader-owner', LMX_OWNER_ATTR = 'data-lm-loader';
var lmxTimeOrigin = '';
try { lmxTimeOrigin = String(performance.timeOrigin || performance.timing.navigationStart); } catch (e) { }
/* the loader that an owner record names when it is of this page load, else '' (a record with another
 * timeOrigin is from an earlier page load in this tab) */
function lmxLiveOwner(value) {
    var m = /^(extension|userscript):(.*)$/.exec(String(value || ''));
    return m && m[2] === lmxTimeOrigin ? m[1] : '';
}
/* the owner records of this page: sessionStorage, then the <html> attribute */
function lmxOwnerRecords() {
    var seen = [];
    try { seen.push(sessionStorage.getItem(LMX_OWNER_KEY)); } catch (e) { }
    try { seen.push(document.documentElement ? document.documentElement.getAttribute(LMX_OWNER_ATTR) : null); } catch (e) { }
    return seen;
}
function lmxClaimOwner(mark) {
    try { sessionStorage.setItem(LMX_OWNER_KEY, mark); } catch (e) { }
    try { if (document.documentElement) document.documentElement.setAttribute(LMX_OWNER_ATTR, mark); } catch (e) { }
}

/* ---- agar.io without the mod: the userscript's agar.io/normal leaves the note "go:<time>" (10 s) and sends
 * the tab to agar.io/; that load keeps it as "on", and a reload of it stays without the mod. ---- */
var LMX_VANILLA_KEY = 'lmx-vanilla';
function lmxVanillaWanted() {
    var note = '', nav = '';
    try { note = sessionStorage.getItem(LMX_VANILLA_KEY) || ''; } catch (e) { return false; }
    var m = /^go:(\d+)$/.exec(note);
    if (m) return Date.now() - Number(m[1]) < 10000;
    if (note !== 'on') return false;
    try {
        var entry = performance.getEntriesByType('navigation')[0];
        nav = entry ? entry.type : performance.navigation.type === 1 ? 'reload' : '';
    } catch (e) { }
    return nav === 'reload';
}

/* ---- diagnostics: the stages (ROUTING -> TAKEOVER -> LOADING -> INITIALIZING -> READY, or FAILED / RECOVERY)
 * with their times since startedAt, in sessionStorage "lmx-boot" ---- */
function lmxStage(diag, startedAt, next, info) {
    var t = 0;
    try { t = performance.now(); } catch (e) { }
    diag.states.push([next, Math.round(t - startedAt)]);
    if (info) diag.info = String(info);
    try { sessionStorage.setItem('lmx-boot', JSON.stringify(diag)); } catch (e) { }
}

/* ---- lifecycle: the mod's init(<version>[, <loader>]) call at the end of the Legend page's body, after its
 * own scripts, with its readiness signal: the DOM events lmx-init-ok / lmx-init-missing (the loaders do not
 * run in the page's world) and html[data-lmx-init] for a page whose call ran while it was being written ---- */
function lmxAddInitCall(html, version, loaderName) {
    /* JSON quoting, with "<" escaped so the version text can never close the script tag */
    var args = JSON.stringify(version).replace(/</g, '\\u003c') + (loaderName ? ', ' + JSON.stringify(loaderName) : '');
    var call = '<script>' +
        'var lmxInit = function (s) { document.documentElement.setAttribute("data-lmx-init", s); document.dispatchEvent(new Event("lmx-init-" + s)); };' +
        'if (typeof init === "function") { try { init(' + args + '); } finally { lmxInit("ok"); } }' +
        ' else { console.error("[LMexpress] init() is missing: LMexpress.js did not load"); lmxInit("missing"); }' +
        '</script>';
    var bodyEnd = html.toLowerCase().lastIndexOf('</body>');
    if (bodyEnd === -1) return html + call;
    return html.slice(0, bodyEnd) + call + html.slice(bodyEnd);
}

function lmxEscapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
}
/* lmx-shared:end */

/*
 * Single owner. With both Legend Express loaders installed (this extension and the userscript) only one
 * may take over agar.io's page. The one that takes over names itself first, in sessionStorage
 * "lm-loader-owner" and html[data-lm-loader], as "<extension|userscript>:<performance.timeOrigin>".
 * A record of the other loader with this page load's timeOrigin means it already owns this page, so
 * this script then does nothing. A record with another timeOrigin is from an earlier page load in this tab.
 */
const ownerMark = 'extension:' + lmxTimeOrigin;
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
/*
 * Stages and diagnostics, the same as the userscript's (LMexpress.user.js): ROUTING -> TAKEOVER -> LOADING ->
 * INITIALIZING -> READY, or FAILED / RECOVERY, with their times in sessionStorage "lmx-boot" (written only
 * while this extension handles the page, so the userscript's record of its own pages stays). A static
 * document_start content script always starts before agar.io's scripts: the only late start is a switch
 * turned on since the last visit, which gets one guarded reload (below).
 */
const now = () => { try { return performance.now(); } catch (e) { return 0; } };
const startedAt = now();
const diag = { loader: 'extension', version: modVersion, mode: path, timing: 'early', states: [], source: '', release: '', conflict: '' };
function go(next, info) { lmxStage(diag, startedAt, next, info); }
/* agar.io without the mod, asked for at agar.io/normal by the Legend Express userscript: it writes agar.io's
 * page here (the same note and rule as LMexpress.user.js vanillaWanted), so this page is left to it */
const vanilla = isLegendPath && lmxVanillaWanted();
if (!otherLoaderOwned && !vanilla && (isLegendPath || isCaptchaPath) && mirroredOn) {
    go('ROUTING');
    claimOwner();
    stopAgario();
    if (isLegendPath) showLoading();
}

chrome.storage.local.get({ enabled: true }, (result) => {
    const isEnabled = result.enabled !== false;
    console.log('[Legend Express] Extension status:', isEnabled ? 'Enabled' : 'Disabled');
    try { localStorage.setItem(ENABLED_KEY, isEnabled ? '1' : '0'); } catch (e) { }
    /* the userscript runs Legend Mod (or agar.io without the mod) on this page: leave it alone, whatever the switch says */
    if (!stopped && (otherLoaderOwns() || vanilla)) return;

    if (!isEnabled) {
        // If we are on a mod-redirected page but extension is disabled, go back to vanilla agar.io
        if (path.startsWith('/legendmod')) {
            console.log('[Legend Express] Redirecting to vanilla agar.io...');
            /* the agar.io/ rule must be off first, or agar.io/ comes straight back here; at most once
             * in 10 s, so a rule that could not be switched off never makes a reload loop */
            const target = 'https://agar.io/' + (path === '/legendmod/' ? location.search : '') + location.hash;
            if (stopped) go('RECOVERY', 'switched off');
            if (!recentlyDone('lmExpressLeft')) chrome.runtime.sendMessage({ type: 'syncRules' }, () => { void chrome.runtime.lastError; location.href = target; });
        } else if (stopped) {
            /* stopped on an out-of-date "on": agar.io's page again, now left alone */
            go('RECOVERY', 'switched off');
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
        go('ROUTING');
        if (!recentlyDone('lmExpressReload')) {
            go('RECOVERY', 'late');
            location.reload();
            return;
        }
        diag.timing = 'late';
        diag.conflict = 'late-start';
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
    return lmxOwnerRecords().some((value) => {
        const owner = lmxLiveOwner(value);
        return !!owner && owner !== 'extension';
    });
}
function claimOwner() {
    lmxClaimOwner(ownerMark);
    /* agar.io/ sent to agar.io/legendmod/ by rules_legend.json: the address bar shows agar.io/ again, with
     * its ?query and #hash, before anything reads it (the launch link, Legend Mod itself) */
    if (path === '/legendmod/') {
        try { history.replaceState(history.state, '', '/' + location.search + location.hash); } catch (e) { }
    }
}
/* document.open() starts a new <html>: name the owner on it again after every page written */
function markPage() {
    try { document.documentElement.setAttribute(LMX_OWNER_ATTR, ownerMark); } catch (e) { }
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
    go('TAKEOVER');
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

    go('LOADING', retried ? 'retry' : '');
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
            go('FAILED', problem);
            showLoadError(pageUrl, problem);
            return;
        }
        diag.source = 'network';
        if (!isLegendPage) {
            writePage(response.data);
            go('READY');
            return;
        }
        go('INITIALIZING', 'network');
        writePage(lmxAddInitCall(response.data, modVersion, 'extension'));
        /* the init call's readiness signal (as the userscript's); document.open() dropped every listener, so
         * they are added after the write (the call comes after the page's script files: it has not run yet) */
        let settled = false;
        const started = (ok) => {
            if (settled) return;
            settled = true;
            go(ok ? 'READY' : 'FAILED', ok ? '' : 'init missing');
        };
        try {
            document.addEventListener('lmx-init-ok', () => started(true));
            document.addEventListener('lmx-init-missing', () => started(false));
            /* a page whose init call ran while it was written (no script files before it) */
            const seen = document.documentElement.getAttribute('data-lmx-init');
            if (seen) started(seen === 'ok');
        } catch (e) { }
    });
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
        '<h2>' + lmxEscapeHtml(text('lmx.ext.couldNotLoad')) + '</h2>' +
        '<p>' + lmxEscapeHtml(url) + ' (' + lmxEscapeHtml(problem) + ')</p>' +
        '<p><a style="color:#6cf;" href="' + lmxEscapeHtml(location.href) + '">' + lmxEscapeHtml(text('lmx.ext.tryAgain')) + '</a>' +
        ' &middot; ' + lmxEscapeHtml(text('lmx.ext.switchOff')) + '</p>' +
        '</body></html>';
    writePage(page);
}
