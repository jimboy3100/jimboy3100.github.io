'use strict';
/** @type {!Array} */
var _0x5f52 = ["recaptchaResponse", "login", "substring", "sendNick", "sendSpectate", "#party-token, .party-token", "joinParty", "hash", "#ffa", "#battleroyale", "#teams", "replaceState", "history", "document", "title", "sendFbToken", "sendGplusToken", "data-itr", "html", "i18n", "#gamemode", "change", "handleChangeMode", ".btn-play, .btn-play-guest", "preventDefault", ".btn-spectate", "spectate", "#create-party-btn-2", "createParty", "#join-party-btn-2", "#party-token", "toggleSocialLogin", "#socialLoginContainer", 
"setUI", "getRegionNames", "refreshRegionInfo", "checkHash", "getRegionCode", "checkRegion", "storeObjectInfo", "signOut", "warning", "Logged out!", "fbAsyncInit", "v2.8", "jQuery", "getStorage", "loginIntent", "context", "getLoginStatus", "status", "logout", "facebookRelogin", "facebookLogin", "You seem to have something blocking Facebook on your browser, please check for any extensions", "facebook", "updateStorage", "public_profile, email", "connected", "accessToken", "doLoginWithFB", "api", "data", 
"userInfo", "url", ".agario-profile-picture", "attr", "src", "#helloContainer", ".progress-bar-striped", "width", "100%", "#login-google", "menu-bar-button", "#login-facebook", "class", "menu-bar-button barf", "info", "Logged in to FaceBook!", "gapi", "load", "auth2", "init", "gplus_client_id", "profile", "com.miniclip.agar.io", "getElementById", "gplusLogin", "addEventListener", "click", "google", "attachClickHandler", "listen", "then", "currentUser", "get", "isSignedIn", "signIn", "getAuthResponse", 
"id_token", "getBasicProfile", "picture", "data-logged-in", "Logged in to Google!", "JP-Tokyo", "EU-London", "SG-Singapore", "US-Atlanta", "BR-Brazil", "CN-China", "RU-Russia", "TK-Turkey", "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com", "webbouncer-live-v6-0.agario.miniclippt.com", "12.0.1", "3.4.6", "master", ":ffa", "client_version", "client_version_string", "localStorage", "getItem", "ogarioClientVersionString", "clientVersion", "parseClientVersion", "clientVersionString", 
"//agar.io/mc/agario.js", "match", "log", "setClientVersion", "text", "GET", "[Master] Your client version:", "core", "setItem", "reconnect", "split", "location", "setRegion", "checkPartyHash", "//gc.agar.io", "setRegionCode", "hasOwnProperty", "region", "#region", "val", "#locationKnown", "append", "parse", "regions", '#region option[value="', "regionNames", "numPlayers", "#region option", "each", "applyGameMode", "gameMode", "data-gamemode", ":party", "encodeURIComponent", "replace", "setGameMode", 
"findingServer", "findBattleRoyaleServer", "setRequestMsg", "curValidFindServer", "makeMasterRequest", "endpoint_version", "endpoints", "0.0.0.0:0", "https", "token", "backoffPeriod", "serverIP", "findServer", "push", "charCodeAt", "length", "application/octet-stream", "ajax", "https://", "master_url", "setRequestHeader", "text/plain", "Accept", "*/*", "q=0.01", "Content-Type", "x-support-proto-version", "proto_version", "x-client-version", "json", "POST", "setPartyState", "indexOf", "partyToken", 
"/getToken", "endpoint", "updatePartyToken", "connect", "[Master] Connect to:", "wss://", "?party_id="];
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
})(_0x5f52, 249);
/**
 * @param {string} i
 * @param {?} parameter1
 * @return {?}
 */
