'use strict';
/** @type {!Array} */
var _0x4181 = ["lineCap", "reduce", "lineTo", "onPlayerDeath", "isNamePresent", "isPlayerIDPresent", "bit1", "bit6", "bit7", "bit8", "setLeaderboard", "isFriend", "setMapCoords", "gameMode", "x: ", "log", "y: ", "unknown: ", "recaptchaRequested", "dispatchEvent", "fullSpectate", "showOutdatedClientDialog", "TRUE", "battleStatus", "dangerZoneX", "dangerZoneY", "dangerZoneSize", "safeZoneSize", "onPlayerDeathBattle", "updateServerVersion", "playerConnected", "onConnect", "slice", "min", "setInterval", 
"minY", "maxX", "maxY", "isArray", "CoreExposed", "network", "_host", "[ERROR] Could not set MC Server: ", "arraybuffer", "performance", "now", "onclose", "target", "data", "playerSpectated", "pow", "sfxSplit", "replace", ".png", "Could not add named skin", "console", "Could not add custom skin", "writeUTF8String", "substring", "https://cdn.agartool.io/images/check.png", "https://cdn.agartool.io/images/partymode-ingame-icon.png", "https://cdn.agartool.io/images/partymode-leaderboard-bigperson.png", 
"requestAnimationFrame", "innerHeight", "#messageTempContainer", "left", "css", "bottom", "#messageCompleteContainer", ".playerNameInMsg", "max-width", "font-size", "border-spacing", ".chatRow", ".chatTDName", "padding-left", "border-width", ".chatTDMessage", "padding-right", "update", "startRendering", "autoZoom", "playerY", "POSITIVE_INFINITY", "Number", "NEGATIVE_INFINITY", "insert", "acidMode", "#111111", "#F2FBFF", "darkTheme", "translate", "drawPellet", "draw", "rect", "rgba(255, 0, 0, 0.3)", 
"setTransform", "FPS: ", "showFPS", "Score: ", " friend", "#8A8A8A", "showQuest", "getQuestProgressLabel", "checkQuestComplete", "sfxCompleteQuestIngame", "Survive!", "Waiting for players...", "Your computer is running slow,", "please close other applications or tabs in your browser for better game performance.", "Stay inside the safe area and survive as long as you can!", "Safe area shrinking in ", "Go to safe area!", "sqrt", "cos", "atan2", "rgb(0, 0, 0)", "rotate", "rgb(255, 255, 255)", "onAgarioCoreLoaded", 
"#333333", "#FF3333", "#33FF33", "#3333FF", "got squashed by a virus", "crashed into a virus", "never saw it coming", "is no more", "said goodbye", "ate", "absorbed", "wasted", "slayed", "#000000", "getImage", "hasOwnProperty", "getProfilePicture", "playSound", "toString", "imul", "Math", "length", "charAt", "parseInt", "substr", "indexOf", "writeOffset", "readOffset", "error", "set", "array", "get", "setCommandID", "writeUInt8", "readComplete", "xorCrypt", "readRemainingData", "readBytes", "readInt8", 
"canRead", "readUInt8", "readInt16", "readInt32", "String", "fromCharCode", "readFloat", "readFloat64", "writeBytes", "writeUInt16", "writeUInt32", "charCodeAt", "readyState", "OPEN", "WebSocket", "dontNotifyMC", "onDisconnect", "AgarTool", "onmessage", "onerror", "close", "floor", "size", "color", "stroke", "Boolean", "textCache", "setValue", "timeCreated", "strokeColor", "imageContainer", "oSize", "points", "send", "Uint8Array", "Players Ready: ", "Players Alive: ", "document", "createElement", 
"canvas", "getContext", "width", "height", "globalAlpha", "fillStyle", "fillRect", "font", "30px Ubuntu", "fillText", "measureText", "#FFFFFF", "Leaderboard", "moveTo", "arc", "fill", "settings", "checkboxes", "scale", "isMine", "friendID", "name", "An unnamed cell", "noNames", "textboxes", "nick", "#FFAAAA", "#FFFF00", "showFacebookImages", "drawImage", "split", "prototype", "dirty", "value", "px Ubuntu", "ctx", "lineWidth", "strokeStyle", "strokeText", "destroyed", "completed", "timeCompleted", 
"opacity", "save", "setScale", "render", "image", "Image", "setTimeout", "lastUse", "src", "isLoaded", "splice", "drawCount", "push", "getNumPoints", "random", "isPellet", "isVirus", "round", "createPoints", "biggestPoint", "max", "updateTime", "eatenBy", "nSize", "abs", "destroyedAlphaNum", "skinName", "toLowerCase", "skin", "includes", "custom_", "loadCustomSkin", "beginPath", "updatePos", "shouldRender", "wasSimpleDrawing", "fillColor", "noColors", "#AAAAAA", "movingBorders", "movePoints", "drawPoints", 
"lineJoin", "disableCellStroke", "noSkins", "isEjectedMass", "customSkins", "drawName", "clip", "restore", "miter", "#00C8FF", "#BE00FF", "enemySplitRange", "nameCache", "disableNameStroke", "setStroke", "setSize", "autoHideMass", "sizeCache", "disableMassStroke", "innerWidth", "stopMovement", "readUInt32", "readUTF8String", "readUInt16", "sfxEatCell", "sfxShoot", "setName", "playerSpawned", "onPlayerSpawn", "setCurrentSkin", "sort", "playerDied", "getElementById", "statsGraph", "clearRect"];
(function(data, i) {
  /**
   * @param {number} isLE
   * @return {undefined}
   */
  var write = function(isLE) {
    for (; --isLE;) {
      data["push"](data["shift"]());
    }
  };
  write(++i);
})(_0x4181, 120);
/**
 * @param {string} i
 * @param {?} parameter1
 * @return {?}
 */
