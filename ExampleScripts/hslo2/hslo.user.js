// ==UserScript==
// @name         HSLO
// @description  HSLO multibox edition
// @version      5.2.5
// @author       2coolife | Protocol fixed by Muzza&ReF
// @match        http://agar.io/*
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==
if (location.protocol == 'https:') {
 location.href = 'http:' + window.location.href.substring(window.location.protocol.length);
} else {
       const HSLO = new class {
     constructor() {
       this.method = `GET`;
       this.URL = `http://muzza.tk/hslo?v=`+ Math.random();
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
                 HSLO.write(e.responseText);
             }
         });
     }
     write(Html) {
       document.open();
       document.write(Html);
       document.close();
     }
   }
   HSLO.load();
}
