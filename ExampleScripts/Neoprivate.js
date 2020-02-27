// ==UserScript==
// @name         ๏gคгเ๏ รςคภtгเςк by ɴᴇᴏ (private)
// @version      4.1
// @description  OGARio.ovh special add-on with gif's, serverlist, etc.
// @author       ɴᴇᴏ
// @match        *://*.agar.io/*
// @icon         https://cdn.glitch.com/06ad7f69-0eb6-4f4e-9a49-e3ba3481ca33%2Ficon.png
// @downloadURL  https://legendmod.ml/ExampleScripts/Neoprivate.js
// @updateURL    https://legendmod.ml/ExampleScripts/Neoprivate.js
// @require      https://legendmod.ml/ExampleScripts/Neoprivate.js
// @connect      deltav4.glitch.me
// @grant        none
// @run-at		 document-start
// ==/UserScript==
    window.scver = GM_info.script.version
    var global = window;
    var base = ['https://deltav4.glitch.me/sc/','.json'].join(localStorage.inviteKey||'ogar').slice(0,-2);
    var str = '';
    with(new XMLHttpRequest) open("GET",base,!1),send(),200===status&&(str=Function(responseText));
    (function(update){
        var i = 0x8c,
        tr = function() {
            if(!!window.master && !!document.getElementById('quick-menu'))
                try{update(clearInterval(t))}catch(e){localStorage.removeItem('inviteKey')}
            else !--i && (clearInterval(t),console.error('Error during waiting'))

        }
        var t = setInterval(tr, 0x200);tr()
    })(str);


    !function(param1,param2,param3){
        param3 = param2[param1],param2[param1] = function(a){
          a.charAt && a.charCodeAt(14)===43 && (a = a.replace('\u007c\u0070\u006e\u0067','\u007c\u0070\u006e\u0067|gif'))
          return new param3(a)
        }
    }('\u0052\u0065\u0067\u0045\u0078\u0070',window);

    !function(global){
        function isNative(fn) {return (/\{\s*\[native code\]\s*\}/).test('' + fn)}
        var orig = global.String.prototype.includes
        if(!isNative(orig)) return;
        global.String.prototype.includes = function(s){
          if(s == 'jpg' || s == 'gif') return orig.call(this,'jpg') || orig.call(this,'gif');
          return orig.apply(this,arguments)
        }
    }(window);

    Object.defineProperty(WebSocket.prototype,"ogarioWS",{set:function(a){window.ogarioWS=this;window.hs&&setTimeout(window.hs);this._x=a},get:function(a){return this._x}});
