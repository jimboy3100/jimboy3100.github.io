/* Legend Mod gamepad / controller support (standard browser Gamepad API).
 * Off by default: option "gamepadEnabled" (Settings > Mouse control).
 * While the option is off this file only checks the option once a second.
 * The button map below is fixed (no remap UI); edit BUTTON_MAP to change it.
 */
(function () {
    'use strict';
    if (window._lmGamepadLoaded) return;
    window._lmGamepadLoaded = true;

    /* Standard mapping button index -> action.
     * 0 A, 1 B, 2 X, 3 Y, 4 LB, 5 RB, 6 LT, 7 RT, 8 Back, 9 Start, 10 LS, 11 RS, 12-15 D-pad. */
    var BUTTON_MAP = {
        0: 'split',        // A
        1: 'feed',         // B (hold = macro feed)
        2: 'doubleSplit',  // X
        3: 'respawn',      // Y (quick respawn, or Play when dead)
        4: 'multiboxSwap', // LB
        5: 'split16',      // RB
        9: 'menu'          // Start (toggle menu, like Esc)
    };
    var AXIS_MOVE_X = 0, AXIS_MOVE_Y = 1, AXIS_ZOOM = 3;
    var DEAD_ZONE = 0.2;
    var ZOOM_INTERVAL = 50;  // ms between zoom wheel steps
    var ZOOM_STRENGTH = 24;  // wheel deltaY at full tilt per step (120 = one mouse wheel notch)
    /* actions that still work while the menu is open */
    var MENU_ACTIONS = { menu: 1, respawn: 1 };

    var running = false;
    var prevPressed = {};    // "padIndex:button" -> bool
    var feedHeld = false;
    var lastMove = null;
    var lastZoomAt = 0;
    var announced = {};

    function enabled() {
        var s = window.legendmod5;
        return !!(s && s.gamepadEnabled);
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
        try { if (window.toastr) window.toastr.info('Gamepad connected: ' + esc(pad.id)); } catch (e) { }
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

    function hk(id, up) {
        try {
            var h = window.hotkeysCommand || (typeof hotkeysCommand !== 'undefined' ? hotkeysCommand : null);
            var c = h && h[id];
            var f = c && (up ? c.keyUp : c.keyDown);
            if (typeof f === 'function') { f.call(c); return true; }
        } catch (e) { }
        return false;
    }

    function app() {
        return window.application || null;
    }

    function setFeed(on) {
        if (on === feedHeld) return;
        feedHeld = on;
        if (!hk('hk-macroFeed', !on)) {
            var a = app();
            if (a && a.macroFeed) a.macroFeed(on);
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
        /* quick respawn off: Play when not in a game */
        if (L && L.play) return;
        var b = document.querySelector('.btn-play-guest');
        if (!b || !(b.offsetWidth || b.offsetHeight)) b = document.querySelector('.btn-play');
        if (b) b.click();
    }

    function run(action) {
        var a = app();
        switch (action) {
            case 'split':
                if (a && a.split) a.split(); else hk('hk-split');
                break;
            case 'doubleSplit':
                if (a && a.doubleSplit) a.doubleSplit(); else hk('hk-doubleSplit');
                break;
            case 'split16':
                if (a && a.split16) a.split16(); else hk('hk-split16');
                break;
            case 'multiboxSwap':
                /* only swap between existing units: with none, multiboxswap() would open a new connection */
                if (a && a.multiboxswap && window.spects && window.spects.length && window.legendmod && window.legendmod.multiBoxPlayerExists) a.multiboxswap();
                break;
            case 'respawn':
                respawn();
                break;
            case 'menu':
                toggleMenu();
                break;
        }
    }

    function release() {
        setFeed(false);
        prevPressed = {};
        lastMove = null;
    }

    function pressed(b) {
        return !!(b && (b.pressed || (typeof b.value === 'number' && b.value > 0.5)));
    }

    function frame() {
        if (!enabled()) { running = false; release(); return; }
        var list = pads();
        if (!list.length) { running = false; release(); return; }
        var blockAll = typing() && !menuOpen();
        var blockGame = typing() || menuOpen();
        var feedWanted = false;
        var moved = false;
        for (var p = 0; p < list.length; p++) {
            var pad = list[p];
            announce(pad);
            var buttons = pad.buttons || [];
            for (var key in BUTTON_MAP) {
                var bi = Number(key), action = BUTTON_MAP[key];
                var isDown = pressed(buttons[bi]);
                var id = pad.index + ':' + bi;
                var was = !!prevPressed[id];
                prevPressed[id] = isDown;
                if (action === 'feed') {
                    if (isDown && !blockGame) feedWanted = true;
                    continue;
                }
                if (!isDown || was) continue; // edge trigger
                if (blockAll) continue;
                if (blockGame && !MENU_ACTIONS[action]) continue;
                run(action);
            }
            var axes = pad.axes || [];
            if (!blockGame && !moved) {
                var x = Number(axes[AXIS_MOVE_X]) || 0, y = Number(axes[AXIS_MOVE_Y]) || 0;
                var m = Math.sqrt(x * x + y * y);
                if (m > DEAD_ZONE) {
                    /* released stick: no event, the cell keeps the last direction (like mobile) */
                    var k = Math.min(1, (m - DEAD_ZONE) / (1 - DEAD_ZONE)) / m;
                    var r = Math.min(window.innerWidth, window.innerHeight) * 0.45;
                    var px = window.innerWidth / 2 + x * k * r, py = window.innerHeight / 2 + y * k * r;
                    moved = true;
                    if (!lastMove || Math.abs(lastMove[0] - px) > 0.5 || Math.abs(lastMove[1] - py) > 0.5) {
                        lastMove = [px, py];
                        mouseAt(px, py);
                    }
                }
                var z = Number(axes[AXIS_ZOOM]) || 0;
                var now = Date.now();
                if (Math.abs(z) > DEAD_ZONE && now - lastZoomAt >= ZOOM_INTERVAL) {
                    lastZoomAt = now;
                    wheel(z * ZOOM_STRENGTH);
                }
            }
        }
        setFeed(feedWanted);
        requestAnimationFrame(frame);
    }

    function start() {
        if (running || !enabled() || !pads().length) return;
        running = true;
        requestAnimationFrame(frame);
    }

    window.addEventListener('gamepadconnected', function (e) {
        if (!enabled()) return;
        if (e && e.gamepad) announce(e.gamepad);
        start();
    });
    window.addEventListener('gamepaddisconnected', function (e) {
        if (e && e.gamepad) delete announced[e.gamepad.index + ':' + e.gamepad.id];
    });
    /* option turned on later, or a pad that was already connected */
    setInterval(function () {
        if (!running && enabled()) start();
    }, 1000);
})();
