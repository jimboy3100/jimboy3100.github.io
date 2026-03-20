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

    /* ── LEFT: single ☰ button (always visible) ── */
    '#lm-mc-l{position:fixed;left:12px;bottom:clamp(20px,6vh,50px);z-index:100000;' +
    'pointer-events:none;user-select:none;-webkit-user-select:none;' +
    'display:flex;flex-direction:column;align-items:flex-start;gap:6px}' +

    /* ── Drawer: slides up from ☰, hidden by default ── */
    '#lm-drawer{display:flex;flex-direction:column;align-items:flex-start;gap:6px;' +
    'pointer-events:none;max-height:0;overflow:hidden;opacity:0;' +
    'transition:max-height .25s ease,opacity .2s ease}' +
    '#lm-drawer.on{max-height:400px;opacity:1;pointer-events:auto}' +

    /* ── RIGHT container: split + feed only (always visible) ── */
    '#lm-mc-r{position:fixed;right:14px;bottom:clamp(60px,18vh,160px);z-index:100000;' +
    'pointer-events:none;user-select:none;-webkit-user-select:none;' +
    'display:flex;flex-direction:column;align-items:flex-end;gap:16px}' +

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

    /* ── Lock HUD elements into fixed positions (prevent displacement) ── */
    '#minimap-hud{position:fixed!important;bottom:10px!important;right:10px!important;' +
    'transform:scale(0.7)!important;transform-origin:bottom right!important}' +
    '#leaderboard-hud{position:fixed!important;top:10px!important;right:10px!important}' +
    '#top5-hud{position:fixed!important;top:55px!important;left:10px!important}' +
    '#stats-hud{position:fixed!important;left:10px!important}' +
    '#time-hud{position:fixed!important;right:10px!important}' +
    '#chat-box,#messages{position:fixed!important;left:10px!important}' +
    '#message-box{position:fixed!important;left:50%!important;bottom:82px!important;transform:translate(-50%,0)!important}' +
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
        /* ── Mobile visual overrides: reduce canvas noise ── */
        (function mobileVisuals() {
            function apply() {
                if (typeof defaultSettings !== 'undefined') {
                    defaultSettings.gridColor = 'rgba(0,36,62,.15)'; // dim grid
                    defaultSettings.foodSize = 3; // smaller food dots
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

        /* ── Fullscreen prompt (one-time, non-intrusive) ── */
        if (!localStorage.getItem('lm-fs-prompted')) {
            var fst = mk('div'); fst.id = 'lm-fs-toast';
            fst.textContent = 'Tap ⛶ for fullscreen — best mobile experience!';
            document.body.appendChild(fst);
            setTimeout(function () { fst.classList.add('on'); }, 800);
            setTimeout(function () {
                fst.classList.remove('on');
                setTimeout(function () { fst.remove(); }, 500);
            }, 5000);
            localStorage.setItem('lm-fs-prompted', '1');
        }

        /* ── Portrait orientation prompt ── */
        if (window.innerHeight > window.innerWidth && !localStorage.getItem('lm-orient-prompted')) {
            var ot = mk('div'); ot.id = 'lm-orient-toast';
            ot.innerHTML = '📱⇔️<br>Rotate your phone for<br>better gameplay!';
            document.body.appendChild(ot);
            setTimeout(function () { ot.classList.add('on'); }, 7000);
            setTimeout(function () {
                ot.classList.remove('on');
                setTimeout(function () { ot.remove(); }, 600);
            }, 12000);
            localStorage.setItem('lm-orient-prompted', '1');
        }

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

        /* drawer: all secondary buttons (hidden by default) */
        var drawer = mk('div'); drawer.id = 'lm-drawer';

        var bChat = mkb('💬', null, true);
        var bFull = mkb('⛶', null, true);
        var bGear = mks('⚙');
        var bAI   = mks('►');
        var bPaus = mks('‖');
        var bDbl  = mks('2×');
        var b16   = mks('16×');
        drawer.appendChild(bDbl); drawer.appendChild(b16);
        drawer.appendChild(bAI); drawer.appendChild(bPaus);
        drawer.appendChild(bChat); drawer.appendChild(bFull);
        drawer.appendChild(bGear);
        rootL.appendChild(drawer);

        /* ☰ menu button: always visible, toggles drawer */
        var bMenu = mkb('☰', null, true);
        rootL.appendChild(bMenu);

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

        /* apply prefs to all buttons */
        function applyPrefs() {
            rootL.style.opacity = prefs.btnOpacity;
            rootR.style.opacity = prefs.btnOpacity;
            rootL.style.transform = 'scale(' + prefs.btnScale + ')';
            rootL.style.transformOrigin = 'bottom left';
            rootR.style.transform = 'scale(' + prefs.btnScale + ')';
            rootR.style.transformOrigin = 'bottom right';
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

        /* ── RIGHT side: split + feed ONLY (always visible) ── */
        var rootR = mk('div'); rootR.id = 'lm-mc-r';
        document.body.appendChild(rootR);

        var bSplit = mkb('⚔', 'SPLIT', false);
        var bFeed  = mkb('⬤', 'FEED', false);
        rootR.appendChild(bSplit);
        rootR.appendChild(bFeed);

        var jO = mk('div'); jO.className = 'lm-jo'; document.body.appendChild(jO);
        var jI = mk('div'); jI.className = 'lm-ji'; document.body.appendChild(jI);

        var zP = mk('div'); zP.className = 'lm-z'; document.body.appendChild(zP);
        var zT = null;

        var cBar = mk('div'); cBar.id = 'lm-cb';
        cBar.innerHTML = '<button>Send ⏎</button>';
        document.body.appendChild(cBar);

        /* apply initial prefs */
        applyPrefs();

        /* ── Press effects ── */
        [bMenu, bChat, bFull, bGear, bSplit, bFeed, bDbl, b16, bAI, bPaus].forEach(function (b) {
            b.addEventListener('touchstart',  function () { b.classList.add('p'); },    {passive:true});
            b.addEventListener('touchend',    function () { b.classList.remove('p'); }, {passive:true});
            b.addEventListener('touchcancel', function () { b.classList.remove('p'); }, {passive:true});
        });

        /* ═══════════════════════════════════════════════════════
         *  MENU — toggles drawer (shows/hides all secondary buttons)
         * ═══════════════════════════════════════════════════════ */
        bMenu.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            drawer.classList.toggle('on');
            if (!drawer.classList.contains('on')) sp.classList.remove('on');
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  GEAR — toggle settings panel (inside drawer)
         * ═══════════════════════════════════════════════════════ */
        bGear.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            sp.classList.toggle('on');
        }, {passive:false});

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

        cBar.querySelector('button').addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            chatClose();
        }, {passive:false});

        function chatOpen() {
            chatOn = true;
            emitKey(13); // open chat box
            setTimeout(function () {
                var inp = document.getElementById('message');
                if (inp) { inp.focus(); }
                cBar.style.display = 'block';
                rootL.style.visibility = 'hidden';
                rootR.style.visibility = 'hidden';
                drawer.classList.remove('on'); sp.classList.remove('on');
            }, 120);
        }

        function chatClose() {
            var inp = document.getElementById('message');
            if (inp) {
                // Send the message by dispatching Enter on the input
                // jQuery's keydown handler on #message checks keyCode === 13
                var ev = document.createEvent('Event');
                ev.initEvent('keydown', true, true);
                ev.keyCode = 13;
                ev.which = 13;
                ev.key = 'Enter';
                inp.dispatchEvent(ev);
                inp.blur();
            }
            // Also dispatch Enter on document to close the chat panel
            setTimeout(function () {
                emitKey(13);
            }, 50);
            chatOn = false;
            cBar.style.display = 'none';
            rootL.style.visibility = 'visible';
            rootR.style.visibility = 'visible';
        }

        // Tap canvas while chatting → send & close
        canvas.addEventListener('touchstart', function (e) {
            if (chatOn) {
                e.preventDefault();
                chatClose();
            }
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  FULLSCREEN
         * ═══════════════════════════════════════════════════════ */
        bFull.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            try {
                var d = document;
                if (!d.fullscreenElement && !d.webkitFullscreenElement) {
                    var r = d.documentElement;
                    (r.requestFullscreen || r.webkitRequestFullscreen).call(r);
                    /* lock to landscape when entering fullscreen */
                    try {
                        if (screen.orientation && screen.orientation.lock)
                            screen.orientation.lock('landscape').catch(function(){});
                    } catch(ol) {}
                } else {
                    (d.exitFullscreen || d.webkitExitFullscreen).call(d);
                }
            } catch(ex) {}
        }, {passive:false});

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
    }
})();
