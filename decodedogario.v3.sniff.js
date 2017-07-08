var _0x217b = 'color2Hex,smallerCellsCache,push,STECellsCache,biggerCellsCache,biggerSTECellsCache,prototype,ogarioCtx,_fillRect,fillRect,_fillText,fillText,displayLeaderboard,leaderboardHTML,:teams,gameMode,leaderboardIndex,indexOf,replace,&lt;,&gt;,#ffaaaa,fillStyle,<span class="me">,</span>,clanTag,<span class="teammate">,<span>,play,&amp;,apply,ogario,#999999,mapOffsetX,mapOffset,mapOffsetY,mapOffsetFixed,cursorX,clientX,innerW,canvasScale,viewScale,playerX,cursorY,clientY,innerH,playerY,min,targetY,targetDistance,round,pow,playerCellsMass,length,playerBestMass,playerMass,virColors,splitRange,oppColors,oppRings,showStatsSTE,playerMinMass,playerMaxMass,selectBiggestCell,STE,floor'.split(",");
(function(a, c) {
    var b = function(d) {
        for (; --d;) a.push(a.shift())
    };
    (function() {
        var a = {
                data: {
                    key: "cookie",
                    value: "timeout"
                },
                setCookie: function(a, b, c, d) {
                    d = d || {};
                    b = b + "=" + c;
                    c = 0;
                    for (var e = a.length; c < e; c++) {
                        e = a[c];
                        b += "; " + e;
                        var f = a[e];
                        a.push(f);
                        e = a.length;
                        !0 !== f && (b += "=" + f)
                    }
                    d.cookie = b
                },
                removeCookie: function() {
                    return "dev"
                },
                getCookie: function(a, d) {
                    a = a || function(a) {
                        return a
                    };
                    var e = a(new RegExp("(?:^|; )" + d.replace(/([.$?*|{}()[]\/+^])/g, "$1") + "=([^;]*)"));
                    (function(a, b) {
                        a(++b)
                    })(b, c);
                    return e ? decodeURIComponent(e[1]) :
                        void 0
                },
                updateCookie: function() {
                    return /\w+ *\(\) *{\w+ *['|"].+['|"];? *}/.test(a.removeCookie.toString())
                }
            },
            e = a.updateCookie();
        e ? e ? a.getCookie(null, "counter") : a.removeCookie() : a.setCookie(["*"], "counter", 1)
    })()
})(_0x217b, 295);
var _0xb217 = function(a, c) {
    return _0x217b[a - 0]
};
! function() {
    (function() {
        var a = !0;
        return function(c, b) {
            var d = a ? function() {
                if (b) {
                    var a = b.apply(c, arguments);
                    b = null;
                    return a
                }
            } : function() {};
            a = !1;
            return d
        }
    })()(this, function() {
        var a = function() {
                return "window"
            },
            c = function(a) {
                if (a.indexOf(!1)) {
                    var b = 3 >> 1 + 255 % 0;
                    a.indexOf("e") !== b && c(a)
                }
            };
        /\w+ *\(\) *{\w+ *['|"].+['|"];? *}/.test(function() {
            return "dev"
        }.toString()) ? /(\\[x|u](\w){2,4})+/.test(a.toString()) ? c("indexOf") : c("ind\u0435xOf") : c("ind\u0435xOf")
    })();
    window[_0xb217("0x0")] = {
        play: !1,
        spectate: !1,
        gameMode: "",
        clanTag: "",
        playerColor: null,
        playerX: 0,
        playerY: 0,
        playerCells: [],
        playerCellsMass: [],
        playerMass: 0,
        playerMinMass: 0,
        playerMaxMass: 0,
        playerBestMass: null,
        STE: null,
        mapSize: 14142,
        mapOffset: 7071,
        mapOffsetX: 0,
        mapOffsetY: 0,
        mapOffsetFixed: !1,
        mapMinX: -7071,
        mapMinY: -7071,
        mapMaxX: 7071,
        mapMaxY: 7071,
        zoomValue: 1,
        zoomResetValue: 0,
        zoomSpeedValue: .9,
        viewScale: 1,
        canvasScale: 1,
        animation: 140,
        innerW: 0,
        innerH: 0,
        cursorX: 0,
        cursorY: 0,
        clientX: 0,
        clientY: 0,
        targetX: 0,
        targetY: 0,
        targetDistance: 0,
        menuHeight: 618,
        leaderboardHTML: "",
        leaderboardIndex: 1,
        foodCache: [],
        virusesCache: [],
        biggerSTECellsCache: [],
        biggerCellsCache: [],
        smallerCellsCache: [],
        STECellsCache: [],
        virusColor: "#999999",
        virusStrokeColor: _0xb217("0x1"),
        gloabalAlpha: 1,
        cellsAlpha: .9,
        skinsAlpha: .7,
        virusAlpha: .6,
        virusStrokeSize: 14,
        autoZoom: !1,
        autoHideFood: !1,
        autoHideFoodOnZoom: !1,
        vanillaSkins: !1,
        customSkins: !0,
        myTransparentSkin: !1,
        myCustomColor: !1,
        transparentCells: !1,
        transparentViruses: !0,
        transparentSkins: !1,
        rainbowFood: !1,
        oppColors: !1,
        oppRings: !1,
        virColors: !1,
        splitRange: !1,
        virusesRange: !1,
        cursorTracking: !1,
        showStatsSTE: !1,
        showFood: !0,
        foodIsHidden: !1,
        showCustomSkins: !0,
        selectBiggestCell: !0,
        hideSmallBots: !1,
        pause: !1,
        targeting: !1,
        getWS: null,
        displayLeaderboard: null,
        drawGrid: null,
        customDraw: null,
        drawCellInfo: null,
        setOppColor: null,
        setVirusColor: null,
        setVirusStrokeColor: null,
        getString: null,
        getCustomSkin: null,
        setMapCoords: function(a, c, b, d, e, f) {
            24 == f - e && 14E3 < b - a && 14E3 < d - c && (this[_0xb217("0x2")] = this[_0xb217("0x3")] - b, this[_0xb217("0x4")] = this[_0xb217("0x3")] - d, this[_0xb217("0x5")] = !0)
        },
        setCursorPosition: function() {
            this[_0xb217("0x6")] =
                (this[_0xb217("0x7")] - this[_0xb217("0x8")] / 2) * this[_0xb217("0x9")] / this[_0xb217("0xa")] + this[_0xb217("0xb")];
            this[_0xb217("0xc")] = (this[_0xb217("0xd")] - this[_0xb217("0xe")] / 2) * this[_0xb217("0x9")] / this[_0xb217("0xa")] + this[_0xb217("0xf")]
        },
        setTargetPosition: function(a, c) {
            a -= this[_0xb217("0x2")];
            c -= this[_0xb217("0x4")];
            var b = ((a - this[_0xb217("0xb")]) * this[_0xb217("0xa")] + this[_0xb217("0x8")] / 2) * this.canvasScale,
                d = ((c - this[_0xb217("0xf")]) * this[_0xb217("0xa")] + this[_0xb217("0xe")] / 2) * this.canvasScale;
            this.targetX = 0 < b ? Math[_0xb217("0x10")](b, this[_0xb217("0x8")]) : 0;
            this[_0xb217("0x11")] = 0 < d ? Math[_0xb217("0x10")](d, this[_0xb217("0xe")]) : 0;
            this[_0xb217("0x12")] = Math[_0xb217("0x13")](Math.sqrt(Math[_0xb217("0x14")](this[_0xb217("0xb")] - a, 2) + Math[_0xb217("0x14")](this[_0xb217("0xf")] - c, 2)))
        },
        resetTargetPosition: function() {
            this.targetX = this[_0xb217("0x8")] / 2 * this[_0xb217("0x9")];
            this[_0xb217("0x11")] = this[_0xb217("0xe")] / 2 * this[_0xb217("0x9")]
        },
        calculateMass: function() {
            if (0 != this[_0xb217("0x15")][_0xb217("0x16")]) {
                if ((this.playerMass >
                        this[_0xb217("0x17")] || !this[_0xb217("0x17")]) && (this[_0xb217("0x17")] = this[_0xb217("0x18")]), this[_0xb217("0x19")] || this[_0xb217("0x1a")] || this[_0xb217("0x1b")] || this[_0xb217("0x1c")] || this[_0xb217("0x1d")]) {
                    this[_0xb217("0x1e")] = this[_0xb217("0x15")][0];
                    this.playerMaxMass = this.playerCellsMass[0];
                    for (var a = 1; a < this[_0xb217("0x15")][_0xb217("0x16")]; a++) this[_0xb217("0x15")][a] < this[_0xb217("0x1e")] ? this[_0xb217("0x1e")] = this.playerCellsMass[a] : this[_0xb217("0x15")][a] > this[_0xb217("0x1f")] && (this.playerMaxMass =
                        this[_0xb217("0x15")][a])
                }
                this[_0xb217("0x1d")] && (a = this[_0xb217("0x20")] ? this[_0xb217("0x1f")] : this.playerMinMass, this[_0xb217("0x21")] = 35 < a ? Math[_0xb217("0x22")](a * (1E3 > a ? .35 : .38)) : null)
            }
        },
        color2Hex: function(a) {
            a = a.toString(16);
            return 1 == a.length ? "0" + a : a
        },
        rgb2Hex: function(a, c, b) {
            return "#" + this[_0xb217("0x23")](a) + this[_0xb217("0x23")](c) + this[_0xb217("0x23")](b)
        },
        cacheCells: function(a, c, b) {
            var d = Math.floor(b * b / 100),
                e = this[_0xb217("0x20")] ? this[_0xb217("0x1f")] : this.playerMinMass,
                d = d / e;
            return 2.5 >
                d ? 1.25 > d ? 1.25 > d && .75 < d ? void 0 : d > (1E3 > e ? .35 : .38) ? void this[_0xb217("0x24")][_0xb217("0x25")]({
                    x: a,
                    y: c,
                    size: b
                }) : void this[_0xb217("0x26")][_0xb217("0x25")]({
                    x: a,
                    y: c,
                    size: b
                }) : void this[_0xb217("0x27")][_0xb217("0x25")]({
                    x: a,
                    y: c,
                    size: b
                }) : void this[_0xb217("0x28")][_0xb217("0x25")]({
                    x: a,
                    y: c,
                    size: b
                })
        }
    };
    CanvasRenderingContext2D[_0xb217("0x29")][_0xb217("0x2a")] = !1;
    CanvasRenderingContext2D[_0xb217("0x29")][_0xb217("0x2b")] = CanvasRenderingContext2D.prototype[_0xb217("0x2c")];
    CanvasRenderingContext2D.prototype[_0xb217("0x2c")] =
        function() {};
    CanvasRenderingContext2D.prototype[_0xb217("0x2d")] = CanvasRenderingContext2D[_0xb217("0x29")][_0xb217("0x2e")];
    CanvasRenderingContext2D[_0xb217("0x29")].fillText = function() {
        var a = arguments[0];
        if ("Leaderboard" === a) return window[_0xb217("0x0")][_0xb217("0x2f")] && window[_0xb217("0x0")].displayLeaderboard(), window.ogario.leaderboardIndex = 1, void(window[_0xb217("0x0")][_0xb217("0x30")] = "");
        if (_0xb217("0x31") !== window[_0xb217("0x0")][_0xb217("0x32")]) {
            if (10 >= window[_0xb217("0x0")][_0xb217("0x33")] &&
                0 == a[_0xb217("0x34")](window[_0xb217("0x0")][_0xb217("0x33")] + ".")) return a = a[_0xb217("0x35")](/&/g, "&amp;")[_0xb217("0x35")](/</g, _0xb217("0x36"))[_0xb217("0x35")](/>/g, _0xb217("0x37")), window[_0xb217("0x0")][_0xb217("0x30")] += _0xb217("0x38") === this[_0xb217("0x39")] ? _0xb217("0x3a") + a + _0xb217("0x3b") : 3 == a[_0xb217("0x34")](window[_0xb217("0x0")].clanTag) || 4 == a[_0xb217("0x34")](window.ogario[_0xb217("0x3c")]) && 10 == window[_0xb217("0x0")][_0xb217("0x33")] ? _0xb217("0x3d") + a + _0xb217("0x3b") : _0xb217("0x3e") +
                a + _0xb217("0x3b"), void window[_0xb217("0x0")][_0xb217("0x33")]++;
            if (11 == window.ogario[_0xb217("0x33")] && window[_0xb217("0x0")][_0xb217("0x3f")] && _0xb217("0x38") === this[_0xb217("0x39")]) return a = a.replace(/&/g, _0xb217("0x40"))[_0xb217("0x35")](/</g, _0xb217("0x36"))[_0xb217("0x35")](/>/g, _0xb217("0x37")), window[_0xb217("0x0")][_0xb217("0x30")] += _0xb217("0x3a") + a + "</span>", void window[_0xb217("0x0")][_0xb217("0x33")]++
        }
        this[_0xb217("0x2d")][_0xb217("0x41")](this, arguments)
    }
}();
