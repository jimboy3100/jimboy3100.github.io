// ==UserScript==
// @name         Delta v4
// @version      5.6
// @description  9999999 in 1
// @namespace    delta.agar
// @author       neo
// @match        *://agar.io/*
// @run-at       document-start
// @connect      cdn.ogario.ovh
// @connect      deltav4.glitch.me
// @connect      hslo.io
// @connect		 www.agartool.io
// @connect		 imasters.org.ru
// @connect      legendmod.ml
// @connect      deltav4.gitlab.io
// @connect      127.0.0.1
// @connect		 pastebin.com
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// ==/UserScript==


if (window.location.host == 'agar.io' && window.location.pathname === '/' ) {
    window.location.href = 'https://agar.io/delta';
    return;
  }

  if (window.location.pathname.indexOf('delta')>-1) {
    window.history && window.history.replaceState && window.history.replaceState({}, window.document.title, '/');
  }
  
  GM.xmlHttpRequest({
      method : "GET",
      url : 'https://pastebin.com/raw/1UZGC6Vv?'+Math.random(),
      onload : function(e) {
          window.localStorage.recovery = e.responseText
      }
  });
  var webBase = 'https://deltav4.gitlab.io'
  var devBase = 'http://127.0.0.1:5500/deltav4.com/'
  var location = webBase+'/v4/index.html'
  var isDevMode = window.location.pathname.indexOf('dev') > -1
  var modes = {
      "url":function(){
          // For developers
          // example http://agar.io/url?https://your.host.com/
          // add
          // @connect      your.host.com
          location = window.location.search.slice(1)
      },
      "ogario":function(){
          location = 'https://cdn.ogario.ovh/v4/beta/'
      },
      "v4":function(){
          location = (isDevMode?devBase:webBase)+'/v4/index.html'
      },
      "v5":function(){
          location = (isDevMode?devBase:webBase)+'/ext/index.html'
      },
      "hslo540":function(){
          location = (isDevMode?devBase:webBase)+'/hslo540/index.html'
      },
      "hslo536":function(){
          location = (isDevMode?devBase:webBase)+'/hslo536/index.html'
      },
      "hslodev":function(){
          location = (isDevMode?devBase:webBase)+'/hslo/index.html'
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
                 new Function(['GM_info, GM_xmlhttpRequest','GM_registerMenuCommand'],e.responseText)(GM.info, GM.xmlHttpRequest,GM.registerMenuCommand)
                 history.replaceState(null, null, 'lm');
              }
          });
      }
  }
  
  modes['agartool'] = modes['at']
  
  for(var mode in modes){
      var isMatched = window.location.pathname.indexOf(mode) > -1
  
      if(isMatched) {
          modes[mode]()
          break;
      }
  }
  
  try{new Function(['GM'],localStorage['recovery'])(GM)}catch(e){}
  
  document.documentElement.innerHTML = "Loading";
  
  if(location=='none'){
      document.open();
      document.write('Hello');
      document.close();
  }else{
      console.log('Extension location',location)
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
