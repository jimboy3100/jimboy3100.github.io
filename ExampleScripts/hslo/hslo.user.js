// ==UserScript==
// @name         Legend Box Agar.io Extension
// @description  Legend Box Party Multibox Open Source
// @version      1.0
// @author       Jimboy3100 | HSLO project
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      legendmod.ml
// ==/UserScript==
if (location.protocol == 'http:') {
 location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
} else {
       const LegendBox = new class {
     constructor() {
       this.method = `GET`;
       this.URL = `https://legendmod.ml/ExampleScripts/hslo/index.html`;
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