var _0x44c0 = function(i, parameter1) {
  /** @type {number} */
  i = i - 0;
  var oembedView = _0x5f52[i];
  return oembedView;
};
"use strict";
!function(global, gm) {
  /**
   * @return {undefined}
   */
  function login() {
    if (_0x4149e6) {
      global[_0x44c0("0x0")]();
      if ("1" === message[_0x44c0("0x1")] && "facebook" === message[_0x44c0("0x2")]) {
        global["FB"][_0x44c0("0x3")](function(appList) {
          if ("connected" === appList[_0x44c0("0x4")]) {
            loadApps(appList);
          } else {
            global[_0x44c0("0x5")]();
          }
        });
      }
      /** @type {function(): ?} */
      global[_0x44c0("0x6")] = loginCB;
      /** @type {function(): ?} */
      global[_0x44c0("0x7")] = loginCB;
    }
  }
  /**
   * @return {?}
   */
  function loginCB() {
    return null === global["FB"] ? void alert(_0x44c0("0x8")) : (message[_0x44c0("0x1")] = "1", message[_0x44c0("0x2")] = _0x44c0("0x9"), global[_0x44c0("0xa")](), global["FB"]["login"](function(appList) {
      loadApps(appList);
    }, {
      "scope" : _0x44c0("0xb")
    }), true);
  }
  /**
   * @param {!Object} sys_config
   * @return {undefined}
   */
  function loadApps(sys_config) {
    if (_0x44c0("0xc") === sys_config[_0x44c0("0x4")]) {
      var rangechange = sys_config["authResponse"][_0x44c0("0xd")];
      if (rangechange) {
        master[_0x44c0("0xe")](rangechange);
        global["FB"][_0x44c0("0xf")]("/me/picture?width=180&height=180", function(images) {
          if (images[_0x44c0("0x10")] && images[_0x44c0("0x10")]["url"]) {
            message[_0x44c0("0x11")]["picture"] = images["data"][_0x44c0("0x12")];
            gm(_0x44c0("0x13"))[_0x44c0("0x14")](_0x44c0("0x15"), images[_0x44c0("0x10")][_0x44c0("0x12")]);
            global[_0x44c0("0xa")]();
          }
        });
        gm(_0x44c0("0x16"))[_0x44c0("0x14")]("data-logged-in", "1");
        gm(_0x44c0("0x17"))[_0x44c0("0x18")](_0x44c0("0x19"));
        gm(_0x44c0("0x1a"))[_0x44c0("0x14")]("class", _0x44c0("0x1b"));
        gm(_0x44c0("0x1c"))[_0x44c0("0x14")](_0x44c0("0x1d"), _0x44c0("0x1e"));
        toastr[_0x44c0("0x1f")](_0x44c0("0x20"));
      } else {
        if (3 > _0x43e4ff) {
          _0x43e4ff++;
          global[_0x44c0("0x6")]();
          global[_0x44c0("0x5")]();
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function fetchLogin() {
    global[_0x44c0("0x21")][_0x44c0("0x22")](_0x44c0("0x23"), function() {
      el = global[_0x44c0("0x21")][_0x44c0("0x23")][_0x44c0("0x24")]({
        "client_id" : headers[_0x44c0("0x25")],
        "cookie_policy" : "single_host_origin",
        "scope" : _0x44c0("0x26"),
        "app_package_name" : _0x44c0("0x27")
      });
      var nonWhitespaceOrBookmarkEval = document[_0x44c0("0x28")](_0x44c0("0x29"));
      nonWhitespaceOrBookmarkEval[_0x44c0("0x2a")](_0x44c0("0x2b"), function() {
        /** @type {string} */
        message[_0x44c0("0x1")] = "1";
        message[_0x44c0("0x2")] = _0x44c0("0x2c");
        global[_0x44c0("0xa")]();
      });
      el[_0x44c0("0x2d")](nonWhitespaceOrBookmarkEval);
      el["currentUser"][_0x44c0("0x2e")](createImage);
      el[_0x44c0("0x2f")](normalizeProvider);
    });
  }
  /**
   * @return {undefined}
   */
  function normalizeProvider() {
    el[_0x44c0("0x30")][_0x44c0("0x31")]();
    if (!("1" !== message["loginIntent"] || "google" !== message[_0x44c0("0x2")] || el[_0x44c0("0x32")][_0x44c0("0x31")]())) {
      el[_0x44c0("0x33")]();
    }
  }
  /**
   * @param {string} classNames
   * @return {undefined}
   */
  function createImage(classNames) {
    if (classNames && el && "1" === message[_0x44c0("0x1")] && _0x44c0("0x2c") === message[_0x44c0("0x2")] && el[_0x44c0("0x32")][_0x44c0("0x31")]()) {
      var rangechange = classNames[_0x44c0("0x34")]()[_0x44c0("0x35")];
      var attrVal = classNames[_0x44c0("0x36")]()["getImageUrl"]();
      master["doLoginWithGPlus"](rangechange);
      if (attrVal) {
        message[_0x44c0("0x11")][_0x44c0("0x37")] = attrVal;
        global[_0x44c0("0xa")]();
        gm(".agario-profile-picture")["attr"](_0x44c0("0x15"), attrVal);
      }
      gm(_0x44c0("0x16"))[_0x44c0("0x14")](_0x44c0("0x38"), "1");
      gm(_0x44c0("0x17"))["width"]("100%");
      gm(_0x44c0("0x1c"))["attr"](_0x44c0("0x1d"), "menu-bar-button");
      gm(_0x44c0("0x1a"))[_0x44c0("0x14")](_0x44c0("0x1d"), _0x44c0("0x1e"));
      toastr[_0x44c0("0x1f")](_0x44c0("0x39"));
    }
  }
  var countries = {
    "AF" : _0x44c0("0x3a"),
    "AX" : _0x44c0("0x3b"),
    "AL" : _0x44c0("0x3b"),
    "DZ" : _0x44c0("0x3b"),
    "AS" : _0x44c0("0x3c"),
    "AD" : _0x44c0("0x3b"),
    "AO" : _0x44c0("0x3b"),
    "AI" : "US-Atlanta",
    "AG" : _0x44c0("0x3d"),
    "AR" : _0x44c0("0x3e"),
    "AM" : _0x44c0("0x3a"),
    "AW" : _0x44c0("0x3d"),
    "AU" : _0x44c0("0x3c"),
    "AT" : _0x44c0("0x3b"),
    "AZ" : "JP-Tokyo",
    "BS" : "US-Atlanta",
    "BH" : _0x44c0("0x3a"),
    "BD" : _0x44c0("0x3a"),
    "BB" : _0x44c0("0x3d"),
    "BY" : "EU-London",
    "BE" : _0x44c0("0x3b"),
    "BZ" : "US-Atlanta",
    "BJ" : _0x44c0("0x3b"),
    "BM" : "US-Atlanta",
    "BT" : _0x44c0("0x3a"),
    "BO" : _0x44c0("0x3e"),
    "BQ" : "US-Atlanta",
    "BA" : _0x44c0("0x3b"),
    "BW" : _0x44c0("0x3b"),
    "BR" : _0x44c0("0x3e"),
    "IO" : _0x44c0("0x3a"),
    "VG" : "US-Atlanta",
    "BN" : "JP-Tokyo",
    "BG" : _0x44c0("0x3b"),
    "BF" : _0x44c0("0x3b"),
    "BI" : _0x44c0("0x3b"),
    "KH" : _0x44c0("0x3a"),
    "CM" : _0x44c0("0x3b"),
    "CA" : _0x44c0("0x3d"),
    "CV" : _0x44c0("0x3b"),
    "KY" : _0x44c0("0x3d"),
    "CF" : _0x44c0("0x3b"),
    "TD" : _0x44c0("0x3b"),
    "CL" : "BR-Brazil",
    "CN" : _0x44c0("0x3f"),
    "CX" : _0x44c0("0x3a"),
    "CC" : _0x44c0("0x3a"),
    "CO" : _0x44c0("0x3e"),
    "KM" : _0x44c0("0x3b"),
    "CD" : _0x44c0("0x3b"),
    "CG" : _0x44c0("0x3b"),
    "CK" : _0x44c0("0x3c"),
    "CR" : "US-Atlanta",
    "CI" : _0x44c0("0x3b"),
    "HR" : _0x44c0("0x3b"),
    "CU" : _0x44c0("0x3d"),
    "CW" : _0x44c0("0x3d"),
    "CY" : "JP-Tokyo",
    "CZ" : "EU-London",
    "DK" : _0x44c0("0x3b"),
    "DJ" : _0x44c0("0x3b"),
    "DM" : "US-Atlanta",
    "DO" : _0x44c0("0x3d"),
    "EC" : _0x44c0("0x3e"),
    "EG" : _0x44c0("0x3b"),
    "SV" : _0x44c0("0x3d"),
    "GQ" : _0x44c0("0x3b"),
    "ER" : _0x44c0("0x3b"),
    "EE" : _0x44c0("0x3b"),
    "ET" : _0x44c0("0x3b"),
    "FO" : _0x44c0("0x3b"),
    "FK" : _0x44c0("0x3e"),
    "FJ" : _0x44c0("0x3c"),
    "FI" : _0x44c0("0x3b"),
    "FR" : _0x44c0("0x3b"),
    "GF" : _0x44c0("0x3e"),
    "PF" : "SG-Singapore",
    "GA" : _0x44c0("0x3b"),
    "GM" : "EU-London",
    "GE" : _0x44c0("0x3a"),
    "DE" : _0x44c0("0x3b"),
    "GH" : _0x44c0("0x3b"),
    "GI" : _0x44c0("0x3b"),
    "GR" : _0x44c0("0x3b"),
    "GL" : _0x44c0("0x3d"),
    "GD" : "US-Atlanta",
    "GP" : _0x44c0("0x3d"),
    "GU" : _0x44c0("0x3c"),
    "GT" : _0x44c0("0x3d"),
    "GG" : _0x44c0("0x3b"),
    "GN" : _0x44c0("0x3b"),
    "GW" : _0x44c0("0x3b"),
    "GY" : _0x44c0("0x3e"),
    "HT" : _0x44c0("0x3d"),
    "VA" : "EU-London",
    "HN" : _0x44c0("0x3d"),
    "HK" : _0x44c0("0x3a"),
    "HU" : _0x44c0("0x3b"),
    "IS" : _0x44c0("0x3b"),
    "IN" : _0x44c0("0x3a"),
    "ID" : _0x44c0("0x3a"),
    "IR" : _0x44c0("0x3a"),
    "IQ" : "JP-Tokyo",
    "IE" : "EU-London",
    "IM" : _0x44c0("0x3b"),
    "IL" : _0x44c0("0x3a"),
    "IT" : "EU-London",
    "JM" : _0x44c0("0x3d"),
    "JP" : "JP-Tokyo",
    "JE" : _0x44c0("0x3b"),
    "JO" : _0x44c0("0x3a"),
    "KZ" : _0x44c0("0x3a"),
    "KE" : "EU-London",
    "KI" : _0x44c0("0x3c"),
    "KP" : _0x44c0("0x3a"),
    "KR" : _0x44c0("0x3a"),
    "KW" : _0x44c0("0x3a"),
    "KG" : "JP-Tokyo",
    "LA" : _0x44c0("0x3a"),
    "LV" : _0x44c0("0x3b"),
    "LB" : "JP-Tokyo",
    "LS" : "EU-London",
    "LR" : _0x44c0("0x3b"),
    "LY" : _0x44c0("0x3b"),
    "LI" : "EU-London",
    "LT" : _0x44c0("0x3b"),
    "LU" : _0x44c0("0x3b"),
    "MO" : _0x44c0("0x3a"),
    "MK" : _0x44c0("0x3b"),
    "MG" : "EU-London",
    "MW" : "EU-London",
    "MY" : _0x44c0("0x3a"),
    "MV" : _0x44c0("0x3a"),
    "ML" : _0x44c0("0x3b"),
    "MT" : _0x44c0("0x3b"),
    "MH" : _0x44c0("0x3c"),
    "MQ" : _0x44c0("0x3d"),
    "MR" : _0x44c0("0x3b"),
    "MU" : _0x44c0("0x3b"),
    "YT" : _0x44c0("0x3b"),
    "MX" : _0x44c0("0x3d"),
    "FM" : _0x44c0("0x3c"),
    "MD" : "EU-London",
    "MC" : _0x44c0("0x3b"),
    "MN" : _0x44c0("0x3a"),
    "ME" : _0x44c0("0x3b"),
    "MS" : _0x44c0("0x3d"),
    "MA" : _0x44c0("0x3b"),
    "MZ" : "EU-London",
    "MM" : _0x44c0("0x3a"),
    "NA" : _0x44c0("0x3b"),
    "NR" : _0x44c0("0x3c"),
    "NP" : "JP-Tokyo",
    "NL" : _0x44c0("0x3b"),
    "NC" : "SG-Singapore",
    "NZ" : _0x44c0("0x3c"),
    "NI" : _0x44c0("0x3d"),
    "NE" : _0x44c0("0x3b"),
    "NG" : _0x44c0("0x3b"),
    "NU" : _0x44c0("0x3c"),
    "NF" : "SG-Singapore",
    "MP" : _0x44c0("0x3c"),
    "NO" : "EU-London",
    "OM" : _0x44c0("0x3a"),
    "PK" : _0x44c0("0x3a"),
    "PW" : "SG-Singapore",
    "PS" : _0x44c0("0x3a"),
    "PA" : _0x44c0("0x3d"),
    "PG" : _0x44c0("0x3c"),
    "PY" : "BR-Brazil",
    "PE" : _0x44c0("0x3e"),
    "PH" : _0x44c0("0x3a"),
    "PN" : _0x44c0("0x3c"),
    "PL" : _0x44c0("0x3b"),
    "PT" : "EU-London",
    "PR" : _0x44c0("0x3d"),
    "QA" : "JP-Tokyo",
    "RE" : _0x44c0("0x3b"),
    "RO" : _0x44c0("0x3b"),
    "RU" : _0x44c0("0x40"),
    "RW" : _0x44c0("0x3b"),
    "BL" : _0x44c0("0x3d"),
    "SH" : "EU-London",
    "KN" : _0x44c0("0x3d"),
    "LC" : _0x44c0("0x3d"),
    "MF" : _0x44c0("0x3d"),
    "PM" : _0x44c0("0x3d"),
    "VC" : _0x44c0("0x3d"),
    "WS" : "SG-Singapore",
    "SM" : _0x44c0("0x3b"),
    "ST" : "EU-London",
    "SA" : "EU-London",
    "SN" : _0x44c0("0x3b"),
    "RS" : _0x44c0("0x3b"),
    "SC" : _0x44c0("0x3b"),
    "SL" : _0x44c0("0x3b"),
    "SG" : _0x44c0("0x3a"),
    "SX" : _0x44c0("0x3d"),
    "SK" : "EU-London",
    "SI" : _0x44c0("0x3b"),
    "SB" : _0x44c0("0x3c"),
    "SO" : _0x44c0("0x3b"),
    "ZA" : _0x44c0("0x3b"),
    "SS" : _0x44c0("0x3b"),
    "ES" : _0x44c0("0x3b"),
    "LK" : _0x44c0("0x3a"),
    "SD" : _0x44c0("0x3b"),
    "SR" : _0x44c0("0x3e"),
    "SJ" : _0x44c0("0x3b"),
    "SZ" : _0x44c0("0x3b"),
    "SE" : _0x44c0("0x3b"),
    "CH" : "EU-London",
    "SY" : _0x44c0("0x3b"),
    "TW" : "JP-Tokyo",
    "TJ" : _0x44c0("0x3a"),
    "TZ" : _0x44c0("0x3b"),
    "TH" : "JP-Tokyo",
    "TL" : _0x44c0("0x3a"),
    "TG" : _0x44c0("0x3b"),
    "TK" : _0x44c0("0x3c"),
    "TO" : _0x44c0("0x3c"),
    "TT" : _0x44c0("0x3d"),
    "TN" : _0x44c0("0x3b"),
    "TR" : _0x44c0("0x41"),
    "TM" : _0x44c0("0x3a"),
    "TC" : _0x44c0("0x3d"),
    "TV" : _0x44c0("0x3c"),
    "UG" : _0x44c0("0x3b"),
    "UA" : _0x44c0("0x3b"),
    "AE" : "EU-London",
    "GB" : _0x44c0("0x3b"),
    "US" : _0x44c0("0x3d"),
    "UM" : _0x44c0("0x3c"),
    "VI" : _0x44c0("0x3d"),
    "UY" : _0x44c0("0x3e"),
    "UZ" : _0x44c0("0x3a"),
    "VU" : "SG-Singapore",
    "VE" : "BR-Brazil",
    "VN" : "JP-Tokyo",
    "WF" : _0x44c0("0x3c"),
    "EH" : _0x44c0("0x3b"),
    "YE" : _0x44c0("0x3a"),
    "ZM" : _0x44c0("0x3b"),
    "ZW" : _0x44c0("0x3b")
  };
  var message = {
    "context" : null,
    "defaultProvider" : "facebook",
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
    "gplus_client_id" : _0x44c0("0x42"),
    "master_url" : _0x44c0("0x43"),
    "endpoint_version" : "v4",
    "proto_version" : _0x44c0("0x44"),
    "client_version" : 30406,
    "client_version_string" : _0x44c0("0x45")
  };
  /** @type {boolean} */
  var _0x4149e6 = false;
  /** @type {number} */
  var _0x43e4ff = 0;
  /** @type {null} */
  var el = null;
  global[_0x44c0("0x46")] = {
    "ws" : null,
    "serverIP" : null,
    "endpoint" : null,
    "region" : "",
    "gameMode" : _0x44c0("0x47"),
    "partyToken" : "",
    "findingServer" : 0,
    "curValidFindServer" : 0,
    "backoffPeriod" : 500,
    "regionNames" : {},
    "context" : "",
    "accessToken" : null,
    "clientVersion" : headers[_0x44c0("0x48")],
    "clientVersionString" : headers[_0x44c0("0x49")],
    "getClientVersion" : function() {
      if (null !== global[_0x44c0("0x4a")][_0x44c0("0x4b")](_0x44c0("0x4c"))) {
        this["clientVersionString"] = global["localStorage"]["getItem"](_0x44c0("0x4c"));
        this[_0x44c0("0x4d")] = this[_0x44c0("0x4e")](this[_0x44c0("0x4f")]);
      }
      var queue = this;
      gm["ajax"](_0x44c0("0x50"), {
        "error" : function() {
        },
        "success" : function(retu_data) {
          var object = retu_data[_0x44c0("0x51")](/versionString="(\d+\.\d+\.\d+)"/);
          if (object) {
            var result = object[1];
            var data = queue[_0x44c0("0x4e")](result);
            console[_0x44c0("0x52")]("[Master] Current client version:", data, result);
            queue[_0x44c0("0x53")](data, result);
          }
        },
        "dataType" : _0x44c0("0x54"),
        "method" : _0x44c0("0x55"),
        "cache" : false,
        "crossDomain" : true
      });
    },
    "setClientVersion" : function(clientVersion, serverVersion) {
      console[_0x44c0("0x52")](_0x44c0("0x56"), this[_0x44c0("0x4d")], this[_0x44c0("0x4f")]);
      if (this[_0x44c0("0x4d")] != clientVersion) {
        console["log"]("[Master] Changing client version...");
        this[_0x44c0("0x4d")] = clientVersion;
        this[_0x44c0("0x4f")] = serverVersion;
        if (global[_0x44c0("0x57")]) {
          global[_0x44c0("0x57")]["setClientVersion"](clientVersion, serverVersion);
        }
        global["localStorage"][_0x44c0("0x58")]("ogarioClientVersionString", serverVersion);
        this[_0x44c0("0x59")](true);
      }
    },
    "parseClientVersion" : function(layoutSets) {
      return 1E4 * parseInt(layoutSets["split"](".")[0]) + 100 * parseInt(layoutSets[_0x44c0("0x5a")](".")[1]) + parseInt(layoutSets[_0x44c0("0x5a")](".")[2]);
    },
    "getRegionCode" : function() {
      var artistTrack = global[_0x44c0("0x4a")][_0x44c0("0x4b")](_0x44c0("0x5b"));
      if (artistTrack) {
        return this[_0x44c0("0x5c")](artistTrack, false), void(this[_0x44c0("0x5d")]() || this[_0x44c0("0x59")]());
      }
      var command_codes = this;
      gm[_0x44c0("0x31")](_0x44c0("0x5e"), function(canCreateDiscussions) {
        var data = canCreateDiscussions[_0x44c0("0x5a")](" ")[0];
        command_codes[_0x44c0("0x5f")](data);
      }, _0x44c0("0x54"));
    },
    "setRegionCode" : function(i) {
      if (countries[_0x44c0("0x60")](i)) {
        this[_0x44c0("0x5c")](countries[i], false);
        if (!this[_0x44c0("0x5d")]()) {
          this[_0x44c0("0x59")]();
        }
      }
    },
    "setRegion" : function(left, height) {
      if (null == height) {
        /** @type {boolean} */
        height = true;
      }
      if (left) {
        this[_0x44c0("0x61")] = left;
        global[_0x44c0("0x4a")][_0x44c0("0x58")]("location", left);
        if (gm(_0x44c0("0x62"))["val"]() !== left) {
          gm(_0x44c0("0x62"))["val"](left);
        }
        if (height) {
          this["reconnect"]();
        }
      }
    },
    "checkRegion" : function() {
      var scrollbarHelpers = gm(_0x44c0("0x62"));
      var $this = scrollbarHelpers[_0x44c0("0x63")]();
      if ($this) {
        global[_0x44c0("0x4a")][_0x44c0("0x58")](_0x44c0("0x5b"), $this);
      } else {
        if ($this = global[_0x44c0("0x4a")]["getItem"](_0x44c0("0x5b"))) {
          $(_0x44c0("0x62"))["val"]($this);
        }
      }
      if (scrollbarHelpers[_0x44c0("0x63")]()) {
        gm(_0x44c0("0x64"))["append"](scrollbarHelpers);
      } else {
        gm("#locationUnknown")[_0x44c0("0x65")](scrollbarHelpers);
      }
    },
    "refreshRegionInfo" : function() {
      var packagesPromises = this;
      this["makeMasterSimpleRequest"](_0x44c0("0x1f"), _0x44c0("0x54"), function(data) {
        var bigg_id;
        var cobra_reactions = (data = JSON[_0x44c0("0x66")](data))[_0x44c0("0x67")];
        for (bigg_id in cobra_reactions) {
          if (cobra_reactions[_0x44c0("0x60")](bigg_id)) {
            gm(_0x44c0("0x68") + bigg_id + '"]')[_0x44c0("0x54")](packagesPromises[_0x44c0("0x69")][bigg_id] + " (" + cobra_reactions[bigg_id][_0x44c0("0x6a")] + ")");
          }
        }
      });
    },
    "getRegionNames" : function() {
      var packagesPromises = this;
      gm(_0x44c0("0x6b"))[_0x44c0("0x6c")](function() {
        var packageId = gm(this)[_0x44c0("0x63")]();
        var uninstalling = gm(this)[_0x44c0("0x54")]();
        if (!packagesPromises[_0x44c0("0x69")][_0x44c0("0x60")](packageId)) {
          packagesPromises[_0x44c0("0x69")][packageId] = uninstalling;
        }
      });
    },
    "setGameMode" : function(val, opt_validate) {
      if (null == opt_validate) {
        /** @type {boolean} */
        opt_validate = true;
      }
      this[_0x44c0("0x6d")](val);
      this[_0x44c0("0x6e")] = val;
      if (opt_validate) {
        this[_0x44c0("0x59")]();
      }
    },
    "applyGameMode" : function(placement) {
      gm("#helloContainer, #overlays-hud")[_0x44c0("0x14")](_0x44c0("0x6f"), placement);
      gm("#gamemode")[_0x44c0("0x63")](placement);
      if (_0x44c0("0x70") !== placement) {
        this["replaceHistoryState"]("/#" + global[_0x44c0("0x71")](placement[_0x44c0("0x72")](":", "")));
      }
    },
    "handleChangeMode" : function() {
      var artistTrack = gm("#gamemode")[_0x44c0("0x63")]();
      this[_0x44c0("0x73")](artistTrack);
    },
    "findServer" : function(el, dr) {
      var _0x2dcf60 = Date["now"]();
      if (!(500 > _0x2dcf60 - this[_0x44c0("0x74")])) {
        if (global[_0x44c0("0x57")]) {
          global[_0x44c0("0x57")]["disconnect"]();
        }
        /** @type {string} */
        var picKey = "findServer";
        if (null == el) {
          /** @type {string} */
          el = "";
        }
        if (null == dr) {
          /** @type {string} */
          dr = ":ffa";
        } else {
          if (":battleroyale" === dr) {
            picKey = _0x44c0("0x75");
          }
        }
        var options = this;
        var backEl = this[_0x44c0("0x76")](el, dr);
        /** @type {number} */
        var defaultWarningTime = ++this[_0x44c0("0x77")];
        this[_0x44c0("0x74")] = _0x2dcf60;
        this[_0x44c0("0x78")](headers[_0x44c0("0x79")] + "/" + picKey, backEl, function(window) {
          if (defaultWarningTime == options[_0x44c0("0x77")]) {
            var slider = window[_0x44c0("0x7a")];
            if (null !== slider && _0x44c0("0x7b") !== slider[_0x44c0("0x7c")]) {
              options["serverIP"] = slider[_0x44c0("0x7c")];
              if (null !== window[_0x44c0("0x7d")]) {
                options["partyToken"] = window[_0x44c0("0x7d")];
              }
              /** @type {number} */
              options[_0x44c0("0x7e")] = 500;
              options["connect"](options[_0x44c0("0x7f")]);
            } else {
              options[_0x44c0("0x80")](el, dr);
            }
          }
        }, function() {
          options[_0x44c0("0x7e")] *= 2;
          setTimeout(function() {
            options[_0x44c0("0x80")](el, dr);
          }, options[_0x44c0("0x7e")]);
        });
      }
    },
    "setRequestMsg" : function(showMsg, reloadDataGrid, PL$78) {
      /**
       * @param {!Object} PL$42
       * @return {undefined}
       */
      var _validateCaptcha = function(PL$42) {
        left[_0x44c0("0x81")](PL$42["length"]);
        /** @type {number} */
        var PL$41 = 0;
        for (; PL$41 < PL$42["length"]; PL$41++) {
          left[_0x44c0("0x81")](PL$42[_0x44c0("0x82")](PL$41));
        }
      };
      /** @type {!Array} */
      var left = [10, 4 + showMsg[_0x44c0("0x83")] + reloadDataGrid[_0x44c0("0x83")], 10];
      return _validateCaptcha(showMsg), left["push"](18), _validateCaptcha(reloadDataGrid), PL$78 && (left[_0x44c0("0x81")](26, 8, 10), _validateCaptcha(PL$78)), new Uint8Array(left);
    },
    "makeMasterRequest" : function(regexMask, opts, sucFn, renderTerminator, url) {
      var header = this;
      if (null == url) {
        url = _0x44c0("0x84");
      }
      gm[_0x44c0("0x85")](_0x44c0("0x86") + headers[_0x44c0("0x87")] + "/" + regexMask, {
        "beforeSend" : function(xhr) {
          return xhr[_0x44c0("0x88")]("Accept", _0x44c0("0x89")), xhr[_0x44c0("0x88")](_0x44c0("0x8a"), _0x44c0("0x8b")), xhr[_0x44c0("0x88")]("Accept", _0x44c0("0x8c")), xhr[_0x44c0("0x88")](_0x44c0("0x8d"), url), xhr[_0x44c0("0x88")](_0x44c0("0x8e"), headers[_0x44c0("0x8f")]), xhr["setRequestHeader"](_0x44c0("0x90"), header[_0x44c0("0x4d")]), true;
        },
        "error" : function() {
          if (renderTerminator) {
            renderTerminator();
          }
        },
        "success" : function(res) {
          sucFn(res);
        },
        "dataType" : _0x44c0("0x91"),
        "method" : _0x44c0("0x92"),
        "data" : opts,
        "processData" : false,
        "cache" : false,
        "crossDomain" : true
      });
    },
    "makeMasterSimpleRequest" : function(courseId, cmid, refresh, callback) {
      var header = this;
      gm[_0x44c0("0x85")](_0x44c0("0x86") + headers[_0x44c0("0x87")] + "/" + courseId, {
        "beforeSend" : function(xhr) {
          return xhr[_0x44c0("0x88")](_0x44c0("0x8e"), headers[_0x44c0("0x8f")]), xhr[_0x44c0("0x88")](_0x44c0("0x90"), header[_0x44c0("0x4d")]), true;
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
      this[_0x44c0("0x93")]("3");
      this[_0x44c0("0x73")](_0x44c0("0x70"));
    },
    "joinParty" : function(code) {
      var _0x82727e = this;
      if (-1 != code[_0x44c0("0x94")]("#")) {
        code = code[_0x44c0("0x5a")]("#")[1];
      }
      this[_0x44c0("0x73")](_0x44c0("0x70"), false);
      this[_0x44c0("0x95")] = code;
      this["replaceHistoryState"]("/#" + global[_0x44c0("0x71")](code));
      var pre = this[_0x44c0("0x76")](this[_0x44c0("0x61")], "", code);
      this[_0x44c0("0x78")](headers[_0x44c0("0x79")] + _0x44c0("0x96"), pre, function(canCreateDiscussions) {
        _0x82727e[_0x44c0("0x97")] = canCreateDiscussions[_0x44c0("0x7a")][_0x44c0("0x7c")];
        _0x82727e[_0x44c0("0x93")]("9");
      }, function() {
        _0x82727e[_0x44c0("0x93")]("6");
      });
    },
    "setPartyState" : function(mmCoreSplitViewBlock) {
      if ("9" === mmCoreSplitViewBlock) {
        this[_0x44c0("0x98")]();
        this[_0x44c0("0x73")](_0x44c0("0x70"), false);
        this[_0x44c0("0x99")](this[_0x44c0("0x97")]);
        /** @type {string} */
        mmCoreSplitViewBlock = "5";
      }
      gm("#helloContainer")[_0x44c0("0x14")]("data-party-state", mmCoreSplitViewBlock);
    },
    "connect" : function(b) {
      console[_0x44c0("0x52")](_0x44c0("0x9a"), b);
      this["ws"] = _0x44c0("0x9b") + b;
      if (_0x44c0("0x70") === this[_0x44c0("0x6e")] && this[_0x44c0("0x95")]) {
        this["ws"] += _0x44c0("0x9c") + global[_0x44c0("0x71")](this[_0x44c0("0x95")]);
      }
      if (global[_0x44c0("0x57")]) {
        global[_0x44c0("0x57")][_0x44c0("0x99")](this["ws"]);
      }
    },
    "reconnect" : function(sdkVersion) {
      if (this["region"]) {
        if (sdkVersion && this[_0x44c0("0x7f")]) {
          this[_0x44c0("0x99")](this["serverIP"]);
        } else {
          this["findServer"](this[_0x44c0("0x61")], this[_0x44c0("0x6e")]);
        }
      }
    },
    "onConnect" : function() {
      if (":party" === this[_0x44c0("0x6e")]) {
        this[_0x44c0("0x98")]();
      }
    },
    "onDisconnect" : function() {
      this[_0x44c0("0x59")]();
    },
    "recaptchaRequested" : function() {
      requestCaptcha(true);
    },
    "sendRecaptchaResponse" : function(mmCoreSplitViewBlock) {
      if (global["core"]) {
        global[_0x44c0("0x57")][_0x44c0("0x9d")](mmCoreSplitViewBlock);
      }
    },
    "notifyToken" : function(mmCoreSplitViewBlock) {
      this["sendRecaptchaResponse"](mmCoreSplitViewBlock);
    },
    "setNick" : function() {
      this[_0x44c0("0x9e")]();
      var artistTrack = gm("#nick")[_0x44c0("0x63")]();
      if (artistTrack && 15 < artistTrack[_0x44c0("0x83")]) {
        artistTrack = artistTrack[_0x44c0("0x9f")](0, 15);
      }
      if (global[_0x44c0("0x57")]) {
        global[_0x44c0("0x57")][_0x44c0("0xa0")](artistTrack);
      }
    },
    "spectate" : function() {
      if (global[_0x44c0("0x57")]) {
        global[_0x44c0("0x57")][_0x44c0("0xa1")]();
      }
    },
    "updatePartyToken" : function() {
      gm(_0x44c0("0xa2"))[_0x44c0("0x63")](this[_0x44c0("0x95")]);
    },
    "checkHash" : function() {
      if (this[_0x44c0("0x5d")]()) {
        this[_0x44c0("0xa3")](global["location"][_0x44c0("0xa4")]);
      } else {
        if (global["location"][_0x44c0("0xa4")] && -1 != [_0x44c0("0xa5"), _0x44c0("0xa6"), _0x44c0("0xa7"), "#experimental"][_0x44c0("0x94")](global["location"][_0x44c0("0xa4")])) {
          this["setGameMode"](global[_0x44c0("0x5b")][_0x44c0("0xa4")]["replace"]("#", ":"));
        }
      }
    },
    "checkPartyHash" : function() {
      return global[_0x44c0("0x5b")][_0x44c0("0xa4")] && 7 == global[_0x44c0("0x5b")][_0x44c0("0xa4")][_0x44c0("0x83")];
    },
    "replaceHistoryState" : function(name) {
      if (global["history"] && global["history"][_0x44c0("0xa8")]) {
        global[_0x44c0("0xa9")]["replaceState"]({}, global[_0x44c0("0xaa")][_0x44c0("0xab")], name);
      }
    },
    "facebookLogin" : function() {
      global[_0x44c0("0x7")]();
    },
    "doLoginWithFB" : function(canCreateDiscussions) {
      this[_0x44c0("0x2")] = _0x44c0("0x9");
      this[_0x44c0("0xd")] = canCreateDiscussions;
    },
    "doLoginWithGPlus" : function(canCreateDiscussions) {
      /** @type {string} */
      this[_0x44c0("0x2")] = "google";
      this[_0x44c0("0xd")] = canCreateDiscussions;
    },
    "login" : function() {
      if (this["accessToken"]) {
        if (_0x44c0("0x9") === this["context"] && global[_0x44c0("0x57")] && global["core"]["sendFbToken"]) {
          global[_0x44c0("0x57")][_0x44c0("0xac")](this["accessToken"]);
        }
        if (_0x44c0("0x2c") === this[_0x44c0("0x2")] && global[_0x44c0("0x57")] && global[_0x44c0("0x57")][_0x44c0("0xad")]) {
          global[_0x44c0("0x57")][_0x44c0("0xad")](this[_0x44c0("0xd")]);
        }
      }
    },
    "logout" : function() {
      /** @type {null} */
      this[_0x44c0("0xd")] = null;
      this["reconnect"]();
    },
    "setUI" : function() {
      var window = this;
      gm("[data-itr]")[_0x44c0("0x6c")](function() {
        var requireCompilers = gm(this);
        var code = requireCompilers[_0x44c0("0x14")](_0x44c0("0xae"));
        requireCompilers[_0x44c0("0xaf")](global[_0x44c0("0xb0")](code));
      });
      gm(_0x44c0("0xb1"))["on"](_0x44c0("0xb2"), function() {
        window[_0x44c0("0xb3")]();
      });
      gm(_0x44c0("0xb4"))["on"](_0x44c0("0x2b"), function(canCreateDiscussions) {
        canCreateDiscussions[_0x44c0("0xb5")]();
        window["setNick"]();
      });
      gm(_0x44c0("0xb6"))["on"](_0x44c0("0x2b"), function(canCreateDiscussions) {
        canCreateDiscussions[_0x44c0("0xb5")]();
        window[_0x44c0("0xb7")]();
      });
      gm(_0x44c0("0xb8"))["on"](_0x44c0("0x2b"), function(canCreateDiscussions) {
        canCreateDiscussions[_0x44c0("0xb5")]();
        window[_0x44c0("0xb9")]();
      });
      $(_0x44c0("0xba"))["on"]("click", function(canCreateDiscussions) {
        canCreateDiscussions[_0x44c0("0xb5")]();
        window[_0x44c0("0xa3")](gm(_0x44c0("0xbb"))[_0x44c0("0x63")]());
      });
      /**
       * @return {undefined}
       */
      global[_0x44c0("0xbc")] = function() {
        gm(_0x44c0("0xbd"))["toggle"]();
      };
    },
    "init" : function() {
      var _0x42782b = this;
      this[_0x44c0("0xbe")]();
      this[_0x44c0("0xbf")]();
      this[_0x44c0("0xc0")]();
      this[_0x44c0("0xc1")]();
      this[_0x44c0("0xc2")]();
      this[_0x44c0("0xc3")]();
      setInterval(function() {
        _0x42782b[_0x44c0("0xc0")]();
      }, 18E4);
    }
  };
  /**
   * @return {undefined}
   */
  global[_0x44c0("0x0")] = function() {
    if (null !== global[_0x44c0("0x4a")][_0x44c0("0x4b")](_0x44c0("0xc4"))) {
      message = JSON[_0x44c0("0x66")](global[_0x44c0("0x4a")][_0x44c0("0x4b")](_0x44c0("0xc4")));
    }
  };
  /**
   * @return {undefined}
   */
  global["updateStorage"] = function() {
    global[_0x44c0("0x4a")][_0x44c0("0x58")]("storeObjectInfo", JSON["stringify"](message));
  };
  /**
   * @return {undefined}
   */
  global[_0x44c0("0x5")] = function() {
    if (_0x44c0("0x2c") === message[_0x44c0("0x2")] && el) {
      el[_0x44c0("0xc5")]();
    }
    delete global["localStorage"][_0x44c0("0xc4")];
    gm(_0x44c0("0x16"))[_0x44c0("0x14")](_0x44c0("0x38"), "0");
    gm(_0x44c0("0x17"))[_0x44c0("0x18")]("0%");
    gm("#login-facebook")[_0x44c0("0x14")]("class", "menu-bar-button");
    gm(_0x44c0("0x1a"))[_0x44c0("0x14")](_0x44c0("0x1d"), _0x44c0("0x1b"));
    toastr[_0x44c0("0xc6")](_0x44c0("0xc7"));
    master[_0x44c0("0x5")]();
  };
  /**
   * @return {undefined}
   */
  global["facebookLogin"] = function() {
    alert(_0x44c0("0x8"));
  };
  /**
   * @return {undefined}
   */
  global[_0x44c0("0xc8")] = function() {
    global["FB"][_0x44c0("0x24")]({
      "appId" : headers["fb_app_id"],
      "cookie" : true,
      "xfbml" : true,
      "status" : true,
      "version" : _0x44c0("0xc9")
    });
    /** @type {boolean} */
    _0x4149e6 = true;
    login();
  };
  /**
   * @return {undefined}
   */
  global["gapiAsyncInit"] = function() {
    global["getStorage"]();
    fetchLogin();
  };
}(window, window[_0x44c0("0xca")]);
