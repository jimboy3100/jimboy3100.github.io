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
 *  • Fullscreen        — entered when a game starts (Play)
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
    /* drawRender.resizeCanvas gives phones their 2x backing store from this flag, but the canvas
     * was sized before the flag existed and stayed 1x until the first rotation, fullscreen or menu
     * resize. Apply it once as soon as the renderer is there (at most 15 s of polling). */
    (function () {
        var tries = 0;
        var t = setInterval(function () {
            tries++;
            var r = window.drawRender;
            if (r && typeof r.resizeCanvas === 'function') {
                clearInterval(t);
                try { r.resizeCanvas(); } catch (e) { }
            } else if (tries >= 60) clearInterval(t);
        }, 250);
    })();
    /* where this file came from: the control editor (LMmobile-editor.js) loads from the same place */
    var _lmmSrc = (document.currentScript && document.currentScript.src) || '';

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
        /* wrap-reverse: a row that is too long for the space (repositionButtons sets max-width) goes on
         * upward in a second row, the menu button stays at the bottom */
        '#lm-drawer{display:flex;flex-direction:row;flex-wrap:wrap-reverse;align-items:flex-end;gap:8px;' + /* was 5px: mis-taps toggled AutoPlay */
        'pointer-events:auto}' +

        /* ── Drawer button: smaller than trigger, equal size ── */
        '.lm-d{pointer-events:auto;touch-action:none;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;border-radius:50%;' +
        'width:40px;height:40px;font-size:16px;' + /* was 36px */
        'background:rgba(0,36,62,.50);background:color-mix(in srgb,var(--lm-pc,#00243e) 50%,transparent);border:1.5px solid rgba(1,217,204,.22);border:1.5px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 22%,transparent);' +
        'box-shadow:0 0 6px rgba(1,217,204,.06);box-shadow:0 0 6px color-mix(in srgb,var(--lm-mc,#01d9cc) 6%,transparent);' +
        'color:rgba(255,255,255,.8);font-family:var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);' +
        'font-weight:700;transition:transform .1s,background .15s;position:relative}' +
        /* a thumb-sized tap area (44 px) around the 40 px circle, drawn as before; half the
         * 8 px gap to the next button stays a gap */
        '.lm-d::after{content:"";position:absolute;top:-4px;right:-4px;bottom:-4px;left:-4px;border-radius:50%}' +
        '.lm-d.p{transform:scale(.88);background:rgba(1,217,204,.20);background:color-mix(in srgb,var(--lm-mc,#01d9cc) 20%,transparent)}' +
        '.lm-d.lm-active{background:rgba(1,217,204,.18)!important;background:color-mix(in srgb,var(--lm-mc,#01d9cc) 18%,transparent)!important;border-color:rgba(1,217,204,.55)!important;border-color:color-mix(in srgb,var(--lm-mc,#01d9cc) 55%,transparent)!important}' +

        /* ── RIGHT: SPLIT + FEED column (positioned by JS) ── */
        '#lm-mc-r{position:fixed;z-index:100000;' +
        'pointer-events:none;user-select:none;-webkit-user-select:none;' +
        'display:flex;flex-direction:column;align-items:center;gap:10px}' +

        /* ── SMALL ROW: 4× + 16× (positioned by JS above minimap) ── */
        /* Menu open: the buttons stay visible but take no taps (they sat above the menu and ate its
         * taps). Hiding them made players think they were gone. */
        '.lm-menu #lm-mc-r,.lm-menu #lm-mc-r *,.lm-menu #lm-mc-sm,.lm-menu #lm-mc-sm *{pointer-events:none!important}' +
        /* the leaderboard's mass/sector column (a tap targets that player) lies over the menu's tab bar
         * in portrait and over the skins panel in landscape and ate those taps: none while the menu is open */
        '.lm-menu #leaderboard-hud .lb-data{pointer-events:none!important}' +
        /* left-row buttons that do nothing while the menu is open (wave, ping, zoom): on a
         * 640x360 phone the menu reaches under the row and they took its taps */
        '.lm-menu .lm-nomenu,.lm-menu .lm-nomenu *{pointer-events:none!important}' +
        '#lm-mc-sm{position:fixed;z-index:100000;' +
        'pointer-events:none;user-select:none;-webkit-user-select:none;' +
        'display:flex;flex-direction:row;align-items:center;gap:10px}' + /* was 6px, next to the minimap */

        /* ── Shared button base (clean, subtle) ── */
        '.lm-b{pointer-events:auto;touch-action:none;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;border-radius:50%;' +
        'background:rgba(0,36,62,.55);background:color-mix(in srgb,var(--lm-pc,#00243e) 55%,transparent);border:2px solid rgba(1,217,204,.25);border:2px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 25%,transparent);' +
        'box-shadow:0 0 8px rgba(1,217,204,.08);box-shadow:0 0 8px color-mix(in srgb,var(--lm-mc,#01d9cc) 8%,transparent);' +
        'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);' +
        'transition:transform .1s,background .15s,border-color .15s,box-shadow .15s;' +
        'color:rgba(255,255,255,.85);font-family:var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);' +
        'font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.4)}' +

        '.lm-b.p{transform:scale(.88);background:rgba(1,217,204,.25);background:color-mix(in srgb,var(--lm-mc,#01d9cc) 25%,transparent);' +
        'border-color:rgba(1,217,204,.65);border-color:color-mix(in srgb,var(--lm-mc,#01d9cc) 65%,transparent);box-shadow:0 0 14px rgba(1,217,204,.25);box-shadow:0 0 14px color-mix(in srgb,var(--lm-mc,#01d9cc) 25%,transparent)}' +

        /* action buttons: BIG, thumb-friendly */
        '.lm-a{width:clamp(72px,20vmin,100px);height:clamp(72px,20vmin,100px)}' +

        '.lm-u{width:clamp(48px,13vmin,60px);height:clamp(48px,13vmin,60px);font-size:20px;' +
        'background:rgba(0,47,82,.45);background:color-mix(in srgb,var(--lm-pc2,#002f52) 45%,transparent);border-color:rgba(1,140,246,.25);border-color:color-mix(in srgb,var(--lm-btn1,#018cf6) 25%,transparent);' +
        'box-shadow:0 0 6px rgba(1,140,246,.08);box-shadow:0 0 6px color-mix(in srgb,var(--lm-btn1,#018cf6) 8%,transparent)}' +
        '.lm-u.p{background:rgba(1,140,246,.20);background:color-mix(in srgb,var(--lm-btn1,#018cf6) 20%,transparent);border-color:rgba(1,140,246,.60);border-color:color-mix(in srgb,var(--lm-btn1,#018cf6) 60%,transparent)}' +

        '.lm-bi{display:flex;flex-direction:column;align-items:center;gap:1px;pointer-events:none}' +
        '.lm-bi .i{font-size:clamp(22px,6vmin,30px);line-height:1}' +
        '.lm-bi .l{font-size:clamp(8px,2.2vmin,11px);opacity:.55;letter-spacing:1.2px;text-transform:uppercase}' +

        '.lm-s{width:clamp(44px,10vmin,52px);height:clamp(44px,10vmin,52px);font-size:13px;' + /* min 44px touch target */
        'background:rgba(0,47,82,.50);background:color-mix(in srgb,var(--lm-pc2,#002f52) 50%,transparent);border-color:rgba(141,95,230,.35);border-color:color-mix(in srgb,var(--lm-btn3,#8d5fe6) 35%,transparent);' +
        'box-shadow:0 0 6px rgba(141,95,230,.10);box-shadow:0 0 6px color-mix(in srgb,var(--lm-btn3,#8d5fe6) 10%,transparent)}' +
        '.lm-s.p{background:rgba(141,95,230,.25);background:color-mix(in srgb,var(--lm-btn3,#8d5fe6) 25%,transparent);border-color:rgba(141,95,230,.75);border-color:color-mix(in srgb,var(--lm-btn3,#8d5fe6) 75%,transparent)}' +

        /* toggle-active glow for autoplay / pause */
        '.lm-active{background:rgba(1,217,204,.18)!important;background:color-mix(in srgb,var(--lm-mc,#01d9cc) 18%,transparent)!important;border-color:rgba(1,217,204,.55)!important;border-color:color-mix(in srgb,var(--lm-mc,#01d9cc) 55%,transparent)!important;' +
        'box-shadow:0 0 8px rgba(1,217,204,.25)!important;box-shadow:0 0 8px color-mix(in srgb,var(--lm-mc,#01d9cc) 25%,transparent)!important}' +

        '.lm-r{display:flex;gap:6px;pointer-events:none}' +

        /* ── Settings panel ── */
        '#lm-sp{background:rgba(0,36,62,.92);background:color-mix(in srgb,var(--lm-pc,#00243e) 92%,transparent);border:1px solid rgba(1,217,204,.35);border:1px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 35%,transparent);' +
        'border-radius:var(--lm-radius,6px);padding:14px 16px;width:200px;' +
        'max-height:50vh;overflow-y:auto;' +
        'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);' +
        'pointer-events:auto;user-select:none;-webkit-user-select:none;' +
        'display:none;flex-direction:column;gap:10px}' +
        '#lm-sp.on{display:flex}' +
        '#lm-sp label{color:rgba(255,255,255,.75);font:600 11px/1.2 var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);' +
        'letter-spacing:.5px;text-transform:uppercase;display:flex;' +
        'justify-content:space-between;align-items:center}' +
        '#lm-sp label span{color:var(--lm-mc,#01d9cc);font-weight:700}' +
        /* a label's own text (lm-t) keeps the label colour; the value spans stay teal */
        '#lm-sp label span.lm-t{color:inherit;font-weight:inherit}' +
        '#lm-sp input[type=range]{-webkit-appearance:none;width:100%;height:4px;' +
        'background:rgba(1,217,204,.25);background:color-mix(in srgb,var(--lm-mc,#01d9cc) 25%,transparent);border-radius:2px;outline:none;margin-top:4px}' +
        '#lm-sp #lm-ed-open{min-height:40px;border-radius:var(--lm-radius,6px);border:1.5px solid rgba(1,217,204,.55);border:1.5px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 55%,transparent);' +
        'background:rgba(1,217,204,.16);background:color-mix(in srgb,var(--lm-mc,#01d9cc) 16%,transparent);color:#fff;font:700 12px/1 var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);cursor:pointer}' +
        '#lm-sp input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;' +
        'width:18px;height:18px;border-radius:50%;background:var(--lm-mc,#01d9cc);cursor:pointer;' +
        'box-shadow:0 0 6px rgba(1,217,204,.4);box-shadow:0 0 6px color-mix(in srgb,var(--lm-mc,#01d9cc) 40%,transparent)}' +

        '.lm-jo{width:120px;height:120px;border-radius:50%;' +
        'background:rgba(0,36,62,.18);background:color-mix(in srgb,var(--lm-pc,#00243e) 18%,transparent);border:2px solid rgba(1,217,204,.22);border:2px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 22%,transparent);' +
        'position:fixed;display:none;z-index:99998;transform:translate(-50%,-50%);pointer-events:none}' +

        '.lm-ji{width:50px;height:50px;border-radius:50%;' +
        'background:radial-gradient(circle,rgba(1,217,204,.28) 0%,rgba(1,217,204,.06) 100%);background:radial-gradient(circle,color-mix(in srgb,var(--lm-mc,#01d9cc) 28%,transparent) 0%,color-mix(in srgb,var(--lm-mc,#01d9cc) 6%,transparent) 100%);' +
        'border:2px solid rgba(1,217,204,.45);border:2px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 45%,transparent);box-shadow:0 0 8px rgba(1,217,204,.18);box-shadow:0 0 8px color-mix(in srgb,var(--lm-mc,#01d9cc) 18%,transparent);' +
        'position:fixed;display:none;z-index:99999;transform:translate(-50%,-50%);pointer-events:none}' +

        '.lm-z{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
        'background:rgba(0,36,62,.82);background:color-mix(in srgb,var(--lm-pc,#00243e) 82%,transparent);border:1px solid rgba(1,217,204,.45);border:1px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 45%,transparent);' +
        'color:var(--lm-mc,#01d9cc);font:700 14px/1 var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);' +
        'padding:6px 18px;border-radius:20px;pointer-events:none;z-index:100001;' +
        'opacity:0;transition:opacity .2s}.lm-z.on{opacity:1}' +

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
        /* the mass/sector column has the names' size, so its rows stay level with them (at its
         * desktop 17px each row was taller and the column ran far below the names) */
        '#leaderboard-data{font-size:14px!important}#leaderboard-data span{font-size:inherit!important}' +
        /* tighter rows while the leaderboard has to shrink to end above the right-hand controls */
        '#leaderboard-hud.lm-lb-fit #leaderboard-positions,#leaderboard-hud.lm-lb-fit #leaderboard-data{line-height:1.2!important}' +
        '#top5-hud{font-size:85%!important}' +
        '#top5-pos{font-size:13px!important}' +

        /* HUD fade transition */
        '#leaderboard-hud,#top5-hud,#stats-hud,#time-hud{transition:opacity .4s ease}' +

        /* minimap tap-to-expand transition */
        '#minimap-hud{transition:transform .25s ease!important}' +

        /* ── Persistent portrait overlay (blocks gameplay in portrait) ── */
        '#lm-portrait-ov{position:fixed;top:0;left:0;width:100%;height:100%;z-index:200000;' +
        'background:rgba(0,20,40,.92);display:none;align-items:center;justify-content:center;' +
        'flex-direction:column;gap:16px;color:var(--lm-mc,#01d9cc);font:600 18px/1.5 var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);' +
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
        /* (the dialogs only: module windows with this class scroll inside their own body) */
        /* not the Game Over card: it scrolls inside itself, and a scrolling box around it cut off
         * the death recap shown beside it */
        '.lm-modal-overlay .lm-modal-container{max-height:96vh!important;overflow-y:auto!important}#lm-room-modal{max-height:94vh!important}' +
        '#lm-room-close,.lm-modal-close,#lm-challenges-modal .lm-modal-header>button{min-width:44px!important;min-height:44px!important}' +

        /* ── Compact mobile stats overlay ── */
        '#lm-stats{position:fixed;top:4px;left:4px;z-index:100001;' +
        'font:600 12px/1 var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);color:rgba(255,255,255,.85);' +
        'text-shadow:0 1px 3px rgba(0,0,0,.6);pointer-events:auto;' +
        'user-select:none;-webkit-user-select:none;cursor:pointer;' +
        'transition:top .25s ease}' +
        /* the clock at the top centre: it had only a right edge here and the desktop top (below the
         * leaderboard), which on a phone is below the bottom of the screen. A HUD layout that places
         * the clock wins (its rule is more specific). */
        '#time-hud{position:fixed!important;top:4px!important;bottom:auto!important;left:50%!important;right:auto!important;' +
        'transform:translateX(-50%) scale(0.75)!important;transform-origin:top center!important}' +
        '#chat-box,#messages{position:fixed!important;left:4px!important}' +
        '#message-box{position:fixed!important;left:50%!important;bottom:72px!important;transform:translate(-50%,0)!important}' +
        '#toast-container{position:fixed!important}' +
        /* a chat popup's mute button: on desktop it shows on hover, which a touch never gives
         * (shown here, with a thumb-sized tap area around the icon) */
        '.toast .mute-user{display:block!important;padding:8px;margin:-8px}' +
        /* User Scripts window switches ("Runs at start"): the menu is drawn at about 0.6
         * on a phone, which made them 11 px; larger here, so they stay a thumb's size on the screen */
        'label.lm-us-tg{min-height:52px!important}label.lm-us-tg input{width:32px!important;height:32px!important}';

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

        /* ── #helloContainer size and place: the core's menu layout (window.lmMenuFit) owns them.
         * This file had its own fit here (740 px base width, centre origin, its own max-height
         * and a 4 s timer) that undid the core's layout every few seconds; the core refits on
         * resize, orientation, visualViewport and menu size changes, and keeps the layout while
         * the phone keyboard is open for a field in the menu. ── */
        window._lm_fitHC = function () { if (typeof window.lmMenuFit === 'function') window.lmMenuFit(); };
        /* ── Phone visuals: a fainter grid and smaller food than the theme says. The core calls
         * window._lmPhoneVis(true) right before it draws a frame and (false) right after it, so the
         * theme keeps the player's own values: this wrote the reduced ones into the theme itself, so a
         * save or a Theme Workshop preview / Revert kept them (and each load reduced
         * them again), and the player's "Sectors background" setting was turned off. ── */
        (function phoneVisuals() {
            var inGrid = null, outGrid = null, keep = false, grid = null, food = 0;
            /* the player's grid colour at 0.3 of its opacity (a hex colour: 0.15, as before) */
            function fainter(gc) {
                gc = String(gc || '');
                var m = /^rgba?\(([^)]*)\)$/i.exec(gc.trim());
                if (m) {
                    var p = m[1].split(',');
                    if (p.length >= 3) return 'rgba(' + p[0].trim() + ',' + p[1].trim() + ',' + p[2].trim() + ',' + (parseFloat(p[3] || 1) * 0.3).toFixed(2) + ')';
                }
                var h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(gc.trim());
                if (h) {
                    var x = h[1].length === 3 ? h[1].replace(/(.)/g, '$1$1') : h[1];
                    return 'rgba(' + parseInt(x.slice(0, 2), 16) + ',' + parseInt(x.slice(2, 4), 16) + ',' + parseInt(x.slice(4, 6), 16) + ',0.15)';
                }
                return 'rgba(0,36,62,.15)';
            }
            window._lmPhoneVis = function (on) {
                if (typeof defaultSettings === 'undefined' || !defaultSettings) return;
                /* a frame that threw before its end: the player's values back first */
                if (keep) { defaultSettings.gridColor = grid; defaultSettings.foodSize = food; keep = false; }
                if (!on) return;
                grid = defaultSettings.gridColor; food = defaultSettings.foodSize; keep = true;
                if (grid !== inGrid) { inGrid = grid; outGrid = fainter(grid); }
                defaultSettings.gridColor = outGrid;
                /* 60 % of the food size (at least 1; 0 stays 0) */
                if (food > 0) defaultSettings.foodSize = Math.max(1, Math.round(food * 0.6));
            };
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
            '<span data-i18n-html="misc.mobile.rotate">' + T('misc.mobile.rotate') + '</span>' +
            '<div style="font-size:13px;opacity:.6;margin-top:8px">' + tx('misc.mobile.landscape') + '</div>';
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


        /* ═══════════════════════════════════════════════════════
         *  DOM — Game-controller layout
         *
         *  LEFT  (#lm-mc-l) — utilities:  ☰ 💬  /  🤖 ⏸
         *  RIGHT (#lm-mc-r) — actions:    [2×][16×] / ⚔ / ⬤
         *
         *  Left thumb  = joystick (canvas touch)
         *  Right thumb = combat actions (split / feed)
         * ═══════════════════════════════════════════════════════ */

        /* ═══════════════════════════════════════════════════════
         *  USER PREFERENCES (localStorage)
         * ═══════════════════════════════════════════════════════ */
        var PREF_KEY = 'lm-mobile-prefs';
        var prefs = { btnOpacity: 0.65, btnScale: 1.0, hudFade: 0.35, targetMode: false, swipeSplit: false, muteVibration: false, tapHaptic: false, quickCmds: false, mbButton: false, stopOnRelease: false, pingBtn: false, fixedJoystick: false, lbCompact: false, zoomBtns: false, freeSpecBtn: false, jsSize: 1, jsOpacity: 1, respawnBtn: false };
        /* removed option (a saved value is skipped): the joystick dead zone (always 8 px) */
        /* the built-in values; readPrefs() starts from them, so a key missing in storage (a
         * removed or older store) falls back to its default */
        var PREF_DEFAULTS = JSON.parse(JSON.stringify(prefs));
        /* reads lm-mobile-prefs into the same prefs object (the host API hands it out) */
        function readPrefs() {
            for (var dk in PREF_DEFAULTS) if (Object.prototype.hasOwnProperty.call(PREF_DEFAULTS, dk)) prefs[dk] = PREF_DEFAULTS[dk];
            try {
                var saved = JSON.parse(localStorage.getItem(PREF_KEY));
                if (saved) {
                    /* numbers within their slider's range (a settings import can bring these too):
                     * a string or NaN here broke the button layout */
                    var num = function (v, min, max, def) {
                        v = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
                        return typeof v === 'number' && isFinite(v) ? Math.min(max, Math.max(min, v)) : def;
                    };
                    if (saved.btnOpacity !== undefined) prefs.btnOpacity = num(saved.btnOpacity, 0.2, 1, prefs.btnOpacity);
                    if (saved.btnScale !== undefined) prefs.btnScale = num(saved.btnScale, 0.5, 1.5, prefs.btnScale);
                    if (saved.hudFade !== undefined) prefs.hudFade = num(saved.hudFade, 0, 1, prefs.hudFade);
                    if (saved.targetMode !== undefined) prefs.targetMode = !!saved.targetMode;
                    if (saved.swipeSplit !== undefined) prefs.swipeSplit = !!saved.swipeSplit;
                    if (saved.muteVibration !== undefined) prefs.muteVibration = !!saved.muteVibration;
                    if (saved.tapHaptic !== undefined) prefs.tapHaptic = !!saved.tapHaptic;
                    if (saved.quickCmds !== undefined) prefs.quickCmds = !!saved.quickCmds;
                    if (saved.mbButton !== undefined) prefs.mbButton = !!saved.mbButton;
                    if (saved.stopOnRelease !== undefined) prefs.stopOnRelease = !!saved.stopOnRelease;
                    if (saved.pingBtn !== undefined) prefs.pingBtn = !!saved.pingBtn;
                    if (saved.fixedJoystick !== undefined) prefs.fixedJoystick = !!saved.fixedJoystick;
                    if (saved.lbCompact !== undefined) prefs.lbCompact = !!saved.lbCompact;
                    if (saved.jsSize !== undefined) prefs.jsSize = num(saved.jsSize, 0.5, 2, prefs.jsSize);
                    if (saved.jsOpacity !== undefined) prefs.jsOpacity = num(saved.jsOpacity, 0.2, 1, prefs.jsOpacity);
                    if (saved.respawnBtn !== undefined) prefs.respawnBtn = !!saved.respawnBtn;
                    if (saved.zoomBtns !== undefined) prefs.zoomBtns = !!saved.zoomBtns;
                    if (saved.freeSpecBtn !== undefined) prefs.freeSpecBtn = !!saved.freeSpecBtn;
                }
            } catch (e) { }
        }
        readPrefs();
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
        /* wave button: sends an ordinary team wave (the hand-wave, type 4) */
        var bWave = mkd('👋');
        bWave.classList.add('lm-nomenu');
        
        drawer.appendChild(bAI);
        drawer.appendChild(bPaus);
        /* replay seek: shown only while a replay plays (see syncAiPause) */
        var bRwd = mkd('\u23EA'), bFwd = mkd('\u23E9');
        bRwd.style.display = 'none'; bFwd.style.display = 'none';
        drawer.appendChild(bRwd);
        drawer.appendChild(bFwd);
        drawer.appendChild(bChat);
        drawer.appendChild(bWave);

        /* ☰ menu button: leftmost, always visible, toggles helloContainer */
        var bMenu = mkb('☰', null, true);
        rootL.appendChild(bMenu);
        rootL.appendChild(drawer);

        /* ── Settings panel: inside drawer (no fixed position) ── */
        var sp = mk('div'); sp.id = 'lm-sp';
        sp.innerHTML =
            '<label>' + tx('misc.mobile.opacity', 'lm-t') + ' <span id="lm-op-v">' + Math.round(prefs.btnOpacity * 100) + '%</span></label>' +
            '<input type="range" id="lm-op" min="20" max="100" step="5" value="' + Math.round(prefs.btnOpacity * 100) + '">' +
            '<label>' + tx('misc.mobile.btnSize', 'lm-t') + ' <span id="lm-bs-v">' + Math.round(prefs.btnScale * 100) + '%</span></label>' +
            '<input type="range" id="lm-bs" min="50" max="150" step="5" value="' + Math.round(prefs.btnScale * 100) + '">' +
            '<label>' + tx('misc.mobile.hudFade', 'lm-t') + ' <span id="lm-hf-v">' + Math.round(prefs.hudFade * 100) + '%</span></label>' +
            '<input type="range" id="lm-hf" min="10" max="80" step="5" value="' + Math.round(prefs.hudFade * 100) + '">' +
            '<label><input type="checkbox" id="lm-sw"' + (prefs.swipeSplit ? ' checked' : '') + '> ' + tx('misc.mobile.flickSplit', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-novib"' + (prefs.muteVibration ? ' checked' : '') + '> ' + tx('misc.mobile.noVibration', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-stoprel"' + (prefs.stopOnRelease ? ' checked' : '') + '> ' + tx('misc.mobile.stopRelease', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-taphap"' + (prefs.tapHaptic ? ' checked' : '') + '> ' + tx('misc.mobile.tapHaptic', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-qcmd"' + (prefs.quickCmds ? ' checked' : '') + '> ' + tx('misc.mobile.quickChat', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-mbbtn"' + (prefs.mbButton ? ' checked' : '') + '> ' + tx('misc.mobile.mbButton', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-pingbtn"' + (prefs.pingBtn ? ' checked' : '') + '> ' + tx('misc.mobile.pingButton', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-tdir"' + (prefs.targetMode ? ' checked' : '') + '> ' + tx('misc.mobile.touchDir', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-fixjs"' + (prefs.fixedJoystick ? ' checked' : '') + '> ' + tx('misc.mobile.fixedJoystick', 'lm-t') + '</label>' +
            /* the joystick's drawn size (its knob's travel grows with it) and opacity; 100 % = as before */
            '<label>' + tx('pkg.agm.jsSize', 'lm-t') + ' <span id="lm-jss-v">' + Math.round(prefs.jsSize * 100) + '%</span></label>' +
            '<input type="range" id="lm-jss" min="50" max="200" step="10" value="' + Math.round(prefs.jsSize * 100) + '">' +
            '<label>' + tx('pkg.agm.jsOpacity', 'lm-t') + ' <span id="lm-jso-v">' + Math.round(prefs.jsOpacity * 100) + '%</span></label>' +
            '<input type="range" id="lm-jso" min="20" max="100" step="5" value="' + Math.round(prefs.jsOpacity * 100) + '">' +
            '<label><input type="checkbox" id="lm-lbc"' + (prefs.lbCompact ? ' checked' : '') + '> ' + tx('misc.mobile.lbCompact', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-zoombtn"' + (prefs.zoomBtns ? ' checked' : '') + '> ' + tx('misc.mobile.zoomBtns', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-freespec"' + (prefs.freeSpecBtn ? ' checked' : '') + '> ' + tx('misc.mobile.freeSpec', 'lm-t') + '</label>' +
            '<label><input type="checkbox" id="lm-respbtn"' + (prefs.respawnBtn ? ' checked' : '') + '> ' + tx('pkg.agm.respawnBtn', 'lm-t') + '</label>' +
            /* move, resize, fade or hide each touch control (LMmobile-editor.js, loaded on the first tap) */
            '<button type="button" id="lm-ed-open">' + tx('misc.mobile.editControls') + '</button>';
        drawer.appendChild(sp);

        /* The panel only shows with class "on", and nothing ever added it, so joystick
         * sensitivity, opacity, button size and flick split could not be changed. */
        var bCfg = mkd('⚙');
        drawer.insertBefore(bCfg, sp);
        /* stable insertion point for drawer controls: sp (the settings panel) is never moved
         * by the editor, so inserting before it always works. When the editor moves bCfg to a
         * slot, insertBefore(el, bCfg) would throw — this helper avoids that everywhere. */
        function drawerInsert(el) {
            drawer.insertBefore(el, sp);
        }
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
            /* important: the stylesheet locks #lm-mc-l with transform:none!important, which beat a
             * plain inline scale, so Button size never reached the left group */
            rootL.style.setProperty('transform', 'scale(' + prefs.btnScale + ')', 'important');
            rootL.style.transformOrigin = 'bottom left';
            /* the gear panel sits in that group: it keeps its own size, so its texts and sliders
             * stay readable at every button size */
            sp.style.zoom = prefs.btnScale === 1 ? '' : String(1 / prefs.btnScale);
            rootR.style.transform = 'scale(' + prefs.btnScale + ')';
            rootR.style.transformOrigin = 'bottom right';
            smallR.style.transform = 'scale(' + prefs.btnScale + ')';
            smallR.style.transformOrigin = 'bottom right';
            joystickLook();
            layoutRefresh();
        }
        /* joystick size and opacity (gear panel); at 100 % the stylesheet's own 120 / 50 px and full
         * opacity, as before */
        function joystickLook() {
            var k = prefs.jsSize || 1, o = prefs.jsOpacity;
            JR = 55 * k;
            [[jO, 120], [jI, 50]].forEach(function (j) {
                var px = k === 1 ? '' : Math.round(j[1] * k) + 'px';
                if (j[0].style.width !== px) { j[0].style.width = px; j[0].style.height = px; }
                var op = o >= 1 ? '' : String(o);
                if (j[0].style.opacity !== op) j[0].style.opacity = op;
            });
        }

        /* slider handlers — M6: save on 'change' (slider release) not every 'input' tick */
        sp.querySelector('#lm-op').addEventListener('input', function () {
            prefs.btnOpacity = parseInt(this.value, 10) / 100;
            sp.querySelector('#lm-op-v').textContent = this.value + '%';
            applyPrefs();
        });
        sp.querySelector('#lm-op').addEventListener('change', function () { savePrefs(); });
        sp.querySelector('#lm-ed-open').addEventListener('click', function () { openEditor(); });
        sp.querySelector('#lm-bs').addEventListener('input', function () {
            prefs.btnScale = parseInt(this.value, 10) / 100;
            sp.querySelector('#lm-bs-v').textContent = this.value + '%';
            applyPrefs();
        });
        /* the left row's room is in screen pixels: refit it for the new size */
        sp.querySelector('#lm-bs').addEventListener('change', function () { savePrefs(); repositionButtons(); });
        sp.querySelector('#lm-hf').addEventListener('input', function () {
            prefs.hudFade = parseInt(this.value, 10) / 100;
            sp.querySelector('#lm-hf-v').textContent = this.value + '%';
        });
        sp.querySelector('#lm-hf').addEventListener('change', function () { savePrefs(); });
        sp.querySelector('#lm-sw').addEventListener('change', function () {
            prefs.swipeSplit = this.checked;
            savePrefs();
        });
        sp.querySelector('#lm-novib').addEventListener('change', function () { prefs.muteVibration = this.checked; savePrefs(); });
        sp.querySelector('#lm-stoprel').addEventListener('change', function () { prefs.stopOnRelease = this.checked; savePrefs(); });
        /* Direction on touch (like agar.io): the touch point is the cursor, no joystick
         * (prefs.targetMode, also read by the joystick) */
        sp.querySelector('#lm-tdir').addEventListener('change', function () {
            prefs.targetMode = this.checked;
            if (prefs.targetMode) jHide();
            savePrefs();
        });
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
                    drawerInsert(b);
                    quickBtns.push(b);
                })(qi);
            }
        }
        buildQuickCmds();
        sp.querySelector('#lm-qcmd').addEventListener('change', function () { prefs.quickCmds = this.checked; savePrefs(); buildQuickCmds(); layoutRefresh(); });
        sp.querySelector('#lm-mbbtn').addEventListener('change', function () { prefs.mbButton = this.checked; savePrefs(); buildMbButton(); if (typeof repositionButtons === 'function') repositionButtons(); layoutRefresh(); });
        sp.querySelector('#lm-pingbtn').addEventListener('change', function () { prefs.pingBtn = this.checked; savePrefs(); buildPingButton(); layoutRefresh(); });
        sp.querySelector('#lm-fixjs').addEventListener('change', function () { prefs.fixedJoystick = this.checked; savePrefs(); });
        sp.querySelector('#lm-jss').addEventListener('input', function () {
            prefs.jsSize = parseInt(this.value, 10) / 100;
            sp.querySelector('#lm-jss-v').textContent = this.value + '%';
            joystickLook();
        });
        sp.querySelector('#lm-jss').addEventListener('change', function () { savePrefs(); });
        sp.querySelector('#lm-jso').addEventListener('input', function () {
            prefs.jsOpacity = parseInt(this.value, 10) / 100;
            sp.querySelector('#lm-jso-v').textContent = this.value + '%';
            joystickLook();
        });
        sp.querySelector('#lm-jso').addEventListener('change', function () { savePrefs(); });
        sp.querySelector('#lm-lbc').addEventListener('change', function () {
            prefs.lbCompact = this.checked;
            savePrefs();
            applyLbCompact();
        });
        sp.querySelector('#lm-zoombtn').addEventListener('change', function () { prefs.zoomBtns = this.checked; savePrefs(); buildZoomButtons(); layoutRefresh(); });
        sp.querySelector('#lm-freespec').addEventListener('change', function () { prefs.freeSpecBtn = this.checked; savePrefs(); buildFreeSpecButton(); layoutRefresh(); });
        sp.querySelector('#lm-respbtn').addEventListener('change', function () { prefs.respawnBtn = this.checked; savePrefs(); buildActionButtons(); layoutRefresh(); });

        /* ── RIGHT side: SPLIT + FEED (positioned by JS relative to minimap) ── */
        var rootR = mk('div'); rootR.id = 'lm-mc-r';
        document.body.appendChild(rootR);

        var bSplit = mkb('⚔', 'misc.mobile.split', false);
        var bFeed = mkb('⬤', 'misc.mobile.feed', false);
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
        var bMb = null, _mbShown = null, _mbListen = false;
        /* Active player indicator: P1 / P2 while a multibox unit exists, else the swap sign. The swap
         * event comes for every change of the unit you control; the last unit closing while the main
         * player has control sends none, so the 500 ms button timer (syncAiPause) checks it too. */
        function syncMbIndicator() {
            if (!bMb) return;
            var lm = window.legendmod, p = window.multiboxPlayerEnabled ? 2 : 1;
            var want = lm && lm.multiBoxPlayerExists ? 'P' + p : '\u21C4';
            if (want === _mbShown && bMb.textContent === want) return;
            _mbShown = want;
            bMb.textContent = want;
            bMb.style.borderColor = want === '\u21C4' ? '' : p === 1 ? 'rgba(1,217,204,.6)' : 'rgba(255,165,0,.6)';
        }
        function buildMbButton() {
            if (bMb && bMb.parentNode) bMb.parentNode.removeChild(bMb);
            bMb = null; _mbShown = null;
            if (!prefs.mbButton) return;
            bMb = mkd('\u21C4');
            /* one listener for every rebuild (each settings change or profile added another one) */
            if (!_mbListen && window.LMEvents && typeof window.LMEvents.on === 'function') {
                _mbListen = true;
                window.LMEvents.on('multiboxSwap', syncMbIndicator);
            }
            bMb.addEventListener('touchstart', function (e) {
                e.preventDefault(); e.stopPropagation();
                debounced(function () {
                    if (typeof application !== 'undefined' && application && typeof application.multiboxswap === 'function') application.multiboxswap();
                    /* update indicator after the swap */
                    setTimeout(syncMbIndicator, 50);
                }, 'mbswap', 250);
            }, { passive: false });
            /* in the left row (the 4x/16x row above the minimap could reach over SPLIT) */
            drawerInsert(bMb);
            syncMbIndicator();
        }
        buildMbButton();
        /* optional team ping (the desktop ping hotkeys): tap = "Go here"; hold (or slide) opens a
         * 4-way choice, slide the thumb towards one and lift to send it (lifting without sliding
         * sends nothing). The ping goes where the joystick aims. */
        var bPing = null, pingRad = null;
        /* [ping type, x, y, icon, text key] */
        var PING_DIRS = [[5, 0, -1, '\u271A', 'misc.mobile.pingHelp'], [6, -1, 0, '\u26A0', 'misc.mobile.pingDanger'],
            [7, 1, 0, '\u279C', 'misc.mobile.pingGo'], [8, 0, 1, '\u2739', 'misc.mobile.pingVirus']];
        function sendPing(type) {
            /* the ping goes where the joystick aims: with the menu open there is no aim (a ping button
             * moved out of the left row, or the open drawer, could still take the tap) */
            if (isMenuVisible()) return;
            if (typeof application !== 'undefined' && application && typeof application.sendTeamPing === 'function') application.sendTeamPing(type);
        }
        /* A3 fix: single theme-change observer for radial colors, disconnected on rebuild */
        var _pingThemeObs = null;
        /* Exposed cancel callback so _syncMenuState can cancel the radial from outside
         * buildPingButton's lexical scope (the holdT timer lives inside it). */
        var _cancelPing = null;
        function buildPingButton() {
            /* B3: cancel any active ping gesture before tearing down the button */
            if (_cancelPing) { _cancelPing(); _cancelPing = null; }
            if (bPing && bPing.parentNode) bPing.parentNode.removeChild(bPing);
            if (pingRad && pingRad.parentNode) pingRad.parentNode.removeChild(pingRad);
            /* A3: disconnect the previous observer before creating a new one */
            if (_pingThemeObs) { _pingThemeObs.disconnect(); _pingThemeObs = null; }
            bPing = null; pingRad = null;
            if (!prefs.pingBtn) return;
            var b = bPing = mkd('\uD83D\uDCCD');
            b.classList.add('lm-nomenu');
            var rad = pingRad = mk('div'); rad.id = 'lm-ping-rad';
            rad.style.cssText = 'position:fixed;display:none;z-index:100002;pointer-events:none;width:0;height:0';
            var items = PING_DIRS.map(function (d) {
                var it = mk('div');
                it.innerHTML = d[3] + ' ' + tx(d[4]);
                it.style.cssText = 'position:absolute;transform:translate(-50%,-50%);left:' + (d[1] * 64) + 'px;top:' + (d[2] * 46) + 'px;' +
                    'white-space:nowrap;padding:6px 10px;border-radius:14px;font:700 13px var(--lm-hud-font,Ubuntu\,Roboto\,sans-serif);color:var(--lm-tc,#fff);' +
                    'background:rgba(0,36,62,.88);background:color-mix(in srgb,var(--lm-pc,#00243e) 88%,transparent);border:1.5px solid rgba(1,217,204,.35);border:1.5px solid color-mix(in srgb,var(--lm-mc,#01d9cc) 35%,transparent)';
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
                var x = Math.max(115, Math.min(window.innerWidth - 115, sx)), y = Math.max(70, Math.min(window.innerHeight - 70, sy));
                rad.style.left = x + 'px';
                rad.style.top = y + 'px';
                rad.style.display = 'block';
                /* a longer translation (Polish "Niebezpieczeństwo") reached past the screen edge:
                 * move the choice in by what its labels need (measured once, on opening) */
                var l = Infinity, r = -Infinity, t = Infinity, bt = -Infinity, m = 4;
                items.forEach(function (it) {
                    var q = it.getBoundingClientRect();
                    l = Math.min(l, q.left); r = Math.max(r, q.right); t = Math.min(t, q.top); bt = Math.max(bt, q.bottom);
                });
                var dx = l < m ? m - l : r > window.innerWidth - m ? window.innerWidth - m - r : 0;
                var dy = t < m ? m - t : bt > window.innerHeight - m ? window.innerHeight - m - bt : 0;
                if (dx) rad.style.left = (x + dx) + 'px';
                if (dy) rad.style.top = (y + dy) + 'px';
            }
            /* M6: Cache radial colors — only refresh on theme change, not every touch move */
            var _cachedSelBg = '', _cachedDefBg = '';
            function refreshRadColors() {
                var _lmSt = getComputedStyle(document.documentElement);
                _cachedSelBg = 'rgba(1,160,150,.95)'; _cachedDefBg = 'rgba(0,36,62,.88)';
                try { var _mc = _lmSt.getPropertyValue('--lm-mc').trim(); if (_mc) _cachedSelBg = _mc; } catch(e){}
                try { var _pc = _lmSt.getPropertyValue('--lm-pc').trim(); if (_pc) _cachedDefBg = _pc; } catch(e){}
            }
            refreshRadColors();
            /* refresh on theme change (a theme changes --lm-mc and --lm-pc) */
            if (typeof MutationObserver !== 'undefined') {
                _pingThemeObs = new MutationObserver(refreshRadColors);
                _pingThemeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
            }
            function setPick(x, y) {
                var dx = x - sx, dy = y - sy;
                pick = 0;
                if (dx * dx + dy * dy >= 256) pick = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 6 : 7) : (dy < 0 ? 5 : 8);
                items.forEach(function (it, i) { it.style.background = PING_DIRS[i][0] === pick ? _cachedSelBg : _cachedDefBg; });
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
            /* expose finish(false) so the menu sync can cancel a held radial from outside */
            _cancelPing = function () { finish(false); };
            drawerInsert(b);
        }
        buildPingButton();
        /* optional zoom in/out buttons: dispatch WheelEvent like the pinch-to-zoom handler */
        var bZoomIn = null, bZoomOut = null;
        function buildZoomButtons() {
            if (bZoomIn && bZoomIn.parentNode) bZoomIn.parentNode.removeChild(bZoomIn);
            if (bZoomOut && bZoomOut.parentNode) bZoomOut.parentNode.removeChild(bZoomOut);
            bZoomIn = null; bZoomOut = null;
            if (!prefs.zoomBtns) return;
            bZoomIn = mkd('+'); bZoomOut = mkd('−');
            bZoomIn.classList.add('lm-nomenu'); bZoomOut.classList.add('lm-nomenu');
            function doZoom(dir) {
                var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
                /* positive deltaY = zoom in (ogario convention, same as the pinch handler) */
                wheel(canvas, dir * 60, cx, cy);
            }
            bZoomIn.addEventListener('touchstart', function (e) {
                e.preventDefault(); e.stopPropagation();
                if (isMenuVisible()) return;
                doZoom(1);
            }, { passive: false });
            bZoomOut.addEventListener('touchstart', function (e) {
                e.preventDefault(); e.stopPropagation();
                if (isMenuVisible()) return;
                doZoom(-1);
            }, { passive: false });
            drawerInsert(bZoomIn); drawerInsert(bZoomOut);
        }
        buildZoomButtons();
        /* optional free spectate button: toggles free spectate mode */
        var bFreeSpec = null;
        function buildFreeSpecButton() {
            if (bFreeSpec && bFreeSpec.parentNode) bFreeSpec.parentNode.removeChild(bFreeSpec);
            bFreeSpec = null;
            if (!prefs.freeSpecBtn) return;
            bFreeSpec = mkd('\uD83D\uDD0D'); /* 🔍 */
            bFreeSpec.addEventListener('touchstart', function (e) {
                e.preventDefault(); e.stopPropagation();
                debounced(function () { freeSpecToggle(window.legendmod); syncFreeSpec(); }, 'fspec', 400);
            }, { passive: false });
            drawerInsert(bFreeSpec);
            syncFreeSpec();
        }
        /* free spectate off when on; from the follow camera (Spectate) or Expanding Land World Spectate
         * on the way the spectate follows switch (_lmSpecFree: from World Spectate a plain Q went to
         * the follow camera instead); else the plain toggle, as the menu button */
        function freeSpecToggle(L) {
            if (!L || typeof L.sendFreeSpectate !== 'function') return;
            if (!L.isFreeSpectate && !L.play && (L.isSpectateEnabled || L._isWorldSpectating) && typeof L._lmSpecFree === 'function') { L._lmSpecFree(); return; }
            L.sendFreeSpectate();
        }
        /* lit while free spectate is on; the game also ends it without this button (a spawn,
         * a server change), so the buttons' 500 ms update checks it too */
        function syncFreeSpec() {
            if (!bFreeSpec) return;
            var on = !!(window.legendmod && window.legendmod.isFreeSpectate);
            if (bFreeSpec.classList.contains('lm-active') !== on) bFreeSpec.classList.toggle('lm-active', on);
        }
        buildFreeSpecButton();
        /* optional Quick respawn button (the Y hotkey's command, application.quickResp: it works with
         * Settings > Quick respawn on, else the button says so) */
        var bResp = null;
        function buildActionButtons() {
            if (bResp && bResp.parentNode) bResp.parentNode.removeChild(bResp);
            bResp = null;
            if (prefs.respawnBtn) {
                bResp = mkd('\u21BB');
                bResp.addEventListener('touchstart', function (e) {
                    e.preventDefault(); e.stopPropagation();
                    debounced(function () {
                        if (typeof defaultmapsettings !== 'undefined' && !defaultmapsettings.quickResp) {
                            if (window.toastr) toastr.info(escH(T('pkg.agm.respawnOff')));
                            return;
                        }
                        if (typeof application !== 'undefined' && application && typeof application.quickResp === 'function') application.quickResp();
                    }, 'resp', 1000);
                }, { passive: false });
                drawerInsert(bResp);
            }
        }
        buildActionButtons();

        var jO = mk('div'); jO.className = 'lm-jo'; document.body.appendChild(jO);
        var jI = mk('div'); jI.className = 'lm-ji'; document.body.appendChild(jI);

        var zP = mk('div'); zP.className = 'lm-z'; document.body.appendChild(zP);
        var zT = null;

        /* apply initial prefs */
        applyPrefs();
        /* lm-mobile-prefs changed from outside (a script or check): read it
         * again and apply all of it at once, including the switches of this panel */
        function reloadPrefs() {
            releaseHeld();
            readPrefs();
            var q = function (id) { return sp.querySelector('#' + id); };
            var setRange = function (id, v, label) { var el = q(id); if (el) el.value = v; var l = q(id + '-v'); if (l) l.textContent = label; };
            setRange('lm-op', Math.round(prefs.btnOpacity * 100), Math.round(prefs.btnOpacity * 100) + '%');
            setRange('lm-bs', Math.round(prefs.btnScale * 100), Math.round(prefs.btnScale * 100) + '%');
            setRange('lm-jss', Math.round(prefs.jsSize * 100), Math.round(prefs.jsSize * 100) + '%');
            setRange('lm-jso', Math.round(prefs.jsOpacity * 100), Math.round(prefs.jsOpacity * 100) + '%');
            setRange('lm-hf', Math.round(prefs.hudFade * 100), Math.round(prefs.hudFade * 100) + '%');
            [['lm-sw', 'swipeSplit'], ['lm-novib', 'muteVibration'], ['lm-stoprel', 'stopOnRelease'], ['lm-taphap', 'tapHaptic'],
                ['lm-qcmd', 'quickCmds'], ['lm-mbbtn', 'mbButton'], ['lm-pingbtn', 'pingBtn'], ['lm-tdir', 'targetMode'],
                ['lm-fixjs', 'fixedJoystick'], ['lm-lbc', 'lbCompact'], ['lm-zoombtn', 'zoomBtns'], ['lm-freespec', 'freeSpecBtn'],
                ['lm-respbtn', 'respawnBtn']
            ].forEach(function (c) { var el = q(c[0]); if (el) el.checked = !!prefs[c[1]]; });
            if (prefs.targetMode) jHide();
            buildQuickCmds();
            buildMbButton();
            buildPingButton();
            buildZoomButtons();
            buildFreeSpecButton();
            buildActionButtons();
            applyLbCompact();
            applyPrefs();
            repositionButtons();
        }

        /* ── Press effects ── */
        [bMenu, bChat, bSplit, bFeed, bDbl, b16, bAI, bPaus, bRwd, bFwd, bWave].forEach(function (b) {
            b.addEventListener('touchstart', function () { b.classList.add('p'); }, { passive: true });
            b.addEventListener('touchend', function () { b.classList.remove('p'); }, { passive: true });
            b.addEventListener('touchcancel', function () { b.classList.remove('p'); }, { passive: true });
        });

        /* wave button handler */
        bWave.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (isMenuVisible()) return; /* B6 */
            debounced(function () {
                if (typeof application !== 'undefined' && application && typeof application.sendTeamWave === 'function') application.sendTeamWave(1);
            }, 'wave', 600);
        }, { passive: false });

        /* ═══════════════════════════════════════════════════════
         *  MENU — toggles helloContainer (show/hide game menu)
         * ═══════════════════════════════════════════════════════ */
        /* B5: triple-tap the ☰ menu button to open the Mobile Controls Editor directly,
         * even when the ⚙ gear button is hidden.  Without this, hiding the gear in the
         * editor would lock the player out of their own configuration. */
        var _menuTapCount = 0, _menuTapTimer = null;
        bMenu.addEventListener('touchstart', function (e) {
            e.preventDefault();
            _menuTapCount++;
            if (_menuTapTimer) clearTimeout(_menuTapTimer);
            _menuTapTimer = setTimeout(function () { _menuTapCount = 0; }, 500);
            if (_menuTapCount >= 3) {
                _menuTapCount = 0;
                if (_menuTapTimer) { clearTimeout(_menuTapTimer); _menuTapTimer = null; }
                openEditor();
                return;
            }
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
            if (isMenuVisible()) return; /* B6: no combat while menu is up */
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
            if (isMenuVisible()) return; /* B6 */
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
            if (isMenuVisible()) return; /* B6 */
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
        setInterval(function () { if (!document.hidden) { syncAiPause(); syncMbIndicator(); syncFreeSpec(); } }, 500);

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
            feedWatch(true);
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
            feedWatch(false);
            /* let go first: the game keeps feeding while a key, mouse or pad button still holds it
             * (window._lmMacroFeedHeld asks this button too) */
            var was = feedMacroOn;
            feedMacroOn = false;
            if (was && typeof application !== 'undefined' && application.macroFeed) application.macroFeed(false);
            clearInterval(feedIv); feedIv = null;
        }
        window._lmMobileFeedStop = feedStop;
        /* a death (with auto respawn it fed the new life) or another server ends a held Feed; the
         * game events are listened to only while it is held (nothing listens otherwise) */
        var feedWatched = false;
        function feedDeath() {
            /* a multibox unit still playing keeps the held Feed (it feeds that unit) */
            if (!(window.legendmod && window.legendmod.multiBoxPlayerExists)) feedStop();
        }
        function feedWatch(on) {
            var E = window.LMEvents;
            if (on === feedWatched || !E || typeof E.on !== 'function') return;
            feedWatched = on;
            E[on ? 'on' : 'off']('death', feedDeath);
            E[on ? 'on' : 'off']('serverChange', feedStop);
        }
        /* true while the Feed button holds the game's macro feed: letting E go must not stop it */
        window._lmMobileFeedHeld = function () { return feedMacroOn; };
        bFeed.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (isMenuVisible()) return; /* B6 */
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
        /* Every input the phone controls hold (a held Feed, the joystick, a pinch, a flick, the ping
         * choice) is let go from this one place whenever something takes the screen or the game away:
         * the menu, a hidden tab, the window losing focus or being left (a call, the app switcher,
         * the page shade), a rotation, the stored controls read again, the control editor,
         * a replay starting or ending. Only the menu and the hidden tab did that before (the menu only
         * through a 2 s check when its change was missed), so a Feed held there kept feeding. Keys and
         * gamepad buttons are not touched (feedStop only ends the feed the Feed button started). */
        function releaseHeld() {
            feedStop();
            if (jId !== null) { jId = null; jHide(); }
            pOn = false; pDist = 0; swStart = null; chatDismissId = null;
            if (_cancelPing) _cancelPing();
        }
        document.addEventListener('visibilitychange', function () { if (document.hidden) releaseHeld(); });
        window.addEventListener('blur', releaseHeld);
        window.addEventListener('pagehide', releaseHeld);
        window.addEventListener('orientationchange', releaseHeld);
        /* the held actions only (Feed, the ping choice), the steering thumb stays: the chat box
         * opening does not take the screen away, but a Feed held through it kept feeding under the
         * keyboard */
        function releaseActions() {
            feedStop();
            if (_cancelPing) _cancelPing();
        }
        if (window.LMEvents && typeof window.LMEvents.on === 'function') {
            window.LMEvents.on('replayStart', releaseHeld);
            window.LMEvents.on('replayStop', releaseHeld);
        }

        /* (game menu is accessed via the drawer — ☰ now only toggles the drawer) */

        /* ═══════════════════════════════════════════════════════
         *  CHAT — Enter (keyCode 13)
         * ═══════════════════════════════════════════════════════ */
        var chatOn = false;
        /* generation counter: every chatOpen and chatClose increments it; delayed
         * callbacks from an older generation are discarded, preventing stale closures
         * from interfering when the player reopens chat quickly. */
        var _chatGen = 0;

        bChat.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            chatOn ? chatClose(true) : chatOpen();
        }, { passive: false });

        /* One Enter listener at a time: closing chat with the 💬 button left the old one
         * attached, and chatClose's own synthetic Enter then ran chatClose again. */
        var chatEnterFn = null;
        var _chatFocusTimer = null;
        /* the text of a dismissed message, in case the game hides its chat box meanwhile (opening
         * the box empties it) */
        var _chatDraft = '';
        function chatShown() {
            var mb = document.getElementById('message-box');
            return !!(mb && mb.getClientRects().length);
        }
        /* the game's own chat box command (the chat hotkey's), not a synthetic Enter: Enter may be
         * bound to something else, and on a box still open with a dismissed draft it SENT the draft */
        function hasGameChat() {
            return typeof application !== 'undefined' && !!application && typeof application.enterChatMessage === 'function';
        }
        function chatOpen() {
            releaseActions();
            chatOn = true;
            var gen = ++_chatGen;
            /* a dismissed message is still in the open box: only the focus comes back */
            if (!chatShown()) {
                if (hasGameChat()) application.enterChatMessage(); else emitKey(13);
                var inp0 = document.getElementById('message');
                if (inp0 && _chatDraft && !inp0.value) inp0.value = _chatDraft;
            }
            _chatDraft = '';
            // Focus immediately (user gesture context) for Firefox
            var inp = document.getElementById('message');
            if (inp) {
                inp.focus();
            }
            // Re-focus after game finishes setup + add Enter handler
            if (_chatFocusTimer) clearTimeout(_chatFocusTimer);
            _chatFocusTimer = setTimeout(function () {
                _chatFocusTimer = null;
                if (!chatOn || gen !== _chatGen) return; /* chat closed or reopened — stale */
                var inp2 = document.getElementById('message');
                if (inp2) {
                    inp2.focus();
                    if (chatEnterFn) inp2.removeEventListener('keydown', chatEnterFn);
                    chatEnterFn = function onEnter(ev) {
                        /* B4: ignore Enter while an IME composition is in progress
                         * (CJK, Korean, etc. — the compositionend fires first on some
                         * keyboards, on others the Enter itself ends the composition) */
                        if (ev.isComposing || ev.keyCode === 229) return;
                        if (ev.keyCode === 13 || ev.key === 'Enter') {
                            inp2.removeEventListener('keydown', onEnter);
                            chatEnterFn = null;
                            setTimeout(function () { if (gen === _chatGen) chatClose(true); }, 50);
                        }
                    };
                    inp2.addEventListener('keydown', chatEnterFn);
                }
            }, 120);
        }

        /**
         * Close the chat, optionally sending the message.
         * @param {boolean} send  true = send the text (Enter / 💬 button); false = dismiss, keep draft
         */
        function chatClose(send) {
            /* clear the stale focus timer so it does not refocus after dismiss */
            if (_chatFocusTimer) { clearTimeout(_chatFocusTimer); _chatFocusTimer = null; }
            var inp = document.getElementById('message');
            /* first, before the synthetic Enter below: it must not reach a leftover listener */
            if (chatEnterFn && inp) inp.removeEventListener('keydown', chatEnterFn);
            chatEnterFn = null;
            /* send: the game's chat command sends the text and closes its box (an empty box just
             * closes); when the Enter key already did that, the box is gone and nothing is sent twice.
             * Dismiss keeps the box and its text. */
            var gameChat = hasGameChat();
            if (send && gameChat && chatShown()) application.enterChatMessage();
            if (!send && inp) _chatDraft = inp.value;
            if (send && !gameChat && inp && inp.value.length > 0) {
                // Send the message by dispatching Enter on the input
                var ev = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', keyCode: 13, which: 13 });
                /* Firefox ignores keyCode/which in the constructor (0): the chat listeners check keyCode 13 */
                if (ev.keyCode !== 13) { try { Object.defineProperty(ev, 'keyCode', { get: function () { return 13; } }); Object.defineProperty(ev, 'which', { get: function () { return 13; } }); } catch (e) { } }
                inp.dispatchEvent(ev);
            }
            if (inp) inp.blur();
            chatOn = false;
            /* B4: increment generation on close too — a delayed chatClose(true) from the
             * same open-generation that fires after dismissal is now stale */
            ++_chatGen;

            /* Only send the cleanup Enter when we actually sent a message.
             * Dismiss (send=false) should NOT dispatch Enter — it was closing the
             * game's chat UI even when the user just tapped away to dismiss.
             * Guard with generation to prevent stale callback from closing a reopened chat. */
            if (send && !gameChat) {
                var closeGen = _chatGen;
                setTimeout(function () {
                    if (closeGen !== _chatGen) return; /* chat reopened — do not send Enter */
                    var msgBox = document.getElementById('message');
                    if (msgBox && (msgBox.offsetParent !== null || msgBox.offsetHeight > 0)) {
                        emitKey(13);
                    }
                }, 50);
            }
        }

        /* Tap canvas while chatting → dismiss without sending (keeps draft).
         * The touch is consumed so it does not trigger steering/flick/split.
         * e.stopImmediatePropagation prevents joystick/swipe handlers on the same target. */
        /* the dismissing finger until it is lifted: a second finger put down meanwhile made a pinch
         * with it (the map zoomed) */
        var chatDismissId = null;
        canvas.addEventListener('touchstart', function (e) {
            if (chatOn) {
                e.preventDefault();
                e.stopImmediatePropagation();
                chatDismissId = e.changedTouches.length ? e.changedTouches[0].identifier : null;
                chatClose(false);
            }
        }, { passive: false });
        function chatDismissEnd(e) {
            if (chatDismissId !== null && tById(e.changedTouches, chatDismissId)) chatDismissId = null;
        }
        canvas.addEventListener('touchend', chatDismissEnd, { passive: true });
        canvas.addEventListener('touchcancel', chatDismissEnd, { passive: true });

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
        var JR = 55 * (prefs.jsSize || 1); /* the knob's travel (joystickLook) */

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
            /* a joystick zone from the control editor: the joystick starts only inside it */
            if (!inJoyZone(t.clientX, t.clientY)) return;
            jId = t.identifier;
            jStartTime = Date.now();
            /* M4: Fixed joystick uses a constant origin at bottom-left quarter;
             * floating joystick appears where the thumb lands */
            if (prefs.fixedJoystick) {
                var jz = joyZone;
                org.x = jz ? (jz.l + jz.r) / 2 : window.innerWidth * 0.2;
                org.y = jz ? (jz.t + jz.b) / 2 : window.innerHeight * 0.7;
            } else {
                org.x = t.clientX; org.y = t.clientY;
            }
            /* Direction on touch: the cell goes toward the touch point, no joystick shown */
            if (prefs.targetMode) { mouseAt(t.clientX, t.clientY); return; }
            /* no mouseAt(thumb position) here: it turned the cell toward wherever the thumb
             * landed (usually bottom-left) on every re-grip; keep the last direction until the
             * thumb moves */
            
            jShow(org.x, org.y, prefs.fixedJoystick ? t.clientX : org.x, prefs.fixedJoystick ? t.clientY : org.y);
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
            /* Direction on touch: the finger is the cursor (released = last direction kept) */
            if (prefs.targetMode) { mouseAt(t.clientX, t.clientY); return; }

            // Both modes use virtual joystick scaling
            var rx0 = t.clientX - org.x, ry0 = t.clientY - org.y;
            var rawD = Math.sqrt(rx0 * rx0 + ry0 * ry0);
            /* M4: Dead zone — movements inside the threshold are ignored */
            if (rawD < 8) return;

            /* only the direction steers: the virtual cursor goes far off screen in the
             * joystick's direction, so how far the thumb is pushed does not change the speed */
            var dx = rx0 * 300;
            var dy = ry0 * 300;
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
         *  TAP TO FOLLOW (spectating only)
         *  A short single tap on a player cell follows that player, as a desktop left click
         *  (legendmod._lmSpecClickAt: never while playing, so in the game every touch stays the
         *  joystick's). A drag, a pinch, a second finger, a long press or a tap on the fixed
         *  joystick never does.
         * ═══════════════════════════════════════════════════════ */
        var TAP_MOVE = 10, TAP_MS = 300; /* px the finger may move, ms it may stay down */
        var tapSt = null; /* {id, x, y, t, moved} of the one finger down, null when it cannot be a tap */
        function tapFollowOk(st, x, y, now, fingersLeft) {
            return !!st && !st.moved && fingersLeft === 0 && now - st.t <= TAP_MS &&
                Math.abs(x - st.x) <= TAP_MOVE && Math.abs(y - st.y) <= TAP_MOVE;
        }
        function tapOnFixedJoy(x, y) {
            if (!prefs.fixedJoystick) return false;
            var jz = joyZone;
            var cx = jz ? (jz.l + jz.r) / 2 : window.innerWidth * 0.2, cy = jz ? (jz.t + jz.b) / 2 : window.innerHeight * 0.7;
            var dx = x - cx, dy = y - cy;
            return dx * dx + dy * dy <= (JR + 10) * (JR + 10);
        }
        canvas.addEventListener('touchstart', function (e) {
            /* e.touches: a finger anywhere (on a button too) makes it a two-finger touch */
            var t = e.changedTouches[0];
            tapSt = !chatOn && e.touches.length === 1 && t ? { id: t.identifier, x: t.clientX, y: t.clientY, t: Date.now(), moved: false } : null;
        }, { passive: true });
        canvas.addEventListener('touchmove', function (e) {
            var t = tapSt && tById(e.changedTouches, tapSt.id);
            if (t && (Math.abs(t.clientX - tapSt.x) > TAP_MOVE || Math.abs(t.clientY - tapSt.y) > TAP_MOVE)) tapSt.moved = true;
        }, { passive: true });
        canvas.addEventListener('touchend', function (e) {
            var st = tapSt, t = st && tById(e.changedTouches, st.id);
            tapSt = null;
            if (!t || !tapFollowOk(st, t.clientX, t.clientY, Date.now(), e.touches.length) || tapOnFixedJoy(t.clientX, t.clientY)) return;
            var L = window.legendmod;
            /* taken: no emulated mouse click after it (it would run the same follow again) */
            if (L && typeof L._lmSpecClickAt === 'function' && L._lmSpecClickAt(e.target, t.clientX, t.clientY) && e.cancelable) e.preventDefault();
        }, { passive: false });
        canvas.addEventListener('touchcancel', function () { tapSt = null; }, { passive: true });

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
                /* one of them is the finger that closed the chat box */
                if (chatDismissId !== null && tById(e.targetTouches, chatDismissId)) return;
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
                    hudPinch(delta);
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

        /* ── HUD scale mode (menu open) ── */
        var hudSaveT = 0;
        function hudPinch(delta) {
            var step = delta * 0.003;
            if (typeof defaultSettings !== 'undefined' && defaultSettings.hudScale !== undefined) {
                /* from the scale shown on this screen: a larger value saved on a bigger screen is shown
                 * at this screen's limit, so the gesture starts there (not from the saved value) */
                var cur = typeof window.lmHudScale === 'function' ? window.lmHudScale() : defaultSettings.hudScale;
                var ns = Math.min(1, Math.max(0.3, cur + step));
                defaultSettings.hudScale = ns;
                if (typeof ogario !== 'undefined') ogario.hudScale = ns;
                /* the Theme > HUD scale path: the in-game HUD follows (only the menu did) and the value
                 * is saved (it was lost on reload unless another theme change saved it) */
                var S = window.Settings;
                if (S && typeof S.setHudScale === 'function') S.setHudScale(); /* queues the menu fit */
                else if (window.lmMenuFit && window.lmMenuFit.queue) window.lmMenuFit.queue(); /* once per frame while pinching */
                var sl = document.getElementById('hudScale-slider'), sv = document.getElementById('hudScale-value');
                if (sl) sl.value = ns;
                if (sv) sv.textContent = String(Math.round(ns * 100) / 100);
                clearTimeout(hudSaveT);
                hudSaveT = setTimeout(function () { if (S && typeof S.saveThemeSettings === 'function') S.saveThemeSettings(); }, 600);
                zP.textContent = '🔍 ' + T('misc.mobile.hudZoom', [Math.round(ns * 100)]);
            }
        }
        /* The open menu (#overlays, the whole screen) lies over the canvas, so a pinch there never
         * reached the canvas handlers and the HUD zoom did nothing: the menu layer takes it too. */
        var menuLayer = document.getElementById('overlays'), mDist = 0;
        if (menuLayer) {
            menuLayer.addEventListener('touchstart', function (e) {
                mDist = e.touches.length === 2 && isMenuVisible() ? dist(e.touches[0], e.touches[1]) : 0;
            }, { passive: true });
            menuLayer.addEventListener('touchmove', function (e) {
                if (!mDist || e.touches.length !== 2 || !isMenuVisible()) return;
                e.preventDefault();
                var nd = dist(e.touches[0], e.touches[1]);
                if (Math.abs(nd - mDist) > 4) {
                    hudPinch(nd - mDist);
                    mDist = nd;
                    zP.classList.add('on');
                    clearTimeout(zT);
                    zT = setTimeout(function () { zP.classList.remove('on'); }, 400);
                }
            }, { passive: false });
            menuLayer.addEventListener('touchend', function (e) { if (e.touches.length < 2) mDist = 0; }, { passive: true });
            menuLayer.addEventListener('touchcancel', function () { mDist = 0; }, { passive: true });
        }

        canvas.addEventListener('touchend', function (e) {
            if (e.targetTouches.length < 2) {
                /* pinch over with one finger still down: that finger steers again */
                if (pOn && e.targetTouches.length === 1 && jId === null && !chatOn && inJoyZone(e.targetTouches[0].clientX, e.targetTouches[0].clientY)) {
                    var t = e.targetTouches[0];
                    jId = t.identifier;
                    /* B2: use the same origin logic as the initial touchstart so a
                     * fixed joystick stays fixed after a pinch gesture ends */
                    if (prefs.fixedJoystick) {
                        var jz = joyZone;
                        org.x = jz ? (jz.l + jz.r) / 2 : window.innerWidth * 0.2;
                        org.y = jz ? (jz.t + jz.b) / 2 : window.innerHeight * 0.7;
                    } else {
                        org.x = t.clientX; org.y = t.clientY;
                    }
                    if (!prefs.targetMode) jShow(org.x, org.y, prefs.fixedJoystick ? t.clientX : org.x, prefs.fixedJoystick ? t.clientY : org.y);
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
         *  MINIMAP TAP-TO-TOGGLE (small ↔ full size)
         * ═══════════════════════════════════════════════════════ */
        (function () {
            var mm = document.getElementById('minimap-hud');
            if (!mm) return;
            var expanded = false, placeT = 0;
            // The mobile stylesheet uses !important, so inline writes must be !important too
            hudTaps();
            mm.addEventListener('touchstart', function (e) {
                e.stopPropagation();
                expanded = !expanded;
                /* Split / Feed and 4x / 16x are placed from the minimap's box: place them again once
                 * its .25 s scale change is done (a ResizeObserver does not see a transform, so the
                 * enlarged minimap covered them until the 5 s poll) */
                clearTimeout(placeT);
                placeT = setTimeout(repositionButtons, 300);
                /* a minimap moved by a HUD layout: 2x of its layout size, kept on screen */
                var he = window.LMHudEditor;
                if (he && he.owns && he.owns('minimap')) { he.boost('minimap', expanded ? 2 : 0); return; }
                // collapse back to the base scale (0.5, or the tablet value set by tabletAware)
                mm.style.setProperty('transform', expanded ? 'scale(1)' : 'scale(' + (mm.dataset.lmBaseScale || '0.5') + ')', 'important');
            }, { passive: true });
        })();


        /* HUD auto-fade removed — only mobile buttons fade, not leaderboard/teamboard/minimap */

        /* ═══════════════════════════════════════════════════════
         *  HELPERS
         * ═══════════════════════════════════════════════════════ */
        function mk(tag) { return document.createElement(tag); }

        /* Texts come from the language packs (developers/i18n/src/misc.json). tx() marks them with
         * data-i18n, so a language change (LMi18n.setLang applies the whole page) updates them. */
        function T(key, vars) { return window.lmT ? window.lmT(key, vars) : key; }
        function escH(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
        function tx(key, cls) {
            return '<span' + (cls ? ' class="' + cls + '"' : '') + ' data-i18n="' + key + '">' + escH(T(key)) + '</span>';
        }

        function mkb(icon, label, isUtil) {
            var b = mk('div');
            b.className = 'lm-b ' + (isUtil ? 'lm-u' : 'lm-a');
            if (label)
                b.innerHTML = '<div class="lm-bi"><span class="i">' + icon + '</span>' + tx(label, 'l') + '</div>';
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
            rootL.style.opacity = String(prefs.hudFade);
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
         *  Tap to expand shows original full stats.
         *  Automatically positions below #top5-hud (teamboard)
         *  when it is visible, so they never overlap.
         *  Respects desktop showStats toggle: hidden when stats off.
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

            /* position #lm-stats below the teamboard (#top5-hud) when it is
             * visible, otherwise at the CSS default (top:4px).  Also respect
             * the desktop "Show game stats" toggle: hide the compact overlay
             * when stats are turned off.  Runs every 500 ms together with the
             * data refresh — cheap because DOM writes are skipped when the
             * value hasn't changed. */
            var _prevTop = '';
            var _prevVis = '';
            function positionStats() {
                /* desktop "Show game stats" toggle */
                var statsOff = typeof defaultmapsettings !== 'undefined' && defaultmapsettings.showStats === false;
                var vis = statsOff ? 'none' : '';
                if (_prevVis !== vis) { mStats.style.display = vis; _prevVis = vis; }
                if (statsOff) return;

                var t5 = document.getElementById('top5-hud');
                var newTop;
                if (t5 && t5.offsetParent !== null && t5.style.display !== 'none') {
                    /* t5 is scaled 0.75× with transform-origin: top left, so the
                     * visual bottom = top + offsetHeight × scale */
                    var scale = parseFloat(t5.dataset.lmBaseScale) || 0.75;
                    newTop = Math.round(t5.offsetTop + t5.offsetHeight * scale + 4) + 'px';
                } else {
                    newTop = '4px';
                }
                if (_prevTop !== newTop) { mStats.style.top = newTop; _prevTop = newTop; }
            }

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

                /* Ping: the value the desktop stats line shows (the controlled multibox
                 * unit's own ping, else the main connection's drawRender.ping); the
                 * desktop stats line is hidden on phones, so this is their only ping */
                var ping = 0;
                var mbUnit = window.multiboxPlayerEnabled && typeof getActiveSpect === 'function' ? getActiveSpect(window.multiboxPlayerEnabled) : null;
                if (mbUnit && mbUnit.ping != null) ping = +mbUnit.ping || 0;
                else if (window.drawRender) ping = +window.drawRender.ping || 0;
                /* no ping while a replay plays, like the desktop stats line: the replay
                 * socket answers no ping of this page (the value left is the old live one) */
                if (window.legendmod && String(window.legendmod.ws || '').indexOf('replay') !== -1) ping = 0;

                var dotText = '';
                if (ping > 0) {
                    var icon = ping <= 80 ? '\ud83d\udfe2' : ping <= 200 ? '\ud83d\udfe1' : '\ud83d\udd34';
                    dotText = icon + ' ' + Math.round(ping) + 'ms';
                }
                if (dot.textContent !== dotText) dot.textContent = dotText;

                positionStats();
            }, 500);
            /* initial position on load */
            positionStats();
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

            var r = mm ? mm.getBoundingClientRect() : null;
            /* a HUD layout moved the minimap away from the bottom right: the buttons keep their
             * own corner instead of following it (they would end up off screen) */
            var he = window.LMHudEditor;
            if (r && he && he.owns && he.owns('minimap') && (r.left + r.width / 2 < vw / 2 || r.top + r.height / 2 < vh / 2)) r = null;
            /* A 0-sized or off-screen rect is a hidden minimap (option off, HUD hidden): the
             * fallback, as without one. Returning kept the buttons around the old minimap spot.
             * This runs every 2.5 s and on resize/rotation, so they move back once it shows. */
            if (r && !(r.width < 10 || r.height < 10 || r.right < 0 || r.bottom < 0)) {
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
                // Fallback: no minimap, or a hidden one
                rootR.style.right = '14px';
                rootR.style.bottom = '4px';
                smallR.style.right = '14px';
                smallR.style.left = 'auto';
                smallR.style.bottom = '160px';
            }
            /* The left row ends before the right-hand controls at the bottom (Split / Feed, the minimap)
             * and wraps upward from there: with the optional buttons on (quick chat, multibox, ping,
             * zoom, free spectate) it ran under Feed, and on a 640 px wide phone past the screen edge.
             * The usual row is shorter than the space, so it stays as it was. */
            var lim = vw - 4;
            [rootR, mm].forEach(function (el) {
                if (!el) return;
                var q = el.getBoundingClientRect();
                if (q.width >= 1 && q.height >= 1 && q.bottom > vh - 120 && q.left < lim) lim = q.left;
            });
            var dmw = Math.floor(Math.max(48, (lim - 8 - drawer.getBoundingClientRect().left) / (prefs.btnScale || 1))) + 'px';
            if (drawer.style.maxWidth !== dmw) drawer.style.maxWidth = dmw;
            /* controls placed in the control editor are not in these groups: they only get
             * clamped to the (maybe rotated or resized) screen */
            layoutRefresh();
            fitLeaderboard();
        }

        /* The leaderboard (top right) and its mass/sector column end above the touch controls
         * and the minimap below them. Expanding Land sends 20 rows: at the normal size they ran
         * down over SPLIT/FEED, 4x/16x and the minimap. Rows get tighter and the box smaller
         * until it fits, never below half size; every row stays. A HUD layout that places the
         * leaderboard sizes it itself. Runs with repositionButtons (resize, rotation, 2.5 s). */
        function fitLeaderboard() {
            var lb = document.getElementById('leaderboard-hud');
            if (!lb) return;
            var he = window.LMHudEditor;
            var hudOwns = he && he.owns && he.owns('leaderboard');
            /* Compact leaderboard (gear panel option): 5 rows, a tap shows 10, then all, then 5 again.
             * The names (#leaderboard-positions) and the mass/sector column (#leaderboard-data) hide the
             * same rows. Your own rows stay: your place when you are lower down and the player / bot
             * count (class "me"; they were hidden from the 6th row on). Done before the fit below, which
             * measured the full height and drew a compact leaderboard smaller than needed. */
            var pos = lb.querySelector('#leaderboard-positions');
            var dta = lb.querySelector('#leaderboard-data');
            var posRows = pos ? pos.querySelectorAll(':scope > span') : [];
            var dtaRows = dta ? dta.querySelectorAll(':scope > span') : [];
            var rowCount = posRows.length;
            var compactOn = prefs.lbCompact && lb._lmExpanded < 2;
            var visibleCount = lb._lmExpanded === 1 ? 10 : 5;
            for (var ri = 0; ri < rowCount; ri++) {
                var hide = compactOn && ri >= visibleCount && !posRows[ri].classList.contains('me');
                var dsp = hide ? 'none' : '';
                if (posRows[ri].style.display !== dsp) posRows[ri].style.display = dsp;
                if (ri < dtaRows.length && dtaRows[ri].style.display !== dsp) dtaRows[ri].style.display = dsp;
            }
            /* A4: compact leaderboard applies even when the HUD editor owns position —
             * scaling is skipped but row visibility still applies */
            if (!hudOwns) {
                var base = parseFloat(lb.dataset.lmBaseScale) || 0.75, s = base;
                var r = lb.getBoundingClientRect();
                if (!(r.width >= 1 && r.height >= 1)) return; /* leaderboard turned off */
                var data = document.getElementById('leaderboard-data');
                /* unscaled size; the mass column is drawn to the left of the box */
                var left = r.right - (lb.offsetWidth + (data ? data.offsetWidth : 0)) * base;
                var top = Infinity, c = window._lmMobileHost ? window._lmMobileHost.controls() : {};
                var els = [document.getElementById('minimap-hud')];
                for (var k in c) if (c[k]) els.push(c[k]);
                els.forEach(function (el) {
                    var q = el.getBoundingClientRect();
                    if (q.width >= 1 && q.height >= 1 && q.right > left && q.left < r.right && q.top > r.top + 8 && q.top < top) top = q.top;
                });
                var height = function () { return Math.max(lb.offsetHeight, data ? data.offsetTop + data.offsetHeight : 0); };
                lb.classList.remove('lm-lb-fit');
                if (top < Infinity && height() * base > top - r.top - 6) {
                    lb.classList.add('lm-lb-fit');
                    s = Math.max(0.5, Math.min(base, (top - r.top - 6) / height()));
                }
                var t = 'scale(' + Math.round(s * 1000) / 1000 + ')';
                if (lb.style.getPropertyValue('transform') !== t) lb.style.setProperty('transform', t, 'important');
            }
        }
        /* the compact leaderboard preference, from one place (its switch, the stored preferences read again, the start):
         * with it on a tap on the leaderboard changes its rows, so the leaderboard takes taps then */
        function applyLbCompact() {
            if (!document.getElementById('leaderboard-hud')) return;
            hudTaps();
            fitLeaderboard();
        }
        /* The minimap (a tap enlarges it) and the compact leaderboard (a tap changes its rows) take
         * taps through inline !important styles, which a stylesheet rule cannot turn off: none while
         * the main menu is open, where on a 640x360 phone they lay over skin slots and buttons */
        function hudTaps() {
            var menu = document.body.classList.contains('lm-menu');
            var pe = function (el, v) {
                if (!el) return;
                if (v === null) { if (el.style.getPropertyValue('pointer-events')) el.style.removeProperty('pointer-events'); }
                else if (el.style.getPropertyValue('pointer-events') !== v) el.style.setProperty('pointer-events', v, 'important');
            };
            pe(document.getElementById('minimap-hud'), menu ? 'none' : 'auto');
            pe(document.getElementById('leaderboard-hud'), prefs.lbCompact ? (menu ? 'none' : 'auto') : null);
        }
        /* M5: Tap leaderboard to toggle compact/expanded */
        (function () {
            var lb = document.getElementById('leaderboard-hud');
            if (!lb) return;
            lb._lmExpanded = 0;
            applyLbCompact();
            lb.addEventListener('touchstart', function (e) {
                if (!prefs.lbCompact) return;
                /* a tap on a player's mass / sector entry targets that player (its click): it does not
                 * also change the rows (that hid the tapped row or took a second action) */
                var t = e.target;
                if (t && t.closest && t.closest('.lb-data')) return;
                e.stopPropagation();
                /* cycle: compact (5) → top 10 → all → compact */
                lb._lmExpanded = (lb._lmExpanded + 1) % 3;
                fitLeaderboard();
            }, { passive: true });
        })();

        /* ═══════════════════════════════════════════════════════
         *  CONTROL EDITOR HOOKS (LMmobile-editor.js)
         *  Without a saved layout ('lm-mobile-layouts') the editor file is not even loaded
         *  and nothing here changes how the controls behave.
         * ═══════════════════════════════════════════════════════ */
        var layoutHook = null; /* set by the editor while a custom layout is in use */
        var joyZone = null;    /* {l, t, r, b} in px: the joystick starts only inside (null = anywhere) */
        function inJoyZone(x, y) {
            return !joyZone || (x >= joyZone.l && x <= joyZone.r && y >= joyZone.t && y <= joyZone.b);
        }
        function layoutRefresh() {
            if (layoutHook) { try { layoutHook(); } catch (e) { } }
        }
        /* a control's place when the layout does not move it */
        function ctlHome(id, el) {
            if (!el) return;
            if (id === 'split') rootR.insertBefore(el, rootR.firstChild);
            else if (id === 'feed') rootR.appendChild(el);
            else if (id === 'x4') smallR.insertBefore(el, smallR.firstChild);
            else if (id === 'x16') smallR.appendChild(el);
            else if (id === 'menu') rootL.insertBefore(el, rootL.firstChild);
            else if (id === 'gear') drawer.insertBefore(el, sp);
            else drawerInsert(el);
        }
        var edLoading = false, edQueue = [];
        function loadEditor(cb) {
            if (window.LMMobileEditor && window.LMMobileEditor.ready) { if (cb) cb(); return; }
            if (cb) edQueue.push(cb);
            if (edLoading) return;
            edLoading = true;
            var s = mk('script');
            s.src = /\/LMmobile\.js(\?|$)/.test(_lmmSrc) ? _lmmSrc.replace(/\/LMmobile\.js/, '/LMmobile-editor.js')
                : 'https://www.legendmod.ml/LMmobile/LMmobile-editor.js?v=' + (window.OgVer || '');
            s.charset = 'utf-8';
            s.onload = function () {
                edLoading = false;
                var q = edQueue; edQueue = [];
                q.forEach(function (f) { try { f(); } catch (e) { } });
            };
            s.onerror = function () { edLoading = false; edQueue = []; };
            document.head.appendChild(s);
        }
        function openEditor() {
            sp.classList.remove('on');
            rootL.style.opacity = prefs.btnOpacity;
            loadEditor(function () { if (window.LMMobileEditor && window.LMMobileEditor.open) window.LMMobileEditor.open(); });
        }
        window._lmMobileHost = {
            prefs: prefs,
            root: { left: rootL, right: rootR, small: smallR, drawer: drawer },
            controls: function () {
                return { split: bSplit, feed: bFeed, x4: bDbl, x16: b16, multibox: bMb,
                    q1: quickBtns[0] || null, q2: quickBtns[1] || null, q3: quickBtns[2] || null, q4: quickBtns[3] || null,
                    chat: bChat, ping: bPing || null, wave: bWave, autoplay: bAI, pause: bPaus,
                    rewind: bRwd, forward: bFwd, gear: bCfg, menu: bMenu,
                    zoomIn: bZoomIn || null, zoomOut: bZoomOut || null, freeSpec: bFreeSpec || null,
                    respawn: bResp || null };
            },
            home: ctlHome,
            setJoyZone: function (z) { joyZone = z || null; },
            setHook: function (fn) { layoutHook = typeof fn === 'function' ? fn : null; },
            reposition: function () { repositionButtons(); },
            /* the stored preferences changed (a script or check): apply them now */
            reloadPrefs: function () { reloadPrefs(); },
            /* the editor covers the screen: no held feed, no joystick, the cell stops */
            pauseInput: function () {
                releaseHeld();
                mouseAt(window.innerWidth / 2, window.innerHeight / 2);
            },
            openEditor: openEditor
        };
        try { if (localStorage.getItem('lm-mobile-layouts')) loadEditor(); } catch (e) { }

        repositionButtons();
        /* M6: Use ResizeObserver on the minimap and canvas for immediate layout updates,
         * with a 5s fallback poll for edge cases (HUD editor, game state changes). */
        (function () {
            var rpTimer = null;
            function debouncedReposition() {
                if (rpTimer) return;
                rpTimer = requestAnimationFrame(function () { rpTimer = null; repositionButtons(); });
            }
            if (typeof ResizeObserver !== 'undefined') {
                var ro = new ResizeObserver(debouncedReposition);
                ro.observe(canvas);
                var mm = document.getElementById('minimap-hud');
                if (mm) ro.observe(mm);
                var lb = document.getElementById('leaderboard-hud');
                if (lb) ro.observe(lb);
            }
            /* Reduced fallback: 5s instead of 2.5s since ResizeObserver catches most changes */
            setInterval(function () { if (!document.hidden) repositionButtons(); }, 5000);
        })();
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
         *  FULLSCREEN ↔ MENU SYNC  (M1: event-driven, replaces 500ms poll)
         *  helloContainer hidden → enter fullscreen (always)
         *  helloContainer visible → exit fullscreen (browser only)
         *  A MutationObserver on #overlays fires immediately on menu show/hide,
         *  with a lightweight 2s fallback for edge cases (jQuery .stop().hide()).
         * ═══════════════════════════════════════════════════════ */
        var _prevMenuVisible = isMenuVisible();
        /* Split/Feed/4x/16x sat above the menu (z-index) and ate its taps; hide them there */
        document.body.classList.toggle('lm-menu', !!_prevMenuVisible);
        hudTaps();

        function _syncMenuState() {
            var nowVisible = isMenuVisible();
            document.body.classList.toggle('lm-menu', !!nowVisible);
            hudTaps();
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
                } else if (nowVisible) {
                    /* Menu appeared (died/opened). It no longer leaves fullscreen: getting back in
                     * needs a tap on Play, so with auto-respawn the phone stayed out of fullscreen
                     * (the browser's own back gesture still exits). A held Feed button stops here. */
                    /* held Feed, joystick (the cell does not drift in the menu), pinch, flick, ping */
                    releaseHeld();
                    /* Close chat if open */
                    if (chatOn) chatClose(false);
                    // Release wake lock when not playing
                    if (window._lmWakeLock) {
                        try { window._lmWakeLock.release(); } catch (e) { }
                        window._lmWakeLock = null;
                    }
                }
                _prevMenuVisible = nowVisible;
            }
        }

        /* Primary: MutationObserver on the overlays element (immediate response) */
        (function () {
            var ov = document.getElementById('overlays');
            if (ov) {
                new MutationObserver(function () { _syncMenuState(); })
                    .observe(ov, { attributes: true, attributeFilter: ['style', 'class'] });
            }
            /* jQuery .stop().hide() animates display/opacity on overlays' children too */
            var hc = document.getElementById('helloContainer');
            if (hc && hc !== ov) {
                new MutationObserver(function () { _syncMenuState(); })
                    .observe(hc, { attributes: true, attributeFilter: ['style', 'class'] });
            }
        })();
        /* Fallback: 2s poll catches any transition the observer misses (e.g. jQuery animations
         * that change computed visibility without a style attribute mutation) */
        setInterval(function () {
            if (!document.hidden) _syncMenuState();
        }, 2000);

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
                    /* the clock is centred on its left edge */
                    if (el) el.style.setProperty('transform', (sel === '#time-hud' ? 'translateX(-50%) ' : '') + 'scale(0.9)', 'important');
                });
                /* fitLeaderboard shrinks from this size */
                var lbh = document.querySelector('#leaderboard-hud');
                if (lbh) lbh.dataset.lmBaseScale = '0.9';
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
            if (!sp.classList.contains('on')) return;
            // If tap is outside the drawer, menu button, and settings panel — close
            if (rootL.contains(e.target)) return;
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
                /* the chat input is #message-box: keep it above the
                 * keyboard where the keyboard only shrinks the visual viewport (iOS, new Chrome) */
                var mb = document.getElementById('message-box');
                if (kbHeight > 100) {
                    // Keyboard is open — shift the chat input above it
                    if (mb) { mb.style.setProperty('bottom', (kbHeight + 8) + 'px', 'important'); mb.style.setProperty('top', 'auto', 'important'); }
                } else {
                    /* top: a HUD layout may place the chat input from the top */
                    if (mb) { mb.style.removeProperty('bottom'); mb.style.removeProperty('top'); }
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
            tc.content = getComputedStyle(document.documentElement).getPropertyValue('--lm-pc').trim() || '#00243e';

            /* PWA manifest is now in play.html <head> — no need to inject here */
        })();
    }
})();
