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
 * 3. Only visual values pass: colours, an https background image, opacity and corner radius,
 *    plus the player's Legend Mod language (a number 1-12, nothing else from the settings).
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
 * The theme is kept for this browser tab (sessionStorage), so Legend pages opened from the first one
 * keep it; a visit in a new tab without #lm= shows the normal design.
 * html gets data-lm-lang="el" (en, el, es ...) with the language; .getLang() returns that code.
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
        rad: '', lang: ''
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
    /* Legend Mod's languagemod numbers 1-12 */
    var LANGS = ['en', 'el', 'es', 'bg', 'fr', 'ar', 'zh', 'ru', 'de', 'tr', 'pl', 'nl'];
    var STORE = 'lmThemeBridge';
    function langCode(t) { return t && t.lang ? LANGS[+t.lang - 1] || '' : ''; }
    /* data-lm-css="site" on the script tag: a page with its own design system (the Legend website)
     * gets its own colour variables mapped to the theme instead of the generic stylesheet */
    var MODE = (document.currentScript && document.currentScript.getAttribute('data-lm-css')) || 'full';

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
        var lang = num(data.lang, 1, 12);
        t.lang = lang == null ? '' : String(Math.round(lang));
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

            /* older pages set black text inline */
            '.lm-themed [style*="color: black"], .lm-themed [style*="color:black"], .lm-themed font[color="black"] { color: ' + v('tc') + ' !important; }',

            /* White class override - pages that use .white as bg class */
            '.lm-themed .white { background-color: ' + v('pc2') + ' !important; color: ' + v('tc') + ' !important; }',

            /* Overlay / cover section */
            '.lm-themed .overlay { background: linear-gradient(135deg, ' + v('b4') + ' 0%, ' + v('pc') + ' 100%) !important; }'
        ].join('\n');
    }

    /* The Legend website's variables (index.html, features, FAQ, compare, companion ...) in theme colours.
     * Only used once a theme was passed: html.lm-themed-root is not there for direct visitors. */
    function siteCss() {
        var mix = function (c, p) { return 'color-mix(in srgb, ' + c + ' ' + p + ', transparent)'; };
        var card = mix('var(--lm-pc2)', 'calc(var(--lm-op, 1) * 100%)'), glass = mix('var(--lm-pc)', 'calc(var(--lm-op, 1) * 100%)');
        var border = mix('var(--lm-tc2)', '28%'), strong = mix('var(--lm-tc2)', '45%');
        return [
            ':root { --lm-b1: var(--lm-btn1); --lm-b2: var(--lm-btn2); --lm-b3: var(--lm-btn3); --lm-b4: var(--lm-btn4); --lm-btc: var(--lm-btn-tc); --lm-bg-url: var(--lm-menu-bg, none); }',
            'html.lm-themed-root, html.lm-themed-root body, html.lm-themed-root .dark-theme {' +
            ' --accent: var(--lm-mc); --accent-light: var(--lm-mc); --accent2: var(--lm-mc); --accent-dark: var(--lm-btn1b);' +
            ' --accent-glow: ' + mix('var(--lm-mc)', '22%') + '; --shadow-glow: 0 0 20px ' + mix('var(--lm-mc)', '20%') + ';' +
            ' --teal: var(--lm-btn2); --blue: var(--lm-btn1);' +
            ' --bg: var(--lm-pc); --bg-subtle: var(--lm-pc2); --bg2: var(--lm-pc2); --bg3: var(--lm-pc2);' +
            ' --bg-card: ' + card + '; --glass: ' + glass + '; --glass-bg: ' + glass + '; --panel: ' + glass + ';' +
            ' --text: var(--lm-tc); --text-secondary: var(--lm-tc2); --text2: var(--lm-tc2); --text-muted: var(--lm-tc2); --muted: var(--lm-tc2);' +
            ' --border: ' + border + '; --border-strong: ' + strong + '; --line: ' + border + ';' +
            ' --btn-bg: ' + mix('var(--lm-mc)', '10%') + '; --btn-border: ' + mix('var(--lm-mc)', '35%') + '; }',
            'html.lm-themed-root ::selection { background: var(--lm-mc); color: var(--lm-pc); }',
            /* Rounded / Square HUD, when the player chose one */
            'html.lm-themed-root.lm-radius-set, html.lm-themed-root.lm-radius-set body { --radius: var(--lm-radius); --radius-sm: var(--lm-radius); --radius-xs: var(--lm-radius); }'
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
        de.classList[t.rad !== '' ? 'add' : 'remove']('lm-radius-set');

        if (!document.getElementById('lm-bridge-css')) {
            var st = document.createElement('style');
            st.id = 'lm-bridge-css';
            st.textContent = MODE === 'site' ? siteCss() : css();
            (document.head || de).appendChild(st);
        }
        /* pages with their own design check html.lm-themed-root to switch to the game theme */
        de.classList.add('lm-themed-root');
        if (document.body) document.body.classList.add('lm-themed');

        _applied = true;
        _last = t;
        if (langCode(t)) de.setAttribute('data-lm-lang', langCode(t));
        else de.removeAttribute('data-lm-lang');
        /* kept for this tab: other Legend pages opened from here keep the theme */
        try { window.sessionStorage.setItem(STORE, JSON.stringify(t)); } catch (e) {}
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

    /* Links to other Legend pages keep the theme (#lm=...); other sites never get it */
    function themedUrl(href) {
        if (!_last) return href;
        try {
            var u = new URL(href, window.location.href);
            if (!/^((www\.)?legendmod\.ml|jimboy3100\.github\.io)$/.test(u.hostname) && u.origin !== window.location.origin) return href;
            if (/\.(js|css|json|png|jpe?g|gif|webp|svg|ico|mp3|txt|zip|xml|pdf)$/i.test(u.pathname) || /\/play\.html$/.test(u.pathname)) return href;
            var h = u.hash.replace(/^#/, '').split('&').filter(function (p) { return p && p.indexOf('lm=') !== 0; });
            h.push('lm=' + btoa(JSON.stringify(_last)));
            u.hash = h.join('&');
            return u.href;
        } catch (e) { return href; }
    }
    function onLink(ev) {
        var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
        if (!a || !_last) return;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(href)) return;
        a.href = themedUrl(href);
    }
    document.addEventListener('click', onLink, true);
    document.addEventListener('auxclick', onLink, true);

    function readSession() {
        try { return JSON.parse(window.sessionStorage.getItem(STORE) || 'null'); } catch (e) { return null; }
    }
    var theme = readUrl() || readSession();
    if (theme) {
        /* the colours at once (no flash of the page's own design); body is marked when it exists */
        applyTheme(theme);
        if (!document.body) document.addEventListener('DOMContentLoaded', function () {
            if (_applied && document.body) document.body.classList.add('lm-themed');
        });
    }

    window.lmThemeBridge = {
        apply: applyTheme,
        clean: clean,
        url: themedUrl,
        trusted: trusted,
        isThemed: function () { return _applied; },
        getLang: function () { return langCode(_last); },
        getTheme: function () { return _last ? JSON.parse(JSON.stringify(_last)) : null; },
        onApply: function (fn) { if (typeof fn === 'function') { _hooks.push(fn); if (_last) fn(_last); } }
    };
})();
