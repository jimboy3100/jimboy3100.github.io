// ==UserScript==
// @name         Legend Express Agar.io Extension
// @namespace    Legend Express Agario Mod
// @version      1.8.3
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     https://jimboy3100.github.io
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        https://agar.io/*
// @match        https://agar.io/
// @downloadURL  https://jimboy3100.github.io/LMexpress/LMexpress.user.js
// @updateURL    https://jimboy3100.github.io/LMexpress/LMexpress.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      hslo.io
// @connect	 agartool.io
// @connect      jimboy3100.github.io
// @connect      legendmod.ml
// @grant        GM_registerMenuCommand

// ==/UserScript==

// Legend Mod by Jimboy3100
/*MIT License*/

GM_registerMenuCommand('Legend Mod Website', function() {
    window.open("http://jimboy3100.github.io");
}, 'r');
GM_registerMenuCommand('LM Library', function() {
    window.open("https://github.com/jimboy3100/jimboy3100.github.io/");
}, 'r');
GM_registerMenuCommand('Donate for Legend Mod', function() {
    window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CM3GDVCW6PBF6");
}, 'r');

var version = 2;

// Check location
if (location.host === "agar.io" && location.pathname === "/") {
    var url = window.location.href;
    localStorage.setItem("url", url);
    history.replaceState({}, '', location.pathname + location.search + location.hash);
}
var modVersion = GM_info.script.version;
// Inject Legend
function inject(page) {
    var page = page.replace("</body>", "<script>init('" + modVersion + "');</script>" + "</body>");
    return page;
}
document.documentElement.innerHTML = "";
var LMdetails;
var mode = location.pathname.slice(1);
var modwebsite;
switch (mode) {
    case 'normal':
        modwebsite = 'https://agar.io';
        Htmlscript(modwebsite);
        break;
    case 'hslo':
        modwebsite = 'https://hslo.io/install.user.js';
        Userscript(modwebsite);
        break;
    case 'agartool':
        modwebsite = 'https://www.agartool.io/agartool.user.js';
        Userscript(modwebsite);
        break;
    /* Checked 2026-11: imasters.org.ru no longer answers over https (http only, which is
     * refused here), cdn.ogario.ovh does not resolve, and deltav4.glitch.me only redirects to
     * the Delta install page. Show a page with the right link instead of a blank page. */
    case 'vanilla':
        showLoaderPage('Vanilla mod is offline', 'Its server (imasters.org.ru) no longer serves the script over https.', null, null);
        break;
    case 'ogario':
        showLoaderPage('OGARio is offline', 'Its server (cdn.ogario.ovh) no longer exists.', null, null);
        break;
    case 'delta':
        showLoaderPage('Delta is installed separately', 'Delta has its own userscript.', 'https://greasyfork.org/scripts/399197-delta-v4', 'Open the Delta install page');
        break;
    case 'neo': 
        modwebsite = 'https://www.legendmod.ml/play.html?' + version;
        Htmlscript(modwebsite);
		setTimeout(function() {		
			modwebsite = 'https://jimboy3100.github.io/ExampleScripts/Neoprivate.js';
			Userscript(modwebsite, true);
		}, 5000);
	break;	
    case 'mobile': 
        modwebsite = 'https://www.legendmod.ml/play.html';
        Htmlscript(modwebsite);
		setTimeout(function() {		
			modwebsite = 'https://www.legendmod.ml/ExampleScripts/gamepad.user.js';
			Userscript(modwebsite, true);
		}, 5000);
	break;		
    case 'captcha':
        modwebsite = 'https://www.legendmod.ml/ogario/captcha.html'
        Htmlscript(modwebsite);
        break;	
    case 'legendmod': default:
        modwebsite = 'https://www.legendmod.ml/play.html?' + version;
        Htmlscript(modwebsite);
        break;
}

/* Shown instead of a blank white page (the page was already emptied above). */
function showLoaderPage(title, text, linkUrl, linkText) {
    var esc = function (v) { return String(v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    document.open();
    document.write('<!doctype html><html><head><meta charset="utf-8"><title>Legend Mod</title></head>' +
        '<body style="margin:0;background:#00243e;color:#fff;font:16px Ubuntu,Arial,sans-serif;text-align:center;padding-top:20vh">' +
        '<h2 style="margin:0 0 12px">' + esc(title) + '</h2><div style="opacity:.8">' + esc(text) + '</div><br>' +
        (linkUrl ? '<a style="color:#ffd200" href="' + esc(linkUrl) + '" target="_blank" rel="noopener">' + esc(linkText || linkUrl) + '</a> &nbsp;·&nbsp; ' : '') +
        '<a style="color:#ffd200" href="https://agar.io/legendmod">Play with Legend Mod</a> &nbsp;·&nbsp; ' +
        '<a style="color:#ffd200" href="https://agar.io/normal">Play without mods</a>' +
        '</body></html>');
    document.close();
}
function showLoadError(what) {
    showLoaderPage('Could not load ' + what, 'A network problem or the server did not answer. Please try again.', location.href, 'Try again');
}

function Htmlscript(modwebsite) {
    LMdetails = GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        synchronous: false,
        onload: function(legend) {
            if (legend.status && (legend.status < 200 || legend.status >= 300)) {
                console.error("[LMexpress] " + modwebsite + " answered " + legend.status);
                showLoadError(modwebsite);
                return;
            }
            var doc = inject(legend.responseText);
            document.open();
            document.write(doc);
            setTimeout(function() {
                if (window.history && window.history.pushState) {
                    window.history.pushState(null, null, window.location.pathname + window.location.search + window.location.hash);
                }
            }, 2000);
            document.close();
        },
        onerror: function(err) {
            console.error("[LMexpress] Failed to fetch target HTML script from " + modwebsite, err);
            showLoadError(modwebsite);
        },
        ontimeout: function() {
            console.error("[LMexpress] Request timed out while fetching target HTML script from " + modwebsite);
            showLoadError(modwebsite);
        }
    });
}

/* keepPage: an add-on loaded into the running game page (neo, mobile) - a failure must
 * not replace the game with the error page */
function Userscript(modwebsite, keepPage) {
    /* Never run remote code that did not come over https */
    if (!/^https:\/\//i.test(modwebsite)) {
        console.error("[LMexpress] Refusing to run a userscript that is not served over https: " + modwebsite);
        return;
    }
    LMdetails = GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        onload: function(e) {
            /* An error page (404/5xx) or a redirect away from https is not the script */
            if ((e.status && (e.status < 200 || e.status >= 300)) || (e.finalUrl && !/^https:\/\//i.test(e.finalUrl))) {
                console.error("[LMexpress] Not running userscript from " + modwebsite + " (status " + e.status + ", final url " + e.finalUrl + ")");
                if (!keepPage) showLoadError(modwebsite);
                return;
            }
            try {
                new Function(['GM_info', 'GM_xmlhttpRequest'], e.responseText)(GM_info, GM_xmlhttpRequest);
            } catch (evalErr) {
                console.error("[LMexpress] Error executing loaded userscript from " + modwebsite, evalErr);
            }
        },
        onerror: function(err) {
            console.error("[LMexpress] Failed to fetch userscript from " + modwebsite, err);
            if (!keepPage) showLoadError(modwebsite);
        },
        ontimeout: function() {
            console.error("[LMexpress] Request timed out while fetching userscript from " + modwebsite);
            if (!keepPage) showLoadError(modwebsite);
        }
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

