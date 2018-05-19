'use strict';
/** @type {!Array} */
var _0x217b = ["color2Hex", "smallerCellsCache", "push", "STECellsCache", "biggerCellsCache", "biggerSTECellsCache", "prototype", "ogarioCtx", "_fillRect", "fillRect", "_fillText", "fillText", "displayLeaderboard", "leaderboardHTML", ":teams", "gameMode", "leaderboardIndex", "indexOf", "replace", "&lt;", "&gt;", "#ffaaaa", "fillStyle", '<span class="me">', "</span>", "clanTag", '<span class="teammate">', "<span>", "play", "&amp;", "apply", "ogario", "#999999", "mapOffsetX", "mapOffset", "mapOffsetY", 
"mapOffsetFixed", "cursorX", "clientX", "innerW", "canvasScale", "viewScale", "playerX", "cursorY", "clientY", "innerH", "playerY", "min", "targetY", "targetDistance", "round", "pow", "playerCellsMass", "length", "playerBestMass", "playerMass", "virColors", "splitRange", "oppColors", "oppRings", "showStatsSTE", "playerMinMass", "playerMaxMass", "selectBiggestCell", "STE", "floor"];
(function(params, content) {
  /**
   * @param {?} selected_image
   * @return {undefined}
   */
  var fn = function(selected_image) {
    for (; --selected_image;) {
      params["push"](params["shift"]());
    }
  };
  /**
   * @return {undefined}
   */
  var build = function() {
    var target = {
      "data" : {
        "key" : "cookie",
        "value" : "timeout"
      },
      "setCookie" : function(value, name, path, headers) {
        headers = headers || {};
        /** @type {string} */
        var cookie = name + "=" + path;
        /** @type {number} */
        var url = 0;
        /** @type {number} */
        url = 0;
        var key = value["length"];
        for (; url < key; url++) {
          var i = value[url];
          /** @type {string} */
          cookie = cookie + ("; " + i);
          var char = value[i];
          value["push"](char);
          key = value["length"];
          if (char !== !![]) {
            /** @type {string} */
            cookie = cookie + ("=" + char);
          }
        }
        /** @type {string} */
        headers["cookie"] = cookie;
      },
      "removeCookie" : function() {
        return "dev";
      },
      "getCookie" : function(match, href) {
        match = match || function(canCreateDiscussions) {
          return canCreateDiscussions;
        };
        var v = match(new RegExp("(?:^|; )" + href["replace"](/([.$?*|{}()[]\/+^])/g, "$1") + "=([^;]*)"));
        /**
         * @param {!Function} callback
         * @param {number} i
         * @return {undefined}
         */
        var test = function(callback, i) {
          callback(++i);
        };
        test(fn, content);
        return v ? decodeURIComponent(v[1]) : undefined;
      }
    };
    /**
     * @return {?}
     */
    var init = function() {
      /** @type {!RegExp} */
      var test = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
      return test["test"](target["removeCookie"]["toString"]());
    };
    /** @type {function(): ?} */
    target["updateCookie"] = init;
    /** @type {string} */
    var array = "";
    var _0x5b618f = target["updateCookie"]();
    if (!_0x5b618f) {
      target["setCookie"](["*"], "counter", 1);
    } else {
      if (_0x5b618f) {
        array = target["getCookie"](null, "counter");
      } else {
        target["removeCookie"]();
      }
    }
  };
  build();
})(_0x217b, 295);
/**
 * @param {string} i
 * @param {?} parameter1
 * @return {?}
 */
