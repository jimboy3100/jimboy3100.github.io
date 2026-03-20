// LM Mobile Controls v2.1 — by Jimboy3100
// Touch controls for mobile: virtual joystick, split, feed, chat,
// pinch-to-zoom, menu toggle (ESC), and fullscreen button.
// Styled to match the ogario HUD (teal/navy theme).

(function () {
    'use strict';

    // ── Guard: only run on touch devices ────────────────────────
    if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) return;

    // ── Inject CSS for mobile controls ──────────────────────────
    var style = document.createElement('style');
    style.textContent = [
        // Button container — bottom-right
        '#lm-mobile-controls {',
        '  position: fixed; bottom: 0; right: 0; z-index: 100000;',
        '  pointer-events: none; user-select: none; -webkit-user-select: none;',
        '  padding: 10px; display: flex; flex-direction: column; align-items: flex-end; gap: 10px;',
        '}',

        // Base button style
        '.lm-btn {',
        '  pointer-events: auto; touch-action: none; cursor: pointer;',
        '  display: flex; align-items: center; justify-content: center;',
        '  border-radius: 50%;',
        '  background: rgba(0, 36, 62, 0.65);',
        '  border: 2px solid rgba(1, 217, 204, 0.4);',
        '  box-shadow: 0 0 12px rgba(1, 217, 204, 0.15), inset 0 1px 0 rgba(255,255,255,0.05);',
        '  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);',
        '  transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease;',
        '  color: rgba(255, 255, 255, 0.9);',
        '  font-family: "Ubuntu", "Roboto", sans-serif;',
        '  font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;',
        '  text-shadow: 0 1px 2px rgba(0,0,0,0.6);',
        '}',
        '.lm-btn.pressed {',
        '  transform: scale(0.88);',
        '  background: rgba(1, 217, 204, 0.35);',
        '  border-color: rgba(1, 217, 204, 0.8);',
        '  box-shadow: 0 0 20px rgba(1, 217, 204, 0.4), inset 0 1px 0 rgba(255,255,255,0.1);',
        '}',

        // Large action buttons (split/feed) — 21vmin for good mobile size
        '.lm-btn-action {',
        '  width: 21vmin; height: 21vmin;',
        '  min-width: 70px; min-height: 70px;',
        '  max-width: 110px; max-height: 110px;',
        '  font-size: 14px;',
        '}',

        // Small utility buttons (menu/fullscreen/chat) — 14vmin
        '.lm-btn-util {',
        '  width: 14vmin; height: 14vmin;',
        '  min-width: 50px; min-height: 50px;',
        '  max-width: 68px; max-height: 68px;',
        '  font-size: 20px;',
        '  background: rgba(0, 47, 82, 0.55);',
        '  border-color: rgba(1, 140, 246, 0.35);',
        '  box-shadow: 0 0 8px rgba(1, 140, 246, 0.1);',
        '}',
        '.lm-btn-util.pressed {',
        '  background: rgba(1, 140, 246, 0.3);',
        '  border-color: rgba(1, 140, 246, 0.8);',
        '  box-shadow: 0 0 16px rgba(1, 140, 246, 0.3);',
        '}',

        // Icon + label layout inside buttons
        '.lm-btn-icon {',
        '  display: flex; flex-direction: column; align-items: center; gap: 2px;',
        '}',
        '.lm-btn-icon .lm-icon { font-size: min(6vmin, 28px); line-height: 1; }',
        '.lm-btn-icon .lm-label { font-size: min(2.5vmin, 11px); opacity: 0.7; letter-spacing: 1px; }',

        // Rows
        '.lm-util-row {',
        '  display: flex; gap: 8px; pointer-events: none;',
        '}',

        // Joystick
        '.lm-joystick-outer {',
        '  width: 120px; height: 120px; border-radius: 50%;',
        '  background: rgba(0, 36, 62, 0.2);',
        '  border: 2px solid rgba(1, 217, 204, 0.25);',
        '  position: fixed; display: none; z-index: 99998;',
        '  transform: translate(-50%, -50%); pointer-events: none;',
        '}',
        '.lm-joystick-inner {',
        '  width: 52px; height: 52px; border-radius: 50%;',
        '  background: radial-gradient(circle, rgba(1,217,204,0.3) 0%, rgba(1,217,204,0.08) 100%);',
        '  border: 2px solid rgba(1, 217, 204, 0.5);',
        '  box-shadow: 0 0 10px rgba(1, 217, 204, 0.2);',
        '  position: fixed; display: none; z-index: 99999;',
        '  transform: translate(-50%, -50%); pointer-events: none;',
        '}',

        // Zoom indicator
        '.lm-zoom-indicator {',
        '  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);',
        '  background: rgba(0, 36, 62, 0.8); border: 1px solid rgba(1, 217, 204, 0.5);',
        '  color: rgba(1, 217, 204, 0.9); font-family: "Ubuntu", "Roboto", sans-serif;',
        '  font-size: 14px; font-weight: 700; padding: 6px 16px; border-radius: 20px;',
        '  pointer-events: none; z-index: 100001; opacity: 0;',
        '  transition: opacity 0.2s ease;',
        '}',
        '.lm-zoom-indicator.visible { opacity: 1; }',

        // Chat send bar (shown when chat is focused)
        '#lm-chat-send-bar {',
        '  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100002;',
        '  display: none; background: rgba(0, 36, 62, 0.9);',
        '  border-top: 2px solid rgba(1, 217, 204, 0.5);',
        '  padding: 8px 12px; text-align: right;',
        '}',
        '#lm-chat-send-btn {',
        '  background: #01d9cc; color: #00243e; border: none; border-radius: 6px;',
        '  padding: 10px 28px; font-size: 16px; font-weight: 700;',
        '  font-family: "Ubuntu", "Roboto", sans-serif;',
        '  text-transform: uppercase; letter-spacing: 1px; cursor: pointer;',
        '}',
        '#lm-chat-send-btn:active { background: #00b9a3; }',

        // Dim controls when menu is visible
        '#helloContainer:not([style*="display: none"]):not([style*="display:none"]) ~ #lm-mobile-controls {',
        '  opacity: 0.3;',
        '}',
    ].join('\n');
    document.head.appendChild(style);

    // Wait for canvas
    var readyCheck = setInterval(function () {
        if (!document.getElementById('canvas')) return;
        clearInterval(readyCheck);
        setTimeout(initMobileControls, 500);
    }, 200);

    function initMobileControls() {
        var canvas = document.getElementById('canvas');
        if (!canvas) return;

        // ════════════════════════════════════════════════════════
        //  1. BUILD UI
        // ════════════════════════════════════════════════════════
        var container = document.createElement('div');
        container.id = 'lm-mobile-controls';
        document.body.appendChild(container);

        // Top row: Menu + Chat + Fullscreen
        var utilRow = document.createElement('div');
        utilRow.className = 'lm-util-row';
        var menuBtn = makeBtn('lm-menuBtn', '☰', null, 'lm-btn lm-btn-util');
        var chatBtn = makeBtn('lm-chatBtn', '💬', null, 'lm-btn lm-btn-util');
        var fullBtn = makeBtn('lm-fullBtn', '⛶', null, 'lm-btn lm-btn-util');
        utilRow.appendChild(menuBtn);
        utilRow.appendChild(chatBtn);
        utilRow.appendChild(fullBtn);
        container.appendChild(utilRow);

        // Split
        var splitBtn = makeBtn('lm-splitBtn', '⚔', 'SPLIT', 'lm-btn lm-btn-action');
        container.appendChild(splitBtn);

        // Feed
        var feedBtn = makeBtn('lm-feedBtn', '⬤', 'FEED', 'lm-btn lm-btn-action');
        container.appendChild(feedBtn);

        // Joystick elements
        var jOuter = document.createElement('div');
        jOuter.className = 'lm-joystick-outer';
        document.body.appendChild(jOuter);
        var jInner = document.createElement('div');
        jInner.className = 'lm-joystick-inner';
        document.body.appendChild(jInner);

        // Zoom indicator
        var zoomInd = document.createElement('div');
        zoomInd.className = 'lm-zoom-indicator';
        document.body.appendChild(zoomInd);
        var zoomTimeout = null;

        // Chat send bar
        var chatBar = document.createElement('div');
        chatBar.id = 'lm-chat-send-bar';
        chatBar.innerHTML = '<button id="lm-chat-send-btn">Send ⏎</button>';
        document.body.appendChild(chatBar);

        // ════════════════════════════════════════════════════════
        //  2. BUTTON INTERACTIONS
        // ════════════════════════════════════════════════════════
        bindPress(menuBtn); bindPress(chatBtn); bindPress(fullBtn);
        bindPress(splitBtn); bindPress(feedBtn);

        // ── Split: space key ──
        splitBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            fireKey(32, ' ');
        }, { passive: false });

        // ── Feed: hold W ──
        var feedIv = null;
        feedBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            feedIv = setInterval(function () { fireKey(87, 'w'); }, 10);
        }, { passive: false });
        feedBtn.addEventListener('touchend', stopFeed, { passive: true });
        feedBtn.addEventListener('touchcancel', stopFeed, { passive: true });
        function stopFeed() { clearInterval(feedIv); feedIv = null; }

        // ── Menu: ESC ──
        menuBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (typeof application !== 'undefined' && application.showMenu) {
                application.showMenu();
            } else {
                fireKey(27, 'Escape');
            }
        }, { passive: false });

        // ── Chat button ──
        var chatActive = false;
        chatBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (!chatActive) {
                openChat();
            } else {
                sendAndCloseChat();
            }
        }, { passive: false });

        // Send button in the bar
        document.getElementById('lm-chat-send-btn').addEventListener('touchstart', function (e) {
            e.preventDefault();
            sendAndCloseChat();
        }, { passive: false });

        function openChat() {
            chatActive = true;
            // Trigger Enter key to open chat (same as pressing Enter on keyboard)
            fireKey(13, 'Enter');
            // Focus the message input after a short delay (chat box might need to render)
            setTimeout(function () {
                var msgInput = document.getElementById('message');
                if (msgInput) {
                    msgInput.focus();
                    chatBar.style.display = 'block';
                    container.style.display = 'none'; // hide game buttons while chatting
                }
            }, 100);
        }

        function sendAndCloseChat() {
            chatActive = false;
            var msgInput = document.getElementById('message');
            if (msgInput) {
                // Trigger Enter on the input to send the message
                var enterDown = new KeyboardEvent('keydown', {
                    keyCode: 13, which: 13, key: 'Enter',
                    bubbles: true, cancelable: true
                });
                var enterUp = new KeyboardEvent('keyup', {
                    keyCode: 13, which: 13, key: 'Enter',
                    bubbles: true, cancelable: true
                });
                msgInput.dispatchEvent(enterDown);
                msgInput.dispatchEvent(enterUp);
                msgInput.blur();
            }
            chatBar.style.display = 'none';
            container.style.display = 'flex'; // restore game buttons
        }

        // If user taps outside chat while it's active, close it
        canvas.addEventListener('touchstart', function () {
            if (chatActive) {
                sendAndCloseChat();
            }
        }, { passive: true });

        // ── Fullscreen ──
        fullBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            var el = document.documentElement;
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen).call(el);
            } else {
                (document.exitFullscreen || document.webkitExitFullscreen).call(document);
            }
        }, { passive: false });

        // ════════════════════════════════════════════════════════
        //  3. VIRTUAL JOYSTICK
        // ════════════════════════════════════════════════════════
        var origin = { x: 0, y: 0 };
        var jTouchId = null;
        var aspect = window.innerWidth / window.innerHeight;
        var CLAMP = 55;

        window.addEventListener('resize', function () {
            aspect = window.innerWidth / window.innerHeight;
        });

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1 && !chatActive) {
                var t = e.changedTouches[0];
                jTouchId = t.identifier;
                origin.x = t.clientX;
                origin.y = t.clientY;
                moveMouse(t.clientX, t.clientY);
                setJoystick(origin.x, origin.y, origin.x, origin.y);
            }
        }, { passive: true });

        canvas.addEventListener('touchend', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === jTouchId) {
                    jTouchId = null;
                    moveMouse(window.innerWidth / 2, window.innerHeight / 2);
                    hideJoystick();
                    break;
                }
            }
        }, { passive: true });

        canvas.addEventListener('touchcancel', function () {
            jTouchId = null;
            moveMouse(window.innerWidth / 2, window.innerHeight / 2);
            hideJoystick();
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            if (e.touches.length >= 2) return; // pinch handled separately
            var t = findTouch(e.changedTouches, jTouchId);
            if (!t) return;

            var dx = -(origin.x - t.clientX) * 300;
            var dy = -(origin.y - t.clientY) * 300 * aspect;
            moveMouse((window.innerWidth / 2) + dx, (window.innerHeight / 2) + dy);

            // Clamp inner stick visual
            var rx = t.clientX - origin.x, ry = t.clientY - origin.y;
            var d = Math.sqrt(rx * rx + ry * ry);
            var ix, iy;
            if (d > CLAMP) {
                var a = Math.atan2(ry, rx);
                ix = origin.x + Math.cos(a) * CLAMP;
                iy = origin.y + Math.sin(a) * CLAMP;
            } else {
                ix = t.clientX;
                iy = t.clientY;
            }
            setJoystick(origin.x, origin.y, ix, iy);
        }, { passive: true });

        // ════════════════════════════════════════════════════════
        //  4. PINCH-TO-ZOOM → WheelEvent
        //     Pinch OUT (spread fingers) = ZOOM IN  (negative deltaY)
        //     Pinch IN  (close fingers)  = ZOOM OUT (positive deltaY)
        // ════════════════════════════════════════════════════════
        var lastPinch = 0;
        var pinching = false;

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 2) {
                pinching = true;
                lastPinch = dist2(e.touches[0], e.touches[1]);
                hideJoystick();
                jTouchId = null;
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            if (e.touches.length === 2 && pinching) {
                e.preventDefault();
                var nd = dist2(e.touches[0], e.touches[1]);
                var delta = nd - lastPinch; // positive = fingers spread = zoom in

                if (Math.abs(delta) > 4) {
                    // Negative deltaY = scroll up = zoom in (game convention)
                    var wheelDelta = -delta * 2.5;
                    var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

                    canvas.dispatchEvent(new WheelEvent('wheel', {
                        deltaY: wheelDelta, deltaMode: 0,
                        clientX: cx, clientY: cy,
                        bubbles: true, cancelable: true
                    }));
                    canvas.dispatchEvent(new WheelEvent('mousewheel', {
                        deltaY: wheelDelta, detail: wheelDelta > 0 ? 3 : -3,
                        clientX: cx, clientY: cy,
                        bubbles: true, cancelable: true
                    }));

                    zoomInd.textContent = delta > 0 ? '🔍 +' : '🔍 −';
                    zoomInd.classList.add('visible');
                    clearTimeout(zoomTimeout);
                    zoomTimeout = setTimeout(function () {
                        zoomInd.classList.remove('visible');
                    }, 400);

                    lastPinch = nd;
                }
            }
        }, { passive: false });

        canvas.addEventListener('touchend', function (e) {
            if (e.touches.length < 2) { pinching = false; lastPinch = 0; }
        }, { passive: true });

        // ════════════════════════════════════════════════════════
        //  HELPERS
        // ════════════════════════════════════════════════════════
        function makeBtn(id, icon, label, cls) {
            var b = document.createElement('div');
            b.id = id;
            b.className = cls;
            if (label) {
                b.innerHTML = '<div class="lm-btn-icon"><span class="lm-icon">' + icon + '</span><span class="lm-label">' + label + '</span></div>';
            } else {
                b.textContent = icon;
            }
            return b;
        }

        function bindPress(el) {
            el.addEventListener('touchstart', function () { el.classList.add('pressed'); }, { passive: true });
            el.addEventListener('touchend', function () { el.classList.remove('pressed'); }, { passive: true });
            el.addEventListener('touchcancel', function () { el.classList.remove('pressed'); }, { passive: true });
        }

        // Dispatch key events on DOCUMENT so document.onkeydown catches them
        function fireKey(code, key) {
            var o = { keyCode: code, which: code, key: key, code: key === ' ' ? 'Space' : 'Key' + key.toUpperCase(), bubbles: true, cancelable: true };
            document.dispatchEvent(new KeyboardEvent('keydown', o));
            document.dispatchEvent(new KeyboardEvent('keyup', o));
        }

        function moveMouse(x, y) {
            canvas.dispatchEvent(new MouseEvent('mousemove', {
                clientX: x, clientY: y, bubbles: true, cancelable: true
            }));
        }

        function dist2(a, b) {
            var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        function findTouch(list, id) {
            for (var i = 0; i < list.length; i++) if (list[i].identifier === id) return list[i];
            return null;
        }

        function setJoystick(ox, oy, ix, iy) {
            jOuter.style.display = 'block';
            jInner.style.display = 'block';
            jOuter.style.left = ox + 'px'; jOuter.style.top = oy + 'px';
            jInner.style.left = ix + 'px'; jInner.style.top = iy + 'px';
        }

        function hideJoystick() {
            jOuter.style.display = 'none';
            jInner.style.display = 'none';
        }

        // Prevent context menu on long-press
        document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

        console.log(
            '%c LM Mobile v2.1 %c Touch controls active ',
            'background: linear-gradient(135deg, #01d9cc, #018cf6); color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px 0 0 4px; font-family: Ubuntu, sans-serif;',
            'background: #00243e; color: #01d9cc; padding: 4px 10px; border-radius: 0 4px 4px 0; font-family: Ubuntu, sans-serif;'
        );
    }
})();
