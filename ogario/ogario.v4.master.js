// Decoded by Jimboy3100
// v1.4
function t1() {
	global=window;
	require=window["jQuery"]
  /**
   * @return {?}
   */
  function timeoutSaver() {
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
  }
  /**
   * @param {?} keyBindingMapper
   * @return {?}
   */
  function initialize(keyBindingMapper) {
    if (null !== global["FB"]) {
      return message["loginIntent"] = "1", message["context"] = "facebook", global["updateStorage"](), global["FB"]["login"](function(requestTokenResult) {
        init(requestTokenResult);
      }, {
        "scope" : "public_profile, email"
      }), true;
    }
    alert("You seem to have something blocking Facebook on your browser, please check for any extensions");
  }
  /**
   * @param {!Object} response
   * @return {undefined}
   */
  function init(response) {
    if ("connected" === response["status"]) {
      var accessToken = response["authResponse"]["accessToken"];
      if (accessToken) {
        master["doLoginWithFB"](accessToken);
        global["FB"]["api"]("/me/picture?width=180&height=180", function(images) {
          if (images["data"] && images["data"]["url"]) {
            message["userInfo"]["picture"] = images["data"]["url"];
            require(".agario-profile-picture")["attr"]("src", images["data"]["url"]);
            global["updateStorage"]();
          }
        });
        require("#helloContainer")["attr"]("data-logged-in", "1");
        require(".progress-bar-striped")["width"]("100%");
      } else {
        if (_0x136f53 < 3) {
          _0x136f53++;
          global["facebookRelogin"]();
          global["logout"]();
        }
      }
    }
  }
  /**
   * @return {undefined}
   */
  function login() {
    PL$12["currentUser"]["get"]();
    if ("1" === message["loginIntent"] && "google" === message["context"] && !PL$12["isSignedIn"]["get"]()) {
      PL$12["signIn"]();
    }
  }
  /**
   * @param {?} pointSizeParam
   * @return {undefined}
   */
  function callback(pointSizeParam) {
    if (pointSizeParam && PL$12 && "1" === message["loginIntent"] && "google" === message["context"] && PL$12["isSignedIn"]["get"]()) {
      var access_token = pointSizeParam["getAuthResponse"]()["access_token"];
      var attrVal = pointSizeParam["getBasicProfile"]()["getImageUrl"]();
      master["doLoginWithGPlus"](access_token);
      if (attrVal) {
        message["userInfo"]["picture"] = attrVal;
        global["updateStorage"]();
        require(".agario-profile-picture")["attr"]("src", attrVal);
      }
      require("#helloContainer")["attr"]("data-logged-in", "1");
      require(".progress-bar-striped")["width"]("100%");
    }
  }
  var _LSSaver = timeoutSaver(this, function() {
  });
  _LSSaver();

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
    "gplus_client_id" : "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
    "master_url" : "webbouncer-live-v6-0.agario.miniclippt.com",
    "endpoint_version" : "v4",
    "proto_version" : "12.0.1",
    "client_version" : 30400,
    "client_version_string" : "3.4.0"
  };
  /** @type {number} */
  var _0x136f53 = 0;
  /** @type {null} */
  var PL$12 = null;
  global["master"] = {
    "ws" : null,
    "serverIP" : null,
    "endpoint" : null,
    "region" : "",
    "gameMode" : ":ffa",
    "partyToken" : "",
    "findingServer" : 0,
    "curValidFindServer" : 0,
    "backoffPeriod" : 500,
    "regionNames" : {},
    "context" : "",
    "accessToken" : null,
    "clientVersion" : headers["client_version"],
    "clientVersionString" : headers["client_version_string"],
    "getClientVersion" : function() {
      if (null !== global["localStorage"]["getItem"]("ogarioClientVersionString")) {
        this["clientVersionString"] = global["localStorage"]["getItem"]("ogarioClientVersionString");
        this["clientVersion"] = this["parseClientVersion"](this["clientVersionString"]);
      }
      var dispatcher = this;
      require["ajax"]("//agar.io/mc/agario.js", {
        "error" : function() {
        },
        "success" : function(result) {
          var subtitleParts = result["match"](/versionString="(\d+\.\d+\.\d+)"/);
          if (subtitleParts) {
            var timestamp = subtitleParts[1];
            var data = dispatcher["parseClientVersion"](timestamp);
            console["log"]("[Master] Current client version:", data, timestamp);
            dispatcher["setClientVersion"](data, timestamp);
          }
        },
        "dataType" : "text",
        "method" : "GET",
        "cache" : false,
        "crossDomain" : true
      });
    },
    "setClientVersion" : function(clientVersion, serverVersion) {
      console["log"]("[Master] Your client version:", this["clientVersion"], this["clientVersionString"]);
      if (this["clientVersion"] != clientVersion) {
        console["log"]("[Master] Changing client version...");
        this["clientVersion"] = clientVersion;
        this["clientVersionString"] = serverVersion;
        if (global["core"]) {
          global["core"]["setClientVersion"](clientVersion, serverVersion);
        }
        global["localStorage"]["setItem"]("ogarioClientVersionString", serverVersion);
        this["reconnect"](true);
      }
    },
    "parseClientVersion" : function(layoutSets) {
      return 10000 * parseInt(layoutSets["split"](".")[0]) + 100 * parseInt(layoutSets["split"](".")[1]) + parseInt(layoutSets["split"](".")[2]);
    },
    "getRegionCode" : function() {
      var nextNodeLoc = global["localStorage"]["getItem"]("location");
      if (nextNodeLoc) {
        return this["setRegion"](nextNodeLoc, false), void(this["checkPartyHash"]() || this["reconnect"]());
      }
      var command_codes = this;
      require["get"]("//gc.agar.io", function(layoutSets) {
        var data = layoutSets["split"](" ")[0];
        command_codes["setRegionCode"](data);
      }, "text");
    },
    "setRegionCode" : function(key) {
      if (regionobj["hasOwnProperty"](key)) {
        this["setRegion"](regionobj[key], false);
        if (!this["checkPartyHash"]()) {
          this["reconnect"]();
        }
      }
    },
    "setRegion" : function(region, width) {
      if (null == width) {
        /** @type {boolean} */
        width = true;
      }
      if (region) {
        this["region"] = region;
        global["localStorage"]["setItem"]("location", region);
        if (require("#region")["val"]() !== region) {
          require("#region")["val"](region);
        }
        if (width) {
          this["reconnect"]();
        }
      }
    },
    "checkRegion" : function() {
      var style = require("#region");
      var options = style["val"]();
      if (options) {
        global["localStorage"]["setItem"]("location", options);
      } else {
        if (options = global["localStorage"]["getItem"]("location")) {
          $("#region")["val"](options);
        }
      }
      if (style["val"]()) {
        require("#locationKnown")["append"](style);
      } else {
        require("#locationUnknown")["append"](style);
      }
    },
    "refreshRegionInfo" : function() {
      var _0x4939d9 = this;
      this["makeMasterSimpleRequest"]("info", "text", function(data) {
        var PL$10 = (data = JSON["parse"](data))["regions"];
        var PL$11;
        for (PL$11 in PL$10) {
          if (PL$10["hasOwnProperty"](PL$11)) {
            require('#region option[value="' + PL$11 + '"]')["text"](_0x4939d9["regionNames"][PL$11] + " (" + PL$10[PL$11]["numPlayers"] + ")");
          }
        }
      });
    },
    "getRegionNames" : function() {
      var PL$5 = this;
      require("#region option")["each"](function() {
        var bigg_id = require(this)["val"]();
        var this_gene_data = require(this)["text"]();
        if (!PL$5["regionNames"]["hasOwnProperty"](bigg_id)) {
          PL$5["regionNames"][bigg_id] = this_gene_data;
        }
      });
    },
    "setGameMode" : function(val, opt_validate) {
      if (null == opt_validate) {
        /** @type {boolean} */
        opt_validate = true;
      }
      this["applyGameMode"](val);
      this["gameMode"] = val;
      if (opt_validate) {
        this["reconnect"]();
      }
    },
    "applyGameMode" : function(colorString) {
      require("#helloContainer, #overlays-hud")["attr"]("data-gamemode", colorString);
      require("#gamemode")["val"](colorString);
      if (":party" !== colorString) {
        this["replaceHistoryState"]("/#" + global["encodeURIComponent"](colorString["replace"](":", "")));
      }
    },
    "handleChangeMode" : function() {
      var artistTrack = require("#gamemode")["val"]();
      this["setGameMode"](artistTrack);
    },
    "findServer" : function(el, dr) {
      var _0xbb82b = Date["now"]();
      if (!(_0xbb82b - this["findingServer"] < 500)) {
        if (global["core"]) {
          global["core"]["disconnect"]();
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
            /** @type {string} */
            picKey = "findBattleRoyaleServer";
          }
        }
        var options = this;
        var backEl = this["setRequestMsg"](el, dr);
        /** @type {number} */
        var defaultWarningTime = ++this["curValidFindServer"];
        this["findingServer"] = _0xbb82b;
        this["makeMasterRequest"](headers["endpoint_version"] + "/" + picKey, backEl, function(response) {
          if (defaultWarningTime == options["curValidFindServer"]) {
            var key = response["endpoints"];
            if (null !== key && "0.0.0.0:0" !== key["https"]) {
              options["serverIP"] = key["https"];
              if (null !== response["token"]) {
                options["partyToken"] = response["token"];
              }
              /** @type {number} */
              options["backoffPeriod"] = 500;
              options["connect"](options["serverIP"]);
            } else {
              options["findServer"](el, dr);
            }
          }
        }, function() {
          options["backoffPeriod"] *= 2;
          setTimeout(function() {
            options["findServer"](el, dr);
          }, options["backoffPeriod"]);
        });
      }
    },
    "setRequestMsg" : function(props, source, o) {
      /**
       * @param {!Object} regionobj
       * @return {undefined}
       */
      var getOwnPropertyNames = function(regionobj) {
        output["push"](regionobj["length"]);
        /** @type {number} */
        var value = 0;
        for (; value < regionobj["length"]; value++) {
          output["push"](regionobj["charCodeAt"](value));
        }
      };
      /** @type {!Array} */
      var output = [10, 4 + props["length"] + source["length"], 10];
      return getOwnPropertyNames(props), output["push"](18), getOwnPropertyNames(source), o && (output["push"](26, 8, 10), getOwnPropertyNames(o)), new Uint8Array(output);
    },
    "makeMasterRequest" : function(uri, data, callback, event, XMLHttpRequest) {
      var header = this;
      if (null == XMLHttpRequest) {
        /** @type {string} */
        XMLHttpRequest = "application/octet-stream";
      }
      require["ajax"]("https://" + headers["master_url"] + "/" + uri, {
        "beforeSend" : function(xhr) {
          return xhr["setRequestHeader"]("Accept", "text/plain"), xhr["setRequestHeader"]("Accept", "*/*"), xhr["setRequestHeader"]("Accept", "q=0.01"), xhr["setRequestHeader"]("Content-Type", XMLHttpRequest), xhr["setRequestHeader"]("x-support-proto-version", headers["proto_version"]), xhr["setRequestHeader"]("x-client-version", header["clientVersion"]), true;
        },
        "error" : function() {
          if (event) {
            event();
          }
        },
        "success" : function(playlistCopy) {
          callback(playlistCopy);
        },
        "dataType" : "json",
        "method" : "POST",
        "data" : data,
        "processData" : false,
        "cache" : false,
        "crossDomain" : true
      });
    },
    "makeMasterSimpleRequest" : function(courseId, cmid, refresh, callback) {
      var header = this;
      require["ajax"]("https://" + headers["master_url"] + "/" + courseId, {
        "beforeSend" : function(xhr) {
          return xhr["setRequestHeader"]("x-support-proto-version", headers["proto_version"]), xhr["setRequestHeader"]("x-client-version", header["clientVersion"]), true;
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
      this["setPartyState"]("3");
      this["setGameMode"](":party");
    },
    "joinParty" : function(code) {
      var scopeHeaderOverrides = this;
      if (-1 != code["indexOf"]("#")) {
        code = code["split"]("#")[1];
      }
      this["setGameMode"](":party", false);
      /** @type {!Object} */
      this["partyToken"] = code;
      this["replaceHistoryState"]("/#" + global["encodeURIComponent"](code));
      var pre = this["setRequestMsg"](this["region"], "", code);
      this["makeMasterRequest"](headers["endpoint_version"] + "/getToken", pre, function(moduleParams) {
        scopeHeaderOverrides["endpoint"] = moduleParams["endpoints"]["https"];
        scopeHeaderOverrides["setPartyState"]("9");
      }, function() {
        scopeHeaderOverrides["setPartyState"]("6");
      });
    },
    "setPartyState" : function(value) {
      if ("9" === value) {
        this["updatePartyToken"]();
        this["setGameMode"](":party", false);
        this["connect"](this["endpoint"]);
        /** @type {string} */
        value = "5";
      }
      require("#helloContainer")["attr"]("data-party-state", value);
    },
    "connect" : function(body) {
      console["log"]("[Master] Connect to:", body);
      /** @type {string} */
      this["ws"] = "wss://" + body;
      if (":party" === this["gameMode"] && this["partyToken"]) {
        this["ws"] += "?party_id=" + global["encodeURIComponent"](this["partyToken"]);
      }
      if (global["core"]) {
        global["core"]["connect"](this["ws"]);
      }
    },
    "reconnect" : function(sdkVersion) {
      if (this["region"]) {
        if (sdkVersion && this["serverIP"]) {
          this["connect"](this["serverIP"]);
        } else {
          this["findServer"](this["region"], this["gameMode"]);
        }
      }
    },
    "onConnect" : function() {
      if (":party" === this["gameMode"]) {
        this["updatePartyToken"]();
      }
    },
    "onDisconnect" : function() {
      this["reconnect"]();
    },
    "recaptchaRequested" : function() {
      requestCaptcha(true);
    },
    "sendRecaptchaResponse" : function(mmCoreSplitViewBlock) {
      if (global["core"]) {
        global["core"]["recaptchaResponse"](mmCoreSplitViewBlock);
      }
    },
    "notifyToken" : function(mmCoreSplitViewBlock) {
      this["sendRecaptchaResponse"](mmCoreSplitViewBlock);
    },
    "setNick" : function() {
      this["login"]();
      var result = require("#nick")["val"]();
      if (result && result["length"] > 15) {
        result = result["substring"](0, 15);
      }
      if (global["core"]) {
        global["core"]["sendNick"](result);
      }
    },
    "spectate" : function() {
      if (global["core"]) {
        global["core"]["sendSpectate"]();
      }
    },
    "updatePartyToken" : function() {
      require("#party-token, .party-token")["val"](this["partyToken"]);
    },
    "checkHash" : function() {
      if (this["checkPartyHash"]()) {
        this["joinParty"](global["location"]["hash"]);
      } else {
        if (global["location"]["hash"] && -1 != ["#ffa", "#battleroyale", "#teams", "#experimental"]["indexOf"](global["location"]["hash"])) {
          this["setGameMode"](global["location"]["hash"]["replace"]("#", ":"));
        }
      }
    },
    "checkPartyHash" : function() {
      return global["location"]["hash"] && 7 == global["location"]["hash"]["length"];
    },
    "replaceHistoryState" : function(name) {
      if (global["history"] && global["history"]["replaceState"]) {
        global["history"]["replaceState"]({}, global["document"]["title"], name);
      }
    },
    "facebookLogin" : function() {
      global["facebookLogin"]();
    },
    "doLoginWithFB" : function(session) {
      /** @type {string} */
      this["context"] = "facebook";
      this["accessToken"] = session;
    },
    "doLoginWithGPlus" : function(session) {
      /** @type {string} */
      this["context"] = "google";
      this["accessToken"] = session;
    },
    "login" : function() {
      if (this["accessToken"]) {
        if ("facebook" === this["context"] && global["core"] && global["core"]["sendFbToken"]) {
          global["core"]["sendFbToken"](this["accessToken"]);
        }
        if ("google" === this["context"] && global["core"] && global["core"]["sendGplusToken"]) {
          global["core"]["sendGplusToken"](this["accessToken"]);
        }
      }
    },
    "logout" : function() {
      /** @type {null} */
      this["accessToken"] = null;
      this["reconnect"]();
    },
    "setUI" : function() {
      var window = this;
      require("[data-itr]")["each"](function() {
        var Filters = require(this);
        var val = Filters["attr"]("data-itr");
        Filters["html"](global["i18n"](val));
      });
      require("#gamemode")["on"]("change", function() {
        window["handleChangeMode"]();
      });
      require(".btn-play, .btn-play-guest")["on"]("click", function(result) {
        result["preventDefault"]();
        window["setNick"]();
      });
      require(".btn-spectate")["on"]("click", function(result) {
        result["preventDefault"]();
        window["spectate"]();
      });
      require("#create-party-btn-2")["on"]("click", function(result) {
        result["preventDefault"]();
        window["createParty"]();
      });
      $("#join-party-btn-2")["on"]("click", function(result) {
        result["preventDefault"]();
        window["joinParty"](require("#party-token")["val"]());
      });
      /**
       * @return {undefined}
       */
      global["toggleSocialLogin"] = function() {
        require("#socialLoginContainer")["toggle"]();
      };
    },
    "init" : function() {
      var _0x4939d9 = this;
      this["setUI"]();
      this["getRegionNames"]();
      this["refreshRegionInfo"]();
      this["checkHash"]();
      this["getRegionCode"]();
      this["checkRegion"]();
      setInterval(function() {
        _0x4939d9["refreshRegionInfo"]();
      }, 180000);
    }
  };
  /**
   * @return {undefined}
   */
  global["getStorage"] = function() {
    if (null !== global["localStorage"]["getItem"]("storeObjectInfo")) {
      message = JSON["parse"](global["localStorage"]["getItem"]("storeObjectInfo"));
    }
  };
  /**
   * @return {undefined}
   */
  global["updateStorage"] = function() {
    global["localStorage"]["setItem"]("storeObjectInfo", JSON["stringify"](message));
  };
  /**
   * @return {undefined}
   */
  global["logout"] = function() {
    if ("google" === message["context"] && PL$12) {
      PL$12["signOut"]();
    }
    delete global["localStorage"]["storeObjectInfo"];
    require("#helloContainer")["attr"]("data-logged-in", "0");
    require(".progress-bar-striped")["width"]("0%");
    master["logout"]();
  };
  /**
   * @return {undefined}
   */
  global["facebookLogin"] = function() {
    alert("You seem to have something blocking Facebook on your browser, please check for any extensions");
  };
  /**
   * @return {undefined}
   */
  global["fbAsyncInit"] = function() {
    global["FB"]["init"]({
      "appId" : headers["fb_app_id"],
      "cookie" : true,
      "xfbml" : true,
      "status" : true,
      "version" : "v2.8"
    });
    if (true) {
      global["getStorage"]();
      if ("1" === message["loginIntent"] && "facebook" === message["context"]) {
        global["FB"]["getLoginStatus"](function(ctx) {
          if ("connected" === ctx["status"]) {
            init(ctx);
          } else {
            global["logout"]();
          }
        });
      }
      /** @type {function(?): ?} */
      global["facebookRelogin"] = initialize;
      /** @type {function(?): ?} */
      global["facebookLogin"] = initialize;
    }
  };
  /**
   * @return {undefined}
   */
  global["gapiAsyncInit"] = function() {
    global["getStorage"]();
    global["gapi"]["load"]("auth2", function() {
      PL$12 = global["gapi"]["auth2"]["init"]({
        "client_id" : headers["gplus_client_id"],
        "cookie_policy" : "single_host_origin",
        "scope" : "https://www.googleapis.com/auth/plus.login email",
        "app_package_name" : "com.miniclip.agar.io"
      });
      var contextMenu = document["getElementById"]("gplusLogin");
      contextMenu["addEventListener"]("click", function() {
        /** @type {string} */
        message["loginIntent"] = "1";
        /** @type {string} */
        message["context"] = "google";
        global["updateStorage"]();
      });
      PL$12["attachClickHandler"](contextMenu);
      PL$12["currentUser"]["listen"](callback);
      PL$12["then"](login);
    });
  };
};
t1();
