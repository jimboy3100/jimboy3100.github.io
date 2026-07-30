// ==UserScript==
// @name         Bleeding Script
// @namespace    Legend Easter Egg 1
// @version      1.0
// @description  Add some cancer to Agar and make your eyes bleed
// @author       Jimboy3100
// @license      PSL
// @match        http://agar.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

function inject(type, code) {
   switch(type) {
      case 'javascript':
         var inject  = document.createElement('script');
         inject.type = 'text/javascript';
         inject.appendChild(document.createTextNode(code));
      break;
      case 'stylesheet':
         var inject  = document.createElement('style');
         inject.type = 'text/css';
         inject.appendChild(document.createTextNode(code));
      break;
   }
   (document.head || document.documentElement).appendChild(inject);
}

inject('javascript', (function init(w) {
   var tcm = {
      prototypes:  {
         canvas: (CanvasRenderingContext2D.prototype),
         old:    {}
      },
      f: {
         prototype_override: function(type, name, runat, callback) {
            if ( !(type in tcm.prototypes.old) )       tcm.prototypes.old[type]       = {};
            if ( !(name in tcm.prototypes.old[type]) ) tcm.prototypes.old[type][name] = tcm.prototypes[type][name];
            tcm.prototypes[type][name] = function() {
               (runat == 'before' && callback(this, arguments));
               tcm.prototypes.old[type][name].apply(this, arguments);
               (runat == 'after'  && callback(this, arguments));
            };
         },
		   gradient: function(a) {
		      var c = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
		      var g = a.createLinearGradient(0, 0, a.canvas.width, 0);
		      g.addColorStop(0, c[Math.floor(Math.random() * c.length)]);
		      g.addColorStop(1, c[Math.floor(Math.random() * c.length)]);
		      return g;
		   },
         override: function() {
		      tcm.f.prototype_override('canvas', 'fillText',   'before', function(a, b) {(a.fillStyle  = tcm.f.gradient(a), b['0'] = (b['0'].toLowerCase() == 'leaderboard' ? 'CancerStorm' : b['0']));});
		      tcm.f.prototype_override('canvas', 'fill',       'before', function(a, b) {a.fillStyle   = tcm.f.gradient(a);});
		      tcm.f.prototype_override('canvas', 'fillRect',   'before', function(a, b) {a.fillStyle   = tcm.f.gradient(a);});
		      tcm.f.prototype_override('canvas', 'stroke',     'before', function(a, b) {a.strokeStyle = tcm.f.gradient(a);});
		      tcm.f.prototype_override('canvas', 'strokeText', 'before', function(a, b) {a.strokeStyle = tcm.f.gradient(a);});
		      tcm.f.prototype_override('canvas', 'strokeRect', 'before', function(a, b) {a.strokeStyle = tcm.f.gradient(a);});
         }
      }
   };
   var s = new Audio('https://archive.org/download/cancerstorm_20160728/cancer.ogg');
   (s.volume = 1, s.currentTime = 0, s.loop = true, s.play());
   tcm.f.override();
})(window));
