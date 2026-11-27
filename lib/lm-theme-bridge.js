/**
 * Legend Mod - Theme Bridge  v1.2
 * -------------------------------
 * Include this script on a page that Legend Mod opens. It receives the player's menu theme
 * and applies it, so the page matches the mod. A visitor who comes to the page directly
 * (no theme passed) keeps the page's normal design.
 *
 * HOW IT WORKS
 * 1. When Legend Mod opens a page (iframe or new tab) it appends the theme to the URL:
 *    page.html#lm=<base64url JSON>, or page.html#anchor&lm=<base64url JSON> when the link has an anchor.
 *    The theme part is taken out of the address at once (history.replaceState): the page sees
 *    its own #anchor again and scrolls to it like a normal link.
 * 2. An embedded page (or a tab the mod opened) says "lm-theme-ready" to the window that embeds or
 *    opened it, once; the mod answers with the theme and sends it again whenever the player
 *    changes it (no polling). Only messages from the parent / opener window on an exact HTTPS
 *    Legend or agar.io origin are accepted.
 * 3. Only visual values pass: colours, an https background image (no user:pass@, only harmless
 *    query values), opacity, corner radius, the HUD colours / font / weight / scale, plus the
 *    player's Legend Mod language (a number 1-16, nothing else from the settings).
 *    Anything else in the message is ignored; a value that does not pass falls back to the default.
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
 *      var(--lm-hud-mc), var(--lm-hud-bg), var(--lm-hud-tc)  HUD accent, background, text
 *      var(--lm-hud-font), var(--lm-hud-fw), var(--lm-hud-scale), var(--lm-hud-fs)  HUD font, weight, scale, size
 *      var(--lm-radius), var(--lm-radius-s)  window and button / field corners, only when the
 *                                            player chose Rounded or Square HUD
 *
 *    The older names --lm-b1 .. --lm-b4, --lm-btc and --lm-bg-url still work (aliases).
 * 5. A base stylesheet themes common elements (body, buttons, inputs, links, headings,
 *    .btn, .form-control, ...). Pages can override it.
 * 6. A small "Restore website theme" button (bottom left, top-level pages only) clears the game
 *    theme for this tab. data-lm-reset="off" on the script tag hides it (OBS overlays).
 *
 * USAGE - before </head>:
 *   <script src="https://www.legendmod.ml/lib/lm-theme-bridge.js" charset="utf-8"></script>
 *
 * The theme is kept for this browser tab (sessionStorage), so Legend pages opened from the first one
 * keep it; a visit in a new tab without #lm= shows the normal design.
 * html gets data-lm-lang="el" (en, el, es ...) with the language; .getLang() returns that code.
 *
 * API: window.lmThemeBridge.apply(theme), .isThemed(), .getTheme() (the last applied theme),
 *      .clean(theme) (the validated copy), .onApply(fn) (called after each applied theme),
 *      .reset() (back to the website theme), .isOff(), .urlLang() (language number from this address).
 */
