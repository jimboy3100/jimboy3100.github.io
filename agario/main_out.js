for (var ba = "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, c, m) {
        b != Array.prototype && b != Object.prototype && (b[c] = m.value)
    }, t = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this, y = ["String", "prototype", "startsWith"], E = 0; E < y.length - 1; E++) {
    var F = y[E];
    F in t || (t[F] = {});
    t = t[F]
}
var G = y[y.length - 1],
    H = t[G],
    M = H ? H : function(b, c) {
        if (null == this) throw new TypeError("The 'this' value for String.prototype.startsWith must not be null or undefined");
        if (b instanceof RegExp) throw new TypeError("First argument to String.prototype.startsWith must not be a regular expression");
        var m = this + "";
        b += "";
        var q = m.length,
            z = b.length;
        c = Math.max(0, Math.min(c | 0, m.length));
        for (var u = 0; u < z && c < q;)
            if (m[c++] != b[u++]) return !1;
        return u >= z
    };
M != H && null != M && ba(t, G, {
    configurable: !0,
    writable: !0,
    value: M
});
(function(b, c) {
    function m(a, b) {
        if (b) {
            var d = new Date;
            d.setTime(d.getTime() + 864E5 * b);
            b = "; expires=" + d.toGMTString()
        } else b = "";
        document.cookie = "agario_redirect=" + a + b + "; path=/"
    }

    function q() {
        if (b.location.hash && 6 <= b.location.hash.length) return b.location.hash;
        var a = b.location.search;
        a.startsWith("?") && (a = a.substr(1));
        a = a.split("&");
        for (var d = {}, c = 0; c < a.length; c++) {
            var f = b.decodeURIComponent(a[c]).split("=");
            d[f[0]] = f[1]
        }
        return d.h && 6 <= d.h.length ? d.h : ""
    }

    function z() {
        c.get(ca + "//gc.agar.io", function(a) {
            a = a.split(" ");
            v = a[0];
            u(v, a[1] || "")
        }, "text").fail(function() {
            console.warn("gc.arar.io gave an invalid response, using a random region");
            var a = Object.keys(r).length;
            a = Math.floor(Math.random() * a);
            v = Object.keys(r)[a];
            u(v, "")
        })
    }

    function u(a, b) {
        console.log("Country:", a, b);
        var d = !1;
        r.hasOwnProperty(a) && ("string" == typeof r[a] ? MC.getRegion() || (MC.setRegion(r[a], "" == q()), c("#region").val(MC.getRegion()), d = !0) : r[a].hasOwnProperty(b) && !MC.getRegion() && (MC.setRegion(r[a][b], "" == q()), c("#region").val(MC.getRegion()), d = !0));
        "" != v && (cc.initialise({
            cookies: {
                social: {},
                analytics: {},
                advertising: {},
                necessary: {}
            },
            settings: {
                consenttype: "explicit"
            }
        }), cc.setLocation(v));
        d || "" != q() || MC.reconnect()
    }

    function N(a) {
        a.preventDefault();
        b.core && b.core.playerZoom && b.core.playerZoom(a.wheelDelta / -120 || a.detail || 0)
    }

    function O(a) {
        e.context = "google" == a ? "google" : "facebook";
        A()
    }

    function A() {
        var a = !0;
        try {
            b.localStorage[w] = JSON.stringify(e)
        } catch (d) {
            a = !1
        }
        a && (e = JSON.parse(b.localStorage[w]), b.storageInfo = e);
        "google" == e.context ? (c("#gPlusShare").show(), c("#fbShare").hide()) : (c("#gPlusShare").hide(), c("#fbShare").show())
    }

    function P(a) {
        c("#helloContainer").attr("data-has-account-data");
        "" != a.displayName && (a.name = a.displayName);
        if (null == a.name || void 0 == a.name) a.name = "";
        var d = a.name.lastIndexOf("_"); - 1 != d && (a.name = a.name.substring(0, d));
        c("#helloContainer").attr("data-has-account-data", "1");
        c("#helloContainer").attr("data-logged-in", "1");
        c(".agario-profile-panel .progress-bar-star").text(a.level);
        c(".agario-exp-bar .progress-bar-text").text(a.xp + "/" +
            a.xpNeeded + " XP");
        c(".agario-exp-bar .progress-bar").css("width", (88 * a.xp / a.xpNeeded).toFixed(2) + "%");
        c(".agario-profile-name").text(a.name);
        "" != a.picture && c(".agario-profile-picture").attr("src", a.picture);
        e.userInfo.level = a.level;
        e.userInfo.xp = a.xp;
        e.userInfo.xpNeeded = a.xpNeeded;
        e.userInfo.displayName = a.name;
        e.userInfo.loggedIn = "1";
        b.updateStorage()
    }

    function x(a, d) {
        var k = a;
        if (e.userInfo.loggedIn && (a = c("#helloContainer").is(":visible") && "1" == c("#helloContainer").attr("data-has-account-data"), k && k || (k = e.userInfo), a)) {
            var f = +c(".agario-exp-bar .progress-bar-text").first().text().split("/")[0];
            a = +c(".agario-exp-bar .progress-bar-text").first().text().split("/")[1].split(" ")[0];
            var n = c(".agario-profile-panel .progress-bar-star").first().text();
            if (n != k.level) x({
                xp: a,
                xpNeeded: a,
                level: n
            }, function() {
                c(".agario-profile-panel .progress-bar-star").text(k.level);
                c(".agario-exp-bar .progress-bar").css("width", "100%");
                c(".progress-bar-star").addClass("animated tada").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function() {
                    c(".progress-bar-star").removeClass("animated tada")
                });
                setTimeout(function() {
                    c(".agario-exp-bar .progress-bar-text").text(k.xpNeeded + "/" + k.xpNeeded + " XP");
                    x({
                        xp: 0,
                        xpNeeded: k.xpNeeded,
                        level: k.level
                    }, function() {
                        x(k)
                    })
                }, 1E3)
            });
            else {
                var l = Date.now(),
                    g = function() {
                        var a = (Date.now() - l) / 1E3;
                        a = 0 > a ? 0 : 1 < a ? 1 : a;
                        a = a * a * (3 - 2 * a);
                        c(".agario-exp-bar .progress-bar-text").text(~~(f + (k.xp - f) * a) + "/" + k.xpNeeded + " XP");
                        c(".agario-exp-bar .progress-bar").css("width", (88 * (f + (k.xp - f) * a) / k.xpNeeded).toFixed(2) + "%");
                        d && d();
                        1 > a && b.requestAnimationFrame(g)
                    };
                b.requestAnimationFrame(g)
            }
        }
    }

    function Q() {
        1 != R && 0 != I && 0 != S && (R = !0, ("1" == b.storageInfo.loginIntent && "facebook" == b.storageInfo.context || T) && b.FB.getLoginStatus(function(a) {
            "connected" === a.status ? U(a) : b.logout()
        }), b.facebookRelogin = V, b.facebookLogin = V)
    }

    function V(a) {
        if (null == b.FB) alert("You seem to have something blocking Facebook on your browser, please check for any extensions"), a(null);
        else return e.loginIntent = "1", b.updateStorage(), b.FB.login(function(b) {
            U(b);
            a(b)
        }, {
            scope: J,
            auth_type: "rerequest"
        }), !0
    }

    function U(a) {
        if ("connected" == a.status) {
            var d = a.authResponse.accessToken;
            null == d || "undefined" == d || "" == d ? (3 > W && (W++, b.facebookRelogin()), b.logout()) : (b.fetchFacebookPermissions(), b.MC.doLoginWithFB(d), g.cache.login_info = [d, "facebook"], b.FB.api("/me/picture?width=180&height=180", function(d) {
                e.userInfo.picture = d.data.url;
                b.updateStorage();
                c(".agario-profile-picture").attr("src", d.data.url);
                e.userInfo.socialId = a.authResponse.userID;
                B()
            }), c("#helloContainer").attr("data-logged-in", "1"), e.context = "facebook", e.loginIntent = "1", b.updateStorage(), b.MC.showInstructionsPanel(!0), da())
        }
    }

    function da() {
        b.FB.api("/me/?fields=id,gender,birthday,token_for_business", function(a) {
            if (a.b) {
                var b = a.b.split("/");
                b = new Date(b[2] + "-" + b[0] + "-" + b[1])
            }
            MCSDK.analytics.sendEvent("client_init", {
                dob: b,
                facebook_id: a.id,
                facebook_id_for_business: a.G,
                gender: a.l,
                os: MCSDK.analytics.os_info,
                browser: MCSDK.analytics.browser_info,
                timestamp: +new Date
            })
        })
    }

    function ea(a) {
        g.google.f(a, function(a) {
            MCSDK.analytics.sendEvent("client_init", {
                dob: a.b,
                gender: a.l,
                google_plus_id: a.id,
                os: MCSDK.analytics.os_info,
                browser: MCSDK.analytics.browser_info,
                timestamp: +new Date
            })
        })
    }
    var h = document.createElement("canvas");
    if ("undefined" != typeof console && "undefined" != typeof DataView && "undefined" != typeof WebSocket && h && null != h.getContext && b.localStorage) {
        var I = !1,
            C = {};
        (function() {
            var a = b.location.search;
            "?" == a.charAt(0) && (a = a.slice(1));
            a = a.split("&");
            for (var d = 0; d < a.length; d++) {
                var c = a[d].split("=");
                C[c[0]] = c[1]
            }
        })();
        b.queryString = C;
        var T = "fb" in C;
        h = "miniclip" in
            C;
        var fa = function() {
                m("", -1)
            },
            X = "http:" != b.location.protocol,
            ha = "1" == function(a) {
                a += "=";
                for (var b = document.cookie.split(";"), c = 0; c < b.length; c++) {
                    for (var f = b[c];
                        " " == f.charAt(0);) f = f.substring(1, f.length);
                    if (0 == f.indexOf(a)) return f.substring(a.length, f.length)
                }
                return null
            }("agario_redirect"),
            Y = !1;
        T || h || (X && !ha ? (m("1", 1), b.location.href = "http:" + b.location.href.substring(b.location.protocol.length), Y = !0) : m("", -1));
        X || m("", -1);
        Y || setTimeout(fa, 3E3);
        if (!b.agarioNoInit) {
            var ca = b.location.protocol;
            h = b.navigator.userAgent;
            if (-1 != h.indexOf("Android")) b.ga && b.ga("send", "event", "MobileRedirect", "PlayStore"), setTimeout(function() {
                b.location.href = "https://play.google.com/store/apps/details?id=com.miniclip.agar.io"
            }, 1E3);
            else if (-1 != h.indexOf("iPhone") || -1 != h.indexOf("iPad") || -1 != h.indexOf("iPod")) b.ga && b.ga("send", "event", "MobileRedirect", "AppStore"), setTimeout(function() {
                b.location.href = "https://itunes.apple.com/app/agar.io/id995999703?mt=8&at=1l3vajp"
            }, 1E3);
            else {
                var g = {};
                b.agarApp = g;
                (new Image).src = "/img/split.png";
                var Z;
                b.agarioInit = function() {
                    Z = setTimeout(b.agarioAfterInit, 100)
                };
                b.agarioAfterInit = function() {
                    clearInterval(Z);
                    I = !0;
                    MC.wasInitialized();
                    null != b.localStorage[w] && (e = JSON.parse(b.localStorage[w]));
                    "1" == e.loginIntent ? O(e.context) : b.MC.setGuest();
                    "" == e.userInfo.name && "" == e.userInfo.displayName || P(e.userInfo);
                    Q();
                    g.a.c();
                    MC.getLatestConfigurationID();
                    g.core.init();
                    MC.refreshRegionInfo();
                    setInterval(MC.refreshRegionInfo, 18E4);
                    /firefox/i.test(navigator.userAgent) ? document.addEventListener("DOMMouseScroll", N, !1) : document.body.onmousewheel = N;
                    presetGameMode && MC.setGameMode(presetGameMode, !1);
                    z();
                    "" != q() ? MC.joinParty(q()) : MC.checkRegion();
                    b.MC.setInGameState(!1)
                };
                var v = "";
                b.setAcid = function() {};
                b.j = function() {
                    try {
                        console.log('       ,,,,,                                                  \u2553\u2584\u2593\u2584               \n     \u250c\u2593\u2593\u2593\u2593\u2593\u2556                                                 \u2559\u2593\u2593\u2580`              \n     \u2593\u2593\u2593\u255c\u2593\u2593\u2593        ,\u2553\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2510  ,\u2553\u2584\u2584\u2584\u2584\u2584\u2556     \u2553\u2584\u2584 ,\u2553\u2584\u2584\u2310      \u2553\u2584\u2584\u2584     \u2553\u2584\u2584\u2584\u2584\u2584,   \n    \u255f\u2593\u2593\u258c \u2559\u2593\u2593\u2593      \u2593\u2593\u2593\u2580\u2580\u2580\u2593\u2593\u2593\u2593\u2580`  \u2580\u2593\u2580\u2580\u2580\u2580\u2593\u2593\u2593\u2556   \u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593`      ]\u2593\u2593\u2593   \u2584\u2593\u2593\u2593\u2593\u2580\u2593\u2593\u2593\u2593\u00c7 \n   \u2590\u2593\u2593\u2593`  \u2593\u2593\u2593\u258c    ]\u2593\u2593\u2593   ]\u2593\u2593\u2593     ,,,,,\u2593\u2593\u2593\u2593   \u2593\u2593\u2593\u2593\u255c          ]\u2593\u2593\u2593  \u255f\u2593\u2593\u2593`   j\u2593\u2593\u2593U\n  \u2553\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2556    \u2580\u2593\u2593\u2593\u2584\u2584\u2593\u2593\u2593\u255c   \u2584\u2593\u2593\u2593\u2593\u2580\u2580\u2593\u2593\u2593\u2593   \u2593\u2593\u2593\u258c           ]\u2593\u2593\u2593  \u2593\u2593\u2593\u2593    ]\u2593\u2593\u2593\u258c\n  \u2593\u2593\u2593\u2593\u2580\u2580\u2580\u2580\u2580\u2580\u2593\u2593\u2593\u00b5   \u2554\u2593\u2593\u2580"""     ]\u2593\u2593\u2593\u2592  ,\u2593\u2593\u2593\u2593   \u2593\u2593\u2593\u258c     ,\u2553\u2553,  ]\u2593\u2593\u2593  \u2559\u2593\u2593\u2593\u2556   \u2584\u2593\u2593\u2593`\n \u2593\u2593\u2593\u2593       \u2593\u2593\u2593\u2593   \u2559\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2588\u2593\u2556  \u2593\u2593\u2593\u2593\u2588\u2588\u2593\u2580\u2593\u2593\u2593   \u2593\u2593\u2593\u258c     \u2593\u2593\u2593\u2593  ]\u2593\u2593\u2593   \u2559\u2580\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2580  \n ````        ```` \u2584\u2593\u2593\u2580""""\u2580\u2593\u2593\u2593    """`  ```   ````      \u2559"`   ```      `"""`    \n                  \u2593\u2593\u2593\u2584,,,\u2553\u2584\u2593\u2593\u2593                                                  \n                   \u2559\u2580\u2580\u2593\u2593\u2593\u2580\u2580\u2580                                                    \n')
                    } catch (a) {}
                };
                var K = {};
                b.addKeyListeners = function() {
                    b.onkeydown = function(a) {
                        if (!K[a.keyCode]) switch (K[a.keyCode] = !0, a.keyCode) {
                            case 32:
                                b.core && b.core.split && b.core.split();
                                a.preventDefault();
                                break;
                            case 87:
                                b.core && b.core.eject && b.core.eject();
                                break;
                            case 81:
                                b.core && b.core.specialOn && b.core.specialOn();
                                break;
                            case 27:
                                a.preventDefault();
                                MC.showNickDialog(300);
                                b.core && b.core.setFps && b.core.setFps(30);
                                c("#oferwallContainer").is(":visible") && b.closeOfferwall();
                                c("#videoContainer").is(":visible") && b.closeVideoContainer();
                                break;
                            case 220:
                                a.preventDefault(), MC.showStatsDialog()
                        }
                    };
                    b.onkeyup = function(a) {
                        K[a.keyCode] = !1;
                        81 == a.keyCode && b.specialOff && b.core.specialOff()
                    }
                };
                h = function(a) {
                    var d = {},
                        e = !1,
                        f = {
                            skipDraw: !0,
                            predictionModifier: 1.1
                        };
                    a.init = function() {
                        g.account.init();
                        g.google.m();
                        g.a.init();
                        (e = "debug" in b.queryString) && g.debug.showDebug()
                    };
                    a.bind = function(a, b) {
                        c(d).bind(a, b)
                    };
                    a.unbind = function(a, b) {
                        c(d).unbind(a, b)
                    };
                    a.trigger = function(a, b) {
                        c(d).trigger(a, b)
                    };
                    a.__defineGetter__("debug", function() {
                        return e
                    });
                    a.__defineSetter__("debug", function(a) {
                        return e = a
                    });
                    a.__defineGetter__("proxy", function() {
                        return b.MC
                    });
                    a.__defineGetter__("config", function() {
                        return f
                    });
                    return a
                }({});
                g.core = h;
                g.cache = {};
                h = function(a) {
                    function b(a, b, d, e) {
                        a += "Canvas";
                        var f = c("<canvas>", {
                            id: a
                        });
                        l.append(f);
                        d = new SmoothieChart(d);
                        for (f = 0; f < b.length; f++) {
                            var n = b[f],
                                k = _.extend(ia, e[f]);
                            d.addTimeSeries(n, k)
                        }
                        d.streamTo(document.getElementById(a), 0)
                    }

                    function e(a, d) {
                        p[a] = f();
                        b(a, [p[a]], d, [{
                            strokeStyle: "rgba(0, 255, 0, 1)",
                            fillStyle: "rgba(0, 255, 0, 0.2)",
                            lineWidth: 2
                        }])
                    }

                    function f() {
                        return new TimeSeries({
                            F: !1
                        })
                    }
                    var n = !1,
                        l, h = !1,
                        p = {},
                        ia = {
                            strokeStyle: "rgba(0, 255, 0, 1)",
                            fillStyle: "rgba(0, 255, 0, 0.2)",
                            lineWidth: 2
                        };
                    a.showDebug = function() {
                        n || (l = c("#debug-overlay"), e("networkUpdate", {
                            name: "network updates",
                            minValue: 0,
                            maxValue: 240
                        }), p.rttSDev = f(), p.rttMean = f(), b("rttMean", [p.rttSDev, p.rttMean], {
                            name: "rtt",
                            minValue: 0,
                            maxValue: 120
                        }, [{
                            strokeStyle: "rgba(255, 0, 0, 1)",
                            fillStyle: "rgba(0, 255, 0, 0.2)",
                            lineWidth: 2
                        }, {
                            strokeStyle: "rgba(0, 255, 0, 1)",
                            fillStyle: "rgba(0, 255, 0, 0)",
                            lineWidth: 2
                        }]), e("fps", {
                            name: "fps",
                            minValue: 0,
                            maxValue: 70
                        }), n = !0);
                        g.core.debug = !0;
                        l.show()
                    };
                    a.hideDebug = function() {
                        l.hide();
                        g.core.debug = !1
                    };
                    a.updateChart = function(a, b, d) {
                        n && a in p && p[a].append(b, d)
                    };
                    a.__defineGetter__("showPrediction", function() {
                        return h
                    });
                    a.__defineSetter__("showPrediction", function(a) {
                        return h = a
                    });
                    return a
                }({});
                g.debug = h;
                var r = {
                    AF: "JP-Tokyo",
                    AX: "EU-London",
                    AL: "EU-London",
                    DZ: "EU-London",
                    AS: "SG-Singapore",
                    AD: "EU-London",
                    AO: "EU-London",
                    AI: "US-Atlanta",
                    AG: "US-Atlanta",
                    AR: "BR-Brazil",
                    AM: "JP-Tokyo",
                    AW: "US-Atlanta",
                    AU: "SG-Singapore",
                    AT: "EU-London",
                    AZ: "JP-Tokyo",
                    BS: "US-Atlanta",
                    BH: "JP-Tokyo",
                    BD: "JP-Tokyo",
                    BB: "US-Atlanta",
                    BY: "EU-London",
                    BE: "EU-London",
                    BZ: "US-Atlanta",
                    BJ: "EU-London",
                    BM: "US-Atlanta",
                    BT: "JP-Tokyo",
                    BO: "BR-Brazil",
                    BQ: "US-Atlanta",
                    BA: "EU-London",
                    BW: "EU-London",
                    BR: "BR-Brazil",
                    IO: "JP-Tokyo",
                    VG: "US-Atlanta",
                    BN: "JP-Tokyo",
                    BG: "EU-London",
                    BF: "EU-London",
                    BI: "EU-London",
                    KH: "JP-Tokyo",
                    CM: "EU-London",
                    CA: "US-Atlanta",
                    CV: "EU-London",
                    KY: "US-Atlanta",
                    CF: "EU-London",
                    TD: "EU-London",
                    CL: "BR-Brazil",
                    CN: "CN-China",
                    CX: "JP-Tokyo",
                    CC: "JP-Tokyo",
                    CO: "BR-Brazil",
                    KM: "EU-London",
                    CD: "EU-London",
                    CG: "EU-London",
                    CK: "SG-Singapore",
                    CR: "US-Atlanta",
                    CI: "EU-London",
                    HR: "EU-London",
                    CU: "US-Atlanta",
                    CW: "US-Atlanta",
                    CY: "JP-Tokyo",
                    CZ: "EU-London",
                    DK: "EU-London",
                    DJ: "EU-London",
                    DM: "US-Atlanta",
                    DO: "US-Atlanta",
                    EC: "BR-Brazil",
                    EG: "EU-London",
                    SV: "US-Atlanta",
                    GQ: "EU-London",
                    ER: "EU-London",
                    EE: "EU-London",
                    ET: "EU-London",
                    FO: "EU-London",
                    FK: "BR-Brazil",
                    FJ: "SG-Singapore",
                    FI: "EU-London",
                    FR: "EU-London",
                    GF: "BR-Brazil",
                    PF: "SG-Singapore",
                    GA: "EU-London",
                    GM: "EU-London",
                    GE: "JP-Tokyo",
                    DE: "EU-London",
                    GH: "EU-London",
                    GI: "EU-London",
                    GR: "EU-London",
                    GL: "US-Atlanta",
                    GD: "US-Atlanta",
                    GP: "US-Atlanta",
                    GU: "SG-Singapore",
                    GT: "US-Atlanta",
                    GG: "EU-London",
                    GN: "EU-London",
                    GW: "EU-London",
                    GY: "BR-Brazil",
                    HT: "US-Atlanta",
                    VA: "EU-London",
                    HN: "US-Atlanta",
                    HK: "JP-Tokyo",
                    HU: "EU-London",
                    IS: "EU-London",
                    IN: "JP-Tokyo",
                    ID: "JP-Tokyo",
                    IR: "JP-Tokyo",
                    IQ: "JP-Tokyo",
                    IE: "EU-London",
                    IM: "EU-London",
                    IL: "JP-Tokyo",
                    IT: "EU-London",
                    JM: "US-Atlanta",
                    JP: "JP-Tokyo",
                    JE: "EU-London",
                    JO: "JP-Tokyo",
                    KZ: "JP-Tokyo",
                    KE: "EU-London",
                    KI: "SG-Singapore",
                    KP: "JP-Tokyo",
                    KR: "JP-Tokyo",
                    KW: "JP-Tokyo",
                    KG: "JP-Tokyo",
                    LA: "JP-Tokyo",
                    LV: "EU-London",
                    LB: "JP-Tokyo",
                    LS: "EU-London",
                    LR: "EU-London",
                    LY: "EU-London",
                    LI: "EU-London",
                    LT: "EU-London",
                    LU: "EU-London",
                    MO: "JP-Tokyo",
                    MK: "EU-London",
                    MG: "EU-London",
                    MW: "EU-London",
                    MY: "JP-Tokyo",
                    MV: "JP-Tokyo",
                    ML: "EU-London",
                    MT: "EU-London",
                    MH: "SG-Singapore",
                    MQ: "US-Atlanta",
                    MR: "EU-London",
                    MU: "EU-London",
                    YT: "EU-London",
                    MX: "US-Atlanta",
                    FM: "SG-Singapore",
                    MD: "EU-London",
                    MC: "EU-London",
                    MN: "JP-Tokyo",
                    ME: "EU-London",
                    MS: "US-Atlanta",
                    MA: "EU-London",
                    MZ: "EU-London",
                    MM: "JP-Tokyo",
                    NA: "EU-London",
                    NR: "SG-Singapore",
                    NP: "JP-Tokyo",
                    NL: "EU-London",
                    NC: "SG-Singapore",
                    NZ: "SG-Singapore",
                    NI: "US-Atlanta",
                    NE: "EU-London",
                    NG: "EU-London",
                    NU: "SG-Singapore",
                    NF: "SG-Singapore",
                    MP: "SG-Singapore",
                    NO: "EU-London",
                    OM: "JP-Tokyo",
                    PK: "JP-Tokyo",
                    PW: "SG-Singapore",
                    PS: "JP-Tokyo",
                    PA: "US-Atlanta",
                    PG: "SG-Singapore",
                    PY: "BR-Brazil",
                    PE: "BR-Brazil",
                    PH: "JP-Tokyo",
                    PN: "SG-Singapore",
                    PL: "EU-London",
                    PT: "EU-London",
                    PR: "US-Atlanta",
                    QA: "JP-Tokyo",
                    RE: "EU-London",
                    RO: "EU-London",
                    RU: "RU-Russia",
                    RW: "EU-London",
                    BL: "US-Atlanta",
                    SH: "EU-London",
                    KN: "US-Atlanta",
                    LC: "US-Atlanta",
                    MF: "US-Atlanta",
                    PM: "US-Atlanta",
                    VC: "US-Atlanta",
                    WS: "SG-Singapore",
                    SM: "EU-London",
                    ST: "EU-London",
                    SA: "EU-London",
                    SN: "EU-London",
                    RS: "EU-London",
                    SC: "EU-London",
                    SL: "EU-London",
                    SG: "JP-Tokyo",
                    SX: "US-Atlanta",
                    SK: "EU-London",
                    SI: "EU-London",
                    SB: "SG-Singapore",
                    SO: "EU-London",
                    ZA: "EU-London",
                    SS: "EU-London",
                    ES: "EU-London",
                    LK: "JP-Tokyo",
                    SD: "EU-London",
                    SR: "BR-Brazil",
                    SJ: "EU-London",
                    SZ: "EU-London",
                    SE: "EU-London",
                    CH: "EU-London",
                    SY: "EU-London",
                    TW: "JP-Tokyo",
                    TJ: "JP-Tokyo",
                    TZ: "EU-London",
                    TH: "JP-Tokyo",
                    TL: "JP-Tokyo",
                    TG: "EU-London",
                    TK: "SG-Singapore",
                    TO: "SG-Singapore",
                    TT: "US-Atlanta",
                    TN: "EU-London",
                    TR: "TK-Turkey",
                    TM: "JP-Tokyo",
                    TC: "US-Atlanta",
                    TV: "SG-Singapore",
                    UG: "EU-London",
                    UA: "EU-London",
                    AE: "EU-London",
                    GB: "EU-London",
                    US: "US-Atlanta",
                    UM: "SG-Singapore",
                    VI: "US-Atlanta",
                    UY: "BR-Brazil",
                    UZ: "JP-Tokyo",
                    VU: "SG-Singapore",
                    VE: "BR-Brazil",
                    VN: "JP-Tokyo",
                    WF: "SG-Singapore",
                    EH: "EU-London",
                    YE: "JP-Tokyo",
                    ZM: "EU-London",
                    ZW: "EU-London"
                };
                b.Maths = function(a) {
                    function b(a, b, d) {
                        return a < b ? b : a > d ? d : a
                    }
                    a.C = function(a, d, c) {
                        c = b(c, 0, 1);
                        return a + c * (d - a)
                    };
                    a.B = b;
                    a.fixed = function(a, b) {
                        b = Math.pow(10, b);
                        return ~~(a * b) / b
                    };
                    return a
                }({});
                b.Utils = function(a) {
                    a.D = function() {
                        var a = new Date,
                            b = [a.getMonth() + 1, a.getDate(), a.getFullYear()];
                        a = [a.getHours(), a.getMinutes(), a.getSeconds()];
                        for (var c = 1; 3 > c; c++) 10 > a[c] && (a[c] = "0" + a[c]);
                        return "[" + b.join("/") + " " + a.join(":") + "]"
                    };
                    return a
                }({});
                Date.now || (Date.now = function() {
                    return (new Date).getTime()
                });
                var w = "storeObjectInfo",
                    D = {
                        context: null,
                        defaultProvider: "facebook",
                        loginIntent: "0",
                        userInfo: {
                            socialToken: null,
                            tokenExpires: "",
                            level: "",
                            xp: "",
                            xpNeeded: "",
                            name: "",
                            picture: "",
                            displayName: "",
                            loggedIn: "0",
                            socialId: ""
                        }
                    },
                    e = b.defaultSt = D;
                b.storageInfo = e;
                b.createDefaultStorage = function() {
                    e = D
                };
                b.updateStorage = A;
                b.hasLoginIntent = function() {
                    return "1" == e.loginIntent
                };
                b.checkLoginStatus = function() {
                    "1" == e.loginIntent && (B(), O(e.context))
                };
                var B = function() {
                    b.MC.setProfilePicture(e.userInfo.picture);
                    b.MC.setSocialId(e.userInfo.socialId)
                };
                b.logout = function() {
                    var a = e.context;
                    "google" == e.context && aa();
                    e = D;
                    delete b.localStorage[w];
                    b.localStorage[w] = JSON.stringify(D);
                    A();
                    g.cache.sentGameServerLogin = !1;
                    delete g.cache.login_info;
                    c("#helloContainer").attr("data-logged-in", "0");
                    c("#helloContainer").attr("data-has-account-data", "0");
                    c(".timer").text("");
                    c("#gPlusShare").hide();
                    c("#fbShare").show();
                    c("#user-id-tag").text("");
                    c(".shop-blocker").fadeOut(100);
                    MC.doLogout();
                    MC.reconnect(!0);
                    b.ga("send", "event", "Logout", a)
                };
                b.animateAccountData = x;
                b.toggleSocialLogin = function() {
                    c("#socialLoginContainer").toggle();
                    c("#settings").hide();
                    c("#instructions").hide();
                    MC.showInstructionsPanel()
                };
                b.toggleSettings = function() {
                    c("#settings").toggle();
                    c("#socialLoginContainer").hide();
                    c("#instructions").hide();
                    MC.showInstructionsPanel()
                };
                g.account = function(a) {
                    function d() {}

                    function k(a, c) {
                        b.TRModule.init(c.id);
                        if (null == f || f.id != c.id) f = c, null != b.ssa_json && (b.ssa_json.applicationUserId = "" + c.id, b.ssa_json.custom_user_id = "" + c.id), "undefined" != typeof SSA_CORE && SSA_CORE.start()
                    }
                    var f = null;
                    a.init = function() {
                        g.core.bind("user_login", k);
                        g.core.bind("user_logout", d)
                    };
                    a.setUserData = function(a) {
                        P(a)
                    };
                    a.setAccountData = function(a, b) {
                        var d = c("#helloContainer").attr("data-has-account-data", "1");
                        e.userInfo.xp = a.xp;
                        e.userInfo.xpNeeded = a.xpNeeded;
                        e.userInfo.level = a.level;
                        A();
                        d && b ? x(a) : (c(".agario-profile-panel .progress-bar-star").text(a.level), c(".agario-exp-bar .progress-bar-text").text(a.xp + "/" + a.xpNeeded + " XP"), c(".agario-exp-bar .progress-bar").css("width", (88 * a.xp / a.xpNeeded).toFixed(2) + "%"))
                    };
                    a.A = function(a) {
                        x(a)
                    };
                    return a
                }({});
                var W = 0,
                    S = !1,
                    R = !1,
                    J = "public_profile,email,user_friends,user_birthday";
                b.facebookLogin = function(a) {
                    alert("Facebook Login is unavailable, please try again later or check if you are using private mode.");
                    a(null)
                };
                b.getFacebookPermissions = function() {
                    return e.permissions
                };
                b.fetchFacebookPermissions = function() {
                    b.FB.api("/me/permissions", function(a) {
                        a && a.data && (e.permissions = a.data)
                    })
                };
                b.requestExtraPermissions = function(a) {
                    var c = b.checkFacebookPermissions(a);
                    c || (-1 == J.indexOf(a) && (J += "," + a), b.facebookRelogin());
                    return !c
                };
                b.checkFacebookPermissions = function(a) {
                    var c = b.getFacebookPermissions;
                    if (c) {
                        c = c();
                        a = a.split(",");
                        if (null == c) return !1;
                        for (var e = 0; e < a.length; e++) {
                            for (var f = !1, g = 0; g < c.length; g++) a[e] == c[g].permission && "granted" == c[g].status && (f = !0);
                            if (!f) return !1
                        }
                        return !0
                    }
                    return !1
                };
                b.fbAsyncInit = function() {
                    b.FB.init({
                        appId: EnvConfig.fb_app_id,
                        cookie: !0,
                        xfbml: !0,
                        status: !0,
                        version: "v2.8"
                    });
                    S = !0;
                    Q();
                    if (EnvConfig.env_staging || EnvConfig.env_production) {
                        var a = document.createElement("script"),
                            c = document.getElementsByTagName("script")[0];
                        a.src = "https://renotifier.miniclippt.com/rntracking.js?app_id=" + EnvConfig.fb_app_id;
                        c.parentNode.insertBefore(a, c)
                    }
                };
                var L = !1;
                (function(a) {
                    function d() {
                        var a = document.createElement("script");
                        a.type = "text/javascript";
                        a.async = !0;
                        a.src = "//apis.google.com/js/client:platform.js?onload=gapiAsyncInit";
                        var b = document.getElementsByTagName("script")[0];
                        b.parentNode.insertBefore(a, b);
                        f = !0
                    }
                    var e = {},
                        f = !1;
                    b.gapiAsyncInit = function() {
                        c(e).trigger("initialized")
                    };
                    a.google = {
                        m: function() {
                            d()
                        },
                        f: function(a, c) {
                            b.gapi.client.load("plus", "v1", function() {
                                gapi.client.plus.people.get({
                                    userId: "me"
                                }).execute(function(a) {
                                    c(a)
                                })
                            })
                        }
                    };
                    a.w = function(a) {
                        f || d();
                        "undefined" !== typeof gapi ? a() : c(e).bind("initialized", a)
                    };
                    return a
                })(g);
                h = function(a) {
                    function d(a) {
                        b.MC.doLoginWithGPlus(a);
                        g.cache.login_info = [a, "google"];
                        b.MC.showInstructionsPanel(!0)
                    }

                    function k(a) {
                        e.userInfo.picture = a;
                        c(".agario-profile-picture").attr("src", a)
                    }
                    var f = !1,
                        h = !1,
                        l = null,
                        m = {
                            client_id: EnvConfig.gplus_client_id,
                            cookie_policy: "single_host_origin",
                            scope: "https://www.googleapis.com/auth/plus.login email",
                            app_package_name: "com.miniclip.agar.io"
                        };
                    a.a = {
                        H: function() {
                            return l
                        },
                        i: function() {
                            return e && "1" == e.loginIntent && "google" == e.context
                        },
                        init: function() {
                            var a = this;
                            g.w(function() {
                                b.gapi.ytsubscribe.go("agarYoutube");
                                f = !0;
                                a.c()
                            })
                        },
                        c: function() {
                            if (1 != h && 0 != I && 0 != f) {
                                h = !0;
                                var a = this;
                                b.gapi.load("auth2", function() {
                                    l = b.gapi.auth2.init(m);
                                    var c = document.getElementById("gplusLogin");
                                    c.addEventListener("click", function() {
                                        e.context = "google";
                                        e.loginIntent = "1";
                                        b.MC.googleLogin();
                                        a.u(b.open, l)
                                    });
                                    l.attachClickHandler(c, {}, function() {}, a.g);
                                    l.currentUser.listen(_.bind(a.v, a));
                                    l.then(_.bind(a.s, a), _.bind(a.g, a))
                                })
                            }
                        },
                        u: function(a) {
                            b.open = function() {
                                b.open = a;
                                var c = a.apply(this, arguments),
                                    d = setInterval(function() {
                                        c.closed && (clearInterval(d), b.MC.onGoogleLoginComplete(!1))
                                    }, 100);
                                return c
                            }
                        },
                        s: function() {
                            l.currentUser.get();
                            this.i() && !l.isSignedIn.get() && l.signIn()
                        },
                        g: function() {},
                        v: function(a) {
                            if (null != l && null != a && this.i()) {
                                var c = l.isSignedIn.get();
                                ea(l);
                                if (c && !L) {
                                    L = !0;
                                    c = a.getAuthResponse();
                                    var f = c.access_token,
                                        h = a.getBasicProfile();
                                    a = h.getImageUrl();
                                    void 0 == a ? g.google.f(c, function(a) {
                                        a.result.isPlusUser ? (a && k(a.image.url), d(f), a && (e.userInfo.picture = a.image.url), e.userInfo.socialId = h.getId(), B()) : (alert("Please add Google+ to your Google account and try again.\nOr you can login with another account."), b.logout())
                                    }) : (k(a), e.userInfo.picture = a, e.userInfo.socialId = h.getId(), B(), d(f));
                                    b.updateStorage()
                                }
                                b.MC.onGoogleLoginComplete(!0)
                            }
                        },
                        o: function() {
                            l && (l.signOut(), L = !1)
                        }
                    };
                    return a
                }(g);
                b.gplusModule = h;
                var aa = function() {
                    g.a.o()
                };
                b.logoutGooglePlus = aa;
                b.getStatsString = function(a) {
                    var d = c(".stats-time-alive").text();
                    return b.parseString(a, "%@", [d.split(":")[0], d.split(":")[1], c(".stats-highest-mass").text()])
                };
                b.twitterShareStats = function() {
                    b.open("https://twitter.com/intent/tweet?text=" + b.getStatsString("page_tt_share_stats"), "Agar.io", "width=660,height=310,menubar=no,toolbar=no,resizable=yes,scrollbars=no,left=" + (b.screenX + b.innerWidth / 2 - 330) + ",top=" +
                        (b.innerHeight - 310) / 2)
                };
                b.fbShareStats = function() {
                    var a = b.i18n("page_fb_matchresults_title"),
                        c = b.i18n("page_fb_matchresults_description"),
                        e = b.getStatsString("page_fb_matchresults_subtitle");
                    a = "https://r.agar.io" + ("?title=" + encodeURIComponent(a) + "&description=" + encodeURIComponent(e) + "&image=" + encodeURIComponent("http://static2.miniclipcdn.com/mobile/agar/Agar.io_matchresults_fb_1200x630.png"));
                    b.FB.ui({
                        method: "feed",
                        display: "iframe",
                        caption: c,
                        link: a
                    })
                };
                b.fillSocialValues = function(a, c) {
                    if ("google" ==
                        b.storageInfo.context) {
                        var d = {
                            contenturl: EnvConfig.game_url,
                            clientid: EnvConfig.gplus_client_id,
                            cookiepolicy: "http://agar.io",
                            prefilltext: a,
                            calltoactionlabel: "BEAT",
                            calltoactionurl: EnvConfig.game_url
                        };
                        1 == b.isChrome ? b.gapi.interactivepost.render(c, d) : document.getElementById(c).click = function() {
                            b.open("https://plus.google.com/share?url=" + EnvConfig.game_url + "&text=" + a, "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=400")
                        }
                    }
                };
                c(function() {
                    b.j();
                    "MAsyncInit" in b && b.MAsyncInit();
                    c("[data-itr]").each(function() {
                        var a = c(this),
                            d = a.attr("data-itr");
                        a.html(b.i18n(d))
                    })
                })
            }
        }
    } else alert("You browser does not support this game, we recommend you to use Firefox to play this")
})(window, window.jQuery);
