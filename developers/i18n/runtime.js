/*
 * Legend Mod translations: the runtime (window.LMi18n, window.lmT).
 *
 * Source of languages/lm-i18n.js (the mod) and lib/lm-i18n.js (the web pages): build.js copies this
 * file, puts the old-global table in for the mod, and sets SITE for the pages. Edit it here and run
 *   node developers/i18n/build.js
 * The texts are in developers/i18n/src/*.json; the per-language files languages/lm-<code>.js
 * (mod) and languages/lm-site-<code>.js (pages) only register them with LMi18n.add.
 * Keep this file ASCII: on agar.io the page is not UTF-8.
 */
(function () {
    'use strict';
    var W = window;
    var SITE = false; /* @SITE@ */
    var ALIASES = {}; /* @ALIASES@ */
    if (W.LMi18n && W.LMi18n._runtime) {
        /* a second copy (the page loads both, or a script loads this again): keep the first one and
         * its dictionaries; the page copy only adds its page features */
        if (SITE && W.LMi18n._startSite) W.LMi18n._startSite();
        return;
    }
    /* languagemod number = index + 1 (the Choose Language list) */
    var CODES = ['en', 'el', 'es', 'bg', 'fr', 'ar', 'zh', 'ru', 'de', 'tr', 'pl', 'nl', 'pt', 'id', 'ja', 'it'];
    var NAMES = ['English', '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac', 'Espa\u00f1ol', '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438',
        'Fran\u00e7ais', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629', '\u7e41\u9ad4\u4e2d\u6587', '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
        'Deutsch', 'T\u00fcrk\u00e7e', 'Polski', 'Nederlands', 'Portugu\u00eas (Brasil)', 'Bahasa Indonesia', '\u65e5\u672c\u8a9e', 'Italiano'];
    var HOSTS = ['https://www.legendmod.ml/', 'https://jimboy3100.github.io/'];
    var BUNDLE = SITE ? 'site' : 'mod';
    var dicts = {};      /* code -> { key: text } */
    var have = {};       /* 'el:mod' -> true once that file ran */
    var waiting = {};    /* 'el:mod' -> [callbacks] while it loads */
    var listeners = [];
    var misses = {};
    var aliases = {};
    var current = 'en';
    var wanted = null;

    var cs = document.currentScript;
    /* the ?v= of this script: the language files are asked for with the same version */
    var ver = (function () { var m = cs && /[?&]v=([^&#]+)/.exec(cs.src || ''); return m ? m[1] : ''; })();
    /* the files this page needs per language: the mod: 'mod' (lm-<code>.js); a web page: 'site' (texts
     * shared by the pages, lm-site-<code>.js) and its own areas named in the script tag,
     * data-areas="site-index" -> lm-site-index-<code>.js (from developers/i18n/src/site-index.json);
     * data-areas may also name 'mod' for a page that shows the mod's texts */
    var bundles = (function () {
        var b = cs && cs.getAttribute && cs.getAttribute('data-areas');
        var list = b ? b.split(/[\s,]+/).filter(function (x) { return /^(mod|site(-[a-z0-9-]+)?)$/.test(x); }) : [];
        if (list.indexOf(BUNDLE) < 0) list.unshift(BUNDLE);
        return list;
    })();

    function toCode(x) {
        if (x == null) return null;
        x = String(x).toLowerCase();
        if (CODES.indexOf(x) >= 0) return x;
        var n = parseInt(x, 10);
        if (n >= 1 && n <= CODES.length && String(n) === x) return CODES[n - 1];
        var two = x.slice(0, 2);
        return CODES.indexOf(two) >= 0 ? two : null;
    }
    function stored() {
        try { return toCode(W.localStorage.getItem('languagemod')); } catch (e) { return null; }
    }
    function save(code) {
        try { W.localStorage.setItem('languagemod', String(CODES.indexOf(code) + 1)); } catch (e) { }
    }
    /* the browser's language when it is one of the supported languages ("el-GR" -> el), else null (the same rule
     * as play.html's loading screen) */
    function browserLang() {
        var nav = W.navigator || {};
        var two = String(nav.language || nav.userLanguage || '').slice(0, 2).toLowerCase();
        /* older Android WebViews report Indonesian with the old code "in" */
        return toCode(two === 'in' ? 'id' : two);
    }
    function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

    /* the text of key in code, else English; undefined when neither has it */
    function lookup(key, code) {
        var d = dicts[code];
        if (d && own(d, key) && d[key] !== '') return d[key];
        d = dicts.en;
        if (d && own(d, key)) return d[key];
        return undefined;
    }
    function format(s, vars) {
        if (vars == null) return s;
        if (typeof vars !== 'object') vars = [vars];
        return s.replace(/\{([A-Za-z0-9_]+)\}/g, function (m, name) {
            return own(vars, name) && vars[name] != null ? String(vars[name]) : m;
        });
    }
    /* lmT(key, vars): the text in the chosen language, else English, else the key itself (counted as
     * a miss: LMi18n.missing()). Callers that pass their own English check for "=== key". vars: an
     * array for {0} {1}, an object for {name}, or one value for {0}. */
    function t(key, vars) {
        var s = lookup(key, current);
        if (s === undefined) {
            misses[key] = (misses[key] || 0) + 1;
            return String(key);
        }
        return format(String(s), vars);
    }

    /* the old language-pack globals (Languageletter0, Premadeletter12, translator...) follow the language */
    function exportGlobals() {
        for (var name in aliases) {
            if (!own(aliases, name)) continue;
            var s = lookup(aliases[name], current);
            if (s !== undefined) W[name] = s;
        }
    }
    function fire(prev) {
        var list = listeners.slice();
        for (var i = 0; i < list.length; i++) {
            try { list[i](current, prev); } catch (e) { if (W.console) console.error('[LMi18n] onChange', e); }
        }
    }

    function add(code, dict, bundle) {
        code = toCode(code);
        if (!code || !dict) return;
        var d = dicts[code] || (dicts[code] = {});
        for (var k in dict) if (own(dict, k)) d[k] = dict[k];
        if (bundle) markLoaded(code, bundle);
        if (code === current || code === 'en') exportGlobals();
    }
    /* a module's own table: { key: { en: '..', el: '..' } } or { key: ['en text', 'el text', ...] }
     * (array order = CODES). Keys must be namespaced ("mymodule.title"). */
    function table(map) {
        for (var k in map) {
            if (!own(map, k)) continue;
            var row = map[k];
            for (var i = 0; i < CODES.length; i++) {
                var v = Object.prototype.toString.call(row) === '[object Array]' ? row[i] : row && row[CODES[i]];
                if (typeof v === 'string' && v !== '') {
                    var one = {};
                    one[k] = v;
                    add(CODES[i], one);
                }
            }
        }
    }
    function markLoaded(code, bundle) {
        var id = code + ':' + bundle;
        have[id] = true;
        finishLoad(id);
    }
    function finishLoad(id) {
        var cbs = waiting[id];
        delete waiting[id];
        if (cbs) for (var i = 0; i < cbs.length; i++) { try { cbs[i](); } catch (e) { } }
    }
    function fileFor(code, bundle) { return 'lm-' + (bundle === 'mod' ? '' : bundle + '-') + code + '.js'; }
    function urlFor(code, bundle, host) { return (host || HOSTS[0]) + 'languages/' + fileFor(code, bundle) + (ver ? '?v=' + ver : ''); }

    /* loads one language file (absolute URL, utf-8: on agar.io relative URLs point at agar.io and the
     * page is not UTF-8); www.legendmod.ml first, then the GitHub Pages copy; cb runs either way */
    function loadOne(code, bundle, cb) {
        var id = code + ':' + bundle;
        if (have[id]) { cb(); return; }
        if (waiting[id]) { waiting[id].push(cb); return; }
        waiting[id] = [cb];
        var tryHost = function (i) {
            var s = document.createElement('script');
            s.charset = 'utf-8';
            s.src = urlFor(code, bundle, HOSTS[i]);
            var failed = function () {
                if (s.parentNode) s.parentNode.removeChild(s);
                if (have[id]) return;
                if (i + 1 < HOSTS.length) tryHost(i + 1);
                else finishLoad(id); /* fallback now, but allow a later retry */
            };
            s.onerror = failed;
            /* HTTP success is not proof that a dictionary registered (stale or invalid script). */
            s.onload = function () { if (!have[id]) failed(); };
            (document.head || document.documentElement).appendChild(s);
        };
        tryHost(0);
    }
    /* loads what code needs (English too, the fallback) for this page's bundles */
    function load(code, cb) {
        code = toCode(code) || 'en';
        var need = [];
        for (var i = 0; i < bundles.length; i++) {
            need.push(['en', bundles[i]]);
            if (code !== 'en') need.push([code, bundles[i]]);
        }
        var left = need.length;
        var one = function () { if (--left === 0 && cb) cb(); };
        if (!left) { if (cb) cb(); return; }
        for (var j = 0; j < need.length; j++) loadOne(need[j][0], need[j][1], one);
    }
    function loaded(code, bundle) { return !!have[(toCode(code) || code) + ':' + (bundle || BUNDLE)]; }

    function setDocLang() {
        var h = document.documentElement;
        if (!h) return;
        h.setAttribute('lang', current === 'zh' ? 'zh-Hant' : current === 'pt' ? 'pt-BR' : current);
        /* the game page keeps its layout left to right (canvas, HUD); the web pages turn around */
        if (SITE) h.setAttribute('dir', current === 'ar' ? 'rtl' : 'ltr');
    }

    /* setLang(numberOrCode, { save: false }): switches the language, loads its file when needed,
     * then updates the old globals, runs the onChange listeners and LMi18n.apply(document).
     * Saved to localStorage 'languagemod' unless save is false. cb runs when everything is applied. */
    function setLang(x, opts, cb) {
        if (typeof opts === 'function') { cb = opts; opts = null; }
        var code = toCode(x);
        if (!code) return false;
        if (!opts || opts.save !== false) save(code);
        wanted = code;
        var incomplete = bundles.some(function (b) { return !loaded(code, b) || !loaded('en', b); });
        load(code, function () {
            /* two quick changes: only the last one counts, whichever file arrives first */
            if (wanted !== code) return;
            var prev = current;
            current = code;
            setDocLang();
            exportGlobals();
            if (prev !== code || (opts && opts.force) || (incomplete && bundles.every(function (b) { return loaded(code, b) && loaded('en', b); }))) fire(prev);
            if (document.body) apply(document);
            if (cb) cb(code);
        });
        return true;
    }

    var ATTRS = ['title', 'placeholder', 'aria-label', 'alt', 'value', 'data-original-title'];
    var SELECTOR = '[data-i18n],[data-i18n-html]' + ATTRS.map(function (a) { return ',[data-i18n-' + a + ']'; }).join('');
    /* Fills elements marked in the HTML (pages, and menus built by the mod):
     *   data-i18n="key"        text (the element should hold only the text)
     *   data-i18n-html="key"   HTML: for texts from the packs only (trusted), never player input
     *   data-i18n-title / -placeholder / -aria-label / -alt / -value / -data-original-title="key"   that attribute (a title also
     *                          updates Bootstrap's data-original-title tooltip copy)
     *   data-i18n-vars='{"0":"5"}'   values for {0} / {name}
     * A key the packs do not have leaves the element as it is (its English stays). */
    function apply(root) {
        root = root || document;
        if (!root.querySelectorAll) return 0;
        var list = Array.prototype.slice.call(root.querySelectorAll(SELECTOR));
        if (root.matches && root.matches(SELECTOR)) list.unshift(root);
        var n = 0;
        for (var i = 0; i < list.length; i++) {
            var el = list[i], vars = null, k, s;
            var vj = el.getAttribute('data-i18n-vars');
            if (vj) { try { vars = JSON.parse(vj); } catch (e) { vars = null; } }
            if ((k = el.getAttribute('data-i18n')) && (s = lookup(k, current)) !== undefined) {
                s = format(String(s), vars);
                if (el.textContent !== s) el.textContent = s;
                n++;
            } else if (k) misses[k] = (misses[k] || 0) + 1;
            if ((k = el.getAttribute('data-i18n-html')) && (s = lookup(k, current)) !== undefined) {
                s = format(String(s), vars);
                if (el.innerHTML !== s) el.innerHTML = s;
                n++;
            } else if (k) misses[k] = (misses[k] || 0) + 1;
            for (var a = 0; a < ATTRS.length; a++) {
                k = el.getAttribute('data-i18n-' + ATTRS[a]);
                if (!k) continue;
                s = lookup(k, current);
                if (s === undefined) { misses[k] = (misses[k] || 0) + 1; continue; }
                s = format(String(s), vars);
                if (ATTRS[a] === 'value') el.value = s;
                el.setAttribute(ATTRS[a], s);
                if (ATTRS[a] === 'title' && el.hasAttribute('data-original-title')) el.setAttribute('data-original-title', s);
                n++;
            }
        }
        return n;
    }

    /* every text whose key starts with prefix, without it: prefixed('settings.') is textLanguage */
    function prefixed(prefix, code) {
        code = toCode(code) || current;
        var out = {}, k, en = dicts.en || {}, d = dicts[code] || {};
        for (k in en) if (own(en, k) && k.indexOf(prefix) === 0) out[k.slice(prefix.length)] = en[k];
        if (code !== 'en') for (k in d) if (own(d, k) && k.indexOf(prefix) === 0 && d[k] !== '') out[k.slice(prefix.length)] = d[k];
        return out;
    }

    function onChange(fn) {
        if (typeof fn !== 'function') return function () { };
        listeners.push(fn);
        return function () { var i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); };
    }
    function alias(map) {
        for (var k in map) if (own(map, k)) aliases[k] = map[k];
        exportGlobals();
    }

    var api = {
        _runtime: 1,
        codes: CODES.slice(),
        names: NAMES.slice(),
        t: t,
        lang: function () { return current; },
        num: function () { return String(CODES.indexOf(current) + 1); },
        dir: function (code) { return (toCode(code) || current) === 'ar' ? 'rtl' : 'ltr'; },
        has: function (key, code) { var d = dicts[toCode(code) || 'en']; return !!(d && own(d, key)); },
        code: toCode,
        add: add,
        table: table,
        alias: alias,
        load: load,
        loaded: loaded,
        url: function (code, bundle) { return urlFor(toCode(code) || 'en', bundle || BUNDLE); },
        setLang: setLang,
        apply: apply,
        onChange: onChange,
        prefixed: prefixed,
        format: format,
        /* fn runs once the current language's files (and English) are there: for texts a page's own
         * script builds (lmT before that returns the key) */
        ready: function (fn) { load(current, fn); },
        missing: function () { var o = {}; for (var k in misses) if (own(misses, k)) o[k] = misses[k]; return o; },
        /* the language files call this (they may run before this file: see _lmI18nQueue) */
        _drain: function () {
            var q = W._lmI18nQueue || [];
            W._lmI18nQueue = { push: function (e) { add(e[0], e[2], e[1]); return 0; } };
            for (var i = 0; i < q.length; i++) add(q[i][0], q[i][2], q[i][1]);
        }
    };
    W.LMi18n = api;
    /* keep a lmT another script defined only when there is none */
    if (typeof W.lmT !== 'function' || !W.lmT._lmi18n) { W.lmT = t; t._lmi18n = 1; }

    alias(ALIASES);
    api._drain();

    /* The language Legend Mod passed with the Theme Bridge (#lm= / ?lm= base64 JSON {..., lang: n},
     * or a postMessage {type: 'lm-theme', theme: {..., lang: n}}): agar.io's storage is not visible here */
    function fromBridge() {
        var m = /[#&?]lm=([^&]+)/.exec((W.location.hash || '') + '&' + (W.location.search || ''));
        /* the bridge may have taken #lm= out of the address already (it keeps the page's own #anchor) */
        if (!m) {
            var B = W.lmThemeBridge;
            return B && typeof B.urlLang === 'function' ? toCode(B.urlLang() || null) : null;
        }
        if (m[1].length > 4096) return null;
        /* base64url (- and _) or the older base64 */
        try { var d = JSON.parse(atob(decodeURIComponent(m[1]).replace(/-/g, '+').replace(/_/g, '/'))); return d && toCode(d.lang); } catch (e) { return null; }
    }
    function pick() {
        var b = fromBridge();
        if (b) { save(b); return b; }
        return stored() || browserLang() || 'en';
    }
    /* [data-lm-lang-picker]: a list of the supported languages (native names, Choose Language numbers) that
     * switches the language; data-lm-lang-picker="manual" only shows the choice (the page reads
     * select.lm-lang-select's value, e.g. an OK button). The mod calls LMi18n.renderPickers(root). */
    function renderPickers(root) {
        var els = (root || document).querySelectorAll('[data-lm-lang-picker]');
        for (var i = 0; i < els.length; i++) {
            var box = els[i], sel = box.querySelector('select.lm-lang-select');
            if (!sel) {
                sel = document.createElement('select');
                sel.className = 'lm-lang-select';
                /* its name for screen readers, set again by apply() */
                var nameKey = SITE ? 'site.language' : 'pack.chooseALanguage';
                sel.setAttribute('data-i18n-aria-label', nameKey);
                if (lookup(nameKey, current) !== undefined) sel.setAttribute('aria-label', lookup(nameKey, current));
                for (var j = 0; j < CODES.length; j++) {
                    var o = document.createElement('option');
                    o.value = String(j + 1);
                    o.textContent = NAMES[j];
                    o.setAttribute('lang', CODES[j] === 'pt' ? 'pt-BR' : CODES[j] === 'zh' ? 'zh-Hant' : CODES[j]);
                    sel.appendChild(o);
                }
                if (box.getAttribute('data-lm-lang-picker') !== 'manual') sel.addEventListener('change', function () { setLang(this.value); });
                box.appendChild(sel);
                sel.value = api.num();
            } else if (box.getAttribute('data-lm-lang-picker') !== 'manual') sel.value = api.num();
        }
    }
    api.renderPickers = renderPickers;

    if (!SITE) {
        /* the game page: a language passed with the Theme Bridge (#lm= in its address, saved), else the one
         * chosen in Legend Mod; never chosen: the browser's language, else English. That one is not saved:
         * it follows the browser until the player picks one. */
        current = fromBridge() || stored() || browserLang() || 'en';
        if (fromBridge()) save(current);
        onChange(function () { renderPickers(document); });
        setDocLang();
        exportGlobals();
        /* its file must be there before the mod's scripts run: written into the page right after
         * this script while the page is still being parsed (www.legendmod.ml normally, agar.io through
         * document.write); else (loaded later) it comes asynchronously and is applied when it is there */
        if (current !== 'en' && !have[current + ':mod']) {
            if (document.readyState === 'loading' && cs && !cs.async && !cs.defer) {
                document.write('<script src="' + urlFor(current, 'mod') + '" charset="utf-8"><\/script>');
            } else {
                setLang(current, { save: false, force: true });
            }
        }
        return;
    }

    /* ---------- web pages (lib/lm-i18n.js) ---------- */
    var started = false;
    api._startSite = function () {
        if (started) return;
        started = true;
        var code = pick();
        current = code;
        setDocLang();
        if (!document.getElementById('lm-i18n-css')) {
            var st = document.createElement('style');
            st.id = 'lm-i18n-css';
            st.textContent = '.lm-lang-select{font:inherit;font-size:.85em;padding:2px 4px;border-radius:4px;max-width:9em;cursor:pointer}';
            (document.head || document.documentElement).appendChild(st);
        }
        var ready = function () {
            renderPickers(document);
            apply(document);
        };
        var whenDom = function (fn) {
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
            else fn();
        };
        if (document.readyState === 'loading' && cs && !cs.async && !cs.defer) {
            /* parsed with the page: the texts are there before it is shown (no English flash), and
             * the page's own scripts can use lmT (English too: the fallback, and lmT on an English page) */
            for (var i = 0; i < bundles.length; i++) {
                document.write('<script src="' + urlFor('en', bundles[i]) + '" charset="utf-8"><\/script>');
                if (code !== 'en') document.write('<script src="' + urlFor(code, bundles[i]) + '" charset="utf-8"><\/script>');
            }
            whenDom(function () { load(code, ready); });
        } else {
            load(code, function () { whenDom(ready); });
        }
        onChange(function () { renderPickers(document); });
        W.addEventListener('message', function (ev) {
            var d = ev && ev.data;
            if (!d || d.type !== 'lm-theme' || !d.theme) return;
            /* as lib/lm-theme-bridge.js: only from the window that opened or embeds this page, on a Legend origin */
            if (ev.source !== W.parent && ev.source !== W.opener) return;
            if (!/^https:\/\/((www\.)?legendmod\.ml|jimboy3100\.github\.io|(www\.)?agar\.io)$/.test(ev.origin) && ev.origin !== W.location.origin) return;
            /* the visitor chose Restore website theme in this tab: the game no longer changes the page */
            if (W.lmThemeBridge && typeof W.lmThemeBridge.isOff === 'function' && W.lmThemeBridge.isOff()) return;
            var c = toCode(d.theme.lang);
            if (c && c !== current) setLang(c);
        });
    };
    api._startSite();
})();
