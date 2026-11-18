webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return VERSION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return root; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArrayProto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ObjProto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SymbolProto; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return push; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return slice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "t", function() { return toString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return hasOwnProperty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "r", function() { return supportsArrayBuffer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "s", function() { return supportsDataView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return nativeIsArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return nativeKeys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return nativeCreate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return nativeIsView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return _isNaN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return _isFinite; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return hasEnumBug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return nonEnumerableProps; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MAX_ARRAY_INDEX; });
// Current version.
var VERSION = '1.13.7';

// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
var root = (typeof self == 'object' && self.self === self && self) ||
          (typeof global == 'object' && global.global === global && global) ||
          Function('return this')() ||
          {};

// Save bytes in the minified (but not gzipped) version:
var ArrayProto = Array.prototype, ObjProto = Object.prototype;
var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

// Modern feature detection.
var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
    supportsDataView = typeof DataView !== 'undefined';

// All **ECMAScript 5+** native function implementations that we hope to use
// are declared here.
var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create,
    nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

// Create references to these builtin functions because we override them.
var _isNaN = isNaN,
    _isFinite = isFinite;

// Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
  'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

// The largest integer that can be represented exactly.
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(13)))

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _interopRequireDefault = __webpack_require__(2);
var _typeof2 = _interopRequireDefault(__webpack_require__(39));
/*! jQuery v3.1.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/animatedSelector,-effects/Tween,-deprecated | (c) jQuery Foundation | jquery.org/license */
!function (a, b) {
  "use strict";

  "object" == ( false ? "undefined" : (0, _typeof2["default"])(module)) && "object" == (0, _typeof2["default"])(module.exports) ? module.exports = a.document ? b(a, !0) : function (a) {
    if (!a.document) throw new Error("jQuery requires a window with a document");
    return b(a);
  } : b(a);
}("undefined" != typeof window ? window : void 0, function (a, b) {
  "use strict";

  var c = [],
    d = a.document,
    e = Object.getPrototypeOf,
    f = c.slice,
    g = c.concat,
    h = c.push,
    i = c.indexOf,
    j = {},
    k = j.toString,
    l = j.hasOwnProperty,
    m = l.toString,
    n = m.call(Object),
    o = {};
  function p(a, b) {
    b = b || d;
    var c = b.createElement("script");
    c.text = a, b.head.appendChild(c).parentNode.removeChild(c);
  }
  var q = "3.1.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/animatedSelector,-effects/Tween,-deprecated",
    _r = function r(a, b) {
      return new _r.fn.init(a, b);
    },
    s = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    t = /^-ms-/,
    u = /-([a-z])/g,
    v = function v(a, b) {
      return b.toUpperCase();
    };
  _r.fn = _r.prototype = {
    jquery: q,
    constructor: _r,
    length: 0,
    toArray: function toArray() {
      return f.call(this);
    },
    get: function get(a) {
      return null == a ? f.call(this) : a < 0 ? this[a + this.length] : this[a];
    },
    pushStack: function pushStack(a) {
      var b = _r.merge(this.constructor(), a);
      return b.prevObject = this, b;
    },
    each: function each(a) {
      return _r.each(this, a);
    },
    map: function map(a) {
      return this.pushStack(_r.map(this, function (b, c) {
        return a.call(b, c, b);
      }));
    },
    slice: function slice() {
      return this.pushStack(f.apply(this, arguments));
    },
    first: function first() {
      return this.eq(0);
    },
    last: function last() {
      return this.eq(-1);
    },
    eq: function eq(a) {
      var b = this.length,
        c = +a + (a < 0 ? b : 0);
      return this.pushStack(c >= 0 && c < b ? [this[c]] : []);
    },
    end: function end() {
      return this.prevObject || this.constructor();
    },
    push: h,
    sort: c.sort,
    splice: c.splice
  }, _r.extend = _r.fn.extend = function () {
    var a,
      b,
      c,
      d,
      e,
      f,
      g = arguments[0] || {},
      h = 1,
      i = arguments.length,
      j = !1;
    for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == (0, _typeof2["default"])(g) || _r.isFunction(g) || (g = {}), h === i && (g = this, h--); h < i; h++) if (null != (a = arguments[h])) for (b in a) c = g[b], d = a[b], g !== d && (j && d && (_r.isPlainObject(d) || (e = _r.isArray(d))) ? (e ? (e = !1, f = c && _r.isArray(c) ? c : []) : f = c && _r.isPlainObject(c) ? c : {}, g[b] = _r.extend(j, f, d)) : void 0 !== d && (g[b] = d));
    return g;
  }, _r.extend({
    expando: "jQuery" + (q + Math.random()).replace(/\D/g, ""),
    isReady: !0,
    error: function error(a) {
      throw new Error(a);
    },
    noop: function noop() {},
    isFunction: function isFunction(a) {
      return "function" === _r.type(a);
    },
    isArray: Array.isArray,
    isWindow: function isWindow(a) {
      return null != a && a === a.window;
    },
    isNumeric: function isNumeric(a) {
      var b = _r.type(a);
      return ("number" === b || "string" === b) && !isNaN(a - parseFloat(a));
    },
    isPlainObject: function isPlainObject(a) {
      var b, c;
      return !(!a || "[object Object]" !== k.call(a)) && (!(b = e(a)) || (c = l.call(b, "constructor") && b.constructor, "function" == typeof c && m.call(c) === n));
    },
    isEmptyObject: function isEmptyObject(a) {
      var b;
      for (b in a) return !1;
      return !0;
    },
    type: function type(a) {
      return null == a ? a + "" : "object" == (0, _typeof2["default"])(a) || "function" == typeof a ? j[k.call(a)] || "object" : (0, _typeof2["default"])(a);
    },
    globalEval: function globalEval(a) {
      p(a);
    },
    camelCase: function camelCase(a) {
      return a.replace(t, "ms-").replace(u, v);
    },
    nodeName: function nodeName(a, b) {
      return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
    },
    each: function each(a, b) {
      var c,
        d = 0;
      if (w(a)) {
        for (c = a.length; d < c; d++) if (b.call(a[d], d, a[d]) === !1) break;
      } else for (d in a) if (b.call(a[d], d, a[d]) === !1) break;
      return a;
    },
    trim: function trim(a) {
      return null == a ? "" : (a + "").replace(s, "");
    },
    makeArray: function makeArray(a, b) {
      var c = b || [];
      return null != a && (w(Object(a)) ? _r.merge(c, "string" == typeof a ? [a] : a) : h.call(c, a)), c;
    },
    inArray: function inArray(a, b, c) {
      return null == b ? -1 : i.call(b, a, c);
    },
    merge: function merge(a, b) {
      for (var c = +b.length, d = 0, e = a.length; d < c; d++) a[e++] = b[d];
      return a.length = e, a;
    },
    grep: function grep(a, b, c) {
      for (var d, e = [], f = 0, g = a.length, h = !c; f < g; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
      return e;
    },
    map: function map(a, b, c) {
      var d,
        e,
        f = 0,
        h = [];
      if (w(a)) for (d = a.length; f < d; f++) e = b(a[f], f, c), null != e && h.push(e);else for (f in a) e = b(a[f], f, c), null != e && h.push(e);
      return g.apply([], h);
    },
    guid: 1,
    proxy: function proxy(a, b) {
      var c, d, e;
      if ("string" == typeof b && (c = a[b], b = a, a = c), _r.isFunction(a)) return d = f.call(arguments, 2), e = function e() {
        return a.apply(b || this, d.concat(f.call(arguments)));
      }, e.guid = a.guid = a.guid || _r.guid++, e;
    },
    now: Date.now,
    support: o
  }), "function" == typeof Symbol && (_r.fn[Symbol.iterator] = c[Symbol.iterator]), _r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (a, b) {
    j["[object " + b + "]"] = b.toLowerCase();
  });
  function w(a) {
    var b = !!a && "length" in a && a.length,
      c = _r.type(a);
    return "function" !== c && !_r.isWindow(a) && ("array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a);
  }
  var x = function (a) {
    var b,
      c,
      d,
      e,
      f,
      g,
      h,
      i,
      j,
      k,
      l,
      m,
      n,
      o,
      p,
      q,
      r,
      s,
      t,
      u = "sizzle" + 1 * new Date(),
      v = a.document,
      w = 0,
      x = 0,
      y = ha(),
      z = ha(),
      A = ha(),
      B = function B(a, b) {
        return a === b && (l = !0), 0;
      },
      C = {}.hasOwnProperty,
      D = [],
      E = D.pop,
      F = D.push,
      G = D.push,
      H = D.slice,
      I = function I(a, b) {
        for (var c = 0, d = a.length; c < d; c++) if (a[c] === b) return c;
        return -1;
      },
      J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      K = "[\\x20\\t\\r\\n\\f]",
      L = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
      M = "\\[" + K + "*(" + L + ")(?:" + K + "*([*^$|!~]?=)" + K + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + L + "))|)" + K + "*\\]",
      N = ":(" + L + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + M + ")*)|.*)\\)|)",
      O = new RegExp(K + "+", "g"),
      P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
      Q = new RegExp("^" + K + "*," + K + "*"),
      R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
      S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
      T = new RegExp(N),
      U = new RegExp("^" + L + "$"),
      V = {
        ID: new RegExp("^#(" + L + ")"),
        CLASS: new RegExp("^\\.(" + L + ")"),
        TAG: new RegExp("^(" + L + "|[*])"),
        ATTR: new RegExp("^" + M),
        PSEUDO: new RegExp("^" + N),
        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"),
        bool: new RegExp("^(?:" + J + ")$", "i"),
        needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i")
      },
      W = /^(?:input|select|textarea|button)$/i,
      X = /^h\d$/i,
      Y = /^[^{]+\{\s*\[native \w/,
      Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      $ = /[+~]/,
      _ = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
      aa = function aa(a, b, c) {
        var d = "0x" + b - 65536;
        return d !== d || c ? b : d < 0 ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320);
      },
      ba = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
      ca = function ca(a, b) {
        return b ? "\0" === a ? "\uFFFD" : a.slice(0, -1) + "\\" + a.charCodeAt(a.length - 1).toString(16) + " " : "\\" + a;
      },
      da = function da() {
        m();
      },
      ea = ta(function (a) {
        return a.disabled === !0 && ("form" in a || "label" in a);
      }, {
        dir: "parentNode",
        next: "legend"
      });
    try {
      G.apply(D = H.call(v.childNodes), v.childNodes), D[v.childNodes.length].nodeType;
    } catch (fa) {
      G = {
        apply: D.length ? function (a, b) {
          F.apply(a, H.call(b));
        } : function (a, b) {
          var c = a.length,
            d = 0;
          while (a[c++] = b[d++]);
          a.length = c - 1;
        }
      };
    }
    function ga(a, b, d, e) {
      var f,
        h,
        j,
        k,
        l,
        o,
        r,
        s = b && b.ownerDocument,
        w = b ? b.nodeType : 9;
      if (d = d || [], "string" != typeof a || !a || 1 !== w && 9 !== w && 11 !== w) return d;
      if (!e && ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, p)) {
        if (11 !== w && (l = Z.exec(a))) if (f = l[1]) {
          if (9 === w) {
            if (!(j = b.getElementById(f))) return d;
            if (j.id === f) return d.push(j), d;
          } else if (s && (j = s.getElementById(f)) && t(b, j) && j.id === f) return d.push(j), d;
        } else {
          if (l[2]) return G.apply(d, b.getElementsByTagName(a)), d;
          if ((f = l[3]) && c.getElementsByClassName && b.getElementsByClassName) return G.apply(d, b.getElementsByClassName(f)), d;
        }
        if (c.qsa && !A[a + " "] && (!q || !q.test(a))) {
          if (1 !== w) s = b, r = a;else if ("object" !== b.nodeName.toLowerCase()) {
            (k = b.getAttribute("id")) ? k = k.replace(ba, ca) : b.setAttribute("id", k = u), o = g(a), h = o.length;
            while (h--) o[h] = "#" + k + " " + sa(o[h]);
            r = o.join(","), s = $.test(a) && qa(b.parentNode) || b;
          }
          if (r) try {
            return G.apply(d, s.querySelectorAll(r)), d;
          } catch (x) {} finally {
            k === u && b.removeAttribute("id");
          }
        }
      }
      return i(a.replace(P, "$1"), b, d, e);
    }
    function ha() {
      var a = [];
      function b(c, e) {
        return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e;
      }
      return b;
    }
    function ia(a) {
      return a[u] = !0, a;
    }
    function ja(a) {
      var b = n.createElement("fieldset");
      try {
        return !!a(b);
      } catch (c) {
        return !1;
      } finally {
        b.parentNode && b.parentNode.removeChild(b), b = null;
      }
    }
    function ka(a, b) {
      var c = a.split("|"),
        e = c.length;
      while (e--) d.attrHandle[c[e]] = b;
    }
    function la(a, b) {
      var c = b && a,
        d = c && 1 === a.nodeType && 1 === b.nodeType && a.sourceIndex - b.sourceIndex;
      if (d) return d;
      if (c) while (c = c.nextSibling) if (c === b) return -1;
      return a ? 1 : -1;
    }
    function ma(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();
        return "input" === c && b.type === a;
      };
    }
    function na(a) {
      return function (b) {
        var c = b.nodeName.toLowerCase();
        return ("input" === c || "button" === c) && b.type === a;
      };
    }
    function oa(a) {
      return function (b) {
        return "form" in b ? b.parentNode && b.disabled === !1 ? "label" in b ? "label" in b.parentNode ? b.parentNode.disabled === a : b.disabled === a : b.isDisabled === a || b.isDisabled !== !a && ea(b) === a : b.disabled === a : "label" in b && b.disabled === a;
      };
    }
    function pa(a) {
      return ia(function (b) {
        return b = +b, ia(function (c, d) {
          var e,
            f = a([], c.length, b),
            g = f.length;
          while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]));
        });
      });
    }
    function qa(a) {
      return a && "undefined" != typeof a.getElementsByTagName && a;
    }
    c = ga.support = {}, f = ga.isXML = function (a) {
      var b = a && (a.ownerDocument || a).documentElement;
      return !!b && "HTML" !== b.nodeName;
    }, m = ga.setDocument = function (a) {
      var b,
        e,
        g = a ? a.ownerDocument || a : v;
      return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = n.documentElement, p = !f(n), v !== n && (e = n.defaultView) && e.top !== e && (e.addEventListener ? e.addEventListener("unload", da, !1) : e.attachEvent && e.attachEvent("onunload", da)), c.attributes = ja(function (a) {
        return a.className = "i", !a.getAttribute("className");
      }), c.getElementsByTagName = ja(function (a) {
        return a.appendChild(n.createComment("")), !a.getElementsByTagName("*").length;
      }), c.getElementsByClassName = Y.test(n.getElementsByClassName), c.getById = ja(function (a) {
        return o.appendChild(a).id = u, !n.getElementsByName || !n.getElementsByName(u).length;
      }), c.getById ? (d.filter.ID = function (a) {
        var b = a.replace(_, aa);
        return function (a) {
          return a.getAttribute("id") === b;
        };
      }, d.find.ID = function (a, b) {
        if ("undefined" != typeof b.getElementById && p) {
          var c = b.getElementById(a);
          return c ? [c] : [];
        }
      }) : (d.filter.ID = function (a) {
        var b = a.replace(_, aa);
        return function (a) {
          var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id");
          return c && c.value === b;
        };
      }, d.find.ID = function (a, b) {
        if ("undefined" != typeof b.getElementById && p) {
          var c,
            d,
            e,
            f = b.getElementById(a);
          if (f) {
            if (c = f.getAttributeNode("id"), c && c.value === a) return [f];
            e = b.getElementsByName(a), d = 0;
            while (f = e[d++]) if (c = f.getAttributeNode("id"), c && c.value === a) return [f];
          }
          return [];
        }
      }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
        return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0;
      } : function (a, b) {
        var c,
          d = [],
          e = 0,
          f = b.getElementsByTagName(a);
        if ("*" === a) {
          while (c = f[e++]) 1 === c.nodeType && d.push(c);
          return d;
        }
        return f;
      }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
        if ("undefined" != typeof b.getElementsByClassName && p) return b.getElementsByClassName(a);
      }, r = [], q = [], (c.qsa = Y.test(n.querySelectorAll)) && (ja(function (a) {
        o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\r\\' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + K + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + K + "*(?:value|" + J + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]");
      }), ja(function (a) {
        a.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
        var b = n.createElement("input");
        b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + K + "*[*^$|!~]?="), 2 !== a.querySelectorAll(":enabled").length && q.push(":enabled", ":disabled"), o.appendChild(a).disabled = !0, 2 !== a.querySelectorAll(":disabled").length && q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:");
      })), (c.matchesSelector = Y.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ja(function (a) {
        c.disconnectedMatch = s.call(a, "*"), s.call(a, "[s!='']:x"), r.push("!=", N);
      }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = Y.test(o.compareDocumentPosition), t = b || Y.test(o.contains) ? function (a, b) {
        var c = 9 === a.nodeType ? a.documentElement : a,
          d = b && b.parentNode;
        return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
      } : function (a, b) {
        if (b) while (b = b.parentNode) if (b === a) return !0;
        return !1;
      }, B = b ? function (a, b) {
        if (a === b) return l = !0, 0;
        var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
        return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === n || a.ownerDocument === v && t(v, a) ? -1 : b === n || b.ownerDocument === v && t(v, b) ? 1 : k ? I(k, a) - I(k, b) : 0 : 4 & d ? -1 : 1);
      } : function (a, b) {
        if (a === b) return l = !0, 0;
        var c,
          d = 0,
          e = a.parentNode,
          f = b.parentNode,
          g = [a],
          h = [b];
        if (!e || !f) return a === n ? -1 : b === n ? 1 : e ? -1 : f ? 1 : k ? I(k, a) - I(k, b) : 0;
        if (e === f) return la(a, b);
        c = a;
        while (c = c.parentNode) g.unshift(c);
        c = b;
        while (c = c.parentNode) h.unshift(c);
        while (g[d] === h[d]) d++;
        return d ? la(g[d], h[d]) : g[d] === v ? -1 : h[d] === v ? 1 : 0;
      }, n) : n;
    }, ga.matches = function (a, b) {
      return ga(a, null, null, b);
    }, ga.matchesSelector = function (a, b) {
      if ((a.ownerDocument || a) !== n && m(a), b = b.replace(S, "='$1']"), c.matchesSelector && p && !A[b + " "] && (!r || !r.test(b)) && (!q || !q.test(b))) try {
        var d = s.call(a, b);
        if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d;
      } catch (e) {}
      return ga(b, n, null, [a]).length > 0;
    }, ga.contains = function (a, b) {
      return (a.ownerDocument || a) !== n && m(a), t(a, b);
    }, ga.attr = function (a, b) {
      (a.ownerDocument || a) !== n && m(a);
      var e = d.attrHandle[b.toLowerCase()],
        f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
      return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null;
    }, ga.escape = function (a) {
      return (a + "").replace(ba, ca);
    }, ga.error = function (a) {
      throw new Error("Syntax error, unrecognized expression: " + a);
    }, ga.uniqueSort = function (a) {
      var b,
        d = [],
        e = 0,
        f = 0;
      if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
        while (b = a[f++]) b === a[f] && (e = d.push(f));
        while (e--) a.splice(d[e], 1);
      }
      return k = null, a;
    }, e = ga.getText = function (a) {
      var b,
        c = "",
        d = 0,
        f = a.nodeType;
      if (f) {
        if (1 === f || 9 === f || 11 === f) {
          if ("string" == typeof a.textContent) return a.textContent;
          for (a = a.firstChild; a; a = a.nextSibling) c += e(a);
        } else if (3 === f || 4 === f) return a.nodeValue;
      } else while (b = a[d++]) c += e(b);
      return c;
    }, d = ga.selectors = {
      cacheLength: 50,
      createPseudo: ia,
      match: V,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: !0
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: !0
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function ATTR(a) {
          return a[1] = a[1].replace(_, aa), a[3] = (a[3] || a[4] || a[5] || "").replace(_, aa), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
        },
        CHILD: function CHILD(a) {
          return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || ga.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && ga.error(a[0]), a;
        },
        PSEUDO: function PSEUDO(a) {
          var b,
            c = !a[6] && a[2];
          return V.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && T.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3));
        }
      },
      filter: {
        TAG: function TAG(a) {
          var b = a.replace(_, aa).toLowerCase();
          return "*" === a ? function () {
            return !0;
          } : function (a) {
            return a.nodeName && a.nodeName.toLowerCase() === b;
          };
        },
        CLASS: function CLASS(a) {
          var b = y[a + " "];
          return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && y(a, function (a) {
            return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "");
          });
        },
        ATTR: function ATTR(a, b, c) {
          return function (d) {
            var e = ga.attr(d, a);
            return null == e ? "!=" === b : !b || (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(O, " ") + " ").indexOf(c) > -1 : "|=" === b && (e === c || e.slice(0, c.length + 1) === c + "-"));
          };
        },
        CHILD: function CHILD(a, b, c, d, e) {
          var f = "nth" !== a.slice(0, 3),
            g = "last" !== a.slice(-4),
            h = "of-type" === b;
          return 1 === d && 0 === e ? function (a) {
            return !!a.parentNode;
          } : function (b, c, i) {
            var j,
              k,
              l,
              m,
              n,
              o,
              p = f !== g ? "nextSibling" : "previousSibling",
              q = b.parentNode,
              r = h && b.nodeName.toLowerCase(),
              s = !i && !h,
              t = !1;
            if (q) {
              if (f) {
                while (p) {
                  m = b;
                  while (m = m[p]) if (h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) return !1;
                  o = p = "only" === a && !o && "nextSibling";
                }
                return !0;
              }
              if (o = [g ? q.firstChild : q.lastChild], g && s) {
                m = q, l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === w && j[1], t = n && j[2], m = n && q.childNodes[n];
                while (m = ++n && m && m[p] || (t = n = 0) || o.pop()) if (1 === m.nodeType && ++t && m === b) {
                  k[a] = [w, n, t];
                  break;
                }
              } else if (s && (m = b, l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), j = k[a] || [], n = j[0] === w && j[1], t = n), t === !1) while (m = ++n && m && m[p] || (t = n = 0) || o.pop()) if ((h ? m.nodeName.toLowerCase() === r : 1 === m.nodeType) && ++t && (s && (l = m[u] || (m[u] = {}), k = l[m.uniqueID] || (l[m.uniqueID] = {}), k[a] = [w, t]), m === b)) break;
              return t -= e, t === d || t % d === 0 && t / d >= 0;
            }
          };
        },
        PSEUDO: function PSEUDO(a, b) {
          var c,
            e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || ga.error("unsupported pseudo: " + a);
          return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ia(function (a, c) {
            var d,
              f = e(a, b),
              g = f.length;
            while (g--) d = I(a, f[g]), a[d] = !(c[d] = f[g]);
          }) : function (a) {
            return e(a, 0, c);
          }) : e;
        }
      },
      pseudos: {
        not: ia(function (a) {
          var b = [],
            c = [],
            d = h(a.replace(P, "$1"));
          return d[u] ? ia(function (a, b, c, e) {
            var f,
              g = d(a, null, e, []),
              h = a.length;
            while (h--) (f = g[h]) && (a[h] = !(b[h] = f));
          }) : function (a, e, f) {
            return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop();
          };
        }),
        has: ia(function (a) {
          return function (b) {
            return ga(a, b).length > 0;
          };
        }),
        contains: ia(function (a) {
          return a = a.replace(_, aa), function (b) {
            return (b.textContent || b.innerText || e(b)).indexOf(a) > -1;
          };
        }),
        lang: ia(function (a) {
          return U.test(a || "") || ga.error("unsupported lang: " + a), a = a.replace(_, aa).toLowerCase(), function (b) {
            var c;
            do if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
            return !1;
          };
        }),
        target: function target(b) {
          var c = a.location && a.location.hash;
          return c && c.slice(1) === b.id;
        },
        root: function root(a) {
          return a === o;
        },
        focus: function focus(a) {
          return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
        },
        enabled: oa(!1),
        disabled: oa(!0),
        checked: function checked(a) {
          var b = a.nodeName.toLowerCase();
          return "input" === b && !!a.checked || "option" === b && !!a.selected;
        },
        selected: function selected(a) {
          return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
        },
        empty: function empty(a) {
          for (a = a.firstChild; a; a = a.nextSibling) if (a.nodeType < 6) return !1;
          return !0;
        },
        parent: function parent(a) {
          return !d.pseudos.empty(a);
        },
        header: function header(a) {
          return X.test(a.nodeName);
        },
        input: function input(a) {
          return W.test(a.nodeName);
        },
        button: function button(a) {
          var b = a.nodeName.toLowerCase();
          return "input" === b && "button" === a.type || "button" === b;
        },
        text: function text(a) {
          var b;
          return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
        },
        first: pa(function () {
          return [0];
        }),
        last: pa(function (a, b) {
          return [b - 1];
        }),
        eq: pa(function (a, b, c) {
          return [c < 0 ? c + b : c];
        }),
        even: pa(function (a, b) {
          for (var c = 0; c < b; c += 2) a.push(c);
          return a;
        }),
        odd: pa(function (a, b) {
          for (var c = 1; c < b; c += 2) a.push(c);
          return a;
        }),
        lt: pa(function (a, b, c) {
          for (var d = c < 0 ? c + b : c; --d >= 0;) a.push(d);
          return a;
        }),
        gt: pa(function (a, b, c) {
          for (var d = c < 0 ? c + b : c; ++d < b;) a.push(d);
          return a;
        })
      }
    }, d.pseudos.nth = d.pseudos.eq;
    for (b in {
      radio: !0,
      checkbox: !0,
      file: !0,
      password: !0,
      image: !0
    }) d.pseudos[b] = ma(b);
    for (b in {
      submit: !0,
      reset: !0
    }) d.pseudos[b] = na(b);
    function ra() {}
    ra.prototype = d.filters = d.pseudos, d.setFilters = new ra(), g = ga.tokenize = function (a, b) {
      var c,
        e,
        f,
        g,
        h,
        i,
        j,
        k = z[a + " "];
      if (k) return b ? 0 : k.slice(0);
      h = a, i = [], j = d.preFilter;
      while (h) {
        c && !(e = Q.exec(h)) || (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = R.exec(h)) && (c = e.shift(), f.push({
          value: c,
          type: e[0].replace(P, " ")
        }), h = h.slice(c.length));
        for (g in d.filter) !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
          value: c,
          type: g,
          matches: e
        }), h = h.slice(c.length));
        if (!c) break;
      }
      return b ? h.length : h ? ga.error(a) : z(a, i).slice(0);
    };
    function sa(a) {
      for (var b = 0, c = a.length, d = ""; b < c; b++) d += a[b].value;
      return d;
    }
    function ta(a, b, c) {
      var d = b.dir,
        e = b.next,
        f = e || d,
        g = c && "parentNode" === f,
        h = x++;
      return b.first ? function (b, c, e) {
        while (b = b[d]) if (1 === b.nodeType || g) return a(b, c, e);
        return !1;
      } : function (b, c, i) {
        var j,
          k,
          l,
          m = [w, h];
        if (i) {
          while (b = b[d]) if ((1 === b.nodeType || g) && a(b, c, i)) return !0;
        } else while (b = b[d]) if (1 === b.nodeType || g) if (l = b[u] || (b[u] = {}), k = l[b.uniqueID] || (l[b.uniqueID] = {}), e && e === b.nodeName.toLowerCase()) b = b[d] || b;else {
          if ((j = k[f]) && j[0] === w && j[1] === h) return m[2] = j[2];
          if (k[f] = m, m[2] = a(b, c, i)) return !0;
        }
        return !1;
      };
    }
    function ua(a) {
      return a.length > 1 ? function (b, c, d) {
        var e = a.length;
        while (e--) if (!a[e](b, c, d)) return !1;
        return !0;
      } : a[0];
    }
    function va(a, b, c) {
      for (var d = 0, e = b.length; d < e; d++) ga(a, b[d], c);
      return c;
    }
    function wa(a, b, c, d, e) {
      for (var f, g = [], h = 0, i = a.length, j = null != b; h < i; h++) (f = a[h]) && (c && !c(f, d, e) || (g.push(f), j && b.push(h)));
      return g;
    }
    function xa(a, b, c, d, e, f) {
      return d && !d[u] && (d = xa(d)), e && !e[u] && (e = xa(e, f)), ia(function (f, g, h, i) {
        var j,
          k,
          l,
          m = [],
          n = [],
          o = g.length,
          p = f || va(b || "*", h.nodeType ? [h] : h, []),
          q = !a || !f && b ? p : wa(p, m, a, h, i),
          r = c ? e || (f ? a : o || d) ? [] : g : q;
        if (c && c(q, r, h, i), d) {
          j = wa(r, n), d(j, [], h, i), k = j.length;
          while (k--) (l = j[k]) && (r[n[k]] = !(q[n[k]] = l));
        }
        if (f) {
          if (e || a) {
            if (e) {
              j = [], k = r.length;
              while (k--) (l = r[k]) && j.push(q[k] = l);
              e(null, r = [], j, i);
            }
            k = r.length;
            while (k--) (l = r[k]) && (j = e ? I(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l));
          }
        } else r = wa(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : G.apply(g, r);
      });
    }
    function ya(a) {
      for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = ta(function (a) {
          return a === b;
        }, h, !0), l = ta(function (a) {
          return I(b, a) > -1;
        }, h, !0), m = [function (a, c, d) {
          var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
          return b = null, e;
        }]; i < f; i++) if (c = d.relative[a[i].type]) m = [ta(ua(m), c)];else {
        if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
          for (e = ++i; e < f; e++) if (d.relative[a[e].type]) break;
          return xa(i > 1 && ua(m), i > 1 && sa(a.slice(0, i - 1).concat({
            value: " " === a[i - 2].type ? "*" : ""
          })).replace(P, "$1"), c, i < e && ya(a.slice(i, e)), e < f && ya(a = a.slice(e)), e < f && sa(a));
        }
        m.push(c);
      }
      return ua(m);
    }
    function za(a, b) {
      var c = b.length > 0,
        e = a.length > 0,
        f = function f(_f, g, h, i, k) {
          var l,
            o,
            q,
            r = 0,
            s = "0",
            t = _f && [],
            u = [],
            v = j,
            x = _f || e && d.find.TAG("*", k),
            y = w += null == v ? 1 : Math.random() || .1,
            z = x.length;
          for (k && (j = g === n || g || k); s !== z && null != (l = x[s]); s++) {
            if (e && l) {
              o = 0, g || l.ownerDocument === n || (m(l), h = !p);
              while (q = a[o++]) if (q(l, g || n, h)) {
                i.push(l);
                break;
              }
              k && (w = y);
            }
            c && ((l = !q && l) && r--, _f && t.push(l));
          }
          if (r += s, c && s !== r) {
            o = 0;
            while (q = b[o++]) q(t, u, g, h);
            if (_f) {
              if (r > 0) while (s--) t[s] || u[s] || (u[s] = E.call(i));
              u = wa(u);
            }
            G.apply(i, u), k && !_f && u.length > 0 && r + b.length > 1 && ga.uniqueSort(i);
          }
          return k && (w = y, j = v), t;
        };
      return c ? ia(f) : f;
    }
    return h = ga.compile = function (a, b) {
      var c,
        d = [],
        e = [],
        f = A[a + " "];
      if (!f) {
        b || (b = g(a)), c = b.length;
        while (c--) f = ya(b[c]), f[u] ? d.push(f) : e.push(f);
        f = A(a, za(e, d)), f.selector = a;
      }
      return f;
    }, i = ga.select = function (a, b, c, e) {
      var f,
        i,
        j,
        k,
        l,
        m = "function" == typeof a && a,
        n = !e && g(a = m.selector || a);
      if (c = c || [], 1 === n.length) {
        if (i = n[0] = n[0].slice(0), i.length > 2 && "ID" === (j = i[0]).type && 9 === b.nodeType && p && d.relative[i[1].type]) {
          if (b = (d.find.ID(j.matches[0].replace(_, aa), b) || [])[0], !b) return c;
          m && (b = b.parentNode), a = a.slice(i.shift().value.length);
        }
        f = V.needsContext.test(a) ? 0 : i.length;
        while (f--) {
          if (j = i[f], d.relative[k = j.type]) break;
          if ((l = d.find[k]) && (e = l(j.matches[0].replace(_, aa), $.test(i[0].type) && qa(b.parentNode) || b))) {
            if (i.splice(f, 1), a = e.length && sa(i), !a) return G.apply(c, e), c;
            break;
          }
        }
      }
      return (m || h(a, n))(e, b, !p, c, !b || $.test(a) && qa(b.parentNode) || b), c;
    }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ja(function (a) {
      return 1 & a.compareDocumentPosition(n.createElement("fieldset"));
    }), ja(function (a) {
      return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href");
    }) || ka("type|href|height|width", function (a, b, c) {
      if (!c) return a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
    }), c.attributes && ja(function (a) {
      return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
    }) || ka("value", function (a, b, c) {
      if (!c && "input" === a.nodeName.toLowerCase()) return a.defaultValue;
    }), ja(function (a) {
      return null == a.getAttribute("disabled");
    }) || ka(J, function (a, b, c) {
      var d;
      if (!c) return a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
    }), ga;
  }(a);
  _r.find = x, _r.expr = x.selectors, _r.expr[":"] = _r.expr.pseudos, _r.uniqueSort = _r.unique = x.uniqueSort, _r.text = x.getText, _r.isXMLDoc = x.isXML, _r.contains = x.contains, _r.escapeSelector = x.escape;
  var y = function y(a, b, c) {
      var d = [],
        e = void 0 !== c;
      while ((a = a[b]) && 9 !== a.nodeType) if (1 === a.nodeType) {
        if (e && _r(a).is(c)) break;
        d.push(a);
      }
      return d;
    },
    z = function z(a, b) {
      for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
      return c;
    },
    A = _r.expr.match.needsContext,
    B = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
    C = /^.[^:#\[\.,]*$/;
  function D(a, b, c) {
    return _r.isFunction(b) ? _r.grep(a, function (a, d) {
      return !!b.call(a, d, a) !== c;
    }) : b.nodeType ? _r.grep(a, function (a) {
      return a === b !== c;
    }) : "string" != typeof b ? _r.grep(a, function (a) {
      return i.call(b, a) > -1 !== c;
    }) : C.test(b) ? _r.filter(b, a, c) : (b = _r.filter(b, a), _r.grep(a, function (a) {
      return i.call(b, a) > -1 !== c && 1 === a.nodeType;
    }));
  }
  _r.filter = function (a, b, c) {
    var d = b[0];
    return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? _r.find.matchesSelector(d, a) ? [d] : [] : _r.find.matches(a, _r.grep(b, function (a) {
      return 1 === a.nodeType;
    }));
  }, _r.fn.extend({
    find: function find(a) {
      var b,
        c,
        d = this.length,
        e = this;
      if ("string" != typeof a) return this.pushStack(_r(a).filter(function () {
        for (b = 0; b < d; b++) if (_r.contains(e[b], this)) return !0;
      }));
      for (c = this.pushStack([]), b = 0; b < d; b++) _r.find(a, e[b], c);
      return d > 1 ? _r.uniqueSort(c) : c;
    },
    filter: function filter(a) {
      return this.pushStack(D(this, a || [], !1));
    },
    not: function not(a) {
      return this.pushStack(D(this, a || [], !0));
    },
    is: function is(a) {
      return !!D(this, "string" == typeof a && A.test(a) ? _r(a) : a || [], !1).length;
    }
  });
  var E,
    F = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
    G = _r.fn.init = function (a, b, c) {
      var e, f;
      if (!a) return this;
      if (c = c || E, "string" == typeof a) {
        if (e = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : F.exec(a), !e || !e[1] && b) return !b || b.jquery ? (b || c).find(a) : this.constructor(b).find(a);
        if (e[1]) {
          if (b = b instanceof _r ? b[0] : b, _r.merge(this, _r.parseHTML(e[1], b && b.nodeType ? b.ownerDocument || b : d, !0)), B.test(e[1]) && _r.isPlainObject(b)) for (e in b) _r.isFunction(this[e]) ? this[e](b[e]) : this.attr(e, b[e]);
          return this;
        }
        return f = d.getElementById(e[2]), f && (this[0] = f, this.length = 1), this;
      }
      return a.nodeType ? (this[0] = a, this.length = 1, this) : _r.isFunction(a) ? void 0 !== c.ready ? c.ready(a) : a(_r) : _r.makeArray(a, this);
    };
  G.prototype = _r.fn, E = _r(d);
  var H = /^(?:parents|prev(?:Until|All))/,
    I = {
      children: !0,
      contents: !0,
      next: !0,
      prev: !0
    };
  _r.fn.extend({
    has: function has(a) {
      var b = _r(a, this),
        c = b.length;
      return this.filter(function () {
        for (var a = 0; a < c; a++) if (_r.contains(this, b[a])) return !0;
      });
    },
    closest: function closest(a, b) {
      var c,
        d = 0,
        e = this.length,
        f = [],
        g = "string" != typeof a && _r(a);
      if (!A.test(a)) for (; d < e; d++) for (c = this[d]; c && c !== b; c = c.parentNode) if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && _r.find.matchesSelector(c, a))) {
        f.push(c);
        break;
      }
      return this.pushStack(f.length > 1 ? _r.uniqueSort(f) : f);
    },
    index: function index(a) {
      return a ? "string" == typeof a ? i.call(_r(a), this[0]) : i.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    add: function add(a, b) {
      return this.pushStack(_r.uniqueSort(_r.merge(this.get(), _r(a, b))));
    },
    addBack: function addBack(a) {
      return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
    }
  });
  function J(a, b) {
    while ((a = a[b]) && 1 !== a.nodeType);
    return a;
  }
  _r.each({
    parent: function parent(a) {
      var b = a.parentNode;
      return b && 11 !== b.nodeType ? b : null;
    },
    parents: function parents(a) {
      return y(a, "parentNode");
    },
    parentsUntil: function parentsUntil(a, b, c) {
      return y(a, "parentNode", c);
    },
    next: function next(a) {
      return J(a, "nextSibling");
    },
    prev: function prev(a) {
      return J(a, "previousSibling");
    },
    nextAll: function nextAll(a) {
      return y(a, "nextSibling");
    },
    prevAll: function prevAll(a) {
      return y(a, "previousSibling");
    },
    nextUntil: function nextUntil(a, b, c) {
      return y(a, "nextSibling", c);
    },
    prevUntil: function prevUntil(a, b, c) {
      return y(a, "previousSibling", c);
    },
    siblings: function siblings(a) {
      return z((a.parentNode || {}).firstChild, a);
    },
    children: function children(a) {
      return z(a.firstChild);
    },
    contents: function contents(a) {
      return a.contentDocument || _r.merge([], a.childNodes);
    }
  }, function (a, b) {
    _r.fn[a] = function (c, d) {
      var e = _r.map(this, b, c);
      return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = _r.filter(d, e)), this.length > 1 && (I[a] || _r.uniqueSort(e), H.test(a) && e.reverse()), this.pushStack(e);
    };
  });
  var K = /[^\x20\t\r\n\f]+/g;
  function L(a) {
    var b = {};
    return _r.each(a.match(K) || [], function (a, c) {
      b[c] = !0;
    }), b;
  }
  _r.Callbacks = function (a) {
    a = "string" == typeof a ? L(a) : _r.extend({}, a);
    var b,
      c,
      d,
      e,
      f = [],
      g = [],
      h = -1,
      i = function i() {
        for (e = a.once, d = b = !0; g.length; h = -1) {
          c = g.shift();
          while (++h < f.length) f[h].apply(c[0], c[1]) === !1 && a.stopOnFalse && (h = f.length, c = !1);
        }
        a.memory || (c = !1), b = !1, e && (f = c ? [] : "");
      },
      j = {
        add: function add() {
          return f && (c && !b && (h = f.length - 1, g.push(c)), function d(b) {
            _r.each(b, function (b, c) {
              _r.isFunction(c) ? a.unique && j.has(c) || f.push(c) : c && c.length && "string" !== _r.type(c) && d(c);
            });
          }(arguments), c && !b && i()), this;
        },
        remove: function remove() {
          return _r.each(arguments, function (a, b) {
            var c;
            while ((c = _r.inArray(b, f, c)) > -1) f.splice(c, 1), c <= h && h--;
          }), this;
        },
        has: function has(a) {
          return a ? _r.inArray(a, f) > -1 : f.length > 0;
        },
        empty: function empty() {
          return f && (f = []), this;
        },
        disable: function disable() {
          return e = g = [], f = c = "", this;
        },
        disabled: function disabled() {
          return !f;
        },
        lock: function lock() {
          return e = g = [], c || b || (f = c = ""), this;
        },
        locked: function locked() {
          return !!e;
        },
        fireWith: function fireWith(a, c) {
          return e || (c = c || [], c = [a, c.slice ? c.slice() : c], g.push(c), b || i()), this;
        },
        fire: function fire() {
          return j.fireWith(this, arguments), this;
        },
        fired: function fired() {
          return !!d;
        }
      };
    return j;
  };
  function M(a) {
    return a;
  }
  function N(a) {
    throw a;
  }
  function O(a, b, c) {
    var d;
    try {
      a && _r.isFunction(d = a.promise) ? d.call(a).done(b).fail(c) : a && _r.isFunction(d = a.then) ? d.call(a, b, c) : b.call(void 0, a);
    } catch (a) {
      c.call(void 0, a);
    }
  }
  _r.extend({
    Deferred: function Deferred(b) {
      var c = [["notify", "progress", _r.Callbacks("memory"), _r.Callbacks("memory"), 2], ["resolve", "done", _r.Callbacks("once memory"), _r.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", _r.Callbacks("once memory"), _r.Callbacks("once memory"), 1, "rejected"]],
        d = "pending",
        e = {
          state: function state() {
            return d;
          },
          always: function always() {
            return f.done(arguments).fail(arguments), this;
          },
          "catch": function _catch(a) {
            return e.then(null, a);
          },
          pipe: function pipe() {
            var a = arguments;
            return _r.Deferred(function (b) {
              _r.each(c, function (c, d) {
                var e = _r.isFunction(a[d[4]]) && a[d[4]];
                f[d[1]](function () {
                  var a = e && e.apply(this, arguments);
                  a && _r.isFunction(a.promise) ? a.promise().progress(b.notify).done(b.resolve).fail(b.reject) : b[d[0] + "With"](this, e ? [a] : arguments);
                });
              }), a = null;
            }).promise();
          },
          then: function then(b, d, e) {
            var f = 0;
            function g(b, c, d, e) {
              return function () {
                var h = this,
                  i = arguments,
                  j = function j() {
                    var a, j;
                    if (!(b < f)) {
                      if (a = d.apply(h, i), a === c.promise()) throw new TypeError("Thenable self-resolution");
                      j = a && ("object" == (0, _typeof2["default"])(a) || "function" == typeof a) && a.then, _r.isFunction(j) ? e ? j.call(a, g(f, c, M, e), g(f, c, N, e)) : (f++, j.call(a, g(f, c, M, e), g(f, c, N, e), g(f, c, M, c.notifyWith))) : (d !== M && (h = void 0, i = [a]), (e || c.resolveWith)(h, i));
                    }
                  },
                  k = e ? j : function () {
                    try {
                      j();
                    } catch (a) {
                      _r.Deferred.exceptionHook && _r.Deferred.exceptionHook(a, k.stackTrace), b + 1 >= f && (d !== N && (h = void 0, i = [a]), c.rejectWith(h, i));
                    }
                  };
                b ? k() : (_r.Deferred.getStackHook && (k.stackTrace = _r.Deferred.getStackHook()), a.setTimeout(k));
              };
            }
            return _r.Deferred(function (a) {
              c[0][3].add(g(0, a, _r.isFunction(e) ? e : M, a.notifyWith)), c[1][3].add(g(0, a, _r.isFunction(b) ? b : M)), c[2][3].add(g(0, a, _r.isFunction(d) ? d : N));
            }).promise();
          },
          promise: function promise(a) {
            return null != a ? _r.extend(a, e) : e;
          }
        },
        f = {};
      return _r.each(c, function (a, b) {
        var g = b[2],
          h = b[5];
        e[b[1]] = g.add, h && g.add(function () {
          d = h;
        }, c[3 - a][2].disable, c[0][2].lock), g.add(b[3].fire), f[b[0]] = function () {
          return f[b[0] + "With"](this === f ? void 0 : this, arguments), this;
        }, f[b[0] + "With"] = g.fireWith;
      }), e.promise(f), b && b.call(f, f), f;
    },
    when: function when(a) {
      var b = arguments.length,
        c = b,
        d = Array(c),
        e = f.call(arguments),
        g = _r.Deferred(),
        h = function h(a) {
          return function (c) {
            d[a] = this, e[a] = arguments.length > 1 ? f.call(arguments) : c, --b || g.resolveWith(d, e);
          };
        };
      if (b <= 1 && (O(a, g.done(h(c)).resolve, g.reject), "pending" === g.state() || _r.isFunction(e[c] && e[c].then))) return g.then();
      while (c--) O(e[c], h(c), g.reject);
      return g.promise();
    }
  });
  var P = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  _r.Deferred.exceptionHook = function (b, c) {
    a.console && a.console.warn && b && P.test(b.name) && a.console.warn("jQuery.Deferred exception: " + b.message, b.stack, c);
  }, _r.readyException = function (b) {
    a.setTimeout(function () {
      throw b;
    });
  };
  var Q = _r.Deferred();
  _r.fn.ready = function (a) {
    return Q.then(a)["catch"](function (a) {
      _r.readyException(a);
    }), this;
  }, _r.extend({
    isReady: !1,
    readyWait: 1,
    holdReady: function holdReady(a) {
      a ? _r.readyWait++ : _r.ready(!0);
    },
    ready: function ready(a) {
      (a === !0 ? --_r.readyWait : _r.isReady) || (_r.isReady = !0, a !== !0 && --_r.readyWait > 0 || Q.resolveWith(d, [_r]));
    }
  }), _r.ready.then = Q.then;
  function R() {
    d.removeEventListener("DOMContentLoaded", R), a.removeEventListener("load", R), _r.ready();
  }
  "complete" === d.readyState || "loading" !== d.readyState && !d.documentElement.doScroll ? a.setTimeout(_r.ready) : (d.addEventListener("DOMContentLoaded", R), a.addEventListener("load", R));
  var _S = function S(a, b, c, d, e, f, g) {
      var h = 0,
        i = a.length,
        j = null == c;
      if ("object" === _r.type(c)) {
        e = !0;
        for (h in c) _S(a, b, h, c[h], !0, f, g);
      } else if (void 0 !== d && (e = !0, _r.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function b(a, _b, c) {
        return j.call(_r(a), c);
      })), b)) for (; h < i; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
      return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
    },
    T = function T(a) {
      return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType;
    };
  function U() {
    this.expando = _r.expando + U.uid++;
  }
  U.uid = 1, U.prototype = {
    cache: function cache(a) {
      var b = a[this.expando];
      return b || (b = {}, T(a) && (a.nodeType ? a[this.expando] = b : Object.defineProperty(a, this.expando, {
        value: b,
        configurable: !0
      }))), b;
    },
    set: function set(a, b, c) {
      var d,
        e = this.cache(a);
      if ("string" == typeof b) e[_r.camelCase(b)] = c;else for (d in b) e[_r.camelCase(d)] = b[d];
      return e;
    },
    get: function get(a, b) {
      return void 0 === b ? this.cache(a) : a[this.expando] && a[this.expando][_r.camelCase(b)];
    },
    access: function access(a, b, c) {
      return void 0 === b || b && "string" == typeof b && void 0 === c ? this.get(a, b) : (this.set(a, b, c), void 0 !== c ? c : b);
    },
    remove: function remove(a, b) {
      var c,
        d = a[this.expando];
      if (void 0 !== d) {
        if (void 0 !== b) {
          _r.isArray(b) ? b = b.map(_r.camelCase) : (b = _r.camelCase(b), b = b in d ? [b] : b.match(K) || []), c = b.length;
          while (c--) delete d[b[c]];
        }
        (void 0 === b || _r.isEmptyObject(d)) && (a.nodeType ? a[this.expando] = void 0 : delete a[this.expando]);
      }
    },
    hasData: function hasData(a) {
      var b = a[this.expando];
      return void 0 !== b && !_r.isEmptyObject(b);
    }
  };
  var V = new U(),
    W = new U(),
    X = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    Y = /[A-Z]/g;
  function Z(a) {
    return "true" === a || "false" !== a && ("null" === a ? null : a === +a + "" ? +a : X.test(a) ? JSON.parse(a) : a);
  }
  function $(a, b, c) {
    var d;
    if (void 0 === c && 1 === a.nodeType) if (d = "data-" + b.replace(Y, "-$&").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) {
      try {
        c = Z(c);
      } catch (e) {}
      W.set(a, b, c);
    } else c = void 0;
    return c;
  }
  _r.extend({
    hasData: function hasData(a) {
      return W.hasData(a) || V.hasData(a);
    },
    data: function data(a, b, c) {
      return W.access(a, b, c);
    },
    removeData: function removeData(a, b) {
      W.remove(a, b);
    },
    _data: function _data(a, b, c) {
      return V.access(a, b, c);
    },
    _removeData: function _removeData(a, b) {
      V.remove(a, b);
    }
  }), _r.fn.extend({
    data: function data(a, b) {
      var c,
        d,
        e,
        f = this[0],
        g = f && f.attributes;
      if (void 0 === a) {
        if (this.length && (e = W.get(f), 1 === f.nodeType && !V.get(f, "hasDataAttrs"))) {
          c = g.length;
          while (c--) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = _r.camelCase(d.slice(5)), $(f, d, e[d])));
          V.set(f, "hasDataAttrs", !0);
        }
        return e;
      }
      return "object" == (0, _typeof2["default"])(a) ? this.each(function () {
        W.set(this, a);
      }) : _S(this, function (b) {
        var c;
        if (f && void 0 === b) {
          if (c = W.get(f, a), void 0 !== c) return c;
          if (c = $(f, a), void 0 !== c) return c;
        } else this.each(function () {
          W.set(this, a, b);
        });
      }, null, b, arguments.length > 1, null, !0);
    },
    removeData: function removeData(a) {
      return this.each(function () {
        W.remove(this, a);
      });
    }
  }), _r.extend({
    queue: function queue(a, b, c) {
      var d;
      if (a) return b = (b || "fx") + "queue", d = V.get(a, b), c && (!d || _r.isArray(c) ? d = V.access(a, b, _r.makeArray(c)) : d.push(c)), d || [];
    },
    dequeue: function dequeue(a, b) {
      b = b || "fx";
      var c = _r.queue(a, b),
        d = c.length,
        e = c.shift(),
        f = _r._queueHooks(a, b),
        g = function g() {
          _r.dequeue(a, b);
        };
      "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
    },
    _queueHooks: function _queueHooks(a, b) {
      var c = b + "queueHooks";
      return V.get(a, c) || V.access(a, c, {
        empty: _r.Callbacks("once memory").add(function () {
          V.remove(a, [b + "queue", c]);
        })
      });
    }
  }), _r.fn.extend({
    queue: function queue(a, b) {
      var c = 2;
      return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? _r.queue(this[0], a) : void 0 === b ? this : this.each(function () {
        var c = _r.queue(this, a, b);
        _r._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && _r.dequeue(this, a);
      });
    },
    dequeue: function dequeue(a) {
      return this.each(function () {
        _r.dequeue(this, a);
      });
    },
    clearQueue: function clearQueue(a) {
      return this.queue(a || "fx", []);
    },
    promise: function promise(a, b) {
      var c,
        d = 1,
        e = _r.Deferred(),
        f = this,
        g = this.length,
        h = function h() {
          --d || e.resolveWith(f, [f]);
        };
      "string" != typeof a && (b = a, a = void 0), a = a || "fx";
      while (g--) c = V.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
      return h(), e.promise(b);
    }
  });
  var _ = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    aa = new RegExp("^(?:([+-])=|)(" + _ + ")([a-z%]*)$", "i"),
    ba = ["Top", "Right", "Bottom", "Left"],
    ca = function ca(a, b) {
      return a = b || a, "none" === a.style.display || "" === a.style.display && _r.contains(a.ownerDocument, a) && "none" === _r.css(a, "display");
    },
    da = function da(a, b, c, d) {
      var e,
        f,
        g = {};
      for (f in b) g[f] = a.style[f], a.style[f] = b[f];
      e = c.apply(a, d || []);
      for (f in b) a.style[f] = g[f];
      return e;
    };
  function ea(a, b, c, d) {
    var e,
      f = 1,
      g = 20,
      h = d ? function () {
        return d.cur();
      } : function () {
        return _r.css(a, b, "");
      },
      i = h(),
      j = c && c[3] || (_r.cssNumber[b] ? "" : "px"),
      k = (_r.cssNumber[b] || "px" !== j && +i) && aa.exec(_r.css(a, b));
    if (k && k[3] !== j) {
      j = j || k[3], c = c || [], k = +i || 1;
      do f = f || ".5", k /= f, _r.style(a, b, k + j); while (f !== (f = h() / i) && 1 !== f && --g);
    }
    return c && (k = +k || +i || 0, e = c[1] ? k + (c[1] + 1) * c[2] : +c[2], d && (d.unit = j, d.start = k, d.end = e)), e;
  }
  var fa = {};
  function ga(a) {
    var b,
      c = a.ownerDocument,
      d = a.nodeName,
      e = fa[d];
    return e ? e : (b = c.body.appendChild(c.createElement(d)), e = _r.css(b, "display"), b.parentNode.removeChild(b), "none" === e && (e = "block"), fa[d] = e, e);
  }
  function ha(a, b) {
    for (var c, d, e = [], f = 0, g = a.length; f < g; f++) d = a[f], d.style && (c = d.style.display, b ? ("none" === c && (e[f] = V.get(d, "display") || null, e[f] || (d.style.display = "")), "" === d.style.display && ca(d) && (e[f] = ga(d))) : "none" !== c && (e[f] = "none", V.set(d, "display", c)));
    for (f = 0; f < g; f++) null != e[f] && (a[f].style.display = e[f]);
    return a;
  }
  _r.fn.extend({
    show: function show() {
      return ha(this, !0);
    },
    hide: function hide() {
      return ha(this);
    },
    toggle: function toggle(a) {
      return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
        ca(this) ? _r(this).show() : _r(this).hide();
      });
    }
  });
  var ia = /^(?:checkbox|radio)$/i,
    ja = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
    ka = /^$|\/(?:java|ecma)script/i,
    la = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
  la.optgroup = la.option, la.tbody = la.tfoot = la.colgroup = la.caption = la.thead, la.th = la.td;
  function ma(a, b) {
    var c;
    return c = "undefined" != typeof a.getElementsByTagName ? a.getElementsByTagName(b || "*") : "undefined" != typeof a.querySelectorAll ? a.querySelectorAll(b || "*") : [], void 0 === b || b && _r.nodeName(a, b) ? _r.merge([a], c) : c;
  }
  function na(a, b) {
    for (var c = 0, d = a.length; c < d; c++) V.set(a[c], "globalEval", !b || V.get(b[c], "globalEval"));
  }
  var oa = /<|&#?\w+;/;
  function pa(a, b, c, d, e) {
    for (var f, g, h, i, j, k, l = b.createDocumentFragment(), m = [], n = 0, o = a.length; n < o; n++) if (f = a[n], f || 0 === f) if ("object" === _r.type(f)) _r.merge(m, f.nodeType ? [f] : f);else if (oa.test(f)) {
      g = g || l.appendChild(b.createElement("div")), h = (ja.exec(f) || ["", ""])[1].toLowerCase(), i = la[h] || la._default, g.innerHTML = i[1] + _r.htmlPrefilter(f) + i[2], k = i[0];
      while (k--) g = g.lastChild;
      _r.merge(m, g.childNodes), g = l.firstChild, g.textContent = "";
    } else m.push(b.createTextNode(f));
    l.textContent = "", n = 0;
    while (f = m[n++]) if (d && _r.inArray(f, d) > -1) e && e.push(f);else if (j = _r.contains(f.ownerDocument, f), g = ma(l.appendChild(f), "script"), j && na(g), c) {
      k = 0;
      while (f = g[k++]) ka.test(f.type || "") && c.push(f);
    }
    return l;
  }
  !function () {
    var a = d.createDocumentFragment(),
      b = a.appendChild(d.createElement("div")),
      c = d.createElement("input");
    c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), o.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", o.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue;
  }();
  var qa = d.documentElement,
    ra = /^key/,
    sa = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    ta = /^([^.]*)(?:\.(.+)|)/;
  function ua() {
    return !0;
  }
  function va() {
    return !1;
  }
  function wa() {
    try {
      return d.activeElement;
    } catch (a) {}
  }
  function xa(a, b, c, d, e, f) {
    var g, h;
    if ("object" == (0, _typeof2["default"])(b)) {
      "string" != typeof c && (d = d || c, c = void 0);
      for (h in b) xa(a, h, c, d, b[h], f);
      return a;
    }
    if (null == d && null == e ? (e = c, d = c = void 0) : null == e && ("string" == typeof c ? (e = d, d = void 0) : (e = d, d = c, c = void 0)), e === !1) e = va;else if (!e) return a;
    return 1 === f && (g = e, e = function e(a) {
      return _r().off(a), g.apply(this, arguments);
    }, e.guid = g.guid || (g.guid = _r.guid++)), a.each(function () {
      _r.event.add(this, b, e, d, c);
    });
  }
  _r.event = {
    global: {},
    add: function add(a, b, c, d, e) {
      var f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q = V.get(a);
      if (q) {
        c.handler && (f = c, c = f.handler, e = f.selector), e && _r.find.matchesSelector(qa, e), c.guid || (c.guid = _r.guid++), (i = q.events) || (i = q.events = {}), (g = q.handle) || (g = q.handle = function (b) {
          return "undefined" != typeof _r && _r.event.triggered !== b.type ? _r.event.dispatch.apply(a, arguments) : void 0;
        }), b = (b || "").match(K) || [""], j = b.length;
        while (j--) h = ta.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n && (l = _r.event.special[n] || {}, n = (e ? l.delegateType : l.bindType) || n, l = _r.event.special[n] || {}, k = _r.extend({
          type: n,
          origType: p,
          data: d,
          handler: c,
          guid: c.guid,
          selector: e,
          needsContext: e && _r.expr.match.needsContext.test(e),
          namespace: o.join(".")
        }, f), (m = i[n]) || (m = i[n] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, o, g) !== !1 || a.addEventListener && a.addEventListener(n, g)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), _r.event.global[n] = !0);
      }
    },
    remove: function remove(a, b, c, d, e) {
      var f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q = V.hasData(a) && V.get(a);
      if (q && (i = q.events)) {
        b = (b || "").match(K) || [""], j = b.length;
        while (j--) if (h = ta.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
          l = _r.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = i[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length;
          while (f--) k = m[f], !e && p !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k));
          g && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || _r.removeEvent(a, n, q.handle), delete i[n]);
        } else for (n in i) _r.event.remove(a, n + b[j], c, d, !0);
        _r.isEmptyObject(i) && V.remove(a, "handle events");
      }
    },
    dispatch: function dispatch(a) {
      var b = _r.event.fix(a),
        c,
        d,
        e,
        f,
        g,
        h,
        i = new Array(arguments.length),
        j = (V.get(this, "events") || {})[b.type] || [],
        k = _r.event.special[b.type] || {};
      for (i[0] = b, c = 1; c < arguments.length; c++) i[c] = arguments[c];
      if (b.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, b) !== !1) {
        h = _r.event.handlers.call(this, b, j), c = 0;
        while ((f = h[c++]) && !b.isPropagationStopped()) {
          b.currentTarget = f.elem, d = 0;
          while ((g = f.handlers[d++]) && !b.isImmediatePropagationStopped()) b.rnamespace && !b.rnamespace.test(g.namespace) || (b.handleObj = g, b.data = g.data, e = ((_r.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (b.result = e) === !1 && (b.preventDefault(), b.stopPropagation()));
        }
        return k.postDispatch && k.postDispatch.call(this, b), b.result;
      }
    },
    handlers: function handlers(a, b) {
      var c,
        d,
        e,
        f,
        g,
        h = [],
        i = b.delegateCount,
        j = a.target;
      if (i && j.nodeType && !("click" === a.type && a.button >= 1)) for (; j !== this; j = j.parentNode || this) if (1 === j.nodeType && ("click" !== a.type || j.disabled !== !0)) {
        for (f = [], g = {}, c = 0; c < i; c++) d = b[c], e = d.selector + " ", void 0 === g[e] && (g[e] = d.needsContext ? _r(e, this).index(j) > -1 : _r.find(e, this, null, [j]).length), g[e] && f.push(d);
        f.length && h.push({
          elem: j,
          handlers: f
        });
      }
      return j = this, i < b.length && h.push({
        elem: j,
        handlers: b.slice(i)
      }), h;
    },
    addProp: function addProp(a, b) {
      Object.defineProperty(_r.Event.prototype, a, {
        enumerable: !0,
        configurable: !0,
        get: _r.isFunction(b) ? function () {
          if (this.originalEvent) return b(this.originalEvent);
        } : function () {
          if (this.originalEvent) return this.originalEvent[a];
        },
        set: function set(b) {
          Object.defineProperty(this, a, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: b
          });
        }
      });
    },
    fix: function fix(a) {
      return a[_r.expando] ? a : new _r.Event(a);
    },
    special: {
      load: {
        noBubble: !0
      },
      focus: {
        trigger: function trigger() {
          if (this !== wa() && this.focus) return this.focus(), !1;
        },
        delegateType: "focusin"
      },
      blur: {
        trigger: function trigger() {
          if (this === wa() && this.blur) return this.blur(), !1;
        },
        delegateType: "focusout"
      },
      click: {
        trigger: function trigger() {
          if ("checkbox" === this.type && this.click && _r.nodeName(this, "input")) return this.click(), !1;
        },
        _default: function _default(a) {
          return _r.nodeName(a.target, "a");
        }
      },
      beforeunload: {
        postDispatch: function postDispatch(a) {
          void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
        }
      }
    }
  }, _r.removeEvent = function (a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c);
  }, _r.Event = function (a, b) {
    return this instanceof _r.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ua : va, this.target = a.target && 3 === a.target.nodeType ? a.target.parentNode : a.target, this.currentTarget = a.currentTarget, this.relatedTarget = a.relatedTarget) : this.type = a, b && _r.extend(this, b), this.timeStamp = a && a.timeStamp || _r.now(), void (this[_r.expando] = !0)) : new _r.Event(a, b);
  }, _r.Event.prototype = {
    constructor: _r.Event,
    isDefaultPrevented: va,
    isPropagationStopped: va,
    isImmediatePropagationStopped: va,
    isSimulated: !1,
    preventDefault: function preventDefault() {
      var a = this.originalEvent;
      this.isDefaultPrevented = ua, a && !this.isSimulated && a.preventDefault();
    },
    stopPropagation: function stopPropagation() {
      var a = this.originalEvent;
      this.isPropagationStopped = ua, a && !this.isSimulated && a.stopPropagation();
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      var a = this.originalEvent;
      this.isImmediatePropagationStopped = ua, a && !this.isSimulated && a.stopImmediatePropagation(), this.stopPropagation();
    }
  }, _r.each({
    altKey: !0,
    bubbles: !0,
    cancelable: !0,
    changedTouches: !0,
    ctrlKey: !0,
    detail: !0,
    eventPhase: !0,
    metaKey: !0,
    pageX: !0,
    pageY: !0,
    shiftKey: !0,
    view: !0,
    "char": !0,
    charCode: !0,
    key: !0,
    keyCode: !0,
    button: !0,
    buttons: !0,
    clientX: !0,
    clientY: !0,
    offsetX: !0,
    offsetY: !0,
    pointerId: !0,
    pointerType: !0,
    screenX: !0,
    screenY: !0,
    targetTouches: !0,
    toElement: !0,
    touches: !0,
    which: function which(a) {
      var b = a.button;
      return null == a.which && ra.test(a.type) ? null != a.charCode ? a.charCode : a.keyCode : !a.which && void 0 !== b && sa.test(a.type) ? 1 & b ? 1 : 2 & b ? 3 : 4 & b ? 2 : 0 : a.which;
    }
  }, _r.event.addProp), _r.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function (a, b) {
    _r.event.special[a] = {
      delegateType: b,
      bindType: b,
      handle: function handle(a) {
        var c,
          d = this,
          e = a.relatedTarget,
          f = a.handleObj;
        return e && (e === d || _r.contains(d, e)) || (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c;
      }
    };
  }), _r.fn.extend({
    on: function on(a, b, c, d) {
      return xa(this, a, b, c, d);
    },
    one: function one(a, b, c, d) {
      return xa(this, a, b, c, d, 1);
    },
    off: function off(a, b, c) {
      var d, e;
      if (a && a.preventDefault && a.handleObj) return d = a.handleObj, _r(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
      if ("object" == (0, _typeof2["default"])(a)) {
        for (e in a) this.off(e, b, a[e]);
        return this;
      }
      return b !== !1 && "function" != typeof b || (c = b, b = void 0), c === !1 && (c = va), this.each(function () {
        _r.event.remove(this, a, c, b);
      });
    }
  });
  var ya = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
    za = /<script|<style|<link/i,
    Aa = /checked\s*(?:[^=]|=\s*.checked.)/i,
    Ba = /^true\/(.*)/,
    Ca = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  function Da(a, b) {
    return _r.nodeName(a, "table") && _r.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a : a;
  }
  function Ea(a) {
    return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a;
  }
  function Fa(a) {
    var b = Ba.exec(a.type);
    return b ? a.type = b[1] : a.removeAttribute("type"), a;
  }
  function Ga(a, b) {
    var c, d, e, f, g, h, i, j;
    if (1 === b.nodeType) {
      if (V.hasData(a) && (f = V.access(a), g = V.set(b, f), j = f.events)) {
        delete g.handle, g.events = {};
        for (e in j) for (c = 0, d = j[e].length; c < d; c++) _r.event.add(b, e, j[e][c]);
      }
      W.hasData(a) && (h = W.access(a), i = _r.extend({}, h), W.set(b, i));
    }
  }
  function Ha(a, b) {
    var c = b.nodeName.toLowerCase();
    "input" === c && ia.test(a.type) ? b.checked = a.checked : "input" !== c && "textarea" !== c || (b.defaultValue = a.defaultValue);
  }
  function Ia(a, b, c, d) {
    b = g.apply([], b);
    var e,
      f,
      h,
      i,
      j,
      k,
      l = 0,
      m = a.length,
      n = m - 1,
      q = b[0],
      s = _r.isFunction(q);
    if (s || m > 1 && "string" == typeof q && !o.checkClone && Aa.test(q)) return a.each(function (e) {
      var f = a.eq(e);
      s && (b[0] = q.call(this, e, f.html())), Ia(f, b, c, d);
    });
    if (m && (e = pa(b, a[0].ownerDocument, !1, a, d), f = e.firstChild, 1 === e.childNodes.length && (e = f), f || d)) {
      for (h = _r.map(ma(e, "script"), Ea), i = h.length; l < m; l++) j = e, l !== n && (j = _r.clone(j, !0, !0), i && _r.merge(h, ma(j, "script"))), c.call(a[l], j, l);
      if (i) for (k = h[h.length - 1].ownerDocument, _r.map(h, Fa), l = 0; l < i; l++) j = h[l], ka.test(j.type || "") && !V.access(j, "globalEval") && _r.contains(k, j) && (j.src ? _r._evalUrl && _r._evalUrl(j.src) : p(j.textContent.replace(Ca, ""), k));
    }
    return a;
  }
  function Ja(a, b, c) {
    for (var d, e = b ? _r.filter(b, a) : a, f = 0; null != (d = e[f]); f++) c || 1 !== d.nodeType || _r.cleanData(ma(d)), d.parentNode && (c && _r.contains(d.ownerDocument, d) && na(ma(d, "script")), d.parentNode.removeChild(d));
    return a;
  }
  _r.extend({
    htmlPrefilter: function htmlPrefilter(a) {
      return a.replace(ya, "<$1></$2>");
    },
    clone: function clone(a, b, c) {
      var d,
        e,
        f,
        g,
        h = a.cloneNode(!0),
        i = _r.contains(a.ownerDocument, a);
      if (!(o.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || _r.isXMLDoc(a))) for (g = ma(h), f = ma(a), d = 0, e = f.length; d < e; d++) Ha(f[d], g[d]);
      if (b) if (c) for (f = f || ma(a), g = g || ma(h), d = 0, e = f.length; d < e; d++) Ga(f[d], g[d]);else Ga(a, h);
      return g = ma(h, "script"), g.length > 0 && na(g, !i && ma(a, "script")), h;
    },
    cleanData: function cleanData(a) {
      for (var b, c, d, e = _r.event.special, f = 0; void 0 !== (c = a[f]); f++) if (T(c)) {
        if (b = c[V.expando]) {
          if (b.events) for (d in b.events) e[d] ? _r.event.remove(c, d) : _r.removeEvent(c, d, b.handle);
          c[V.expando] = void 0;
        }
        c[W.expando] && (c[W.expando] = void 0);
      }
    }
  }), _r.fn.extend({
    detach: function detach(a) {
      return Ja(this, a, !0);
    },
    remove: function remove(a) {
      return Ja(this, a);
    },
    text: function text(a) {
      return _S(this, function (a) {
        return void 0 === a ? _r.text(this) : this.empty().each(function () {
          1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = a);
        });
      }, null, a, arguments.length);
    },
    append: function append() {
      return Ia(this, arguments, function (a) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var b = Da(this, a);
          b.appendChild(a);
        }
      });
    },
    prepend: function prepend() {
      return Ia(this, arguments, function (a) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var b = Da(this, a);
          b.insertBefore(a, b.firstChild);
        }
      });
    },
    before: function before() {
      return Ia(this, arguments, function (a) {
        this.parentNode && this.parentNode.insertBefore(a, this);
      });
    },
    after: function after() {
      return Ia(this, arguments, function (a) {
        this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
      });
    },
    empty: function empty() {
      for (var a, b = 0; null != (a = this[b]); b++) 1 === a.nodeType && (_r.cleanData(ma(a, !1)), a.textContent = "");
      return this;
    },
    clone: function clone(a, b) {
      return a = null != a && a, b = null == b ? a : b, this.map(function () {
        return _r.clone(this, a, b);
      });
    },
    html: function html(a) {
      return _S(this, function (a) {
        var b = this[0] || {},
          c = 0,
          d = this.length;
        if (void 0 === a && 1 === b.nodeType) return b.innerHTML;
        if ("string" == typeof a && !za.test(a) && !la[(ja.exec(a) || ["", ""])[1].toLowerCase()]) {
          a = _r.htmlPrefilter(a);
          try {
            for (; c < d; c++) b = this[c] || {}, 1 === b.nodeType && (_r.cleanData(ma(b, !1)), b.innerHTML = a);
            b = 0;
          } catch (e) {}
        }
        b && this.empty().append(a);
      }, null, a, arguments.length);
    },
    replaceWith: function replaceWith() {
      var a = [];
      return Ia(this, arguments, function (b) {
        var c = this.parentNode;
        _r.inArray(this, a) < 0 && (_r.cleanData(ma(this)), c && c.replaceChild(b, this));
      }, a);
    }
  }), _r.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (a, b) {
    _r.fn[a] = function (a) {
      for (var c, d = [], e = _r(a), f = e.length - 1, g = 0; g <= f; g++) c = g === f ? this : this.clone(!0), _r(e[g])[b](c), h.apply(d, c.get());
      return this.pushStack(d);
    };
  });
  var Ka = /^margin/,
    La = new RegExp("^(" + _ + ")(?!px)[a-z%]+$", "i"),
    Ma = function Ma(b) {
      var c = b.ownerDocument.defaultView;
      return c && c.opener || (c = a), c.getComputedStyle(b);
    };
  !function () {
    function b() {
      if (i) {
        i.style.cssText = "box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%", i.innerHTML = "", qa.appendChild(h);
        var b = a.getComputedStyle(i);
        c = "1%" !== b.top, g = "2px" === b.marginLeft, e = "4px" === b.width, i.style.marginRight = "50%", f = "4px" === b.marginRight, qa.removeChild(h), i = null;
      }
    }
    var c,
      e,
      f,
      g,
      h = d.createElement("div"),
      i = d.createElement("div");
    i.style && (i.style.backgroundClip = "content-box", i.cloneNode(!0).style.backgroundClip = "", o.clearCloneStyle = "content-box" === i.style.backgroundClip, h.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute", h.appendChild(i), _r.extend(o, {
      pixelPosition: function pixelPosition() {
        return b(), c;
      },
      boxSizingReliable: function boxSizingReliable() {
        return b(), e;
      },
      pixelMarginRight: function pixelMarginRight() {
        return b(), f;
      },
      reliableMarginLeft: function reliableMarginLeft() {
        return b(), g;
      }
    }));
  }();
  function Na(a, b, c) {
    var d,
      e,
      f,
      g,
      h = a.style;
    return c = c || Ma(a), c && (g = c.getPropertyValue(b) || c[b], "" !== g || _r.contains(a.ownerDocument, a) || (g = _r.style(a, b)), !o.pixelMarginRight() && La.test(g) && Ka.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g;
  }
  function Oa(a, b) {
    return {
      get: function get() {
        return a() ? void delete this.get : (this.get = b).apply(this, arguments);
      }
    };
  }
  var Pa = /^(none|table(?!-c[ea]).+)/,
    Qa = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    Ra = {
      letterSpacing: "0",
      fontWeight: "400"
    },
    Sa = ["Webkit", "Moz", "ms"],
    Ta = d.createElement("div").style;
  function Ua(a) {
    if (a in Ta) return a;
    var b = a[0].toUpperCase() + a.slice(1),
      c = Sa.length;
    while (c--) if (a = Sa[c] + b, a in Ta) return a;
  }
  function Va(a, b, c) {
    var d = aa.exec(b);
    return d ? Math.max(0, d[2] - (c || 0)) + (d[3] || "px") : b;
  }
  function Wa(a, b, c, d, e) {
    var f,
      g = 0;
    for (f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0; f < 4; f += 2) "margin" === c && (g += _r.css(a, c + ba[f], !0, e)), d ? ("content" === c && (g -= _r.css(a, "padding" + ba[f], !0, e)), "margin" !== c && (g -= _r.css(a, "border" + ba[f] + "Width", !0, e))) : (g += _r.css(a, "padding" + ba[f], !0, e), "padding" !== c && (g += _r.css(a, "border" + ba[f] + "Width", !0, e)));
    return g;
  }
  function Xa(a, b, c) {
    var d,
      e = !0,
      f = Ma(a),
      g = "border-box" === _r.css(a, "boxSizing", !1, f);
    if (a.getClientRects().length && (d = a.getBoundingClientRect()[b]), d <= 0 || null == d) {
      if (d = Na(a, b, f), (d < 0 || null == d) && (d = a.style[b]), La.test(d)) return d;
      e = g && (o.boxSizingReliable() || d === a.style[b]), d = parseFloat(d) || 0;
    }
    return d + Wa(a, b, c || (g ? "border" : "content"), e, f) + "px";
  }
  _r.extend({
    cssHooks: {
      opacity: {
        get: function get(a, b) {
          if (b) {
            var c = Na(a, "opacity");
            return "" === c ? "1" : c;
          }
        }
      }
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {
      "float": "cssFloat"
    },
    style: function style(a, b, c, d) {
      if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
        var e,
          f,
          g,
          h = _r.camelCase(b),
          i = a.style;
        return b = _r.cssProps[h] || (_r.cssProps[h] = Ua(h) || h), g = _r.cssHooks[b] || _r.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = (0, _typeof2["default"])(c), "string" === f && (e = aa.exec(c)) && e[1] && (c = ea(a, b, e), f = "number"), null != c && c === c && ("number" === f && (c += e && e[3] || (_r.cssNumber[h] ? "" : "px")), o.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)), void 0);
      }
    },
    css: function css(a, b, c, d) {
      var e,
        f,
        g,
        h = _r.camelCase(b);
      return b = _r.cssProps[h] || (_r.cssProps[h] = Ua(h) || h), g = _r.cssHooks[b] || _r.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = Na(a, b, d)), "normal" === e && b in Ra && (e = Ra[b]), "" === c || c ? (f = parseFloat(e), c === !0 || isFinite(f) ? f || 0 : e) : e;
    }
  }), _r.each(["height", "width"], function (a, b) {
    _r.cssHooks[b] = {
      get: function get(a, c, d) {
        if (c) return !Pa.test(_r.css(a, "display")) || a.getClientRects().length && a.getBoundingClientRect().width ? Xa(a, b, d) : da(a, Qa, function () {
          return Xa(a, b, d);
        });
      },
      set: function set(a, c, d) {
        var e,
          f = d && Ma(a),
          g = d && Wa(a, b, d, "border-box" === _r.css(a, "boxSizing", !1, f), f);
        return g && (e = aa.exec(c)) && "px" !== (e[3] || "px") && (a.style[b] = c, c = _r.css(a, b)), Va(a, c, g);
      }
    };
  }), _r.cssHooks.marginLeft = Oa(o.reliableMarginLeft, function (a, b) {
    if (b) return (parseFloat(Na(a, "marginLeft")) || a.getBoundingClientRect().left - da(a, {
      marginLeft: 0
    }, function () {
      return a.getBoundingClientRect().left;
    })) + "px";
  }), _r.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function (a, b) {
    _r.cssHooks[a + b] = {
      expand: function expand(c) {
        for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; d < 4; d++) e[a + ba[d] + b] = f[d] || f[d - 2] || f[0];
        return e;
      }
    }, Ka.test(a) || (_r.cssHooks[a + b].set = Va);
  }), _r.fn.extend({
    css: function css(a, b) {
      return _S(this, function (a, b, c) {
        var d,
          e,
          f = {},
          g = 0;
        if (_r.isArray(b)) {
          for (d = Ma(a), e = b.length; g < e; g++) f[b[g]] = _r.css(a, b[g], !1, d);
          return f;
        }
        return void 0 !== c ? _r.style(a, b, c) : _r.css(a, b);
      }, a, b, arguments.length > 1);
    }
  }), _r.fn.delay = function (b, c) {
    return b = _r.fx ? _r.fx.speeds[b] || b : b, c = c || "fx", this.queue(c, function (c, d) {
      var e = a.setTimeout(c, b);
      d.stop = function () {
        a.clearTimeout(e);
      };
    });
  }, function () {
    var a = d.createElement("input"),
      b = d.createElement("select"),
      c = b.appendChild(d.createElement("option"));
    a.type = "checkbox", o.checkOn = "" !== a.value, o.optSelected = c.selected, a = d.createElement("input"), a.value = "t", a.type = "radio", o.radioValue = "t" === a.value;
  }();
  var Ya,
    Za = _r.expr.attrHandle;
  _r.fn.extend({
    attr: function attr(a, b) {
      return _S(this, _r.attr, a, b, arguments.length > 1);
    },
    removeAttr: function removeAttr(a) {
      return this.each(function () {
        _r.removeAttr(this, a);
      });
    }
  }), _r.extend({
    attr: function attr(a, b, c) {
      var d,
        e,
        f = a.nodeType;
      if (3 !== f && 8 !== f && 2 !== f) return "undefined" == typeof a.getAttribute ? _r.prop(a, b, c) : (1 === f && _r.isXMLDoc(a) || (e = _r.attrHooks[b.toLowerCase()] || (_r.expr.match.bool.test(b) ? Ya : void 0)), void 0 !== c ? null === c ? void _r.removeAttr(a, b) : e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : (a.setAttribute(b, c + ""), c) : e && "get" in e && null !== (d = e.get(a, b)) ? d : (d = _r.find.attr(a, b), null == d ? void 0 : d));
    },
    attrHooks: {
      type: {
        set: function set(a, b) {
          if (!o.radioValue && "radio" === b && _r.nodeName(a, "input")) {
            var c = a.value;
            return a.setAttribute("type", b), c && (a.value = c), b;
          }
        }
      }
    },
    removeAttr: function removeAttr(a, b) {
      var c,
        d = 0,
        e = b && b.match(K);
      if (e && 1 === a.nodeType) while (c = e[d++]) a.removeAttribute(c);
    }
  }), Ya = {
    set: function set(a, b, c) {
      return b === !1 ? _r.removeAttr(a, c) : a.setAttribute(c, c), c;
    }
  }, _r.each(_r.expr.match.bool.source.match(/\w+/g), function (a, b) {
    var c = Za[b] || _r.find.attr;
    Za[b] = function (a, b, d) {
      var e,
        f,
        g = b.toLowerCase();
      return d || (f = Za[g], Za[g] = e, e = null != c(a, b, d) ? g : null, Za[g] = f), e;
    };
  });
  var $a = /^(?:input|select|textarea|button)$/i,
    _a = /^(?:a|area)$/i;
  _r.fn.extend({
    prop: function prop(a, b) {
      return _S(this, _r.prop, a, b, arguments.length > 1);
    },
    removeProp: function removeProp(a) {
      return this.each(function () {
        delete this[_r.propFix[a] || a];
      });
    }
  }), _r.extend({
    prop: function prop(a, b, c) {
      var d,
        e,
        f = a.nodeType;
      if (3 !== f && 8 !== f && 2 !== f) return 1 === f && _r.isXMLDoc(a) || (b = _r.propFix[b] || b, e = _r.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b];
    },
    propHooks: {
      tabIndex: {
        get: function get(a) {
          var b = _r.find.attr(a, "tabindex");
          return b ? parseInt(b, 10) : $a.test(a.nodeName) || _a.test(a.nodeName) && a.href ? 0 : -1;
        }
      }
    },
    propFix: {
      "for": "htmlFor",
      "class": "className"
    }
  }), o.optSelected || (_r.propHooks.selected = {
    get: function get(a) {
      var b = a.parentNode;
      return b && b.parentNode && b.parentNode.selectedIndex, null;
    },
    set: function set(a) {
      var b = a.parentNode;
      b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
    }
  }), _r.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    _r.propFix[this.toLowerCase()] = this;
  });
  function ab(a) {
    var b = a.match(K) || [];
    return b.join(" ");
  }
  function bb(a) {
    return a.getAttribute && a.getAttribute("class") || "";
  }
  _r.fn.extend({
    addClass: function addClass(a) {
      var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i = 0;
      if (_r.isFunction(a)) return this.each(function (b) {
        _r(this).addClass(a.call(this, b, bb(this)));
      });
      if ("string" == typeof a && a) {
        b = a.match(K) || [];
        while (c = this[i++]) if (e = bb(c), d = 1 === c.nodeType && " " + ab(e) + " ") {
          g = 0;
          while (f = b[g++]) d.indexOf(" " + f + " ") < 0 && (d += f + " ");
          h = ab(d), e !== h && c.setAttribute("class", h);
        }
      }
      return this;
    },
    removeClass: function removeClass(a) {
      var b,
        c,
        d,
        e,
        f,
        g,
        h,
        i = 0;
      if (_r.isFunction(a)) return this.each(function (b) {
        _r(this).removeClass(a.call(this, b, bb(this)));
      });
      if (!arguments.length) return this.attr("class", "");
      if ("string" == typeof a && a) {
        b = a.match(K) || [];
        while (c = this[i++]) if (e = bb(c), d = 1 === c.nodeType && " " + ab(e) + " ") {
          g = 0;
          while (f = b[g++]) while (d.indexOf(" " + f + " ") > -1) d = d.replace(" " + f + " ", " ");
          h = ab(d), e !== h && c.setAttribute("class", h);
        }
      }
      return this;
    },
    toggleClass: function toggleClass(a, b) {
      var c = (0, _typeof2["default"])(a);
      return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : _r.isFunction(a) ? this.each(function (c) {
        _r(this).toggleClass(a.call(this, c, bb(this), b), b);
      }) : this.each(function () {
        var b, d, e, f;
        if ("string" === c) {
          d = 0, e = _r(this), f = a.match(K) || [];
          while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
        } else void 0 !== a && "boolean" !== c || (b = bb(this), b && V.set(this, "__className__", b), this.setAttribute && this.setAttribute("class", b || a === !1 ? "" : V.get(this, "__className__") || ""));
      });
    },
    hasClass: function hasClass(a) {
      var b,
        c,
        d = 0;
      b = " " + a + " ";
      while (c = this[d++]) if (1 === c.nodeType && (" " + ab(bb(c)) + " ").indexOf(b) > -1) return !0;
      return !1;
    }
  });
  var cb = /\r/g;
  _r.fn.extend({
    val: function val(a) {
      var b,
        c,
        d,
        e = this[0];
      {
        if (arguments.length) return d = _r.isFunction(a), this.each(function (c) {
          var e;
          1 === this.nodeType && (e = d ? a.call(this, c, _r(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : _r.isArray(e) && (e = _r.map(e, function (a) {
            return null == a ? "" : a + "";
          })), b = _r.valHooks[this.type] || _r.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e));
        });
        if (e) return b = _r.valHooks[e.type] || _r.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(cb, "") : null == c ? "" : c);
      }
    }
  }), _r.extend({
    valHooks: {
      option: {
        get: function get(a) {
          var b = _r.find.attr(a, "value");
          return null != b ? b : ab(_r.text(a));
        }
      },
      select: {
        get: function get(a) {
          var b,
            c,
            d,
            e = a.options,
            f = a.selectedIndex,
            g = "select-one" === a.type,
            h = g ? null : [],
            i = g ? f + 1 : e.length;
          for (d = f < 0 ? i : g ? f : 0; d < i; d++) if (c = e[d], (c.selected || d === f) && !c.disabled && (!c.parentNode.disabled || !_r.nodeName(c.parentNode, "optgroup"))) {
            if (b = _r(c).val(), g) return b;
            h.push(b);
          }
          return h;
        },
        set: function set(a, b) {
          var c,
            d,
            e = a.options,
            f = _r.makeArray(b),
            g = e.length;
          while (g--) d = e[g], (d.selected = _r.inArray(_r.valHooks.option.get(d), f) > -1) && (c = !0);
          return c || (a.selectedIndex = -1), f;
        }
      }
    }
  }), _r.each(["radio", "checkbox"], function () {
    _r.valHooks[this] = {
      set: function set(a, b) {
        if (_r.isArray(b)) return a.checked = _r.inArray(_r(a).val(), b) > -1;
      }
    }, o.checkOn || (_r.valHooks[this].get = function (a) {
      return null === a.getAttribute("value") ? "on" : a.value;
    });
  });
  var db = /^(?:focusinfocus|focusoutblur)$/;
  _r.extend(_r.event, {
    trigger: function trigger(b, c, e, f) {
      var g,
        h,
        i,
        j,
        k,
        m,
        n,
        o = [e || d],
        p = l.call(b, "type") ? b.type : b,
        q = l.call(b, "namespace") ? b.namespace.split(".") : [];
      if (h = i = e = e || d, 3 !== e.nodeType && 8 !== e.nodeType && !db.test(p + _r.event.triggered) && (p.indexOf(".") > -1 && (q = p.split("."), p = q.shift(), q.sort()), k = p.indexOf(":") < 0 && "on" + p, b = b[_r.expando] ? b : new _r.Event(p, "object" == (0, _typeof2["default"])(b) && b), b.isTrigger = f ? 2 : 3, b.namespace = q.join("."), b.rnamespace = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = e), c = null == c ? [b] : _r.makeArray(c, [b]), n = _r.event.special[p] || {}, f || !n.trigger || n.trigger.apply(e, c) !== !1)) {
        if (!f && !n.noBubble && !_r.isWindow(e)) {
          for (j = n.delegateType || p, db.test(j + p) || (h = h.parentNode); h; h = h.parentNode) o.push(h), i = h;
          i === (e.ownerDocument || d) && o.push(i.defaultView || i.parentWindow || a);
        }
        g = 0;
        while ((h = o[g++]) && !b.isPropagationStopped()) b.type = g > 1 ? j : n.bindType || p, m = (V.get(h, "events") || {})[b.type] && V.get(h, "handle"), m && m.apply(h, c), m = k && h[k], m && m.apply && T(h) && (b.result = m.apply(h, c), b.result === !1 && b.preventDefault());
        return b.type = p, f || b.isDefaultPrevented() || n._default && n._default.apply(o.pop(), c) !== !1 || !T(e) || k && _r.isFunction(e[p]) && !_r.isWindow(e) && (i = e[k], i && (e[k] = null), _r.event.triggered = p, e[p](), _r.event.triggered = void 0, i && (e[k] = i)), b.result;
      }
    },
    simulate: function simulate(a, b, c) {
      var d = _r.extend(new _r.Event(), c, {
        type: a,
        isSimulated: !0
      });
      _r.event.trigger(d, null, b);
    }
  }), _r.fn.extend({
    trigger: function trigger(a, b) {
      return this.each(function () {
        _r.event.trigger(a, b, this);
      });
    },
    triggerHandler: function triggerHandler(a, b) {
      var c = this[0];
      if (c) return _r.event.trigger(a, b, c, !0);
    }
  }), _r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (a, b) {
    _r.fn[b] = function (a, c) {
      return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
    };
  }), _r.fn.extend({
    hover: function hover(a, b) {
      return this.mouseenter(a).mouseleave(b || a);
    }
  }), o.focusin = "onfocusin" in a, o.focusin || _r.each({
    focus: "focusin",
    blur: "focusout"
  }, function (a, b) {
    var c = function c(a) {
      _r.event.simulate(b, a.target, _r.event.fix(a));
    };
    _r.event.special[b] = {
      setup: function setup() {
        var d = this.ownerDocument || this,
          e = V.access(d, b);
        e || d.addEventListener(a, c, !0), V.access(d, b, (e || 0) + 1);
      },
      teardown: function teardown() {
        var d = this.ownerDocument || this,
          e = V.access(d, b) - 1;
        e ? V.access(d, b, e) : (d.removeEventListener(a, c, !0), V.remove(d, b));
      }
    };
  });
  var eb = /\[\]$/,
    fb = /\r?\n/g,
    gb = /^(?:submit|button|image|reset|file)$/i,
    hb = /^(?:input|select|textarea|keygen)/i;
  function ib(a, b, c, d) {
    var e;
    if (_r.isArray(b)) _r.each(b, function (b, e) {
      c || eb.test(a) ? d(a, e) : ib(a + "[" + ("object" == (0, _typeof2["default"])(e) && null != e ? b : "") + "]", e, c, d);
    });else if (c || "object" !== _r.type(b)) d(a, b);else for (e in b) ib(a + "[" + e + "]", b[e], c, d);
  }
  _r.param = function (a, b) {
    var c,
      d = [],
      e = function e(a, b) {
        var c = _r.isFunction(b) ? b() : b;
        d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(null == c ? "" : c);
      };
    if (_r.isArray(a) || a.jquery && !_r.isPlainObject(a)) _r.each(a, function () {
      e(this.name, this.value);
    });else for (c in a) ib(c, a[c], b, e);
    return d.join("&");
  }, _r.fn.extend({
    serialize: function serialize() {
      return _r.param(this.serializeArray());
    },
    serializeArray: function serializeArray() {
      return this.map(function () {
        var a = _r.prop(this, "elements");
        return a ? _r.makeArray(a) : this;
      }).filter(function () {
        var a = this.type;
        return this.name && !_r(this).is(":disabled") && hb.test(this.nodeName) && !gb.test(a) && (this.checked || !ia.test(a));
      }).map(function (a, b) {
        var c = _r(this).val();
        return null == c ? null : _r.isArray(c) ? _r.map(c, function (a) {
          return {
            name: b.name,
            value: a.replace(fb, "\r\n")
          };
        }) : {
          name: b.name,
          value: c.replace(fb, "\r\n")
        };
      }).get();
    }
  }), _r.fn.extend({
    wrapAll: function wrapAll(a) {
      var b;
      return this[0] && (_r.isFunction(a) && (a = a.call(this[0])), b = _r(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
        var a = this;
        while (a.firstElementChild) a = a.firstElementChild;
        return a;
      }).append(this)), this;
    },
    wrapInner: function wrapInner(a) {
      return _r.isFunction(a) ? this.each(function (b) {
        _r(this).wrapInner(a.call(this, b));
      }) : this.each(function () {
        var b = _r(this),
          c = b.contents();
        c.length ? c.wrapAll(a) : b.append(a);
      });
    },
    wrap: function wrap(a) {
      var b = _r.isFunction(a);
      return this.each(function (c) {
        _r(this).wrapAll(b ? a.call(this, c) : a);
      });
    },
    unwrap: function unwrap(a) {
      return this.parent(a).not("body").each(function () {
        _r(this).replaceWith(this.childNodes);
      }), this;
    }
  }), _r.expr.pseudos.hidden = function (a) {
    return !_r.expr.pseudos.visible(a);
  }, _r.expr.pseudos.visible = function (a) {
    return !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length);
  }, o.createHTMLDocument = function () {
    var a = d.implementation.createHTMLDocument("").body;
    return a.innerHTML = "<form></form><form></form>", 2 === a.childNodes.length;
  }(), _r.parseHTML = function (a, b, c) {
    if ("string" != typeof a) return [];
    "boolean" == typeof b && (c = b, b = !1);
    var e, f, g;
    return b || (o.createHTMLDocument ? (b = d.implementation.createHTMLDocument(""), e = b.createElement("base"), e.href = d.location.href, b.head.appendChild(e)) : b = d), f = B.exec(a), g = !c && [], f ? [b.createElement(f[1])] : (f = pa([a], b, g), g && g.length && _r(g).remove(), _r.merge([], f.childNodes));
  };
  function jb(a) {
    return _r.isWindow(a) ? a : 9 === a.nodeType && a.defaultView;
  }
  _r.offset = {
    setOffset: function setOffset(a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k = _r.css(a, "position"),
        l = _r(a),
        m = {};
      "static" === k && (a.style.position = "relative"), h = l.offset(), f = _r.css(a, "top"), i = _r.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), _r.isFunction(b) && (b = b.call(a, c, _r.extend({}, h))), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m);
    }
  }, _r.fn.extend({
    offset: function offset(a) {
      if (arguments.length) return void 0 === a ? this : this.each(function (b) {
        _r.offset.setOffset(this, a, b);
      });
      var b,
        c,
        d,
        e,
        f = this[0];
      if (f) return f.getClientRects().length ? (d = f.getBoundingClientRect(), d.width || d.height ? (e = f.ownerDocument, c = jb(e), b = e.documentElement, {
        top: d.top + c.pageYOffset - b.clientTop,
        left: d.left + c.pageXOffset - b.clientLeft
      }) : d) : {
        top: 0,
        left: 0
      };
    },
    position: function position() {
      if (this[0]) {
        var a,
          b,
          c = this[0],
          d = {
            top: 0,
            left: 0
          };
        return "fixed" === _r.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), _r.nodeName(a[0], "html") || (d = a.offset()), d = {
          top: d.top + _r.css(a[0], "borderTopWidth", !0),
          left: d.left + _r.css(a[0], "borderLeftWidth", !0)
        }), {
          top: b.top - d.top - _r.css(c, "marginTop", !0),
          left: b.left - d.left - _r.css(c, "marginLeft", !0)
        };
      }
    },
    offsetParent: function offsetParent() {
      return this.map(function () {
        var a = this.offsetParent;
        while (a && "static" === _r.css(a, "position")) a = a.offsetParent;
        return a || qa;
      });
    }
  }), _r.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function (a, b) {
    var c = "pageYOffset" === b;
    _r.fn[a] = function (d) {
      return _S(this, function (a, d, e) {
        var f = jb(a);
        return void 0 === e ? f ? f[b] : a[d] : void (f ? f.scrollTo(c ? f.pageXOffset : e, c ? e : f.pageYOffset) : a[d] = e);
      }, a, d, arguments.length);
    };
  }), _r.each(["top", "left"], function (a, b) {
    _r.cssHooks[b] = Oa(o.pixelPosition, function (a, c) {
      if (c) return c = Na(a, b), La.test(c) ? _r(a).position()[b] + "px" : c;
    });
  }), _r.each({
    Height: "height",
    Width: "width"
  }, function (a, b) {
    _r.each({
      padding: "inner" + a,
      content: b,
      "": "outer" + a
    }, function (c, d) {
      _r.fn[d] = function (e, f) {
        var g = arguments.length && (c || "boolean" != typeof e),
          h = c || (e === !0 || f === !0 ? "margin" : "border");
        return _S(this, function (b, c, e) {
          var f;
          return _r.isWindow(b) ? 0 === d.indexOf("outer") ? b["inner" + a] : b.document.documentElement["client" + a] : 9 === b.nodeType ? (f = b.documentElement, Math.max(b.body["scroll" + a], f["scroll" + a], b.body["offset" + a], f["offset" + a], f["client" + a])) : void 0 === e ? _r.css(b, c, h) : _r.style(b, c, e, h);
        }, b, g ? e : void 0, g);
      };
    });
  }), "function" == "function" && __webpack_require__(265) && !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
    return _r;
  }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  var kb = a.jQuery,
    lb = a.$;
  return _r.noConflict = function (b) {
    return a.$ === _r && (a.$ = lb), b && a.jQuery === _r && (a.jQuery = kb), _r;
  }, b || (a.jQuery = a.$ = _r), _r;
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(40)(module)))

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = keys;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isObject_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__has_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__collectNonEnumProps_js__ = __webpack_require__(123);





// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript 5**'s native `Object.keys`.
function keys(obj) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0__isObject_js__["a" /* default */])(obj)) return [];
  if (__WEBPACK_IMPORTED_MODULE_1__setup_js__["m" /* nativeKeys */]) return Object(__WEBPACK_IMPORTED_MODULE_1__setup_js__["m" /* nativeKeys */])(obj);
  var keys = [];
  for (var key in obj) if (Object(__WEBPACK_IMPORTED_MODULE_2__has_js__["a" /* default */])(obj, key)) keys.push(key);
  // Ahem, IE < 9.
  if (__WEBPACK_IMPORTED_MODULE_1__setup_js__["h" /* hasEnumBug */]) Object(__WEBPACK_IMPORTED_MODULE_3__collectNonEnumProps_js__["a" /* default */])(obj, keys);
  return keys;
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = tagTester;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// Internal function for creating a `toString`-based type tester.
function tagTester(name) {
  var tag = '[object ' + name + ']';
  return function(obj) {
    return __WEBPACK_IMPORTED_MODULE_0__setup_js__["t" /* toString */].call(obj) === tag;
  };
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = cb;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseIteratee_js__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__iteratee_js__ = __webpack_require__(133);




// The function we call internally to generate a callback. It invokes
// `_.iteratee` if overridden, otherwise `baseIteratee`.
function cb(value, context, argCount) {
  if (__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].iteratee !== __WEBPACK_IMPORTED_MODULE_2__iteratee_js__["a" /* default */]) return __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].iteratee(value, context);
  return Object(__WEBPACK_IMPORTED_MODULE_1__baseIteratee_js__["a" /* default */])(value, context, argCount);
}


/***/ }),
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = restArguments;
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, arguments[0], rest);
      case 2: return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
}


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = _;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// If Underscore is called as a function, it returns a wrapped object that can
// be used OO-style. This wrapper holds altered versions of all functions added
// through `_.mixin`. Wrapped objects may be chained.
function _(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}

_.VERSION = __WEBPACK_IMPORTED_MODULE_0__setup_js__["e" /* VERSION */];

// Extracts the result from a wrapped and chained object.
_.prototype.value = function() {
  return this._wrapped;
};

// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
_.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

_.prototype.toString = function() {
  return String(this._wrapped);
};


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createSizePropertyCheck_js__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getLength_js__ = __webpack_require__(18);



// Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createSizePropertyCheck_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__getLength_js__["a" /* default */]));


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setup_js__ = __webpack_require__(4);



var isFunction = Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Function');

// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var nodelist = __WEBPACK_IMPORTED_MODULE_1__setup_js__["p" /* root */].document && __WEBPACK_IMPORTED_MODULE_1__setup_js__["p" /* root */].document.childNodes;
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
  isFunction = function(obj) {
    return typeof obj == 'function' || false;
  };
}

/* harmony default export */ __webpack_exports__["a"] = (isFunction);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shallowProperty_js__ = __webpack_require__(122);


// Internal helper to obtain the `length` property of an object.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__shallowProperty_js__["a" /* default */])('length'));


/***/ }),
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = has;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// Internal function to check whether `key` is an own property name of `obj`.
function has(obj, key) {
  return obj != null && __WEBPACK_IMPORTED_MODULE_0__setup_js__["i" /* hasOwnProperty */].call(obj, key);
}


/***/ }),
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isObject;
// Is a given variable an object?
function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || (type === 'object' && !!obj);
}


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tagTester_js__ = __webpack_require__(9);



// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__setup_js__["k" /* nativeIsArray */] || Object(__WEBPACK_IMPORTED_MODULE_1__tagTester_js__["a" /* default */])('Array'));


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = each;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__optimizeCb_js__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keys_js__ = __webpack_require__(8);




// The cornerstone for collection functions, an `each`
// implementation, aka `forEach`.
// Handles raw objects in addition to array-likes. Treats all
// sparse array-likes as if they were dense.
function each(obj, iteratee, context) {
  iteratee = Object(__WEBPACK_IMPORTED_MODULE_0__optimizeCb_js__["a" /* default */])(iteratee, context);
  var i, length;
  if (Object(__WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__["a" /* default */])(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  } else {
    var _keys = Object(__WEBPACK_IMPORTED_MODULE_2__keys_js__["a" /* default */])(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}


/***/ }),
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = values;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__keys_js__ = __webpack_require__(8);


// Retrieve the values of an object's properties.
function values(obj) {
  var _keys = Object(__WEBPACK_IMPORTED_MODULE_0__keys_js__["a" /* default */])(obj);
  var length = _keys.length;
  var values = Array(length);
  for (var i = 0; i < length; i++) {
    values[i] = obj[_keys[i]];
  }
  return values;
}


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = flatten;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isArray_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isArguments_js__ = __webpack_require__(70);





// Internal implementation of a recursive `flatten` function.
function flatten(input, depth, strict, output) {
  output = output || [];
  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }
  var idx = output.length;
  for (var i = 0, length = Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(input); i < length; i++) {
    var value = input[i];
    if (Object(__WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__["a" /* default */])(value) && (Object(__WEBPACK_IMPORTED_MODULE_2__isArray_js__["a" /* default */])(value) || Object(__WEBPACK_IMPORTED_MODULE_3__isArguments_js__["a" /* default */])(value))) {
      // Flatten current level of array or arguments object.
      if (depth > 1) {
        flatten(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0, len = value.length;
        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = map;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keys_js__ = __webpack_require__(8);




// Return the results of applying the iteratee to each element.
function map(obj, iteratee, context) {
  iteratee = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(iteratee, context);
  var _keys = !Object(__WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__["a" /* default */])(obj) && Object(__WEBPACK_IMPORTED_MODULE_2__keys_js__["a" /* default */])(obj),
      length = (_keys || obj).length,
      results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}


/***/ }),
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return hasDataViewBug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isIE11; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__hasObjectTag_js__ = __webpack_require__(287);



// In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
// In IE 11, the most common among them, this problem also applies to
// `Map`, `WeakMap` and `Set`.
// Also, there are cases where an application can override the native
// `DataView` object, in cases like that we can't use the constructor
// safely and should just rely on alternate `DataView` checks
var hasDataViewBug = (
      __WEBPACK_IMPORTED_MODULE_0__setup_js__["s" /* supportsDataView */] && (!/\[native code\]/.test(String(DataView)) || Object(__WEBPACK_IMPORTED_MODULE_1__hasObjectTag_js__["a" /* default */])(new DataView(new ArrayBuffer(8))))
    ),
    isIE11 = (typeof Map !== 'undefined' && Object(__WEBPACK_IMPORTED_MODULE_1__hasObjectTag_js__["a" /* default */])(new Map));


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = allKeys;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isObject_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__collectNonEnumProps_js__ = __webpack_require__(123);




// Retrieve all the enumerable property names of an object.
function allKeys(obj) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0__isObject_js__["a" /* default */])(obj)) return [];
  var keys = [];
  for (var key in obj) keys.push(key);
  // Ahem, IE < 9.
  if (__WEBPACK_IMPORTED_MODULE_1__setup_js__["h" /* hasEnumBug */]) Object(__WEBPACK_IMPORTED_MODULE_2__collectNonEnumProps_js__["a" /* default */])(obj, keys);
  return keys;
}


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toPath;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__toPath_js__ = __webpack_require__(131);



// Internal wrapper for `_.toPath` to enable minification.
// Similar to `cb` for `_.iteratee`.
function toPath(path) {
  return __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].toPath(path);
}


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = optimizeCb;
// Internal function that returns an efficient (for current engines) version
// of the passed-in callback, to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    // The 2-argument case is omitted because we’re not using it.
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
}


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = filter;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__each_js__ = __webpack_require__(30);



// Return all the elements that pass a truth test.
function filter(obj, predicate, context) {
  var results = [];
  predicate = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(predicate, context);
  Object(__WEBPACK_IMPORTED_MODULE_1__each_js__["a" /* default */])(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}


/***/ }),
/* 46 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = contains;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__values_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__indexOf_js__ = __webpack_require__(147);




// Determine if the array or object contains a given item (using `===`).
function contains(obj, item, fromIndex, guard) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(obj)) obj = Object(__WEBPACK_IMPORTED_MODULE_1__values_js__["a" /* default */])(obj);
  if (typeof fromIndex != 'number' || guard) fromIndex = 0;
  return Object(__WEBPACK_IMPORTED_MODULE_2__indexOf_js__["a" /* default */])(obj, item, fromIndex) >= 0;
}


/***/ }),
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = matcher;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__extendOwn_js__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isMatch_js__ = __webpack_require__(124);



// Returns a predicate for checking whether an object has a given set of
// `key:value` pairs.
function matcher(attrs) {
  attrs = Object(__WEBPACK_IMPORTED_MODULE_0__extendOwn_js__["a" /* default */])({}, attrs);
  return function(obj) {
    return Object(__WEBPACK_IMPORTED_MODULE_1__isMatch_js__["a" /* default */])(obj, attrs);
  };
}


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__executeBound_js__ = __webpack_require__(139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__underscore_js__ = __webpack_require__(15);




// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. `_` acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var partial = Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(func, boundArgs) {
  var placeholder = partial.placeholder;
  var bound = function() {
    var position = 0, length = boundArgs.length;
    var args = Array(length);
    for (var i = 0; i < length; i++) {
      args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
    }
    while (position < arguments.length) args.push(arguments[position++]);
    return Object(__WEBPACK_IMPORTED_MODULE_1__executeBound_js__["a" /* default */])(func, bound, this, this, args);
  };
  return bound;
});

partial.placeholder = __WEBPACK_IMPORTED_MODULE_2__underscore_js__["a" /* default */];
/* harmony default export */ __webpack_exports__["a"] = (partial);


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = group;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__each_js__ = __webpack_require__(30);



// An internal function used for aggregate "group by" operations.
function group(behavior, partition) {
  return function(obj, iteratee, context) {
    var result = partition ? [[], []] : {};
    iteratee = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(iteratee, context);
    Object(__WEBPACK_IMPORTED_MODULE_1__each_js__["a" /* default */])(obj, function(value, index) {
      var key = iteratee(value, index, obj);
      behavior(result, value, key);
    });
    return result;
  };
}


/***/ }),
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_default_js__ = __webpack_require__(281);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return __WEBPACK_IMPORTED_MODULE_0__index_default_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__index_js__ = __webpack_require__(67);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "VERSION", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["VERSION"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "restArguments", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["restArguments"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isObject"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isNull", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isNull"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isUndefined", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isUndefined"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isBoolean", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isBoolean"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isElement", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isElement"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isString"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isNumber", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isNumber"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isDate", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isDate"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isRegExp", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isRegExp"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isError", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isError"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isSymbol", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isSymbol"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isArrayBuffer", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isArrayBuffer"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isDataView", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isDataView"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isArray"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isFunction", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isFunction"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isArguments", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isArguments"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isFinite", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isFinite"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isNaN", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isNaN"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isTypedArray", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isTypedArray"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isEmpty", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isEmpty"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isMatch", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isMatch"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isEqual", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isEqual"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isMap", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isMap"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isWeakMap", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isWeakMap"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isSet", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isSet"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "isWeakSet", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["isWeakSet"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "keys", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["keys"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "allKeys", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["allKeys"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "values", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["values"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "pairs", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["pairs"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "invert", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["invert"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "functions", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["functions"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "methods", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["methods"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["extend"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "extendOwn", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["extendOwn"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["assign"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "defaults", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["defaults"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "create", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["create"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "clone", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["clone"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "tap", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["tap"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "get", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["get"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "has", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["has"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "mapObject", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["mapObject"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["identity"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "constant", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["constant"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["noop"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "toPath", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["toPath"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "property", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["property"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "propertyOf", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["propertyOf"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "matcher", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["matcher"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "matches", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["matches"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "times", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["times"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "random", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["random"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "now", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["now"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "escape", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["escape"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "unescape", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["unescape"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "templateSettings", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["templateSettings"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "template", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["template"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "result", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["result"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "uniqueId", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["uniqueId"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "chain", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["chain"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "iteratee", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["iteratee"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "partial", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["partial"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["bind"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "bindAll", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["bindAll"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "memoize", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["memoize"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["delay"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "defer", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["defer"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["throttle"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["debounce"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "wrap", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["wrap"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "negate", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["negate"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["compose"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "after", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["after"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "before", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["before"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "once", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["once"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "findKey", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["findKey"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["findIndex"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "findLastIndex", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["findLastIndex"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "sortedIndex", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["sortedIndex"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "indexOf", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["indexOf"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "lastIndexOf", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["lastIndexOf"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "find", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["find"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "detect", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["detect"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "findWhere", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["findWhere"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "each", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["each"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["forEach"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "map", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["map"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "collect", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["collect"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["reduce"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "foldl", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["foldl"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["inject"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "reduceRight", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["reduceRight"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "foldr", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["foldr"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["filter"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "select", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["select"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "reject", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["reject"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "every", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["every"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "all", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["all"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "some", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["some"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "any", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["any"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "contains", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["contains"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "includes", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["includes"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "include", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["include"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "invoke", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["invoke"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "pluck", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["pluck"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "where", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["where"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "max", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["max"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "min", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["min"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "shuffle", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["shuffle"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "sample", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["sample"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "sortBy", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["sortBy"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["groupBy"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "indexBy", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["indexBy"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "countBy", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["countBy"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "partition", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["partition"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["toArray"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "size", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["size"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "pick", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["pick"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "omit", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["omit"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "first", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["first"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "head", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["head"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "take", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["take"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "initial", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["initial"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "last", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["last"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "rest", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["rest"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "tail", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["tail"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "drop", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["drop"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "compact", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["compact"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["flatten"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "without", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["without"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "uniq", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["uniq"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "unique", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["unique"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "union", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["union"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "intersection", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["intersection"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "difference", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["difference"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "unzip", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["unzip"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "transpose", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["transpose"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["zip"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "object", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["object"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "range", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["range"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "chunk", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["chunk"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "mixin", function() { return __WEBPACK_IMPORTED_MODULE_1__index_js__["mixin"]; });
// ESM Exports
// ===========
// This module is the package entry point for ES module users. In other words,
// it is the module they are interfacing with when they import from the whole
// package instead of from a submodule, like this:
//
// ```js
// import { map } from 'underscore';
// ```
//
// The difference with `./index-default`, which is the package entry point for
// CommonJS, AMD and UMD users, is purely technical. In ES modules, named and
// default exports are considered to be siblings, so when you have a default
// export, its properties are not automatically available as named exports. For
// this reason, we re-export the named exports in addition to providing the same
// default export as in `./index-default`.




/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "VERSION", function() { return __WEBPACK_IMPORTED_MODULE_0__setup_js__["e"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__restArguments_js__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "restArguments", function() { return __WEBPACK_IMPORTED_MODULE_1__restArguments_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObject_js__ = __webpack_require__(28);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return __WEBPACK_IMPORTED_MODULE_2__isObject_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isNull_js__ = __webpack_require__(282);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isNull", function() { return __WEBPACK_IMPORTED_MODULE_3__isNull_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__isUndefined_js__ = __webpack_require__(113);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isUndefined", function() { return __WEBPACK_IMPORTED_MODULE_4__isUndefined_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__isBoolean_js__ = __webpack_require__(114);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isBoolean", function() { return __WEBPACK_IMPORTED_MODULE_5__isBoolean_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__isElement_js__ = __webpack_require__(283);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isElement", function() { return __WEBPACK_IMPORTED_MODULE_6__isElement_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__isString_js__ = __webpack_require__(68);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return __WEBPACK_IMPORTED_MODULE_7__isString_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__isNumber_js__ = __webpack_require__(115);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isNumber", function() { return __WEBPACK_IMPORTED_MODULE_8__isNumber_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__isDate_js__ = __webpack_require__(284);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isDate", function() { return __WEBPACK_IMPORTED_MODULE_9__isDate_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__isRegExp_js__ = __webpack_require__(285);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isRegExp", function() { return __WEBPACK_IMPORTED_MODULE_10__isRegExp_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__isError_js__ = __webpack_require__(286);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isError", function() { return __WEBPACK_IMPORTED_MODULE_11__isError_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__isSymbol_js__ = __webpack_require__(116);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isSymbol", function() { return __WEBPACK_IMPORTED_MODULE_12__isSymbol_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__isArrayBuffer_js__ = __webpack_require__(117);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isArrayBuffer", function() { return __WEBPACK_IMPORTED_MODULE_13__isArrayBuffer_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__isDataView_js__ = __webpack_require__(69);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isDataView", function() { return __WEBPACK_IMPORTED_MODULE_14__isDataView_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__isArray_js__ = __webpack_require__(29);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return __WEBPACK_IMPORTED_MODULE_15__isArray_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__isFunction_js__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isFunction", function() { return __WEBPACK_IMPORTED_MODULE_16__isFunction_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__isArguments_js__ = __webpack_require__(70);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isArguments", function() { return __WEBPACK_IMPORTED_MODULE_17__isArguments_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__isFinite_js__ = __webpack_require__(288);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isFinite", function() { return __WEBPACK_IMPORTED_MODULE_18__isFinite_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__isNaN_js__ = __webpack_require__(118);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isNaN", function() { return __WEBPACK_IMPORTED_MODULE_19__isNaN_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__isTypedArray_js__ = __webpack_require__(119);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isTypedArray", function() { return __WEBPACK_IMPORTED_MODULE_20__isTypedArray_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__isEmpty_js__ = __webpack_require__(290);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isEmpty", function() { return __WEBPACK_IMPORTED_MODULE_21__isEmpty_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__isMatch_js__ = __webpack_require__(124);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isMatch", function() { return __WEBPACK_IMPORTED_MODULE_22__isMatch_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__isEqual_js__ = __webpack_require__(291);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isEqual", function() { return __WEBPACK_IMPORTED_MODULE_23__isEqual_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__isMap_js__ = __webpack_require__(293);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isMap", function() { return __WEBPACK_IMPORTED_MODULE_24__isMap_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__isWeakMap_js__ = __webpack_require__(294);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isWeakMap", function() { return __WEBPACK_IMPORTED_MODULE_25__isWeakMap_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__isSet_js__ = __webpack_require__(295);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isSet", function() { return __WEBPACK_IMPORTED_MODULE_26__isSet_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__isWeakSet_js__ = __webpack_require__(296);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "isWeakSet", function() { return __WEBPACK_IMPORTED_MODULE_27__isWeakSet_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__keys_js__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "keys", function() { return __WEBPACK_IMPORTED_MODULE_28__keys_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__allKeys_js__ = __webpack_require__(42);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "allKeys", function() { return __WEBPACK_IMPORTED_MODULE_29__allKeys_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__values_js__ = __webpack_require__(34);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "values", function() { return __WEBPACK_IMPORTED_MODULE_30__values_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__pairs_js__ = __webpack_require__(297);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "pairs", function() { return __WEBPACK_IMPORTED_MODULE_31__pairs_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__invert_js__ = __webpack_require__(125);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "invert", function() { return __WEBPACK_IMPORTED_MODULE_32__invert_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__functions_js__ = __webpack_require__(126);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "functions", function() { return __WEBPACK_IMPORTED_MODULE_33__functions_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "methods", function() { return __WEBPACK_IMPORTED_MODULE_33__functions_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__extend_js__ = __webpack_require__(127);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "extend", function() { return __WEBPACK_IMPORTED_MODULE_34__extend_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__extendOwn_js__ = __webpack_require__(74);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "extendOwn", function() { return __WEBPACK_IMPORTED_MODULE_35__extendOwn_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return __WEBPACK_IMPORTED_MODULE_35__extendOwn_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__defaults_js__ = __webpack_require__(128);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "defaults", function() { return __WEBPACK_IMPORTED_MODULE_36__defaults_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__create_js__ = __webpack_require__(298);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "create", function() { return __WEBPACK_IMPORTED_MODULE_37__create_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__clone_js__ = __webpack_require__(299);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "clone", function() { return __WEBPACK_IMPORTED_MODULE_38__clone_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__tap_js__ = __webpack_require__(300);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "tap", function() { return __WEBPACK_IMPORTED_MODULE_39__tap_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__get_js__ = __webpack_require__(130);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "get", function() { return __WEBPACK_IMPORTED_MODULE_40__get_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__has_js__ = __webpack_require__(301);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "has", function() { return __WEBPACK_IMPORTED_MODULE_41__has_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__mapObject_js__ = __webpack_require__(302);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mapObject", function() { return __WEBPACK_IMPORTED_MODULE_42__mapObject_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__identity_js__ = __webpack_require__(76);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "identity", function() { return __WEBPACK_IMPORTED_MODULE_43__identity_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__constant_js__ = __webpack_require__(120);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "constant", function() { return __WEBPACK_IMPORTED_MODULE_44__constant_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__noop_js__ = __webpack_require__(134);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "noop", function() { return __WEBPACK_IMPORTED_MODULE_45__noop_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__toPath_js__ = __webpack_require__(131);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "toPath", function() { return __WEBPACK_IMPORTED_MODULE_46__toPath_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__property_js__ = __webpack_require__(77);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "property", function() { return __WEBPACK_IMPORTED_MODULE_47__property_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__propertyOf_js__ = __webpack_require__(303);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "propertyOf", function() { return __WEBPACK_IMPORTED_MODULE_48__propertyOf_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__matcher_js__ = __webpack_require__(50);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "matcher", function() { return __WEBPACK_IMPORTED_MODULE_49__matcher_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "matches", function() { return __WEBPACK_IMPORTED_MODULE_49__matcher_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__times_js__ = __webpack_require__(304);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "times", function() { return __WEBPACK_IMPORTED_MODULE_50__times_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__random_js__ = __webpack_require__(135);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "random", function() { return __WEBPACK_IMPORTED_MODULE_51__random_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__now_js__ = __webpack_require__(78);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "now", function() { return __WEBPACK_IMPORTED_MODULE_52__now_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__escape_js__ = __webpack_require__(305);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "escape", function() { return __WEBPACK_IMPORTED_MODULE_53__escape_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__unescape_js__ = __webpack_require__(306);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "unescape", function() { return __WEBPACK_IMPORTED_MODULE_54__unescape_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__templateSettings_js__ = __webpack_require__(138);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "templateSettings", function() { return __WEBPACK_IMPORTED_MODULE_55__templateSettings_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__template_js__ = __webpack_require__(308);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "template", function() { return __WEBPACK_IMPORTED_MODULE_56__template_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__result_js__ = __webpack_require__(309);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "result", function() { return __WEBPACK_IMPORTED_MODULE_57__result_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_58__uniqueId_js__ = __webpack_require__(310);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "uniqueId", function() { return __WEBPACK_IMPORTED_MODULE_58__uniqueId_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_59__chain_js__ = __webpack_require__(311);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "chain", function() { return __WEBPACK_IMPORTED_MODULE_59__chain_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_60__iteratee_js__ = __webpack_require__(133);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "iteratee", function() { return __WEBPACK_IMPORTED_MODULE_60__iteratee_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_61__partial_js__ = __webpack_require__(51);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "partial", function() { return __WEBPACK_IMPORTED_MODULE_61__partial_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_62__bind_js__ = __webpack_require__(140);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return __WEBPACK_IMPORTED_MODULE_62__bind_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_63__bindAll_js__ = __webpack_require__(312);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bindAll", function() { return __WEBPACK_IMPORTED_MODULE_63__bindAll_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_64__memoize_js__ = __webpack_require__(313);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "memoize", function() { return __WEBPACK_IMPORTED_MODULE_64__memoize_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_65__delay_js__ = __webpack_require__(141);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "delay", function() { return __WEBPACK_IMPORTED_MODULE_65__delay_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_66__defer_js__ = __webpack_require__(314);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "defer", function() { return __WEBPACK_IMPORTED_MODULE_66__defer_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_67__throttle_js__ = __webpack_require__(315);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return __WEBPACK_IMPORTED_MODULE_67__throttle_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_68__debounce_js__ = __webpack_require__(316);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return __WEBPACK_IMPORTED_MODULE_68__debounce_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_69__wrap_js__ = __webpack_require__(317);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "wrap", function() { return __WEBPACK_IMPORTED_MODULE_69__wrap_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_70__negate_js__ = __webpack_require__(79);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "negate", function() { return __WEBPACK_IMPORTED_MODULE_70__negate_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_71__compose_js__ = __webpack_require__(318);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return __WEBPACK_IMPORTED_MODULE_71__compose_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_72__after_js__ = __webpack_require__(319);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "after", function() { return __WEBPACK_IMPORTED_MODULE_72__after_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_73__before_js__ = __webpack_require__(142);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "before", function() { return __WEBPACK_IMPORTED_MODULE_73__before_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_74__once_js__ = __webpack_require__(320);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "once", function() { return __WEBPACK_IMPORTED_MODULE_74__once_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_75__findKey_js__ = __webpack_require__(143);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "findKey", function() { return __WEBPACK_IMPORTED_MODULE_75__findKey_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_76__findIndex_js__ = __webpack_require__(80);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return __WEBPACK_IMPORTED_MODULE_76__findIndex_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_77__findLastIndex_js__ = __webpack_require__(145);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "findLastIndex", function() { return __WEBPACK_IMPORTED_MODULE_77__findLastIndex_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_78__sortedIndex_js__ = __webpack_require__(146);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sortedIndex", function() { return __WEBPACK_IMPORTED_MODULE_78__sortedIndex_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_79__indexOf_js__ = __webpack_require__(147);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "indexOf", function() { return __WEBPACK_IMPORTED_MODULE_79__indexOf_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_80__lastIndexOf_js__ = __webpack_require__(321);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "lastIndexOf", function() { return __WEBPACK_IMPORTED_MODULE_80__lastIndexOf_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_81__find_js__ = __webpack_require__(149);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return __WEBPACK_IMPORTED_MODULE_81__find_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "detect", function() { return __WEBPACK_IMPORTED_MODULE_81__find_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_82__findWhere_js__ = __webpack_require__(322);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "findWhere", function() { return __WEBPACK_IMPORTED_MODULE_82__findWhere_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_83__each_js__ = __webpack_require__(30);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "each", function() { return __WEBPACK_IMPORTED_MODULE_83__each_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return __WEBPACK_IMPORTED_MODULE_83__each_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_84__map_js__ = __webpack_require__(36);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return __WEBPACK_IMPORTED_MODULE_84__map_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "collect", function() { return __WEBPACK_IMPORTED_MODULE_84__map_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_85__reduce_js__ = __webpack_require__(323);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return __WEBPACK_IMPORTED_MODULE_85__reduce_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "foldl", function() { return __WEBPACK_IMPORTED_MODULE_85__reduce_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "inject", function() { return __WEBPACK_IMPORTED_MODULE_85__reduce_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_86__reduceRight_js__ = __webpack_require__(324);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "reduceRight", function() { return __WEBPACK_IMPORTED_MODULE_86__reduceRight_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "foldr", function() { return __WEBPACK_IMPORTED_MODULE_86__reduceRight_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_87__filter_js__ = __webpack_require__(45);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return __WEBPACK_IMPORTED_MODULE_87__filter_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "select", function() { return __WEBPACK_IMPORTED_MODULE_87__filter_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_88__reject_js__ = __webpack_require__(325);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "reject", function() { return __WEBPACK_IMPORTED_MODULE_88__reject_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_89__every_js__ = __webpack_require__(326);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "every", function() { return __WEBPACK_IMPORTED_MODULE_89__every_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "all", function() { return __WEBPACK_IMPORTED_MODULE_89__every_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_90__some_js__ = __webpack_require__(327);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "some", function() { return __WEBPACK_IMPORTED_MODULE_90__some_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "any", function() { return __WEBPACK_IMPORTED_MODULE_90__some_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_91__contains_js__ = __webpack_require__(46);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "contains", function() { return __WEBPACK_IMPORTED_MODULE_91__contains_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "includes", function() { return __WEBPACK_IMPORTED_MODULE_91__contains_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "include", function() { return __WEBPACK_IMPORTED_MODULE_91__contains_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_92__invoke_js__ = __webpack_require__(328);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "invoke", function() { return __WEBPACK_IMPORTED_MODULE_92__invoke_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_93__pluck_js__ = __webpack_require__(81);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "pluck", function() { return __WEBPACK_IMPORTED_MODULE_93__pluck_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_94__where_js__ = __webpack_require__(329);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "where", function() { return __WEBPACK_IMPORTED_MODULE_94__where_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_95__max_js__ = __webpack_require__(151);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "max", function() { return __WEBPACK_IMPORTED_MODULE_95__max_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_96__min_js__ = __webpack_require__(330);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "min", function() { return __WEBPACK_IMPORTED_MODULE_96__min_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_97__shuffle_js__ = __webpack_require__(331);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "shuffle", function() { return __WEBPACK_IMPORTED_MODULE_97__shuffle_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_98__sample_js__ = __webpack_require__(152);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sample", function() { return __WEBPACK_IMPORTED_MODULE_98__sample_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_99__sortBy_js__ = __webpack_require__(332);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "sortBy", function() { return __WEBPACK_IMPORTED_MODULE_99__sortBy_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_100__groupBy_js__ = __webpack_require__(333);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return __WEBPACK_IMPORTED_MODULE_100__groupBy_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_101__indexBy_js__ = __webpack_require__(334);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "indexBy", function() { return __WEBPACK_IMPORTED_MODULE_101__indexBy_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_102__countBy_js__ = __webpack_require__(335);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "countBy", function() { return __WEBPACK_IMPORTED_MODULE_102__countBy_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_103__partition_js__ = __webpack_require__(336);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "partition", function() { return __WEBPACK_IMPORTED_MODULE_103__partition_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_104__toArray_js__ = __webpack_require__(153);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "toArray", function() { return __WEBPACK_IMPORTED_MODULE_104__toArray_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_105__size_js__ = __webpack_require__(337);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "size", function() { return __WEBPACK_IMPORTED_MODULE_105__size_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_106__pick_js__ = __webpack_require__(154);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "pick", function() { return __WEBPACK_IMPORTED_MODULE_106__pick_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_107__omit_js__ = __webpack_require__(339);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "omit", function() { return __WEBPACK_IMPORTED_MODULE_107__omit_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_108__first_js__ = __webpack_require__(340);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "first", function() { return __WEBPACK_IMPORTED_MODULE_108__first_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "head", function() { return __WEBPACK_IMPORTED_MODULE_108__first_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "take", function() { return __WEBPACK_IMPORTED_MODULE_108__first_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_109__initial_js__ = __webpack_require__(155);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "initial", function() { return __WEBPACK_IMPORTED_MODULE_109__initial_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_110__last_js__ = __webpack_require__(341);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "last", function() { return __WEBPACK_IMPORTED_MODULE_110__last_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_111__rest_js__ = __webpack_require__(156);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "rest", function() { return __WEBPACK_IMPORTED_MODULE_111__rest_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "tail", function() { return __WEBPACK_IMPORTED_MODULE_111__rest_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "drop", function() { return __WEBPACK_IMPORTED_MODULE_111__rest_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_112__compact_js__ = __webpack_require__(342);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compact", function() { return __WEBPACK_IMPORTED_MODULE_112__compact_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_113__flatten_js__ = __webpack_require__(343);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return __WEBPACK_IMPORTED_MODULE_113__flatten_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_114__without_js__ = __webpack_require__(344);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "without", function() { return __WEBPACK_IMPORTED_MODULE_114__without_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_115__uniq_js__ = __webpack_require__(158);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "uniq", function() { return __WEBPACK_IMPORTED_MODULE_115__uniq_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "unique", function() { return __WEBPACK_IMPORTED_MODULE_115__uniq_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_116__union_js__ = __webpack_require__(345);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "union", function() { return __WEBPACK_IMPORTED_MODULE_116__union_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_117__intersection_js__ = __webpack_require__(346);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "intersection", function() { return __WEBPACK_IMPORTED_MODULE_117__intersection_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_118__difference_js__ = __webpack_require__(157);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "difference", function() { return __WEBPACK_IMPORTED_MODULE_118__difference_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_119__unzip_js__ = __webpack_require__(159);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "unzip", function() { return __WEBPACK_IMPORTED_MODULE_119__unzip_js__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "transpose", function() { return __WEBPACK_IMPORTED_MODULE_119__unzip_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_120__zip_js__ = __webpack_require__(347);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "zip", function() { return __WEBPACK_IMPORTED_MODULE_120__zip_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_121__object_js__ = __webpack_require__(348);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "object", function() { return __WEBPACK_IMPORTED_MODULE_121__object_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_122__range_js__ = __webpack_require__(349);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "range", function() { return __WEBPACK_IMPORTED_MODULE_122__range_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_123__chunk_js__ = __webpack_require__(350);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "chunk", function() { return __WEBPACK_IMPORTED_MODULE_123__chunk_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_124__mixin_js__ = __webpack_require__(351);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "mixin", function() { return __WEBPACK_IMPORTED_MODULE_124__mixin_js__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_125__underscore_array_methods_js__ = __webpack_require__(352);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return __WEBPACK_IMPORTED_MODULE_125__underscore_array_methods_js__["a"]; });
// Named Exports
// =============

//     Underscore.js 1.13.7
//     https://underscorejs.org
//     (c) 2009-2024 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

// Baseline setup.



// Object Functions
// ----------------
// Our most fundamental functions operate on any JavaScript object.
// Most functions in Underscore depend on at least one function in this section.

// A group of functions that check the types of core JavaScript values.
// These are often informally referred to as the "isType" functions.



























// Functions that treat an object as a dictionary of key-value pairs.
















// Utility Functions
// -----------------
// A bit of a grab bag: Predicate-generating functions for use with filters and
// loops, string escaping and templating, create random numbers and unique ids,
// and functions that facilitate Underscore's chaining and iteration conventions.



















// Function (ahem) Functions
// -------------------------
// These functions take a function as an argument and return a new function
// as the result. Also known as higher-order functions.















// Finders
// -------
// Functions that extract (the position of) a single element from an object
// or array based on some criterion.









// Collection Functions
// --------------------
// Functions that work on any collection of elements: either an array, or
// an object of key-value pairs.
























// `_.pick` and `_.omit` are actually object functions, but we put
// them here in order to create a more natural reading order in the
// monolithic build as they depend on `_.contains`.



// Array Functions
// ---------------
// Functions that operate on arrays (and array-likes) only, because they’re
// expressed in terms of operations on an ordered list of values.

















// OOP
// ---
// These modules support the "object-oriented" calling style. See also
// `underscore.js` and `index-default.js`.




/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('String'));


/***/ }),
/* 69 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isArrayBuffer_js__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__stringTagBug_js__ = __webpack_require__(41);





var isDataView = Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('DataView');

// In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.
// Also, in cases where the native `DataView` is
// overridden we can't rely on the tag itself.
function alternateIsDataView(obj) {
  return obj != null && Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(obj.getInt8) && Object(__WEBPACK_IMPORTED_MODULE_2__isArrayBuffer_js__["a" /* default */])(obj.buffer);
}

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_3__stringTagBug_js__["a" /* hasDataViewBug */] ? alternateIsDataView : isDataView);


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__has_js__ = __webpack_require__(25);



var isArguments = Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Arguments');

// Define a fallback version of the method in browsers (ahem, IE < 9), where
// there isn't any inspectable "Arguments" type.
(function() {
  if (!isArguments(arguments)) {
    isArguments = function(obj) {
      return Object(__WEBPACK_IMPORTED_MODULE_1__has_js__["a" /* default */])(obj, 'callee');
    };
  }
}());

/* harmony default export */ __webpack_exports__["a"] = (isArguments);


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shallowProperty_js__ = __webpack_require__(122);


// Internal helper to obtain the `byteLength` property of an object.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__shallowProperty_js__["a" /* default */])('byteLength'));


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = ie11fingerprint;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return mapMethods; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return weakMapMethods; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setMethods; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__allKeys_js__ = __webpack_require__(42);




// Since the regular `Object.prototype.toString` type tests don't work for
// some types in IE 11, we use a fingerprinting heuristic instead, based
// on the methods. It's not great, but it's the best we got.
// The fingerprint method lists are defined below.
function ie11fingerprint(methods) {
  var length = Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(methods);
  return function(obj) {
    if (obj == null) return false;
    // `Map`, `WeakMap` and `Set` have no enumerable keys.
    var keys = Object(__WEBPACK_IMPORTED_MODULE_2__allKeys_js__["a" /* default */])(obj);
    if (Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(keys)) return false;
    for (var i = 0; i < length; i++) {
      if (!Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(obj[methods[i]])) return false;
    }
    // If we are testing against `WeakMap`, we need to ensure that
    // `obj` doesn't have a `forEach` method in order to distinguish
    // it from a regular `Map`.
    return methods !== weakMapMethods || !Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(obj[forEachName]);
  };
}

// In the interest of compact minification, we write
// each string in the fingerprints only once.
var forEachName = 'forEach',
    hasName = 'has',
    commonInit = ['clear', 'delete'],
    mapTail = ['get', hasName, 'set'];

// `Map`, `WeakMap` and `Set` each have slightly different
// combinations of the above sublists.
var mapMethods = commonInit.concat(forEachName, mapTail),
    weakMapMethods = commonInit.concat(mapTail),
    setMethods = ['add'].concat(commonInit, forEachName, hasName);


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createAssigner;
// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
  return function(obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
      for (var i = 0; i < l; i++) {
        var key = keys[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createAssigner_js__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__keys_js__ = __webpack_require__(8);



// Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createAssigner_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* default */]));


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = deepGet;
// Internal function to obtain a nested property in `obj` along `path`.
function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = identity;
// Keep the identity function around for default iteratees.
function identity(value) {
  return value;
}


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = property;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__deepGet_js__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__toPath_js__ = __webpack_require__(43);



// Creates a function that, when passed an object, will traverse that object’s
// properties down the given `path`, specified as an array of keys or indices.
function property(path) {
  path = Object(__WEBPACK_IMPORTED_MODULE_1__toPath_js__["a" /* default */])(path);
  return function(obj) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__deepGet_js__["a" /* default */])(obj, path);
  };
}


/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// A (possibly faster) way to get the current timestamp as an integer.
/* harmony default export */ __webpack_exports__["a"] = (Date.now || function() {
  return new Date().getTime();
});


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = negate;
// Returns a negated version of the passed-in predicate.
function negate(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createPredicateIndexFinder_js__ = __webpack_require__(144);


// Returns the first index on an array-like that passes a truth test.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createPredicateIndexFinder_js__["a" /* default */])(1));


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = pluck;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__map_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__property_js__ = __webpack_require__(77);



// Convenience version of a common use case of `_.map`: fetching a property.
function pluck(obj, key) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__map_js__["a" /* default */])(obj, Object(__WEBPACK_IMPORTED_MODULE_1__property_js__["a" /* default */])(key));
}


/***/ }),
/* 82 */,
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryString = exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
var queryString = exports.queryString = function () {
  var tmp = window.location.search;
  var queryString = {};
  if (tmp.charAt(0) == '?') tmp = tmp.slice(1);
  var arr = tmp.split('&');
  for (var i = 0; i < arr.length; i++) {
    var kv = arr[i].split('=');
    queryString[kv[0]] = kv[1];
  }
  return queryString;
}();
var QueryManager = exports["default"] = /*#__PURE__*/function () {
  function QueryManager() {
    (0, _classCallCheck2["default"])(this, QueryManager);
    this._handlers = [];
  }
  return (0, _createClass2["default"])(QueryManager, [{
    key: "register",
    value: function register(entryHandler) {
      this._handlers.push(entryHandler);
    }
  }, {
    key: "execute",
    value: function execute() {
      var _this = this;
      var unHandledEntries = this.unHandled;
      if (!unHandledEntries.length) {
        return;
      }
      var nextEntry = unHandledEntries[0];
      var containsQueryValues = nextEntry.queryKeys.every(function (r) {
        return Object.keys(queryString).includes(r);
      });
      if (!containsQueryValues) {
        nextEntry.failed = true;
        this.execute();
        return;
      }
      var resolve = function resolve(queryValues) {
        nextEntry.handled = true;
        _this.execute();
      };
      var reject = function reject(error) {};
      nextEntry.execute().then(resolve, reject);
    }
  }, {
    key: "unHandled",
    get: function get() {
      return this._handlers.filter(function (word) {
        return !word.handled && !word.failed;
      });
    }
  }, {
    key: "init",
    value: function init() {
      this.execute();
    }
  }]);
}();

/***/ }),
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isUndefined;
// Is a given variable undefined?
function isUndefined(obj) {
  return obj === void 0;
}


/***/ }),
/* 114 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isBoolean;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// Is a given value a boolean?
function isBoolean(obj) {
  return obj === true || obj === false || __WEBPACK_IMPORTED_MODULE_0__setup_js__["t" /* toString */].call(obj) === '[object Boolean]';
}


/***/ }),
/* 115 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Number'));


/***/ }),
/* 116 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Symbol'));


/***/ }),
/* 117 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('ArrayBuffer'));


/***/ }),
/* 118 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isNaN;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isNumber_js__ = __webpack_require__(115);



// Is the given value `NaN`?
function isNaN(obj) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__isNumber_js__["a" /* default */])(obj) && Object(__WEBPACK_IMPORTED_MODULE_0__setup_js__["g" /* _isNaN */])(obj);
}


/***/ }),
/* 119 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isDataView_js__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constant_js__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isBufferLike_js__ = __webpack_require__(289);





// Is a given value a typed array?
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
  // `ArrayBuffer.isView` is the most future-proof, so use it when available.
  // Otherwise, fall back on the above regular expression.
  return __WEBPACK_IMPORTED_MODULE_0__setup_js__["l" /* nativeIsView */] ? (Object(__WEBPACK_IMPORTED_MODULE_0__setup_js__["l" /* nativeIsView */])(obj) && !Object(__WEBPACK_IMPORTED_MODULE_1__isDataView_js__["a" /* default */])(obj)) :
                Object(__WEBPACK_IMPORTED_MODULE_3__isBufferLike_js__["a" /* default */])(obj) && typedArrayPattern.test(__WEBPACK_IMPORTED_MODULE_0__setup_js__["t" /* toString */].call(obj));
}

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__setup_js__["r" /* supportsArrayBuffer */] ? isTypedArray : Object(__WEBPACK_IMPORTED_MODULE_2__constant_js__["a" /* default */])(false));


/***/ }),
/* 120 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = constant;
// Predicate-generating function. Often useful outside of Underscore.
function constant(value) {
  return function() {
    return value;
  };
}


/***/ }),
/* 121 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createSizePropertyCheck;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// Common internal logic for `isArrayLike` and `isBufferLike`.
function createSizePropertyCheck(getSizeProperty) {
  return function(collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= __WEBPACK_IMPORTED_MODULE_0__setup_js__["b" /* MAX_ARRAY_INDEX */];
  }
}


/***/ }),
/* 122 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = shallowProperty;
// Internal helper to generate a function to obtain property `key` from `obj`.
function shallowProperty(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
}


/***/ }),
/* 123 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = collectNonEnumProps;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__has_js__ = __webpack_require__(25);




// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.
function emulatedSet(keys) {
  var hash = {};
  for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
  return {
    contains: function(key) { return hash[key] === true; },
    push: function(key) {
      hash[key] = true;
      return keys.push(key);
    }
  };
}

// Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
// be iterated by `for key in ...` and thus missed. Extends `keys` in place if
// needed.
function collectNonEnumProps(obj, keys) {
  keys = emulatedSet(keys);
  var nonEnumIdx = __WEBPACK_IMPORTED_MODULE_0__setup_js__["n" /* nonEnumerableProps */].length;
  var constructor = obj.constructor;
  var proto = (Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(constructor) && constructor.prototype) || __WEBPACK_IMPORTED_MODULE_0__setup_js__["c" /* ObjProto */];

  // Constructor is a special case.
  var prop = 'constructor';
  if (Object(__WEBPACK_IMPORTED_MODULE_2__has_js__["a" /* default */])(obj, prop) && !keys.contains(prop)) keys.push(prop);

  while (nonEnumIdx--) {
    prop = __WEBPACK_IMPORTED_MODULE_0__setup_js__["n" /* nonEnumerableProps */][nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
      keys.push(prop);
    }
  }
}


/***/ }),
/* 124 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isMatch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__keys_js__ = __webpack_require__(8);


// Returns whether an object has a given set of `key:value` pairs.
function isMatch(object, attrs) {
  var _keys = Object(__WEBPACK_IMPORTED_MODULE_0__keys_js__["a" /* default */])(attrs), length = _keys.length;
  if (object == null) return !length;
  var obj = Object(object);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}


/***/ }),
/* 125 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = invert;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__keys_js__ = __webpack_require__(8);


// Invert the keys and values of an object. The values must be serializable.
function invert(obj) {
  var result = {};
  var _keys = Object(__WEBPACK_IMPORTED_MODULE_0__keys_js__["a" /* default */])(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result[obj[_keys[i]]] = _keys[i];
  }
  return result;
}


/***/ }),
/* 126 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = functions;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isFunction_js__ = __webpack_require__(17);


// Return a sorted list of the function names available on the object.
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (Object(__WEBPACK_IMPORTED_MODULE_0__isFunction_js__["a" /* default */])(obj[key])) names.push(key);
  }
  return names.sort();
}


/***/ }),
/* 127 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createAssigner_js__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__allKeys_js__ = __webpack_require__(42);



// Extend a given object with all the properties in passed-in object(s).
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createAssigner_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__allKeys_js__["a" /* default */]));


/***/ }),
/* 128 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createAssigner_js__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__allKeys_js__ = __webpack_require__(42);



// Fill in a given object with default properties.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createAssigner_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__allKeys_js__["a" /* default */], true));


/***/ }),
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = baseCreate;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isObject_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setup_js__ = __webpack_require__(4);



// Create a naked function reference for surrogate-prototype-swapping.
function ctor() {
  return function(){};
}

// An internal function for creating a new object that inherits from another.
function baseCreate(prototype) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0__isObject_js__["a" /* default */])(prototype)) return {};
  if (__WEBPACK_IMPORTED_MODULE_1__setup_js__["j" /* nativeCreate */]) return Object(__WEBPACK_IMPORTED_MODULE_1__setup_js__["j" /* nativeCreate */])(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result = new Ctor;
  Ctor.prototype = null;
  return result;
}


/***/ }),
/* 130 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = get;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__toPath_js__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__deepGet_js__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isUndefined_js__ = __webpack_require__(113);




// Get the value of the (deep) property on `path` from `object`.
// If any property in `path` does not exist or if the value is
// `undefined`, return `defaultValue` instead.
// The `path` is normalized through `_.toPath`.
function get(object, path, defaultValue) {
  var value = Object(__WEBPACK_IMPORTED_MODULE_1__deepGet_js__["a" /* default */])(object, Object(__WEBPACK_IMPORTED_MODULE_0__toPath_js__["a" /* default */])(path));
  return Object(__WEBPACK_IMPORTED_MODULE_2__isUndefined_js__["a" /* default */])(value) ? defaultValue : value;
}


/***/ }),
/* 131 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toPath;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArray_js__ = __webpack_require__(29);



// Normalize a (deep) property `path` to array.
// Like `_.iteratee`, this function can be customized.
function toPath(path) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__isArray_js__["a" /* default */])(path) ? path : [path];
}
__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].toPath = toPath;


/***/ }),
/* 132 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = baseIteratee;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__identity_js__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObject_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isArray_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__matcher_js__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__property_js__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__optimizeCb_js__ = __webpack_require__(44);








// An internal function to generate callbacks that can be applied to each
// element in a collection, returning the desired result — either `_.identity`,
// an arbitrary callback, a property matcher, or a property accessor.
function baseIteratee(value, context, argCount) {
  if (value == null) return __WEBPACK_IMPORTED_MODULE_0__identity_js__["a" /* default */];
  if (Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(value)) return Object(__WEBPACK_IMPORTED_MODULE_6__optimizeCb_js__["a" /* default */])(value, context, argCount);
  if (Object(__WEBPACK_IMPORTED_MODULE_2__isObject_js__["a" /* default */])(value) && !Object(__WEBPACK_IMPORTED_MODULE_3__isArray_js__["a" /* default */])(value)) return Object(__WEBPACK_IMPORTED_MODULE_4__matcher_js__["a" /* default */])(value);
  return Object(__WEBPACK_IMPORTED_MODULE_5__property_js__["a" /* default */])(value);
}


/***/ }),
/* 133 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = iteratee;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__baseIteratee_js__ = __webpack_require__(132);



// External wrapper for our callback generator. Users may customize
// `_.iteratee` if they want additional predicate/iteratee shorthand styles.
// This abstraction hides the internal-only `argCount` argument.
function iteratee(value, context) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__baseIteratee_js__["a" /* default */])(value, context, Infinity);
}
__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].iteratee = iteratee;


/***/ }),
/* 134 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = noop;
// Predicate-generating function. Often useful outside of Underscore.
function noop(){}


/***/ }),
/* 135 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = random;
// Return a random integer between `min` and `max` (inclusive).
function random(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
}


/***/ }),
/* 136 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createEscaper;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__keys_js__ = __webpack_require__(8);


// Internal helper to generate functions for escaping and unescaping strings
// to/from HTML interpolation.
function createEscaper(map) {
  var escaper = function(match) {
    return map[match];
  };
  // Regexes for identifying a key that needs to be escaped.
  var source = '(?:' + Object(__WEBPACK_IMPORTED_MODULE_0__keys_js__["a" /* default */])(map).join('|') + ')';
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, 'g');
  return function(string) {
    string = string == null ? '' : '' + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}


/***/ }),
/* 137 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Internal list of HTML entities for escaping.
/* harmony default export */ __webpack_exports__["a"] = ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;'
});


/***/ }),
/* 138 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);


// By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.
/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].templateSettings = {
  evaluate: /<%([\s\S]+?)%>/g,
  interpolate: /<%=([\s\S]+?)%>/g,
  escape: /<%-([\s\S]+?)%>/g
});


/***/ }),
/* 139 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = executeBound;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseCreate_js__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isObject_js__ = __webpack_require__(28);



// Internal function to execute `sourceFunc` bound to `context` with optional
// `args`. Determines whether to execute a function as a constructor or as a
// normal function.
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self = Object(__WEBPACK_IMPORTED_MODULE_0__baseCreate_js__["a" /* default */])(sourceFunc.prototype);
  var result = sourceFunc.apply(self, args);
  if (Object(__WEBPACK_IMPORTED_MODULE_1__isObject_js__["a" /* default */])(result)) return result;
  return self;
}


/***/ }),
/* 140 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__executeBound_js__ = __webpack_require__(139);




// Create a function bound to a given object (assigning `this`, and arguments,
// optionally).
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(func, context, args) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(func)) throw new TypeError('Bind must be called on a function');
  var bound = Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(callArgs) {
    return Object(__WEBPACK_IMPORTED_MODULE_2__executeBound_js__["a" /* default */])(func, bound, context, this, args.concat(callArgs));
  });
  return bound;
}));


/***/ }),
/* 141 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);


// Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
}));


/***/ }),
/* 142 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = before;
// Returns a function that will only be executed up to (but not including) the
// Nth call.
function before(times, func) {
  var memo;
  return function() {
    if (--times > 0) {
      memo = func.apply(this, arguments);
    }
    if (times <= 1) func = null;
    return memo;
  };
}


/***/ }),
/* 143 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = findKey;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__keys_js__ = __webpack_require__(8);



// Returns the first key on an object that passes a truth test.
function findKey(obj, predicate, context) {
  predicate = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(predicate, context);
  var _keys = Object(__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* default */])(obj), key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}


/***/ }),
/* 144 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createPredicateIndexFinder;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getLength_js__ = __webpack_require__(18);



// Internal function to generate `_.findIndex` and `_.findLastIndex`.
function createPredicateIndexFinder(dir) {
  return function(array, predicate, context) {
    predicate = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(predicate, context);
    var length = Object(__WEBPACK_IMPORTED_MODULE_1__getLength_js__["a" /* default */])(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}


/***/ }),
/* 145 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createPredicateIndexFinder_js__ = __webpack_require__(144);


// Returns the last index on an array-like that passes a truth test.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createPredicateIndexFinder_js__["a" /* default */])(-1));


/***/ }),
/* 146 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sortedIndex;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getLength_js__ = __webpack_require__(18);



// Use a comparator function to figure out the smallest index at which
// an object should be inserted so as to maintain order. Uses binary search.
function sortedIndex(array, obj, iteratee, context) {
  iteratee = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(iteratee, context, 1);
  var value = iteratee(obj);
  var low = 0, high = Object(__WEBPACK_IMPORTED_MODULE_1__getLength_js__["a" /* default */])(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
  }
  return low;
}


/***/ }),
/* 147 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sortedIndex_js__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__findIndex_js__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__createIndexFinder_js__ = __webpack_require__(148);




// Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_2__createIndexFinder_js__["a" /* default */])(1, __WEBPACK_IMPORTED_MODULE_1__findIndex_js__["a" /* default */], __WEBPACK_IMPORTED_MODULE_0__sortedIndex_js__["a" /* default */]));


/***/ }),
/* 148 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createIndexFinder;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isNaN_js__ = __webpack_require__(118);




// Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
function createIndexFinder(dir, predicateFind, sortedIndex) {
  return function(array, item, idx) {
    var i = 0, length = Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(array);
    if (typeof idx == 'number') {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex && idx && length) {
      idx = sortedIndex(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(__WEBPACK_IMPORTED_MODULE_1__setup_js__["q" /* slice */].call(array, i, length), __WEBPACK_IMPORTED_MODULE_2__isNaN_js__["a" /* default */]);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}


/***/ }),
/* 149 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = find;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__findIndex_js__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__findKey_js__ = __webpack_require__(143);




// Return the first value which passes a truth test.
function find(obj, predicate, context) {
  var keyFinder = Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(obj) ? __WEBPACK_IMPORTED_MODULE_1__findIndex_js__["a" /* default */] : __WEBPACK_IMPORTED_MODULE_2__findKey_js__["a" /* default */];
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}


/***/ }),
/* 150 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createReduce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__keys_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__optimizeCb_js__ = __webpack_require__(44);




// Internal helper to create a reducing function, iterating left or right.
function createReduce(dir) {
  // Wrap code that reassigns argument variables in a separate function than
  // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
  var reducer = function(obj, iteratee, memo, initial) {
    var _keys = !Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(obj) && Object(__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* default */])(obj),
        length = (_keys || obj).length,
        index = dir > 0 ? 0 : length - 1;
    if (!initial) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  return function(obj, iteratee, memo, context) {
    var initial = arguments.length >= 3;
    return reducer(obj, Object(__WEBPACK_IMPORTED_MODULE_2__optimizeCb_js__["a" /* default */])(iteratee, context, 4), memo, initial);
  };
}


/***/ }),
/* 151 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = max;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__values_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__each_js__ = __webpack_require__(30);





// Return the maximum element (or element-based computation).
function max(obj, iteratee, context) {
  var result = -Infinity, lastComputed = -Infinity,
      value, computed;
  if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
    obj = Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(obj) ? obj : Object(__WEBPACK_IMPORTED_MODULE_1__values_js__["a" /* default */])(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result) {
        result = value;
      }
    }
  } else {
    iteratee = Object(__WEBPACK_IMPORTED_MODULE_2__cb_js__["a" /* default */])(iteratee, context);
    Object(__WEBPACK_IMPORTED_MODULE_3__each_js__["a" /* default */])(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}


/***/ }),
/* 152 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sample;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__values_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__random_js__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__toArray_js__ = __webpack_require__(153);






// Sample **n** random values from a collection using the modern version of the
// [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
// If **n** is not specified, returns a single random element.
// The internal `guard` argument allows it to work with `_.map`.
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(obj)) obj = Object(__WEBPACK_IMPORTED_MODULE_1__values_js__["a" /* default */])(obj);
    return obj[Object(__WEBPACK_IMPORTED_MODULE_3__random_js__["a" /* default */])(obj.length - 1)];
  }
  var sample = Object(__WEBPACK_IMPORTED_MODULE_4__toArray_js__["a" /* default */])(obj);
  var length = Object(__WEBPACK_IMPORTED_MODULE_2__getLength_js__["a" /* default */])(sample);
  n = Math.max(Math.min(n, length), 0);
  var last = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = Object(__WEBPACK_IMPORTED_MODULE_3__random_js__["a" /* default */])(index, last);
    var temp = sample[index];
    sample[index] = sample[rand];
    sample[rand] = temp;
  }
  return sample.slice(0, n);
}


/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toArray;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArray_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isString_js__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__map_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__identity_js__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__values_js__ = __webpack_require__(34);








// Safely create a real, live array from anything iterable.
var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function toArray(obj) {
  if (!obj) return [];
  if (Object(__WEBPACK_IMPORTED_MODULE_0__isArray_js__["a" /* default */])(obj)) return __WEBPACK_IMPORTED_MODULE_1__setup_js__["q" /* slice */].call(obj);
  if (Object(__WEBPACK_IMPORTED_MODULE_2__isString_js__["a" /* default */])(obj)) {
    // Keep surrogate pair characters together.
    return obj.match(reStrSymbol);
  }
  if (Object(__WEBPACK_IMPORTED_MODULE_3__isArrayLike_js__["a" /* default */])(obj)) return Object(__WEBPACK_IMPORTED_MODULE_4__map_js__["a" /* default */])(obj, __WEBPACK_IMPORTED_MODULE_5__identity_js__["a" /* default */]);
  return Object(__WEBPACK_IMPORTED_MODULE_6__values_js__["a" /* default */])(obj);
}


/***/ }),
/* 154 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__optimizeCb_js__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__allKeys_js__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__keyInObj_js__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__flatten_js__ = __webpack_require__(35);







// Return a copy of the object only containing the allowed properties.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(obj, keys) {
  var result = {}, iteratee = keys[0];
  if (obj == null) return result;
  if (Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(iteratee)) {
    if (keys.length > 1) iteratee = Object(__WEBPACK_IMPORTED_MODULE_2__optimizeCb_js__["a" /* default */])(iteratee, keys[1]);
    keys = Object(__WEBPACK_IMPORTED_MODULE_3__allKeys_js__["a" /* default */])(obj);
  } else {
    iteratee = __WEBPACK_IMPORTED_MODULE_4__keyInObj_js__["a" /* default */];
    keys = Object(__WEBPACK_IMPORTED_MODULE_5__flatten_js__["a" /* default */])(keys, false, false);
    obj = Object(obj);
  }
  for (var i = 0, length = keys.length; i < length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (iteratee(value, key, obj)) result[key] = value;
  }
  return result;
}));


/***/ }),
/* 155 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = initial;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// Returns everything but the last entry of the array. Especially useful on
// the arguments object. Passing **n** will return all the values in
// the array, excluding the last N.
function initial(array, n, guard) {
  return __WEBPACK_IMPORTED_MODULE_0__setup_js__["q" /* slice */].call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}


/***/ }),
/* 156 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = rest;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// Returns everything but the first entry of the `array`. Especially useful on
// the `arguments` object. Passing an **n** will return the rest N values in the
// `array`.
function rest(array, n, guard) {
  return __WEBPACK_IMPORTED_MODULE_0__setup_js__["q" /* slice */].call(array, n == null || guard ? 1 : n);
}


/***/ }),
/* 157 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__flatten_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__filter_js__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contains_js__ = __webpack_require__(46);





// Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(array, rest) {
  rest = Object(__WEBPACK_IMPORTED_MODULE_1__flatten_js__["a" /* default */])(rest, true, true);
  return Object(__WEBPACK_IMPORTED_MODULE_2__filter_js__["a" /* default */])(array, function(value){
    return !Object(__WEBPACK_IMPORTED_MODULE_3__contains_js__["a" /* default */])(rest, value);
  });
}));


/***/ }),
/* 158 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = uniq;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isBoolean_js__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__contains_js__ = __webpack_require__(46);





// Produce a duplicate-free version of the array. If the array has already
// been sorted, you have the option of using a faster algorithm.
// The faster algorithm will not work with an iteratee if the iteratee
// is not a one-to-one function, so providing an iteratee will disable
// the faster algorithm.
function uniq(array, isSorted, iteratee, context) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0__isBoolean_js__["a" /* default */])(isSorted)) {
    context = iteratee;
    iteratee = isSorted;
    isSorted = false;
  }
  if (iteratee != null) iteratee = Object(__WEBPACK_IMPORTED_MODULE_1__cb_js__["a" /* default */])(iteratee, context);
  var result = [];
  var seen = [];
  for (var i = 0, length = Object(__WEBPACK_IMPORTED_MODULE_2__getLength_js__["a" /* default */])(array); i < length; i++) {
    var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
    if (isSorted && !iteratee) {
      if (!i || seen !== computed) result.push(value);
      seen = computed;
    } else if (iteratee) {
      if (!Object(__WEBPACK_IMPORTED_MODULE_3__contains_js__["a" /* default */])(seen, computed)) {
        seen.push(computed);
        result.push(value);
      }
    } else if (!Object(__WEBPACK_IMPORTED_MODULE_3__contains_js__["a" /* default */])(result, value)) {
      result.push(value);
    }
  }
  return result;
}


/***/ }),
/* 159 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = unzip;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__max_js__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pluck_js__ = __webpack_require__(81);




// Complement of zip. Unzip accepts an array of arrays and groups
// each array's elements on shared indices.
function unzip(array) {
  var length = (array && Object(__WEBPACK_IMPORTED_MODULE_0__max_js__["a" /* default */])(array, __WEBPACK_IMPORTED_MODULE_1__getLength_js__["a" /* default */]).length) || 0;
  var result = Array(length);

  for (var index = 0; index < length; index++) {
    result[index] = Object(__WEBPACK_IMPORTED_MODULE_2__pluck_js__["a" /* default */])(array, index);
  }
  return result;
}


/***/ }),
/* 160 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = chainResult;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);


// Helper function to continue chaining intermediate results.
function chainResult(instance, obj) {
  return instance._chain ? Object(__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */])(obj).chain() : obj;
}


/***/ }),
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(261);
__webpack_require__(400);
__webpack_require__(401);
__webpack_require__(402);
__webpack_require__(403);
__webpack_require__(404);
module.exports = __webpack_require__(405);


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _interopRequireDefault = __webpack_require__(2);
__webpack_require__(262);
__webpack_require__(264);
var _jquery = _interopRequireDefault(__webpack_require__(7));
__webpack_require__(266);
__webpack_require__(267);
__webpack_require__(280);
__webpack_require__(66);
var _i18n = __webpack_require__(353);
var _lzString = _interopRequireDefault(__webpack_require__(360));
var _core = __webpack_require__(361);
var _utils = _interopRequireDefault(__webpack_require__(26));
var _account = _interopRequireDefault(__webpack_require__(380));
var _social = __webpack_require__(383);
var _notifications = __webpack_require__(384);
var _spineAnimations = __webpack_require__(167);
var _main = __webpack_require__(386);
// External libraries

// App reference
var agarApp = {};
global.agarApp = agarApp;
window['agarApp'] = agarApp;

// New includes

agarApp.i18n = _i18n.i18n;
window.$ = _jquery["default"];
window['j' + 'Query'] = _jquery["default"];
window.LZString = _lzString["default"];

// Styles
// require('../css/style.sass');

window.ssa_json = {};

// Core

agarApp.core = _core.core;
agarApp.debug = _core.debug;
agarApp.cache = {};
agarApp.utils = _utils["default"];

// #include "favicon"

agarApp.account = new _account["default"](agarApp, _jquery["default"]);
agarApp.social = _social.social;
agarApp.notifications = _notifications.notifications;
window.SpineAnimation = _spineAnimations.SpineAnimation;
var main = new _main.Main(agarApp);
agarApp.hasInitialized = main.hasInitialized.bind(main);
agarApp.init = main.agarioInit.bind(main);
agarApp.main = main;
window['queryString'] = main.queryString;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.LEGACY_KEYS_TO_COPY = exports.KEYS_TO_PROCESS = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
var _storageKeys = _interopRequireDefault(__webpack_require__(33));
var KEYS_TO_PROCESS = exports.KEYS_TO_PROCESS = [_storageKeys["default"].SETTINGS, _storageKeys["default"].HAS_PLAYED_TEAMS, _storageKeys["default"].COOKIES_CONSENT, _storageKeys["default"].PRIVACY_SETTINGS, _storageKeys["default"].GDPR_CONSENT, _storageKeys["default"].GDPR_BANNER_COUNTER, _storageKeys["default"].FACEBOOK_FRIENDS, _storageKeys["default"].STORED_OBJECT_INFO, _storageKeys["default"].MYSTERY_SKIN_NOTIFICATION, _storageKeys["default"].HAS_OPENED_SKIN_EDITOR, _storageKeys["default"].HAS_SEEN_SKIN_EDITOR_TUTORIAL, _storageKeys["default"].SKIN_EDITOR_CACHE];
var LEGACY_KEYS_TO_COPY = exports.LEGACY_KEYS_TO_COPY = [_storageKeys["default"].SETTINGS];
var LocalStorage = /*#__PURE__*/function () {
  function LocalStorage() {
    (0, _classCallCheck2["default"])(this, LocalStorage);
    this.storageBank = null;
    this.overrideLocalStorage();
  }

  /**
   *
   * @method isAppAPIAvailable    check if the app API is available
   * @return {boolean}            boolean stating if window.agarApp.API is available or not
   * @readonly
   * @memberof LocalStorage
   */
  return (0, _createClass2["default"])(LocalStorage, [{
    key: "isAppAPIAvailable",
    get: function get() {
      var app = window.agarApp;
      return app && app.API;
    }

    /**
     * @method userInfo             get current userInfo if available
     * @return {object|null}        current logged userInfo object or null
     * @readonly
     * @memberof LocalStorage
     */
  }, {
    key: "userInfo",
    get: function get() {
      if (this.isAppAPIAvailable) {
        var userInfo = window.agarApp.API.getUserInfo();
        return userInfo;
      } else {
        return null;
      }
    }

    /**
     * @method storage              get the current localStorage for the game
     * @returns {object}            current parsed localStorage object or a new storage object
     * @readonly
     * @memberof LocalStorage
     */
  }, {
    key: "storage",
    get: function get() {
      if (!this.storageBank) {
        this.storageBank = JSON.parse(window._localStorage.getItem(_storageKeys["default"].LOCAL_STORAGE_KEY)) || {};
      }
      return this.storageBank;
    }

    /**
     * @method createNewStorageContainer    create new storage container for that key
     * @param {string} key                  key for the new storage container
     * @memberof LocalStorage
     */
  }, {
    key: "createNewStorageContainer",
    value: function createNewStorageContainer(key) {
      if (key && !this.storage[key]) {
        this.storage[key] = {};
        window._localStorage.setItem(_storageKeys["default"].LOCAL_STORAGE_KEY, JSON.stringify(this.storage));
      }
    }

    /**
     * @method getUserKey       get the userKey to be used for the storage or use the GUEST key
     * @returns {string}        user storage Key
     * @memberof LocalStorage
     */
  }, {
    key: "getUserKey",
    value: function getUserKey() {
      if (this.userInfo && this.userInfo.name) {
        this.createNewStorageContainer(this.userInfo.name);
        return this.userInfo.name;
      } else {
        this.createNewStorageContainer(_storageKeys["default"].LOCAL_GUEST_KEY);
        return _storageKeys["default"].LOCAL_GUEST_KEY;
      }
    }

    /**
     * @method processLegacyKey     process old storage and copy to the new storage object
     * @param {*} key               legacy key to check
     * @returns {object|null}       returns the old data object parsed or null
     * @memberof LocalStorage
     */
  }, {
    key: "processLegacyKey",
    value: function processLegacyKey(key) {
      var legacyJson = window._localStorage.getItem(key);
      if (legacyJson == null) return null;
      if (LEGACY_KEYS_TO_COPY.includes(key)) {
        window.localStorage.removeItem(key);
        return JSON.parse(legacyJson);
      } else {
        window.localStorage.removeItem(key);
        return null;
      }
    }

    /**
     * @method overrideLocalStorage     Overrides the setItem, getItem and removeItem of the localStorage to store objects per user
     *                                  and creates a wrapper of the window.localStorage at window._localStorage
     * @memberof LocalStorage
     */
  }, {
    key: "overrideLocalStorage",
    value: function overrideLocalStorage() {
      var self = this;
      Object.defineProperty(window, '_localStorage', {
        value: window.localStorage,
        writable: false,
        configurable: false,
        enumerable: false
      });
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: function setItem(key, jsonValue) {
            // if ([StorageKeys.SETTINGS].includes(key)) debugger;
            var userKey = self.getUserKey();
            try {
              if (key && KEYS_TO_PROCESS.includes(key)) {
                if (!self.storage[userKey][key]) self.storage[userKey][key] = {};
                try {
                  self.storage[userKey][key] = JSON.parse(jsonValue);
                } catch (e) {
                  self.storage[userKey][key] = jsonValue;
                }
                window._localStorage.setItem(_storageKeys["default"].LOCAL_STORAGE_KEY, JSON.stringify(self.storage));
              } else {
                window._localStorage.setItem(key, jsonValue);
              }
            } catch (e) {
              window._localStorage.setItem(key, jsonValue);
              throw e;
            }
          },
          getItem: function getItem(key) {
            var userKey = self.getUserKey();
            try {
              if (key && KEYS_TO_PROCESS.includes(key)) {
                var legacyObject = self.processLegacyKey(key);
                if (!legacyObject && self.storage[userKey][key] === null) {
                  return null;
                } else {
                  if (self.storage[userKey][key] === null) {
                    self.storage[userKey][key] = {};
                  }
                  if (legacyObject) {
                    Object.assign(self.storage[userKey][key], legacyObject);
                  }
                  return JSON.stringify(self.storage[userKey][key]);
                }
              } else {
                return window._localStorage.getItem(key);
              }
            } catch (e) {
              return window._localStorage.getItem(key);
            }
          },
          removeItem: function removeItem(key) {
            window._localStorage.removeItem(key);
          }
        },
        writable: false,
        configurable: false,
        enumerable: false
      });
    }
  }]);
}();
var storage = new LocalStorage();
var _default = exports["default"] = storage;

/***/ }),
/* 263 */,
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Object.assign != 'function') {
  (function () {
    Object.defineProperty(Object, 'assign', {
      value: function assign(target) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < (arguments.length <= 1 ? 0 : arguments.length - 1); index++) {
          var nextSource = index + 1 < 1 || arguments.length <= index + 1 ? undefined : arguments[index + 1];
          if (nextSource != null) {
            for (var nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  })();
}

/***/ }),
/* 265 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! Magnific Popup - v1.2.0 - 2024-06-08
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2024 Dmytro Semenov; */
;(function (factory) { 
if (true) { 
 // AMD. Register as an anonymous module. 
 !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(7)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); 
 } else if (typeof exports === 'object') { 
 // Node/CommonJS 
 factory(require('jquery')); 
 } else { 
 // Browser globals 
 factory(window.jQuery || window.Zepto); 
 } 
 }(function($) { 

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
/*jshint -W079 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(__webpack_provided_window_dot_jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, Array.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			/*jshint -W020 */
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = Array.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(mfp._checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}

	

		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}
		
		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();

		
		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				mfp._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).trigger('focus'); // put tab focus back
		}
		mfp.currItem = null;	
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });

		mfp.currItem = item;

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}

		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;

		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},


	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if(typeof disableOn === "function") {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			if (mfp.st.allowHTMLInStatusIndicator) {
				mfp.preloader.html(text);
			} else {
				mfp.preloader.text(text);
			}

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).closest('.' + PREVENT_CLOSE_CLASS).length) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).closest('.mfp-close').length || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).trigger('focus');
	},
	_onFocusIn: function(e) {
		if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
			mfp._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				if (mfp.st.allowHTMLInTemplate) {
					template.find(EVENT_NS + '-'+key).html(value);
				} else {
					template.find(EVENT_NS + '-'+key).text(value);
				}
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true,

		allowHTMLInStatusIndicator: false,

		allowHTMLInTemplate: false

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.magnificPopup.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `mfp-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = mfp.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'mfp-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					mfp.updateStatus('ready');
				} else {
					mfp.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus('ready');
			mfp._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			$(document.body).removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(mfp.req) {
			mfp.req.abort();
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: 'The content could not be loaded.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur) {
				$(document.body).addClass(_ajaxCur);
			}

			mfp.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_mfpTrigger('ParseAjax', temp);

					mfp.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					mfp._setFocus();

					setTimeout(function() {
						mfp.wrap.addClass(READY_CLASS);
					}, 16);

					mfp.updateStatus('ready');

					_mfpTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $.ajax(opts);

			return '';
		}
	}
});

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined)
			return item.data.title;

		var src = mfp.st.image.titleSrc;

		if(src) {
			if(typeof src === "function") {
				return src.call(mfp, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
						'<div class="mfp-img"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-title"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: 'The image could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					$(document.body).addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					$(document.body).removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn('Resize'+ns, mfp.resizeImage);
			if(mfp.isLowIE) {
				_mfpOn('AfterChange', mfp.resizeImage);
			}
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item || !item.img) return;

			if(mfp.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(mfp.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', mfp.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {

				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}

				item.isCheckingImgSize = false;

				_mfpTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(mfp.content)
						mfp.content.removeClass('mfp-loading');

					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				mfpSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				imgSt = mfp.st.image,

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');

							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				};
				


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}

			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%',
		
		langDir: null,
		loop: true,
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;
			
			if (!gSt.langDir) {
				gSt.langDir = document.dir || 'ltr';
			}

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						if (gSt.langDir === 'rtl') mfp.next();
						else mfp.prev();
					} else if (e.keyCode === 39) {
						if (gSt.langDir === 'rtl') mfp.prev();
						else mfp.next();
					}
				});

				mfp.updateGalleryButtons();

			});

			_mfpOn('UpdateStatus'+ns, function(/*e, data*/) {
				mfp.updateGalleryButtons();
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {

					var arrowLeftDesc, arrowRightDesc, arrowLeftAction, arrowRightAction;

					if (gSt.langDir === 'rtl') {
						arrowLeftDesc = gSt.tNext;
						arrowRightDesc = gSt.tPrev;
						arrowLeftAction = 'next';
						arrowRightAction = 'prev';
					} else {
						arrowLeftDesc = gSt.tPrev;
						arrowRightDesc = gSt.tNext;
						arrowLeftAction = 'prev';
						arrowRightAction = 'next';
					}

					var markup     = gSt.arrowMarkup,
					    arrowLeft  = mfp.arrowLeft = $( markup.replace(/%title%/gi, arrowLeftDesc).replace(/%action%/gi, arrowLeftAction).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
					    arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, arrowRightDesc).replace(/%action%/gi, arrowRightAction).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					if (gSt.langDir === 'rtl') {
						mfp.arrowNext = arrowLeft;
						mfp.arrowPrev = arrowRight;
					} else {
						mfp.arrowNext = arrowRight;
						mfp.arrowPrev = arrowLeft;
					}

					arrowLeft.on('click', function() {
						if (gSt.langDir === 'rtl') mfp.next();
						else mfp.prev();
					});
					arrowRight.on('click', function() {
						if (gSt.langDir === 'rtl') mfp.prev();
						else mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));

				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			var newIndex = _getLoopedId(mfp.index + 1);
			if (!mfp.st.gallery.loop && newIndex === 0 ) return false;
			mfp.direction = true;
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		prev: function() {
			var newIndex = mfp.index - 1;
			if (!mfp.st.gallery.loop && newIndex < 0) return false;
			mfp.direction = false;
			mfp.index = _getLoopedId(newIndex);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		},

		/**
		 * Show/hide the gallery prev/next buttons if we're at the start/end, if looping is turned off
		 * Added by Joloco for Veg
		 */
		updateGalleryButtons: function() {

			if ( !mfp.st.gallery.loop && typeof mfp.arrowPrev === 'object' && mfp.arrowPrev !== null) {

				if (mfp.index === 0) mfp.arrowPrev.hide();
				else mfp.arrowPrev.show();

				if (mfp.index === (mfp.items.length - 1)) mfp.arrowNext.hide();
				else mfp.arrowNext.show();

			}

		},

	}

});


/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

// This file is autogenerated via the `commonjs` Grunt task. You can require() this file in a CommonJS environment.
__webpack_require__(268)
__webpack_require__(269)
__webpack_require__(270)
__webpack_require__(271)
__webpack_require__(272)
__webpack_require__(273)
__webpack_require__(274)
__webpack_require__(275)
__webpack_require__(276)
__webpack_require__(277)
__webpack_require__(278)
__webpack_require__(279)

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: transition.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: https://modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // https://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: alert.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.4.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    selector    = selector === '#' ? [] : selector
    var $parent = $(document).find(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: button.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.4.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // Prevent double click on radios, and the double selections (so cancellation) on checkboxes
        e.preventDefault()
        // The target component still receive the focus
        if ($btn.is('input,button')) $btn.trigger('focus')
        else $btn.find('input:visible,button:visible').first().trigger('focus')
      }
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: carousel.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.4.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      if (typeof $next === 'object' && $next.length) {
        $next[0].offsetWidth // force reflow
      }
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    if (href) {
      href = href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
    }

    var target  = $this.attr('data-target') || href
    var $target = $(document).find(target)

    if (!$target.hasClass('carousel')) return

    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: collapse.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.4.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(document).find(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(document).find(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: dropdown.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.4.1'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector !== '#' ? $(document).find(selector) : null

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: modal.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#modals
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options = options
    this.$body = $(document.body)
    this.$element = $(element)
    this.$dialog = this.$element.find('.modal-dialog')
    this.$backdrop = null
    this.isShown = null
    this.originalBodyPad = null
    this.scrollbarWidth = 0
    this.ignoreBackdropClick = false
    this.fixedContent = '.navbar-fixed-top, .navbar-fixed-bottom'

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION = '3.4.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
          this.$element[0] !== e.target &&
          !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft: !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    var scrollbarWidth = this.scrollbarWidth
    if (this.bodyIsOverflowing) {
      this.$body.css('padding-right', bodyPad + scrollbarWidth)
      $(this.fixedContent).each(function (index, element) {
        var actualPadding = element.style.paddingRight
        var calculatedPadding = $(element).css('padding-right')
        $(element)
          .data('padding-right', actualPadding)
          .css('padding-right', parseFloat(calculatedPadding) + scrollbarWidth + 'px')
      })
    }
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
    $(this.fixedContent).each(function (index, element) {
      var padding = $(element).data('padding-right')
      $(element).removeData('padding-right')
      element.style.paddingRight = padding ? padding : ''
    })
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this = $(this)
      var data = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
    var href = $this.attr('href')
    var target = $this.attr('data-target') ||
      (href && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7

    var $target = $(document).find(target)
    var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: tooltip.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
  'use strict';

  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn']

  var uriAttrs = [
    'background',
    'cite',
    'href',
    'itemtype',
    'longdesc',
    'poster',
    'src',
    'xlink:href'
  ]

  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i

  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  }

  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi

  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */
  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase()

    if ($.inArray(attrName, allowedAttributeList) !== -1) {
      if ($.inArray(attrName, uriAttrs) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN))
      }

      return true
    }

    var regExp = $(allowedAttributeList).filter(function (index, value) {
      return value instanceof RegExp
    })

    // Check if a regular expression validates the attribute.
    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true
      }
    }

    return false
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml)
    }

    // IE 8 and below don't support createHTMLDocument
    if (!document.implementation || !document.implementation.createHTMLDocument) {
      return unsafeHtml
    }

    var createdDocument = document.implementation.createHTMLDocument('sanitization')
    createdDocument.body.innerHTML = unsafeHtml

    var whitelistKeys = $.map(whiteList, function (el, i) { return i })
    var elements = $(createdDocument.body).find('*')

    for (var i = 0, len = elements.length; i < len; i++) {
      var el = elements[i]
      var elName = el.nodeName.toLowerCase()

      if ($.inArray(elName, whitelistKeys) === -1) {
        el.parentNode.removeChild(el)

        continue
      }

      var attributeList = $.map(el.attributes, function (el) { return el })
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || [])

      for (var j = 0, len2 = attributeList.length; j < len2; j++) {
        if (!allowedAttribute(attributeList[j], whitelistedAttributes)) {
          el.removeAttribute(attributeList[j].nodeName)
        }
      }
    }

    return createdDocument.body.innerHTML
  }

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.4.1'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    },
    sanitize : true,
    sanitizeFn : null,
    whiteList : DefaultWhitelist
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(document).find($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    var dataAttributes = this.$element.data()

    for (var dataAttr in dataAttributes) {
      if (dataAttributes.hasOwnProperty(dataAttr) && $.inArray(dataAttr, DISALLOWED_ATTRIBUTES) !== -1) {
        delete dataAttributes[dataAttr]
      }
    }

    options = $.extend({}, this.getDefaults(), dataAttributes, options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    if (options.sanitize) {
      options.template = sanitizeHtml(options.template, options.whiteList, options.sanitizeFn)
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo($(document).find(this.options.container)) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    if (this.options.html) {
      if (this.options.sanitize) {
        title = sanitizeHtml(title, this.options.whiteList, this.options.sanitizeFn)
      }

      $tip.find('.tooltip-inner').html(title)
    } else {
      $tip.find('.tooltip-inner').text(title)
    }

    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset())
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
      that.$element = null
    })
  }

  Tooltip.prototype.sanitizeHtml = function (unsafeHtml) {
    return sanitizeHtml(unsafeHtml, this.options.whiteList, this.options.sanitizeFn)
  }

  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: popover.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.4.1'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    if (this.options.html) {
      var typeContent = typeof content

      if (this.options.sanitize) {
        title = this.sanitizeHtml(title)

        if (typeContent === 'string') {
          content = this.sanitizeHtml(content)
        }
      }

      $tip.find('.popover-title').html(title)
      $tip.find('.popover-content').children().detach().end()[
        typeContent === 'string' ? 'html' : 'append'
      ](content)
    } else {
      $tip.find('.popover-title').text(title)
      $tip.find('.popover-content').children().detach().end().text(content)
    }

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
        o.content.call($e[0]) :
        o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: scrollspy.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.4.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: tab.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.4.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(document).find(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
        .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
        .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
          .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(jQuery) {/* ========================================================================
 * Bootstrap: affix.js v3.4.1
 * https://getbootstrap.com/docs/3.4/javascript/#affix
 * ========================================================================
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    var target = this.options.target === Affix.DEFAULTS.target ? $(this.options.target) : $(document).find(this.options.target)

    this.$target = target
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.4.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Pool of unlocked HTML5 Audio objects.
      self._html5AudioPool = [];
      self.html5PoolSize = 10;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto audio unlocker.
      self.autoUnlock = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Handle stopping all sounds globally.
     */
    stop: function() {
      var self = this || Howler;

      // Loop through all Howls and stop them.
      for (var i=0; i<self._howls.length; i++) {
        self._howls[i].stop();
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'suspended' : 'suspended';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch(e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var ua = self._navigator ? self._navigator.userAgent : '';
      var checkOpera = ua.match(/OPR\/(\d+)/g);
      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);
      var checkSafari = ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1;
      var safariVersion = ua.match(/Version\/(.*?) /);
      var isOldSafari = (checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15);

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType('audio/wav')).replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        m4b: !!(audioTest.canPlayType('audio/x-m4b;') || audioTest.canPlayType('audio/m4b;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
        webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Some browsers/devices will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _unlockAudio: function() {
      var self = this || Howler;

      // Only run this if Web Audio is supported and it hasn't already been unlocked.
      if (self._audioUnlocked || !self.ctx) {
        return;
      }

      self._audioUnlocked = false;
      self.autoUnlock = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function(e) {
        // Create a pool of unlocked HTML5 Audio objects that can
        // be used for playing sounds without user interaction. HTML5
        // Audio objects must be individually unlocked, as opposed
        // to the WebAudio API which only needs a single activation.
        // This must occur before WebAudio setup or the source.onended
        // event will not fire.
        while (self._html5AudioPool.length < self.html5PoolSize) {
          try {
            var audioNode = new Audio();

            // Mark this Audio object as unlocked to ensure it can get returned
            // to the unlocked pool when released.
            audioNode._unlocked = true;

            // Add the audio node to the pool.
            self._releaseHtml5Audio(audioNode);
          } catch (e) {
            self.noAudio = true;
            break;
          }
        }

        // Loop through any assigned audio nodes and unlock them.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and unlock the audio nodes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node && !sound._node._unlocked) {
                sound._node._unlocked = true;
                sound._node.load();
              }
            }
          }
        }

        // Fix Android can not play in suspend state.
        self._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._audioUnlocked = true;

          // Remove the touch start listener.
          document.removeEventListener('touchstart', unlock, true);
          document.removeEventListener('touchend', unlock, true);
          document.removeEventListener('click', unlock, true);
          document.removeEventListener('keydown', unlock, true);

          // Let all sounds know that audio has been unlocked.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('unlock');
          }
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);
      document.addEventListener('click', unlock, true);
      document.addEventListener('keydown', unlock, true);

      return self;
    },

    /**
     * Get an unlocked HTML5 Audio object from the pool. If none are left,
     * return a new Audio object and throw a warning.
     * @return {Audio} HTML5 Audio object.
     */
    _obtainHtml5Audio: function() {
      var self = this || Howler;

      // Return the next object from the pool if one exists.
      if (self._html5AudioPool.length) {
        return self._html5AudioPool.pop();
      }

      //.Check if the audio is locked and throw a warning.
      var testPlay = new Audio().play();
      if (testPlay && typeof Promise !== 'undefined' && (testPlay instanceof Promise || typeof testPlay.then === 'function')) {
        testPlay.catch(function() {
          console.warn('HTML5 Audio pool exhausted, returning potentially locked audio object.');
        });
      }

      return new Audio();
    },

    /**
     * Return an activated HTML5 Audio object to the pool.
     * @return {Howler}
     */
    _releaseHtml5Audio: function(audio) {
      var self = this || Howler;

      // Don't add audio to the pool if we don't know if it has been unlocked.
      if (audio._unlocked) {
        self._html5AudioPool.push(audio);
      }

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';

        // Handle updating the state of the audio context after suspending.
        var handleSuspension = function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        };

        // Either the state gets suspended or it is interrupted.
        // Either way, we need to update the state to suspended.
        self.ctx.suspend().then(handleSuspension, handleSuspension);
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self.ctx.state !== 'interrupted' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended' || self.state === 'running' && self.ctx.state === 'interrupted') {
        self.ctx.resume().then(function() {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean' || o.preload === 'metadata') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;
      self._xhr = {
        method: o.xhr && o.xhr.method ? o.xhr.method : 'GET',
        headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
        withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false,
      };

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];
      self._playLock = false;

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
      self._onunlock = o.onunlock ? [{fn: o.onunlock}] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.autoUnlock) {
        Howler._unlockAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload && self._preload !== 'none') {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        if (!self._playLock) {
          var num = 0;
          for (var i=0; i<self._sounds.length; i++) {
            if (self._sounds[i]._paused && !self._sounds[i]._ended) {
              num++;
              id = self._sounds[i]._id;
            }
          }

          if (num === 1) {
            sprite = null;
          } else {
            id = null;
          }
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Mark this sound as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          self._loadQueue('play');
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
      var timeout = (duration * 1000) / Math.abs(sound._rate);
      var start = self._sprite[sprite][0] / 1000;
      var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._sprite = sprite;

      // Mark the sound as ended instantly so that this async playback
      // doesn't get grabbed by another call to play while this one waits to start.
      sound._ended = false;

      // Update the parameters of the sound.
      var setParams = function() {
        sound._paused = false;
        sound._seek = seek;
        sound._start = start;
        sound._stop = stop;
        sound._loop = !!(sound._loop || self._sprite[sprite][2]);
      };

      // End the sound instantly if seek is at the end.
      if (seek >= stop) {
        self._ended(sound);
        return;
      }

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._playLock = false;
          setParams();
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function() {
              self._emit('play', sound._id);
              self._loadQueue();
            }, 0);
          }
        };

        if (Howler.state === 'running' && Howler.ctx.state !== 'interrupted') {
          playWebAudio();
        } else {
          self._playLock = true;

          // Wait for the audio context to resume before playing.
          self.once('resume', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;

          // Some browsers will throw an error if this is called without user interaction.
          try {
            var play = node.play();

            // Support older browsers that don't support promises, and thus don't have this issue.
            if (play && typeof Promise !== 'undefined' && (play instanceof Promise || typeof play.then === 'function')) {
              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
              self._playLock = true;

              // Set param values immediately.
              setParams();

              // Releases the lock and executes queued actions.
              play
                .then(function() {
                  self._playLock = false;
                  node._unlocked = true;
                  if (!internal) {
                    self._emit('play', sound._id);
                  } else {
                    self._loadQueue();
                  }
                })
                .catch(function() {
                  self._playLock = false;
                  self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                    'on mobile devices and Chrome where playback was not within a user interaction.');

                  // Reset the ended and paused values.
                  sound._ended = true;
                  sound._paused = true;
                });
            } else if (!internal) {
              self._playLock = false;
              setParams();
              self._emit('play', sound._id);
            }

            // Setting rate before playing won't work in IE, so we set it again here.
            node.playbackRate = sound._rate;

            // If the node is still paused, then we can assume there was a playback issue.
            if (node.paused) {
              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                'on mobile devices and Chrome where playback was not within a user interaction.');
              return;
            }

            // Setup the end timer on sprites or listen for the ended event.
            if (sprite !== '__default' || sound._loop) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            } else {
              self._endTimers[sound._id] = function() {
                // Fire ended on this audio node.
                self._ended(sound);

                // Clear this listener.
                node.removeEventListener('ended', self._endTimers[sound._id], false);
              };
              node.addEventListener('ended', self._endTimers[sound._id], false);
            }
          } catch (err) {
            self._emit('playerror', sound._id, err);
          }
        };

        // If this is streaming audio, make sure the src is set and load again.
        if (node.src === 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA') {
          node.src = self._src;
          node.load();
        }

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
        if (node.readyState >= 3 || loadedNoReadyState) {
          playHtml5();
        } else {
          self._playLock = true;
          self._state = 'loading';

          var listener = function() {
            self._state = 'loaded';
            
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();

              // If this is a live stream, stop download once the audio is stopped.
              if (sound._node.duration === Infinity) {
                self._clearSound(sound._node);
              }
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded'|| self._playLock) {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          // Cancel active fade and set the volume to the end value.
          if (sound._interval) {
            self._stopFade(sound._id);
          }

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded'|| self._playLock) {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Make sure the to/from/len values are numbers.
      from = Math.min(Math.max(0, parseFloat(from)), 1);
      to = Math.min(Math.max(0, parseFloat(to)), 1);
      len = parseFloat(len);

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
        }
      }

      return self;
    },

    /**
     * Starts the internal interval to fade a sound.
     * @param  {Object} sound Reference to sound to fade.
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id to fade.
     * @param  {Boolean} isGroup   If true, set the volume on the group.
     */
    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
      var self = this;
      var vol = from;
      var diff = to - from;
      var steps = Math.abs(diff / 0.01);
      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
      var lastTick = Date.now();

      // Store the value being faded to.
      sound._fadeTo = to;

      // Update the volume value on each interval tick.
      sound._interval = setInterval(function() {
        // Update the volume based on the time since the last tick.
        var tick = (Date.now() - lastTick) / len;
        lastTick = Date.now();
        vol += diff * tick;

        // Round to within 2 decimal points.
        vol = Math.round(vol * 100) / 100;

        // Make sure the volume is in the right bounds.
        if (diff < 0) {
          vol = Math.max(to, vol);
        } else {
          vol = Math.min(to, vol);
        }

        // Change the volume.
        if (self._webAudio) {
          sound._volume = vol;
        } else {
          self.volume(vol, sound._id, true);
        }

        // Set the group's volume.
        if (isGroup) {
          self._volume = vol;
        }

        // When the fade is complete, stop it and fire event.
        if ((to < from && vol <= to) || (to > from && vol >= to)) {
          clearInterval(sound._interval);
          sound._interval = null;
          sound._fadeTo = null;
          self.volume(to, sound._id);
          self._emit('fade', sound._id);
        }
      }, stepLen);
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self.volume(sound._fadeTo, id);
        sound._fadeTo = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;

              // If playing, restart playback to ensure looping updates.
              if (self.playing(ids[i])) {
                self.pause(ids[i], true);
                self.play(ids[i], true);
              }
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded' || self._playLock) {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            if (self.playing(id[i])) {
              sound._rateSeek = self.seek(id[i]);
              sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            }
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        if (self._sounds.length) {
          id = self._sounds[0]._id;
        }
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else if (self._sounds.length) {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return 0;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (typeof seek === 'number' && (self._state !== 'loaded' || self._playLock)) {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
            sound._node.currentTime = seek;
          }

          // Seek and emit when ready.
          var seekAndEmit = function() {
            // Restart the playback if the sound was playing.
            if (playing) {
              self.play(id, true);
            }

            self._emit('seek', id);
          };

          // Wait for the play lock to be unset before emitting (HTML5 Audio).
          if (playing && !self._webAudio) {
            var emitSeek = function() {
              if (!self._playLock) {
                seekAndEmit();
              } else {
                setTimeout(emitSeek, 0);
              }
            };
            setTimeout(emitSeek, 0);
          } else {
            seekAndEmit();
          }
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i=0; i<self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          self._clearSound(sounds[i]._node);

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
          sounds[i]._node.removeEventListener('ended', sounds[i]._endFn, false);

          // Release the Audio object back to the pool.
          Howler._releaseHtml5Audio(sounds[i]._node);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);
      }

      // Remove the references in the global Howler object.
      var index = Howler._howls.indexOf(self);
      if (index >= 0) {
        Howler._howls.splice(index, 1);
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i=0; i<Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src || self._src.indexOf(Howler._howls[i]._src) >= 0) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i=0; i<events.length; i++) {
          var isId = (id === events[i].id);
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        // Only fire the listener if the correct ID is used.
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      // Pass the event type into load queue so that it can continue stepping.
      self._loadQueue(event);

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function(event) {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // Remove this task if a matching event was passed.
        if (task.event === event) {
          self._queue.shift();
          self._loadQueue();
        }

        // Run the task if no event type is passed.
        if (!event) {
          task.action();
        }
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id, true);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        // Clear the timeout or remove the ended listener.
        if (typeof self._endTimers[id] !== 'function') {
          clearTimeout(self._endTimers[id]);
        } else {
          var sound = self._soundById(id);
          if (sound && sound._node) {
            sound._node.removeEventListener('ended', self._endTimers[id], false);
          }
        }

        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop || 0;
      }
      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function(node) {
      var self = this;
      var isIOS = Howler._navigator && Howler._navigator.vendor.indexOf('Apple') >= 0;

      if (!node.bufferSource) {
        return self;
      }

      if (Howler._scratchBuffer && node.bufferSource) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        if (isIOS) {
          try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
        }
      }
      node.bufferSource = null;

      return self;
    },

    /**
     * Set the source to a 0-second silence to stop any downloading (except in IE).
     * @param  {Object} node Audio node to clear.
     */
    _clearSound: function(node) {
      var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
      if (!checkIE) {
        node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      }
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else if (!Howler.noAudio) {
        // Get an unlocked Audio object from the pool.
        self._node = Howler._obtainHtml5Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Listen for the 'ended' event on the sound to account for edge-case where
        // a finite sound has a duration of Infinity.
        self._endFn = self._endListener.bind(self);
        self._node.addEventListener('ended', self._endFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = parent._preload === true ? 'auto' : parent._preload;
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    },

    /**
     * HTML5 Audio ended listener callback.
     */
    _endListener: function() {
      var self = this;
      var parent = self._parent;

      // Only handle the `ended`` event if the duration is Infinity.
      if (parent._duration === Infinity) {
        // Update the parent duration to match the real audio duration.
        // Round up the duration to account for the lower precision in HTML5 Audio.
        parent._duration = Math.ceil(self._node.duration * 10) / 10;

        // Update the sprite that corresponds to the real duration.
        if (parent._sprite.__default[1] === Infinity) {
          parent._sprite.__default[1] = parent._duration * 1000;
        }

        // Run the regular ended method.
        parent._ended(self);
      }

      // Clear the event listener since the duration is now correct.
      self._node.removeEventListener('ended', self._endFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i=0; i<data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open(self._xhr.method, url, true);
      xhr.withCredentials = self._xhr.withCredentials;
      xhr.responseType = 'arraybuffer';

      // Apply any custom headers to the request.
      if (self._xhr.headers) {
        Object.keys(self._xhr.headers).forEach(function(key) {
          xhr.setRequestHeader(key, self._xhr.headers[key]);
        });
      }

      xhr.onload = function() {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function() {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function(arraybuffer, self) {
    // Fire a load error if something broke.
    var error = function() {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    };

    // Load the sound on success.
    var success = function(buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      } else {
        error();
      }
    };

    // Decode the buffer into an audio source.
    if (typeof Promise !== 'undefined' && Howler.ctx.decodeAudioData.length === 1) {
      Howler.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
    } else {
      Howler.ctx.decodeAudioData(arraybuffer, success, error);
    }
  }

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = {__default: [0, self._duration * 1000]};
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function() {
    // If we have already detected that Web Audio isn't supported, don't run this step again.
    if (!Howler.usingWebAudio) {
      return;
    }

    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch(e) {
      Howler.usingWebAudio = false;
    }

    // If the audio context creation still failed, set using web audio to false.
    if (!Howler.ctx) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : Howler._volume, Howler.ctx.currentTime);
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }

  // Add support for CommonJS libraries such as browserify.
  if (true) {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Add to global in Node.js (for testing, etc).
  if (typeof global !== 'undefined') {
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  } else if (typeof window !== 'undefined') {  // Define globally in case AMD is not available or unused.
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  }
})();


/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.2.4
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup default properties.
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function(pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i=self._howls.length-1; i>=0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function(x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._pos[1] : y;
    z = (typeof z !== 'number') ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];

      if (typeof self.ctx.listener.positionX !== 'undefined') {
        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
      }
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = (typeof y !== 'number') ? or[1] : y;
    z = (typeof z !== 'number') ? or[2] : z;
    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];

      if (typeof self.ctx.listener.forwardX !== 'undefined') {
        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
      }
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = (function(_super) {
    return function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  })(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function(pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              if (typeof sound._panner.positionX !== 'undefined') {
                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
              } else {
                sound._panner.setPosition(pan, 0, 0);
              }
            } else {
              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
   * @param  {Number} x  The x-position of the audio source.
   * @param  {Number} y  The y-position of the audio source.
   * @param  {Number} z  The z-position of the audio source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? 0 : y;
    z = (typeof z !== 'number') ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.positionX !== 'undefined') {
              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(x, y, z);
            }
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._orientation[1] : y;
    z = (typeof z !== 'number') ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.orientationX !== 'undefined') {
              sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(x, y, z);
            }
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      inside of which there will be no volume reduction.
   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
   *                     listener. Can be `linear`, `inverse` or `exponential.
   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
   *                   will not be reduced any further.
   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
   *                   This is simply a variable of the distance model and has a different effect depending on which model
   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
   *                     with `inverse` and `exponential`.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   *
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function() {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          if (!o.pannerAttr) {
            o.pannerAttr = {
              coneInnerAngle: o.coneInnerAngle,
              coneOuterAngle: o.coneOuterAngle,
              coneOuterGain: o.coneOuterGain,
              distanceModel: o.distanceModel,
              maxDistance: o.maxDistance,
              refDistance: o.refDistance,
              rolloffFactor: o.rolloffFactor,
              panningModel: o.panningModel
            };
          }

          self._pannerAttr = {
            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
        };

        // Create a new panner node if one doesn't already exist.
        var panner = sound._panner;
        if (!panner) {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
          panner = sound._panner
        }

        // Update the panner values or create a new panner if none exists.
        panner.coneInnerAngle = pa.coneInnerAngle;
        panner.coneOuterAngle = pa.coneOuterAngle;
        panner.coneOuterGain = pa.coneOuterGain;
        panner.distanceModel = pa.distanceModel;
        panner.maxDistance = pa.maxDistance;
        panner.refDistance = pa.refDistance;
        panner.rolloffFactor = pa.rolloffFactor;
        panner.panningModel = pa.panningModel;
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  })(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      } else if (self._panner) {
        // Disconnect the panner.
        self._panner.disconnect(0);
        self._panner = undefined;
        parent._refreshBuffer(self);
      }

      // Complete resetting of the sound.
      return _super.call(this);
    };
  })(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.panningModel = sound._pannerAttr.panningModel;

      if (typeof sound._panner.positionX !== 'undefined') {
        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      }

      if (typeof sound._panner.orientationX !== 'undefined') {
        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
      }
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id, true);
    }
  };
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 281 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_js__ = __webpack_require__(67);
// Default Export
// ==============
// In this module, we mix our bundled exports into the `_` object and export
// the result. This is analogous to setting `module.exports = _` in CommonJS.
// Hence, this module is also the entry point of our UMD bundle and the package
// entry point for CommonJS and AMD users. In other words, this is (the source
// of) the module you are interfacing with when you do any of the following:
//
// ```js
// // CommonJS
// var _ = require('underscore');
//
// // AMD
// define(['underscore'], function(_) {...});
//
// // UMD in the browser
// // _ is available as a global variable
// ```



// Add all of the Underscore functions to the wrapper object.
var _ = Object(__WEBPACK_IMPORTED_MODULE_0__index_js__["mixin"])(__WEBPACK_IMPORTED_MODULE_0__index_js__);
// Legacy Node.js API.
_._ = _;
// Export the Underscore API.
/* harmony default export */ __webpack_exports__["a"] = (_);


/***/ }),
/* 282 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isNull;
// Is a given value equal to null?
function isNull(obj) {
  return obj === null;
}


/***/ }),
/* 283 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isElement;
// Is a given value a DOM element?
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}


/***/ }),
/* 284 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Date'));


/***/ }),
/* 285 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('RegExp'));


/***/ }),
/* 286 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Error'));


/***/ }),
/* 287 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Object'));


/***/ }),
/* 288 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isFinite;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isSymbol_js__ = __webpack_require__(116);



// Is a given object a finite number?
function isFinite(obj) {
  return !Object(__WEBPACK_IMPORTED_MODULE_1__isSymbol_js__["a" /* default */])(obj) && Object(__WEBPACK_IMPORTED_MODULE_0__setup_js__["f" /* _isFinite */])(obj) && !isNaN(parseFloat(obj));
}


/***/ }),
/* 289 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createSizePropertyCheck_js__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getByteLength_js__ = __webpack_require__(71);



// Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createSizePropertyCheck_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__getByteLength_js__["a" /* default */]));


/***/ }),
/* 290 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isEmpty;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArray_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isString_js__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isArguments_js__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__keys_js__ = __webpack_require__(8);






// Is a given array, string, or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
  if (obj == null) return true;
  // Skip the more expensive `toString`-based type checks if `obj` has no
  // `.length`.
  var length = Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(obj);
  if (typeof length == 'number' && (
    Object(__WEBPACK_IMPORTED_MODULE_1__isArray_js__["a" /* default */])(obj) || Object(__WEBPACK_IMPORTED_MODULE_2__isString_js__["a" /* default */])(obj) || Object(__WEBPACK_IMPORTED_MODULE_3__isArguments_js__["a" /* default */])(obj)
  )) return length === 0;
  return Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_4__keys_js__["a" /* default */])(obj)) === 0;
}


/***/ }),
/* 291 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isEqual;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getByteLength_js__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__isTypedArray_js__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__stringTagBug_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__isDataView_js__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__keys_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__has_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__toBufferView_js__ = __webpack_require__(292);











// We use this string twice, so give it a name for minification.
var tagDataView = '[object DataView]';

// Internal recursive comparison function for `_.isEqual`.
function eq(a, b, aStack, bStack) {
  // Identical objects are equal. `0 === -0`, but they aren't identical.
  // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  // `null` or `undefined` only equal to itself (strict comparison).
  if (a == null || b == null) return false;
  // `NaN`s are equivalent, but non-reflexive.
  if (a !== a) return b !== b;
  // Exhaust primitive checks
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
  return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `_.isEqual`.
function deepEq(a, b, aStack, bStack) {
  // Unwrap any wrapped objects.
  if (a instanceof __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */]) a = a._wrapped;
  if (b instanceof __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */]) b = b._wrapped;
  // Compare `[[Class]]` names.
  var className = __WEBPACK_IMPORTED_MODULE_1__setup_js__["t" /* toString */].call(a);
  if (className !== __WEBPACK_IMPORTED_MODULE_1__setup_js__["t" /* toString */].call(b)) return false;
  // Work around a bug in IE 10 - Edge 13.
  if (__WEBPACK_IMPORTED_MODULE_5__stringTagBug_js__["a" /* hasDataViewBug */] && className == '[object Object]' && Object(__WEBPACK_IMPORTED_MODULE_6__isDataView_js__["a" /* default */])(a)) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_6__isDataView_js__["a" /* default */])(b)) return false;
    className = tagDataView;
  }
  switch (className) {
    // These types are compared by value.
    case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case '[object String]':
      // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
      // equivalent to `new String("5")`.
      return '' + a === '' + b;
    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive.
      // Object(NaN) is equivalent to NaN.
      if (+a !== +a) return +b !== +b;
      // An `egal` comparison is performed for other numeric values.
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values. Dates are compared by their
      // millisecond representations. Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a === +b;
    case '[object Symbol]':
      return __WEBPACK_IMPORTED_MODULE_1__setup_js__["d" /* SymbolProto */].valueOf.call(a) === __WEBPACK_IMPORTED_MODULE_1__setup_js__["d" /* SymbolProto */].valueOf.call(b);
    case '[object ArrayBuffer]':
    case tagDataView:
      // Coerce to typed array so we can fall through.
      return deepEq(Object(__WEBPACK_IMPORTED_MODULE_9__toBufferView_js__["a" /* default */])(a), Object(__WEBPACK_IMPORTED_MODULE_9__toBufferView_js__["a" /* default */])(b), aStack, bStack);
  }

  var areArrays = className === '[object Array]';
  if (!areArrays && Object(__WEBPACK_IMPORTED_MODULE_3__isTypedArray_js__["a" /* default */])(a)) {
      var byteLength = Object(__WEBPACK_IMPORTED_MODULE_2__getByteLength_js__["a" /* default */])(a);
      if (byteLength !== Object(__WEBPACK_IMPORTED_MODULE_2__getByteLength_js__["a" /* default */])(b)) return false;
      if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
      areArrays = true;
  }
  if (!areArrays) {
    if (typeof a != 'object' || typeof b != 'object') return false;

    // Objects with different constructors are not equivalent, but `Object`s or `Array`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(Object(__WEBPACK_IMPORTED_MODULE_4__isFunction_js__["a" /* default */])(aCtor) && aCtor instanceof aCtor &&
                             Object(__WEBPACK_IMPORTED_MODULE_4__isFunction_js__["a" /* default */])(bCtor) && bCtor instanceof bCtor)
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
  }
  // Assume equality for cyclic structures. The algorithm for detecting cyclic
  // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

  // Initializing stack of traversed objects.
  // It's done here since we only need them for objects and arrays comparison.
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    // Linear search. Performance is inversely proportional to the number of
    // unique nested structures.
    if (aStack[length] === a) return bStack[length] === b;
  }

  // Add the first object to the stack of traversed objects.
  aStack.push(a);
  bStack.push(b);

  // Recursively compare objects and arrays.
  if (areArrays) {
    // Compare array lengths to determine if a deep comparison is necessary.
    length = a.length;
    if (length !== b.length) return false;
    // Deep compare the contents, ignoring non-numeric properties.
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    // Deep compare objects.
    var _keys = Object(__WEBPACK_IMPORTED_MODULE_7__keys_js__["a" /* default */])(a), key;
    length = _keys.length;
    // Ensure that both objects contain the same number of properties before comparing deep equality.
    if (Object(__WEBPACK_IMPORTED_MODULE_7__keys_js__["a" /* default */])(b).length !== length) return false;
    while (length--) {
      // Deep compare each member
      key = _keys[length];
      if (!(Object(__WEBPACK_IMPORTED_MODULE_8__has_js__["a" /* default */])(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  // Remove the first object from the stack of traversed objects.
  aStack.pop();
  bStack.pop();
  return true;
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
  return eq(a, b);
}


/***/ }),
/* 292 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toBufferView;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getByteLength_js__ = __webpack_require__(71);


// Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to a new view, reusing the buffer.
function toBufferView(bufferSource) {
  return new Uint8Array(
    bufferSource.buffer || bufferSource,
    bufferSource.byteOffset || 0,
    Object(__WEBPACK_IMPORTED_MODULE_0__getByteLength_js__["a" /* default */])(bufferSource)
  );
}


/***/ }),
/* 293 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stringTagBug_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__ = __webpack_require__(72);




/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__stringTagBug_js__["b" /* isIE11 */] ? Object(__WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__["a" /* ie11fingerprint */])(__WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__["b" /* mapMethods */]) : Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Map'));


/***/ }),
/* 294 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stringTagBug_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__ = __webpack_require__(72);




/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__stringTagBug_js__["b" /* isIE11 */] ? Object(__WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__["a" /* ie11fingerprint */])(__WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__["d" /* weakMapMethods */]) : Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('WeakMap'));


/***/ }),
/* 295 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stringTagBug_js__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__ = __webpack_require__(72);




/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_1__stringTagBug_js__["b" /* isIE11 */] ? Object(__WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__["a" /* ie11fingerprint */])(__WEBPACK_IMPORTED_MODULE_2__methodFingerprint_js__["c" /* setMethods */]) : Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('Set'));


/***/ }),
/* 296 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__tagTester_js__ = __webpack_require__(9);


/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__tagTester_js__["a" /* default */])('WeakSet'));


/***/ }),
/* 297 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = pairs;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__keys_js__ = __webpack_require__(8);


// Convert an object into a list of `[key, value]` pairs.
// The opposite of `_.object` with one argument.
function pairs(obj) {
  var _keys = Object(__WEBPACK_IMPORTED_MODULE_0__keys_js__["a" /* default */])(obj);
  var length = _keys.length;
  var pairs = Array(length);
  for (var i = 0; i < length; i++) {
    pairs[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs;
}


/***/ }),
/* 298 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = create;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseCreate_js__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__extendOwn_js__ = __webpack_require__(74);



// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the
// created object.
function create(prototype, props) {
  var result = Object(__WEBPACK_IMPORTED_MODULE_0__baseCreate_js__["a" /* default */])(prototype);
  if (props) Object(__WEBPACK_IMPORTED_MODULE_1__extendOwn_js__["a" /* default */])(result, props);
  return result;
}


/***/ }),
/* 299 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = clone;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isObject_js__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArray_js__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__extend_js__ = __webpack_require__(127);




// Create a (shallow-cloned) duplicate of an object.
function clone(obj) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0__isObject_js__["a" /* default */])(obj)) return obj;
  return Object(__WEBPACK_IMPORTED_MODULE_1__isArray_js__["a" /* default */])(obj) ? obj.slice() : Object(__WEBPACK_IMPORTED_MODULE_2__extend_js__["a" /* default */])({}, obj);
}


/***/ }),
/* 300 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = tap;
// Invokes `interceptor` with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain, in
// order to perform operations on intermediate results within the chain.
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}


/***/ }),
/* 301 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = has;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__has_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__toPath_js__ = __webpack_require__(43);



// Shortcut function for checking if an object has a given property directly on
// itself (in other words, not on a prototype). Unlike the internal `has`
// function, this public version can also traverse nested properties.
function has(obj, path) {
  path = Object(__WEBPACK_IMPORTED_MODULE_1__toPath_js__["a" /* default */])(path);
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!Object(__WEBPACK_IMPORTED_MODULE_0__has_js__["a" /* default */])(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}


/***/ }),
/* 302 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = mapObject;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__keys_js__ = __webpack_require__(8);



// Returns the results of applying the `iteratee` to each element of `obj`.
// In contrast to `_.map` it returns an object.
function mapObject(obj, iteratee, context) {
  iteratee = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(iteratee, context);
  var _keys = Object(__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* default */])(obj),
      length = _keys.length,
      results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}


/***/ }),
/* 303 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = propertyOf;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__noop_js__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__get_js__ = __webpack_require__(130);



// Generates a function for a given object that returns a given property.
function propertyOf(obj) {
  if (obj == null) return __WEBPACK_IMPORTED_MODULE_0__noop_js__["a" /* default */];
  return function(path) {
    return Object(__WEBPACK_IMPORTED_MODULE_1__get_js__["a" /* default */])(obj, path);
  };
}


/***/ }),
/* 304 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = times;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__optimizeCb_js__ = __webpack_require__(44);


// Run a function **n** times.
function times(n, iteratee, context) {
  var accum = Array(Math.max(0, n));
  iteratee = Object(__WEBPACK_IMPORTED_MODULE_0__optimizeCb_js__["a" /* default */])(iteratee, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee(i);
  return accum;
}


/***/ }),
/* 305 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createEscaper_js__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__escapeMap_js__ = __webpack_require__(137);



// Function for escaping strings to HTML interpolation.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createEscaper_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__escapeMap_js__["a" /* default */]));


/***/ }),
/* 306 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createEscaper_js__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unescapeMap_js__ = __webpack_require__(307);



// Function for unescaping strings from HTML interpolation.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createEscaper_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__unescapeMap_js__["a" /* default */]));


/***/ }),
/* 307 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__invert_js__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__escapeMap_js__ = __webpack_require__(137);



// Internal list of HTML entities for unescaping.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__invert_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__escapeMap_js__["a" /* default */]));


/***/ }),
/* 308 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = template;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__defaults_js__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__templateSettings_js__ = __webpack_require__(138);




// When customizing `_.templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var noMatch = /(.)^/;

// Certain characters need to be escaped so that they can be put into a
// string literal.
var escapes = {
  "'": "'",
  '\\': '\\',
  '\r': 'r',
  '\n': 'n',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};

var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

function escapeChar(match) {
  return '\\' + escapes[match];
}

// In order to prevent third-party code injection through
// `_.templateSettings.variable`, we test it against the following regular
// expression. It is intentionally a bit more liberal than just matching valid
// identifiers, but still prevents possible loopholes through defaults or
// destructuring assignment.
var bareIdentifier = /^\s*(\w|\$)+\s*$/;

// JavaScript micro-templating, similar to John Resig's implementation.
// Underscore templating handles arbitrary delimiters, preserves whitespace,
// and correctly escapes quotes within interpolated code.
// NB: `oldSettings` only exists for backwards compatibility.
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = Object(__WEBPACK_IMPORTED_MODULE_0__defaults_js__["a" /* default */])({}, settings, __WEBPACK_IMPORTED_MODULE_1__underscore_js__["a" /* default */].templateSettings);

  // Combine delimiters into one regular expression via alternation.
  var matcher = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join('|') + '|$', 'g');

  // Compile the template source, escaping string literals appropriately.
  var index = 0;
  var source = "__p+='";
  text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;

    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }

    // Adobe VMs need the match returned to produce the correct offset.
    return match;
  });
  source += "';\n";

  var argument = settings.variable;
  if (argument) {
    // Insure against third-party code injection. (CVE-2021-23358)
    if (!bareIdentifier.test(argument)) throw new Error(
      'variable is not a bare identifier: ' + argument
    );
  } else {
    // If a variable is not specified, place data values in local scope.
    source = 'with(obj||{}){\n' + source + '}\n';
    argument = 'obj';
  }

  source = "var __t,__p='',__j=Array.prototype.join," +
    "print=function(){__p+=__j.call(arguments,'');};\n" +
    source + 'return __p;\n';

  var render;
  try {
    render = new Function(argument, '_', source);
  } catch (e) {
    e.source = source;
    throw e;
  }

  var template = function(data) {
    return render.call(this, data, __WEBPACK_IMPORTED_MODULE_1__underscore_js__["a" /* default */]);
  };

  // Provide the compiled source as a convenience for precompilation.
  template.source = 'function(' + argument + '){\n' + source + '}';

  return template;
}


/***/ }),
/* 309 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = result;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__toPath_js__ = __webpack_require__(43);



// Traverses the children of `obj` along `path`. If a child is a function, it
// is invoked with its parent as context. Returns the value of the final
// child, or `fallback` if any child is undefined.
function result(obj, path, fallback) {
  path = Object(__WEBPACK_IMPORTED_MODULE_1__toPath_js__["a" /* default */])(path);
  var length = path.length;
  if (!length) {
    return Object(__WEBPACK_IMPORTED_MODULE_0__isFunction_js__["a" /* default */])(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length; // Ensure we don't continue iterating.
    }
    obj = Object(__WEBPACK_IMPORTED_MODULE_0__isFunction_js__["a" /* default */])(prop) ? prop.call(obj) : prop;
  }
  return obj;
}


/***/ }),
/* 310 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = uniqueId;
// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var idCounter = 0;
function uniqueId(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
}


/***/ }),
/* 311 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = chain;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);


// Start chaining a wrapped Underscore object.
function chain(obj) {
  var instance = Object(__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */])(obj);
  instance._chain = true;
  return instance;
}


/***/ }),
/* 312 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__flatten_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bind_js__ = __webpack_require__(140);




// Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(obj, keys) {
  keys = Object(__WEBPACK_IMPORTED_MODULE_1__flatten_js__["a" /* default */])(keys, false, false);
  var index = keys.length;
  if (index < 1) throw new Error('bindAll must be passed function names');
  while (index--) {
    var key = keys[index];
    obj[key] = Object(__WEBPACK_IMPORTED_MODULE_2__bind_js__["a" /* default */])(obj[key], obj);
  }
  return obj;
}));


/***/ }),
/* 313 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = memoize;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__has_js__ = __webpack_require__(25);


// Memoize an expensive function by storing its results.
function memoize(func, hasher) {
  var memoize = function(key) {
    var cache = memoize.cache;
    var address = '' + (hasher ? hasher.apply(this, arguments) : key);
    if (!Object(__WEBPACK_IMPORTED_MODULE_0__has_js__["a" /* default */])(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize.cache = {};
  return memoize;
}


/***/ }),
/* 314 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partial_js__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__delay_js__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__underscore_js__ = __webpack_require__(15);




// Defers a function, scheduling it to run after the current call stack has
// cleared.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__partial_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__delay_js__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__underscore_js__["a" /* default */], 1));


/***/ }),
/* 315 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = throttle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__now_js__ = __webpack_require__(78);


// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : Object(__WEBPACK_IMPORTED_MODULE_0__now_js__["a" /* default */])();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var _now = Object(__WEBPACK_IMPORTED_MODULE_0__now_js__["a" /* default */])();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}


/***/ }),
/* 316 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = debounce;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__now_js__ = __webpack_require__(78);



// When a sequence of calls of the returned function ends, the argument
// function is triggered. The end of a sequence is defined by the `wait`
// parameter. If `immediate` is passed, the argument function will be
// triggered at the beginning of the sequence instead of at the end.
function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;

  var later = function() {
    var passed = Object(__WEBPACK_IMPORTED_MODULE_1__now_js__["a" /* default */])() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null;
    }
  };

  var debounced = Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(_args) {
    context = this;
    args = _args;
    previous = Object(__WEBPACK_IMPORTED_MODULE_1__now_js__["a" /* default */])();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}


/***/ }),
/* 317 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = wrap;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partial_js__ = __webpack_require__(51);


// Returns the first function passed as an argument to the second,
// allowing you to adjust arguments, run code before and after, and
// conditionally execute the original function.
function wrap(func, wrapper) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__partial_js__["a" /* default */])(wrapper, func);
}


/***/ }),
/* 318 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
// Returns a function that is the composition of a list of functions, each
// consuming the return value of the function that follows.
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}


/***/ }),
/* 319 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = after;
// Returns a function that will only be executed on and after the Nth call.
function after(times, func) {
  return function() {
    if (--times < 1) {
      return func.apply(this, arguments);
    }
  };
}


/***/ }),
/* 320 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__partial_js__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__before_js__ = __webpack_require__(142);



// Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__partial_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__before_js__["a" /* default */], 2));


/***/ }),
/* 321 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__findLastIndex_js__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__createIndexFinder_js__ = __webpack_require__(148);



// Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1__createIndexFinder_js__["a" /* default */])(-1, __WEBPACK_IMPORTED_MODULE_0__findLastIndex_js__["a" /* default */]));


/***/ }),
/* 322 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = findWhere;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__find_js__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__matcher_js__ = __webpack_require__(50);



// Convenience version of a common use case of `_.find`: getting the first
// object containing specific `key:value` pairs.
function findWhere(obj, attrs) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__find_js__["a" /* default */])(obj, Object(__WEBPACK_IMPORTED_MODULE_1__matcher_js__["a" /* default */])(attrs));
}


/***/ }),
/* 323 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createReduce_js__ = __webpack_require__(150);


// **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createReduce_js__["a" /* default */])(1));


/***/ }),
/* 324 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createReduce_js__ = __webpack_require__(150);


// The right-associative version of reduce, also known as `foldr`.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__createReduce_js__["a" /* default */])(-1));


/***/ }),
/* 325 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = reject;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filter_js__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__negate_js__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cb_js__ = __webpack_require__(10);




// Return all the elements for which a truth test fails.
function reject(obj, predicate, context) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__filter_js__["a" /* default */])(obj, Object(__WEBPACK_IMPORTED_MODULE_1__negate_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_2__cb_js__["a" /* default */])(predicate)), context);
}


/***/ }),
/* 326 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = every;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keys_js__ = __webpack_require__(8);




// Determine whether all of the elements pass a truth test.
function every(obj, predicate, context) {
  predicate = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(predicate, context);
  var _keys = !Object(__WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__["a" /* default */])(obj) && Object(__WEBPACK_IMPORTED_MODULE_2__keys_js__["a" /* default */])(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}


/***/ }),
/* 327 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = some;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__keys_js__ = __webpack_require__(8);




// Determine if at least one element in the object passes a truth test.
function some(obj, predicate, context) {
  predicate = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(predicate, context);
  var _keys = !Object(__WEBPACK_IMPORTED_MODULE_1__isArrayLike_js__["a" /* default */])(obj) && Object(__WEBPACK_IMPORTED_MODULE_2__keys_js__["a" /* default */])(obj),
      length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}


/***/ }),
/* 328 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__deepGet_js__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__toPath_js__ = __webpack_require__(43);






// Invoke a method (with arguments) on every item in a collection.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(obj, path, args) {
  var contextPath, func;
  if (Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(path)) {
    func = path;
  } else {
    path = Object(__WEBPACK_IMPORTED_MODULE_4__toPath_js__["a" /* default */])(path);
    contextPath = path.slice(0, -1);
    path = path[path.length - 1];
  }
  return Object(__WEBPACK_IMPORTED_MODULE_2__map_js__["a" /* default */])(obj, function(context) {
    var method = func;
    if (!method) {
      if (contextPath && contextPath.length) {
        context = Object(__WEBPACK_IMPORTED_MODULE_3__deepGet_js__["a" /* default */])(context, contextPath);
      }
      if (context == null) return void 0;
      method = context[path];
    }
    return method == null ? method : method.apply(context, args);
  });
}));


/***/ }),
/* 329 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = where;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filter_js__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__matcher_js__ = __webpack_require__(50);



// Convenience version of a common use case of `_.filter`: selecting only
// objects containing specific `key:value` pairs.
function where(obj, attrs) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__filter_js__["a" /* default */])(obj, Object(__WEBPACK_IMPORTED_MODULE_1__matcher_js__["a" /* default */])(attrs));
}


/***/ }),
/* 330 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = min;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__values_js__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__each_js__ = __webpack_require__(30);





// Return the minimum element (or element-based computation).
function min(obj, iteratee, context) {
  var result = Infinity, lastComputed = Infinity,
      value, computed;
  if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
    obj = Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(obj) ? obj : Object(__WEBPACK_IMPORTED_MODULE_1__values_js__["a" /* default */])(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result) {
        result = value;
      }
    }
  } else {
    iteratee = Object(__WEBPACK_IMPORTED_MODULE_2__cb_js__["a" /* default */])(iteratee, context);
    Object(__WEBPACK_IMPORTED_MODULE_3__each_js__["a" /* default */])(obj, function(v, index, list) {
      computed = iteratee(v, index, list);
      if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
        result = v;
        lastComputed = computed;
      }
    });
  }
  return result;
}


/***/ }),
/* 331 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = shuffle;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sample_js__ = __webpack_require__(152);


// Shuffle a collection.
function shuffle(obj) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__sample_js__["a" /* default */])(obj, Infinity);
}


/***/ }),
/* 332 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = sortBy;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cb_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pluck_js__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_js__ = __webpack_require__(36);




// Sort the object's values by a criterion produced by an iteratee.
function sortBy(obj, iteratee, context) {
  var index = 0;
  iteratee = Object(__WEBPACK_IMPORTED_MODULE_0__cb_js__["a" /* default */])(iteratee, context);
  return Object(__WEBPACK_IMPORTED_MODULE_1__pluck_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_2__map_js__["a" /* default */])(obj, function(value, key, list) {
    return {
      value: value,
      index: index++,
      criteria: iteratee(value, key, list)
    };
  }).sort(function(left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), 'value');
}


/***/ }),
/* 333 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__group_js__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__has_js__ = __webpack_require__(25);



// Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__group_js__["a" /* default */])(function(result, value, key) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__has_js__["a" /* default */])(result, key)) result[key].push(value); else result[key] = [value];
}));


/***/ }),
/* 334 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__group_js__ = __webpack_require__(52);


// Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__group_js__["a" /* default */])(function(result, value, key) {
  result[key] = value;
}));


/***/ }),
/* 335 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__group_js__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__has_js__ = __webpack_require__(25);



// Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__group_js__["a" /* default */])(function(result, value, key) {
  if (Object(__WEBPACK_IMPORTED_MODULE_1__has_js__["a" /* default */])(result, key)) result[key]++; else result[key] = 1;
}));


/***/ }),
/* 336 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__group_js__ = __webpack_require__(52);


// Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__group_js__["a" /* default */])(function(result, value, pass) {
  result[pass ? 0 : 1].push(value);
}, true));


/***/ }),
/* 337 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = size;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__keys_js__ = __webpack_require__(8);



// Return the number of elements in a collection.
function size(obj) {
  if (obj == null) return 0;
  return Object(__WEBPACK_IMPORTED_MODULE_0__isArrayLike_js__["a" /* default */])(obj) ? obj.length : Object(__WEBPACK_IMPORTED_MODULE_1__keys_js__["a" /* default */])(obj).length;
}


/***/ }),
/* 338 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = keyInObj;
// Internal `_.pick` helper function to determine whether `key` is an enumerable
// property name of `obj`.
function keyInObj(value, key, obj) {
  return key in obj;
}


/***/ }),
/* 339 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__isFunction_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__negate_js__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__map_js__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__flatten_js__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__contains_js__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pick_js__ = __webpack_require__(154);








// Return a copy of the object without the disallowed properties.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(obj, keys) {
  var iteratee = keys[0], context;
  if (Object(__WEBPACK_IMPORTED_MODULE_1__isFunction_js__["a" /* default */])(iteratee)) {
    iteratee = Object(__WEBPACK_IMPORTED_MODULE_2__negate_js__["a" /* default */])(iteratee);
    if (keys.length > 1) context = keys[1];
  } else {
    keys = Object(__WEBPACK_IMPORTED_MODULE_3__map_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_4__flatten_js__["a" /* default */])(keys, false, false), String);
    iteratee = function(value, key) {
      return !Object(__WEBPACK_IMPORTED_MODULE_5__contains_js__["a" /* default */])(keys, key);
    };
  }
  return Object(__WEBPACK_IMPORTED_MODULE_6__pick_js__["a" /* default */])(obj, iteratee, context);
}));


/***/ }),
/* 340 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = first;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__initial_js__ = __webpack_require__(155);


// Get the first element of an array. Passing **n** will return the first N
// values in the array. The **guard** check allows it to work with `_.map`.
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return Object(__WEBPACK_IMPORTED_MODULE_0__initial_js__["a" /* default */])(array, array.length - n);
}


/***/ }),
/* 341 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = last;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__rest_js__ = __webpack_require__(156);


// Get the last element of an array. Passing **n** will return the last N
// values in the array.
function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return Object(__WEBPACK_IMPORTED_MODULE_0__rest_js__["a" /* default */])(array, Math.max(0, array.length - n));
}


/***/ }),
/* 342 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compact;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filter_js__ = __webpack_require__(45);


// Trim out all falsy values from an array.
function compact(array) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__filter_js__["a" /* default */])(array, Boolean);
}


/***/ }),
/* 343 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = flatten;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flatten_js__ = __webpack_require__(35);


// Flatten out an array, either recursively (by default), or up to `depth`.
// Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
function flatten(array, depth) {
  return Object(__WEBPACK_IMPORTED_MODULE_0__flatten_js__["a" /* default */])(array, depth, false);
}


/***/ }),
/* 344 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__difference_js__ = __webpack_require__(157);



// Return a version of the array that does not contain the specified value(s).
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(array, otherArrays) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__difference_js__["a" /* default */])(array, otherArrays);
}));


/***/ }),
/* 345 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__uniq_js__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__flatten_js__ = __webpack_require__(35);




// Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(function(arrays) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__uniq_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_2__flatten_js__["a" /* default */])(arrays, true, true));
}));


/***/ }),
/* 346 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = intersection;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getLength_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__contains_js__ = __webpack_require__(46);



// Produce an array that contains every item shared between all the
// passed-in arrays.
function intersection(array) {
  var result = [];
  var argsLength = arguments.length;
  for (var i = 0, length = Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(array); i < length; i++) {
    var item = array[i];
    if (Object(__WEBPACK_IMPORTED_MODULE_1__contains_js__["a" /* default */])(result, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!Object(__WEBPACK_IMPORTED_MODULE_1__contains_js__["a" /* default */])(arguments[j], item)) break;
    }
    if (j === argsLength) result.push(item);
  }
  return result;
}


/***/ }),
/* 347 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restArguments_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unzip_js__ = __webpack_require__(159);



// Zip together multiple lists into a single array -- elements that share
// an index go together.
/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__restArguments_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1__unzip_js__["a" /* default */]));


/***/ }),
/* 348 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = object;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getLength_js__ = __webpack_require__(18);


// Converts lists into objects. Pass either a single array of `[key, value]`
// pairs, or two parallel arrays of the same length -- one of keys, and one of
// the corresponding values. Passing by pairs is the reverse of `_.pairs`.
function object(list, values) {
  var result = {};
  for (var i = 0, length = Object(__WEBPACK_IMPORTED_MODULE_0__getLength_js__["a" /* default */])(list); i < length; i++) {
    if (values) {
      result[list[i]] = values[i];
    } else {
      result[list[i][0]] = list[i][1];
    }
  }
  return result;
}


/***/ }),
/* 349 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = range;
// Generate an integer Array containing an arithmetic progression. A port of
// the native Python `range()` function. See
// [the Python documentation](https://docs.python.org/library/functions.html#range).
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }

  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range = Array(length);

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start;
  }

  return range;
}


/***/ }),
/* 350 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = chunk;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__setup_js__ = __webpack_require__(4);


// Chunk a single array into multiple arrays, each containing `count` or fewer
// items.
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result = [];
  var i = 0, length = array.length;
  while (i < length) {
    result.push(__WEBPACK_IMPORTED_MODULE_0__setup_js__["q" /* slice */].call(array, i, i += count));
  }
  return result;
}


/***/ }),
/* 351 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = mixin;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__each_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__functions_js__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__chainResult_js__ = __webpack_require__(160);






// Add your own custom functions to the Underscore object.
function mixin(obj) {
  Object(__WEBPACK_IMPORTED_MODULE_1__each_js__["a" /* default */])(Object(__WEBPACK_IMPORTED_MODULE_2__functions_js__["a" /* default */])(obj), function(name) {
    var func = __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */][name] = obj[name];
    __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].prototype[name] = function() {
      var args = [this._wrapped];
      __WEBPACK_IMPORTED_MODULE_3__setup_js__["o" /* push */].apply(args, arguments);
      return Object(__WEBPACK_IMPORTED_MODULE_4__chainResult_js__["a" /* default */])(this, func.apply(__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */], args));
    };
  });
  return __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */];
}


/***/ }),
/* 352 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__underscore_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__each_js__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__setup_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__chainResult_js__ = __webpack_require__(160);





// Add all mutator `Array` functions to the wrapper.
Object(__WEBPACK_IMPORTED_MODULE_1__each_js__["a" /* default */])(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
  var method = __WEBPACK_IMPORTED_MODULE_2__setup_js__["a" /* ArrayProto */][name];
  __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) {
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) {
        delete obj[0];
      }
    }
    return Object(__WEBPACK_IMPORTED_MODULE_3__chainResult_js__["a" /* default */])(this, obj);
  };
});

// Add all accessor `Array` functions to the wrapper.
Object(__WEBPACK_IMPORTED_MODULE_1__each_js__["a" /* default */])(['concat', 'join', 'slice'], function(name) {
  var method = __WEBPACK_IMPORTED_MODULE_2__setup_js__["a" /* ArrayProto */][name];
  __WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */].prototype[name] = function() {
    var obj = this._wrapped;
    if (obj != null) obj = method.apply(obj, arguments);
    return Object(__WEBPACK_IMPORTED_MODULE_3__chainResult_js__["a" /* default */])(this, obj);
  };
});

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0__underscore_js__["a" /* default */]);


/***/ }),
/* 353 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.i18n = void 0;
var _index = __webpack_require__(5);
var i18n = exports.i18n = function () {
  var i18nLang = 'en';
  var i18nDict = {
    /* eslint-disable max-len */
    'en': {
      'G+_skincollected_description': 'I just opened a mystery potion in Agar.io and won amazing rewards. Come and play to win unique mystery skins!',
      'G+_skinunlocked_description': 'I just unlocked a mystery skin in Agar.io... %skin%! Come and play to win unique mystery skins!',
      'G+_skinunlockedmultiple_description': 'I just unlocked mystery skins in Agar.io! Come and play to win unique mystery skins!',
      'G+_skinupgraded_description': 'I just upgraded a mystery skin in Agar.io! Come and play to win unique mystery skins!',
      'GP_short_description': 'The browser game phenomenon comes to mobile! It\'s a cell-eating frenzy!',
      'Promotional Text': 'Compete against players from around the world in this online multiplayer io game and climb your way to the top of the leaderboards!',
      'Store Description': '* Create your OWN CUSTOM skins\r\n* Play any game mode with your custom made skin',
      'Store_Keywords': 'best, games, game, fun, apps, top, cells, cool, online, multiplayer, agario, agar, io, skins, balls, dots, dot, mmo',
      'Subtitle': 'Play the online phenomenon!',
      'UA_button': 'Download Now!',
      'account_upgrade_reward_button': 'Collect Now!',
      'account_upgrade_reward_subtitle': 'Take some FREE prizes!',
      'account_upgrade_reward_title': 'Account upgraded!',
      'alert_facebook_password_changed_android': 'Your Facebook password was changed',
      'another_potion_brewing': 'Another potion is brewing',
      'battle_message_area_goto': 'Go to safe area!',
      'battle_message_area_shrink': 'Safe area shrinking in %t',
      'battle_message_players_alive': 'Players Alive: ',
      'battle_message_players_ready': 'Players Ready: ',
      'battle_message_starting': 'Battle starting in: %t',
      'battle_message_survive': 'Stay inside the safe area and survive as long as you can!',
      'battle_message_survive_short': 'Survive!',
      'battle_message_waiting': 'Waiting for players...',
      'battle_results_empty': 'Better luck next time!',
      'battle_results_kills': 'Players eaten',
      'battle_results_mass': 'Highest mass',
      'battle_results_position': 'Final Position:',
      'battle_results_spectate': 'Spectate',
      'battle_results_title': 'Battle Results',
      'battle_results_won': 'Congratulations! You won!',
      'boost_1_hour': '1 hour',
      'boost_24_hour': '24 hours',
      'boost_activation_error': 'Boost unsuccessful, please try again.',
      'button_label_leave': 'Leave',
      'coins_product_description': '%i Coins',
      'connect_store_error_text': 'Cannot connect to the store',
      'connect_store_error_title': 'Connection Error',
      'contact_support_button': 'Contact',
      'contact_support_description': 'Contact Support',
      'continue_ad_limit_mass': 'Watch a short video to continue playing with %i mass!',
      'continue_ad_same_mass': 'Watch a short video to continue playing and keep your mass!',
      'continue_button': 'Continue',
      'continue_coins_ad_limit_mass': 'Watch a short video or pay coins to continue playing with %i mass!',
      'continue_coins_ad_same_mass': 'Watch a short video or pay coins to continue playing and keep your mass!',
      'continue_coins_limit_mass': 'Pay coins to continue playing and keep %i mass!',
      'continue_coins_same_mass': 'Pay some coins to continue playing and keep your mass!',
      'continue_free_limit_mass': 'Keep %i mass and return to the arena!',
      'continue_free_same_mass': 'Keep your mass and return to the arena!',
      'continue_title': 'Continue playing?',
      'country_leaderboard_help_title': 'Country Leaderboard',
      'country_leaderboard_notification_body': '~name~; just passed you in the Country Leaderboard on Agar.io!',
      'create_skin_error': 'There was a problem creating your skin.\\nTry again later!',
      'create_skin_insufficient_funds': 'You already claimed your free custom skin.',
      'create_skin_timeout': 'Your skin is being processed.',
      'custom_skin_name_default': 'My Skin',
      'daily_quests_classic_match': 'Classic Match',
      'daily_quests_ffa_match': 'FFA Match',
      'daily_quests_rush_match': 'Rush Match',
      'daily_skin_open_shop': 'Open Shop',
      'dna_product_description': '%i DNA',
      'dropdown_arena_full_message': 'The arena you are trying to join is full\\n%@',
      'dropdown_friend_enters_arena_message': '%@ has joined your match!',
      'dropdown_friend_is_online_message': '%@ is online!\\nJoin the match and play together?',
      'dropdown_friend_recently_online_message': '%@ was recently online!',
      'dropdown_join_button': 'Join',
      'dropdown_party_expired_message': 'The party you are trying to join no longer exists\\n%@',
      'dropdown_party_full_message': 'The party you are trying to join is full\\n%@',
      'dropdown_party_incompatible_message': 'Please update to join this party\\n%@',
      'dropdown_party_invalid_message': 'The party you are trying to join is invalid\\n%@',
      'dropdown_party_invite_message': '%@ invited you to a party!\\nJoin and play together?',
      'dropdown_player_joins_party_message': '%@ has joined your party!',
      'dropdown_reconnect_button': 'Transfer',
      'dropdown_retry_button': 'Retry',
      'dropdown_user_enters_match_message': 'You are in a party: %@',
      'enter_game_wait_message': 'Joining arena...',
      'facebook_share_permission_popup_cancel': 'Don\'t Allow',
      'facebook_share_permission_popup_ok': 'OK',
      'facebook_share_permission_popup_text': '%@ would like to post to your friends on your behalf.',
      'facebook_share_permission_popup_title': 'Facebook',
      'fb_battleroyaleresults_description': 'I placed %position%! Can you do better? Come and play!',
      'fb_battleroyaleresults_title': 'I just played Agar.io Battle Royale',
      'fb_countryleaderboard_description': 'Can you do better? Come and play Agar.io!',
      'fb_countryleaderboard_subtitle': 'I finished in %playerPosition%!',
      'fb_countryleaderboard_title': 'I ranked %playerPosition% in my country!',
      'fb_friends_invite_selector_title': 'Let\'s Play Agar.io',
      'fb_friends_invite_selector_message': 'Come play Agar.io',
      'fb_friends_invite_view_description': 'Hey! I challenge you to beat my score in Agar.io! Let\'s play and win some prizes!',
      'fb_friends_invite_view_title': 'Friends Leaderboard',
      'fb_friendsleaderboard_description': 'Can you do better? Come and play!',
      'fb_friendsleaderboard_subtitle': 'I finished %playerPosition% among my friends!',
      'fb_friendsleaderboard_title': 'I ranked %playerPosition% in the weekly leaderboard in Agar.io!',
      'fb_leagueleaderboard_description': 'Can you do better? Come and play!',
      'fb_leagueleaderboard_subtitle': 'I finished in %playerPosition%!',
      'fb_leagueleaderboard_title': 'I ranked %playerPosition% on my league in Agar.io!',
      'fb_leaguepromotion_description': 'Can you do better? Come and play!',
      'fb_leaguepromotion_subtitle': 'I am getting good!',
      'fb_leaguepromotion_title': 'I am now on the %leagueName% in Agar.io!',
      'fb_levelup_description': 'How far can you go? Come and play!',
      'fb_levelup_subtitle': 'I\'m now level %level%!',
      'fb_levelup_title': 'I just levelled up in Agar.io!',
      'fb_matchresults_description': 'Can you do better? Come and play!',
      'fb_matchresults_subtitle': 'I survived %mins%m %secs%s and got a score of %score%',
      'fb_matchresults_title': 'Got a new score in Agar.io',
      'fb_rankup_description': 'Can you do better? Come and play!',
      'fb_rankup_subtitle': 'I am doing great in the weekly leaderboard!',
      'fb_rankup_title': 'I passed %opponentName% in Agar.io!',
      'fb_rushresults_description': 'Can you do better? Come and play!',
      'fb_rushresults_subtitle': 'I ranked %rank% and my mass was %mass%!',
      'fb_rushresults_title': 'I finished Rush mode in Agar.io!',
      'fb_rushwin_description': 'I ranked %rank%!',
      'fb_rushwin_subtitle': 'Have you tried this Rush mode? Come and play!',
      'fb_rushwin_title': 'I finished Rush mode in Agar.io!',
      'fb_skincollected_description': 'Come and play to win unique mystery skins!',
      'fb_skincollected_subtitle': 'I won amazing rewards!',
      'fb_skincollected_title': 'I just opened a mystery potion in Agar.io.',
      'fb_skincreate_description': 'Think you can do better? Come and play!',
      'fb_skincreate_subtitle': 'It looks awesome in-game!',
      'fb_skincreate_title': 'I just created a new skin!',
      'fb_skinpurchase_description': 'Think you look cooler than me? Come and play!',
      'fb_skinpurchase_subtitle': 'It looks great in game.',
      'fb_skinpurchase_title': 'I just got a new skin in Agar.io: %skin%!',
      'fb_skinunlock_description': 'You can get cool skins too! Come and play!',
      'fb_skinunlock_subtitle': 'I\'m now level %level%!',
      'fb_skinunlock_title': 'I just levelled up and won a Veteran skin in Agar.io…%skin%!',
      'fb_skinunlocked_description': 'Come and play to win unique mystery skins!',
      'fb_skinunlocked_subtitle': 'It looks great in game.',
      'fb_skinunlocked_title': 'I just unlocked a mystery skin in Agar.io... %skin%',
      'fb_skinunlockedmultiple_description': 'Come and play to win unique mystery skins!',
      'fb_skinunlockedmultiple_subtitle': 'They look great in game',
      'fb_skinunlockedmultiple_title': 'I just unlocked mystery skins in Agar.io.',
      'fb_skinupgrade_description': 'Come and play to win unique mystery skins!',
      'fb_skinupgraded_subtitle': 'It looks great in game.',
      'fb_skinupgraded_title': 'I just upgraded a mystery skin in Agar.io…%skin%!',
      'fb_worldleaderboard_description': 'Can you do better? Come and play!',
      'fb_worldleaderboard_subtitle': 'I finished %playerPosition% in the world!',
      'fb_worldleaderboard_title': 'I ranked %playerPosition% on the world leaderboard in Agar.io!',
      'feature_crossak_badge_1': 'Play for Free',
      'feature_crossak_badge_2': 'Archery King',
      'feature_crossbasket_badge_1': 'Play for Free',
      'feature_crossbasket_badge_2': 'Basketball Stars',
      'feature_crossbattlebreak_badge': 'Battle Break',
      'feature_crossbow_badge_1': 'Play for Free',
      'feature_crossbow_badge_2': 'Bowmasters',
      'feature_crossbowling_badge_1': 'Play for Free',
      'feature_crossbowling_badge_2': 'Bowling King',
      'feature_crossdiep_badge_1': 'Play for Free',
      'feature_crossdiep_badge_2': 'diep.io',
      'feature_crossflipmaster_badge_1': 'Play for Free',
      'feature_crossflipmaster_badge_2': 'Flip Master',
      'feature_crossflipskater_badge': 'Flip Skater',
      'feature_crossfootballstrike_badge': 'Football Strike',
      'feature_crossgolfbattle_badge': 'Golf Battle',
      'feature_crosshockey_badge_1': 'Play for Free',
      'feature_crosshockey_badge_2': 'Hockey Stars',
      'feature_crosspool_badge': '8 Ball Pool',
      'feature_crosspool_popup_button': 'Play Pool',
      'feature_crosspubg_badge': 'PUBG MOBILE',
      'feature_crosssoccer_badge_1': 'Play for Free',
      'feature_crosssoccer_badge_2': 'Soccer Stars',
      'feature_crosswarwings_badge_1': 'Play for Free',
      'feature_crosswarwings_badge_2': 'War Wings',
      'feature_playforfree_badge': 'Play for Free',
      'feature_veteranskins_popup_button': 'Ok',
      'featured_daily_skins_timer': 'Time Left: %@',
      'filter_search_tag': 'Search...',
      'force_upgrade_pop_up_button_text': 'OK',
      'force_upgrade_pop_up_text': 'You must update the app to be able to play Agar.io',
      'force_upgrade_pop_up_title': 'Update needed',
      'free_coin_number_tag': '%i coins',
      'free_coins': 'Free Coins',
      'free_coins_and_dna_offers': 'Free Coins \\n and DNA',
      'free_coins_incentivise_video': 'Or watch a video and earn %@ Coins!',
      'free_coins_offers': 'Free Coins \\n with offers',
      'free_coins_unavailable': 'Unavailable right now',
      'free_dna_offers': 'Free DNA \\n with offers',
      'free_dna_or_coins_reward_popup_button': 'OK',
      'free_dna_or_coins_reward_popup_description': 'You have been awarded %@. Try another offer to get more rewards.',
      'free_dna_or_coins_reward_popup_title': 'Congratulations!',
      'free_with_more_offers': 'More Free\\nCoin Offers',
      'free_with_offers': 'Free Coins\\nwith Offers',
      'free_with_tapjoy': 'Free Coins with Tapjoy',
      'friend_leaderboard_notification_body': '~name~; just passed you in the Friends Leaderboard! Get back to the Top!',
      'friends_online_channel_title': 'Online Friends',
      'friends_prizes': 'Top Prizes',
      'friends_tab_friends_invite_reward': 'Get %@ for each new friend who joins Agar.io!',
      'friends_tab_no_friends_earned_trophies': 'None of your friends have earned trophies this week! \\n Invite more friends to win Weekly Prizes!',
      'friends_tab_no_friends_play': 'You still have no friends playing Agar.io. \\n Invite someone to win Weekly Prizes!',
      'friends_tab_no_invitable_friends_have_winnings': 'You need at least one Facebook friend who won trophies, to be able to compete in the friends leaderboard.',
      'friends_tab_player_has_no_trophies': 'You haven’t won any trophies this week.\\n Play some matches to win potions with trophies inside!',
      'g_plus_share_stats': 'I survived %@m %@s and got a score of %@ in Agar.io! Can you do better? Come and play!',
      'g_skincreate': 'I just created a new skin. Think you can do better? Come and play!',
      'game_continue_timeout': 'Failed to continue game.',
      'gdpr_ad_consent_confirm': 'Yes, I agree',
      'gdpr_ad_consent_first_text': 'Miniclip S.A. uses targeted advertising in app, sharing certain of your data (including device ID, ad ID, geo-location and information on your interactions) with our partners, so that you can be presented with ads that are relevant for you. You can find out more about these partners and how we use your personal data in our privacy policy. ',
      'gdpr_ad_consent_keep': 'Keep',
      'gdpr_ad_consent_reject': 'No, thank you',
      'gdpr_ad_consent_second_text': 'By consenting to this below you will have an enhanced ad experience. You can revoke this consent at any time within the settings of the app.',
      'gdpr_ad_consent_title': 'Get better ads and AWESOME REWARDS!',
      'gdpr_ad_revoke_first_text_web': 'You have allowed us to share certain data with our partners in order to receive ads that are relevant for you. Would you like to keep this permission? We will still serve advertising, tough it may be less relevant to you.',
      'gdpr_go_to_settings': 'Go to Settings',
      'gdpr_keep_revoke_agree_button': 'Keep this permission',
      'gdpr_keep_revoke_disagree_button': 'Revoke',
      'gdpr_keep_revoke_disagree_explanation': 'I understand that I will still see ads, but they may not be relevant to me',
      'gdpr_keep_revoke_first_text': 'This app uses targeted advertising, sharing the data with our partners, so that the ads presented are relevant for you. By consenting to this you will have an enhanced ad experience. You can revoke this option at any time within the settings of the app. You can find more about these partners and how we use your personal data in the following link:',
      'gdpr_keep_revoke_pp_link': 'Privacy Policy',
      'gdpr_keep_revoke_second_text': 'You have allowed us to share certain data with our partners in order to receive ads that are relevant for you. Would you like to keep this permission? We will still serve advertising, tough it may be less relevant to you.',
      'gdpr_keep_revoke_title': 'Personalize your experience',
      'gdpr_no_ad_consent': 'We\'re sorry...',
      'gdpr_no_ad_consent_text': 'We can\'t provide you with any advertisement. Go to Settings at any time to allow targeted advertisement to win AWESOME REWARDS',
      'gdpr_pp_with_ad_consent_agree_button': 'Yes, I agree',
      'gdpr_pp_with_ad_consent_disagree_button': 'No, thank you',
      'gdpr_pp_with_ad_consent_disagree_explanation': 'I understand that I will still see ads, but they may not be relevant to me',
      'gdpr_pp_with_ad_consent_first_text': 'This app uses targeted advertising, sharing the data with our partners, so that the ads presented are relevant for you. By consenting to this you will have an enhanced ad experience. You can revoke this option at any time within the settings of the app. You can find more about these partners and how we use your personal data in the following link:',
      'gdpr_pp_with_ad_consent_pp_link': 'Privacy Policy',
      'gdpr_pp_with_ad_consent_second_text': 'By agreeing, you confirm you are over the age of 16 and would like a personalized ad experience.',
      'gdpr_pp_with_ad_consent_title': 'Personalize your experience',
      'getting_ahead_brag': 'Brag about it!',
      'getting_ahead_description_a': 'You passed',
      'getting_ahead_description_c': 'on the',
      'getting_ahead_name': 'NAME',
      'getting_ahead_rank': 'RANK',
      'getting_ahead_weekly_leaderboard': 'Weekly Leaderboard',
      'getting_ahead_weekly_winnings': 'WEEKLY WINNINGS',
      'getting_ahead_world_leaderboard': 'World Leaderboard',
      'gg_battleroyaleresults_description': 'I placed %position%! Can you do better? Come and play!',
      'gg_countryleaderboard_description': 'I ranked %playerPosition% in my country! Can you do better? Come and play Agar.io!',
      'gg_friendsleaderboard_description': 'I ranked %playerPosition% among my friends in Agar.io! Can you do better? Come and play!',
      'gg_leagueleaderboard_description': 'I ranked %playerPosition% in my league in Agar.io! Can you do better? Come and play!',
      'gg_leaguepromotion_title': 'I am now on the %leagueName% in Agar.io! Can you do better? Come and play!',
      'gg_rankup_description': 'I passed %opponentName% in Agar.io! Can you do better? Come and play!',
      'gg_worldleaderboard_description': 'I ranked %playerPosition% in the world! Can you do better? Come and play Agar.io!',
      'gift_facebook_popup_request_message': 'Help me get some free coins.',
      'gift_facebook_popup_request_title': 'Request Gifts',
      'gift_facebook_popup_send_message': 'Here\'s some coins come and play with me.',
      'gift_facebook_popup_send_title': 'Send Free Coins',
      'gift_requested_body': '~name~; asked your help to get free coins.',
      'gift_requested_title': 'Request Gifts',
      'gift_sent_body': '~name~; sent you some coins. Claim them NOW!',
      'gift_sent_title': 'Send Free Coins',
      'gifting_channel_title': 'Free Gifts',
      'gifting_unavailable_subtitle': 'Gifting is currently only supported on mobile. \\nComing soon on the Web version!',
      'gplus_rushwin_description': 'I ranked %rank% in Agar.io Rush! Have you tried this game mode? Come and play!',
      'guest_display_name': 'Guest',
      'help_classic_mode_content': 'Eat or get eaten!',
      'iOS_long_description': 'The browser game phenomenon comes to iOS! \r\n\r\nPlay online with players around the world as you try to become the biggest cell of them all!\r\n\r\nControl your tiny cell and eat other players to grow larger! But watch out: players bigger than you will be trying to make you their lunch. Survive and eat long enough to become the biggest cell in the game! \r\n\r\nWith new controls developed especially for touchscreens, agar.io offers the same addictive gameplay that millions have already enjoyed on PC. Play online in free-for-all action and use splitting, shrinking and dodging tactics to catch other players - or avoid them! Use a variety of special secret skins with the right username!\r\n',
      'id_display_label': '(User ID: %@)',
      'ingame_spectate_message': 'Press \'Q\' to change Spectate Mode',
      'invite_accepted_reward_button': 'Invite More Friends',
      'invite_accepted_reward_description': 'Enjoy your free prize!',
      'invite_accepted_reward_dismiss': 'Collect',
      'invite_accepted_reward_subtitle': '%@ just joined Agar.io',
      'invite_accepted_reward_title': 'New Friend is playing',
      'invite_facebook_invite_button': 'Invite',
      'invite_facebook_select_all_toggle': 'Select All',
      'invite_facebook_subtitle': 'Get better prizes if more friends compete!',
      'invite_facebook_title': 'Invite More Friends',
      'invite_friends_button': 'Invite',
      'invite_more_friends_label': 'Invite more friends!',
      'invite_notification_body': '~name~; has invited you for this party: ~party_code~;! Tap here so you can play together now! ',
      'join_notification_body': '~name~; joined your party! Come and play together!',
      'lead_title': 'Leaderboard',
      'leaderboard_friends_help_text_e': 'More friends, better prizes! You can win the top prizes if more than %minFriends% friends compete each week.',
      'leaderboard_friends_prizes_info': 'Win the top prizes if more than 20 friends compete!',
      'leaderboard_guest': 'unnamed',
      'leaderboard_help_text_a': 'Ranking is based on total weekly trophy winnings.',
      'leaderboard_help_text_b': 'Trophies can be found inside Mystery Potions. Collect as many as you can to climb on the leaderboards.',
      'leaderboard_help_text_c': 'At the end of each week, come back to check if you won the prize.',
      'leaderboard_help_text_d': 'You need to open the app to claim your prize - so don’t miss out!',
      'leaderboard_help_text_e': 'More friends, better prizes! You can win the top prizes if more than 20 friends compete each week.',
      'leaderboard_help_text_f': 'At the end of each week, come back to check if you won the prize.',
      'leaderboard_notification_title': 'Weekly Leaderboard',
      'leaderboards_channel_title': 'Leaderboards',
      'league_bat': 'Bat League',
      'league_bear': 'Bear League',
      'league_country': 'Country Leaderboard',
      'league_crocodile': 'Crocodile League',
      'league_fly': 'Fly League',
      'league_fox': 'Fox League',
      'league_friends': 'Friends Leaderboard',
      'league_friends_text': 'Friends',
      'league_hunter': 'Hunter League',
      'league_kraken': 'Kraken League',
      'league_leaderboard_notification_body': '~name~; just passed you in your League Leaderboard on Agar.io!',
      'league_mammoth': 'Mammoth League',
      'league_panther': 'Panther League',
      'league_prizes_label': 'Prizes',
      'league_promotion_inner_title': 'You passed to a new League!',
      'league_promotion_title': 'Congratulations!',
      'league_wasp': 'Wasp League',
      'league_winner_country': 'My Country',
      'league_winner_my_league': 'My League',
      'league_winner_world': 'World',
      'league_world': 'World Leaderboard',
      'leagues_country_tab': 'Country',
      'leagues_ends_in': 'Ends in: %@',
      'leagues_friends_tab': 'Friends',
      'leagues_info_info': 'Info',
      'leagues_info_info_a': 'There are 10 leagues to climb. Your league tier is based on your level at the start of the week.',
      'leagues_info_info_b': 'Level up to climb the tiers and win bigger prizes.',
      'leagues_info_info_c': 'On each league, you are matched with a group of players of similar level',
      'leagues_info_info_d': 'Finish in the top 10 to win amazing prizes.',
      'leagues_info_level': 'Level',
      'leagues_info_overview': 'Overview',
      'leagues_info_results': 'Results',
      'leagues_info_results_a': 'At the end of the week, come back to check if you won a league prize or if you’ve been promoted to the next league.',
      'leagues_info_results_b': 'You need to open the app to claim your prize - so don’t miss out!',
      'leagues_info_rules': 'Rules',
      'leagues_info_rules_a': 'Ranking is based on total weekly trophy winnings.',
      'leagues_info_rules_b': 'Trophies can be found inside Mystery Potions. Collect as many as you can to climb on the leaderboards.',
      'leagues_info_rules_c': 'You move up to the next league by earning XP and leveling up.',
      'leagues_info_rules_d': 'You can only be promoted at the end of the week. Even if you level up during the week, you’ll stay in the same tier until the week comes to an end.',
      'leagues_info_rules_e': 'At the end of the week, come back to check if you won a league prize or if you\'ve been promoted to the next league.',
      'leagues_info_rules_f': 'You need to open the app to claim your prize - so don\'t miss out!',
      'leagues_info_title': 'Leagues Information',
      'leagues_info_top_prize': 'Top Prize',
      'leagues_info_trophies': 'Trophies',
      'leagues_info_trophies_a': 'Trophies can be found inside Mystery Potions. Collect as many as you can to climb on the leaderboards.',
      'leagues_info_trophies_b': 'Play any game mode to collect Mystery Potions.',
      'leagues_last_week_results_button': 'Last Week Results',
      'leagues_more_prizes_button': 'More Prizes',
      'leagues_myleague_tab': 'My League',
      'leagues_no_results_content': 'There are no results available since you did not play last week',
      'leagues_place_tag': 'place',
      'leagues_player_name': 'NAME',
      'leagues_player_rank': 'RANK',
      'leagues_player_weekly_winnings': 'WEEKLY WINNINGS',
      'leagues_please_wait': 'Please wait...',
      'leagues_previous_loading': 'Waiting for results',
      'leagues_previous_results_player_name': 'NAME',
      'leagues_previous_results_player_rank': 'RANK',
      'leagues_previous_results_player_weekly_winnings': 'WEEKLY WINNINGS',
      'leagues_previous_results_won_title': 'You\'ve won:',
      'leagues_top_prizes_title': 'Top prizes:',
      'leagues_web_no_results_content': 'There are no results available since you didn\'t earn trophies last week',
      'leagues_weekly_results': 'Weekly Results',
      'leagues_world_tab': 'World',
      'licenses_font_lato_regular_body': 'Copyright (c) 2014, Lato (http://www.latofonts.com/),\nwith Reserved Font Name Lato.',
      'licenses_font_lato_regular_title': 'Lato Regular Font',
      'licenses_font_open_sans_body': 'Copyright 2010 Ascender Corporation\n\nLicensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.\nYou may obtain a copy of the License at\n    http://www.apache.org/licenses/LICENSE-2.0\n\nUnless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n\nSee the License for the specific language governing permissions and\nlimitations under the License.',
      'licenses_font_open_sans_body_1': 'Copyright 2010 Ascender Corporation\nLicensed under the Apache License, Version 2.0 (the "License");',
      'licenses_font_open_sans_body_2': 'You may not use this file except in compliance with the License.\nYou may obtain a copy of the License at:\nhttp://www.apache.org/licenses/LICENSE-2.0\\n',
      'licenses_font_open_sans_body_3': 'Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
      'licenses_font_open_sans_body_4': 'See the License for the specific language governing permissions and limitations under the License.',
      'licenses_font_open_sans_title': 'Open Sans Font',
      'login_and_play': 'Login and play',
      'login_facebook_tag': 'Login with Facebook',
      'login_google_tag': 'Login with Google Play',
      'main_exit_confirmation': 'Exit the game?',
      'main_exit_confirmation_no': 'No',
      'main_exit_confirmation_yes': 'Yes',
      'mass_boost_2x_1h_tag': '1h Double Mass Boost',
      'mass_boost_2x_24h_tag': '24h Double Mass Boost',
      'mass_boost_3x_1h_tag': '1h Triple Mass Boost',
      'mass_boost_3x_24h_tag': '24h Triple Mass Boost',
      'menu_boost_activation_info': 'Purchase more boosts to use when you like',
      'menu_boost_activation_subtitle': 'Your boost is now active!',
      'menu_change': 'Change',
      'menu_collect_button': 'Collect',
      'menu_connecting': 'Connecting',
      'menu_control_type_corners': 'Corners',
      'menu_control_type_left': 'Left',
      'menu_control_type_right': 'Right',
      'menu_controls': 'Controls',
      'menu_conversion_sprite_line_1': '%i',
      'menu_conversion_sprite_line_2': 'for %i',
      'menu_conversion_sprite_line_3': '?',
      'menu_credits': 'Credits',
      'menu_credits_carebears_body': '©2016 Those Characters From Cleveland, Inc.\\n\nUsed under license by Miniclip.\\n\nAmerican Greetings with rose logo is a trademark of AGC, LLC.',
      'menu_credits_carebears_title': 'Care Bears™ and related trademarks',
      'menu_credits_madballs_body': '©2016 Those Characters From Cleveland, Inc.\\n\r\nUsed under license by Miniclip.\\n\r\nAmerican Greetings with rose logo is a trademark of AGC, LLC.',
      'menu_credits_madballs_title': 'Madballs™ and related trademarks',
      'menu_credits_team': 'Agar.io Team',
      'menu_credits_tech': 'Technology ',
      'menu_credits_thanks': 'Special Thanks',
      'menu_daily_quest_active_loading': 'Loading quest...',
      'menu_daily_quest_active_play_button': 'Play now!',
      'menu_daily_quest_active_quest_title': 'Today’s quest',
      'menu_daily_quest_active_subtitle': 'Complete the quest to get a surprise!',
      'menu_daily_quest_active_timer': 'New quest in: %@',
      'menu_daily_quest_complete_button': 'Open!',
      'menu_daily_quest_complete_subtitle': 'Quest completed!',
      'menu_daily_quest_description_1': 'Don\'t want to wait?',
      'menu_daily_quest_description_2': 'Get a new quest now!',
      'menu_daily_quest_reward_button': 'Next Quest',
      'menu_daily_quest_reward_subtitle': 'You won:',
      'menu_daily_quest_title': 'Daily Quest',
      'menu_daily_quest_waiting_remaining': 'Next quest in: %@',
      'menu_direction_touch_hint_1': 'If ON, your cell will immediately move in the direction where you touched the screen.',
      'menu_direction_touch_hint_2': 'If OFF, you need to drag the finger when touching the screen to move in a new direction.',
      'menu_elections_call_to_action': 'Vote by playing with your favourite candidate skin!',
      'menu_elections_poll_title': 'Who is the most popular US Presidential candidate?',
      'menu_elections_title': 'Election Frenzy',
      'menu_elections_who_you_play': 'Who will you play today?',
      'menu_enter_nickname': 'Nickname',
      'menu_force_update_action': 'Update now!',
      'menu_force_update_action_web': 'Refresh now!',
      'menu_free_coins_collect_later': 'Collect in:',
      'menu_free_with_offers': 'Free Coins\\nwith Offers',
      'menu_gift_center_accept': 'Accept',
      'menu_gift_center_accept_all': 'Accept All',
      'menu_gift_center_accept_return': 'Accept & Return',
      'menu_gift_center_accepted': 'Accepted',
      'menu_gift_center_gift_description': 'Sent %@ Coins',
      'menu_gift_center_inbox': 'Inbox',
      'menu_gift_center_no_gifts_title': 'No Gifts to collect',
      'menu_gift_center_request_description': 'Requested a Free Gift',
      'menu_gift_center_request_gift_message': 'Request Gifts and invite friends to get more Coins!',
      'menu_gift_center_request_gifts': 'Request Gifts',
      'menu_gift_center_send': 'Send',
      'menu_gift_center_send_free_coins': 'Send Free Coins',
      'menu_gift_center_send_gift': 'Send Gift',
      'menu_gift_center_send_gift_message': 'You can send a Free Gift to each of your Facebook friends every day.',
      'menu_gift_center_send_gift_no_friends_description': 'Invite friends to share gifts and win %@ for each friend who joins!',
      'menu_gift_center_send_gift_no_friends_title': 'You don\'t have any friends playing!',
      'menu_gift_center_sent': 'Sent',
      'menu_guest_login_subtitle': 'Login to Play and get:',
      'menu_help_classic_title': 'Classic Mode',
      'menu_help_controls': 'Controls',
      'menu_help_eject_mass': 'Eject Mass',
      'menu_help_premium_potions_footnote': 'Opens immediately',
      'menu_help_premium_potions_innerframe_footnote': 'and more!',
      'menu_help_premium_potions_skin_normal_piece_description': 'x%i Skin\\nPieces',
      'menu_help_premium_potions_skin_special_piece_description': 'At least:\\nx%i Special',
      'menu_help_split': 'Split',
      'menu_help_title': 'Rules',
      'menu_hourly_come_back_in': 'Come back in',
      'menu_hourly_not_ready': 'Come back in %@\\n to receive %i coins',
      'menu_hourly_subtitle_1': 'Welcome back,\\nyou have earned %i coins!',
      'menu_hourly_subtitle_2': 'Come back in one hour to earn more coins.',
      'menu_hourly_title': 'Hourly Bonus',
      'menu_hourly_title_coins': 'Hourly Coins!',
      'menu_hourly_to_earn': 'to earn:',
      'menu_level_up_next_skin': 'Next Skin: Level %@',
      'menu_level_up_reward': 'Reward: %@',
      'menu_level_up_reward_dna': '+ %i',
      'menu_level_up_subtitle': 'You\'ve reached level',
      'menu_level_up_subtitle_skin': 'You\'ve unlocked a Veteran Skin',
      'menu_level_up_title': 'Congratulations!',
      'menu_login': 'Login',
      'menu_login_description': 'Protect your stats, get bonus\\nstarting mass and free coins every hour',
      'menu_login_elsewhere_button': 'OK',
      'menu_login_elsewhere_footer': 'You will now be logged\\noff from this device.',
      'menu_login_elsewhere_header': 'You have logged in on\\nanother device',
      'menu_login_elsewhere_title': 'Disconnected',
      'menu_login_facebook': 'Login with Facebook',
      'menu_login_google': 'Sign in with Google Play',
      'menu_login_guest': 'Play as Guest',
      'menu_logout': 'Logout',
      'menu_main_free_coins': 'Free Coins',
      'menu_main_free_coins_servey': 'Free Coins\\nTake Survey!',
      'menu_main_free_coins_survey': 'Free Coins\\nTake Survey!',
      'menu_main_free_coins_video': 'Free Coins',
      'menu_main_shop': 'Shop',
      'menu_main_skins': 'Skins',
      'menu_manager_facebook_login_error': 'Agar.io is experiencing issues connecting to Facebook.\\nPlease try again later.',
      'menu_manager_facebook_login_failure': 'Agar.io does not have access to Facebook.\\nPlease allow access for your device.',
      'menu_manager_facebook_login_failure_ios6': 'Agar.io does not have access to Facebook.\\nPlease allow access for your device under Settings > Facebook.',
      'menu_match_stats_title': 'Match Results:',
      'menu_missing_conversion_subtitle': 'Buy the missing',
      'menu_missing_conversion_title': 'You need more %@!',
      'menu_more_games': 'More Games',
      'menu_more_information': 'More Information',
      'menu_more_information_privacy_policy': 'Privacy Policy',
      'menu_more_information_terms_conditions': 'Terms and Conditions',
      'menu_mystery_footer': 'Slots are full. Clear a slot to earn more Mystery Potions.',
      'menu_mystery_incentive': 'Play any game mode to collect Potions with amazing rewards inside!',
      'menu_mystery_skin_upgrade_popup_congratulations': 'Congratulations!',
      'menu_mystery_skin_upgrade_popup_congratulations_description': '%@ is now level %i',
      'menu_mystery_skin_upgrade_popup_upgrade': 'Upgrade',
      'menu_mystery_skin_upgrade_popup_upgrade_description': '%@ is ready to upgrade!',
      'menu_mystery_subtitle': 'To win a Potion: stay in Top 40 on the leaderboard (or Top 30 in Rush)',
      'menu_mystery_subtitle_half': 'To win a Potion: stay in Top 40 on the leaderboard (or Top Half in Rush)',
      'menu_mystery_subtitle_half_updated': 'To win a Potion: stay in Top 60 on the leaderboard (or Top Half in Rush)',
      'menu_mystery_title': 'Mystery Potions',
      'menu_network_arenaclosing_warning': 'There are not enough players on this server.\\nThis server will close in: %@:%@',
      'menu_network_problem_text': 'Connection is slow',
      'menu_no': 'No',
      'menu_not_avail_android_subtitle': 'Upgrade account to get all the goods:',
      'menu_not_avail_ios_subtitle': 'Login to Facebook to get all the goods:',
      'menu_not_avail_string1': 'Bonus starting mass!',
      'menu_not_avail_string2': 'Collect free coins every hour!',
      'menu_not_avail_string3': 'Save your Stats!',
      'menu_not_avail_string4': 'Play on multiple devices!',
      'menu_not_avail_title': 'Feature not available for Guests',
      'menu_not_enough_coins_title': 'Not Enough Coins!',
      'menu_not_enough_dna_title': 'Not enough DNA',
      'menu_outbox_agar_friends': 'Agar.io Friends',
      'menu_outbox_all_friends': 'All Friends',
      'menu_outbox_empty_message_request': 'You requested free gifts from all your Friends today.\\nCome back tomorrow',
      'menu_outbox_empty_message_send': 'You sent all your Friends free coins today.\\nCome back tomorrow!',
      'menu_outbox_request': 'Request',
      'menu_outbox_request_title': 'Request Gifts',
      'menu_outbox_select_all': 'Select all',
      'menu_outbox_send': 'Send',
      'menu_outbox_send_title': 'Send Free Coins',
      'menu_pause_text': 'Are you sure that you want to leave?',
      'menu_play': 'Play',
      'menu_potion_awarded_title': 'You won a Mystery potion!',
      'menu_potions_full_text': 'You can only hold 3 Potions at a time.\\nClear a potion slot to earn more.',
      'menu_potions_full_title': 'Potion slots are full',
      'menu_potions_help_section_common': 'Common',
      'menu_potions_help_section_exotic': 'Exotic',
      'menu_potions_help_section_howto_battle_royale': 'Battle Royale:',
      'menu_potions_help_section_howto_button': 'How to get potions',
      'menu_potions_help_section_howto_classic': 'Classic:',
      'menu_potions_help_section_howto_classic_info': 'Stay in top %i for %i seconds',
      'menu_potions_help_section_howto_left_title': 'Get on the leaderboard to win Mystery Potions',
      'menu_potions_help_section_howto_rank_info': 'Rank higher to win rarer potions with better rewards!',
      'menu_potions_help_section_howto_right_title': 'Buy Premium Potions that open immediately',
      'menu_potions_help_section_howto_rush': 'Rush:',
      'menu_potions_help_section_howto_rush_info': 'Finish in top %i',
      'menu_potions_help_section_howto_rush_info_half': 'Finish in top half',
      'menu_potions_help_section_howto_teams': 'Teams:',
      'menu_potions_help_section_howto_teams_context': 'Survive 4 minutes',
      'menu_potions_help_section_mystery_button': 'Mystery Skins',
      'menu_potions_help_section_mystery_unlock': 'Unlock',
      'menu_potions_help_section_mystery_unlock_info': 'Collect skin pieces to unlock\\nMystery Skins!',
      'menu_potions_help_section_mystery_upgrade': 'Upgrade',
      'menu_potions_help_section_mystery_upgrade_info1': 'Keep collecting skin pieces to level up your skin and make it look even cooler!',
      'menu_potions_help_section_mystery_upgrade_info2': 'Upgraded skins have animations!',
      'menu_potions_help_section_mystical': 'Mystical',
      'menu_potions_help_section_rare': 'Rare',
      'menu_potions_help_section_rewards_and_more': 'and more!',
      'menu_potions_help_section_rewards_button': 'Rewards',
      'menu_potions_help_section_rewards_coins': 'COINS',
      'menu_potions_help_section_rewards_contains': 'At least:\\nx%i Special',
      'menu_potions_help_section_rewards_potions': 'POTIONS',
      'menu_potions_help_section_rewards_skinpieces': 'SKIN PIECES',
      'menu_potions_help_section_rewards_title': 'Each potion has amazing rewards inside! Brew the potions to open them!',
      'menu_potions_help_section_rewards_trophies': 'TROPHIES',
      'menu_potions_help_section_row_title_coins': 'COINS',
      'menu_potions_help_section_row_title_potions': 'POTIONS',
      'menu_potions_help_section_row_title_skin_pieces': 'SKIN PIECES',
      'menu_potions_help_section_row_title_trophies': 'TROPHIES',
      'menu_potions_help_section_shop': 'Shop',
      'menu_potions_help_section_title': 'Help',
      'menu_profile_average_score': 'Average score:',
      'menu_profile_cells_eaten': 'Most cells eaten:',
      'menu_profile_highest_score': 'Highest score:',
      'menu_profile_longest_time': 'Best survival time:',
      'menu_profile_player_stats': 'Player Stats:',
      'menu_profile_popup_average_score': 'Average score',
      'menu_profile_popup_cells_eaten': 'Most cells eaten',
      'menu_profile_popup_highest_score': 'Highest score',
      'menu_profile_popup_longest_time': 'Best survival time',
      'menu_profile_popup_player_stats': 'Player Stats',
      'menu_profile_popup_total_games': 'Total games played',
      'menu_profile_popup_total_mass': 'Total mass eaten',
      'menu_profile_title': 'Profile',
      'menu_profile_total_games': 'Total games played:',
      'menu_profile_total_mass': 'Total mass eaten:',
      'menu_purchase_coins_awarded': 'You have just been awarded:',
      'menu_purchase_title': 'Purchase Complete',
      'menu_quest_complete_dna_amount': '%i DNA',
      'menu_rate_body': 'If you are enjoying Agar.io,\\n take a moment to rate the game!\\n\\nThanks for your support!',
      'menu_rate_body_intermediate': 'Take a moment to rate the game.\\nThanks for your support!',
      'menu_rate_later': 'No thanks',
      'menu_rate_title': 'Enjoying Agar.io?',
      'menu_rate_yes': 'Rate it Now',
      'menu_reconnecting_button': 'Retry',
      'menu_reconnecting_text': 'Connection has been lost.\\nPress retry to reconnect.',
      'menu_recover_pass_button_ok': 'Ok',
      'menu_rules_line_1_part_1': 'Press',
      'menu_rules_line_1_part_2': 'to split',
      'menu_rules_line_2_part_1': 'Press',
      'menu_rules_line_2_part_2': 'to eject some mass',
      'menu_rush_match_stats': 'Rush Results:',
      'menu_rush_matchmaking_boost_active': 'Active',
      'menu_rush_respawn_image_description': '1 respawn',
      'menu_rush_respawn_no_boost': 'Respawn with no boost',
      'menu_rush_respawn_subtitle': 'Respawn with a Rush Mass boost?',
      'menu_rush_respawn_title': 'You got eaten!',
      'menu_rush_stats_cells_eaten': 'Cells eaten:',
      'menu_rush_stats_final_mass': 'Final mass:',
      'menu_rush_stats_final_position': 'Final position:',
      'menu_rush_stats_highest_mass': 'Highest mass:',
      'menu_rush_stats_top_survival_time': 'Top survival time:',
      'menu_settings_account': 'Account',
      'menu_settings_allow_notifications_from_friends': 'Notifications from Friends',
      'menu_settings_arena_sfx': 'Game Sounds',
      'menu_settings_button_positions': 'Button Positions',
      'menu_settings_buttons_title': 'Buttons',
      'menu_settings_dark_background': 'Dark Background',
      'menu_settings_direction_on_touch': 'Direction on Touch',
      'menu_settings_facebook': 'Join Agar.io on Facebook',
      'menu_settings_facebook_button': 'Join',
      'menu_settings_game_options': 'Game Options',
      'menu_settings_info': 'Info',
      'menu_settings_language': 'Language',
      'menu_settings_menu_sfx': 'Menu Sounds',
      'menu_settings_minimap': 'Show Minimap',
      'menu_settings_sfx': 'Sounds',
      'menu_settings_show_arrow': 'Show Arrow',
      'menu_settings_show_levels': 'Show Level',
      'menu_settings_show_mass': 'Show Mass',
      'menu_settings_show_notifications': 'Show Notifications',
      'menu_settings_show_online_status_to_friends': 'Show Online Status',
      'menu_settings_show_quest': 'Show Quest',
      'menu_settings_stop_on_release': 'Stop on Release',
      'menu_settings_targeted_advertising': 'Targeted Advertising',
      'menu_settings_title': 'Settings',
      'menu_settings_user_id': 'UID:',
      'menu_settings_your_privacy': 'Privacy',
      'menu_settings_youtube': 'Check out Agar.io Youtube Channel',
      'menu_settings_youtube_button': 'Subscribe',
      'menu_shop_1_hour': '1 Hour',
      'menu_shop_24_hours': '24 Hours',
      'menu_shop_best_deal': 'BEST\\nDEAL',
      'menu_shop_button_boost': 'XP Boost',
      'menu_shop_button_coins': 'Coins',
      'menu_shop_button_dna': 'DNA',
      'menu_shop_button_mass': 'Mass Boost',
      'menu_shop_button_potions': 'Premium Potions',
      'menu_shop_button_xp_double': 'Double XP Boost',
      'menu_shop_button_xp_triple': 'Triple XP Boost',
      'menu_shop_buy': 'Buy',
      'menu_shop_cancel': 'Cancel',
      'menu_shop_coins_best': 'BEST\\nDEAL',
      'menu_shop_coins_free': 'FREE!',
      'menu_shop_coins_make_purchase': 'Make any purchase to remove ads.',
      'menu_shop_coins_popular': 'POPULAR',
      'menu_shop_coins_title': 'Coins',
      'menu_shop_create_skin_button': 'Create',
      'menu_shop_create_skin_title': 'New Skin',
      'menu_shop_create_skin_title_v2': 'Create Skin',
      'menu_shop_dna_title': 'DNA',
      'menu_shop_double_mass_info': 'Start each game with double your normal mass while boost is active',
      'menu_shop_double_xp_info': 'Earn double XP while boost is active',
      'menu_shop_get_for_free': 'Get For Free!',
      'menu_shop_get_more': 'Get more!',
      'menu_shop_level': 'Level %i',
      'menu_shop_mass_double': 'Double Starting Mass',
      'menu_shop_mass_title': 'Starting Mass Boost',
      'menu_shop_mass_triple': 'Triple Starting Mass',
      'menu_shop_mystery_level': 'Level %i',
      'menu_shop_mystery_max_upgraded': 'MAX Upgraded',
      'menu_shop_mystery_special': 'SPECIAL',
      'menu_shop_n_hour': '%hours_value% hours',
      'menu_shop_premium_potions_info': 'Potions purchased in the shop will open immediately!',
      'menu_shop_premium_potions_title': 'Premium Potions',
      'menu_shop_skins_node_placeholder': 'Get New Skins!',
      'menu_shop_skins_title': 'Skins',
      'menu_shop_triple_mass_info': 'Start each game with triple your normal mass while boost is active',
      'menu_shop_triple_xp_info': 'Earn triple XP while boost is active',
      'menu_shop_upgrade': 'Upgrade',
      'menu_shop_use': 'Use',
      'menu_stats_cells_eaten': 'Cells eaten:',
      'menu_stats_highest_mass': 'Highest mass:',
      'menu_stats_leaderboard_time': 'Leaderboard time:',
      'menu_stats_mass_eaten': 'Mass eaten:',
      'menu_stats_survival_time': 'Survival time:',
      'menu_stats_top_position': 'Top position:',
      'menu_stop_release_hint': 'If turned ON, your cell will stop moving when you release your finger from the screen.',
      'menu_terms_and_conditions': 'Terms & Conditions',
      'menu_upgrade_incentive_fifth_bullet': '● FREE gifts for friends!',
      'menu_upgrade_incentive_first_bullet': '● Bonus starting mass!',
      'menu_upgrade_incentive_fna_subtitle_fb': 'Login to Facebook to get FREE stuff!',
      'menu_upgrade_incentive_fna_subtitle_google': 'Upgrade account to get FREE stuff!',
      'menu_upgrade_incentive_fourth_bullet': '● Play on multiple devices!',
      'menu_upgrade_incentive_free_prize': 'FREE Prize:',
      'menu_upgrade_incentive_friend_gifts': 'Friend Gifts',
      'menu_upgrade_incentive_jyf_subtitle_fb': 'Login to Facebook to join your friends and get FREE stuff!',
      'menu_upgrade_incentive_jyf_title': 'Join your friends',
      'menu_upgrade_incentive_second_bullet': '● Collect free coins every hour!',
      'menu_upgrade_incentive_sixth_bullet': '● Collect Mystery Potions',
      'menu_upgrade_incentive_syp_subtitle_fb': 'Login to Facebook to keep your progress and get FREE stuff!',
      'menu_upgrade_incentive_syp_subtitle_google': 'Upgrade account to keep your progress and get FREE stuff!',
      'menu_upgrade_incentive_syp_title': 'Save your Progress',
      'menu_upgrade_incentive_third_bullet': '● Save your progress!',
      'menu_upgrade_incentive_upgrade_for_free': 'UPGRADE FOR FREE',
      'menu_version': 'Version',
      'menu_video_another_body': 'You have earned %@ coins! Do you want to watch another video for %@ more coins?',
      'menu_video_another_later': 'Later',
      'menu_video_another_title': 'Congratulations!',
      'menu_video_another_yes': 'Yes',
      'menu_video_loading_body_1': 'Looking for videos!',
      'menu_video_loading_body_2': 'Please wait...',
      'menu_video_loading_title': 'Video Rewards',
      'menu_video_not_avail_body': 'Sorry, there aren\'t any videos at the moment.\\nPlease try again later',
      'menu_video_not_avail_title': 'Videos unavailable',
      'menu_video_tutorial_body': 'Watch a short video and earn %@ coins. You can watch as many videos as are available to earn more coins',
      'menu_video_tutorial_title': 'Free Coins!',
      'menu_view': 'View',
      'menu_yes': 'Yes',
      'minigame_potions_check_skins': 'Check Skin!',
      'minigame_potions_menu_title': 'Mystery Potions',
      'minigame_special_skins_reward_text': 'You got x%i Special!',
      'minimap_tooltip_label1': 'Track players',
      'minimap_tooltip_label2': 'bigger than you',
      'multiple_invites_accepted_reward_subtitle': '%@ and more friends joined Agar.io',
      'no_friends_previous_league_results': 'You need at least one Facebook friend who won trophies, to be able to compete in the friends leaderboards.',
      'notification_daily': 'Aren\'t you hungry? Come and eat in Agar.io!',
      'notification_daily_quest': 'New Daily Quest available! Play to win your reward in Agar.io',
      'notification_free_coins': 'Your FREE COINS are ready - collect them NOW! And maybe a quick game of Agar.io…',
      'notification_potion_obtained': 'You forgot your potion - come & open it!',
      'notification_potion_slots_empty': 'You don\'t have Mystery Potions. Play to collect more!',
      'notification_potion_timer_over': 'Mystery Potion ready! Get your reward!',
      'notification_promotion_active_action': 'Agar.io Promo',
      'notification_promotion_before_end_action': 'Agar.io Promo',
      'notification_promotion_before_start_action': 'Agar.io Promo',
      'notification_reset_leagues': 'The weekly leaderboard results are in! Check if you got a prize!',
      'notification_weekly': 'Hey, it\'s been a while. Come back & play Agar.io - eat cells & grow!',
      'offer_not_active': 'This offer is currently unavailable',
      'online_friend_body_1': '~name~; is playing. Join your friend now!',
      'online_friend_body_2': 'Your friend ~name~; is playing. Create a party now!',
      'online_friend_body_3': '~name~; just came online. Play together now!',
      'online_friend_body_4': '~name~; is waiting to play with you! Play now!',
      'online_friend_body_5': 'Your friend ~name~; is online. Play together now!',
      'online_friend_title_1': 'Friend Online',
      'online_friend_title_2': 'Friend Online',
      'online_friend_title_3': 'Friend Online',
      'online_friend_title_4': 'Friend Online',
      'online_friend_title_5': 'Friend Online',
      'page_advertisement': 'Advertisement',
      'page_back_button': 'Back',
      'page_changelog': 'Changelog',
      'page_connect_help': 'If you cannot connect to the servers, check if you have some anti virus or firewall blocking the connection.',
      'page_connecting': 'Connecting',
      'page_continue': 'Continue',
      'page_create_party': 'Create',
      'page_create_party_instructions': 'Share this link with your friends!',
      'page_creating_party': 'Creating party...',
      'page_fb_matchresults_description': 'Can you do better? Come and play!',
      'page_fb_matchresults_subtitle': 'I survived %@m %@s and got a score of %@',
      'page_fb_matchresults_title': 'Got a new score in Agar.io',
      'page_g_plus_share_stats': 'I survived %@m %@s and got a score of %@ in Agar.io! Can you do better? Come and play!',
      'page_game_modes': 'Select Game Mode',
      'page_gamemode_battle_royale': 'Battle Royale',
      'page_gamemode_experimental': 'Experimental',
      'page_gamemode_ffa': 'FFA',
      'page_gamemode_rush': 'Rush',
      'page_gamemode_teams': 'Teams',
      'page_games_played': 'Games played',
      'page_graphics_auto': 'Graphics: Auto',
      'page_graphics_high': 'Graphics: High',
      'page_graphics_low': 'Graphics: Low',
      'page_graphics_medium': 'Graphics: Medium',
      'page_graphics_retina': 'Graphics: Retina',
      'page_graphics_title': '-- Graphics Quality --',
      'page_graphics_very_low': 'Graphics: Very Low',
      'page_highest_mass': 'Highest mass',
      'page_instructions_mouse': 'Move your mouse to control your cell',
      'page_instructions_space': 'Press <b>Space</b> to split',
      'page_instructions_w': 'Press <b>W</b> to eject some mass',
      'page_instructions_w_space': 'Press <b>Space</b> to split and <b>W</b> to eject some mass',
      'page_join_party': 'Join',
      'page_join_party_code': 'Enter the code your friends sent!',
      'page_join_party_confirmation': 'You are about to enter party mode.<br>Do you want to join a party?',
      'page_join_party_instructions': 'Share the link with more friends!',
      'page_joined_party_instructions': 'Share the code with more friends!',
      'page_joining_party': 'Joining party...',
      'page_last_match_results': 'Last match results',
      'page_leaderboard': 'Leaderboard',
      'page_leaderboard_time': 'Leaderboard Time',
      'page_leave_party_tooltip': 'Leave Party',
      'page_login_and_play': 'Login and play',
      'page_login_tooltip': 'Login to get your benefits!',
      'page_logout': 'Logout',
      'page_longest_survival': 'Longest survival',
      'page_main_menu_skins': 'Skins',
      'page_mass_eaten': 'Mass Eaten',
      'page_menu_login_facebook': 'Login',
      'page_menu_login_facebook_short': 'Sign in',
      'page_menu_login_google': 'Login',
      'page_menu_login_google_short': 'Sign in',
      'page_menu_main_dailyquests': 'Daily Quests',
      'page_menu_main_free_coins': 'Free Coins',
      'page_menu_main_gifts': 'Gifts',
      'page_menu_main_leagues': 'Leaderboards',
      'page_menu_main_potions': 'Potions',
      'page_menu_shop_cancel': 'Cancel',
      'page_online_status_setting_tooltip': 'Display Facebook profile picture',
      'page_option_dark_theme': 'Dark theme',
      'page_option_no_colors': 'No colors',
      'page_option_no_names': 'No names',
      'page_option_no_skins': 'No skins',
      'page_option_show_mass': 'Show mass',
      'page_option_show_online_status': 'Online Status',
      'page_option_show_quest': 'Show Quest',
      'page_option_skip_stats': 'Skip stats',
      'page_party': 'Party Mode',
      'page_party_description': 'Play with your friends in the same arena',
      'page_party_is_full_message': 'The party you are trying to join is full',
      'page_party_join_error': 'There was a problem joining that party, please make sure the code is correct, or try creating another party',
      'page_party_leave_ffa': 'You are in <b>%mode%</b> mode.<br><br>Do you want to continue or create a party?',
      'page_party_leave_party': 'Are you sure you want to leave the party?',
      'page_play': 'Play',
      'page_play_as_guest': 'Play as guest',
      'page_player_cells_eaten': 'Player Cells Eaten',
      'page_player_score': 'Score: ',
      'page_position_1': 'First',
      'page_position_10': 'Tenth',
      'page_position_2': 'Second',
      'page_position_3': 'Third',
      'page_position_4': 'Fourth',
      'page_position_5': 'Fifth',
      'page_position_6': 'Sixth',
      'page_position_7': 'Seventh',
      'page_position_8': 'Eighth',
      'page_position_9': 'Ninth',
      'page_potion_slot_get_potions': 'Get Potions',
      'page_privacy_policy': 'Privacy Policy',
      'page_region_australia': 'Australia',
      'page_region_china': 'China',
      'page_region_east_asia': 'East Asia',
      'page_region_europe': 'Europe',
      'page_region_north_america': 'North America',
      'page_region_oceania': 'Oceania',
      'page_region_players': 'players',
      'page_region_poland': 'Poland',
      'page_region_russia': 'Russia',
      'page_region_select': ' -- Select a Region -- ',
      'page_region_south_america': 'South America',
      'page_region_turkey': 'Turkey',
      'page_region_us_east': 'US East',
      'page_region_us_west': 'US West',
      'page_results_party_share_link': 'Share the link with your friends!<br>Press Play to enter party!',
      'page_rush_details_message': 'You have %i minutes.\\\\nGet as big as you can!',
      'page_rush_details_placedesc_a': '1st Place',
      'page_rush_details_placedesc_d': 'Finish',
      'page_rush_mode_unlock_fee': 'Fee: %rush_fee%',
      'page_rush_unavail_footer': 'Unlock at Level %i',
      'page_score': 'Score',
      'page_share': 'Share',
      'page_shop': 'Shop',
      'page_spectate': 'Spectate',
      'page_stats': 'Stats',
      'page_stats_cells_eaten': 'cells eaten',
      'page_stats_food_eaten': 'food eaten',
      'page_stats_highest_mass': 'highest mass',
      'page_stats_leaderboard_time': 'leaderboard time',
      'page_stats_time_alive': 'time alive',
      'page_stats_top_position': 'top position',
      'page_survival_time': 'Survival Time',
      'page_terms_of_service': 'Terms of Service',
      'page_cookie_policy': 'Cookie Policy',
      'page_privacy_settings': 'Privacy Settings',
      'page_top_position': 'Top Position',
      'page_total_cells_eaten': 'Total cells eaten',
      'page_total_mass_eaten': 'Total mass eaten',
      'page_tt_share_stats': 'I survived %@m %@s and got a score of %@ in Agar.io! Can you do better? Come and play! http://r.agar.io',
      'page_unnamed_cell': 'An unnamed cell',
      'page_web_find_arena_body': 'Looking for an available arena.\\nClick retry to connect.',
      'page_web_find_arena_title': 'Finding Arena',
      'party_channel_title': 'Party',
      'party_create_party_button': 'Create Party',
      'party_create_timeout': 'Failed to create party. Please try again.',
      'party_created_or_joined_copy_button': 'Copy',
      'party_created_or_joined_message': 'Share the code with your friends so they can join you',
      'party_created_or_joined_play_classic_button': 'Play Party',
      'party_created_or_joined_share_code_button': 'Share Code',
      'party_created_or_joined_share_friends_button': 'Share with Friends',
      'party_created_or_joined_title': 'Party Mode',
      'party_created_subtitle': 'You successfuly created a party!',
      'party_facebook_friends_invite_description': 'Get %@ for each new friend who joins Agar.io',
      'party_facebook_friends_more_friends_button': 'More friends',
      'party_facebook_friends_no_friends_description': 'Invite more friends to play!\nGet %@ for each new friend who joins Agar.io',
      'party_facebook_friends_select_all_toggle': 'Select all',
      'party_facebook_friends_share_button': 'Share',
      'party_input_box_text': 'Party Code...',
      'party_invite_accepted_reward_button': 'Invite more Friends',
      'party_invite_accepted_reward_description': 'Enjoy your free prize!',
      'party_invite_accepted_reward_subtitle': '%@ just joined Agar.io',
      'party_invite_accepted_reward_title': 'New Friend is playing',
      'party_join_party_button': 'Join Party',
      'party_join_party_description': 'Your friends should have given you a code, type or paste it here:',
      'party_join_party_paste': 'Paste',
      'party_join_party_title': 'Join a Party',
      'party_join_timeout': 'Failed to join party. Please try again.',
      'party_joined_subtitle': 'You successfully joined a party!',
      'party_leave_button': 'Leave',
      'party_leave_party_text': 'Are you sure you want to\r\nleave the party? ',
      'party_leave_party_title': 'Leave Party',
      'party_loading_creating_party': 'Creating Party...',
      'party_loading_joining_party': 'Joining Party...',
      'party_login_with_facebook_button': 'Login with Facebook',
      'party_login_with_facebook_description': 'Login with Facebook to invite your friends to Agar.io \nand get FREE stuff!',
      'party_mode_fb_invite_more_friends_description': 'Come and play Agar.io with me!',
      'party_mode_fb_invite_more_friends_title': 'Invite Friend',
      'party_mode_invite_more_friends_webview_title': 'Invite more friends',
      'party_mode_notification_title': 'Party Mode',
      'party_more_friends_tab': 'More Friends',
      'party_my_party_description': 'Share the party code with more friends to play together',
      'party_my_party_tab': 'My Party',
      'party_my_party_title': 'This is your party!',
      'party_no_button': 'No',
      'party_online_friend_1': '~name~; is playing. Join your friend now!',
      'party_online_friend_2': 'Your friend ~name~; is playing. Create a party now!',
      'party_online_friend_3': '~name~; just came online. Play together now!',
      'party_online_friend_4': '~name~; is waiting to play with you! Play now!',
      'party_online_friend_5': 'Your friend ~name~; is online. Play together now!',
      'party_party_expired_message': 'The party you are trying to join no longer exists.',
      'party_party_incompatible_message': 'Please update to join this party.',
      'party_party_is_full_message': 'The party you are trying to join is full',
      'party_party_is_invalid_message': 'The party you are trying to join is invalid',
      'party_party_mode_message': 'Play with your friends in the same arena',
      'party_party_mode_tab': 'Party Mode',
      'party_party_mode_title': 'Party Mode',
      'party_share_code_text': 'Hey, join my party in Agario! Click this link so we can play together now: ',
      'party_share_code_title': 'Share Party Code',
      'permission_get_account_justification': 'Allow Agar.io to access your name and user data from Google+?\\nYou can always reactivate this permission in your device app settings.',
      'play_as_guest': 'Play as guest',
      'play_classic_mode': 'Classic',
      'play_rush_mode': 'Rush',
      'player_score': 'Score: ${0}',
      'position_1': 'First',
      'position_10': 'Tenth',
      'position_2': 'Second',
      'position_3': 'Third',
      'position_4': 'Fourth',
      'position_5': 'Fifth',
      'position_6': 'Sixth',
      'position_7': 'Seventh',
      'position_8': 'Eighth',
      'position_9': 'Ninth',
      'potion_empty_slot': 'Empty\\nSlot',
      'potion_locked': 'Another Potion is Brewing',
      'potion_slot_brew': 'Brew it',
      'potion_slot_more': 'Get more!',
      'potion_slot_open': 'Open',
      'potion_slot_open_now': 'Open Now!',
      'potion_slot_ready': 'Ready',
      'potion_slot_start': 'Start',
      'potions_reward_next': 'Next',
      'pre_conditions_failed': 'Does not satisfy purchase conditions.',
      'profile_trophies_collected': 'Trophies:',
      'progress_bar_max_upgrade': 'MAX Upgraded!',
      'progress_bar_ready_to_upgrade': 'Ready to Upgrade!',
      'progress_bar_unlocked': 'Unlocked!',
      'quest_eat_food_plural_tag': '%@: Eat %i pellets',
      'quest_eat_food_singular_tag': '%@: Eat %i pellet',
      'quest_eat_food_tag': 'Eat %i pellets in a single match',
      'quest_eat_normal_plural_tag': '%@: Eat %i player cells',
      'quest_eat_normal_singular_tag': '%@: Eat %i player cell',
      'quest_eat_normal_tag': 'Eat %i player cell(s) in a single match',
      'quest_eat_virus_plural_tag': '%@: Eat %i viruses',
      'quest_eat_virus_singular_tag': '%@: Eat %i virus',
      'quest_eat_viruses_tag': 'Eat %i virus(es) in a single match',
      'quest_progress_eat_food_description': 'Eat pellets %i/%i',
      'quest_progress_eat_normal_description': 'Eat players %i/%i',
      'quest_progress_eat_viruses_description': 'Eat viruses %i/%i',
      'quest_progress_reach_mass_description': 'Reach mass %i/%i',
      'quest_progress_survival_time_description': 'Survive %@',
      'quest_progress_top_leaderboard_description': 'Reach top %i',
      'quest_reach_mass_match_tag': '%@: Reach %i mass',
      'quest_reach_mass_tag': 'Reach %i mass in a single match',
      'quest_reach_top_leaderboard_tag': '%@: Reach top %i',
      'quest_survival_time_plural_tag': '%@: Survive %i minutes',
      'quest_survival_time_singular_tag': '%@: Survive %i minute',
      'quest_survival_time_tag': 'Survive %i minute(s) in a single match',
      'quest_top_leaderboard_tag': 'Reach top %i in a single match',
      'rate_intermediate_inner_text': 'Thank you for playing Agar.io!\\n \\nAre you enjoying the game so far?',
      'rate_intermediate_no_label': 'Not really',
      'rate_intermediate_title': 'Great match!',
      'rate_intermediate_yes_label': 'Yes',
      'reminders_channel_title': 'Reminders',
      'retention_group_notification_summary': 'Come and play Agar.io!',
      'rewards_channel_title': 'Rewards',
      'reward_link_success_title': 'Congratulations',
      'reward_link_subtitle': 'You have been awarded',
      'reward_link_shop': 'Shop',
      'reward_link_play': 'Play',
      'reward_link_open_potion': 'Open',
      'reward_activate_boost': 'Use & Play',
      'reward_link_skin_editor_not_available': 'Create your own custom skin on the mobile version',
      'reward_link_error_title': 'Reward unavailable',
      'reward_link_login': 'Login',
      'reward_link_guest': 'Login to claim your reward!',
      'reward_link_subtitle_guest': 'You won a prize!',
      'rush_arena_mass_label': 'Mass',
      'rush_details_header': 'Rush Mode',
      'rush_details_message': 'You have %i minutes.\\nFinish in Top 30 of the leaderboard to win a Potion.',
      'rush_details_message_half': 'You have %i minutes.\\nFinish in Top Half of the leaderboard to win a Potion.',
      'rush_endgame_message': 'Time\'s up!',
      'rush_estimation_time': 'Estimated Time',
      'rush_estimation_title': 'Gathering players...',
      'rush_matchmaking_boost_active': 'Active for 1 spawn',
      'rush_matchmaking_boost_proposal': 'Start the game with a Rush Mass boost?',
      'rush_matchmaking_header': 'Rush Mode',
      'rush_matchmaking_wait': 'Gathering players. Please Wait …',
      'rush_mode_countdown_timer_message': 'Time Left:',
      'rush_mode_my_results': 'My Results',
      'rush_mode_play_again': 'Play Again!',
      'rush_mode_rush_is_over': 'Rush is Over!',
      'rush_mode_unavailable_error': 'Rush mode is temporarily disabled while we are rolling out the new update. Please try again later and check out our new features.',
      'rush_mode_unlock_explanation': 'Be the biggest at the end!',
      'rush_mode_unlock_play': 'Play Now!',
      'rush_mode_unlock_subtitle': 'Rush mode is now available',
      'rush_mode_unlock_time': '%i Minute Game',
      'rush_mode_unlock_title': 'Congratulations!',
      'rush_mode_you_ranked': 'You ranked:',
      'rush_mode_your_reward': 'Your reward:',
      'rush_standings_header': 'Top 10 Results',
      'rush_unavail_footer': 'Unlock at Level %i',
      'rush_unavail_header': 'Rush Mode',
      'screenshot_001': 'THE OFFICIAL SMASH HIT WEB GAME COMES TO MOBILE!',
      'screenshot_002': 'Divide & Conquer! Grow & Dominate!',
      'screenshot_004': 'Throw & split Mass to gain advantage!',
      'screenshot_005': 'Play with many different Skins!',
      'screenshot_party_mode': 'Invite Friends to Play in Party Mode!',
      'settings_localization_confirm': 'Confirm',
      'settings_localization_system_language': 'System Language',
      'shop': 'Shop',
      'shop_coins_2x': '2x',
      'shop_coins_3x': '3x',
      'shop_unavailable_message': 'Shop is not available at the moment, please come back later',
      'skin_editor_click_to_continue': 'Click anywhere to continue...',
      'skin_editor_tutorial_color': 'Choose a color',
      'skin_editor_tutorial_brush_size': 'Choose the size of the Brush and Eraser',
      'skin_editor_tutorial_brush': 'Use this tool to draw',
      'skin_editor_tutorial_eraser': 'Use this tool to erase',
      'skin_editor_tutorial_background': 'Select the cell background',
      'skin_editor_tutorial_border': 'Select the cell border',
      'skin_name_default': 'My Skin',
      'skin_name_input_box_text': 'My Skin...',
      'social_1_friend': '%d friend',
      'social_1_friend_online': '%d friend online',
      'social_invite_friends': 'Invite Friends',
      'social_more_friends': 'More Friends',
      'social_n_friends': '%d friends',
      'social_n_friends_online': '%d friends online',
      'social_share_tag': 'Share',
      'soft_update_description': 'and exciting new features!',
      'soft_update_image_description': '1 Hour',
      'soft_update_reward_collect_now': 'Collect now!',
      'soft_update_reward_description': 'Thank you for updating!',
      'soft_update_reward_name': 'Double Starting Mass boost',
      'soft_update_reward_subtitle': 'You have been awarded',
      'soft_update_reward_title': 'Congratulations!',
      'soft_update_subtitle': 'Update now and get:',
      'soft_update_title': 'Time to update!',
      'soft_update_title_web': 'A new Agar.io version is available.',
      'soft_update_update_now': 'Update now!',
      'special_offers_channel_title': 'Special Offers',
      'spectate_full': 'Spectate mode is full!',
      'store_description': '* Fixed arena zoom issue\r\n* Fixed issue when switching from one offerwall to another\r\n* Fixed issue with blocked controls in arena ',
      'store_description_3': '* Fixed some issues regarding arena freezes',
      'store_description_VIP': 'VIP Subscriptions\r\n\r\n- Agar.io offers weekly subscriptions at USD $7,49. Price may vary depending on sales, taxes and countries.\r\n\r\n- Payment will be charged to iTunes Account at confirmation of purchase\r\n\r\n- Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period\r\n\r\n- Your account will be charged for renewal within 24-hours prior to the end of the current period\r\n\r\n- Subscriptions may be managed by going to the Account Settings after purchase and auto-renewal may be turned off\r\n\r\n- Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable\r\n\r\nTerms and Conditions: https://m.miniclip.com/terms-and-conditions\r\nPrivacy Policy: https://m.miniclip.com/privacy',
      'store_description_fixes': '* Fixed invisible skins issue\r\n* Performance improvements',
      'store_description_fixes_2': '* Fixed issue with Arabic characters',
      'store_description_fixes_3': '* Fixed arena freezes\r\n* Fixed transparent virus issue',
      'store_description_fixes_4': '* Fixed Arabic and Hindi characters issues',
      'store_description_subscription': '- Agar.io offers weekly subscriptions at USD $7,49. Price may vary depending on sales, taxes and countries.',
      'store_phrase': 'Become a beta tester',
      'store_text_DNA': '* Get FREE DNA with offers',
      'store_vip_whats_new': '* Fixed issue with misaligned Japanese characters\n* Fixed issue with party members counter in the arena\n* Fixed issue with Google avatar \n* Check out your party members profile',
      'teams_message_waiting': 'Waiting for players...',
      'teams_message_players_ready': 'Players Ready: ',
      'teams_message_starting': 'Match starting in: %t',
      'teams_message_time_left': 'Time Left',
      'teams_message_respawn_top': 'You\'ve been eaten!',
      'teams_message_respawn_bottom': 'Respawning in: %t',
      'teams_message_time_alert': '%xs',
      'teams_winner_red': 'Red Team won!',
      'teams_winner_blue': 'Blue Team won!',
      'teams_winner_none': 'It\'s a tie!',
      'teams_play_again': 'Play again!',
      'teams_match_results_title': 'Match Results',
      'teams_results_mass': 'Highest mass',
      'teams_results_kills': 'Players eaten',
      'time_capital_hour': '%iH',
      'time_day_text': '${0}d',
      'time_hour_text': '${0}h',
      'time_minute_text': '${0}m',
      'time_second_text': '${0}s',
      'time_week_text': '${0}w',
      'timeout_try_again': 'Request failed. Please try again.',
      'transaction_error': 'Transaction error',
      'transaction_error_desc': 'Please try again later \\nor refresh your browser.',
      'transaction_in_progress': 'Transaction in progress',
      'transaction_not_allowed': 'You are not allowed to make a purchase.',
      'transaction_ok': 'OK',
      'transaction_server_error': 'Server error',
      'transaction_verification_timeout': 'Your transaction is being processed. We will update your account shortly.',
      'transaction_wait': 'Please wait...',
      'tt_battleroyaleresults_description': 'I played Agar.io Battle Royale and placed %position%! Can you do better? Come and play!',
      'tt_countryleaderboard_description': 'I ranked %playerPosition% in my country! Can you do better? Come and play Agar.io! http://r.agar.io',
      'tt_friendsleaderboard_description': 'I ranked %playerPosition% among my friends in Agar.io! Can you do better? Come and play! http://r.agar.io',
      'tt_leagueleaderboard_description': 'I ranked %playerPosition% in my league in Agar.io! Can you do better? Come and play! http://r.agar.io',
      'tt_leaguepromotion_title': 'I am now on the %leagueName% in Agar.io! Can you do better? Come and play! http://r.agar.io',
      'tt_levelup': 'I\'m now level %level% in Agario! How far can you go? Come and play! http://r.agar.io',
      'tt_matchresults': 'I survived %mins%m %secs%s and got a score of %score% in Agar.io! Can you do better? Come and play http://r.agar.io',
      'tt_rankup_description': 'I passed %opponentName% in Agar.io! Can you do better? Come and play! http://r.agar.io',
      'tt_rushresults': 'I ranked %rank% and my mass was %mass% in Agario Rush! Have you tried this game mode? Come and play! http://r.agar.io',
      'tt_rushwin_description': 'I just ranked %rank% in Agario Rush! Have you tried this game mode? Come and play! http://r.agar.io',
      'tt_share_stats': 'I survived %@m %@s and got a score of %@ in Agar.io! Can you do better? Come and play! http://r.agar.io',
      'tt_skincollected': 'I just opened a mystery potion in Agario and won amazing rewards. Come and play to win unique mystery skins! http://r.agar.io',
      'tt_skincreate': 'I just created a new skin. Think you can do better? Come and play! http://r.agar.io',
      'tt_skinpurchase': 'I just got a new skin in Agario: %skin%! Think you look cooler than me? Come and play! http://r.agar.io',
      'tt_skinunlock': 'I\'m now level %level% in Agario and won a Veteran skin… %skin%! Come and play to get cool skins! http://r.agar.io',
      'tt_skinunlocked': 'I just unlocked a mystery skin in Agario... %skin%! Come and play to win unique mystery skins! http://r.agar.io',
      'tt_skinunlockedmultiple': 'I just unlocked mystery skins in Agario! Come and play to win unique mystery skins! http://r.agar.io',
      'tt_skinupgraded': 'I just upgraded a mystery skin in Agario! Come and play to win unique mystery skins! http://r.agar.io',
      'tt_worldleaderboard_description': 'I ranked %playerPosition% in the world! Can you do better? Come and play Agar.io! http://r.agar.io',
      'twitter_cant_tweet': 'Please enable Twitter in your device Settings or create a Twitter account if you don\'t have one.',
      'update_config_popup_message': 'Updating...',
      'user_banned_body': 'Using hacks or bots will get user accounts banned.\n\nPlease contact support for further information.',
      'user_banned_button_label': 'Contact Support',
      'user_banned_description': 'Using hacks, bots or extensions will get user accounts banned.\n\nPlease contact support for further information.\n\nUser id: %userId%',
      'user_banned_title': 'Account banned',
      'user_id_display_label': 'User ID:',
      'video_01': 'Be part of the multiplayer hit!',
      'video_02': 'Eat or be eaten!',
      'video_03': 'Use strategy!',
      'video_04': 'Many different skins!',
      'video_05': 'Be the next big thing!',
      'video_06': 'Seal of approval',
      'vip_button': 'VIP',
      'vip_not_available_warning': 'VIP subscriptions are not available on web platform at the moment.',
      'vip_reward_popup_collect_button': 'Collect Now!',
      'vip_reward_popup_subtitle': 'Enjoy your VIP rewards!',
      'vip_reward_popup_title': 'Welcome back!',
      'vip_skin_badge_text': 'VIP Skin',
      'vip_subscription_ads_badge': 'No\nmore\nAds!',
      'vip_subscription_popup_boost': 'Boost',
      'vip_subscription_popup_custom_skin_1': 'Create your own Skin',
      'vip_subscription_popup_custom_skin_2': 'Once a Day!',
      'vip_subscription_popup_free_trial_button': 'Start Free Trial',
      'vip_subscription_popup_free_trial_description': '3-day free trial, then %@ per week',
      'vip_subscription_popup_free_trial_legal_info': 'These purchases are auto-renewing subscriptions. The subscription price will be charged to your Google Play Account or iTunes Account (as appropriate) (i) on confirmation of purchase; and (ii) in the 24 hours prior to the end of each subscription period set out above (e.g. week, month or year). Cancel the subscription at any time in your Google Play Account or iTunes Account Settings (as appropriate). If you do not turn off the subscription at least 24 hours before the expiry of a subscription period, you will be charged the subscription price for the next subscription period. If you have a free trial period, the subscription will automatically convert into a paid auto-renewing subscription at the end of the trial period. Activating a new subscription prior to the end of any trial period will cancel any remaining trial period.',
      'vip_subscription_popup_free_trial_legal_info_apple': 'These purchases are auto-renewing subscriptions. The subscription price will be charged to your iTunes Account (i) on confirmation of purchase; and (ii) in the 24 hours prior to the end of each subscription period set out above (e.g. week, month or year). Cancel the subscription at any time in your iTunes Account Settings. If you do not turn off the subscription at least 24 hours before the expiry of a subscription period, you will be charged the subscription price for the next subscription period. If you have a free trial period, the subscription will automatically convert into a paid auto-renewing subscription at the end of the trial period. Activating a new subscription prior to the end of any trial period will cancel any remaining trial period.',
      'vip_subscription_popup_free_trial_legal_info_google': 'These purchases are auto-renewing subscriptions. The subscription price will be charged to your Google Play Account (i) on confirmation of purchase; and (ii) in the 24 hours prior to the end of each subscription period set out above (e.g. week, month or year). Cancel the subscription at any time in your Google Play Account Settings. If you do not turn off the subscription at least 24 hours before the expiry of a subscription period, you will be charged the subscription price for the next subscription period. If you have a free trial period, the subscription will automatically convert into a paid auto-renewing subscription at the end of the trial period. Activating a new subscription prior to the end of any trial period will cancel any remaining trial period.',
      'vip_subscription_popup_reward_2_subtitle': 'EVERY WEEK!',
      'vip_subscription_popup_reward_3_subtitle': 'EVERY DAY!',
      'vip_subscription_popup_reward_3_title': 'VIP Bundle',
      'vip_subscription_popup_reward_skins_1_title': 'Get 2 FREE Skins NOW and',
      'vip_subscription_popup_reward_skins_2_title': '1 VIP Skin Every Week!',
      'vip_subscription_popup_start_now_button': 'Start Now',
      'vip_subscription_popup_start_now_description': '%@ per week',
      'vip_subscription_popup_subtitle': 'Become a VIP and get exclusive rewards!',
      'vip_subscription_popup_title': 'Agar.io VIP',
      'vip_subscription_skin_editor_save_skin_description': 'Type a name and save it! This skin is only available while you\'re subscribed.',
      'vip_subscription_skin_editor_save_skin_title': 'Save VIP Skin',
      'vip_welcome_back_popup_title': 'Welcome back to Agar.io VIP!',
      'vip_welcome_collect_rewards': 'Collect Rewards',
      'vip_welcome_daily_rewards': 'Daily Rewards!',
      'vip_welcome_dropdown_text': 'Welcome to your VIP subscription!',
      'vip_welcome_popup_check_skins_button': 'Check Skins!',
      'vip_welcome_popup_footnote': 'Login every day to get more rewards!',
      'vip_welcome_popup_legal_text': 'You can cancel this auto-renew subscription in your account settings on 24 hours’ notice before payment is taken. See full Terms & Conditions',
      'vip_welcome_popup_subtitle': 'Enjoy your Exclusive Skins!',
      'vip_welcome_popup_title': 'Welcome to Agar.io VIP!',
      'vip_welcome_weekly_rewards': 'Weekly Rewards!',
      'watch_video': 'Watch Video',
      'web_disconnect_body': 'Please check your internet connection.',
      'web_disconnect_title': 'Disconnected',
      'web_incentive_description': 'Now let\'s eat some cells on mobile!',
      'web_incentive_image_description': '250 Coins + 1h Triple Mass Boost',
      'web_incentive_subtitle': 'Here is your reward:',
      'web_incentive_title': 'Welcome to mobile!',
      'web_menu_login_elsewhere_footer': 'You have been disconnected because you logged in from another place.',
      'web_menu_login_elsewhere_header': 'Disconnected',
      'widget_loading_connecting': 'Connecting',
      'widget_loading_loading': 'Loading',
      'widget_loading_processing': 'Processing',
      'winner_popup_description_a': 'You just won the',
      'winner_popup_description_b': 'prize',
      'winner_popup_description_c': 'on the',
      'winner_popup_full_results': 'Full Results',
      'winner_popup_prize': 'Prize',
      'winner_popup_title': 'Leaderboard Results',
      'winner_popup_weekly_winnings': 'Weekly Winnings',
      'world_leaderboard_help_title': 'World Leaderboard',
      'world_leaderboard_notification_body': '~name~; just passed you in the World Leaderboard on Agar.io!',
      'xp_boost_2x_1h_tag': '1h Double XP Boost',
      'xp_boost_2x_24h_tag': '24h Double XP Boost',
      'xp_boost_3x_1h_tag': '1h Triple XP Boost',
      'xp_boost_3x_24h_tag': '24h Triple XP Boost',
      'you_need_more_coins': 'coins',
      'you_need_more_dna': 'DNA'
    }
  };
  i18nLang = (window.navigator.userLanguage || window.navigator.language || 'en').split('-')[0];
  if (!i18nDict.hasOwnProperty(i18nLang)) {
    i18nLang = 'en';
  }
  var i18List = i18nDict[i18nLang];
  function parseString(tag, token, arr) {
    var finalText = get(tag);
    for (var i = 0; i < arr.length; i++) {
      finalText = finalText.replace(token, arr[i]);
    }
    return finalText;
  }
  function get(key) {
    return i18List[key] || i18nDict['en'][key] || key;
  }
  function set(key, value) {
    i18nDict['en'][key] = value;
    _index.store.commit('localizedTextUpdate', {
      key: key,
      value: value
    });
  }
  return {
    get: get,
    set: set,
    parseString: parseString,
    list: i18List
  };
}();

/***/ }),
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var LZString = function () {
  function o(o, r) {
    if (!t[o]) {
      t[o] = {};
      for (var n = 0; n < o.length; n++) t[o][o.charAt(n)] = n;
    }
    return t[o][r];
  }
  var r = String.fromCharCode,
    n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
    t = {},
    i = {
      compressToBase64: function compressToBase64(o) {
        if (null == o) return "";
        var r = i._compress(o, 6, function (o) {
          return n.charAt(o);
        });
        switch (r.length % 4) {
          default:
          case 0:
            return r;
          case 1:
            return r + "===";
          case 2:
            return r + "==";
          case 3:
            return r + "=";
        }
      },
      decompressFromBase64: function decompressFromBase64(r) {
        return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function (e) {
          return o(n, r.charAt(e));
        });
      },
      compressToUTF16: function compressToUTF16(o) {
        return null == o ? "" : i._compress(o, 15, function (o) {
          return r(o + 32);
        }) + " ";
      },
      decompressFromUTF16: function decompressFromUTF16(o) {
        return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function (r) {
          return o.charCodeAt(r) - 32;
        });
      },
      compressToUint8Array: function compressToUint8Array(o) {
        for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) {
          var s = r.charCodeAt(e);
          n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256;
        }
        return n;
      },
      decompressFromUint8Array: function decompressFromUint8Array(o) {
        if (null === o || void 0 === o) return i.decompress(o);
        for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++) n[e] = 256 * o[2 * e] + o[2 * e + 1];
        var s = [];
        return n.forEach(function (o) {
          s.push(r(o));
        }), i.decompress(s.join(""));
      },
      compressToEncodedURIComponent: function compressToEncodedURIComponent(o) {
        return null == o ? "" : i._compress(o, 6, function (o) {
          return e.charAt(o);
        });
      },
      decompressFromEncodedURIComponent: function decompressFromEncodedURIComponent(r) {
        return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function (n) {
          return o(e, r.charAt(n));
        }));
      },
      compress: function compress(o) {
        return i._compress(o, 16, function (o) {
          return r(o);
        });
      },
      _compress: function _compress(o, r, n) {
        if (null == o) return "";
        var e,
          t,
          i,
          s = {},
          p = {},
          u = "",
          c = "",
          a = "",
          l = 2,
          f = 3,
          h = 2,
          d = [],
          m = 0,
          v = 0;
        for (i = 0; i < o.length; i += 1) if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c;else {
          if (Object.prototype.hasOwnProperty.call(p, a)) {
            if (a.charCodeAt(0) < 256) {
              for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
              for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            } else {
              for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
              for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            }
            l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a];
          } else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
          l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u);
        }
        if ("" !== a) {
          if (Object.prototype.hasOwnProperty.call(p, a)) {
            if (a.charCodeAt(0) < 256) {
              for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
              for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            } else {
              for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
              for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            }
            l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a];
          } else for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
          l--, 0 == l && (l = Math.pow(2, h), h++);
        }
        for (t = 2, e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
        for (;;) {
          if (m <<= 1, v == r - 1) {
            d.push(n(m));
            break;
          }
          v++;
        }
        return d.join("");
      },
      decompress: function decompress(o) {
        return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function (r) {
          return o.charCodeAt(r);
        });
      },
      _decompress: function _decompress(o, n, e) {
        var t,
          i,
          s,
          p,
          u,
          c,
          a,
          l,
          f = [],
          h = 4,
          d = 4,
          m = 3,
          v = "",
          w = [],
          A = {
            val: e(0),
            position: n,
            index: 1
          };
        for (i = 0; 3 > i; i += 1) f[i] = i;
        for (p = 0, c = Math.pow(2, 2), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
        switch (t = p) {
          case 0:
            for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
            l = r(p);
            break;
          case 1:
            for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
            l = r(p);
            break;
          case 2:
            return "";
        }
        for (f[3] = l, s = l, w.push(l);;) {
          if (A.index > o) return "";
          for (p = 0, c = Math.pow(2, m), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
          switch (l = p) {
            case 0:
              for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
              f[d++] = r(p), l = d - 1, h--;
              break;
            case 1:
              for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
              f[d++] = r(p), l = d - 1, h--;
              break;
            case 2:
              return w.join("");
          }
          if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l];else {
            if (l !== d) return null;
            v = s + s.charAt(0);
          }
          w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++);
        }
      }
    };
  return i;
}();
 true ? !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
  return LZString;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "undefined" != typeof module && null != module && (module.exports = LZString);

/***/ }),
/* 361 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = exports.core = void 0;
var _jquery = _interopRequireDefault(__webpack_require__(7));
var _underscore = _interopRequireDefault(__webpack_require__(66));
var _queryManager = _interopRequireDefault(__webpack_require__(83));
var core = exports.core = function (exports) {
  var events = {};
  var _debug = false;
  var _config = {
    skipDraw: true,
    predictionModifier: 1.1
  };
  exports.init = function () {
    window.agarApp.account.init();
    _debug = 'debug' in _queryManager["default"];
    if (_debug) {
      window.agarApp.debug.showDebug();
    }
  };
  exports.bind = function (event, handler) {
    (0, _jquery["default"])(events).on(event, handler);
  };
  exports.unbind = function (event, handler) {
    (0, _jquery["default"])(events).off(event, handler);
  };
  exports.trigger = function (event, params) {
    (0, _jquery["default"])(events).trigger(event, params);
  };
  exports.__defineGetter__('debug', function () {
    return _debug;
  });
  exports.__defineSetter__('debug', function (value) {
    return _debug = value;
  });
  exports.__defineGetter__('proxy', function () {
    return window['MC'];
  });
  exports.__defineGetter__('config', function () {
    return _config;
  });
  return exports;
}({});
var debug = exports.debug = function (exports) {
  var _initialized = false;
  var _container;
  var _showPrediction = false;
  var _series = {};
  var _charts = {};
  var defaultSeriesStyle = {
    strokeStyle: 'rgba(0, 255, 0, 1)',
    fillStyle: 'rgba(0, 255, 0, 0.2)',
    lineWidth: 2
  };
  var createTimeseries = function createTimeseries() {
    /* eslint-disable no-undef */
    var tseries = new TimeSeries({
      resetBounds: false
    });
    return tseries;
  };
  var createOneChart = function createOneChart(id, opts) {
    _series[id] = createTimeseries();
    createChart(id, [_series[id]], opts, [{
      strokeStyle: 'rgba(0, 255, 0, 1)',
      fillStyle: 'rgba(0, 255, 0, 0.2)',
      lineWidth: 2
    }]);
  };
  var createChart = function createChart(id, series, chart_opts, series_opts) {
    var canvasID = id + 'Canvas';
    var chartDiv = (0, _jquery["default"])('<canvas>', {
      id: canvasID
    });
    _container.append(chartDiv);
    var chart = new SmoothieChart(chart_opts);
    for (var i = 0; i < series.length; i++) {
      var serie = series[i];
      var opts = _underscore["default"].extend(defaultSeriesStyle, series_opts[i]);
      chart.addTimeSeries(serie, opts);
    }
    chart.streamTo(document.getElementById(canvasID), 0);
    _charts[id] = _charts;
  };
  var init = function init() {
    if (_initialized) return;
    _container = (0, _jquery["default"])('#debug-overlay');
    createOneChart('networkUpdate', {
      name: 'network updates',
      minValue: 0,
      maxValue: 240
    });
    _series['rttSDev'] = createTimeseries();
    _series['rttMean'] = createTimeseries();
    createChart('rttMean', [_series['rttSDev'], _series['rttMean']], {
      name: 'rtt',
      minValue: 0,
      maxValue: 120
    }, [{
      strokeStyle: 'rgba(255, 0, 0, 1)',
      fillStyle: 'rgba(0, 255, 0, 0.2)',
      lineWidth: 2
    }, {
      strokeStyle: 'rgba(0, 255, 0, 1)',
      fillStyle: 'rgba(0, 255, 0, 0)',
      lineWidth: 2
    }]);
    createOneChart('fps', {
      name: 'fps',
      minValue: 0,
      maxValue: 70
    });
    _initialized = true;
  };
  exports.showDebug = function () {
    init();
    window.agarApp.core.debug = true;
    _container.show();
  };
  exports.hideDebug = function () {
    _container.hide();
    window.agarApp.core.debug = false;
  };
  exports.updateChart = function (id, time, value) {
    if (!_initialized) return;
    if (id in _series) {
      _series[id].append(time, value);
    }
  };
  exports.__defineGetter__('showPrediction', function () {
    return _showPrediction;
  });
  exports.__defineSetter__('showPrediction', function (value) {
    return _showPrediction = value;
  });
  return exports;
}({});

/***/ }),
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _utils = _interopRequireDefault(__webpack_require__(26));
var _facebook = _interopRequireDefault(__webpack_require__(381));
var _google = _interopRequireDefault(__webpack_require__(382));
var _index = __webpack_require__(5);
var _storageKeys = _interopRequireDefault(__webpack_require__(33));
function _default(agarApp, $) {
  var MC = null;
  var facebook = new _facebook["default"](agarApp, $);
  var google = new _google["default"](agarApp, $);
  var defaultStorage = {
    get: function get() {
      return {
        'context': null,
        'defaultProvider': 'facebook',
        'loginIntent': '0',
        'browserId': '',
        'userInfo': {
          'socialToken': null,
          'tokenExpires': '',
          'level': '',
          'xp': '',
          'xpNeeded': '',
          'name': '',
          'picture': '',
          'displayName': '',
          'loggedIn': '0',
          'socialId': ''
        },
        'videoToken': ''
      };
    }
  };
  window['defaultSt'] = defaultStorage.get();
  window['fbAsyncInit'] = facebook.asyncInit;
  var userInfo;
  var context;
  agarApp.storageInfo = defaultStorage.get();
  window['createDefaultStorage'] = createDefaultStorage;
  document.addEventListener('logout', function () {
    _index.store.dispatch('settings/load');
  });
  document.addEventListener('login', function () {
    _index.store.dispatch('settings/load');
  });
  readLocalData();
  function createDefaultStorage() {
    agarApp.storageInfo = defaultStorage.get();
  }
  function performLogin(value) {
    context = value;
    if (context == 'google' || context == 'facebook') {
      agarApp.storageInfo['context'] = context;
      updateStorage();
    }
  }
  window['updateStorage'] = updateStorage;
  function updateStorage() {
    var successful = true;
    var browserId = agarApp.storageInfo.browserId;
    try {
      window.localStorage.setItem(_storageKeys["default"].STORAGE_INFO_KEY, JSON.stringify(agarApp.storageInfo));
    } catch (error) {
      successful = false;
    }
    if (successful) {
      agarApp.storageInfo = JSON.parse(window.localStorage.getItem(_storageKeys["default"].STORAGE_INFO_KEY));
    }
    if (browserId) {
      agarApp.storageInfo.browserId = browserId;
    }
    validateContext();
  }
  function validateContext() {
    context = agarApp.storageInfo.context;
    if (context == 'google') {
      $('#googleShare')['show']();
      $('#fbShare')['hide']();
    } else {
      $('#googleShare')['hide']();
      $('#fbShare')['show']();
    }
  }

  // Draw the user profile data
  function _setUserData(_userInfo) {
    userInfo = _userInfo;
    userInfo['name'] = window['userInfoName'];
    if (userInfo['displayName'] != '') {
      userInfo['name'] = userInfo['displayName'];
    }
    if (userInfo['name'] == null || userInfo['name'] == undefined) {
      userInfo['name'] = '';
    }
    var idx = userInfo['name'].lastIndexOf('_');
    if (idx != -1) {
      userInfo['name'] = userInfo['name'].substring(0, idx);
    }
    var customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent('update_xp', true, true, {
      currentXp: userInfo['xp'],
      totalXp: userInfo['xpNeeded'],
      level: userInfo['level']
    });
    document.dispatchEvent(customEvent);

    // We will not store personal info on local storage
    agarApp.storageInfo['userInfo']['level'] = userInfo['level'];
    agarApp.storageInfo['userInfo']['xp'] = userInfo['xp'];
    agarApp.storageInfo['userInfo']['xpNeeded'] = userInfo['xpNeeded'];
    agarApp.storageInfo['userInfo']['displayName'] = userInfo['name'];
    agarApp.storageInfo['userInfo']['loggedIn'] = '1';
    window['updateStorage']();
    updateLoggedUserInfo();
  }
  window['hasLoginIntent'] = function () {
    return agarApp.storageInfo['loginIntent'] == '1';
  };

  // Process the local data stored on localstorage
  function readLocalData() {
    var browserId = agarApp.storageInfo.browserId;
    var storageObjInfo = window.localStorage.getItem(_storageKeys["default"].STORAGE_INFO_KEY);
    if (storageObjInfo != null) {
      agarApp.storageInfo = JSON.parse(storageObjInfo);
    }
    if (browserId) {
      agarApp.storageInfo.browserId = browserId;
    }
  }
  function processLocalData(MiniclipAPI) {
    MC = MiniclipAPI;

    // populate user profile with cached data
    if (agarApp.storageInfo['userInfo']['name'] != '' || agarApp.storageInfo['userInfo']['displayName'] != '') {
      _setUserData(agarApp.storageInfo['userInfo']);
    }
    if (agarApp.storageInfo['loginIntent'] == '1') {
      performLogin(agarApp.storageInfo['context']);
    } else {
      MC.setGuest();
    }
    checkForRewardLinks();
  }

  // function checkLoginStatus() {
  //     if (agarApp.storageInfo['loginIntent'] == '1') {
  //         updateLoggedUserInfo();
  //         performLogin(agarApp.storageInfo['context']);
  //     }
  // }

  function updateLoggedUserInfo() {
    MC.setSocialId(agarApp.storageInfo['userInfo']['socialId']);
  }

  // Stupid global functions go here:
  window['logout'] = function () {
    if (agarApp.storageInfo.context == 'google') {
      google.logoutGoogle();
    }
    agarApp.cache['sentGameServerLogin'] = false;
    delete agarApp.cache['login_info'];
    MC.doLogout();
    MC.reconnect(true);
    agarApp.storageInfo = defaultStorage.get();
    agarApp.main.initBrowserId();
    updateStorage();

    // google analytics
    // window.ga('send', 'event', 'Logout', context);
  };
  function _setAccountData(obj, shouldAnimate) {
    var userInfo = agarApp.storageInfo['userInfo'];
    userInfo['xp'] = obj['xp'];
    userInfo['xpNeeded'] = obj['xpNeeded'];
    userInfo['level'] = obj['level'];
    updateStorage();
    var customEvent = document.createEvent('CustomEvent');
    customEvent.initCustomEvent('update_xp', true, true, {
      currentXp: userInfo['xp'],
      totalXp: userInfo['xpNeeded'],
      level: userInfo['level']
    });
    document.dispatchEvent(customEvent);
  }

  /**
   * Animate the user level bar
   * @param {Object=} opt_obj
   * @param {function()=} opt_fcb
   */
  function _animateAccountData(opt_obj, opt_fcb) {
    var obj = opt_obj;
    var isLoggedIn = agarApp.storageInfo['userInfo']['loggedIn'];
    if (!isLoggedIn) return;
    var shouldAnimate = false;
    if (obj == null || obj == undefined) {
      obj = agarApp.storageInfo['userInfo'];
    }
    // Workaround to detect if we're animating or if we have a final result
    if (shouldAnimate) {
      var initialXP = +$('.progress-bar-text')['first']()['text']().split('/')[0];
      var initialXPNeeded = +$('.progress-bar-text')['first']()['text']().split('/')[1].split(' ')[0];
      var initialLevel = $('.agario-profile-panel .progress-bar-star')['first']()['text']();
      // Leveled up
      if (initialLevel != obj['level']) {
        _animateAccountData({
          'xp': initialXPNeeded,
          'xpNeeded': initialXPNeeded,
          'level': initialLevel
        }, function () {
          $('.agario-exp-bar .progress-bar')['css']('width', '100%');
          var animations = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
          $('.progress-bar-star')['addClass']('animated tada')['one'](animations, function () {
            $('.progress-bar-star')['removeClass']('animated tada');
          });
          setTimeout(function () {
            var customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent('update_xp', true, true, {
              currentXp: userInfo['xp'],
              totalXp: userInfo['xpNeeded'],
              level: userInfo['level']
            });
            document.dispatchEvent(customEvent);
            _animateAccountData({
              'xp': 0,
              'xpNeeded': obj['xpNeeded'],
              'level': obj['level']
            }, function () {
              _animateAccountData(obj);
            });
          }, 1000);
        });
      } else {
        var start = Date.now();
        var _cb = function cb() {
          var progress = _utils["default"].smoothStep2((Date.now() - start) / 1000);
          var xp = ~~(initialXP + (obj['xp'] - initialXP) * progress) + '/' + obj['xpNeeded'] + ' XP';
          $('.agario-exp-bar .progress-bar-text')['text'](xp);
          var w = 88 * (initialXP + (obj['xp'] - initialXP) * progress) / obj['xpNeeded'];
          $('.agario-exp-bar .progress-bar')['css']('width', w.toFixed(2) + '%');
          if (opt_fcb) opt_fcb();
          if (progress < 1.0) {
            window.requestAnimationFrame(_cb);
          }
        };
        window.requestAnimationFrame(_cb);
      }
    }
  }
  window['animateAccountData'] = _animateAccountData;
  var _userInfo = null;
  function handleUserLogin(event, userInfo) {
    // console.log(Utils.ptime() + " got user login");

    // no need to reset supersonic ads if the user hasn't changed.
    if (_userInfo != null && _userInfo.id == userInfo.id) return;
    _userInfo = userInfo;
    if (window['ssa_json'] != null) {
      window['ssa_json']['applicationUserId'] = '' + userInfo.id;
      window['ssa_json']['custom_user_id'] = '' + userInfo.id;
    }
    if (typeof window.SSA_CORE != 'undefined') {
      window.SSA_CORE['start']();
    }
  }
  function checkForRewardLinks() {
    agarApp.main.queryManager.init();
  }
  function onFacebookLoginResponse(response) {
    if (response.authResponse == null) return;
    var fbtoken = response.authResponse.accessToken;
    if (fbtoken) {
      updateLoggedUserInfo();
    }
  }
  function setUserAnalytics(userId, sessionId) {
    if (!agarApp.MCSDK) {
      // console.error("MCSDK not ready yet!");
      return;
    }
    if (userId !== '') {
      // Is not guest!
      agarApp.MCSDK.setSessionId(sessionId);
      agarApp.MCSDK.setUserId(userId);
    }
  }
  function setBrowserId(browserId) {
    agarApp.storageInfo.browserId = browserId;
  }
  function onLoginSuccess() {
    updateLoggedUserInfo();
  }
  function onLoginFail() {
    MC.setGuest();
  }
  return {
    facebook: facebook,
    google: google,
    init: function init() {
      agarApp.core.bind('user_login', handleUserLogin);
      google.loadServices();
      google.init();
    },
    setUserData: function setUserData(data) {
      _setUserData(data);
    },
    setAccountData: function setAccountData(data, shouldAnimate) {
      _setAccountData(data, shouldAnimate);
    },
    animateAccountData: function animateAccountData(obj) {
      _animateAccountData(obj);
    },
    processLocalData: processLocalData,
    updateLoggedUserInfo: updateLoggedUserInfo,
    checkLogin: function checkLogin() {
      if (!agarApp.hasInitialized()) return;
      var info = agarApp.storageInfo;
      var isInFacebook = window.location.search.indexOf('fb') != -1;
      if (isInFacebook || info.loginIntent == '1' && info.context == 'facebook') {
        facebook.checkLogin(this.onCheckLoginResponse);
      } else if (info.loginIntent == '1' && info.context == 'google') {
        google.checkGoogleLogin(this.onCheckLoginResponse);
      }
    },
    onCheckLoginResponse: function onCheckLoginResponse(result) {
      if (result) {
        onLoginSuccess();
      } else {
        onLoginFail();
      }
    },
    facebookLogin: function facebookLogin(callback) {
      facebook.login(function (res) {
        onFacebookLoginResponse(res);
        callback(res);
      });
    },
    setUserAnalytics: setUserAnalytics,
    setBrowserId: setBrowserId
  };
}

/***/ }),
/* 381 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _userEvents = _interopRequireDefault(__webpack_require__(85));
var EnvConfig = global.EnvConfig;
function _default(agarApp, $) {
  var retryAttempts = 0;
  var fbLoaded = false;
  var fbInitted = false;
  var fbScope = 'public_profile,email,user_friends';
  var FB = null;
  function fbAsyncInit() {
    FB = window['FB'];

    // console.timeEnd("fbAsyncInit");
    FB.init({
      'appId': EnvConfig['fb_app_id'],
      'cookie': true,
      'xfbml': true,
      'status': true,
      'version': 'v3.2'
    });
    fbLoaded = true;
    if (EnvConfig['env_staging'] || EnvConfig['env_production']) {
      (function (d, t) {
        var g = d.createElement(t);
        var s = d.getElementsByTagName(t)[0];
        g.src = 'https://renotifier.miniclippt.com/rntracking.js?app_id=' + EnvConfig['fb_app_id'];
        s.parentNode.insertBefore(g, s);
      })(document, 'script');
    }
  }
  function checkFacebookLogin(callback) {
    if (fbInitted == true || fbLoaded == false) return;
    fbInitted = true;

    // Check the login status with this user for facebook (If he is logged in and has granted permissions)
    // window['ga']('send', 'event', 'Login', 'Facebook', 'Check', {nonInteraction: true});
    FB.getLoginStatus(function (response) {
      // log resut
      // window['ga']('send', 'event', 'Login', 'Facebook', response.status, {nonInteraction: true});

      if (response.status === 'connected') {
        // the user is logged in and has authenticated
        fbLoginCallback(response);
        if (callback) {
          callback(true);
        }
      } else if (response.status === 'authorization_expired') {
        // the user isn't logged in to Facebook.
        // attempt to login
        facebookLogin(callback);
      } else {
        if (callback) {
          callback(false);
        }
      }
    });
  }
  function facebookReconnect(callback) {
    fbInitted = false;
    window['logout']();
    facebookRelogin(callback);
  }
  function facebookRelogin(callback) {
    facebookLogin(callback);
  }
  function facebookLogin(callback) {
    if (FB == null) {
      alert('You seem to have something blocking Facebook on your browser, please check for any extensions');
      callback(null);
      // window['ga']('send', 'event', 'Login', 'Facebook', 'API not found!', {nonInteraction: true});
    } else {
      // Maximum waiting time for user to react
      // After that assume that login has failed
      var wait = 10 * 1000;
      var timeout = setTimeout(function () {
        callback(false);
      }, wait);

      // Make the API call
      FB.login(function (response) {
        clearTimeout(timeout);
        fbLoginCallback(response);
        if (callback) {
          callback(response);
        }
      }, {
        'scope': fbScope,
        'auth_type': 'rerequest'
      });
    }
  }
  function fbLoginCallback(response) {
    if (response.status != 'connected') {
      agarApp.storageInfo['loginIntent'] = '0';
      window['updateStorage']();
      return;
    }
    var fbtoken = response['authResponse']['accessToken'];
    if (fbtoken == null || fbtoken == 'undefined' || fbtoken == '') {
      // window['ga']('send', 'event', 'Login', 'Facebook', 'invalid token', {nonInteraction: true});

      window['logout']();

      // Relogin when token isn't allright
      if (retryAttempts < 3) {
        retryAttempts++;
        facebookRelogin();
      }
      document.dispatchEvent(new Event(_userEvents["default"].LOGIN_UNSUCCESSFUL));
    } else {
      // window['ga']('send', 'event', 'Login', 'Facebook', 'Success', {nonInteraction: true});

      retryAttempts = 0;
      fetchFacebookPermissions();

      // Login on shop
      agarApp.API.doLoginWithFB(response['authResponse']);
      agarApp.cache['login_info'] = [fbtoken, 'facebook'];
      // agarApp.networking.sendLoginToken(fbtoken, 'facebook');

      // Get and store FBPicture
      // Old way
      var url = 'https://graph.facebook.com/' + response['authResponse']['userID'] + '/picture?width=180&height=180';
      agarApp.API.setProfilePicture(url);
      // New way
      FB.api('/me/picture', 'GET', {
        'redirect': 'false',
        'width': 180,
        'height': 180
      }, function (pictureResponse) {
        if (pictureResponse.data) {
          agarApp.API.setProfilePicture(pictureResponse.data.url);
        }
      });
      $('#helloContainer')['attr']('data-logged-in', '1');
      agarApp.storageInfo['userInfo']['socialId'] = response['authResponse']['userID'];
      agarApp.storageInfo['context'] = 'facebook';
      agarApp.storageInfo['loginIntent'] = '1';
      window['updateStorage']();
    }
  }
  function getAnalyticsData(callback) {
    FB.api('/me/?fields=id,gender,token_for_business,name,email', function (dataResponse) {
      var obj = {
        'facebook_id': dataResponse.id,
        'facebook_id_for_business': dataResponse.token_for_business,
        'gender': dataResponse.gender,
        'login_type': 'Facebook'
      };
      window['userInfoEmail'] = dataResponse.email;
      window['userInfoName'] = dataResponse.name;
      window['userInfoFullName'] = dataResponse.name;
      callback(obj);
    });
  }
  function fetchFacebookPermissions() {
    FB.api('/me/permissions', function (response) {
      if (response && response.data) {
        agarApp.storageInfo['permissions'] = response.data;
      }
    });
  }
  function getFacebookPermissions() {
    return agarApp.storageInfo['permissions'];
  }
  function checkFacebookPermissions(permissions) {
    var fbPermissionsFunc = getFacebookPermissions;
    if (fbPermissionsFunc) {
      var fbPermissions = fbPermissionsFunc();
      var permissionsList = permissions.split(',');
      if (fbPermissions == null) {
        return false;
      }
      for (var k = 0; k < permissionsList.length; k++) {
        var found = false;
        for (var i = 0; i < fbPermissions.length; i++) {
          if (permissionsList[k] == fbPermissions[i].permission && fbPermissions[i].status == 'granted') {
            found = true;
          }
        }
        if (!found) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }
  function requestExtraPermissions(new_permissions) {
    var granted = checkFacebookPermissions(new_permissions);
    if (!granted) {
      if (fbScope.indexOf(new_permissions) == -1) {
        fbScope += ',' + new_permissions;
      }
      facebookLogin();
    }
    return !granted;
  }
  return {
    asyncInit: fbAsyncInit,
    login: facebookLogin,
    checkLogin: checkFacebookLogin,
    getFacebookPermissions: getFacebookPermissions,
    fetchFacebookPermissions: fetchFacebookPermissions,
    requestExtraPermissions: requestExtraPermissions,
    checkFacebookPermissions: checkFacebookPermissions,
    facebookReconnect: facebookReconnect,
    facebookRelogin: facebookRelogin,
    getAnalyticsData: getAnalyticsData
  };
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _underscore = _interopRequireDefault(__webpack_require__(66));
var _userEvents = _interopRequireDefault(__webpack_require__(85));
/* eslint-disable prefer-rest-params */
var EnvConfig = window.EnvConfig;
function _default(agarApp, $) {
  var googleConnected = false;
  var google = function () {
    var events = {};
    var gapiLoaded = false;
    var loadGoogleServices = function loadGoogleServices() {
      var e = document.createElement('script');
      e.type = 'text/javascript';
      e.async = true;
      e.src = '//apis.google.com/js/platform.js?onload=gapiAsyncInit';
      var t = document.getElementsByTagName('script')[0];
      t.parentNode.insertBefore(e, t);
      gapiLoaded = true;
    };
    window.gapiAsyncInit = function () {
      $(events).trigger('initialized');
    };
    var exports = {};
    exports.google = {
      loadServices: function loadServices() {
        loadGoogleServices();
      },
      getMeProfile: function getMeProfile(auth, callback) {
        if (window.gapi && auth.isSignedIn.get()) {
          callback(auth.currentUser.get().getBasicProfile());
        }
      }
    };
    exports.onGoogleInit = function (callback) {
      if (!gapiLoaded) {
        loadGoogleServices();
      }
      if (typeof gapi !== 'undefined') {
        callback();
      } else {
        $(events).on('initialized', callback);
      }
    };
    return exports;
  }();
  var googleModule = function () {
    var googleLoaded = false;
    var googleLoginChecked = false;
    var auth2 = null;
    var authorizeOpts = {
      'client_id': EnvConfig.google_client_id,
      'cookie_policy': 'single_host_origin',
      'scope': 'profile',
      'app_package_name': 'com.miniclip.agar.io'
    };
    var loadProfilePicture = function loadProfilePicture(avatar) {
      if (avatar) {
        agarApp.API.setProfilePicture(avatar);
      }
    };
    var handleUserProfile = function handleUserProfile(profile) {
      if (profile) {
        loadProfilePicture(profile.getImageUrl());
      }
    };
    var validateUserToken = function validateUserToken(authResponse) {
      agarApp.API.doLoginWithGoogle(authResponse);
      agarApp.cache.login_info = [authResponse.access_token, 'google'];
    };
    var exports = {
      userAuth: function userAuth() {
        return auth2;
      },
      shouldCheckLogin: function shouldCheckLogin() {
        return agarApp.storageInfo && agarApp.storageInfo.loginIntent == '1' && agarApp.storageInfo.context == 'google';
      },
      init: function init() {
        var self = this;
        google.onGoogleInit(function () {
          window.gapi.ytsubscribe.go('agarYoutube');
          googleLoaded = true;
          self.checkGoogleLogin(agarApp.API.googleLogin);
        });
      },
      relogin: function relogin(callback) {
        this.getUserAuthResponse();
        callback(true);
      },
      checkGoogleLogin: function checkGoogleLogin(callback, force) {
        if (force == null) {
          force = false;
        }
        if (!force && (googleLoginChecked == true || agarApp.hasInitialized() == false || googleLoaded == false)) {
          return;
        }
        googleLoginChecked = true;
        var self = this;
        window.gapi.load('auth2', function () {
          auth2 = window.gapi.auth2.init(authorizeOpts);
          document.addEventListener('google_selected', function () {
            agarApp.API.googleLoginClicked();
            // console.log("googleLogin clicked!");
            agarApp.storageInfo.context = 'google';
            agarApp.storageInfo.loginIntent = '1';
            window.updateStorage();
            googleModule.onAuthPopupOpen(window.open, auth2, callback);
            self.googleRelogin(callback);
          });
          auth2.currentUser.listen(_underscore["default"].bind(googleModule.onChangeUser, self));
          auth2.then(_underscore["default"].bind(googleModule.onAuthInitComplete, self), _underscore["default"].bind(googleModule.onAuthError, self));
        });
      },
      // Controls when popup is closed
      onAuthPopupOpen: function onAuthPopupOpen(wrapped, auth2, callback) {
        window.open = function () {
          // re-assign the original window.open after one usage
          window.open = wrapped;
          var win = wrapped.apply(this, arguments);
          var i = setInterval(function () {
            if (win.closed) {
              clearInterval(i);
              var logged = auth2 && auth2.isSignedIn.get();
              callback(logged && googleConnected);
            }
          }, 100);
          return win;
        };
      },
      onAuthInitComplete: function onAuthInitComplete(authResult) {
        if (!googleModule.shouldCheckLogin()) return;
        if (!auth2.isSignedIn.get()) {
          agarApp.API.googleLoginClicked();
          auth2.signIn().then(googleModule.onLoginComplete, googleModule.onLoginError)["catch"](self.onAuthError);
        }
      },
      onAuthHasToken: function onAuthHasToken(access_token) {
        if (!auth2.isSignedIn.get()) {
          agarApp.API.googleLoginClicked();
          auth2.signIn().then(function (result) {
            // success
          }, function (error) {
            window.userInfoName = null;
            $('#helloContainer').attr('data-logged-in', '0');
            agarApp.API.onGoogleLoginComplete(false);
          })["catch"](self.onAuthError);
        }
      },
      onAuthError: function onAuthError(error) {
        /* eslint-disable no-console */
        console.info('Failed to login in google: ', JSON.stringify(error, undefined, 2));
        window.logout();
        document.dispatchEvent(new Event(_userEvents["default"].LOGIN_UNSUCCESSFUL));
      },
      onLoginComplete: function onLoginComplete(authResult) {
        googleModule.onAuthHasToken(authResult.access_token);
      },
      onLoginError: function onLoginError(error) {
        window.userInfoName = null;
        $('#helloContainer').attr('data-logged-in', '0');
        agarApp.API.onGoogleLoginComplete(false);
        console.log(error);
        if (error == 'immediate_failed') {
          auth2.authorize({
            client_id: EnvConfig.google_client_id,
            scope: 'profile',
            immediate: true
          }, function (authRes) {
            if (authRes.status.signed_in) {
              googleModule.onAuthHasToken(authRes.access_token);
            }
          });
        }
      },
      getUserAuthResponse: function getUserAuthResponse() {
        var user = auth2.currentUser.get();
        if (user != null && user.isSignedIn()) {
          var authResponse = user.getAuthResponse();
          handleUserProfile(user.getBasicProfile());
          validateUserToken(authResponse);
        } else {
          auth2.signIn();
        }
      },
      onChangeUser: function onChangeUser(user) {
        if (auth2 == null || user == null) return;
        if (!googleModule.shouldCheckLogin()) return;
        var isSignedIn = auth2.isSignedIn.get();
        if (isSignedIn && !googleConnected) {
          googleConnected = true;
          var authResponse = user.getAuthResponse();
          // console.log('loggedIn with Google!');

          // set picture
          var profile = user.getBasicProfile();
          var imageUrl = profile.getImageUrl();

          // sometimes the profile might not have a profile picture.
          if (imageUrl == undefined) {
            google.google.getMeProfile(auth2, function (profile) {
              if (profile) {
                imageUrl = profile.getImageUrl();
              }
            });
          }
          agarApp.storageInfo.userInfo.socialId = profile.getId();
          agarApp.account.updateLoggedUserInfo();
          handleUserProfile(profile);
          validateUserToken(authResponse);
          window.updateStorage();
          window.userInfoEmail = profile.getEmail();
          window.userInfoName = profile.getGivenName();
          window.userInfoFullName = profile.getName();
          $('#helloContainer').attr('data-logged-in', '1');
          loadProfilePicture(imageUrl);
          agarApp.API.onGoogleLoginComplete(true);
        } else {
          // agarApp.API.onGoogleLoginComplete(false);
        }
      },
      logout: function logout() {
        if (!auth2) return;
        auth2.signOut();
        googleConnected = false;
      },
      getAnalyticsData: function getAnalyticsData(callback) {
        googleGetAnalyticsData(auth2, callback);
      }
    };
    return exports;
  }();
  function googleGetAnalyticsData(auth2, callback) {
    google.google.getMeProfile(auth2, function (profile) {
      var obj = {
        'gender': profile.gender,
        'google_plus_id': profile.id,
        'login_type': 'Google'
      };
      callback(obj);
    });
  }
  return {
    loadServices: google.google.loadServices,
    init: googleModule.init,
    checkGoogleLogin: googleModule.checkGoogleLogin,
    logoutGoogle: googleModule.logout,
    googleRelogin: googleModule.relogin,
    sendAnalyticsEvent: googleModule.sendAnalyticsEvent,
    getUserAuthResponse: googleModule.getUserAuthResponse,
    getAnalyticsData: googleModule.getAnalyticsData
  };
}

/***/ }),
/* 383 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.social = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
/* eslint-disable camelcase */
var Social = /*#__PURE__*/function () {
  function Social() {
    (0, _classCallCheck2["default"])(this, Social);
  }
  return (0, _createClass2["default"])(Social, [{
    key: "fbShare",
    value: function fbShare(name, caption, description, link, picture, action_name, action_link, opt_callback) {
      link += '?title=' + encodeURIComponent(name) + '&description=' + encodeURIComponent(description) + '&image=' + encodeURIComponent(picture);
      var fbCallbackShare = opt_callback;
      var shareOptions = {
        method: 'feed',
        display: 'popup',
        caption: caption,
        link: link
      };
      if (fbCallbackShare != null) {
        window['FB']['ui'](shareOptions, fbCallbackShare);
      } else {
        window['FB']['ui'](shareOptions);
      }
    }
  }, {
    key: "twitterShare",
    value: function twitterShare(description) {
      var params = 'text=' + description;
      var targetUrl = 'https://twitter.com/intent/tweet?' + params;
      var width = 660;
      var height = 310;
      var windowOptions = 'width=' + width + ',height=' + height + ',menubar=no,toolbar=no,resizable=yes,scrollbars=no';
      window.open(targetUrl, 'Agar.io', windowOptions + ',left=' + (window.screenX + window.innerWidth / 2 - width / 2) + ',top=' + (window.innerHeight - height) / 2);
    }
  }, {
    key: "twitterShareStats",
    value: function twitterShareStats(text) {
      this.twitterShare(text);
    }
  }, {
    key: "fbShareStats",
    value: function fbShareStats(text) {
      this.fbShare(window.agarApp.i18n.get('page_fb_matchresults_title'), window.agarApp.i18n.get('page_fb_matchresults_description'), text, 'https://r.agar.io', 'https://static.miniclip.com/mobile/agar/Agar.io_matchresults_fb_1200x630.png', 'play now!', 'https://r.agar.io');
    }
  }, {
    key: "fillSocialValues",
    value: function fillSocialValues(value, target) {
      if (window.agarApp.storageInfo['context'] == 'google') {
        document.getElementById(target).click = function (e) {
          window.open('https://plus.google.com/share?url=' + window.EnvConfig['game_url'] + '&text=' + value, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=400');
        };
      }
    }
  }]);
}();
var social = exports.social = new Social();

/***/ }),
/* 384 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__webpack_provided_window_dot_jQuery) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifications = void 0;
var notifications = exports.notifications = function (window, $) {
  return {
    sendNotification: function sendNotification(title, body, icon) {
      if (window.Notification && Notification.permission !== 'denied') {
        // status is "granted", if accepted by user
        Notification.requestPermission(function (status) {
          new Notification(title, {
            body: body,
            icon: icon // optional
          });
        });
      }
    }
  };
}(window, __webpack_provided_window_dot_jQuery);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 385 */,
/* 386 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Main = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
var _logo = __webpack_require__(387);
var _io = __webpack_require__(388);
var _countries = __webpack_require__(389);
var _imprint = _interopRequireDefault(__webpack_require__(390));
var _mcsdk = __webpack_require__(86);
var _datadog = __webpack_require__(392);
var _index = __webpack_require__(5);
var _queryManager = _interopRequireDefault(__webpack_require__(83));
var _queryHandler = _interopRequireDefault(__webpack_require__(399));
// main app
var Main = exports.Main = /*#__PURE__*/function () {
  function Main(agarApp) {
    (0, _classCallCheck2["default"])(this, Main);
    (0, _logo.logo)();
    if (!this.testCanvas() || this.detectMobile()) {
      return;
    }
    this.agarApp = agarApp;
    this.initialized = false;
    this.waitForBrowserId = false;
    this.countryCode = '';
    this.registerQueryHandlers();
    this.secureRedirect();
    window.addEventListener(_mcsdk.MCSDK.EVENT_READY, this.onGoliathReady.bind(this));
    window.addEventListener(_mcsdk.MCSDK.EVENT_UNLOAD, this.onGoliathUnload.bind(this));
  }
  return (0, _createClass2["default"])(Main, [{
    key: "registerQueryHandlers",
    value: function registerQueryHandlers() {
      var _this = this;
      this._queryManager = new _queryManager["default"]();
      this._queryManager.register(new _queryHandler["default"](['awardToken'], function (queryValues) {
        if (_this.agarApp.API.isGuest() && !window.hasLoginIntent()) {
          window.document.dispatchEvent(new CustomEvent('reward_links_response')); // Open guest dialog
        }

        // Wait for login
        var _callback = function callback() {
          if (!_this.agarApp.API.isGuest()) {
            _this.sendRewardLinkTokenMessage(queryValues.awardToken);
            window.document.removeEventListener('login_state_update', _callback);
          }
        };
        window.document.addEventListener('login_state_update', _callback);
      }, function (error) {}));
    }
  }, {
    key: "sendRewardLinkTokenMessage",
    value: function sendRewardLinkTokenMessage(token) {
      var _this2 = this;
      this.agarApp.API.sendRewardLinkTokenMessage(token).then(function (response) {
        var obj = _this2.agarApp.API.parseRewardLinkResponse(response);
        window.document.dispatchEvent(new CustomEvent('reward_links_response', {
          detail: obj
        }));
        var url = new URL(window.location);
        var params = new URLSearchParams(url.search);
        params["delete"]('awardToken');
        url.search = params;
        window.history.pushState({}, null, url);
      });
    }
  }, {
    key: "testCanvas",
    value: function testCanvas() {
      var testCanvas = document.createElement('canvas');
      if (typeof console == 'undefined' || typeof DataView == 'undefined' || typeof WebSocket == 'undefined' || testCanvas == null || testCanvas.getContext == null || window.localStorage == null) {
        alert('You browser does not support this game, ' + 'we recommend you to use Chrome, Firefox or Safari to play this game.');
        return false;
      } else {
        return true;
      }
    }
  }, {
    key: "queryManager",
    get: function get() {
      return this._queryManager;
    }
  }, {
    key: "secureRedirect",
    value: function secureRedirect() {
      var protocol = window.location.protocol;
      if (protocol == 'http:' && 'local,dev'.indexOf(window.EnvConfig.currentEnv) == -1) {
        window.location.href = 'https:' + window.location.href.substring(protocol.length);
      }
    }
  }, {
    key: "detectMobile",
    value: function detectMobile() {
      var ua = window.navigator.userAgent;
      if (ua.indexOf('Android') != -1) {
        /*
        if (window['ga']) {
            window['ga']('send', 'event', 'MobileRedirect', 'PlayStore');
        }
         */
        setTimeout(function () {
          window.location.href = 'https://play.google.com/store/apps/' + 'details?id=com.miniclip.agar.io';
        }, 1000);
        return true;
      }
      if (ua.indexOf('iPhone') != -1 || ua.indexOf('iPad') != -1 || ua.indexOf('iPod') != -1) {
        /*
        if (window['ga']) {
            window['ga']('send', 'event', 'MobileRedirect', 'AppStore');
        }
        */

        setTimeout(function () {
          window.location.href = 'https://itunes.apple.com/app/agar.io/' + 'id995999703?mt=8&at=1l3vajp';
        }, 1000);
        return true;
      }
      return false;
    }
  }, {
    key: "agarioInit",
    value: function agarioInit(MC) {
      MC.wasInitialized();
      this.initialized = true;
      this.initBrowserId();
      this.agarApp.account.processLocalData(MC);

      // check initial user login
      this.agarApp.account.checkLogin();
      MC.getLatestConfigurationID();
      this.agarApp.core.init();
      MC.refreshRegionInfo();
      setInterval(MC.refreshRegionInfo, 3 * 60 * 1000);
      if (/firefox/i.test(navigator.userAgent)) {
        document.addEventListener('DOMMouseScroll', _io.io.onMouseWheel, false);
      } else {
        document.body['onmousewheel'] = _io.io.onMouseWheel;
      }
      this.loadCountryCodes(MC);

      // set the correct gamemode
      if (this.hasPartyToken()) {
        // Try to join a party
        // MC.joinParty(getPartyToken());
      } else {
        var mode = this.getGameMode();
        if (mode) {
          MC.setGameMode(mode, false);
        } else {
          // otherwise get a new gameserver
          MC.setGameMode(window.presetGameMode, false);
        }
        MC.checkRegion();
      }
      MC.setInGameState(false);
    }
  }, {
    key: "initBrowserId",
    value: function initBrowserId() {
      var _this3 = this;
      var browserTests = ['audio', 'availableScreenResolution', 'canvas', 'colorDepth', 'cookies', 'cpuClass', 'deviceDpi', 'doNotTrack', 'indexedDb', 'installedFonts', 'language', 'localIp', 'localStorage', 'pixelRatio', 'platform', 'plugins', 'processorCores', 'screenResolution', 'sessionStorage', 'timezoneOffset', 'touchSupport', 'userAgent', 'webGl'];
      _imprint["default"].test(browserTests).then(function (result) {
        // save browser id
        _this3.agarApp.account.setBrowserId(result);
        if (_this3.waitForBrowserId) {
          _this3.initGuestAnalytics();
        }
      })["catch"](function (reason) {
        // do nothing
        throw reason;
      });
    }
  }, {
    key: "hasPartyToken",
    value: function hasPartyToken() {
      return this.getPartyToken() != '';
    }
  }, {
    key: "getPartyToken",
    value: function getPartyToken() {
      // Party code for web expected to have 6 characters
      if (window.location.hash && window.location.hash.length == 7) {
        return window.location.hash;
      }
      var search = this.parseQuery(window.location.search);
      if (search.party && search.party.length == 7) {
        return 'M' + search.party;
      }
      return '';
    }
  }, {
    key: "getGameMode",
    value: function getGameMode() {
      var gamemodes = ['ffa', 'experimental', 'party', 'teams', 'teamrush', 'battleroyale'];
      var hash = window.location.hash;
      for (var i = 0; i < gamemodes.length; i++) {
        if (hash.indexOf(gamemodes[i]) > -1) {
          return ':' + gamemodes[i];
        }
      }
      return null;
    }

    /**
    * Parse the query url and return a dict with the url parameters
    * @param {string} queryUrl query Url to parse
    * @return {string}
    */
  }, {
    key: "parseQuery",
    value: function parseQuery(queryUrl) {
      if (queryUrl.startsWith('?')) queryUrl = queryUrl.substr(1);
      var kvs = queryUrl.split('&');
      var dict = {};
      for (var i = 0; i < kvs.length; i++) {
        var pair = window.decodeURIComponent(kvs[i]).split('=');
        dict[pair[0]] = pair[1];
      }
      return dict;
    }
  }, {
    key: "loadCountryCodes",
    value: function loadCountryCodes(MC) {
      var url = window.EnvConfig['master_url'] + '/getCountry';
      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var json = JSON.parse(this.responseText);
            self.countryCode = json.country;
          } else {
            self.countryCode = 'US';
          }
          self.setCountryCode(MC, self.countryCode, '');
        }
      };
      xhr.open('GET', url, true);
      xhr.timeout = 5000;
      xhr.ontimeout = function () {
        self.countryCode = 'US';
        self.setCountryCode(MC, self.countryCode, '');
      };
      xhr.send();
    }
  }, {
    key: "setCountryCode",
    value: function setCountryCode(MC, countryCode, subcountryCode) {
      // console.log("Country:", countryCode, subcountryCode);
      var regionChanged = false;
      var serverRegion = MC.getRegion();
      if (_countries.countries.hasOwnProperty(countryCode)) {
        if (typeof _countries.countries[countryCode] == 'string') {
          var data = _countries.countries[countryCode].split(';');
          var region = data[0];
          if (!serverRegion) {
            MC.setRegion(region, !this.hasPartyToken());
            regionChanged = true;
          }
        } else {
          if (_countries.countries[countryCode].hasOwnProperty(subcountryCode)) {
            if (!serverRegion) {
              MC.setRegion(_countries.countries[countryCode][subcountryCode], !this.hasPartyToken());
              regionChanged = true;
            }
          }
        }
      }
      if (!regionChanged && !this.hasPartyToken()) {
        MC.reconnect();
      }
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent('country_update', true, true, countryCode);
      window.document.dispatchEvent(evt);
    }
  }, {
    key: "enableTargetedAds",
    value: function enableTargetedAds() {
      // always enable targeted
      // window.agarApp.ads.enableTargetedAds();
    }
  }, {
    key: "disableTargetedAds",
    value: function disableTargetedAds() {
      // window.agarApp.ads.disableTargetedAds();
    }
  }, {
    key: "onGoliathReady",
    value: function onGoliathReady() {
      // init data dog using MCSDK session
      this.initDataDog(this.agarApp.MCSDK.session.getSessionID());
    }
  }, {
    key: "initDataDog",
    value: function initDataDog(UID) {
      var globalTags = [];
      // Following global tag is not being allowed
      // globalTags.push(new DogTag('browser', agarApp.MCSDK.analytics.browser_info));

      var datadog = new _datadog.DataDog(window.EnvConfig.datadog_appid, this.agarApp.API.CLIENT_VERSION, UID, window.EnvConfig.datadog_env, 'web', globalTags);
      window.document.addEventListener('send_analytics_metric', function (options) {
        var type = options.detail.type == 'counter' ? _datadog.DogMetricType.Counter : options.detail.type == 'histogram' ? _datadog.DogMetricType.Histogram : null;
        var metric = new _datadog.DogMetric(options.detail.name, type, true, options.detail.value);
        datadog.send(metric);
      });
    }
  }, {
    key: "initAnalytics",
    value: function initAnalytics() {
      var _this4 = this;
      var realm = _index.store.getters.realm;
      if (_index.store.state.analytics.init) {
        this.sendEndSession();
      }
      if (realm == 'Guest' && (_index.store.state.analytics.init || _index.store.getters.gameState == _index.GameState.PLAY)) {
        // Is playing as guest, session starts now!
        this.initGuestAnalytics();
      } else if (realm == 'Facebook') {
        this.agarApp.account.facebook.getAnalyticsData(function (obj) {
          _this4.sendAnalyticsInitEvent(obj);
        });
      } else if (realm == 'Google') {
        this.agarApp.account.google.getAnalyticsData(function (obj) {
          _this4.sendAnalyticsInitEvent(obj);
        });
      }
    }
  }, {
    key: "initGuestAnalytics",
    value: function initGuestAnalytics() {
      var browserId = this.agarApp.storageInfo.browserId;
      if (!browserId) {
        this.waitForBrowserId = true;
        return;
      }
      if (browserId && this.agarApp.MCSDK.session && this.agarApp.MCSDK.session._userId != browserId) {
        this.agarApp.MCSDK.setUserId('' + browserId);
        this.sendAnalyticsInitEvent(null);
      }
    }
  }, {
    key: "sendAnalyticsInitEvent",
    value: function sendAnalyticsInitEvent(data) {
      this.agarApp.MCSDK.sendInit(data);
      _index.store.commit('analytics/initUpdate', true);
    }
  }, {
    key: "onGoliathUnload",
    value: function onGoliathUnload(e) {
      this.sendEndSession();
    }
  }, {
    key: "sendEndSession",
    value: function sendEndSession() {
      var user = _index.store.state.user;
      if (user.userInfo) {
        this.agarApp.MCSDK.sendEndSession(user.userInfo.totalXp, user.userInfo.level);
      }
      _index.store.commit('analytics/initUpdate', false);
    }
  }, {
    key: "hasInitialized",
    value: function hasInitialized() {
      return this.initialized;
    }
  }]);
}();

/***/ }),
/* 387 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logo = void 0;
/* eslint-disable no-console */

var logo = exports.logo = function logo() {
  try {
    var _logo = ' ' + '      ,,,,,                                                  ╓▄▓▄               \n' + '     ┌▓▓▓▓▓╖                                                 ╙▓▓▀`              \n' + '     ▓▓▓╜▓▓▓        ,╓▄▄▄▄▄▄▄▄┐  ,╓▄▄▄▄▄╖     ╓▄▄ ,╓▄▄⌐      ╓▄▄▄     ╓▄▄▄▄▄,   \n' + '    ╟▓▓▌ ╙▓▓▓      ▓▓▓▀▀▀▓▓▓▓▀`  ▀▓▀▀▀▀▓▓▓╖   ▓▓▓▓▓▓▓▓`      ]▓▓▓   ▄▓▓▓▓▀▓▓▓▓Ç \n' + '   ▐▓▓▓`  ▓▓▓▌    ]▓▓▓   ]▓▓▓     ,,,,,▓▓▓▓   ▓▓▓▓╜          ]▓▓▓  ╟▓▓▓`   j▓▓▓U\n' + '  ╓▓▓▓▓▓▓▓▓▓▓▓╖    ▀▓▓▓▄▄▓▓▓╜   ▄▓▓▓▓▀▀▓▓▓▓   ▓▓▓▌           ]▓▓▓  ▓▓▓▓    ]▓▓▓▌\n' + '  ▓▓▓▓▀▀▀▀▀▀▓▓▓µ   ╔▓▓▀"""     ]▓▓▓▒  ,▓▓▓▓   ▓▓▓▌     ,╓╓,  ]▓▓▓  ╙▓▓▓╖   ▄▓▓▓`\n' + ' ▓▓▓▓       ▓▓▓▓   ╙▓▓▓▓▓▓▓█▓╖  ▓▓▓▓██▓▀▓▓▓   ▓▓▓▌     ▓▓▓▓  ]▓▓▓   ╙▀▓▓▓▓▓▓▓▀  \n' + ' ````        ```` ▄▓▓▀""""▀▓▓▓    """`  ```   ````      ╙"`   ```      `"""`    \n' + '                  ▓▓▓▄,,,╓▄▓▓▓                                                  \n' + '                   ╙▀▀▓▓▓▀▀▀                                                    \n';
    console.log(_logo);
  } catch (e) {
    //
  }
};

/***/ }),
/* 388 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.io = void 0;
var _utils = _interopRequireDefault(__webpack_require__(26));
var io = exports.io = function () {
  var keysDown = {};
  function addKeyListeners() {
    window.onkeydown = function (e) {
      if (keysDown[e.keyCode]) return;
      keysDown[e.keyCode] = true;
      switch (e.keyCode) {
        case 32:
          // space
          if (window['core'] && window['core']['split']) {
            window['core']['split']();
          }
          break;
        case 87:
          if (window['core'] && window['core']['eject']) {
            window['core']['eject']();
          }
          break;
        case 81:
          if (window['core'] && window['core']['specialOn']) {
            window['core']['specialOn']();
          }
          break;
        case 27:
          // ESC Key
          e.preventDefault();
          if (_utils["default"].isVisible('#captchaWindow')) {
            return;
          }
          window.document.dispatchEvent(new Event('show_main_menu'));
          if (_utils["default"].isVisible('#oferwallContainer')) {
            window['closeOfferwall']();
          }
          if (_utils["default"].isVisible('#videoContainer')) {
            window['closeVideoContainer']();
          }
          break;
        /* DEBUG PURPOSES*/
        case 220:
          // Backslash Key
          e.preventDefault();
          window.MC.showStatsDialog();
          break;
      }
    };
    window.onkeyup = function (e) {
      keysDown[e.keyCode] = false;
      if (e.keyCode == 58) {
        if (window['specialOff']) window['core']['specialOff']();
      }
    };
  }
  window['addKeyListeners'] = addKeyListeners;
  function onMouseWheel(e) {
    // e.preventDefault();
    if (window['core'] && window['core']['playerZoom']) {
      window['core']['playerZoom'](e.wheelDelta / -120 || e.detail || 0);
    }
  }
  return {
    onMouseWheel: onMouseWheel
  };
}();

/***/ }),
/* 389 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countries = void 0;
var countries = exports.countries = {
  'AF': 'JP-Tokyo',
  'AX': 'EU-London',
  'AL': 'EU-London',
  'DZ': 'EU-London',
  /* Actually Africa */
  'AS': 'SG-Singapore',
  'AD': 'EU-London',
  'AO': 'EU-London',
  /* Actually Africa */
  'AI': 'US-Atlanta',
  'AG': 'US-Atlanta',
  'AR': 'BR-Brazil',
  'AM': 'JP-Tokyo',
  'AW': 'US-Atlanta',
  'AU': 'SG-Singapore',
  'AT': 'EU-London',
  'AZ': 'JP-Tokyo',
  'BS': 'US-Atlanta',
  'BH': 'JP-Tokyo',
  'BD': 'JP-Tokyo',
  'BB': 'US-Atlanta',
  'BY': 'EU-London',
  'BE': 'EU-London',
  'BZ': 'US-Atlanta',
  'BJ': 'EU-London',
  /* Actually Africa */
  'BM': 'US-Atlanta',
  'BT': 'JP-Tokyo',
  'BO': 'BR-Brazil',
  'BQ': 'US-Atlanta',
  'BA': 'EU-London',
  'BW': 'EU-London',
  /* Actually Africa */
  'BR': 'BR-Brazil',
  'IO': 'JP-Tokyo',
  'VG': 'US-Atlanta',
  'BN': 'JP-Tokyo',
  'BG': 'EU-London',
  'BF': 'EU-London',
  /* Actually Africa */
  'BI': 'EU-London',
  /* Actually Africa */
  'KH': 'JP-Tokyo',
  'CM': 'EU-London',
  /* Actually Africa */
  'CA': 'US-Atlanta',
  'CV': 'EU-London',
  /* Actually Africa */
  'KY': 'US-Atlanta',
  'CF': 'EU-London',
  /* Actually Africa */
  'TD': 'EU-London',
  /* Actually Africa */
  'CL': 'BR-Brazil',
  'CN': 'CN-China',
  'CX': 'JP-Tokyo',
  'CC': 'JP-Tokyo',
  'CO': 'BR-Brazil',
  'KM': 'EU-London',
  /* Actually Africa */
  'CD': 'EU-London',
  /* Actually Africa */
  'CG': 'EU-London',
  /* Actually Africa */
  'CK': 'SG-Singapore',
  'CR': 'US-Atlanta',
  'CI': 'EU-London',
  /* Actually Africa */
  'HR': 'EU-London',
  'CU': 'US-Atlanta',
  'CW': 'US-Atlanta',
  'CY': 'EU-London',
  'CZ': 'EU-London',
  'DK': 'EU-London',
  'DJ': 'EU-London',
  /* Actually Africa */
  'DM': 'US-Atlanta',
  'DO': 'US-Atlanta',
  'EC': 'BR-Brazil',
  'EG': 'EU-London',
  /* Actually Africa */
  'SV': 'US-Atlanta',
  'GQ': 'EU-London',
  /* Actually Africa */
  'ER': 'EU-London',
  /* Actually Africa */
  'EE': 'EU-London',
  'ET': 'EU-London',
  /* Actually Africa */
  'FO': 'EU-London',
  'FK': 'BR-Brazil',
  'FJ': 'SG-Singapore',
  'FI': 'EU-London',
  'FR': 'EU-London',
  'GF': 'BR-Brazil',
  'PF': 'SG-Singapore',
  'GA': 'EU-London',
  /* Actually Africa */
  'GM': 'EU-London',
  /* Actually Africa */
  'GE': 'JP-Tokyo',
  'DE': 'EU-London',
  'GH': 'EU-London',
  /* Actually Africa */
  'GI': 'EU-London',
  'GR': 'EU-London',
  'GL': 'US-Atlanta',
  'GD': 'US-Atlanta',
  'GP': 'US-Atlanta',
  'GU': 'SG-Singapore',
  'GT': 'US-Atlanta',
  'GG': 'EU-London',
  'GN': 'EU-London',
  /* Actually Africa */
  'GW': 'EU-London',
  /* Actually Africa */
  'GY': 'BR-Brazil',
  'HT': 'US-Atlanta',
  'VA': 'EU-London',
  'HN': 'US-Atlanta',
  'HK': 'JP-Tokyo',
  'HU': 'EU-London',
  'IS': 'EU-London',
  'IN': 'JP-Tokyo',
  'ID': 'JP-Tokyo',
  'IR': 'JP-Tokyo',
  'IQ': 'JP-Tokyo',
  'IE': 'EU-London',
  'IM': 'EU-London',
  'IL': 'JP-Tokyo',
  'IT': 'EU-London',
  'JM': 'US-Atlanta',
  'JP': 'JP-Tokyo',
  'JE': 'EU-London',
  'JO': 'JP-Tokyo',
  'KZ': 'JP-Tokyo',
  'KE': 'EU-London',
  /* Actually Africa */
  'KI': 'SG-Singapore',
  'KP': 'JP-Tokyo',
  'KR': 'JP-Tokyo',
  'KW': 'JP-Tokyo',
  'KG': 'JP-Tokyo',
  'LA': 'JP-Tokyo',
  'LV': 'EU-London',
  'LB': 'JP-Tokyo',
  'LS': 'EU-London',
  /* Actually Africa */
  'LR': 'EU-London',
  /* Actually Africa */
  'LY': 'EU-London',
  /* Actually Africa */
  'LI': 'EU-London',
  'LT': 'EU-London',
  'LU': 'EU-London',
  'MO': 'JP-Tokyo',
  'MK': 'EU-London',
  'MG': 'EU-London',
  /* Actually Africa */
  'MW': 'EU-London',
  /* Actually Africa */
  'MY': 'JP-Tokyo',
  'MV': 'JP-Tokyo',
  'ML': 'EU-London',
  /* Actually Africa */
  'MT': 'EU-London',
  'MH': 'SG-Singapore',
  'MQ': 'US-Atlanta',
  'MR': 'EU-London',
  /* Actually Africa */
  'MU': 'EU-London',
  /* Actually Africa */
  'YT': 'EU-London',
  /* Actually Africa */
  'MX': 'US-Atlanta',
  'FM': 'SG-Singapore',
  'MD': 'EU-London',
  'MC': 'EU-London',
  'MN': 'JP-Tokyo',
  'ME': 'EU-London',
  'MS': 'US-Atlanta',
  'MA': 'EU-London',
  /* Actually Africa */
  'MZ': 'EU-London',
  /* Actually Africa */
  'MM': 'JP-Tokyo',
  'NA': 'EU-London',
  /* Actually Africa */
  'NR': 'SG-Singapore',
  'NP': 'JP-Tokyo',
  'NL': 'EU-London',
  'NC': 'SG-Singapore',
  'NZ': 'SG-Singapore',
  'NI': 'US-Atlanta',
  'NE': 'EU-London',
  /* Actually Africa */
  'NG': 'EU-London',
  /* Actually Africa */
  'NU': 'SG-Singapore',
  'NF': 'SG-Singapore',
  'MP': 'SG-Singapore',
  'NO': 'EU-London',
  'OM': 'JP-Tokyo',
  'PK': 'JP-Tokyo',
  'PW': 'SG-Singapore',
  'PS': 'JP-Tokyo',
  'PA': 'US-Atlanta',
  'PG': 'SG-Singapore',
  'PY': 'BR-Brazil',
  'PE': 'BR-Brazil',
  'PH': 'JP-Tokyo',
  'PN': 'SG-Singapore',
  'PL': 'EU-London',
  'PT': 'EU-London',
  'PR': 'US-Atlanta',
  'QA': 'JP-Tokyo',
  'RE': 'EU-London',
  /* Actually Africa */
  'RO': 'EU-London',
  'RU': 'RU-Russia',
  'RW': 'EU-London',
  /* Actually Africa */
  'BL': 'US-Atlanta',
  'SH': 'EU-London',
  /* Actually Africa */
  'KN': 'US-Atlanta',
  'LC': 'US-Atlanta',
  'MF': 'US-Atlanta',
  'PM': 'US-Atlanta',
  'VC': 'US-Atlanta',
  'WS': 'SG-Singapore',
  'SM': 'EU-London',
  'ST': 'EU-London',
  /* Actually Africa */
  'SA': 'EU-London',
  'SN': 'EU-London',
  /* Actually Africa */
  'RS': 'EU-London',
  'SC': 'EU-London',
  /* Actually Africa */
  'SL': 'EU-London',
  /* Actually Africa */
  'SG': 'JP-Tokyo',
  'SX': 'US-Atlanta',
  'SK': 'EU-London',
  'SI': 'EU-London',
  'SB': 'SG-Singapore',
  'SO': 'EU-London',
  /* Actually Africa */
  'ZA': 'EU-London',
  /* Actually Africa */
  'SS': 'EU-London',
  /* Actually Africa */
  'ES': 'EU-London',
  'LK': 'JP-Tokyo',
  'SD': 'EU-London',
  /* Actually Africa */
  'SR': 'BR-Brazil',
  'SJ': 'EU-London',
  'SZ': 'EU-London',
  /* Actually Africa */
  'SE': 'EU-London',
  'CH': 'EU-London',
  'SY': 'EU-London',
  'TW': 'JP-Tokyo',
  'TJ': 'JP-Tokyo',
  'TZ': 'EU-London',
  /* Actually Africa */
  'TH': 'JP-Tokyo',
  'TL': 'JP-Tokyo',
  'TG': 'EU-London',
  /* Actually Africa */
  'TK': 'SG-Singapore',
  'TO': 'SG-Singapore',
  'TT': 'US-Atlanta',
  'TN': 'EU-London',
  /* Actually Africa */
  'TR': 'TK-Turkey',
  'TM': 'JP-Tokyo',
  'TC': 'US-Atlanta',
  'TV': 'SG-Singapore',
  'UG': 'EU-London',
  /* Actually Africa */
  'UA': 'EU-London',
  'AE': 'EU-London',
  'GB': 'EU-London',
  'US': 'US-Atlanta',
  'UM': 'SG-Singapore',
  'VI': 'US-Atlanta',
  'UY': 'BR-Brazil',
  'UZ': 'JP-Tokyo',
  'VU': 'SG-Singapore',
  'VE': 'BR-Brazil',
  'VN': 'JP-Tokyo',
  'WF': 'SG-Singapore',
  'EH': 'EU-London',
  /* Actually Africa */
  'YE': 'JP-Tokyo',
  'ZM': 'EU-London',
  /* Actually Africa */
  'ZW': 'EU-London' /* Actually Africa */
};

/***/ }),
/* 390 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate, module) {

var _interopRequireDefault = __webpack_require__(2);
var _typeof2 = _interopRequireDefault(__webpack_require__(39));
var _stringHash = _interopRequireDefault(__webpack_require__(391));
/*
 * Promise Polyfill
 * Lightweight ES6 Promise polyfill for the browser and node.
 * Adheres closely to the spec. It is a perfect polyfill IE, Firefox
 * or any other browser that does not support native promises.
 *
 * Website: https://github.com/taylorhakes/promise-polyfill
 * Copyright: (c) 2014 Taylor Hakes
 * Copyright: (c) 2014 Forbes Lindesay
 * License: MIT
 */

!function (e) {
  function n() {}
  function t(e, n) {
    return function () {
      e.apply(n, arguments);
    };
  }
  function o(e) {
    if ('object' != (0, _typeof2["default"])(this)) throw new TypeError('Promises must be constructed via new');
    if ('function' != typeof e) throw new TypeError('not a function');
    this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], s(e, this);
  }
  function i(e, n) {
    for (; 3 === e._state;) e = e._value;
    return 0 === e._state ? void e._deferreds.push(n) : (e._handled = !0, void o._immediateFn(function () {
      var t = 1 === e._state ? n.onFulfilled : n.onRejected;
      if (null === t) return void (1 === e._state ? r : u)(n.promise, e._value);
      var o;
      try {
        o = t(e._value);
      } catch (i) {
        return void u(n.promise, i);
      }
      r(n.promise, o);
    }));
  }
  function r(e, n) {
    try {
      if (n === e) throw new TypeError('A promise cannot be resolved with itself.');
      if (n && ('object' == (0, _typeof2["default"])(n) || 'function' == typeof n)) {
        var _i = n.then;
        if (n instanceof o) return e._state = 3, e._value = n, void f(e);
        if ('function' == typeof _i) return void s(t(_i, n), e);
      }
      e._state = 1, e._value = n, f(e);
    } catch (r) {
      u(e, r);
    }
  }
  function u(e, n) {
    e._state = 2, e._value = n, f(e);
  }
  function f(e) {
    2 === e._state && 0 === e._deferreds.length && o._immediateFn(function () {
      e._handled || o._unhandledRejectionFn(e._value);
    });
    for (var _n = 0, _t = e._deferreds.length; _n < _t; _n++) i(e, e._deferreds[_n]);
    e._deferreds = null;
  }
  function c(e, n, t) {
    this.onFulfilled = 'function' == typeof e ? e : null, this.onRejected = 'function' == typeof n ? n : null, this.promise = t;
  }
  function s(e, n) {
    var t = !1;
    try {
      e(function (e) {
        t || (t = !0, r(n, e));
      }, function (e) {
        t || (t = !0, u(n, e));
      });
    } catch (o) {
      if (t) return;
      t = !0, u(n, o);
    }
  }
  var a = setTimeout;
  o.prototype['catch'] = function (e) {
    return this.then(null, e);
  }, o.prototype.then = function (e, t) {
    var o = new this.constructor(n);
    return i(this, new c(e, t, o)), o;
  }, o.all = function (e) {
    var n = Array.prototype.slice.call(e);
    return new o(function (e, t) {
      function o(r, u) {
        try {
          if (u && ('object' == (0, _typeof2["default"])(u) || 'function' == typeof u)) {
            var _f = u.then;
            if ('function' == typeof _f) return void _f.call(u, function (e) {
              o(r, e);
            }, t);
          }
          n[r] = u, 0 === --i && e(n);
        } catch (c) {
          t(c);
        }
      }
      if (0 === n.length) return e([]);
      for (var i = n.length, r = 0; r < n.length; r++) o(r, n[r]);
    });
  }, o.resolve = function (e) {
    return e && 'object' == (0, _typeof2["default"])(e) && e.constructor === o ? e : new o(function (n) {
      n(e);
    });
  }, o.reject = function (e) {
    return new o(function (n, t) {
      t(e);
    });
  }, o.race = function (e) {
    return new o(function (n, t) {
      for (var _o = 0, _i2 = e.length; _o < _i2; _o++) e[_o].then(n, t);
    });
  }, o._immediateFn = 'function' == typeof setImmediate && function (e) {
    setImmediate(e);
  } || function (e) {
    a(e, 0);
  }, o._unhandledRejectionFn = function (e) {
    'undefined' != typeof console && console && console.warn('Possible Unhandled Promise Rejection:', e);
  }, o._setImmediateFn = function (e) {
    o._immediateFn = e;
  }, o._setUnhandledRejectionFn = function (e) {
    o._unhandledRejectionFn = e;
  }, 'undefined' != typeof module && module.exports ? module.exports = o : e.Promise || (e.Promise = o);
}(void 0);

/*
 * ImprintJs
 */
(function (scope) {
  'use strict';

  // Test holder
  var _tests = {};
  var imprint = scope.imprint || {
    test: function test(tests) {
      return Promise.all(tests.map(function (x) {
        if (!_tests.hasOwnProperty(x)) {
          var obj = 'No test registered with the alias ' + x;
          throw obj;
        }
        return _tests[x]();
      })).then(function (values) {
        // console.log(values);
        return (0, _stringHash["default"])(values.toString());
      });
    },
    registerTest: function registerTest(alias, test) {
      // Add test factory to tests collection
      _tests[alias] = test;
    }
  };

  // Export the imprint class
  if (( false ? "undefined" : (0, _typeof2["default"])(module)) === 'object' && typeof exports !== 'undefined') {
    module.exports = imprint;
  }
  scope.imprint = imprint;
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('adBlocker', function () {
    return new Promise(function (resolve) {
      var adsbox = document.createElement('div');
      adsbox.innerHTML = '&nbsp;';
      adsbox.className = 'adsbox';
      adsbox.style.display = 'block';
      adsbox.style.position = 'absolute';
      adsbox.style.top = '0px';
      adsbox.style.left = '-9999px';
      try {
        // body may not exist, that's why we need try/catch
        document.body.appendChild(adsbox);
        window.setTimeout(function () {
          var result = adsbox.offsetHeight === 0;
          document.body.removeChild(adsbox);
          return resolve(result);
        }, 10);
      } catch (e) {
        return resolve(false);
      }
    });
  });
})(window);

/*
 * Original Source: https://github.com/Song-Li/cross_browser/blob/master/client/fingerprint/js/audio.js
 * Copyright: Yinzhi Cao, Song Li, Erik Wijmans
 * License: GNU v3
 * Changes:
 *  - Wrapped in an ImprintJs promise
 */

(function (scope) {
  'use strict';

  imprint.registerTest('audio', function () {
    return new Promise(function (resolve) {
      try {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
          oscillator = audioCtx.createOscillator(),
          analyser = audioCtx.createAnalyser(),
          gainNode = audioCtx.createGain(),
          scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
        var destination = audioCtx.destination;
        var val = audioCtx.sampleRate.toString() + '_' + destination.maxChannelCount + '_' + destination.numberOfInputs + '_' + destination.numberOfOutputs + '_' + destination.channelCount + '_' + destination.channelCountMode + '_' + destination.channelInterpretation;
        return resolve(val);
      } catch (e) {
        return resolve('');
      }
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('availableScreenResolution', function () {
    return new Promise(function (resolve) {
      var val = screen.availHeight > screen.availWidth ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight];
      return resolve(val.join('x'));
    });
  });
})(window);

/*
 * Original Source: https://github.com/Valve/fingerprintjs2/blob/master/fingerprint2.js
 * Copyright: Valentin Vasilyev (valentin.vasilyev@outlook.com)
 * License: MIT
 * Changes:
 *  - Wrapped in an ImprintJs promise
 */

(function (scope) {
  'use strict';

  imprint.registerTest('canvas', function () {
    return new Promise(function (resolve) {
      var result = [];

      // Very simple now, need to make it more complex (geo shapes etc)
      var canvas = document.createElement('canvas');
      canvas.width = 2000;
      canvas.height = 200;
      canvas.style.display = 'inline';
      var ctx = canvas.getContext('2d');

      // detect browser support of canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
      ctx.rect(0, 0, 10, 10);
      ctx.rect(2, 2, 6, 6);
      result.push('canvas winding:' + (ctx.isPointInPath(5, 5, 'evenodd') === false ? 'yes' : 'no'));
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';

      // https://github.com/Valve/fingerprintjs2/issues/66
      ctx.font = '11pt no-real-font-123';
      ctx.fillText("Cwm fjordbank glyphs vext quiz, \uD83D\uDE03", 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.2)';
      ctx.font = '18pt Arial';
      ctx.fillText("Cwm fjordbank glyphs vext quiz, \uD83D\uDE03", 4, 45);

      // canvas blending
      // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
      // http://jsfiddle.net/NDYV8/16/
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgb(255,0,255)';
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgb(0,255,255)';
      ctx.beginPath();
      ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgb(255,255,0)';
      ctx.beginPath();
      ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = 'rgb(255,0,255)';

      // canvas winding
      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
      // http://jsfiddle.net/NDYV8/19/
      ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
      ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
      result.push('canvas fp:' + canvas.toDataURL());
      return resolve(result.join('~'));
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('colorDepth', function () {
    return new Promise(function (resolve) {
      var cd = screen.colorDepth;

      // Some browsers return 24 rather than 32 as 32 is really
      // 24 bit color depth + 8 bits alpha, so they see the alpha
      // as not really being "color" so report 24 instead.
      // For consistancy, treat all 32 color depths as 24.
      if (cd === 32) {
        cd = 24;
      }
      return resolve(cd || '');
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('cookies', function () {
    return new Promise(function (resolve) {
      return resolve(navigator.cookieEnabled);
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('cpuClass', function () {
    return new Promise(function (resolve) {
      return resolve(navigator.cpuClass || '');
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('deviceDpi', function () {
    return new Promise(function (resolve) {
      return resolve((screen.deviceXDPI || 0) + 'x' + (screen.deviceYDPI || 0));
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('doNotTrack', function () {
    return new Promise(function (resolve) {
      return resolve(navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack || '');
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('indexedDb', function () {
    return new Promise(function (resolve) {
      try {
        return resolve(!!window.indexedDB);
      } catch (e) {
        return resolve(true); // SecurityError when referencing it means it exists
      }
    });
  });
})(window);
/**
 * JavaScript code to detect available availability of a
 * particular font in a browser using JavaScript and CSS.
 *
 * Author : Lalit Patel
 * Website: http://www.lalit.org/lab/javascript-css-font-detect/
 * License: Apache Software License 2.0
 *          http://www.apache.org/licenses/LICENSE-2.0
 * Version: 0.15 (21 Sep 2009)
 *          Changed comparision font to default from sans-default-default,
 *          as in FF3.0 font of child element didn't fallback
 *          to parent element if the font is missing.
 * Version: 0.2 (04 Mar 2012)
 *          Comparing font against all the 3 generic font families ie,
 *          'monospace', 'sans-serif' and 'sans'. If it doesn't match all 3
 *          then that font is 100% not available in the system
 * Version: 0.3 (24 Mar 2012)
 *          Replaced sans with serif in the list of baseFonts
 */
var FontDetector = function FontDetector() {
  // a font will be compared against all the three default fonts.
  // and if it doesn't match all 3 then that font is not available.
  var baseFonts = ['monospace', 'sans-serif', 'serif'];

  //we use m or w because these two characters take up the maximum width.
  // And we use a LLi so that the same matching fonts can get separated
  var testString = 'mmmmmmmmmmlli';

  //we test using 72px font size, we may use any size. I guess larger the better.
  var testSize = '201px';
  var h = document.getElementsByTagName('body')[0];

  // create a SPAN in the document to get the width of the text we use to test
  var s = document.createElement('span');
  s.style.fontSize = testSize;
  s.innerHTML = testString;
  var defaultWidth = {};
  var defaultHeight = {};
  for (var index in baseFonts) {
    //get the default width for the three base fonts
    s.style.fontFamily = baseFonts[index];
    h.appendChild(s);
    defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
    defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
    h.removeChild(s);
  }
  function detect(font) {
    var detected = true;
    for (var _index in baseFonts) {
      s.style.fontFamily = font + ',' + baseFonts[_index]; // name of the font along with the base font for fallback.
      h.appendChild(s);
      var matched = s.offsetWidth != defaultWidth[baseFonts[_index]] || s.offsetHeight != defaultHeight[baseFonts[_index]];
      h.removeChild(s);
      detected = detected && matched;
    }
    return detected;
  }
  this.detect = detect;
};
(function (scope) {
  'use strict';

  imprint.registerTest('installedFonts', function () {
    return new Promise(function (resolve) {
      var fontDetective = new FontDetector();
      // Firefox doesn't like fonts ending in "bold", "heavy", "light", "transparent" or anything vaguely css related so we make sure the list doesn't contain any such fonts
      var fontArray = ['ADOBE CASLON PRO', 'ADOBE GARAMOND PRO', 'AVENIR', 'Adobe Fangsong Std', 'Adobe Ming Std', 'Agency FB', 'Aharoni', 'Amazone BT', 'AngsanaUPC', 'Antique Olive', 'Apple Chancery', 'Apple Color Emoji', 'Apple SD Gothic Neo', 'Arab', 'Arial Baltic', 'Arial CE', 'Arial CYR', 'Arial Greek', 'Arial MT', 'Arial Unicode MS', 'Arrus BT', 'AvantGarde Bk BT', 'AvantGarde Md BT', 'Ayuthaya', 'Baskerville Old Face', 'Bell MT', 'Benguiat Bk BT', 'Berlin Sans FB', 'BernhardFashion BT', 'BernhardMod BT', 'Big Caslon', 'Bitstream Vera Sans Mono', 'Bitstream Vera Serif', 'BlairMdITC TT', 'Bodoni 72 Smallcaps', 'Bodoni MT Poster Compressed', 'Boulder', 'Bradley Hand', 'Broadway', 'Browallia New', 'BrowalliaUPC', 'Calisto MT', 'Cambria Math', 'Centaur', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter BT', 'ChelthmITC Bk BT', 'Chiller', 'Comic Sans MS', 'Constantia', 'Copperplate', 'Corbel', 'Cordia New', 'CordiaUPC', 'Coronet', 'Courier New Baltic', 'Courier New CE', 'Courier New CYR', 'Courier New TUR', 'Cuckoo', 'DFKai-SB', 'DaunPenh', 'Dauphin', 'David', 'DejaVu LGC Sans Mono', 'Denmark', 'Desdemona', 'DokChampa', 'Dotum', 'Ebrima', 'Edwardian Script ITC', 'Eras Bold ITC', 'EucrosiaUPC', 'Euphemia', 'Eurostile', 'FRUTIGER', 'FangSong', 'Felix Titling', 'Forte', 'Fransiscan', 'FreesiaUPC', 'French Script MT', 'FrnkGothITC Bk BT', 'Fruitger', 'Futura Bk BT', 'Futura Md BT', 'Futura ZBlk BT', 'FuturaBlack BT', 'Galliard BT', 'Garamond', 'Gautami', 'Geeza Pro', 'Geneva', 'GeoSlab 703 Lt BT', 'Geometr231 BT', 'Geometr231 Hv BT', 'Gigi', 'Gill Sans', 'GoudyOLSt BT', 'GulimChe', 'GungSeo', 'Gurmukhi MN', 'Harlow Solid Italic', 'Heather', 'HeiT', 'High Tower Text', 'Hiragino Kaku Gothic ProN', 'Hiragino Mincho ProN', 'Hiragino Sans GB', 'Hoefler Text', 'Humanst521 BT', 'Humanst521 Lt BT', 'Impact', 'Imprint MT Shadow', 'Incised901 BT', 'Incised901 Lt BT', 'Informal Roman', 'Informal011 BT', 'IrisUPC', 'Kabel Bk BT', 'KacstOne', 'KaiTi', 'Khmer UI', 'Kokila', 'LUCIDA GRANDE', 'Latha', 'Leelawadee', 'Lohit Gujarati', 'Long Island', 'Lucida Calligraphy', 'Lucida Console', 'Lucida Sans', 'Lucida Sans Typewriter', 'Lydian BT', 'MS Gothic', 'MS Mincho', 'MS PGothic', 'MS Reference Sans Serif', 'MS Reference Specialty', 'MS Serif', 'MUSEO', 'MYRIAD', 'Malgun Gothic', 'Mangal', 'Marigold', 'Market', 'Marlett', 'Meiryo', 'Meiryo UI', 'Menlo', 'Microsoft PhagsPa', 'Microsoft Uighur', 'MingLiU', 'MingLiU_HKSCS', 'Minion', 'Miriam Fixed', 'Mona Lisa Solid ITC TT', 'Monaco', 'Monotype Corsiva', 'NEVIS', 'News Gothic', 'News GothicMT', 'NewsGoth BT', 'Nyala', 'Old Century', 'Old English Text MT', 'Onyx', 'Oriya Sangam MN', 'PMingLiU', 'Palatino', 'Parchment', 'Pegasus', 'Perpetua', 'Perpetua Titling MT', 'Pickwick', 'Poster', 'Pristina', 'Raavi', 'Rage Italic', 'Rockwell', 'Roman', 'Sakkal Majalla', 'Savoye LET', 'Sawasdee', 'Segoe UI Symbol', 'Serifa BT', 'Serifa Th BT', 'Showcard Gothic', 'Shruti', 'Signboard', 'SimHei', 'SimSun', 'SimSun-ExtB', 'Simplified Arabic', 'Simplified Arabic Fixed', 'Sinhala Sangam MN', 'Sketch Rockwell', 'Socket', 'Stencil', 'Styllo', 'Swis721 BlkEx BT', 'Swiss911 XCm BT', 'Symbol', 'Synchro LET', 'System', 'TRAJAN PRO', 'Technical', 'Teletype', 'Tempus Sans ITC', 'Thonburi', 'Times', 'Times New Roman Baltic', 'Times New Roman CYR', 'Times New Roman PS', 'Trebuchet MS', 'Tubular', 'Tunga', 'Tw Cen MT', 'TypoUpright BT', 'Ubuntu', 'Unicorn', 'Utopia', 'Viner Hand ITC', 'Vivaldi', 'Vrinda', 'Westminster', 'Wide Latin', 'Zurich BlkEx BT'];
      // Extend the fontArray to cover the following for a larger list of fonts, however it will take loger to calculate the fingerprint
      /*"ARCHER","ARNO PRO","Academy Engraved LET","Adobe Garamond","Adobe Hebrew","Algerian","AmerType Md BT","American Typewriter","Andale Mono","Andalus","Angsana New","Aparajita","Arabic Typesetting","Arial","Arial Hebrew","Arial TUR","Aurora Cn BT","Bandy","Bangla Sangam MN","Bank Gothic","BankGothic Md BT","Baskerville","Batang","BatangChe","Bauer Bodoni","Bembo","BinnerD","Blackadder ITC","Bodoni MT","Bradley Hand ITC","Braggadocio","Bremen Bd BT","Brush Script MT","CG Omega","CG Times","Calibri","Californian FB","Calligrapher","Cambria","Candara","CaslonOpnface BT","Castellar","Casual","Century","Century Gothic","Century Schoolbook","Cezanne","Charlesworth","Chaucer","Clarendon","CloisterBlack BT","Cochin","Colonna MT","Comic Sans","CopperplGoth Bd BT","Copperplate Gothic","Cornerstone","Courier New Greek","Curlz MT","DB LCD Temp","Didot","DilleniaUPC","DotumChe","Elephant","English 111 Vivace BT","Engravers MT","EngraversGothic BT","Eras Demi ITC","Estrangelo Edessa","Euphemia UCAS","Exotc350 Bd BT","FONTIN","Fixedsys","FrankRuehl","Freefrm721 Blk BT","Futura","Futura Lt BT","GOTHAM","Gabriola","GeoSlab 703 XBd BT","Geometr231 Lt BT","Georgia","Gill Sans MT","Gisha","Goudy Stout","GoudyHandtooled BT","Gujarati Sangam MN","Gulim","Gungsuh","GungsuhChe","Haettenschweiler","Harrington","Hei S","Heisei Kaku Gothic","Heiti SC","Heiti TC","Helvetica","Helvetica Neue","Herald","Humanst 521 Cn BT","Incised901 Bd BT","Iskoola Pota","JasmineUPC","Jazz LET","Jenson","Jester","Jokerman","Juice ITC","Kailasa","Kalinga","Kannada Sangam MN","Kartika","Kaufmann BT","Kaufmann Bd BT","Kino MT","KodchiangUPC","Korinna BT","Kozuka Gothic Pr6N","Kristen ITC","Krungthep","Lao UI","Letter Gothic","Levenim MT","LilyUPC","Lithograph","Loma","Lucida Handwriting","Lucida Sans Unicode","MS LineDraw","MS Outlook","MS PMincho","MS Sans Serif","MS UI Gothic","MT Extra","MV Boli","MYRIAD PRO","Maiandra GD","Malayalam Sangam MN","Marion","Marker Felt","Matisse ITC","Matura MT Script Capitals","Microsoft Himalaya","Microsoft JhengHei","Microsoft New Tai Lue","Microsoft Sans Serif","Microsoft Tai Le","Microsoft YaHei","Microsoft Yi Baiti","MingLiU-ExtB","MingLiU_HKSCS-ExtB","Minion Pro","Miriam","Mistral","Modern","Mongolian Baiti","MoolBoran","Mrs Eaves","NSimSun","Nadeem","Narkisim","News Gothic MT","Niagara Engraved","Niagara Solid","Noteworthy","OCR A Extended","Onyx BT","OzHandicraft BT","PMingLiU-ExtB","PRINCETOWN LET","PTBarnum BT","Palace Script MT","Palatino Linotype","Papyrus","Party LET","Plantagenet Cherokee","Playbill","Poor Richard","PosterBodoni BT","Pythagoras","Rachana","Ravie","Ribbon131 Bd BT","Rod","Santa Fe LET","Sceptre","Segoe Print","Segoe UI","Serifa","ShelleyVolante BT","Sherwood","Shonar Bangla","Skia","Small Fonts","Snap ITC","Snell Roundhand","Souvenir Lt BT","Staccato222 BT","Steamer","Storybook","Subway","Sylfaen","Tahoma","Tamil Sangam MN","Telugu Sangam MN","Terminal","Times New Roman","Times New Roman CE","Times New Roman Greek","Times New Roman TUR","TlwgMono","Traditional Arabic","Trajan","Tristan","Umpush","Univers","Utsaah","Vagabond","Vani","Verdana","Vijaya","VisualUI","WHITNEY","Webdings","ZWAdobeF","ZapfEllipt BT","ZapfHumnst BT","ZapfHumnst Dm BT","Zapfino","Zurich Ex BT"];*/
      var installedFontsArray = [];
      for (var i = 0; i < fontArray.length; i++) {
        if (fontDetective.detect(fontArray[i])) {
          installedFontsArray.push(fontArray[i]);
        }
      }

      //console.log(installedFontsArray.join(", "))

      return resolve(installedFontsArray.join('~'));
    });
  });
})(window);
/*
 * Original Source: https://github.com/Song-Li/cross_browser/blob/master/client/fingerprint/js/languageDetector.js
 * Copyright: Yinzhi Cao, Song Li, Erik Wijmans
 * License: GNU v3
 * Changes:
 *  - Icreased font size
 *  - Use span + inline styles for measurement div
 *  - Inserted comments
 *  - Wrapped in an ImprintJs promise
 */

/*
	This test renders to a canvas a whole bunch of words in 36 different
	alphabets to test which alphabets the user has installed on their computer.
	The words are kept in the 2D array called codes in their UTF-16 format
	to ensure that they aren't interpreted before it is time to render them
	The 37th string in codes is a single character that we are hoping will
	always show up as a cannot be displayed character.

	While wether the alphabet can be displayed or not is deteremined by the
	operating system, the symbol used to represent cannot be displayed is
	deteremined by the browser.  However, it does seem like it is always some
	sort of box
*/

(function (scope) {
  'use strict';

  var LanguageDetector, safeParseJSON;
  safeParseJSON = function safeParseJSON(s) {
    try {
      return JSON.parse(s);
    } catch (error) {
      return false;
    }
  };
  LanguageDetector = function () {
    function LanguageDetector() {
      this.names = safeParseJSON('[ "Latin", "Chinese", "Arabic", "Devanagari", "Cyrillic", "Bengali/Assamese", "Kana", "Gurmukhi", "Javanese", "Hangul", "Telugu", "Tamil", "Malayalam", "Burmese", "Thai", "Sundanese", "Kannada", "Gujarati", "Lao", "Odia", "Ge-ez", "Sinhala", "Armenian", "Khmer", "Greek", "Lontara", "Hebrew", "Tibetan", "Georgian", "Modern Yi", "Mongolian", "Tifinagh", "Syriac", "Thaana", "Inuktitut", "Cherokee" ]');
      this.codes = safeParseJSON('[[76,97,116,105,110], [27721,23383], [1575,1604,1593,1585,1576,1610,1577], [2342,2375,2357,2344,2366,2327,2352,2368], [1050,1080,1088,1080,1083,1080,1094,1072], [2476,2494,2434,2482,2494,32,47,32,2437,2488,2478,2496,2479,2492,2494], [20206,21517], [2583,2625,2608,2606,2625,2582,2624], [43415,43438], [54620,44544], [3108,3142,3122,3137,3095,3137], [2980,2990,3007,2996,3021], [3374,3378,3375,3390,3379,3330], [4121,4156,4116,4154,4121,4140], [3652,3607,3618], [7070,7077,7060,7082,7059], [3221,3240,3277,3240,3233], [2711,2753,2716,2736,2750,2724,2752], [3749,3762,3751], [2825,2852,2893,2837,2867], [4877,4821,4829], [3523,3538,3458,3524,3517], [1344,1377,1397,1400,1409], [6017,6098,6040,6082,6042], [917,955,955,951,957,953,954,972], [6674,6682,6664,6673], [1488,1500,1508,1489,1497,1514], [3926,3964,3921,3851], [4325,4304,4320,4311,4323,4314,4312], [41352,41760], [6190,6179,6185,6189,6179,6191], [11612,11593,11580,11593,11599,11568,11606], [1808,1834,1825,1821,1808], [1931,1960,1928,1964,1920,1960], [5123,5316,5251,5198,5200,5222], [5091,5043,5033], [55295, 7077]]');
      this.fontSize = 401;
      this.fontFace = 'Verdana';
      this.extraHeigth = 15;
      this.res = [];
    }
    LanguageDetector.prototype.begin = function () {
      var c, code, h, height, i, j, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, o, p, ref, ref1, ref2, ref3, round, s, w, width;
      round = 0;
      this.widths = [];
      this.heights = [];
      this.support = [];
      this.test_div = document.createElement('div');
      document.body.appendChild(this.test_div);
      this.test_div.id = 'WritingTest';
      ref = this.codes;
      for (i = 0, len = ref.length; i < len; i++) {
        code = ref[i];
        this.height = [];
        this.width = [];
        this.div = document.createElement('div');
        this.test_div.appendChild(this.div);
        round += 1;
        this.div.id = round;
        this.div.style.display = 'inline-block';
        for (j = 0, len1 = code.length; j < len1; j++) {
          c = code[j];
          this.div.innerHTML = '<span style = \'font-family:' + this.fontFace + '; font-size:' + this.fontSize + 'px;\'>&#' + c + '</span>';
          this.height.push(document.getElementById(round).clientHeight);
          this.width.push(document.getElementById(round).clientWidth);
        }
        this.div.innerHTML = '';
        for (k = 0, len2 = code.length; k < len2; k++) {
          c = code[k];
          this.div.innerHTML += '<span style = \'font-family:' + this.fontFace + '; font-size:' + this.fontSize + 'px;\'>&#' + c + '</span>';
        }
        this.test_div.innerHTML += this.height + ';' + this.width + '<br>';
        this.heights.push(this.height);
        this.widths.push(this.width);
      }

      // standard width
      // maybe with a circle
      this.tw = this.widths.pop();
      this.sw1 = this.tw[0];
      this.sw2 = this.tw[1];

      // Standard height
      this.sh = this.heights.pop()[0];

      // Check the height
      ref1 = this.heights;
      for (l = 0, len3 = ref1.length; l < len3; l++) {
        height = ref1[l];
        this.passed = 0;
        for (m = 0, len4 = height.length; m < len4; m++) {
          h = height[m];
          if (h !== this.sh) {
            this.support.push(true);
            this.passed = 1;
            break;
          }
        }
        if (this.passed === 0) {
          this.support.push(false);
        }
      }

      // Check the width
      this.writing_scripts_index = 0;
      ref2 = this.widths;
      for (n = 0, len5 = ref2.length; n < len5; n++) {
        width = ref2[n];
        for (o = 0, len6 = width.length; o < len6; o++) {
          w = width[o];
          if (this.support[this.writing_scripts_index] === false) {
            if (w !== this.sw1 && w !== this.sw2) {
              this.support[this.writing_scripts_index] = true;
            }
          }
        }
        this.writing_scripts_index += 1;
      }
      this.res = [];
      this.writing_scripts_index = 0;
      ref3 = this.support;
      for (p = 0, len7 = ref3.length; p < len7; p++) {
        s = ref3[p];
        this.test_div.innerHTML += this.names[this.writing_scripts_index] + ': ' + s + ' <br>';
        if (s === true) {
          this.res.push(this.names[this.writing_scripts_index]);
        }
        this.writing_scripts_index += 1;
      }
      this.test_div.remove();
      return this.res;
    };
    return LanguageDetector;
  }();
  imprint.registerTest('installedLanguages', function () {
    return new Promise(function (resolve) {
      try {
        var detector = new LanguageDetector();
        return resolve(detector.begin().join('~'));
      } catch (e) {
        return resolve('');
      }
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('language', function () {
    return new Promise(function (resolve) {
      return resolve(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || '');
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('localIp', function () {
    return new Promise(function (resolve) {
      // try
      // {
      //     let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;   //compatibility for firefox and chrome
      //     let pc = new RTCPeerConnection({iceServers:[]}), noop = function() {};
      //     pc.createDataChannel('');    //create a bogus data channel
      //     pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer and set local description
      //     pc.onicecandidate = function(ice) //listen for candidate events
      //     {
      //         pc.onicecandidate = noop;

      //         if(!ice || !ice.candidate || !ice.candidate.candidate)
      //         {
      //             return resolve('');
      //         }

      //         let val = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
      //         return resolve(val);
      //     };
      // }
      // catch (e)
      // {
      return resolve('');
      //}
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('localStorage', function () {
    return new Promise(function (resolve) {
      try {
        return resolve(!!window.localStorage);
      } catch (e) {
        return resolve(true); // SecurityError when referencing it means it exists
      }
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('mediaDevices', function () {
    return new Promise(function (resolve) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return resolve(cd || '');
      }
      navigator.mediaDevices.enumerateDevices().then(function (devices) {
        var results = devices.map(function (device) {
          return device.kind + ':' + device.label + ' id = ' + device.deviceId;
        });
        return resolve(results.join(','));
      })["catch"](function (err) {
        return resolve('');
      });
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('pixelRatio', function () {
    return new Promise(function (resolve) {
      return resolve(window.devicePixelRatio || '');
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('platform', function () {
    return new Promise(function (resolve) {
      return resolve(navigator.platform || '');
    });
  });
})(window);
/*
 * Original Source: https://github.com/Valve/fingerprintjs2/blob/master/fingerprint2.js
 * Copyright: Valentin Vasilyev (valentin.vasilyev@outlook.com)
 * License: MIT
 * Changes:
 *  - Wrapped in an ImprintJs promise
 */

(function (scope) {
  'use strict';

  imprint.registerTest('plugins', function () {
    return new Promise(function (resolve) {
      var results = [];

      // IE
      if (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, 'ActiveXObject') || 'ActiveXObject' in window) {
        var names = ['AcroPDF.PDF',
        // Adobe PDF reader 7+
        'Adodb.Stream', 'AgControl.AgControl',
        // Silverlight
        'DevalVRXCtrl.DevalVRXCtrl.1', 'MacromediaFlashPaper.MacromediaFlashPaper', 'Msxml2.DOMDocument', 'Msxml2.XMLHTTP', 'PDF.PdfCtrl',
        // Adobe PDF reader 6 and earlier, brrr
        'QuickTime.QuickTime',
        // QuickTime
        'QuickTimeCheckObject.QuickTimeCheck.1', 'RealPlayer', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'RealVideo.RealVideo(tm) ActiveX Control (32-bit)', 'Scripting.Dictionary', 'SWCtl.SWCtl',
        // ShockWave player
        'Shell.UIHelper', 'ShockwaveFlash.ShockwaveFlash',
        //flash plugin
        'Skype.Detection', 'TDCCtl.TDCCtl', 'WMPlayer.OCX',
        // Windows media player
        'rmocx.RealPlayer G2 Control', 'rmocx.RealPlayer G2 Control.1'];

        // starting to detect plugins in IE
        results = names.map(function (name) {
          try {
            new ActiveXObject(name); // eslint-disable-no-new
            return name;
          } catch (e) {
            return null;
          }
        });
      }

      // None IE
      if (navigator.plugins) {
        var plugins = [];
        for (var i = 0, l = navigator.plugins.length; i < l; i++) {
          plugins.push(navigator.plugins[i]);
        }

        // sorting plugins only for those user agents, that we know randomize the plugins
        // every time we try to enumerate them
        if (navigator.userAgent.match(/palemoon/i)) {
          plugins = plugins.sort(function (a, b) {
            if (a.name > b.name) {
              return 1;
            }
            if (a.name < b.name) {
              return -1;
            }
            return 0;
          });
        }
        var t = plugins.map(function (p) {
          var mimeTypes = [];
          for (var _i3 = 0; _i3 < p.length; _i3++) {
            var mt = p[_i3];
            mimeTypes.push([mt.type, mt.suffixes].join('~'));
          }
          results.push([p.name, p.description, mimeTypes.join(',')].join('::'));
        });
      }
      return resolve(results.join('~'));
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('processorCores', function () {
    return new Promise(function (resolve) {
      return resolve(navigator.hardwareConcurrency);
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('publicIp', function () {
    return new Promise(function (resolve) {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          resolve(xmlHttp.responseText);
        }
      };
      xmlHttp.open('GET', 'https://api.ipify.org', true); // true for asynchronous
      xmlHttp.send(null);
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('screenResolution', function () {
    return new Promise(function (resolve) {
      var val = screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height];
      return resolve(val.join('x'));
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('sessionStorage', function () {
    return new Promise(function (resolve) {
      try {
        return resolve(!!window.sessionStorage);
      } catch (e) {
        return resolve(true); // SecurityError when referencing it means it exists
      }
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('timezoneOffset', function () {
    return new Promise(function (resolve) {
      return resolve(new Date().getTimezoneOffset());
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('touchSupport', function () {
    return new Promise(function (resolve) {
      var maxTouchPoints = 0;
      var touchEvent = false;
      if (typeof navigator.maxTouchPoints !== 'undefined') {
        maxTouchPoints = navigator.maxTouchPoints;
      } else if (typeof navigator.msMaxTouchPoints !== 'undefined') {
        maxTouchPoints = navigator.msMaxTouchPoints;
      }
      try {
        document.createEvent('TouchEvent');
        touchEvent = true;
      } catch (e) {
        /* squelch */
      }
      var touchStart = 'ontouchstart' in window;
      return resolve([maxTouchPoints, touchEvent, touchStart].join('~'));
    });
  });
})(window);
(function (scope) {
  'use strict';

  imprint.registerTest('userAgent', function () {
    return new Promise(function (resolve) {
      return resolve(navigator.userAgent);
    });
  });
})(window);
/*
 * Original Source: https://github.com/Valve/fingerprintjs2/blob/master/fingerprint2.js
 * Copyright: Valentin Vasilyev (valentin.vasilyev@outlook.com)
 * License: MIT
 * Changes:
 *  - Wrapped in an ImprintJs promise
 */

(function (scope) {
  'use strict';

  imprint.registerTest('webGl', function () {
    return new Promise(function (resolve) {
      try {
        var fa2s = function fa2s(fa) {
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.enable(gl.DEPTH_TEST);
          gl.depthFunc(gl.LEQUAL);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          return '[' + fa[0] + ', ' + fa[1] + ']';
        };
        var maxAnisotropy = function maxAnisotropy(gl) {
          var anisotropy,
            ext = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
          return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
        };
        var canvas = document.createElement('canvas');
        var gl = null;
        try {
          gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        } catch (e) {
          /* squelch */
        }
        if (!gl) {
          return resolve('');
        }

        // WebGL fingerprinting is a combination of techniques, found in MaxMind antifraud script & Augur fingerprinting.
        // First it draws a gradient object with shaders and convers the image to the Base64 string.
        // Then it enumerates all WebGL extensions & capabilities and appends them to the Base64 string, resulting in a huge WebGL string, potentially very unique on each device
        // Since iOS supports webgl starting from version 8.1 and 8.1 runs on several graphics chips, the results may be different across ios devices, but we need to verify it.
        var result = [];
        var vShaderTemplate = 'attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}';
        var fShaderTemplate = 'precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}';
        var vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        vertexPosBuffer.itemSize = 3;
        vertexPosBuffer.numItems = 3;
        var program = gl.createProgram(),
          vshader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vshader, vShaderTemplate);
        gl.compileShader(vshader);
        var fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fshader, fShaderTemplate);
        gl.compileShader(fshader);
        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);
        gl.useProgram(program);
        program.vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
        program.offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
        gl.enableVertexAttribArray(program.vertexPosArray);
        gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
        gl.uniform2f(program.offsetUniform, 1, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
        if (gl.canvas != null) {
          result.push(gl.canvas.toDataURL());
        }
        result.push('extensions:' + gl.getSupportedExtensions().join(';'));
        result.push('webgl aliased line width range:' + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
        result.push('webgl aliased point size range:' + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
        result.push('webgl alpha bits:' + gl.getParameter(gl.ALPHA_BITS));
        result.push('webgl antialiasing:' + (gl.getContextAttributes().antialias ? 'yes' : 'no'));
        result.push('webgl blue bits:' + gl.getParameter(gl.BLUE_BITS));
        result.push('webgl depth bits:' + gl.getParameter(gl.DEPTH_BITS));
        result.push('webgl green bits:' + gl.getParameter(gl.GREEN_BITS));
        result.push('webgl max anisotropy:' + maxAnisotropy(gl));
        result.push('webgl max combined texture image units:' + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
        result.push('webgl max cube map texture size:' + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
        result.push('webgl max fragment uniform vectors:' + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
        result.push('webgl max render buffer size:' + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
        result.push('webgl max texture image units:' + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
        result.push('webgl max texture size:' + gl.getParameter(gl.MAX_TEXTURE_SIZE));
        result.push('webgl max varying vectors:' + gl.getParameter(gl.MAX_VARYING_VECTORS));
        result.push('webgl max vertex attribs:' + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
        result.push('webgl max vertex texture image units:' + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
        result.push('webgl max vertex uniform vectors:' + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
        result.push('webgl max viewport dims:' + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
        result.push('webgl red bits:' + gl.getParameter(gl.RED_BITS));
        result.push('webgl renderer:' + gl.getParameter(gl.RENDERER));
        result.push('webgl shading language version:' + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
        result.push('webgl stencil bits:' + gl.getParameter(gl.STENCIL_BITS));
        result.push('webgl vendor:' + gl.getParameter(gl.VENDOR));
        result.push('webgl version:' + gl.getParameter(gl.VERSION));
        try {
          // Add the unmasked vendor and unmasked renderer if the debug_renderer_info extension is available
          var extensionDebugRendererInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (extensionDebugRendererInfo) {
            result.push('webgl unmasked vendor:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL));
            result.push('webgl unmasked renderer:' + gl.getParameter(extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL));
          }
        } catch (e) {
          /* squelch */
        }
        if (!gl.getShaderPrecisionFormat) {
          return resolve(result.join('~'));
        }
        result.push('webgl vertex shader high float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).precision);
        result.push('webgl vertex shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMin);
        result.push('webgl vertex shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMax);
        result.push('webgl vertex shader medium float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).precision);
        result.push('webgl vertex shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMin);
        result.push('webgl vertex shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT).rangeMax);
        result.push('webgl vertex shader low float precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).precision);
        result.push('webgl vertex shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMin);
        result.push('webgl vertex shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT).rangeMax);
        result.push('webgl fragment shader high float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision);
        result.push('webgl fragment shader high float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMin);
        result.push('webgl fragment shader high float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMax);
        result.push('webgl fragment shader medium float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).precision);
        result.push('webgl fragment shader medium float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMin);
        result.push('webgl fragment shader medium float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT).rangeMax);
        result.push('webgl fragment shader low float precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).precision);
        result.push('webgl fragment shader low float precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMin);
        result.push('webgl fragment shader low float precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT).rangeMax);
        result.push('webgl vertex shader high int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).precision);
        result.push('webgl vertex shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMin);
        result.push('webgl vertex shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMax);
        result.push('webgl vertex shader medium int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).precision);
        result.push('webgl vertex shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMin);
        result.push('webgl vertex shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT).rangeMax);
        result.push('webgl vertex shader low int precision:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).precision);
        result.push('webgl vertex shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMin);
        result.push('webgl vertex shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT).rangeMax);
        result.push('webgl fragment shader high int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).precision);
        result.push('webgl fragment shader high int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMin);
        result.push('webgl fragment shader high int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMax);
        result.push('webgl fragment shader medium int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).precision);
        result.push('webgl fragment shader medium int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMin);
        result.push('webgl fragment shader medium int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT).rangeMax);
        result.push('webgl fragment shader low int precision:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).precision);
        result.push('webgl fragment shader low int precision rangeMin:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMin);
        result.push('webgl fragment shader low int precision rangeMax:' + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT).rangeMax);
        return resolve(result.join('~'));
      } catch (e) {
        return resolve('');
      }
    });
  });
})(window);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(161).setImmediate, __webpack_require__(40)(module)))

/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function hash(str) {
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

module.exports = hash;


/***/ }),
/* 392 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.DogTag = exports.DogMetricType = exports.DogMetric = exports.DataDog = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(393));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
//
//  datadog.js
//  DataDog
//  Library that provides client side technical analytics provided by using DataDog platform
//  Described in: https://confluence.miniclip.com/display/MG/MCDataDog
//
//  This library is the javascript porting of the C++ library version called MCDataDog:
//  https://stash.miniclip.com/projects/CT/repos/mcdatadog/browse?at=develop
//
//  Created by Hugo Silveira on September 2018.
//  Copyright © 2018 Miniclip. All rights reserved.
//

/* eslint-disable no-console*/
var g_uidTag = 'UID';
var g_bodyTag = 'events';
var g_appIDTag = 'appId';
var g_headerTag = 'global';
var g_eventNameTag = 'name';
var g_eventTypeTag = 'type';
var g_eventTagsTag = 'tags';
var g_tagNameTag = 'tagName';
var g_tagValueTag = 'tagVal';
var g_eventValueTag = 'value';
// const g_eventTypeSetTag = 'set';
var g_platformTag = 'platform';
var g_majorVersionTag = 'major';
var g_minorVersionTag = 'minor';
var g_patchVersionTag = 'patch';
var g_globalTagsTag = 'extraTags';
var g_appVersionTag = 'appVersion';
var g_eventTypeSampleTag = 'sample';
var g_environmentTag = 'environment';
var g_eventTypeCounterTag = 'counter';
var g_eventInstancesTag = 'instances';
var g_defaultEndpoint = 'https://cm.miniclippt.com/client_metrics';
var g_maxTagNumber = 30;
var g_maxCharsInUID = 50;
var g_maxCharsInAppID = 50;
var g_maxCharsInTagName = 20;
var g_maxCharsInTagValue = 20;
var g_maxCharsInPlatform = 50;
var g_maxCharsInEventName = 50;
var g_maxCharsInAppVersion = 20;
var g_maxCharsInEnvironment = 50;
// const g_httpMessageTimeout = 60; //in seconds

/**
 * @param  {boolean} assertion
 * @param  {string} message
 */
function assertion_message(assertion, message) {
  /* eslint-disable no-undef */
  // if (TARGET == 'dev') {
  console.assert(assertion, message);
  // }
}
var DogTag = exports.DogTag = /*#__PURE__*/function () {
  /**
   * @param  {string} tagName
   * @param  {object} tagValue
   */
  function DogTag(tagName, tagValue) {
    (0, _classCallCheck2["default"])(this, DogTag);
    this.tagName = tagName;
    this.tagValue = tagValue;
  }
  return (0, _createClass2["default"])(DogTag, [{
    key: "asString",
    value: function asString() {
      return this.tagName + this.tagValue;
    }
  }]);
}();
var DogMetricType = exports.DogMetricType = /*#__PURE__*/function () {
  function DogMetricType() {
    (0, _classCallCheck2["default"])(this, DogMetricType);
  }
  return (0, _createClass2["default"])(DogMetricType, null, [{
    key: "Counter",
    get: function get() {
      return 1;
    }
  }, {
    key: "Histogram",
    get: function get() {
      return 2;
    }
  }]);
}();
var DogMetric = exports.DogMetric = /*#__PURE__*/function () {
  /**
   * @param  {string} name
   * @param  {DogMetricType} type
   * @param  {boolean} validate
   * @param  {object} value [optional]
   * @param  {Map} tags [optional]
   * @param  {Map} extraTags [optional]
   */
  function DogMetric(name, type, validate, value, tags, extraTags) {
    (0, _classCallCheck2["default"])(this, DogMetric);
    assertion_message(name != null, 'DataDog ERROR - metric name was not specified');
    assertion_message(type != null, 'DataDog ERROR - metric type was not specified');
    if (tags == undefined) {
      tags = new Map();
    }
    if (extraTags == undefined) {
      extraTags = new Map();
    }
    this._name = name;
    this._type = type;
    this._validate = validate;
    this._value = value;
    this._tags = tags;
    this._extraTags = extraTags;
    this._globalTags = [];
    this._percentageSent = 100.0;
  }
  return (0, _createClass2["default"])(DogMetric, [{
    key: "getName",
    value: function getName() {
      return this._name;
    }
  }, {
    key: "getType",
    value: function getType() {
      return this._type;
    }
  }, {
    key: "validate",
    value: function validate() {
      return this._validate;
    }
  }, {
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(value) {
      this._value = value;
    }
  }, {
    key: "getPercentageSent",
    value: function getPercentageSent() {
      return this._percentageSent;
    }

    /**
     * @param  {number} percentageSent
     */
  }, {
    key: "setPercentageSent",
    value: function setPercentageSent(percentageSent) {
      this._percentageSent = percentageSent;
    }
  }, {
    key: "getTags",
    value: function getTags() {
      var dogTags = [];
      var _iterator = _createForOfIteratorHelper(this._tags),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0, _slicedToArray2["default"])(_step.value, 2),
            k = _step$value[0],
            v = _step$value[1];
          if (!v || !v.asString()) {
            continue;
          }
          dogTags[k] = v.asString();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var _iterator2 = _createForOfIteratorHelper(this._extraTags),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = (0, _slicedToArray2["default"])(_step2.value, 2),
            _k = _step2$value[0],
            _v = _step2$value[1];
          if (!_v || !_v.asString()) {
            continue;
          }
          dogTags[_k] = _v.asString();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return dogTags;
    }

    /**
     * @param  {array(DogTags)} requiredTags
     */
  }, {
    key: "hasAllTags",
    value: function hasAllTags(requiredTags) {
      var _iterator3 = _createForOfIteratorHelper(requiredTags),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var requiredTag = _step3.value;
          if (this._tags.exist(requiredTag)) {
            return false;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return true;
    }
    /**
     * @param  {string} id
     * @param  {object} value
     */
  }, {
    key: "addExtraTag",
    value: function addExtraTag(id, value) {
      this._extraTags.set(id, value);
    }
  }]);
}();
var DataDog = exports.DataDog = /*#__PURE__*/function () {
  /**
   * @param  {string} appID
   * @param  {string} appVersion
   * @param  {string} UID
   * @param  {string} environment
   * @param  {string} platform
   * @param  {array} globalTags
   */
  function DataDog(appID, appVersion, UID, environment, platform, globalTags) {
    (0, _classCallCheck2["default"])(this, DataDog);
    assertion_message(appID != null, 'DataDog ERROR - appID was not specified');
    assertion_message(appVersion != null, 'DataDog ERROR - appVersion was not specified');
    assertion_message(UID != null, 'DataDog ERROR - UID was not specified');
    assertion_message(environment != null, 'DataDog ERROR - environment was not specified');
    assertion_message(platform != null, 'DataDog ERROR - platform was not specified');
    assertion_message(globalTags != null, 'DataDog ERROR - globalTags was not specified');
    this._running = false;
    this._endPoint = g_defaultEndpoint;
    this._dirtyHeader = true;
    this._uid = null;
    this._payloadHeader = {};
    this.setUID(UID);
    this.setAppID(appID);
    this.setPlatform(platform);
    this.setAppVersion(appVersion);
    this.setEnvironment(environment);
    this.setGlobalTags(globalTags);
  }
  return (0, _createClass2["default"])(DataDog, [{
    key: "uID",
    get: function get() {
      return this._uid;
    }
  }, {
    key: "isRunning",
    get: function get() {
      return this._running;
    }
  }, {
    key: "appID",
    get: function get() {
      return this._appID;
    }
  }, {
    key: "platform",
    get: function get() {
      return this._platform;
    }
  }, {
    key: "appVersion",
    get: function get() {
      return this._appVersion;
    }
  }, {
    key: "environment",
    get: function get() {
      return this._environment;
    }
  }, {
    key: "globalTags",
    get: function get() {
      return this._globalTags;
    }

    /**
     * @param  {string} uid
     */
  }, {
    key: "setUID",
    value: function setUID(uid) {
      assertion_message(uid.length <= g_maxCharsInUID, 'DataDog ERROR - UID has too many characters.');
      this._uid = uid.length <= g_maxCharsInUID ? uid : uid.substr(1, g_maxCharsInUID - 1);
      this._dirtyHeader = true;
    }

    /**
     * @param  {string} appID
     */
  }, {
    key: "setAppID",
    value: function setAppID(appID) {
      assertion_message(appID != null, 'DataDog ERROR - AppID cannot be empty.');
      assertion_message(appID.length <= g_maxCharsInAppID, 'DataDog ERROR - AppID has too many characters.');
      this._appID = appID.length <= g_maxCharsInAppID ? appID : appID.substr(1, g_maxCharsInAppID - 1);
      this._dirtyHeader = true;
    }

    /**
     * @param  {string} platform
     */
  }, {
    key: "setPlatform",
    value: function setPlatform(platform) {
      assertion_message(platform != null, 'DataDog ERROR - Platform cannot be empty.');
      assertion_message(platform.length <= g_maxCharsInPlatform, 'DataDog ERROR - Platform has too many characters.');
      this._platform = platform.length <= g_maxCharsInPlatform ? platform : platform.substr(1, g_maxCharsInPlatform - 1);
      this._dirtyHeader = true;
    }

    /**
     * @param  {string} endPoint
     */
  }, {
    key: "setEndPoint",
    value: function setEndPoint(endPoint) {
      assertion_message(endPoint != null && endPoint.length > 0, 'DataDog ERROR - Endpoint cannot be empty.');
      var httpsPrefix = 'https';
      assertion_message(endPoint && endPoint.indexOf(httpsPrefix) == -1, 'DataDog ERROR - Endpoint must be secure! (use https)');
      this._endPoint = !endPoint ? g_defaultEndpoint : endPoint;
    }

    /**
     * @param  {string} appVersion
     */
  }, {
    key: "setAppVersion",
    value: function setAppVersion(appVersion) {
      assertion_message(appVersion != null, 'DataDog ERROR - AppVersion cannot be empty.');
      assertion_message(appVersion.length <= g_maxCharsInAppVersion, 'DataDog ERROR - AppVersion has too many characters.');
      var versions = appVersion.split('.');
      assertion_message(versions.length == 3, 'DataDog ERROR - AppVersion must match semantic versioning format.');
      this._major = '0';
      this._minor = '0';
      this._patch = '0';
      if (versions.length >= 1) {
        this._major = versions[0];
      }
      if (versions.length >= 2) {
        this._minor = versions[1];
      }
      if (versions.length >= 3) {
        this._patch = versions[2];
      }
      this._appVersion = appVersion.length <= g_maxCharsInAppVersion ? appVersion : appVersion.substr(1, g_maxCharsInAppVersion - 1);
      this._dirtyHeader = true;
    }

    /**
     * @param  {string} environment
     */
  }, {
    key: "setEnvironment",
    value: function setEnvironment(environment) {
      assertion_message(environment, 'DataDog ERROR - Environment cannot be empty.');
      assertion_message(environment.length <= g_maxCharsInEnvironment, 'DataDog ERROR - Environment has too many characters.');
      this._environment = environment.length <= g_maxCharsInEnvironment ? environment : environment.substr(1, g_maxCharsInEnvironment - 1);
      this._dirtyHeader = true;
    }

    /**
     * @param  {array(DogTag)} globalTags
     */
  }, {
    key: "setGlobalTags",
    value: function setGlobalTags(globalTags) {
      assertion_message(globalTags.length <= g_maxTagNumber, 'DataDog ERROR - GlobalTags has too many tags.');
      this._dirtyHeader = true;
      this._globalTags = globalTags;
    }

    /**
     * @param  {DogTag} dogTag
     */
  }, {
    key: "addGlobalTag",
    value: function addGlobalTag(dogTag) {
      assertion_message(this._globalTags.length <= g_maxTagNumber, 'DataDog ERROR - GlobalTags has too many tags.');
      if (this._globalTags.length < g_maxTagNumber) {
        this._globalTags.push(dogTag);
        this._dirtyHeader = true;
      }
    }

    // addGlobalTag(tagName, tagValue){
    //     addGlobalTag({tagName, tagValue});
    // }

    /**
     * @param  {BaseMetric} metric
     *
     * return boolean
     */
  }, {
    key: "send",
    value: function send(metric) {
      if (!metric.validate()) {
        return false;
      }
      var perc = metric.getPercentageSent();
      if (perc < 100 && (perc == 0 || perc > Math.random() * 100)) {
        return false;
      }
      switch (metric.getType()) {
        case DogMetricType.Counter:
          return this.registerCountEvent(metric.getName(), metric.getTags());
        case DogMetricType.Histogram:
          return this.registerSampleEvent(metric.getName(), metric.value, metric.getTags());
      }
      return false;
    }

    /**
     * @param  {string} eventName
     * @param  {array(DogTags)} eventTags
     *
     * return boolean
     */
  }, {
    key: "registerCountEvent",
    value: function registerCountEvent(eventName, eventTags) {
      assertion_message(eventName.length <= g_maxTagNumber, 'DataDog ERROR - Event has too many tags.');
      var eventNameInPayload = eventName;
      assertion_message(eventNameInPayload.length <= g_maxCharsInEventName, 'DataDog ERROR - Event name has too many characters.');
      if (!eventName) {
        assertion_message(false, 'DataDog ERROR - Event name cannot be empty.');
        return false;
      }
      var clippedTags = this.clipDogTags(eventTags);
      var name = eventNameInPayload.length <= g_maxCharsInEventName ? eventNameInPayload : eventNameInPayload.substr(1, g_maxCharsInEventName - 1);
      return this.sendSingleEvent(name, 1, clippedTags, g_eventTypeCounterTag);
    }

    /**
     * @param  {string} eventName
     * @param  {object} value - Needs to be a numeric type.
     * @param  {array(DogTag)} eventTags
     *
     * return boolean
     */
  }, {
    key: "registerSampleEvent",
    value: function registerSampleEvent(eventName, value, eventTags) {
      // reject all types that aren't numeric
      assertion_message(!isNaN(value), 'Unsupported argument type for value');
      return this.storeEventSample(eventName, value, eventTags);
    }

    /**
     * @param  {array(DogTag)} dogTags
     *
     * return array
     */
  }, {
    key: "clipDogTags",
    value: function clipDogTags(dogTags) {
      var clippedTags = dogTags.concat();
      if (dogTags.length > g_maxTagNumber) {
        assertion_message(false, 'DataDog ERROR - DogTag vector has too many tags.');
        clippedTags.splice(g_maxTagNumber);
      }
      var _iterator4 = _createForOfIteratorHelper(clippedTags),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var tag = _step4.value;
          if (tag) {
            if (tag.tagName.length > g_maxCharsInTagName) {
              assertion_message(false, 'DataDog ERROR - TagName has too many characters.');
              tag.tagName = tag.tagName.substr(0, g_maxCharsInTagName);
            }
            if (tag.tagValue.length > g_maxCharsInTagValue) {
              assertion_message(false, 'DataDog ERROR - TagValue has too many characters.');
              tag.tagValue = tag.tagValue.substr(0, g_maxCharsInTagValue);
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      return clippedTags;
    }

    /**
     * @param  {string} eventName
     * @param  {object} value
     * @param  {array(DogTa)} eventTags
     *
     * return boolean
     */
  }, {
    key: "storeEventSample",
    value: function storeEventSample(eventName, value, eventTags) {
      assertion_message(eventName.length <= g_maxTagNumber, 'DataDog ERROR - Event has too many tags.');
      var eventNameInPayload = eventName;
      assertion_message(eventNameInPayload.length <= g_maxCharsInEventName, 'DataDog ERROR - Event name has too many characters.');
      if (eventName == null) {
        assertion_message(false, 'DataDog ERROR - Event name cannot be empty.');
        return false;
      }
      var clippedTags = this.clipDogTags(eventTags);
      var name = eventNameInPayload.length <= g_maxCharsInEventName ? eventNameInPayload : eventNameInPayload.substr(0, g_maxCharsInEventName - 1);
      return this.sendSingleEvent(name, value, clippedTags, g_eventTypeSampleTag);
    }

    /**
     * @param  {string} eventName
     * @param  {object} value
     * @param  {array(DogTag)} eventTags
     * @param  {DogMetricType} eventTypeTag
     *
     * return boolean
     */
  }, {
    key: "sendSingleEvent",
    value: function sendSingleEvent(eventName, value, eventTags, eventTypeTag) {
      if (this._dirtyHeader) {
        this.recompilePayloadHeader();
      }
      var instance = {};
      instance[g_eventValueTag] = value;
      if (eventTags.length > 0) {
        instance[g_eventTagsTag] = this.convertDogTagsToValue(eventTags);
      }
      var instanceVector = [];
      instanceVector.push(instance);
      var eventVector = [];
      eventVector.push(this.createEventPayload(eventName, eventTypeTag, instanceVector));
      var payload = this.packPayload(this._payloadHeader, eventVector);
      if (payload) {
        return this.sendPayload(payload);
      }
      return false;
    }

    /**
     */
  }, {
    key: "recompilePayloadHeader",
    value: function recompilePayloadHeader() {
      if (this._uid) {
        this._payloadHeader[g_uidTag] = this._uid;
      }
      this._payloadHeader[g_appIDTag] = this._appID;
      this._payloadHeader[g_appVersionTag] = this._appVersion;
      this._payloadHeader[g_environmentTag] = this._environment;
      this._payloadHeader[g_platformTag] = this._platform;
      this._globalTags = this.clipDogTags(this._globalTags);
      var payloadGlobalTags = [];
      if (this._globalTags.length != 0) {
        var _iterator5 = _createForOfIteratorHelper(this._globalTags),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var dogTag = _step5.value;
            var payloadDogTag = {};
            payloadDogTag[g_tagNameTag] = dogTag.tagName;
            payloadDogTag[g_tagValueTag] = dogTag.tagValue;
            payloadGlobalTags.push(payloadDogTag);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      var majorTag = {};
      majorTag[g_tagNameTag] = g_majorVersionTag;
      majorTag[g_tagValueTag] = this._major;
      var minorTag = {};
      minorTag[g_tagNameTag] = g_minorVersionTag;
      minorTag[g_tagValueTag] = this._minor;
      var patchTag = {};
      patchTag[g_tagNameTag] = g_patchVersionTag;
      patchTag[g_tagValueTag] = this._patch;
      payloadGlobalTags.push(majorTag);
      payloadGlobalTags.push(minorTag);
      payloadGlobalTags.push(patchTag);
      this._payloadHeader[g_globalTagsTag] = payloadGlobalTags;
      this._dirtyHeader = false;
    }

    /**
     * @param  {array(DogTag)} dogTags
     *
     * return array
     */
  }, {
    key: "convertDogTagsToValue",
    value: function convertDogTagsToValue(dogTags) {
      var dogTagsValues = [];
      var _iterator6 = _createForOfIteratorHelper(dogTags),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var dogTag = _step6.value;
          var dogTagStringMap = {};
          dogTagStringMap[g_tagNameTag] = dogTag.tagName;
          dogTagStringMap[g_tagValueTag] = dogTag.tagValue;
          dogTagsValues.push(dogTagStringMap);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      return dogTagsValues;
    }

    /**
     * @param  {string} eventName
     * @param  {DogMetricType} eventType
     * @param  {array} instances
     *
     * return object
     */
  }, {
    key: "createEventPayload",
    value: function createEventPayload(eventName, eventType, instances) {
      var eventPayload = {};
      eventPayload[g_eventNameTag] = eventName;
      eventPayload[g_eventTypeTag] = eventType;
      eventPayload[g_eventInstancesTag] = instances;
      return eventPayload;
    }

    /**
     * @param  {array} payloadHeader
     * @param  {array} eventVector
     *
     * return string
     */
  }, {
    key: "packPayload",
    value: function packPayload(payloadHeader, eventVector) {
      var payload = {};
      payload[g_headerTag] = payloadHeader;
      payload[g_bodyTag] = eventVector;

      // json creation
      var jsonOutput = JSON.stringify(payload);
      assertion_message(jsonOutput != null, 'DataDog ERROR - Failed to generate payload at json conversion');
      return jsonOutput;
    }

    /**
     * @param  {string} payload
     *
     * return boolean
     */
  }, {
    key: "sendPayload",
    value: function sendPayload(payload) {
      if (payload.length == 0) {
        assertion_message(false, 'DataDog ERROR - Failed to send payload as it is empty');
        return false;
      }
      if (!this.sendHTTP(payload)) {
        return false;
      }

      // let milliseconds = (new Date).getTime();
      // this._sentPosts.set(connectionID, {payload, milliseconds});

      return true;
    }

    /**
     * @param  {string} payload
     *
     * return boolean
     */
  }, {
    key: "sendHTTP",
    value: function sendHTTP(payload) {
      var _this = this;
      if (this._endPoint == null || this._endPoint.length == 0) {
        assertion_message(false, 'DataDog ERROR - Failed to send payload as endpoint is empty');
        return false;
      }
      try {
        var opt = {
          headers: {
            'content-type': 'application/json; charset=UTF-8'
          },
          mode: 'no-cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          body: payload,
          method: 'POST',
          redirect: 'follow',
          // manual, *follow, error
          referrer: 'no-referrer' // no-referrer, *client
        };
        fetch(this._endPoint, opt).then(function (data) {
          if (data.ok) {
            return data.json();
          } else {
            _this.httpFailure('no data');
          }
        }).then(function (res) {
          return _this.httpSuccess(res);
        })["catch"](function (error) {
          return _this.httpFailure(error);
        });
      } catch (e) {
        assertion_message(false, 'DataDog ERROR - Failed to start HTTP Connection');
        return false;
      }

      // call timeout? use g_httpMessageTimeout;

      return true;
    }

    /**
     */
  }, {
    key: "httpSuccess",
    value: function httpSuccess(res) {
      // Nice! :)
      // console.log('datadog', res);
    }

    /**
     */
  }, {
    key: "httpFailure",
    value: function httpFailure(error) {
      // Ups, do you want to do something about that?
      // console.log('datadog error', error);
    }
  }]);
}();
var _default = exports["default"] = DataDog;

/***/ }),
/* 393 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(394);
var iterableToArrayLimit = __webpack_require__(395);
var unsupportedIterableToArray = __webpack_require__(396);
var nonIterableRest = __webpack_require__(398);
function _slicedToArray(r, e) {
  return arrayWithHoles(r) || iterableToArrayLimit(r, e) || unsupportedIterableToArray(r, e) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 394 */
/***/ (function(module, exports) {

function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 395 */
/***/ (function(module, exports) {

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 396 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(397);
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? arrayLikeToArray(r, a) : void 0;
  }
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 397 */
/***/ (function(module, exports) {

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 398 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(2);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(21));
var _createClass2 = _interopRequireDefault(__webpack_require__(22));
var _queryManager = __webpack_require__(83);
var QueryHandler = exports["default"] = /*#__PURE__*/function () {
  function QueryHandler(queryKeys, resolve, reject) {
    (0, _classCallCheck2["default"])(this, QueryHandler);
    this.handled;
    this.failed;
    this.resolve = resolve;
    this.reject = reject;
    this.queryKeys = queryKeys;
  }
  return (0, _createClass2["default"])(QueryHandler, [{
    key: "execute",
    value: function execute() {
      var _this = this;
      var filteredQuery = Object.entries(_queryManager.queryString).filter(function (key) {
        return _this.queryKeys.indexOf(key[0]) >= 0;
      });
      var queryValues = Object.fromEntries(filteredQuery);
      return new Promise(function (resolve, reject) {
        _this.resolve(queryValues);
        resolve();
      });
    }
  }]);
}();

/***/ }),
/* 400 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 401 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 402 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 403 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 404 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 405 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[260]);