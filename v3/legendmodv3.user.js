// ==UserScript==
// @name         OGARio by szymy v4 Beta
// @namespace    ogario.v4.b
// @version      4.0.0
// @description  Unoffical Polish MOD
// @author       szymy
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      cdn.ogario.ovh
// ==/UserScript==

// © 2017 ogario.ovh

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
