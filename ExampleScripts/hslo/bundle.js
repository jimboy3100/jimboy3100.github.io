/* 
    ...threat text was removed for etiquette reasons
*/

function _classCallCheck(e, t) {
    if (!(e instanceof t))
        throw new TypeError("Cannot call a class as a function")
}
var onyxv4_s5_0x4fda = function(e, t) {
    var o = 290[e -= 0];
    if (void 0 === onyxv4_s5_0x4fda.PYmDUt) {
        !function() {
            var e;
            try {
                e = Function('return (function() {}.constructor("return this")( ));')()
            } catch (t) {
                e = window
            }
            e.atob || (e.atob = function(e) {
                for (var t, o, i = (e + "").replace(/=+$/, ""), s = 0, n = 0, a = ""; o = i.charAt(n++); ~o && (t = s % 4 ? 64 * t + o : o,
                s++ % 4) ? a += String.fromCharCode(255 & t >> (6 & -2 * s)) : 0)
                    o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);
                return a
            })
        }();
        onyxv4_s5_0x4fda.psqXSL = function(e, t) {
            for (var o, i = [], s = 0, n = "", a = "", r = 0, l = (e = atob(e)).length; r < l; r++)
                a += "%" + ("00" + e.charCodeAt(r).toString(16)).slice(-2);
            e = decodeURIComponent(a);
            for (var h = 0; 256 > h; h++)
                i[h] = h;
            for (h = 0; 256 > h; h++)
                s = (s + i[h] + t.charCodeAt(h % t.length)) % 256,
                o = i[h],
                i[h] = i[s],
                i[s] = o;
            h = 0,
            s = 0;
            for (var c = 0; c < e.length; c++)
                s = (s + i[h = (h + 1) % 256]) % 256,
                o = i[h],
                i[h] = i[s],
                i[s] = o,
                n += String.fromCharCode(e.charCodeAt(c) ^ i[(i[h] + i[s]) % 256]);
            return n
        }
        ,
        onyxv4_s5_0x4fda.nQVQtX = {},
        onyxv4_s5_0x4fda.PYmDUt = !0
    }
    var i = onyxv4_s5_0x4fda.nQVQtX[e];
    return void 0 === i ? (void 0 === onyxv4_s5_0x4fda.prmOHq && (onyxv4_s5_0x4fda.prmOHq = !0),
    o = onyxv4_s5_0x4fda.psqXSL(o, t),
    onyxv4_s5_0x4fda.nQVQtX[e] = o) : o = i,
    o
};
const onyxv4_s5_0x1ad2eb = (()=>{
    return (e,t)=>{
        if (Array.isArray(e))
            return e;
        if (Symbol.iterator in Object(e))
            return function(e, t) {
                const o = [];
                let i, s = !0, n = !1;
                try {
                    for (var a, r = e[Symbol.iterator](); !(s = (a = r.next()).done) && (o.push(a.value),
                    !t || o.length !== t); s = !0)
                        ;
                } catch (e) {
                    n = !0,
                    i = e
                } finally {
                    try {
                        !s && r.return && r.return()
                    } finally {
                        if (n)
                            throw i
                    }
                }
                return o
            }(e, t);
        throw new TypeError("Invalid attempt to destructure non-iterable instance")
    }
})(), _createClass = function() {
    function e(e, t) {
        for (let o, i = 0; i < t.length; i++)
            (o = t[i]).enumerable = o.enumerable || !1,
            o.configurable = !0,
            "value"in o && (o.writable = !0),
            Object.defineProperty(e, o.key, o)
    }
    return (()=>{
        let e = !0;
        return (t,o)=>{
            const i = e ? function() {
                if (o) {
                    const e = o.apply(t, arguments);
                    return o = null,
                    e
                }
            } : ()=>{};
            return e = !1,
            i
        }
    })()(this, ()=>{
        const e = e=>{
            e.indexOf(!1) && t(e)
        }
          , t = t=>{
            3 !== t.indexOf("e") && e(t)
        }
        ;
        e(/\w+ *\(\) *{\w+ *['|"].+['|"];? *}/.test((()=>"dev").toString()) ? (/(\\[x|u](\w){2,4})+/.test((()=>"window").toString()),
        "indexOf") : "indexOf")
    })(),
    (t,o,i)=>(o && e(t.prototype, o),
    i && e(t, i),
    t)
}();
((s,r,h)=>{
    const c = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            !localStorage.getItem("version") && localStorage.setItem("version", "5.4.0 (9)"),
            this.old = `HSLO532-`,
            this.latest = `HSLO540-`,
            this.prefix = localStorage.getItem("version").includes(`5.4.0`) ? this.latest : this.old
        }
        return _createClass(e, [{
            key: "get",
            value(e, t) {
                let o;
				try {
					o = JSON.parse(localStorage.getItem(this.prefix + e));
				} catch(e) {
					console.log("Oh shit dude you just messed up the prefix");
				};
                return null !== o && void 0 !== o[t] && o[t]
            }
        }, {
            key: "set",
            value(e, t, o) {
                let i = JSON.parse(localStorage.getItem(this.prefix + e));
                null === i && (i = {}),
                i[t] = o,
                localStorage.setItem(this.prefix + e, JSON.stringify(i))
            }
        }, {
			key: "getSettings",
			value() {
				let hslo = {};
				document.getElementById("checkProfiles").checked && (hslo.profiles = JSON.parse(localStorage.getItem(`${c.prefix}profiles`)));
				document.getElementById("checkSettings").checked && (hslo.settings = JSON.parse(localStorage.getItem(`${c.prefix}settings`)));
				document.getElementById("checkTheme").checked && (hslo.theme = JSON.parse(localStorage.getItem(`${c.prefix}theme`)));
				document.getElementById("checkHotkeys").checked && (hslo.hotkeys = JSON.parse(localStorage.getItem(`${c.prefix}hotkeys`)));
				document.getElementById("checkCommands").checked && (hslo.commands = JSON.parse(localStorage.getItem(`${c.prefix}commands`)));
				document.getElementById("checkMouse").checked && (hslo.mouse = JSON.parse(localStorage.getItem(`${c.prefix}mouse`)));
				let string = JSON.stringify(hslo);
				document.getElementById("getSettings").value = string;
			}
		}, {
			key: "loadSettings",
			value() {
				let loadedSettings = document.getElementById("loadSettings").value;
				let hslo = JSON.parse(`${loadedSettings}`);
				if (typeof hslo != "object" || !hslo) {
					document.getElementById("loadSettings").value = "Error! Not an object!"
				} else {
					//console.log(hslo);
					document.getElementById("checkProfiles").checked && hslo.profiles && localStorage.setItem(`${c.prefix}profiles`, JSON.stringify(hslo.profiles));
					document.getElementById("checkSettings").checked && hslo.settings && localStorage.setItem(`${c.prefix}settings`, JSON.stringify(hslo.settings));
					document.getElementById("checkTheme").checked && hslo.theme && localStorage.setItem(`${c.prefix}theme`, JSON.stringify(hslo.theme));
					document.getElementById("checkHotkeys").checked && hslo.hotkeys && localStorage.setItem(`${c.prefix}hotkeys`, JSON.stringify(hslo.hotkeys));
					document.getElementById("checkCommands").checked && hslo.commands && localStorage.setItem(`${c.prefix}commands`, JSON.stringify(hslo.commands));
					document.getElementById("checkMouse").checked && hslo.mouse && localStorage.setItem(`${c.prefix}mouse`, JSON.stringify(hslo.mouse));
					m.alert("HSLO", "F5 to see effects.");
				};
			}
		}, {
			key: "resetSettings",
			value() {
				document.getElementById("checkProfiles").checked && localStorage.removeItem(`${c.prefix}profiles`);
				document.getElementById("checkSettings").checked && localStorage.removeItem(`${c.prefix}settings`);
				document.getElementById("checkTheme").checked && localStorage.removeItem(`${c.prefix}theme`);
				document.getElementById("checkHotkeys").checked && localStorage.removeItem(`${c.prefix}hotkeys`);
				document.getElementById("checkCommands").checked && localStorage.removeItem(`${c.prefix}commands`);
				document.getElementById("checkMouse").checked && localStorage.removeItem(`${c.prefix}mouse`);
				m.alert("HSLO", "F5 to see effects.");
			}
		}]),
        e
    })());
    window.c = c,
    n = function e() {
        const t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 0
          , o = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
        _classCallCheck(this, e),
        this.x = t,
        this.y = o
    },
    i = (()=>{
        function e() {
            0 < arguments.length && void 0 !== arguments[0] && arguments[0],
            1 < arguments.length && void 0 !== arguments[1] && arguments[1],
            2 < arguments.length && void 0 !== arguments[2] && arguments[2],
            _classCallCheck(this, e),
            this.r = 0,
            this.g = 0,
            this.b = 0,
            this.R = 0,
            this.G = 0,
            this.B = 0,
            this.hex = "#000000"
        }
        return _createClass(e, [{
            key: "set",
            value(e, t, o) {
                this.r = e,
                this.g = t,
                this.b = o,
                this.R = e,
                this.G = t,
                this.B = o,
                this.hex = "#" + (16777216 + (.9 * e << 16) + (.9 * t << 8) + (.9 * o << 0)).toString(16).slice(1)
            }
        }]),
        e
    })(),
    e = new ((()=>{
        return function e() {
            _classCallCheck(this, e),
            this._000482 = n,
            this._000481 = new n,
            this.getColorObject = i
        }
    })()),
    /*o = (()=>{
        function e(t) {
            const o = this;
            _classCallCheck(this, e),
            this.event = t,
            s.requestAnimationFrame(()=>{
                o.run()
            })
        }
        return _createClass(e, [{
            key: "run",
            value() {
                s.requestAnimationFrame(()=>{
                    this.run()
                }),
                this.event()
            }
        }]),
        e
    })(),*/
    t = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.containerNode = r("#loading-screen"),
            this.statusIconNode = r("#loading-screen .status .icon"),
            this.statusMessageNode = r("#loading-screen .status .message"),
            this.fadeOutTime = 500,
            this.iconList = {
                loading: '<i class="fas fa-circle-notch fa-spin"></i>',
                success: '<i class="fas fa-check"></i>',
                error: '<i class="fas fa-exclamation-circle"></i>'
            }
        }
        return _createClass(e, [{
            key: "finishUp",
            value() {
                const e = this;
                this.statusIcon = "success",
                this.statusMessage = "loading completed",
                setTimeout(()=>{
                    e.containerNode.fadeOut(e.fadeOutTime)
                }, 1e3)
            }
        }, {
            key: "statusMessage",
            set(e) {
                this.statusMessageNode.text(e)
            }
        }, {
            key: "statusIcon",
            set(e) {
                this.statusIconNode.html(this.iconList[e])
            }
        }]),
        e
    })()),
    t.statusMessage = "Please wait, loading...";
    const p = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.default = "EN",
                this.supported = ["EN"]
            }
        }, {
            key: "change",
            value() {
                for (let e = r("[Hstr]"), t = 0; t < e.length; t++)
                    this.update(r(e[t]))
            }
        }, {
            key: "update",
            value(e) {
                const t = e.attr("Hstr").split(".");
                let o = s["lang_" + this.selected] || s.lang_EN;
                const i = t[0]
                  , n = t[1]
                  , a = t[2];
                o[n] && o[n][a] || (o = s["lang_" + this.default]),
                "html" === i ? e.html(o[n][a]) : "placeholder" === i && e.attr(i, o[n][a])
            }
        }, {
            key: "selected",
            get: ()=>settings.language
        }, {
            key: "current",
            get() {
                return s["lang_" + this.selected]
            }
        }, {
            key: "browser",
            get() {
                const e = s.navigator.language.toUpperCase()
                  , t = e.indexOf("-") ? e.split("-")[0] : e;
                return this.supported.includes(t) ? t : this.default
            }
        }]),
        e
    })();
    window.p = p;
    window.s = s;
    s.lang_EN = {
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
            btn_create: "Create",
            btn_submit: "Submit",
            btn_get: "Get",
            btn_load: "Load",
            btn_reset: "Reset"
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
            title: "LEADERBOARD"
        },
        huds: {
            enterChatMsg: "Enter chat message...",
            teamlist_title: "Team Players",
            score: "Score",
            num1position: "#1 position",
            paused: "Paused",
            targeting_bigCellVp: "BIGGEST CELL VIEWPORT",
            targeting_followVp: "VIEWPORT FOLLOWING MOUSE",
            targeting_totalMass: "TOTAL MASS",
            targeting_players: "TARGETING PLAYERS"
        },
        settingMenu: {
            language: "Language",
            CellAnimation: "Animation delay",
			massUpdateInterval: "Mass Update Interval [ms]",
            zoomSpeed: "Zoom speed",
            cameraSpeed: "Camera speed [2 default]",
            eatAnimation: "Cell eat [sucking] animation",
            autoZoom: "Auto zoom",
            cellTextAnimation: "Cell text animation",
            autoHideText: "Auto hide text",
            hideOwnNick: "Hide own nick",
            hideOwnMass: "Hide own mass",
            hideOwnSkin: "Hide own skin",
            cellNick: "Cell nick",
            cellMass: "Cell mass",
            nickShadow: "Nick shadow",
            massShadow: "Mass shadow",
            virusMass: "Virus Mass",
            urlSkins: "URL skins",
            hsloSkins: "HSLO skins",
            food: "Food",
            foodGlow: "Food Glow [Mono colored]",
            vanillaGrid: "Vanilla grid",
            bgSectors: "Background sectors",
            cursorLine: "Cursor lines",
            opponentRings: "Opponent rings",
            splitRings: "Split rings",
            virusRange: "Viruses range",
            teamIndicator: "Teammate indicator",
            borderGlow: "Border Glow",
            virusGlow: "Virus Glow",
            commander: "Commander",
            chatType: "Chat type",
			multiboxMode: "Multibox Mode",
            targeting: "Cell Targeting [Spectate mode]",
            sounds: "Sounds",
            topZoom: "Show Top 1's Zoom",
            showBotNotifNCount: "Show Bot Notification and Count",
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
            opt_fantasy: "Fantasy",
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
            command11Key: "Command Up",
            command12Key: "Command Down",
            command13Key: "Command Left",
            command14Key: "Command Right",
            zoom1key: "Zoom level 1",
            zoom2key: "Zoom level 2",
            zoom3key: "Zoom level 3",
            zoom4key: "Zoom level 4",
            zoom5key: "Zoom level 5",
            splitBotsKey: "[Bot] Split",
            feedBotsKey: "[Bot] Feed",
            AIBotsKey: "[Bot] AI Mode",
            startBotsKey: "[Bot] Start",
            stopBotsKey: "[Bot] Stop",
            connectBotsKey: "[Bot] Connect"
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
            command9: "Fake tricksplit!",
            command11: "Up!",
            command12: "Bottom!",
            command13: "Left!",
            command14: "Right!"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "Cursor",
            lbSize: "Leaderboard size",
            chatFontSize: "Chat font size",
			chatroomSize: "Chatroom size",
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
            borderGlow: "Border Glow",
            borderGlowSize: "Border Glow Size",
            borderGlowStrength: "Border Glow Strength",
            virusGlow: "Virus Glow",
            virusGlowSize: "Virus Glow Size",
            virusGlowStrength: "Virus Glow Strength",
            nickColor: "Nick color",
            nickStrokeColor: "Nick stroke color",
            cellNickSize: "Nick size",
            nickFont: "Nick font",
            massColor: "Mass color",
            massStrokeColor: "Mass stroke color",
            cellMassSize: "Mass size",
            massFont: "Mass font",
            foodColor: "Food color",
            foodGlow: "Food Glow",
            foodSize: "Food size",
            foodGlowSize: "Food Glow Size",
            foodGlowStrength: "Food Glow Strength",
            virusColor: "Virus color",
            virusBorderColor: "Virus border color",
            virusBorderWidth: "virus border width",
            virusDecor: "Virus Decoration",
            backgroundColor: "Background color",
            commanderColor: "Commander color",
            indicatorSize: "Teammate indicator size",
            team1color: "Team 1 color [Double Tag Mode]",
            team2color: "Team 2 color [Double Tag Mode]",
			ghostColor: "Ghost cells color [minimap]",
			selfColor: "Self cell color [minimap]",
			selfViewportColor: "Self viewport color [minimap]",
			selfViewportAlpha: "Self viewport opacity [minimap]",
			topViewportColor: "Top viewport color [minimap]",
			topViewportAlpha: "Top viewport opacity [minimap]",
			teammateColor: "Teammate cells color [minimap]",
			teammateNameColor: "Teammate's name color [minimap]",
			customBGColor: "Custom Fantasy Color",
			customBGAlpha: "Custom Fantasy Transparency",
			customBG: "Custom Fantasy Background",
			customLB: "Custom Leaderboard Head",
			customMB: "Custom Music Box",
			customBotsName: "Custom Bot Name",
			botsAmount: "Custom Bot Amount",
			getSettings: "Get Settings",
			loadSettings: "Load Settings",
			resetSettings: "Reset Settings",
            on: "On",
            off: "Off"
        },
        updateHud: {
            title: "HSLO V5 Special Edition - 5.4.0 (9)",
            desc: "Read #ext in discord for more information.",
            versionChange: "Due to change in version " + `(${localStorage.getItem("version") || "5.3.2"} to 5.4.0 (9)),` + "<br>all settings will be reseted after you refresh the page.<br>You should save your settings and import them after refreshing.",
            updateContent: "Update:<br>1. Beta Optimized."
        }
    },
    s.lang_JA = {
        mainMenu: {
            btn_settings: "\u8a2d\u5b9a",
            btn_play: "\u30d7\u30ec\u30fc",
            btn_spectate: "\u89b3\u6226",
            btn_inputs: "\u30a4\u30f3\u30d7\u30c3\u30c8",
            btn_theme: "\u30c6\u30fc\u30de",
            input_tag1: "\u30bf\u30b0",
            input_tag2: "\u30bf\u30b02",
            input_nick: "\u540d\u524d",
            input_skinUrl: "\u30b9\u30ad\u30f3URL (imgur)",
            select_ffa: "FFA",
            select_party: "\u30d1\u30fc\u30c6\u30a3\u30fc",
            select_teams: "\u30c1\u30fc\u30e0",
            select_experimental: "\u30a8\u30af\u30b9\u30da\u30ea\u30e1\u30f3\u30bf\u30eb",
            input_token: "\u30c8\u30fc\u30af\u30f3",
            btn_join: "\u53c2\u52a0",
            btn_create: "\u4f5c\u6210",
			btn_submit: "Submit",
            btn_get: "Get",
            btn_load: "Load",
            btn_reset: "Reset"
        },
        notif: {
            cantPlay2Tag: "\u30c0\u30d6\u30eb\u30bf\u30b0\u30e2\u30fc\u30c9\u3067\u306f\u30d7\u30ec\u30fc\u3059\u308b\u3053\u3068\u304c\u3067\u304d\u307e\u305b\u3093\u3002",
            hsloNetConn: "HSLO\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u306b\u63a5\u7d9a\u3057\u307e\u3057\u305f\u3002",
            hsloNetDisconn: "HSLO\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u304b\u3089\u5207\u65ad\u3057\u307e\u3057\u305f\u3002",
            invalidSkinUrl: "\u7121\u52b9\u306aURL\u3067\u3059\u3002",
            login_lastSession: "\u6700\u5f8c\u306e\u30bb\u30c3\u30b7\u30e7\u30f3\u304b\u3089\u30ed\u30b0\u30a4\u30f3\u3057\u307e\u3057\u305f\u3002",
            sdk_error: "SDK\u304c\u8aad\u307f\u8fbc\u307e\u308c\u307e\u305b\u3093\u3067\u3057\u305f\u3002",
            alreadyLoggedIn: "\u65e2\u306b\u30ed\u30b0\u30a4\u30f3\u3055\u308c\u3066\u3044\u307e\u3059\u3002",
            login_success: "\u30ed\u30b0\u30a4\u30f3\u3057\u307e\u3057\u305f\u3002",
            login_error: "\u30ed\u30b0\u30a4\u30f3\u30a8\u30e9\u30fc\uff01",
            logout: "\u30ed\u30b0\u30a2\u30a6\u30c8\u3057\u307e\u3057\u305f\u3002",
            nickChangeInGame: "\u30d7\u30ec\u30fc\u4e2d\u306b\u540d\u524d\u3092\u5909\u66f4\u3059\u308b\u3053\u3068\u306f\u3067\u304d\u307e\u305b\u3093\u3002",
            targeting_on: "\u30de\u30a6\u30b9\u3092\u30af\u30ea\u30c3\u30af\u3057\u3066\u30bf\u30fc\u30b2\u30c3\u30c8\u3092\u59cb\u3081\u307e\u3059\u3002\u30de\u30a6\u30b9\u8a2d\u5b9a\u30e1\u30cb\u30e5\u30fc\u306e\u89e3\u8aac\u3092\u53c2\u7167\u3002",
            targeting_off: "\u30bf\u30fc\u30b2\u30c3\u30c8\u304c\u30aa\u30d5\u306b\u306a\u308a\u307e\u3057\u305f\u3002\u4f7f\u7528\u3059\u308b\u306b\u306f\u8a2d\u5b9a\u30e1\u30cb\u30e5\u30fc\u304b\u3089\u30aa\u30f3\u306b\u3057\u3066\u304f\u3060\u3055\u3044\u3002",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "HSLO V5"
        },
        huds: {
            enterChatMsg: "\u30e1\u30c3\u30bb\u30fc\u30b8\u3092\u9001\u4fe1...",
            teamlist_title: "\u30c1\u30fc\u30e0\u30d7\u30ec\u30fc\u30e4\u30fc",
            score: "\u30b9\u30b3\u30a2",
            num1position: "1\u4f4d\u306e\u4f4d\u7f6e",
            pause: "\u9759\u6b62",
            targeting_bigCellVp: "1\u4f4d\u8996\u70b9",
            targeting_followVp: "\u30de\u30a6\u30b9\u8996\u70b9",
            targeting_totalMass: "\u5408\u8a08\u30de\u30b9",
            targeting_players: "\u30bf\u30fc\u30b2\u30c3\u30c8\u30d7\u30ec\u30fc\u30e4\u30fc"
        },
        settingMenu: {
            language: "\u8a00\u8a9e",
            CellAnimation: "\u30a2\u30cb\u30e1\u30fc\u30b7\u30e7\u30f3\u30c7\u30a3\u30ec\u30a4",
            zoomSpeed: "\u30ba\u30fc\u30e0\u901f\u5ea6",
            cameraSpeed: "\u30ab\u30e1\u30e9\u901f\u5ea6 [2 \u30c7\u30d5\u30a9\u30eb\u30c8]",
            eatAnimation: "\u7d30\u80de\u6355\u98df [\u98f2\u307f\u8fbc\u3080] \u30a2\u30cb\u30e1\u30fc\u30b7\u30e7\u30f3",
            autoZoom: "\u30aa\u30fc\u30c8\u30ba\u30fc\u30e0",
            cellTextAnimation: "\u7d30\u80de\u306e\u30c6\u30ad\u30b9\u30c8\u30a2\u30cb\u30e1\u30fc\u30b7\u30e7\u30f3",
            autoHideText: "\u81ea\u52d5\u3067\u30c6\u30ad\u30b9\u30c8\u3092\u96a0\u3059",
            hideOwnNick: "Hide own nick",
            hideOwnMass: "Hide own mass",
            cellNick: "\u7d30\u80de\u306e\u540d\u524d",
            cellMass: "\u7d30\u80de\u306e\u30de\u30b9",
            nickShadow: "\u5f71 [\u7d30\u80de\u306e\u540d\u524d]",
            massShadow: "\u5f71 [\u7d30\u80de\u306e\u30de\u30b9]",
            urlSkins: "URL\u30b9\u30ad\u30f3",
            hsloSkins: "HSLO\u30b9\u30ad\u30f3",
            food: "\u7c92",
            vanillaGrid: "\u30d0\u30cb\u30e9\u30b0\u30ea\u30c3\u30c9",
            bgSectors: "\u5ea7\u6a19",
            cursorLine: "\u30ab\u30fc\u30bd\u30eb\u30e9\u30a4\u30f3",
            opponentRings: "\u6355\u98df\u5224\u5b9a\u30ea\u30f3\u30b0",
            splitRings: "Split rings",
            virusRange: "\u68d8\u7bc4\u56f2",
            teamIndicator: "\u30c1\u30fc\u30e0\u30e1\u30a4\u30c8\u30a4\u30f3\u30b8\u30b1\u30fc\u30bf\u30fc",
            commander: "\u30b3\u30de\u30f3\u30c0\u30fc",
            chatType: "\u30c1\u30e3\u30c3\u30c8\u30bf\u30a4\u30d7",
            targeting: "\u30bf\u30fc\u30b2\u30c3\u30c8 [\u89b3\u6226\u30e2\u30fc\u30c9]",
            sounds: "\u30b5\u30a6\u30f3\u30c9",
            opt_on: "\u30aa\u30f3",
            opt_off: "\u30aa\u30d5",
            opt_stepped: "\u30b9\u30c6\u30c3\u30d7",
            opt_shortened: "\u77ed\u7e2e",
            opt_linear: "\u30ea\u30cb\u30a2",
            opt_full: "\u30d5\u30eb",
            opt_nick: "\u540d\u524d",
            opt_mass: "\u30de\u30b9",
            opt_both: "\u540d\u524d + \u30de\u30b9",
            opt_perf: "\u30d1\u30d5\u30a9\u30fc\u30de\u30f3\u30b9",
            opt_normal: "\u30ce\u30fc\u30de\u30eb",
            opt_urlSkin: "URL\u30b9\u30ad\u30f3",
            opt_hsloSkin: "Hslo\u30b9\u30ad\u30f3",
            opt_allSkin: "\u5168\u30b9\u30ad\u30f3",
            opt_singleClr: "\u5358\u8272",
            opt_rainbow: "\u30ec\u30a4\u30f3\u30dc\u30fc",
            opt_onlyLines: "\u7dda\u306e\u307f",
            opt_snowflakes: "\u30b9\u30ce\u30fc\u30d5\u30ec\u30fc\u30af",
            opt_chatroom: "\u30c1\u30e3\u30c3\u30c8\u30eb\u30fc\u30e0",
            opt_popup: "\u30dd\u30c3\u30d7\u30a2\u30c3\u30d7\u30c1\u30e3\u30c3\u30c8"
        },
        hkMenu: {
            title: "\u30db\u30c3\u30c8\u30ad\u30fc",
            toggleMenuKey: "\u30e1\u30a4\u30f3\u30e1\u30cb\u30e5\u30fc\u5207\u308a\u66ff\u3048",
            feedKey: "\u990c",
            macroFeedKey: "\u990c\u30de\u30af\u30ed",
            splitKey: "\u5206\u88c2",
            doubleSplitKey: "\u30c0\u30d6\u30eb\u5206\u88c2",
            split16Key: "16\u5206\u88c2",
            stopKey: "\u9759\u6b62",
            chatKey: "\u30c1\u30e3\u30c3\u30c8\u5207\u308a\u66ff\u3048",
            freeSpectateKey: "\u89b3\u6226\u30e2\u30fc\u30c9\u5207\u308a\u66ff\u3048",
            toggleSplitRings: "Toggle split rings",
            toggleOpponentRings: "Toggle opponent rings",
            toggleNick: "\u540d\u524d\u8868\u793a\u5207\u308a\u66ff\u3048",
            toggleMass: "\u30de\u30b9\u8868\u793a\u5207\u308a\u66ff\u3048",
            toggleSkin: "\u30b9\u30ad\u30f3\u8868\u793a\u5207\u308a\u66ff\u3048",
            toggleFood: "\u990c\u8868\u793a\u5207\u308a\u66ff\u3048",
            respawnKey: "\u30af\u30a4\u30c3\u30af\u30ea\u30b9\u30dd\u30fc\u30f3",
            command0Key: "\u30b3\u30de\u30f3\u30c90",
            command1Key: "\u30b3\u30de\u30f3\u30c91",
            command2Key: "\u30b3\u30de\u30f3\u30c92",
            command3Key: "\u30b3\u30de\u30f3\u30c93",
            command4Key: "\u30b3\u30de\u30f3\u30c94",
            command5Key: "\u30b3\u30de\u30f3\u30c95",
            command6Key: "\u30b3\u30de\u30f3\u30c96",
            command7Key: "\u30b3\u30de\u30f3\u30c97",
            command8Key: "\u30b3\u30de\u30f3\u30c98",
            command9Key: "\u30b3\u30de\u30f3\u30c99",
            zoom1key: "\u30ba\u30fc\u30e0\u30ec\u30d9\u30eb1",
            zoom2key: "\u30ba\u30fc\u30e0\u30ec\u30d9\u30eb2",
            zoom3key: "\u30ba\u30fc\u30e0\u30ec\u30d9\u30eb3",
            zoom4key: "\u30ba\u30fc\u30e0\u30ec\u30d9\u30eb4",
            zoom5key: "\u30ba\u30fc\u30e0\u30ec\u30d9\u30eb5"
        },
        mouseMenu: {
            title: "\u30de\u30a6\u30b9",
            feed: "\u990c",
            macroFeed: "\u990c\u30de\u30af\u30ed",
            split: "\u5206\u88c2",
            doubleSplit: "\u30c0\u30d6\u30eb\u5206\u88c2",
            split16: "16\u5206\u88c2",
            commander: "\u30b3\u30de\u30f3\u30c0\u30fc",
            off: "\u30aa\u30d5",
            lmb: "\u5de6\u30af\u30ea\u30c3\u30af",
            rmb: "\u53f3\u30af\u30ea\u30c3\u30af",
            scroll: "\u30b9\u30af\u30ed\u30fc\u30eb\u30af\u30ea\u30c3\u30af",
            targeting_h1: "\u30bf\u30fc\u30b2\u30c3\u30c8",
            targeting_txt1: "\u30bf\u30fc\u30b2\u30c3\u30c8\u30ed\u30c3\u30af1",
            targeting_txt2: "\u30bf\u30fc\u30b2\u30c3\u30c8\u30ed\u30c3\u30af2",
            targeting_txt3: "\u30b9\u30af\u30ed\u30fc\u30eb\u30af\u30ea\u30c3\u30af or \u89b3\u6226\u30ad\u30fc\u5207\u308a\u66ff\u3048",
            targeting_txt4: "\u30c8\u30c3\u30d7\u30bb\u30eb\u30e2\u30fc\u30c9\u304b\u3089\u30de\u30a6\u30b9\u8ffd\u8de1\u306b\u5207\u308a\u66ff\u3048",
            targeting_txt5: "\u30bf\u30fc\u30b2\u30c3\u30c8\u30e2\u30fc\u30c9\u304b\u3089\u30de\u30a6\u30b9\u8ffd\u8de1\u306b\u5207\u308a\u66ff\u3048",
            targeting_txt6: "\u30de\u30a6\u30b9\u8ffd\u8de1\u304b\u3089\u30c8\u30c3\u30d7\u30bb\u30eb\u30e2\u30fc\u30c9\u306b\u5207\u308a\u66ff\u3048"
        },
        commandsMenu: {
            title: "\u30b3\u30de\u30f3\u30c9",
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
            cursor: "\u30ab\u30fc\u30bd\u30eb",
            lbSize: "\u30ea\u30fc\u30c0\u30fc\u30dc\u30fc\u30c9\u306e\u5927\u304d\u3055",
            chatFontSize: "Chat font size",
			chatroomSize: "Chatroom size",
            minimapSize: "\u30df\u30cb\u30de\u30c3\u30d7\u306e\u5927\u304d\u3055",
            skinBorder: "\u30b9\u30ad\u30f3\u306e\u5883\u754c\u7dda",
            cellTransparency: "\u7d30\u80de\u306e\u900f\u904e",
            lightenCellColor: "\u7d30\u80de\u8272\u306e\u8efd\u6e1b",
            borderColor: "\u5883\u754c\u7dda\u306e\u8272",
            borderWidth: "\u5883\u754c\u7dda\u306e\u6a2a\u5e45",
            gridColor: "\u30b0\u30ea\u30c3\u30c9\u30ab\u30e9\u30fc",
            gridTextColor: "\u30b0\u30ea\u30c3\u30c9\u30c6\u30ad\u30b9\u30c8\u30ab\u30e9\u30fc",
            gridTextSize: "\u30b0\u30ea\u30c3\u30c9\u30c6\u30ad\u30b9\u30c8\u30b5\u30a4\u30ba",
            gridTextFont: "\u30b0\u30ea\u30c3\u30c9\u30c6\u30ad\u30b9\u30c8\u30d5\u30a9\u30f3\u30c8",
            gridWidth: "\u30b0\u30ea\u30c3\u30c9\u306e\u6a2a\u5e45",
            nickColor: "\u540d\u524d\u306e\u8272",
            nickStrokeColor: "\u540d\u524d\u306e\u5f71\u306e\u8272",
            cellNickSize: "\u540d\u524d\u306e\u5927\u304d\u3055",
            nickFont: "\u540d\u524d\u306e\u30d5\u30a9\u30f3\u30c8",
            massColor: "\u30de\u30b9\u306e\u8272",
            massStrokeColor: "\u30de\u30b9\u306e\u5f71\u306e\u8272",
            cellMassSize: "\u30de\u30b9\u306e\u5927\u304d\u3055",
            massFont: "\u30de\u30b9\u306e\u30d5\u30a9\u30f3\u30c8",
            foodColor: "\u30d5\u30a9\u30f3\u30c8\u306e\u8272",
            foodSize: "\u7c92\u306e\u5927\u304d\u3055",
            virusColor: "\u68d8\u306e\u8272",
            virusBorderColor: "\u68d8\u306e\u67a0\u8272",
            virusBorderWidth: "\u68d8\u306e\u5883\u754c\u7dda\u306e\u6a2a\u5e45",
            virusDecor: "\u68d8\u306e\u88c5\u98fe",
            backgroundColor: "\u80cc\u666f\u8272",
            commanderColor: "\u30b3\u30de\u30f3\u30c0\u30fc\u306e\u8272",
            indicatorSize: "\uff81\uff70\uff91\uff92\uff72\uff84\uff72\uff9d\uff7c\uff9e\uff79\uff70\uff80\uff70\u306e\u5927\u304d\u3055",
            team1color: "\u30c1\u30fc\u30e01\u306e\u8272 [\u30c0\u30d6\u30eb\u30bf\u30b0\u30e2\u30fc\u30c9]",
            team2color: "\u30c1\u30fc\u30e02\u306e\u8272 [\u30c0\u30d6\u30eb\u30bf\u30b0\u30e2\u30fc\u30c9]",
			ghostColor: "Ghost cells color [minimap]",
			selfColor: "Self cell color [minimap]",
			selfViewportColor: "Self viewport color [minimap]",
			selfViewportAlpha: "Self viewport opacity [minimap]",
			topViewportColor: "Top viewport color [minimap]",
			topViewportAlpha: "Top viewport opacity [minimap]",
			teammateColor: "Teammate cells color [minimap]",
			teammateNameColor: "Teammate's name color [minimap]",
			customBGColor: "Custom Fantasy Color",
			customBGAlpha: "Custom Fantasy Transparency",
			customBG: "Custom Fantasy Background",
			customLB: "Custom Leaderboard Head",
			customMB: "Custom Music Box",
			customBotsName: "Custom Bot Name",
			botsAmount: "Custom Bot Amount",
			getSettings: "Get Settings",
			loadSettings: "Load Settings",
			resetSettings: "Reset Settings",
            on: "\u30aa\u30f3",
            off: "\u30aa\u30d5"
        },
        updateHud: {
            title: "HSLO V5 Special Edition - 5.4.0 (9)",
            desc: "Read #ext in discord for more information.",
            versionChange: "Due to change in version " + `(${localStorage.getItem("version") || "5.3.2"} to 5.4.0 (9)),` + "<br>all settings will be reseted after you refresh the page.<br>You should save your settings and import them after refreshing.",
            updateContent: "Update:<br>1. Beta Optimized."
        }
    },
    s.lang_ZH = {
        mainMenu: {
            btn_settings: "\u8a2d\u5b9a",
            btn_play: "\u904a\u73a9",
            btn_spectate: "\u89c0\u6230",
            btn_inputs: "\u8f38\u5165",
            btn_theme: "\u4e3b\u984c",
            input_tag1: "\u968a\u4f0d\u4e00",
            input_tag2: "\u968a\u4f0d\u4e8c",
            input_nick: "\u66b1\u7a31",
            input_skinUrl: "\u76ae\u819a\u7db2\u5740 (imgur)",
            select_ffa: "FFA",
            select_party: "Party",
            select_teams: "Teams",
            select_experimental: "Experimental",
            input_token: "Party\u4ee3\u78bc",
            btn_join: "\u52a0\u5165",
            btn_create: "\u5275\u5efa",
            btn_submit: "\u63d0\u4ea4",
            btn_get: "\u8f38\u51fa",
            btn_load: "\u8f09\u5165",
            btn_reset: "\u91cd\u8a2d"
        },
        notif: {
            cantPlay2Tag: "\u4e0d\u80fd\u7528\u96d9\u91cd\u968a\u4f0d",
            hsloNetConn: "\u9023\u63a5HSLO\u7db2\u7d61",
            hsloNetDisconn: "\u65b7\u958bHSLO\u7db2\u7d61",
            invalidSkinUrl: "\u4e0d\u7576\u76ae\u819a\u7db2\u5740",
            login_lastSession: "\u4ee5\u4e0a\u6b21\u8cc7\u8a0a\u767b\u5165",
            sdk_error: "SDK\u672a\u8f09\u5165",
            alreadyLoggedIn: "\u5df2\u7d93\u767b\u5165",
            login_success: "\u767b\u5165\u6210\u529f",
            login_error: "\u767b\u5165\u932f\u8aa4",
            logout: "\u767b\u51fa",
            nickChangeInGame: "\u4e0d\u80fd\u5728\u904a\u6232\u4e2d\u66f4\u6539\u66b1\u7a31.",
            targeting_on: "\u9078\u53d6\u4e00\u7d30\u80de\u8ffd\u8e64\u3002\u8a73\u770b\u6ed1\u9f20\u8a2d\u5b9a\u4ecb\u9762\u7684\u6307\u5f15",
            targeting_off: "\u81ea\u52d5\u8ffd\u8e64\u6a21\u5f0f\u5df2\u95dc\u9589\uff0c\u5982\u8981\u4f7f\u7528\u8acb\u5728\u8a2d\u5b9a\u4ecb\u9762\u958b\u555f",
            target_unnamed: "\u7121\u6cd5\u9396\u5b9a\u7121\u540d\u73a9\u5bb6.",
            hsloSkin_noAcc: "\u5e33\u865f\u4e0d\u5b58\u5728."
        },
        leaderboard: {
            title: "HSLO V5"
        },
        huds: {
            enterChatMsg: "\u804a\u5929\u8f38\u5165\u4e2d\u2026\u2026",
            teamlist_title: "\u968a\u4f0d\u73a9\u5bb6",
            score: "\u5206\u6578",
            num1position: "\u7b2c\u4e00\u4f4d\u7f6e",
            pause: "\u66ab\u505c",
            targeting_bigCellVp: "\u6700\u5927\u73a9\u5bb6\u8996\u91ce",
            targeting_followVp: "\u6ed1\u9f20\u8ddf\u96a8\u8996\u91ce",
            targeting_totalMass: "\u7e3d\u8cea\u91cf",
            targeting_players: "\u8ffd\u8e64\u73a9\u5bb6\u4e2d"
        },
        settingMenu: {
            language: "\u8a9e\u8a00",
            CellAnimation: "\u52d5\u756b\u5ef6\u9072",
			massUpdateInterval: "\u8cea\u91cf\u66f4\u65b0\u9593\u9694 [\u6beb\u79d2]",
            zoomSpeed: "\u8b8a\u7126\u901f\u5ea6",
            cameraSpeed: "\u93e1\u982d\u901f\u5ea6\uff3b\u9810\u8a2d\u4e8c\uff3d",
            eatAnimation: "\u9032\u98df\u52d5\u756b\uff3b\u5438\u5165\uff3d",
            autoZoom: "\u81ea\u52d5\u8b8a\u7126",
            cellTextAnimation: "\u7d30\u80de\u6587\u5b57\u52d5\u756b",
            autoHideText: "\u81ea\u52d5\u96b1\u85cf\u6587\u5b57",
            hideOwnNick: "\u4e0d\u986f\u793a\u81ea\u5df1\u540d\u5b57",
            hideOwnMass: "\u4e0d\u986f\u793a\u81ea\u5df1\u8cea\u91cf",
            hideOwnSkin: "\u4e0d\u986f\u793a\u81ea\u5df1\u76ae\u819a",
            cellNick: "\u7d30\u80de\u66b1\u7a31",
            cellMass: "\u7d30\u80de\u8cea\u91cf",
            nickShadow: "\u9670\u5f71 [\u7d30\u80de\u66b1\u7a31]",
            massShadow: "\u9670\u5f71 [\u7d30\u80de\u8cea\u91cf]",
            urlSkins: "\u76ae\u819a\u7db2\u5740",
            hsloSkins: "HSLO\u76ae\u819a",
            food: "\u98df\u7269",
            vanillaGrid: "\u539f\u751f\u683c\u7db2",
            bgSectors: "\u80cc\u666f\u5340\u9593",
            cursorLine: "\u5c0e\u5f15\u7dda",
            opponentRings: "\u8b8a\u8272\u74b0",
            splitRings: "\u5206\u88c2\u8ddd\u96e2\u5708",
            virusRange: "\u523a\u7403\u8ddd\u96e2",
            teamIndicator: "\u968a\u4f0d\u6a19\u793a",
            commander: "\u6307\u63ee",
            chatType: "\u804a\u5929\u6a23\u5f0f",
			multiboxMode: "\u96d9\u63a7\u6a21\u5f0f",
            targeting: "\u73a9\u5bb6\u8ffd\u8e64\u4e2d [\u89c0\u6230\u6a21\u5f0f]",
            sounds: "\u8072\u97f3",
            topZoom: "\u986f\u793a\u7b2c\u4e00\u8996\u91ce",
            showBotNotifNCount: "\u986f\u793aBot\u901a\u77e5\u548c\u6578\u91cf",
            opt_on: "\u958b",
            opt_off: "\u95dc",
            opt_stepped: "\u968e\u8e8d\u5f0f",
            opt_linear: "\u7dda\u6027",
            opt_shortened: "\u7c21\u77ed\u5316",
            opt_full: "\u5168\u90e8",
            opt_nick: "\u66b1\u7a31",
            opt_mass: "\u8cea\u91cf",
            opt_both: "\u66b1\u7a31\u53ca\u8cea\u91cf",
            opt_perf: "\u6548\u80fd",
            opt_normal: "\u4e00\u822c",
            opt_urlSkin: "\u76ae\u819a\u7db2\u5740",
            opt_hsloSkin: "HSLO\u76ae\u819a",
            opt_allSkin: "\u5168\u90e8\u76ae\u819a",
            opt_singleClr: "\u55ae\u8272",
            opt_rainbow: "\u5f69\u8272",
            opt_onlyLines: "\u53ea\u6709\u7dda\u689d",
            opt_snowflakes: "\u96ea\u82b1",
            opt_chatroom: "\u804a\u5929\u6b04",
            opt_popup: "\u5f48\u51fa\u901a\u77e5"
        },
        hkMenu: {
            title: "\u71b1\u9375",
            toggleMenuKey: "\u5207\u63db\u4e3b\u9078\u55ae",
            feedKey: "\u55ae\u6b21\u9935\u990a",
            macroFeedKey: "\u6301\u7e8c\u9935\u990a",
            splitKey: "\u5206\u88c2",
            doubleSplitKey: "\u96d9\u91cd\u5206\u88c2",
            split16Key: "\u56db\u91cd\u5206\u88c2",
            stopKey: "\u505c\u6b62\u79fb\u52d5",
            chatKey: "\u5207\u63db\u804a\u5929",
            freeSpectateKey: "\u5207\u63db\u89c0\u6230\u6a21\u5f0f",
            toggleSplitRings: "\u5207\u63db\u5206\u88c2\u8ddd\u96e2\u5708",
            toggleOpponentRings: "\u5207\u63db\u8b8a\u8272\u74b0",
            toggleNick: "\u5207\u63db\u66b1\u7a31\u986f\u793a",
            toggleMass: "\u5207\u63db\u8cea\u91cf\u986f\u793a",
            toggleSkin: "\u5207\u63db\u76ae\u819a\u986f\u793a",
            toggleFood: "\u5207\u63db\u98df\u7269\u986f\u793a",
            respawnKey: "\u5feb\u901f\u91cd\u751f",
            command0Key: "\u6307\u4ee4\uff10",
            command1Key: "\u6307\u4ee4\uff11",
            command2Key: "\u6307\u4ee4\uff12",
            command3Key: "\u6307\u4ee4\uff13",
            command4Key: "\u6307\u4ee4\uff14",
            command5Key: "\u6307\u4ee4\uff15",
            command6Key: "\u6307\u4ee4\uff16",
            command7Key: "\u6307\u4ee4\uff17",
            command8Key: "\u6307\u4ee4\uff18",
            command9Key: "\u6307\u4ee4\uff19",
            command11Key: "\u6307\u4ee4\u4e0a",
            command12Key: "\u6307\u4ee4\u4e0b",
            command13Key: "\u6307\u4ee4\u5de6",
            command14Key: "\u6307\u4ee4\u53f3",
            zoom1key: "\u8b8a\u7126\u7b49\u7d1a\u4e00",
            zoom2key: "\u8b8a\u7126\u7b49\u7d1a\u4e8c",
            zoom3key: "\u8b8a\u7126\u7b49\u7d1a\u4e09",
            zoom4key: "\u8b8a\u7126\u7b49\u7d1a\u56db",
            zoom5key: "\u8b8a\u7126\u7b49\u7d1a\u4e94",
            splitBotsKey: "[Bot] \u5206\u88c2",
            feedBotsKey: "[Bot] \u55ae\u6b21\u9935\u990a",
            AIBotsKey: "[Bot] AI\u6a21\u5f0f",
            startBotsKey: "[Bot] \u958b\u555f",
            stopBotsKey: "[Bot] \u95dc\u9589",
            connectBotsKey: "[Bot] \u9023\u7dda"
        },
        mouseMenu: {
            title: "\u6ed1\u9f20",
            feed: "\u55ae\u6b21\u9935\u990a",
            macroFeed: "\u6301\u7e8c\u9935\u990a",
            split: "\u55ae\u6b21\u5206\u88c2",
            doubleSplit: "\u96d9\u91cd\u5206\u88c2",
            split16: "\u56db\u91cd\u5206\u88c2",
            commander: "\u6307\u63ee",
            off: "\u95dc",
            lmb: "\u5de6\u9375",
            rmb: "\u53f3\u9375",
            scroll: "\u6efe\u8f2a\u9375",
            targeting_h1: "\u8ffd\u8e64\u4e2d",
            targeting_txt1: "\u9396\u5b9a\u76ee\u6a19\u4e00",
            targeting_txt2: "\u9396\u5b9a\u76ee\u6a19\u4e8c",
            targeting_txt3: "\u6efe\u8f2a\u9375\u6216\u5207\u63db\u89c0\u6230\u9375",
            targeting_txt4: "\u5207\u63db\u6700\u5927\u73a9\u5bb6\u6a21\u5f0f\u8207\u6ed1\u9f20\u8ddf\u96a8\u6a21\u5f0f",
            targeting_txt5: "\u5207\u63db\u81ea\u52d5\u8ffd\u8e64\u6a21\u5f0f\u8207\u6ed1\u9f20\u8ddf\u96a8\u6a21\u5f0f",
            targeting_txt6: "\u5207\u63db\u6ed1\u9f20\u8ddf\u96a8\u6a21\u5f0f\u8207\u6700\u5927\u73a9\u5bb6\u6a21\u5f0f"
        },
        commandsMenu: {
            title: "\u6307\u4ee4",
            command0: "\u64cd\u4f60\u5abd\uff01",
            command1: "\u9935\u6211\uff01",
            command2: "\u79d2\u7a7a\u7d66\u6211\uff01",
            command3: "%sector%\u9700\u8981\u652f\u63f4\uff01",
            command4: "%sector%\u767c\u73fe\u6575\u4eba\uff01",
            command5: "\u4f86\u500b\u968a\u53cb\uff01",
            command6: "\u64cb\u523a\uff01",
            command7: "\u5403\u6389\u523a\uff01",
            command8: "\u4f86\u9a19\u4ed6\uff01",
            command9: "\u5047\u7279\u7a7a\u9a19\u4ed6\uff01",
            command11: "\u53bb\u4e0a\u9762\uff01",
            command12: "\u53bb\u4e0b\u9762\uff01",
            command13: "\u53bb\u5de6\u908a\uff01",
            command14: "\u53bb\u53f3\u908a\uff01"
        },
        themeMenu: {
            selectedPreset: "\u9810\u8a2d\u4e3b\u984c",
            cursor: "\u9f20\u6a19",
            lbSize: "\u6392\u884c\u699c\u5927\u5c0f",
            chatFontSize: "\u804a\u5929\u5ba4\u5b57\u9ad4\u5927\u5c0f",
			chatroomSize: "\u804a\u5929\u5ba4\u5927\u5c0f",
            minimapSize: "\u5c0f\u5730\u5716\u5927\u5c0f",
            skinBorder: "\u76ae\u819a\u8f2a\u5ed3",
            cellTransparency: "\u7d30\u80de\u900f\u660e\u5ea6",
            lightenCellColor: "\u5149\u4eae\u7d30\u80de\u984f\u8272",
            borderColor: "\u5916\u570d\u984f\u8272",
            borderWidth: "\u5916\u570d\u95ca\u5ea6",
            gridColor: "\u5340\u9593\u984f\u8272",
            gridTextColor: "\u5340\u9593\u6587\u5b57\u984f\u8272",
            gridTextSize: "\u5340\u9593\u6587\u5b57\u5927\u5c0f",
            gridTextFont: "\u5340\u9593\u6587\u5b57\u5b57\u578b",
            gridWidth: "\u5340\u9593\u95ca\u5ea6",
            nickColor: "\u66b1\u7a31\u984f\u8272",
            nickStrokeColor: "\u66b1\u7a31\u8f2a\u5ed3\u984f\u8272",
            cellNickSize: "\u66b1\u7a31\u5927\u5c0f",
            nickFont: "\u66b1\u7a31\u5b57\u578b",
            massColor: "\u8cea\u91cf\u8a0a\u606f\u984f\u8272",
            massStrokeColor: "\u8cea\u91cf\u8a0a\u606f\u8f2a\u5ed3\u984f\u8272",
            cellMassSize: "\u8cea\u91cf\u8a0a\u606f\u5927\u5c0f",
            massFont: "\u8cea\u91cf\u8a0a\u606f\u5b57\u578b",
            foodColor: "\u98df\u7269\u984f\u8272",
            foodSize: "\u98df\u7269\u5927\u5c0f",
            virusColor: "\u523a\u7403\u984f\u8272",
            virusBorderColor: "\u523a\u7403\u5916\u6846\u984f\u8272",
            virusBorderWidth: "\u523a\u7403\u5916\u6846\u95ca\u5ea6",
            virusDecor: "\u523a\u7403\u88dd\u98fe",
            backgroundColor: "\u80cc\u666f\u984f\u8272",
            commanderColor: "\u6307\u4ee4\u984f\u8272",
            indicatorSize: "\u968a\u4f0d\u6a19\u793a\u5927\u5c0f",
            team1color: "\u968a\u4f0d\u4e00\u984f\u8272 [\u96d9\u968a\u4f0d\u6a21\u5f0f]",
            team2color: "\u968a\u4f0d\u4e8c\u984f\u8272 [\u96d9\u968a\u4f0d\u6a21\u5f0f]",
			ghostColor: "\u524d\u4e8c\u5341\u540d\u984f\u8272 [\u5c0f\u5730\u5716]",
			selfColor: "\u81ea\u5df1\u984f\u8272 [\u5c0f\u5730\u5716]",
			selfViewportColor: "\u81ea\u5df1\u8996\u91ce\u984f\u8272 [\u5c0f\u5730\u5716]",
			selfViewportAlpha: "\u81ea\u5df1\u8996\u91ce\u4e0d\u900f\u660e\u5ea6 [\u5c0f\u5730\u5716]",
			topViewportColor: "\u7b2c\u4e00\u540d\u8996\u91ce\u984f\u8272 [\u5c0f\u5730\u5716]",
			topViewportAlpha: "\u7b2c\u4e00\u540d\u8996\u91ce\u4e0d\u900f\u660e\u5ea6 [\u5c0f\u5730\u5716]",
			teammateColor: "\u968a\u53cb\u984f\u8272 [\u5c0f\u5730\u5716]",
			teammateNameColor: "\u968a\u53cb\u540d\u5b57\u984f\u8272 [\u5c0f\u5730\u5716]",
			customBGColor: "\u81ea\u5b9a\u7fa9\u80cc\u666f\u5716\u7247\u7684\u984f\u8272",
			customBGAlpha: "\u81ea\u5b9a\u7fa9\u80cc\u666f\u5716\u7247\u7684\u900f\u660e\u5ea6",
			customBG: "\u81ea\u5b9a\u7fa9\u80cc\u666f\u5716\u7247",
			customLB: "\u81ea\u5b9a\u7fa9\u6392\u884c\u699c\u6a19\u984c",
			customMB: "\u81ea\u5b9a\u7fa9\u97f3\u6a02\u76d2",
			customBotsName: "\u81ea\u5b9a\u7fa9Bot\u540d\u5b57",
			botsAmount: "\u81ea\u5b9a\u7fa9Bot\u6578\u91cf",
			getSettings: "\u8f38\u51fa\u8a2d\u5b9a",
			loadSettings: "\u52a0\u8f09\u8a2d\u5b9a",
			resetSettings: "\u91cd\u8a2d\u8a2d\u5b9a",
            on: "\u958b",
            off: "\u95dc"
        },
        updateHud: {
            title: "HSLO V5 \u7279\u5225\u7248 - 5.4.0 (9)",
            desc: "\u66f4\u65b0\u65e5\u8a8c\u8a73\u898b discord #ext",
            versionChange: "\u7531\u65bc\u7248\u672c\u66f4\u6539 " + `(${localStorage.getItem("version") || "5.3.2"} -> 5.4.0 (9))` + "<br>\u4e0b\u6b21\u5237\u65b0\u9801\u9762\u6642\u6240\u6709\u8a2d\u5b9a\u5c07\u6703\u91cd\u8a2d<br>\u8acb\u5118\u5feb\u5132\u5b58\u8a2d\u5b9a\u4ee5\u4fbf\u65bc\u4e4b\u5f8c\u52a0\u8f09",
            updateContent: "\u66f4\u65b0:<br>1. Beta\u512a\u5316"
        }
    },
    s.lang_KO = {
        mainMenu: {
            btn_settings: "\ud658\uacbd",
            btn_play: "\ud50c\ub808\uc774",
            btn_spectate: "\uad00\uc804",
            btn_inputs: "\ud0a4\ubcf4\ub4dc",
            btn_theme: "\ud14c\ub9c8",
            input_tag1: "\ud0dc\uadf8",
            input_tag2: "\ud0dc\uadf8 2",
            input_nick: "\ub2c9\ub124\uc784",
            input_skinUrl: "\uc774\ubbf8\uc9c0 URL (imgur)",
            select_ffa: "FFA",
            select_party: "\ud30c\ud2f0",
            select_teams: "\ud300",
            select_experimental: "\uc775\uc2a4\ud398\ub9ac\uba58\ud0c8",
            input_token: "\ud30c\ud2f0 \ucf54\ub4dc",
            btn_join: "\uc870\uc778",
            btn_create: "\uc0c8\ub85c\uace0\uce68",
            btn_submit: "Submit",
            btn_get: "Get",
            btn_load: "Load",
            btn_reset: "Reset"
        },
        notif: {
            cantPlay2Tag: "\ud0dc\uadf82 \ubaa8\ub4dc\uc5d0\uc11c\ub294 \uc2e4\ud589\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4..",
            hsloNetConn: "HSLO \ub124\ud2b8\uc6cc\ud06c\uc5d0 \uc5f0\uacb0\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
            hsloNetDisconn: "HSLO \ub124\ud2b8\uc6cc\ud06c\uc5d0\uc11c \uc5f0\uacb0\uc774 \ub04a\uc5b4\uc84c\uc2b5\ub2c8\ub2e4.",
            invalidSkinUrl: "\uc798\ubabb\ub41c \uc2a4\ud0a8 URL",
            login_lastSession: "\ub9c8\uc9c0\ub9c9 \uc138\uc158 \ub370\uc774\ud130\uc5d0\uc11c \ub85c\uadf8\uc778\ud588\uc2b5\ub2c8\ub2e4..",
            sdk_error: "SDK\uac00 \ub85c\ub4dc\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.",
            alreadyLoggedIn: "\uc774\ubbf8 \ub85c\uadf8\uc778 \ud588\uc2b5\ub2c8\ub2e4.",
            login_success: "\ub85c\uadf8\uc778",
            login_error: "\ub85c\uadf8\uc778 \uc624\ub958!",
            logout: "\ub85c\uadf8 \uc544\uc6c3 \ub428!",
            nickChangeInGame: "\uac8c\uc784 \uc911 \ub2c9\ub124\uc784\uc744 \ubcc0\uacbd\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4..",
            targeting_on: "\ud0c0\uac9f\ud305\uc744 \uc2dc\uc791\ud558\ub824\uba74 \uc138\ud3ec\ub97c \ud074\ub9ad\ud558\uc2ed\uc2dc\uc624. \ub9c8\uc6b0\uc2a4 \uc124\uc815\uc5d0\uc11c \uba54\ub274\uc758 \uc9c0\uce68\uc744 \ucc38\uc870\ud558\uc2ed\uc2dc\uc694..",
            targeting_off: "\ud0c0\uac9f\ud305\uc774 \uaebc\uc838 \uc788\uc2b5\ub2c8\ub2e4. \uc124\uc815 \uba54\ub274\uc5d0\uc11c \uc0ac\uc6a9\ud558\ub3c4\ub85d \uc124\uc815\ud558\uc2ed\uc2dc\uc694.",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "HSLO V5"
        },
        huds: {
            enterChatMsg: "\ucc44\ud305 \uba54\uc138\uc9c0 \uc785\ub825...",
            teamlist_title: "\ud300 \ud50c\ub808\uc774\uc5b4",
            score: "\uc810\uc218",
            num1position: "#1\ub4f1 \uc704\uce58",
            pause: "\uc77c\uc2dc \uc911\uc9c0",
            targeting_bigCellVp: "\uac00\uc7a5 \ud070 \uc138\ud3ec \ubaa9\ub85d",
            targeting_followVp: "\ub9c8\uc6b0\uc2a4 \ud0c0\uac9f\ud305 \uc124\uc815",
            targeting_totalMass: "\ucd1d \uc9c8\ub7c9",
            targeting_players: "\uc7a0\uc7ac\uc801 \ud0c0\uac9f\ud305"
        },
        settingMenu: {
            language: "\uc5b8\uc5b4",
            CellAnimation: "\uc560\ub2c8\uba54\uc774\uc158 \uc9c0\uc5f0",
            zoomSpeed: "\uc90c \uc18d\ub3c4",
            cameraSpeed: "\uce74\uba54\ub77c \uc18d\ub3c4 [2 \uae30\ubcf8\uac12]",
            eatAnimation: "\uc138\ud3ec \uba39\uae30[\ud761\uc218] \uc560\ub2c8\uba54\uc774\uc158",
            autoZoom: "\uc790\ub3d9 \ud655\ub300/\ucd95\uc18c",
            cellTextAnimation: "\uc138\ud3ec \ud14d\uc2a4\ud2b8 \uc560\ub2c8\uba54\uc774\uc158",
            autoHideText: "\ud14d\uc2a4\ud2b8 \uc790\ub3d9 \uc228\uae30\uae30",
            hideOwnNick: "Hide own nick",
            hideOwnMass: "Hide own mass",
            cellNick: "\uc138\ud3ec \ub2c9\ub124\uc784",
            cellMass: "\uc138\ud3ec \uc9c8\ub7c9",
            nickShadow: "\uadf8\ub9bc\uc790 [\uc138\ud3ec \ub2c9\ub124\uc784]",
            massShadow: "\uadf8\ub9bc\uc790 [\uc138\ud3ec \uc9c8\ub7c9]",
            urlSkins: "URL \uc2a4\ud0a8",
            hsloSkins: "HSLO \uc2a4\ud0a8",
            food: "\uba39\uc774",
            vanillaGrid: "\ubc14\ub2d0\ub77c \ubb34\ub2ac",
            bgSectors: "\ubc14\ud0d5\ud654\uba74",
            cursorLine: "\ucee4\uc11c \uc120",
            opponentRings: "\uc9c8\ub7c9 \uaca9\uc790\uc120",
            splitRings: "Split rings",
            virusRange: "\ubc14\uc774\ub7ec\uc2a4 \ubc94\uc704",
            teamIndicator: "\ud300 \ubaa9\ub85d",
            commander: "\uc704\uce58 \ud551",
            chatType: "\ucc44\ud305 \uc720\ud615",
            targeting: "\uc138\ud3ec \ud0c0\uac9f\ud305[\uad00\uc804 \ubaa8\ub4dc]",
            sounds: "\uc18c\ub9ac",
            opt_on: "\ucf1c\uc9d0",
            opt_off: "\uaebc\uc9d0",
            opt_stepped: "\ub2ff\uc740\uacf3",
            opt_linear: "\uc120\ud615",
            opt_shortened: "\uc9e7\uc740",
            opt_full: "\uc804\uccb4",
            opt_nick: "\ub2c9\ub124\uc784",
            opt_mass: "\uc9c8\ub7c9",
            opt_both: "\ub2c9\ub124\uc784+ \uc9c8\ub7c9",
            opt_perf: "\uc2e4\uc801",
            opt_normal: "\ubcf4\ud1b5",
            opt_urlSkin: "Url \uc2a4\ud0a8",
            opt_hsloSkin: "Hslo \uc2a4\ud0a8",
            opt_allSkin: "\ubaa8\ub4e0 \uc2a4\ud0a8",
            opt_singleClr: "Mono colored",
            opt_rainbow: "\ubb34\uc9c0\uac1c",
            opt_onlyLines: "\ud14c\ub450\ub9ac\ub9cc",
            opt_snowflakes: "\ub208\uc1a1\uc774",
            opt_chatroom: "\ucc44\ud305\ubc29",
            opt_popup: "\ucc44\ud305 \uc54c\ub9bc"
        },
        hkMenu: {
            title: "\ub2e8\ucd95\ud0a4",
            toggleMenuKey: "\uba54\uc778\uba54\ub274 \ub044\uae30 ",
            feedKey: "feed \uba39\uc774",
            macroFeedKey: "\ub9e4\ud06c\ub85c feed\uba39\uc774",
            splitKey: "\ubd84\uc5f4",
            doubleSplitKey: "\uc774\uc911 \ubd84\uc5f4",
            split16Key: "16\ubd84\uc5f4",
            stopKey: "\uc138\ud3ec \uc774\ub3d9\uc911\uc9c0",
            chatKey: "\ucc44\ud305 \ucf1c\uae30",
            freeSpectateKey: "\ud22c\uc0ac \ubaa8\ub4dc \uc804\ud658",
            toggleSplitRings: "Toggle split rings",
            toggleOpponentRings: "Toggle opponent rings",
            toggleNick: "\uc138\ud3ec \ub2c9\uc744 \uc124\uc815\ud569\ub2c8\ub2e4",
            toggleMass: "\uc138\ud3ec \uc9c8\ub7c9\uc744 \uc124\uc815\ud569\ub2c8\ub2e4",
            toggleSkin: "\uc2a4\ud0a8 \uc124\uc815",
            toggleFood: "\uba39\uc774 \uc124\uc815",
            respawnKey: "\ube60\ub978 \ubd80\ud65c",
            command0Key: "\uba85\ub839 0",
            command1Key: "\uba85\ub839 1",
            command2Key: "\uba85\ub839 2",
            command3Key: "\uba85\ub839 3",
            command4Key: "\uba85\ub839 4",
            command5Key: "\uba85\ub839 5",
            command6Key: "\uba85\ub839 6",
            command7Key: "\uba85\ub839 7",
            command8Key: "\uba85\ub839 8",
            command9Key: "\uba85\ub839 9",
            zoom1key: "\uc90c \uc218\uc900 1",
            zoom2key: "\uc90c \uc218\uc900  2",
            zoom3key: "\uc90c \uc218\uc900 3",
            zoom4key: "\uc90c \uc218\uc900 4",
            zoom5key: "\uc90c \uc218\uc900 5"
        },
        mouseMenu: {
            title: "\ub9c8\uc6b0\uc2a4",
            feed: "\ud53c\ub4dcfeed",
            macroFeed: "\ub9e4\ud06c\ub85c \ud53c\ub4dcfeed",
            split: "\ubd84\uc5f4",
            doubleSplit: "\uc774\uc911 \ubd84\uc5f4",
            split16: "16 \ubd84\uc5f4",
            commander: "\uc704\uce58 \ud551",
            off: "\uaebc\uc9d0",
            lmb: "\uc67c\ucabd \ud074\ub9ad",
            rmb: "\uc624\ub978\ucabd \ud074\ub9ad",
            scroll: "\ud720 \ud074\ub9ad",
            targeting_h1: "\ud0c0\uac9f\ud305",
            targeting_txt1: "\ud0c0\uac9f \uc7a0\uae08 1  ",
            targeting_txt2: "\ud0c0\uac9f \uc7a0\uae08 2  ",
            targeting_txt3: "\uc2a4\ud06c\ub864 \ud074\ub9ad or\uad00\uc804 \ud0a4 \uc804\ud658",
            targeting_txt4: "\uc815\uc0c1 \uc138\ud3ec \ubaa8\ub4dc\uc5d0\uc11c \ub9c8\uc6b0\uc2a4 \ucd94\uc801\uc5d0 \uc804\ud658  ",
            targeting_txt5: "\ud0c0\uac9f \ubaa8\ub4dc\uc5d0\uc11c \ub9c8\uc6b0\uc2a4 \ucd94\uc801\uc5d0 \uc804\ud658  ",
            targeting_txt6: "\ub9c8\uc6b0\uc2a4 \ucd94\uc801\uc5d0\uc11c \ucd5c\uace0 \uc138\ud3ec \ubaa8\ub4dc\ub85c \uc804\ud658 "
        },
        commandsMenu: {
            title: "\uba85\ub839\uc5b4",
            command0: "\uc2dc\ubc1c!",
            command1: "\ube68\ub9ac\uc640\uc8fc\uc138\uc694!",
            command2: "\ub098\uc5d0\uac8c \ub123\uc5b4\uc918!",
            command3: "\uc5ec\uae30\uc5d0 \ub3c4\uc6c0\uc694\uccad %sector%!",
            command4: "\uc801 \uc774\uacf3\uc5d0\uc11c \ubc1c\uacac %sector%!",
            command5: "\ud300\uc6d0\uc774 \ud544\uc694\ud574!",
            command6: "\ubc14\uc774\ub7ec\uc2a4 \ubd80\uc154!",
            command7: "\ubc14\uc774\ub7ec\uc2a4 \uc3f4!",
            command8: "\ubbf8\ub07c!",
            command9: "\ub09a\uc2dc\ud558\uc790"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "\ucee4\uc11c",
            lbSize: "\ub9ac\ub354\ubcf4\ub4dc \ud06c\uae30",
            chatFontSize: "Chat font size",
			chatroomSize: "Chatroom size",
            minimapSize: "\ubbf8\ub2c8\ub9f5 \ud06c\uae30",
            skinBorder: "\uc2a4\ud0a8 \ud14c\ub450\ub9ac",
            cellTransparency: "\uc138\ud3ec \ud22c\uba85\ub3c4",
            lightenCellColor: "\ubc1d\uc740 \uc138\ud3ec \uc0c9\uae54",
            borderColor: "\ud14c\ub450\ub9ac \uc0c9\uae54",
            borderWidth: "\ud14c\ub450\ub9ac \ub108\ube44",
            gridColor: "\ub208\uae08 \uc0c9",
            gridTextColor: "\uaca9\uc790 \ud14d\uc2a4\ud2b8 \uc0c9\uae54",
            gridTextSize: "\ub208\uae08 \ud14d\uc2a4\ud2b8 \ud06c\uae30",
            gridTextFont: "\uaca9\uc790 \ud14c\uc2a4\ud2b8 \uae00\uaf34",
            gridWidth: "\ub208\uae08 \ub108\ube44",
            nickColor: "\ub2c9\ub124\uc784 \uceec\ub7ec",
            nickStrokeColor: "\ub2c9\ub124\uc784 \uc0c9\uae54\ud68d",
            cellNickSize: "\ub2c9 \ud06c\uae30",
            nickFont: "\ub2c9 \uae00\uaf34",
            massColor: "\uc9c8\ub7c9 \uc0c9\uae54",
            massStrokeColor: "\uc9c8\ub7c9 \uc0c9\uae54\ud68d",
            cellMassSize: "\uc9c8\ub7c9 \ud06c\uae30",
            massFont: "\uc9c8\ub7c9 \uae00\uaf34",
            foodColor: "\uba39\uc774 \uc0c9\uae54",
            foodSize: "\uba39\uc774 \ud06c\uae30",
            virusColor: "\ubc14\uc774\ub7ec\uc2a4 \uc0c9\uae54",
            virusBorderColor: "\ubc14\uc774\ub7ec\uc2a4 \ud14c\ub450\ub9ac \uc0c9",
            virusBorderWidth: "\ubc14\uc774\ub7ec\uc2a4 \ud14c\ub450\ub9ac \ub108\ube44",
            virusDecor: "\ubc14\uc774\ub7ec\uc2a4 \uc7a5\uc2dd",
            backgroundColor: "\ubc30\uacbd \uc0c9\uae54",
            commanderColor: "\uc704\uce58 \ud551 \uc0c9\uae54",
            indicatorSize: "\ud300 \uc544\uc774\ucf58 \ud06c\uae30",
            team1color: "\ud300 1 \uc0c9[\ub354\ube14 \ud0dc\uadf8 \ubaa8\ub4dc]",
            team2color: "\ud300 2 \uc0c9[\ub354\ube14 \ud0dc\uadf8 \ubaa8\ub4dc]",
			ghostColor: "Ghost cells color [minimap]",
			selfColor: "Self cell color [minimap]",
			selfViewportColor: "Self viewport color [minimap]",
			selfViewportAlpha: "Self viewport opacity [minimap]",
			topViewportColor: "Top viewport color [minimap]",
			topViewportAlpha: "Top viewport opacity [minimap]",
			teammateColor: "Teammate cells color [minimap]",
			teammateNameColor: "Teammate's name color [minimap]",
			customBGColor: "Custom Fantasy Color",
			customBGAlpha: "Custom Fantasy Transparency",
			customBG: "Custom Fantasy Background",
			customLB: "Custom Leaderboard Head",
			customMB: "Custom Music Box",
			customBotsName: "Custom Bot Name",
			botsAmount: "Custom Bot Amount",
			getSettings: "Get Settings",
			loadSettings: "Load Settings",
			resetSettings: "Reset Settings",
            on: "\ucf1c\uc9d0",
            off: "\uaebc\uc9d0"
        },
        updateHud: {
            title: "HSLO V5 Special Edition - 5.4.0 (9)",
            desc: "Read #ext in discord for more information.",
            versionChange: "Due to change in version " + `(${localStorage.getItem("version") || "5.3.2"} to 5.4.0 (9)),` + "<br>all settings will be reseted after you refresh the page.<br>You should save your settings and import them after refreshing.",
            updateContent: "Update:<br>1. Beta Optimized."
        }
    },
    s.lang_ES = {
        mainMenu: {
            btn_settings: "Configuracion",
            btn_play: "Jugar",
            btn_spectate: "Espectear",
            btn_inputs: "Hot Keys",
            btn_theme: "Tema/Dise\u00f1o",
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
            btn_create: "Crear",
            btn_submit: "Submit",
            btn_get: "Get",
            btn_load: "Load",
            btn_reset: "Reset"
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
            targeting_on: "Haga clic en una celula para comenzar a seguirla. Vea las instrucciones en el men\u00fa de configuraci\u00f3n del mouse.",
            targeting_off: "El seguimiento est\u00e1 desactivada. Enci\u00e9ndalo en el men\u00fa de configuraci\u00f3n para usarlo.",
            target_unnamed: "Cannot target unnamed cells.",
            hsloSkin_noAcc: "Account does not exist."
        },
        leaderboard: {
            title: "HSLO V5"
        },
        huds: {
            enterChatMsg: "Ingresa el mensaje...",
            teamlist_title: "Jugadores de equipo",
            score: "Puntuaci\u00f3n",
            num1position: "#1 Posici\u00f3n",
            pause: "Pausado",
            targeting_bigCellVp: "BIGGEST CELL VIEWPORT",
            targeting_followVp: "VIEWPORT FOLLOWING MOUSE",
            targeting_totalMass: "MASA TOTAL",
            targeting_players: "JUGADOR OBJETIVO"
        },
        settingMenu: {
            language: "Lenguaje",
            CellAnimation: "Retraso de animaci\u00f3n",
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
            teamIndicator: "Indicador de compa\u00f1ero",
            commander: "Se\u00f1al/Comandante",
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
            doubleSplitKey: "Divisi\u00f3n doble",
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
            command5: "Necesito compa\u00f1ero!",
            command6: "Lanza el virus!",
            command7: "Come el virus!",
            command8: "Haz baiteo!",
            command9: "Tricksplit falso!"
        },
        themeMenu: {
            selectedPreset: "Theme preset",
            cursor: "Puntero",
            lbSize: "Tama\u00f1o del leaderboard",
            chatFontSize: "Chat font size",
			chatroomSize: "Chatroom size",
            minimapSize: "Tama\u00f1o del minimapa",
            skinBorder: "Borde de la Skin",
            cellTransparency: "Transparencia de la celula",
            lightenCellColor: "Claridad del color de la celula",
            borderColor: "Color del borde",
            borderWidth: "Ancho del borde",
            gridColor: "Color del grid",
            gridTextColor: "Color del texto del grid",
            gridTextSize: "Tama\u00f1o de texto del grid",
            gridTextFont: "Fuente de texto del grid",
            gridWidth: "Ancho del grid",
            nickColor: "Color del nick",
            nickStrokeColor: "Color del borde del nick",
            cellNickSize: "Tama\u00f1o del nick",
            nickFont: "Fuente del nick",
            massColor: "Color de la masa",
            massStrokeColor: "Color del borde de la masa",
            cellMassSize: "Tama\u00f1o de la masa",
            massFont: "Fuente de la masa",
            foodColor: "Color de la comida",
            foodSize: "Tama\u00f1o de la comida",
            virusColor: "Color del virus",
            virusBorderColor: "Color del borde del virus",
            virusBorderWidth: "Ancho del borde del virus",
            virusDecor: "Decoracion del virus",
            backgroundColor: "Color del fondo",
            commanderColor: "Color del comandante",
            indicatorSize: "Tama\u00f1o del indicador de compa\u00f1ero",
            team1color: "Color Equipo 1 [Modo doble TAG]",
            team2color: "Color Equipo 2 [Modo doble TAG]",
			ghostColor: "Ghost cells color [minimap]",
			selfColor: "Self cell color [minimap]",
			selfViewportColor: "Self viewport color [minimap]",
			selfViewportAlpha: "Self viewport opacity [minimap]",
			topViewportColor: "Top viewport color [minimap]",
			topViewportAlpha: "Top viewport opacity [minimap]",
			teammateColor: "Teammate cells color [minimap]",
			teammateNameColor: "Teammate's name color [minimap]",
			customBGColor: "Custom Fantasy Color",
			customBGAlpha: "Custom Fantasy Transparency",
			customBG: "Custom Fantasy Background",
			customLB: "Custom Leaderboard Head",
			customMB: "Custom Music Box",
			customBotsName: "Custom Bot Name",
			botsAmount: "Custom Bot Amount",
			getSettings: "Get Settings",
			loadSettings: "Load Settings",
			resetSettings: "Reset Settings",
            on: "Activado",
            off: "Desactivado"
        },
        updateHud: {
            title: "HSLO V5 Special Edition - 5.4.0 (9)",
            desc: "Read #ext in discord for more information.",
            versionChange: "Due to change in version " + `(${localStorage.getItem("version") || "5.3.2"} to 5.4.0 (9)),` + "<br>all settings will be reseted after you refresh the page.<br>You should save your settings and import them after refreshing.",
            updateContent: "Update:<br>1. Beta Optimized."
        }
    };
    var settings = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.isOpened = !1,
                this.div = r("#settings"),
                this.language = c.get("settings", "language") || p.browser,
                this.CellAnimation = ~~c.get("settings", "CellAnimation") || 140,
                this.eatAnimation = c.get("settings", "eatAnimation") || "on",
                this.massUpdateInterval = c.get("settings", "massUpdateInterval") || 500,
                this.zoomSpeed = ~~c.get("settings", "zoomSpeed") || 92,
                this.cameraSpeed = ~~c.get("settings", "cameraSpeed") || 2,
                this.autoZoom = c.get("settings", "autoZoom") || "off",
                this.cellTextAnimation = c.get("settings", "cellTextAnimation") || "on",
                this.autoHideText = c.get("settings", "autoHideText") || "on",
                this.cellNick = c.get("settings", "cellNick") || "on",
                this.nickShadow = c.get("settings", "nickShadow") || "off",
                this.cellMass = c.get("settings", "cellMass") || "shortened",
                this.massShadow = c.get("settings", "massShadow") || "off",
                this.virusMass = c.get("settings", "virusMass") || "text",
                this.hideOwnNick = c.get("settings", "hideOwnNick") || "on",
                this.hideOwnMass = c.get("settings", "hideOwnMass") || "off",
                this.hideOwnSkin = c.get("settings", "hideOwnSkin") || "off",
                this.urlSkins = c.get("settings", "urlSkins") || "on",
                this.kanjiSkins = c.get("settings", "kanjiSkins") || "on",
                this.vanillaSkins = c.get("settings", "vanillaSkins") || "off",
                this.everyoneSkins = c.get("settings", "everyoneSkins") || "on",
                this.hsloSkins = c.get("settings", "hsloSkins") || "on",
                this.food = c.get("settings", "food") || "monoColored",
                this.bgSectors = c.get("settings", "bgSectors") || "normal",
				this.bgImg = c.get("settings", "bgImg") || "off",
                this.vanillaGrid = c.get("settings", "vanillaGrid") || "off",
                this.cursorLine = c.get("settings", "cursorLine") || "off",
                this.teamIndicator = c.get("settings", "teamIndicator") || "on",
				this.opponentRings = c.get('settings', 'opponentRings') || 'off',
				this.splitRings = c.get('settings', 'splitRings') || 'off',
				this.virusRange = c.get('settings', 'virusRange') || 'off',
                this.borderGlow = c.get("settings", "borderGlow") || "off",
		this.rainbowBorder = c.get("settings", "rainbowBorder") || "off",
                this.rainbowBorder = c.get("settings", "rainbowBorder") || "off",
                this.virusGlow = c.get("settings", "virusGlow") || "off",
                this.foodGlow = c.get("settings", "foodGlow") || "off",
                this.multiboxRing = c.get("settings", "multiboxRing") || "on",
                this.multiboxShield = c.get("settings", "multiboxShield") || "off",
				this.multiboxCellColor = c.get("settings", "multiboxCellColor") || "on",
				this.rainbowCellColor = c.get("settings", "rainbowCellColor") || "off",
                this.maouCircleSkin = c.get("settings", "maouCircleSkin") || "off",
                this.maouCircleSkinGlow = c.get("settings", "maouCircleSkinGlow") || "off",
                this.maouCircleSkinRange = c.get("settings", "maouCircleSkinRange") || "myself",
                this.commander = c.get("settings", "commander") || "on",
                this.eatEffects = c.get("settings", "eatEffects") || "off",
                this.sounds = c.get("settings", "sounds") || "on",
                this.topZoom = c.get("settings", "topZoom") || "on",
				this.showViewportBoxes = c.get("settings", "showViewportBoxes") || "off",
				this.useBots = c.get("settings", "useBots") || "off",
				this.showBotNotifNCount = c.get("settings", "showBotNotifNCount") || "off",
                this.targeting = c.get("settings", "targeting") || "off",
                this.chatType = c.get("settings", "chatType") || "popup",
                this.hideHUDs = c.get("settings", "hideHUD") || "off",
                this.multiboxMode = c.get("settings", "multiboxMode") || "on",
                this.spySaigo = c.get("settings", "spySaigo") || "off",
                this.primaryGoogle = c.get("settings", "primaryGoogle") || "off",
				m.alert("HSLO", `Multibox mode [${this.multiboxMode.toUpperCase()}]`),
				m.alert("HSLO", `Spy [Saigo] [${this.spySaigo.toUpperCase()}]`),
				m.alert("HSLO", `Primary account [${this.primaryGoogle === "on" ? "Google" : "Facebook"}]`),
                this.setDomValues(),
                this.addEvents()
            }
        }, {
            key: "setDomValues",
            value() {
                r(".settings-options").each(function() {
                    const e = r(this).attr("type");
                    "range" === e ? settings.handleRange(this, 2) : "options" === e && settings.handleOptions(this, 2)
                }),
                this.toggleChatroom(),
                this.changeLanguage(),
				this.toggleHUDs()
            }
        }, {
            key: "addEvents",
            value() {
                const e = this;
                r(".settings-container").perfectScrollbar(),
                r(".settings-container .fa-chevron-left").each(function() {
                    const e = this;
                    r(this).click(()=>{
                        const t = r(e).parent()
                          , o = r(t).attr("type");
                        "options" === o ? settings.handleOptions(t, 0) : "range" === o && settings.handleRange(t, 0)
                    }
                    )
                }),
                r(".settings-container span.outer").each(function() {
                    const e = this;
                    r(this).click(t=>{
                        const o = r(e).parent();
                        settings.handleRange(o, 3, t.offsetX)
                    }
                    )
                }),
                r(".settings-container .fa-chevron-right").each(function() {
                    const e = this;
                    r(this).click(()=>{
                        const t = r(e).parent()
                          , o = r(t).attr("type");
                        "options" === o ? settings.handleOptions(t, 1) : "range" === o && settings.handleRange(t, 1)
                    }
                    )
                }),
                r(".settings-close").click(()=>e.close())
            }
        }, {
            key: "toggle",
            value() {
                this.isOpened ? this.close() : this.open()
            }
        }, {
            key: "close",
            value() {
                this.isOpened = !1,
                this.div.fadeOut(250)
            }
        }, {
            key: "open",
            value() {
                this.isOpened = !0,
                this.div.fadeIn(250)
            }
        }, {
            key: "handleOptions",
            value(e, t) {
                for (var o, i = r(e).attr("name"), s = r(e).find("b"), n = s.length, a = n, l = 0; a--; )
                    o = s[a],
                    "active" === r(o).attr("class") && (l = a);
                if (1 === t) {
                    const e = l + 1 < n ? l + 1 : 0;
                    r(s[l]).removeAttr("class"),
                    r(s[e]).attr("class", "active");
                    const t = r(s[e]).attr("value");
                    this.saveSettings(i, t)
                } else if (0 === t) {
                    const e = 0 < l ? l - 1 : n - 1;
                    r(s[l]).removeAttr("class"),
                    r(s[e]).attr("class", "active");
                    const t = r(s[e]).attr("value");
                    this.saveSettings(i, t)
                } else if (2 === t) {
                    r(s[l]).removeAttr("class");
                    for (let e, t = n; t--; )
                        if (e = s[t],
                        r(e).attr("value") === this[i]) {
                            r(e).attr("class", "active");
                            break
                        }
                }
            }
        }, {
            key: "handleRange",
            value(e, t) {
                const o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0
                  , i = r(e).attr("name")
                  , s = r(e).find("span")
                  , n = s[0]
                  , a = s[1]
                  , l = r(s[2])
                  , h = ~~r(n).attr("min")
                  , c = ~~r(n).attr("max")
                  , _ = ~~r(n).attr("step")
                  , d = ~~r(n).attr("value");
                if (1 === t && d + _ <= c) {
                    const e = _ + d;
                    r(n).attr("value", e),
                    r(a).css("width", ~~(100 * (e - h) / (c - h)) + "px"),
                    l.text("[" + e + "]"),
                    this.saveSettings(i, ~~e)
                } else if (0 === t && d - _ >= h) {
                    const e = d - _;
                    r(n).attr("value", e),
                    r(a).css("width", ~~(100 * (e - h) / (c - h)) + "px"),
                    l.text("[" + e + "]"),
                    this.saveSettings(i, ~~e)
                } else if (2 === t) {
                    const e = this[i];
                    r(n).attr("value", e),
                    r(a).css("width", ~~(100 * (e - h) / (c - h)) + "px"),
                    l.text("[" + e + "]")
                } else if (3 === t) {
                    let e = 0 | o / 100 * (c - h);
                    e = (0 | e / _) * _;
                    const t = 100 * ((e += h) - h) / (c - h);
                    r(n).attr("value", e),
                    r(a).css("width", ~~t + "px"),
                    l.text("[" + e + "]"),
                    this.saveSettings(i, ~~e)
                }
            }
        }, {
            key: "saveSettings",
            value(e, t) {
				let cancelled = !1;
                this[e] = t,
				"multiboxMode" === e && A.isAliveTab2 && (m.alert("HSLO", `Tab 2 must not be alive`), this.multiboxMode = "on", c.set("settings", "multiboxMode", "on"), cancelled = !0, this.setDomValues()),
				!A.isAliveTab2 && "multiboxMode" === e && m.alert("HSLO", `Multibox mode [${this.multiboxMode.toUpperCase()}]`),
				!A.isAliveTab2 && "multiboxMode" === e && (this.multiboxMode === "off" ? (q.Tab2.close(),
				q.Tab2 = null,
				j.protocolKey2 = null,
				j.clientKey2 = null,
				Q.loggedIn2 = !1,
				this.multiboxRing = "off",
				this.setDomValues()) : (
				q.Tab2 = new WebSocket("wss://" + q.address),
				q.Tab2.binaryType = "arraybuffer",
				q.Tab2.onopen = () => q.onOpen(2),
				q.Tab2.onmessage = (e) => q.onMessage(e, 2),
				q.Tab2.onclose = () => q.onClose(2),
				q.Tab2.onerror = () => q.onError(2),
				this.multiboxRing = "on",
				this.setDomValues())),
				!A.isAliveTab2 && "multiboxMode" === e && (this.multiboxMode === "off" ? (J.ogarWS2.close(),
				J.ogarWS2 = null) : (
				ae.connectedIndex = 1,
				J.ogarWS2 = new WebSocket("wss://" + J.address),
				J.ogarWS2.binaryType = "arraybuffer",
				J.ogarWS2.onopen = () => J.onOpen(2),
				J.ogarWS2.onmessage = (e) => J.onMessage(e, 2),
				J.ogarWS2.onclose = () => J.onClose(2),
				J.ogarWS2.onerror = () => J.onError(2))),
				"spySaigo" === e && (m.alert("HSLO", `Spy [Saigo] [${this.spySaigo.toUpperCase()}]`),
				this.spySaigo === "off" ? (Js.saigoWS.close(),
				Js.saigoWS = null,
				ses.teammates.clear()) : (Js.saigoWS = new WebSocket("wss://" + Js.address, "main"),
				Js.saigoWS.binaryType = "arraybuffer",
				Js.saigoWS.onopen = () => Js.onOpen(),
				Js.saigoWS.onmessage = (e) => Js.onMessage(e),
				Js.saigoWS.onclose = () => Js.onClose(),
				Js.saigoWS.onerror = () => Js.onError())),
                "chatType" === e && this.toggleChatroom(),
                "language" === e && this.changeLanguage(),
                "hideHUDs" === e && this.toggleHUDs(),
                "nickShadow" === e && P.nickCaches.clear(),
                "massShadow" === e && (P.massCaches.clear(), Pm.reset()),
				"massUpdateInterval" === e && (P.massUpdateInterval = this.massUpdateInterval),
				"useBots" === e && this.useBots === "on" ? (Q.myTurn = false) : (Q.myTurn = true),
				"primaryGoogle" === e && (A.isAlive ? (m.alert("HSLO", "You can't be alive!"),
				this.primaryGoogle = c.get("settings", "primaryGoogle"),
				c.set("settings", "primaryGoogle", c.get("settings", "primaryGoogle")),
				cancelled = !0,
				this.setDomValues()) : (m.alert("HSLO", `Primary account [${this.primaryGoogle === "on" ? "Google" : "Facebook"}]`),
				m.alert("HSLO", "Processing... Please re-login!"),
				$.logout(),
				ee.logout(),
				q.reconnect(1),
				q.reconnect(2))),
                !cancelled && c.set("settings", e, t),
                "foodGlow" === e && H.init(),
                "virusGlow" === e && de.init(),
                ("borderGlow" === e || "rainbowBorder" === e) && be.init(),
                "custom" !== oe.selectedPreset && (oe.selectedPreset = "custom",
                c.set("theme", "selectedPreset", "custom"),
                oe.setDomValues())
            }
        }, {
            key: "changeLanguage",
            value() {
                p.change(),
                u.refresh()
            }
        }, {
            key: "toggleChatroom",
            value() {
                "chatroom" === this.chatType ? r("#chatroom").show() : r("#chatroom").hide()
            }
        }, {
            key: "toggleHUDs",
            value() {
                "off" === this.hideHUDs ? r("#huds").show() : r("#huds").hide();
            }
        }]),
        e
    })());
    window.k = settings;
    const x = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.isOpened = !1,
                this.target = "hotkeys",
                this.div = r("#inputs"),
                this.addEvents(),
                d.init(),
                a.init(),
                _.init(),
                u.init()
            }
        }, {
            key: "toggle",
            value() {
                this.isOpened ? this.close() : this.open()
            }
        }, {
            key: "close",
            value() {
                this.isOpened = !1,
                this.div.fadeOut(250)
            }
        }, {
            key: "open",
            value() {
                this.isOpened = !0,
                this.div.fadeIn(250)
            }
        }, {
            key: "addEvents",
            value() {
                const t = this;
                r(".inputs-tab").each(function() {
                    const t = this;
                    r(this).click(()=>{
                        const o = r(t).attr("target");
                        "#hotkeys" === o ? (r("#hotkeys").addClass("active"),
                        r("#commands").removeClass("active"),
                        r("#mouse").removeClass("active"),
                        r('.inputs-tab[target="#hotkeys"]').addClass("active"),
                        r('.inputs-tab[target="#mouse"]').removeClass("active"),
                        r('.inputs-tab[target="#commands"]').removeClass("active"),
                        e.target = "hotkeys") : "#mouse" === o ? (r("#mouse").addClass("active"),
                        r("#hotkeys").removeClass("active"),
                        r("#commands").removeClass("active"),
                        r('.inputs-tab[target="#hotkeys"]').removeClass("active"),
                        r('.inputs-tab[target="#commands"]').removeClass("active"),
                        r('.inputs-tab[target="#mouse"]').addClass("active"),
                        e.target = "mouse") : "#commands" === o && (r("#commands").addClass("active"),
                        r("#hotkeys").removeClass("active"),
                        r("#mouse").removeClass("active"),
                        r('.inputs-tab[target="#commands"]').addClass("active"),
                        r('.inputs-tab[target="#hotkeys"]').removeClass("active"),
                        r('.inputs-tab[target="#mouse"]').removeClass("active"),
                        e.target = "commands")
                    }
                    )
                }),
                r(".inputs-tab.close").click(()=>{
                    t.close()
                })
            }
        }]),
        e
    })()
      , b = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.selected = ~~c.get("profiles", "selected") || 1,
                this.wheelIsOpened = !1,
                this.tag = c.get("profiles", "tag") || "",
                this.tag2 = c.get("profiles", "tag2") || "",
                this.setDomValues(),
                this.addEvents()
            }
        }, {
            key: "setDomValues",
            value() {
                let e = c.get("profiles", "profile" + this.selected);
                e || (e = {
                    nick: "profile " + this.selected,
                    nick2: "profile " + this.selected,
                    skin: "https://i.imgur.com/kbfjWV1.png",
                    skin2: "https://i.imgur.com/kbfjWV1.png"
                }),
                c.set("profiles", "profile" + this.selected, e),
                r("#nick").val(e.nick),
                r("#nick2").val(e.nick2),
                r("#skin").val(e.skin),
                r("#skin2").val(e.skin2),
                r("#tag").val(this.tag),
                r("#tag2").val(this.tag2),
                this.updateMainSkin();
                for (let e = 8; 0 < e; )
                    this.updatePreviewSkin(e),
                    e--
            }
        }, {
            key: "addEvents",
            value() {
                const e = this;
                r(".bar-circle-outer").click(()=>{
                    r(".skin-wheel").fadeIn(250),
                    e.wheelIsOpened = !0
                }),
                r(".skin-selector").each(function() {
                    const e = this;
                    r(this).click(()=>{
                        const t = 0 | r(e).attr("value");
                        b.switch(t),
                        r(".skin-wheel").fadeOut(250)
                    }
                    )
                }),
                r(".menu-blur").click(()=>{
                    e.wheelIsOpened && (r(".skin-wheel").fadeOut(250),
                    e.wheelIsOpened = !1)
                }),
                r("#tag").blur(()=>{
                    e.spectator(r("#tag").val(), r("#tag2").val())
                }),
                r("#tag2").blur(()=>{
                    e.spectator(r("#tag").val(), r("#tag2").val())
                }),
                r("#nick").blur(()=>{
                    e.setNick(r("#nick").val())
                }),
                r("#nick2").blur(()=>{
                    e.setNick2(r("#nick2").val())
                }),
                r("#skin").blur(()=>{
                    e.setSkin(r("#skin").val())
                }),
                r("#skin2").blur(()=>{
                    e.setSkin2(r("#skin2").val())
                })
            }
        }, {
            key: "switch",
            value(e) {
                this.selected = ~~e,
                c.set("profiles", "selected", e);
                let t = c.get("profiles", "profile" + e);
                t || (t = {
                    nick: "profile " + this.selected,
                    nick2: "profile " + this.selected,
                    skin: "https://i.imgur.com/kbfjWV1.png",
                    skin2: "https://i.imgur.com/kbfjWV1.png"
                }),
                r("#nick").val(t.nick),
                r("#nick2").val(t.nick2),
                r("#skin").val(t.skin),
                r("#skin2").val(t.skin2),
                A.nick = t.nick,
                A.nick2 = t.nick2,
                A.skin = t.skin,
                A.skin2 = t.skin2,
				A.tab1Info.nick = t.nick,
				A.tab1Info.skin = t.skin,
				A.tab2Info.nick = t.nick2,
				A.tab2Info.skin = t.skin2,
                c.set("profiles", "profile" + this.selected, t),
                this.updateMainSkin()
            }
        }, {
            key: "setNick",
            value(e) {
                let t = c.get("profiles", "profile" + this.selected);
                t || (t = {
                    nick: "profile " + this.selected,
                    nick2: "profile " + this.selected,
                    skin: "https://i.imgur.com/kbfjWV1.png",
                    skin2: "https://i.imgur.com/kbfjWV1.png"
                }),
                t.nick = e,
                c.set("profiles", "profile" + this.selected, t),
                A.nick = e,
                A.tab1Info.nick = e
            }
        }, {
            key: "setNick2",
            value(e) {
                let t = c.get("profiles", "profile" + this.selected);
                t || (t = {
                    nick: "profile " + this.selected,
                    nick2: "profile " + this.selected,
                    skin: "https://i.imgur.com/kbfjWV1.png",
                    skin2: "https://i.imgur.com/kbfjWV1.png"
                }),
                t.nick2 = e,
                c.set("profiles", "profile" + this.selected, t),
                A.nick2 = e,
				A.tab2Info.nick = e
            }
        }, {
            key: "setSkin",
            value(e) {
                let t = c.get("profiles", "profile" + this.selected);
                t || (t = {
                    nick: "profile " + this.selected,
                    nick2: "profile " + this.selected,
                    skin: "https://i.imgur.com/kbfjWV1.png",
                    skin2: "https://i.imgur.com/kbfjWV1.png"
                }),
                t.skin = re.code2Url(re.getImgurCode(e)),
                c.set("profiles", "profile" + this.selected, t),
                this.updateMainSkin(),
                this.updatePreviewSkin(this.selected),
                A.skin = e,
                A.tab1Info.skin = e
            }
        }, {
            key: "setSkin2",
            value(e) {
                let t = c.get("profiles", "profile" + this.selected);
                t || (t = {
                    nick: "profile " + this.selected,
                    nick2: "profile " + this.selected,
                    skin: "https://i.imgur.com/kbfjWV1.png",
                    skin2: "https://i.imgur.com/kbfjWV1.png"
                }),
                t.skin2 = re.code2Url(re.getImgurCode(e)),
                c.set("profiles", "profile" + this.selected, t),
                this.updateMainSkin(),
                this.updatePreviewSkin(this.selected),
                A.skin2 = e,
				A.tab2Info.skin = e
            }
        }, {
            key: "spectator",
            value(e, e2) {
                A.tag = e,
                A.tag2 = e2,
                c.set("profiles", "tag", e),
                c.set("profiles", "tag2", e2)
            }
        }, {
            key: "updateMainSkin",
            value() {
                const e = re.code2Url(re.getImgurCode(r("#skin").val()));
                r(".skin-preview").css("background", "url(" + e + ")")
            }
        }, {
            key: "updatePreviewSkin",
            value(e) {
                const t = c.get("profiles", "profile" + e);
                if (t) {
                    const o = t.skin;
                    r(".skin-selector[value=" + e + "]").css("background", "url(" + o + ")")
                }
            }
        }]),
        e
    })());
    window.classb = b,
    a = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.toggleMenuKey = c.get("hotkeys", "toggleMenuKey") || "ESC",
                this.feedKey = c.get("hotkeys", "feedKey") || "W",
                this.macroFeedKey = c.get("hotkeys", "macroFeedKey") || "E",
                this.splitKey = c.get("hotkeys", "splitKey") || "SPACE",
                this.doubleSplitKey = c.get("hotkeys", "doubleSplitKey") || "R",
                this.split16Key = c.get("hotkeys", "split16Key") || "G",
                this.stopKey = c.get("hotkeys", "stopKey") || "S",
                this.chatKey = c.get("hotkeys", "chatKey") || "ENTER",
				this.toggleHUDsKey = c.get("hotkeys", "toggleHUDsKey") || "H",
                this.multiboxTab = c.get("hotkeys", "multiboxTab") || "TAB",
                this.togglemultiboxRing = c.get("hotkeys", "togglemultiboxRing") || "L",
                this.togglemaouCircleSkin = c.get("hotkeys", "togglemaouCircleSkin") || "K",
                this.freeSpectateKey = c.get("hotkeys", "freeSpectateKey") || "Q",
                this.toggleSplitRings = c.get("hotkeys", "toggleSplitRings") || "U",
                this.toggleOpponentRings = c.get("hotkeys", "toggleOpponentRings") || "I",
                this.toggleNick = c.get("hotkeys", "toggleNick") || "N",
                this.toggleMass = c.get("hotkeys", "toggleMass") || "M",
                this.toggleBGsectors = c.get("hotkeys", "toggleBGsectors") || "G",
                this.toggleBGImg = c.get("hotkeys", "toggleBGImg") || "B",
                this.toggleFood = c.get("hotkeys", "toggleFood") || "F",
                this.toggleSkin = c.get("hotkeys", "toggleSkin") || "A",
                this.respawnKey = c.get("hotkeys", "respawnKey") || "TILDE",
                this.command0Key = c.get("hotkeys", "command0Key") || "0",
                this.command1Key = c.get("hotkeys", "command1Key") || "1",
                this.command2Key = c.get("hotkeys", "command2Key") || "2",
                this.command3Key = c.get("hotkeys", "command3Key") || "3",
                this.command4Key = c.get("hotkeys", "command4Key") || "4",
                this.command5Key = c.get("hotkeys", "command5Key") || "5",
                this.command6Key = c.get("hotkeys", "command6Key") || "6",
                this.command7Key = c.get("hotkeys", "command7Key") || "7",
                this.command8Key = c.get("hotkeys", "command8Key") || "8",
                this.command9Key = c.get("hotkeys", "command9Key") || "9",
                this.command11Key = c.get("hotkeys", "command11Key") || "UP",
                this.command12Key = c.get("hotkeys", "command12Key") || "DOWN",
                this.command13Key = c.get("hotkeys", "command13Key") || "LEFT",
                this.command14Key = c.get("hotkeys", "command14Key") || "RIGHT",
                this.zoom1key = c.get("hotkeys", "zoom1key") || "ALT+1",
                this.zoom2key = c.get("hotkeys", "zoom2key") || "ALT+2",
                this.zoom3key = c.get("hotkeys", "zoom3key") || "ALT+3",
                this.zoom4key = c.get("hotkeys", "zoom4key") || "ALT+4",
                this.zoom5key = c.get("hotkeys", "zoom5key") || "ALT+5",
                this.splitBotsKey = c.get("hotkeys", "splitBotsKey") || "",
                this.feedBotsKey = c.get("hotkeys", "feedBotsKey") || "",
                this.AIBotsKey = c.get("hotkeys", "AIBotsKey") || "",
                this.startBotsKey = c.get("hotkeys", "startBotsKey") || "",
                this.stopBotsKey = c.get("hotkeys", "stopBotsKey") || "",
                this.connectBotsKey = c.get("hotkeys", "connectBotsKey") || "",
                this.pressedKeys = new Map,
                this.setDomKeys(),
                this.addEvents()
            }
        }, {
            key: "setDomKeys",
            value() {
                r("#hotkeys .row").each(function() {
                    const t = r(this).attr("name")
                      , o = r(this).find(".key")[0];
                    r(o).val(e[t])
                })
            }
        }, {
            key: "addEvents",
            value() {
                const t = this;
                r("#hotkeys").perfectScrollbar(),
                r("#hotkeys .row .key").each(function() {
                    const t = this;
                    r(this).keydown(o=>{
                        o.preventDefault();
                        const i = r(t).parent();
                        e.setKey(i, o, t)
                    }
                    )
                }),
                h.addEventListener("keydown", e=>t.onKeyDown(e)),
                h.addEventListener("keyup", e=>t.onKeyUp(e))
            }
        }, {
            key: "onKeyDown",
            value(e) {
                9 === e.keyCode && e.preventDefault();
                const t = this.getKey(e);
                if (t && !this.pressedKeys.has(t) && (this.pressedKeys.set(t, !0),
                !x.isOpened || "hotkeys" !== x.target)) {
                    if (t === this.chatKey)
                        return void d.chat();
                    if (!w.isFocused) {
                        if (t === this.toggleMenuKey)
                            return void z.toggle();
                        if (!z.isOpened) {
                            if (e.preventDefault(),
                            t === this.freeSpectateKey && !A.isAlive)
                                return void d.toggleSpectate();
                            if (t === this.respawnKey)
                                return void d.respawn();
							if (t === this.toggleHUDsKey)
								return void d.toggleHUDs();
                            if (A.isAlive) {
                                if (t === this.macroFeedKey)
                                    return void d.macroFeed(!0);
                                if (t === this.feedKey)
                                    return void d.feed();
                                if (t === this.splitKey)
                                    return void d.split();
                                if (t === this.doubleSplitKey)
                                    return void d.doubleSplit();
                                if (t === this.split16Key)
                                    return void d.split16();
                                if (t === this.multiboxTab)
                                    return void d.multiboxTab();
                            }
                            return t === this.stopKey ? void d.stopMovementToggle() : t === this.toggleSplitRings ? void d.toggleSplitRings() : t === this.toggleOpponentRings ? void d.toggleOpponentRings() : t === this.toggleNick ? void d.toggleCellNick() : t === this.toggleMass ? void d.toggleCellMass() : t === this.toggleBGsectors ? void d.toggleBGsectors() : t === this.toggleBGImg ? void d.toggleBGImg() : t === this.toggleFood ? void d.toggleGameFood() : t === this.toggleSkin ? void d.toggleSkin() : t === this.togglemultiboxRing ? void d.togglemultiboxRing() : t === this.togglemaouCircleSkin ? void d.togglemaouCircleSkin() : t === this.command0Key ? void d.command(0) : t === this.command1Key ? void d.command(1) : t === this.command2Key ? void d.command(2) : t === this.command3Key ? void d.command(3) : t === this.command4Key ? void d.command(4) : t === this.command5Key ? void d.command(5) : t === this.command6Key ? void d.command(6) : t === this.command7Key ? void d.command(7) : t === this.command8Key ? void d.command(8) : t === this.command9Key ? void d.command(9) : t === this.command11Key ? void d.command(11) : t === this.command12Key ? void d.command(12) : t === this.command13Key ? void d.command(13) : t === this.command14Key ? void d.command(14) : t === this.zoom1key ? void d.setZoom(.5) : t === this.zoom2key ? void d.setZoom(.25) : t === this.zoom3key ? void d.setZoom(.125) : t === this.zoom4key ? void d.setZoom(.075) : t === this.zoom5key ? void d.setZoom(.05) : t === this.splitBotsKey ? void botsFunc(0) : t === this.feedBotsKey ? void botsFunc(1) : t === this.AIBotsKey ? void botsFunc(2) : t === this.startBotsKey ? void botsFunc(3) : t === this.stopBotsKey ? void botsFunc(4) : t === this.connectBotsKey ? void botsFunc(5) : void 0
                        }
                    }
                }
            }
        }, {
            key: "onKeyUp",
            value(e) {
                const t = this.getKey(e);
                t && (this.pressedKeys.delete(t),
                t === this.macroFeedKey) && d.macroFeed(!1)
            }
        }, {
            key: "setKey",
            value(e, t, o) {
                let i = this.getKey(t);
                const s = r(e).attr("name");
                !1 === i || ("freeSpectateKey" !== s && this.alreadyBinded(i),
                "DEL" === i && (i = ""),
                r(o).val(i),
                this[s] = i,
                c.set("hotkeys", s, i))
            }
        }, {
            key: "alreadyBinded",
            value(e) {
                let t = !1;
                e === this.toggleMenuKey ? t = "toggleMenuKey" : e === this.feedKey ? t = "feedKey" : e === this.macroFeedKey ? t = "macroFeedKey" : e === this.splitKey ? t = "splitKey" : e === this.doubleSplitKey ? t = "doubleSplitKey" : e === this.split16Key ? t = "split16Key" : e === this.stopKey ? t = "stopKey" : e === this.chatKey ? t = "chatKey" : e === this.multiboxTab ? t = "multiboxTab" : e === this.toggleSplitRings ? t = "toggleSplitRings" : e === this.toggleOpponentRings ? t = "toggleOpponentRings" : e === this.toggleNick ? t = "toggleNick" : e === this.toggleMass ? t = "toggleMass" : e === this.toggleBGsectors ? t = "toggleBGsectors" : e === this.toggleBGImg ? t = "toggleBGImg" : e === this.toggleFood ? t = "toggleFood" : e === this.toggleSkin ? t = "toggleSkin" : e === this.togglemultiboxRing ? t = "togglemultiboxRing" : e === this.togglemaouCircleSkin ? t = "togglemaouCircleSkin" : e === this.respawnKey ? t = "respawnKey" : e === this.command0Key ? t = "command0Key" : e === this.command1Key ? t = "command1Key" : e === this.command2Key ? t = "command2Key" : e === this.command3Key ? t = "command3Key" : e === this.command4Key ? t = "command4Key" : e === this.command5Key ? t = "command5Key" : e === this.command6Key ? t = "command6Key" : e === this.command7Key ? t = "command7Key" : e === this.command8Key ? t = "command8Key" : e === this.command9Key ? t = "command9Key" : e === this.command11Key ? t = "command11Key" : e === this.command12Key ? t = "command12Key" : e === this.command13Key ? t = "command13Key" : e === this.command14Key ? t = "command14Key" : e === this.zoom1key ? t = "zoom1key" : e === this.zoom2key ? t = "zoom2key" : e === this.zoom3key ? t = "zoom3key" : e === this.zoom4key ? t = "zoom4key" : e === this.zoom5key && (t = "zoom5key"),
                t && (this[t] = "",
                c.set("hotkeys", t, ""),
                r("#hotkeys .row[name=" + t + "] input").val(""))
            }
        }, {
            key: "isValidKey",
            value(e) {
                const t = e.keyCode || e.which;
                return 64 < t && 91 > t || 47 < t && 58 > t || 13 === t || 27 === t || 32 === t || 16 === t || 46 === t || 192 === t || 9 === t || 36 < t && 41 > t
            }
        }, {
            key: "getKey",
            value(e) {
                if (!this.isValidKey(e))
                    return !1;
                const t = e.keyCode || e.which;
                let o = !1
                  , i = !1;
                return e.ctrlKey ? o = "CTRL+" : e.altKey && (o = "ALT+"),
                64 < t && 91 > t ? i = String.fromCharCode(t) : 47 < t && 58 > t ? i = "" + (t - 48) : o || (13 === t ? i = "ENTER" : 27 === t ? i = "ESC" : 32 === t ? i = "SPACE" : 16 === t ? i = "SHIFT" : 9 === t ? i = "TAB" : 46 === t ? i = "DEL" : 38 === t ? i = "UP" : 40 === t ? i = "DOWN" : 37 === t ? i = "LEFT" : 39 === t ? i = "RIGHT" : 192 === t && (i = "TILDE")),
                !!i && (o ? o + i : i)
            }
        }]),
        e
    })(),
    _ = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.leftClick = c.get("mouse", "leftClick") || "off",
            this.middleClick = c.get("mouse", "middleClick") || "off",
            this.rightClick = c.get("mouse", "rightClick") || "off",
            this.x = 0,
            this.y = 0,
            this.canvas = h.getElementById("canvas"),
            this.canvasX = 0,
            this.canvasY = 0
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.setDomValues(),
                this.addEvents()
            }
        }, {
            key: "send",
            value() {
                const e = 2 === A.controllingTab ? G.getOffset2 : 3 === A.controllingTab ? G.getOffset3 : {
                    x: 0,
                    y: 0
                };
                return this.canvasX = (this.x - window.innerWidth / 2) / L.viewport + L.x + e.x,
                this.canvasY = (this.y - window.innerHeight / 2) / L.viewport + L.y + e.y,
                L.isSpectating && W.isTurnedOn ? void Q.mouse(0 | W.center.x, 0 | W.center.y) : A.movementPaused ? (A.controllingTab === 1 ? void Q.mouse(0 | A.x1, 0 | A.y1) : A.controllingTab === 2 && void Q.mouse(0 | A.x2 + G.getOffset2.x, 0 | A.y2 + G.getOffset2.y)) : void Q.mouse(0 | this.canvasX, 0 | this.canvasY)
            }
        }, {
            key: "setDomValues",
            value() {
                r(".mouse-options").each(function() {
                    const e = r(this).attr("type");
                    "range" === e ? _.handleRange(this, 2) : "options" === e && _.handleOptions(this, 2)
                })
            }
        }, {
            key: "addEvents",
            value() {
                const e = this;
                r("#mouse").perfectScrollbar(),
                r("#mouse .fa-chevron-left").each(function() {
                    const e = this;
                    r(this).click(()=>{
                        const t = r(e).parent()
                          , o = r(t).attr("type");
                        "options" === o ? _.handleOptions(t, 0) : "range" === o && _.handleRange(t, 0)
                    }
                    )
                }),
                r("#mouse .fa-chevron-right").each(function() {
                    const e = this;
                    r(this).click(()=>{
                        const t = r(e).parent()
                          , o = r(t).attr("type");
                        "options" === o ? _.handleOptions(t, 1) : "range" === o && _.handleRange(t, 1)
                    }
                    )
                }),
                /*this.canvas.addEventListener("mousemove", t=>{
                    e.x = t.clientX,
                    e.y = t.clientY
                }),*/
				document.body.addEventListener("mousemove", t=>{
                    e.x = t.clientX,
                    e.y = t.clientY
                }),
                this.canvas.addEventListener("mousedown", t=>{
                    e.onMouseClick(t)
                }),
                this.canvas.addEventListener("mouseup", t=>{
                    e.onMouseRelease(t)
                }),
                /*this.canvas.addEventListener("wheel", t=>{
                    e.onMouseWheel(t)
                }),*/
				document.body.addEventListener("wheel", t=>{
                    e.onMouseWheel(t)
                }),
                this.canvas.addEventListener("contextmenu", e=>{
                    e.preventDefault()
                })
            }
        }, {
            key: "onMouseWheel",
            value(e) {
                let t = L.targetViewport;
                0 > e.wheelDelta ? t *= settings.zoomSpeed / 100 : t /= settings.zoomSpeed / 100,
                t = 2 < t ? 2 : .02 > t ? .02 : t,
                L.targetViewport = t
            }
        }, {
            key: "onMouseClick",
            value(e) {
                let t = !1;
                switch (e.which) {
                case 1:
                    t = "leftClick";
                    break;
                case 2:
                    t = "middleClick";
                    break;
                case 3:
                    t = "rightClick"
                }
                if (t) {
                    if (L.isSpectating && "on" === settings.targeting) {
                        const o = (e.clientX - (s.innerWidth >> 1)) / L.viewport + L.x
                          , i = (e.clientY - (s.innerHeight >> 1)) / L.viewport + L.y;
                        return void ("leftClick" === t ? W.lockTarget(o, i, 1) : "middleClick" === t ? W.reset() : "rightClick" == t && W.lockTarget(o, i, 2))
                    }
                    const o = this[t];
                    return "off" === o ? void 0 : "feed" === o ? void d.feed() : "macroFeed" === o ? void d.macroFeed(!0) : "split" === o ? void d.split() : "doubleSplit" === o ? void d.doubleSplit() : "split16" === o ? void d.split16() : "commander" === o ? void d.commander() : void 0
                }
            }
        }, {
            key: "onMouseRelease",
            value(e) {
                let t = !1;
                switch (e.which) {
                case 1:
                    t = "leftClick";
                    break;
                case 2:
                    t = "middleClick";
                    break;
                case 3:
                    t = "rightClick"
                }
                if (t) {
                    if ("macroFeed" === this[t])
                        return void d.macroFeed(!1)
                }
            }
        }, {
            key: "handleOptions",
            value(e, t) {
                for (var o, i = r(e).attr("name"), s = r(e).find("b"), n = s.length, a = n, l = 0; a--; )
                    o = s[a],
                    "active" === r(o).attr("class") && (l = a);
                if (1 === t) {
                    const e = l + 1 < n ? l + 1 : 0;
                    r(s[l]).removeAttr("class"),
                    r(s[e]).attr("class", "active");
                    const t = r(s[e]).attr("value");
                    this.saveMouseOptions(i, t)
                } else if (0 === t) {
                    const e = 0 < l ? l - 1 : n - 1;
                    r(s[l]).removeAttr("class"),
                    r(s[e]).attr("class", "active");
                    const t = r(s[e]).attr("value");
                    this.saveMouseOptions(i, t)
                } else if (2 === t) {
                    r(s[l]).removeAttr("class");
                    for (let e, t = n; t--; )
                        if (e = s[t],
                        r(e).attr("value") === this[i]) {
                            r(e).attr("class", "active");
                            break
                        }
                }
            }
        }, {
            key: "handleRange",
            value(e, t) {
                const o = r(e).attr("name")
                  , i = r(e).find("span")
                  , s = i[0]
                  , n = i[1]
                  , a = ~~r(s).attr("min")
                  , l = ~~r(s).attr("max")
                  , h = ~~r(s).attr("step")
                  , c = ~~r(s).attr("value");
                if (1 === t && c + h <= l) {
                    const e = h + c;
                    r(s).attr("value", e),
                    r(n).css("width", ~~(100 * (e - a) / (l - a)) + "px"),
                    this.saveMouseOptions(o, e)
                } else if (0 === t && c - h >= a) {
                    const e = c - h;
                    r(s).attr("value", e),
                    r(n).css("width", ~~(100 * (e - a) / (l - a)) + "px"),
                    this.saveMouseOptions(o, e)
                } else if (2 === t) {
                    const e = this[o];
                    r(s).attr("value", e),
                    r(n).css("width", ~~(100 * (e - a) / (l - a)) + "px")
                }
            }
        }, {
            key: "saveMouseOptions",
            value(e, t) {
                this[e] = t,
                c.set("mouse", e, t)
            }
        }]),
        e
    })()),
    l = atob("bmk="),
    u = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                //console.log('init class u'),
                this.load(),
                this.setDomValues(),
                this.addEvents()
            }
        }, {
            key: "load",
            value() {
                this.command1 = c.get("commands", "command1") || p.current.commandsMenu.command1,
                this.command2 = c.get("commands", "command2") || p.current.commandsMenu.command2,
                this.command3 = c.get("commands", "command3") || p.current.commandsMenu.command3,
                this.command4 = c.get("commands", "command4") || p.current.commandsMenu.command4,
                this.command5 = c.get("commands", "command5") || p.current.commandsMenu.command5,
                this.command6 = c.get("commands", "command6") || p.current.commandsMenu.command6,
                this.command7 = c.get("commands", "command7") || p.current.commandsMenu.command7,
                this.command8 = c.get("commands", "command8") || p.current.commandsMenu.command8,
                this.command9 = c.get("commands", "command9") || p.current.commandsMenu.command9,
                this.command0 = c.get("commands", "command0") || p.current.commandsMenu.command0,
                this.command11 = c.get("commands", "command11") || p.current.commandsMenu.command11,
                this.command12 = c.get("commands", "command12") || p.current.commandsMenu.command12,
                this.command13 = c.get("commands", "command13") || p.current.commandsMenu.command13,
                this.command14 = c.get("commands", "command14") || p.current.commandsMenu.command14
            }
        }, {
            key: "addEvents",
            value() {
                const e = this;
                r("#commands").perfectScrollbar();
                for (let t = 15, o = ()=>{
                    t--;
                    //console.log(t);
                    const o = "command" + t;
                    r("#" + o).blur(()=>{
                        e.setCommand(o, r("#" + o).val())
                    }
                    )
                }; t--; )
                    o()
            }
        }, {
            key: "setCommand",
            value(e, t) {
                this[e] = t,
                c.set("commands", e, t)
            }
        }, {
            key: "setDomValues",
            value() {
                for (let e, t = 15; t--; )
                    r("#" + (e = "command" + t)).val(this[e])
            }
        }, {
            key: "refresh",
            value() {
                this.load(),
                this.setDomValues()
            }
        }]),
        e
    })(),
    d = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.ejectInterval = !1
            }
        }, {
            key: "stopMovementToggle",
            value() {
                A.movementPaused = !A.movementPaused
            }
        }, {
            key: "feed",
            value() {
                _.send(),
                Q.eject()
            }
        }, {
            key: "macroFeed",
            value(e) {
                const t = this;
                if (e) {
                    if (this.ejectInterval)
                        return;
                    this.feed(),
                    this.ejectInterval = setInterval(()=>{
                        t.feed()
                    }
                    , 80)
                } else
                    this.ejectInterval && (clearInterval(this.ejectInterval),
                    this.ejectInterval = !1)
            }
        }, {
            key: "split",
            value(n) {
                //_.send(),
                Q.split(n)
            }
        }, {
            key: "doubleSplit",
            value() {
                const e = this
					, n = A.controllingTab
					/*, c = {
						x: _.canvasX,
						y: _.canvasY
					}*/
                this.split(n),
                setTimeout(()=>{
                    e.split(n)
                }, 1)
            }
        }, {
            key: "split16",
            value() {
                const e = this
					, n = A.controllingTab
					/*, c = {
						x: _.canvasX,
						y: _.canvasY
					}*/
                this.split(n),
                setTimeout(()=>{
                    e.split(n);
                }, 1),
                setTimeout(()=>{
                    e.split(n);
                }, 2),
                setTimeout(()=>{
                    e.split(n);
                }, 3)
            }
        }, {
            key: "commander",
            value() {
                let offset = A.controllingTab === 1 ? G.offset : G.offset2;
                let clientX = _.canvasX - offset.x;
                let clientY = _.canvasY - offset.y;
                let str = `{"type":"cmder","x":${clientX},"y":${clientY},"date":${Date.now()}}`;
                //console.log(str);
                _e.message(101, str, A.controllingTab);
				_es.commander();
            }
        }, {
            key: "toggleSpectate",
            value: ()=>{
                window.freeSpec = !window.freeSpec;
                W.isTurnedOn ? (W.reset(),
                W.target1.turnedOn = !1,
                W.target2.turnedOn = !1,
                void K.mouseViewport()) : (Q.freeSpectate(),
                L.freeSpectate ? K.mouseViewport() : K.topViewport(),
                W.target1.turnedOn = !1,
                void (W.target2.turnedOn = !1))
            }
        }, {
            key: "chat",
            value() {
                w.enter()
            }
        }, {
            key: "toggleHUDs",
            value() {
                settings.hideHUDs = settings.hideHUDs === "on" ? "off" : "on",
				settings.toggleHUDs()
            }
        }, {
            key: "command",
            value(e) {
                let t = u["command" + e];
                if (t.includes("%sector%")) {
                    const e = G.getLocation(L.x, L.y);
                    t = t.replace("%sector%", e)
                }
                _e.message(102, t, A.controllingTab);
                _es.chat(2, t);
            }
        }, {
            key: "setZoom",
            value(e) {
                L.targetViewport = e
            }
        }, {
            key: "toggleCellNick",
            value() {
                const e = c.get("settings", "cellNick");
                settings.cellNick = "off" === settings.cellNick ? "off" !== e && e || "on" : "off"
            }
        }, {
            key: "toggleCellMass",
            value() {
                const e = c.get("settings", "cellMass");
                const _e = c.get("settings", "hideOwnMass");
                settings.cellMass = "off" === settings.cellMass ? "off" !== e && e || "shortened" : "off";
                settings.hideOwnMass = "off" === settings.hideOwnMass ? "off" !== _e && _e || "on" : "off";
            }
        }, {
            key: "toggleGameFood",
            value() {
                const e = c.get("settings", "food");
                settings.food = "off" === settings.food ? "off" !== e && e || "monoColored" : "off"
            }
        }, {
            key: "toggleBGsectors",
            value() {
                const e = c.get("settings", "bgSectors");
                settings.bgSectors = "off" === settings.bgSectors ? "off" !== e && e || "normal" : "off"
            }
        }, {
            key: "toggleBGImg",
            value() {
                const e = c.get("settings", "bgImg");
                settings.bgImg = "off" === settings.bgImg ? "off" !== e && e || "on" : "off"
            }
        }, {
            key: "toggleSkin",
            value() {
                const e = c.get("settings", "urlSkins");
                settings.urlSkins = "off" === settings.urlSkins ? "off" !== e && e || "on" : "off"
            }
        }, {
            key: "toggleSplitRings",
            value() {
                const e = c.get("settings", "splitRings");
                settings.splitRings = "off" === settings.splitRings ? "off" !== e && e || "on" : "off"
            }
        }, {
            key: "toggleOpponentRings",
            value() {
                const e = c.get("settings", "opponentRings");
                settings.opponentRings = "off" === settings.opponentRings ? "off" !== e && e || "on" : "off"
            }
        }, {
            key: "togglemultiboxRing",
            value() {
                const e = c.get("settings", "multiboxRing");
                settings.multiboxRing = "off" === settings.multiboxRing ? "off" !== e && e || "on" : "off"
            }
        }, {
            key: "togglemaouCircleSkin",
            value() {
                const e = c.get("settings", "maouCircleSkin");
                settings.maouCircleSkin = "off" === settings.maouCircleSkin ? "off" !== e && e || "on" : "off"
            }
        }, {
            key: "respawn",
            value() {
				const tab = A.controllingTab
					, e = setInterval(() => {
						q.reconnect(tab);
						const _e = setInterval(() => {
							Q.myTurn = true;
							Q.spawn(tab);
							clearInterval(_e);
						}, 1000);
						clearInterval(e);
					}, 100);
            }
        }, {
            key: "multiboxTab",
            value() {
                1 === A.controllingTab ? (A.controllingTab = 2,
                !A.isAliveTab2 && (Q.myTurn = true, Q.spawn())) : (A.controllingTab = 1,
                !A.isAliveTab1 && (Q.myTurn = true, Q.spawn()))
            }
        }]),
        e
    })(),
    f = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.masterUrl = "https://webbouncer-live-v8-0.agario.miniclippt.com/v4",
            this.contentType = "application/octet-stream",
            this.xSupportProtoVersion = "15.0.3"
        }
        return _createClass(e, [{
            key: "getRegionsInfo",
            value() {
                const e = new XMLHttpRequest;
                try {
                    e.open("POST", "https://webbouncer-live-v8-0.agario.miniclippt.com/info", !1),
                    e.send();
                    return JSON.parse(e.responseText);
                } catch (e) {}
            }
        }, {
            key: "getServer",
            value(e, t) {
                if(e.indexOf('ws')>-1){
					return {endpoints:{https:e.match(/\/\/(.*)/)[1]}}
				}
                //console.log(e);
                //console.log(t);
                if (":party" === t)
                    return this.getPartyServer(e, t);
                const o = new Uint8Array(4 + e.length + 2);
                o[0] = 10,
                o[1] = 4 + e.length,
                o[2] = 10,
                o[3] = e.length;
                for (let t = 0; t < e.length; t++)
                    o[4 + t] = e.charCodeAt(t);
                o[4 + e.length] = 18,
                o[5 + e.length] = 0;
                const i = new XMLHttpRequest;
                i.open("POST", this.masterUrl + "/findServer", !1),
                this.setHeaders(i),
                i.send(o),
                m.alert("HSLO", "Searching for a party server");
                try {
                    let o = JSON.parse(i.responseText);
                    return ":party" === t && (o = this.getToken(e, t)),
                    o
                } catch (e) {}
            }
        }, {
            key: "setHeaders",
            value(e) {
                e.setRequestHeader("Accept", "text/plain"),
                e.setRequestHeader("Accept", "*/*"),
                e.setRequestHeader("Accept", "q=0.01"),
                e.setRequestHeader("Content-Type", this.contentType),
                e.setRequestHeader("x-support-proto-version", this.xSupportProtoVersion),
                e.setRequestHeader("x-client-version", "" + le.versionInt)
            }
        }, {
            key: "getTokenIP",
            value(e, t) {
                const o = new Uint8Array(4 + e.length + 6 + t.length);
                o[0] = 10,
                o[1] = e.length + 4,
                o[2] = 10,
                o[3] = e.length;
                for (let t = 0; t < e.length; t++)
                    o[4 + t] = e.charCodeAt(t);
                o[4 + e.length] = 18,
                o[5 + e.length] = 0,
                o[6 + e.length] = 26,
                o[7 + e.length] = 8,
                o[8 + e.length] = 10,
                o[9 + e.length] = 6;
                for (let i = 0; i < t.length; i++)
                    o[10 + e.length + i] = t.charCodeAt(i);
                const i = new XMLHttpRequest;
                i.open("POST", "https://webbouncer-live-v8-0.agario.miniclippt.com/v4/getToken", !1),
                this.setHeaders(i),
                i.send(o),
                m.alert("HSLO", "Joining game server " + r("#party-token").val());
                console.log("HSLO: Joining game server " + r("#party-token").val());
                try {
                    return JSON.parse(i.responseText).endpoints.https
                } catch (e) {}
            }
        }, {
            key: "createToken",
            value(e, t) {
                const o = e + t
                  , i = new Uint8Array(4 + o.length + 2);
                i[0] = 10,
                i[1] = o.length + 4,
                i[2] = 10,
                i[3] = o.length;
                for (let e = 0; e < o.length; e++)
                    i[4 + e] = o.charCodeAt(e);
                i[4 + o.length] = 18,
                i[5 + o.length] = 0;
                const s = new XMLHttpRequest;
                s.open("POST", this.masterUrl + "/createToken", !1),
                this.setHeaders(s),
                s.send(i),
                //m.alert("HSLO", "Creating game server token.");
                console.log("HSLO: Creating game server token.");
                try {
                    return !!s.responseText && JSON.parse(s.responseText).token
                } catch (e) {}
            }
        }, {
            key: "getPartyServer",
            value(e, t) {
                const o = this.createToken(e, t)
                  , i = new Uint8Array(10 + e.length + o.length);
                i[0] = 10,
                i[1] = 4 + e.length,
                i[2] = 10,
                i[3] = e.length;
                for (let t = 0; t < e.length; t++)
                    i[4 + t] = e.charCodeAt(t);
                i[4 + e.length] = 18,
                i[5 + e.length] = 0,
                i[6 + e.length] = 26,
                i[7 + e.length] = 8,
                i[8 + e.length] = 10,
                i[9 + e.length] = o.length;
                for (let t = 0; t < o.length; t++)
                    i[10 + e.length + t] = o.charCodeAt(t);
                const s = new XMLHttpRequest;
                try {
                    s.open("POST", this.masterUrl + "/getToken", !1),
                    this.setHeaders(s),
                    s.send(i)
                } catch (e) {
                    m.alert("HSLO", "Can not get game server token.");
                    console.log("HSLO: Can not get game server token.");
                } finally {
                    m.alert("HSLO", "Getting game server token.");
					console.log("HSLO: Getting gamem server token.");
				}
                try {
                    const t = JSON.parse(s.responseText);
                    return t.token = o,
                    t
                } catch (e) {
					m.alert("HSLO", "Can not get game server token.");
                    console.log("HSLO: Can not get game server token.");
				}
            }
        }]),
        e
    })()),
    g = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.addEvents(),
                this.setRegions()
            }
        }, {
            key: "addEvents",
            value() {
                const e = this;
                r("#join-party").click(()=>{
                    e.joinParty()
                }),
                r("#create-party").click(()=>{
                    e.createParty()
                })
            }
        }, {
            key: "setRegions",
            value() {
                for (var e = {
                    'wss://delta-server.glitch.me': 'Antarctic',
					'wss://delta-selffeed.glitch.me': 'Zimbabve',
                    "US-Atlanta": "North America",
                    "BR-Brazil": "South America",
                    "EU-London": "Europe",
                    "RU-Russia": "Russia",
                    "TK-Turkey": "Turkey",
                    "JP-Tokyo": "East Asia",
                    "CN-China": "China",
                    "SG-Singapore": "Oceania"
                }, t = f.getRegionsInfo().regions, o = Object.keys(e), i = "", s = 0; s < o.length; s++) {
                    const n = o[s];
                    i += '<option value="' + n + '">' + e[n] +  (t[n]? " (" + t[n].numPlayers + ")":'')+"</option>"
                }
                r("#regions").html(i)
            }
        }, {
            key: "joinParty",
            value() {
                if (!this.connectWithIp()) {
                    const e = r("#regions").val()
                      , t = this.getToken();
                    if (t) {
                        const o = f.getTokenIP(e, t);
                        console.log("IP: " + o),
                        q.init(o)
                    }
                }
            }
        }, {
            key: "createParty",
            value() {
                const e = r("#regions").val()
                  , t = r("#gamemode").val()
                  , o = f.getServer(e, t);
                if (o.token)
                    r("#party-token").val(o.token);
                else {
                    const e = o.endpoints.https.match(/live-arena-([0-9a-z]{4,8})\.agar.\io\:\d{1,5}/)
                      , i = ":teams" === t ? "TM" : ":experimental" === t ? "EXP" : "FFA";
                    e && e[1] && r("#party-token").val(i + ":" + e[1])
                }
                o.token ? q.init(o.endpoints.https/* + "?party_id=" + encodeURIComponent(o.token)*/) : q.init(o.endpoints.https)
            }
        }, {
            key: "getToken",
            value() {
                const e = r("#party-token").val().match(/\b[A-Z0-9]{6}\b/);
                if (e && e[0]) {
                    const t = e[0];
                    return r("#party-token").val(t),
                    t
                }
                r("#party-token").val(t)
                return !1
            }
        }, {
            key: "connectWithIp",
            value() {
                const e = r("#party-token").val()
                  , t = e.match(/live-arena-[0-9a-z]{5,8}\.agar.\io\:\d{1,5}/);
                if (t && t[0])
                    return q.init(t[0]),
                    r("#party-token").val(t[0]),
                    !0;
                const o = e.match(/([A-Z]{2,3}):([0-9a-z]{5,8})/);
                if (o && 3 === o.length) {
                    q.init("live-arena-" + o[2] + ".agar.io:80");
                    const e = "TM" === o[1] ? ":teams" : "EXP" === o[1] ? ":experimental" : "";
                    r("#gamemode").val(e)
                }
                r("#gamemode").val(e)
                return !1
            }
        }]),
        e
    })()),
    y = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.siteKey = "6LfjUBcUAAAAAF6y2yIZHgHIOO5Y3cU5osS2gbMl",
            this.inited = !1,
            this.container = r("#captchaWindowV2")
        }
        return _createClass(e, [{
			key: "asyncInit",
			value() {
				this.onloadCallback();
			}
		}, {
			key: "onloadCallback",
			value() {
				this.requestV3();
			}
		}, {
			key: "requestV3",
			value() {
				grecaptcha.v2mode = false;
				grecaptcha.onceLoad = true;
				this.v3widget = grecaptcha.render('captchaWindowV3', {
					'sitekey': '6LcEt74UAAAAAIc_T6dWpsRufGCvvau5Fd7_G1tY',
					'badge': "inline",
					'size': "invisible",
					'callback': () => {
						//console.log("Loaded captcha v3.")
					}
				});
			}
		}, {
            key: "display",
            value(tab) {
				//localStorage.getItem("captchaToken") && Q.captcha(localStorage.getItem("captchaToken", tab);
                const t = this;
                if (console.log("Tab " + tab + " got Captcha"),
                m.alert("Agario", "Solve reCaptcha to spawn."),
                this.container.show(),
                this.inited,
				grecaptcha.v2mode) {
                    //grecaptcha.reset();
                    //grecaptcha.reset(y.v2widget);
                    //grecaptcha.reset(y.v3widget);
                } else {
                    const o = {
                        sitekey: this.siteKey,
                        callback(o) {
							let captchaTab = A.isAliveTab1 ? 2 : 1
							console.log("Tab " + captchaTab + " Captcha Callback")
                            t.afterCheck(o, captchaTab)
                        }
                    };
                    this.v2widget = grecaptcha.render("verifyUser", o),
                    this.inited = !0,
					grecaptcha.v2mode = true
                }
            }
        }, {
            key: "afterCheck",
            value(e, t) {
				console.log("Tab " + t + " Captcha Aftercheck");
				//localStorage.setItem("captchaToken", e);
                Q.captcha(e, t),
                //grecaptcha.reset(),
				grecaptcha.reset(y.v2widget),
                //grecaptcha.reset(y.v3widget),
                this.container.hide()
            }
        }]),
        e
    })()),
    oe = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.isOpened = !1,
                this.div = r("#theme"),
                this.selectedPreset = c.get("theme", "selectedPreset") || "custom",
                this.skinBorder = ~~c.get("theme", "skinBorder") || 100,
                this.lbSize = ~~c.get("theme", "lbSize") || 110,
                this.minimapSize = ~~c.get("theme", "minimapSize") || 200,
                this.chatFontSize = ~~c.get("theme", "chatFontSize") || 14,
                this.chatroomSize = ~~c.get("theme", "chatroomSize") || 50,
                this.cellTransparency = ~~c.get("theme", "cellTransparency") || 100,
                this.lightenCellColor = ~~c.get("theme", "lightenCellColor") || 100,
                this.borderWidth = ~~c.get("theme", "borderWidth") || 60,
                this.borderColor = c.get("theme", "borderColor") || "#ffffff",
                this.team1color = c.get("theme", "team1color") || "#aeaeae",
                this.team2color = c.get("theme", "team2color") || "#ff171f",
                this.multiboxActive = c.get("theme", "multiboxActive") || "#ff61f8",
                this.multiboxInactive = c.get("theme", "multiboxInactive") || "#ffffff",
                this.borderGlow = c.get("theme", "borderGlow") || "#ff0066",
                this.virusGlow = c.get("theme", "virusGlow") || "#ff0066",
                this.foodGlow = c.get("theme", "foodGlow") || "#ff0066",
                this.multiboxRingWidth = ~~c.get("theme", "multiboxRingWidth") || 10,
                this.nickColor = c.get("theme", "nickColor") || "#ffffff",
                this.nickStrokeColor = c.get("theme", "nickStrokeColor") || "#000",
                this.cellNickSize = ~~c.get("theme", "cellNickSize") || 120,
                this.nickFont = c.get("theme", "nickFont") || "ubuntu",
                this.massColor = c.get("theme", "massColor") || "#ffffff",
                this.massStrokeColor = c.get("theme", "massStrokeColor") || "#000",
                this.cellMassSize = ~~c.get("theme", "cellMassSize") || 150,
                this.massFont = c.get("theme", "massFont") || "ubuntu",
                this.gridWidth = ~~c.get("theme", "gridWidth") || 100,
                this.borderGlowSize = ~~c.get("theme", "borderGlowSize") || 20,
                this.borderGlowStrength = ~~c.get("theme", "borderGlowStrength") || 1,
                this.virusGlowSize = ~~c.get("theme", "virusGlowSize") || 20,
                this.virusGlowStrength = ~~c.get("theme", "virusGlowStrength") || 1,
                this.foodGlowSize = ~~c.get("theme", "foodGlowSize") || 20,
                this.foodGlowStrength = ~~c.get("theme", "foodGlowStrength") || 1,
                this.gridColor = c.get("theme", "gridColor") || "#111",
                this.gridTextColor = c.get("theme", "gridTextColor") || "#111",
                this.gridTextSize = c.get("theme", "gridTextSize") || 1500,
                this.gridTextFont = c.get("theme", "gridTextFont") || "ubuntu",
                this.foodSize = ~~c.get("theme", "foodSize") || 1,
                this.foodColor = c.get("theme", "foodColor") || "#6111ff",
                this.virusColor = c.get("theme", "virusColor") || "#8f8f8f",
                this.virusBorderColor = c.get("theme", "virusBorderColor") || "#c2c2c2",
                this.virusBorderWidth = ~~c.get("theme", "virusBorderWidth") || 10,
                this.commanderColor = c.get("theme", "commanderColor") || "#f5e35d",
                this.backgroundColor = c.get("theme", "backgroundColor") || "#000000",
                this.indicatorSize = ~~c.get("theme", "indicatorSize") || 100,
                this.cursor = c.get("theme", "cursor") || 13,
				this.cursorLineColor = c.get("theme", "cursorLineColor") || "#ffffff",
                this.ghostColor = c.get("theme", "ghostColor") || "#ffae00",
                this.selfColor = c.get("theme", "selfColor") || "#ffffff",
                this.selfViewportColor = c.get("theme", "selfViewportColor") || "#ffffff",
                this.selfViewportAlpha = c.get("theme", "selfViewportAlpha") || 1,
                this.topViewportColor = c.get("theme", "topViewportColor") || "#ff0000",
                this.topViewportAlpha = c.get("theme", "topViewportAlpha") || 3,
                this.teammateColor = c.get("theme", "teammateColor") || "#555",
                this.teammateNameColor = c.get("theme", "teammateNameColor") || "#ffffff",
                this.customBG = c.get("theme", "customBG") || "https://i.imgur.com/H7oaPKw.png",
                this.customLB = c.get("theme", "customLB") || "HSLO",
                this.customMB = c.get("theme", "customMB") || `<iframe width="1280" height="545" src="https://www.youtube.com/embed/1bWXRDvfrs4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
                this.customBotsName = c.get("theme", "customBotsName") || "Test",
				this.botsAmount = c.get("theme", "botsAmount") || 150,
				this.maouCircleSkinURL = c.get("theme", "maouCircleSkinURL") || "https://i.imgur.com/o2lh1Xh.png",
				this.everyoneSkinsURL = c.get("theme", "everyoneSkinsURL") || "https://i.imgur.com/I5xg15l.png",
				this.multiboxShieldURL = c.get("theme", "multiboxShieldURL") || "https://i.imgur.com/NOP273q.png",
				this.globalRotationSpeed = c.get("theme", "globalRotationSpeed") || 10,
				this.spyPrefix = c.get("theme", "spyPrefix") || "*",
				this.lbColor = c.get("theme", "lbColor") || "#ffff00",
                this.addPresets(),
                this.setDomValues(),
                this.addEvents()
            }
        }, {
            key: "setDomValues",
            value() {
                r(".theme-options").each(function() {
                    const t = r(this).attr("type");
                    "range" === t ? e.handleRange(this, 2) : "options" === t ? e.handleOptions(this, 2) : "colorpicker" === t ? e.initColorpicker(this) : "text" === t && e.handleText(this);
                }),
                this.setChatFontSize(this.chatFontSize),
                this.setChatroomSize(this.chatroomSize),
				this.setBackground(this.backgroundColor),
                this.setLeaderboard(this.lbSize, this.customLB, this.lbColor),
				this.setMusicBox(this.customMB),
				this.setTexture("customBG", this.customBG),
				this.setTexture("maouCircleSkinURL", this.maouCircleSkinURL),
				this.setTexture("everyoneSkinsURL", this.everyoneSkinsURL),
				this.setTexture("multiboxShieldURL", this.multiboxShieldURL),
				this.setGlobalRotationSpeed(this.globalRotationSpeed),
                this.setMinimap(this.minimapSize),
                this.setCursor(this.cursor)
            }
        }, {
            key: "addEvents",
            value() {
                const t = this;
                r(".theme-container").perfectScrollbar(),
                r(".theme-container .fa-chevron-left").each(function() {
                    const t = this;
                    r(this).click(()=>{
                        const o = r(t).parent()
                          , i = r(o).attr("type");
                        "options" === i ? e.handleOptions(o, 0) : "range" === i && e.handleRange(o, 0)/* : "text" === i && e.handleText(o, 0)*/;
                    }
                    )
                }),
                r(".theme-container span.outer").each(function() {
                    const t = this;
                    r(this).click(o=>{
                        const i = r(t).parent();
                        e.handleRange(i, 3, o.offsetX)
                    }
                    )
                }),
                r(".theme-container .fa-chevron-right").each(function() {
                    const t = this;
                    r(this).click(()=>{
                        const o = r(t).parent()
                          , i = r(o).attr("type");
                        "options" === i ? e.handleOptions(o, 1) : "range" === i && e.handleRange(o, 1)/* : e.handleText(o, 1)*/;
                    })
                }),
                r(".theme-close").click(()=>t.close())
            }
        }, {
            key: "toggle",
            value() {
                this.isOpened ? this.close() : this.open()
            }
        }, {
            key: "close",
            value() {
                this.isOpened = !1,
                this.div.fadeOut(250)
            }
        }, {
            key: "open",
            value() {
                this.isOpened = !0,
                this.div.fadeIn(250)
            }
        }, {
            key: "handleOptions",
            value(e, t) {
                for (var o, i = r(e).attr("name"), s = r(e).find("b"), n = s.length, a = n, l = 0; a--; )
                    o = s[a],
                    "active" === r(o).attr("class") && (l = a);
                if (1 === t) {
                    const e = l + 1 < n ? l + 1 : 0;
                    r(s[l]).removeAttr("class"),
                    r(s[e]).attr("class", "active");
                    const t = r(s[e]).attr("value");
                    this.saveTheme(i, t)
                } else if (0 === t) {
                    const e = 0 < l ? l - 1 : n - 1;
                    r(s[l]).removeAttr("class"),
                    r(s[e]).attr("class", "active");
                    const t = r(s[e]).attr("value");
                    this.saveTheme(i, t)
                } else if (2 === t) {
                    r(s[l]).removeAttr("class");
                    for (let e, t = n; t--; )
                        if (e = s[t],
                        r(e).attr("value") === this[i]) {
                            r(e).attr("class", "active");
                            break
                        }
                }
            }
        }, {
            key: "handleRange",
            value(e, t) {
                const o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0
                  , i = r(e).attr("name")
                  , s = r(e).find("span")
                  , n = s[0]
                  , a = s[1]
                  , l = r(s[2])
                  , h = ~~r(n).attr("min")
                  , c = ~~r(n).attr("max")
                  , _ = ~~r(n).attr("step")
                  , d = ~~r(n).attr("value");
                if (1 === t && d + _ <= c) {
                    const e = _ + d;
                    r(n).attr("value", e),
                    r(a).css("width", ~~(100 * (e - h) / (c - h)) + "px"),
                    l.text("[" + e + "]"),
                    this.saveTheme(i, ~~e)
                } else if (0 === t && d - _ >= h) {
                    const e = d - _;
                    r(n).attr("value", e),
                    r(a).css("width", ~~(100 * (e - h) / (c - h)) + "px"),
                    l.text("[" + e + "]"),
                    this.saveTheme(i, ~~e)
                } else if (2 === t) {
                    const e = this[i];
                    r(n).attr("value", e),
                    r(a).css("width", ~~(100 * (e - h) / (c - h)) + "px"),
                    l.text("[" + e + "]")
                } else if (3 === t) {
                    let e = 0 | o / 100 * (c - h);
                    e = (0 | e / _) * _;
                    const t = 100 * ((e += h) - h) / (c - h);
                    r(n).attr("value", e),
                    r(a).css("width", ~~t + "px"),
                    l.text("[" + e + "]"),
                    this.saveTheme(i, ~~e)
                }
            }
        }, {
            key: "handleText",
            value(e, t) {
				if (!t) {
					const _e = e.children[0]
						, _t = r(e).attr("name");
					_e.value = this[_t];
					_e.addEventListener("change", () => {
						this.saveTheme(_t, _e.value);
						//console.log(_e.value);
					});
				} else if (t === 0) {
					//preserved
				};
            }
        }, {
            key: "initColorpicker",
            value(e) {
                const t = this
                  , o = r(e).find("input")
                  , i = o.attr("id")
                  , s = this[i];
                r(o).val(s);
                const n = !!~~o.attr("opacity");
                r("#" + i).minicolors({
                    opacity: n,
                    position: "bottom right",
                    change(e) {
                        t.saveTheme(i, e)
                    }
                })
            }
        }, {
            key: "saveTheme",
            value(e, t) {
                this[e] = t,
				c.set("theme", e, t),
                "selectedPreset" === e ? this.selectPreset(t) : "custom" !== this.selectedPreset && (this.selectedPreset = "custom",
                c.set("theme", "selectedPreset", "custom"),
                this.setDomValues()),
                "backgroundColor" === e && this.setBackground(t),
                "chatFontSize" === e && this.setChatFontSize(t),
                "chatroomSize" === e && this.setChatroomSize(t),
				"lbSize" === e && this.setLeaderboard(t, this.customLB, this.lbColor),
				"lbColor" === e && this.setLeaderboard(this.lbSize, this.customLB, t),
				"customLB" === e && this.setLeaderboard(this.lbSize, t, this.lbColor),
				"customMB" === e && this.setMusicBox(t),
				"customBG" === e && this.setTexture(e, t),
				"maouCircleSkinURL" === e && this.setTexture(e, this.maouCircleSkinURL),
				"everyoneSkinsURL" === e && this.setTexture(e, this.everyoneSkinsURL),
				"multiboxShieldURL" === e && this.setTexture(e, this.multiboxShieldURL),
				"globalRotationSpeed" === e && this.setGlobalRotationSpeed(t),
                "minimapSize" === e && this.setMinimap(t),
                "cursor" === e && this.setCursor(t),
                "massFont" === e && P.setMassCtxFont(),
                "nickFont" === e && P.setNickCtxFont(),
                "massStrokeColor" === e && (P.massCaches.clear(), Pm.reset())
                "nickStrokeColor" === e && P.nickCaches.clear(),
                "massColor" === e && (P.massCaches.clear(), Pm.reset()),
                "nickColor" === e && P.nickCaches.clear(),
				"customBotsName" === e && (window.bots.name = this.customBotsName),
				"botsAmount" === e && (window.bots.amount = this.botsAmount),
				("foodColor" === e || "foodSize" === e || "foodGlow" === e || "foodGlowSize" === e || "foodGlowStrength" === e) && H.init(),
				("borderColor" === e || "borderWidth" === e || "borderGlow" === e || "borderGlowSize" === e || "borderGlowStrength" === e) && be.init(),
				("virusColor" === e || "virusBorderWidth" === e || "virusBorderColor" === e || "virusGlow" === e || "virusGlowSize" === e || "virusGlowStrength" === e) && de.init()
            }
        }, {
            key: "setBackground",
            value(e) {
                r("body").css("background", e),
                re.renderer.backgroundColor = parseInt(e.slice(1), 16)
            }
        }, {
            key: "setChatFontSize",
            value(e) {
                r("#notifications").css("font-size", e + "px"),
                r("span.chattime").css("font-size", ~~(e * 12 / 14) + "px"),
                r("span.nick").css("font-size", e + "px"),
                r("span.message").css("font-size", e + "px"),
				m.chatroomdiv.scrollTop(m.chatroomdiv[0].scrollHeight)
            }
        }, {
            key: "setChatroomSize",
            value(e) {
                r("#chatroom").css("width", ~~(e / 100 * 500) + "px"),
                r("#chatroom").css("height", ~~(e / 100 * 560) + "px"),
				m.chatroomdiv.scrollTop(m.chatroomdiv[0].scrollHeight)
            }
        }, {
            key: "setLeaderboard",
            value(e, _e, __e) {
                const t = e / 100;
                r("#leaderboard-head").css("font-size", (0 | 24 * t) + "px"),
                r("#leaderboard-positions").css("font-size", (0 | 13 * t) + "px"),
				r("#leaderboard-head").html(_e),
				r("#leaderboard-head").css("color", __e)
            }
        }, {
            key: "setMusicBox",
            value(e) {
				e && e.indexOf("iframe") !== -1 && (document.getElementById("musicPlayer").innerHTML = oe.customMB)
            }
        }, {
            key: "setTexture",
            value(e, t) {
				e === "customBG" && t && t.indexOf("imgur") !== -1 && re.getBGImg(t),
				e === "maouCircleSkinURL" && t && t.indexOf("imgur") !== -1 && re.getMaouImg(t),
				e === "everyoneSkinsURL" && t && t.indexOf("imgur") !== -1 && re.getEveryoneSkin(t),
				e === "multiboxShieldURL" && t && t.indexOf("imgur") !== -1 && re.getMultiboxShield(t)
            }
        }, {
            key: "setGlobalRotationSpeed",
            value(e) {
				e && (re.globalRotationSpeed = e)
            }
        }, {
            key: "setMinimap",
            value(e) {
                S.size = e,
                S.canvas.width = e,
                S.canvas.height = e,
                r("#minimap-hud, .minimap-grid").css({
                    width: e + "px",
                    height: e + "px"
                }),
                r(".minimap-row").css({
                    width: e + "px",
                    height: (0 | e / 5) + "px"
                }),
                r(".minimap-sector").css({
                    width: (0 | e / 5) + "px",
                    height: (0 | e / 5) + "px",
                    "font-size": (0 | 15 * e / 200) + "px",
                    "padding-top": (0 | 11 * e / 200) + "px"
                }),
                r(".minimap-head").css("bottom", e + 9 + "px"),
                r("#time-hud").css("font-size", ~~(e / 15) + "px")
            }
        }, {
            key: "setCursor",
            value: e=>1 === e ? (r("body").css("cursor", "url(),auto"),
            r("#cursorOff").show(),
            void r("#cursorDisplay").hide()) : (r("body").css("cursor", "url(https://jimboy3100.github.io/cursors/cursor_" + (9 < e ? e : "0" + e) + ".cur),auto"),
            r("#cursorDisplay").attr("src", "https://jimboy3100.github.io/cursors/cursor_" + (9 < e ? e : "0" + e) + ".cur"),
            r("#cursorDisplay").show(),
            void r("#cursorOff").hide())
        }, {
            key: "selectPreset",
            value(e) {
                const t = this.presets[e];
                if ("custom" !== e && t) {
                    for (const e in t.theme)
                        t.theme.hasOwnProperty(e) && void 0 !== this[e] && (this[e] = t.theme[e],
                        c.set("theme", e, this[e]));
                    for (const e in this.setDomValues(),
                    t.settings)
                        t.settings.hasOwnProperty(e) && void 0 !== settings[e] && (settings[e] = t.settings[e],
                        c.set("settings", e, settings[e]));
                    settings.setDomValues()
                }
            }
        }, {
            key: "addPresets",
            value() {
                this.presets = {
                    /*"KB Theme": {
                        author: "YueAgar_c",
                        theme: {
                            skinBorder: 100,
                            lbSize: 110,
                            minimapSize: 200,
                            chatFontSize: 18,
                            cellTransparency: 100,
                            lightenCellColor: 100,
                            borderWidth: 100,
                            borderColor: "#00a2ff",
                            borderGlow: "#00a2ff",
                            borderGlowSize: 25,
                            team1color: "#ff006e",
                            team2color: "#00c2ff",
                            nickColor: "#212121",
                            nickStrokeColor: "#FFFFFF",
                            cellNickSize: 140,
                            nickFont: "ubuntu",
                            massColor: "#212121",
                            massStrokeColor: "#FFFFFF",
                            cellMassSize: 140,
                            massFont: "ubuntu",
                            gridWidth: 100,
                            gridColor: "#00a2ff",
                            gridTextColor: "#1a1a1a",
                            gridTextSize: 1700,
                            gridTextFont: "ubuntu",
                            foodSize: 5,
                            foodColor: "#00a2ff",
                            foodGlowSize: 25,
                            foodGlow: "#00a2ff",
                            virusColor: "#696969",
                            virusBorderColor: "#9e9e9e",
                            virusGlow: "#00a2ff",
                            virusBorderWidth: 7,
                            virusGlowSize: 25,
                            commanderColor: "#FFFFFF",
                            backgroundColor: "#000000",
                            indicatorSize: 100,
                            cursor: 7
                        },
                        settings: {
                            CellAnimation: 150,
                            eatAnimation: "on",
                            cellTextAnimation: "on",
                            food: "monoColored",
                            bgSectors: "fantasy",
                            virusMass: "fill",
                            borderGlow: "on",
                            virusGlow: "on",
                            foodGlow: "on",
                            maouCircleSkin: "on"
                        }
                    },*/
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000",
                            cellNickSize: 140,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000",
                            cellNickSize: 130,
                            nickFont: "sans-serif",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000",
                            cellNickSize: 120,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000",
                            cellNickSize: 100,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000",
                            cellNickSize: 110,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000",
                            cellNickSize: 110,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000",
                            cellNickSize: 120,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000000",
                            cellNickSize: 110,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000000",
                            cellNickSize: 110,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
                            nickColor: "#ffffff",
                            nickStrokeColor: "#000000",
                            cellNickSize: 110,
                            nickFont: "ubuntu",
                            massColor: "#ffffff",
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
        }]),
        e
    })(),
    window.classoe = oe,
    m = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.div = r("#notifications"),
                this.duration = 1e4,
                this.animDuration = 500,
                this.iconChat = '<i class="fa fa-comment"></i>',
                this.iconAlert = '<i class="fa fa-exclamation-circle"></i>',
                this.iconBell = '<i class="fa fa-bell"></i>',
                this.chatroomdiv = r("#chatroom"),
                this.emojiPath = "https://hslo.yueagar.ml/emojis/",
                this.emojis = {
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
                },
                this.displayEmojis()
            }
        }, {
            key: "displayEmojis",
            value() {
                const e = r("#emojiContainer")
                  , t = t=>{
                    const o = r('<img src="https://hslo.yueagar.ml/emojis/' + this.emojis[t] + '" class="emojiPreview">');
                    o.click(()=>{
                        const e = r("#message")
                          , o = e.val();
                        e.val(o + " " + t),
                        w.input.focus()
                    }
                    ),
                    e.append(o)
                };
                for (const e in this.emojis)
                    t(e)
            }
        }, {
            key: "normal",
            value(e, t) {
                if ("on" === settings.sounds && U.playChat(),
                this.chatroom(e, t, this.iconChat),
                "chatroom" !== settings.chatType) {
                    const o = '<div><div class="normal">' + this.iconChat + '<span class="nick">' + e + '</span><span class="message">' + this.putEmojis(this.cleanMessages(t)) + "</span></div></div>";
                    this.append(o)
                }
            }
        }, {
            key: "command",
            value(e, t) {
                if ("on" === settings.sounds && U.playCmd(),
                this.chatroom(e, t, this.iconAlert),
                "chatroom" !== settings.chatType) {
                    const o = '<div><div class="command">' + this.iconAlert + '<span class="nick">' + e + '</span><span class="message">' + this.cleanMessages(t) + "</span></div></div>";
                    this.append(o)
                }
            }
        }, {
            key: "alert",
            value(e, t) {
                if ("on" === settings.sounds && U.playAlert(),
                this.chatroom(e, t, this.iconBell),
                "chatroom" !== settings.chatType) {
                    const o = '<div><div class="alert">' + this.iconBell + '<span class="nick">' + e + '</span><span class="message">' + this.cleanMessages(t) + "</span></div></div>";
                    this.append(o)
                }
            }
        }, {
            key: "append",
            value(e) {
                const t = this
                  , o = r(e);
                o.slideUp(0),
                o.appendTo(this.div),
                o.slideDown(this.animDuration),
                setTimeout(()=>{
                    o.slideUp(t.animDuration, ()=>{
                        o.remove()
                    }
                    )
                }, this.duration)
            }
        }, {
            key: "cleanMessages",
            value(e) {
				return e//.replace(/</g, "(").replace(/>/g, ")").replace(/&/g, "and")
			}
        }, {
            key: "putEmojis",
            value(e) {
                for (const t in this.emojis) {
                    const o = new RegExp(t,"g");
                    e = e.replace(o, '<img src="' + (this.emojiPath + this.emojis[t]) + '">')
                }
                return e
            }
        }, {
            key: "chatroom",
            value(e, t, o) {
                const i = new Date
                  , s = (9 < i.getHours() ? i.getHours() : "0" + i.getHours()) + ":" + (9 < i.getMinutes() ? i.getMinutes() : "0" + i.getMinutes());
                this.chatroomdiv.append('<div class="chatroom-row"><span class="chattime">' + s + "</span> " + o + ' <span class="nick">' + e + '</span> <span class="message">' + this.putEmojis(this.cleanMessages(t)) + "</span></div>"),
				oe.setChatFontSize(oe.chatFontSize),
                this.chatroomdiv.scrollTop(this.chatroomdiv[0].scrollHeight)
            }
        }]),
        e
    })(),
    window.toaster = m;
    const U = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.chatSound = new Audio("https://jimboy3100.github.io/sounds/notification_01.mp3") || {
                    play: ()=>{}
                },
                this.cmdSound = new Audio("https://cdn.ogario.ovh/static/sounds/notification_02.mp3") || {
                    play: ()=>{}
                },
                this.alertSound = new Audio("https://jimboy3100.github.io/sounds/chat-message.mp3") || {
                    play: ()=>{}
                }
            }
        }, {
            key: "playChat",
            value() {
                const e = this.chatSound.play();
                void 0 !== e && e.then(()=>{}).catch(()=>{})
            }
        }, {
            key: "playCmd",
            value() {
                const e = this.cmdSound.play();
                void 0 !== e && e.then(()=>{}).catch(()=>{})
            }
        }, {
            key: "playAlert",
            value() {
                const e = this.alertSound.play();
                void 0 !== e && e.then(()=>{}).catch(()=>{})
            }
        }]),
        e
    })()
      , $ = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.loggedIn = !1,
            this.token = "",
            this.button = r("#login-facebook"),
            this.options = {
                appId: 677505792353827,
                cookie: !0,
                xfbml: !0,
                status: !0,
                version: "v2.10"
            },
            this.setDomElements()
        }
        return _createClass(e, [{
            key: "setDomElements",
            value() {
                const e = this;
                r("#login-facebook").click(()=>{
                    e.login()
                }),
                r("#logout").click(()=>{
                    e.logout()
                }),
                s.FB ? FB.init(this.options) : m.alert("Facebook", p.current.notif.sdk_error)
            }
        }, {
            key: "init",
            value() {
                const e = c.get("extras", "fbToken");
                if (e) {
                    const t = Date.now();
                    return e.expiry < t ? void c.set("extras", "fbToken", "") : (this.token = e.token,
                    this.loggedIn = !0,
                    this.button.addClass("active"),
                    void m.alert("Facebook", p.current.notif.login_lastSession),
					Q.freeCoins(settings.primaryGoogle === "on" ? 2 : 1))
                }
            }
        }, {
            key: "login",
            value() {
                const e = this;
                return this.loggedIn ? void m.alert("Facebook", p.current.notif.logged) : void (s.FB ? s.FB.login(t=>{
                    e.afterLogin(t)
                }, {
                    scope: "public_profile, email"
                }) : m.alert("Facebook", p.current.notif.sdk_error))
            }
        }, {
            key: "afterLogin",
            value(e) {
                e.authResponse ? (this.token = e.authResponse.accessToken,
                c.set("extras", "fbToken", {
                    token: this.token,
                    expiry: Date.now() + 1e3 * e.authResponse.expiresIn
                }),
                this.loggedIn = !0,
                this.button.addClass("active"),
                Q.fbToken(settings.primaryGoogle === "on" ? 2 : 1),
                m.alert("Facebook", p.current.notif.login_success),
				Q.freeCoins(settings.primaryGoogle === "on" ? 2 : 1)) : m.alert("Facebook", p.current.notif.login_error)
            }
        }, {
            key: "logout",
            value() {
                const e = this;
                this.loggedIn && /*s.FB.logout(t=>{
					t.authResponse && (e.loggedIn = !1,
                    e.token = null,
					Q.triedCoins = !1,
                    e.button.removeClass("active"),
                    m.alert("Facebook", p.current.notif.logout),
                    c.set("extras", "fbToken", ""))
				})*/(s.FB.logout,
				e.loggedIn = !1,
				e.token = null,
				settings.primaryGoogle === "on" ? (Q.triedCoins2 = !1) : (Q.triedCoins = !1),
                e.button.removeClass("active"),
				m.alert("Facebook", p.current.notif.logout),
                c.set("extras", "fbToken", ""))
            }
        }]),
        e
    })())
      , ee = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                const e = this;
                this.loggedIn = !1,
                this.token = null;
                const t = c.get("extras", "googleToken");
                t && (t.expiry > Date.now() ? (this.token = t.token,
                this.loggedIn = !0,
                r("#login-google").addClass("active"),
                Q.googleToken(settings.primaryGoogle === "on" ? 1 : 2),
                m.alert("Google+", p.current.notif.login_lastSession),
				Q.freeCoins(settings.primaryGoogle === "on" ? 1 : 2)) : c.set("extras", "googleToken", !1)),
                s.gapi ? s.gapi.load("auth2", ()=>{
                    const t = gapi.auth2.init({
                        client_id: "686981379285-oroivr8u2ag1dtm3ntcs6vi05i3cpv0j.apps.googleusercontent.com",
                        cookiepolicy: "single_host_origin"
                    })
                      , o = h.getElementById("login-google");
                    t.attachClickHandler(o, {}, t=>{
                        e.afterLogin(t)
                    }
                    , e=>{
                        console.log(e)
                    }
                    )
                }) : m.alert("Google+", p.current.notif.sdk_error),
                r("#logout").click(()=>{
                    e.logout()
                })
            }
        }, {
            key: "afterLogin",
            value(e) {
                const t = e.getAuthResponse(!0)
                  , o = t.id_token;
                o ? (this.token = o,
                c.set("extras", "googleToken", {
                    token: this.token,
                    expiry: t.expires_at
                }),
                this.loggedIn = !0,
                r("#login-google").addClass("active"),
                Q.googleToken(),
                m.alert("Google+", p.current.notif.login_success),
				Q.freeCoins(settings.primaryGoogle === "on" ? 1 : 2)) : m.alert("Google+", p.current.notif.login_error)
            }
        }, {
            key: "logout",
            value() {
                if (this.loggedIn) {
                    gapi.auth2.getAuthInstance().signOut(),
                    this.loggedIn = !1,
					settings.primaryGoogle === "on" ? (Q.triedCoins = !1) : (Q.triedCoins2 = !1),
                    this.token = null,
                    r("#login-google").removeClass("active"),
                    m.alert("Google+", p.current.notif.logout),
                    c.set("extras", "googleToken", !1)
                }
            }
        }]),
        e
    })()
      , te = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.html = this.getHTML(1),
                this.dataHTML = this.getHTML(2),
				this.playersAmount = 0,
				this.top20Total = 0,
                this.list = new Set,
                this.div = r("#leaderboard-positions")[0],
                this.teamLB = r("#leaderboard-chart"),
                this.teamLBvisible = !1,
                this.barsCss = h.createElement("style"),
                r("head").append(this.barsCss)
            }
        }, {
            key: "add",
            value(e, t, o, i, s) {
                this.list.add({
                    nick: e,
                    position: t,
                    isSelf: o,
                    account: s,
                    isFriend: i
                })
            }
        }, {
            key: "team",
            value(e, t, o) {
                this.teamLBvisible || (this.teamLB.show(),
                this.div.innerHTML = "",
                this.teamLBvisible = !0),
                this.barsCss.innerText = ".chart-bar.red { width: " + (0 | 150 * e) + "px } .chart-bar.green { width: " + (0 | 150 * t) + "px } .chart-bar.blue { width: " + (0 | 150 * o) + "px }"
            }
        }, {
            key: "clear",
            value() {
                this.list.clear()
            }
        }, {
            key: "update",
            value() {
                this.teamLBvisible && (this.teamLB.hide(),
                this.teamLBvisible = !1);
                let e = 0;
                for (const o of this.list.values()) {
                    var t = this.html[e++];
					try {
                        if(ghostCells[0].mass==1000){
                            t.nick.innerHTML = `${this.cleanNick(o.nick)}  `;
                        }else{
                            t.nick.innerHTML = `${this.cleanNick(o.nick)} [${11 != e ? ghostCells[e - 1].mass : A.mass1}] [${11 != e ? Z.calcSector(3, ghostCells[e - 1].x, ghostCells[e - 1].y) : A.location}]`;

                        }
                        
                    } catch(e) {};
                    //[${11 != e ? Z.calcSector(3, ghostCells[e - 1].x, ghostCells[e - 1].y) : A.location}] or [${11 != e ? G.getLocation(ghostCells[e - 1].x - G.offset3.x, ghostCells[e - 1].y - G.offset3.y) : A.location}]
                    t.position.innerHTML = o.position,
                    t.hidden && (t.element.style.display = "block",
                    t.hidden = !1)
                }
				let _t = this.dataHTML[0];
				_t.dataAmount.innerHTML = this.playersAmount;
				_t.dataMass.innerHTML = this.top20Total;
                for (let t, o = e; o < this.html.length; o++)
                    (t = this.html[o]).hidden || (t.element.style.display = "none",
                    t.hidden = !0)
            }
        }, {
            key: "cleanNick",
            value: e=>e.replace(/</g, "(").replace(/>/g, ")")
        }, {
            key: "getHTML",
            value(dataType) {
                const e = []
				  , _e = []
                  , t = r(".lb-position")
				  , _t = r(".lb-data");
                for (const o of t) {
                    const t = r(o).children()
                      , i = t[0]
                      , s = t[1];
                    e.push({
                        element: o,
                        nick: i,
                        position: s,
                        hidden: !1
                    })
                }
				for (const o of _t) {
					const t = r(o).children()
						, i = t[0]
						, s = t[1]
						, _i = t[2];
					_e.push({
						element: o,
						dataAmount: i,
						dataName: s,
						dataMass: _i,
						hidden: !1
					})
				}
                if (dataType === 1) return e
				if (dataType === 2) return _e
            }
        }]),
        e
    })();
	window.te = te;
    S = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.canvas = r("#minimap-nodes")[0],
            this.ctx = this.canvas.getContext("2d"),
            this.size = 200,
            this.canvas.width = this.size,
            this.canvas.height = this.size,
            this.pi2 = 2 * Math.PI,
            this.ratio = 1,
            this.ctx.textAlign = "center",
            this.ctx.textBaseline = "bottom",
            this.ctx.lineWidth = 2
        }
        return _createClass(e, [{
            key: "run",
            value() {
                this.ratio = this.size / G.edge
                this.ctx.clearRect(0, 0, this.size, this.size),
                this.renderViewport();
                this.renderTopViewport(),
                this.renderDeathLocation(),
                this.renderGhost(),
                this.renderSelf(),
                this.renderTeammates()
            }
        }, {
            key: "renderViewport",
            value() {
                const e = L.viewBounds
                  , t = 0 | (e.left - G.offset.x + 7071) * this.ratio
                  , o = 0 | (e.top - G.offset.y + 7071) * this.ratio
                  , i = 0 | (e.right - e.left) * this.ratio
                  , s = 0 | (e.bottom - e.top) * this.ratio;
                this.ctx.globalAlpha = oe.selfViewportAlpha / 10,
                this.ctx.fillStyle = oe.selfViewportColor,
                this.ctx.fillRect(t, o, i, s)
            }
        }, {
            key: "renderTopViewport",
            value() {
                const e = I.bound3
                  , t = 0 | (e.left - G.offset.x + 7071) * this.ratio
                  , o = 0 | (e.top - G.offset.y + 7071) * this.ratio
                  , i = 0 | (e.right - e.left) * this.ratio
                  , s = 0 | (e.bottom - e.top) * this.ratio;
                this.ctx.globalAlpha = oe.topViewportAlpha / 10,
                this.ctx.fillStyle = oe.topViewportColor,
                this.ctx.fillRect(t, o, i, s);
            }
        }, {
            key: "renderDeathLocation",
            value() {
                const e = 0 | (7071 - G.offset.x + A.deathLocation.x) * this.ratio
                  , t = 0 | (7071 - G.offset.y + A.deathLocation.y) * this.ratio;
                this.ctx.globalAlpha = 1,
                this.ctx.strokeStyle = "#666",
                this.ctx.beginPath(),
                this.ctx.moveTo(e - 4, t - 4),
                this.ctx.lineTo(e + 4, t + 4),
                this.ctx.moveTo(e - 4, t + 4),
                this.ctx.lineTo(e + 4, t - 4),
                this.ctx.stroke()
            }
        }, {
            key: "renderSelf",
            value() {
                const e = 0 | (7071 - G.offset.x + L.x) * this.ratio
                  , t = 0 | (7071 - G.offset.y + L.y) * this.ratio
                  , e1 = 0 | (7071 - G.offset.x + A.x1) * this.ratio
                  , t1 = 0 | (7071 - G.offset.y + A.y1) * this.ratio
                  , e2 = 0 | (7071 - G.offset.x + A.x2) * this.ratio
                  , t2 = 0 | (7071 - G.offset.y + A.y2) * this.ratio
                  , o = A.isAlive ? 4 : 7;
                this.ctx.beginPath();
                A.isAliveTab1 ? (this.ctx.arc(e1, t1, o, 0, this.pi2, !1),
                this.ctx.moveTo(e2 + 4, t2),
                A.isAliveTab2 && this.ctx.arc(e2, t2, o, 0, this.pi2, !1)) : this.ctx.arc(e, t, o, 0, this.pi2, !1),
                this.ctx.closePath(),
                this.ctx.fillStyle = oe.selfColor,
                this.ctx.fill(),
                this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)",
                this.ctx.stroke()
            }
        }, {
            key: "renderGhost",
            value() {
				this.ctx.beginPath();
                for (let e = 0; e < ghostCells.length; e++) {
                    const t = 0 | (7071 - G.offset3.x + ghostCells[e].x) * this.ratio
                      , o = 0 | (7071 - G.offset3.y + ghostCells[e].y) * this.ratio
                      , s = ghostCells[e].size * this.ratio;
					this.ctx.moveTo(t + s, o);
                    this.ctx.arc(t, o, s, 0, this.pi2, !1);
				};
				this.ctx.closePath(),
                this.ctx.fillStyle = oe.ghostColor,
                this.ctx.fill(),
                this.ctx.strokeStyle = "rgba(0, 0, 0, 0.5)",
                this.ctx.stroke()
            }
        }, {
            key: "renderTeammates",
            value() {
                const e = this.ctx;
                e.textAlign = "center",
                e.fillStyle = oe.teammateNameColor,
                e.textBaseline = "bottom",
                e.font = "700 12px ubuntu",
                e.beginPath();
                for (const i of se.teammates.values())
                    if (i.isAlive && (2e3 < le.time - i.lastUpdateAt || 0 === i.mass) && (i.isAlive = !1),
                    i.isAlive) {
                        if (i.worldID === A.worldID || i.worldID === A.worldID2 || i.id === se.playerID || i.id === se.playerID2) {
                            void 0;
                        } else {
                            i.animate();
                            var t = i.mapX
                              , o = i.mapY;
                            e.moveTo(t + 4, o),
                            e.arc(t, o, 4, 0, this.pi2, !1),
                            0 < i.nick.length && e.fillText(i.nick, t, o - 6)
                        }
                    };
                for (const i of ses.teammates.values()) {
                    if (i.isAlive && (2e3 < le.time - i.lastUpdateAt || 0 === i.mass)) {
                        if (i.id === ses.saigoID) {
                            void 0;
                        } else {
                            i.animate();
                            var t = i.mapX
                              , o = i.mapY;
                            e.moveTo(t + 4, o),
                            e.arc(t, o, 4, 0, this.pi2, !1),
                            0 < i.nick.length && e.fillText(oe.spyPrefix + i.nick, t, o - 6)
                        }
                    }
					if (i.isAlive2 && (2e3 < le.time - i.lastUpdateAt || 0 === i.mass2)) {
                        if (i.id === ses.saigoID) {
                            void 0;
                        } else {
                            i.animate();
                            var t = i.mapX2
                              , o = i.mapY2;
                            e.moveTo(t + 4, o),
                            e.arc(t, o, 4, 0, this.pi2, !1),
                            0 < i.nick.length && e.fillText(oe.spyPrefix + i.nick2, t, o - 6)
                        }
                    }
				};
                e.closePath(),
                e.fillStyle = oe.teammateColor,
                e.strokeStyle = "rgba(0, 0, 0, 0.5)",
                e.fill(),
                e.stroke()
            }
        }]),
        e
    })()),
    v = (()=>{}),
    C = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.lastUpdateTime = 0,
            this.totalmass = 0,
            this.alive = 0,
            this.spectate = 0,
            this.html = "",
            this.temporaryArray = [],
            this.div = {
                positions: r("#teamlist-positions")[0],
                spectate: r("#teamlist-spectate span")[0],
                alive: r("#teamlist-alive span")[0],
                totalmass: r("#teamlist-totalmass span")[0]
            }
        }
        return _createClass(e, [{
            key: "update",
            value() {
                1e3 > le.time - this.lastUpdateTime || (this.lastUpdateTime = le.time,
                this.generateList(),
                this.div.positions.innerHTML = this.html,
                this.div.alive.innerHTML = this.alive,
                this.div.totalmass.innerHTML = this.totalmass,
                this.div.spectate.innerHTML = this.spectate,
                this.reset())
            }
        }, {
            key: "generateList",
            value() {
                const e = this;
                se.teammates.forEach(t=>{
					t.isAlive ? (e.totalmass += t.mass,
					e.temporaryArray.push(t),
					e.alive++) : e.spectate++;
                }),
				ses.teammates.forEach(t=>{
					if (t.id === ses.saigoID) return;
					t.isAlive ? (e.totalmass += t.mass,
					e.temporaryArray.push({
						"worldID": t.worldID,
						"nick": oe.spyPrefix + t.nick,
						"mass": t.mass,
						"skin": N.code2url(t.skin),
						"colorHex": t.colorHex
					}),
					e.alive++) : e.spectate++;
					t.isAlive2 ? (e.totalmass += t.mass2,
					e.temporaryArray.push({
						"worldID": t.worldID2,
						"nick": oe.spyPrefix + t.nick2,
						"mass": t.mass2,
						"skin": N.code2url(t.skin2),
						"colorHex": t.colorHex2
					}),
					e.alive++) : e.spectate++;
				}),
                this.temporaryArray.sort((e,t)=>t.mass - e.mass),
                this.temporaryArray.splice(5),
                A.isAliveTab1 ? (this.totalmass += A.mass1,
                this.temporaryArray.push(A.tab1Info),
                this.alive++) : this.spectate++;
				A.isAliveTab2 ? (this.totalmass += A.mass2,
				this.temporaryArray.push(A.tab2Info),
				this.alive++) : settings.multiboxMode === "on" && this.spectate++;
                for (let e = 0; e < this.temporaryArray.length; e++) {
                    const t = this.temporaryArray[e];
                    this.addPlayer(t)
                }
            }
        }, {
            key: "addPlayer",
            value(e) {
                const t = 100 * e.mass / this.totalmass;
                const f = 100 * A.mass1 / this.totalmass;
                this.html += `<div class="tl-player"><div class="tl-player-image" style="background-image: url(${e.skin ? (e.worldID === A.worldID ? N.code2url(A.skin) : e.worldID === A.worldID2 ? N.code2url(A.skin2) : e.skin) : N.code2url("O5k0G4p")}); background-color: ${e.colorHex};"></div><div class="tl-player-info"><div class="tl-player-nick">${e.worldID === A.worldID ? A.mass1 : e.mass} <i class="fas fa-volleyball-ball"></i> ${e.nick}</div><div class="tl-player-massbar"><div class="tl-player-massbar-fill" style="width: ${e.worldID === A.worldID ? f : t}%;"></div></div></div></div>`
            }
        }, {
            key: "reset",
            value() {
                this.totalmass = 0,
                this.alive = 0,
                this.spectate = 0,
                this.temporaryArray = [],
                this.html = ""
            }
        }, {
            key: "cleanNick",
            value: e=>e.replace(/</g, "(").replace(/>/g, ")")
        }]),
        e
    })()),
    w = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                const e = this;
                this.container = r("#message-hud"),
                this.input = r("#message"),
                this.isOpened = !1,
                this.isFocused = !1,
                this.input.blur(()=>{
                    e.isFocused = !1
                }),
                this.input.focus(()=>{
                    e.isFocused = !0
                }),
                this.chatroom = r("#chatroom"),
                this.chatroom.perfectScrollbar()
            }
        }, {
            key: "enter",
            value() {
                if (this.isOpened)
                    if (this.isFocused) {
                        let e = this.input.val();
                        0 < e.length && (100 < e.length && (e = e.substring(0, 100)),
                        _e.message(101, e, A.controllingTab),
                        _es.chat(1, e),
                        this.input.val("")),
                        this.input.blur(),
                        this.container.hide(),
                        this.isOpened = !1
                    } else
                        this.input.focus();
                else
                    this.container.show(),
                    this.isOpened = !0,
                    this.input.focus()
            }
        }]),
        e
    })(),
    T = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.fpsCount = 0,
            this.lastUpdateTime = 0,
            this.div = r("#stats-hud")[0],
            this.timeHud = r("#time-hud")[0],
            this.icon = {
                lockClosed: '<i class="fa fa-lock"></i>',
                lockOpened: '<i class="fa fa-unlock-alt"></i>',
                speedometer: '<i class="fa fa-tachometer-alt"></i>',
                iconPause: '<i class="fa fa-pause-circle"></i>'
            }
        }
        return _createClass(e, [{
            key: "update",
            value() {
                this.fpsCount++,
                1e3 > le.time - this.lastUpdateTime || (this.lastUpdateTime = le.time,
                this.refresh())
            }
        }, {
            key: "refresh",
            value() {
                let e = "";
                e += this.fps,
				settings.showBotNotifNCount === "on" && settings.useBots === "on" && (e += this.botCount),
                A.isAlive && (e += this.score + this.n16 + this.STE),
                e += this.PIO + this.paused + this.zoomLock,
                this.div.innerHTML = e;
                let dateObj = new Date();
                let daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                let today = daysArray[dateObj.getDay()];
                let dateFormal = `${dateObj.getFullYear()}.${dateObj.getMonth() + 1}.${dateObj.getDate()} ${(dateObj.getHours() < 10) ? "0" + dateObj.getHours() : dateObj.getHours()}:${(dateObj.getMinutes() < 10) ? "0" + dateObj.getMinutes() : dateObj.getMinutes()}:${(dateObj.getSeconds() < 10) ? "0" + dateObj.getSeconds() : dateObj.getSeconds()} (${today})`;
                this.timeHud.innerHTML = dateFormal;
            }
        }, {
            key: "zoomLock",
            get() {
                return "on" === settings.autoZoom ? this.icon.lockClosed : this.icon.lockOpened
            }
        }, {
            key: "botCount",
            get: ()=>"Bots: " + window.bots.aliveAmount + "/" + window.bots.tokenAmount + "/" + window.bots.amount + " " + (window.connection.connected ? (window.user.startedBots ? (!window.bots.captcha ? (!window.user.stoppingBots ? (window.bots.ai ? "[AI Mode]" : "[Online]") : "[Stopping]") : "[Captcha]") : "[Idle]") : "[N/A]") + "   "
        }, {
            key: "score",
            get: ()=>"Score: " + A.score + "   Mass: " + A.mass + "   "
        }, {
            key: "n16",
            get: ()=>"[" + A.n16 + "/" + (settings.multiboxMode === "on" ? "32" : "16") + "]   "
        }, {
            key: "STE",
            get() {
                const e = A.biggestPieceMass;
                return 35 < e ? "STE: " + (0 | e * (1e3 > e ? .35 : .38)) + "   " : ""
            }
        }, {
			key: "speed",
			get() {
				return A.animSpeed += (A.speed - A.animSpeed) / 3, A.speed = 0, `${this.icon.speedometer} ${0 | A.animSpeed}px/s   `
			}
		}, {
            key: "PIO",
            get() {
                const e = q.packetCount.in
                  , t = q.packetCount.out;
                return q.packetCount.in = 0,
                q.packetCount.out = 0,
                "PIO: " + e + "|" + t + "   "
            }
        }, {
            key: "paused",
            get() {
                return A.movementPaused ? "[" + this.icon.iconPause + " <strong>Paused</strong>]   " : ""
            }
        }, {
            key: "fps",
            get() {
                const e = this.fpsCount;
                return this.fpsCount = 0,
                "FPS: " + e + "   "
            }
        }]),
        e
    })()),
    F = (()=>{
        let e = (new Error).stack.trim();
        return e.substring(e.lastIndexOf("/") + 1).split(":")[0]
    }),
    K = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.container = r("#targeting-hud"),
                this.DIVno1viewport = r("#targeting-no-1"),
                this.DIVmouse = r("#targeting-mouse"),
                this.DIVplayers = r("#targeting-players"),
                this.DIVtotalmass = r("#targeting-playersMass span.mass")[0],
                this.DIVplayer1 = {
                    nick: r("#targeting-player1 span.nick")[0],
                    mass: r("#targeting-player1 span.mass")[0]
                },
                this.DIVplayer2 = {
                    nick: r("#targeting-player2 span.nick")[0],
                    mass: r("#targeting-player2 span.mass")[0]
                },
                this.lastTime = le.time
            }
        }, {
            key: "update",
            value() {
                if (!(1e3 > le.time - this.lastTime) && (this.lastTime = le.time,
                L.freeSpectate && W.isTurnedOn)) {
                    let e = 0;
                    W.target1.turnedOn ? (this.DIVplayer1.nick.innerHTML = W.target1.nick,
                    this.DIVplayer1.mass.innerHTML = W.target1.outOfView ? "OUT OF VIEW" : W.target1.mass,
                    e += W.target1.outOfView ? 0 : W.target1.mass) : (this.DIVplayer1.nick.innerHTML = "Target 1",
                    this.DIVplayer1.mass.innerHTML = "NOT SELECTED"),
                    W.target2.turnedOn ? (this.DIVplayer2.nick.innerHTML = W.target2.nick,
                    this.DIVplayer2.mass.innerHTML = W.target2.outOfView ? "OUT OF VIEW" : W.target2.mass,
                    e += W.target2.outOfView ? 0 : W.target2.mass) : (this.DIVplayer2.nick.innerHTML = "Target 2",
                    this.DIVplayer2.mass.innerHTML = "NOT SELECTED"),
                    this.DIVtotalmass.innerHTML = e
                }
            }
        }, {
            key: "show",
            value() {
                A.isAliveTab1 || A.isAliveTab2 || this.container.show()
            }
        }, {
            key: "hide",
            value() {
                this.container.hide()
            }
        }, {
            key: "topViewport",
            value() {
                this.DIVno1viewport.show(),
                this.DIVmouse.hide(),
                this.DIVplayers.hide(),
                r("#spectate-mode-top").addClass("active"),
                r("#spectate-mode-mouse").removeClass("active"),
                r("#spectate-mode-target").removeClass("active")
            }
        }, {
            key: "mouseViewport",
            value() {
                this.DIVmouse.show(),
                this.DIVno1viewport.hide(),
                this.DIVplayers.hide(),
                r("#spectate-mode-top").removeClass("active"),
                r("#spectate-mode-mouse").addClass("active"),
                r("#spectate-mode-target").removeClass("active")
            }
        }, {
            key: "targetMode",
            value() {
                this.DIVplayers.show(),
                this.DIVmouse.hide(),
                this.DIVno1viewport.hide(),
                r("#spectate-mode-top").removeClass("active"),
                r("#spectate-mode-mouse").removeClass("active"),
                r("#spectate-mode-target").addClass("active")
            }
        }]),
        e
    })(),
    z = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                U.init(),
                m.init(),
                settings.init(),
                x.init(),
                b.init(),
                g.init(),
                oe.init(),
                $.init(),
                ee.init(),
                te.init(),
                w.init(),
                K.init(),
				P.setMassUpdateInterval(),
				m.alert("HSLO", "Render using [3D Pixi.js]"),
                this.isOpened = !0,
                this.gMode = ":party",
                this.div = r("#menu-overlay"),
                this.streammode = !c.get("extras", "streammode") && [],
                this.toggleStreammode(),
                this.buttons(),
                this.versionCheck()
            }
        }, {
            key: "buttons",
            value() {
                const e = this;
                r("#button-settings").click(()=>{
                    e.closeSubMenus(),
                    settings.toggle()
                }),
                r("#button-play").click(()=>{
                    e.play()
                }),
                r("#button-spectate").click(()=>{
                    Q.spectate(3),
                    Q.spectate(1),
                    _e.death(1),
                    _e.death(2),
                    _e.join(1),
                    _e.join(2),
					_es.host(),
					_es.tag(),
                    e.close()
                }),
                r("#button-inputs").click(()=>{
                    e.closeSubMenus(),
                    x.toggle()
                }),
                r("#button-theme").click(()=>{
                    e.closeSubMenus(),
                    oe.toggle()
                }),
                r("#regions").change(()=>{
                    c.set("extras", "region", r("#regions").val())
                }),
                r("#regions").val(c.get("extras", "region") || "JP-Tokyo"),
                r("#gamemode").change(()=>{
                    c.set("extras", "gameMode", r("#gamemode").val()),
                    e.gMode = c.get("extras", "gameMode")
                }),
                r("#gamemode").val(c.get("extras", "gameMode") || ":party"),
                this.gMode = c.get("extras", "gameMode") || ":party",
                r("#minimap-show-1").click(()=>{
                    r("#minimap-show-" + S.selector).removeClass("active"),
                    r("#minimap-show-1").addClass("active"),
                    S.selector = 1
                }),
                r("#minimap-show-2").click(()=>{
                    r("#minimap-show-" + S.selector).removeClass("active"),
                    r("#minimap-show-2").addClass("active"),
                    S.selector = 2
                }),
                r("#minimap-show-0").click(()=>{
                    r("#minimap-show-" + S.selector).removeClass("active"),
                    r("#minimap-show-0").addClass("active"),
                    S.selector = 0
                }),
                r("#streamMode").click(()=>{
                    e.toggleStreammode()
                }),
                r("#spectate-mode-top").click(()=>{
                    e.spectateModeTop()
                }),
                r("#spectate-mode-mouse").click(()=>{
                    e.spectateModeMouse()
                }),
                r("#spectate-mode-target").click(()=>{
                    e.spectateModeTarget()
                }),
                r("#anouncement").click(()=>{
                    r("#anouncement").fadeOut(250)
                }),
                c.get("extras", "openedChangelog") || r("#changelog").addClass("active"),
                r("#changelog").click(()=>{
                    c.set("extras", "openedChangelog", !0),
                    r("#changelog").removeClass("active")
                })
            }
        }, {
            key: "play",
            value() {
                this.close(),
				Q.myTurn = true,
                Q.spawn()
            }
        }, {
            key: "closeSubMenus",
            value() {
                x.close(),
                settings.close(),
                oe.close()
            }
        }, {
            key: "toggle",
            value() {
                this.isOpened ? this.close() : this.open()
            }
        }, {
            key: "close",
            value() {
                this.isOpened = !1,
                this.div.fadeOut(250),
                r("#leaderboard-hud").css("top", "-2px"),
                r("#teamlist-hud").css("top", "10px"),
                r(".menu-bar").slideUp(250),
                r("#targeting-hud").css("top", "0px")
            }
        }, {
            key: "open",
            value() {
                this.isOpened = !0,
                this.div.fadeIn(250),
                r("#leaderboard-hud").css("top", "30px"),
                r("#teamlist-hud").css("top", "45px"),
                r(".menu-bar").slideDown(250),
                r("#targeting-hud").css("top", "35px")
            }
        }, {
            key: "toggleStreammode",
            value() {
                this.streammode ? (r("#nick, #nick2, #tag, #tag2, #skin, #skin2, #party-token").removeClass("input-hidden"),
                r("#streamMode").html('<i class="fas fa-eye"></i>'),
                this.streammode = !1,
                c.set("extras", "streammode", this.streammode)) : (r("#nick, #nick2, #tag, #tag2, #skin, #skin2, #party-token").addClass("input-hidden"),
                r("#streamMode").html('<i class="fas fa-eye-slash"></i>'),
                this.streammode = !0,
                c.set("extras", "streammode", this.streammode))
            }
        }, {
            key: "spectateModeTop",
            value() {
                !A.isAlive && L.isSpectating && L.freeSpectate && (K.topViewport(),
                Q.freeSpectate())
            }
        }, {
            key: "spectateModeMouse",
            value() {
                A.isAlive || !L.isSpectating || L.freeSpectate && !W.isTurnedOn || (W.isTurnedOn ? (W.target1.turnedOn = !1,
                W.target2.turnedOn = !1,
                K.mouseViewport()) : (Q.freeSpectate(),
                K.mouseViewport()))
            }
        }, {
            key: "spectateModeTarget",
            value() {
                "on" === settings.targeting ? m.command("HSLO", p.current.notif.targeting_on) : m.command("HSLO", p.current.notif.targeting_off)
            }
        }, {
            key: "versionCheck",
            value() {
                "5.4.0 (9)" !== localStorage.getItem("version") ? (console.log("Your extension is in older version."),
				this.showChangelog(),
                localStorage.setItem("version", "5.4.0 (9)"),
                c.set("extras", "version", "5.4.0 (9)")) : console.log("Great! Your extension is updated!.")
            }
        }, {
            key: "showChangelog",
            value() {
				r("#anouncement").html(`${s["lang_" + p.selected].updateHud.title}<br>${s["lang_" + p.selected].updateHud.desc}${!localStorage.getItem("version").includes("5.4.0") ? ("<br>" + s["lang_" + p.selected].updateHud.versionChange) : ""}<hr>${s["lang_" + p.selected].updateHud.updateContent}<br><hr><div align="right">2020-4-6</div>`),
                r("#anouncement").fadeIn(250)
            }
        }]),
        e
    })(),
    I = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.cellsTab1 = new Map,
                // tab 1 view cells
                this.cellsTab2 = new Map,
                // tab 2 view cells
                this.cellsTab3 = new Map,
                // tab 3 view cells
                this.cellsIDTab1 = new Set,
                // tab 1's cells id
                this.cellsIDTab2 = new Set,
                // tab 2's cells id
                this.cellsIDTab3 = new Set,
                // tab 3's cells id
                this.myCellsTab1 = new Map,
                // tab 1's cells
                this.myCellsTab2 = new Map,
                // tab 2's cells
                this.myCellsTab3 = new Map,
                // tab 3's cells
                this.bound = {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                },
                this.bound2 = {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                },
                this.bound3 = {
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0
                },
                this.sortedCells = [],
                // sortedCells
                this.food = [],
				ie.init(),
				ve.init()
            }
        }, {
            key: "update",
            value() {
				const ue = 'on' === settings.opponentRings && A.isAlive
				, fe = 'on' === settings.virusRange && A.isAlive;
                this.updateBound(),
                this.food = [],
                this.sortedCells = [],
				ve.reset(),
				ie.reset(),
                this.cellsTab1.forEach((e,t)=>{
                    if (this.updateStaticBound(e, 1),
                    e.fadeStartTime) {
                        if (1 < (le.time - e.fadeStartTime) / settings.CellAnimation)
                            return void this.cellsTab1.delete(t)
                    }
                    //window.teste1 = e,
                    this.isInView(e) && e.worldID !== A.worldID2 && (e.isFood ? this.food.push(e) : (this.sortedCells.push(e),
					ue && !e.isVirus && ie.segregator(e, 1),
					fe && e.isVirus && ve.add(e, 1)))
                }),
                this.cellsTab2.forEach((e,t)=>{
                    if (this.updateStaticBound(e, 2),
					e.fadeStartTime) {
                        if (1 < (le.time - e.fadeStartTime) / settings.CellAnimation)
                            return void this.cellsTab2.delete(t)
                    }
                    //window.teste2 = e,
                    this.isInView(e) && (e.isMine || !this.isInView2(e)) && (e.isFood ? this.food.push(e) : (this.sortedCells.push(e),
					ue && !e.isVirus && ie.segregator(e, 2),
					fe && e.isVirus && ve.add(e, 2)))
                }),
                this.cellsTab3.forEach((e,t)=>{
                    if (this.updateStaticBound(e, 3),
					e.fadeStartTime) {
                        if (1 < (le.time - e.fadeStartTime) / settings.CellAnimation)
                            return void this.cellsTab3.delete(t)
                    }
                    //window.teste3 = e,
                    this.isInView(e) && (e.isMine || (!this.isInView3(e, 1) && !this.isInView3(e, 2))) && e.worldID !== A.worldID2 && settings.topZoom === "on" && (e.isFood ? this.food.push(e) : (this.sortedCells.push(e),
					ue && !e.isVirus && ie.segregator(e, 3),
					fe && e.isVirus && ve.add(e, 3)))
                }),
				q.mapTabs.forEach(mt => {
					mt.cells.forEach((e, t) => {
						if (this.updateStaticBound(e, mt.tab),
						e.fadeStartTime) {
							if (1 < (le.time - e.fadeStartTime) / settings.CellAnimation)
								return void mt.cells.delete(t)
						}
						this.isInView(e) && e.worldID !== A.worldID && e.worldID !== A.worldID2 && !this.isInView4(e, 1) && !this.isInView4(e, 2) && !this.isInView4(e, 3) && !this.isInViewFullX(e) && !this.isInViewFullY(e) && (e.isFood ? this.food.push(e) : (this.sortedCells.push(e),
						ue && !e.isVirus && ie.segregator(e, 3),
						fe && e.isVirus && ve.add(e, 3)))
					})
				}),
                this.sortedCells.sort((e,t)=>{
                    const o = e.animRadius
                      , i = t.animRadius;
                    return o === i ? t.id - e.id : o - i
                })
            }
        }, {
            key: "getCell",
            value(e, t) {
                return (1 === t ? this.cellsTab1 : 2 === t ? this.cellsTab2 : 3 === t && this.cellsTab3).get(e) || this.addCell(e, t)
            }
        }, {
            key: "addCell",
            value(e, t) {
                const o = 1 === t ? this.cellsTab1 : 2 === t ? this.cellsTab2 : 3 === t && this.cellsTab3
                  , i = new M(e,t);
                return o.set(e, i),
                this.myCellCheck(e, i, t),
                i
            }
        }, {
            key: "myCellCheck",
            value(e, t, o) {
                const i = 1 === o ? this.cellsIDTab1 : 2 === o ? this.cellsIDTab2 : 3 === o && this.cellsIDTab3
                  , s = 1 === o ? this.myCellsTab1 : 2 === o ? this.myCellsTab2 : 3 === o && this.myCellsTab3;
                i.has(e) && (s.set(e, t),
                i.delete(e),
                t.isMine = !0,
                t.nick = 1 === o ? A.nick : 2 === o ? A.nick2 : "")
            }
        }, {
            key: "eatCell",
            value(e, t, o) {
                const i = 1 === o ? this.cellsTab1 : 2 === o ? this.cellsTab2 : 3 === o && this.cellsTab3
                  , s = 1 === o ? this.myCellsTab1 : 2 === o ? this.myCellsTab2 : 3 === o && this.myCellsTab3
                  , n = i.get(t)
                  , a = i.get(e);
                n && a && (n.staticX = a.staticX,
                n.staticY = a.staticY,
                n.radius = n.animRadius,
                n.lastUpdateTime = le.time,
                n.fadeStartTime = le.time,
                n.isMine && s.delete(t),
                i.delete(t),
                n.isFood || (setTimeout(() => {
					re.effectPoints.add({
						x: n.staticX - (n.tab === 1 ? 0 : n.tab === 2 ? G.getOffset2.x : n.tab === 3 ? G.getOffset3.x : 3 < n.tab && q.mapTabs[n.tab-4].getOffset.x),
						y: n.staticY - (n.tab === 1 ? 0 : n.tab === 2 ? G.getOffset2.y : n.tab === 3 ? G.getOffset3.y : 3 < n.tab && q.mapTabs[n.tab-4].getOffset.y),
						time: le.time,
						scale: 1/* > ~~(Math.sqrt(n.mass)/10) ? 1 : ~~(Math.sqrt(n.mass)/10)*/,
						color: n.colorObject.hex
					})
				}, 1000),
				i.set(t + ":removed", n)))
            }
        }, {
            key: "removeCell",
            value(e, t) {
                const o = 1 === t ? this.cellsTab1 : 2 === t ? this.cellsTab2 : 3 === t && this.cellsTab3
                  , i = 1 === t ? this.myCellsTab1 : 2 === t ? this.myCellsTab2 : 3 === t && this.myCellsTab3
                  , s = o.get(e);
                s && (s.isMine && i.delete(e),
                o.delete(e),
                s.isFood || "on" !== settings.eatAnimation || (s.fadeStartTime = le.time,
                o.set(e + ":removed", s)))
            }
        }, {
            key: "isInView",
            //isInView
            value(e) {
                //console.log(e.tab);
                const t = 2 === e.tab ? G.getOffset2 : 3 === e.tab ? G.getOffset3 : 3 < e.tab ? q.mapTabs[e.tab-4].getOffset : {
                    x: 0,
                    y: 0
                }
                  , o = L.viewBounds;
                return !(e.x - t.x + e.animRadius < o.left || e.x - t.x - e.animRadius > o.right || e.y - t.y + e.animRadius < o.top || e.y - t.y - e.animRadius > o.bottom)
            }
        }, {
            key: "updateBound",
            value() {
                I.cellsTab1.forEach(e=>{
                    this.bound.left = e.staticX,
                    this.bound.right = e.staticX,
                    this.bound.top = e.staticY,
                    this.bound.bottom = e.staticY
                }),
                I.cellsTab2.forEach(e=>{
                    this.bound2.left = e.staticX - G.getOffset2.x,
                    this.bound2.right = e.staticX - G.getOffset2.x,
                    this.bound2.top = e.staticY - G.getOffset2.y,
                    this.bound2.bottom = e.staticY - G.getOffset2.y
                }),
                I.cellsTab3.forEach(e=>{
                    this.bound3.left = e.staticX - G.getOffset3.x,
                    this.bound3.right = e.staticX - G.getOffset3.x,
                    this.bound3.top = e.staticY - G.getOffset3.y,
                    this.bound3.bottom = e.staticY - G.getOffset3.y
                }),
				q.mapTabs.forEach(t => {
					t.cells.forEach(e => {
						t.bound.left = e.staticX - t.getOffset.x,
						t.bound.right = e.staticX - t.getOffset.x,
						t.bound.top = e.staticY - t.getOffset.y,
						t.bound.bottom = e.staticY - t.getOffset.y
					})
				})
            }
        }, {
            key: "updateStaticBound",
            value(e, t) {
				const c = t === 2 ? G.getOffset2 : t === 3 ? G.getOffset3 : t > 3 ? q.mapTabs[t-4].getOffset : {
					x: 0,
					y: 0
				};
				if (t === 1) {
					this.bound.left > e.staticX - c.x + e.radius && (this.bound.left = e.staticX - c.x + e.radius),
					this.bound.right < e.staticX - c.x - e.radius && (this.bound.right = e.staticX - c.x - e.radius),
					this.bound.top > e.staticY - c.y + e.radius && (this.bound.top = e.staticY - c.y + e.radius),
					this.bound.bottom < e.staticY - c.y - e.radius && (this.bound.bottom = e.staticY - c.y - e.radius)
				} else if (t === 2) {
					this.bound2.left > e.staticX - c.x + e.radius && (this.bound2.left = e.staticX - c.x + e.radius),
					this.bound2.right < e.staticX - c.x - e.radius && (this.bound2.right = e.staticX - c.x - e.radius),
					this.bound2.top > e.staticY - c.y + e.radius && (this.bound2.top = e.staticY - c.y + e.radius),
					this.bound2.bottom < e.staticY - c.y - e.radius && (this.bound2.bottom = e.staticY - c.y - e.radius)
				} else if (t === 3) {
					this.bound3.left > e.staticX - c.x + e.radius && (this.bound3.left = e.staticX - c.x + e.radius),
					this.bound3.right < e.staticX - c.x - e.radius && (this.bound3.right = e.staticX - c.x - e.radius),
					this.bound3.top > e.staticY - c.y + e.radius && (this.bound3.top = e.staticY - c.y + e.radius),
					this.bound3.bottom < e.staticY - c.y - e.radius && (this.bound3.bottom = e.staticY - c.y - e.radius)
				} else if (t > 3) {
					q.mapTabs[t-4].bound.left > e.staticX - c.x + e.radius && (q.mapTabs[t-4].bound.left = e.staticX - c.x + e.radius),
					q.mapTabs[t-4].bound.right < e.staticX - c.x - e.radius && (q.mapTabs[t-4].bound.right = e.staticX - c.x - e.radius),
					q.mapTabs[t-4].bound.top > e.staticY - c.y + e.radius && (q.mapTabs[t-4].bound.top = e.staticY - c.y + e.radius),
					q.mapTabs[t-4].bound.bottom < e.staticY - c.y - e.radius && (q.mapTabs[t-4].bound.bottom = e.staticY - c.y - e.radius)
				}
            }
        }, {
            key: "isInView2",
            value(e) {
                const t = G.getOffset2
                  , o = e.staticX - t.x
                  , i = e.staticY - t.y
                  , s = this.bound;
                return !(o + e.radius < s.left || o - e.radius > s.right || i + e.radius < s.top || i - e.radius > s.bottom)
            }
        }, {
            key: "isInView3",
            value(e, f) {
                const t = G.getOffset3
                  , o = e.staticX - t.x
                  , i = e.staticY - t.y
                  , s = f === 1 ? this.bound : f === 2 && this.bound2;
                return !(o + e.radius < s.left || o - e.radius > s.right || i + e.radius < s.top || i - e.radius > s.bottom)
            }
        }, {
            key: "isInView4",
            value(e, f) {
                const t = q.mapTabs[e.tab-4].getOffset
                  , o = e.staticX - t.x
                  , i = e.staticY - t.y
                  , s = f === 1 ? this.bound : f === 2 ? this.bound2 : f === 3 && this.bound3;
                return !(o + e.radius < s.left || o - e.radius > s.right || i + e.radius < s.top || i - e.radius > s.bottom)
            }
        }, {
            key: "isInViewFullX",
            value(e) {
                const realTab = e.tab - 4
				  , t = q.mapTabs[realTab].getOffset
                  , o = e.staticX - t.x
                  , i = e.staticY - t.y
                  , s = realTab < 1 ? false : q.mapTabs[realTab-1].bound
                return s && !(o + e.radius < s.left || o - e.radius > s.right || i + e.radius < s.top || i - e.radius > s.bottom)
            }
        }, {
            key: "isInViewFullY",
            value(e) {
                const realTab = e.tab - 4
				  , t = q.mapTabs[realTab].getOffset
                  , o = e.staticX - t.x
                  , i = e.staticY - t.y
                  , s = realTab < 3 ? false : q.mapTabs[realTab-3].bound
                return s && !(o + e.radius < s.left || o - e.radius > s.right || i + e.radius < s.top || i - e.radius > s.bottom)
            }
        }]),
        e
    })()),
    window.classI = I,
    //players' cells
    M = (()=>{
        function t(o, i) {
            _classCallCheck(this, t),
            this.id = o,
            this.nick = "",
            this.skin = "",
            this.colorObject = new e.getColorObject,
            // 000301, color Object
            this.isMine = !1,
            // 000321, isMine
            this.isFood = !1,
            // 000320, isFood
            this.isEjected = !1,
            // 000319, isEjected
            this.isVirus = !1,
            // 000318, isVirus
            this.isFriend = !1,
            // 000317, isFriend
            this.account = "",
            // 000316, account
            this.tab = i,
            // 000315, tab
            this.init = !1,
            this.x = 0,
            // x, animX
            this.y = 0,
            // y, animY
            this.animRadius = 0,
            // 000314, animRadius
            this.staticX = 0,
            // 000313, x (staticX)
            this.staticY = 0,
            // 000312, y (staticY)
            this.radius = 0,
            // 000311, radius
            this.animX = 0,
            // 000310, animX
            this.animY = 0,
            // 000309, animY
            this._000308 = 0,
            // 000308, animRadius(?)
            this._000307 = 0,
            // 000307, le.time or lastUpdateTime
            this.lastUpdateTime = 0,
            // 000306, fadeStartTime(?)
            this.fadeStartTime = 0
            // 000305, fadeStartTime
        }
        return _createClass(t, [{
            key: "animate",
            value() {
                let e = (le.time - this.lastUpdateTime) / settings.CellAnimation;
                return e = 0 > e ? 0 : 1 < e ? 1 : e,
                this.x = this.animX + (this.staticX - this.animX) * e,
                this.y = this.animY + (this.staticY - this.animY) * e,
                this.animRadius = this._000308 + (this.radius - this._000308) * e,
                e
            }
        }, {
            key: "mass",
            // mass, animRadius = animRadius
            get() {
                return 0 | this.animRadius * this.animRadius / 100
            }
        }, {
            key: "staticMass",
            // static mass, radius = radius
            get() {
                return 0 | this.radius * this.radius / 100
            }
        }, {
            key: "worldID",
            get() {
                return ":party" === z.gMode ? this.nick + this.colorObject.hex : this.nick
            }
        }, {
            key: "isUnnamed",
            get() {
                return 1 > this.nick.length
            }
        }]),
        t
    })(),
    //my cells A
    A = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this._nick = r("#nick").val(),
                this._nick2 = r("#nick2").val(),
                this._skin = re.getImgurCode(r("#skin").val()),
                this._skin2 = re.getImgurCode(r("#skin2").val()),
                this._tag = r("#tag").val(),
                this._tag2 = r("#tag2").val(),
                this._colorObject = {
                    r: 0,
                    g: 0,
                    b: 0
                },
				this._colorObject2 = {
                    r: 0,
                    g: 0,
                    b: 0
                },
                this.colorObject = {
                    r: 0,
                    g: 0,
                    b: 0
                },
				this.colorObject2 = {
                    r: 0,
                    g: 0,
                    b: 0
                },
                this.colorHexTab1 = "#000000",
                this.colorHexTab2 = "#000000",
                this.isAliveTab1 = !1,
                this.isAliveTab2 = !1,
                this.x = 0,
                this.y = 0,
                this.x1 = 0,
                this.x2 = 0,
                this.y1 = 0,
                this.y2 = 0,
                this.mass1 = 0,
                this.mass2 = 0,
                this.speed = 0,
                this.animSpeed = 0,
                this.mass = 0,
                // mass 1+2
                this.biggestPieceMass = 0,
                this.score = 0,
                this.movementPaused = !1,
                this.deathLocation = {
                    x: 100,
                    y: 100
                },
                this.controlledTab = 1,
				this.tab1Info = {
					isAlive: this.isAliveTab1,
					mass: this.mass,
					skin: this._skin,
					nick: this._nick,
					colorHex: this.colorHexTab1,
					worldID: this.nick + this.colorHexTab1
				},
				this.tab2Info = {
					isAlive: this.isAliveTab2,
					mass: this.mass2,
					skin: this._skin2,
					nick: this._nick2,
					colorHex: this.colorHexTab2,
					worldID: this.nick2 + this.colorHexTab2
				}
            }
        }, {
            key: "update",
            value() {
                0 < this.pieceCount ? this.playing() : this.dead(),
                0 < this.pieceCount2 ? this.playing2() : this.dead2(),
                this.updateData()
            }
        }, {
            key: "playing",
            value() {
                if (!this.isAliveTab1) {
                    this.isAliveTab1 = !0,
                    // tab 1 spawn
                    _e.spawn(1),
					_es.alive(),
                    _e.playerData(1),
                    window.user.isAlive = !0,
                    window.user.startedBots && window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer),
                    this.isAliveTab2 || this.sendAliveData(1);
                    for (const e of I.myCellsTab1.values()) {
                        this.colorObject = e.colorObject,
                        this.colorHexTab1 = e.colorObject.hex,
						this.tab1Info.colorHex = e.colorObject.hex,
						this.tab1Info.worldID = this.nick + this.colorHexTab1,
						_es.color();
                        break
                    }
                    setTimeout(()=>{
                        re.commanderPoints.add({
                            x: A.x1,
                            y: A.y1,
                            time: Date.now(),
							scale: 10
                        })
                    }
                    , 100)
                }
            }
        }, {
            key: "playing2",
            value() {
                if (!this.isAliveTab2) {
                    this.isAliveTab2 = !0,
                    // tab 2 spawn
                    _e.spawn(2),
					_es.alive(),
                    _e.playerData(2),
                    window.user.isAlive = !0,
                    window.user.startedBots && window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer),
                    this.isAliveTab1 || this.sendAliveData(1);
                    for (const e of I.myCellsTab2.values()) {
						this.colorObject2 = e.colorObject,
                        this.colorHexTab2 = e.colorObject.hex,
						this.tab2Info.colorHex = e.colorObject.hex,
						this.tab2Info.worldID = this.nick2 + this.colorHexTab2,
						_es.color();
                        break
                    }
                    setTimeout(()=>{
                        re.commanderPoints.add({
                            x: A.x2,
                            y: A.y2,
                            time: Date.now(),
							scale: 10
                        })
                    }
                    , 100)
                }
            }
        }, {
            key: "updateData",
            value() {
                if (this.isAlive) {
                    let e = 0
                      , e2 = 0
                      , t = 0
                      , t2 = 0
                      , o = 0;
                    if (this.mass = 0,
                    this.mass1 = 0,
                    this.biggestPieceMass = 0,
                    this.isAliveTab1)
                        for (const i of I.myCellsTab1.values())
                            // tab 1 cells
                            i.animate(),
                            e += i.x / this.pieceCount,
                            t += i.y / this.pieceCount,
                            o += i.animRadius,
                            this.mass1 += i.staticMass,
                            this.mass += i.staticMass,
                            this.biggestPieceMass < i.staticMass && (this.biggestPieceMass = i.staticMass);
                    if (this.mass2 = 0,
                    this.isAliveTab2) {
                        const i = G.getOffset2;
                        for (const s of I.myCellsTab2.values())
                            // tab 2 cells
                            s.animate(),
                            e2 += (s.x - i.x) / this.pieceCount2,
                            t2 += (s.y - i.y) / this.pieceCount2,
                            o += s.animRadius,
                            this.mass2 += s.staticMass,
                            this.mass += s.staticMass,
							this.tab2Info.mass = this.mass2,
							this.tab1Info.mass = this.mass,
                            this.biggestPieceMass < s.staticMass && (this.biggestPieceMass = s.staticMass)
                    }
                    if (!this.movementPaused) {
                        const o = this.x - e
                          , i = this.y - t
                          , s = Math.sqrt(o * o + i * i);
                        this.speed += s,
                        this.x = (this.isAliveTab1 && this.isAliveTab2) ? (e + e2) / 2 : this.isAliveTab1 ? e : this.isAliveTab2 && e2,
                        this.x1 = e,
                        this.x2 = e2,
                        this.y = (this.isAliveTab1 && this.isAliveTab2) ? (t + t2) / 2 : this.isAliveTab1 ? t : this.isAliveTab2 && t2,
                        this.y1 = t,
                        this.y2 = t2
                    }
                    this.score < this.mass && (this.score = this.mass);
                    const i = Math.pow(Math.min(64 / o, 1), .4)
                      , n = Math.max(s.innerWidth / 1920, s.innerHeight / 1080);
                    L.autoZoomViewport = i * n
                }
            }
        }, {
            key: "dead",
            // tab 1 die
            value() {
                this.isAliveTab1 && (this.isAliveTab1 = !1,
                _e.death(1),
				_es.alive(),
				/*Q.openPotion(1, 1),
				setTimeout(() => { Q.openPotion(2, 1) }, 3000),
				setTimeout(() => { Q.openPotion(3, 1) }, 6000),*/
                this.isAliveTab2 ? this.controlledTab = 2 : this.reset())
            }
        }, {
            key: "dead2",
            // tab 2 die
            value() {
                this.isAliveTab2 && (this.isAliveTab2 = !1,
                _e.death(2),
				_es.alive(),
				/*Q.openPotion(1, 2),
				setTimeout(() => { Q.openPotion(2, 2) }, 3000),
				setTimeout(() => { Q.openPotion(3, 2) }, 6000),*/
                this.isAliveTab1 ? this.controlledTab = 1 : this.reset())
            }
        }, {
            key: "reset",
            value() {
                this.score = 0,
                this.mass = 0,
                this.mass1 = 0,
                this.mass2 = 0,
                this.biggestPieceMass = 0,
                this.movementPaused = !1,
                this.deathLocation.x = this.x,
                this.deathLocation.y = this.y,
                this.controlledTab = 1,
                this.sendAliveData(0),
                z.open()
            }
        }, {
            key: "sendAliveData",
            value(e) {
                e ? (_e.spawn(1),
                _e.spawn(2),
                _e.playerData(1),
                _e.playerData(2),
				_es.alive(),
				_es.color()) : (_e.death(1),
                _e.death(2),
				_es.alive()/*,
                window.user.isAlive = !1,
                window.user.startedBots && window.connection.send(new Uint8Array([5, Number(window.user.isAlive)]).buffer)*/)
            }
        }, {
            key: "nick",
            set(e) {
                this._nick = e,
                _e.nick(),
				_es.nick()
            },
            get() {
                return this._nick.substring(0, 15)
            }
        }, {
            key: "nick2",
            set(e) {
                this._nick2 = e,
                _e.nick2(),
				_es.nick()
            },
            get() {
                return this._nick2.substring(0, 15)
            }
        }, {
            key: "skin",
            set(e) {
                const t = re.getImgurCode(e);
                return t ? (this._skin = t,
                void _e.skin(), void _es.skin()) : void m.alert("HSLO", p.current.notif.invalidSkinUrl)
            },
            get() {
                return this._skin
            }
        }, {
            key: "skin2",
            set(e) {
                const t = re.getImgurCode(e);
                return t ? (this._skin2 = t,
                void _e.skin2(), void _es.skin()) : void m.alert("HSLO", p.current.notif.invalidSkinUrl)
            },
            get() {
                return this._skin2
            }
        }, {
            key: "tag",
            set(e) {
                this._tag = e,
                se.teammates.clear(),
                ses.teammates.clear(),
                C.reset(),
                _e.tag(),
				_es.tag(),
                _e.join(1),
                //_e.join(2),
                C.update()
            },
            get() {
                return this._tag
            }
        }, {
            key: "tag2",
            set(e) {
                this._tag2 = e,
                se.teammates.clear(),
                ses.teammates.clear(),
                C.reset(),
                _e.tag(),
				_es.tag(),
                //_e.join(1),
                _e.join(2),
                C.update()
            },
            get() {
                return this._tag2
            }
        }, {
            key: "colorObject",
            set(e) {
                this._colorObject.r = e.r,
                this._colorObject.g = e.g,
                this._colorObject.b = e.b
            },
            get() {
                return this._colorObject
            }
        }, {
            key: "isAlive",
            get() {
                return this.isAliveTab1 || this.isAliveTab2
            }
        }, {
            key: "worldID",
            get() {
                return ":party" === z.gMode ? this.nick + this.colorHexTab1 : this.nick
            }
        }, {
            key: "worldID2",
            get() {
                return ":party" === z.gMode ? this.nick2 + this.colorHexTab2 : this.nick2
            }
        }, {
            key: "location",
            get() {
                return G.getLocation(this.x, this.y)
            }
        }, {
            key: "pieceCount",
            get: ()=>I.myCellsTab1.size
        }, {
            key: "pieceCount2",
            get: ()=>I.myCellsTab2.size
        }, {
            key: "n16",
            get() {
                return this.pieceCount + this.pieceCount2
            }
        }, {
            key: "controllingTab",
            set(e) {
                this.controlledTab = e
            },
            get() {
                return this.controlledTab
            }
        }]),
        e
    })(),
    window.classA = A,
    // teammate cell
    O = (()=>{
        function e(t) {
            _classCallCheck(this, e),
            this.id = t,
            this.isNew = 2,
            this.x = 90,
            this.x2 = 90,
            this.y = 90,
            this.y2 = 90,
            this.isAlive = 0,
            this.mass = 0,
            this.nick = "",
			this.nick2 = "",
            this.skin = "",
			this.skin2 = "",
            this.colorHex = "#000",
            this.isRGB = !1,
            this.animX = 90,
            this.animX2 = 90,
            this.animY = 90,
            this.animY2 = 90,
            this.timeStamp = le.time,
            this.lastUpdateAt = le.time,
            this.team = 1
        }
        return _createClass(e, [{
            key: "animate",
            value() {
                let e = (le.time - this.timeStamp) / 1e3;
                e = 1 < e ? 1 : 0 > e ? 0 : e,
                this.animX += (this.x - this.animX) * e,
                this.animY += (this.y - this.animY) * e,
                this.timeStamp = le.time
            }
        }, {
            key: "worldID",
            get() {
                return ":party" === z.gMode ? this.nick + this.colorHex : this.nick
            }
        }, {
            key: "worldID2",
            get() {
                return ":party" === z.gMode ? this.nick2 + this.colorHex2 : this.nick2
            }
        }, {
            key: "location",
            get() {
                return G.getLocation(this.x + G.offset.x, this.y + G.offset.y)
            }
        }, {
            key: "location2",
            get() {
                return G.getLocation(this.x2 + G.offset.x, this.y2 + G.offset.y)
            }
        }, {
            key: "mapX",
            get() {
                return (this.animX + 7071) / 14142 * S.size
            }
        }, {
            key: "mapX2",
            get() {
                return (this.animX2 + 7071) / 14142 * S.size
            }
        }, {
            key: "mapY",
            get() {
                return (this.animY + 7071) / 14142 * S.size
            }
        }, {
            key: "mapY2",
            get() {
                return (this.animY2 + 7071) / 14142 * S.size
            }
        }]),
        e
    })(),
    Os = (()=>{
        function e(t) {
            _classCallCheck(this, e),
            this.id = t,
            this.isNew = 2,
			this.roomID = 0,
			this.tag = "",
			this.tab = 1,
            this.x = 90,
            this.x2 = 90,
            this.y = 90,
            this.y2 = 90,
            this.isAlive = 0,
			this.isAlive2 = 0,
            this.mass = 0,
            this.mass2 = 0,
            this.nick = "",
            this.nick2 = "",
            this.skin = "",
            this.skin2 = "",
            this.colorHex = "#000",
            this.colorHex2 = "#000",
            this.isRGB = !1,
            this.animX = 90,
            this.animX2 = 90,
            this.animY = 90,
            this.animY2 = 90,
            this.timeStamp = le.time,
            this.lastUpdateAt = le.time,
            this.team = 1
        }
        return _createClass(e, [{
            key: "animate",
            value() {
                let e = (le.time - this.timeStamp) / 1e3;
                e = 1 < e ? 1 : 0 > e ? 0 : e,
                this.animX += (this.x - this.animX) * e,
                this.animX2 += (this.x2 - this.animX2) * e,
                this.animY += (this.y - this.animY) * e,
                this.animY2 += (this.y2 - this.animY2) * e,
                this.timeStamp = le.time
            }
        }, {
            key: "worldID",
            get() {
                return ":party" === z.gMode ? this.nick + this.colorHex : this.nick
            }
        }, {
            key: "worldID2",
            get() {
                return ":party" === z.gMode ? this.nick2 + this.colorHex2 : this.nick2
            }
        }, {
            key: "location",
            get() {
                return G.getLocation(this.x + G.offset.x, this.y + G.offset.y)
            }
        }, {
            key: "location2",
            get() {
                return G.getLocation(this.x2 + G.offset.x, this.y2 + G.offset.y)
            }
        }, {
            key: "mapX",
            get() {
                return (this.animX + 7071) / 14142 * S.size
            }
        }, {
            key: "mapX2",
            get() {
                return (this.animX2 + 7071) / 14142 * S.size
            }
        }, {
            key: "mapY",
            get() {
                return (this.animY + 7071) / 14142 * S.size
            }
        }, {
            key: "mapY2",
            get() {
                return (this.animY2 + 7071) / 14142 * S.size
            }
        }]),
        e
    })(),
    R = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.indicator = this.cacheIndicator()
        }
        return _createClass(e, [{
            key: "cacheIndicator",
            value() {
                const e = h.createElement("canvas")
                  , t = e.getContext("2d")
                  , o = new Image;
                return e.width = 150,
                e.height = 150,
                t.textAlign = "center",
                t.textBaseline = "middle",
                t.font = "600 150px FontAwesome",
                t.fillStyle = "#ffffff",
                t.fillText("\u25bc", 75, 75),
                o.crossOrigin = "anonymous",
                o.src = e.toDataURL(),
                PIXI.Texture.from(o)
            }
        }]),
        e
    })()),
    G = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.left = -7071,
            this.top = -7071,
            this.right = 7071,
            this.bottom = 7071,
            this.edge = 14142,
            this.offset = {
                // tab 1 offset or simply (0, 0)
                x: 0,
                y: 0
            },
            this.offset2 = {
                // tab 2 offset
                x: 0,
                y: 0
            },
            this.offset3 = {
                x: 0,
                y: 0
            },
            this.Tab2LT = {
                left: -7071,
                top: -7071
            },
            this.Tab3LT = {
                left: -7071,
                top: -7071,
                right: 7071,
                bottom: 7071
            },
            this.center = {
                // center of tab 1
                x: 0,
                y: 0
            },
            this.center2 = {
                // center of tab 2
                x: 0,
                y: 0
            },
            this.center3 = {
                // center of tab 3
                x: 0,
                y: 0
            },
            this.focusedAtCenter = !1
        }
        return _createClass(e, [{
            key: "reset",
            value() {
                this.focusedAtCenter = !1
            }
        }, {
            key: "update",
            value(e, t, o, i) {
                14141 > o - e || 14141 > i - t || (this.left = e,
                this.top = t,
                this.right = o,
                this.bottom = i,
                this.offset.x = 7071 + e,
                this.offset.y = 7071 + t,
                this.center.x = o + e >> 1,
                this.center.y = i + t >> 1,
                !this.focusedAtCenter && (L.x = this.center.x,
                L.y = this.center.y,
                this.focusedAtCenter = !0));
                window.user.offsetX = A.controllingTab === 1 ? G.offset.x : G.offset2.x;
                window.user.offsetY = A.controllingTab === 1 ? G.offset.y : G.offset2.y;
            }
        }, {
            key: "updateOffset2",
            value(e, t, o, i) {
                14141 > o - e || 14141 > i - t || (this.offset2.x = 7071 + e,
                this.offset2.y = 7071 + t,
                this.Tab2LT.left = e,
                this.Tab2LT.top = t)
            }
        }, {
            key: "updateOffset3",
            value(e, t, o, i) {
                14141 > o - e || 14141 > i - t || (this.offset3.x = 7071 + e,
                this.offset3.y = 7071 + t,
                this.Tab3LT.left = e,
                this.Tab3LT.top = t,
                this.Tab3LT.right = o,
                this.Tab3LT.bottom = i)
            }
        }, {
            key: "getLocation",
            value(e, t) {
                let o = 0 | (e - this.left) / 2828
                  , i = 0 | (t - this.top) / 2828;
                return o = 0 > o ? 0 : 4 < o ? 4 : o,
                i = 0 > i ? 0 : 4 < i ? 4 : i,
                String.fromCharCode(65 + i) + (o + 1)
            }
        }, {
            key: "getOffset2",
            // tab two coord
            get() {
                return this.center2.x = this.offset2.x - this.offset.x,
                this.center2.y = this.offset2.y - this.offset.y,
                this.center2
            }
        }, {
            key: "getOffset3",
            get() {
                return this.center3.x = this.offset3.x - this.offset.x,
                this.center3.y = this.offset3.y - this.offset.y,
                this.center3
            }
        }]),
        e
    })()),
    L = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.x = 0,
                this.y = 0,
                this.iw = 1920,
                //re.canvas.width,
                this.ih = 969,
                //re.canvas.height,
                this.targetViewport = 1,
                this.autoZoomViewport = 1,
                this.Tab3Viewport = 0.2,
                this.viewport = 1,
                this.viewBounds = {
                    // viewBounds
                    left: -960,
                    right: 960,
                    top: -540,
                    bottom: 540
                },
                this.Tab3ViewBounds = {
                    // tab 3 viewBounds
                    left: -960,
                    right: 960,
                    top: -540,
                    bottom: 540
                },
                this.spectatePoints = {
                    x: 0,
                    y: 0
                },
                this.Tab3SpectatePoints = {
                    x: 0,
                    y: 0
                },
                this._isSpectating = !1,
                this._freeSpectate = !1,
                W.init()
            }
        }, {
            key: "update",
            value() {
                this.isSpectating && W.update(),
                this.move(),
                this.updateView()
            }
        }, {
            key: "move",
            value() {
                A.isAlive ? (this.x += (A.x - this.x) / settings.cameraSpeed,
                this.y += (A.y - this.y) / settings.cameraSpeed) : this.isSpectating && (this.x = (29 * this.x + this.spectatePoints.x) / 30,
                this.y = (29 * this.y + this.spectatePoints.y) / 30)
            }
        }, {
            key: "updateView",
            value() {
                let e = this.targetViewport;
                "on" === settings.autoZoom && (e *= this.autoZoomViewport),
                this.viewport += (e - this.viewport) / 8;
                const t = re.canvas.width / 2 / this.viewport
                  , o = re.canvas.height / 2 / this.viewport;
                const _t = this.iw / 2 / this.Tab3Viewport
                  , _o = this.ih / 2 / this.Tab3Viewport;
                this.viewBounds.left = Math.max(-t + this.x, G.left),
                this.viewBounds.right = Math.min(t + this.x, G.right),
                this.viewBounds.top = Math.max(-o + this.y, G.top),
                this.viewBounds.bottom = Math.min(o + this.y, G.bottom);
                this.Tab3ViewBounds.left = Math.max(-_t + ghostCells[0].x, G.Tab3LT.left),
                this.Tab3ViewBounds.right = Math.min(_t + ghostCells[0].x, G.Tab3LT.right),
                this.Tab3ViewBounds.top = Math.max(-_o + ghostCells[0].y, G.Tab3LT.top),
                this.Tab3ViewBounds.bottom = Math.min(_o + ghostCells[0].y, G.Tab3LT.bottom)
            }
        }, {
            key: "isSpectating",
            get() {
                return this._isSpectating
            },
            set(e) {
                this._isSpectating = e,
                e ? K.show() : K.hide()
            }
        }, {
            key: "freeSpectate",
            get() {
                return this._freeSpectate
            },
            set(e) {
                this._freeSpectate = e,
                e ? K.mouseViewport() : K.topViewport()
            }
        }]),
        e
    })()),
    P = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.nickCaches = new Map,
            this.massCaches = new Map,
            this.maxCacheLife = 1e3,
            this.massUpdateInterval = settings.massUpdateInterval || 500,
            //this.massUpdateInterval = 1,
            //this.quality = .8,
            this.quality = 1,
            this.nickShadowCtx = this.newShadowContext(),
            this.massShadowCtx = this.newShadowContext(),
            this.canvasPool = []
        }
        return _createClass(e, [{
			key: "setMassUpdateInterval",
			value() {
				this.massUpdateInterval = settings.massUpdateInterval || 500
			}
		}, {
            key: "nick",
            value(ue) {
				if (ue.isUnnamed || this.isSmall(ue))
					return !1;
				const pack = this.nickCaches.get(ue.nick) || this.newNickCache(ue.nick);
				pack.lastUsedAt = le.time;
				const needLevel = 50 > this.getScreenRadius(ue.animRadius) ? 0 : 1,
					canvaslevel = pack.level[needLevel];
				if (canvaslevel) return PIXI.Texture.from(canvaslevel);
				const ye = this.getNewCanvas(),
					ctx = ye.getContext('2d'),
					Ce = 50 * (needLevel + 1) * oe.cellNickSize / 100;
				if (ye.height = 0 | 1.2 * Ce, ye.width = 0 | 1.2 * this.getNickWidth(ue.nick, Ce),
				ctx.font = `700 ${0|Ce}px ${oe.nickFont}`, ctx.textBaseline = 'middle',
				ctx.textAlign = 'center', 'normal' === settings.nickShadow)
					ctx.strokeStyle = oe.nickStrokeColor,
					ctx.lineWidth = 10 * (needLevel + 1),
					ctx.strokeText(ue.nick, ye.width >> 1, ye.height >> 1);
				else if ('performance' === settings.nickShadow) {
					ctx.fillStyle = oe.nickStrokeColor,
					ctx.globalAlpha = 0.75;
					const ve = 0 | ye.width / 1.2,
						be = 0 | ye.height / 1.2;
					ctx.fillRect(ye.width - ve >> 1, ye.height - be >> 1, ve, be),
					ctx.globalAlpha = 1
				}
				return ctx.fillStyle = oe.nickColor,
				ctx.fillText(ue.nick, ye.width >> 1, ye.height >> 1),
				pack.level[needLevel] = ye,
				//ye
				PIXI.Texture.from(ye)
            }
        }, {
            key: "newNickCache",
            value(e) {
                const t = new B;
                return this.nickCaches.set(e, t),
                t
            }
        }, {
            key: "getNickWidth",
            value(e, t) {
                return this.nickShadowCtx.measureText(e).width * t / 25
            }
        }, {
            key: "setNickCtxFont",
            value() {
                this.nickCaches.clear(),
                this.nickShadowCtx.font = "700 25px " + oe.nickFont
            }
        }, {
            key: "mass",
            value(ue) {
				if (!ue.isVirus && this.isSmall(ue))
					return !1;
				const fe = this.massCaches.get(ue.id) || this.newMassCache(ue.id),
					he = 'shortened' === settings.cellMass,
					ke = he && 999 < ue.mass ? `${(0|ue.mass/100)/10}k` : ue.mass,
					ye = this.getScreenRadius(ue.radius),
					Se = ke !== fe.lastMass,
					Ce = le.time - fe.lastUpdateAt > this.massUpdateInterval,
					ve = 1.2 < ye / fe.lastScreenRadius || Se && Ce;
				if (fe.lastUsedAt = le.time,
				!ve && fe.canvas)
					return PIXI.Texture.from(fe.canvas);
				fe.canvas || (fe.canvas = this.getNewCanvas());
				const be = fe.canvas,
					xe = be.getContext('2d'),
					we = 0 | ye / 2 * (oe.cellMassSize / 100);
				if (be.height = 0 | 1.2 * we, be.width = 0 | 1.2 * this.getMassWidth(ke, we),
				xe.font = `700 ${we}px ${oe.massFont}`,
				xe.textBaseline = 'middle',
				xe.textAlign = 'center',
				'normal' === settings.massShadow)
					xe.strokeStyle = oe.massStrokeColor,
					xe.lineWidth = 6 * we / 50,
					xe.strokeText(ke, be.width >> 1, be.height >> 1);
				else if ('performance' === settings.massShadow) {
					xe.fillStyle = oe.massStrokeColor, xe.globalAlpha = 0.75;
					const Te = 0 | be.width / 1.2,
						_e = 0 | be.height / 1.2;
					xe.fillRect(be.width - Te >> 1, be.height - _e >> 1, Te, _e),
					xe.globalAlpha = 1
				}
				return xe.fillStyle = oe.massColor,
				xe.fillText(ke, be.width >> 1, be.height >> 1),
				fe.lastMass = ke,
				fe.lastScreenRadius = ye,
				fe.lastUpdateAt = le.time + fe.timeShift,
				//be
				fe.texture = PIXI.Texture.from(be),
				PIXI.Texture.from(be)
            }
        }, {
            key: "newMassCache",
            value(e) {
                const t = new E;
                return this.massCaches.set(e, t),
                t
            }
        }, {
            key: "getMassWidth",
            value(e, t) {
                return this.massShadowCtx.measureText(e).width * t / 25
            }
        }, {
            key: "setMassCtxFont",
            value() {
                this.massCaches.clear(),
                this.massShadowCtx.font = "700 25px " + oe.massFont
            }
        }, {
            key: "getScreenRadius",
            value: e=>e * L.viewport
        }, {
            key: "isSmall",
            value(e) {
                return "on" === settings.autoHideText && 20 > this.getScreenRadius(e.animRadius)
            }
        }, {
            key: "getNewCanvas",
            value() {
                return this.canvasPool.shift() || h.createElement("canvas")
            }
        }, {
            key: "newShadowContext",
            value() {
                const e = h.createElement("canvas").getContext("2d");
                return e.font = "700 25px ubuntu",
                e
            }
        }, {
            key: "cleaner",
            value() {
                this.nickCaches.forEach((e,t)=>{
                    if (le.time - e.lastUsedAt > this.maxCacheLife) {
                        this.nickCaches.delete(t);
                        for (var o, i = e.level, s = 0; s < i.length; s++)
                            (o = i[s]) && this.resetCanvas(o)
                    }
                }),
                this.massCaches.forEach((e,t)=>{
                    if (le.time - e.lastUsedAt > this.maxCacheLife) {
                        if (this.massCaches.delete(t),
                        50 <= this.canvasPool.length)
                            return;
                        var o = e.canvas;
                        this.resetCanvas(o)
                    }
                })
            }
        }, {
            key: "resetCanvas",
            value(e) {
                !e || 75 <= this.canvasPool.length || (e.width = 0,
                this.canvasPool.push(e))
            }
        }]),
        e
    }
    )()),
    Pm = new ((()=>{
        function e() {
            _classCallCheck(this, e),
			this.pool = [],
			this.index = 0,
			this.init()
        }
        return _createClass(e, [{
			key: "reset",
			value() {
				this.pool = [],
				this.index = 0
			}
		}, {
            key: "init",
            value() {
				this.loadFonts()
            }
        }, {
            key: "get",
            value(e) {
				const i = this.pool[this.index++] || this.newText();
				return i.text = "".concat(e),
				i.font = {
					name: settings.massShadow === "normal" ? "UbuntuStroked" : "Ubuntu",
					size: 256
				},
				i
            }
        }, {
            key: "newText",
            value() {
				const e = new PIXI.BitmapText("000", {
					font: {
						name: "Ubuntu",
						size: 256
					}
				});
				return e.anchor = .5,
				this.pool.push(e),
				e
            }
        }, {
            key: "loadFonts",
            value() {
				const e = {
					crossOrigin: !0
				}
				  , i = new PIXI.Loader;
				i.add("ubuntu-font-png", "https://senpa.io/web/resources/src/resources/bitmapFonts/ubuntuBold_0.png", e),
				i.add("ubuntu-font", "https://senpa.io/web/resources/src/resources/bitmapFonts/ubuntuBold.fnt", e),
				i.add("ubuntu-font-stroked-png", "https://senpa.io/web/resources/src/resources/bitmapFonts/ubuntuBoldStroked_0.png", e),
				i.add("ubuntu-font-stroked", "https://senpa.io/web/resources/src/resources/bitmapFonts/ubuntuBoldStroked.fnt", e),
				i.load()
            }
        }]),
        e
    }
    )()),
    E = function e() {
		_classCallCheck(this, e),
		this.lastUsedAt = le.time,
		this.lastUpdateAt = le.time,
		this.canvas = null,
		this.ctx = null,
		this.texture = null,
		this.lastMass = 0,
		this.timeShift = 0 | Math.random() * P.massUpdateInterval,
		this.lastScreenRadius = 0,
		this.needsRedraw = !0
	},
    B = function e() {
        _classCallCheck(this, e),
        this.lastUsedAt = le.time,
        this.level = [null, null]
    },
    H = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.cache()
            }
        }, {
            key: "render",
            value() {
                "off" === settings.food || ("monoColored" === settings.food ? this.monoColored() : "rainbow" === settings.food && this.rainbow())
            }
        }, {
            key: "cache",
            value() {
                this.settings = {
                    radius: 10 + oe.foodSize,
                    isGlowOn: "off" !== settings.foodGlow,
                    strength: "off" !== settings.foodGlow && oe.foodGlowStrength ? oe.foodGlowStrength : 1
                };
				//mono color cache
                this.cacheCanvas = document.createElement("canvas");
                this.cacheCtx = this.cacheCanvas.getContext("2d");
                this.cacheCanvas.width = 400;
                this.cacheCanvas.height = 400;
                this.cacheCtx.beginPath();
                this.cacheCtx.arc(~~(400 - this.settings.radius) / 2, ~~(400 - this.settings.radius) / 2, ~~this.settings.radius, 0, Math.PI * 2, 0);
                this.cacheCtx.closePath();
                this.cacheCtx.fillStyle = oe.foodColor;
				this.settings.isGlowOn && (this.cacheCtx.shadowBlur = oe.foodGlowSize,
                this.cacheCtx.shadowColor = oe.foodGlow);
                for (let i = 0; i < this.settings.strength; i++) {
                    this.cacheCtx.fill();
                };
				this.settings.isGlowOn && (this.cacheCtx.shadowBlur = 0);
				this.cacheTexture = PIXI.Texture.from(this.cacheCanvas);
				//rainbow color cache
                this.cacheCanvasR = document.createElement("canvas");
                this.cacheCtxR = this.cacheCanvasR.getContext("2d");
                this.cacheCanvasR.width = 400;
                this.cacheCanvasR.height = 400;
                this.cacheCtxR.beginPath();
                this.cacheCtxR.arc(~~(400 - this.settings.radius) / 2, ~~(400 - this.settings.radius) / 2, ~~this.settings.radius, 0, Math.PI * 2, 0);
                this.cacheCtxR.closePath();
                this.cacheCtxR.fillStyle = "#ffffff";
				this.settings.isGlowOn && (this.cacheCtxR.shadowBlur = oe.foodGlowSize,
                this.cacheCtxR.shadowColor = "#ffffff");
                for (let i = 0; i < this.settings.strength; i++) {
                    this.cacheCtxR.fill();
                };
				this.settings.isGlowOn && (this.cacheCtxR.shadowBlur = 0);
				this.cacheTextureR = PIXI.Texture.from(this.cacheCanvasR);
            }
        }, {
            key: "monoColored",
            value() {
                const e = re.mainContainer;
					//, _e = re.graphics;
					//, _e = re.foodGraphics;
                let i = I.food.length;
                for (; i--; ) {
                    const o = I.food[i]
						, s = 2 === o.tab ? G.getOffset2 : 3 === o.tab ? G.getOffset3 : 3 < o.tab ? q.mapTabs[o.tab-4].getOffset : {
							x: 0,
							y: 0
						}
						, n = o.animRadius + oe.foodSize;
					/*_e.beginFill(parseInt(oe.foodColor.slice(1), 16), 1),
                    _e.drawCircle(o.x - s.x, o.y - s.y, n);
					_e.endFill();*/
					const food = new PIXI.Sprite(this.cacheTexture)
						, ratio = n / (10 + oe.foodSize);
					food.scale.set(ratio, ratio);
					food.anchor.set(0.5, 0.5);
					food.position.set(~~(o.x - s.x + (n - 10 - oe.foodSize)/2), ~~(o.y - s.y + (n - 10 - oe.foodSize)/2));
					e.addChild(food);
                }
				//e.addChild(_e);
            }
        }, {
            key: "rainbow",
            value() {
				const e = re.mainContainer;
					//, _e = re.graphics;
					//, _e = re.foodGraphics;
                /*for (let t = oe.foodSize, o = I.food.length; o--; ) {
                    const i = I.food[o]
                      , s = 2 === i.tab ? G.getOffset2 : 3 === i.tab ? G.getOffset3 : 3 < i.tab ? q.mapTabs[i.tab-4].getOffset : {
                        x: 0,
                        y: 0
                    }
                      , n = i.animRadius + t;
                    _e.beginFill(parseInt(i.colorObject.hex.slice(1), 16), 1),
                    _e.drawCircle(~~(i.x - s.x), ~~(i.y - s.y), ~~n);
					_e.endFill();
                }
				e.addChild(_e);*/
                let i = I.food.length;
                for (; i--; ) {
                    const o = I.food[i]
						, s = 2 === o.tab ? G.getOffset2 : 3 === o.tab ? G.getOffset3 : 3 < o.tab ? q.mapTabs[o.tab-4].getOffset : {
							x: 0,
							y: 0
						}
						, n = o.animRadius + oe.foodSize;
					/*_e.beginFill(parseInt(oe.foodColor.slice(1), 16), 1),
                    _e.drawCircle(o.x - s.x, o.y - s.y, n);
					_e.endFill();*/
					const food = new PIXI.Sprite(this.cacheTextureR)
						, ratio = n / (10 + oe.foodSize);
					food.scale.set(ratio, ratio);
					food.anchor.set(0.5, 0.5);
					food.position.set(~~(o.x - s.x + (n - 10 - oe.foodSize)/2), ~~(o.y - s.y + (n - 10 - oe.foodSize)/2));
					food.tint = parseInt(o.colorObject.hex.slice(1), 16);
					e.addChild(food);
                }
            }
        }]),
        e
    })()),
	ie = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.init()
        }
		return _createClass(e, [{
            key: "init",
            value() {
				this.STE = [],
				this.smaller = [],
				this.same = [],
				this.bigger = [],
				this.biggerSTE = [],
				this.lineWidth = 10
            }
        }, {
            key: "segregator",
            value(ue) {
				const fe = ue.mass / A.biggestPieceMass
				  , he = 1e3 < A.biggestPieceMass ? 0.38 : 0.35;
				ue.isMine ? this.same.push(ue) : 2.5 < fe ? this.biggerSTE.push(ue) : 1.25 < fe ? this.bigger.push(ue) : 0.75 < fe ? this.same.push(ue) : fe > he ? this.smaller.push(ue) : this.STE.push(ue)
            }
        }, {
			key: "reset",
			value() {
				this.STE = [],
				this.smaller = [],
				this.same = [],
				this.bigger = [],
				this.biggerSTE = []
			}
        }, {
			key: "render",
			value() {
				const ue = settings.opponentRings;
				if (!('off' === ue || W.isSpectating)) {
					const e = re.graphics;
					//const e = re.opponentRingsGraphics;
					this.lineWidth = 0 | Math.min(3 / L.viewport, 14),
					e.beginFill(0, 0),
					this.renderGroup(this.STE, '#76FF03'),
					this.renderGroup(this.smaller, '#2196F3'),
					this.renderGroup(this.same, '#555555'),
					this.renderGroup(this.bigger, '#FF9800'),
					this.renderGroup(this.biggerSTE, '#FD0000')
				}
			}
		}, {
			key: "renderGroup",
			value(ue, fe) {
				const e = re.graphics;
				//const e = re.opponentRingsGraphics;
				e.lineStyle(this.lineWidth, parseInt(fe.slice(1), 16))
				for (let ke = ue.length; ke--; ) {
					const ye = ue[ke];
					const s = 2 === ye.tab ? G.getOffset2 : 3 === ye.tab ? G.getOffset3 : 3 < ye.tab ? q.mapTabs[ye.tab-4].getOffset : {
						x: 0,
						y: 0
					};
					e.moveTo(ye.x - s.x + ye.animRadius + 15 + (this.lineWidth >> 1), ye.y - s.y),
					e.drawCircle(ye.x - s.x, ye.y - s.y, ye.animRadius + 15 + (this.lineWidth >> 1))
				}
				e.endFill(),
				//re.mainContainer.addChild(e),
				e.lineStyle(0)
			}
		}]),
		e
    }
	)()),
	ve = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.init()
        }
		return _createClass(e, [{
            key: "init",
            value() {
				this.viruses = new Set
            }
        }, {
            key: "add",
            value(ue) {
				this.viruses.add(ue)
            }
        }, {
			key: "reset",
			value() {
				this.viruses.clear()
			}
        }, {
			key: "render",
			value() {
				if ('on' === settings.virusRange) {
					const e = re.graphics;
					//const e = re.virusRangeGraphics;
					e.beginFill(0xffffff, .1),
					this.viruses.forEach(fe=>{
						const s = 2 === fe.tab ? G.getOffset2 : 3 === fe.tab ? G.getOffset3 : 3 < fe.tab ? q.mapTabs[fe.tab-4].getOffset : {
							x: 0,
							y: 0
						}
						const he = 0 < fe.fadeStartTime ? Math.max(1 - (le.time - fe.fadeStartTime) / settings.CellAnimation, 0) : 1;
						e.alpha = 0.1 * he,
						e.drawCircle(fe.x - s.x, fe.y - s.y, fe.animRadius + 760)
					}),
					e.endFill(),
					//re.mainContainer.addChild(e)//,
					e.alpha = 1
				}
			}
		}]),
		e
    }
	)()),
    N = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.skinMap = new Map,
			this.kanjiSkinMap = new Map,
            this.downloadedSkins = new Map,
			this.kanjis = [],
            this.pi2 = 2 * Math.PI
        }
        return _createClass(e, [{
            key: "render",
            value() {
                this.skinMap.clear(),
                A.isAlive && (this.skinMap.set(A.worldID, settings.hideOwnSkin === "on" ? "" : this.code2url(A.skin)),
                this.skinMap.set(A.worldID2, settings.hideOwnSkin === "on" ? "" : this.code2url(A.skin2)));
                for (const e of se.teammates.values())
					e.isAlive && e.worldID !== A.worldID && e.worldID !== A.worldID2 && this.skinMap.set(e.worldID, e.skin ? (e.skin.includes("imgur") ? e.skin : this.code2url(e.skin)) : "https://i.imgur.com/O5k0G4p.png");
				for (const e of ses.teammates.values())
					e.isAlive && e.worldID !== A.worldID && e.worldID !== A.worldID2 && this.skinMap.set(e.worldID, e.skin ? (e.skin.includes("imgur") ? e.skin : this.code2url(e.skin)) : "https://i.imgur.com/O5k0G4p.png"),
					e.isAlive2 && e.worldID2 !== A.worldID && e.worldID2 !== A.worldID2 && this.skinMap.set(e.worldID2, e.skin2 ? (e.skin2.includes("imgur") ? e.skin2 : this.code2url(e.skin2)) : "https://i.imgur.com/O5k0G4p.png");
			}
        }, {
			key: "getKanjis",
			value() {
				r.ajax("https://yueagar-kanji.herokuapp.com/kanjis", {
					error: () => console.error("AJAX in kanji server errored out!"),
					success: data => {
						this.kanjiSkinMap.clear();
						this.kanjis = [];
						const entries = Object.entries(data);
						entries.forEach(kanji => {
							this.kanjis.push(kanji[0]);
							this.kanjiSkinMap.set(kanji[0], kanji[1].skinurl);
						});
					}
				});
			}
		}, {
            key: "getCustomSkin",
            value(e) {
                const t = this.skinMap.get(e);
                if (!t)
                    return !1;
                const o = this.downloadedSkins.get(t);
                return void 0 === o ? (this.downloadSkin(t),
                !1) : o
            }
        }, {
            key: "getKanjiSkin",
            value(e) {
                const t = this.kanjiSkinMap.get(e);
                if (!t)
                    return !1;
                const o = this.downloadedSkins.get(t);
                return void 0 === o ? (this.downloadSkin(t),
                !1) : o
            }
        }, {
            key: "getVanillaSkin",
            value(e) {
				//console.log(`https://configs-web.agario.miniclippt.com/live/v15/2637/${e.substr(1,1).toUpperCase() + e.slice(2)}.png`);
                const o = this.downloadedSkins.get(`https://configs-web.agario.miniclippt.com/live/v15/2637/${e.substr(1,1).toUpperCase() + e.slice(2)}.png`);
                return void 0 === o ? (this.downloadSkin(``),
                !1) : o
            }
        }, {
            key: "downloadSkin",
            value(e) {
                const t = this;
                this.downloadedSkins.set(e, !1);
				const o = new Image;
				o.crossOrigin = "anonymous",
				o.onload = (()=>{
					const i = h.createElement("canvas")
					  , s = i.getContext("2d");
					i.width = 512,
					i.height = 512,
					s.beginPath(),
					s.arc(256, 256, 256, 0, t.pi2, !0),
					s.closePath(),
					s.clip(),
					s.drawImage(o, 0, 0, 512, 512),
					o.onload = null,
					o.src = i.toDataURL(),
					t.downloadedSkins.set(e, PIXI.Texture.from(o))
				}),
				o.src = e
            }
        }, {
            key: "code2url",
            value: e=>"https://i.imgur.com/" + e + ".png"
        }, {
            key: "checkHasKanji",
            value(e) {
				let matched = !1;
				this.kanjis.forEach(kanji => {
					e.substr(e.length-2) === (":" + kanji) && (matched = kanji);
				});
				return matched;
			}
        }]),
        e
    }
    )()),
    V = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.left = 0,
            this.top = 0,
            this.sectorEdge = 0,
            this.edge = 0,
            this.halfSectorEdge = 0,
            this.letters = ["A", "B", "C", "D", "E"];
			const sectorImage = new Image();
			sectorImage.crossOrigin = "anonymous",
			sectorImage.src = "https://senpa.io/web/resources/src/resources/img/sectors.png",
			this.sectorImg = PIXI.Sprite.from(sectorImage),
			this.texts = new PIXI.Container(),
			this.snowTexts = new PIXI.Container(),
            this.visible = new Set
        }
        return _createClass(e, [{
			key: "updateText",
			value() {
				this.texts.children.forEach(t => t.destroy(true));
				this.texts.removeChildren();
				this.snowTexts.children.forEach(t => t.destroy(true));
				this.snowTexts.removeChildren();
				for (let t, o = 0; 5 > o; o++) {
					t = this.halfSectorEdge + o * this.sectorEdge;
					for (let i, s = 0; 5 > s; s++) {
						i = this.letters[o] + (s + 1);
						const e = new PIXI.Text(i, {
							fontFamily: oe.gridTextFont,
							fontWeight: 400,
							fontSize: oe.gridTextSize + "px",
							fill: parseInt(oe.gridTextColor.slice(1), 16)
						});
						const _o = this.halfSectorEdge + s * this.sectorEdge;
						e.position.set(_o, t);
						this.texts.addChild(e);
						const _e = new PIXI.Text("\u2746", {
							fontFamily: oe.gridTextFont,
							fontWeight: 400,
							fontSize: oe.gridTextSize + "px",
							fill: parseInt(oe.gridTextColor.slice(1), 16)
						});
						_e.position.set(_o, t);
						this.snowTexts.addChild(_e);
					};
				};
			}
		}, {
            key: "render",
            value() {
                const e = settings.bgSectors;
                if ("off" !== e && "fantasy" !== e) {
                    //const t = re.graphics
                    const t = re.gridGraphics
                      , o = oe.gridWidth
                      , i = o >> 1;
                    this.edge = G.edge - o,
                    this.left = G.left + i,
                    this.top = G.top + i,
                    this.sectorEdge = 0 | this.edge / 5,
                    this.halfSectorEdge = 0 | this.edge / 10,
					t.beginFill(0, 0),
					t.lineStyle(o, parseInt(oe.gridColor.slice(1), 16), 1),
                    "onlyLines" === e || (this.updateViewSectors(),
                    "snowflakes" === e ? this.snowflakes() : this.normal()),
					this.sectors()
                }
            }
        }, {
            key: "sectors",
            value() {
                //const e = re.graphics;
                const e = re.gridGraphics;
                e.drawRect(this.left + this.sectorEdge, this.top, this.sectorEdge, this.edge),
                e.drawRect(this.left + 3 * this.sectorEdge, this.top, this.sectorEdge, this.edge),
                e.drawRect(this.left, this.top + this.sectorEdge, this.edge, this.sectorEdge),
                e.drawRect(this.left, this.top + 3 * this.sectorEdge, this.edge, this.sectorEdge),
                e.drawRect(this.left, this.top, this.edge, this.edge),
                e.endFill(),
				re.mainContainer.addChild(e),
				e.lineStyle(0)
            }
        }, {
            key: "updateViewSectors",
            value() {
                const e = this.visible;
                e.clear();
                for (let t = L.viewBounds, o = 0 | (t.left - 200 - G.left) / this.sectorEdge, i = 0 | (t.top - 200 - G.top) / this.sectorEdge, s = 5 - (0 | (G.right - t.right - 200) / this.sectorEdge) - o, n = 5 - (0 | (G.bottom - t.bottom - 200) / this.sectorEdge) - i, a = 0; a < s; a++)
                    for (let t = 0; t < n; t++)
                        e.add(this.letters[i + t] + (o + a + 1))
            }
        }, {
            key: "normal",
            value() {
                /*for (let t, o = 0; 5 > o; o++) {
                    t = this.top + this.halfSectorEdge + o * this.sectorEdge;
                    for (let i, s = 0; 5 > s; s++)
                        if (i = this.letters[o] + (s + 1),
                        this.visible.has(i)) {
							const e = this.texts[o + s];
                            o = this.left + this.halfSectorEdge + s * this.sectorEdge;
                            //e.fillText(i, o, t)
							e.position.set(o, t);
							re.mainContainer.addChild(e)
                        }
                }*/
				//this.texts.position.set(G.left, G.top);
				//re.mainContainer.addChild(this.texts);
				const e = G.right - G.left
					, i = G.bottom - G.top;
				this.sectorImg.x = G.left,
				this.sectorImg.y = G.top,
				this.sectorImg.width = e,
				this.sectorImg.height = i,
				this.sectorImg.tint = parseInt(oe.gridTextColor.slice(1), 16),
				re.mainContainer.addChild(this.sectorImg)
            }
        }, {
            key: "snowflakes",
            value() {
                /*for (let t, o = 0; 5 > o; o++) {
                    t = this.top + this.halfSectorEdge + o * this.sectorEdge;
                    for (let i, s = 0; 5 > s; s++)
                        if (i = this.letters[o] + (s + 1),
                        this.visible.has(i)) {
							const e = this.snowTexts[o + s];
                            o = this.left + this.halfSectorEdge + s * this.sectorEdge;
                            //e.fillText("\u2746", o, t)
							e.position.set(o, t);
							re.mainContainer.addChild(e)
                        }
                }*/
				//this.snowTexts.position.set(G.left, G.top);
				//re.mainContainer.addChild(this.snowTexts);
            }
        }]),
        e
    })()),
    W = (()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, null, [{
            key: "init",
            value() {
                this.target1 = {
                    turnedOn: !1,
                    nick: "",
                    worldID: "",
                    mass: 0,
                    cellCount: 0,
                    position: {
                        x: 0,
                        y: 0
                    },
                    outOfView: !1
                },
                this.target2 = {
                    turnedOn: !1,
                    nick: "",
                    worldID: "",
                    mass: 0,
                    cellCount: 0,
                    position: {
                        x: 0,
                        y: 0
                    },
                    outOfView: !1
                },
                this.center = {
                    x: 0,
                    y: 0
                }
            }
        }, {
            key: "update",
            value() {
                if (this.target1.turnedOn || this.target2.turnedOn) {
                    const e = this.target1
                      , t = this.target2;
                    e.mass = 0,
                    e.position.x = 0,
                    e.position.y = 0,
                    e.cellCount = 0,
                    t.mass = 0,
                    t.position.x = 0,
                    t.position.y = 0,
                    t.cellCount = 0,
                    I.cellsTab1.forEach(o=>{
                        e.turnedOn && e.worldID === o.worldID ? (e.position.x += o.x,
                        e.position.y += o.y,
                        e.mass += o.staticMass,
                        e.cellCount++) : t.turnedOn && t.worldID === o.worldID && (t.position.x += o.x,
                        t.position.y += o.y,
                        t.mass += o.staticMass,
                        t.cellCount++)
                    }
                    ),
                    e.mass |= 0,
                    t.mass |= 0;
                    let o = 0
                      , i = 0
                      , s = 0;
                    e.turnedOn && (0 < e.cellCount ? (e.position.x /= e.cellCount,
                    e.position.y /= e.cellCount,
                    e.outOfView = !1,
                    i += e.position.x,
                    s += e.position.y,
                    o++) : e.outOfView = !0),
                    t.turnedOn && (0 < t.cellCount ? (t.position.x /= t.cellCount,
                    t.position.y /= t.cellCount,
                    t.outOfView = !1,
                    i += t.position.x,
                    s += t.position.y,
                    o++) : t.outOfView = !0),
                    0 < o && (this.center.x = 0 | i / o,
                    this.center.y = 0 | s / o)
                }
            }
        }, {
            key: "lockTarget",
            value(e, t, o) {
                if (A.isAlive)
                    //m.alert("HSLO", "You're alive");
                    return;
                L.freeSpectate || d.toggleSpectate();
                let i = 199996164
                  , s = !1;
                if (I.sortedCells.forEach(o=>{
                    if (!o.isVirus && !o.isEjected) {
                        const n = this.getDistanceSquare(e, t, o.x, o.y);
                        n < i && (i = n,
                        s = o)
                    }
                }),
                s)
                    if (s.isUnnamed)
                        m.alert("HSLO", p.current.notif.target_unnamed);
                    else {
                        const e = 1 === o ? this.target1 : this.target2;
                        e.turnedOn = !0,
                        e.nick = s.nick,
                        e.worldID = s.worldID,
                        e.outOfView = !1,
                        K.targetMode()
                    }
            }
        }, {
            key: "getDistanceSquare",
            value(e, t, o, i) {
                const s = o - e
                  , n = i - t;
                return s * s + n * n
            }
        }, {
            key: "reset",
            value() {
                this.isTurnedOn || d.toggleSpectate(),
                L.freeSpectate ? K.mouseViewport() : K.topViewport(),
                this.target1.turnedOn = !1,
                this.target2.turnedOn = !1
            }
        }, {
            key: "isTurnedOn",
            get() {
                return this.target1.turnedOn || this.target2.turnedOn
            }
        }]),
        e
    })(),
    D = (()=>{
        function e(t) {
            _classCallCheck(this, e),
            this.dataView = t,
            this.index = 0,
            this.maxIndex = t.byteLength
        }
        return _createClass(e, [{
            key: "readUInt8",
            value() {
                const e = this.dataView.getUint8(this.index, !0);
                return this.index++,
                e
            }
        }, {
            key: "readInt8",
            value() {
                const e = this.dataView.getInt8(this.index, !0);
                return this.index++,
                e
            }
        }, {
            key: "readUInt16",
            value() {
                const e = this.dataView.getUint16(this.index, !0);
                return this.index += 2,
                e
            }
        }, {
            key: "readInt16",
            value() {
                const e = this.dataView.getInt16(this.index, !0);
                return this.index += 2,
                e
            }
        }, {
            key: "readUInt32",
            value() {
                const e = this.dataView.getUint32(this.index, !0);
                return this.index += 4,
                e
            }
        }, {
            key: "readInt32",
            value() {
                const e = this.dataView.getInt32(this.index, !0);
                return this.index += 4,
                e
            }
        }, {
            key: "readFloat32",
            value() {
                const e = this.dataView.getFloat32(this.index, !0);
                return this.index += 4,
                e
            }
        }, {
            key: "readFloat64",
            value() {
                const e = this.dataView.getFloat64(this.index, !0);
                return this.index += 8,
                e
            }
        }, {
            key: "readUTF8string",
            value() {
                for (var e, t = ""; !this.endOfBuffer && 0 !== (e = this.readUInt8()); )
                    t += String.fromCharCode(e);
                return t
            }
        }, {
            key: "readString8",
            value() {
				const strLength = this.readUInt8();
                for (var e = 0, t = ""; e < strLength; e++)
                    t += String.fromCharCode(this.readUInt8());
                return t
            }
        }, {
            key: "readUTF16string",
            value() {
                for (var e, t = ""; !this.endOfBuffer && 0 !== (e = this.readUInt16()); )
                    t += String.fromCharCode(e);
                return t
            }
        }, {
            key: "readString16",
            value() {
				const strLength = this.readUInt8();
                for (var e = 0, t = ""; e < strLength; e++)
                    t += String.fromCharCode(this.readUInt16());
                return t
            }
        }, {
            key: "readEscapedUTF8string",
            value() {
                const e = this.readUTF8string();
                return decodeURIComponent(escape(e))
            }
        }, {
            key: "decompress",
            value() {
                const e = new Uint8Array(this.dataView.buffer)
                  , t = this.readUInt32()
                  , o = new Uint8Array(t);
                LZ4.decodeBlock(e.slice(5), o),
                this.dataView = new DataView(o.buffer),
                this.index = 0,
                this.maxIndex = this.dataView.byteLength
            }
        }, {
            key: "endOfBuffer",
            get() {
                return this.index >= this.maxIndex
            }
        }]),
        e
    })(),
    X = (()=>{
        function e() {
            _classCallCheck(this, e),
            this.arrayBuffer = []
        }
        return _createClass(e, [{
            key: "writeUint8",
            value(e) {
                return 0 > (e |= 0) || 255 < e ? void console.error("value out of range [Min: 0, Max: 255, Value: " + e + "]") : void this.arrayBuffer.push(e)
            }
        }, {
            key: "writeInt8",
            value(e) {
                return -128 > (e |= 0) || 127 < e ? void console.error("value out of range [Min: -128, Max: 127, Value: " + e + "]") : void this.arrayBuffer.push(e)
            }
        }, {
            key: "writeUint16",
            value(e) {
                return 0 > (e |= 0) || 65535 < e ? void console.error("value out of range [Min: 0, Max: 65535, Value: " + e + "]") : void this.arrayBuffer.push(e, e >> 8)
            }
        }, {
            key: "writeInt16",
            value(e) {
                return -32768 > (e |= 0) || 32767 < e ? void console.error("value out of range [Min: -32768, Max: 32767, Value: " + e + "]") : void this.arrayBuffer.push(e, e >> 8)
            }
        }, {
            key: "writeUint32",
            value(e) {
                return 0 > (e |= 0) || 4294967295 < e ? void console.error("value out of range [Min: 0, Max: 4294967295, Value: " + e + "]") : void this.arrayBuffer.push(e, e >> 8, e >> 16, e >> 24)
            }
        }, {
            key: "writeInt32",
            value(e) {
                return -2147483648 > (e |= 0) || 2147483647 < e ? void console.error("value out of range [Min: -2147483648, Max: 2147483647, Value: " + e + "]") : void this.arrayBuffer.push(e, e >> 8, e >> 16, e >> 24)
            }
        }, {
            key: "writeString",
            value(e) {
                for (let t, o = 0; o < e.length; o++)
                    t = e.charCodeAt(o),
                    this.writeUint8(t);
                this.writeUint8(0)
            }
        }, {
            key: "writeString8",
            value(e) {
				this.writeUint8(e.length);
                for (let t, o = 0; o < e.length; o++)
                    t = e.charCodeAt(o),
                    this.writeUint8(t);
            }
        }, {
            key: "writeEncodedString",
            value(e) {
                const t = unescape(encodeURIComponent(e));
                this.writeString(t)
            }
        }, {
            key: "writeUTF16String",
            value(e) {
                for (let t, o = 0; o < e.length; o++)
                    t = e.charCodeAt(o),
                    this.writeUint16(t);
                this.writeUint16(0)
            }
        }, {
            key: "writeUTF16StringNonZero",
            value(e) {
                for (let t, o = 0; o < e.length; o++)
                    t = e.charCodeAt(o),
                    this.writeUint16(t)
            }
        }, {
            key: "writeString16",
            value(e) {
				this.writeUint8(e.length);
                for (let t, o = 0; o < e.length; o++)
                    t = e.charCodeAt(o),
                    this.writeUint16(t);
            }
        }, {
            key: "reset",
            value() {
                this.arrayBuffer = []
            }
        }, {
            key: "buffer",
            get() {
                return new Uint8Array(this.arrayBuffer).buffer
            }
        }]),
        e
    })(),
	sq = (()=>{
		function e(tab) {
			_classCallCheck(this, e),
			this.tab = tab,
			this.ws = new WebSocket("wss://" + q.address),
			this.ws.binaryType = "arraybuffer",
			this.ws.onopen = (() => {
				this.onOpen()
			}),
			this.ws.onmessage = ((e) => {
				this.onMessage(e)
			}),
			this.ws.onclose = (() => {
				this.onClose()
			}),
			this.ws.onerror = (() => {
				this.onError()
			}),
			this.protocolKey = null,
            this.clientKey = null,
			this.offset = {
				x: 0,
				y: 0
			},
			this.center = {
				x: 0,
				y: 0
			},
			this.bound = {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			},
			this.cells = new Map,
			this.isSpectating = false,
			this.specNo = tab-3,
			this.secX = this.specNo % 3 || 3,
			this.secY = this.specNo < 4 ? 1 : this.specNo < 7 ? 2 : this.specNo < 10 ? 3 : this.specNo < 13 ? 4 : this.specNo < 16 && 5
		}
		return _createClass(e, [{
			key: "onOpen",
			value() {
				console.log(`${this.tab} opened`),
				this.handshake(),
				setTimeout(() => {
					this.viewMap()
				}, 1000)
			}
		}, {
			key: "onMessage",
			value(e) {
				let data = new DataView(e.data),
					shifted = this.protocolKey ? j.shiftMessage(data, this.protocolKey ^ le.versionInt) : data,
					buf = new D(shifted),
					opcode = buf.readUInt8()
				switch (opcode) {
					case 18:
						//console.log("Reseting World..."),
						this.protocolKey = j.shiftKey(this.protocolKey),
						this.cells.clear()
						break;
					case 241:
						this.protocolKey = buf.readUInt32(),
						this.clientKey = j.generateClientKey(buf);
						break;
					case 255:
						buf.decompress();
						switch (buf.readUInt8()) {
							case 16:
								le.refreshTime();
								for (var o = "on" === settings.eatAnimation, i = buf.readUInt16(); i--; ) {
									const i = buf.readUInt32()
										, s = buf.readUInt32()
										, n = this.cells.get(s)
										, a = this.cells.get(i)
									n && a && (n.staticX = a.staticX,
									n.staticY = a.staticY,
									n.radius = n.animRadius,
									n.lastUpdateTime = le.time,
									n.fadeStartTime = le.time,
									this.cells.delete(s),
									n.isFood || setTimeout(() => {
										re.effectPoints.add({
											x: n.staticX - (n.tab === 1 ? 0 : n.tab === 2 ? G.getOffset2.x : n.tab === 3 ? G.getOffset3.x : 3 < n.tab && q.mapTabs[n.tab-4].getOffset.x),
											y: n.staticY - (n.tab === 1 ? 0 : n.tab === 2 ? G.getOffset2.y : n.tab === 3 ? G.getOffset3.y : 3 < n.tab && q.mapTabs[n.tab-4].getOffset.y),
											time: le.time,
											scale: 1/* > ~~(Math.sqrt(n.mass)/10) ? 1 : ~~(Math.sqrt(n.mass)/10)*/,
											color: n.colorObject.hex
										})
									}, 1000))
								}
								for (; !buf.endOfBuffer; ) {
									const o = buf.readUInt32();
									if (0 === o)
										break;
									const i = this.cells.get(o) || (new M(o, this.tab))
									  , s = buf.readInt32()
									  , n = buf.readInt32()
									  , a = buf.readUInt16();
									this.cells.set(o, i);
									i.init ? (i.animate(),
									i.animX = i.x,
									i.animY = i.y,
									i._000308 = i.animRadius) : (i.x = i.animX = s,
									i.y = i.animY = n,
									i.animRadius = i._000308 = i.radius = a,
									i._000307 = le.time,
									i.init = !0),
									i.staticX = s,
									i.staticY = n,
									i.radius = a,
									i.lastUpdateTime = le.time;
									const r = buf.readUInt8()
									  , l = 128 & r ? buf.readUInt8() : 0;
									if (1 & r && (i.isVirus = !0),
									2 & r) {
										const t = buf.readUInt8()
										  , o = buf.readUInt8()
										  , s = buf.readUInt8();
										i.colorObject.set(t, o, s)
									}
									4 & r && (i.skin = buf.readUTF8string()),
									8 & r && (i.nick = buf.readEscapedUTF8string()),
									32 & r && (i.isEjected = !0),
									1 & l && (i.isFood = !0),
									2 & l && (i.isFriend = !0),
									4 & l && (i.account = buf.readUInt32())
								}
								for (i = buf.readUInt16(); i--; ) {
									const o = buf.readUInt32();
									this.cells.get(o) && this.cells.delete(o)
								}
								break;
							case 64:
								const _e = 0 | buf.readFloat64()
									, _t = 0 | buf.readFloat64()
									, _o = 0 | buf.readFloat64()
									, _i = 0 | buf.readFloat64()
								14141 > _o - _e || 14141 > _i - _t || (this.offset.x = 7071 + _e,
								this.offset.y = 7071 + _t)
								break;
							default:
								break;
						}
					default:
						//console.log(`unknown message opcode ${opcode}`);
						break;
				}
			}
		}, {
			key: "onError",
			value() {
				console.error(`${this.tab} errored out!`)
			}
		}, {
			key: "onClose",
			value() {
				console.error(`${this.tab} closed!`),
				this.cells.clear()//,
				//this.reconnect()
			}
		}, {
			key: "send",
			value(e) {
				this.ws.readyState === 1 && this.ws.send(e)
			}
		}, {
			key: "sendPacket",
			value(e) {
				if (!this.clientKey)
					return;
				e = j.shiftMessage(e, this.clientKey),
				this.clientKey = j.shiftKey(this.clientKey)
				this.send(e.buffer)
			}
		}, {
			key: "handshake",
			value() {
				let data;
				data = new DataView(new ArrayBuffer(5));
				data.setUint8(0, 254, !0);
				data.setUint32(1, 22, !0);
				this.send(data.buffer);
				data = new DataView(new ArrayBuffer(5));
				data.setUint8(0, 255, !0);
				data.setUint32(1, le.versionInt, !0);
				this.send(data.buffer);
			}
		}, {
			key: "viewMap",
			value() {
				let data;
				data = new DataView(new ArrayBuffer(1));
				data.setUint8(0, 1, !0);
				this.sendPacket(data);
				data = new DataView(new ArrayBuffer(1));
				data.setUint8(0, 18, !0);
				this.sendPacket(data);
				data = new DataView(new ArrayBuffer(13));
				data.setUint8(0, 16, !0);
				data.setInt32(1, ~~(-10000 + this.secX * 5000 + this.offset.x), !0);
				data.setInt32(5, ~~(-8485.2 + this.secY * 2828.4 + this.offset.y), !0);
				data.setInt32(9, this.protocolKey, !0);
				this.sendPacket(data);
			}
		}, {
			key: "reconnect",
			value() {
				this.protocolKey = null,
				this.clientKey = null,
				this.ws.close(),
				this.ws = null,
				this.ws = new WebSocket("wss://" + q.address),
				this.ws.binaryType = "arraybuffer",
				this.ws.onopen = (() => {
					this.onOpen()
				}),
				this.ws.onmessage = ((e) => {
					this.onMessage(e)
				}),
				this.ws.onclose = (() => {
					this.onClose()
				}),
				this.ws.onerror = (() => {
					this.onError()
				})
			}
		}, {
			key: "getOffset",
			get() {
				return this.center.x = this.offset.x - G.offset.x,
                this.center.y = this.offset.y - G.offset.y,
                this.center
			}
		}]),
		e
	})(),
    q = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.ip = "",
            this.Tab1 = null,
            this.connectedTab1 = !1,
            this.Tab2 = null,
            this.connectedTab2 = !1,
            this.Tab3 = null,
            this.connectedTab3 = !1,
            this.packetCount = {
                in: 0,
                out: 0
            },
			this.mapTabs = [],
            this.ipBox = r("#ip-box")
            this.integrity = true
        }
        return _createClass(e, [{
            key: "init",
            value(e) {
                this.integrity = e.indexOf('agar.io')>-1
                e && (this.disconnect(),
                this.resetData(),
                j.init(),
                G.reset(),
                this.address = e,
                this.Tab1 = new WebSocket("wss://" + this.address),
                this.Tab1.binaryType = "arraybuffer",
                this.Tab1.onopen = (()=>{
                    window.Tab1WS = this.Tab1,
                    window.Tab1 = this.onOpen(1),
                    window.Tab1
                }),
                this.Tab1.onmessage = (e=>{
                    this.onMessage(e, 1)
                }),
                this.Tab1.onclose = (()=>{
                    this.onClose(1)
                }),
                this.Tab1.onerror = (()=>{
                    this.onError(1)
                }),
                settings.multiboxMode === "on" && (this.Tab2 = new WebSocket("wss://" + e),
                this.Tab2.binaryType = "arraybuffer",
                this.Tab2.onopen = (()=>{
                    window.Tab2WS = this.Tab2,
                    window.Tab2 = this.onOpen(2),
                    window.Tab2
                }),
                this.Tab2.onmessage = (e=>{
                    this.onMessage(e, 2)
                }),
                this.Tab2.onclose = (()=>{
                    this.onClose(2)
                }),
                this.Tab2.onerror = (()=>{
                    this.onError(2)
                })),
                this.Tab3 = new WebSocket("wss://" + e),
                this.Tab3.binaryType = "arraybuffer",
                this.Tab3.onopen = (()=>{
                    window.Tab3WS = this.Tab3,
                    window.Tab3 = this.onOpen(3),
                    window.Tab3
                }),
                this.Tab3.onmessage = (e=>{
                    this.onMessage(e, 3)
                }),
                this.Tab3.onclose = (()=>{
                    this.onClose(3)
                }),
                this.Tab3.onerror = (()=>{
                    this.onError(3)
                }),
				m.alert("HSLO", "Connecting to game server " + r("#party-token").val() + "."),
                console.info("Connecting to: " + e));
				this.mapTabs.length > 0 && this.mapTabs.forEach(t => t.reconnect());
                if (window.user.startedBots) {
                    window.connection.send(new Uint8Array([1]).buffer)
                    window.user.startedBots = false
                }
                window.bots.ai = false;
                window.user.isAlive = false;
                window.game.url = `wss://${this.address}`
            }
        }, {
			key: "reconnect",
			value(tab) {
				if (tab === 1) {
					q.Tab1.close(),
					q.Tab1 = null,
					j.protocolKey = null,
					j.clientKey = null,
					Q.loggedIn = !1,
					setTimeout(()=>{
						console.log("Reconnecting Tab One"),
						q.Tab1 = new WebSocket("wss://" + q.address),
						q.Tab1.binaryType = "arraybuffer",
						q.Tab1.onopen = (()=>{
							q.onOpen(1)
						}),
						q.Tab1.onmessage = (e=>{
							q.onMessage(e, 1)
						}),
						q.Tab1.onclose = (()=>{
							q.onClose(1)
						}),
						q.Tab1.onerror = (()=>{
							q.onError(1)
						})
					}, 100)
				} else if (tab === 2) {
					if (settings.multiboxMode === "off") return m.alert("HSLO", "You've to turn on multibox mode first!");
					q.Tab2.close(),
                    q.Tab2 = null,
                    j.protocolKey2 = null,
                    j.clientKey2 = null,
                    Q.loggedIn2 = !1,
                    setTimeout(()=>{
                        console.log("Reconnecting Tab Two"),
                        q.Tab2 = new WebSocket("wss://" + q.address),
                        q.Tab2.binaryType = "arraybuffer",
                        q.Tab2.onopen = (()=>{
                            q.onOpen(2)
                        }),
                        q.Tab2.onmessage = (e=>{
                            q.onMessage(e, 2)
                        }),
                        q.Tab2.onclose = (()=>{
                            q.onClose(2)
                        }),
                        q.Tab2.onerror = (()=>{
                            q.onError(2)
                        })
                    }, 100)
				} else if (tab === 3) {
					q.Tab3.close(),
                    q.Tab3 = null,
                    j.protocolKey3 = null,
                    j.clientKey3 = null,
                    setTimeout(()=>{
                        console.log("Reconnecting Tab Three"),
                        q.Tab3 = new WebSocket("wss://" + q.address),
                        q.Tab3.binaryType = "arraybuffer",
                        q.Tab3.onopen = (()=>{
                            q.onOpen(3)
                        }),
                        q.Tab3.onmessage = (e=>{
                            q.onMessage(e, 3)
                        }),
                        q.Tab3.onclose = (()=>{
                            q.onClose(3)
                        }),
                        q.Tab3.onerror = (()=>{
                            q.onError(3)
                        })
                    }, 100)
				} else if (tab === 4) {
					if (this.mapTabs.length === 0) for (let i = 4; i < 19; i++) this.mapTabs.push(new sq(i));
					else this.mapTabs.forEach(t => t.reconnect());
				}
			}
		}, {
            key: "disconnect",
            value() {
                this.Tab1 && this.Tab1.close && (this.Tab1.close(),
                this.Tab1.onopen = null,
                this.Tab1.onmessage = null,
                this.Tab1.onclose = null,
                this.Tab1.onerror = null),
                this.Tab2 && this.Tab2.close && (this.Tab2.close(),
                this.Tab2.onopen = null,
                this.Tab2.onmessage = null,
                this.Tab2.onclose = null,
                this.Tab2.onerror = null),
                this.Tab1 = null,
                this.connectedTab1 = !1,
                Q.loggedIn = !1,
                this.Tab2 = null,
                this.connectedTab2 = !1,
				Q.loggedIn2 = !1,
				this.Tab3 = null,
                this.connectedTab3 = !1,
                this.address = "not connected"
            }
        }, {
            key: "resetData",
            value() {
                I.cellsTab1.clear(),
                I.cellsIDTab1.clear(),
                I.myCellsTab1.clear(),
                I.cellsTab2.clear(),
                I.cellsIDTab2.clear(),
                I.myCellsTab2.clear(),
                I.cellsTab3.clear(),
                I.cellsIDTab3.clear(),
                I.myCellsTab3.clear(),
                A.isAliveTab1 = !1,
                A.isAliveTab2 = !1,
                A.sendAliveData(0)
            }
        }, {
            key: "send",
            value(e, t) {
                this.packetCount.out++,
                1 === t && this.Tab1Connected ? this.Tab1.send(e) : 2 == t && this.Tab2Connected ? this.Tab2.send(e) : 3 == t && this.Tab3Connected && this.Tab3.send(e)
            }
        }, {
            key: "onOpen",
            value(e) {
				e === 3 && setTimeout(() => { Q.spectate(3) }, 100),
                Q.init(e),
				re.globalRotation = 0,
                m.alert("HSLO", "Tab " + e + " connected")
            }
        }, {
            key: "onMessage",
            value(e, t) {
                this.packetCount.in++,
                Z.getBuffer(e, t)
            }
        }, {
            key: "onClose",
            value(e) {
                this.Tab1Connected || this.Tab2Connected || this.Tab3Connected || z.open(),
                e === 1 && (L.isSpectating = !1,
                L.freeSpectate = !1),
                Z.clearCells(e),
                m.alert("HSLO", "Tab " + e + " disconnected"),
                console.log("Websocket Closed")
            }
        }, {
            key: "onError",
            value() {
                console.log("Websocket errored out!")
            }
        }, {
            key: "address",
            set(e) {
                this.ip = e,
                this.ipBox.text("IP: [" + e + "]"),
                _e.serverToken(),
				_es.host(),
				_es.tag(),
                _e.join(1),
                _e.join(2),
                _e.region(),
                _e.gameMode(),
                se.teammates.clear(),
                ses.teammates.clear()
            },
            get() {
                return this.ip
            }
        }, {
            key: "Tab1Connected",
            get() {
                return this.Tab1 && this.Tab1.readyState === this.Tab1.OPEN
            }
        }, {
            key: "Tab2Connected",
            get() {
                return this.Tab2 && this.Tab2.readyState === this.Tab2.OPEN
            }
        }, {
            key: "Tab3Connected",
            get() {
                return this.Tab3 && this.Tab3.readyState === this.Tab3.OPEN
            }
        }]),
        e
    })()),
    j = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.protocolKey = null,
                this.protocolKey2 = null,
                this.protocolKey3 = null,
                this.clientKey = null,
                this.clientKey2 = null,
                this.clientKey3 = null
            }
        }, {
            key: "generateClientKey",
            value(e) {
                let t = new Uint8Array(e.dataView.buffer,e.index);
                for (var o = null, i = q.address.match(/([^:]*)(:\d+)/)[1], s = i.length + t.byteLength, n = new Uint8Array(s), a = 0; a < i.length; a++)
                    n[a] = i.charCodeAt(a);
                n.set(t, i.length);
                for (var r = new DataView(n.buffer), l = s - 1, h = 0 | 4 + (-4 & l - 4), c = 255 ^ l, _ = 0; 3 < l; )
                    o = 0 | Math.imul(r.getInt32(_, !0), 1540483477),
                    c = (0 | Math.imul(o >>> 24 ^ o, 1540483477)) ^ (0 | Math.imul(c, 1540483477)),
                    l -= 4,
                    _ += 4;
                switch (l) {
                case 3:
                    c = n[h + 2] << 16 ^ c,
                    c = n[h + 1] << 8 ^ c;
                    break;
                case 2:
                    c = n[h + 1] << 8 ^ c;
                    break;
                case 1:
                    break;
                default:
                    o = c
                }
                return o != c && (o = 0 | Math.imul(n[h] ^ c, 1540483477)),
                o ^= c = o >>> 13,
                (o = 0 | Math.imul(o, 1540483477)) ^ o >>> 15
            }
        }, {
            key: "shiftKey",
            value: e=>(e = 0 | Math.imul(e, 1540483477),
            e = 114296087 ^ (0 | Math.imul(e >>> 24 ^ e, 1540483477)),
            (e = 0 | Math.imul(e >>> 13 ^ e, 1540483477)) >>> 15 ^ e)
        }, {
            key: "shiftMessage",
            value(e, t) {
                for (var o = 0; o < e.byteLength; o++)
                    e.setUint8(o, e.getUint8(o) ^ 255 & t >>> o % 4 * 8);
                return e
            }
        }]),
        e
    })()),
    window.classj = j,
    Z = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "getBuffer",
            value(e, t) {
                e = new DataView(e.data),
                1 == t ? j.protocolKey && (e = j.shiftMessage(e, j.protocolKey ^ le.versionInt)) : 2 == t ? j.protocolKey2 && (e = j.shiftMessage(e, j.protocolKey2 ^ le.versionInt)) : j.protocolKey3 && (e = j.shiftMessage(e, j.protocolKey3 ^ le.versionInt)),
                this.parse(e, t)
            }
        }, {
            key: "parse",
            value(e, t) {
                const o = new D(e)
                  , i = o.readUInt8();
                17 === i ? this.getSpectateData(o, t) : 
                18 === i ? this.clearCells(t) : 
                32 === i ? this.getMyCellId(o, t) : 
                50 === i ? 1 === t && this.getLeaderboardTeam(o) : 
                53 === i ? 1 === t && this.getLeaderboardFFA(o) : 
                54 === i ? 1 === t && this.getLeaderboard(o) : 
                69 === i ? 3 === t && this.getGhost(o) : 
                85 === i && 3 != t ? y.display(t) : 
                102 === i ? (this.mobileData(o, t), 20 > o.dataView.byteLength && (1 === t ? $.logout() : ee.logout())) : 
                103 === i ? 1 === t ? (Q.loggedIn = !0, Q.freeCoins(1)) : (Q.loggedIn2 = !0, Q.freeCoins(2)) : 
                226 === i ? this.ping(o, t) : 
                241 === i ? this.getReceiveKey(o, t) : 
                16 === i ? this.worldUpdate(o, t) :
				64 === i ? this.borderUpdate(o, t) :
                255 === i && this.compressedPacket(o, t)// : console.log("Unknown message opcode: " + i);
            }
        }, {
            key: "getGhost",
            value(e) {
                this.ghostCells = [];
                let o = e.readUInt16();
                for (let i = 0; i < o; i++) {
                    let o = e.readInt32();
                    let i = e.readInt32();
                    let s = e.readUInt32();
                    e.index++;
                    let n = ~~Math.sqrt(100 * s);
                    this.ghostCells.push({
                        x: o,
                        y: i,
                        mass: s,
                        size: n
                    })
                }
                window.ghostCells = this.ghostCells;
				for (te.top20Total = 0, i = ghostCells.length; i--;) te.top20Total += ghostCells[i].mass;
            }
        }, {
            key: "mobileData",
            value(e, t) {
                console.log(`Tab ${t} mobile data: `);
                console.log(e);
				if (20 > e.dataView.byteLength) {
					console.log(`Mobile Data: Tab ${t} logged out ( someone logged in from somewhere else )`);
				};
				if (e.maxIndex > 1000) {
					console.log(`Mobile Data: Tab ${t} receives Agar.io UID`);
				};
            }
        }, {
            key: "calcSector",
            value(t, x, y) {
                let offset = t === 1 ? G.offset : t === 2 ? G.offset2 : t === 3 && G.offset3;
                let newX = x && x - offset.x;
                let newY = y && y - offset.y;
                //console.log(`Calc. result: ${newX} ${newY}`);
                let prefix = (newY >= -14142 && newY <= -4242.6) ? "A" : (newY >= -4242.6 && newY <= -1414.2) ? "B" : (newY >= -1414.2 && newY <= 1414.2) ? "C" : (newY >= 1414.2 && newY <= 4242.6) ? "D" : (newY >= 4242.6 && newY <= 14142) && "E";
                let suffix = (newX >= -14142 && newX <= -4242.6) ? "1" : (newX >= -4242.6 && newX <= -1414.2) ? "2" : (newX >= -1414.2 && newX <= 1414.2) ? "3" : (newX >= 1414.2 && newX <= 4242.6) ? "4" : (newX >= 4242.6 && newX <= 14142) && "5";
                return prefix + suffix;
            }
        }, {
            key: "getSpectateData",
            value(e, t) {
                3 !== t ? ((2 !== t || A.isAlive) && (L.spectatePoints.x = e.readFloat32(),
                L.spectatePoints.y = e.readFloat32(),
                L.autoZoomViewport = e.readFloat32())) : (3 === t && (L.Tab3SpectatePoints.x = e.readFloat32(),
                L.Tab3SpectatePoints.y = e.readFloat32(),
                L.Tab3Viewport = e.readFloat32()));
            }
        }, {
            key: "clearCells",
            value(e) {
                console.log("Reseting World..."),
                1 == e ? (j.protocolKey && (j.protocolKey = j.shiftKey(j.protocolKey)),
                console.log(`Reset Protocol Key 1: ${j.protocolKey}`)) : 2 == e ? (j.protocolKey2 && (j.protocolKey2 = j.shiftKey(j.protocolKey2)),
                console.log(`Reset Protocol Key 2: ${j.protocolKey2}`)) : (j.protocolKey3 && (j.protocolKey3 = j.shiftKey(j.protocolKey3)),
                console.log(`Reset Protocol Key 3: ${j.protocolKey3}`)),
                1 == e ? (I.cellsTab1.clear(),
                I.cellsIDTab1.clear(),
                I.myCellsTab1.clear(),
                console.log("Clearing tab 1 world")) : 2 == e ? (I.cellsTab2.clear(),
                I.cellsIDTab2.clear(),
                I.myCellsTab2.clear(),
                console.log("Clearing tab 2 world")) : (I.cellsTab3.clear(),
                I.cellsIDTab3.clear(),
                I.myCellsTab3.clear(),
                console.log("Clearing tab 3 world"))
            }
        }, {
            key: "getMyCellId",
            value(e, t) {
                const o = 1 === t ? I.cellsIDTab1 : 2 === t ? I.cellsIDTab2 : I.cellsIDTab3
                  , i = e.readUInt32();
                o.add(i);
            }
        }, {
            key: "getLeaderboard",
            value(e) {
                te.clear();
                let t, o = 0;
                for (e.readUInt16(); !e.endOfBuffer; ) {
                    o++;
                    let i = "unnamed cell"
                      , s = !1
                      , n = !1
                      , a = !1;
                    1 & (t = e.readUInt8()) && (o = e.readUInt16()),
                    2 & t && (i = e.readEscapedUTF8string()),
                    4 & t && (s = e.readUInt32()),
                    8 & t && (n = !0,
                    i = A.nick),
                    16 & t && (a = !0),
                    (11 > o || n) && te.add(i, o, n, a, s),
					te.playersAmount = o
                }
                te.update()
            }
        }, {
            key: "getLeaderboardFFA",
            value(e) {
                te.clear();
                for (let t, o = 0; !e.endOfBuffer; ) {
                    o++;
                    let i = "unnamed cell"
                      , s = !1
                      , n = !1
                      , a = !1;
                    1 & (t = e.readUInt8()) && (o = e.readUInt16()),
                    2 & t && (i = e.readEscapedUTF8string()),
                    4 & t && (s = e.readUInt32()),
                    8 & t && (n = !0,
                    i = A.nick),
                    16 & t && (a = !0),
                    (11 > o || n) && te.add(i, o, n, a, s),
					te.playersAmount = o
                }
                te.update()
            }
        }, {
            key: "getLeaderboardTeam",
            value(e) {
                te.clear(),
                e.readUInt32(),
                te.team(e.readFloat32(), e.readFloat32(), e.readFloat32())
            }
        }, {
            key: "getReceiveKey",
            value(e, t) {
                1 == t ? (j.protocolKey = e.readUInt32(),
                j.clientKey = j.generateClientKey(e, t),
                console.log(`Protocol Key 1: ${j.protocolKey} | Client Key 1: ${j.clientKey}`)) : 2 == t ? (j.protocolKey2 = e.readUInt32(),
                j.clientKey2 = j.generateClientKey(e, t),
                console.log(`Protocol Key 2: ${j.protocolKey2} | Client Key 2: ${j.clientKey2}`)) : (j.protocolKey3 = e.readUInt32(),
                j.clientKey3 = j.generateClientKey(e, t),
                console.log(`Protocol Key 3: ${j.protocolKey3} | Client Key 3: ${j.clientKey3}`))
            }
        }, {
            key: "compressedPacket",
            value(e, t) {
                e.decompress();
                const o = e.readUInt8();
                16 === o ? this.worldUpdate(e, t) : 64 === o && this.borderUpdate(e, t)
            }
        }, {
            key: "worldUpdate",
            value(e, t) {
                le.refreshTime();
                for (var o = "on" === settings.eatAnimation, i = e.readUInt16(); i--; ) {
                    const i = e.readUInt32()
                      , s = e.readUInt32();
                    o && I.eatCell(i, s, t)
                }
                for (; !e.endOfBuffer; ) {
                    const o = e.readUInt32();
                    if (0 === o)
                        break;
                    const i = I.getCell(o, t)
                      , s = e.readInt32()
                      , n = e.readInt32()
                      , a = e.readUInt16();
                    i.init ? (i.animate(),
                    i.animX = i.x,
                    i.animY = i.y,
                    i._000308 = i.animRadius) : (i.x = i.animX = s,
                    i.y = i.animY = n,
                    i.animRadius = i._000308 = i.radius = a,
                    i._000307 = le.time,
                    i.init = !0),
                    i.staticX = s,
                    i.staticY = n,
                    i.radius = a,
                    i.lastUpdateTime = le.time;
                    const r = e.readUInt8()
                      , l = 128 & r ? e.readUInt8() : 0;
                    if (1 & r && (i.isVirus = !0),
                    2 & r) {
                        const t = e.readUInt8()
                          , o = e.readUInt8()
                          , s = e.readUInt8();
                        i.colorObject.set(t, o, s)
                    }
                    4 & r && (i.skin = e.readUTF8string()),
                    8 & r && (i.nick = e.readEscapedUTF8string()),
                    32 & r && (i.isEjected = !0),
                    1 & l && (i.isFood = !0),
                    2 & l && (i.isFriend = !0),
                    4 & l && (i.account = e.readUInt32())
                }
                for (i = e.readUInt16(); i--; ) {
                    const o = e.readUInt32();
                    I.removeCell(o, t)
                }
            }
        }, {
            key: "borderUpdate",
            value(e, t) {
                const o = 0 | e.readFloat64()
                  , i = 0 | e.readFloat64()
                  , s = 0 | e.readFloat64()
                  , n = 0 | e.readFloat64();
                1 === t ? G.update(o, i, s, n) : 2 === t ? G.updateOffset2(o, i, s, n) : G.updateOffset3(o, i, s, n)
            }
        }, {
            key: "ping",
            value(e, t) {
                const o = e.readUInt16();
                Q.pong(o, t)
            }
        }]),
        e
    })()),
    Q = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.loggedIn = !1,
            this.loggedIn2 = !1,
			this.triedCoins = !1,
			this.triedCoins2 = !1;
			if (settings.useBots === "on") {
				this.myTurn = !1;
			} else {
				this.myTurn = !0;
			};
        }
        return _createClass(e, [{
            key: "init",
            value(e) {
                this.handshake1(e),
                this.handshake2(e),
                1 === e ? (q.connectedTab1 = !0,
                this.fbToken()) : 2 === e ? (q.connectedTab2 = !0,
                this.googleToken()) : 3 === e && (q.connectedTab3 = !0,
				this.unknownToken()),
                console.log("Connected to: " + q.address)
            }
        }, {
            key: "createView",
            value: e=>new DataView(new ArrayBuffer(e))
        }, {
            key: "connected",
            value: e=>1 === e && q.connectedTab1 || 2 === e && q.connectedTab2 || 3 === e && q.connectedTab3
        }, {
            key: "sendPacket",
            value(e, t) {
                if(q.integrity == false) return q.send(e.buffer, t)
                if (1 === t) {
                    if (!j.clientKey)
                        return;
                    e = j.shiftMessage(e, j.clientKey),
                    j.clientKey = j.shiftKey(j.clientKey)
                } else if (2 === t) {
                    if (!j.clientKey2)
                        return;
                    e = j.shiftMessage(e, j.clientKey2),
                    j.clientKey2 = j.shiftKey(j.clientKey2)
                } else {
                    if (!j.clientKey3)
                        return;
                    e = j.shiftMessage(e, j.clientKey3),
                    j.clientKey3 = j.shiftKey(j.clientKey3)
                }
                q.send(e.buffer, t)
            }
        }, {
            key: "handshake1",
            // handshake 1
            value(e) {
                const t = this.createView(5);
                t.setUint8(0, 254, !0),
                t.setUint32(1, 22, !0),
                // 22 = protocol version
                q.send(t.buffer, e)
            }
        }, {
            key: "handshake2",
            // handshake 2
            value(e) {
                const t = this.createView(5);
                t.setUint8(0, 255, !0),
                t.setUint32(1, le.versionInt, !0),
                q.send(t.buffer, e)
            }
        }, {
            key: "mouse",
            value(e, t, tab) {
                const o = tab || A.controllingTab || 1;
                if (this.connected(o)) {
                    const i = 1 == o ? j.protocolKey : 2 === o ? j.protocolKey2 : 3 === o && j.protocolKey3
                      , s = this.createView(13);
                    s.setUint8(0, 16, !0),
                    s.setInt32(1, e, !0),
                    s.setInt32(5, t, !0),
                    s.setInt32(9, i, !0),
                    this.sendPacket(s, o)
                }
                //console.log(`${e} ${t}`)
				window.user.mouseX = e - (A.controllingTab === 1 ? G.offset.x : G.offset2.x);
                window.user.mouseY = t - (A.controllingTab === 1 ? G.offset.y : G.offset2.y);
                if (window.user.startedBots && window.user.isAlive)
                    window.connection.send(window.buffers.mousePosition(window.user.mouseX, window.user.mouseY));
            }
        }, {
            key: "spectate",
            // spectate
            value(e) {
                const t = e || 1;
                if (this.connected(t) || !A.isAlive && !L.isSpectating || e) {
                    const e = this.createView(1);
                    e.setUint8(0, 1, !0),
                    this.sendPacket(e, t),
                    t != 3 ? L.isSpectating = !0 : L.isSpectating = !1,
                    A.isAlive || (L.targetViewport = .1)
                }
            }
        }, {
            key: "captcha",
            // captcha
            value(e, t) {
                if (this.connected(t)) {
                    console.log("Captcha Token Sent: " + t);
                    const o = e.length;
                    let i = o;
                    const s = this.createView(2 + o);
                    for (s.setUint8(0, 86, !0); i--; )
                        s.setUint8(i + 1, e.charCodeAt(i), !0);
                    s.setUint8(o + 1, 0, !0),
                    this.sendPacket(s, t)
                }
            }
        }, {
            key: "spawn",
            // spawn
            value(tab) {
                const e = tab || A.controllingTab;
				const _this = this;
				try {
					grecaptcha.reset();
                    grecaptcha.reset(y.v2widget);
                    grecaptcha.reset(y.v3widget);
				} catch(e) {};
                if (this.connected(e) || !(A.isAliveTab1 && 1 === e || A.isAliveTab2 && 2 === e) || settings.useBots === "on") {
					grecaptcha.ready(() => {
						grecaptcha.execute(0, {action: 'play'}).then(function(token) { 
							if (_this.myTurn) {
								2 === e && settings.primaryGoogle === "on" || 1 === e && settings.primaryGoogle === "off" ? Q.fbToken(e) : Q.googleToken(e);
								//L.isSpectating = !1;
								const t = 1 === e ? A.nick : A.nick2
								  , o = unescape(encodeURIComponent(t))
								  , i = o.length
								  , c = token.length
								  , s = _this.createView(3 + i + c);
								s.setUint8(0, 0, !0);
								for (let e = 0; e < i; e++)
									s.setUint8(e + 1, o.charCodeAt(e), !0);
								s.setUint8(i + 1, 0, !0);
								for (let l = 0; l < c; l++)
									s.setUint8(l + i + 2, token.charCodeAt(l), !0);
								s.setUint8(c + i + 2, 0, !0);
								_this.sendPacket(s, e);
								//grecaptcha.reset();
			                    //grecaptcha.reset(y.v2widget);
								grecaptcha.reset(y.v3widget);
								//k.useBots === "on" && window.connection.ws.readyState === WebSocket.OPEN && (_this.myTurn = false, _this.spawn());
								/*k.useBots === "on" && window.connection.ws.readyState === WebSocket.OPEN && (_this.myTurn = false, setTimeout(() => {
									_this.spawn()
								}, 1000));*/
							} else if (_this.myTurn === false && window.connection.ws.readyState === WebSocket.OPEN) {
								window.user.captchaToken = token;
								window.connection.send(window.buffers.sendToken(token));
								//grecaptcha.reset();
								//grecaptcha.reset(y.v2widget);
								grecaptcha.reset(y.v3widget);
								//k.useBots === "on" && (_this.myTurn = false, _this.spawn());
								/*k.useBots === "on" && (_this.myTurn = false, setTimeout(() => {
									_this.spawn()
								}, 1000));*/
							}
						})
					})
					Q.spectate(3);
                }
            }
        }, {
            key: "sendToken",
            // send token
            value(e, t, f) {
                if (this.connected(f) && (!this.loggedIn || 1 !== f) && (!this.loggedIn2 || 2 !== f)) {
                    let o = e.length
                      , n = le.versionString.length
                      , a = [102, 8, 1, 18];
                    this.writeUint32(a, o + n + 23),
                    a.push(8, 10, 82),
                    this.writeUint32(a, o + n + 18),
                    a.push(8, t, 18, n + 8, 8, 5, 18, n);
                    for (var i = 0; i < n; i++)
                        a.push(le.versionString.charCodeAt(i));
                    for (a.push(24, 0, 32, 0, 26),
                    this.writeUint32(a, o + 3),
                    a.push(10),
                    this.writeUint32(a, o),
                    i = 0; i < o; i++)
                        a.push(e.charCodeAt(i));
                    a = new Uint8Array(a);
                    var s = new DataView(a.buffer);
                    this.sendPacket(s, f)
                }
            }
        }, {
            key: "split",
            value(n) {
                const e = n || A.controllingTab;
                //const e = A.controllingTab;
                //console.log("N split: " + n + " E split: " + e)
                if (this.connected(e)) {
                    const t = this.createView(1);
                    t.setUint8(0, 17, !0),
                    this.sendPacket(t, e)
                }
            }
        }, {
            key: "eject",
            value() {
                const e = A.controllingTab;
                if (this.connected(e)) {
                    const t = this.createView(1);
                    t.setUint8(0, 21, !0),
                    this.sendPacket(t, e)
                }
            }
        }, {
            key: "freeSpectate",
            value(tab) {
                if (this.connected(1)) {
                    L.freeSpectate = !L.freeSpectate;
                    const e = this.createView(1);
                    e.setUint8(0, 18, !0),
                    this.sendPacket(e, tab || 1)
                }
            }
        }, {
			key: "freeCoins",
			value(tab) {
				if ((tab === 1 && this.triedCoins) || (tab === 2 && this.triedCoins2)) return;
				//console.log(`Tab ${tab} trying to get free coins. Retry after 1 hour.`);
				m.alert("Miniclip", `Tab ${tab} trying to get free coins. Retry after 1 hour.`);
				setTimeout(() => {
					this.proxyMobileData([8, 1, 18, 18, 8, 110, 242, 6, 13, 10, 11, 104, 111, 117, 114, 108, 121, 66, 111, 110, 117, 115], tab);
				}, 1000);
				tab === 1 ? (this.triedCoins = !0) : (this.triedCoins2 = !0);
				setTimeout(() => {
					tab === 1 ? (Q.triedCoins = !1) : (Q.triedCoins2 = !1);
					Q.freeCoins(tab);
				}, 3600000);
			}
		}, {
			key: "openPotion",
			value(slot, tab) {
				console.log(`[Miniclip] Tab ${tab} trying to open potion ${slot}`);
				//m.alert("Miniclip", `Tab ${tab} trying to open potion ${slot}`);
				setTimeout(() => {
					this.proxyMobileData([8, 1, 18, 7, 8, 124, 226, 7, 2, 8, slot], tab);
				}, 1000);
			}
		}, {
			key: "proxyMobileData",
			value(array, tab) {
				if (array[0] === 8) {
					array.unshift(102);
				};
				array = new Uint8Array(array);
				//console.log(array);
				this.sendPacket(new DataView(array.buffer), tab);
			}
		}, {
            key: "pong",
            value(e, t) {
                if (this.connected(t)) {
                    const o = this.createView(3);
                    o.setUint8(0, 227, !0),
                    o.setUint16(1, e, !0),
                    this.sendPacket(o, t)
                }
            }
        }, {
            key: "fbToken",
            value(tab) {
                if ($.loggedIn) {
                    const e = $.token;
                    this.sendToken(e, 2, tab)
                }
            }
        }, {
            key: "googleToken",
            value(tab) {
                if (ee.loggedIn) {
                    const e = ee.token;
                    this.sendToken(e, 4, tab)
                }
            }
        }, {
            key: "unknownToken",
            value() {
                /*if (ee.loggedIn) {
                    const e = ee.token;
                    this.sendToken(e, 0)
                }*/
				console.log("Preserved Token for tab 3");
            }
        }, {
            key: "writeUint32",
            value(e, t) {
                for (; ; ) {
                    if (0 == (-128 & t))
                        return void e.push(t);
                    e.push(128 | 127 & t),
                    t >>>= 7
                }
            }
        }]),
        e
    })()),
    Y = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "createParty",
            value() {
                r("#loading-screen").append('<div class="info"><i class="fas fa-copyright"></i> 2019 HSLO edited by Mike(JP) and YueAgar_c(HK).</div>'),
                t.finishUp(),
				g.createParty()
            }
        }]),
        e
    })()),
    J = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.address = "snez.org:8080/ws", // ogar, died
            //this.address = "map-server.glitch.me/ws?030", // delta, maybe alive
            this.ogarWS1 = null,
            this.ogarWS2 = null
        }
        return _createClass(e, [{
            key: "init",
            value() {
                const e = this;
                this.ogarWS1 = new WebSocket("wss://" + this.address),
                this.ogarWS1.binaryType = "arraybuffer",
                this.ogarWS1.onopen = (()=>e.onOpen(1)),
                this.ogarWS1.onmessage = (t=>e.onMessage(t, 1)),
                this.ogarWS1.onclose = (()=>e.onClose(1)),
                this.ogarWS1.onerror = (()=>e.onError(1)),
                settings.multiboxMode === "on" && (this.ogarWS2 = new WebSocket("wss://" + this.address),
                this.ogarWS2.binaryType = "arraybuffer",
                this.ogarWS2.onopen = (()=>e.onOpen(2)),
                this.ogarWS2.onmessage = (t=>e.onMessage(t, 2)),
                this.ogarWS2.onclose = (()=>e.onClose(2)),
                this.ogarWS2.onerror = (()=>e.onError(2))),
                console.log("Connecting to Ogario Networks.")
            }
        }, {
			key: "reconnect",
			value(tab) {
				const e = this;
				1 === tab ? (this.ogarWS1.close(),
				this.ogarWS1 = null,
				this.ogarWS1 = new WebSocket("wss://" + this.address),
                this.ogarWS1.binaryType = "arraybuffer",
                this.ogarWS1.onopen = (()=>e.onOpen(1)),
                this.ogarWS1.onmessage = (t=>e.onMessage(t, 1)),
                this.ogarWS1.onclose = (()=>e.onClose(1)),
                this.ogarWS1.onerror = (()=>e.onError(1))) : 2 === tab && settings.multiboxMode === "on" ? (this.ogarWS2.close(),
				this.ogarWS2 = null,
				this.ogarWS2 = new WebSocket("wss://" + this.address),
                this.ogarWS2.binaryType = "arraybuffer",
                this.ogarWS2.onopen = (()=>e.onOpen(2)),
                this.ogarWS2.onmessage = (t=>e.onMessage(t, 2)),
                this.ogarWS2.onclose = (()=>e.onClose(2)),
                this.ogarWS2.onerror = (()=>e.onError(2))) : m.alert("HSLO", "You've to turn on multibox mode first!");
			}
		}, {
            key: "send",
            value(e, t) {
                // t = tab
                (t && t === 2) ? this.ogarWS2.send(e) : this.ogarWS1.send(e)
            }
        }, {
            key: "onOpen",
            value(e) {
                // e = tab
                _e.init(),
                console.log(`Connected to Ogario Networks. (${e})`),
				m.alert("OGARio", `Tab ${e} connected to szymy's server.`)
            }
        }, {
            key: "onMessage",
            value(e, t) {
                // t = tab
                ae.parse(e, t)
            }
        }, {
            key: "onClose",
            value(e) {
                // e = tab
				se.teammates.clear(),
                console.log(`Disconnected from Ogario server. (${e})`),
                m.alert("OGARio", `Tab ${e} disconnected from szymy's server.`)
            }
        }, {
            key: "onError",
            value(e) {
                // e = tab
                console.log(`Connection to Ogario server errored out! (${e})`),
                m.alert("OGARio", `Tab ${e} can not connect to szymy's server.`)
            }
        }, {
            key: "isConnected",
            value(e) {
                // e = tab
                if (e && e === 2) {
                    return this.ogarWS2 && this.ogarWS2.readyState === this.ogarWS2.OPEN
                } else {
                    return this.ogarWS1 && this.ogarWS1.readyState === this.ogarWS1.OPEN
                }
            }
        }]),
        e
    })()),
    Js = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.address = "ddraig.hslo.io",
            this.saigoWS = null
        }
        return _createClass(e, [{
            key: "init",
            value() {
                const e = this;
                settings.spySaigo === "on" && (this.saigoWS = new WebSocket("wss://" + this.address, "main"),
                this.saigoWS.binaryType = "arraybuffer",
                this.saigoWS.onopen = (()=>e.onOpen()),
                this.saigoWS.onmessage = (t=>e.onMessage(t)),
                this.saigoWS.onclose = (()=>e.onClose()),
                this.saigoWS.onerror = (()=>e.onError()))
            }
        }, {
			key: "reconnect",
			value() {
				if (settings.spySaigo === "off") return m.alert("HSLO", "You've to turn on Spy Saigo first!");
				const e = this;
				this.saigoWS.close(),
				this.saigoWS = null,
				this.saigoWS = new WebSocket("wss://" + this.address, "main"),
                this.saigoWS.binaryType = "arraybuffer",
                this.saigoWS.onopen = (()=>e.onOpen()),
                this.saigoWS.onmessage = (t=>e.onMessage(t)),
                this.saigoWS.onclose = (()=>e.onClose()),
                this.saigoWS.onerror = (()=>e.onError())
			}
		}, {
            key: "send",
            value(data) {
				this.isConnected() && this.saigoWS.send(data)
            }
        }, {
            key: "onOpen",
            value() {
                _es.init(),	
                console.log(`Connected to Saigo Networks.`),
                m.alert("Saigo", `Connected.`)
            }
        }, {
            key: "onMessage",
            value(msg) {
                aes.parse(msg)
            }
        }, {
            key: "onClose",
            value() {
				ses.teammates.clear(),
                console.log(`Disconnected from Saigo server.`),
                m.alert("Saigo", `Disconnected.`)
            }
        }, {
            key: "onError",
            value() {
                console.log(`Connection to Saigo server errored out!`)//,
                //m.alert("Saigo", `Failed to connect.`)
            }
        }, {
            key: "isConnected",
            value() {
                return this.saigoWS && this.saigoWS.readyState === this.saigoWS.OPEN
            }
        }]),
        e
    })()),
    _e = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
				try {
					this.handshake(),
					this.tag(),
					this.partyToken(),
					this.serverToken(),
					this.nick(),
					this.nick2(),
					this.skin(),
					this.skin2(),
					this.join(1),
					this.join(2)
				} catch(e) {}
            }
        }, {
            key: "handshake",
            value() {
                const e = new X;
                e.writeUint8(0),
                e.writeUint16(401)
				try {
					J.send(e.buffer, 1),
					J.send(e.buffer, 2)
				} catch(e) {}
            }
        }, {
            key: "sendString",
            value(e, t, f) {
                // f = tab
                if (J.isConnected(f || 1)) {
                    const o = new X;
                    o.writeUint8(e),
                    o.writeUTF16StringNonZero(t)
					try {
						J.send(o.buffer, f || 1)
					} catch(e) {}
                    console.log(e, t)
                }
            }
        }, {
            key: "sendInteger",
            value(e, f) {
                // f = tab
                if (J.isConnected(f || 1)) {
                    const t = new X;
                    t.writeUint8(e)
					try {
						J.send(t.buffer, f || 1)
					} catch(e) {}
                    //,
                    //console.log(e)
                }
            }
        }, {
            key: "nick",
            value() {
                A.nick && this.sendString(10, A.nick, 1)
                //,
                //A.nick2 && this.sendString(10, A.nick2, 2)
            }
        }, {
            key: "nick2",
            value() {
                //A.nick && this.sendString(10, A.nick, 1),
                A.nick2 && this.sendString(10, A.nick2, 2)
            }
        }, {
            key: "tag",
            value() {
                this.sendString(11, A._tag, 1),
                this.sendString(11, A._tag2, 2)
            }
        }, {
            key: "skin",
            value() {
                A.skin && this.sendString(12, "https://i.imgur.com/" + A.skin + ".png", 1)
                //,
                //A.skin2 && this.sendString(12, "https://i.imgur.com/" + A.skin2 + ".png", 2)
            }
        }, {
            key: "skin2",
            value() {
                //A.skin && this.sendString(12, "https://i.imgur.com/" + A.skin + ".png", 1),
                A.skin2 && this.sendString(12, "https://i.imgur.com/" + A.skin2 + ".png", 2)
            }
        }, {
            key: "partyToken",
            value() {
                const e = r("#party-token").val();
                e && this.sendString(15, e, 1);
                e && this.sendString(15, e, 2);
            }
        }, {
            key: "serverToken",
            value() {
                const e = !!q.address && q.address.match(/live-arena-([\w\d]+)\.agar\.io:\d+/);
                e && e[1] && this.sendString(16, e[1], 1);
                e && e[1] && this.sendString(16, e[1], 2);
            }
        }, {
            key: "region",
            value() {
                const e = r("#regions").val().split("-");
                e && e[0] && this.sendString(17, e[0], 1);
                e && e[0] && this.sendString(17, e[0], 2);
            }
        }, {
            key: "gameMode",
            value() {
                this.sendString(18, "PTY", 1);
                this.sendString(18, "PTY", 2);
            }
        }, {
            key: "spawn",
            value(e) {
                //e = tab
                this.sendInteger(1, e)
            }
        }, {
            key: "death",
            value(e) {
                //e= tab
                this.sendInteger(2, e)
            }
        }, {
            key: "join",
            value(e) {
                //e = tab
                this.sendInteger(3, e)
            }
        }, {
            key: "positionMass",
            value(f) {
                //f = tab
                if (J.isConnected(f || 1) && A.isAlive) {
                    const e = new X;
                    e.writeUint8(30),
                    e.writeUint32(f && f === 2 ? se.playerID2 : se.playerID),
                    e.writeInt32((f && f === 2 ? A.x2 : A.x1) - G.offset.x),
                    e.writeInt32((f && f === 2 ? A.y2 : A.y1) - G.offset.y),
                    e.writeUint32(f && f === 2 ? A.mass2 : A.mass1)
                    try {
						J.send(e.buffer, f)
					} catch(e) {}
                }
            }
        }, {
            key: "playerData",
            value(f) {
                //f = tab
                if (J.isConnected(f || 1) && A.isAlive && (f && f === 2 ? se.playerID2 : se.playerID)) {
                    const e = new X;
                    e.writeUint8(20),
                    e.writeUint32(f && f === 2 ? se.playerID2 : se.playerID),
                    e.writeUTF16String(f && f === 2 ? A.nick2 : A.nick),
                    e.writeUTF16String(f && f === 2 ? N.code2url(A.skin2) : N.code2url(A.skin)),
                    e.writeUTF16String("#555555"),
                    e.writeUTF16String(f && f === 2 ? A.colorHexTab2 : A.colorHexTab1),
                    console.log("Sending OGARio Buffer " + f)
					try {
						J.send(e.buffer, f)
					} catch(e) {}
                }
            }
        }, {
            key: "message",
            value(e, t, f) {
                //f = tab
                if (J.isConnected(f || 1) && (f && f === 2 ? se.playerID2 : se.playerID)) {
                    const o = new X;
                    o.writeUint8(100),
                    o.writeUint8(e),
                    o.writeUint32(f && f === 2 ? se.playerID2 : se.playerID),
                    o.writeUint32(0),
                    o.writeUTF16StringNonZero((f && f === 2 ? A.nick2 : A.nick || "unnamed") + ": " + t)
					try {
						J.send(o.buffer, f)
					} catch(e) {}
                }
            }
        }]),
        e
    })()),
    window.class_e = _e,
	_es = new ((() => {
		function e() {
			_classCallCheck(this, e)
		}
		return _createClass(e, [{
			key: "init",
			value() {
				this.nick(),
				this.skin(),
				this.color(),
				this.alive(),
				this.positionMass(),
				this.tag(),
				this.host()//,
				//this.commander(),
				//this.chat()
			}
		}, {
			key: "nick",
			value() {
				const data = new X
					, nick1 = A.nick
					, nick2 = A.nick2;
				console.log(nick1);
				console.log(nick2);
				data.writeUint8(1);
				data.writeString16(nick1);
				data.writeString16(nick2);
				//console.log(data);
				Js.send(data.buffer);
			}
		}, {
			key: "skin",
			value() {
				const data = new X
					, skin1 = A.skin
					, skin2 = A.skin2;
				data.writeUint8(2);
				data.writeUint8(skin1 ? 1 : 0);
				skin1 ? data.writeString8(skin1) : data.writeString8("");
				data.writeUint8(skin2 ? 1 : 0);
				skin2 ? data.writeString8(skin2) : data.writeString8("");
				Js.send(data.buffer);
			}
		}, {
			key: "color",
			value() {
				const data = new X;
				data.writeUint8(3);
				data.writeUint8(A.colorObject.r);
				data.writeUint8(A.colorObject.g);
				data.writeUint8(A.colorObject.b);
				data.writeUint8(A.colorObject2.r);
				data.writeUint8(A.colorObject2.g);
				data.writeUint8(A.colorObject2.b);
				Js.send(data.buffer);
			}
		}, {
			key: "alive",
			value() {
				const data = new X;
				data.writeUint8(4);
				data.writeUint8(Number(A.isAliveTab1));
				data.writeUint8(Number(A.isAliveTab2));
				Js.send(data.buffer);
			}
		}, {
			key: "positionMass",
			value(tab) {
				const data = new X;
				data.writeUint8(5);
				if (tab === 1 && A.isAliveTab1) {
					data.writeUint8(1);
					data.writeInt16(A.x1 - G.offset.x);
					data.writeInt16(A.y1 - G.offset.y);
					data.writeUint32(A.mass1);
				} else if (tab === 2 && A.isAliveTab2) {
					data.writeUint8(2);
					data.writeInt16(A.x2 - G.offset.x);
					data.writeInt16(A.y2 - G.offset.y);
					data.writeUint32(A.mass2);
				};
				Js.send(data.buffer);
			}
		}, {
			key: "tag",
			value() {
				const data = new X
					, tabCount = 1;
				data.writeUint8(6);
				data.writeUint8(tabCount);
				for (let i=0; i<tabCount; i++) data.writeString16(tabCount === 1 ? A.tag : "")
				Js.send(data.buffer);
			}
		}, {
			key: "host",
			value() {
				const data = new X;
				data.writeUint8(7);
				data.writeString8(q.address);
				Js.send(data.buffer);
			}
		}, {
			key: "commander",
			value() {
				const data = new X;
				data.writeUint8(8);
				data.writeInt16(_.canvasX - (A.controllingTab === 1 ? G.offset.x : G.offset2.x));
				data.writeInt16(_.canvasY - (A.controllingTab === 1 ? G.offset.y : G.offset2.y));
				Js.send(data.buffer);
			}
		}, {
			key: "chat",
			value(type, content) {
				const data = new X;
				data.writeUint8(9);
				data.writeUint8(A.controllingTab === 1 ? 0 : 1);
				data.writeUint8(type);
				data.writeString16(content);
				Js.send(data.buffer);
			}
		}])
	})()),
    ae = new ((()=>{
        function e() {
            _classCallCheck(this, e),
			this.connectedIndex = 0,
			this.coronaNote = !1
        }
        return _createClass(e, [{
            key: "parse",
            value(e, f) {
                // f = tab
                e = new DataView(e.data);
                const t = new D(e);
                switch (t.readUInt8()) {
                case 0:
                    this.selfID(t, f);
                    break;
                case 1:
                    this._000054(f);
                    break;
                case 20:
                    /*f === 1 && */this.prePlayersData(t, f);
                    break;
                case 30:
                    /*f === 1 && */this.prePlayersAlive(t, f);
                    break;
                case 96:
                    break;
                case 100:
                    /*f === 1 && */this.chat(t, f)
                }
            }
        }, {
            key: "selfID",
            value(e, f) {
                //f = tab
                f === 1 ? se.playerID = e.readUInt32() : se.playerID2 = e.readUInt32()
            }
        }, {
            key: "_000054",
            value(f) {
                //f = tab
                _e.playerData(f || 1)
                //_e.playerData(1),
                //_e.playerData(2)
            }
        }, {
            key: "prePlayersData",
            value(e, f) {
                //f = tab
                /*if (f && f === 2)
                    return;*/
                const t = e.readUInt32()
                  , o = se.getPlayer(t);
                o.nick = e.readUTF16string(),
                o.skin = e.readUTF16string(),
                e.readUTF16string(),
                o.colorHex = e.readUTF16string()
            }
        }, {
            key: "prePlayersAlive",
            value(e, f) {
                //f = tab
                /*if (f && f === 2)
                    return;*/
                const t = e.readUInt32()
                  , o = se.getPlayer(t);
                o.x = e.readInt32(),
                o.y = e.readInt32(),
                o.mass = e.readUInt32(),
                o.isAlive = 1,
                o.lastUpdateAt = le.time
            }
        }, {
            key: "chat",
            value(e, f) {
                //f = tab
                /*if (f && f === 2)
                    return;*/
                const t = e.readUInt8()
                  , o = (e.readUInt32(),
                e.readUInt32(),
                e.readUTF16string().split(": "))
                  , i = o[0]
                  , s = o[1];
                // {"type":"cmder","x":1505,"y":2304,"date":1230151252}
                if (s.includes("cmder")) {
                    let obj = JSON.parse(s);
                    //console.log(obj);
                    re.commanderPoints.add({
                        x: obj.x + G.offset.x,
                        y: obj.y + G.offset.y,
                        time: obj.date,
						scale: 5
                    })
                } else if (i === "[SERVER]" && (s.includes("connected") || s.includes("Delta"))) {
					++this.connectedIndex//,
					//m.alert("OGARio", `Tab ${this.connectedIndex} connected to szymy's server.`)
				} else if (i === "[SERVER]" && s.includes("#")) {
					!this.coronaNote && m.alert("Coronavirus", "Stay home or I'll kill you!"),
					this.coronaNote = !0
				} else {
                    101 === t ? m.normal(i, s) : 102 === t && m.command(i, s)
                };
            }
        }]),
        e
    })()),
	aes = new ((() => {
		function e() {
			_classCallCheck(this, e)
		}
		return _createClass(e, [{
			key: "parse",
			value(msg) {
				const data = new D(new DataView(msg.data))
					, opcode = data.readUInt8();
				//console.log(opcode);
				switch (opcode) {
					case 1:
						this.selfID(data);
						break;
					case 2:
						this.roomJoin(data);
						break;
					case 3:
						this.roomUpdate(data);
						break;
					case 4:
						this.roomLeave(data);
						break;
					case 5:
						this.chat(data);
						break;
					case 6:
						this.commander(data);
						break;
				};
			}
		}, {
			key: "selfID",
			value(data) {
				ses.saigoID = data.readUInt16();
			}
		}, {
			key: "roomJoin",
			value(data) {
				const roomID = data.readUInt16()
					, tag = data.readString16()
					, count = data.readUInt8();
				console.log("Join Room ID: " + roomID);
				for (let t = 0; t < count; t++) {
					const playerID = data.readUInt16()
						, player = ses.getPlayer(playerID);
					player.roomID = roomID;
					player.tag = tag;
					player.nick = data.readString16();
					player.nick2 = data.readString16();
					const skinType1 = data.readUInt8();
					const skinData1 = data.readString8();
					switch (skinType1) {
						case 0:
							player.skin = '';
							break;
						case 1:
							player.skin = skinData1;
							break;
					};
					const skinType2 = data.readUInt8();
					const skinData2 = data.readString8();
					switch (skinType2) {
						case 0:
							player.skin2 = '';
							break;
						case 1:
							player.skin2 = skinData2;
							break;
					};
					player.colorHex = "#" + (16777216 + (.9 * data.readUInt8() << 16) + (.9 * data.readUInt8() << 8) + (.9 * data.readUInt8() << 0)).toString(16).slice(1);
					player.colorHex2 = "#" + (16777216 + (.9 * data.readUInt8() << 16) + (.9 * data.readUInt8() << 8) + (.9 * data.readUInt8() << 0)).toString(16).slice(1);
					player.isAlive = data.readUInt8();
					player.isAlive2 = data.readUInt8();
					console.log(player);
				}
			}
		}, {
			key: "roomUpdate",
			value(data) {
				const roomID = data.readUInt16()
					, joiningCount = data.readUInt8();
				//console.log("Join: " + joiningCount);
				for (let t = 0; t < joiningCount; t++) {
					const playerID = data.readUInt16()
						, player = ses.getPlayer(playerID);
					player.roomID = roomID;
					player.nick = data.readString16();
					player.nick2 = data.readString16();
					const skinType1 = data.readUInt8();
					const skinData1 = data.readString8();
					switch (skinType1) {
						case 0:
							player.skin = '';
							break;
						case 1:
							player.skin = skinData1;
							break;
					};
					const skinType2 = data.readUInt8();
					const skinData2 = data.readString8();
					switch (skinType2) {
						case 0:
							player.skin2 = '';
							break;
						case 1:
							player.skin2 = skinData2;
							break;
					};
					player.colorHex = "#" + (16777216 + (.9 * data.readUInt8() << 16) + (.9 * data.readUInt8() << 8) + (.9 * data.readUInt8() << 0)).toString(16).slice(1);
					player.colorHex2 = "#" + (16777216 + (.9 * data.readUInt8() << 16) + (.9 * data.readUInt8() << 8) + (.9 * data.readUInt8() << 0)).toString(16).slice(1);
					player.isAlive = data.readUInt8();
					player.isAlive2 = data.readUInt8();
				};
				const existingCount = data.readUInt8();
				//console.log("Exist: " + existingCount)
				for (let i = 0; i < existingCount; i++) {
					const playerID = data.readUInt16()
						, player = ses.getPlayer(playerID)
						, flags = data.readUInt8();
					//console.log("Player ID: " + playerID);
					//console.log("Flags: " + flags);
					if (flags & 1) {
						player.nick = data.readString16();
						player.nick2 = data.readString16();
						console.log("Nick 1: " + player.nick);
						console.log("Nick 2: " + player.nick2);
					};
					if (flags & 2) {
						const skinType1 = data.readUInt8();
						const skinData1 = data.readString8();
						switch (skinType1) {
							case 0:
								player.skin = '';
								break;
							case 1:
								player.skin = skinData1;
								break;
						};
						const skinType2 = data.readUInt8();
						const skinData2 = data.readString8();
						switch (skinType2) {
							case 0:
								player.skin2 = '';
								break;
							case 1:
								player.skin2 = skinData2;
								break;
						};
						//console.log("Skin 1 Type: " + skinType1);
						//console.log("Skin 1 Data: " + player.skin);
						//console.log("Skin 2 Type: " + skinType2);
						//console.log("Skin 2 Data: " + player.skin2);
					};
					if (flags & 4) {
						player.colorHex = "#" + (16777216 + (.9 * data.readUInt8() << 16) + (.9 * data.readUInt8() << 8) + (.9 * data.readUInt8() << 0)).toString(16).slice(1);
						player.colorHex2 = "#" + (16777216 + (.9 * data.readUInt8() << 16) + (.9 * data.readUInt8() << 8) + (.9 * data.readUInt8() << 0)).toString(16).slice(1);
						//console.log("Color Hex 1: " + player.colorHex);
						//console.log("Color Hex 2: " + player.colorHex2);
					};
					if (flags & 8) {
						player.isAlive = data.readUInt8();
						player.isAlive2 = data.readUInt8();
						//console.log("Alive 1: " + player.isAlive);
						//console.log("Alive 2: " + player.isAlive2);
					};
					if (player.isAlive) {
						player.x = data.readInt16();
						player.y = data.readInt16();
						player.mass = data.readUInt32();
						//console.log("X 1: " + player.x);
						//console.log("Y 1: " + player.y);
						//console.log("Mass 1: " + player.mass);
					};
					if (player.isAlive2) {
						player.x2 = data.readInt16();
						player.y2 = data.readInt16();
						player.mass2 = data.readUInt32();
						//console.log("X 2: " + player.x2);
						//console.log("Y 2: " + player.y2);
						//console.log("Mass 2: " + player.mass2);
					};
					//console.log("Alive 1: " + player.isAlive);
					//console.log("Alive 2: " + player.isAlive2);
				};
				const leavingCount = data.readUInt8();
				//console.log("Leave: " + leavingCount);
				for (let i = 0; i < leavingCount; i++) {
					ses.removePlayer(data.readUInt16());
				};
			}
		}, {
			key: "roomLeave",
			value(data) {
				console.log("Leave Room ID: " + data.readUInt16());
			}
		}, {
			key: "chat",
			value(data) {
				const playerID = data.readUInt16()
					, player = playerID === ses.saigoID ? A : ses.getPlayer(playerID)
					, tab = data.readUInt8()
					, nick = tab === 0 ? (oe.spyPrefix + player.nick) : (oe.spyPrefix + player.nick2)
					, type = data.readUInt8()
					, content = data.readString16();
				//if (playerID === ses.saigoID) return;
				if (type === 1) m.normal(nick, content);
				else if (type === 2) m.command(nick, content);
			}
		}, {
			key: "commander",
			value(data) {
				const fe = data.readInt16() + G.offset.x
				  , he = data.readInt16() + G.offset.y
				  , ke = le.time;
				//console.log(`[Server->Client] X: ${fe} | Y: ${he}`);
				re.commanderPoints.add({
					x: fe,
					y: he,
					time: ke,
					scale: 5
				})
			}
		}])
	})()),
    se = new ((()=>{
        function e() {
            _classCallCheck(this, e),
            this.playerID = 0,
            this.playerID2 = 0,
            this.teammates = new Map
        }
        return _createClass(e, [{
            key: "getPlayer",
            value(e, type) {
                return (e === this.playerID || e === this.playerID2) ? {} : this.teammates.get(e) || this.newPlayer(e)
            }
        }, {
            key: "newPlayer",
            value(e, type) {
                const t = new O(e);
                return this.teammates.set(e, t),
                t
            }
        }, {
            key: "removePlayer",
            value(e) {
                this.teammates.delete(e);
            }
        }]),
        e
    })()),
    ses = new ((()=>{
        function e() {
            _classCallCheck(this, e),
			this.saigoID = 0,
            this.teammates = new Map
        }
        return _createClass(e, [{
            key: "getPlayer",
            value(e, type) {
                return this.teammates.get(e) || this.newPlayer(e, type)
            }
        }, {
            key: "newPlayer",
            value(e, type) {
                const t = new Os(e);
                return this.teammates.set(e, t),
                t
            }
        }, {
            key: "removePlayer",
            value(e) {
                this.teammates.delete(e);
            }
        }]),
        e
    })()),
    be = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
				const rgbImage = new Image();
				rgbImage.crossOrigin = "anonymous",
				rgbImage.src = "https://i.imgur.com/5w5PhoL.png",
				this.rgbImg = PIXI.Texture.from(rgbImage),
				this.filter1 = new PIXI.filters.ColorMatrixFilter(),
				//this.filter2 = new PIXI.filters.ColorMatrixFilter(),
				this.hueCounter1 = 0,
				//this.hueCounter2 = 0,
                this.cacheCorner(),
                this.cacheEdge()
            }
        }, {
            key: "render",
            value() {
                const m = re.mainContainer
					//, c = new PIXI.Sprite(this.cornerTexture)
					//, e = new PIXI.Sprite(this.edgeTexture)
					, o = oe.borderWidth >> 1;
				this.filter1.hue(this.hueCounter1);
				//this.filter2.hue(this.hueCounter2);
				this.hueCounter1 += 1;
				//this.hueCounter2 -= 1;
				if (this.hueCounter1 > 360) this.hueCounter1 = 0;
				//if (this.hueCounter2 < -360) this.hueCounter2 = 0;
				for (let i = 0; i < 4; i++) {
					//if (i > 0) break;
					const e = new PIXI.Sprite(this.edgeTexture);
					//k.rainbowBorder === "on" && (e.tint = parseInt(pe.color.slice(1), 16));
					settings.rainbowBorder !== "off" && (e.filters = [this.filter1]);
					e.width = 1414.2 * 9 + ((i !== 1 && i !== 3) ? (2 * o) : 0);
					e.rotation = i > 0 && i !== 2 ? Math.PI / 2 : 0;
					0 === i ? e.position.set(G.left - o + 707.1, G.top - o - 200)
					: 1 === i ? e.position.set(G.right + 2 * o + 200, G.top + 707.1)
					: 2 === i ? e.position.set(G.left - o + 707.1, G.bottom - o - 200)
					: 3 === i && e.position.set(G.left + 200, G.top + 707.1);
					m.addChild(e);
					const c = new PIXI.Sprite(this.cornerTexture);
					//k.rainbowBorder === "on" && (c.tint = parseInt(pe.color.slice(1), 16));
					settings.rainbowBorder !== "off" && (c.filters = [this.filter1])
					c.rotation = i > 0 ? Math.PI / 2 * i : 0;
					0 === i ? c.position.set(~~(G.left - o - 200), ~~(G.top - 200))
					: 1 === i ? c.position.set(~~(G.right + o + 200), ~~(G.top - 200))
					: 2 === i ? c.position.set(~~(G.right + o + 200), ~~(G.bottom + 200))
					: 3 === i && c.position.set(~~(G.left - o - 200), ~~(G.bottom + 200));
					m.addChild(c);
					if (settings.rainbowBorder !== "off") {
						const rgb1 = new PIXI.Sprite(this.rgbImg); //1 = inner
						rgb1.filters = [this.filter1];
						rgb1.width = 1414.2 * 10 + 707.1 + ((i !== 1 && i !== 3) ? (2 * o) : 0) - (i === 3 ? o : 0);
						rgb1.height = 40 + oe.borderGlowSize;
						rgb1.rotation = Math.PI / 2 * i;
						0 === i ? rgb1.position.set(G.left - 707.1, G.top + o)
						: 1 === i ? rgb1.position.set(G.right, G.top - 707.1)
						: 2 === i ? rgb1.position.set(G.right + 707.1, G.bottom - o)
						: 3 === i && rgb1.position.set(G.left, G.bottom + 707.1);
						for (let i = 0; i < oe.borderGlowStrength; i++) m.addChild(rgb1);
						const rgb2 = new PIXI.Sprite(this.rgbImg); //2 = outer
						rgb2.filters = [this.filter1];
						rgb2.pivot.set(0, 1);
						rgb2.width = 1414.2 * 10 + 707.1 + ((i !== 1 && i !== 3) ? (2 * o) : 0) - (i === 3 ? o : 0);
						rgb2.height = 40 + oe.borderGlowSize;
						rgb2.scale.x *= -1;
						rgb2.rotation = Math.PI + Math.PI / 2 * i;
						0 === i ? rgb2.position.set(G.left - 707.1, G.top - o)
						: 1 === i ? rgb2.position.set(G.right + 2 * o, G.top - 707.1)
						: 2 === i ? rgb2.position.set(G.right + 707.1, G.bottom + o)
						: 3 === i && rgb2.position.set(G.left - 2 * o, G.bottom + 707.1);
						for (let i = 0; i < oe.borderGlowStrength; i++) m.addChild(rgb2);
					};
				};
            }
        }, {
            key: "cacheCorner",
            value() {
				this.settings = {
                    halfWidth: oe.borderWidth >> 1,
                    isGlowOn: "off" !== settings.borderGlow,
                    strength: "off" !== settings.borderGlow && oe.borderGlowStrength ? oe.borderGlowStrength : 1
                };
                this.cornerCanvas = document.createElement("canvas");
                this.cornerCtx = this.cornerCanvas.getContext("2d");
                this.cornerCanvas.width = 200 + 707.1;
                this.cornerCanvas.height = 200 + 707.1;
                this.settings.isGlowOn && (this.cornerCtx.shadowBlur = oe.borderGlowSize,
                this.cornerCtx.shadowColor = settings.rainbowBorder !== "off" ? "#ff0000" : oe.borderGlow);
                this.cornerCtx.strokeStyle = oe.borderColor;
                this.cornerCtx.lineWidth = oe.borderWidth;
				for (let i = 0; i < this.settings.strength; i++) {
					this.cornerCtx.strokeRect(200, 200, 1000, 1000);
				};
				this.settings.isGlowOn && (this.cornerCtx.shadowBlur = 0);
				this.cornerTexture = PIXI.Texture.from(this.cornerCanvas);
            }
        }, {
            key: "cacheEdge",
            value() {
				this.settings = {
                    halfWidth: oe.borderWidth >> 1,
                    isGlowOn: "off" !== settings.borderGlow,
                    strength: "off" !== settings.borderGlow && oe.borderGlowStrength ? oe.borderGlowStrength : 1
                };
                this.edgeCanvas = document.createElement("canvas");
                this.edgeCtx = this.edgeCanvas.getContext("2d");
                this.edgeCanvas.width = 1414.2 + oe.borderWidth/10;
                this.edgeCanvas.height = 1414.2 + oe.borderWidth/10;
                this.settings.isGlowOn && (this.edgeCtx.shadowBlur = oe.borderGlowSize,
                this.edgeCtx.shadowColor = settings.rainbowBorder !== "off" ? "#ff0000" : oe.borderGlow);
                this.edgeCtx.fillStyle = oe.borderColor;
				for (let i = 0; i < this.settings.strength; i++) {
					this.edgeCtx.fillRect(-200, 200, 2000, oe.borderWidth);
				};
				this.settings.isGlowOn && (this.edgeCtx.shadowBlur = 0);
				this.edgeTexture = PIXI.Texture.from(this.edgeCanvas);
            }
        }]),
        e
    })());
    window.be = be;
    de = new ((()=>{
        function e() {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.cache()
            }
        }, {
            key: "render",
            value(o) {
                const e = re.mainContainer;
				const s = 2 === o.tab ? G.getOffset2 : 3 === o.tab ? G.getOffset3 : 3 < o.tab ? q.mapTabs[o.tab-4].getOffset : {
					x: 0,
					y: 0
				}
				  , n = /*o.animRadius*/100 + 5;
				const virus = new PIXI.Sprite(this.cacheTexture);
				virus.anchor.set(0.5, 0.5);
				virus.position.set(o.x - s.x, o.y - s.y);
				return virus;
            }
        }, {
            key: "cache",
            value() {
				this.settings = {
                    isGlowOn: "off" !== settings.virusGlow,
                    strength: "off" !== settings.virusGlow && oe.virusGlowStrength ? oe.virusGlowStrength : 1
                };
                this.cacheCanvas = document.createElement("canvas");
                this.cacheCtx = this.cacheCanvas.getContext("2d");
                this.cacheCanvas.width = 700;
                this.cacheCanvas.height = 700;
                this.cacheCtx.save();
                this.settings.isGlowOn && (this.cacheCtx.shadowBlur = oe.virusGlowSize,
                this.cacheCtx.shadowColor = oe.virusGlow);
				this.cacheCtx.globalAlpha = .7;
                this.cacheCtx.fillStyle = oe.virusColor;
                this.cacheCtx.strokeStyle = oe.virusBorderColor;
				this.cacheCtx.lineWidth = oe.virusBorderWidth;
				this.cacheCtx.beginPath();
				this.cacheCtx.arc((700-100-5)/2, (700-100-5)/2, 100+5, 0, re.pi2, !0);
				this.cacheCtx.closePath();
				this.cacheCtx.fill();
				for (let i = 0; i < this.settings.strength; i++) {
					this.cacheCtx.stroke();
				};
				this.settings.isGlowOn && (this.cacheCtx.shadowBlur = 0);
				this.cacheCtx.restore();
				this.cacheTexture = PIXI.Texture.from(this.cacheCanvas);
            }
        }]),
        e
    })());
    const pe = new ((() => {
        function e(t) {
            _classCallCheck(this, e)
        }
        return _createClass(e, [{
            key: "init",
            value() {
                this.r = 0,
				this.g = 0,
				this.b = 0,
				this.targetR = 0,
				this.targetG = 0,
				this.targetB = 0,
				this.color = '#000000',
				this.lastTime = 0
            }
        }, {
			key: "update",
			value() {
				this.r += (this.targetR - this.r) / 80,
				this.g += (this.targetG - this.g) / 80,
				this.b += (this.targetB - this.b) / 80,
				this.color = '#' + (16777216 + (this.r << 16) + (this.g << 8) + (0 | this.b))
					.toString(16)
					.slice(1);
				const ue = Math.min(le.time - this.lastTime - 2e3, 33);
				0 > ue || (this.lastTime = le.time + ue, this.newTargetRGB())
			}
		}, {
			key: "newTargetRGB",
			value() {
				let ue = [255, 7, 0 | 255 * Math.random()];
				ue.sort(() => {
					return 0.5 - Math.random()
				}), this.targetR = ue[0], this.targetG = ue[1], this.targetB = ue[2]
			}
		}, {
			key: "getColor",
			value(ue, fe) {
				return `rgb(${0|ue.r*fe},${0|ue.g*fe},${0|ue.b*fe})`
			}
		}]), 
		e
	})());
	window.pe = pe;
    re = new ((()=>{
        function e() {
            const t = this;
            _classCallCheck(this, e),
            this.canvas = h.getElementById("canvas"),
            //this.ctx = this.canvas.getContext("2d"),
			this.graphics = new PIXI.Graphics(),
			this.gridGraphics = new PIXI.Graphics(),
			//this.borderGraphics = new PIXI.Graphics(),
			//this.foodGraphics = new PIXI.Graphics(),
			//this.opponentRingsGraphics = new PIXI.Graphics(),
			//this.cellsGraphics = new PIXI.Graphics(),
			//this.cellsGraphics2 = new PIXI.Graphics(),
			//this.mouseTrackerGraphics = new PIXI.Graphics(),
			//this.splitRingsGraphics = new PIXI.Graphics(),
			//this.virusRangeGraphics = new PIXI.Graphics(),
			//this.commanderGraphics = new PIXI.Graphics(),
			this.renderer =	new PIXI.Renderer({
				view: canvas,
				width: s.innerWidth,
				height: s.innerHeight,
				resolution: s.devicePixelRatio,
				backgroundColor: 0x0000,
				autoDensity: !0,
				antialias: !0
			}),
			this.cellsContainer = new PIXI.Container(),
			this.cellsDestroyer = [],
			this.mainContainer = new PIXI.Container(),
			this.rootContainer = new PIXI.Container(),
			this.commanderContainer = new PIXI.Container(),
			this.commanderTriggered = !1,
			this.globalRotation = 0,
			this.globalRotationSpeed = 10,
			this.nickImg = null,
			this.massImg = null,
            this.pi2 = 2 * Math.PI,
            this.commanderPoints = new Set,
            this.effectPoints = new Set,
            this.cellTexture = null,
            this.maouImg = null,
            this.fantasyImg = null,
            this.resizeCanvas(),
            /*this.getMaouImg(),
            this.getEveryoneSkin(),
            this.getMultiboxShield(),*/
            this.getTargetSkin(),
			//this.getBGImg(),
			this.getCommander(),
			this.getCellTexture(),
			pe.init(),
            s.onresize = (() =>{
                t.resizeCanvas()
            })
        }
        return _createClass(e, [{
            key: "resizeCanvas",
            value() {
                this.canvas.width = 0 | s.innerWidth,
                this.canvas.height = 0 | s.innerHeight,
				this.renderer.resize(this.canvas.width, this.canvas.height)
            }
        }, {
            key: "run",
            value() {
				this.cellsContainer.removeChildren(),
				this.cellsDestroyer.forEach(t => t.destroy(true)),
				this.cellsDestroyer = [],
				this.mainContainer.removeChildren(),
				this.rootContainer.removeChildren(),
				this.graphics.clear(),
				this.gridGraphics.clear(),
				//this.borderGraphics.clear(),
				//this.foodGraphics.clear(),
				//this.opponentRingsGraphics.clear(),
				//this.cellsGraphics.clear(),
				//this.cellsGraphics2.clear(),
				//this.mouseTrackerGraphics.clear(),
				//this.splitRingsGraphics.clear(),
				//this.virusRangeGraphics.clear(),
				//this.commanderGraphics.clear(),
				this.globalRotation += (this.globalRotationSpeed / 1000);
                const e = (/*this.canvas.width*/s.innerWidth >> 1) / L.viewport - L.x
                  , t = (/*this.canvas.height*/s.innerHeight >> 1) / L.viewport - L.y;
				this.rootContainer.scale.set(L.viewport, L.viewport),
				this.mainContainer.position.set(e, t),
				pe.update(),
				this.drawBGImg(),
                V.render(),
                be.render(),
                H.render(),
                //de.render(),
                N.render(),
				settings.eatEffects === "on" && this.commands("effect"),
				ve.render(),
				this.mouseTracker(),
				this.SplitRings(),
				ie.render(),
				this.mainContainer.addChild(this.graphics),
                this.cells(),
                this.commands("commander"),
                P.cleaner(),
				Pm.reset(),
				this.rootContainer.addChild(this.mainContainer),
                this.renderer.render(this.rootContainer)
            }
        }, {
            key: "drawBGImg",
            value() {
				if (null !== this.fantasyImg) {
                    const e = new PIXI.Sprite(this.fantasyTexture)
						//, t = new PIXI.Sprite(this.whiteTexture)
						, c = this.mainContainer;
					"on" === settings.bgImg && (//t.position.set(~~G.left, ~~G.top),
					//t.width = ~~G.edge,
					//t.height = ~~G.edge,
					//t.tint = window.tintColor || 0xff0000,
					//t.blendMode = window.blendMode || PIXI.BLEND_MODES.OVERLAY,
					e.position.set(~~G.left, ~~G.top),
					e.width = ~~G.edge,
					e.height = ~~G.edge,
					//e.blendMode = window.blendMode || PIXI.BLEND_MODES.SCREEN,
                    c.addChild(e/*, t*/));
                }
            }
        }, {
            key: "cells",
            value() {
                const t = "off" !== settings.cellMass
                  , o = "off" !== settings.cellNick
                  , i = "on" === settings.hideOwnNick
                  , s = "on" === settings.hideOwnMass
                  , n = "on" === settings.urlSkins
                  , _n = "on" === settings.everyoneSkins
                  , __n = "on" === settings.kanjiSkins
                  , ___n = "on" === settings.vanillaSkins
                  , a = "on" === settings.teamIndicator
                  , r = "on" === settings.multiboxRing
				  , _r = "on" === settings.multiboxShield
				  , __r = "on" === settings.multiboxCellColor
				  , ___r = "on" === settings.rainbowCellColor
                  , l = "off" !== settings.maouCircleSkin
                  , h = "off" !== settings.virusGlow
                  , ve = oe.skinBorder / 100
                  , c = oe.indicatorSize
                  , _ = oe.cellTransparency / 100
                  , d = oe.cellNickSize / 100
                  , m = oe.cellMassSize / 100
                  , g = settings.cellTextAnimation
                  , u = "off" === g ? 0 : "stepped" === g ? 1 : 2
                  , y = oe.lightenCellColor / 100
                  , f = oe.virusColor
                  , p = oe.multiboxActive
                  , v = oe.multiboxInactive
                  , x = oe.multiboxRingWidth;
                for (const g of I.sortedCells) {
					const e = new PIXI.Sprite(this.cellTexture);
					const _e = new PIXI.Container();
					let virusSprite;
                    const b = g.animate()
                      , C = 2 === g.tab ? G.getOffset2 : 3 === g.tab ? G.getOffset3 : 3 < g.tab ? q.mapTabs[g.tab-4].getOffset : {
                        x: 0,
                        y: 0
                    }
                      , S = !g.isVirus && !g.isEjected && N.skinMap.has(g.worldID);
                    let w = 1;
                    if (g.fadeStartTime && (w = 1 - b),
                    w = 0 > w ? 0 : 1 < w ? 1 : w,
					e.anchor.set(.5, .5),
					e.position.set(g.x - C.x, g.y - C.y),
                    g.isVirus ? (virusSprite = new PIXI.Sprite(de.cacheTexture),
					virusSprite.scale.set(((g.animRadius+5)/105), ((g.animRadius+5)/105)),
					virusSprite.anchor.set(0.5, 0.5),
					virusSprite.position.set(~~(g.x - C.x + 52.5 + (g.animRadius+5-105)/2), ~~(g.y - C.y + 52.5 + (g.animRadius+5-105)/2)),
					_e.addChild(virusSprite),
                    "fill" === settings.virusMass && (e.tint = parseInt(oe.virusBorderColor.slice(1), 16),
					e.width = 2 * 3 * (g.animRadius - 100),
					e.height = 2 * 3 * (g.animRadius - 100))) : (e.tint = (g.isMine && __r) ? (g.tab === A.controllingTab ? parseInt(p.slice(1), 16) : parseInt(v.slice(1), 16)) : (g.isMine && ___r) ? parseInt(pe.color.slice(1), 16) : parseInt(g.colorObject.hex.slice(1), 16),
					e.alpha = 1 > _ * w ? _ * w : 1,
					e.width = 2 * (g.animRadius + 5),
					e.height = 2 * (g.animRadius + 5)),
					(!g.isVirus || g.isVirus && "fill" === settings.virusMass) && _e.addChild(e),
					//this.cellsDestroyer.push(e),
                    !g.isEjected) {
                        if (!g.isVirus) {
							const indTxt = a && (new PIXI.Sprite(R.indicator));
                            //1 == w && a && !g.isMine && S && 50 > g.animRadius * L.viewport && e.drawImage(R.indicator, ~~(g.x - C.x - c / 2), ~~(g.y - C.y - g.animRadius - 10 - c), ~~c, ~~c);
                            1 == w && a && !g.isMine && S && 50 > g.animRadius * L.viewport && (indTxt.position.set(~~(g.x - C.x - c / 2), ~~(g.y - C.y - g.animRadius - 10 - c)), indTxt.width = c, indTxt.height = c, _e.addChild(indTxt));
                            const t = l ? /*g.animRadius * x / 75*/0 : 0
                              , s = S && n && N.getCustomSkin(g.worldID)
							  , _s = s && (new PIXI.Sprite(s))
                              , sk =  !(settings.hideOwnSkin === "on" && g.isMine) && N.checkHasKanji(g.nick) && __n && N.getKanjiSkin(N.checkHasKanji(g.nick))
							  , _sk = sk && (new PIXI.Sprite(sk))
							  , __s = _n && (new PIXI.Sprite(this.everyoneSkinsTexture))
							  , ts1 = this.checkIsTarget(g.worldID, 1) && (new PIXI.Sprite(this.target1SkinTexture))
							  , ts2 = this.checkIsTarget(g.worldID, 2) && (new PIXI.Sprite(this.target2SkinTexture))
                              , He = g.animRadius * ve
							  , i = 16 * g.animRadius / 100
							  , mTxt = l && (new PIXI.Sprite(this.maouTexture))
							//console.log(s);
							_n && !s && !sk && (__s.position.set(~~(g.x - C.x - (He + 5 - t)), ~~(g.y - C.y - (He + 5 - t))), __s.width = ~~(2 * (He + 5 - t)), __s.height = ~~(2 * (He + 5 - t)), _e.addChild(__s));
							__n && !s && sk && (_sk.position.set(~~(g.x - C.x - (He + 5 - t)), ~~(g.y - C.y - (He + 5 - t))), _sk.width = ~~(2 * (He + 5 - t)), _sk.height = ~~(2 * (He + 5 - t)), _e.addChild(_sk));
							!s && !sk && this.checkIsTarget(g.worldID, 1) && (ts1.position.set(~~(g.x - C.x - (He + 5 - t)), ~~(g.y - C.y - (He + 5 - t))), ts1.width = ~~(2 * (He + 5 - t)), ts1.height = ~~(2 * (He + 5 - t)), _e.addChild(ts1));
							!s && !sk && this.checkIsTarget(g.worldID, 2) && (ts2.position.set(~~(g.x - C.x - (He + 5 - t)), ~~(g.y - C.y - (He + 5 - t))), ts2.width = ~~(2 * (He + 5 - t)), ts2.height = ~~(2 * (He + 5 - t)), _e.addChild(ts2));
                            if (s && _s && (_s.position.set(~~(g.x - C.x - (He + 5 - t)), ~~(g.y - C.y - (He + 5 - t))), _s.width = ~~(2 * (He + 5 - t)), _s.height = ~~(2 * (He + 5 - t)), _e.addChild(_s)),
							//N.getCustomSkin(g.worldID) && l && (e.save(), e.arc(~~(g.x - C.x + 540), ~~(g.x - C.x + 540), 540, 0, this.pi2, !0), e.shadowBlur = 25 * L.viewport, e.shadowColor = g.colorObject.hex, e.drawImage(this.maouImg, ~~(g.x - C.x - (g.animRadius + 5 + i)), ~~(g.y - C.y - (g.animRadius + 5 + i)), ~~(2 * (g.animRadius + 5 + i)), ~~(2 * (g.animRadius + 5 + i))), e.restore()),
							((settings.maouCircleSkinRange === "team" && N.getCustomSkin(g.worldID)) || this.checkIsTarget(g.worldID, 1) || this.checkIsTarget(g.worldID, 2) || settings.maouCircleSkinRange === "everyone") && l && (mTxt.anchor.set(0.5, 0.5), mTxt.rotation += this.globalRotation, mTxt.position.set(~~(g.x - C.x), ~~(g.y - C.y)), mTxt.width = ~~(2 * (g.animRadius + 5 + i)), mTxt.height = ~~(2 * (g.animRadius + 5 + i)), _e.addChild(mTxt)),
                            g.isMine) {
                                const t = l ? /*20*/0 : 0
                                  , o = g.animRadius * (x + t) / 100
								  , e2 = new PIXI.Graphics();
								let shield;
                                r && (e2.beginFill(0, 0),
								e2.lineStyle(0 | o, g.tab === A.controllingTab ? parseInt(p.slice(1), 16) : parseInt(v.slice(1), 16), 1),
                                e2.drawCircle(g.x - C.x, g.y - C.y, g.animRadius + 5 - (o >> 1)),
                                e2.endFill(),
								e2.lineStyle(0),
								_e.addChild(e2),
								this.cellsDestroyer.push(e2));
								_r && (shield = new PIXI.Sprite(this.multiboxShieldTexture),
								//shield.texture = this.whiteTexture,
								shield.tint = g.tab === A.controllingTab ? parseInt(p.slice(1), 16) : parseInt(v.slice(1), 16),
								shield.position.set(~~(g.x - C.x - (He + 5 - t)), ~~(g.y - C.y - (He + 5 - t))),
								shield.width = ~~(2 * (He + 5 - t)),
								shield.height = ~~(2 * (He + 5 - t)),
								_e.addChild(shield))
                                const i = 16 * g.animRadius / 100
									, mTxt2 = l && (new PIXI.Sprite(this.maouTexture))
                                l && settings.maouCircleSkinRange === "myself" && (mTxt2.anchor.set(0.5, 0.5),
								mTxt2.rotation += this.globalRotation,
                                mTxt2.position.set(~~(g.x - C.x), ~~(g.y - C.y)),
								mTxt2.width = ~~(2 * (g.animRadius + 5 + i)),
								mTxt2.height = ~~(2 * (g.animRadius + 5 + i)),
                                _e.addChild(mTxt2))
                            }
                            if (1 == w && (g.isMine && !("on" === settings.hideOwnNick) || !g.isMine && o)) {
                                const canvasNick = P.nick(g);
                                if (canvasNick) {
                                    const o = ((2 == u ? g.animRadius : 1 == u ? 50 + 75 * (0 | g.animRadius / 75) : g.animRadius) * d * .3 + 6 / L.viewport) / canvasNick.height
                                      , i = canvasNick.width * o
                                      , s = canvasNick.height * o
									  , _t = new PIXI.Sprite(canvasNick);
                                    //e.drawImage(t, ~~(g.x - C.x - (i >> 1)), ~~(g.y - C.y - (s >> 1)), ~~i, ~~s)
									_t.x = ~~(g.x - C.x - (i >> 1)),
									_t.y = ~~(g.y - C.y - (s >> 1)),
									_t.width = ~~i,
									_t.height = ~~s,
									_e.addChild(_t);
									//this.cellsDestroyer.push(_t.texture),
									//this.cellsDestroyer.push(_t),
									this.cellsDestroyer.push(canvasNick);
                                }
                            }
                        }
                        if (!P.isSmall(g) && (!g.isVirus || "text" === settings.virusMass && g.isVirus) && 1 == w && (g.isMine && !s || !g.isMine && t)) {
							const d = g.mass
								, b = Pm.get(d)
								, k = m * (.3 * g.animRadius) / 256
								, v = parseInt(oe.massColor.slice(1), 16);
							if (b) {
								b.scale.set(k, k),
								b.position.set(~~(g.x - C.x), ~~(g.y - C.y + (g.isUnnamed || g.isMine && i || !g.isMine && !o ? 0 : (.3 * g.animRadius)))),
								b.tint = v,
								_e.addChild(b)
								//console.log(b)
							}
                        }
                    }
					this.cellsContainer.addChild(_e)//,
					//this.cellsDestroyer.push(_e)
                }
				this.mainContainer.addChild(this.cellsContainer)
			}
        }, {
            key: "getColor",
            value(e, t) {
				return e.set(e.R * t, e.G * t, e.B * t),
				e
			}
        }, {
            key: "getCellTexture",
            value(link) {
				const t = h.createElement("canvas")
				  , o = t.getContext("2d");
				t.width = 500,
				t.height = 500,
				o.beginPath(),
				o.arc(250, 250, 250, 0, this.pi2, !0),
				o.closePath(),
				o.fillStyle = "#ffffff",
				o.fill(),
				this.cellTexture = PIXI.Texture.from(t)
            }
        }, {
            key: "getMaouImg",
            value(link) {
                const e = new Image;
                //e.src = "https://i.imgur.com/UHnXvDk.png",
                e.src = link || oe.maouCircleSkinURL,
                e.crossOrigin = "anonymous",
                e.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 1080,
                    t.height = 1080,
                    o.beginPath(),
                    o.arc(540, 540, 540, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e, 0, 0, 1080, 1080),
                    e.onload = null,
                    this.maouImg = t,
					this.maouTexture = PIXI.Texture.from(t)
                })
            }
        }, {
            key: "getEveryoneSkin",
            value(link) {
                const e = new Image;
                e.src = link || oe.everyoneSkinsURL,
                e.crossOrigin = "anonymous",
                e.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 500,
                    t.height = 500,
                    o.beginPath(),
                    o.arc(250, 250, 250, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e, 0, 0, 500, 500),
                    e.onload = null,
                    this.everyoneSkins = t,
					this.everyoneSkinsTexture = PIXI.Texture.from(t)
                })
            }
        }, {
            key: "getMultiboxShield",
            value(link) {
                const e = new Image;
                e.src = link || oe.multiboxShieldURL,
                e.crossOrigin = "anonymous",
                e.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 500,
                    t.height = 500,
                    o.beginPath(),
                    o.arc(250, 250, 250, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e, 0, 0, 500, 500),
					o.globalCompositeOperation='source-in',
					o.fillStyle = "#ffffff",
					o.fill(),
                    e.onload = null,
                    this.multiboxShield = t,
					this.multiboxShieldTexture = PIXI.Texture.from(t)
                })
            }
        }, {
			key: "getTargetSkin",
			value() {
				const e2 = new Image;
                e2.src = "https://i.imgur.com/SjmiESK.png",
                e2.crossOrigin = "anonymous",
                e2.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 500,
                    t.height = 500,
                    o.beginPath(),
                    o.arc(250, 250, 250, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e2, 0, 0, 500, 500),
                    e2.onload = null,
                    this.target1Skin = t,
					this.target1SkinTexture = PIXI.Texture.from(t)
                })
                const e3 = new Image;
                e3.src = "https://i.imgur.com/PfodXDy.png",
                e3.crossOrigin = "anonymous",
                e3.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 500,
                    t.height = 500,
                    o.beginPath(),
                    o.arc(250, 250, 250, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e3, 0, 0, 500, 500),
                    e3.onload = null,
                    this.target2Skin = t,
					this.target2SkinTexture = PIXI.Texture.from(t)
                })
			}
		}, {
            key: "checkIsTarget",
            value(id, n) {
				const target = n === 1 ? W.target1 : n === 2 && W.target2;
				if (!target.turnedOn || A.isAlive || !L.freeSpectate) return false;
                return id === target.worldID;
            }
        }, {
            key: "getBGImg",
            value(link) {
				const fantasyBG = new Image();
				fantasyBG.src = link,
				fantasyBG.crossOrigin = "anonymous",
				fantasyBG.onload = (()=>{
					const e = h.createElement("canvas")
					  , t = e.getContext("2d");
					e.width = 2048,
					e.height = 2048,
					t.beginPath(),
					t.rect(0, 0, 2048, 2048),
					t.closePath(),
					t.clip(),
					t.drawImage(fantasyBG, 0, 0, 2048, 2048),
					fantasyBG.onload = null,
					this.fantasyImg = e,
					this.whiteTexture = PIXI.Texture.WHITE,
					this.fantasyTexture = PIXI.Texture.from(link)
				})
            }
        }, {
            key: "getCommander",
            value() {
                const e = new Image;
                e.src = "https://i.imgur.com/NOP273q.png",
                e.crossOrigin = "anonymous",
                e.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 512,
                    t.height = 512,
                    o.beginPath(),
                    o.arc(256, 256, 256, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e, 0, 0, 512, 512),
					o.globalCompositeOperation='source-in',
					o.fillStyle = "#ffffff",
					o.fill(),
                    e.onload = null,
                    this.mc1 = t,
					this.mc1Texture = PIXI.Texture.from(t)
                });
                const e2 = new Image;
                e2.src = "https://i.imgur.com/EZlEpC1.png",
                e2.crossOrigin = "anonymous",
                e2.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 512,
                    t.height = 512,
                    o.beginPath(),
                    o.arc(256, 256, 256, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e2, 0, 0, 512, 512),
					o.globalCompositeOperation='source-in',
					o.fillStyle = "#ffffff",
					o.fill(),
                    e2.onload = null,
                    this.mc2 = t,
					this.mc2Texture = PIXI.Texture.from(t)
                });
                const e3 = new Image;
                e3.src = "https://i.imgur.com/ffMhray.png",
                e3.crossOrigin = "anonymous",
                e3.onload = (()=>{
                    const t = h.createElement("canvas")
                      , o = t.getContext("2d");
                    t.width = 512,
                    t.height = 512,
                    o.beginPath(),
                    o.arc(256, 256, 256, 0, this.pi2, !0),
                    o.closePath(),
                    o.clip(),
                    o.drawImage(e3, 0, 0, 512, 512),
					o.globalCompositeOperation='source-in',
					o.fillStyle = "#ffffff",
					o.fill(),
                    e3.onload = null,
                    this.mc3 = t,
					this.mc3Texture = PIXI.Texture.from(t)
                });
				/*this.mc1 = PIXI.Texture.from("https://i.imgur.com/NOP273q.png"),
				this.mc2 = PIXI.Texture.from("https://i.imgur.com/EZlEpC1.png"),
				this.mc3 = PIXI.Texture.from("https://i.imgur.com/ffMhray.png");*/
            }
        }, {
            key: "getImgurCode",
            value(e) {
                const t = e.match(/https?:\/\/i\.imgur\.com\/([\w0-9]{7})\.(png|jpg|gif)/i);
                return null === t ? "XXXXXXX" : t[1]
            }
        }, {
            key: "getRainbowFlag",
            value: e=>null !== e.match(/#hue\s??=\s??auto\s??,\s??blend\s??=\s??auto/i)
        }, {
            key: "code2Url",
            value: e=>"https://i.imgur.com/" + e + ".png"
        }, {
            key: "commands",
            value(type) {
				const t = "off" === settings.commander
					, points = type === "commander" ? this.commanderPoints : this.effectPoints;
                //e.lineStyle(50, parseInt(oe.commanderColor.slice(1), 16), 1);
                for (const o of points.values()) {
					if (t) return;
					this.commanderTriggered = !0;
                    const i = o.x
                      , s = o.y
                      , n = le.time - o.time
					  , scale = o.scale || 1
					  , color = o.color || oe.commanderColor
					  , e = new PIXI.Sprite(this.mc1Texture)
					  , _e = new PIXI.Sprite(this.mc2Texture)
					  , __e = new PIXI.Sprite(this.mc3Texture);
                    if (2000 < n)
                        points.delete(o);
                    else if (!(t || 1 > n)) {
                        const t = 1e3 * n / 2000;
                        /*e.alpha = 333 < t ? (1e3 - t) / 667 : 1;
                        e.beginFill(0, 0),
                        e.drawCircle(i, s, t, 0, this.pi2, !0),
                        e.endFill()*/
						e.anchor.set(0.5, 0.5);
						_e.anchor.set(0.5, 0.5);
						__e.anchor.set(0.5, 0.5);
						e.rotation += this.globalRotation * 3;
						_e.rotation -= this.globalRotation * 4;
						__e.rotation += this.globalRotation * 5;
						e.alpha = 333 < t ? (1e3 - t) / 667 : 1;
						_e.alpha = 333 < t ? (1e3 - t) / 667 : 1;
						__e.alpha = 333 < t ? (1e3 - t) / 667 : 1;
						e.position.set(i, s);
						_e.position.set(i, s);
						__e.position.set(i, s);
						e.tint = parseInt(color.slice(1), 16);
						_e.tint = parseInt(color.slice(1), 16);
						__e.tint = parseInt(color.slice(1), 16);
						e.scale.set(t/1000 * scale, t/1000 * o.scale);
						_e.scale.set(t/1000 * scale, t/1000 * o.scale);
						__e.scale.set(t/1000 * scale, t/1000 * o.scale);
						this.mainContainer.addChild(e, _e, __e);
                    }
                }
            }
        }, {
            key: "mouseTracker",
            value() {
                if ("off" !== settings.cursorLine) {
                    const e = this.graphics;
                    //const e = this.mouseTrackerGraphics;
					e.beginFill(0, 0);
					e.lineStyle(4, parseInt(oe.cursorLineColor.slice(1), 16), 1)
                    const t = (_.x - this.canvas.width / 2) / L.viewport + L.x
                      , o = (_.y - this.canvas.height / 2) / L.viewport + L.y;
                    const i = 1 === A.controllingTab ? I.myCellsTab1 : I.myCellsTab2
                      , s = 1 === A.controllingTab ? {
                        x: 0,
                        y: 0
                    } : G.getOffset2;
                    for (const n of i.values())
                        e.moveTo(n.x - s.x, n.y - s.y),
                        e.lineTo(t, o);
                    e.endFill();
					e.lineStyle(0);
					//this.mainContainer.addChild(e);
                }
            }
        }, {
			key: "SplitRings",
			value() {
				if ('off' !== settings.splitRings) {
					const e = this.graphics;
					//const e = this.splitRingsGraphics;
					e.beginFill(0, 0),
					e.lineStyle(3, 0x656565, 1),
					I.myCellsTab1.forEach(fe=>{
						60 > fe.radius || (e.moveTo(fe.x + 800, fe.y),
						e.drawCircle(fe.x, fe.y, 800))
					}),
					I.myCellsTab2.forEach(fe=>{
						60 > fe.radius || (e.moveTo(fe.x + 800 - G.getOffset2.x, fe.y - G.getOffset2.y),
						e.drawCircle(fe.x - G.getOffset2.x, fe.y - G.getOffset2.y, 800))
					}),
					e.endFill();
					e.lineStyle(0);
					//this.mainContainer.addChild(e);
				}
			}
		}]),
        e
    })());
	window.re = re;
    // Bots by Nel#0001
    Writer = (()=>{
        function e(t) {
            _classCallCheck(this, e),
            this.dataView = new DataView(new ArrayBuffer(t))
            this.byteOffset = 0
        }
        return _createClass(e, [{
            key: "writeUint8",
            value(e) {
                this.dataView.setUint8(this.byteOffset++, e)
            }
        }, {
            key: "writeInt32",
            value(e) {
                this.dataView.setInt32(this.byteOffset, e, true)
                this.byteOffset += 4
            }
        }, {
            key: "writeUint32",
            value(e) {
                this.dataView.setUint32(this.byteOffset, e, true)
                this.byteOffset += 4
            }
        }, {
            key: "writeString",
            value(string) {
                for (let i = 0; i < string.length; i++)
                    this.writeUint8(string.charCodeAt(i))
                this.writeUint8(0)
            }
        }]),
        e
    }
    )();
    window.buffers = {
        startBots(url, protocolVersion, clientVersion, userStatus, botsName, botsAmount) {
            const writer = new Writer(13 + url.length + botsName.length)
            writer.writeUint8(0)
            writer.writeString(url)
            writer.writeUint32(protocolVersion)
            writer.writeUint32(clientVersion)
            writer.writeUint8(Number(userStatus))
            writer.writeString(botsName)
            writer.writeUint8(botsAmount)
            return writer.dataView.buffer
        },
        mousePosition(x, y) {
            const writer = new Writer(9)
            writer.writeUint8(6)
            writer.writeInt32(x)
            writer.writeInt32(y)
            return writer.dataView.buffer
        },
		sendToken(token) {
			const writer = new Writer(2 + token.length)
			writer.writeUint8(7)
			writer.writeString(token)
			return writer.dataView.buffer
		},
		/*captchaToken(token) {
			const writer = new Writer(2 + token.length)
			writer.writeUint8(99)
			writer.writeString(token)
			return writer.dataView.buffer
		}*/
    }

    window.connection = {
        tries: 5,
        ws: null,
        connect() {
            this.connected = !1
            console.log("Connecting to bot server")
            this.ws = new WebSocket(`${location.protocol === "http:" ? "ws:bots-server-yueagar130160.codeanyapp.com:1337" : "ws://localhost:1337"}`)
            this.ws.binaryType = 'arraybuffer'
            this.ws.onopen = this.onopen.bind(this)
            this.ws.onmessage = this.onmessage.bind(this)
            this.ws.onclose = this.onclose.bind(this)
            setTimeout(()=>{
                !this.connected && (this.tries < 5 ? (this.tries++,
                //console.log(`Failed to connect to bot server --- Attempt ${this.tries} to reconnect...`),
                !window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", `Retrying to connect to bot server... attempt ${this.tries}`),
                this.connect()) : (//console.log("Failed to attempt reconnecting to bot server."),
                !window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Failed to connect to bot server.")))
            }
            , 5000)
        },
        send(buffer) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN)
                this.ws.send(buffer)
        },
        onopen() {
            this.connected = !0
            console.log("Connected to bot server.")
            window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Connected to bot server.")
			Q.myTurn = !1
			//k.useBots === "on" && window.connection.ws.readyState === WebSocket.OPEN && Q.spawn()
            //document.getElementById('userStatus').style.color = '#00C02E'
            //document.getElementById('userStatus').innerText = 'Connected'
            //document.getElementById('connect').disabled = true
            //document.getElementById('startBots').disabled = false
            //document.getElementById('stopBots').disabled = false
        },
        onmessage(message) {
            const dataView = new DataView(message.data)
            switch (dataView.getUint8(0)) {
            case 0:
                window.user.startedBots = true;
                window.user.stoppingBots = false;
                //alert('Bots started");
                window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Bots started.");
                break;
            case 1:
                window.user.stoppingBots = true;
                //alert('Stopping Bots...');
                window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Stopping Bots in 30 seconds.")
                break;
            case 2:
                window.user.startedBots = false;
                window.bots.ai = false;
                break;
            case 3:
                //alert('Your IP has captcha and bots are unable to spawn, change your ip with a VPN or something to one that doesn\'t has captcha in order to use the bots');
                (window.connection.connected && !window.user.captchaNotif) && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Your IP has captcha and bots are unable to spawn, change your ip with a VPN or something to one that doesn\'t has captcha in order to use the bots.");
                window.bots.captcha = true;
                window.user.captchaNotif = true;
                break;
            case 4:
                window.bots.connectedAmount = dataView.getUint8(1, !0);
				window.bots.aliveAmount = dataView.getUint8(2, !0);
				window.bots.playerAmount = dataView.getUint8(3, !0);
				window.bots.tokenAmount = dataView.getUint8(4, !0);
                break;
            case 5:
                window.bots.serverPlayersAmount = dataView.getUint8(1, !0);
                break;
            }
        },
        onclose() {
            this.connected = !1;
            window.user.captchaNotif = !1;
            //this.tries = 0
            console.log("Disconnected from bot server.");
            window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Disconnected from bot server.");
            //this.connect()
            window.user.startedBots = false;
            window.bots.ai = false;
            window.bots.connectedAmount = 0;
            window.bots.aliveAmount = 0;
            window.bots.playerAmount = 0;
            window.bots.tokenAmount = 0;
        }
    }

    window.game = {
        url: '',
        protocolVersion: 22,
        clientVersion: localStorage.getItem("parsedKey") || 30601
    }

    window.user = {
        startedBots: false,
        stoppingBots: false,
        isAlive: false,
        mouseX: 0,
        mouseY: 0,
        offsetX: 0,
        offsetY: 0//,
		//captchaToken: null
    }

    window.bots = {
        name: c.get("theme", "customBotsName") || "Test",
        amount: c.get("theme", "botsAmount") || 150,
        connectedAmount: 0,
        aliveAmount: 0,
        tokenAmount: 0,
        ai: false,
        captcha: false
    }

    function botsFunc(e) {
        if (document.getElementById("menu-overlay").style.display === "none") {
            switch (e) {
            case 0:
                if (window.user.startedBots && window.user.isAlive)
                    window.connection.send(new Uint8Array([2]).buffer)
                break
            case 1:
                if (window.user.startedBots && window.user.isAlive)
                    window.connection.send(new Uint8Array([3]).buffer)
                break
            case 2:
                window.bots.ai = !window.bots.ai
                window.connection.send(new Uint8Array([4, Number(window.bots.ai)]).buffer)
                window.connection.connected && window.user.startedBots && !window.user.stoppingBots && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", `AI Mode toggled${window.bots.ai ? "[On]" : "[Off]"}.`);
                break
            case 3:
                if (window.game.url && window.game.protocolVersion && window.game.clientVersion && !window.user.startedBots) {
                    if (window.bots.name && window.bots.amount) {
                        window.connection.send(window.buffers.startBots(window.game.url, window.game.protocolVersion, window.game.clientVersion, window.user.isAlive, window.unescape(window.encodeURIComponent(window.bots.name)), window.bots.amount))
                        //alert('Starting bots')
                        window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Trying to start bots.")
                    } else {
                        //alert('Bots name and amount are required before starting the bots')
                        window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "Bots name and amount are required before starting the bots.")
                    }
                }
                break
            case 4:
                if (window.user.startedBots) {
                    window.connection.send(new Uint8Array([1]).buffer)
                    //alert('Stopping bots')
                }//else alert('You must have bots started in order to stop them')
                else
                    window.connection.connected && settings.showBotNotifNCount === "on" && settings.useBots === "on" && m.alert("Bot", "You must have bots started in order to stop them.");
                break
            case 5:
                if (!window.connection.connected)
                    window.connection.connect()
            }
        }
    }
    window.botsFunc = botsFunc
    window.connection.connect()
    le = new ((()=>{
        function e() {
            _classCallCheck(this, e),
			/*this.consoleOpened = !1;
			const devtools = function() {};
			devtools.toString = function() {
				this.consoleOpened = !0;
			};*/
			this.validPasswords = {},
            this.time = Date.now(),
            this.versionInt = localStorage.getItem("parsedKey") || 30601,
            this.versionString = localStorage.getItem("key") || "3.6.1",
            console.log(`Current Client Version: ${this.versionInt} ${this.versionString}`)
            r.ajax("//agar.io/mc/agario.js", {
                error: function() {
                    console.log("Failed to scan client version.")
                },
                success: function(data) {
                    let keyData = data.match(/versionString="(\d+\.\d+\.\d+)"/);
                    if (keyData) {
                        let key = keyData[1];
                        let parsedKey = 1e4 * parseInt(key["split"](".")[0]) + 100 * parseInt(key["split"](".")[1]) + parseInt(key.split(".")[2]);
                        console.log(`Updated Client Version: ${parsedKey} ${key}`);
                        if (le.versionInt != parsedKey || le.versionString != key) {
                            le.setKey(parsedKey, key);
                            m.alert("HSLO", "New client version found! Updating...");
                            localStorage.setItem("parsedKey", parsedKey);
                            localStorage.setItem("key", key);
                            window.game.clientVersion = parsedKey;
                            re.reconnect(1);
                            re.reconnect(2);
                            re.reconnect(3);
                        }
                    }
                }
            })
        }
        return _createClass(e, [{
            key: "init",
            value(/*validPasswords*/) {
				//if (!(localStorage.getItem("pwd") && validPasswords[localStorage.getItem("pwd")] && validPasswords[localStorage.getItem("pwd")].type !== "expired" && window.tokenAuthorizationRequested === true)) return;
                const e = this;
                try {
					window.ghostCells = [{"x": 0, "y": 0, "mass": 1000, "size": 333}],
                    z.init(),
                    I.init(),
                    A.init(),
                    L.init(),
					J.init(),
					Js.init(),
                    H.init(),
                    de.init(),
                    be.init(),
					N.getKanjis(),
					setInterval(() => {
						N.getKanjis()
					}, 60000);
                    this.loop = new PIXI.Ticker();
					this.loop.add(() => {
                        e.run()//,
						//_.send()
                    }),
					this.loop.start(),
                    setInterval(()=>{
                        _.send()
                    }, 40),
                    setInterval(()=>{
                        _e.positionMass(1),
                        _e.positionMass(2),
                        _es.positionMass(1),
                        _es.positionMass(2)
                    }, 1e3),
                    Y.createParty()
                } catch (e) {
					console.log(e)
				}
            }
        }, {
            key: "run",
            value() {
                try {
                    le.refreshTime(),
                    I.update(),
                    A.update(),
                    L.update(),
                    re.run(),
                    S.run(),
                    C.update(),
                    T.update(),
                    K.update()//,
					//this.checkConsole()
                } catch (e) {
					console.log(e)
				}
            }
        }, {
            key: "refreshTime",
            value() {
                this.time = Date.now()
            }
        }, {
            key: "setKey",
            value(parsedKey, key) {
                this.versionInt = parsedKey,
                this.versionString = key
            }
        }, {
			key: "checkConsole",
			value() {
				/*if (this.consoleOpened) {
					window.location.reload();
				}*/
				let div = document.createElement('div');
				let loop = setInterval(() => {
					console.log(div)
				});
				Object.defineProperty(div, "id", {get: () => { 
					clearInterval(loop);
					window.location.reload();
				}});
				document.addEventListener("contextmenu", function(e){
					e.preventDefault();
				}, false);
				document.addEventListener("keydown", function(e) {
				//document.onkeydown = function(e) {
					// "I" key
					if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
						disabledEvent(e);
					}
					// "J" key
					if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
						disabledEvent(e);
					}
					// "S" key + macOS
					if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
						disabledEvent(e);
					}
					// "U" key
					if (e.ctrlKey && e.keyCode == 85) {
						disabledEvent(e);
					}
					// "F12" key
					if (event.keyCode == 123) {
						disabledEvent(e);
					}
					// Opera Console
					if (e.ctrlKey && e.shiftKey && event.keyCode == 67) {
						disabledEvent(e);
					}
				}, false);
				function disabledEvent(e) {
					if (e.stopPropagation) {
						e.stopPropagation();
					} else if (window.event) {
						window.event.cancelBubble = true;
					}
					e.preventDefault();
					return false;
				}
			}
		}]),
        e
    })()),
    (()=>{
        try {
			//le.checkConsole();
			/*let validPasswords;
			r.getJSON(`https://cors-anywhere.herokuapp.com/https://yueagar-login-hslo.herokuapp.com/requestTokenAuthorizationV540beta?token=${localStorage.getItem("pwd") && encodeURIComponent(localStorage.getItem("pwd"))}`, function(data) {
				le.validPasswords = data;
				validPasswords = data;
			}).done(() => {
				if (localStorage.getItem("pwd") && validPasswords[localStorage.getItem("pwd")] && validPasswords[localStorage.getItem("pwd")].type !== "expired" && window.tokenAuthorizationRequested === true) {
					p.init(),
					le.init(validPasswords),
					y.asyncInit()
				} else {
					document.getElementById("pwdBox").style.opacity = 0,
					document.getElementsByClassName("message")[0].innerHTML = "Can not authorize your token."
				};
			}).fail(() => {
				document.getElementById("pwdBox").style.opacity = 0,
				document.getElementsByClassName("message")[0].innerHTML = "Can not authorize your token."
			}).always(() => {
				console.log("Success or not, authorization ended.");
			});*/
			p.init(),
			le.init(),
			setTimeout(() => {
				y.asyncInit()
			}, 1000);
        } catch (e) {
			console.log(e)
		}
    })()
}
)(window, $, document);
