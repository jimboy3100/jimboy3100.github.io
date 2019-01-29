'use strict';
/** @type {!Array} */
var _0x2d1e = ["updatePartyToken", "data-party-state", "[Master] Connect to:", "wss://", "?party_id=", "recaptchaResponse", "#nick", "substring", "sendNick", "sendSpectate", "#party-token, .party-token", "joinParty", "hash", "#ffa", "#battleroyale", "#experimental", "history", "replaceState", "document", "title", "facebookLogin", "accessToken", "sendFbToken", "sendGplusToken", "data-itr", "html", "i18n", "change", "handleChangeMode", ".btn-play, .btn-play-guest", "click", "preventDefault", ".btn-spectate", 
"spectate", "#create-party-btn-2", "createParty", "#party-token", "toggleSocialLogin", "#socialLoginContainer", "toggle", "getRegionNames", "refreshRegionInfo", "checkHash", "checkRegion", "storeObjectInfo", "stringify", "logout", "signOut", "fbAsyncInit", "init", "fb_app_id", "v2.8", "getLoginStatus", "connected", "gapiAsyncInit", "getStorage", "gapi", "load", "auth2", "gplus_client_id", "single_host_origin", "https://www.googleapis.com/auth/plus.login email", "com.miniclip.agar.io", "getElementById", 
"gplusLogin", "attachClickHandler", "then", "JP-Tokyo", "EU-London", "SG-Singapore", "US-Atlanta", "BR-Brazil", "CN-China", "RU-Russia", "TK-Turkey", "facebook", "webbouncer-live-v6-0.agario.miniclippt.com", "context", "updateStorage", "login", "public_profile, email", "status", "authResponse", "doLoginWithFB", "data", "url", "userInfo", "picture", ".agario-profile-picture", "attr", "src", "#helloContainer", "data-logged-in", ".progress-bar-striped", "width", "100%", "facebookRelogin", "get", "loginIntent", 
"google", "isSignedIn", "getAuthResponse", "access_token", "getImageUrl", "doLoginWithGPlus", "master", ":ffa", "client_version", "client_version_string", "localStorage", "getItem", "ogarioClientVersionString", "clientVersionString", "clientVersion", "//agar.io/mc/agario.js", "match", "log", "[Master] Current client version:", "setClientVersion", "text", "GET", "[Master] Your client version:", "core", "setItem", "reconnect", "split", "location", "//gc.agar.io", "setRegionCode", "setRegion", "checkPartyHash", 
"region", "#region", "val", "#locationKnown", "append", "makeMasterSimpleRequest", "info", "parse", "hasOwnProperty", '#region option[value="', "regionNames", "numPlayers", "#region option", "each", "applyGameMode", "gameMode", "data-gamemode", ":party", "replaceHistoryState", "encodeURIComponent", "replace", "#gamemode", "setGameMode", "now", "findingServer", "disconnect", "setRequestMsg", "curValidFindServer", "makeMasterRequest", "endpoint_version", "endpoints", "0.0.0.0:0", "serverIP", "https", 
"token", "partyToken", "backoffPeriod", "connect", "findServer", "push", "length", "charCodeAt", "application/octet-stream", "ajax", "https://", "master_url", "setRequestHeader", "Accept", "text/plain", "*/*", "x-support-proto-version", "x-client-version", "json", "POST", "proto_version", "setPartyState", "indexOf", "/getToken", "endpoint"];
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
    var _0xf36dca = target["updateCookie"]();
    if (!_0xf36dca) {
      target["setCookie"](["*"], "counter", 1);
    } else {
      if (_0xf36dca) {
        array = target["getCookie"](null, "counter");
      } else {
        target["removeCookie"]();
      }
    }
  };
  build();
})(_0x2d1e, 257);
/**
 * @param {string} i
 * @param {?} parameter1
 * @return {?}
 */
