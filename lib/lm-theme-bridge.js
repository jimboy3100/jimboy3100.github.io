/**
 * Legend Mod — Theme Bridge  v1.0
 * ───────────────────────────────
 * Include this script on ANY external page that collaborates with Legend Mod.
 * It receives the user's theme and applies it, so the page matches the mod UI.
 *
 * HOW IT WORKS
 * 1. When Legend Mod opens your page (iframe or window.open), it appends
 *    theme data to the URL hash:  yourpage.html#lm=<base64 JSON>
 * 2. If the page is in an iframe, Legend Mod also sends theme data via
 *    postMessage after the iframe loads.
 * 3. This script reads either source and sets CSS custom properties on
 *    document.documentElement so you can style with:
 *
 *      var(--lm-pc)   → panel background       (#00243e)
 *      var(--lm-pc2)  → panel secondary         (#002f52)
 *      var(--lm-mc)   → accent / main color     (#01d9cc)
 *      var(--lm-tc)   → text color              (#ffffff)
 *      var(--lm-tc2)  → secondary text          (#8096a7)
 *      var(--lm-bg)   → menu background image   (url)
 *      var(--lm-op)   → menu opacity            (0.96)
 *      var(--lm-btc)  → button text color       (#ffffff)
 *      var(--lm-b1)   → button 1 color          (#018cf6)
 *      var(--lm-b2)   → button 2 color          (#00b9e8)
 *      var(--lm-b3)   → button 3 color          (#8d5fe6)
 *      var(--lm-b4)   → button 4 color          (#bf00aa)
 *
 * 4. It also injects a base stylesheet that themes common elements
 *    (body, buttons, inputs, links, headings, .btn, .form-control, etc.)
 *    You can override any of these in your own CSS.
 *
 * USAGE — just add before </head>:
 *   <script src="https://jimboy3100.github.io/lib/lm-theme-bridge.js"></script>
 *
 * EXTERNAL SITES — if your site is on a different domain, include the
 * script from the CDN URL above. The postMessage listener accepts
 * messages from any origin that contain { type: 'lm-theme', ... }.
 */
