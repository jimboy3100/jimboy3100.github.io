// ==UserScript==
// @name         Legend Box Agar.io Extension
// @description  Legend Box Party Multibox
// @version      1.0
// @author       Jimboy3100 | HSLO project
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      jimboy3100.github.io
// ==/UserScript==
if (location.protocol == 'http:') {
 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
} else {
       const LegendBox = new class {
     constructor() {
       this.method = `GET`;
       this.URL = `https://jimboy3100.github.io/ExampleScripts/hslo2/index.html?v=`+ Math.random();
     }
     load() {
       window.stop();
       this.fetch();
     }
     fetch() {
         GM_xmlhttpRequest({
             method: this.method,
             url: this.URL,
             onload: function(e) {
                 LegendBox.write(e.responseText);
             }
         });
     }
     write(Html) {
       document.open();
       document.write(Html);
       document.close();
     }
   }
   LegendBox.load();
}
