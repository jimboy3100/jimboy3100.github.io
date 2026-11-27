/* Legend Mod small tools: radial command menu, the conflict list of the Hotkeys window, the HUD hide of
 * Show/hide HUD (Alt+H, the former screenshot mode) with its capture, and skin collections.
 * Everything is off until used: windows and hotkeys without default keys
 * (all listed in the Command Centre), and the "Collections" button of the skins panel, whose window
 * loads its data only when opened. Nothing runs per frame while no tool is open.
 * Stored data, each in its own localStorage key, checked when read:
 *   lmRadialMenu      the commands of the radial menu (hotkey ids, up to 8)
 *   lmSkinCollections folders, tags and favourites of skins (the profiles keep their own format)
 *   lmSmallTools      screenshot options
 * It also takes private data out of the text of Settings > "Copy debug info" (redactReport).
 */
(function () {
    'use strict';
    var W = window;
    if (W._lmSmallToolsLoaded) return;
    W._lmSmallToolsLoaded = true;
    var D = W.document;

    function own(o, k) { return !!o && Object.prototype.hasOwnProperty.call(o, k); }
    function isObj(o) { return !!o && typeof o === 'object' && !Array.isArray(o); }
    /* printable text of limited length (shown with textContent, stored as JSON) */
    function cleanText(s, max) {
        if (typeof s !== 'string') return '';
        return s.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
    }

    /* Texts from the language packs (developers/i18n/src, keys modules.smalltools.*): the chosen
     * language, else English. vars fill {0} {1}. A few labels are the same as settings / hotkey labels
     * and use those keys. */
    var TP = 'modules.smalltools.';
    var SHARED = { close: 'settings.close', shotStart: 'settings.hk-showHUD', shotHelp: 'pkg.mg.shotHelp', shotTainted: 'pkg.mg.shotTainted', skinsTitle: 'settings.hk-skinCollections', cMouseOff: 'pkg.mb.cMouseOff', cMoved: 'pkg.mb.cMoved', cMovedOk: 'pkg.mb.cMovedOk' };
    function t(k, vars) { return typeof W.lmT === 'function' ? W.lmT(own(SHARED, k) ? SHARED[k] : TP + k, vars) : k; }
    function langDir() { return W.LMi18n && W.LMi18n.dir ? W.LMi18n.dir() : 'ltr'; }

    /* ═══ Pure helpers (developers/tests/smalltools.js) ═══ */

    var HK_RE = /^hk-[A-Za-z0-9_-]{1,40}$/;
    var RADIAL_MAX = 8;
    /* commands that cannot be put on the ring (the ring itself) */
    var RADIAL_SKIP = { 'hk-radialMenu': 1 };

    /* the stored ring: up to 8 distinct hotkey ids; exists(id) drops commands that are gone */
    function cleanRadial(raw, exists) {
        var list = isObj(raw) && Array.isArray(raw.items) ? raw.items : (Array.isArray(raw) ? raw : []);
        var out = [], seen = {};
        for (var i = 0; i < list.length && out.length < RADIAL_MAX; i++) {
            var id = list[i];
            if (typeof id !== 'string' || !HK_RE.test(id) || own(RADIAL_SKIP, id) || own(seen, id)) continue;
            if (exists && !exists(id)) continue;
            seen[id] = 1;
            out.push(id);
        }
        return out;
    }

    /* Which of n ring sectors the offset (dx, dy) points at (screen y grows down). Sector 0 is at
     * the top, then clockwise. -1 inside the dead zone or without sectors. */
    function pickSector(dx, dy, n, dead) {
        dx = +dx || 0; dy = +dy || 0; n = n | 0;
        if (n < 1) return -1;
        if (Math.sqrt(dx * dx + dy * dy) < (dead > 0 ? dead : 0)) return -1;
        if (n === 1) return 0;
        var a = Math.atan2(dx, -dy);
        if (a < 0) a += Math.PI * 2;
        var step = Math.PI * 2 / n;
        return Math.floor((a + step / 2) / step) % n;
    }
    /* centre angle of sector i (radians, 0 = up, clockwise) */
    function sectorAngle(i, n) { return n > 0 ? i * Math.PI * 2 / n : 0; }

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
        'CTRL+E': ['info', 'search'], 'CTRL+K': ['warn', 'commandCentre'],
        'CTRL+=': ['info', 'zoom'], 'CTRL+-': ['info', 'zoom'], 'CTRL+0': ['info', 'zoomReset'],
        'CTRL+PGUP': ['info', 'switchTabs'], 'CTRL+PGDN': ['info', 'switchTabs'],
        'ALT+LEFT': ['info', 'back'], 'ALT+RIGHT': ['info', 'forward'], 'ALT+HOME': ['info', 'home']
    };
    for (var _bk = 1; _bk <= 9; _bk++) BROWSER_KEYS['CTRL+' + _bk] = ['info', 'tabN', _bk];
    /* what the browser does with a key of BROWSER_KEYS, in the chosen language ("closes the tab") */
    function browserWhat(b) { return t('bk.' + b[1], b.length > 2 ? b[2] : undefined); }
    /* keys Legend Mod itself uses outside the hotkeys list (name of their use: a text key) */
    var BUILTIN_KEYS = { 'ESC': 'menuEsc' };
    function builtinKeys() {
        var o = {};
        for (var k in BUILTIN_KEYS) if (own(BUILTIN_KEYS, k)) o[k] = t(BUILTIN_KEYS[k]);
        return o;
    }
    /* the gamepad's own actions and the hotkey that does the same */
    var PAD_SAME = { split: 'hk-split', doubleSplit: 'hk-doubleSplit', split16: 'hk-split16', feed: 'hk-macroFeed', multiboxSwap: 'hk-multiboxswap' };

    /* Conflicts of the key / mouse / gamepad bindings.
     * inp.keys: [[keyName, commandId], ...] (the hotkeys map, mouse buttons included ('MOUSE
     * RIGHT'...); may hold the same key twice), inp.mouseOff: { mouseKey: { what, opt } } (buttons
     * another setting uses instead: sticky cells), inp.moved: [{ key, from, to }] (buttons the old
     * mouse settings gave to another command), inp.pad: { buttonIndex: action },
     * inp.padNames: [name per button], inp.builtin: { key: label } (default BUILTIN_KEYS),
     * inp.exists(cmd): command still defined.
     * Result: [{ kind: 'dup'|'browser'|'mouseOff'|'moved'|'pad', level: 'error'|'warn'|'info', key, cmds, ... }] */
    function findConflicts(inp) {
        inp = inp || {};
        var out = [], byKey = {}, keyOfCmd = {}, order = [];
        var keys = Array.isArray(inp.keys) ? inp.keys : [];
        var exists = typeof inp.exists === 'function' ? inp.exists : function () { return true; };
        for (var i = 0; i < keys.length; i++) {
            var p = keys[i];
            if (!Array.isArray(p) || typeof p[0] !== 'string' || typeof p[1] !== 'string') continue;
            var k = p[0].trim(), c = p[1];
            if (!k || k === 'spec-messageKey' || !c || !exists(c)) continue;
            /* key names are upper case; an imported lower case letter is the same key */
            var nk = k.length === 1 ? k.toUpperCase() : k;
            if (!own(byKey, nk)) { byKey[nk] = []; order.push(nk); }
            if (byKey[nk].indexOf(c) < 0) byKey[nk].push(c);
            if (!own(keyOfCmd, c)) keyOfCmd[c] = nk;
        }
        var builtin = isObj(inp.builtin) ? inp.builtin : builtinKeys();
        order.forEach(function (key) {
            var cmds = byKey[key];
            if (cmds.length > 1) out.push({ kind: 'dup', level: 'error', key: key, cmds: cmds.slice() });
            if (own(builtin, key)) out.push({ kind: 'dup', level: 'error', key: key, cmds: cmds.slice(), builtin: builtin[key] });
            if (own(BROWSER_KEYS, key)) {
                var b = BROWSER_KEYS[key];
                out.push({ kind: 'browser', level: b[0] === 'block' ? 'error' : b[0], key: key, cmds: cmds.slice(), what: browserWhat(b) });
            }
            var off = isObj(inp.mouseOff) && own(inp.mouseOff, key) && isObj(inp.mouseOff[key]) ? inp.mouseOff[key] : null;
            if (off) out.push({ kind: 'mouseOff', level: 'warn', key: key, cmds: cmds.slice(), what: String(off.what || ''), opt: typeof off.opt === 'string' ? off.opt : '' });
        });
        (Array.isArray(inp.moved) ? inp.moved : []).forEach(function (m) {
            if (!isObj(m) || typeof m.key !== 'string' || typeof m.to !== 'string' || typeof m.from !== 'string') return;
            /* only while the button still runs what the old setting gave it */
            if (!own(byKey, m.key) || byKey[m.key].indexOf(m.to) < 0) return;
            out.push({ kind: 'moved', level: 'warn', key: m.key, cmds: exists(m.from) && m.from !== m.to ? [m.to, m.from] : [m.to], from: m.from, to: m.to });
        });
        if (isObj(inp.pad)) {
            var names = Array.isArray(inp.padNames) ? inp.padNames : [];
            Object.keys(inp.pad).sort(function (a, b) { return a - b; }).forEach(function (bi) {
                var a = inp.pad[bi];
                if (typeof a !== 'string') return;
                var cmd = HK_RE.test(a) ? a : (own(PAD_SAME, a) ? PAD_SAME[a] : null);
                if (!cmd || !own(keyOfCmd, cmd)) return;
                out.push({ kind: 'pad', level: 'info', key: keyOfCmd[cmd], cmds: [cmd], button: +bi, name: names[bi] || t('padButton', bi) });
            });
        }
        return out;
    }

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

    /* ── skin collections ── */
    var COL_MAX_ITEMS = 500, COL_MAX_FOLDERS = 40, COL_MAX_TAGS = 10;
    function cleanSkinKey(u) {
        if (typeof u !== 'string') return '';
        u = u.trim();
        if (!u || u.length > 600 || /[\u0000-\u001f\u007f<>"]/.test(u)) return '';
        return u;
    }
    function cleanTag(t) { return cleanText(t, 24).toLowerCase().replace(/,/g, ''); }
    function cleanFolder(f) { return cleanText(f, 32); }
    function cleanTags(list) {
        var out = [];
        (Array.isArray(list) ? list : typeof list === 'string' ? list.split(',') : []).forEach(function (t) {
            t = cleanTag(t);
            if (t && out.indexOf(t) < 0 && out.length < COL_MAX_TAGS) out.push(t);
        });
        return out;
    }
    /* { v: 1, folders: [name], items: { skinUrl: { f: folder|'', t: [tag], s: favourite, a: added } } } */
    function cleanCollections(raw) {
        var out = { v: 1, folders: [], items: {} };
        if (!isObj(raw)) return out;
        (Array.isArray(raw.folders) ? raw.folders : []).forEach(function (f) {
            f = cleanFolder(f);
            if (f && out.folders.indexOf(f) < 0 && out.folders.length < COL_MAX_FOLDERS) out.folders.push(f);
        });
        var items = isObj(raw.items) ? raw.items : {}, n = 0;
        Object.keys(items).forEach(function (k) {
            var key = cleanSkinKey(k), it = items[k];
            if (!key || !isObj(it) || n >= COL_MAX_ITEMS || own(out.items, key)) return;
            var f = cleanFolder(it.f);
            if (f && out.folders.indexOf(f) < 0) f = '';
            var o = { f: f, t: cleanTags(it.t), s: it.s === true };
            if (typeof it.a === 'number' && isFinite(it.a) && it.a > 0) o.a = Math.floor(it.a);
            out.items[key] = o;
            n++;
        });
        return out;
    }
    /* an entry that carries nothing is not stored */
    function emptyItem(it) { return !it || (!it.f && !it.s && !(it.t && it.t.length) && !it.a); }
    /* skins: [{ url, label, profile }]; folder: '' all, '*' favourites, '-' unfiled, else a folder name */
    function filterSkins(skins, col, query, folder) {
        var q = String(query || '').toLowerCase().trim().split(/\s+/).filter(Boolean);
        return skins.filter(function (sk) {
            var it = col.items[sk.url] || { f: '', t: [], s: false };
            if (folder === '*' && !it.s) return false;
            if (folder === '-' && it.f) return false;
            if (folder && folder !== '*' && folder !== '-' && it.f !== folder) return false;
            if (!q.length) return true;
            var hay = (sk.url + ' ' + (sk.label || '') + ' ' + it.f + ' ' + it.t.join(' ') + (it.s ? ' favourite favorite' : '')).toLowerCase();
            return q.every(function (w) { return w.charAt(0) === '#' ? it.t.indexOf(w.slice(1)) >= 0 : hay.indexOf(w) >= 0; });
        }).sort(function (a, b) {
            var sa = (col.items[a.url] || {}).s ? 1 : 0, sb = (col.items[b.url] || {}).s ? 1 : 0;
            return sb - sa;
        });
    }
    function cleanShotOpts(raw) {
        return { lb: isObj(raw) && raw.lb === true, map: isObj(raw) && raw.map === true };
    }

    var core = {
        cleanRadial: cleanRadial, pickSector: pickSector, sectorAngle: sectorAngle, RADIAL_MAX: RADIAL_MAX,
        findConflicts: findConflicts, BROWSER_KEYS: BROWSER_KEYS, redact: redact,
        cleanCollections: cleanCollections, cleanTags: cleanTags, filterSkins: filterSkins, emptyItem: emptyItem,
        cleanSkinKey: cleanSkinKey, cleanShotOpts: cleanShotOpts
    };
    var api = W.LMSmallTools = { _core: core };
    if (!D || !D.createElement) return;

    /* ═══ Shared bits ═══ */

    function plain(s) {
        if (s == null) return '';
        return String(s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim();
    }
    function toast(kind, msg) {
        try { if (W.toastr && W.toastr[kind]) W.toastr[kind](String(msg).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; })); } catch (e) { }
    }
    function lsGet(k) {
        try { var r = W.localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; }
    }
    function lsSet(k, v) {
        try { W.localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; }
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
    function hkLabel(id) {
        var hc = W.hotkeysCommand, c = hc && hc[id];
        if (!c) return id;
        if (c.type === 'command') {
            var txt = plain((W.chatCommand || {})[id.replace(/^hk-/, '')]);
            return t('quickChat', id.replace(/^hk-comm/, '')) + (txt ? ': ' + txt : '');
        }
        var l = '';
        try { l = plain(c.label); } catch (e) { }
        return l || id;
    }
    function hkExists(id) { var hc = W.hotkeysCommand; return !!(hc && own(hc, id) && hc[id] && typeof hc[id].keyDown === 'function'); }
    function keyOf(cmd) {
        var hk = W.hotkeys;
        if (!isObj(hk)) return '';
        for (var k in hk) if (own(hk, k) && k !== 'spec-messageKey' && hk[k] === cmd) return k;
        return '';
    }
    /* press a hotkey command briefly (hold commands get their release, like the Command Centre) */
    function runHotkey(id) {
        /* the Command Centre's press: never releases a command a key or gamepad button holds */
        var CC = W.LMCommandCentre;
        if (CC && typeof CC.tapHotkey === 'function') { CC.tapHotkey(id); return; }
        var hc = W.hotkeysCommand, c = hc && hc[id];
        if (!c || typeof c.keyDown !== 'function') return;
        try { c.keyDown(); } catch (e) { console.warn('[LM tools] ' + id, e); }
        if (typeof c.keyUp === 'function') setTimeout(function () { try { c.keyUp(); } catch (e) { } }, 250);
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
            '.lm-st-win select,.lm-st-win input[type=text],.lm-st-win input[type=search]{background:var(--lm-w-field,' + c.pc2 + ');color:' + c.tc + ';border:1px solid ' + c.pc2 + ';border-radius:var(--lm-radius-s,4px);height:var(--lm-w-ctl,30px);font-size:var(--lm-w-fs,12px);padding:0 6px;min-width:0;box-sizing:border-box;}' +
            '.lm-st-win input[type=checkbox]{width:18px;height:18px;margin:0 8px 0 0;flex:none;}' +
            '.lm-st-win label{font-weight:400;margin:0;display:flex;align-items:center;min-height:var(--lm-w-ctl,30px);cursor:pointer;}' +
            // i18n-ok: CSS
            '.lm-st-win .lm-st-btn{flex:none;cursor:pointer;min-height:var(--lm-w-ctl,30px);padding:0 12px;border-radius:var(--lm-radius-s,4px);border:1px solid ' + c.pc2 + ';background:var(--lm-w-btn,rgba(255,255,255,0.05));color:inherit;font-size:var(--lm-w-fs,12px);font-family:inherit;}' +
            '.lm-st-win .lm-st-btn:hover{background:var(--lm-w-btn-h,rgba(255,255,255,0.12));}' +
            // i18n-ok: CSS
            '.lm-st-win .lm-st-btn.main{background:' + c.mc + ';color:' + c.pc + ';border-color:' + c.mc + ';font-weight:700;}' +
            '.lm-st-win .lm-st-help{opacity:.8;font-size:var(--lm-w-fs-s,11px);line-height:1.45;margin:0 0 8px;}' +
            // i18n-ok: CSS
            '.lm-st-win a.lm-st-link,#lm-hk-conf-list a.lm-st-link{color:' + c.mc + ';cursor:pointer;text-decoration:underline;white-space:nowrap;}' +
            '.lm-st-row{display:flex;align-items:center;gap:8px;margin:0 0 6px;}' +
            '.lm-st-flash{outline:3px solid ' + c.mc + ' !important;outline-offset:1px;}' +
            /* screenshot mode: only the game view and the exit chip stay visible */
            '.lm-shot-hide{visibility:hidden !important;}' +
            'body.lm-shot-on #toast-container{visibility:hidden !important;}' +
            /* HUD font, weight and scale (Theme > HUD); the tap targets stay at least 30 px */
            '#lm-shot-chip{position:fixed;right:8px;bottom:8px;z-index:999996;display:flex;gap:6px;transition:opacity .4s;font-size:calc(12px * var(--lm-hud-scale,1));}' +
            '#lm-shot-chip div{cursor:pointer;min-width:max(30px,calc(34px * var(--lm-hud-scale,1)));height:max(30px,calc(34px * var(--lm-hud-scale,1)));line-height:max(30px,calc(34px * var(--lm-hud-scale,1)));padding:0 10px;border-radius:17px;text-align:center;background:rgba(0,0,0,0.55);color:#fff;border:1px solid rgba(255,255,255,0.35);box-sizing:border-box;}' +
            '#lm-shot-chip.idle{opacity:.18;}' +
            '#lm-radial{position:fixed;left:0;top:0;right:0;bottom:0;z-index:999994;cursor:crosshair;touch-action:none;}' +
            '#lm-radial .lm-rd-item{position:absolute;transform:translate(-50%,-50%);max-width:calc(120px * var(--lm-hud-scale,1));padding:4px 8px;border-radius:var(--lm-radius,6px);background:rgba(0,0,0,0.72);color:#fff;font-family:inherit;font-weight:var(--lm-hud-fw,600);font-size:calc(12px * var(--lm-hud-scale,1));text-align:center;border:2px solid rgba(255,255,255,0.25);white-space:normal;line-height:1.25;pointer-events:none;}' +
            '#lm-radial .lm-rd-item.on{background:' + c.mc + ';color:' + c.pc + ';border-color:#fff;}' +
            '#lm-radial .lm-rd-ring{position:absolute;border-radius:50%;border:2px dashed rgba(255,255,255,0.35);pointer-events:none;box-sizing:border-box;}' +
            '#lm-radial .lm-rd-dot{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#fff;pointer-events:none;}' +
            '.lm-st-skin{display:flex;flex-direction:column;gap:4px;padding:6px;border-radius:var(--lm-radius,6px);background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);min-width:0;}' +
            '.lm-st-skin img{width:48px;height:48px;border-radius:50%;object-fit:cover;background:rgba(0,0,0,0.3);flex:none;}' +
            '.lm-st-star{cursor:pointer;font-size:20px;line-height:30px;width:30px;text-align:center;flex:none;user-select:none;}' +
            '.lm-st-conf{padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.08);line-height:1.45;}' +
            '.lm-st-lvl{display:inline-block;min-width:44px;margin-right:6px;padding:0 4px;border-radius:var(--lm-radius-s,3px);font-size:10px;font-weight:700;text-align:center;text-transform:uppercase;}';
        D.head.appendChild(s);
    }

    /* One window at a time; a tap outside or Esc closes it. Fits a 915x412 phone. */
    var win = null;
    function closeWin() {
        if (!win) return;
        var w = win;
        win = null;
        W.removeEventListener('keydown', onWinKey, true);
        [w.backdrop, w.root].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
        if (w.onClose) try { w.onClose(); } catch (e) { }
    }
    function onWinKey(e) {
        if (!win) return;
        /* Esc closes the window only (it does not open the menu as well); typing in the window's
         * fields runs no hotkeys anyway (the key handler skips text fields) */
        if (!(e.key === 'Escape' || e.keyCode === 27)) return;
        /* with another window open that closes on Esc, only the one in front closes (winstack.js) */
        if (W.LMWinStack && typeof W.LMWinStack.escFor === 'function' && !W.LMWinStack.escFor(win.root, e)) return;
        e.preventDefault(); e.stopPropagation(); closeWin();
    }
    function openWin(id, title, width) {
        closeWin();
        addStyle();
        var c = colors();
        var backdrop = el('div', 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:999991;background:rgba(0,0,0,0.55);');
        backdrop.id = id + '-backdrop';
        backdrop.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); closeWin(); });
        var root = el('div', 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:' + (width || 560) + 'px;max-width:calc(100vw - 16px);' +
            'max-height:calc(100vh - 16px);display:flex;flex-direction:column;box-sizing:border-box;z-index:999992;' +
            'background:var(--lm-w-bg,' + c.pc + ');border:1px solid ' + c.pc2 + ';border-top:3px solid ' + c.mc + ';border-radius:var(--lm-radius,6px);' +
            'box-shadow:0 8px 32px rgba(0,0,0,0.5);color:' + c.tc + ';font-family:inherit;font-size:var(--lm-w-fs,12px);overflow:hidden;text-align:left;');
        root.id = id;
        root._lmEsc = true;
        root.classList.add('lm-modal-container', 'lm-w', 'lm-st-win');
        root.dir = langDir();
        var head = el('div', 'flex:none;display:flex;align-items:center;gap:8px;padding:var(--lm-w-hpad,4px 6px 4px 12px);border-bottom:1px solid ' + c.pc2 + ';background:var(--lm-w-head,linear-gradient(180deg,' + c.pc2 + ' 0%,' + c.pc + ' 100%));');
        head.appendChild(el('div', 'flex:1;min-width:0;font-size:var(--lm-w-title,15px);font-weight:700;color:' + c.mc + ';letter-spacing:1px;text-transform:uppercase;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;', title));
        var x = el('div', 'flex:none;cursor:pointer;font-size:18px;color:' + c.tc2 + ';width:var(--lm-w-x,36px);height:var(--lm-w-x,36px);display:flex;align-items:center;justify-content:center;border-radius:var(--lm-radius-s,4px);background:var(--lm-w-btn,rgba(255,255,255,0.06));', '✕');
        x.className = 'lm-st-close';
        x.title = t('close');
        x.setAttribute('role', 'button');
        x.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); closeWin(); });
        head.appendChild(x);
        root.appendChild(head);
        var body = el('div', 'flex:1 1 auto;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:var(--lm-w-pad,8px 12px 12px);');
        root.appendChild(body);
        var foot = el('div', 'flex:none;display:flex;flex-wrap:wrap;gap:var(--lm-w-gap,6px);justify-content:flex-end;padding:6px 12px;border-top:1px solid ' + c.pc2 + ';');
        root.appendChild(foot);
        /* clicks inside must not reach the game (mouse split / feed) */
        ['mousedown', 'pointerdown', 'touchstart', 'wheel'].forEach(function (ev) {
            root.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
        });
        D.body.appendChild(backdrop);
        D.body.appendChild(root);
        W.addEventListener('keydown', onWinKey, true);
        win = { id: id, root: root, body: body, foot: foot, backdrop: backdrop };
        return win;
    }
    function button(text, main, onClick) {
        var b = el('button', '', text);
        b.type = 'button';
        b.className = 'lm-st-btn' + (main ? ' main' : '');
        b.addEventListener('click', function (e) { e.preventDefault(); onClick(e); });
        return b;
    }
    function check(text, on, onChange) {
        var l = el('label'), cb = el('input');
        cb.type = 'checkbox';
        cb.checked = !!on;
        cb.addEventListener('change', function () { onChange(cb.checked); });
        l.appendChild(cb);
        l.appendChild(D.createTextNode(text));
        return l;
    }
    function isOpen(id) { return !!(win && win.id === id); }

    /* ═══ 1. Radial command menu ═══ */

    var RADIAL_KEY = 'lmRadialMenu';
    function radialItems() { return cleanRadial(lsGet(RADIAL_KEY), hkExists); }
    var ring = null;
    function ringPos(e) {
        if (e && e.touches && e.touches[0]) return [e.touches[0].clientX, e.touches[0].clientY];
        if (e && e.changedTouches && e.changedTouches[0]) return [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        return [e.clientX, e.clientY];
    }
    function ringSelect(i) {
        if (!ring || ring.sel === i) return;
        ring.sel = i;
        for (var k = 0; k < ring.els.length; k++) ring.els[k].className = 'lm-rd-item' + (k === i ? ' on' : '');
    }
    function ringPoint(x, y) {
        if (!ring) return;
        ring.mx = x; ring.my = y;
        ringSelect(pickSector(x - ring.cx, y - ring.cy, ring.items.length, ring.dead));
    }
    function ringClose(run) {
        if (!ring) return;
        var r = ring;
        ring = null;
        if (r.raf) cancelAnimationFrame(r.raf);
        W.removeEventListener('keydown', ringKey, true);
        if (r.root.parentNode) r.root.parentNode.removeChild(r.root);
        if (run && r.sel >= 0 && r.items[r.sel]) runHotkey(r.items[r.sel]);
    }
    function ringKey(e) {
        if (ring && (e.key === 'Escape' || e.keyCode === 27)) { e.preventDefault(); e.stopPropagation(); ringClose(false); }
    }
    /* the right stick of the first connected pad (window.LMGamepad) */
    function ringPad() {
        if (!ring) return;
        ring.raf = requestAnimationFrame(ringPad);
        var g = W.LMGamepad;
        if (!g || typeof g.pads !== 'function') return;
        var p = g.pads()[0];
        if (!p || !p.axes || p.axes.length < 4) return;
        var x = +p.axes[2] || 0, y = +p.axes[3] || 0;
        if (Math.sqrt(x * x + y * y) < 0.5) return;
        ringSelect(pickSector(x, y, ring.items.length, 0));
    }
    function ringOpen(hold) {
        if (ring) { ringClose(false); return; }
        var items = radialItems();
        if (!items.length) { toast('info', t('radialEmpty')); openRadialEditor(); return; }
        addStyle();
        var vw = W.innerWidth, vh = W.innerHeight;
        var R = Math.max(70, Math.min(130, Math.min(vw, vh) / 2 - 50));
        var lm = W.legendmod || {};
        var cx = typeof lm.clientX === 'number' && lm.clientX > 0 ? lm.clientX : vw / 2;
        var cy = typeof lm.clientY === 'number' && lm.clientY > 0 ? lm.clientY : vh / 2;
        cx = Math.min(vw - R - 50, Math.max(R + 50, cx));
        cy = Math.min(vh - R - 24, Math.max(R + 24, cy));
        var root = el('div');
        root.id = 'lm-radial';
        var rg = el('div');
        rg.className = 'lm-rd-ring';
        rg.style.cssText = 'left:' + (cx - R) + 'px;top:' + (cy - R) + 'px;width:' + (2 * R) + 'px;height:' + (2 * R) + 'px;';
        root.appendChild(rg);
        var dot = el('div');
        dot.className = 'lm-rd-dot';
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
        root.appendChild(dot);
        var els = items.map(function (id, i) {
            var a = sectorAngle(i, items.length);
            var it = el('div', 'left:' + Math.round(cx + Math.sin(a) * R) + 'px;top:' + Math.round(cy - Math.cos(a) * R) + 'px;', hkLabel(id));
            it.className = 'lm-rd-item';
            root.appendChild(it);
            return it;
        });
        ring = { root: root, els: els, items: items, cx: cx, cy: cy, dead: Math.min(28, R * 0.3), sel: -1, hold: !!hold, t0: Date.now(), raf: 0 };
        /* the layer takes the mouse: the game cursor stays where it was while choosing */
        root.addEventListener('mousemove', function (e) { ringPoint(e.clientX, e.clientY); });
        root.addEventListener('pointerdown', function (e) {
            e.preventDefault(); e.stopPropagation();
            var p = ringPos(e);
            ringPoint(p[0], p[1]);
            if (!ring.hold) ringClose(true);
        });
        ['mousedown', 'mouseup', 'click', 'contextmenu', 'touchstart', 'wheel'].forEach(function (ev) {
            root.addEventListener(ev, function (e) { e.stopPropagation(); if (ev !== 'wheel' && ev !== 'touchstart') e.preventDefault(); }, ev === 'touchstart' || ev === 'wheel' ? { passive: true } : false);
        });
        D.body.appendChild(root);
        W.addEventListener('keydown', ringKey, true);
        ring.raf = requestAnimationFrame(ringPad);
    }
    /* key released: run the command pointed at; a short tap leaves the ring open for a click */
    function ringRelease() {
        if (!ring || !ring.hold) return;
        if (ring.sel >= 0) { ringClose(true); return; }
        if (Date.now() - ring.t0 < 350) { ring.hold = false; return; }
        ringClose(false);
    }

    function openRadialEditor() {
        var w = openWin('lm-st-radial', t('radialTitle'), 620);
        w.body.appendChild(el('p', '', t('radialHelp'))).className = 'lm-st-help';
        var hc = W.hotkeysCommand || {};
        var ids = Object.keys(hc).filter(function (id) { return HK_RE.test(id) && !own(RADIAL_SKIP, id) && hkExists(id); });
        var opts = ids.map(function (id) { return [id, hkLabel(id)]; }).sort(function (a, b) { return a[1].localeCompare(b[1]); });
        var cur = radialItems();
        var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px 12px;');
        var sels = [];
        for (var i = 0; i < RADIAL_MAX; i++) {
            var row = el('div');
            row.className = 'lm-st-row';
            row.style.margin = '0';
            row.appendChild(el('span', 'flex:none;width:52px;opacity:.8;', t('slot', i + 1)));
            var s = el('select', 'flex:1;');
            s.id = 'lm-st-radial-' + i;
            var o0 = el('option', '', t('none'));
            o0.value = '';
            s.appendChild(o0);
            opts.forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; s.appendChild(op); });
            s.value = cur[i] || '';
            row.appendChild(s);
            grid.appendChild(row);
            sels.push(s);
        }
        w.body.appendChild(grid);
        w.foot.appendChild(button(t('reset'), false, function () { sels.forEach(function (s) { s.value = ''; }); }));
        w.foot.appendChild(button(t('save'), true, function () {
            var list = cleanRadial(sels.map(function (s) { return s.value; }), hkExists);
            if (!lsSet(RADIAL_KEY, { v: 1, items: list })) { toast('error', t('storageFull')); return; }
            toast('success', t('radialSaved'));
            closeWin();
        }));
        w.foot.appendChild(button(t('close'), false, closeWin));
    }

    /* ═══ 2. Hotkey conflicts ═══ */

    function padMap() {
        var g = W.LMGamepad;
        if (g && typeof g.getMap === 'function') { try { return g.getMap(); } catch (e) { } }
        /* read only: the stored map, when the gamepad file is not loaded */
        var raw = lsGet('lmGamepad');
        return isObj(raw) && isObj(raw.map) ? raw.map : null;
    }
    function currentConflicts() {
        var hk = W.hotkeys, s = settings(), tl = W.textLanguage || {}, keys = [];
        if (isObj(hk)) for (var k in hk) if (own(hk, k) && typeof hk[k] === 'string') keys.push([k, hk[k]]);
        var g = W.LMGamepad, hs = W.legendmod6, moved = [];
        try { if (hs && typeof hs.mouseNotes === 'function') moved = hs.mouseNotes(); } catch (e) { }
        /* sticky cells and the reverse trick take the left and right button on the game */
        var off = {}, offBy = s.stickyCell ? 'stickyCell' : s.reverseTrick ? 'reverseTrick' : '';
        if (offBy) off['MOUSE LEFT'] = off['MOUSE RIGHT'] = { what: plain(tl[offBy]) || offBy, opt: offBy };
        return findConflicts({
            keys: keys,
            exists: hkExists,
            mouseOff: off,
            moved: moved,
            pad: padMap(),
            padNames: g && g.BUTTON_NAMES ? g.BUTTON_NAMES : ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'Back', 'Start', 'LS', 'RS', t('dpadUp'), t('dpadDown'), t('dpadLeft'), t('dpadRight')]
        });
    }
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
        closeWin();
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
        closeWin();
        var cc = W.LMCommandCentre;
        if (cc && typeof cc.reveal === 'function' && cc.reveal(id)) return;
        if (cc && typeof cc.run === 'function' && cc.run('set:' + id)) return;
        /* a control of the Hotkeys window */
        var hkEl = D.getElementById(id);
        if (hkEl && hkEl.closest && hkEl.closest('#hotkeys')) { jumpHotkey(id); return; }
        showMenu();
        var tab = D.querySelector('.menu-tabs a[href="#og-settings"]');
        if (tab) tab.click();
        setTimeout(function () { var n = D.getElementById(id); flash(n && n.closest ? n.closest('.preset-box, label, div') || n : n); }, 300);
    }
    function conflictText(c) {
        var labels = c.cmds.map(hkLabel).join(', ');
        if (c.kind === 'dup' && c.builtin) return [c.key, t('cBuiltin', [c.builtin, labels])];
        if (c.kind === 'dup') return [c.key, t('cDup', labels)];
        if (c.kind === 'browser') return [c.key, t(c.level === 'error' ? 'cBrowserBlock' : c.level === 'warn' ? 'cBrowserWarn' : 'cBrowserInfo', [c.what, labels])];
        if (c.kind === 'mouseOff') return [c.key, t('cMouseOff', [labels, c.what])];
        if (c.kind === 'moved') return [c.key, t('cMoved', [hkLabel(c.to), hkLabel(c.from)])];
        return [t('padName', c.name), t('cMouse', [c.key, labels])];
    }
    /* The list of all conflicts, shown in the Hotkeys window (its "Hotkey conflicts" button,
     * ogario.v4.js buildHotkeysControls): keys bound twice or kept by the browser, and mouse
     * buttons / gamepad buttons that run a command a key runs too, each with a jump to its row.
     * Built again after each key change while it is shown. Returns how many there are. */
    var confBox = null;
    function renderConflicts(box) {
        if (!box) return 0;
        addStyle();
        confBox = box;
        while (box.firstChild) box.removeChild(box.firstChild);
        var w = { body: box };
        var rank = { error: 0, warn: 1, info: 2 };
        var list = currentConflicts().sort(function (a, b) { return rank[a.level] - rank[b.level]; });
        if (!list.length) w.body.appendChild(el('p', 'margin:6px 0;', t('noConflicts')));
        var lv = { error: ['#c9302c', '#fff'], warn: ['#f0ad4e', '#000'], info: ['rgba(255,255,255,0.2)', '#fff'] };
        list.forEach(function (c) {
            var row = el('div');
            row.className = 'lm-st-conf';
            var b = el('span', 'background:' + lv[c.level][0] + ';color:' + lv[c.level][1] + ';', c.level === 'error' ? '!' : c.level === 'warn' ? '?' : 'i');
            b.className = 'lm-st-lvl';
            row.appendChild(b);
            var tx = conflictText(c);
            row.appendChild(el('kbd', 'margin-right:6px;', tx[0]));
            row.appendChild(D.createTextNode(tx[1] + ' '));
            c.cmds.forEach(function (cmd) {
                var a = el('a', 'margin-right:8px;', c.cmds.length > 1 ? t('jumpTo', hkLabel(cmd)) : t('jump'));
                a.className = 'lm-st-link';
                a.href = '#';
                a.addEventListener('click', function (e) { e.preventDefault(); jumpHotkey(cmd); });
                row.appendChild(a);
            });
            /* the setting that takes the button (sticky cells is in Settings) */
            if (c.kind === 'mouseOff' && c.opt && D.getElementById(c.opt)) {
                var am = el('a', 'margin-right:8px;', t('jumpTo', c.what));
                am.className = 'lm-st-link';
                am.href = '#';
                am.addEventListener('click', function (e) { e.preventDefault(); jumpSetting(c.opt); });
                row.appendChild(am);
            }
            /* a change the old mouse settings made: listed until it is seen */
            if (c.kind === 'moved') {
                var ok = el('a', '', t('cMovedOk'));
                ok.className = 'lm-st-link';
                ok.href = '#';
                ok.addEventListener('click', function (e) {
                    e.preventDefault();
                    try { if (W.legendmod6 && W.legendmod6.dismissMouseNote) W.legendmod6.dismissMouseNote(c.key); } catch (e2) { }
                    renderConflicts(box);
                });
                row.appendChild(ok);
            }
            if (c.kind === 'pad' && W.LMGamepad && typeof W.LMGamepad.openWindow === 'function') {
                var ap = el('a', '', t('jumpTo', t('cPad')));
                ap.className = 'lm-st-link';
                ap.href = '#';
                ap.addEventListener('click', function (e) { e.preventDefault(); closeWin(); W.LMGamepad.openWindow(); });
                row.appendChild(ap);
            }
            w.body.appendChild(row);
        });
        return list.length;
    }
    /* the list again when it is shown (a key changed, the language changed) */
    function refreshConflicts() {
        if (confBox && confBox.isConnected && confBox.firstChild && confBox.style.display !== 'none') renderConflicts(confBox);
    }

    /* ═══ 3. HUD hide (Show/hide HUD, Alt+H: application.setShowHUD) + capture ═══ */

    var SHOT_KEY = 'lmSmallTools';
    function shotOpts() { var r = lsGet(SHOT_KEY); return cleanShotOpts(r && r.shot); }
    function saveShotOpts(o) {
        var r = lsGet(SHOT_KEY);
        r = isObj(r) ? r : {};
        r.shot = cleanShotOpts(o);
        lsSet(SHOT_KEY, r);
    }
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
        closeWin();
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
        if (noMotion()) chip.style.transition = 'none';
        var idleT = 0;
        var wake = function () { chip.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(function () { chip.classList.add('idle'); }, 2500); };
        W.addEventListener('mousemove', wake, true);
        W.addEventListener('touchstart', wake, { capture: true, passive: true });
        W.addEventListener('keydown', shotKey, true);
        shot = { h: h, chip: chip, mo: mo, wake: wake, idleT: function () { clearTimeout(idleT); } };
        wake();
    }
    function shotOff() {
        if (!shot) return;
        var s = shot;
        shot = null;
        s.h.hidden.forEach(function (n) { n.classList.remove('lm-shot-hide'); });
        if (s.mo) s.mo.disconnect();
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
    function drawHudBox(ctx, node, base, sx, sy) {
        var cs = W.getComputedStyle(node), r = rectIn(node.getBoundingClientRect(), base, sx, sy);
        var bg = cs.backgroundColor;
        ctx.save();
        ctx.fillStyle = bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg) ? bg : 'rgba(0,0,0,0.4)';
        ctx.fillRect(r[0], r[1], r[2], r[3]);
        ctx.restore();
        return r;
    }
    function drawLeaderboard(ctx, base, sx, sy) {
        var lb = D.getElementById('leaderboard-hud');
        if (!shown(lb)) return;
        var r = drawHudBox(ctx, lb, base, sx, sy);
        var lines = [], h5 = lb.querySelector('h5'), data = D.getElementById('leaderboard-data');
        if (h5) lines.push([plain(h5.textContent), W.getComputedStyle(h5)]);
        if (data) for (var c = data.firstElementChild; c; c = c.nextElementSibling) lines.push([plain(c.textContent), W.getComputedStyle(c)]);
        var y = r[1] + 4 * sy, pad = 8 * sx;
        ctx.save();
        ctx.beginPath();
        ctx.rect(r[0], r[1], r[2], r[3]);
        ctx.clip();
        ctx.textBaseline = 'top';
        lines.forEach(function (l, i) {
            var fs = (parseFloat(l[1].fontSize) || 14) * sy;
            ctx.font = (i === 0 ? '700 ' : '400 ') + fs + 'px ' + (l[1].fontFamily || 'sans-serif');
            ctx.fillStyle = l[1].color || '#fff';
            ctx.textAlign = i === 0 ? 'center' : 'left';
            ctx.fillText(l[0], i === 0 ? r[0] + r[2] / 2 : r[0] + pad, y, r[2] - pad * 2);
            y += fs * 1.35;
        });
        ctx.restore();
    }
    function drawMinimap(ctx, base, sx, sy) {
        var hud = D.getElementById('minimap-hud');
        if (!shown(hud)) return;
        drawHudBox(ctx, hud, base, sx, sy);
        var cs = hud.querySelectorAll('canvas');
        for (var i = 0; i < cs.length; i++) {
            if (!shown(cs[i])) continue;
            var r = rectIn(cs[i].getBoundingClientRect(), base, sx, sy);
            try { ctx.drawImage(cs[i], r[0], r[1], r[2], r[3]); } catch (e) { }
        }
    }
    function stamp() {
        var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
        return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
    }
    var capturing = false;
    function capture(done) {
        if (capturing) return;
        capturing = true;
        var opts = shotOpts();
        afterFrame(function () {
            var out = null, err = null;
            try { out = composeShot(opts); } catch (e) { err = e; }
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
    function composeShot(opts) {
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
        if (opts.map) drawMinimap(ctx, base, sx, sy);
        if (opts.lb) drawLeaderboard(ctx, base, sx, sy);
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
    function openShotWindow() {
        var w = openWin('lm-st-shot', t('shotTitle'), 420);
        w.body.appendChild(el('p', '', t('shotHelp'))).className = 'lm-st-help';
        var o = shotOpts();
        w.body.appendChild(check(t('shotLb'), o.lb, function (v) { o.lb = v; saveShotOpts(o); }));
        w.body.appendChild(check(t('shotMap'), o.map, function (v) { o.map = v; saveShotOpts(o); }));
        w.foot.appendChild(button(t('shotStart'), false, function () { shotOn(); }));
        w.foot.appendChild(button(t('shotCapture'), true, function () { closeWin(); capture(); }));
        w.foot.appendChild(button(t('close'), false, closeWin));
    }

    /* ═══ 4. Skin collections ═══ */

    var COL_KEY = 'lmSkinCollections';
    function loadCol() { return cleanCollections(lsGet(COL_KEY)); }
    function saveCol(col) {
        Object.keys(col.items).forEach(function (k) { if (emptyItem(col.items[k])) delete col.items[k]; });
        if (!lsSet(COL_KEY, cleanCollections(col))) toast('error', t('storageFull'));
    }
    /* the profiles' skins (read only: ogarioPlayerProfiles keeps its format) plus kept URLs */
    function allSkins(col) {
        var list = [], at = {};
        var add = function (url, label, prof) {
            url = cleanSkinKey(url);
            if (!url) return;
            if (own(at, url)) { if (prof != null && list[at[url]].profile == null) { list[at[url]].profile = prof; list[at[url]].label = label; } return; }
            at[url] = list.length;
            list.push({ url: url, label: label, profile: prof });
        };
        var pr = Array.isArray(W.profiles) ? W.profiles : [];
        pr.forEach(function (p, i) { if (p && typeof p.skinURL === 'string') add(p.skinURL, t('profile', i + 1) + (p.nick ? ': ' + cleanText(p.nick, 30) : ''), i); });
        var extra = lsGet('ogarioPlayerProfilesExtra');
        if (Array.isArray(extra)) extra.forEach(function (p, i) { if (p && typeof p.skinURL === 'string') add(p.skinURL, t('profile', pr.length + i + 1) + (p.nick ? ': ' + cleanText(p.nick, 30) : ''), null); });
        Object.keys(col.items).forEach(function (u) { add(u, t('saved'), null); });
        return list;
    }
    function useSkin(url) {
        var lm = W.legendmod, app = W.application, input = D.getElementById('skin');
        if (!input || !app) return;
        if (lm && lm.play) { toast('info', t('skinLater')); return; }
        input.value = url;
        /* same as clicking an example skin link: previews update, then the profile is saved */
        try { if (W.jQuery) W.jQuery(input).click(); } catch (e) { }
        try { if (typeof app.setPlayerSettings === 'function') app.setPlayerSettings(); } catch (e) { }
        toast('success', t('skinSet'));
    }
    var skinUi = { q: '', folder: '' };
    function openSkins() {
        var w = openWin('lm-st-skins', t('skinsTitle'), 760);
        var col = loadCol();
        w.body.appendChild(el('p', '', t('skinsHelp'))).className = 'lm-st-help';
        var bar = el('div', 'display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px;');
        var q = el('input', 'flex:1 1 160px;');
        q.type = 'search';
        q.placeholder = t('search');
        q.value = skinUi.q;
        var fsel = el('select', 'flex:0 1 160px;');
        fsel.id = 'lm-st-skins-folder';
        /* a field, not prompt(): dialogs can be blocked inside the expanding.land frame */
        var fname = el('input', 'flex:0 1 130px;');
        fname.type = 'text';
        fname.placeholder = t('folderName');
        fname.maxLength = 32;
        var nf = button(t('newFolder'), false, function () {
            var n = cleanFolder(fname.value);
            if (!n) { fname.focus(); return; }
            fname.value = '';
            if (col.folders.indexOf(n) < 0 && col.folders.length < COL_MAX_FOLDERS) col.folders.push(n);
            skinUi.folder = n;
            saveCol(col);
            fillFolders();
            draw();
        });
        var df = button(t('delFolder'), false, function () {
            var f = skinUi.folder;
            if (!f || f === '*' || f === '-') return;
            col.folders = col.folders.filter(function (x) { return x !== f; });
            Object.keys(col.items).forEach(function (k) { if (col.items[k].f === f) col.items[k].f = ''; });
            skinUi.folder = '';
            saveCol(col);
            fillFolders();
            draw();
        });
        bar.appendChild(q);
        bar.appendChild(fsel);
        bar.appendChild(fname);
        bar.appendChild(nf);
        bar.appendChild(df);
        w.body.appendChild(bar);
        var addRow = el('div', 'display:flex;gap:6px;margin:0 0 8px;');
        var au = el('input', 'flex:1;');
        au.type = 'text';
        au.placeholder = t('addUrl');
        addRow.appendChild(au);
        addRow.appendChild(button(t('add'), false, function () {
            /* kept as the address the skin field plays it with (checkSkinURL): a link typed
             * without https:// (i.imgur.com/..., an imgur page) had no picture here, and once
             * used it was listed twice (the profile keeps the https:// one) */
            var raw = au.value, app = W.application;
            if (app && typeof app.checkSkinURL === 'function') { try { raw = app.checkSkinURL(raw); } catch (e) { } }
            var u = cleanSkinKey(raw);
            if (!u) return;
            var it = col.items[u] || (col.items[u] = { f: '', t: [], s: false });
            it.a = Date.now();
            if (skinUi.folder && skinUi.folder !== '*' && skinUi.folder !== '-') it.f = skinUi.folder;
            au.value = '';
            saveCol(col);
            draw();
        }));
        w.body.appendChild(addRow);
        var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:6px;');
        grid.id = 'lm-st-skins-list';
        w.body.appendChild(grid);
        function fillFolders() {
            fsel.textContent = '';
            [['', t('all')], ['*', '★ ' + t('favs')], ['-', t('unfiled')]].concat(col.folders.map(function (f) { return [f, f]; })).forEach(function (o) {
                var op = el('option', '', o[1]);
                op.value = o[0];
                fsel.appendChild(op);
            });
            if (skinUi.folder && skinUi.folder !== '*' && skinUi.folder !== '-' && col.folders.indexOf(skinUi.folder) < 0) skinUi.folder = '';
            fsel.value = skinUi.folder;
            df.style.display = skinUi.folder && skinUi.folder !== '*' && skinUi.folder !== '-' ? '' : 'none';
        }
        function item(url) { return col.items[url] || (col.items[url] = { f: '', t: [], s: false }); }
        function draw() {
            grid.textContent = '';
            var list = filterSkins(allSkins(col), col, skinUi.q, skinUi.folder);
            if (!list.length) grid.appendChild(el('div', 'opacity:.8;padding:8px 0;', t('noSkinsFound')));
            list.slice(0, 300).forEach(function (sk) {
                var it = col.items[sk.url] || { f: '', t: [], s: false };
                var card = el('div');
                card.className = 'lm-st-skin';
                var top = el('div', 'display:flex;align-items:center;gap:6px;min-width:0;');
                var img = el('img');
                img.loading = 'lazy';
                img.referrerPolicy = 'no-referrer';
                img.alt = '';
                if (/^https?:\/\//i.test(sk.url)) img.src = sk.url;
                top.appendChild(img);
                var name = el('div', 'flex:1;min-width:0;overflow:hidden;');
                name.appendChild(el('div', 'font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', sk.label));
                var u = el('div', 'opacity:.65;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;', sk.url);
                u.title = sk.url;
                name.appendChild(u);
                top.appendChild(name);
                var star = el('div', 'color:' + (it.s ? '#ffcc33' : 'rgba(255,255,255,0.4)') + ';', it.s ? '★' : '☆');
                star.className = 'lm-st-star';
                star.title = t('favs');
                star.setAttribute('role', 'button');
                star.addEventListener('click', function () { var x = item(sk.url); x.s = !x.s; saveCol(col); draw(); });
                top.appendChild(star);
                card.appendChild(top);
                var row = el('div', 'display:flex;gap:4px;');
                var fs = el('select', 'flex:1;');
                [['', t('unfiled')]].concat(col.folders.map(function (f) { return [f, f]; })).forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; fs.appendChild(op); });
                fs.value = it.f || '';
                fs.addEventListener('change', function () { item(sk.url).f = fs.value; saveCol(col); if (skinUi.folder && skinUi.folder !== '*') draw(); });
                row.appendChild(fs);
                row.appendChild(button(t('use'), true, function () { useSkin(sk.url); }));
                if (sk.profile != null && W.application && typeof W.application.selectProfile === 'function') {
                    row.appendChild(button(t('profileBtn'), false, function () { try { W.application.selectProfile(sk.profile); } catch (e) { } }));
                } else if (sk.profile == null && own(col.items, sk.url)) {
                    row.appendChild(button('✕', false, function () { delete col.items[sk.url]; saveCol(col); draw(); }));
                }
                card.appendChild(row);
                var tg = el('input', 'width:100%;');
                tg.type = 'text';
                tg.placeholder = t('tags');
                tg.value = it.t.join(', ');
                tg.maxLength = 260;
                tg.addEventListener('change', function () { item(sk.url).t = cleanTags(tg.value); tg.value = item(sk.url).t.join(', '); saveCol(col); });
                card.appendChild(tg);
                grid.appendChild(card);
            });
        }
        q.addEventListener('input', function () { skinUi.q = q.value; draw(); });
        fsel.addEventListener('change', function () { skinUi.folder = fsel.value; fillFolders(); draw(); });
        fillFolders();
        draw();
        w.foot.appendChild(button(t('close'), false, closeWin));
    }
    /* the "Collections" button of the skins panel: always there (it was behind a setting of its
     * own, skinCollections); the window and its data load on the first click */
    var SKINS_ICON = '\u2605 ';
    function syncSkinsButton() {
        var b = D.getElementById('lm-skin-collections'), panel = D.getElementById('skins-panel');
        if (b || !panel) return;
        b = el('a', 'margin-bottom:6px;', SKINS_ICON + t('skinsBtn'));
        b.id = 'lm-skin-collections';
        b.className = 'btn btn-block btn-info';
        b.href = '#';
        b.addEventListener('click', function (e) { e.preventDefault(); openSkins(); });
        var more = D.getElementById('more-skins');
        if (more && more.parentNode === panel) panel.insertBefore(b, more); else panel.appendChild(b);
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

    var WINS = { radial: openRadialEditor, screenshot: openShotWindow, skins: openSkins };
    var WIN_IDS = { radial: 'lm-st-radial', screenshot: 'lm-st-shot', skins: 'lm-st-skins' };
    api.open = function (name) { if (own(WINS, name)) WINS[name](); };
    api.toggle = function (name) { if (!own(WINS, name)) return; if (isOpen(WIN_IDS[name])) closeWin(); else WINS[name](); };
    api.close = closeWin;
    api.isOpen = function (name) { return name ? isOpen(WIN_IDS[name]) : !!win; };
    api.radialDown = function () { ringOpen(true); };
    api.radialUp = ringRelease;
    api.radialOpen = function () { return !!ring; };
    api.radialPoint = ringPoint;
    api.radialClose = function () { ringClose(false); };
    api.shotToggle = function () { if (shot) shotOff(); else shotOn(); };
    api.shotOn = shotOn;
    api.shotOff = shotOff;
    api.shotActive = function () { return !!shot; };
    api.capture = capture;
    api.compose = function () { return composeShot(shotOpts()); };
    api.redactReport = redactReport;
    api.conflicts = currentConflicts;
    api.renderConflicts = renderConflicts;
    api.refreshConflicts = refreshConflicts;
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
    api.sync = function () { syncSkinsButton(); };

    /* the skins panel is built after this file may load */
    var tries = 0;
    (function waitUi() {
        syncSkinsButton();
        if (!D.getElementById('skins-panel') && ++tries < 60) setTimeout(waitUi, 1000);
    })();

    /* Language change: an open window is built again in the new language (the skins window keeps
     * its search and folder), the screenshot chip and the skins panel button follow. */
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(function () {
        try {
            if (win) for (var n in WIN_IDS) if (own(WIN_IDS, n) && WIN_IDS[n] === win.id) { WINS[n](); break; }
            refreshConflicts();
            var cap = D.getElementById('lm-shot-cap'), sx = D.getElementById('lm-shot-x'), sb = D.getElementById('lm-skin-collections');
            if (cap) cap.textContent = t('shotCapture');
            if (sx) sx.title = t('close');
            if (sb) sb.textContent = SKINS_ICON + t('skinsBtn');
        } catch (e) { }
    });
})();
