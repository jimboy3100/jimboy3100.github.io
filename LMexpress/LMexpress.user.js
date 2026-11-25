// ==UserScript==
// @name         Legend Express Agar.io Extension
// @namespace    Legend Express Agario Mod
// @version      1.8.5
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     https://jimboy3100.github.io
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        https://agar.io/*
// @downloadURL  https://jimboy3100.github.io/LMexpress/LMexpress.user.js
// @updateURL    https://jimboy3100.github.io/LMexpress/LMexpress.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      hslo.io
// @connect      agartool.io
// @connect      imasters.org.ru
// @connect      cdn.ogario.ovh
// @connect      deltav4.glitch.me
// @connect      jimboy3100.github.io
// @connect      legendmod.ml
// ==/UserScript==

// Legend Mod by Jimboy3100
/*MIT License*/

/*
 * Legend Express loader.
 *
 * agar.io/<mode> picks what runs in place of agar.io's own page: an HTML page
 * written over it (loadPage) or a userscript fetched and run (runUserscript).
 * Unknown paths, agar.io/ and agar.io/legendmod load Legend Mod's play.html.
 */

GM_registerMenuCommand('Legend Mod Website', function () {
    window.open('https://jimboy3100.github.io');
}, 'w');
GM_registerMenuCommand('LM Library', function () {
    window.open('https://github.com/jimboy3100/jimboy3100.github.io/');
}, 'l');
GM_registerMenuCommand('Donate for Legend Mod', function () {
    window.open('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CM3GDVCW6PBF6');
}, 'd');

/* Change to make browsers fetch a fresh play.html instead of a cached copy */
var pageVersion = 2;
var legendPage = 'https://www.legendmod.ml/play.html?' + pageVersion;
var requestTimeoutMs = 30000;
/* The /neo and /mobile add-on scripts run this long after the Legend page is written */
var extraScriptDelayMs = 5000;

/*
 * page:   HTML page written over agar.io
 * script: userscript fetched and run
 * legend: the page is Legend Mod's play.html, so it gets the init(<version>) call
 * extra:  userscript run on top of the Legend page
 * notice: [title, text, linkUrl, linkText] page shown instead (the mod's server is gone)
 */
var modes = {
    legendmod: { page: legendPage, legend: true },
    normal:    { page: 'https://agar.io' },
    hslo:      { script: 'https://hslo.io/install.user.js' },
    agartool:  { script: 'https://www.agartool.io/agartool.user.js' },
    /* Checked 2026-11: imasters.org.ru no longer answers over https (http only, which is
     * refused here), cdn.ogario.ovh does not resolve, and deltav4.glitch.me only redirects to
     * the Delta install page. Show a page with the right link instead of a blank page. */
    vanilla:   { notice: ['Vanilla mod is offline', 'Its server (imasters.org.ru) no longer serves the script over https.', null, null] },
    ogario:    { notice: ['OGARio is offline', 'Its server (cdn.ogario.ovh) no longer exists.', null, null] },
    delta:     { notice: ['Delta is installed separately', 'Delta has its own userscript.', 'https://greasyfork.org/scripts/399197-delta-v4', 'Open the Delta install page'] },
    neo:       { page: legendPage, legend: true, extra: 'https://jimboy3100.github.io/ExampleScripts/Neoprivate.js' },
    mobile:    { page: legendPage, legend: true, extra: 'https://www.legendmod.ml/ExampleScripts/gamepad.user.js' },
    captcha:   { page: 'https://www.legendmod.ml/ogario/captcha.html' }
};

var modVersion = GM_info.script.version;
/* "/Normal/" and "/normal" are the same mode */
var modeName = location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
var mode = Object.prototype.hasOwnProperty.call(modes, modeName) ? modes[modeName] : modes.legendmod;

/*
 * LMexpress.js reads the launch link (?sip=, ?pass=, ?replay=...) from localStorage "url".
 * Save it on every visit that loads the Legend page. It used to be saved on agar.io/ only,
 * so a later visit to agar.io/legendmod re-applied the previous link's server or replay.
 */
if (mode.legend) {
    try {
        localStorage.setItem('url', location.href);
    } catch (e) {
        console.error('[LMexpress] Could not save the launch link', e);
    }
}

/* Stop agar.io's own page at once (no more parsing, none of its scripts: while the page was
 * downloaded the vanilla game could start first); the mode's page or userscript replaces it */
try { window.stop(); } catch (e) { }
document.documentElement.innerHTML = '';

if (mode.notice) {
    showLoaderPage(mode.notice[0], mode.notice[1], mode.notice[2], mode.notice[3]);
} else if (mode.page) {
    loadPage(mode.page, mode.legend, mode.extra);
} else {
    runUserscript(mode.script, true);
}

