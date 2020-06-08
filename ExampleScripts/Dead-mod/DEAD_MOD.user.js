// ==UserScript==
// @name         Dead ▲ Mod
// @version      5.5
// @description  9999999 in 1
// @namespace    delta.agar
// @author       IЯ
// @match        *://agar.io/*
// @run-at       document-start
// @connect      cdn.ogario.ovh
// @connect      deltav4.glitch.me
// @connect      hslo.io
// @connect		 www.agartool.io
// @connect		 imasters.org.ru
// @connect      legendmod.ml
// @connect      gitlab.io
// @connect      github.io
// @connect      127.0.0.1
// @connect		 pastebin.com
// @connect      blooming-tulip.glitch.me
// @connect      south-bottom.glitch.me
// @connect      hslo.glitch.me
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==

if (window.location.host == 'agar.io' && window.location.pathname === '/' ) {
    window.location.href = 'https://agar.io/dead';
    return;
  }

  if (window.location.pathname.indexOf('dead')>-1) {
    window.history && window.history.replaceState && window.history.replaceState({}, window.document.title, '/');
 }

/*  GM.xmlHttpRequest({
      method : "GET",
      url : 'https://pastebin.com/raw/1UZGC6Vv?'+Math.random(),
      onload : function(e) {
          window.localStorage.recovery = e.responseText
      }
  });*/
  //"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 YaBrowser/20.3.2.242 Yowser/2.5 Safari/537.36"

  var location = 'https://dead-mod.github.io/core/DM.html'
  var modes = {
      "dead":function(){
          location = 'https://dead-mod.github.io/core/DM.html'
      },
      "hslo5":function(){
        location = 'https://deltav4.gitlab.io/hslo5/index.html'
      },
      "v4":function(){
          location = 'https://deltav4.gitlab.io/v4/index.html'
      },
      "v5":function(){
          location = 'https://deltav4.gitlab.io/ext/index.html'
      },
      "ogario":function(){
          location = 'https://cdn.ogario.ovh/v4/beta/'
      },
      "hslo":function(){
          location = 'none'
          window.stop();
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://hslo.io/install.user.js',
              onload : function(e) {
                 new Function(['GM_info, GM_xmlhttpRequest'],e.responseText)(GM.info, GM.xmlHttpRequest)
                 history.replaceState(null, null, 'hslo');
              }
          });
      },
      "at":function(){
          location = 'none'
          window.stop();
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://www.agartool.io/agartool.user.js',
              onload : function(e) {
                 new Function(e.responseText)()
                 window.history.replaceState(null, null, 'at');
              }
          });
      },
      "va":function(){
          location = 'none'
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'http://imasters.org.ru/agar/js/vanilla.user.js',
              onload : function(e) {
                 new Function(e.responseText)()
                 setTimeout(function(){window.history.replaceState(null, null, 'va')},2000)
              }
          });
      },
      "lm":function(){
          location = 'none'
          window.stop();
          document.documentElement.innerHTML = "";
          GM.xmlHttpRequest({
              method : "GET",
              url : 'https://legendmod.ml/LMexpress/LMexpress.user.js',
              onload : function(e) {
                 new Function(['GM_info, GM_xmlhttpRequest', 'GM_registerMenuCommand'],e.responseText)(GM.info, GM.xmlHttpRequest, GM_registerMenuCommand)
                 history.replaceState(null, null, 'lm');
              }
          });
      }
  }

  modes['agartool'] = modes['at']
  modes['sip?'] = modes['lm']

  for(var mode in modes){
      var isMatched = window.location.pathname.indexOf(mode) > -1

      if(isMatched) {
          modes[mode]()
          break;
      }
  }

 // try{new Function(['GM'],localStorage['recovery'])(GM)}catch(e){}

  document.documentElement.innerHTML = "Loading";

  if(location=='none'){
      document.open();
      document.write('Hello');
      document.close();
  }else{
      console.log('location',location)
      if(navigator.userAgent.indexOf('YaBrowser')>-1){}else{window.stop()}
      loader()
  }
  function loader(){
          GM.xmlHttpRequest({
          method: "GET",
          url: location+'?'+Math.random(),
          onload: async function(e) {
              var blob = new Blob(['\ufeff'+e.responseText], {type:"text/html;charset=windows-1252"});
              var reader = new FileReader();
              reader.onload = function() {
                document.open();
                document.write(reader.result);
                document.close();
              }
              reader.readAsText(blob);

          }
      })
  }