var _0xb217 = function(i, parameter1) {
  /** @type {number} */
  i = i - 0;
  var oembedView = _0x217b[i];
  return oembedView;
};
!function() {
  var getAlignItem = function() {
    /** @type {boolean} */
    var closeExpr = !![];
    return function(object__360, function__361) {
      /** @type {!Function} */
      var closingExpr = closeExpr ? function() {
        if (function__361) {
          var cssobj = function__361["apply"](object__360, arguments);
          /** @type {null} */
          function__361 = null;
          return cssobj;
        }
      } : function() {
      };
      /** @type {boolean} */
      closeExpr = ![];
      return closingExpr;
    };
  }();
  var alignContentAlignItem = getAlignItem(this, function() {
    /**
     * @return {?}
     */
    var intval = function() {
      return "dev";
    };
    /**
     * @return {?}
     */
    var getDOMPath = function() {
      return "window";
    };
    /**
     * @return {?}
     */
    var testcase = function() {
      /** @type {!RegExp} */
      var test = new RegExp("\\w+ *\\(\\) *{\\w+ *['|\"].+['|\"];? *}");
      return !test["test"](intval["toString"]());
    };
    /**
     * @return {?}
     */
    var _stringify = function() {
      /** @type {!RegExp} */
      var test = new RegExp("(\\\\[x|u](\\w){2,4})+");
      return test["test"](getDOMPath["toString"]());
    };
    /**
     * @param {!Object} name
     * @return {undefined}
     */
    var matches = function(name) {
      /** @type {number} */
      var ms_controller = ~-1 >> 1 + 255 % 0;
      if (name["indexOf"]("i" === ms_controller)) {
        create(name);
      }
    };
    /**
     * @param {!Object} func
     * @return {undefined}
     */
    var create = function(func) {
      /** @type {number} */
      var _0x28d8a5 = ~-4 >> 1 + 255 % 0;
      if (func["indexOf"]((!![] + "")[3]) !== _0x28d8a5) {
        matches(func);
      }
    };
    if (!testcase()) {
      if (!_stringify()) {
        matches("ind\u0435xOf");
      } else {
        matches("indexOf");
      }
    } else {
      matches("ind\u0435xOf");
    }
  });
  alignContentAlignItem();
  window[_0xb217("0x0")] = {
    "play" : false,
    "spectate" : false,
    "gameMode" : "",
    "clanTag" : "",
    "playerColor" : null,
    "playerX" : 0,
    "playerY" : 0,
    "playerCells" : [],
    "playerCellsMass" : [],
    "playerMass" : 0,
    "playerMinMass" : 0,
    "playerMaxMass" : 0,
    "playerBestMass" : null,
    "STE" : null,
    "mapSize" : 14142,
    "mapOffset" : 7071,
    "mapOffsetX" : 0,
    "mapOffsetY" : 0,
    "mapOffsetFixed" : false,
    "mapMinX" : -7071,
    "mapMinY" : -7071,
    "mapMaxX" : 7071,
    "mapMaxY" : 7071,
    "zoomValue" : 1,
    "zoomResetValue" : 0,
    "zoomSpeedValue" : .9,
    "viewScale" : 1,
    "canvasScale" : 1,
    "animation" : 140,
    "innerW" : 0,
    "innerH" : 0,
    "cursorX" : 0,
    "cursorY" : 0,
    "clientX" : 0,
    "clientY" : 0,
    "targetX" : 0,
    "targetY" : 0,
    "targetDistance" : 0,
    "menuHeight" : 618,
    "leaderboardHTML" : "",
    "leaderboardIndex" : 1,
    "foodCache" : [],
    "virusesCache" : [],
    "biggerSTECellsCache" : [],
    "biggerCellsCache" : [],
    "smallerCellsCache" : [],
    "STECellsCache" : [],
    "virusColor" : "#999999",
    "virusStrokeColor" : _0xb217("0x1"),
    "gloabalAlpha" : 1,
    "cellsAlpha" : .9,
    "skinsAlpha" : .7,
    "virusAlpha" : .6,
    "virusStrokeSize" : 14,
    "autoZoom" : false,
    "autoHideFood" : false,
    "autoHideFoodOnZoom" : false,
    "vanillaSkins" : false,
    "customSkins" : true,
    "myTransparentSkin" : false,
    "myCustomColor" : false,
    "transparentCells" : false,
    "transparentViruses" : true,
    "transparentSkins" : false,
    "rainbowFood" : false,
    "oppColors" : false,
    "oppRings" : false,
    "virColors" : false,
    "splitRange" : false,
    "virusesRange" : false,
    "cursorTracking" : false,
    "showStatsSTE" : false,
    "showFood" : true,
    "foodIsHidden" : false,
    "showCustomSkins" : true,
    "selectBiggestCell" : true,
    "hideSmallBots" : false,
    "pause" : false,
    "targeting" : false,
    "getWS" : null,
    "displayLeaderboard" : null,
    "drawGrid" : null,
    "customDraw" : null,
    "drawCellInfo" : null,
    "setOppColor" : null,
    "setVirusColor" : null,
    "setVirusStrokeColor" : null,
    "getString" : null,
    "getCustomSkin" : null,
    "setMapCoords" : function(boardManager, isSlidingUp, $cont, $slides, callback, scopeIn) {
      if (scopeIn - callback == 24 && $cont - boardManager > 14E3 && $slides - isSlidingUp > 14E3) {
        /** @type {number} */
        this[_0xb217("0x2")] = this[_0xb217("0x3")] - $cont;
        /** @type {number} */
        this[_0xb217("0x4")] = this[_0xb217("0x3")] - $slides;
        /** @type {boolean} */
        this[_0xb217("0x5")] = true;
      }
    },
    "setCursorPosition" : function() {
      this[_0xb217("0x6")] = (this[_0xb217("0x7")] - this[_0xb217("0x8")] / 2) * this[_0xb217("0x9")] / this[_0xb217("0xa")] + this[_0xb217("0xb")];
      this[_0xb217("0xc")] = (this[_0xb217("0xd")] - this[_0xb217("0xe")] / 2) * this[_0xb217("0x9")] / this[_0xb217("0xa")] + this[_0xb217("0xf")];
    },
    "setTargetPosition" : function(index, value) {
      /** @type {number} */
      index = index - this[_0xb217("0x2")];
      /** @type {number} */
      value = value - this[_0xb217("0x4")];
      /** @type {number} */
      var n = ((index - this[_0xb217("0xb")]) * this[_0xb217("0xa")] + this[_0xb217("0x8")] / 2) * this["canvasScale"];
      /** @type {number} */
      var t = ((value - this[_0xb217("0xf")]) * this[_0xb217("0xa")] + this[_0xb217("0xe")] / 2) * this["canvasScale"];
      this["targetX"] = n > 0 ? Math[_0xb217("0x10")](n, this[_0xb217("0x8")]) : 0;
      this[_0xb217("0x11")] = t > 0 ? Math[_0xb217("0x10")](t, this[_0xb217("0xe")]) : 0;
      this[_0xb217("0x12")] = Math[_0xb217("0x13")](Math["sqrt"](Math[_0xb217("0x14")](this[_0xb217("0xb")] - index, 2) + Math[_0xb217("0x14")](this[_0xb217("0xf")] - value, 2)));
    },
    "resetTargetPosition" : function() {
      /** @type {number} */
      this["targetX"] = this[_0xb217("0x8")] / 2 * this[_0xb217("0x9")];
      /** @type {number} */
      this[_0xb217("0x11")] = this[_0xb217("0xe")] / 2 * this[_0xb217("0x9")];
    },
    "calculateMass" : function() {
      if (0 != this[_0xb217("0x15")][_0xb217("0x16")]) {
        if ((this["playerMass"] > this[_0xb217("0x17")] || !this[_0xb217("0x17")]) && (this[_0xb217("0x17")] = this[_0xb217("0x18")]), this[_0xb217("0x19")] || this[_0xb217("0x1a")] || this[_0xb217("0x1b")] || this[_0xb217("0x1c")] || this[_0xb217("0x1d")]) {
          this[_0xb217("0x1e")] = this[_0xb217("0x15")][0];
          this["playerMaxMass"] = this["playerCellsMass"][0];
          /** @type {number} */
          var indexLookupKey = 1;
          for (; indexLookupKey < this[_0xb217("0x15")][_0xb217("0x16")]; indexLookupKey++) {
            if (this[_0xb217("0x15")][indexLookupKey] < this[_0xb217("0x1e")]) {
              this[_0xb217("0x1e")] = this["playerCellsMass"][indexLookupKey];
            } else {
              if (this[_0xb217("0x15")][indexLookupKey] > this[_0xb217("0x1f")]) {
                this["playerMaxMass"] = this[_0xb217("0x15")][indexLookupKey];
              }
            }
          }
        }
        if (this[_0xb217("0x1d")]) {
          var val = this[_0xb217("0x20")] ? this[_0xb217("0x1f")] : this["playerMinMass"];
          this[_0xb217("0x21")] = val > 35 ? Math[_0xb217("0x22")](val * (1E3 > val ? .35 : .38)) : null;
        }
      }
    },
    "color2Hex" : function(intval) {
      var shapePathsCollection = intval["toString"](16);
      return 1 == shapePathsCollection["length"] ? "0" + shapePathsCollection : shapePathsCollection;
    },
    "rgb2Hex" : function(r, g, b) {
      return "#" + this[_0xb217("0x23")](r) + this[_0xb217("0x23")](g) + this[_0xb217("0x23")](b);
    },
    "cacheCells" : function(xRel, yRel, gb) {
      var touchStretch = Math["floor"](gb * gb / 100);
      var lastTouchStretch = this[_0xb217("0x20")] ? this[_0xb217("0x1f")] : this["playerMinMass"];
      /** @type {number} */
      var costSum = touchStretch / lastTouchStretch;
      /** @type {number} */
      var gasSum = 1E3 > lastTouchStretch ? .35 : .38;
      return 2.5 > costSum ? 1.25 > costSum ? 1.25 > costSum && costSum > .75 ? void 0 : costSum > gasSum ? void this[_0xb217("0x24")][_0xb217("0x25")]({
        "x" : xRel,
        "y" : yRel,
        "size" : gb
      }) : void this[_0xb217("0x26")][_0xb217("0x25")]({
        "x" : xRel,
        "y" : yRel,
        "size" : gb
      }) : void this[_0xb217("0x27")][_0xb217("0x25")]({
        "x" : xRel,
        "y" : yRel,
        "size" : gb
      }) : void this[_0xb217("0x28")][_0xb217("0x25")]({
        "x" : xRel,
        "y" : yRel,
        "size" : gb
      });
    }
  };
  /** @type {boolean} */
  CanvasRenderingContext2D[_0xb217("0x29")][_0xb217("0x2a")] = false;
  CanvasRenderingContext2D[_0xb217("0x29")][_0xb217("0x2b")] = CanvasRenderingContext2D["prototype"][_0xb217("0x2c")];
  /**
   * @return {undefined}
   */
  CanvasRenderingContext2D["prototype"][_0xb217("0x2c")] = function() {
  };
  CanvasRenderingContext2D["prototype"][_0xb217("0x2d")] = CanvasRenderingContext2D[_0xb217("0x29")][_0xb217("0x2e")];
  /**
   * @return {?}
   */
  CanvasRenderingContext2D[_0xb217("0x29")]["fillText"] = function() {
    var str = arguments[0];
    if ("Leaderboard" === str) {
      return window[_0xb217("0x0")][_0xb217("0x2f")] && window[_0xb217("0x0")]["displayLeaderboard"](), window["ogario"]["leaderboardIndex"] = 1, void(window[_0xb217("0x0")][_0xb217("0x30")] = "");
    }
    if (_0xb217("0x31") !== window[_0xb217("0x0")][_0xb217("0x32")]) {
      if (window[_0xb217("0x0")][_0xb217("0x33")] <= 10 && 0 == str[_0xb217("0x34")](window[_0xb217("0x0")][_0xb217("0x33")] + ".")) {
        return str = str[_0xb217("0x35")](/&/g, "&amp;")[_0xb217("0x35")](/</g, _0xb217("0x36"))[_0xb217("0x35")](/>/g, _0xb217("0x37")), window[_0xb217("0x0")][_0xb217("0x30")] += _0xb217("0x38") === this[_0xb217("0x39")] ? _0xb217("0x3a") + str + _0xb217("0x3b") : 3 == str[_0xb217("0x34")](window[_0xb217("0x0")]["clanTag"]) || 4 == str[_0xb217("0x34")](window["ogario"][_0xb217("0x3c")]) && 10 == window[_0xb217("0x0")][_0xb217("0x33")] ? _0xb217("0x3d") + str + _0xb217("0x3b") : _0xb217("0x3e") + 
        str + _0xb217("0x3b"), void window[_0xb217("0x0")][_0xb217("0x33")]++;
      }
      if (11 == window["ogario"][_0xb217("0x33")] && window[_0xb217("0x0")][_0xb217("0x3f")] && _0xb217("0x38") === this[_0xb217("0x39")]) {
        return str = str["replace"](/&/g, _0xb217("0x40"))[_0xb217("0x35")](/</g, _0xb217("0x36"))[_0xb217("0x35")](/>/g, _0xb217("0x37")), window[_0xb217("0x0")][_0xb217("0x30")] += _0xb217("0x3a") + str + "</span>", void window[_0xb217("0x0")][_0xb217("0x33")]++;
      }
    }
    this[_0xb217("0x2d")][_0xb217("0x41")](this, arguments);
  };
}();
