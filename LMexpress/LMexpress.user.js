// ==UserScript==
// @name         Legend Express Agar.io Extension
// @namespace    Legend Express Agario Mod
// @version      1.8.1
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
// @connect	 imasters.org.ru
// @connect	 cdn.ogario.ovh
// @connect      deltav4.glitch.me
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
    case 'vanilla':
        /* https only: code fetched over plain http could be swapped by anyone on the network path and would run on agar.io */
        modwebsite = 'https://imasters.org.ru/agar/js/vanilla.user.js';
        Userscript(modwebsite);
        break;		
    case 'ogario':
        modwebsite = 'https://cdn.ogario.ovh/v4/beta/ogario.v4.user.js';
        Userscript(modwebsite);
        break;		
    case 'delta':
        modwebsite = 'https://deltav4.glitch.me/v4/index.html';
        Htmlscript(modwebsite);
        break;
    case 'neo': 
        modwebsite = 'https://www.legendmod.ml/play.html?' + version;
        Htmlscript(modwebsite);
		setTimeout(function() {		
			modwebsite = 'https://jimboy3100.github.io/ExampleScripts/Neoprivate.js';
			Userscript(modwebsite);
		}, 5000);
	break;	
    case 'mobile': 
        modwebsite = 'https://www.legendmod.ml/play.html';
        Htmlscript(modwebsite);
		setTimeout(function() {		
			modwebsite = 'https://www.legendmod.ml/ExampleScripts/gamepad.user.js';
			Userscript(modwebsite);
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

function Htmlscript(modwebsite) {
    LMdetails = GM_xmlhttpRequest({
        method: "GET",
        url: modwebsite,
        synchronous: false,
        onload: function(legend) {
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
        },
        ontimeout: function() {
            console.error("[LMexpress] Request timed out while fetching target HTML script from " + modwebsite);
        }
    });
}

function Userscript(modwebsite) {
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
        },
        ontimeout: function() {
            console.error("[LMexpress] Request timed out while fetching userscript from " + modwebsite);
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

