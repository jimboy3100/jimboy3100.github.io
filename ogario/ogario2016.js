# // Copyright © 2016 ogario.ovh
! function(e, t) {
    function a() {
        return null !== document.getElementById("canvas") ? void(e.gameCtx = document.getElementById("canvas").getContext("2d")) : void setTimeout(a, 50)
    }

    function s(e, t, a, s, i, o, n, r) {
        this.id = e, this.x = t, this.y = a, this.lastX = t, this.lastY = a, this.mass = s, this.clanTag = i, this.setNick(o), this.skin = n, 7 == r.length && (this.color = r), this.alive = !0, this.updateTime = Date.now()
    }

    function i() {}

    function o() {
        return window.ogario.play ? r[n].exit : void 0
    }
    a();
    var n = "en",
        r = {
            pl: {
                start: "Start",
                settings: "Ustawienia",
                rainbowFood: "Kolorowy pokarm",
                transparentCells: "Przezroczyste kulki",
                showBgSectors: "Sektory w tle",
                showMapBorders: "Granice mapy",
                showMiniMap: "Pokaż minimapę",
                disableShift: "Wyłącz Shift",
                disableAlt: "Wyłącz Alt",
                hideChat: "Ukryj czat",
                mouseControl: "Sterowanie myszką",
                keys: "Klawisze",
                qKey: "Podwójny podział",
                wKey: "Karmienie",
                eKey: "Pauza kulki",
                aKey: "Pokaż/ukryj nazwy",
                sKey: "Pokaż/ukryj skiny",
                dKey: "Pokaż/ukryj sektory w tle",
                fKey: "Pokaż/ukryj pokarm",
                hKey: "Ukryj czat",
                zKey: "Reset zoomu",
                cKey: "Historia czatu / Czyść czat",
                shiftKey: "Szybki podział n16",
                spaceKey: "Podział",
                space: "Spacja",
                enterKey: "Napisz wiadomość",
                commands: "Komendy",
                saveComm: "Zapisz komendy",
                theme: "Wygląd",
                themeType: "Motyw",
                darkTheme: "Ciemny motyw",
                lightTheme: "Jasny motyw",
                mainColor: "Kolor główny",
                bgColor: "Kolor tła",
                foodColor: "Kolor pokarmu",
                gridColor: "Kolor sektorów",
                saveSett: "Zapisz ustawienia",
                hideChatMsg: "Ukryto czat!",
                activePartys: "Aktywne party",
                pause: "PAUZA!",
                visit: "Odwiedź ",
                exit: "OGARio by szymy: Czy na pewno chcesz opuścic grę?"
            },
            en: {
                start: "Start",
                settings: "Settings",
                rainbowFood: "Rainbow food",
                transparentCells: "Transparent cells",
                showBgSectors: "Show background sectors",
                showMapBorders: "Show map borders",
                showMiniMap: "Show minimap",
                disableShift: "Disable Shift",
                disableAlt: "Disable Alt",
                hideChat: "Hide chat",
                mouseControl: "Mouse control",
                keys: "Keys",
                qKey: "Double split",
                wKey: "Macro feed",
                eKey: "Cell pause",
                aKey: "Toggle names",
                sKey: "Toggle skins",
                dKey: "Toggle background sectors",
                fKey: "Toggle food",
                hKey: "Hide chat",
                zKey: "Reset zoom",
                cKey: "Chat history / Clear chat",
                shiftKey: "Split n16",
                spaceKey: "Split",
                space: "Space",
                enterKey: "Enter chat message",
                commands: "Commands",
                saveComm: "Save commands",
                theme: "Theme",
                themeType: "Theme type",
                darkTheme: "Dark theme",
                lightTheme: "Light theme",
                mainColor: "Main color",
                bgColor: "Background color",
                foodColor: "Food color",
                gridColor: "Grid color",
                saveSett: "Save settings",
                hideChatMsg: "Hide chat!",
                activePartys: "Active partys",
                pause: "PAUSE!",
                visit: "Visit ",
                exit: "OGARio by szymy: Are you sure you want to quit the game?"
            }
        };
    if ("pl" == n) var l = {
        comm1: "Feeduj!",
        comm2: "Dziel się!",
        comm3: "Pomocy na %currentSector%!",
        comm4: "Wróg na %currentSector%!",
        comm5: "Zabij pomocnika!",
        comm6: "Strzel z wirusa!",
        comm7: "Zjedz wirusa!",
        comm8: "Zjebałem, wybacz.",
        comm9: "Ja pierdolę...",
        comm0: "Kurwa mać!",
        comm10: "Trick!",
        comm11: "Lewo!",
        comm12: "Góra!",
        comm13: "Prawo!",
        comm14: "Dół!"
    };
    else var l = {
        comm1: "Feed me!",
        comm2: "Split into me!",
        comm3: "Need backup on %currentSector%!",
        comm4: "Enemy spotted on %currentSector%!",
        comm5: "Need a teammate!",
        comm6: "Tank the virus!",
        comm7: "Eat the virus!",
        comm8: "Let's bait!",
        comm9: "Fake tricksplit!",
        comm0: "Fuck!",
        comm10: "Tricksplit!",
        comm11: "Left!",
        comm12: "Up!",
        comm13: "Right!",
        comm14: "Bottom!"
    };
    var c = null,
        d = {
            mainColor: "#b5a642",
            bgColor: "#000000",
            foodColor: "#998c36",
            gridColor: "#111111",
            darkTheme: !0
        },
        p = {
            nick: "I <3 szymy",
            clanTag: "Ⓜ",
            skin: "",
            color: d.mainColor
        },
        h = {
            rainbowFood: !1,
            transparentCells: !0,
            showBgSectors: !0,
            showMapBorders: !0,
            showMiniMap: !0,
            disableShift: !1,
            disableAlt: !0,
            hideChat: !1,
            mouseControl: !1
        };
    s.prototype = {
        id: 0,
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0,
        mass: 0,
        clanTag: "",
        nick: "",
        nickImg: null,
        skin: "",
        color: d.mainColor,
        alive: !1,
        updateTime: null,
        pi2: 2 * Math.PI,
        setNick: function(e) {
            e && e != this.nick && (this.nick = e)
        },
        drawPosition: function(e, t, a) {
            if (this.alive) {
                this.lastX = (29 * this.lastX + this.x) / 30, this.lastY = (29 * this.lastY + this.y) / 30;
                var s = (this.lastX + t) * a,
                    i = (this.lastY + t) * a;
                this.nick.length > 0 && (e.fillStyle = "#FFFFFF", e.font = "9px Ubuntu", e.fillText(this.nick, s - e.measureText(this.nick).width / 2, i - 10)), e.beginPath(), e.arc(s, i, 4.5, 0, this.pi2, !1), e.closePath(), e.fillStyle = d.mainColor, e.fill()
            }
        }
    }, i.prototype = {
        name: "OGARio LE by szymy",
        version: "v1.0.5",
        currentSector: "",
        miniMap: null,
        miniMapCtx: null,
        miniMapSectors: null,
        pi2: 2 * Math.PI,
        sectors: 5,
        mapBordersWidth: 20,
        socket: null,
        teamPlayers: [],
        partys: [],
        chatHistory: [],
        gameMode: "",
        partyToken: "",
        playerIP: "",
        playerMass: 0,
        updateTick: 0,
        leaderboardInfo: null,
        activePartys: null,
        top5p: null,
        overlays: null,
        lastMessageSend: Date.now(),
        setSkins: !0,
        setNames: !0,
        getPlayerX: function() {
            return e.playerX + e.mapOffsetX
        },
        getPlayerY: function() {
            return e.playerY + e.mapOffsetY
        },
        parseSettings: function(e, t) {
            return "save" === t ? "string" == typeof e ? e : JSON.stringify(e) : "string" != typeof e ? JSON.stringify(e) : "true" == e || "false" == e ? JSON.parse(e) : e
        },
        loadSettings: function(e) {
            for (var t in e) e.hasOwnProperty(t) && null != window.localStorage.getItem(t) && (e[t] = this.parseSettings(window.localStorage.getItem(t), "load"))
        },
        saveSettings: function(e) {
            for (var t in e) e.hasOwnProperty(t) && window.localStorage.setItem(t, this.parseSettings(e[t], "save"))
        },
        setKeys: function() {
            var a = {},
                s = {},
                i = {
                    feed: null,
                    split: null
                };
            window.addKeyListeners = function() {
                window.onkeydown = function(e) {
                    if (!a[e.keyCode] && !window.jQuery("#overlays").is(":visible") && !window.jQuery("#message").is(":focus")) switch (a[e.keyCode] = !0, e.keyCode) {
                        case 32:
                            window.core && window.core.split && window.core.split();
                            break;
                        case 87:
                            window.core && window.core.eject && window.core.eject();
                            break;
                        case 81:
                            window.core && window.core.specialOn && window.core.specialOn();
                            break;
                        case 27:
                            e.preventDefault(), window.MC.showNickDialog(300), window.jQuery("#oferwallContainer").is(":visible") && window.closeOfferwall(), window.jQuery("#videoContainer").is(":visible") && window.closeVideoContainer()
                    }
                }, window.onkeyup = function(e) {
                    a[e.keyCode] = !1, 81 == e.keyCode && window.specialOff && window.core.specialOff()
                }
            }, window.addEventListener("keydown", function(a) {
                var o = a.keyCode;
                if (13 == o && this.focusOnChat(), !s[o] && !t("#overlays").is(":visible") && !t("#message").is(":focus")) switch (48 > o || o > 57 || this.sendCommand(o - 48), 37 > o || o > 40 || this.sendCommand(o - 26), s[o] = !0, o) {
                    case 16:
                        if (i.split || h.disableShift) break;
                        var n = 0;
                        window.core.split(), i.split = setInterval(function() {
                            window.core.split(), 3 == ++n && (clearInterval(i.split), i.split = null)
                        }, 100);
                        break;
                    case 18:
                        if (h.disableAlt) break;
                        this.sendCommand(10), a.preventDefault();
                        break;
                    case 65:
                        this.setNames = !this.setNames, window.core.setNames(this.setNames);
                        break;
                    case 67:
                        this.displayChatHistory(!0);
                        break;
                    case 68:
                        h.showBgSectors = !h.showBgSectors;
                        break;
                    case 69:
                        this.pause();
                        break;
                    case 70:
                        e.showFood = !e.showFood;
                        break;
                    case 72:
                        this.hideChat();
                        break;
                    case 81:
                        window.core.split(), setTimeout(function() {
                            window.core.split()
                        }, 100);
                        break;
                    case 83:
                        this.setSkins = !this.setSkins, window.core.setSkins(this.setSkins);
                        break;
                    case 87:
                        i.feed = setInterval(function() {
                            window.core.eject()
                        }, 100);
                        break;
                    case 90:
                        e.zoom = 1
                }
            }.bind(this), !0), window.addEventListener("keyup", function(t) {
                switch (t.keyCode) {
                    case 67:
                        this.displayChatHistory(!1);
                        break;
                    case 87:
                        null !== i.feed && (clearInterval(i.feed), i.feed = null);
                        break;
                    case 90:
                        e.zoom = 0
                }
                s[t.keyCode] = !1
            }.bind(this), !0), window.onmousedown = function(e) {
                2 == e.which && h.disableAlt ? (this.sendCommand(10), e.preventDefault()) : h.mouseControl && (1 == e.which && window.core.split(), 3 == e.which && window.core.eject())
            }.bind(this)
        },
        setMenu: function() {
            var a = this;
            document.title = "OGARio by szymy LE", t("#mainPanel").before('<div id="main-menu" class="agario-panel"><ul class="menu-tabs"><li class="active"><a href="#mainPanel" class="active">' + r[n].start + '</a></li><li><a href="#og-settings">' + r[n].settings + '</a></li><li><a href="#keys">' + r[n].keys + '</a></li><li><a href="#commands">' + r[n].commands + '</a></li><li><a href="#theme">' + r[n].theme + '</a></li></ul><div id="og-settings" class="menu-panel"></div><div id="keys" class="menu-panel"></div><div id="commands" class="menu-panel"></div><div id="theme" class="menu-panel"></div></div>'), t("#mainPanel, #stats").appendTo(t("#main-menu")), t("#mainPanel, #stats").addClass("menu-panel"), t("#helloContainer div[role=form] .form-group:first").empty().append('<h1>OGARio by szymy</h1><h2 class="main-color">123</h2>'), t("#nick").before('<input id="clantag" class="form-control" placeholder="Tag, e.g. Ⓜ" />'), t("#locationKnown, #locationUnknown").insertAfter(t("#nick")), t(".btn-spectate, .btn-logout").appendTo("#agario-main-buttons"), t("#agario-main-buttons").append('<br clear="both"/>'), t("#helloContainer div[role=form]").after('<div id="ogario-party"><input id="joinPartyToken" class="partyToken form-control" placeholder="Party token" /><button class="btn btn-info btn-copy-token copy-party-token">Copy</button></div>'), t("#create-party-btn, #join-party-btn").appendTo(t("#ogario-party")), t("#join-party-btn").addClass("btn-success"), t("#settingsChoice, #options").appendTo(t("#og-settings")), t("#mainPanel").append('<div id="version"  class="main-color">' + this.version + " | " + r[n].visit + '<a href="http://ogario.ovh" target="_blank">ogario.ovh</a></div>'), t("#mainPanel").append('<div id="ogario-ad"><script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"><\/script> <ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-7183176369281586" data-ad-slot="1341824503"></ins> <script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script></div>'), t(".agario-profile-panel").after('<div class="agario-panel agario-side-panel ogario-yt-panel"><h4>Team OGARio (tag: Ⓜ)</h4><div class="g-ytsubscribe" data-channelid="UCaWiPNJWnhzYDrBQoXokn6w" data-layout="full" data-theme="dark" data-count="default"></div></div>'), t(".right-container").append('<div class="agario-panel agario-side-panel leaderboard-panel"><span id="leaderboard-info"></span><button class="btn btn-sm btn-primary btn-copy-leaderboard" onclick="copyLeaderboard();">Copy</button></div> <div class="agario-panel agario-side-panel party-panel"><h5 class="main-color">Top 5</h5><ol id="top5"></ol></div>'), t(".agario-party-1 div:first, .agario-party-0, .agario-party-1 .clearfix, .agario-party-3, .agario-party-4, .agario-party-5 div:first, .agario-party-5 .clearfix").remove(), t("#mainPanel hr, .btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr='option_dark_theme'], #darkTheme").remove(), t("body").append('<div id="adsBottom" style="z-index: 200; display: none;"><div id="adsBottomInner"><div id="g728x90"></div><div id="a728x90"></div></div></div>'), t("#adbg, #a320x250, #g320x250, #adsBottom").css("display", "none"), t("#create-party-btn, #join-party-btn").css({
                width: "49%",
                margin: "6px 0 0 0",
                "float": "left"
            }), t("#join-party-btn").css({
                "margin-left": "2%"
            }), t(".ogario-yt-panel").css({
                margin: "10px 2px",
                "float": "right"
            }), t("#adsBottom").css({
                "z-index": "1",
                opacity: "0"
            });
            for (var s in h) h.hasOwnProperty(s) && t("#og-settings").append('<label><input type="checkbox" onchange="setSettings(\'' + s + "', $(this).is(':checked'));\" id=\"" + s + '">' + r[n][s] + "</label>");
            t("#tags-container").appendTo(t("#og-settings")), t("#og-settings input:checkbox").each(function() {
                var e = t(this).attr("id");
                h.hasOwnProperty(e) && t(this).prop("checked", h[e])
            }), t("#keys").append('<span class="key"><span class="bold main-color">[Q]</span> - ' + r[n].qKey + '</span> <span class="key"><span class="bold main-color">[W]</span> - ' + r[n].wKey + '</span> <span class="key"><span class="bold main-color">[E]</span> - ' + r[n].eKey + '</span> <span class="key"><span class="bold main-color">[A]</span> - ' + r[n].aKey + '</span> <span class="key"><span class="bold main-color">[S]</span> - ' + r[n].sKey + '</span> <span class="key"><span class="bold main-color">[D]</span> - ' + r[n].dKey + '</span> <span class="key"><span class="bold main-color">[F]</span> - ' + r[n].fKey + '</span> <span class="key"><span class="bold main-color">[Z]</span> - ' + r[n].zKey + '</span> <span class="key"><span class="bold main-color">[C]</span> - ' + r[n].cKey + '</span> <span class="key"><span class="bold main-color">[' + r[n].space + "]</span> - " + r[n].spaceKey + '</span> <span class="key"><span class="bold main-color">[Shift]</span> - ' + r[n].shiftKey + '</span> <span class="key"><span class="bold main-color">[Enter]</span> - ' + r[n].enterKey + '</span> <span class="key"><span class="bold main-color">[H]</span> - ' + r[n].hKey + "</span>");
            var i = 0;
            for (var o in l) l.hasOwnProperty(o) && (++i, 11 > i ? label = 10 == i ? 0 : i : (11 == i && (label = "Alt / Mouse Wheel"), 12 == i && (label = "Left Arrow"), 13 == i && (label = "Up Arrow"), 14 == i && (label = "Right Arrow"), 15 == i && (label = "Down Arrow")), t("#commands").append('<div class="input-group input-group-sm"><span class="input-group-addon" id="' + o + '">' + label + '</span><input type="text" class="form-control" placeholder="Command #' + label + '" value="' + l[o] + '"></div>'));
            t("#commands").append('<button class="btn btn-block btn-sm btn-success btn-save" onclick="saveCommands();">' + r[n].saveComm + "</button>"), t("#theme").append('<div class="color-box theme-box"><span class="title">' + r[n].themeType + '</span><div id="theme-type" class="btn-group btn-group-justified" data-toggle="buttons"><label class="btn btn-default"><input type="radio" name="options" id="darktheme">' + r[n].darkTheme + '</label><label class="btn btn-default"><input type="radio" name="options" id="lighttheme">' + r[n].lightTheme + '</label></div></div> <div class="color-box"><span class="title">' + r[n].mainColor + '</span><div class="input-group main-color-picker"><input type="text" value="' + d.mainColor + '" id="maincolor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> <div class="color-box"><span class="title">' + r[n].bgColor + '</span><div class="input-group background-color-picker"><input type="text" value="' + d.bgColor + '" id="backgroundcolor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> <div class="color-box"><span class="title">' + r[n].foodColor + '</span><div class="input-group food-color-picker"><input type="text" value="' + d.foodColor + '" id="foodcolor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div> <div class="color-box"><span class="title">' + r[n].gridColor + '</span><div class="input-group grid-color-picker"><input type="text" value="' + d.gridColor + '" id="gridcolor" class="form-control" /><span class="input-group-addon"><i></i></span></div></div>'), t("#theme .main-color-picker").colorpicker({
                format: "hex"
            }).on("changeColor.colorpicker", function(e) {
                a.setMainColor(e.color.toHex())
            }), t("#theme .background-color-picker").colorpicker({
                format: "hex"
            }).on("changeColor.colorpicker", function(e) {
                d.bgColor = e.color.toHex(), t("body").css("background-color", d.bgColor)
            }), t("#theme .food-color-picker").colorpicker({
                format: "hex"
            }).on("changeColor.colorpicker", function(t) {
                d.foodColor = t.color.toHex(), e.foodColor = d.foodColor
            }), t("#theme .grid-color-picker").colorpicker({
                format: "hex"
            }).on("changeColor.colorpicker", function(e) {
                d.gridColor = e.color.toHex()
            }), t("#theme").append('<button class="btn btn-block btn-sm btn-success btn-save" onclick="saveThemeSettings();">' + r[n].saveSett + "</button>"), d.darkTheme ? t("#darktheme").closest("label").addClass("active") : t("#lighttheme").closest("label").addClass("active"), t("#theme-type").change(function() {
                var e = t(this).find("input:checked").attr("id");
                a.changeTheme(e)
            }), t("body").append('<div id="overlays-hud"><div id="pause-hud" class="hud">' + r[n].pause + '</div> <div id="leaderboard-hud" class="hud-b"><h4 class="main-color">OGARio by szymy LE</h4><div id="leaderboard-positions"></div></div> <div id="minimap-hud" class="hud-b"><canvas id="minimap-sectors"></canvas><canvas id="minimap"></canvas></div></div>'), t("body").append('<ul id="messages"></ul>'), t("body").append('<input id="message" class="form-control" type="text" placeholder="' + r[n].enterKey + '..." maxlength="100" />'), t(".skin-group").colorpicker({
                format: "hex",
                input: "#color"
            }), toastr.options = {
                newestOnTop: !1,
                positionClass: "toast-bottom-left",
                timeOut: "15000"
            }, t(document).ready(function() {
                t(".menu-tabs a").click(function(e) {
                    e.preventDefault();
                    var a = t(this);
                    a.addClass("active"), a.parent().addClass("active"), a.parent().siblings().removeClass("active"), a.parent().siblings().find("a").removeClass("active");
                    var s = a.attr("href");
                    t(".menu-panel").not(s).css("display", "none"), t(s).fadeIn()
                })
            }), t("#gamemode").on("change", function() {
                ":party" !== this.value && a.isSocketOpen() && (a.socket.close(), t(".partyToken").val(""))
            }), t("#cancel-party-btn").on("click", function() {
                ":party" !== this.value && a.isSocketOpen() && (a.socket.close(), t(".partyToken").val(""))
            }), t("#canvas").bind("contextmenu", function() {
                return !1
            }), this.activePartys = document.getElementById("activepartys"), this.top5p = document.getElementById("top5"), this.leaderboardInfo = document.getElementById("leaderboard-info"), this.overlays = t("#overlays"), t("#nick").val(p.nick), t("#clantag").val(p.clanTag)
        },
        setMainColor: function(e) {
            d.mainColor = e, t("#main-menu").css("border-color", e), c || (c = t("<style type='text/css'>").appendTo("head")), c.html(".main-color, .menu-tabs .active, center, #cancel-party-btn { color: " + e + "; } #main-menu { border-color: " + e + "} .toast-warning { background-color: " + e + "; }")
        },
        changeTheme: function(e) {
            "darktheme" == e ? (d.darkTheme = !0, d.bgColor = "#000000", d.gridColor = "#111111", t("#theme .background-color-picker").colorpicker("setValue", "#000000"), t("#theme .grid-color-picker").colorpicker("setValue", "#111111"), t("#minimap-sectors").css("opacity", "0.2")) : (d.darkTheme = !1, d.bgColor = "#F2FBFF", d.gridColor = "#D9E1E5", t("#theme .background-color-picker").colorpicker("setValue", "#F2FBFF"), t("#theme .grid-color-picker").colorpicker("setValue", "#D9E1E5"), t("#minimap-sectors").css("opacity", "0.4"))
        },
        setTheme: function() {
            this.setMainColor(d.mainColor), t("body").css("background-color", d.bgColor), d.darkTheme ? t("#minimap-sectors").css("opacity", "0.2") : t("#minimap-sectors").css("opacity", "0.4")
        },
        setMiniMap: function() {
            h.showMiniMap ? (t("#minimap-hud").show(), t("#leaderboard-hud").css("bottom", "240px")) : (t("#minimap-hud").hide(), t("#leaderboard-hud").css("bottom", "10px"))
        },
        setButtons: function() {
            var e = document.getElementsByClassName("btn-play")[0],
                t = document.getElementsByClassName("btn-play-guest")[0],
                a = document.getElementsByClassName("btn-spectate")[0],
                s = document.getElementById("create-party-btn"),
                i = document.getElementById("join-party-btn");
            e.addEventListener("click", function() {
                this.handleConnect(), window.ga && window.ga("create", "UA-67142685-2", "auto", "ogarioTracker"), window.ga && window.ga("ogarioTracker.send", "pageview"), window.ga && window.ga("ogarioTracker.send", "event", "Nick", p.clanTag + p.nick)
            }.bind(this), !1), t.addEventListener("click", function() {
                this.handleConnect(), window.ga && window.ga("create", "UA-67142685-2", "auto", "ogarioTracker"), window.ga && window.ga("ogarioTracker.send", "pageview"), window.ga && window.ga("ogarioTracker.send", "event", "Nick", p.clanTag + p.nick)
            }.bind(this), !1), a.addEventListener("click", function() {
                this.handleConnect()
            }.bind(this), !1), s.addEventListener("click", function() {
                this.handleConnect()
            }.bind(this), !1), i.addEventListener("click", function() {
                this.handleConnect()
            }.bind(this), !1)
        },
        setPlayerInfo: function() {
            var e = t("#nick").val(),
                a = t("#clantag").val();
            p.nick = e || "", p.clanTag = a || "", this.saveSettings(p)
        },
        setPlayerStatus: function() {
            null != this.overlays && this.overlays.is(":visible") && (e.play = !1, e.spectate = !1)
        },
        setParty: function() {
            if (this.gameMode = t("#gamemode").val(), ":party" === this.gameMode) {
                var e = t(".partyToken").val();
                e && e.length > 5 && (e = e.split("#"), this.partyToken = e[1])
            }
        },
        calculateCurrentSector: function() {
            if (!e.mapOffsetFixed) return void(this.currentSector = "");
            var t = e.mapOffsetX + e.mapOffset,
                a = e.mapOffsetY + e.mapOffset,
                s = String.fromCharCode(65 + Math.floor((e.playerY + a) / (e.mapSize / this.sectors))),
                i = "" + (Math.floor((e.playerX + t) / (e.mapSize / this.sectors)) + 1);
            this.currentSector = s + i
        },
        drawMapBorders: function(t, a, s, i, o, n, r) {
            e.mapOffsetFixed && h.showMapBorders && (t.save(), t.strokeStyle = n, t.lineWidth = r, t.beginPath(), t.moveTo(a, s), t.lineTo(i, s), t.lineTo(i, o), t.lineTo(a, o), t.closePath(), t.stroke(), t.restore())
        },
        drawMiniMap: function() {
            if (e.mapOffsetFixed) {
                this.miniMap ? this.miniMapCtx.clearRect(0, 0, 200, 220) : (this.miniMap = document.getElementById("minimap"), this.miniMapCtx = this.miniMap.getContext("2d"), this.miniMapCtx.ogarioCtx = !0, this.miniMap.width = 200, this.miniMap.height = 220);
                var t = 182 / e.mapSize,
                    a = e.mapOffsetX + e.mapOffset,
                    s = e.mapOffsetY + e.mapOffset;
                if (this.calculateCurrentSector(), this.miniMapCtx.globalAlpha = 1, this.miniMapCtx.font = "16px Ubuntu", this.miniMapCtx.fillStyle = d.mainColor, this.miniMapCtx.fillText(this.currentSector, 10, 20), this.miniMapSectors || this.drawMiniMapSectors(this.sectors, this.sectors, 182, 182), this.miniMapCtx.save(), this.miniMapCtx.translate(9.5, 29.5), this.miniMapCtx.fillStyle = "#FFFFFF", this.miniMapCtx.beginPath(), this.miniMapCtx.arc((e.playerX + a) * t, (e.playerY + s) * t, 6, 0, this.pi2, !1), this.miniMapCtx.closePath(), this.miniMapCtx.fill(), ":party" === this.gameMode && this.teamPlayers.length > 0)
                    for (var i = 0; i < this.teamPlayers.length; i++) this.teamPlayers[i].drawPosition(this.miniMapCtx, e.mapOffset, t);
                this.miniMapCtx.restore()
            }
        },
        drawMiniMapSectors: function(e, t, a, s) {
            this.miniMapSectors = document.getElementById("minimap-sectors");
            var i = this.miniMapSectors.getContext("2d");
            i.ogarioCtx = !0, this.miniMapSectors.width = a, this.miniMapSectors.height = s, i.fillStyle = "#FFFFFF", this.drawSectors(i, e, t, .5, .5, a - .5, s - .5, "#FFFFFF", 1, !1)
        },
        drawSectors: function(t, a, s, i, o, n, r, l, c, d) {
            if (!d || e.mapOffsetFixed && h.showBgSectors) {
                var p = Math.floor((n - i) / a),
                    m = Math.floor((r - o) / s),
                    u = .5 * m;
                t.save(), t.strokeStyle = l, t.fillStyle = l, t.lineWidth = c, t.beginPath();
                for (var y = 0; a + 1 > y; y++) t.moveTo(y == a ? n : i + p * y, o), t.lineTo(y == a ? n : i + p * y, r);
                for (var y = 0; s + 1 > y; y++) t.moveTo(i, y == s ? r : o + m * y), t.lineTo(n, y == s ? r : o + m * y);
                t.closePath(), t.stroke(), t.font = u + "px Ubuntu";
                for (var y = 0; s > y; y++)
                    for (var f = 0; a > f; f++) {
                        var g = String.fromCharCode(65 + y) + (f + 1);
                        t.fillText(g, i + p / 2 + f * p - t.measureText(g).width / 2, o + m / 2 + y * m + .18 * m)
                    }
                t.restore()
            }
        },
        displayLeaderboard: function(e) {
            this.leaderboardInfo && (this.leaderboardInfo.innerHTML = e)
        },
        connect: function() {
            if (e.play = !1, this.setParty(), this.socket) {
                this.socket.onopen = null, this.socket.onmessage = null;
                try {
                    this.socket.close()
                } catch (t) {}
                this.socket = null
            }
            this.teamPlayers = [], this.partys = [], ":party" !== this.gameMode || this.partyToken.length > 5 || (console.log("OGARio by szymy LE: Connecting to server"), this.socket = new WebSocket("ws://178.62.54.54:8080"), this.socket.ogarioWS = !0, this.socket.binaryType = "arraybuffer", this.socket.onopen = function() {
                console.log("OGARio by szymy LE: Socket open"), this.sendBuffer(this.strToBuff(80, this.partyToken)), this.sendBuffer(this.strToBuff(81, this.playerIP)), this.sendBuffer(this.strToBuff(0, p.nick)), this.sendBuffer(this.strToBuff(1, p.clanTag))
            }.bind(this), this.socket.onmessage = this.handleMessage.bind(this), this.socket.onclose = function() {
                console.log("OGARio by szymy LE: Socket close")
            }, this.socket.onerror = function() {
                console.log("OGARio by szymy LE: Socket error")
            })
        },
        handleConnect: function() {
            this.setPlayerInfo(), this.isSocketOpen() || setTimeout(function() {
                this.connect()
            }.bind(this), 1e3), this.updatePlayerInfo()
        },
        isSocketOpen: function() {
            return null != this.socket && this.socket.readyState == this.socket.OPEN
        },
        createView: function(e) {
            return new DataView(new ArrayBuffer(e))
        },
        strToBuff: function(e, t) {
            var a = this.createView(1 + 2 * t.length);
            a.setUint8(0, e);
            for (var s = 0; s < t.length; s++) a.setUint16(1 + 2 * s, t.charCodeAt(s), !0);
            return a
        },
        sendBuffer: function(e) {
            this.socket.send(e.buffer)
        },
        handleMessage: function(e) {
            this.readMessage(new DataView(e.data))
        },
        readMessage: function(e) {
            var t = e.getUint8(0);
            switch (t) {
                case 16:
                    this.updateTeamPlayers(e), this.displayTop5();
                    break;
                case 96:
                    this.updatePartys(e), this.displayPartys();
                    break;
                case 100:
                    h.hideChat || this.readChatMessage(e)
            }
        },
        checkPlayerID: function(e) {
            for (var t = 0; t < this.teamPlayers.length; t++)
                if (this.teamPlayers[t].id == e) return t;
            return null
        },
        updateTeamPlayers: function(e) {
            function t() {
                for (var t = "";;) {
                    var a = e.getUint16(o, !0);
                    if (0 == a) break;
                    t += String.fromCharCode(a), o += 2
                }
                return o += 2, t
            }
            for (var a = Date.now(), i = e.getUint8(1), o = 2, n = 0; i > n; n++) {
                var r = e.getUint32(o, !0),
                    l = e.getInt32(o + 4, !0),
                    c = e.getInt32(o + 8, !0),
                    d = e.getUint32(o + 12, !0);
                o += 16;
                var p = t(),
                    h = t(),
                    m = t(),
                    u = t(),
                    y = this.checkPlayerID(r);
                if (null != y) this.teamPlayers[y].x = l, this.teamPlayers[y].y = c, this.teamPlayers[y].mass = d, this.teamPlayers[y].clanTag = p, this.teamPlayers[y].setNick(h), this.teamPlayers[y].skin = m, this.teamPlayers[y].color = u, this.teamPlayers[y].alive = !0, this.teamPlayers[y].updateTime = a;
                else {
                    var f = new s(r, l, c, d, p, h, m, u);
                    this.teamPlayers.push(f)
                }
            }
            if (this.updateTick++, 5 == this.updateTick) {
                for (var n = 0; n < this.teamPlayers.length; n++) a - this.teamPlayers[n].updateTime > 1e3 && (this.teamPlayers[n].alive = !1);
                this.updateTick = 0
            }
            this.teamPlayers.sort(function(e, t) {
                return t.mass - e.mass
            }), this.top5 = [];
            for (var n = 0; n < this.teamPlayers.length && (!this.teamPlayers[n].alive || (this.top5.push({
                    nick: this.teamPlayers[n].nick,
                    mass: this.teamPlayers[n].mass
                }), 5 != this.top5.length)); n++);
        },
        updatePartys: function(e) {
            this.partys = [];
            for (var t = e.getUint8(1), a = 2, s = 0; t > s; s++) {
                for (var i = "";;) {
                    var o = e.getUint16(a, !0);
                    if (0 == o) break;
                    i += String.fromCharCode(o), a += 2
                }
                a += 2, this.partys.push(i)
            }
        },
        displayPartys: function() {
            for (var e = "", t = 0; t < this.partys.length; t++) e += '<li><a href="http://agar.io/#' + this.partys[t] + "\" onclick=\"$('#joinPartyToken').val('" + this.partys[t] + "'); $('#join-party-btn').click();\">http://agar.io/#" + this.partys[t] + "</a></li>";
            this.activePartys.innerHTML = e
        },
        displayTop5: function() {
            for (var e = "", t = 0; t < this.top5.length && (e += "<li>" + this.top5[t].nick + "</li>", 4 != t); t++);
            this.top5p.innerHTML = e
        },
        readChatMessage: function(e) {
            for (var t = e.getUint8(1), a = "", s = 2; s < e.byteLength; s += 2) {
                var i = e.getUint16(s, !0);
                if (0 == i) break;
                a += String.fromCharCode(i)
            }
            if (a.length > 0) {
                var o = a.split(": ", 1);
                a = a.replace(o + ": ", ""), 101 == t ? (toastr.success('<span class="message-nick main-color">' + o + ": </span>" + a), this.chatHistory.push({
                    nick: o,
                    message: a
                }), this.chatHistory.length > 15 && this.chatHistory.splice(0, 1)) : toastr.warning(o + ": " + a)
            }
        },
        displayChatHistory: function(e) {
            if (e) {
                t("#messages").empty(), toastr.clear();
                for (var a = 0; a < this.chatHistory.length; a++) t("#messages").append('<li><span class="message-nick main-color">' + this.chatHistory[a].nick + ": </span>" + this.chatHistory[a].message + "</li>")
            } else t("#messages").empty()
        },
        sendChatMessage: function(e, t) {
            if (Date.now() - this.lastMessageSend >= 500 && 0 != t.length && 0 != p.nick.length && this.isSocketOpen()) {
                var t = p.nick + ": " + t,
                    a = this.createView(2 + 2 * t.length);
                a.setUint8(0, 100), a.setUint8(1, e);
                for (var s = 0; s < t.length; s++) a.setUint16(2 + 2 * s, t.charCodeAt(s), !0);
                this.sendBuffer(a), this.lastMessageSend = Date.now()
            }
        },
        prepareCommand: function(e) {
            var t = e.replace("%currentSector%", this.currentSector);
            return t
        },
        sendCommand: function(e) {
            var t = this.prepareCommand(l["comm" + e]);
            this.sendChatMessage(102, t)
        },
        focusOnChat: function() {
            if (":party" === this.gameMode) {
                var a = t("#message");
                if (a.is(":visible")) {
                    var s = a.val();
                    s.length > 0 ? (this.sendChatMessage(101, s), e.play && (a.blur(), a.hide())) : (a.blur(), a.hide()), a.val("")
                } else a.show(), a.focus(), a.val("")
            }
        },
        hideChat: function() {
            ":party" === this.gameMode && (h.hideChat = !h.hideChat, h.hideChat && (toastr.error("[H] " + r[n].hideChatMsg), t("#message").hide()))
        },
        pause: function() {
            e.pause = !e.pause, e.pause ? t("#pause-hud").show() : t("#pause-hud").hide()
        },
        updatePlayer: function() {
            if (this.isSocketOpen())
                if (e.play) {
                    var t = this.createView(13);
                    t.setUint8(0, 16), t.setInt32(1, this.getPlayerX(), !0), t.setInt32(5, this.getPlayerY(), !0), t.setUint32(9, this.playerMass, !0), this.sendBuffer(t), t = this.createView(2), t.setUint8(0, 64), t.setUint8(1, 1), this.sendBuffer(t)
                } else {
                    var t = this.createView(2);
                    t.setUint8(0, 64), t.setUint8(1, 0), this.sendBuffer(t)
                }
        },
        updatePlayerInfo: function() {
            this.isSocketOpen() && (this.sendBuffer(this.strToBuff(0, p.nick)), this.sendBuffer(this.strToBuff(1, p.clanTag)), this.sendBuffer(this.strToBuff(2, p.skin)), this.sendBuffer(this.strToBuff(3, p.color)), setTimeout(function() {
                this.setParty(), this.sendBuffer(this.strToBuff(80, this.partyToken))
            }.bind(this), 1e3))
        },
        getPlayerIP: function() {
            t.ajax("http://ogario.ovh/pingback.php", {
                success: function(e) {
                    this.playerIP = e
                },
                dataType: "text",
                method: "GET",
                cache: !1,
                crossDomain: !0
            })
        },
        init: function() {
            this.getPlayerIP(), this.loadSettings(l), this.loadSettings(d), this.loadSettings(p), this.loadSettings(h), this.setTheme(), this.setMenu(), this.setKeys(), this.setButtons(), this.setMiniMap(), setInterval(function() {
                this.drawMiniMap()
            }.bind(this), 50), setInterval(function() {
                this.updatePlayer()
            }.bind(this), 500), setInterval(function() {
                this.setPlayerStatus()
            }.bind(this), 1e3)
        }
    };
    var m = new i;
    m.init(), window.onbeforeunload = o, window.saveCommands = function() {
        t("#commands .input-group-addon").each(function() {
            var e = t(this),
                a = e.attr("id");
            if (l.hasOwnProperty(a)) {
                var s = e.parent().find("input:text").val();
                l[a] = s, window.localStorage.setItem(a, l[a])
            }
        }), m.loadSettings(l)
    }, window.saveThemeSettings = function() {
        m.saveSettings(d)
    }, window.setSettings = function(t, a) {
        if (h.hasOwnProperty(t) && null != a) {
            switch (h[t] = a, t) {
                case "transparentCells":
                    e.transparentCells = a;
                    break;
                case "rainbowFood":
                    e.rainbowFood = a;
                    break;
                case "showMiniMap":
                    m.setMiniMap()
            }
            m.saveSettings(h)
        }
    }, window.copyLeaderboard = function() {
        var e = t("<input>");
        t("body").append(e), e.val(t("#leaderboard-info").text()).select();
        try {
            document.execCommand("copy")
        } catch (a) {}
        e.remove()
    }, e.transparentCells = h.transparentCells, e.cellsAlpha = .8, e.virusColor = "#999999", e.virusAlpha = .6, e.foodColor = d.foodColor, e.rainbowFood = h.rainbowFood, e.displayLeaderboard = function() {
        m.displayLeaderboard(e.leaderboardHTML)
    }, e.customDraw = function() {
        var t = e.gameCtx;
        if (t) {
            var a = e.mapMinX - e.mapOffsetX,
                s = e.mapMinY - e.mapOffsetY,
                i = e.mapMaxX - e.mapOffsetX,
                o = e.mapMaxY - e.mapOffsetY;
            m.drawSectors(t, 5, 5, a, s, i, o, d.gridColor, 20, !0), m.drawMapBorders(t, a, s, i, o, d.mainColor, 20)
        }
    }
}(window.ogario, window.jQuery);
