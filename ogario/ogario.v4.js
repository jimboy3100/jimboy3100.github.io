// Encoded by Szymy
// Decoded by Adam and MGx
// Simplified more by jimboy3100
// Thank you Snez for decoding Feross
// Thank you volum for the case 16: instance

//v1.49

//Game Configurations
//var agarversion="v12/1922/";
var agarversion="";
window.LMGameConfiguration = $.ajax({
        type: "GET",
		url: "https://jimboy3100.github.io/agario/live/"+agarversion+"GameConfiguration.json",
		async: false,
        datatype: "json",
        success: function(info) {
			//var GameConfiguration = info;
		}
}).responseJSON;
//weird but it works....

setTimeout(function(){ 
	if (window.LMGameConfiguration==undefined){
		window.LMGameConfiguration = $.ajax({
        type: "GET",
		url: "https://configs-web.agario.miniclippt.com/live/v12/1922/GameConfiguration.json",
		async: false,
        datatype: "json",
        success: function(info) {
			//var GameConfiguration = info;
		}
		}).responseJSON;
	}
 }, 4000);

//set values outside ogario
window.leaderboardlimit=10;
window.vanillaskins=false;

function ogcustom4(ogcustom5) {
	var ogcustom2 = {};
			ogcustom2[ogcustom5] = {'exports': {}}; 
			var ogcustom9=function(ogcustom7) {
                var ogcustom2 = ogcustom1[ogcustom5][1][ogcustom7];
                return ogcustom4(ogcustom2 || ogcustom7);
            }
				ogcustom1[ogcustom5][0]['call']({}, ogcustom9, ogcustom2[ogcustom5], ogcustom2[ogcustom5]["exports"], t, ogcustom1, ogcustom2, [47]);
        return ogcustom2[ogcustom5]["exports"]; 
}

function t() {

    for (customcounter1 = 0; customcounter1 < [47]["length"]; customcounter1++) {
        ogcustom4([47][customcounter1]);
    }		
}	
    
ogcustom1=	
{
        1: [
            function(t, e, i) {
                "use strict";
                (i.byteLength = function(t) {
                    return (3 * t.length) / 4 - h(t);
                }),
                (i.toByteArray = function(t) {
                    var e,
                        i,
                        s,
                        n,
                        r,
                        l = t.length;
                    (n = h(t)), (r = new a((3 * l) / 4 - n)), (i = n > 0 ? l - 4 : l);
                    var c = 0;
                    for (e = 0; e < i; e += 4)
                        (s =
                            (o[t.charCodeAt(e)] << 18) |
                            (o[t.charCodeAt(e + 1)] << 12) |
                            (o[t.charCodeAt(e + 2)] << 6) |
                            o[t.charCodeAt(e + 3)]),
                        (r[c++] = (s >> 16) & 255),
                        (r[c++] = (s >> 8) & 255),
                        (r[c++] = 255 & s);
                    2 === n ?
                        ((s =
                                (o[t.charCodeAt(e)] << 2) | (o[t.charCodeAt(e + 1)] >> 4)),
                            (r[c++] = 255 & s)) :
                        1 === n &&
                        ((s =
                                (o[t.charCodeAt(e)] << 10) |
                                (o[t.charCodeAt(e + 1)] << 4) |
                                (o[t.charCodeAt(e + 2)] >> 2)),
                            (r[c++] = (s >> 8) & 255),
                            (r[c++] = 255 & s));
                    return r;
                }),
                (i.fromByteArray = function(t) {
                    for (
                        var e, i = t.length, o = i % 3, a = "", n = [], r = 0, l = i - o; r < l; r += 16383
                    )
                        n.push(c(t, r, r + 16383 > l ? l : r + 16383));
                    1 === o ?
                        ((e = t[i - 1]),
                            (a += s[e >> 2]),
                            (a += s[(e << 4) & 63]),
                            (a += "==")) :
                        2 === o &&
                        ((e = (t[i - 2] << 8) + t[i - 1]),
                            (a += s[e >> 10]),
                            (a += s[(e >> 4) & 63]),
                            (a += s[(e << 2) & 63]),
                            (a += "="));
                    return n.push(a), n.join("");
                });
                for (
                    var s = [],
                        o = [],
                        a = "undefined" != typeof Uint8Array ? Uint8Array : Array,
                        n =
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                        r = 0,
                        l = n.length; r < l;
                    ++r
                )
                    (s[r] = n[r]), (o[n.charCodeAt(r)] = r);

                function h(t) {
                    var e = t.length;
                    if (e % 4 > 0)
                        throw new Error("Invalid string. Length must be a multiple of 4");
                    return "=" === t[e - 2] ? 2 : "=" === t[e - 1] ? 1 : 0;
                }

                function c(t, e, i) {
                    for (var o, a, n = [], r = e; r < i; r += 3)
                        (o = (t[r] << 16) + (t[r + 1] << 8) + t[r + 2]),
                        n.push(
                            s[((a = o) >> 18) & 63] +
                            s[(a >> 12) & 63] +
                            s[(a >> 6) & 63] +
                            s[63 & a]
                        );
                    return n.join("");
                }
                (o["-".charCodeAt(0)] = 62), (o["_".charCodeAt(0)] = 63);
            },
            {}
        ],
        2: [function(t, e, i) {}, {}],
        3: [
            function(t, e, i) {
                "use strict";
                var s = t("base64-js"),
                    o = t("ieee754");
                (i.Buffer = r),
                (i.SlowBuffer = function(t) {
                    +t != t && (t = 0);
                    return r.alloc(+t);
                }),
                (i.INSPECT_MAX_BYTES = 50);
                var a = 2147483647;

                function n(t) {
                    if (t > a) throw new RangeError("Invalid typed array length");
                    var e = new Uint8Array(t);
                    return (e.__proto__ = r.prototype), e;
                }

                function r(t, e, i) {
                    if ("number" == typeof t) {
                        if ("string" == typeof e)
                            throw new Error(
                                "If encoding is specified then the first argument must be a string"
                            );
                        return c(t);
                    }
                    return l(t, e, i);
                }

                function l(t, e, i) {
                    if ("number" == typeof t)
                        throw new TypeError('"value" argument must not be a number');
                    return t instanceof ArrayBuffer ?
                        (function(t, e, i) {
                            if (e < 0 || t.byteLength < e)
                                throw new RangeError("'offset' is out of bounds");
                            if (t.byteLength < e + (i || 0))
                                throw new RangeError("'length' is out of bounds");
                            var s;
                            s =
                                void 0 === e && void 0 === i ?
                                new Uint8Array(t) :
                                void 0 === i ?
                                new Uint8Array(t, e) :
                                new Uint8Array(t, e, i);
                            return (s.__proto__ = r.prototype), s;
                        })(t, e, i) :
                        "string" == typeof t ?
                        (function(t, e) {
                            ("string" == typeof e && "" !== e) || (e = "utf8");
                            if (!r.isEncoding(e))
                                throw new TypeError(
                                    '"encoding" must be a valid string encoding'
                                );
                            var i = 0 | p(t, e),
                                s = n(i),
                                o = s.write(t, e);
                            o !== i && (s = s.slice(0, o));
                            return s;
                        })(t, e) :
                        (function(t) {
                            if (r.isBuffer(t)) {
                                var e = 0 | d(t.length),
                                    i = n(e);
                                return 0 === i.length ? i : (t.copy(i, 0, 0, e), i);
                            }
                            if (t) {
                                if (E(t) || "length" in t)
                                    return "number" != typeof t.length || O(t.length) ?
                                        n(0) :
                                        u(t);
                                if ("Buffer" === t.type && Array.isArray(t.data))
                                    return u(t.data);
                            }
                            throw new TypeError(
                                "First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object."
                            );
                        })(t);
                }

                function h(t) {
                    if ("number" != typeof t)
                        throw new TypeError('"size" argument must be a number');
                    if (t < 0)
                        throw new RangeError('"size" argument must not be negative');
                }

                function c(t) {
                    return h(t), n(t < 0 ? 0 : 0 | d(t));
                }

                function u(t) {
                    for (
                        var e = t.length < 0 ? 0 : 0 | d(t.length), i = n(e), s = 0; s < e; s += 1
                    )
                        i[s] = 255 & t[s];
                    return i;
                }

                function d(t) {
                    if (t >= a)
                        throw new RangeError(
                            "Attempt to allocate Buffer larger than maximum size: 0x" +
                            a.toString(16) +
                            " bytes"
                        );
                    return 0 | t;
                }

                function p(t, e) {
                    if (r.isBuffer(t)) return t.length;
                    if (E(t) || t instanceof ArrayBuffer) return t.byteLength;
                    "string" != typeof t && (t = "" + t);
                    var i = t.length;
                    if (0 === i) return 0;
                    for (var s = !1;;)
                        switch (e) {
                            case "ascii":
                            case "latin1":
                            case "binary":
                                return i;
                            case "utf8":
                            case "utf-8":
                            case void 0:
                                return I(t).length;
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return 2 * i;
                            case "hex":
                                return i >>> 1;
                            case "base64":
                                return U(t).length;
                            default:
                                if (s) return I(t).length;
                                (e = ("" + e).toLowerCase()), (s = !0);
                        }
                }

                function f(t, e, i) {
                    var s = t[e];
                    (t[e] = t[i]), (t[i] = s);
                }

                function m(t, e, i, s, o) {
                    if (0 === t.length) return -1;
                    if (
                        ("string" == typeof i ?
                            ((s = i), (i = 0)) :
                            i > 2147483647 ?
                            (i = 2147483647) :
                            i < -2147483648 && (i = -2147483648),
                            O((i = +i)) && (i = o ? 0 : t.length - 1),
                            i < 0 && (i = t.length + i),
                            i >= t.length)
                    ) {
                        if (o) return -1;
                        i = t.length - 1;
                    } else if (i < 0) {
                        if (!o) return -1;
                        i = 0;
                    }
                    if (("string" == typeof e && (e = r.from(e, s)), r.isBuffer(e)))
                        return 0 === e.length ? -1 : g(t, e, i, s, o);
                    if ("number" == typeof e)
                        return (
                            (e &= 255),
                            "function" == typeof Uint8Array.prototype.indexOf ?
                            o ?
                            Uint8Array.prototype.indexOf.call(t, e, i) :
                            Uint8Array.prototype.lastIndexOf.call(t, e, i) :
                            g(t, [e], i, s, o)
                        );
                    throw new TypeError("val must be string, number or Buffer");
                }

                function g(t, e, i, s, o) {
                    var a,
                        n = 1,
                        r = t.length,
                        l = e.length;
                    if (
                        void 0 !== s &&
                        ("ucs2" === (s = String(s).toLowerCase()) ||
                            "ucs-2" === s ||
                            "utf16le" === s ||
                            "utf-16le" === s)
                    ) {
                        if (t.length < 2 || e.length < 2) return -1;
                        (n = 2), (r /= 2), (l /= 2), (i /= 2);
                    }

                    function h(t, e) {
                        return 1 === n ? t[e] : t.readUInt16BE(e * n);
                    }
                    if (o) {
                        var c = -1;
                        for (a = i; a < r; a++)
                            if (h(t, a) === h(e, -1 === c ? 0 : a - c)) {
                                if ((-1 === c && (c = a), a - c + 1 === l)) return c * n;
                            } else -1 !== c && (a -= a - c), (c = -1);
                    } else
                        for (i + l > r && (i = r - l), a = i; a >= 0; a--) {
                            for (var u = !0, d = 0; d < l; d++)
                                if (h(t, a + d) !== h(e, d)) {
                                    u = !1;
                                    break;
                                }
                            if (u) return a;
                        }
                    return -1;
                }

                function y(t, e, i, s) {
                    i = Number(i) || 0;
                    var o = t.length - i;
                    s ? (s = Number(s)) > o && (s = o) : (s = o);
                    var a = e.length;
                    if (a % 2 != 0) throw new TypeError("Invalid hex string");
                    s > a / 2 && (s = a / 2);
                    for (var n = 0; n < s; ++n) {
                        var r = parseInt(e.substr(2 * n, 2), 16);
                        if (O(r)) return n;
                        t[i + n] = r;
                    }
                    return n;
                }

                function k(t, e, i, s) {
                    return R(
                        (function(t) {
                            for (var e = [], i = 0; i < t.length; ++i)
                                e.push(255 & t.charCodeAt(i));
                            return e;
                        })(e),
                        t,
                        i,
                        s
                    );
                }

                function C(t, e, i) {
                    return 0 === e && i === t.length ?
                        s.fromByteArray(t) :
                        s.fromByteArray(t.slice(e, i));
                }

                function v(t, e, i) {
                    i = Math.min(t.length, i);
                    for (var s = [], o = e; o < i;) {
                        var a,
                            n,
                            r,
                            l,
                            h = t[o],
                            c = null,
                            u = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
                        if (o + u <= i)
                            switch (u) {
                                case 1:
                                    h < 128 && (c = h);
                                    break;
                                case 2:
                                    128 == (192 & (a = t[o + 1])) &&
                                        (l = ((31 & h) << 6) | (63 & a)) > 127 &&
                                        (c = l);
                                    break;
                                case 3:
                                    (a = t[o + 1]),
                                    (n = t[o + 2]),
                                    128 == (192 & a) &&
                                        128 == (192 & n) &&
                                        (l = ((15 & h) << 12) | ((63 & a) << 6) | (63 & n)) >
                                        2047 &&
                                        (l < 55296 || l > 57343) &&
                                        (c = l);
                                    break;
                                case 4:
                                    (a = t[o + 1]),
                                    (n = t[o + 2]),
                                    (r = t[o + 3]),
                                    128 == (192 & a) &&
                                        128 == (192 & n) &&
                                        128 == (192 & r) &&
                                        (l =
                                            ((15 & h) << 18) |
                                            ((63 & a) << 12) |
                                            ((63 & n) << 6) |
                                            (63 & r)) > 65535 &&
                                        l < 1114112 &&
                                        (c = l);
                            }
                        null === c ?
                            ((c = 65533), (u = 1)) :
                            c > 65535 &&
                            ((c -= 65536),
                                s.push(((c >>> 10) & 1023) | 55296),
                                (c = 56320 | (1023 & c))),
                            s.push(c),
                            (o += u);
                    }
                    return (function(t) {
                        var e = t.length;
                        if (e <= b) return String.fromCharCode.apply(String, t);
                        var i = "",
                            s = 0;
                        for (; s < e;)
                            i += String.fromCharCode.apply(String, t.slice(s, (s += b)));
                        return i;
                    })(s);
                }
                (i.kMaxLength = a),
                (r.TYPED_ARRAY_SUPPORT = (function() {
                    try {
                        var t = new Uint8Array(1);
                        return (
                            (t.__proto__ = {
                                __proto__: Uint8Array.prototype,
                                foo: function() {
                                    return 42;
                                }
                            }),
                            42 === t.foo()
                        );
                    } catch (t) {
                        return !1;
                    }
                })()),
                r.TYPED_ARRAY_SUPPORT ||
                    "undefined" == typeof console ||
                    "function" != typeof console.error ||
                    console.error(
                        "This browser lacks typed array (Uint8Array) support which is required by buffer v5.x. Use v4.x if you require old browser support."
                    ),
                    "undefined" != typeof Symbol &&
                    Symbol.species &&
                    r[Symbol.species] === r &&
                    Object.defineProperty(r, Symbol.species, {
                        value: null,
                        configurable: !0,
                        enumerable: !1,
                        writable: !1
                    }),
                    (r.poolSize = 8192),
                    (r.from = function(t, e, i) {
                        return l(t, e, i);
                    }),
                    (r.prototype.__proto__ = Uint8Array.prototype),
                    (r.__proto__ = Uint8Array),
                    (r.alloc = function(t, e, i) {
                        return (
                            (o = e),
                            (a = i),
                            h((s = t)),
                            s <= 0 ?
                            n(s) :
                            void 0 !== o ?
                            "string" == typeof a ?
                            n(s).fill(o, a) :
                            n(s).fill(o) :
                            n(s)
                        );
                        var s, o, a;
                    }),
                    (r.allocUnsafe = function(t) {
                        return c(t);
                    }),
                    (r.allocUnsafeSlow = function(t) {
                        return c(t);
                    }),
                    (r.isBuffer = function(t) {
                        return null != t && !0 === t._isBuffer;
                    }),
                    (r.compare = function(t, e) {
                        if (!r.isBuffer(t) || !r.isBuffer(e))
                            throw new TypeError("Arguments must be Buffers");
                        if (t === e) return 0;
                        for (
                            var i = t.length, s = e.length, o = 0, a = Math.min(i, s); o < a;
                            ++o
                        )
                            if (t[o] !== e[o]) {
                                (i = t[o]), (s = e[o]);
                                break;
                            }
                        return i < s ? -1 : s < i ? 1 : 0;
                    }),
                    (r.isEncoding = function(t) {
                        switch (String(t).toLowerCase()) {
                            case "hex":
                            case "utf8":
                            case "utf-8":
                            case "ascii":
                            case "latin1":
                            case "binary":
                            case "base64":
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                                return !0;
                            default:
                                return !1;
                        }
                    }),
                    (r.concat = function(t, e) {
                        if (!Array.isArray(t))
                            throw new TypeError(
                                '"list" argument must be an Array of Buffers'
                            );
                        if (0 === t.length) return r.alloc(0);
                        var i;
                        if (void 0 === e)
                            for (e = 0, i = 0; i < t.length; ++i) e += t[i].length;
                        var s = r.allocUnsafe(e),
                            o = 0;
                        for (i = 0; i < t.length; ++i) {
                            var a = t[i];
                            if (!r.isBuffer(a))
                                throw new TypeError(
                                    '"list" argument must be an Array of Buffers'
                                );
                            a.copy(s, o), (o += a.length);
                        }
                        return s;
                    }),
                    (r.byteLength = p),
                    (r.prototype._isBuffer = !0),
                    (r.prototype.swap16 = function() {
                        var t = this.length;
                        if (t % 2 != 0)
                            throw new RangeError("Buffer size must be a multiple of 16-bits");
                        for (var e = 0; e < t; e += 2) f(this, e, e + 1);
                        return this;
                    }),
                    (r.prototype.swap32 = function() {
                        var t = this.length;
                        if (t % 4 != 0)
                            throw new RangeError("Buffer size must be a multiple of 32-bits");
                        for (var e = 0; e < t; e += 4)
                            f(this, e, e + 3), f(this, e + 1, e + 2);
                        return this;
                    }),
                    (r.prototype.swap64 = function() {
                        var t = this.length;
                        if (t % 8 != 0)
                            throw new RangeError("Buffer size must be a multiple of 64-bits");
                        for (var e = 0; e < t; e += 8)
                            f(this, e, e + 7),
                            f(this, e + 1, e + 6),
                            f(this, e + 2, e + 5),
                            f(this, e + 3, e + 4);
                        return this;
                    }),
                    (r.prototype.toString = function() {
                        var t = this.length;
                        return 0 === t ?
                            "" :
                            0 === arguments.length ?
                            v(this, 0, t) :
                            function(t, e, i) {
                                var s = !1;
                                if (((void 0 === e || e < 0) && (e = 0), e > this.length))
                                    return "";
                                if (
                                    ((void 0 === i || i > this.length) && (i = this.length),
                                        i <= 0)
                                )
                                    return "";
                                if ((i >>>= 0) <= (e >>>= 0)) return "";
                                for (t || (t = "utf8");;)
                                    switch (t) {
                                        case "hex":
                                            return M(this, e, i);
                                        case "utf8":
                                        case "utf-8":
                                            return v(this, e, i);
                                        case "ascii":
                                            return S(this, e, i);
                                        case "latin1":
                                        case "binary":
                                            return w(this, e, i);
                                        case "base64":
                                            return C(this, e, i);
                                        case "ucs2":
                                        case "ucs-2":
                                        case "utf16le":
                                        case "utf-16le":
                                            return x(this, e, i);
                                        default:
                                            if (s) throw new TypeError("Unknown encoding: " + t);
                                            (t = (t + "").toLowerCase()), (s = !0);
                                    }
                            }.apply(this, arguments);
                    }),
                    (r.prototype.equals = function(t) {
                        if (!r.isBuffer(t))
                            throw new TypeError("Argument must be a Buffer");
                        return this === t || 0 === r.compare(this, t);
                    }),
                    (r.prototype.inspect = function() {
                        var t = "",
                            e = i.INSPECT_MAX_BYTES;
                        return (
                            this.length > 0 &&
                            ((t = this.toString("hex", 0, e)
                                    .match(/.{2}/g)
                                    .join(" ")),
                                this.length > e && (t += " ... ")),
                            "<Buffer " + t + ">"
                        );
                    }),
                    (r.prototype.compare = function(t, e, i, s, o) {
                        if (!r.isBuffer(t))
                            throw new TypeError("Argument must be a Buffer");
                        if (
                            (void 0 === e && (e = 0),
                                void 0 === i && (i = t ? t.length : 0),
                                void 0 === s && (s = 0),
                                void 0 === o && (o = this.length),
                                e < 0 || i > t.length || s < 0 || o > this.length)
                        )
                            throw new RangeError("out of range index");
                        if (s >= o && e >= i) return 0;
                        if (s >= o) return -1;
                        if (e >= i) return 1;
                        if (this === t) return 0;
                        for (
                            var a = (o >>>= 0) - (s >>>= 0),
                                n = (i >>>= 0) - (e >>>= 0),
                                l = Math.min(a, n),
                                h = this.slice(s, o),
                                c = t.slice(e, i),
                                u = 0; u < l;
                            ++u
                        )
                            if (h[u] !== c[u]) {
                                (a = h[u]), (n = c[u]);
                                break;
                            }
                        return a < n ? -1 : n < a ? 1 : 0;
                    }),
                    (r.prototype.includes = function(t, e, i) {
                        return -1 !== this.indexOf(t, e, i);
                    }),
                    (r.prototype.indexOf = function(t, e, i) {
                        return m(this, t, e, i, !0);
                    }),
                    (r.prototype.lastIndexOf = function(t, e, i) {
                        return m(this, t, e, i, !1);
                    }),
                    (r.prototype.write = function(t, e, i, s) {
                        if (void 0 === e)(s = "utf8"), (i = this.length), (e = 0);
                        else if (void 0 === i && "string" == typeof e)
                            (s = e), (i = this.length), (e = 0);
                        else {
                            if (!isFinite(e))
                                throw new Error(
                                    "Buffer.write(string, encoding, offset[, length]) is no longer supported"
                                );
                            (e >>>= 0),
                            isFinite(i) ?
                                ((i >>>= 0), void 0 === s && (s = "utf8")) :
                                ((s = i), (i = void 0));
                        }
                        var o = this.length - e;
                        if (
                            ((void 0 === i || i > o) && (i = o),
                                (t.length > 0 && (i < 0 || e < 0)) || e > this.length)
                        )
                            throw new RangeError("Attempt to write outside buffer bounds");
                        s || (s = "utf8");
                        for (var a, n, r, l, h, c, u, d, p, f = !1;;)
                            switch (s) {
                                case "hex":
                                    return y(this, t, e, i);
                                case "utf8":
                                case "utf-8":
                                    return (
                                        (d = e), (p = i), R(I(t, (u = this).length - d), u, d, p)
                                    );
                                case "ascii":
                                    return k(this, t, e, i);
                                case "latin1":
                                case "binary":
                                    return k(this, t, e, i);
                                case "base64":
                                    return (l = this), (h = e), (c = i), R(U(t), l, h, c);
                                case "ucs2":
                                case "ucs-2":
                                case "utf16le":
                                case "utf-16le":
                                    return (
                                        (n = e),
                                        (r = i),
                                        R(
                                            (function(t, e) {
                                                for (
                                                    var i, s, o, a = [], n = 0; n < t.length && !((e -= 2) < 0);
                                                    ++n
                                                )
                                                    (i = t.charCodeAt(n)),
                                                    (s = i >> 8),
                                                    (o = i % 256),
                                                    a.push(o),
                                                    a.push(s);
                                                return a;
                                            })(t, (a = this).length - n),
                                            a,
                                            n,
                                            r
                                        )
                                    );
                                default:
                                    if (f) throw new TypeError("Unknown encoding: " + s);
                                    (s = ("" + s).toLowerCase()), (f = !0);
                            }
                    }),
                    (r.prototype.toJSON = function() {
                        return {
                            type: "Buffer",
                            data: Array.prototype.slice.call(this._arr || this, 0)
                        };
                    });
                var b = 4096;

                function S(t, e, i) {
                    var s = "";
                    i = Math.min(t.length, i);
                    for (var o = e; o < i; ++o) s += String.fromCharCode(127 & t[o]);
                    return s;
                }

                function w(t, e, i) {
                    var s = "";
                    i = Math.min(t.length, i);
                    for (var o = e; o < i; ++o) s += String.fromCharCode(t[o]);
                    return s;
                }

                function M(t, e, i) {
                    var s = t.length;
                    (!e || e < 0) && (e = 0), (!i || i < 0 || i > s) && (i = s);
                    for (var o = "", a = e; a < i; ++a) o += D(t[a]);
                    return o;
                }

                function x(t, e, i) {
                    for (var s = t.slice(e, i), o = "", a = 0; a < s.length; a += 2)
                        o += String.fromCharCode(s[a] + 256 * s[a + 1]);
                    return o;
                }

                function _(t, e, i) {
                    if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
                    if (t + e > i)
                        throw new RangeError("Trying to access beyond buffer length");
                }

                function T(t, e, i, s, o, a) {
                    if (!r.isBuffer(t))
                        throw new TypeError('"buffer" argument must be a Buffer instance');
                    if (e > o || e < a)
                        throw new RangeError('"value" argument is out of bounds');
                    if (i + s > t.length) throw new RangeError("Index out of range");
                }

                function z(t, e, i, s, o, a) {
                    if (i + s > t.length) throw new RangeError("Index out of range");
                    if (i < 0) throw new RangeError("Index out of range");
                }

                function P(t, e, i, s, a) {
                    return (
                        (e = +e),
                        (i >>>= 0),
                        a || z(t, 0, i, 4),
                        o.write(t, e, i, s, 23, 4),
                        i + 4
                    );
                }

                function A(t, e, i, s, a) {
                    return (
                        (e = +e),
                        (i >>>= 0),
                        a || z(t, 0, i, 8),
                        o.write(t, e, i, s, 52, 8),
                        i + 8
                    );
                }
                (r.prototype.slice = function(t, e) {
                    var i = this.length;
                    (t = ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i),
                        (e = void 0 === e ? i : ~~e) < 0 ?
                        (e += i) < 0 && (e = 0) :
                        e > i && (e = i),
                        e < t && (e = t);
                    var s = this.subarray(t, e);
                    return (s.__proto__ = r.prototype), s;
                }),
                (r.prototype.readUIntLE = function(t, e, i) {
                    (t >>>= 0), (e >>>= 0), i || _(t, e, this.length);
                    for (var s = this[t], o = 1, a = 0; ++a < e && (o *= 256);)
                        s += this[t + a] * o;
                    return s;
                }),
                (r.prototype.readUIntBE = function(t, e, i) {
                    (t >>>= 0), (e >>>= 0), i || _(t, e, this.length);
                    for (var s = this[t + --e], o = 1; e > 0 && (o *= 256);)
                        s += this[t + --e] * o;
                    return s;
                }),
                (r.prototype.readUInt8 = function(t, e) {
                    return (t >>>= 0), e || _(t, 1, this.length), this[t];
                }),
                (r.prototype.readUInt16LE = function(t, e) {
                    return (
                        (t >>>= 0),
                        e || _(t, 2, this.length),
                        this[t] | (this[t + 1] << 8)
                    );
                }),
                (r.prototype.readUInt16BE = function(t, e) {
                    return (
                        (t >>>= 0),
                        e || _(t, 2, this.length),
                        (this[t] << 8) | this[t + 1]
                    );
                }),
                (r.prototype.readUInt32LE = function(t, e) {
                    return (
                        (t >>>= 0),
                        e || _(t, 4, this.length),
                        (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                        16777216 * this[t + 3]
                    );
                }),
                (r.prototype.readUInt32BE = function(t, e) {
                    return (
                        (t >>>= 0),
                        e || _(t, 4, this.length),
                        16777216 * this[t] +
                        ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
                    );
                }),
                (r.prototype.readIntLE = function(t, e, i) {
                    (t >>>= 0), (e >>>= 0), i || _(t, e, this.length);
                    for (var s = this[t], o = 1, a = 0; ++a < e && (o *= 256);)
                        s += this[t + a] * o;
                    return s >= (o *= 128) && (s -= Math.pow(2, 8 * e)), s;
                }),
                (r.prototype.readIntBE = function(t, e, i) {
                    (t >>>= 0), (e >>>= 0), i || _(t, e, this.length);
                    for (var s = e, o = 1, a = this[t + --s]; s > 0 && (o *= 256);)
                        a += this[t + --s] * o;
                    return a >= (o *= 128) && (a -= Math.pow(2, 8 * e)), a;
                }),
                (r.prototype.readInt8 = function(t, e) {
                    return (
                        (t >>>= 0),
                        e || _(t, 1, this.length),
                        128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
                    );
                }),
                (r.prototype.readInt16LE = function(t, e) {
                    (t >>>= 0), e || _(t, 2, this.length);
                    var i = this[t] | (this[t + 1] << 8);
                    return 32768 & i ? 4294901760 | i : i;
                }),
                (r.prototype.readInt16BE = function(t, e) {
                    (t >>>= 0), e || _(t, 2, this.length);
                    var i = this[t + 1] | (this[t] << 8);
                    return 32768 & i ? 4294901760 | i : i;
                }),
                (r.prototype.readInt32LE = function(t, e) {
                    return (
                        (t >>>= 0),
                        e || _(t, 4, this.length),
                        this[t] |
                        (this[t + 1] << 8) |
                        (this[t + 2] << 16) |
                        (this[t + 3] << 24)
                    );
                }),
                (r.prototype.readInt32BE = function(t, e) {
                    return (
                        (t >>>= 0),
                        e || _(t, 4, this.length),
                        (this[t] << 24) |
                        (this[t + 1] << 16) |
                        (this[t + 2] << 8) |
                        this[t + 3]
                    );
                }),
                (r.prototype.readFloatLE = function(t, e) {
                    return (
                        (t >>>= 0), e || _(t, 4, this.length), o.read(this, t, !0, 23, 4)
                    );
                }),
                (r.prototype.readFloatBE = function(t, e) {
                    return (
                        (t >>>= 0), e || _(t, 4, this.length), o.read(this, t, !1, 23, 4)
                    );
                }),
                (r.prototype.readDoubleLE = function(t, e) {
                    return (
                        (t >>>= 0), e || _(t, 8, this.length), o.read(this, t, !0, 52, 8)
                    );
                }),
                (r.prototype.readDoubleBE = function(t, e) {
                    return (
                        (t >>>= 0), e || _(t, 8, this.length), o.read(this, t, !1, 52, 8)
                    );
                }),
                (r.prototype.writeUIntLE = function(t, e, i, s) {
                    ((t = +t), (e >>>= 0), (i >>>= 0), s) ||
                    T(this, t, e, i, Math.pow(2, 8 * i) - 1, 0);
                    var o = 1,
                        a = 0;
                    for (this[e] = 255 & t; ++a < i && (o *= 256);)
                        this[e + a] = (t / o) & 255;
                    return e + i;
                }),
                (r.prototype.writeUIntBE = function(t, e, i, s) {
                    ((t = +t), (e >>>= 0), (i >>>= 0), s) ||
                    T(this, t, e, i, Math.pow(2, 8 * i) - 1, 0);
                    var o = i - 1,
                        a = 1;
                    for (this[e + o] = 255 & t; --o >= 0 && (a *= 256);)
                        this[e + o] = (t / a) & 255;
                    return e + i;
                }),
                (r.prototype.writeUInt8 = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 1, 255, 0),
                        (this[e] = 255 & t),
                        e + 1
                    );
                }),
                (r.prototype.writeUInt16LE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 2, 65535, 0),
                        (this[e] = 255 & t),
                        (this[e + 1] = t >>> 8),
                        e + 2
                    );
                }),
                (r.prototype.writeUInt16BE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 2, 65535, 0),
                        (this[e] = t >>> 8),
                        (this[e + 1] = 255 & t),
                        e + 2
                    );
                }),
                (r.prototype.writeUInt32LE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 4, 4294967295, 0),
                        (this[e + 3] = t >>> 24),
                        (this[e + 2] = t >>> 16),
                        (this[e + 1] = t >>> 8),
                        (this[e] = 255 & t),
                        e + 4
                    );
                }),
                (r.prototype.writeUInt32BE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 4, 4294967295, 0),
                        (this[e] = t >>> 24),
                        (this[e + 1] = t >>> 16),
                        (this[e + 2] = t >>> 8),
                        (this[e + 3] = 255 & t),
                        e + 4
                    );
                }),
                (r.prototype.writeIntLE = function(t, e, i, s) {
                    if (((t = +t), (e >>>= 0), !s)) {
                        var o = Math.pow(2, 8 * i - 1);
                        T(this, t, e, i, o - 1, -o);
                    }
                    var a = 0,
                        n = 1,
                        r = 0;
                    for (this[e] = 255 & t; ++a < i && (n *= 256);)
                        t < 0 && 0 === r && 0 !== this[e + a - 1] && (r = 1),
                        (this[e + a] = (((t / n) >> 0) - r) & 255);
                    return e + i;
                }),
                (r.prototype.writeIntBE = function(t, e, i, s) {
                    if (((t = +t), (e >>>= 0), !s)) {
                        var o = Math.pow(2, 8 * i - 1);
                        T(this, t, e, i, o - 1, -o);
                    }
                    var a = i - 1,
                        n = 1,
                        r = 0;
                    for (this[e + a] = 255 & t; --a >= 0 && (n *= 256);)
                        t < 0 && 0 === r && 0 !== this[e + a + 1] && (r = 1),
                        (this[e + a] = (((t / n) >> 0) - r) & 255);
                    return e + i;
                }),
                (r.prototype.writeInt8 = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 1, 127, -128),
                        t < 0 && (t = 255 + t + 1),
                        (this[e] = 255 & t),
                        e + 1
                    );
                }),
                (r.prototype.writeInt16LE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 2, 32767, -32768),
                        (this[e] = 255 & t),
                        (this[e + 1] = t >>> 8),
                        e + 2
                    );
                }),
                (r.prototype.writeInt16BE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 2, 32767, -32768),
                        (this[e] = t >>> 8),
                        (this[e + 1] = 255 & t),
                        e + 2
                    );
                }),
                (r.prototype.writeInt32LE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 4, 2147483647, -2147483648),
                        (this[e] = 255 & t),
                        (this[e + 1] = t >>> 8),
                        (this[e + 2] = t >>> 16),
                        (this[e + 3] = t >>> 24),
                        e + 4
                    );
                }),
                (r.prototype.writeInt32BE = function(t, e, i) {
                    return (
                        (t = +t),
                        (e >>>= 0),
                        i || T(this, t, e, 4, 2147483647, -2147483648),
                        t < 0 && (t = 4294967295 + t + 1),
                        (this[e] = t >>> 24),
                        (this[e + 1] = t >>> 16),
                        (this[e + 2] = t >>> 8),
                        (this[e + 3] = 255 & t),
                        e + 4
                    );
                }),
                (r.prototype.writeFloatLE = function(t, e, i) {
                    return P(this, t, e, !0, i);
                }),
                (r.prototype.writeFloatBE = function(t, e, i) {
                    return P(this, t, e, !1, i);
                }),
                (r.prototype.writeDoubleLE = function(t, e, i) {
                    return A(this, t, e, !0, i);
                }),
                (r.prototype.writeDoubleBE = function(t, e, i) {
                    return A(this, t, e, !1, i);
                }),
                (r.prototype.copy = function(t, e, i, s) {
                    if (
                        (i || (i = 0),
                            s || 0 === s || (s = this.length),
                            e >= t.length && (e = t.length),
                            e || (e = 0),
                            s > 0 && s < i && (s = i),
                            s === i)
                    )
                        return 0;
                    if (0 === t.length || 0 === this.length) return 0;
                    if (e < 0) throw new RangeError("targetStart out of bounds");
                    if (i < 0 || i >= this.length)
                        throw new RangeError("sourceStart out of bounds");
                    if (s < 0) throw new RangeError("sourceEnd out of bounds");
                    s > this.length && (s = this.length),
                        t.length - e < s - i && (s = t.length - e + i);
                    var o,
                        a = s - i;
                    if (this === t && i < e && e < s)
                        for (o = a - 1; o >= 0; --o) t[o + e] = this[o + i];
                    else if (a < 1e3)
                        for (o = 0; o < a; ++o) t[o + e] = this[o + i];
                    else Uint8Array.prototype.set.call(t, this.subarray(i, i + a), e);
                    return a;
                }),
                (r.prototype.fill = function(t, e, i, s) {
                    if ("string" == typeof t) {
                        if (
                            ("string" == typeof e ?
                                ((s = e), (e = 0), (i = this.length)) :
                                "string" == typeof i && ((s = i), (i = this.length)),
                                1 === t.length)
                        ) {
                            var o = t.charCodeAt(0);
                            o < 256 && (t = o);
                        }
                        if (void 0 !== s && "string" != typeof s)
                            throw new TypeError("encoding must be a string");
                        if ("string" == typeof s && !r.isEncoding(s))
                            throw new TypeError("Unknown encoding: " + s);
                    } else "number" == typeof t && (t &= 255);
                    if (e < 0 || this.length < e || this.length < i)
                        throw new RangeError("Out of range index");
                    if (i <= e) return this;
                    var a;
                    if (
                        ((e >>>= 0),
                            (i = void 0 === i ? this.length : i >>> 0),
                            t || (t = 0),
                            "number" == typeof t)
                    )
                        for (a = e; a < i; ++a) this[a] = t;
                    else {
                        var n = r.isBuffer(t) ? t : new r(t, s),
                            l = n.length;
                        for (a = 0; a < i - e; ++a) this[a + e] = n[a % l];
                    }
                    return this;
                });
                var B = /[^+\/0-9A-Za-z-_]/g;

                function D(t) {
                    return t < 16 ? "0" + t.toString(16) : t.toString(16);
                }

                function I(t, e) {
                    var i;
                    e = e || 1 / 0;
                    for (var s = t.length, o = null, a = [], n = 0; n < s; ++n) {
                        if ((i = t.charCodeAt(n)) > 55295 && i < 57344) {
                            if (!o) {
                                if (i > 56319) {
                                    (e -= 3) > -1 && a.push(239, 191, 189);
                                    continue;
                                }
                                if (n + 1 === s) {
                                    (e -= 3) > -1 && a.push(239, 191, 189);
                                    continue;
                                }
                                o = i;
                                continue;
                            }
                            if (i < 56320) {
                                (e -= 3) > -1 && a.push(239, 191, 189), (o = i);
                                continue;
                            }
                            i = 65536 + (((o - 55296) << 10) | (i - 56320));
                        } else o && (e -= 3) > -1 && a.push(239, 191, 189);
                        if (((o = null), i < 128)) {
                            if ((e -= 1) < 0) break;
                            a.push(i);
                        } else if (i < 2048) {
                            if ((e -= 2) < 0) break;
                            a.push((i >> 6) | 192, (63 & i) | 128);
                        } else if (i < 65536) {
                            if ((e -= 3) < 0) break;
                            a.push((i >> 12) | 224, ((i >> 6) & 63) | 128, (63 & i) | 128);
                        } else {
                            if (!(i < 1114112)) throw new Error("Invalid code point");
                            if ((e -= 4) < 0) break;
                            a.push(
                                (i >> 18) | 240,
                                ((i >> 12) & 63) | 128,
                                ((i >> 6) & 63) | 128,
                                (63 & i) | 128
                            );
                        }
                    }
                    return a;
                }

                function U(t) {
                    return s.toByteArray(
                        (function(t) {
                            if ((t = t.trim().replace(B, "")).length < 2) return "";
                            for (; t.length % 4 != 0;) t += "=";
                            return t;
                        })(t)
                    );
                }

                function R(t, e, i, s) {
                    for (var o = 0; o < s && !(o + i >= e.length || o >= t.length); ++o)
                        e[o + i] = t[o];
                    return o;
                }

                function E(t) {
                    return (
                        "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(t)
                    );
                }

                function O(t) {
                    return t != t;
                }
            },
            {
                "base64-js": 1,
                ieee754: 9
            }
        ],
        4: [
            function(t, e, i) {
                (function(t) {
                    function e(t) {
                        return Object.prototype.toString.call(t);
                    }
                    (i.isArray = function(t) {
                        return Array.isArray ? Array.isArray(t) : "[object Array]" === e(t);
                    }),
                    (i.isBoolean = function(t) {
                        return "boolean" == typeof t;
                    }),
                    (i.isNull = function(t) {
                        return null === t;
                    }),
                    (i.isNullOrUndefined = function(t) {
                        return null == t;
                    }),
                    (i.isNumber = function(t) {
                        return "number" == typeof t;
                    }),
                    (i.isString = function(t) {
                        return "string" == typeof t;
                    }),
                    (i.isSymbol = function(t) {
                        return "symbol" == typeof t;
                    }),
                    (i.isUndefined = function(t) {
                        return void 0 === t;
                    }),
                    (i.isRegExp = function(t) {
                        return "[object RegExp]" === e(t);
                    }),
                    (i.isObject = function(t) {
                        return "object" == typeof t && null !== t;
                    }),
                    (i.isDate = function(t) {
                        return "[object Date]" === e(t);
                    }),
                    (i.isError = function(t) {
                        return "[object Error]" === e(t) || t instanceof Error;
                    }),
                    (i.isFunction = function(t) {
                        return "function" == typeof t;
                    }),
                    (i.isPrimitive = function(t) {
                        return (
                            null === t ||
                            "boolean" == typeof t ||
                            "number" == typeof t ||
                            "string" == typeof t ||
                            "symbol" == typeof t ||
                            void 0 === t
                        );
                    }),
                    (i.isBuffer = t.isBuffer);
                }.call(this, {
                    isBuffer: t("../../is-buffer/index.js")
                }));
            },
            {
                "../../is-buffer/index.js": 11
            }
        ],
        5: [
            function(t, e, i) {
                (i.UINT32 = t("./lib/uint32")), (i.UINT64 = t("./lib/uint64"));
            },
            {
                "./lib/uint32": 6,
                "./lib/uint64": 7
            }
        ],
        6: [
            function(t, e, i) {
                !(function(t) {
                    i(Math.pow(36, 5)),
                        i(Math.pow(16, 7)),
                        i(Math.pow(10, 9)),
                        i(Math.pow(2, 30)),
                        i(36),
                        i(16),
                        i(10),
                        i(2);

                    function i(t, e) {
                        return this instanceof i ?
                            ((this._low = 0),
                                (this._high = 0),
                                (this.remainder = null),
                                void 0 === e ?
                                o.call(this, t) :
                                "string" == typeof t ?
                                a.call(this, t, e) :
                                void s.call(this, t, e)) :
                            new i(t, e);
                    }

                    function s(t, e) {
                        return (this._low = 0 | t), (this._high = 0 | e), this;
                    }

                    function o(t) {
                        return (this._low = 65535 & t), (this._high = t >>> 16), this;
                    }

                    function a(t, e) {
                        var i = parseInt(t, e || 10);
                        return (this._low = 65535 & i), (this._high = i >>> 16), this;
                    }
                    (i.prototype.fromBits = s),
                    (i.prototype.fromNumber = o),
                    (i.prototype.fromString = a),
                    (i.prototype.toNumber = function() {
                        return 65536 * this._high + this._low;
                    }),
                    (i.prototype.toString = function(t) {
                        return this.toNumber().toString(t || 10);
                    }),
                    (i.prototype.add = function(t) {
                        var e = this._low + t._low,
                            i = e >>> 16;
                        return (
                            (i += this._high + t._high),
                            (this._low = 65535 & e),
                            (this._high = 65535 & i),
                            this
                        );
                    }),
                    (i.prototype.subtract = function(t) {
                        return this.add(t.clone().negate());
                    }),
                    (i.prototype.multiply = function(t) {
                        var e,
                            i,
                            s = this._high,
                            o = this._low,
                            a = t._high,
                            n = t._low;
                        return (
                            (e = (i = o * n) >>> 16),
                            (e += s * n),
                            (e &= 65535),
                            (e += o * a),
                            (this._low = 65535 & i),
                            (this._high = 65535 & e),
                            this
                        );
                    }),
                    (i.prototype.div = function(t) {
                        if (0 == t._low && 0 == t._high) throw Error("division by zero");
                        if (0 == t._high && 1 == t._low)
                            return (this.remainder = new i(0)), this;
                        if (t.gt(this))
                            return (
                                (this.remainder = this.clone()),
                                (this._low = 0),
                                (this._high = 0),
                                this
                            );
                        if (this.eq(t))
                            return (
                                (this.remainder = new i(0)),
                                (this._low = 1),
                                (this._high = 0),
                                this
                            );
                        for (var e = t.clone(), s = -1; !this.lt(e);)
                            e.shiftLeft(1, !0), s++;
                        for (
                            this.remainder = this.clone(), this._low = 0, this._high = 0; s >= 0; s--
                        )
                            e.shiftRight(1),
                            this.remainder.lt(e) ||
                            (this.remainder.subtract(e),
                                s >= 16 ?
                                (this._high |= 1 << (s - 16)) :
                                (this._low |= 1 << s));
                        return this;
                    }),
                    (i.prototype.negate = function() {
                        var t = 1 + (65535 & ~this._low);
                        return (
                            (this._low = 65535 & t),
                            (this._high = (~this._high + (t >>> 16)) & 65535),
                            this
                        );
                    }),
                    (i.prototype.equals = i.prototype.eq = function(t) {
                        return this._low == t._low && this._high == t._high;
                    }),
                    (i.prototype.greaterThan = i.prototype.gt = function(t) {
                        return (
                            this._high > t._high ||
                            (!(this._high < t._high) && this._low > t._low)
                        );
                    }),
                    (i.prototype.lessThan = i.prototype.lt = function(t) {
                        return (
                            this._high < t._high ||
                            (!(this._high > t._high) && this._low < t._low)
                        );
                    }),
                    (i.prototype.or = function(t) {
                        return (this._low |= t._low), (this._high |= t._high), this;
                    }),
                    (i.prototype.and = function(t) {
                        return (this._low &= t._low), (this._high &= t._high), this;
                    }),
                    (i.prototype.not = function() {
                        return (
                            (this._low = 65535 & ~this._low),
                            (this._high = 65535 & ~this._high),
                            this
                        );
                    }),
                    (i.prototype.xor = function(t) {
                        return (this._low ^= t._low), (this._high ^= t._high), this;
                    }),
                    (i.prototype.shiftRight = i.prototype.shiftr = function(t) {
                        return (
                            t > 16 ?
                            ((this._low = this._high >> (t - 16)), (this._high = 0)) :
                            16 == t ?
                            ((this._low = this._high), (this._high = 0)) :
                            ((this._low =
                                    (this._low >> t) | ((this._high << (16 - t)) & 65535)),
                                (this._high >>= t)),
                            this
                        );
                    }),
                    (i.prototype.shiftLeft = i.prototype.shiftl = function(t, e) {
                        return (
                            t > 16 ?
                            ((this._high = this._low << (t - 16)),
                                (this._low = 0),
                                e || (this._high &= 65535)) :
                            16 == t ?
                            ((this._high = this._low), (this._low = 0)) :
                            ((this._high = (this._high << t) | (this._low >> (16 - t))),
                                (this._low = (this._low << t) & 65535),
                                e || (this._high &= 65535)),
                            this
                        );
                    }),
                    (i.prototype.rotateLeft = i.prototype.rotl = function(t) {
                        var e = (this._high << 16) | this._low;
                        return (
                            (e = (e << t) | (e >>> (32 - t))),
                            (this._low = 65535 & e),
                            (this._high = e >>> 16),
                            this
                        );
                    }),
                    (i.prototype.rotateRight = i.prototype.rotr = function(t) {
                        var e = (this._high << 16) | this._low;
                        return (
                            (e = (e >>> t) | (e << (32 - t))),
                            (this._low = 65535 & e),
                            (this._high = e >>> 16),
                            this
                        );
                    }),
                    (i.prototype.clone = function() {
                        return new i(this._low, this._high);
                    }),
                    "undefined" != typeof define && define.amd ?
                        define([], function() {
                            return i;
                        }) :
                        void 0 !== e && e.exports ?
                        (e.exports = i) :
                        (t.UINT32 = i);
                })(this);
            },
            {}
        ],
        7: [
            function(t, e, i) {
                !(function(t) {
                    var i = {
                            16: o(Math.pow(16, 5)),
                            10: o(Math.pow(10, 5)),
                            2: o(Math.pow(2, 5))
                        },
                        s = {
                            16: o(16),
                            10: o(10),
                            2: o(2)
                        };

                    function o(t, e, i, s) {
                        return this instanceof o ?
                            ((this.remainder = null),
                                "string" == typeof t ?
                                r.call(this, t, e) :
                                void 0 === e ?
                                n.call(this, t) :
                                void a.apply(this, arguments)) :
                            new o(t, e, i, s);
                    }

                    function a(t, e, i, s) {
                        return void 0 === i ?
                            ((this._a00 = 65535 & t),
                                (this._a16 = t >>> 16),
                                (this._a32 = 65535 & e),
                                (this._a48 = e >>> 16),
                                this) :
                            ((this._a00 = 0 | t),
                                (this._a16 = 0 | e),
                                (this._a32 = 0 | i),
                                (this._a48 = 0 | s),
                                this);
                    }

                    function n(t) {
                        return (
                            (this._a00 = 65535 & t),
                            (this._a16 = t >>> 16),
                            (this._a32 = 0),
                            (this._a48 = 0),
                            this
                        );
                    }

                    function r(t, e) {
                        (e = e || 10),
                        (this._a00 = 0),
                        (this._a16 = 0),
                        (this._a32 = 0),
                        (this._a48 = 0);
                        for (
                            var s = i[e] || new o(Math.pow(e, 5)), a = 0, n = t.length; a < n; a += 5
                        ) {
                            var r = Math.min(5, n - a),
                                l = parseInt(t.slice(a, a + r), e);
                            this.multiply(r < 5 ? new o(Math.pow(e, r)) : s).add(new o(l));
                        }
                        return this;
                    }
                    (o.prototype.fromBits = a),
                    (o.prototype.fromNumber = n),
                    (o.prototype.fromString = r),
                    (o.prototype.toNumber = function() {
                        return 65536 * this._a16 + this._a00;
                    }),
                    (o.prototype.toString = function(t) {
                        var e = s[(t = t || 10)] || new o(t);
                        if (!this.gt(e)) return this.toNumber().toString(t);
                        for (
                            var i = this.clone(), a = new Array(64), n = 63; n >= 0 &&
                            (i.div(e),
                                (a[n] = i.remainder.toNumber().toString(t)),
                                i.gt(e)); n--
                        );
                        return (a[n - 1] = i.toNumber().toString(t)), a.join("");
                    }),
                    (o.prototype.add = function(t) {
                        var e = this._a00 + t._a00,
                            i = e >>> 16,
                            s = (i += this._a16 + t._a16) >>> 16,
                            o = (s += this._a32 + t._a32) >>> 16;
                        return (
                            (o += this._a48 + t._a48),
                            (this._a00 = 65535 & e),
                            (this._a16 = 65535 & i),
                            (this._a32 = 65535 & s),
                            (this._a48 = 65535 & o),
                            this
                        );
                    }),
                    (o.prototype.subtract = function(t) {
                        return this.add(t.clone().negate());
                    }),
                    (o.prototype.multiply = function(t) {
                        var e = this._a00,
                            i = this._a16,
                            s = this._a32,
                            o = this._a48,
                            a = t._a00,
                            n = t._a16,
                            r = t._a32,
                            l = e * a,
                            h = l >>> 16,
                            c = (h += e * n) >>> 16;
                        (h &= 65535), (c += (h += i * a) >>> 16);
                        var u = (c += e * r) >>> 16;
                        return (
                            (c &= 65535),
                            (u += (c += i * n) >>> 16),
                            (c &= 65535),
                            (u += (c += s * a) >>> 16),
                            (u += e * t._a48),
                            (u &= 65535),
                            (u += i * r),
                            (u &= 65535),
                            (u += s * n),
                            (u &= 65535),
                            (u += o * a),
                            (this._a00 = 65535 & l),
                            (this._a16 = 65535 & h),
                            (this._a32 = 65535 & c),
                            (this._a48 = 65535 & u),
                            this
                        );
                    }),
                    (o.prototype.div = function(t) {
                        if (0 == t._a16 && 0 == t._a32 && 0 == t._a48) {
                            if (0 == t._a00) throw Error("division by zero");
                            if (1 == t._a00) return (this.remainder = new o(0)), this;
                        }
                        if (t.gt(this))
                            return (
                                (this.remainder = this.clone()),
                                (this._a00 = 0),
                                (this._a16 = 0),
                                (this._a32 = 0),
                                (this._a48 = 0),
                                this
                            );
                        if (this.eq(t))
                            return (
                                (this.remainder = new o(0)),
                                (this._a00 = 1),
                                (this._a16 = 0),
                                (this._a32 = 0),
                                (this._a48 = 0),
                                this
                            );
                        for (var e = t.clone(), i = -1; !this.lt(e);)
                            e.shiftLeft(1, !0), i++;
                        for (
                            this.remainder = this.clone(),
                            this._a00 = 0,
                            this._a16 = 0,
                            this._a32 = 0,
                            this._a48 = 0; i >= 0; i--
                        )
                            e.shiftRight(1),
                            this.remainder.lt(e) ||
                            (this.remainder.subtract(e),
                                i >= 48 ?
                                (this._a48 |= 1 << (i - 48)) :
                                i >= 32 ?
                                (this._a32 |= 1 << (i - 32)) :
                                i >= 16 ?
                                (this._a16 |= 1 << (i - 16)) :
                                (this._a00 |= 1 << i));
                        return this;
                    }),
                    (o.prototype.negate = function() {
                        var t = 1 + (65535 & ~this._a00);
                        return (
                            (this._a00 = 65535 & t),
                            (t = (65535 & ~this._a16) + (t >>> 16)),
                            (this._a16 = 65535 & t),
                            (t = (65535 & ~this._a32) + (t >>> 16)),
                            (this._a32 = 65535 & t),
                            (this._a48 = (~this._a48 + (t >>> 16)) & 65535),
                            this
                        );
                    }),
                    (o.prototype.equals = o.prototype.eq = function(t) {
                        return (
                            this._a48 == t._a48 &&
                            this._a00 == t._a00 &&
                            this._a32 == t._a32 &&
                            this._a16 == t._a16
                        );
                    }),
                    (o.prototype.greaterThan = o.prototype.gt = function(t) {
                        return (
                            this._a48 > t._a48 ||
                            (!(this._a48 < t._a48) &&
                                (this._a32 > t._a32 ||
                                    (!(this._a32 < t._a32) &&
                                        (this._a16 > t._a16 ||
                                            (!(this._a16 < t._a16) && this._a00 > t._a00)))))
                        );
                    }),
                    (o.prototype.lessThan = o.prototype.lt = function(t) {
                        return (
                            this._a48 < t._a48 ||
                            (!(this._a48 > t._a48) &&
                                (this._a32 < t._a32 ||
                                    (!(this._a32 > t._a32) &&
                                        (this._a16 < t._a16 ||
                                            (!(this._a16 > t._a16) && this._a00 < t._a00)))))
                        );
                    }),
                    (o.prototype.or = function(t) {
                        return (
                            (this._a00 |= t._a00),
                            (this._a16 |= t._a16),
                            (this._a32 |= t._a32),
                            (this._a48 |= t._a48),
                            this
                        );
                    }),
                    (o.prototype.and = function(t) {
                        return (
                            (this._a00 &= t._a00),
                            (this._a16 &= t._a16),
                            (this._a32 &= t._a32),
                            (this._a48 &= t._a48),
                            this
                        );
                    }),
                    (o.prototype.xor = function(t) {
                        return (
                            (this._a00 ^= t._a00),
                            (this._a16 ^= t._a16),
                            (this._a32 ^= t._a32),
                            (this._a48 ^= t._a48),
                            this
                        );
                    }),
                    (o.prototype.not = function() {
                        return (
                            (this._a00 = 65535 & ~this._a00),
                            (this._a16 = 65535 & ~this._a16),
                            (this._a32 = 65535 & ~this._a32),
                            (this._a48 = 65535 & ~this._a48),
                            this
                        );
                    }),
                    (o.prototype.shiftRight = o.prototype.shiftr = function(t) {
                        return (
                            (t %= 64) >= 48 ?
                            ((this._a00 = this._a48 >> (t - 48)),
                                (this._a16 = 0),
                                (this._a32 = 0),
                                (this._a48 = 0)) :
                            t >= 32 ?
                            ((t -= 32),
                                (this._a00 =
                                    65535 & ((this._a32 >> t) | (this._a48 << (16 - t)))),
                                (this._a16 = (this._a48 >> t) & 65535),
                                (this._a32 = 0),
                                (this._a48 = 0)) :
                            t >= 16 ?
                            ((t -= 16),
                                (this._a00 =
                                    65535 & ((this._a16 >> t) | (this._a32 << (16 - t)))),
                                (this._a16 =
                                    65535 & ((this._a32 >> t) | (this._a48 << (16 - t)))),
                                (this._a32 = (this._a48 >> t) & 65535),
                                (this._a48 = 0)) :
                            ((this._a00 =
                                    65535 & ((this._a00 >> t) | (this._a16 << (16 - t)))),
                                (this._a16 =
                                    65535 & ((this._a16 >> t) | (this._a32 << (16 - t)))),
                                (this._a32 =
                                    65535 & ((this._a32 >> t) | (this._a48 << (16 - t)))),
                                (this._a48 = (this._a48 >> t) & 65535)),
                            this
                        );
                    }),
                    (o.prototype.shiftLeft = o.prototype.shiftl = function(t, e) {
                        return (
                            (t %= 64) >= 48 ?
                            ((this._a48 = this._a00 << (t - 48)),
                                (this._a32 = 0),
                                (this._a16 = 0),
                                (this._a00 = 0)) :
                            t >= 32 ?
                            ((t -= 32),
                                (this._a48 = (this._a16 << t) | (this._a00 >> (16 - t))),
                                (this._a32 = (this._a00 << t) & 65535),
                                (this._a16 = 0),
                                (this._a00 = 0)) :
                            t >= 16 ?
                            ((t -= 16),
                                (this._a48 = (this._a32 << t) | (this._a16 >> (16 - t))),
                                (this._a32 =
                                    65535 & ((this._a16 << t) | (this._a00 >> (16 - t)))),
                                (this._a16 = (this._a00 << t) & 65535),
                                (this._a00 = 0)) :
                            ((this._a48 = (this._a48 << t) | (this._a32 >> (16 - t))),
                                (this._a32 =
                                    65535 & ((this._a32 << t) | (this._a16 >> (16 - t)))),
                                (this._a16 =
                                    65535 & ((this._a16 << t) | (this._a00 >> (16 - t)))),
                                (this._a00 = (this._a00 << t) & 65535)),
                            e || (this._a48 &= 65535),
                            this
                        );
                    }),
                    (o.prototype.rotateLeft = o.prototype.rotl = function(t) {
                        if (0 == (t %= 64)) return this;
                        if (t >= 32) {
                            var e = this._a00;
                            if (
                                ((this._a00 = this._a32),
                                    (this._a32 = e),
                                    (e = this._a48),
                                    (this._a48 = this._a16),
                                    (this._a16 = e),
                                    32 == t)
                            )
                                return this;
                            t -= 32;
                        }
                        var i = (this._a48 << 16) | this._a32,
                            s = (this._a16 << 16) | this._a00,
                            o = (i << t) | (s >>> (32 - t)),
                            a = (s << t) | (i >>> (32 - t));
                        return (
                            (this._a00 = 65535 & a),
                            (this._a16 = a >>> 16),
                            (this._a32 = 65535 & o),
                            (this._a48 = o >>> 16),
                            this
                        );
                    }),
                    (o.prototype.rotateRight = o.prototype.rotr = function(t) {
                        if (0 == (t %= 64)) return this;
                        if (t >= 32) {
                            var e = this._a00;
                            if (
                                ((this._a00 = this._a32),
                                    (this._a32 = e),
                                    (e = this._a48),
                                    (this._a48 = this._a16),
                                    (this._a16 = e),
                                    32 == t)
                            )
                                return this;
                            t -= 32;
                        }
                        var i = (this._a48 << 16) | this._a32,
                            s = (this._a16 << 16) | this._a00,
                            o = (i >>> t) | (s << (32 - t)),
                            a = (s >>> t) | (i << (32 - t));
                        return (
                            (this._a00 = 65535 & a),
                            (this._a16 = a >>> 16),
                            (this._a32 = 65535 & o),
                            (this._a48 = o >>> 16),
                            this
                        );
                    }),
                    (o.prototype.clone = function() {
                        return new o(this._a00, this._a16, this._a32, this._a48);
                    }),
                    "undefined" != typeof define && define.amd ?
                        define([], function() {
                            return o;
                        }) :
                        void 0 !== e && e.exports ?
                        (e.exports = o) :
                        (t.UINT64 = o);
                })(this);
            },
            {}
        ],
        8: [
            function(t, e, i) {
                function s() {
                    (this._events = this._events || {}),
                    (this._maxListeners = this._maxListeners || void 0);
                }

                function o(t) {
                    return "function" == typeof t;
                }

                function a(t) {
                    return "object" == typeof t && null !== t;
                }

                function n(t) {
                    return void 0 === t;
                }
                (e.exports = s),
                (s.EventEmitter = s),
                (s.prototype._events = void 0),
                (s.prototype._maxListeners = void 0),
                (s.defaultMaxListeners = 10),
                (s.prototype.setMaxListeners = function(t) {
                    if ("number" != typeof t || t < 0 || isNaN(t))
                        throw TypeError("n must be a positive number");
                    return (this._maxListeners = t), this;
                }),
                (s.prototype.emit = function(t) {
                    var e, i, s, r, l, h;
                    if (
                        (this._events || (this._events = {}),
                            "error" === t &&
                            (!this._events.error ||
                                (a(this._events.error) && !this._events.error.length)))
                    ) {
                        if ((e = arguments[1]) instanceof Error) throw e;
                        var c = new Error(
                            'Uncaught, unspecified "error" event. (' + e + ")"
                        );
                        throw ((c.context = e), c);
                    }
                    if (n((i = this._events[t]))) return !1;
                    if (o(i))
                        switch (arguments.length) {
                            case 1:
                                i.call(this);
                                break;
                            case 2:
                                i.call(this, arguments[1]);
                                break;
                            case 3:
                                i.call(this, arguments[1], arguments[2]);
                                break;
                            default:
                                (r = Array.prototype.slice.call(arguments, 1)),
                                i.apply(this, r);
                        }
                    else if (a(i))
                        for (
                            r = Array.prototype.slice.call(arguments, 1),
                            s = (h = i.slice()).length,
                            l = 0; l < s; l++
                        )
                            h[l].apply(this, r);
                    return !0;
                }),
                (s.prototype.addListener = function(t, e) {
                    var i;
                    if (!o(e)) throw TypeError("listener must be a function");
                    return (
                        this._events || (this._events = {}),
                        this._events.newListener &&
                        this.emit("newListener", t, o(e.listener) ? e.listener : e),
                        this._events[t] ?
                        a(this._events[t]) ?
                        this._events[t].push(e) :
                        (this._events[t] = [this._events[t], e]) :
                        (this._events[t] = e),
                        a(this._events[t]) &&
                        !this._events[t].warned &&
                        (i = n(this._maxListeners) ?
                            s.defaultMaxListeners :
                            this._maxListeners) &&
                        i > 0 &&
                        this._events[t].length > i &&
                        ((this._events[t].warned = !0),
                            console.error(
                                "(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",
                                this._events[t].length
                            ),
                            "function" == typeof console.trace && console.trace()),
                        this
                    );
                }),
                (s.prototype.on = s.prototype.addListener),
                (s.prototype.once = function(t, e) {
                    if (!o(e)) throw TypeError("listener must be a function");
                    var i = !1;

                    function s() {
                        this.removeListener(t, s),
                            i || ((i = !0), e.apply(this, arguments));
                    }
                    return (s.listener = e), this.on(t, s), this;
                }),
                (s.prototype.removeListener = function(t, e) {
                    var i, s, n, r;
                    if (!o(e)) throw TypeError("listener must be a function");
                    if (!this._events || !this._events[t]) return this;
                    if (
                        ((n = (i = this._events[t]).length),
                            (s = -1),
                            i === e || (o(i.listener) && i.listener === e))
                    )
                        delete this._events[t],
                        this._events.removeListener &&
                        this.emit("removeListener", t, e);
                    else if (a(i)) {
                        for (r = n; r-- > 0;)
                            if (i[r] === e || (i[r].listener && i[r].listener === e)) {
                                s = r;
                                break;
                            }
                        if (s < 0) return this;
                        1 === i.length ?
                            ((i.length = 0), delete this._events[t]) :
                            i.splice(s, 1),
                            this._events.removeListener &&
                            this.emit("removeListener", t, e);
                    }
                    return this;
                }),
                (s.prototype.removeAllListeners = function(t) {
                    var e, i;
                    if (!this._events) return this;
                    if (!this._events.removeListener)
                        return (
                            0 === arguments.length ?
                            (this._events = {}) :
                            this._events[t] && delete this._events[t],
                            this
                        );
                    if (0 === arguments.length) {
                        for (e in this._events)
                            "removeListener" !== e && this.removeAllListeners(e);
                        return (
                            this.removeAllListeners("removeListener"),
                            (this._events = {}),
                            this
                        );
                    }
                    if (o((i = this._events[t]))) this.removeListener(t, i);
                    else if (i)
                        for (; i.length;) this.removeListener(t, i[i.length - 1]);
                    return delete this._events[t], this;
                }),
                (s.prototype.listeners = function(t) {
                    return this._events && this._events[t] ?
                        o(this._events[t]) ?
                        [this._events[t]] :
                        this._events[t].slice() :
                        [];
                }),
                (s.prototype.listenerCount = function(t) {
                    if (this._events) {
                        var e = this._events[t];
                        if (o(e)) return 1;
                        if (e) return e.length;
                    }
                    return 0;
                }),
                (s.listenerCount = function(t, e) {
                    return t.listenerCount(e);
                });
            },
            {}
        ],
        9: [
            function(t, e, i) {
                (i.read = function(t, e, i, s, o) {
                    var a,
                        n,
                        r = 8 * o - s - 1,
                        l = (1 << r) - 1,
                        h = l >> 1,
                        c = -7,
                        u = i ? o - 1 : 0,
                        d = i ? -1 : 1,
                        p = t[e + u];
                    for (
                        u += d, a = p & ((1 << -c) - 1), p >>= -c, c += r; c > 0; a = 256 * a + t[e + u], u += d, c -= 8
                    );
                    for (
                        n = a & ((1 << -c) - 1), a >>= -c, c += s; c > 0; n = 256 * n + t[e + u], u += d, c -= 8
                    );
                    if (0 === a) a = 1 - h;
                    else {
                        if (a === l) return n ? NaN : (1 / 0) * (p ? -1 : 1);
                        (n += Math.pow(2, s)), (a -= h);
                    }
                    return (p ? -1 : 1) * n * Math.pow(2, a - s);
                }),
                (i.write = function(t, e, i, s, o, a) {
                    var n,
                        r,
                        l,
                        h = 8 * a - o - 1,
                        c = (1 << h) - 1,
                        u = c >> 1,
                        d = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                        p = s ? 0 : a - 1,
                        f = s ? 1 : -1,
                        m = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
                    for (
                        e = Math.abs(e),
                        isNaN(e) || e === 1 / 0 ?
                        ((r = isNaN(e) ? 1 : 0), (n = c)) :
                        ((n = Math.floor(Math.log(e) / Math.LN2)),
                            e * (l = Math.pow(2, -n)) < 1 && (n--, (l *= 2)),
                            (e += n + u >= 1 ? d / l : d * Math.pow(2, 1 - u)) * l >=
                            2 && (n++, (l /= 2)),
                            n + u >= c ?
                            ((r = 0), (n = c)) :
                            n + u >= 1 ?
                            ((r = (e * l - 1) * Math.pow(2, o)), (n += u)) :
                            ((r = e * Math.pow(2, u - 1) * Math.pow(2, o)),
                                (n = 0))); o >= 8; t[i + p] = 255 & r, p += f, r /= 256, o -= 8
                    );
                    for (
                        n = (n << o) | r, h += o; h > 0; t[i + p] = 255 & n, p += f, n /= 256, h -= 8
                    );
                    t[i + p - f] |= 128 * m;
                });
            },
            {}
        ],
        10: [
            function(t, e, i) {
                "function" == typeof Object.create ?
                    (e.exports = function(t, e) {
                        (t.super_ = e),
                        (t.prototype = Object.create(e.prototype, {
                            constructor: {
                                value: t,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0
                            }
                        }));
                    }) :
                    (e.exports = function(t, e) {
                        t.super_ = e;
                        var i = function() {};
                        (i.prototype = e.prototype),
                        (t.prototype = new i()),
                        (t.prototype.constructor = t);
                    });
            },
            {}
        ],
        11: [
            function(t, e, i) {
                function s(t) {
                    return (
                        !!t.constructor &&
                        "function" == typeof t.constructor.isBuffer &&
                        t.constructor.isBuffer(t)
                    );
                }
                e.exports = function(t) {
                    return (
                        null != t &&
                        (s(t) ||
                            ("function" == typeof(e = t).readFloatLE &&
                                "function" == typeof e.slice &&
                                s(e.slice(0, 0))) ||
                            !!t._isBuffer)
                    );
                    var e;
                };
            },
            {}
        ],
        12: [
            function(t, e, i) {
                var s = {}.toString;
                e.exports =
                    Array.isArray ||
                    function(t) {
                        return "[object Array]" == s.call(t);
                    };
            },
            {}
        ],
        13: [
            function(t, e, i) {
                t("cuint").UINT32;
                Math.imul ||
                    (Math.imul = function(t, e) {
                        var i = 65535 & t,
                            s = 65535 & e;
                        return (i * s + (((t >>> 16) * s + i * (e >>> 16)) << 16)) | 0;
                    }),
                    (i.uncompress = function(t, e, i, s) {
                        for (
                            var o = (i = i || 0), a = (s = s || t.length - i), n = 0; o < a;

                        ) {
                            var r = t[o++],
                                l = r >> 4;
                            if (l > 0) {
                                for (var h = l + 240; 255 === h;) l += h = t[o++];
                                for (var c = o + l; o < c;) e[n++] = t[o++];
                                if (o === a) return n;
                            }
                            var u = t[o++] | (t[o++] << 8);
                            if (0 === u || u > n) return -(o - 2);
                            var d = 15 & r;
                            for (h = d + 240; 255 === h;) d += h = t[o++];
                            var p = n - u;
                            for (c = n + d + 4; n < c;) e[n++] = e[p++];
                        }
                        return n;
                    });
                var s = 2113929216,
                    o = 4,
                    a = 8 * o - 16,
                    n = 8 + o,
                    r = 6,
                    l = 4,
                    h = (1 << l) - 1,
                    c = (1 << (8 - l)) - 1,
                    u = 2654435761;

                function d(t, e, d, p, f, m) {
                    var g = f,
                        y = m - f,
                        k = 0;
                    if (t.length >= s) throw new Error("input too large");
                    if (t.length > n) {
                        var C = i.compressBound(t.length);
                        if (y < C) throw Error("output too small: " + y + " < " + C);
                        for (var v = 3 + (1 << r), b = t.length - n; d + o < b;) {
                            var S = (t[d + 1] << 8) | t[d],
                                w = (t[d + 3] << 8) | t[d + 2],
                                M = Math.imul(S | (w << 16), u) >>> a,
                                x = p[M] - 1;
                            if (
                                ((p[M] = d + 1),
                                    x < 0 ||
                                    (d - x) >>> 16 > 0 ||
                                    ((t[x + 3] << 8) | t[x + 2]) != w ||
                                    ((t[x + 1] << 8) | t[x]) != S)
                            )
                                d += v++ >> r;
                            else {
                                v = 3 + (1 << r);
                                var _ = d - k,
                                    T = d - x;
                                x += o;
                                for (var z = (d += o); d < b && t[d] == t[x];) d++, x++;
                                var P = (z = d - z) < h ? z : h;
                                if (_ >= c) {
                                    e[g++] = (c << l) + P;
                                    for (var A = _ - c; A > 254; A -= 255) e[g++] = 255;
                                    e[g++] = A;
                                } else e[g++] = (_ << l) + P;
                                for (var B = 0; B < _; B++) e[g++] = t[k + B];
                                if (((e[g++] = T), (e[g++] = T >> 8), z >= h)) {
                                    for (z -= h; z >= 255;)(z -= 255), (e[g++] = 255);
                                    e[g++] = z;
                                }
                                k = d;
                            }
                        }
                    }
                    if (0 == k) return 0;
                    if ((_ = t.length - k) >= c) {
                        e[g++] = c << l;
                        for (var D = _ - c; D > 254; D -= 255) e[g++] = 255;
                        e[g++] = D;
                    } else e[g++] = _ << l;
                    for (d = k; d < t.length;) e[g++] = t[d++];
                    return g;
                }
                (i.compressBound = function(t) {
                    return t > s ? 0 : (t + t / 255 + 16) | 0;
                }),
                (i.compress = function(t, e, i, s) {
                    for (var o = new Array(65536), a = 0; a < 65536; a++) o[a] = 0;
                    return d(t, e, 0, o, i || 0, s || e.length);
                }),
                (i.compressHC = i.compress),
                (i.compressDependent = d);
            },
            {
                cuint: 5
            }
        ],
        14: [
            function(t, e, i) {
                (function(e) {
                    var s = t("./decoder_stream");
                    i.LZ4_uncompress = function(t, i) {
                        var o = [],
                            a = new s(i);
                        return (
                            a.on("data", function(t) {
                                o.push(t);
                            }),
                            a.end(t),
                            e.concat(o)
                        );
                    };
                }.call(this, t("buffer").Buffer));
            },
            {
                "./decoder_stream": 15,
                buffer: 3
            }
        ],
        15: [
            function(t, e, i) {
                (function(i) {
                    var s = t("stream").Transform,
                        o = t("util").inherits,
                        a = t("./static"),
                        n = a.utils,
                        r = n.bindings,
                        l = t("./binding"),
                        h = a.STATES,
                        c = a.SIZES;

                    function u(t) {
                        if (!(this instanceof u)) return new u(t);
                        s.call(this, t),
                            (this.options = t || {}),
                            (this.binding = this.options.useJS ? l : r),
                            (this.buffer = null),
                            (this.pos = 0),
                            (this.descriptor = null),
                            (this.state = h.MAGIC),
                            (this.notEnoughData = !1),
                            (this.descriptorStart = 0),
                            (this.streamSize = null),
                            (this.dictId = null),
                            (this.currentStreamChecksum = null),
                            (this.dataBlockSize = 0),
                            (this.skippableSize = 0);
                    }
                    o(u, s),
                        (u.prototype._transform = function(t, e, s) {
                            if (this.skippableSize > 0) {
                                if (((this.skippableSize -= t.length), this.skippableSize > 0))
                                    return void s();
                                (t = t.slice(-this.skippableSize)),
                                (this.skippableSize = 0),
                                (this.state = h.MAGIC);
                            }
                            (this.buffer = this.buffer ?
                                i.concat([this.buffer, t], this.buffer.length + t.length) :
                                t),
                            this._main(s);
                        }),
                        (u.prototype.emit_Error = function(t) {
                            this.emit("error", new Error(t + " @" + this.pos));
                        }),
                        (u.prototype.check_Size = function(t) {
                            var e = this.buffer.length - this.pos;
                            return e <= 0 || e < t ?
                                (this.notEnoughData &&
                                    this.emit_Error("Unexpected end of LZ4 stream"),
                                    !0) :
                                ((this.pos += t), !1);
                        }),
                        (u.prototype.read_MagicNumber = function() {
                            var t = this.pos;
                            if (this.check_Size(c.MAGIC)) return !0;
                            var e = n.readInt32LE(this.buffer, t);
                            if ((4294967280 & e) !== a.MAGICNUMBER_SKIPPABLE)
                                return e !== a.MAGICNUMBER ?
                                    ((this.pos = t),
                                        this.emit_Error(
                                            "Invalid magic number: " + e.toString(16).toUpperCase()
                                        ),
                                        !0) :
                                    void(this.state = h.DESCRIPTOR);
                            this.state = h.SKIP_SIZE;
                        }),
                        (u.prototype.read_SkippableSize = function() {
                            var t = this.pos;
                            if (this.check_Size(c.SKIP_SIZE)) return !0;
                            (this.state = h.SKIP_DATA),
                            (this.skippableSize = n.readInt32LE(this.buffer, t));
                        }),
                        (u.prototype.read_Descriptor = function() {
                            var t = this.pos;
                            if (this.check_Size(c.DESCRIPTOR)) return !0;
                            this.descriptorStart = t;
                            var e = this.buffer[t],
                                i = e >> 6;
                            if (i !== a.VERSION)
                                return (
                                    (this.pos = t),
                                    this.emit_Error("Invalid version: " + i + " != " + a.VERSION),
                                    !0
                                );
                            if ((e >> 1) & 1)
                                return (this.pos = t), this.emit_Error("Reserved bit set"), !0;
                            var s = (this.buffer[t + 1] >> 4) & 7,
                                o = a.blockMaxSizes[s];
                            if (null === o)
                                return (
                                    (this.pos = t),
                                    this.emit_Error("Invalid block max size: " + s),
                                    !0
                                );
                            (this.descriptor = {
                                blockIndependence: Boolean((e >> 5) & 1),
                                blockChecksum: Boolean((e >> 4) & 1),
                                blockMaxSize: o,
                                streamSize: Boolean((e >> 3) & 1),
                                streamChecksum: Boolean((e >> 2) & 1),
                                dict: Boolean(1 & e),
                                dictId: 0
                            }),
                            (this.state = h.SIZE);
                        }),
                        (u.prototype.read_Size = function() {
                            if (this.descriptor.streamSize) {
                                var t = this.pos;
                                if (this.check_Size(c.SIZE)) return !0;
                                this.streamSize = this.buffer.slice(t, t + 8);
                            }
                            this.state = h.DICTID;
                        }),
                        (u.prototype.read_DictId = function() {
                            if (this.descriptor.dictId) {
                                var t = this.pos;
                                if (this.check_Size(c.DICTID)) return !0;
                                this.dictId = n.readInt32LE(this.buffer, t);
                            }
                            this.state = h.DESCRIPTOR_CHECKSUM;
                        }),
                        (u.prototype.read_DescriptorChecksum = function() {
                            var t = this.pos;
                            if (this.check_Size(c.DESCRIPTOR_CHECKSUM)) return !0;
                            var e = this.buffer[t];
                            if (
                                n.descriptorChecksum(
                                    this.buffer.slice(this.descriptorStart, t)
                                ) !== e
                            )
                                return (
                                    (this.pos = t),
                                    this.emit_Error("Invalid stream descriptor checksum"),
                                    !0
                                );
                            this.state = h.DATABLOCK_SIZE;
                        }),
                        (u.prototype.read_DataBlockSize = function() {
                            var t = this.pos;
                            if (this.check_Size(c.DATABLOCK_SIZE)) return !0;
                            var e = n.readInt32LE(this.buffer, t);
                            e !== a.EOS ?
                                ((this.dataBlockSize = e), (this.state = h.DATABLOCK_DATA)) :
                                (this.state = h.EOS);
                        }),
                        (u.prototype.read_DataBlockData = function() {
                            var t = this.pos,
                                e = this.dataBlockSize;
                            if ((2147483648 & e && (e &= 2147483647), this.check_Size(e)))
                                return !0;
                            (this.dataBlock = this.buffer.slice(t, t + e)),
                            (this.state = h.DATABLOCK_CHECKSUM);
                        }),
                        (u.prototype.read_DataBlockChecksum = function() {
                            var t = this.pos;
                            if (this.descriptor.blockChecksum) {
                                if (this.check_Size(c.DATABLOCK_CHECKSUM)) return !0;
                                var e = n.readInt32LE(this.buffer, this.pos - 4);
                                if (n.blockChecksum(this.dataBlock) !== e)
                                    return (
                                        (this.pos = t),
                                        this.emit_Error("Invalid block checksum"),
                                        !0
                                    );
                            }
                            this.state = h.DATABLOCK_UNCOMPRESS;
                        }),
                        (u.prototype.uncompress_DataBlock = function() {
                            var t;
                            if (2147483648 & this.dataBlockSize) t = this.dataBlock;
                            else {
                                t = new i(this.descriptor.blockMaxSize);
                                var e = this.binding.uncompress(this.dataBlock, t);
                                if (e < 0)
                                    return this.emit_Error("Invalid data block: " + -e), !0;
                                e < this.descriptor.blockMaxSize && (t = t.slice(0, e));
                            }
                            (this.dataBlock = null),
                            this.push(t),
                                this.descriptor.streamChecksum &&
                                (this.currentStreamChecksum = n.streamChecksum(
                                    t,
                                    this.currentStreamChecksum
                                )),
                                (this.state = h.DATABLOCK_SIZE);
                        }),
                        (u.prototype.read_EOS = function() {
                            if (this.descriptor.streamChecksum) {
                                var t = this.pos;
                                if (this.check_Size(c.EOS)) return !0;
                                var e = n.readInt32LE(this.buffer, t);
                                if (e !== n.streamChecksum(null, this.currentStreamChecksum))
                                    return (
                                        (this.pos = t),
                                        this.emit_Error(
                                            "Invalid stream checksum: " + e.toString(16).toUpperCase()
                                        ),
                                        !0
                                    );
                            }
                            this.state = h.MAGIC;
                        }),
                        (u.prototype._flush = function(t) {
                            (this.notEnoughData = !0), this._main(t);
                        }),
                        (u.prototype._main = function(t) {
                            for (var e, i = this.pos; !e && this.pos < this.buffer.length;)
                                this.state === h.MAGIC && (e = this.read_MagicNumber()),
                                this.state === h.SKIP_SIZE && (e = this.read_SkippableSize()),
                                this.state === h.DESCRIPTOR && (e = this.read_Descriptor()),
                                this.state === h.SIZE && (e = this.read_Size()),
                                this.state === h.DICTID && (e = this.read_DictId()),
                                this.state === h.DESCRIPTOR_CHECKSUM &&
                                (e = this.read_DescriptorChecksum()),
                                this.state === h.DATABLOCK_SIZE &&
                                (e = this.read_DataBlockSize()),
                                this.state === h.DATABLOCK_DATA &&
                                (e = this.read_DataBlockData()),
                                this.state === h.DATABLOCK_CHECKSUM &&
                                (e = this.read_DataBlockChecksum()),
                                this.state === h.DATABLOCK_UNCOMPRESS &&
                                (e = this.uncompress_DataBlock()),
                                this.state === h.EOS && (e = this.read_EOS());
                            this.pos > i &&
                                ((this.buffer = this.buffer.slice(this.pos)), (this.pos = 0)),
                                t();
                        }),
                        (e.exports = u);
                }.call(this, t("buffer").Buffer));
            },
            {
                "./binding": 13,
                "./static": 19,
                buffer: 3,
                stream: 37,
                util: 42
            }
        ],
        16: [
            function(t, e, i) {
                (function(e) {
                    var s = t("./encoder_stream");
                    i.LZ4_compress = function(t, i) {
                        var o = [],
                            a = new s(i);
                        return (
                            a.on("data", function(t) {
                                o.push(t);
                            }),
                            a.end(t),
                            e.concat(o)
                        );
                    };
                }.call(this, t("buffer").Buffer));
            },
            {
                "./encoder_stream": 17,
                buffer: 3
            }
        ],
        17: [
            function(t, e, i) {
                (function(i) {
                    var s = t("stream").Transform,
                        o = t("util").inherits,
                        a = t("./static"),
                        n = a.utils,
                        r = n.bindings,
                        l = t("./binding"),
                        h = a.STATES,
                        c = a.SIZES,
                        u = {
                            blockIndependence: !0,
                            blockChecksum: !1,
                            blockMaxSize: 4 << 20,
                            streamSize: !1,
                            streamChecksum: !0,
                            dict: !1,
                            dictId: 0,
                            highCompression: !1
                        };

                    function d(t) {
                        if (!(this instanceof d)) return new d(t);
                        s.call(this, t);
                        var e = t || u;
                        e !== u &&
                            Object.keys(u).forEach(function(t) {
                                e.hasOwnProperty(t) || (e[t] = u[t]);
                            }),
                            (this.options = e),
                            (this.binding = this.options.useJS ? l : r),
                            (this.compress = e.highCompression ?
                                this.binding.compressHC :
                                this.binding.compress);
                        var i = 0;
                        (i |= a.VERSION << 6),
                        (i |= (1 & e.blockIndependence) << 5),
                        (i |= (1 & e.blockChecksum) << 4),
                        (i |= (1 & e.streamSize) << 3),
                        (i |= (1 & e.streamChecksum) << 2),
                        (i |= 1 & e.dict);
                        var o = a.blockMaxSizes.indexOf(e.blockMaxSize);
                        if (o < 0)
                            throw new Error("Invalid blockMaxSize: " + e.blockMaxSize);
                        (this.descriptor = {
                            flg: i,
                            bd: (7 & o) << 4
                        }),
                        (this.buffer = []),
                        (this.length = 0),
                        (this.first = !0),
                        (this.checksum = null);
                    }
                    o(d, s),
                        (d.prototype.headerSize = function() {
                            var t = this.options.streamSize ? c.DESCRIPTOR : 0,
                                e = this.options.dict ? c.DICTID : 0;
                            return c.MAGIC + 1 + 1 + t + e + 1;
                        }),
                        (d.prototype.header = function() {
                            var t = this.headerSize(),
                                e = new i(t);
                            (this.state = h.MAGIC),
                            e.writeInt32LE(a.MAGICNUMBER, 0, !0),
                                (this.state = h.DESCRIPTOR);
                            var s = e.slice(c.MAGIC, e.length - 1);
                            s.writeUInt8(this.descriptor.flg, 0, !0),
                                s.writeUInt8(this.descriptor.bd, 1, !0);
                            var o = 2;
                            return (
                                (this.state = h.SIZE),
                                this.options.streamSize &&
                                (s.writeInt32LE(0, o, !0),
                                    s.writeInt32LE(this.size, o + 4, !0),
                                    (o += c.SIZE)),
                                (this.state = h.DICTID),
                                this.options.dict &&
                                (s.writeInt32LE(this.dictId, o, !0), (o += c.DICTID)),
                                (this.state = h.DESCRIPTOR_CHECKSUM),
                                e.writeUInt8(n.descriptorChecksum(s), c.MAGIC + o, !1),
                                e
                            );
                        }),
                        (d.prototype.update_Checksum = function(t) {
                            (this.state = h.CHECKSUM_UPDATE),
                            this.options.streamChecksum &&
                                (this.checksum = n.streamChecksum(t, this.checksum));
                        }),
                        (d.prototype.compress_DataBlock = function(t) {
                            this.state = h.DATABLOCK_COMPRESS;
                            var e = this.options.blockChecksum ? c.DATABLOCK_CHECKSUM : 0,
                                s = this.binding.compressBound(t.length),
                                o = new i(c.DATABLOCK_SIZE + s + e),
                                a = o.slice(c.DATABLOCK_SIZE, c.DATABLOCK_SIZE + s),
                                r = this.compress(t, a);
                            ((this.state = h.DATABLOCK_SIZE),
                                r > 0 && r <= this.options.blockMaxSize ?
                                (o.writeUInt32LE(r, 0, !0),
                                    (o = o.slice(0, c.DATABLOCK_SIZE + r + e))) :
                                (o.writeInt32LE(2147483648 | t.length, 0, !0),
                                    (o = o.slice(0, c.DATABLOCK_SIZE + t.length + e)),
                                    t.copy(o, c.DATABLOCK_SIZE)),
                                (this.state = h.DATABLOCK_CHECKSUM),
                                this.options.blockChecksum) &&
                            o.slice(-e).writeInt32LE(n.blockChecksum(a), 0, !0);
                            return this.update_Checksum(t), (this.size += t.length), o;
                        }),
                        (d.prototype._transform = function(t, e, s) {
                            t && (this.buffer.push(t), (this.length += t.length)),
                                this.first && (this.push(this.header()), (this.first = !1));
                            var o = this.options.blockMaxSize;
                            if (this.length < o) return s();
                            for (
                                var a = i.concat(this.buffer, this.length), n = 0, r = a.length; r >= o; r -= o, n += o
                            )
                                this.push(this.compress_DataBlock(a.slice(n, n + o)));
                            r > 0 ?
                                ((this.buffer = [a.slice(n)]),
                                    (this.length = this.buffer[0].length)) :
                                ((this.buffer = []), (this.length = 0)),
                                s();
                        }),
                        (d.prototype._flush = function(t) {
                            if (
                                (this.first && (this.push(this.header()), (this.first = !1)),
                                    this.length > 0)
                            ) {
                                var e = i.concat(this.buffer, this.length);
                                (this.buffer = []), (this.length = 0);
                                var s = this.compress_DataBlock(e);
                                this.push(s);
                            }
                            if (this.options.streamChecksum)
                                (this.state = h.CHECKSUM),
                                (o = new i(c.EOS + c.CHECKSUM)).writeInt32LE(
                                    n.streamChecksum(null, this.checksum),
                                    c.EOS,
                                    !0
                                );
                            else var o = new i(c.EOS);
                            (this.state = h.EOS),
                            o.writeInt32LE(a.EOS, 0, !0),
                                this.push(o),
                                t();
                        }),
                        (e.exports = d);
                }.call(this, t("buffer").Buffer));
            },
            {
                "./binding": 13,
                "./static": 19,
                buffer: 3,
                stream: 37,
                util: 42
            }
        ],
        18: [
            function(t, e, i) {
                (e.exports = t("./static")),
                (e.exports.version = "0.5.1"),
                (e.exports.createDecoderStream = t("./decoder_stream")),
                (e.exports.decode = t("./decoder").LZ4_uncompress),
                (e.exports.createEncoderStream = t("./encoder_stream")),
                (e.exports.encode = t("./encoder").LZ4_compress);
                var s = e.exports.utils.bindings;
                (e.exports.decodeBlock = s.uncompress),
                (e.exports.encodeBound = s.compressBound),
                (e.exports.encodeBlock = s.compress),
                (e.exports.encodeBlockHC = s.compressHC);
            },
            {
                "./decoder": 14,
                "./decoder_stream": 15,
                "./encoder": 16,
                "./encoder_stream": 17,
                "./static": 19
            }
        ],
        19: [
            function(t, e, i) {
                (function(e) {
                    (i.MAGICNUMBER = 407708164),
                    (i.MAGICNUMBER_BUFFER = new e(4)),
                    i.MAGICNUMBER_BUFFER.writeUInt32LE(i.MAGICNUMBER, 0, !1),
                        (i.EOS = 0),
                        (i.EOS_BUFFER = new e(4)),
                        i.EOS_BUFFER.writeUInt32LE(i.EOS, 0, !1),
                        (i.VERSION = 1),
                        (i.MAGICNUMBER_SKIPPABLE = 407710288),
                        (i.blockMaxSizes = [
                            null,
                            null,
                            null,
                            null,
                            65536,
                            262144,
                            1 << 20,
                            4 << 20
                        ]),
                        (i.extension = ".lz4"),
                        (i.STATES = {
                            MAGIC: 0,
                            DESCRIPTOR: 1,
                            SIZE: 2,
                            DICTID: 3,
                            DESCRIPTOR_CHECKSUM: 4,
                            DATABLOCK_SIZE: 5,
                            DATABLOCK_DATA: 6,
                            DATABLOCK_CHECKSUM: 7,
                            DATABLOCK_UNCOMPRESS: 8,
                            DATABLOCK_COMPRESS: 9,
                            CHECKSUM: 10,
                            CHECKSUM_UPDATE: 11,
                            EOS: 90,
                            SKIP_SIZE: 101,
                            SKIP_DATA: 102
                        }),
                        (i.SIZES = {
                            MAGIC: 4,
                            DESCRIPTOR: 2,
                            SIZE: 8,
                            DICTID: 4,
                            DESCRIPTOR_CHECKSUM: 1,
                            DATABLOCK_SIZE: 4,
                            DATABLOCK_CHECKSUM: 4,
                            CHECKSUM: 4,
                            EOS: 4,
                            SKIP_SIZE: 4
                        }),
                        (i.utils = t("./utils"));
                }.call(this, t("buffer").Buffer));
            },
            {
                "./utils": 20,
                buffer: 3
            }
        ],
        20: [
            function(t, e, i) {
                var s = t("xxhashjs");
                (i.descriptorChecksum = function(t) {
                    return (s(t, 0).toNumber() >> 8) & 255;
                }),
                (i.blockChecksum = function(t) {
                    return s(t, 0).toNumber();
                }),
                (i.streamChecksum = function(t, e) {
                    return null === t ?
                        e.digest().toNumber() :
                        (null === e && (e = s(0)), e.update(t));
                }),
                (i.readInt32LE = function(t, e) {
                    return t[e] | (t[e + 1] << 8) | (t[e + 2] << 16) | (t[e + 3] << 24);
                }),
                (i.bindings = t("./binding"));
            },
            {
                "./binding": 13,
                xxhashjs: 46
            }
        ],
        21: [
            function(t, e, i) {
                (function(t) {
                    "use strict";
                    !t.version ||
                        0 === t.version.indexOf("v0.") ||
                        (0 === t.version.indexOf("v1.") && 0 !== t.version.indexOf("v1.8.")) ?
                        (e.exports = function(e, i, s, o) {
                            if ("function" != typeof e)
                                throw new TypeError('"callback" argument must be a function');
                            var a,
                                n,
                                r = arguments.length;
                            switch (r) {
                                case 0:
                                case 1:
                                    return t.nextTick(e);
                                case 2:
                                    return t.nextTick(function() {
                                        e.call(null, i);
                                    });
                                case 3:
                                    return t.nextTick(function() {
                                        e.call(null, i, s);
                                    });
                                case 4:
                                    return t.nextTick(function() {
                                        e.call(null, i, s, o);
                                    });
                                default:
                                    for (a = new Array(r - 1), n = 0; n < a.length;)
                                        a[n++] = arguments[n];
                                    return t.nextTick(function() {
                                        e.apply(null, a);
                                    });
                            }
                        }) :
                        (e.exports = t.nextTick);
                }.call(this, t("_process")));
            },
            {
                _process: 22
            }
        ],
        22: [
            function(t, e, i) {
                var s,
                    o,
                    a = (e.exports = {});

                function n() {
                    throw new Error("setTimeout has not been defined");
                }

                function r() {
                    throw new Error("clearTimeout has not been defined");
                }

                function l(t) {
                    if (s === setTimeout) return setTimeout(t, 0);
                    if ((s === n || !s) && setTimeout)
                        return (s = setTimeout), setTimeout(t, 0);
                    try {
                        return s(t, 0);
                    } catch (e) {
                        try {
                            return s.call(null, t, 0);
                        } catch (e) {
                            return s.call(this, t, 0);
                        }
                    }
                }!(function() {
                    try {
                        s = "function" == typeof setTimeout ? setTimeout : n;
                    } catch (t) {
                        s = n;
                    }
                    try {
                        o = "function" == typeof clearTimeout ? clearTimeout : r;
                    } catch (t) {
                        o = r;
                    }
                })();
                var h,
                    c = [],
                    u = !1,
                    d = -1;

                function p() {
                    u &&
                        h &&
                        ((u = !1),
                            h.length ? (c = h.concat(c)) : (d = -1),
                            c.length && f());
                }

                function f() {
                    if (!u) {
                        var t = l(p);
                        u = !0;
                        for (var e = c.length; e;) {
                            for (h = c, c = []; ++d < e;) h && h[d].run();
                            (d = -1), (e = c.length);
                        }
                        (h = null),
                        (u = !1),
                        (function(t) {
                            if (o === clearTimeout) return clearTimeout(t);
                            if ((o === r || !o) && clearTimeout)
                                return (o = clearTimeout), clearTimeout(t);
                            try {
                                o(t);
                            } catch (e) {
                                try {
                                    return o.call(null, t);
                                } catch (e) {
                                    return o.call(this, t);
                                }
                            }
                        })(t);
                    }
                }

                function m(t, e) {
                    (this.fun = t), (this.array = e);
                }

                function g() {}
                (a.nextTick = function(t) {
                    var e = new Array(arguments.length - 1);
                    if (arguments.length > 1)
                        for (var i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
                    c.push(new m(t, e)), 1 !== c.length || u || l(f);
                }),
                (m.prototype.run = function() {
                    this.fun.apply(null, this.array);
                }),
                (a.title = "browser"),
                (a.browser = !0),
                (a.env = {}),
                (a.argv = []),
                (a.version = ""),
                (a.versions = {}),
                (a.on = g),
                (a.addListener = g),
                (a.once = g),
                (a.off = g),
                (a.removeListener = g),
                (a.removeAllListeners = g),
                (a.emit = g),
                (a.prependListener = g),
                (a.prependOnceListener = g),
                (a.listeners = function(t) {
                    return [];
                }),
                (a.binding = function(t) {
                    throw new Error("process.binding is not supported");
                }),
                (a.cwd = function() {
                    return "/";
                }),
                (a.chdir = function(t) {
                    throw new Error("process.chdir is not supported");
                }),
                (a.umask = function() {
                    return 0;
                });
            },
            {}
        ],
        23: [
            function(t, e, i) {
                e.exports = t("./lib/_stream_duplex.js");
            },
            {
                "./lib/_stream_duplex.js": 24
            }
        ],
        24: [
            function(t, e, i) {
                "use strict";
                var s = t("process-nextick-args"),
                    o =
                    Object.keys ||
                    function(t) {
                        var e = [];
                        for (var i in t) e.push(i);
                        return e;
                    };
                e.exports = u;
                var a = t("core-util-is");
                a.inherits = t("inherits");
                var n = t("./_stream_readable"),
                    r = t("./_stream_writable");
                a.inherits(u, n);
                for (var l = o(r.prototype), h = 0; h < l.length; h++) {
                    var c = l[h];
                    u.prototype[c] || (u.prototype[c] = r.prototype[c]);
                }

                function u(t) {
                    if (!(this instanceof u)) return new u(t);
                    n.call(this, t),
                        r.call(this, t),
                        t && !1 === t.readable && (this.readable = !1),
                        t && !1 === t.writable && (this.writable = !1),
                        (this.allowHalfOpen = !0),
                        t && !1 === t.allowHalfOpen && (this.allowHalfOpen = !1),
                        this.once("end", d);
                }

                function d() {
                    this.allowHalfOpen || this._writableState.ended || s(p, this);
                }

                function p(t) {
                    t.end();
                }
                Object.defineProperty(u.prototype, "destroyed", {
                        get: function() {
                            return (
                                void 0 !== this._readableState &&
                                void 0 !== this._writableState &&
                                (this._readableState.destroyed && this._writableState.destroyed)
                            );
                        },
                        set: function(t) {
                            void 0 !== this._readableState &&
                                void 0 !== this._writableState &&
                                ((this._readableState.destroyed = t),
                                    (this._writableState.destroyed = t));
                        }
                    }),
                    (u.prototype._destroy = function(t, e) {
                        this.push(null), this.end(), s(e, t);
                    });
            },
            {
                "./_stream_readable": 26,
                "./_stream_writable": 28,
                "core-util-is": 4,
                inherits: 10,
                "process-nextick-args": 21
            }
        ],
        25: [
            function(t, e, i) {
                "use strict";
                e.exports = a;
                var s = t("./_stream_transform"),
                    o = t("core-util-is");

                function a(t) {
                    if (!(this instanceof a)) return new a(t);
                    s.call(this, t);
                }
                (o.inherits = t("inherits")),
                o.inherits(a, s),
                    (a.prototype._transform = function(t, e, i) {
                        i(null, t);
                    });
            },
            {
                "./_stream_transform": 27,
                "core-util-is": 4,
                inherits: 10
            }
        ],
        26: [
            function(t, e, i) {
                (function(i, s) {
                    "use strict";
                    var o = t("process-nextick-args");
                    e.exports = C;
                    var a,
                        n = t("isarray");
                    C.ReadableState = k;
                    t("events").EventEmitter;
                    var r = function(t, e) {
                            return t.listeners(e).length;
                        },
                        l = t("./internal/streams/stream"),
                        h = t("safe-buffer").Buffer,
                        c = s.Uint8Array || function() {};
                    var u = t("core-util-is");
                    u.inherits = t("inherits");
                    var d = t("util"),
                        p = void 0;
                    p = d && d.debuglog ? d.debuglog("stream") : function() {};
                    var f,
                        m = t("./internal/streams/BufferList"),
                        g = t("./internal/streams/destroy");
                    u.inherits(C, l);
                    var y = ["error", "close", "destroy", "pause", "resume"];

                    function k(e, i) {
                        (a = a || t("./_stream_duplex")),
                        (e = e || {}),
                        (this.objectMode = !!e.objectMode),
                        i instanceof a &&
                            (this.objectMode = this.objectMode || !!e.readableObjectMode);
                        var s = e.highWaterMark,
                            o = this.objectMode ? 16 : 16384;
                        (this.highWaterMark = s || 0 === s ? s : o),
                        (this.highWaterMark = Math.floor(this.highWaterMark)),
                        (this.buffer = new m()),
                        (this.length = 0),
                        (this.pipes = null),
                        (this.pipesCount = 0),
                        (this.flowing = null),
                        (this.ended = !1),
                        (this.endEmitted = !1),
                        (this.reading = !1),
                        (this.sync = !0),
                        (this.needReadable = !1),
                        (this.emittedReadable = !1),
                        (this.readableListening = !1),
                        (this.resumeScheduled = !1),
                        (this.destroyed = !1),
                        (this.defaultEncoding = e.defaultEncoding || "utf8"),
                        (this.awaitDrain = 0),
                        (this.readingMore = !1),
                        (this.decoder = null),
                        (this.encoding = null),
                        e.encoding &&
                            (f || (f = t("string_decoder/").StringDecoder),
                                (this.decoder = new f(e.encoding)),
                                (this.encoding = e.encoding));
                    }

                    function C(e) {
                        if (((a = a || t("./_stream_duplex")), !(this instanceof C)))
                            return new C(e);
                        (this._readableState = new k(e, this)),
                        (this.readable = !0),
                        e &&
                            ("function" == typeof e.read && (this._read = e.read),
                                "function" == typeof e.destroy && (this._destroy = e.destroy)),
                            l.call(this);
                    }

                    function v(t, e, i, s, o) {
                        var a,
                            n,
                            r,
                            l = t._readableState;
                        null === e ?
                            ((l.reading = !1),
                                (function(t, e) {
                                    if (e.ended) return;
                                    if (e.decoder) {
                                        var i = e.decoder.end();
                                        i &&
                                            i.length &&
                                            (e.buffer.push(i),
                                                (e.length += e.objectMode ? 1 : i.length));
                                    }
                                    (e.ended = !0), M(t);
                                })(t, l)) :
                            (o ||
                                (a = (function(t, e) {
                                    var i;
                                    (s = e),
                                    h.isBuffer(s) ||
                                        s instanceof c ||
                                        "string" == typeof e ||
                                        void 0 === e ||
                                        t.objectMode ||
                                        (i = new TypeError("Invalid non-string/buffer chunk"));
                                    var s;
                                    return i;
                                })(l, e)),
                                a ?
                                t.emit("error", a) :
                                l.objectMode || (e && e.length > 0) ?
                                ("string" == typeof e ||
                                    l.objectMode ||
                                    Object.getPrototypeOf(e) === h.prototype ||
                                    ((n = e), (e = h.from(n))),
                                    s ?
                                    l.endEmitted ?
                                    t.emit(
                                        "error",
                                        new Error("stream.unshift() after end event")
                                    ) :
                                    b(t, l, e, !0) :
                                    l.ended ?
                                    t.emit("error", new Error("stream.push() after EOF")) :
                                    ((l.reading = !1),
                                        l.decoder && !i ?
                                        ((e = l.decoder.write(e)),
                                            l.objectMode || 0 !== e.length ?
                                            b(t, l, e, !1) :
                                            _(t, l)) :
                                        b(t, l, e, !1))) :
                                s || (l.reading = !1));
                        return (
                            !(r = l).ended &&
                            (r.needReadable || r.length < r.highWaterMark || 0 === r.length)
                        );
                    }

                    function b(t, e, i, s) {
                        e.flowing && 0 === e.length && !e.sync ?
                            (t.emit("data", i), t.read(0)) :
                            ((e.length += e.objectMode ? 1 : i.length),
                                s ? e.buffer.unshift(i) : e.buffer.push(i),
                                e.needReadable && M(t)),
                            _(t, e);
                    }
                    Object.defineProperty(C.prototype, "destroyed", {
                            get: function() {
                                return (
                                    void 0 !== this._readableState && this._readableState.destroyed
                                );
                            },
                            set: function(t) {
                                this._readableState && (this._readableState.destroyed = t);
                            }
                        }),
                        (C.prototype.destroy = g.destroy),
                        (C.prototype._undestroy = g.undestroy),
                        (C.prototype._destroy = function(t, e) {
                            this.push(null), e(t);
                        }),
                        (C.prototype.push = function(t, e) {
                            var i,
                                s = this._readableState;
                            return (
                                s.objectMode ?
                                (i = !0) :
                                "string" == typeof t &&
                                ((e = e || s.defaultEncoding) !== s.encoding &&
                                    ((t = h.from(t, e)), (e = "")),
                                    (i = !0)),
                                v(this, t, e, !1, i)
                            );
                        }),
                        (C.prototype.unshift = function(t) {
                            return v(this, t, null, !0, !1);
                        }),
                        (C.prototype.isPaused = function() {
                            return !1 === this._readableState.flowing;
                        }),
                        (C.prototype.setEncoding = function(e) {
                            return (
                                f || (f = t("string_decoder/").StringDecoder),
                                (this._readableState.decoder = new f(e)),
                                (this._readableState.encoding = e),
                                this
                            );
                        });
                    var S = 8388608;

                    function w(t, e) {
                        return t <= 0 || (0 === e.length && e.ended) ?
                            0 :
                            e.objectMode ?
                            1 :
                            t != t ?
                            e.flowing && e.length ?
                            e.buffer.head.data.length :
                            e.length :
                            (t > e.highWaterMark &&
                                (e.highWaterMark = ((i = t) >= S ?
                                    (i = S) :
                                    (i--,
                                        (i |= i >>> 1),
                                        (i |= i >>> 2),
                                        (i |= i >>> 4),
                                        (i |= i >>> 8),
                                        (i |= i >>> 16),
                                        i++),
                                    i)),
                                t <= e.length ?
                                t :
                                e.ended ?
                                e.length :
                                ((e.needReadable = !0), 0));
                        var i;
                    }

                    function M(t) {
                        var e = t._readableState;
                        (e.needReadable = !1),
                        e.emittedReadable ||
                            (p("emitReadable", e.flowing),
                                (e.emittedReadable = !0),
                                e.sync ? o(x, t) : x(t));
                    }

                    function x(t) {
                        p("emit readable"), t.emit("readable"), A(t);
                    }

                    function _(t, e) {
                        e.readingMore || ((e.readingMore = !0), o(T, t, e));
                    }

                    function T(t, e) {
                        for (
                            var i = e.length; !e.reading &&
                            !e.flowing &&
                            !e.ended &&
                            e.length < e.highWaterMark &&
                            (p("maybeReadMore read 0"), t.read(0), i !== e.length);

                        )
                            i = e.length;
                        e.readingMore = !1;
                    }

                    function z(t) {
                        p("readable nexttick read 0"), t.read(0);
                    }

                    function P(t, e) {
                        e.reading || (p("resume read 0"), t.read(0)),
                            (e.resumeScheduled = !1),
                            (e.awaitDrain = 0),
                            t.emit("resume"),
                            A(t),
                            e.flowing && !e.reading && t.read(0);
                    }

                    function A(t) {
                        var e = t._readableState;
                        for (p("flow", e.flowing); e.flowing && null !== t.read(););
                    }

                    function B(t, e) {
                        return 0 === e.length ?
                            null :
                            (e.objectMode ?
                                (i = e.buffer.shift()) :
                                !t || t >= e.length ?
                                ((i = e.decoder ?
                                        e.buffer.join("") :
                                        1 === e.buffer.length ?
                                        e.buffer.head.data :
                                        e.buffer.concat(e.length)),
                                    e.buffer.clear()) :
                                (i = (function(t, e, i) {
                                    var s;
                                    t < e.head.data.length ?
                                        ((s = e.head.data.slice(0, t)),
                                            (e.head.data = e.head.data.slice(t))) :
                                        (s =
                                            t === e.head.data.length ?
                                            e.shift() :
                                            i ?
                                            (function(t, e) {
                                                var i = e.head,
                                                    s = 1,
                                                    o = i.data;
                                                t -= o.length;
                                                for (;
                                                    (i = i.next);) {
                                                    var a = i.data,
                                                        n = t > a.length ? a.length : t;
                                                    if (
                                                        (n === a.length ?
                                                            (o += a) :
                                                            (o += a.slice(0, t)),
                                                            0 === (t -= n))
                                                    ) {
                                                        n === a.length ?
                                                            (++s,
                                                                i.next ?
                                                                (e.head = i.next) :
                                                                (e.head = e.tail = null)) :
                                                            ((e.head = i), (i.data = a.slice(n)));
                                                        break;
                                                    }
                                                    ++s;
                                                }
                                                return (e.length -= s), o;
                                            })(t, e) :
                                            (function(t, e) {
                                                var i = h.allocUnsafe(t),
                                                    s = e.head,
                                                    o = 1;
                                                s.data.copy(i), (t -= s.data.length);
                                                for (;
                                                    (s = s.next);) {
                                                    var a = s.data,
                                                        n = t > a.length ? a.length : t;
                                                    if (
                                                        (a.copy(i, i.length - t, 0, n),
                                                            0 === (t -= n))
                                                    ) {
                                                        n === a.length ?
                                                            (++o,
                                                                s.next ?
                                                                (e.head = s.next) :
                                                                (e.head = e.tail = null)) :
                                                            ((e.head = s), (s.data = a.slice(n)));
                                                        break;
                                                    }
                                                    ++o;
                                                }
                                                return (e.length -= o), i;
                                            })(t, e));
                                    return s;
                                })(t, e.buffer, e.decoder)),
                                i);
                        var i;
                    }

                    function D(t) {
                        var e = t._readableState;
                        if (e.length > 0)
                            throw new Error('"endReadable()" called on non-empty stream');
                        e.endEmitted || ((e.ended = !0), o(I, e, t));
                    }

                    function I(t, e) {
                        t.endEmitted ||
                            0 !== t.length ||
                            ((t.endEmitted = !0), (e.readable = !1), e.emit("end"));
                    }

                    function U(t, e) {
                        for (var i = 0, s = t.length; i < s; i++)
                            if (t[i] === e) return i;
                        return -1;
                    }
                    (C.prototype.read = function(t) {
                        p("read", t), (t = parseInt(t, 10));
                        var e = this._readableState,
                            i = t;
                        if (
                            (0 !== t && (e.emittedReadable = !1),
                                0 === t &&
                                e.needReadable &&
                                (e.length >= e.highWaterMark || e.ended))
                        )
                            return (
                                p("read: emitReadable", e.length, e.ended),
                                0 === e.length && e.ended ? D(this) : M(this),
                                null
                            );
                        if (0 === (t = w(t, e)) && e.ended)
                            return 0 === e.length && D(this), null;
                        var s,
                            o = e.needReadable;
                        return (
                            p("need readable", o),
                            (0 === e.length || e.length - t < e.highWaterMark) &&
                            p("length less than watermark", (o = !0)),
                            e.ended || e.reading ?
                            p("reading or ended", (o = !1)) :
                            o &&
                            (p("do read"),
                                (e.reading = !0),
                                (e.sync = !0),
                                0 === e.length && (e.needReadable = !0),
                                this._read(e.highWaterMark),
                                (e.sync = !1),
                                e.reading || (t = w(i, e))),
                            null === (s = t > 0 ? B(t, e) : null) ?
                            ((e.needReadable = !0), (t = 0)) :
                            (e.length -= t),
                            0 === e.length &&
                            (e.ended || (e.needReadable = !0),
                                i !== t && e.ended && D(this)),
                            null !== s && this.emit("data", s),
                            s
                        );
                    }),
                    (C.prototype._read = function(t) {
                        this.emit("error", new Error("_read() is not implemented"));
                    }),
                    (C.prototype.pipe = function(t, e) {
                        var s = this,
                            a = this._readableState;
                        switch (a.pipesCount) {
                            case 0:
                                a.pipes = t;
                                break;
                            case 1:
                                a.pipes = [a.pipes, t];
                                break;
                            default:
                                a.pipes.push(t);
                        }
                        (a.pipesCount += 1), p("pipe count=%d opts=%j", a.pipesCount, e);
                        var l =
                            (!e || !1 !== e.end) && t !== i.stdout && t !== i.stderr ?
                            c :
                            v;

                        function h(e, i) {
                            p("onunpipe"),
                                e === s &&
                                i &&
                                !1 === i.hasUnpiped &&
                                ((i.hasUnpiped = !0),
                                    p("cleanup"),
                                    t.removeListener("close", k),
                                    t.removeListener("finish", C),
                                    t.removeListener("drain", d),
                                    t.removeListener("error", y),
                                    t.removeListener("unpipe", h),
                                    s.removeListener("end", c),
                                    s.removeListener("end", v),
                                    s.removeListener("data", g),
                                    (f = !0),
                                    !a.awaitDrain ||
                                    (t._writableState && !t._writableState.needDrain) ||
                                    d());
                        }

                        function c() {
                            p("onend"), t.end();
                        }
                        a.endEmitted ? o(l) : s.once("end", l), t.on("unpipe", h);
                        var u,
                            d = ((u = s),
                                function() {
                                    var t = u._readableState;
                                    p("pipeOnDrain", t.awaitDrain),
                                        t.awaitDrain && t.awaitDrain--,
                                        0 === t.awaitDrain &&
                                        r(u, "data") &&
                                        ((t.flowing = !0), A(u));
                                });
                        t.on("drain", d);
                        var f = !1;
                        var m = !1;

                        function g(e) {
                            p("ondata"),
                                (m = !1),
                                !1 !== t.write(e) ||
                                m ||
                                (((1 === a.pipesCount && a.pipes === t) ||
                                        (a.pipesCount > 1 && -1 !== U(a.pipes, t))) &&
                                    !f &&
                                    (p(
                                            "false write response, pause",
                                            s._readableState.awaitDrain
                                        ),
                                        s._readableState.awaitDrain++,
                                        (m = !0)),
                                    s.pause());
                        }

                        function y(e) {
                            p("onerror", e),
                                v(),
                                t.removeListener("error", y),
                                0 === r(t, "error") && t.emit("error", e);
                        }

                        function k() {
                            t.removeListener("finish", C), v();
                        }

                        function C() {
                            p("onfinish"), t.removeListener("close", k), v();
                        }

                        function v() {
                            p("unpipe"), s.unpipe(t);
                        }
                        return (
                            s.on("data", g),
                            (function(t, e, i) {
                                if ("function" == typeof t.prependListener)
                                    return t.prependListener(e, i);
                                t._events && t._events[e] ?
                                    n(t._events[e]) ?
                                    t._events[e].unshift(i) :
                                    (t._events[e] = [i, t._events[e]]) :
                                    t.on(e, i);
                            })(t, "error", y),
                            t.once("close", k),
                            t.once("finish", C),
                            t.emit("pipe", s),
                            a.flowing || (p("pipe resume"), s.resume()),
                            t
                        );
                    }),
                    (C.prototype.unpipe = function(t) {
                        var e = this._readableState,
                            i = {
                                hasUnpiped: !1
                            };
                        if (0 === e.pipesCount) return this;
                        if (1 === e.pipesCount)
                            return t && t !== e.pipes ?
                                this :
                                (t || (t = e.pipes),
                                    (e.pipes = null),
                                    (e.pipesCount = 0),
                                    (e.flowing = !1),
                                    t && t.emit("unpipe", this, i),
                                    this);
                        if (!t) {
                            var s = e.pipes,
                                o = e.pipesCount;
                            (e.pipes = null), (e.pipesCount = 0), (e.flowing = !1);
                            for (var a = 0; a < o; a++) s[a].emit("unpipe", this, i);
                            return this;
                        }
                        var n = U(e.pipes, t);
                        return -1 === n ?
                            this :
                            (e.pipes.splice(n, 1),
                                (e.pipesCount -= 1),
                                1 === e.pipesCount && (e.pipes = e.pipes[0]),
                                t.emit("unpipe", this, i),
                                this);
                    }),
                    (C.prototype.on = function(t, e) {
                        var i = l.prototype.on.call(this, t, e);
                        if ("data" === t)
                            !1 !== this._readableState.flowing && this.resume();
                        else if ("readable" === t) {
                            var s = this._readableState;
                            s.endEmitted ||
                                s.readableListening ||
                                ((s.readableListening = s.needReadable = !0),
                                    (s.emittedReadable = !1),
                                    s.reading ? s.length && M(this) : o(z, this));
                        }
                        return i;
                    }),
                    (C.prototype.addListener = C.prototype.on),
                    (C.prototype.resume = function() {
                        var t,
                            e,
                            i = this._readableState;
                        return (
                            i.flowing ||
                            (p("resume"),
                                (i.flowing = !0),
                                (t = this),
                                (e = i).resumeScheduled ||
                                ((e.resumeScheduled = !0), o(P, t, e))),
                            this
                        );
                    }),
                    (C.prototype.pause = function() {
                        return (
                            p("call pause flowing=%j", this._readableState.flowing),
                            !1 !== this._readableState.flowing &&
                            (p("pause"),
                                (this._readableState.flowing = !1),
                                this.emit("pause")),
                            this
                        );
                    }),
                    (C.prototype.wrap = function(t) {
                        var e = this._readableState,
                            i = !1,
                            s = this;
                        for (var o in (t.on("end", function() {
                                    if ((p("wrapped end"), e.decoder && !e.ended)) {
                                        var t = e.decoder.end();
                                        t && t.length && s.push(t);
                                    }
                                    s.push(null);
                                }),
                                t.on("data", function(o) {
                                    (p("wrapped data"),
                                        e.decoder && (o = e.decoder.write(o)),
                                        e.objectMode && null == o) ||
                                    ((e.objectMode || (o && o.length)) &&
                                        (s.push(o) || ((i = !0), t.pause())));
                                }),
                                t))
                            void 0 === this[o] &&
                            "function" == typeof t[o] &&
                            (this[o] = (function(e) {
                                return function() {
                                    return t[e].apply(t, arguments);
                                };
                            })(o));
                        for (var a = 0; a < y.length; a++)
                            t.on(y[a], s.emit.bind(s, y[a]));
                        return (
                            (s._read = function(e) {
                                p("wrapped _read", e), i && ((i = !1), t.resume());
                            }),
                            s
                        );
                    }),
                    (C._fromList = B);
                }.call(
                    this,
                    t("_process"),
                    "undefined" != typeof global ?
                    global :
                    "undefined" != typeof self ?
                    self :
                    "undefined" != typeof window ?
                    window :
                    {}
                ));
            },
            {
                "./_stream_duplex": 24,
                "./internal/streams/BufferList": 29,
                "./internal/streams/destroy": 30,
                "./internal/streams/stream": 31,
                _process: 22,
                "core-util-is": 4,
                events: 8,
                inherits: 10,
                isarray: 12,
                "process-nextick-args": 21,
                "safe-buffer": 36,
                "string_decoder/": 38,
                util: 2
            }
        ],
        27: [
            function(t, e, i) {
                "use strict";
                e.exports = n;
                var s = t("./_stream_duplex"),
                    o = t("core-util-is");

                function a(t) {
                    (this.afterTransform = function(e, i) {
                        return (function(t, e, i) {
                            var s = t._transformState;
                            s.transforming = !1;
                            var o = s.writecb;
                            if (!o)
                                return t.emit(
                                    "error",
                                    new Error("write callback called multiple times")
                                );
                            (s.writechunk = null), (s.writecb = null), null != i && t.push(i);
                            o(e);
                            var a = t._readableState;
                            (a.reading = !1),
                            (a.needReadable || a.length < a.highWaterMark) &&
                            t._read(a.highWaterMark);
                        })(t, e, i);
                    }),
                    (this.needTransform = !1),
                    (this.transforming = !1),
                    (this.writecb = null),
                    (this.writechunk = null),
                    (this.writeencoding = null);
                }

                function n(t) {
                    if (!(this instanceof n)) return new n(t);
                    s.call(this, t), (this._transformState = new a(this));
                    var e = this;
                    (this._readableState.needReadable = !0),
                    (this._readableState.sync = !1),
                    t &&
                        ("function" == typeof t.transform &&
                            (this._transform = t.transform),
                            "function" == typeof t.flush && (this._flush = t.flush)),
                        this.once("prefinish", function() {
                            "function" == typeof this._flush ?
                                this._flush(function(t, i) {
                                    r(e, t, i);
                                }) :
                                r(e);
                        });
                }

                function r(t, e, i) {
                    if (e) return t.emit("error", e);
                    null != i && t.push(i);
                    var s = t._writableState,
                        o = t._transformState;
                    if (s.length)
                        throw new Error("Calling transform done when ws.length != 0");
                    if (o.transforming)
                        throw new Error("Calling transform done when still transforming");
                    return t.push(null);
                }
                (o.inherits = t("inherits")),
                o.inherits(n, s),
                    (n.prototype.push = function(t, e) {
                        return (
                            (this._transformState.needTransform = !1),
                            s.prototype.push.call(this, t, e)
                        );
                    }),
                    (n.prototype._transform = function(t, e, i) {
                        throw new Error("_transform() is not implemented");
                    }),
                    (n.prototype._write = function(t, e, i) {
                        var s = this._transformState;
                        if (
                            ((s.writecb = i),
                                (s.writechunk = t),
                                (s.writeencoding = e),
                                !s.transforming)
                        ) {
                            var o = this._readableState;
                            (s.needTransform ||
                                o.needReadable ||
                                o.length < o.highWaterMark) &&
                            this._read(o.highWaterMark);
                        }
                    }),
                    (n.prototype._read = function(t) {
                        var e = this._transformState;
                        null !== e.writechunk && e.writecb && !e.transforming ?
                            ((e.transforming = !0),
                                this._transform(
                                    e.writechunk,
                                    e.writeencoding,
                                    e.afterTransform
                                )) :
                            (e.needTransform = !0);
                    }),
                    (n.prototype._destroy = function(t, e) {
                        var i = this;
                        s.prototype._destroy.call(this, t, function(t) {
                            e(t), i.emit("close");
                        });
                    });
            },
            {
                "./_stream_duplex": 24,
                "core-util-is": 4,
                inherits: 10
            }
        ],
        28: [
            function(t, e, i) {
                (function(i, s) {
                    "use strict";
                    var o = t("process-nextick-args");

                    function a(t) {
                        var e = this;
                        (this.next = null),
                        (this.entry = null),
                        (this.finish = function() {
                            !(function(t, e, i) {
                                var s = t.entry;
                                t.entry = null;
                                for (; s;) {
                                    var o = s.callback;
                                    e.pendingcb--, o(i), (s = s.next);
                                }
                                e.corkedRequestsFree ?
                                    (e.corkedRequestsFree.next = t) :
                                    (e.corkedRequestsFree = t);
                            })(e, t);
                        });
                    }
                    e.exports = y;
                    var n,
                        r = !i.browser && ["v0.10", "v0.9."].indexOf(i.version.slice(0, 5)) > -1 ?
                        setImmediate :
                        o;
                    y.WritableState = g;
                    var l = t("core-util-is");
                    l.inherits = t("inherits");
                    var h = {
                            deprecate: t("util-deprecate")
                        },
                        c = t("./internal/streams/stream"),
                        u = t("safe-buffer").Buffer,
                        d = s.Uint8Array || function() {};
                    var p,
                        f = t("./internal/streams/destroy");

                    function m() {}

                    function g(e, i) {
                        (n = n || t("./_stream_duplex")),
                        (e = e || {}),
                        (this.objectMode = !!e.objectMode),
                        i instanceof n &&
                            (this.objectMode = this.objectMode || !!e.writableObjectMode);
                        var s = e.highWaterMark,
                            l = this.objectMode ? 16 : 16384;
                        (this.highWaterMark = s || 0 === s ? s : l),
                        (this.highWaterMark = Math.floor(this.highWaterMark)),
                        (this.finalCalled = !1),
                        (this.needDrain = !1),
                        (this.ending = !1),
                        (this.ended = !1),
                        (this.finished = !1),
                        (this.destroyed = !1);
                        var h = !1 === e.decodeStrings;
                        (this.decodeStrings = !h),
                        (this.defaultEncoding = e.defaultEncoding || "utf8"),
                        (this.length = 0),
                        (this.writing = !1),
                        (this.corked = 0),
                        (this.sync = !0),
                        (this.bufferProcessing = !1),
                        (this.onwrite = function(t) {
                            !(function(t, e) {
                                var i = t._writableState,
                                    s = i.sync,
                                    a = i.writecb;
                                if (
                                    ((p = i),
                                        (p.writing = !1),
                                        (p.writecb = null),
                                        (p.length -= p.writelen),
                                        (p.writelen = 0),
                                        e)
                                )
                                    (l = t),
                                    (h = i),
                                    (c = s),
                                    (u = e),
                                    (d = a),
                                    --h.pendingcb,
                                    c ?
                                    (o(d, u),
                                        o(w, l, h),
                                        (l._writableState.errorEmitted = !0),
                                        l.emit("error", u)) :
                                    (d(u),
                                        (l._writableState.errorEmitted = !0),
                                        l.emit("error", u),
                                        w(l, h));
                                else {
                                    var n = b(i);
                                    n ||
                                        i.corked ||
                                        i.bufferProcessing ||
                                        !i.bufferedRequest ||
                                        v(t, i),
                                        s ? r(C, t, i, n, a) : C(t, i, n, a);
                                }
                                var l, h, c, u, d;
                                var p;
                            })(i, t);
                        }),
                        (this.writecb = null),
                        (this.writelen = 0),
                        (this.bufferedRequest = null),
                        (this.lastBufferedRequest = null),
                        (this.pendingcb = 0),
                        (this.prefinished = !1),
                        (this.errorEmitted = !1),
                        (this.bufferedRequestCount = 0),
                        (this.corkedRequestsFree = new a(this));
                    }

                    function y(e) {
                        if (
                            ((n = n || t("./_stream_duplex")),
                                !(p.call(y, this) || this instanceof n))
                        )
                            return new y(e);
                        (this._writableState = new g(e, this)),
                        (this.writable = !0),
                        e &&
                            ("function" == typeof e.write && (this._write = e.write),
                                "function" == typeof e.writev && (this._writev = e.writev),
                                "function" == typeof e.destroy && (this._destroy = e.destroy),
                                "function" == typeof e.final && (this._final = e.final)),
                            c.call(this);
                    }

                    function k(t, e, i, s, o, a, n) {
                        (e.writelen = s),
                        (e.writecb = n),
                        (e.writing = !0),
                        (e.sync = !0),
                        i ? t._writev(o, e.onwrite) : t._write(o, a, e.onwrite),
                            (e.sync = !1);
                    }

                    function C(t, e, i, s) {
                        var o, a;
                        i ||
                            ((o = t),
                                0 === (a = e).length &&
                                a.needDrain &&
                                ((a.needDrain = !1), o.emit("drain"))),
                            e.pendingcb--,
                            s(),
                            w(t, e);
                    }

                    function v(t, e) {
                        e.bufferProcessing = !0;
                        var i = e.bufferedRequest;
                        if (t._writev && i && i.next) {
                            var s = e.bufferedRequestCount,
                                o = new Array(s),
                                n = e.corkedRequestsFree;
                            n.entry = i;
                            for (var r = 0, l = !0; i;)
                                (o[r] = i), i.isBuf || (l = !1), (i = i.next), (r += 1);
                            (o.allBuffers = l),
                            k(t, e, !0, e.length, o, "", n.finish),
                                e.pendingcb++,
                                (e.lastBufferedRequest = null),
                                n.next ?
                                ((e.corkedRequestsFree = n.next), (n.next = null)) :
                                (e.corkedRequestsFree = new a(e));
                        } else {
                            for (; i;) {
                                var h = i.chunk,
                                    c = i.encoding,
                                    u = i.callback;
                                if (
                                    (k(t, e, !1, e.objectMode ? 1 : h.length, h, c, u),
                                        (i = i.next),
                                        e.writing)
                                )
                                    break;
                            }
                            null === i && (e.lastBufferedRequest = null);
                        }
                        (e.bufferedRequestCount = 0),
                        (e.bufferedRequest = i),
                        (e.bufferProcessing = !1);
                    }

                    function b(t) {
                        return (
                            t.ending &&
                            0 === t.length &&
                            null === t.bufferedRequest &&
                            !t.finished &&
                            !t.writing
                        );
                    }

                    function S(t, e) {
                        t._final(function(i) {
                            e.pendingcb--,
                                i && t.emit("error", i),
                                (e.prefinished = !0),
                                t.emit("prefinish"),
                                w(t, e);
                        });
                    }

                    function w(t, e) {
                        var i,
                            s,
                            a = b(e);
                        return (
                            a &&
                            ((i = t),
                                (s = e).prefinished ||
                                s.finalCalled ||
                                ("function" == typeof i._final ?
                                    (s.pendingcb++, (s.finalCalled = !0), o(S, i, s)) :
                                    ((s.prefinished = !0), i.emit("prefinish"))),
                                0 === e.pendingcb && ((e.finished = !0), t.emit("finish"))),
                            a
                        );
                    }
                    l.inherits(y, c),
                        (g.prototype.getBuffer = function() {
                            for (var t = this.bufferedRequest, e = []; t;)
                                e.push(t), (t = t.next);
                            return e;
                        }),
                        (function() {
                            try {
                                Object.defineProperty(g.prototype, "buffer", {
                                    get: h.deprecate(
                                        function() {
                                            return this.getBuffer();
                                        },
                                        "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.",
                                        "DEP0003"
                                    )
                                });
                            } catch (t) {}
                        })(),
                        "function" == typeof Symbol &&
                        Symbol.hasInstance &&
                        "function" == typeof Function.prototype[Symbol.hasInstance] ?
                        ((p = Function.prototype[Symbol.hasInstance]),
                            Object.defineProperty(y, Symbol.hasInstance, {
                                value: function(t) {
                                    return (
                                        !!p.call(this, t) || (t && t._writableState instanceof g)
                                    );
                                }
                            })) :
                        (p = function(t) {
                            return t instanceof this;
                        }),
                        (y.prototype.pipe = function() {
                            this.emit("error", new Error("Cannot pipe, not readable"));
                        }),
                        (y.prototype.write = function(t, e, i) {
                            var s,
                                a,
                                n,
                                r,
                                l,
                                h,
                                c,
                                p,
                                f,
                                g,
                                y,
                                C = this._writableState,
                                v = !1,
                                b = ((s = t),
                                    (u.isBuffer(s) || s instanceof d) && !C.objectMode);
                            return (
                                b && !u.isBuffer(t) && ((a = t), (t = u.from(a))),
                                "function" == typeof e && ((i = e), (e = null)),
                                b ? (e = "buffer") : e || (e = C.defaultEncoding),
                                "function" != typeof i && (i = m),
                                C.ended ?
                                ((f = this),
                                    (g = i),
                                    (y = new Error("write after end")),
                                    f.emit("error", y),
                                    o(g, y)) :
                                (b ||
                                    ((n = this),
                                        (r = C),
                                        (h = i),
                                        (c = !0),
                                        (p = !1),
                                        null === (l = t) ?
                                        (p = new TypeError(
                                            "May not write null values to stream"
                                        )) :
                                        "string" == typeof l ||
                                        void 0 === l ||
                                        r.objectMode ||
                                        (p = new TypeError(
                                            "Invalid non-string/buffer chunk"
                                        )),
                                        p && (n.emit("error", p), o(h, p), (c = !1)),
                                        c)) &&
                                (C.pendingcb++,
                                    (v = (function(t, e, i, s, o, a) {
                                        if (!i) {
                                            var n = (function(t, e, i) {
                                                t.objectMode ||
                                                    !1 === t.decodeStrings ||
                                                    "string" != typeof e ||
                                                    (e = u.from(e, i));
                                                return e;
                                            })(e, s, o);
                                            s !== n && ((i = !0), (o = "buffer"), (s = n));
                                        }
                                        var r = e.objectMode ? 1 : s.length;
                                        e.length += r;
                                        var l = e.length < e.highWaterMark;
                                        l || (e.needDrain = !0);
                                        if (e.writing || e.corked) {
                                            var h = e.lastBufferedRequest;
                                            (e.lastBufferedRequest = {
                                                chunk: s,
                                                encoding: o,
                                                isBuf: i,
                                                callback: a,
                                                next: null
                                            }),
                                            h
                                                ?
                                                (h.next = e.lastBufferedRequest) :
                                                (e.bufferedRequest = e.lastBufferedRequest),
                                                (e.bufferedRequestCount += 1);
                                        } else k(t, e, !1, r, s, o, a);
                                        return l;
                                    })(this, C, b, t, e, i))),
                                v
                            );
                        }),
                        (y.prototype.cork = function() {
                            this._writableState.corked++;
                        }),
                        (y.prototype.uncork = function() {
                            var t = this._writableState;
                            t.corked &&
                                (t.corked--,
                                    t.writing ||
                                    t.corked ||
                                    t.finished ||
                                    t.bufferProcessing ||
                                    !t.bufferedRequest ||
                                    v(this, t));
                        }),
                        (y.prototype.setDefaultEncoding = function(t) {
                            if (
                                ("string" == typeof t && (t = t.toLowerCase()),
                                    !(
                                        [
                                            "hex",
                                            "utf8",
                                            "utf-8",
                                            "ascii",
                                            "binary",
                                            "base64",
                                            "ucs2",
                                            "ucs-2",
                                            "utf16le",
                                            "utf-16le",
                                            "raw"
                                        ].indexOf((t + "").toLowerCase()) > -1
                                    ))
                            )
                                throw new TypeError("Unknown encoding: " + t);
                            return (this._writableState.defaultEncoding = t), this;
                        }),
                        (y.prototype._write = function(t, e, i) {
                            i(new Error("_write() is not implemented"));
                        }),
                        (y.prototype._writev = null),
                        (y.prototype.end = function(t, e, i) {
                            var s = this._writableState;
                            "function" == typeof t
                                ?
                                ((i = t), (t = null), (e = null)) :
                                "function" == typeof e && ((i = e), (e = null)),
                                null != t && this.write(t, e),
                                s.corked && ((s.corked = 1), this.uncork()),
                                s.ending ||
                                s.finished ||
                                (function(t, e, i) {
                                    (e.ending = !0),
                                    w(t, e),
                                        i && (e.finished ? o(i) : t.once("finish", i));
                                    (e.ended = !0), (t.writable = !1);
                                })(this, s, i);
                        }),
                        Object.defineProperty(y.prototype, "destroyed", {
                            get: function() {
                                return (
                                    void 0 !== this._writableState &&
                                    this._writableState.destroyed
                                );
                            },
                            set: function(t) {
                                this._writableState && (this._writableState.destroyed = t);
                            }
                        }),
                        (y.prototype.destroy = f.destroy),
                        (y.prototype._undestroy = f.undestroy),
                        (y.prototype._destroy = function(t, e) {
                            this.end(), e(t);
                        });
                }.call(
                    this,
                    t("_process"),
                    "undefined" != typeof global ?
                    global :
                    "undefined" != typeof self ?
                    self :
                    "undefined" != typeof window ?
                    window :
                    {}
                ));
            },
            {
                "./_stream_duplex": 24,
                "./internal/streams/destroy": 30,
                "./internal/streams/stream": 31,
                _process: 22,
                "core-util-is": 4,
                inherits: 10,
                "process-nextick-args": 21,
                "safe-buffer": 36,
                "util-deprecate": 39
            }
        ],
        29: [
            function(t, e, i) {
                "use strict";
                var s = t("safe-buffer").Buffer;
                e.exports = (function() {
                    function t() {
                        !(function(t, e) {
                            if (!(t instanceof e))
                                throw new TypeError("Cannot call a class as a function");
                        })(this, t),
                        (this.head = null),
                        (this.tail = null),
                        (this.length = 0);
                    }
                    return (
                        (t.prototype.push = function(t) {
                            var e = {
                                data: t,
                                next: null
                            };
                            this.length > 0 ? (this.tail.next = e) : (this.head = e),
                                (this.tail = e),
                                ++this.length;
                        }),
                        (t.prototype.unshift = function(t) {
                            var e = {
                                data: t,
                                next: this.head
                            };
                            0 === this.length && (this.tail = e),
                                (this.head = e),
                                ++this.length;
                        }),
                        (t.prototype.shift = function() {
                            if (0 !== this.length) {
                                var t = this.head.data;
                                return (
                                    1 === this.length ?
                                    (this.head = this.tail = null) :
                                    (this.head = this.head.next),
                                    --this.length,
                                    t
                                );
                            }
                        }),
                        (t.prototype.clear = function() {
                            (this.head = this.tail = null), (this.length = 0);
                        }),
                        (t.prototype.join = function(t) {
                            if (0 === this.length) return "";
                            for (var e = this.head, i = "" + e.data;
                                (e = e.next);)
                                i += t + e.data;
                            return i;
                        }),
                        (t.prototype.concat = function(t) {
                            if (0 === this.length) return s.alloc(0);
                            if (1 === this.length) return this.head.data;
                            for (
                                var e, i, o, a = s.allocUnsafe(t >>> 0), n = this.head, r = 0; n;

                            )
                                (e = n.data),
                                (i = a),
                                (o = r),
                                e.copy(i, o),
                                (r += n.data.length),
                                (n = n.next);
                            return a;
                        }),
                        t
                    );
                })();
            },
            {
                "safe-buffer": 36
            }
        ],
        30: [
            function(t, e, i) {
                "use strict";
                var s = t("process-nextick-args");

                function o(t, e) {
                    t.emit("error", e);
                }
                e.exports = {
                    destroy: function(t, e) {
                        var i = this,
                            a = this._readableState && this._readableState.destroyed,
                            n = this._writableState && this._writableState.destroyed;
                        a || n ?
                            e ?
                            e(t) :
                            !t ||
                            (this._writableState && this._writableState.errorEmitted) ||
                            s(o, this, t) :
                            (this._readableState && (this._readableState.destroyed = !0),
                                this._writableState && (this._writableState.destroyed = !0),
                                this._destroy(t || null, function(t) {
                                    !e && t ?
                                        (s(o, i, t),
                                            i._writableState && (i._writableState.errorEmitted = !0)) :
                                        e && e(t);
                                }));
                    },
                    undestroy: function() {
                        this._readableState &&
                            ((this._readableState.destroyed = !1),
                                (this._readableState.reading = !1),
                                (this._readableState.ended = !1),
                                (this._readableState.endEmitted = !1)),
                            this._writableState &&
                            ((this._writableState.destroyed = !1),
                                (this._writableState.ended = !1),
                                (this._writableState.ending = !1),
                                (this._writableState.finished = !1),
                                (this._writableState.errorEmitted = !1));
                    }
                };
            },
            {
                "process-nextick-args": 21
            }
        ],
        31: [
            function(t, e, i) {
                e.exports = t("events").EventEmitter;
            },
            {
                events: 8
            }
        ],
        32: [
            function(t, e, i) {
                e.exports = t("./readable").PassThrough;
            },
            {
                "./readable": 33
            }
        ],
        33: [
            function(t, e, i) {
                ((i = e.exports = t("./lib/_stream_readable.js")).Stream = i),
                (i.Readable = i),
                (i.Writable = t("./lib/_stream_writable.js")),
                (i.Duplex = t("./lib/_stream_duplex.js")),
                (i.Transform = t("./lib/_stream_transform.js")),
                (i.PassThrough = t("./lib/_stream_passthrough.js"));
            },
            {
                "./lib/_stream_duplex.js": 24,
                "./lib/_stream_passthrough.js": 25,
                "./lib/_stream_readable.js": 26,
                "./lib/_stream_transform.js": 27,
                "./lib/_stream_writable.js": 28
            }
        ],
        34: [
            function(t, e, i) {
                e.exports = t("./readable").Transform;
            },
            {
                "./readable": 33
            }
        ],
        35: [
            function(t, e, i) {
                e.exports = t("./lib/_stream_writable.js");
            },
            {
                "./lib/_stream_writable.js": 28
            }
        ],
        36: [
            function(t, e, i) {
                var s = t("buffer"),
                    o = s.Buffer;

                function a(t, e) {
                    for (var i in t) e[i] = t[i];
                }

                function n(t, e, i) {
                    return o(t, e, i);
                }
                o.from && o.alloc && o.allocUnsafe && o.allocUnsafeSlow ?
                    (e.exports = s) :
                    (a(s, i), (i.Buffer = n)),
                    a(o, n),
                    (n.from = function(t, e, i) {
                        if ("number" == typeof t)
                            throw new TypeError("Argument must not be a number");
                        return o(t, e, i);
                    }),
                    (n.alloc = function(t, e, i) {
                        if ("number" != typeof t)
                            throw new TypeError("Argument must be a number");
                        var s = o(t);
                        return (
                            void 0 !== e ?
                            "string" == typeof i ?
                            s.fill(e, i) :
                            s.fill(e) :
                            s.fill(0),
                            s
                        );
                    }),
                    (n.allocUnsafe = function(t) {
                        if ("number" != typeof t)
                            throw new TypeError("Argument must be a number");
                        return o(t);
                    }),
                    (n.allocUnsafeSlow = function(t) {
                        if ("number" != typeof t)
                            throw new TypeError("Argument must be a number");
                        return s.SlowBuffer(t);
                    });
            },
            {
                buffer: 3
            }
        ],
        37: [
            function(t, e, i) {
                e.exports = o;
                var s = t("events").EventEmitter;

                function o() {
                    s.call(this);
                }
                t("inherits")(o, s),
                    (o.Readable = t("readable-stream/readable.js")),
                    (o.Writable = t("readable-stream/writable.js")),
                    (o.Duplex = t("readable-stream/duplex.js")),
                    (o.Transform = t("readable-stream/transform.js")),
                    (o.PassThrough = t("readable-stream/passthrough.js")),
                    (o.Stream = o),
                    (o.prototype.pipe = function(t, e) {
                        var i = this;

                        function o(e) {
                            t.writable && !1 === t.write(e) && i.pause && i.pause();
                        }

                        function a() {
                            i.readable && i.resume && i.resume();
                        }
                        i.on("data", o),
                            t.on("drain", a),
                            t._isStdio ||
                            (e && !1 === e.end) ||
                            (i.on("end", r), i.on("close", l));
                        var n = !1;

                        function r() {
                            n || ((n = !0), t.end());
                        }

                        function l() {
                            n || ((n = !0), "function" == typeof t.destroy && t.destroy());
                        }

                        function h(t) {
                            if ((c(), 0 === s.listenerCount(this, "error"))) throw t;
                        }

                        function c() {
                            i.removeListener("data", o),
                                t.removeListener("drain", a),
                                i.removeListener("end", r),
                                i.removeListener("close", l),
                                i.removeListener("error", h),
                                t.removeListener("error", h),
                                i.removeListener("end", c),
                                i.removeListener("close", c),
                                t.removeListener("close", c);
                        }
                        return (
                            i.on("error", h),
                            t.on("error", h),
                            i.on("end", c),
                            i.on("close", c),
                            t.on("close", c),
                            t.emit("pipe", i),
                            t
                        );
                    });
            },
            {
                events: 8,
                inherits: 10,
                "readable-stream/duplex.js": 23,
                "readable-stream/passthrough.js": 32,
                "readable-stream/readable.js": 33,
                "readable-stream/transform.js": 34,
                "readable-stream/writable.js": 35
            }
        ],
        38: [
            function(t, e, i) {
                "use strict";
                var s = t("safe-buffer").Buffer,
                    o =
                    s.isEncoding ||
                    function(t) {
                        switch ((t = "" + t) && t.toLowerCase()) {
                            case "hex":
                            case "utf8":
                            case "utf-8":
                            case "ascii":
                            case "binary":
                            case "base64":
                            case "ucs2":
                            case "ucs-2":
                            case "utf16le":
                            case "utf-16le":
                            case "raw":
                                return !0;
                            default:
                                return !1;
                        }
                    };

                function a(t) {
                    var e;
                    switch (
                        ((this.encoding = (function(t) {
                                var e = (function(t) {
                                    if (!t) return "utf8";
                                    for (var e;;)
                                        switch (t) {
                                            case "utf8":
                                            case "utf-8":
                                                return "utf8";
                                            case "ucs2":
                                            case "ucs-2":
                                            case "utf16le":
                                            case "utf-16le":
                                                return "utf16le";
                                            case "latin1":
                                            case "binary":
                                                return "latin1";
                                            case "base64":
                                            case "ascii":
                                            case "hex":
                                                return t;
                                            default:
                                                if (e) return;
                                                (t = ("" + t).toLowerCase()), (e = !0);
                                        }
                                })(t);
                                if ("string" != typeof e && (s.isEncoding === o || !o(t)))
                                    throw new Error("Unknown encoding: " + t);
                                return e || t;
                            })(t)),
                            this.encoding)
                    ) {
                        case "utf16le":
                            (this.text = l), (this.end = h), (e = 4);
                            break;
                        case "utf8":
                            (this.fillLast = r), (e = 4);
                            break;
                        case "base64":
                            (this.text = c), (this.end = u), (e = 3);
                            break;
                        default:
                            return (this.write = d), void(this.end = p);
                    }
                    (this.lastNeed = 0),
                    (this.lastTotal = 0),
                    (this.lastChar = s.allocUnsafe(e));
                }

                function n(t) {
                    return t <= 127 ?
                        0 :
                        t >> 5 == 6 ?
                        2 :
                        t >> 4 == 14 ?
                        3 :
                        t >> 3 == 30 ?
                        4 :
                        -1;
                }

                function r(t) {
                    var e = this.lastTotal - this.lastNeed,
                        i = (function(t, e, i) {
                            if (128 != (192 & e[0])) return (t.lastNeed = 0), "�".repeat(i);
                            if (t.lastNeed > 1 && e.length > 1) {
                                if (128 != (192 & e[1]))
                                    return (t.lastNeed = 1), "�".repeat(i + 1);
                                if (t.lastNeed > 2 && e.length > 2 && 128 != (192 & e[2]))
                                    return (t.lastNeed = 2), "�".repeat(i + 2);
                            }
                        })(this, t, e);
                    return void 0 !== i ?
                        i :
                        this.lastNeed <= t.length ?
                        (t.copy(this.lastChar, e, 0, this.lastNeed),
                            this.lastChar.toString(this.encoding, 0, this.lastTotal)) :
                        (t.copy(this.lastChar, e, 0, t.length),
                            void(this.lastNeed -= t.length));
                }

                function l(t, e) {
                    if ((t.length - e) % 2 == 0) {
                        var i = t.toString("utf16le", e);
                        if (i) {
                            var s = i.charCodeAt(i.length - 1);
                            if (s >= 55296 && s <= 56319)
                                return (
                                    (this.lastNeed = 2),
                                    (this.lastTotal = 4),
                                    (this.lastChar[0] = t[t.length - 2]),
                                    (this.lastChar[1] = t[t.length - 1]),
                                    i.slice(0, -1)
                                );
                        }
                        return i;
                    }
                    return (
                        (this.lastNeed = 1),
                        (this.lastTotal = 2),
                        (this.lastChar[0] = t[t.length - 1]),
                        t.toString("utf16le", e, t.length - 1)
                    );
                }

                function h(t) {
                    var e = t && t.length ? this.write(t) : "";
                    if (this.lastNeed) {
                        var i = this.lastTotal - this.lastNeed;
                        return e + this.lastChar.toString("utf16le", 0, i);
                    }
                    return e;
                }

                function c(t, e) {
                    var i = (t.length - e) % 3;
                    return 0 === i ?
                        t.toString("base64", e) :
                        ((this.lastNeed = 3 - i),
                            (this.lastTotal = 3),
                            1 === i ?
                            (this.lastChar[0] = t[t.length - 1]) :
                            ((this.lastChar[0] = t[t.length - 2]),
                                (this.lastChar[1] = t[t.length - 1])),
                            t.toString("base64", e, t.length - i));
                }

                function u(t) {
                    var e = t && t.length ? this.write(t) : "";
                    return this.lastNeed ?
                        e + this.lastChar.toString("base64", 0, 3 - this.lastNeed) :
                        e;
                }

                function d(t) {
                    return t.toString(this.encoding);
                }

                function p(t) {
                    return t && t.length ? this.write(t) : "";
                }
                (i.StringDecoder = a),
                (a.prototype.write = function(t) {
                    if (0 === t.length) return "";
                    var e, i;
                    if (this.lastNeed) {
                        if (void 0 === (e = this.fillLast(t))) return "";
                        (i = this.lastNeed), (this.lastNeed = 0);
                    } else i = 0;
                    return i < t.length ?
                        e ?
                        e + this.text(t, i) :
                        this.text(t, i) :
                        e || "";
                }),
                (a.prototype.end = function(t) {
                    var e = t && t.length ? this.write(t) : "";
                    return this.lastNeed ?
                        e + "�".repeat(this.lastTotal - this.lastNeed) :
                        e;
                }),
                (a.prototype.text = function(t, e) {
                    var i = (function(t, e, i) {
                        var s = e.length - 1;
                        if (s < i) return 0;
                        var o = n(e[s]);
                        if (o >= 0) return o > 0 && (t.lastNeed = o - 1), o;
                        if (--s < i) return 0;
                        if ((o = n(e[s])) >= 0) return o > 0 && (t.lastNeed = o - 2), o;
                        if (--s < i) return 0;
                        if ((o = n(e[s])) >= 0)
                            return o > 0 && (2 === o ? (o = 0) : (t.lastNeed = o - 3)), o;
                        return 0;
                    })(this, t, e);
                    if (!this.lastNeed) return t.toString("utf8", e);
                    this.lastTotal = i;
                    var s = t.length - (i - this.lastNeed);
                    return t.copy(this.lastChar, 0, s), t.toString("utf8", e, s);
                }),
                (a.prototype.fillLast = function(t) {
                    if (this.lastNeed <= t.length)
                        return (
                            t.copy(
                                this.lastChar,
                                this.lastTotal - this.lastNeed,
                                0,
                                this.lastNeed
                            ),
                            this.lastChar.toString(this.encoding, 0, this.lastTotal)
                        );
                    t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length),
                        (this.lastNeed -= t.length);
                });
            },
            {
                "safe-buffer": 36
            }
        ],
        39: [
            function(t, e, i) {
                (function(t) {
                    function i(e) {
                        try {
                            if (!t.localStorage) return !1;
                        } catch (t) {
                            return !1;
                        }
                        var i = t.localStorage[e];
                        return null != i && "true" === String(i).toLowerCase();
                    }
                    e.exports = function(t, e) {
                        if (i("noDeprecation")) return t;
                        var s = !1;
                        return function() {
                            if (!s) {
                                if (i("throwDeprecation")) throw new Error(e);
                                i("traceDeprecation") ? console.trace(e) : console.warn(e),
                                    (s = !0);
                            }
                            return t.apply(this, arguments);
                        };
                    };
                }.call(
                    this,
                    "undefined" != typeof global ?
                    global :
                    "undefined" != typeof self ?
                    self :
                    "undefined" != typeof window ?
                    window :
                    {}
                ));
            },
            {}
        ],
        40: [
            function(t, e, i) {
                arguments[4][10][0].apply(i, arguments);
            },
            {
                dup: 10
            }
        ],
        41: [
            function(t, e, i) {
                e.exports = function(t) {
                    return (
                        t &&
                        "object" == typeof t &&
                        "function" == typeof t.copy &&
                        "function" == typeof t.fill &&
                        "function" == typeof t.readUInt8
                    );
                };
            },
            {}
        ],
        42: [
            function(t, e, i) {
                (function(e, s) {
                    var o = /%[sdj%]/g;
                    (i.format = function(t) {
                        if (!y(t)) {
                            for (var e = [], i = 0; i < arguments.length; i++)
                                e.push(r(arguments[i]));
                            return e.join(" ");
                        }
                        i = 1;
                        for (
                            var s = arguments,
                                a = s.length,
                                n = String(t).replace(o, function(t) {
                                    if ("%%" === t) return "%";
                                    if (i >= a) return t;
                                    switch (t) {
                                        case "%s":
                                            return String(s[i++]);
                                        case "%d":
                                            return Number(s[i++]);
                                        case "%j":
                                            try {
                                                return JSON.stringify(s[i++]);
                                            } catch (t) {
                                                return "[Circular]";
                                            }
                                        default:
                                            return t;
                                    }
                                }),
                                l = s[i]; i < a; l = s[++i]
                        )
                            m(l) || !v(l) ? (n += " " + l) : (n += " " + r(l));
                        return n;
                    }),
                    (i.deprecate = function(t, o) {
                        if (k(s.process))
                            return function() {
                                return i.deprecate(t, o).apply(this, arguments);
                            };
                        if (!0 === e.noDeprecation) return t;
                        var a = !1;
                        return function() {
                            if (!a) {
                                if (e.throwDeprecation) throw new Error(o);
                                e.traceDeprecation ? console.trace(o) : console.error(o),
                                    (a = !0);
                            }
                            return t.apply(this, arguments);
                        };
                    });
                    var a,
                        n = {};

                    function r(t, e) {
                        var s = {
                            seen: [],
                            stylize: h
                        };
                        return (
                            arguments.length >= 3 && (s.depth = arguments[2]),
                            arguments.length >= 4 && (s.colors = arguments[3]),
                            f(e) ? (s.showHidden = e) : e && i._extend(s, e),
                            k(s.showHidden) && (s.showHidden = !1),
                            k(s.depth) && (s.depth = 2),
                            k(s.colors) && (s.colors = !1),
                            k(s.customInspect) && (s.customInspect = !0),
                            s.colors && (s.stylize = l),
                            c(s, t, s.depth)
                        );
                    }

                    function l(t, e) {
                        var i = r.styles[e];
                        return i ?
                            "[" + r.colors[i][0] + "m" + t + "[" + r.colors[i][1] + "m" :
                            t;
                    }

                    function h(t, e) {
                        return t;
                    }

                    function c(t, e, s) {
                        if (
                            t.customInspect &&
                            e &&
                            w(e.inspect) &&
                            e.inspect !== i.inspect &&
                            (!e.constructor || e.constructor.prototype !== e)
                        ) {
                            var o = e.inspect(s, t);
                            return y(o) || (o = c(t, o, s)), o;
                        }
                        var a = (function(t, e) {
                            if (k(e)) return t.stylize("undefined", "undefined");
                            if (y(e)) {
                                var i =
                                    "" +
                                    JSON.stringify(e)
                                    .replace(/^"|"$/g, "")
                                    .replace(/'/g, "'")
                                    .replace(/\\"/g, '"');
                                return t.stylize(i, "string");
                            }
                            if (g(e)) return t.stylize("" + e, "number");
                            if (f(e)) return t.stylize("" + e, "boolean");
                            if (m(e)) return t.stylize("null", "null");
                        })(t, e);
                        if (a) return a;
                        var n,
                            r = Object.keys(e),
                            l = ((n = {}),
                                r.forEach(function(t, e) {
                                    n[t] = !0;
                                }),
                                n);
                        if (
                            (t.showHidden && (r = Object.getOwnPropertyNames(e)),
                                S(e) &&
                                (r.indexOf("message") >= 0 || r.indexOf("description") >= 0))
                        )
                            return u(e);
                        if (0 === r.length) {
                            if (w(e)) {
                                var h = e.name ? ": " + e.name : "";
                                return t.stylize("[Function" + h + "]", "special");
                            }
                            if (C(e))
                                return t.stylize(RegExp.prototype.toString.call(e), "regexp");
                            if (b(e))
                                return t.stylize(Date.prototype.toString.call(e), "date");
                            if (S(e)) return u(e);
                        }
                        var v,
                            M = "",
                            x = !1,
                            _ = ["{", "}"];
                        (p(e) && ((x = !0), (_ = ["[", "]"])), w(e)) &&
                        (M = " [Function" + (e.name ? ": " + e.name : "") + "]");
                        return (
                            C(e) && (M = " " + RegExp.prototype.toString.call(e)),
                            b(e) && (M = " " + Date.prototype.toUTCString.call(e)),
                            S(e) && (M = " " + u(e)),
                            0 !== r.length || (x && 0 != e.length) ?
                            s < 0 ?
                            C(e) ?
                            t.stylize(RegExp.prototype.toString.call(e), "regexp") :
                            t.stylize("[Object]", "special") :
                            (t.seen.push(e),
                                (v = x ?
                                    (function(t, e, i, s, o) {
                                        for (var a = [], n = 0, r = e.length; n < r; ++n)
                                            T(e, String(n)) ?
                                            a.push(d(t, e, i, s, String(n), !0)) :
                                            a.push("");
                                        return (
                                            o.forEach(function(o) {
                                                o.match(/^\d+$/) || a.push(d(t, e, i, s, o, !0));
                                            }),
                                            a
                                        );
                                    })(t, e, s, l, r) :
                                    r.map(function(i) {
                                        return d(t, e, s, l, i, x);
                                    })),
                                t.seen.pop(),
                                (function(t, e, i) {
                                    if (
                                        t.reduce(function(t, e) {
                                            return (
                                                0,
                                                e.indexOf("") >= 0 && 0,
                                                t + e.replace(/\u001b\[\d\d?m/g, "").length + 1
                                            );
                                        }, 0) > 60
                                    )
                                        return (
                                            i[0] +
                                            ("" === e ? "" : e + "") +
                                            " " +
                                            t.join(",") +
                                            " " +
                                            i[1]
                                        );
                                    return i[0] + e + " " + t.join(", ") + " " + i[1];
                                })(v, M, _)) :
                            _[0] + M + _[1]
                        );
                    }

                    function u(t) {
                        return "[" + Error.prototype.toString.call(t) + "]";
                    }

                    function d(t, e, i, s, o, a) {
                        var n, r, l;
                        if (
                            ((l = Object.getOwnPropertyDescriptor(e, o) || {
                                    value: e[o]
                                }).get ?
                                (r = l.set ?
                                    t.stylize("[Getter/Setter]", "special") :
                                    t.stylize("[Getter]", "special")) :
                                l.set && (r = t.stylize("[Setter]", "special")),
                                T(s, o) || (n = "[" + o + "]"),
                                r ||
                                (t.seen.indexOf(l.value) < 0 ?
                                    (r = m(i) ?
                                        c(t, l.value, null) :
                                        c(t, l.value, i - 1)).indexOf("") > -1 &&
                                    (r = a ?
                                        r
                                        .split("")
                                        .map(function(t) {
                                            return "  " + t;
                                        })
                                        .join("")
                                        .substr(2) :
                                        "" +
                                        r
                                        .split("")
                                        .map(function(t) {
                                            return "   " + t;
                                        })
                                        .join("")) :
                                    (r = t.stylize("[Circular]", "special"))),
                                k(n))
                        ) {
                            if (a && o.match(/^\d+$/)) return r;
                            (n = JSON.stringify("" + o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ?
                                ((n = n.substr(1, n.length - 2)), (n = t.stylize(n, "name"))) :
                                ((n = n
                                        .replace(/'/g, "'")
                                        .replace(/\\"/g, '"')
                                        .replace(/(^"|"$)/g, "")),
                                    (n = t.stylize(n, "string")));
                        }
                        return n + ": " + r;
                    }

                    function p(t) {
                        return Array.isArray(t);
                    }

                    function f(t) {
                        return "boolean" == typeof t;
                    }

                    function m(t) {
                        return null === t;
                    }

                    function g(t) {
                        return "number" == typeof t;
                    }

                    function y(t) {
                        return "string" == typeof t;
                    }

                    function k(t) {
                        return void 0 === t;
                    }

                    function C(t) {
                        return v(t) && "[object RegExp]" === M(t);
                    }

                    function v(t) {
                        return "object" == typeof t && null !== t;
                    }

                    function b(t) {
                        return v(t) && "[object Date]" === M(t);
                    }

                    function S(t) {
                        return v(t) && ("[object Error]" === M(t) || t instanceof Error);
                    }

                    function w(t) {
                        return "function" == typeof t;
                    }

                    function M(t) {
                        return Object.prototype.toString.call(t);
                    }

                    function x(t) {
                        return t < 10 ? "0" + t.toString(10) : t.toString(10);
                    }
                    (i.debuglog = function(t) {
                        if (
                            (k(a) && (a = e.env.NODE_DEBUG || ""),
                                (t = t.toUpperCase()),
                                !n[t])
                        )
                            if (new RegExp("\b" + t + "\b", "i").test(a)) {
                                var s = e.pid;
                                n[t] = function() {
                                    var e = i.format.apply(i, arguments);
                                    console.error("%s %d: %s", t, s, e);
                                };
                            } else n[t] = function() {};
                        return n[t];
                    }),
                    (i.inspect = r),
                    (r.colors = {
                        bold: [1, 22],
                        italic: [3, 23],
                        underline: [4, 24],
                        inverse: [7, 27],
                        white: [37, 39],
                        grey: [90, 39],
                        black: [30, 39],
                        blue: [34, 39],
                        cyan: [36, 39],
                        green: [32, 39],
                        magenta: [35, 39],
                        red: [31, 39],
                        yellow: [33, 39]
                    }),
                    (r.styles = {
                        special: "cyan",
                        number: "yellow",
                        boolean: "yellow",
                        undefined: "grey",
                        null: "bold",
                        string: "green",
                        date: "magenta",
                        regexp: "red"
                    }),
                    (i.isArray = p),
                    (i.isBoolean = f),
                    (i.isNull = m),
                    (i.isNullOrUndefined = function(t) {
                        return null == t;
                    }),
                    (i.isNumber = g),
                    (i.isString = y),
                    (i.isSymbol = function(t) {
                        return "symbol" == typeof t;
                    }),
                    (i.isUndefined = k),
                    (i.isRegExp = C),
                    (i.isObject = v),
                    (i.isDate = b),
                    (i.isError = S),
                    (i.isFunction = w),
                    (i.isPrimitive = function(t) {
                        return (
                            null === t ||
                            "boolean" == typeof t ||
                            "number" == typeof t ||
                            "string" == typeof t ||
                            "symbol" == typeof t ||
                            void 0 === t
                        );
                    }),
                    (i.isBuffer = t("./support/isBuffer"));
                    var _ = [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec"
                    ];

                    function T(t, e) {
                        return Object.prototype.hasOwnProperty.call(t, e);
                    }
                    (i.log = function() {
                        var t, e;
                        console.log(
                            "%s - %s",
                            ((t = new Date()),
                                (e = [x(t.getHours()), x(t.getMinutes()), x(t.getSeconds())].join(
                                    ":"
                                )),
                                [t.getDate(), _[t.getMonth()], e].join(" ")),
                            i.format.apply(i, arguments)
                        );
                    }),
                    (i.inherits = t("inherits")),
                    (i._extend = function(t, e) {
                        if (!e || !v(e)) return t;
                        for (var i = Object.keys(e), s = i.length; s--;)
                            t[i[s]] = e[i[s]];
                        return t;
                    });
                }.call(
                    this,
                    t("_process"),
                    "undefined" != typeof global ?
                    global :
                    "undefined" != typeof self ?
                    self :
                    "undefined" != typeof window ?
                    window :
                    {}
                ));
            },
            {
                "./support/isBuffer": 41,
                _process: 22,
                inherits: 40
            }
        ],
        43: [
            function(t, e, i) {
                arguments[4][5][0].apply(i, arguments);
            },
            {
                "./lib/uint32": 44,
                "./lib/uint64": 45,
                dup: 5
            }
        ],
        44: [
            function(t, e, i) {
                arguments[4][6][0].apply(i, arguments);
            },
            {
                dup: 6
            }
        ],
        45: [
            function(t, e, i) {
                arguments[4][7][0].apply(i, arguments);
            },
            {
                dup: 7
            }
        ],
        46: [
            function(t, e, i) {
                (function(i) {
                    !(function(s) {
                        var o = t("cuint").UINT32;
                        o.prototype.xxh_update = function(t, e) {
                            var i,
                                s,
                                o = n._low,
                                r = n._high;
                            (i = (s = t * o) >>> 16),
                            (i += e * o),
                            (i &= 65535),
                            (i += t * r);
                            var l = this._low + (65535 & s),
                                h = l >>> 16,
                                c = ((h += this._high + (65535 & i)) << 16) | (65535 & l);
                            (h = (c = (c << 13) | (c >>> 19)) >>> 16),
                            (i = (s = (l = 65535 & c) * (o = a._low)) >>> 16),
                            (i += h * o),
                            (i &= 65535),
                            (i += l * (r = a._high)),
                            (this._low = 65535 & s),
                            (this._high = 65535 & i);
                        };
                        var a = o("2654435761"),
                            n = o("2246822519"),
                            r = o("3266489917"),
                            l = o("668265263"),
                            h = o("374761393"),
                            c = a.clone().add(n);

                        function u() {
                            return 2 == arguments.length ?
                                new u(arguments[1]).update(arguments[0]).digest() :
                                this instanceof u ?
                                void d.call(this, arguments[0]) :
                                new u(arguments[0]);
                        }

                        function d(t) {
                            return (
                                (this.seed = t instanceof o ? t.clone() : o(t)),
                                (this.v1 = this.seed.clone().add(c)),
                                (this.v2 = this.seed.clone().add(n)),
                                (this.v3 = this.seed.clone()),
                                (this.v4 = this.seed.clone().subtract(a)),
                                (this.total_len = 0),
                                (this.memsize = 0),
                                (this.memory = null),
                                this
                            );
                        }
                        (u.prototype.init = d),
                        (u.prototype.update = function(t) {
                            var e,
                                s = "string" == typeof t;
                            s &&
                                ((t = (function(t) {
                                        for (var e = [], i = 0, s = t.length; i < s; i++) {
                                            var o = t.charCodeAt(i);
                                            o < 128 ?
                                                e.push(o) :
                                                o < 2048 ?
                                                e.push(192 | (o >> 6), 128 | (63 & o)) :
                                                o < 55296 || o >= 57344 ?
                                                e.push(
                                                    224 | (o >> 12),
                                                    128 | ((o >> 6) & 63),
                                                    128 | (63 & o)
                                                ) :
                                                (i++,
                                                    (o =
                                                        65536 +
                                                        (((1023 & o) << 10) | (1023 & t.charCodeAt(i)))),
                                                    e.push(
                                                        240 | (o >> 18),
                                                        128 | ((o >> 12) & 63),
                                                        128 | ((o >> 6) & 63),
                                                        128 | (63 & o)
                                                    ));
                                        }
                                        return new Uint8Array(e);
                                    })(t)),
                                    (s = !1),
                                    (e = !0)),
                                "undefined" != typeof ArrayBuffer &&
                                t instanceof ArrayBuffer &&
                                ((e = !0), (t = new Uint8Array(t)));
                            var o = 0,
                                a = t.length,
                                n = o + a;
                            if (0 == a) return this;
                            if (
                                ((this.total_len += a),
                                    0 == this.memsize &&
                                    (this.memory = s ? "" : e ? new Uint8Array(16) : new i(16)),
                                    this.memsize + a < 16)
                            )
                                return (
                                    s ?
                                    (this.memory += t) :
                                    e ?
                                    this.memory.set(t.subarray(0, a), this.memsize) :
                                    t.copy(this.memory, this.memsize, 0, a),
                                    (this.memsize += a),
                                    this
                                );
                            if (this.memsize > 0) {
                                s
                                    ?
                                    (this.memory += t.slice(0, 16 - this.memsize)) :
                                    e ?
                                    this.memory.set(
                                        t.subarray(0, 16 - this.memsize),
                                        this.memsize
                                    ) :
                                    t.copy(this.memory, this.memsize, 0, 16 - this.memsize);
                                var r = 0;
                                s
                                    ?
                                    (this.v1.xxh_update(
                                            (this.memory.charCodeAt(r + 1) << 8) |
                                            this.memory.charCodeAt(r),
                                            (this.memory.charCodeAt(r + 3) << 8) |
                                            this.memory.charCodeAt(r + 2)
                                        ),
                                        (r += 4),
                                        this.v2.xxh_update(
                                            (this.memory.charCodeAt(r + 1) << 8) |
                                            this.memory.charCodeAt(r),
                                            (this.memory.charCodeAt(r + 3) << 8) |
                                            this.memory.charCodeAt(r + 2)
                                        ),
                                        (r += 4),
                                        this.v3.xxh_update(
                                            (this.memory.charCodeAt(r + 1) << 8) |
                                            this.memory.charCodeAt(r),
                                            (this.memory.charCodeAt(r + 3) << 8) |
                                            this.memory.charCodeAt(r + 2)
                                        ),
                                        (r += 4),
                                        this.v4.xxh_update(
                                            (this.memory.charCodeAt(r + 1) << 8) |
                                            this.memory.charCodeAt(r),
                                            (this.memory.charCodeAt(r + 3) << 8) |
                                            this.memory.charCodeAt(r + 2)
                                        )) :
                                    (this.v1.xxh_update(
                                            (this.memory[r + 1] << 8) | this.memory[r],
                                            (this.memory[r + 3] << 8) | this.memory[r + 2]
                                        ),
                                        (r += 4),
                                        this.v2.xxh_update(
                                            (this.memory[r + 1] << 8) | this.memory[r],
                                            (this.memory[r + 3] << 8) | this.memory[r + 2]
                                        ),
                                        (r += 4),
                                        this.v3.xxh_update(
                                            (this.memory[r + 1] << 8) | this.memory[r],
                                            (this.memory[r + 3] << 8) | this.memory[r + 2]
                                        ),
                                        (r += 4),
                                        this.v4.xxh_update(
                                            (this.memory[r + 1] << 8) | this.memory[r],
                                            (this.memory[r + 3] << 8) | this.memory[r + 2]
                                        )),
                                    (o += 16 - this.memsize),
                                    (this.memsize = 0),
                                    s && (this.memory = "");
                            }
                            if (o <= n - 16) {
                                var l = n - 16;
                                do {
                                    s
                                        ?
                                        (this.v1.xxh_update(
                                                (t.charCodeAt(o + 1) << 8) | t.charCodeAt(o),
                                                (t.charCodeAt(o + 3) << 8) | t.charCodeAt(o + 2)
                                            ),
                                            (o += 4),
                                            this.v2.xxh_update(
                                                (t.charCodeAt(o + 1) << 8) | t.charCodeAt(o),
                                                (t.charCodeAt(o + 3) << 8) | t.charCodeAt(o + 2)
                                            ),
                                            (o += 4),
                                            this.v3.xxh_update(
                                                (t.charCodeAt(o + 1) << 8) | t.charCodeAt(o),
                                                (t.charCodeAt(o + 3) << 8) | t.charCodeAt(o + 2)
                                            ),
                                            (o += 4),
                                            this.v4.xxh_update(
                                                (t.charCodeAt(o + 1) << 8) | t.charCodeAt(o),
                                                (t.charCodeAt(o + 3) << 8) | t.charCodeAt(o + 2)
                                            )) :
                                        (this.v1.xxh_update(
                                                (t[o + 1] << 8) | t[o],
                                                (t[o + 3] << 8) | t[o + 2]
                                            ),
                                            (o += 4),
                                            this.v2.xxh_update(
                                                (t[o + 1] << 8) | t[o],
                                                (t[o + 3] << 8) | t[o + 2]
                                            ),
                                            (o += 4),
                                            this.v3.xxh_update(
                                                (t[o + 1] << 8) | t[o],
                                                (t[o + 3] << 8) | t[o + 2]
                                            ),
                                            (o += 4),
                                            this.v4.xxh_update(
                                                (t[o + 1] << 8) | t[o],
                                                (t[o + 3] << 8) | t[o + 2]
                                            )),
                                        (o += 4);
                                } while (o <= l);
                            }
                            return (
                                o < n &&
                                (s ?
                                    (this.memory += t.slice(o)) :
                                    e ?
                                    this.memory.set(t.subarray(o, n), this.memsize) :
                                    t.copy(this.memory, this.memsize, o, n),
                                    (this.memsize = n - o)),
                                this
                            );
                        }),
                        (u.prototype.digest = function() {
                            var t,
                                e,
                                i = this.memory,
                                s = "string" == typeof i,
                                c = 0,
                                u = this.memsize,
                                d = new o();
                            for (
                                (t =
                                    this.total_len >= 16 ?
                                    this.v1
                                    .rotl(1)
                                    .add(
                                        this.v2
                                        .rotl(7)
                                        .add(this.v3.rotl(12).add(this.v4.rotl(18)))
                                    ) :
                                    this.seed.add(h)).add(d.fromNumber(this.total_len)); c <= u - 4;

                            )
                                s ?
                                d.fromBits(
                                    (i.charCodeAt(c + 1) << 8) | i.charCodeAt(c),
                                    (i.charCodeAt(c + 3) << 8) | i.charCodeAt(c + 2)
                                ) :
                                d.fromBits(
                                    (i[c + 1] << 8) | i[c],
                                    (i[c + 3] << 8) | i[c + 2]
                                ),
                                t
                                .add(d.multiply(r))
                                .rotl(17)
                                .multiply(l),
                                (c += 4);
                            for (; c < u;)
                                d.fromBits(s ? i.charCodeAt(c++) : i[c++], 0),
                                t
                                .add(d.multiply(h))
                                .rotl(11)
                                .multiply(a);
                            return (
                                (e = t.clone().shiftRight(15)),
                                t.xor(e).multiply(n),
                                (e = t.clone().shiftRight(13)),
                                t.xor(e).multiply(r),
                                (e = t.clone().shiftRight(16)),
                                t.xor(e),
                                this.init(this.seed),
                                t
                            );
                        }),
                        "undefined" != typeof define && define.amd ?
                            define([], function() {
                                return u;
                            }) :
                            void 0 !== e && e.exports ?
                            (e.exports = u) :
                            (s.XXH = u);
                    })(this);
                }.call(this, t("buffer").Buffer));
            },
            {
                buffer: 3,
                cuint: 43
            }
        ],
    47: [function(t, e, i) {
    //here starts ogario
    (function(e, i, s) {
        var o = null,
            a = null,
            n = {
                'pl': {
                    'start': 'Start',
                    'settings': `Ustawienia`,
                    'restoreSettings': `Przywróc ustawienia domyślne`,
                    'animationGroup': 'Animacja',
                    'zoomGroup': 'Zoom',
                    'respGroup': 'Odrodzenie',
                    'namesGroup': `Nazwy`,
                    'massGroup': `Masa`,
                    'skinsGroup': `Skiny`,
                    'foodGroup': `Pokarm`,
                    'transparencyGroup': `Przezroczystość / kolory`,
                    'gridGroup': `Siatka / sektory`,
                    'miniMapGroup': `Minimapa`,
                    'helpersGroup': `Wspomagacze`,
                    'mouseGroup': `Sterowanie myszką`,
                    'hudGroup': `HUD`,
                    'chatGroup': `Czat`,
                    'statsGroup': `Statystyki`,
                    'extrasGroup': `Dodatkowe`,
                    'noSkins': `Wyłącz skiny`,
                    'noNames': 'Wyłącz nazwy',
                    'noColors': 'Wyłącz kolory',
                    'showMass': `Pokaż masę`,
                    'skipStats': 'Pomiń statystyki po śmierci',
                    'showQuest': `Pokaż zadanie (quest)`,
                    'autoZoom': `Auto zoom`,
                    'animation': `Opóźnienie animacji`,
                    'zoomSpeedValue': `Szybkość zoomu`,
                    'quickResp': `Szybkie odrodzenie (klawisz)`,
                    'autoResp': `Auto odrodzenie`,
                    'autoHideCellsInfo': `Autoukrywanie nazw i masy`,
                    'autoHideNames': 'Autoukrywanie nazw',
                    'autoHideMass': `Autoukrywanie masy`,
                    'autoHideFood': `Autoukrywanie pokarmu (masa)`,
                    'autoHideFoodOnZoom': `Autoukrywanie pokarmu (zoom)`,
                    'optimizedNames': `Zoptymalizowane nazwy`,
                    'hideMyName': 'Ukryj własną nazwę',
                    'hideTeammatesNames': 'Ukryj nazwy graczy teamu',
                    'optimizedMass': 'Zoptymalizowana masa (+/-2%)',
                    'shortMass': `Skrócona masa (k)`,
                    'virMassShots': `Licznik strzałów (wirusy)`,
                    'hideMyMass': `Ukryj własną masę`,
                    'hideEnemiesMass': 'Ukryj masę przeciwników',
                    'vanillaSkins': `Podstawowe skiny`,
                    'customSkins': `Własne skiny`,
                    'myTransparentSkin': `Mój przezroczysty skin`,
                    'myCustomColor': 'Mój własny kolor',
                    'transparentCells': `Przezroczyste kulki`,
                    'transparentViruses': `Przezroczyste wirusy`,
                    'transparentSkins': `Przezroczyste skiny`,
                    'showGrid': `Siatka`,
                    'showBgSectors': `Sektory w tle`,
                    'showMapBorders': `Granice mapy`,
                    'showGhostCells': `Duchy kulek`,
                    'showMiniMap': `Pokaż minimapę`,
                    'showMiniMapGrid': `Pokaż siatkę minimapy`,
                    'showMiniMapGuides': `Pokaż prowadnice na minimapie`,
                    'showMiniMapGhostCells': `Pokaż duchy kulek na minimapie`,
                    'oneColoredTeammates': `Jednokolorowi gracze`,
                    'optimizedFood': 'Zoptymalizowany pokarm',
                    'rainbowFood': `Kolorowy pokarm`,
                    'oppColors': `Kolory przeciwników`,
                    'oppRings': 'Ringi przeciwników',
                    'virColors': 'Kolory wirusów',
                    'splitRange': `Zasięg podziału`,
                    'virusesRange': 'Zasięg wirusów',
                    'textStroke': 'Obwódki nazw i masy',
                    'namesStroke': `Obwódki nazw`,
                    'massStroke': `Obwódki masy`,
                    'cursorTracking': `Śledzenie kursora`,
                    'teammatesInd': `Wskaźniki graczy teamu`,
                    'mouseSplit': `LPM - Split myszką`,
                    'mouseFeed': `PPM - Feed myszką`,
                    'mouseInvert': `Odwróć klawisze myszki`,
                    'disableChat': `Wyłącz czat`,
                    'hideChat': `Ukryj czat`,
                    'chatSounds': 'Powiadomienia dźwiękowe',
                    'chatEmoticons': `Emotikony`,
                    'showChatImages': `Pokaż obrazki na czacie`,
                    'showChatVideos': `Pokaż filmiki na czacie`,
                    'showChatBox': `Czatbox zamiast wyskakujących wiadomości`,
                    'messageSound': 'Dźwięk powiadomienia o wiadomości',
                    'commandSound': 'Dźwięk powiadomienia o komendzie',
                    'showTop5': `Pokaż top 5 teamu`,
                    'showTargeting': `Pokaż namierzanie`,
                    'showTime': `Pokaż aktualny czas`,
                    'showLbData': `Pokaż masę w topce`,
                    'normalLb': `Nagłówek \"Topka\"`,
                    'centeredLb': `Wyśrodkowana topka`,
                    'fpsAtTop': 'Statystyki na górze',
                    'showStats': `Pokaż statystyki`,
                    'showStatsMass': `Statystyki: Masa`,
                    'showStatsSTE': `Statystyki: STE`,
                    'showStatsN16': `Statystyki: n/16`,
                    'showStatsFPS': `Statystyki: FPS`,
                    'blockPopups': `Blokuj popupy (reklamy/sklep/zadanie)`,
                    'hotkeys': `Skróty klawiszowe`,
                    'hk-inst-assign': `Aby ustawić skrót klawiszowy kliknij na polu skrótu i naciśnij wybrany klawisz.`,
                    'hk-inst-delete': `Aby usunąć skrót klawiszowy kliknij na polu skrótu i naciśnij klawisz DELETE.`,
                    'hk-inst-keys': `Możliwe kombinacje skrótów klawiszowych z użyciem klawiszy CTRL oraz ALT.`,
                    'hk-feed': 'Feed',
                    'hk-macroFeed': `Szybki feed`,
                    'hk-split': `Podział`,
                    'hk-doubleSplit': 'Podwójny podział',
                    'hk-split16': `Podział na 16`,
                    'hk-pause': `Pauza kulki`,
                    'hk-showTop5': `Pokaż/ukryj top 5 teamu`,
                    'hk-showTime': `Pokaż/ukryj aktualny czas`,
                    'hk-showSplitRange': `Pokaż/ukryj zasięg podziału`,
                    'hk-showSplitInd': `Pokaż/ukryj zasięg podziału z ringami`,
                    'hk-showTeammatesInd': `Pokaż/ukryj wskaźniki graczy teamu`,
                    'hk-showOppColors': `Pokaż/ukryj kolory przeciwników`,
                    'hk-toggleSkins': `Przełącz skiny (własne/standardowe)`,
                    'hk-showSkins': 'Pokaż/ukryj skiny',
                    'hk-transparentSkins': 'Włącz/wyłącz przezroczyste skiny',
                    'hk-showStats': 'Pokaż/ukryj statystyki gry',
                    'hk-toggleCells': `Przełącz kulkę (najmniejsza/największa)`,
                    'hk-showFood': `Pokaż/ukryj pokarm`,
                    'hk-showGrid': `Pokaż/ukryj siatkę`,
                    'hk-showMiniMapGuides': `Pokaż/ukryj prowadnice na minimapie`,
                    'hk-hideChat': `Pokaż/ukryj czat`,
                    'hk-showHUD': `Pokaż/ukryj HUD`,
                    'hk-copyLb': 'Kopiuj topkę',
                    'hk-showLb': `Pokaż/ukryj topkę`,
                    'hk-toggleAutoZoom': `Włącz/wyłącz auto zoom`,
                    'hk-resetZoom': `Reset zoomu`,
                    'hk-zoomLevel': `Zoom - poziom`,
                    'hk-toggleDeath': `Przełącz miejsce śmierci`,
                    'hk-clearChat': `Pokaż historię czatu / Czyść czat`,
                    'hk-showBgSectors': 'Pokaż/ukryj sektory w tle',
                    'hk-hideBots': `Pokaż/ukryj małe boty`,
                    'hk-showNames': `Pokaż/ukryj nazwy`,
                    'hk-hideTeammatesNames': `Pokaż/ukryj nazwy graczy teamu`,
                    'hk-showMass': `Pokaż/ukryj masę`,
                    'hk-showMiniMap': `Pokaż/ukryj minimapę`,
                    'hk-chatMessage': `Napisz wiadomość na czacie`,
                    'hk-quickResp': `Szybkie odrodzenie (respawn)`,
                    'hk-autoResp': `Włącz/wyłacz auto odrodzenie`,
                    'hk-switchServerMode': `Przełącz serwer [publiczny/prywatny]`,
                    'hk-showTargeting': `Pokaż/ukryj panel namierzania`,
                    'hk-setTargeting': `Włącz/wyłącz namierzanie (śledzenie)`,
                    'hk-cancelTargeting': 'Zatrzymaj namierzanie',
                    'hk-changeTarget': `Zmień cel`,
                    'hk-privateMiniMap': `Pokaż cel na minimapie`,
                    'hk-showQuest': `Pokaż/ukryj zadanie`,
                    'commands': 'Komendy',
                    'comm1': `Feeduj!`,
                    'comm2': 'Dziel się!',
                    'comm3': `Pomocy na %currentSector%!`,
                    'comm4': `Wróg na %currentSector%!`,
                    'comm5': `Zabij pomocnika!`,
                    'comm6': 'Strzel z wirusa!',
                    'comm7': `Zjedz wirusa!`,
                    'comm8': `Zjebałem, wybacz.`,
                    'comm9': `Ja pierdolę...`,
                    'comm0': `Kurwa mać!`,
                    'comm10': 'Trick!',
                    'comm11': `Lewo!`,
                    'comm12': `Góra!`,
                    'comm13': `Prawo!`,
                    'comm14': `Dół!`,
                    'saveComm': `Zapisz komendy`,
                    'theme': 'Wygląd',
                    'restoreThemeSettings': `Przywróc ustawienia domyślne wyglądu`,
                    'basicTheming': 'Podstawowy',
                    'themePreset': `Motyw`,
                    'themeType': 'Typ motywu',
                    'darkTheme': `Ciemny motyw`,
                    'lightTheme': `Jasny motyw`,
                    'mainColor': 'Kolor główny',
                    'bgColor': `Tło`,
                    'bordersColor': `Granice mapy`,
                    'gridColor': `Siatka`,
                    'sectorsColor': 'Czcionka sektorów',
                    'namesColor': `Nazwy`,
                    'namesStrokeColor': `Obwódki nazw`,
                    'massColor': `Masa`,
                    'massStrokeColor': `Obwódki masy`,
                    'virusColor': 'Wirusy',
                    'virusStrokeColor': `Obwódki wirusów`,
                    'mVirusColor': 'Mothercell',
                    'mVirusStrokeColor': 'Mothercell stroke',
                    'foodColor': `Pokarm`,
                    'namesFont': `Czcionka nazw`,
                    'massFont': `Czcionka masy`,
                    'sectorsFont': 'Czcionka sektorów',
                    'namesScale': `Skala nazw`,
                    'massScale': `Skala masy`,
                    'virMassScale': `Skala masy wirusów`,
                    'strokeScale': `Skala obwódek tekstu`,
                    'foodSize': `Wielkość pokarmu`,
                    'bordersWidth': `Grubość granic mapy`,
                    'sectorsWidth': `Grubość siatki sektorów`,
                    'sectorsFontSize': 'Rozmiar czcionki sektorów',
                    'cellsAlpha': 'Przezroczystość kulek',
                    'skinsAlpha': `Przezroczystość skinów`,
                    'virusAlpha': `Przezroczystość wirusów`,
                    'textAlpha': `Przezroczystość nazw i masy`,
                    'virusStrokeSize': `Grubość obwódki wirusów`,
                    'teammatesIndColor': 'Wskaźnik gracza',
                    'cursorTrackingColor': `Śledzenie kursora`,
                    'splitRangeColor': 'Zasięg podziału',
                    'safeAreaColor': `Bezpieczna strefa`,
                    'dangerAreaColor': `Strefa zagrożenia`,
                    'ghostCellsColor': `Duchy kulek`,
                    'ghostCellsAlpha': `Przezroczystość duchów kulek`,
                    'menuTheming': 'Menu',
                    'menuPreset': `Motyw menu`,
                    'menuMainColor': `Kolor główny`,
                    'menuBtnTextColor': `Tekst przycisku`,
                    'menuPanelColor': `Panel`,
                    'menuPanelColor2': 'Panel (2)',
                    'menuTextColor': `Tekst panelu`,
                    'menuTextColor2': `Tekst panelu (2)`,
                    'btn1Color': 'Przycisk #1',
                    'btn1Color2': `Przycisk #1 (2)`,
                    'btn2Color': `Przycisk #2`,
                    'btn2Color2': `Przycisk #2 (2)`,
                    'btn3Color': `Przycisk #3`,
                    'btn3Color2': `Przycisk #3 (2)`,
                    'btn4Color': `Przycisk #4`,
                    'btn4Color2': `Przycisk #4 (2)`,
                    'menuBg': `Grafika tła panelu`,
                    'menuOpacity': 'Przezroczystość',
                    'hudTheming': `HUD`,
                    'hudMainColor': `Kolor główny`,
                    'hudColor': `Tło`,
                    'hudTextColor': 'Tekst',
                    'statsHudColor': `Statystyki`,
                    'timeHudColor': `Czas`,
                    'top5MassColor': 'Masa',
                    'lbMeColor': `Topka - ja`,
                    'lbTeammateColor': 'Topka - team',
                    'hudFont': 'Czcionka HUD',
                    'hudScale': 'Skala HUD',
                    'chatTheming': 'Czat',
                    'messageColor': `Tło wiadomości`,
                    'messageTextColor': `Tekst wiadomości`,
                    'messageTimeColor': `Czas wiadomości`,
                    'messageNickColor': `Nick wiadomości`,
                    'commandsColor': 'Tło komendy',
                    'commandsTextColor': `Tekst komendy`,
                    'commandsTimeColor': 'Czas komendy',
                    'commandsNickColor': `Nick komendy`,
                    'chatBoxColor': `Tło czatboxu`,
                    'chatScale': `Skala czatu`,
                    'miniMapTheming': `Minimapa`,
                    'miniMapSectorsColor': `Sektory`,
                    'miniMapSectorColor': `Aktualny sektor`,
                    'miniMapGuidesColor': `Prowadnice`,
                    'miniMapNickColor': `Nick`,
                    'miniMapNickStrokeColor': `Obwódka nicku`,
                    'miniMapMyCellColor': `Moja kulka`,
                    'miniMapMyCellStrokeColor': `Obwódka mojej kulki`,
                    'miniMapTeammatesColor': `Gracze`,
                    'miniMapDeathLocationColor': 'Miejsce śmierci',
                    'miniMapFont': `Czcionka minimapy`,
                    'miniMapNickFont': `Czcionka nicku`,
                    'miniMapWidth': `Szerokość minimapy`,
                    'miniMapSectorsOpacity': `Przezroczystość sektorów`,
                    'miniMapNickSize': `Rozmiar nicku`,
                    'miniMapNickStrokeSize': 'Grubość obwódki nicku',
                    'miniMapMyCellSize': `Wielkość mojej kulki`,
                    'miniMapMyCellStrokeSize': `Grubość obwódki mojej kulki`,
                    'miniMapTeammatesSize': `Wielkość graczy`,
                    'miniMapGhostCellsColor': `Duchy kulek`,
                    'miniMapGhostCellsAlpha': `Przezroczystość duchów kulek`,
                    'imagesTheming': `Grafika / kursory`,
                    'customBackground': 'Grafika tła',
                    'customCursor': 'Grafika kursora',
                    'hideChatMsgA': `Czat został włączony!`,
                    'hideChatMsgB': `Czat został ukryty!`,
                    'showSkinsMsgA': `Skiny zostały włączone!`,
                    'showSkinsMsgB': `Skiny zostały ukryte!`,
                    'hideSmallBotsMsgA': `Małe boty stały się widoczne!`,
                    'hideSmallBotsMsgB': `Małe boty zostały ukryte!`,
                    'autoRespMsgA': `Auto odrodzenie zostało włączone!`,
                    'autoRespMsgB': `Auto odrodzenie zostało wyłączone!`,
                    'autoZoomMsgA': 'Auto zoom został włączony!',
                    'autoZoomMsgB': `Auto zoom został wyłączony!`,
                    'targetNotSet': `Brak celu`,
                    'targetDead': `Nie żyje`,
                    'targetDistance': `Dystans`,
                    'targetMass': `Masa razem`,
                    'totalPartyPlayers': `Aktywnych graczy`,
                    'totalPartyMass': `Łącznie masy`,
                    'exportImport': `Eksport / import ustawień`,
                    'exportSettings': `Eksportuj ustawienia`,
                    'exportInfo': `Aby wyeksportować wybrane ustawienia skopiuj poniższy kod i zapisz go w pliku tekstowym z kodowaniem Unicode.`,
                    'importSettings': 'Importuj ustawienia',
                    'importInfo': `Aby zaimportować wybrane ustawienia wklej poniżej wyeksportowany wcześniej kod i naciśnij przycisk \"Importuj ustawienia\".`,
                    'profile': `Profil`,
                    'profiles': `Profile`,
                    'skins': `Skiny`,
                    'moreSkins': 'Dodaj skiny',
                    'thanks': `Dzięki Awesome!`,
                    'saveSett': `Zapisz ustawienia`,
                    'saved': `Zapisano!`,
                    'resetSett': `Resetuj ustawienia`,
                    'close': `Zamknij`,
                    'enterChatMsg': `Napisz wiadomość`,
                    'activeParties': `Aktywne party`,
                    'noActiveParties': `Brak aktywnych party ;(`,
                    'playlist': `Playlista`,
                    'pause': 'PAUZA!',
                    'visit': `Odwiedź`,
                    'exit': 'Legend mod Express: Czy na pewno chcesz opuścic grę?',
                    'blockWarn': `UWAGA! Popupy zostały zablokowane w ustawieniach.`,
                    'unblockPopups': `Odblokuj tymczasowo`,
                    'mass': `Masa`,
                    'score': 'Top',
                    'leaderboard': `Topka`,
                    'user': `Użytkownik`,
                    'userMuted': `Użytkownik %user% został wyciszony.`,
                    'userUnmuted': `Wyłączono wyciszenie użytkownika %user%.`,
                    'mute': `Wycisz`,
                    'unmute': `Wyłącz wyciszenie`,
                    'mutedUsers': 'Wyciszeni użytkownicy',
                    'activeUsers': 'Aktywni użytkownicy',
                    'showActiveUsers': `Pokaż aktywnych użytkowników`,
                    'none': `Brak`,
                    'sounds': `Dźwięki`,
                    'page_back_button': `Wróć`,
                    'page_create_party': `Stwórz party`,
                    'page_join_party': 'Dołącz',
                    'page_login_and_play': `Zaloguj`,
                    'page_logout': `Wyloguj`,
                    'page_menu_login_facebook': `Zaloguj z Facebook`,
                    'page_menu_login_google': `Zaloguj z Google`,
                    'page_menu_main_free_coins': `Darmowe Monety`,
                    'page_menu_main_gifts': 'Prezenty',
                    'page_menu_main_dailyquests': 'Zadania',
                    'page_party_join_error': 'Nie można dołączyć do tego party. Upewnij się, że token jest prawidłowy lub stwórz nowy.',
                    'page_play': `Graj`,
                    'page_play_as_guest': `Graj jako gość`,
                    'page_shop': `Sklep`,
                    'page_spectate': `Obserwuj`,
                    'page_stats': 'Statystyki'
                },
                'en': {
                    'start': `Home`,
                    'settings': `Settings`,
                    'restoreSettings': 'Restore default settings',
                    'animationGroup': 'Animation',
                    'zoomGroup': `Zoom`,
                    'respGroup': `Respawn`,
                    'namesGroup': `Names`,
                    'massGroup': `Mass`,
                    'skinsGroup': 'Skins',
                    'foodGroup': `Food`,
                    'transparencyGroup': `Transparency / colors`,
                    'gridGroup': 'Grid / sectors',
                    'miniMapGroup': `Minimap`,
                    'helpersGroup': `Helpers`,
                    'mouseGroup': `Mouse control`,
                    'hudGroup': `HUD`,
                    'chatGroup': `Chat`,
                    'statsGroup': `Stats`,
                    'extrasGroup': `Extras`,
                    'noSkins': 'No skins',
                    'noNames': `No names`,
                    'noColors': `No colors`,
                    'showMass': 'Show mass',
                    'skipStats': `Skip stats after death`,
                    'showQuest': `Show quest`,
                    'autoZoom': `Auto zoom`,
                    'animation': 'Animation delay',
                    'zoomSpeedValue': 'Zoom speed',
                    'quickResp': `Quick respawn (hotkey)`,
                    'autoResp': 'Auto respawn',
                    'autoHideCellsInfo': `Auto hide names and mass`,
                    'autoHideNames': `Auto hide names`,
                    'autoHideMass': `Auto hide mass`,
                    'autoHideFood': `Auto hide food (mass)`,
                    'autoHideFoodOnZoom': 'Auto hide food (zoom)',
                    'optimizedNames': `Optimized names`,
                    'hideMyName': `Hide my name`,
                    'hideTeammatesNames': `Hide teammates names`,
                    'optimizedMass': `Optimized mass (+/-2%)`,
                    'shortMass': `Short mass (k)`,
                    'virMassShots': 'Virus shots',
                    'hideMyMass': `Hide my mass`,
                    'hideEnemiesMass': 'Hide enemies mass',
                    'vanillaSkins': `Vanilla skins`,
                    'customSkins': `Custom skins`,
                    'myTransparentSkin': `My transparent skin`,
                    'myCustomColor': `My custom color`,
                    'transparentCells': `Transparent cells`,
                    'transparentViruses': `Transparent viruses`,
                    'transparentSkins': `Transparent skins`,
                    'showGrid': `Show grid`,
                    'showBgSectors': `Show background sectors`,
                    'showMapBorders': `Show map borders`,
                    'showGhostCells': 'Ghost cells',
                    'showMiniMap': `Show minimap`,
                    'showMiniMapGrid': `Show minimap grid`,
                    'showMiniMapGuides': `Show minimap guides`,
                    'showMiniMapGhostCells': `Show ghost cells`,
                    'oneColoredTeammates': 'One-colored teammates',
                    'optimizedFood': `Optimized food`,
                    'rainbowFood': 'Rainbow food',
                    'oppColors': `Opponents colors`,
                    'oppRings': 'Opponents rings',
                    'virColors': `Viruses colors`,
                    'splitRange': 'Split range',
                    'virusesRange': `Viruses range`,
                    'textStroke': `Names and mass stroke`,
                    'namesStroke': `Names stroke`,
                    'massStroke': `Mass stroke`,
                    'cursorTracking': `Cursor tracking`,
                    'teammatesInd': `Teammates indicators`,
                    'mouseSplit': `LMB - Mouse split`,
                    'mouseFeed': `RMB - Mouse feed`,
                    'mouseInvert': `Invert mouse buttons`,
                    'disableChat': 'Disable chat',
                    'hideChat': `Hide chat`,
                    'chatSounds': `Sound notifications`,
                    'chatEmoticons': `Emoticons`,
                    'showChatImages': `Show images on chat`,
                    'showChatVideos': `Show videos on chat`,
                    'showChatBox': `Chatbox instead of popups`,
                    'messageSound': `Message notification sound`,
                    'commandSound': `Command notification sound`,
                    'showTop5': `Show team top 5`,
                    'showTargeting': `Show targeting`,
                    'showTime': `Show current time`,
                    'showLbData': `Show leaderboard mass`,
                    'normalLb': `\"Leaderboard\" header`,
                    'centeredLb': `Centered leaderboard`,
                    'fpsAtTop': `Game stats at the top`,
                    'showStats': `Show game stats`,
                    'showStatsMass': `Game stats: Mass`,
                    'showStatsSTE': `Game stats: STE`,
                    'showStatsN16': `Game stats: n/16`,
                    'showStatsFPS': `Game stats: FPS`,
                    'blockPopups': `Block popups (ads/shop/quest)`,
                    'hotkeys': `Hotkeys`,
                    'hk-inst-assign': 'To assign a hotkey click on the input field and press your chosen key.',
                    'hk-inst-delete': 'To delete a hotkey click on the input field and press the DELETE key.',
                    'hk-inst-keys': 'Possible key combinations with the CTRL and ALT keys.',
                    'hk-feed': `Feed`,
                    'hk-macroFeed': 'Macro feed',
                    'hk-split': 'Split',
                    'hk-doubleSplit': 'Double split',
                    'hk-split16': `Split 16`,
                    'hk-pause': `Cell pause`,
                    'hk-showTop5': `Show/hide team top 5`,
                    'hk-showTime': 'Show/hide current time',
                    'hk-showSplitRange': `Show/hide split range`,
                    'hk-showSplitInd': `Show/hide split indicators`,
                    'hk-showTeammatesInd': `Show/hide teammates indicators`,
                    'hk-showOppColors': `Show/hide opponents colors`,
                    'hk-toggleSkins': `Toggle skins (custom/default)`,
                    'hk-showSkins': `Show/hide skins`,
                    'hk-transparentSkins': `Toggle transparent skins`,
                    'hk-showStats': `Show/hide game stats`,
                    'hk-toggleCells': `Toggle own cells (smallest/biggest)`,
                    'hk-showFood': `Show/hide food`,
                    'hk-showGrid': 'Show/hide grid',
                    'hk-showMiniMapGuides': `Show/hide minimap guides`,
                    'hk-hideChat': `Show/hide chat`,
                    'hk-showHUD': `Show/hide HUD`,
                    'hk-copyLb': `Copy leaderboard`,
                    'hk-showLb': 'Show/hide leaderboard',
                    'hk-toggleAutoZoom': `Toggle auto zoom`,
                    'hk-resetZoom': `Reset zoom`,
                    'hk-zoomLevel': `Zoom level`,
                    'hk-toggleDeath': `Toggle death location`,
                    'hk-clearChat': 'Show chat history / Clear chat',
                    'hk-showBgSectors': `Show/hide background sectors`,
                    'hk-hideBots': `Show/hide small bots`,
                    'hk-showNames': `Show/hide names`,
                    'hk-hideTeammatesNames': `Show/hide teammates names`,
                    'hk-showMass': `Show/hide mass`,
                    'hk-showMiniMap': `Show/hide minimap`,
                    'hk-chatMessage': `Enter chat message`,
                    'hk-quickResp': `Quick respawn`,
                    'hk-autoResp': `Toggle auto respawn`,
                    'hk-switchServerMode': `Switch server [public/private]`,
                    'hk-showTargeting': 'Show/hide targeting panel',
                    'hk-setTargeting': 'Start/stop targeting (following)',
                    'hk-cancelTargeting': 'Cancel targeting',
                    'hk-changeTarget': `Change target`,
                    'hk-privateMiniMap': `Show target on the minimap`,
                    'hk-showQuest': `Show/hide quest`,
                    'commands': `Commands`,
                    'comm1': 'Feed me!',
                    'comm2': `Split into me!`,
                    'comm3': `Need backup at %currentSector%!`,
                    'comm4': `Enemy spotted at %currentSector%!`,
                    'comm5': `Need a teammate!`,
                    'comm6': `Tank the virus!`,
                    'comm7': `Eat the virus!`,
                    'comm8': `Let\'s bait!`,
                    'comm9': 'Fake tricksplit!',
                    'comm0': `Fuck!`,
                    'comm10': `Tricksplit!`,
                    'comm11': `Left!`,
                    'comm12': `Up!`,
                    'comm13': `Right!`,
                    'comm14': `Bottom!`,
                    'saveComm': `Save commands`,
                    'theme': `Theme`,
                    'restoreThemeSettings': 'Restore theme default settings',
                    'basicTheming': `Basic theming`,
                    'themePreset': `Theme preset`,
                    'themeType': `Theme type`,
                    'darkTheme': `Dark theme`,
                    'lightTheme': `Light theme`,
                    'mainColor': `Main color`,
                    'bgColor': 'Background',
                    'bordersColor': 'Map borders',
                    'gridColor': `Grid`,
                    'sectorsColor': `Sectors font`,
                    'namesColor': 'Names',
                    'namesStrokeColor': `Names stroke`,
                    'massColor': `Mass`,
                    'massStrokeColor': `Mass stroke`,
                    'virusColor': `Virus`,
                    'virusStrokeColor': `Virus stroke`,
                    'mVirusColor': 'Mothercell',
                    'mVirusStrokeColor': 'Mothercell stroke',
                    'foodColor': `Food`,
                    'namesFont': 'Names font',
                    'massFont': `Mass font`,
                    'sectorsFont': `Sectors font`,
                    'namesScale': `Names scale`,
                    'massScale': 'Mass scale',
                    'virMassScale': `Virus mass scale`,
                    'strokeScale': `Text stroke scale`,
                    'foodSize': `Food size`,
                    'bordersWidth': `Map borders width`,
                    'sectorsWidth': `Sectors grid width`,
                    'sectorsFontSize': `Sectors font size`,
                    'cellsAlpha': `Cells transparency`,
                    'skinsAlpha': `Skins transparency`,
                    'virusAlpha': `Virus transparency`,
                    'textAlpha': `Names & mass transparency`,
                    'virusStrokeSize': `Virus stroke size`,
                    'teammatesIndColor': `Teammate indicator`,
                    'cursorTrackingColor': `Cursor tracking`,
                    'splitRangeColor': `Split range`,
                    'safeAreaColor': `Safe area`,
                    'dangerAreaColor': `Danger area`,
                    'ghostCellsColor': `Ghost cells`,
                    'ghostCellsAlpha': `Ghost cells transparency`,
                    'menuTheming': 'Menu',
                    'menuPreset': `Menu theme`,
                    'menuMainColor': 'Main color',
                    'menuBtnTextColor': 'Button text',
                    'menuPanelColor': `Panel`,
                    'menuPanelColor2': `Panel (2)`,
                    'menuTextColor': `Panel text`,
                    'menuTextColor2': `Panel text (2)`,
                    'btn1Color': `Button #1`,
                    'btn1Color2': `Button #1 (2)`,
                    'btn2Color': `Button #2`,
                    'btn2Color2': `Button #2 (2)`,
                    'btn3Color': 'Button #3',
                    'btn3Color2': `Button #3 (2)`,
                    'btn4Color': `Button #4`,
                    'btn4Color2': `Button #4 (2)`,
                    'menuBg': `Panel background image`,
                    'menuOpacity': 'Transparency',
                    'hudTheming': 'HUD',
                    'hudMainColor': `Main color`,
                    'hudColor': `Background`,
                    'hudTextColor': `Text`,
                    'statsHudColor': 'Stats',
                    'timeHudColor': `Time`,
                    'top5MassColor': 'Mass',
                    'lbMeColor': `Leaderboard - me`,
                    'lbTeammateColor': `Leaderboard - teammate`,
                    'hudFont': `HUD font`,
                    'hudScale': `HUD scale`,
                    'chatTheming': `Chat`,
                    'messageColor': `Message background`,
                    'messageTextColor': `Message text`,
                    'messageTimeColor': `Message time`,
                    'messageNickColor': `Message nick`,
                    'commandsColor': `Command background`,
                    'commandsTextColor': 'Command text',
                    'commandsTimeColor': `Command time`,
                    'commandsNickColor': `Command nick`,
                    'chatBoxColor': 'Chatbox color',
                    'chatScale': `Chat scale`,
                    'miniMapTheming': 'Minimap',
                    'miniMapSectorsColor': `Sectors`,
                    'miniMapSectorColor': 'Current sector',
                    'miniMapGuidesColor': `Guides`,
                    'miniMapNickColor': `Nick`,
                    'miniMapNickStrokeColor': `Nick stroke`,
                    'miniMapMyCellColor': `My cell`,
                    'miniMapMyCellStrokeColor': `My cell stroke`,
                    'miniMapTeammatesColor': `Teammates`,
                    'miniMapDeathLocationColor': 'Death location',
                    'miniMapFont': `Minimap font`,
                    'miniMapNickFont': `Nick font`,
                    'miniMapWidth': `Minimap width`,
                    'miniMapSectorsOpacity': `Sectors transparency`,
                    'miniMapNickSize': `Nick size`,
                    'miniMapNickStrokeSize': `Nick stroke size`,
                    'miniMapMyCellSize': `My cell size`,
                    'miniMapMyCellStrokeSize': `My cell stroke size`,
                    'miniMapTeammatesSize': 'Teammates size',
                    'miniMapGhostCellsColor': 'Ghost cells',
                    'miniMapGhostCellsAlpha': `Ghost cells transparency`,
                    'imagesTheming': `Graphics / cursors`,
                    'customBackground': `Custom background image`,
                    'customCursor': `Custom cursor image`,
                    'hideChatMsgA': `Chat is visible!`,
                    'hideChatMsgB': `Chat is hidden!`,
                    'showSkinsMsgA': 'Skins are visible!',
                    'showSkinsMsgB': `Skins are hidden!`,
                    'hideSmallBotsMsgA': `Small bots are visible!`,
                    'hideSmallBotsMsgB': `Small bots are hidden!`,
                    'autoRespMsgA': `Auto respawn is on!`,
                    'autoRespMsgB': `Auto respawn is off!`,
                    'autoZoomMsgA': `Auto zoom is on!`,
                    'autoZoomMsgB': 'Auto zoom is off!',
                    'targetNotSet': `Target not set`,
                    'targetDead': `Dead`,
                    'targetDistance': `Distance`,
                    'targetMass': `Mass altogether`,
                    'totalPartyPlayers': `Active players`,
                    'totalPartyMass': `Total mass`,
                    'exportImport': `Export / import settings`,
                    'exportSettings': `Export settings`,
                    'exportInfo': 'To export selected settings copy the code below and save it to a text file encoded in Unicode.',
                    'importSettings': 'Import settings',
                    'importInfo': 'To import selected settings paste an exported code below and press the \"Import settings\" button.',
                    'profile': `Profile`,
                    'profiles': `Profiles`,
                    'skins': `Skins`,
                    'moreSkins': `Add skins`,
                    'thanks': 'Thanks to Awesome!',
                    'saveSett': `Save settings`,
                    'saved': `Saved!`,
                    'resetSett': 'Reset to default',
                    'close': `Close`,
                    'enterChatMsg': `Enter chat message`,
                    'activeParties': `Active parties`,
                    'noActiveParties': `No active parties ;(`,
                    'playlist': `Playlist`,
                    'pause': 'PAUSE!',
                    'visit': `Visit`,
                    'exit': `Legend mod Express: Are you sure you want to quit the game?`,
                    'blockWarn': `WARNING! Popups are blocked in the settings.`,
                    'unblockPopups': 'Temporary unblock',
                    'mass': `Mass`,
                    'score': `Score`,
                    'leaderboard': `Leaderboard`,
                    'user': `User`,
                    'userMuted': `User %user% has been muted.`,
                    'userUnmuted': `User %user% has been unmuted.`,
                    'mute': `Mute`,
                    'unmute': `Unmute`,
                    'mutedUsers': `Muted users`,
                    'activeUsers': `Active users`,
                    'showActiveUsers': 'Show active users',
                    'none': `None`,
                    'sounds': `Sounds`,
                    'page_menu_main_free_coins': 'Free Coins',
                    'page_menu_main_gifts': `Gifts`,
                    'page_menu_main_dailyquests': `Daily Quest`,
                    'page_shop': `Shop`
                }
            },
            r = 'en',
            l = e.navigator.language || e.navigator.userLanguage;
        l && n.hasOwnProperty(l) && (r = l);
        var h = n[r],
            c = {
                'comm1': h.comm1,
                'comm2': h.comm2,
                'comm3': h.comm3,
                'comm4': h.comm4,
                'comm5': h.comm5,
                'comm6': h.comm6,
                'comm7': h.comm7,
                'comm8': h.comm8,
                'comm9': h.comm9,
                'comm0': h.comm0,
                'comm10': h.comm10,
                'comm11': h.comm11,
                'comm12': h.comm12,
                'comm13': h.comm13,
                'comm14': h.comm14
            },
            u = {
                '&': `&amp;`,
                '<': `&lt;`,
                '>': `&gt;`,
                '"': `&quot;`,
                '\'': '&#39;',
                '/': '&#x2F;'
            },
            d = {
                ':)': 'smile.svg',
                ';)': `wink.svg`,
                '=)': `smirk.svg`,
                ':D': 'grin.svg',
                'X-D': 'xgrin.svg',
                '=D': `joy.svg`,
                ':(': `sad.svg`,
                ';(': `cry.svg`,
                ':P': `tongue.svg`,
                ';P': `tonguew.svg`,
                ':*': `kiss.svg`,
                '$)': `smileh.svg`,
                '<3': 'heart.svg',
                '8=)': `cool.svg`,
                ':o': `astonished.svg`,
                '(:|': `sweat.svg`,
                ':|': `neutral.svg`,
                ':\\': `unamused.svg`,
                ':@': 'pouting.svg',
                '|-)': `sleep.svg`,
                '^_^': `relaxed.svg`,
                '-_-': `expressionless.svg`,
                '$_$': `money.svg`,
                'O:)': 'angel.svg',
                '3:)': `devil.svg`,
                '(poop)': 'poo.svg',
                '(fuck)': `finger.svg`,
                '(clap)': `clap.svg`,
                '(ok)': `ok.svg`,
                '(victory)': `victory.svg`,
                '(y)': `thumb.svg`,
                '(n)': `thumbd.svg`
            },
            p = [{
                    name: "imgur.com",
                    url: "https://imgur.com/",
                    example: "https://i.imgur.com/xdmUp5N.png",
                    pattern: "https?://w+.imgur.com/w{6,}.(?:%file_ext%)??d*"
                },
                {
                    name: "put.re",
                    url: "https://put.re/",
                    example: "https://s.put.re/iYHAW65g.png",
                    pattern: "https?://w+.put.re/w{8,}.(?:%file_ext%)"
                },
                {
                    name: "postimages.org",
                    url: "https://postimages.org/",
                    example: "https://i.postimg.cc/zzK0sRPg/xdmUp5N.png",
                    pattern: "https?://w+.postimg.cc/w{8,}/w+.(?:%file_ext%)"
                }
            ],
            f = {
                'ogario-v3': {
                    'name': `OGARio v3`,
                    'darkTheme': !0,
                    'mainColor': `#01d9cc`,
                    'bgColor': `#000a11`,
                    'bordersColor': `#01d9cc`,
                    'gridColor': `#00243e`,
                    'sectorsColor': `#00243e`,
                    'namesColor': '#ffffff',
                    'namesStrokeColor': `#000000`,
                    'massColor': '#ffffff',
                    'massStrokeColor': `#000000`,
                    'virusColor': '#002f52',
                    'virusStrokeColor': `#00b9e8`,
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': `#5000ff`,
                    'teammatesIndColor': `#ffffff`,
                    'cursorTrackingColor': `#ffffff`,
                    'splitRangeColor': `#ffffff`,
                    'safeAreaColor': `#ffffff`,
                    'dangerAreaColor': '#bf00aa',
                    'namesFont': `ubuntu-bold`,
                    'massFont': `ubuntu-bold`,
                    'sectorsFont': 'ubuntu',
                    'namesScale': 1,
                    'massScale': 3,
                    'foodSize': 5,
                    'bordersWidth': 40,
                    'sectorsWidth': 40,
                    'sectorsFontSize': 1200,
                    'cellsAlpha': 0.9,
                    'skinsAlpha': 0.7,
                    'virusAlpha': 0.6,
                    'textAlpha': 1,
                    'virusStrokeSize': 14,
                    'menuPreset': `ogario-v3`,
                    'menuMainColor': `#01d9cc`,
                    'menuBtnTextColor': `#ffffff`,
                    'menuPanelColor': '#00243e',
                    'menuPanelColor2': `#002f52`,
                    'menuTextColor': `#ffffff`,
                    'menuTextColor2': `#8096a7`,
                    'btn1Color': `#018cf6`,
                    'btn1Color2': `#0176ce`,
                    'btn2Color': `#00b9e8`,
                    'btn2Color2': `#0099c0`,
                    'btn3Color': `#8d5fe6`,
                    'btn3Color2': `#814ee3`,
                    'btn4Color': `#bf00aa`,
                    'btn4Color2': `#a80096`,
                    'menuBg': 'https://cdn.ogario.ovh/static/img/pattern.png',
                    'menuOpacity': 0.96,
                    'hudMainColor': `#01d9cc`,
                    'hudColor': `rgba(0,0,0,0.4)`,
                    'hudTextColor': `#ffffff`,
                    'statsHudColor': `#ffffff`,
                    'timeHudColor': `#01d9cc`,
                    'top5MassColor': `#bf00aa`,
                    'lbMeColor': `#bf00aa`,
                    'lbTeammateColor': `#018cf6`,
                    'hudFont': `ubuntu-bold`,
                    'hudScale': 1,
                    'messageColor': `rgba(0,0,0,0.4)`,
                    'messageTextColor': `#ffffff`,
                    'messageTimeColor': `#018cf6`,
                    'messageNickColor': `#01d9cc`,
                    'commandsColor': 'rgba(191,0,170,0.9)',
                    'commandsTextColor': `#ffffff`,
                    'commandsTimeColor': `#bf00aa`,
                    'commandsNickColor': `#ffffff`,
                    'chatBoxColor': `rgba(0,0,0,0.4)`,
                    'chatScale': 1,
                    'miniMapSectorsColor': `#ffffff`,
                    'miniMapSectorColor': '#01d9cc',
                    'miniMapGuidesColor': `#bf00aa`,
                    'miniMapNickColor': '#ffffff',
                    'miniMapNickStrokeColor': '#000000',
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#bf00aa',
                    'miniMapTeammatesColor': '#01d9cc',
                    'miniMapDeathLocationColor': '#bf00aa',
                    'miniMapFont': `ubuntu-bold`,
                    'miniMapNickFont': `ubuntu-bold`,
                    'miniMapWidth': 240,
                    'miniMapSectorsOpacity': 0.1,
                    'miniMapNickSize': 11,
                    'miniMapNickStrokeSize': 2,
                    'miniMapMyCellSize': 7.5,
                    'miniMapMyCellStrokeSize': 4,
                    'miniMapTeammatesSize': 5.5,
                    'customBackground': '',
                    'customCursor': `https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur`
                },
                'ogario-orange': {
                    'name': `OGARio v2`,
                    'darkTheme': !0,
                    'mainColor': `#ff7800`,
                    'bgColor': '#111111',
                    'bordersColor': `#ff7800`,
                    'gridColor': `#292929`,
                    'sectorsColor': `#292929`,
                    'namesColor': `#ffffff`,
                    'namesStrokeColor': `#000000`,
                    'massColor': `#ffffff`,
                    'massStrokeColor': `#000000`,
                    'virusColor': '#666666',
                    'virusStrokeColor': `#666666`,
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': `#e16400`,
                    'hudMainColor': `#ff7800`,
                    'statsHudColor': `#ff7800`,
                    'top5MassColor': `#ff7800`,
                    'timeHudColor': `#ff7800`,
                    'messageNickColor': `#ff7800`,
                    'commandsColor': `rgba(255,120,0,0.9)`,
                    'commandsTimeColor': `#ff7800`,
                    'commandsTextColor': `#ffffff`,
                    'miniMapSectorsColor': `#ffffff`,
                    'miniMapSectorColor': `#ff7800`,
                    'miniMapGuidesColor': '#ff7800',
                    'miniMapMyCellColor': `#ffffff`,
                    'miniMapMyCellStrokeColor': `#ff7800`,
                    'miniMapTeammatesColor': '#ff7800',
                    'miniMapDeathLocationColor': `#ff7800`,
                    'miniMapSectorsOpacity': 0.1
                },
                'ogario-gold': {
                    'name': `OGARio LE`,
                    'darkTheme': !0,
                    'mainColor': `#b5a642`,
                    'bgColor': `#000000`,
                    'bordersColor': `#b5a642`,
                    'gridColor': `#111111`,
                    'sectorsColor': '#111111',
                    'namesColor': `#ffffff`,
                    'namesStrokeColor': `#000000`,
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': `#666666`,
                    'virusStrokeColor': `#666666`,
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': `#998c36`,
                    'hudMainColor': `#b5a642`,
                    'statsHudColor': '#b5a642',
                    'top5MassColor': `#b5a642`,
                    'timeHudColor': `#b5a642`,
                    'messageNickColor': '#b5a642',
                    'commandsColor': `rgba(181,166,66,0.9)`,
                    'commandsTimeColor': `#b5a642`,
                    'commandsTextColor': `#ffffff`,
                    'miniMapSectorsColor': `#ffffff`,
                    'miniMapSectorColor': '#b5a642',
                    'miniMapGuidesColor': `#b5a642`,
                    'miniMapMyCellColor': `#ffffff`,
                    'miniMapMyCellStrokeColor': '#b5a642',
                    'miniMapTeammatesColor': `#b5a642`,
                    'miniMapDeathLocationColor': `#b5a642`,
                    'miniMapSectorsOpacity': 0.1
                },
                'sniikz-style': {
                    'name': `SniiKz\'s Style`,
                    'darkTheme': !0,
                    'mainColor': `#01d9cc`,
                    'bgColor': '#000000',
                    'bordersColor': '#ffffff',
                    'gridColor': `#00243e`,
                    'sectorsColor': `#00243e`,
                    'namesColor': `#ffffff`,
                    'namesStrokeColor': `#000000`,
                    'massColor': `#ffffff`,
                    'massStrokeColor': `#000000`,
                    'virusColor': '#3b3b3b',
                    'virusStrokeColor': `#ffffff`,
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': `#5000ff`,
                    'teammatesIndColor': '#ffffff',
                    'cursorTrackingColor': `#ffffff`,
                    'splitRangeColor': `#ffffff`,
                    'safeAreaColor': `#ffffff`,
                    'dangerAreaColor': `#bf00aa`,
                    'massScale': 4,
                    'foodSize': 1,
                    'bordersWidth': 40,
                    'sectorsWidth': 40,
                    'sectorsFontSize': 1200,
                    'cellsAlpha': 0.99,
                    'skinsAlpha': 0.7,
                    'virusAlpha': 0.4,
                    'virusStrokeSize': 10,
                    'menuPreset': 'ogario-v3',
                    'menuMainColor': `#fc0079`,
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': `#050008`,
                    'menuPanelColor2': `#1d0526`,
                    'menuTextColor': `#ffffff`,
                    'menuTextColor2': '#65458f',
                    'btn1Color': `#4f0242`,
                    'btn1Color2': '#3b0431',
                    'btn2Color': '#6b0036',
                    'btn2Color2': `#4d0227`,
                    'btn3Color': `#aa084e`,
                    'btn3Color2': '#80063b',
                    'btn4Color': `#aa084e`,
                    'btn4Color2': `#8a063f`,
                    'menuBg': `https://cdn.ogario.ovh/static/img/pattern.png`,
                    'menuOpacity': 1,
                    'hudMainColor': '#5974ff',
                    'hudColor': `rgba(36,36,36,0.49)`,
                    'hudTextColor': `#ffffff`,
                    'statsHudColor': `#ffffff`,
                    'timeHudColor': `#737373`,
                    'top5MassColor': `#1fe000`,
                    'lbMeColor': `#bf00aa`,
                    'lbTeammateColor': `#018cf6`,
                    'hudScale': 1.15,
                    'messageColor': `rgba(0,0,0,0.4)`,
                    'messageTextColor': `#e8e8e8`,
                    'messageTimeColor': `#545454`,
                    'messageNickColor': `#05ff00`,
                    'commandsColor': `rgba(36,36,36,0.9)`,
                    'commandsTextColor': `#ffffff`,
                    'commandsTimeColor': `#545454`,
                    'commandsNickColor': `#ffffff`,
                    'chatBoxColor': 'rgba(0,0,0,0.4)',
                    'chatScale': 1,
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': `#000000`,
                    'miniMapGuidesColor': '#ff00a8',
                    'miniMapNickColor': `#ffffff`,
                    'miniMapNickStrokeColor': `#4d4d4d`,
                    'miniMapMyCellColor': `#f0ff3d`,
                    'miniMapMyCellStrokeColor': `#acba07`,
                    'miniMapTeammatesColor': `#305eff`,
                    'miniMapDeathLocationColor': `#2b2b2b`,
                    'miniMapWidth': 250,
                    'miniMapSectorsOpacity': 0.1,
                    'miniMapNickSize': 9,
                    'miniMapNickStrokeSize': 0,
                    'miniMapMyCellSize': 5,
                    'miniMapMyCellStrokeSize': 0,
                    'miniMapTeammatesSize': 5,
                    'customBackground': '',
                    'customCursor': 'https://cdn.ogario.ovh/static/img/cursors/cursor_01.cur'
                },
                'hkg-style': {
                    'name': 'HKG Style',
                    'darkTheme': !0,
                    'mainColor': `#651fff`,
                    'bgColor': `#000000`,
                    'bordersColor': `#ffffff`,
                    'gridColor': `#111111`,
                    'sectorsColor': '#111111',
                    'namesColor': `#ffffff`,
                    'namesStrokeColor': '#000000',
                    'massColor': `#ffffff`,
                    'massStrokeColor': `#000000`,
                    'virusColor': `#666666`,
                    'virusStrokeColor': `#666666`,
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': `#651fff`,
                    'hudMainColor': `#651fff`,
                    'statsHudColor': `#651fff`,
                    'top5MassColor': `#651fff`,
                    'timeHudColor': `#651fff`,
                    'messageNickColor': `#651fff`,
                    'commandsColor': 'rgba(101,31,255,0.9)',
                    'commandsTimeColor': `#651fff`,
                    'commandsTextColor': `#ffffff`,
                    'miniMapSectorsColor': `#ffffff`,
                    'miniMapSectorColor': '#651fff',
                    'miniMapGuidesColor': `#651fff`,
                    'miniMapMyCellColor': `#ffffff`,
                    'miniMapMyCellStrokeColor': `#651fff`,
                    'miniMapTeammatesColor': `#651fff`,
                    'miniMapDeathLocationColor': '#651fff',
                    'miniMapSectorsOpacity': 0.1
                },
                'agario-light': {
                    'name': 'Agar.io Light',
                    'darkTheme': !1,
                    'mainColor': `#ffffff`,
                    'bgColor': `#f2fbff`,
                    'bordersColor': `#858a8c`,
                    'gridColor': `#ced6d9`,
                    'sectorsColor': `#ced6d9`,
                    'namesColor': `#ffffff`,
                    'namesStrokeColor': `#000000`,
                    'massColor': `#ffffff`,
                    'massStrokeColor': `#000000`,
                    'virusColor': `#33ff33`,
                    'virusStrokeColor': '#2de52d',
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': `#2de52d`,
                    'hudMainColor': '#ffffff',
                    'statsHudColor': `#ffffff`,
                    'top5MassColor': `#ffffff`,
                    'timeHudColor': `#ffffff`,
                    'messageNickColor': `#ffffff`,
                    'commandsColor': `rgba(255,255,255,0.9)`,
                    'commandsTimeColor': '#ffffff',
                    'commandsTextColor': '#000000',
                    'miniMapSectorsColor': '#ffffff',
                    'miniMapSectorColor': `#ffffff`,
                    'miniMapGuidesColor': `#ffffff`,
                    'miniMapMyCellColor': `#ffffff`,
                    'miniMapMyCellStrokeColor': `#ffffff`,
                    'miniMapTeammatesColor': `#ffffff`,
                    'miniMapDeathLocationColor': `#ffffff`,
                    'miniMapSectorsOpacity': 0.25
                },
                'agario-dark': {
                    'name': `Agar.io Dark`,
                    'darkTheme': !0,
                    'mainColor': '#ffffff',
                    'bgColor': `#111111`,
                    'bordersColor': `#999999`,
                    'gridColor': `#333333`,
                    'sectorsColor': `#333333`,
                    'namesColor': `#ffffff`,
                    'namesStrokeColor': `#000000`,
                    'massColor': '#ffffff',
                    'massStrokeColor': '#000000',
                    'virusColor': `#33ff33`,
                    'virusStrokeColor': `#2de52d`,
                    'mVirusColor': '#ce6363',
                    'mVirusStrokeColor': '#b95959',
                    'foodColor': '#2de52d',
                    'hudMainColor': `#ffffff`,
                    'statsHudColor': `#ffffff`,
                    'top5MassColor': `#ffffff`,
                    'timeHudColor': `#ffffff`,
                    'messageNickColor': `#ffffff`,
                    'commandsColor': 'rgba(255,255,255,0.9)',
                    'commandsTimeColor': `#ffffff`,
                    'commandsTextColor': '#ffffff',
                    'miniMapSectorsColor': `#ffffff`,
                    'miniMapSectorColor': `#ffffff`,
                    'miniMapGuidesColor': `#ffffff`,
                    'miniMapMyCellColor': '#ffffff',
                    'miniMapMyCellStrokeColor': '#ffffff',
                    'miniMapTeammatesColor': `#ffffff`,
                    'miniMapDeathLocationColor': `#ffffff`,
                    'miniMapSectorsOpacity': 0.1
                }
            },
            m = {
                'ogario-v3': {
                    'name': `OGARio v3`,
                    'menuMainColor': `#01d9cc`,
                    'menuBtnTextColor': `#ffffff`,
                    'menuPanelColor': `#00243e`,
                    'menuPanelColor2': '#002f52',
                    'menuTextColor': `#ffffff`,
                    'menuTextColor2': '#8096a7',
                    'btn1Color': '#018cf6',
                    'btn1Color2': `#0176ce`,
                    'btn2Color': '#00b9e8',
                    'btn2Color2': `#0099c0`,
                    'btn3Color': '#8d5fe6',
                    'btn3Color2': '#814ee3',
                    'btn4Color': `#f300d8`,
                    'btn4Color2': `#df00c6`,
                    'menuBg': `https://cdn.ogario.ovh/static/img/pattern.png`
                },
                'ogario-v2': {
                    'name': 'OGARio v2',
                    'menuMainColor': `#ff7800`,
                    'menuBtnTextColor': `#ffffff`,
                    'menuPanelColor': `#222222`,
                    'menuPanelColor2': `#333333`,
                    'menuTextColor': '#bbbbbb',
                    'menuTextColor2': `#bbbbbb`,
                    'btn1Color': `#428bca`,
                    'btn1Color2': '#3071a9',
                    'btn2Color': `#5cb85c`,
                    'btn2Color2': `#449d44`,
                    'btn3Color': `#f0ad4e`,
                    'btn3Color2': `#ec971f`,
                    'btn4Color': `#d9534f`,
                    'btn4Color2': `#c9302c`,
                    'menuBg': ''
                },
                'agario': {
                    'name': `Agar.io`,
                    'menuMainColor': `#5bc0de`,
                    'menuBtnTextColor': '#ffffff',
                    'menuPanelColor': `#ffffff`,
                    'menuPanelColor2': `#cccccc`,
                    'menuTextColor': `#333333`,
                    'menuTextColor2': `#999999`,
                    'btn1Color': `#428bca`,
                    'btn1Color2': `#3071a9`,
                    'btn2Color': `#5cb85c`,
                    'btn2Color2': `#449d44`,
                    'btn3Color': `#f0ad4e`,
                    'btn3Color2': `#ec971f`,
                    'btn4Color': `#d9534f`,
                    'btn4Color2': `#c9302c`,
                    'menuBg': ''
                }
            },
            g = {
                'preset': `ogario-v3`,
                'darkTheme': !0,
                'mainColor': `#01d9cc`,
                'bgColor': `#000a11`,
                'bordersColor': `#01d9cc`,
                'gridColor': `#00243e`,
                'sectorsColor': `#00243e`,
                'namesColor': `#ffffff`,
                'namesStrokeColor': `#000000`,
                'massColor': `#ffffff`,
                'massStrokeColor': `#000000`,
                'virusColor': `#002f52`,
                'virusStrokeColor': '#00b9e8',
                'mVirusColor': '#ce6363',
                'mVirusStrokeColor': '#b95959',
                'foodColor': '#5000ff',
                'teammatesIndColor': `#ffffff`,
                'cursorTrackingColor': `#ffffff`,
                'splitRangeColor': `#ffffff`,
                'ghostCellsColor': `#ffffff`,
                'safeAreaColor': '#ffffff',
                'dangerAreaColor': `#bf00aa`,
                'namesFont': `ubuntu-bold`,
                'namesFontFamily': `Ubuntu`,
                'namesFontWeight': 700,
                'massFont': `ubuntu-bold`,
                'massFontFamily': `Ubuntu`,
                'massFontWeight': 700,
                'sectorsFont': `ubuntu`,
                'sectorsFontFamily': `Ubuntu`,
                'sectorsFontWeight': 400,
                'sectorsX': 5,
                'sectorsY': 5,
                'namesScale': 1,
                'massScale': 3,
                'virMassScale': 3,
                'strokeScale': 1,
                'foodSize': 5,
                'bordersWidth': 40,
                'sectorsWidth': 40,
                'sectorsFontSize': 1200,
                'cellsAlpha': 0.9,
                'skinsAlpha': 0.7,
                'virusAlpha': 0.6,
                'textAlpha': 1,
                'ghostCellsAlpha': 0.3,
                'virusStrokeSize': 14,
                'menuPreset': `ogario-v3`,
                'menuMainColor': `#01d9cc`,
                'menuBtnTextColor': '#ffffff',
                'menuPanelColor': '#00243e',
                'menuPanelColor2': `#002f52`,
                'menuTextColor': `#ffffff`,
                'menuTextColor2': `#8096a7`,
                'btn1Color': `#018cf6`,
                'btn1Color2': `#0176ce`,
                'btn2Color': '#00b9e8',
                'btn2Color2': `#0099c0`,
                'btn3Color': '#8d5fe6',
                'btn3Color2': `#814ee3`,
                'btn4Color': '#bf00aa',
                'btn4Color2': `#a80096`,
                'menuBg': `https://cdn.ogario.ovh/static/img/pattern.png`,
                'menuOpacity': 0.96,
                'hudMainColor': `#01d9cc`,
                'hudColor': `rgba(0,0,0,0.4)`,
                'hudTextColor': '#ffffff',
                'statsHudColor': `#ffffff`,
                'timeHudColor': `#01d9cc`,
                'top5MassColor': '#bf00aa',
                'lbMeColor': `#bf00aa`,
                'lbTeammateColor': `#018cf6`,
                'hudFont': `ubuntu-bold`,
                'hudFontFamily': 'Ubuntu',
                'hudFontWeight': 700,
                'hudScale': 1,
                'messageColor': 'rgba(0,0,0,0.4)',
                'messageTextColor': `#ffffff`,
                'messageTimeColor': `#018cf6`,
                'messageNickColor': `#01d9cc`,
                'commandsColor': `rgba(191,0,170,0.9)`,
                'commandsTextColor': `#ffffff`,
                'commandsTimeColor': `#bf00aa`,
                'commandsNickColor': `#ffffff`,
                'chatBoxColor': 'rgba(0,0,0,0.4)',
                'chatScale': 1,
                'miniMapSectorsColor': `#ffffff`,
                'miniMapSectorColor': '#01d9cc',
                'miniMapGuidesColor': `#bf00aa`,
                'miniMapNickColor': `#ffffff`,
                'miniMapNickStrokeColor': `#000000`,
                'miniMapMyCellColor': '#ffffff',
                'miniMapMyCellStrokeColor': `#bf00aa`,
                'miniMapTeammatesColor': `#01d9cc`,
                'miniMapDeathLocationColor': `#bf00aa`,
                'miniMapGhostCellsColor': '#ffffff',
                'miniMapFont': `ubuntu-bold`,
                'miniMapFontFamily': `Ubuntu`,
                'miniMapFontWeight': 700,
                'miniMapNickFont': `ubuntu-bold`,
                'miniMapNickFontFamily': 'Ubuntu',
                'miniMapNickFontWeight': 700,
                'miniMapWidth': 240,
                'miniMapTop': 24,
                'miniMapSectorsOpacity': 0.1,
                'miniMapNickSize': 11,
                'miniMapNickStrokeSize': 2,
                'miniMapMyCellSize': 7.5,
                'miniMapMyCellStrokeSize': 4,
                'miniMapTeammatesSize': 5.5,
                'miniMapGhostCellsAlpha': 0.15,
                'customBackground': '',
                'customCursor': 'https://cdn.ogario.ovh/static/img/cursors/cursor_02.cur'
            },
            y = {
                'menuMainColorCSS': null,
                'menuPanelColorCSS': null,
                'menuTextlColorCSS': null,
                'menuButtonsCSS': null,
                'hudCSS': null,
                'chatCSS': null,
                'chatScaleCSS': null,
                'cursorCSS': null,
                'loadThemeSettings': function() {
                    var t = null;
                    for (var s in null !== e.localStorage.getItem(`ogarioThemeSettings`) && (t = JSON.parse(e.localStorage.getItem(`ogarioThemeSettings`))), g) g.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (g[s] = t[s]), i.hasOwnProperty(s) && (i[s] = g[s]));
                },
                'saveThemeSettings': function() {
                    e.localStorage.setItem(`ogarioThemeSettings`, JSON.stringify(g));
                },
                'restoreThemeSettings': function() {
                    null !== e.localStorage.getItem(`ogarioThemeSettings`) && (e.localStorage.removeItem(`ogarioThemeSettings`), e.location.reload());
                },
                'addCustomCSS': function(t, e) {
                    this[t] || (this[t] = s(`<style type=\'text/css\'>`)[`appendTo`](`head`)), this[t]['html'](e);
                },
                'addPresetBox': function(t, e, i, o, a) {
                    for (var n in s(t).append(`<div class=\"preset-box\"><span class=\"title-box\">` + h[e] + '</span><div class=\"select-wrapper\"><select id=\"' + e + `\" class=\"form-control\"></select></div></div>`), i) i.hasOwnProperty(n) && s('#' + e).append(`<option value=\"` + n + '\">' + i[n][`name`] + `</option>`);
                    s('#' + e).val(g[o]);
                    var r = this;
                    s('#' + e)['on'](`change`, function() {
                        var t = this.value;
                        g[o] = t, r[a](t);
                    });
                },
                'addColorBox': function(t, e, o) {
                    if (s(t).append(`<div class=\"color-box\"><span class=\"title-box\">` + h[e] + '</span><div class=\"input-group ' + e + `-picker\"><input type=\"text\" value=\"` + g[e] + `\" id=\"` + e + `\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>`), o) {
                        var a = this;
                        s(t + ' .' + e + `-picker`)['colorpicker']({
                            'format': `hex`
                        })['on'](`changeColor.colorpicker`, function(t) {
                            g[e] = t[`color`][`toHex`](), i.hasOwnProperty(e) && (i[e] = g[e]), a[o]();
                        });
                    } else s(t + ' .' + e + '-picker').colorpicker({
                        'format': `hex`
                    })['on'](`changeColor.colorpicker`, function(t) {
                        g[e] = t[`color`]['toHex'](), i.hasOwnProperty(e) && (i[e] = g[e]);
                    });
                },
                'addRgbaColorBox': function(t, e, o) {
                    if (s(t).append(`<div class=\"color-box\"><span class=\"title-box\">` + h[e] + `</span><div class=\"input-group ` + e + `-picker\"><input type=\"text\" value=\"` + g[e] + `\" id=\"` + e + '\" class=\"form-control\" /><span class=\"input-group-addon\"><i></i></span></div></div>'), o) {
                        var a = this;
                        s(t + ' .' + e + `-picker`).colorpicker({
                            'format': `rgba`
                        })['on'](`changeColor.colorpicker`, function(t) {
                            var s = t[`color`][`toRGB`]();
                            g[e] = 'rgba(' + s['r'] + ',' + s['g'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = g[e]), a[o]();
                        });
                    } else s(t + ' .' + e + `-picker`).colorpicker({
                        'format': 'rgba'
                    })['on'](`changeColor.colorpicker`, function(t) {
                        var s = t[`color`][`toRGB`]();
                        g[e] = `rgba(` + s['r'] + ',' + s['g'] + ',' + s['b'] + ',' + s['a'] + ')', i.hasOwnProperty(e) && (i[e] = g[e]);
                    });
                },
                'addSliderBox': function(t, e, o, a, n, r) {
                    if (s(t).append(`<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">` + h[e] + `: </span><span id=\"` + e + '-value\" class=\"value\">' + g[e] + `</span></div><input id=\"` + e + '-slider\" type=\"range\" min=\"' + o + `\" max=\"` + a + `\" step=\"` + n + `\" value=\"` + g[e] + `\"></div>`), r) {
                        var l = this;
                        s('#' + e + `-slider`)['on'](`input`, function() {
                            var t = parseFloat(s(this).val());
                            s('#' + e + '-value')[`text`](t), g[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r]();
                        });
                    } else s('#' + e + `-slider`)['on'](`input`, function() {
                        var t = parseFloat(s(this)['val']());
                        s('#' + e + '-value')[`text`](t), g[e] = t, i.hasOwnProperty(e) && (i[e] = t);
                    });
                },
                'addInputBox': function(t, e, i, o) {
                    s(t).append(`<div class=\"input-box\"><span class=\"title-box\">` + h[e] + '</span><input id=\"' + e + `\" class=\"form-control\" placeholder=\"` + i + '\" value=\"' + g[e] + '\" /></div>');
                    var a = this;
                    s('#' + e)['on'](`input`, function() {
                        g[e] = this.value, a[o]();
                    });
                },
                'addCursorBox': function(t, e) {
                    e === g.customCursor ? s(t).append(`<div class=\"cursor-box\"><a href=\"#\" class=\"active\"><img src=\"` + e + `\"></a></div>`) : s(t).append(`<div class=\"cursor-box\"><a href=\"#\"><img src=\"` + e + '\"></a></div>');
                },
                'setFont': function(t, e) {
                    g[t] = e, g[t + `Family`] = this[`setFontFamily`](e), g[t + 'Weight'] = this.setFontWeight(e), i.hasOwnProperty(t + `Family`) && (i[t + `Family`] = g[t + `Family`]), i.hasOwnProperty(t + `Weight`) && (i[t + 'Weight'] = g[t + `Weight`]);
                },
                'addFontBox': function(t, e, i) {
                    s(t).append('<div class=\"font-box\"><span class=\"title-box\">' + h[e] + `</span><div class=\"select-wrapper\"><select id=\"` + e + `\" class=\"form-control\"></select></div></div>`), s('#' + e).append(`<option value=\"ubuntu\">Ubuntu</option><option value=\"ubuntu-bold\">Ubuntu Bold</option>`), s('#' + e).append(`<option value=\"roboto\">Roboto</option><option value=\"roboto-bold\">Roboto Bold</option>`), s('#' + e).append(`<option value=\"oswald\">Oswald</option><option value=\"oswald-bold\">Oswald Bold</option>`), s('#' + e).val(g[e]);
                    var o = this;
                    i ? s('#' + e)['on'](`change`, function() {
                        var t = this.value;
                        o.setFont(e, t), o[i]();
                    }) : s('#' + e)['on'](`change`, function() {
                        var t = this['value'];
                        o.setFont(e, t);
                    });
                },
                'setFontFamily': function(t) {
                    return -1 != t.indexOf(`roboto`) ? `Roboto` : -1 != t.indexOf(`oswald`) ? `Oswald` : 'Ubuntu';
                },
                'setFontWeight': function(t) {
                    return -1 != t.indexOf('bold') ? 700 : 400;
                },
                'setThemeMenu': function() {
                    var t = this;
                    s(`#theme`).append(`<ul class=\"submenu-tabs\"><li class=\"theme-main-tab active\"><a href=\"#theme-main\" class=\"active ogicon-paint-format\" data-toggle=\"tab-tooltip\" title=\"` + h[`basicTheming`] + `\"></a></li><li class=\"theme-menu-tab\"><a href=\"#theme-menu\" class=\"ogicon-menu\" data-toggle=\"tab-tooltip\" title=\"` + h[`menuTheming`] + `\"></a></li><li class=\"theme-hud-tab\"><a href=\"#theme-hud\" class=\"ogicon-display\" data-toggle=\"tab-tooltip\" title=\"` + h[`hudTheming`] + `\"></a></li><li class=\"theme-chat-tab\"><a href=\"#theme-chat\" class=\"ogicon-bubbles\" data-toggle=\"tab-tooltip\" title=\"` + h[`chatTheming`] + '\"></a></li><li class=\"theme-minimap-tab\"><a href=\"#theme-minimap\" class=\"ogicon-location2\" data-toggle=\"tab-tooltip\" title=\"' + h[`miniMapTheming`] + `\"></a></li><li class=\"theme-images-tab\"><a href=\"#theme-images\" class=\"ogicon-compass\" data-toggle=\"tab-tooltip\" title=\"` + h[`imagesTheming`] + '\"></a></li></ul><div id=\"theme-main\" class=\"submenu-panel\"></div><div id=\"theme-menu\" class=\"submenu-panel\"></div><div id=\"theme-hud\" class=\"submenu-panel\"></div><div id=\"theme-chat\" class=\"submenu-panel\"></div><div id=\"theme-minimap\" class=\"submenu-panel\"></div><div id=\"theme-images\" class=\"submenu-panel\"></div>'), this[`addPresetBox`](`#theme-main`, `themePreset`, f, `preset`, `changeThemePreset`), this[`addColorBox`](`#theme-main`, `bgColor`, `setBgColor`), this[`addColorBox`](`#theme-main`, `bordersColor`), this[`addColorBox`](`#theme-main`, `gridColor`), this[`addColorBox`]('#theme-main', `sectorsColor`), this[`addColorBox`](`#theme-main`, `namesColor`), this[`addColorBox`](`#theme-main`, `namesStrokeColor`), this[`addColorBox`]('#theme-main', `massColor`), this[`addColorBox`](`#theme-main`, `massStrokeColor`), this[`addColorBox`](`#theme-main`, `virusColor`), this[`addColorBox`](`#theme-main`, `virusStrokeColor`), this.addColorBox('#theme-main', 'mVirusColor'), this.addColorBox('#theme-main', 'mVirusStrokeColor'), this[`addColorBox`](`#theme-main`, `foodColor`, `setFoodColor`), this['addColorBox'](`#theme-main`, 'teammatesIndColor', `setIndicatorColor`), this[`addColorBox`]('#theme-main', `cursorTrackingColor`), this['addColorBox']('#theme-main', `splitRangeColor`), this[`addColorBox`](`#theme-main`, `safeAreaColor`), this[`addColorBox`](`#theme-main`, `dangerAreaColor`), this['addColorBox'](`#theme-main`, `ghostCellsColor`), this[`addFontBox`](`#theme-main`, `namesFont`), this[`addFontBox`](`#theme-main`, 'massFont'), this[`addFontBox`]('#theme-main', `sectorsFont`), this['addSliderBox'](`#theme-main`, `sectorsFontSize`, 200, 2000, 10), this[`addSliderBox`](`#theme-main`, `namesScale`, 0.5, 2, 0.1), this[`addSliderBox`]('#theme-main', `massScale`, 1, 5, 1), this[`addSliderBox`](`#theme-main`, `virMassScale`, 1, 5, 1), this[`addSliderBox`](`#theme-main`, `strokeScale`, 1, 4, 0.1), this[`addSliderBox`](`#theme-main`, `foodSize`, 1, 50, 1, 'setFoodColor'), this[`addSliderBox`](`#theme-main`, `virusStrokeSize`, 2, 40, 1), this['addSliderBox'](`#theme-main`, `bordersWidth`, 2, 200, 2), this[`addSliderBox`](`#theme-main`, `sectorsWidth`, 2, 200, 2), this[`addSliderBox`](`#theme-main`, 'cellsAlpha', 0.01, 0.99, 0.01), this[`addSliderBox`](`#theme-main`, `skinsAlpha`, 0.01, 0.99, 0.01), this[`addSliderBox`](`#theme-main`, 'virusAlpha', 0, 1, 0.01), this[`addSliderBox`](`#theme-main`, `textAlpha`, 0.1, 1, 0.01), this[`addSliderBox`](`#theme-main`, `ghostCellsAlpha`, 0.01, 0.99, 0.01), this[`addPresetBox`](`#theme-menu`, `menuPreset`, m, `menuPreset`, 'changeMenuPreset'), this[`addSliderBox`](`#theme-menu`, `menuOpacity`, 0.1, 1, 0.01, 'setMenuOpacity'), this[`addColorBox`](`#theme-menu`, `menuMainColor`, 'setMenuMainColor'), this[`addColorBox`]('#theme-menu', 'menuBtnTextColor', 'setMenuButtons'), this[`addColorBox`](`#theme-menu`, `menuPanelColor`, `setMenuPanelColor`), this[`addColorBox`](`#theme-menu`, 'menuPanelColor2', `setMenuPanelColor`), this['addColorBox']('#theme-menu', `menuTextColor`, `setMenuTextColor`), this[`addColorBox`](`#theme-menu`, `menuTextColor2`, `setMenuTextColor`), this[`addColorBox`](`#theme-menu`, 'btn1Color', `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn1Color2`, `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn2Color`, `setMenuButtons`), this[`addColorBox`](`#theme-menu`, 'btn2Color2', `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn3Color`, `setMenuButtons`), this[`addColorBox`]('#theme-menu', `btn3Color2`, `setMenuButtons`), this[`addColorBox`](`#theme-menu`, 'btn4Color', `setMenuButtons`), this[`addColorBox`](`#theme-menu`, `btn4Color2`, `setMenuButtons`), this[`addInputBox`](`#theme-menu`, `menuBg`, `Image URL`, `setMenuBg`), this[`addColorBox`]('#theme-hud', `hudMainColor`, `setHudColors`), this[`addRgbaColorBox`](`#theme-hud`, `hudColor`, 'setHudColors'), this['addColorBox'](`#theme-hud`, `hudTextColor`, `setHudColors`), this[`addColorBox`](`#theme-hud`, `statsHudColor`, 'setHudColors'), this['addColorBox'](`#theme-hud`, `timeHudColor`, `setHudColors`), this[`addColorBox`](`#theme-hud`, `top5MassColor`, `setHudColors`), this[`addColorBox`](`#theme-hud`, 'lbMeColor', `setHudColors`), this[`addColorBox`](`#theme-hud`, `lbTeammateColor`, 'setHudColors'), this[`addFontBox`](`#theme-hud`, `hudFont`, 'setHudFont'), this['addSliderBox']('#theme-hud', `hudScale`, 1, 2, 0.01, `setHudScale`), this[`addRgbaColorBox`](`#theme-chat`, `messageColor`, 'setChatColors'), this[`addColorBox`](`#theme-chat`, `messageTextColor`, `setChatColors`), this[`addColorBox`](`#theme-chat`, `messageTimeColor`, `setChatColors`), this[`addColorBox`](`#theme-chat`, `messageNickColor`, `setChatColors`), this[`addRgbaColorBox`](`#theme-chat`, `commandsColor`, `setChatColors`), this['addColorBox']('#theme-chat', `commandsTextColor`, `setChatColors`), this[`addColorBox`]('#theme-chat', 'commandsTimeColor', `setChatColors`), this[`addColorBox`](`#theme-chat`, `commandsNickColor`, `setChatColors`), this[`addRgbaColorBox`](`#theme-chat`, 'chatBoxColor', 'setChatColors'), this[`addSliderBox`]('#theme-chat', `chatScale`, 1, 2, 0.01, `setChatScale`), this[`addColorBox`](`#theme-minimap`, `miniMapSectorsColor`, 'setMiniMapSectorsColor'), this[`addColorBox`](`#theme-minimap`, `miniMapSectorColor`), this[`addColorBox`](`#theme-minimap`, `miniMapNickColor`), this['addColorBox'](`#theme-minimap`, `miniMapNickStrokeColor`), this[`addColorBox`](`#theme-minimap`, `miniMapMyCellColor`), this['addColorBox']('#theme-minimap', `miniMapMyCellStrokeColor`), this[`addColorBox`]('#theme-minimap', 'miniMapTeammatesColor'), this[`addColorBox`](`#theme-minimap`, `miniMapDeathLocationColor`), this[`addColorBox`](`#theme-minimap`, `miniMapGuidesColor`), this[`addColorBox`](`#theme-minimap`, `miniMapGhostCellsColor`), this[`addFontBox`](`#theme-minimap`, `miniMapFont`, `setMiniMapFont`), this['addFontBox']('#theme-minimap', `miniMapNickFont`), this[`addSliderBox`](`#theme-minimap`, `miniMapWidth`, 200, 400, 2, `setMiniMapWidth`), this['addSliderBox']('#theme-minimap', 'miniMapSectorsOpacity', 0, 1, 0.01, `setMiniMapSectorsOpacity`), this['addSliderBox']('#theme-minimap', `miniMapNickSize`, 8, 16, 1), this[`addSliderBox`](`#theme-minimap`, `miniMapNickStrokeSize`, 0, 6, 1), this[`addSliderBox`](`#theme-minimap`, `miniMapMyCellSize`, 4, 10, 0.5), this[`addSliderBox`](`#theme-minimap`, `miniMapMyCellStrokeSize`, 0, 10, 1), this[`addSliderBox`](`#theme-minimap`, `miniMapTeammatesSize`, 4, 10, 0.5), this['addSliderBox'](`#theme-minimap`, `miniMapGhostCellsAlpha`, 0.01, 0.99, 0.01), this[`addInputBox`](`#theme-images`, `customBackground`, `Image URL`, `setCustomBackground`), this[`addInputBox`]('#theme-images', `customCursor`, 'Cursor image URL', 'setCustomCursor');
                    for (var e = `https://cdn.ogario.ovh/static/img/cursors/cursor_`, i = 0; i < 35; i++) i < 9 ? this[`addCursorBox`](`#theme-images`, e + '0' + (i + 1) + `.cur`) : this['addCursorBox'](`#theme-images`, e + '' + (i + 1) + `.cur`);
                    s(document)['on'](`click`, `#theme-images .cursor-box a`, function(e) {
                        e.preventDefault();
                        var i = s(`img`, this)['attr'](`src`);
                        g.customCursor = i, t[`setCustomCursor`](), s(`#customCursor`).val(i), s(`#theme-images .cursor-box a`)['removeClass']('active'), s(this)[`addClass`](`active`);
                    }), s(`#theme`).append('<button class=\"btn btn-block btn-success btn-save\"\">' + h[`saveSett`] + `</button>`), s(document)['on'](`click`, `#theme .btn-save`, function(e) {
                        e.preventDefault();
                        var i = s(this);
                        i[`text`](h[`saved`]), t['saveThemeSettings'](), setTimeout(function() {
                            i[`text`](h['saveSett']);
                        }, 500);
                    }), s(`#theme`).append(`<div class=\"restore-settings\"><a href=\"#\">` + h[`restoreThemeSettings`] + '</a></div>'), s(document)['on']('click', `#theme .restore-settings a`, function(e) {
                        e.preventDefault(), t[`restoreThemeSettings`]();
                    }), s(`.skin`).colorpicker({
                        'format': `hex`,
                        'input': `#color`
                    });
                },
                'changePreset': function(t, e) {
                    if (e[t]) {
                        g[t] = t;
                        t = e[t];
                        for (var o in t) t.hasOwnProperty(o) && g.hasOwnProperty(o) && (g[o] = t[o], i.hasOwnProperty(o) && (i[o] = g[o]), s(`#theme .` + o + `-picker`) && s('#theme .' + o + `-picker`).colorpicker('setValue', g[o]), s('#' + o + '-slider') && s('#' + o + `-slider`).val(g[o])[`change`](), (s(`input[type=text]#` + o) || s(`select#` + o)) && s('#' + o).val(g[o]));
                    }
                },
                'changeThemePreset': function(t) {
                    this.changePreset(t, f), this.setTheme();
                },
                'setFonts': function() {
                    this.setFont('namesFont', g.namesFont), this.setFont(`massFont`, g.namesFont), this.setFont(`sectorsFont`, g.sectorsFont);
                },
                'setBgColor': function() {
                    s(`body`).css(`background-color`, g.bgColor);
                },
                'setFoodColor': function() {
                    v['optimizedFood'] && ogarfooddrawer && ogarfooddrawer.preDrawPellet();
                },
                'setIndicatorColor': function() {
                    ogarfooddrawer && ogarfooddrawer.preDrawIndicator();
                },
                'setCustomBackground': function() {
                    g['customBackground'] ? s(`body`).css(`background-image`, `url(` + g[`customBackground`] + ')') : s(`body`)['css'](`background-image`, `none`);
                },
                'setCustomCursor': function() {
                    if (g.customCursor) var t = `*{cursor:url(` + g.customCursor + `), auto !important}`;
                    else t = `*{cursor: auto}`;
                    this.addCustomCSS(`cursorCSS`, t);
                },
                'setMenu': function() {
                    this.setMenuOpacity(), this.setMenuMainColor(), this['setMenuPanelColor'](), this[`setMenuTextColor`](), this[`setMenuButtons`](), this[`setMenuBg`]();
                },
                'changeMenuPreset': function(t) {
                    this.changePreset(t, m), this['setMenu']();
                },
                'setMenuOpacity': function() {
                    s('#helloContainer, #hotkeys, #exp-imp')['css'](`opacity`, g[`menuOpacity`]);
                },
                'setMenuMainColor': function() {
                    var t = '::-moz-selection{background-color:' + g['menuMainColor'] + `!important}::selection{background-color:` + g[`menuMainColor`] + `!important}.menu-main-color,#quick-menu a:hover,.quick,.quick:focus,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs a:hover,.submenu-tabs .active,#stats center,#exp-imp h1{color:` + g[`menuMainColor`] + `}#exp-bar .progress-bar-striped,.quick:hover,.rangeslider__fill{background-color:` + g['menuMainColor'] + '}#main-menu,.agario-side-panel,#hotkeys,#exp-imp{border-color:' + g['menuMainColor'] + `}.ps-scrollbar-y{background-color:` + g[`menuMainColor`] + `!important}`;
                    this.addCustomCSS('menuMainColorCSS', t);
                },
                'setMenuPanelColor': function() {
                    var t = `#main-menu,.agario-side-panel,#hotkeys,#exp-imp{background-color: ` + g['menuPanelColor'] + '}label:hover,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.nick .input-group-btn,.skin .input-group-btn,#stream-mode,#hide-url,.menu-tabs a:hover,.menu-tabs .active,.submenu-tabs,#exp-bar .progress,#quick-menu a:hover,.quick,.select-wrapper,#hotkeys-cfg div.row:hover,#hotkeys-cfg .command-in,#exp-imp-settings textarea,.restore-settings{background-color: ' + g[`menuPanelColor2`] + `}.agario-panel h5,.agario-side-panel h5,#stats h2,.menu-tabs,.submenu-tabs,#skins a.default,#stats hr,#hotkeys-cfg div.row, #exp-imp h1{border-color: ` + g[`menuPanelColor2`] + `}.quick:hover,#skins a,#profiles{color:` + g['menuPanelColor2'] + '}input.stream-mode,input.hide-url{color:' + g['menuPanelColor2'] + `!important}`;
                    this.addCustomCSS(`menuPanelColorCSS`, t);
                },
                'setMenuTextColor': function() {
                    var t = `.agario-panel,.agario-side-panel,.agario-panel input,.agario-panel select,.agario-side-panel input,.agario-side-panel select,.input-group-addon,.dark .yt-username,#stream-mode,#hide-url,.menu-tabs a,.submenu-tabs a,#skins a.default:hover,#quick-menu a,#prev-profile.default:hover,#next-profile.default:hover,#statsText,#hotkeys,#hotkeys-cfg .command-in,#exp-imp{color:` + g[`menuTextColor`] + `}#skins a.default:hover{border-color:` + g[`menuTextColor`] + `}::-webkit-input-placeholder{color:` + g[`menuTextColor2`] + `!important}::-moz-placeholder{color:` + g[`menuTextColor2`] + '!important}#user-id-tag, #version-tag,#statsSubtext,#hotkeys-inst,#exp-imp textarea,.restore-settings a,.restore-settings a:hover{color:' + g[`menuTextColor2`] + `}#hotkeys-cfg .command-in,#theme .color-box{border-color:` + g[`menuTextColor2`] + '}';
                    this.addCustomCSS('menuTextColorCSS', t);
                },
                'setMenuButtons': function() {
                    var t = `a,a:hover{color:` + g[`btn1Color`] + `}.btn,#hotkeys-cfg .custom-key-in{color:` + g[`menuBtnTextColor`] + `}.btn-primary{background-color:` + g[`btn1Color`] + `!important}.btn-primary:active,.btn-primary:disabled,.btn-primary:focus,.btn-primary:hover{background-color:` + g['btn1Color2'] + `!important}.btn-success{background-color:` + g[`btn2Color`] + `!important}.btn-success:active,.btn-success:disabled,.btn-success:focus,.btn-success:hover{background-color:` + g[`btn2Color2`] + '!important}.btn-warning{background-color:' + g[`btn3Color`] + `!important}.btn-warning:active,.btn-warning:disabled,.btn-warning:focus,.btn-warning:hover{background-color:` + g[`btn3Color2`] + `!important}.btn-danger{background-color:` + g[`btn4Color`] + `!important}.btn-danger:active,.btn-danger:disabled,.btn-danger:focus,.btn-danger:hover{background-color:` + g[`btn4Color2`] + `!important}#hotkeys-cfg .custom-key-in{background-color:` + g['btn4Color2'] + `;border-color:` + g[`btn4Color2`] + '}';
                    this.addCustomCSS(`menuButtonsCSS`, t);
                },
                'setMenuBg': function() {
                    s(`#menuBg`).val(g[`menuBg`]), g['menuBg'] ? s(`.menu-panel, .agario-side-panel, #hotkeys, #exp-imp`).css(`background-image`, 'url(' + g[`menuBg`] + ')') : s(`.menu-panel, .agario-side-panel, #hotkeys, #exp-imp`).css(`background-image`, `none`);
                },
                'setHud': function() {
                    this[`setHudColors`](), this[`setHudFont`](), this[`setHudScale`]();
                },
                'setHudColors': function() {
                    var t = `.hud-main-color,#top5-hud a,#target-panel-hud a:hover,#target-panel-hud a.active,#message-menu a{color:` + g[`hudMainColor`] + '}.hud,.hud-b,#chat-emoticons{background-color:' + g[`hudColor`] + '}.hud,.hud-b,#top5-hud a:hover,#target-panel-hud a{color:' + g[`hudTextColor`] + `}.stats-hud-color{color:` + g[`statsHudColor`] + `}.time-hud-color{color:` + g[`timeHudColor`] + `}.top5-mass-color{color:` + g[`top5MassColor`] + `}#leaderboard-positions .me{color:` + g[`lbMeColor`] + `}#leaderboard-positions .teammate{color:` + g[`lbTeammateColor`] + '}';
                    this.addCustomCSS(`hudCSS`, t);
                },
                'setHudFont': function() {
                    this.setFont(`hudFont`, g[`hudFont`]), s(`#overlays-hud`).css({
                        'font-family': g[`hudFontFamily`],
                        'font-weight': g[`hudFontWeight`]
                    });
                },
                'setHudScale': function() {
                    var t = Math['round'](20 * g[`hudScale`]),
                        e = Math[`round`](200 * g['hudScale']),
                        i = Math[`floor`](55 * g[`hudScale`]),
                        o = Math['floor'](6 * g[`hudScale`]),
                        a = Math[`floor`](280 * g[`hudScale`]),
                        n = Math['floor'](85 * g[`hudScale`]),
                        r = Math['floor'](20 * g[`hudScale`]);
                    s(`#overlays-hud`)['css'](`font-size`, t + 'px'), s('#leaderboard-hud, #time-hud')['width'](e), s(`#top5-hud`)[`width`](e + 30).css(`top`, i + 'px'), s(`#top5-pos`).css(`padding-left`, o + 'px'), s(`#time-hud`).css(`top`, a + 'px'), s(`#pause-hud`)['css']('top', n + 'px'), s(`#target-hud`).css(`padding-top`, r + 'px');
                },
                'setChat': function() {
                    this[`setChatColors`](), this[`setChatScale`]();
                },
                'setChatColors': function() {
                    var t = `#message,#messages li,.toast-success{background-color:` + g[`messageColor`] + `}#message,.message-text,.toast-success .message-text{color:` + g[`messageTextColor`] + `}.message-nick,.mute-user,.mute-user:hover,.toast-success .message-nick,.toast .mute-user,.toast .mute-user:hover{color:` + g[`messageNickColor`] + `}.message-time{color:` + g[`messageTimeColor`] + '}.toast-warning{background-color:' + g[`commandsColor`] + `}.command-text,.toast-warning .command-text{color:` + g[`commandsTextColor`] + '}.command-nick,.toast-warning .command-nick,.toast-warning .mute-user,.toast-warning .mute-user:hover{color:' + g[`commandsNickColor`] + `}.command-time{color:` + g[`commandsTimeColor`] + `}#chat-box{background-color:` + g[`chatBoxColor`] + '}';
                    this.addCustomCSS(`chatCSS`, t);
                },
                'setChatScale': function() {
                    var t = Math['round'](14 * g[`chatScale`]),
                        e = Math[`round`](280 * g['chatScale']),
                        i = Math[`round`](350 * g['chatScale']),
                        o = Math['round'](300 * g[`chatScale`]),
                        a = Math[`floor`](14 * g[`chatScale`]);
                    s(`#message-box, #messages, #toast-container, #chat-box`)['css'](`font-size`, t + 'px'), s(`#messages, #toast-container, #chat-box`)[`width`](e), s(`#message-box`)['width'](i), s('#chat-box')[`height`](o), s('.user-list').css(`padding-left`, a + 'px');
                    var n = `#toast-container{width:` + e + `px;font-size:` + t + `px}`;
                    this.addCustomCSS(`chatScaleCSS`, n);
                },
                'setMiniMap': function() {
                    this[`setMiniMapFont`](), this[`setMiniMapWidth`](), this[`setMiniMapSectorsOpacity`]();
                },
                'setMiniMapFont': function() {
                    this.setFont('miniMapFont', g['miniMapFont']), ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                },
                'setMiniMapWidth': function() {
                    var t = g[`miniMapWidth`] / 200;
                    g[`miniMapTop`] = Math[`round`](20 * t), s(`#minimap-hud`).css({
                        'width': g[`miniMapWidth`],
                        'height': g[`miniMapWidth`] + g[`miniMapTop`]
                    }), ogarminimapdrawer && ogarminimapdrawer[`resetMiniMapSectors`]();
                },
                'setMiniMapSectorsColor': function() {
                    ogarminimapdrawer && ogarminimapdrawer['resetMiniMapSectors']();
                },
                'setMiniMapSectorsOpacity': function() {
                    s(`#minimap-sectors`).css(`opacity`, g[`miniMapSectorsOpacity`]);
                },
                'setTheme': function() {
                    this[`setFonts`](), this['setBgColor'](), this[`setCustomBackground`](), this[`setCustomCursor`](), this[`setMenu`](), this[`setHud`](), this[`setChat`](), this[`setMiniMap`]();
                },
                'init': function() {
                    this[`loadThemeSettings`]();
                }
            },
            ogario1PlayerProfiles = [],
            ogarcopythelb = {
                'nick': `I<3Legendmod`,
                'clanTag': 'Ⓜ',
                'skinURL': '',
                'color': g[`mainColor`]
            },
            v = {
                'quickResp': !0,
                'autoResp': !1,
                'autoZoom': !1,
                'autoHideNames': !0,
                'autoHideMass': !0,
                'autoHideFood': !1,
                'autoHideFoodOnZoom': !1,
                'noNames': !1,
                'optimizedNames': !0,
                'hideMyName': !0,
                'hideTeammatesNames': !1,
                'showMass': !0,
                'optimizedMass': !0,
                'shortMass': !0,
                'virMassShots': !0,
                'hideMyMass': !1,
                'hideEnemiesMass': !1,
                'vanillaSkins': !1,
                'customSkins': !0,
                'myTransparentSkin': !1,
                'myCustomColor': !1,
                'transparentCells': !1,
                'transparentViruses': !0,
                'transparentSkins': !1,
                'showGrid': !1,
                'showBgSectors': !1,
                'showMapBorders': !0,
                'showGhostCells': !1,
                'showMiniMap': !0,
                'showMiniMapGrid': !1,
                'showMiniMapGuides': !0,
                'showMiniMapGhostCells': !0,
                'oneColoredTeammates': !1,
                'optimizedFood': !0,
                'rainbowFood': !1,
                'oppColors': !1,
                'oppRings': !1,
                'virColors': !1,
                'splitRange': !1,
                'virusesRange': !1,
                'textStroke': !1,
                'namesStroke': !1,
                'massStroke': !1,
                'cursorTracking': !1,
                'teammatesInd': !1,
                'mouseSplit': !1,
                'mouseFeed': !1,
                'mouseInvert': !1,
                'disableChat': !1,
                'hideChat': !1,
                'chatSounds': !0,
                'chatEmoticons': !0,
                'showChatBox': !1,
                'showChatImages': !0,
                'showChatVideos': !0,
                'showTop5': !0,
                'showTargeting': !0,
                'showLbData': !0,
                'showTime': !0,
                'normalLb': !1,
                'centeredLb': !0,
                'fpsAtTop': !0,
                'showStats': !0,
                'showStatsMass': !0,
                'showStatsSTE': !1,
                'showStatsN16': !1,
                'showStatsFPS': !0,
                'blockPopups': !1,
                'streamMode': !1,
                'hideSkinUrl': !1,
                'showQuickMenu': !0,
                'showSkinsPanel': !0,
                'animation': 140,
                'zoomSpeedValue': 0.9,
                'messageSound': `https://cdn.ogario.ovh/static/sounds/notification_01.mp3`,
                'commandSound': 'https://cdn.ogario.ovh/static/sounds/notification_02.mp3'
            };
        var ogarminimapdrawer = {
            'name': `Legend mod Express v4`,
            'version': `v4 (4.0.0 b35)`,
            'privateMode': !1,
            'protocolMode': !0,
            'publicIP': 'wss://srv.ogario.eu',
            'privateIP': null,
            'updateInterval': 1000,
            'updateTick': 0,
            'updateMaxTick': 2,
            'currentSector': '',
            'miniMap': null,
            'miniMapCtx': null,
            'miniMapSectors': null,
            'pi2': 2 * Math['PI'],
            'socket': null,
            'cells': {},
            'teamPlayers': [],
            'parties': [],
            'chatHistory': [],
            'chatUsers': {},
            'chatMutedUsers': {},
            'chatMutedUserIDs': [],
            'customSkinsCache': {},
            'customSkinsMap': {},
            'cacheQueue': [],
            'deathLocations': [],
            'playerID': null,
            'playerMass': 0,
            'selectedProfile': 0,
            'lastDeath': 0,
            'skipServerData': !1,
            'gameMode': `:ffa`,
            'region': '',
            'partyToken': '',
            'ws': '',
            'serverIP': '',
            'serverArena': '',
            'serverToken': '',
            'lastSentNick': '',
            'lastSentClanTag': null,
            'lastSentSkinURL': '',
            'lastSentCustomColor': '',
            'lastSentPartyToken': '',
            'lastSentServerToken': '',
            'lastMessageSentTime': Date[`now`](),
            'rFps': 0,
            'renderedFrames': 0,
            'fpsLastRequest': null,
            'statsHUD': null,
            'leaderboardPositionsHUD': null,
            'leaderboardDataHUD': null,
            'activeParties': null,
            'top5pos': null,
            'top5totalMass': null,
            'top5totalPlayers': null,
            'top5limit': 5,
            'timeHUD': null,
            'questHUD': null,
            'retryResp': 0,
            'token': `b2dhcmlvLm92aA==`,
            'canvasScale': 1,
            'selectBiggestCell': !0,
            'noColors': !1,
            'skipStats': !1,
            'showQuest': !1,
            'showSplitInd': !1,
            'pause': !1,
            'targetID': 0,
            'targetStatus': 0,
            'targetNick': '',
            'targetSkinURL': '',
            'targeting': !1,
            'privateMiniMap': !1,
            'messageSound': null,
            'commandSound': null,
            'feedInterval': null,
            'getPlayerX': function() {
                return i[`playerX`] + i[`mapOffsetX`];
            },
            'getPlayerY': function() {
                return i[`playerY`] + i[`mapOffsetY`];
            },
            'feed': function() {
                e[`core`] && e[`core`]['eject'] && e[`core`]['eject']();
            },
            'macroFeed': function(t) {
                if (t) {
                    if (this[`feedInterval`]) return;
                    var e = this;
                    this[`feed`](), this[`feedInterval`] = setInterval(function() {
                        e[`feed`]();
                    }, 80);
                } else this[`feedInterval`] && (clearInterval(this[`feedInterval`]), this[`feedInterval`] = null);
            },
            'split': function() {
                e[`core`] && e[`core`][`split`] && e[`core`]['split']();
            },
            'doubleSplit': function() {
                var t = this;
                t[`split`](), setTimeout(function() {
                    t['split']();
                }, 40);
            },
            'popSplit': function() {
                var t = this;
                t[`split`](), setTimeout(function() {
                    t['split']();
                }, 200);
            },
            'split16': function() {
                var t = this;
                t['split'](), setTimeout(function() {
                    t['split']();
                }, 40), setTimeout(function() {
                    t[`split`]();
                }, 80), setTimeout(function() {
                    t[`split`]();
                }, 0x78);
            },
            'toggleSkins': function() {
                i[`vanillaSkins`] && i['customSkins'] ? i[`vanillaSkins`] = !1 : !i[`vannillaSkins`] && i['customSkins'] ? (i[`vanillaSkins`] = !0, i['customSkins'] = !1) : (i['vanillaSkins'] = !0, i[`customSkins`] = !0);
            },
            'toggleCells': function() {
                this[`selectBiggestCell`] = !this[`selectBiggestCell`], i[`selectBiggestCell`] = this[`selectBiggestCell`];
            },
            'setShowTop5': function() {
                v[`showTop5`] = !v[`showTop5`], this[`setTop5`]();
            },
            'setTop5': function() {
                v[`showTop5`] ? s(`#top5-hud`)[`show`]() : s(`#top5-hud`)[`hide`]();
            },
            'setShowTargeting': function() {
                v[`showTargeting`] = !v[`showTargeting`], this[`setTargetingHUD`]();
            },
            'setTargetingHUD': function() {
                v[`showTargeting`] ? s(`#target-hud, #target-panel-hud`)[`show`]() : s('#target-hud, #target-panel-hud')[`hide`]();
            },
            'setShowTime': function() {
                v[`showTime`] = !v[`showTime`], v[`showTime`] ? (s(`#time-hud`)[`show`](), this[`displayTime`]()) : s(`#time-hud`)[`hide`]();
            },
            'setShowSplitRange': function() {
                v[`splitRange`] = !v['splitRange'], i[`splitRange`] = v[`splitRange`];
            },
            'setShowSplitInd': function() {
                this[`showSplitInd`] = !this['showSplitInd'], v['splitRange'] = this[`showSplitInd`], v[`oppRings`] = this['showSplitInd'], i[`splitRange`] = v['splitRange'], i[`oppRings`] = v[`oppRings`];
            },
            'setShowTeammatesInd': function() {
                v[`teammatesInd`] = !v[`teammatesInd`];
            },
            'setShowOppColors': function() {
                v[`oppColors`] = !v[`oppColors`], i[`oppColors`] = v[`oppColors`];
            },
            'setShowSkins': function() {
                this[`noSkins`] = !this[`noSkins`], e[`core`] && e[`core`][`setSkins`] && e[`core`][`setSkins`](!this[`noSkins`]), i[`showCustomSkins`] = !this[`noSkins`], this[`displayChatInfo`](!this[`noSkins`], `showSkinsMsg`);
            },
            'setTransparentSkins': function() {
                v[`transparentSkins`] = !v[`transparentSkins`], i['transparentSkins'] = v[`transparentSkins`];
            },
            'setShowStats': function() {
                s('#stats-hud')[`toggle`]();
            },
            'setShowFood': function() {
                i[`showFood`] = !i[`showFood`];
            },
            'setShowHUD': function() {
                s(`#overlays-hud`)['toggle']();
            },
            'setShowGrid': function() {
                v[`showGrid`] = !v[`showGrid`];
            },
            'setShowMiniMapGuides': function() {
                v['showMiniMapGuides'] = !v[`showMiniMapGuides`];
            },
            'setShowLb': function() {
                `:teams` !== this[`gameMode`] && s(`#leaderboard-hud`)[`toggle`]();
            },
            'setShowBgSectors': function() {
                v[`showBgSectors`] = !v[`showBgSectors`];
            },
            'setHideSmallBots': function() {
                i[`hideSmallBots`] = !i[`hideSmallBots`], this[`displayChatInfo`](!i['hideSmallBots'], `hideSmallBotsMsg`);
            },
            'setShowNames': function() {
                v[`noNames`] = !v[`noNames`];
            },
            'setHideTeammatesNames': function() {
                v[`hideTeammatesNames`] = !v[`hideTeammatesNames`];
            },
            'setShowMass': function() {
                v[`showMass`] = !v[`showMass`];
            },
            'setShowMiniMap': function() {
                v[`showMiniMap`] = !v['showMiniMap'], this['setMiniMap']();
            },
            'setMiniMap': function() {
                v['showMiniMap'] ? s(`#minimap-hud`)[`show`]() : s(`#minimap-hud`)['hide']();
            },
            'setShowQuest': function() {
                `:ffa` === this[`gameMode`] && (this[`showQuest`] = !this[`showQuest`], this[`setQuest`]());
            },
            'setQuest': function() {
                this[`showQuest`] && `:ffa` === this[`gameMode`] ? s(`#quest-hud`)['show']() : s(`#quest-hud`)[`hide`]();
            },
            'toggleAutoZoom': function() {
                i[`autoZoom`] = !i[`autoZoom`], this[`displayChatInfo`](i[`autoZoom`], 'autoZoomMsg');
            },
            'resetZoom': function(t) {
                t ? (i[`zoomResetValue`] = 1, i[`zoomValue`] = 1) : i['zoomResetValue'] = 0;
            },
            'setZoom': function(t) {
                i[`zoomValue`] = t;
            },
            'toggleDeath': function() {
                this['lastDeath']--, this[`lastDeath`] < 0 && (this[`lastDeath`] = this[`deathLocations`][`length`] - 1);
            },
            'tryResp': function() {
                if (i['play'] || 20 == this['retryResp']) this['retryResp'] = 0;
                else {
                    this['retryResp']++;
                    var t = this;
                    setTimeout(function() {
                        s('.btn-play-guest')['is'](`:visible`) ? s(`.btn-play-guest`)[`click`]() : s('.btn-play')[`click`](), i[`play`] || t[`tryResp`]();
                    }, 500);
                }
            },
            'quickResp': function() {
                v[`quickResp`] && (this[`hideMenu`](), this[`gameServerConnect`](this['ws']), i[`play`] = !1, this['tryResp']());
            },
            'autoResp': function() {
                v[`autoResp`] && (this[`setAutoResp`](), s('#overlays')[`stop`]()[`hide`](), s(`.btn-play-guest`)['is'](`:visible`) ? s('.btn-play-guest')[`click`]() : s(`.btn-play`)[`click`]());
            },
            'setAutoResp': function() {
                v[`autoResp`] && (s(`#skipStats`)[`prop`](`checked`) || (s(`#skipStats`)[`click`](), this[`skipStats`] = !0));
            },
            'toggleAutoResp': function() {
                v[`autoResp`] = !v[`autoResp`], this[`setAutoResp`](), this[`displayChatInfo`](v[`autoResp`], `autoRespMsg`);
            },
            'copyLb': function() {
                var t = s(`<input>`);
                s(`body`).append(t), t.val(s(`#leaderboard-positions`)['text']())[`select`]();
                try {
                    document[`execCommand`]('copy');
                } catch (ogarcopierlbcather) {}
                t[`remove`]();
            },
            'setPause': function() {
                this[`pause`] = !this[`pause`], i[`pause`] = this[`pause`], this['pause'] ? (i['resetTargetPosition'](), s(`#pause-hud`)[`show`]()) : s(`#pause-hud`)[`hide`]();
            },
            'setCenteredLb': function() {
                v[`centeredLb`] ? s(`#leaderboard-hud`)[`addClass`](`hud-text-center`) : s(`#leaderboard-hud`)['removeClass'](`hud-text-center`);
            },
            'setNormalLb': function() {
                v[`normalLb`] ? s(`#leaderboard-hud h4`)[`html`](h[`leaderboard`]) : s(`#leaderboard-hud h4`)[`html`](`ogario.ovh`);
            },
            'setFpsAtTop': function() {
                v[`fpsAtTop`] ? s(`#stats-hud`)[`removeClass`](`hud-bottom`)[`addClass`](`hud-top`) : s(`#stats-hud`)[`removeClass`](`hud-top`)['addClass'](`hud-bottom`);
            },
            'setBlockPopups': function() {
                this[`protocolMode`] ? s(`#block-warn`)[`hide`]() : v[`blockPopups`] ? this[`blockPopups`]() : this[`unblockPopups`]();
            },
            'blockPopups': function() {
                s(`#openfl-content, #openfl-overlay`)[`hide`](), s(`#openfl-content, #openfl-overlay`)[`addClass`](`block-popups`), s('#freeCoins, #gifting, #openShopBtn, #dailyQuests')[`prop`](`disabled`, !0), s(`#block-warn`)[`show`]();
            },
            'unblockPopups': function() {
                s(`#openfl-overlay.disabler`)['click'](), s('#openfl-content, #openfl-overlay')[`hide`](), s(`#openfl-content, #openfl-overlay`)['removeClass']('block-popups'), s(`#freeCoins, #gifting, #openShopBtn, #dailyQuests`)[`prop`](`disabled`, !1), s(`#block-warn`)[`hide`]();
            },
            'tempUnblockPopups': function() {
                v[`blockPopups`] && this[`unblockPopups`]();
            },
            'displayLeaderboard': function(t, e = '') {
                this[`leaderboardPositionsHUD`] && (this[`leaderboardPositionsHUD`][`innerHTML`] = t, this[`leaderboardDataHUD`][`innerHTML`] = e);
            },
            'displayStats': function() {
                if (v[`showStats`]) {
                    var t = '';
                    i[`play`] && (v[`showStatsMass`] && i[`playerMass`] && (t += h[`mass`] + ': ' + i[`playerMass`] + ` | `), i[`playerScore`] && (t += h[`score`] + ': ' + i['playerScore']), v['showStatsSTE'] && i[`STE`] && (t += ` | STE: ` + i['STE']), v[`showStatsN16`] && i[`playerSplitCells`] && (t += ` | ` + i[`playerSplitCells`] + '/16'), v[`showStatsFPS`] && (t += ' | ')), v[`showStatsFPS`] && (t += `FPS: ` + ogarfooddrawer[`fps`]), this[`statsHUD`][`textContent`] = t;
                    var e = this;
                    setTimeout(function() {
                        e[`displayStats`]();
                    }, 250);
                } else s('#stats-hud')[`hide`]();
            },
            'displayTime': function() {
                if (v[`showTime`]) {
                    var t = new Date()[`toLocaleString`]();
                    this['timeHUD'][`textContent`] = t;
                    var e = this;
                    setTimeout(function() {
                        e[`displayTime`]();
                    }, 1000);
                } else s(`#time-hud`)[`hide`]();
            },
            'displayParties': function() {
                for (var t = '', e = 0; e < this[`parties`]['length']; e++) t += `<li><a href=\"https://agar.io/#` + this[`parties`][e] + `\" onclick=\"$(\'#party-token\').val(\'` + this[`parties`][e] + '\'); $(\'#join-party-btn-2\').click();\">https://agar.io/#' + this[`parties`][e] + `</a></li>`;
                this[`activeParties`][`className`] = '' === t ? `no-parties` : '', this[`activeParties`]['innerHTML'] = t;
            },
            'displayTop5': function() {
                if (v['showTop5']) {
                    for (var t = '', e = 0, s = this[`top5`][`length`], o = 0; o < s; o++) e += this[`top5`][o][`mass`], o >= this['top5limit'] || (t += `<li><span class=\"cell-counter\" style=\"background-color: ` + this[`top5`][o][`color`] + '\">' + (o + 1) + `</span>`, v[`showTargeting`] && (t += `<a href=\"#\" data-user-id=\"` + this[`top5`][o]['id'] + `\" class=\"set-target ogicon-target\"></a> `), t += `<span class=\"hud-main-color\">[` + this[`calculateMapSector`](this[`top5`][o]['x'], this[`top5`][o]['y']) + `]</span>`, t += `<span class=\"top5-mass-color\">[` + this[`shortMassFormat`](this[`top5`][o][`mass`]) + `]</span> ` + this[`escapeHTML`](this[`top5`][o][`nick`]) + `</li>`);
                    this[`top5pos`]['innerHTML'] = t, i['play'] && i[`playerMass`] && (e += i[`playerMass`], s++), this[`top5totalMass`][`textContent`] = this[`shortMassFormat`](e), this[`top5totalPlayers`][`textContent`] = s;
                }
            },
            'setTop5limit': function(t) {
                t && (this[`top5limit`] = t);
            },
            'displayChatHistory': function(t) {
                if (t) {
                    this[`clearChatHistory`](!0);
                    for (var e = 0; e < this[`chatHistory`][`length`]; e++) s(`#messages`).append(`<li><span class=\"message-nick\">` + this[`chatHistory`][e][`nick`] + `: </span><span class=\"message-text\">` + this['chatHistory'][e][`message`] + `</span></li>`);
                } else this[`clearChatHistory`](!1);
            },
            'clearChatHistory': function(t) {
                s(`#messages`)[`empty`](), t && (toastr[`clear`](), v[`showChatBox`] && (s(`#chat-box .message`)[`remove`](), this[`chatHistory`]['length'] = 0));
            },
            'displayChatInfo': function(t, e) {
                t ? toastr['info'](h[e + 'A']) : toastr['error'](h[e + 'B']);
            },
            'setDisableChat': function() {
                v[`hideChat`] = v[`disableChat`], this[`setHideChat`]();
            },
            'hideChat': function() {
                v['hideChat'] = !v[`hideChat`], this[`setHideChat`](), this[`displayChatInfo`](!v[`hideChat`], 'hideChatMsg');
            },
            'setHideChat': function() {
                v['hideChat'] && s('#message-box')[`hide`](), this[`setShowChatBox`]();
            },
            'setShowChatBox': function() {
                !v[`hideChat`] && v[`showChatBox`] ? s(`#chat-box`)['show']() : s(`#chat-box`)[`hide`]();
            },
            'enterChatMessage': function() {
                var t = s(`#message-box`),
                    e = s('#message');
                if (t['is'](`:visible`)) {
                    var o = e.val();
                    o['length'] ? (this[`sendChatMessage`](101, o), i[`play`] && (e[`blur`](), t[`hide`]())) : (e[`blur`](), t[`hide`]()), e.val('');
                } else t[`show`](), e['focus'](), e.val('');
            },
            'showMenu': function(t) {
                if (e['MC'] && e['MC'][`showNickDialog`]) return s('.ogario-menu')[`show`](), s(`.menu-panel`)['hide'](), i[`play`] || this['skipStats'] ? s('#main-panel')[`show`]() : s(`#stats`)['show'](), e['MC']['showNickDialog'](300), s(`#oferwallContainer`)['is'](`:visible`) && e[`closeOfferwall`](), void(s(`#videoContainer`)['is'](`:visible`) && e[`closeVideoContainer`]());
                t ? s(`#overlays`)[`fadeIn`](t) : s(`#overlays`)[`show`]();
            },
            'hideMenu': function(t) {
                e['MC'] && e['MC'][`showNickDialog`] ? s(`.ogario-menu`)[`hide`]() : t ? s(`#overlays`)[`fadeOut`](t) : s(`#overlays`)[`hide`]();
            },
            'escapeHTML': function(t) {
                return String(t)[`replace`](/[&<>"'\/]/g, function(t) {
                    return u[t];
                });
            },
            'checkSkinURL': function(t) {
                return /^https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png)\??\d*$/i [`test`](t) ? t[`replace`](`http:`, `https:`) : '';
            },
            'loadSettings': function() {
                var t = null;
                for (var s in null !== e.localStorage.getItem(`ogarioSettings`) && (t = JSON.parse(e.localStorage.getItem('ogarioSettings'))), v) v.hasOwnProperty(s) && (t && t.hasOwnProperty(s) && (v[s] = t[s]), i.hasOwnProperty(s) && (i[s] = v[s]));
            },
            'saveSettings': function(t, i) {
                e.localStorage.setItem(i, JSON['stringify'](t));
            },
            'exportSettings': function() {
                var t = {
                    'ogarioCommands': c,
                    'ogarioHotkeys': ogario1Hotkeys,
                    'ogarioPlayerProfiles': ogario1PlayerProfiles,
                    'ogarioSettings': v,
                    'ogarioThemeSettings': g
                };
                for (var e in t) {
                    if (t.hasOwnProperty(e)) s(`#export-` + e)['prop'](`checked`) || delete t[e];
                }
                t = JSON.stringify(t), s('#export-settings').val(t), s(`#import-settings`).val(''), t = null;
            },
            'importSettings': function() {
                s(`#import-settings`)[`blur`]();
                var t = s(`#import-settings`).val();
                if (t) {
                    for (var i in t = JSON.parse(t))
                        if (t.hasOwnProperty(i)) {
                            if (!s(`#import-` + i)[`prop`](`checked`)) continue;
                            e.localStorage.setItem(i, JSON.stringify(t[i]));
                        } e['location'].reload();
                }
            },
            'restoreSettings': function() {
                null !== e.localStorage['getItem'](`ogarioSettings`) && (e.localStorage.removeItem(`ogarioSettings`), e['location'].reload());
            },
            'setSettings': function(t, e) {
                if (v.hasOwnProperty(t) && null !== e) {
                    switch (v[t] = e, i.hasOwnProperty(t) && (i[t] = e), t) {
                        case `autoResp`:
                            this[`setAutoResp`]();
                            break;
                        case 'showMiniMap':
                            this[`setMiniMap`]();
                            break;
                        case `showMiniMapGrid`:
                            this['resetMiniMapSectors']();
                            break;
                        case `disableChat`:
                            this['setDisableChat']();
                            break;
                        case `chatSounds`:
                            this[`setChatSoundsBtn`]();
                            break;
                        case `showChatBox`:
                            this[`setShowChatBox`]();
                            break;
                        case `showTop5`:
                            this[`setTop5`]();
                            break;
                        case 'showTargeting':
                            this['setTargetingHUD']();
                            break;
                        case `showTime`:
                            this[`displayTime`](), s(`#time-hud`)['show']();
                            break;
                        case `centeredLb`:
                            this[`setCenteredLb`]();
                            break;
                        case `normalLb`:
                            this[`setNormalLb`]();
                            break;
                        case `fpsAtTop`:
                            this[`setFpsAtTop`]();
                            break;
                        case `showStats`:
                            this[`displayStats`](), s(`#stats-hud`)[`show`]();
                            break;
                        case `blockPopups`:
                            this['setBlockPopups']();
                    }
                    this[`saveSettings`](v, `ogarioSettings`);
                }
            },
            'loadProfiles': function() {
                if (null !== e.localStorage.getItem(`ogarioPlayerProfiles`)) ogario1PlayerProfiles = JSON.parse(e.localStorage['getItem'](`ogarioPlayerProfiles`));
                else
                    for (var t = 0; t < 10; t++) ogario1PlayerProfiles[`push`]({
                        'nick': `Profile #` + (t + 1),
                        'clanTag': '',
                        'skinURL': '',
                        'color': g['mainColor']
                    });
                null !== e.localStorage.getItem(`ogarioSelectedProfile`) && (this[`selectedProfile`] = JSON['parse'](e.localStorage.getItem('ogarioSelectedProfile'))), ogarcopythelb[`nick`] = ogario1PlayerProfiles[this[`selectedProfile`]][`nick`], ogarcopythelb[`clanTag`] = ogario1PlayerProfiles[this['selectedProfile']][`clanTag`], ogarcopythelb[`skinURL`] = ogario1PlayerProfiles[this['selectedProfile']]['skinURL'], ogarcopythelb[`color`] = ogario1PlayerProfiles[this[`selectedProfile`]][`color`];
            },
            'changeSkinPreview': function(t, e) {
                t && e && ('skin-preview' === e ? (s('#skin-preview')[`removeClass`](`default`).append(`<a href=\"#\" id=\"skin-popover\" data-toggle=\"popover\" title=\"\" data-html=\"true\" data-content=\"<img src=\'` + t['src'] + `\' width=\'500\'>\"></a>`), s('#skin-popover').append(s(t)[`fadeIn`](1000)), s(`#skin-popover`)[`popover`]()) : s('#' + e)[`removeClass`](`default`).append(s(t)[`fadeIn`](1000)));
            },
            'setSkinPreview': function(t, e) {
                if (s('#' + e)[`empty`]()[`addClass`](`default`), t && 0 != t[`length`]) {
                    var i = this,
                        o = new Image();
                    o[`crossOrigin`] = 'Anonymous', o[`onload`] = function() {
                        i[`changeSkinPreview`](o, e);
                    }, o[`src`] = t;
                }
            },
            'setProfile': function() {
                var t = (ogario1PlayerProfiles[`length`] + this['selectedProfile'] - 1) % ogario1PlayerProfiles[`length`],
                    e = (this[`selectedProfile`] + 1) % ogario1PlayerProfiles[`length`];
                this[`setSkinPreview`](ogario1PlayerProfiles[t][`skinURL`], 'prev-profile'), this['setSkinPreview'](ogario1PlayerProfiles[this['selectedProfile']][`skinURL`], `skin-preview`), this[`setSkinPreview`](ogario1PlayerProfiles[e][`skinURL`], `next-profile`), this[`saveSettings`](this[`selectedProfile`], `ogarioSelectedProfile`), s(`#nick`).val(ogario1PlayerProfiles[this[`selectedProfile`]][`nick`]), s(`#clantag`)['val'](ogario1PlayerProfiles[this[`selectedProfile`]]['clanTag']), s(`#skin`).val(ogario1PlayerProfiles[this['selectedProfile']]['skinURL']), s('#color').val(ogario1PlayerProfiles[this['selectedProfile']][`color`]), s(`.skin`)['colorpicker'](`setValue`, ogario1PlayerProfiles[this[`selectedProfile`]][`color`]), s(`#skins a`)[`removeClass`](`selected`), s(`#skins a[data-profile=\'` + this['selectedProfile'] + '\']')[`addClass`]('selected');
            },
            'prevProfile': function() {
                this[`setPlayerSettings`](), this[`selectedProfile`] = (ogario1PlayerProfiles[`length`] + this[`selectedProfile`] - 1) % ogario1PlayerProfiles[`length`], this[`setProfile`]();
            },
            'nextProfile': function() {
                this[`setPlayerSettings`](), this['selectedProfile'] = (this['selectedProfile'] + 1) % ogario1PlayerProfiles[`length`], this['setProfile']();
            },
            'selectProfile': function(t) {
                this[`setPlayerSettings`](), this['selectedProfile'] = parseInt(t), this[`setProfile`]();
            },
            'addOption': function(t, e, i, o) {
                s(t).append(`<label><input type=\"checkbox\" id=\"` + e + `\" class=\"js-switch\"> ` + i + `</label>`), s('#' + e)[`prop`](`checked`, o);
            },
            'addOptions': function(t, e) {
                if (t) {
                    s(`#og-options`).append(`<div class=\"options-box ` + e + '\"><h5 class=\"menu-main-color\">' + h[e] + '</h5></div>');
                    for (var i = 0; i < t['length']; i++) {
                        var o = t[i];
                        v.hasOwnProperty(o) && (s('.' + e).append(`<label>` + h[o] + ` <input type=\"checkbox\" class=\"js-switch\" id=\"` + o + `\"></label>`), s('#' + o)[`prop`]('checked', v[o]));
                    }
                }
            },
            'addInputBox': function(t, e, i, o) {
                s(t).append('<div class=\"input-box\"><span class=\"title-box\">' + h[e] + `</span><input id=\"` + e + '\" class=\"form-control\" placeholder=\"' + i + `\" value=\"` + v[e] + `\" /></div>`);
                var a = this;
                s('#' + e)['on'](`input`, function() {
                    v[e] = this.value, a[o](), a[`saveSettings`](v, `ogarioSettings`);
                });
            },
            'addSliderBox': function(t, e, o, a, n, r) {
                s(t).append(`<div class=\"slider-box\"><div class=\"box-label\"><span class=\"value-label\">` + h[e] + ': </span><span id=\"' + e + `-value\" class=\"value\">` + v[e] + '</span></div><input id=\"' + e + `-slider\" type=\"range\" min=\"` + o + `\" max=\"` + a + '\" step=\"' + n + `\" value=\"` + v[e] + `\"></div>`);
                var l = this;
                r ? s('#' + e + `-slider`)['on'](`input`, function() {
                    var t = parseFloat(s(this)['val']());
                    s('#' + e + '-value')[`text`](t), v[e] = t, i.hasOwnProperty(e) && (i[e] = t), l[r](), l[`saveSettings`](v, 'ogarioSettings');
                }) : s('#' + e + `-slider`)['on'](`input`, function() {
                    var t = parseFloat(s(this).val());
                    s('#' + e + `-value`)[`text`](t), v[e] = t, i.hasOwnProperty(e) && (i[e] = t), l['saveSettings'](v, 'ogarioSettings');
                });
            },
            'setLang': function() {
                if ('pl' === r && e[`i18n_dict`] && e['i18n_dict']['en'])
                    for (var t in e[`i18n_dict`]['en']) e[`i18n_dict`]['en'].hasOwnProperty(t) && h.hasOwnProperty(t) && (e[`i18n_dict`]['en'][t] = h[t]);
            },
            'setMenu': function() {
                for (var t in document[`title`] = this[`name`], s(`#mainPanel`)[`before`](`<div id=\"exp-bar\" class=\"agario-panel\"><span class=\"ogicon-user\"></span><div class=\"agario-exp-bar progress\"><span class=\"progress-bar-text\"></span><div class=\"progress-bar progress-bar-striped\" style=\"width: 0%;\"></div></div><div class=\"progress-bar-star\"></div></div><div id=\"main-menu\" class=\"agario-panel\"><ul class=\"menu-tabs\"><li class=\"start-tab active\"><a href=\"#main-panel\" class=\"active ogicon-home\" data-toggle=\"tab-tooltip\" title=\"` + h[`start`] + `\"></a></li><li class=\"profile-tab\"><a href=\"#profile\" class=\"ogicon-user\" data-toggle=\"tab-tooltip\" title=\"` + h[`profile`] + `\"></a></li><li class=\"settings-tab\"><a href=\"#og-settings\" class=\"ogicon-cog\" data-toggle=\"tab-tooltip\" title=\"` + h[`settings`] + `\"></a></li><li class=\"theme-tab\"><a href=\"#theme\" class=\"ogicon-droplet\" data-toggle=\"tab-tooltip\" title=\"` + h[`theme`] + '\"></a></li><li class=\"hotkeys-tab\"><a href=\"#\" class=\"hotkeys-link ogicon-keyboard\" data-toggle=\"tab-tooltip\" title=\"' + h[`hotkeys`] + '\"></a></li><li class=\"music-tab\"><a href=\"#music\" class=\"ogicon-music\" data-toggle=\"tab-tooltip\" title=\"Radio / ' + h[`sounds`] + `\"></a></li></ul><div id=\"main-panel\" class=\"menu-panel\"></div><div id=\"profile\" class=\"menu-panel\"></div><div id=\"og-settings\" class=\"menu-panel\"><div class=\"submenu-panel\"></div></div><div id=\"theme\" class=\"menu-panel\"></div><div id=\"music\" class=\"menu-panel\"></div></div>`), s(`#main-panel`).append(`<a href=\"#\" class=\"quick quick-menu ogicon-menu\"></a><a href=\"#\" class=\"quick quick-skins ogicon-images\"></a><div id=\"profiles\"><div id=\"prev-profile\"></div><div id=\"skin-preview\"></div><div id=\"next-profile\"></div></div>`), s(`#mainPanel div[role=form]`)['appendTo'](s(`#main-panel`)), s(`#main-panel div[role=form] .form-group:first`)['remove'](), s(`#nick`)[`before`](`<input id=\"clantag\" class=\"form-control\" placeholder=\"Tag, e.g. Ⓜ\" maxlength=\"10\"><div class=\"input-group nick\"></div>`), s(`#nick`)[`appendTo`](s('.nick')), s(`.nick`).append(`<span class=\"input-group-btn\"><button id=\"stream-mode\" class=\"btn active ogicon-eye\"></button></span>`), s('.nick')[`after`](`<div class=\"input-group skin\"><input id=\"skin\" class=\"form-control\" placeholder=\"Skin URL (imgur.com direct link)\" maxlength=\"40\"><input type=\"hidden\" id=\"color\" value=\"` + ogarcopythelb[`color`] + '\" maxlength=\"7\" /><span class=\"input-group-addon\"><i></i></span><span class=\"input-group-btn\"><button id=\"hide-url\" class=\"btn active ogicon-eye\"></button></span></div>'), s(`#locationKnown, #locationUnknown`)[`insertAfter`](s('.skin')), s(`#region`)['before'](`<button class=\"btn btn-warning btn-server-info ogicon-cogs\"></button>`), s(`.btn-spectate, .btn-logout`)[`appendTo`]('#agario-main-buttons'), s(`#agario-main-buttons`)[`addClass`](`clearfix`)[`before`](`<div id=\"server-info\" class=\"form-group clearfix\"><input id=\"server-ws\" class=\"form-control\" placeholder=\"Server WS\"><button id=\"server-connect\" class=\"btn btn-success ogicon-power\"></button><button id=\"server-reconnect\" class=\"btn btn-primary ogicon-redo2\"></button><input id=\"server-token\" class=\"form-control\" placeholder=\"Server token\"><button id=\"server-join\" class=\"btn btn-success\" data-itr=\"page_join_party\">Join</button></div>`), s(`#helloContainer div[role=form]`)[`after`](`<div id=\"ogario-party\" class=\"clearfix\"><input id=\"party-token\" class=\"form-control\" placeholder=\"Party token\"></div>`), s(`#ogario-party`).append('<button id=\"join-party-btn-2\" class=\"btn btn-success\" data-itr=\"page_join_party\">Join</button><button id=\"create-party-btn-2\" class=\"btn btn-primary\" data-itr=\"page_create_party\">Create</button>'), s('#pre-join-party-btn:first, #join-party-btn:first, #create-party-btn:first, #leave-party-btn:first, #joinPartyToken:first, .party-icon-back:first')[`appendTo`](s('#ogario-party')), s('#settingsChoice, #options')[`appendTo`](s(`#og-settings .submenu-panel`)), s('#stats')[`appendTo`](s(`#main-menu`))[`addClass`](`menu-panel`), s('#statsContinue')[`attr`]('id', 'statsContinue2'), s('#mainPanel')[`empty`]()[`remove`](), s(`.center-container`)[`addClass`](`ogario-menu`), s(`.center-container`).append(`<div id=\"menu-footer\" class=\"menu-main-color\">` + h[`visit`] + ` <a href=\"http://legendmod.ml\" target=\"_blank\">legendmod.ml</a> | ` + this[`version`] + ' <a href=\"https://goo.gl/nRREoR\" class=\"release ogicon-info\" target=\"_blank\"></a></div>'), s(`#leftPanel, #rightPanel`)[`addClass`](`ogario-menu`)[`removeAttr`]('id'), s(`.agario-profile-panel, .agario-panel-freecoins, .agario-panel-gifting, .agario-shop-panel, #dailyquests-panel`)[`appendTo`](s(`#profile`))['removeClass'](`agario-side-panel`), s(`.agario-profile-panel`)[`after`](`<div id=\"block-warn\">` + h[`blockWarn`] + '<br><a href=\"#\" id=\"unblock-popups\">' + h[`unblockPopups`] + `</a></div>`), s(`#exp-bar`)[`addClass`](`agario-profile-panel`), s(`.left-container`)[`empty`](), s(`.agario-shop-panel`)[`after`]('<div class=\"agario-panel ogario-yt-panel\"><h5 class=\"menu-main-color\">Team OGARio (tag: Ⓜ)</h5><div class=\"g-ytsubscribe\" data-channelid=\"UCaWiPNJWnhzYDrBQoXokn6w\" data-layout=\"full\" data-theme=\"dark\" data-count=\"default\"></div></div>'), s(`#tags-container`)[`appendTo`](s('#profile')), s('.btn-logout')[`appendTo`](s(`#profile`)), s('.left-container').append(`<div id=\"quick-menu\" class=\"agario-panel agario-side-panel\"><a href=\"https://ogario.ovh/skins/\" class=\"quick-more-skins ogicon-grin\" target=\"_blank\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + h[`skins`] + `\"></a><a href=\"https://youtube.com/channel/UCaWiPNJWnhzYDrBQoXokn6w\" class=\"quick-yt ogicon-youtube2\" target=\"_blank\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"Team OGARio\"></a></div>`), this['protocolMode'] || s(`#quick-menu`)[`prepend`](`<a href=\"#\" class=\"quick-shop ogicon-cart\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + h[`page_shop`] + `\"></a><a href=\"#\" class=\"quick-free-coins ogicon-coin-dollar\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + h[`page_menu_main_free_coins`] + `\"></a><a href=\"#\" class=\"quick-free-gifts ogicon-gift\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + h[`page_menu_main_gifts`] + `\"></a><a href=\"#\" class=\"quick-quests ogicon-trophy\" data-toggle=\"tab-tooltip\" data-placement=\"left\" title=\"` + h[`page_menu_main_dailyquests`] + `\"></a>`), s(`.party-dialog, .partymode-info`)[`remove`](), s(`.agario-party-6`)['appendTo'](s(`.center-container`)), s(`.right-container`)[`empty`](), s(`.right-container`).append(`<div class=\"agario-party\"></div>`), s(`.agario-party-6`)[`appendTo`](s(`.agario-party`))[`addClass`](`agario-panel agario-side-panel`), s(`.agario-party h4, #cancel-party-btn`)[`remove`](), s(`.agario-party .btn`)[`addClass`](`btn-sm`), s(`.right-container`).append(`<div id=\"skins-panel\" class=\"agario-panel agario-side-panel\"><div id=\"skins\"></div><a href=\"https://ogario.ovh/skins/\" id=\"more-skins\" class=\"btn btn-block btn-success\" target=\"_blank\">` + h[`moreSkins`] + `</a></div>`), s(`.btn-settings, .text-muted, .tosBox, .agario-promo, #agario-web-incentive, span[data-itr=\'page_option_dark_theme\'], #options #darkTheme`)['remove'](), s(`#advertisement, #adbg, #a320x250, #g320x250, #s320x250, #adsBottom`).css('display', `none`), s(`#advertisement`)[`removeClass`](`agario-panel`), s(`#adsBottom`)['css']({
                        'z-index': '1',
                        'opacity': '0',
                        'bottom': `-100px`
                    }), s(`#noNames, #showMass`)[`remove`](), s(`#og-settings .submenu-panel`).append(`<div id=\"og-options\"></div>`), this['addOptions']([], `animationGroup`), this[`addOptions`]([`autoZoom`], `zoomGroup`), this[`addOptions`]([`quickResp`, `autoResp`], `respGroup`), this[`addOptions`]([`noNames`, `optimizedNames`, `autoHideNames`, `hideMyName`, `hideTeammatesNames`, `namesStroke`], 'namesGroup'), this[`addOptions`]([`showMass`, `optimizedMass`, `autoHideMass`, 'hideMyMass', 'hideEnemiesMass', `shortMass`, `virMassShots`, `massStroke`], 'massGroup'), this['protocolMode'] ? this['addOptions']([`customSkins`], `skinsGroup`) : this[`addOptions`]([`customSkins`, 'vanillaSkins'], 'skinsGroup'), this[`addOptions`](['optimizedFood', `autoHideFood`, 'autoHideFoodOnZoom', `rainbowFood`], `foodGroup`), this[`addOptions`]([`myCustomColor`, `myTransparentSkin`, `transparentSkins`, `transparentCells`, `transparentViruses`], `transparencyGroup`), this[`addOptions`]([`showGrid`, 'showBgSectors', `showMapBorders`], 'gridGroup'), this[`addOptions`]([`disableChat`, `chatSounds`, `chatEmoticons`, 'showChatImages', `showChatVideos`, `showChatBox`], `chatGroup`), this['addOptions'](['showMiniMap', `showMiniMapGrid`, `showMiniMapGuides`, `showMiniMapGhostCells`, 'oneColoredTeammates'], `miniMapGroup`), this[`addOptions`]([`oppColors`, `oppRings`, `virColors`, `splitRange`, 'virusesRange', `cursorTracking`, 'teammatesInd', `showGhostCells`], 'helpersGroup'), this[`addOptions`]([`mouseSplit`, `mouseFeed`, 'mouseInvert'], `mouseGroup`), this[`addOptions`]([`showTop5`, 'showTargeting', `showLbData`, 'centeredLb', `normalLb`, `fpsAtTop`], `hudGroup`), this[`addOptions`](['showStats', `showStatsMass`, `showStatsSTE`, 'showStatsN16', `showStatsFPS`, `showTime`], `statsGroup`), this['protocolMode'] || (this[`addOptions`]([`blockPopups`], `extrasGroup`), s(`#noSkins, #noColors, #skipStats, #showQuest`)[`addClass`](`js-switch-vanilla`), s(`.skinsGroup h5`)['after'](`<label class=\"noSkins\">` + h[`noSkins`] + ' </label>'), s(`#noSkins`)[`appendTo`](s(`.noSkins`)), s(`.transparencyGroup h5`)[`after`](`<label class=\"noColors\">` + h[`noColors`] + ` </label>`), s(`#noColors`)[`appendTo`](s(`.noColors`)), s(`.extrasGroup h5`)[`after`](`<label class=\"skipStats\">` + h[`skipStats`] + ' </label>'), s(`#skipStats`)[`appendTo`](s(`.skipStats`)), s(`.skipStats`)[`after`](`<label class=\"showQuest\">` + h[`showQuest`] + ' </label>'), s(`#showQuest`)['appendTo'](s(`.showQuest`)), s(`#options`)['remove'](), s(`#settingsChoice`)[`appendTo`](s(`.extrasGroup`))[`addClass`](`select-wrapper`)), this[`addSliderBox`](`.animationGroup`, 'animation', 100, 200, 1), this[`addSliderBox`]('.zoomGroup', `zoomSpeedValue`, 0.50, 1.99, 0.01), s(`#og-settings`).append(`<button class=\"btn btn-block btn-success btn-export\">` + h[`exportImport`] + `</button>`), s(`#og-settings`).append(`<div class=\"restore-settings\"><a href=\"#\">` + h[`restoreSettings`] + '</a></div>'), s(`#music`).append(`<div class=\"agario-panel radio-panel\"><h5 class=\"menu-main-color\">Radio (` + h[`thanks`] + `)</h5><audio src=\"http://frshoutcast.comunicazion.eu:8815/;\" controls></audio><span class=\"playlist\"><span class=\"ogicon-file-music\"></span> <a href=\"http://frshoutcast.comunicazion.eu:8815/played.html?sid=1\" target=\"_blank\">` + h[`playlist`] + `</a></span></div>`), s(`#music`).append(`<div class=\"agario-panel sounds-panel\"><h5 class=\"menu-main-color\">` + h[`sounds`] + `</h5></div>`), s(`#music`).append(`<div class=\"agario-panel ogario-yt-panel\"><h5 class=\"menu-main-color\">Team OGARio (tag: Ⓜ)</h5><div class=\"g-ytsubscribe\" data-channelid=\"UCaWiPNJWnhzYDrBQoXokn6w\" data-layout=\"full\" data-theme=\"dark\" data-count=\"default\"></div></div>`), this[`addInputBox`](`.sounds-panel`, `messageSound`, `Sound URL`, `setMessageSound`), this[`addInputBox`]('.sounds-panel', `commandSound`, 'Sound URL', 'setCommandSound'), s(`body`).append('<div id=\"overlays-hud\" data-gamemode=\":ffa\"><div id=\"stats-hud\" class=\"hud stats-hud-color\"></div> <div id=\"top5-hud\" class=\"hud\"><h5 class=\"hud-main-color\">Team top <span class=\"team-top\">5</span></h5><div class=\"hud-main-color team-top-menu\"><a href=\"#\" data-limit=\"5\" class=\"team-top-limit active\">5</a> | <a href=\"#\" data-limit=\"10\" class=\"team-top-limit\">10</a> | <a href=\"#\" data-limit=\"100\" class=\"team-top-limit\">100</a></div><ol id=\"top5-pos\"></ol><div id=\"top5-total\"><span class=\"hud-main-color ogicon-users\"></span> ' + h[`totalPartyPlayers`] + `: <span id=\"top5-total-players\" class=\"top5-mass-color\">0</span><br><span class=\"hud-main-color ogicon-pacman\"></span> ` + h[`totalPartyMass`] + ': <span id=\"top5-total-mass\" class=\"top5-mass-color\">0</span></div></div> <div id=\"time-hud\" class=\"hud time-hud-color\"></div> <div id=\"pause-hud\" class=\"hud\">' + h[`pause`] + `</div> <div id=\"leaderboard-hud\" class=\"hud-b\"><h4 class=\"hud-main-color\">legendmod.ml</h4><div id=\"leaderboard-data\"></div><div id=\"leaderboard-positions\"></div></div> <div id=\"btl-leaderboard-hud\"><div class=\"hud hud-c\"><span id=\"btl-players-status\">Players ready</span>: <span id=\"btl-players-count\">0</span></div></div> <div id=\"minimap-hud\" class=\"hud-b\"><canvas id=\"minimap-sectors\"></canvas><canvas id=\"minimap\"></canvas></div><div id=\"target-hud\" class=\"hud\"><div id=\"target-player\"><span id=\"target-skin\"><img src=\"https://cdn.ogario.ovh/static/img/blank.png\" alt=\"\"> </span><span id=\"target-nick\"></span> <span id=\"target-status\" class=\"hud-main-color\">[` + h[`targetNotSet`] + `]</span></div><div id=\"target-summary\"></div></div><div id=\"target-panel-hud\" class=\"hud\"><a href=\"#\" id=\"set-targeting\" class=\"ogicon-target\"></a><a href=\"#\" id=\"set-private-minimap\" class=\"ogicon-location2\"></a><a href=\"#\" id=\"cancel-targeting\" class=\"ogicon-cancel-circle\"></a><a href=\"#\" id=\"change-target\" class=\"ogicon-arrow-right\"></a></div> <div id=\"quest-hud\" class=\"hud\"></div> <div id=\"btl-hud\" class=\"hud\"></div></div>`), s(`body`).append(`<ul id=\"messages\"></ul>`), s(`body`).append(`<div id=\"message-box\"><div id=\"chat-emoticons\"></div><div id=\"message-menu\"><a href=\"#\" class=\"chat-sound-notifications ogicon-volume-high\"></a><a href=\"#\" class=\"chat-active-users ogicon-user-check\"></a><a href=\"#\" class=\"chat-muted-users ogicon-user-minus\"></a><a href=\"#\" class=\"show-chat-emoticons ogicon-smile\"></a></div><input type=\"text\" id=\"message\" class=\"form-control\" placeholder=\"` + h[`enterChatMsg`] + '...\" maxlength=\"80\"></div>'), s(`body`).append(`<div id=\"chat-box\"></div>`), d) d.hasOwnProperty(t) && s(`#chat-emoticons`).append(`<img src=\"https://cdn.ogario.ovh/static/emoticons/` + d[t] + `\" alt=\"` + t + `\" class=\"emoticon\">`);
                s(`body`).append(`<div id=\"exp-imp\"><div id=\"exp-imp-menu\"><button id=\"close-exp-imp\" class=\"btn btn-danger\">` + h[`close`] + `</button></div><div id=\"exp-imp-settings\"></div></div>`), s('#exp-imp-settings').append(`<h1>` + h[`exportSettings`] + `</h1><h2>` + h[`exportInfo`] + `</h2>`), this[`addOption`](`#exp-imp-settings`, `export-ogarioCommands`, h[`commands`], !0), this['addOption'](`#exp-imp-settings`, `export-ogarioHotkeys`, h[`hotkeys`], !0), this['addOption'](`#exp-imp-settings`, `export-ogarioPlayerProfiles`, h['profiles'], !0), this[`addOption`](`#exp-imp-settings`, `export-ogarioSettings`, h['settings'], !0), this[`addOption`](`#exp-imp-settings`, `export-ogarioThemeSettings`, h['theme'], !0), s(`#exp-imp-settings`).append('<textarea id=\"export-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" readonly /><button id=\"export-settings-btn\" class=\"btn btn-block btn-success\">' + h[`exportSettings`] + '</button>'), s(`#exp-imp-settings`).append('<h1>' + h[`importSettings`] + `</h1><h2>` + h[`importInfo`] + `</h2>`), this[`addOption`](`#exp-imp-settings`, `import-ogarioCommands`, h[`commands`], !0), this[`addOption`](`#exp-imp-settings`, `import-ogarioHotkeys`, h[`hotkeys`], !0), this[`addOption`](`#exp-imp-settings`, 'import-ogarioPlayerProfiles', h[`profiles`], !0), this[`addOption`](`#exp-imp-settings`, `import-ogarioSettings`, h[`settings`], !0), this[`addOption`](`#exp-imp-settings`, 'import-ogarioThemeSettings', h['theme'], !0), s('#exp-imp-settings').append('<textarea id=\"import-settings\" class=\"form-control\" rows=\"14\" cols=\"100\" spellcheck=\"false\" /><button id=\"import-settings-btn\" class=\"btn btn-block btn-success\">' + h[`importSettings`] + `</button>`), y && y[`setThemeMenu`]();
                for (var e = 0; e < ogario1PlayerProfiles[`length`]; e++) s(`#skins`).append(`<div class=\"skin-box\"><a href=\"#profile-` + e + `\" id=\"profile-` + e + `\" data-profile=\"` + e + `\"></a></div>`), this['setSkinPreview'](ogario1PlayerProfiles[e]['skinURL'], `profile-` + e), e == this[`selectedProfile`] && s(`#profile-` + e)[`addClass`]('selected');
            },
            'setUI': function() {
                var t = this;
                s(document)['on'](`click`, '.menu-tabs a', function(e) {
                    e.preventDefault(), t[`switchMenuTabs`](s(this), `menu-panel`);
                }), s(document)['on']('click', `.submenu-tabs a`, function(e) {
                    e.preventDefault(), t['switchMenuTabs'](s(this), `submenu-panel`);
                }), s(document)['on'](`click`, `.quick-menu`, function(e) {
                    e.preventDefault(), v[`showQuickMenu`] = !v[`showQuickMenu`], t[`saveSettings`](v, `ogarioSettings`), t[`setShowQuickMenu`]();
                }), s(document)['on'](`click`, `.quick-skins`, function(e) {
                    e.preventDefault(), v['showSkinsPanel'] = !v[`showSkinsPanel`], t[`saveSettings`](v, 'ogarioSettings'), t[`setShowSkinsPanel`]();
                }), s(document)['on'](`change`, '#region', function() {
                    t[`region`] = this['value'];
                }), s(document)['on'](`change`, `#gamemode`, function() {
                    var e = this.value;
                    ':party' !== e && t[`leaveParty`](), t[`gameMode`] = i['gameMode'] = e, t[`setQuest`]();
                }), s(document)['on'](`change`, `#quality`, function() {
                    t[`getQuality`](this.value), ogarhusettings();
                }), s(document)['on'](`input`, '#skin', function() {
                    var e = this.value;
                    t[`setSkinPreview`](e, `skin-preview`), t[`setSkinPreview`](e, `profile-` + t[`selectedProfile`]);
                }), s(document)['on'](`click`, `#skins a`, function(e) {
                    e.preventDefault(), t[`selectProfile`](s(this)['attr'](`data-profile`));
                }), s(document)['on'](`click`, `#prev-profile`, function() {
                    t[`prevProfile`]();
                }), s(document)['on'](`click`, `#next-profile`, function() {
                    t[`nextProfile`]();
                }), s(document)['on'](`click`, `#stream-mode`, function() {
                    v[`streamMode`] = !v[`streamMode`], t[`saveSettings`](v, `ogarioSettings`), t[`setStreamMode`]();
                }), s(document)['on'](`click`, `#hide-url`, function() {
                    v[`hideSkinUrl`] = !v[`hideSkinUrl`], t[`saveSettings`](v, `ogarioSettings`), t[`setHideSkinUrl`]();
                }), s(document)['on']('click', `.btn-server-info`, function() {
                    s(`#server-info`)[`toggle`]();
                }), s(document)['on']('click', `#server-connect`, function() {
                    t[`gameServerConnect`](s('#server-ws').val());
                }), s(document)['on'](`click`, `#server-reconnect`, function() {
                    t[`gameServerReconnect`]();
                }), s(document)['on'](`click`, `#server-join`, function() {
                    t[`gameServerJoin`](s(`#server-token`).val());
                }), s(document)['on'](`change`, `#og-options input[type=\'checkbox\']`, function() {
                    var e = s(this);
                    t[`setSettings`](e['attr']('id'), e[`prop`](`checked`));
                }), s(document)['on'](`change`, '.js-switch-vanilla', function() {
                    var e = s(this),
                        o = e[`attr`]('id');
                    void 0 !== t[o] && (t[o] = e['prop'](`checked`), `noSkins` === o && (i['showCustomSkins'] = !t[`noSkins`]), `showQuest` === o && t[`setQuest`]());
                }), s(document)['on'](`click`, `#og-settings .restore-settings a`, function(e) {
                    e['preventDefault'](), t[`restoreSettings`]();
                }), s(document)['on'](`click`, `#og-settings .btn-export`, function(e) {
                    e['preventDefault'](), t['exportSettings'](), s('#exp-imp')[`fadeIn`](500), s(`#exp-imp-settings, #export-settings`)[`perfectScrollbar`](`update`);
                }), s(document)['on'](`click`, '#close-exp-imp', function(t) {
                    t.preventDefault(), s(`#exp-imp`)[`fadeOut`](500);
                }), s(document)['on'](`focus`, `#export-settings`, function() {
                    s(this)[`select`]();
                }), s(document)['on'](`click`, `#export-settings-btn`, function(e) {
                    e.preventDefault(), t[`exportSettings`]();
                }), s(document)['on']('click', '#import-settings-btn', function(e) {
                    e['preventDefault'](), t[`importSettings`]();
                }), s(document)['on'](`click`, '#unblock-popups', function(e) {
                    e['preventDefault'](), t['unblockPopups']();
                }), s(document)['on'](`click`, '#openfl-overlay.disabler', function() {
                    v['blockPopups'] && t[`blockPopups`]();
                }), s(document)['on'](`click`, `#openfl-content`, function() {
                    if (v['blockPopups']) {
                        var e = s(this);
                        setTimeout(function() {
                            e['is'](`:visible`) || t[`blockPopups`]();
                        }, 1000);
                    }
                }), s(document)['on']('click', `.quick-shop`, function(i) {
                    i.preventDefault(), t[`unblockPopups`](), e['MC'] && e['MC'][`openShop`] && e['MC'][`openShop`]();
                }), s(document)['on'](`click`, `.quick-free-coins`, function(i) {
                    i.preventDefault(), t[`unblockPopups`](), e['MC'] && e['MC'][`showFreeCoins`] && e['MC'][`showFreeCoins`]();
                }), s(document)['on']('click', `.quick-free-gifts`, function(i) {
                    i.preventDefault(), t['unblockPopups'](), e['MC'] && e['MC'][`showGifting`] && e['MC'][`showGifting`]();
                }), s(document)['on'](`click`, `.quick-quests`, function(i) {
                    i.preventDefault(), t[`unblockPopups`](), e['MC'] && e['MC'][`showQuests`] && e['MC'][`showQuests`]();
                }), s(document)['on']('click', `#set-targeting`, function(e) {
                    e.preventDefault(), t['setTargeting']();
                }), s(document)['on']('click', `#cancel-targeting`, function(e) {
                    e.preventDefault(), t[`cancelTargeting`]();
                }), s(document)['on'](`click`, `#set-private-minimap`, function(e) {
                    e.preventDefault(), t[`setPrivateMiniMap`]();
                }), s(document)['on']('click', `#change-target`, function(e) {
                    e['preventDefault'](), t[`changeTarget`]();
                }), s(document)['on'](`click`, `.team-top-limit`, function(e) {
                    e.preventDefault();
                    var i = s(this),
                        o = parseInt(i[`attr`](`data-limit`));
                    o && (t[`setTop5limit`](o), t[`displayTop5`](), s(`.team-top`)['text'](o), s(`.team-top-limit`)[`removeClass`]('active'), i['addClass'](`active`));
                }), s(document)['on'](`click`, '#top5-pos .set-target', function(e) {
                    e.preventDefault(), t[`setTarget`](parseInt(s(this)[`attr`](`data-user-id`)));
                }), s(document)['on'](`click`, `.mute-user`, function(e) {
                    e.preventDefault(), t[`muteChatUser`](parseInt(s(this)[`attr`](`data-user-id`)));
                }), s(document)['on']('click', `.btn-mute-user`, function() {
                    var e = s(this);
                    t[`muteChatUser`](parseInt(e['attr'](`data-user-id`))), e[`removeClass`](`btn-red btn-mute-user`)[`addClass`](`btn-green btn-unmute-user`)[`text`](h[`unmute`]);
                }), s(document)['on'](`click`, `.btn-unmute-user`, function() {
                    var e = s(this);
                    t[`unmuteChatUser`](parseInt(e[`attr`](`data-user-id`))), e[`removeClass`](`btn-green btn-unmute-user`)['addClass']('btn-red btn-mute-user')['text'](h[`mute`]);
                }), s(document)['on'](`click`, '.chat-sound-notifications', function(e) {
                    e['preventDefault'](), v[`chatSounds`] = !v[`chatSounds`], t['saveSettings'](v, `ogarioSettings`), t[`setChatSoundsBtn`]();
                }), s(document)['on'](`click`, `.chat-active-users`, function(e) {
                    e.preventDefault(), t[`displayChatActiveUsers`]();
                }), s(document)['on']('click', `.chat-muted-users`, function(e) {
                    e.preventDefault(), t[`displayChatMutedUsers`]();
                }), s(document)['on'](`click`, `.show-chat-emoticons`, function(t) {
                    t['preventDefault']();
                    var e = s(this),
                        i = s(`#chat-emoticons`);
                    i[`toggle`](), i['is'](`:visible`) ? e[`addClass`](`active`) : (e[`removeClass`]('active'), s(`#message`)[`focus`]());
                }), s(document)['on']('click', `#chat-emoticons .emoticon`, function() {
                    var t = s(this)[`attr`](`alt`),
                        e = s(`#message`),
                        i = e.val();
                    i[`length`] + t[`length`] <= 80 && e.val(i + t), e['focus']();
                }), this['statsHUD'] = document[`getElementById`](`stats-hud`), this['activeParties'] = document['getElementById'](`active-parties`), this[`top5pos`] = document[`getElementById`](`top5-pos`), this[`top5totalMass`] = document[`getElementById`](`top5-total-mass`), this['top5totalPlayers'] = document[`getElementById`]('top5-total-players'), this[`leaderboardPositionsHUD`] = document['getElementById'](`leaderboard-positions`), this['leaderboardDataHUD'] = document['getElementById'](`leaderboard-data`), this[`timeHUD`] = document[`getElementById`](`time-hud`), this[`questHUD`] = document[`getElementById`](`quest-hud`), s(`#canvas`)[`bind`](`contextmenu`, function() {
                    return !1;
                }), s(document)['on']('mouseup', `.btn`, function() {
                    $(this)[`blur`]();
                }), s(`[data-toggle=\'tab-tooltip\']`)[`tooltip`]({
                    'trigger': `hover`
                }), s('.submenu-panel, #chat-box, #exp-imp-settings, #export-settings, #import-settings')[`perfectScrollbar`]({
                    'suppressScrollX': !0
                }), Array[`prototype`]['slice'][`call`](document[`querySelectorAll`](`.js-switch`))[`forEach`](function(t) {
                    new Switchery(t, {
                        'color': g[`menuMainColor`],
                        'size': `small`
                    });
                }), s('input[type=\'range\']')[`rangeslider`]({
                    'polyfill': !1
                }), toastr[`options`] = {
                    'newestOnTop': !1,
                    'positionClass': `toast-bottom-left`,
                    'timeOut': 15000
                };
            },
            'switchMenuTabs': function(t, e) {
                var i = t[`parent`]();
                if (`menu-panel` === e) {
                    if (t[`hasClass`](`hotkeys-link`)) return;
                    i['hasClass'](`profile-tab`) && this[`setBlockPopups`]();
                }
                t[`addClass`](`active`), i[`addClass`](`active`), i[`siblings`]()[`removeClass`](`active`), i[`siblings`]()[`find`]('a')[`removeClass`](`active`);
                var o = t[`attr`](`href`);
                if (`submenu-panel` === e) {
                    var a = s(o)[`parent`]()[`attr`]('id');
                    s('#' + a + ` .submenu-panel`)[`not`](o).css(`display`, `none`);
                } else s(`.menu-panel`)[`not`](o).css('display', `none`);
                s(o)[`fadeIn`](1000), ogarhusettings(), s('.submenu-panel')[`perfectScrollbar`](`update`);
            },
            'getDefaultSettings': function() {
                if (this['noSkins'] = s(`#noSkins`)['prop'](`checked`), this['noColors'] = s(`#noColors`)[`prop`](`checked`), this[`skipStats`] = s(`#skipStats`)[`prop`](`checked`), this[`showQuest`] = s(`#showQuest`)[`prop`](`checked`), i[`showCustomSkins`] = !this[`noSkins`], null !== e.localStorage['getItem'](`scale_setting`)) {
                    var t = JSON['parse'](e.localStorage.getItem(`scale_setting`));
                    this[`setCanvasScale`](t);
                } else {
                    var o = s('#quality').val();
                    this[`getQuality`](o);
                }
                null !== e.localStorage.getItem(`location`) ? (this[`region`] = e.localStorage['getItem'](`location`), s(`#region`).val(this[`region`]), e['MC'] && e['MC'][`setRegion`] && e['MC'][`setRegion`](this[`region`])) : this[`region`] = s(`#region`).val(), this[`setParty`](), `:party` === this['gameMode'] && e.location[`hash`] && s(`#join-party-btn-2`)['click'](), Array['prototype']['slice'][`call`](document[`querySelectorAll`](`.js-switch-vanilla`))['forEach'](function(t) {
                    new Switchery(t, {
                        'color': g[`menuMainColor`],
                        'size': `small`
                    });
                }), s(`#nick`).val(ogarcopythelb[`nick`])[`blur`](), s(`#noNames`)[`prop`](`checked`, !v[`noNames`]), s(`#showMass`)['prop'](`checked`, v[`showMass`]), this[`unlockButtons`](), this['setAutoResp'](), this[`setQuest`]();
            },
            'getQuality': function(t) {
                var i = 1;
                switch ('devicePixelRatio' in e && (i = e[`devicePixelRatio`]), t) {
                    case `High`:
                        this[`setCanvasScale`](1);
                        break;
                    case `Medium`:
                        this[`setCanvasScale`](0.9);
                        break;
                    case `Low`:
                        this[`setCanvasScale`](0.75);
                        break;
                    case `VeryLow`:
                        this[`setCanvasScale`](0.5);
                        break;
                    default:
                        this[`setCanvasScale`](i);
                }
            },
            'setCanvasScale': function(t) {
                this['canvasScale'] = t, i[`canvasScale`] = t;
            },
            'setStreamMode': function() {
                v[`streamMode`] ? (s(`#stream-mode`)[`addClass`](`ogicon-eye-blocked`), s('#clantag, #nick, #party-token')[`addClass`](`stream-mode`)) : (s('#stream-mode')[`removeClass`](`ogicon-eye-blocked`), s(`#clantag, #nick, #party-token`)[`removeClass`]('stream-mode'));
            },
            'setHideSkinUrl': function() {
                v[`hideSkinUrl`] ? (s('#hide-url')[`addClass`]('ogicon-eye-blocked'), s(`#skin`)[`addClass`](`hide-url`)) : (s(`#hide-url`)[`removeClass`](`ogicon-eye-blocked`), s(`#skin`)['removeClass'](`hide-url`));
            },
            'setShowQuickMenu': function() {
                v[`showQuickMenu`] ? s(`#quick-menu`)[`fadeIn`](500) : s(`#quick-menu`)[`fadeOut`](500);
            },
            'setShowSkinsPanel': function() {
                v[`showSkinsPanel`] ? s(`#skins-panel`)[`fadeIn`](500) : s(`#skins-panel`)[`fadeOut`](500);
            },
            'unlockButtons': function() {
                s(`.btn-play, .btn-play-guest, .btn-login-play, .btn-spectate`)[`prop`](`disabled`, !1);
            },
            'setMainButtons': function() {
                var t = this;
                s(document)['on'](`click`, '.btn-play, .btn-play-guest', function() {
                    t['onPlay']();
                }), s(document)['on'](`click`, '.btn-spectate', function() {
                    t[`onSpectate`]();
                }), s(document)['on'](`click`, `#create-party-btn-2`, function() {
                    t[`onCreate`]();
                }), s(document)['on'](`click`, `#join-party-btn-2`, function() {
                    t[`skipServerData`] = !0, t[`joinParty`](), t['onJoin']();
                }), s(document)['on'](`click`, `#statsContinue2`, function() {
                    s('#stats, #main-panel')[`toggle`]();
                });
            },
            'play': function() {
                if (this[`setPlayerSettings`](), this[`setParty`](), this[`isSocketOpen`]()) this[`sendPartyData`]();
                else {
                    this[`connect`]();
                    var t = this;
                    setTimeout(function() {
                        t[`sendPartyData`]();
                    }, 1000);
                }
            },
            'onPlay': function() {
                this[`play`](), this['hideMenu'](), e[`addKeyListeners`] && e[`addKeyListeners`](), v[`autoHideFood`] && (i[`showFood`] = !0), e['ga'] && e['ga'](`create`, `UA-67142685-2`, `auto`, `ogarioTracker`), e['ga'] && e['ga'](`ogarioTracker.send`, `pageview`);
            },
            'onSpectate': function() {
                this[`onJoin`](), this[`sendPlayerJoin`](), this[`hideMenu`](), e[`addKeyListeners`] && e['addKeyListeners'](), v[`autoHideFood`] && (i[`showFood`] = !1);
            },
            'join': function() {
                this[`setParty`](), this[`setPlayerSettings`](), this[`sendPartyData`](), this['sendPlayerDeath']();
            },
            'onJoin': function() {
                if (this[`setParty`](), this[`isSocketOpen`]()) this[`join`]();
                else {
                    this[`connect`]();
                    var t = this;
                    setTimeout(function() {
                        t[`join`](), t[`sendPlayerJoin`]();
                    }, 1000);
                }
            },
            'create': function() {
                if (this['setParty'](), this[`partyToken`]) this[`onJoin`]();
                else {
                    var t = this;
                    setTimeout(function() {
                        t[`create`]();
                    }, 100);
                }
            },
            'onCreate': function() {
                this[`setParty`](), `:party` === this[`gameMode`] && this['partyToken'] ? this[`gameServerReconnect`]() : this['createParty'](), this[`create`]();
            },
            'onPlayerSpawn': function() {
                if (i[`play`] = !0, i[`playerColor`]) return this['sendPlayerSpawn'](), void this['cacheCustomSkin'](ogarcopythelb[`nick`], i['playerColor'], ogarcopythelb[`skinURL`]);
                var t = this;
                setTimeout(function() {
                    t[`onPlayerSpawn`]();
                }, 100);
            },
            'onPlayerDeath': function() {
                i[`play`] = !1, i['playerColor'] = null, i[`foodIsHidden`] = !1, i['playerMass'] = 0, i[`playerScore`] = 0, i[`playerSplitCells`] = 0, this[`showMenu`](300), this[`sendPlayerDeath`](), this[`updateDeathLocations`](i[`playerX`], i['playerY']), this[`unlockButtons`](), ogarcommando1(), this[`autoResp`]();
            },
            'setPlayerSettings': function() {
                var t = s(`#nick`).val(),
                    e = s(`#clantag`).val(),
                    o = s(`#skin`)['val'](),
                    a = s(`#color`).val();
                ogarcopythelb[`nick`] = t, ogarcopythelb[`clanTag`] = e[`trim`](), ogarcopythelb[`skinURL`] = this[`checkSkinURL`](o['trim']()), 7 == a[`length`] && (ogarcopythelb[`color`] = a), ogarcopythelb[`clanTag`][`length`] > 0 && (i[`clanTag`] = ogarcopythelb[`clanTag`]), ogario1PlayerProfiles[this[`selectedProfile`]][`nick`] = ogarcopythelb[`nick`], ogario1PlayerProfiles[this[`selectedProfile`]][`clanTag`] = ogarcopythelb[`clanTag`], ogario1PlayerProfiles[this[`selectedProfile`]][`skinURL`] = ogarcopythelb[`skinURL`], ogario1PlayerProfiles[this[`selectedProfile`]][`color`] = ogarcopythelb[`color`], this[`saveSettings`](ogario1PlayerProfiles, `ogarioPlayerProfiles`);
            },
            'loadSkin': function(t, e) {
                var i = this;
                t[e] = new Image(), t[e][`crossOrigin`] = `Anonymous`, t[e]['onload'] = function() {
                    this[`complete`] && this[`width`] && this[`height`] && this[`width`] <= 2000 && this['height'] <= 2000 && (i['cacheQueue'][`push`](e), 1 == i[`cacheQueue`][`length`] && i[`cacheSkin`](i['customSkinsCache']));
                }, t[e]['src'] = e;
            },
            'cacheSkin': function(t) {
                //console.log(t);  //////// return the image src
                if (0 != this['cacheQueue'][`length`]) {
                    var e = this[`cacheQueue`]['shift']();
                    if (e) {
                        //console.log(e);
                        var i = document[`createElement`](`canvas`);
                        i[`width`] = 512, i[`height`] = 512;
                        var s = i[`getContext`]('2d');
                        s[`beginPath`](), s[`arc`](256, 256, 256, 0, 2 * Math['PI'], !1), s[`clip`](), s[`drawImage`](this[`customSkinsCache`][e], 0, 0, 512, 512), this[`customSkinsCache`][e + `_cached`] = new Image(), this[`customSkinsCache`][e + `_cached`][`src`] = i[`toDataURL`](), i = null, this[`cacheSkin`](this[`customSkinsCache`]);
                    }
                }
            },
            'cacheVanillaSkin': function(vanSkin) {
                //console.log(t);  //////// returns img scr of server/tag
                //if (0 != this['cacheQueue'][`length`]) {
                var e = vanSkin;
                if (e) {
                    console.log(e);
                    var i = document[`createElement`](`canvas`);
                    i[`width`] = 512, i[`height`] = 512;
                    var s = i[`getContext`]('2d');
                    s[`beginPath`](), s[`arc`](256, 256, 256, 0, 2 * Math['PI'], !1), s[`clip`](), s[`drawImage`](this[`customSkinsCache`][e], 0, 0, 512, 512), this[`customSkinsCache`][e + `_cached`] = new Image(), this[`customSkinsCache`][e + `_cached`][`src`] = i[`toDataURL`](), i = null, this[`cacheSkin`](this[`customSkinsCache`]);
                    //}
                }
            },
            'getCachedSkin': function(t, e) {
                return t[e + `_cached`] && t[e + `_cached`][`complete`] && t[e + '_cached'][`width`] ? t[e + `_cached`] : null;
            },
            'cacheCustomSkin': function(t, e, i) {
                if (i) {
                    var s = ':party' === this['gameMode'] ? t + e : t;
//					console.log(this[`customSkinsMap`][s]);
//					console.log(s);
//					console.log(i);
/*					
					if (window.vanillaSkinname!=null){
						console.log(window.vanillaSkinname);
						console.log(window.vanillaSkin);					
						this[`customSkinsMap`][window.vanillaSkinname]=window.vanillaSkin;
						this['loadSkin'](this[`customSkinsCache`], window.vanillaSkin);
						}
*/					
					
                    if (s && (this[`customSkinsMap`][s] = i), this[`customSkinsCache`].hasOwnProperty(i)) return;
                    this['loadSkin'](this[`customSkinsCache`], i);
                }
            },
            'checkSkinsMap': function(t, e) {
                var i = `:party` === this['gameMode'] ? t + e : t;
				//console.log(['customSkinsMap'].hasOwnProperty(i));
                return !!this['customSkinsMap'].hasOwnProperty(i);
            },
            'getCustomSkin': function(t, e) {
                if (!this[`checkSkinsMap`](t, e)) return null;
                var i = `:party` === this[`gameMode`] ? t + e : t;
                return this[`getCachedSkin`](this[`customSkinsCache`], this['customSkinsMap'][i]);
            },
            'calculateMapSector': function(t, e, s = !1) {
                if (!i['mapOffsetFixed']) return '';
                var o = s ? i[`mapOffsetX`] + i['mapOffset'] : i['mapOffset'],
                    a = s ? i['mapOffsetY'] + i['mapOffset'] : i[`mapOffset`],
                    n = Math[`floor`]((e + a) / (i[`mapSize`] / g[`sectorsY`])),
                    r = Math[`floor`]((t + o) / (i[`mapSize`] / g[`sectorsX`]));
                return n = n < 0 ? 0 : n >= g[`sectorsY`] ? g[`sectorsY`] - 1 : n, r = r < 0 ? 0 : r >= g[`sectorsX`] ? g[`sectorsX`] - 1 : r, String[`fromCharCode`](n + 65) + (r + 1);
            },
            'shortMassFormat': function(t) {
                return t < 1000 ? t : Math['round'](t / 100) / 10 + 'k';
            },
            'updateDeathLocations': function(t, e) {
                i[`mapOffsetFixed`] && (this[`deathLocations`]['push']({
                    'x': t + i[`mapOffsetX`],
                    'y': e + i[`mapOffsetY`]
                }), 6 == this['deathLocations'][`length`] && this[`deathLocations`][`shift`](), this[`lastDeath`] = this[`deathLocations`][`length`] - 1);
            },
            'drawMiniMap': function() {
                if (i[`mapOffsetFixed`]) {
                    var t = g[`miniMapWidth`],
                        e = g['miniMapTop'],
                        s = t + e,
                        o = t - 18,
                        a = e + 9.5;
                    this[`miniMap`] ? this[`miniMapCtx`][`clearRect`](0, 0, t, s) : (this[`miniMap`] = document[`getElementById`](`minimap`), this[`miniMapCtx`] = this['miniMap'][`getContext`]('2d'), this['miniMapCtx'][`ogarioCtx`] = !0, this[`miniMap`][`width`] = t, this[`miniMap`][`height`] = s), this[`miniMap`][`width`] != t && (this[`miniMap`][`width`] = t, this[`miniMap`][`height`] = s);
                    var n = o / i[`mapSize`],
                        r = i[`mapOffsetX`] + i[`mapOffset`],
                        l = i[`mapOffsetY`] + i[`mapOffset`];
                    if (this['drawSelectedCell'](this[`miniMapCtx`]), this[`currentSector`] = this[`calculateMapSector`](i[`playerX`], i[`playerY`], !0), this[`miniMapCtx`]['globalAlpha'] = 1, this['miniMapCtx'][`font`] = g[`miniMapFontWeight`] + ' ' + (e - 4) + `px ` + g['miniMapFontFamily'], this[`miniMapCtx`][`fillStyle`] = g[`miniMapSectorColor`], this[`miniMapCtx`][`fillText`](this['currentSector'], 10, e), this['miniMapSectors'] || this[`drawMiniMapSectors`](g[`sectorsX`], g[`sectorsY`], o, s, a), this['miniMapCtx'][`save`](), this['miniMapCtx']['translate'](9.5, a), ':battleroyale' === this[`gameMode`] && ogarfooddrawer && ogarfooddrawer[`drawBattleAreaOnMinimap`](this['miniMapCtx'], o, o, n, r, l), v[`showMiniMapGhostCells`]) {
                        var h = i['ghostCells'];
                        this[`miniMapCtx`][`beginPath`]();
                        for (var c = 0; c < h[`length`]; c++)
                            if (!h[c][`inView`]) {
                                var u = ~~((h[c]['x'] + r) * n),
                                    d = ~~((h[c]['y'] + l) * n);
                                this[`miniMapCtx`]['moveTo'](u, d), this[`miniMapCtx`][`arc`](u, d, ~~(h[c][`size`] * n), 0, this[`pi2`], !1);
                            } this[`miniMapCtx`]['fillStyle'] = g[`miniMapGhostCellsColor`], this[`miniMapCtx`][`globalAlpha`] = g[`miniMapGhostCellsAlpha`], this[`miniMapCtx`][`shadowColor`] = g[`miniMapGhostCellsColor`], this['miniMapCtx'][`shadowBlur`] = 10, this[`miniMapCtx`][`shadowOffsetX`] = 0, this['miniMapCtx'][`shadowOffsetY`] = 0, this[`miniMapCtx`]['fill'](), this[`miniMapCtx`][`globalAlpha`] = 1, this[`miniMapCtx`][`shadowBlur`] = 0;
                    }
                    if (v[`showMiniMapGuides`]) {
                        u = Math[`round`]((i[`playerX`] + r) * n), d = Math[`round`]((i[`playerY`] + l) * n);
                        this['miniMapCtx']['lineWidth'] = 1, this[`miniMapCtx`][`strokeStyle`] = g[`miniMapGuidesColor`], this[`miniMapCtx`][`beginPath`](), this[`miniMapCtx`][`moveTo`](u, 0), this['miniMapCtx'][`lineTo`](u, o - 1), this[`miniMapCtx`][`moveTo`](0, d), this[`miniMapCtx`][`lineTo`](o - 1, d), this[`miniMapCtx`][`stroke`]();
                    }
                    if (this[`miniMapCtx`][`beginPath`](), this[`miniMapCtx`][`arc`]((i[`playerX`] + r) * n, (i['playerY'] + l) * n, g[`miniMapMyCellSize`], 0, this[`pi2`], !1), this[`miniMapCtx`][`closePath`](), g[`miniMapMyCellStrokeSize`] > 0 && (this[`miniMapCtx`][`lineWidth`] = g[`miniMapMyCellStrokeSize`], this[`miniMapCtx`][`strokeStyle`] = g['miniMapMyCellStrokeColor'], this[`miniMapCtx`][`stroke`]()), this[`miniMapCtx`][`fillStyle`] = g['miniMapMyCellColor'], this['miniMapCtx'][`fill`](), this[`teamPlayers`][`length`])
                        for (c = 0; c < this[`teamPlayers`][`length`]; c++) this[`teamPlayers`][c][`drawPosition`](this[`miniMapCtx`], i['mapOffset'], n, this[`privateMiniMap`], this['targetID']);
                    if (this[`deathLocations`][`length`] > 0) {
                        u = Math[`round`]((this['deathLocations'][this['lastDeath']]['x'] + i[`mapOffset`]) * n), d = Math[`round`]((this[`deathLocations`][this[`lastDeath`]]['y'] + i['mapOffset']) * n);
                        var f = Math[`max`](g[`miniMapMyCellSize`] - 2, 4);
                        this[`miniMapCtx`][`lineWidth`] = 1, this[`miniMapCtx`][`strokeStyle`] = this[`deathLocations`][`length`] - 1 == this[`lastDeath`] ? g['miniMapDeathLocationColor'] : `#FFFFFF`, this[`miniMapCtx`][`beginPath`](), this['miniMapCtx'][`moveTo`](u - f, d), this['miniMapCtx'][`lineTo`](u + f, d), this[`miniMapCtx`][`moveTo`](u, d - f), this['miniMapCtx'][`lineTo`](u, d + f), this['miniMapCtx'][`stroke`]();
                    }
                    this[`miniMapCtx`]['restore']();
                }
            },
            'drawMiniMapSectors': function(t, e, s, o, a) {
                this['miniMapSectors'] = document[`getElementById`](`minimap-sectors`);
                var n = this[`miniMapSectors`][`getContext`]('2d');
                n[`ogarioCtx`] = !0, this[`miniMapSectors`]['width'] = s, this['miniMapSectors'][`height`] = o, n[`fillStyle`] = '#FFFFFF', this[`dTok`](n, s - 1), ogarfooddrawer[`drawSectors`](n, i[`mapOffsetFixed`], t, e, 0.5, a, s - 0.5, o - 9.5, g['miniMapSectorsColor'], g[`miniMapSectorsColor`], 1, !1);
            },
            'resetMiniMapSectors': function() {
                this[`miniMapSectors`] = null;
            },
            'drawSelectedCell': function(t) {
                i[`play`] && i[`playerSplitCells`] > 1 && (v[`splitRange`] || v['oppColors'] || v[`oppRings`] || v[`showStatsSTE`]) && (t[`fillStyle`] = `#FFFFFF`, t['globalAlpha'] = this[`selectBiggestCell`] ? 0.6 : 0.3, t[`beginPath`](), t['arc'](0x30, 15, 6, 0, this[`pi2`], !1), t[`closePath`](), t[`fill`](), t[`globalAlpha`] = this[`selectBiggestCell`] ? 0.3 : 0.6, t[`beginPath`](), t[`arc`](0x3c, 15, 4, 0, this[`pi2`], !1), t['closePath'](), t[`fill`]());
            },
            'dTok': function(t, e) {
                t[`font`] = g['miniMapFontWeight'] + ' ' + (g[`miniMapTop`] - 6) + `px ` + g[`miniMapFontFamily`], t['textAlign'] = `right`, t['textBaseline'] = 'top', t['fillText'](atob(this[`token`]), e, 7);
            },
            'drawTeammatesInd': function(t, e, i, s) {
                this[`indicator`] && t[`drawImage`](this[`indicator`], e - 45, i - s - 90);
            },
            'drawCellInfo': function(t, e, s, o, a, n, r, l, h, c, u, d) {
                if (!n && !h && (t[`globalAlpha`] = i[`globalAlpha`], v[`teammatesInd`] && d && !l && a <= 200 && this[`drawTeammatesInd`](t, s, o, a), !v[`noNames`] || v[`showMass`])) {
                    var f = !1;
                    if (l || r || !(f = this[`setAutoHideCellInfo`](a)) || !v[`autoHideNames`] || !v[`autoHideMass`]) {
                        var m = null;
                        if (!this[`cells`].hasOwnProperty(e)) return (m = new ogarbasicassembly(s, o, r, l, v['shortMass'], v[`virMassShots`]))[`setMass`](a), m['setNick'](c), void(this[`cells`][e] = m);
                        (m = this[`cells`][e])[`update`](s, o, a, r, l, c), m[`setDrawing`](v[`optimizedNames`], v[`optimizedMass`], v[`shortMass`], v['virMassShots'], v[`namesStroke`], v['massStroke']), m[`setDrawingScale`](i['viewScale'], g[`namesScale`], g[`massScale`], g['virMassScale'], g[`strokeScale`]), t[`globalAlpha`] = g[`textAlpha`], v[`noNames`] || f && v[`autoHideNames`] || l && v['hideMyName'] || d && v[`hideTeammatesNames`] || m[`drawNick`](t, g[`namesColor`], g[`namesFontFamily`], g[`namesFontWeight`], g['namesStrokeColor']), !v[`showMass`] || f && v[`autoHideMass`] || l && v['hideMyMass'] || v[`hideEnemiesMass`] && !l && !r || m['drawMass'](t, g['massColor'], g[`massFontFamily`], g[`massFontWeight`], g['massStrokeColor']);
                    }
                }
            },
            'setVirusColor': function(t) {
                return Math[`floor`](t * t / 100) > 183 ? `#C80000` : g['virusColor'];
            },
            'setVirusStrokeColor': function(t) {
                return i['play'] && 0 != i[`playerMaxMass`] ? Math[`floor`](t * t / 100) / (this[`selectBiggestCell`] ? i[`playerMaxMass`] : i[`playerMinMass`]) > 0.76 ? `#FFDC00` : '#C80000' : g[`virusStrokeColor`];
            },
            'setAutoHideCellInfo': function(t) {
                return t <= 40 || i[`viewScale`] < 0.5 && t < 550 && t < 25 / i[`viewScale`];
            },
            'setParty': function() {
                var t = s(`#party-token`).val();
                if (this[`gameMode`] = i[`gameMode`] = s(`#gamemode`).val(), this[`setQuest`](), `:party` === this['gameMode'] && t) {
                    var e = t; - 1 != t.indexOf('#') && (e = (t = t[`split`]('#'))[1]), this[`partyToken`] !== e && (this['partyToken'] = e, this[`flushSkinsMap`](), this[`flushChatData`](), this[`cancelTargeting`]());
                }
            },
            'createParty': function() {
                s('#create-party-btn')[`click`]();
            },
            'joinParty': function() {
                var t = s(`#party-token`)['val']();
                t && (s(`#pre-join-party-btn`)[`click`](), s(`.party-token`)['val'](t), s(`#join-party-btn`)[`click`]());
            },
            'leaveParty': function() {
                s(`#party-token, .party-token`).val(''), s(`#leave-party-btn`)[`click`]();
            },
            'closeParty': function() {
                s(`#party-token, .party-token`).val(''), s(`.party-icon-back`)[`click`]();
            },
            'flushData': function() {
                this[`flushPartyData`](), this[`flushSkinsMap`](), this[`flushChatData`](), this[`cancelTargeting`](), i[`play`] = !1, i['playerColor'] = null;
            },
            'flushPartyData': function() {
                this[`teamPlayers`] = [], this[`parties`] = [], this[`lastSentNick`] = '', this[`lastSentClanTag`] = null, this[`lastSentSkinURL`] = '', this[`lastSentCustomColor`] = '', this[`lastSentPartyToken`] = '', this[`lastSentServerToken`] = '';
            },
            'flushCells': function() {
                this['cells'] = {};
            },
            'flushSkinsMap': function() {
                this['customSkinsMap'] = {};
            },
            'flushChatData': function() {
                this[`chatUsers`] = {};
            },
            'getWS': function(t) {
                t && (this['ws'] = t, this[`createServerToken`](), this[`updateServerInfo`](), -1 == this['ws'].indexOf(`agar.io`) && this[`closeConnection`]());
            },
            'recreateWS': function(t) {
                if (!t) return null;
                var e = null;
                if (/^[a-zA-Z0-9=+\/]{12,}$/ [`test`](t)) {
                    var i = atob(t);
                    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/ [`test`](i) && (e = `wss://ip-` + i[`replace`](/\./g, '-')[`replace`](':', `.tech.agar.io:`));
                }
                return !e && /^[a-z0-9]{5,}$/ [`test`](t) && (e = `wss://live-arena-` + t + `.agar.io:443`), e;
            },
            'createServerToken': function() {
                var t = this['ws']['match'](/ip-\d+/),
                    i = this['ws'][`match`](/live-arena-([\w\d]+)/),
                    s = null;
                t && ((t = this['ws'][`replace`](`.tech.agar.io`, '')[`replace`](/-/g, '.')[`match`](/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/)) && (this[`serverIP`] = t[0], s = btoa(this['serverIP'])));
                if (!s && i && (this['serverArena'] = i[1], s = this[`serverArena`]), s) {
                    this[`serverToken`] !== s && (this['serverToken'] = s, this[`flushData`](), this[`flushCells`]()), this[`partyToken`] = '';
                    var o = this['ws'][`match`](/party_id=([A-Z0-9]{6})/);
                    o && (this[`partyToken`] = o[1], ogarjoiner('/#' + e[`encodeURIComponent`](this[`partyToken`])));
                }
            },
            'updateServerInfo': function() {
                s(`#server-ws`)['val'](this['ws']), s(`#server-token`).val(this[`serverToken`]), s(`#party-token, .party-token`).val(this['partyToken']);
            },
            'gameServerConnect': function(t) {
                t && (this[`skipServerData`] = !0, e[`core`] && e['core']['connect'] && e[`core`]['connect'](t));
            },
            'gameServerReconnect': function() {
                e['MC'] && e['MC']['reconnect'] ? e['MC'][`reconnect`]() : e['master'] && e[`master`][`reconnect`] && e[`master`][`reconnect`]();
            },
            'gameServerJoin': function(t) {
                var e = this[`recreateWS`](t);
                e && (this[`skipServerData`] = !0, this[`gameServerConnect`](e));
            },
            'connect': function() {
                this[`closeConnection`](), this[`flushData`](), this[`setParty`](), console[`log`](`[Legend mod Express] Connecting to server`), this['privateMode'] && this[`privateIP`] ? this[`socket`] = new WebSocket(this[`privateIP`]) : this[`socket`] = new WebSocket(this[`publicIP`]), this[`socket`][`ogarioWS`] = !0, this[`socket`][`binaryType`] = `arraybuffer`;
                var t = this;
                this[`socket`][`onopen`] = function() {
                    console['log']('[Legend mod Express] Socket open');
                    var e = t['createView'](3);
                    e[`setUint8`](0, 0), e[`setUint16`](1, 401, !0), t['sendBuffer'](e), t[`sendPartyData`]();
                }, this[`socket`][`onmessage`] = function(e) {
                    t[`handleMessage`](e);
                }, this[`socket`][`onclose`] = function(e) {
                    t[`flushData`](), console[`log`](`[Legend mod Express] Socket close`, e);
                }, this[`socket`][`onerror`] = function(e) {
                    t[`flushData`](), console[`log`](`[Legend mod Express] Socket error`, e);
                };
            },
            'closeConnection': function() {
                if (this[`socket`]) {
                    this[`socket`][`onmessage`] = null;
                    try {
                        this['socket'][`close`]();
                    } catch (ogarcloseconlabel) {}
                    this[`socket`] = null;
                }
            },
            'reconnect': function() {
                this[`setParty`]();
                var t = this;
                setTimeout(function() {
                    t[`connect`]();
                }, 1000);
            },
            'switchServerMode': function() {
                this[`privateIP`] && (this['privateMode'] = !this[`privateMode`], this['isSocketOpen']() && (this[`closeConnection`](), toastr[`error`](`Zamknięto połączenie z serwerem!`)), this[`privateMode`] ? (toastr[`info`]('Przełączono na serwer prywatny!'), s(`.party-panel`)[`show`]()) : (toastr[`info`](`Przełączono na serwer publiczny!`), s(`#active-parties`)[`empty`](), s(`.party-panel`)['hide']()), this[`onJoin`](), i['play'] && this[`onPlayerSpawn`]());
            },
            'isSocketOpen': function() {
                return null !== this['socket'] && this['socket'][`readyState`] === this[`socket`][`OPEN`];
            },
            'createView': function(t) {
                return new DataView(new ArrayBuffer(t));
            },
            'strToBuff': function(t, e) {
                var i = this[`createView`](1 + 2 * e['length']);
                i['setUint8'](0, t);
                for (var s = 0; s < e[`length`]; s++) i[`setUint16`](1 + 2 * s, e[`charCodeAt`](s), !0);
                return i;
            },
            'sendBuffer': function(t) {
                this[`socket`][`send`](t[`buffer`]);
            },
            'handleMessage': function(t) {
                this['readMessage'](new DataView(t[`data`]));
            },
            'readMessage': function(t) {
                switch (t[`getUint8`](0)) {
                    case 0:
                        this[`playerID`] = t['getUint32'](1, !0);
                        break;
                    case 1:
                        this[`sendPlayerUpdate`]();
                        break;
                    case 20:
                        this['updateTeamPlayer'](t);
                        break;
                    case 30:
                        this[`updateTeamPlayerPosition`](t);
                        break;
                    case 96:
                        break;
                    case 100:
                        this['readChatMessage'](t);
                }
            },
            'sendPlayerState': function(t) {
                if (this[`isSocketOpen`]()) {
                    var e = this['createView'](1);
                    e[`setUint8`](0, t), this[`sendBuffer`](e);
                }
            },
            'sendPlayerSpawn': function() {
                this[`sendPlayerState`](1);
            },
            'sendPlayerDeath': function() {
                this[`sendPlayerState`](2);
            },
            'sendPlayerJoin': function() {
                this[`sendPlayerState`](3);
            },
            'sendPlayerData': function(t, e, i) {
                null !== this[e] && this[e] === i || this[`isSocketOpen`]() && (this[`sendBuffer`](this[`strToBuff`](t, i)), this[e] = i);
            },
            'sendPlayerNick': function() {
                this[`sendPlayerData`](10, 'lastSentNick', ogarcopythelb[`nick`]);
            },
            'sendPlayerClanTag': function() {
                this[`sendPlayerData`](11, `lastSentClanTag`, ogarcopythelb[`clanTag`]);
            },
            'sendPlayerSkinURL': function() {
                this['sendPlayerData'](12, `lastSentSkinURL`, ogarcopythelb['skinURL']);
            },
            'sendPlayerCustomColor': function() {
                this[`sendPlayerData`](13, `lastSentCustomColor`, ogarcopythelb[`color`]);
            },
            'sendPlayerColor': function() {
                this[`isSocketOpen`]() && i[`playerColor`] && this['sendBuffer'](this[`strToBuff`](14, i[`playerColor`]));
            },
            'sendPartyToken': function() {
                this[`setParty`](), this[`sendPlayerData`](15, `lastSentPartyToken`, this[`partyToken`]);
            },
            'sendServerToken': function() {
                this[`sendPlayerData`](16, 'lastSentServerToken', this[`serverToken`]);
            },
            'sendServerJoin': function() {
                this['sendServerToken'](), this[`sendPlayerJoin`]();
            },
            'sendServerRegion': function() {
                if (this[`region`]) {
                    var t = this[`region`][`split`]('-');
                    this[`isSocketOpen`]() && this[`sendBuffer`](this[`strToBuff`](17, t[0]));
                }
            },
            'sendServerGameMode': function() {
                var t = `FFA`;
                switch (this[`gameMode`]) {
                    case `:battleroyale`:
                        t = `BTR`;
                        break;
                    case `:teams`:
                        t = `TMS`;
                        break;
                    case ':experimental':
                        t = `EXP`;
                        break;
                    case ':party':
                        t = `PTY`;
                }
                this[`isSocketOpen`]() && this[`sendBuffer`](this[`strToBuff`](18, t));
            },
            'sendServerData': function() {
                this[`skipServerData`] ? this[`skipServerData`] = !1 : (this['region'] = s('#region').val(), this[`gameMode`] = s('#gamemode').val(), this['sendServerRegion'](), this[`sendServerGameMode`]());
            },
            'sendPartyData': function() {
                this[`sendPlayerClanTag`](), this['sendPartyToken'](), this['sendServerToken'](), this[`sendPlayerNick`]();
            },
            'sendPlayerUpdate': function() {
                if (this[`isSocketOpen`]() && i[`play`] && this['playerID'] && i[`playerColor`]) {
                    function t(t) {
                        for (var e = 0; e < t[`length`]; e++) s[`setUint16`](o, t[`charCodeAt`](e), !0), o += 2;
                        s[`setUint16`](o, 0, !0), o += 2;
                    }
                    var e = 41;
                    e += 2 * ogarcopythelb[`nick`][`length`], e += 2 * ogarcopythelb[`skinURL`][`length`];
                    var s = this['createView'](e);
                    s[`setUint8`](0, 20), s[`setUint32`](1, this[`playerID`], !0);
                    var o = 5;
                    t(ogarcopythelb[`nick`]), t(ogarcopythelb['skinURL']), t(ogarcopythelb[`color`]), t(i['playerColor']), this['sendBuffer'](s);
                }
            },
            'sendPlayerPosition': function() {
                if (this['isSocketOpen']() && i[`play`] && this[`playerID`]) {
                    var t = this['createView'](17);
                    t[`setUint8`](0, 30), t[`setUint32`](1, this[`playerID`], !0), t['setInt32'](5, this[`getPlayerX`](), !0), t[`setInt32`](9, this['getPlayerY'](), !0), void 0 !== i[`playerMass`] ? t[`setUint32`](13, i[`playerMass`], !0) : t['setUint32'](13, this[`playerMass`], !0), this[`sendBuffer`](t);
                }
            },
            'checkPlayerID': function(t) {
                if (t)
                    for (var e = 0; e < this[`teamPlayers`][`length`]; e++)
                        if (this['teamPlayers'][e]['id'] == t) return e;
                return null;
            },
            'updateTeamPlayer': function(t) {
                function e() {
                    for (var e = '';;) {
                        var i = t[`getUint16`](s, !0);
                        if (0 == i) break;
                        e += String[`fromCharCode`](i), s += 2;
                    }
                    return s += 2, e;
                }
                var i = t[`getUint32`](1, !0),
                    s = 5,
                    o = e(),
                    a = this[`checkSkinURL`](e()),
                    n = e(),
                    r = e(),
                    l = `:party` === this[`gameMode`] ? o + r : o,
                    h = this['checkPlayerID'](i);
                if (null !== h) this[`teamPlayers`][h][`nick`] = o, this[`teamPlayers`][h][`skinID`] = l, this['teamPlayers'][h][`skinURL`] = a, this[`teamPlayers`][h][`setColor`](r, n);
                else {
                    var c = new function(t, e, i, s) {
                        this['id'] = t, this[`nick`] = e, this['skinID'] = i, this[`skinURL`] = s, this['x'] = 0, this['y'] = 0, this[`lastX`] = 0, this['lastY'] = 0, this['mass'] = 0, this['clanTag'] = '', this[`color`] = null, this[`customColor`] = g['miniMapTeammatesColor'], this['alive'] = !1, this['updateTime'] = null, this['pi2'] = 2 * Math['PI'], this['setColor'] = function(t, e) {
                            this[`color`] = t, 7 == e[`length`] && (this[`customColor`] = e);
                        }, this[`drawPosition`] = function(t, e, i, s, o) {
                            if (!(!this[`alive`] || s && o && this['id'] != o)) {
                                this[`lastX`] = (29 * this[`lastX`] + this['x']) / 30, this[`lastY`] = (29 * this['lastY'] + this['y']) / 30;
                                var a = (this[`lastX`] + e) * i,
                                    n = (this[`lastY`] + e) * i;
                                this[`nick`][`length`] > 0 && (t[`font`] = g['miniMapNickFontWeight'] + ' ' + g[`miniMapNickSize`] + 'px ' + g[`miniMapNickFontFamily`], t[`textAlign`] = `center`, g[`miniMapNickStrokeSize`] > 0 && (t[`lineWidth`] = g[`miniMapNickStrokeSize`], t[`strokeStyle`] = g[`miniMapNickStrokeColor`], t['strokeText'](this[`nick`], a, n - (2 * g['miniMapTeammatesSize'] + 2))), t[`fillStyle`] = g[`miniMapNickColor`], t['fillText'](this[`nick`], a, n - (2 * g[`miniMapTeammatesSize`] + 2))), t[`beginPath`](), t[`arc`](a, n, g[`miniMapTeammatesSize`], 0, this['pi2'], !1), t[`closePath`](), v[`oneColoredTeammates`] ? t['fillStyle'] = g[`miniMapTeammatesColor`] : t[`fillStyle`] = this[`customColor`], t[`fill`]();
                            }
                        };
                    }(i, o, l, a);
                    c[`setColor`](r, n), this[`teamPlayers`]['push'](c);
                }
                this['cacheCustomSkin'](o, r, a);
            },
            'updateTeamPlayerPosition': function(t) {
                var e = t[`getUint32`](1, !0),
                    i = this[`checkPlayerID`](e);
                if (null !== i) {
                    var s = t[`getInt32`](5, !0),
                        o = t[`getInt32`](9, !0),
                        a = t[`getUint32`](13, !0);
                    if (a > 360000) return;
                    var n = this[`teamPlayers`][i];
                    n['x'] = s, n['y'] = o, n['mass'] = a, n[`alive`] = !0, n[`updateTime`] = Date[`now`](), this[`targeting`] && this[`targetID`] && e == this[`targetID`] && this['updateTarget'](n[`nick`], n[`skinURL`], s, o, a, n[`color`]);
                }
            },
            'updateTeamPlayers': function() {
                this[`sendPlayerPosition`](), this[`chatUsers`] = {}, this[`top5`] = [];
                for (var t = 0; t < this[`teamPlayers`][`length`]; t++) {
                    var e = this[`teamPlayers`][t];
                    (e[`alive`] && Date[`now`]() - e[`updateTime`] >= 2000 || 0 == e['mass']) && (e[`alive`] = !1, this[`targeting`] && this[`targetID`] && e['id'] == this[`targetID`] && this[`setTargetStatus`](2)), e[`alive`] && (this[`top5`][`push`]({
                        'id': e['id'],
                        'nick': e[`nick`],
                        'x': e['x'],
                        'y': e['y'],
                        'mass': e['mass'],
                        'color': e['color']
                    }), this[`isChatUserMuted`](e['id']) || this[`addChatUser`](e['id'], e['nick']));
                }
                this[`top5`][`sort`](function(t, e) {
                    return e[`mass`] - t[`mass`];
                }), this[`displayTop5`]();
            },
            'updateParties': function(t) {
                this['parties'] = [];
                for (var e = t[`getUint8`](1), i = 2, s = 0; s < e; s++) {
                    for (var o = '';;) {
                        var a = t[`getUint16`](i, !0);
                        if (0 == a) break;
                        o += String['fromCharCode'](a), i += 2;
                    }
                    i += 2, this[`parties`]['push'](o);
                }
            },
            'readChatMessage': function(t) {
                if (!v[`disableChat`]) {
                    var e = new Date()[`toTimeString`]()[`replace`](/^(\d{2}:\d{2}).*/, '$1'),
                        i = t[`getUint8`](1),
                        s = t['getUint32'](2, !0),
                        o = t[`getUint32`](6, !0);
                    if (!(this[`isChatUserMuted`](s) || 0 != o && o != this['playerID'] && s != this[`playerID`])) {
                        for (var a = '', n = 10; n < t[`byteLength`]; n += 2) {
                            var r = t['getUint16'](n, !0);
                            if (0 == r) break;
                            a += String[`fromCharCode`](r);
                        }
                        this[`displayChatMessage`](e, i, s, a);
                    }
                }
            },
            'sendChatMessage': function(t, e) {
                if (!(Date[`now`]() - this[`lastMessageSentTime`] < 500 || 0 == e[`length`] || 0 == ogarcopythelb[`nick`][`length`]) && this['isSocketOpen']()) {
                    e = ogarcopythelb['nick'] + ': ' + e;
                    var i = this[`createView`](10 + 2 * e['length']);
                    i['setUint8'](0, 100), i[`setUint8`](1, t), i[`setUint32`](2, this[`playerID`], !0), i[`setUint32`](6, 0, !0);
                    for (var s = 0; s < e[`length`]; s++) i[`setUint16`](10 + 2 * s, e['charCodeAt'](s), !0);
                    this[`sendBuffer`](i), this[`lastMessageSentTime`] = Date[`now`]();
                }
            },
            'prepareCommand': function(t) {
                return t[`replace`](`%currentSector%`, this[`currentSector`]);
            },
            'sendCommand': function(t) {
                var e = this[`prepareCommand`](c[`comm` + t]);
                this[`sendChatMessage`](102, e);
            },
            'addChatUser': function(t, e) {
                this['chatUsers'][t] = e;
            },
            'getChatUserNick': function(t) {
                return this[`chatUsers`].hasOwnProperty(t) ? this[`chatUsers`][t] : '';
            },
            'muteChatUser': function(t) {
                if (t && !this[`isChatUserMuted`](t)) {
                    var e = this['getChatUserNick'](t);
                    this[`chatMutedUsers`][t] = e, this[`chatMutedUserIDs`]['push'](t), toastr[`error`](h[`userMuted`][`replace`](`%user%`, `<strong>` + this[`escapeHTML`](e) + `</strong>`) + ` <button data-user-id=\"` + t + `\" class=\"btn btn-xs btn-green btn-unmute-user\">` + h['unmute'] + `</button>`);
                }
            },
            'unmuteChatUser': function(t) {
                if (t) {
                    var e = this['chatMutedUserIDs'].indexOf(t); - 1 != e && (this['chatMutedUserIDs'][`splice`](e, 1), toastr[`info`](h[`userUnmuted`]['replace'](`%user%`, `<strong>` + this[`escapeHTML`](this[`chatMutedUsers`][t]) + `</strong>`)), delete this[`chatMutedUsers`][t]);
                }
            },
            'isChatUserMuted': function(t) {
                return -1 != this[`chatMutedUserIDs`]['indexOf'](t);
            },
            'parseMessage': function(t) {
                var e = /\[img\](https?:\/\/i\.(?:imgur|hizliresim)\.com\/\w{6,8}\.(?:jpg|jpeg|png|gif)\??\d*)\[\/img\]/i;
                if (e[`test`](t)) return v['showChatImages'] ? '<img src=\"' + t[`match`](e)[1][`replace`](`http:`, `https:`) + `\" style=\"width:100%;border:none;\">` : '';
                var i = /\[yt\]([\w-]{11})\[\/yt\]/i;
                if (i['test'](t)) return v['showChatVideos'] ? `<iframe type=\"text/html\" width=\"100%\" height=\"auto\" src=\"https://www.youtube.com/embed/` + t['match'](i)[1] + `?autoplay=1&amp;vq=tiny\" frameborder=\"0\" />` : '';
                var s = this[`escapeHTML`](t);
                return v[`chatEmoticons`] && (s = this[`parseEmoticons`](s)), s;
            },
            'parseEmoticons': function(t) {
                return String(t)[`replace`](/\&lt\;3/g, '<3')['replace'](/(O\:\)|3\:\)|8\=\)|\:\)|\;\)|\=\)|\:D|X\-D|\=D|\:\(|\;\(|\:P|\;P|\:\*|\$\)|\<3|\:o|\(\:\||\:\||\:\\|\:\@|\|\-\)|\^\_\^|\-\_\-|\$\_\$|\(poop\)|\(fuck\)|\(clap\)|\(ok\)|\(victory\)|\(y\)|\(n\))/g, function(t) {
                    return `<img src=\"https://cdn.ogario.ovh/static/emoticons/` + d[t] + `\" alt=\"` + t + `\" class=\"emoticon\">`;
                });
            },
            'displayChatMessage': function(t, e, i, o) {
                if (0 != o[`length`]) {
                    var a = o[`split`](': ', 1)[`toString`](),
                        n = this[`parseMessage`](o[`replace`](a + ': ', ''));
                    if (!(0 == a[`length`] || a[`length`] > 15 || 0 == n[`length`])) {
                        var r = '';
                        if (0 != i && i != this['playerID'] && (this[`addChatUser`](i, a), r = '<a href=\"#\" data-user-id=\"' + i + `\" class=\"mute-user ogicon-user-minus\"></a> `), a = this[`escapeHTML`](a), 101 == e) {
                            if (v[`showChatBox`]) return s(`#chat-box`).append(`<div class=\"message\"><span class=\"message-time\">[` + t + `] </span>` + r + `<span class=\"message-nick\">` + a + `: </span><span class=\"message-text\">` + n + `</span></div>`), s(`#chat-box`)['perfectScrollbar'](`update`), s(`#chat-box`)[`animate`]({
                                'scrollTop': s(`#chat-box`)['prop']('scrollHeight')
                            }, 500), void(v[`chatSounds`] && this[`playSound`](this[`messageSound`]));
                            v[`hideChat`] || (toastr[`success`]('<span class=\"message-nick\">' + a + ': </span><span class=\"message-text\">' + n + `</span>` + r), v['chatSounds'] && this[`playSound`](this[`messageSound`])), this[`chatHistory`][`push`]({
                                'nick': a,
                                'message': n
                            }), this['chatHistory'][`length`] > 15 && this[`chatHistory`][`shift`]();
                        } else if (102 == e) {
                            if (v[`showChatBox`]) return s(`#chat-box`).append(`<div class=\"message command\"><span class=\"command-time\">[` + t + '] </span>' + r + `<span class=\"command-nick\">` + a + `: </span><span class=\"command-text\">` + n + `</span></div>`), s(`#chat-box`)[`perfectScrollbar`]('update'), s('#chat-box')[`animate`]({
                                'scrollTop': s('#chat-box')[`prop`]('scrollHeight')
                            }, 500), void(v['chatSounds'] && this[`playSound`](this[`commandSound`]));
                            v[`hideChat`] || (toastr[`warning`](`<span class=\"command-nick\">` + a + `: </span><span class=\"command-text\">` + n + `</span>` + r), v['chatSounds'] && this[`playSound`](this['commandSound']));
                        } else s(`#messages`).append(o);
                    }
                }
            },
            'displayUserList': function(t, e, i, s, o) {
                var a = '';
                if (Object[`keys`](t)[`length`]) {
                    for (var n in a += '<ol class=\"user-list\">', t) t.hasOwnProperty(n) && (a += `<li><strong>` + this[`escapeHTML`](t[n]) + '</strong> <button data-user-id=\"' + n + `\" class=\"btn btn-xs ` + i + '\">' + s + `</button></li>`);
                    a += `</ol>`;
                } else a += h['none'];
                toastr[o](a, e, {
                    'closeButton': !0,
                    'tapToDismiss': !1
                });
            },
            'displayChatActiveUsers': function() {
                this[`displayUserList`](this[`chatUsers`], h['activeUsers'], `btn-red btn-mute-user`, h[`mute`], `info`);
            },
            'displayChatMutedUsers': function() {
                this[`displayUserList`](this[`chatMutedUsers`], h['mutedUsers'], `btn-green btn-unmute-user`, h[`unmute`], `error`);
            },
            'preloadChatSounds': function() {
                this[`setMessageSound`](), this[`setCommandSound`]();
            },
            'setChatSoundsBtn': function() {
                v[`chatSounds`] ? s(`.chat-sound-notifications`)[`removeClass`](`ogicon-volume-mute2`)[`addClass`](`ogicon-volume-high`) : s(`.chat-sound-notifications`)[`removeClass`](`ogicon-volume-high`)[`addClass`](`ogicon-volume-mute2`);
            },
            'setMessageSound': function() {
                this[`messageSound`] = this[`setSound`](v[`messageSound`]);
            },
            'setCommandSound': function() {
                this[`commandSound`] = this[`setSound`](v[`commandSound`]);
            },
            'setSound': function(t) {
                return t ? new Audio(t) : null;
            },
            'playSound': function(t) {
                t && t[`play`] && (t[`pause`](), t['currentTime'] = 0, t[`play`]());
            },
            'setTargeting': function() {
                this[`targetID`] && (this['targeting'] = !this[`targeting`], i[`targeting`] = this['targeting'], this['setTargetingInfo']());
            },
            'setTargetingInfo': function() {
                this[`targeting`] ? (s(`#set-targeting`)[`addClass`](`active`), s(`#target-status`)[`show`](), 2 != this[`targetStatus`] && s('#target-summary')[`show`]()) : (s(`#set-targeting`)[`removeClass`]('active'), s(`#target-summary, #target-status`)['hide']());
            },
            'cancelTargeting': function() {
                this[`setTargetStatus`](0);
            },
            'setPrivateMiniMap': function() {
                this[`targetID`] && (this['privateMiniMap'] = !this['privateMiniMap'], this[`privateMiniMap`] ? s(`#set-private-minimap`)[`addClass`]('active') : s(`#set-private-minimap`)['removeClass'](`active`));
            },
            'setTarget': function(t) {
                var e = this[`checkPlayerID`](t);
                if (null !== e) {
                    var i = this[`teamPlayers`][e];
                    if (this[`targetID`] = i['id'], this[`updateTarget`](i[`nick`], i['skinURL'], i['x'], i['y'], i[`mass`], i['color']), !i[`alive`]) return void this[`setTargetStatus`](2);
                    this[`setTargetStatus`](1);
                } else this[`setTargetStatus`](0);
            },
            'setTargetStatus': function(t) {
                switch (t) {
                    case 0:
                        this['targetStatus'] = 0, this[`targetID`] = 0, this[`targetNick`] = '', this[`targetSkinURL`] = '', this[`targeting`] = !1, i[`targeting`] = !1, this[`privateMiniMap`] = !1, s(`#target-skin, #target-nick, #target-summary`)[`hide`](), s(`#target-status`)[`show`]()[`text`]('[' + h[`targetNotSet`] + ']'), s(`#target-panel-hud a`)['removeClass']('active');
                        break;
                    case 1:
                        this[`targetStatus`] = 1, this['targeting'] || (this[`targeting`] = !0, i[`targeting`] = !0, this[`setTargetingInfo`]()), s(`#target-skin, #target-nick, #target-status, #target-summary`)[`show`]();
                        break;
                    case 2:
                        this[`targetStatus`] = 2, s(`#target-summary`)[`hide`](), s(`#target-status`)[`show`]()[`text`]('[' + h[`targetDead`] + ']'), i[`resetTargetPosition`]();
                }
            },
            'changeTarget': function() {
                for (var t = this[`checkPlayerID`](this['targetID']), e = null, i = 0; i < this[`teamPlayers`][`length`]; i++)
                    if (this[`teamPlayers`][i]['alive']) {
                        if (null === t) {
                            t = i;
                            break;
                        }
                        if (i < t && null === e) e = i;
                        else if (i > t) {
                            e = i;
                            break;
                        }
                    } null !== e && (t = e), null !== t ? this['setTarget'](this[`teamPlayers`][t]['id']) : this[`setTargetStatus`](0);
            },
            'updateTarget': function(t, e, o, a, n, r) {
                i[`setTargetPosition`](o, a), this[`targetNick`] !== t && (this[`targetNick`] = t, s('#target-nick')[`html`](this['escapeHTML'](t))), s(`#target-skin`).css(`background-color`, r), e && this[`targetSkinURL`] !== e && (this[`customSkinsCache`].hasOwnProperty(e + '_cached') ? (s(`#target-skin img`)[`attr`]('src', e), this[`targetSkinURL`] = e) : s(`#target-skin img`)[`attr`](`src`, `https://cdn.ogario.ovh/static/img/blank.png`)), s(`#target-status`)[`text`]('[' + this[`shortMassFormat`](n) + ']');
                var l = this[`calculateMapSector`](o, a),
                    c = h[`targetDistance`] + `: <span class=\"hud-main-color\">` + i[`targetDistance`] + ' [' + l + ']</span>';
                i[`play`] && (c += ` | ` + h[`targetMass`] + `: <span class=\"hud-main-color\">` + this[`shortMassFormat`](n + i[`playerMass`]) + `</span>`), s(`#target-summary`)[`html`](c), 1 != this[`targetStatus`] && this[`setTargetStatus`](1);
            },
            'updateQuest': function() {
                this[`showQuest`] && `:ffa` === this[`gameMode`] && e['MC'] && e['MC'][`getQuestProgressLabel`] && (this['questHUD'][`textContent`] = e['MC'][`getQuestProgressLabel`]());
            },
            'init': function() {
                this['loadSettings'](), this['loadProfiles'](), this[`setLang`](), this[`setMenu`](), this['setUI'](), y && y.setTheme(), this['setShowQuickMenu'](), this[`setShowSkinsPanel`](), this[`setProfile`](), this[`setMainButtons`](), this[`setStreamMode`](), this[`setHideSkinUrl`](), this[`setMiniMap`](), this['setAutoResp'](), this[`setDisableChat`](), this[`setShowChatBox`](), this[`setTop5`](), this[`setTargetingHUD`](), this[`setQuest`](), this[`displayTime`](), this[`setCenteredLb`](), this[`setNormalLb`](), this[`setFpsAtTop`](), this[`displayStats`](), this[`setBlockPopups`](), this['preloadChatSounds'](), this[`setChatSoundsBtn`]();
                var t = this;
                setInterval(function() {
                    t['drawMiniMap']();
                }, 33), setInterval(function() {
                    t[`updateTeamPlayers`]();
                }, this[`updateInterval`]);
            }
        };

        function irenderfromagario() {
            this[`txt`] = '',
                this[`txtCanvas`] = null,
                this[`txtCtx`] = null,
                this[`color`] = `#FFFFFF`,
                this[`stroke`] = !1,
                this[`strokeWidth`] = 2,
                this[`strokeColor`] = `#000000`,
                this[`font`] = `700 16px Ubuntu`,
                this[`fontFamily`] = 'Ubuntu',
                this[`fontWeight`] = 700,
                this['fontSize'] = 16,
                this['margin'] = 3,
                this['scale'] = 1,
                this['quality'] = 1,
                this[`measuredWidth`] = 0,
                this[`redraw`] = !1,
                this[`remeasure`] = !1,
                this[`setTxt`] = function(ogariosettxtsetter) {
                    this[`txt`] !== ogariosettxtsetter && (this['txt'] = ogariosettxtsetter,
                        this[`redraw`] = !0,
                        this[`remeasure`] = !0);
                },
                this[`setColor`] = function(ogariocolorsetter) {
                    this[`color`] !== ogariocolorsetter && (this['color'] = ogariocolorsetter,
                        this['redraw'] = !0);
                },
                this['setStroke'] = function(ogariostrokesetter) {
                    this['stroke'] !== ogariostrokesetter && (this['stroke'] = ogariostrokesetter,
                        this[`redraw`] = !0);
                },
                this[`setStrokeWidth`] = function(ogariostrokewidthsetter) {
                    this['stroke'] && this['strokeWidth'] != ogariostrokewidthsetter && (this[`strokeWidth`] = ogariostrokewidthsetter,
                        this[`redraw`] = !0,
                        this[`remeasure`] = !0);
                },
                this[`setStrokeColor`] = function(ogariostrokecolorsetter) {
                    this[`stroke`] && this[`strokeColor`] !== ogariostrokecolorsetter && (this[`strokeColor`] = ogariostrokecolorsetter,
                        this[`redraw`] = !0);
                },
                this.setFont = function() {
                    this[`font`] = this[`fontWeight`] + ' ' + this[`fontSize`] + `px ` + this[`fontFamily`];
                },
                this[`setFontFamily`] = function(ogariofontfamilysetter) {
                    this['fontFamily'] !== ogariofontfamilysetter && (this[`fontFamily`] = ogariofontfamilysetter,
                        this.setFont(),
                        this[`redraw`] = !0,
                        this[`remeasure`] = !0);
                },
                this.setFontWeight = function(ogariofontweightsetter) {
                    this['fontWeight'] != ogariofontweightsetter && (this['fontWeight'] = ogariofontweightsetter,
                        this.setFont(),
                        this[`redraw`] = !0,
                        this[`remeasure`] = !0);
                },
                this[`setFontSize`] = function(ogariofontsizesetter) {
                    this['fontSize'] != ogariofontsizesetter && (this[`fontSize`] = ogariofontsizesetter,
                        this[`margin`] = ~~(0.2 * ogariofontsizesetter),
                        this.setFont(),
                        this[`redraw`] = !0);
                },
                this[`setScale`] = function(ogarioscalesetter) {
                    this[`scale`] != ogarioscalesetter && (this[`scale`] = ogarioscalesetter,
                        this[`redraw`] = !0);
                },
                this[`createCanvas`] = function() {
                    this[`txtCanvas`] || (this[`txtCanvas`] = document[`createElement`]('canvas'),
                        this[`txtCtx`] = this[`txtCanvas`][`getContext`]('2d'),
                        this[`txtCtx`][`ogarioCtx`] = !0);
                },
                this[`setDrawing`] = function(ogarsetDrawinglabel1, ogarsetDrawinglabel2, ogarsetDrawinglabel3, ogarsetDrawinglabel4, ogarsetDrawinglabel5, ogarsetDrawinglabel6) {
                    this[`setColor`](ogarsetDrawinglabel1),
                        this[`setFontFamily`](ogarsetDrawinglabel2),
                        this.setFontWeight(ogarsetDrawinglabel3),
                        this[`setStroke`](ogarsetDrawinglabel4),
                        this['setStrokeWidth'](ogarsetDrawinglabel5),
                        this[`setStrokeColor`](ogarsetDrawinglabel6);
                },
                this[`measureWidth`] = function() {
                    return this[`remeasure`] && (this[`txtCtx`][`font`] = this[`fontWeight`] + ` 10px ` + this[`fontFamily`],
                            this[`measuredWidth`] = this[`txtCtx`]['measureText'](this[`txt`])['width'],
                            this[`remeasure`] = !1),
                        ~~(this[`fontSize`] / 10 * this[`measuredWidth`]) + 2 * this[`strokeWidth`];
                },
                this[`drawTxt`] = function() {
                    return this[`createCanvas`](),
                        this['redraw'] && (this[`redraw`] = !1,
                            this['txtCanvas'][`width`] = this[`measureWidth`](),
                            this[`txtCanvas`][`height`] = this[`fontSize`] + this[`margin`] * 2,
                            this[`txtCtx`][`font`] = this[`font`],
                            this[`txtCtx`][`globalAlpha`] = 1,
                            this[`txtCtx`]['lineWidth'] = this[`strokeWidth`],
                            this[`txtCtx`][`strokeStyle`] = this[`strokeColor`],
                            this[`txtCtx`][`fillStyle`] = this[`color`],
                            this[`stroke`] && this[`txtCtx`][`strokeText`](this[`txt`], this[`strokeWidth`], ~~(this[`fontSize`] + this[`margin`] * 0.5)),
                            this['txtCtx'][`fillText`](this[`txt`], this[`strokeWidth`], ~~(this[`fontSize`] + this[`margin`] * 0.5))),
                        this[`txtCanvas`];
                };
        }
		window.legendmod3 = ogarminimapdrawer; 
        function ogarbasicassembly(t, e, s, o, a, n, r, l, h, c) {
            this['id'] = t, this['x'] = e, this['y'] = s, this[`targetX`] = e, this[`targetY`] = s, this[`color`] = a, this[`oppColor`] = null, this['size'] = o, this[`targetSize`] = o, this[`alpha`] = 1, this['nick'] = '', this['targetNick'] = '', this[`nickCanvas`] = null, this[`mass`] = 0, this[`lastMass`] = 0, this[`kMass`] = 0, this['massCanvas'] = null, this['massTxt'] = '', this[`margin`] = 0, this['scale'] = 1, this['nickScale'] = 1, this[`massScale`] = 1, this[`virMassScale`] = 3, this[`strokeScale`] = 1, this[`fontSize`] = 0x1a, this['nickSize'] = 0x1a, this[`lastNickSize`] = 0, this[`massSize`] = 0x1a, this[`virMassSize`] = 0x1a, this[`nickStrokeSize`] = 3, this[`massStrokeSize`] = 3, this[`isFood`] = n, this[`isVirus`] = r, this['isPlayerCell'] = l, this[`shortMass`] = h, this[`virMassShots`] = c, this[`rescale`] = !1, this[`redrawNick`] = !0, this[`redrawMass`] = !0, this[`optimizedNames`] = !1, this[`optimizedMass`] = !1, this[`strokeNick`] = !1, this[`strokeMass`] = !1, this[`removed`] = !1, this[`redrawed`] = 0, this[`time`] = 0, this[`skin`] = null, this[`pi2`] = 2 * Math['PI'],
                this.virusColor = null,
                this.virusStroke = null,
                this.nHeight = 6,
                this['update'] = function(t, e, i, s, o, a) {
                    this['x'] = t, this['y'] = e, this[`isVirus`] = s, this[`isPlayerCell`] = o, this['setMass'](i), this[`setNick`](a);
                }, this[`removeCell`] = function() {
                    this[`removed`] = !0;
                    var t = M[`cells`]['indexOf'](this); - 1 != t ? (M[`cells`][`splice`](t, 1), v[`virusesRange`] && -1 != (t = M[`viruses`].indexOf(this)) && M[`viruses`][`splice`](t, 1)) : -1 != (t = M[`food`].indexOf(this)) && M[`food`]['splice'](t, 1), -1 != (t = M[`playerCells`].indexOf(this)) && (M['removePlayerCell'] = !0, M[`playerCells`][`splice`](t, 1), -1 != (t = M[`playerCellIDs`].indexOf(this['id'])) && M[`playerCellIDs`]['splice'](t, 1)), this[`redrawed`] && M[`removedCells`][`push`](this), delete M[`indexedCells`][this['id']];
                }, this[`moveCell`] = function() {
                    var t = (M[`time`] - this[`time`]) / v[`animation`];
                    if (t = t < 0 ? 0 : t > 1 ? 1 : t, this['x'] += (this[`targetX`] - this['x']) * t, this['y'] += (this[`targetY`] - this['y']) * t, this[`size`] += (this['targetSize'] - this[`size`]) * t, this[`alpha`] = t, this[`removed`]) {
                        if (1 == t) {
                            var e = M[`removedCells`].indexOf(this); - 1 != e && M[`removedCells`][`splice`](e, 1);
                        }
                    } else this[`time`] = M[`time`];
                }, this[`isInView`] = function() {
                    return !(this['id'] <= 0) && !(this['x'] + this[`size`] + 40 < M[`viewX`] - M[`canvasWidth`] / 2 / M[`scale`] || this['y'] + this[`size`] + 40 < M[`viewY`] - M['canvasHeight'] / 2 / M['scale'] || this['x'] - this[`size`] - 40 > M[`viewX`] + M[`canvasWidth`] / 2 / M[`scale`] || this['y'] - this['size'] - 40 > M['viewY'] + M[`canvasHeight`] / 2 / M[`scale`]);
                }, this[`setMass`] = function(t) {
                    return this[`size`] = t, !(t <= 40) && (this['massCanvas'] ? (this[`mass`] = ~~(t * t / 100), this[`redrawMass`] = !0, this[`isVirus`] ? (this[`virMassShots`] && this[`mass`] < 200 && (this[`mass`] = ~~((200 - this[`mass`]) / 14)), this[`massTxt`] = this[`mass`][`toString`](), this.mass > 220 ? (this.virusColor = g.mVirusColor, this.virusStroke = g.mVirusStrokeColor) : (this.virusColor = g.virusColor, this.virusStroke = g.virusStrokeColor), !0) : (this[`massTxt`] = this[`mass`][`toString`](), this['mass'] <= 200 || (this[`shortMass`] && this['mass'] >= 1000 ? (this[`kMass`] = Math[`round`](this[`mass`] / 100) / 10, this['massTxt'] = this[`kMass`] + 'k', !0) : (this[`optimizedMass`] && (this['redrawMass'] = Math[`abs`]((this[`mass`] - this[`lastMass`]) / this[`mass`]) >= 0.02 || this[`rescale`]), !0)))) : (this[`massCanvas`] = new irenderfromagario(), !1));
                }, this[`setNick`] = function(t) {
                    return this[`nick`] = t, !(!t || this[`isVirus`]) && (!!this[`nickCanvas`] || (this[`nickCanvas`] = new irenderfromagario(), !1));
                }, this['setScale'] = function(t, e, i, s, o) {
                    var a = Math[`ceil`](10 * t) / 10;
                    this[`rescale`] = !1, this['scale'] != a && (this[`scale`] = a, this['rescale'] = !0), this[`nickScale`] = e, this['massScale'] = i, this[`virMassScale`] = s, this[`strokeScale`] = o;
                }, this[`setFontSize`] = function() {
                    this[`isVirus`] ? this[`massSize`] = Math[`ceil`](this[`virMassSize`] * this[`scale`] * this[`virMassScale`]) : (this[`fontSize`] = Math[`max`](0.3 * this['size'], 0x1a) * this[`scale`], this[`nickSize`] = ~~(this[`fontSize`] * this[`nickScale`]), this[`massSize`] = ~~(0.5 * this[`fontSize`] * this[`massScale`]), this[`optimizedNames`] ? this[`redrawNick`] = Math[`abs`]((this[`nickSize`] - this['lastNickSize']) / this['nickSize']) >= 0.3 || this['rescale'] : this[`redrawNick`] = !0);
                }, this['setStrokeSize'] = function() {
                    this[`strokeNick`] && !this[`isVirus`] && (this[`nickStrokeSize`] = ~~(0.1 * this[`nickSize`] * this[`strokeScale`])), this[`strokeMass`] && (this[`massStrokeSize`] = ~~(0.1 * this[`massSize`] * this[`strokeScale`]));
                }, this['setDrawing'] = function() {
                    this[`optimizedNames`] = v[`optimizedNames`], this['optimizedMass'] = v['optimizedMass'], this[`shortMass`] = v['shortMass'], this[`virMassShots`] = v[`virMassShots`], this['strokeNick'] = v['namesStroke'], this[`strokeMass`] = v[`massStroke`];
                }, this[`setDrawingScale`] = function() {
                    this[`setScale`](i[`viewScale`], g[`namesScale`], g[`massScale`], g[`virMassScale`], g[`strokeScale`]), this[`setFontSize`](), this[`setStrokeSize`](), this[`margin`] = 0;
                }, this['drawNick'] = function(mainCanvas) {
                    if (this['nick'] && this['nickCanvas'] && !this[`isVirus`]) {
                        var nickCanvas = this[`nickCanvas`];
                        nickCanvas[`setDrawing`](g[`namesColor`], g[`namesFontFamily`], g[`namesFontWeight`], this[`strokeNick`], this[`nickStrokeSize`], g[`namesStrokeColor`]), nickCanvas[`setTxt`](this['nick']), this[`redrawNick`] && (nickCanvas[`setFontSize`](this[`nickSize`]), this[`lastNickSize`] = this['nickSize']), nickCanvas[`setScale`](this[`scale`]);
                        const nickImg = nickCanvas.drawTxt(),
                            w = ~~(nickImg.width / this.scale),
                            h = ~~(nickImg.height / this.scale);
                        this.margin = ~~(h / 2);
                        if (w > 1 && h > 1) {
                            mainCanvas.drawImage(nickImg, ~~(this.x - w / 2), ~~this.y - this.margin, w, h);
                        }
                    }
                }, this[`drawMass`] = function(mainCanvas) {
                    if (this[`massCanvas`] && !(this[`size`] <= 40)) {
                        var massCanvas = this[`massCanvas`];
                        massCanvas['setDrawing'](g[`massColor`], g['massFontFamily'], g['massFontWeight'], this[`strokeMass`], this['massStrokeSize'], g[`massStrokeColor`]), this['redrawMass'] && (massCanvas[`setTxt`](this[`massTxt`]), this[`lastMass`] = this[`mass`]), massCanvas[`setFontSize`](this[`massSize`]), massCanvas[`setScale`](this['scale']);
                        let massImg = massCanvas.drawTxt(),
                            w = ~~(massImg.width / this.scale),
                            h = ~~(massImg.height / this.scale),
                            ogartempmassraw = this.margin === 0 ? ~~(this.y - h / 2) : ~~this.y + this.margin;
                        if (w > 1 && h > 1) {
                            mainCanvas.drawImage(massImg, ~~(this.x - w / 2), ogartempmassraw, w, h);
                        }
                    }
                },
                this.createStrokeVirusPath = function(_x, _y, _radius, width = 6) {
                    const nAngelsOfVirus = ~~(45 * _radius / 98),
                        angleStep2 = this.pi2 / nAngelsOfVirus,
                        angleStep = angleStep2 / 2,
                        ptx = new Path2D(),
                        radius = _radius - width,
                        p1 = radius + this.nHeight,
                        len = this.pi2 + angleStep2;
                    for (let a1 = 0, a2 = angleStep; a1 <= len; a2 = ((a1 += angleStep2) + angleStep)) {
                        ptx.lineTo(~~(_x + radius * Math.sin(a1)), ~~(_y + radius * Math.cos(a1)));
                        ptx.lineTo(~~(_x + p1 * Math.sin(a2)), ~~(_y + p1 * Math.cos(a2)));
                    }
                    return ptx;
                },
                this[`draw`] = function(t, e) {
                    if (!(M[`hideSmallBots`] && this['size'] <= 36)) {
                        t[`save`](), this['redrawed']++, e && this[`moveCell`](), this['removed'] && (t['globalAlpha'] *= 1 - this[`alpha`]);
                        var i = t[`globalAlpha`],
                            s = !1,
                            o = this[`isFood`] ? this[`size`] + g[`foodSize`] : this[`size`];
                        if (t[`beginPath`](), t[`arc`](this['x'], this['y'], o, 0, this[`pi2`], !1), t[`closePath`](), this[`isFood`]) return t[`fillStyle`] = this[`color`], t[`fill`](), void t[`restore`]();
                        if (this[`isVirus`]) {
                            return v[`transparentViruses`] && (t[`globalAlpha`] *= g[`virusAlpha`], s = !0), v['virColors'] && M[`play`] ? (t['fillStyle'] = ogarminimapdrawer[`setVirusColor`](o), t['strokeStyle'] = ogarminimapdrawer[`setVirusStrokeColor`](o)) : (t['fillStyle'] = this.virusColor, t[`strokeStyle`] = this.virusStroke), t[`fill`](), s && (t['globalAlpha'] = i, s = !1), t['lineWidth'] = g[`virusStrokeSize`], t[`stroke`](this.createStrokeVirusPath(this.x, this.y, this.size - 2, 6)), v['showMass'] && (this[`setDrawing`](), this[`setDrawingScale`](), this['setMass'](this['size']), this['drawMass'](t)), void t[`restore`]();
                        }
                        v[`transparentCells`] && (t[`globalAlpha`] *= g[`cellsAlpha`], s = !0);
                        var a = this[`color`];
                        M[`play`] && (this[`isPlayerCell`] ? v[`myCustomColor`] && (a = ogarcopythelb[`color`]) : v[`oppColors`] && !v[`oppRings`] && (a = this['oppColor'])), t[`fillStyle`] = a, t[`fill`](), s && (t['globalAlpha'] = i, s = !1);
                        var n = null;
                        if (v['customSkins'] && M['showCustomSkins'] && (n = ogarminimapdrawer['getCustomSkin'](this['targetNick'], this['color'])) && (((v[`transparentSkins`] || M[`play`] && v[`oppColors`]) && (!this[`isPlayerCell`] || v['myTransparentSkin']) || this['isPlayerCell'] && v['myTransparentSkin']) && (t[`globalAlpha`] *= g[`skinsAlpha`], s = !0), t[`drawImage`](n, this['x'] - o, this['y'] - o, 2 * o, 2 * o), s && (t[`globalAlpha`] = i, s = !1)), v[`teammatesInd`] && !this[`isPlayerCell`] && o <= 200 && (n || ogarminimapdrawer[`checkSkinsMap`](this[`targetNick`], this[`color`])) && ogarfooddrawer[`drawTeammatesInd`](t, this['x'], this['y'], o), v[`noNames`] && !v[`showMass`] || e) t['restore']();
                        else {
                            var r = !1;
                            !this[`isPlayerCell`] && (r = ogarminimapdrawer[`setAutoHideCellInfo`](o)) && v[`autoHideNames`] && v[`autoHideMass`] ? t[`restore`]() : (this[`setDrawing`](), this['setDrawingScale'](), t[`globalAlpha`] *= g[`textAlpha`], v['noNames'] || r && v[`autoHideNames`] || this[`isPlayerCell`] && v[`hideMyName`] || n && v[`hideTeammatesNames`] || this[`setNick`](this[`targetNick`]) && this[`drawNick`](t), !v[`showMass`] || r && v[`autoHideMass`] || this[`isPlayerCell`] && v[`hideMyMass`] || v[`hideEnemiesMass`] && !this[`isPlayerCell`] && !this[`isVirus`] || this[`setMass`](this[`size`]) && this[`drawMass`](t), t[`restore`]());
                        }
                    }
                };
        }
		window.legendmod1=ogarbasicassembly;
        var M = {
            'ws': null,
            'socket': null,
            'protocolKey': null,
            'clientKey': null,
            'connectionOpened': !1,
            'accessTokenSent': !1,
            'clientVersion': 0x76c0,
            'clientVersionString': '3.4.0',
            'time': Date[`now`](),
            'serverTime': 0,
            'serverTimeDiff': 0,
            'loggedInTime': 0,
            'mapSize': 0x373e,
            'mapOffset': 7071,
            'mapOffsetX': 0,
            'mapOffsetY': 0,
            'mapOffsetFixed': !1,
            'mapMinX': -7071,
            'mapMinY': -7071,
            'mapMaxX': 7071,
            'mapMaxY': 7071,
            'viewMinX': 0,
            'viewMinY': 0,
            'viewMaxX': 0,
            'viewMaxY': 0,
            'canvasWidth': 0,
            'canvasHeight': 0,
            'canvasScale': 1,
            'indexedCells': {},
            'cells': [],
            'removedCells': [],
            'food': [],
            'viruses': [],
            'playerCells': [],
            'playerCellIDs': [],
            'ghostCells': [],
            'playerX': 0,
            'playerY': 0,
            'playerSize': 0,
            'playerMass': 0,
            'playerMaxMass': 0,
            'playerMinMass': 0,
            'playerScore': 0,
            'playerSplitCells': 0,
            'playerColor': null,
            'playerNick': '',
            'playerPosition': 0,
            'leaderboard': [],
            'biggerSTECellsCache': [],
            'biggerCellsCache': [],
            'smallerCellsCache': [],
            'STECellsCache': [],
            'STE': 0,
            'autoZoom': !1,
            'zoomValue': 0.1,
            'viewX': 0,
            'viewY': 0,
            'scale': 1,
            'viewScale': 1,
            'clientX': 0,
            'clientY': 0,
            'cursorX': 0,
            'cursorY': 0,
            'targetX': 0,
            'targetY': 0,
            'targetDistance': 0,
            'battleRoyale': {
                'state': 0,
                'players': 0,
                'startTime': 0,
                'shrinkTime': 0,
                'timeLeft': 0,
                'x': 0,
                'y': 0,
                'radius': 0,
                'targetX': 0,
                'targetY': 0,
                'targetRadius': 0,
                'maxRadius': 11313,
                'rank': [],
                'playerRank': 0,
                'joined': !1
            },
            'play': !1,
            'pause': !1,
            'targeting': !1,
            'removePlayerCell': !1,
            'showCustomSkins': !0,
            'showFood': !0,
            'foodIsHidden': !1,
            'selectBiggestCell': !0,
            'hideSmallBots': !1,
            'pressedKeys': {},
            'connect': function(t) {
                console['log'](`[Legend mod Express] Connecting to game server:`, t);
                var i = this;
                this[`closeConnection`](), this[`flushCellsData`](), this[`protocolKey`] = null, this[`clientKey`] = null, this[`accessTokenSent`] = !1, this[`connectionOpened`] = !1, this[`mapOffsetFixed`] = !1, this[`leaderboard`] = [], this['ws'] = t, this[`socket`] = new WebSocket(t), this['socket'][`binaryType`] = `arraybuffer`, this[`socket`][`onopen`] = function() {
                    i[`onOpen`]();
                }, this[`socket`][`onmessage`] = function(t) {
                    i['onMessage'](t);
                }, this['socket'][`onerror`] = function(t) {
                    i[`onError`](t);
                }, this['socket']['onclose'] = function(t) {
                    i[`onClose`](t);
                }, ogarminimapdrawer[`getWS`](this['ws']), ogarminimapdrawer['sendServerJoin'](), ogarminimapdrawer[`sendServerData`](), ogarminimapdrawer[`displayLeaderboard`](''), e[`master`] && e[`master`][`onConnect`] && e[`master`][`onConnect`]();
            },
            'onOpen': function(t) {
                console[`log`](`[Legend mod Express] Game server socket open`), this[`time`] = Date[`now`]();
                var e = this[`createView`](5);
                e[`setUint8`](0, 254), e['setUint32'](1, 20, !0), this[`sendMessage`](e), (e = this['createView'](5))[`setUint8`](0, 255), e[`setUint32`](1, this[`clientVersion`], !0), this[`sendMessage`](e), this[`connectionOpened`] = !0;
            },
            'onMessage': function(t) {
                t = new DataView(t[`data`]), this[`protocolKey`] && (t = this[`shiftMessage`](t, this['protocolKey'] ^ this[`clientVersion`])), this['handleMessage'](t);
            },
            'onError': function(t) {
                console[`log`](`[Legend mod Express] Game server socket error`), this[`flushCellsData`](), e[`master`] && e[`master`][`onDisconnect`] && e[`master`][`onDisconnect`]();
            },
            'onClose': function(t) {
                console['log'](`[Legend mod Express] Game server socket close`), this[`flushCellsData`](), e[`master`] && e[`master`][`onDisconnect`] && e[`master`]['onDisconnect']();
            },
            'closeConnection': function() {
                if (this[`socket`]) {
                    this[`socket`][`onopen`] = null, this[`socket`][`onmessage`] = null, this[`socket`][`onerror`] = null, this['socket'][`onclose`] = null;
                    try {
                        this[`socket`]['close']();
                    } catch (ogarcloseconncloser) {}
                    this[`socket`] = null, this['ws'] = null;
                }
            },
            'isSocketOpen': function() {
                return null !== this[`socket`] && this[`socket`][`readyState`] === this[`socket`][`OPEN`];
            },
            'createView': function(t) {
                return new DataView(new ArrayBuffer(t));
            },
            'sendBuffer': function(t) {
                this[`socket`][`send`](t[`buffer`]);
            },
            'sendMessage': function(t) {
                if (this[`connectionOpened`]) {
                    if (!this[`clientKey`]) return;
                    t = this[`shiftMessage`](t, this['clientKey']), this[`clientKey`] = this[`shiftKey`](this['clientKey']);
                }
                this[`sendBuffer`](t);
            },
            'sendAction': function(t) {
                if (this[`isSocketOpen`]()) {
                    var e = this[`createView`](1);
                    e[`setUint8`](0, t), this[`sendMessage`](e);
                }
            },
            'sendSpectate': function() {
                this[`sendAction`](1);
            },
            'sendFreeSpectate': function() {
                this['sendAction'](18);
            },
            'sendEject': function() {
                this[`sendPosition`](), this[`sendAction`](21);
            },
            'sendSplit': function() {
                this[`sendPosition`](), this[`sendAction`](17);
            },
            'sendNick': function(t) {
                this[`playerNick`] = t, t = e[`unescape`](e[`encodeURIComponent`](t));
                var i = this[`createView`](1 + t[`length`]);
                i[`setUint8`](0, 0);
                for (var s = 0; s < t['length']; s++) i[`setUint8`](s + 1, t[`charCodeAt`](s));
                this[`sendMessage`](i);
            },
            'sendPosition': function() {
                if (this[`isSocketOpen`]() && this[`connectionOpened`] && this[`clientKey`]) {
                    var t = this[`cursorX`],
                        e = this['cursorY'];
                    (!this['play'] && this[`targeting`] || this[`pause`]) && (t = this['targetX'], e = this[`targetY`]);
                    var i = this['createView'](13);
                    i[`setUint8`](0, 16), i[`setInt32`](1, t, !0), i['setInt32'](5, e, !0), i[`setUint32`](9, this['protocolKey'], !0), this['sendMessage'](i);
                }
            },
            'sendAccessToken': function(t, e, i) {
                if (!this[`accessTokenSent`]) {
                    i || (i = 102);
                    for (var s = t[`length`], o = this[`clientVersionString`]['length'], a = [i, 8, 1, 18, s + o + 23, 1, 8, 10, 0x52, s + o + 18, 1, 8, e, 18, o + 8, 8, 5, 18, o], n = 0; n < o; n++) a[`push`](this[`clientVersionString`]['charCodeAt'](n));
                    for (a[`push`](24, 0, 32, 0, 0x1a, s + 3, 1, 10, s, 1), n = 0; n < s; n++) a['push'](t['charCodeAt'](n));
                    a = new Uint8Array(a);
                    var r = new DataView(a[`buffer`]);
                    this[`sendMessage`](r);
                }
            },
            'sendFbToken': function(t) {
                this['sendAccessToken'](t, 2);
            },
            'sendGplusToken': function(t) {
                this['sendAccessToken'](t, 3);
            },
            'sendRecaptcha': function(t) {
                var e = this[`createView`](2 + t['length']);
                e[`setUint8`](0, 86);
                for (var i = 0; i < t[`length`]; i++) e[`setUint8`](1 + i, t[`charCodeAt`](i));
                e[`setUint8`](t[`length`] + 1, 0), this[`sendMessage`](e);
            },
            'setClientVersion': function(t, e) {
                this[`clientVersion`] = t, this[`clientVersionString`] = e, console[`log`]('[Legend mod Express] Client version:', t, e);
            },
            'generateClientKey': function(t, e) {
                if (!t['length'] || !e[`byteLength`]) return null;
                for (var i = null, s = 1540483477, o = t[`match`](/(ws+:\/\/)([^:]*)(:\d+)/)[2], a = o[`length`] + e['byteLength'], n = new Uint8Array(a), r = 0; r < o[`length`]; r++) n[r] = o[`charCodeAt`](r);
                n[`set`](e, o[`length`]);
                for (var l = new DataView(n[`buffer`]), h = a - 1, c = 4 + (h - 4 & -4) | 0, u = 255 ^ h, d = 0; h > 3;) i = 0 | Math['imul'](l[`getInt32`](d, !0), s), u = (0 | Math[`imul`](i >>> 24 ^ i, s)) ^ (0 | Math[`imul`](u, s)), h -= 4, d += 4;
                switch (h) {
                    case 3:
                        u = n[c + 2] << 16 ^ u, u = n[c + 1] << 8 ^ u;
                        break;
                    case 2:
                        u = n[c + 1] << 8 ^ u;
                        break;
                    case 1:
                        break;
                    default:
                        i = u;
                }
                return i != u && (i = 0 | Math[`imul`](n[c] ^ u, s)), i ^= u = i >>> 13, i = 0 | Math[`imul`](i, s), i ^= u = i >>> 15, console[`log`]('[Legend mod Express] Generated client key:', i), i;
            },
            'shiftKey': function(t) {
                return t = 0 | Math['imul'](t, 1540483477), t = 114296087 ^ (0 | Math[`imul`](t >>> 24 ^ t, 1540483477)), (t = 0 | Math[`imul`](t >>> 13 ^ t, 1540483477)) >>> 15 ^ t;
            },
            'shiftMessage': function(t, e, i) {
                if (i)
                    for (s = 0; s < t[`length`]; s++) t['writeUInt8'](t['readUInt8'](s) ^ e >>> s % 4 * 8 & 255, s);
                else
                    for (var s = 0; s < t[`byteLength`]; s++) t[`setUint8`](s, t[`getUint8`](s) ^ e >>> s % 4 * 8 & 255);
                return t;
            },
            'decompressMessage': function(t) {
                var e = new o(t['buffer']),
                    i = new o(e[`readUInt32LE`](1));
                return a[`decodeBlock`](e[`slice`](5), i), i;
            },
            'handleMessage': function(t) {
                var i = function() {
                        for (var e = '';;) {
                            var i = t[`getUint8`](s++);
                            if (0 == i) break;
                            e += String[`fromCharCode`](i);
                        }
                        return e;
                    },
                    s = 0,
                    o = t['getUint8'](s++);
                switch (54 == o && (o = 53), o) {
                    case 5:
                        break;
                    case 17:
                        this[`viewX`] = t['getFloat32'](s, !0), s += 4, this['viewY'] = t[`getFloat32`](s, !0), s += 4, this[`scale`] = t[`getFloat32`](s, !0);
                        break;
                    case 18:
                        this[`protocolKey`] && (this[`protocolKey`] = this[`shiftKey`](this[`protocolKey`])), this[`flushCellsData`]();
                        break;
                    case 32:
                        this[`playerCellIDs`][`push`](t[`getUint32`](s, !0)), this[`play`] || (this[`play`] = !0, ogarminimapdrawer[`hideMenu`](), this[`playerColor`] = null, ogarminimapdrawer[`onPlayerSpawn`]());
                        break;
                    case 50:
                        this[`pieChart`] = [];
                        var a = t[`getUint32`](s, !0);
                        s += 4;
                        for (var n = 0; n < a; n++) this[`pieChart`][`push`](t[`getFloat32`](s, !0)), s += 4;
                        ogarfooddrawer[`drawPieChart`]();
                        break;
                    case 53:
                        if (this[`leaderboard`] = [], this[`playerPosition`] = 0, 54 == t[`getUint8`](0)) {
                            t[`getUint16`](s, !0);
                            s += 2;
                        }
                        for (var r = 0; s < t[`byteLength`];) {
                            var l = '',
                                h = 0,
                                c = !1;
                            r++, 2 & (y = t['getUint8'](s++)) && (l = e[`decodeURIComponent`](escape(i()))), 4 & y && (h = t[`getUint32`](s, !0), s += 4), 8 & y && (l = this['playerNick'], h = `isPlayer`, this[`playerPosition`] = r), 16 & y && (c = !0), this[`leaderboard`][`push`]({
                                'nick': l,
                                'id': h,
                                'isFriend': c
                            });
                        }
                        this[`handleLeaderboard`]();
                        break;
                    case 54:
                        break;
                    case 69:
                        var u = t[`getUint16`](s, !0);
                        s += 2, this['ghostCells'] = [];
                        for (n = 0; n < u; n++) {
                            var d = t[`getInt32`](s, !0);
                            s += 4;
                            var f = t[`getInt32`](s, !0);
                            s += 4;
                            var m = t[`getUint32`](s, !0);
                            s += 5;
                            var g = ~~Math['sqrt'](100 * m);
                            this[`ghostCells`][`push`]({
                                'x': d,
                                'y': f,
                                'size': g,
                                'mass': m,
                                'inView': this[`isInView`](d, f, g)
                            });
                        }
                        break;
                    case 85:
                        console[`log`](`[Legend mod Express] Captcha requested`), e[`master`] && e[`master`][`recaptchaRequested`] && e[`master`][`recaptchaRequested`]();
                        break;
                    case 102:
                        t['byteLength'] < 20 && e[`logout`] && e[`logout`]();
                        break;
                    case 103:
                        this['loggedInTime'] = Date['now'](), this['accessTokenSent'] = !0;
                        break;
                    case 114:
                    case 161:
                        break;
                    case 176:
                        this[`battleRoyale`][`startTime`] = t['getUint32'](s, !0);
                        break;
                    case 177:
                        this[`battleRoyale`][`joined`] = !0;
                        break;
                    case 178:
                        this[`battleRoyale`]['players'] = t[`getUint16`](s, !0), s += 2;
                        var y = t[`getUint16`](s, !0);
                        s += 2, y || (this[`battleRoyale`]['state'] = 0, this['battleRoyale'][`joined`] = !1), 3 & y && (this[`battleRoyale`][`state`] = t[`getUint8`](s++), this[`battleRoyale`]['x'] = t['getInt32'](s, !0), s += 4, this[`battleRoyale`]['y'] = t['getInt32'](s, !0), s += 4, this[`battleRoyale`][`radius`] = t[`getUint32`](s, !0), s += 4, this[`battleRoyale`][`shrinkTime`] = 1000 * t[`getUint32`](s, !0), s += 4, this[`battleRoyale`]['shrinkTime'] && (this[`battleRoyale`][`timeLeft`] = ~~((this[`battleRoyale`]['shrinkTime'] - Date[`now`]() + this[`serverTimeDiff`]) / 1000), this[`battleRoyale`][`timeLeft`] < 0 && (this[`battleRoyale`][`timeLeft`] = 0))), 2 & y && (this[`battleRoyale`][`targetX`] = t[`getInt32`](s, !0), s += 4, this['battleRoyale'][`targetY`] = t[`getInt32`](s, !0), s += 4, this[`battleRoyale`][`targetRadius`] = t['getUint32'](s, !0));
                        break;
                    case 179:
                        y = t[`getUint8`](s), e[`decodeURIComponent`](escape(i()));
                        y || e['decodeURIComponent'](escape(i()));
                        break;
                    case 180:
                        this[`battleRoyale`]['joined'] = !1, this[`battleRoyale`][`rank`] = [], this[`battleRoyale`]['playerRank'] = t[`getUint32`](s, !0), s += 8;
                        var ogario1PlayerProfiles = t[`getUint16`](s, !0);
                        s += 2;
                        for (n = 0; n < ogario1PlayerProfiles; n++) {
                            var ogarcopythelb = e[`decodeURIComponent`](escape(i())),
                                v = t[`getUint32`](s, !0);
                            s += 4, this[`battleRoyale`][`rank`]['push']({
                                'place': v,
                                'name': ogarcopythelb
                            });
                        }
                        break;
                    case 226:
                        break;
                    case 241:
                        this['protocolKey'] = t[`getUint32`](s, !0), console[`log`](`[Legend mod Express] Received protocol key:`, this[`protocolKey`]);
                        var irenderfromagario = new Uint8Array(t[`buffer`], s += 4);
                        this[`clientKey`] = this[`generateClientKey`](this['ws'], irenderfromagario), e[`master`] && e[`master`][`login`] && e[`master`][`login`]();
                        break;
                    case 242:
                        this[`serverTime`] = 1000 * t[`getUint32`](s, !0), this[`serverTimeDiff`] = Date['now']() - this[`serverTime`];
                        break;
                    case 255:
                        this[`handleSubmessage`](t);
                        break;
                    default:
                        console['log']('[Legend mod Express] Unknown opcode:', t[`getUint8`](0));
                }
            },
            'handleSubmessage': function(t) {
                var e = 0;
                switch ((t = this['decompressMessage'](t))['readUInt8'](e++)) {
                    case 16:
                        this[`updateCells`](t, e);
                        break;
                    case 64:
                        this[`viewMinX`] = t[`readDoubleLE`](e), e += 8, this[`viewMinY`] = t[`readDoubleLE`](e), e += 8, this['viewMaxX'] = t[`readDoubleLE`](e), e += 8, this['viewMaxY'] = t[`readDoubleLE`](e), this[`setMapOffset`](this[`viewMinX`], this[`viewMinY`], this[`viewMaxX`], this[`viewMaxY`]);
                        break;
                    default:
                        console[`log`]('[Legend mod Express] Unknown sub opcode:', t[`readUInt8`](0));
                }
            },
            'handleLeaderboard': function() {
                for (var t = '', e = '', i = 0; i < this['leaderboard'][`length`] && window.leaderboardlimit != i; i++) {
                    var s = '<span>';
                    'isPlayer' === this[`leaderboard`][i]['id'] ? s = '<span class=\"me\">' : ogarcopythelb['clanTag'][`length`] && 0 == this[`leaderboard`][i][`nick`].indexOf(ogarcopythelb[`clanTag`]) && (s = `<span class=\"teammate\">`), t += s + (i + 1) + '. ' + ogarminimapdrawer[`escapeHTML`](this['leaderboard'][i]['nick']) + `</span>`;
                }
                if (this[`playerPosition`] > window.leaderboardlimit && (t += '<span class=\"me\">' + this[`playerPosition`] + '. ' + ogarminimapdrawer[`escapeHTML`](this['playerNick']) + `</span>`), v[`showLbData`])
                    for (var o = 0; o < this[`ghostCells`][`length`] && o != i; o++) e += '<span class=\"lb-data\">', e += `<span class=\"top5-mass-color\">[` + ogarminimapdrawer[`shortMassFormat`](this['ghostCells'][o][`mass`]) + `]</span>`, e += `<span class=\"hud-main-color\">[` + ogarminimapdrawer[`calculateMapSector`](this[`ghostCells`][o]['x'], this[`ghostCells`][o]['y']) + `]</span>`, e += `</span>`;
                ogarminimapdrawer[`displayLeaderboard`](t, e);
            },
            'flushCellsData': function() {
                this[`indexedCells`] = {}, this[`cells`] = [], this[`playerCells`] = [], this[`playerCellIDs`] = [], this[`ghostCells`] = [], this[`food`] = [], this[`viruses`] = [];
            },
            'setMapOffset': function(t, e, i, s) {
                i - t > 14000 && s - e > 14000 && (this[`mapOffsetX`] = this[`mapOffset`] - i, this[`mapOffsetY`] = this[`mapOffset`] - s, this[`mapMinX`] = ~~(-this[`mapOffset`] - this[`mapOffsetX`]), this[`mapMinY`] = ~~(-this[`mapOffset`] - this[`mapOffsetY`]), this[`mapMaxX`] = ~~(this[`mapOffset`] - this['mapOffsetX']), this[`mapMaxY`] = ~~(this[`mapOffset`] - this['mapOffsetY']), this['mapOffsetFixed'] || (this[`viewX`] = (i + t) / 2, this[`viewY`] = (s + e) / 2), this['mapOffsetFixed'] = !0, console['log']('[Legend mod Express] Map offset fixed (x, y):', this['mapOffsetX'], this['mapOffsetY']));
            },
            'isInView': function(t, e, i) {
                var s = this['canvasWidth'] / 2 / this[`scale`],
                    o = this[`canvasHeight`] / 2 / this[`scale`];
                return !(t + i < this['viewX'] - s || e + i < this[`viewY`] - o || t - i > this[`viewX`] + s || e - i > this[`viewY`] + o);
            },
            'updateCells': function(t, i) {
                var s = function() {
                    for (var e = '';;) {
                        var s = t[`readUInt8`](i++);
                        if (0 == s) break;
                        e += String[`fromCharCode`](s);
                    }
                    return e;
                };
                this[`time`] = Date[`now`](), this[`removePlayerCell`] = !1;
                var o = t[`readUInt16LE`](i);
                i += 2;
                for (var a = 0; a < o; a++) {
                    var n = this[`indexedCells`][t[`readUInt32LE`](i)],
                        r = this['indexedCells'][t['readUInt32LE'](i + 4)];
                    i += 8, n && r && (r[`targetX`] = n['x'], r[`targetY`] = n['y'], r[`targetSize`] = r[`size`], r[`time`] = this[`time`], r[`removeCell`]());
                }
                for (a = 0;;) {
                    var l = t[`readUInt32LE`](i);
                    if (i += 4, 0 == l) break;
                    var h = t[`readInt32LE`](i);
                    i += 4;
                    var c = t[`readInt32LE`](i);
                    i += 4;
                    var u = t[`readUInt16LE`](i);
                    i += 2;
                    var d = t[`readUInt8`](i++),
                        f = 0;
                    128 & d && (f = t[`readUInt8`](i++));
                    var m = null,
                        g = null,
                        y = '';
                    if (2 & d) {
                        var ogario1PlayerProfiles = t[`readUInt8`](i++),
                            ogarcopythelb = t[`readUInt8`](i++),
                            irenderfromagario = t[`readUInt8`](i++);
                        m = this['rgb2Hex'](~~(0.9 * ogario1PlayerProfiles), ~~(0.9 * ogarcopythelb), ~~(0.9 * irenderfromagario));
                    }

                    //4 & d && (g = s()),
                    //8 & d && (y = e['decodeURIComponent'](escape(s())));
                    if (4 & d) {
						g = s();
//						console.log('skin '+g);
                        
                    }
                    if (8 & d) {
                        y = e['decodeURIComponent'](escape(s()));
                        if (g != null) {
							if (window.vanillaskins==true){
                            var skin2search = g.replace('%', '');
                            var LMAgarGameConfiguration = window.window.LMGameConfiguration;
                            if (LMAgarGameConfiguration != undefined) {
                                var EquippableSkins = LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"];
                                for (var player = 0; player < EquippableSkins.length; player++) {
                                    //console.log(LMAgarGameConfiguration.gameConfig["Gameplay - Equippable Skins"]);
                                    if (EquippableSkins[player].productId == "skin_" + skin2search) {
                                        //console.log("Player: " + y + " Color: " + EquippableSkins[player].cellColor + " Image: " + EquippableSkins[player].image + " SkinId: " + EquippableSkins[player].gameplayId + " Skins type: " + EquippableSkins[player].skinType);
						if (ogarminimapdrawer[`customSkinsMap`][y]==undefined){
						ogarminimapdrawer[`customSkinsMap`][y]="https://configs-web.agario.miniclippt.com/live/v12/1922/"+EquippableSkins[player].image;
						ogarminimapdrawer['loadSkin'](ogarminimapdrawer[`customSkinsCache`], "https://configs-web.agario.miniclippt.com/live/v12/1922/"+EquippableSkins[player].image);
							}
									
                                    }
                                }
                            }
						}
                        }
                    }
                    //8 & d && (y = e['decodeURIComponent'](escape(s())));
                    var M = 1 & d,
                        ogarioset1final = 1 & f,
                        ogariocellssetts = null;
                    this['indexedCells'].hasOwnProperty(l) ? (ogariocellssetts = this[`indexedCells`][l], m && (ogariocellssetts[`color`] = m)) : ((ogariocellssetts = new ogarbasicassembly(l, h, c, u, m, ogarioset1final, M, !1, v[`shortMass`], v[`virMassShots`]))[`time`] = this[`time`], ogarioset1final ? this['food'][`push`](ogariocellssetts) : (M && v[`virusesRange`] && this[`viruses`][`push`](ogariocellssetts), this[`cells`][`push`](ogariocellssetts), -1 != this['playerCellIDs']['indexOf'](l) && -1 == this[`playerCells`].indexOf(ogariocellssetts) && (ogariocellssetts[`isPlayerCell`] = !0, this[`playerColor`] = m, this[`playerCells`]['push'](ogariocellssetts))), this['indexedCells'][l] = ogariocellssetts), ogariocellssetts[`isPlayerCell`] && (y = this['playerNick']), y && (ogariocellssetts[`targetNick`] = y), ogariocellssetts[`targetX`] = h, ogariocellssetts[`targetY`] = c, ogariocellssetts[`targetSize`] = u, ogariocellssetts[`isFood`] = ogarioset1final, ogariocellssetts[`isVirus`] = M, g && (ogariocellssetts[`skin`] = g), 4 & f && (t[`readUInt32LE`](i), i += 4);
                }
                for (o = t[`readUInt16LE`](i), i += 2, a = 0; a < o; a++) {
                    l = t[`readUInt32LE`](i);
                    i += 4, (ogariocellssetts = this[`indexedCells`][l]) && ogariocellssetts[`removeCell`]();
                }
                this['removePlayerCell'] && !this[`playerCells`][`length`] && (this[`play`] = !1, ogarminimapdrawer[`onPlayerDeath`](), ogarminimapdrawer[`showMenu`](300));
            },
            'color2Hex': function(t) {
                var e = t[`toString`](16);
                return 1 == e[`length`] ? '0' + e : e;
            },
            'rgb2Hex': function(t, e, i) {
                return '#' + this['color2Hex'](t) + this[`color2Hex`](e) + this[`color2Hex`](i);
            },
            'sortCells': function() {
                this[`cells`][`sort`](function(t, e) {
                    return t['size'] == e['size'] ? t['id'] - e['id'] : t[`size`] - e[`size`];
                });
            },
            'calculatePlayerMassAndPosition': function() {
                for (var t = 0, e = 0, i = 0, s = 0, o = this[`playerCells`][`length`], a = 0; a < o; a++) {
                    var n = this[`playerCells`][a];
                    t += n[`size`], e += n[`targetSize`] * n[`targetSize`], i += n['x'] / o, s += n['y'] / o;
                }
                this['viewX'] = i, this[`viewY`] = s, this[`playerSize`] = t, this[`playerMass`] = ~~(e / 100), this[`recalculatePlayerMass`]();
            },
            'recalculatePlayerMass': function() {
                if (this[`playerScore`] = Math['max'](this[`playerScore`], this['playerMass']), v[`virColors`] || v[`splitRange`] || v[`oppColors`] || v['oppRings'] || v[`showStatsSTE`]) {
                    var t = this['playerCells'],
                        e = t[`length`];
                    t[`sort`](function(t, e) {
                        return t['size'] == e[`size`] ? t['id'] - e['id'] : t[`size`] - e[`size`];
                    }), this['playerMinMass'] = ~~(t[0][`size`] * t[0][`size`] / 100), this['playerMaxMass'] = ~~(t[e - 1][`size`] * t[e - 1][`size`] / 100), this[`playerSplitCells`] = e;
                }
                if (v[`showStatsSTE`]) {
                    var i = this[`selectBiggestCell`] ? this[`playerMaxMass`] : this[`playerMinMass`];
                    this['STE'] = i > 35 ? ~~(i * (i < 1000 ? 0.35 : 0.38)) : null;
                }
            },
            'compareCells': function() {
                if (this[`play`] && (v[`oppColors`] || v[`oppRings`] || v[`splitRange`])) {
                    (v[`oppRings`] || v[`splitRange`]) && (this[`biggerSTECellsCache`] = [], this[`biggerCellsCache`] = [], this['smallerCellsCache'] = [], this[`STECellsCache`] = []);
                    for (var t = 0; t < this['cells'][`length`]; t++) {
                        var e = this[`cells`][t];
                        if (!e[`isVirus`]) {
                            var i = ~~(e[`size`] * e[`size`] / 100),
                                s = this[`selectBiggestCell`] ? this[`playerMaxMass`] : this[`playerMinMass`],
                                o = i / s,
                                a = s < 1000 ? 0.35 : 0.38;
                            v[`oppColors`] && !v[`oppRings`] && (e['oppColor'] = this['setCellOppColor'](e[`isPlayerCell`], o, a)), e[`isPlayerCell`] || !v[`splitRange`] && !v[`oppRings`] || this[`cacheCells`](e['x'], e['y'], e[`size`], o, a);
                        }
                    }
                }
            },
            'cacheCells': function(t, e, i, s, o) {
                return s >= 2.5 ? void this[`biggerSTECellsCache`][`push`]({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s >= 1.25 ? void this[`biggerCellsCache`][`push`]({
                    'x': t,
                    'y': e,
                    'size': i
                }) : s < 1.25 && s > 0.75 ? void 0 : s > o ? void this[`smallerCellsCache`][`push`]({
                    'x': t,
                    'y': e,
                    'size': i
                }) : void this[`STECellsCache`][`push`]({
                    'x': t,
                    'y': e,
                    'size': i
                });
            },
            'setCellOppColor': function(t, e, i) {
                return t ? ogarcopythelb[`color`] : e > 11 ? `#FF008C` : e >= 2.5 ? `#BE00FF` : e >= 1.25 ? `#FF0A00` : e < 1.25 && e > 0.75 ? `#FFDC00` : e > i ? '#00C8FF' : '#64FF00';
            },
            'getCursorPosition': function() {
                this[`cursorX`] = (this[`clientX`] - this[`canvasWidth`] / 2) / this[`viewScale`] + this[`viewX`], this[`cursorY`] = (this[`clientY`] - this['canvasHeight'] / 2) / this[`viewScale`] + this[`viewY`];
            },
            'setZoom': function(t) {
                t.preventDefault(), this[`zoomValue`] *= Math[`pow`](v[`zoomSpeedValue`], t['wheelDelta'] / -120 || t[`detail`] || 0), this[`zoomValue`] > 4 / this[`viewScale`] && (this[`zoomValue`] = 4 / this[`viewScale`]);
            },
            'setTargetPosition': function(t, e) {
                this[`targetX`] = t - this[`mapOffsetX`], this[`targetY`] = e - this[`mapOffsetY`], this[`targetDistance`] = Math[`round`](Math['sqrt'](Math[`pow`](this[`playerX`] - this[`targetX`], 2) + Math[`pow`](this[`playerY`] - this['targetY'], 2)));
            },
            'resetTargetPosition': function() {
                this[`targetX`] = this[`playerX`], this[`targetY`] = this[`playerY`];
            },
            'setKeys': function() {
                var t = this;
                document['onkeydown'] = function(e) {
                    var i = e[`keyCode`];
                    if (!t['pressedKeys'][i]) switch (i) {
                        case 13:
                            t['sendNick']('');
                            break;
                        case 32:
                            t[`sendSplit`]();
                            break;
                        case 81:
                            t[`sendFreeSpectate`]();
                            break;
                        case 83:
                            t['sendSpectate']();
                            break;
                        case 87:
                            t[`sendEject`]();
                    }
                }, document[`onkeyup`] = function(e) {
                    t[`pressedKeys`][e[`keyCode`]] = !1;
                };
            },
            'init': function() {
                var t = this;
                /firefox/i ['test'](navigator[`userAgent`]) ? document[`addEventListener`](`DOMMouseScroll`, function(e) {
                    t[`setZoom`](e);
                }, !1): document[`body`][`onmousewheel`] = function(e) {
                    t[`setZoom`](e);
                }, setInterval(function() {
                    t[`sendPosition`]();
                }, 40), e['master'] && e['master'][`clientVersion`] && this[`setClientVersion`](e[`master`][`clientVersion`], e[`master`][`clientVersionString`]);
            }
        };
		window.legendmod = M; // look at this
        e['sendAction'] = function(t) {
            M['sendAction'](t);
        };
        var ogarfooddrawer = {
                'canvas': null,
                'ctx': null,
                'canvasWidth': 0,
                'canvasHeight': 0,
                'camX': 0,
                'camY': 0,
                'scale': 1,
                'fpsLastRequest': null,
                'renderedFrames': 0,
                'fps': 0,
                'pi2': 2 * Math['PI'],
                'battleAreaMap': null,
                'battleAreaMapCtx': null,
                'pieChart': null,
                'pellet': null,
                'indicator': null,
                'setCanvas': function() {
                    this[`canvas`] = document[`getElementById`](`canvas`), this[`ctx`] = this[`canvas`][`getContext`]('2d'), this[`canvas`][`onmousemove`] = function(t) {
                        M['clientX'] = t[`clientX`], M[`clientY`] = t['clientY'], M[`getCursorPosition`]();
                    };
                },
                'resizeCanvas': function() {
                    this[`canvasWidth`] = e[`innerWidth`], this[`canvasHeight`] = e[`innerHeight`], this[`canvas`][`width`] = this[`canvasWidth`], this['canvas'][`height`] = this[`canvasHeight`], M[`canvasWidth`] = this[`canvasWidth`], M[`canvasHeight`] = this[`canvasHeight`], this['renderFrame']();
                },
                'setView': function() {
                    this[`setScale`](),
					M[`playerCells`][`length`] ?
					(M[`calculatePlayerMassAndPosition`](),
//					this.camX += (M.viewX - this.camX) / 2,
//					this.camY += (M.viewY - this.camY) / 2) :
					this.camX = (this.camX + M[`viewX`]) / 2,
					this.camY = (this.camY + M[`viewY`]) / 2) :
					(this.camX = (29 * this.camX + M[`viewX`]) / 30,
					this.camY = (29 * this.camY + M[`viewY`]) / 30),
					M['playerX'] = this.camX, M[`playerY`] = this['camY'];
                },
                'setScale': function() {
                    if (!M[`autoZoom`]) return this[`scale`] = (9 * this[`scale`] + this[`getZoom`]()) / 10, void(M[`viewScale`] = this[`scale`]);
                    M[`play`] ? this['scale'] = (9 * this['scale'] + Math[`pow`](Math['min'](64 / M[`playerSize`], 1), 0.4) * this['getZoom']()) / 10 : this[`scale`] = (9 * this[`scale`] + M[`scale`] * this['getZoom']()) / 10, M['viewScale'] = this[`scale`];
                },
                'getZoom': function() {
                    return Math[`max`](this[`canvasWidth`] / 1080, this[`canvasHeight`] / 1920) * M[`zoomValue`];
                },
                'renderFrame': function() {
                    for (M[`time`] = Date[`now`](), e = 0; e < M['cells'][`length`]; e++) M[`cells`][e][`moveCell`]();
                    if (this[`setView`](), M[`getCursorPosition`](), M[`sortCells`](), M[`compareCells`](), this[`ctx`][`clearRect`](0, 0, this[`canvasWidth`], this[`canvasHeight`]), v[`showGrid`] && this[`drawGrid`](this[`ctx`], this[`canvasWidth`], this[`canvasHeight`], this[`scale`], this.camX, this.camY), this['ctx'][`save`](), this[`ctx`][`translate`](this[`canvasWidth`] / 2, this[`canvasHeight`] / 2), this[`ctx`][`scale`](this[`scale`], this[`scale`]), this['ctx']['translate'](-this.camX, -this.camY), v[`showBgSectors`] && this[`drawSectors`](this['ctx'], M[`mapOffsetFixed`], g[`sectorsX`], g[`sectorsY`], M[`mapMinX`], M[`mapMinY`], M[`mapMaxX`], M['mapMaxY'], g[`gridColor`], g[`sectorsColor`], g[`sectorsWidth`], !0), `:battleroyale` === M[`gameMode`] && this[`drawBattleArea`](this[`ctx`]), v['showMapBorders']) {
                        var t = g['bordersWidth'] / 2;
                        this[`drawMapBorders`](this[`ctx`], M[`mapOffsetFixed`], M[`mapMinX`] - t, M[`mapMinY`] - t, M[`mapMaxX`] + t, M[`mapMaxY`] + t, g[`bordersColor`], g['bordersWidth']);
                    }
                    v['virusesRange'] && this[`drawVirusesRange`](this[`ctx`], M[`viruses`]), this[`drawFood`](), M[`play`] && (v[`splitRange`] && this[`drawSplitRange`](this[`ctx`], M[`biggerSTECellsCache`], M[`playerCells`], M['selectBiggestCell']), v[`oppRings`] && this['drawOppRings'](this[`ctx`], this[`scale`], M[`biggerSTECellsCache`], M[`biggerCellsCache`], M[`smallerCellsCache`], M[`STECellsCache`]), v['cursorTracking'] && this[`drawCursorTracking`](this[`ctx`], M['playerCells'], M[`cursorX`], M['cursorY'])), this[`drawGhostCells`]();
                    for (var e = 0; e < M[`removedCells`][`length`]; e++) M[`removedCells`][e]['draw'](this['ctx'], !0);
                    for (e = 0; e < M[`cells`][`length`]; e++) M[`cells`][e][`draw`](this['ctx']);
                    this[`ctx`][`restore`](), ':teams' === M[`gameMode`] && this['pieChart'] && this[`pieChart`][`width`] && this['ctx'][`drawImage`](this[`pieChart`], this[`canvasWidth`] - this[`pieChart`][`width`] - 10, 10);
                },
                'drawGrid': function(t, e, i, s, o, a) {
                    var n = e / s,
                        r = i / s,
                        l = (n / 2 - o) % 50,
                        h = (r / 2 - a) % 50;
                    for (t[`strokeStyle`] = g[`gridColor`], t[`globalAlpha`] = 1 * s, t[`beginPath`](); l < n; l += 50) t[`moveTo`](l * s - 0.5, 0), t[`lineTo`](l * s - 0.5, r * s);
                    for (; h < r; h += 50) t[`moveTo`](0, h * s - 0.5), t[`lineTo`](n * s, h * s - 0.5);
                    t['stroke'](), t['globalAlpha'] = 1;
                },
                'drawSectors': function(t, e, i, s, o, a, n, r, l, h, c, u) {
                    if (e || !u) {
                        var d = ~~((n - o) / i),
                            f = ~~((r - a) / s),
                            m = 0,
                            y = 0;
                        if (t[`strokeStyle`] = l, t[`fillStyle`] = h, t[`lineWidth`] = c, u || !u && v[`showMiniMapGrid`]) {
                            t[`beginPath`]();
                            for (var ogario1PlayerProfiles = 0; ogario1PlayerProfiles < i + 1; ogario1PlayerProfiles++) m = o + d * ogario1PlayerProfiles, t[`moveTo`](ogario1PlayerProfiles == i ? n : m, a), t['lineTo'](ogario1PlayerProfiles == i ? n : m, r);
                            for (ogario1PlayerProfiles = 0; ogario1PlayerProfiles < s + 1; ogario1PlayerProfiles++) y = a + f * ogario1PlayerProfiles, t[`moveTo`](o - c / 2, ogario1PlayerProfiles == s ? r : y), t[`lineTo`](n + c / 2, ogario1PlayerProfiles == s ? r : y);
                            t[`stroke`]();
                        } else this[`drawMapBorders`](t, e, o, a, n, r, l, c);
                        t['font'] = u ? g['sectorsFontWeight'] + ' ' + g[`sectorsFontSize`] + `px ` + g['sectorsFontFamily'] : g[`miniMapFontWeight`] + ' ' + ~~(0.4 * f) + `px ` + g['miniMapFontFamily'], t[`textAlign`] = `center`, t['textBaseline'] = 'middle';
                        for (ogario1PlayerProfiles = 0; ogario1PlayerProfiles < s; ogario1PlayerProfiles++)
                            for (var ogarcopythelb = 0; ogarcopythelb < i; ogarcopythelb++) {
                                var ogarminimapdrawer = String[`fromCharCode`](65 + ogario1PlayerProfiles) + (ogarcopythelb + 1);
                                m = ~~(o + d / 2 + ogarcopythelb * d), y = ~~(a + f / 2 + ogario1PlayerProfiles * f), t[`fillText`](ogarminimapdrawer, m, y);
                            }
                    }
                },
                'drawMapBorders': function(t, e, i, s, o, a, n, r) {
                    e && (t[`strokeStyle`] = n, t[`lineWidth`] = r, t[`beginPath`](), t[`moveTo`](i, s), t[`lineTo`](o, s), t[`lineTo`](o, a), t[`lineTo`](i, a), t[`closePath`](), t['stroke']());
                },
                'drawVirusesRange': function(t, e, i) {
                    if (e[`length`]) {
                        t[`beginPath`]();
                        for (var s = 0; s < e[`length`]; s++) {
                            var o = e[s]['x'],
                                a = e[s]['y'];
                            t[`moveTo`](o, a), t[`arc`](o, a, e[s][`size`] + 820, 0, this[`pi2`], !1);
                        }
                        t[`fillStyle`] = g['virusColor'], t[`globalAlpha`] = 0.1, t[`fill`](), t[`globalAlpha`] = 1, i && (e = []);
                    }
                },
                'drawFood': function() {
                    if (M[`showFood`] && !(v[`autoHideFoodOnZoom`] && this['scale'] < 0.2)) {
                        if (v['autoHideFood'] && !M['foodIsHidden'] && M[`playerMass`] > 1000) return M[`showFood`] = !1, void(M['foodIsHidden'] = !0);
                        if (v[`rainbowFood`])
                            for (var t = 0; t < M['food'][`length`]; t++) M['food'][t][`moveCell`](), M[`food`][t][`draw`](this['ctx']);
                        else this[`drawCachedFood`](this[`ctx`], M[`food`], this['scale']);
                    }
                },
                'drawCachedFood': function(t, e, i, s) {
                    if (e[`length`]) {
                        if (v[`optimizedFood`] && this[`pellet`])
                            for (var o = 0; o < e[`length`]; o++) {
                                var a = e[o]['x'] - 10 - g[`foodSize`],
                                    n = e[o]['y'] - 10 - g[`foodSize`];
                                t['drawImage'](this['pellet'], a, n);
                            } else {
                                t['beginPath']();
                                for (o = 0; o < e[`length`]; o++) {
                                    a = e[o]['x'], n = e[o]['y'];
                                    if (t['moveTo'](a, n), i < 0.16) {
                                        var r = e[o][`size`] + g[`foodSize`];
                                        t[`rect`](a - r, n - r, 2 * r, 2 * r);
                                    } else t[`arc`](a, n, e[o][`size`] + g[`foodSize`], 0, this['pi2'], !1);
                                }
                                t[`fillStyle`] = g[`foodColor`], t[`globalAlpha`] = 1, t[`fill`]();
                            }
                        s && (e = []);
                    }
                },
                'drawSplitRange': function(t, e, i, s, o) {
                    if (this['drawCircles'](t, e, 760, 4, 0.4, `#BE00FF`), i[`length`]) {
                        var a = s ? i[`length`] - 1 : 0;
                        t[`lineWidth`] = 6, t['globalAlpha'] = g[`darkTheme`] ? 0.7 : 0.35, t['strokeStyle'] = g[`splitRangeColor`], t[`beginPath`](), t['arc'](i[a]['x'], i[a]['y'], i[a][`size`] + 760, 0, this[`pi2`], !1), t[`closePath`](), t[`stroke`]();
                    }
                    t['globalAlpha'] = 1, o && (e = []);
                },
                'drawOppRings': function(t, e, i, s, o, a, n) {
                    var r = 14 + 2 / e,
                        l = 12 + 1 / e;
                    this[`drawCircles`](t, i, r, l, 0.75, `#BE00FF`), this[`drawCircles`](t, s, r, l, 0.75, `#FF0A00`), this[`drawCircles`](t, o, r, l, 0.75, `#00C8FF`), this[`drawCircles`](t, a, r, l, 0.75, `#64FF00`), n && (i = [], s = [], o = [], a = []);
                },
                'drawCursorTracking': function(t, e, i, s) {
                    t[`lineWidth`] = 4, t['globalAlpha'] = g[`darkTheme`] ? 0.75 : 0.35, t[`strokeStyle`] = g[`cursorTrackingColor`], t[`beginPath`]();
                    for (var o = 0; o < e[`length`]; o++) t[`moveTo`](e[o]['x'], e[o]['y']), t[`lineTo`](i, s);
                    t[`stroke`](), t[`globalAlpha`] = 1;
                },
                'drawCircles': function(t, e, i, s, o, a) {
                    t[`lineWidth`] = s, t['globalAlpha'] = o, t[`strokeStyle`] = a;
                    for (var n = 0; n < e['length']; n++) t['beginPath'](), t[`arc`](e[n]['x'], e[n]['y'], e[n][`size`] + i, 0, this[`pi2`], !1), t[`closePath`](), t[`stroke`]();
                    t['globalAlpha'] = 1;
                },
                'drawDashedCircle': function(t, e, i, s, o, a, n) {
                    var r = this[`pi2`] / o;
                    t[`lineWidth`] = a, t[`strokeStyle`] = n;
                    for (var l = 0; l < o; l += 2) t[`beginPath`](), t[`arc`](e, i, s - a / 2, l * r, (l + 1) * r, !1), t[`stroke`]();
                },
                'drawTeammatesInd': function(t, e, i, s) {
                    this[`indicator`] && t[`drawImage`](this[`indicator`], e - 45, i - s - 90);
                },
                'drawPieChart': function() {
                    this['pieChart'] || (this[`pieChart`] = document[`createElement`](`canvas`));
                    var t = this[`pieChart`][`getContext`]('2d'),
                        e = Math['min'](200, 0.3 * this[`canvasWidth`]) / 200;
                    this['pieChart'][`width`] = 200 * e, this[`pieChart`][`height`] = 240 * e, t['scale'](e, e);
                    for (var i = [`#333333`, `#FF3333`, '#33FF33', `#3333FF`], s = 0, o = 0; o < M[`pieChart`][`length`]; o++) {
                        var a = s + M['pieChart'][o] * this[`pi2`];
                        t[`fillStyle`] = i[o + 1], t['beginPath'](), t[`moveTo`](100, 140), t[`arc`](100, 140, 80, s, a, !1), t['fill'](), s = a;
                    }
                },
                'drawBattleArea': function(t) {
                    M[`battleRoyale`][`state`] && (this[`drawDangerArea`](t, M[`battleRoyale`]['x'], M[`battleRoyale`]['y'], M['battleRoyale']['radius'], M[`mapMinX`], M[`mapMinY`], M[`mapMaxX`] - M[`mapMinX`], M[`mapMaxY`] - M['mapMinY'], g[`dangerAreaColor`], 0.25), this['drawSafeArea'](t, M[`battleRoyale`][`targetX`], M[`battleRoyale`][`targetY`], M[`battleRoyale`][`targetRadius`], 40, g[`safeAreaColor`]));
                },
                'drawBattleAreaOnMinimap': function(t, e, i, s, o, a) {
                    if (M[`battleRoyale`][`state`]) {
                        this['battleAreaMap'] || (this[`battleAreaMap`] = document['createElement']('canvas'), this[`battleAreaMapCtx`] = this[`battleAreaMap`]['getContext']('2d')), this['battleAreaMap'][`width`] != e ? (this[`battleAreaMap`][`width`] = e, this[`battleAreaMap`]['height'] = i) : this[`battleAreaMapCtx`][`clearRect`](0, 0, e, i);
                        var n = (M[`battleRoyale`]['x'] + o) * s,
                            r = (M[`battleRoyale`]['y'] + a) * s,
                            l = M[`battleRoyale`][`radius`] * s;
                        this[`drawDangerArea`](this[`battleAreaMapCtx`], n, r, l, 0, 0, e, i, g[`dangerAreaColor`], 0.25), n = ~~((M[`battleRoyale`]['targetX'] + o) * s), r = ~~((M['battleRoyale'][`targetY`] + a) * s), l = ~~(M[`battleRoyale`][`targetRadius`] * s), this[`drawSafeArea`](this['battleAreaMapCtx'], n, r, l, 2, g[`safeAreaColor`]), t[`drawImage`](this[`battleAreaMap`], 0, 0);
                    }
                },
                'drawDangerArea': function(t, e, i, s, o, a, n, r, l, h) {
                    M['battleRoyale'][`radius`] == M[`battleRoyale`][`maxRadius`] || s <= 0 || (t[`save`](), t[`globalAlpha`] = h, t[`fillStyle`] = l, t['fillRect'](o, a, n, r), t[`globalCompositeOperation`] = 'destination-out', t[`globalAlpha`] = 1, t[`beginPath`](), t['arc'](e, i, s, 0, this['pi2'], !1), t[`fill`](), t[`restore`]());
                },
                'drawSafeArea': function(t, e, i, s, o, a) {
                    M[`battleRoyale`][`state`] > 2 || s <= 0 || this[`drawDashedCircle`](t, e, i, s, 0x3c, o, a);
                },
                'drawGhostCells': function() {
                    if (v[`showGhostCells`]) {
                        var t = M[`ghostCells`];
                        this['ctx']['beginPath']();
                        for (var e = 0; e < t['length']; e++)
                            if (!t[e][`inView`]) {
                                var i = t[e]['x'],
                                    s = t[e]['y'];
                                this[`ctx`][`moveTo`](i, s), this[`ctx`][`arc`](i, s, t[e][`size`], 0, this[`pi2`], !1);
                            } this[`ctx`][`fillStyle`] = g[`ghostCellsColor`], this[`ctx`][`globalAlpha`] = g[`ghostCellsAlpha`], this[`ctx`][`shadowColor`] = g[`ghostCellsColor`], this[`ctx`][`shadowBlur`] = 40, this[`ctx`][`shadowOffsetX`] = 0, this[`ctx`][`shadowOffsetY`] = 0, this[`ctx`][`fill`](), this['ctx']['globalAlpha'] = 1, this[`ctx`][`shadowBlur`] = 0;
                    }
                },
                'preDrawPellet': function() {
                    this[`pellet`] = null;
                    var t = 10 + g[`foodSize`],
                        e = document[`createElement`](`canvas`);
                    e['width'] = 2 * t, e['height'] = 2 * t;
                    var i = e[`getContext`]('2d');
                    i[`arc`](t, t, t, 0, this[`pi2`], !1), i[`fillStyle`] = g[`foodColor`], i[`fill`](), this['pellet'] = new Image(), this[`pellet`][`src`] = e[`toDataURL`](), e = null;
                },
                'preDrawIndicator': function() {
                    this[`indicator`] = null;
                    var t = document['createElement'](`canvas`);
                    t['width'] = 90, t[`height`] = 50;
                    var e = t[`getContext`]('2d');
                    e[`lineWidth`] = 2, e[`fillStyle`] = g['teammatesIndColor'], e['strokeStyle'] = `#000000`, e[`beginPath`](), e[`moveTo`](0, 0), e[`lineTo`](90, 0), e[`lineTo`](45, 50), e[`closePath`](), e[`fill`](), e[`stroke`](), this[`indicator`] = new Image(), this['indicator'][`src`] = t[`toDataURL`](), t = null;
                },
                'countFps': function() {
                    if (v['showStatsFPS']) {
                        var t = Date[`now`]();
                        this[`fpsLastRequest`] || (this[`fpsLastRequest`] = t), t - this['fpsLastRequest'] >= 1000 && (this[`fps`] = this[`renderedFrames`], this['renderedFrames'] = 0, this[`fpsLastRequest`] = t), this[`renderedFrames`]++;
                    }
                },
                'render': function() {
                    ogarfooddrawer['countFps'](), ogarfooddrawer[`renderFrame`](), e[`requestAnimationFrame`](ogarfooddrawer['render']);
                },
                'init': function() {
                    this[`setCanvas`](), this[`resizeCanvas`](), this['preDrawPellet'](), this.preDrawIndicator(), e[`requestAnimationFrame`](ogarfooddrawer[`render`]);
                }
            },
            ogarioefaultHotkeys = {},
            ogario1Hotkeys = {},
            ogario11Hotkeys = {
                'hk-feed': {
                    'label': h[`hk-feed`],
                    'defaultKey': 'W',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`feed`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-macroFeed': {
                    'label': h[`hk-macroFeed`],
                    'defaultKey': 'E',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`macroFeed`](!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`macroFeed`](!1);
                    },
                    'type': 'normal'
                },
                'hk-split': {
                    'label': h[`hk-split`],
                    'defaultKey': `SPACE`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['split']();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-doubleSplit': {
                    'label': h[`hk-doubleSplit`],
                    'defaultKey': 'Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`doubleSplit`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-popSplit': {
                    'label': `Popsplit`,
                    'defaultKey': 'ALT+Q',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['popSplit']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-split16': {
                    'label': h[`hk-split16`],
                    'defaultKey': 'SHIFT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`split16`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-pause': {
                    'label': h[`hk-pause`],
                    'defaultKey': 'R',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setPause']();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showTop5': {
                    'label': h[`hk-showTop5`],
                    'defaultKey': 'T',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowTop5`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showTime': {
                    'label': h['hk-showTime'],
                    'defaultKey': `ALT+T`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowTime`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showSplitRange': {
                    'label': h[`hk-showSplitRange`],
                    'defaultKey': 'U',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowSplitRange']();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showSplitInd': {
                    'label': h['hk-showSplitInd'],
                    'defaultKey': 'I',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowSplitInd`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showTeammatesInd': {
                    'label': h['hk-showTeammatesInd'],
                    'defaultKey': `ALT+I`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowTeammatesInd`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showOppColors': {
                    'label': h[`hk-showOppColors`],
                    'defaultKey': 'O',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowOppColors`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-toggleSkins': {
                    'label': h['hk-toggleSkins'],
                    'defaultKey': 'A',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['toggleSkins']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-transparentSkins': {
                    'label': h[`hk-transparentSkins`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setTransparentSkins']();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showSkins': {
                    'label': h[`hk-showSkins`],
                    'defaultKey': 'S',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowSkins`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showStats': {
                    'label': h[`hk-showStats`],
                    'defaultKey': `ALT+S`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowStats`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-toggleCells': {
                    'label': h[`hk-toggleCells`],
                    'defaultKey': 'D',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`toggleCells`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showFood': {
                    'label': h[`hk-showFood`],
                    'defaultKey': 'F',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowFood`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-showGrid': {
                    'label': h[`hk-showGrid`],
                    'defaultKey': 'G',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowGrid`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showMiniMapGuides': {
                    'label': h[`hk-showMiniMapGuides`],
                    'defaultKey': `ALT+G`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowMiniMapGuides`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-hideChat': {
                    'label': h['hk-hideChat'],
                    'defaultKey': 'H',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['hideChat']();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showHUD': {
                    'label': h[`hk-showHUD`],
                    'defaultKey': `ALT+H`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setShowHUD']();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-copyLb': {
                    'label': h[`hk-copyLb`],
                    'defaultKey': 'L',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`copyLb`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showLb': {
                    'label': h[`hk-showLb`],
                    'defaultKey': 'ALT+L',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowLb`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-toggleAutoZoom': {
                    'label': h[`hk-toggleAutoZoom`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`toggleAutoZoom`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-resetZoom': {
                    'label': h[`hk-resetZoom`],
                    'defaultKey': 'Z',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`resetZoom`](!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`resetZoom`](!1);
                    },
                    'type': `normal`
                },
                'hk-toggleDeath': {
                    'label': h[`hk-toggleDeath`],
                    'defaultKey': 'X',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`toggleDeath`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-clearChat': {
                    'label': h[`hk-clearChat`],
                    'defaultKey': 'C',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`displayChatHistory`](!0);
                    },
                    'keyUp': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`displayChatHistory`](!1);
                    },
                    'type': `normal`
                },
                'hk-showBgSectors': {
                    'label': h[`hk-showBgSectors`],
                    'defaultKey': 'B',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowBgSectors`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-hideBots': {
                    'label': h[`hk-hideBots`],
                    'defaultKey': `ALT+B`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setHideSmallBots']();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showNames': {
                    'label': h[`hk-showNames`],
                    'defaultKey': 'N',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowNames`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-hideTeammatesNames': {
                    'label': h[`hk-hideTeammatesNames`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setHideTeammatesNames`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showMass': {
                    'label': h[`hk-showMass`],
                    'defaultKey': 'M',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowMass`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showMiniMap': {
                    'label': h[`hk-showMiniMap`],
                    'defaultKey': `ALT+M`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowMiniMap`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-chatMessage': {
                    'label': h['hk-chatMessage'],
                    'defaultKey': `ENTER`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`enterChatMessage`]();
                    },
                    'keyUp': null,
                    'type': `special`
                },
                'hk-quickResp': {
                    'label': h['hk-quickResp'],
                    'defaultKey': `TILDE`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`quickResp`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-autoResp': {
                    'label': h[`hk-autoResp`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`toggleAutoResp`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom1': {
                    'label': h['hk-zoomLevel'] + ' 1',
                    'defaultKey': `ALT+1`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.5);
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-zoom2': {
                    'label': h[`hk-zoomLevel`] + ' 2',
                    'defaultKey': `ALT+2`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setZoom`](0.25);
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-zoom3': {
                    'label': h[`hk-zoomLevel`] + ' 3',
                    'defaultKey': `ALT+3`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setZoom`](0.125);
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-zoom4': {
                    'label': h['hk-zoomLevel'] + ' 4',
                    'defaultKey': `ALT+4`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['setZoom'](0.075);
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-zoom5': {
                    'label': h[`hk-zoomLevel`] + ' 5',
                    'defaultKey': `ALT+5`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setZoom`](0.05);
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-switchServerMode': {
                    'label': h[`hk-switchServerMode`],
                    'defaultKey': '=',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`switchServerMode`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showTargeting': {
                    'label': h[`hk-showTargeting`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowTargeting`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-setTargeting': {
                    'label': h[`hk-setTargeting`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setTargeting`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-cancelTargeting': {
                    'label': h[`hk-cancelTargeting`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['cancelTargeting']();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-changeTarget': {
                    'label': h[`hk-changeTarget`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`changeTarget`]();
                    },
                    'keyUp': null,
                    'type': 'normal'
                },
                'hk-privateMiniMap': {
                    'label': h[`hk-privateMiniMap`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setPrivateMiniMap`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-showQuest': {
                    'label': h[`hk-showQuest`],
                    'defaultKey': '',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`setShowQuest`]();
                    },
                    'keyUp': null,
                    'type': `normal`
                },
                'hk-comm1': {
                    'label': c['comm1'],
                    'defaultKey': '1',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](1);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm2': {
                    'label': c['comm2'],
                    'defaultKey': '2',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](2);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm3': {
                    'label': c[`comm3`],
                    'defaultKey': '3',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](3);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm4': {
                    'label': c[`comm4`],
                    'defaultKey': '4',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](4);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm5': {
                    'label': c[`comm5`],
                    'defaultKey': '5',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](5);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm6': {
                    'label': c[`comm6`],
                    'defaultKey': '6',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](6);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm7': {
                    'label': c[`comm7`],
                    'defaultKey': '7',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](7);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm8': {
                    'label': c['comm8'],
                    'defaultKey': '8',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](8);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm9': {
                    'label': c[`comm9`],
                    'defaultKey': '9',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](9);
                    },
                    'keyUp': null,
                    'type': 'command'
                },
                'hk-comm0': {
                    'label': c[`comm0`],
                    'defaultKey': '0',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer['sendCommand'](0);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm10': {
                    'label': c[`comm10`],
                    'defaultKey': `MOUSE WHEEL`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](10);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm11': {
                    'label': c[`comm11`],
                    'defaultKey': `LEFT`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](11);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm12': {
                    'label': c['comm12'],
                    'defaultKey': 'UP',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](12);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm13': {
                    'label': c[`comm13`],
                    'defaultKey': 'RIGHT',
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](13);
                    },
                    'keyUp': null,
                    'type': `command`
                },
                'hk-comm14': {
                    'label': c[`comm14`],
                    'defaultKey': `DOWN`,
                    'keyDown': function() {
                        ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](14);
                    },
                    'keyUp': null,
                    'type': `command`
                }
            },
            lastkeys = {
                'lastPressedKey': '',
                'lastKeyId': '',
                'defaultMessageKey': `ENTER`,
                'inputClassName': `custom-key-in form-control input-sm`,
                'loadDefaultHotkeys': function() {
                    for (var t in ogario1Hotkeys = {}, ogario11Hotkeys) ogario11Hotkeys.hasOwnProperty(t) && (ogario1Hotkeys[ogario11Hotkeys[t][`defaultKey`]] = t);
                    ogario1Hotkeys[`spec-messageKey`] = this[`defaultMessageKey`];
                },
                'loadHotkeys': function() {
                    null !== e.localStorage.getItem(`ogarioHotkeys`) ? ogario1Hotkeys = JSON.parse(e.localStorage['getItem'](`ogarioHotkeys`)) : this[`loadDefaultHotkeys`](), null !== e.localStorage.getItem(`ogarioCommands`) && (c = JSON.parse(e.localStorage.getItem(`ogarioCommands`)));
                },
                'saveHotkeys': function() {
                    e.localStorage.setItem(`ogarioHotkeys`, JSON.stringify(ogario1Hotkeys)), this[`saveCommands`]();
                },
                'saveCommands': function() {
                    s(`#hotkeys .command-in`)[`each`](function() {
                        var t = s(this),
                            e = t[`attr`]('id');
                        c.hasOwnProperty(e) && (c[e] = t.val());
                    }), e.localStorage['setItem'](`ogarioCommands`, JSON['stringify'](c));
                },
                'resetHotkeys': function() {
                    this[`loadDefaultHotkeys`](), s(`#hotkeys-cfg .custom-key-in`)['each'](function() {
                        var t = s(this)['attr']('id');
                        ogario11Hotkeys[t] && s(this).val(ogario11Hotkeys[t][`defaultKey`]);
                    });
                },
                'setHotkeysMenu': function() {
                    var t = this;
                    for (var e in s(`body`).append('<div id=\"hotkeys\"><div id=\"hotkeys-menu\"><button id=\"reset-hotkeys\" class=\"btn btn-primary\">' + h[`restoreSettings`] + `</button> <button id=\"save-hotkeys\" class=\"btn btn-success\">` + h[`saveSett`] + '</button> <button id=\"close-hotkeys\" class=\"btn btn-danger\">' + h['close'] + `</button></div><div id=\"hotkeys-cfg\"></div><div id=\"hotkeys-inst\"><ul><li>` + h[`hk-inst-assign`] + `</li><li>` + h[`hk-inst-delete`] + `</li><li>` + h[`hk-inst-keys`] + `</li></ul></div></div>`), ogario11Hotkeys)
                        if (ogario11Hotkeys.hasOwnProperty(e)) {
                            var i = ogario11Hotkeys[e],
                                o = '';
                            for (var a in ogario1Hotkeys)
                                if (ogario1Hotkeys.hasOwnProperty(a) && ogario1Hotkeys[a] === e) {
                                    o = a;
                                    break;
                                } if ('hk-switchServerMode' === e && ogarminimapdrawer && !ogarminimapdrawer[`privateIP`]) continue;
                            if (`command` === i[`type`]) {
                                var n = e[`replace`](`hk-`, '');
                                s('#hotkeys-cfg').append(`<div class=\"row\"><div class=\"key-label\"><input id=\"` + n + `\" class=\"command-in form-control input-sm\" value=\"` + c[n] + `\" maxlength=\"80\" /></div><div class=\"default-key\">` + i['defaultKey'] + `</div><div class=\"custom-key\"><input id=\"` + e + `\" class=\"custom-key-in form-control input-sm\" value=\"` + o + `\" /></div></div>`);
                            } else s(`#hotkeys-cfg`).append(`<div class=\"row\"><div class=\"key-label\">` + i[`label`] + `</div><div class=\"default-key\">` + i[`defaultKey`] + `</div><div class=\"custom-key\"><input id=\"` + e + `\" class=\"custom-key-in form-control input-sm\" value=\"` + o + `\" /></div></div>`);
                        } s(document)['on'](`click`, `#reset-hotkeys`, function(e) {
                        e.preventDefault(), t[`resetHotkeys`]();
                    }), s(document)['on'](`click`, `#save-hotkeys`, function(e) {
                        e.preventDefault(), t[`saveHotkeys`](), s(`#hotkeys`)[`fadeOut`](500);
                    }), s(document)['on']('click', `#close-hotkeys`, function(t) {
                        t.preventDefault(), s(`#hotkeys`)[`fadeOut`](500);
                    }), s(document)['on'](`click`, `.hotkeys-link`, function(t) {
                        s(`#hotkeys`)[`fadeIn`](500), s(`#hotkeys-cfg`)['perfectScrollbar'](`update`), ogarcommando1();
                    }), s(`#hotkeys-cfg`)[`perfectScrollbar`](), y && y[`setMenuBg`]();
                },
                'getPressedKey': function(t) {
                    var e = '',
                        i = '';
                    switch (t[`ctrlKey`] || 17 == t['keyCode'] ? e = `CTRL` : (t[`altKey`] || 18 == t[`keyCode`]) && (e = `ALT`), t['keyCode']) {
                        case 9:
                            i = `TAB`;
                            break;
                        case 13:
                            i = `ENTER`;
                            break;
                        case 16:
                            i = 'SHIFT';
                            break;
                        case 17:
                        case 18:
                            break;
                        case 27:
                            i = `ESC`;
                            break;
                        case 32:
                            i = 'SPACE';
                            break;
                        case 37:
                            i = 'LEFT';
                            break;
                        case 38:
                            i = 'UP';
                            break;
                        case 39:
                            i = `RIGHT`;
                            break;
                        case 40:
                            i = `DOWN`;
                            break;
                        case 46:
                            i = `DEL`;
                            break;
                        case 61:
                        case 187:
                            i = '=';
                            break;
                        case 192:
                            i = `TILDE`;
                            break;
                        default:
                            i = String['fromCharCode'](t[`keyCode`]);
                    }
                    return '' !== e ? '' !== i ? e + '+' + i : e : i;
                },
                'deleteHotkey': function(t, e) {
                    delete ogario1Hotkeys[t], s('#' + e).val('');
                },
                'setDefaultHotkey': function(t) {
                    var e = !1;
                    return ogario11Hotkeys[t] && !ogario1Hotkeys.hasOwnProperty(ogario11Hotkeys[t][`defaultKey`]) ? (e = ogario11Hotkeys[t][`defaultKey`], ogario1Hotkeys[e] = t, e) : e;
                },
                'setHotkey': function(t, e) {
                    if (e && (this[`lastPressedKey`] !== t || this[`lastKeyId`] !== e)) {
                        var i = s('#' + e).val();
                        if (this['deleteHotkey'](i, e), `DEL` !== t) {
                            if (ogario1Hotkeys[t] && ogario1Hotkeys[t] !== e) {
                                var o = ogario1Hotkeys[t],
                                    a = this[`setDefaultHotkey`](o);
                                a ? (ogario1Hotkeys[a] = o, s('#' + o).val(a)) : this[`deleteHotkey`](t, o);
                            }
                            ogario1Hotkeys[t] = e, s('#' + e).val(t), `hk-chatMessage` === e && (ogario1Hotkeys[`spec-messageKey`] = t), this[`lastPressedKey`] = t, this[`lastKeyId`] = e;
                        }
                    }
                },
                'init': function() {
                    this[`loadHotkeys`](), this[`setHotkeysMenu`]();
                }
            };
		window.legendmod2 = ogarfooddrawer; //look at this
        function ogarjoiner(t) {
            e[`history`] && e[`history`]['replaceState'] && e[`history`][`replaceState`]({}, e['document'][`title`], t);
        }

        function ogarassembler() {
            e['onkeydown'] = function(t) {
                81 == t[`keyCode`] && e[`core`][`specialOn`] && e[`core`][`specialOn`]();
            }, e[`onkeyup`] = function(t) {};
        }

        function ogarhusettings() {
            var t = e['innerWidth'],
                o = e[`innerHeight`],
                a = s(`#helloContainer`),
                n = a['innerHeight']();
            n > 0 ? i['menuHeight'] = n : n = i['menuHeight'] || 618;
            var r = Math['min'](1, o / n),
                l = n * r,
                h = Math['round'](o / 2 - 0.5 * l),
                c = 'translate(-50%, 0%) scale(' + r + ')';
            a.css(`transform`, c), a.css(`-ms-transform`, c), a.css(`-webkit-transform`, c), a.css('top', h + 'px'), i[`innerW`] = t, i[`innerH`] = o;
        }

        function ogarcommando1() {
            ogarminimapdrawer[`protocolMode`] || (e[`onkeydown`] = function(t) {});
        }
        document[`onkeydown`] = function(t) {
            var e = lastkeys['getPressedKey'](t);
            if (('INPUT' !== t[`target`]['tagName'] || t[`target`][`className`] === lastkeys[`inputClassName`] || e === ogario1Hotkeys[`spec-messageKey`]) && '' !== e && !ogarioefaultHotkeys[e]) {
                if (ogarioefaultHotkeys[e] = !0, `ESC` === e) return t.preventDefault(), void(ogarminimapdrawer && ogarminimapdrawer[`showMenu`]());
                if (t[`target`][`className`] === lastkeys[`inputClassName`]) return t.preventDefault(), void lastkeys[`setHotkey`](e, t[`target`]['id']);
                if (ogario1Hotkeys[e]) {
                    t.preventDefault();
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i][`keyDown`] && ogario11Hotkeys[i][`keyDown`]();
                }
            }
        }, document['onkeyup'] = function(t) {
            var e = lastkeys[`getPressedKey`](t);
            if ('' !== e) {
                if (ogario1Hotkeys[e]) {
                    var i = ogario1Hotkeys[e];
                    '' !== i && ogario11Hotkeys[i] && ogario11Hotkeys[i][`keyUp`] && ogario11Hotkeys[i][`keyUp`]();
                }
                ogarioefaultHotkeys[e] = !1;
            }
        }, e[`onmousedown`] = function(t) {
            s(`#overlays`)['is'](`:visible`) || (2 == t['which'] ? (t['preventDefault'](), ogarminimapdrawer && ogarminimapdrawer[`sendCommand`](10)) : (v['mouseSplit'] && (1 == t[`which`] && !v[`mouseInvert`] || 3 == t[`which`] && v[`mouseInvert`]) && (t.preventDefault(), ogarminimapdrawer && ogarminimapdrawer[`split`]()), v['mouseFeed'] && (3 == t[`which`] && !v[`mouseInvert`] || 1 == t[`which`] && v[`mouseInvert`]) && (t.preventDefault(), ogarminimapdrawer && ogarminimapdrawer[`macroFeed`](!0))));
        }, e[`onmouseup`] = function(t) {
            v[`mouseFeed`] && (3 == t[`which`] && !v[`mouseInvert`] || 1 == t[`which`] && v[`mouseInvert`]) && ogarminimapdrawer && ogarminimapdrawer['macroFeed'](!1);
        }, e[`onbeforeunload`] = function(t) {
            return i[`play`] ? h[`exit`] : void 0;
        }, i = M, o = t('buffer')[`Buffer`], a = t(`lz4`), `/ogario` === e.location['pathname'] && ogarjoiner('/' + e['location']['hash']), e[`onresize`] = function() {
            ogarfooddrawer[`resizeCanvas`](), ogarhusettings();
        }, ogarassembler(), e[`core`] = {
            'connect': function(t) {
                M[`connect`](t);
            },
            'disconnect': function() {},
            'sendNick': function(t) {
                M[`sendNick`](t);
            },
            'sendSpectate': function() {
                M[`sendSpectate`]();
            },
            'eject': function() {
                M['sendEject']();
            },
            'split': function() {
                M['sendSplit']();
            },
            'specialOn': function() {
                M['sendFreeSpectate']();
            },
            'specialOff': function() {
                M['sendFreeSpectate']();
            },
            'sendFbToken': function(t) {
                M['sendFbToken'](t);
            },
            'sendGplusToken': function(t) {
                M['sendGplusToken'](t);
            },
            'recaptchaResponse': function(t) {
                M['sendRecaptcha'](t);
            },
            'setClientVersion': function(t, e) {
                M['setClientVersion'](t, e);
            },
            'proxyMobileData': function(t = []) {
                if (Array['isArray'](t)) {
                    8 == t[0] && t[`unshift`](102);
                    var e = M[`createView`](t[`length`]);
                    M[`sendMessage`](e);
                } else console[`log`](`ProxyMobileData ERROR: Array data required.`);
            }
        }, e['master'][`getClientVersion`](), y[`init`](), ogarminimapdrawer[`init`](), ogarminimapdrawer[`getDefaultSettings`](), ogarminimapdrawer[`connect`](), lastkeys[`init`](), M['init'](), ogarfooddrawer[`init`](), e[`master`][`init`](), ogarhusettings();
    })(window, window[`ogario`], window[`jQuery`]);
}, {
    'buffer': 3,
    'lz4': 18
}]
};

t();