(function () {
    'use strict';

    /* Default fallback theme (Legend default dark blue) */
    var DEFAULTS = {
        pc: '#00243e', pc2: '#002f52', mc: '#01d9cc', tc: '#ffffff', tc2: '#8096a7',
        bg: '', op: '0.96', btc: '#ffffff',
        b1: '#018cf6', b2: '#00b9e8', b3: '#8d5fe6', b4: '#bf00aa',
        b1b: '#0176ce', b2b: '#0099c0', b3b: '#814ee3', b4b: '#a80096',
        hm: '#01d9cc', hb: 'rgba(0,0,0,0.4)', ht: '#ffffff', hf: '', hw: '', hs: '',
        rad: '', rs: '', lang: ''
    };
    var COLOR_KEYS = ['pc', 'pc2', 'mc', 'tc', 'tc2', 'btc', 'b1', 'b2', 'b3', 'b4', 'b1b', 'b2b', 'b3b', 'b4b', 'hm', 'hb', 'ht'];
    /* theme key -> CSS property, the names the mod itself uses */
    var PROP = {
        pc: '--lm-pc', pc2: '--lm-pc2', mc: '--lm-mc', tc: '--lm-tc', tc2: '--lm-tc2', btc: '--lm-btn-tc',
        b1: '--lm-btn1', b2: '--lm-btn2', b3: '--lm-btn3', b4: '--lm-btn4',
        b1b: '--lm-btn1b', b2b: '--lm-btn2b', b3b: '--lm-btn3b', b4b: '--lm-btn4b',
        hm: '--lm-hud-mc', hb: '--lm-hud-bg', ht: '--lm-hud-tc'
    };
    var OTHER_PROPS = ['--lm-op', '--lm-menu-bg', '--lm-radius', '--lm-radius-s', '--lm-hud-font', '--lm-hud-fw', '--lm-hud-scale', '--lm-hud-fs'];
    /* the theme only comes from Legend pages and the game: exact HTTPS origins */
    var LEGEND = ['https://www.legendmod.ml', 'https://legendmod.ml', 'https://jimboy3100.github.io'];
    var GAME = LEGEND.concat(['https://agar.io', 'https://www.agar.io']);
    /* the longest #lm= value read (base64url characters), checked before decoding */
    var MAX_TOKEN = 4096;
    var HEX_RE = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
    var FN_RE = /^(rgba?|hsla?)\(\s*-?[0-9.]+(deg|%)?(\s*,\s*-?[0-9.]+%?|\s+-?[0-9.]+%?){2}(\s*[,\/]\s*[0-9.]+%?)?\s*\)$/;
    /* the CSS colour names; any other word is not a colour */
    var NAMED = ('transparent aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown ' +
        'burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray ' +
        'darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue ' +
        'darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite ' +
        'forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory ' +
        'khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen ' +
        'lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime ' +
        'limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue ' +
        'mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive ' +
        'olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum ' +
        'powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue ' +
        'slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke ' +
        'yellow yellowgreen').split(' ');
    /* query values an image host may need that cannot carry a login or token */
    var PUBLIC_Q = /^(raw|v|ver|version|w|h|width|height|size|format|fm|fit|auto|quality|dpr)$/;
    var FONT_RE = /^[A-Za-z0-9 ,-]{1,64}$/;

    var _applied = false, _last = null, _hooks = [], _urlLang = '', _anchor = '';
    /* Legend Mod's languagemod numbers 1-16 */
    var LANGS = ['en', 'el', 'es', 'bg', 'fr', 'ar', 'zh', 'ru', 'de', 'tr', 'pl', 'nl', 'pt', 'id', 'ja', 'it'];
    var STORE = 'lmThemeBridge', OFF = 'lmThemeBridgeOff';
    function langCode(t) { return t && t.lang ? LANGS[+t.lang - 1] || '' : ''; }
    var cs = document.currentScript;
    /* data-lm-css="site" on the script tag: a page with its own design system (the Legend website)
     * gets its own colour variables mapped to the theme instead of the generic stylesheet */
    var MODE = (cs && cs.getAttribute('data-lm-css')) || 'full';
    var RESET_BTN = !(cs && cs.getAttribute('data-lm-reset') === 'off');
    var TOP = (function () { try { return window.parent === window || !window.parent; } catch (e) { return false; } })();

    function plain(o) { return !!o && typeof o === 'object' && !Array.isArray(o) && Object.prototype.toString.call(o) === '[object Object]'; }
    function color(v) {
        v = typeof v === 'string' ? v.trim() : '';
        if (!v || v.length > 64) return '';
        if (HEX_RE.test(v) || FN_RE.test(v)) return v;
        return /^[a-zA-Z]{3,20}$/.test(v) && NAMED.indexOf(v.toLowerCase()) >= 0 ? v : '';
    }
    /* An https image address that is safe to show: no user:pass@, no fragment, only the query values
     * in PUBLIC_Q (the rest is dropped), no quotes / brackets / spaces. '' when it cannot be made safe. */
    function image(v) {
        if (typeof v !== 'string') return '';
        v = v.trim();
        if (!v || v.length > 1024 || /[\s"'()\\<>\u0000-\u001f\u007f]/.test(v)) return '';
        var u;
        try { u = new URL(v); } catch (e) { return ''; }
        if (u.protocol !== 'https:' || u.username || u.password || !u.hostname) return '';
        var q = [];
        (u.search ? u.search.slice(1).split('&') : []).forEach(function (p) {
            var kv = p.split('='), k = kv[0], val = kv.length > 1 ? kv.slice(1).join('=') : '';
            if (PUBLIC_Q.test(k) && /^[A-Za-z0-9._-]{0,32}$/.test(val)) q.push(p);
        });
        u.search = q.length ? '?' + q.join('&') : '';
        u.hash = '';
        var out = u.href;
        return out.length <= 1024 && !/[\s"'()\\<>]/.test(out) ? out : '';
    }
    function num(v, lo, hi) {
        var n = typeof v === 'number' ? v : (typeof v === 'string' && v.length <= 16 && /^\s*[0-9.]+\s*(px)?\s*$/.test(v) ? parseFloat(v) : NaN);
        return isFinite(n) && n >= lo && n <= hi ? n : null;
    }

    /* A validated copy: unknown keys are dropped, a bad value falls back to the default.
     * Not a theme (null): not a plain object, too many keys, or not one valid colour in it. */
    function clean(data) {
        if (!plain(data)) return null;
        var keys = Object.keys(data);
        if (keys.length > 64) return null;
        var t = {}, valid = 0;
        COLOR_KEYS.forEach(function (k) { var c = color(data[k]); if (c) valid++; t[k] = c || DEFAULTS[k]; });
        if (!valid) return null;
        t.bg = image(data.bg);
        var op = num(data.op, 0.1, 1);
        t.op = String(op == null ? DEFAULTS.op : op);
        var rad = num(data.rad, 0, 30);
        t.rad = rad == null ? '' : String(rad);
        /* the small corner (buttons, fields); an older mod sent only rad */
        var rs = num(data.rs, 0, 30);
        t.rs = rs != null ? String(rs) : (rad != null ? String(Math.round(rad * 0.6)) : '');
        t.hf = typeof data.hf === 'string' && FONT_RE.test(data.hf.trim()) ? data.hf.trim() : '';
        var hw = num(data.hw, 100, 900);
        t.hw = hw == null ? '' : String(Math.round(hw / 100) * 100);
        var hs = num(data.hs, 0.3, 2);
        t.hs = hs == null ? '' : String(hs);
        var lang = num(data.lang, 1, LANGS.length);
        t.lang = lang == null ? '' : String(Math.round(lang));
        return t;
    }

    /* the Restore website theme button, the same in both stylesheets */
    function resetCss() {
        return [
            '#lm-bridge-reset { position: fixed !important; left: 8px !important; bottom: 8px !important; z-index: 2147483000 !important; margin: 0 !important;' +
            ' width: auto !important; min-height: 0 !important; padding: 4px 9px !important; font: 600 12px/1.3 system-ui, Arial, sans-serif !important;' +
            ' letter-spacing: 0 !important; text-transform: none !important; color: var(--lm-tc, #fff) !important; background: var(--lm-pc2, #002f52) !important;' +
            ' border: 1px solid var(--lm-mc, #01d9cc) !important; border-radius: var(--lm-radius-s, 4px) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.35) !important;' +
            ' opacity: 0.7; cursor: pointer; filter: none !important; }',
            '#lm-bridge-reset:hover, #lm-bridge-reset:focus-visible { opacity: 1; }',
            '@media print { #lm-bridge-reset { display: none !important; } }'
        ].join('\n');
    }
    /* The open list of a dropdown never takes the theme: Chrome draws it from the option's colours
     * (or the select's, over white), so theme text on a dimmed theme background was unreadable
     * (a grey box with light grey text). Dark text on white, as in the browser; the same in both stylesheets. */
    function optionsCss() {
        return [
            'select option, select optgroup { background-color: #ffffff !important; color: #1a1a1a !important; }',
            'select option:checked { background-color: #d3e3fd !important; color: #1a1a1a !important; }',
            'select option:disabled { color: #6b6b6b !important; }'
        ].join('\n');
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
        var fields = '.form-control, input[type="text"], input[type="search"], input[type="email"], input[type="password"], input[type="number"], input[type="url"], textarea, select';
        var buttons = '.btn, button:not(.close), input[type="button"], input[type="submit"]';
        var scope = function (pre, list) { return list.split(', ').map(function (s) { return pre + ' ' + s; }).join(', '); };
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

            /* Form controls: the small corner, like the mod's fields */
            fields + ' { background: rgba(0,0,0,0.25) !important; color: ' + v('tc') + ' !important; border: 1px solid ' + v('pc2') + ' !important; border-radius: var(--lm-radius-s, 4px); }',
            '.form-control:focus, input:focus, textarea:focus, select:focus { border-color: ' + v('mc') + ' !important; box-shadow: 0 0 5px ' + v('mc') + ' !important; }',
            '::placeholder { color: ' + v('tc2') + ' !important; opacity: 1 !important; }',

            /* Buttons: the small corner, like the mod's buttons */
            '.btn { border-radius: var(--lm-radius-s, 4px); font-weight: 700; letter-spacing: 1px; }',
            /* Plain buttons without Bootstrap classes (e.g. the nickname page) */
            'button:not(.btn):not(.close), input[type="button"], input[type="submit"] { background: ' + v('pc2') + ' !important; color: ' + v('tc') + ' !important; border: 1px solid ' + v('mc') + ' !important; border-radius: var(--lm-radius-s, 4px); padding: 3px 10px; cursor: pointer; }',
            'button:not(.btn):not(.close):hover, input[type="button"]:hover, input[type="submit"]:hover { background: ' + v('mc') + ' !important; color: ' + v('pc') + ' !important; }',
            /* Rounded / Square HUD chosen: the corners win over the page's own */
            scope('html.lm-radius-set', buttons + ', ' + fields) + ' { border-radius: var(--lm-radius-s) !important; }',
            scope('html.lm-radius-set', '.panel, .card, .well, .jumbotron, .modal-content') + ' { border-radius: var(--lm-radius) !important; }',
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
            '.lm-themed .overlay { background: linear-gradient(135deg, ' + v('b4') + ' 0%, ' + v('pc') + ' 100%) !important; }',
            optionsCss(),
            resetCss()
        ].join('\n');
    }

    /* The Legend website's variables (index.html, features, FAQ, compare, companion ...) in theme colours.
     * Only used once a theme was passed: html.lm-themed-root is not there for direct visitors. */
    function siteCss() {
        var mix = function (c, p) { return 'color-mix(in srgb, ' + c + ' ' + p + ', transparent)'; };
        var card = mix('var(--lm-pc2)', 'calc(var(--lm-op, 1) * 100%)'), glass = mix('var(--lm-pc)', 'calc(var(--lm-op, 1) * 100%)');
        var border = mix('var(--lm-tc2)', '28%'), strong = mix('var(--lm-tc2)', '45%');
        var R = 'html.lm-themed-root.lm-radius-set';
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
            /* the menu background image, as on the game menu; a page that sets its own background
             * (inline, or the companion's transparent OBS mode) keeps it */
            'html.lm-themed-root.lm-bg-set body:not(.bg-transparent):not([style*="background"]) { background-image: var(--lm-menu-bg) !important;' +
            ' background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }',
            /* Rounded / Square HUD, when the player chose one: windows and cards take the large corner,
             * buttons and fields the small one */
            R + ', ' + R + ' body { --radius: var(--lm-radius); --radius-sm: var(--lm-radius-s); --radius-xs: var(--lm-radius-s); }',
            R + ' button, ' + R + ' .btn, ' + R + ' input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), ' + R + ' select, ' + R + ' textarea { border-radius: var(--lm-radius-s) !important; }',
            optionsCss(),
            resetCss()
        ].join('\n');
    }

    function setVars(t) {
        var de = document.documentElement, root = de.style;
        COLOR_KEYS.forEach(function (k) { root.setProperty(PROP[k], t[k]); });
        root.setProperty('--lm-op', t.op);
        /* removing the background clears the old image */
        root.setProperty('--lm-menu-bg', t.bg ? 'url("' + t.bg + '")' : 'none');
        if (t.rad !== '') { root.setProperty('--lm-radius', t.rad + 'px'); root.setProperty('--lm-radius-s', (t.rs || '0') + 'px'); }
        else { root.removeProperty('--lm-radius'); root.removeProperty('--lm-radius-s'); }
        if (t.hf) root.setProperty('--lm-hud-font', t.hf); else root.removeProperty('--lm-hud-font');
        if (t.hw) root.setProperty('--lm-hud-fw', t.hw); else root.removeProperty('--lm-hud-fw');
        if (t.hs) { root.setProperty('--lm-hud-scale', t.hs); root.setProperty('--lm-hud-fs', Math.round(20 * +t.hs) + 'px'); }
        else { root.removeProperty('--lm-hud-scale'); root.removeProperty('--lm-hud-fs'); }
        de.classList[t.rad !== '' ? 'add' : 'remove']('lm-radius-set');
        de.classList[t.bg ? 'add' : 'remove']('lm-bg-set');
        setThemeColor(t.pc);
    }

    /* the browser bar colour of phones (meta theme-color) in the panel colour; null puts the page's own back */
    function setThemeColor(c) {
        try {
            var head = document.head || document.documentElement;
            var m = head.querySelector('meta[name="theme-color"]');
            if (c == null) {
                if (!m || !m.hasAttribute('data-lm-orig')) return;
                var o = m.getAttribute('data-lm-orig');
                if (o === '-') m.parentNode.removeChild(m);
                else { m.setAttribute('content', o); m.removeAttribute('data-lm-orig'); }
                return;
            }
            /* '-': the page had none, the reset removes it again */
            if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'theme-color'); m.setAttribute('data-lm-orig', '-'); head.appendChild(m); }
            else if (!m.hasAttribute('data-lm-orig')) m.setAttribute('data-lm-orig', m.getAttribute('content') || '');
            m.setAttribute('content', c);
        } catch (e) { }
    }

    /* Apply a theme to the page; returns false when it is not a theme object */
    function applyTheme(data) {
        var t = clean(data);
        if (!t) return false;
        var de = document.documentElement;
        setVars(t);
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
        try { window.sessionStorage.setItem(STORE, JSON.stringify(t)); window.sessionStorage.removeItem(OFF); } catch (e) {}
        showReset();
        _hooks.forEach(function (fn) { try { fn(t); } catch (e) {} });
        return true;
    }

    /* Back to the website's own design for this tab; the game theme stays off until a new link from the game */
    function reset() {
        var de = document.documentElement, root = de.style;
        COLOR_KEYS.forEach(function (k) { root.removeProperty(PROP[k]); });
        OTHER_PROPS.forEach(function (p) { root.removeProperty(p); });
        ['lm-themed-root', 'lm-radius-set', 'lm-bg-set'].forEach(function (c) { de.classList.remove(c); });
        setThemeColor(null);
        de.removeAttribute('data-lm-lang');
        if (document.body) document.body.classList.remove('lm-themed');
        var st = document.getElementById('lm-bridge-css');
        if (st && st.parentNode) st.parentNode.removeChild(st);
        var b = document.getElementById('lm-bridge-reset');
        if (b && b.parentNode) b.parentNode.removeChild(b);
        _applied = false;
        _last = null;
        try { window.sessionStorage.removeItem(STORE); window.sessionStorage.setItem(OFF, '1'); } catch (e) {}
    }
    function isOff() {
        try { return window.sessionStorage.getItem(OFF) === '1'; } catch (e) { return false; }
    }

    /* the small Restore website theme button: top-level pages only (an embedded page follows the game window) */
    function showReset() {
        if (!RESET_BTN || !TOP) return;
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', showReset);
            return;
        }
        if (!_applied || document.getElementById('lm-bridge-reset')) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.id = 'lm-bridge-reset';
        b.setAttribute('data-i18n', 'site.restoreTheme');
        var label = 'Restore website theme';
        try { var tr = window.LMi18n && window.LMi18n.t ? window.LMi18n.t('site.restoreTheme') : ''; if (tr && tr !== 'site.restoreTheme') label = tr; } catch (e) {}
        b.textContent = label;
        b.title = label;
        b.addEventListener('click', reset);
        document.body.appendChild(b);
        try { if (window.LMi18n && window.LMi18n.apply) window.LMi18n.apply(b); } catch (e) {}
    }

    /* UTF-8 base64url encode / decode (btoa/atob only handle Latin-1) */
    function encode(str) {
        try {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (_, p) { return String.fromCharCode(parseInt(p, 16)); }))
                .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        } catch (e) { return ''; }
    }
    function decode(tok) {
        var b = tok.replace(/-/g, '+').replace(/_/g, '/');
        while (b.length % 4) b += '=';
        var bin = atob(b);
        try { return decodeURIComponent(bin.split('').map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join('')); }
        catch (e) { return bin; } /* an old Latin-1 payload */
    }
    /* the value of #lm= / ?lm=; the length is checked before anything is decoded */
    function readToken(raw) {
        if (typeof raw !== 'string' || !raw || raw.length > MAX_TOKEN) return null;
        try {
            if (raw.indexOf('%') >= 0) raw = decodeURIComponent(raw);
            if (!/^[A-Za-z0-9+\/_=-]+$/.test(raw)) return null;
            return JSON.parse(decode(raw));
        } catch (e) { return null; }
    }
    /* "a&lm=x&b" -> { token: "x", rest: "a&b" } */
    function split(str) {
        var parts = str.split('&'), token = null, rest = [];
        parts.forEach(function (p) {
            if (p.indexOf('lm=') === 0) { if (token === null) token = p.slice(3); }
            else if (p) rest.push(p);
        });
        return { token: token, rest: rest.join('&') };
    }

    /* Takes the theme out of the address: the page keeps its own #anchor and query, as if opened without it */
    function takeUrl() {
        var loc = window.location, h = split((loc.hash || '').replace(/^#/, '')), s = split((loc.search || '').replace(/^\?/, ''));
        if (h.token === null && s.token === null) return null;
        var theme = readToken(h.token) || readToken(s.token);
        var hash = h.token !== null ? (h.rest ? '#' + h.rest : '') : (loc.hash || '');
        var search = s.token !== null ? (s.rest ? '?' + s.rest : '') : (loc.search || '');
        try {
            if (window.history && window.history.replaceState) window.history.replaceState(window.history.state, '', loc.pathname + search + hash);
        } catch (e) {}
        _anchor = hash;
        return theme;
    }
    /* scroll to the anchor the link had: the browser could not, the theme was part of it */
    function scrollToAnchor() {
        var id = _anchor.replace(/^#/, '');
        if (!id) return;
        try { id = decodeURIComponent(id); } catch (e) {}
        var el = document.getElementById(id) || (document.getElementsByName ? document.getElementsByName(id)[0] : null);
        if (el && el.scrollIntoView) { try { el.scrollIntoView(); } catch (e) {} }
    }

    /* a message is accepted only from the window that opened or embeds this page, on an exact game / Legend origin */
    function trusted(ev) {
        if (!ev || !plain(ev.data) || ev.data.type !== 'lm-theme' || !plain(ev.data.theme)) return false;
        var src = ev.source;
        if (!src || (src !== window.parent && src !== window.opener)) return false;
        return GAME.indexOf(ev.origin) >= 0;
    }
    window.addEventListener('message', function (ev) {
        if (trusted(ev) && !isOff()) applyTheme(ev.data.theme);
    });
    /* a Legend page opened from another one with a new #lm= */
    window.addEventListener('hashchange', function () {
        if (!/(^#|&)lm=/.test(window.location.hash || '')) return;
        var t = takeUrl();
        if (t) applyTheme(t);
        scrollToAnchor();
    });

    /* the origin of the window that embeds / opened this page, when it is the game or a Legend page */
    function originOf(url) { try { return new URL(url).origin; } catch (e) { return ''; } }
    function hello() {
        if (isOff()) return;
        var msg = { type: 'lm-theme-ready', v: 1 }, ref = originOf(document.referrer || '');
        var tell = function (w, o) { if (w && GAME.indexOf(o) >= 0) { try { w.postMessage(msg, o); } catch (e) {} } };
        if (!TOP) {
            var o = '';
            try { var a = window.location.ancestorOrigins; if (a && a.length) o = a[0]; } catch (e) {}
            tell(window.parent, o || ref);
        }
        if (window.opener) tell(window.opener, ref);
    }

    /* Links to other Legend pages keep the theme (#lm=...); other sites never get it */
    function themedUrl(href) {
        if (!_last) return href;
        try {
            var u = new URL(href, window.location.href);
            /* exact HTTPS Legend origins only */
            if (LEGEND.indexOf(u.origin) < 0 || u.protocol !== 'https:') return href;
            if (/\.(js|css|json|png|jpe?g|gif|webp|svg|ico|mp3|txt|zip|xml|pdf)$/i.test(u.pathname) || /\/play\.html$/.test(u.pathname)) return href;
            /* the anchor stays first, an older theme is replaced */
            var parts = split(u.hash.replace(/^#/, '')).rest;
            var encoded = encode(JSON.stringify(_last));
            if (!encoded || encoded.length > MAX_TOKEN) return href;
            u.hash = (parts ? parts + '&' : '') + 'lm=' + encoded;
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
    /* right click: Open in new tab / Copy link address keep the theme too */
    document.addEventListener('contextmenu', onLink, true);

    function readSession() {
        try {
            var s = window.sessionStorage.getItem(STORE);
            return s && s.length <= 8192 ? JSON.parse(s) : null;
        } catch (e) { return null; }
    }
    var fromUrl = takeUrl();
    var urlTheme = clean(fromUrl);
    if (urlTheme) _urlLang = urlTheme.lang;
    /* a link from expanding.land / help.expanding.land carries only the language: no theme, but the language counts */
    else if (plain(fromUrl)) { var _ul = num(fromUrl.lang, 1, LANGS.length); if (_ul != null && Object.keys(fromUrl).length === 1) _urlLang = String(Math.round(_ul)); }
    var theme = urlTheme || (isOff() ? null : readSession());
    if (theme) {
        /* the colours at once (no flash of the page's own design); body is marked when it exists */
        applyTheme(theme);
        if (!document.body) document.addEventListener('DOMContentLoaded', function () {
            if (_applied && document.body) document.body.classList.add('lm-themed');
        });
    }
    if (_anchor) {
        if (document.readyState === 'complete') scrollToAnchor();
        else window.addEventListener('load', function () { if (!window.scrollY) scrollToAnchor(); });
    }
    hello();

    window.lmThemeBridge = {
        apply: applyTheme,
        clean: clean,
        url: themedUrl,
        trusted: trusted,
        reset: reset,
        isOff: isOff,
        image: image,
        isThemed: function () { return _applied; },
        getLang: function () { return langCode(_last); },
        urlLang: function () { return _urlLang; },
        getTheme: function () { return _last ? JSON.parse(JSON.stringify(_last)) : null; },
        onApply: function (fn) { if (typeof fn === 'function') { _hooks.push(fn); if (_last) fn(_last); } }
    };
})();