(function () {
    'use strict';

    /* ── Default fallback theme (Legend default dark blue) ── */
    var DEFAULTS = {
        pc:  '#00243e', pc2: '#002f52',
        mc:  '#01d9cc', tc:  '#ffffff', tc2: '#8096a7',
        bg:  '', op: '0.96', btc: '#ffffff',
        b1:  '#018cf6', b2:  '#00b9e8', b3:  '#8d5fe6', b4:  '#bf00aa'
    };

    var KEYS = Object.keys(DEFAULTS);
    var _applied = false;

    /* ── Apply theme to the page ── */
    function applyTheme(data) {
        if (!data || typeof data !== 'object') return;
        var root = document.documentElement.style;
        var body = document.body;

        KEYS.forEach(function (k) {
            var val = data[k] || DEFAULTS[k];
            if (val) root.setProperty('--lm-' + k, val);
        });

        /* Inject base stylesheet (once) */
        if (!document.getElementById('lm-bridge-css')) {
            var st = document.createElement('style');
            st.id = 'lm-bridge-css';
            st.textContent = [
                /* Base page */
                'html, body { background: var(--lm-pc, ' + DEFAULTS.pc + ') !important; color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; }',
                'body { font-family: "Roboto Condensed", "Ubuntu", Arial, sans-serif; }',

                /* Background image */
                'body.lm-themed { background-image: var(--lm-bg-url, none) !important; background-size: cover !important; background-position: center !important; background-repeat: no-repeat !important; background-attachment: fixed !important; }',

                /* Headings */
                'h1, h2, h3, h4, h5, h6, .theme-title { color: var(--lm-mc, ' + DEFAULTS.mc + ') !important; }',
                'p, li, span, td, th, label, div { color: var(--lm-tc, ' + DEFAULTS.tc + '); }',
                'a { color: var(--lm-mc, ' + DEFAULTS.mc + '); }',
                'a:hover { color: var(--lm-mc, ' + DEFAULTS.mc + '); filter: brightness(1.3); }',
                'hr { border-color: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; }',

                /* Cards / panels */
                '.panel, .card, .well, .modal-content, .jumbotron { background: var(--lm-pc, ' + DEFAULTS.pc + ') !important; color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; border-color: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; }',
                '.modal-header { background: linear-gradient(180deg, var(--lm-pc2, ' + DEFAULTS.pc2 + '), var(--lm-pc, ' + DEFAULTS.pc + ')) !important; border-bottom-color: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; }',
                '.modal-title { color: var(--lm-mc, ' + DEFAULTS.mc + ') !important; }',
                '.close { color: var(--lm-tc2, ' + DEFAULTS.tc2 + ') !important; opacity: 1 !important; text-shadow: none !important; }',
                '.close:hover { color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; }',

                /* Form controls */
                '.form-control, input[type="text"], input[type="search"], input[type="email"], input[type="password"], textarea, select { background: rgba(0,0,0,0.25) !important; color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; border: 1px solid var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; }',
                '.form-control:focus, input:focus, textarea:focus, select:focus { border-color: var(--lm-mc, ' + DEFAULTS.mc + ') !important; box-shadow: 0 0 5px var(--lm-mc, ' + DEFAULTS.mc + ') !important; }',
                '::placeholder { color: var(--lm-tc2, ' + DEFAULTS.tc2 + ') !important; opacity: 1 !important; }',

                /* Buttons */
                '.btn { border-radius: 4px; font-weight: 700; letter-spacing: 1px; }',
                /* Plain buttons without Bootstrap classes (e.g. the nickname page) */
                'button:not(.btn):not(.close), input[type="button"], input[type="submit"] { background: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; border: 1px solid var(--lm-mc, ' + DEFAULTS.mc + ') !important; border-radius: 4px; padding: 3px 10px; cursor: pointer; }',
                'button:not(.btn):not(.close):hover, input[type="button"]:hover, input[type="submit"]:hover { background: var(--lm-mc, ' + DEFAULTS.mc + ') !important; color: var(--lm-pc, ' + DEFAULTS.pc + ') !important; }',
                /* same mapping as the mod itself: primary = button colour 1, success and info = 2, warning = 3, danger = 4 */
                '.btn-primary { background: var(--lm-b1, ' + DEFAULTS.b1 + ') !important; border-color: var(--lm-b1, ' + DEFAULTS.b1 + ') !important; color: var(--lm-btc, ' + DEFAULTS.btc + ') !important; }',
                '.btn-success, .btn-info { background: var(--lm-b2, ' + DEFAULTS.b2 + ') !important; border-color: var(--lm-b2, ' + DEFAULTS.b2 + ') !important; color: var(--lm-btc, ' + DEFAULTS.btc + ') !important; }',
                '.btn-warning { background: var(--lm-b3, ' + DEFAULTS.b3 + ') !important; border-color: var(--lm-b3, ' + DEFAULTS.b3 + ') !important; color: var(--lm-btc, ' + DEFAULTS.btc + ') !important; }',
                '.btn-primary:hover, .btn-success:hover, .btn-info:hover, .btn-warning:hover { filter: brightness(1.15); }',
                '.btn-danger { background: var(--lm-b4, ' + DEFAULTS.b4 + ') !important; border-color: var(--lm-b4, ' + DEFAULTS.b4 + ') !important; color: var(--lm-btc, ' + DEFAULTS.btc + ') !important; }',
                '.btn-default, .btn-secondary { background: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; border-color: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; }',
                '.btn-default:hover, .btn-secondary:hover { filter: brightness(1.2); }',

                /* Theme page specific */
                '.btn-copy { background: rgba(255,255,255,0.05) !important; border: 1px solid var(--lm-mc, ' + DEFAULTS.mc + ') !important; color: var(--lm-mc, ' + DEFAULTS.mc + ') !important; }',
                '.btn-copy:hover { background: var(--lm-b4, ' + DEFAULTS.b4 + ') !important; color: var(--lm-btc, ' + DEFAULTS.btc + ') !important; border-color: var(--lm-b4, ' + DEFAULTS.b4 + ') !important; }',
                '.btn-theme, .btn-themesub { background: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; border: 1px solid var(--lm-mc, ' + DEFAULTS.mc + ') !important; color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; }',
                '.btn-theme:hover, .btn-themesub:hover, .btn-theme.active, .btn-themesub.active { background: var(--lm-mc, ' + DEFAULTS.mc + ') !important; color: var(--lm-pc, ' + DEFAULTS.pc + ') !important; }',

                /* Scrollbar */
                '::-webkit-scrollbar { width: 8px; }',
                '::-webkit-scrollbar-track { background: var(--lm-pc, ' + DEFAULTS.pc + '); }',
                '::-webkit-scrollbar-thumb { background: var(--lm-pc2, ' + DEFAULTS.pc2 + '); border-radius: 4px; }',
                '::-webkit-scrollbar-thumb:hover { background: var(--lm-mc, ' + DEFAULTS.mc + '); }',

                /* White class override — pages that use .white as bg class */
                '.lm-themed .white { background-color: var(--lm-pc2, ' + DEFAULTS.pc2 + ') !important; color: var(--lm-tc, ' + DEFAULTS.tc + ') !important; }',

                /* Overlay / cover section */
                '.lm-themed .overlay { background: linear-gradient(135deg, var(--lm-b4, ' + DEFAULTS.b4 + ') 0%, var(--lm-pc, ' + DEFAULTS.pc + ') 100%) !important; }'
            ].join('\n');
            (document.head || document.documentElement).appendChild(st);
        }

        /* Set background image if provided */
        if (data.bg) {
            document.documentElement.style.setProperty('--lm-bg-url', 'url(' + data.bg + ')');
        }

        /* Mark body as themed */
        if (body) body.classList.add('lm-themed');

        _applied = true;
    }

    /* ── Read theme from URL hash:  #lm=<base64 JSON> ── */
    function readFromHash() {
        var hash = window.location.hash;
        if (!hash) return null;
        var match = hash.match(/[#&]lm=([^&]+)/);
        if (!match) return null;
        try {
            return JSON.parse(atob(decodeURIComponent(match[1])));
        } catch (e) {
            return null;
        }
    }

    /* ── Read theme from URL search params: ?lm=<base64 JSON> ── */
    function readFromParams() {
        var search = window.location.search;
        if (!search) return null;
        var match = search.match(/[?&]lm=([^&]+)/);
        if (!match) return null;
        try {
            return JSON.parse(atob(decodeURIComponent(match[1])));
        } catch (e) {
            return null;
        }
    }

    /* ── Listen for postMessage from parent (for iframes) ── */
    window.addEventListener('message', function (event) {
        if (!event.data || event.data.type !== 'lm-theme') return;
        applyTheme(event.data.theme);
    });

    /* ── Apply on load ── */
    var theme = readFromHash() || readFromParams();
    if (theme) {
        /* Apply immediately if body exists, otherwise wait for DOMContentLoaded */
        if (document.body) {
            applyTheme(theme);
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                applyTheme(theme);
            });
        }
    }

    /* ── Expose API for manual use ── */
    window.lmThemeBridge = {
        apply: applyTheme,
        isThemed: function () { return _applied; },
        getTheme: function () {
            return readFromHash() || readFromParams() || null;
        }
    };
})();
