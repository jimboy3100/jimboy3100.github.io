/**
 * LM Mobile Controls v3.1 — by Jimboy3100
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

    /* ═══════════════════════════════════════════════════════════
     *  CSS
     * ═══════════════════════════════════════════════════════════ */
    var css = document.createElement('style');
    css.id = 'lm-mobile-css';
    css.textContent =
    /* lock down browser zoom — only our JS pinch handler zooms */
    'html,body{touch-action:pan-x pan-y}' +
    'canvas{touch-action:none}' +

    /* ── LEFT container: utilities (bottom-left, above chat area) ── */
    '#lm-mc-l{position:fixed;left:12px;bottom:clamp(30px,8vh,70px);z-index:100000;' +
    'pointer-events:none;user-select:none;-webkit-user-select:none;' +
    'display:flex;flex-direction:column;align-items:flex-start;gap:8px}' +

    /* ── RIGHT container: actions (right side, above minimap) ── */
    '#lm-mc-r{position:fixed;right:12px;bottom:clamp(100px,40vh,280px);z-index:100000;' +
    'pointer-events:none;user-select:none;-webkit-user-select:none;' +
    'display:flex;flex-direction:column;align-items:flex-end;gap:8px}' +

    /* ── Shared button base ── */
    '.lm-b{pointer-events:auto;touch-action:none;cursor:pointer;' +
    'display:flex;align-items:center;justify-content:center;border-radius:50%;' +
    'background:rgba(0,36,62,.65);border:2px solid rgba(1,217,204,.4);' +
    'box-shadow:0 0 12px rgba(1,217,204,.15),inset 0 1px 0 rgba(255,255,255,.06);' +
    'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);' +
    'transition:transform .1s,background .15s,border-color .15s,box-shadow .15s;' +
    'color:rgba(255,255,255,.9);font-family:Ubuntu,Roboto,sans-serif;' +
    'font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,.5)}' +

    '.lm-b.p{transform:scale(.88);background:rgba(1,217,204,.30);' +
    'border-color:rgba(1,217,204,.80);box-shadow:0 0 18px rgba(1,217,204,.35)}' +

    '.lm-a{width:clamp(64px,17vmin,90px);height:clamp(64px,17vmin,90px)}' +

    '.lm-u{width:clamp(46px,12vmin,58px);height:clamp(46px,12vmin,58px);font-size:18px;' +
    'background:rgba(0,47,82,.55);border-color:rgba(1,140,246,.35);' +
    'box-shadow:0 0 8px rgba(1,140,246,.12)}' +
    '.lm-u.p{background:rgba(1,140,246,.25);border-color:rgba(1,140,246,.75)}' +

    '.lm-bi{display:flex;flex-direction:column;align-items:center;gap:1px;pointer-events:none}' +
    '.lm-bi .i{font-size:clamp(20px,5.5vmin,26px);line-height:1}' +
    '.lm-bi .l{font-size:clamp(7px,2vmin,10px);opacity:.65;letter-spacing:1.2px;text-transform:uppercase}' +

    '.lm-s{width:clamp(40px,10vmin,50px);height:clamp(40px,10vmin,50px);font-size:13px;' +
    'background:rgba(0,47,82,.50);border-color:rgba(141,95,230,.35);' +
    'box-shadow:0 0 6px rgba(141,95,230,.10)}' +
    '.lm-s.p{background:rgba(141,95,230,.25);border-color:rgba(141,95,230,.75)}' +

    '.lm-r{display:flex;gap:6px;pointer-events:none}' +

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

    /* ── Lock HUD elements into fixed positions (prevent displacement) ── */
    '#minimap-hud{position:fixed!important;bottom:10px!important;right:10px!important}' +
    '#leaderboard-hud{position:fixed!important;top:10px!important;right:10px!important}' +
    '#top5-hud{position:fixed!important;top:55px!important;left:10px!important}' +
    '#stats-hud{position:fixed!important;left:10px!important}' +
    '#time-hud{position:fixed!important;right:10px!important}' +
    '#chat-box,#messages{position:fixed!important;left:10px!important}' +
    '#message-box{position:fixed!important;left:50%!important;bottom:82px!important;transform:translate(-50%,0)!important}' +
    '#toast-container{position:fixed!important}';

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
        document.addEventListener('gesturestart', function (e) { e.preventDefault(); }, {passive:false});
        document.addEventListener('gesturechange', function (e) { e.preventDefault(); }, {passive:false});
        document.addEventListener('gestureend', function (e) { e.preventDefault(); }, {passive:false});

        /* ── Auto-fullscreen on first touch ── */
        var fsOnce = function () {
            document.removeEventListener('touchstart', fsOnce, true);
            try {
                var r = document.documentElement;
                var fn = r.requestFullscreen || r.webkitRequestFullscreen;
                if (fn && !document.fullscreenElement && !document.webkitFullscreenElement) {
                    fn.call(r);
                }
            } catch(ex) {}
        };
        document.addEventListener('touchstart', fsOnce, {capture:true, passive:true});

        /* ═══════════════════════════════════════════════════════
         *  DOM — Game-controller layout
         *
         *  LEFT  (#lm-mc-l) — utilities:  ☰ 💬 ⛶  /  🤖 ⏸
         *  RIGHT (#lm-mc-r) — actions:    [2×][16×] / ⚔ / ⬤
         *
         *  Left thumb  = joystick (canvas touch)
         *  Right thumb = combat actions (split / feed)
         * ═══════════════════════════════════════════════════════ */

        /* ── LEFT side: utilities ── */
        var rootL = mk('div'); rootL.id = 'lm-mc-l';
        document.body.appendChild(rootL);

        var rowU = mk('div'); rowU.className = 'lm-r';
        var bMenu = mkb('☰', null, true);
        var bChat = mkb('💬', null, true);
        var bFull = mkb('⛶', null, true);
        rowU.appendChild(bMenu); rowU.appendChild(bChat); rowU.appendChild(bFull);
        rootL.appendChild(rowU);

        var rowC = mk('div'); rowC.className = 'lm-r';
        var bAI   = mks('🤖');
        var bPaus = mks('⏸');
        rowC.appendChild(bAI); rowC.appendChild(bPaus);
        rootL.appendChild(rowC);

        /* ── RIGHT side: actions (above minimap) ── */
        var rootR = mk('div'); rootR.id = 'lm-mc-r';
        document.body.appendChild(rootR);

        var rowA = mk('div'); rowA.className = 'lm-r';
        var bDbl = mks('2×');
        var b16  = mks('16×');
        rowA.appendChild(bDbl); rowA.appendChild(b16);
        rootR.appendChild(rowA);

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

        /* ── Press effects ── */
        [bMenu, bChat, bFull, bSplit, bFeed, bDbl, b16, bAI, bPaus].forEach(function (b) {
            b.addEventListener('touchstart',  function () { b.classList.add('p'); },    {passive:true});
            b.addEventListener('touchend',    function () { b.classList.remove('p'); }, {passive:true});
            b.addEventListener('touchcancel', function () { b.classList.remove('p'); }, {passive:true});
        });

        /* ═══════════════════════════════════════════════════════
         *  SPLIT — Space (keyCode 32)
         * ═══════════════════════════════════════════════════════ */
        bSplit.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            emitKey(32);
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  DOUBLE SPLIT — calls application.doubleSplit()
         * ═══════════════════════════════════════════════════════ */
        bDbl.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.doubleSplit)
                application.doubleSplit();
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  SPLIT 16 — calls application.split16()
         * ═══════════════════════════════════════════════════════ */
        b16.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.split16)
                application.split16();
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  AUTOPLAY — calls application.setAutoPlay()
         * ═══════════════════════════════════════════════════════ */
        bAI.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.setAutoPlay)
                application.setAutoPlay();
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  PAUSE — calls application.setPause()
         * ═══════════════════════════════════════════════════════ */
        bPaus.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.setPause)
                application.setPause();
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
        bFeed.addEventListener('touchend',    function () { clearInterval(feedIv); }, {passive:true});
        bFeed.addEventListener('touchcancel', function () { clearInterval(feedIv); }, {passive:true});

        /* ═══════════════════════════════════════════════════════
         *  MENU — ESC (keyCode 27)
         * ═══════════════════════════════════════════════════════ */
        bMenu.addEventListener('touchstart', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (typeof application !== 'undefined' && application.showMenu) {
                application.showMenu();
            } else {
                emitKey(27);
            }
        }, {passive:false});

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

        function lockViewport() {
            var vp = document.querySelector('meta[name="viewport"]');
            if (vp) {
                vp._origContent = vp.getAttribute('content');
                vp.setAttribute('content',
                    'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no');
            }
        }
        function unlockViewport() {
            var vp = document.querySelector('meta[name="viewport"]');
            if (vp && vp._origContent) {
                vp.setAttribute('content', vp._origContent);
            }
        }

        function chatOpen() {
            chatOn = true;
            lockViewport(); // prevent zoom when focusing input
            emitKey(13); // open chat box
            setTimeout(function () {
                var inp = document.getElementById('message');
                if (inp) { inp.focus(); }
                cBar.style.display = 'block';
                rootL.style.visibility = 'hidden';
                rootR.style.visibility = 'hidden';
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
            unlockViewport(); // restore normal viewport
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
                } else {
                    (d.exitFullscreen || d.webkitExitFullscreen).call(d);
                }
            } catch(ex) {}
        }, {passive:false});

        /* ═══════════════════════════════════════════════════════
         *  JOYSTICK — direction persists after finger lift
         * ═══════════════════════════════════════════════════════ */
        var org = {x:0, y:0};
        var jId = null;
        var asp = window.innerWidth / window.innerHeight;
        var JR = 55, JS = 300;

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

            var dx = (t.clientX - org.x) * JS;
            var dy = (t.clientY - org.y) * JS * asp;
            mouseAt(window.innerWidth/2 + dx, window.innerHeight/2 + dy);

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

        console.log('%c LM Mobile v3.1 %c Touch controls loaded ',
            'background:linear-gradient(135deg,#01d9cc,#00243e);color:#fff;font-weight:bold;padding:4px 10px;border-radius:4px 0 0 4px;font-family:Ubuntu,sans-serif',
            'background:#00243e;color:#01d9cc;padding:4px 10px;border-radius:0 4px 4px 0;font-family:Ubuntu,sans-serif');
    }
})();
