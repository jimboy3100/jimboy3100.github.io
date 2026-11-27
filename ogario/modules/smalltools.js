/* Legend Mod small tools: the key check of the Hotkeys window, the HUD hide of Show/hide HUD
 * (Alt+H, the former screenshot mode) with its capture. (The skin collections window is gone: its
 * favourites and search are part of the player profiles in the skins panel. The radial command
 * menu and the screenshot window are removed: lmRadialMenu and lmSmallTools are deleted at start.)
 * Nothing runs per frame while the HUD is shown.
 * It also takes private data out of the text of Settings > "Copy debug info" (redactReport).
 */
(function () {
    'use strict';
    var W = window;
    if (W._lmSmallToolsLoaded) return;
    W._lmSmallToolsLoaded = true;
    var D = W.document;

    function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }

    /* Texts from the language packs (developers/i18n/src, keys modules.smalltools.*): the chosen
     * language, else English. vars fill {0} {1}. A few labels are the same as settings / hotkey labels
     * and use those keys. */
    var TP = 'modules.smalltools.';
    var SHARED = { close: 'settings.close', shotTainted: 'pkg.mg.shotTainted' };
    function t(k, vars) { return typeof W.lmT === 'function' ? W.lmT(own(SHARED, k) ? SHARED[k] : TP + k, vars) : k; }
    function langDir() { return W.LMi18n && W.LMi18n.dir ? W.LMi18n.dir() : 'ltr'; }

    /* ═══ Pure helpers (developers/tests/smalltools.js) ═══ */

    /* Key names as the hotkeys window stores them (CTRL+ / ALT+ prefixes).
     * 'block': the browser keeps the shortcut, the game never gets the key.
     * 'warn': the browser may still act (some systems, full screen, Alt menus).
     * 'info': the game takes the key while it is bound (its keydown cancels the shortcut), but the
     * browser acts while typing in a text field or before the page has focus. */
    var BROWSER_KEYS = {
        'CTRL+W': ['block', 'closeTab'], 'CTRL+T': ['block', 'newTab'], 'CTRL+N': ['block', 'newWindow'],
        'CTRL+TAB': ['block', 'switchTabs'], 'ALT+TAB': ['block', 'switchWindows'], 'ALT+F4': ['block', 'closeWindow'],
        'CTRL+Q': ['warn', 'quit'], 'CTRL+SHIFT': ['warn', 'layout'],
        'F11': ['warn', 'fullscreen'], 'F12': ['warn', 'devtools'],
        'ALT': ['warn', 'menuBar'], 'META': ['warn', 'systemMenu'], 'MENU': ['warn', 'contextMenu'],
        'ALT+D': ['warn', 'addressBar'], 'ALT+F': ['warn', 'browserMenu'], 'ALT+E': ['warn', 'browserMenu'],
        'F5': ['info', 'reload'], 'CTRL+R': ['info', 'reload'], 'CTRL+F5': ['info', 'reload'],
        'F1': ['info', 'help'], 'F3': ['info', 'find'], 'F6': ['info', 'addressBar'], 'F7': ['info', 'caret'],
        'CTRL+L': ['info', 'addressBar'], 'CTRL+D': ['info', 'bookmark'], 'CTRL+F': ['info', 'find'],
        'CTRL+P': ['info', 'print'], 'CTRL+S': ['info', 'save'], 'CTRL+O': ['info', 'openFile'],
        'CTRL+H': ['info', 'history'], 'CTRL+J': ['info', 'downloads'], 'CTRL+U': ['info', 'source'],
        'CTRL+E': ['info', 'search'], 'CTRL+K': ['info', 'search'],
        'CTRL+=': ['info', 'zoom'], 'CTRL+-': ['info', 'zoom'], 'CTRL+0': ['info', 'zoomReset'],
        'CTRL+PGUP': ['info', 'switchTabs'], 'CTRL+PGDN': ['info', 'switchTabs'],
        'ALT+LEFT': ['info', 'back'], 'ALT+RIGHT': ['info', 'forward'], 'ALT+HOME': ['info', 'home']
    };
    for (var _bk = 1; _bk <= 9; _bk++) BROWSER_KEYS['CTRL+' + _bk] = ['info', 'tabN', _bk];
    /* what the browser does with a key of BROWSER_KEYS, in the chosen language ("closes the tab") */
    function browserWhat(b) { return t('bk.' + b[1], b.length > 2 ? b[2] : undefined); }
    /* keys Legend Mod itself uses outside the hotkeys list (name of their use: a text key) */
    var BUILTIN_KEYS = { 'ESC': 'menuEsc' };
    /* Report text without private data: the strings in secrets (nicks, clan tags, skin URLs,
     * ids) wherever they appear, key=value pairs of tokens / passwords / ids, JWTs, long hex or
     * base64 strings, e-mail and IP addresses, and URLs (except a few known hosts, without query).
     * opts.keepHosts: other URLs keep scheme, host and port (a game server address helps a bug
     * report) but lose path and query (room tokens, skin file names), and IPs are kept. */
    var KEEP_HOSTS = /^(?:www\.)?(?:legendmod\.ml|jimboy3100\.github\.io|agar\.io|expanding\.land|cdnjs\.cloudflare\.com|code\.jquery\.com)$/i;
    function redact(text, secrets, opts) {
        var keepHosts = !!(opts && opts.keepHosts);
        var s = String(text == null ? '' : text);
        if (Array.isArray(secrets)) {
            secrets.filter(function (x) { return typeof x === 'string' && x.trim().length >= 3; })
                .map(function (x) { return x.trim(); })
                .sort(function (a, b) { return b.length - a.length; })
                .forEach(function (x) { s = s.split(x).join('[redacted]'); });
        }
        s = s.replace(/\b((?:access_?|refresh_?|id_?|auth_?|session_?|api_?)?token|auth(?:orization)?|bearer|pass(?:word|wd)?|secret|session(?:id)?|sid|api_?key|key|uid|user_?id|account_?id|fb_?id|facebook_?ids?|email|nick(?:name)?|skin(?:url)?|code)(["']?\s*[:=]\s*["']?)[^\s"'&,;}\]]+/gi, '$1$2[redacted]');
        s = s.replace(/\bBearer\s+[A-Za-z0-9._~+\/=-]+/g, 'Bearer [redacted]');
        s = s.replace(/\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}/g, '[token]');
        s = s.replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, '[email]');
        s = s.replace(/\b(wss?|https?):\/\/([^\/\s"'<>?#]+)([^\s"'<>?#]*)(?:[?#][^\s"'<>]*)?/gi, function (all, sch, host, path) {
            var h = host.replace(/:\d+$/, '').replace(/^[^@]*@/, '');
            if (KEEP_HOSTS.test(h)) return sch + '://' + h + path;
            return keepHosts ? sch + '://' + host.replace(/^[^@]*@/, '') + (path && path !== '/' ? '/[path]' : '') : '[url]';
        });
        if (!keepHosts) s = s.replace(/\b(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?\b/g, '[ip]');
        s = s.replace(/\b[a-f0-9]{24,}\b/gi, '[id]');
        s = s.replace(/[A-Za-z0-9+\/_-]{40,}={0,2}/g, '[token]');
        return s;
    }

    var core = {
        BROWSER_KEYS: BROWSER_KEYS, redact: redact
    };
    var api = W.LMSmallTools = { _core: core };
    if (!D || !D.createElement) return;

    /* ═══ Shared bits ═══ */

    function toast(kind, msg) {
        try { if (W.toastr && W.toastr[kind]) W.toastr[kind](String(msg).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; })); } catch (e) { }
    }
    function el(tag, css, text) {
        var e = D.createElement(tag);
        if (css) e.style.cssText = css;
        if (text !== undefined) e.textContent = text;
        return e;
    }
    function colors() {
        var ds = W.defaultSettings || {};
        var ok = function (v, d) { return typeof v === 'string' && /^#[0-9a-f]{3,8}$|^rgba?\([\d\s.,%]+\)$/i.test(v) ? v : d; };
        var r = { mc: ok(ds.menuMainColor, '#01d9cc'), pc: ok(ds.menuPanelColor, '#00243e'), pc2: ok(ds.menuPanelColor2, '#002f52'), tc: ok(ds.menuTextColor, '#ffffff'), tc2: ok(ds.menuTextColor2, '#8096a7') };
        /* CSS variables set by the menu theme, so open windows follow a theme change; the
         * current value is the fallback (all consumers are DOM styles, none draws on a canvas) */
        return { mc: 'var(--lm-mc,' + r.mc + ')', pc: 'var(--lm-pc,' + r.pc + ')', pc2: 'var(--lm-pc2,' + r.pc2 + ')', tc: 'var(--lm-tc,' + r.tc + ')', tc2: 'var(--lm-tc2,' + r.tc2 + ')' };
    }
    function settings() { return W.legendmod5 || W.defaultmapsettings || {}; }
    function noMotion() { return !!settings().reducedMotion; }
    function isTouch() {
        try { return !!(W.matchMedia && W.matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in W; } catch (e) { return false; }
    }
    var styleDone = false;
    function addStyle() {
        if (styleDone) return;
        styleDone = true;
        /* the shared window look (LMexpress.js) */
        if (typeof W.lmUiKit === 'function') W.lmUiKit();
        var c = colors();
        var s = D.createElement('style');
        s.id = 'lm-st-style';
        s.textContent =
            // i18n-ok: CSS
            '.lm-st-win .lm-st-btn{flex:none;cursor:pointer;min-height:var(--lm-w-ctl,30px);padding:0 12px;border-radius:var(--lm-radius-s,4px);border:1px solid ' + c.pc2 + ';background:var(--lm-w-btn,rgba(255,255,255,0.05));color:inherit;font-size:var(--lm-w-fs,12px);font-family:inherit;}' +
            '.lm-st-win .lm-st-btn:hover{background:var(--lm-w-btn-h,rgba(255,255,255,0.12));}' +
            // i18n-ok: CSS
            '.lm-st-win .lm-st-btn.main{background:' + c.mc + ';color:' + c.pc + ';border-color:' + c.mc + ';font-weight:700;}' +
            /* screenshot mode: only the game view and the exit chip stay visible */
            '.lm-shot-hide{visibility:hidden !important;}' +
            'body.lm-shot-on #toast-container{visibility:hidden !important;}' +
            /* HUD font, weight and scale (Theme > HUD); the tap targets stay at least 30 px */
            '#lm-shot-chip{position:fixed;right:8px;bottom:8px;z-index:999996;display:flex;gap:6px;transition:opacity .4s;font-size:calc(12px * var(--lm-hud-scale,1));}' +
            '#lm-shot-chip div{cursor:pointer;min-width:max(30px,calc(34px * var(--lm-hud-scale,1)));height:max(30px,calc(34px * var(--lm-hud-scale,1)));line-height:max(30px,calc(34px * var(--lm-hud-scale,1)));padding:0 10px;border-radius:17px;text-align:center;background:rgba(0,0,0,0.55);color:#fff;border:1px solid rgba(255,255,255,0.35);box-sizing:border-box;}' +
            '#lm-shot-chip.idle{opacity:.18;}' +
            /* a setting or hotkey row found by LMSmallTools.jump */
            // i18n-ok: CSS
            '.lm-st-flash{outline:3px solid ' + c.mc + ' !important;outline-offset:1px;}';
        D.head.appendChild(s);
    }

    function button(text, main, onClick) {
        var b = el('button', '', text);
        b.type = 'button';
        b.className = 'lm-st-btn' + (main ? ' main' : '');
        b.addEventListener('click', function (e) { e.preventDefault(); onClick(e); });
        return b;
    }
    /* ═══ HUD hide (Show/hide HUD, Alt+H: application.setShowHUD) + capture ═══ */

    /* what the removed radial menu (its commands) and screenshot window (its options) kept */
    try { W.localStorage.removeItem('lmRadialMenu'); W.localStorage.removeItem('lmSmallTools'); } catch (e) { }
    var shot = null;
    function gameCanvases() {
        var dr = W.drawRender, list = [];
        if (dr) [dr.backgroundCanvas, dr.gridCanvas, dr.canvas, dr.glCanvas, dr.overlayCanvas].forEach(function (c) { if (c && c.tagName === 'CANVAS' && list.indexOf(c) < 0) list.push(c); });
        if (!list.length) {
            var main = D.getElementById('canvas');
            if (main) list.push(main);
        }
        return list;
    }
    function hideAround(keep) {
        var hidden = [], path = [];
        keep.forEach(function (n) { for (var p = n; p && p !== D.body && p !== D.documentElement; p = p.parentNode) if (path.indexOf(p) < 0) path.push(p); });
        path.forEach(function (n) {
            var par = n.parentNode;
            if (!par) return;
            for (var c = par.firstElementChild; c; c = c.nextElementSibling) {
                if (path.indexOf(c) >= 0 || c.id === 'lm-shot-chip' || /^(SCRIPT|STYLE|LINK|META)$/.test(c.tagName) || c.classList.contains('lm-shot-hide')) continue;
                c.classList.add('lm-shot-hide');
                hidden.push(c);
            }
        });
        return { hidden: hidden, path: path };
    }
    function shotOn() {
        if (shot) return;
        addStyle();
        var keep = gameCanvases();
        var h = hideAround(keep);
        var chip = el('div');
        chip.id = 'lm-shot-chip';
        /* toasts are hidden in this mode: the hint sits in the chip for a few seconds */
        var hint = el('div', 'cursor:default;background:rgba(0,0,0,0.7);', t('shotHint'));
        chip.appendChild(hint);
        setTimeout(function () { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 3500);
        var cap = el('div', '', t('shotCapture'));
        cap.id = 'lm-shot-cap';
        cap.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); capture(); });
        var x = el('div', '', '✕');
        x.id = 'lm-shot-x';
        x.title = t('close');
        x.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); shotOff(); });
        chip.appendChild(cap);
        chip.appendChild(x);
        ['mousedown', 'pointerdown', 'touchstart'].forEach(function (ev) { chip.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
        D.body.appendChild(chip);
        D.body.classList.add('lm-shot-on');
        /* new page elements (toasts, windows) stay hidden too */
        var mo = null;
        try {
            mo = new MutationObserver(function (recs) {
                if (!shot) return;
                recs.forEach(function (r) {
                    for (var i = 0; i < r.addedNodes.length; i++) {
                        var n = r.addedNodes[i];
                        if (n.nodeType === 1 && n.id !== 'lm-shot-chip' && n.id !== 'lm-st-shot-preview' && !/^(SCRIPT|STYLE|LINK|CANVAS)$/.test(n.tagName) && h.path.indexOf(n) < 0 && !n.classList.contains('lm-shot-hide')) {
                            n.classList.add('lm-shot-hide');
                            h.hidden.push(n);
                        }
                    }
                });
            });
            mo.observe(D.body, { childList: true });
        } catch (e) { }
        /* the menu opening (a death on any server, a lost connection) shows the HUD again, as Esc
         * does: under the hide it opened invisible and clicks and taps went to the game. Started
         * with the menu open (a capture of the game behind it), the menu stays hidden. */
        var ov = D.getElementById('overlays'), ovMo = null;
        if (ov) {
            var ovOpen = function () { return W.getComputedStyle(ov).display !== 'none'; };
            var ovWas = ovOpen(), ovDisp = ov.style.display;
            try {
                ovMo = new MutationObserver(function () {
                    if (!shot || ov.style.display === ovDisp) return;
                    ovDisp = ov.style.display;
                    var now = ovOpen();
                    if (now && !ovWas) { shotOff(); return; }
                    ovWas = now;
                });
                ovMo.observe(ov, { attributes: true, attributeFilter: ['style'] });
            } catch (e) { }
        }
        if (noMotion()) chip.style.transition = 'none';
        var idleT = 0;
        var wake = function () { chip.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(function () { chip.classList.add('idle'); }, 2500); };
        W.addEventListener('mousemove', wake, true);
        W.addEventListener('touchstart', wake, { capture: true, passive: true });
        W.addEventListener('keydown', shotKey, true);
        shot = { h: h, chip: chip, mo: mo, ovMo: ovMo, wake: wake, idleT: function () { clearTimeout(idleT); } };
        wake();
    }
    function shotOff() {
        if (!shot) return;
        var s = shot;
        shot = null;
        s.h.hidden.forEach(function (n) { n.classList.remove('lm-shot-hide'); });
        if (s.mo) s.mo.disconnect();
        if (s.ovMo) s.ovMo.disconnect();
        s.idleT();
        W.removeEventListener('mousemove', s.wake, true);
        W.removeEventListener('touchstart', s.wake, { capture: true, passive: true });
        W.removeEventListener('keydown', shotKey, true);
        if (s.chip.parentNode) s.chip.parentNode.removeChild(s.chip);
        D.body.classList.remove('lm-shot-on');
    }
    /* Esc leaves screenshot mode only (it does not open the menu as well) */
    function shotKey(e) {
        if (shot && (e.key === 'Escape' || e.keyCode === 27)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (D.getElementById('lm-st-shot-preview')) closePreview(); else shotOff();
        }
    }
    /* Runs cb right after the next drawn frame, in the same task: a WebGL canvas without
     * preserveDrawingBuffer still holds the picture then. Uses the frame hook of the render loop
     * (window._lmPerfFrame, shared with perf.js: its own hook keeps running). */
    function afterFrame(cb) {
        var prev = W._lmPerfFrame, done = false, to = 0;
        var finish = function () {
            if (done) return;
            done = true;
            clearTimeout(to);
            if (W._lmPerfFrame === hook) W._lmPerfFrame = prev;
            cb();
        };
        var hook = function (a, b) {
            if (prev) { try { prev(a, b); } catch (e) { } }
            finish();
        };
        W._lmPerfFrame = hook;
        /* no frame (hidden tab, render loop stopped): capture what is there */
        to = setTimeout(finish, 700);
    }
    function rectIn(r, base, sx, sy) { return [(r.left - base.left) * sx, (r.top - base.top) * sy, r.width * sx, r.height * sy]; }
    function shown(n) {
        if (!n || !n.getBoundingClientRect) return false;
        var cs = W.getComputedStyle(n);
        if (cs.display === 'none' || +cs.opacity === 0) return false;
        var r = n.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
    }
    function stamp() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
    }
    var capturing = false;
    function capture(done) {
        if (capturing) return;
        capturing = true;
        afterFrame(function () {
            var out = null, err = null;
            try { out = composeShot(); } catch (e) { err = e; }
            if (!out) {
                capturing = false;
                toast('error', t('shotFailed'));
                if (done) done(err || new Error('no canvas'));
                return;
            }
            var fail = function (e) {
                capturing = false;
                toast('error', e && e.name === 'SecurityError' ? t('shotTainted') : t('shotFailed'));
                if (done) done(e || new Error('toBlob'));
            };
            try {
                out.toBlob(function (blob) {
                    capturing = false;
                    if (!blob) { fail(null); return; }
                    try { saveShot(blob); } catch (e) { toast('error', t('shotFailed')); }
                    if (done) done(null, blob, out);
                }, 'image/png');
            } catch (e) { fail(e); }
        });
    }
    /* All game layers in their stacking order onto one canvas of the main canvas' pixel size. */
    function composeShot() {
        var layers = gameCanvases().filter(shown);
        if (!layers.length) return null;
        var main = (W.drawRender && W.drawRender.canvas) || layers[0];
        var base = main.getBoundingClientRect();
        var w = main.width || Math.round(base.width), h = main.height || Math.round(base.height);
        if (!(w > 0 && h > 0)) return null;
        var sx = w / (base.width || w), sy = h / (base.height || h);
        var out = D.createElement('canvas');
        out.width = w;
        out.height = h;
        var ctx = out.getContext('2d');
        var bg = W.getComputedStyle(D.body).backgroundColor;
        ctx.fillStyle = bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg) ? bg : '#000';
        ctx.fillRect(0, 0, w, h);
        layers.forEach(function (c) {
            var r = rectIn(c.getBoundingClientRect(), base, sx, sy);
            var f = W.getComputedStyle(c).filter;
            ctx.save();
            if (f && f !== 'none' && 'filter' in ctx) ctx.filter = f;
            ctx.drawImage(c, r[0], r[1], r[2], r[3]);
            ctx.restore();
        });
        return out;
    }
    var lastShotUrl = null;
    function saveShot(blob) {
        if (lastShotUrl) { try { URL.revokeObjectURL(lastShotUrl); } catch (e) { } }
        var url = lastShotUrl = URL.createObjectURL(blob), name = 'legendmod-' + stamp() + '.png';
        /* phones (and the expanding.land frame) often ignore downloads: show the picture to keep */
        if (isTouch()) { showPreview(url, name); return; }
        var a = el('a');
        a.href = url;
        a.download = name;
        a.style.display = 'none';
        D.body.appendChild(a);
        a.click();
        setTimeout(function () { if (a.parentNode) a.parentNode.removeChild(a); }, 1000);
        toast('success', t('shotSaved'));
    }
    function closePreview() { var p = D.getElementById('lm-st-shot-preview'); if (p && p.parentNode) p.parentNode.removeChild(p); }
    function showPreview(url, name) {
        closePreview();
        var c = colors();
        var p = el('div', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:999997;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:8px;box-sizing:border-box;color:#fff;font:12px sans-serif;');
        p.id = 'lm-st-shot-preview';
        /* full screen: not a window (.lm-modal-container would give it a window's border and corners);
         * lm-st-win only for the button style */
        p.classList.add('lm-st-win');
        p.dir = langDir();
        var img = el('img', 'max-width:100%;max-height:calc(100% - 60px);object-fit:contain;border:1px solid rgba(255,255,255,0.3);');
        img.src = url;
        img.alt = name;
        p.appendChild(img);
        p.appendChild(el('div', 'opacity:.85;text-align:center;', t('shotPreview')));
        var row = el('div', 'display:flex;gap:8px;');
        var a = el('a', 'display:inline-block;line-height:30px;text-decoration:none;background:' + c.mc + ';color:' + c.pc + ';', t('save'));
        a.className = 'lm-st-btn main';
        a.href = url;
        a.download = name;
        row.appendChild(a);
        row.appendChild(button(t('close'), false, closePreview));
        p.appendChild(row);
        ['mousedown', 'pointerdown', 'touchstart'].forEach(function (ev) { p.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true }); });
        D.body.appendChild(p);
    }
    /* ═══ The menu at a setting, the Hotkeys window at a command (LMSmallTools.jump) ═══ */

    function showMenu() {
        try {
            var ov = D.getElementById('overlays');
            if ((!ov || ov.style.display === 'none' || !ov.offsetHeight) && W.application && typeof W.application.showMenu === 'function') W.application.showMenu();
        } catch (e) { }
    }
    function flash(node) {
        if (!node) return;
        try { node.scrollIntoView({ block: 'center' }); } catch (e) { try { node.scrollIntoView(); } catch (e2) { } }
        node.classList.add('lm-st-flash');
        setTimeout(function () { node.classList.remove('lm-st-flash'); }, noMotion() ? 3000 : 2400);
    }
    /* the hotkeys window at a command's row (the field is not focused: a key press would rebind it) */
    function jumpHotkey(cmd) {
        var hkWin = D.getElementById('hotkeys');
        if (hkWin && !(hkWin.offsetWidth || hkWin.offsetHeight)) {
            showMenu();
            var link = D.querySelector('.hotkeys-link');
            if (link) link.click();
        }
        setTimeout(function () {
            var input = D.getElementById(cmd);
            var row = input && input.closest ? input.closest('.row') : null;
            flash(row || input);
            try { if (W.jQuery) W.jQuery('#hotkeys-cfg').perfectScrollbar('update'); } catch (e) { }
        }, 550);
    }
    function jumpSetting(id) {
        /* a control of the Hotkeys window */
        var hkEl = D.getElementById(id);
        if (hkEl && hkEl.closest && hkEl.closest('#hotkeys')) { jumpHotkey(id); return; }
        showMenu();
        var tab = D.querySelector('.menu-tabs a[href="#og-settings"]');
        if (tab) tab.click();
        setTimeout(function () { var n = D.getElementById(id); flash(n && n.closest ? n.closest('.preset-box, label, div') || n : n); }, 300);
    }

    /* ═══ Private data out of Settings > "Copy debug info" ═══ */

    function secretsNow() {
        var out = [], add = function (s) { if (typeof s === 'string' && s.trim()) out.push(s.trim()); };
        (Array.isArray(W.profiles) ? W.profiles : []).forEach(function (p) { if (p) { add(p.nick); add(p.clanTag); add(p.skinURL); } });
        var o = W.ogarcopythelb;
        if (o) { add(o.nick); add(o.clanTag); add(o.skinURL); }
        ['nick', 'clantag', 'skin'].forEach(function (id) { var n = D.getElementById(id); if (n) add(n.value); });
        var s = settings();
        if (typeof s.FacebookIDs === 'string') s.FacebookIDs.split(/[\s,;]+/).forEach(add);
        return out;
    }
    function redactReport(text) { return redact(text, secretsNow(), { keepHosts: true }); }

    /* ═══ Wiring ═══ */

    api.shotToggle = function () { if (shot) shotOff(); else shotOn(); };
    api.shotOn = shotOn;
    api.shotOff = shotOff;
    api.shotActive = function () { return !!shot; };
    api.capture = capture;
    api.compose = function () { return composeShot(); };
    api.redactReport = redactReport;
    /* Checked by the hotkeys window when a key is pressed for a command (ogario.v4.js setHotkey):
     * null = fine; { level: 'block' } = the browser or Legend Mod keeps that key, so it is refused;
     * { level: 'warn' } = allowed, but the browser may still act on it. */
    api.keyCheck = function (key) {
        key = String(key || '');
        /* what: the reason in the chosen language; msg: the whole message for the toast */
        var res = function (level, what) { return { level: level, what: what, msg: t(level === 'block' ? 'kcBlock' : 'kcWarn', [key, what]) }; };
        if (own(BUILTIN_KEYS, key)) return res('block', t('usedBy', t(BUILTIN_KEYS[key])));
        if (own(BROWSER_KEYS, key)) {
            var b = BROWSER_KEYS[key];
            if (b[0] === 'block' || b[0] === 'warn') return res(b[0], browserWhat(b));
        }
        return null;
    };
    /* the menu at a setting or the Hotkeys window at a command's row, highlighted (the Settings
     * search's Hotkeys hints) */
    api.jump = function (id) {
        if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(id)) return false;
        addStyle();
        jumpSetting(id);
        return true;
    };

    /* Language change: the HUD hide chip follows. */
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(function () {
        try {
            var cap = D.getElementById('lm-shot-cap'), sx = D.getElementById('lm-shot-x');
            if (cap) cap.textContent = t('shotCapture');
            if (sx) sx.title = t('close');
        } catch (e) { }
    });
})();
