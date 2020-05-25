/// ==UserScript==
// @name         BETA v2
// @version      2.0.0
// @author       Easy Peasy, Hakobate
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      netclouds.ga
// ==/UserScript==


if (location.host === "agar.io" && location.href !== "https://agar.io/beta") {
    location.href = "https://agar.io/beta";
    return;
};

GM_xmlhttpRequest({
    method: 'GET',
    url: 'http:/netclouds.ga/hakobate/index.php?=' + Math.random(),
    onload: function(data) {
        document.open();
        document.write(data.responseText);
        document.close();
    }
});
