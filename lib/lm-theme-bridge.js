/**
 * Legend Mod - Theme Bridge  v1.1
 * -------------------------------
 * Include this script on a page that Legend Mod opens. It receives the player's menu theme
 * and applies it, so the page matches the mod. A visitor who comes to the page directly
 * (no theme passed) keeps the page's normal design.
 *
 * HOW IT WORKS
 * 1. When Legend Mod opens a page (iframe or new tab) it appends the theme to the URL:
 *    page.html#lm=<base64 JSON>  (or ?lm=...)
 * 2. In an iframe, Legend Mod also sends it with postMessage after the iframe loads.
 *    Only messages from the parent / opener window on a Legend origin are accepted.
 * 3. Only visual values pass: colours, an https background image, opacity and corner radius.
 *    Anything else in the message is ignored.
 * 4. The values become CSS custom properties on <html> (same names as in the mod):
 *
 *      var(--lm-pc)     panel background          (#00243e)
 *      var(--lm-pc2)    panel secondary           (#002f52)
 *      var(--lm-mc)     accent / main colour      (#01d9cc)
 *      var(--lm-tc)     text colour               (#ffffff)
 *      var(--lm-tc2)    secondary text            (#8096a7)
 *      var(--lm-menu-bg) background image         (url("...") or none)
 *      var(--lm-op)     menu opacity, 0.1 - 1     (0.96)
 *      var(--lm-btn-tc) button text colour        (#ffffff)
 *      var(--lm-btn1) .. var(--lm-btn4)   button colours 1 - 4
 *      var(--lm-btn1b) .. var(--lm-btn4b) button hover colours 1 - 4
 *      var(--lm-radius) corner radius, only when the player chose Rounded or Square HUD
 *
 *    The older names --lm-b1 .. --lm-b4, --lm-btc and --lm-bg-url still work (aliases).
 * 5. A base stylesheet themes common elements (body, buttons, inputs, links, headings,
 *    .btn, .form-control, ...). Pages can override it.
 *
 * USAGE - before </head>:
 *   <script src="https://www.legendmod.ml/lib/lm-theme-bridge.js" charset="utf-8"></script>
 *
 * API: window.lmThemeBridge.apply(theme), .isThemed(), .getTheme() (the last applied theme),
 *      .clean(theme) (the validated copy), .onApply(fn) (called after each applied theme).
 */
