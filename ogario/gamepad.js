/* Legend Mod gamepad / controller support (standard browser Gamepad API).
 * Always on: it reads the pads only while one is connected (gamepadconnected starts the frame
 * loop, which ends when none is left), so without a controller it costs nothing. The old option
 * "gamepadEnabled" is ignored (old imports may still have it).
 * The buttons are bound in the Hotkeys window like keys and mouse buttons: a key field takes a
 * pad button pressed while it has the focus ('PAD A' ... next to its key), Save keeps it, Close
 * undoes it, Restore gives the default buttons. Stick sensitivity, triggers, inverted axes,
 * vibration and the live test are in the Gamepad window (Hotkeys window > Gamepad;
 * ogario/modules/gamepad-ui.js, loaded the first time it opens).
 * The button map is kept in localStorage 'lmGamepad' (JSON, checked on load); the sliders and
 * toggles are ordinary gameplay settings (gamepad* in defaultmapsettings).
 */
(function () {
    'use strict';
    if (window._lmGamepadLoaded) return;
    window._lmGamepadLoaded = true;

    /* Standard mapping button index -> action.
     * 0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 6 LT, 7 RT, 8 Back, 9 Start, 10 LS, 11 RS, 12-15 D-pad.
     * An action is a hotkey id from hotkeysCommand ('hk-...', keyDown on press, keyUp on release),
     * 'menu' (Start: the menu, like Esc, while no command is on it) or 'none'. These defaults are
     * the fixed map from before the buttons could be changed. */
    /* the texts come from the language packs (developers/i18n/src/game2.json); the key itself when the
     * translations are not loaded (unit tests) */
    function T(key) { return window.lmT ? window.lmT(key) : key; }
    /* button names: letters and LB/RB/LT/RT/LS/RS are printed on the pads (i18n-ok); the rest is translated,
     * read anew each time (LMGamepad.BUTTON_NAMES is a getter) so a language change shows at once */
    function buttonNames() {
        return ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', T('game2.gpBack'), T('game2.gpStart'), 'LS', 'RS', // i18n-ok: pad labels
            T('game2.gpUp'), T('game2.gpDown'), T('game2.gpLeft'), T('game2.gpRight')];
    }
    var BUTTON_NAMES = buttonNames();
    var BUTTON_COUNT = BUTTON_NAMES.length;
    /* the key names of the buttons in the hotkeys fields, like 'MOUSE RIGHT' (i18n-ok: key names) */
    var KEY_NAMES = ['A', 'B', 'X', 'Y', 'LB', 'RB', 'LT', 'RT', 'BACK', 'START', 'LS', 'RS', 'UP', 'DOWN', 'LEFT', 'RIGHT'];
    var START = 9;
    var DEFAULT_MAP = {
        0: 'hk-split',        // A
        1: 'hk-macroFeed',    // B (held: macro feed)
        2: 'hk-doubleSplit',  // X
        3: 'hk-quickResp',    // Y (quick respawn, or Play when dead)
        4: 'hk-multiboxswap', // LB (existing units only)
        5: 'hk-split16',      // RB
        9: 'menu'             // Start (toggle menu, like Esc)
    };
    /* The gamepad's own actions of older versions are the hotkey commands that do the same: a
     * stored or imported map is read with these (saved again only when it changes). */
    var OLD_ACTIONS = { split: 'hk-split', feed: 'hk-macroFeed', doubleSplit: 'hk-doubleSplit', split16: 'hk-split16', multiboxSwap: 'hk-multiboxswap', respawn: 'hk-quickResp' };
    /* what a button runs when the command is not there (the hotkeys file not loaded yet) */
    var APP_FALLBACK = { 'hk-split': 'split', 'hk-doubleSplit': 'doubleSplit', 'hk-split16': 'split16' };
    var TRIGGERS = { 6: 1, 7: 1 };  // LT, RT: analog, pressed from the trigger threshold
    var AXIS_MOVE_X = 0, AXIS_MOVE_Y = 1, AXIS_ZOOM = 3;
    var DEAD_ZONE = 0.2;
    var ZOOM_INTERVAL = 50;  // ms between zoom wheel steps
    var ZOOM_STRENGTH = 24;  // wheel deltaY at full tilt per step (120 = one mouse wheel notch)
    /* actions that still work while the menu is open */
    var MENU_ACTIONS = { menu: 1, 'hk-quickResp': 1 };
    var STORE_KEY = 'lmGamepad';
    /* the tuning settings: [min, max, default] for numbers, the default for toggles. The
     * defaults give the behaviour from before they existed (stick range 0.45 of the screen,
     * linear, zoom 24 per step, triggers at half way, no vibration). */
    var OPTS = {
        gamepadDeadzone: [0.05, 0.5, 0.2],
        gamepadMoveRange: [0.15, 1, 0.45],
        gamepadMoveCurve: [0.5, 3, 1],
        gamepadZoomSens: [0.2, 4, 1],
        gamepadTrigger: [0.1, 0.95, 0.5],
        gamepadInvertX: false,
        gamepadInvertY: false,
        gamepadInvertZoom: false,
        gamepadVibrate: false
    };

    var running = false;
    var prevPressed = {};    // "padIndex:button" -> bool
    var holdActive = {};     // hotkey id -> keyDown sent, keyUp not yet
    var lastMove = null;
    var lastZoomAt = 0;
    var announced = {};
    var lastPadIndex = -1;   // pad that pressed a button last (vibration on death)
    var suspended = false;   // the Gamepad window is open: buttons are tested there, not used
    var map = null;          // current button map (from storage, else the defaults)

    function hasOwn(o, k) {
        return Object.prototype.hasOwnProperty.call(o, k);
    }

    /* an action name that can be stored, else null (an old own action is its hotkey command) */
    function cleanAction(a) {
        if (typeof a !== 'string') return null;
        if (a === 'none' || a === 'menu') return a;
        if (hasOwn(OLD_ACTIONS, a)) return OLD_ACTIONS[a];
        return /^hk-[A-Za-z0-9_-]{1,40}$/.test(a) ? a : null;
    }

    /* what a button without a command does: Start opens the menu, the others nothing */
    function freed(i) { return i === START ? 'menu' : 'none'; }

    /* a full map (one entry per button) from anything: unusable entries keep their default. A
     * command merged into another or removed (the core's lmRenameOldHotkeys, the same rule as for
     * the keys) is renamed, or its button is free. */
    function cleanMap(m) {
        var out = {};
        var ok = m && typeof m === 'object' && !Array.isArray(m);
        for (var i = 0; i < BUTTON_COUNT; i++) {
            var v = ok && hasOwn(m, String(i)) ? cleanAction(m[i]) : null;
            out[i] = v || (hasOwn(DEFAULT_MAP, i) ? DEFAULT_MAP[i] : 'none');
        }
        if (typeof window.lmRenameOldHotkeys === 'function') {
            try {
                var hk = {};
                for (var j = 0; j < BUTTON_COUNT; j++) if (/^hk-/.test(out[j])) hk['PAD ' + j] = out[j];
                if (window.lmRenameOldHotkeys(hk)) {
                    for (var k = 0; k < BUTTON_COUNT; k++) if (/^hk-/.test(out[k])) out[k] = hasOwn(hk, 'PAD ' + k) ? hk['PAD ' + k] : freed(k);
                }
            } catch (e) { }
        }
        return out;
    }

    /* one tuning value made to fit, or undefined when it cannot be used */
    function cleanOpt(k, v) {
        if (!hasOwn(OPTS, k)) return undefined;
        var d = OPTS[k];
        if (typeof d === 'boolean') return typeof v === 'boolean' ? v : undefined;
        if (typeof v !== 'number' || !isFinite(v)) return undefined;
        /* the settings schema of the core (range and slider step), so a value set here is the
         * one the menu slider shows and the next load keeps */
        if (typeof window.lmSettingValue === 'function') {
            var w = window.lmSettingValue(k, v);
            if (typeof w === 'number') return w;
        }
        return Math.min(d[1], Math.max(d[0], v));
    }

    function cleanOpts(o) {
        var out = {};
        if (!o || typeof o !== 'object' || Array.isArray(o)) return out;
        for (var k in OPTS) {
            if (!hasOwn(o, k)) continue;
            var v = cleanOpt(k, o[k]);
            if (v !== undefined) out[k] = v;
        }
        return out;
    }

    /* the stored config ({ v, map }) checked: anything else gives the defaults */
    function cleanConfig(c) {
        var out = { v: 1, map: cleanMap(null) };
        if (!c || typeof c !== 'object' || Array.isArray(c)) return out;
        out.map = cleanMap(c.map);
        return out;
    }

    function storage() {
        try { return window.localStorage || null; } catch (e) { return null; }
    }

    function load() {
        var c = null;
        try {
            var ls = storage();
            var raw = ls ? ls.getItem(STORE_KEY) : null;
            if (raw) c = JSON.parse(raw);
        } catch (e) { c = null; }
        /* the named setups of older versions (settings profiles are removed): dropped once */
        var old = !!(c && typeof c === 'object' && Object.prototype.hasOwnProperty.call(c, 'profiles'));
        map = cleanConfig(c).map;
        if (old) save();
    }

    /* false when the storage is full or blocked (the change still applies until a reload) */
    function save() {
        try {
            var ls = storage();
            if (!ls) return false;
            ls.setItem(STORE_KEY, JSON.stringify({ v: 1, map: map }));
            return true;
        } catch (e) { return false; }
    }

    function settings() {
        return window.legendmod5 || null;
    }

    /* stick dead zone from the settings slider (0.05-0.5), else the default */
    function deadZone() {
        var s = window.legendmod5;
        var v = s ? Number(s.gamepadDeadzone) : NaN;
        return v >= 0.02 && v <= 0.6 ? v : DEAD_ZONE;
    }

    /* a tuning value from the settings, else its default */
    function opt(k) {
        if (k === 'gamepadDeadzone') return deadZone();
        var s = settings();
        var v = s ? cleanOpt(k, s[k]) : undefined;
        if (v !== undefined) return v;
        return typeof OPTS[k] === 'boolean' ? OPTS[k] : OPTS[k][2];
    }

    function currentOpts() {
        var o = {};
        for (var k in OPTS) o[k] = opt(k);
        return o;
    }

    /* writes tuning values into the gameplay settings and saves them like the menu does */
    function applyOpts(o) {
        var s = settings();
        if (!s) return;
        var c = cleanOpts(o);
        for (var k in c) s[k] = c[k];
        try {
            var a = window.application;
            if (a && a.saveSettings) a.saveSettings(s, 'ogarioSettings');
        } catch (e) { }
        /* (the dead zone slider is only in the Gamepad window, not in the menu) */
        watchDeath();
    }

    function pads() {
        var list = [];
        try {
            var g = navigator.getGamepads ? navigator.getGamepads() : [];
            for (var i = 0; g && i < g.length; i++) if (g[i] && g[i].connected !== false) list.push(g[i]);
        } catch (e) { }
        return list;
    }

    function esc(s) {
        return String(s).replace(/[&<>"'\/]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;' }[c];
        });
    }

    function announce(pad) {
        if (!pad || announced[pad.index + ':' + pad.id]) return;
        announced[pad.index + ':' + pad.id] = true;
        try { if (window.toastr) window.toastr.info(T('game2.gpConnected') + ' ' + esc(pad.id)); } catch (e) { }
    }

    function canvasEl() {
        return document.getElementById('canvas');
    }

    function menuOpen() {
        var ov = document.getElementById('overlays');
        if (!ov || ov.style.display === 'none') return false;
        return ov.offsetParent !== null || ov.offsetHeight > 0;
    }

    function typing() {
        var a = document.activeElement;
        if (!a) return false;
        var t = a.tagName;
        return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || a.isContentEditable === true;
    }

    function mouseAt(x, y) {
        var c = canvasEl();
        if (!c) return;
        c.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y, bubbles: true, cancelable: true }));
    }

    /* same events as the mobile pinch zoom (LMmobile.js wheel()) */
    function wheel(dy) {
        var c = canvasEl();
        if (!c) return;
        var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
        var o = { deltaY: dy, deltaMode: 0, clientX: cx, clientY: cy, bubbles: true, cancelable: true };
        c.dispatchEvent(new WheelEvent('wheel', o));
        o.detail = dy > 0 ? 1 : -1;
        c.dispatchEvent(new WheelEvent('mousewheel', o));
        try {
            var ff = new Event('DOMMouseScroll', { bubbles: true, cancelable: true });
            ff.detail = dy / 120;
            ff.axis = 2;
            document.dispatchEvent(ff);
        } catch (e) { }
    }

    function hotkeys() {
        return window.hotkeysCommand || (typeof hotkeysCommand !== 'undefined' ? hotkeysCommand : null);
    }

    function hotkey(id) {
        try {
            var h = hotkeys();
            return h && hasOwn(h, id) ? h[id] : null;
        } catch (e) { return null; }
    }

    function hk(id, up) {
        try {
            var c = hotkey(id);
            var f = c && (up ? c.keyUp : c.keyDown);
            if (typeof f === 'function') { f.call(c); return true; }
        } catch (e) { }
        return false;
    }

    /* a hotkey with a keyUp is held (macro feed, scan trick...): down while the button is */
    function isHold(id) {
        if (id === 'hk-macroFeed') return true;
        var c = hotkey(id);
        return !!(c && typeof c.keyUp === 'function');
    }

    function app() {
        return window.application || null;
    }

    function canVibrate(pad) {
        return !!(pad && ((pad.vibrationActuator && typeof pad.vibrationActuator.playEffect === 'function') ||
            (pad.hapticActuators && pad.hapticActuators[0] && typeof pad.hapticActuators[0].pulse === 'function')));
    }

    /* short rumble where the browser and the pad have one; only with the option on, except
     * the window's test button (force) */
    function rumble(pad, ms, strength, force) {
        if (!pad || (!force && !opt('gamepadVibrate'))) return false;
        try {
            var a = pad.vibrationActuator;
            var r = null;
            if (a && typeof a.playEffect === 'function') {
                r = a.playEffect('dual-rumble', { startDelay: 0, duration: ms, strongMagnitude: strength, weakMagnitude: strength });
            } else if (pad.hapticActuators && pad.hapticActuators[0] && typeof pad.hapticActuators[0].pulse === 'function') {
                r = pad.hapticActuators[0].pulse(strength, ms);
            } else return false;
            if (r && typeof r.catch === 'function') r.catch(function () { });
            return true;
        } catch (e) { }
        return false;
    }

    function padByIndex(i) {
        var list = pads();
        for (var p = 0; p < list.length; p++) if (list[p].index === i) return list[p];
        return list[0] || null;
    }

    function isSplit(action) {
        return /^hk-/.test(action) && /split/i.test(action) && !/^hk-show/.test(action);
    }

    /* one held command down or up; macro feed without the hotkeys file goes to the game itself */
    function holdHk(id, up) {
        if (hk(id, up) || id !== 'hk-macroFeed') return;
        var a = app();
        if (a && a.macroFeed) a.macroFeed(!up);
    }

    /* held hotkeys: keyUp for the ones let go, keyDown for the newly wanted */
    function setHolds(wanted) {
        var id;
        for (id in holdActive) {
            if (!wanted[id]) { delete holdActive[id]; holdHk(id, true); }
        }
        for (id in wanted) {
            if (!holdActive[id]) { holdActive[id] = true; holdHk(id, false); }
        }
    }

    function toggleMenu() {
        var a = app();
        if (!a) return;
        if (menuOpen()) { if (a.hideMenu) a.hideMenu(); }
        else if (a.showMenu) a.showMenu();
    }

    function respawn() {
        var a = app();
        var s = window.legendmod5 || {};
        var L = window.legendmod;
        if (s.quickResp && a && a.quickResp) { a.quickResp(); return; }
        /* quick respawn off: Play when not in a game. The main player alive while the multibox
         * unit you control is dead: that unit spawns again, as the swap key does for a dead unit
         * (multiboxchange: respawn() when it is not active) */
        if (L && L.play) {
            var n = window.multiboxPlayerEnabled, u = n && typeof window.getActiveSpect === 'function' ? window.getActiveSpect(n) : null;
            if (u && u.player && !u.active && typeof u.respawn === 'function') u.respawn();
            return;
        }
        var b = document.querySelector('.btn-play-guest');
        if (!b || !(b.offsetWidth || b.offsetHeight)) b = document.querySelector('.btn-play');
        if (b) b.click();
    }

    /* a button press runs its command as the key does, but for what the pad always did with these */
    function run(action) {
        var a = app();
        switch (action) {
            case 'hk-multiboxswap':
                /* only swap between existing units: with none, multiboxswap() would open a new connection */
                if (a && a.multiboxswap && window.spects && window.spects.length && window.legendmod && window.legendmod.multiBoxPlayerExists) a.multiboxswap();
                break;
            case 'hk-quickResp':
                respawn();
                break;
            case 'menu':
                toggleMenu();
                break;
            default:
                /* a hotkey without keyUp: one press */
                if (/^hk-/.test(action) && !hk(action, false) && hasOwn(APP_FALLBACK, action) && a && typeof a[APP_FALLBACK[action]] === 'function') a[APP_FALLBACK[action]]();
        }
    }

    function release() {
        setHolds({});
        prevPressed = {};
        lastMove = null;
    }

    function pressed(b) {
        return !!(b && (b.pressed || (typeof b.value === 'number' && b.value > 0.5)));
    }

    /* button i down. LT and RT go by the trigger threshold when the pad reports how far they
     * are pulled (a digital trigger reports 1, or 0 with 'pressed'). */
    function buttonDown(b, i, thr) {
        if (!b) return false;
        if (TRIGGERS[i] && typeof b.value === 'number' && b.value > 0) return b.value >= thr;
        return pressed(b);
    }

    /* stick (x, y) -> offset from the screen centre as a part of the stick range (-1..1 each),
     * or null inside the dead zone. Curve 1 is linear; above 1 small tilts move less. */
    function stickOffset(x, y, dz, curve, invX, invY) {
        x = Number(x) || 0;
        y = Number(y) || 0;
        var m = Math.sqrt(x * x + y * y);
        if (!(m > dz)) return null;
        var t = Math.min(1, (m - dz) / (1 - dz));
        if (curve !== 1) t = Math.pow(t, curve);
        var k = t / m;
        return [(invX ? -x : x) * k, (invY ? -y : y) * k];
    }

    /* dead zone for a stick that drifts this far at rest: the drift plus a margin, rounded up to
     * the slider step and kept in the slider range */
    function suggestDeadzone(drift) {
        var d = Number(drift);
        if (!isFinite(d) || d < 0) d = 0;
        var v = Math.ceil((d + 0.05) * 100 - 1e-6) / 100;
        return Math.min(OPTS.gamepadDeadzone[1], Math.max(OPTS.gamepadDeadzone[0], v));
    }

    /* the page has no focus (another app or tab): the pad acts on nothing. Its buttons are still
     * read below, so one held while away does not fire when the focus comes back. */
    function away() {
        if (document.hidden) return true;
        try { return document.hasFocus ? !document.hasFocus() : false; } catch (e) { return false; }
    }

    function frame() {
        var list = pads();
        if (!list.length) { running = false; release(); watchDeath(); return; }
        if (!map) load();
        var off = away() || suspended;
        /* a key field of the Hotkeys window has the focus: a pressed button is bound to its command */
        var field = off ? null : bindField();
        var blockAll = off || !!field || (typing() && !menuOpen());
        var blockGame = off || typing() || menuOpen();
        var thr = opt('gamepadTrigger');
        var holdWanted = {};
        var moved = false;
        var zoomed = false;
        var present = {};
        for (var p = 0; p < list.length; p++) {
            var pad = list[p];
            present[pad.index] = true;
            announce(pad);
            var buttons = pad.buttons || [];
            for (var bi = 0; bi < BUTTON_COUNT; bi++) {
                var action = map[bi];
                var isDown = buttonDown(buttons[bi], bi, thr);
                var id = pad.index + ':' + bi;
                var was = !!prevPressed[id];
                prevPressed[id] = isDown;
                if (field) {
                    if (isDown && !was) bindPress(field, bi);
                    continue;
                }
                if (!action || action === 'none') continue;
                if (/^hk-/.test(action) && isHold(action)) {
                    if (isDown && !blockGame) holdWanted[action] = true;
                    if (isDown && !was) lastPadIndex = pad.index;
                    continue;
                }
                if (!isDown || was) continue; // edge trigger
                if (blockAll) continue;
                if (blockGame && !MENU_ACTIONS[action]) continue;
                lastPadIndex = pad.index;
                run(action);
                if (isSplit(action)) rumble(pad, 60, 0.4);
            }
            var dz = deadZone();
            var axes = pad.axes || [];
            if (!blockGame && !moved) {
                /* released stick: no event, the cell keeps the last direction (like mobile) */
                var o = stickOffset(axes[AXIS_MOVE_X], axes[AXIS_MOVE_Y], dz, opt('gamepadMoveCurve'), opt('gamepadInvertX'), opt('gamepadInvertY'));
                if (o) {
                    var r = Math.min(window.innerWidth, window.innerHeight) * opt('gamepadMoveRange');
                    var px = window.innerWidth / 2 + o[0] * r, py = window.innerHeight / 2 + o[1] * r;
                    moved = true;
                    if (!lastMove || Math.abs(lastMove[0] - px) > 0.5 || Math.abs(lastMove[1] - py) > 0.5) {
                        lastMove = [px, py];
                        mouseAt(px, py);
                    }
                }
                /* P1 fix #72: guard zoom with a flag like movement, so a second
                 * controller's zoom axis doesn't conflict with the first. */
                if (!zoomed) {
                    var z = Number(axes[AXIS_ZOOM]) || 0;
                    var now = Date.now();
                    if (Math.abs(z) > dz && now - lastZoomAt >= ZOOM_INTERVAL) {
                        lastZoomAt = now;
                        zoomed = true;
                        wheel((opt('gamepadInvertZoom') ? -z : z) * ZOOM_STRENGTH * opt('gamepadZoomSens'));
                    }
                }
            }
        }
        /* stick back in the dead zone (or blocked): forget the last position, so pushing it to
         * the same place again moves the cell (the mouse may have moved it meanwhile) */
        if (!moved) lastMove = null;
        /* a pad that is gone: its button states would hide the first press of the pad that
         * next takes its index */
        for (var id2 in prevPressed) {
            if (!present[id2.split(':')[0]]) delete prevPressed[id2];
        }
        setHolds(holdWanted);
        requestAnimationFrame(frame);
    }

    /* Focus lost while Feed (or another held hotkey) is held: the frames stop with the tab
     * hidden, so release here (the keyboard and mouse have the same on blur) */
    function leave() {
        setHolds({});
        lastMove = null;
        /* P1 fix #74: clear prevPressed so that buttons physically held while the page
         * was unfocused can fire their edge trigger when focus returns. Without this,
         * prevPressed retains the 'true' state and the edge-trigger at line 501
         * skips the button until it is released and pressed again. */
        prevPressed = {};
    }
    window.addEventListener('blur', leave);
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) leave();
    });

    function start() {
        if (running || !pads().length) return;
        running = true;
        watchDeath();
        requestAnimationFrame(frame);
    }

    window.addEventListener('gamepadconnected', function (e) {
        if (e && e.gamepad) announce(e.gamepad);
        start();
    });
    window.addEventListener('gamepaddisconnected', function (e) {
        if (!e || !e.gamepad) return;
        delete announced[e.gamepad.index + ':' + e.gamepad.id];
        var pre = e.gamepad.index + ':';
        for (var k in prevPressed) if (k.indexOf(pre) === 0) delete prevPressed[k];
    });
    /* vibration on death (option, off by default). Listens only while the option is on and a
     * pad is read: the game skips building an event nobody listens to. */
    var deathOn = false;
    function onDeath() {
        if (!suspended && pads().length) rumble(padByIndex(lastPadIndex), 300, 0.8);
    }
    function watchDeath() {
        var want = running && opt('gamepadVibrate');
        if (want === deathOn) return;
        try {
            var E = window.LMEvents;
            if (!E || typeof E.on !== 'function') return;
            if (want) E.on('death', onDeath); else E.off('death', onDeath);
            deathOn = want;
        } catch (e) { }
    }

    /* a pad already connected when this file loaded (no polling: gamepadconnected starts the
     * loop for any pad connected later) */
    start();

    /* ── The Hotkeys window binds the buttons (ogario.v4.js hotkeysSetup) ── */
    function hkSetup() { return window.legendmod6 || null; }
    /* the key field of the Hotkeys window that has the focus, else null */
    function bindField() {
        var a = document.activeElement;
        if (!a || a.tagName !== 'INPUT' || !a.id || !/^hk-/.test(a.id) || !a.classList || !a.classList.contains('custom-key-in')) return null;
        return a.closest && a.closest('#hotkeys') ? a : null;
    }
    function bindPress(field, i) {
        var h = hkSetup();
        try { if (h && typeof h.setHotkey === 'function') h.setHotkey('PAD ' + KEY_NAMES[i], field.id); } catch (e) { }
    }
    /* the fields show the buttons again (this file loaded after the window) */
    function fieldsChanged() {
        var h = hkSetup();
        try { if (h && typeof h.showAllKeys === 'function') h.showAllKeys(); } catch (e) { }
    }
    /* 'PAD A' -> 0, else -1 */
    function padIndex(key) {
        var m = /^PAD ([A-Z]+)$/.exec(String(key || ''));
        return m ? KEY_NAMES.indexOf(m[1]) : -1;
    }
    /* the buttons of a command, as key names */
    function keysOf(cmd) {
        if (!map) load();
        var out = [];
        for (var i = 0; i < BUTTON_COUNT; i++) if (map[i] === cmd) out.push('PAD ' + KEY_NAMES[i]);
        return out;
    }
    /* a command's buttons are free (Start: the menu again); in memory until commit (the Hotkeys window saves it right after) */
    function freeCommand(cmd) {
        if (!map) load();
        setHolds({});
        for (var i = 0; i < BUTTON_COUNT; i++) if (map[i] === cmd) map[i] = freed(i);
    }

    /* the Gamepad window: ogario/modules/gamepad-ui.js, loaded the first time it opens */
    var uiLoading = false;

    function openWindow() {
        var ui = window.LMGamepadUI;
        if (ui && typeof ui.open === 'function') {
            ui.open();
            return;
        }
        if (uiLoading) return;
        uiLoading = true;
        try {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            /* absolute: on agar.io (the extension writes play.html there) a "/ogario/..." path pointed at agar.io */
            s.src = 'https://www.legendmod.ml/ogario/modules/gamepad-ui.js?v=' + (window.OgVer || '');
            s.charset = 'utf-8';
            s.onload = function () {
                uiLoading = false;
                if (window.LMGamepadUI && typeof window.LMGamepadUI.open === 'function') window.LMGamepadUI.open();
            };
            s.onerror = function () {
                uiLoading = false;
                if (s.parentNode) s.parentNode.removeChild(s);
                try { if (window.toastr) window.toastr.error(T('game2.gpUiFailed')); } catch (e) { }
            };
            document.body.appendChild(s);
        } catch (e) { uiLoading = false; }
    }

    load();

    window.LMGamepad = {
        get BUTTON_NAMES() { return buttonNames(); },
        KEY_NAMES: KEY_NAMES,
        OPTS: OPTS,
        defaultMap: function () { return cleanMap(null); },
        getMap: function () { if (!map) load(); return cleanMap(map); },
        /* one button (index) to an action; false when either is not one */
        setButton: function (i, action) {
            i = Number(i);
            var a = cleanAction(action);
            if (!(i >= 0 && i < BUTTON_COUNT) || i !== Math.floor(i) || !a) return false;
            if (!map) load();
            if (map[i] === a) return true;
            /* a hotkey held on the button being changed goes up first */
            setHolds({});
            map[i] = a;
            save();
            fieldsChanged();
            return true;
        },
        /* the default buttons; temp: in memory only (the Hotkeys window's Restore saves them itself) */
        resetMap: function (temp) {
            setHolds({});
            map = cleanMap(null);
            if (!temp) { save(); fieldsChanged(); }
        },
        /* The Hotkeys window: 'PAD A' ... are the key names of the buttons. bind() puts a button on
         * a command (its other button goes: one per command, like the mouse buttons) and returns
         * what the button ran before; free() frees a command's buttons. Both only in memory until
         * commit(), which the window's auto-save calls; restore(snapshot) puts a getMap() copy back
         * and saves it. */
        padIndex: padIndex,
        keysOf: keysOf,
        bind: function (i, cmd) {
            if (!(i >= 0 && i < BUTTON_COUNT) || i !== Math.floor(i) || typeof cmd !== 'string' || !/^hk-[A-Za-z0-9_-]{1,40}$/.test(cmd)) return null;
            if (!map) load();
            var was = map[i];
            freeCommand(cmd);
            map[i] = cmd;
            return was;
        },
        free: freeCommand,
        commit: function () { return save(); },
        restore: function (snap) {
            if (!snap || typeof snap !== 'object') return;
            var m = cleanMap(snap);
            if (map && JSON.stringify(m) === JSON.stringify(map)) return;
            setHolds({});
            map = m;
            save();
        },
        getOpts: currentOpts,
        setOpts: applyOpts,
        resetOpts: function () {
            var o = {};
            for (var k in OPTS) o[k] = typeof OPTS[k] === 'boolean' ? OPTS[k] : OPTS[k][2];
            applyOpts(o);
        },
        /* Gamepad window open: the buttons are only shown there, not used in the game */
        setSuspended: function (on) {
            suspended = !!on;
            if (suspended) { setHolds({}); lastMove = null; }
        },
        buttonDown: function (b, i) { return buttonDown(b, i, opt('gamepadTrigger')); },
        /* true while a button holds this hotkey command (the Command Centre and the radial menu do not release it) */
        isHeld: function (id) { return !!(hasOwn(holdActive, id) && holdActive[id]); },
        suggestDeadzone: suggestDeadzone,
        testRumble: function (pad) { return rumble(pad, 250, 0.7, true); },
        canVibrate: canVibrate,
        pads: pads,
        openWindow: openWindow,
        /* checks and pure helpers (developers/tests/gamepad.js) */
        _cleanConfig: cleanConfig,
        _cleanOpt: cleanOpt,
        _stickOffset: stickOffset,
        _buttonDown: buttonDown
    };
    /* the Hotkeys window built before this file loaded shows the buttons now */
    fieldsChanged();
})();
