/*
 * Legend Express: the bootstrap code both loaders share, the userscript (LMexpress/LMexpress.user.js) and the
 * extension (LMexpress/extension/content.js). developers/loader-build.js writes this file into both, between
 * their lmx-shared markers: edit it here and run
 *   node developers/loader-build.js
 * Each loader keeps its own browser adapter around it (how it is switched on, fetches the page, writes it
 * over agar.io's and stores its release). Plain ES5 that only declares things and reads the page load's
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
