// ==UserScript==
// @name         Legend Agar.io Extension Tempory Edition
// @namespace    Legend Agar.io
// @version      2.2
// @description  Agario Mod - Legend,Ogario,Kitty,Old Skins,Animated Skins,Language Packs,Manual User Scripts,Chat,60++ Macros/Hotkeys(Tricksplit,Doublesplit,Quick Feeding,Popsplit,Auto Coins,Freeze Cell Macro,Auto respawn)
// @homepage     http://www.legendmod.ml
// @author       Jimboy3100
// @license      MIT
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        http://agar.io/*
// @match        https://talky.io/*
// @match        https://play.google.com/*
// @downloadURL  jimboy3100.github.io/legendmod.user.js
// @updateURL    jimboy3100.github.io/legendmod.user.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// ==/UserScript==
// Legend Mod by Jimboy3100
/*MIT License

// Check location
//if (location.host === "agar.io" && location.pathname === "/") {
//    location.href = "http://agar.io/ogario" + location.hash;
//   return;
//}

// Inject script
window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : "https://jimboy3100.github.io/v3/legendmodv3.html",
    onload : function(e) {
        document.open();
        document.write(e.responseText);
        document.close();
    }
});