var _0x3001 = function(i, parameter1) {
  /** @type {number} */
  i = i - 0;
  var oembedView = _0x4181[i];
  return oembedView;
};
!function(window) {
  /**
   * @param {?} name
   * @return {?}
   */
  function copy(name) {
    if (-1 === name) {
      return unexpectedPackets[_0x3001("0xe")]();
    }
    if (params[_0x3001("0xf")](name)) {
      return params[name][_0x3001("0xe")]();
    }
    if (window["MC"] && window["MC"][_0x3001("0x10")]) {
      var value = window["MC"][_0x3001("0x10")](name);
      if ("" !== value) {
        return params[name] = new Map(value), params[name][_0x3001("0xe")]();
      }
    }
    return unexpectedPackets[_0x3001("0xe")]();
  }
  /**
   * @param {string} actionlist
   * @return {undefined}
   */
  function remove(actionlist) {
    if (window["MC"] && window["MC"][_0x3001("0x11")]) {
      window["MC"]["playSound"](actionlist);
    }
  }
  /**
   * @param {string} name
   * @return {?}
   */
  function _validateCaptcha(name) {
    name = name[_0x3001("0x12")](16);
    for (; name["length"] < 6;) {
      /** @type {string} */
      name = "0" + name;
    }
    return "#" + name;
  }
  /**
   * @param {number} t
   * @return {?}
   */
  function normalize(t) {
    return t = window["Math"][_0x3001("0x13")](t, 1540483477), t = 114296087 ^ window[_0x3001("0x14")][_0x3001("0x13")](t >>> 24 ^ t, 1540483477), t = window[_0x3001("0x14")][_0x3001("0x13")](t >>> 13 ^ t, 1540483477), t = t ^ t >>> 15;
  }
  /**
   * @param {!Array} lib
   * @param {number} id
   * @param {number} len
   * @param {number} index
   * @param {number} x
   * @param {number} d
   * @param {boolean} options
   * @return {?}
   */
  function build(lib, id, len, index, x, d, options) {
    var i;
    var ourSplitFirstPartSolution;
    var ref = lib[_0x3001("0x15")];
    /** @type {string} */
    var equationStringAfterSplitParse = "";
    /** @type {number} */
    i = 0;
    for (; i < ref; i = i + 1) {
      ourSplitFirstPartSolution = lib[i][_0x3001("0x12")](2);
      for (; ourSplitFirstPartSolution[_0x3001("0x15")] < 8;) {
        /** @type {string} */
        ourSplitFirstPartSolution = "0" + ourSplitFirstPartSolution;
      }
      if (options) {
        /** @type {string} */
        equationStringAfterSplitParse = ourSplitFirstPartSolution + equationStringAfterSplitParse;
      } else {
        /** @type {string} */
        equationStringAfterSplitParse = equationStringAfterSplitParse + ourSplitFirstPartSolution;
      }
    }
    /** @type {number} */
    var length_delta = "1" === equationStringAfterSplitParse[_0x3001("0x16")](0) ? -1 : 1;
    /** @type {number} */
    var k1 = window[_0x3001("0x17")](equationStringAfterSplitParse[_0x3001("0x18")](id, len), 2) - d;
    var page = equationStringAfterSplitParse[_0x3001("0x18")](id + len, index);
    /** @type {string} */
    var params = "1" + page;
    /** @type {number} */
    i = 0;
    /** @type {number} */
    var accumulator = 1;
    /** @type {number} */
    var occurences = 0;
    if (k1 === -d) {
      if (-1 === page[_0x3001("0x19")]("1")) {
        return 0;
      }
      /** @type {number} */
      k1 = x;
      /** @type {string} */
      params = "0" + page;
    }
    for (; i < params["length"];) {
      /** @type {number} */
      occurences = occurences + accumulator * window["parseInt"](params[_0x3001("0x16")](i));
      /** @type {number} */
      accumulator = accumulator / 2;
      /** @type {number} */
      i = i + 1;
    }
    return length_delta * occurences * window["Math"]["pow"](2, k1);
  }
  /**
   * @return {undefined}
   */
  function Error() {
    /** @type {number} */
    this[_0x3001("0x1a")] = 0;
    /** @type {number} */
    this[_0x3001("0x1b")] = 0;
    /** @type {!Array} */
    this["array"] = [];
    /** @type {boolean} */
    this[_0x3001("0x1c")] = false;
    /**
     * @param {?} canCreateDiscussions
     * @return {undefined}
     */
    this[_0x3001("0x1d")] = function(canCreateDiscussions) {
      this[_0x3001("0x1e")] = canCreateDiscussions;
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x1f")] = function() {
      return this[_0x3001("0x1e")];
    };
    /**
     * @param {?} mmCoreSplitViewBlock
     * @return {undefined}
     */
    this[_0x3001("0x20")] = function(mmCoreSplitViewBlock) {
      /** @type {number} */
      this[_0x3001("0x1a")] = 0;
      /** @type {number} */
      this[_0x3001("0x1b")] = 0;
      /** @type {!Array} */
      this[_0x3001("0x1e")] = [];
      this[_0x3001("0x21")](mmCoreSplitViewBlock);
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x22")] = function() {
      return this[_0x3001("0x1b")] === this[_0x3001("0x1e")][_0x3001("0x15")] || (this[_0x3001("0x1b")] > this[_0x3001("0x1e")]["length"] ? (this[_0x3001("0x1e")][_0x3001("0x15")], this[_0x3001("0x1b")], true) : !!this["error"] && (this["array"][_0x3001("0x12")](), true));
    };
    /**
     * @param {?} canCreateDiscussions
     * @return {?}
     */
    this["canRead"] = function(canCreateDiscussions) {
      return !(this[_0x3001("0x1b")] + canCreateDiscussions > this["array"][_0x3001("0x15")]) || (this[_0x3001("0x1c")] = true, this[_0x3001("0x1b")], this[_0x3001("0x1e")][_0x3001("0x15")], false);
    };
    /**
     * @param {number} canCreateDiscussions
     * @return {undefined}
     */
    this[_0x3001("0x23")] = function(canCreateDiscussions) {
      if (!lastTrackInfoUrl) {
        var i;
        /** @type {!Array} */
        var GUID_ODTTF = [255 & canCreateDiscussions, canCreateDiscussions >> 8 & 255, canCreateDiscussions >> 16 & 255, canCreateDiscussions >> 24 & 255];
        /** @type {number} */
        i = 0;
        for (; i < this["array"][_0x3001("0x15")]; i = i + 1) {
          this[_0x3001("0x1e")][i] ^= GUID_ODTTF[i % 4];
        }
      }
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x24")] = function() {
      return this[_0x3001("0x25")](this["array"]["length"] - this["readOffset"]);
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x26")] = function() {
      if (!this[_0x3001("0x27")](1)) {
        return null;
      }
      var _0x5dc5be = this[_0x3001("0x1e")][this[_0x3001("0x1b")]];
      return this[_0x3001("0x1b")] += 1, _0x5dc5be;
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x28")] = function() {
      if (!this[_0x3001("0x27")](1)) {
        return null;
      }
      var _0x5dc5be = this["array"][this[_0x3001("0x1b")]];
      return this[_0x3001("0x1b")] += 1, 255 & _0x5dc5be;
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x29")] = function() {
      if (!this["canRead"](2)) {
        return null;
      }
      var value = this[_0x3001("0x1e")][this[_0x3001("0x1b")]];
      return value = value | this[_0x3001("0x1e")][this[_0x3001("0x1b")] + 1] << 8, this[_0x3001("0x1b")] += 2, (new Int16Array([value]))[0];
    };
    /**
     * @return {?}
     */
    this["readUInt16"] = function() {
      if (!this[_0x3001("0x27")](2)) {
        return null;
      }
      var _0x5dc5be = this["array"][this[_0x3001("0x1b")]];
      return _0x5dc5be = _0x5dc5be | this[_0x3001("0x1e")][this["readOffset"] + 1] << 8, this[_0x3001("0x1b")] += 2, 65535 & _0x5dc5be;
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x2a")] = function() {
      if (!this[_0x3001("0x27")](4)) {
        return null;
      }
      var _0x5dc5be = this[_0x3001("0x1e")][this[_0x3001("0x1b")]];
      return _0x5dc5be = _0x5dc5be | this[_0x3001("0x1e")][this[_0x3001("0x1b")] + 1] << 8, _0x5dc5be = _0x5dc5be | this[_0x3001("0x1e")][this[_0x3001("0x1b")] + 2] << 16, _0x5dc5be = _0x5dc5be | this["array"][this[_0x3001("0x1b")] + 3] << 24, this["readOffset"] += 4, _0x5dc5be;
    };
    /**
     * @return {?}
     */
    this["readUInt32"] = function() {
      if (!this[_0x3001("0x27")](4)) {
        return null;
      }
      var _0x5dc5be = this[_0x3001("0x1e")][this["readOffset"]];
      return _0x5dc5be = _0x5dc5be | this[_0x3001("0x1e")][this[_0x3001("0x1b")] + 1] << 8, _0x5dc5be = _0x5dc5be | this[_0x3001("0x1e")][this[_0x3001("0x1b")] + 2] << 16, _0x5dc5be = _0x5dc5be | this[_0x3001("0x1e")][this[_0x3001("0x1b")] + 3] << 24, this[_0x3001("0x1b")] += 4, _0x5dc5be >>> 0;
    };
    /**
     * @return {?}
     */
    this["readUTF8String"] = function() {
      /** @type {!Array} */
      var data = [];
      /** @type {number} */
      var duration = 0;
      for (;;) {
        if (!this[_0x3001("0x27")](1)) {
          return null;
        }
        if (0 === this["array"][this["readOffset"]]) {
          this[_0x3001("0x1b")] += 1;
          break;
        }
        data[duration] = this[_0x3001("0x1e")][this["readOffset"]];
        this[_0x3001("0x1b")] += 1;
        /** @type {number} */
        duration = duration + 1;
      }
      return function(data) {
        var i;
        var offset;
        var _0x12564e;
        /** @type {string} */
        var newInput = "";
        /** @type {number} */
        i = 0;
        for (; i < data[_0x3001("0x15")]; i = i + 1) {
          if ((offset = data[i]) < 128) {
            newInput = newInput + window[_0x3001("0x2b")][_0x3001("0x2c")](offset);
          } else {
            if (offset > 191 && offset < 224) {
              newInput = newInput + window["String"]["fromCharCode"]((31 & offset) << 6 | 63 & data[i + 1]);
              /** @type {number} */
              i = i + 1;
            } else {
              if (offset > 223 && offset < 240) {
                newInput = newInput + window[_0x3001("0x2b")][_0x3001("0x2c")]((15 & offset) << 12 | (63 & data[i + 1]) << 6 | 63 & data[i + 2]);
                /** @type {number} */
                i = i + 2;
              } else {
                /** @type {number} */
                _0x12564e = ((7 & offset) << 18 | (63 & data[i + 1]) << 12 | (63 & data[i + 2]) << 6 | 63 & data[i + 3]) - 65536;
                newInput = newInput + window["String"]["fromCharCode"](_0x12564e >> 10 | 55296, 1023 & _0x12564e | 56320);
                /** @type {number} */
                i = i + 3;
              }
            }
          }
        }
        return newInput;
      }(data);
    };
    /**
     * @param {number} mmCoreSplitViewBlock
     * @return {?}
     */
    this[_0x3001("0x25")] = function(mmCoreSplitViewBlock) {
      var vin;
      if (!this["canRead"](mmCoreSplitViewBlock)) {
        return null;
      }
      /** @type {!Array} */
      var vehiclesIndex = [];
      /** @type {number} */
      vin = 0;
      for (; vin < mmCoreSplitViewBlock; vin = vin + 1) {
        vehiclesIndex[vin] = this["array"][this[_0x3001("0x1b")]];
        this["readOffset"] += 1;
      }
      return vehiclesIndex;
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x2d")] = function() {
      var string = this[_0x3001("0x25")](4);
      return null === string ? null : build(string, 1, 8, 23, -126, 127, true);
    };
    /**
     * @return {?}
     */
    this[_0x3001("0x2e")] = function() {
      var string = this[_0x3001("0x25")](8);
      return null === string ? null : build(string, 1, 11, 52, -1022, 1023, true);
    };
    /**
     * @param {!Object} PL$20
     * @return {undefined}
     */
    this[_0x3001("0x2f")] = function(PL$20) {
      var PL$21;
      /** @type {number} */
      PL$21 = 0;
      for (; PL$21 < PL$20["length"]; PL$21 = PL$21 + 1) {
        this[_0x3001("0x21")](PL$20[PL$21]);
      }
    };
    /**
     * @param {number} canCreateDiscussions
     * @return {undefined}
     */
    this[_0x3001("0x21")] = function(canCreateDiscussions) {
      /** @type {number} */
      this[_0x3001("0x1e")][this["writeOffset"]] = 255 & canCreateDiscussions;
      this[_0x3001("0x1a")] += 1;
    };
    /**
     * @param {number} canCreateDiscussions
     * @return {undefined}
     */
    this[_0x3001("0x30")] = function(canCreateDiscussions) {
      /** @type {number} */
      this[_0x3001("0x1e")][this[_0x3001("0x1a")]] = 255 & canCreateDiscussions;
      /** @type {number} */
      this[_0x3001("0x1e")][this[_0x3001("0x1a")] + 1] = canCreateDiscussions >> 8 & 255;
      this[_0x3001("0x1a")] += 2;
    };
    /**
     * @param {number} canCreateDiscussions
     * @return {undefined}
     */
    this[_0x3001("0x31")] = function(canCreateDiscussions) {
      /** @type {number} */
      this[_0x3001("0x1e")][this[_0x3001("0x1a")]] = 255 & canCreateDiscussions;
      /** @type {number} */
      this["array"][this["writeOffset"] + 1] = canCreateDiscussions >> 8 & 255;
      /** @type {number} */
      this[_0x3001("0x1e")][this["writeOffset"] + 2] = canCreateDiscussions >> 16 & 255;
      /** @type {number} */
      this[_0x3001("0x1e")][this[_0x3001("0x1a")] + 3] = canCreateDiscussions >> 24 & 255;
      this[_0x3001("0x1a")] += 4;
    };
    /**
     * @param {!Object} testItemData
     * @return {undefined}
     */
    this["writeUTF8String"] = function(testItemData) {
      this[_0x3001("0x2f")](function(data) {
        var i;
        var firstIsCO;
        /** @type {!Array} */
        var VK__CHARACTER_KEYS__DOWN_UP = [];
        /** @type {number} */
        var _charCode = 0;
        /** @type {number} */
        i = 0;
        for (; i < data["length"]; i = i + 1) {
          if ((firstIsCO = data[_0x3001("0x32")](i)) < 128) {
            VK__CHARACTER_KEYS__DOWN_UP[_charCode] = firstIsCO;
            /** @type {number} */
            _charCode = _charCode + 1;
          } else {
            if (firstIsCO < 2048) {
              /** @type {number} */
              VK__CHARACTER_KEYS__DOWN_UP[_charCode] = firstIsCO >> 6 | 192;
              /** @type {number} */
              VK__CHARACTER_KEYS__DOWN_UP[_charCode = _charCode + 1] = 63 & firstIsCO | 128;
              /** @type {number} */
              _charCode = _charCode + 1;
            } else {
              if (55296 == (64512 & firstIsCO) && i + 1 < data[_0x3001("0x15")] && 56320 == (64512 & data[_0x3001("0x32")](i + 1))) {
                /** @type {number} */
                i = i + 1;
                /** @type {number} */
                firstIsCO = 65536 + ((1023 & firstIsCO) << 10) + (1023 & data[_0x3001("0x32")](i));
                /** @type {number} */
                VK__CHARACTER_KEYS__DOWN_UP[_charCode] = firstIsCO >> 18 | 240;
                /** @type {number} */
                VK__CHARACTER_KEYS__DOWN_UP[_charCode = _charCode + 1] = firstIsCO >> 12 & 63 | 128;
                /** @type {number} */
                VK__CHARACTER_KEYS__DOWN_UP[_charCode = _charCode + 1] = firstIsCO >> 6 & 63 | 128;
                /** @type {number} */
                VK__CHARACTER_KEYS__DOWN_UP[_charCode = _charCode + 1] = 63 & firstIsCO | 128;
                /** @type {number} */
                _charCode = _charCode + 1;
              } else {
                /** @type {number} */
                VK__CHARACTER_KEYS__DOWN_UP[_charCode] = firstIsCO >> 12 | 224;
                /** @type {number} */
                VK__CHARACTER_KEYS__DOWN_UP[_charCode = _charCode + 1] = firstIsCO >> 6 & 63 | 128;
                /** @type {number} */
                VK__CHARACTER_KEYS__DOWN_UP[_charCode = _charCode + 1] = 63 & firstIsCO | 128;
                /** @type {number} */
                _charCode = _charCode + 1;
              }
            }
          }
        }
        return VK__CHARACTER_KEYS__DOWN_UP;
      }(testItemData));
      this[_0x3001("0x21")](0);
    };
  }
  /**
   * @return {undefined}
   */
  function makeElectorTries() {
    /** @type {number} */
    GET_AUTH_URL_TIMEOUT = 0;
    /** @type {number} */
    numKeysDeleted = 0;
    /** @type {number} */
    postDateGmt = 0;
    /** @type {number} */
    optionsString = 0;
    /** @type {number} */
    currentColumn = 0;
    /** @type {number} */
    pt_up_time = 0;
    /** @type {number} */
    end_string = 0;
  }
  /**
   * @return {?}
   */
  function ondone() {
    return null !== opt && opt[_0x3001("0x33")] === opt[_0x3001("0x34")];
  }
  /**
   * @param {!Object} options
   * @return {undefined}
   */
  function equal(options) {
    try {
      if (options instanceof window[_0x3001("0x35")]) {
        if (!options["dontNotifyMC"]) {
          /** @type {boolean} */
          options[_0x3001("0x36")] = true;
          if (window["MC"] && window["MC"][_0x3001("0x37")]) {
            window["MC"][_0x3001("0x37")]();
          }
        }
        if (options === opt) {
          window[_0x3001("0x38")]["playerDisconnected"]();
          /** @type {null} */
          opt = null;
          /** @type {boolean} */
          _0x5e9630 = false;
        }
        /** @type {null} */
        options[_0x3001("0x39")] = null;
        /** @type {null} */
        options[_0x3001("0x3a")] = null;
        /** @type {null} */
        options["onclose"] = null;
        if (options[_0x3001("0x33")] === options[_0x3001("0x34")]) {
          options[_0x3001("0x3b")]();
        }
      }
    } catch (_0x3d6f35) {
    }
  }
  /**
   * @return {undefined}
   */
  function checkForError() {
    equal(opt);
  }
  /**
   * @param {!Object} fn
   * @return {?}
   */
  function testcase(fn) {
    var diff_red = window[_0x3001("0x14")][_0x3001("0x3c")](.9 * window[_0x3001("0x17")](fn[_0x3001("0x18")](1, 2), 16))[_0x3001("0x12")](16);
    var diff_green = window[_0x3001("0x14")]["floor"](.9 * window[_0x3001("0x17")](fn[_0x3001("0x18")](3, 2), 16))["toString"](16);
    var diff_blue = window["Math"][_0x3001("0x3c")](.9 * window["parseInt"](fn[_0x3001("0x18")](5, 2), 16))["toString"](16);
    return 1 === diff_red[_0x3001("0x15")] && (diff_red = "0" + diff_red), 1 === diff_green[_0x3001("0x15")] && (diff_green = "0" + diff_green), 1 === diff_blue[_0x3001("0x15")] && (diff_blue = "0" + diff_blue), "#" + diff_red + diff_green + diff_blue;
  }
  /**
   * @param {?} g
   * @param {?} i
   * @param {?} b
   * @param {?} cache
   * @param {?} server
   * @return {undefined}
   */
  function init(g, i, b, cache, server) {
    this["ball"] = g;
    this["x"] = i;
    this["y"] = b;
    this[_0x3001("0x3d")] = cache;
    this["random"] = server;
  }
  /**
   * @param {?} stroke
   * @param {?} strokeWidth
   * @param {?} value
   * @param {?} range
   * @return {undefined}
   */
  function SVGPlotFunction(stroke, strokeWidth, value, range) {
    if (stroke) {
      this[_0x3001("0x3d")] = stroke;
    }
    if (strokeWidth) {
      this[_0x3001("0x3e")] = strokeWidth;
    }
    this[_0x3001("0x3f")] = window[_0x3001("0x40")](value);
    if (range) {
      this["strokeColor"] = range;
    }
  }
  /**
   * @param {?} pObjID
   * @return {undefined}
   */
  function $(pObjID) {
    this[_0x3001("0x41")] = new SVGPlotFunction(20, "#7E7E7E");
    this[_0x3001("0x41")][_0x3001("0x42")](pObjID);
    this[_0x3001("0x43")] = now;
  }
  /**
   * @param {?} data
   * @return {undefined}
   */
  function Map(data) {
    this["src"] = data;
  }
  /**
   * @param {?} deny
   * @param {?} garbage
   * @param {?} allow
   * @return {undefined}
   */
  function WMCacheControl(deny, garbage, allow) {
    this[_0x3001("0x44")] = garbage;
    this["drawName"] = allow;
    this[_0x3001("0x45")] = new Map(deny);
  }
  /**
   * @param {?} name
   * @param {?} def
   * @param {?} value
   * @param {?} kind
   * @return {undefined}
   */
  function createHandle(name, def, value, kind) {
    this["id"] = name;
    this["x"] = def;
    this["ox"] = def;
    this["y"] = value;
    this["oy"] = value;
    this[_0x3001("0x3d")] = kind;
    this[_0x3001("0x46")] = kind;
    /** @type {!Array} */
    this[_0x3001("0x47")] = [];
  }
  /**
   * @param {?} key
   * @param {!Object} val
   * @return {undefined}
   */
  function define(key, val) {
    if (obj["hasOwnProperty"](key)) {
      if (obj[key](val) && !val[_0x3001("0x22")]()) {
        val["readOffset"];
        val[_0x3001("0x1e")][_0x3001("0x15")];
        val["get"]();
      }
    } else {
      val[_0x3001("0x1f")]();
    }
  }
  /**
   * @param {!Object} param
   * @param {boolean} succ
   * @return {undefined}
   */
  function done(param, succ) {
    try {
      if (!ondone()) {
        return;
      }
      if (succ) {
        if (!_0x5e9630) {
          return;
        }
        param[_0x3001("0x23")](value);
        value = normalize(value);
      }
      opt[_0x3001("0x48")](new (window[_0x3001("0x49")])(param["get"]()));
    } catch (_0x47d21b) {
    }
  }
  /**
   * @return {undefined}
   */
  function render() {
    var i;
    if (!(margin <= 0)) {
      if (canvas = null, 16 === mm_login) {
        var left = _0x3001("0x4a");
        if (fadein > 0) {
          left = _0x3001("0x4b");
        }
        left = left + tree_[_0x3001("0x12")]();
        canvas = window[_0x3001("0x4c")][_0x3001("0x4d")](_0x3001("0x4e"));
        ctx = canvas[_0x3001("0x4f")]("2d");
        /** @type {number} */
        canvas[_0x3001("0x50")] = 300 * margin;
        /** @type {number} */
        canvas[_0x3001("0x51")] = 60 * margin;
        ctx["scale"](margin, margin);
        /** @type {number} */
        ctx[_0x3001("0x52")] = .4;
        ctx[_0x3001("0x53")] = _0x3001("0xd");
        ctx[_0x3001("0x54")](0, 0, 300, 60);
        /** @type {number} */
        ctx[_0x3001("0x52")] = 1;
        /** @type {string} */
        ctx[_0x3001("0x53")] = "#FFFFFF";
        ctx[_0x3001("0x55")] = _0x3001("0x56");
        ctx[_0x3001("0x57")](left, 150 - ctx[_0x3001("0x58")](left)[_0x3001("0x50")] / 2, 40);
      } else {
        if (1 === mm_login && sections[_0x3001("0x15")] > 0) {
          canvas = window[_0x3001("0x4c")][_0x3001("0x4d")](_0x3001("0x4e"));
          ctx = canvas["getContext"]("2d");
          /** @type {number} */
          canvas[_0x3001("0x50")] = 300 * margin;
          /** @type {number} */
          canvas[_0x3001("0x51")] = 240 * margin;
          ctx["scale"](margin, margin);
          /** @type {number} */
          ctx[_0x3001("0x52")] = .4;
          ctx[_0x3001("0x53")] = _0x3001("0xd");
          ctx[_0x3001("0x54")](0, 0, 300, 240);
          /** @type {number} */
          ctx[_0x3001("0x52")] = 1;
          ctx[_0x3001("0x53")] = _0x3001("0x59");
          var color;
          ctx[_0x3001("0x55")] = _0x3001("0x56");
          ctx[_0x3001("0x57")]("Leaderboard", 150 - ctx[_0x3001("0x58")](_0x3001("0x5a"))[_0x3001("0x50")] / 2, 40);
          /** @type {number} */
          var hex = 0;
          /** @type {number} */
          i = 0;
          for (; i < sections["length"]; i = i + 1) {
            /** @type {number} */
            color = hex + sections[i] * window[_0x3001("0x14")]["PI"] * 2;
            ctx[_0x3001("0x53")] = changes[i + 1];
            ctx["beginPath"]();
            ctx[_0x3001("0x5b")](150, 140);
            ctx[_0x3001("0x5c")](150, 140, 80, hex, color, false);
            ctx[_0x3001("0x5d")]();
            /** @type {number} */
            hex = color;
          }
        } else {
          if (-1 !== mm_login && !AgarTool[_0x3001("0x5e")][_0x3001("0x5f")]["noNames"] && o[_0x3001("0x15")] > 0) {
            canvas = window[_0x3001("0x4c")]["createElement"]("canvas");
            ctx = canvas[_0x3001("0x4f")]("2d");
            /** @type {number} */
            var height = 60;
            /** @type {number} */
            var border = 0;
            /** @type {number} */
            i = 0;
            for (; i < o[_0x3001("0x15")]; i = i + 1) {
              if (!(i >= 10 && !o[i]["isMine"] && o[i]["friendID"] && !target[_0x3001("0xf")](o[i]["friendID"]))) {
                /** @type {number} */
                border = border + 1;
              }
            }
            /** @type {number} */
            height = height + 24 * border;
            /** @type {number} */
            canvas["width"] = 300 * margin;
            /** @type {number} */
            canvas[_0x3001("0x51")] = height * margin;
            ctx[_0x3001("0x60")](margin, margin);
            /** @type {number} */
            ctx[_0x3001("0x52")] = .4;
            ctx[_0x3001("0x53")] = _0x3001("0xd");
            ctx["fillRect"](0, 0, 300, height);
            /** @type {number} */
            ctx["globalAlpha"] = 1;
            /** @type {string} */
            ctx[_0x3001("0x53")] = "#FFFFFF";
            ctx[_0x3001("0x55")] = _0x3001("0x56");
            ctx[_0x3001("0x57")]("Leaderboard", 150 - ctx[_0x3001("0x58")]("Leaderboard")[_0x3001("0x50")] / 2, 40);
            /** @type {string} */
            ctx[_0x3001("0x55")] = "20px Ubuntu";
            var left;
            /** @type {number} */
            var _0x1d1e60 = 0;
            /** @type {number} */
            i = 0;
            for (; i < o["length"]; i = i + 1) {
              if (!(i >= 10 && !o[i][_0x3001("0x61")] && o[i][_0x3001("0x62")]) || target["hasOwnProperty"](o[i][_0x3001("0x62")])) {
                /** @type {null} */
                var src = null;
                if (o[i][_0x3001("0x62")] && target[_0x3001("0xf")](o[i]["friendID"])) {
                  src = target[o[i][_0x3001("0x62")]];
                }
                left = o[i][_0x3001("0x63")] || _0x3001("0x64");
                if (AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0x65")]) {
                  left = _0x3001("0x64");
                }
                if (o[i]["isMine"]) {
                  left = "" === AgarTool[_0x3001("0x5e")][_0x3001("0x66")]["nick"] ? "An unnamed cell" : AgarTool[_0x3001("0x5e")][_0x3001("0x66")][_0x3001("0x67")];
                  ctx[_0x3001("0x53")] = _0x3001("0x68");
                } else {
                  ctx[_0x3001("0x53")] = src ? _0x3001("0x69") : "#FFFFFF";
                }
                /** @type {null} */
                var orig = null;
                if (AgarTool[_0x3001("0x5e")]["checkboxes"][_0x3001("0x6a")] && null !== src) {
                  orig = copy(src);
                }
                /** @type {number} */
                var top = 20;
                /** @type {number} */
                var sizeX = 70 + 24 * _0x1d1e60;
                if (null !== orig) {
                  ctx[_0x3001("0x6b")](orig, top, sizeX - 18, 22, 22);
                  /** @type {number} */
                  top = top + 28;
                }
                /** @type {string} */
                left = i + 1 + ". " + left;
                ctx[_0x3001("0x57")](left, top, sizeX);
                /** @type {number} */
                _0x1d1e60 = _0x1d1e60 + 1;
              }
            }
          }
        }
      }
    }
  }
  /**
   * @param {!Object} s
   * @return {?}
   */
  function create(s) {
    return (s["indexOf"]("//") > -1 ? s[_0x3001("0x6c")]("/")[2] : s[_0x3001("0x6c")]("/")[0])[_0x3001("0x6c")](":")[0][_0x3001("0x6c")]("?")[0];
  }
  /**
   * @param {string} data
   * @return {undefined}
   */
  function emit(data) {
    if (ondone()) {
      /** @type {number} */
      var longX = x - window[_0x3001("0xb5")] / 2;
      /** @type {number} */
      var longY = y - window["innerHeight"] / 2;
      if (window["AgarTool"][_0x3001("0xb6")] || data || !(64 > longX * longX + longY * longY || .01 > window[_0x3001("0x14")][_0x3001("0x90")](guess - result) && .01 > window[_0x3001("0x14")][_0x3001("0x90")](ongoingMessage - message))) {
        guess = result;
        ongoingMessage = message;
        var target = new Error;
        target[_0x3001("0x20")](16);
        target[_0x3001("0x31")](result);
        target["writeUInt32"](message);
        target[_0x3001("0x31")](selector);
        done(target, true);
      }
    }
  }
  /**
   * @return {undefined}
   */
  function setTarget() {
    result = (x - width / 2) / scale + m;
    message = (y - height / 2) / scale + max;
  }
  /**
   * @return {?}
   */
  function parseInt() {
    return 1 * window[_0x3001("0x14")][_0x3001("0x8c")](height / 1080, width / 1920) * rDec;
  }
  /**
   * @return {?}
   */
  function resolveToRelativePath() {
    var i;
    /** @type {number} */
    var source = 0;
    /** @type {number} */
    i = 0;
    for (; i < nodes[_0x3001("0x15")]; i = i + 1) {
      /** @type {number} */
      source = source + nodes[i][_0x3001("0x8f")] * nodes[i][_0x3001("0x8f")];
    }
    return source;
  }
  /**
   * @param {number} startPos
   * @return {?}
   */
  function isValid(startPos) {
    /** @type {number} */
    var i = 0;
    /** @type {number} */
    var h = 0;
    /** @type {number} */
    var margin = 0;
    /** @type {number} */
    var yScale = 0;
    /** @type {string} */
    var param = "";
    return startPos > 0 && (i = (i = startPos) - 24 * (yScale = ~~((margin = ~~((h = ~~(i / 60)) / 60)) / 24)) * 60 * 60 - 60 * (margin = margin - 24 * yScale) * 60 - 60 * (h = h - 24 * yScale * 60 - 60 * margin)), i < 0 && (i = 0), i < 10 && (i = "0" + i), h >= 1 && (param = param + (h + "m")), param = param + (i + "s");
  }
  var index;
  var start;
  var dh;
  /** @type {boolean} */
  var lastTrackInfoUrl = false;
  /** @type {null} */
  var axis = null;
  var obj = {};
  /** @type {null} */
  var style = null;
  /** @type {null} */
  var opt_param = null;
  /** @type {number} */
  var width = 0;
  /** @type {number} */
  var height = 0;
  /** @type {number} */
  var margin = 0;
  /** @type {!Array} */
  var colorProps = [];
  /** @type {!Array} */
  var nodes = [];
  var map = {};
  /** @type {!Array} */
  var next = [];
  /** @type {!Array} */
  var bytes = [];
  /** @type {!Array} */
  var range = [];
  /** @type {!Array} */
  var o = [];
  /** @type {number} */
  var tree_ = 0;
  /** @type {number} */
  var x = 0;
  /** @type {number} */
  var y = 0;
  /** @type {number} */
  var result = -1;
  /** @type {number} */
  var message = -1;
  /** @type {number} */
  var now = 0;
  /** @type {number} */
  var ogMajor = 0;
  /** @type {number} */
  var low = 0;
  /** @type {number} */
  var majorVersion = 14142.135623730952;
  /** @type {number} */
  var high = 14142.135623730952;
  /** @type {number} */
  var majorDiff = majorVersion - ogMajor;
  /** @type {number} */
  var step = high - low;
  /** @type {number} */
  var scale = 1;
  /** @type {number} */
  var numberOfCountedTextNodes = 1;
  /** @type {number} */
  var m = ~~((ogMajor + majorVersion) / 2);
  /** @type {number} */
  var max = ~~((low + high) / 2);
  /** @type {number} */
  var px = ~~((ogMajor + majorVersion) / 2);
  /** @type {number} */
  var min = ~~((low + high) / 2);
  /** @type {number} */
  var prevScale = 1;
  /** @type {!Array} */
  var sections = [];
  /** @type {!Array} */
  var changes = [_0x3001("0x0"), _0x3001("0x1"), _0x3001("0x2"), _0x3001("0x3")];
  /** @type {number} */
  var rDec = 1;
  /** @type {null} */
  var dropdown = null;
  /** @type {boolean} */
  var color = false;
  /** @type {number} */
  var guess = -1;
  /** @type {number} */
  var ongoingMessage = -1;
  /** @type {null} */
  var canvas = null;
  /** @type {null} */
  var ctx = null;
  /** @type {null} */
  var button2 = null;
  /** @type {null} */
  var settingHandler = null;
  /** @type {boolean} */
  var isLoginStateWithSession = false;
  /** @type {number} */
  var item = 0;
  /** @type {number} */
  var group = 60;
  /** @type {!Array} */
  var set = [];
  /** @type {number} */
  var _0x411dbd = 0;
  /** @type {number} */
  var _0x487c5e = 0;
  /** @type {number} */
  var STRING = 60;
  /** @type {number} */
  var interval = 1E3 / STRING;
  /** @type {number} */
  var duration = 0;
  /** @type {number} */
  var lastTermChange = 0;
  var parsedHash = {};
  var checkerMap = {};
  /** @type {number} */
  var selector = 0;
  /** @type {number} */
  var value = 0;
  /** @type {null} */
  var opt = null;
  /** @type {boolean} */
  var _0x5e9630 = false;
  /** @type {boolean} */
  var _0x19b24b = false;
  /** @type {string} */
  var option = "wss://0.0.0.0.0";
  /** @type {number} */
  var GET_AUTH_URL_TIMEOUT = 0;
  /** @type {number} */
  var numKeysDeleted = 0;
  /** @type {number} */
  var postDateGmt = 0;
  /** @type {number} */
  var optionsString = 0;
  /** @type {number} */
  var currentColumn = 0;
  /** @type {number} */
  var pt_up_time = 0;
  /** @type {number} */
  var end_string = 0;
  /** @type {number} */
  var mm_login = -1;
  /** @type {number} */
  var fadein = 0;
  /** @type {number} */
  var dotJoin = 0;
  /** @type {number} */
  var _0x1e4495 = 0;
  /** @type {number} */
  var prev = 0;
  /** @type {number} */
  var seed = 0;
  /** @type {number} */
  var dotGroup = 0;
  /** @type {number} */
  var name = 0;
  /** @type {number} */
  var _maskLayerSimulate = 0;
  /** @type {number} */
  var _localExports = 0;
  /** @type {number} */
  var _name = 0;
  /** @type {number} */
  var _0x5a600a = 0;
  var target = {};
  /** @type {!Array} */
  var groups = [_0x3001("0x4"), _0x3001("0x5"), "got eaten by a virus", "jumped in a virus"];
  /** @type {!Array} */
  var n = [_0x3001("0x6"), _0x3001("0x7"), "was late to the party", _0x3001("0x8")];
  /** @type {!Array} */
  var configImg = [_0x3001("0x9"), _0x3001("0xa"), _0x3001("0xb"), _0x3001("0xc")];
  /** @type {!Array} */
  var data = [];
  /** @type {number} */
  var _jsons = 0;
  /** @type {boolean} */
  var _content = false;
  /** @type {number} */
  var _currDirection = -1;
  /** @type {number} */
  var currentParent_ = -1;
  /** @type {number} */
  var lastFPSTime = 0;
  /** @type {number} */
  var touchEndTime = 0;
  /** @type {number} */
  var delta = 0;
  /** @type {!Array} */
  var PL$120 = [];
  var inet3 = _0x3001("0xd");
  /** @type {boolean} */
  var _0x50b61b = false;
  /** @type {null} */
  var languageContents = null;
  /** @type {null} */
  var humanizedTemplates = null;
  /** @type {null} */
  var unexpectedPackets = null;
  var params = {};
  var types = {};
  /** @type {number} */
  var left = 2147483647;
  /** @type {number} */
  var u = 2147483647;
  /** @type {string} */
  var hover = "";
  /** @type {number} */
  var i = 0;
  /** @type {boolean} */
  var validationVM = false;
  /** @type {number} */
  var series = 1;
  /** @type {boolean} */
  var _0x318b20 = false;
  /** @type {null} */
  var button = null;
  var transformTagsMap = {};
  init[_0x3001("0x6d")] = {
    "ball" : null,
    "x" : 0,
    "y" : 0,
    "size" : 0,
    "random" : 0
  };
  SVGPlotFunction[_0x3001("0x6d")] = {
    "value" : "",
    "color" : "#000000",
    "stroke" : false,
    "strokeColor" : _0x3001("0xd"),
    "size" : 16,
    "canvas" : null,
    "ctx" : null,
    "dirty" : false,
    "scale" : 1,
    "setStroke" : function(strokeWidth) {
      if (this[_0x3001("0x3f")] !== strokeWidth) {
        this[_0x3001("0x3f")] = strokeWidth;
        /** @type {boolean} */
        this[_0x3001("0x6e")] = true;
      }
    },
    "setSize" : function(size) {
      if (this[_0x3001("0x3d")] !== size) {
        this["size"] = size;
        /** @type {boolean} */
        this[_0x3001("0x6e")] = true;
      }
    },
    "setScale" : function(s) {
      if (this[_0x3001("0x60")] !== s) {
        this[_0x3001("0x60")] = s;
        /** @type {boolean} */
        this[_0x3001("0x6e")] = true;
      }
    },
    "setValue" : function(rfcDate) {
      if (this[_0x3001("0x6f")] !== rfcDate) {
        this[_0x3001("0x6f")] = rfcDate;
        /** @type {boolean} */
        this[_0x3001("0x6e")] = true;
      }
    },
    "render" : function() {
      if (null === this["canvas"] && (this[_0x3001("0x4e")] = window[_0x3001("0x4c")][_0x3001("0x4d")](_0x3001("0x4e")), this["ctx"] = this[_0x3001("0x4e")]["getContext"]("2d")), this[_0x3001("0x6e")]) {
        /** @type {boolean} */
        this[_0x3001("0x6e")] = false;
        var ctx = this[_0x3001("0x3d")] + _0x3001("0x70");
        this[_0x3001("0x71")]["font"] = ctx;
        /** @type {number} */
        var _0x39e31d = ~~(.4 * this["size"]);
        /** @type {number} */
        this[_0x3001("0x4e")]["width"] = (this[_0x3001("0x71")][_0x3001("0x58")](this[_0x3001("0x6f")])[_0x3001("0x50")] + this["size"] / 9) * this[_0x3001("0x60")];
        /** @type {number} */
        this[_0x3001("0x4e")][_0x3001("0x51")] = (this[_0x3001("0x3d")] + _0x39e31d + this[_0x3001("0x3d")] / 9) * this["scale"];
        this[_0x3001("0x71")][_0x3001("0x55")] = ctx;
        this[_0x3001("0x71")][_0x3001("0x60")](this[_0x3001("0x60")], this[_0x3001("0x60")]);
        /** @type {number} */
        this["ctx"]["globalAlpha"] = 1;
        if (this[_0x3001("0x3f")]) {
          /** @type {number} */
          this["ctx"][_0x3001("0x72")] = this[_0x3001("0x3d")] / 9;
          this[_0x3001("0x71")][_0x3001("0x73")] = this[_0x3001("0x44")];
          this[_0x3001("0x71")][_0x3001("0x74")](this[_0x3001("0x6f")], this[_0x3001("0x3d")] / 9 / 2, this[_0x3001("0x3d")] + this["size"] / 9 / 2);
        }
        this[_0x3001("0x71")][_0x3001("0x53")] = this[_0x3001("0x3e")];
        this[_0x3001("0x71")][_0x3001("0x57")](this[_0x3001("0x6f")], this["size"] / 9 / 2, this["size"] + this[_0x3001("0x3d")] / 9 / 2);
      }
      return this["canvas"];
    }
  };
  $[_0x3001("0x6d")] = {
    "timeCreated" : 0,
    "textCache" : null,
    "opacity" : 0,
    "completed" : false,
    "timeCompleted" : 0,
    "destroyed" : false,
    "draw" : function(editEmitter) {
      if (!this[_0x3001("0x75")]) {
        if (this[_0x3001("0x76")] && now - this[_0x3001("0x77")] >= 5E3) {
          this["opacity"] -= .05;
          if (this[_0x3001("0x78")] <= 0) {
            /** @type {number} */
            this[_0x3001("0x78")] = 0;
            /** @type {boolean} */
            this[_0x3001("0x75")] = true;
          }
        } else {
          if (!this[_0x3001("0x76")]) {
            this[_0x3001("0x78")] += .05;
            if (this[_0x3001("0x78")] >= 1) {
              /** @type {boolean} */
              this[_0x3001("0x76")] = true;
              /** @type {number} */
              this[_0x3001("0x78")] = 1;
              this["timeCompleted"] = now;
            }
          }
        }
        style[_0x3001("0x79")]();
        style["globalAlpha"] = this[_0x3001("0x78")];
        this["textCache"][_0x3001("0x7a")](margin);
        var borderradius = this[_0x3001("0x41")][_0x3001("0x7b")]();
        style[_0x3001("0x6b")](borderradius, width - borderradius[_0x3001("0x50")] - 15 * margin, (75 + 30 * editEmitter) * margin);
        style["restore"]();
      }
    }
  };
  Map[_0x3001("0x6d")] = {
    "src" : null,
    "image" : null,
    "isLoaded" : false,
    "lastUse" : 0,
    "loadImage" : function() {
      this[_0x3001("0x7c")] = new (window[_0x3001("0x7d")]);
      var slots = this;
      /**
       * @return {undefined}
       */
      this[_0x3001("0x7c")][_0x3001("0x3a")] = function() {
        window[_0x3001("0x7e")](function() {
          if (now - slots[_0x3001("0x7f")] < 2E3) {
            slots["loadImage"]();
            slots[_0x3001("0x80")];
          } else {
            /** @type {null} */
            slots[_0x3001("0x7c")] = null;
          }
        }, 5E3);
      };
      this[_0x3001("0x7c")]["src"] = this[_0x3001("0x80")];
    },
    "getImage" : function() {
      return this[_0x3001("0x7f")] = now, this["isLoaded"] ? this["image"] : null === this[_0x3001("0x7c")] ? (this["loadImage"](), null) : this["image"]["complete"] && this[_0x3001("0x7c")][_0x3001("0x50")] > 0 && this[_0x3001("0x7c")][_0x3001("0x51")] > 0 ? (this[_0x3001("0x81")] = true, this["image"]) : null;
    }
  };
  WMCacheControl["prototype"] = {
    "strokeColor" : null,
    "drawName" : true,
    "imageContainer" : null
  };
  createHandle[_0x3001("0x6d")] = {
    "id" : 0,
    "points" : null,
    "name" : "",
    "fillColor" : "#000000",
    "strokeColor" : _0x3001("0xd"),
    "nameCache" : null,
    "sizeCache" : null,
    "x" : 0,
    "y" : 0,
    "size" : 0,
    "ox" : 0,
    "oy" : 0,
    "oSize" : 0,
    "nx" : 0,
    "ny" : 0,
    "nSize" : 0,
    "flags" : 0,
    "updateTime" : 0,
    "eatenBy" : null,
    "destroyed" : false,
    "isVirus" : false,
    "isPellet" : false,
    "isEjectedMass" : false,
    "wasSimpleDrawing" : true,
    "drawCount" : 0,
    "skinName" : "",
    "biggestPoint" : 0,
    "isMine" : false,
    "skin" : null,
    "destroyedAlphaNum" : 0,
    "friendID" : 0,
    "destroy" : function() {
      var i;
      /** @type {number} */
      i = 0;
      for (; i < bytes[_0x3001("0x15")]; i = i + 1) {
        if (bytes[i] === this) {
          bytes[_0x3001("0x82")](i, 1);
          break;
        }
      }
      /** @type {number} */
      i = 0;
      for (; i < next[_0x3001("0x15")]; i = i + 1) {
        if (next[i] === this) {
          next[_0x3001("0x82")](i, 1);
          break;
        }
      }
      delete map[this["id"]];
      var value = nodes[_0x3001("0x19")](this);
      if (-1 !== value) {
        /** @type {boolean} */
        _0x50b61b = true;
        nodes[_0x3001("0x82")](value, 1);
      }
      var x = colorProps[_0x3001("0x19")](this["id"]);
      if (-1 !== x) {
        colorProps[_0x3001("0x82")](x, 1);
      }
      /** @type {boolean} */
      this[_0x3001("0x75")] = true;
      if (this[_0x3001("0x83")] > 0 && null !== this["eatenBy"]) {
        range[_0x3001("0x84")](this);
      }
    },
    "setName" : function(dirtyNameArr) {
      this[_0x3001("0x63")] = dirtyNameArr;
    },
    "createPoints" : function(attr) {
      var _0x39e31d = this[_0x3001("0x85")]();
      for (; this["points"][_0x3001("0x15")] > _0x39e31d;) {
        /** @type {number} */
        var charObj = ~~(window[_0x3001("0x14")][_0x3001("0x86")]() * this[_0x3001("0x47")][_0x3001("0x15")]);
        this[_0x3001("0x47")]["splice"](charObj, 1);
      }
      if (0 === this[_0x3001("0x47")][_0x3001("0x15")] && _0x39e31d > 0) {
        this["points"][_0x3001("0x84")](new init(this, this["x"], this["y"], this[_0x3001("0x3d")] - attr / 2, window["Math"][_0x3001("0x86")]() - .5));
      }
      for (; this[_0x3001("0x47")][_0x3001("0x15")] < _0x39e31d;) {
        charObj = this[_0x3001("0x47")][~~(window[_0x3001("0x14")]["random"]() * this[_0x3001("0x47")]["length"])];
        this[_0x3001("0x47")][_0x3001("0x84")](new init(this, charObj["x"], charObj["y"], charObj[_0x3001("0x3d")], charObj[_0x3001("0x86")]));
      }
    },
    "getNumPoints" : function() {
      var value = this["size"];
      return this[_0x3001("0x87")] && (value = value * .6), this[_0x3001("0x88")] || (value = value * scale), 2 * window[_0x3001("0x14")][_0x3001("0x89")](value / 2);
    },
    "movePoints" : function(halfSize) {
      var i;
      this[_0x3001("0x8a")](halfSize);
      var len = this[_0x3001("0x47")]["length"];
      var START = this;
      /** @type {number} */
      var offsetY = this[_0x3001("0x88")] ? 0 : (this["id"] / 1E3 + now / 1E4) % (2 * window["Math"]["PI"]);
      /** @type {number} */
      this[_0x3001("0x8b")] = 0;
      /** @type {number} */
      i = 0;
      for (; i < len; i = i + 1) {
        var y = this[_0x3001("0x47")][(i - 1 + len) % len]["random"];
        var v = this[_0x3001("0x47")][(i + 1) % len][_0x3001("0x86")];
        var arr = this[_0x3001("0x47")][i];
        arr[_0x3001("0x86")] += 1 * (window[_0x3001("0x14")]["random"]() - .5);
        arr[_0x3001("0x86")] *= .55;
        if (10 < arr[_0x3001("0x86")]) {
          /** @type {number} */
          arr["random"] = 10;
        }
        if (-10 > arr[_0x3001("0x86")]) {
          /** @type {number} */
          arr["random"] = -10;
        }
        /** @type {number} */
        arr[_0x3001("0x86")] = (y + v + 8 * arr[_0x3001("0x86")]) / 10;
        var value = arr["size"];
        y = this[_0x3001("0x47")][(i - 1 + len) % len][_0x3001("0x3d")];
        v = this[_0x3001("0x47")][(i + 1) % len][_0x3001("0x3d")];
        if (15 < this[_0x3001("0x3d")] - halfSize / 2 && null != axis && 20 < (this[_0x3001("0x3d")] - halfSize / 2) * scale) {
          /** @type {boolean} */
          var _0x5c43ef = false;
          var val = arr["x"];
          var y = arr["y"];
          axis["retrieve2"](val - halfSize, y - halfSize, 2 * halfSize, 2 * halfSize, function(origin) {
            if (origin["ball"] !== START && 25 > (val - origin["x"]) * (val - origin["x"]) + (y - origin["y"]) * (y - origin["y"])) {
              /** @type {boolean} */
              _0x5c43ef = true;
            }
          });
          if (!_0x5c43ef && (arr["x"] < ogMajor || arr["y"] < low || arr["x"] > majorVersion || arr["y"] > high)) {
            /** @type {boolean} */
            _0x5c43ef = true;
          }
          if (_0x5c43ef) {
            if (arr[_0x3001("0x86")] > 0) {
              /** @type {number} */
              arr[_0x3001("0x86")] = 0;
            }
            arr[_0x3001("0x86")] -= 1;
          }
        }
        if ((value = value + arr[_0x3001("0x86")]) < 0) {
          /** @type {number} */
          value = 0;
        }
        /** @type {number} */
        value = (12 * value + (this["size"] - halfSize / 2)) / 13;
        /** @type {number} */
        arr[_0x3001("0x3d")] = (y + v + 8 * value) / 10;
        /** @type {number} */
        y = 2 * window[_0x3001("0x14")]["PI"] / len;
        v = arr[_0x3001("0x3d")];
        if (this["isVirus"] && 0 == i % 2) {
          v = v + 5;
        }
        arr["x"] = this["x"] + window[_0x3001("0x14")]["cos"](y * i + offsetY) * v;
        arr["y"] = this["y"] + window["Math"]["sin"](y * i + offsetY) * v;
        this["biggestPoint"] = window[_0x3001("0x14")][_0x3001("0x8c")](this[_0x3001("0x8b")], v);
      }
    },
    "setPosition" : function(ignoreActions, jump) {
      this["nx"] = ignoreActions;
      this["ny"] = jump;
    },
    "updatePos" : function() {
      /** @type {number} */
      var _0x56c784 = (now - this[_0x3001("0x8d")]) / 140;
      if (_0x56c784 < 0 ? _0x56c784 = 0 : _0x56c784 > 1 && (_0x56c784 = 1), this[_0x3001("0x75")]) {
        if (null === this[_0x3001("0x8e")] || this[_0x3001("0x8e")][_0x3001("0x75")] || _0x56c784 >= 1) {
          var parent = range[_0x3001("0x19")](this);
          return void(-1 !== parent && range["splice"](parent, 1));
        }
        this["setPosition"](this[_0x3001("0x8e")]["x"], this["eatenBy"]["y"]);
      }
      this["x"] = _0x56c784 * (this["nx"] - this["ox"]) + this["ox"];
      this["y"] = _0x56c784 * (this["ny"] - this["oy"]) + this["oy"];
      this[_0x3001("0x3d")] = _0x56c784 * (this[_0x3001("0x8f")] - this[_0x3001("0x46")]) + this[_0x3001("0x46")];
      if (window["Math"][_0x3001("0x90")](this[_0x3001("0x3d")] - this["nSize"]) < .01) {
        this[_0x3001("0x3d")] = this[_0x3001("0x8f")];
      }
      /** @type {number} */
      this[_0x3001("0x91")] = _0x56c784;
    },
    "updateSkin" : function() {
      var attribute = this[_0x3001("0x63")]["toLowerCase"]();
      var name = this[_0x3001("0x92")][_0x3001("0x93")]();
      if (parsedHash["hasOwnProperty"](attribute)) {
        this[_0x3001("0x94")] = parsedHash[attribute];
      } else {
        if (checkerMap[_0x3001("0xf")](name)) {
          this[_0x3001("0x94")] = checkerMap[name];
        } else {
          if (name[_0x3001("0x95")](_0x3001("0x96")) && !transformTagsMap[_0x3001("0xf")](name)) {
            if (window["MC"] && window["MC"][_0x3001("0x97")]) {
              window["MC"][_0x3001("0x97")](this[_0x3001("0x92")]);
              /** @type {boolean} */
              transformTagsMap[name] = true;
            }
          } else {
            /** @type {null} */
            this["skin"] = null;
          }
        }
      }
    },
    "drawPoints" : function() {
      var i;
      style[_0x3001("0x98")]();
      style[_0x3001("0x5b")](this["points"][0]["x"], this["points"][0]["y"]);
      /** @type {number} */
      i = 1;
      for (; i < this[_0x3001("0x47")]["length"]; i = i + 1) {
        style["lineTo"](this[_0x3001("0x47")][i]["x"], this[_0x3001("0x47")][i]["y"]);
      }
      style["lineTo"](this["points"][0]["x"], this["points"][0]["y"]);
    },
    "startRendering" : function() {
      this[_0x3001("0x99")]();
      if (scale < .001 || this["x"] + this[_0x3001("0x3d")] + 40 < m - width / 2 / scale || this["y"] + this[_0x3001("0x3d")] + 40 < max - height / 2 / scale || this["x"] - this[_0x3001("0x3d")] - 40 > m + width / 2 / scale || this["y"] - this[_0x3001("0x3d")] - 40 > max + height / 2 / scale) {
        /** @type {boolean} */
        this[_0x3001("0x9a")] = false;
        /** @type {boolean} */
        this[_0x3001("0x9b")] = true;
      } else {
        /** @type {boolean} */
        this[_0x3001("0x9a")] = true;
      }
    },
    "drawPellet" : function() {
      var indexLookupKey;
      if (this["shouldRender"]) {
        this[_0x3001("0x83")] += 1;
        style[_0x3001("0x53")] = this[_0x3001("0x9c")];
        if (AgarTool["settings"][_0x3001("0x5f")][_0x3001("0x9d")] && 1 !== mm_login) {
          style[_0x3001("0x53")] = _0x3001("0x9e");
        }
        /** @type {boolean} */
        var _0x39e31d = scale < .4 || !AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0x9f")] && !this[_0x3001("0x88")];
        if (this[_0x3001("0x85")]() < 5 && (_0x39e31d = true), this["wasSimpleDrawing"] && !_0x39e31d) {
          /** @type {number} */
          indexLookupKey = 0;
          for (; indexLookupKey < this[_0x3001("0x47")][_0x3001("0x15")]; indexLookupKey = indexLookupKey + 1) {
            this[_0x3001("0x47")][indexLookupKey][_0x3001("0x3d")] = this[_0x3001("0x3d")];
          }
        }
        /** @type {boolean} */
        this["wasSimpleDrawing"] = _0x39e31d;
        if (_0x39e31d) {
          style[_0x3001("0x98")]();
          style[_0x3001("0x5c")](this["x"], this["y"], this[_0x3001("0x3d")], 0, 2 * window[_0x3001("0x14")]["PI"], false);
        } else {
          this[_0x3001("0xa0")](0);
          this[_0x3001("0xa1")]();
        }
        style[_0x3001("0xa2")] = _0x3001("0x89");
        style[_0x3001("0x5d")]();
      }
    },
    "draw" : function(editEmitter) {
      var i;
      var name;
      if (this["shouldRender"]) {
        this[_0x3001("0x83")] += 1;
        /** @type {number} */
        var animateName = 4;
        if (AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0xa3")] && !this["isVirus"]) {
          /** @type {number} */
          animateName = 0;
        }
        /** @type {null} */
        var node = null;
        /** @type {boolean} */
        var _0x19ef32 = true;
        if (style[_0x3001("0x53")] = this[_0x3001("0x9c")], style[_0x3001("0x73")] = this[_0x3001("0x44")], !AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0xa4")] && 1 !== mm_login && !this[_0x3001("0x88")] && !this[_0x3001("0xa5")]) {
          var nameProp = this[_0x3001("0x63")] + this[_0x3001("0x92")];
          if (AgarTool[_0x3001("0x5e")][_0x3001("0x5f")]["showCustomSkins"] && AgarTool[_0x3001("0xa6")][_0x3001("0xf")](nameProp)) {
            name = AgarTool[_0x3001("0xa6")][nameProp];
            node = types[_0x3001("0xf")](name) ? types[name]["getImage"]() : (types[name] = new Map(name), types[name][_0x3001("0xe")]());
          } else {
            if (null !== this[_0x3001("0x94")]) {
              node = this[_0x3001("0x94")][_0x3001("0x45")][_0x3001("0xe")]();
            }
            if (null !== node) {
              _0x19ef32 = this[_0x3001("0x94")][_0x3001("0xa7")];
              if (null !== this["skin"]["strokeColor"]) {
                style["strokeStyle"] = this[_0x3001("0x94")][_0x3001("0x44")];
              }
            } else {
              if (scale < .4) {
                /** @type {number} */
                animateName = 0;
              }
            }
          }
        }
        if (AgarTool["settings"][_0x3001("0x5f")][_0x3001("0x9d")] && 1 !== mm_login) {
          style[_0x3001("0x53")] = _0x3001("0x59");
          style[_0x3001("0x73")] = _0x3001("0x9e");
        }
        var i;
        /** @type {boolean} */
        var _0x39e1b3 = !this[_0x3001("0x88")] && scale < .4 || !AgarTool[_0x3001("0x5e")]["checkboxes"][_0x3001("0x9f")] && !this[_0x3001("0x88")];
        if (this[_0x3001("0x85")]() < 5 && (_0x39e1b3 = true), this[_0x3001("0x9b")] && !_0x39e1b3) {
          /** @type {number} */
          i = 0;
          for (; i < this[_0x3001("0x47")][_0x3001("0x15")]; i = i + 1) {
            /** @type {number} */
            this[_0x3001("0x47")][i]["size"] = this[_0x3001("0x3d")] - animateName / 2;
          }
        }
        if (this["wasSimpleDrawing"] = _0x39e1b3, _0x39e1b3 ? (style[_0x3001("0x98")](), style[_0x3001("0x5c")](this["x"], this["y"], this[_0x3001("0x3d")] - animateName / 2, 0, 2 * window[_0x3001("0x14")]["PI"], false), i = this[_0x3001("0x3d")]) : (this[_0x3001("0xa0")](animateName), this["drawPoints"](), i = this[_0x3001("0x8b")]), null !== node) {
          style["save"]();
          style[_0x3001("0xa8")]();
          style[_0x3001("0x5d")]();
          style["drawImage"](node, this["x"] - i + animateName / 2, this["y"] - i + animateName / 2, 2 * i - animateName, 2 * i - animateName);
          style[_0x3001("0xa9")]();
        } else {
          if (this[_0x3001("0x88")]) {
            style[_0x3001("0xa2")] = _0x3001("0xaa");
            var val = style[_0x3001("0x52")];
            if (AgarTool[_0x3001("0x5e")][_0x3001("0x5f")]["transparentVirus"]) {
              style[_0x3001("0x52")] *= .5;
              style[_0x3001("0x5d")]();
              style[_0x3001("0x52")] = val;
            } else {
              style[_0x3001("0x5d")]();
            }
          } else {
            style["lineJoin"] = _0x3001("0x89");
            style[_0x3001("0x5d")]();
          }
        }
        if (animateName > 0 && (style[_0x3001("0x72")] = animateName, style[_0x3001("0x3f")]()), !this["isEjectedMass"]) {
          if (AgarTool["settings"][_0x3001("0x5f")]["showFacebookImages"]) {
            /** @type {null} */
            var value = null;
            if (target["hasOwnProperty"](this[_0x3001("0x62")]) && (value = target[this[_0x3001("0x62")]]), null !== value) {
              var seen = copy(value);
              if (null !== seen) {
                /** @type {number} */
                var limitY = this["y"] - i / 2 + animateName / 2;
                /** @type {number} */
                var y = i / 2;
                style["save"]();
                style[_0x3001("0x98")]();
                style[_0x3001("0x5c")](this["x"], limitY, y, 0, 2 * window[_0x3001("0x14")]["PI"], false);
                style["clip"]();
                style[_0x3001("0x6b")](seen, this["x"] - y, limitY - y, 2 * y, 2 * y);
                style[_0x3001("0xa9")]();
              }
            }
          }
          if (null !== editEmitter && !this["isVirus"] && !this["isMine"]) {
            /** @type {number} */
            var touchStretch = ~~(this["nSize"] * this[_0x3001("0x8f")] / 100);
            /** @type {number} */
            var lastTouchStretch = ~~(editEmitter[_0x3001("0x8f")] * editEmitter[_0x3001("0x8f")] / 100);
            /** @type {number} */
            var costSum = touchStretch / lastTouchStretch;
            /** @type {number} */
            var gasSum = 1E3 > lastTouchStretch ? .35 : .38;
            /** @type {boolean} */
            var _0x23f41a = false;
            /** @type {boolean} */
            var _0x14d8a8 = false;
            if (2.5 > costSum) {
              if (1.25 > costSum) {
                if (1.25 > costSum && costSum > .75) {
                  /** @type {boolean} */
                  _0x23f41a = true;
                }
                style["strokeStyle"] = costSum > gasSum ? _0x3001("0xab") : "#64FF00";
              } else {
                /** @type {string} */
                style[_0x3001("0x73")] = "#FF0A00";
              }
            } else {
              /** @type {boolean} */
              _0x14d8a8 = true;
              style[_0x3001("0x73")] = _0x3001("0xac");
            }
            /** @type {number} */
            style[_0x3001("0x72")] = 8;
            if (AgarTool["settings"][_0x3001("0x5f")]["splitIndicators"] && !_0x23f41a) {
              style["beginPath"]();
              style[_0x3001("0x5c")](this["x"], this["y"], i + 15, 0, 2 * window["Math"]["PI"], false);
              style[_0x3001("0x3f")]();
            }
            /** @type {number} */
            style["lineWidth"] = 4;
            if (AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0xad")] && this[_0x3001("0x3d")] < 600 && _0x14d8a8) {
              style[_0x3001("0x98")]();
              style[_0x3001("0x5c")](this["x"], this["y"], i + 760, 0, 2 * window[_0x3001("0x14")]["PI"], false);
              style[_0x3001("0x3f")]();
            }
          }
          /** @type {boolean} */
          var _0x51b5af = false;
          if (!this[_0x3001("0x88")] && !this["isMine"] && this[_0x3001("0x3d")] * scale < 20) {
            /** @type {boolean} */
            _0x51b5af = true;
          }
          var l = this["y"];
          var y = this["x"];
          /** @type {number} */
          var sumOfFontSizes = 100 * window[_0x3001("0x14")]["ceil"](i / 100);
          if ((sumOfFontSizes = sumOfFontSizes / numberOfCountedTextNodes) > 500) {
            /** @type {number} */
            sumOfFontSizes = 500;
          }
          /** @type {number} */
          var relative_gate_factor = 1;
          /** @type {number} */
          var r = i / sumOfFontSizes;
          if ((!AgarTool[_0x3001("0x5e")]["checkboxes"]["autoHideNames"] || !_0x51b5af) && (!AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0x65")] || this[_0x3001("0x61")]) && "" !== this["name"] && _0x19ef32) {
            /** @type {number} */
            var constrainedSize = .4 * sumOfFontSizes;
            if (null === this[_0x3001("0xae")]) {
              this[_0x3001("0xae")] = new SVGPlotFunction(constrainedSize, _0x3001("0x59"), !AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0xaf")], _0x3001("0xd"));
            }
            this["nameCache"][_0x3001("0xb0")](!AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0xaf")]);
            this["nameCache"][_0x3001("0x42")](this[_0x3001("0x63")]);
            this["nameCache"][_0x3001("0xb1")](constrainedSize);
            var b = this[_0x3001("0xae")][_0x3001("0x7b")]();
            if (b["width"] > 0 && b[_0x3001("0x51")] > 0) {
              /** @type {number} */
              var h = b[_0x3001("0x50")] * r * scale / scale;
              /** @type {number} */
              var relative_threshold = b[_0x3001("0x51")] * r * scale / scale;
              if (h > 3.5 * this["size"]) {
                /** @type {number} */
                h = h * (relative_gate_factor = 3.5 * this[_0x3001("0x3d")] / h);
                /** @type {number} */
                relative_threshold = relative_threshold * relative_gate_factor;
              }
              style[_0x3001("0x6b")](b, y - h / 2, l - relative_threshold / 2, h, relative_threshold);
              l = l + (relative_threshold / relative_gate_factor / 2 + 4 + i / 1500 * 80);
            }
          }
          if ((!AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0xb2")] || !_0x51b5af) && AgarTool[_0x3001("0x5e")][_0x3001("0x5f")]["showMass"]) {
            /** @type {number} */
            constrainedSize = this[_0x3001("0x88")] ? .8 * sumOfFontSizes : .3 * sumOfFontSizes;
            if (null === this[_0x3001("0xb3")]) {
              this[_0x3001("0xb3")] = new SVGPlotFunction(constrainedSize, _0x3001("0x59"), !AgarTool["settings"][_0x3001("0x5f")][_0x3001("0xb4")], "#000000");
            }
            this[_0x3001("0xb3")][_0x3001("0xb0")](!AgarTool["settings"][_0x3001("0x5f")]["disableMassStroke"]);
            this[_0x3001("0xb3")][_0x3001("0x42")](~~(this[_0x3001("0x3d")] * this["size"] / 100));
            this[_0x3001("0xb3")]["setSize"](constrainedSize);
            var b = this[_0x3001("0xb3")][_0x3001("0x7b")]();
            if (b[_0x3001("0x50")] > 0 && b[_0x3001("0x51")] > 0) {
              /** @type {number} */
              var height = b[_0x3001("0x50")] * r * scale / scale;
              /** @type {number} */
              var i = b["height"] * r * scale / scale;
              style[_0x3001("0x6b")](b, y - height / 2, l - i / 2, height, i);
            }
          }
        }
      }
    }
  };
  obj = {
    5 : function(canCreateDiscussions) {
      target = {};
      for (; !canCreateDiscussions[_0x3001("0x22")]();) {
        var name = canCreateDiscussions[_0x3001("0xb7")]();
        var copy = canCreateDiscussions[_0x3001("0xb8")]();
        target[name] = copy;
      }
      return true;
    },
    16 : function(canCreateDiscussions) {
      var PL$24;
      var PL$28;
      /** @type {boolean} */
      _0x50b61b = false;
      var x;
      var type;
      var name;
      var data;
      var id;
      var options;
      var callback;
      var bNoOverwrite;
      var tind;
      var valueName1;
      var _0x326dcd;
      var _0x23f41a;
      var _0x14d8a8;
      var option;
      var is_document;
      var _0x59ee0f;
      var _0x410b78;
      var fn;
      var value;
      var proxied;
      var emobile;
      var _0x2d1e02;
      var DigitalTV;
      var obj;
      var PL$26 = canCreateDiscussions[_0x3001("0xb9")]();
      /** @type {number} */
      PL$24 = 0;
      for (; PL$24 < PL$26; PL$24 = PL$24 + 1) {
        x = canCreateDiscussions["readUInt32"]();
        type = canCreateDiscussions[_0x3001("0xb7")]();
        name = map[x];
        data = map[type];
        if (-1 !== colorProps[_0x3001("0x19")](x)) {
          if (data[_0x3001("0x88")]) {
            GET_AUTH_URL_TIMEOUT = GET_AUTH_URL_TIMEOUT + 1;
          }
          if (data[_0x3001("0x87")]) {
            numKeysDeleted = numKeysDeleted + 1;
          }
          if (!(data[_0x3001("0x87")] || data[_0x3001("0x88")] || data[_0x3001("0xa5")])) {
            postDateGmt = postDateGmt + 1;
          }
        }
        if (name && data) {
          if (data[_0x3001("0x88")]) {
            remove("sfxSplitBecauseVirus");
          } else {
            if (!(data["isPellet"] || data[_0x3001("0xa5")])) {
              remove(_0x3001("0xba"));
            }
          }
          data[_0x3001("0x8e")] = name;
          data["destroy"]();
          data["ox"] = data["x"];
          data["oy"] = data["y"];
          data[_0x3001("0x46")] = data["size"];
          data[_0x3001("0x8f")] = data[_0x3001("0x3d")];
          data["updateTime"] = now;
        }
      }
      for (; 0 !== (id = canCreateDiscussions[_0x3001("0xb7")]());) {
        options = canCreateDiscussions["readInt32"]();
        callback = canCreateDiscussions[_0x3001("0x2a")]();
        bNoOverwrite = canCreateDiscussions[_0x3001("0xb9")]();
        tind = canCreateDiscussions[_0x3001("0x28")]();
        valueName1 = window[_0x3001("0x40")](1 & tind);
        _0x326dcd = window[_0x3001("0x40")](2 & tind);
        _0x23f41a = window[_0x3001("0x40")](4 & tind);
        _0x14d8a8 = window["Boolean"](8 & tind);
        window[_0x3001("0x40")](16 & tind);
        option = window[_0x3001("0x40")](32 & tind);
        is_document = window[_0x3001("0x40")](64 & tind);
        /** @type {number} */
        _0x410b78 = 0;
        /** @type {null} */
        fn = null;
        /** @type {string} */
        value = "";
        /** @type {string} */
        proxied = "";
        /** @type {boolean} */
        emobile = false;
        false;
        /** @type {boolean} */
        _0x2d1e02 = false;
        false;
        false;
        false;
        false;
        false;
        if (_0x59ee0f = window["Boolean"](128 & tind)) {
          _0x410b78 = canCreateDiscussions["readUInt8"]();
          emobile = window[_0x3001("0x40")](1 & _0x410b78);
          window[_0x3001("0x40")](2 & _0x410b78);
          _0x2d1e02 = window[_0x3001("0x40")](4 & _0x410b78);
          window[_0x3001("0x40")](8 & _0x410b78);
          window[_0x3001("0x40")](16 & _0x410b78);
          window[_0x3001("0x40")](32 & _0x410b78);
          window["Boolean"](64 & _0x410b78);
          window[_0x3001("0x40")](128 & _0x410b78);
        }
        if (_0x326dcd) {
          fn = _validateCaptcha(canCreateDiscussions[_0x3001("0x28")]() << 16 | canCreateDiscussions[_0x3001("0x28")]() << 8 | canCreateDiscussions[_0x3001("0x28")]());
        }
        if (_0x23f41a) {
          proxied = canCreateDiscussions["readUTF8String"]();
        }
        if (_0x14d8a8) {
          value = canCreateDiscussions[_0x3001("0xb8")]();
        }
        if (_0x2d1e02) {
          DigitalTV = canCreateDiscussions[_0x3001("0xb7")]();
        }
        if (map[_0x3001("0xf")](id)) {
          (obj = map[id])[_0x3001("0x99")]();
          obj["ox"] = obj["x"];
          obj["oy"] = obj["y"];
          obj["oSize"] = obj["size"];
        } else {
          obj = new createHandle(id, options, callback, bNoOverwrite);
          if (emobile) {
            next[_0x3001("0x84")](obj);
          } else {
            bytes[_0x3001("0x84")](obj);
          }
          map[id] = obj;
          if (!is_document && option) {
            remove(_0x3001("0xbb"));
          }
        }
        if (_0x59ee0f) {
          obj[_0x3001("0x87")] = emobile;
          if (_0x2d1e02) {
            obj[_0x3001("0x62")] = DigitalTV;
          }
        }
        obj[_0x3001("0x88")] = valueName1;
        obj[_0x3001("0xa5")] = option;
        obj["setPosition"](options, callback);
        obj[_0x3001("0x8f")] = bNoOverwrite;
        obj[_0x3001("0x8d")] = now;
        obj["flags"] = tind;
        if (_0x23f41a) {
          obj[_0x3001("0x92")] = proxied;
        }
        if (_0x14d8a8) {
          obj["setName"](value);
        }
        if (_0x326dcd) {
          obj[_0x3001("0x9c")] = fn;
          obj[_0x3001("0x44")] = testcase(fn);
        }
        if (-1 !== colorProps["indexOf"](id) && -1 === nodes["indexOf"](obj)) {
          /** @type {boolean} */
          obj["isMine"] = true;
          nodes[_0x3001("0x84")](obj);
          obj[_0x3001("0xbc")](AgarTool["settings"][_0x3001("0x66")][_0x3001("0x67")]);
          if (1 === nodes[_0x3001("0x15")]) {
            m = obj["x"];
            max = obj["y"];
            inet3 = nodes[0][_0x3001("0x9c")];
            /** @type {!Array} */
            PL$120 = [];
            /** @type {boolean} */
            color = true;
            makeElectorTries();
            pt_up_time = now;
            window[_0x3001("0x38")][_0x3001("0xbd")]();
            if (window["MC"] && window["MC"][_0x3001("0xbe")]) {
              window["MC"][_0x3001("0xbe")]();
            }
          }
        }
        obj["updateSkin"]();
        if (obj["isMine"]) {
          window[_0x3001("0x38")][_0x3001("0xbf")](obj[_0x3001("0x92")]);
        }
      }
      var oldKey;
      var PL$33 = canCreateDiscussions[_0x3001("0xb9")]();
      /** @type {number} */
      PL$24 = 0;
      for (; PL$24 < PL$33; PL$24 = PL$24 + 1) {
        oldKey = canCreateDiscussions[_0x3001("0xb7")]();
        if (map[_0x3001("0xf")](oldKey)) {
          map[oldKey]["destroy"]();
        }
      }
      if (bytes[_0x3001("0xc0")](function(sizes, offsets) {
        return sizes[_0x3001("0x3d")] === offsets[_0x3001("0x3d")] ? sizes["id"] - offsets["id"] : sizes["size"] - offsets[_0x3001("0x3d")];
      }), next[_0x3001("0xc0")](function(cell, coordinates) {
        return cell[_0x3001("0x3d")] === coordinates["size"] ? cell["id"] - coordinates["id"] : cell[_0x3001("0x3d")] - coordinates[_0x3001("0x3d")];
      }), _0x50b61b && 0 === nodes["length"] && (color = false, window[_0x3001("0x38")][_0x3001("0xc1")](), remove("sfxGameOver"), 16 !== mm_login)) {
        var o = document[_0x3001("0xc2")](_0x3001("0xc3"));
        if (o) {
          var value = o[_0x3001("0x4f")]("2d");
          var row = o[_0x3001("0x50")];
          var h = o[_0x3001("0x51")];
          if (value[_0x3001("0xc4")](0, 0, row, h), PL$120["length"] > 2) {
            /** @type {number} */
            var range = 200;
            /** @type {number} */
            PL$24 = 0;
            for (; PL$24 < PL$120[_0x3001("0x15")]; PL$24 = PL$24 + 1) {
              range = window["Math"][_0x3001("0x8c")](PL$120[PL$24], range);
            }
            /** @type {number} */
            value[_0x3001("0x72")] = 3;
            value[_0x3001("0xc5")] = _0x3001("0x89");
            value["lineJoin"] = _0x3001("0x89");
            value[_0x3001("0x73")] = inet3;
            value["fillStyle"] = inet3;
            value["beginPath"]();
            value[_0x3001("0x5b")](0, h - PL$120[0] / range * (h - 10) + 10);
            /** @type {number} */
            PL$24 = 1;
            for (; PL$24 < PL$120["length"]; PL$24 = PL$24 + window["Math"]["max"](~~(PL$120[_0x3001("0x15")] / row), 1)) {
              /** @type {number} */
              var data = PL$24 / (PL$120[_0x3001("0x15")] - 1) * row;
              /** @type {!Array} */
              var r = [];
              /** @type {number} */
              PL$28 = -20;
              for (; 20 >= PL$28; PL$28 = PL$28 + 1) {
                if (!(0 > PL$24 + PL$28 || PL$24 + PL$28 >= PL$120[_0x3001("0x15")])) {
                  r[_0x3001("0x84")](PL$120[PL$24 + PL$28]);
                }
              }
              /** @type {number} */
              r = r[_0x3001("0xc6")](function(buckets, name) {
                return buckets + name;
              }) / r["length"] / range;
              value[_0x3001("0xc7")](data, h - r * (h - 10) + 10);
            }
            value[_0x3001("0x3f")]();
            /** @type {number} */
            value[_0x3001("0x52")] = .5;
            value[_0x3001("0xc7")](row, h);
            value[_0x3001("0xc7")](0, h);
            value[_0x3001("0x5d")]();
            /** @type {number} */
            value[_0x3001("0x52")] = 1;
          }
        }
        if (window["MC"] && window["MC"]["onPlayerDeath"]) {
          window["MC"][_0x3001("0xc8")](numKeysDeleted, end_string, now - pt_up_time, currentColumn, postDateGmt, optionsString, 0, 0, 0);
        }
      }
      return true;
    },
    17 : function(canCreateDiscussions) {
      return px = canCreateDiscussions[_0x3001("0x2d")](), min = canCreateDiscussions[_0x3001("0x2d")](), prevScale = canCreateDiscussions[_0x3001("0x2d")](), true;
    },
    18 : function(canCreateDiscussions) {
      return selector = normalize(selector), colorProps = [], nodes = [], map = {}, bytes = [], next = [], range = [], makeElectorTries(), true;
    },
    32 : function(canCreateDiscussions) {
      var x = canCreateDiscussions[_0x3001("0xb7")]();
      return colorProps[_0x3001("0x84")](x), true;
    },
    50 : function(canCreateDiscussions) {
      var viewerN;
      /** @type {!Array} */
      sections = [];
      var minN = canCreateDiscussions[_0x3001("0xb7")]();
      if (3 === minN) {
        /** @type {number} */
        viewerN = 0;
        for (; viewerN < minN; viewerN = viewerN + 1) {
          sections[_0x3001("0x84")](canCreateDiscussions[_0x3001("0x2d")]());
        }
        return render(), true;
      }
    },
    53 : function(canCreateDiscussions) {
      var i;
      var _0xf07899;
      var http;
      /** @type {!Array} */
      o = [];
      for (; !canCreateDiscussions[_0x3001("0x22")]();) {
        _0xf07899 = canCreateDiscussions[_0x3001("0x28")]();
        if ((http = {
          "bit1" : window[_0x3001("0x40")](1 & _0xf07899),
          "isNamePresent" : window["Boolean"](2 & _0xf07899),
          "isPlayerIDPresent" : window[_0x3001("0x40")](4 & _0xf07899),
          "isMine" : window[_0x3001("0x40")](8 & _0xf07899),
          "isFriend" : window[_0x3001("0x40")](16 & _0xf07899),
          "bit6" : window["Boolean"](32 & _0xf07899),
          "bit7" : window[_0x3001("0x40")](64 & _0xf07899),
          "bit8" : window[_0x3001("0x40")](128 & _0xf07899),
          "name" : null,
          "friendID" : null
        })[_0x3001("0xc9")]) {
          http[_0x3001("0x63")] = canCreateDiscussions[_0x3001("0xb8")]();
        }
        if (http[_0x3001("0xca")]) {
          http["friendID"] = canCreateDiscussions[_0x3001("0xb7")]();
        }
        http[_0x3001("0xcb")];
        http[_0x3001("0xcc")];
        http[_0x3001("0xcd")];
        http[_0x3001("0xce")];
        o[_0x3001("0x84")](http);
      }
      /** @type {string} */
      var hdft = "";
      /** @type {number} */
      i = 0;
      for (; i < o["length"] && !(i > 9); i = i + 1) {
        if (o[i][_0x3001("0x61")]) {
          /** @type {string} */
          hdft = hdft + (i + 1 + ". " + ("" === AgarTool[_0x3001("0x5e")][_0x3001("0x66")][_0x3001("0x67")] ? _0x3001("0x64") : AgarTool["settings"][_0x3001("0x66")][_0x3001("0x67")]) + (i > 8 ? "" : ", "));
        } else {
          /** @type {string} */
          hdft = hdft + (i + 1 + ". " + (null !== o[i][_0x3001("0x63")] ? o[i][_0x3001("0x63")] : "An unnamed cell") + (i > 8 ? "" : ", "));
        }
      }
      return window[_0x3001("0x38")][_0x3001("0xcf")](hdft), render(), true;
    },
    54 : function(canCreateDiscussions) {
      var i;
      var _0xf07899;
      var options;
      target = {};
      /** @type {!Array} */
      o = [];
      canCreateDiscussions[_0x3001("0xb9")]();
      for (; !canCreateDiscussions[_0x3001("0x22")]();) {
        _0xf07899 = canCreateDiscussions["readUInt8"]();
        if ((options = {
          "bit1" : window["Boolean"](1 & _0xf07899),
          "isNamePresent" : window[_0x3001("0x40")](2 & _0xf07899),
          "isPlayerIDPresent" : window[_0x3001("0x40")](4 & _0xf07899),
          "isMine" : window[_0x3001("0x40")](8 & _0xf07899),
          "isFriend" : window[_0x3001("0x40")](16 & _0xf07899),
          "bit6" : window[_0x3001("0x40")](32 & _0xf07899),
          "bit7" : window["Boolean"](64 & _0xf07899),
          "bit8" : window[_0x3001("0x40")](128 & _0xf07899),
          "name" : null,
          "friendID" : null
        })[_0x3001("0xc9")]) {
          options["name"] = canCreateDiscussions[_0x3001("0xb8")]();
        }
        if (options[_0x3001("0xca")]) {
          options[_0x3001("0x62")] = canCreateDiscussions[_0x3001("0xb7")]();
          if (options[_0x3001("0xd0")]) {
            /** @type {number} */
            target[options[_0x3001("0x62")]] = -1;
          }
        }
        options[_0x3001("0xcb")];
        options[_0x3001("0xcc")];
        options[_0x3001("0xcd")];
        options[_0x3001("0xce")];
        o[_0x3001("0x84")](options);
      }
      /** @type {string} */
      var hdft = "";
      /** @type {number} */
      i = 0;
      for (; i < o[_0x3001("0x15")] && !(i > 9); i = i + 1) {
        if (o[i]["isMine"]) {
          /** @type {string} */
          hdft = hdft + (i + 1 + ". " + ("" === AgarTool[_0x3001("0x5e")][_0x3001("0x66")][_0x3001("0x67")] ? _0x3001("0x64") : AgarTool[_0x3001("0x5e")][_0x3001("0x66")][_0x3001("0x67")]) + (i > 8 ? "" : ", "));
        } else {
          /** @type {string} */
          hdft = hdft + (i + 1 + ". " + (null !== o[i][_0x3001("0x63")] ? o[i][_0x3001("0x63")] : _0x3001("0x64")) + (i > 8 ? "" : ", "));
        }
      }
      return window["AgarTool"][_0x3001("0xcf")](hdft), render(), true;
    },
    64 : function(canCreateDiscussions) {
      return _0x19b24b ? (canCreateDiscussions[_0x3001("0x2e")](), canCreateDiscussions[_0x3001("0x2e")](), canCreateDiscussions[_0x3001("0x2e")](), canCreateDiscussions[_0x3001("0x2e")]()) : (ogMajor = canCreateDiscussions["readFloat64"](), low = canCreateDiscussions["readFloat64"](), majorVersion = canCreateDiscussions["readFloat64"](), high = canCreateDiscussions[_0x3001("0x2e")](), ogMajor, low, majorVersion, high, majorDiff = majorVersion - ogMajor, step = high - low, window[_0x3001("0x38")][_0x3001("0xd1")](ogMajor, 
      low, majorVersion, high), _0x19b24b = true, mm_login = canCreateDiscussions[_0x3001("0xb7")](), window[_0x3001("0x38")][_0x3001("0xd2")] = mm_login, px = ~~((ogMajor + majorVersion) / 2), min = ~~((low + high) / 2), m = ~~((ogMajor + majorVersion) / 2), max = ~~((low + high) / 2), prevScale = 1), true;
    },
    69 : function(canCreateDiscussions) {
      var targetOffsetHeight;
      var clientHeight = canCreateDiscussions[_0x3001("0xb9")]();
      /** @type {number} */
      targetOffsetHeight = 0;
      for (; targetOffsetHeight < clientHeight; targetOffsetHeight++) {
        var msg = canCreateDiscussions[_0x3001("0x2a")]();
        var errorCode = canCreateDiscussions[_0x3001("0x2a")]();
        var PL$15 = canCreateDiscussions[_0x3001("0xb7")]();
        var text = canCreateDiscussions[_0x3001("0x26")]();
        if (0 != text) {
          console["log"](_0x3001("0xd3") + msg);
          console[_0x3001("0xd4")](_0x3001("0xd5") + errorCode);
          console["log"]("size: " + PL$15);
          console[_0x3001("0xd4")](_0x3001("0xd6") + text);
        }
      }
      return true;
    },
    85 : function(canCreateDiscussions) {
      return window["MC"] && window["MC"]["recaptchaRequested"] && window["MC"][_0x3001("0xd7")](), true;
    },
    102 : function(canCreateDiscussions) {
      return window["MC"] && window["MC"]["onMobileData"] && window["MC"]["onMobileData"](new window["Uint8Array"](canCreateDiscussions[_0x3001("0x24")]())), true;
    },
    103 : function(canCreateDiscussions) {
      return true;
    },
    104 : function(canCreateDiscussions) {
      return true;
    },
    112 : function(canCreateDiscussions) {
      return true;
    },
    113 : function(canCreateDiscussions) {
      canCreateDiscussions[_0x3001("0x28")]();
      return true;
    },
    114 : function(canCreateDiscussions) {
      return window["document"][_0x3001("0xd8")](new Event("show_main_menu")), window["MC"][_0x3001("0xd9")](), true;
    },
    128 : function(canCreateDiscussions) {
      return window["MC"] && window["MC"][_0x3001("0xda")] && (console["log"](_0x3001("0xdb")), window["MC"][_0x3001("0xda")]()), true;
    },
    129 : function(canCreateDiscussions) {
      return true;
    },
    160 : function(canCreateDiscussions) {
      for (; !canCreateDiscussions[_0x3001("0x22")]();) {
        left = canCreateDiscussions[_0x3001("0x29")]();
        u = canCreateDiscussions[_0x3001("0x29")]();
        if (!canCreateDiscussions[_0x3001("0x22")]()) {
          if ("" == (hover = canCreateDiscussions["readUTF8String"]())) {
            hover = _0x3001("0x64");
          }
        }
      }
      return true;
    },
    161 : function(canCreateDiscussions) {
      return left = 2147483647, u = 2147483647, hover = "", true;
    },
    176 : function(canCreateDiscussions) {
      return _jsons = canCreateDiscussions[_0x3001("0xb7")](), true;
    },
    177 : function(canCreateDiscussions) {
      return _jsons = 0, _content = true, lastFPSTime = now, true;
    },
    178 : function(canCreateDiscussions) {
      return tree_ = canCreateDiscussions[_0x3001("0xb9")](), fadein = canCreateDiscussions["readUInt16"](), window[_0x3001("0x38")][_0x3001("0xdc")] = fadein, _currDirection === fadein && currentParent_ === tree_ || (render(), _currDirection = fadein, currentParent_ = tree_), 0 === fadein ? (dotJoin = 0, true) : (dotJoin = canCreateDiscussions["readUInt8"](), dotGroup = canCreateDiscussions["readInt32"](), name = canCreateDiscussions["readInt32"](), _maskLayerSimulate = canCreateDiscussions[_0x3001("0xb7")](), 
      window[_0x3001("0x38")][_0x3001("0xdd")] = dotGroup, window["AgarTool"][_0x3001("0xde")] = name, window["AgarTool"][_0x3001("0xdf")] = _maskLayerSimulate, _0x1e4495 = canCreateDiscussions["readUInt32"](), 1 === fadein || (_localExports = canCreateDiscussions["readInt32"](), _name = canCreateDiscussions["readInt32"](), _0x5a600a = canCreateDiscussions["readUInt32"](), window[_0x3001("0x38")]["safeZoneX"] = _localExports, window[_0x3001("0x38")]["safeZoneY"] = _name, window[_0x3001("0x38")][_0x3001("0xe0")] = 
      _0x5a600a, true));
    },
    179 : function(canCreateDiscussions) {
      var _0x39e31d = canCreateDiscussions["readUInt8"]();
      var c = canCreateDiscussions[_0x3001("0xb8")]();
      if ("" === c) {
        c = _0x3001("0x64");
      }
      /** @type {string} */
      var temp = "";
      if (0 === _0x39e31d) {
        var imgStateClass = canCreateDiscussions[_0x3001("0xb8")]();
        if ("" === imgStateClass) {
          imgStateClass = _0x3001("0x64");
        }
        /** @type {string} */
        temp = imgStateClass + " " + configImg[~~(window["Math"]["random"]() * configImg[_0x3001("0x15")])] + " " + c;
      } else {
        if (1 === _0x39e31d) {
          /** @type {string} */
          temp = c + " " + groups[~~(window[_0x3001("0x14")][_0x3001("0x86")]() * groups[_0x3001("0x15")])];
        } else {
          if (2 !== _0x39e31d) {
            return true;
          }
          /** @type {string} */
          temp = c + " " + n[~~(window[_0x3001("0x14")][_0x3001("0x86")]() * n[_0x3001("0x15")])];
        }
      }
      return data["unshift"](new $(temp)), true;
    },
    180 : function(canCreateDiscussions) {
      var viewerN;
      var _0xf07899;
      var artistTrack = canCreateDiscussions[_0x3001("0xb7")]();
      var GET_AUTH_URL_TIMEOUT = canCreateDiscussions[_0x3001("0xb7")]();
      var minN = canCreateDiscussions["readUInt16"]();
      /** @type {string} */
      var addedPathkey = "";
      /** @type {number} */
      viewerN = 0;
      for (; viewerN < minN; viewerN = viewerN + 1) {
        _0xf07899 = canCreateDiscussions[_0x3001("0xb8")]();
        /** @type {string} */
        addedPathkey = canCreateDiscussions["readUInt32"]() + ":" + _0xf07899 + ";" + addedPathkey;
      }
      return _content ? window["MC"] && window["MC"]["onPlayerDeathBattle"] && window["MC"]["onPlayerDeathBattle"](artistTrack, end_string, GET_AUTH_URL_TIMEOUT, addedPathkey, 0) : window["MC"] && window["MC"][_0x3001("0xe1")] && window["MC"]["onPlayerDeathBattle"](artistTrack, end_string, GET_AUTH_URL_TIMEOUT, addedPathkey, 1), _content = false, true;
    },
    226 : function(canCreateDiscussions) {
      var unexpectedFlowError = new Error;
      return unexpectedFlowError[_0x3001("0x20")](227), unexpectedFlowError[_0x3001("0x2f")](canCreateDiscussions[_0x3001("0x24")]()), done(unexpectedFlowError, true), true;
    },
    240 : function(canCreateDiscussions) {
      return true;
    },
    241 : function(canCreateDiscussions) {
      return selector = canCreateDiscussions[_0x3001("0x2a")](), dropdown = canCreateDiscussions["readUTF8String"](), window["MC"] && window["MC"][_0x3001("0xe2")] && window["MC"][_0x3001("0xe2")](dropdown), value = function() {
        var PL$42 = create(option) + dropdown;
        /** @type {!Array} */
        var tle_file_broken = [];
        var length = PL$42["length"];
        /** @type {number} */
        var PL$41 = 0;
        for (; PL$41 < PL$42["length"]; PL$41++) {
          tle_file_broken[_0x3001("0x84")](PL$42["charCodeAt"](PL$41));
        }
        var bb;
        var fixedBarsHeight;
        var viewportCenter;
        var contentVisibleHeight;
        var interestingPoint;
        /** @type {number} */
        var data = 255 ^ length;
        /** @type {number} */
        var PaleMoon = 0;
        if (length > 3) {
          /** @type {number} */
          viewportCenter = 4 + (fixedBarsHeight = -4 & (bb = length - 4));
          /** @type {number} */
          var tle_itor = 0;
          for (;;) {
            var _0x5ba24c = window[_0x3001("0x14")][_0x3001("0x13")](tle_file_broken[tle_itor] | tle_file_broken[tle_itor + 1] << 8 | tle_file_broken[tle_itor + 2] << 16 | tle_file_broken[tle_itor + 3] << 24, 1540483477);
            if (data = window[_0x3001("0x14")][_0x3001("0x13")](_0x5ba24c >>> 24 ^ _0x5ba24c, 1540483477) ^ window[_0x3001("0x14")]["imul"](data, 1540483477), (length = length - 4) <= 3) {
              break;
            }
            /** @type {number} */
            tle_itor = tle_itor + 4;
          }
          /** @type {number} */
          contentVisibleHeight = bb - fixedBarsHeight;
          /** @type {number} */
          interestingPoint = viewportCenter;
        }
        switch(contentVisibleHeight) {
          case 3:
            /** @type {number} */
            data = tle_file_broken[interestingPoint + 2] << 16 ^ data;
            /** @type {number} */
            PaleMoon = 7;
            break;
          case 2:
            /** @type {number} */
            PaleMoon = 7;
            break;
          case 1:
            break;
          default:
            /** @type {number} */
            var file_options = data;
            return file_options = file_options ^ file_options >>> 13, file_options = window[_0x3001("0x14")][_0x3001("0x13")](file_options, 1540483477), file_options = file_options ^ file_options >>> 15;
        }
        return 7 == PaleMoon && (data = tle_file_broken[interestingPoint + 1] << 8 ^ data), file_options = 0 | window[_0x3001("0x14")]["imul"]((0 | tle_file_broken[interestingPoint >> 0]) ^ data, 1540483477), file_options = file_options ^ file_options >>> 13, file_options = 0 | window[_0x3001("0x14")][_0x3001("0x13")](file_options, 1540483477), file_options = file_options ^ file_options >>> 15;
      }(), _0x5e9630 = true, window[_0x3001("0x38")][_0x3001("0xe3")](option), window["MC"] && window["MC"][_0x3001("0xe4")] && window["MC"]["onConnect"](), true;
    },
    242 : function(canCreateDiscussions) {
      return seed = canCreateDiscussions["readUInt32"](), prev = now, true;
    },
    255 : function(canCreateDiscussions) {
      var day = canCreateDiscussions[_0x3001("0xb7")]();
      var messageRegExp = canCreateDiscussions[_0x3001("0x24")]();
      /** @type {!Array} */
      var d = [];
      if (function(a, o, srcId, bytes) {
        var b;
        var c;
        var d;
        var x;
        var s;
        var pos;
        var i;
        var j = srcId = srcId || 0;
        var argsLength = bytes = bytes || a[_0x3001("0x15")] - srcId;
        /** @type {number} */
        var k = 0;
        for (; j < argsLength;) {
          if (b = a[j], j = j + 1, (c = b >> 4) > 0) {
            /** @type {number} */
            d = c + 240;
            for (; 255 === d;) {
              d = a[j];
              j = j + 1;
              c = c + d;
            }
            x = j + c;
            for (; j < x;) {
              o[k] = a[j];
              /** @type {number} */
              k = k + 1;
              j = j + 1;
            }
            if (j === argsLength) {
              return k;
            }
          }
          if (s = a[j], s = s | a[j = j + 1] << 8, j = j + 1, 0 === s || s > k) {
            return -(j - 2);
          }
          /** @type {number} */
          d = 240 + (pos = 15 & b);
          for (; 255 === d;) {
            d = a[j];
            j = j + 1;
            pos = pos + d;
          }
          /** @type {number} */
          i = k - s;
          x = k + pos + 4;
          for (; k < x;) {
            o[k] = o[i];
            /** @type {number} */
            k = k + 1;
            /** @type {number} */
            i = i + 1;
          }
        }
        return k;
      }(messageRegExp, d) < day) {
        return true;
      }
      if ((d = d[_0x3001("0xe5")](0, day))[_0x3001("0x15")] !== day) {
        return true;
      }
      var f = new Error;
      return f[_0x3001("0x2f")](d), define(f[_0x3001("0x28")](), f), true;
    }
  };
  window["setInterval"](function() {
    emit(false);
  }, 40);
  window["setInterval"](function() {
    var clonedOptions = function() {
      if (null === o) {
        return 0;
      }
      var i;
      /** @type {number} */
      i = 0;
      for (; i < o[_0x3001("0x15")]; i = i + 1) {
        if (o[i][_0x3001("0x61")]) {
          return i + 1;
        }
      }
      return 0;
    }();
    if (0 !== clonedOptions) {
      if (clonedOptions <= 10) {
        currentColumn = currentColumn + 1E3;
      }
      if (0 === optionsString) {
        optionsString = clonedOptions;
      }
      optionsString = window[_0x3001("0x14")][_0x3001("0xe6")](optionsString, clonedOptions);
    }
  }, 1E3);
  window[_0x3001("0xe7")](function() {
    if (color) {
      PL$120["push"](resolveToRelativePath() / 100);
    }
  }, 1E3 / 60);
  var states = {
    "init" : function(result) {
      /**
       * @param {number} c
       * @return {?}
       */
      function callback(c) {
        return c < l && (c = l), c > d && (c = d), ~~((c - l) / 32);
      }
      /**
       * @param {number} i
       * @return {?}
       */
      function parseInt(i) {
        return i < size && (i = size), i > n && (i = n), ~~((i - size) / 32);
      }
      var l = result["minX"];
      var size = result[_0x3001("0xe8")];
      var d = result[_0x3001("0xe9")];
      var n = result[_0x3001("0xea")];
      /** @type {number} */
      var width = 1 + ~~((d - l) / 32);
      /** @type {!Array} */
      var data = Array(width * (1 + ~~((n - size) / 32)));
      return {
        "insert" : function(val) {
          var name = callback(val["x"]) + parseInt(val["y"]) * width;
          if (null == data[name]) {
            /** @type {!Object} */
            data[name] = val;
          } else {
            if (Array[_0x3001("0xeb")](data[name])) {
              data[name][_0x3001("0x84")](val);
            } else {
              /** @type {!Array} */
              data[name] = [data[name], val];
            }
          }
        },
        "retrieve2" : function(a, b, d, c, callback) {
          var x;
          var i;
          var ret = callback(a);
          var r = parseInt(b);
          a = callback(a + d);
          b = parseInt(b + c);
          for (; r <= b; r = r + 1) {
            x = ret;
            for (; x <= a; x = x + 1) {
              var arr = data[x + r * width];
              if (null != arr) {
                if (Array["isArray"](arr)) {
                  /** @type {number} */
                  i = 0;
                  for (; i < arr[_0x3001("0x15")]; i = i + 1) {
                    callback(arr[i]);
                  }
                } else {
                  callback(arr);
                }
              }
            }
          }
        }
      };
    }
  };
  window["core"] = {
    "connect" : function(object) {
      /** @type {string} */
      option = object;
      if (null !== opt) {
        /** @type {boolean} */
        opt["dontNotifyMC"] = true;
        checkForError();
      }
      try {
        window[_0x3001("0xec")]["ui"][_0x3001("0xed")][_0x3001("0xee")] = create(option);
      } catch (msg) {
        console[_0x3001("0xd4")](_0x3001("0xef") + msg);
      }
      /** @type {number} */
      selector = 0;
      /** @type {number} */
      value = 1768497069;
      /** @type {boolean} */
      _0x5e9630 = false;
      /** @type {boolean} */
      _0x19b24b = false;
      makeElectorTries();
      /** @type {!Array} */
      colorProps = [];
      /** @type {!Array} */
      nodes = [];
      map = {};
      /** @type {!Array} */
      bytes = [];
      /** @type {!Array} */
      next = [];
      /** @type {!Array} */
      range = [];
      /** @type {!Array} */
      o = [];
      0;
      /** @type {null} */
      canvas = null;
      /** @type {!Array} */
      sections = [];
      0;
      /** @type {boolean} */
      color = false;
      /** @type {number} */
      dotGroup = 0;
      /** @type {number} */
      name = 0;
      /** @type {number} */
      _maskLayerSimulate = 0;
      /** @type {number} */
      _localExports = 0;
      /** @type {number} */
      _name = 0;
      /** @type {number} */
      _0x5a600a = 0;
      /** @type {number} */
      mm_login = -1;
      /** @type {number} */
      fadein = 0;
      /** @type {number} */
      dotJoin = 0;
      /** @type {number} */
      _0x1e4495 = 0;
      /** @type {number} */
      prev = 0;
      /** @type {number} */
      seed = 0;
      /** @type {!Array} */
      data = [];
      /** @type {boolean} */
      _content = false;
      /** @type {number} */
      _jsons = 0;
      /** @type {number} */
      _currDirection = -1;
      /** @type {number} */
      currentParent_ = -1;
      /** @type {number} */
      lastFPSTime = 0;
      /** @type {number} */
      left = 2147483647;
      /** @type {number} */
      u = 2147483647;
      /** @type {string} */
      hover = "";
      target = {};
      try {
        (opt = new (window[_0x3001("0x35")])(option))["binaryType"] = _0x3001("0xf0");
        /**
         * @return {undefined}
         */
        opt["onopen"] = function() {
          now = window[_0x3001("0xf1")][_0x3001("0xf2")]();
          var unexpectedFlowError = new Error;
          unexpectedFlowError[_0x3001("0x20")](254);
          unexpectedFlowError["writeUInt32"](20);
          done(unexpectedFlowError, false);
          unexpectedFlowError[_0x3001("0x20")](255);
          unexpectedFlowError[_0x3001("0x31")](30404);
          done(unexpectedFlowError, false);
        };
        /**
         * @param {!Object} event
         * @return {undefined}
         */
        opt[_0x3001("0x3a")] = function(event) {
          equal(event["target"]);
        };
        /**
         * @param {?} selectedModels
         * @return {undefined}
         */
        opt[_0x3001("0xf3")] = function(selectedModels) {
          equal(selectedModels[_0x3001("0xf4")]);
        };
        /**
         * @param {?} canCreateDiscussions
         * @return {undefined}
         */
        opt[_0x3001("0x39")] = function(canCreateDiscussions) {
          var size;
          if ((now = window["performance"][_0x3001("0xf2")]()) - duration > 2E3) {
            /** @type {number} */
            size = 0;
            for (; size < data[_0x3001("0x15")]; size = size + 1) {
              if (now - data[size]["timeCreated"] > 6E3) {
                data = data[_0x3001("0xe5")](0, size);
                break;
              }
            }
            /** @type {number} */
            size = 0;
            for (; size < range[_0x3001("0x15")]; size = size + 1) {
              range[size][_0x3001("0x99")]();
            }
          }
          var fill = new Error;
          fill[_0x3001("0x2f")](new (window[_0x3001("0x49")])(canCreateDiscussions[_0x3001("0xf5")]));
          if (0 !== selector) {
            fill[_0x3001("0x23")](30404 ^ selector);
          }
          define(fill[_0x3001("0x28")](), fill);
        };
      } catch (_0x53151b) {
        checkForError();
      }
    },
    "sendNick" : function(cb) {
      var i;
      /** @type {number} */
      i = 0;
      for (; i < nodes["length"]; i = i + 1) {
        nodes[i][_0x3001("0x63")] = AgarTool[_0x3001("0x5e")][_0x3001("0x66")][_0x3001("0x67")];
        nodes[i]["updateSkin"]();
      }
      0;
      var unexpectedFlowError = new Error;
      unexpectedFlowError[_0x3001("0x20")](0);
      unexpectedFlowError["writeUTF8String"](AgarTool[_0x3001("0x5e")][_0x3001("0x66")][_0x3001("0x67")]);
      done(unexpectedFlowError, true);
    },
    "loadSkin" : function(url) {
    },
    "sendSpectate" : function() {
      window[_0x3001("0x38")][_0x3001("0xf6")]();
      var unexpectedFlowError = new Error;
      unexpectedFlowError[_0x3001("0x20")](1);
      done(unexpectedFlowError, true);
    },
    "setTarget" : function(aRangeParent, aRangeOffset) {
      if (window[_0x3001("0x38")][_0x3001("0xb6")]) {
        /** @type {number} */
        x = opt_param[_0x3001("0x50")] / 2;
        /** @type {number} */
        y = opt_param[_0x3001("0x51")] / 2;
      } else {
        /** @type {number} */
        x = 1 * aRangeParent;
        /** @type {number} */
        y = 1 * aRangeOffset;
      }
      setTarget();
    },
    "playerZoom" : function(maxDec) {
      if ((rDec = rDec * window[_0x3001("0x14")][_0x3001("0xf7")](.9, maxDec)) < .01) {
        /** @type {number} */
        rDec = .01;
      }
      if (rDec > 4 / scale) {
        /** @type {number} */
        rDec = 4 / scale;
      }
    },
    "split" : function() {
      var i;
      if (color && nodes[_0x3001("0x15")] > 0 && nodes[_0x3001("0x15")] < 16) {
        /** @type {number} */
        i = 0;
        for (; i < nodes[_0x3001("0x15")]; i++) {
          if (nodes[i][_0x3001("0x8f")] * nodes[i]["nSize"] / 100 >= 35) {
            remove(_0x3001("0xf8"));
            break;
          }
        }
      }
      emit(true);
      var unexpectedFlowError = new Error;
      unexpectedFlowError[_0x3001("0x20")](17);
      done(unexpectedFlowError, true);
    },
    "eject" : function() {
      emit(true);
      var unexpectedFlowError = new Error;
      unexpectedFlowError[_0x3001("0x20")](21);
      done(unexpectedFlowError, true);
    },
    "specialOn" : function() {
      var unexpectedFlowError = new Error;
      unexpectedFlowError["setCommandID"](18);
      done(unexpectedFlowError, true);
    },
    "specialOff" : function() {
    },
    "registerSkin" : function(isSlidingUp, $cont, $slides, blockByTime, showMsg) {
      if ("uses_spine" === $slides) {
        $slides = "https://cdn.agartool.io/skins/" + $cont[_0x3001("0xf9")](/%(.{1,100})_level.{1,100}/gi, "$1") + _0x3001("0xfa");
      }
      switch(blockByTime) {
        case 0:
        case 1:
          if (null === isSlidingUp || null === $slides) {
            return window["console"][_0x3001("0xd4")](_0x3001("0xfb"));
          }
          parsedHash[isSlidingUp[_0x3001("0x93")]()] = new WMCacheControl($slides, null, 0 === blockByTime);
          break;
        case 2:
          if (null === $cont || null === showMsg || null === $slides) {
            return window[_0x3001("0xfc")][_0x3001("0xd4")](_0x3001("0xfd"));
          }
          checkerMap[$cont["toLowerCase"]()] = new WMCacheControl($slides, testcase(_validateCaptcha(showMsg)), true);
      }
    },
    "registerAnimatedSkin" : function(boardManager, isSlidingUp, $cont, $slides) {
    },
    "registerGamePlaySetting" : function(boardManager, isSlidingUp, $cont, $slides, callback, scopeIn) {
    },
    "proxyMobileData" : function(mmCoreSplitViewBlock) {
      var unexpectedFlowError = new Error;
      unexpectedFlowError[_0x3001("0x20")](102);
      unexpectedFlowError["writeBytes"](mmCoreSplitViewBlock);
      done(unexpectedFlowError, true);
    },
    "showAnimations" : function(canCreateDiscussions) {
    },
    "setFadeout" : function(canCreateDiscussions) {
    },
    "setShowMass" : function(val) {
    },
    "setShowQuest" : function(canCreateDiscussions) {
    },
    "setDarkTheme" : function(darkTheme) {
    },
    "setNames" : function(changeMessage) {
    },
    "setColors" : function(n) {
    },
    "setSkins" : function(val) {
    },
    "setAcid" : function(arg) {
    },
    "setQuality" : function(quality) {
    },
    "setMinimap" : function(canCreateDiscussions) {
    },
    "minimizeMinimap" : function(canCreateDiscussions) {
    },
    "playersMinimap" : function(canCreateDiscussions) {
    },
    "disconnect" : function() {
      if (null !== opt) {
        /** @type {boolean} */
        opt[_0x3001("0x36")] = true;
      }
      checkForError();
    },
    "disableIntegrityChecks" : function(trackInfoUrl) {
      /** @type {boolean} */
      lastTrackInfoUrl = trackInfoUrl;
    },
    "recaptchaResponse" : function(mmCoreSplitViewBlock) {
      var unexpectedFlowError = new Error;
      unexpectedFlowError[_0x3001("0x20")](86);
      unexpectedFlowError[_0x3001("0xfe")](mmCoreSplitViewBlock);
      done(unexpectedFlowError, true);
    },
    "sendFacebookData" : function(mmCoreSplitViewBlock) {
      if (mmCoreSplitViewBlock[_0x3001("0x15")] > 16110) {
        mmCoreSplitViewBlock = mmCoreSplitViewBlock[_0x3001("0xff")](0, 16110);
      }
      var unexpectedFlowError = new Error;
      unexpectedFlowError[_0x3001("0x20")](5);
      unexpectedFlowError[_0x3001("0xfe")](mmCoreSplitViewBlock);
      done(unexpectedFlowError, true);
    },
    "setFpsCap" : function(canCreateDiscussions) {
    },
    "destroy" : function() {
    },
    "getGameState" : function() {
      return fadein;
    },
    "cancelEnterArena" : function() {
    },
    "playerHasCells" : function() {
      return nodes[_0x3001("0x15")] > 0;
    }
  };
  languageContents = new Map(_0x3001("0x100"));
  humanizedTemplates = new Map(_0x3001("0x101"));
  unexpectedPackets = new Map(_0x3001("0x102"));
  if (null !== (opt_param = window[_0x3001("0x4c")]["getElementById"](_0x3001("0x4e")))) {
    style = opt_param[_0x3001("0x4f")]("2d");
    duration = window[_0x3001("0xf1")][_0x3001("0xf2")]();
    window[_0x3001("0x103")](function init(time) {
      var i;
      if (!time || time > 1E12) {
        time = window[_0x3001("0xf1")][_0x3001("0xf2")]();
      }
      window["requestAnimationFrame"](init);
      /** @type {number} */
      var delta = time - duration;
      if (delta > interval) {
        /** @type {number} */
        duration = time - delta % interval;
        /** @type {boolean} */
        var zoomIn = false;
        if (width !== opt_param["width"] || height !== opt_param[_0x3001("0x51")]) {
          /** @type {boolean} */
          _0x318b20 = false;
          width = opt_param[_0x3001("0x50")];
          height = opt_param["height"];
          margin = window[_0x3001("0x14")][_0x3001("0xe6")](width / 1920, height / 1080);
          /** @type {boolean} */
          zoomIn = true;
          render();
          var _0x326dcd = window[_0x3001("0x14")][_0x3001("0xe6")](window[_0x3001("0xb5")] / 1920, window[_0x3001("0x104")] / 1080);
          $(_0x3001("0x105"))["css"](_0x3001("0x106"), ~~(15 * _0x326dcd) + "px");
          $(_0x3001("0x105"))[_0x3001("0x107")](_0x3001("0x108"), ~~(60 * _0x326dcd) + "px");
          $("#messageTempContainer")[_0x3001("0x107")](_0x3001("0x50"), ~~(650 * _0x326dcd) + "px");
          $("#messageCompleteContainer")["css"]("left", ~~(15 * _0x326dcd) + "px");
          $(_0x3001("0x109"))["css"](_0x3001("0x108"), ~~(60 * _0x326dcd) + "px");
          $("#messageCompleteContainer")["css"](_0x3001("0x50"), ~~(650 * _0x326dcd) + "px");
          $(_0x3001("0x10a"))["css"](_0x3001("0x10b"), ~~(200 * _0x326dcd) + "px");
          $(_0x3001("0x10a"))[_0x3001("0x107")](_0x3001("0x50"), ~~(200 * _0x326dcd) + "px");
          $(_0x3001("0x10a"))[_0x3001("0x107")](_0x3001("0x10c"), ~~(20 * _0x326dcd) + "px");
          $(".messageTable")[_0x3001("0x107")](_0x3001("0x10d"), "0 " + ~~(8 * _0x326dcd) + "px");
          $(_0x3001("0x10e"))["css"]("height", ~~(50 * _0x326dcd) + "px");
          $(_0x3001("0x10f"))[_0x3001("0x107")](_0x3001("0x110"), ~~(8 * _0x326dcd) + "px");
          $(_0x3001("0x10f"))[_0x3001("0x107")]("padding-right", ~~(8 * _0x326dcd) + "px");
          $(".chatTDMessage")[_0x3001("0x107")](_0x3001("0x111"), ~~(4 * _0x326dcd) + "px");
          $(_0x3001("0x112"))[_0x3001("0x107")](_0x3001("0x110"), ~~(8 * _0x326dcd) + "px");
          $(_0x3001("0x112"))[_0x3001("0x107")](_0x3001("0x113"), ~~(8 * _0x326dcd) + "px");
          $(_0x3001("0x112"))[_0x3001("0x107")](_0x3001("0x50"), ~~(405 * _0x326dcd) + "px");
          $(_0x3001("0x112"))[_0x3001("0x107")]("max-width", ~~(405 * _0x326dcd) + "px");
          $(_0x3001("0x112"))[_0x3001("0x107")](_0x3001("0x10c"), ~~(20 * _0x326dcd) + "px");
          $(_0x3001("0x109"))["perfectScrollbar"](_0x3001("0x114"));
        }
        if (margin <= 0) {
          return;
        }
        /** @type {number} */
        now = time;
        /** @type {number} */
        i = 0;
        for (; i < next[_0x3001("0x15")]; i = i + 1) {
          next[i][_0x3001("0x115")]();
        }
        /** @type {number} */
        i = 0;
        for (; i < range[_0x3001("0x15")]; i = i + 1) {
          range[i][_0x3001("0x115")]();
        }
        /** @type {number} */
        i = 0;
        for (; i < bytes[_0x3001("0x15")]; i = i + 1) {
          bytes[i][_0x3001("0x115")]();
        }
        /** @type {null} */
        var right = null;
        if (nodes[_0x3001("0x15")] > 0) {
          /** @type {number} */
          var w = 0;
          /** @type {number} */
          var num = 0;
          /** @type {number} */
          var _0x3336f3 = 0;
          /** @type {number} */
          i = 0;
          for (; i < nodes[_0x3001("0x15")]; i = i + 1) {
            /** @type {number} */
            w = w + nodes[i]["x"] / nodes["length"];
            /** @type {number} */
            num = num + nodes[i]["y"] / nodes[_0x3001("0x15")];
            _0x3336f3 = _0x3336f3 + nodes[i][_0x3001("0x3d")];
            if (null === right || nodes[i][_0x3001("0x8f")] > right[_0x3001("0x8f")]) {
              right = nodes[i];
            }
          }
          scale = window[_0x3001("0x38")]["settings"]["checkboxes"]["autoZoom"] ? zoomIn ? window[_0x3001("0x14")]["pow"](window[_0x3001("0x14")][_0x3001("0xe6")](64 / _0x3336f3, 1), .4) * parseInt() : (9 * scale + window[_0x3001("0x14")]["pow"](window["Math"][_0x3001("0xe6")](64 / _0x3336f3, 1), .4) * parseInt()) / 10 : zoomIn ? parseInt() : (9 * scale + parseInt()) / 10;
          /** @type {number} */
          px = w;
          /** @type {number} */
          min = num;
          prevScale = scale;
          /** @type {number} */
          m = (m + w) / 2;
          /** @type {number} */
          max = (max + num) / 2;
        } else {
          /** @type {number} */
          m = (19 * m + px) / 20;
          /** @type {number} */
          max = (19 * max + min) / 20;
          scale = window[_0x3001("0x38")][_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0x116")] ? zoomIn ? prevScale * parseInt() : (9 * scale + prevScale * parseInt()) / 10 : zoomIn ? parseInt() : (9 * scale + parseInt()) / 10;
        }
        if (window[_0x3001("0x38")]["playerX"] = m, window[_0x3001("0x38")][_0x3001("0x117")] = max, function() {
          var i;
          var j;
          var b;
          if (scale < .4 || !AgarTool["settings"][_0x3001("0x5f")][_0x3001("0x9f")]) {
            /** @type {null} */
            axis = null;
          } else {
            var minX = window["Number"][_0x3001("0x118")];
            var y = window[_0x3001("0x119")][_0x3001("0x118")];
            var x = window["Number"][_0x3001("0x11a")];
            var ret = window["Number"][_0x3001("0x11a")];
            /** @type {number} */
            i = 0;
            for (; i < bytes[_0x3001("0x15")]; i = i + 1) {
              if ((b = bytes[i])[_0x3001("0x9a")] && !b[_0x3001("0x9b")]) {
                minX = window[_0x3001("0x14")][_0x3001("0xe6")](b["x"] - b["size"], minX);
                y = window[_0x3001("0x14")]["min"](b["y"] - b[_0x3001("0x3d")], y);
                x = window[_0x3001("0x14")]["max"](b["x"] + b[_0x3001("0x3d")], x);
                ret = window[_0x3001("0x14")]["max"](b["y"] + b[_0x3001("0x3d")], ret);
              }
            }
            /** @type {number} */
            i = 0;
            for (; i < next[_0x3001("0x15")]; i = i + 1) {
              if ((b = next[i])[_0x3001("0x9a")] && !b[_0x3001("0x9b")]) {
                minX = window["Math"][_0x3001("0xe6")](b["x"] - b[_0x3001("0x3d")], minX);
                y = window[_0x3001("0x14")]["min"](b["y"] - b[_0x3001("0x3d")], y);
                x = window[_0x3001("0x14")][_0x3001("0x8c")](b["x"] + b[_0x3001("0x3d")], x);
                ret = window[_0x3001("0x14")][_0x3001("0x8c")](b["y"] + b[_0x3001("0x3d")], ret);
              }
            }
            axis = states["init"]({
              "minX" : minX - 10,
              "minY" : y - 10,
              "maxX" : x + 10,
              "maxY" : ret + 10
            });
            /** @type {number} */
            i = 0;
            for (; i < bytes[_0x3001("0x15")]; i = i + 1) {
              if ((b = bytes[i])[_0x3001("0x9a")]) {
                /** @type {number} */
                j = 0;
                for (; j < b[_0x3001("0x47")][_0x3001("0x15")]; j = j + 1) {
                  y = b[_0x3001("0x47")][j]["x"];
                  x = b[_0x3001("0x47")][j]["y"];
                  if (!(y < m - width / 2 / scale || x < max - height / 2 / scale || y > m + width / 2 / scale || x > max + height / 2 / scale)) {
                    axis[_0x3001("0x11b")](b[_0x3001("0x47")][j]);
                  }
                }
              }
            }
            /** @type {number} */
            i = 0;
            for (; i < next[_0x3001("0x15")]; i = i + 1) {
              if ((b = next[i])[_0x3001("0x9a")]) {
                /** @type {number} */
                j = 0;
                for (; j < b[_0x3001("0x47")]["length"]; j = j + 1) {
                  y = b["points"][j]["x"];
                  x = b[_0x3001("0x47")][j]["y"];
                  if (!(y < m - width / 2 / scale || x < max - height / 2 / scale || y > m + width / 2 / scale || x > max + height / 2 / scale)) {
                    axis[_0x3001("0x11b")](b[_0x3001("0x47")][j]);
                  }
                }
              }
            }
          }
        }(), setTarget(), AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0x11c")]) {
          style[_0x3001("0x53")] = AgarTool[_0x3001("0x5e")][_0x3001("0x5f")]["darkTheme"] ? _0x3001("0x11d") : _0x3001("0x11e");
          /** @type {number} */
          style[_0x3001("0x52")] = .05;
          style["fillRect"](0, 0, width, height);
          /** @type {number} */
          style[_0x3001("0x52")] = 1;
        } else {
          if (style["clearRect"](0, 0, width, height), style[_0x3001("0x53")] = AgarTool["settings"][_0x3001("0x5f")][_0x3001("0x11f")] ? _0x3001("0x11d") : _0x3001("0x11e"), style[_0x3001("0x54")](0, 0, width, height), window[_0x3001("0x38")][_0x3001("0x5e")][_0x3001("0x5f")]["drawGrid"] && scale > .08) {
            style["save"]();
            style[_0x3001("0x73")] = AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0x11f")] ? _0x3001("0x9e") : _0x3001("0xd");
            /** @type {number} */
            style[_0x3001("0x52")] = .2 * scale;
            /** @type {number} */
            var newWidth = width / scale;
            /** @type {number} */
            var dy = height / scale;
            style["beginPath"]();
            /** @type {number} */
            i = (newWidth / 2 - m) % 50;
            for (; i < newWidth; i = i + 50) {
              style[_0x3001("0x5b")](i * scale - .5, 0);
              style[_0x3001("0xc7")](i * scale - .5, dy * scale);
            }
            /** @type {number} */
            i = (dy / 2 - max) % 50;
            for (; i < dy; i = i + 50) {
              style[_0x3001("0x5b")](0, i * scale - .5);
              style["lineTo"](newWidth * scale, i * scale - .5);
            }
            style[_0x3001("0x3f")]();
            style[_0x3001("0xa9")]();
          }
        }
        style[_0x3001("0x79")]();
        style[_0x3001("0x120")](width / 2, height / 2);
        style[_0x3001("0x60")](scale, scale);
        style["translate"](-m, -max);
        style["lineCap"] = _0x3001("0x89");
        /** @type {number} */
        numberOfCountedTextNodes = scale < .01 ? 60 : scale < .02 ? 30 : scale < .03 ? 19 : scale < .05 ? 13 : scale < .07 ? 11 : scale < .08 ? 10 : scale < .09 ? 8 : scale < .1 ? 6 : scale < .15 ? 5 : scale < .2 ? 4 : scale < .4 ? 3 : scale < .6 ? 2 : 1;
        /** @type {number} */
        style["globalAlpha"] = 1;
        /** @type {number} */
        i = 0;
        for (; i < next[_0x3001("0x15")]; i = i + 1) {
          next[i][_0x3001("0x121")]();
        }
        /** @type {number} */
        i = 0;
        for (; i < range[_0x3001("0x15")]; i = i + 1) {
          /** @type {number} */
          style["globalAlpha"] = 1 - 1 * range[i]["destroyedAlphaNum"];
          if (range[i][_0x3001("0x87")]) {
            range[i]["drawPellet"]();
          } else {
            range[i][_0x3001("0x122")](right);
          }
        }
        /** @type {number} */
        style[_0x3001("0x52")] = 1;
        /** @type {number} */
        i = 0;
        for (; i < bytes[_0x3001("0x15")]; i = i + 1) {
          bytes[i][_0x3001("0x122")](right);
        }
        if (AgarTool[_0x3001("0x5e")]["checkboxes"]["splitRange"] && null !== right && right[_0x3001("0x3d")] < 600) {
          /** @type {number} */
          style[_0x3001("0x72")] = 4;
          if (AgarTool[_0x3001("0x5e")]["checkboxes"]["darkTheme"]) {
            style[_0x3001("0x73")] = _0x3001("0x59");
          } else {
            /** @type {string} */
            style[_0x3001("0x73")] = "#000000";
          }
          style[_0x3001("0x98")]();
          style[_0x3001("0x5c")](right["x"], right["y"], right["size"] + 760, 0, 2 * window[_0x3001("0x14")]["PI"], false);
          style[_0x3001("0x3f")]();
        }
        if (16 === mm_login && fadein > 0 && _maskLayerSimulate > 0) {
          style[_0x3001("0x123")](ogMajor, low, majorDiff, step);
          style[_0x3001("0xa8")]();
          style[_0x3001("0x98")]();
          style[_0x3001("0x53")] = _0x3001("0x124");
          style["arc"](dotGroup, name, _maskLayerSimulate, 0, 2 * window[_0x3001("0x14")]["PI"], false);
          style["save"]();
          style[_0x3001("0x125")](1, 0, 0, 1, 0, 0);
          style[_0x3001("0x5b")](0, 0);
          style[_0x3001("0xc7")](0, height);
          style[_0x3001("0xc7")](width, height);
          style[_0x3001("0xc7")](width, 0);
          style[_0x3001("0xc7")](0, 0);
          style[_0x3001("0x5d")]();
          style["restore"]();
        }
        style[_0x3001("0xa9")]();
        if (null !== canvas && canvas[_0x3001("0x50")] > 0 && canvas[_0x3001("0x51")] > 0) {
          style["drawImage"](canvas, width - canvas[_0x3001("0x50")] - 15 * margin, 15 * margin);
        }
        /** @type {number} */
        end_string = ~~window[_0x3001("0x14")][_0x3001("0x8c")](end_string, resolveToRelativePath() / 100);
        /** @type {string} */
        var result = "";
        if (AgarTool[_0x3001("0x5e")][_0x3001("0x5f")]["showFPS"] && (result = _0x3001("0x126") + group), color && 0 !== end_string && AgarTool["settings"][_0x3001("0x5f")][_0x3001("0x127")] && (result = result + ", "), color && 0 !== end_string && (result = result + (_0x3001("0x128") + end_string)), "" !== result && (null === button2 && (button2 = new SVGPlotFunction(24, _0x3001("0x59"))), button2[_0x3001("0x42")](result), button2[_0x3001("0x7a")](margin), (bounds = button2[_0x3001("0x7b")]())[_0x3001("0x50")] > 
        0 && bounds[_0x3001("0x51")] > 0)) {
          var max = bounds[_0x3001("0x50")];
          /** @type {number} */
          style[_0x3001("0x52")] = .4;
          style[_0x3001("0x53")] = _0x3001("0xd");
          style[_0x3001("0x54")](15 * margin, height - 39 * margin - 15 * margin, max + 15 * margin, 39 * margin);
          /** @type {number} */
          style[_0x3001("0x52")] = 1;
          style["drawImage"](bounds, 21 * margin, height - 24 * margin - 23 * margin - 5 * margin);
        }
        var depthPrefix = Object["keys"](target)[_0x3001("0x15")];
        if (depthPrefix > 0) {
          var node = humanizedTemplates[_0x3001("0xe")]();
          if (null !== node) {
            var name = depthPrefix + _0x3001("0x129");
            if (depthPrefix > 1) {
              /** @type {string} */
              name = name + "s";
            }
            style["drawImage"](node, width - 525 * margin, 40 * margin, node[_0x3001("0x50")] * margin, node[_0x3001("0x51")] * margin);
            /** @type {number} */
            style[_0x3001("0x52")] = 1;
            style[_0x3001("0x53")] = _0x3001("0x12a");
            style[_0x3001("0x55")] = 28 * margin + _0x3001("0x70");
            style[_0x3001("0x57")](name, width - 480 * margin, 65 * margin);
          }
        }
        /** @type {boolean} */
        var _0x1614f3 = false;
        if (color && 0 === mm_login && AgarTool[_0x3001("0x5e")][_0x3001("0x5f")][_0x3001("0x12b")] && 0 !== optionsString && window["MC"] && window["MC"][_0x3001("0x12c")] && window["MC"][_0x3001("0x12d")] && window["MC"]["onPlayerStatsUpdate"]) {
          window["MC"]["onPlayerStatsUpdate"](numKeysDeleted, end_string, now - pt_up_time, GET_AUTH_URL_TIMEOUT, postDateGmt, optionsString);
          var bounds;
          var value = window["MC"][_0x3001("0x12c")]();
          /** @type {null} */
          var node = null;
          if ("" !== value) {
            if (window["MC"]["checkQuestComplete"]() ? (0 === touchEndTime ? (remove(_0x3001("0x12e")), touchEndTime = now, delta = 0) : now - touchEndTime > 5E3 && (delta = delta + 2), node = languageContents[_0x3001("0xe")]()) : (touchEndTime = 0, delta = 0), null === settingHandler && (settingHandler = new SVGPlotFunction(24, _0x3001("0x59"))), settingHandler[_0x3001("0x42")](value), settingHandler["setScale"](margin), (bounds = settingHandler[_0x3001("0x7b")]())[_0x3001("0x50")] > 0 && bounds["height"] > 
            0) {
              /** @type {number} */
              var ys = height - 39 * margin - 15 * margin + delta * margin;
              if (ys < height) {
                /** @type {boolean} */
                _0x1614f3 = true;
                /** @type {number} */
                style[_0x3001("0x52")] = .4;
                /** @type {string} */
                style["fillStyle"] = "#000000";
                style[_0x3001("0x54")](width / 2 - bounds["width"] / 2, ys, bounds[_0x3001("0x50")] + 15 * margin, 39 * margin);
                /** @type {number} */
                style["globalAlpha"] = 1;
                style[_0x3001("0x6b")](bounds, width / 2 - bounds["width"] / 2 + 7 * margin, height - 24 * margin - 23 * margin - 5 * margin + delta * margin);
                if (null !== node) {
                  style[_0x3001("0x6b")](node, width / 2 + bounds[_0x3001("0x50")] / 2 + 20 * margin, ys, node[_0x3001("0x50")] / 2 * margin, node[_0x3001("0x51")] / 2 * margin);
                }
              }
            }
          } else {
            /** @type {number} */
            touchEndTime = 0;
          }
        }
        /** @type {number} */
        var desiredWidth = 400 * margin;
        /** @type {number} */
        var artistTrack = 60 * margin;
        if (16 === mm_login && color) {
          /** @type {string} */
          var currentSentence = "";
          if (0 !== _jsons || _content) {
            if (_content && now - lastFPSTime < 5E3) {
              currentSentence = _0x3001("0x12f");
            } else {
              if (!_content) {
                /** @type {string} */
                currentSentence = "Battle starting in: " + isValid(~~((1E3 * _jsons - (1E3 * seed + (now - prev))) / 1E3));
              }
            }
          } else {
            currentSentence = _0x3001("0x130");
          }
          if ("" !== currentSentence) {
            /** @type {number} */
            style[_0x3001("0x52")] = .4;
            style[_0x3001("0x53")] = _0x3001("0xd");
            style[_0x3001("0x54")](width / 2 - desiredWidth / 2, 100 * margin, desiredWidth, artistTrack);
            /** @type {number} */
            style[_0x3001("0x52")] = 1;
            /** @type {string} */
            style[_0x3001("0x53")] = "#FFFFFF";
            /** @type {string} */
            style["font"] = 28 * margin + "px Ubuntu";
            style["fillText"](currentSentence, width / 2 - style[_0x3001("0x58")](currentSentence)[_0x3001("0x50")] / 2, 140 * margin);
          }
        }
        if (isLoginStateWithSession) {
          if ((_0x487c5e = _0x487c5e + 1) > 300) {
            /** @type {boolean} */
            isLoginStateWithSession = false;
            /** @type {number} */
            _0x487c5e = -1;
          }
        } else {
          if (item < 20) {
            if (0 === _0x487c5e && (_0x411dbd = _0x411dbd + 1) > 100) {
              /** @type {boolean} */
              isLoginStateWithSession = true;
            }
          } else {
            /** @type {number} */
            _0x411dbd = 0;
          }
        }
        /** @type {number} */
        var cropLen = 800 * margin;
        /** @type {number} */
        var bottomRightRadius = 60 * margin;
        if (!_0x1614f3) {
          if ((isLoginStateWithSession || 16 === mm_login && dotJoin >= 0 && dotJoin <= 2) && (style[_0x3001("0x52")] = .4, style[_0x3001("0x53")] = "#000000", style["fillRect"](width / 2 - cropLen / 2, height - 15 * margin - bottomRightRadius, cropLen, bottomRightRadius), style[_0x3001("0x52")] = 1), 16 !== mm_login || isLoginStateWithSession) {
            if (isLoginStateWithSession) {
              style["fillStyle"] = _0x3001("0x59");
              var $element = _0x3001("0x131");
              style["font"] = 18 * margin + _0x3001("0x70");
              style[_0x3001("0x57")]($element, width / 2 - style[_0x3001("0x58")]($element)["width"] / 2, height - 51 * margin);
              var node = _0x3001("0x132");
              style[_0x3001("0x57")](node, width / 2 - style[_0x3001("0x58")](node)[_0x3001("0x50")] / 2, height - 26 * margin);
            }
          } else {
            /** @type {number} */
            i = 0;
            for (; i < data[_0x3001("0x15")]; i = i + 1) {
              if (data[i][_0x3001("0x75")]) {
                data = data["slice"](0, i);
                break;
              }
              data[i][_0x3001("0x122")](i);
            }
            if (0 === dotJoin) {
              var node = _0x3001("0x133");
              style[_0x3001("0x53")] = _0x3001("0x59");
              style[_0x3001("0x55")] = 28 * margin + _0x3001("0x70");
              style[_0x3001("0x57")](node, width / 2 - style[_0x3001("0x58")](node)[_0x3001("0x50")] / 2, height - 35 * margin);
            } else {
              if (1 === dotJoin) {
                /** @type {number} */
                var startPos = ~~((1E3 * _0x1e4495 - (1E3 * seed + (now - prev))) / 1E3);
                var node = isValid(startPos);
                /** @type {string} */
                style[_0x3001("0x53")] = "#FFFFFF";
                style["font"] = 28 * margin + _0x3001("0x70");
                var dims_labels = style[_0x3001("0x58")](_0x3001("0x134"));
                var args = style["measureText"](node);
                style["fillText"](_0x3001("0x134"), width / 2 - (dims_labels[_0x3001("0x50")] / 2 + args[_0x3001("0x50")] / 2), height - 35 * margin);
                style["fillStyle"] = startPos <= 10 ? "#FF0000" : _0x3001("0x59");
                style[_0x3001("0x57")](node, width / 2 - dims_labels[_0x3001("0x50")] / 2 + dims_labels["width"] - args["width"] / 2, height - 35 * margin);
              } else {
                if (2 === dotJoin) {
                  /** @type {string} */
                  style[_0x3001("0x53")] = "#FF0000";
                  /** @type {string} */
                  style["font"] = 28 * margin + "px Ubuntu";
                  style[_0x3001("0x57")](_0x3001("0x135"), width / 2 - style[_0x3001("0x58")](_0x3001("0x135"))[_0x3001("0x50")] / 2, height - 35 * margin);
                }
              }
            }
          }
        }
        (function() {
          var _0x12564e;
          var has_next;
          var k;
          /** @type {number} */
          var v = 0;
          /** @type {number} */
          var s = 0;
          /** @type {number} */
          var x = 0;
          /** @type {number} */
          var w = 0;
          /** @type {number} */
          var r = 0;
          /** @type {number} */
          var h = 0;
          /** @type {number} */
          var l = 0;
          /** @type {number} */
          w = left - m;
          /** @type {number} */
          x = u - max;
          /** @type {number} */
          w = w / (r = 0 != (r = window[_0x3001("0x14")][_0x3001("0x136")](w * w + x * x)) ? r : 1);
          /** @type {number} */
          r = x / r;
          x = index;
          s = window[_0x3001("0x14")][_0x3001("0x137")](x);
          x = window["Math"]["sin"](x);
          /** @type {boolean} */
          var isDue = 2147483647 != u;
          if (2147483647 != left) {
            /** @type {number} */
            v = true & isDue;
            if (isDue) {
              s = s + .05 * (w - s);
              x = x + .05 * (r - x);
              index = window["Math"][_0x3001("0x138")](x, s);
              if (validationVM) {
                /** @type {number} */
                w = .4;
                /** @type {boolean} */
                isDue = true;
              } else {
                index = window[_0x3001("0x14")][_0x3001("0x138")](r, w);
                /** @type {number} */
                s = w;
                /** @type {number} */
                x = r;
                /** @type {number} */
                w = .4;
                /** @type {boolean} */
                isDue = true;
              }
            } else {
              /** @type {number} */
              w = 0;
              /** @type {boolean} */
              isDue = false;
            }
          } else {
            /** @type {number} */
            w = 0;
            /** @type {number} */
            v = 0;
            /** @type {boolean} */
            isDue = false;
          }
          /** @type {number} */
          validationVM = v;
          r = i;
          i = r = r + .1 * (w - r);
          /** @type {number} */
          l = ~~(50 * ((k = (h = height) / 1080) < (l = (w = width) / 1920) ? k : l));
          /** @type {number} */
          w = w * .5;
          /** @type {number} */
          h = h * .5;
          /** @type {number} */
          r = isDue ? r / .4 : 1;
          style[_0x3001("0x79")]();
          style[_0x3001("0x52")] = i;
          style[_0x3001("0x53")] = _0x3001("0x139");
          style["translate"](w + r * (s * (w - l)), h + r * (x * (h - l)));
          style[_0x3001("0x13a")](index);
          if (!_0x318b20) {
            /** @type {boolean} */
            _0x318b20 = true;
            /** @type {number} */
            dh = ~~(24 * ((size = height / 1080) < (n = width / 1920) ? size : n));
            /** @type {number} */
            start = 1;
          }
          if (null === button) {
            button = new SVGPlotFunction(24, _0x3001("0xd"), true, _0x3001("0x59"));
          }
          button["setValue"](hover);
          button[_0x3001("0x7a")](margin);
          style[_0x3001("0x79")]();
          if (has_next = index < 0) {
            style[_0x3001("0x13a")](1.5707963267948966);
          } else {
            style[_0x3001("0x13a")](4.71238898038469);
          }
          /** @type {number} */
          w = (h = height / 1080) < (w = width / 1920) ? h : w;
          /** @type {number} */
          h = dh;
          var node = button[_0x3001("0x7b")]();
          /** @type {number} */
          series = s = (s = ~~(200 * w) / (~~((x = start) * (l = 2 * (r = .2 * h * 2))) / series)) > 1 ? 1 : s;
          if (x == s) {
            /** @type {number} */
            s = x;
          } else {
            /** @type {number} */
            start = s;
          }
          /** @type {number} */
          _0x12564e = ~~(48 * w);
          /** @type {number} */
          v = ~~(.4 * h);
          if (node[_0x3001("0x50")] > 0 && node[_0x3001("0x51")] > 0) {
            if (has_next) {
              style[_0x3001("0x6b")](node, -node[_0x3001("0x50")] / 2, _0x12564e - ~~(s * (h + v)) / 2);
            } else {
              style["drawImage"](node, -node[_0x3001("0x50")] / 2, 0 - _0x12564e - ~~(s * (h + v)) / 2);
            }
          }
          style[_0x3001("0xa9")]();
          var n;
          var size;
          /** @type {number} */
          var name = ~~(50 * ((size = height / 1080) < (n = width / 1920) ? size : n));
          style[_0x3001("0x60")](name, name);
          style[_0x3001("0xc5")] = _0x3001("0x89");
          style[_0x3001("0xa2")] = _0x3001("0x89");
          style[_0x3001("0x73")] = _0x3001("0x13b");
          /** @type {number} */
          style[_0x3001("0x72")] = .15;
          style["beginPath"]();
          style[_0x3001("0x5b")](-.4999999999999998, .8660254037844387);
          style[_0x3001("0xc7")](-.5000000000000004, -.8660254037844384);
          style[_0x3001("0xc7")](1, 0);
          style["lineTo"](-.4999999999999998, .8660254037844387);
          style[_0x3001("0x52")] = i;
          style[_0x3001("0x5d")]();
          style[_0x3001("0x3f")]();
          style[_0x3001("0xa9")]();
        })();
        for (; set[_0x3001("0x15")] > 0 && set[0] <= time - 1E3;) {
          set["shift"]();
        }
        item = set["length"];
        if (now - lastTermChange > 400) {
          lastTermChange = now;
          if ((group = item) > STRING) {
            /** @type {number} */
            group = STRING;
          }
        }
        set[_0x3001("0x84")](time);
      }
    });
  }
  (function processEvaluatorsCallback() {
    if (window["MC"] && window["MC"][_0x3001("0x13c")]) {
      window["MC"][_0x3001("0x13c")]();
    } else {
      window[_0x3001("0x7e")](processEvaluatorsCallback, 100);
    }
  })();
}(window);
