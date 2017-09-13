(function() {
    function n(n) {
        function t(t, r, e, u, i, o) {
            for (; i >= 0 && o > i; i += n) {
                var a = u ? u[i] : i;
                e = r(e, t[a], a, t)
            }
            return e
        }
        return function(r, e, u, i) {
            e = b(e, i, 4);
            var o = !k(r) && m.keys(r),
                a = (o || r).length,
                c = n > 0 ? 0 : a - 1;
            return arguments.length < 3 && (u = r[o ? o[c] : c], c += n), t(r, e, u, o, c, a)
        }
    }

    function t(n) {
        return function(t, r, e) {
            r = x(r, e);
            for (var u = O(t), i = n > 0 ? 0 : u - 1; i >= 0 && u > i; i += n)
                if (r(t[i], i, t)) return i;
            return -1
        }
    }

    function r(n, t, r) {
        return function(e, u, i) {
            var o = 0,
                a = O(e);
            if ("number" == typeof i) n > 0 ? o = i >= 0 ? i : Math.max(i + a, o) : a = i >= 0 ? Math.min(i + 1, a) : i + a + 1;
            else if (r && i && a) return i = r(e, u), e[i] === u ? i : -1;
            if (u !== u) return i = t(l.call(e, o, a), m.isNaN), i >= 0 ? i + o : -1;
            for (i = n > 0 ? o : a - 1; i >= 0 && a > i; i += n)
                if (e[i] === u) return i;
            return -1
        }
    }

    function e(n, t) {
        var r = I.length,
            e = n.constructor,
            u = m.isFunction(e) && e.prototype || a,
            i = "constructor";
        for (m.has(n, i) && !m.contains(t, i) && t.push(i); r--;) i = I[r], i in n && n[i] !== u[i] && !m.contains(t, i) && t.push(i)
    }
    var u = this,
        i = u._,
        o = Array.prototype,
        a = Object.prototype,
        c = Function.prototype,
        f = o.push,
        l = o.slice,
        s = a.toString,
        p = a.hasOwnProperty,
        h = Array.isArray,
        v = Object.keys,
        g = c.bind,
        y = Object.create,
        d = function() {},
        m = function(n) {
            return n instanceof m ? n : this instanceof m ? void(this._wrapped = n) : new m(n)
        };
    "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = m), exports._ = m) : u._ = m, m.VERSION = "1.8.3";
    var b = function(n, t, r) {
            if (t === void 0) return n;
            switch (null == r ? 3 : r) {
                case 1:
                    return function(r) {
                        return n.call(t, r)
                    };
                case 2:
                    return function(r, e) {
                        return n.call(t, r, e)
                    };
                case 3:
                    return function(r, e, u) {
                        return n.call(t, r, e, u)
                    };
                case 4:
                    return function(r, e, u, i) {
                        return n.call(t, r, e, u, i)
                    }
            }
            return function() {
                return n.apply(t, arguments)
            }
        },
        x = function(n, t, r) {
            return null == n ? m.identity : m.isFunction(n) ? b(n, t, r) : m.isObject(n) ? m.matcher(n) : m.property(n)
        };
    m.iteratee = function(n, t) {
        return x(n, t, 1 / 0)
    };
    var _ = function(n, t) {
            return function(r) {
                var e = arguments.length;
                if (2 > e || null == r) return r;
                for (var u = 1; e > u; u++)
                    for (var i = arguments[u], o = n(i), a = o.length, c = 0; a > c; c++) {
                        var f = o[c];
                        t && r[f] !== void 0 || (r[f] = i[f])
                    }
                return r
            }
        },
        j = function(n) {
            if (!m.isObject(n)) return {};
            if (y) return y(n);
            d.prototype = n;
            var t = new d;
            return d.prototype = null, t
        },
        w = function(n) {
            return function(t) {
                return null == t ? void 0 : t[n]
            }
        },
        A = Math.pow(2, 53) - 1,
        O = w("length"),
        k = function(n) {
            var t = O(n);
            return "number" == typeof t && t >= 0 && A >= t
        };
    m.each = m.forEach = function(n, t, r) {
        t = b(t, r);
        var e, u;
        if (k(n))
            for (e = 0, u = n.length; u > e; e++) t(n[e], e, n);
        else {
            var i = m.keys(n);
            for (e = 0, u = i.length; u > e; e++) t(n[i[e]], i[e], n)
        }
        return n
    }, m.map = m.collect = function(n, t, r) {
        t = x(t, r);
        for (var e = !k(n) && m.keys(n), u = (e || n).length, i = Array(u), o = 0; u > o; o++) {
            var a = e ? e[o] : o;
            i[o] = t(n[a], a, n)
        }
        return i
    }, m.reduce = m.foldl = m.inject = n(1), m.reduceRight = m.foldr = n(-1), m.find = m.detect = function(n, t, r) {
        var e;
        return e = k(n) ? m.findIndex(n, t, r) : m.findKey(n, t, r), e !== void 0 && e !== -1 ? n[e] : void 0
    }, m.filter = m.select = function(n, t, r) {
        var e = [];
        return t = x(t, r), m.each(n, function(n, r, u) {
            t(n, r, u) && e.push(n)
        }), e
    }, m.reject = function(n, t, r) {
        return m.filter(n, m.negate(x(t)), r)
    }, m.every = m.all = function(n, t, r) {
        t = x(t, r);
        for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
            var o = e ? e[i] : i;
            if (!t(n[o], o, n)) return !1
        }
        return !0
    }, m.some = m.any = function(n, t, r) {
        t = x(t, r);
        for (var e = !k(n) && m.keys(n), u = (e || n).length, i = 0; u > i; i++) {
            var o = e ? e[i] : i;
            if (t(n[o], o, n)) return !0
        }
        return !1
    }, m.contains = m.includes = m.include = function(n, t, r, e) {
        return k(n) || (n = m.values(n)), ("number" != typeof r || e) && (r = 0), m.indexOf(n, t, r) >= 0
    }, m.invoke = function(n, t) {
        var r = l.call(arguments, 2),
            e = m.isFunction(t);
        return m.map(n, function(n) {
            var u = e ? t : n[t];
            return null == u ? u : u.apply(n, r)
        })
    }, m.pluck = function(n, t) {
        return m.map(n, m.property(t))
    }, m.where = function(n, t) {
        return m.filter(n, m.matcher(t))
    }, m.findWhere = function(n, t) {
        return m.find(n, m.matcher(t))
    }, m.max = function(n, t, r) {
        var e, u, i = -1 / 0,
            o = -1 / 0;
        if (null == t && null != n) {
            n = k(n) ? n : m.values(n);
            for (var a = 0, c = n.length; c > a; a++) e = n[a], e > i && (i = e)
        } else t = x(t, r), m.each(n, function(n, r, e) {
            u = t(n, r, e), (u > o || u === -1 / 0 && i === -1 / 0) && (i = n, o = u)
        });
        return i
    }, m.min = function(n, t, r) {
        var e, u, i = 1 / 0,
            o = 1 / 0;
        if (null == t && null != n) {
            n = k(n) ? n : m.values(n);
            for (var a = 0, c = n.length; c > a; a++) e = n[a], i > e && (i = e)
        } else t = x(t, r), m.each(n, function(n, r, e) {
            u = t(n, r, e), (o > u || 1 / 0 === u && 1 / 0 === i) && (i = n, o = u)
        });
        return i
    }, m.shuffle = function(n) {
        for (var t, r = k(n) ? n : m.values(n), e = r.length, u = Array(e), i = 0; e > i; i++) t = m.random(0, i), t !== i && (u[i] = u[t]), u[t] = r[i];
        return u
    }, m.sample = function(n, t, r) {
        return null == t || r ? (k(n) || (n = m.values(n)), n[m.random(n.length - 1)]) : m.shuffle(n).slice(0, Math.max(0, t))
    }, m.sortBy = function(n, t, r) {
        return t = x(t, r), m.pluck(m.map(n, function(n, r, e) {
            return {
                value: n,
                index: r,
                criteria: t(n, r, e)
            }
        }).sort(function(n, t) {
            var r = n.criteria,
                e = t.criteria;
            if (r !== e) {
                if (r > e || r === void 0) return 1;
                if (e > r || e === void 0) return -1
            }
            return n.index - t.index
        }), "value")
    };
    var F = function(n) {
        return function(t, r, e) {
            var u = {};
            return r = x(r, e), m.each(t, function(e, i) {
                var o = r(e, i, t);
                n(u, e, o)
            }), u
        }
    };
    m.groupBy = F(function(n, t, r) {
        m.has(n, r) ? n[r].push(t) : n[r] = [t]
    }), m.indexBy = F(function(n, t, r) {
        n[r] = t
    }), m.countBy = F(function(n, t, r) {
        m.has(n, r) ? n[r]++ : n[r] = 1
    }), m.toArray = function(n) {
        return n ? m.isArray(n) ? l.call(n) : k(n) ? m.map(n, m.identity) : m.values(n) : []
    }, m.size = function(n) {
        return null == n ? 0 : k(n) ? n.length : m.keys(n).length
    }, m.partition = function(n, t, r) {
        t = x(t, r);
        var e = [],
            u = [];
        return m.each(n, function(n, r, i) {
            (t(n, r, i) ? e : u).push(n)
        }), [e, u]
    }, m.first = m.head = m.take = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[0] : m.initial(n, n.length - t)
    }, m.initial = function(n, t, r) {
        return l.call(n, 0, Math.max(0, n.length - (null == t || r ? 1 : t)))
    }, m.last = function(n, t, r) {
        return null == n ? void 0 : null == t || r ? n[n.length - 1] : m.rest(n, Math.max(0, n.length - t))
    }, m.rest = m.tail = m.drop = function(n, t, r) {
        return l.call(n, null == t || r ? 1 : t)
    }, m.compact = function(n) {
        return m.filter(n, m.identity)
    };
    var S = function(n, t, r, e) {
        for (var u = [], i = 0, o = e || 0, a = O(n); a > o; o++) {
            var c = n[o];
            if (k(c) && (m.isArray(c) || m.isArguments(c))) {
                t || (c = S(c, t, r));
                var f = 0,
                    l = c.length;
                for (u.length += l; l > f;) u[i++] = c[f++]
            } else r || (u[i++] = c)
        }
        return u
    };
    m.flatten = function(n, t) {
        return S(n, t, !1)
    }, m.without = function(n) {
        return m.difference(n, l.call(arguments, 1))
    }, m.uniq = m.unique = function(n, t, r, e) {
        m.isBoolean(t) || (e = r, r = t, t = !1), null != r && (r = x(r, e));
        for (var u = [], i = [], o = 0, a = O(n); a > o; o++) {
            var c = n[o],
                f = r ? r(c, o, n) : c;
            t ? (o && i === f || u.push(c), i = f) : r ? m.contains(i, f) || (i.push(f), u.push(c)) : m.contains(u, c) || u.push(c)
        }
        return u
    }, m.union = function() {
        return m.uniq(S(arguments, !0, !0))
    }, m.intersection = function(n) {
        for (var t = [], r = arguments.length, e = 0, u = O(n); u > e; e++) {
            var i = n[e];
            if (!m.contains(t, i)) {
                for (var o = 1; r > o && m.contains(arguments[o], i); o++);
                o === r && t.push(i)
            }
        }
        return t
    }, m.difference = function(n) {
        var t = S(arguments, !0, !0, 1);
        return m.filter(n, function(n) {
            return !m.contains(t, n)
        })
    }, m.zip = function() {
        return m.unzip(arguments)
    }, m.unzip = function(n) {
        for (var t = n && m.max(n, O).length || 0, r = Array(t), e = 0; t > e; e++) r[e] = m.pluck(n, e);
        return r
    }, m.object = function(n, t) {
        for (var r = {}, e = 0, u = O(n); u > e; e++) t ? r[n[e]] = t[e] : r[n[e][0]] = n[e][1];
        return r
    }, m.findIndex = t(1), m.findLastIndex = t(-1), m.sortedIndex = function(n, t, r, e) {
        r = x(r, e, 1);
        for (var u = r(t), i = 0, o = O(n); o > i;) {
            var a = Math.floor((i + o) / 2);
            r(n[a]) < u ? i = a + 1 : o = a
        }
        return i
    }, m.indexOf = r(1, m.findIndex, m.sortedIndex), m.lastIndexOf = r(-1, m.findLastIndex), m.range = function(n, t, r) {
        null == t && (t = n || 0, n = 0), r = r || 1;
        for (var e = Math.max(Math.ceil((t - n) / r), 0), u = Array(e), i = 0; e > i; i++, n += r) u[i] = n;
        return u
    };
    var E = function(n, t, r, e, u) {
        if (!(e instanceof t)) return n.apply(r, u);
        var i = j(n.prototype),
            o = n.apply(i, u);
        return m.isObject(o) ? o : i
    };
    m.bind = function(n, t) {
        if (g && n.bind === g) return g.apply(n, l.call(arguments, 1));
        if (!m.isFunction(n)) throw new TypeError("Bind must be called on a function");
        var r = l.call(arguments, 2),
            e = function() {
                return E(n, e, t, this, r.concat(l.call(arguments)))
            };
        return e
    }, m.partial = function(n) {
        var t = l.call(arguments, 1),
            r = function() {
                for (var e = 0, u = t.length, i = Array(u), o = 0; u > o; o++) i[o] = t[o] === m ? arguments[e++] : t[o];
                for (; e < arguments.length;) i.push(arguments[e++]);
                return E(n, r, this, this, i)
            };
        return r
    }, m.bindAll = function(n) {
        var t, r, e = arguments.length;
        if (1 >= e) throw new Error("bindAll must be passed function names");
        for (t = 1; e > t; t++) r = arguments[t], n[r] = m.bind(n[r], n);
        return n
    }, m.memoize = function(n, t) {
        var r = function(e) {
            var u = r.cache,
                i = "" + (t ? t.apply(this, arguments) : e);
            return m.has(u, i) || (u[i] = n.apply(this, arguments)), u[i]
        };
        return r.cache = {}, r
    }, m.delay = function(n, t) {
        var r = l.call(arguments, 2);
        return setTimeout(function() {
            return n.apply(null, r)
        }, t)
    }, m.defer = m.partial(m.delay, m, 1), m.throttle = function(n, t, r) {
        var e, u, i, o = null,
            a = 0;
        r || (r = {});
        var c = function() {
            a = r.leading === !1 ? 0 : m.now(), o = null, i = n.apply(e, u), o || (e = u = null)
        };
        return function() {
            var f = m.now();
            a || r.leading !== !1 || (a = f);
            var l = t - (f - a);
            return e = this, u = arguments, 0 >= l || l > t ? (o && (clearTimeout(o), o = null), a = f, i = n.apply(e, u), o || (e = u = null)) : o || r.trailing === !1 || (o = setTimeout(c, l)), i
        }
    }, m.debounce = function(n, t, r) {
        var e, u, i, o, a, c = function() {
            var f = m.now() - o;
            t > f && f >= 0 ? e = setTimeout(c, t - f) : (e = null, r || (a = n.apply(i, u), e || (i = u = null)))
        };
        return function() {
            i = this, u = arguments, o = m.now();
            var f = r && !e;
            return e || (e = setTimeout(c, t)), f && (a = n.apply(i, u), i = u = null), a
        }
    }, m.wrap = function(n, t) {
        return m.partial(t, n)
    }, m.negate = function(n) {
        return function() {
            return !n.apply(this, arguments)
        }
    }, m.compose = function() {
        var n = arguments,
            t = n.length - 1;
        return function() {
            for (var r = t, e = n[t].apply(this, arguments); r--;) e = n[r].call(this, e);
            return e
        }
    }, m.after = function(n, t) {
        return function() {
            return --n < 1 ? t.apply(this, arguments) : void 0
        }
    }, m.before = function(n, t) {
        var r;
        return function() {
            return --n > 0 && (r = t.apply(this, arguments)), 1 >= n && (t = null), r
        }
    }, m.once = m.partial(m.before, 2);
    var M = !{
            toString: null
        }.propertyIsEnumerable("toString"),
        I = ["valueOf", "isPrototypeOf", "toString", "propertyIsEnumerable", "hasOwnProperty", "toLocaleString"];
    m.keys = function(n) {
        if (!m.isObject(n)) return [];
        if (v) return v(n);
        var t = [];
        for (var r in n) m.has(n, r) && t.push(r);
        return M && e(n, t), t
    }, m.allKeys = function(n) {
        if (!m.isObject(n)) return [];
        var t = [];
        for (var r in n) t.push(r);
        return M && e(n, t), t
    }, m.values = function(n) {
        for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = n[t[u]];
        return e
    }, m.mapObject = function(n, t, r) {
        t = x(t, r);
        for (var e, u = m.keys(n), i = u.length, o = {}, a = 0; i > a; a++) e = u[a], o[e] = t(n[e], e, n);
        return o
    }, m.pairs = function(n) {
        for (var t = m.keys(n), r = t.length, e = Array(r), u = 0; r > u; u++) e[u] = [t[u], n[t[u]]];
        return e
    }, m.invert = function(n) {
        for (var t = {}, r = m.keys(n), e = 0, u = r.length; u > e; e++) t[n[r[e]]] = r[e];
        return t
    }, m.functions = m.methods = function(n) {
        var t = [];
        for (var r in n) m.isFunction(n[r]) && t.push(r);
        return t.sort()
    }, m.extend = _(m.allKeys), m.extendOwn = m.assign = _(m.keys), m.findKey = function(n, t, r) {
        t = x(t, r);
        for (var e, u = m.keys(n), i = 0, o = u.length; o > i; i++)
            if (e = u[i], t(n[e], e, n)) return e
    }, m.pick = function(n, t, r) {
        var e, u, i = {},
            o = n;
        if (null == o) return i;
        m.isFunction(t) ? (u = m.allKeys(o), e = b(t, r)) : (u = S(arguments, !1, !1, 1), e = function(n, t, r) {
            return t in r
        }, o = Object(o));
        for (var a = 0, c = u.length; c > a; a++) {
            var f = u[a],
                l = o[f];
            e(l, f, o) && (i[f] = l)
        }
        return i
    }, m.omit = function(n, t, r) {
        if (m.isFunction(t)) t = m.negate(t);
        else {
            var e = m.map(S(arguments, !1, !1, 1), String);
            t = function(n, t) {
                return !m.contains(e, t)
            }
        }
        return m.pick(n, t, r)
    }, m.defaults = _(m.allKeys, !0), m.create = function(n, t) {
        var r = j(n);
        return t && m.extendOwn(r, t), r
    }, m.clone = function(n) {
        return m.isObject(n) ? m.isArray(n) ? n.slice() : m.extend({}, n) : n
    }, m.tap = function(n, t) {
        return t(n), n
    }, m.isMatch = function(n, t) {
        var r = m.keys(t),
            e = r.length;
        if (null == n) return !e;
        for (var u = Object(n), i = 0; e > i; i++) {
            var o = r[i];
            if (t[o] !== u[o] || !(o in u)) return !1
        }
        return !0
    };
    var N = function(n, t, r, e) {
        if (n === t) return 0 !== n || 1 / n === 1 / t;
        if (null == n || null == t) return n === t;
        n instanceof m && (n = n._wrapped), t instanceof m && (t = t._wrapped);
        var u = s.call(n);
        if (u !== s.call(t)) return !1;
        switch (u) {
            case "[object RegExp]":
            case "[object String]":
                return "" + n == "" + t;
            case "[object Number]":
                return +n !== +n ? +t !== +t : 0 === +n ? 1 / +n === 1 / t : +n === +t;
            case "[object Date]":
            case "[object Boolean]":
                return +n === +t
        }
        var i = "[object Array]" === u;
        if (!i) {
            if ("object" != typeof n || "object" != typeof t) return !1;
            var o = n.constructor,
                a = t.constructor;
            if (o !== a && !(m.isFunction(o) && o instanceof o && m.isFunction(a) && a instanceof a) && "constructor" in n && "constructor" in t) return !1
        }
        r = r || [], e = e || [];
        for (var c = r.length; c--;)
            if (r[c] === n) return e[c] === t;
        if (r.push(n), e.push(t), i) {
            if (c = n.length, c !== t.length) return !1;
            for (; c--;)
                if (!N(n[c], t[c], r, e)) return !1
        } else {
            var f, l = m.keys(n);
            if (c = l.length, m.keys(t).length !== c) return !1;
            for (; c--;)
                if (f = l[c], !m.has(t, f) || !N(n[f], t[f], r, e)) return !1
        }
        return r.pop(), e.pop(), !0
    };
    m.isEqual = function(n, t) {
        return N(n, t)
    }, m.isEmpty = function(n) {
        return null == n ? !0 : k(n) && (m.isArray(n) || m.isString(n) || m.isArguments(n)) ? 0 === n.length : 0 === m.keys(n).length
    }, m.isElement = function(n) {
        return !(!n || 1 !== n.nodeType)
    }, m.isArray = h || function(n) {
        return "[object Array]" === s.call(n)
    }, m.isObject = function(n) {
        var t = typeof n;
        return "function" === t || "object" === t && !!n
    }, m.each(["Arguments", "Function", "String", "Number", "Date", "RegExp", "Error"], function(n) {
        m["is" + n] = function(t) {
            return s.call(t) === "[object " + n + "]"
        }
    }), m.isArguments(arguments) || (m.isArguments = function(n) {
        return m.has(n, "callee")
    }), "function" != typeof /./ && "object" != typeof Int8Array && (m.isFunction = function(n) {
        return "function" == typeof n || !1
    }), m.isFinite = function(n) {
        return isFinite(n) && !isNaN(parseFloat(n))
    }, m.isNaN = function(n) {
        return m.isNumber(n) && n !== +n
    }, m.isBoolean = function(n) {
        return n === !0 || n === !1 || "[object Boolean]" === s.call(n)
    }, m.isNull = function(n) {
        return null === n
    }, m.isUndefined = function(n) {
        return n === void 0
    }, m.has = function(n, t) {
        return null != n && p.call(n, t)
    }, m.noConflict = function() {
        return u._ = i, this
    }, m.identity = function(n) {
        return n
    }, m.constant = function(n) {
        return function() {
            return n
        }
    }, m.noop = function() {}, m.property = w, m.propertyOf = function(n) {
        return null == n ? function() {} : function(t) {
            return n[t]
        }
    }, m.matcher = m.matches = function(n) {
        return n = m.extendOwn({}, n),
            function(t) {
                return m.isMatch(t, n)
            }
    }, m.times = function(n, t, r) {
        var e = Array(Math.max(0, n));
        t = b(t, r, 1);
        for (var u = 0; n > u; u++) e[u] = t(u);
        return e
    }, m.random = function(n, t) {
        return null == t && (t = n, n = 0), n + Math.floor(Math.random() * (t - n + 1))
    }, m.now = Date.now || function() {
        return (new Date).getTime()
    };
    var B = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        },
        T = m.invert(B),
        R = function(n) {
            var t = function(t) {
                    return n[t]
                },
                r = "(?:" + m.keys(n).join("|") + ")",
                e = RegExp(r),
                u = RegExp(r, "g");
            return function(n) {
                return n = null == n ? "" : "" + n, e.test(n) ? n.replace(u, t) : n
            }
        };
    m.escape = R(B), m.unescape = R(T), m.result = function(n, t, r) {
        var e = null == n ? void 0 : n[t];
        return e === void 0 && (e = r), m.isFunction(e) ? e.call(n) : e
    };
    var q = 0;
    m.uniqueId = function(n) {
        var t = ++q + "";
        return n ? n + t : t
    }, m.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var K = /(.)^/,
        z = {
            "'": "'",
            "\\": "\\",
            "\r": "r",
            "\n": "n",
            "\u2028": "u2028",
            "\u2029": "u2029"
        },
        D = /\\|'|\r|\n|\u2028|\u2029/g,
        L = function(n) {
            return "\\" + z[n]
        };
    m.template = function(n, t, r) {
        !t && r && (t = r), t = m.defaults({}, t, m.templateSettings);
        var e = RegExp([(t.escape || K).source, (t.interpolate || K).source, (t.evaluate || K).source].join("|") + "|$", "g"),
            u = 0,
            i = "__p+='";
        n.replace(e, function(t, r, e, o, a) {
            return i += n.slice(u, a).replace(D, L), u = a + t.length, r ? i += "'+\n((__t=(" + r + "))==null?'':_.escape(__t))+\n'" : e ? i += "'+\n((__t=(" + e + "))==null?'':__t)+\n'" : o && (i += "';\n" + o + "\n__p+='"), t
        }), i += "';\n", t.variable || (i = "with(obj||{}){\n" + i + "}\n"), i = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + i + "return __p;\n";
        try {
            var o = new Function(t.variable || "obj", "_", i)
        } catch (a) {
            throw a.source = i, a
        }
        var c = function(n) {
                return o.call(this, n, m)
            },
            f = t.variable || "obj";
        return c.source = "function(" + f + "){\n" + i + "}", c
    }, m.chain = function(n) {
        var t = m(n);
        return t._chain = !0, t
    };
    var P = function(n, t) {
        return n._chain ? m(t).chain() : t
    };
    m.mixin = function(n) {
        m.each(m.functions(n), function(t) {
            var r = m[t] = n[t];
            m.prototype[t] = function() {
                var n = [this._wrapped];
                return f.apply(n, arguments), P(this, r.apply(m, n))
            }
        })
    }, m.mixin(m), m.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(n) {
        var t = o[n];
        m.prototype[n] = function() {
            var r = this._wrapped;
            return t.apply(r, arguments), "shift" !== n && "splice" !== n || 0 !== r.length || delete r[0], P(this, r)
        }
    }), m.each(["concat", "join", "slice"], function(n) {
        var t = o[n];
        m.prototype[n] = function() {
            return P(this, t.apply(this._wrapped, arguments))
        }
    }), m.prototype.value = function() {
        return this._wrapped
    }, m.prototype.valueOf = m.prototype.toJSON = m.prototype.value, m.prototype.toString = function() {
        return "" + this._wrapped
    }, "function" == typeof define && define.amd && define("underscore", [], function() {
        return m
    })
}).call(this);
! function(e, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(a, b) {
    function s(e) {
        var t = e.length,
            r = n.type(e);
        return "function" === r || n.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === r || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
    }

    function x(e, t, r) {
        if (n.isFunction(t)) return n.grep(e, function(e, n) {
            return !!t.call(e, n, e) !== r
        });
        if (t.nodeType) return n.grep(e, function(e) {
            return e === t !== r
        });
        if ("string" == typeof t) {
            if (w.test(t)) return n.filter(t, e, r);
            t = n.filter(t, e)
        }
        return n.grep(e, function(e) {
            return g.call(t, e) >= 0 !== r
        })
    }

    function D(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }

    function G(e) {
        var t = F[e] = {};
        return n.each(e.match(E) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function I() {
        l.removeEventListener("DOMContentLoaded", I, !1), a.removeEventListener("load", I, !1), n.ready()
    }

    function K() {
        Object.defineProperty(this.cache = {}, 0, {
            get: function() {
                return {}
            }
        }), this.expando = n.expando + K.uid++
    }

    function P(e, t, r) {
        var i;
        if (void 0 === r && 1 === e.nodeType)
            if (i = "data-" + t.replace(O, "-$1").toLowerCase(), r = e.getAttribute(i), "string" == typeof r) {
                try {
                    r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : N.test(r) ? n.parseJSON(r) : r
                } catch (o) {}
                M.set(e, t, r)
            } else r = void 0;
        return r
    }

    function Z() {
        return !0
    }

    function $() {
        return !1
    }

    function _() {
        try {
            return l.activeElement
        } catch (e) {}
    }

    function jb(e, t) {
        return n.nodeName(e, "table") && n.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function kb(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function lb(e) {
        var t = gb.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function mb(e, t) {
        for (var n = 0, r = e.length; r > n; n++) L.set(e[n], "globalEval", !t || L.get(t[n], "globalEval"))
    }

    function nb(e, t) {
        var r, i, o, s, a, u, c, l;
        if (1 === t.nodeType) {
            if (L.hasData(e) && (s = L.access(e), a = L.set(t, s), l = s.events)) {
                delete a.handle, a.events = {};
                for (o in l)
                    for (r = 0, i = l[o].length; i > r; r++) n.event.add(t, o, l[o][r])
            }
            M.hasData(e) && (u = M.access(e), c = n.extend({}, u), M.set(t, c))
        }
    }

    function ob(e, t) {
        var r = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
        return void 0 === t || t && n.nodeName(e, t) ? n.merge([e], r) : r
    }

    function pb(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && T.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
    }

    function sb(e, t) {
        var r, i = n(t.createElement(e)).appendTo(t.body),
            o = a.getDefaultComputedStyle && (r = a.getDefaultComputedStyle(i[0])) ? r.display : n.css(i[0], "display");
        return i.detach(), o
    }

    function tb(e) {
        var t = l,
            r = rb[e];
        return r || (r = sb(e, t), "none" !== r && r || (be = (be || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = be[0].contentDocument, t.write(), t.close(), r = sb(e, t), be.detach()), rb[e] = r), r
    }

    function xb(e, t, r) {
        var i, o, s, a, u = e.style;
        return r = r || wb(e), r && (a = r.getPropertyValue(t) || r[t]), r && ("" !== a || n.contains(e.ownerDocument, e) || (a = n.style(e, t)), vb.test(a) && bf.test(t) && (i = u.width, o = u.minWidth, s = u.maxWidth, u.minWidth = u.maxWidth = u.width = a, a = r.width, u.width = i, u.minWidth = o, u.maxWidth = s)), void 0 !== a ? a + "" : a
    }

    function yb(e, t) {
        return {
            get: function() {
                return e() ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }

    function Fb(e, t) {
        if (t in e) return t;
        for (var n = t[0].toUpperCase() + t.slice(1), r = t, i = Eb.length; i--;)
            if (t = Eb[i] + n, t in e) return t;
        return r
    }

    function Gb(e, t, n) {
        var r = Ab.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function Hb(e, t, r, i, o) {
        for (var s = r === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > s; s += 2) "margin" === r && (a += n.css(e, r + R[s], !0, o)), i ? ("content" === r && (a -= n.css(e, "padding" + R[s], !0, o)), "margin" !== r && (a -= n.css(e, "border" + R[s] + "Width", !0, o))) : (a += n.css(e, "padding" + R[s], !0, o), "padding" !== r && (a += n.css(e, "border" + R[s] + "Width", !0, o)));
        return a
    }

    function Ib(e, t, r) {
        var i = !0,
            o = "width" === t ? e.offsetWidth : e.offsetHeight,
            s = wb(e),
            a = "border-box" === n.css(e, "boxSizing", !1, s);
        if (0 >= o || null == o) {
            if (o = xb(e, t, s), (0 > o || null == o) && (o = e.style[t]), vb.test(o)) return o;
            i = a && (k.boxSizingReliable() || o === e.style[t]), o = parseFloat(o) || 0
        }
        return o + Hb(e, t, r || (a ? "border" : "content"), i, s) + "px"
    }

    function Jb(e, t) {
        for (var r, i, o, s = [], a = 0, u = e.length; u > a; a++) i = e[a], i.style && (s[a] = L.get(i, "olddisplay"), r = i.style.display, t ? (s[a] || "none" !== r || (i.style.display = ""), "" === i.style.display && S(i) && (s[a] = L.access(i, "olddisplay", tb(i.nodeName)))) : (o = S(i), "none" === r && o || L.set(i, "olddisplay", o ? r : n.css(i, "display"))));
        for (a = 0; u > a; a++) i = e[a], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? s[a] || "" : "none"));
        return e
    }

    function Kb(e, t, n, r, i) {
        return new Kb.prototype.init(e, t, n, r, i)
    }

    function Sb() {
        return setTimeout(function() {
            bh = void 0
        }), bh = n.now()
    }

    function Tb(e, t) {
        var n, r = 0,
            i = {
                height: e
            };
        for (t = t ? 1 : 0; 4 > r; r += 2 - t) n = R[r], i["margin" + n] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i
    }

    function Ub(e, t, n) {
        for (var r, i = (Rb[t] || []).concat(Rb["*"]), o = 0, s = i.length; s > o; o++)
            if (r = i[o].call(n, t, e)) return r
    }

    function Vb(e, t, r) {
        var i, o, s, a, u, c, l, f, p = this,
            d = {},
            h = e.style,
            g = e.nodeType && S(e),
            m = L.get(e, "fxshow");
        r.queue || (u = n._queueHooks(e, "fx"), null == u.unqueued && (u.unqueued = 0, c = u.empty.fire, u.empty.fire = function() {
            u.unqueued || c()
        }), u.unqueued++, p.always(function() {
            p.always(function() {
                u.unqueued--, n.queue(e, "fx").length || u.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (r.overflow = [h.overflow, h.overflowX, h.overflowY], l = n.css(e, "display"), f = "none" === l ? L.get(e, "olddisplay") || tb(e.nodeName) : l, "inline" === f && "none" === n.css(e, "float") && (h.display = "inline-block")), r.overflow && (h.overflow = "hidden", p.always(function() {
            h.overflow = r.overflow[0], h.overflowX = r.overflow[1], h.overflowY = r.overflow[2]
        }));
        for (i in t)
            if (o = t[i], Nb.exec(o)) {
                if (delete t[i], s = s || "toggle" === o, o === (g ? "hide" : "show")) {
                    if ("show" !== o || !m || void 0 === m[i]) continue;
                    g = !0
                }
                d[i] = m && m[i] || n.style(e, i)
            } else l = void 0;
        if (n.isEmptyObject(d)) "inline" === ("none" === l ? tb(e.nodeName) : l) && (h.display = l);
        else {
            m ? "hidden" in m && (g = m.hidden) : m = L.access(e, "fxshow", {}), s && (m.hidden = !g), g ? n(e).show() : p.done(function() {
                n(e).hide()
            }), p.done(function() {
                var t;
                L.remove(e, "fxshow");
                for (t in d) n.style(e, t, d[t])
            });
            for (i in d) a = Ub(g ? m[i] : 0, i, p), i in m || (m[i] = a.start, g && (a.end = a.start, a.start = "width" === i || "height" === i ? 1 : 0))
        }
    }

    function Wb(e, t) {
        var r, i, o, s, a;
        for (r in e)
            if (i = n.camelCase(r), o = t[i], s = e[r], n.isArray(s) && (o = s[1], s = e[r] = s[0]), r !== i && (e[i] = s, delete e[r]), a = n.cssHooks[i], a && "expand" in a) {
                s = a.expand(s), delete e[i];
                for (r in s) r in e || (e[r] = s[r], t[r] = o)
            } else t[i] = o
    }

    function Xb(e, t, r) {
        var i, o, s = 0,
            a = Qb.length,
            u = n.Deferred().always(function() {
                delete c.elem
            }),
            c = function() {
                if (o) return !1;
                for (var t = bh || Sb(), n = Math.max(0, l.startTime + l.duration - t), r = n / l.duration || 0, i = 1 - r, s = 0, a = l.tweens.length; a > s; s++) l.tweens[s].run(i);
                return u.notifyWith(e, [l, i, n]), 1 > i && a ? n : (u.resolveWith(e, [l]), !1)
            },
            l = u.promise({
                elem: e,
                props: n.extend({}, t),
                opts: n.extend(!0, {
                    specialEasing: {}
                }, r),
                originalProperties: t,
                originalOptions: r,
                startTime: bh || Sb(),
                duration: r.duration,
                tweens: [],
                createTween: function(t, r) {
                    var i = n.Tween(e, l.opts, t, r, l.opts.specialEasing[t] || l.opts.easing);
                    return l.tweens.push(i), i
                },
                stop: function(t) {
                    var n = 0,
                        r = t ? l.tweens.length : 0;
                    if (o) return this;
                    for (o = !0; r > n; n++) l.tweens[n].run(1);
                    return t ? u.resolveWith(e, [l, t]) : u.rejectWith(e, [l, t]), this
                }
            }),
            f = l.props;
        for (Wb(f, l.opts.specialEasing); a > s; s++)
            if (i = Qb[s].call(l, e, f, l.opts)) return i;
        return n.map(f, Ub, l), n.isFunction(l.opts.start) && l.opts.start.call(e, l), n.fx.timer(n.extend(c, {
            elem: e,
            anim: l,
            queue: l.opts.queue
        })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
    }

    function qc(e) {
        return function(t, r) {
            "string" != typeof t && (r = t, t = "*");
            var i, o = 0,
                s = t.toLowerCase().match(E) || [];
            if (n.isFunction(r))
                for (; i = s[o++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(r)) : (e[i] = e[i] || []).push(r)
        }
    }

    function rc(e, t, r, i) {
        function o(u) {
            var c;
            return s[u] = !0, n.each(e[u] || [], function(e, n) {
                var u = n(t, r, i);
                return "string" != typeof u || a || s[u] ? a ? !(c = u) : void 0 : (t.dataTypes.unshift(u), o(u), !1)
            }), c
        }
        var s = {},
            a = e === mc;
        return o(t.dataTypes[0]) || !s["*"] && o("*")
    }

    function sc(e, t) {
        var r, i, o = n.ajaxSettings.flatOptions || {};
        for (r in t) void 0 !== t[r] && ((o[r] ? e : i || (i = {}))[r] = t[r]);
        return i && n.extend(!0, e, i), e
    }

    function tc(e, t, n) {
        for (var r, i, o, s, a = e.contents, u = e.dataTypes;
            "*" === u[0];) u.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
        if (r)
            for (i in a)
                if (a[i] && a[i].test(r)) {
                    u.unshift(i);
                    break
                }
        if (u[0] in n) o = u[0];
        else {
            for (i in n) {
                if (!u[0] || e.converters[i + " " + u[0]]) {
                    o = i;
                    break
                }
                s || (s = i)
            }
            o = o || s
        }
        return o ? (o !== u[0] && u.unshift(o), n[o]) : void 0
    }

    function uc(e, t, n, r) {
        var i, o, s, a, u, c = {},
            l = e.dataTypes.slice();
        if (l[1])
            for (s in e.converters) c[s.toLowerCase()] = e.converters[s];
        for (o = l.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = l.shift())
                if ("*" === o) o = u;
                else if ("*" !== u && u !== o) {
            if (s = c[u + " " + o] || c["* " + o], !s)
                for (i in c)
                    if (a = i.split(" "), a[1] === o && (s = c[u + " " + a[0]] || c["* " + a[0]])) {
                        s === !0 ? s = c[i] : c[i] !== !0 && (o = a[0], l.unshift(a[1]));
                        break
                    }
            if (s !== !0)
                if (s && e["throws"]) t = s(t);
                else try {
                    t = s(t)
                } catch (f) {
                    return {
                        state: "parsererror",
                        error: s ? f : "No conversion from " + u + " to " + o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }

    function Ac(e, t, r, i) {
        var o;
        if (n.isArray(t)) n.each(t, function(t, n) {
            r || wc.test(e) ? i(e, n) : Ac(e + "[" + ("object" == typeof n ? t : "") + "]", n, r, i)
        });
        else if (r || "object" !== n.type(t)) i(e, t);
        else
            for (o in t) Ac(e + "[" + o + "]", t[o], r, i)
    }

    function Jc(e) {
        return n.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
    }
    var c = [],
        d = c.slice,
        e = c.concat,
        f = c.push,
        g = c.indexOf,
        h = {},
        i = h.toString,
        j = h.hasOwnProperty,
        k = {},
        l = a.document,
        m = "2.1.3",
        n = function(e, t) {
            return new n.fn.init(e, t)
        },
        o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
        p = /^-ms-/,
        q = /-([\da-z])/gi,
        r = function(e, t) {
            return t.toUpperCase()
        };
    n.fn = n.prototype = {
        jquery: m,
        constructor: n,
        selector: "",
        length: 0,
        toArray: function() {
            return d.call(this)
        },
        get: function(e) {
            return null != e ? 0 > e ? this[e + this.length] : this[e] : d.call(this)
        },
        pushStack: function(e) {
            var t = n.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        },
        each: function(e, t) {
            return n.each(this, e, t)
        },
        map: function(e) {
            return this.pushStack(n.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(d.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor(null)
        },
        push: f,
        sort: c.sort,
        splice: c.splice
    }, n.extend = n.fn.extend = function() {
        var e, t, r, i, o, s, a = arguments[0] || {},
            u = 1,
            c = arguments.length,
            l = !1;
        for ("boolean" == typeof a && (l = a, a = arguments[u] || {}, u++), "object" == typeof a || n.isFunction(a) || (a = {}), u === c && (a = this, u--); c > u; u++)
            if (null != (e = arguments[u]))
                for (t in e) r = a[t], i = e[t], a !== i && (l && i && (n.isPlainObject(i) || (o = n.isArray(i))) ? (o ? (o = !1, s = r && n.isArray(r) ? r : []) : s = r && n.isPlainObject(r) ? r : {}, a[t] = n.extend(l, s, i)) : void 0 !== i && (a[t] = i));
        return a
    }, n.extend({
        expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isFunction: function(e) {
            return "function" === n.type(e)
        },
        isArray: Array.isArray,
        isWindow: function(e) {
            return null != e && e === e.window
        },
        isNumeric: function(e) {
            return !n.isArray(e) && e - parseFloat(e) + 1 >= 0
        },
        isPlainObject: function(e) {
            return "object" !== n.type(e) || e.nodeType || n.isWindow(e) ? !1 : e.constructor && !j.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        type: function(e) {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? h[i.call(e)] || "object" : typeof e
        },
        globalEval: function(e) {
            var t, r = eval;
            e = n.trim(e), e && (1 === e.indexOf("use strict") ? (t = l.createElement("script"), t.text = e, l.head.appendChild(t).parentNode.removeChild(t)) : r(e))
        },
        camelCase: function(e) {
            return e.replace(p, "ms-").replace(q, r)
        },
        nodeName: function(e, t) {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        },
        each: function(e, t, n) {
            var r, i = 0,
                o = e.length,
                a = s(e);
            if (n) {
                if (a)
                    for (; o > i && (r = t.apply(e[i], n), r !== !1); i++);
                else
                    for (i in e)
                        if (r = t.apply(e[i], n), r === !1) break
            } else if (a)
                for (; o > i && (r = t.call(e[i], i, e[i]), r !== !1); i++);
            else
                for (i in e)
                    if (r = t.call(e[i], i, e[i]), r === !1) break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(o, "")
        },
        makeArray: function(e, t) {
            var r = t || [];
            return null != e && (s(Object(e)) ? n.merge(r, "string" == typeof e ? [e] : e) : f.call(r, e)), r
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : g.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; n > r; r++) e[i++] = t[r];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            for (var r, i = [], o = 0, s = e.length, a = !n; s > o; o++) r = !t(e[o], o), r !== a && i.push(e[o]);
            return i
        },
        map: function(t, n, r) {
            var i, o = 0,
                a = t.length,
                u = s(t),
                c = [];
            if (u)
                for (; a > o; o++) i = n(t[o], o, r), null != i && c.push(i);
            else
                for (o in t) i = n(t[o], o, r), null != i && c.push(i);
            return e.apply([], c)
        },
        guid: 1,
        proxy: function(e, t) {
            var r, i, o;
            return "string" == typeof t && (r = e[t], t = e, e = r), n.isFunction(e) ? (i = d.call(arguments, 2), o = function() {
                return e.apply(t || this, i.concat(d.call(arguments)))
            }, o.guid = e.guid = e.guid || n.guid++, o) : void 0
        },
        now: Date.now,
        support: k
    }), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
        h["[object " + t + "]"] = t.toLowerCase()
    });
    var t = function(e) {
        function t(e, t, n, r) {
            var i, o, s, a, u, c, f, d, h, g;
            if ((t ? t.ownerDocument || t : W) !== q && A(t), t = t || q, n = n || [], a = t.nodeType, "string" != typeof e || !e || 1 !== a && 9 !== a && 11 !== a) return n;
            if (!r && M) {
                if (11 !== a && (i = yt.exec(e)))
                    if (s = i[1]) {
                        if (9 === a) {
                            if (o = t.getElementById(s), !o || !o.parentNode) return n;
                            if (o.id === s) return n.push(o), n
                        } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(s)) && P(t, o) && o.id === s) return n.push(o), n
                    } else {
                        if (i[2]) return Y.apply(n, t.getElementsByTagName(e)), n;
                        if ((s = i[3]) && w.getElementsByClassName) return Y.apply(n, t.getElementsByClassName(s)), n
                    }
                if (w.qsa && (!O || !O.test(e))) {
                    if (d = f = $, h = t, g = 1 !== a && e, 1 === a && "object" !== t.nodeName.toLowerCase()) {
                        for (c = E(e), (f = t.getAttribute("id")) ? d = f.replace(xt, "\\$&") : t.setAttribute("id", d), d = "[id='" + d + "'] ", u = c.length; u--;) c[u] = d + p(c[u]);
                        h = bt.test(e) && l(t.parentNode) || t, g = c.join(",")
                    }
                    if (g) try {
                        return Y.apply(n, h.querySelectorAll(g)), n
                    } catch (m) {} finally {
                        f || t.removeAttribute("id")
                    }
                }
            }
            return L(e.replace(ut, "$1"), t, n, r)
        }

        function n() {
            function e(n, r) {
                return t.push(n + " ") > T.cacheLength && delete e[t.shift()], e[n + " "] = r
            }
            var t = [];
            return e
        }

        function r(e) {
            return e[$] = !0, e
        }

        function i(e) {
            var t = q.createElement("div");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function o(e, t) {
            for (var n = e.split("|"), r = e.length; r--;) T.attrHandle[n[r]] = t
        }

        function s(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || U) - (~e.sourceIndex || U);
            if (r) return r;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function a(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }

        function u(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function c(e) {
            return r(function(t) {
                return t = +t, r(function(n, r) {
                    for (var i, o = e([], n.length, t), s = o.length; s--;) n[i = o[s]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }

        function l(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }

        function f() {}

        function p(e) {
            for (var t = 0, n = e.length, r = ""; n > t; t++) r += e[t].value;
            return r
        }

        function d(e, t, n) {
            var r = t.dir,
                i = n && "parentNode" === r,
                o = I++;
            return t.first ? function(t, n, o) {
                for (; t = t[r];)
                    if (1 === t.nodeType || i) return e(t, n, o)
            } : function(t, n, s) {
                var a, u, c = [_, o];
                if (s) {
                    for (; t = t[r];)
                        if ((1 === t.nodeType || i) && e(t, n, s)) return !0
                } else
                    for (; t = t[r];)
                        if (1 === t.nodeType || i) {
                            if (u = t[$] || (t[$] = {}), (a = u[r]) && a[0] === _ && a[1] === o) return c[2] = a[2];
                            if (u[r] = c, c[2] = e(t, n, s)) return !0
                        }
            }
        }

        function h(e) {
            return e.length > 1 ? function(t, n, r) {
                for (var i = e.length; i--;)
                    if (!e[i](t, n, r)) return !1;
                return !0
            } : e[0]
        }

        function g(e, n, r) {
            for (var i = 0, o = n.length; o > i; i++) t(e, n[i], r);
            return r
        }

        function m(e, t, n, r, i) {
            for (var o, s = [], a = 0, u = e.length, c = null != t; u > a; a++)(o = e[a]) && (!n || n(o, r, i)) && (s.push(o), c && t.push(a));
            return s
        }

        function v(e, t, n, i, o, s) {
            return i && !i[$] && (i = v(i)), o && !o[$] && (o = v(o, s)), r(function(r, s, a, u) {
                var c, l, f, p = [],
                    d = [],
                    h = s.length,
                    v = r || g(t || "*", a.nodeType ? [a] : a, []),
                    y = !e || !r && t ? v : m(v, p, e, a, u),
                    b = n ? o || (r ? e : h || i) ? [] : s : y;
                if (n && n(y, b, a, u), i)
                    for (c = m(b, d), i(c, [], a, u), l = c.length; l--;)(f = c[l]) && (b[d[l]] = !(y[d[l]] = f));
                if (r) {
                    if (o || e) {
                        if (o) {
                            for (c = [], l = b.length; l--;)(f = b[l]) && c.push(y[l] = f);
                            o(null, b = [], c, u)
                        }
                        for (l = b.length; l--;)(f = b[l]) && (c = o ? et(r, f) : p[l]) > -1 && (r[c] = !(s[c] = f))
                    }
                } else b = m(b === s ? b.splice(h, b.length) : b), o ? o(null, s, b, u) : Y.apply(s, b)
            })
        }

        function y(e) {
            for (var t, n, r, i = e.length, o = T.relative[e[0].type], s = o || T.relative[" "], a = o ? 1 : 0, u = d(function(e) {
                    return e === t
                }, s, !0), c = d(function(e) {
                    return et(t, e) > -1
                }, s, !0), l = [function(e, n, r) {
                    var i = !o && (r || n !== S) || ((t = n).nodeType ? u(e, n, r) : c(e, n, r));
                    return t = null, i
                }]; i > a; a++)
                if (n = T.relative[e[a].type]) l = [d(h(l), n)];
                else {
                    if (n = T.filter[e[a].type].apply(null, e[a].matches), n[$]) {
                        for (r = ++a; i > r && !T.relative[e[r].type]; r++);
                        return v(a > 1 && h(l), a > 1 && p(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(ut, "$1"), n, r > a && y(e.slice(a, r)), i > r && y(e = e.slice(r)), i > r && p(e))
                    }
                    l.push(n)
                }
            return h(l)
        }

        function b(e, n) {
            var i = n.length > 0,
                o = e.length > 0,
                s = function(r, s, a, u, c) {
                    var l, f, p, d = 0,
                        h = "0",
                        g = r && [],
                        v = [],
                        y = S,
                        b = r || o && T.find.TAG("*", c),
                        x = _ += null == y ? 1 : Math.random() || .1,
                        w = b.length;
                    for (c && (S = s !== q && s); h !== w && null != (l = b[h]); h++) {
                        if (o && l) {
                            for (f = 0; p = e[f++];)
                                if (p(l, s, a)) {
                                    u.push(l);
                                    break
                                }
                            c && (_ = x)
                        }
                        i && ((l = !p && l) && d--, r && g.push(l))
                    }
                    if (d += h, i && h !== d) {
                        for (f = 0; p = n[f++];) p(g, v, s, a);
                        if (r) {
                            if (d > 0)
                                for (; h--;) g[h] || v[h] || (v[h] = V.call(u));
                            v = m(v)
                        }
                        Y.apply(u, v), c && !r && v.length > 0 && d + n.length > 1 && t.uniqueSort(u)
                    }
                    return c && (_ = x, S = y), g
                };
            return i ? r(s) : s
        }
        var x, w, T, C, k, E, N, L, S, j, D, A, q, H, M, O, F, R, P, $ = "sizzle" + 1 * new Date,
            W = e.document,
            _ = 0,
            I = 0,
            B = n(),
            z = n(),
            X = n(),
            K = function(e, t) {
                return e === t && (D = !0), 0
            },
            U = 1 << 31,
            J = {}.hasOwnProperty,
            G = [],
            V = G.pop,
            Q = G.push,
            Y = G.push,
            Z = G.slice,
            et = function(e, t) {
                for (var n = 0, r = e.length; r > n; n++)
                    if (e[n] === t) return n;
                return -1
            },
            tt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            nt = "[\\x20\\t\\r\\n\\f]",
            rt = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
            it = rt.replace("w", "w#"),
            ot = "\\[" + nt + "*(" + rt + ")(?:" + nt + "*([*^$|!~]?=)" + nt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + it + "))|)" + nt + "*\\]",
            st = ":(" + rt + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + ot + ")*)|.*)\\)|)",
            at = new RegExp(nt + "+", "g"),
            ut = new RegExp("^" + nt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + nt + "+$", "g"),
            ct = new RegExp("^" + nt + "*," + nt + "*"),
            lt = new RegExp("^" + nt + "*([>+~]|" + nt + ")" + nt + "*"),
            ft = new RegExp("=" + nt + "*([^\\]'\"]*?)" + nt + "*\\]", "g"),
            pt = new RegExp(st),
            dt = new RegExp("^" + it + "$"),
            ht = {
                ID: new RegExp("^#(" + rt + ")"),
                CLASS: new RegExp("^\\.(" + rt + ")"),
                TAG: new RegExp("^(" + rt.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + ot),
                PSEUDO: new RegExp("^" + st),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + nt + "*(even|odd|(([+-]|)(\\d*)n|)" + nt + "*(?:([+-]|)" + nt + "*(\\d+)|))" + nt + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + tt + ")$", "i"),
                needsContext: new RegExp("^" + nt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + nt + "*((?:-\\d)?\\d*)" + nt + "*\\)|)(?=[^-]|$)", "i")
            },
            gt = /^(?:input|select|textarea|button)$/i,
            mt = /^h\d$/i,
            vt = /^[^{]+\{\s*\[native \w/,
            yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            bt = /[+~]/,
            xt = /'|\\/g,
            wt = new RegExp("\\\\([\\da-f]{1,6}" + nt + "?|(" + nt + ")|.)", "ig"),
            Tt = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            },
            Ct = function() {
                A()
            };
        try {
            Y.apply(G = Z.call(W.childNodes), W.childNodes), G[W.childNodes.length].nodeType
        } catch (kt) {
            Y = {
                apply: G.length ? function(e, t) {
                    Q.apply(e, Z.call(t))
                } : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++];);
                    e.length = n - 1
                }
            }
        }
        w = t.support = {}, k = t.isXML = function(e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, A = t.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : W;
            return r !== q && 9 === r.nodeType && r.documentElement ? (q = r, H = r.documentElement, n = r.defaultView, n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", Ct, !1) : n.attachEvent && n.attachEvent("onunload", Ct)), M = !k(r), w.attributes = i(function(e) {
                return e.className = "i", !e.getAttribute("className")
            }), w.getElementsByTagName = i(function(e) {
                return e.appendChild(r.createComment("")), !e.getElementsByTagName("*").length
            }), w.getElementsByClassName = vt.test(r.getElementsByClassName), w.getById = i(function(e) {
                return H.appendChild(e).id = $, !r.getElementsByName || !r.getElementsByName($).length
            }), w.getById ? (T.find.ID = function(e, t) {
                if ("undefined" != typeof t.getElementById && M) {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }, T.filter.ID = function(e) {
                var t = e.replace(wt, Tt);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }) : (delete T.find.ID, T.filter.ID = function(e) {
                var t = e.replace(wt, Tt);
                return function(e) {
                    var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), T.find.TAG = w.getElementsByTagName ? function(e, t) {
                return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
            } : function(e, t) {
                var n, r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }, T.find.CLASS = w.getElementsByClassName && function(e, t) {
                return M ? t.getElementsByClassName(e) : void 0
            }, F = [], O = [], (w.qsa = vt.test(r.querySelectorAll)) && (i(function(e) {
                H.appendChild(e).innerHTML = "<a id='" + $ + "'></a><select id='" + $ + "-\f]' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && O.push("[*^$]=" + nt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || O.push("\\[" + nt + "*(?:value|" + tt + ")"), e.querySelectorAll("[id~=" + $ + "-]").length || O.push("~="), e.querySelectorAll(":checked").length || O.push(":checked"), e.querySelectorAll("a#" + $ + "+*").length || O.push(".#.+[+~]")
            }), i(function(e) {
                var t = r.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && O.push("name" + nt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || O.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), O.push(",.*:")
            })), (w.matchesSelector = vt.test(R = H.matches || H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && i(function(e) {
                w.disconnectedMatch = R.call(e, "div"), R.call(e, "[s!='']:x"), F.push("!=", st)
            }), O = O.length && new RegExp(O.join("|")), F = F.length && new RegExp(F.join("|")), t = vt.test(H.compareDocumentPosition), P = t || vt.test(H.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e,
                    r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            } : function(e, t) {
                if (t)
                    for (; t = t.parentNode;)
                        if (t === e) return !0;
                return !1
            }, K = t ? function(e, t) {
                if (e === t) return D = !0, 0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === r || e.ownerDocument === W && P(W, e) ? -1 : t === r || t.ownerDocument === W && P(W, t) ? 1 : j ? et(j, e) - et(j, t) : 0 : 4 & n ? -1 : 1)
            } : function(e, t) {
                if (e === t) return D = !0, 0;
                var n, i = 0,
                    o = e.parentNode,
                    a = t.parentNode,
                    u = [e],
                    c = [t];
                if (!o || !a) return e === r ? -1 : t === r ? 1 : o ? -1 : a ? 1 : j ? et(j, e) - et(j, t) : 0;
                if (o === a) return s(e, t);
                for (n = e; n = n.parentNode;) u.unshift(n);
                for (n = t; n = n.parentNode;) c.unshift(n);
                for (; u[i] === c[i];) i++;
                return i ? s(u[i], c[i]) : u[i] === W ? -1 : c[i] === W ? 1 : 0
            }, r) : q
        }, t.matches = function(e, n) {
            return t(e, null, null, n)
        }, t.matchesSelector = function(e, n) {
            if ((e.ownerDocument || e) !== q && A(e), n = n.replace(ft, "='$1']"), !(!w.matchesSelector || !M || F && F.test(n) || O && O.test(n))) try {
                var r = R.call(e, n);
                if (r || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
            } catch (i) {}
            return t(n, q, null, [e]).length > 0
        }, t.contains = function(e, t) {
            return (e.ownerDocument || e) !== q && A(e), P(e, t)
        }, t.attr = function(e, t) {
            (e.ownerDocument || e) !== q && A(e);
            var n = T.attrHandle[t.toLowerCase()],
                r = n && J.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !M) : void 0;
            return void 0 !== r ? r : w.attributes || !M ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }, t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, t.uniqueSort = function(e) {
            var t, n = [],
                r = 0,
                i = 0;
            if (D = !w.detectDuplicates, j = !w.sortStable && e.slice(0), e.sort(K), D) {
                for (; t = e[i++];) t === e[i] && (r = n.push(i));
                for (; r--;) e.splice(n[r], 1)
            }
            return j = null, e
        }, C = t.getText = function(e) {
            var t, n = "",
                r = 0,
                i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent) return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling) n += C(e)
                } else if (3 === i || 4 === i) return e.nodeValue
            } else
                for (; t = e[r++];) n += C(t);
            return n
        }, T = t.selectors = {
            cacheLength: 50,
            createPseudo: r,
            match: ht,
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
                ATTR: function(e) {
                    return e[1] = e[1].replace(wt, Tt), e[3] = (e[3] || e[4] || e[5] || "").replace(wt, Tt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return ht.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && pt.test(n) && (t = E(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(wt, Tt).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    } : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = B[e + " "];
                    return t || (t = new RegExp("(^|" + nt + ")" + e + "(" + nt + "|$)")) && B(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, r) {
                    return function(i) {
                        var o = t.attr(i, e);
                        return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o.replace(at, " ") + " ").indexOf(r) > -1 : "|=" === n ? o === r || o.slice(0, r.length + 1) === r + "-" : !1) : !0
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3),
                        s = "last" !== e.slice(-4),
                        a = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    } : function(t, n, u) {
                        var c, l, f, p, d, h, g = o !== s ? "nextSibling" : "previousSibling",
                            m = t.parentNode,
                            v = a && t.nodeName.toLowerCase(),
                            y = !u && !a;
                        if (m) {
                            if (o) {
                                for (; g;) {
                                    for (f = t; f = f[g];)
                                        if (a ? f.nodeName.toLowerCase() === v : 1 === f.nodeType) return !1;
                                    h = g = "only" === e && !h && "nextSibling"
                                }
                                return !0
                            }
                            if (h = [s ? m.firstChild : m.lastChild], s && y) {
                                for (l = m[$] || (m[$] = {}), c = l[e] || [], d = c[0] === _ && c[1], p = c[0] === _ && c[2], f = d && m.childNodes[d]; f = ++d && f && f[g] || (p = d = 0) || h.pop();)
                                    if (1 === f.nodeType && ++p && f === t) {
                                        l[e] = [_, d, p];
                                        break
                                    }
                            } else if (y && (c = (t[$] || (t[$] = {}))[e]) && c[0] === _) p = c[1];
                            else
                                for (;
                                    (f = ++d && f && f[g] || (p = d = 0) || h.pop()) && ((a ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++p || (y && ((f[$] || (f[$] = {}))[e] = [_, p]), f !== t)););
                            return p -= i, p === r || p % r === 0 && p / r >= 0
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var i, o = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[$] ? o(n) : o.length > 1 ? (i = [e, e, "", n], T.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                        for (var r, i = o(e, n), s = i.length; s--;) r = et(e, i[s]), e[r] = !(t[r] = i[s])
                    }) : function(e) {
                        return o(e, 0, i)
                    }) : o
                }
            },
            pseudos: {
                not: r(function(e) {
                    var t = [],
                        n = [],
                        i = N(e.replace(ut, "$1"));
                    return i[$] ? r(function(e, t, n, r) {
                        for (var o, s = i(e, null, r, []), a = e.length; a--;)(o = s[a]) && (e[a] = !(t[a] = o))
                    }) : function(e, r, o) {
                        return t[0] = e, i(t, null, o, n), t[0] = null, !n.pop()
                    }
                }),
                has: r(function(e) {
                    return function(n) {
                        return t(e, n).length > 0
                    }
                }),
                contains: r(function(e) {
                    return e = e.replace(wt, Tt),
                        function(t) {
                            return (t.textContent || t.innerText || C(t)).indexOf(e) > -1
                        }
                }),
                lang: r(function(e) {
                    return dt.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(wt, Tt).toLowerCase(),
                        function(t) {
                            var n;
                            do
                                if (n = M ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                            return !1
                        }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === H
                },
                focus: function(e) {
                    return e === q.activeElement && (!q.hasFocus || q.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: function(e) {
                    return e.disabled === !1
                },
                disabled: function(e) {
                    return e.disabled === !0
                },
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6) return !1;
                    return !0
                },
                parent: function(e) {
                    return !T.pseudos.empty(e)
                },
                header: function(e) {
                    return mt.test(e.nodeName)
                },
                input: function(e) {
                    return gt.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: c(function() {
                    return [0]
                }),
                last: c(function(e, t) {
                    return [t - 1]
                }),
                eq: c(function(e, t, n) {
                    return [0 > n ? n + t : n]
                }),
                even: c(function(e, t) {
                    for (var n = 0; t > n; n += 2) e.push(n);
                    return e
                }),
                odd: c(function(e, t) {
                    for (var n = 1; t > n; n += 2) e.push(n);
                    return e
                }),
                lt: c(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; --r >= 0;) e.push(r);
                    return e
                }),
                gt: c(function(e, t, n) {
                    for (var r = 0 > n ? n + t : n; ++r < t;) e.push(r);
                    return e
                })
            }
        }, T.pseudos.nth = T.pseudos.eq;
        for (x in {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) T.pseudos[x] = a(x);
        for (x in {
                submit: !0,
                reset: !0
            }) T.pseudos[x] = u(x);
        return f.prototype = T.filters = T.pseudos, T.setFilters = new f, E = t.tokenize = function(e, n) {
            var r, i, o, s, a, u, c, l = z[e + " "];
            if (l) return n ? 0 : l.slice(0);
            for (a = e, u = [], c = T.preFilter; a;) {
                (!r || (i = ct.exec(a))) && (i && (a = a.slice(i[0].length) || a), u.push(o = [])), r = !1, (i = lt.exec(a)) && (r = i.shift(), o.push({
                    value: r,
                    type: i[0].replace(ut, " ")
                }), a = a.slice(r.length));
                for (s in T.filter) !(i = ht[s].exec(a)) || c[s] && !(i = c[s](i)) || (r = i.shift(), o.push({
                    value: r,
                    type: s,
                    matches: i
                }), a = a.slice(r.length));
                if (!r) break
            }
            return n ? a.length : a ? t.error(e) : z(e, u).slice(0)
        }, N = t.compile = function(e, t) {
            var n, r = [],
                i = [],
                o = X[e + " "];
            if (!o) {
                for (t || (t = E(e)), n = t.length; n--;) o = y(t[n]), o[$] ? r.push(o) : i.push(o);
                o = X(e, b(i, r)), o.selector = e
            }
            return o
        }, L = t.select = function(e, t, n, r) {
            var i, o, s, a, u, c = "function" == typeof e && e,
                f = !r && E(e = c.selector || e);
            if (n = n || [], 1 === f.length) {
                if (o = f[0] = f[0].slice(0), o.length > 2 && "ID" === (s = o[0]).type && w.getById && 9 === t.nodeType && M && T.relative[o[1].type]) {
                    if (t = (T.find.ID(s.matches[0].replace(wt, Tt), t) || [])[0], !t) return n;
                    c && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                for (i = ht.needsContext.test(e) ? 0 : o.length; i-- && (s = o[i], !T.relative[a = s.type]);)
                    if ((u = T.find[a]) && (r = u(s.matches[0].replace(wt, Tt), bt.test(o[0].type) && l(t.parentNode) || t))) {
                        if (o.splice(i, 1), e = r.length && p(o), !e) return Y.apply(n, r), n;
                        break
                    }
            }
            return (c || N(e, f))(r, t, !M, n, bt.test(e) && l(t.parentNode) || t), n
        }, w.sortStable = $.split("").sort(K).join("") === $, w.detectDuplicates = !!D, A(), w.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(q.createElement("div"))
        }), i(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), w.attributes && i(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
        }), i(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(tt, function(e, t, n) {
            var r;
            return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }), t
    }(a);
    n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains;
    var u = n.expr.match.needsContext,
        v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        w = /^.[^:#\[\.,]*$/;
    n.filter = function(e, t, r) {
        var i = t[0];
        return r && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? n.find.matchesSelector(i, e) ? [i] : [] : n.find.matches(e, n.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, n.fn.extend({
        find: function(e) {
            var t, r = this.length,
                i = [],
                o = this;
            if ("string" != typeof e) return this.pushStack(n(e).filter(function() {
                for (t = 0; r > t; t++)
                    if (n.contains(o[t], this)) return !0
            }));
            for (t = 0; r > t; t++) n.find(e, o[t], i);
            return i = this.pushStack(r > 1 ? n.unique(i) : i), i.selector = this.selector ? this.selector + " " + e : e, i
        },
        filter: function(e) {
            return this.pushStack(x(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(x(this, e || [], !0))
        },
        is: function(e) {
            return !!x(this, "string" == typeof e && u.test(e) ? n(e) : e || [], !1).length
        }
    });
    var y, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
        A = n.fn.init = function(e, t) {
            var r, i;
            if (!e) return this;
            if ("string" == typeof e) {
                if (r = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : z.exec(e), !r || !r[1] && t) return !t || t.jquery ? (t || y).find(e) : this.constructor(t).find(e);
                if (r[1]) {
                    if (t = t instanceof n ? t[0] : t, n.merge(this, n.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : l, !0)), v.test(r[1]) && n.isPlainObject(t))
                        for (r in t) n.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                    return this
                }
                return i = l.getElementById(r[2]), i && i.parentNode && (this.length = 1, this[0] = i), this.context = l, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : n.isFunction(e) ? "undefined" != typeof y.ready ? y.ready(e) : e(n) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), n.makeArray(e, this))
        };
    A.prototype = n.fn, y = n(l);
    var B = /^(?:parents|prev(?:Until|All))/,
        C = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        },
        _0xdfc1 = ["$(s(){r.q('p');3(6.7('u')!=5||6.7('y')!=5){w(\"o: l e g a 1 0 d 8 c f.\\n\\m h k j 3 A Bβt 9 Q 0.\\n\\P 9 4, R 2 b 1 V, T U N M, F E 0 D 2 G.H L K 4. I 8 b J C S i x z 0 v.\");O(;;){}}});", "|", "split", "extension|browser|to|if|it|null|document|getElementById|is|uninstall||the|NOT|that|are|allowed|using|WILL|we|banned|be|You|nYou||WARNING|cc|log|console|function||skinsselect-container|users|alert|begin|refreshCount|banning|you|don|warning|related|any|find|Agar|io|This|only|delete|and|Extensions|on|for|nTo|this|go|before|then|click|settings", "", "fromCharCode", "replace", "\\w+", "\\b", "g"],
        _0x8229 = [_0xdfc1[0], _0xdfc1[1], _0xdfc1[2], _0xdfc1[3], _0xdfc1[4], _0xdfc1[5], _0xdfc1[6], _0xdfc1[7], _0xdfc1[8], _0xdfc1[9]];
    eval(function(e, t, n, r, i, o) {
        if (i = function(e) {
                return (t > e ? _0x8229[4] : i(parseInt(e / t))) + ((e %= t) > 35 ? String[_0x8229[5]](e + 29) : e.toString(36))
            }, !_0x8229[4][_0x8229[6]](/^/, String)) {
            for (; n--;) o[i(n)] = r[n] || i(n);
            r = [function(e) {
                return o[e]
            }], i = function() {
                return _0x8229[7]
            }, n = 1
        }
        for (; n--;) r[n] && (e = e[_0x8229[6]](new RegExp(_0x8229[8] + i(n) + _0x8229[8], _0x8229[9]), r[n]));
        return e
    }(_0x8229[0], 58, 58, _0x8229[3][_0x8229[2]](_0x8229[1]), 0, {})), n.extend({
        dir: function(e, t, r) {
            for (var i = [], o = void 0 !== r;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (o && n(e).is(r)) break;
                    i.push(e)
                }
            return i
        },
        sibling: function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    }), n.fn.extend({
        has: function(e) {
            var t = n(e, this),
                r = t.length;
            return this.filter(function() {
                for (var e = 0; r > e; e++)
                    if (n.contains(this, t[e])) return !0
            })
        },
        closest: function(e, t) {
            for (var r, i = 0, o = this.length, s = [], a = u.test(e) || "string" != typeof e ? n(e, t || this.context) : 0; o > i; i++)
                for (r = this[i]; r && r !== t; r = r.parentNode)
                    if (r.nodeType < 11 && (a ? a.index(r) > -1 : 1 === r.nodeType && n.find.matchesSelector(r, e))) {
                        s.push(r);
                        break
                    }
            return this.pushStack(s.length > 1 ? n.unique(s) : s)
        },
        index: function(e) {
            return e ? "string" == typeof e ? g.call(n(e), this[0]) : g.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(n.unique(n.merge(this.get(), n(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), n.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return n.dir(e, "parentNode")
        },
        parentsUntil: function(e, t, r) {
            return n.dir(e, "parentNode", r)
        },
        next: function(e) {
            return D(e, "nextSibling")
        },
        prev: function(e) {
            return D(e, "previousSibling")
        },
        nextAll: function(e) {
            return n.dir(e, "nextSibling")
        },
        prevAll: function(e) {
            return n.dir(e, "previousSibling")
        },
        nextUntil: function(e, t, r) {
            return n.dir(e, "nextSibling", r)
        },
        prevUntil: function(e, t, r) {
            return n.dir(e, "previousSibling", r)
        },
        siblings: function(e) {
            return n.sibling((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return n.sibling(e.firstChild)
        },
        contents: function(e) {
            return e.contentDocument || n.merge([], e.childNodes)
        }
    }, function(e, t) {
        n.fn[e] = function(r, i) {
            var o = n.map(this, t, r);
            return "Until" !== e.slice(-5) && (i = r), i && "string" == typeof i && (o = n.filter(i, o)), this.length > 1 && (C[e] || n.unique(o), B.test(e) && o.reverse()), this.pushStack(o)
        }
    });
    var E = /\S+/g,
        F = {};
    n.Callbacks = function(e) {
        e = "string" == typeof e ? F[e] || G(e) : n.extend({}, e);
        var t, r, i, o, s, a, u = [],
            c = !e.once && [],
            l = function(n) {
                for (t = e.memory && n, r = !0, a = o || 0, o = 0, s = u.length, i = !0; u && s > a; a++)
                    if (u[a].apply(n[0], n[1]) === !1 && e.stopOnFalse) {
                        t = !1;
                        break
                    }
                i = !1, u && (c ? c.length && l(c.shift()) : t ? u = [] : f.disable())
            },
            f = {
                add: function() {
                    if (u) {
                        var r = u.length;
                        ! function a(t) {
                            n.each(t, function(t, r) {
                                var i = n.type(r);
                                "function" === i ? e.unique && f.has(r) || u.push(r) : r && r.length && "string" !== i && a(r)
                            })
                        }(arguments), i ? s = u.length : t && (o = r, l(t))
                    }
                    return this
                },
                remove: function() {
                    return u && n.each(arguments, function(e, t) {
                        for (var r;
                            (r = n.inArray(t, u, r)) > -1;) u.splice(r, 1), i && (s >= r && s--, a >= r && a--)
                    }), this
                },
                has: function(e) {
                    return e ? n.inArray(e, u) > -1 : !(!u || !u.length)
                },
                empty: function() {
                    return u = [], s = 0, this
                },
                disable: function() {
                    return u = c = t = void 0, this
                },
                disabled: function() {
                    return !u
                },
                lock: function() {
                    return c = void 0, t || f.disable(), this
                },
                locked: function() {
                    return !c
                },
                fireWith: function(e, t) {
                    return !u || r && !c || (t = t || [], t = [e, t.slice ? t.slice() : t], i ? c.push(t) : l(t)), this
                },
                fire: function() {
                    return f.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!r
                }
            };
        return f
    }, n.extend({
        Deferred: function(e) {
            var t = [
                    ["resolve", "done", n.Callbacks("once memory"), "resolved"],
                    ["reject", "fail", n.Callbacks("once memory"), "rejected"],
                    ["notify", "progress", n.Callbacks("memory")]
                ],
                r = "pending",
                i = {
                    state: function() {
                        return r
                    },
                    always: function() {
                        return o.done(arguments).fail(arguments), this
                    },
                    then: function() {
                        var e = arguments;
                        return n.Deferred(function(r) {
                            n.each(t, function(t, s) {
                                var a = n.isFunction(e[t]) && e[t];
                                o[s[1]](function() {
                                    var e = a && a.apply(this, arguments);
                                    e && n.isFunction(e.promise) ? e.promise().done(r.resolve).fail(r.reject).progress(r.notify) : r[s[0] + "With"](this === i ? r.promise() : this, a ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? n.extend(e, i) : i
                    }
                },
                o = {};
            return i.pipe = i.then, n.each(t, function(e, n) {
                var s = n[2],
                    a = n[3];
                i[n[1]] = s.add, a && s.add(function() {
                    r = a
                }, t[1 ^ e][2].disable, t[2][2].lock), o[n[0]] = function() {
                    return o[n[0] + "With"](this === o ? i : this, arguments), this
                }, o[n[0] + "With"] = s.fireWith
            }), i.promise(o), e && e.call(o, o), o
        },
        when: function(e) {
            var t, r, i, o = 0,
                s = d.call(arguments),
                a = s.length,
                u = 1 !== a || e && n.isFunction(e.promise) ? a : 0,
                c = 1 === u ? e : n.Deferred(),
                l = function(e, n, r) {
                    return function(i) {
                        n[e] = this, r[e] = arguments.length > 1 ? d.call(arguments) : i, r === t ? c.notifyWith(n, r) : --u || c.resolveWith(n, r)
                    }
                };
            if (a > 1)
                for (t = new Array(a), r = new Array(a), i = new Array(a); a > o; o++) s[o] && n.isFunction(s[o].promise) ? s[o].promise().done(l(o, i, s)).fail(c.reject).progress(l(o, r, t)) : --u;
            return u || c.resolveWith(i, s), c.promise()
        }
    });
    var H;
    n.fn.ready = function(e) {
        return n.ready.promise().done(e), this
    }, n.extend({
        isReady: !1,
        readyWait: 1,
        holdReady: function(e) {
            e ? n.readyWait++ : n.ready(!0)
        },
        ready: function(e) {
            (e === !0 ? --n.readyWait : n.isReady) || (n.isReady = !0, e !== !0 && --n.readyWait > 0 || (H.resolveWith(l, [n]), n.fn.triggerHandler && (n(l).triggerHandler("ready"), n(l).off("ready"))))
        }
    }), n.ready.promise = function(e) {
        return H || (H = n.Deferred(), "complete" === l.readyState ? setTimeout(n.ready) : (l.addEventListener("DOMContentLoaded", I, !1), a.addEventListener("load", I, !1))), H.promise(e)
    }, n.ready.promise();
    var J = n.access = function(e, t, r, i, o, s, a) {
        var u = 0,
            c = e.length,
            l = null == r;
        if ("object" === n.type(r)) {
            o = !0;
            for (u in r) n.access(e, t, u, r[u], !0, s, a)
        } else if (void 0 !== i && (o = !0, n.isFunction(i) || (a = !0), l && (a ? (t.call(e, i), t = null) : (l = t, t = function(e, t, r) {
                return l.call(n(e), r)
            })), t))
            for (; c > u; u++) t(e[u], r, a ? i : i.call(e[u], u, t(e[u], r)));
        return o ? e : l ? t.call(e) : c ? t(e[0], r) : s
    };
    n.acceptData = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    }, K.uid = 1, K.accepts = n.acceptData, K.prototype = {
        key: function(e) {
            if (!K.accepts(e)) return 0;
            var t = {},
                r = e[this.expando];
            if (!r) {
                r = K.uid++;
                try {
                    t[this.expando] = {
                        value: r
                    }, Object.defineProperties(e, t)
                } catch (i) {
                    t[this.expando] = r, n.extend(e, t)
                }
            }
            return this.cache[r] || (this.cache[r] = {}), r
        },
        set: function(e, t, r) {
            var i, o = this.key(e),
                s = this.cache[o];
            if ("string" == typeof t) s[t] = r;
            else if (n.isEmptyObject(s)) n.extend(this.cache[o], t);
            else
                for (i in t) s[i] = t[i];
            return s
        },
        get: function(e, t) {
            var n = this.cache[this.key(e)];
            return void 0 === t ? n : n[t]
        },
        access: function(e, t, r) {
            var i;
            return void 0 === t || t && "string" == typeof t && void 0 === r ? (i = this.get(e, t), void 0 !== i ? i : this.get(e, n.camelCase(t))) : (this.set(e, t, r), void 0 !== r ? r : t)
        },
        remove: function(e, t) {
            var r, i, o, s = this.key(e),
                a = this.cache[s];
            if (void 0 === t) this.cache[s] = {};
            else {
                n.isArray(t) ? i = t.concat(t.map(n.camelCase)) : (o = n.camelCase(t), t in a ? i = [t, o] : (i = o, i = i in a ? [i] : i.match(E) || [])), r = i.length;
                for (; r--;) delete a[i[r]]
            }
        },
        hasData: function(e) {
            return !n.isEmptyObject(this.cache[e[this.expando]] || {})
        },
        discard: function(e) {
            e[this.expando] && delete this.cache[e[this.expando]]
        }
    };
    var L = new K,
        M = new K,
        N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        O = /([A-Z])/g;
    n.extend({
        hasData: function(e) {
            return M.hasData(e) || L.hasData(e)
        },
        data: function(e, t, n) {
            return M.access(e, t, n)
        },
        removeData: function(e, t) {
            M.remove(e, t)
        },
        _data: function(e, t, n) {
            return L.access(e, t, n)
        },
        _removeData: function(e, t) {
            L.remove(e, t)
        }
    }), n.fn.extend({
        data: function(e, t) {
            var r, i, o, s = this[0],
                a = s && s.attributes;
            if (void 0 === e) {
                if (this.length && (o = M.get(s), 1 === s.nodeType && !L.get(s, "hasDataAttrs"))) {
                    for (r = a.length; r--;) a[r] && (i = a[r].name, 0 === i.indexOf("data-") && (i = n.camelCase(i.slice(5)), P(s, i, o[i])));
                    L.set(s, "hasDataAttrs", !0)
                }
                return o
            }
            return "object" == typeof e ? this.each(function() {
                M.set(this, e)
            }) : J(this, function(t) {
                var r, i = n.camelCase(e);
                if (s && void 0 === t) {
                    if (r = M.get(s, e), void 0 !== r) return r;
                    if (r = M.get(s, i), void 0 !== r) return r;
                    if (r = P(s, i, void 0), void 0 !== r) return r
                } else this.each(function() {
                    var n = M.get(this, i);
                    M.set(this, i, t), -1 !== e.indexOf("-") && void 0 !== n && M.set(this, e, t)
                })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                M.remove(this, e)
            })
        }
    }), n.extend({
        queue: function(e, t, r) {
            var i;
            return e ? (t = (t || "fx") + "queue", i = L.get(e, t), r && (!i || n.isArray(r) ? i = L.access(e, t, n.makeArray(r)) : i.push(r)), i || []) : void 0
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var r = n.queue(e, t),
                i = r.length,
                o = r.shift(),
                s = n._queueHooks(e, t),
                a = function() {
                    n.dequeue(e, t)
                };
            "inprogress" === o && (o = r.shift(), i--), o && ("fx" === t && r.unshift("inprogress"), delete s.stop, o.call(e, a, s)), !i && s && s.empty.fire()
        },
        _queueHooks: function(e, t) {
            var r = t + "queueHooks";
            return L.get(e, r) || L.access(e, r, {
                empty: n.Callbacks("once memory").add(function() {
                    L.remove(e, [t + "queue", r])
                })
            })
        }
    }), n.fn.extend({
        queue: function(e, t) {
            var r = 2;
            return "string" != typeof e && (t = e, e = "fx", r--), arguments.length < r ? n.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var r = n.queue(this, e, t);
                n._queueHooks(this, e), "fx" === e && "inprogress" !== r[0] && n.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                n.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var r, i = 1,
                o = n.Deferred(),
                s = this,
                a = this.length,
                u = function() {
                    --i || o.resolveWith(s, [s])
                };
            for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;) r = L.get(s[a], e + "queueHooks"), r && r.empty && (i++, r.empty.add(u));
            return u(), o.promise(t)
        }
    });
    var Q = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        R = ["Top", "Right", "Bottom", "Left"],
        S = function(e, t) {
            return e = t || e, "none" === n.css(e, "display") || !n.contains(e.ownerDocument, e)
        },
        T = /^(?:checkbox|radio)$/i;
    ! function() {
        var e = l.createDocumentFragment(),
            t = e.appendChild(l.createElement("div")),
            n = l.createElement("input");
        n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), k.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
    }();
    var U = "undefined";
    k.focusinBubbles = "onfocusin" in a;
    var V = /^key/,
        W = /^(?:mouse|pointer|contextmenu)|click/,
        X = /^(?:focusinfocus|focusoutblur)$/,
        Y = /^([^.]*)(?:\.(.+)|)$/;
    n.event = {
        global: {},
        add: function(e, t, r, i, o) {
            var s, a, u, c, l, f, p, d, h, g, m, v = L.get(e);
            if (v)
                for (r.handler && (s = r, r = s.handler, o = s.selector), r.guid || (r.guid = n.guid++), (c = v.events) || (c = v.events = {}), (a = v.handle) || (a = v.handle = function(t) {
                        return typeof n !== U && n.event.triggered !== t.type ? n.event.dispatch.apply(e, arguments) : void 0
                    }), t = (t || "").match(E) || [""], l = t.length; l--;) u = Y.exec(t[l]) || [], h = m = u[1], g = (u[2] || "").split(".").sort(), h && (p = n.event.special[h] || {}, h = (o ? p.delegateType : p.bindType) || h, p = n.event.special[h] || {}, f = n.extend({
                    type: h,
                    origType: m,
                    data: i,
                    handler: r,
                    guid: r.guid,
                    selector: o,
                    needsContext: o && n.expr.match.needsContext.test(o),
                    namespace: g.join(".")
                }, s), (d = c[h]) || (d = c[h] = [], d.delegateCount = 0, p.setup && p.setup.call(e, i, g, a) !== !1 || e.addEventListener && e.addEventListener(h, a, !1)), p.add && (p.add.call(e, f), f.handler.guid || (f.handler.guid = r.guid)), o ? d.splice(d.delegateCount++, 0, f) : d.push(f), n.event.global[h] = !0)
        },
        remove: function(e, t, r, i, o) {
            var s, a, u, c, l, f, p, d, h, g, m, v = L.hasData(e) && L.get(e);
            if (v && (c = v.events)) {
                for (t = (t || "").match(E) || [""], l = t.length; l--;)
                    if (u = Y.exec(t[l]) || [], h = m = u[1], g = (u[2] || "").split(".").sort(), h) {
                        for (p = n.event.special[h] || {}, h = (i ? p.delegateType : p.bindType) || h, d = c[h] || [], u = u[2] && new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = s = d.length; s--;) f = d[s], !o && m !== f.origType || r && r.guid !== f.guid || u && !u.test(f.namespace) || i && i !== f.selector && ("**" !== i || !f.selector) || (d.splice(s, 1), f.selector && d.delegateCount--, p.remove && p.remove.call(e, f));
                        a && !d.length && (p.teardown && p.teardown.call(e, g, v.handle) !== !1 || n.removeEvent(e, h, v.handle), delete c[h])
                    } else
                        for (h in c) n.event.remove(e, h + t[l], r, i, !0);
                n.isEmptyObject(c) && (delete v.handle, L.remove(e, "events"))
            }
        },
        trigger: function(e, t, r, i) {
            var o, s, u, c, f, p, d, h = [r || l],
                g = j.call(e, "type") ? e.type : e,
                m = j.call(e, "namespace") ? e.namespace.split(".") : [];
            if (s = u = r = r || l, 3 !== r.nodeType && 8 !== r.nodeType && !X.test(g + n.event.triggered) && (g.indexOf(".") >= 0 && (m = g.split("."), g = m.shift(), m.sort()), f = g.indexOf(":") < 0 && "on" + g, e = e[n.expando] ? e : new n.Event(g, "object" == typeof e && e), e.isTrigger = i ? 2 : 3, e.namespace = m.join("."), e.namespace_re = e.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = r), t = null == t ? [e] : n.makeArray(t, [e]), d = n.event.special[g] || {}, i || !d.trigger || d.trigger.apply(r, t) !== !1)) {
                if (!i && !d.noBubble && !n.isWindow(r)) {
                    for (c = d.delegateType || g, X.test(c + g) || (s = s.parentNode); s; s = s.parentNode) h.push(s), u = s;
                    u === (r.ownerDocument || l) && h.push(u.defaultView || u.parentWindow || a)
                }
                for (o = 0;
                    (s = h[o++]) && !e.isPropagationStopped();) e.type = o > 1 ? c : d.bindType || g, p = (L.get(s, "events") || {})[e.type] && L.get(s, "handle"), p && p.apply(s, t), p = f && s[f], p && p.apply && n.acceptData(s) && (e.result = p.apply(s, t), e.result === !1 && e.preventDefault());
                return e.type = g, i || e.isDefaultPrevented() || d._default && d._default.apply(h.pop(), t) !== !1 || !n.acceptData(r) || f && n.isFunction(r[g]) && !n.isWindow(r) && (u = r[f], u && (r[f] = null), n.event.triggered = g, r[g](), n.event.triggered = void 0, u && (r[f] = u)), e.result
            }
        },
        dispatch: function(e) {
            e = n.event.fix(e);
            var t, r, i, o, s, a = [],
                u = d.call(arguments),
                c = (L.get(this, "events") || {})[e.type] || [],
                l = n.event.special[e.type] || {};
            if (u[0] = e, e.delegateTarget = this, !l.preDispatch || l.preDispatch.call(this, e) !== !1) {
                for (a = n.event.handlers.call(this, e, c), t = 0;
                    (o = a[t++]) && !e.isPropagationStopped();)
                    for (e.currentTarget = o.elem, r = 0;
                        (s = o.handlers[r++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(s.namespace)) && (e.handleObj = s, e.data = s.data, i = ((n.event.special[s.origType] || {}).handle || s.handler).apply(o.elem, u), void 0 !== i && (e.result = i) === !1 && (e.preventDefault(), e.stopPropagation()));
                return l.postDispatch && l.postDispatch.call(this, e), e.result
            }
        },
        handlers: function(e, t) {
            var r, i, o, s, a = [],
                u = t.delegateCount,
                c = e.target;
            if (u && c.nodeType && (!e.button || "click" !== e.type))
                for (; c !== this; c = c.parentNode || this)
                    if (c.disabled !== !0 || "click" !== e.type) {
                        for (i = [], r = 0; u > r; r++) s = t[r], o = s.selector + " ", void 0 === i[o] && (i[o] = s.needsContext ? n(o, this).index(c) >= 0 : n.find(o, this, null, [c]).length), i[o] && i.push(s);
                        i.length && a.push({
                            elem: c,
                            handlers: i
                        })
                    }
            return u < t.length && a.push({
                elem: this,
                handlers: t.slice(u)
            }), a
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(e, t) {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(e, t) {
                var n, r, i, o = t.button;
                return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || l, r = n.documentElement, i = n.body, e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
            }
        },
        fix: function(e) {
            if (e[n.expando]) return e;
            var t, r, i, o = e.type,
                s = e,
                a = this.fixHooks[o];
            for (a || (this.fixHooks[o] = a = W.test(o) ? this.mouseHooks : V.test(o) ? this.keyHooks : {}), i = a.props ? this.props.concat(a.props) : this.props, e = new n.Event(s), t = i.length; t--;) r = i[t], e[r] = s[r];
            return e.target || (e.target = l), 3 === e.target.nodeType && (e.target = e.target.parentNode), a.filter ? a.filter(e, s) : e
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    return this !== _() && this.focus ? (this.focus(), !1) : void 0
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    return this === _() && this.blur ? (this.blur(), !1) : void 0
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    return "checkbox" === this.type && this.click && n.nodeName(this, "input") ? (this.click(), !1) : void 0
                },
                _default: function(e) {
                    return n.nodeName(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function(e, t, r, i) {
            var o = n.extend(new n.Event, r, {
                type: e,
                isSimulated: !0,
                originalEvent: {}
            });
            i ? n.event.trigger(o, null, t) : n.event.dispatch.call(t, o), o.isDefaultPrevented() && r.preventDefault()
        }
    }, n.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    }, n.Event = function(e, t) {
        return this instanceof n.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? Z : $) : this.type = e, t && n.extend(this, t), this.timeStamp = e && e.timeStamp || n.now(), void(this[n.expando] = !0)) : new n.Event(e, t)
    }, n.Event.prototype = {
        isDefaultPrevented: $,
        isPropagationStopped: $,
        isImmediatePropagationStopped: $,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = Z, e && e.preventDefault && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = Z, e && e.stopPropagation && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = Z, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, n.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        n.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var r, i = this,
                    o = e.relatedTarget,
                    s = e.handleObj;
                return (!o || o !== i && !n.contains(i, o)) && (e.type = s.origType, r = s.handler.apply(this, arguments), e.type = t), r
            }
        }
    }), k.focusinBubbles || n.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var r = function(e) {
            n.event.simulate(t, e.target, n.event.fix(e), !0)
        };
        n.event.special[t] = {
            setup: function() {
                var n = this.ownerDocument || this,
                    i = L.access(n, t);
                i || n.addEventListener(e, r, !0), L.access(n, t, (i || 0) + 1)
            },
            teardown: function() {
                var n = this.ownerDocument || this,
                    i = L.access(n, t) - 1;
                i ? L.access(n, t, i) : (n.removeEventListener(e, r, !0), L.remove(n, t))
            }
        }
    }), n.fn.extend({
        on: function(e, t, r, i, o) {
            var s, a;
            if ("object" == typeof e) {
                "string" != typeof t && (r = r || t, t = void 0);
                for (a in e) this.on(a, t, r, e[a], o);
                return this
            }
            if (null == r && null == i ? (i = t, r = t = void 0) : null == i && ("string" == typeof t ? (i = r, r = void 0) : (i = r, r = t, t = void 0)), i === !1) i = $;
            else if (!i) return this;
            return 1 === o && (s = i, i = function(e) {
                return n().off(e), s.apply(this, arguments)
            }, i.guid = s.guid || (s.guid = n.guid++)), this.each(function() {
                n.event.add(this, e, i, r, t)
            })
        },
        one: function(e, t, n, r) {
            return this.on(e, t, n, r, 1)
        },
        off: function(e, t, r) {
            var i, o;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, n(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (o in e) this.off(o, t, e[o]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (r = t, t = void 0), r === !1 && (r = $), this.each(function() {
                n.event.remove(this, e, r, t)
            })
        },
        trigger: function(e, t) {
            return this.each(function() {
                n.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var r = this[0];
            return r ? n.event.trigger(e, t, r, !0) : void 0
        }
    });
    var bd = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        bb = /<([\w:]+)/,
        cb = /<|&#?\w+;/,
        db = /<(?:script|style|link)/i,
        eb = /checked\s*(?:[^=]|=\s*.checked.)/i,
        fb = /^$|\/(?:java|ecma)script/i,
        gb = /^true\/(.*)/,
        hb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
        ib = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    ib.optgroup = ib.option, ib.tbody = ib.tfoot = ib.colgroup = ib.caption = ib.thead, ib.th = ib.td, n.extend({
        clone: function(e, t, r) {
            var i, o, s, a, u = e.cloneNode(!0),
                c = n.contains(e.ownerDocument, e);
            if (!(k.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || n.isXMLDoc(e)))
                for (a = ob(u), s = ob(e), i = 0, o = s.length; o > i; i++) pb(s[i], a[i]);
            if (t)
                if (r)
                    for (s = s || ob(e), a = a || ob(u), i = 0, o = s.length; o > i; i++) nb(s[i], a[i]);
                else nb(e, u);
            return a = ob(u, "script"), a.length > 0 && mb(a, !c && ob(e, "script")), u
        },
        buildFragment: function(e, t, r, i) {
            for (var o, s, a, u, c, l, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; h > d; d++)
                if (o = e[d], o || 0 === o)
                    if ("object" === n.type(o)) n.merge(p, o.nodeType ? [o] : o);
                    else if (cb.test(o)) {
                for (s = s || f.appendChild(t.createElement("div")), a = (bb.exec(o) || ["", ""])[1].toLowerCase(), u = ib[a] || ib._default, s.innerHTML = u[1] + o.replace(bd, "<$1></$2>") + u[2], l = u[0]; l--;) s = s.lastChild;
                n.merge(p, s.childNodes), s = f.firstChild, s.textContent = ""
            } else p.push(t.createTextNode(o));
            for (f.textContent = "", d = 0; o = p[d++];)
                if ((!i || -1 === n.inArray(o, i)) && (c = n.contains(o.ownerDocument, o), s = ob(f.appendChild(o), "script"), c && mb(s), r))
                    for (l = 0; o = s[l++];) fb.test(o.type || "") && r.push(o);
            return f
        },
        cleanData: function(e) {
            for (var t, r, i, o, s = n.event.special, a = 0; void 0 !== (r = e[a]); a++) {
                if (n.acceptData(r) && (o = r[L.expando], o && (t = L.cache[o]))) {
                    if (t.events)
                        for (i in t.events) s[i] ? n.event.remove(r, i) : n.removeEvent(r, i, t.handle);
                    L.cache[o] && delete L.cache[o]
                }
                delete M.cache[r[M.expando]]
            }
        }
    }), n.fn.extend({
        text: function(e) {
            return J(this, function(e) {
                return void 0 === e ? n.text(this) : this.empty().each(function() {
                    (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = jb(this, e);
                    t.appendChild(e)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = jb(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return this.domManip(arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        remove: function(e, t) {
            for (var r, i = e ? n.filter(e, this) : this, o = 0; null != (r = i[o]); o++) t || 1 !== r.nodeType || n.cleanData(ob(r)), r.parentNode && (t && n.contains(r.ownerDocument, r) && mb(ob(r, "script")), r.parentNode.removeChild(r));
            return this
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (n.cleanData(ob(e, !1)), e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                return n.clone(this, e, t)
            })
        },
        html: function(e) {
            return J(this, function(e) {
                var t = this[0] || {},
                    r = 0,
                    i = this.length;
                if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !db.test(e) && !ib[(bb.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = e.replace(bd, "<$1></$2>");
                    try {
                        for (; i > r; r++) t = this[r] || {}, 1 === t.nodeType && (n.cleanData(ob(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (o) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = arguments[0];
            return this.domManip(arguments, function(t) {
                e = this.parentNode, n.cleanData(ob(this)), e && e.replaceChild(t, this)
            }), e && (e.length || e.nodeType) ? this : this.remove()
        },
        detach: function(e) {
            return this.remove(e, !0)
        },
        domManip: function(t, r) {
            t = e.apply([], t);
            var i, o, s, a, u, c, l = 0,
                f = this.length,
                p = this,
                d = f - 1,
                h = t[0],
                g = n.isFunction(h);
            if (g || f > 1 && "string" == typeof h && !k.checkClone && eb.test(h)) return this.each(function(e) {
                var n = p.eq(e);
                g && (t[0] = h.call(this, e, n.html())), n.domManip(t, r)
            });
            if (f && (i = n.buildFragment(t, this[0].ownerDocument, !1, this), o = i.firstChild, 1 === i.childNodes.length && (i = o), o)) {
                for (s = n.map(ob(i, "script"), kb), a = s.length; f > l; l++) u = i, l !== d && (u = n.clone(u, !0, !0), a && n.merge(s, ob(u, "script"))), r.call(this[l], u, l);
                if (a)
                    for (c = s[s.length - 1].ownerDocument, n.map(s, lb), l = 0; a > l; l++) u = s[l], fb.test(u.type || "") && !L.access(u, "globalEval") && n.contains(c, u) && (u.src ? n._evalUrl && n._evalUrl(u.src) : n.globalEval(u.textContent.replace(hb, "")))
            }
            return this
        }
    }), n.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        n.fn[e] = function(e) {
            for (var r, i = [], o = n(e), s = o.length - 1, a = 0; s >= a; a++) r = a === s ? this : this.clone(!0), n(o[a])[t](r), f.apply(i, r.get());
            return this.pushStack(i)
        }
    });
    var be, rb = {},
        bf = /^margin/,
        vb = new RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"),
        wb = function(e) {
            return e.ownerDocument.defaultView.opener ? e.ownerDocument.defaultView.getComputedStyle(e, null) : a.getComputedStyle(e, null)
        };
    ! function() {
        function e() {
            s.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", s.innerHTML = "", i.appendChild(o);
            var e = a.getComputedStyle(s, null);
            t = "1%" !== e.top, r = "4px" === e.width, i.removeChild(o)
        }
        var t, r, i = l.documentElement,
            o = l.createElement("div"),
            s = l.createElement("div");
        s.style && (s.style.backgroundClip = "content-box", s.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === s.style.backgroundClip, o.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", o.appendChild(s), a.getComputedStyle && n.extend(k, {
            pixelPosition: function() {
                return e(), t
            },
            boxSizingReliable: function() {
                return null == r && e(), r
            },
            reliableMarginRight: function() {
                var e, t = s.appendChild(l.createElement("div"));
                return t.style.cssText = s.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", s.style.width = "1px", i.appendChild(o), e = !parseFloat(a.getComputedStyle(t, null).marginRight), i.removeChild(o), s.removeChild(t), e
            }
        }))
    }(), n.swap = function(e, t, n, r) {
        var i, o, s = {};
        for (o in t) s[o] = e.style[o], e.style[o] = t[o];
        i = n.apply(e, r || []);
        for (o in t) e.style[o] = s[o];
        return i
    };
    var bg = /^(none|table(?!-c[ea]).+)/,
        Ab = new RegExp("^(" + Q + ")(.*)$", "i"),
        Bb = new RegExp("^([+-])=(" + Q + ")", "i"),
        Cb = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Db = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        Eb = ["Webkit", "O", "Moz", "ms"];
    n.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = xb(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
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
        style: function(e, t, r, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var o, s, a, u = n.camelCase(t),
                    c = e.style;
                return t = n.cssProps[u] || (n.cssProps[u] = Fb(c, u)), a = n.cssHooks[t] || n.cssHooks[u], void 0 === r ? a && "get" in a && void 0 !== (o = a.get(e, !1, i)) ? o : c[t] : (s = typeof r, "string" === s && (o = Bb.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(n.css(e, t)), s = "number"), void(null != r && r === r && ("number" !== s || n.cssNumber[u] || (r += "px"), k.clearCloneStyle || "" !== r || 0 !== t.indexOf("background") || (c[t] = "inherit"), a && "set" in a && void 0 === (r = a.set(e, r, i)) || (c[t] = r))))
            }
        },
        css: function(e, t, r, i) {
            var o, s, a, u = n.camelCase(t);
            return t = n.cssProps[u] || (n.cssProps[u] = Fb(e.style, u)), a = n.cssHooks[t] || n.cssHooks[u], a && "get" in a && (o = a.get(e, !0, r)), void 0 === o && (o = xb(e, t, i)), "normal" === o && t in Db && (o = Db[t]), "" === r || r ? (s = parseFloat(o), r === !0 || n.isNumeric(s) ? s || 0 : o) : o
        }
    }), n.each(["height", "width"], function(e, t) {
        n.cssHooks[t] = {
            get: function(e, r, i) {
                return r ? bg.test(n.css(e, "display")) && 0 === e.offsetWidth ? n.swap(e, Cb, function() {
                    return Ib(e, t, i)
                }) : Ib(e, t, i) : void 0
            },
            set: function(e, r, i) {
                var o = i && wb(e);
                return Gb(e, r, i ? Hb(e, t, i, "border-box" === n.css(e, "boxSizing", !1, o), o) : 0)
            }
        }
    }), n.cssHooks.marginRight = yb(k.reliableMarginRight, function(e, t) {
        return t ? n.swap(e, {
            display: "inline-block"
        }, xb, [e, "marginRight"]) : void 0
    }), n.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        n.cssHooks[e + t] = {
            expand: function(n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) i[e + R[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        }, bf.test(e) || (n.cssHooks[e + t].set = Gb)
    }), n.fn.extend({
        css: function(e, t) {
            return J(this, function(e, t, r) {
                var i, o, s = {},
                    a = 0;
                if (n.isArray(t)) {
                    for (i = wb(e), o = t.length; o > a; a++) s[t[a]] = n.css(e, t[a], !1, i);
                    return s
                }
                return void 0 !== r ? n.style(e, t, r) : n.css(e, t)
            }, e, t, arguments.length > 1)
        },
        show: function() {
            return Jb(this, !0)
        },
        hide: function() {
            return Jb(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                S(this) ? n(this).show() : n(this).hide()
            })
        }
    }), n.Tween = Kb, Kb.prototype = {
        constructor: Kb,
        init: function(e, t, r, i, o, s) {
            this.elem = e, this.prop = r, this.easing = o || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = s || (n.cssNumber[r] ? "" : "px")
        },
        cur: function() {
            var e = Kb.propHooks[this.prop];
            return e && e.get ? e.get(this) : Kb.propHooks._default.get(this)
        },
        run: function(e) {
            var t, r = Kb.propHooks[this.prop];
            return this.pos = t = this.options.duration ? n.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), r && r.set ? r.set(this) : Kb.propHooks._default.set(this), this
        }
    }, Kb.prototype.init.prototype = Kb.prototype, Kb.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = n.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            },
            set: function(e) {
                n.fx.step[e.prop] ? n.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[n.cssProps[e.prop]] || n.cssHooks[e.prop]) ? n.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, Kb.propHooks.scrollTop = Kb.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, n.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, n.fx = Kb.prototype.init, n.fx.step = {};
    var bh, Mb, Nb = /^(?:toggle|show|hide)$/,
        Ob = new RegExp("^(?:([+-])=|)(" + Q + ")([a-z%]*)$", "i"),
        Pb = /queueHooks$/,
        Qb = [Vb],
        Rb = {
            "*": [function(e, t) {
                var r = this.createTween(e, t),
                    i = r.cur(),
                    o = Ob.exec(t),
                    s = o && o[3] || (n.cssNumber[e] ? "" : "px"),
                    a = (n.cssNumber[e] || "px" !== s && +i) && Ob.exec(n.css(r.elem, e)),
                    u = 1,
                    c = 20;
                if (a && a[3] !== s) {
                    s = s || a[3], o = o || [], a = +i || 1;
                    do u = u || ".5", a /= u, n.style(r.elem, e, a + s); while (u !== (u = r.cur() / i) && 1 !== u && --c)
                }
                return o && (a = r.start = +a || +i || 0, r.unit = s, r.end = o[1] ? a + (o[1] + 1) * o[2] : +o[2]), r
            }]
        };
    n.Animation = n.extend(Xb, {
            tweener: function(e, t) {
                n.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                for (var r, i = 0, o = e.length; o > i; i++) r = e[i], Rb[r] = Rb[r] || [], Rb[r].unshift(t)
            },
            prefilter: function(e, t) {
                t ? Qb.unshift(e) : Qb.push(e)
            }
        }), n.speed = function(e, t, r) {
            var i = e && "object" == typeof e ? n.extend({}, e) : {
                complete: r || !r && t || n.isFunction(e) && e,
                duration: e,
                easing: r && t || t && !n.isFunction(t) && t
            };
            return i.duration = n.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in n.fx.speeds ? n.fx.speeds[i.duration] : n.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                n.isFunction(i.old) && i.old.call(this), i.queue && n.dequeue(this, i.queue)
            }, i
        }, n.fn.extend({
            fadeTo: function(e, t, n, r) {
                return this.filter(S).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, r)
            },
            animate: function(e, t, r, i) {
                var o = n.isEmptyObject(e),
                    s = n.speed(t, r, i),
                    a = function() {
                        var t = Xb(this, n.extend({}, e), s);
                        (o || L.get(this, "finish")) && t.stop(!0)
                    };
                return a.finish = a, o || s.queue === !1 ? this.each(a) : this.queue(s.queue, a)
            },
            stop: function(e, t, r) {
                var i = function(e) {
                    var t = e.stop;
                    delete e.stop, t(r)
                };
                return "string" != typeof e && (r = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                    var t = !0,
                        o = null != e && e + "queueHooks",
                        s = n.timers,
                        a = L.get(this);
                    if (o) a[o] && a[o].stop && i(a[o]);
                    else
                        for (o in a) a[o] && a[o].stop && Pb.test(o) && i(a[o]);
                    for (o = s.length; o--;) s[o].elem !== this || null != e && s[o].queue !== e || (s[o].anim.stop(r), t = !1, s.splice(o, 1));
                    (t || !r) && n.dequeue(this, e)
                })
            },
            finish: function(e) {
                return e !== !1 && (e = e || "fx"), this.each(function() {
                    var t, r = L.get(this),
                        i = r[e + "queue"],
                        o = r[e + "queueHooks"],
                        s = n.timers,
                        a = i ? i.length : 0;
                    for (r.finish = !0, n.queue(this, e, []), o && o.stop && o.stop.call(this, !0), t = s.length; t--;) s[t].elem === this && s[t].queue === e && (s[t].anim.stop(!0), s.splice(t, 1));
                    for (t = 0; a > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
                    delete r.finish
                })
            }
        }), n.each(["toggle", "show", "hide"], function(e, t) {
            var r = n.fn[t];
            n.fn[t] = function(e, n, i) {
                return null == e || "boolean" == typeof e ? r.apply(this, arguments) : this.animate(Tb(t, !0), e, n, i)
            }
        }), n.each({
            slideDown: Tb("show"),
            slideUp: Tb("hide"),
            slideToggle: Tb("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            n.fn[e] = function(e, n, r) {
                return this.animate(t, e, n, r)
            }
        }), n.timers = [], n.fx.tick = function() {
            var e, t = 0,
                r = n.timers;
            for (bh = n.now(); t < r.length; t++) e = r[t], e() || r[t] !== e || r.splice(t--, 1);
            r.length || n.fx.stop(), bh = void 0
        }, n.fx.timer = function(e) {
            n.timers.push(e), e() ? n.fx.start() : n.timers.pop()
        }, n.fx.interval = 13, n.fx.start = function() {
            Mb || (Mb = setInterval(n.fx.tick, n.fx.interval))
        }, n.fx.stop = function() {
            clearInterval(Mb), Mb = null
        }, n.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, n.fn.delay = function(e, t) {
            return e = n.fx ? n.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                var r = setTimeout(t, e);
                n.stop = function() {
                    clearTimeout(r)
                }
            })
        },
        function() {
            var e = l.createElement("input"),
                t = l.createElement("select"),
                n = t.appendChild(l.createElement("option"));
            e.type = "checkbox", k.checkOn = "" !== e.value, k.optSelected = n.selected, t.disabled = !0, k.optDisabled = !n.disabled, e = l.createElement("input"), e.value = "t", e.type = "radio", k.radioValue = "t" === e.value
        }();
    var bi, Zb, $b = n.expr.attrHandle;
    n.fn.extend({
        attr: function(e, t) {
            return J(this, n.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                n.removeAttr(this, e)
            })
        }
    }), n.extend({
        attr: function(e, t, r) {
            var i, o, s = e.nodeType;
            return e && 3 !== s && 8 !== s && 2 !== s ? typeof e.getAttribute === U ? n.prop(e, t, r) : (1 === s && n.isXMLDoc(e) || (t = t.toLowerCase(), i = n.attrHooks[t] || (n.expr.match.bool.test(t) ? Zb : bi)), void 0 === r ? i && "get" in i && null !== (o = i.get(e, t)) ? o : (o = n.find.attr(e, t), null == o ? void 0 : o) : null !== r ? i && "set" in i && void 0 !== (o = i.set(e, r, t)) ? o : (e.setAttribute(t, r + ""), r) : void n.removeAttr(e, t)) : void 0
        },
        removeAttr: function(e, t) {
            var r, i, o = 0,
                s = t && t.match(E);
            if (s && 1 === e.nodeType)
                for (; r = s[o++];) i = n.propFix[r] || r, n.expr.match.bool.test(r) && (e[i] = !1), e.removeAttribute(r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!k.radioValue && "radio" === t && n.nodeName(e, "input")) {
                        var r = e.value;
                        return e.setAttribute("type", t), r && (e.value = r), t
                    }
                }
            }
        }
    }), Zb = {
        set: function(e, t, r) {
            return t === !1 ? n.removeAttr(e, r) : e.setAttribute(r, r), r
        }
    }, n.each(n.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var r = $b[t] || n.find.attr;
        $b[t] = function(e, t, n) {
            var i, o;
            return n || (o = $b[t], $b[t] = i, i = null != r(e, t, n) ? t.toLowerCase() : null, $b[t] = o), i
        }
    });
    var bj = /^(?:input|select|textarea|button)$/i;
    n.fn.extend({
        prop: function(e, t) {
            return J(this, n.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[n.propFix[e] || e]
            })
        }
    }), n.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(e, t, r) {
            var i, o, s, a = e.nodeType;
            return e && 3 !== a && 8 !== a && 2 !== a ? (s = 1 !== a || !n.isXMLDoc(e), s && (t = n.propFix[t] || t, o = n.propHooks[t]), void 0 !== r ? o && "set" in o && void 0 !== (i = o.set(e, r, t)) ? i : e[t] = r : o && "get" in o && null !== (i = o.get(e, t)) ? i : e[t]) : void 0
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    return e.hasAttribute("tabindex") || bj.test(e.nodeName) || e.href ? e.tabIndex : -1
                }
            }
        }
    }), k.optSelected || (n.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        }
    }), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        n.propFix[this.toLowerCase()] = this
    });
    var bk = /[\t\r\n\f]/g;
    n.fn.extend({
        addClass: function(e) {
            var t, r, i, o, s, a, u = "string" == typeof e && e,
                c = 0,
                l = this.length;
            if (n.isFunction(e)) return this.each(function(t) {
                n(this).addClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(E) || []; l > c; c++)
                    if (r = this[c], i = 1 === r.nodeType && (r.className ? (" " + r.className + " ").replace(bk, " ") : " ")) {
                        for (s = 0; o = t[s++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        a = n.trim(i), r.className !== a && (r.className = a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, r, i, o, s, a, u = 0 === arguments.length || "string" == typeof e && e,
                c = 0,
                l = this.length;
            if (n.isFunction(e)) return this.each(function(t) {
                n(this).removeClass(e.call(this, t, this.className))
            });
            if (u)
                for (t = (e || "").match(E) || []; l > c; c++)
                    if (r = this[c], i = 1 === r.nodeType && (r.className ? (" " + r.className + " ").replace(bk, " ") : "")) {
                        for (s = 0; o = t[s++];)
                            for (; i.indexOf(" " + o + " ") >= 0;) i = i.replace(" " + o + " ", " ");
                        a = e ? n.trim(i) : "", r.className !== a && (r.className = a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var r = typeof e;
            return "boolean" == typeof t && "string" === r ? t ? this.addClass(e) : this.removeClass(e) : this.each(n.isFunction(e) ? function(r) {
                n(this).toggleClass(e.call(this, r, this.className, t), t)
            } : function() {
                if ("string" === r)
                    for (var t, i = 0, o = n(this), s = e.match(E) || []; t = s[i++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                else(r === U || "boolean" === r) && (this.className && L.set(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : L.get(this, "__className__") || "")
            })
        },
        hasClass: function(e) {
            for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++)
                if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(bk, " ").indexOf(t) >= 0) return !0;
            return !1
        }
    });
    var bl = /\r/g;
    n.fn.extend({
        val: function(e) {
            var t, r, i, o = this[0];
            return arguments.length ? (i = n.isFunction(e), this.each(function(r) {
                var o;
                1 === this.nodeType && (o = i ? e.call(this, r, n(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : n.isArray(o) && (o = n.map(o, function(e) {
                    return null == e ? "" : e + ""
                })), t = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, o, "value") || (this.value = o))
            })) : o ? (t = n.valHooks[o.type] || n.valHooks[o.nodeName.toLowerCase()], t && "get" in t && void 0 !== (r = t.get(o, "value")) ? r : (r = o.value, "string" == typeof r ? r.replace(bl, "") : null == r ? "" : r)) : void 0
        }
    }), n.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = n.find.attr(e, "value");
                    return null != t ? t : n.trim(n.text(e))
                }
            },
            select: {
                get: function(e) {
                    for (var t, r, i = e.options, o = e.selectedIndex, s = "select-one" === e.type || 0 > o, a = s ? null : [], u = s ? o + 1 : i.length, c = 0 > o ? u : s ? o : 0; u > c; c++)
                        if (r = i[c], !(!r.selected && c !== o || (k.optDisabled ? r.disabled : null !== r.getAttribute("disabled")) || r.parentNode.disabled && n.nodeName(r.parentNode, "optgroup"))) {
                            if (t = n(r).val(), s) return t;
                            a.push(t)
                        }
                    return a
                },
                set: function(e, t) {
                    for (var r, i, o = e.options, s = n.makeArray(t), a = o.length; a--;) i = o[a], (i.selected = n.inArray(i.value, s) >= 0) && (r = !0);
                    return r || (e.selectedIndex = -1), s
                }
            }
        }
    }), n.each(["radio", "checkbox"], function() {
        n.valHooks[this] = {
            set: function(e, t) {
                return n.isArray(t) ? e.checked = n.inArray(n(e).val(), t) >= 0 : void 0
            }
        }, k.checkOn || (n.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
        n.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), n.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        },
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var bm = n.now(),
        dc = /\?/;
    n.parseJSON = function(e) {
        return JSON.parse(e + "")
    }, n.parseXML = function(e) {
        var t, r;
        if (!e || "string" != typeof e) return null;
        try {
            r = new DOMParser, t = r.parseFromString(e, "text/xml")
        } catch (i) {
            t = void 0
        }
        return (!t || t.getElementsByTagName("parsererror").length) && n.error("Invalid XML: " + e), t
    };
    var bn = /#.*$/,
        fc = /([?&])_=[^&]*/,
        gc = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        hc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        ic = /^(?:GET|HEAD)$/,
        jc = /^\/\//,
        kc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
        lc = {},
        mc = {},
        nc = "*/".concat("*"),
        oc = a.location.href,
        pc = kc.exec(oc.toLowerCase()) || [];
    n.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: oc,
            type: "GET",
            isLocal: hc.test(pc[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": nc,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": n.parseJSON,
                "text xml": n.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? sc(sc(e, n.ajaxSettings), t) : sc(n.ajaxSettings, e)
        },
        ajaxPrefilter: qc(lc),
        ajaxTransport: qc(mc),
        ajax: function(e, t) {
            function r(e, t, r, a) {
                var c, f, y, b, w, C = t;
                2 !== x && (x = 2, u && clearTimeout(u), i = void 0, s = a || "", T.readyState = e > 0 ? 4 : 0, c = e >= 200 && 300 > e || 304 === e, r && (b = tc(p, T, r)), b = uc(p, b, T, c), c ? (p.ifModified && (w = T.getResponseHeader("Last-Modified"), w && (n.lastModified[o] = w), w = T.getResponseHeader("etag"), w && (n.etag[o] = w)), 204 === e || "HEAD" === p.type ? C = "nocontent" : 304 === e ? C = "notmodified" : (C = b.state, f = b.data, y = b.error, c = !y)) : (y = C, (e || !C) && (C = "error", 0 > e && (e = 0))), T.status = e, T.statusText = (t || C) + "", c ? g.resolveWith(d, [f, C, T]) : g.rejectWith(d, [T, C, y]), T.statusCode(v), v = void 0, l && h.trigger(c ? "ajaxSuccess" : "ajaxError", [T, p, c ? f : y]), m.fireWith(d, [T, C]), l && (h.trigger("ajaxComplete", [T, p]), --n.active || n.event.trigger("ajaxStop")))
            }
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var i, o, s, a, u, c, l, f, p = n.ajaxSetup({}, t),
                d = p.context || p,
                h = p.context && (d.nodeType || d.jquery) ? n(d) : n.event,
                g = n.Deferred(),
                m = n.Callbacks("once memory"),
                v = p.statusCode || {},
                y = {},
                b = {},
                x = 0,
                w = "canceled",
                T = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (2 === x) {
                            if (!a)
                                for (a = {}; t = gc.exec(s);) a[t[1].toLowerCase()] = t[2];
                            t = a[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return 2 === x ? s : null
                    },
                    setRequestHeader: function(e, t) {
                        var n = e.toLowerCase();
                        return x || (e = b[n] = b[n] || e, y[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return x || (p.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (2 > x)
                                for (t in e) v[t] = [v[t], e[t]];
                            else T.always(e[T.status]);
                        return this
                    },
                    abort: function(e) {
                        var t = e || w;
                        return i && i.abort(t), r(0, t), this
                    }
                };
            if (g.promise(T).complete = m.add, T.success = T.done, T.error = T.fail, p.url = ((e || p.url || oc) + "").replace(bn, "").replace(jc, pc[1] + "//"), p.type = t.method || t.type || p.method || p.type, p.dataTypes = n.trim(p.dataType || "*").toLowerCase().match(E) || [""], null == p.crossDomain && (c = kc.exec(p.url.toLowerCase()), p.crossDomain = !(!c || c[1] === pc[1] && c[2] === pc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (pc[3] || ("http:" === pc[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = n.param(p.data, p.traditional)), rc(lc, p, t, T), 2 === x) return T;
            l = n.event && p.global, l && 0 === n.active++ && n.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !ic.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (dc.test(o) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = fc.test(o) ? o.replace(fc, "$1_=" + bm++) : o + (dc.test(o) ? "&" : "?") + "_=" + bm++)), p.ifModified && (n.lastModified[o] && T.setRequestHeader("If-Modified-Since", n.lastModified[o]), n.etag[o] && T.setRequestHeader("If-None-Match", n.etag[o])), (p.data && p.hasContent && p.contentType !== !1 || t.contentType) && T.setRequestHeader("Content-Type", p.contentType), T.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + nc + "; q=0.01" : "") : p.accepts["*"]);
            for (f in p.headers) T.setRequestHeader(f, p.headers[f]);
            if (p.beforeSend && (p.beforeSend.call(d, T, p) === !1 || 2 === x)) return T.abort();
            w = "abort";
            for (f in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) T[f](p[f]);
            if (i = rc(mc, p, t, T)) {
                T.readyState = 1, l && h.trigger("ajaxSend", [T, p]), p.async && p.timeout > 0 && (u = setTimeout(function() {
                    T.abort("timeout")
                }, p.timeout));
                try {
                    x = 1, i.send(y, r)
                } catch (C) {
                    if (!(2 > x)) throw C;
                    r(-1, C)
                }
            } else r(-1, "No Transport");
            return T
        },
        getJSON: function(e, t, r) {
            return n.get(e, t, r, "json")
        },
        getScript: function(e, t) {
            return n.get(e, void 0, t, "script")
        }
    }), n.each(["get", "post"], function(e, t) {
        n[t] = function(e, r, i, o) {
            return n.isFunction(r) && (o = o || i, i = r, r = void 0), n.ajax({
                url: e,
                type: t,
                dataType: o,
                data: r,
                success: i
            })
        }
    }), n._evalUrl = function(e) {
        return n.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            async: !1,
            global: !1,
            "throws": !0
        })
    }, n.fn.extend({
        wrapAll: function(e) {
            var t;
            return n.isFunction(e) ? this.each(function(t) {
                n(this).wrapAll(e.call(this, t))
            }) : (this[0] && (t = n(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                return e
            }).append(this)), this)
        },
        wrapInner: function(e) {
            return this.each(n.isFunction(e) ? function(t) {
                n(this).wrapInner(e.call(this, t))
            } : function() {
                var t = n(this),
                    r = t.contents();
                r.length ? r.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = n.isFunction(e);
            return this.each(function(r) {
                n(this).wrapAll(t ? e.call(this, r) : e)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
            }).end()
        }
    }), n.expr.filters.hidden = function(e) {
        return e.offsetWidth <= 0 && e.offsetHeight <= 0
    }, n.expr.filters.visible = function(e) {
        return !n.expr.filters.hidden(e)
    };
    var bo = /%20/g,
        wc = /\[\]$/,
        xc = /\r?\n/g,
        yc = /^(?:submit|button|image|reset|file)$/i,
        zc = /^(?:input|select|textarea|keygen)/i;
    n.param = function(e, t) {
        var r, i = [],
            o = function(e, t) {
                t = n.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
            };
        if (void 0 === t && (t = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(e) || e.jquery && !n.isPlainObject(e)) n.each(e, function() {
            o(this.name, this.value)
        });
        else
            for (r in e) Ac(r, e[r], t, o);
        return i.join("&").replace(bo, "+")
    }, n.fn.extend({
        serialize: function() {
            return n.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = n.prop(this, "elements");
                return e ? n.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !n(this).is(":disabled") && zc.test(this.nodeName) && !yc.test(e) && (this.checked || !T.test(e))
            }).map(function(e, t) {
                var r = n(this).val();
                return null == r ? null : n.isArray(r) ? n.map(r, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(xc, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: r.replace(xc, "\r\n")
                }
            }).get()
        }
    }), n.ajaxSettings.xhr = function() {
        try {
            return new XMLHttpRequest
        } catch (e) {}
    };
    var bp = 0,
        Cc = {},
        Dc = {
            0: 200,
            1223: 204
        },
        Ec = n.ajaxSettings.xhr();
    a.attachEvent && a.attachEvent("onunload", function() {
        for (var e in Cc) Cc[e]()
    }), k.cors = !!Ec && "withCredentials" in Ec, k.ajax = Ec = !!Ec, n.ajaxTransport(function(e) {
        var t;
        return k.cors || Ec && !e.crossDomain ? {
            send: function(n, r) {
                var i, o = e.xhr(),
                    s = ++bp;
                if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                    for (i in e.xhrFields) o[i] = e.xhrFields[i];
                e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                for (i in n) o.setRequestHeader(i, n[i]);
                t = function(e) {
                    return function() {
                        t && (delete Cc[s], t = o.onload = o.onerror = null, "abort" === e ? o.abort() : "error" === e ? r(o.status, o.statusText) : r(Dc[o.status] || o.status, o.statusText, "string" == typeof o.responseText ? {
                            text: o.responseText
                        } : void 0, o.getAllResponseHeaders()))
                    }
                }, o.onload = t(), o.onerror = t("error"), t = Cc[s] = t("abort");
                try {
                    o.send(e.hasContent && e.data || null)
                } catch (a) {
                    if (t) throw a
                }
            },
            abort: function() {
                t && t()
            }
        } : void 0
    }), n.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(e) {
                return n.globalEval(e), e
            }
        }
    }), n.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), n.ajaxTransport("script", function(e) {
        if (e.crossDomain) {
            var t, r;
            return {
                send: function(i, o) {
                    t = n("<script>").prop({
                        async: !0,
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", r = function(e) {
                        t.remove(), r = null, e && o("error" === e.type ? 404 : 200, e.type)
                    }), l.head.appendChild(t[0])
                },
                abort: function() {
                    r && r()
                }
            }
        }
    });
    var bq = [],
        Gc = /(=)\?(?=&|$)|\?\?/;
    n.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = bq.pop() || n.expando + "_" + bm++;
            return this[e] = !0, e
        }
    }), n.ajaxPrefilter("json jsonp", function(e, t, r) {
        var i, o, s, u = e.jsonp !== !1 && (Gc.test(e.url) ? "url" : "string" == typeof e.data && !(e.contentType || "").indexOf("application/x-www-form-urlencoded") && Gc.test(e.data) && "data");
        return u || "jsonp" === e.dataTypes[0] ? (i = e.jsonpCallback = n.isFunction(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, u ? e[u] = e[u].replace(Gc, "$1" + i) : e.jsonp !== !1 && (e.url += (dc.test(e.url) ? "&" : "?") + e.jsonp + "=" + i), e.converters["script json"] = function() {
            return s || n.error(i + " was not called"), s[0]
        }, e.dataTypes[0] = "json", o = a[i], a[i] = function() {
            s = arguments
        }, r.always(function() {
            a[i] = o, e[i] && (e.jsonpCallback = t.jsonpCallback, bq.push(i)), s && n.isFunction(o) && o(s[0]), s = o = void 0
        }), "script") : void 0
    }), n.parseHTML = function(e, t, r) {
        if (!e || "string" != typeof e) return null;
        "boolean" == typeof t && (r = t, t = !1), t = t || l;
        var i = v.exec(e),
            o = !r && [];
        return i ? [t.createElement(i[1])] : (i = n.buildFragment([e], t, o), o && o.length && n(o).remove(), n.merge([], i.childNodes))
    };
    var br = n.fn.load;
    n.fn.load = function(e, t, r) {
        if ("string" != typeof e && br) return br.apply(this, arguments);
        var i, o, s, a = this,
            u = e.indexOf(" ");
        return u >= 0 && (i = n.trim(e.slice(u)), e = e.slice(0, u)), n.isFunction(t) ? (r = t, t = void 0) : t && "object" == typeof t && (o = "POST"), a.length > 0 && n.ajax({
            url: e,
            type: o,
            dataType: "html",
            data: t
        }).done(function(e) {
            s = arguments, a.html(i ? n("<div>").append(n.parseHTML(e)).find(i) : e)
        }).complete(r && function(e, t) {
            a.each(r, s || [e.responseText, t, e])
        }), this
    }, n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        n.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), n.expr.filters.animated = function(e) {
        return n.grep(n.timers, function(t) {
            return e === t.elem
        }).length
    };
    var bs = a.document.documentElement;
    n.offset = {
        setOffset: function(e, t, r) {
            var i, o, s, a, u, c, l, f = n.css(e, "position"),
                p = n(e),
                d = {};
            "static" === f && (e.style.position = "relative"), u = p.offset(), s = n.css(e, "top"), c = n.css(e, "left"), l = ("absolute" === f || "fixed" === f) && (s + c).indexOf("auto") > -1, l ? (i = p.position(), a = i.top, o = i.left) : (a = parseFloat(s) || 0, o = parseFloat(c) || 0), n.isFunction(t) && (t = t.call(e, r, u)), null != t.top && (d.top = t.top - u.top + a), null != t.left && (d.left = t.left - u.left + o), "using" in t ? t.using.call(e, d) : p.css(d)
        }
    }, n.fn.extend({
        offset: function(e) {
            if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                n.offset.setOffset(this, e, t)
            });
            var t, r, i = this[0],
                o = {
                    top: 0,
                    left: 0
                },
                s = i && i.ownerDocument;
            return s ? (t = s.documentElement, n.contains(t, i) ? (typeof i.getBoundingClientRect !== U && (o = i.getBoundingClientRect()), r = Jc(s), {
                top: o.top + r.pageYOffset - t.clientTop,
                left: o.left + r.pageXOffset - t.clientLeft
            }) : o) : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, r = this[0],
                    i = {
                        top: 0,
                        left: 0
                    };
                return "fixed" === n.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), n.nodeName(e[0], "html") || (i = e.offset()), i.top += n.css(e[0], "borderTopWidth", !0), i.left += n.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - i.top - n.css(r, "marginTop", !0),
                    left: t.left - i.left - n.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent || bs; e && !n.nodeName(e, "html") && "static" === n.css(e, "position");) e = e.offsetParent;
                return e || bs
            })
        }
    }), n.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var r = "pageYOffset" === t;
        n.fn[e] = function(n) {
            return J(this, function(e, n, i) {
                var o = Jc(e);
                return void 0 === i ? o ? o[t] : e[n] : void(o ? o.scrollTo(r ? a.pageXOffset : i, r ? i : a.pageYOffset) : e[n] = i)
            }, e, n, arguments.length, null)
        }
    }), n.each(["top", "left"], function(e, t) {
        n.cssHooks[t] = yb(k.pixelPosition, function(e, r) {
            return r ? (r = xb(e, t), vb.test(r) ? n(e).position()[t] + "px" : r) : void 0
        })
    }), n.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        n.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(r, i) {
            n.fn[i] = function(i, o) {
                var s = arguments.length && (r || "boolean" != typeof i),
                    a = r || (i === !0 || o === !0 ? "margin" : "border");
                return J(this, function(t, r, i) {
                    var o;
                    return n.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? n.css(t, r, a) : n.style(t, r, i, a)
                }, t, s ? i : void 0, s, null)
            }
        })
    }), n.fn.size = function() {
        return this.length
    }, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
        return n
    });
    var bt = a.jQuery,
        Lc = a.$;
    return n.noConflict = function(e) {
        return a.$ === n && (a.$ = Lc), e && a.jQuery === n && (a.jQuery = bt), n
    }, typeof b === U && (a.jQuery = a.$ = n), n
});
(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], function($) {
            return factory($)
        })
    } else if (typeof module === "object" && typeof module.exports === "object") {
        exports = factory(require("jquery"))
    } else {
        factory(jQuery)
    }
})(function($) {
    $.easing["jswing"] = $.easing["swing"];
    $.extend($.easing, {
        def: "easeOutQuad",
        swing: function(x, t, b, c, d) {
            return $.easing[$.easing.def](x, t, b, c, d)
        },
        easeInQuad: function(x, t, b, c, d) {
            return c * (t /= d) * t + b
        },
        easeOutQuad: function(x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b
        },
        easeInOutQuad: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * (--t * (t - 2) - 1) + b
        },
        easeInCubic: function(x, t, b, c, d) {
            return c * (t /= d) * t * t + b
        },
        easeOutCubic: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b
        },
        easeInOutCubic: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b
        },
        easeInQuart: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t + b
        },
        easeOutQuart: function(x, t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b
        },
        easeInOutQuart: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b
        },
        easeInQuint: function(x, t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b
        },
        easeOutQuint: function(x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b
        },
        easeInOutQuint: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
        },
        easeInSine: function(x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
        },
        easeOutSine: function(x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b
        },
        easeInOutSine: function(x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
        },
        easeInExpo: function(x, t, b, c, d) {
            return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
        },
        easeOutExpo: function(x, t, b, c, d) {
            return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
        },
        easeInOutExpo: function(x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
        },
        easeInCirc: function(x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
        },
        easeOutCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
        },
        easeInOutCirc: function(x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
        },
        easeInElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
        },
        easeOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (!p) p = d * .3;
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
        },
        easeInOutElastic: function(x, t, b, c, d) {
            var s = 1.70158;
            var p = 0;
            var a = c;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (!p) p = d * (.3 * 1.5);
            if (a < Math.abs(c)) {
                a = c;
                var s = p / 4
            } else var s = p / (2 * Math.PI) * Math.asin(c / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b
        },
        easeInBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b
        },
        easeOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
        },
        easeInOutBack: function(x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
        },
        easeInBounce: function(x, t, b, c, d) {
            return c - $.easing.easeOutBounce(x, d - t, 0, c, d) + b
        },
        easeOutBounce: function(x, t, b, c, d) {
            if ((t /= d) < 1 / 2.75) {
                return c * (7.5625 * t * t) + b
            } else if (t < 2 / 2.75) {
                return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b
            } else if (t < 2.5 / 2.75) {
                return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b
            } else {
                return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b
            }
        },
        easeInOutBounce: function(x, t, b, c, d) {
            if (t < d / 2) return $.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
            return $.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
        }
    })
});
if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery"); + function(a) {
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (b[0] < 2 && b[1] < 9 || 1 == b[0] && 9 == b[1] && b[2] < 1) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery), + function(a) {
    "use strict";

    function b() {
        var a = document.createElement("bootstrap"),
            b = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var c in b)
            if (void 0 !== a.style[c]) return {
                end: b[c]
            };
        return !1
    }
    a.fn.emulateTransitionEnd = function(b) {
        var c = !1,
            d = this;
        a(this).one("bsTransitionEnd", function() {
            c = !0
        });
        var e = function() {
            c || a(d).trigger(a.support.transition.end)
        };
        return setTimeout(e, b), this
    }, a(function() {
        a.support.transition = b(), a.support.transition && (a.event.special.bsTransitionEnd = {
            bindType: a.support.transition.end,
            delegateType: a.support.transition.end,
            handle: function(b) {
                return a(b.target).is(this) ? b.handleObj.handler.apply(this, arguments) : void 0
            }
        })
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var c = a(this),
                e = c.data("bs.alert");
            e || c.data("bs.alert", e = new d(this)), "string" == typeof b && e[b].call(c)
        })
    }
    var c = '[data-dismiss="alert"]',
        d = function(b) {
            a(b).on("click", c, this.close)
        };
    d.VERSION = "3.3.0", d.TRANSITION_DURATION = 150, d.prototype.close = function(b) {
        function c() {
            g.detach().trigger("closed.bs.alert").remove()
        }
        var e = a(this),
            f = e.attr("data-target");
        f || (f = e.attr("href"), f = f && f.replace(/.*(?=#[^\s]*$)/, ""));
        var g = a(f);
        b && b.preventDefault(), g.length || (g = e.closest(".alert")), g.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (g.removeClass("in"), a.support.transition && g.hasClass("fade") ? g.one("bsTransitionEnd", c).emulateTransitionEnd(d.TRANSITION_DURATION) : c())
    };
    var e = a.fn.alert;
    a.fn.alert = b, a.fn.alert.Constructor = d, a.fn.alert.noConflict = function() {
        return a.fn.alert = e, this
    }, a(document).on("click.bs.alert.data-api", c, d.prototype.close)
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.button"),
                f = "object" == typeof b && b;
            e || d.data("bs.button", e = new c(this, f)), "toggle" == b ? e.toggle() : b && e.setState(b)
        })
    }
    var c = function(b, d) {
        this.$element = a(b), this.options = a.extend({}, c.DEFAULTS, d), this.isLoading = !1
    };
    c.VERSION = "3.3.0", c.DEFAULTS = {
        loadingText: "loading..."
    }, c.prototype.setState = function(b) {
        var c = "disabled",
            d = this.$element,
            e = d.is("input") ? "val" : "html",
            f = d.data();
        b += "Text", null == f.resetText && d.data("resetText", d[e]()), setTimeout(a.proxy(function() {
            d[e](null == f[b] ? this.options[b] : f[b]), "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c))
        }, this), 0)
    }, c.prototype.toggle = function() {
        var a = !0,
            b = this.$element.closest('[data-toggle="buttons"]');
        if (b.length) {
            var c = this.$element.find("input");
            "radio" == c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? a = !1 : b.find(".active").removeClass("active")), a && c.prop("checked", !this.$element.hasClass("active")).trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
        a && this.$element.toggleClass("active")
    };
    var d = a.fn.button;
    a.fn.button = b, a.fn.button.Constructor = c, a.fn.button.noConflict = function() {
        return a.fn.button = d, this
    }, a(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(c) {
        var d = a(c.target);
        d.hasClass("btn") || (d = d.closest(".btn")), b.call(d, "toggle"), c.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function(b) {
        a(b.target).closest(".btn").toggleClass("focus", "focus" == b.type)
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.carousel"),
                f = a.extend({}, c.DEFAULTS, d.data(), "object" == typeof b && b),
                g = "string" == typeof b ? b : f.slide;
            e || d.data("bs.carousel", e = new c(this, f)), "number" == typeof b ? e.to(b) : g ? e[g]() : f.interval && e.pause().cycle()
        })
    }
    var c = function(b, c) {
        this.$element = a(b), this.$indicators = this.$element.find(".carousel-indicators"), this.options = c, this.paused = this.sliding = this.interval = this.$active = this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", a.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", a.proxy(this.pause, this)).on("mouseleave.bs.carousel", a.proxy(this.cycle, this))
    };
    c.VERSION = "3.3.0", c.TRANSITION_DURATION = 600, c.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    }, c.prototype.keydown = function(a) {
        switch (a.which) {
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
            default:
                return
        }
        a.preventDefault()
    }, c.prototype.cycle = function(b) {
        return b || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(a.proxy(this.next, this), this.options.interval)), this
    }, c.prototype.getItemIndex = function(a) {
        return this.$items = a.parent().children(".item"), this.$items.index(a || this.$active)
    }, c.prototype.getItemForDirection = function(a, b) {
        var c = "prev" == a ? -1 : 1,
            d = this.getItemIndex(b),
            e = (d + c) % this.$items.length;
        return this.$items.eq(e)
    }, c.prototype.to = function(a) {
        var b = this,
            c = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return a > this.$items.length - 1 || 0 > a ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function() {
            b.to(a)
        }) : c == a ? this.pause().cycle() : this.slide(a > c ? "next" : "prev", this.$items.eq(a))
    }, c.prototype.pause = function(b) {
        return b || (this.paused = !0), this.$element.find(".next, .prev").length && a.support.transition && (this.$element.trigger(a.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, c.prototype.next = function() {
        return this.sliding ? void 0 : this.slide("next")
    }, c.prototype.prev = function() {
        return this.sliding ? void 0 : this.slide("prev")
    }, c.prototype.slide = function(b, d) {
        var e = this.$element.find(".item.active"),
            f = d || this.getItemForDirection(b, e),
            g = this.interval,
            h = "next" == b ? "left" : "right",
            i = "next" == b ? "first" : "last",
            j = this;
        if (!f.length) {
            if (!this.options.wrap) return;
            f = this.$element.find(".item")[i]()
        }
        if (f.hasClass("active")) return this.sliding = !1;
        var k = f[0],
            l = a.Event("slide.bs.carousel", {
                relatedTarget: k,
                direction: h
            });
        if (this.$element.trigger(l), !l.isDefaultPrevented()) {
            if (this.sliding = !0, g && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var m = a(this.$indicators.children()[this.getItemIndex(f)]);
                m && m.addClass("active")
            }
            var n = a.Event("slid.bs.carousel", {
                relatedTarget: k,
                direction: h
            });
            return a.support.transition && this.$element.hasClass("slide") ? (f.addClass(b), f[0].offsetWidth, e.addClass(h), f.addClass(h), e.one("bsTransitionEnd", function() {
                f.removeClass([b, h].join(" ")).addClass("active"), e.removeClass(["active", h].join(" ")), j.sliding = !1, setTimeout(function() {
                    j.$element.trigger(n)
                }, 0)
            }).emulateTransitionEnd(c.TRANSITION_DURATION)) : (e.removeClass("active"), f.addClass("active"), this.sliding = !1, this.$element.trigger(n)), g && this.cycle(), this
        }
    };
    var d = a.fn.carousel;
    a.fn.carousel = b, a.fn.carousel.Constructor = c, a.fn.carousel.noConflict = function() {
        return a.fn.carousel = d, this
    };
    var e = function(c) {
        var d, e = a(this),
            f = a(e.attr("data-target") || (d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""));
        if (f.hasClass("carousel")) {
            var g = a.extend({}, f.data(), e.data()),
                h = e.attr("data-slide-to");
            h && (g.interval = !1), b.call(f, g), h && f.data("bs.carousel").to(h), c.preventDefault()
        }
    };
    a(document).on("click.bs.carousel.data-api", "[data-slide]", e).on("click.bs.carousel.data-api", "[data-slide-to]", e), a(window).on("load", function() {
        a('[data-ride="carousel"]').each(function() {
            var c = a(this);
            b.call(c, c.data())
        })
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        var c, d = b.attr("data-target") || (c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, "");
        return a(d)
    }

    function c(b) {
        return this.each(function() {
            var c = a(this),
                e = c.data("bs.collapse"),
                f = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b);
            !e && f.toggle && "show" == b && (f.toggle = !1), e || c.data("bs.collapse", e = new d(this, f)), "string" == typeof b && e[b]()
        })
    }
    var d = function(b, c) {
        this.$element = a(b), this.options = a.extend({}, d.DEFAULTS, c), this.$trigger = a(this.options.trigger).filter('[href="#' + b.id + '"], [data-target="#' + b.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    d.VERSION = "3.3.0", d.TRANSITION_DURATION = 350, d.DEFAULTS = {
        toggle: !0,
        trigger: '[data-toggle="collapse"]'
    }, d.prototype.dimension = function() {
        var a = this.$element.hasClass("width");
        return a ? "width" : "height"
    }, d.prototype.show = function() {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var b, e = this.$parent && this.$parent.find("> .panel").children(".in, .collapsing");
            if (!(e && e.length && (b = e.data("bs.collapse"), b && b.transitioning))) {
                var f = a.Event("show.bs.collapse");
                if (this.$element.trigger(f), !f.isDefaultPrevented()) {
                    e && e.length && (c.call(e, "hide"), b || e.data("bs.collapse", null));
                    var g = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var h = function() {
                        this.$element.removeClass("collapsing").addClass("collapse in")[g](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!a.support.transition) return h.call(this);
                    var i = a.camelCase(["scroll", g].join("-"));
                    this.$element.one("bsTransitionEnd", a.proxy(h, this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])
                }
            }
        }
    }, d.prototype.hide = function() {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var b = a.Event("hide.bs.collapse");
            if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                var c = this.dimension();
                this.$element[c](this.$element[c]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var e = function() {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return a.support.transition ? void this.$element[c](0).one("bsTransitionEnd", a.proxy(e, this)).emulateTransitionEnd(d.TRANSITION_DURATION) : e.call(this)
            }
        }
    }, d.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, d.prototype.getParent = function() {
        return a(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(a.proxy(function(c, d) {
            var e = a(d);
            this.addAriaAndCollapsedClass(b(e), e)
        }, this)).end()
    }, d.prototype.addAriaAndCollapsedClass = function(a, b) {
        var c = a.hasClass("in");
        a.attr("aria-expanded", c), b.toggleClass("collapsed", !c).attr("aria-expanded", c)
    };
    var e = a.fn.collapse;
    a.fn.collapse = c, a.fn.collapse.Constructor = d, a.fn.collapse.noConflict = function() {
        return a.fn.collapse = e, this
    }, a(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(d) {
        var e = a(this);
        e.attr("data-target") || d.preventDefault();
        var f = b(e),
            g = f.data("bs.collapse"),
            h = g ? "toggle" : a.extend({}, e.data(), {
                trigger: this
            });
        c.call(f, h)
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        b && 3 === b.which || (a(e).remove(), a(f).each(function() {
            var d = a(this),
                e = c(d),
                f = {
                    relatedTarget: this
                };
            e.hasClass("open") && (e.trigger(b = a.Event("hide.bs.dropdown", f)), b.isDefaultPrevented() || (d.attr("aria-expanded", "false"), e.removeClass("open").trigger("hidden.bs.dropdown", f)))
        }))
    }

    function c(b) {
        var c = b.attr("data-target");
        c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, ""));
        var d = c && a(c);
        return d && d.length ? d : b.parent()
    }

    function d(b) {
        return this.each(function() {
            var c = a(this),
                d = c.data("bs.dropdown");
            d || c.data("bs.dropdown", d = new g(this)), "string" == typeof b && d[b].call(c)
        })
    }
    var e = ".dropdown-backdrop",
        f = '[data-toggle="dropdown"]',
        g = function(b) {
            a(b).on("click.bs.dropdown", this.toggle)
        };
    g.VERSION = "3.3.0", g.prototype.toggle = function(d) {
        var e = a(this);
        if (!e.is(".disabled, :disabled")) {
            var f = c(e),
                g = f.hasClass("open");
            if (b(), !g) {
                "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b);
                var h = {
                    relatedTarget: this
                };
                if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return;
                e.trigger("focus").attr("aria-expanded", "true"), f.toggleClass("open").trigger("shown.bs.dropdown", h)
            }
            return !1
        }
    }, g.prototype.keydown = function(b) {
        if (/(38|40|27|32)/.test(b.which)) {
            var d = a(this);
            if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) {
                var e = c(d),
                    g = e.hasClass("open");
                if (!g && 27 != b.which || g && 27 == b.which) return 27 == b.which && e.find(f).trigger("focus"), d.trigger("click");
                var h = " li:not(.divider):visible a",
                    i = e.find('[role="menu"]' + h + ', [role="listbox"]' + h);
                if (i.length) {
                    var j = i.index(b.target);
                    38 == b.which && j > 0 && j--, 40 == b.which && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).trigger("focus")
                }
            }
        }
    };
    var h = a.fn.dropdown;
    a.fn.dropdown = d, a.fn.dropdown.Constructor = g, a.fn.dropdown.noConflict = function() {
        return a.fn.dropdown = h, this
    }, a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form", function(a) {
        a.stopPropagation()
    }).on("click.bs.dropdown.data-api", f, g.prototype.toggle).on("keydown.bs.dropdown.data-api", f, g.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="menu"]', g.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="listbox"]', g.prototype.keydown)
}(jQuery), + function(a) {
    "use strict";

    function b(b, d) {
        return this.each(function() {
            var e = a(this),
                f = e.data("bs.modal"),
                g = a.extend({}, c.DEFAULTS, e.data(), "object" == typeof b && b);
            f || e.data("bs.modal", f = new c(this, g)), "string" == typeof b ? f[b](d) : g.show && f.show(d)
        })
    }
    var c = function(b, c) {
        this.options = c, this.$body = a(document.body), this.$element = a(b), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, a.proxy(function() {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    c.VERSION = "3.3.0", c.TRANSITION_DURATION = 300, c.BACKDROP_TRANSITION_DURATION = 150, c.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, c.prototype.toggle = function(a) {
        return this.isShown ? this.hide() : this.show(a)
    }, c.prototype.show = function(b) {
        var d = this,
            e = a.Event("show.bs.modal", {
                relatedTarget: b
            });
        this.$element.trigger(e), this.isShown || e.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.$body.addClass("modal-open"), this.setScrollbar(), this.escape(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', a.proxy(this.hide, this)), this.backdrop(function() {
            var e = a.support.transition && d.$element.hasClass("fade");
            d.$element.parent().length || d.$element.appendTo(d.$body), d.$element.show().scrollTop(0), e && d.$element[0].offsetWidth, d.$element.addClass("in").attr("aria-hidden", !1), d.enforceFocus();
            var f = a.Event("shown.bs.modal", {
                relatedTarget: b
            });
            e ? d.$element.find(".modal-dialog").one("bsTransitionEnd", function() {
                d.$element.trigger("focus").trigger(f)
            }).emulateTransitionEnd(c.TRANSITION_DURATION) : d.$element.trigger("focus").trigger(f)
        }))
    }, c.prototype.hide = function(b) {
        b && b.preventDefault(), b = a.Event("hide.bs.modal"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), a(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), a.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", a.proxy(this.hideModal, this)).emulateTransitionEnd(c.TRANSITION_DURATION) : this.hideModal())
    }, c.prototype.enforceFocus = function() {
        a(document).off("focusin.bs.modal").on("focusin.bs.modal", a.proxy(function(a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.trigger("focus")
        }, this))
    }, c.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", a.proxy(function(a) {
            27 == a.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, c.prototype.hideModal = function() {
        var a = this;
        this.$element.hide(), this.backdrop(function() {
            a.$body.removeClass("modal-open"), a.resetScrollbar(), a.$element.trigger("hidden.bs.modal")
        })
    }, c.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, c.prototype.backdrop = function(b) {
        var d = this,
            e = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var f = a.support.transition && e;
            if (this.$backdrop = a('<div class="modal-backdrop ' + e + '" />').prependTo(this.$element).on("click.dismiss.bs.modal", a.proxy(function(a) {
                    a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
                }, this)), f && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !b) return;
            f ? this.$backdrop.one("bsTransitionEnd", b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : b()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var g = function() {
                d.removeBackdrop(), b && b()
            };
            a.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION) : g()
        } else b && b()
    }, c.prototype.checkScrollbar = function() {
        this.scrollbarWidth = this.measureScrollbar()
    }, c.prototype.setScrollbar = function() {
        var a = parseInt(this.$body.css("padding-right") || 0, 10);
        this.scrollbarWidth && this.$body.css("padding-right", a + this.scrollbarWidth)
    }, c.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", "")
    }, c.prototype.measureScrollbar = function() {
        if (document.body.clientWidth >= window.innerWidth) return 0;
        var a = document.createElement("div");
        a.className = "modal-scrollbar-measure", this.$body.append(a);
        var b = a.offsetWidth - a.clientWidth;
        return this.$body[0].removeChild(a), b
    };
    var d = a.fn.modal;
    a.fn.modal = b, a.fn.modal.Constructor = c, a.fn.modal.noConflict = function() {
        return a.fn.modal = d, this
    }, a(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(c) {
        var d = a(this),
            e = d.attr("href"),
            f = a(d.attr("data-target") || e && e.replace(/.*(?=#[^\s]+$)/, "")),
            g = f.data("bs.modal") ? "toggle" : a.extend({
                remote: !/#/.test(e) && e
            }, f.data(), d.data());
        d.is("a") && c.preventDefault(), f.one("show.bs.modal", function(a) {
            a.isDefaultPrevented() || f.one("hidden.bs.modal", function() {
                d.is(":visible") && d.trigger("focus")
            })
        }), b.call(f, g, this)
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.tooltip"),
                f = "object" == typeof b && b,
                g = f && f.selector;
            (e || "destroy" != b) && (g ? (e || d.data("bs.tooltip", e = {}), e[g] || (e[g] = new c(this, f))) : e || d.data("bs.tooltip", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", a, b)
    };
    c.VERSION = "3.3.0", c.TRANSITION_DURATION = 150, c.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    }, c.prototype.init = function(b, c, d) {
        this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d), this.$viewport = this.options.viewport && a(this.options.viewport.selector || this.options.viewport);
        for (var e = this.options.trigger.split(" "), f = e.length; f--;) {
            var g = e[f];
            if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this));
            else if ("manual" != g) {
                var h = "hover" == g ? "mouseenter" : "focusin",
                    i = "hover" == g ? "mouseleave" : "focusout";
                this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = a.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }, c.prototype.getOptions = function(b) {
        return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = {
            show: b.delay,
            hide: b.delay
        }), b
    }, c.prototype.getDelegateOptions = function() {
        var b = {},
            c = this.getDefaults();
        return this._options && a.each(this._options, function(a, d) {
            c[a] != d && (b[a] = d)
        }), b
    }, c.prototype.enter = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c && c.$tip && c.$tip.is(":visible") ? void(c.hoverState = "in") : (c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void(c.timeout = setTimeout(function() {
            "in" == c.hoverState && c.show()
        }, c.options.delay.show)) : c.show())
    }, c.prototype.leave = function(b) {
        var c = b instanceof this.constructor ? b : a(b.currentTarget).data("bs." + this.type);
        return c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c)), clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void(c.timeout = setTimeout(function() {
            "out" == c.hoverState && c.hide()
        }, c.options.delay.hide)) : c.hide()
    }, c.prototype.show = function() {
        var b = a.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(b);
            var d = a.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (b.isDefaultPrevented() || !d) return;
            var e = this,
                f = this.tip(),
                g = this.getUID(this.type);
            this.setContent(), f.attr("id", g), this.$element.attr("aria-describedby", g), this.options.animation && f.addClass("fade");
            var h = "function" == typeof this.options.placement ? this.options.placement.call(this, f[0], this.$element[0]) : this.options.placement,
                i = /\s?auto?\s?/i,
                j = i.test(h);
            j && (h = h.replace(i, "") || "top"), f.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(h).data("bs." + this.type, this), this.options.container ? f.appendTo(this.options.container) : f.insertAfter(this.$element);
            var k = this.getPosition(),
                l = f[0].offsetWidth,
                m = f[0].offsetHeight;
            if (j) {
                var n = h,
                    o = this.options.container ? a(this.options.container) : this.$element.parent(),
                    p = this.getPosition(o);
                h = "bottom" == h && k.bottom + m > p.bottom ? "top" : "top" == h && k.top - m < p.top ? "bottom" : "right" == h && k.right + l > p.width ? "left" : "left" == h && k.left - l < p.left ? "right" : h, f.removeClass(n).addClass(h)
            }
            var q = this.getCalculatedOffset(h, k, l, m);
            this.applyPlacement(q, h);
            var r = function() {
                var a = e.hoverState;
                e.$element.trigger("shown.bs." + e.type), e.hoverState = null, "out" == a && e.leave(e)
            };
            a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", r).emulateTransitionEnd(c.TRANSITION_DURATION) : r()
        }
    }, c.prototype.applyPlacement = function(b, c) {
        var d = this.tip(),
            e = d[0].offsetWidth,
            f = d[0].offsetHeight,
            g = parseInt(d.css("margin-top"), 10),
            h = parseInt(d.css("margin-left"), 10);
        isNaN(g) && (g = 0), isNaN(h) && (h = 0), b.top = b.top + g, b.left = b.left + h, a.offset.setOffset(d[0], a.extend({
            using: function(a) {
                d.css({
                    top: Math.round(a.top),
                    left: Math.round(a.left)
                })
            }
        }, b), 0), d.addClass("in");
        var i = d[0].offsetWidth,
            j = d[0].offsetHeight;
        "top" == c && j != f && (b.top = b.top + f - j);
        var k = this.getViewportAdjustedDelta(c, b, i, j);
        k.left ? b.left += k.left : b.top += k.top;
        var l = /top|bottom/.test(c),
            m = l ? 2 * k.left - e + i : 2 * k.top - f + j,
            n = l ? "offsetWidth" : "offsetHeight";
        d.offset(b), this.replaceArrow(m, d[0][n], l)
    }, c.prototype.replaceArrow = function(a, b, c) {
        this.arrow().css(c ? "left" : "top", 50 * (1 - a / b) + "%").css(c ? "top" : "left", "")
    }, c.prototype.setContent = function() {
        var a = this.tip(),
            b = this.getTitle();
        a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right")
    }, c.prototype.hide = function(b) {
        function d() {
            "in" != e.hoverState && f.detach(), e.$element.removeAttr("aria-describedby").trigger("hidden.bs." + e.type), b && b()
        }
        var e = this,
            f = this.tip(),
            g = a.Event("hide.bs." + this.type);
        return this.$element.trigger(g), g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", d).emulateTransitionEnd(c.TRANSITION_DURATION) : d(), this.hoverState = null, this)
    }, c.prototype.fixTitle = function() {
        var a = this.$element;
        (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "")
    }, c.prototype.hasContent = function() {
        return this.getTitle()
    }, c.prototype.getPosition = function(b) {
        b = b || this.$element;
        var c = b[0],
            d = "BODY" == c.tagName,
            e = c.getBoundingClientRect();
        null == e.width && (e = a.extend({}, e, {
            width: e.right - e.left,
            height: e.bottom - e.top
        }));
        var f = d ? {
                top: 0,
                left: 0
            } : b.offset(),
            g = {
                scroll: d ? document.documentElement.scrollTop || document.body.scrollTop : b.scrollTop()
            },
            h = d ? {
                width: a(window).width(),
                height: a(window).height()
            } : null;
        return a.extend({}, e, g, h, f)
    }, c.prototype.getCalculatedOffset = function(a, b, c, d) {
        return "bottom" == a ? {
            top: b.top + b.height,
            left: b.left + b.width / 2 - c / 2
        } : "top" == a ? {
            top: b.top - d,
            left: b.left + b.width / 2 - c / 2
        } : "left" == a ? {
            top: b.top + b.height / 2 - d / 2,
            left: b.left - c
        } : {
            top: b.top + b.height / 2 - d / 2,
            left: b.left + b.width
        }
    }, c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
        var e = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return e;
        var f = this.options.viewport && this.options.viewport.padding || 0,
            g = this.getPosition(this.$viewport);
        if (/right|left/.test(a)) {
            var h = b.top - f - g.scroll,
                i = b.top + f - g.scroll + d;
            h < g.top ? e.top = g.top - h : i > g.top + g.height && (e.top = g.top + g.height - i)
        } else {
            var j = b.left - f,
                k = b.left + f + c;
            j < g.left ? e.left = g.left - j : k > g.width && (e.left = g.left + g.width - k)
        }
        return e
    }, c.prototype.getTitle = function() {
        var a, b = this.$element,
            c = this.options;
        return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
    }, c.prototype.getUID = function(a) {
        do a += ~~(1e6 * Math.random()); while (document.getElementById(a));
        return a
    }, c.prototype.tip = function() {
        return this.$tip = this.$tip || a(this.options.template)
    }, c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, c.prototype.enable = function() {
        this.enabled = !0
    }, c.prototype.disable = function() {
        this.enabled = !1
    }, c.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    }, c.prototype.toggle = function(b) {
        var c = this;
        b && (c = a(b.currentTarget).data("bs." + this.type), c || (c = new this.constructor(b.currentTarget, this.getDelegateOptions()), a(b.currentTarget).data("bs." + this.type, c))), c.tip().hasClass("in") ? c.leave(c) : c.enter(c)
    }, c.prototype.destroy = function() {
        var a = this;
        clearTimeout(this.timeout), this.hide(function() {
            a.$element.off("." + a.type).removeData("bs." + a.type)
        })
    };
    var d = a.fn.tooltip;
    a.fn.tooltip = b, a.fn.tooltip.Constructor = c, a.fn.tooltip.noConflict = function() {
        return a.fn.tooltip = d, this
    }
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.popover"),
                f = "object" == typeof b && b,
                g = f && f.selector;
            (e || "destroy" != b) && (g ? (e || d.data("bs.popover", e = {}), e[g] || (e[g] = new c(this, f))) : e || d.data("bs.popover", e = new c(this, f)), "string" == typeof b && e[b]())
        })
    }
    var c = function(a, b) {
        this.init("popover", a, b)
    };
    if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
    c.VERSION = "3.3.0", c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), c.prototype.constructor = c, c.prototype.getDefaults = function() {
        return c.DEFAULTS
    }, c.prototype.setContent = function() {
        var a = this.tip(),
            b = this.getTitle(),
            c = this.getContent();
        a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide()
    }, c.prototype.hasContent = function() {
        return this.getTitle() || this.getContent()
    }, c.prototype.getContent = function() {
        var a = this.$element,
            b = this.options;
        return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content)
    }, c.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }, c.prototype.tip = function() {
        return this.$tip || (this.$tip = a(this.options.template)), this.$tip
    };
    var d = a.fn.popover;
    a.fn.popover = b, a.fn.popover.Constructor = c, a.fn.popover.noConflict = function() {
        return a.fn.popover = d, this
    }
}(jQuery), + function(a) {
    "use strict";

    function b(c, d) {
        var e = a.proxy(this.process, this);
        this.$body = a("body"), this.$scrollElement = a(a(c).is("body") ? window : c), this.options = a.extend({}, b.DEFAULTS, d), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", e), this.refresh(), this.process()
    }

    function c(c) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.scrollspy"),
                f = "object" == typeof c && c;
            e || d.data("bs.scrollspy", e = new b(this, f)), "string" == typeof c && e[c]()
        })
    }
    b.VERSION = "3.3.0", b.DEFAULTS = {
        offset: 10
    }, b.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, b.prototype.refresh = function() {
        var b = "offset",
            c = 0;
        a.isWindow(this.$scrollElement[0]) || (b = "position", c = this.$scrollElement.scrollTop()), this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight();
        var d = this;
        this.$body.find(this.selector).map(function() {
            var d = a(this),
                e = d.data("target") || d.attr("href"),
                f = /^#./.test(e) && a(e);
            return f && f.length && f.is(":visible") && [
                [f[b]().top + c, e]
            ] || null
        }).sort(function(a, b) {
            return a[0] - b[0]
        }).each(function() {
            d.offsets.push(this[0]), d.targets.push(this[1])
        })
    }, b.prototype.process = function() {
        var a, b = this.$scrollElement.scrollTop() + this.options.offset,
            c = this.getScrollHeight(),
            d = this.options.offset + c - this.$scrollElement.height(),
            e = this.offsets,
            f = this.targets,
            g = this.activeTarget;
        if (this.scrollHeight != c && this.refresh(), b >= d) return g != (a = f[f.length - 1]) && this.activate(a);
        if (g && b < e[0]) return this.activeTarget = null, this.clear();
        for (a = e.length; a--;) g != f[a] && b >= e[a] && (!e[a + 1] || b <= e[a + 1]) && this.activate(f[a])
    }, b.prototype.activate = function(b) {
        this.activeTarget = b, this.clear();
        var c = this.selector + '[data-target="' + b + '"],' + this.selector + '[href="' + b + '"]',
            d = a(c).parents("li").addClass("active");
        d.parent(".dropdown-menu").length && (d = d.closest("li.dropdown").addClass("active")), d.trigger("activate.bs.scrollspy")
    }, b.prototype.clear = function() {
        a(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var d = a.fn.scrollspy;
    a.fn.scrollspy = c, a.fn.scrollspy.Constructor = b, a.fn.scrollspy.noConflict = function() {
        return a.fn.scrollspy = d, this
    }, a(window).on("load.bs.scrollspy.data-api", function() {
        a('[data-spy="scroll"]').each(function() {
            var b = a(this);
            c.call(b, b.data())
        })
    })
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.tab");
            e || d.data("bs.tab", e = new c(this)), "string" == typeof b && e[b]()
        })
    }
    var c = function(b) {
        this.element = a(b)
    };
    c.VERSION = "3.3.0", c.TRANSITION_DURATION = 150, c.prototype.show = function() {
        var b = this.element,
            c = b.closest("ul:not(.dropdown-menu)"),
            d = b.data("target");
        if (d || (d = b.attr("href"), d = d && d.replace(/.*(?=#[^\s]*$)/, "")), !b.parent("li").hasClass("active")) {
            var e = c.find(".active:last a"),
                f = a.Event("hide.bs.tab", {
                    relatedTarget: b[0]
                }),
                g = a.Event("show.bs.tab", {
                    relatedTarget: e[0]
                });
            if (e.trigger(f), b.trigger(g), !g.isDefaultPrevented() && !f.isDefaultPrevented()) {
                var h = a(d);
                this.activate(b.closest("li"), c), this.activate(h, h.parent(), function() {
                    e.trigger({
                        type: "hidden.bs.tab",
                        relatedTarget: b[0]
                    }), b.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: e[0]
                    })
                })
            }
        }
    }, c.prototype.activate = function(b, d, e) {
        function f() {
            g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), h ? (b[0].offsetWidth, b.addClass("in")) : b.removeClass("fade"), b.parent(".dropdown-menu") && b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), e && e()
        }
        var g = d.find("> .active"),
            h = e && a.support.transition && (g.length && g.hasClass("fade") || !!d.find("> .fade").length);
        g.length && h ? g.one("bsTransitionEnd", f).emulateTransitionEnd(c.TRANSITION_DURATION) : f(), g.removeClass("in")
    };
    var d = a.fn.tab;
    a.fn.tab = b, a.fn.tab.Constructor = c, a.fn.tab.noConflict = function() {
        return a.fn.tab = d, this
    };
    var e = function(c) {
        c.preventDefault(), b.call(a(this), "show")
    };
    a(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', e).on("click.bs.tab.data-api", '[data-toggle="pill"]', e)
}(jQuery), + function(a) {
    "use strict";

    function b(b) {
        return this.each(function() {
            var d = a(this),
                e = d.data("bs.affix"),
                f = "object" == typeof b && b;
            e || d.data("bs.affix", e = new c(this, f)), "string" == typeof b && e[b]()
        })
    }
    var c = function(b, d) {
        this.options = a.extend({}, c.DEFAULTS, d), this.$target = a(this.options.target).on("scroll.bs.affix.data-api", a.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", a.proxy(this.checkPositionWithEventLoop, this)), this.$element = a(b), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition()
    };
    c.VERSION = "3.3.0", c.RESET = "affix affix-top affix-bottom", c.DEFAULTS = {
        offset: 0,
        target: window
    }, c.prototype.getState = function(a, b, c, d) {
        var e = this.$target.scrollTop(),
            f = this.$element.offset(),
            g = this.$target.height();
        if (null != c && "top" == this.affixed) return c > e ? "top" : !1;
        if ("bottom" == this.affixed) return null != c ? e + this.unpin <= f.top ? !1 : "bottom" : a - d >= e + g ? !1 : "bottom";
        var h = null == this.affixed,
            i = h ? e : f.top,
            j = h ? g : b;
        return null != c && c >= i ? "top" : null != d && i + j >= a - d ? "bottom" : !1
    }, c.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(c.RESET).addClass("affix");
        var a = this.$target.scrollTop(),
            b = this.$element.offset();
        return this.pinnedOffset = b.top - a
    }, c.prototype.checkPositionWithEventLoop = function() {
        setTimeout(a.proxy(this.checkPosition, this), 1)
    }, c.prototype.checkPosition = function() {
        if (this.$element.is(":visible")) {
            var b = this.$element.height(),
                d = this.options.offset,
                e = d.top,
                f = d.bottom,
                g = a("body").height();
            "object" != typeof d && (f = e = d), "function" == typeof e && (e = d.top(this.$element)), "function" == typeof f && (f = d.bottom(this.$element));
            var h = this.getState(g, b, e, f);
            if (this.affixed != h) {
                null != this.unpin && this.$element.css("top", "");
                var i = "affix" + (h ? "-" + h : ""),
                    j = a.Event(i + ".bs.affix");
                if (this.$element.trigger(j), j.isDefaultPrevented()) return;
                this.affixed = h, this.unpin = "bottom" == h ? this.getPinnedOffset() : null, this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == h && this.$element.offset({
                top: g - b - f
            })
        }
    };
    var d = a.fn.affix;
    a.fn.affix = b, a.fn.affix.Constructor = c, a.fn.affix.noConflict = function() {
        return a.fn.affix = d, this
    }, a(window).on("load", function() {
        a('[data-spy="affix"]').each(function() {
            var c = a(this),
                d = c.data();
            d.offset = d.offset || {}, null != d.offsetBottom && (d.offset.bottom = d.offsetBottom), null != d.offsetTop && (d.offset.top = d.offsetTop), b.call(c, d)
        })
    })
}(jQuery);
(function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? e(require("jquery")) : e(window.jQuery || window.Zepto)
})(function(e) {
    var t, n, i, o, r, a, s, l = "Close",
        c = "BeforeClose",
        d = "AfterClose",
        u = "BeforeAppend",
        p = "MarkupParse",
        f = "Open",
        m = "Change",
        g = "mfp",
        h = "." + g,
        v = "mfp-ready",
        C = "mfp-removing",
        y = "mfp-prevent-close",
        w = function() {},
        b = !!window.jQuery,
        I = e(window),
        x = function(e, n) {
            t.ev.on(g + e + h, n)
        },
        k = function(t, n, i, o) {
            var r = document.createElement("div");
            return r.className = "mfp-" + t, i && (r.innerHTML = i), o ? n && n.appendChild(r) : (r = e(r), n && r.appendTo(n)), r
        },
        T = function(n, i) {
            t.ev.triggerHandler(g + n, i), t.st.callbacks && (n = n.charAt(0).toLowerCase() + n.slice(1), t.st.callbacks[n] && t.st.callbacks[n].apply(t, e.isArray(i) ? i : [i]))
        },
        E = function(n) {
            return n === s && t.currTemplate.closeBtn || (t.currTemplate.closeBtn = e(t.st.closeMarkup.replace("%title%", t.st.tClose)), s = n), t.currTemplate.closeBtn
        },
        _ = function() {
            e.magnificPopup.instance || (t = new w, t.init(), e.magnificPopup.instance = t)
        },
        S = function() {
            var e = document.createElement("p").style,
                t = ["ms", "O", "Moz", "Webkit"];
            if (void 0 !== e.transition) return !0;
            for (; t.length;)
                if (t.pop() + "Transition" in e) return !0;
            return !1
        };
    w.prototype = {
        constructor: w,
        init: function() {
            var n = navigator.appVersion;
            t.isIE7 = -1 !== n.indexOf("MSIE 7."), t.isIE8 = -1 !== n.indexOf("MSIE 8."), t.isLowIE = t.isIE7 || t.isIE8, t.isAndroid = /android/gi.test(n), t.isIOS = /iphone|ipad|ipod/gi.test(n), t.supportsTransition = S(), t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), o = e(document), t.popupsCache = {}
        },
        open: function(n) {
            i || (i = e(document.body));
            var r;
            if (n.isObj === !1) {
                t.items = n.items.toArray(), t.index = 0;
                var s, l = n.items;
                for (r = 0; l.length > r; r++)
                    if (s = l[r], s.parsed && (s = s.el[0]), s === n.el[0]) {
                        t.index = r;
                        break
                    }
            } else t.items = e.isArray(n.items) ? n.items : [n.items], t.index = n.index || 0;
            if (t.isOpen) return t.updateItemHTML(), void 0;
            t.types = [], a = "", t.ev = n.mainEl && n.mainEl.length ? n.mainEl.eq(0) : o, n.key ? (t.popupsCache[n.key] || (t.popupsCache[n.key] = {}), t.currTemplate = t.popupsCache[n.key]) : t.currTemplate = {}, t.st = e.extend(!0, {}, e.magnificPopup.defaults, n), t.fixedContentPos = "auto" === t.st.fixedContentPos ? !t.probablyMobile : t.st.fixedContentPos, t.st.modal && (t.st.closeOnContentClick = !1, t.st.closeOnBgClick = !1, t.st.showCloseBtn = !1, t.st.enableEscapeKey = !1), t.bgOverlay || (t.bgOverlay = k("bg").on("click" + h, function() {
                t.close()
            }), t.wrap = k("wrap").attr("tabindex", -1).on("click" + h, function(e) {
                t._checkIfClose(e.target) && t.close()
            }), t.container = k("container", t.wrap)), t.contentContainer = k("content"), t.st.preloader && (t.preloader = k("preloader", t.container, t.st.tLoading));
            var c = e.magnificPopup.modules;
            for (r = 0; c.length > r; r++) {
                var d = c[r];
                d = d.charAt(0).toUpperCase() + d.slice(1), t["init" + d].call(t)
            }
            T("BeforeOpen"), t.st.showCloseBtn && (t.st.closeBtnInside ? (x(p, function(e, t, n, i) {
                n.close_replaceWith = E(i.type)
            }), a += " mfp-close-btn-in") : t.wrap.append(E())), t.st.alignTop && (a += " mfp-align-top"), t.fixedContentPos ? t.wrap.css({
                overflow: t.st.overflowY,
                overflowX: "hidden",
                overflowY: t.st.overflowY
            }) : t.wrap.css({
                top: I.scrollTop(),
                position: "absolute"
            }), (t.st.fixedBgPos === !1 || "auto" === t.st.fixedBgPos && !t.fixedContentPos) && t.bgOverlay.css({
                height: o.height(),
                position: "absolute"
            }), t.st.enableEscapeKey && o.on("keyup" + h, function(e) {
                27 === e.keyCode && t.close()
            }), I.on("resize" + h, function() {
                t.updateSize()
            }), t.st.closeOnContentClick || (a += " mfp-auto-cursor"), a && t.wrap.addClass(a);
            var u = t.wH = I.height(),
                m = {};
            if (t.fixedContentPos && t._hasScrollBar(u)) {
                var g = t._getScrollbarSize();
                g && (m.marginRight = g)
            }
            t.fixedContentPos && (t.isIE7 ? e("body, html").css("overflow", "hidden") : m.overflow = "hidden");
            var C = t.st.mainClass;
            return t.isIE7 && (C += " mfp-ie7"), C && t._addClassToMFP(C), t.updateItemHTML(), T("BuildControls"), e("html").css(m), t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo || i), t._lastFocusedEl = document.activeElement, setTimeout(function() {
                t.content ? (t._addClassToMFP(v), t._setFocus()) : t.bgOverlay.addClass(v), o.on("focusin" + h, t._onFocusIn)
            }, 16), t.isOpen = !0, t.updateSize(u), T(f), n
        },
        close: function() {
            t.isOpen && (T(c), t.isOpen = !1, t.st.removalDelay && !t.isLowIE && t.supportsTransition ? (t._addClassToMFP(C), setTimeout(function() {
                t._close()
            }, t.st.removalDelay)) : t._close())
        },
        _close: function() {
            T(l);
            var n = C + " " + v + " ";
            if (t.bgOverlay.detach(), t.wrap.detach(), t.container.empty(), t.st.mainClass && (n += t.st.mainClass + " "), t._removeClassFromMFP(n), t.fixedContentPos) {
                var i = {
                    marginRight: ""
                };
                t.isIE7 ? e("body, html").css("overflow", "") : i.overflow = "", e("html").css(i)
            }
            o.off("keyup" + h + " focusin" + h), t.ev.off(h), t.wrap.attr("class", "mfp-wrap").removeAttr("style"), t.bgOverlay.attr("class", "mfp-bg"), t.container.attr("class", "mfp-container"), !t.st.showCloseBtn || t.st.closeBtnInside && t.currTemplate[t.currItem.type] !== !0 || t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach(), t._lastFocusedEl && e(t._lastFocusedEl).focus(), t.currItem = null, t.content = null, t.currTemplate = null, t.prevHeight = 0, T(d)
        },
        updateSize: function(e) {
            if (t.isIOS) {
                var n = document.documentElement.clientWidth / window.innerWidth,
                    i = window.innerHeight * n;
                t.wrap.css("height", i), t.wH = i
            } else t.wH = e || I.height();
            t.fixedContentPos || t.wrap.css("height", t.wH), T("Resize")
        },
        updateItemHTML: function() {
            var n = t.items[t.index];
            t.contentContainer.detach(), t.content && t.content.detach(), n.parsed || (n = t.parseEl(t.index));
            var i = n.type;
            if (T("BeforeChange", [t.currItem ? t.currItem.type : "", i]), t.currItem = n, !t.currTemplate[i]) {
                var o = t.st[i] ? t.st[i].markup : !1;
                T("FirstMarkupParse", o), t.currTemplate[i] = o ? e(o) : !0
            }
            r && r !== n.type && t.container.removeClass("mfp-" + r + "-holder");
            var a = t["get" + i.charAt(0).toUpperCase() + i.slice(1)](n, t.currTemplate[i]);
            t.appendContent(a, i), n.preloaded = !0, T(m, n), r = n.type, t.container.prepend(t.contentContainer), T("AfterChange")
        },
        appendContent: function(e, n) {
            t.content = e, e ? t.st.showCloseBtn && t.st.closeBtnInside && t.currTemplate[n] === !0 ? t.content.find(".mfp-close").length || t.content.append(E()) : t.content = e : t.content = "", T(u), t.container.addClass("mfp-" + n + "-holder"), t.contentContainer.append(t.content)
        },
        parseEl: function(n) {
            var i, o = t.items[n];
            if (o.tagName ? o = {
                    el: e(o)
                } : (i = o.type, o = {
                    data: o,
                    src: o.src
                }), o.el) {
                for (var r = t.types, a = 0; r.length > a; a++)
                    if (o.el.hasClass("mfp-" + r[a])) {
                        i = r[a];
                        break
                    }
                o.src = o.el.attr("data-mfp-src"), o.src || (o.src = o.el.attr("href"))
            }
            return o.type = i || t.st.type || "inline", o.index = n, o.parsed = !0, t.items[n] = o, T("ElementParse", o), t.items[n]
        },
        addGroup: function(e, n) {
            var i = function(i) {
                i.mfpEl = this, t._openClick(i, e, n)
            };
            n || (n = {});
            var o = "click.magnificPopup";
            n.mainEl = e, n.items ? (n.isObj = !0, e.off(o).on(o, i)) : (n.isObj = !1, n.delegate ? e.off(o).on(o, n.delegate, i) : (n.items = e, e.off(o).on(o, i)))
        },
        _openClick: function(n, i, o) {
            var r = void 0 !== o.midClick ? o.midClick : e.magnificPopup.defaults.midClick;
            if (r || 2 !== n.which && !n.ctrlKey && !n.metaKey) {
                var a = void 0 !== o.disableOn ? o.disableOn : e.magnificPopup.defaults.disableOn;
                if (a)
                    if (e.isFunction(a)) {
                        if (!a.call(t)) return !0
                    } else if (a > I.width()) return !0;
                n.type && (n.preventDefault(), t.isOpen && n.stopPropagation()), o.el = e(n.mfpEl), o.delegate && (o.items = i.find(o.delegate)), t.open(o)
            }
        },
        updateStatus: function(e, i) {
            if (t.preloader) {
                n !== e && t.container.removeClass("mfp-s-" + n), i || "loading" !== e || (i = t.st.tLoading);
                var o = {
                    status: e,
                    text: i
                };
                T("UpdateStatus", o), e = o.status, i = o.text, t.preloader.html(i), t.preloader.find("a").on("click", function(e) {
                    e.stopImmediatePropagation()
                }), t.container.addClass("mfp-s-" + e), n = e
            }
        },
        _checkIfClose: function(n) {
            if (!e(n).hasClass(y)) {
                var i = t.st.closeOnContentClick,
                    o = t.st.closeOnBgClick;
                if (i && o) return !0;
                if (!t.content || e(n).hasClass("mfp-close") || t.preloader && n === t.preloader[0]) return !0;
                if (n === t.content[0] || e.contains(t.content[0], n)) {
                    if (i) return !0
                } else if (o && e.contains(document, n)) return !0;
                return !1
            }
        },
        _addClassToMFP: function(e) {
            t.bgOverlay.addClass(e), t.wrap.addClass(e)
        },
        _removeClassFromMFP: function(e) {
            this.bgOverlay.removeClass(e), t.wrap.removeClass(e)
        },
        _hasScrollBar: function(e) {
            return (t.isIE7 ? o.height() : document.body.scrollHeight) > (e || I.height())
        },
        _setFocus: function() {
            (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus()
        },
        _onFocusIn: function(n) {
            return n.target === t.wrap[0] || e.contains(t.wrap[0], n.target) ? void 0 : (t._setFocus(), !1)
        },
        _parseMarkup: function(t, n, i) {
            var o;
            i.data && (n = e.extend(i.data, n)), T(p, [t, n, i]), e.each(n, function(e, n) {
                if (void 0 === n || n === !1) return !0;
                if (o = e.split("_"), o.length > 1) {
                    var i = t.find(h + "-" + o[0]);
                    if (i.length > 0) {
                        var r = o[1];
                        "replaceWith" === r ? i[0] !== n[0] && i.replaceWith(n) : "img" === r ? i.is("img") ? i.attr("src", n) : i.replaceWith('<img src="' + n + '" class="' + i.attr("class") + '" />') : i.attr(o[1], n)
                    }
                } else t.find(h + "-" + e).html(n)
            })
        },
        _getScrollbarSize: function() {
            if (void 0 === t.scrollbarSize) {
                var e = document.createElement("div");
                e.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(e), t.scrollbarSize = e.offsetWidth - e.clientWidth, document.body.removeChild(e)
            }
            return t.scrollbarSize
        }
    }, e.magnificPopup = {
        instance: null,
        proto: w.prototype,
        modules: [],
        open: function(t, n) {
            return _(), t = t ? e.extend(!0, {}, t) : {}, t.isObj = !0, t.index = n || 0, this.instance.open(t)
        },
        close: function() {
            return e.magnificPopup.instance && e.magnificPopup.instance.close()
        },
        registerModule: function(t, n) {
            n.options && (e.magnificPopup.defaults[t] = n.options), e.extend(this.proto, n.proto), this.modules.push(t)
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading..."
        }
    }, e.fn.magnificPopup = function(n) {
        _();
        var i = e(this);
        if ("string" == typeof n)
            if ("open" === n) {
                var o, r = b ? i.data("magnificPopup") : i[0].magnificPopup,
                    a = parseInt(arguments[1], 10) || 0;
                r.items ? o = r.items[a] : (o = i, r.delegate && (o = o.find(r.delegate)), o = o.eq(a)), t._openClick({
                    mfpEl: o
                }, i, r)
            } else t.isOpen && t[n].apply(t, Array.prototype.slice.call(arguments, 1));
        else n = e.extend(!0, {}, n), b ? i.data("magnificPopup", n) : i[0].magnificPopup = n, t.addGroup(i, n);
        return i
    };
    var P, O, z, M = "inline",
        B = function() {
            z && (O.after(z.addClass(P)).detach(), z = null)
        };
    e.magnificPopup.registerModule(M, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function() {
                t.types.push(M), x(l + "." + M, function() {
                    B()
                })
            },
            getInline: function(n, i) {
                if (B(), n.src) {
                    var o = t.st.inline,
                        r = e(n.src);
                    if (r.length) {
                        var a = r[0].parentNode;
                        a && a.tagName && (O || (P = o.hiddenClass, O = k(P), P = "mfp-" + P), z = r.after(O).detach().removeClass(P)), t.updateStatus("ready")
                    } else t.updateStatus("error", o.tNotFound), r = e("<div>");
                    return n.inlineElement = r, r
                }
                return t.updateStatus("ready"), t._parseMarkup(i, {}, n), i
            }
        }
    });
    var F, H = "ajax",
        L = function() {
            F && i.removeClass(F)
        },
        A = function() {
            L(), t.req && t.req.abort()
        };
    e.magnificPopup.registerModule(H, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function() {
                t.types.push(H), F = t.st.ajax.cursor, x(l + "." + H, A), x("BeforeChange." + H, A)
            },
            getAjax: function(n) {
                F && i.addClass(F), t.updateStatus("loading");
                var o = e.extend({
                    url: n.src,
                    success: function(i, o, r) {
                        var a = {
                            data: i,
                            xhr: r
                        };
                        T("ParseAjax", a), t.appendContent(e(a.data), H), n.finished = !0, L(), t._setFocus(), setTimeout(function() {
                            t.wrap.addClass(v)
                        }, 16), t.updateStatus("ready"), T("AjaxContentAdded")
                    },
                    error: function() {
                        L(), n.finished = n.loadError = !0, t.updateStatus("error", t.st.ajax.tError.replace("%url%", n.src))
                    }
                }, t.st.ajax.settings);
                return t.req = e.ajax(o), ""
            }
        }
    });
    var j, N = function(n) {
        if (n.data && void 0 !== n.data.title) return n.data.title;
        var i = t.st.image.titleSrc;
        if (i) {
            if (e.isFunction(i)) return i.call(t, n);
            if (n.el) return n.el.attr(i) || ""
        }
        return ""
    };
    e.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function() {
                var e = t.st.image,
                    n = ".image";
                t.types.push("image"), x(f + n, function() {
                    "image" === t.currItem.type && e.cursor && i.addClass(e.cursor)
                }), x(l + n, function() {
                    e.cursor && i.removeClass(e.cursor), I.off("resize" + h)
                }), x("Resize" + n, t.resizeImage), t.isLowIE && x("AfterChange", t.resizeImage)
            },
            resizeImage: function() {
                var e = t.currItem;
                if (e && e.img && t.st.image.verticalFit) {
                    var n = 0;
                    t.isLowIE && (n = parseInt(e.img.css("padding-top"), 10) + parseInt(e.img.css("padding-bottom"), 10)), e.img.css("max-height", t.wH - n)
                }
            },
            _onImageHasSize: function(e) {
                e.img && (e.hasSize = !0, j && clearInterval(j), e.isCheckingImgSize = !1, T("ImageHasSize", e), e.imgHidden && (t.content && t.content.removeClass("mfp-loading"), e.imgHidden = !1))
            },
            findImageSize: function(e) {
                var n = 0,
                    i = e.img[0],
                    o = function(r) {
                        j && clearInterval(j), j = setInterval(function() {
                            return i.naturalWidth > 0 ? (t._onImageHasSize(e), void 0) : (n > 200 && clearInterval(j), n++, 3 === n ? o(10) : 40 === n ? o(50) : 100 === n && o(500), void 0)
                        }, r)
                    };
                o(1)
            },
            getImage: function(n, i) {
                var o = 0,
                    r = function() {
                        n && (n.img[0].complete ? (n.img.off(".mfploader"), n === t.currItem && (t._onImageHasSize(n), t.updateStatus("ready")), n.hasSize = !0, n.loaded = !0, T("ImageLoadComplete")) : (o++, 200 > o ? setTimeout(r, 100) : a()))
                    },
                    a = function() {
                        n && (n.img.off(".mfploader"), n === t.currItem && (t._onImageHasSize(n), t.updateStatus("error", s.tError.replace("%url%", n.src))), n.hasSize = !0, n.loaded = !0, n.loadError = !0)
                    },
                    s = t.st.image,
                    l = i.find(".mfp-img");
                if (l.length) {
                    var c = document.createElement("img");
                    c.className = "mfp-img", n.el && n.el.find("img").length && (c.alt = n.el.find("img").attr("alt")), n.img = e(c).on("load.mfploader", r).on("error.mfploader", a), c.src = n.src, l.is("img") && (n.img = n.img.clone()), c = n.img[0], c.naturalWidth > 0 ? n.hasSize = !0 : c.width || (n.hasSize = !1)
                }
                return t._parseMarkup(i, {
                    title: N(n),
                    img_replaceWith: n.img
                }, n), t.resizeImage(), n.hasSize ? (j && clearInterval(j), n.loadError ? (i.addClass("mfp-loading"), t.updateStatus("error", s.tError.replace("%url%", n.src))) : (i.removeClass("mfp-loading"), t.updateStatus("ready")), i) : (t.updateStatus("loading"), n.loading = !0, n.hasSize || (n.imgHidden = !0, i.addClass("mfp-loading"), t.findImageSize(n)), i)
            }
        }
    });
    var W, R = function() {
        return void 0 === W && (W = void 0 !== document.createElement("p").style.MozTransform), W
    };
    e.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function(e) {
                return e.is("img") ? e : e.find("img")
            }
        },
        proto: {
            initZoom: function() {
                var e, n = t.st.zoom,
                    i = ".zoom";
                if (n.enabled && t.supportsTransition) {
                    var o, r, a = n.duration,
                        s = function(e) {
                            var t = e.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                i = "all " + n.duration / 1e3 + "s " + n.easing,
                                o = {
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: 0,
                                    top: 0,
                                    "-webkit-backface-visibility": "hidden"
                                },
                                r = "transition";
                            return o["-webkit-" + r] = o["-moz-" + r] = o["-o-" + r] = o[r] = i, t.css(o), t
                        },
                        d = function() {
                            t.content.css("visibility", "visible")
                        };
                    x("BuildControls" + i, function() {
                        if (t._allowZoom()) {
                            if (clearTimeout(o), t.content.css("visibility", "hidden"), e = t._getItemToZoom(), !e) return d(), void 0;
                            r = s(e), r.css(t._getOffset()), t.wrap.append(r), o = setTimeout(function() {
                                r.css(t._getOffset(!0)), o = setTimeout(function() {
                                    d(), setTimeout(function() {
                                        r.remove(), e = r = null, T("ZoomAnimationEnded")
                                    }, 16)
                                }, a)
                            }, 16)
                        }
                    }), x(c + i, function() {
                        if (t._allowZoom()) {
                            if (clearTimeout(o), t.st.removalDelay = a, !e) {
                                if (e = t._getItemToZoom(), !e) return;
                                r = s(e)
                            }
                            r.css(t._getOffset(!0)), t.wrap.append(r), t.content.css("visibility", "hidden"), setTimeout(function() {
                                r.css(t._getOffset())
                            }, 16)
                        }
                    }), x(l + i, function() {
                        t._allowZoom() && (d(), r && r.remove(), e = null)
                    })
                }
            },
            _allowZoom: function() {
                return "image" === t.currItem.type
            },
            _getItemToZoom: function() {
                return t.currItem.hasSize ? t.currItem.img : !1
            },
            _getOffset: function(n) {
                var i;
                i = n ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem);
                var o = i.offset(),
                    r = parseInt(i.css("padding-top"), 10),
                    a = parseInt(i.css("padding-bottom"), 10);
                o.top -= e(window).scrollTop() - r;
                var s = {
                    width: i.width(),
                    height: (b ? i.innerHeight() : i[0].offsetHeight) - a - r
                };
                return R() ? s["-moz-transform"] = s.transform = "translate(" + o.left + "px," + o.top + "px)" : (s.left = o.left, s.top = o.top), s
            }
        }
    });
    var Z = "iframe",
        q = "//about:blank",
        D = function(e) {
            if (t.currTemplate[Z]) {
                var n = t.currTemplate[Z].find("iframe");
                n.length && (e || (n[0].src = q), t.isIE8 && n.css("display", e ? "block" : "none"))
            }
        };
    e.magnificPopup.registerModule(Z, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function() {
                t.types.push(Z), x("BeforeChange", function(e, t, n) {
                    t !== n && (t === Z ? D() : n === Z && D(!0))
                }), x(l + "." + Z, function() {
                    D()
                })
            },
            getIframe: function(n, i) {
                var o = n.src,
                    r = t.st.iframe;
                e.each(r.patterns, function() {
                    return o.indexOf(this.index) > -1 ? (this.id && (o = "string" == typeof this.id ? o.substr(o.lastIndexOf(this.id) + this.id.length, o.length) : this.id.call(this, o)), o = this.src.replace("%id%", o), !1) : void 0
                });
                var a = {};
                return r.srcAction && (a[r.srcAction] = o), t._parseMarkup(i, a, n), t.updateStatus("ready"), i
            }
        }
    });
    var K = function(e) {
            var n = t.items.length;
            return e > n - 1 ? e - n : 0 > e ? n + e : e
        },
        Y = function(e, t, n) {
            return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n)
        };
    e.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function() {
                var n = t.st.gallery,
                    i = ".mfp-gallery",
                    r = Boolean(e.fn.mfpFastClick);
                return t.direction = !0, n && n.enabled ? (a += " mfp-gallery", x(f + i, function() {
                    n.navigateByImgClick && t.wrap.on("click" + i, ".mfp-img", function() {
                        return t.items.length > 1 ? (t.next(), !1) : void 0
                    }), o.on("keydown" + i, function(e) {
                        37 === e.keyCode ? t.prev() : 39 === e.keyCode && t.next()
                    })
                }), x("UpdateStatus" + i, function(e, n) {
                    n.text && (n.text = Y(n.text, t.currItem.index, t.items.length))
                }), x(p + i, function(e, i, o, r) {
                    var a = t.items.length;
                    o.counter = a > 1 ? Y(n.tCounter, r.index, a) : ""
                }), x("BuildControls" + i, function() {
                    if (t.items.length > 1 && n.arrows && !t.arrowLeft) {
                        var i = n.arrowMarkup,
                            o = t.arrowLeft = e(i.replace(/%title%/gi, n.tPrev).replace(/%dir%/gi, "left")).addClass(y),
                            a = t.arrowRight = e(i.replace(/%title%/gi, n.tNext).replace(/%dir%/gi, "right")).addClass(y),
                            s = r ? "mfpFastClick" : "click";
                        o[s](function() {
                            t.prev()
                        }), a[s](function() {
                            t.next()
                        }), t.isIE7 && (k("b", o[0], !1, !0), k("a", o[0], !1, !0), k("b", a[0], !1, !0), k("a", a[0], !1, !0)), t.container.append(o.add(a))
                    }
                }), x(m + i, function() {
                    t._preloadTimeout && clearTimeout(t._preloadTimeout), t._preloadTimeout = setTimeout(function() {
                        t.preloadNearbyImages(), t._preloadTimeout = null
                    }, 16)
                }), x(l + i, function() {
                    o.off(i), t.wrap.off("click" + i), t.arrowLeft && r && t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(), t.arrowRight = t.arrowLeft = null
                }), void 0) : !1
            },
            next: function() {
                t.direction = !0, t.index = K(t.index + 1), t.updateItemHTML()
            },
            prev: function() {
                t.direction = !1, t.index = K(t.index - 1), t.updateItemHTML()
            },
            goTo: function(e) {
                t.direction = e >= t.index, t.index = e, t.updateItemHTML()
            },
            preloadNearbyImages: function() {
                var e, n = t.st.gallery.preload,
                    i = Math.min(n[0], t.items.length),
                    o = Math.min(n[1], t.items.length);
                for (e = 1;
                    (t.direction ? o : i) >= e; e++) t._preloadItem(t.index + e);
                for (e = 1;
                    (t.direction ? i : o) >= e; e++) t._preloadItem(t.index - e)
            },
            _preloadItem: function(n) {
                if (n = K(n), !t.items[n].preloaded) {
                    var i = t.items[n];
                    i.parsed || (i = t.parseEl(n)), T("LazyLoad", i), "image" === i.type && (i.img = e('<img class="mfp-img" />').on("load.mfploader", function() {
                        i.hasSize = !0
                    }).on("error.mfploader", function() {
                        i.hasSize = !0, i.loadError = !0, T("LazyLoadError", i)
                    }).attr("src", i.src)), i.preloaded = !0
                }
            }
        }
    });
    var U = "retina";
    e.magnificPopup.registerModule(U, {
            options: {
                replaceSrc: function(e) {
                    return e.src.replace(/\.\w+$/, function(e) {
                        return "@2x" + e
                    })
                },
                ratio: 1
            },
            proto: {
                initRetina: function() {
                    if (window.devicePixelRatio > 1) {
                        var e = t.st.retina,
                            n = e.ratio;
                        n = isNaN(n) ? n() : n, n > 1 && (x("ImageHasSize." + U, function(e, t) {
                            t.img.css({
                                "max-width": t.img[0].naturalWidth / n,
                                width: "100%"
                            })
                        }), x("ElementParse." + U, function(t, i) {
                            i.src = e.replaceSrc(i, n)
                        }))
                    }
                }
            }
        }),
        function() {
            var t = 1e3,
                n = "ontouchstart" in window,
                i = function() {
                    I.off("touchmove" + r + " touchend" + r)
                },
                o = "mfpFastClick",
                r = "." + o;
            e.fn.mfpFastClick = function(o) {
                return e(this).each(function() {
                    var a, s = e(this);
                    if (n) {
                        var l, c, d, u, p, f;
                        s.on("touchstart" + r, function(e) {
                            u = !1, f = 1, p = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0], c = p.clientX, d = p.clientY, I.on("touchmove" + r, function(e) {
                                p = e.originalEvent ? e.originalEvent.touches : e.touches, f = p.length, p = p[0], (Math.abs(p.clientX - c) > 10 || Math.abs(p.clientY - d) > 10) && (u = !0, i())
                            }).on("touchend" + r, function(e) {
                                i(), u || f > 1 || (a = !0, e.preventDefault(), clearTimeout(l), l = setTimeout(function() {
                                    a = !1
                                }, t), o())
                            })
                        })
                    }
                    s.on("click" + r, function() {
                        a || o()
                    })
                })
            }, e.fn.destroyMfpFastClick = function() {
                e(this).off("touchstart" + r + " click" + r), n && I.off("touchmove" + r + " touchend" + r)
            }
        }(), _()
});
(function(b, e) {
    function u(a) {
        if (n) {
            for (var c = [], d = 0; d < a.length; d++) "type" in a[d] && "dfpads" != a[d].type ? console.log("trying to refresh a non dfp ad. continue") : (f && console.log("DFP: refreshing:" + a[d].data.A), c.push(a[d].data));
            0 >= c.length || !b.googletag || b.googletag.cmd.push(function() {
                g && (g = !1, setTimeout(function() {
                    g = !0
                }, 0), b.googletag && b.googletag.pubads && b.googletag.pubads().refresh && b.googletag.pubads().refresh(c))
            })
        } else console.log("dfpInitialized=" + n), console.log("queuing refresh"), p = a
    }

    function v() {
        e("#videoContainer").fadeOut(800);
        b.MC.onVideoClose()
    }

    function w(a, b) {
        document.querySelector(a) ? e(a).append('<div style="position: absolute; right: 10px; top: 4px;"><button type="button" class="close" onclick="closeVideoAd(); return false;">x</button></div>') : setTimeout(function() {
            w(a, b)
        }, b)
    }

    function x(a) {
        return a in q ? q[a] : 0
    }
    var h = {};
    (function() {
        var a = b.location.search;
        "?" == a.charAt(0) && (a = a.slice(1));
        a = a.split("&");
        for (var c = 0; c < a.length; c++) {
            var d = a[c].split("=");
            h[d[0]] = d[1]
        }
    })();
    var f = "debugads" in h,
        q = {},
        g = !0,
        k = {
            aa: [],
            ab: [],
            ac: []
        };
    b.adSlots = k;
    var n = !1,
        p = null,
        l = function(a) {
            a.defineSlot = function(a, d, e) {
                var c = b.googletag;
                return {
                    type: "dfpads",
                    data: c.defineSlot(a, d, e).addService(c.pubads())
                }
            };
            return a
        }({});
    b.googleAdsModule = l;
    var r = !1;
    b.supersonicAds = function(a) {
        a.BrandConnectDoneEvent = function() {
            b.hasEngagement = !1;
            b.MC.checkVideoAds()
        };
        a.BrandConnectOpenEvent = function() {};
        a.BrandConnectCloseEvent = function() {
            v();
            SSA_CORE.BrandConnect.close()
        };
        a.BrandConnectCompletedEvent = function() {};
        a.BrandConnectReadyEvent = function(a) {
            r = "undefined" !== typeof a && a.length ? !0 : !1;
            b.hasEngagement = r
        };
        return a
    }({});
    b.openOfferwall = function() {
        null != SSA_CORE && (e("#offerwallIframe").attr("src", "http://www.supersonicads.com/delivery/panel.php?applicationKey=" + EnvConfig.supersonic_app_key + "&applicationUserId=" + b.ssa_json.custom_user_id + "&custom_user_id=" + b.ssa_json.custom_user_id + "&applicationUserIdSignature=optional"), e("#oferwallContainer").fadeIn(400))
    };
    b.closeOfferwall = function() {
        e("#oferwallContainer").fadeOut(400);
        b.MC.onOffwerwallClose()
    };
    b.openVideoAd = function() {
        null != SSA_CORE && r && (SSA_CORE.BrandConnect.engage(), w(".ssaInterstitialTopBar", 200))
    };
    b.closeVideoContainer = v;
    b.closeVideoAd = function() {
        e(".ssaInterstitialClose").click()
    };
    b.TRModule = function() {
        var a = {},
            c = null;
        a.handleHasSurvey = function(a) {
            c = a
        };
        a.handleNoSurvey = function() {
            c = null
        };
        a.init = function(a) {
            TapResearch.init({
                api_token: b.EnvConfig.tap_research_api_key,
                user_identifier: "" + a,
                has_survey_callback: b.TRModule.handleHasSurvey,
                no_survey_callback: b.TRModule.handleNoSurvey
            })
        };
        a.hasSurveyData = function() {
            return null != c && c.has_offer
        };
        a.openOfferWall = function() {
            e("#offerwallIframe").attr("src", c.offer_url);
            e("#oferwallContainer").fadeIn(400)
        };
        a.closeOfferWall = function() {
            e("#oferwallContainer").fadeOut(400);
            b.MC.onOffwerwallClose()
        };
        return a
    }();
    b.getABGroup = x;
    b.refreshAd = function(a) {
        u(a)
    };
    b.destroyAd = function(a) {
        for (var c = [], d = 0; d < a.length; d++) "type" in a[d] && "dfpads" != a[d].type || (f && console.log("DFP: destroying:" + a[d].data.A), c.push(a[d].data));
        b.googletag && b.googletag.pubads && b.googletag.pubads().clear && b.googletag.pubads().clear(c)
    };
    var t = {
        a: !1
    };
    b.agarAdModule = t;
    q.ABGroupDFP = function() {
        return "AB9" in h ? +h.AB9 : b.localStorage ? (null == b.localStorage.AB9 && (b.localStorage.AB9 = 0 + ~~(100 * Math.random())), +b.localStorage.AB9) : 0
    }();
    b.location.search.indexOf("fb");
    t.a = b.hasBottomAd;
    f && console.log("Init ads");
    (function() {
        var a = {},
            c = null,
            d = null,
            e = null,
            f = null,
            h = -1 != b.location.search.indexOf("fb"),
            g = t.a;
        h ? (a = "/116850162/Agario_FB_300x250", e = "/116850162/Agario_FB_300x250_Stats", f = "/116850162/Agario_FB_300x250") : (f = "/116850162/300x250_init", c = "/116850162/728x90_init", a = "/116850162/300x250_login", e = "/116850162/300x250_stats", d = "/116850162/728x90_login");
        var m = b.googletag;
        m.cmd.push(function() {
            m.pubads().setTargeting("abtest", x("ABGroupDFP") + "");
            k.ac.push(l.defineSlot(f, [300, 250], "g300x250"));
            g && k.ac.push(l.defineSlot(c, [728, 90], "g728x90"));
            k.ab.push(l.defineSlot(e, [300, 250], "s300x250"));
            k.aa.push(l.defineSlot(a, [300, 250], "a300x250"));
            g && k.aa.push(l.defineSlot(d, [728, 90], "a728x90"));
            m.pubads().enableSingleRequest();
            m.pubads().disableInitialLoad();
            m.enableServices();
            n = !0;
            null != p && (console.log("refreshing from queue"), u(p))
        })
    })();
    f && console.log("Ads initted");
    f && console.log("Your group: ", "dfp")
})(window, window.jQuery);
(function(exports) {
    var Util = {
        extend: function() {
            arguments[0] = arguments[0] || {};
            for (var i = 1; i < arguments.length; i++) {
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        if (typeof arguments[i][key] === "object") {
                            if (arguments[i][key] instanceof Array) {
                                arguments[0][key] = arguments[i][key]
                            } else {
                                arguments[0][key] = Util.extend(arguments[0][key], arguments[i][key])
                            }
                        } else {
                            arguments[0][key] = arguments[i][key]
                        }
                    }
                }
            }
            return arguments[0]
        }
    };

    function TimeSeries(options) {
        this.options = Util.extend({}, TimeSeries.defaultOptions, options);
        this.clear()
    }
    TimeSeries.defaultOptions = {
        resetBoundsInterval: 3e3,
        resetBounds: true
    };
    TimeSeries.prototype.clear = function() {
        this.data = [];
        this.maxValue = Number.NaN;
        this.minValue = Number.NaN
    };
    TimeSeries.prototype.resetBounds = function() {
        if (this.data.length) {
            this.maxValue = this.data[0][1];
            this.minValue = this.data[0][1];
            for (var i = 1; i < this.data.length; i++) {
                var value = this.data[i][1];
                if (value > this.maxValue) {
                    this.maxValue = value
                }
                if (value < this.minValue) {
                    this.minValue = value
                }
            }
        } else {
            this.maxValue = Number.NaN;
            this.minValue = Number.NaN
        }
    };
    TimeSeries.prototype.append = function(timestamp, value, sumRepeatedTimeStampValues) {
        var i = this.data.length - 1;
        while (i >= 0 && this.data[i][0] > timestamp) {
            i--
        }
        if (i === -1) {
            this.data.splice(0, 0, [timestamp, value])
        } else if (this.data.length > 0 && this.data[i][0] === timestamp) {
            if (sumRepeatedTimeStampValues) {
                this.data[i][1] += value;
                value = this.data[i][1]
            } else {
                this.data[i][1] = value
            }
        } else if (i < this.data.length - 1) {
            this.data.splice(i + 1, 0, [timestamp, value])
        } else {
            this.data.push([timestamp, value])
        }
        this.maxValue = isNaN(this.maxValue) ? value : Math.max(this.maxValue, value);
        this.minValue = isNaN(this.minValue) ? value : Math.min(this.minValue, value)
    };
    TimeSeries.prototype.dropOldData = function(oldestValidTime, maxDataSetLength) {
        var removeCount = 0;
        while (this.data.length - removeCount >= maxDataSetLength && this.data[removeCount + 1][0] < oldestValidTime) {
            removeCount++
        }
        if (removeCount !== 0) {
            this.data.splice(0, removeCount)
        }
    };

    function SmoothieChart(options) {
        this.options = Util.extend({}, SmoothieChart.defaultChartOptions, options);
        this.seriesSet = [];
        this.currentValueRange = 1;
        this.currentVisMinValue = 0;
        this.lastRenderTimeMillis = 0
    }
    SmoothieChart.defaultChartOptions = {
        name: "",
        millisPerPixel: 20,
        enableDpiScaling: true,
        yMinFormatter: function(min, precision) {
            return parseFloat(min).toFixed(precision)
        },
        yMaxFormatter: function(max, precision) {
            return parseFloat(max).toFixed(precision)
        },
        maxValueScale: 1,
        minValueScale: 1,
        interpolation: "bezier",
        scaleSmoothing: .125,
        maxDataSetLength: 2,
        scrollBackwards: false,
        grid: {
            fillStyle: "#000000",
            strokeStyle: "#777777",
            lineWidth: 1,
            sharpLines: false,
            millisPerLine: 1e3,
            verticalSections: 2,
            borderVisible: true
        },
        labels: {
            fillStyle: "#ffffff",
            disabled: false,
            fontSize: 10,
            fontFamily: "monospace",
            precision: 2
        },
        horizontalLines: []
    };
    SmoothieChart.AnimateCompatibility = function() {
        var requestAnimationFrame = function(callback, element) {
                var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                    return window.setTimeout(function() {
                        callback((new Date).getTime())
                    }, 16)
                };
                return requestAnimationFrame.call(window, callback, element)
            },
            cancelAnimationFrame = function(id) {
                var cancelAnimationFrame = window.cancelAnimationFrame || function(id) {
                    clearTimeout(id)
                };
                return cancelAnimationFrame.call(window, id)
            };
        return {
            requestAnimationFrame: requestAnimationFrame,
            cancelAnimationFrame: cancelAnimationFrame
        }
    }();
    SmoothieChart.defaultSeriesPresentationOptions = {
        lineWidth: 1,
        strokeStyle: "#ffffff"
    };
    SmoothieChart.prototype.addTimeSeries = function(timeSeries, options) {
        this.seriesSet.push({
            timeSeries: timeSeries,
            options: Util.extend({}, SmoothieChart.defaultSeriesPresentationOptions, options)
        });
        if (timeSeries.options.resetBounds && timeSeries.options.resetBoundsInterval > 0) {
            timeSeries.resetBoundsTimerId = setInterval(function() {
                timeSeries.resetBounds()
            }, timeSeries.options.resetBoundsInterval)
        }
    };
    SmoothieChart.prototype.removeTimeSeries = function(timeSeries) {
        var numSeries = this.seriesSet.length;
        for (var i = 0; i < numSeries; i++) {
            if (this.seriesSet[i].timeSeries === timeSeries) {
                this.seriesSet.splice(i, 1);
                break
            }
        }
        if (timeSeries.resetBoundsTimerId) {
            clearInterval(timeSeries.resetBoundsTimerId)
        }
    };
    SmoothieChart.prototype.getTimeSeriesOptions = function(timeSeries) {
        var numSeries = this.seriesSet.length;
        for (var i = 0; i < numSeries; i++) {
            if (this.seriesSet[i].timeSeries === timeSeries) {
                return this.seriesSet[i].options
            }
        }
    };
    SmoothieChart.prototype.bringToFront = function(timeSeries) {
        var numSeries = this.seriesSet.length;
        for (var i = 0; i < numSeries; i++) {
            if (this.seriesSet[i].timeSeries === timeSeries) {
                var set = this.seriesSet.splice(i, 1);
                this.seriesSet.push(set[0]);
                break
            }
        }
    };
    SmoothieChart.prototype.streamTo = function(canvas, delayMillis) {
        this.canvas = canvas;
        this.delay = delayMillis;
        this.start()
    };
    SmoothieChart.prototype.resize = function() {
        if (!this.options.enableDpiScaling || !window || window.devicePixelRatio === 1) return;
        var dpr = window.devicePixelRatio;
        var width = parseInt(this.canvas.getAttribute("width"));
        var height = parseInt(this.canvas.getAttribute("height"));
        if (!this.originalWidth || Math.floor(this.originalWidth * dpr) !== width) {
            this.originalWidth = width;
            this.canvas.setAttribute("width", Math.floor(width * dpr).toString());
            this.canvas.style.width = width + "px";
            this.canvas.getContext("2d").scale(dpr, dpr)
        }
        if (!this.originalHeight || Math.floor(this.originalHeight * dpr) !== height) {
            this.originalHeight = height;
            this.canvas.setAttribute("height", Math.floor(height * dpr).toString());
            this.canvas.style.height = height + "px";
            this.canvas.getContext("2d").scale(dpr, dpr)
        }
    };
    SmoothieChart.prototype.start = function() {
        if (this.frame) {
            return
        }
        var animate = function() {
            this.frame = SmoothieChart.AnimateCompatibility.requestAnimationFrame(function() {
                this.render();
                animate()
            }.bind(this))
        }.bind(this);
        animate()
    };
    SmoothieChart.prototype.stop = function() {
        if (this.frame) {
            SmoothieChart.AnimateCompatibility.cancelAnimationFrame(this.frame);
            delete this.frame
        }
    };
    SmoothieChart.prototype.updateValueRange = function() {
        var chartOptions = this.options,
            chartMaxValue = Number.NaN,
            chartMinValue = Number.NaN;
        for (var d = 0; d < this.seriesSet.length; d++) {
            var timeSeries = this.seriesSet[d].timeSeries;
            if (!isNaN(timeSeries.maxValue)) {
                chartMaxValue = !isNaN(chartMaxValue) ? Math.max(chartMaxValue, timeSeries.maxValue) : timeSeries.maxValue
            }
            if (!isNaN(timeSeries.minValue)) {
                chartMinValue = !isNaN(chartMinValue) ? Math.min(chartMinValue, timeSeries.minValue) : timeSeries.minValue
            }
        }
        if (chartOptions.maxValue != null) {
            chartMaxValue = chartOptions.maxValue
        } else {
            chartMaxValue *= chartOptions.maxValueScale
        }
        if (chartOptions.minValue != null) {
            chartMinValue = chartOptions.minValue
        } else {
            chartMinValue -= Math.abs(chartMinValue * chartOptions.minValueScale - chartMinValue)
        }
        if (this.options.yRangeFunction) {
            var range = this.options.yRangeFunction({
                min: chartMinValue,
                max: chartMaxValue
            });
            chartMinValue = range.min;
            chartMaxValue = range.max
        }
        if (!isNaN(chartMaxValue) && !isNaN(chartMinValue)) {
            var targetValueRange = chartMaxValue - chartMinValue;
            var valueRangeDiff = targetValueRange - this.currentValueRange;
            var minValueDiff = chartMinValue - this.currentVisMinValue;
            this.isAnimatingScale = Math.abs(valueRangeDiff) > .1 || Math.abs(minValueDiff) > .1;
            this.currentValueRange += chartOptions.scaleSmoothing * valueRangeDiff;
            this.currentVisMinValue += chartOptions.scaleSmoothing * minValueDiff
        }
        this.valueRange = {
            min: chartMinValue,
            max: chartMaxValue
        }
    };
    SmoothieChart.prototype.render = function(canvas, time) {
        var nowMillis = (new Date).getTime();
        if (!this.isAnimatingScale) {
            var maxIdleMillis = Math.min(1e3 / 6, this.options.millisPerPixel);
            if (nowMillis - this.lastRenderTimeMillis < maxIdleMillis) {
                return
            }
        }
        this.resize();
        this.lastRenderTimeMillis = nowMillis;
        canvas = canvas || this.canvas;
        time = time || nowMillis - (this.delay || 0);
        time -= time % this.options.millisPerPixel;
        var context = canvas.getContext("2d"),
            chartOptions = this.options,
            dimensions = {
                top: 0,
                left: 0,
                width: canvas.clientWidth,
                height: canvas.clientHeight
            },
            oldestValidTime = time - dimensions.width * chartOptions.millisPerPixel,
            valueToYPixel = function(value) {
                var offset = value - this.currentVisMinValue;
                return this.currentValueRange === 0 ? dimensions.height : dimensions.height - Math.round(offset / this.currentValueRange * dimensions.height)
            }.bind(this),
            timeToXPixel = function(t) {
                if (chartOptions.scrollBackwards) {
                    return Math.round((time - t) / chartOptions.millisPerPixel)
                }
                return Math.round(dimensions.width - (time - t) / chartOptions.millisPerPixel)
            };
        this.updateValueRange();
        context.font = chartOptions.labels.fontSize + "px " + chartOptions.labels.fontFamily;
        context.save();
        context.translate(dimensions.left, dimensions.top);
        context.beginPath();
        context.rect(0, 0, dimensions.width, dimensions.height);
        context.clip();
        context.save();
        context.fillStyle = chartOptions.grid.fillStyle;
        context.clearRect(0, 0, dimensions.width, dimensions.height);
        context.fillRect(0, 0, dimensions.width, dimensions.height);
        context.restore();
        context.save();
        context.lineWidth = chartOptions.grid.lineWidth;
        context.strokeStyle = chartOptions.grid.strokeStyle;
        if (chartOptions.grid.millisPerLine > 0) {
            context.beginPath();
            for (var t = time - time % chartOptions.grid.millisPerLine; t >= oldestValidTime; t -= chartOptions.grid.millisPerLine) {
                var gx = timeToXPixel(t);
                if (chartOptions.grid.sharpLines) {
                    gx -= .5
                }
                context.moveTo(gx, 0);
                context.lineTo(gx, dimensions.height)
            }
            context.stroke();
            context.closePath()
        }
        for (var v = 1; v < chartOptions.grid.verticalSections; v++) {
            var gy = Math.round(v * dimensions.height / chartOptions.grid.verticalSections);
            if (chartOptions.grid.sharpLines) {
                gy -= .5
            }
            context.beginPath();
            context.moveTo(0, gy);
            context.lineTo(dimensions.width, gy);
            context.stroke();
            context.closePath()
        }
        if (chartOptions.grid.borderVisible) {
            context.beginPath();
            context.strokeRect(0, 0, dimensions.width, dimensions.height);
            context.closePath()
        }
        context.restore();
        if (chartOptions.horizontalLines && chartOptions.horizontalLines.length) {
            for (var hl = 0; hl < chartOptions.horizontalLines.length; hl++) {
                var line = chartOptions.horizontalLines[hl],
                    hly = Math.round(valueToYPixel(line.value)) - .5;
                context.strokeStyle = line.color || "#ffffff";
                context.lineWidth = line.lineWidth || 1;
                context.beginPath();
                context.moveTo(0, hly);
                context.lineTo(dimensions.width, hly);
                context.stroke();
                context.closePath()
            }
        }
        for (var d = 0; d < this.seriesSet.length; d++) {
            context.save();
            var timeSeries = this.seriesSet[d].timeSeries,
                dataSet = timeSeries.data,
                seriesOptions = this.seriesSet[d].options;
            timeSeries.dropOldData(oldestValidTime, chartOptions.maxDataSetLength);
            context.lineWidth = seriesOptions.lineWidth;
            context.strokeStyle = seriesOptions.strokeStyle;
            context.beginPath();
            var firstX = 0,
                lastX = 0,
                lastY = 0;
            for (var i = 0; i < dataSet.length && dataSet.length !== 1; i++) {
                var x = timeToXPixel(dataSet[i][0]),
                    y = valueToYPixel(dataSet[i][1]);
                if (i === 0) {
                    firstX = x;
                    context.moveTo(x, y)
                } else {
                    switch (chartOptions.interpolation) {
                        case "linear":
                        case "line":
                            {
                                context.lineTo(x, y);
                                break
                            }
                        case "bezier":
                        default:
                            {
                                context.bezierCurveTo(Math.round((lastX + x) / 2), lastY, Math.round(lastX + x) / 2, y, x, y);
                                break
                            }
                        case "step":
                            {
                                context.lineTo(x, lastY);context.lineTo(x, y);
                                break
                            }
                    }
                }
                lastX = x;
                lastY = y
            }
            if (dataSet.length > 1) {
                if (seriesOptions.fillStyle) {
                    context.lineTo(dimensions.width + seriesOptions.lineWidth + 1, lastY);
                    context.lineTo(dimensions.width + seriesOptions.lineWidth + 1, dimensions.height + seriesOptions.lineWidth + 1);
                    context.lineTo(firstX, dimensions.height + seriesOptions.lineWidth);
                    context.fillStyle = seriesOptions.fillStyle;
                    context.fill()
                }
                if (seriesOptions.strokeStyle && seriesOptions.strokeStyle !== "none") {
                    context.stroke()
                }
                context.closePath()
            }
            context.restore()
        }
        if (!chartOptions.labels.disabled && !isNaN(this.valueRange.min) && !isNaN(this.valueRange.max)) {
            var maxValueString = chartOptions.yMaxFormatter(this.valueRange.max, chartOptions.labels.precision),
                minValueString = chartOptions.yMinFormatter(this.valueRange.min, chartOptions.labels.precision),
                labelPos = chartOptions.scrollBackwards ? 0 : dimensions.width - context.measureText(maxValueString).width - 2;
            context.fillStyle = chartOptions.labels.fillStyle;
            context.fillText(maxValueString, labelPos, chartOptions.labels.fontSize);
            context.fillText(minValueString, labelPos, dimensions.height - 2);
            if (chartOptions.name != "") {
                context.fillText(chartOptions.name, 2, chartOptions.labels.fontSize)
            }
        }
        if (chartOptions.timestampFormatter && chartOptions.grid.millisPerLine > 0) {
            var textUntilX = chartOptions.scrollBackwards ? context.measureText(minValueString).width : dimensions.width - context.measureText(minValueString).width + 4;
            for (var t = time - time % chartOptions.grid.millisPerLine; t >= oldestValidTime; t -= chartOptions.grid.millisPerLine) {
                var gx = timeToXPixel(t);
                if (!chartOptions.scrollBackwards && gx < textUntilX || chartOptions.scrollBackwards && gx > textUntilX) {
                    var tx = new Date(t),
                        ts = chartOptions.timestampFormatter(tx),
                        tsWidth = context.measureText(ts).width;
                    textUntilX = chartOptions.scrollBackwards ? gx + tsWidth + 2 : gx - tsWidth - 2;
                    context.fillStyle = chartOptions.labels.fillStyle;
                    if (chartOptions.scrollBackwards) {
                        context.fillText(ts, gx, dimensions.height - 2)
                    } else {
                        context.fillText(ts, gx - tsWidth, dimensions.height - 2)
                    }
                }
            }
        }
        context.restore()
    };
    SmoothieChart.timeFormatter = function(date) {
        function pad2(number) {
            return (number < 10 ? "0" : "") + number
        }
        return pad2(date.getHours()) + ":" + pad2(date.getMinutes()) + ":" + pad2(date.getSeconds())
    };
    exports.TimeSeries = TimeSeries;
    exports.SmoothieChart = SmoothieChart
})(typeof exports === "undefined" ? this : exports);
var LZString = function() {
    function o(o, r) {
        if (!t[o]) {
            t[o] = {};
            for (var n = 0; n < o.length; n++) t[o][o.charAt(n)] = n
        }
        return t[o][r]
    }
    var r = String.fromCharCode,
        n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
        t = {},
        i = {
            compressToBase64: function(o) {
                if (null == o) return "";
                var r = i._compress(o, 6, function(o) {
                    return n.charAt(o)
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
                            return r + "="
                }
            },
            decompressFromBase64: function(r) {
                return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function(e) {
                    return o(n, r.charAt(e))
                })
            },
            compressToUTF16: function(o) {
                return null == o ? "" : i._compress(o, 15, function(o) {
                    return r(o + 32)
                }) + " "
            },
            decompressFromUTF16: function(o) {
                return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function(r) {
                    return o.charCodeAt(r) - 32
                })
            },
            compressToUint8Array: function(o) {
                for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) {
                    var s = r.charCodeAt(e);
                    n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256
                }
                return n
            },
            decompressFromUint8Array: function(o) {
                if (null === o || void 0 === o) return i.decompress(o);
                for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++) n[e] = 256 * o[2 * e] + o[2 * e + 1];
                var s = [];
                return n.forEach(function(o) {
                    s.push(r(o))
                }), i.decompress(s.join(""))
            },
            compressToEncodedURIComponent: function(o) {
                return null == o ? "" : i._compress(o, 6, function(o) {
                    return e.charAt(o)
                })
            },
            decompressFromEncodedURIComponent: function(r) {
                return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function(n) {
                    return o(e, r.charAt(n))
                }))
            },
            compress: function(o) {
                return i._compress(o, 16, function(o) {
                    return r(o)
                })
            },
            _compress: function(o, r, n) {
                if (null == o) return "";
                var e, t, i, s = {},
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
                for (i = 0; i < o.length; i += 1)
                    if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c;
                    else {
                        if (Object.prototype.hasOwnProperty.call(p, a)) {
                            if (a.charCodeAt(0) < 256) {
                                for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                                for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                            } else {
                                for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                                for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                            }
                            l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a]
                        } else
                            for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                        l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u)
                    }
                if ("" !== a) {
                    if (Object.prototype.hasOwnProperty.call(p, a)) {
                        if (a.charCodeAt(0) < 256) {
                            for (e = 0; h > e; e++) m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                            for (t = a.charCodeAt(0), e = 0; 8 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                        } else {
                            for (t = 1, e = 0; h > e; e++) m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                            for (t = a.charCodeAt(0), e = 0; 16 > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1
                        }
                        l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a]
                    } else
                        for (t = s[a], e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                    l--, 0 == l && (l = Math.pow(2, h), h++)
                }
                for (t = 2, e = 0; h > e; e++) m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                for (;;) {
                    if (m <<= 1, v == r - 1) {
                        d.push(n(m));
                        break
                    }
                    v++
                }
                return d.join("")
            },
            decompress: function(o) {
                return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function(r) {
                    return o.charCodeAt(r)
                })
            },
            _decompress: function(o, n, e) {
                var t, i, s, p, u, c, a, l, f = [],
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
                        return ""
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
                            return w.join("")
                    }
                    if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l];
                    else {
                        if (l !== d) return null;
                        v = s + s.charAt(0)
                    }
                    w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++)
                }
            }
        };
    return i
}();
"function" == typeof define && define.amd ? define(function() {
    return LZString
}) : "undefined" != typeof module && null != module && (module.exports = LZString);
var cc = {
    version: "1.0.10",
    jqueryversionrequired: "1.4.4",
    initobj: false,
    ismobile: false,
    setupcomplete: false,
    allasked: false,
    checkedlocal: false,
    checkedremote: false,
    remoteresponse: false,
    frommodal: false,
    hassetupmobile: false,
    sessionkey: false,
    noclosewin: false,
    closingmodal: false,
    jqueryattempts: 0,
    reloadkey: false,
    forcereload: false,
    allagree: true,
    checkedipdb: false,
    cookies: {},
    uniqelemid: 0,
    executionblock: 0,
    defaultCookies: {
        social: {},
        analytics: {},
        advertising: {}
    },
    remoteCookies: {},
    approved: {},
    bindfunctions: {},
    checkeddonottrack: false,
    eumemberstates: ["BE", "BG", "CZ", "DK", "DE", "EE", "IE", "EL", "ES", "FR", "IT", "CY", "LV", "LT", "LU", "HU", "MT", "NL", "AT", "PL", "PT", "RO", "SI", "SK", "FI", "SE", "UK"],
    settings: {
        refreshOnConsent: false,
        style: "light",
        bannerPosition: "bottom",
        clickAnyLinkToConsent: true,
        privacyPolicy: false,
        collectStatistics: false,
        tagPosition: "bottom-right",
        useSSL: false,
        clearprefs: false,
        consenttype: "explicit",
        onlyshowbanneronce: false,
        hideallsitesbutton: true,
        disableallsites: false,
        hideprivacysettingstab: true,
        scriptdelay: 800,
        testmode: false,
        overridewarnings: false,
        onlyshowwithineu: true,
        ipinfodbkey: false,
        ignoreDoNotTrack: false
    },
    strings: {
        jqueryWarning: "Developer: Caution! In order to use Cookie Consent, you need to use jQuery 1.4.4 or higher.",
        noJsBlocksWarning: "Developer: Warning! It doesn't look like you have set up Cookie Consent correctly.  You must follow all steps of the setup guide at http://silktide.com/cookieconsent/code.  If you believe you are seeing this message in error, you can use the overridewarnings setting (see docs for more information).",
        noKeyWarning: "Developer: Warning! You have set the plugin to only show within the EU, but you have not provided an API key for the IP Info DB.  Check the documentation at http://silktide.com/cookieconsent for more information",
        invalidKeyWarning: "Developer: Warning! You must provide a valid API key for IP Info DB.  Check the documentation at http://silktide.com/cookieconsent for more information",
        necessaryDefaultTitle: "Strictly necessary",
        socialDefaultTitle: "Social media",
        analyticsDefaultTitle: "Analytics",
        advertisingDefaultTitle: "Advertising",
        defaultTitle: "Default cookie title",
        necessaryDefaultDescription: "Some cookies on this website are strictly necessary and cannot be disabled.",
        socialDefaultDescription: "Facebook, Twitter and other social websites need to know who you are to work properly.",
        analyticsDefaultDescription: "We anonymously measure your use of this website to improve your experience.",
        advertisingDefaultDescription: "Adverts will be chosen for you automatically based on your past behaviour and interests.",
        defaultDescription: "Default cookie description.",
        notificationTitle: "Cookies help us provide, protect and improve Miniclip's services and to make your experience more fun! Third parties use cookies on our site to tailor adverts to your interests on third party websites. By scrolling, clicking or navigating our site, you consent to this use of cookies in accordance with our <a class='cc-link' target='_blank' href='//www.miniclip.com/cookie-policy/'>Cookies Policy</a>, which includes details of how you can change your cookie settings.",
        notificationTitleImplicit: "We use cookies to ensure you get the best experience on our website",
        poweredBy: "Cookie Consent plugin for the EU cookie law",
        privacyPolicy: "Privacy policy",
        learnMore: "Learn more",
        seeDetails: "Know more about it our cookie usage",
        seeDetailsImplicit: "change your settings",
        hideDetails: "hide details",
        savePreference: "Save preference",
        saveForAllSites: "Save for all sites",
        allowCookies: "OK",
        allowCookiesImplicit: "Close",
        allowForAllSites: "Allow for all sites",
        customCookie: "This website uses a custom type of cookie which needs specific approval",
        privacySettings: "Privacy settings",
        privacySettingsDialogTitleA: "Privacy settings",
        privacySettingsDialogTitleB: "for this website",
        privacySettingsDialogSubtitle: "Some features of this website need your consent to remember who you are.",
        closeWindow: "Close window",
        changeForAllSitesLink: "Change settings for all websites",
        preferenceUseGlobal: "Use global setting",
        preferenceConsent: "I consent",
        preferenceDecline: "I decline",
        preferenceAsk: "Ask me each time",
        preferenceAlways: "Always allow",
        preferenceNever: "Never allow",
        notUsingCookies: "This website does not use any cookies.",
        clearedCookies: "Your cookies have been cleared, you will need to reload this page for the settings to have effect.",
        allSitesSettingsDialogTitleA: "Privacy settings",
        allSitesSettingsDialogTitleB: "for all websites",
        allSitesSettingsDialogSubtitle: "You may consent to these cookies for all websites that use this plugin.",
        backToSiteSettings: "Back to website settings"
    },
    onconsent: function(cookieType, input) {
        if (cc.isfunction(input)) {
            fn = input
        } else {
            scriptname = input;
            fn = function() {
                cc.insertscript(scriptname)
            }
        }
        if (cc.cookies && cc.cookies[cookieType] && cc.cookies[cookieType].approved) {
            cc.cookies[cookieType].executed = true;
            fn()
        } else {
            if (window.jQuery) {
                jQuery(document).bind("cc_" + cookieType, fn)
            } else {
                if (cc.bindfunctions[cookieType]) {
                    cc.bindfunctions[cookieType][cc.bindfunctions[cookieType].length] = fn
                } else {
                    cc.bindfunctions[cookieType] = new Array(fn)
                }
            }
        }
    },
    geturlparameter: function(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null) return false;
        else return decodeURIComponent(results[1].replace(/\+/g, " "))
    },
    isfunction: function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == "[object Function]"
    },
    setup: function() {
        jQuery.each(cc.bindfunctions, function(key, value) {
            for (i = 0; i < value.length; i++) {
                jQuery(document).bind("cc_" + key, value[i])
            }
        });
        verstr = jQuery().jquery;
        parts = verstr.split(".");
        versionRequired = cc.jqueryversionrequired.split(".");
        jqueryOk = true;
        for (i = 0; i < parts.length && i < versionRequired.length; i++) {
            currentpart = parseInt(parts[i]);
            requiredpart = parseInt(versionRequired[i]);
            if (currentpart < requiredpart) {
                jqueryok = false;
                break
            }
            if (currentpart > requiredpart) {
                break
            }
        }
        if (!jqueryOk) {
            alert(cc.strings.jqueryWarning)
        }
        jQuery.each(cc.defaultCookies, function(key, value) {
            if (key == "necessary") {
                cc.defaultCookies[key].title = cc.strings.necessaryDefaultTitle;
                cc.defaultCookies[key].description = cc.strings.necessaryDefaultDescription
            } else if (key == "social") {
                cc.defaultCookies[key].title = cc.strings.socialDefaultTitle;
                cc.defaultCookies[key].description = cc.strings.socialDefaultDescription
            } else if (key == "analytics") {
                cc.defaultCookies[key].title = cc.strings.analyticsDefaultTitle;
                cc.defaultCookies[key].description = cc.strings.analyticsDefaultDescription
            } else if (key == "advertising") {
                cc.defaultCookies[key].title = cc.strings.advertisingDefaultTitle;
                cc.defaultCookies[key].description = cc.strings.advertisingDefaultDescription
            }
        });
        jQuery.each(cc.initobj.cookies, function(key, value) {
            if (!value.title) {
                if (key == "necessary") {
                    cc.initobj.cookies[key].title = cc.strings.necessaryDefaultTitle
                } else if (key == "social") {
                    cc.initobj.cookies[key].title = cc.strings.socialDefaultTitle
                } else if (key == "analytics") {
                    cc.initobj.cookies[key].title = cc.strings.analyticsDefaultTitle
                } else if (key == "advertising") {
                    cc.initobj.cookies[key].title = cc.strings.advertisingDefaultTitle
                } else {
                    cc.initobj.cookies[key].title = cc.strings.defaultTitle
                }
            }
            if (!value.description) {
                if (key == "necessary") {
                    cc.initobj.cookies[key].description = cc.strings.necessaryDefaultDescription
                } else if (key == "social") {
                    cc.initobj.cookies[key].description = cc.strings.socialDefaultDescription
                } else if (key == "analytics") {
                    cc.initobj.cookies[key].description = cc.strings.analyticsDefaultDescription
                } else if (key == "advertising") {
                    cc.initobj.cookies[key].description = cc.strings.advertisingDefaultDescription
                } else {
                    cc.initobj.cookies[key].description = cc.strings.defaultDescription
                }
            }
            if (!value.defaultstate) {
                cc.initobj.cookies[key].defaultstate = "on"
            }
            cc.initobj.cookies[key].asked = false;
            cc.initobj.cookies[key].approved = false;
            cc.initobj.cookies[key].executed = false
        });
        testmode = cc.geturlparameter("cctestmode");
        if (testmode == "accept" || testmode == "decline") {
            cc.settings.testmode = testmode
        }
        if (cc.settings.disableallsites) {
            cc.settings.hideallsitesbutton = true
        }
        for (var attrname in cc.initobj.cookies) {
            cc.cookies[attrname] = cc.initobj.cookies[attrname];
            if (cc.settings.testmode == "accept") {
                cc.approved[attrname] = "yes"
            }
            if (cc.settings.testmode == "decline") {
                cc.approved[attrname] = "no"
            }
        }
    },
    initialise: function(obj) {
        cc.initobj = obj;
        if (obj.settings !== undefined) {
            for (var attrname in obj.settings) {
                this.settings[attrname] = obj.settings[attrname]
            }
        }
        if (obj.strings !== undefined) {
            for (var attrname in obj.strings) {
                this.strings[attrname] = obj.strings[attrname]
            }
        }
        cc.settings.style = "cc-" + cc.settings.style;
        cc.settings.bannerPosition = "cc-" + cc.settings.bannerPosition;
        if (cc.settings.useSSL) {}
        if (window.jQuery) {
            cc.setupcomplete = true;
            cc.setup()
        }
    },
    calculatestatsparams: function() {
        params = "c=";
        first = true;
        jQuery.each(cc.initobj.cookies, function(key, value) {
            if (first) {
                first = false
            } else {
                params += ";"
            }
            params += encodeURIComponent(key) + ":";
            if (cc.approved[key]) {
                params += cc.approved[key]
            } else {
                params += "none"
            }
            if (value.statsid) {
                params += ":" + value.statsid
            }
        });
        if (cc.ismobile) {
            params += "&m=1"
        } else {
            params += "&m=0"
        }
        params += "&u=" + encodeURIComponent(document.URL);
        return params
    },
    setsessionkey: function(data) {
        cc.sessionkey = data
    },
    fetchprefs: function() {
        cc.remoteresponse = false;
        params = "?s=1";
        if (cc.settings.collectStatistics) {
            params = "?s=1&" + cc.calculatestatsparams()
        }
        if (cc.settings.clearprefs) {
            params += "&v=1";
            cc.settings.clearprefs = false
        }
        setTimeout(function() {
            if (!cc.remoteresponse) {
                cc.checkapproval()
            }
        }, 3e3);
        this.checkedremote = true
    },
    responseids: function(data) {
        jQuery.each(data, function(key, value) {
            cc.cookies[key].statsid = value
        })
    },
    insertscript: function(script) {
        var newfile = document.createElement("script");
        newfile.setAttribute("type", "text/javascript");
        newfile.setAttribute("src", script);
        document.getElementsByTagName("head")[0].appendChild(newfile)
    },
    insertscripttag: function(content) {
        var newfile = document.createElement("script");
        newfile.setAttribute("type", "text/javascript");
        newfile.innerHTML = content;
        document.getElementsByTagName("head")[0].appendChild(newfile)
    },
    checklocal: function() {
        this.checkedlocal = true;
        jQuery.each(cc.cookies, function(key, value) {
            cookieval = cc.getcookie("cc_" + key);
            if (cookieval) {
                cc.approved[key] = cookieval
            }
        });
        this.checkapproval()
    },
    response: function(data) {
        cc.remoteresponse = true;
        jQuery.each(data, function(key, value) {
            if (cc.cookies[key] && (!cc.approved[key] || cc.approved[key] && (cc.approved[key] == "always" || cc.approved[key] == "never"))) {
                cc.setcookie("cc_" + key, value, 365)
            }
        });
        for (var attrname in data) {
            cc.remoteCookies[attrname] = data[attrname];
            if (this.approved[attrname] != "yes" && this.approved[attrname] != "no") {
                this.approved[attrname] = data[attrname]
            }
        }
        jQuery.each(cc.cookies, function(key, value) {
            if (!data[key] && (cc.approved[key] == "always" || cc.approved[key] == "never")) {
                cc.cookies[key].approved = false;
                cc.deletecookie(key);
                delete cc.approved[key]
            }
        });
        this.checkapproval()
    },
    deletecookie: function(key) {
        date = new Date;
        date.setDate(date.getDate() - 1);
        document.cookie = escape("cc_" + key) + "=; path=/; expires=" + date
    },
    reloadifnecessary: function() {
        if (cc.settings.refreshOnConsent || cc.ismobile || cc.forcereload) {
            setTimeout("location.reload(true);", 50)
        }
    },
    onkeyup: function(e) {
        if (e.keyCode == 27) {
            cc.closemodals()
        }
    },
    closemodals: function() {
        if (!cc.closingmodal) {
            if (cc.noclosewin) {
                cc.noclosewin = false
            } else {
                if (jQuery("#cc-modal").is(":visible")) {
                    jQuery("#cc-modal .cc-modal-closebutton a").click()
                }
                if (jQuery("#cc-settingsmodal").is(":visible")) {
                    jQuery("#cc-settingsmodal #cc-settingsmodal-closebutton a").click()
                }
            }
        }
    },
    showbanner: function() {
        jQuery("#cc-tag").fadeOut(null, function() {
            jQuery(this).remove()
        });
        jQuery("#cc-notification").remove();
        if (cc.ismobile) {
            cc.setupformobile();
            jQuery("head").append('<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">');
            jQuery("body").html("").css("margin", 0)
        }
        data = '<div id="cc-notification">' + '<div id="cc-notification-wrapper">' + "<h2><span>" + cc.strings.notificationTitle + "</span></h2>" + '<div id="cc-notification-permissions">' + '<a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="' + cc.strings.poweredBy + '"><span>' + cc.strings.poweredBy + "</span></a> " + "</div>" + '<ul class="cc-notification-buttons">' + "<li>" + '<a class="cc-link" href="http://cookieconsent.silktide.com" id="cc-approve-button-allsites">' + cc.strings.allowForAllSites + "</a>" + "</li>" + "<li>" + '<a class="cc-link" href="#" id="cc-approve-button-thissite">' + cc.strings.allowCookies + "</a>" + "</li>" + "</ul>" + '<div class="cc-clear"></div>' + "</div>" + "</div>";
        jQuery("body").prepend(data);
        if (cc.settings.hideallsitesbutton) {
            jQuery("#cc-approve-button-allsites").hide()
        }
        if (cc.settings.consenttype == "implicit") {
            jQuery("#cc-notification h2 span").html(cc.strings.notificationTitleImplicit);
            jQuery("#cc-approve-button-thissite").html(cc.strings.allowCookiesImplicit);
            jQuery("#cc-approve-button-thissite").parent().after(jQuery("#cc-approve-button-allsites").parent());
            jQuery("#cc-approve-button-allsites").hide()
        }
        jQuery("#cc-notification-logo").hide();
        if (cc.settings.privacyPolicy) {
            jQuery("#cc-notification-moreinformation").prepend('<a href="' + cc.settings.privacyPolicy + '">' + cc.strings.privacyPolicy + "</a> | ")
        }
        jQuery("#cc-notification").addClass(cc.settings.style).addClass(cc.settings.bannerPosition);
        bannerh = jQuery("#cc-notification").height();
        jQuery("#cc-notification").hide();
        if (cc.ismobile) {
            jQuery("#cc-notification").addClass("cc-mobile")
        }
        jQuery("#cc-notification-permissions").prepend("<ul></ul>");
        allcustom = true;
        jQuery.each(cc.cookies, function(key, value) {
            if (!value.asked) {
                jQuery("#cc-notification-permissions ul").append('<li><input type="checkbox" checked="checked" id="cc-checkbox-' + key + '" /> <label id="cc-label-' + key + '" for="cc-checkbox-' + key + '"><strong>' + value.title + "</strong> " + value.description + "</label></li>");
                if (value.link) {
                    jQuery("#cc-label-" + key).append(' <a target="_blank" href="' + value.link + '" class="cc-learnmore-link">' + cc.strings.learnMore + "</a>")
                }
                if (key == "social" || key == "analytics" || key == "advertising") {
                    allcustom = false
                }
                jQuery("#cc-checkbox-" + key).change(function() {
                    if (jQuery(this).is(":checked")) {
                        jQuery(this).parent().removeClass("cc-notification-permissions-inactive")
                    } else {
                        jQuery(this).parent().addClass("cc-notification-permissions-inactive")
                    }
                });
                if (value.defaultstate == "off") {
                    jQuery("#cc-checkbox-" + key).removeAttr("checked").parent().addClass("cc-notification-permissions-inactive")
                }
                if (key == "necessary") {
                    jQuery("#cc-checkbox-" + key).attr("disabled", "disabled")
                }
            }
        });
        if (cc.settings.consenttype == "implicit") {
            jQuery("#cc-notification-moreinfo").html(cc.strings.seeDetailsImplicit)
        }
        jQuery("#cc-notification-moreinfo").click(function() {
            if (jQuery(this).html() == cc.strings.seeDetails || jQuery(this).html() == cc.strings.seeDetailsImplicit) {
                if (cc.settings.consenttype == "implicit") {
                    if (!cc.settings.hideallsitesbutton) {
                        jQuery("#cc-approve-button-allsites").show()
                    }
                }
                jQuery("#cc-approve-button-thissite").html(cc.strings.savePreference);
                jQuery("#cc-approve-button-allsites").html(cc.strings.saveForAllSites);
                jQuery(this).html(cc.strings.hideDetails)
            } else {
                jQuery.each(cc.cookies, function(key, value) {
                    if (value.defaultstate == "off") {
                        jQuery("#cc-checkbox-" + key).removeAttr("checked");
                        jQuery(this).parent().addClass("cc-notification-permissions-inactive")
                    } else {
                        jQuery("#cc-checkbox-" + key).attr("checked", "checked");
                        jQuery(this).parent().removeClass("cc-notification-permissions-inactive")
                    }
                });
                if (cc.settings.consenttype == "implicit") {
                    jQuery(this).html(cc.strings.seeDetailsImplicit);
                    jQuery("#cc-approve-button-thissite").html(cc.strings.allowCookiesImplicit);
                    jQuery("#cc-approve-button-allsites").hide()
                } else {
                    jQuery(this).html(cc.strings.seeDetails);
                    jQuery("#cc-approve-button-thissite").html(cc.strings.allowCookies);
                    jQuery("#cc-approve-button-allsites").html(cc.strings.allowForAllSites)
                }
            }
            jQuery("#cc-notification-logo").fadeToggle();
            jQuery("#cc-notification-permissions").slideToggle();
            jQuery(this).blur();
            return false
        });
        if (!cc.ismobile) {
            if (cc.settings.bannerPosition == "cc-push") {
                jQuery("html").animate({
                    marginBottom: bannerh
                }, 400)
            }
            jQuery("#cc-notification").slideDown()
        } else {
            jQuery("#cc-notification").show()
        }
        jQuery("#cc-approve-button-thissite").click(cc.onlocalconsentgiven);
        if (cc.settings.clickAnyLinkToConsent) {
            jQuery("a").filter(":not(.cc-link)").click(cc.onlocalconsentgiven)
        }
        if (allcustom) {
            jQuery("#cc-notification h2 span").html(cc.strings.customCookie);
            jQuery("#cc-approve-button-allsites").hide()
        } else {
            jQuery("#cc-approve-button-allsites").click(cc.onremoteconsentgiven)
        }
    },
    timestamp: function() {
        return Math.round((new Date).getTime() / 1e3)
    },
    setLocation: function(countryCode) {
        ineu = "yes";
        if (jQuery.inArray(countryCode, cc.eumemberstates) == -1) {
            ineu = "no";
            jQuery.each(cc.cookies, function(key, value) {
                cc.approved[key] = "yes"
            });
            cc.settings.hideprivacysettingstab = true
        }
        cc.setcookie("cc_ineu", ineu, 365);
        cc.checkapproval()
    },
    locationcallback: function(data) {
        if (data.statusCode == "OK" && data.countryCode) {
            ineu = "yes";
            if (jQuery.inArray(data.countryCode, cc.eumemberstates) == -1) {
                ineu = "no";
                jQuery.each(cc.cookies, function(key, value) {
                    cc.approved[key] = "yes"
                });
                cc.settings.hideprivacysettingstab = true
            }
            cc.setcookie("cc_ineu", ineu, 365)
        }
        if (data.statusCode == "ERROR" && data.statusMessage == "Invalid API key.") {
            alert(cc.strings.invalidKeyWarning)
        }
        cc.checkapproval()
    },
    checkdonottrack: function() {
        cc.checkeddonottrack = true;
        if (!cc.settings.ignoreDoNotTrack) {
            if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "yes" || navigator.msDoNotTrack == "1") {
                cc.settings.consenttype = "explicit"
            }
        }
        cc.checkapproval()
    },
    checkapproval: function() {
        if (!cc.checkedipdb && cc.settings.onlyshowwithineu) {
            cc.checkedipdb = true;
            ineu = cc.getcookie("cc_ineu");
            if (ineu) {
                if (ineu == "no") {
                    jQuery.each(cc.cookies, function(key, value) {
                        cc.approved[key] = "yes"
                    });
                    cc.settings.hideprivacysettingstab = true
                }
            } else {
                return
            }
        }
        cc.allasked = true;
        jQuery.each(cc.cookies, function(key, value) {
            if (cc.approved[key]) {
                if (cc.approved[key] == "yes" || cc.approved[key] == "always" && cc.checkedremote) {
                    cc.cookies[key].asked = true;
                    cc.cookies[key].approved = true;
                    cc.execute(key)
                } else if (cc.approved[key] == "never" && cc.checkedremote || cc.approved[key] == "no") {
                    cc.cookies[key].asked = true;
                    cc.cookies[key].approved = false
                } else {
                    cc.allasked = false
                }
            } else {
                cc.allasked = false
            }
        });
        if (!cc.allasked) {
            if (!cc.checkedlocal) {
                cc.checklocal();
                return
            }
            if (!cc.checkedremote && !cc.settings.disableallsites) {
                cc.fetchprefs();
                return
            }
            if (!cc.checkeddonottrack) {
                cc.checkdonottrack();
                return
            }
            if (cc.settings.consenttype == "implicit") {
                jQuery.each(cc.cookies, function(key, value) {
                    if (!cc.cookies[key].asked) {
                        if (cc.settings.onlyshowbanneronce) {
                            cc.setcookie("cc_" + key, "yes", 365)
                        }
                        cc.execute(key)
                    }
                })
            }
            cc.showbanner()
        } else {
            if (cc.settings.collectStatistics) {
                params = "";
                params += "?s=1&n=1&" + cc.calculatestatsparams();
                cc.insertscript(cc.settings.serveraddr + params)
            }
            cc.showminiconsent()
        }
    },
    execute: function(cookieType) {
        if (cookieType == "necessary") {
            return
        }
        if (cc.cookies[cookieType].executed) {
            return
        }
        jQuery(".cc-placeholder-" + cookieType).remove();
        jQuery("script.cc-onconsent-" + cookieType + '[type="text/plain"]').each(function() {
            if (jQuery(this).attr("src")) {
                jQuery(this).after('<script type="text/javascript" src="' + jQuery(this).attr("src") + '"></script>')
            } else {
                jQuery(this).after('<script type="text/javascript">' + jQuery(this).html() + "</script>")
            }
        });
        cc.cookies[cookieType].executed = true;
        jQuery(document).trigger("cc_" + cookieType);
        cc.executescriptinclusion(cookieType)
    },
    executescriptinclusion: function(cookieType) {
        timetaken = jQuery("script.cc-onconsent-inline-" + cookieType + '[type="text/plain"]').size() * cc.settings.scriptdelay;
        now = (new Date).getTime();
        if (now < cc.executionblock) {
            setTimeout(cc.executescriptinclusion, cc.executionblock - now, [cookieType]);
            return
        }
        cc.executionblock = now + timetaken;
        cc.insertscripts(cookieType)
    },
    insertscripts: function(cookieType) {
        jQuery("script.cc-onconsent-inline-" + cookieType + '[type="text/plain"]').first().each(function() {
            cc.uniqelemid++;
            if (jQuery(this).parents("body").size() > 0) {
                jQuery(this).after('<div id="cc-consentarea-' + cc.uniqelemid + '" class="' + cookieType + '"></div>');
                document.write = function(g) {
                    jQuery("#cc-consentarea-" + cc.uniqelemid).append(g)
                };
                document.writeln = function(g) {
                    jQuery("#cc-consentarea-" + cc.uniqelemid).append(g)
                }
            }
            if (jQuery(this).attr("src")) {
                jQuery(this).after('<script type="text/javascript" src="' + jQuery(this).attr("src") + '"></script>')
            } else {
                jQuery(this).after('<script type="text/javascript">' + jQuery(this).html() + "</script>")
            }
            jQuery(this).remove()
        });
        if (jQuery("script.cc-onconsent-inline-" + cookieType + '[type="text/plain"]').size() > 0) {
            setTimeout(cc.insertscripts, cc.settings.scriptdelay, [cookieType])
        }
    },
    getcookie: function(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y)
            }
        }
        return false
    },
    setcookie: function(name, value, expirydays) {
        var exdate = new Date;
        exdate.setDate(exdate.getDate() + expirydays);
        document.cookie = name + "=" + value + "; expires=" + exdate.toUTCString() + "; path=/"
    },
    onremoteconsentgiven: function() {
        if (cc.settings.clickAnyLinkToConsent) {
            jQuery("a").filter(":not(.cc-link)").unbind("click")
        }
        cc.allagree = true;
        jQuery.each(cc.cookies, function(key, value) {
            if (!value.approved && !value.asked) {
                if (jQuery("#cc-checkbox-" + key).is(":checked")) {
                    if (key == "social" || key == "analytics" || key == "advertising") {
                        cc.remoteCookies[key] = "always";
                        cc.approved[key] = "always"
                    } else {
                        cc.approved[key] = "yes"
                    }
                    cc.cookies[key].asked = true
                } else {
                    if (key == "social" || key == "analytics" || key == "advertising") {
                        cc.remoteCookies[key] = "never";
                        cc.approved[key] = "never"
                    } else {
                        cc.approved[key] = "no"
                    }
                    cc.allagree = false;
                    cc.cookies[key].asked = true
                }
                cc.setcookie("cc_" + key, cc.approved[key], 365)
            } else {}
        });
        urlx = cc.settings.serveraddr + "?p=1&tokenonly=true&cc-key=" + cc.sessionkey;
        if (cc.remoteCookies["social"]) {
            urlx += "&cc-cookies-social=" + cc.approved["social"]
        }
        if (cc.remoteCookies["analytics"]) {
            urlx += "&cc-cookies-analytics=" + cc.approved["analytics"]
        }
        if (cc.remoteCookies["advertising"]) {
            urlx += "&cc-cookies-advertising=" + cc.approved["advertising"]
        }
        cc.reloadkey = true;
        if (!cc.ismobile) {
            jQuery("#cc-notification").slideUp();
            if (cc.settings.bannerPosition == "cc-push") {
                jQuery("html").animate({
                    marginBottom: 0
                }, 400)
            }
        }
        cc.checkapproval();
        return false
    },
    onlocalconsentgiven: function() {
        enableall = false;
        enablejustone = false;
        if (jQuery(this).hasClass("cc-button-enableall") || jQuery(this).hasClass("cc-button-enable-all")) {
            enableall = true;
            jQuery.each(cc.cookies, function(key, value) {
                cc.cookies[key].asked = false
            })
        }
        elem = this;
        jQuery.each(cc.cookies, function(key, value) {
            if (jQuery(elem).hasClass("cc-button-enable-" + key)) {
                enablejustone = true;
                cc.approved[key] = "yes";
                cc.cookies[key].asked = true;
                cc.setcookie("cc_" + key, cc.approved[key], 365)
            }
        });
        cc.allagree = true;
        if (!enablejustone) {
            if (cc.settings.clickAnyLinkToConsent) {
                jQuery("a").filter(":not(.cc-link)").unbind("click")
            }
            jQuery.each(cc.cookies, function(key, value) {
                if (!value.approved && !value.asked) {
                    if (enableall || jQuery("#cc-checkbox-" + key).is(":checked")) {
                        cc.approved[key] = "yes";
                        cc.cookies[key].asked = true
                    } else {
                        cc.approved[key] = "no";
                        cc.cookies[key].asked = true;
                        cc.allagree = false
                    }
                    cc.setcookie("cc_" + key, cc.approved[key], 365)
                } else {}
            })
        }
        if (!cc.allagree && cc.settings.consenttype == "implicit") {
            cc.forcereload = true
        }
        if (!cc.ismobile) {
            jQuery("#cc-notification").slideUp();
            if (cc.settings.bannerPosition == "cc-push") {
                jQuery("html").animate({
                    marginTop: 0
                }, 400)
            }
        }
        cc.checkapproval();
        cc.reloadifnecessary();
        return false
    },
    showminiconsent: function() {
        if (jQuery("#cc-tag").length == 0) {
            data = '<div id="cc-tag" class="cc-tag-' + cc.settings.tagPosition + '"><a class="cc-link" href="#" id="cc-tag-button" title="' + cc.strings.privacySettings + '"><span>' + cc.strings.privacySettings + "</span></a></div>";
            jQuery("body").prepend(data);
            jQuery("#cc-tag").addClass(cc.settings.style);
            if (!cc.settings.hideprivacysettingstab) {
                jQuery("#cc-tag").fadeIn()
            } else {
                jQuery("#cc-tag").hide()
            }
            jQuery(".cc-privacy-link").click(cc.showmodal);
            jQuery("#cc-tag-button").click(cc.showmodal)
        }
    },
    getsize: function(obj) {
        var size = 0,
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++
        }
        return size
    },
    settoken: function(data) {
        if (cc.reloadkey) {
            cc.reloadkey = false;
            if (!cc.allagree && cc.settings.consenttype == "implicit") {
                cc.forcereload = true
            }
            cc.reloadifnecessary()
        }
        cc.sessionkey = data
    },
    showmodal: function() {
        if (!cc.checkedremote && !cc.settings.disableallsites) {
            cc.fetchprefs()
        }
        jQuery(document).bind("keyup", cc.onkeyup);
        jQuery("body").prepend('<div id="cc-modal-overlay"></div>');
        jQuery(this).blur();
        if (cc.ismobile) {
            cc.setupformobile()
        }
        data = '<div id="cc-modal">' + '<div id="cc-modal-wrapper">' + "<h2>" + cc.strings.privacySettingsDialogTitleA + " <span>" + cc.strings.privacySettingsDialogTitleB + "</span></h2>" + '<p class="cc-subtitle">' + cc.strings.privacySettingsDialogSubtitle + "</p>" + '<div class="cc-content">' + "</div>" + '<div class="cc-clear"></div>' + '<p id="cc-modal-closebutton" class="cc-modal-closebutton"><a class="cc-link" href="#" title="' + cc.strings.closeWindow + '"><span>' + cc.strings.closeWindow + "</span></a></p>" + '<div id="cc-modal-footer-buttons">' + '<p id="cc-modal-global"><a class="cc-link" href="#" title="' + cc.strings.changeForAllSitesLink + '"><span>' + cc.strings.changeForAllSitesLink + "</span></a></p></div>" + '<a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="' + cc.strings.poweredBy + '"><span>' + cc.strings.poweredBy + "</span></a> " + '<div class="cc-clear"></div>' + "</div>" + "</div>";
        jQuery("body").prepend(data);
        if (cc.settings.disableallsites) {
            jQuery("#cc-modal-global").hide()
        }
        jQuery("#cc-modal").addClass(cc.settings.style).click(cc.closemodals);
        if (cc.ismobile) {
            jQuery("#cc-modal").addClass("cc-mobile")
        }
        cc.reloadmodal();
        jQuery("#cc-modal").fadeIn();
        jQuery("#cc-modal-overlay").fadeIn();
        jQuery("#cc-modal-wrapper").click(function() {
            cc.noclosewin = true
        });
        jQuery("#cc-modal .cc-modal-closebutton a").click(function() {
            cc.showhidemodal();
            cc.reloadifnecessary();
            return false
        });
        jQuery("#cc-modal-global").click(function() {
            cc.frommodal = true;
            cc.gotosettings();
            return false
        });
        jQuery("#cc-tag-button").unbind("click").click(cc.showhidemodal);
        jQuery(".cc-privacy-link").unbind("click").click(cc.showhidemodal);
        return false
    },
    closepreferencesmodal: function() {
        jQuery.each(cc.defaultCookies, function(key, value) {
            value = jQuery("#cc-globalpreference-selector-" + key).val();
            if (cc.approved[key] != "yes" && cc.approved[key] != "no") {
                cc.approved[key] = value;
                cc.setcookie("cc_" + key, cc.approved[key], 365)
            }
            cc.remoteCookies[key] = value
        });
        urlx = cc.settings.serveraddr + "?p=1&tokenonly=true&cc-key=" + cc.sessionkey;
        if (cc.remoteCookies["social"]) {
            urlx += "&cc-cookies-social=" + cc.remoteCookies["social"]
        }
        if (cc.remoteCookies["analytics"]) {
            urlx += "&cc-cookies-analytics=" + cc.remoteCookies["analytics"]
        }
        if (cc.remoteCookies["advertising"]) {
            urlx += "&cc-cookies-advertising=" + cc.remoteCookies["advertising"]
        }
        cc.insertscript(urlx);
        jQuery("#cc-notification").hide().remove();
        jQuery(this).blur();
        jQuery("#cc-settingsmodal").fadeOut(null, function() {
            jQuery("#cc-settingsmodal").remove()
        });
        if (!cc.frommodal) {
            cc.checkapproval();
            cc.reloadifnecessary()
        } else {
            cc.frommodal = false;
            cc.showhidemodal()
        }
        return false
    },
    showhidemodal: function() {
        jQuery(this).blur();
        cc.checkedlocal = false;
        cc.checkedremote = false;
        if (jQuery("#cc-modal").is(":visible") && !cc.frommodal) {
            cc.closingmodal = true;
            jQuery("#cc-modal-overlay").fadeToggle(null, function() {
                cc.closingmodal = false
            });
            jQuery.each(cc.cookies, function(key, value) {
                thisval = jQuery("#cc-preference-selector-" + key).val();
                if (key == "necessary") {
                    thisval = "yes"
                }
                if (thisval == "no") {
                    cc.cookies[key].approved = false;
                    cc.approved[key] = "no";
                    cc.setcookie("cc_" + key, cc.approved[key], 365)
                } else if (thisval == "yes") {
                    cc.cookies[key].approved = true;
                    cc.approved[key] = "yes";
                    cc.setcookie("cc_" + key, cc.approved[key], 365)
                } else {
                    cc.cookies[key].approved = false;
                    cc.deletecookie(key);
                    delete cc.approved[key]
                }
                cc.cookies[key].asked = false
            });
            cc.checkapproval()
        } else if (!jQuery("#cc-settingsmodal").is(":visible") && !jQuery("#cc-modal").is(":visible")) {
            cc.closingmodal = true;
            jQuery("#cc-modal-overlay").fadeToggle(null, function() {
                cc.closingmodal = false
            })
        }
        if (cc.ismobile) {
            jQuery("#cc-modal").toggle()
        } else {
            jQuery("#cc-modal").fadeToggle()
        }
        return false
    },
    reloadmodal: function() {
        jQuery("#cc-modal-wrapper .cc-content").html("");
        if (cc.getsize(cc.cookies) > 0) {
            jQuery("#cc-modal-wrapper .cc-content").append("<ul></ul>");
            jQuery.each(cc.cookies, function(key, value) {
                jQuery("#cc-modal-wrapper ul").append('<li id="cc-preference-element-' + key + '"><label for="cc-preference-selector-' + key + '"><strong>' + value.title + "</strong><span>" + value.description + '</span></label><select id="cc-preference-selector-' + key + '"><option value="yes">' + cc.strings.preferenceConsent + '</option><option value="no">' + cc.strings.preferenceDecline + "</option></select></li>");
                if (value.link) {
                    jQuery("#cc-preference-element-" + key + " label span").append(' <a target="_blank" href="' + value.link + '" class="cc-learnmore-link">' + cc.strings.learnMore + "</a>")
                }
                if ((key == "social" || key == "advertising" || key == "analytics") && !cc.settings.disableallsites) {
                    jQuery("#cc-preference-selector-" + key).append('<option value="global">' + cc.strings.preferenceUseGlobal + "</option>")
                }
                jQuery("#cc-change-button-allsites").unbind("click").click(function() {
                    cc.frommodal = true;
                    cc.gotosettings();
                    return false
                });
                jQuery("#cc-preference-selector-" + key).change(function() {});
                if (key == "necessary") {
                    jQuery("#cc-preference-selector-" + key).remove()
                }
                if (cc.approved[key] == "yes") {
                    jQuery("#cc-preference-selector-" + key).val("yes")
                } else if (cc.approved[key] == "no") {
                    jQuery("#cc-preference-selector-" + key).val("no")
                } else {
                    jQuery("#cc-preference-selector-" + key).val("global")
                }
            })
        } else {
            jQuery("#cc-modal-wrapper .cc-content").append("<p>" + cc.strings.notUsingCookies + "</p>")
        }
        jQuery(".cc-content").append('<div class="cc-clear"></div>')
    },
    reloadsettingsmodal: function() {
        jQuery("#cc-settingsmodal-wrapper .cc-content").html("");
        if (cc.getsize(cc.defaultCookies) > 0) {
            jQuery("#cc-settingsmodal-wrapper .cc-content").append("<ul></ul>");
            jQuery.each(cc.defaultCookies, function(key, value) {
                jQuery("#cc-settingsmodal-wrapper ul").append('<li id="cc-globalpreference-element-' + key + '"><label for="cc-globalpreference-selector-' + key + '"><strong>' + value.title + "</strong><span>" + value.description + '</span></label><select id="cc-globalpreference-selector-' + key + '"><option value="ask">' + cc.strings.preferenceAsk + '</option><option value="always">' + cc.strings.preferenceAlways + '</option><option value="never">' + cc.strings.preferenceNever + "</option></select></li>");
                if (value.link) {
                    jQuery("#cc-globalpreference-element-" + key + " label span").append(' <a target="_blank" href="' + value.link + '" class="cc-learnmore-link">' + cc.strings.learnMore + "</a>")
                }
                jQuery("#cc-globalpreference-selector-" + key).change(function() {});
                if (cc.remoteCookies[key] == "always") {
                    jQuery("#cc-globalpreference-selector-" + key).val("always")
                } else if (cc.remoteCookies[key] == "never") {
                    jQuery("#cc-globalpreference-selector-" + key).val("never")
                } else {
                    jQuery("#cc-globalpreference-selector-" + key).val("ask")
                }
            })
        } else {
            jQuery("#cc-settingsmodal-wrapper .cc-content").append("<p>" + cc.strings.notUsingCookies + "</p>")
        }
        jQuery("#cc-settingsmodal-wrapper .cc-content").append('<div class="cc-clear"></div>')
    },
    approvedeny: function() {
        key = jQuery(this).attr("id").split("-")[2];
        if (cc.cookies[key].approved) {
            cc.cookies[key].approved = false;
            cc.approved[key] = "no"
        } else {
            cc.cookies[key].approved = true;
            cc.approved[key] = "yes"
        }
        cc.setcookie("cc_" + key, cc.approved[key], 365);
        cc.checkapproval();
        cc.reloadmodal();
        return false
    },
    clearalllocalcookies: function() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
    },
    clearlocal: function() {
        cc.clearalllocalcookies();
        jQuery(this).before("<p>" + cc.strings.clearedCookies + "</p>")
    },
    getcurrenturl: function() {
        return window.location.protocol + "//" + window.location.host + window.location.pathname
    },
    gotosettings: function() {
        if (jQuery("#cc-modal").is(":visible")) {
            cc.showhidemodal()
        }
        jQuery(this).blur();
        if (cc.ismobile) {
            cc.setupformobile();
            jQuery("#cc-notification").remove()
        }
        if (cc.frommodal) {
            buttontext = cc.strings.backToSiteSettings
        } else {
            buttontext = cc.strings.closeWindow
        }
        data = '<div id="cc-settingsmodal">' + '<div id="cc-settingsmodal-wrapper">' + "<h2>" + cc.strings.allSitesSettingsDialogTitleA + " <span>" + cc.strings.allSitesSettingsDialogTitleB + "</span></h2>" + '<p class="cc-subtitle">' + cc.strings.allSitesSettingsDialogSubtitle + "</p>" + '<div class="cc-content">' + "</div>" + '<div class="cc-clear"></div>' + '<p id="cc-settingsmodal-closebutton" class="cc-settingsmodal-closebutton"><a class="cc-link" href="#" title="' + buttontext + '"><span>' + buttontext + "</span></a></p>" + '<div id="cc-settingsmodal-footer-buttons">' + '<p id="cc-settingsmodal-secondclosebutton" class="cc-settingsmodal-closebutton"><a class="cc-link" href="#" title="' + buttontext + '"><span>' + buttontext + "</span></a></p>" + "</div>" + '<a id="cc-notification-logo" class="cc-logo" target="_blank" href="http://silktide.com/cookieconsent" title="' + cc.strings.poweredBy + '"><span>' + cc.strings.poweredBy + "</span></a> " + "</div>" + "</div>";
        jQuery("body").prepend(data);
        cc.reloadsettingsmodal();
        jQuery("#cc-settingsmodal").addClass(cc.settings.style).click(cc.closemodals);
        jQuery("#cc-settingsmodal-wrapper").click(function() {
            cc.noclosewin = true
        });
        if (cc.ismobile) {
            jQuery("#cc-settingsmodal").addClass("cc-mobile")
        }
        jQuery("#cc-settingsmodal").fadeIn();
        jQuery(".cc-settingsmodal-closebutton").click(cc.closepreferencesmodal);
        return false
    },
    setupformobile: function() {
        if (!cc.hassetupmobile) {
            cc.hassetupmobile = true;
            jQuery("head").append('<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">');
            if (cc.settings.style == "cc-light") {
                bgcol = "#e1e1e1"
            } else {
                bgcol = "#1d1d1d"
            }
            jQuery("body").html("").css("margin", 0).css("width", "auto").css("backgroundColor", bgcol).css("backgroundImage", "none")
        }
    },
    onfirstload: function() {
        if (!cc.setupcomplete && cc.initobj) {
            if (!window.jQuery) {
                cc.jqueryattempts++;
                if (cc.jqueryattempts >= 5) {
                    return
                }
                setTimeout(cc.onfirstload, 200);
                return
            }
            cc.setupcomplete = true;
            cc.setup()
        }
        setTimeout(cc.afterload, 50);
        cc.checkapproval()
    },
    afterload: function() {
        jQuery(".cc-button-enableall").addClass("cc-link").click(cc.onlocalconsentgiven);
        jQuery(".cc-button-enable-all").addClass("cc-link").click(cc.onlocalconsentgiven);
        jQuery.each(cc.cookies, function(key, value) {
            jQuery(".cc-button-enable-" + key).addClass("cc-link").click(cc.onlocalconsentgiven)
        })
    }
};
if (!window.jQuery) {
    var s = document.createElement("script");
    s.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js");
    s.setAttribute("type", "text/javascript");
    document.getElementsByTagName("head")[0].appendChild(s);
    if (window.onload != null) {
        var oldOnload = window.onload;
        window.onload = function(e) {
            oldOnload(e);
            cc.onfirstload()
        }
    } else {
        window.onload = cc.onfirstload
    }
} else {
    jQuery(document).ready(cc.onfirstload)
}(function(a) {
    cc.ismobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
})(navigator.userAgent || navigator.vendor || window.opera);
WebFontConfig = {
    google: {
        families: ["Open+Sans:400,600:latin"]
    }
};
(function() {
    var wf = document.createElement("script");
    wf.src = ("https:" == document.location.protocol ? "https" : "http") + "://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
    wf.type = "text/javascript";
    wf.async = "true";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(wf, s)
})();
! function() {
    "use strict";
    var e = function() {
        this.init()
    };
    e.prototype = {
        init: function() {
            var e = this || n;
            return e._counter = 1e3, e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.mobileAutoEnable = !0, e._setup(), e
        },
        volume: function(e) {
            var o = this || n;
            if (e = parseFloat(e), o.ctx || _(), void 0 !== e && e >= 0 && e <= 1) {
                if (o._volume = e, o._muted) return o;
                o.usingWebAudio && (o.masterGain.gain.value = e);
                for (var t = 0; t < o._howls.length; t++)
                    if (!o._howls[t]._webAudio)
                        for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
                            var u = o._howls[t]._soundById(r[a]);
                            u && u._node && (u._node.volume = u._volume * e)
                        }
                return o
            }
            return o._volume
        },
        mute: function(e) {
            var o = this || n;
            o.ctx || _(), o._muted = e, o.usingWebAudio && (o.masterGain.gain.value = e ? 0 : o._volume);
            for (var t = 0; t < o._howls.length; t++)
                if (!o._howls[t]._webAudio)
                    for (var r = o._howls[t]._getSoundIds(), a = 0; a < r.length; a++) {
                        var u = o._howls[t]._soundById(r[a]);
                        u && u._node && (u._node.muted = !!e || u._muted)
                    }
            return o
        },
        unload: function() {
            for (var e = this || n, o = e._howls.length - 1; o >= 0; o--) e._howls[o].unload();
            return e.usingWebAudio && e.ctx && void 0 !== e.ctx.close && (e.ctx.close(), e.ctx = null, _()), e
        },
        codecs: function(e) {
            return (this || n)._codecs[e.replace(/^x-/, "")]
        },
        _setup: function() {
            var e = this || n;
            if (e.state = e.ctx ? e.ctx.state || "running" : "running", e._autoSuspend(), !e.usingWebAudio)
                if ("undefined" != typeof Audio) try {
                    var o = new Audio;
                    void 0 === o.oncanplaythrough && (e._canPlayEvent = "canplay")
                } catch (n) {
                    e.noAudio = !0
                } else e.noAudio = !0;
            try {
                var o = new Audio;
                o.muted && (e.noAudio = !0)
            } catch (e) {}
            return e.noAudio || e._setupCodecs(), e
        },
        _setupCodecs: function() {
            var e = this || n,
                o = null;
            try {
                o = "undefined" != typeof Audio ? new Audio : null
            } catch (n) {
                return e
            }
            if (!o || "function" != typeof o.canPlayType) return e;
            var t = o.canPlayType("audio/mpeg;").replace(/^no$/, ""),
                r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
                a = r && parseInt(r[0].split("/")[1], 10) < 33;
            return e._codecs = {
                mp3: !(a || !t && !o.canPlayType("audio/mp3;").replace(/^no$/, "")),
                mpeg: !!t,
                opus: !!o.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                oga: !!o.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!o.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                aac: !!o.canPlayType("audio/aac;").replace(/^no$/, ""),
                caf: !!o.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                m4a: !!(o.canPlayType("audio/x-m4a;") || o.canPlayType("audio/m4a;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(o.canPlayType("audio/x-mp4;") || o.canPlayType("audio/mp4;") || o.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                webm: !!o.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                dolby: !!o.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                flac: !!(o.canPlayType("audio/x-flac;") || o.canPlayType("audio/flac;")).replace(/^no$/, "")
            }, e
        },
        _enableMobileAudio: function() {
            var e = this || n,
                o = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator && e._navigator.userAgent),
                t = !!("ontouchend" in window || e._navigator && e._navigator.maxTouchPoints > 0 || e._navigator && e._navigator.msMaxTouchPoints > 0);
            if (!e._mobileEnabled && e.ctx && (o || t)) {
                e._mobileEnabled = !1, e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0, e.unload()), e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
                var r = function() {
                    n._autoResume();
                    var o = e.ctx.createBufferSource();
                    o.buffer = e._scratchBuffer, o.connect(e.ctx.destination), void 0 === o.start ? o.noteOn(0) : o.start(0), "function" == typeof e.ctx.resume && e.ctx.resume(), o.onended = function() {
                        o.disconnect(0), e._mobileEnabled = !0, e.mobileAutoEnable = !1, document.removeEventListener("touchend", r, !0)
                    }
                };
                return document.addEventListener("touchend", r, !0), e
            }
        },
        _autoSuspend: function() {
            var e = this;
            if (e.autoSuspend && e.ctx && void 0 !== e.ctx.suspend && n.usingWebAudio) {
                for (var o = 0; o < e._howls.length; o++)
                    if (e._howls[o]._webAudio)
                        for (var t = 0; t < e._howls[o]._sounds.length; t++)
                            if (!e._howls[o]._sounds[t]._paused) return e;
                return e._suspendTimer && clearTimeout(e._suspendTimer), e._suspendTimer = setTimeout(function() {
                    e.autoSuspend && (e._suspendTimer = null, e.state = "suspending", e.ctx.suspend().then(function() {
                        e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume())
                    }))
                }, 3e4), e
            }
        },
        _autoResume: function() {
            var e = this;
            if (e.ctx && void 0 !== e.ctx.resume && n.usingWebAudio) return "running" === e.state && e._suspendTimer ? (clearTimeout(e._suspendTimer), e._suspendTimer = null) : "suspended" === e.state ? (e.ctx.resume().then(function() {
                e.state = "running";
                for (var n = 0; n < e._howls.length; n++) e._howls[n]._emit("resume")
            }), e._suspendTimer && (clearTimeout(e._suspendTimer), e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0), e
        }
    };
    var n = new e,
        o = function(e) {
            var n = this;
            if (!e.src || 0 === e.src.length) return void console.error("An array of source files must be passed with any new Howl.");
            n.init(e)
        };
    o.prototype = {
        init: function(e) {
            var o = this;
            return n.ctx || _(), o._autoplay = e.autoplay || !1, o._format = "string" != typeof e.format ? e.format : [e.format], o._html5 = e.html5 || !1, o._muted = e.mute || !1, o._loop = e.loop || !1, o._pool = e.pool || 5, o._preload = "boolean" != typeof e.preload || e.preload, o._rate = e.rate || 1, o._sprite = e.sprite || {}, o._src = "string" != typeof e.src ? e.src : [e.src], o._volume = void 0 !== e.volume ? e.volume : 1, o._duration = 0, o._state = "unloaded", o._sounds = [], o._endTimers = {}, o._queue = [], o._onend = e.onend ? [{
                fn: e.onend
            }] : [], o._onfade = e.onfade ? [{
                fn: e.onfade
            }] : [], o._onload = e.onload ? [{
                fn: e.onload
            }] : [], o._onloaderror = e.onloaderror ? [{
                fn: e.onloaderror
            }] : [], o._onpause = e.onpause ? [{
                fn: e.onpause
            }] : [], o._onplay = e.onplay ? [{
                fn: e.onplay
            }] : [], o._onstop = e.onstop ? [{
                fn: e.onstop
            }] : [], o._onmute = e.onmute ? [{
                fn: e.onmute
            }] : [], o._onvolume = e.onvolume ? [{
                fn: e.onvolume
            }] : [], o._onrate = e.onrate ? [{
                fn: e.onrate
            }] : [], o._onseek = e.onseek ? [{
                fn: e.onseek
            }] : [], o._onresume = [], o._webAudio = n.usingWebAudio && !o._html5, void 0 !== n.ctx && n.ctx && n.mobileAutoEnable && n._enableMobileAudio(), n._howls.push(o), o._autoplay && o._queue.push({
                event: "play",
                action: function() {
                    o.play()
                }
            }), o._preload && o.load(), o
        },
        load: function() {
            var e = this,
                o = null;
            if (n.noAudio) return void e._emit("loaderror", null, "No audio support.");
            "string" == typeof e._src && (e._src = [e._src]);
            for (var r = 0; r < e._src.length; r++) {
                var u, i;
                if (e._format && e._format[r]) u = e._format[r];
                else {
                    if ("string" != typeof(i = e._src[r])) {
                        e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                        continue
                    }
                    u = /^data:audio\/([^;,]+);/i.exec(i), u || (u = /\.([^.]+)$/.exec(i.split("?", 1)[0])), u && (u = u[1].toLowerCase())
                }
                if (u || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'), u && n.codecs(u)) {
                    o = e._src[r];
                    break
                }
            }
            return o ? (e._src = o, e._state = "loading", "https:" === window.location.protocol && "http:" === o.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new t(e), e._webAudio && a(e), e) : void e._emit("loaderror", null, "No codec support for selected audio sources.")
        },
        play: function(e, o) {
            var t = this,
                r = null;
            if ("number" == typeof e) r = e, e = null;
            else {
                if ("string" == typeof e && "loaded" === t._state && !t._sprite[e]) return null;
                if (void 0 === e) {
                    e = "__default";
                    for (var a = 0, u = 0; u < t._sounds.length; u++) t._sounds[u]._paused && !t._sounds[u]._ended && (a++, r = t._sounds[u]._id);
                    1 === a ? e = null : r = null
                }
            }
            var i = r ? t._soundById(r) : t._inactiveSound();
            if (!i) return null;
            if (r && !e && (e = i._sprite || "__default"), "loaded" !== t._state) {
                i._sprite = e, i._ended = !1;
                var d = i._id;
                return t._queue.push({
                    event: "play",
                    action: function() {
                        t.play(d)
                    }
                }), d
            }
            if (r && !i._paused) return o || setTimeout(function() {
                t._emit("play", i._id)
            }, 0), i._id;
            t._webAudio && n._autoResume();
            var _ = Math.max(0, i._seek > 0 ? i._seek : t._sprite[e][0] / 1e3),
                s = Math.max(0, (t._sprite[e][0] + t._sprite[e][1]) / 1e3 - _),
                l = 1e3 * s / Math.abs(i._rate);
            i._paused = !1, i._ended = !1, i._sprite = e, i._seek = _, i._start = t._sprite[e][0] / 1e3, i._stop = (t._sprite[e][0] + t._sprite[e][1]) / 1e3, i._loop = !(!i._loop && !t._sprite[e][2]);
            var c = i._node;
            if (t._webAudio) {
                var f = function() {
                        t._refreshBuffer(i);
                        var e = i._muted || t._muted ? 0 : i._volume;
                        c.gain.setValueAtTime(e, n.ctx.currentTime), i._playStart = n.ctx.currentTime, void 0 === c.bufferSource.start ? i._loop ? c.bufferSource.noteGrainOn(0, _, 86400) : c.bufferSource.noteGrainOn(0, _, s) : i._loop ? c.bufferSource.start(0, _, 86400) : c.bufferSource.start(0, _, s), l !== 1 / 0 && (t._endTimers[i._id] = setTimeout(t._ended.bind(t, i), l)), o || setTimeout(function() {
                            t._emit("play", i._id)
                        }, 0)
                    },
                    p = "running" === n.state;
                if ("loaded" === t._state && p) f();
                else {
                    var v = p || "loaded" !== t._state ? "load" : "resume";
                    t.once(v, f, p ? i._id : null), t._clearTimer(i._id)
                }
            } else {
                var m = function() {
                        c.currentTime = _, c.muted = i._muted || t._muted || n._muted || c.muted, c.volume = i._volume * n.volume(), c.playbackRate = i._rate, c.play(), l !== 1 / 0 && (t._endTimers[i._id] = setTimeout(t._ended.bind(t, i), l)), o || t._emit("play", i._id)
                    },
                    h = "loaded" === t._state && (window && window.ejecta || !c.readyState && n._navigator.isCocoonJS);
                if (4 === c.readyState || h) m();
                else {
                    var g = function() {
                        m(), c.removeEventListener(n._canPlayEvent, g, !1)
                    };
                    c.addEventListener(n._canPlayEvent, g, !1), t._clearTimer(i._id)
                }
            }
            return i._id
        },
        pause: function(e) {
            var n = this;
            if ("loaded" !== n._state) return n._queue.push({
                event: "pause",
                action: function() {
                    n.pause(e)
                }
            }), n;
            for (var o = n._getSoundIds(e), t = 0; t < o.length; t++) {
                n._clearTimer(o[t]);
                var r = n._soundById(o[t]);
                if (r && !r._paused && (r._seek = n.seek(o[t]), r._rateSeek = 0, r._paused = !0, n._stopFade(o[t]), r._node))
                    if (n._webAudio) {
                        if (!r._node.bufferSource) continue;
                        void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), n._cleanBuffer(r._node)
                    } else isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause();
                arguments[1] || n._emit("pause", r ? r._id : null)
            }
            return n
        },
        stop: function(e, n) {
            var o = this;
            if ("loaded" !== o._state) return o._queue.push({
                event: "stop",
                action: function() {
                    o.stop(e)
                }
            }), o;
            for (var t = o._getSoundIds(e), r = 0; r < t.length; r++) {
                o._clearTimer(t[r]);
                var a = o._soundById(t[r]);
                a && (a._seek = a._start || 0, a._rateSeek = 0, a._paused = !0, a._ended = !0, o._stopFade(t[r]), a._node && (o._webAudio ? a._node.bufferSource && (void 0 === a._node.bufferSource.stop ? a._node.bufferSource.noteOff(0) : a._node.bufferSource.stop(0), o._cleanBuffer(a._node)) : isNaN(a._node.duration) && a._node.duration !== 1 / 0 || (a._node.currentTime = a._start || 0, a._node.pause())), n || o._emit("stop", a._id))
            }
            return o
        },
        mute: function(e, o) {
            var t = this;
            if ("loaded" !== t._state) return t._queue.push({
                event: "mute",
                action: function() {
                    t.mute(e, o)
                }
            }), t;
            if (void 0 === o) {
                if ("boolean" != typeof e) return t._muted;
                t._muted = e
            }
            for (var r = t._getSoundIds(o), a = 0; a < r.length; a++) {
                var u = t._soundById(r[a]);
                u && (u._muted = e, t._webAudio && u._node ? u._node.gain.setValueAtTime(e ? 0 : u._volume, n.ctx.currentTime) : u._node && (u._node.muted = !!n._muted || e), t._emit("mute", u._id))
            }
            return t
        },
        volume: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) return t._volume;
            if (1 === r.length || 2 === r.length && void 0 === r[1]) {
                t._getSoundIds().indexOf(r[0]) >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else r.length >= 2 && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            var a;
            if (!(void 0 !== e && e >= 0 && e <= 1)) return a = o ? t._soundById(o) : t._sounds[0], a ? a._volume : 0;
            if ("loaded" !== t._state) return t._queue.push({
                event: "volume",
                action: function() {
                    t.volume.apply(t, r)
                }
            }), t;
            void 0 === o && (t._volume = e), o = t._getSoundIds(o);
            for (var u = 0; u < o.length; u++)(a = t._soundById(o[u])) && (a._volume = e, r[2] || t._stopFade(o[u]), t._webAudio && a._node && !a._muted ? a._node.gain.setValueAtTime(e, n.ctx.currentTime) : a._node && !a._muted && (a._node.volume = e * n.volume()), t._emit("volume", a._id));
            return t
        },
        fade: function(e, o, t, r) {
            var a = this,
                u = Math.abs(e - o),
                i = e > o ? "out" : "in",
                d = u / .01,
                _ = d > 0 ? t / d : t;
            if (_ < 4 && (d = Math.ceil(d / (4 / _)), _ = 4), "loaded" !== a._state) return a._queue.push({
                event: "fade",
                action: function() {
                    a.fade(e, o, t, r)
                }
            }), a;
            a.volume(e, r);
            for (var s = a._getSoundIds(r), l = 0; l < s.length; l++) {
                var c = a._soundById(s[l]);
                if (c) {
                    if (r || a._stopFade(s[l]), a._webAudio && !c._muted) {
                        var f = n.ctx.currentTime,
                            p = f + t / 1e3;
                        c._volume = e, c._node.gain.setValueAtTime(e, f), c._node.gain.linearRampToValueAtTime(o, p)
                    }
                    var v = e;
                    c._interval = setInterval(function(n, t) {
                        d > 0 && (v += "in" === i ? .01 : -.01), v = Math.max(0, v), v = Math.min(1, v), v = Math.round(100 * v) / 100, a._webAudio ? (void 0 === r && (a._volume = v), t._volume = v) : a.volume(v, n, !0), (o < e && v <= o || o > e && v >= o) && (clearInterval(t._interval), t._interval = null, a.volume(o, n), a._emit("fade", n))
                    }.bind(a, s[l], c), _)
                }
            }
            return a
        },
        _stopFade: function(e) {
            var o = this,
                t = o._soundById(e);
            return t && t._interval && (o._webAudio && t._node.gain.cancelScheduledValues(n.ctx.currentTime), clearInterval(t._interval), t._interval = null, o._emit("fade", e)), o
        },
        loop: function() {
            var e, n, o, t = this,
                r = arguments;
            if (0 === r.length) return t._loop;
            if (1 === r.length) {
                if ("boolean" != typeof r[0]) return !!(o = t._soundById(parseInt(r[0], 10))) && o._loop;
                e = r[0], t._loop = e
            } else 2 === r.length && (e = r[0], n = parseInt(r[1], 10));
            for (var a = t._getSoundIds(n), u = 0; u < a.length; u++)(o = t._soundById(a[u])) && (o._loop = e, t._webAudio && o._node && o._node.bufferSource && (o._node.bufferSource.loop = e, e && (o._node.bufferSource.loopStart = o._start || 0, o._node.bufferSource.loopEnd = o._stop)));
            return t
        },
        rate: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) o = t._sounds[0]._id;
            else if (1 === r.length) {
                var a = t._getSoundIds(),
                    u = a.indexOf(r[0]);
                u >= 0 ? o = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            var i;
            if ("number" != typeof e) return i = t._soundById(o), i ? i._rate : t._rate;
            if ("loaded" !== t._state) return t._queue.push({
                event: "rate",
                action: function() {
                    t.rate.apply(t, r)
                }
            }), t;
            void 0 === o && (t._rate = e), o = t._getSoundIds(o);
            for (var d = 0; d < o.length; d++)
                if (i = t._soundById(o[d])) {
                    i._rateSeek = t.seek(o[d]), i._playStart = t._webAudio ? n.ctx.currentTime : i._playStart, i._rate = e, t._webAudio && i._node && i._node.bufferSource ? i._node.bufferSource.playbackRate.value = e : i._node && (i._node.playbackRate = e);
                    var _ = t.seek(o[d]),
                        s = (t._sprite[i._sprite][0] + t._sprite[i._sprite][1]) / 1e3 - _,
                        l = 1e3 * s / Math.abs(i._rate);
                    !t._endTimers[o[d]] && i._paused || (t._clearTimer(o[d]), t._endTimers[o[d]] = setTimeout(t._ended.bind(t, i), l)), t._emit("rate", i._id)
                }
            return t
        },
        seek: function() {
            var e, o, t = this,
                r = arguments;
            if (0 === r.length) o = t._sounds[0]._id;
            else if (1 === r.length) {
                var a = t._getSoundIds(),
                    u = a.indexOf(r[0]);
                u >= 0 ? o = parseInt(r[0], 10) : (o = t._sounds[0]._id, e = parseFloat(r[0]))
            } else 2 === r.length && (e = parseFloat(r[0]), o = parseInt(r[1], 10));
            if (void 0 === o) return t;
            if ("loaded" !== t._state) return t._queue.push({
                event: "seek",
                action: function() {
                    t.seek.apply(t, r)
                }
            }), t;
            var i = t._soundById(o);
            if (i) {
                if (!("number" == typeof e && e >= 0)) {
                    if (t._webAudio) {
                        var d = t.playing(o) ? n.ctx.currentTime - i._playStart : 0,
                            _ = i._rateSeek ? i._rateSeek - i._seek : 0;
                        return i._seek + (_ + d * Math.abs(i._rate))
                    }
                    return i._node.currentTime
                }
                var s = t.playing(o);
                s && t.pause(o, !0), i._seek = e, i._ended = !1, t._clearTimer(o), s && t.play(o, !0), !t._webAudio && i._node && (i._node.currentTime = e), t._emit("seek", o)
            }
            return t
        },
        playing: function(e) {
            var n = this;
            if ("number" == typeof e) {
                var o = n._soundById(e);
                return !!o && !o._paused
            }
            for (var t = 0; t < n._sounds.length; t++)
                if (!n._sounds[t]._paused) return !0;
            return !1
        },
        duration: function(e) {
            var n = this,
                o = n._duration,
                t = n._soundById(e);
            return t && (o = n._sprite[t._sprite][1] / 1e3), o
        },
        state: function() {
            return this._state
        },
        unload: function() {
            for (var e = this, o = e._sounds, t = 0; t < o.length; t++) {
                if (o[t]._paused || e.stop(o[t]._id), !e._webAudio) {
                    /MSIE |Trident\//.test(n._navigator && n._navigator.userAgent) || (o[t]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"), o[t]._node.removeEventListener("error", o[t]._errorFn, !1), o[t]._node.removeEventListener(n._canPlayEvent, o[t]._loadFn, !1)
                }
                delete o[t]._node, e._clearTimer(o[t]._id);
                var a = n._howls.indexOf(e);
                a >= 0 && n._howls.splice(a, 1)
            }
            var u = !0;
            for (t = 0; t < n._howls.length; t++)
                if (n._howls[t]._src === e._src) {
                    u = !1;
                    break
                }
            return r && u && delete r[e._src], n.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null, null
        },
        on: function(e, n, o, t) {
            var r = this,
                a = r["_on" + e];
            return "function" == typeof n && a.push(t ? {
                id: o,
                fn: n,
                once: t
            } : {
                id: o,
                fn: n
            }), r
        },
        off: function(e, n, o) {
            var t = this,
                r = t["_on" + e],
                a = 0;
            if ("number" == typeof n && (o = n, n = null), n || o)
                for (a = 0; a < r.length; a++) {
                    var u = o === r[a].id;
                    if (n === r[a].fn && u || !n && u) {
                        r.splice(a, 1);
                        break
                    }
                } else if (e) t["_on" + e] = [];
                else {
                    var i = Object.keys(t);
                    for (a = 0; a < i.length; a++) 0 === i[a].indexOf("_on") && Array.isArray(t[i[a]]) && (t[i[a]] = [])
                }
            return t
        },
        once: function(e, n, o) {
            var t = this;
            return t.on(e, n, o, 1), t
        },
        _emit: function(e, n, o) {
            for (var t = this, r = t["_on" + e], a = r.length - 1; a >= 0; a--) r[a].id && r[a].id !== n && "load" !== e || (setTimeout(function(e) {
                e.call(this, n, o)
            }.bind(t, r[a].fn), 0), r[a].once && t.off(e, r[a].fn, r[a].id));
            return t
        },
        _loadQueue: function() {
            var e = this;
            if (e._queue.length > 0) {
                var n = e._queue[0];
                e.once(n.event, function() {
                    e._queue.shift(), e._loadQueue()
                }), n.action()
            }
            return e
        },
        _ended: function(e) {
            var o = this,
                t = e._sprite;
            if (!o._webAudio && o._node && !o._node.ended) return setTimeout(o._ended.bind(o, e), 100), o;
            var r = !(!e._loop && !o._sprite[t][2]);
            if (o._emit("end", e._id), !o._webAudio && r && o.stop(e._id, !0).play(e._id), o._webAudio && r) {
                o._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = n.ctx.currentTime;
                var a = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                o._endTimers[e._id] = setTimeout(o._ended.bind(o, e), a)
            }
            return o._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, o._clearTimer(e._id), o._cleanBuffer(e._node), n._autoSuspend()), o._webAudio || r || o.stop(e._id), o
        },
        _clearTimer: function(e) {
            var n = this;
            return n._endTimers[e] && (clearTimeout(n._endTimers[e]), delete n._endTimers[e]), n
        },
        _soundById: function(e) {
            for (var n = this, o = 0; o < n._sounds.length; o++)
                if (e === n._sounds[o]._id) return n._sounds[o];
            return null
        },
        _inactiveSound: function() {
            var e = this;
            e._drain();
            for (var n = 0; n < e._sounds.length; n++)
                if (e._sounds[n]._ended) return e._sounds[n].reset();
            return new t(e)
        },
        _drain: function() {
            var e = this,
                n = e._pool,
                o = 0,
                t = 0;
            if (!(e._sounds.length < n)) {
                for (t = 0; t < e._sounds.length; t++) e._sounds[t]._ended && o++;
                for (t = e._sounds.length - 1; t >= 0; t--) {
                    if (o <= n) return;
                    e._sounds[t]._ended && (e._webAudio && e._sounds[t]._node && e._sounds[t]._node.disconnect(0), e._sounds.splice(t, 1), o--)
                }
            }
        },
        _getSoundIds: function(e) {
            var n = this;
            if (void 0 === e) {
                for (var o = [], t = 0; t < n._sounds.length; t++) o.push(n._sounds[t]._id);
                return o
            }
            return [e]
        },
        _refreshBuffer: function(e) {
            var o = this;
            return e._node.bufferSource = n.ctx.createBufferSource(), e._node.bufferSource.buffer = r[o._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.value = e._rate, o
        },
        _cleanBuffer: function(e) {
            var n = this;
            if (n._scratchBuffer) {
                e.bufferSource.onended = null, e.bufferSource.disconnect(0);
                try {
                    e.bufferSource.buffer = n._scratchBuffer
                } catch (e) {}
            }
            return e.bufferSource = null, n
        }
    };
    var t = function(e) {
        this._parent = e, this.init()
    };
    t.prototype = {
        init: function() {
            var e = this,
                o = e._parent;
            return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, o._sounds.push(e), e.create(), e
        },
        create: function() {
            var e = this,
                o = e._parent,
                t = n._muted || e._muted || e._parent._muted ? 0 : e._volume;
            return o._webAudio ? (e._node = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), e._node.gain.setValueAtTime(t, n.ctx.currentTime), e._node.paused = !0, e._node.connect(n.masterGain)) : (e._node = new Audio, e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(n._canPlayEvent, e._loadFn, !1), e._node.src = o._src, e._node.preload = "auto", e._node.volume = t * n.volume(), e._node.load()), e
        },
        reset: function() {
            var e = this,
                o = e._parent;
            return e._muted = o._muted, e._loop = o._loop, e._volume = o._volume, e._rate = o._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = ++n._counter, e
        },
        _errorListener: function() {
            var e = this;
            e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorFn, !1)
        },
        _loadListener: function() {
            var e = this,
                o = e._parent;
            o._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(o._sprite).length && (o._sprite = {
                __default: [0, 1e3 * o._duration]
            }), "loaded" !== o._state && (o._state = "loaded", o._emit("load"), o._loadQueue()), e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1)
        }
    };
    var r = {},
        a = function(e) {
            var n = e._src;
            if (r[n]) return e._duration = r[n].duration, void d(e);
            if (/^data:[^;]+;base64,/.test(n)) {
                for (var o = atob(n.split(",")[1]), t = new Uint8Array(o.length), a = 0; a < o.length; ++a) t[a] = o.charCodeAt(a);
                i(t.buffer, e)
            } else {
                var _ = new XMLHttpRequest;
                _.open("GET", n, !0), _.responseType = "arraybuffer", _.onload = function() {
                    var n = (_.status + "")[0];
                    if ("0" !== n && "2" !== n && "3" !== n) return void e._emit("loaderror", null, "Failed loading audio file with status: " + _.status + ".");
                    i(_.response, e)
                }, _.onerror = function() {
                    e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete r[n], e.load())
                }, u(_)
            }
        },
        u = function(e) {
            try {
                e.send()
            } catch (n) {
                e.onerror()
            }
        },
        i = function(e, o) {
            n.ctx.decodeAudioData(e, function(e) {
                e && o._sounds.length > 0 && (r[o._src] = e, d(o, e))
            }, function() {
                o._emit("loaderror", null, "Decoding audio data failed.")
            })
        },
        d = function(e, n) {
            n && !e._duration && (e._duration = n.duration), 0 === Object.keys(e._sprite).length && (e._sprite = {
                __default: [0, 1e3 * e._duration]
            }), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue())
        },
        _ = function() {
            try {
                "undefined" != typeof AudioContext ? n.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? n.ctx = new webkitAudioContext : n.usingWebAudio = !1
            } catch (e) {
                n.usingWebAudio = !1
            }
            var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform),
                o = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
                t = o ? parseInt(o[1], 10) : null;
            if (e && t && t < 9) {
                var r = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase());
                (n._navigator && n._navigator.standalone && !r || n._navigator && !n._navigator.standalone && !r) && (n.usingWebAudio = !1)
            }
            n.usingWebAudio && (n.masterGain = void 0 === n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), n.masterGain.gain.value = n._muted ? 0 : 1, n.masterGain.connect(n.ctx.destination)), n._setup()
        };
    "function" == typeof define && define.amd && define([], function() {
        return {
            Howler: n,
            Howl: o
        }
    }), "undefined" != typeof exports && (exports.Howler = n, exports.Howl = o), "undefined" != typeof window ? (window.HowlerGlobal = e, window.Howler = n, window.Howl = o, window.Sound = t) : "undefined" != typeof global && (global.HowlerGlobal = e, global.Howler = n, global.Howl = o, global.Sound = t)
}();
! function() {
    "use strict";
    HowlerGlobal.prototype._pos = [0, 0, 0], HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0], HowlerGlobal.prototype.stereo = function(n) {
        var e = this;
        if (!e.ctx || !e.ctx.listener) return e;
        for (var o = e._howls.length - 1; o >= 0; o--) e._howls[o].stereo(n);
        return e
    }, HowlerGlobal.prototype.pos = function(n, e, o) {
        var t = this;
        return t.ctx && t.ctx.listener ? (e = "number" != typeof e ? t._pos[1] : e, o = "number" != typeof o ? t._pos[2] : o, "number" != typeof n ? t._pos : (t._pos = [n, e, o], t.ctx.listener.setPosition(t._pos[0], t._pos[1], t._pos[2]), t)) : t
    }, HowlerGlobal.prototype.orientation = function(n, e, o, t, r, i) {
        var a = this;
        if (!a.ctx || !a.ctx.listener) return a;
        var p = a._orientation;
        return e = "number" != typeof e ? p[1] : e, o = "number" != typeof o ? p[2] : o, t = "number" != typeof t ? p[3] : t, r = "number" != typeof r ? p[4] : r, i = "number" != typeof i ? p[5] : i, "number" != typeof n ? p : (a._orientation = [n, e, o, t, r, i], a.ctx.listener.setOrientation(n, e, o, t, r, i), a)
    }, Howl.prototype.init = function(n) {
        return function(e) {
            var o = this;
            return o._orientation = e.orientation || [1, 0, 0], o._stereo = e.stereo || null, o._pos = e.pos || null, o._pannerAttr = {
                coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : 360,
                coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : 360,
                coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : 0,
                distanceModel: void 0 !== e.distanceModel ? e.distanceModel : "inverse",
                maxDistance: void 0 !== e.maxDistance ? e.maxDistance : 1e4,
                panningModel: void 0 !== e.panningModel ? e.panningModel : "HRTF",
                refDistance: void 0 !== e.refDistance ? e.refDistance : 1,
                rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : 1
            }, o._onstereo = e.onstereo ? [{
                fn: e.onstereo
            }] : [], o._onpos = e.onpos ? [{
                fn: e.onpos
            }] : [], o._onorientation = e.onorientation ? [{
                fn: e.onorientation
            }] : [], n.call(this, e)
        }
    }(Howl.prototype.init), Howl.prototype.stereo = function(e, o) {
        var t = this;
        if (!t._webAudio) return t;
        if ("loaded" !== t._state) return t._queue.push({
            event: "stereo",
            action: function() {
                t.stereo(e, o)
            }
        }), t;
        var r = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";
        if (void 0 === o) {
            if ("number" != typeof e) return t._stereo;
            t._stereo = e, t._pos = [e, 0, 0]
        }
        for (var i = t._getSoundIds(o), a = 0; a < i.length; a++) {
            var p = t._soundById(i[a]);
            if (p) {
                if ("number" != typeof e) return p._stereo;
                p._stereo = e, p._pos = [e, 0, 0], p._node && (p._pannerAttr.panningModel = "equalpower", p._panner && p._panner.pan || n(p, r), "spatial" === r ? p._panner.setPosition(e, 0, 0) : p._panner.pan.value = e), t._emit("stereo", p._id)
            }
        }
        return t
    }, Howl.prototype.pos = function(e, o, t, r) {
        var i = this;
        if (!i._webAudio) return i;
        if ("loaded" !== i._state) return i._queue.push({
            event: "pos",
            action: function() {
                i.pos(e, o, t, r)
            }
        }), i;
        if (o = "number" != typeof o ? 0 : o, t = "number" != typeof t ? -.5 : t, void 0 === r) {
            if ("number" != typeof e) return i._pos;
            i._pos = [e, o, t]
        }
        for (var a = i._getSoundIds(r), p = 0; p < a.length; p++) {
            var s = i._soundById(a[p]);
            if (s) {
                if ("number" != typeof e) return s._pos;
                s._pos = [e, o, t], s._node && (s._panner && !s._panner.pan || n(s, "spatial"), s._panner.setPosition(e, o, t)), i._emit("pos", s._id)
            }
        }
        return i
    }, Howl.prototype.orientation = function(e, o, t, r) {
        var i = this;
        if (!i._webAudio) return i;
        if ("loaded" !== i._state) return i._queue.push({
            event: "orientation",
            action: function() {
                i.orientation(e, o, t, r)
            }
        }), i;
        if (o = "number" != typeof o ? i._orientation[1] : o, t = "number" != typeof t ? i._orientation[2] : t, void 0 === r) {
            if ("number" != typeof e) return i._orientation;
            i._orientation = [e, o, t]
        }
        for (var a = i._getSoundIds(r), p = 0; p < a.length; p++) {
            var s = i._soundById(a[p]);
            if (s) {
                if ("number" != typeof e) return s._orientation;
                s._orientation = [e, o, t], s._node && (s._panner || (s._pos || (s._pos = i._pos || [0, 0, -.5]), n(s, "spatial")), s._panner.setOrientation(e, o, t)), i._emit("orientation", s._id)
            }
        }
        return i
    }, Howl.prototype.pannerAttr = function() {
        var e, o, t, r = this,
            i = arguments;
        if (!r._webAudio) return r;
        if (0 === i.length) return r._pannerAttr;
        if (1 === i.length) {
            if ("object" != typeof i[0]) return t = r._soundById(parseInt(i[0], 10)), t ? t._pannerAttr : r._pannerAttr;
            e = i[0], void 0 === o && (r._pannerAttr = {
                coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : r._coneInnerAngle,
                coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : r._coneOuterAngle,
                coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : r._coneOuterGain,
                distanceModel: void 0 !== e.distanceModel ? e.distanceModel : r._distanceModel,
                maxDistance: void 0 !== e.maxDistance ? e.maxDistance : r._maxDistance,
                panningModel: void 0 !== e.panningModel ? e.panningModel : r._panningModel,
                refDistance: void 0 !== e.refDistance ? e.refDistance : r._refDistance,
                rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : r._rolloffFactor
            })
        } else 2 === i.length && (e = i[0], o = parseInt(i[1], 10));
        for (var a = r._getSoundIds(o), p = 0; p < a.length; p++)
            if (t = r._soundById(a[p])) {
                var s = t._pannerAttr;
                s = {
                    coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : s.coneInnerAngle,
                    coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : s.coneOuterAngle,
                    coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : s.coneOuterGain,
                    distanceModel: void 0 !== e.distanceModel ? e.distanceModel : s.distanceModel,
                    maxDistance: void 0 !== e.maxDistance ? e.maxDistance : s.maxDistance,
                    panningModel: void 0 !== e.panningModel ? e.panningModel : s.panningModel,
                    refDistance: void 0 !== e.refDistance ? e.refDistance : s.refDistance,
                    rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : s.rolloffFactor
                };
                var l = t._panner;
                l ? (l.coneInnerAngle = s.coneInnerAngle, l.coneOuterAngle = s.coneOuterAngle, l.coneOuterGain = s.coneOuterGain, l.distanceModel = s.distanceModel, l.maxDistance = s.maxDistance, l.panningModel = s.panningModel, l.refDistance = s.refDistance, l.rolloffFactor = s.rolloffFactor) : (t._pos || (t._pos = r._pos || [0, 0, -.5]), n(t, "spatial"))
            }
        return r
    }, Sound.prototype.init = function(n) {
        return function() {
            var e = this,
                o = e._parent;
            e._orientation = o._orientation, e._stereo = o._stereo, e._pos = o._pos, e._pannerAttr = o._pannerAttr, n.call(this), e._stereo ? o.stereo(e._stereo) : e._pos && o.pos(e._pos[0], e._pos[1], e._pos[2], e._id)
        }
    }(Sound.prototype.init), Sound.prototype.reset = function(n) {
        return function() {
            var e = this,
                o = e._parent;
            return e._orientation = o._orientation, e._pos = o._pos, e._pannerAttr = o._pannerAttr, n.call(this)
        }
    }(Sound.prototype.reset);
    var n = function(n, e) {
        e = e || "spatial", "spatial" === e ? (n._panner = Howler.ctx.createPanner(), n._panner.coneInnerAngle = n._pannerAttr.coneInnerAngle, n._panner.coneOuterAngle = n._pannerAttr.coneOuterAngle, n._panner.coneOuterGain = n._pannerAttr.coneOuterGain, n._panner.distanceModel = n._pannerAttr.distanceModel, n._panner.maxDistance = n._pannerAttr.maxDistance, n._panner.panningModel = n._pannerAttr.panningModel, n._panner.refDistance = n._pannerAttr.refDistance, n._panner.rolloffFactor = n._pannerAttr.rolloffFactor, n._panner.setPosition(n._pos[0], n._pos[1], n._pos[2]), n._panner.setOrientation(n._orientation[0], n._orientation[1], n._orientation[2])) : (n._panner = Howler.ctx.createStereoPanner(), n._panner.pan.value = n._stereo), n._panner.connect(n._node), n._paused || n._parent.pause(n._id, !0).play(n._id)
    }
}();
