/**
 * LM Mobile Controls v3.0 — by Jimboy3100
 *
 * Professional touch-control overlay for Legend Mod mobile users.
 * Matches the ogario HUD aesthetic (teal / navy / Ubuntu font).
 *
 * Features
 * ────────
 *  • Virtual joystick  — drag anywhere on canvas to steer
 *  • Split  (⚔)        — tap to split (Space key)
 *  • Feed   (⬤)        — hold to eject mass (W key, 50 ms repeat)
 *  • Menu   (☰)        — toggle main HUD / ESC menu
 *  • Chat   (💬)        — opens chat input, shows Send bar, re-tap to send
 *  • Fullscreen (⛶)    — toggle fullscreen mode
 *  • Pinch-to-zoom      — two-finger pinch dispatches WheelEvent
 *
 * Compatibility: ES5 + standard Web APIs (no jQuery dependency).
 * Only activates on touch-capable devices.
 */

(function () {
    'use strict';

    // ── Guard: only run on touch devices ────────────────────────
    if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) return;

    // ── Design tokens (ogario HUD palette) ──────────────────────
    var C = {
        navy:       'rgba(0, 36, 62,',       // #00243e
        navyDark:   'rgba(0, 47, 82,',       // #002f52
        teal:       'rgba(1, 217, 204,',      // #01d9cc
        blue:       'rgba(1, 140, 246,',      // #018cf6
        white:      'rgba(255, 255, 255,',
        tealSolid:  '#01d9cc',
        navySolid:  '#00243e',
        font:       '"Ubuntu", "Roboto", sans-serif'
    };

    // ── Inject CSS ──────────────────────────────────────────────
    var css = document.createElement('style');
    css.id = 'lm-mobile-css';
    css.textContent = '\n' +

    /* ── Container ── */
    '#lm-mobile-controls {\n' +
    '  position: fixed; bottom: 0; right: 0; z-index: 100000;\n' +
    '  pointer-events: none; user-select: none; -webkit-user-select: none;\n' +
    '  padding: 12px; display: flex; flex-direction: column;\n' +
    '  align-items: flex-end; gap: 10px;\n' +
    '}\n' +

    /* ── Base button ── */
    '.lm-btn {\n' +
    '  pointer-events: auto; touch-action: none; cursor: pointer;\n' +
    '  display: flex; align-items: center; justify-content: center;\n' +
    '  border-radius: 50%;\n' +
    '  background: ' + C.navy + '0.65);\n' +
    '  border: 2px solid ' + C.teal + '0.4);\n' +
    '  box-shadow: 0 0 12px ' + C.teal + '0.15),\n' +
    '              inset 0 1px 0 ' + C.white + '0.06);\n' +
    '  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);\n' +
    '  transition: transform 0.1s ease, background 0.15s ease,\n' +
    '              border-color 0.15s ease, box-shadow 0.15s ease;\n' +
    '  color: ' + C.white + '0.9);\n' +
    '  font-family: ' + C.font + ';\n' +
    '  font-weight: 700; letter-spacing: 0.4px;\n' +
    '  text-shadow: 0 1px 3px rgba(0,0,0,0.5);\n' +
    '}\n' +
    '.lm-btn.pressed {\n' +
    '  transform: scale(0.88);\n' +
    '  background: ' + C.teal + '0.30);\n' +
    '  border-color: ' + C.teal + '0.80);\n' +
    '  box-shadow: 0 0 18px ' + C.teal + '0.35),\n' +
    '              inset 0 1px 0 ' + C.white + '0.1);\n' +
    '}\n' +

    /* ── Action buttons (Split / Feed) ── */
    '.lm-btn-action {\n' +
    '  width: clamp(72px, 20vmin, 108px);\n' +
    '  height: clamp(72px, 20vmin, 108px);\n' +
    '}\n' +

    /* ── Utility buttons (Menu / Chat / Fullscreen) ── */
    '.lm-btn-util {\n' +
    '  width: clamp(52px, 13vmin, 66px);\n' +
    '  height: clamp(52px, 13vmin, 66px);\n' +
    '  font-size: 20px;\n' +
    '  background: ' + C.navyDark + '0.55);\n' +
    '  border-color: ' + C.blue + '0.35);\n' +
    '  box-shadow: 0 0 8px ' + C.blue + '0.12);\n' +
    '}\n' +
    '.lm-btn-util.pressed {\n' +
    '  background: ' + C.blue + '0.25);\n' +
    '  border-color: ' + C.blue + '0.75);\n' +
    '  box-shadow: 0 0 14px ' + C.blue + '0.3);\n' +
    '}\n' +

    /* ── Icon + label inside action buttons ── */
    '.lm-btn-icon {\n' +
    '  display: flex; flex-direction: column;\n' +
    '  align-items: center; gap: 1px; pointer-events: none;\n' +
    '}\n' +
    '.lm-btn-icon .lm-i { font-size: clamp(22px, 6vmin, 30px); line-height: 1; }\n' +
    '.lm-btn-icon .lm-l {\n' +
    '  font-size: clamp(8px, 2.2vmin, 11px); opacity: 0.65;\n' +
    '  letter-spacing: 1.2px; text-transform: uppercase;\n' +
    '}\n' +

    /* ── Utility row ── */
    '.lm-util-row { display: flex; gap: 8px; pointer-events: none; }\n' +

    /* ── Joystick ── */
    '.lm-joy-outer {\n' +
    '  width: 120px; height: 120px; border-radius: 50%;\n' +
    '  background: ' + C.navy + '0.18);\n' +
    '  border: 2px solid ' + C.teal + '0.22);\n' +
    '  position: fixed; display: none; z-index: 99998;\n' +
    '  transform: translate(-50%, -50%); pointer-events: none;\n' +
    '}\n' +
    '.lm-joy-inner {\n' +
    '  width: 50px; height: 50px; border-radius: 50%;\n' +
    '  background: radial-gradient(circle, ' + C.teal + '0.28) 0%, ' + C.teal + '0.06) 100%);\n' +
    '  border: 2px solid ' + C.teal + '0.45);\n' +
    '  box-shadow: 0 0 8px ' + C.teal + '0.18);\n' +
    '  position: fixed; display: none; z-index: 99999;\n' +
    '  transform: translate(-50%, -50%); pointer-events: none;\n' +
    '}\n' +

    /* ── Zoom indicator pill ── */
    '.lm-zoom {\n' +
    '  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);\n' +
    '  background: ' + C.navy + '0.82);\n' +
    '  border: 1px solid ' + C.teal + '0.45);\n' +
    '  color: ' + C.tealSolid + ';\n' +
    '  font: 700 14px/1 ' + C.font + ';\n' +
    '  padding: 6px 18px; border-radius: 20px;\n' +
    '  pointer-events: none; z-index: 100001;\n' +
    '  opacity: 0; transition: opacity 0.2s ease;\n' +
    '}\n' +
    '.lm-zoom.on { opacity: 1; }\n' +

    /* ── Chat send bar ── */
    '#lm-chat-bar {\n' +
    '  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100002;\n' +
    '  display: none;\n' +
    '  background: ' + C.navy + '0.92);\n' +
    '  border-top: 2px solid ' + C.teal + '0.45);\n' +
    '  padding: 8px 14px; text-align: right;\n' +
    '  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);\n' +
    '}\n' +
    '#lm-chat-bar button {\n' +
    '  background: ' + C.tealSolid + '; color: ' + C.navySolid + ';\n' +
    '  border: none; border-radius: 6px;\n' +
    '  padding: 10px 32px; font: 700 15px/1 ' + C.font + ';\n' +
    '  text-transform: uppercase; letter-spacing: 1px; cursor: pointer;\n' +
    '}\n' +
    '#lm-chat-bar button:active { opacity: 0.8; }\n' +

    /* ── Auto-dim when main menu overlays ── */
    '#helloContainer:not([style*="display: none"]):not([style*="display:none"]) ~ #lm-mobile-controls {\n' +
    '  opacity: 0.25;\n' +
    '}\n';

    document.head.appendChild(css);

    // ── Wait for canvas + game to be ready ──────────────────────
    var readyTimer = setInterval(function () {
        if (!document.getElementById('canvas')) return;
        clearInterval(readyTimer);
        setTimeout(boot, 600);
    }, 250);

    function boot() {
        var canvas = document.getElementById('canvas');
        if (!canvas) return;

        // ════════════════════════════════════════════════════════
        //  1.  BUILD DOM
        // ════════════════════════════════════════════════════════
        var root = el('div', {id: 'lm-mobile-controls'});
        document.body.appendChild(root);

        // Utility row
        var utilRow = el('div', {cls: 'lm-util-row'});
        var btnMenu = btn('lm-menu', '☰', null, true);
        var btnChat = btn('lm-chat', '💬', null, true);
        var btnFull = btn('lm-full', '⛶', null, true);
        utilRow.appendChild(btnMenu);
        utilRow.appendChild(btnChat);
        utilRow.appendChild(btnFull);
        root.appendChild(utilRow);

        // Action buttons
        var btnSplit = btn('lm-split', '⚔', 'SPLIT', false);
        var btnFeed  = btn('lm-feed', '⬤', 'FEED', false);
        root.appendChild(btnSplit);
        root.appendChild(btnFeed);

        // Joystick
        var jOuter = el('div', {cls: 'lm-joy-outer'});
        var jInner = el('div', {cls: 'lm-joy-inner'});
        document.body.appendChild(jOuter);
        document.body.appendChild(jInner);

        // Zoom indicator
        var zoomPill = el('div', {cls: 'lm-zoom'});
        document.body.appendChild(zoomPill);
        var zoomTimer = null;

        // Chat bar
        var chatBar = el('div', {id: 'lm-chat-bar'});
        chatBar.innerHTML = '<button>Send ⏎</button>';
        document.body.appendChild(chatBar);

        // ════════════════════════════════════════════════════════
        //  2.  BUTTON HANDLERS
        // ════════════════════════════════════════════════════════
        [btnMenu, btnChat, btnFull, btnSplit, btnFeed].forEach(pressEffect);

        // ── Split: emit Space (keyCode 32) ──
        on(btnSplit, 'touchstart', function (e) {
            e.preventDefault();
            emitKey(32);
        });

        // ── Feed: hold W (keyCode 87) at 50 ms ──
        var feedTimer = null;
        on(btnFeed, 'touchstart', function (e) {
            e.preventDefault();
            emitKey(87);
            feedTimer = setInterval(function () { emitKey(87); }, 50);
        });
        on(btnFeed, 'touchend',    function () { clearInterval(feedTimer); });
        on(btnFeed, 'touchcancel', function () { clearInterval(feedTimer); });

        // ── Menu: ESC / application.showMenu ──
        on(btnMenu, 'touchstart', function (e) {
            e.preventDefault();
            if (typeof application !== 'undefined' && application.showMenu) {
                application.showMenu();
            } else {
                emitKey(27);
            }
        });

        // ── Chat ──
        var chatOpen = false;

        on(btnChat, 'touchstart', function (e) {
            e.preventDefault();
            chatOpen ? closeChat() : openChat();
        });

        on(chatBar.querySelector('button'), 'touchstart', function (e) {
            e.preventDefault();
            closeChat();
        });

        // Close chat if user taps the canvas
        canvas.addEventListener('touchstart', function () {
            if (chatOpen) closeChat();
        }, { passive: true });

        function openChat() {
            chatOpen = true;
            // Trigger ENTER to open the chat box (ogario maps ENTER → chat)
            emitKey(13);
            setTimeout(function () {
                var inp = document.getElementById('message');
                if (inp) {
                    inp.focus();
                    chatBar.style.display = 'block';
                    root.style.display = 'none';
                }
            }, 120);
        }

        function closeChat() {
            chatOpen = false;
            var inp = document.getElementById('message');
            if (inp && inp.value.length > 0) {
                // Dispatch Enter on the input itself so jQuery's keydown handler fires
                var ev = new KeyboardEvent('keydown', {
                    keyCode: 13, which: 13, key: 'Enter',
                    bubbles: true, cancelable: true
                });
                inp.dispatchEvent(ev);
            }
            // Also dispatch on document to toggle chat off
            emitKey(13);
            if (inp) inp.blur();
            chatBar.style.display = 'none';
            root.style.display = '';
        }

        // ── Fullscreen ──
        on(btnFull, 'touchstart', function (e) {
            e.preventDefault();
            var d = document, r = d.documentElement;
            if (!d.fullscreenElement && !d.webkitFullscreenElement) {
                var fn = r.requestFullscreen || r.webkitRequestFullscreen || r.msRequestFullscreen;
                if (fn) fn.call(r);
            } else {
                var ef = d.exitFullscreen || d.webkitExitFullscreen;
                if (ef) ef.call(d);
            }
        });

        // ════════════════════════════════════════════════════════
        //  3.  VIRTUAL JOYSTICK
        // ════════════════════════════════════════════════════════
        var origin   = { x: 0, y: 0 };
        var jId      = null;       // touch identifier for joystick finger
        var aspect   = window.innerWidth / window.innerHeight;
        var JOY_R    = 55;         // visual clamp radius (px)
        var JOY_SENS = 300;        // mouse-move amplification

        window.addEventListener('resize', function () {
            aspect = window.innerWidth / window.innerHeight;
        });

        // touchstart on canvas — start joystick if single finger
        canvas.addEventListener('touchstart', function (e) {
            if (chatOpen) return;
            if (e.touches.length === 1) {
                var t = e.changedTouches[0];
                jId = t.identifier;
                origin.x = t.clientX;
                origin.y = t.clientY;
                mouseAt(t.clientX, t.clientY);
                joyShow(origin.x, origin.y, origin.x, origin.y);
            }
        }, { passive: true });

        canvas.addEventListener('touchend', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === jId) {
                    jId = null;
                    mouseAt(window.innerWidth / 2, window.innerHeight / 2);
                    joyHide();
                    break;
                }
            }
        }, { passive: true });

        canvas.addEventListener('touchcancel', function () {
            jId = null;
            mouseAt(window.innerWidth / 2, window.innerHeight / 2);
            joyHide();
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            if (e.touches.length >= 2) return;  // pinch handled below
            var t = touchById(e.changedTouches, jId);
            if (!t) return;

            // Translate to amplified mouse position
            var dx = (t.clientX - origin.x) * JOY_SENS;
            var dy = (t.clientY - origin.y) * JOY_SENS * aspect;
            mouseAt(window.innerWidth / 2 + dx, window.innerHeight / 2 + dy);

            // Visual: clamp inner stick to outer ring
            var rx = t.clientX - origin.x;
            var ry = t.clientY - origin.y;
            var d  = Math.sqrt(rx * rx + ry * ry);
            if (d > JOY_R) {
                var a = Math.atan2(ry, rx);
                joyShow(origin.x, origin.y,
                        origin.x + Math.cos(a) * JOY_R,
                        origin.y + Math.sin(a) * JOY_R);
            } else {
                joyShow(origin.x, origin.y, t.clientX, t.clientY);
            }
        }, { passive: true });

        // ════════════════════════════════════════════════════════
        //  4.  PINCH-TO-ZOOM
        //      Spread fingers → zoom IN  (negative deltaY)
        //      Pinch fingers  → zoom OUT (positive deltaY)
        // ════════════════════════════════════════════════════════
        var pinchDist = 0;
        var pinching  = false;

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 2) {
                pinching  = true;
                pinchDist = dist(e.touches[0], e.touches[1]);
                joyHide();
                jId = null;
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            if (!(e.touches.length === 2 && pinching)) return;
            e.preventDefault();   // block native page zoom

            var nd    = dist(e.touches[0], e.touches[1]);
            var delta = nd - pinchDist;         // positive = spread = zoom in

            if (Math.abs(delta) > 4) {
                var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                var wd = -delta * 2;            // negative = scroll-up = zoom in

                dispatchWheel(canvas, wd, cx, cy);
                pinchDist = nd;

                // Show zoom indicator
                zoomPill.textContent = delta > 0 ? '🔍 +' : '🔍 −';
                zoomPill.classList.add('on');
                clearTimeout(zoomTimer);
                zoomTimer = setTimeout(function () {
                    zoomPill.classList.remove('on');
                }, 400);
            }
        }, { passive: false });

        canvas.addEventListener('touchend', function (e) {
            if (e.touches.length < 2) {
                pinching = false;
                pinchDist = 0;
            }
        }, { passive: true });

        // ════════════════════════════════════════════════════════
        //  UTILITY FUNCTIONS
        // ════════════════════════════════════════════════════════

        /** Create an element with optional id / className */
        function el(tag, opts) {
            var e = document.createElement(tag);
            if (opts) {
                if (opts.id)  e.id = opts.id;
                if (opts.cls) e.className = opts.cls;
            }
            return e;
        }

        /** Create a button (utility or action) */
        function btn(id, icon, label, isUtil) {
            var b = el('div', {id: id, cls: 'lm-btn ' + (isUtil ? 'lm-btn-util' : 'lm-btn-action')});
            if (label) {
                b.innerHTML =
                    '<div class="lm-btn-icon">' +
                    '<span class="lm-i">' + icon + '</span>' +
                    '<span class="lm-l">' + label + '</span>' +
                    '</div>';
            } else {
                b.textContent = icon;
            }
            return b;
        }

        /** Bind press visual effect */
        function pressEffect(el) {
            el.addEventListener('touchstart',  function () { el.classList.add('pressed'); },    { passive: true });
            el.addEventListener('touchend',    function () { el.classList.remove('pressed'); }, { passive: true });
            el.addEventListener('touchcancel', function () { el.classList.remove('pressed'); }, { passive: true });
        }

        /** Shorthand: addEventListener with passive:false */
        function on(el, evt, fn) {
            el.addEventListener(evt, fn, { passive: false });
        }

        /**
         * Dispatch a keydown + keyup on `document` so that
         * document.onkeydown (ogario's key handler) picks it up.
         * The `keyCode` property is what getPressedKey reads.
         */
        function emitKey(keyCode) {
            var opts = {
                keyCode:   keyCode,
                which:     keyCode,
                key:       keyName(keyCode),
                code:      keyCodeProp(keyCode),
                bubbles:   true,
                cancelable: true
            };
            document.dispatchEvent(new KeyboardEvent('keydown', opts));
            document.dispatchEvent(new KeyboardEvent('keyup',   opts));
        }

        function keyName(c) {
            switch (c) {
                case 13: return 'Enter';
                case 27: return 'Escape';
                case 32: return ' ';
                default: return String.fromCharCode(c);
            }
        }
        function keyCodeProp(c) {
            switch (c) {
                case 13: return 'Enter';
                case 27: return 'Escape';
                case 32: return 'Space';
                default: return 'Key' + String.fromCharCode(c).toUpperCase();
            }
        }

        /** Move mouse on canvas */
        function mouseAt(x, y) {
            canvas.dispatchEvent(new MouseEvent('mousemove', {
                clientX: x, clientY: y, bubbles: true, cancelable: true
            }));
        }

        /** Dispatch both modern 'wheel' and legacy 'mousewheel' events */
        function dispatchWheel(target, deltaY, cx, cy) {
            var o = { deltaY: deltaY, deltaMode: 0, clientX: cx, clientY: cy, bubbles: true, cancelable: true };
            target.dispatchEvent(new WheelEvent('wheel', o));
            o.detail = deltaY > 0 ? 3 : -3;
            target.dispatchEvent(new WheelEvent('mousewheel', o));
        }

        /** Distance between two Touch objects */
        function dist(a, b) {
            var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        /** Find a touch by identifier in a TouchList */
        function touchById(list, id) {
            if (id === null) return null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].identifier === id) return list[i];
            }
            return null;
        }

        /** Show joystick visuals */
        function joyShow(ox, oy, ix, iy) {
            jOuter.style.cssText += ';display:block;left:' + ox + 'px;top:' + oy + 'px';
            jInner.style.cssText += ';display:block;left:' + ix + 'px;top:' + iy + 'px';
        }
        function joyHide() {
            jOuter.style.display = 'none';
            jInner.style.display = 'none';
        }

        /** Disable context menu (prevents long-press menu on mobile) */
        document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

        /** Prevent elastic / bounce scrolling on iOS */
        document.body.addEventListener('touchmove', function (e) {
            if (e.target === canvas || e.target === document.body) e.preventDefault();
        }, { passive: false });

        // ── Console branding ──
        console.log(
            '%c LM Mobile v3.0 %c Touch controls loaded ',
            'background:linear-gradient(135deg,' + C.tealSolid + ',' + C.navySolid + ');' +
            'color:#fff;font-weight:bold;padding:4px 10px;border-radius:4px 0 0 4px;font-family:Ubuntu,sans-serif',
            'background:' + C.navySolid + ';color:' + C.tealSolid + ';padding:4px 10px;border-radius:0 4px 4px 0;font-family:Ubuntu,sans-serif'
        );
    }
})();
