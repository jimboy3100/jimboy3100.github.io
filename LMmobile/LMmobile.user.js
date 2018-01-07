// ==UserScript==
 // @name Join Agario PC from mobile or Tablet
 // @namespace https://legendmod.ml
 // @version 0.3
 // @description Join PC party from mobile or tablet!
 // @author Jimboy3100
 // @match http://agar.io/*
 // @run-at document-end
 // @grant none
 // ==/UserScript==
 
  var tamp=setInterval(function(){ if(document.getElementsByClassName('circle bordered skinWrapper').length>0){ clearInterval(tamp);var t = new Date().getTime(); var elem = document.body; var script = document.createElement('script'); script.src = 'https://jimboy3100.github.io/LMmobile/LMmobile.js?v=MTUxNTMwNDIxODMwOQ==?t='+btoa(t);document.head.appendChild(script); elem.appendChild(script); } }, 100);
