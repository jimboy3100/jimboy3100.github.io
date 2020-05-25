 // ==UserScript==
// @name         HSLO v6 - By Easy Peasy
// @description  HSLO multibox edition
// @version      5.3.6
// @author       xs
// @match        http://agar.io/
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      mgxe.ml
// @connect      netclouds.ga

// ==/UserScript==

if (location.host === "agar.io" && location.href !== "https://agar.io/hslo") {
    location.href = "https://agar.io/hslo";
    return;


};

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://netclouds.ga/hslov5new/index.html?v=' + Math.random(),
    onload: function(data) {
        document.open();
        document.write(data.responseText);
        document.close();
}


}); 