(function () {
    'use strict';

    /* Default fallback theme (Legend default dark blue) */
    var DEFAULTS = {
        pc: '#00243e', pc2: '#002f52', mc: '#01d9cc', tc: '#ffffff', tc2: '#8096a7',
        bg: '', op: '0.96', btc: '#ffffff',
        b1: '#018cf6', b2: '#00b9e8', b3: '#8d5fe6', b4: '#bf00aa',
        b1b: '#0176ce', b2b: '#0099c0', b3b: '#814ee3', b4b: '#a80096',
        rad: ''
    };
    var COLOR_KEYS = ['pc', 'pc2', 'mc', 'tc', 'tc2', 'btc', 'b1', 'b2', 'b3', 'b4', 'b1b', 'b2b', 'b3b', 'b4b'];
    /* theme key -> CSS property, the names the mod itself uses */
    var PROP = {
        pc: '--lm-pc', pc2: '--lm-pc2', mc: '--lm-mc', tc: '--lm-tc', tc2: '--lm-tc2', btc: '--lm-btn-tc',
        b1: '--lm-btn1', b2: '--lm-btn2', b3: '--lm-btn3', b4: '--lm-btn4',
        b1b: '--lm-btn1b', b2b: '--lm-btn2b', b3b: '--lm-btn3b', b4b: '--lm-btn4b'
    };
    /* the theme only comes from Legend pages and the game */
    var ORIGIN_RE = /^https:\/\/((www\.)?legendmod\.ml|jimboy3100\.github\.io|(www\.)?agar\.io)$/;
    var COLOR_RE = /^(#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|(rgba?|hsla?)\([0-9.,%\s\/-]+\)|[a-zA-Z]{3,20})$/;
    var IMAGE_RE = /^https:\/\/[^\s"'()\\<>]+$/;

    var _applied = false, _last = null, _hooks = [];

    function color(v) {
        v = typeof v === 'string' ? v.trim() : '';
        return v.length <= 64 && COLOR_RE.test(v) ? v : '';
    }
    function image(v) {
        v = typeof v === 'string' ? v.trim() : '';
        return v.length <= 2048 && IMAGE_RE.test(v) ? v : '';
    }
    function num(v, lo, hi) {
        var n = typeof v === 'number' ? v : (typeof v === 'string' && /^\s*[0-9.]+\s*(px)?\s*$/.test(v) ? parseFloat(v) : NaN);
        return isFinite(n) && n >= lo && n <= hi ? n : null;
    }

    /* A validated copy: unknown keys are dropped, a bad value falls back to the default */
    function clean(data) {
        if (!data || typeof data !== 'object') return null;
        var t = {};
        COLOR_KEYS.forEach(function (k) { t[k] = color(data[k]) || DEFAULTS[k]; });
        t.bg = image(data.bg);
        var op = num(data.op, 0.1, 1);
        t.op = String(op == null ? DEFAULTS.op : op);
        var rad = num(data.rad, 0, 30);
        t.rad = rad == null ? '' : String(rad);
        return t;
    }

    function css() {
        var D = DEFAULTS;
        var v = function (k) { return 'var(' + PROP[k] + ', ' + D[k] + ')'; };
        /* a panel colour with the menu opacity: the background image shows through like in the menu */
        var panel = function (k) { return 'color-mix(in srgb, ' + v(k) + ' calc(var(--lm-op, 1) * 100%), transparent)'; };
        var btn = function (sel, n) {
            return sel + ' { background: ' + v('b' + n) + ' !important; border-color: ' + v('b' + n) + ' !important; color: ' + v('btc') + ' !important; }\n' +
                sel.replace(/,/g, ':hover,') + ':hover { background: ' + v('b' + n + 'b') + ' !important; border-color: ' + v('b' + n + 'b') + ' !important; }';
        };
        return [
            /* older names, kept for pages written against bridge v1.0 */
            ':root { --lm-b1: var(--lm-btn1); --lm-b2: var(--lm-btn2); --lm-b3: var(--lm-btn3); --lm-b4: var(--lm-btn4); --lm-btc: var(--lm-btn-tc); --lm-bg-url: var(--lm-menu-bg, none); }',
            /* Base page */
            'html, body { background: ' + v('pc') + ' !important; color: ' + v('tc') + ' !important; }',
            'body { font-family: "Roboto Condensed", "Ubuntu", Arial, sans-serif; }',
            'body.lm-themed { background-image: var(--lm-menu-bg, none) !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }',

            /* Headings and text */
            'h1, h2, h3, h4, h5, h6, .theme-title { color: ' + v('mc') + ' !important; }',
            'p, li, span, td, th, label, div { color: ' + v('tc') + '; }',
            'a { color: ' + v('mc') + '; }',
            'a:hover { color: ' + v('mc') + '; filter: brightness(1.3); }',
            'hr { border-color: ' + v('pc2') + ' !important; }',

            /* Cards / panels */
            '.panel, .card, .well, .modal-content, .jumbotron { background: ' + v('pc') + ' !important; background: ' + panel('pc') + ' !important; color: ' + v('tc') + ' !important; border-color: ' + v('pc2') + ' !important; }',
            '.panel, .card, .well, .jumbotron { border-radius: var(--lm-radius, 4px); }',
            '.modal-content { border-radius: var(--lm-radius, 6px); }',
            '.modal-header { background: linear-gradient(180deg, ' + v('pc2') + ', ' + v('pc') + ') !important; border-bottom-color: ' + v('pc2') + ' !important; }',
            '.modal-title { color: ' + v('mc') + ' !important; }',
            '.close { color: ' + v('tc2') + ' !important; opacity: 1 !important; text-shadow: none !important; }',
            '.close:hover { color: ' + v('tc') + ' !important; }',

            /* Form controls */
            '.form-control, input[type="text"], input[type="search"], input[type="email"], input[type="password"], textarea, select { background: rgba(0,0,0,0.25) !important; color: ' + v('tc') + ' !important; border: 1px solid ' + v('pc2') + ' !important; }',
            '.form-control:focus, input:focus, textarea:focus, select:focus { border-color: ' + v('mc') + ' !important; box-shadow: 0 0 5px ' + v('mc') + ' !important; }',
            '::placeholder { color: ' + v('tc2') + ' !important; opacity: 1 !important; }',

            /* Buttons */
            '.btn { border-radius: var(--lm-radius, 4px); font-weight: 700; letter-spacing: 1px; }',
            /* Plain buttons without Bootstrap classes (e.g. the nickname page) */
            'button:not(.btn):not(.close), input[type="button"], input[type="submit"] { background: ' + v('pc2') + ' !important; color: ' + v('tc') + ' !important; border: 1px solid ' + v('mc') + ' !important; border-radius: var(--lm-radius, 4px); padding: 3px 10px; cursor: pointer; }',
            'button:not(.btn):not(.close):hover, input[type="button"]:hover, input[type="submit"]:hover { background: ' + v('mc') + ' !important; color: ' + v('pc') + ' !important; }',
            /* same mapping as the mod itself: primary = button colour 1, success and info = 2, warning = 3, danger = 4;
             * hover uses the second colour of each button, as in the mod */
            btn('.btn-primary', 1),
            btn('.btn-success, .btn-info', 2),
            btn('.btn-warning', 3),
            btn('.btn-danger', 4),
            '.btn-default, .btn-secondary { background: ' + v('pc2') + ' !important; border-color: ' + v('pc2') + ' !important; color: ' + v('tc') + ' !important; }',
            '.btn-default:hover, .btn-secondary:hover { filter: brightness(1.2); }',

            /* Theme page specific */
            '.btn-copy { background: rgba(255,255,255,0.05) !important; border: 1px solid ' + v('mc') + ' !important; color: ' + v('mc') + ' !important; }',
            '.btn-copy:hover { background: ' + v('b4') + ' !important; color: ' + v('btc') + ' !important; border-color: ' + v('b4') + ' !important; }',
            '.btn-theme, .btn-themesub { background: ' + v('pc2') + ' !important; border: 1px solid ' + v('mc') + ' !important; color: ' + v('tc') + ' !important; }',
            '.btn-theme:hover, .btn-themesub:hover, .btn-theme.active, .btn-themesub.active { background: ' + v('mc') + ' !important; color: ' + v('pc') + ' !important; }',

            /* Scrollbar */
            '::-webkit-scrollbar { width: 8px; }',
            '::-webkit-scrollbar-track { background: ' + v('pc') + '; }',
            '::-webkit-scrollbar-thumb { background: ' + v('pc2') + '; border-radius: 4px; }',
            '::-webkit-scrollbar-thumb:hover { background: ' + v('mc') + '; }',

            /* White class override - pages that use .white as bg class */
            '.lm-themed .white { background-color: ' + v('pc2') + ' !important; color: ' + v('tc') + ' !important; }',

            /* Overlay / cover section */
            '.lm-themed .overlay { background: linear-gradient(135deg, ' + v('b4') + ' 0%, ' + v('pc') + ' 100%) !important; }'
        ].join('\n');
    }

    /* Apply a theme to the page; returns false when it is not a theme object */
    function applyTheme(data) {
        var t = clean(data);
        if (!t) return false;
        var de = document.documentElement, root = de.style;
        COLOR_KEYS.forEach(function (k) { root.setProperty(PROP[k], t[k]); });
        root.setProperty('--lm-op', t.op);
        /* removing the background clears the old image */
        root.setProperty('--lm-menu-bg', t.bg ? 'url("' + t.bg + '")' : 'none');
        if (t.rad !== '') root.setProperty('--lm-radius', t.rad + 'px');
        else root.removeProperty('--lm-radius');

        if (!document.getElementById('lm-bridge-css')) {
            var st = document.createElement('style');
            st.id = 'lm-bridge-css';
            st.textContent = css();
            (document.head || de).appendChild(st);
        }
        /* pages with their own design check html.lm-themed-root to switch to the game theme */
        de.classList.add('lm-themed-root');
        if (document.body) document.body.classList.add('lm-themed');

        _applied = true;
        _last = t;
        _hooks.forEach(function (fn) { try { fn(t); } catch (e) {} });
        return true;
    }

    /* #lm=<base64 JSON> or ?lm=<base64 JSON> */
    function readFrom(str, re) {
        var m = str ? str.match(re) : null;
        if (!m) return null;
        try { return JSON.parse(atob(decodeURIComponent(m[1]))); } catch (e) { return null; }
    }
    function readUrl() {
        return readFrom(window.location.hash, /[#&]lm=([^&]+)/) || readFrom(window.location.search, /[?&]lm=([^&]+)/);
    }

    /* a message is accepted only from the window that opened or embeds this page, on a Legend origin */
    function trusted(ev) {
        if (!ev || !ev.data || ev.data.type !== 'lm-theme') return false;
        var src = ev.source;
        if (!src || (src !== window.parent && src !== window.opener)) return false;
        return ORIGIN_RE.test(ev.origin) || ev.origin === window.location.origin;
    }
    window.addEventListener('message', function (ev) {
        if (trusted(ev)) applyTheme(ev.data.theme);
    });
    /* a Legend page opened from another one with a new #lm= */
    window.addEventListener('hashchange', function () {
        var t = readFrom(window.location.hash, /[#&]lm=([^&]+)/);
        if (t) applyTheme(t);
    });

    var theme = readUrl();
    if (theme) {
        if (document.body) applyTheme(theme);
        else document.addEventListener('DOMContentLoaded', function () { applyTheme(theme); });
    }

    window.lmThemeBridge = {
        apply: applyTheme,
        clean: clean,
        trusted: trusted,
        isThemed: function () { return _applied; },
        getTheme: function () { return _last ? JSON.parse(JSON.stringify(_last)) : null; },
        onApply: function (fn) { if (typeof fn === 'function') { _hooks.push(fn); if (_last) fn(_last); } }
    };
})();
