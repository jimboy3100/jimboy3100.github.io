/**
 * LM Mobile Controls v4.0 — by Jimboy3100
 *
 * Touch-control overlay for Legend Mod mobile.
 * Matches the ogario HUD aesthetic (teal / navy / Ubuntu font).
 *
 * Features:
 *  • Virtual joystick  — drag on canvas to steer, cell keeps moving after release
 *  • Split  (⚔)        — tap to split (Space)
 *  • Feed   (⬤)        — hold to eject mass (W)
 *  • Menu   (☰)        — toggle main HUD / ESC
 *  • Chat   (💬)        — open chat, tap Send or anywhere else to send & close
 *  • Fullscreen (⛶)    — toggle fullscreen
 *  • Pinch-to-zoom      — two-finger pinch → WheelEvent
 */

(function () {
    'use strict';

    /* Touch-only devices: Windows touch laptops (mouse + touchscreen) keep the desktop UI. */
    if (!(window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return;

    /* ── Global flag for other scripts to detect mobile mode ── */
    /* loaded twice: two sets of buttons, every tap split twice */
    if (window.LM_IS_MOBILE) return;
    window.LM_IS_MOBILE = true;

    /* ═══════════════════════════════════════════════════════════
     *  CSS
     * ═══════════════════════════════════════════════════════════ */
    var css = document.createElement('style');
    css.id = 'lm-mobile-css';
    css.textContent =
        /* lock down browser zoom — only our JS pinch handler zooms */
        'html,body{touch-action:pan-x pan-y}' +
        'canvas{touch-action:none}' +

        /* ── Safe area insets for notched phones / iPads ── */
        '@supports(padding:env(safe-area-inset-top)){' +
        '#lm-mc-l{padding:0!important}' +
        '#lm-mc-r{padding-right:env(safe-area-inset-right);padding-bottom:env(safe-area-inset-bottom)}' +
        '#minimap-hud{margin-right:env(safe-area-inset-right)!important;' +
        'margin-bottom:env(safe-area-inset-bottom)!important}' +

        '}' +

        '#lm-mc-l{position:fixed!important;left:2px!important;bottom:2px!important;z-index:100000;' +
        'margin:0!important;padding:0!important;transform:none!important;' +
        'pointer-events:none;user-select:none;-webkit-user-select:none;' +
        'display:flex;flex-direction:row;align-items:flex-end;gap:6px}' +

        /* ── Drawer: always visible, horizontal row to right of ☰ ── */
        '#lm-drawer{display:flex;flex-direction:row;align-items:flex-end;gap:8px;' + /* was 5px: mis-taps toggled AutoPlay */
        'pointer-events:auto}' +

        /* ── Drawer button: smaller than trigger, equal size ── */
        '.lm-d{pointer-events:auto;touch-action:none;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;border-radius:50%;' +
        'width:40px;height:40px;font-size:16px;' + /* was 36px */
        'background:rgba(0,36,62,.50);border:1.5px solid rgba(1,217,204,.22);' +
        'box-shadow:0 0 6px rgba(1,217,204,.06);' +
        'color:rgba(255,255,255,.8);font-family:Ubuntu,Roboto,sans-serif;' +
        'font-weight:700;transition:transform .1s,background .15s}' +
        '.lm-d.p{transform:scale(.88);background:rgba(1,217,204,.20)}' +
        '.lm-d.lm-active{background:rgba(1,217,204,.18)!important;border-color:rgba(1,217,204,.55)!important}' +

        /* ── RIGHT: SPLIT + FEED column (positioned by JS) ── */
        '#lm-mc-r{position:fixed;z-index:100000;' +
        'pointer-events:none;user-select:none;-webkit-user-select:none;' +
        'display:flex;flex-direction:column;align-items:center;gap:10px}' +

        /* ── SMALL ROW: 4× + 16× (positioned by JS above minimap) ── */
        /* Menu open: the buttons stay visible but take no taps (they sat above the menu and ate its
         * taps). Hiding them made players think they were gone. */
        '.lm-menu #lm-mc-r,.lm-menu #lm-mc-r *,.lm-menu #lm-mc-sm,.lm-menu #lm-mc-sm *{pointer-events:none!important}' +
        '#lm-mc-sm{position:fixed;z-index:100000;' +
        'pointer-events:none;user-select:none;-webkit-user-select:none;' +
        'display:flex;flex-direction:row;align-items:center;gap:10px}' + /* was 6px, next to the minimap */

        /* ── Shared button base (clean, subtle) ── */
        '.lm-b{pointer-events:auto;touch-action:none;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;border-radius:50%;' +
        'background:rgba(0,36,62,.55);border:2px solid rgba(1,217,204,.25);' +
        'box-shadow:0 0 8px rgba(1,217,204,.08);' +
        'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);' +
        'transition:transform .1s,background .15s,border-color .15s,box-shadow .15s;' +
        'color:rgba(255,255,255,.85);font-family:Ubuntu,Roboto,sans-serif;' +
        'font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.4)}' +

        '.lm-b.p{transform:scale(.88);background:rgba(1,217,204,.25);' +
        'border-color:rgba(1,217,204,.65);box-shadow:0 0 14px rgba(1,217,204,.25)}' +

        /* action buttons: BIG, thumb-friendly */
        '.lm-a{width:clamp(72px,20vmin,100px);height:clamp(72px,20vmin,100px)}' +

        '.lm-u{width:clamp(48px,13vmin,60px);height:clamp(48px,13vmin,60px);font-size:20px;' +
        'background:rgba(0,47,82,.45);border-color:rgba(1,140,246,.25);' +
        'box-shadow:0 0 6px rgba(1,140,246,.08)}' +
        '.lm-u.p{background:rgba(1,140,246,.20);border-color:rgba(1,140,246,.60)}' +

        '.lm-bi{display:flex;flex-direction:column;align-items:center;gap:1px;pointer-events:none}' +
        '.lm-bi .i{font-size:clamp(22px,6vmin,30px);line-height:1}' +
        '.lm-bi .l{font-size:clamp(8px,2.2vmin,11px);opacity:.55;letter-spacing:1.2px;text-transform:uppercase}' +

        '.lm-s{width:clamp(44px,10vmin,52px);height:clamp(44px,10vmin,52px);font-size:13px;' + /* min 44px touch target */
        'background:rgba(0,47,82,.50);border-color:rgba(141,95,230,.35);' +
        'box-shadow:0 0 6px rgba(141,95,230,.10)}' +
        '.lm-s.p{background:rgba(141,95,230,.25);border-color:rgba(141,95,230,.75)}' +

        /* toggle-active glow for autoplay / pause */
        '.lm-active{background:rgba(1,217,204,.18)!important;border-color:rgba(1,217,204,.55)!important;' +
        'box-shadow:0 0 8px rgba(1,217,204,.25)!important}' +

        '.lm-r{display:flex;gap:6px;pointer-events:none}' +

        /* ── Settings panel ── */
        '#lm-sp{background:rgba(0,36,62,.92);border:1px solid rgba(1,217,204,.35);' +
        'border-radius:12px;padding:14px 16px;width:200px;' +
        'max-height:50vh;overflow-y:auto;' +
        'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
        'pointer-events:auto;user-select:none;-webkit-user-select:none;' +
        'display:none;flex-direction:column;gap:10px}' +
        '#lm-sp.on{display:flex}' +
        '#lm-sp label{color:rgba(255,255,255,.75);font:600 11px/1.2 Ubuntu,Roboto,sans-serif;' +
        'letter-spacing:.5px;text-transform:uppercase;display:flex;' +
        'justify-content:space-between;align-items:center}' +
        '#lm-sp label span{color:#01d9cc;font-weight:700}' +
        '#lm-sp input[type=range]{-webkit-appearance:none;width:100%;height:4px;' +
        'background:rgba(1,217,204,.25);border-radius:2px;outline:none;margin-top:4px}' +
        '#lm-sp input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;' +
        'width:18px;height:18px;border-radius:50%;background:#01d9cc;cursor:pointer;' +
        'box-shadow:0 0 6px rgba(1,217,204,.4)}' +

        '.lm-jo{width:120px;height:120px;border-radius:50%;' +
        'background:rgba(0,36,62,.18);border:2px solid rgba(1,217,204,.22);' +
        'position:fixed;display:none;z-index:99998;transform:translate(-50%,-50%);pointer-events:none}' +

        '.lm-ji{width:50px;height:50px;border-radius:50%;' +
        'background:radial-gradient(circle,rgba(1,217,204,.28) 0%,rgba(1,217,204,.06) 100%);' +
        'border:2px solid rgba(1,217,204,.45);box-shadow:0 0 8px rgba(1,217,204,.18);' +
        'position:fixed;display:none;z-index:99999;transform:translate(-50%,-50%);pointer-events:none}' +

        '.lm-z{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
        'background:rgba(0,36,62,.82);border:1px solid rgba(1,217,204,.45);' +
        'color:#01d9cc;font:700 14px/1 Ubuntu,Roboto,sans-serif;' +
        'padding:6px 18px;border-radius:20px;pointer-events:none;z-index:100001;' +
        'opacity:0;transition:opacity .2s}.lm-z.on{opacity:1}' +

        '#lm-cb{display:none!important}' +

        /* prevent iOS auto-zoom on chat input focus (needs >=16px) */
        '#message{font-size:16px!important}' +

        /* hide target panel on mobile — overlaps with touch buttons */
        '#target-panel-hud,#target-hud{display:none!important}' +

        /* GPU acceleration for smooth rendering on mobile */
        'canvas,#minimap-hud,#leaderboard-hud,#top5-hud,#stats-hud{will-change:transform}' +

        /* smaller HUD text on mobile */
        '#leaderboard-hud{font-size:85%!important}' +
        '#leaderboard-hud h5{font-size:16px!important}' +
        '#leaderboard-positions{font-size:14px!important}' +
        '#top5-hud{font-size:85%!important}' +
        '#top5-pos{font-size:13px!important}' +

        /* HUD fade transition */
        '#leaderboard-hud,#top5-hud,#stats-hud,#time-hud{transition:opacity .4s ease}' +

        /* minimap tap-to-expand transition */
        '#minimap-hud{transition:transform .25s ease!important}' +

        /* portrait orientation prompt */
        '#lm-orient-toast{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
        'background:rgba(0,36,62,.95);border:2px solid rgba(1,217,204,.5);' +
        'color:#01d9cc;font:600 16px/1.6 Ubuntu,Roboto,sans-serif;' +
        'padding:20px 28px;border-radius:16px;z-index:100004;text-align:center;' +
        'opacity:0;transition:opacity .5s;pointer-events:none}' +
        '#lm-orient-toast.on{opacity:1}' +

        /* ── Persistent portrait overlay (blocks gameplay in portrait) ── */
        '#lm-portrait-ov{position:fixed;top:0;left:0;width:100%;height:100%;z-index:200000;' +
        'background:rgba(0,20,40,.92);display:none;align-items:center;justify-content:center;' +
        'flex-direction:column;gap:16px;color:#01d9cc;font:600 18px/1.5 Ubuntu,Roboto,sans-serif;' +
        'text-align:center;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}' +
        '#lm-portrait-ov.on{display:flex}' +
        '#lm-portrait-ov .icon{font-size:60px;animation:lm-rotate 2s ease-in-out infinite}' +
        '@keyframes lm-rotate{0%,100%{transform:rotate(0deg)}50%{transform:rotate(90deg)}}' +

        /* ── helloContainer: only overflow guard, JS handles scaling ── */
        '#helloContainer{overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}' +
        '#overlays{overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}' +

        /* ── Lock HUD elements into fixed positions (prevent displacement) ── */
        '#minimap-hud{position:fixed!important;bottom:4px!important;right:4px!important;' +
        'transform:scale(0.5)!important;transform-origin:bottom right!important;' +
        'pointer-events:none!important}' +
        '#leaderboard-hud{position:fixed!important;top:4px!important;right:4px!important;' +
        'transform:scale(0.75)!important;transform-origin:top right!important;' +
        'pointer-events:none!important}' +
        '#top5-hud{position:fixed!important;top:30px!important;left:4px!important;' +
        'transform:scale(0.75)!important;transform-origin:top left!important;' +
        'pointer-events:none!important}' +
        '#stats-hud{position:fixed!important;left:4px!important;' +
        'transform:scale(0.75)!important;transform-origin:bottom left!important;' +
        'display:none!important}' +
        '#menu-footer{display:none!important}' +
        '#LMPromoLegendFFA,#LMPromo,.modal-backdrop,#leaderboard-menu{display:none!important}' +
        /* replay bar: taller for a thumb and above the buttons (!important beats its inline bottom) */
        '#lm-replay-bar{height:26px!important;bottom:64px!important}' +
        /* windows fit short landscape screens; close crosses big enough for a thumb */
        '.lm-modal-container{max-height:96vh!important;overflow-y:auto!important}#lm-mh-modal,#lm-room-modal{max-height:94vh!important}' +
        '#lm-mh-close,#lm-room-close,.lm-modal-close,#lm-challenges-modal .lm-modal-header>button{min-width:44px!important;min-height:44px!important}' +
        /* net graph: top middle (at the left it sat under the chat box) */
        '#lm-net-graph{left:50%!important;top:54px!important;transform:translateX(-50%)}' +

        /* ── Compact mobile stats overlay ── */
        '#lm-stats{position:fixed;top:4px;left:4px;z-index:100001;' +
        'font:600 12px/1 Ubuntu,Roboto,sans-serif;color:rgba(255,255,255,.85);' +
        'text-shadow:0 1px 3px rgba(0,0,0,.6);pointer-events:auto;' +
        'user-select:none;-webkit-user-select:none;cursor:pointer}' +
        '#time-hud{position:fixed!important;right:4px!important;' +
        'transform:scale(0.75)!important;transform-origin:bottom right!important}' +
        '#chat-box,#messages{position:fixed!important;left:4px!important}' +
        '#message-box{position:fixed!important;left:50%!important;bottom:72px!important;transform:translate(-50%,0)!important}' +
        '#toast-container{position:fixed!important}' +

        /* fullscreen prompt toast */
        '#lm-fs-toast{position:fixed;top:16px;left:50%;transform:translateX(-50%);' +
        'background:rgba(0,36,62,.92);border:1px solid rgba(1,217,204,.45);' +
        'color:#01d9cc;font:600 14px/1.4 Ubuntu,Roboto,sans-serif;' +
        'padding:10px 20px;border-radius:24px;z-index:100003;' +
        'opacity:0;transition:opacity .4s;pointer-events:none;text-align:center}' +
        '#lm-fs-toast.on{opacity:1}';

    document.head.appendChild(css);

    /* ═══════════════════════════════════════════════════════════
     *  INIT
     * ═══════════════════════════════════════════════════════════ */
    var readyTimer = setInterval(function () {
        if (!document.getElementById('canvas')) return;
        clearInterval(readyTimer);
        boot(); /* Boot immediately — canvas is ready */
    }, 250);

    function boot() {
        var canvas = document.getElementById('canvas');
        if (!canvas) return;

        /* ── Lock down browser zoom ── */
        // Force viewport meta (iOS 10+ ignores user-scalable=no, so we also use gesturestart)
        var vp = document.querySelector('meta[name="viewport"]');
        if (vp) {
            vp.setAttribute('content',
                'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no');
        }
        // Safari/iOS: prevent native pinch-zoom gesture

        /* ── Scale #helloContainer to fit viewport (preserves internal layout) ── */
        (function fitHelloContainer() {
            function fit() {
                var hc = document.getElementById('helloContainer');
                if (!hc) return;
                /* Skip re-fit when an input/textarea inside helloContainer is focused.
                 * The mobile keyboard shrinks innerHeight, which would rescale the
                 * container to a tiny size, effectively hiding it. */
                var active = document.activeElement;
                if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) {
                    if (hc.contains(active)) return;
                }
                var vw = window.innerWidth;
                var vh = window.innerHeight;
                var baseW = 740; // original width from legend.css
                var baseH = hc.scrollHeight || 600; // actual content height
                var ratioW = (vw - 16) / baseW;
                var ratioH = (vh - 16) / baseH;
                var ratio = Math.min(1, ratioW, ratioH);
                hc.style.transform = 'translate(-50%,-50%) scale(' + ratio + ')';
                hc.style.transformOrigin = 'center center';
                hc.style.position = 'fixed';
                hc.style.top = '50%';
                hc.style.left = '50%';
                hc.style.maxHeight = Math.floor(vh / ratio) + 'px';
                hc.style.overflowY = 'auto';
            }
            /* Expose globally so other code (menu toggle) can call it instantly */
            window._lm_fitHC = fit;
            fit();
            setInterval(function () { if (!document.hidden) fit(); }, 4000); /* slow fallback — main triggers are events below */
            window.addEventListener('resize', fit);
            window.addEventListener('orientationchange', function () { requestAnimationFrame(fit); });
        })();
        /* ── Mobile visual overrides: proportional to user settings ── */
        (function mobileVisuals() {
            /* Values this function wrote last time: reduce only values that changed since
             * (a theme load), never our own output again (the observer re-runs apply). */
            var lastGrid = null, lastFood = null;
            function apply() {
                if (typeof defaultSettings !== 'undefined' && defaultSettings.gridColor !== lastGrid) {
                    // Grid: keep user's color, reduce opacity proportionally (×0.3)
                    var gc = defaultSettings.gridColor || '#00243e';
                    if (gc.indexOf('rgba') === 0) {
                        // Extract rgba components, multiply alpha by 0.3
                        var parts = gc.replace(/rgba?\(/, '').replace(')', '').split(',');
                        var a = parseFloat(parts[3] || 1) * 0.3;
                        defaultSettings.gridColor = 'rgba(' + parts[0].trim() + ',' +
                            parts[1].trim() + ',' + parts[2].trim() + ',' + a.toFixed(2) + ')';
                    } else {
                        // Hex or named color — wrap in rgba with low alpha
                        defaultSettings.gridColor = 'rgba(0,36,62,.15)';
                    }
                    lastGrid = defaultSettings.gridColor;
                }
                if (typeof defaultSettings !== 'undefined' && defaultSettings.foodSize !== lastFood) {
                    // FoodSize: proportional (60% of user's setting, min 1)
                    var userFood = defaultSettings.foodSize || 5;
                    defaultSettings.foodSize = Math.max(1, Math.round(userFood * 0.6));
                    lastFood = defaultSettings.foodSize;
                }
                if (typeof defaultmapsettings !== 'undefined') {
                    defaultmapsettings.showBgSectors = false; // no sector background
                }
            }
            apply();
            /* Re-apply after theme loads — observe for defaultSettings changes */
            if (typeof MutationObserver !== 'undefined') {
              var _themeObs = new MutationObserver(function() { apply(); });
              _themeObs.observe(document.body, { childList: true, subtree: true });
              setTimeout(function() { _themeObs.disconnect(); }, 10000);
            }
        })();

        /* ═══════════════════════════════════════════════════════
         *  MOBILE INPUT FIX — disable autocomplete on ALL inputs/textareas
         *  Prevents browser from suggesting passwords/cards/GPS on mobile.
         *  Does NOT set readonly — inputs stay fully clickable and pasteable.
         *  Only runs on mobile (this file is gated by touch check).
         * ═══════════════════════════════════════════════════════ */
        (function mobileInputFix() {
            function fixInput(el) {
                if (!el || el._lmFixed) return;
                el._lmFixed = true;
                /* Android Autofill Framework ignores autocomplete="off".
                 * Using "one-time-code" tricks it into suppressing all
                 * autofill suggestions (passwords, cards, GPS). Paste still works. */
                el.setAttribute('autocomplete', 'one-time-code');
                el.setAttribute('autocorrect', 'off');
                el.setAttribute('autocapitalize', 'off');
                el.setAttribute('spellcheck', 'false');
                /* Suppress third-party password managers */
                el.setAttribute('data-lpignore', 'true');      /* LastPass */
                el.setAttribute('data-1p-ignore', '');          /* 1Password */
                el.setAttribute('data-form-type', 'other');     /* Dashlane */
            }

            function scanAll() {
                var inputs = document.querySelectorAll('input, textarea');
                for (var i = 0; i < inputs.length; i++) fixInput(inputs[i]);
            }

            /* Remove autofocus from nick input so keyboard doesn't open on load */
            var nickInput = document.getElementById('nick');
            if (nickInput) { nickInput.removeAttribute('autofocus'); nickInput.blur(); }

            /* Scan now + re-scan for dynamically created inputs */
            scanAll();
            /* MutationObserver already re-scans on DOM changes — no extra delays needed */

            /* MutationObserver for inputs created after DOM ready (e.g. #skin by ogario) */
            var obs = new MutationObserver(function () { scanAll(); });
            obs.observe(document.body, { childList: true, subtree: true });
            /* stop observing after 30s to save resources */
            setTimeout(function () { obs.disconnect(); }, 30000);
        })();

        document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, { passive: false });
        document.addEventListener('gesturechange', function (e) { e.preventDefault(); }, { passive: false });
        document.addEventListener('gestureend', function (e) { e.preventDefault(); }, { passive: false });

        /* ═══════════════════════════════════════════════════════
         *  DEVICE TIERING
         *  Low-end (≤2 cores): disable expensive effects
         *  Everyone else: full quality
         * ═══════════════════════════════════════════════════════ */
        var cores = navigator.hardwareConcurrency || 4;
        if (cores <= 2) {
            window.LM_LOW_END = true;
            var lowCSS = document.createElement('style');
            lowCSS.textContent = '*{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}';
            document.head.appendChild(lowCSS);
        }
        /* (HiDPI canvas requires changes to ogario.v4.js resizeCanvas — cannot be patched externally) */

        /* ── Fullscreen + Landscape helper ──
         * Works in browser; gracefully degrades in Google Play WebView/TWA
         * where fullscreen/orientation are handled by AndroidManifest instead */
        function goFullscreenLandscape() {
            try {
                var el = document.documentElement;
                var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                if (rfs && !document.fullscreenElement && !document.webkitFullscreenElement) {
                    rfs.call(el).then(function () {
                        try { screen.orientation.lock('landscape').catch(function () { }); } catch (e) { }
                    }).catch(function () { });
                }
            } catch (e) { }
        }

        /* ── Auto-fullscreen on Play button tap ── */
        (function hookPlayButtons() {
            function hook(btn) {
                if (!btn || btn._lmHooked) return;
                btn._lmHooked = true;
                btn.addEventListener('click', function () {
                    goFullscreenLandscape();
                }, { passive: true });
                btn.addEventListener('touchstart', function () {
                    goFullscreenLandscape();
                }, { passive: true });
            }
            function scan() {
                // Hook all Play-type buttons
                var selectors = ['.btn-play', '.btn-play-guest', '.btn-login-play',
                    '#btn-play', '#btn-play-guest', '#btn-login-play'];
                selectors.forEach(function (s) {
                    var btns = document.querySelectorAll(s);
                    for (var i = 0; i < btns.length; i++) hook(btns[i]);
                });
            }
            scan();
            /* MutationObserver handles late-loading buttons */
            /* Play buttons rebuilt after the first 30 s were never hooked. Keep watching, but only
             * the menu (#helloContainer), not every DOM change on the page. */
            var _btnObs = new MutationObserver(function() { scan(); });
            var _btnRoot = document.getElementById('helloContainer');
            _btnObs.observe(_btnRoot || document.body, { childList: true, subtree: true });
            if (!_btnRoot) setTimeout(function() { _btnObs.disconnect(); }, 30000);
        })();

        /* ── Persistent portrait overlay (replaces one-time toast) ── */
        var portOv = mk('div'); portOv.id = 'lm-portrait-ov';
        portOv.innerHTML = '<div class="icon">📱</div>' +
            'Rotate your phone<br>for better gameplay' +
            '<div style="font-size:13px;opacity:.6;margin-top:8px">Landscape mode required</div>';
        document.body.appendChild(portOv);

        function checkOrientation() {
            var isPortrait = window.innerHeight > window.innerWidth;
            var isPlaying = !isMenuVisible();
            /* tablets (short side 768 px or more) can play in portrait: no "rotate" overlay */
            var isTablet = Math.min(window.innerWidth, window.innerHeight) >= 768;
            if (isPortrait && isPlaying && !isTablet) {
                portOv.classList.add('on');
            } else {
                portOv.classList.remove('on');
            }
        }
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', function () { requestAnimationFrame(checkOrientation); });
        /* No recurring fallback needed — resize + orientationchange events cover it */

        /* ── Wake Lock (prevent screen from sleeping during gameplay) ── */
        /* (not used: the menu sync below takes the lock while playing and releases it in the
         * menu; this one was taken at load and never released, so the screen never slept) */
        var wakeLock = null;
        function requestWakeLock() {
            try {
                if ('wakeLock' in navigator) {
                    navigator.wakeLock.request('screen').then(function (wl) {
                        wakeLock = wl;
                    }).catch(function () { });
                }
            } catch (e) { }
        }


        /* ═══════════════════════════════════════════════════════
         *  DOM — Game-controller layout
         *
         *  LEFT  (#lm-mc-l) — utilities:  ☰ 💬 ⛶  /  🤖 ⏸
         *  RIGHT (#lm-mc-r) — actions:    [2×][16×] / ⚔ / ⬤
         *
         *  Left thumb  = joystick (canvas touch)
         *  Right thumb = combat actions (split / feed)
         * ═══════════════════════════════════════════════════════ */

        /* ═══════════════════════════════════════════════════════
         *  USER PREFERENCES (localStorage)
         * ═══════════════════════════════════════════════════════ */
        var PREF_KEY = 'lm-mobile-prefs';
        var prefs = { jsSensitivity: 300, btnOpacity: 0.65, btnScale: 1.0, hudFade: 0.5, targetMode: false, swipeSplit: false, muteVibration: false, tapHaptic: false, quickCmds: false, mbButton: false, stopOnRelease: false, pingBtn: false, netGraph: false };
        try {
            var saved = JSON.parse(localStorage.getItem(PREF_KEY));
            if (saved) {
                if (saved.jsSensitivity !== undefined) prefs.jsSensitivity = saved.jsSensitivity;
                if (saved.btnOpacity !== undefined) prefs.btnOpacity = saved.btnOpacity;
                if (saved.btnScale !== undefined) prefs.btnScale = saved.btnScale;
                if (saved.hudFade !== undefined) prefs.hudFade = saved.hudFade;
                if (saved.targetMode !== undefined) prefs.targetMode = saved.targetMode;
                if (saved.swipeSplit !== undefined) prefs.swipeSplit = !!saved.swipeSplit;
                if (saved.muteVibration !== undefined) prefs.muteVibration = !!saved.muteVibration;
                if (saved.tapHaptic !== undefined) prefs.tapHaptic = !!saved.tapHaptic;
                if (saved.quickCmds !== undefined) prefs.quickCmds = !!saved.quickCmds;
                if (saved.mbButton !== undefined) prefs.mbButton = !!saved.mbButton;
                if (saved.stopOnRelease !== undefined) prefs.stopOnRelease = !!saved.stopOnRelease;
                if (saved.pingBtn !== undefined) prefs.pingBtn = !!saved.pingBtn;
                if (saved.netGraph !== undefined) prefs.netGraph = !!saved.netGraph;
            }
        } catch (e) { }
        function savePrefs() {
            try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { }
        }

        /* ── LEFT side: ☰ menu + hidden drawer ── */
        var rootL = mk('div'); rootL.id = 'lm-mc-l';
        document.body.appendChild(rootL);

        /* drawer: secondary buttons (hidden by default, opens right) */
        var drawer = mk('div'); drawer.id = 'lm-drawer';

        function mkd(label) {
            var b = mk('div'); b.className = 'lm-d lm-b';
            b.textContent = label;
            return b;
        }
        var bChat = mkd('💬');
        var bAI = mkd('►');
        var bPaus = mkd('❚❚');
        
        drawer.appendChild(bAI);
        drawer.appendChild(bPaus);
        /* replay seek: shown only while a replay plays (see syncAiPause) */
        var bRwd = mkd('\u23EA'), bFwd = mkd('\u23E9');
        bRwd.style.display = 'none'; bFwd.style.display = 'none';
        drawer.appendChild(bRwd);
        drawer.appendChild(bFwd);
        drawer.appendChild(bChat);

        var bStop = mkd(prefs.targetMode ? '⌖' : '⇶');
        bStop.style.display = 'none';
        drawer.appendChild(bStop);
        
        bStop.addEventListener('touchstart', function(e) {
            e.preventDefault(); e.stopPropagation();
            prefs.targetMode = !prefs.targetMode;
            bStop.textContent = prefs.targetMode ? '⌖' : '⇶';
            savePrefs();
        }, { passive: false });

        /* ☰ menu button: leftmost, always visible, toggles helloContainer */
        var bMenu = mkb('☰', null, true);
        rootL.appendChild(bMenu);
        rootL.appendChild(drawer);

        /* ── Settings panel: inside drawer (no fixed position) ── */
        var sp = mk('div'); sp.id = 'lm-sp';
        sp.innerHTML =
            '<label>Joystick <span id="lm-js-v">' + prefs.jsSensitivity + '</span></label>' +
            '<input type="range" id="lm-js" min="100" max="600" step="25" value="' + prefs.jsSensitivity + '">' +
            '<label>Opacity <span id="lm-op-v">' + Math.round(prefs.btnOpacity * 100) + '%</span></label>' +
            '<input type="range" id="lm-op" min="20" max="100" step="5" value="' + Math.round(prefs.btnOpacity * 100) + '">' +
            '<label>Btn Size <span id="lm-bs-v">' + Math.round(prefs.btnScale * 100) + '%</span></label>' +
            '<input type="range" id="lm-bs" min="50" max="150" step="5" value="' + Math.round(prefs.btnScale * 100) + '">' +
            '<label><input type="checkbox" id="lm-sw"' + (prefs.swipeSplit ? ' checked' : '') + '> Flick split (left half: right = split, up = double)</label>' +
            '<label><input type="checkbox" id="lm-novib"' + (prefs.muteVibration ? ' checked' : '') + '> No vibration on death and chat</label>' +
            '<label><input type="checkbox" id="lm-stoprel"' + (prefs.stopOnRelease ? ' checked' : '') + '> Stop on release (cell stops when you lift the joystick thumb)</label>' +
            '<label><input type="checkbox" id="lm-taphap"' + (prefs.tapHaptic ? ' checked' : '') + '> Short vibration on Split / Feed</label>' +
            '<label><input type="checkbox" id="lm-qcmd"' + (prefs.quickCmds ? ' checked' : '') + '> Quick chat buttons (commands 1-4)</label>' +
            '<label><input type="checkbox" id="lm-mbbtn"' + (prefs.mbButton ? ' checked' : '') + '> Multibox button (second player; uses more data)</label>' +
            '<label><input type="checkbox" id="lm-pingbtn"' + (prefs.pingBtn ? ' checked' : '') + '> Team ping button (tap = Go here; hold and slide = Help, Danger, Virus here)</label>' +
            '<label><input type="checkbox" id="lm-netgraph"' + (prefs.netGraph ? ' checked' : '') + '> Net graph (FPS and ping of the last 30 seconds)</label>';
        drawer.appendChild(sp);

        /* The panel only shows with class "on", and nothing ever added it, so joystick
         * sensitivity, opacity, button size and flick split could not be changed. */
        var bCfg = mkd('⚙');
        drawer.insertBefore(bCfg, sp);
        bCfg.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            sp.classList.toggle('on');
            /* the panel sits in the button group, which has the button opacity: show it solid */
            rootL.style.opacity = sp.classList.contains('on') ? 1 : prefs.btnOpacity;
        }, { passive: false });

        function applyPrefs() {
            rootL.style.opacity = prefs.btnOpacity;
            rootR.style.opacity = prefs.btnOpacity;
            smallR.style.opacity = prefs.btnOpacity;
            rootL.style.transform = 'scale(' + prefs.btnScale + ')';
            rootL.style.transformOrigin = 'bottom left';
            rootR.style.transform = 'scale(' + prefs.btnScale + ')';
            rootR.style.transformOrigin = 'bottom right';
            smallR.style.transform = 'scale(' + prefs.btnScale + ')';
            smallR.style.transformOrigin = 'bottom right';
        }

        /* slider handlers */
        sp.querySelector('#lm-js').addEventListener('input', function () {
            prefs.jsSensitivity = parseInt(this.value);
            sp.querySelector('#lm-js-v').textContent = this.value;
            savePrefs();
        });
        sp.querySelector('#lm-op').addEventListener('input', function () {
            prefs.btnOpacity = parseInt(this.value) / 100;
            sp.querySelector('#lm-op-v').textContent = this.value + '%';
            applyPrefs(); savePrefs();
        });
        sp.querySelector('#lm-bs').addEventListener('input', function () {
            prefs.btnScale = parseInt(this.value) / 100;
            sp.querySelector('#lm-bs-v').textContent = this.value + '%';
            applyPrefs(); savePrefs();
        });
        /* (HUD Fade slider removed: nothing read prefs.hudFade) */
        sp.querySelector('#lm-sw').addEventListener('change', function () {
            prefs.swipeSplit = this.checked;
            savePrefs();
        });
        sp.querySelector('#lm-novib').addEventListener('change', function () { prefs.muteVibration = this.checked; savePrefs(); });
        sp.querySelector('#lm-stoprel').addEventListener('change', function () { prefs.stopOnRelease = this.checked; savePrefs(); });
        sp.querySelector('#lm-taphap').addEventListener('change', function () { prefs.tapHaptic = this.checked; savePrefs(); });
        /* Quick chat: chat commands 1-4 (Hotkeys > command texts) with one tap instead of the
         * keyboard; sent like the desktop command hotkeys (Expanding Land 2 s window included) */
        var quickBtns = [];
        function buildQuickCmds() {
            quickBtns.forEach(function (b) { if (b.parentNode) b.parentNode.removeChild(b); });
            quickBtns = [];
            if (!prefs.quickCmds) return;
            for (var qi = 1; qi <= 4; qi++) {
                (function (n) {
                    var b = mkd(String(n));
                    try { if (typeof chatCommand !== 'undefined' && chatCommand['comm' + n]) b.title = String(chatCommand['comm' + n]); } catch (e) { }
                    b.addEventListener('touchstart', function (e) {
                        e.preventDefault(); e.stopPropagation();
                        debounced(function () {
                            if (typeof application !== 'undefined' && application && typeof application.sendCommand === 'function') application.sendCommand(n);
                        }, 'qcmd' + n, 600);
                    }, { passive: false });
                    drawer.insertBefore(b, bCfg);
                    quickBtns.push(b);
                })(qi);
            }
        }
        buildQuickCmds();
        sp.querySelector('#lm-qcmd').addEventListener('change', function () { prefs.quickCmds = this.checked; savePrefs(); buildQuickCmds(); });
        sp.querySelector('#lm-mbbtn').addEventListener('change', function () { prefs.mbButton = this.checked; savePrefs(); buildMbButton(); if (typeof repositionButtons === 'function') repositionButtons(); });
        sp.querySelector('#lm-pingbtn').addEventListener('change', function () { prefs.pingBtn = this.checked; savePrefs(); buildPingButton(); });
        sp.querySelector('#lm-netgraph').addEventListener('change', function () { prefs.netGraph = this.checked; savePrefs(); syncNetGraph(); });

        /* ── RIGHT side: SPLIT + FEED (positioned by JS relative to minimap) ── */
        var rootR = mk('div'); rootR.id = 'lm-mc-r';
        document.body.appendChild(rootR);

        var bSplit = mkb('⚔', 'SPLIT', false);
        var bFeed = mkb('⬤', 'FEED', false);
        rootR.appendChild(bSplit);
        rootR.appendChild(bFeed);

        /* ── SMALL ROW: 4× + 16× (positioned by JS above minimap) ── */
        var smallR = mk('div'); smallR.id = 'lm-mc-sm';
        document.body.appendChild(smallR);

        var bDbl = mks('4×');
        var b16 = mks('16×');
        smallR.appendChild(bDbl);
        smallR.appendChild(b16);
        /* optional multibox swap (Tab on desktop): adds the second player, then swaps focus */
        var bMb = null;
        function buildMbButton() {
            if (bMb && bMb.parentNode) bMb.parentNode.removeChild(bMb);
            bMb = null;
            if (!prefs.mbButton) return;
            bMb = mkd('\u21C4');
            bMb.addEventListener('touchstart', function (e) {
                e.preventDefault(); e.stopPropagation();
                debounced(function () {
                    if (typeof application !== 'undefined' && application && typeof application.multiboxswap === 'function') application.multiboxswap();
                }, 'mbswap', 400);
            }, { passive: false });
            /* in the left row (the 4x/16x row above the minimap could reach over SPLIT) */
            drawer.insertBefore(bMb, bCfg);
        }
        buildMbButton();
        /* optional team ping (the desktop ping hotkeys): tap = "Go here"; hold (or slide) opens a
         * 4-way choice, slide the thumb towards one and lift to send it (lifting without sliding
         * sends nothing). The ping goes where the joystick aims. */
        var bPing = null, pingRad = null;
        var PING_DIRS = [[5, 0, -1, '\u271A Help'], [6, -1, 0, '\u26A0 Danger'], [7, 1, 0, '\u279C Go here'], [8, 0, 1, '\u2739 Virus here']];
        function sendPing(type) {
            if (typeof application !== 'undefined' && application && typeof application.sendTeamPing === 'function') application.sendTeamPing(type);
        }
        function buildPingButton() {
            if (bPing && bPing.parentNode) bPing.parentNode.removeChild(bPing);
            if (pingRad && pingRad.parentNode) pingRad.parentNode.removeChild(pingRad);
            bPing = null; pingRad = null;
            if (!prefs.pingBtn) return;
            var b = bPing = mkd('\uD83D\uDCCD');
            var rad = pingRad = mk('div'); rad.id = 'lm-ping-rad';
            rad.style.cssText = 'position:fixed;display:none;z-index:100002;pointer-events:none;width:0;height:0';
            var items = PING_DIRS.map(function (d) {
                var it = mk('div');
                it.textContent = d[3];
                it.style.cssText = 'position:absolute;transform:translate(-50%,-50%);left:' + (d[1] * 64) + 'px;top:' + (d[2] * 46) + 'px;' +
                    'white-space:nowrap;padding:6px 10px;border-radius:14px;font:700 13px Ubuntu,Roboto,sans-serif;color:#fff;' +
                    'background:rgba(0,36,62,.88);border:1.5px solid rgba(1,217,204,.35)';
                rad.appendChild(it);
                return it;
            });
            document.body.appendChild(rad);
            var tid = null, sx = 0, sy = 0, holdT = 0, open = false, pick = 0;
            function openRad() {
                if (open || tid === null) return;
                open = true;
                clearTimeout(holdT);
                /* kept on screen: near the bottom edge it is drawn a little above the thumb */
                rad.style.left = Math.max(115, Math.min(window.innerWidth - 115, sx)) + 'px';
                rad.style.top = Math.max(70, Math.min(window.innerHeight - 70, sy)) + 'px';
                rad.style.display = 'block';
            }
            function setPick(x, y) {
                var dx = x - sx, dy = y - sy;
                pick = 0;
                if (dx * dx + dy * dy >= 256) pick = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 6 : 7) : (dy < 0 ? 5 : 8);
                items.forEach(function (it, i) { it.style.background = PING_DIRS[i][0] === pick ? 'rgba(1,160,150,.95)' : 'rgba(0,36,62,.88)'; });
            }
            function findT(e) {
                for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === tid) return e.changedTouches[i];
                return null;
            }
            function finish(send) {
                clearTimeout(holdT);
                var wasOpen = open, p = pick;
                tid = null; open = false; pick = 0;
                rad.style.display = 'none';
                b.classList.remove('p');
                if (!send) return;
                if (!wasOpen) sendPing(7);
                else if (p) sendPing(p);
            }
            b.addEventListener('touchstart', function (e) {
                e.preventDefault(); e.stopPropagation();
                if (tid !== null) return;
                var t = e.changedTouches[0];
                tid = t.identifier; sx = t.clientX; sy = t.clientY; open = false;
                setPick(sx, sy);
                b.classList.add('p');
                holdT = setTimeout(openRad, 350);
            }, { passive: false });
            b.addEventListener('touchmove', function (e) {
                var t = findT(e);
                if (!t) return;
                e.preventDefault();
                var dx = t.clientX - sx, dy = t.clientY - sy;
                if (!open && dx * dx + dy * dy >= 256) openRad();
                if (open) setPick(t.clientX, t.clientY);
            }, { passive: false });
            b.addEventListener('touchend', function (e) {
                var t = findT(e);
                if (!t) return;
                e.preventDefault();
                if (open) setPick(t.clientX, t.clientY);
                finish(true);
            }, { passive: false });
            b.addEventListener('touchcancel', function (e) { if (findT(e)) finish(false); }, { passive: true });
            drawer.insertBefore(b, bCfg);
        }
        buildPingButton();
        /* net graph (the desktop hotkey), kept in step with the setting */
        function syncNetGraph() {
            if (typeof window.lmToggleNetGraph === 'function' && !!window._lmNetGraph !== prefs.netGraph) window.lmToggleNetGraph();
        }
        if (prefs.netGraph) {
            (function waitNetGraph(n) {
                if (typeof window.lmToggleNetGraph === 'function') syncNetGraph();
                else if (n > 0) setTimeout(function () { waitNetGraph(n - 1); }, 500);
            })(60);
        }

        var jO = mk('div'); jO.className = 'lm-jo'; document.body.appendChild(jO);
        var jI = mk('div'); jI.className = 'lm-ji'; document.body.appendChild(jI);

        var zP = mk('div'); zP.className = 'lm-z'; document.body.appendChild(zP);
        var zT = null;

        var cBar = mk('div'); cBar.id = 'lm-cb';
        cBar.innerHTML = '';
        document.body.appendChild(cBar);

        /* apply initial prefs */
        applyPrefs();

        /* ── Press effects ── */
        [bMenu, bChat, bSplit, bFeed, bDbl, b16, bAI, bPaus, bRwd, bFwd].forEach(function (b) {
            b.addEventListener('touchstart', function () { b.classList.add('p'); }, { passive: true });
            b.addEventListener('touchend', function () { b.classList.remove('p'); }, { passive: true });
            b.addEventListener('touchcancel', function () { b.classList.remove('p'); }, { passive: true });
        });

        /* ═══════════════════════════════════════════════════════
         *  MENU — toggles helloContainer (show/hide game menu)
         * ═══════════════════════════════════════════════════════ */
        bMenu.addEventListener('touchstart', function (e) {
            e.preventDefault();
            // Restore opacity immediately so button responds on first tap
            rootL.style.opacity = prefs.btnOpacity;
            var hc = document.getElementById('helloContainer');
            if (hc) {
                /* jQuery show() leaves display '' on a visible menu: judge by #overlays too */
                if (hc.style.display === 'none' || !isMenuVisible()) {
                    hc.style.display = 'block';
                    if (window._lm_fitHC) window._lm_fitHC(); /* scale instantly */
                    if (typeof application !== 'undefined' && application.showMenu) {
                        application.showMenu();
                    }
                } else if (typeof application !== 'undefined' && application.hideMenu) {
                    /* hides #overlays too: left visible it covers the canvas and blocks the joystick */
                    application.hideMenu();
                } else {
                    hc.style.display = 'none';
                }
            } else {
                emitKey(27); // fallback: ESC
            }
        }, { passive: false });

        /* (fullscreen toggled via goFullscreenLandscape on Play button tap) */

        /* ═══════════════════════════════════════════════════════
         *  BUTTON DEBOUNCE — prevents accidental double-fires
         * ═══════════════════════════════════════════════════════ */
        /* One shared 150 ms window dropped real taps: a fast second Split, or Split then 4x.
         * A finger cannot fire touchstart twice, so keep a separate time per button: 40 ms for
         * Split, 150 ms for 4x/16x (a 16-way split must not fire twice). */
        var lastActionByKey = {};
        var DEBOUNCE = 150; // ms (default)
        function debounced(fn, key, ms) {
            var now = Date.now();
            key = key || 'any';
            ms = ms || DEBOUNCE;
            if (now - (lastActionByKey[key] || 0) < ms) return;
            lastActionByKey[key] = now;
            fn();
        }

        /* ═══════════════════════════════════════════════════════
         *  SPLIT — Space (keyCode 32)
         * ═══════════════════════════════════════════════════════ */
        bSplit.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (prefs.tapHaptic) vibrate(10);
            /* call the split command directly: Space follows the player's hotkey map, which
             * imported desktop settings may have changed */
            debounced(function () {
                if (typeof application !== 'undefined' && application.split) application.split();
                else emitKey(32);
            }, 'split', 40);
        }, { passive: false });

        /* ═══════════════════════════════════════════════════════
         *  DOUBLE SPLIT — calls application.doubleSplit()
         * ═══════════════════════════════════════════════════════ */
        bDbl.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            debounced(function () {
                if (typeof application !== 'undefined' && application.doubleSplit)
                    application.doubleSplit();
            }, 'dbl');
        }, { passive: false });

        /* ═══════════════════════════════════════════════════════
         *  SPLIT 16 — calls application.split16()
         * ═══════════════════════════════════════════════════════ */
        b16.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            debounced(function () {
                if (typeof application !== 'undefined' && application.split16)
                    application.split16();
            }, 's16');
        }, { passive: false });

        /* ═══════════════════════════════════════════════════════
         *  AUTOPLAY — calls application.setAutoPlay()
         * ═══════════════════════════════════════════════════════ */
        bAI.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.setAutoPlay) {
                application.setAutoPlay();
                syncAiPause();
            }
        }, { passive: false });

        // setAutoPlay/setPause change each other's state and the J/R hotkeys change
        // them too, so highlight both buttons from the real state, not by toggling.
        function syncAiPause() {
            bAI.classList.toggle('lm-active', !!window.autoPlay);
            bPaus.classList.toggle('lm-active', typeof application !== 'undefined' && !!application.pause);
            var rp = replayBarShown(), rd = rp ? '' : 'none';
            if (bRwd.style.display !== rd) { bRwd.style.display = rd; bFwd.style.display = rd; }
            if (!rp) return;
            bPaus.classList.toggle('lm-active', !!window._lmReplayPaused);
            /* the replay bar seeks on mousedown: a touch seeks the same way */
            var rb = document.getElementById('lm-replay-bar');
            if (rb && !rb._lmTouch) {
                rb._lmTouch = true;
                rb.addEventListener('touchstart', function (e) {
                    var t = e.changedTouches && e.changedTouches[0];
                    if (!t) return;
                    e.preventDefault(); e.stopPropagation();
                    rb.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: t.clientX, clientY: t.clientY }));
                }, { passive: false });
            }
        }
        /* a replay is playing while its progress bar shows */
        function replayBarShown() {
            var rb = document.getElementById('lm-replay-bar');
            return !!(rb && rb.style.display !== 'none' && rb.getClientRects().length);
        }
        /* background timers skip work while the tab is hidden */
        setInterval(function () { if (!document.hidden) syncAiPause(); }, 500);

        /* ═══════════════════════════════════════════════════════
         *  PAUSE — calls application.setPause()
         * ═══════════════════════════════════════════════════════ */
        bPaus.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            /* setPause does nothing for a replay: pause or resume the replay instead */
            if (replayBarShown() && typeof window.lmReplayTogglePause === 'function') {
                window.lmReplayTogglePause();
                syncAiPause();
                return;
            }
            if (typeof application !== 'undefined' && application.setPause) {
                application.setPause();
                syncAiPause();
            }
        }, { passive: false });
        [[bRwd, -250], [bFwd, 250]].forEach(function (r) {
            r[0].addEventListener('touchstart', function (e) {
                e.preventDefault(); e.stopPropagation();
                if (replayBarShown() && typeof window.lmReplaySeek === 'function') window.lmReplaySeek(r[1]);
            }, { passive: false });
        });

        /* ═══════════════════════════════════════════════════════
         *  FEED — W (keyCode 87), hold to repeat
         * ═══════════════════════════════════════════════════════ */
        var feedIv = null;
        var feedMacroOn = false;
        /* Use the game's own macro feed: it follows the player's feed-speed setting (this fed a
         * fixed 20/s), pauses in a hidden tab, and is the real feed command even if W was
         * rebound. The old 50 ms key loop stays as a fallback. */
        function feedStart() {
            if (typeof application !== 'undefined' && application.macroFeed) {
                feedMacroOn = true;
                application.macroFeed(true);
                return;
            }
            emitKey(87);
            /* A second finger on the button must not orphan the running interval. */
            clearInterval(feedIv);
            feedIv = setInterval(function () { emitKey(87); }, 50);
        }
        function feedStop() {
            if (feedMacroOn && typeof application !== 'undefined' && application.macroFeed) application.macroFeed(false);
            feedMacroOn = false;
            clearInterval(feedIv); feedIv = null;
        }
        window._lmMobileFeedStop = feedStop;
        bFeed.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (prefs.tapHaptic) vibrate(10);
            feedStart();
        }, { passive: false });
        bFeed.addEventListener('touchend', function (e) {
            /* Keep feeding while another finger still rests on the button. */
            if (e && e.targetTouches && e.targetTouches.length > 0) return;
            feedStop();
        }, { passive: true });
        bFeed.addEventListener('touchcancel', function () { feedStop(); }, { passive: true });
        /* also stop when the tab is hidden (touchend may never arrive) */
        document.addEventListener('visibilitychange', function () { if (document.hidden) feedStop(); });

        /* (game menu is accessed via the drawer — ☰ now only toggles the drawer) */

        /* ═══════════════════════════════════════════════════════
         *  CHAT — Enter (keyCode 13)
         * ═══════════════════════════════════════════════════════ */
        var chatOn = false;

        bChat.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            chatOn ? chatClose() : chatOpen();
        }, { passive: false });

        /* One Enter listener at a time: closing chat with the 💬 button left the old one
         * attached, and chatClose's own synthetic Enter then ran chatClose again. */
        var chatEnterFn = null;
        function chatOpen() {
            chatOn = true;
            // Open chat box — dispatch Enter on document to open game's chat
            emitKey(13);
            // Focus immediately (user gesture context) for Firefox
            var inp = document.getElementById('message');
            if (inp) {
                inp.focus();
            }
            // Re-focus after game finishes setup + add Enter handler
            setTimeout(function () {
                var inp2 = document.getElementById('message');
                if (inp2) {
                    inp2.focus();
                    if (chatEnterFn) inp2.removeEventListener('keydown', chatEnterFn);
                    chatEnterFn = function onEnter(ev) {
                        if (ev.keyCode === 13 || ev.key === 'Enter') {
                            inp2.removeEventListener('keydown', onEnter);
                            chatEnterFn = null;
                            setTimeout(function () { chatClose(); }, 50);
                        }
                    };
                    inp2.addEventListener('keydown', chatEnterFn);
                }
            }, 120);
        }

        function chatClose() {
            var inp = document.getElementById('message');
            /* first, before the synthetic Enter below: it must not reach a leftover listener */
            if (chatEnterFn && inp) inp.removeEventListener('keydown', chatEnterFn);
            chatEnterFn = null;
            if (inp && inp.value.length > 0) {
                // Send the message by dispatching Enter on the input
                var ev = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', keyCode: 13, which: 13 });
                inp.dispatchEvent(ev);
            }
            if (inp) inp.blur();
            chatOn = false;

            /* LW: After 50ms, check if the game's chat UI is still visible.
             * Mobile keyboard "OK" sends the message but the chat box stays open
             * because the game expects a document-level Enter to close it. */
            setTimeout(function () {
                var msgBox = document.getElementById('message');
                if (msgBox && (msgBox.offsetParent !== null || msgBox.offsetHeight > 0)) {
                    emitKey(13);
                }
            }, 50);
        }

        // Tap canvas while chatting → send & close
        canvas.addEventListener('touchstart', function (e) {
            if (chatOn) {
                e.preventDefault();
                chatClose();
            }
        }, { passive: false });

        /* (fullscreen toggle handled by bFull listener above) */

        /* ═══════════════════════════════════════════════════════
         *  SWIPE GESTURES (left half of canvas)
         *  swipe right → split | swipe up → double split
         * ═══════════════════════════════════════════════════════ */
        /* Every single-finger canvas touch is also the joystick, so a swipe only counts when the
         *  "Flick split" setting is on (off by default) and the finger is lifted quickly: a normal
         *  steering drag is held longer than SW_MAX_MS and never splits. */
        var swStart = null;
        var swFiredAt = 0; /* last flick split (Stop on release waits for its second split) */
        var SW_THRESH = 50; // min px to count as swipe
        var SW_MAX_MS = 250; // a flick: lifted within this time
        canvas.addEventListener('touchstart', function (e) {
            if (chatOn || e.targetTouches.length !== 1 || !prefs.swipeSplit) { swStart = null; return; }
            var t = e.changedTouches[0];
            if (t.clientX < window.innerWidth * 0.5) {
                swStart = { x: t.clientX, y: t.clientY, id: t.identifier, t: Date.now() };
            } else {
                swStart = null;
            }
        }, { passive: true });

        canvas.addEventListener('touchend', function (e) {
            if (!swStart) return;
            for (var i = 0; i < e.changedTouches.length; i++) {
                var t = e.changedTouches[i];
                if (t.identifier !== swStart.id) continue;
                var dx = t.clientX - swStart.x;
                var dy = t.clientY - swStart.y;
                if (!prefs.swipeSplit || Date.now() - swStart.t > SW_MAX_MS) { swStart = null; break; }
                // swipe right → split
                if (dx > SW_THRESH && Math.abs(dy) < dx) {
                    swFiredAt = Date.now();
                    /* like the Split button: Space can be remapped by imported hotkeys */
                    if (typeof application !== 'undefined' && application && typeof application.split === 'function') application.split(); else emitKey(32);
                }
                // swipe up → double split
                else if (-dy > SW_THRESH && Math.abs(dx) < -dy) {
                    swFiredAt = Date.now();
                    if (typeof application !== 'undefined' && application.doubleSplit)
                        application.doubleSplit();
                }
                swStart = null;
                break;
            }
        }, { passive: true });

        /* ═══════════════════════════════════════════════════════
         *  JOYSTICK — direction persists after finger lift
         *  (targetTouches: only fingers on the canvas; a thumb on FEED/SPLIT must not
         *   freeze steering or start a pinch-zoom)
         * ═══════════════════════════════════════════════════════ */
        var org = { x: 0, y: 0 }; // joystick origin
        var jId = null;
        var asp = window.innerWidth / window.innerHeight;
        // JS sensitivity now comes from prefs (live-updated by slider)
        var JR = 55;

        window.addEventListener('resize', function () {
            asp = window.innerWidth / window.innerHeight;
            /* rotated with the thumb down: the old centre is in the other orientation's
             * coordinates (the cell jumped to a wrong direction) - start again on the next touch */
            if (jId !== null) { jId = null; jHide(); }
            pOn = false;
        });

        canvas.addEventListener('touchstart', function (e) {
            if (chatOn || e.targetTouches.length !== 1) return;
            var t = e.changedTouches[0];
            jId = t.identifier;
            jStartTime = Date.now();
            org.x = t.clientX; org.y = t.clientY;
            /* no mouseAt(thumb position) here: it turned the cell toward wherever the thumb
             * landed (usually bottom-left) on every re-grip; keep the last direction until the
             * thumb moves */
            
            jShow(org.x, org.y, org.x, org.y);
            /* swStart is kept: the swipe touchend decides by duration (this listener runs after the swipe one) */
        }, { passive: true });

        canvas.addEventListener('touchend', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === jId) {
                    jId = null;
                    jHide();
                    /* optional (like agar.io "Stop on Release"): point at the screen centre, where the cell is */
                    if (prefs.stopOnRelease) {
                        if (Date.now() - swFiredAt < 50) {
                            /* a flick split just fired: its second (double) split is sent ~40 ms later
                             * toward the current pointer, so centre after it; skip if the thumb is back */
                            setTimeout(function () { if (jId === null) mouseAt(window.innerWidth / 2, window.innerHeight / 2); }, 120);
                        } else mouseAt(window.innerWidth / 2, window.innerHeight / 2);
                    }
                    break;
                }
            }
        }, { passive: true });

        canvas.addEventListener('touchcancel', function () {
            jId = null;
            jHide();
            /* system gesture / call during a pinch left it on (stale zoom jump, frozen steering) */
            pOn = false; pDist = 0; swStart = null;
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            /* a second finger resting on the canvas (missed Split) froze the steering; the
             * joystick finger is found by id, so only an actual pinch stops it */
            if (pOn) return;
            var t = tById(e.changedTouches, jId);
            if (!t) return;

            // Both modes use virtual joystick scaling
            var rx0 = t.clientX - org.x, ry0 = t.clientY - org.y;
            var rawD = Math.sqrt(rx0 * rx0 + ry0 * ry0);
            if (rawD < 8) return;

            var dx = rx0 * prefs.jsSensitivity;
            var dy = ry0 * prefs.jsSensitivity;
            /* no "/ asp": the game maps both cursor axes with the same scale
             * (screenDX / viewScale, screenDY / viewScale), so dividing x by the screen aspect
             * bent every diagonal toward vertical (45 deg became about 65 deg on a 20:9 phone) */
            var cx = window.innerWidth / 2 + dx;
            var cy = window.innerHeight / 2 + dy;
            mouseAt(cx, cy);

            var rx = t.clientX - org.x, ry = t.clientY - org.y;
            var d = Math.sqrt(rx * rx + ry * ry);
            if (d > JR) {
                var a = Math.atan2(ry, rx);
                jShow(org.x, org.y, org.x + Math.cos(a) * JR, org.y + Math.sin(a) * JR);
            } else {
                jShow(org.x, org.y, t.clientX, t.clientY);
            }
        }, { passive: true });

        /* ═══════════════════════════════════════════════════════
         *  PINCH-TO-ZOOM  (dual mode)
         *    Menu visible  → scale HUD  (hudScale, 0.3 – 1.0)
         *    In-game       → zoom map   (WheelEvent)
         *    Spread fingers = zoom IN for both
         * ═══════════════════════════════════════════════════════ */
        var pDist = 0, pOn = false;
        var jStartTime = 0; /* when the steering finger touched down (set in the joystick touchstart) */

        function isMenuVisible() {
            var ov = document.getElementById('overlays');
            if (!ov) return false;
            if (ov.style.display === 'none') return false;
            // overlays is hidden via .stop().hide() when in-game
            return ov.offsetParent !== null || ov.offsetHeight > 0;
        }

        canvas.addEventListener('touchstart', function (e) {
            if (e.targetTouches.length === 2) {
                /* A second finger that only missed the Split button stopped the steering.
                 * Pinch only when both fingers came down together (within 200 ms). */
                if (jId !== null && Date.now() - jStartTime > 200) return;
                pOn = true;
                pDist = dist(e.targetTouches[0], e.targetTouches[1]);
                jHide(); jId = null;
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', function (e) {
            if (!(e.targetTouches.length === 2 && pOn)) return;
            e.preventDefault();
            var nd = dist(e.targetTouches[0], e.targetTouches[1]);
            var delta = nd - pDist;   // >0 = spread, <0 = pinch
            if (Math.abs(delta) > 4) {
                if (isMenuVisible()) {
                    /* ── HUD scale mode ── */
                    var step = delta * 0.003;
                    if (typeof defaultSettings !== 'undefined' && defaultSettings.hudScale !== undefined) {
                        var ns = Math.min(1, Math.max(0.3, defaultSettings.hudScale + step));
                        defaultSettings.hudScale = ns;
                        if (typeof ogario !== 'undefined') ogario.hudScale = ns;
                        if (typeof ogarhusettings === 'function') ogarhusettings();
                        zP.textContent = '🔍 HUD ' + Math.round(ns * 100) + '%';
                    }
                } else {
                    /* ── Map zoom mode ── */
                    var cx = (e.targetTouches[0].clientX + e.targetTouches[1].clientX) / 2;
                    var cy = (e.targetTouches[0].clientY + e.targetTouches[1].clientY) / 2;
                    // spread (delta>0) → positive deltaY → zoom in (ogario convention)
                    wheel(canvas, delta * 2, cx, cy);
                    zP.textContent = delta > 0 ? '🔍 +' : '🔍 −';
                }
                pDist = nd;
                zP.classList.add('on');
                clearTimeout(zT);
                zT = setTimeout(function () { zP.classList.remove('on'); }, 400);
            }
        }, { passive: false });

        canvas.addEventListener('touchend', function (e) {
            if (e.targetTouches.length < 2) {
                /* pinch over with one finger still down: that finger steers again */
                if (pOn && e.targetTouches.length === 1 && jId === null && !chatOn) {
                    var t = e.targetTouches[0];
                    jId = t.identifier;
                    org.x = t.clientX; org.y = t.clientY;
                    jShow(org.x, org.y, org.x, org.y);
                }
                pOn = false; pDist = 0;
            }
        }, { passive: true });

        /* ═══════════════════════════════════════════════════════
         *  HAPTIC FEEDBACK
         * ═══════════════════════════════════════════════════════ */
        function vibrate(pattern) {
            /* "No vibration": the phone buzzed on every death and chat message with no way to stop it */
            if (prefs.muteVibration && pattern !== 10) return; /* 10 ms = the opt-in Split/Feed tap */
            try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { }
        }

        /* Death / losing — watch #stats becoming visible */
        (function () {
            var statsEl = document.getElementById('stats');
            if (!statsEl) return;
            var wasHidden = statsEl.style.display === 'none' || !statsEl.offsetParent;
            new MutationObserver(function () {
                var isVisible = statsEl.style.display !== 'none' && statsEl.offsetParent !== null;
                if (isVisible && wasHidden) {
                    vibrate([100, 50, 100]); // double buzz — "ouch"
                }
                wasHidden = !isVisible;
            }).observe(statsEl, { attributes: true, attributeFilter: ['style', 'class'] });
        })();

        /* New chat message — watch #messages for new children */
        (function () {
            var msgList = document.getElementById('messages');
            if (!msgList) return;
            new MutationObserver(function (mutations) {
                for (var i = 0; i < mutations.length; i++) {
                    if (mutations[i].addedNodes.length > 0) {
                        vibrate([30, 20, 30]); // light double tap
                        break;
                    }
                }
            }).observe(msgList, { childList: true });
        })();

        /* ═══════════════════════════════════════════════════════
         *  MINIMAP TAP-TO-TOGGLE (70% ↔ 100%)
         * ═══════════════════════════════════════════════════════ */
        (function () {
            var mm = document.getElementById('minimap-hud');
            if (!mm) return;
            var expanded = false;
            // The mobile stylesheet uses !important, so inline writes must be !important too
            mm.style.setProperty('pointer-events', 'auto', 'important');
            mm.addEventListener('touchstart', function (e) {
                e.stopPropagation();
                expanded = !expanded;
                // collapse back to the base scale (0.5, or the tablet value set by tabletAware)
                mm.style.setProperty('transform', expanded ? 'scale(1)' : 'scale(' + (mm.dataset.lmBaseScale || '0.5') + ')', 'important');
            }, { passive: true });
        })();


        /* HUD auto-fade removed — only mobile buttons fade, not leaderboard/teamboard/minimap */

        /* ═══════════════════════════════════════════════════════
         *  HELPERS
         * ═══════════════════════════════════════════════════════ */
        function mk(tag) { return document.createElement(tag); }

        function mkb(icon, label, isUtil) {
            var b = mk('div');
            b.className = 'lm-b ' + (isUtil ? 'lm-u' : 'lm-a');
            if (label)
                b.innerHTML = '<div class="lm-bi"><span class="i">' + icon + '</span><span class="l">' + label + '</span></div>';
            else
                b.textContent = icon;
            return b;
        }

        function mks(icon) {
            var b = mk('div');
            b.className = 'lm-b lm-s';
            b.textContent = icon;
            return b;
        }

        /**
         * Emit keydown + keyup on document.
         * Uses Object.defineProperty to FORCE keyCode / which values,
         * because some browsers ignore them from the KeyboardEvent constructor.
         * ogario's getPressedKey() reads event.keyCode via a switch statement.
         */
        function emitKey(kc) {
            fire('keydown', kc);
            fire('keyup', kc);
        }

        function fire(type, kc) {
            var ev;
            try {
                ev = new KeyboardEvent(type, {
                    bubbles: true, cancelable: true, view: window
                });
            } catch (e) {
                ev = document.createEvent('KeyboardEvent');
                ev.initEvent(type, true, true);
            }
            // Force keyCode and which — this is the critical fix
            Object.defineProperty(ev, 'keyCode', { get: function () { return kc; } });
            Object.defineProperty(ev, 'which', { get: function () { return kc; } });
            Object.defineProperty(ev, 'key', { get: function () { return kn(kc); } });
            document.dispatchEvent(ev);
        }

        function kn(c) {
            return c === 13 ? 'Enter' : c === 27 ? 'Escape' : c === 32 ? ' ' : String.fromCharCode(c);
        }

        function mouseAt(x, y) {
            canvas.dispatchEvent(new MouseEvent('mousemove', {
                clientX: x, clientY: y, bubbles: true, cancelable: true
            }));
        }

        function wheel(t, dy, cx, cy) {
            var o = { deltaY: dy, deltaMode: 0, clientX: cx, clientY: cy, bubbles: true, cancelable: true };
            t.dispatchEvent(new WheelEvent('wheel', o));
            o.detail = dy > 0 ? 1 : -1;
            t.dispatchEvent(new WheelEvent('mousewheel', o));
            // Firefox: game listens for DOMMouseScroll on document (ogario.v4.js:15358)
            try {
                var ff = new Event('DOMMouseScroll', {bubbles:true, cancelable:true});
                /* same as the Chrome path: there the game reads wheelDelta (= -deltaY) / -120,
                 * i.e. dy / 120. A full +-1 step with the opposite sign zoomed the wrong way and
                 * far too fast on Firefox. */
                ff.detail = dy / 120;
                ff.axis = 2; // vertical
                document.dispatchEvent(ff);
            } catch(e) {}
        }

        function dist(a, b) {
            var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }

        function tById(list, id) {
            if (id === null) return null;
            for (var i = 0; i < list.length; i++) if (list[i].identifier === id) return list[i];
            return null;
        }

        function jShow(ox, oy, ix, iy) {
            jO.style.display = 'block'; jO.style.left = ox + 'px'; jO.style.top = oy + 'px';
            jI.style.display = 'block'; jI.style.left = ix + 'px'; jI.style.top = iy + 'px';
        }
        function jHide() { jO.style.display = 'none'; jI.style.display = 'none'; }

        /* inputs keep their long-press menu (paste a party code / nick) */
        document.addEventListener('contextmenu', function (e) { if (!e.target || !/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) e.preventDefault(); });
        document.body.addEventListener('touchmove', function (e) {
            if (e.target === canvas || e.target === document.body) e.preventDefault();
        }, { passive: false });

        console.log('%c LM Mobile v4.0 %c Touch controls loaded ',
            'background:linear-gradient(135deg,#01d9cc,#00243e);color:#fff;font-weight:bold;padding:4px 10px;border-radius:4px 0 0 4px;font-family:Ubuntu,sans-serif',
            'background:#00243e;color:#01d9cc;padding:4px 10px;border-radius:0 4px 4px 0;font-family:Ubuntu,sans-serif');

        /* (double-tap split removed — user preference) */

        /* ═══════════════════════════════════════════════════════
         *  AUTO-HIDE LEFT BUTTONS DURING GAMEPLAY
         *  Fade to 10% when touching canvas, restore after 3s idle
         * ═══════════════════════════════════════════════════════ */
        var _fadeTimer = null;
        rootL.style.transition = 'opacity .4s ease';

        canvas.addEventListener('touchstart', function () {
            if (isMenuVisible()) return;
            rootL.style.opacity = '0.35';
            if (_fadeTimer) clearTimeout(_fadeTimer);
            _fadeTimer = setTimeout(function () {
                rootL.style.opacity = prefs.btnOpacity;
            }, 3000);
        }, { passive: true });
        canvas.addEventListener('touchend', function () {
            if (_fadeTimer) clearTimeout(_fadeTimer);
            _fadeTimer = setTimeout(function () {
                rootL.style.opacity = prefs.btnOpacity;
            }, 3000);
        }, { passive: true });
        // Any button tap instantly restores full opacity
        [bMenu, bChat, bAI, bPaus].forEach(function (b) {
            b.addEventListener('touchstart', function () {
                rootL.style.opacity = prefs.btnOpacity;
                if (_fadeTimer) clearTimeout(_fadeTimer);
            }, { passive: true });
        });

        /* ═══════════════════════════════════════════════════════
         *  COMPACT STATS OVERLAY + CONNECTION DOT
         *  Replaces verbose #stats-hud with "mass · cells/16 🟢 42ms"
         *  Tap to expand shows original full stats
         * ═══════════════════════════════════════════════════════ */
        (function compactStats() {
            var mStats = mk('div');
            mStats.id = 'lm-stats';
            document.body.appendChild(mStats);

            var massSpan = mk('span');
            var dot = mk('span');
            dot.style.cssText = 'margin-left:6px;opacity:.8';
            mStats.appendChild(massSpan);
            mStats.appendChild(dot);

            var expanded = false;
            mStats.addEventListener('touchstart', function (e) {
                e.preventDefault();
                var orig = document.getElementById('stats-hud');
                if (orig) {
                    expanded = !expanded;
                    orig.style.setProperty('display', expanded ? 'block' : 'none', 'important');
                }
            }, { passive: false });

            setInterval(function () {
                // Mass + cells
                var mass = 0, cells = 0, maxCells = 16;
                if (typeof ogario !== 'undefined') mass = ogario.playerMass || 0;
                else if (typeof legendmod !== 'undefined') mass = legendmod.playerMass || 0;
                if (typeof legendmod !== 'undefined' && legendmod.playerCells)
                    cells = legendmod.playerCells.length;
                else if (typeof LM !== 'undefined' && LM.playerCells)
                    cells = LM.playerCells.length;

                /* write only on change (500 ms timer; an unchanged write still relayouts) */
                var massText = mass > 0 ? mass + ' \u00b7 ' + cells + '/' + maxCells : '';
                if (massSpan.textContent !== massText) massSpan.textContent = massText;

                // Ping
                var ping = -1;
                if (typeof window.pingTime !== 'undefined') ping = window.pingTime;
                else if (typeof ogario !== 'undefined' && ogario.ping) ping = ogario.ping;
                else if (typeof connection !== 'undefined' && connection.ping) ping = connection.ping;

                var dotText = '';
                if (ping >= 0) {
                    var icon = ping <= 80 ? '\ud83d\udfe2' : ping <= 200 ? '\ud83d\udfe1' : '\ud83d\udd34';
                    dotText = icon + ' ' + Math.round(ping) + 'ms';
                }
                if (dot.textContent !== dotText) dot.textContent = dotText;
            }, 500);
        })();

        /* ═══════════════════════════════════════════════════════
         *  DYNAMIC BUTTON POSITIONING (collision-free)
         *  Reads minimap's actual position and places buttons
         *  relative to it. Adapts to any screen size.
         * ═══════════════════════════════════════════════════════ */
        function repositionButtons() {
            var mm = document.getElementById('minimap-hud');
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var GAP = 8;

            if (mm) {
                var r = mm.getBoundingClientRect();
                // Sanity: skip if rect is clearly stale (0-sized or off-screen)
                if (r.width < 10 || r.height < 10 || r.right < 0 || r.bottom < 0) return;

                // SPLIT/FEED: column to LEFT of minimap, bottom-aligned at 4px
                var rRight = vw - r.left + GAP;
                rootR.style.right = rRight + 'px';
                rootR.style.bottom = '4px';

                // 4×/16×: row ABOVE minimap, aligned to right edge
                var smBottom = vh - r.top + 6;
                smallR.style.right = Math.max(4, vw - r.right) + 'px';
                smallR.style.left = 'auto';
                smallR.style.bottom = smBottom + 'px';
            } else {
                // Fallback: minimap not found
                rootR.style.right = '14px';
                rootR.style.bottom = '4px';
                smallR.style.right = '14px';
                smallR.style.left = 'auto';
                smallR.style.bottom = '160px';
            }
        }
        repositionButtons();
        setInterval(function () { if (!document.hidden) repositionButtons(); }, 2500);
        window.addEventListener('resize', repositionButtons);
        window.addEventListener('orientationchange', function () {
            /* Single rAF ensures layout is complete after rotation */
            requestAnimationFrame(function() {
                repositionButtons();
                /* Second pass after browser settles */
                requestAnimationFrame(repositionButtons);
            });
        });

        /* ═══════════════════════════════════════════════════════
         *  TWA DETECTION (Google Play WebView)
         * ═══════════════════════════════════════════════════════ */
        var isTWA = (window.matchMedia('(display-mode: standalone)').matches ||
            window.matchMedia('(display-mode: fullscreen)').matches ||
            navigator.standalone === true);

        /* ═══════════════════════════════════════════════════════
         *  FULLSCREEN ↔ MENU SYNC
         *  helloContainer hidden → enter fullscreen (always)
         *  helloContainer visible → exit fullscreen (browser only)
         * ═══════════════════════════════════════════════════════ */
        var _prevMenuVisible = isMenuVisible();
        /* Split/Feed/4x/16x sat above the menu (z-index) and ate its taps; hide them there */
        document.body.classList.toggle('lm-menu', !!_prevMenuVisible);
        setInterval(function () {
            var nowVisible = isMenuVisible();
            document.body.classList.toggle('lm-menu', !!nowVisible);
            if (nowVisible !== _prevMenuVisible) {
                /* show/hide the portrait overlay on play/death too, not only on rotation */
                checkOrientation();
                if (!nowVisible && !chatOn) {
                    // Menu just hidden (playing/spectating) → fullscreen + wake lock
                    goFullscreenLandscape();
                    // Keep screen on while playing
                    if ('wakeLock' in navigator) {
                        navigator.wakeLock.request('screen').then(function (wl) {
                            /* died before the lock was granted: the menu is up, do not keep the screen on */
                            if (isMenuVisible()) { try { wl.release(); } catch (e) { } return; }
                            window._lmWakeLock = wl;
                        }).catch(function () { });
                    }
                } else {
                    /* Menu appeared (died/opened). It no longer leaves fullscreen: getting back in
                     * needs a tap on Play, so with auto-respawn the phone stayed out of fullscreen
                     * (the browser's own back gesture still exits). A held Feed button stops here. */
                    if (typeof window._lmMobileFeedStop === 'function') window._lmMobileFeedStop();
                    // Release wake lock when not playing
                    if (window._lmWakeLock) {
                        try { window._lmWakeLock.release(); } catch (e) { }
                        window._lmWakeLock = null;
                    }
                }
                _prevMenuVisible = nowVisible;
            }
        }, 500);

        // Re-acquire wake lock when tab becomes visible again (browser releases it on hidden)
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible' && !isMenuVisible() && 'wakeLock' in navigator) {
                navigator.wakeLock.request('screen').then(function (wl) {
                    /* died before the lock was granted: the menu is up, do not keep the screen on */
                    if (isMenuVisible()) { try { wl.release(); } catch (e) { } return; }
                    window._lmWakeLock = wl;
                }).catch(function () { });
            }
        });

        /* ═══════════════════════════════════════════════════════
         *  TABLET-AWARE SIZING
         *  Screen ≥ 768px = tablet — less aggressive HUD scaling
         * ═══════════════════════════════════════════════════════ */
        (function tabletAware() {
            var minDim = Math.min(window.innerWidth, window.innerHeight);
            if (minDim >= 768) {
                // Tablet: use gentler scaling
                var huds = ['#leaderboard-hud', '#top5-hud', '#stats-hud', '#time-hud'];
                huds.forEach(function (sel) {
                    var el = document.querySelector(sel);
                    // the base scale comes from an !important stylesheet rule, not the inline style
                    if (el) el.style.setProperty('transform', 'scale(0.9)', 'important');
                });
                var mm = document.querySelector('#minimap-hud');
                if (mm) {
                    mm.dataset.lmBaseScale = '0.65';
                    mm.style.setProperty('transform', 'scale(0.65)', 'important');
                }
            }
        })();

        /* ═══════════════════════════════════════════════════════
         *  TAP CANVAS TO CLOSE DRAWER
         * ═══════════════════════════════════════════════════════ */
        document.addEventListener('touchstart', function (e) {
            /* the settings panel (opened by the gear) also closes when tapping elsewhere */
            if (!drawer.classList.contains('on') && !sp.classList.contains('on')) return;
            // If tap is outside the drawer, menu button, and settings panel — close
            if (rootL.contains(e.target)) return;
            drawer.classList.remove('on');
            sp.classList.remove('on');
            rootL.style.opacity = prefs.btnOpacity;
        }, { passive: true });

        /* ═══════════════════════════════════════════════════════
         *  KEYBOARD HANDLING (virtual keyboard shifts layout)
         * ═══════════════════════════════════════════════════════ */
        if ('visualViewport' in window) {
            window.visualViewport.addEventListener('resize', function () {
                var vv = window.visualViewport;
                var kbHeight = window.innerHeight - vv.height;
                /* the visible chat input is #message-box (#lm-cb is hidden): keep it above the
                 * keyboard where the keyboard only shrinks the visual viewport (iOS, new Chrome) */
                var mb = document.getElementById('message-box');
                if (kbHeight > 100) {
                    // Keyboard is open — shift chat bar above keyboard
                    cBar.style.bottom = kbHeight + 'px';
                    if (mb) mb.style.setProperty('bottom', (kbHeight + 8) + 'px', 'important');
                } else {
                    cBar.style.bottom = '';
                    if (mb) mb.style.removeProperty('bottom');
                }
            });
        }

        /* ═══════════════════════════════════════════════════════
         *  LOW-END DEVICE DETECTION
         *  Disable expensive effects on ≤ 4 CPU cores
         * ═══════════════════════════════════════════════════════ */
        (function lowEndCheck() {
            var cores = navigator.hardwareConcurrency || 4;
            if (cores <= 4) {
                window.LM_LOW_END = true;
                // Disable backdrop-filter (expensive on GPU-weak devices)
                var lowCss = document.createElement('style');
                lowCss.textContent = '.lm-b,.lm-u,.lm-s,#lm-sp{backdrop-filter:none!important;' +
                    '-webkit-backdrop-filter:none!important}';
                document.head.appendChild(lowCss);
                // foodSize is not forced here: defaultSettings is the user's theme and gets
                // saved, so a 4-core phone would permanently store foodSize 1.
                console.log('[LM Mobile] Low-end mode: ' + cores + ' cores, blur disabled');
            }
        })();

        /* ═══════════════════════════════════════════════════════
         *  DARK STATUS BAR + THEME COLOR
         * ═══════════════════════════════════════════════════════ */
        (function setThemeColor() {
            var tc = document.querySelector('meta[name="theme-color"]');
            if (!tc) {
                tc = document.createElement('meta');
                tc.name = 'theme-color';
                document.head.appendChild(tc);
            }
            tc.content = '#00243e';

            /* PWA manifest is now in play.html <head> — no need to inject here */
        })();
    }
})();