var _0x5f4f = function(i, parameter1) {
  /** @type {number} */
  i = i - 0;
  var oembedView = _0x2d1e[i];
  return oembedView;
};
!function(window, gm) {
  /**
   * @param {?} workTypes
   * @return {?}
   */
  function areWorkTypesValid(workTypes) {
    if (null !== window["FB"]) {
      return o["loginIntent"] = "1", o[_0x5f4f("0xa")] = _0x5f4f("0x8"), window[_0x5f4f("0xb")](), window["FB"][_0x5f4f("0xc")](function(urlId) {
        getUrlDoc(urlId);
      }, {
        "scope" : _0x5f4f("0xd")
      }), true;
    }
    alert("You seem to have something blocking Facebook on your browser, please check for any extensions");
  }
  /**
   * @param {?} urlId
   * @return {undefined}
   */
  function getUrlDoc(urlId) {
    if ("connected" === urlId[_0x5f4f("0xe")]) {
      var accessToken = urlId[_0x5f4f("0xf")]["accessToken"];
      if (accessToken) {
        master[_0x5f4f("0x10")](accessToken);
        window["FB"]["api"]("/me/picture?width=180&height=180", function(article) {
          if (article[_0x5f4f("0x11")] && article[_0x5f4f("0x11")][_0x5f4f("0x12")]) {
            o[_0x5f4f("0x13")][_0x5f4f("0x14")] = article["data"]["url"];
            gm(_0x5f4f("0x15"))[_0x5f4f("0x16")](_0x5f4f("0x17"), article["data"][_0x5f4f("0x12")]);
            window["updateStorage"]();
          }
        });
        gm(_0x5f4f("0x18"))["attr"](_0x5f4f("0x19"), "1");
        gm(_0x5f4f("0x1a"))[_0x5f4f("0x1b")](_0x5f4f("0x1c"));
      } else {
        if (_0x136f53 < 3) {
          _0x136f53++;
          window[_0x5f4f("0x1d")]();
          window["logout"]();
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function init() {
    update["currentUser"][_0x5f4f("0x1e")]();
    if ("1" === o[_0x5f4f("0x1f")] && _0x5f4f("0x20") === o[_0x5f4f("0xa")] && !update[_0x5f4f("0x21")]["get"]()) {
      update["signIn"]();
    }
  }
  /**
   * @param {!Object} el
   * @return {undefined}
   */
  function render(el) {
    if (el && update && "1" === o[_0x5f4f("0x1f")] && "google" === o["context"] && update["isSignedIn"][_0x5f4f("0x1e")]()) {
      var rangechange = el[_0x5f4f("0x22")]()[_0x5f4f("0x23")];
      var artistTrack = el["getBasicProfile"]()[_0x5f4f("0x24")]();
      master[_0x5f4f("0x25")](rangechange);
      if (artistTrack) {
        o["userInfo"]["picture"] = artistTrack;
        window[_0x5f4f("0xb")]();
        gm(_0x5f4f("0x15"))[_0x5f4f("0x16")](_0x5f4f("0x17"), artistTrack);
      }
      gm("#helloContainer")[_0x5f4f("0x16")](_0x5f4f("0x19"), "1");
      gm(_0x5f4f("0x1a"))[_0x5f4f("0x1b")](_0x5f4f("0x1c"));
    }
  }
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
      var _0x40ff0b = ~-4 >> 1 + 255 % 0;
      if (func["indexOf"]((!![] + "")[3]) !== _0x40ff0b) {
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
  var obj = {
    "AF" : _0x5f4f("0x0"),
    "AX" : _0x5f4f("0x1"),
    "AL" : _0x5f4f("0x1"),
    "DZ" : _0x5f4f("0x1"),
    "AS" : _0x5f4f("0x2"),
    "AD" : _0x5f4f("0x1"),
    "AO" : _0x5f4f("0x1"),
    "AI" : _0x5f4f("0x3"),
    "AG" : "US-Atlanta",
    "AR" : _0x5f4f("0x4"),
    "AM" : "JP-Tokyo",
    "AW" : "US-Atlanta",
    "AU" : _0x5f4f("0x2"),
    "AT" : _0x5f4f("0x1"),
    "AZ" : _0x5f4f("0x0"),
    "BS" : "US-Atlanta",
    "BH" : _0x5f4f("0x0"),
    "BD" : _0x5f4f("0x0"),
    "BB" : _0x5f4f("0x3"),
    "BY" : _0x5f4f("0x1"),
    "BE" : _0x5f4f("0x1"),
    "BZ" : _0x5f4f("0x3"),
    "BJ" : _0x5f4f("0x1"),
    "BM" : _0x5f4f("0x3"),
    "BT" : _0x5f4f("0x0"),
    "BO" : _0x5f4f("0x4"),
    "BQ" : _0x5f4f("0x3"),
    "BA" : _0x5f4f("0x1"),
    "BW" : _0x5f4f("0x1"),
    "BR" : _0x5f4f("0x4"),
    "IO" : _0x5f4f("0x0"),
    "VG" : _0x5f4f("0x3"),
    "BN" : _0x5f4f("0x0"),
    "BG" : _0x5f4f("0x1"),
    "BF" : "EU-London",
    "BI" : "EU-London",
    "KH" : "JP-Tokyo",
    "CM" : _0x5f4f("0x1"),
    "CA" : "US-Atlanta",
    "CV" : _0x5f4f("0x1"),
    "KY" : "US-Atlanta",
    "CF" : _0x5f4f("0x1"),
    "TD" : _0x5f4f("0x1"),
    "CL" : _0x5f4f("0x4"),
    "CN" : _0x5f4f("0x5"),
    "CX" : _0x5f4f("0x0"),
    "CC" : _0x5f4f("0x0"),
    "CO" : "BR-Brazil",
    "KM" : _0x5f4f("0x1"),
    "CD" : _0x5f4f("0x1"),
    "CG" : "EU-London",
    "CK" : _0x5f4f("0x2"),
    "CR" : _0x5f4f("0x3"),
    "CI" : _0x5f4f("0x1"),
    "HR" : _0x5f4f("0x1"),
    "CU" : _0x5f4f("0x3"),
    "CW" : _0x5f4f("0x3"),
    "CY" : _0x5f4f("0x0"),
    "CZ" : _0x5f4f("0x1"),
    "DK" : _0x5f4f("0x1"),
    "DJ" : _0x5f4f("0x1"),
    "DM" : _0x5f4f("0x3"),
    "DO" : "US-Atlanta",
    "EC" : "BR-Brazil",
    "EG" : _0x5f4f("0x1"),
    "SV" : _0x5f4f("0x3"),
    "GQ" : _0x5f4f("0x1"),
    "ER" : "EU-London",
    "EE" : _0x5f4f("0x1"),
    "ET" : _0x5f4f("0x1"),
    "FO" : _0x5f4f("0x1"),
    "FK" : _0x5f4f("0x4"),
    "FJ" : _0x5f4f("0x2"),
    "FI" : _0x5f4f("0x1"),
    "FR" : "EU-London",
    "GF" : _0x5f4f("0x4"),
    "PF" : _0x5f4f("0x2"),
    "GA" : _0x5f4f("0x1"),
    "GM" : _0x5f4f("0x1"),
    "GE" : _0x5f4f("0x0"),
    "DE" : _0x5f4f("0x1"),
    "GH" : "EU-London",
    "GI" : _0x5f4f("0x1"),
    "GR" : "EU-London",
    "GL" : _0x5f4f("0x3"),
    "GD" : _0x5f4f("0x3"),
    "GP" : _0x5f4f("0x3"),
    "GU" : _0x5f4f("0x2"),
    "GT" : "US-Atlanta",
    "GG" : "EU-London",
    "GN" : "EU-London",
    "GW" : _0x5f4f("0x1"),
    "GY" : _0x5f4f("0x4"),
    "HT" : _0x5f4f("0x3"),
    "VA" : _0x5f4f("0x1"),
    "HN" : "US-Atlanta",
    "HK" : "JP-Tokyo",
    "HU" : _0x5f4f("0x1"),
    "IS" : _0x5f4f("0x1"),
    "IN" : _0x5f4f("0x0"),
    "ID" : _0x5f4f("0x0"),
    "IR" : _0x5f4f("0x0"),
    "IQ" : _0x5f4f("0x0"),
    "IE" : _0x5f4f("0x1"),
    "IM" : _0x5f4f("0x1"),
    "IL" : _0x5f4f("0x0"),
    "IT" : _0x5f4f("0x1"),
    "JM" : _0x5f4f("0x3"),
    "JP" : _0x5f4f("0x0"),
    "JE" : _0x5f4f("0x1"),
    "JO" : _0x5f4f("0x0"),
    "KZ" : _0x5f4f("0x0"),
    "KE" : _0x5f4f("0x1"),
    "KI" : _0x5f4f("0x2"),
    "KP" : _0x5f4f("0x0"),
    "KR" : _0x5f4f("0x0"),
    "KW" : _0x5f4f("0x0"),
    "KG" : "JP-Tokyo",
    "LA" : "JP-Tokyo",
    "LV" : "EU-London",
    "LB" : _0x5f4f("0x0"),
    "LS" : "EU-London",
    "LR" : _0x5f4f("0x1"),
    "LY" : _0x5f4f("0x1"),
    "LI" : "EU-London",
    "LT" : _0x5f4f("0x1"),
    "LU" : _0x5f4f("0x1"),
    "MO" : "JP-Tokyo",
    "MK" : "EU-London",
    "MG" : _0x5f4f("0x1"),
    "MW" : _0x5f4f("0x1"),
    "MY" : "JP-Tokyo",
    "MV" : _0x5f4f("0x0"),
    "ML" : _0x5f4f("0x1"),
    "MT" : _0x5f4f("0x1"),
    "MH" : "SG-Singapore",
    "MQ" : _0x5f4f("0x3"),
    "MR" : _0x5f4f("0x1"),
    "MU" : _0x5f4f("0x1"),
    "YT" : _0x5f4f("0x1"),
    "MX" : _0x5f4f("0x3"),
    "FM" : _0x5f4f("0x2"),
    "MD" : "EU-London",
    "MC" : _0x5f4f("0x1"),
    "MN" : "JP-Tokyo",
    "ME" : "EU-London",
    "MS" : _0x5f4f("0x3"),
    "MA" : _0x5f4f("0x1"),
    "MZ" : _0x5f4f("0x1"),
    "MM" : _0x5f4f("0x0"),
    "NA" : _0x5f4f("0x1"),
    "NR" : "SG-Singapore",
    "NP" : _0x5f4f("0x0"),
    "NL" : _0x5f4f("0x1"),
    "NC" : "SG-Singapore",
    "NZ" : _0x5f4f("0x2"),
    "NI" : _0x5f4f("0x3"),
    "NE" : _0x5f4f("0x1"),
    "NG" : "EU-London",
    "NU" : "SG-Singapore",
    "NF" : _0x5f4f("0x2"),
    "MP" : _0x5f4f("0x2"),
    "NO" : _0x5f4f("0x1"),
    "OM" : _0x5f4f("0x0"),
    "PK" : _0x5f4f("0x0"),
    "PW" : _0x5f4f("0x2"),
    "PS" : _0x5f4f("0x0"),
    "PA" : _0x5f4f("0x3"),
    "PG" : _0x5f4f("0x2"),
    "PY" : _0x5f4f("0x4"),
    "PE" : _0x5f4f("0x4"),
    "PH" : _0x5f4f("0x0"),
    "PN" : _0x5f4f("0x2"),
    "PL" : _0x5f4f("0x1"),
    "PT" : _0x5f4f("0x1"),
    "PR" : _0x5f4f("0x3"),
    "QA" : _0x5f4f("0x0"),
    "RE" : _0x5f4f("0x1"),
    "RO" : _0x5f4f("0x1"),
    "RU" : _0x5f4f("0x6"),
    "RW" : _0x5f4f("0x1"),
    "BL" : _0x5f4f("0x3"),
    "SH" : _0x5f4f("0x1"),
    "KN" : "US-Atlanta",
    "LC" : "US-Atlanta",
    "MF" : "US-Atlanta",
    "PM" : _0x5f4f("0x3"),
    "VC" : _0x5f4f("0x3"),
    "WS" : "SG-Singapore",
    "SM" : "EU-London",
    "ST" : _0x5f4f("0x1"),
    "SA" : _0x5f4f("0x1"),
    "SN" : _0x5f4f("0x1"),
    "RS" : _0x5f4f("0x1"),
    "SC" : _0x5f4f("0x1"),
    "SL" : _0x5f4f("0x1"),
    "SG" : _0x5f4f("0x0"),
    "SX" : "US-Atlanta",
    "SK" : _0x5f4f("0x1"),
    "SI" : _0x5f4f("0x1"),
    "SB" : _0x5f4f("0x2"),
    "SO" : _0x5f4f("0x1"),
    "ZA" : "EU-London",
    "SS" : _0x5f4f("0x1"),
    "ES" : _0x5f4f("0x1"),
    "LK" : "JP-Tokyo",
    "SD" : _0x5f4f("0x1"),
    "SR" : _0x5f4f("0x4"),
    "SJ" : "EU-London",
    "SZ" : _0x5f4f("0x1"),
    "SE" : _0x5f4f("0x1"),
    "CH" : _0x5f4f("0x1"),
    "SY" : _0x5f4f("0x1"),
    "TW" : _0x5f4f("0x0"),
    "TJ" : _0x5f4f("0x0"),
    "TZ" : _0x5f4f("0x1"),
    "TH" : _0x5f4f("0x0"),
    "TL" : "JP-Tokyo",
    "TG" : _0x5f4f("0x1"),
    "TK" : "SG-Singapore",
    "TO" : _0x5f4f("0x2"),
    "TT" : _0x5f4f("0x3"),
    "TN" : _0x5f4f("0x1"),
    "TR" : _0x5f4f("0x7"),
    "TM" : _0x5f4f("0x0"),
    "TC" : _0x5f4f("0x3"),
    "TV" : "SG-Singapore",
    "UG" : _0x5f4f("0x1"),
    "UA" : _0x5f4f("0x1"),
    "AE" : _0x5f4f("0x1"),
    "GB" : _0x5f4f("0x1"),
    "US" : _0x5f4f("0x3"),
    "UM" : _0x5f4f("0x2"),
    "VI" : _0x5f4f("0x3"),
    "UY" : _0x5f4f("0x4"),
    "UZ" : "JP-Tokyo",
    "VU" : _0x5f4f("0x2"),
    "VE" : _0x5f4f("0x4"),
    "VN" : _0x5f4f("0x0"),
    "WF" : _0x5f4f("0x2"),
    "EH" : _0x5f4f("0x1"),
    "YE" : _0x5f4f("0x0"),
    "ZM" : _0x5f4f("0x1"),
    "ZW" : _0x5f4f("0x1")
  };
  var o = {
    "context" : null,
    "defaultProvider" : _0x5f4f("0x8"),
    "loginIntent" : "0",
    "userInfo" : {
      "socialToken" : null,
      "tokenExpires" : "",
      "level" : "",
      "xp" : "",
      "xpNeeded" : "",
      "name" : "",
      "picture" : "",
      "displayName" : "",
      "loggedIn" : "0",
      "socialId" : ""
    }
  };
  var headers = {
    "fb_app_id" : 677505792353827,
    "gplus_client_id" : "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
    "master_url" : _0x5f4f("0x9"),
    "endpoint_version" : "v4",
    "proto_version" : "12.0.1",
    "client_version" : 30400,
    "client_version_string" : "3.4.0"
  };
  /** @type {number} */
  var _0x136f53 = 0;
  /** @type {null} */
  var update = null;
  window[_0x5f4f("0x26")] = {
    "ws" : null,
    "serverIP" : null,
    "endpoint" : null,
    "region" : "",
    "gameMode" : _0x5f4f("0x27"),
    "partyToken" : "",
    "findingServer" : 0,
    "curValidFindServer" : 0,
    "backoffPeriod" : 500,
    "regionNames" : {},
    "context" : "",
    "accessToken" : null,
    "clientVersion" : headers[_0x5f4f("0x28")],
    "clientVersionString" : headers[_0x5f4f("0x29")],
    "getClientVersion" : function() {
      if (null !== window[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x2c"))) {
        this[_0x5f4f("0x2d")] = window[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x2c"));
        this[_0x5f4f("0x2e")] = this["parseClientVersion"](this[_0x5f4f("0x2d")]);
      }
      var queue = this;
      gm["ajax"](_0x5f4f("0x2f"), {
        "error" : function() {
        },
        "success" : function(retu_data) {
          var object = retu_data[_0x5f4f("0x30")](/versionString="(\d+\.\d+\.\d+)"/);
          if (object) {
            var result = object[1];
            var data = queue["parseClientVersion"](result);
            console[_0x5f4f("0x31")](_0x5f4f("0x32"), data, result);
            queue[_0x5f4f("0x33")](data, result);
          }
        },
        "dataType" : _0x5f4f("0x34"),
        "method" : _0x5f4f("0x35"),
        "cache" : false,
        "crossDomain" : true
      });
    },
    "setClientVersion" : function(clientVersion, serverVersion) {
      console[_0x5f4f("0x31")](_0x5f4f("0x36"), this[_0x5f4f("0x2e")], this["clientVersionString"]);
      if (this[_0x5f4f("0x2e")] != clientVersion) {
        console["log"]("[Master] Changing client version...");
        this[_0x5f4f("0x2e")] = clientVersion;
        this[_0x5f4f("0x2d")] = serverVersion;
        if (window[_0x5f4f("0x37")]) {
          window["core"][_0x5f4f("0x33")](clientVersion, serverVersion);
        }
        window[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0x2c"), serverVersion);
        this[_0x5f4f("0x39")](true);
      }
    },
    "parseClientVersion" : function(canCreateDiscussions) {
      return 1E4 * parseInt(canCreateDiscussions[_0x5f4f("0x3a")](".")[0]) + 100 * parseInt(canCreateDiscussions[_0x5f4f("0x3a")](".")[1]) + parseInt(canCreateDiscussions[_0x5f4f("0x3a")](".")[2]);
    },
    "getRegionCode" : function() {
      var artistTrack = window[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x3b"));
      if (artistTrack) {
        return this["setRegion"](artistTrack, false), void(this["checkPartyHash"]() || this["reconnect"]());
      }
      var command_codes = this;
      gm[_0x5f4f("0x1e")](_0x5f4f("0x3c"), function(canCreateDiscussions) {
        var data = canCreateDiscussions[_0x5f4f("0x3a")](" ")[0];
        command_codes[_0x5f4f("0x3d")](data);
      }, _0x5f4f("0x34"));
    },
    "setRegionCode" : function(key) {
      if (obj["hasOwnProperty"](key)) {
        this[_0x5f4f("0x3e")](obj[key], false);
        if (!this[_0x5f4f("0x3f")]()) {
          this[_0x5f4f("0x39")]();
        }
      }
    },
    "setRegion" : function(left, height) {
      if (null == height) {
        /** @type {boolean} */
        height = true;
      }
      if (left) {
        this[_0x5f4f("0x40")] = left;
        window[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0x3b"), left);
        if (gm(_0x5f4f("0x41"))["val"]() !== left) {
          gm(_0x5f4f("0x41"))["val"](left);
        }
        if (height) {
          this[_0x5f4f("0x39")]();
        }
      }
    },
    "checkRegion" : function() {
      var style = gm(_0x5f4f("0x41"));
      var artistTrack = style["val"]();
      if (artistTrack) {
        window[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0x3b"), artistTrack);
      } else {
        if (artistTrack = window[_0x5f4f("0x2a")][_0x5f4f("0x2b")](_0x5f4f("0x3b"))) {
          $(_0x5f4f("0x41"))[_0x5f4f("0x42")](artistTrack);
        }
      }
      if (style["val"]()) {
        gm(_0x5f4f("0x43"))["append"](style);
      } else {
        gm("#locationUnknown")[_0x5f4f("0x44")](style);
      }
    },
    "refreshRegionInfo" : function() {
      var packagesPromises = this;
      this[_0x5f4f("0x45")](_0x5f4f("0x46"), _0x5f4f("0x34"), function(data) {
        var cobra_reactions = (data = JSON[_0x5f4f("0x47")](data))["regions"];
        var bigg_id;
        for (bigg_id in cobra_reactions) {
          if (cobra_reactions[_0x5f4f("0x48")](bigg_id)) {
            gm(_0x5f4f("0x49") + bigg_id + '"]')[_0x5f4f("0x34")](packagesPromises[_0x5f4f("0x4a")][bigg_id] + " (" + cobra_reactions[bigg_id][_0x5f4f("0x4b")] + ")");
          }
        }
      });
    },
    "getRegionNames" : function() {
      var packagesPromises = this;
      gm(_0x5f4f("0x4c"))[_0x5f4f("0x4d")](function() {
        var packageId = gm(this)[_0x5f4f("0x42")]();
        var uninstalling = gm(this)[_0x5f4f("0x34")]();
        if (!packagesPromises["regionNames"][_0x5f4f("0x48")](packageId)) {
          packagesPromises[_0x5f4f("0x4a")][packageId] = uninstalling;
        }
      });
    },
    "setGameMode" : function(val, opt_validate) {
      if (null == opt_validate) {
        /** @type {boolean} */
        opt_validate = true;
      }
      this[_0x5f4f("0x4e")](val);
      this[_0x5f4f("0x4f")] = val;
      if (opt_validate) {
        this[_0x5f4f("0x39")]();
      }
    },
    "applyGameMode" : function(placement) {
      gm("#helloContainer, #overlays-hud")[_0x5f4f("0x16")](_0x5f4f("0x50"), placement);
      gm("#gamemode")[_0x5f4f("0x42")](placement);
      if (_0x5f4f("0x51") !== placement) {
        this[_0x5f4f("0x52")]("/#" + window[_0x5f4f("0x53")](placement[_0x5f4f("0x54")](":", "")));
      }
    },
    "handleChangeMode" : function() {
      var artistTrack = gm(_0x5f4f("0x55"))[_0x5f4f("0x42")]();
      this[_0x5f4f("0x56")](artistTrack);
    },
    "findServer" : function(id, cb) {
      var _0xbb82b = Date[_0x5f4f("0x57")]();
      if (!(_0xbb82b - this[_0x5f4f("0x58")] < 500)) {
        if (window[_0x5f4f("0x37")]) {
          window[_0x5f4f("0x37")][_0x5f4f("0x59")]();
        }
        /** @type {string} */
        var picKey = "findServer";
        if (null == id) {
          /** @type {string} */
          id = "";
        }
        if (null == cb) {
          cb = _0x5f4f("0x27");
        } else {
          if (":battleroyale" === cb) {
            /** @type {string} */
            picKey = "findBattleRoyaleServer";
          }
        }
        var self = this;
        var query = this[_0x5f4f("0x5a")](id, cb);
        /** @type {number} */
        var klass = ++this[_0x5f4f("0x5b")];
        this["findingServer"] = _0xbb82b;
        this[_0x5f4f("0x5c")](headers[_0x5f4f("0x5d")] + "/" + picKey, query, function(data) {
          if (klass == self[_0x5f4f("0x5b")]) {
            var headers = data[_0x5f4f("0x5e")];
            if (null !== headers && _0x5f4f("0x5f") !== headers["https"]) {
              self[_0x5f4f("0x60")] = headers[_0x5f4f("0x61")];
              if (null !== data[_0x5f4f("0x62")]) {
                self[_0x5f4f("0x63")] = data[_0x5f4f("0x62")];
              }
              /** @type {number} */
              self[_0x5f4f("0x64")] = 500;
              self[_0x5f4f("0x65")](self[_0x5f4f("0x60")]);
            } else {
              self[_0x5f4f("0x66")](id, cb);
            }
          }
        }, function() {
          self[_0x5f4f("0x64")] *= 2;
          setTimeout(function() {
            self[_0x5f4f("0x66")](id, cb);
          }, self[_0x5f4f("0x64")]);
        });
      }
    },
    "setRequestMsg" : function(proto, value, code) {
      /**
       * @param {!Object} name
       * @return {undefined}
       */
      var removeElementClass = function(name) {
        webfs[_0x5f4f("0x67")](name[_0x5f4f("0x68")]);
        /** @type {number} */
        var path = 0;
        for (; path < name[_0x5f4f("0x68")]; path++) {
          webfs[_0x5f4f("0x67")](name[_0x5f4f("0x69")](path));
        }
      };
      /** @type {!Array} */
      var webfs = [10, 4 + proto["length"] + value[_0x5f4f("0x68")], 10];
      return removeElementClass(proto), webfs[_0x5f4f("0x67")](18), removeElementClass(value), code && (webfs[_0x5f4f("0x67")](26, 8, 10), removeElementClass(code)), new Uint8Array(webfs);
    },
    "makeMasterRequest" : function(regexMask, opts, sucFn, renderTerminator, url) {
      var header = this;
      if (null == url) {
        url = _0x5f4f("0x6a");
      }
      gm[_0x5f4f("0x6b")](_0x5f4f("0x6c") + headers[_0x5f4f("0x6d")] + "/" + regexMask, {
        "beforeSend" : function(xhr) {
          return xhr[_0x5f4f("0x6e")](_0x5f4f("0x6f"), _0x5f4f("0x70")), xhr[_0x5f4f("0x6e")](_0x5f4f("0x6f"), _0x5f4f("0x71")), xhr[_0x5f4f("0x6e")](_0x5f4f("0x6f"), "q=0.01"), xhr[_0x5f4f("0x6e")]("Content-Type", url), xhr[_0x5f4f("0x6e")](_0x5f4f("0x72"), headers["proto_version"]), xhr[_0x5f4f("0x6e")](_0x5f4f("0x73"), header[_0x5f4f("0x2e")]), true;
        },
        "error" : function() {
          if (renderTerminator) {
            renderTerminator();
          }
        },
        "success" : function(res) {
          sucFn(res);
        },
        "dataType" : _0x5f4f("0x74"),
        "method" : _0x5f4f("0x75"),
        "data" : opts,
        "processData" : false,
        "cache" : false,
        "crossDomain" : true
      });
    },
    "makeMasterSimpleRequest" : function(courseId, cmid, refresh, callback) {
      var header = this;
      gm[_0x5f4f("0x6b")](_0x5f4f("0x6c") + headers[_0x5f4f("0x6d")] + "/" + courseId, {
        "beforeSend" : function(xhr) {
          return xhr[_0x5f4f("0x6e")](_0x5f4f("0x72"), headers[_0x5f4f("0x76")]), xhr[_0x5f4f("0x6e")](_0x5f4f("0x73"), header[_0x5f4f("0x2e")]), true;
        },
        "error" : function() {
          if (callback) {
            callback();
          }
        },
        "success" : function(users) {
          refresh(users);
        },
        "dataType" : cmid,
        "method" : "GET",
        "cache" : false,
        "crossDomain" : true
      });
    },
    "createParty" : function() {
      this[_0x5f4f("0x77")]("3");
      this[_0x5f4f("0x56")](_0x5f4f("0x51"));
    },
    "joinParty" : function(code) {
      var _0x5397a0 = this;
      if (-1 != code[_0x5f4f("0x78")]("#")) {
        code = code["split"]("#")[1];
      }
      this[_0x5f4f("0x56")](_0x5f4f("0x51"), false);
      /** @type {!Object} */
      this["partyToken"] = code;
      this[_0x5f4f("0x52")]("/#" + window[_0x5f4f("0x53")](code));
      var pre = this[_0x5f4f("0x5a")](this["region"], "", code);
      this["makeMasterRequest"](headers[_0x5f4f("0x5d")] + _0x5f4f("0x79"), pre, function(moduleParams) {
        _0x5397a0[_0x5f4f("0x7a")] = moduleParams["endpoints"][_0x5f4f("0x61")];
        _0x5397a0[_0x5f4f("0x77")]("9");
      }, function() {
        _0x5397a0[_0x5f4f("0x77")]("6");
      });
    },
    "setPartyState" : function(mmCoreSplitViewBlock) {
      if ("9" === mmCoreSplitViewBlock) {
        this[_0x5f4f("0x7b")]();
        this[_0x5f4f("0x56")](_0x5f4f("0x51"), false);
        this["connect"](this[_0x5f4f("0x7a")]);
        /** @type {string} */
        mmCoreSplitViewBlock = "5";
      }
      gm(_0x5f4f("0x18"))[_0x5f4f("0x16")](_0x5f4f("0x7c"), mmCoreSplitViewBlock);
    },
    "connect" : function(b) {
      console[_0x5f4f("0x31")](_0x5f4f("0x7d"), b);
      this["ws"] = _0x5f4f("0x7e") + b;
      if (":party" === this[_0x5f4f("0x4f")] && this[_0x5f4f("0x63")]) {
        this["ws"] += _0x5f4f("0x7f") + window["encodeURIComponent"](this[_0x5f4f("0x63")]);
      }
      if (window["core"]) {
        window[_0x5f4f("0x37")][_0x5f4f("0x65")](this["ws"]);
      }
    },
    "reconnect" : function(sdkVersion) {
      if (this[_0x5f4f("0x40")]) {
        if (sdkVersion && this["serverIP"]) {
          this[_0x5f4f("0x65")](this[_0x5f4f("0x60")]);
        } else {
          this[_0x5f4f("0x66")](this[_0x5f4f("0x40")], this[_0x5f4f("0x4f")]);
        }
      }
    },
    "onConnect" : function() {
      if (_0x5f4f("0x51") === this[_0x5f4f("0x4f")]) {
        this[_0x5f4f("0x7b")]();
      }
    },
    "onDisconnect" : function() {
      this[_0x5f4f("0x39")]();
    },
    "recaptchaRequested" : function() {
      requestCaptcha(true);
    },
    "sendRecaptchaResponse" : function(mmCoreSplitViewBlock) {
      if (window[_0x5f4f("0x37")]) {
        window[_0x5f4f("0x37")][_0x5f4f("0x80")](mmCoreSplitViewBlock);
      }
    },
    "notifyToken" : function(mmCoreSplitViewBlock) {
      this["sendRecaptchaResponse"](mmCoreSplitViewBlock);
    },
    "setNick" : function() {
      this[_0x5f4f("0xc")]();
      var artistTrack = gm(_0x5f4f("0x81"))["val"]();
      if (artistTrack && artistTrack[_0x5f4f("0x68")] > 15) {
        artistTrack = artistTrack[_0x5f4f("0x82")](0, 15);
      }
      if (window[_0x5f4f("0x37")]) {
        window[_0x5f4f("0x37")][_0x5f4f("0x83")](artistTrack);
      }
    },
    "spectate" : function() {
      if (window[_0x5f4f("0x37")]) {
        window[_0x5f4f("0x37")][_0x5f4f("0x84")]();
      }
    },
    "updatePartyToken" : function() {
      gm(_0x5f4f("0x85"))[_0x5f4f("0x42")](this[_0x5f4f("0x63")]);
    },
    "checkHash" : function() {
      if (this["checkPartyHash"]()) {
        this[_0x5f4f("0x86")](window[_0x5f4f("0x3b")][_0x5f4f("0x87")]);
      } else {
        if (window[_0x5f4f("0x3b")][_0x5f4f("0x87")] && -1 != [_0x5f4f("0x88"), _0x5f4f("0x89"), "#teams", _0x5f4f("0x8a")][_0x5f4f("0x78")](window[_0x5f4f("0x3b")][_0x5f4f("0x87")])) {
          this[_0x5f4f("0x56")](window[_0x5f4f("0x3b")][_0x5f4f("0x87")][_0x5f4f("0x54")]("#", ":"));
        }
      }
    },
    "checkPartyHash" : function() {
      return window[_0x5f4f("0x3b")][_0x5f4f("0x87")] && 7 == window[_0x5f4f("0x3b")][_0x5f4f("0x87")][_0x5f4f("0x68")];
    },
    "replaceHistoryState" : function(name) {
      if (window[_0x5f4f("0x8b")] && window[_0x5f4f("0x8b")]["replaceState"]) {
        window[_0x5f4f("0x8b")][_0x5f4f("0x8c")]({}, window[_0x5f4f("0x8d")][_0x5f4f("0x8e")], name);
      }
    },
    "facebookLogin" : function() {
      window[_0x5f4f("0x8f")]();
    },
    "doLoginWithFB" : function(session) {
      this["context"] = _0x5f4f("0x8");
      this["accessToken"] = session;
    },
    "doLoginWithGPlus" : function(canCreateDiscussions) {
      /** @type {string} */
      this[_0x5f4f("0xa")] = "google";
      this[_0x5f4f("0x90")] = canCreateDiscussions;
    },
    "login" : function() {
      if (this[_0x5f4f("0x90")]) {
        if (_0x5f4f("0x8") === this["context"] && window[_0x5f4f("0x37")] && window[_0x5f4f("0x37")][_0x5f4f("0x91")]) {
          window[_0x5f4f("0x37")][_0x5f4f("0x91")](this[_0x5f4f("0x90")]);
        }
        if (_0x5f4f("0x20") === this["context"] && window[_0x5f4f("0x37")] && window[_0x5f4f("0x37")][_0x5f4f("0x92")]) {
          window[_0x5f4f("0x37")]["sendGplusToken"](this[_0x5f4f("0x90")]);
        }
      }
    },
    "logout" : function() {
      /** @type {null} */
      this[_0x5f4f("0x90")] = null;
      this[_0x5f4f("0x39")]();
    },
    "setUI" : function() {
      var object = this;
      gm("[data-itr]")[_0x5f4f("0x4d")](function() {
        var requireCompilers = gm(this);
        var code = requireCompilers[_0x5f4f("0x16")](_0x5f4f("0x93"));
        requireCompilers[_0x5f4f("0x94")](window[_0x5f4f("0x95")](code));
      });
      gm(_0x5f4f("0x55"))["on"](_0x5f4f("0x96"), function() {
        object[_0x5f4f("0x97")]();
      });
      gm(_0x5f4f("0x98"))["on"](_0x5f4f("0x99"), function(canCreateDiscussions) {
        canCreateDiscussions[_0x5f4f("0x9a")]();
        object["setNick"]();
      });
      gm(_0x5f4f("0x9b"))["on"](_0x5f4f("0x99"), function(canCreateDiscussions) {
        canCreateDiscussions[_0x5f4f("0x9a")]();
        object[_0x5f4f("0x9c")]();
      });
      gm(_0x5f4f("0x9d"))["on"](_0x5f4f("0x99"), function(result) {
        result["preventDefault"]();
        object[_0x5f4f("0x9e")]();
      });
      $("#join-party-btn-2")["on"](_0x5f4f("0x99"), function(canCreateDiscussions) {
        canCreateDiscussions[_0x5f4f("0x9a")]();
        object[_0x5f4f("0x86")](gm(_0x5f4f("0x9f"))[_0x5f4f("0x42")]());
      });
      /**
       * @return {undefined}
       */
      window[_0x5f4f("0xa0")] = function() {
        gm(_0x5f4f("0xa1"))[_0x5f4f("0xa2")]();
      };
    },
    "init" : function() {
      var _0x4939d9 = this;
      this["setUI"]();
      this[_0x5f4f("0xa3")]();
      this[_0x5f4f("0xa4")]();
      this[_0x5f4f("0xa5")]();
      this["getRegionCode"]();
      this[_0x5f4f("0xa6")]();
      setInterval(function() {
        _0x4939d9[_0x5f4f("0xa4")]();
      }, 18E4);
    }
  };
  /**
   * @return {undefined}
   */
  window["getStorage"] = function() {
    if (null !== window["localStorage"]["getItem"](_0x5f4f("0xa7"))) {
      o = JSON[_0x5f4f("0x47")](window[_0x5f4f("0x2a")]["getItem"]("storeObjectInfo"));
    }
  };
  /**
   * @return {undefined}
   */
  window[_0x5f4f("0xb")] = function() {
    window[_0x5f4f("0x2a")][_0x5f4f("0x38")](_0x5f4f("0xa7"), JSON[_0x5f4f("0xa8")](o));
  };
  /**
   * @return {undefined}
   */
  window[_0x5f4f("0xa9")] = function() {
    if (_0x5f4f("0x20") === o["context"] && update) {
      update[_0x5f4f("0xaa")]();
    }
    delete window["localStorage"][_0x5f4f("0xa7")];
    gm(_0x5f4f("0x18"))[_0x5f4f("0x16")](_0x5f4f("0x19"), "0");
    gm(_0x5f4f("0x1a"))[_0x5f4f("0x1b")]("0%");
    master[_0x5f4f("0xa9")]();
  };
  /**
   * @return {undefined}
   */
  window["facebookLogin"] = function() {
    alert("You seem to have something blocking Facebook on your browser, please check for any extensions");
  };
  /**
   * @return {undefined}
   */
  window[_0x5f4f("0xab")] = function() {
    window["FB"][_0x5f4f("0xac")]({
      "appId" : headers[_0x5f4f("0xad")],
      "cookie" : true,
      "xfbml" : true,
      "status" : true,
      "version" : _0x5f4f("0xae")
    });
    if (true) {
      window["getStorage"]();
      if ("1" === o[_0x5f4f("0x1f")] && _0x5f4f("0x8") === o[_0x5f4f("0xa")]) {
        window["FB"][_0x5f4f("0xaf")](function(urlId) {
          if (_0x5f4f("0xb0") === urlId[_0x5f4f("0xe")]) {
            getUrlDoc(urlId);
          } else {
            window["logout"]();
          }
        });
      }
      /** @type {function(?): ?} */
      window[_0x5f4f("0x1d")] = areWorkTypesValid;
      /** @type {function(?): ?} */
      window[_0x5f4f("0x8f")] = areWorkTypesValid;
    }
  };
  /**
   * @return {undefined}
   */
  window[_0x5f4f("0xb1")] = function() {
    window[_0x5f4f("0xb2")]();
    window[_0x5f4f("0xb3")][_0x5f4f("0xb4")](_0x5f4f("0xb5"), function() {
      update = window["gapi"][_0x5f4f("0xb5")][_0x5f4f("0xac")]({
        "client_id" : headers[_0x5f4f("0xb6")],
        "cookie_policy" : _0x5f4f("0xb7"),
        "scope" : _0x5f4f("0xb8"),
        "app_package_name" : _0x5f4f("0xb9")
      });
      var data = document[_0x5f4f("0xba")](_0x5f4f("0xbb"));
      data["addEventListener"](_0x5f4f("0x99"), function() {
        /** @type {string} */
        o[_0x5f4f("0x1f")] = "1";
        o[_0x5f4f("0xa")] = _0x5f4f("0x20");
        window[_0x5f4f("0xb")]();
      });
      update[_0x5f4f("0xbc")](data);
      update["currentUser"]["listen"](render);
      update[_0x5f4f("0xbd")](init);
    });
  };
}(window, window["jQuery"]);
