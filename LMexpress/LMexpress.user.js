// ==UserScript==
// @name         Legend Express Agar.io Extension
// @namespace    Legend Express Agario Mod
// @version      1.7
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     https://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://legendmod.ml/banners/CropedImage128.gif
// @match        https://agar.io/*
// @match        https://play.google.com/*
// @downloadURL  https://legendmod.ml/LMexpress/LMexpress.user.js
// @updateURL    https://legendmod.ml/LMexpress/LMexpress.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      legendmod.ml
// ==/UserScript==

// Legend Mod by Jimboy3100
/*MIT License*/

// Check location
if (location.host === "agar.io" && location.pathname === "/") {
var url = window.location.href;
localStorage.setItem("url", url);
    location.href = "https://agar.io/legendmod" + location.hash;
    return;
}
var modVersion = GM_info.script.version;
// Inject Legend
function inject(page) {
    var page = page.replace("</body>", "<script>init('" + modVersion + "');</script>" + "</body>");
    return page;
}
document.documentElement.innerHTML = "";

var LMdetails = GM_xmlhttpRequest({
    method: "GET",
    url: "https://legendmod.ml/LMexpress/LMexpress.html",
	synchronous: false,
    onload: function(legend) {
        var doc = inject(legend.responseText);
        document.open();
       document.write(doc);
        setTimeout(function() {
            window.history.pushState(null, null, "/");
            mobilefunction(getOS());		
        }, 2000);
        document.close();
    }
});

if (location.host == "play.google.com") {
    window.close();
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

function getOS() {
  var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}
function mobilefunction(os) {
	if (os == 'Android' || os == 'iOS'){
		document.head.appendChild(document.createElement('script')).src = 'https://legendmod.ml/ExampleScripts/gamepad.user.js'
	}
}
