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

    if (!('ontouchstart' in window) && navigator.maxTouchPoints <= 0) return;

    /* ── Global flag for other scripts to detect mobile mode ── */
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
    '#lm-mc-l{padding-left:env(safe-area-inset-left);padding-bottom:env(safe-area-inset-bottom)}' +
    '#lm-mc-r{padding-right:env(safe-area-inset-right);padding-bottom:env(safe-area-inset-bottom)}' +
    '#minimap-hud{margin-right:env(safe-area-inset-right)!important;' +
    'margin-bottom:env(safe-area-inset-bottom)!important}' +
    '#lm-cb{padding-bottom:env(safe-area-inset-bottom)}' +
    '}' +

    /* ── LEFT: ☰ trigger + horizontal drawer ── */
    '#lm-mc-l{position:fixed;left:4px;bottom:6px;z-index:100000;' +
    'pointer-events:none;user-select:none;-webkit-user-select:none;' +
    'display:flex;flex-direction:row;align-items:flex-end;gap:6px}' +

    /* ── Drawer: always visible, horizontal row to right of ☰ ── */
    '#lm-drawer{display:flex;flex-direction:row;align-items:flex-end;gap:5px;' +
    'pointer-events:auto}' +

    /* ── Drawer button: smaller than trigger, equal size ── */
    '.lm-d{pointer-events:auto;touch-action:none;cursor:pointer;' +
    'display:flex;align-items:center;justify-content:center;border-radius:50%;' +
    'width:36px;height:36px;font-size:15px;' +
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
    '#lm-mc-sm{position:fixed;z-index:100000;' +
    'pointer-events:none;user-select:none;-webkit-user-select:none;' +
    'display:flex;flex-direction:row;align-items:center;gap:6px}' +

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

    '.lm-s{width:clamp(40px,10vmin,50px);height:clamp(40px,10vmin,50px);font-size:13px;' +
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

    '#lm-cb{position:fixed;bottom:0;left:0;right:0;z-index:100002;' +
    'display:none;background:rgba(0,36,62,.92);' +
    'border-top:2px solid rgba(1,217,204,.45);' +
    'padding:8px 14px;text-align:right;backdrop-filter:blur(6px)}' +
    '#lm-cb button{background:#01d9cc;color:#00243e;border:none;border-radius:6px;' +
    'padding:10px 32px;font:700 15px/1 Ubuntu,Roboto,sans-serif;' +
    'text-transform:uppercase;letter-spacing:1px;cursor:pointer}' +
    '#lm-cb button:active{opacity:.8}' +

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
    'transform:scale(0.5)!important;transform-origin:bottom right!important}' +
    '#leaderboard-hud{position:fixed!important;top:4px!important;right:4px!important;' +
    'transform:scale(0.75)!important;transform-origin:top right!important}' +
    '#top5-hud{position:fixed!important;top:30px!important;left:4px!important;' +
    'transform:scale(0.75)!important;transform-origin:top left!important}' +
    '#stats-hud{position:fixed!important;left:4px!important;' +
    'transform:scale(0.75)!important;transform-origin:bottom left!important;' +
    'display:none!important}' +

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
        setTimeout(boot, 600);
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
            fit();
            setInterval(fit, 2000);
            window.addEventListener('resize', fit);
            window.addEventListener('orientationchange', function () { setTimeout(fit, 300); });
        })();
        /* ── Mobile visual overrides: proportional to user settings ── */
        (function mobileVisuals() {
            function apply() {
                if (typeof defaultSettings !== 'undefined') {
                    // Grid: keep user's color, reduce opacity proportionally (×0.3)
                    var gc = defaultSettings.gridColor || '#00243e';
                    if (gc.indexOf('rgba') === 0) {
                        // Extract rgba components, multiply alpha by 0.3
                        var parts = gc.replace(/rgba?\(/,'').replace(')','').split(',');
                        var a = parseFloat(parts[3] || 1) * 0.3;
                        defaultSettings.gridColor = 'rgba(' + parts[0].trim() + ',' +
                            parts[1].trim() + ',' + parts[2].trim() + ',' + a.toFixed(2) + ')';
                    } else {
                        // Hex or named color — wrap in rgba with low alpha
                        defaultSettings.gridColor = 'rgba(0,36,62,.15)';
                    }

                    // FoodSize: proportional (60% of user's setting, min 1)
                    var userFood = defaultSettings.foodSize || 5;
                    defaultSettings.foodSize = Math.max(1, Math.round(userFood * 0.6));
                }
                if (typeof defaultmapsettings !== 'undefined') {
                    defaultmapsettings.showBgSectors = false; // no sector background
                }
            }
            apply();
            // re-apply after theme loads (ogario loads settings late)
            setTimeout(apply, 3000);
            setTimeout(apply, 6000);
        })();

        document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, {passive:false});
        document.addEventListener('gesturechange', function (e) { e.preventDefault(); }, {passive:false});
        document.addEventListener('gestureend', function (e) { e.preventDefault(); }, {passive:false});

        /* ── Fullscreen + Landscape helper ──
         * Works in browser; gracefully degrades in Google Play WebView/TWA
         * where fullscreen/orientation are handled by AndroidManifest instead */
        function goFullscreenLandscape() {
            try {
                var el = document.documentElement;
                var rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
                if (rfs && !document.fullscreenElement && !document.webkitFullscreenElement) {
                    rfs.call(el).then(function () {
                        try { screen.orientation.lock('landscape').catch(function () {}); } catch(e) {}
                    }).catch(function () {});
                }
            } catch(e) {}
        }

        /* ── Auto-fullscreen on Play button tap ── */
        (function hookPlayButtons() {
            function hook(btn) {
                if (!btn || btn._lmHooked) return;
                btn._lmHooked = true;
                btn.addEventListener('click', function () {
                    goFullscreenLandscape();
                }, {passive: true});
                btn.addEventListener('touchstart', function () {
                    goFullscreenLandscape();
                }, {passive: true});
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
            // Re-scan when DOM changes (in case buttons load late)
            setTimeout(scan, 2000);
            setTimeout(scan, 5000);
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
            if (isPortrait && isPlaying) {
                portOv.classList.add('on');
            } else {
                portOv.classList.remove('on');
            }
        }
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', function () { setTimeout(checkOrientation, 300); });
        setInterval(checkOrientation, 3000);

        /* ── Wake Lock (prevent screen from sleeping during gameplay) ── */
        var wakeLock = null;
        function requestWakeLock() {
            try {
                if ('wakeLock' in navigator) {
                    navigator.wakeLock.request('screen').then(function (wl) {
                        wakeLock = wl;
                    }).catch(function () {});
                }
            } catch(e) {}
        }
        requestWakeLock();
        // Re-acquire on tab becoming visible again
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') requestWakeLock();
        });

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
        var prefs = {jsSensitivity: 300, btnOpacity: 0.65, btnScale: 1.0, hudFade: 0.5};
        try {
            var saved = JSON.parse(localStorage.getItem(PREF_KEY));
            if (saved) {
                if (saved.jsSensitivity !== undefined) prefs.jsSensitivity = saved.jsSensitivity;
                if (saved.btnOpacity   !== undefined) prefs.btnOpacity   = saved.btnOpacity;
                if (saved.btnScale     !== undefined) prefs.btnScale     = saved.btnScale;
                if (saved.hudFade      !== undefined) prefs.hudFade      = saved.hudFade;
            }
        } catch(e) {}
        function savePrefs() {
            try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch(e) {}
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
        var bAI   = mkd('►');
        var bPaus = mkd('❚❚');
        drawer.appendChild(bAI);
        drawer.appendChild(bPaus);
        drawer.appendChild(bChat);

        /* ☰ menu button: leftmost, always visible, toggles helloContainer */
        var bMenu = mkb('☰', null, true);
        rootL.appendChild(bMenu);
        rootL.appendChild(drawer);

        /* ── Settings panel: inside drawer (no fixed position) ── */
        var sp = mk('div'); sp.id = 'lm-sp';
        sp.innerHTML =
            '<label>Joystick <span id="lm-js-v">' + prefs.jsSensitivity + '</span></label>' +
            '<input type="range" id="lm-js" min="100" max="600" step="25" value="' + prefs.jsSensitivity + '">' +
            '<label>Opacity <span id="lm-op-v">' + Math.round(prefs.btnOpacity*100) + '%</span></label>' +
            '<input type="range" id="lm-op" min="20" max="100" step="5" value="' + Math.round(prefs.btnOpacity*100) + '">' +
            '<label>Btn Size <span id="lm-bs-v">' + Math.round(prefs.btnScale*100) + '%</span></label>' +
            '<input type="range" id="lm-bs" min="50" max="150" step="5" value="' + Math.round(prefs.btnScale*100) + '">' +
            '<label>HUD Fade <span id="lm-hf-v">' + Math.round(prefs.hudFade*100) + '%</span></label>' +
            '<input type="range" id="lm-hf" min="20" max="100" step="5" value="' + Math.round(prefs.hudFade*100) + '">';
        drawer.appendChild(sp);

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
        sp.querySelector('#lm-hf').addEventListener('input', function () {
            prefs.hudFade = parseInt(this.value) / 100;
            sp.querySelector('#lm-hf-v').textContent = this.value + '%';
            savePrefs();
        });

        /* ── RIGHT side: SPLIT + FEED (positioned by JS relative to minimap) ── */
        var rootR = mk('div'); rootR.id = 'lm-mc-r';
        document.body.appendChild(rootR);

        var bSplit = mkb('⚔', 'SPLIT', false);
        var bFeed  = mkb('⬤', 'FEED', false);
        rootR.appendChild(bSplit);
        rootR.appendChild(bFeed);

        /* ── SMALL ROW: 4× + 16× (positioned by JS above minimap) ── */
        var smallR = mk('div'); smallR.id = 'lm-mc-sm';
        document.body.appendChild(smallR);

        var bDbl = mks('4×');
        var b16  = mks('16×');
        smallR.appendChild(bDbl);
        smallR.appendChild(b16);

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
        [bMenu, bChat, bSplit, bFeed, bDbl, b16, bAI, bPaus].forEach(function (b) {
            b.addEventListener('touchstart',  function () { b.classList.add('p'); },    {passive:true});
            b.addEventListener('touchend',    function () { b.classList.remove('p'); }, {passive:true});
            b.addEventListener('touchcancel', function () { b.classList.remove('p'); }, {passive:true});
        });

        /* ═══════════════════════════════════════════════════════
         *  MENU — toggles helloContainer (show/hide game menu)
         * ═══════════════════════════════════════════════════════ */
        bMenu.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            var hc = document.getElementById('helloContainer');
            if (hc) {
                if (hc.style.display === 'none' || hc.style.display === '') {
                    hc.style.display = 'block';
                    if (typeof application !== 'undefined' && application.showMenu) {
                        application.showMenu();
                    }
                } else {
                    hc.style.display = 'none';
                }
            } else {
                emitKey(27); // fallback: ESC
            }
        }, {passive:false});

        /* (fullscreen toggled via goFullscreenLandscape on Play button tap) */

        /* ═══════════════════════════════════════════════════════
         *  BUTTON DEBOUNCE — prevents accidental double-fires
         * ═══════════════════════════════════════════════════════ */
        var lastAction = 0;
        var DEBOUNCE = 150; // ms
        function debounced(fn) {
            var now = Date.now();
            if (now - lastAction < DEBOUNCE) return;
            lastAction = now;
            fn();
        }

        /* ═══════════════════════════════════════════════════════
         *  SPLIT — Space (keyCode 32)
         * ═══════════════════════════════════════════════════════ */
        bSplit.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            debounced(function () { emitKey(32); });
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  DOUBLE SPLIT — calls application.doubleSplit()
         * ═══════════════════════════════════════════════════════ */
        bDbl.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            debounced(function () {
                if (typeof application !== 'undefined' && application.doubleSplit)
                    application.doubleSplit();
            });
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  SPLIT 16 — calls application.split16()
         * ═══════════════════════════════════════════════════════ */
        b16.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            debounced(function () {
                if (typeof application !== 'undefined' && application.split16)
                    application.split16();
            });
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  AUTOPLAY — calls application.setAutoPlay()
         * ═══════════════════════════════════════════════════════ */
        bAI.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.setAutoPlay) {
                application.setAutoPlay();
                bAI.classList.toggle('lm-active');
            }
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  PAUSE — calls application.setPause()
         * ═══════════════════════════════════════════════════════ */
        bPaus.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.setPause) {
                application.setPause();
                bPaus.classList.toggle('lm-active');
            }
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  FEED — W (keyCode 87), hold to repeat
         * ═══════════════════════════════════════════════════════ */
        var feedIv = null;
        bFeed.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            emitKey(87);
            feedIv = setInterval(function () { emitKey(87); }, 50);
        }, {passive:false});
        bFeed.addEventListener('touchend',    function () { clearInterval(feedIv); feedIv = null; }, {passive:true});
        bFeed.addEventListener('touchcancel', function () { clearInterval(feedIv); feedIv = null; }, {passive:true});

        /* (game menu is accessed via the drawer — ☰ now only toggles the drawer) */

        /* ═══════════════════════════════════════════════════════
         *  CHAT — Enter (keyCode 13)
         * ═══════════════════════════════════════════════════════ */
        var chatOn = false;

        bChat.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            chatOn ? chatClose() : chatOpen();
        }, {passive:false});

        function chatOpen() {
            chatOn = true;
            // Open chat box — dispatch Enter on document to open game's chat
            emitKey(13);
            setTimeout(function () {
                var inp = document.getElementById('message');
                if (inp) {
                    inp.focus();
                    // Auto-send on Enter key from virtual keyboard
                    inp.addEventListener('keydown', function onEnter(ev) {
                        if (ev.keyCode === 13 || ev.key === 'Enter') {
                            inp.removeEventListener('keydown', onEnter);
                            setTimeout(function () { chatClose(); }, 50);
                        }
                    });
                }
                cBar.style.display = 'block';
            }, 120);
        }

        function chatClose() {
            var inp = document.getElementById('message');
            if (inp && inp.value.length > 0) {
                // Send the message by dispatching Enter on the input
                var ev = document.createEvent('Event');
                ev.initEvent('keydown', true, true);
                ev.keyCode = 13;
                ev.which = 13;
                ev.key = 'Enter';
                inp.dispatchEvent(ev);
            }
            if (inp) inp.blur();
            chatOn = false;
            cBar.style.display = 'none';
        }

        // Tap canvas while chatting → send & close
        canvas.addEventListener('touchstart', function (e) {
            if (chatOn) {
                e.preventDefault();
                chatClose();
            }
        }, {passive:false});

        /* (fullscreen toggle handled by bFull listener above) */

        /* ═══════════════════════════════════════════════════════
         *  SWIPE GESTURES (left half of canvas)
         *  swipe right → split | swipe up → double split
         * ═══════════════════════════════════════════════════════ */
        var swStart = null;
        var SW_THRESH = 50; // min px to count as swipe
        canvas.addEventListener('touchstart', function (e) {
            if (chatOn || e.touches.length !== 1) return;
            var t = e.changedTouches[0];
            if (t.clientX < window.innerWidth * 0.5) {
                swStart = {x: t.clientX, y: t.clientY, id: t.identifier};
            } else {
                swStart = null;
            }
        }, {passive:true});

        canvas.addEventListener('touchend', function (e) {
            if (!swStart) return;
            for (var i = 0; i < e.changedTouches.length; i++) {
                var t = e.changedTouches[i];
                if (t.identifier !== swStart.id) continue;
                var dx = t.clientX - swStart.x;
                var dy = t.clientY - swStart.y;
                // swipe right → split
                if (dx > SW_THRESH && Math.abs(dy) < dx) {
                    emitKey(32);
                }
                // swipe up → double split
                else if (-dy > SW_THRESH && Math.abs(dx) < -dy) {
                    if (typeof application !== 'undefined' && application.doubleSplit)
                        application.doubleSplit();
                }
                swStart = null;
                break;
            }
        }, {passive:true});

        /* ═══════════════════════════════════════════════════════
         *  JOYSTICK — direction persists after finger lift
         * ═══════════════════════════════════════════════════════ */
        var org = {x:0, y:0}; // joystick origin
        var jId = null;
        var asp = window.innerWidth / window.innerHeight;
        // JS sensitivity now comes from prefs (live-updated by slider)
        var JR = 55;

        window.addEventListener('resize', function () {
            asp = window.innerWidth / window.innerHeight;
        });

        canvas.addEventListener('touchstart', function (e) {
            if (chatOn || e.touches.length !== 1) return;
            var t = e.changedTouches[0];
            jId = t.identifier;
            org.x = t.clientX; org.y = t.clientY;
            mouseAt(t.clientX, t.clientY);
            jShow(org.x, org.y, org.x, org.y);
            swStart = null; // cancel any swipe tracking when joystick starts
        }, {passive:true});

        canvas.addEventListener('touchend', function (e) {
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === jId) {
                    jId = null;
                    // DO NOT reset mouse to center — direction persists
                    jHide();
                    break;
                }
            }
        }, {passive:true});

        canvas.addEventListener('touchcancel', function () {
            jId = null;
            jHide();
        }, {passive:true});

        canvas.addEventListener('touchmove', function (e) {
            if (e.touches.length >= 2) return;
            var t = tById(e.changedTouches, jId);
            if (!t) return;

            var rx0 = t.clientX - org.x, ry0 = t.clientY - org.y;
            var rawD = Math.sqrt(rx0*rx0 + ry0*ry0);
            // dead zone: ignore tiny movements to prevent accidental direction change
            if (rawD < 8) return;

            var dx = rx0 * prefs.jsSensitivity;
            var dy = ry0 * prefs.jsSensitivity;
            // Apply aspect ratio correction (landscape screens need wider X moves)
            var cx = window.innerWidth  / 2 + dx / asp;
            var cy = window.innerHeight / 2 + dy;
            mouseAt(cx, cy);

            var rx = t.clientX - org.x, ry = t.clientY - org.y;
            var d = Math.sqrt(rx*rx + ry*ry);
            if (d > JR) {
                var a = Math.atan2(ry, rx);
                jShow(org.x, org.y, org.x + Math.cos(a)*JR, org.y + Math.sin(a)*JR);
            } else {
                jShow(org.x, org.y, t.clientX, t.clientY);
            }
        }, {passive:true});

        /* ═══════════════════════════════════════════════════════
         *  PINCH-TO-ZOOM  (dual mode)
         *    Menu visible  → scale HUD  (hudScale, 0.3 – 1.0)
         *    In-game       → zoom map   (WheelEvent)
         *    Spread fingers = zoom IN for both
         * ═══════════════════════════════════════════════════════ */
        var pDist = 0, pOn = false;

        function isMenuVisible() {
            var ov = document.getElementById('overlays');
            if (!ov) return false;
            if (ov.style.display === 'none') return false;
            // overlays is hidden via .stop().hide() when in-game
            return ov.offsetParent !== null || ov.offsetHeight > 0;
        }

        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 2) {
                pOn = true;
                pDist = dist(e.touches[0], e.touches[1]);
                jHide(); jId = null;
            }
        }, {passive:true});

        canvas.addEventListener('touchmove', function (e) {
            if (!(e.touches.length === 2 && pOn)) return;
            e.preventDefault();
            var nd = dist(e.touches[0], e.touches[1]);
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
                    var cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                    var cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                    // spread (delta>0) → positive deltaY → zoom in (ogario convention)
                    wheel(canvas, delta * 2, cx, cy);
                    zP.textContent = delta > 0 ? '🔍 +' : '🔍 −';
                }
                pDist = nd;
                zP.classList.add('on');
                clearTimeout(zT);
                zT = setTimeout(function () { zP.classList.remove('on'); }, 400);
            }
        }, {passive:false});

        canvas.addEventListener('touchend', function (e) {
            if (e.touches.length < 2) { pOn = false; pDist = 0; }
        }, {passive:true});

        /* ═══════════════════════════════════════════════════════
         *  HAPTIC FEEDBACK
         * ═══════════════════════════════════════════════════════ */
        function vibrate(pattern) {
            try { if (navigator.vibrate) navigator.vibrate(pattern); } catch(e) {}
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
            }).observe(statsEl, {attributes: true, attributeFilter: ['style', 'class']});
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
            }).observe(msgList, {childList: true});
        })();

        /* ═══════════════════════════════════════════════════════
         *  MINIMAP TAP-TO-TOGGLE (70% ↔ 100%)
         * ═══════════════════════════════════════════════════════ */
        (function () {
            var mm = document.getElementById('minimap-hud');
            if (!mm) return;
            var expanded = false;
            mm.style.pointerEvents = 'auto';
            mm.addEventListener('touchstart', function (e) {
                e.stopPropagation();
                expanded = !expanded;
                mm.style.transform = expanded ? 'scale(1)' : 'scale(0.7)';
            }, {passive:true});
        })();

        /* ═══════════════════════════════════════════════════════
         *  HUD AUTO-FADE WHILE PLAYING
         *  Fades leaderboard/teamboard/stats when touching canvas
         *  Restores full opacity after 2.5s idle
         * ═══════════════════════════════════════════════════════ */
        (function () {
            var hudEls = ['leaderboard-hud', 'top5-hud', 'stats-hud', 'time-hud'];
            var els = [];
            for (var i = 0; i < hudEls.length; i++) {
                var el = document.getElementById(hudEls[i]);
                if (el) els.push(el);
            }
            if (!els.length) return;

            var fadeTimer = null;

            function fadeHud() {
                for (var i = 0; i < els.length; i++)
                    els[i].style.opacity = prefs.hudFade;
            }
            function restoreHud() {
                for (var i = 0; i < els.length; i++)
                    els[i].style.opacity = '1';
            }

            canvas.addEventListener('touchstart', function () {
                if (chatOn) return;
                fadeHud();
                clearTimeout(fadeTimer);
            }, {passive:true});

            canvas.addEventListener('touchend', function () {
                clearTimeout(fadeTimer);
                fadeTimer = setTimeout(restoreHud, 2500);
            }, {passive:true});

            canvas.addEventListener('touchcancel', function () {
                clearTimeout(fadeTimer);
                fadeTimer = setTimeout(restoreHud, 2500);
            }, {passive:true});
        })();

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
            } catch(e) {
                ev = document.createEvent('KeyboardEvent');
                ev.initEvent(type, true, true);
            }
            // Force keyCode and which — this is the critical fix
            Object.defineProperty(ev, 'keyCode', {get: function(){return kc;}});
            Object.defineProperty(ev, 'which',   {get: function(){return kc;}});
            Object.defineProperty(ev, 'key',     {get: function(){return kn(kc);}});
            document.dispatchEvent(ev);
        }

        function kn(c) {
            return c===13?'Enter':c===27?'Escape':c===32?' ':String.fromCharCode(c);
        }

        function mouseAt(x, y) {
            canvas.dispatchEvent(new MouseEvent('mousemove', {
                clientX: x, clientY: y, bubbles: true, cancelable: true
            }));
        }

        function wheel(t, dy, cx, cy) {
            var o = {deltaY:dy, deltaMode:0, clientX:cx, clientY:cy, bubbles:true, cancelable:true};
            t.dispatchEvent(new WheelEvent('wheel', o));
            o.detail = dy > 0 ? 3 : -3;
            t.dispatchEvent(new WheelEvent('mousewheel', o));
        }

        function dist(a, b) {
            var dx=a.clientX-b.clientX, dy=a.clientY-b.clientY;
            return Math.sqrt(dx*dx+dy*dy);
        }

        function tById(list, id) {
            if (id === null) return null;
            for (var i=0; i<list.length; i++) if (list[i].identifier===id) return list[i];
            return null;
        }

        function jShow(ox,oy,ix,iy) {
            jO.style.display='block'; jO.style.left=ox+'px'; jO.style.top=oy+'px';
            jI.style.display='block'; jI.style.left=ix+'px'; jI.style.top=iy+'px';
        }
        function jHide() { jO.style.display='none'; jI.style.display='none'; }

        document.addEventListener('contextmenu', function(e){e.preventDefault();});
        document.body.addEventListener('touchmove', function(e){
            if (e.target===canvas||e.target===document.body) e.preventDefault();
        }, {passive:false});

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
            rootL.style.opacity = '0.1';
            if (_fadeTimer) clearTimeout(_fadeTimer);
            _fadeTimer = setTimeout(function () {
                rootL.style.opacity = prefs.btnOpacity;
            }, 3000);
        }, {passive: true});
        canvas.addEventListener('touchend', function () {
            if (_fadeTimer) clearTimeout(_fadeTimer);
            _fadeTimer = setTimeout(function () {
                rootL.style.opacity = prefs.btnOpacity;
            }, 3000);
        }, {passive: true});

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
                    orig.style.display = expanded ? 'block' : 'none';
                }
            }, {passive: false});

            setInterval(function () {
                // Mass + cells
                var mass = 0, cells = 0, maxCells = 16;
                if (typeof ogario !== 'undefined') mass = ogario.playerMass || 0;
                else if (typeof legendmod !== 'undefined') mass = legendmod.playerMass || 0;
                if (typeof legendmod !== 'undefined' && legendmod.playerCells)
                    cells = legendmod.playerCells.length;
                else if (typeof LM !== 'undefined' && LM.playerCells)
                    cells = LM.playerCells.length;

                if (mass > 0) {
                    massSpan.textContent = mass + ' \u00b7 ' + cells + '/' + maxCells;
                } else {
                    massSpan.textContent = '';
                }

                // Ping
                var ping = -1;
                if (typeof window.pingTime !== 'undefined') ping = window.pingTime;
                else if (typeof ogario !== 'undefined' && ogario.ping) ping = ogario.ping;
                else if (typeof connection !== 'undefined' && connection.ping) ping = connection.ping;

                if (ping >= 0) {
                    var icon = ping <= 80 ? '\ud83d\udfe2' : ping <= 200 ? '\ud83d\udfe1' : '\ud83d\udd34';
                    dot.textContent = icon + ' ' + Math.round(ping) + 'ms';
                } else {
                    dot.textContent = '';
                }
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
        setInterval(repositionButtons, 2500);
        window.addEventListener('resize', repositionButtons);
        window.addEventListener('orientationchange', function () {
            // Browser needs time to re-layout after rotation
            setTimeout(repositionButtons, 300);
            setTimeout(repositionButtons, 600);
            setTimeout(repositionButtons, 1200);
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
        setInterval(function () {
            var nowVisible = isMenuVisible();
            if (nowVisible !== _prevMenuVisible) {
                if (!nowVisible) {
                    // Menu just hidden (playing/spectating) → fullscreen + wake lock
                    goFullscreenLandscape();
                    // Keep screen on while playing
                    if ('wakeLock' in navigator) {
                        navigator.wakeLock.request('screen').then(function (wl) {
                            window._lmWakeLock = wl;
                        }).catch(function () {});
                    }
                } else {
                    if (!isTWA) {
                        // Menu appeared (died/opened) → exit fullscreen (browser only)
                        try {
                            if (document.fullscreenElement || document.webkitFullscreenElement) {
                                (document.exitFullscreen || document.webkitExitFullscreen).call(document);
                            }
                        } catch(e) {}
                    }
                    // Release wake lock when not playing
                    if (window._lmWakeLock) {
                        try { window._lmWakeLock.release(); } catch(e) {}
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
                    window._lmWakeLock = wl;
                }).catch(function () {});
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
                var huds = ['#leaderboard-hud','#top5-hud','#stats-hud','#time-hud'];
                huds.forEach(function (sel) {
                    var el = document.querySelector(sel);
                    if (el) el.style.transform = el.style.transform.replace('scale(0.75)', 'scale(0.9)');
                });
                var mm = document.querySelector('#minimap-hud');
                if (mm) mm.style.transform = mm.style.transform.replace('scale(0.5)', 'scale(0.65)');
            }
        })();

        /* ═══════════════════════════════════════════════════════
         *  TAP CANVAS TO CLOSE DRAWER
         * ═══════════════════════════════════════════════════════ */
        document.addEventListener('touchstart', function (e) {
            if (!drawer.classList.contains('on')) return;
            // If tap is outside the drawer, menu button, and settings panel — close
            if (rootL.contains(e.target)) return;
            drawer.classList.remove('on');
            sp.classList.remove('on');
        }, {passive: true});

        /* ═══════════════════════════════════════════════════════
         *  KEYBOARD HANDLING (virtual keyboard shifts layout)
         * ═══════════════════════════════════════════════════════ */
        if ('visualViewport' in window) {
            window.visualViewport.addEventListener('resize', function () {
                var vv = window.visualViewport;
                var kbHeight = window.innerHeight - vv.height;
                if (kbHeight > 100) {
                    // Keyboard is open — shift chat bar above keyboard
                    cBar.style.bottom = kbHeight + 'px';
                } else {
                    cBar.style.bottom = '';
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
                // Reduce food rendering
                if (typeof defaultSettings !== 'undefined') {
                    defaultSettings.foodSize = 1;
                }
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

            // Inject PWA manifest link if not present
            if (!document.querySelector('link[rel="manifest"]')) {
                var ml = document.createElement('link');
                ml.rel = 'manifest';
                ml.href = '/manifest.json';
                document.head.appendChild(ml);
            }
        })();
    }
})();