/* Shown instead of a blank white page (the page was already emptied above). */
function showLoaderPage(title, text, linkUrl, linkText) {
    var page = '<!doctype html><html><head><meta charset="utf-8"><title>Legend Mod</title></head>' +
        '<body style="margin:0;background:#00243e;color:#fff;font:16px Ubuntu,Arial,sans-serif;text-align:center;padding-top:20vh">' +
        '<h2 style="margin:0 0 12px">' + escapeHtml(title) + '</h2><div style="opacity:.8">' + escapeHtml(text) + '</div><br>' +
        (linkUrl ? '<a style="color:#ffd200" href="' + escapeHtml(linkUrl) + '" target="_blank" rel="noopener">' + escapeHtml(linkText || linkUrl) + '</a> &nbsp;&middot;&nbsp; ' : '') +
        '<a style="color:#ffd200" href="https://agar.io/legendmod">Play with Legend Mod</a> &nbsp;&middot;&nbsp; ' +
        '<a style="color:#ffd200" href="https://agar.io/normal">Play without mods</a>' +
        '</body></html>';
    document.open();
    document.write(page);
    document.close();
}

function isHttps(url) {
    return /^https:\/\//i.test(String(url || ''));
}

/* Returns why a response is not usable, or '' if it is. An error page (404/5xx) or a redirect away from https is not the code we asked for. */
function responseProblem(res) {
    if (!res || !(res.status >= 200 && res.status < 300)) {
        return 'status ' + (res ? res.status : 'none');
    }
    if (res.finalUrl && !isHttps(res.finalUrl)) {
        return 'redirected off https to ' + res.finalUrl;
    }
    return '';
}

/* GET a URL over https and hand its text to onText, or a reason to onFail */
function fetchText(url, onText, onFail) {
    /* Never fetch code that is not served over https */
    if (!isHttps(url)) {
        onFail('not https');
        return;
    }
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        timeout: requestTimeoutMs,
        onload: function (res) {
            var problem = responseProblem(res);
            if (problem) {
                onFail(problem);
                return;
            }
            onText(res.responseText);
        },
        onerror: function (err) {
            onFail('network error', err);
        },
        ontimeout: function () {
            onFail('timed out after ' + (requestTimeoutMs / 1000) + ' s');
        }
    });
}

/* Htmlscript: fetch an HTML page and write it over agar.io */
function loadPage(pageUrl, isLegendPage, extraScriptUrl) {
    fetchText(pageUrl, function (html) {
        if (isLegendPage) {
            html = addInitCall(html);
        }
        document.open();
        document.write(html);
        document.close();
        if (extraScriptUrl) {
            setTimeout(function () {
                runUserscript(extraScriptUrl, false);
            }, extraScriptDelayMs);
        }
    }, function (problem, err) {
        console.error('[LMexpress] Could not load page ' + pageUrl + ' (' + problem + ')', err || '');
        showLoadError(pageUrl, problem);
    });
}

/*
 * Userscript: fetch a userscript and run it with this loader's GM_info and GM_xmlhttpRequest.
 * replacesPage: the script is the whole mode, so a failed download gets the error page.
 */
function runUserscript(scriptUrl, replacesPage) {
    fetchText(scriptUrl, function (code) {
        try {
            new Function('GM_info', 'GM_xmlhttpRequest', code)(GM_info, GM_xmlhttpRequest);
        } catch (err) {
            console.error('[LMexpress] Error running userscript from ' + scriptUrl, err);
        }
    }, function (problem, err) {
        console.error('[LMexpress] Not running userscript from ' + scriptUrl + ' (' + problem + ')', err || '');
        if (replacesPage) {
            showLoadError(scriptUrl, problem);
        }
    });
}

/* Add the mod's init(<version>) call at the end of the Legend page's body, after its own scripts */
function addInitCall(html) {
    /* JSON quoting, with "<" escaped so the version text can never close the script tag */
    var version = JSON.stringify(modVersion).replace(/</g, '\\u003c');
    var call = '<script>' +
        'if (typeof init === "function") { init(' + version + '); }' +
        ' else { console.error("[LMexpress] init() is missing: LMexpress.js did not load"); }' +
        '</script>';
    var bodyEnd = html.toLowerCase().lastIndexOf('</body>');
    if (bodyEnd === -1) {
        return html + call;
    }
    return html.slice(0, bodyEnd) + call + html.slice(bodyEnd);
}

/* agar.io's page is already gone, so say what failed instead of leaving a blank tab */
function showLoadError(url, problem) {
    var page = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Legend Express</title></head>' +
        '<body style="background:#111;color:#eee;font:16px sans-serif;padding:40px;">' +
        '<h2>Legend Express could not load this mode</h2>' +
        '<p>' + escapeHtml(url) + ' (' + escapeHtml(problem) + ')</p>' +
        '<p><a style="color:#6cf;" href="' + escapeHtml(location.href) + '">Try again</a>' +
        ' &middot; <a style="color:#6cf;" href="https://agar.io/normal">Play agar.io without the mod</a></p>' +
        '</body></html>';
    document.open();
    document.write(page);
    document.close();
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
}
