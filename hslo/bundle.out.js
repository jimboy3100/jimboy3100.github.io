"use strict";
var _slicedToArray = function(ee, oe) {
        if (Array.isArray(ee)) return ee;
        if (Symbol.iterator in Object(ee)) return function(te, ae) {
            var _e, ne = [],
                le = !0,
                ie = !1;
            try {
                for (var re, se = te[Symbol.iterator](); !(le = (re = se.next()).done) && (ne.push(re.value), !ae || ne.length !== ae); le = !0);
            } catch (ce) {
                ie = !0, _e = ce
            } finally {
                try {
                    !le && se.return && se.return()
                } finally {
                    if (ie) throw _e
                }
            }
            return ne
        }(ee, oe);
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
    },
    _createClass = function() {
        function ee(oe, te) {
            for (var ne, ae = 0; ae < te.length; ae++) ne = te[ae], ne.enumerable = ne.enumerable || !1, ne.configurable = !0, "value" in ne && (ne.writable = !0), Object.defineProperty(oe, ne.key, ne)
        }
        return function(oe, te, ae) {
            return te && ee(oe.prototype, te), ae && ee(oe, ae), oe
        }
    }();

function _classCallCheck(ee, oe) {
    if (!(ee instanceof oe)) throw new TypeError("Cannot call a class as a function")
}! function(ee, oe, te) {
    var ae = new(function() {
            function so() {
                _classCallCheck(this, so), this._001268 = "HSLOv4-"
            }
            return _createClass(so, [{
                key: "get",
                value: function(co, mo) {
                    var go = JSON.parse(localStorage.getItem(this._001268 + co));
                    return null !== go && void 0 !== go[mo] && go[mo]
                }
            }, {
                key: "set",
                value: function(co, mo, go) {
                    var uo = JSON.parse(localStorage.getItem(this._001268 + co));
                    null === uo && (uo = {}), uo[mo] = go, localStorage.setItem(this._001268 + co, JSON.stringify(uo))
                }
            }]), so
        }()),
        ne = function so() {
            var co = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0,
                mo = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
            _classCallCheck(this, so), this.x = co, this.y = mo
        },
        le = function() {
            function so() {
                0 < arguments.length && void 0 !== arguments[0] && arguments[0], 1 < arguments.length && void 0 !== arguments[1] && arguments[1], 2 < arguments.length && void 0 !== arguments[2] && arguments[2], _classCallCheck(this, so), this.r = 0, this.g = 0, this.b = 0, this.hex = "#000000"
            }
            return _createClass(so, [{
                key: "set",
                value: function(co, mo, go) {
                    this.r = co, this.g = mo, this.b = go, this.hex = "#" + (16777216 + (co << 16) + (mo << 8) + go).toString(16).slice(1)
                }
            }]), so
        }(),
        ie = new function so() {
            _classCallCheck(this, so), this._001267 = ne, this._001266 = new ne, this._001265 = le
        },
        _e = function() {
            function so(co) {
                var mo = this;
                _classCallCheck(this, so), this._001264 = co, this._001263 = 30, this._001262 = 0, ee.requestAnimationFrame(function(go) {
                    mo._000867(go)
                })
            }
            return _createClass(so, [{
                key: "_000867",
                value: function(co) {
                    var mo = this;
                    ee.requestAnimationFrame(function(go) {
                        mo._000867(go)
                    }), this._001261(co), this._001264()
                }
            }, {
                key: "_001261",
                value: function(co) {
                    var mo = co - this._001262;
                    this._001262 = co, .05 > Math.abs(1e3 / 30 - mo) ? this._001263 = 30 : .05 > Math.abs(1e3 / 60 - mo) ? this._001263 = 60 : .05 > Math.abs(1e3 / 75 - mo) ? this._001263 = 75 : .05 > Math.abs(10 - mo) ? this._001263 = 100 : .05 > Math.abs(1e3 / 120 - mo) ? this._001263 = 120 : .05 > Math.abs(1e3 / 144 - mo) && (this._001263 = 144)
                }
            }, {
                key: "_001260",
                get: function() {
                    return 1e3 / this._001263
                }
            }]), so
        }(),
        re = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this.default = "EN", this.supported = ["EN", "JA", "ZH", "KO", "ES"]
                }
            }, {
                key: "change",
                value: function() {
                    for (var co = oe("[Hstr]"), mo = 0; mo < co.length; mo++) this._001258(oe(co[mo]))
                }
            }, {
                key: "_001258",
                value: function(co) {
                    var mo = co.attr("Hstr").split("."),
                        go = ee["lang_" + this._001257] || ee.lang_EN,
                        uo = mo[0],
                        ko = mo[1],
                        po = mo[2];
                    go[ko] && go[ko][po] || (go = ee["lang_" + this.default]), "html" === uo ? co.html(go[ko][po]) : "placeholder" === uo && co.attr(uo, go[ko][po])
                }
            }, {
                key: "_001257",
                get: function() {
                    return se.language
                }
            }, {
                key: "_001256",
                get: function() {
                    return ee["lang_" + this._001257]
                }
            }, {
                key: "_001255",
                get: function() {
                    var co = ee.navigator.language.toUpperCase(),
                        mo = co.indexOf("-") ? co.split("-")[0] : co;
                    return 0 <= this.supported.indexOf(mo) ? mo : this.default
                }
            }]), so
        }();
    ee.lang_EN = {
        mainMenu: {
            btn_settings: "Settings",
            btn_play: "Play",
            btn_spectate: "Spectate",
            btn_inputs: "Inputs",
            btn_theme: "Theme",
            input_tag1: "Tag",
            input_tag2: "Tag 2",
            input_nick: "Nick",
            input_skinUrl: "Skin URL (imgur)",
            select_ffa: "FFA",
            select_party: "Party",
            select_teams: "Teams",
            select_experimental: "Experimental",
            input_token: "Party token",
            btn_join: "Join",
            btn_create: "Create"
        },
        notif: {
            cantPlay2Tag: "You can't play in double tag mode.",
            hsloNetConn: "Connected to HSLO Networks.",
            hsloNetDisconn: "Disconnected from HSLO networks.",
            invalidSkinUrl: "Invalid skin URL",
            login_lastSession: "Logged in from last session data.",
            sdk_error: "SDK not loaded",
            alreadyLoggedIn: "Already logged in.",
            login_success: "Logged in",
            login_error: "Login error!",
            logout: "Logged out",
            nickChangeInGame: "You can't change nick while in game.",
            targeting_on: "Click a cell to begin targeting it. See instructions in mouse settings menu.",
            targeting_off: "Targeting is turned off. Turn it on in settings menu in order to use it.",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "MuBox"
        },
        huds: {
            enterChatMsg: "Enter chat message...",
            teamlist_title: "Team Players",
            _001151: "Score",
            num1position: "#1 position",
            _001146: "Paused",
            targeting_bigCellVp: "BIGGEST CELL VIEWPORT",
            targeting_followVp: "VIEWPORT FOLLOWING MOUSE",
            targeting_totalMass: "TOTAL MASS",
            targeting_players: "TARGETING PLAYERS"
        },
        settingMenu: {
            language: "Language",
            CellAnimation: "Animation delay",
            zoomSpeed: "Zoom speed",
            cameraSpeed: "Camera speed [2 default]",
            eatAnimation: "Cell eat [sucking] animation",
            autoZoom: "Auto zoom",
            cellTextAnimation: "Cell text animation",
            autoHideText: "Auto hide text",
            hideOwnNick: "Hide own nick",
            hideOwnMass: "Hide own mass",
            cellNick: "Cell nick",
            cellMass: "Cell mass",
            nickShadow: "Nick shadow",
            massShadow: "Mass shadow",
            urlSkins: "URL skins",
            hsloSkins: "HSLO skins",
            food: "Food",
            vanillaGrid: "Vanilla grid",
            bgSectors: "Background sectors",
            cursorLine: "Cursor lines",
            opponentRings: "Opponent rings",
            splitRings: "Split rings",
            virusRange: "Viruses range",
            teamIndicator: "Teammate indicator",
            commander: "Commander",
            chatType: "Chat type",
            targeting: "Cell Targeting [Spectate mode]",
            sounds: "Sounds",
            opt_on: "On",
            opt_off: "Off",
            opt_stepped: "Stepped",
            opt_linear: "Linear",
            opt_shortened: "Shortened",
            opt_full: "Full",
            opt_nick: "Nick",
            opt_mass: "Mass",
            opt_both: "Nick + Mass",
            opt_perf: "Performance",
            opt_normal: "Normal",
            opt_urlSkin: "Url skins",
            opt_hsloSkin: "Hslo skins",
            opt_allSkin: "All skins",
            opt_singleClr: "Mono colored",
            opt_rainbow: "Rainbow",
            opt_onlyLines: "Only lines",
            opt_snowflakes: "Snowflakes",
            opt_chatroom: "Chatroom",
            opt_popup: "Pop up chat"
        },
        hkMenu: {
            title: "Hotkeys",
            toggleMenuKey: "Toggle main menu",
            feedKey: "Feed",
            macroFeedKey: "Macro feed",
            splitKey: "Split",
            doubleSplitKey: "Double split",
            split16Key: "Split 16",
            stopKey: "Stop cell movement",
            chatKey: "Toggle chat",
            freeSpectateKey: "Toggle spectate mode",
            toggleSplitRings: "Toggle split rings",
            toggleOpponentRings: "Toggle opponent rings",
            toggleNick: "Toggle cell nick",
            toggleMass: "Toggle cell mass",
            toggleSkin: "Toggle skin",
            toggleFood: "Toggle food",
            respawnKey: "Quick respawn",
            command0Key: "Command 0",
            command1Key: "Command 1",
            command2Key: "Command 2",
            command3Key: "Command 3",
            command4Key: "Command 4",
            command5Key: "Command 5",
            command6Key: "Command 6",
            command7Key: "Command 7",
            command8Key: "Command 8",
            command9Key: "Command 9",
            zoom1key: "Zoom level 1",
            zoom2key: "Zoom level 2",
            zoom3key: "Zoom level 3",
            zoom4key: "Zoom level 4",
            zoom5key: "Zoom level 5"
        },
        mouseMenu: {
            title: "Mouse",
            feed: "Feed",
            macroFeed: "Macro feed",
            split: "Split",
            doubleSplit: "Double split",
            split16: "Split 16",
            commander: "Commander",
            off: "Off",
            lmb: "Left click",
            rmb: "Right click",
            scroll: "Middle click",
            targeting_h1: "Targeting",
            targeting_txt1: "Lock target 1",
            targeting_txt2: "Lock target 2",
            targeting_txt3: "Middle click or Toggle spectate key",
            targeting_txt4: "Toggle top cell mode to follow mouse mode",
            targeting_txt5: "Toggle targeting mode to follow mouse mode",
            targeting_txt6: "Toggle follow mouse mode to top cell mode"
        },
        commandsMenu: {
            title: "Commands",
            command0: "Fuck!",
            command1: "Feed Me!",
            command2: "Split into me!",
            command3: "Need backup at %sector%!",
            command4: "Enemy spotted at %sector%!",
            command5: "Need a teammate!",
            command6: "Tank the virus!",
            command7: "Eat the virus!",
            command8: "Let's bait!",
            command9: "Fake tricksplit!"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "Cursor",
            lbSize: "Leaderboard size",
            chatFontSize: "Chat font size",
            minimapSize: "Minimap size",
            skinBorder: "Skin border",
            cellTransparency: "Cell transparency",
            lightenCellColor: "Lighten cell color",
            borderColor: "Border color",
            borderWidth: "Border width",
            gridColor: "Grid color",
            gridTextColor: "Grid text color",
            gridTextSize: "Grid text size",
            gridTextFont: "Grid text font",
            gridWidth: "Grid width",
            nickColor: "Nick color",
            nickStrokeColor: "Nick stroke color",
            cellNickSize: "Nick size",
            nickFont: "Nick font",
            massColor: "Mass color",
            massStrokeColor: "Mass stroke color",
            cellMassSize: "Mass size",
            massFont: "Mass font",
            foodColor: "Food color",
            foodSize: "Food size",
            virusColor: "Virus color",
            virusBorderColor: "Virus border color",
            virusBorderWidth: "virus border width",
            virusDecor: "Virus Decoration",
            backgroundColor: "Background color",
            commanderColor: "Commander color",
            indicatorSize: "Teammate indicator size",
            team1color: "Team 1 color [Double Tag Mode]",
            team2color: "Team 2 color [Double Tag Mode]",
            on: "On",
            off: "Off"
        }
    }, ee.lang_JA = {
        mainMenu: {
            btn_settings: "\u8A2D\u5B9A",
            btn_play: "\u30D7\u30EC\u30FC",
            btn_spectate: "\u89B3\u6226",
            btn_inputs: "\u30A4\u30F3\u30D7\u30C3\u30C8",
            btn_theme: "\u30C6\u30FC\u30DE",
            input_tag1: "\u30BF\u30B0",
            input_tag2: "\u30BF\u30B02",
            input_nick: "\u540D\u524D",
            input_skinUrl: "\u30B9\u30AD\u30F3URL (imgur)",
            select_ffa: "FFA",
            select_party: "\u30D1\u30FC\u30C6\u30A3\u30FC",
            select_teams: "\u30C1\u30FC\u30E0",
            select_experimental: "\u30A8\u30AF\u30B9\u30DA\u30EA\u30E1\u30F3\u30BF\u30EB",
            input_token: "\u30C8\u30FC\u30AF\u30F3",
            btn_join: "\u53C2\u52A0",
            btn_create: "\u4F5C\u6210"
        },
        notif: {
            cantPlay2Tag: "\u30C0\u30D6\u30EB\u30BF\u30B0\u30E2\u30FC\u30C9\u3067\u306F\u30D7\u30EC\u30FC\u3059\u308B\u3053\u3068\u304C\u3067\u304D\u307E\u305B\u3093\u3002",
            hsloNetConn: "HSLO\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u306B\u63A5\u7D9A\u3057\u307E\u3057\u305F\u3002",
            hsloNetDisconn: "HSLO\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u304B\u3089\u5207\u65AD\u3057\u307E\u3057\u305F\u3002",
            invalidSkinUrl: "\u7121\u52B9\u306AURL\u3067\u3059\u3002",
            login_lastSession: "\u6700\u5F8C\u306E\u30BB\u30C3\u30B7\u30E7\u30F3\u304B\u3089\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u3002",
            sdk_error: "SDK\u304C\u8AAD\u307F\u8FBC\u307E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
            alreadyLoggedIn: "\u65E2\u306B\u30ED\u30B0\u30A4\u30F3\u3055\u308C\u3066\u3044\u307E\u3059\u3002",
            login_success: "\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u3002",
            login_error: "\u30ED\u30B0\u30A4\u30F3\u30A8\u30E9\u30FC\uFF01",
            logout: "\u30ED\u30B0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002",
            nickChangeInGame: "\u30D7\u30EC\u30FC\u4E2D\u306B\u540D\u524D\u3092\u5909\u66F4\u3059\u308B\u3053\u3068\u306F\u3067\u304D\u307E\u305B\u3093\u3002",
            targeting_on: "\u30DE\u30A6\u30B9\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u30BF\u30FC\u30B2\u30C3\u30C8\u3092\u59CB\u3081\u307E\u3059\u3002\u30DE\u30A6\u30B9\u8A2D\u5B9A\u30E1\u30CB\u30E5\u30FC\u306E\u89E3\u8AAC\u3092\u53C2\u7167\u3002",
            targeting_off: "\u30BF\u30FC\u30B2\u30C3\u30C8\u304C\u30AA\u30D5\u306B\u306A\u308A\u307E\u3057\u305F\u3002\u4F7F\u7528\u3059\u308B\u306B\u306F\u8A2D\u5B9A\u30E1\u30CB\u30E5\u30FC\u304B\u3089\u30AA\u30F3\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "MuBox"
        },
        huds: {
            enterChatMsg: "\u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u9001\u4FE1...",
            teamlist_title: "\u30C1\u30FC\u30E0\u30D7\u30EC\u30FC\u30E4\u30FC",
            _001151: "\u30B9\u30B3\u30A2",
            num1position: "1\u4F4D\u306E\u4F4D\u7F6E",
            _001146: "\u9759\u6B62",
            targeting_bigCellVp: "1\u4F4D\u8996\u70B9",
            targeting_followVp: "\u30DE\u30A6\u30B9\u8996\u70B9",
            targeting_totalMass: "\u5408\u8A08\u30DE\u30B9",
            targeting_players: "\u30BF\u30FC\u30B2\u30C3\u30C8\u30D7\u30EC\u30FC\u30E4\u30FC"
        },
        settingMenu: {
            language: "\u8A00\u8A9E",
            CellAnimation: "\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3\u30C7\u30A3\u30EC\u30A4",
            zoomSpeed: "\u30BA\u30FC\u30E0\u901F\u5EA6",
            cameraSpeed: "\u30AB\u30E1\u30E9\u901F\u5EA6 [2 \u30C7\u30D5\u30A9\u30EB\u30C8]",
            eatAnimation: "\u7D30\u80DE\u6355\u98DF [\u98F2\u307F\u8FBC\u3080] \u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3",
            autoZoom: "\u30AA\u30FC\u30C8\u30BA\u30FC\u30E0",
            cellTextAnimation: "\u7D30\u80DE\u306E\u30C6\u30AD\u30B9\u30C8\u30A2\u30CB\u30E1\u30FC\u30B7\u30E7\u30F3",
            autoHideText: "\u81EA\u52D5\u3067\u30C6\u30AD\u30B9\u30C8\u3092\u96A0\u3059",
            hideOwnNick: "Hide own nick",
            hideOwnMass: "Hide own mass",
            cellNick: "\u7D30\u80DE\u306E\u540D\u524D",
            cellMass: "\u7D30\u80DE\u306E\u30DE\u30B9",
            nickShadow: "\u5F71 [\u7D30\u80DE\u306E\u540D\u524D]",
            massShadow: "\u5F71 [\u7D30\u80DE\u306E\u30DE\u30B9]",
            urlSkins: "URL\u30B9\u30AD\u30F3",
            hsloSkins: "HSLO\u30B9\u30AD\u30F3",
            food: "\u7C92",
            vanillaGrid: "\u30D0\u30CB\u30E9\u30B0\u30EA\u30C3\u30C9",
            bgSectors: "\u5EA7\u6A19",
            cursorLine: "\u30AB\u30FC\u30BD\u30EB\u30E9\u30A4\u30F3",
            opponentRings: "\u6355\u98DF\u5224\u5B9A\u30EA\u30F3\u30B0",
            splitRings: "Split rings",
            virusRange: "\u68D8\u7BC4\u56F2",
            teamIndicator: "\u30C1\u30FC\u30E0\u30E1\u30A4\u30C8\u30A4\u30F3\u30B8\u30B1\u30FC\u30BF\u30FC",
            commander: "\u30B3\u30DE\u30F3\u30C0\u30FC",
            chatType: "\u30C1\u30E3\u30C3\u30C8\u30BF\u30A4\u30D7",
            targeting: "\u30BF\u30FC\u30B2\u30C3\u30C8 [\u89B3\u6226\u30E2\u30FC\u30C9]",
            sounds: "\u30B5\u30A6\u30F3\u30C9",
            opt_on: "\u30AA\u30F3",
            opt_off: "\u30AA\u30D5",
            opt_stepped: "\u30B9\u30C6\u30C3\u30D7",
            opt_shortened: "\u77ED\u7E2E",
            opt_linear: "\u30EA\u30CB\u30A2",
            opt_full: "\u30D5\u30EB",
            opt_nick: "\u540D\u524D",
            opt_mass: "\u30DE\u30B9",
            opt_both: "\u540D\u524D + \u30DE\u30B9",
            opt_perf: "\u30D1\u30D5\u30A9\u30FC\u30DE\u30F3\u30B9",
            opt_normal: "\u30CE\u30FC\u30DE\u30EB",
            opt_urlSkin: "URL\u30B9\u30AD\u30F3",
            opt_hsloSkin: "Hslo\u30B9\u30AD\u30F3",
            opt_allSkin: "\u5168\u30B9\u30AD\u30F3",
            opt_singleClr: "\u5358\u8272",
            opt_rainbow: "\u30EC\u30A4\u30F3\u30DC\u30FC",
            opt_onlyLines: "\u7DDA\u306E\u307F",
            opt_snowflakes: "\u30B9\u30CE\u30FC\u30D5\u30EC\u30FC\u30AF",
            opt_chatroom: "\u30C1\u30E3\u30C3\u30C8\u30EB\u30FC\u30E0",
            opt_popup: "\u30DD\u30C3\u30D7\u30A2\u30C3\u30D7\u30C1\u30E3\u30C3\u30C8"
        },
        hkMenu: {
            title: "\u30DB\u30C3\u30C8\u30AD\u30FC",
            toggleMenuKey: "\u30E1\u30A4\u30F3\u30E1\u30CB\u30E5\u30FC\u5207\u308A\u66FF\u3048",
            feedKey: "\u990C",
            macroFeedKey: "\u990C\u30DE\u30AF\u30ED",
            splitKey: "\u5206\u88C2",
            doubleSplitKey: "\u30C0\u30D6\u30EB\u5206\u88C2",
            split16Key: "16\u5206\u88C2",
            stopKey: "\u9759\u6B62",
            chatKey: "\u30C1\u30E3\u30C3\u30C8\u5207\u308A\u66FF\u3048",
            freeSpectateKey: "\u89B3\u6226\u30E2\u30FC\u30C9\u5207\u308A\u66FF\u3048",
            toggleSplitRings: "Toggle split rings",
            toggleOpponentRings: "Toggle opponent rings",
            toggleNick: "\u540D\u524D\u8868\u793A\u5207\u308A\u66FF\u3048",
            toggleMass: "\u30DE\u30B9\u8868\u793A\u5207\u308A\u66FF\u3048",
            toggleSkin: "\u30B9\u30AD\u30F3\u8868\u793A\u5207\u308A\u66FF\u3048",
            toggleFood: "\u990C\u8868\u793A\u5207\u308A\u66FF\u3048",
            respawnKey: "\u30AF\u30A4\u30C3\u30AF\u30EA\u30B9\u30DD\u30FC\u30F3",
            command0Key: "\u30B3\u30DE\u30F3\u30C90",
            command1Key: "\u30B3\u30DE\u30F3\u30C91",
            command2Key: "\u30B3\u30DE\u30F3\u30C92",
            command3Key: "\u30B3\u30DE\u30F3\u30C93",
            command4Key: "\u30B3\u30DE\u30F3\u30C94",
            command5Key: "\u30B3\u30DE\u30F3\u30C95",
            command6Key: "\u30B3\u30DE\u30F3\u30C96",
            command7Key: "\u30B3\u30DE\u30F3\u30C97",
            command8Key: "\u30B3\u30DE\u30F3\u30C98",
            command9Key: "\u30B3\u30DE\u30F3\u30C99",
            zoom1key: "\u30BA\u30FC\u30E0\u30EC\u30D9\u30EB1",
            zoom2key: "\u30BA\u30FC\u30E0\u30EC\u30D9\u30EB2",
            zoom3key: "\u30BA\u30FC\u30E0\u30EC\u30D9\u30EB3",
            zoom4key: "\u30BA\u30FC\u30E0\u30EC\u30D9\u30EB4",
            zoom5key: "\u30BA\u30FC\u30E0\u30EC\u30D9\u30EB5"
        },
        mouseMenu: {
            title: "\u30DE\u30A6\u30B9",
            feed: "\u990C",
            macroFeed: "\u990C\u30DE\u30AF\u30ED",
            split: "\u5206\u88C2",
            doubleSplit: "\u30C0\u30D6\u30EB\u5206\u88C2",
            split16: "16\u5206\u88C2",
            commander: "\u30B3\u30DE\u30F3\u30C0\u30FC",
            off: "\u30AA\u30D5",
            lmb: "\u5DE6\u30AF\u30EA\u30C3\u30AF",
            rmb: "\u53F3\u30AF\u30EA\u30C3\u30AF",
            scroll: "\u30B9\u30AF\u30ED\u30FC\u30EB\u30AF\u30EA\u30C3\u30AF",
            targeting_h1: "\u30BF\u30FC\u30B2\u30C3\u30C8",
            targeting_txt1: "\u30BF\u30FC\u30B2\u30C3\u30C8\u30ED\u30C3\u30AF1",
            targeting_txt2: "\u30BF\u30FC\u30B2\u30C3\u30C8\u30ED\u30C3\u30AF2",
            targeting_txt3: "\u30B9\u30AF\u30ED\u30FC\u30EB\u30AF\u30EA\u30C3\u30AF or \u89B3\u6226\u30AD\u30FC\u5207\u308A\u66FF\u3048",
            targeting_txt4: "\u30C8\u30C3\u30D7\u30BB\u30EB\u30E2\u30FC\u30C9\u304B\u3089\u30DE\u30A6\u30B9\u8FFD\u8DE1\u306B\u5207\u308A\u66FF\u3048",
            targeting_txt5: "\u30BF\u30FC\u30B2\u30C3\u30C8\u30E2\u30FC\u30C9\u304B\u3089\u30DE\u30A6\u30B9\u8FFD\u8DE1\u306B\u5207\u308A\u66FF\u3048",
            targeting_txt6: "\u30DE\u30A6\u30B9\u8FFD\u8DE1\u304B\u3089\u30C8\u30C3\u30D7\u30BB\u30EB\u30E2\u30FC\u30C9\u306B\u5207\u308A\u66FF\u3048"
        },
        commandsMenu: {
            title: "\u30B3\u30DE\u30F3\u30C9",
            command0: "Fuck!",
            command1: "Feed Me!",
            command2: "Split into me!",
            command3: "Need backup at %sector%!",
            command4: "Enemy spotted at %sector%!",
            command5: "Need a teammate!",
            command6: "Tank the virus!",
            command7: "Eat the virus!",
            command8: "Let's bait!",
            command9: "Fake tricksplit!"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "\u30AB\u30FC\u30BD\u30EB",
            lbSize: "\u30EA\u30FC\u30C0\u30FC\u30DC\u30FC\u30C9\u306E\u5927\u304D\u3055",
            chatFontSize: "Chat font size",
            minimapSize: "\u30DF\u30CB\u30DE\u30C3\u30D7\u306E\u5927\u304D\u3055",
            skinBorder: "\u30B9\u30AD\u30F3\u306E\u5883\u754C\u7DDA",
            cellTransparency: "\u7D30\u80DE\u306E\u900F\u904E",
            lightenCellColor: "\u7D30\u80DE\u8272\u306E\u8EFD\u6E1B",
            borderColor: "\u5883\u754C\u7DDA\u306E\u8272",
            borderWidth: "\u5883\u754C\u7DDA\u306E\u6A2A\u5E45",
            gridColor: "\u30B0\u30EA\u30C3\u30C9\u30AB\u30E9\u30FC",
            gridTextColor: "\u30B0\u30EA\u30C3\u30C9\u30C6\u30AD\u30B9\u30C8\u30AB\u30E9\u30FC",
            gridTextSize: "\u30B0\u30EA\u30C3\u30C9\u30C6\u30AD\u30B9\u30C8\u30B5\u30A4\u30BA",
            gridTextFont: "\u30B0\u30EA\u30C3\u30C9\u30C6\u30AD\u30B9\u30C8\u30D5\u30A9\u30F3\u30C8",
            gridWidth: "\u30B0\u30EA\u30C3\u30C9\u306E\u6A2A\u5E45",
            nickColor: "\u540D\u524D\u306E\u8272",
            nickStrokeColor: "\u540D\u524D\u306E\u5F71\u306E\u8272",
            cellNickSize: "\u540D\u524D\u306E\u5927\u304D\u3055",
            nickFont: "\u540D\u524D\u306E\u30D5\u30A9\u30F3\u30C8",
            massColor: "\u30DE\u30B9\u306E\u8272",
            massStrokeColor: "\u30DE\u30B9\u306E\u5F71\u306E\u8272",
            cellMassSize: "\u30DE\u30B9\u306E\u5927\u304D\u3055",
            massFont: "\u30DE\u30B9\u306E\u30D5\u30A9\u30F3\u30C8",
            foodColor: "\u30D5\u30A9\u30F3\u30C8\u306E\u8272",
            foodSize: "\u7C92\u306E\u5927\u304D\u3055",
            virusColor: "\u68D8\u306E\u8272",
            virusBorderColor: "\u68D8\u306E\u67A0\u8272",
            virusBorderWidth: "\u68D8\u306E\u5883\u754C\u7DDA\u306E\u6A2A\u5E45",
            virusDecor: "\u68D8\u306E\u88C5\u98FE",
            backgroundColor: "\u80CC\u666F\u8272",
            commanderColor: "\u30B3\u30DE\u30F3\u30C0\u30FC\u306E\u8272",
            indicatorSize: "\uFF81\uFF70\uFF91\uFF92\uFF72\uFF84\uFF72\uFF9D\uFF7C\uFF9E\uFF79\uFF70\uFF80\uFF70\u306E\u5927\u304D\u3055",
            team1color: "\u30C1\u30FC\u30E01\u306E\u8272 [\u30C0\u30D6\u30EB\u30BF\u30B0\u30E2\u30FC\u30C9]",
            team2color: "\u30C1\u30FC\u30E02\u306E\u8272 [\u30C0\u30D6\u30EB\u30BF\u30B0\u30E2\u30FC\u30C9]",
            on: "\u30AA\u30F3",
            off: "\u30AA\u30D5"
        }
    }, ee.lang_ZH = {
        mainMenu: {
            btn_settings: "\u8A2D\u5B9A",
            btn_play: "\u904A\u73A9",
            btn_spectate: "\u89C0\u6230",
            btn_inputs: "\u8F38\u5165",
            btn_theme: "\u4E3B\u984C",
            input_tag1: "\u968A\u4F0D\u4E00",
            input_tag2: "\u968A\u4F0D\u4E8C",
            input_nick: "\u66B1\u7A31",
            input_skinUrl: "\u76AE\u819A\u7DB2\u5740 (imgur)",
            select_ffa: "FFA",
            select_party: "Party",
            select_teams: "Teams",
            select_experimental: "Experimental",
            input_token: "Party\u4EE3\u78BC",
            btn_join: "\u52A0\u5165",
            btn_create: "\u5275\u5EFA"
        },
        notif: {
            cantPlay2Tag: "\u4E0D\u80FD\u7528\u96D9\u91CD\u968A\u4F0D",
            hsloNetConn: "\u9023\u63A5HSLO\u7DB2\u7D61",
            hsloNetDisconn: "\u65B7\u958BHSLO\u7DB2\u7D61",
            invalidSkinUrl: "\u4E0D\u7576\u76AE\u819A\u7DB2\u5740",
            login_lastSession: "\u4EE5\u4E0A\u6B21\u8CC7\u8A0A\u767B\u5165",
            sdk_error: "SDK\u672A\u8F09\u5165",
            alreadyLoggedIn: "\u5DF2\u7D93\u767B\u5165",
            login_success: "\u767B\u5165\u6210\u529F",
            login_error: "\u767B\u5165\u932F\u8AA4",
            logout: "\u767B\u51FA",
            nickChangeInGame: "\u4E0D\u80FD\u5728\u904A\u6232\u4E2D\u66F4\u6539\u66B1\u7A31.",
            targeting_on: "\u9078\u53D6\u4E00\u7D30\u80DE\u8FFD\u8E64\u3002\u8A73\u770B\u6ED1\u9F20\u8A2D\u5B9A\u4ECB\u9762\u7684\u6307\u5F15",
            targeting_off: "\u81EA\u52D5\u8FFD\u8E64\u6A21\u5F0F\u5DF2\u95DC\u9589\uFF0C\u5982\u8981\u4F7F\u7528\u8ACB\u5728\u8A2D\u5B9A\u4ECB\u9762\u958B\u555F",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "MuBox"
        },
        huds: {
            enterChatMsg: "\u804A\u5929\u8F38\u5165\u4E2D\u2026\u2026",
            teamlist_title: "\u968A\u4F0D\u73A9\u5BB6",
            _001151: "\u5206\u6578",
            num1position: "\u7B2C\u4E00\u4F4D\u7F6E",
            _001146: "\u66AB\u505C",
            targeting_bigCellVp: "\u6700\u5927\u73A9\u5BB6\u8996\u91CE",
            targeting_followVp: "\u6ED1\u9F20\u8DDF\u96A8\u8996\u91CE",
            targeting_totalMass: "\u7E3D\u8CEA\u91CF",
            targeting_players: "\u8FFD\u8E64\u73A9\u5BB6\u4E2D"
        },
        settingMenu: {
            language: "\u8A9E\u8A00",
            CellAnimation: "\u52D5\u756B\u5EF6\u9072",
            zoomSpeed: "\u8B8A\u7126\u901F\u5EA6",
            cameraSpeed: "\u93E1\u982D\u901F\u5EA6\uFF3B\u9810\u8A2D\u4E8C\uFF3D",
            eatAnimation: "\u9032\u98DF\u52D5\u756B\uFF3B\u5438\u5165\uFF3D",
            autoZoom: "\u81EA\u52D5\u8B8A\u7126",
            cellTextAnimation: "\u7D30\u80DE\u6587\u5B57\u52D5\u756B",
            autoHideText: "\u81EA\u52D5\u96B1\u85CF\u6587\u5B57",
            hideOwnNick: "\u4E0D\u986F\u793A\u81EA\u5DF1\u8CEA\u91CF",
            hideOwnMass: "\u4E0D\u986F\u793A\u81EA\u5DF1\u59D3\u540D",
            cellNick: "\u7D30\u80DE\u66B1\u7A31",
            cellMass: "\u7D30\u80DE\u8CEA\u91CF",
            nickShadow: "\u9670\u5F71 [\u7D30\u80DE\u66B1\u7A31]",
            massShadow: "\u9670\u5F71 [\u7D30\u80DE\u8CEA\u91CF]",
            urlSkins: "\u76AE\u819A\u7DB2\u5740",
            hsloSkins: "HSLO\u76AE\u819A",
            food: "\u98DF\u7269",
            vanillaGrid: "\u539F\u751F\u683C\u7DB2",
            bgSectors: "\u80CC\u666F\u5340\u9593",
            cursorLine: "\u5C0E\u5F15\u7DDA",
            opponentRings: "\u8B8A\u8272\u74B0",
            splitRings: "\u5206\u88C2\u8DDD\u96E2\u5708",
            virusRange: "\u523A\u7403\u8DDD\u96E2",
            teamIndicator: "\u968A\u4F0D\u6A19\u793A",
            commander: "\u6307\u63EE",
            chatType: "\u804A\u5929\u6A23\u5F0F",
            targeting: "\u73A9\u5BB6\u8FFD\u8E64\u4E2D [\u89C0\u6230\u6A21\u5F0F]",
            sounds: "\u8072\u97F3",
            opt_on: "\u958B",
            opt_off: "\u95DC",
            opt_stepped: "\u968E\u8E8D\u5F0F",
            opt_linear: "\u7DDA\u6027",
            opt_shortened: "\u7C21\u77ED\u5316",
            opt_full: "\u5168\u90E8",
            opt_nick: "\u66B1\u7A31",
            opt_mass: "\u8CEA\u91CF",
            opt_both: "\u66B1\u7A31\u53CA\u8CEA\u91CF",
            opt_perf: "\u6548\u80FD",
            opt_normal: "\u4E00\u822C",
            opt_urlSkin: "\u76AE\u819A\u7DB2\u5740",
            opt_hsloSkin: "HSLO\u76AE\u819A",
            opt_allSkin: "\u5168\u90E8\u76AE\u819A",
            opt_singleClr: "\u55AE\u8272",
            opt_rainbow: "\u5F69\u8272",
            opt_onlyLines: "\u53EA\u6709\u7DDA\u689D",
            opt_snowflakes: "\u96EA\u82B1",
            opt_chatroom: "\u804A\u5929\u6B04",
            opt_popup: "\u5F48\u51FA\u901A\u77E5"
        },
        hkMenu: {
            title: "\u71B1\u9375",
            toggleMenuKey: "\u5207\u63DB\u4E3B\u9078\u55AE",
            feedKey: "\u55AE\u6B21\u9935\u990A",
            macroFeedKey: "\u6301\u7E8C\u9935\u990A",
            splitKey: "\u5206\u88C2",
            doubleSplitKey: "\u96D9\u91CD\u5206\u88C2",
            split16Key: "\u56DB\u91CD\u5206\u88C2",
            stopKey: "\u505C\u6B62\u79FB\u52D5",
            chatKey: "\u5207\u63DB\u804A\u5929",
            freeSpectateKey: "\u5207\u63DB\u89C0\u6230\u6A21\u5F0F",
            toggleSplitRings: "\u5207\u63DB\u5206\u88C2\u8DDD\u96E2\u5708",
            toggleOpponentRings: "\u5207\u63DB\u8B8A\u8272\u74B0",
            toggleNick: "\u5207\u63DB\u66B1\u7A31\u986F\u793A",
            toggleMass: "\u5207\u63DB\u8CEA\u91CF\u986F\u793A",
            toggleSkin: "\u5207\u63DB\u76AE\u819A\u986F\u793A",
            toggleFood: "\u5207\u63DB\u98DF\u7269\u986F\u793A",
            respawnKey: "\u5FEB\u901F\u91CD\u751F",
            command0Key: "\u6307\u4EE4\uFF10",
            command1Key: "\u6307\u4EE4\uFF11",
            command2Key: "\u6307\u4EE4\uFF12",
            command3Key: "\u6307\u4EE4\uFF13",
            command4Key: "\u6307\u4EE4\uFF14",
            command5Key: "\u6307\u4EE4\uFF15",
            command6Key: "\u6307\u4EE4\uFF16",
            command7Key: "\u6307\u4EE4\uFF17",
            command8Key: "\u6307\u4EE4\uFF18",
            command9Key: "\u6307\u4EE4\uFF19",
            zoom1key: "\u8B8A\u7126\u7B49\u7D1A\u4E00",
            zoom2key: "\u8B8A\u7126\u7B49\u7D1A\u4E8C",
            zoom3key: "\u8B8A\u7126\u7B49\u7D1A\u4E09",
            zoom4key: "\u8B8A\u7126\u7B49\u7D1A\u56DB",
            zoom5key: "\u8B8A\u7126\u7B49\u7D1A\u4E94"
        },
        mouseMenu: {
            title: "\u6ED1\u9F20",
            feed: "\u55AE\u6B21\u9935\u990A",
            macroFeed: "\u6301\u7E8C\u9935\u990A",
            split: "\u55AE\u6B21\u5206\u88C2",
            doubleSplit: "\u96D9\u91CD\u5206\u88C2",
            split16: "\u56DB\u91CD\u5206\u88C2",
            commander: "\u6307\u63EE",
            off: "\u95DC",
            lmb: "\u5DE6\u9375",
            rmb: "\u53F3\u9375",
            scroll: "\u6EFE\u8F2A\u9375",
            targeting_h1: "\u8FFD\u8E64\u4E2D",
            targeting_txt1: "\u9396\u5B9A\u76EE\u6A19\u4E00",
            targeting_txt2: "\u9396\u5B9A\u76EE\u6A19\u4E8C",
            targeting_txt3: "\u6EFE\u8F2A\u9375\u6216\u5207\u63DB\u89C0\u6230\u9375",
            targeting_txt4: "\u5207\u63DB\u6700\u5927\u73A9\u5BB6\u6A21\u5F0F\u8207\u6ED1\u9F20\u8DDF\u96A8\u6A21\u5F0F",
            targeting_txt5: "\u5207\u63DB\u81EA\u52D5\u8FFD\u8E64\u6A21\u5F0F\u8207\u6ED1\u9F20\u8DDF\u96A8\u6A21\u5F0F",
            targeting_txt6: "\u5207\u63DB\u6ED1\u9F20\u8DDF\u96A8\u6A21\u5F0F\u8207\u6700\u5927\u73A9\u5BB6\u6A21\u5F0F"
        },
        commandsMenu: {
            title: "\u6307\u4EE4",
            command0: "\u64CD\u4F60\u5ABD\uFF01",
            command1: "\u9935\u6211\uFF01",
            command2: "\u79D2\u7A7A\u7D66\u6211\uFF01",
            command3: "%sector%\u9700\u8981\u652F\u63F4\uFF01",
            command4: "%sector%\u767C\u73FE\u6575\u4EBA\uFF01",
            command5: "\u4F86\u500B\u968A\u53CB\uFF01",
            command6: "\u64CB\u523A\uFF01",
            command7: "\u5403\u6389\u523A",
            command8: "\u4F86\u9A19\u4ED6\uFF01",
            command9: "\u88DD\u7206\u7A7A\u9A19\u4ED6\uFF01"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "\u9F20\u6A19",
            lbSize: "\u6392\u884C\u699C\u5927\u5C0F",
            chatFontSize: "\u804A\u5929\u5BA4\u5B57\u9AD4\u5927\u5C0F",
            minimapSize: "\u5C0F\u5730\u5716\u5927\u5C0F",
            skinBorder: "\u76AE\u819A\u8F2A\u5ED3",
            cellTransparency: "\u7D30\u80DE\u900F\u660E\u5EA6",
            lightenCellColor: "\u5149\u4EAE\u7D30\u80DE\u984F\u8272",
            borderColor: "\u5916\u570D\u984F\u8272",
            borderWidth: "\u5916\u570D\u95CA\u5EA6",
            gridColor: "\u5340\u9593\u984F\u8272",
            gridTextColor: "\u5340\u9593\u6587\u5B57\u984F\u8272",
            gridTextSize: "\u5340\u9593\u6587\u5B57\u5927\u5C0F",
            gridTextFont: "\u5340\u9593\u6587\u5B57\u5B57\u578B",
            gridWidth: "\u5340\u9593\u95CA\u5EA6",
            nickColor: "\u66B1\u7A31\u984F\u8272",
            nickStrokeColor: "\u66B1\u7A31\u8F2A\u5ED3\u984F\u8272",
            cellNickSize: "\u66B1\u7A31\u5927\u5C0F",
            nickFont: "\u66B1\u7A31\u5B57\u578B",
            massColor: "\u8CEA\u91CF\u8A0A\u606F\u984F\u8272",
            massStrokeColor: "\u8CEA\u91CF\u8A0A\u606F\u8F2A\u5ED3\u984F\u8272",
            cellMassSize: "\u8CEA\u91CF\u8A0A\u606F\u5927\u5C0F",
            massFont: "\u8CEA\u91CF\u8A0A\u606F\u5B57\u578B",
            foodColor: "\u98DF\u7269\u984F\u8272",
            foodSize: "\u98DF\u7269\u5927\u5C0F",
            virusColor: "\u523A\u7403\u984F\u8272",
            virusBorderColor: "\u523A\u7403\u5916\u6846\u984F\u8272",
            virusBorderWidth: "\u523A\u7403\u5916\u6846\u95CA\u5EA6",
            virusDecor: "\u523A\u7403\u88DD\u98FE",
            backgroundColor: "\u80CC\u666F\u984F\u8272",
            commanderColor: "\u6307\u4EE4\u984F\u8272",
            indicatorSize: "\u968A\u4F0D\u6A19\u793A\u984F\u8272",
            team1color: "\u968A\u4F0D\u4E00\u984F\u8272 [\u96D9\u968A\u4F0D\u6A21\u5F0F]",
            team2color: "\u968A\u4F0D\u4E8C\u984F\u8272 [\u96D9\u968A\u4F0D\u6A21\u5F0F]",
            on: "\u958B",
            off: "\u95DC"
        }
    }, ee.lang_KO = {
        mainMenu: {
            btn_settings: "\uD658\uACBD",
            btn_play: "\uD50C\uB808\uC774",
            btn_spectate: "\uAD00\uC804",
            btn_inputs: "\uD0A4\uBCF4\uB4DC",
            btn_theme: "\uD14C\uB9C8",
            input_tag1: "\uD0DC\uADF8",
            input_tag2: "\uD0DC\uADF8 2",
            input_nick: "\uB2C9\uB124\uC784",
            input_skinUrl: "\uC774\uBBF8\uC9C0 URL (imgur)",
            select_ffa: "FFA",
            select_party: "\uD30C\uD2F0",
            select_teams: "\uD300",
            select_experimental: "\uC775\uC2A4\uD398\uB9AC\uBA58\uD0C8",
            input_token: "\uD30C\uD2F0 \uCF54\uB4DC",
            btn_join: "\uC870\uC778",
            btn_create: "\uC0C8\uB85C\uACE0\uCE68"
        },
        notif: {
            cantPlay2Tag: "\uD0DC\uADF82 \uBAA8\uB4DC\uC5D0\uC11C\uB294 \uC2E4\uD589\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4..",
            hsloNetConn: "HSLO \uB124\uD2B8\uC6CC\uD06C\uC5D0 \uC5F0\uACB0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
            hsloNetDisconn: "HSLO \uB124\uD2B8\uC6CC\uD06C\uC5D0\uC11C \uC5F0\uACB0\uC774 \uB04A\uC5B4\uC84C\uC2B5\uB2C8\uB2E4.",
            invalidSkinUrl: "\uC798\uBABB\uB41C \uC2A4\uD0A8 URL",
            login_lastSession: "\uB9C8\uC9C0\uB9C9 \uC138\uC158 \uB370\uC774\uD130\uC5D0\uC11C \uB85C\uADF8\uC778\uD588\uC2B5\uB2C8\uB2E4..",
            sdk_error: "SDK\uAC00 \uB85C\uB4DC\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.",
            alreadyLoggedIn: "\uC774\uBBF8 \uB85C\uADF8\uC778 \uD588\uC2B5\uB2C8\uB2E4.",
            login_success: "\uB85C\uADF8\uC778",
            login_error: "\uB85C\uADF8\uC778 \uC624\uB958!",
            logout: "\uB85C\uADF8 \uC544\uC6C3 \uB428!",
            nickChangeInGame: "\uAC8C\uC784 \uC911 \uB2C9\uB124\uC784\uC744 \uBCC0\uACBD\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4..",
            targeting_on: "\uD0C0\uAC9F\uD305\uC744 \uC2DC\uC791\uD558\uB824\uBA74 \uC138\uD3EC\uB97C \uD074\uB9AD\uD558\uC2ED\uC2DC\uC624. \uB9C8\uC6B0\uC2A4 \uC124\uC815\uC5D0\uC11C \uBA54\uB274\uC758 \uC9C0\uCE68\uC744 \uCC38\uC870\uD558\uC2ED\uC2DC\uC694..",
            targeting_off: "\uD0C0\uAC9F\uD305\uC774 \uAEBC\uC838 \uC788\uC2B5\uB2C8\uB2E4. \uC124\uC815 \uBA54\uB274\uC5D0\uC11C \uC0AC\uC6A9\uD558\uB3C4\uB85D \uC124\uC815\uD558\uC2ED\uC2DC\uC694.",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "MuBox"
        },
        huds: {
            enterChatMsg: "\uCC44\uD305 \uBA54\uC138\uC9C0 \uC785\uB825...",
            teamlist_title: "\uD300 \uD50C\uB808\uC774\uC5B4",
            _001151: "\uC810\uC218",
            num1position: "#1\uB4F1 \uC704\uCE58",
            _001146: "\uC77C\uC2DC \uC911\uC9C0",
            targeting_bigCellVp: "\uAC00\uC7A5 \uD070 \uC138\uD3EC \uBAA9\uB85D",
            targeting_followVp: "\uB9C8\uC6B0\uC2A4 \uD0C0\uAC9F\uD305 \uC124\uC815",
            targeting_totalMass: "\uCD1D \uC9C8\uB7C9",
            targeting_players: "\uC7A0\uC7AC\uC801 \uD0C0\uAC9F\uD305"
        },
        settingMenu: {
            language: "\uC5B8\uC5B4",
            CellAnimation: "\uC560\uB2C8\uBA54\uC774\uC158 \uC9C0\uC5F0",
            zoomSpeed: "\uC90C \uC18D\uB3C4",
            cameraSpeed: "\uCE74\uBA54\uB77C \uC18D\uB3C4 [2 \uAE30\uBCF8\uAC12]",
            eatAnimation: "\uC138\uD3EC \uBA39\uAE30[\uD761\uC218] \uC560\uB2C8\uBA54\uC774\uC158",
            autoZoom: "\uC790\uB3D9 \uD655\uB300/\uCD95\uC18C",
            cellTextAnimation: "\uC138\uD3EC \uD14D\uC2A4\uD2B8 \uC560\uB2C8\uBA54\uC774\uC158",
            autoHideText: "\uD14D\uC2A4\uD2B8 \uC790\uB3D9 \uC228\uAE30\uAE30",
            hideOwnNick: "Hide own nick",
            hideOwnMass: "Hide own mass",
            cellNick: "\uC138\uD3EC \uB2C9\uB124\uC784",
            cellMass: "\uC138\uD3EC \uC9C8\uB7C9",
            nickShadow: "\uADF8\uB9BC\uC790 [\uC138\uD3EC \uB2C9\uB124\uC784]",
            massShadow: "\uADF8\uB9BC\uC790 [\uC138\uD3EC \uC9C8\uB7C9]",
            urlSkins: "URL \uC2A4\uD0A8",
            hsloSkins: "HSLO \uC2A4\uD0A8",
            food: "\uBA39\uC774",
            vanillaGrid: "\uBC14\uB2D0\uB77C \uBB34\uB2AC",
            bgSectors: "\uBC14\uD0D5\uD654\uBA74",
            cursorLine: "\uCEE4\uC11C \uC120",
            opponentRings: "\uC9C8\uB7C9 \uACA9\uC790\uC120",
            splitRings: "Split rings",
            virusRange: "\uBC14\uC774\uB7EC\uC2A4 \uBC94\uC704",
            teamIndicator: "\uD300 \uBAA9\uB85D",
            commander: "\uC704\uCE58 \uD551",
            chatType: "\uCC44\uD305 \uC720\uD615",
            targeting: "\uC138\uD3EC \uD0C0\uAC9F\uD305[\uAD00\uC804 \uBAA8\uB4DC]",
            sounds: "\uC18C\uB9AC",
            opt_on: "\uCF1C\uC9D0",
            opt_off: "\uAEBC\uC9D0",
            opt_stepped: "\uB2FF\uC740\uACF3",
            opt_linear: "\uC120\uD615",
            opt_shortened: "\uC9E7\uC740",
            opt_full: "\uC804\uCCB4",
            opt_nick: "\uB2C9\uB124\uC784",
            opt_mass: "\uC9C8\uB7C9",
            opt_both: "\uB2C9\uB124\uC784+ \uC9C8\uB7C9",
            opt_perf: "\uC2E4\uC801",
            opt_normal: "\uBCF4\uD1B5",
            opt_urlSkin: "Url \uC2A4\uD0A8",
            opt_hsloSkin: "Hslo \uC2A4\uD0A8",
            opt_allSkin: "\uBAA8\uB4E0 \uC2A4\uD0A8",
            opt_singleClr: "Mono colored",
            opt_rainbow: "\uBB34\uC9C0\uAC1C",
            opt_onlyLines: "\uD14C\uB450\uB9AC\uB9CC",
            opt_snowflakes: "\uB208\uC1A1\uC774",
            opt_chatroom: "\uCC44\uD305\uBC29",
            opt_popup: "\uCC44\uD305 \uC54C\uB9BC"
        },
        hkMenu: {
            title: "\uB2E8\uCD95\uD0A4",
            toggleMenuKey: "\uBA54\uC778\uBA54\uB274 \uB044\uAE30 ",
            feedKey: "feed \uBA39\uC774",
            macroFeedKey: "\uB9E4\uD06C\uB85C feed\uBA39\uC774",
            splitKey: "\uBD84\uC5F4",
            doubleSplitKey: "\uC774\uC911 \uBD84\uC5F4",
            split16Key: "16\uBD84\uC5F4",
            stopKey: "\uC138\uD3EC \uC774\uB3D9\uC911\uC9C0",
            chatKey: "\uCC44\uD305 \uCF1C\uAE30",
            freeSpectateKey: "\uD22C\uC0AC \uBAA8\uB4DC \uC804\uD658",
            toggleSplitRings: "Toggle split rings",
            toggleOpponentRings: "Toggle opponent rings",
            toggleNick: "\uC138\uD3EC \uB2C9\uC744 \uC124\uC815\uD569\uB2C8\uB2E4",
            toggleMass: "\uC138\uD3EC \uC9C8\uB7C9\uC744 \uC124\uC815\uD569\uB2C8\uB2E4",
            toggleSkin: "\uC2A4\uD0A8 \uC124\uC815",
            toggleFood: "\uBA39\uC774 \uC124\uC815",
            respawnKey: "\uBE60\uB978 \uBD80\uD65C",
            command0Key: "\uBA85\uB839 0",
            command1Key: "\uBA85\uB839 1",
            command2Key: "\uBA85\uB839 2",
            command3Key: "\uBA85\uB839 3",
            command4Key: "\uBA85\uB839 4",
            command5Key: "\uBA85\uB839 5",
            command6Key: "\uBA85\uB839 6",
            command7Key: "\uBA85\uB839 7",
            command8Key: "\uBA85\uB839 8",
            command9Key: "\uBA85\uB839 9",
            zoom1key: "\uC90C \uC218\uC900 1",
            zoom2key: "\uC90C \uC218\uC900  2",
            zoom3key: "\uC90C \uC218\uC900 3",
            zoom4key: "\uC90C \uC218\uC900 4",
            zoom5key: "\uC90C \uC218\uC900 5"
        },
        mouseMenu: {
            title: "\uB9C8\uC6B0\uC2A4",
            feed: "\uD53C\uB4DCfeed",
            macroFeed: "\uB9E4\uD06C\uB85C \uD53C\uB4DCfeed",
            split: "\uBD84\uC5F4",
            doubleSplit: "\uC774\uC911 \uBD84\uC5F4",
            split16: "16 \uBD84\uC5F4",
            commander: "\uC704\uCE58 \uD551",
            off: "\uAEBC\uC9D0",
            lmb: "\uC67C\uCABD \uD074\uB9AD",
            rmb: "\uC624\uB978\uCABD \uD074\uB9AD",
            scroll: "\uD720 \uD074\uB9AD",
            targeting_h1: "\uD0C0\uAC9F\uD305",
            targeting_txt1: "\uD0C0\uAC9F \uC7A0\uAE08 1  ",
            targeting_txt2: "\uD0C0\uAC9F \uC7A0\uAE08 2  ",
            targeting_txt3: "\uC2A4\uD06C\uB864 \uD074\uB9AD or\uAD00\uC804 \uD0A4 \uC804\uD658",
            targeting_txt4: "\uC815\uC0C1 \uC138\uD3EC \uBAA8\uB4DC\uC5D0\uC11C \uB9C8\uC6B0\uC2A4 \uCD94\uC801\uC5D0 \uC804\uD658  ",
            targeting_txt5: "\uD0C0\uAC9F \uBAA8\uB4DC\uC5D0\uC11C \uB9C8\uC6B0\uC2A4 \uCD94\uC801\uC5D0 \uC804\uD658  ",
            targeting_txt6: "\uB9C8\uC6B0\uC2A4 \uCD94\uC801\uC5D0\uC11C \uCD5C\uACE0 \uC138\uD3EC \uBAA8\uB4DC\uB85C \uC804\uD658 "
        },
        commandsMenu: {
            title: "\uBA85\uB839\uC5B4",
            command0: "\uC2DC\uBC1C!",
            command1: "\uBE68\uB9AC\uC640\uC8FC\uC138\uC694!",
            command2: "\uB098\uC5D0\uAC8C \uB123\uC5B4\uC918!",
            command3: "\uC5EC\uAE30\uC5D0 \uB3C4\uC6C0\uC694\uCCAD %sector%!",
            command4: "\uC801 \uC774\uACF3\uC5D0\uC11C \uBC1C\uACAC %sector%!",
            command5: "\uD300\uC6D0\uC774 \uD544\uC694\uD574!",
            command6: "\uBC14\uC774\uB7EC\uC2A4 \uBD80\uC154!",
            command7: "\uBC14\uC774\uB7EC\uC2A4 \uC3F4!",
            command8: "\uBBF8\uB07C!",
            command9: "\uB09A\uC2DC\uD558\uC790"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "\uCEE4\uC11C",
            lbSize: "\uB9AC\uB354\uBCF4\uB4DC \uD06C\uAE30",
            chatFontSize: "Chat font size",
            minimapSize: "\uBBF8\uB2C8\uB9F5 \uD06C\uAE30",
            skinBorder: "\uC2A4\uD0A8 \uD14C\uB450\uB9AC",
            cellTransparency: "\uC138\uD3EC \uD22C\uBA85\uB3C4",
            lightenCellColor: "\uBC1D\uC740 \uC138\uD3EC \uC0C9\uAE54",
            borderColor: "\uD14C\uB450\uB9AC \uC0C9\uAE54",
            borderWidth: "\uD14C\uB450\uB9AC \uB108\uBE44",
            gridColor: "\uB208\uAE08 \uC0C9",
            gridTextColor: "\uACA9\uC790 \uD14D\uC2A4\uD2B8 \uC0C9\uAE54",
            gridTextSize: "\uB208\uAE08 \uD14D\uC2A4\uD2B8 \uD06C\uAE30",
            gridTextFont: "\uACA9\uC790 \uD14C\uC2A4\uD2B8 \uAE00\uAF34",
            gridWidth: "\uB208\uAE08 \uB108\uBE44",
            nickColor: "\uB2C9\uB124\uC784 \uCEEC\uB7EC",
            nickStrokeColor: "\uB2C9\uB124\uC784 \uC0C9\uAE54\uD68D",
            cellNickSize: "\uB2C9 \uD06C\uAE30",
            nickFont: "\uB2C9 \uAE00\uAF34",
            massColor: "\uC9C8\uB7C9 \uC0C9\uAE54",
            massStrokeColor: "\uC9C8\uB7C9 \uC0C9\uAE54\uD68D",
            cellMassSize: "\uC9C8\uB7C9 \uD06C\uAE30",
            massFont: "\uC9C8\uB7C9 \uAE00\uAF34",
            foodColor: "\uBA39\uC774 \uC0C9\uAE54",
            foodSize: "\uBA39\uC774 \uD06C\uAE30",
            virusColor: "\uBC14\uC774\uB7EC\uC2A4 \uC0C9\uAE54",
            virusBorderColor: "\uBC14\uC774\uB7EC\uC2A4 \uD14C\uB450\uB9AC \uC0C9",
            virusBorderWidth: "\uBC14\uC774\uB7EC\uC2A4 \uD14C\uB450\uB9AC \uB108\uBE44",
            virusDecor: "\uBC14\uC774\uB7EC\uC2A4 \uC7A5\uC2DD",
            backgroundColor: "\uBC30\uACBD \uC0C9\uAE54",
            commanderColor: "\uC704\uCE58 \uD551 \uC0C9\uAE54",
            indicatorSize: "\uD300 \uC544\uC774\uCF58 \uD06C\uAE30",
            team1color: "\uD300 1 \uC0C9[\uB354\uBE14 \uD0DC\uADF8 \uBAA8\uB4DC]",
            team2color: "\uD300 2 \uC0C9[\uB354\uBE14 \uD0DC\uADF8 \uBAA8\uB4DC]",
            on: "\uCF1C\uC9D0",
            off: "\uAEBC\uC9D0"
        }
    }, ee.lang_ES = {
        mainMenu: {
            btn_settings: "Configuracion",
            btn_play: "Jugar",
            btn_spectate: "Espectear",
            btn_inputs: "Hot Keys",
            btn_theme: "Tema/Dise\xF1o",
            input_tag1: "Tag",
            input_tag2: "Tag 2",
            input_nick: "Nick",
            input_skinUrl: "Skin URL (imgur)",
            select_ffa: "FFA",
            select_party: "Party",
            select_teams: "Teams",
            select_experimental: "Experimental",
            input_token: "Codigo Party",
            btn_join: "Entrar",
            btn_create: "Crear"
        },
        notif: {
            cantPlay2Tag: "Tu no puedes jugar cuando utilizas la funcion de doble tag.",
            hsloNetConn: "Conectado a HSLO Networks.",
            hsloNetDisconn: "Desconectado de HSLO networks.",
            invalidSkinUrl: "Invalid skin URL",
            login_lastSession: "Logged in from last session data.",
            sdk_error: "SDK no ha cargado.",
            alreadyLoggedIn: "Ya te encuentras conectado.",
            login_success: "Conectado",
            login_error: "Error al conectar!",
            logout: "Desconectar",
            nickChangeInGame: "No puedes cambiar tu nickname cuando te encuentras jugando.",
            targeting_on: "Haga clic en una celula para comenzar a seguirla. Vea las instrucciones en el men\xFA de configuraci\xF3n del mouse.",
            targeting_off: "El seguimiento est\xE1 desactivada. Enci\xE9ndalo en el men\xFA de configuraci\xF3n para usarlo.",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "MuBox"
        },
        huds: {
            enterChatMsg: "Ingresa el mensaje...",
            teamlist_title: "Jugadores de equipo",
            _001151: "Puntuaci\xF3n",
            num1position: "#1 Posici\xF3n",
            _001146: "Pausado",
            targeting_bigCellVp: "BIGGEST CELL VIEWPORT",
            targeting_followVp: "VIEWPORT FOLLOWING MOUSE",
            targeting_totalMass: "MASA TOTAL",
            targeting_players: "JUGADOR OBJETIVO"
        },
        settingMenu: {
            language: "Lenguaje",
            CellAnimation: "Retraso de animaci\xF3n",
            zoomSpeed: "Velocidad del Zoom",
            cameraSpeed: "Velocidad de Camara [2 es Preterminado]",
            eatAnimation: "Celula comiendo animacion",
            autoZoom: "Auto zoom",
            cellTextAnimation: "Animacion texto en celula",
            autoHideText: "Auto Ocultar texto",
            hideOwnNick: "Hide own nick",
            hideOwnMass: "Hide own mass",
            cellNick: "Nick de la celula",
            cellMass: "Masa de la celula",
            nickShadow: "Trazo del nick",
            massShadow: "Trazo del masa",
            urlSkins: "URL skins",
            hsloSkins: "HSLO skins",
            food: "Comida/Pellets",
            vanillaGrid: "Cuadricula Vanilla",
            bgSectors: "Tipo de sector",
            cursorLine: "Linea del cursor",
            opponentRings: "Rango del oponente",
            splitRings: "Split rings",
            virusRange: "Rango del virus",
            teamIndicator: "Indicador de compa\xF1ero",
            commander: "Se\xF1al/Comandante",
            chatType: "Tipo de Chat",
            targeting: "Seguiento de celula",
            sounds: "Sonidos",
            opt_on: "Activado",
            opt_off: "Desactivado",
            opt_stepped: "Stepped",
            opt_linear: "Lineal",
            opt_shortened: "Acortado",
            opt_full: "Completo",
            opt_nick: "Nick",
            opt_mass: "Masa",
            opt_both: "Nick + Masa",
            opt_perf: "Rendimiento",
            opt_normal: "Normal",
            opt_urlSkin: "Url skins",
            opt_hsloSkin: "Hslo skins",
            opt_allSkin: "Todas las skins",
            opt_singleClr: "Solo un color",
            opt_rainbow: "Arcoiris",
            opt_onlyLines: "Solo lineas",
            opt_snowflakes: "Copos de nieve",
            opt_chatroom: "Chatroom",
            opt_popup: "Chat emergente"
        },
        hkMenu: {
            title: "Hotkeys",
            toggleMenuKey: "Ocultar menu principal",
            feedKey: "Cebar",
            macroFeedKey: "Cebar rapido [Macro]",
            splitKey: "Dividirse",
            doubleSplitKey: "Divisi\xF3n doble",
            split16Key: "Dividir 16",
            stopKey: "Detener el movimiento de la celula",
            chatKey: "Ocultar Chat",
            freeSpectateKey: "Toggle spectate mode",
            toggleSplitRings: "Toggle split rings",
            toggleOpponentRings: "Toggle opponent rings",
            toggleNick: "Ocultar nick de la celula",
            toggleMass: "Ocultar masa de la celula",
            toggleSkin: "Ocultar skin",
            toggleFood: "Ocultar comida/pellets",
            respawnKey: "Reaparicion rapida",
            command0Key: "Comando 0",
            command1Key: "Comando 1",
            command2Key: "Comando 2",
            command3Key: "Comando 3",
            command4Key: "Comando 4",
            command5Key: "Comando 5",
            command6Key: "Comando 6",
            command7Key: "Comando  7",
            command8Key: "Comando 8",
            command9Key: "Comando 9",
            zoom1key: "Zoom nivel 1",
            zoom2key: "Zoom nivel 2",
            zoom3key: "Zoom nivel 3",
            zoom4key: "Zoom nivel 4",
            zoom5key: "Zoom nivel 5"
        },
        mouseMenu: {
            title: "Raton",
            feed: "Cebar",
            macroFeed: "Cebar rapido[Macro]",
            split: "Division",
            doubleSplit: "Doble division",
            split16: "Division por 16",
            commander: "Comandante",
            off: "Desactivado",
            lmb: "Clic izquierdo",
            rmb: "Clic derecho",
            scroll: "Clic central(Rueda)",
            targeting_h1: "Targeting",
            targeting_txt1: "Lock target 1",
            targeting_txt2: "Lock target 2",
            targeting_txt3: "Middle click or Toggle spectate key",
            targeting_txt4: "Toggle top cell mode to follow mouse mode",
            targeting_txt5: "Toggle targeting mode to follow mouse mode",
            targeting_txt6: "Toggle follow mouse mode to top cell mode"
        },
        commandsMenu: {
            title: "Comandos",
            command0: "Mierda!",
            command1: "Alimentame!",
            command2: "Dividete en mi!",
            command3: "Necesito ayuda en %sector%!",
            command4: "Enemigo avistado en %sector%!",
            command5: "Necesito compa\xF1ero!",
            command6: "Lanza el virus!",
            command7: "Come el virus!",
            command8: "Haz baiteo!",
            command9: "Tricksplit falso!"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "Puntero",
            lbSize: "Tama\xF1o del leaderboard",
            chatFontSize: "Chat font size",
            minimapSize: "Tama\xF1o del minimapa",
            skinBorder: "Borde de la Skin",
            cellTransparency: "Transparencia de la celula",
            lightenCellColor: "Claridad del color de la celula",
            borderColor: "Color del borde",
            borderWidth: "Ancho del borde",
            gridColor: "Color del grid",
            gridTextColor: "Color del texto del grid",
            gridTextSize: "Tama\xF1o de texto del grid",
            gridTextFont: "Fuente de texto del grid",
            gridWidth: "Ancho del grid",
            nickColor: "Color del nick",
            nickStrokeColor: "Color del borde del nick",
            cellNickSize: "Tama\xF1o del nick",
            nickFont: "Fuente del nick",
            massColor: "Color de la masa",
            massStrokeColor: "Color del borde de la masa",
            cellMassSize: "Tama\xF1o de la masa",
            massFont: "Fuente de la masa",
            foodColor: "Color de la comida",
            foodSize: "Tama\xF1o de la comida",
            virusColor: "Color del virus",
            virusBorderColor: "Color del borde del virus",
            virusBorderWidth: "Ancho del borde del virus",
            virusDecor: "Decoracion del virus",
            backgroundColor: "Color del fondo",
            commanderColor: "Color del comandante",
            indicatorSize: "Tama\xF1o del indicador de compa\xF1ero",
            team1color: "Color Equipo 1 [Modo doble TAG]",
            team2color: "Color Equipo 2 [Modo doble TAG]",
            on: "Activado",
            off: "Desactivado"
        }
    };
    var se = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001251 = !1, this._001252 = oe("#settings"), this.language = ae.get("settings", "language") || re._001255, this.CellAnimation = ~~ae.get("settings", "CellAnimation") || 140, this.eatAnimation = ae.get("settings", "eatAnimation") || "on", this.zoomSpeed = ~~ae.get("settings", "zoomSpeed") || 92, this.cameraSpeed = ~~ae.get("settings", "cameraSpeed") || 2, this.autoZoom = ae.get("settings", "autoZoom") || "off", this.cellTextAnimation = ae.get("settings", "cellTextAnimation") || "on", this.autoHideText = ae.get("settings", "autoHideText") || "on", this.cellNick = ae.get("settings", "cellNick") || "on", this.nickShadow = ae.get("settings", "nickShadow") || "off", this.cellMass = ae.get("settings", "cellMass") || "shortened", this.massShadow = ae.get("settings", "massShadow") || "off", this.hideOwnNick = ae.get("settings", "hideOwnNick") || "on", this.hideOwnMass = ae.get("settings", "hideOwnMass") || "off", this.urlSkins = ae.get("settings", "urlSkins") || "on", this.hsloSkins = ae.get("settings", "hsloSkins") || "on", this.food = ae.get("settings", "food") || "monoColored", this.bgSectors = ae.get("settings", "bgSectors") || "normal", this.vanillaGrid = ae.get("settings", "vanillaGrid") || "off", this.cursorLine = ae.get("settings", "cursorLine") || "off", this.teamIndicator = ae.get("settings", "teamIndicator") || "on", this.opponentRings = ae.get("settings", "opponentRings") || "off", this.splitRings = ae.get("settings", "splitRings") || "off", this.virusRange = ae.get("settings", "virusRange") || "off", this.commander = ae.get("settings", "commander") || "on", this.sounds = ae.get("settings", "sounds") || "on", this.targeting = ae.get("settings", "targeting") || "off", this.chatType = ae.get("settings", "chatType") || "popup", this._001254(), this._001253()
                }
            }, {
                key: "_001254",
                value: function() {
                    oe(".settings-options").each(function() {
                        var co = oe(this).attr("type");
                        "range" === co ? so._001249(this, 2) : "options" === co && so._001250(this, 2)
                    }), this._001246(), this._001247()
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe(".settings-container").perfectScrollbar(), oe(".settings-container .fa-chevron-left").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = oe(mo).parent(),
                                uo = oe(go).attr("type");
                            "options" === uo ? so._001250(go, 0) : "range" === uo && so._001249(go, 0)
                        })
                    }), oe(".settings-container span.outer").each(function() {
                        var mo = this;
                        oe(this).click(function(go) {
                            var uo = oe(mo).parent();
                            so._001249(uo, 3, go.offsetX)
                        })
                    }), oe(".settings-container .fa-chevron-right").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = oe(mo).parent(),
                                uo = oe(go).attr("type");
                            "options" === uo ? so._001250(go, 1) : "range" === uo && so._001249(go, 1)
                        })
                    }), oe(".settings-close").click(function() {
                        return co.close()
                    })
                }
            }, {
                key: "toggle",
                value: function() {
                    this._001251 ? this.close() : this.open()
                }
            }, {
                key: "close",
                value: function() {
                    this._001251 = !1, this._001252.fadeOut(250)
                }
            }, {
                key: "open",
                value: function() {
                    this._001251 = !0, this._001252.fadeIn(250)
                }
            }, {
                key: "_001250",
                value: function(co, mo) {
                    for (var ho, go = oe(co).attr("name"), uo = oe(co).find("b"), ko = uo.length, po = ko, yo = 0; po--;) ho = uo[po], "active" === oe(ho).attr("class") && (yo = po);
                    if (1 === mo) {
                        var fo = yo + 1 < ko ? yo + 1 : 0;
                        oe(uo[yo]).removeAttr("class"), oe(uo[fo]).attr("class", "active");
                        var vo = oe(uo[fo]).attr("value");
                        this._001248(go, vo)
                    } else if (0 === mo) {
                        var Co = 0 < yo ? yo - 1 : ko - 1;
                        oe(uo[yo]).removeAttr("class"), oe(uo[Co]).attr("class", "active");
                        var So = oe(uo[Co]).attr("value");
                        this._001248(go, So)
                    } else if (2 === mo) {
                        oe(uo[yo]).removeAttr("class");
                        for (var xo, bo = ko; bo--;)
                            if (xo = uo[bo], oe(xo).attr("value") === this[go]) {
                                oe(xo).attr("class", "active");
                                break
                            }
                    }
                }
            }, {
                key: "_001249",
                value: function(co, mo) {
                    var go = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
                        uo = oe(co).attr("name"),
                        ko = oe(co).find("span"),
                        po = ko[0],
                        yo = ko[1],
                        ho = oe(ko[2]),
                        fo = ~~oe(po).attr("min"),
                        vo = ~~oe(po).attr("max"),
                        Co = ~~oe(po).attr("step"),
                        So = ~~oe(po).attr("value");
                    if (1 === mo && So + Co <= vo) {
                        var bo = Co + So;
                        oe(po).attr("value", bo), oe(yo).css("width", ~~(100 * (bo - fo) / (vo - fo)) + "px"), ho.text("[" + bo + "]"), this._001248(uo, ~~bo)
                    } else if (0 === mo && fo <= So - Co) {
                        var To = So - Co;
                        oe(po).attr("value", To), oe(yo).css("width", ~~(100 * (To - fo) / (vo - fo)) + "px"), ho.text("[" + To + "]"), this._001248(uo, ~~To)
                    } else if (2 === mo) {
                        var wo = this[uo];
                        oe(po).attr("value", wo), oe(yo).css("width", ~~(100 * (wo - fo) / (vo - fo)) + "px"), ho.text("[" + wo + "]")
                    } else if (3 === mo) {
                        var Mo = 0 | go / 100 * (vo - fo);
                        Mo = (0 | Mo / Co) * Co;
                        var Ao = 100 * ((Mo += fo) - fo) / (vo - fo);
                        oe(po).attr("value", Mo), oe(yo).css("width", ~~Ao + "px"), ho.text("[" + Mo + "]"), this._001248(uo, ~~Mo)
                    }
                }
            }, {
                key: "_001248",
                value: function(co, mo) {
                    this[co] = mo, "chatType" === co && this._001246(), "language" === co && this._001247(), "nickShadow" === co && Ie._001022.clear(), "massShadow" === co && Ie._001021.clear(), ae.set("settings", co, mo), "custom" !== Ce.selectedPreset && (Ce.selectedPreset = "custom", ae.set("theme", "selectedPreset", "custom"), Ce._001254())
                }
            }, {
                key: "_001247",
                value: function() {
                    re.change(), ke._001221()
                }
            }, {
                key: "_001246",
                value: function() {
                    "chatroom" === this.chatType ? oe("#chatroom").show() : oe("#chatroom").hide()
                }
            }]), so
        }(),
        ce = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001251 = !1, this.target = "hotkeys", this._001252 = oe("#inputs"), this._001253(), pe._001259(), me._001259(), ge._001259(), ke._001259()
                }
            }, {
                key: "toggle",
                value: function() {
                    this._001251 ? this.close() : this.open()
                }
            }, {
                key: "close",
                value: function() {
                    this._001251 = !1, this._001252.fadeOut(250)
                }
            }, {
                key: "open",
                value: function() {
                    this._001251 = !0, this._001252.fadeIn(250)
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe(".inputs-tab").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = oe(mo).attr("target");
                            "#hotkeys" === go ? (oe("#hotkeys").addClass("active"), oe("#commands").removeClass("active"), oe("#mouse").removeClass("active"), oe(".inputs-tab[target=\"#hotkeys\"]").addClass("active"), oe(".inputs-tab[target=\"#mouse\"]").removeClass("active"), oe(".inputs-tab[target=\"#commands\"]").removeClass("active"), so.target = "hotkeys") : "#mouse" === go ? (oe("#mouse").addClass("active"), oe("#hotkeys").removeClass("active"), oe("#commands").removeClass("active"), oe(".inputs-tab[target=\"#hotkeys\"]").removeClass("active"), oe(".inputs-tab[target=\"#commands\"]").removeClass("active"), oe(".inputs-tab[target=\"#mouse\"]").addClass("active"), so.target = "mouse") : "#commands" === go && (oe("#commands").addClass("active"), oe("#hotkeys").removeClass("active"), oe("#mouse").removeClass("active"), oe(".inputs-tab[target=\"#commands\"]").addClass("active"), oe(".inputs-tab[target=\"#hotkeys\"]").removeClass("active"), oe(".inputs-tab[target=\"#mouse\"]").removeClass("active"), so.target = "commands")
                        })
                    }), oe(".inputs-tab.close").click(function() {
                        co.close()
                    })
                }
            }]), so
        }(),
        de = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001257 = ~~ae.get("profiles", "selected") || 1, this._001245 = !1, this._001244 = ae.get("profiles", "tag") || "", this._001254(), this._001253()
                }
            }, {
                key: "_001254",
                value: function() {
                    var co = ae.get("profiles", "profile" + this._001257);
                    co || (co = {
                        nick: "profile " + this._001257,
                        skin: "https://i.imgur.com/nRqSis7.png"
                    }), ae.set("profiles", "profile" + this._001257, co), oe("#nick").val(co.nick), oe("#skin").val(co.skin), oe("#tag").val(this._001244), this._001239();
                    for (var mo = 8; 0 < mo;) this._001238(mo), mo--
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe(".bar-circle-outer").click(function() {
                        oe(".skin-wheel").fadeIn(250), co._001245 = !0
                    }), oe(".skin-selector").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = ~~oe(mo).attr("value");
                            so.switch(go), oe(".skin-wheel").fadeOut(250)
                        })
                    }), oe(".menu-blur").click(function() {
                        co._001245 && (oe(".skin-wheel").fadeOut(250), co._001245 = !1)
                    }), oe("#tag").blur(function() {
                        co._001240(oe("#tag").val()), io._000869(!0)
                    }), oe("#tag2").blur(function() {
                        co._001240(oe("#tag").val()), io._000869(!0)
                    }), oe("#nick").blur(function() {
                        co._001243(oe("#nick").val())
                    }), oe("#nick2").blur(function() {
                        co._001242(oe("#nick2").val())
                    }), oe("#skin").blur(function() {
                        co._001241(oe("#skin").val())
                    })
                }
            }, {
                key: "switch",
                value: function(co) {
                    this._001257 = ~~co, ae.set("profiles", "selected", co);
                    var mo = ae.get("profiles", "profile" + co);
                    mo || (mo = {
                        nick: "profile " + this._001257,
                        skin: "https://i.imgur.com/nRqSis7.png"
                    }), oe("#nick").val(mo.nick), oe("#skin").val(mo.skin), Ne.nick = mo.nick, Ne.skin = mo.skin, ae.set("profiles", "profile" + this._001257, mo), this._001239()
                }
            }, {
                key: "_001243",
                value: function(co) {
                    var mo = ae.get("profiles", "profile" + this._001257);
                    mo || (mo = {
                        nick: "profile " + this._001257,
                        skin: "https://i.imgur.com/nRqSis7.png"
                    }), mo.nick = co, ae.set("profiles", "profile" + this._001257, mo), Ne.nick = co
                }
            }, {
                key: "_001242",
                value: function(co) {
                    Ne._001061 = co
                }
            }, {
                key: "_001241",
                value: function(co) {
                    var mo = ae.get("profiles", "profile" + this._001257);
                    mo || (mo = {
                        nick: "profile " + this._001257,
                        skin: "https://i.imgur.com/nRqSis7.png"
                    }), mo.skin = _o._000860(_o._000862(co)), ae.set("profiles", "profile" + this._001257, mo), this._001239(), this._001238(this._001257), Ne.skin = co
                }
            }, {
                key: "_001240",
                value: function(co) {
                    Ne._001244 = co, ae.set("profiles", "tag", co)
                }
            }, {
                key: "_001239",
                value: function() {
                    var co = _o._000860(_o._000862(oe("#skin").val()));
                    oe(".skin-preview").css("background", "url(" + co + ")")
                }
            }, {
                key: "_001238",
                value: function(co) {
                    var mo = ae.get("profiles", "profile" + co);
                    if (mo) {
                        var go = mo.skin;
                        oe(".skin-selector[value=" + co + "]").css("background", "url(" + go + ")")
                    }
                }
            }]), so
        }(),
        me = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this.toggleMenuKey = ae.get("hotkeys", "toggleMenuKey") || "ESC", this.feedKey = ae.get("hotkeys", "feedKey") || "W", this.macroFeedKey = ae.get("hotkeys", "macroFeedKey") || "E", this.splitKey = ae.get("hotkeys", "splitKey") || "SPACE", this.doubleSplitKey = ae.get("hotkeys", "doubleSplitKey") || "R", this.split16Key = ae.get("hotkeys", "split16Key") || "G", this.stopKey = ae.get("hotkeys", "stopKey") || "S", this.chatKey = ae.get("hotkeys", "chatKey") || "ENTER", this.multiboxTab = ae.get("hotkeys", "multiboxTab") || "TAB", this.freeSpectateKey = ae.get("hotkeys", "freeSpectateKey") || "Q", this.toggleSplitRings = ae.get("hotkeys", "toggleSplitRings") || "U", this.toggleOpponentRings = ae.get("hotkeys", "toggleOpponentRings") || "I", this.toggleNick = ae.get("hotkeys", "toggleNick") || "N", this.toggleMass = ae.get("hotkeys", "toggleMass") || "M", this.toggleBGsectors = ae.get("hotkeys", "toggleBGsectors") || "B", this.toggleFood = ae.get("hotkeys", "toggleFood") || "F", this.toggleSkin = ae.get("hotkeys", "toggleSkin") || "A", this.respawnKey = ae.get("hotkeys", "respawnKey") || "TILDE", this.command0Key = ae.get("hotkeys", "command0Key") || "0", this.command1Key = ae.get("hotkeys", "command1Key") || "1", this.command2Key = ae.get("hotkeys", "command2Key") || "2", this.command3Key = ae.get("hotkeys", "command3Key") || "3", this.command4Key = ae.get("hotkeys", "command4Key") || "4", this.command5Key = ae.get("hotkeys", "command5Key") || "5", this.command6Key = ae.get("hotkeys", "command6Key") || "6", this.command7Key = ae.get("hotkeys", "command7Key") || "7", this.command8Key = ae.get("hotkeys", "command8Key") || "8", this.command9Key = ae.get("hotkeys", "command9Key") || "9", this.zoom1key = ae.get("hotkeys", "zoom1key") || "ALT+1", this.zoom2key = ae.get("hotkeys", "zoom2key") || "ALT+2", this.zoom3key = ae.get("hotkeys", "zoom3key") || "ALT+3", this.zoom4key = ae.get("hotkeys", "zoom4key") || "ALT+4", this.zoom5key = ae.get("hotkeys", "zoom5key") || "ALT+5", this._001237 = new Map, this._001236(), this._001253()
                }
            }, {
                key: "_001236",
                value: function() {
                    oe("#hotkeys .row").each(function() {
                        var co = oe(this).attr("name"),
                            mo = oe(this).find(".key")[0];
                        oe(mo).val(so[co])
                    })
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe("#hotkeys").perfectScrollbar(), oe("#hotkeys .row .key").each(function() {
                        var mo = this;
                        oe(this).keydown(function(go) {
                            go.preventDefault();
                            var uo = oe(mo).parent();
                            so._001233(uo, go, mo)
                        })
                    }), te.addEventListener("keydown", function(mo) {
                        return co._001235(mo)
                    }), te.addEventListener("keyup", function(mo) {
                        return co._001234(mo)
                    })
                }
            }, {
                key: "_001235",
                value: function(co) {
                    9 === co.keyCode && co.preventDefault();
                    var mo = this._001230(co);
                    if (mo && !this._001237.has(mo) && (this._001237.set(mo, !0), !ce._001251 || "hotkeys" !== ce.target))
                        if (!(mo !== this.chatKey)) pe._000874();
                        else if (!Ae._001154)
                        if (mo === this.toggleMenuKey) Oe.toggle();
                        else if (!Oe._001251)
                        if (co.preventDefault(), !(mo !== this.freeSpectateKey || Ne._001058)) pe._001218();
                        else if (mo !== this.respawnKey) {
                        if (Ne._001058) {
                            if (mo === this.macroFeedKey) return void pe.macroFeed(!0);
                            if (mo === this.feedKey) return void pe.feed();
                            if (mo === this.splitKey) return void pe.split();
                            if (mo === this.doubleSplitKey) return void pe.doubleSplit();
                            if (mo === this.split16Key) return void pe.split16();
                            if (mo === this.multiboxTab) return void pe.multiboxTab()
                        }
                        mo === this.stopKey ? pe._001219() : mo === this.toggleSplitRings ? pe.toggleSplitRings() : mo === this.toggleOpponentRings ? pe.toggleOpponentRings() : mo === this.toggleNick ? pe._001216() : mo === this.toggleMass ? pe._001215() : mo === this.toggleBGsectors ? pe.toggleBGsectors() : mo === this.toggleFood ? pe._001214() : mo === this.toggleSkin ? pe.toggleSkin() : mo === this.command0Key ? pe.command(0) : mo === this.command1Key ? pe.command(1) : mo === this.command2Key ? pe.command(2) : mo === this.command3Key ? pe.command(3) : mo === this.command4Key ? pe.command(4) : mo === this.command5Key ? pe.command(5) : mo === this.command6Key ? pe.command(6) : mo === this.command7Key ? pe.command(7) : mo === this.command8Key ? pe.command(8) : mo === this.command9Key ? pe.command(9) : mo === this.zoom1key ? pe._001217(.5) : mo === this.zoom2key ? pe._001217(.25) : mo === this.zoom3key ? pe._001217(.125) : mo === this.zoom4key ? pe._001217(.075) : mo !== this.zoom5key || pe._001217(.05)
                    } else pe._001213()
                }
            }, {
                key: "_001234",
                value: function(co) {
                    var mo = this._001230(co);
                    mo && (this._001237.delete(mo), mo !== this.macroFeedKey || pe.macroFeed(!1))
                }
            }, {
                key: "_001233",
                value: function(co, mo, go) {
                    var uo = this._001230(mo),
                        ko = oe(co).attr("name");
                    !1 !== uo && ("freeSpectateKey" !== ko && this._001232(uo), "DEL" === uo && (uo = ""), oe(go).val(uo), this[ko] = uo, ae.set("hotkeys", ko, uo))
                }
            }, {
                key: "_001232",
                value: function(co) {
                    var mo = !1;
                    co === this.toggleMenuKey ? mo = "toggleMenuKey" : co === this.feedKey ? mo = "feedKey" : co === this.macroFeedKey ? mo = "macroFeedKey" : co === this.splitKey ? mo = "splitKey" : co === this.doubleSplitKey ? mo = "doubleSplitKey" : co === this.split16Key ? mo = "split16Key" : co === this.stopKey ? mo = "stopKey" : co === this.chatKey ? mo = "chatKey" : co === this.multiboxTab ? mo = "multiboxTab" : co === this.toggleSplitRings ? mo = "toggleSplitRings" : co === this.toggleOpponentRings ? mo = "toggleOpponentRings" : co === this.toggleNick ? mo = "toggleNick" : co === this.toggleMass ? mo = "toggleMass" : co === this.toggleBGsectors ? mo = "toggleBGsectors" : co === this.toggleFood ? mo = "toggleFood" : co === this.toggleSkin ? mo = "toggleSkin" : co === this.respawnKey ? mo = "respawnKey" : co === this.command0Key ? mo = "command0Key" : co === this.command1Key ? mo = "command1Key" : co === this.command2Key ? mo = "command2Key" : co === this.command3Key ? mo = "command3Key" : co === this.command4Key ? mo = "command4Key" : co === this.command5Key ? mo = "command5Key" : co === this.command6Key ? mo = "command6Key" : co === this.command7Key ? mo = "command7Key" : co === this.command8Key ? mo = "command8Key" : co === this.command9Key ? mo = "command9Key" : co === this.zoom1key ? mo = "zoom1key" : co === this.zoom2key ? mo = "zoom2key" : co === this.zoom3key ? mo = "zoom3key" : co === this.zoom4key ? mo = "zoom4key" : co === this.zoom5key && (mo = "zoom5key"), mo && (this[mo] = "", ae.set("hotkeys", mo, ""), oe("#hotkeys .row[name=" + mo + "] input").val(""))
                }
            }, {
                key: "_001231",
                value: function(co) {
                    var mo = co.keyCode || co.which;
                    return 64 < mo && 91 > mo || 47 < mo && 58 > mo || 13 === mo || 27 === mo || 32 === mo || 16 === mo || 46 === mo || 192 === mo || 9 === mo
                }
            }, {
                key: "_001230",
                value: function(co) {
                    if (!this._001231(co)) return !1;
                    var mo = co.keyCode || co.which,
                        go = !1,
                        uo = !1;
                    return (co.ctrlKey ? go = "CTRL+" : co.altKey && (go = "ALT+"), 64 < mo && 91 > mo) ? uo = String.fromCharCode(mo) : 47 < mo && 58 > mo ? uo = "" + (mo - 48) : go || (13 === mo ? uo = "ENTER" : 27 === mo ? uo = "ESC" : 32 === mo ? uo = "SPACE" : 16 === mo ? uo = "SHIFT" : 9 === mo ? uo = "TAB" : 46 === mo ? uo = "DEL" : 192 === mo ? uo = "TILDE" : void 0), !!uo && (go ? go + uo : uo)
                }
            }]), so
        }(),
        ge = new(function() {
            function so() {
                _classCallCheck(this, so), this.leftClick = ae.get("mouse", "leftClick") || "off", this.middleClick = ae.get("mouse", "middleClick") || "commander", this.rightClick = ae.get("mouse", "rightClick") || "off", this.x = 0, this.y = 0, this._001044 = te.getElementById("canvas"), this._001229 = 0, this._001228 = 0
            }
            return _createClass(so, [{
                key: "_001259",
                value: function() {
                    this._001254(), this._001253()
                }
            }, {
                key: "send",
                value: function() {
                    var co = 2 === Ne._001053 ? We._001033 : ie._001266;
                    this._001229 = (this.x - this._001044.width / 2) / Ee._001030 + Ee.x + co.x, this._001228 = (this.y - this._001044.height / 2) / Ee._001030 + Ee.y + co.y, Ee._001025 && qe._000968 ? oo.mouse(0 | qe._001039.x, 0 | qe._001039.y) : Ne._001070 ? oo.mouse(0 | Ne.x, 0 | Ne.y) : oo.mouse(0 | this._001229, 0 | this._001228)
                }
            }, {
                key: "_001254",
                value: function() {
                    oe(".mouse-options").each(function() {
                        var co = oe(this).attr("type");
                        "range" === co ? ge._001249(this, 2) : "options" === co && ge._001250(this, 2)
                    })
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe("#mouse").perfectScrollbar(), oe("#mouse .fa-chevron-left").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = oe(mo).parent(),
                                uo = oe(go).attr("type");
                            "options" === uo ? ge._001250(go, 0) : "range" === uo && ge._001249(go, 0)
                        })
                    }), oe("#mouse .fa-chevron-right").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = oe(mo).parent(),
                                uo = oe(go).attr("type");
                            "options" === uo ? ge._001250(go, 1) : "range" === uo && ge._001249(go, 1)
                        })
                    }), this._001044.addEventListener("mousemove", function(mo) {
                        co.x = mo.clientX, co.y = mo.clientY
                    }), this._001044.addEventListener("mousedown", function(mo) {
                        co._001226(mo)
                    }), this._001044.addEventListener("mouseup", function(mo) {
                        co._001225(mo)
                    }), this._001044.addEventListener("wheel", function(mo) {
                        co._001227(mo)
                    }), this._001044.addEventListener("contextmenu", function(mo) {
                        mo.preventDefault()
                    })
                }
            }, {
                key: "_001227",
                value: function(co) {
                    var mo = Ee._001032;
                    0 > co.wheelDelta ? mo *= se.zoomSpeed / 100 : mo /= se.zoomSpeed / 100, mo = 2 < mo ? 2 : .02 > mo ? .02 : mo, Ee._001032 = mo
                }
            }, {
                key: "_001226",
                value: function(co) {
                    var mo = !1;
                    switch (co.which) {
                        case 1:
                            mo = "leftClick";
                            break;
                        case 2:
                            mo = "middleClick";
                            break;
                        case 3:
                            mo = "rightClick";
                    }
                    if (mo)
                        if (Ee._001025 && "on" === se.targeting) {
                            var go = (co.clientX - (ee.innerWidth >> 1)) / Ee._001030 + Ee.x,
                                uo = (co.clientY - (ee.innerHeight >> 1)) / Ee._001030 + Ee.y;
                            "leftClick" === mo ? qe._000970(go, uo, 1) : "middleClick" === mo ? qe._001036() : "rightClick" == mo && qe._000970(go, uo, 2)
                        } else {
                            var ko = this[mo];
                            "off" !== ko && ("feed" === ko ? pe.feed() : "macroFeed" === ko ? pe.macroFeed(!0) : "split" === ko ? pe.split() : "doubleSplit" === ko ? pe.doubleSplit() : "split16" === ko ? pe.split16() : "commander" !== ko || io.commander())
                        }
                }
            }, {
                key: "_001225",
                value: function(co) {
                    var mo = !1;
                    switch (co.which) {
                        case 1:
                            mo = "leftClick";
                            break;
                        case 2:
                            mo = "middleClick";
                            break;
                        case 3:
                            mo = "rightClick";
                    }
                    mo && ("macroFeed" !== this[mo] || pe.macroFeed(!1))
                }
            }, {
                key: "_001250",
                value: function(co, mo) {
                    for (var ho, go = oe(co).attr("name"), uo = oe(co).find("b"), ko = uo.length, po = ko, yo = 0; po--;) ho = uo[po], "active" === oe(ho).attr("class") && (yo = po);
                    if (1 === mo) {
                        var fo = yo + 1 < ko ? yo + 1 : 0;
                        oe(uo[yo]).removeAttr("class"), oe(uo[fo]).attr("class", "active");
                        var vo = oe(uo[fo]).attr("value");
                        this._001224(go, vo)
                    } else if (0 === mo) {
                        var Co = 0 < yo ? yo - 1 : ko - 1;
                        oe(uo[yo]).removeAttr("class"), oe(uo[Co]).attr("class", "active");
                        var So = oe(uo[Co]).attr("value");
                        this._001224(go, So)
                    } else if (2 === mo) {
                        oe(uo[yo]).removeAttr("class");
                        for (var xo, bo = ko; bo--;)
                            if (xo = uo[bo], oe(xo).attr("value") === this[go]) {
                                oe(xo).attr("class", "active");
                                break
                            }
                    }
                }
            }, {
                key: "_001249",
                value: function(co, mo) {
                    var go = oe(co).attr("name"),
                        uo = oe(co).find("span"),
                        ko = uo[0],
                        po = uo[1],
                        yo = ~~oe(ko).attr("min"),
                        ho = ~~oe(ko).attr("max"),
                        fo = ~~oe(ko).attr("step"),
                        vo = ~~oe(ko).attr("value");
                    if (1 === mo && vo + fo <= ho) {
                        var Co = fo + vo;
                        oe(ko).attr("value", Co), oe(po).css("width", ~~(100 * (Co - yo) / (ho - yo)) + "px"), this._001224(go, Co)
                    } else if (0 === mo && yo <= vo - fo) {
                        var bo = vo - fo;
                        oe(ko).attr("value", bo), oe(po).css("width", ~~(100 * (bo - yo) / (ho - yo)) + "px"), this._001224(go, bo)
                    } else if (2 === mo) {
                        var To = this[go];
                        oe(ko).attr("value", To), oe(po).css("width", ~~(100 * (To - yo) / (ho - yo)) + "px")
                    }
                }
            }, {
                key: "_001224",
                value: function(co, mo) {
                    this[co] = mo, ae.set("mouse", co, mo)
                }
            }]), so
        }()),
        ke = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001223(), this._001254(), this._001253()
                }
            }, {
                key: "_001223",
                value: function() {
                    this.command1 = ae.get("commands", "command1") || re._001256.commandsMenu.command1, this.command2 = ae.get("commands", "command2") || re._001256.commandsMenu.command2, this.command3 = ae.get("commands", "command3") || re._001256.commandsMenu.command3, this.command4 = ae.get("commands", "command4") || re._001256.commandsMenu.command4, this.command5 = ae.get("commands", "command5") || re._001256.commandsMenu.command5, this.command6 = ae.get("commands", "command6") || re._001256.commandsMenu.command6, this.command7 = ae.get("commands", "command7") || re._001256.commandsMenu.command7, this.command8 = ae.get("commands", "command8") || re._001256.commandsMenu.command8, this.command9 = ae.get("commands", "command9") || re._001256.commandsMenu.command9, this.command0 = ae.get("commands", "command0") || re._001256.commandsMenu.command0
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe("#commands").perfectScrollbar();
                    for (var mo = 10, go = function() {
                            var uo = "command" + mo;
                            oe("#" + uo).blur(function() {
                                co._001222(uo, oe("#" + uo).val())
                            })
                        }; mo--;) go()
                }
            }, {
                key: "_001222",
                value: function(co, mo) {
                    this[co] = mo, ae.set("commands", co, mo)
                }
            }, {
                key: "_001254",
                value: function() {
                    for (var mo, co = 10; co--;) mo = "command" + co, oe("#" + mo).val(this[mo])
                }
            }, {
                key: "_001221",
                value: function() {
                    this._001223(), this._001254()
                }
            }]), so
        }(),
        pe = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001220 = !1
                }
            }, {
                key: "_001219",
                value: function() {
                    Ne._001070 = !Ne._001070
                }
            }, {
                key: "feed",
                value: function() {
                    ge.send(), oo.eject()
                }
            }, {
                key: "macroFeed",
                value: function(co) {
                    var mo = this;
                    if (co) {
                        if (this._001220) return;
                        this.feed(), this._001220 = setInterval(function() {
                            mo.feed()
                        }, 80)
                    } else this._001220 && (clearInterval(this._001220), this._001220 = !1)
                }
            }, {
                key: "split",
                value: function() {
                    ge.send(), oo.split()
                }
            }, {
                key: "doubleSplit",
                value: function() {
                    var co = this;
                    this.split(), setTimeout(function() {
                        co.split()
                    }, 40)
                }
            }, {
                key: "split16",
                value: function() {
                    var co = this;
                    this.split(), setTimeout(function() {
                        co.split()
                    }, 40), setTimeout(function() {
                        co.split()
                    }, 80), setTimeout(function() {
                        co.split()
                    }, 120)
                }
            }, {
                key: "_001218",
                value: function() {
                    return qe._000968 ? (qe._001036(), qe._000975._000974 = !1, qe._000971._000974 = !1, void Le._001134()) : void(oo._001024(), Ee._001024 ? Le._001134() : Le._001135(), qe._000975._000974 = !1, qe._000971._000974 = !1)
                }
            }, {
                key: "_000874",
                value: function() {
                    Ae.enter()
                }
            }, {
                key: "command",
                value: function(co) {
                    var mo = ke["command" + co];
                    if (0 <= mo.indexOf("%sector%")) {
                        var go = We._001034(Ee.x, Ee.y);
                        mo = mo.replace("%sector%", go)
                    }
                    io._000874(2, mo)
                }
            }, {
                key: "_001217",
                value: function(co) {
                    Ee._001032 = co
                }
            }, {
                key: "_001216",
                value: function() {
                    var co = ae.get("settings", "cellNick");
                    se.cellNick = "off" === se.cellNick ? "off" !== co && co || "on" : "off"
                }
            }, {
                key: "_001215",
                value: function() {
                    var co = ae.get("settings", "cellMass");
                    se.cellMass = "off" === se.cellMass ? "off" !== co && co || "shortened" : "off"
                }
            }, {
                key: "_001214",
                value: function() {
                    var co = ae.get("settings", "food");
                    se.food = "off" === se.food ? "off" !== co && co || "monoColored" : "off"
                }
            }, {
                key: "toggleBGsectors",
                value: function() {
                    var co = ae.get("settings", "bgSectors");
                    se.bgSectors = "off" === se.bgSectors ? "off" !== co && co || "normal" : "off"
                }
            }, {
                key: "toggleSkin",
                value: function() {
                    var co = ae.get("settings", "cellSkins");
                    se.cellSkins = "off" === se.cellSkins ? "off" !== co && co || "all" : "off"
                }
            }, {
                key: "toggleSplitRings",
                value: function() {
                    var co = ae.get("settings", "splitRings");
                    se.splitRings = "off" === se.splitRings ? "off" !== co && co || "on" : "off"
                }
            }, {
                key: "toggleOpponentRings",
                value: function() {
                    var co = ae.get("settings", "opponentRings");
                    se.opponentRings = "off" === se.opponentRings ? "off" !== co && co || "on" : "off"
                }
            }, {
                key: "_001213",
                value: function() {
                    Qe._000934(Qe._000936);
                    var co = setInterval(function() {
                        Qe._000886 && (oo._000998(), clearInterval(co))
                    }, 100)
                }
            }, {
                key: "multiboxTab",
                value: function() {
                    1 === Ne._001053 ? (Ne._001053 = 2, Ne._001075 || oo._000998()) : (Ne._001053 = 1, Ne._001076 || oo._000998())
                }
            }]), so
        }(),
        ye = new(function() {
            function so() {
                _classCallCheck(this, so), this.masterUrl = "http://bouncer.agar.io/v4", this.contentType = "application/octet-stream", this.xSupportProtoVersion = "9.0.1"
            }
            return _createClass(so, [{
                key: "_001212",
                value: function() {
                    var co = new XMLHttpRequest;
                    return co.open("POST", "http://bouncer.agar.io/info", !1), co.send(), JSON.parse(co.responseText)
                }
            }, {
                key: "_001211",
                value: function(co, mo) {
                    if (":party" === mo) return this._001207(co, mo);
                    var go = new Uint8Array(4 + co.length + 2);
                    go[0] = 10, go[1] = 4 + co.length, go[2] = 10, go[3] = co.length;
                    for (var uo = 0; uo < co.length; uo++) go[4 + uo] = co.charCodeAt(uo);
                    go[4 + co.length] = 18, go[5 + co.length] = 0;
                    var ko = new XMLHttpRequest;
                    ko.open("POST", this.masterUrl + "/findServer", !1), this._001210(ko), ko.send(go);
                    var po = JSON.parse(ko.responseText);
                    return ":party" === mo && (po = this._001203(co, mo)), po
                }
            }, {
                key: "_001210",
                value: function(co) {
                    co.setRequestHeader("Accept", "text/plain"), co.setRequestHeader("Accept", "*/*"), co.setRequestHeader("Accept", "q=0.01"), co.setRequestHeader("Content-Type", this.contentType), co.setRequestHeader("x-support-proto-version", this.xSupportProtoVersion), co.setRequestHeader("x-client-version", "" + ro._000853)
                }
            }, {
                key: "_001209",
                value: function(co, mo) {
                    var go = new Uint8Array(4 + co.length + 6 + mo.length);
                    go[0] = 10, go[1] = co.length + 4, go[2] = 10, go[3] = co.length;
                    for (var uo = 0; uo < co.length; uo++) go[4 + uo] = co.charCodeAt(uo);
                    go[4 + co.length] = 18, go[5 + co.length] = 0, go[6 + co.length] = 26, go[7 + co.length] = 8, go[8 + co.length] = 10, go[9 + co.length] = 6;
                    for (var ko = 0; ko < mo.length; ko++) go[10 + co.length + ko] = mo.charCodeAt(ko);
                    var po = new XMLHttpRequest;
                    return po.open("POST", "http://bouncer.agar.io/v4/getToken", !1), this._001210(po), po.send(go), JSON.parse(po.responseText).endpoints.http
                }
            }, {
                key: "_001208",
                value: function(co, mo) {
                    var go = co + mo,
                        uo = new Uint8Array(4 + go.length + 2);
                    uo[0] = 10, uo[1] = go.length + 4, uo[2] = 10, uo[3] = go.length;
                    for (var ko = 0; ko < go.length; ko++) uo[4 + ko] = go.charCodeAt(ko);
                    uo[4 + go.length] = 18, uo[5 + go.length] = 0;
                    var po = new XMLHttpRequest;
                    return po.open("POST", this.masterUrl + "/createToken", !1), this._001210(po), po.send(uo), !!po.responseText && JSON.parse(po.responseText).token
                }
            }, {
                key: "_001207",
                value: function(co, mo) {
                    var go = this._001208(co, mo),
                        uo = new Uint8Array(10 + co.length + go.length);
                    uo[0] = 10, uo[1] = 4 + co.length, uo[2] = 10, uo[3] = co.length;
                    for (var ko = 0; ko < co.length; ko++) uo[4 + ko] = co.charCodeAt(ko);
                    uo[4 + co.length] = 18, uo[5 + co.length] = 0, uo[6 + co.length] = 26, uo[7 + co.length] = 8, uo[8 + co.length] = 10, uo[9 + co.length] = go.length;
                    for (var po = 0; po < go.length; po++) uo[10 + co.length + po] = go.charCodeAt(po);
                    var yo = new XMLHttpRequest;
                    yo.open("POST", this.masterUrl + "/getToken", !1), this._001210(yo), yo.send(uo);
                    var ho = JSON.parse(yo.responseText);
                    return ho.token = go, ho
                }
            }]), so
        }()),
        he = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001253(), this._001206()
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe("#join-party").click(function() {
                        co._001205()
                    }), oe("#create-party").click(function() {
                        co._001204()
                    })
                }
            }, {
                key: "_001206",
                value: function() {
                    for (var po, co = {
                            "US-Atlanta": "North America",
                            "BR-Brazil": "South America",
                            "EU-London": "Europe",
                            "RU-Russia": "Russia",
                            "TK-Turkey": "Turkey",
                            "JP-Tokyo": "East Asia",
                            "CN-China": "China",
                            "SG-Singapore": "Oceania"
                        }, mo = ye._001212().regions, go = Object.keys(co), uo = "", ko = 0; ko < go.length; ko++) po = go[ko], uo += "<option value=\"" + po + "\">" + co[po] + " (" + mo[po].numPlayers + ")</option>";
                    oe("#regions").html(uo)
                }
            }, {
                key: "_001205",
                value: function() {
                    if (!this._001202()) {
                        var co = oe("#regions").val(),
                            mo = this._001203();
                        if (mo) {
                            var go = ye._001209(co, mo);
                            console.log("IP: " + go), Qe._000934(go)
                        }
                    }
                }
            }, {
                key: "_001204",
                value: function() {
                    var co = oe("#regions").val(),
                        mo = oe("#gamemode").val(),
                        go = ye._001211(co, mo);
                    if (go.token) oe("#party-token").val(go.token);
                    else {
                        var uo = go.endpoints.http.match(/live-arena-([0-9a-z]{4,8})\.agar.\io\:\d{1,5}/),
                            ko = ":teams" === mo ? "TM" : ":experimental" === mo ? "EXP" : "FFA";
                        uo && uo[1] && oe("#party-token").val(ko + ":" + uo[1])
                    }
                    go.token ? Qe._000934(go.endpoints.http + "?party_id=" + go.token) : Qe._000934(go.endpoints.http)
                }
            }, {
                key: "_001203",
                value: function() {
                    var co = oe("#party-token").val().match(/\b[A-Z0-9]{6}\b/);
                    if (co && co[0]) {
                        var mo = co[0];
                        return oe("#party-token").val(mo), mo
                    }
                    return !1
                }
            }, {
                key: "_001202",
                value: function() {
                    var co = oe("#party-token").val(),
                        mo = co.match(/live-arena-[0-9a-z]{5,8}\.agar.\io\:\d{1,5}/);
                    if (mo && mo[0]) return Qe._000934(mo[0]), oe("#party-token").val(mo[0]), !0;
                    var go = co.match(/([A-Z]{2,3}):([0-9a-z]{5,8})/);
                    if (go && 3 === go.length) {
                        Qe._000934("live-arena-" + go[2] + ".agar.io:80");
                        var uo = "TM" === go[1] ? ":teams" : "EXP" === go[1] ? ":experimental" : "";
                        oe("#gamemode").val(uo)
                    }
                    return !1
                }
            }]), so
        }(),
        ve = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001327 = "6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl", this.initialised = !1
                }
            }, {
                key: "show",
                value: function(co) {
                    var mo = this;
                    console.log("Captcha"), oe("#Recaptcha-container").show(), this.initialised ? grecaptcha.reset() : (grecaptcha.render("Recaptcha", {
                        sitekey: this._001327,
                        callback: function(go) {
                            mo._001201(go, co)
                        }
                    }), this.initialised = !0)
                }
            }, {
                key: "_001201",
                value: function(co, mo) {
                    oo._000895(co, mo), oe("#Recaptcha-container").hide()
                }
            }]), so
        }(),
        Ce = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001251 = !1, this._001252 = oe("#theme"), this.selectedPreset = ae.get("theme", "selectedPreset") || "custom", this.skinBorder = ~~ae.get("theme", "skinBorder") || 100, this.lbSize = ~~ae.get("theme", "lbSize") || 110, this.minimapSize = ~~ae.get("theme", "minimapSize") || 200, this.chatFontSize = ~~ae.get("theme", "chatFontSize") || 14, this.cellTransparency = ~~ae.get("theme", "cellTransparency") || 100, this.lightenCellColor = ~~ae.get("theme", "lightenCellColor") || 100, this.borderWidth = ~~ae.get("theme", "borderWidth") || 60, this.borderColor = ae.get("theme", "borderColor") || "#ffffff", this.team1color = ae.get("theme", "team1color") || "#aeaeae", this.team2color = ae.get("theme", "team2color") || "#ff171f", this.multiboxActive = ae.get("theme", "multiboxActive") || "#ff61f8", this.multiboxInactive = ae.get("theme", "multiboxInactive") || "#fff", this.multiboxRingWidth = ~~ae.get("theme", "multiboxRingWidth") || 10, this.nickColor = ae.get("theme", "nickColor") || "#fff", this.nickStrokeColor = ae.get("theme", "nickStrokeColor") || "#000", this.cellNickSize = ~~ae.get("theme", "cellNickSize") || 120, this.nickFont = ae.get("theme", "nickFont") || "ubuntu", this.massColor = ae.get("theme", "massColor") || "#fff", this.massStrokeColor = ae.get("theme", "massStrokeColor") || "#000", this.cellMassSize = ~~ae.get("theme", "cellMassSize") || 150, this.massFont = ae.get("theme", "massFont") || "ubuntu", this.gridWidth = ~~ae.get("theme", "gridWidth") || 100, this.gridColor = ae.get("theme", "gridColor") || "#111", this.gridTextColor = ae.get("theme", "gridTextColor") || "#111", this.gridTextSize = ae.get("theme", "gridTextSize") || 1500, this.gridTextFont = ae.get("theme", "gridTextFont") || "ubuntu", this.foodSize = ~~ae.get("theme", "foodSize") || 1, this.foodColor = ae.get("theme", "foodColor") || "#6111ff", this.virusColor = ae.get("theme", "virusColor") || "#8f8f8f", this.virusBorderColor = ae.get("theme", "virusBorderColor") || "#c2c2c2", this.virusBorderWidth = ~~ae.get("theme", "virusBorderWidth") || 10, this.commanderColor = ae.get("theme", "commanderColor") || "#f5e35d", this.backgroundColor = ae.get("theme", "backgroundColor") || "#000000", this.indicatorSize = ~~ae.get("theme", "indicatorSize") || 100, this.cursor = ae.get("theme", "cursor") || 13, this._001192(), this._001254(), this._001253()
                }
            }, {
                key: "_001254",
                value: function() {
                    oe(".theme-options").each(function() {
                        var co = oe(this).attr("type");
                        "range" === co ? so._001249(this, 2) : "options" === co ? so._001250(this, 2) : "colorpicker" === co && so._001200(this)
                    }), this._001197(this.chatFontSize), this._001198(this.backgroundColor), this._001196(this.lbSize), this._001195(this.minimapSize), this._001194(this.cursor)
                }
            }, {
                key: "_001253",
                value: function() {
                    var co = this;
                    oe(".theme-container").perfectScrollbar(), oe(".theme-container .fa-chevron-left").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = oe(mo).parent(),
                                uo = oe(go).attr("type");
                            "options" === uo ? so._001250(go, 0) : "range" === uo && so._001249(go, 0)
                        })
                    }), oe(".theme-container span.outer").each(function() {
                        var mo = this;
                        oe(this).click(function(go) {
                            var uo = oe(mo).parent();
                            so._001249(uo, 3, go.offsetX)
                        })
                    }), oe(".theme-container .fa-chevron-right").each(function() {
                        var mo = this;
                        oe(this).click(function() {
                            var go = oe(mo).parent(),
                                uo = oe(go).attr("type");
                            "options" === uo ? so._001250(go, 1) : "range" === uo && so._001249(go, 1)
                        })
                    }), oe(".theme-close").click(function() {
                        return co.close()
                    })
                }
            }, {
                key: "toggle",
                value: function() {
                    this._001251 ? this.close() : this.open()
                }
            }, {
                key: "close",
                value: function() {
                    this._001251 = !1, this._001252.fadeOut(250)
                }
            }, {
                key: "open",
                value: function() {
                    this._001251 = !0, this._001252.fadeIn(250)
                }
            }, {
                key: "_001250",
                value: function(co, mo) {
                    for (var ho, go = oe(co).attr("name"), uo = oe(co).find("b"), ko = uo.length, po = ko, yo = 0; po--;) ho = uo[po], "active" === oe(ho).attr("class") && (yo = po);
                    if (1 === mo) {
                        var fo = yo + 1 < ko ? yo + 1 : 0;
                        oe(uo[yo]).removeAttr("class"), oe(uo[fo]).attr("class", "active");
                        var vo = oe(uo[fo]).attr("value");
                        this._001199(go, vo)
                    } else if (0 === mo) {
                        var Co = 0 < yo ? yo - 1 : ko - 1;
                        oe(uo[yo]).removeAttr("class"), oe(uo[Co]).attr("class", "active");
                        var So = oe(uo[Co]).attr("value");
                        this._001199(go, So)
                    } else if (2 === mo) {
                        oe(uo[yo]).removeAttr("class");
                        for (var xo, bo = ko; bo--;)
                            if (xo = uo[bo], oe(xo).attr("value") === this[go]) {
                                oe(xo).attr("class", "active");
                                break
                            }
                    }
                }
            }, {
                key: "_001249",
                value: function(co, mo) {
                    var go = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
                        uo = oe(co).attr("name"),
                        ko = oe(co).find("span"),
                        po = ko[0],
                        yo = ko[1],
                        ho = oe(ko[2]),
                        fo = ~~oe(po).attr("min"),
                        vo = ~~oe(po).attr("max"),
                        Co = ~~oe(po).attr("step"),
                        So = ~~oe(po).attr("value");
                    if (1 === mo && So + Co <= vo) {
                        var bo = Co + So;
                        oe(po).attr("value", bo), oe(yo).css("width", ~~(100 * (bo - fo) / (vo - fo)) + "px"), ho.text("[" + bo + "]"), this._001199(uo, ~~bo)
                    } else if (0 === mo && fo <= So - Co) {
                        var To = So - Co;
                        oe(po).attr("value", To), oe(yo).css("width", ~~(100 * (To - fo) / (vo - fo)) + "px"), ho.text("[" + To + "]"), this._001199(uo, ~~To)
                    } else if (2 === mo) {
                        var wo = this[uo];
                        oe(po).attr("value", wo), oe(yo).css("width", ~~(100 * (wo - fo) / (vo - fo)) + "px"), ho.text("[" + wo + "]")
                    } else if (3 === mo) {
                        var Mo = 0 | go / 100 * (vo - fo);
                        Mo = (0 | Mo / Co) * Co;
                        var Ao = 100 * ((Mo += fo) - fo) / (vo - fo);
                        oe(po).attr("value", Mo), oe(yo).css("width", ~~Ao + "px"), ho.text("[" + Mo + "]"), this._001199(uo, ~~Mo)
                    }
                }
            }, {
                key: "_001200",
                value: function(co) {
                    var mo = this,
                        go = oe(co).find("input"),
                        uo = go.attr("id"),
                        ko = this[uo];
                    oe(go).val(ko);
                    var po = !!~~go.attr("opacity");
                    oe("#" + uo).minicolors({
                        opacity: po,
                        position: "bottom right",
                        change: function(yo) {
                            mo._001199(uo, yo)
                        }
                    })
                }
            }, {
                key: "_001199",
                value: function(co, mo) {
                    this[co] = mo, "selectedPreset" === co ? this._001193(mo) : "custom" !== this.selectedPreset && (this.selectedPreset = "custom", ae.set("theme", "selectedPreset", "custom"), this._001254()), "backgroundColor" === co && this._001198(mo), "chatFontSize" === co && this._001197(mo), "lbSize" === co && this._001196(mo), "minimapSize" === co && this._001195(mo), "cursor" === co && this._001194(mo), "massFont" === co && Ie._001010(), "nickFont" === co && Ie._001013(), "massStrokeColor" === co && Ie._001021.clear(), "nickStrokeColor" === co && Ie._001022.clear(), "massColor" === co && Ie._001021.clear(), "nickColor" === co && Ie._001022.clear(), ae.set("theme", co, mo)
                }
            }, {
                key: "_001198",
                value: function(co) {
                    oe("body").css("background", co)
                }
            }, {
                key: "_001197",
                value: function(co) {
                    oe("#notifications").css("font-size", co + "px")
                }
            }, {
                key: "_001196",
                value: function(co) {
                    var mo = co / 100;
                    oe("#leaderboard-head").css("font-size", (0 | 24 * mo) + "px"), oe("#leaderboard-positions").css("font-size", (0 | 13 * mo) + "px")
                }
            }, {
                key: "_001195",
                value: function(co) {
                    we._001169 && (we.size = co, we._001044.width = co, we._001044.height = co), oe("#minimap-hud, .minimap-grid").css({
                        width: co + "px",
                        height: co + "px"
                    }), oe(".minimap-row").css({
                        width: co + "px",
                        height: (0 | co / 5) + "px"
                    }), oe(".minimap-sector").css({
                        width: (0 | co / 5) + "px",
                        height: (0 | co / 5) + "px",
                        "font-size": (0 | 15 * co / 200) + "px",
                        "padding-top": (0 | 11 * co / 200) + "px"
                    }), oe(".minimap-head").css("bottom", co + 9 + "px")
                }
            }, {
                key: "_001194",
                value: function(co) {
                    return 1 === co ? (oe("body").css("cursor", "url(),auto"), oe("#cursorOff").show(), void oe("#cursorDisplay").hide()) : void(oe("body").css("cursor", "url(https://storage.googleapis.com/mubox/V5/" + co + ".cur),auto"), oe("#cursorDisplay").attr("src", "https://storage.googleapis.com/mubox/V5/" + co + ".cur"), oe("#cursorDisplay").show(), oe("#cursorOff").hide())
                }
            }, {
                key: "_001193",
                value: function(co) {
                    var mo = this.presets[co];
                    if ("custom" !== co && mo) {
                        for (var go in mo.theme) mo.theme.hasOwnProperty(go) && void 0 !== this[go] && (this[go] = mo.theme[go], ae.set("theme", go, this[go]));
                        for (var uo in this._001254(), mo.settings) mo.settings.hasOwnProperty(uo) && void 0 !== se[uo] && (se[uo] = mo.settings[uo], ae.set("settings", uo, se[uo]));
                        se._001254()
                    }
                }
            }, {
                key: "_001192",
                value: function() {
                    this.presets = {
                        "Agarplus v2": {
                            author: "Acydwarp",
                            theme: {
                                skinBorder: 100,
                                lbSize: 110,
                                minimapSize: 200,
                                chatFontSize: 18,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 40,
                                borderColor: "#ffffff",
                                team1color: "#aeaeae",
                                team2color: "#fff700",
                                nickColor: "#fff",
                                nickStrokeColor: "#000",
                                cellNickSize: 140,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000",
                                cellMassSize: 140,
                                massFont: "ubuntu",
                                gridWidth: 100,
                                gridColor: "#1a1a1a",
                                gridTextColor: "#1a1a1a",
                                gridTextSize: 1700,
                                gridTextFont: "ubuntu",
                                foodSize: 5,
                                foodColor: "#0849d4",
                                virusColor: "#808080",
                                virusBorderColor: "#9e9e9e",
                                virusBorderWidth: 10,
                                commanderColor: "#0849d4",
                                backgroundColor: "#000000",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 120,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "full",
                                food: "monoColored",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        },
                        HKG: {
                            author: "Num Jai",
                            theme: {
                                skinBorder: 100,
                                lbSize: 110,
                                minimapSize: 200,
                                chatFontSize: 18,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 60,
                                borderColor: "#ffffff",
                                team1color: "#aeaeae",
                                team2color: "#fff700",
                                nickColor: "#fff",
                                nickStrokeColor: "#000",
                                cellNickSize: 130,
                                nickFont: "sans-serif",
                                massColor: "#fff",
                                massStrokeColor: "#000",
                                cellMassSize: 130,
                                massFont: "sans-serif",
                                gridWidth: 100,
                                gridColor: "#1a1a1a",
                                gridTextColor: "#1a1a1a",
                                gridTextSize: 1700,
                                gridTextFont: "ubuntu",
                                foodSize: 5,
                                foodColor: "#6111ff",
                                virusColor: "#808080",
                                virusBorderColor: "#9e9e9e",
                                virusBorderWidth: 10,
                                commanderColor: "#0849d4",
                                backgroundColor: "#000000",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 120,
                                eatAnimation: "on",
                                cellTextAnimation: "off",
                                cellMass: "full",
                                food: "monoColored",
                                bgSectors: "off",
                                vanillaGrid: "off"
                            }
                        },
                        "Ogario v4": {
                            author: "Szymy",
                            theme: {
                                skinBorder: 100,
                                lbSize: 100,
                                minimapSize: 240,
                                chatFontSize: 18,
                                cellTransparency: 100,
                                lightenCellColor: 90,
                                borderWidth: 40,
                                borderColor: "#01d9cc",
                                team1color: "#aeaeae",
                                team2color: "#fff700",
                                nickColor: "#fff",
                                nickStrokeColor: "#000",
                                cellNickSize: 120,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000",
                                cellMassSize: 160,
                                massFont: "ubuntu",
                                gridWidth: 40,
                                gridColor: "#00243e",
                                gridTextColor: "#00243e",
                                gridTextSize: 1200,
                                gridTextFont: "ubuntu",
                                foodSize: 5,
                                foodColor: "#5000ff",
                                virusColor: "#002f52",
                                virusBorderColor: "#00b9e8",
                                virusBorderWidth: 14,
                                commanderColor: "#0849d4",
                                backgroundColor: "#000a11",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 140,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "shortened",
                                food: "monoColored",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        },
                        Yin: {
                            author: "DaChong",
                            theme: {
                                skinBorder: 100,
                                lbSize: 130,
                                minimapSize: 200,
                                chatFontSize: 18,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 10,
                                borderColor: "#116111",
                                team1color: "#aeaeae",
                                team2color: "#fff700",
                                nickColor: "#fff",
                                nickStrokeColor: "#000",
                                cellNickSize: 100,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000",
                                cellMassSize: 100,
                                massFont: "ubuntu",
                                gridWidth: 10,
                                gridColor: "#333333",
                                gridTextColor: "#333333",
                                gridTextSize: 1700,
                                gridTextFont: "ubuntu",
                                foodSize: 1,
                                foodColor: "#555",
                                virusColor: "#6fff00",
                                virusBorderColor: "#55b304",
                                virusBorderWidth: 14,
                                commanderColor: "#00fff7",
                                backgroundColor: "#000000",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 120,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "full",
                                food: "rainbow",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        },
                        VNDOT: {
                            author: "KSCC",
                            theme: {
                                skinBorder: 100,
                                lbSize: 100,
                                minimapSize: 200,
                                chatFontSize: 18,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 10,
                                borderColor: "#333333",
                                team1color: "#aeaeae",
                                team2color: "#fff700",
                                nickColor: "#fff",
                                nickStrokeColor: "#000",
                                cellNickSize: 110,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000",
                                cellMassSize: 110,
                                massFont: "ubuntu",
                                gridWidth: 10,
                                gridColor: "#333333",
                                gridTextColor: "#444444",
                                gridTextSize: 1200,
                                gridTextFont: "ubuntu",
                                foodSize: 1,
                                foodColor: "#4b6efa",
                                virusColor: "#6fff00",
                                virusBorderColor: "#55b304",
                                virusBorderWidth: 14,
                                commanderColor: "#00fff7",
                                backgroundColor: "#111",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 120,
                                eatAnimation: "on",
                                cellTextAnimation: "stepped",
                                cellMass: "shortened",
                                food: "monoColored",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        },
                        OZYDOT: {
                            author: "Eric",
                            theme: {
                                skinBorder: 100,
                                lbSize: 100,
                                minimapSize: 200,
                                chatFontSize: 14,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 20,
                                borderColor: "#666666",
                                team1color: "#aeaeae",
                                team2color: "#fff700",
                                nickColor: "#fff",
                                nickStrokeColor: "#000",
                                cellNickSize: 110,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#444",
                                cellMassSize: 140,
                                massFont: "oswald",
                                gridWidth: 100,
                                gridColor: "#222222",
                                gridTextColor: "#222222",
                                gridTextSize: 1400,
                                gridTextFont: "sans-serif",
                                foodSize: 1,
                                foodColor: "#c9d3f5",
                                virusColor: "#e0e0e0",
                                virusBorderColor: "#9c9c9c",
                                virusBorderWidth: 10,
                                commanderColor: "#ffffff",
                                backgroundColor: "#000000",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 120,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "full",
                                food: "monoColored",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        },
                        "HSLO v2": {
                            author: "2coolife",
                            theme: {
                                skinBorder: 100,
                                lbSize: 110,
                                minimapSize: 180,
                                chatFontSize: 16,
                                cellTransparency: 100,
                                lightenCellColor: 90,
                                borderWidth: 20,
                                borderColor: "#ffffff",
                                team1color: "#aeaeae",
                                team2color: "#fff700",
                                nickColor: "#fff",
                                nickStrokeColor: "#000",
                                cellNickSize: 120,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000000",
                                cellMassSize: 120,
                                massFont: "ubuntu",
                                gridWidth: 10,
                                gridColor: "#007777",
                                gridTextColor: "#333333",
                                gridTextSize: 1600,
                                gridTextFont: "oswald",
                                foodSize: 5,
                                foodColor: "#666666",
                                virusColor: "#444444",
                                virusBorderColor: "#007777",
                                virusBorderWidth: 14,
                                commanderColor: "#ffffff",
                                backgroundColor: "#222",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 140,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "shortened",
                                food: "monoColored",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        },
                        "HSLO v3": {
                            author: "2coolife",
                            theme: {
                                skinBorder: 90,
                                lbSize: 100,
                                minimapSize: 180,
                                chatFontSize: 14,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 40,
                                borderColor: "#ff006f",
                                team1color: "#aeaeae",
                                team2color: "#ff006f",
                                nickColor: "#fff",
                                nickStrokeColor: "#000000",
                                cellNickSize: 110,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000000",
                                cellMassSize: 110,
                                massFont: "ubuntu",
                                gridWidth: 10,
                                gridColor: "#121212",
                                gridTextColor: "#121212",
                                gridTextSize: 1400,
                                gridTextFont: "oswald",
                                foodSize: 1,
                                foodColor: "#555555",
                                virusColor: "#444444",
                                virusBorderColor: "#ff006f",
                                virusBorderWidth: 10,
                                commanderColor: "#ff006f",
                                backgroundColor: "#000000",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 140,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "shortened",
                                food: "monoColored",
                                bgSectors: "snowflakes",
                                vanillaGrid: "off"
                            }
                        },
                        "HSLO v4": {
                            author: "2coolife",
                            theme: {
                                skinBorder: 90,
                                lbSize: 100,
                                minimapSize: 180,
                                chatFontSize: 14,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 20,
                                borderColor: "#ff9900",
                                team1color: "#aeaeae",
                                team2color: "#ff006f",
                                nickColor: "#fff",
                                nickStrokeColor: "#000000",
                                cellNickSize: 110,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000000",
                                cellMassSize: 120,
                                massFont: "ubuntu",
                                gridWidth: 10,
                                gridColor: "#ff9900",
                                gridTextColor: "#333333",
                                gridTextSize: 1300,
                                gridTextFont: "ubuntu",
                                foodSize: 1,
                                foodColor: "#555555",
                                virusColor: "#444444",
                                virusBorderColor: "#ff9900",
                                virusBorderWidth: 10,
                                commanderColor: "#ff006f",
                                backgroundColor: "#222222",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 140,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "shortened",
                                food: "monoColored",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        },
                        Pastels: {
                            author: "2coolife",
                            theme: {
                                skinBorder: 90,
                                lbSize: 100,
                                minimapSize: 180,
                                chatFontSize: 14,
                                cellTransparency: 100,
                                lightenCellColor: 100,
                                borderWidth: 40,
                                borderColor: "#f5d25f",
                                team1color: "#aeaeae",
                                team2color: "#ff006f",
                                nickColor: "#fff",
                                nickStrokeColor: "#000000",
                                cellNickSize: 110,
                                nickFont: "ubuntu",
                                massColor: "#fff",
                                massStrokeColor: "#000000",
                                cellMassSize: 120,
                                massFont: "ubuntu",
                                gridWidth: 10,
                                gridColor: "#fa676c",
                                gridTextColor: "#333333",
                                gridTextSize: 1300,
                                gridTextFont: "oswald",
                                foodSize: 1,
                                foodColor: "#555555",
                                virusColor: "#7a4ba3",
                                virusBorderColor: "#ead2fa",
                                virusBorderWidth: 14,
                                commanderColor: "#ff006f",
                                backgroundColor: "#222222",
                                indicatorSize: 100,
                                cursor: 1
                            },
                            settings: {
                                CellAnimation: 140,
                                eatAnimation: "on",
                                cellTextAnimation: "on",
                                cellMass: "shortened",
                                food: "monoColored",
                                bgSectors: "normal",
                                vanillaGrid: "off"
                            }
                        }
                    }
                }
            }]), so
        }(),
        Se = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001252 = oe("#notifications"), this._001191 = 1e4, this._001190 = 500, this._001189 = "<i class=\"fa fa-comment\"></i>", this._001188 = "<i class=\"fa fa-exclamation-circle\"></i>", this._001187 = "<i class=\"fa fa-bell\"></i>", this._001186 = oe("#chatroom"), this._001185 = "http://2coolife.com/HSLOv430/emojis/", this._001184 = {
                        ":01:": "angry.png",
                        ":02:": "angry-1.png",
                        ":03:": "cool.png",
                        ":04:": "crying.png",
                        ":05:": "crying-1.png",
                        ":06:": "embarrassed.png",
                        ":07:": "happy.png",
                        ":08:": "happy-1.png",
                        ":09:": "happy-2.png",
                        ":10:": "in-love.png",
                        ":11:": "kiss.png",
                        ":12:": "laughing.png",
                        ":13:": "laughing-1.png",
                        ":14:": "poo.png",
                        ":15:": "sad.png",
                        ":16:": "sad-1.png",
                        ":17:": "shocked.png",
                        ":18:": "shocked-1.png",
                        ":19:": "sick.png",
                        ":20:": "sleeping.png",
                        ":21:": "thinking.png",
                        ":22:": "tongue.png",
                        ":23:": "tongue-1.png",
                        ":24:": "vomit.png",
                        ":25:": "wink.png",
                        ":26:": "thinking-distort.png",
                        ":27:": "pepe-thumbsup.png",
                        ":28:": "pepe-hype.png",
                        ":29:": "pepe-tears2much.png",
                        ":30:": "pepe-gunfire.gif",
                        ":31:": "pepe-okgame.png",
                        ":32:": "pepe-heart.png",
                        ":33:": "parrot-thuglife.gif",
                        ":34:": "blob-happy.png",
                        ":35:": "leny.png"
                    }
                }
            }, {
                key: "_001183",
                value: function() {
                    var co = this,
                        mo = oe("#emojiContainer"),
                        go = function(ko) {
                            var po = oe("<img src=\"" + (co._001185 + co._001184[ko]) + "\" class=\"emojiPreview\">");
                            po.click(function() {
                                var yo = oe("#message"),
                                    ho = yo.val();
                                yo.val(ho + " " + ko), Ae.input.focus()
                            }), mo.append(po)
                        };
                    for (var uo in this._001184) go(uo)
                }
            }, {
                key: "_001182",
                value: function(co, mo) {
                    if (this.chatroom(co, mo, this._001189), "chatroom" !== se.chatType) {
                        var go = "<div><div class=\"normal\">" + this._001189 + "<span class=\"nick\">" + co + "</span><span class=\"message\">" + this._001179(this._001180(mo)) + "</span></div></div>";
                        this.append(go)
                    }
                }
            }, {
                key: "command",
                value: function(co, mo) {
                    if ("on" === se.sounds && be._000874.play(), this.chatroom(co, mo, this._001188), "chatroom" !== se.chatType) {
                        var go = "<div><div class=\"command\">" + this._001188 + "<span class=\"nick\">" + co + "</span><span class=\"message\">" + this._001180(mo) + "</span></div></div>";
                        this.append(go)
                    }
                }
            }, {
                key: "_001181",
                value: function(co, mo) {
                    if ("on" === se.sounds && be._000874.play(), this.chatroom(co, mo, this._001187), "chatroom" !== se.chatType) {
                        var go = "<div><div class=\"alert\">" + this._001187 + "<span class=\"nick\">" + co + "</span><span class=\"message\">" + this._001180(mo) + "</span></div></div>";
                        this.append(go)
                    }
                }
            }, {
                key: "append",
                value: function(co) {
                    var mo = this,
                        go = oe(co);
                    go.slideUp(0), go.appendTo(this._001252), go.slideDown(this._001190), setTimeout(function() {
                        go.slideUp(mo._001190, function() {
                            go.remove()
                        })
                    }, this._001191)
                }
            }, {
                key: "_001180",
                value: function(co) {
                    return co.replace(/</g, "(").replace(/>/g, ")").replace(/&/g, "and")
                }
            }, {
                key: "_001179",
                value: function(co) {
                    for (var mo in this._001184) {
                        var go = new RegExp(mo, "g");
                        co = co.replace(go, "<img src=\"" + (this._001185 + this._001184[mo]) + "\">")
                    }
                    return co
                }
            }, {
                key: "chatroom",
                value: function(co, mo, go) {
                    var uo = new Date,
                        ko = uo.getHours() + ":" + uo.getMinutes();
                    this._001186.append("<div class=\"chatroom-row\"><span class=\"chattime\">" + ko + "</span> " + go + " <span class=\"nick\">" + co + "</span> <span class=\"message\">" + this._001179(this._001180(mo)) + "</span></div>"), this._001186.scrollTop(this._001186[0].scrollHeight)
                }
            }]), so
        }(),
        be = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._000874 = {
                        play: function() {}
                    }, this.bellAlert = {
                        play: function() {}
                    }, this.wasted = {
                        play: function() {}
                    }
                }
            }]), so
        }(),
        xe = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    var co = this;
                    this._001178 = !1, this.token = null;
                    var mo = ae.get("extras", "fbToken");
                    mo && (mo.expiry > Date.now() ? (this.token = mo.token, this._001178 = !0, oe("#login-facebook").addClass("active"), oo._000892(), Se._001181("Facebook", re._001256.notif.login_lastSession)) : ae.set("extras", "fbToken", !1)), ee.FB ? FB.init({
                        appId: 677505792353827,
                        cookie: !0,
                        xfbml: !0,
                        status: !0,
                        version: "v2.0"
                    }) : Se._001181("Facebook", re._001256.notif.sdk_error), oe("#login-facebook").click(function() {
                        co._001178 ? Se._001181("Facebook", re._001256.notif.alreadyLoggedIn) : co.login()
                    }), oe("#logout").click(function() {
                        co.logout()
                    })
                }
            }, {
                key: "login",
                value: function() {
                    var co = this;
                    ee.FB ? ee.FB.login(function(mo) {
                        co._001177(mo)
                    }, {
                        scope: "public_profile, email"
                    }) : Se._001181("Facebook", re._001256.notif.sdk_error)
                }
            }, {
                key: "_001177",
                value: function(co) {
                    co.authResponse ? (this.token = co.authResponse.accessToken, ae.set("extras", "fbToken", {
                        token: this.token,
                        expiry: Date.now() + 1e3 * co.authResponse.expiresIn
                    }), this._001178 = !0, oe("#login-facebook").addClass("active"), oo._000892(), Se._001181("Facebook", re._001256.notif.login_success)) : Se._001181("Facebook", re._001256.notif.login_error)
                }
            }, {
                key: "logout",
                value: function() {
                    var co = this;
                    this._001178 && FB.logout(function(mo) {
                        mo.authResponse && (co._001178 = !1, co.token = null, oe("#login-facebook").removeClass("active"), Se._001181("Facebook", re._001256.notif.logout), ae.set("extras", "fbToken", !1))
                    })
                }
            }]), so
        }(),
        Te = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    var co = this;
                    this._001178 = !1, this.token = null;
                    var mo = ae.get("extras", "googleToken");
                    mo && (mo.expiry > Date.now() ? (this.token = mo.token, this._001178 = !0, oe("#login-google").addClass("active"), oo._000891(), Se._001181("Google+", re._001256.notif.login_lastSession)) : ae.set("extras", "googleToken", !1)), ee.gapi ? ee.gapi.load("auth2", function() {
                        var go = gapi.auth2.init({
                                client_id: "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
                                cookiepolicy: "single_host_origin"
                            }),
                            uo = te.getElementById("login-google");
                        go.attachClickHandler(uo, {}, function(ko) {
                            co._001177(ko)
                        }, function(ko) {
                            console.log(ko)
                        })
                    }) : Se._001181("Google+", re._001256.notif.sdk_error), oe("#logout").click(function() {
                        co.logout()
                    })
                }
            }, {
                key: "_001177",
                value: function(co) {
                    var mo = co.getAuthResponse(!0),
                        go = mo.access_token;
                    go ? (this.token = go, ae.set("extras", "googleToken", {
                        token: this.token,
                        expiry: mo.expires_at
                    }), this._001178 = !0, oe("#login-google").addClass("active"), oo._000891(), Se._001181("Google+", re._001256.notif.login_success)) : Se._001181("Google+", re._001256.notif.login_error)
                }
            }, {
                key: "logout",
                value: function() {
                    this._001178 && (gapi.auth2.getAuthInstance().signOut(), this._001178 = !1, this.token = null, oe("#login-google").removeClass("active"), Se._001181("Google+", re._001256.notif.logout), ae.set("extras", "googleToken", !1))
                }
            }]), so
        }(),
        ze = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001176 = this._001170(), this.list = new Set, this._001252 = oe("#leaderboard-positions")[0], this._001175 = oe("#leaderboard-chart"), this._001174 = !1, this._001173 = te.createElement("style"), oe("head").append(this._001173)
                }
            }, {
                key: "add",
                value: function(co, mo, go, uo, ko) {
                    this.list.add({
                        nick: co,
                        position: mo,
                        isSelf: go,
                        _001101: ko,
                        _001102: uo
                    })
                }
            }, {
                key: "_001172",
                value: function(co, mo, go) {
                    this._001174 || (this._001175.show(), this._001252.innerHTML = "", this._001174 = !0), this._001173.innerText = ".chart-bar.red { width: " + (0 | 150 * co) + "px } .chart-bar.green { width: " + (0 | 150 * mo) + "px } .chart-bar.blue { width: " + (0 | 150 * go) + "px }"
                }
            }, {
                key: "clear",
                value: function() {
                    this.list.clear()
                }
            }, {
                key: "_001258",
                value: function() {
                    this._001174 && (this._001175.hide(), this._001174 = !1);
                    let co = "";
                    for (const mo of this.list.values()) co += "<span>" + this._001171(mo.nick) + " <strong>  " + mo.position + "</strong></span>";
                    this._001252.innerHTML = co
                }
            }, {
                key: "_001171",
                value: function(co) {
                    return co.replace(/</g, "(").replace(/>/g, ")")
                }
            }, {
                key: "_001170",
                value: function() {
                    var co = [],
                        mo = oe(".lb-position"),
                        go = !0,
                        uo = !1,
                        ko;
                    try {
                        for (var po, yo = mo[Symbol.iterator](); !(go = (po = yo.next()).done); go = !0) {
                            var ho = po.value,
                                fo = oe(ho).children(),
                                vo = fo[0],
                                Co = fo[1];
                            co.push({
                                element: ho,
                                nick: vo,
                                position: Co,
                                hidden: !1
                            })
                        }
                    } catch (So) {
                        uo = !0, ko = So
                    } finally {
                        try {
                            !go && yo.return && yo.return()
                        } finally {
                            if (uo) throw ko
                        }
                    }
                    return co
                }
            }]), so
        }(),
        we = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001169 = !0, this._001044 = oe("#minimap-nodes")[0], this.size = Ce.minimapSize, this._001044.width = this.size, this._001044.height = this.size, this._001168 = 2 * Math.PI, this._001167 = this._001044.getContext("2d"), this._001167.textAlign = "center", this._001167.textBaseline = "bottom", this._001167.font = "500 12px ubuntu", this._001167.lineWidth = 2, this._001166 = 0
                }
            }, {
                key: "_000867",
                value: function() {
                    var co = this._001167,
                        mo = this.size / We._001043,
                        go = Ee._001029;
                    if (co.clearRect(0, 0, this.size, this.size), co.fillStyle = "rgba(50, 50, 50, 0.4)", co.fillRect(0 | (go.left - We._001042.x + 7071) * mo, 0 | (go.top - We._001042.y + 7071) * mo, 0 | (go.right - go.left) * mo, 0 | (go.bottom - go.top) * mo), no._000878 && (!Ee._001025 || Ee._001024)) {
                        no._000877._001087();
                        var uo = no._000877._001048,
                            ko = no._000877._001047;
                        co.beginPath(), co.arc(uo, ko, 7, 0, this._001168, !1), co.closePath(), co.fillStyle = "#fff", co.fill(), co.stroke(), co.fillText(re._001256.huds.num1position || "#1 position", uo, ko - 8)
                    }
                    co.strokeStyle = "#666";
                    var po = (7071 - We._001042.x + Ne._001069.x) * mo,
                        yo = (7071 - We._001042.y + Ne._001069.y) * mo;
                    co.beginPath(), co.moveTo(po - 4, yo - 4), co.lineTo(po + 4, yo + 4), co.moveTo(po - 4, yo + 4), co.lineTo(po + 4, yo - 4), co.closePath(), co.stroke(), co.strokeStyle = "rgba(51, 51, 51, 0.5)";
                    var ho = (7071 - We._001042.x + Ee.x) * mo,
                        fo = (7071 - We._001042.y + Ee.y) * mo,
                        vo = Ne._001058 ? 5 : 6;
                    co.beginPath(), co.arc(ho, fo, vo, 0, this._001168, !1), co.closePath(), co.fillStyle = "#fff", co.fill(), co.stroke(), no._000882 ? this._001165() : this._001164()
                }
            }, {
                key: "_001165",
                value: function() {
                    var co = this._001167;
                    co.textAlign = "center";
                    var mo = !0,
                        go = !(co.textBaseline = "bottom"),
                        uo;
                    try {
                        for (var ko, yo, po = no._000884.values()[Symbol.iterator](); !(mo = (ko = po.next()).done); mo = !0)
                            if (yo = ko.value, yo._001058 && (!this._001166 || this._001166 === yo._001172)) {
                                yo._001087();
                                var ho = yo._001048,
                                    fo = yo._001047;
                                co.beginPath(), co.arc(ho, fo, 5, 0, this._001168, !1), co.closePath(), co.fillStyle = "#fff", 0 < yo.nick.length && co.fillText(yo.nick, ho, fo - 6), co.fillStyle = 1 === yo._001172 ? Ce.team1color : Ce.team2color, co.fill(), co.stroke()
                            }
                    } catch (vo) {
                        go = !0, uo = vo
                    } finally {
                        try {
                            !mo && po.return && po.return()
                        } finally {
                            if (go) throw uo
                        }
                    }
                }
            }, {
                key: "_001164",
                value: function() {
                    var co = this._001167;
                    co.textAlign = "center", co.textBaseline = "bottom", co.beginPath();
                    var mo = !0,
                        go = !1,
                        uo;
                    try {
                        for (var ko, yo, po = no._000884.values()[Symbol.iterator](); !(mo = (ko = po.next()).done); mo = !0)
                            if (yo = ko.value, yo._001058) {
                                yo._001087();
                                var ho = yo._001048,
                                    fo = yo._001047;
                                co.moveTo(ho + 5, fo), co.arc(ho, fo, 5, 0, this._001168, !1), 0 < yo.nick.length && co.fillText(yo.nick, ho, fo - 6)
                            }
                    } catch (vo) {
                        go = !0, uo = vo
                    } finally {
                        try {
                            !mo && po.return && po.return()
                        } finally {
                            if (go) throw uo
                        }
                    }
                    co.closePath(), co.fillStyle = "#555", co.fill()
                }
            }]), so
        }(),
        Ke = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001163 = 0, this._001162 = ro._000854, this._001252 = oe("#fps-hud")[0]
                }
            }, {
                key: "_000867",
                value: function() {
                    this._001163++, 1e3 > ro._000854 - this._001162 || (this._001162 = ro._000854, this._001252.innerHTML = this._001163 + "fps [" + (0 | ro._000855._001263) + "Hz]", this._001163 = 0)
                }
            }]), so
        }(),
        Me = new(function() {
            function so() {
                _classCallCheck(this, so), this._001161 = 0, this._001160 = 0, this._001159 = 0, this._001158 = 0, this.html = "", this._001157 = [], this._001252 = {
                    positions: oe("#teamlist-positions")[0],
                    _001159: oe("#teamlist-alive span")[0],
                    _001158: oe("#teamlist-spectate span")[0],
                    _001160: oe("#teamlist-totalmass span")[0]
                }
            }
            return _createClass(so, [{
                key: "_001258",
                value: function() {
                    1e3 > ro._000854 - this._001161 || (this._001161 = ro._000854, this._001156(), this._001252.positions.innerHTML = this.html, this._001252._001159.innerHTML = this._001159, this._001252._001158.innerHTML = this._001158, this._001252._001160.innerHTML = this._001160, this._001036())
                }
            }, {
                key: "_001156",
                value: function() {
                    var co = this;
                    no._000884.forEach(function(ho) {
                        ho._001058 ? (co._001160 += ho._001072, co._001157.push(ho), co._001159++) : co._001158++
                    }), this._001157.sort(function(ho, fo) {
                        return fo._001072 - ho._001072
                    }), this._001157.splice(5), Ne._001058 ? (this._001160 += Ne._001072, this._001157.push(Ne), this._001159++) : this._001158++;
                    var mo = !0,
                        go = !1,
                        uo;
                    try {
                        for (var ko, yo, po = this._001157[Symbol.iterator](); !(mo = (ko = po.next()).done); mo = !0) yo = ko.value, this._001155(yo)
                    } catch (ho) {
                        go = !0, uo = ho
                    } finally {
                        try {
                            !mo && po.return && po.return()
                        } finally {
                            if (go) throw uo
                        }
                    }
                }
            }, {
                key: "_001155",
                value: function(co) {
                    var mo = 100 * co._001072 / this._001160;
                    this.html += "<div class=\"tl-player\"><div class=\"tl-player-mass\">" + co._001072 + "</div><div class=\"tl-player-nick\">" + this._001171(co.nick) + "</div><div class=\"tl-player-massbar\"><div class=\"tl-player-massbar-inner\" style=\"width: " + (0 | mo) + "%;\"></div></div></div>"
                }
            }, {
                key: "_001036",
                value: function() {
                    this._001160 = 0, this._001159 = 0, this._001158 = 0, this._001157 = [], this.html = ""
                }
            }, {
                key: "_001171",
                value: function(co) {
                    return co.replace(/</g, "(").replace(/>/g, ")")
                }
            }]), so
        }()),
        Ae = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    var co = this;
                    this._001153 = oe("#message-hud"), this.input = oe("#message"), this._001251 = !1, this._001154 = !1, this.input.blur(function() {
                        co._001154 = !1
                    }), this.input.focus(function() {
                        co._001154 = !0
                    }), this.chatroom = oe("#chatroom"), this.chatroom.perfectScrollbar()
                }
            }, {
                key: "enter",
                value: function() {
                    if (!this._001251) this._001153.show(), this._001251 = !0, this.input.focus();
                    else if (this._001154) {
                        var co = this.input.val();
                        0 < co.length && (100 < co.length && (co = co.substring(0, 100)), io._000874(1, co), this.input.val("")), this.input.blur(), this._001153.hide(), this._001251 = !1
                    } else this.input.focus()
                }
            }]), so
        }(),
        Fe = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001161 = 0, this._001252 = oe("#stats-hud")[0], this._001145 = "<i class=\"fa fa-lock\"></i>", this._001144 = "<i class=\"fa fa-unlock-alt\"></i>", this._001143 = "<i class=\"fa fa-tachometer\"></i>", this._001142 = "<i class=\"fa fa-pause-circle\"></i>"
                }
            }, {
                key: "_001258",
                value: function() {
                    1e3 < ro._000854 - this._001161 && (this._001161 = ro._000854, this._001221())
                }
            }, {
                key: "_001221",
                value: function() {
                    var co = "";
                    Ne._001058 && (co += this._001151 + this._001150 + this._001149 + this._001148), co += this._001147 + this._001146 + this._001152, this._001252.innerHTML = co
                }
            }, {
                key: "_001152",
                get: function() {
                    return "on" === se.autoZoom ? this._001145 : this._001144
                }
            }, {
                key: "_001151",
                get: function() {
                    return (re._001256.huds._001151 || "Score") + ": " + Ne._001151 + "   "
                }
            }, {
                key: "_001150",
                get: function() {
                    return "[" + Ne._001055 + "/16]   "
                }
            }, {
                key: "_001149",
                get: function() {
                    var co = Ne._001071;
                    return 35 < co ? "STE: " + (0 | co * (1e3 > co ? .35 : .38)) + "   " : ""
                }
            }, {
                key: "_001148",
                get: function() {
                    return Ne._001073 += (Ne._001148 - Ne._001073) / 3, Ne._001148 = 0, this._001143 + " " + (0 | Ne._001073) + "px/s   "
                }
            }, {
                key: "_001147",
                get: function() {
                    var co = Qe._000938.in,
                        mo = Qe._000938.out;
                    return Qe._000938.in = 0, Qe._000938.out = 0, "PIO: " + co + "|" + mo + "   "
                }
            }, {
                key: "_001146",
                get: function() {
                    return Ne._001070 ? "[" + this._001142 + " " + (re._001256.huds._001146 || "Paused") + "]   " : ""
                }
            }]), so
        }(),
        Le = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001153 = oe("#targeting-hud"), this._001141 = oe("#targeting-no-1"), this._001140 = oe("#targeting-mouse"), this._001139 = oe("#targeting-players"), this._001138 = oe("#targeting-playersMass span.mass")[0], this._001137 = {
                        nick: oe("#targeting-player1 span.nick")[0],
                        _001072: oe("#targeting-player1 span.mass")[0]
                    }, this._001136 = {
                        nick: oe("#targeting-player2 span.nick")[0],
                        _001072: oe("#targeting-player2 span.mass")[0]
                    }, this._001162 = ro._000854
                }
            }, {
                key: "_001258",
                value: function() {
                    if (!(1e3 > ro._000854 - this._001162) && (this._001162 = ro._000854, Ee._001024 && qe._000968)) {
                        var co = 0;
                        qe._000975._000974 ? (this._001137.nick.innerHTML = qe._000975.nick, this._001137._001072.innerHTML = qe._000975._000972 ? "OUT OF VIEW" : qe._000975._001072, co += qe._000975._000972 ? 0 : qe._000975._001072) : (this._001137.nick.innerHTML = "Target 1", this._001137._001072.innerHTML = "NOT SELECTED"), qe._000971._000974 ? (this._001136.nick.innerHTML = qe._000971.nick, this._001136._001072.innerHTML = qe._000971._000972 ? "OUT OF VIEW" : qe._000971._001072, co += qe._000971._000972 ? 0 : qe._000971._001072) : (this._001136.nick.innerHTML = "Target 2", this._001136._001072.innerHTML = "NOT SELECTED"), this._001138.innerHTML = co
                    }
                }
            }, {
                key: "show",
                value: function() {
                    this._001153.show()
                }
            }, {
                key: "hide",
                value: function() {
                    this._001153.hide()
                }
            }, {
                key: "_001135",
                value: function() {
                    this._001141.show(), this._001140.hide(), this._001139.hide(), oe("#spectate-mode-top").addClass("active"), oe("#spectate-mode-mouse").removeClass("active"), oe("#spectate-mode-target").removeClass("active")
                }
            }, {
                key: "_001134",
                value: function() {
                    this._001140.show(), this._001141.hide(), this._001139.hide(), oe("#spectate-mode-top").removeClass("active"), oe("#spectate-mode-mouse").addClass("active"), oe("#spectate-mode-target").removeClass("active")
                }
            }, {
                key: "_001133",
                value: function() {
                    this._001139.show(), this._001140.hide(), this._001141.hide(), oe("#spectate-mode-top").removeClass("active"), oe("#spectate-mode-mouse").removeClass("active"), oe("#spectate-mode-target").addClass("active")
                }
            }]), so
        }(),
        Oe = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    be._001259(), Se._001259(), se._001259(), ce._001259(), de._001259(), he._001259(), ve._001259(), Ce._001259(), xe._001259(), Te._001259(), ze._001259(), we._001259(), Ke._001259(), Ae._001259(), Fe._001259(), Le._001259(), this._001251 = !0, this._001130 = ":party", this._001252 = oe("#menu-overlay"), this._001131 = !ae.get("extras", "streammode"), this._001132(), this._001129(), this._001128()
                }
            }, {
                key: "_001129",
                value: function() {
                    var co = this;
                    oe("#button-settings").click(function() {
                        co._001127(), se.toggle()
                    }), oe("#button-play").click(function() {
                        co.play()
                    }), oe("#button-spectate").click(function() {
                        oo._001158(), co.close()
                    }), oe("#button-inputs").click(function() {
                        co._001127(), ce.toggle()
                    }), oe("#button-theme").click(function() {
                        co._001127(), Ce.toggle()
                    }), oe("#regions").change(function() {
                        ae.set("extras", "region", oe("#regions").val())
                    }), oe("#regions").val(ae.get("extras", "region") || "JP-Tokyo"), oe("#gamemode").change(function() {
                        ae.set("extras", "gameMode", oe("#gamemode").val()), co._001130 = ae.get("extras", "gameMode")
                    }), oe("#gamemode").val(ae.get("extras", "gameMode") || ":party"), this._001130 = ae.get("extras", "gameMode") || ":party", oe("#minimap-show-1").click(function() {
                        oe("#minimap-show-" + we._001166).removeClass("active"), oe("#minimap-show-1").addClass("active"), we._001166 = 1
                    }), oe("#minimap-show-2").click(function() {
                        oe("#minimap-show-" + we._001166).removeClass("active"), oe("#minimap-show-2").addClass("active"), we._001166 = 2
                    }), oe("#minimap-show-0").click(function() {
                        oe("#minimap-show-" + we._001166).removeClass("active"), oe("#minimap-show-0").addClass("active"), we._001166 = 0
                    }), oe("#streamMode").click(function() {
                        co._001132()
                    }), oe("#spectate-mode-top").click(function() {
                        co._001126()
                    }), oe("#spectate-mode-mouse").click(function() {
                        co._001125()
                    }), oe("#spectate-mode-target").click(function() {
                        co._001124()
                    }), oe("#anouncement").click(function() {
                        oe("#anouncement").fadeOut(250)
                    }), ae.get("extras", "openedChangelog") || oe("#changelog").addClass("active"), oe("#changelog").click(function() {
                        ae.set("extras", "openedChangelog", !0), oe("#changelog").removeClass("active")
                    })
                }
            }, {
                key: "play",
                value: function() {
                    this.close(), oo._000998()
                }
            }, {
                key: "_001127",
                value: function() {
                    ce.close(), se.close(), Ce.close()
                }
            }, {
                key: "toggle",
                value: function() {
                    this._001251 ? this.close() : this.open()
                }
            }, {
                key: "close",
                value: function() {
                    this._001251 = !1, this._001252.fadeOut(250), oe("#leaderboard-hud").css("top", "-2px"), oe("#teamlist-hud").css("top", "10px"), oe(".menu-bar").slideUp(250), oe("#targeting-hud").css("top", "0px")
                }
            }, {
                key: "open",
                value: function() {
                    this._001251 = !0, this._001252.fadeIn(250), oe("#leaderboard-hud").css("top", "30px"), oe("#teamlist-hud").css("top", "45px"), oe(".menu-bar").slideDown(250), oe("#targeting-hud").css("top", "35px")
                }
            }, {
                key: "_001132",
                value: function() {
                    this._001131 ? (oe("#nick, #tag, #tag2, #party-token").removeClass("input-hidden"), oe("#streamMode").html("<i class=\"fa fa-eye\"></i>"), this._001131 = !1) : (oe("#nick, #tag, #tag2, #party-token").addClass("input-hidden"), oe("#streamMode").html("<i class=\"fa fa-eye-slash\"></i>"), this._001131 = !0), ae.set("extras", "streammode", this._001131)
                }
            }, {
                key: "_001126",
                value: function() {
                    !Ne._001058 && Ee._001025 && Ee._001024 && (Le._001135(), oo._001024())
                }
            }, {
                key: "_001125",
                value: function() {
                    Ne._001058 || !Ee._001025 || Ee._001024 && !qe._000968 || (qe._000968 ? (qe._000975._000974 = !1, qe._000971._000974 = !1) : oo._001024(), Le._001134())
                }
            }, {
                key: "_001124",
                value: function() {
                    "on" === se.targeting ? Se.command("HSLO", re._001256.notif.targeting_on) : Se.command("HSLO", re._001256.notif.targeting_off)
                }
            }, {
                key: "_001128",
                value: function() {
                    "5.1.6" !== ae.get("extras", "version") && (ae.set("extras", "version", "5.1.6"), ae.set("extras", "openedChangelog", !1), oe("#anouncement").fadeIn(250))
                }
            }]), so
        }(),
        Re = new(function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, [{
                key: "_001259",
                value: function() {
                    this._001123 = new Map, this._001122 = new Map, this._001121 = new Set, this._001120 = new Set, this._001119 = new Map, this._001118 = new Map, this._001117 = {
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0
                    }, this._001116 = [], this.food = [], Ze._001259(), Xe._001259()
                }
            }, {
                key: "_001258",
                value: function() {
                    this._001109();
                    var co = "on" === se.opponentRings && Ne._001058,
                        mo = "on" === se.virusRange && Ne._001058;
                    this.food = [], this._001116 = [], Ze._001036(), Xe._001036();
                    var go = !0,
                        uo = !1,
                        ko;
                    try {
                        for (var po, yo = this._001123[Symbol.iterator](); !(go = (po = yo.next()).done); go = !0) {
                            var ho = po.value,
                                fo = _slicedToArray(ho, 2),
                                vo = fo[0],
                                Co = fo[1];
                            if ((this._001108(Co), Co._001090) && 1 < (ro._000854 - Co._001090) / se.CellAnimation) {
                                this._001123.delete(vo);
                                continue
                            }
                            Co._001087(), this._001110(Co) && Co._001085 !== Ne._001057 && (Co._001105 ? this.food.push(Co) : (this._001116.push(Co), co && !Co._001103 && Ze._000986(Co), mo && Co._001103 && Xe.add(Co)))
                        }
                    } catch (Fo) {
                        uo = !0, ko = Fo
                    } finally {
                        try {
                            !go && yo.return && yo.return()
                        } finally {
                            if (uo) throw ko
                        }
                    }
                    var So = !0,
                        bo = !1,
                        xo;
                    try {
                        for (var To, zo = this._001122[Symbol.iterator](); !(So = (To = zo.next()).done); So = !0) {
                            var wo = To.value,
                                Ko = _slicedToArray(wo, 2),
                                Mo = Ko[0],
                                Ao = Ko[1];
                            if (Ao._001090 && 1 < (ro._000854 - Ao._001090) / se.CellAnimation) {
                                this._001122.delete(Mo);
                                continue
                            }
                            Ao._001087(), this._001110(Ao) && (Ao._001106 || !this._001107(Ao)) && (Ao._001105 ? this.food.push(Ao) : this._001116.push(Ao))
                        }
                    } catch (Fo) {
                        bo = !0, xo = Fo
                    } finally {
                        try {
                            !So && zo.return && zo.return()
                        } finally {
                            if (bo) throw xo
                        }
                    }
                    this._001116.sort(function(Fo, Lo) {
                        var Oo = Fo._001099,
                            Ro = Lo._001099;
                        return Oo === Ro ? Lo.id - Fo.id : Oo - Ro
                    })
                }
            }, {
                key: "_001115",
                value: function(co, mo) {
                    return (1 === mo ? this._001123 : this._001122).get(co) || this._001114(co, mo)
                }
            }, {
                key: "_001114",
                value: function(co, mo) {
                    var go = 1 === mo ? this._001123 : this._001122,
                        uo = new Pe(co, mo);
                    return go.set(co, uo), this._001113(co, uo, mo), uo
                }
            }, {
                key: "_001113",
                value: function(co, mo, go) {
                    var uo = 1 === go ? this._001121 : this._001120,
                        ko = 1 === go ? this._001119 : this._001118;
                    uo.has(co) && (ko.set(co, mo), uo.delete(co), mo._001106 = !0, mo.nick = 1 === go ? Ne.nick : Ne._001061)
                }
            }, {
                key: "_001112",
                value: function(co, mo, go) {
                    var uo = 1 === go ? this._001123 : this._001122,
                        ko = 1 === go ? this._001119 : this._001118,
                        po = (1 === go ? this.eatenCellIds : this.eatenCellIds2, uo.get(mo)),
                        yo = uo.get(co);
                    po && yo && (po._001098 = yo._001098, po._001097 = yo._001097, po._001096 = po._001099, po._001091 = ro._000854, po._001090 = ro._000854, po._001106 && ko.delete(mo), uo.delete(mo), po._001105 || uo.set(mo + ":removed", po))
                }
            }, {
                key: "_001111",
                value: function(co, mo) {
                    var go = 1 === mo ? this._001123 : this._001122,
                        uo = 1 === mo ? this._001119 : this._001118,
                        ko = go.get(co);
                    ko && (ko._001106 && uo.delete(co), go.delete(co), ko._001105 || "on" !== se.eatAnimation || (ko._001090 = ro._000854, go.set(co + ":removed", ko)))
                }
            }, {
                key: "_001110",
                value: function(co) {
                    var mo = 2 === co._001100 ? We._001033 : ie._001266,
                        go = Ee._001029;
                    return !(co.x - mo.x + co._001099 < go.left) && !(co.x - mo.x - co._001099 > go.right) && !(co.y - mo.y + co._001099 < go.top) && !(co.y - mo.y - co._001099 > go.bottom)
                }
            }, {
                key: "_001109",
                value: function() {
                    var co = !0,
                        mo = !1,
                        go;
                    try {
                        for (var uo, po, ko = Re._001123.values()[Symbol.iterator](); !(co = (uo = ko.next()).done); co = !0) {
                            po = uo.value, this._001117.left = po._001098, this._001117.right = po._001098, this._001117.top = po._001097, this._001117.bottom = po._001097;
                            break
                        }
                    } catch (yo) {
                        mo = !0, go = yo
                    } finally {
                        try {
                            !co && ko.return && ko.return()
                        } finally {
                            if (mo) throw go
                        }
                    }
                }
            }, {
                key: "_001108",
                value: function(co) {
                    this._001117.left > co._001098 + co._001096 && (this._001117.left = co._001098 + co._001096), this._001117.right < co._001098 - co._001096 && (this._001117.right = co._001098 - co._001096), this._001117.top > co._001097 + co._001096 && (this._001117.top = co._001097 + co._001096), this._001117.bottom < co._001097 - co._001096 && (this._001117.bottom = co._001097 - co._001096)
                }
            }, {
                key: "_001107",
                value: function(co) {
                    var mo = We._001033,
                        go = co._001098 - mo.x,
                        uo = co._001097 - mo.y,
                        ko = this._001117;
                    return !(go + co._001096 < ko.left) && !(go - co._001096 > ko.right) && !(uo + co._001096 < ko.top) && !(uo - co._001096 > ko.bottom)
                }
            }]), so
        }()),
        Pe = function() {
            function so(co, mo) {
                _classCallCheck(this, so), this.id = co, this.nick = "", this.skin = "", this._001086 = new ie._001265, this._001106 = !1, this._001105 = !1, this._001104 = !1, this._001103 = !1, this._001102 = !1, this._001101 = "", this._001100 = mo, this._001259 = !1, this.x = 0, this.y = 0, this._001099 = 0, this._001098 = 0, this._001097 = 0, this._001096 = 0, this._001095 = 0, this._001094 = 0, this._001093 = 0, this._001092 = 0, this._001091 = 0, this._001090 = 0
            }
            return _createClass(so, [{
                key: "_001087",
                value: function() {
                    var co = (ro._000854 - this._001091) / se.CellAnimation;
                    co = 0 > co ? 0 : 1 < co ? 1 : co, this.x = this._001095 + (this._001098 - this._001095) * co, this.y = this._001094 + (this._001097 - this._001094) * co, this._001099 = this._001093 + (this._001096 - this._001093) * co
                }
            }, {
                key: "_001089",
                get: function() {
                    return 0 | this._001099 * this._001099 / 100
                }
            }, {
                key: "_001088",
                get: function() {
                    return 0 | this._001096 * this._001096 / 100
                }
            }, {
                key: "_001085",
                get: function() {
                    return ":party" === Oe._001130 ? this.nick + this._001086.hex : this.nick
                }
            }, {
                key: "_001084",
                get: function() {
                    let co = this.nick || "";
                    return 1 > co.length
                }
            }]), so
        }(),
        Ne = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001083 = oe("#nick").val(), this._001082 = oe("#nick2").val(), this._001081 = _o._000862(oe("#skin").val()), this._001080 = oe("#tag").val(), this._001079 = {
                        r: 0,
                        g: 0,
                        b: 0
                    }, this._001078 = "#000", this._001077 = "#000", this._001076 = !1, this._001075 = !1, this._001074 = !1, this.x = 0, this.y = 0, this._001148 = 0, this._001073 = 0, this._001072 = 0, this._001071 = 0, this._001151 = 0, this._001070 = !1, this._001069 = {
                        x: 100,
                        y: 100
                    }, this._001068 = 1
                }
            }, {
                key: "_001258",
                value: function() {
                    0 < this._001055 ? this._001067() : this._001064(), 0 < this._001056 ? this._001066() : this._001063(), this._001065()
                }
            }, {
                key: "_001067",
                value: function() {
                    if (!this._001076) {
                        this._001076 = !0, this._001075 || this._001059(1);
                        var co = !0,
                            mo = !1,
                            go;
                        try {
                            for (var uo, po, ko = Re._001119.values()[Symbol.iterator](); !(co = (uo = ko.next()).done); co = !0) {
                                po = uo.value, this._001060 = po._001086, this._001078 = po._001086.hex;
                                break
                            }
                        } catch (yo) {
                            mo = !0, go = yo
                        } finally {
                            try {
                                !co && ko.return && ko.return()
                            } finally {
                                if (mo) throw go
                            }
                        }
                    }
                }
            }, {
                key: "_001066",
                value: function() {
                    if (!this._001075) {
                        this._001075 = !0, this._001076 || this._001059(1);
                        var co = !0,
                            mo = !1,
                            go;
                        try {
                            for (var uo, po, ko = Re._001118.values()[Symbol.iterator](); !(co = (uo = ko.next()).done); co = !0) {
                                po = uo.value, this._001077 = po._001086.hex;
                                break
                            }
                        } catch (yo) {
                            mo = !0, go = yo
                        } finally {
                            try {
                                !co && ko.return && ko.return()
                            } finally {
                                if (mo) throw go
                            }
                        }
                    }
                }
            }, {
                key: "_001065",
                value: function() {
                    if (this._001058) {
                        var co = 0,
                            mo = 0,
                            go = 0;
                        if (this._001072 = 0, this._001071 = 0, this._001076) {
                            var uo = !0,
                                ko = !1,
                                po;
                            try {
                                for (var yo, fo, ho = Re._001119.values()[Symbol.iterator](); !(uo = (yo = ho.next()).done); uo = !0) fo = yo.value, co += fo.x / this._001054, mo += fo.y / this._001054, go += fo._001099, this._001072 += fo._001088, this._001071 < fo.staticMass && (this._001071 = fo.staticMass)
                            } catch (Fo) {
                                ko = !0, po = Fo
                            } finally {
                                try {
                                    !uo && ho.return && ho.return()
                                } finally {
                                    if (ko) throw po
                                }
                            }
                        }
                        if (this._001075) {
                            var bo, vo = We._001033,
                                Co = !0,
                                So = !1;
                            try {
                                for (var xo, zo, To = Re._001118.values()[Symbol.iterator](); !(Co = (xo = To.next()).done); Co = !0) zo = xo.value, co += (zo.x - vo.x) / this._001054, mo += (zo.y - vo.y) / this._001054, go += zo._001099, this._001072 += zo._001088, this._001071 < zo.staticMass && (this._001071 = zo.staticMass)
                            } catch (Fo) {
                                So = !0, bo = Fo
                            } finally {
                                try {
                                    !Co && To.return && To.return()
                                } finally {
                                    if (So) throw bo
                                }
                            }
                        }
                        if (!this._001070) {
                            var wo = this.x - co,
                                Ko = this.y - mo,
                                Mo = Math.sqrt(wo * wo + Ko * Ko);
                            this._001148 += Mo, this.x = co, this.y = mo
                        }
                        this._001151 < this._001072 && (this._001151 = this._001072);
                        var Ao = Math.pow(Math.min(64 / go, 1), .4) * Math.max(ee.innerWidth / 1920, ee.innerHeight / 1080);
                        Ee._001031 = Ao
                    }
                }
            }, {
                key: "_001064",
                value: function() {
                    this._001076 && (this._001076 = !1, this._001075 ? (this._001068 = 2, oo._001158(1)) : this._001062())
                }
            }, {
                key: "_001063",
                value: function() {
                    this._001075 && (this._001075 = !1, this._001076 ? (this._001068 = 1, oo._001158(2)) : this._001062())
                }
            }, {
                key: "_001062",
                value: function() {
                    this._001151 = 0, this._001072 = 0, this._001071 = 0, this._001070 = !1, this._001069.x = this.x, this._001069.y = this.y, this._001068 = 1, this._001059(0), Oe.open()
                }
            }, {
                key: "_001059",
                value: function(co) {
                    io._000872(co)
                }
            }, {
                key: "nick",
                set: function(co) {
                    this._001083 = co, io.nick(), to.nick()
                },
                get: function() {
                    return this._001083
                }
            }, {
                key: "_001061",
                set: function(co) {
                    this._001082 = co, to.nick()
                },
                get: function() {
                    return this._001082
                }
            }, {
                key: "skin",
                set: function(co) {
                    var mo = _o._000862(co);
                    mo ? (this._001081 = mo, io.skin(), to.skin()) : Se._001181("HSLO", re._001256.notif.invalidSkinUrl)
                },
                get: function() {
                    return this._001081
                }
            }, {
                key: "_001244",
                set: function(co) {
                    this._001080 = co, io._001244(), to._001244()
                },
                get: function() {
                    return this._001080
                }
            }, {
                key: "_001060",
                set: function(co) {
                    this._001079.r = co.r, this._001079.g = co.g, this._001079.b = co.b, io._001086()
                },
                get: function() {
                    return this._001079
                }
            }, {
                key: "_001058",
                get: function() {
                    return this._001076 || this._001075
                }
            }, {
                key: "_001085",
                get: function() {
                    return ":party" === Oe._001130 ? this.nick + this._001078 : this.nick
                }
            }, {
                key: "_001057",
                get: function() {
                    return ":party" === Oe._001130 ? this._001061 + this._001077 : this._001061
                }
            }, {
                key: "location",
                get: function() {
                    return We._001034(this.x, this.y)
                }
            }, {
                key: "_001055",
                get: function() {
                    return Re._001119.size
                }
            }, {
                key: "_001056",
                get: function() {
                    return Re._001118.size
                }
            }, {
                key: "_001054",
                get: function() {
                    return this._001055 + this._001056
                }
            }, {
                key: "_001053",
                set: function(co) {
                    this._001068 = co
                },
                get: function() {
                    return this._001068
                }
            }]), so
        }(),
        He = function() {
            function so(co) {
                _classCallCheck(this, so), this.id = co, this._001050 = 2, this.x = 90, this.y = 90, this._001058 = 0, this._001072 = 0, this.nick = "", this.skin = "", this._001078 = "#000", this._001074 = !1, this._001052 = 90, this._001051 = 90, this._001049 = ro._000854, this._001172 = 1
            }
            return _createClass(so, [{
                key: "_001087",
                value: function() {
                    var co = (ro._000854 - this._001049) / 1e3;
                    co = 1 < co ? 1 : 0 > co ? 0 : co, this._001052 += (this.x - this._001052) * co, this._001051 += (this.y - this._001051) * co, this._001049 = ro._000854
                }
            }, {
                key: "_001085",
                get: function() {
                    return ":party" === Oe._001130 ? this.nick + this._001078 : this.nick
                }
            }, {
                key: "location",
                get: function() {
                    return We._001034(this.x + We._001042.x, this.y + We._001042.y)
                }
            }, {
                key: "_001048",
                get: function() {
                    return (this._001052 + 7071) / 14142 * we.size
                }
            }, {
                key: "_001047",
                get: function() {
                    return (this._001051 + 7071) / 14142 * we.size
                }
            }]), so
        }(),
        Be = new(function() {
            function so() {
                _classCallCheck(this, so), this._001045 = this._001046()
            }
            return _createClass(so, [{
                key: "_001046",
                value: function() {
                    var co = te.createElement("canvas"),
                        mo = co.getContext("2d"),
                        go = new Image;
                    return co.width = 150, co.height = 150, mo.textAlign = "center", mo.textBaseline = "middle", mo.font = "600 150px FontAwesome", mo.fillStyle = "#ffffff", mo.fillText("\uF078", 75, 75), go.crossOrigin = "anonymous", go.src = co.toDataURL(), go
                }
            }]), so
        }()),
        We = new(function() {
            function so() {
                _classCallCheck(this, so), this.left = -7071, this.top = -7071, this.right = 7071, this.bottom = 7071, this._001043 = 14142, this._001042 = new ie._001267(0, 0), this._001041 = new ie._001267(0, 0), this._001040 = {
                    left: -7071,
                    top: -7071
                }, this._001039 = new ie._001267(0, 0), this._001038 = new ie._001267(0, 0), this._001037 = !1
            }
            return _createClass(so, [{
                key: "_001036",
                value: function() {
                    this._001037 = !1
                }
            }, {
                key: "_001258",
                value: function(co, mo, go, uo) {
                    14141 > go - co || 14141 > uo - mo || (this.left = co, this.top = mo, this.right = go, this.bottom = uo, this._001042.x = 7071 + co, this._001042.y = 7071 + mo, this._001039.x = go + co >> 1, this._001039.y = uo + mo >> 1, this._001037 || (Ee.x = this._001039.x, Ee.y = this._001039.y, this._001037 = !0))
                }
            }, {
                key: "_001035",
                value: function(co, mo, go, uo) {
                    14141 > go - co || 14141 > uo - mo || (this._001041.x = 7071 + co, this._001041.y = 7071 + mo, this._001040.left = co, this._001040.top = mo)
                }
            }, {
                key: "_001034",
                value: function(co, mo) {
                    var go = 0 | (co - this.left) / 2828,
                        uo = 0 | (mo - this.top) / 2828;
                    return go = 0 > go ? 0 : 4 < go ? 4 : go, uo = 0 > uo ? 0 : 4 < uo ? 4 : uo, String.fromCharCode(65 + uo) + (go + 1)
                }
            }, {
                key: "_001033",
                get: function() {
                    return this._001038.x = this._001041.x - this._001042.x, this._001038.y = this._001041.y - this._001042.y, this._001038
                }
            }]), so
        }()),
        Ee = new(function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, [{
                key: "_001259",
                value: function() {
                    this.x = 0, this.y = 0, this._001032 = 1, this._001031 = 1, this._001030 = 1, this._001029 = {
                        left: -960,
                        right: 960,
                        top: -540,
                        bottom: 540
                    }, this._001028 = new ie._001267, this._001027 = !1, this._001026 = !1, qe._001259()
                }
            }, {
                key: "_001258",
                value: function() {
                    this._001025 && qe._001258(), this.move(), this._001023()
                }
            }, {
                key: "move",
                value: function() {
                    Ne._001058 ? (this.x += (Ne.x - this.x) / se.cameraSpeed, this.y += (Ne.y - this.y) / se.cameraSpeed) : this._001025 && (this.x = (29 * this.x + this._001028.x) / 30, this.y = (29 * this.y + this._001028.y) / 30)
                }
            }, {
                key: "_001023",
                value: function() {
                    var co = this._001032;
                    "on" === se.autoZoom && (co *= this._001031), this._001030 += (co - this._001030) / 8;
                    var mo = _o._001044.width / 2 / this._001030,
                        go = _o._001044.height / 2 / this._001030;
                    this._001029.left = Math.max(-mo + this.x, We.left), this._001029.right = Math.min(mo + this.x, We.right), this._001029.top = Math.max(-go + this.y, We.top), this._001029.bottom = Math.min(go + this.y, We.bottom)
                }
            }, {
                key: "_001025",
                get: function() {
                    return this._001027
                },
                set: function(co) {
                    (this._001027 = co) ? Le.show(): Le.hide()
                }
            }, {
                key: "_001024",
                get: function() {
                    return this._001026
                },
                set: function(co) {
                    (this._001026 = co) ? Le._001134(): Le._001135()
                }
            }]), so
        }()),
        Ie = new(function() {
            function so() {
                _classCallCheck(this, so), this._001022 = new Map, this._001021 = new Map, this._001019 = 1e3, this._001020 = 500, this._001018 = this._001006(), this._001017 = this._001006(), this._001016 = []
            }
            return _createClass(so, [{
                key: "nick",
                value: function(co) {
                    if (co._001084 || this._001008(co)) return !1;
                    var mo = this._001022.get(co.nick) || this._001015(co.nick);
                    mo._001003 = ro._000854;
                    var go = 50 > this._001009(co._001099) ? 0 : 1,
                        uo = mo._000997[go];
                    if (uo) return uo;
                    var ko = this._001007(),
                        po = ko.getContext("2d"),
                        yo = 50 * (go + 1) * Ce.cellNickSize / 100;
                    if (ko.height = 0 | 1.2 * yo, ko.width = 0 | 1.2 * this._001014(co.nick, yo), po.font = "700 " + (0 | yo) + "px " + Ce.nickFont, po.textBaseline = "middle", po.textAlign = "center", "normal" === se.nickShadow) po.strokeStyle = Ce.nickStrokeColor, po.lineWidth = 6 * (go + 1), po.strokeText(co.nick, ko.width >> 1, ko.height >> 1);
                    else if ("performance" === se.nickShadow) {
                        po.fillStyle = Ce.nickStrokeColor, po.globalAlpha = .75;
                        var ho = 0 | ko.width / 1.2,
                            fo = 0 | ko.height / 1.2;
                        po.fillRect(ko.width - ho >> 1, ko.height - fo >> 1, ho, fo), po.globalAlpha = 1
                    }
                    return po.fillStyle = Ce.nickColor, po.fillText(co.nick, ko.width >> 1, ko.height >> 1), mo._000997[go] = ko
                }
            }, {
                key: "_001015",
                value: function(co) {
                    var mo = new De;
                    return this._001022.set(co, mo), mo
                }
            }, {
                key: "_001014",
                value: function(co, mo) {
                    return this._001018.measureText(co).width * mo / 50
                }
            }, {
                key: "_001013",
                value: function() {
                    this._001022.clear(), this._001018.font = "700 50px " + Ce.nickFont
                }
            }, {
                key: "_001072",
                value: function(co) {
                    if (!co._001103 && this._001008(co)) return !1;
                    var mo = this._001021.get(co.id) || this._001012(co.id),
                        go = "shortened" === se.cellMass && 999 < co._001088 ? (0 | co._001088 / 100) / 10 + "k" : co._001088,
                        uo = this._001009(co._001099),
                        ko = go !== mo._001001,
                        po = ro._000854 - mo._000999 > this._001020,
                        yo = 1.2 < uo / mo._001000 || ko && po;
                    if (mo._001003 = ro._000854, !yo && mo._001044) return mo._001044;
                    mo._001044 || (mo._001044 = this._001007());
                    var ho = mo._001044,
                        fo = ho.getContext("2d"),
                        vo = 0 | uo / 3 * (Ce.cellMassSize / 100);
                    if (ho.height = 0 | 1.2 * vo, ho.width = 0 | 1.2 * this._001011(go, vo), fo.font = "700 " + vo + "px " + Ce.massFont, fo.textBaseline = "middle", fo.textAlign = "center", "normal" === se.massShadow) fo.strokeStyle = Ce.massStrokeColor, fo.lineWidth = 6 * vo / 50, fo.strokeText(go, ho.width >> 1, ho.height >> 1);
                    else if ("performance" === se.massShadow) {
                        fo.fillStyle = Ce.massStrokeColor, fo.globalAlpha = .75;
                        var Co = 0 | ho.width / 1.2,
                            So = 0 | ho.height / 1.2;
                        fo.fillRect(ho.width - Co >> 1, ho.height - So >> 1, Co, So), fo.globalAlpha = 1
                    }
                    return fo.fillStyle = Ce.massColor, fo.fillText(go, ho.width >> 1, ho.height >> 1), mo._001001 = go, mo._001000 = uo, mo._000999 = ro._000854 + mo._001002, ho
                }
            }, {
                key: "_001012",
                value: function(co) {
                    var mo = new Ue;
                    return this._001021.set(co, mo), mo
                }
            }, {
                key: "_001011",
                value: function(co, mo) {
                    return this._001017.measureText(co).width * mo / 50
                }
            }, {
                key: "_001010",
                value: function() {
                    this._001021.clear(), this._001017.font = "700 50px " + Ce.massFont
                }
            }, {
                key: "_001009",
                value: function(co) {
                    return co * Ee._001030
                }
            }, {
                key: "_001008",
                value: function(co) {
                    return "on" === se.autoHideText && 20 > this._001009(co._001099)
                }
            }, {
                key: "_001007",
                value: function() {
                    return this._001016.shift() || te.createElement("canvas")
                }
            }, {
                key: "_001006",
                value: function() {
                    var co = te.createElement("canvas").getContext("2d");
                    return co.font = "700 50px ubuntu", co
                }
            }, {
                key: "_001005",
                value: function() {
                    var co = !0,
                        mo = !1,
                        go;
                    try {
                        for (var uo, ko = this._001022[Symbol.iterator](); !(co = (uo = ko.next()).done); co = !0) {
                            var po = uo.value,
                                yo = _slicedToArray(po, 2),
                                ho = yo[0],
                                fo = yo[1];
                            if (!(ro._000854 - fo._001003 < this._001019) && (this._001022.delete(ho), !(50 <= this._001016.length))) {
                                var vo = fo._000997[0],
                                    Co = fo._000997[1];
                                this._001004(vo), this._001004(Co)
                            }
                        }
                    } catch (Lo) {
                        mo = !0, go = Lo
                    } finally {
                        try {
                            !co && ko.return && ko.return()
                        } finally {
                            if (mo) throw go
                        }
                    }
                    var So = !0,
                        bo = !1,
                        xo;
                    try {
                        for (var To, zo = this._001021[Symbol.iterator](); !(So = (To = zo.next()).done); So = !0) {
                            var wo = To.value,
                                Ko = _slicedToArray(wo, 2),
                                Mo = Ko[0],
                                Ao = Ko[1];
                            if (!(ro._000854 - Ao._001003 < this._001019)) {
                                if (this._001021.delete(Mo), 50 <= this._001016.length) return;
                                var Fo = Ao._001044;
                                this._001004(Fo)
                            }
                        }
                    } catch (Lo) {
                        bo = !0, xo = Lo
                    } finally {
                        try {
                            !So && zo.return && zo.return()
                        } finally {
                            if (bo) throw xo
                        }
                    }
                }
            }, {
                key: "_001004",
                value: function(co) {
                    !co || 50 <= this._001016.length || (co.width = 0, this._001016.push(co))
                }
            }]), so
        }()),
        Ue = function so() {
            _classCallCheck(this, so), this._001003 = ro._000854, this._001002 = 0 | Math.random() * Ie._001020, this._001001 = 0, this._001000 = 0, this._000999 = ro._000854, this._001044 = null
        },
        De = function so() {
            _classCallCheck(this, so), this._001003 = ro._000854, this._000997 = [null, null]
        },
        Ge = new(function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, [{
                key: "_000983",
                value: function() {
                    "off" !== se.food && ("monoColored" === se.food ? this.monoColored() : "rainbow" === se.food && this.rainbow())
                }
            }, {
                key: "monoColored",
                value: function() {
                    var co = _o._001167,
                        mo = Ce.foodSize,
                        go = Re.food.length;
                    for (se.eatAnimation, co.fillStyle = Ce.foodColor, co.beginPath(); go--;) {
                        var uo = Re.food[go],
                            ko = 2 === uo._001100 ? We._001033 : ie._001266,
                            po = uo._001099 + mo;
                        co.moveTo(uo.x - ko.x + po, uo.y - ko.y), co.arc(uo.x - ko.x, uo.y - ko.y, po, 0, _o._001168, !0)
                    }
                    co.closePath(), co.fill()
                }
            }, {
                key: "rainbow",
                value: function() {
                    var co = _o._001167,
                        mo = Ce.foodSize,
                        go = Re.food.length;
                    for (se.eatAnimation; go--;) {
                        var uo = Re.food[go],
                            ko = 2 === uo._001100 ? We._001033 : ie._001266,
                            po = uo._001099 + mo;
                        co.fillStyle = uo._001086.hex, 2 > po * Ee._001030 ? co.fillRect(uo.x - ko.x - po, uo.y - ko.y - po, 2 * po, 2 * po) : (co.beginPath(), co.arc(uo.x - ko.x, uo.y - ko.y, po, 0, _o._001168, !0), co.closePath(), co.fill())
                    }
                }
            }]), so
        }()),
        Ve = new(function() {
            function so() {
                _classCallCheck(this, so), this._000996 = new Map, this._000995 = new Map, this._001168 = 2 * Math.PI
            }
            return _createClass(so, [{
                key: "_000994",
                value: function() {
                    this._000996.clear(), Ne._001058 && (this._000996.set(Ne._001085, this._000991(Ne.skin)), this._000996.set(Ne._001057, this._000991(Ne.skin)));
                    var co = !0,
                        mo = !1,
                        go;
                    try {
                        for (var uo, po, ko = no._000884.values()[Symbol.iterator](); !(co = (uo = ko.next()).done); co = !0) po = uo.value, po._001058 && this._000996.set(po._001085, this._000991(po.skin))
                    } catch (yo) {
                        mo = !0, go = yo
                    } finally {
                        try {
                            !co && ko.return && ko.return()
                        } finally {
                            if (mo) throw go
                        }
                    }
                }
            }, {
                key: "_000993",
                value: function(co) {
                    var mo = this._000996.get(co);
                    if (!mo || "XXXXXXX" === mo) return !1;
                    var go = this._000995.get(mo);
                    return void 0 === go ? (this._000992(mo), !1) : go
                }
            }, {
                key: "_000992",
                value: function(co) {
                    var mo = this;
                    this._000995.set(co, !1);
                    var go = new Image;
                    go.crossOrigin = "anonymous", go.onload = function() {
                        var uo = te.createElement("canvas"),
                            ko = uo.getContext("2d");
                        uo.width = 512, uo.height = 512, ko.beginPath(), ko.arc(256, 256, 256, 0, mo._001168, !0), ko.closePath(), ko.clip(), ko.drawImage(go, 0, 0, 512, 512), go.onload = null, go.src = uo.toDataURL(), mo._000995.set(co, go)
                    }, go.src = co
                }
            }, {
                key: "_000991",
                value: function(co) {
                    return "https://i.imgur.com/" + co + ".png"
                }
            }]), so
        }()),
        Ze = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._001149 = [], this._000990 = [], this._000989 = [], this._000988 = [], this._000987 = [], this.lineWidth = 10
                }
            }, {
                key: "_000986",
                value: function(co) {
                    var mo = co._001072 / Ne._001071,
                        go = 1e3 < Ne._001071 ? .38 : .35;
                    co._001106 ? this._000989.push(co) : 2.5 < mo ? this._000987.push(co) : 1.25 < mo ? this._000988.push(co) : .75 < mo ? this._000989.push(co) : go < mo ? this._000990.push(co) : this._001149.push(co)
                }
            }, {
                key: "_001036",
                value: function() {
                    this._001149 = [], this._000990 = [], this._000989 = [], this._000988 = [], this._000987 = []
                }
            }, {
                key: "_000983",
                value: function() {
                    if ("off" !== se.opponentRings && !Ee._001025) {
                        var co = _o._001167;
                        this.lineWidth = 0 | Math.min(3 / Ee._001030, 14), co.lineWidth = this.lineWidth, this._000985(this._001149, "#76FF03"), this._000985(this._000990, "#2196F3"), this._000985(this._000989, "#555555"), this._000985(this._000988, "#FF9800"), this._000985(this._000987, "#FD0000")
                    }
                }
            }, {
                key: "_000985",
                value: function(co, mo) {
                    var go = _o._001167;
                    go.strokeStyle = mo, go.beginPath();
                    for (var ko, uo = co.length; uo--;) ko = co[uo], go.moveTo(ko.x + ko._001099 + 15 + (this.lineWidth >> 1), ko.y), go.arc(ko.x, ko.y, ko._001099 + 15 + (this.lineWidth >> 1), 0, _o._001168, !0);
                    go.closePath(), go.stroke()
                }
            }]), so
        }(),
        Xe = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._000984 = new Set
                }
            }, {
                key: "add",
                value: function(co) {
                    this._000984.add(co)
                }
            }, {
                key: "_000983",
                value: function() {
                    if ("on" === se.virusRange) {
                        var co = _o._001167;
                        co.globalAlpha = .1, co.fillStyle = "#ffffff", this._000984.forEach(function(mo) {
                            var go = 0 < mo.fadeStartTime ? Math.max(1 - (ro._000854 - mo.fadeStartTime) / se.CellAnimation, 0) : 1;
                            co.globalAlpha = .1 * go, co.beginPath(), co.arc(mo.x, mo.y, mo._001099 + 760, 0, _o._001168, !0), co.closePath(), co.fill()
                        }), co.globalAlpha = 1
                    }
                }
            }, {
                key: "_001036",
                value: function() {
                    this._000984.clear()
                }
            }]), so
        }(),
        je = new(function() {
            function so() {
                _classCallCheck(this, so), this.left = 0, this.top = 0, this._000982 = 0, this._001043 = 0, this._000981 = 0, this._000980 = ["A", "B", "C", "D", "E"], this._000979 = new Set
            }
            return _createClass(so, [{
                key: "_000983",
                value: function() {
                    var co = se.bgSectors;
                    if ("off" !== co) {
                        var mo = _o._001167,
                            go = Ce.gridWidth,
                            uo = go >> 1;
                        this._001043 = We._001043 - go, this.left = We.left + uo, this.top = We.top + uo, this._000982 = 0 | this._001043 / 5, this._000981 = 0 | this._001043 / 10, mo.lineWidth = go, mo.strokeStyle = Ce.gridColor, this._000978(), "onlyLines" !== co && (mo.textAlign = "center", mo.textBaseline = "middle", mo.fillStyle = Ce.gridTextColor, this._000977(), "snowflakes" === co ? this._000976() : this._001182())
                    }
                }
            }, {
                key: "_000978",
                value: function() {
                    var co = _o._001167;
                    Ee._001029, co.beginPath(), co.rect(this.left + this._000982, this.top, this._000982, this._001043), co.rect(this.left + 3 * this._000982, this.top, this._000982, this._001043), co.rect(this.left, this.top + this._000982, this._001043, this._000982), co.rect(this.left, this.top + 3 * this._000982, this._001043, this._000982), co.rect(this.left, this.top, this._001043, this._001043), co.closePath(), co.stroke()
                }
            }, {
                key: "_000977",
                value: function() {
                    var co = this._000979;
                    co.clear();
                    for (var mo = Ee._001029, go = 0 | (mo.left - 200 - We.left) / this._000982, uo = 0 | (mo.top - 200 - We.top) / this._000982, ko = 5 - (0 | (We.right - mo.right - 200) / this._000982) - go, po = 5 - (0 | (We.bottom - mo.bottom - 200) / this._000982) - uo, yo = 0; yo < ko; yo++)
                        for (var ho = 0; ho < po; ho++) co.add(this._000980[uo + ho] + (go + yo + 1))
                }
            }, {
                key: "_001182",
                value: function() {
                    var co = _o._001167;
                    co.font = "400 " + Ce.gridTextSize + "px " + Ce.gridTextFont;
                    for (var mo = 0; 5 > mo; mo++)
                        for (var ko, go = this.top + this._000981 + mo * this._000982, uo = 0; 5 > uo; uo++)
                            if (ko = this._000980[mo] + (uo + 1), this._000979.has(ko)) {
                                var po = this.left + this._000981 + uo * this._000982;
                                co.fillText(ko, po, go)
                            }
                }
            }, {
                key: "_000976",
                value: function() {
                    var co = _o._001167;
                    co.font = "400 " + Ce.gridTextSize + "px FontAwesome";
                    for (var mo = 0; 5 > mo; mo++)
                        for (var ko, go = this.top + this._000981 + mo * this._000982, uo = 0; 5 > uo; uo++)
                            if (ko = this._000980[mo] + (uo + 1), this._000979.has(ko)) {
                                var po = this.left + this._000981 + uo * this._000982;
                                co.fillText("\uF2DC", po, go)
                            }
                }
            }]), so
        }()),
        qe = function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, null, [{
                key: "_001259",
                value: function() {
                    this._000975 = {
                        _000974: !1,
                        nick: "",
                        _001085: "",
                        _001072: 0,
                        _000973: 0,
                        position: {
                            x: 0,
                            y: 0
                        },
                        _000972: !1
                    }, this._000971 = {
                        _000974: !1,
                        nick: "",
                        _001085: "",
                        _001072: 0,
                        _000973: 0,
                        position: {
                            x: 0,
                            y: 0
                        },
                        _000972: !1
                    }, this._001039 = {
                        x: 0,
                        y: 0
                    }
                }
            }, {
                key: "_001258",
                value: function() {
                    if (this._000975._000974 || this._000971._000974) {
                        var co = this._000975,
                            mo = this._000971;
                        co._001072 = 0, co.position.x = 0, co.position.y = 0, co._000973 = 0, mo._001072 = 0, mo.position.x = 0, mo.position.y = 0, mo._000973 = 0, Re._001123.forEach(function(po) {
                            co._000974 && co._001085 === po._001085 ? (co.position.x += po.x, co.position.y += po.y, co._001072 += po._001088, co._000973++) : mo._000974 && mo._001085 === po._001085 && (mo.position.x += po.x, mo.position.y += po.y, mo._001072 += po._001088, mo._000973++)
                        }), co._001072 = 0 | co._001072, mo._001072 = 0 | mo._001072;
                        var go = 0,
                            uo = 0,
                            ko = 0;
                        co._000974 && (0 < co._000973 ? (co.position.x /= co._000973, co.position.y /= co._000973, co._000972 = !1, uo += co.position.x, ko += co.position.y, go++) : co._000972 = !0), mo._000974 && (0 < mo._000973 ? (mo.position.x /= mo._000973, mo.position.y /= mo._000973, mo._000972 = !1, uo += mo.position.x, ko += mo.position.y, go++) : mo._000972 = !0), 0 < go && (this._001039.x = 0 | uo / go, this._001039.y = 0 | ko / go)
                    }
                }
            }, {
                key: "_000970",
                value: function(co, mo, go) {
                    Ee._001024 || pe._001218();
                    var uo = 199996164,
                        ko = !1,
                        po = !0,
                        yo = !1,
                        ho;
                    try {
                        for (var fo, Co, vo = Re._001116[Symbol.iterator](); !(po = (fo = vo.next()).done); po = !0)
                            if (Co = fo.value, !Co._001103 && !Co._001104) {
                                var So = this._000969(co, mo, Co.x, Co.y);
                                So < uo && (uo = So, ko = Co)
                            }
                    } catch (xo) {
                        yo = !0, ho = xo
                    } finally {
                        try {
                            !po && vo.return && vo.return()
                        } finally {
                            if (yo) throw ho
                        }
                    }
                    if (ko)
                        if (ko._001084) Se._001181("HSLO", re._001256.notif.target_unnamed);
                        else {
                            var bo = 1 === go ? this._000975 : this._000971;
                            bo._000974 = !0, bo.nick = ko.nick, bo._001085 = ko._001085, bo._000972 = !1, Le._001133()
                        }
                }
            }, {
                key: "_000969",
                value: function(co, mo, go, uo) {
                    var ko = go - co,
                        po = uo - mo;
                    return ko * ko + po * po
                }
            }, {
                key: "_001036",
                value: function() {
                    this._000968 || pe._001218(), Ee._001024 ? Le._001134() : Le._001135(), this._000975._000974 = !1, this._000971._000974 = !1
                }
            }, {
                key: "_000968",
                get: function() {
                    return this._000975._000974 || this._000971._000974
                }
            }]), so
        }(),
        Je = function() {
            function so(co) {
                _classCallCheck(this, so), this._000967 = new DataView(co), this._000965 = 0, this._000966 = this._000967.byteLength
            }
            return _createClass(so, [{
                key: "_000964",
                value: function() {
                    var co = this._000967.getUint8(this._000965, !0);
                    return this._000965++, co
                }
            }, {
                key: "_000961",
                value: function() {
                    var co = this._000967.getInt8(this._000965, !0);
                    return this._000965++, co
                }
            }, {
                key: "_000963",
                value: function() {
                    var co = this._000967.getUint16(this._000965, !0);
                    return this._000965 += 2, co
                }
            }, {
                key: "_000960",
                value: function() {
                    var co = this._000967.getInt16(this._000965, !0);
                    return this._000965 += 2, co
                }
            }, {
                key: "_000962",
                value: function() {
                    var co = this._000967.getUint32(this._000965, !0);
                    return this._000965 += 4, co
                }
            }, {
                key: "_000959",
                value: function() {
                    var co = this._000967.getInt32(this._000965, !0);
                    return this._000965 += 4, co
                }
            }, {
                key: "_000958",
                value: function() {
                    var co = this._000967.getFloat32(this._000965, !0);
                    return this._000965 += 4, co
                }
            }, {
                key: "_000957",
                value: function() {
                    var co = this._000967.getFloat64(this._000965, !0);
                    return this._000965 += 8, co
                }
            }, {
                key: "_000956",
                value: function() {
                    for (var mo, co = ""; !this._000953 && (mo = this._000964(), 0 !== mo);) co += String.fromCharCode(mo);
                    return co
                }
            }, {
                key: "_000955",
                value: function() {
                    var co = this._000956();
                    return decodeURIComponent(escape(co))
                }
            }, {
                key: "_000954",
                value: function() {
                    var co = this._000962(),
                        mo = new Uint8Array(this._000967.buffer),
                        go = new Uint8Array(co);
                    LZ4.decodeBlock(mo, go, 5), this._000967 = new DataView(go.buffer), this._000965 = 0, this._000966 = this._000967.byteLength
                }
            }, {
                key: "_000953",
                get: function() {
                    return this._000965 >= this._000966
                }
            }]), so
        }(),
        Ye = function() {
            function so() {
                _classCallCheck(this, so), this._000952 = []
            }
            return _createClass(so, [{
                key: "_000951",
                value: function(co) {
                    0 > (co |= 0) || 255 < co ? console.error("value out of range [Min: 0, Max: 255, Value: " + co + "]") : this._000952.push(co)
                }
            }, {
                key: "_000950",
                value: function(co) {
                    -128 > (co |= 0) || 127 < co ? console.error("value out of range [Min: -128, Max: 127, Value: " + co + "]") : this._000952.push(co)
                }
            }, {
                key: "_000949",
                value: function(co) {
                    0 > (co |= 0) || 65535 < co ? console.error("value out of range [Min: 0, Max: 65535, Value: " + co + "]") : this._000952.push(co, co >> 8)
                }
            }, {
                key: "_000948",
                value: function(co) {
                    -32768 > (co |= 0) || 32767 < co ? console.error("value out of range [Min: -32768, Max: 32767, Value: " + co + "]") : this._000952.push(co, co >> 8)
                }
            }, {
                key: "_000947",
                value: function(co) {
                    0 > (co |= 0) || 4294967295 < co ? console.error("value out of range [Min: 0, Max: 4294967295, Value: " + co + "]") : this._000952.push(co, co >> 8, co >> 16, co >> 24)
                }
            }, {
                key: "_000946",
                value: function(co) {
                    -2147483648 > (co |= 0) || 2147483647 < co ? console.error("value out of range [Min: -2147483648, Max: 2147483647, Value: " + co + "]") : this._000952.push(co, co >> 8, co >> 16, co >> 24)
                }
            }, {
                key: "_000945",
                value: function(co) {
                    for (var go, mo = 0; mo < co.length; mo++) go = co.charCodeAt(mo), this._000951(go);
                    this._000951(0)
                }
            }, {
                key: "_000944",
                value: function(co) {
                    var mo = unescape(encodeURIComponent(co));
                    this._000945(mo)
                }
            }, {
                key: "_001036",
                value: function() {
                    this._000952 = []
                }
            }, {
                key: "buffer",
                get: function() {
                    return new Uint8Array(this._000952).buffer
                }
            }]), so
        }(),
        Qe = new(function() {
            function so() {
                _classCallCheck(this, so), this._000943 = "", this._000942 = null, this._000941 = !1, this._000940 = null, this._000939 = !1, this._000938 = { in: 0,
                    out: 0
                }, this._000937 = oe("#ip-box")
            }
            return _createClass(so, [{
                key: "_000934",
                value: function(co) {
                    var mo = this;
                    co && (this._000935(), this._000933(), $e._000918(), We._001036(), this._000936 = co, this._000942 = new WebSocket("ws://" + co), this._000942.binaryType = "arraybuffer", this._000942.onopen = function() {
                        mo._000932(1)
                    }, this._000942.onmessage = function(go) {
                        mo._000931(go, 1)
                    }, this._000942.onclose = function() {
                        mo._000930(1)
                    }, this._000942.onerror = function() {
                        mo._000929(1)
                    }, this._000940 = new WebSocket("ws://" + co), this._000940.binaryType = "arraybuffer", this._000940.onopen = function() {
                        mo._000932(2)
                    }, this._000940.onmessage = function(go) {
                        mo._000931(go, 2)
                    }, this._000940.onclose = function() {
                        mo._000930(2)
                    }, this._000940.onerror = function() {
                        mo._000929(2)
                    }, console.log("Connecting to: " + co))
                }
            }, {
                key: "_000935",
                value: function() {
                    this._000942 && this._000942.close && (this._000942.close(), this._000942.onopen = null, this._000942.onmessage = null, this._000942.onclose = null, this._000942.onerror = null), this._000940 && this._000940.close && (this._000940.close(), this._000940.onopen = null, this._000940.onmessage = null, this._000940.onclose = null, this._000940.onerror = null), this._000942 = null, this._000941 = !1, oo._000901 = !1, this._000940 = null, this._000939 = !1, oo._000900 = !1, this._000936 = ""
                }
            }, {
                key: "_000933",
                value: function() {
                    Re._001123.clear(), Re._001121.clear(), Re._001119.clear(), Re._001122.clear(), Re._001120.clear(), Re._001118.clear(), Ne._001076 = !1, Ne._001075 = !1, Ne._001059(0)
                }
            }, {
                key: "send",
                value: function(co, mo) {
                    this._000938.out++, 1 === mo && this._000928 ? this._000942.send(co) : 2 == mo && this._000927 && this._000940.send(co)
                }
            }, {
                key: "_000932",
                value: function(co) {
                    oo._001259(co), Se._001181("HSLO", "Tab " + co + " connected")
                }
            }, {
                key: "_000931",
                value: function(co, mo) {
                    this._000938.in++, eo._000913(co.data, mo)
                }
            }, {
                key: "_000930",
                value: function(co) {
                    this._000928 || this._000927 || Oe.open(), Ee._001025 = !1, Ee._001024 = !1, Se._001181("HSLO", "Tab " + co + " disconnected"), console.log("Websocket closed")
                }
            }, {
                key: "_000929",
                value: function() {
                    console.log("Websocket errored out!")
                }
            }, {
                key: "_000936",
                set: function(co) {
                    this._000943 = co, this._000937.text("IP: [" + co + "]"), to._000887(), io._000936()
                },
                get: function() {
                    return this._000943
                }
            }, {
                key: "_000928",
                get: function() {
                    return this._000942 && this._000942.readyState === this._000942.OPEN
                }
            }, {
                key: "_000927",
                get: function() {
                    return this._000940 && this._000940.readyState === this._000940.OPEN
                }
            }]), so
        }()),
        $e = new(function() {
            function so() {
                _classCallCheck(this, so), this._000926 = 0, this._000925 = 0, this._000924 = 0
            }
            return _createClass(so, [{
                key: "_000918",
                value: function() {
                    this._000923 = ro._000853, this._000922 = 0, this._000920 = this._000926 ^ this._000923, this._000921 = 0, this._000919 = this._000926 ^ this._000923
                }
            }, {
                key: "_000917",
                value: function(co, mo) {
                    var go = 1 === mo ? this._000922 : this._000921;
                    if (0 !== go)
                        for (var uo = go ^ this._000923, ko = new Uint8Array(co), po = ko.length; po--;) ko[po] ^= 255 & uo >>> 8 * (po % 4)
                }
            }, {
                key: "_000916",
                value: function(co, mo) {
                    for (var go = 1 === mo ? this._000920 : this._000919, uo = co._000952.length; uo--;) co._000952[uo] ^= 255 & go >>> 8 * (uo % 4)
                }
            }, {
                key: "_000915",
                value: function(co) {
                    var mo = 1 === co ? this._000920 : this._000919;
                    mo = Math.imul(mo, this._000925) >> 0, mo = Math.imul(mo >>> 24 ^ mo, this._000925) >> 0 ^ this._000924, mo = Math.imul(mo >>> 13 ^ mo, this._000925) >> 0, 1 === co ? this._000920 = mo >>> 15 ^ mo : this._000919 = mo >>> 15 ^ mo
                }
            }, {
                key: "_000914",
                value: function(co) {
                    var mo = 1 === co ? this._000922 : this._000921;
                    mo = Math.imul(mo, this._000925) >> 0, mo = Math.imul(mo >>> 24 ^ mo, this._000925) >> 0 ^ this._000924, mo = Math.imul(mo >>> 13 ^ mo, this._000925) >> 0, 1 === co ? this._000922 = mo >>> 15 ^ mo : this._000921 = mo >>> 15 ^ mo
                }
            }]), so
        }()),
        eo = new(function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, [{
                key: "_000913",
                value: function(co, mo) {
                    $e._000917(co, mo), this.parse(co, mo)
                }
            }, {
                key: "parse",
                value: function(co, mo) {
                    var go = new Je(co);
                    switch (go._000964()) {
                        case 17:
                            this._000912(go);
                            break;
                        case 18:
                            this._000911(mo);
                            break;
                        case 32:
                            this._000910(go, mo);
                            break;
                        case 50:
                            1 === mo && this._000907(go);
                            break;
                        case 53:
                            1 === mo && this._000908(go);
                            break;
                        case 54:
                            1 === mo && this._000909(go);
                            break;
                        case 85:
                            ve.show(mo);
                            break;
                        case 226:
                            this._000902(go, mo);
                            break;
                        case 241:
                            this._000906(go, mo);
                            break;
                        case 255:
                            this._000905(go, mo);
                    }
                }
            }, {
                key: "_000912",
                value: function(co) {
                    Ee._001028.x = co._000958(), Ee._001028.y = co._000958(), Ee._001031 = co._000958()
                }
            }, {
                key: "_000911",
                value: function(co) {
                    console.log("Reseting World..."), $e._000914(co), 1 === co ? (Re._001123.clear(), Re._001121.clear(), Re._001119.clear(), Re.eatenCellIds.clear()) : (Re._001122.clear(), Re._001120.clear(), Re._001118.clear(), Re.eatenCellIds2.clear())
                }
            }, {
                key: "_000910",
                value: function(co, mo) {
                    var go = 1 === mo ? Re._001121 : Re._001120,
                        uo = co._000962();
                    go.add(uo)
                }
            }, {
                key: "_000909",
                value: function(co) {
                    ze.clear();
                    var mo = 0;
                    for (co._000963(); !co._000953;) {
                        var go = co._000964();
                        mo++;
                        var uo = "unnamed cell",
                            ko = !1,
                            po = !1,
                            yo = !1;
                        1 & go && (mo = co._000963()), 2 & go && (uo = co._000955()), 4 & go && (ko = co._000962()), 8 & go && (po = !0, uo = Ne.nick), 16 & go && (yo = !0), (11 > mo || po) && ze.add(uo, mo, po, yo, ko)
                    }
                    ze._001258()
                }
            }, {
                key: "_000908",
                value: function(co) {
                    ze.clear();
                    for (var go, mo = 0; !co._000953;) {
                        go = co._000964(), mo++;
                        var uo = "unnamed cell",
                            ko = !1,
                            po = !1,
                            yo = !1;
                        1 & go && (mo = co._000963()), 2 & go && (uo = co._000955()), 4 & go && (ko = co._000962()), 8 & go && (po = !0, uo = Ne.nick), 16 & go && (yo = !0), (11 > mo || po) && ze.add(uo, mo, po, yo, ko)
                    }
                    ze._001258()
                }
            }, {
                key: "_000907",
                value: function(co) {
                    ze.clear(), co._000962(), ze._001172(co._000958(), co._000958(), co._000958())
                }
            }, {
                key: "_000906",
                value: function(co, mo) {
                    1 === mo ? $e._000922 = co._000962() : $e._000921 = co._000962()
                }
            }, {
                key: "_000905",
                value: function(co, mo) {
                    switch (co._000954(), co._000964()) {
                        case 16:
                            this._000904(co, mo);
                            break;
                        case 64:
                            this._000903(co, mo);
                    }
                }
            }, {
                key: "_000904",
                value: function(co, mo) {
                    ro.refreshTime();
                    for (var go = "on" === se.eatAnimation, uo = co._000963(); uo--;) {
                        var ko = co._000962(),
                            po = co._000962();
                        go && Re._001112(ko, po, mo)
                    }
                    for (; !co._000953;) {
                        var yo = co._000962();
                        if (0 === yo) break;
                        var ho = Re._001115(yo, mo),
                            fo = co._000959(),
                            vo = co._000959(),
                            Co = co._000963();
                        ho._001259 ? (ho._001087(), ho._001091 = ro._000854, ho._001095 = ho.x, ho._001094 = ho.y, ho._001093 = ho._001099, ho._001098 = fo, ho._001097 = vo, ho._001096 = Co) : (ho.x = ho._001095 = ho._001098 = fo, ho.y = ho._001094 = ho._001097 = vo, ho._001099 = ho._001093 = ho._001096 = Co, ho._001092 = ro._000854, ho._001259 = !0);
                        var So = co._000964(),
                            bo = 128 & So ? co._000964() : 0;
                        if (1 & So && (ho._001103 = !0), 2 & So) {
                            var xo = co._000964(),
                                To = co._000964(),
                                zo = co._000964();
                            ho._001086.set(xo, To, zo)
                        }
                        4 & So && (ho.skin = co._000956()), 8 & So && (ho.nick = co._000955()), 32 & So && (ho._001104 = !0), 1 & bo && (ho._001105 = !0), 2 & bo && (ho._001102 = !0), 4 & bo && (ho._001101 = co._000962())
                    }
                    for (uo = co._000963(); uo--;) {
                        var wo = co._000962();
                        Re._001111(wo, mo)
                    }
                }
            }, {
                key: "_000903",
                value: function(co, mo) {
                    var go = 0 | co._000957(),
                        uo = 0 | co._000957(),
                        ko = 0 | co._000957(),
                        po = 0 | co._000957();
                    1 === mo ? We._001258(go, uo, ko, po) : We._001035(go, uo, ko, po)
                }
            }, {
                key: "_000902",
                value: function(co, mo) {
                    var go = co._000963();
                    oo._000893(go, mo)
                }
            }]), so
        }()),
        oo = new(function() {
            function so() {
                _classCallCheck(this, so), this._000901 = !1, this._000900 = !1
            }
            return _createClass(so, [{
                key: "_001259",
                value: function(co) {
                    this._000897(co), this._000896(co), 1 === co ? (Qe._000941 = !0, this._000892()) : (Qe._000939 = !0, this._000891()), console.log("Connected to: " + Qe._000936)
                }
            }, {
                key: "_000899",
                value: function(co) {
                    return 1 === co && Qe._000941 || 2 === co && Qe._000939
                }
            }, {
                key: "_000898",
                value: function(co, mo) {
                    $e._000916(co, mo), Qe.send(co.buffer, mo), $e._000915(mo)
                }
            }, {
                key: "_000897",
                value: function(co) {
                    var mo = new Ye;
                    mo._000951(254), mo._000947(18), Qe.send(mo.buffer, co)
                }
            }, {
                key: "_000896",
                value: function(co) {
                    var mo = new Ye;
                    mo._000951(255), mo._000947($e._000923), Qe.send(mo.buffer, co)
                }
            }, {
                key: "mouse",
                value: function(co, mo) {
                    var go = Ne._001053;
                    if (this._000899(go)) {
                        var uo = 1 === go ? $e._000922 : $e._000921,
                            ko = new Ye;
                        ko._000951(16), ko._000946(co), ko._000946(mo), ko._000946(uo), this._000898(ko, go)
                    }
                }
            }, {
                key: "_001158",
                value: function(co) {
                    var mo = co || 1;
                    if (this._000899(mo) || !Ne._001058 && !Ee._001025 || co) {
                        var go = new Ye;
                        go._000951(1), this._000898(go, mo), Ee._001025 = !0, Ne._001058 || (Ee._001032 = .1)
                    }
                }
            }, {
                key: "_000895",
                value: function(co, mo) {
                    if (this._000899(mo)) {
                        co.length;
                        var go = new Ye;
                        go._000951(86), go._000945(co), this._000898(go, mo)
                    }
                }
            }, {
                key: "_000998",
                value: function() {
                    var co = Ne._001053;
                    if (this._000899(co) || !(Ne._001076 && 1 === co || Ne._001075 && 2 === co)) {
                        Ee._001025 = !1;
                        var mo = 1 === co ? Ne.nick : Ne._001061,
                            go = new Ye;
                        go._000951(0), go._000944(mo), this._000898(go, co)
                    }
                }
            }, {
                key: "_000894",
                value: function(co, mo) {
                    if (this._000899(mo - 1) && !(this._000901 && 2 === mo || this._000900 && 3 === mo)) {
                        var go = co.length,
                            uo = "f".charCodeAt(0),
                            ko = new Ye,
                            po = ko._000952;
                        po.push(uo), po.push(8, 1, 18), po.push(go + 25), po.push(1, 8), po.push(10, 82, go + 25), po.push(1, 8), po.push(mo), po.push(18, 13, 8, 5, 18, 5);
                        for (var yo = 0; yo < "2.9.9".length; yo++) po.push("2.9.9".charCodeAt(yo));
                        po.push(24, 0, 32, 0, 26), po.push(go, 1);
                        for (var ho = 0; ho < go; ho++) po.push(co.charCodeAt(ho));
                        2 === mo ? (this._000898(ko, 1), this._000901 = !0) : 3 == mo && (this._000898(ko, 2), this._000900 = !0)
                    }
                }
            }, {
                key: "split",
                value: function() {
                    var co = Ne._001053;
                    if (this._000899(co)) {
                        var mo = new Ye;
                        mo._000951(17), this._000898(mo, co)
                    }
                }
            }, {
                key: "eject",
                value: function() {
                    var co = Ne._001053;
                    if (this._000899(co)) {
                        var mo = new Ye;
                        mo._000951(21), this._000898(mo, co)
                    }
                }
            }, {
                key: "_001024",
                value: function() {
                    if (this._000899(1)) {
                        Ee._001024 = !Ee._001024;
                        var co = new Ye;
                        co._000951(18), this._000898(co, 1)
                    }
                }
            }, {
                key: "_000893",
                value: function(co, mo) {
                    if (this._000899(mo)) {
                        var go = new Ye;
                        go._000951(227), go._000949(co), this._000898(go, mo)
                    }
                }
            }, {
                key: "_000892",
                value: function() {
                    if (xe._001178) {
                        var co = xe.token;
                        this._000894(co, 2)
                    }
                }
            }, {
                key: "_000891",
                value: function() {
                    if (Te._001178) {
                        var co = Te.token;
                        this._000894(co, 3)
                    }
                }
            }]), so
        }()),
        to = new(function() {
            function so() {
                _classCallCheck(this, so), this._000890 = null
            }
            return _createClass(so, [{
                key: "_000888",
                value: function(co) {
                    return new DataView(new ArrayBuffer(co))
                }
            }, {
                key: "_000889",
                value: function() {
                    this;
                    this._000890 = {
                        send: function() {}
                    }, ro._000853 = 30010, ro._000852 = "3.0.10", $e._000926 = 673720360, $e._000925 = 1540483477, $e._000924 = 114296087, he._001204()
                }
            }, {
                key: "_000932",
                value: function() {
                    this.nick(), this.skin(), this._001244(), this._000887()
                }
            }, {
                key: "_000931",
                value: function(co) {
                    var mo = new Je(co.data);
                    ro._000853 = mo._000962(), ro._000852 = mo._000956(), $e._000926 = mo._000962(), $e._000925 = mo._000962(), $e._000924 = mo._000962(), he._001204()
                }
            }, {
                key: "_000930",
                value: function() {}
            }, {
                key: "_000929",
                value: function() {}
            }, {
                key: "nick",
                value: function() {
                    if (this._000886) {
                        var co = unescape(encodeURIComponent(Ne.nick)),
                            mo = unescape(encodeURIComponent(Ne._001061)),
                            go = this._000888(1 + co.length + 1 + mo.length + 1),
                            uo = 0;
                        go.setUint8(uo++, 0, !0);
                        var ko = !0,
                            po = !1,
                            yo;
                        try {
                            for (var ho, vo, fo = co[Symbol.iterator](); !(ko = (ho = fo.next()).done); ko = !0) vo = ho.value, go.setUint8(uo++, vo.charCodeAt(0), !0)
                        } catch (wo) {
                            po = !0, yo = wo
                        } finally {
                            try {
                                !ko && fo.return && fo.return()
                            } finally {
                                if (po) throw yo
                            }
                        }
                        go.setUint8(uo++, 0, !0);
                        var Co = !0,
                            So = !1,
                            bo;
                        try {
                            for (var xo, zo, To = mo[Symbol.iterator](); !(Co = (xo = To.next()).done); Co = !0) zo = xo.value, go.setUint8(uo++, zo.charCodeAt(0), !0)
                        } catch (wo) {
                            So = !0, bo = wo
                        } finally {
                            try {
                                !Co && To.return && To.return()
                            } finally {
                                if (So) throw bo
                            }
                        }
                        go.setUint8(uo++, 0, !0), this._000890.send(go.buffer)
                    }
                }
            }, {
                key: "skin",
                value: function() {
                    if (this._000886) {
                        var co = unescape(encodeURIComponent(Ne.skin)),
                            mo = this._000888(1 + co.length + 1),
                            go = 0;
                        mo.setUint8(go++, 1, !0);
                        var uo = !0,
                            ko = !1,
                            po;
                        try {
                            for (var yo, fo, ho = co[Symbol.iterator](); !(uo = (yo = ho.next()).done); uo = !0) fo = yo.value, mo.setUint8(go++, fo.charCodeAt(0), !0)
                        } catch (vo) {
                            ko = !0, po = vo
                        } finally {
                            try {
                                !uo && ho.return && ho.return()
                            } finally {
                                if (ko) throw po
                            }
                        }
                        mo.setUint8(go++, 0, !0), this._000890.send(mo.buffer)
                    }
                }
            }, {
                key: "_001244",
                value: function() {
                    if (this._000886) {
                        var co = unescape(encodeURIComponent(Ne._001244)),
                            mo = this._000888(1 + co.length + 1),
                            go = 0;
                        mo.setUint8(go++, 2, !0);
                        var uo = !0,
                            ko = !1,
                            po;
                        try {
                            for (var yo, fo, ho = co[Symbol.iterator](); !(uo = (yo = ho.next()).done); uo = !0) fo = yo.value, mo.setUint8(go++, fo.charCodeAt(0), !0)
                        } catch (vo) {
                            ko = !0, po = vo
                        } finally {
                            try {
                                !uo && ho.return && ho.return()
                            } finally {
                                if (ko) throw po
                            }
                        }
                        mo.setUint8(go++, 0, !0), this._000890.send(mo.buffer)
                    }
                }
            }, {
                key: "_000887",
                value: function() {
                    if (this._000886) {
                        var co = unescape(encodeURIComponent(Qe._000936)),
                            mo = this._000888(1 + co.length + 1),
                            go = 0;
                        mo.setUint8(go++, 3, !0);
                        var uo = !0,
                            ko = !1,
                            po;
                        try {
                            for (var yo, fo, ho = co[Symbol.iterator](); !(uo = (yo = ho.next()).done); uo = !0) fo = yo.value, mo.setUint8(go++, fo.charCodeAt(0), !0)
                        } catch (vo) {
                            ko = !0, po = vo
                        } finally {
                            try {
                                !uo && ho.return && ho.return()
                            } finally {
                                if (ko) throw po
                            }
                        }
                        mo.setUint8(go++, 0, !0), this._000890.send(mo.buffer)
                    }
                }
            }, {
                key: "_000886",
                get: function() {
                    return this._000890 && this._000890.readyState === this._000890.OPEN
                }
            }]), so
        }()),
        ao = new(function() {
            function so() {
                _classCallCheck(this, so), this._000936 = "92.222.23.142", this._000885 = 3e3, this._000890 = null
            }
            return _createClass(so, [{
                key: "_000934",
                value: function() {
                    var co = this;
                    this._000890 = new WebSocket("ws://" + this._000936 + ":" + this._000885), this._000890.binaryType = "arraybuffer", this._000890.onopen = function() {
                        co._000932()
                    }, this._000890.onmessage = function(mo) {
                        co._000931(mo)
                    }, this._000890.onclose = function() {
                        co._000930()
                    }, this._000890.onerror = function() {
                        co._000929()
                    }, console.log("Connecting to HSLO Networks.")
                }
            }, {
                key: "send",
                value: function(co) {
                    this._000890.send(co)
                }
            }, {
                key: "_000932",
                value: function() {
                    io._001259(), console.log("Connected to HSLO Networks."), Se._001181("HSLO", "Connected to HSLO Networks.")
                }
            }, {
                key: "_000931",
                value: function(co) {
                    lo.parse(co)
                }
            }, {
                key: "_000930",
                value: function() {
                    var co = this;
                    console.log("Disconnected from HSLO networks."), Se._001181("HSLO", "Disconnected from HSLO networks."), setTimeout(function() {
                        co._000934()
                    }, 5e3)
                }
            }, {
                key: "_000929",
                value: function() {
                    console.log("Connection to HSLO networks errored out!")
                }
            }, {
                key: "_000886",
                get: function() {
                    return this._000890 && this._000890.readyState === this._000890.OPEN
                }
            }]), so
        }()),
        no = new(function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, [{
                key: "_001259",
                value: function() {
                    this._000884 = new Map, this._000883 = -1, this._000878 = !1, this._000877 = new He(0), ao._000934()
                }
            }, {
                key: "clear",
                value: function() {
                    this._000884.clear(), console.log("cleared")
                }
            }, {
                key: "remove",
                value: function(co) {
                    this._000884.delete(co)
                }
            }, {
                key: "_000876",
                value: function(co) {
                    if (co === this._000883) return {};
                    var mo = this._000884.get(co);
                    return void 0 === mo && (mo = this._000875(co)), mo
                }
            }, {
                key: "_000875",
                value: function(co) {
                    var mo = new He(co);
                    return this._000884.set(co, mo), mo
                }
            }, {
                key: "_000874",
                value: function(co, mo, go, uo) {
                    var ko = uo || "Anonymous";
                    if (uo || co !== this._000883) {
                        var po = this._000884.get(co);
                        void 0 !== po && (ko = po.nick)
                    } else ko = Ne.nick;
                    1 === mo || 3 === mo ? Se._001182(ko, go) : 2 == mo && Se.command(ko, go)
                }
            }]), so
        }()),
        lo = new(function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, [{
                key: "parse",
                value: function(co) {
                    var mo = new Je(co.data);
                    switch (mo._000964()) {
                        case 1:
                            this._001258(mo);
                            break;
                        case 2:
                            this._000874(mo);
                            break;
                        case 3:
                            this.commander(mo);
                            break;
                        case 4:
                            this._000883(mo);
                            break;
                        case 5:
                            this._000873(mo);
                    }
                }
            }, {
                key: "_001258",
                value: function(co) {
                    Ne._001058 && io._000870(), Ne._001058 || !Ee._001025 || Ee._001024 || io._000877();
                    for (var go, mo = co._000964(); mo--;) go = co._000962(), no.remove(go);
                    for (mo = co._000964(); mo--;) {
                        var uo = co._000962(),
                            ko = no._000876(uo),
                            po = co._000964();
                        if (1 & po) {
                            var yo = co._000955();
                            2 === ko._001050 ? (Se._001181(yo, "joined the chatroom."), ko._001050 = 1) : 1 === ko._001050 && Se._001181(ko.nick, "changed name to " + yo), ko.nick = yo
                        }
                        if (2 & po) {
                            var ho = co._000964(),
                                fo = co._000964(),
                                vo = co._000964();
                            ko._001078 = "#" + (16777216 + (ho << 16) + (fo << 8) + vo).toString(16).slice(1)
                        }
                        4 & po && (ko.skin = co._000956()), 16 & po && (ko.x = co._000960(), ko.y = co._000960(), ko._001072 = co._000962()), 32 & po && (ko._001058 = co._000964()), 64 & po && (ko._001074 = co._000964())
                    }
                    var Co = co._000964();
                    (no._000878 = Co) && (no._000877.x = co._000960(), no._000877.y = co._000960())
                }
            }, {
                key: "_000873",
                value: function(co) {
                    no.clear();
                    for (var mo = co._000964(); mo--;) {
                        var go = co._000962(),
                            uo = no._000875(go);
                        uo.nick = co._000955();
                        var ko = co._000964(),
                            po = co._000964(),
                            yo = co._000964();
                        uo._001078 = "#" + (16777216 + (ko << 16) + (po << 8) + yo).toString(16).slice(1), uo.skin = co._000956(), uo.x = co._000960(), uo.y = co._000960(), uo._001072 = co._000962(), uo._001058 = co._000964(), uo._001074 = co._000964()
                    }
                }
            }, {
                key: "_000874",
                value: function(co) {
                    var mo = co._000962(),
                        go = co._000964(),
                        uo = co._000955();
                    if (3 === go) {
                        var ko = uo.split("\x02");
                        no._000874(mo, go, ko[1], ko[0])
                    } else no._000874(mo, go, uo)
                }
            }, {
                key: "commander",
                value: function(co) {
                    var mo = co._000960() + We._001042.x,
                        go = co._000960() + We._001042.y,
                        uo = ro._000854;
                    _o._000858.add({
                        x: mo,
                        y: go,
                        _000854: uo
                    })
                }
            }, {
                key: "_000883",
                value: function(co) {
                    var mo = co._000962();
                    no._000883 = mo
                }
            }]), so
        }()),
        io = new(function() {
            function so() {
                _classCallCheck(this, so)
            }
            return _createClass(so, [{
                key: "_001259",
                value: function() {
                    this.nick(), this.skin(), this._001244(), this._001086(), this._000936(), this._000872()
                }
            }, {
                key: "nick",
                value: function(co) {
                    function mo() {
                        return co.apply(this, arguments)
                    }
                    return mo.toString = function() {
                        return co.toString()
                    }, mo
                }(function() {
                    if (ao._000886) {
                        var co = new Ye;
                        co._000951(1), co._000944(nick), ao.send(co.buffer)
                    }
                })
            }, {
                key: "_001086",
                value: function() {
                    if (ao._000886) {
                        var co = new Ye;
                        co._000951(2), co._000951(Ne._001060.r), co._000951(Ne._001060.g), co._000951(Ne._001060.b), ao.send(co.buffer)
                    }
                }
            }, {
                key: "skin",
                value: function() {
                    if (ao._000886) {
                        var co = new Ye;
                        co._000951(4), co._000945(Ne.skin), ao.send(co.buffer)
                    }
                }
            }, {
                key: "_000936",
                value: function() {
                    if (ao._000886 && Qe._000936) {
                        var co = new Ye,
                            mo = (Qe._000936.match(/live-arena-(\w+)\.agar\.io/) || ["room", "xxxx"])[1];
                        co._000951(8), co._000951(1), co._000951(mo.charCodeAt(0)), co._000951(mo.charCodeAt(1)), co._000951(mo.charCodeAt(2)), co._000951(mo.charCodeAt(3)), co._000949(mo.charCodeAt(4)), ao.send(co.buffer)
                    }
                }
            }, {
                key: "_001244",
                value: function() {
                    if (ao._000886) {
                        var co = new Ye;
                        co._000951(8), co._000951(2), co._000945(Ne._001244), ao.send(co.buffer)
                    }
                }
            }, {
                key: "_000870",
                value: function() {
                    if (ao._000886) {
                        var co = new Ye;
                        co._000951(16), co._000948(Ne.x - We._001042.x), co._000948(Ne.y - We._001042.y), co._000947(Ne._001072), ao.send(co.buffer)
                    }
                }
            }, {
                key: "_000872",
                value: function() {
                    if (ao._000886) {
                        var co = new Ye,
                            mo = Ne._001058 ? 1 : 0;
                        co._000951(32), co._000951(mo), ao.send(co.buffer)
                    }
                }
            }, {
                key: "_000874",
                value: function(co, mo) {
                    if (ao._000886) {
                        var go = new Ye;
                        go._000951(64), go._000951(co), go._000945(mo), ao.send(go.buffer)
                    }
                }
            }, {
                key: "commander",
                value: function() {
                    if (ao._000886) {
                        var co = 1 === Ne._001053 ? We._001042 : We._001041,
                            mo = ge._001229 - co.x,
                            go = ge._001228 - co.y,
                            uo = new Ye;
                        uo._000951(128), uo._000948(mo), uo._000948(go), ao.send(uo.buffer)
                    }
                }
            }, {
                key: "_000877",
                value: function() {
                    if (ao._000886) {
                        var co = Ee._001028.x - We._001042.x,
                            mo = Ee._001028.y - We._001042.y,
                            go = new Ye;
                        go._000951(0), go._000951(16), go._000948(co), go._000948(mo), ao.send(go.buffer)
                    }
                }
            }]), so
        }()),
        _o = new(function() {
            function so() {
                var co = this;
                _classCallCheck(this, so), this._001044 = te.getElementById("canvas"), this._001167 = this._001044.getContext("2d"), this._001168 = 2 * Math.PI, this._000858 = new Set, this._000868(), ee.onresize = function() {
                    co._000868()
                }
            }
            return _createClass(so, [{
                key: "_000868",
                value: function() {
                    this._001044.width = 0 | ee.innerWidth, this._001044.height = 0 | ee.innerHeight
                }
            }, {
                key: "_000867",
                value: function() {
                    this._001167.save(), this._000866(), this.vanillaGrid(), this._000865(), je._000983(), this._000864(), Ge._000983(), Xe._000983(), Ve._000994(), this._000857(), this._000856(), Ze._000983(), this._001123(), this._000859(), Ie._001005(), this._001167.restore()
                }
            }, {
                key: "_000866",
                value: function() {
                    this._001167.clearRect(0, 0, this._001044.width, this._001044.height)
                }
            }, {
                key: "vanillaGrid",
                value: function() {
                    if ("off" !== se.vanillaGrid) {
                        var co = this._001167,
                            mo = Ee._001030,
                            go = this._001044.width / mo,
                            uo = this._001044.height / mo,
                            ko = (-Ee.x + go / 2) % 50,
                            po = (-Ee.y + uo / 2) % 50;
                        for (co.strokeStyle = Ce.gridColor, co.lineWidth = 0 | Math.min(Ce.gridWidth, 20) * Ee._001030, co.globalAlpha = .2 * mo, co.beginPath(); ko < go;) co.moveTo(ko * mo, 0), co.lineTo(ko * mo, uo * mo), ko += 50;
                        for (; po < uo;) co.moveTo(0, po * mo), co.lineTo(go * mo, po * mo), po += 50;
                        co.closePath(), co.stroke(), co.globalAlpha = 1
                    }
                }
            }, {
                key: "_000865",
                value: function() {
                    var co = (this._001044.width >> 1) / Ee._001030 - Ee.x,
                        mo = (this._001044.height >> 1) / Ee._001030 - Ee.y;
                    this._001167.scale(Ee._001030, Ee._001030), this._001167.translate(co, mo)
                }
            }, {
                key: "_000864",
                value: function() {
                    var co = this._001167,
                        mo = Ce.borderWidth,
                        go = mo >> 1;
                    co.strokeStyle = Ce.borderColor, co.lineWidth = mo, co.strokeRect(We.left - go, We.top - go, We._001043 + mo, We._001043 + mo)
                }
            }, {
                key: "_001123",
                value: function() {
                    var co = this._001167,
                        mo = "off" !== se.cellMass,
                        go = "off" !== se.cellNick,
                        uo = "on" === se.hideOwnNick,
                        ko = "on" === se.hideOwnMass,
                        po = "on" === se.urlSkins,
                        yo = "on" === se.teamIndicator,
                        ho = Ce.indicatorSize,
                        fo = Ce.cellTransparency / 100,
                        vo = Ce.cellNickSize / 100,
                        Co = Ce.cellMassSize / 100,
                        So = se.cellTextAnimation,
                        bo = "off" === So ? 0 : "stepped" === So ? 1 : 2,
                        xo = Ce.lightenCellColor / 100,
                        To = Ce.virusColor,
                        zo = Ce.multiboxActive,
                        wo = Ce.multiboxInactive,
                        Ko = Ce.multiboxRingWidth,
                        Mo = se.CellAnimation;
                    co.strokeStyle = Ce.virusBorderColor, co.lineWidth = Ce.virusBorderWidth;
                    var Ao = !0,
                        Fo = !1,
                        Lo;
                    try {
                        for (var Oo, Ro = Re._001116[Symbol.iterator](); !(Ao = (Oo = Ro.next()).done); Ao = !0) {
                            var Po = Oo.value,
                                No = 2 === Po._001100 ? We._001033 : ie._001266,
                                Ho = !Po._001103 && !Po._001104 && Ve._000996.has(Po._001085),
                                Bo = 1;
                            if (Bo = 0 > (Bo = Po._001090 ? 1 - (ro._000854 - Po._001090) / Mo : (ro._000854 - Po._001092 + 50) / Mo) ? 0 : 1 < Bo ? 1 : Bo, co.beginPath(), co.arc(Po.x - No.x, Po.y - No.y, Po._001099, 0, this._001168, !0), co.closePath(), Po._001103 ? (co.fillStyle = To, co.globalAlpha = .7, co.fill(), co.globalAlpha = 1, co.stroke()) : (co.fillStyle = 1 > xo ? this._000863(Po._001086, xo) : Po._001086.hex, 1 > fo * Bo ? (co.globalAlpha = fo * Bo, co.fill(), co.globalAlpha = 1) : co.fill()), !Po._001104) {
                                if (!Po._001103) {
                                    1 == Bo && yo && !Po._001106 && Ho && 50 > Po._001099 * Ee._001030 && co.drawImage(Be._001045, Po.x - No.x - ho / 2, Po.y - No.y - Po._001099 - 10 - ho, ho, ho);
                                    var Wo = Ho && po && Ve._000993(Po._001085);
                                    if (Wo && co.drawImage(Wo, Po.x - No.x - Po._001099, Po.y - No.y - Po._001099, 2 * Po._001099, 2 * Po._001099), 1 == Bo && Po._001106) {
                                        var Eo = Po._001099 * Ko / 100;
                                        co.beginPath(), co.arc(Po.x - No.x, Po.y - No.y, Po._001099 - (Eo >> 1), 0, this._001168, !0), co.closePath(), co.lineWidth = 0 | Eo, co.strokeStyle = Po._001100 === Ne._001053 ? zo : wo, co.stroke(), co.strokeStyle = Ce.virusBorderColor, co.lineWidth = Ce.virusBorderWidth
                                    }
                                    if (1 == Bo && (Po._001106 && !uo || !Po._001106 && go)) {
                                        var Io = Ie.nick(Po);
                                        if (Io) {
                                            var Uo = (2 == bo ? Po._001099 : 1 == bo ? 50 + 75 * (0 | Po._001099 / 75) : Po._001099) / 3 / Io.height * vo,
                                                Do = Io.width * Uo,
                                                Go = Io.height * Uo;
                                            co.drawImage(Io, Po.x - No.x - (Do >> 1), Po.y - No.y - (Go >> 1), Do, Go)
                                        }
                                    }
                                }
                                if (1 == Bo && (Po._001106 && !ko || !Po._001106 && mo)) {
                                    var Vo = Ie._001072(Po);
                                    if (Vo) {
                                        var Zo = (2 == bo ? Po._001099 : 1 == bo ? 50 + 75 * (0 | Po._001099 / 75) : Po._001099) / 3 / Vo.height * Co,
                                            Xo = Vo.width * Zo,
                                            jo = Vo.height * Zo,
                                            qo = Po.y - No.y + (Po._001084 || Po._001106 && uo || !Po._001106 && !go ? -jo >> 1 : jo >> 2);
                                        co.drawImage(Vo, Po.x - No.x - (Xo >> 1), qo, Xo, jo)
                                    }
                                }
                            }
                        }
                    } catch (Jo) {
                        Fo = !0, Lo = Jo
                    } finally {
                        try {
                            !Ao && Ro.return && Ro.return()
                        } finally {
                            if (Fo) throw Lo
                        }
                    }
                }
            }, {
                key: "_000863",
                value: function(co, mo) {
                    return "rgb(" + (0 | co.r * mo) + "," + (0 | co.g * mo) + "," + (0 | co.b * mo) + ")"
                }
            }, {
                key: "_000862",
                value: function(co) {
                    var mo = co.match(/https?:\/\/i\.imgur\.com\/([\w0-9]{7})\.(png|jpg|gif)/i);
                    return null === mo ? "XXXXXXX" : mo[1]
                }
            }, {
                key: "_000861",
                value: function(co) {
                    return null !== co.match(/#hue\s??=\s??auto\s??,\s??blend\s??=\s??auto/i)
                }
            }, {
                key: "_000860",
                value: function(co) {
                    return "http://i.imgur.com/" + co + ".png"
                }
            }, {
                key: "_000859",
                value: function() {
                    var co = this._001167,
                        mo = "off" === se.commander;
                    co.strokeStyle = "#ffffff";
                    var go = !0,
                        uo = !(co.lineWidth = 5),
                        ko;
                    try {
                        for (var po, yo = this._000858.values()[Symbol.iterator](); !(go = (po = yo.next()).done); go = !0) {
                            var ho = po.value,
                                fo = ho.x,
                                vo = ho.y,
                                Co = ro._000854 - ho._000854;
                            if (1250 < Co) this._000858.delete(ho);
                            else if (!(mo || 1 > Co)) {
                                var So = 1e3 * Co / 1250;
                                co.globalAlpha = 333 < So ? (1e3 - So) / 667 : 1;
                                var xo = co.createRadialGradient(fo, vo, .7 * So, fo, vo, So);
                                xo.addColorStop(0, "rgba(0,0,0,0)"), xo.addColorStop(1, Ce.commanderColor), co.fillStyle = xo, co.beginPath(), co.arc(fo, vo, So, 0, this._001168, !0), co.closePath(), co.fill(), co.stroke()
                            }
                        }
                    } catch (To) {
                        uo = !0, ko = To
                    } finally {
                        try {
                            !go && yo.return && yo.return()
                        } finally {
                            if (uo) throw ko
                        }
                    }
                }
            }, {
                key: "_000857",
                value: function() {
                    if ("off" !== se.cursorLine) {
                        var co = this._001167;
                        co.strokeStyle = "#fff", co.lineWidth = 4, co.lineCap = "round", co.lineJoin = "round";
                        var mo = (ge.x - this._001044.width / 2) / Ee._001030 + Ee.x,
                            go = (ge.y - this._001044.height / 2) / Ee._001030 + Ee.y;
                        co.beginPath();
                        var uo = 1 === Ne._001053 ? Re._001119 : Re._001118,
                            ko = !0,
                            po = !1,
                            yo;
                        try {
                            for (var ho, vo, fo = uo.values()[Symbol.iterator](); !(ko = (ho = fo.next()).done); ko = !0) vo = ho.value, co.moveTo(vo.x, vo.y), co.lineTo(mo, go)
                        } catch (Co) {
                            po = !0, yo = Co
                        } finally {
                            try {
                                !ko && fo.return && fo.return()
                            } finally {
                                if (po) throw yo
                            }
                        }
                        co.closePath(), co.stroke()
                    }
                }
            }, {
                key: "_000856",
                value: function() {
                    var co = this;
                    if ("off" !== se.splitRings) {
                        var mo = _o._001167;
                        mo.lineWidth = 3, mo.strokeStyle = "#656565", mo.beginPath(), Re._001119.forEach(function(go) {
                            60 > go._001099 || (mo.moveTo(go.x + 800, go.y), mo.arc(go.x, go.y, 800, 0, co._001168, !0))
                        }), mo.closePath(), mo.stroke()
                    }
                }
            }]), so
        }()),
        ro = new(function() {
            function so() {
                _classCallCheck(this, so), this._000854 = Date.now(), this._000853 = 0, this._000852 = "0.0.0"
            }
            return _createClass(so, [{
                key: "_001259",
                value: function() {
                    var co = this;
                    Oe._001259(), Re._001259(), Ne._001259(), Ee._001259(), no._001259(), this._000855 = new _e(function() {
                        co._000867()
                    }), setInterval(function() {
                        ge.send()
                    }, 40), to._000889()
                }
            }, {
                key: "_000867",
                value: function() {
                    ro.refreshTime(), Re._001258(), Ne._001258(), Ee._001258(), _o._000867(), we._000867(), Ke._000867(), Me._001258(), Fe._001258(), Le._001258()
                }
            }, {
                key: "refreshTime",
                value: function() {
                    this._000854 = Date.now()
                }
            }]), so
        }());
    ee.onload = function() {
        return "MuBox v5.0.0" === te.title ? void(re._001259(), ro._001259(), oe("#bundlejs").remove(), oe("#loading-screen").fadeOut(500)) : (oe("#ls-icon").html("<i class=\"fa fa-exclamation-circle\" aria-hidden=\"true\"></i>"), void oe("#ls-message").text(" Extention is not up to date!"))
    }
}(window, $, document);
