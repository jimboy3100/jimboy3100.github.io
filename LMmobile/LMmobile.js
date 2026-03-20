// LM Mobile Controls v2.0 — by Jimboy3100
// Touch controls for mobile: virtual joystick, split, feed,
// pinch-to-zoom, menu toggle (ESC), and fullscreen button.
// Styled to match the ogario HUD (teal/navy theme).

(function () {
    'use strict';

    // ── Guard: only run on touch devices ────────────────────────
    if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) return;

    // ── Inject CSS for mobile controls ──────────────────────────
    var style = document.createElement('style');
    style.textContent = [
        // Button container
        '#lm-mobile-controls {',
        '  position: fixed; bottom: 0; right: 0; z-index: 100000;',
        '  pointer-events: none; user-select: none; -webkit-user-select: none;',
        '  padding: 12px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;',
        '}',

        // Action buttons (split & feed)
        '.lm-btn {',
        '  pointer-events: auto; touch-action: none; cursor: pointer;',
        '  display: flex; align-items: center; justify-content: center;',
        '  border-radius: 50%;',
        '  background: rgba(0, 36, 62, 0.65);',                 // #00243e at 65%
        '  border: 2px solid rgba(1, 217, 204, 0.4);',          // #01d9cc border
        '  box-shadow: 0 0 12px rgba(1, 217, 204, 0.15), inset 0 1px 0 rgba(255,255,255,0.05);',
        '  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);',
        '  transition: transform 0.12s ease, background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;',
        '  color: rgba(255, 255, 255, 0.9);',
        '  font-family: "Ubuntu", "Roboto", sans-serif;',
        '  font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;',
        '  text-shadow: 0 1px 2px rgba(0,0,0,0.6);',
        '}',
        '.lm-btn:active, .lm-btn.pressed {',
        '  transform: scale(0.88);',
        '  background: rgba(1, 217, 204, 0.3);',
        '  border-color: rgba(1, 217, 204, 0.8);',
        '  box-shadow: 0 0 20px rgba(1, 217, 204, 0.35), inset 0 1px 0 rgba(255,255,255,0.1);',
        '}',

        // Large action buttons (split/feed)
        '.lm-btn-action {',
        '  width: 72px; height: 72px; font-size: 13px;',
        '}',

        // Small utility buttons (menu/fullscreen)
        '.lm-btn-util {',
        '  width: 48px; height: 48px; font-size: 18px;',
        '  background: rgba(0, 47, 82, 0.55);',                 // #002f52 at 55%
        '  border-color: rgba(1, 140, 246, 0.35);',             // #018cf6 border
        '  box-shadow: 0 0 8px rgba(1, 140, 246, 0.1);',
        '}',
        '.lm-btn-util:active, .lm-btn-util.pressed {',
        '  background: rgba(1, 140, 246, 0.3);',
        '  border-color: rgba(1, 140, 246, 0.8);',
        '  box-shadow: 0 0 16px rgba(1, 140, 246, 0.3);',
        '}',

        // Button icon inside
        '.lm-btn-icon {',
        '  display: flex; flex-direction: column; align-items: center; gap: 2px;',
        '}',
        '.lm-btn-icon .lm-icon { font-size: 22px; line-height: 1; }',
        '.lm-btn-icon .lm-label { font-size: 9px; opacity: 0.7; letter-spacing: 1px; }',

        // Row for util buttons
        '.lm-util-row {',
        '  display: flex; gap: 8px; pointer-events: none; margin-bottom: 4px;',
        '}',

        // Joystick elements
        '.lm-joystick-outer {',
        '  width: 120px; height: 120px; border-radius: 50%;',
        '  background: rgba(0, 36, 62, 0.2);',
        '  border: 2px solid rgba(1, 217, 204, 0.25);',
        '  position: fixed; display: none; z-index: 99998;',
        '  transform: translate(-50%, -50%);',
        '  pointer-events: none;',
        '}',
        '.lm-joystick-inner {',
        '  width: 52px; height: 52px; border-radius: 50%;',
        '  background: radial-gradient(circle, rgba(1,217,204,0.3) 0%, rgba(1,217,204,0.08) 100%);',
        '  border: 2px solid rgba(1, 217, 204, 0.5);',
        '  box-shadow: 0 0 10px rgba(1, 217, 204, 0.2);',
        '  position: fixed; display: none; z-index: 99999;',
        '  transform: translate(-50%, -50%);',
        '  pointer-events: none;',
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

        // Hide controls when main menu is open
        '#helloContainer:not([style*="display: none"]):not([style*="display:none"]) ~ #lm-mobile-controls {',
        '  opacity: 0.3;',
        '}',

    ].join('\n');
    document.head.appendChild(style);

    // Wait for canvas + game core
    var readyCheck = setInterval(function () {
        if (!document.getElementById('canvas')) return;
        clearInterval(readyCheck);
        setTimeout(initMobileControls, 500); // small delay for game scripts to init
    }, 200);

    function initMobileControls() {
        var canvas = document.getElementById('canvas');
        if (!canvas) return;

        // ════════════════════════════════════════════════════════
        //  1. CREATE BUTTON CONTAINER
        // ════════════════════════════════════════════════════════
        var container = document.createElement('div');
        container.id = 'lm-mobile-controls';
        document.body.appendChild(container);

        // Utility row (menu + fullscreen)
        var utilRow = document.createElement('div');
        utilRow.className = 'lm-util-row';
        container.appendChild(utilRow);

        var menuBtn = createButton('lm-menuBtn', '☰', null, 'lm-btn lm-btn-util');
        var fullBtn = createButton('lm-fullBtn', '⛶', null, 'lm-btn lm-btn-util');
        utilRow.appendChild(menuBtn);
        utilRow.appendChild(fullBtn);

        // Split button
        var splitBtn = createButton('lm-splitBtn', '⚔', 'SPLIT', 'lm-btn lm-btn-action');
        container.appendChild(splitBtn);

        // Feed button
        var feedBtn = createButton('lm-feedBtn', '⬤', 'FEED', 'lm-btn lm-btn-action');
        container.appendChild(feedBtn);

        // Joystick elements
        var joystickOuter = document.createElement('div');
        joystickOuter.className = 'lm-joystick-outer';
        document.body.appendChild(joystickOuter);

        var joystickInner = document.createElement('div');
        joystickInner.className = 'lm-joystick-inner';
        document.body.appendChild(joystickInner);

        // Zoom indicator
        var zoomInd = document.createElement('div');
        zoomInd.className = 'lm-zoom-indicator';
        zoomInd.textContent = 'ZOOM';
        document.body.appendChild(zoomInd);
        var zoomTimeout = null;

        // ════════════════════════════════════════════════════════
        //  2. BUTTON INTERACTIONS
        // ════════════════════════════════════════════════════════

        // --- Press effects ---
        function bindPress(el) {
            el.addEventListener('touchstart', function () { el.classList.add('pressed'); }, { passive: true });
            el.addEventListener('touchend', function () { el.classList.remove('pressed'); }, { passive: true });
            el.addEventListener('touchcancel', function () { el.classList.remove('pressed'); }, { passive: true });
        }
        bindPress(menuBtn); bindPress(fullBtn); bindPress(splitBtn); bindPress(feedBtn);

        // --- Split: tap = one split (space) ---
        splitBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            fireKey(32, ' ');
        }, { passive: false });

        // --- Feed: hold = continuous W ---
        var feedInterval = null;
        feedBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            feedInterval = setInterval(function () { fireKey(87, 'w'); }, 10);
        }, { passive: false });
        feedBtn.addEventListener('touchend', function () { clearInterval(feedInterval); }, { passive: true });
        feedBtn.addEventListener('touchcancel', function () { clearInterval(feedInterval); }, { passive: true });

        // --- Menu: toggle HUD (ESC) ---
        menuBtn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            if (typeof application !== 'undefined' && application.showMenu) {
                application.showMenu();
            } else {
                fireKey(27, 'Escape');
            }
        }, { passive: false });

        // --- Fullscreen ---
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
        var touchOrigin = { x: 0, y: 0 };
        var joystickTouchId = null;
        var aspectRatio = window.innerWidth / window.innerHeight;
        var JOYSTICK_CLAMP = 55; // px radius for inner stick

        window.addEventListener('resize', function () {
            aspectRatio = window.innerWidth / window.innerHeight;
        });

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                var t = e.changedTouches[0];
                joystickTouchId = t.identifier;
                touchOrigin.x = t.clientX;
                touchOrigin.y = t.clientY;
                dispatchMouse(t.clientX, t.clientY);
                showJoystick(touchOrigin.x, touchOrigin.y, touchOrigin.x, touchOrigin.y);
            }
        }, { passive: true });

        canvas.addEventListener('touchend', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === joystickTouchId) {
                    joystickTouchId = null;
                    dispatchMouse(window.innerWidth / 2, window.innerHeight / 2);
                    hideJoystick();
                    break;
                }
            }
        }, { passive: true });

        canvas.addEventListener('touchcancel', function () {
            joystickTouchId = null;
            dispatchMouse(window.innerWidth / 2, window.innerHeight / 2);
            hideJoystick();
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            var jTouch = findTouch(e.changedTouches, joystickTouchId);
            if (!jTouch) return;

            // Amplified mouse position for game engine
            var dx = -(touchOrigin.x - jTouch.clientX) * 300;
            var dy = -(touchOrigin.y - jTouch.clientY) * 300 * aspectRatio;
            dispatchMouse((window.innerWidth / 2) + dx, (window.innerHeight / 2) + dy);

            // Visual: clamp inner stick
            var rawDx = jTouch.clientX - touchOrigin.x;
            var rawDy = jTouch.clientY - touchOrigin.y;
            var dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
            var innerX, innerY;
            if (dist > JOYSTICK_CLAMP) {
                var angle = Math.atan2(rawDy, rawDx);
                innerX = touchOrigin.x + Math.cos(angle) * JOYSTICK_CLAMP;
                innerY = touchOrigin.y + Math.sin(angle) * JOYSTICK_CLAMP;
            } else {
                innerX = jTouch.clientX;
                innerY = jTouch.clientY;
            }
            showJoystick(touchOrigin.x, touchOrigin.y, innerX, innerY);
        }, { passive: true });

        // ════════════════════════════════════════════════════════
        //  4. PINCH-TO-ZOOM → WheelEvent
        // ════════════════════════════════════════════════════════
        var lastPinchDist = 0;
        var isPinching = false;

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 2) {
                isPinching = true;
                lastPinchDist = pinchDist(e.touches[0], e.touches[1]);
                hideJoystick();
                joystickTouchId = null;
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            if (e.touches.length === 2 && isPinching) {
                e.preventDefault();
                var newDist = pinchDist(e.touches[0], e.touches[1]);
                var delta = lastPinchDist - newDist;

                if (Math.abs(delta) > 4) {
                    var wheelDelta = delta * 2.5;
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

                    // Show zoom indicator
                    zoomInd.textContent = delta > 0 ? '🔍 −' : '🔍 +';
                    zoomInd.classList.add('visible');
                    clearTimeout(zoomTimeout);
                    zoomTimeout = setTimeout(function () {
                        zoomInd.classList.remove('visible');
                    }, 400);

                    lastPinchDist = newDist;
                }
            }
        }, { passive: false });

        canvas.addEventListener('touchend', function (e) {
            if (e.touches.length < 2) {
                isPinching = false;
                lastPinchDist = 0;
            }
        }, { passive: true });

        // ════════════════════════════════════════════════════════
        //  HELPERS
        // ════════════════════════════════════════════════════════
        function createButton(id, icon, label, cls) {
            var btn = document.createElement('div');
            btn.id = id;
            btn.className = cls;
            if (label) {
                btn.innerHTML = '<div class="lm-btn-icon"><span class="lm-icon">' + icon + '</span><span class="lm-label">' + label + '</span></div>';
            } else {
                btn.textContent = icon;
            }
            return btn;
        }

        function fireKey(keyCode, key) {
            var opts = { keyCode: keyCode, which: keyCode, key: key, bubbles: true, cancelable: true };
            document.body.dispatchEvent(new KeyboardEvent('keydown', opts));
            document.body.dispatchEvent(new KeyboardEvent('keyup', opts));
        }

        function dispatchMouse(x, y) {
            canvas.dispatchEvent(new MouseEvent('mousemove', {
                clientX: x, clientY: y, bubbles: true, cancelable: true
            }));
        }

        function pinchDist(t1, t2) {
            var dx = t1.clientX - t2.clientX, dy = t1.clientY - t2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        function findTouch(list, id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].identifier === id) return list[i];
            }
            return null;
        }

        function showJoystick(ox, oy, ix, iy) {
            joystickOuter.style.display = 'block';
            joystickInner.style.display = 'block';
            joystickOuter.style.left = ox + 'px';
            joystickOuter.style.top = oy + 'px';
            joystickInner.style.left = ix + 'px';
            joystickInner.style.top = iy + 'px';
        }

        function hideJoystick() {
            joystickOuter.style.display = 'none';
            joystickInner.style.display = 'none';
        }

        // Prevent context menu on long-press
        document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

        // Console branding
        console.log(
            '%c LM Mobile v2.0 %c Touch controls active ',
            'background: linear-gradient(135deg, #01d9cc, #018cf6); color: #fff; font-weight: bold; padding: 4px 10px; border-radius: 4px 0 0 4px; font-family: Ubuntu, sans-serif;',
            'background: #00243e; color: #01d9cc; padding: 4px 10px; border-radius: 0 4px 4px 0; font-family: Ubuntu, sans-serif;'
        );
    }
})();
