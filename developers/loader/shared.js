/*
 * Legend Express: the bootstrap code both loaders share, the userscript (LMexpress/LMexpress.user.js) and the
 * extension (LMexpress/extension/content.js). developers/loader-build.js writes this file into both, between
 * their lmx-shared markers: edit it here and run
 *   node developers/loader-build.js
 * Each loader keeps its own browser adapter around it (how it is switched on, fetches the page, writes it
 * over agar.io's and where it keeps its saved release; the release record itself is shared). Plain ES5 that only declares things and reads the page load's
 * time, so it can come first in both.
 */

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

/* ---- release cache: the record of a saved play.html, the same in both loaders (each keeps it in its own
 * storage). A saved copy is used only when it is whole (length and FNV-1a checksum), is a Legend page and is
 * of this page address; LMX_FRESH_WAIT_MS is how long a fresh download may take before the saved copy runs,
 * LMX_CACHE_MAX_MS how old a saved copy may be to run before the download (older: only when it fails). ---- */
var LMX_CACHE_FORMAT = 1, LMX_FRESH_WAIT_MS = 400, LMX_CACHE_MAX_MS = 3 * 24 * 3600 * 1000;
function lmxChecksum(text) {
    var h = 0x811c9dc5;
    for (var i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h;
}
function lmxIsLegendHtml(html) {
    return typeof html === 'string' && html.length > 1000 && html.indexOf('/LMexpress/LMexpress.js') >= 0 && /<\/html>/i.test(html);
}
/* the record to save for a downloaded page, or null when it is not a Legend page (a portal or error page) */
function lmxMakeRelease(html, page) {
    if (!lmxIsLegendHtml(html)) return null;
    var v = /\?v=(\d+(?:\.\d+)*)/.exec(html);
    return { format: LMX_CACHE_FORMAT, page: page, release: v ? v[1] : '', length: html.length, sum: lmxChecksum(html), time: Date.now(), html: html };
}
function lmxUsableRelease(r, page) {
    return !!r && typeof r === 'object' && r.format === LMX_CACHE_FORMAT && r.page === page && lmxIsLegendHtml(r.html) &&
        r.html.length === r.length && lmxChecksum(r.html) === r.sum;
}
