/* Dying Light expansion for Legend Mod (by Jimboy3100), loaded on demand by LMexpress.js
 * (opendyinglight). It only changes how the game looks while it is on and can be turned on and
 * off without a reload: nothing of the player's theme, settings, profiles, hotkeys or chat
 * commands is changed or imported. The one thing kept is the switch itself, the gameplay setting
 * dyingLight (saved with the other settings, exported, reset by Restore defaults).
 *
 * window.LMDyingLight:
 *   state 'off' | 'loading' | 'on' | 'disabling', generation (a new number on every enable/disable)
 *   isEnabled(), enable({ confirm }), disable(), intensity(), setIntensity(name)
 *   getFallbackSkinKey(cell): the skin key for an eligible other player's body (one of the six
 *     zombie designs in variants, the same for every cell of one name), else null
 *   particlePalette(), effect(name), setEffect(name, on): the themed death particle colours,
 *     the spawn burst and the Game Over card, each can be suppressed on its own
 *   getBackground(): { url, img, alpha } of the map scene while on, else null
 *   hasForegroundFx(), needsThreatData(), addPart({ name, start(gen, api), stop(), fx, threat, background(), replay(), changed(),
 *     essential }): an essential part that cannot start undoes the whole activation, another one fails alone
 *     changed(): an effect was allowed or suppressed, or the intensity changed, while on
 *   saved(): whether a reload keeps the switch as it is now (true, 'flag' for a turn-off kept in the
 *     old flag, false; null before the first save)
 *   replayLook({ i, cy, ck }) / replayLook(null), replay(), replayScoped(): the look of a replay
 *     recorded with the theme on (ogario/modules/replaystudio.js): see replayLook below
 * LMEvents 'dyingLightChange' { state, enabled, generation } is sent on every state change. */
(function () {
    'use strict';
    var W = window;
    /* loaded twice (an old banner, a cached copy): the first one stays the only one */
    if (W.LMDyingLight && W.LMDyingLight._lm === 1) return;

    var IMG = 'https://www.legendmod.ml/banners/';
    /* the optimized copies (banners/dyinglight/manifest.json): the zombie of
     * defaultSettings.commanderImageDyingLight at the 512 px of the WebGL skin layers; the first
     * scene of the old background chain */
    var SKIN_KEY = IMG + 'dyinglight/skins/zombie-512.webp';
    /* the six cosmetic zombie designs (pictures of the old icons, same 512 px copies; small: the
     * manifest's 256 px copy, used on a phone or a weak device). A player keeps one design by
     * name, so all of its cells and its copies from other connections (Full Map, multibox) look
     * the same and nothing changes with its mass; a design says nothing about how dangerous a
     * player is. */
    function design(id, file) {
        return Object.freeze({ id: id, key: IMG + 'dyinglight/skins/' + file + '-512.webp', small: IMG + 'dyinglight/skins/' + file + '-256.webp' });
    }
    var VARIANTS = Object.freeze([
        design('biter', 'zombie'), design('viral', 'zombie5'), design('volatile', 'volatile'),
        design('demolisher', 'zombiebig'), design('screamer', 'zombie2'), design('nightHunter', 'zombie4')
    ]);
    /* the death particles' colours while on (a fixed few: the particle picture cache stays small) */
    var PARTICLES = Object.freeze(['#a12b30', '#6e1a1d', '#3b0d10']);
    var SPAWN_COLOUR = '#a12b30';
    /* each effect can be suppressed on its own (setEffect); none of them does any work while off */
    var FX = { variants: true, particles: true, spawn: true, gameOver: true, threat: true };
    var SCENE_URL = IMG + 'dyinglight/backgrounds/back0-1920.webp', SCENE_SMALL = IMG + 'dyinglight/backgrounds/back0-1280.webp';
    /* the WebP copy of dyinglightbabyteamboard.png (manifest: teamboard, 3 KB instead of 73 KB) */
    var MINIMAP_URL = IMG + 'dyinglight/interface/teamboard-323.webp';
    /* a picture that does not come is skipped, it never holds the theme back */
    var ASSET_WAIT_MS = 8000;
    var INTENSITIES = { competitive: 1, immersive: 1, nightmare: 1 };

    var state = 'off', generation = 0, intensityV = 'immersive', intensityFrom;
    /* the player's choice (setting dyingLightIntensity, changed by its control under the banner,
     * an import or Undo preset): followed when the setting changes, at the start, at each enable
     * and while on; setIntensity alone (a script) holds until the setting changes again */
    function syncIntensity() {
        var si;
        try { si = W.defaultmapsettings && W.defaultmapsettings.dyingLightIntensity; } catch (e) { return false; }
        if (si === intensityFrom) return false;
        intensityFrom = si;
        if (INTENSITIES[si] !== 1 || si === intensityV) return false;
        intensityV = si;
        return true;
    }
    syncIntensity();
    var job = null;           /* the enable in progress (one at a time) */
    /* url -> Image: the fixed scene, released by the turn-off (the browser's cache has it for the
     * next enable); the zombie skins are loaded by the skin cache like any other skin */
    var assets = {};
    /* a phone or a weak device (decided at each enable): the small scene and the 256 px skins */
    var lite = false;
    /* the switch as last written: true kept, 'flag' kept in the old flag only, false not kept */
    var saved = null;
    var bg = null;            /* frozen { url, img, alpha } while on */
    var parts = [];           /* optional parts other files add (addPart) */
    var running = [];         /* the parts started by this activation, stopped in reverse order */
    var styleEl = null, onSettings = null;
    var byNick = new Map();   /* nick -> design key, at most 512 names, emptied on disable */
    var onSpawn = null, spawnEv = 'spawn', spawnTimer = 0, burstAt = 0;
    /* A replay recorded with the theme on (replayLook): rp is its recorded look { i, cy, ck } (the
     * intensity, the Day and night setting, the director's clock at the replay position), read by
     * the director instead of the player's. scoped: this activation was made only for the replay
     * (the player's switch is off): it is never saved and ends with the replay. rpTried: the
     * replay asked once already (a refused, failed or player-ended start is not tried again until
     * the replay's look ends). */
    var rp = null, scoped = false, rpTried = false;

    function tx(key) { return typeof W.lmT === 'function' ? W.lmT(key) : key; }
    function warn(what, e) { try { console.warn('[Dying Light] ' + what, e); } catch (e2) { } }

    function emit() {
        try {
            if (W.LMEvents && typeof W.LMEvents._has === 'function' && W.LMEvents._has('dyingLightChange')) {
                W.LMEvents.emit('dyingLightChange', { state: state, enabled: state === 'on', generation: generation });
            }
        } catch (e) { warn('dyingLightChange', e); }
    }
    function setState(s) {
        if (state === s) return;
        state = s;
        emit();
    }

    /* The switch, in the gameplay settings. application.saveSettings puts the change in effect
     * at once and throws when the browser refuses to keep it (its storage warning is shown once
     * until a save works again), so the theme is on or off for this visit either way; this tells
     * whether a reload keeps it: true kept, 'flag' (a turn-off only) kept in the small old flag
     * dyinglight1load, which the next start reads before the setting (lmDyingLightStartup in
     * LMexpress.js moves it into dyingLight), false not kept. A turn-off that is not kept at all is
     * told to the player (it would be back after a reload). */
    function persist(on) {
        var s = W.defaultmapsettings, ok = true;
        /* Restore defaults / an import is reloading the page: a save now would put the old
         * settings back */
        if (W._lmSettingsReload) return (saved = false);
        if (!s || typeof s !== 'object' || !Object.prototype.hasOwnProperty.call(s, 'dyingLight')) return (saved = false);
        if (s.dyingLight !== on) {
            s.dyingLight = on;
            try { W.application.saveSettings(s, 'ogarioSettings'); } catch (e) { ok = false; }
        }
        if (ok) {
            /* the old flag goes only once the setting is kept */
            try { W.localStorage.removeItem('dyinglight1load'); } catch (e) { }
            return (saved = true);
        }
        if (!on) {
            try { W.localStorage.setItem('dyinglight1load', 'no'); return (saved = 'flag'); } catch (e) { }
            try { if (W.toastr) W.toastr.warning(tx('pkg.dlv4life.notSaved')); } catch (e2) { }
        }
        return (saved = false);
    }

    /* a phone (Legend's isMobile: a coarse pointer only) or a device that reports little memory
     * or few cores; small also a small screen (as the director's small scenes) */
    function weak(screenToo) {
        var n = W.navigator, dm = n && +n.deviceMemory, hc = n && +n.hardwareConcurrency;
        if (W.isMobile === true || (dm > 0 && dm <= 2) || (hc > 0 && hc <= 2)) return true;
        if (!screenToo) return false;
        var sc = W.screen, px = sc ? Math.max(+sc.width || 0, +sc.height || 0) * (+W.devicePixelRatio || 1) : 0;
        return px > 0 && px <= 1500;
    }

    /* one wait per picture, shared by every enable that needs it; a failed one is tried again
     * only by a later enable (no retry loop); the turn-off settles a wait still open */
    function preload(url) {
        var im = assets[url];
        if (im && im._lmOk) return Promise.resolve(im);
        if (im && im._lmWait) return im._lmWait;
        im = new Image();
        im.crossOrigin = 'anonymous';
        assets[url] = im;
        im._lmWait = new Promise(function (resolve) {
            var t = setTimeout(function () { end(false); }, ASSET_WAIT_MS);
            function end(ok) {
                if (!t) return;
                clearTimeout(t);
                t = 0;
                im.onload = im.onerror = null;
                im._lmWait = im._lmEnd = null;
                im._lmOk = ok;
                if (!ok && assets[url] === im) delete assets[url];
                resolve(ok ? im : null);
            }
            im._lmEnd = end;
            im.onload = function () { end(im.naturalWidth > 0); };
            im.onerror = function () { end(false); };
            im.src = url;
        });
        return im._lmWait;
    }
    /* the turn-off: the pictures of this file go (a wait still open ends as failed and its
     * download is dropped); the browser's cache serves the next enable */
    function releaseAssets() {
        var a = assets;
        assets = {};
        for (var url in a) {
            var im = a[url];
            if (!im) continue;
            if (typeof im._lmEnd === 'function') {
                im._lmEnd(false);
                try { if (typeof im.removeAttribute === 'function') im.removeAttribute('src'); } catch (e) { }
            }
        }
    }

    function addStyle() {
        var d = W.document;
        if (!d || !d.documentElement) return;
        if (!styleEl) {
            styleEl = d.createElement('style');
            styleEl.id = 'lm-dl-style';
            /* a minimap picture the player chose (an inline style) stays over this one.
             * i18n-ok: CSS, not a text */
            styleEl.textContent = 'html.lm-dl #minimap-sectors{background-image:url("' + MINIMAP_URL + '");background-size:cover;background-position:center;}' +
                /* the Game Over card in the theme's colours (its own inline colours need
                 * !important); the stat values keep their colours, the buttons and the layout stay */
                'html.lm-dl-go #lm-gameover-modal .lm-go-card{background:#090c0d!important;border-color:#171d20!important;border-top-color:#a12b30!important;' + /* i18n-ok: CSS */
                'box-shadow:0 8px 32px rgba(0,0,0,.75),inset 0 0 48px rgba(161,43,48,.14)!important;}' +
                'html.lm-dl-go #lm-gameover-modal .lm-go-card>div:first-child{background:linear-gradient(180deg,#171d20 0%,#090c0d 100%)!important;border-bottom-color:#3b1215!important;}' +
                'html.lm-dl-go #lm-gameover-modal .lm-go-card>div:first-child>div:last-child{color:#c4383d!important;text-shadow:0 0 8px rgba(161,43,48,.5);}' +
                'html.lm-dl-go #lm-gameover-modal .lm-go-label{color:#d4d8d5!important;}' +
                'html.lm-dl-go #lm-gameover-modal .lm-go-row:hover{background:rgba(161,43,48,.12)!important;}';
        }
        if (!styleEl.parentNode) (d.head || d.documentElement).appendChild(styleEl);
        d.documentElement.classList.add('lm-dl');
    }
    function removeStyle() {
        var d = W.document;
        if (d && d.documentElement) {
            d.documentElement.classList.remove('lm-dl');
            d.documentElement.classList.remove('lm-dl-go');
        }
        if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
    }

    /* The effects (Game Over card, spawn burst; the skin designs and the particle colours are
     * read by the renderers through getFallbackSkinKey / particlePalette) */
    function syncGameOver() {
        var d = W.document;
        if (!d || !d.documentElement) return;
        /* the style is on the page only while the theme is applied */
        if (FX.gameOver && styleEl && styleEl.parentNode) d.documentElement.classList.add('lm-dl-go');
        else d.documentElement.classList.remove('lm-dl-go');
    }
    /* the existing spawn burst (drawRender.startSpawnBurst) in the theme's colour at the own
     * spawn. Expanding Land / Legend World start their own; nothing in a replay, the practice
     * arena or with Reduced motion. The point is the own cells' centre in the frame the burst is
     * drawn in (the cells' own coordinates; getPlayerX() adds mapOffsetX, which put the burst off
     * the player on a server whose border is not centred). No own cell yet: one try 150 ms later.
     * With the multibox players' events (playerSpawned) it is the player that spawned: src is its
     * connection number (0 the main player) and its own cells give the point, so a unit's spawn
     * is not drawn at the main player. */
    function spawnBurst(g, again, src) {
        spawnTimer = 0;
        if (g !== generation || state !== 'on' || !FX.spawn) return;
        var dr = W.drawRender, lm = W.legendmod, ms = W.defaultmapsettings;
        if (!lm || !dr || typeof dr.startSpawnBurst !== 'function') return;
        if (lm.isLegendWorld || lm.serverType === 'expandingland' || (ms && ms.reducedMotion) ||
            (W.LMPractice && W.LMPractice.on) || W._lmEvReplayOn) return;
        var pc = src ? unitCells(src) : lm.playerCells, n = 0, x = 0, y = 0;
        for (var i = 0; pc && i < pc.length; i++) {
            if (!pc[i] || pc[i].removed) continue;
            x += +pc[i].x; y += +pc[i].y; n++;
        }
        if (!n || !isFinite(x) || !isFinite(y)) {
            if (!again) spawnTimer = setTimeout(function () { spawnBurst(g, true, src); }, 150);
            return;
        }
        dr.startSpawnBurst(x / n, y / n, SPAWN_COLOUR);
        burstAt = dr._spawnEffect ? dr._spawnEffect.startTime : 0;
    }
    /* the own cells of a multibox unit (its connection number) from the players' registry
     * (lmMbPlayers; else window.spects for a unit of an older spect.js), once its cells are on
     * this map (transformReady); else null */
    function unitCells(src) {
        var reg = W.lmMbPlayers, sp = reg && typeof reg.getBySource === 'function' ? reg.getBySource(src) : null, list = W.spects;
        for (var i = 0; !sp && list && i < list.length; i++) if (list[i] && list[i].player === true && +list[i].number === src) sp = list[i];
        if (!sp || sp.player !== true || typeof sp.getOwnPlayerCells !== 'function') return null;
        if (typeof sp.transformReady === 'function' && !sp.transformReady()) return null;
        return sp.getOwnPlayerCells();
    }
    /* the players' spawn event: playerSpawned (every player of ours, with its connection number),
     * else (an older core) spawn, the main player's */
    function spawnEvent() { return typeof W.lmMbPlayerEvent === 'function' ? 'playerSpawned' : 'spawn'; }
    function startFx(g) {
        syncGameOver();
        if (onSpawn || !W.LMEvents || typeof W.LMEvents.on !== 'function') return;
        spawnEv = spawnEvent();
        onSpawn = function (e) {
            if (spawnTimer) clearTimeout(spawnTimer);
            spawnTimer = 0;
            /* the event's own context (practice / replay); older cores: the flags in spawnBurst */
            if (e && e.context && e.context !== 'live') return;
            spawnBurst(g, false, e && +e.source > 0 ? +e.source : 0);
        };
        W.LMEvents.on(spawnEv, onSpawn);
    }
    function stopFx() {
        var f = onSpawn;
        onSpawn = null;
        byNick.clear();
        safeCleanup('spawn listener', function () { if (f && W.LMEvents && typeof W.LMEvents.off === 'function') W.LMEvents.off(spawnEv, f); });
        if (spawnTimer) clearTimeout(spawnTimer);
        spawnTimer = 0;
        /* a burst of ours still showing ends with the theme (another one is left alone) */
        var fx = W.drawRender && W.drawRender._spawnEffect;
        if (burstAt && fx && fx.active && fx.startTime === burstAt && fx.color === SPAWN_COLOUR && fx.el === false) fx.active = false;
        burstAt = 0;
    }

    /* a player's design: by name (the same for all of its cells and copies), kept for the
     * activation; a short FNV-1a over the name, once per name */
    function designKey(nick) {
        if (!FX.variants) return lite ? VARIANTS[0].small : SKIN_KEY;
        var k = byNick.get(nick);
        if (k) return k;
        var h = 2166136261;
        for (var i = 0; i < nick.length; i++) h = Math.imul(h ^ nick.charCodeAt(i), 16777619);
        var v = VARIANTS[(h >>> 0) % VARIANTS.length];
        k = lite ? v.small : v.key;
        if (byNick.size >= 512) byNick.clear();
        byNick.set(nick, k);
        return k;
    }

    /* a part whose start throws is stopped at once (what it made before the throw goes; its stop
     * must accept a half start) and is not running; false then */
    function startPart(p, g) {
        try {
            if (typeof p.start === 'function') p.start(g, api);
            running.push(p);
            return true;
        } catch (e) {
            warn('part ' + (p.name || '?') + ' did not start', e);
            try { if (typeof p.stop === 'function') p.stop(); } catch (e2) { warn('part ' + (p.name || '?') + ' did not stop', e2); }
            return false;
        }
    }
    /* the running parts' changed() (an effect allowed or suppressed, the intensity changed) */
    function changed() {
        for (var i = 0; i < running.length; i++) {
            var p = running[i];
            try { if (typeof p.changed === 'function') p.changed(); } catch (e) { warn('part ' + (p.name || '?'), e); }
        }
    }
    function stopParts() {
        while (running.length) {
            var p = running.pop();
            try { if (typeof p.stop === 'function') p.stop(); } catch (e) { warn('part ' + (p.name || '?') + ' did not stop', e); }
        }
    }

    /* true when applied; false when this activation was ended meanwhile (a listener of something
     * a part started turned it off or on anew). Throws when an essential part could not start:
     * the caller undoes everything. An optional part (an effect) may fail alone. */
    function apply(g, scene, url) {
        /* the global flag older scripts may read (cleared by teardown); the zombie pictures are
         * drawn through getFallbackSkinKey, no global image is left behind after disable */
        W.dyinglight1load = 'yes';
        bg = scene ? Object.freeze({ url: url, img: scene, alpha: 1 }) : null;
        addStyle();
        startFx(g);
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i], ok = startPart(p, g);
            if (g !== generation) {
                /* ended during this start: the turn-off did not see this part yet */
                var j = running.indexOf(p);
                if (j >= 0) {
                    running.splice(j, 1);
                    try { if (typeof p.stop === 'function') p.stop(); } catch (e) { warn('part ' + (p.name || '?') + ' did not stop', e); }
                }
                return false;
            }
            if (!ok && p.essential === true) throw new Error('part ' + (p.name || '?') + ' did not start');
        }
        return true;
    }
    /* An import (or a script) that turns the switch off, also while the pictures still load: the
     * theme follows (else the end of the loading would save the switch on again) */
    function listen() {
        if (onSettings) return;
        onSettings = function (d) {
            if (d && d.key === 'dyingLight' && d.value === false && state !== 'off') disable();
            else if (d && d.key === 'dyingLightIntensity' && syncIntensity()) { emit(); changed(); }
        };
        if (W.LMEvents && typeof W.LMEvents.on === 'function') W.LMEvents.on('settingsChange', onSettings);
    }
    function unlisten() {
        var f = onSettings;
        onSettings = null;
        if (f && W.LMEvents && typeof W.LMEvents.off === 'function') W.LMEvents.off('settingsChange', f);
    }
    /* one cleanup step: a step that throws does not keep the next ones from running */
    function safeCleanup(what, fn) {
        try { fn(); } catch (e) { warn('turn-off: ' + what, e); }
    }
    /* everything this file put on the page, and only that */
    function teardown() {
        safeCleanup('parts', stopParts);
        safeCleanup('effects', stopFx);
        safeCleanup('settings listener', unlisten);
        safeCleanup('style', removeStyle);
        safeCleanup('pictures', releaseAssets);
        bg = null;
        W.dyinglight1load = null;
    }

    /* The question before a new activation, in Legend's dialog look (the shared window chrome of
     * lm_extended_ui.js / lmUiKit: .lm-modal-overlay, .lm-modal-container, header, body, footer; the
     * player's theme colours): what it does, the intensity to start with (its setting
     * dyingLightIntensity, as the control under the banner) and that the gameplay settings stay.
     * One at a time; Cancel, Esc, a click beside it or a turn-off meanwhile answer no. Resolves
     * true or false. With no page to show it on, the browser's question. */
    var asking = null, askEnd = null;
    function confirmed() {
        if (asking) return asking;
        var d = W.document, body = d && d.body;
        if (!body || typeof d.createElement !== 'function' || typeof body.appendChild !== 'function') {
            return Promise.resolve(nativeAsk());
        }
        asking = new Promise(function (resolve) {
          var ov = null;
          try {
            try {
                if (typeof W._lmEnsureModalCSS === 'function') W._lmEnsureModalCSS();
                else if (typeof W.lmUiKit === 'function') W.lmUiKit();
            } catch (e) { }
            var s = W.defaultmapsettings, pick = s && INTENSITIES[s.dyingLightIntensity] === 1 ? s.dyingLightIntensity : intensityV;
            var mk = function (tag, cls, text, css) {
                var n = d.createElement(tag);
                if (cls) n.className = cls;
                if (text != null) n.textContent = text;
                if (css) n.style.cssText = css;
                return n;
            };
            /* i18n-ok: CSS */
            ov = mk('div', 'lm-modal-overlay lm-dl-ask', null, 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:999990;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.72)');
            ov.id = 'lm-dl-ask';
            ov.setAttribute('role', 'dialog');
            ov.setAttribute('aria-modal', 'true');
            ov.setAttribute('aria-labelledby', 'lm-dl-ask-title');
            /* i18n-ok: CSS */
            var box = mk('div', 'lm-modal-container', null, 'width:440px;max-width:calc(100vw - 32px);max-height:calc(100vh - 32px);overflow:auto;background:var(--lm-w-surface,var(--lm-pc,#00243e));color:var(--lm-tc,#fff)');
            var head = mk('div', 'lm-modal-header');
            var title = mk('div', 'lm-modal-title', 'Dying Light'); // i18n-ok: name
            title.id = 'lm-dl-ask-title';
            head.appendChild(title);
            var main = mk('div', 'lm-modal-body', null, 'padding:14px 18px;font-size:13px;line-height:1.45'); // i18n-ok: CSS
            main.appendChild(mk('div', null, tx('pkg.dlv4p.intro'), 'margin:0 0 12px'));
            main.appendChild(mk('div', null, tx('pkg.dlv3dir.intensity'), 'font-weight:700;margin:0 0 6px')); // i18n-ok: CSS
            var group = mk('div', null, null, 'display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px'); // i18n-ok: CSS
            group.setAttribute('role', 'group');
            group.setAttribute('aria-label', tx('pkg.dlv3dir.intensity'));
            var opts = [], names = ['competitive', 'immersive', 'nightmare'];
            var mark = function () {
                for (var i = 0; i < opts.length; i++) {
                    var on = opts[i]._lmV === pick;
                    opts[i].setAttribute('aria-pressed', on ? 'true' : 'false');
                    opts[i].style.borderColor = on ? '#a12b30' : 'var(--lm-w-sep,rgba(255,255,255,.15))';
                    opts[i].style.background = on ? 'rgba(161,43,48,.28)' : 'var(--lm-w-btn,rgba(255,255,255,.06))'; // i18n-ok: CSS
                }
            };
            names.forEach(function (v) {
                /* i18n-ok: CSS */
                var b = mk('button', null, null, 'flex:1 1 120px;min-height:var(--lm-w-ctl,28px);padding:6px 8px;text-align:left;cursor:pointer;color:inherit;border:1px solid;border-radius:var(--lm-radius-s,4px)');
                b.type = 'button';
                b._lmV = v;
                b.appendChild(mk('div', null, tx('pkg.dlv3dir.' + v), 'font-weight:700'));
                b.appendChild(mk('div', null, tx('pkg.dlv4p.' + v + 'Tip'), 'font-size:11px;opacity:.8')); // i18n-ok: CSS
                b.addEventListener('click', function (e) { if (e && e.preventDefault) e.preventDefault(); pick = v; mark(); });
                opts.push(b);
                group.appendChild(b);
            });
            mark();
            main.appendChild(group);
            main.appendChild(mk('div', null, tx('pkg.dlv4p.kept'), 'opacity:.85'));
            var foot = mk('div', 'lm-modal-footer', null, 'display:flex;gap:10px;padding:10px 18px'); // i18n-ok: CSS
            /* i18n-ok: CSS */
            var no = mk('button', null, tx('pkg.dlv4p.cancel'), 'flex:1;min-height:var(--lm-w-ctl,32px);cursor:pointer;color:inherit;background:var(--lm-w-btn,rgba(255,255,255,.08));border:1px solid var(--lm-w-sep,rgba(255,255,255,.15));border-radius:var(--lm-radius,6px)');
            /* i18n-ok: CSS */
            var ok = mk('button', null, tx('pkg.dlv3life.turnOn'), 'flex:1;min-height:var(--lm-w-ctl,32px);cursor:pointer;color:#fff;font-weight:700;background:#a12b30;border:1px solid #c4383d;border-radius:var(--lm-radius,6px)');
            no.type = ok.type = 'button';
            foot.appendChild(no);
            foot.appendChild(ok);
            box.appendChild(head);
            box.appendChild(main);
            box.appendChild(foot);
            ov.appendChild(box);
            function onKey(e) {
                if (e && (e.key === 'Escape' || e.keyCode === 27)) { if (e.preventDefault) e.preventDefault(); end(false); }
            }
            function onBack(e) { if (e && e.target === ov) end(false); }
            function end(yes) {
                if (askEnd !== end) return;
                askEnd = null;
                asking = null;
                try { d.removeEventListener('keydown', onKey, true); } catch (e) { }
                if (ov.parentNode) ov.parentNode.removeChild(ov);
                /* the intensity chosen is its setting, saved like the control under the banner does */
                var ms = W.defaultmapsettings;
                if (yes && ms && typeof ms === 'object' && ms.dyingLightIntensity !== pick && !W._lmSettingsReload) {
                    ms.dyingLightIntensity = pick;
                    try { W.application.saveSettings(ms, 'ogarioSettings'); } catch (e) { }
                }
                resolve(!!yes);
            }
            askEnd = end;
            no.addEventListener('click', function () { end(false); });
            ok.addEventListener('click', function () { end(true); });
            ov.addEventListener('click', onBack);
            try { d.addEventListener('keydown', onKey, true); } catch (e) { }
            body.appendChild(ov);
            try { if (typeof ok.focus === 'function') ok.focus(); } catch (e) { }
          } catch (e) {
            /* the page could not show it: the browser's question */
            warn('question', e);
            askEnd = null;
            asking = null;
            try { if (ov && ov.parentNode) ov.parentNode.removeChild(ov); } catch (e2) { }
            resolve(nativeAsk());
          }
        });
        return asking || Promise.resolve(false);
    }
    function nativeAsk() {
        try { return !!W.confirm(tx('pkg.dlv3life.confirm')); } catch (e) { return false; }
    }

    /* opts.confirm: ask first (a new activation); a start with the switch saved on does not ask.
     * Resolves true when on, false when refused, cancelled or failed (then everything is as before). */
    function enable(opts) { return begin(opts, false); }
    /* the player turns on the theme a replay shows: from now on it is the player's own (saved) */
    function own(opts) {
        return (opts && opts.confirm ? confirmed() : Promise.resolve(true)).then(function (yes) {
            if (!yes) return false;
            /* the replay's activation ended while the question was open: a new one of the player's */
            if (state === 'off') return begin(null, false);
            if (state === 'disabling') return false;
            scoped = false;
            if (state === 'on') persist(true);
            emit();
            return state === 'loading' && job ? job : true;
        });
    }
    /* forReplay: an activation for a replay only (replayLook), never saved */
    function begin(opts, forReplay) {
        if (state === 'on') return forReplay || !scoped ? Promise.resolve(true) : own(opts);
        if (state === 'loading' && job) return !forReplay && scoped ? own(opts) : job;
        /* asked from a listener of the turn-off: that one finishes first */
        if (state === 'disabling') return Promise.resolve(false);
        /* the answer comes later: the state may have changed meanwhile, so it starts over */
        if (!forReplay && opts && opts.confirm) return confirmed().then(function (yes) { return yes ? begin(null, false) : false; });
        scoped = !!forReplay;
        /* a change of the setting while it was off (an import) */
        syncIntensity();
        lite = weak(false);
        var g = ++generation;
        /* every listener of dyingLightChange may turn it off (or on anew) at once: after each
         * transition others see, this activation goes on only while it is still the current one */
        setState('loading');
        if (g !== generation) return Promise.resolve(false);
        listen();
        /* the scene only: the zombie skins come through the skin cache when a cell needs one */
        var url = weak(true) ? SCENE_SMALL : SCENE_URL;
        var p = job = preload(url).then(function (scene) {
            /* turned off (or on anew) while the picture came: this activation is over */
            if (g !== generation) return false;
            var done;
            try {
                done = apply(g, scene, url);
            } catch (e) {
                warn('could not start', e);
                if (g === generation) {
                    teardown();
                    generation++;
                    job = null;
                    scoped = false;
                    setState('off');
                    try { if (W.toastr) W.toastr.warning(tx('pkg.dlv3life.failed')); } catch (e3) { }
                }
                return false;
            }
            if (!done || g !== generation) return false;
            /* a replay's activation keeps the player's switch as it is (its settingsChange may
             * end this activation too) */
            if (!scoped) persist(true);
            if (g !== generation) return false;
            job = null;
            setState('on');
            return g === generation && state === 'on';
        });
        return p;
    }

    /* Safe at any time, also while loading or after a failed start; the switch is saved off. A
     * replay showing the theme shows the normal look from then on (rpTried: not turned on again). */
    function disable() {
        /* an open question is answered no */
        if (askEnd) askEnd(false);
        if (rp) rpTried = true;
        rp = null;
        scoped = false;
        if (state === 'off') {
            persist(false);
            return Promise.resolve(true);
        }
        if (state === 'disabling') return Promise.resolve(true);
        /* first: no late callback of this activation may act any more */
        generation++;
        job = null;
        setState('disabling');
        try { teardown(); } catch (e) { warn('teardown', e); }
        persist(false);
        setState('off');
        return Promise.resolve(true);
    }

    /* The end of a replay's own activation: everything it put on the page goes, the switch is not
     * saved (it stayed off the whole time). */
    function endScoped() {
        scoped = false;
        if (state === 'off' || state === 'disabling') return;
        generation++;
        job = null;
        setState('disabling');
        try { teardown(); } catch (e) { warn('teardown', e); }
        setState('off');
    }
    function replayNotify() {
        for (var i = 0; i < running.length; i++) {
            var f = running[i].replay;
            if (typeof f === 'function') { try { f(); } catch (e) { warn('part ' + (running[i].name || '?'), e); } }
        }
    }
    /* Replay Studio, while it plays a replay recorded with the theme on: o = { i: intensity, cy: the
     * Day and night setting (0 = off), ck: the director's clock at the replay position (ms; null or
     * absent: no clock, the fixed scene) }, given again as the position moves. With the theme off
     * it is turned on for the replay only (never saved, no question); with it on, the player's
     * activation shows the recorded look and goes back to the player's own (intensity, cycle,
     * clock) at replayLook(null), the end of that replay. The player's settings are never changed.
     * Sounds and scares stay silent in a replay (the director's replay check). Returns true when
     * the look is (being) shown. */
    function replayLook(o) {
        if (o && typeof o === 'object') {
            var i = INTENSITIES[o.i] === 1 ? o.i : intensityV, cy = o.cy === 0 || o.cy === false ? 0 : 1;
            var ck = typeof o.ck === 'number' && isFinite(o.ck) && o.ck >= 0 ? o.ck : null;
            if (state === 'off') {
                if (rpTried) { rp = null; return false; }
                rpTried = true;
                rp = Object.freeze({ i: i, cy: cy, ck: ck });
                begin(null, true);
                return state !== 'off';
            }
            if (!rp || rp.i !== i || rp.cy !== cy || rp.ck !== ck) rp = Object.freeze({ i: i, cy: cy, ck: ck });
            replayNotify();
            return true;
        }
        rpTried = false;
        if (!rp && !scoped) return false;
        rp = null;
        if (scoped) endScoped(); else replayNotify();
        return true;
    }

    function getFallbackSkinKey(cell) {
        /* the mass from the size (cell.mass is only kept while its mass label is drawn) */
        var mass = cell && cell.size > 0 ? ~~(cell.size * cell.size / 100) : cell && cell.mass;
        if (state !== 'on' || !cell || cell.isFood || cell.isVirus || cell.isEjected || cell.removed ||
            cell.isPlayerCell || cell.isPlayerCellMulti || !(mass > 12) || !cell.targetNick) return null;
        if (typeof W.lmSkinsShown === 'function' && !W.lmSkinsShown()) return null;
        var lm = W.legendmod;
        if (lm && lm.gameMode === ':teams') return null;
        var nick = cell.targetNick;
        return designKey(typeof nick === 'string' ? nick : String(nick));
    }
    function anyRunning(flag) {
        if (state !== 'on') return false;
        for (var i = 0; i < running.length; i++) {
            var f = running[i][flag];
            if (typeof f === 'function' ? f() : f) return true;
        }
        return false;
    }

    var api = {
        _lm: 1,
        isEnabled: function () { return state === 'on'; },
        saved: function () { return saved; },
        enable: enable,
        disable: disable,
        intensity: function () { return intensityV; },
        setIntensity: function (name) {
            /* the setting as it is now was seen: only a later change of it replaces this choice */
            try { intensityFrom = W.defaultmapsettings && W.defaultmapsettings.dyingLightIntensity; } catch (e) { }
            if (!INTENSITIES[name] || name === intensityV) return false;
            intensityV = name;
            emit();
            changed();
            return true;
        },
        getFallbackSkinKey: getFallbackSkinKey,
        replayLook: replayLook,
        /* the recorded look of the replay shown (frozen { i, cy, ck }), else null */
        replay: function () { return state === 'on' ? rp : null; },
        /* on only for a replay (the player's switch is off) */
        replayScoped: function () { return scoped && state !== 'off'; },
        getBackground: function () {
            if (state !== 'on') return null;
            /* a part's scene (the day / night director), else the fixed one; asked every frame */
            for (var i = 0; i < running.length; i++) {
                var f = running[i].background;
                if (typeof f === 'function') {
                    var b = f();
                    if (b) return b;
                }
            }
            return bg;
        },
        /* the zombie designs { id, key } (the keys getFallbackSkinKey gives) */
        variants: VARIANTS,
        /* the death particles' colours while on (unless suppressed), else null: the renderer
         * then keeps each victim's colour */
        particlePalette: function () { return state === 'on' && FX.particles ? PARTICLES : null; },
        /* an effect is on: variants, particles, spawn, gameOver, threat (the director's red edge) */
        effect: function (name) { return state === 'on' && FX[name] === true; },
        /* suppress (false) or allow (true) one effect; it applies at once, the theme stays on */
        setEffect: function (name, on) {
            if (!Object.prototype.hasOwnProperty.call(FX, name)) return false;
            FX[name] = !!on;
            if (name === 'variants') byNick.clear();
            if (name === 'gameOver') syncGameOver();
            changed();
            return true;
        },
        hasForegroundFx: function () { return anyRunning('fx'); },
        needsThreatData: function () { return anyRunning('threat'); },
        /* a part is started with each activation (now, when on) and stopped by disable */
        addPart: function (p) {
            if (!p || typeof p !== 'object' || parts.indexOf(p) >= 0) return false;
            parts.push(p);
            if (state === 'on') startPart(p, generation);
            return true;
        }
    };
    Object.defineProperty(api, 'state', { get: function () { return state; }, enumerable: true });
    Object.defineProperty(api, 'generation', { get: function () { return generation; }, enumerable: true });
    Object.freeze(api);
    W.LMDyingLight = api;
})();

/* The Dying Light director, a part of LMDyingLight started with each activation and stopped by its
 * turn-off. One clock (performance.now, counted only while the tab is visible) and one one-shot
 * timer once a second, no animation frame of its own:
 *   - a local 10 minute scene cycle, scenery only (no game day / night): day 0-3 min, dusk 3-4,
 *     night 4-8, deep night 8-9, dawn 9-10; the next scene loads in the last 30 s of a phase and is
 *     shown once it is there (the renderer cross-fades), a scene that fails is skipped;
 *   - rare events at a slow roll with a cooldown each and a minimum gap between any two: a radio
 *     call (sound and a short story line, through a moment of static), a shadow at the edge of the
 *     screen (400-800 ms), a watcher in a corner, made sounds (a distant scream, a growl, footsteps,
 *     radio static, in Nightmare also breathing and impacts, fuller variants); the night falling
 *     (once a cycle) and a real death (its signal) or a dropped connection while playing;
 *   - its sounds through the Legend mixer (LMNotifications.play, Gameplay channel x master x gain),
 *     at most 2 at a time, never added to the page.
 *   - Immersive / Nightmare: an ambience made for each phase (cross-faded at the change) and a
 *     heartbeat that follows the threat look, synthesized (Web Audio) at the same mixer volume.
 * Intensity: competitive = the fixed scene, only the death / connection signals; immersive = the
 * cycle and rare events; nightmare = more kinds of them, fuller, more often. Nothing happens while the tab is hidden
 * (paused, no catch-up after), in a replay, in the menu or spectating, while typing or on the Game
 * Over window, just after a spawn; no scares or made sounds with the system's reduced motion or a busy page (ticks
 * coming late, or under 30 FPS when the FPS counter is on), which also keeps the scene as it is, and
 * only the slow watcher with Legend's Reduced motion; no figures and no story lines in Stream mode. While on, the
 * menu and HUD show its colours over the player's theme (lmThemeOverride, never saved). */
(function () {
    'use strict';
    var W = window, DL = W.LMDyingLight;
    if (!DL || DL._lm !== 1 || typeof DL.addPart !== 'function' || W.LMDyingLightDirector) return;

    var BASE = 'https://www.legendmod.ml/';
    /* LOAD_MS: the wait for a scene, as the theme's first picture (ASSET_WAIT_MS) */
    var CYCLE_MS = 600000, TICK_MS = 1000, LATE_MS = 250, PRELOAD_MS = 30000, LOAD_MS = 8000;
    /* the scenes of banners/dyinglight/manifest.json for each phase, one per cycle in turn */
    var PHASES = [
        { id: 'day', at: 0, scenes: ['back9', 'back8'] },
        { id: 'dusk', at: 180000, scenes: ['back7', 'back3'] },
        { id: 'night', at: 240000, scenes: ['back0', 'back1'] },
        { id: 'deepNight', at: 480000, scenes: ['back5', 'back2'] },
        { id: 'dawn', at: 540000, scenes: ['back10', 'back6'] }
    ];
    var NIGHT = PHASES[2];
    /* [full, small] widths of the manifest's variants (1920 / 1280 unless listed) */
    var SCENE_W = { back7: [1800, 1200], back8: [1800, 1200] };
    /* The figures: silhouettes drawn for this theme here (SVG, transparent, nothing copied): a
     * hunched lurker that leans in from the side and draws back, and a tall still watcher with
     * two faint eyes; both dark with a thin crimson rim, fading out at the feet. Made into
     * picture addresses once, at the first figure. */
    var SIL = null;
    function silhouettes() {
        if (SIL) return SIL;
        var svg = function (vb, body, extra) {
            /* i18n-ok: SVG */
            return 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '">' +
                '<defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050607"/><stop offset=".72" stop-color="#07090a" stop-opacity=".92"/>' +
                '<stop offset="1" stop-color="#07090a" stop-opacity="0"/></linearGradient></defs>' +
                '<path d="' + body + '" fill="url(#f)" stroke="#a12b30" stroke-opacity=".35" stroke-width="1.2" stroke-linejoin="round"/>' + (extra || '') + '</svg>') + '")';
        };
        SIL = {
            lurker: svg('0 0 120 200', 'M40 200L45 152Q41 134 43 120Q31 106 35 86Q39 64 57 54Q61 46 67 42Q71 31 81 31Q93 33 93 45Q93 55 85 59Q91 65 97 77Q105 91 113 101Q117 107 111 109Q105 105 99 99Q93 93 87 89Q85 101 87 113Q91 119 95 123Q99 129 93 129Q87 125 81 117Q77 113 75 117Q73 135 77 151L83 200L71 200L65 157Q61 147 57 157L53 200Z',
                '<circle cx="86" cy="44" r="1.3" fill="#c4383d" fill-opacity=".55"/>'),
            watcher: svg('0 0 100 220', 'M50 10C60 10 64 20 63 30C62 40 57 46 56 50C66 52 76 56 80 66C84 80 84 100 86 120C88 136 90 150 88 160C86 164 82 162 82 156C80 140 76 120 72 104C70 120 70 140 68 160L66 218L56 218L52 160L48 160L44 218L34 218L32 160C30 140 30 120 28 104C24 120 20 140 18 156C18 162 14 164 12 160C10 150 12 136 14 120C16 100 16 80 20 66C24 56 34 52 44 50C43 46 38 40 37 30C36 20 40 10 50 10Z',
                '<circle cx="45" cy="28" r="1.6" fill="#c4383d" fill-opacity=".7"/><circle cx="55" cy="28" r="1.6" fill="#c4383d" fill-opacity=".7"/>')
        };
        return SIL;
    }
    /* the HUD and the phone controls a figure keeps clear of */
    var HUD_IDS = ['minimap-hud', 'leaderboard-hud', 'top5-hud', 'stats-hud', 'time-hud', 'target-hud', 'chat-box', 'lm-notif-panel', 'lm-mc-l', 'lm-mc-r', 'lm-mc-sm'];
    /* the manifest's suggestedGain (levels the files to one loudness) ... */
    var SOUNDS = { 'radio-join': 0.5, 'radio-spectate': 0.39, 'radio-profile': 0.87, chime: 0.24, 'death-1': 0.15, 'death-2': 1, 'death-3': 1, 'signal-lost': 1 };
    var RADIO = ['radio-join', 'radio-spectate', 'radio-profile'];
    /* ... times the level of its kind (inside the Gameplay channel and master volume) */
    var LEVEL = { radio: 0.32, nightfall: 0.38, death: 0.42 };
    var PROFILES = {
        competitive: { cycle: false, events: false, toasts: false, threat: false, amb: false, hb: false },
        immersive: { cycle: true, events: true, toasts: true, threat: true, rollMs: 30000, chance: 0.35, gapMs: 150000, amb: true, hb: true },
        nightmare: { cycle: true, events: true, toasts: true, threat: true, rollMs: 20000, chance: 0.6, gapMs: 75000, amb: true, hb: true, rich: true }
    };
    /* cooldown of each event and its weight in each phase (none = not then); visual = a scare */
    var EVENTS = {
        radio: { cooldownMs: 120000, w: { day: 1, dusk: 2, night: 2, deepNight: 1, dawn: 1 } },
        shadow: { cooldownMs: 120000, visual: true, sudden: true, w: { dusk: 1, night: 2, deepNight: 3 } },
        watcher: { cooldownMs: 180000, visual: true, w: { night: 1, deepNight: 2 } },
        /* made sounds (synthesized, they need the audio context); nw: Nightmare's weights (more
         * kinds, breathing and impacts only then, each in a fuller variant); jolt: a startling one,
         * off with the Scares switch */
        scream: { cooldownMs: 90000, made: true, jolt: true, w: { night: 1, deepNight: 2 }, nw: { dusk: 1, night: 2, deepNight: 3 } },
        growl: { cooldownMs: 150000, made: true, jolt: true, w: { night: 1, deepNight: 1 }, nw: { dusk: 1, night: 2, deepNight: 2 } },
        footsteps: { cooldownMs: 150000, made: true, w: { dusk: 1, night: 1, deepNight: 1 }, nw: { dusk: 1, night: 2, deepNight: 2 } },
        'static': { cooldownMs: 120000, made: true, w: { day: 1, dusk: 1, night: 1, deepNight: 1, dawn: 1 }, nw: { day: 1, dusk: 1, night: 2, deepNight: 2, dawn: 1 } },
        breathing: { cooldownMs: 240000, made: true, w: {}, nw: { night: 1, deepNight: 2 } },
        impact: { cooldownMs: 180000, made: true, jolt: true, w: {}, nw: { night: 1, deepNight: 2 } }
    };
    var NIGHTFALL_MS = 300000, SPAWN_QUIET_MS = 8000, DEATH_GAP_MS = 10000, SIGNAL_GAP_MS = 30000, MAX_SOUNDS = 2;
    /* the handoff's palette over the player's menu / HUD colours */
    var COLORS = {
        menuMainColor: '#a12b30', menuPanelColor: '#090c0d', menuPanelColor2: '#171d20',
        menuTextColor: '#d4d8d5', menuTextColor2: '#c5a365',
        hudMainColor: '#c5a365', hudColor: 'rgba(9,12,13,0.55)', hudTextColor: '#d4d8d5'
    };
    var CSS = /* i18n-ok: CSS */
        '#toast-container>.lm-dl-toast{background-color:#171d20;background-image:none;border-left:3px solid #a12b30;color:#d4d8d5;' +
        'width:auto;max-width:min(92vw,360px);opacity:.95}' +
        /* a figure: at most 34 % of the short side of the screen (240 px), the watcher half of
         * that; no clicks, never a filter */
        '.lm-dl-ghost{position:fixed;top:40%;height:min(34vmin,240px);width:min(20.4vmin,144px);background:center bottom/contain no-repeat;' +
        'opacity:0;pointer-events:none;will-change:transform,opacity;animation:lm-dl-pass-l .6s ease-in-out forwards}' +
        '.lm-dl-ghost-l{left:calc(min(20.4vmin,144px) * -.22)}.lm-dl-ghost-r{right:calc(min(20.4vmin,144px) * -.22);animation-name:lm-dl-pass-r}' +
        '.lm-dl-watcher{height:min(17vmin,120px);width:min(7.7vmin,55px);animation-name:lm-dl-watch;animation-timing-function:ease-in-out}' +
        '.lm-dl-watcher.lm-dl-ghost-l{left:3vw}.lm-dl-watcher.lm-dl-ghost-r{right:3vw}' +
        '.lm-dl-ghost.lm-dl-calm{animation-name:lm-dl-fade}' +
        /* the lurker leans in from its side and draws back; the watcher stands, breathing */
        '@keyframes lm-dl-pass-l{0%{opacity:0;transform:translateX(-55%)}35%{opacity:var(--lm-dl-a,.55);transform:translateX(0)}' +
        '65%{opacity:var(--lm-dl-a,.55);transform:translateX(6%) rotate(2deg)}100%{opacity:0;transform:translateX(-45%)}}' +
        '@keyframes lm-dl-pass-r{0%{opacity:0;transform:translateX(55%) scaleX(-1)}35%{opacity:var(--lm-dl-a,.55);transform:translateX(0) scaleX(-1)}' +
        '65%{opacity:var(--lm-dl-a,.55);transform:translateX(-6%) scaleX(-1) rotate(2deg)}100%{opacity:0;transform:translateX(45%) scaleX(-1)}}' +
        '@keyframes lm-dl-watch{0%{opacity:0;transform:scale(.97)}40%{opacity:var(--lm-dl-a,.3);transform:scale(1)}' +
        '70%{opacity:var(--lm-dl-a,.3);transform:scale(1.02) rotate(-1deg)}100%{opacity:0;transform:scale(1)}}' +
        '@keyframes lm-dl-fade{0%{opacity:0}40%{opacity:var(--lm-dl-a,.3)}70%{opacity:var(--lm-dl-a,.3)}100%{opacity:0}}';

    function tx(key) { return typeof W.lmT === 'function' ? W.lmT(key) : key; }
    function warn(what, e) { try { console.warn('[Dying Light] ' + what, e); } catch (e2) { } }
    function rnd() { return Math.random(); }
    function setting(k) { var s = W.defaultmapsettings; return s && typeof s === 'object' ? s[k] : undefined; }
    function phaseAt(ms) {
        var t = ((ms % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
        for (var i = PHASES.length - 1; i > 0; i--) if (t >= PHASES[i].at) return PHASES[i];
        return PHASES[0];
    }
    /* a replay recorded with the theme on: its look (LMDyingLight.replayLook), else null */
    function rec() {
        try { return DL.replay(); } catch (e) { return null; }
    }
    function profile(r) {
        var p = null;
        try { p = PROFILES[r ? r.i : DL.intensity()]; } catch (e) { }
        return p || PROFILES.immersive;
    }

    /* -- state of one activation (reset by start and stop) -- */
    var on = false, live = false, gen = 0, timer = 0, acc = 0, runAt = 0, lastTick = 0, late = 0, okTicks = 0, busy = false;
    var phase = null, nextRollAt = 0, lastEventAt = -Infinity, lastAt = {}, lastMajorAt = -Infinity;
    var quietUntil = 0, lastDeathAt = -Infinity, lastSignalAt = -Infinity, deathN = 0, radioN = 0;
    var shown = null, look = null, pend = null, failed = {}, wasRec = false;
    var audios = [], subs = [], onVis = null, styleEl = null, ghostEl = null, ghostUntil = 0, toastEls = [];

    function now() { return W.performance.now(); }
    /* the director's clock: ms of visible time since this activation */
    function clock(t) { return acc + (live ? t - runAt : 0); }
    function hidden() { var d = W.document; return !!(d && d.hidden); }

    function arm() {
        clearTimeout(timer);
        timer = setTimeout(tick, TICK_MS);
    }
    function pause(t) {
        if (live) { acc += t - runAt; live = false; }
        clearTimeout(timer);
        timer = 0;
        stopSounds();
        hideGhost();
        acHold();
    }
    function resume(t) {
        if (!on || live) return;
        live = true;
        runAt = t;
        lastTick = t;
        late = okTicks = 0;
        /* back from a hidden tab: the next roll is a full period away (no burst) */
        var p = profile();
        if (p.events) nextRollAt = Math.max(nextRollAt, clock(t) + p.rollMs);
        arm();
    }
    function tick() {
        timer = 0;
        if (!on) return;
        var t = now();
        if (hidden()) { pause(t); return; }
        /* a busy page: three late ticks in a row (or a low FPS counter); ten on time end it */
        var lateBy = t - lastTick - TICK_MS;
        lastTick = t;
        if (lateBy > LATE_MS) { okTicks = 0; if (++late >= 3) busy = true; }
        else { late = 0; if (++okTicks >= 10) busy = false; }
        var dr = W.drawRender;
        var slow = !!(dr && setting('showStatsFPS') && dr.fps > 0 && dr.fps < 30);
        try { step(clock(t), busy || slow); } catch (e) { warn('director', e); }
        try { sound(); } catch (e) { warn('audio', e); }
        if (on && live) arm();
    }

    function step(E, constrained) {
        var r = rec(), p = profile(r);
        if (r) {
            /* a replay: the scene of its recorded clock and Day and night, no events */
            var rc = p.cycle && r.cy !== 0 && r.ck != null;
            wasRec = true;
            phase = rc ? phaseAt(r.ck) : NIGHT;
            scenes(rc ? r.ck : E, rc, phase, constrained);
            light(rc ? r.ck : E, rc);
            hideGhost();
            return;
        }
        /* back from a replay: its phase is not a change of the player's (no nightfall) */
        if (wasRec) { wasRec = false; phase = null; }
        var cyc = p.cycle && setting('dyingLightCycle') !== false;
        var ph = cyc ? phaseAt(E) : NIGHT;
        if (ph !== phase) {
            var prev = phase;
            phase = ph;
            if (prev && cyc && ph === NIGHT) nightfall(E, p);
        }
        scenes(E, cyc, ph, constrained);
        light(E, cyc);
        if (ghostEl && E > ghostUntil) hideGhost();
        if (p.events && E >= nextRollAt) {
            nextRollAt = E + p.rollMs * (0.7 + 0.6 * rnd());
            roll(E, p, ph, constrained);
        }
    }

    /* -- scenes -- */
    function sceneFor(ph, E) { return ph.scenes[Math.floor(E / CYCLE_MS) % ph.scenes.length]; }
    function sceneUrl(id, small) {
        var w = SCENE_W[id] || [1920, 1280];
        return BASE + 'banners/dyinglight/backgrounds/' + id + '-' + w[small ? 1 : 0] + '.webp';
    }
    function small(constrained) {
        var s = W.screen, px = s ? Math.max(+s.width || 0, +s.height || 0) * (+W.devicePixelRatio || 1) : 0;
        return constrained || !(px > 1500);
    }
    function scenes(E, cyc, ph, constrained) {
        /* a scene that does not come within LOAD_MS of visible time is skipped like a failed one
         * (visible time, read by the tick: no timer of its own) */
        if (pend && !pend.ok && clock(now()) - pend.at > LOAD_MS) { failed[pend.url] = 1; dropPend(); }
        /* no cycle: the fixed scene of the activation */
        if (!cyc) { shown = null; dropPend(); return; }
        /* a busy page keeps the scene it shows */
        if (constrained && shown) return;
        var want = sceneUrl(sceneFor(ph, E), small(constrained));
        if (!shown || shown.url !== want) {
            if (pend && pend.url === want) {
                if (pend.ok) { shown = Object.freeze({ url: want, img: pend.img, alpha: 1 }); pend = null; }
            } else load(want);
            return;
        }
        /* the next phase's scene, in the last 30 s of this one */
        var i = PHASES.indexOf(ph), nx = PHASES[(i + 1) % PHASES.length];
        var end = E - (E % CYCLE_MS) + (i + 1 < PHASES.length ? nx.at : CYCLE_MS);
        if (end - E <= PRELOAD_MS) {
            var nu = sceneUrl(sceneFor(nx, end), small(constrained));
            if (nu !== shown.url && (!pend || pend.url !== nu)) load(nu);
        }
    }
    /* the picture waited for goes; one still loading is dropped (its download too) */
    function dropPend() {
        var p = pend;
        pend = null;
        if (!p) return;
        p.img.onload = p.img.onerror = null;
        if (!p.ok) { try { if (typeof p.img.removeAttribute === 'function') p.img.removeAttribute('src'); } catch (e) { } }
    }
    /* The light of the hour: the scene shown gets darker and its colour turns with the cycle,
     * gradually inside each phase (day clear, dusk a warm dark, night a cold blue-black that
     * deepens, deep night nearly black with a hint of red, dawn lifting it). Only the map's
     * background takes it (drawCustomBackgrounds lays the colour over the scene on the background
     * canvas, under the grid, the cells, the viruses and every label); worked out once a second
     * (a new look only when it changed), nothing per frame. [cycle ms, r, g, b, alpha] */
    var LIGHT = [
        [0, 0, 0, 0, 0], [150000, 10, 8, 6, 0.04], [180000, 34, 14, 8, 0.12], [235000, 12, 10, 14, 0.26],
        [240000, 6, 10, 18, 0.28], [470000, 4, 8, 16, 0.4], [480000, 10, 4, 8, 0.44], [535000, 14, 3, 6, 0.5], [540000, 22, 10, 8, 0.47], [600000, 0, 0, 0, 0]
    ];
    function lightAt(ms) {
        var t = ((ms % CYCLE_MS) + CYCLE_MS) % CYCLE_MS, i = 1;
        while (i < LIGHT.length - 1 && LIGHT[i][0] <= t) i++;
        var a = LIGHT[i - 1], b = LIGHT[i], k = (t - a[0]) / (b[0] - a[0]);
        var c = function (j) { return Math.round(a[j] + (b[j] - a[j]) * k); };
        return { c: 'rgb(' + c(1) + ',' + c(2) + ',' + c(3) + ')', a: Math.round((a[4] + (b[4] - a[4]) * k) * 200) / 200 };
    }
    /* the scene shown with its light (no cycle: no light, the fixed scene as it is) */
    function light(E, cyc) {
        if (!shown) { look = null; return; }
        var g = cyc ? lightAt(E) : null, c = g && g.a > 0 ? g.c : null, a = c ? g.a : 0;
        if (look && look.img === shown.img && look.url === shown.url && look.grade === c && look.gradeA === a) return;
        look = Object.freeze({ url: shown.url, img: shown.img, alpha: shown.alpha, grade: c, gradeA: a });
    }
    /* one picture at a time besides the one shown; a failed one is not asked again this activation */
    function load(url) {
        if (failed[url]) return;
        dropPend();
        var g = gen, im = new W.Image(), p = { url: url, img: im, ok: false, at: clock(now()) };
        pend = p;
        im.crossOrigin = 'anonymous';
        im.onload = function () {
            im.onload = im.onerror = null;
            if (g !== gen || pend !== p) return;
            p.ok = im.naturalWidth > 0;
            if (!p.ok) { failed[url] = 1; pend = null; }
        };
        im.onerror = function () {
            im.onload = im.onerror = null;
            if (g !== gen) return;
            failed[url] = 1;
            if (pend === p) pend = null;
        };
        im.src = url;
    }

    /* -- events -- */
    /* the system asks for reduced motion: no figures at all */
    function noMotion() {
        try { return !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
    }
    /* not a real game: a replay (the old replay server, Replay Studio) or the practice arena */
    function replay() {
        var lm = W.legendmod;
        return !!((lm && lm._isReplay) || W._lmReplayQuiet || W._lmEvReplayOn || (W.LMPractice && W.LMPractice.on));
    }
    /* no rare event now */
    /* one of your players is in a game: the main player or a multibox unit with a life (the
     * players' lifecycle, lmMbAlive / lmMbUnits: the player you control is one of them, and a
     * unit still plays while the main player is dead or in the menu); an older core: the main
     * player */
    var gameUnits = [];
    function inGame() {
        var lm = W.legendmod;
        if (!lm) return false;
        if (typeof W.lmMbAlive !== 'function' || typeof W.lmMbUnits !== 'function') return !!lm.play;
        if (W.lmMbAlive(lm)) return true;
        var u = W.lmMbUnits(gameUnits);
        for (var i = 0; u && i < u.length; i++) if (W.lmMbAlive(u[i])) return true;
        return false;
    }
    function quiet(E) {
        if (hidden() || E < quietUntil || replay()) return true;
        if (!inGame()) return true;
        var d = W.document, a = d && d.activeElement;
        if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable)) return true;
        return !!(d && typeof d.getElementById === 'function' && d.getElementById('lm-gameover-modal'));
    }
    function roll(E, p, ph, constrained) {
        if (E - lastEventAt < p.gapMs || quiet(E) || rnd() >= p.chance) return;
        /* Stream mode (what viewers see stays plain): no figures */
        var scares = setting('dyingLightScares') !== false && !setting('streamMode') && !constrained && !noMotion();
        /* Legend's Reduced motion (on by default): no sudden figure, only the slow faint watcher */
        var calm = !!setting('reducedMotion');
        /* the made sounds: not with the system's reduced motion or a busy page either */
        var made = madeOk(constrained), rich = !!p.rich;
        var total = 0, k, pick = null;
        for (k in EVENTS) total += weight(k, E, ph, scares, calm, made, rich);
        if (!(total > 0)) return;
        var r = rnd() * total;
        for (k in EVENTS) {
            var w = weight(k, E, ph, scares, calm, made, rich);
            if (w > 0) { pick = k; if (r < w) break; r -= w; }
        }
        k = pick;
        lastAt[k] = E;
        lastEventAt = E;
        if (k === 'radio') {
            radioN = radioN % RADIO.length;
            /* the call comes through a moment of static */
            if (made) sfx('static', false, 0.5, 'radioStatic');
            play(RADIO[radioN], LEVEL.radio);
            radioN++;
            if (p.toasts) toast(tx('pkg.dlv3dir.radio' + radioN));
        } else if (EVENTS[k].made) sfx(k, rich);
        else ghost(k === 'watcher', E);
    }
    function weight(k, E, ph, scares, calm, made, rich) {
        var ev = EVENTS[k], w = ((rich && ev.nw) || ev.w)[ph.id] || 0;
        if (!w || (ev.made && !made) || (ev.jolt && setting('dyingLightScares') === false) || (ev.visual && !scares) || (ev.sudden && calm) || (lastAt[k] != null && E - lastAt[k] < ev.cooldownMs)) return 0;
        return w;
    }
    function nightfall(E, p) {
        if (E - lastMajorAt < NIGHTFALL_MS || quiet(E)) return;
        lastMajorAt = E;
        play('chime', LEVEL.nightfall);
        if (p.toasts) toast(tx('pkg.dlv3dir.nightfall'));
    }
    /* a short story line in the Legend toasts (info, its own colours while on) */
    function toast(text) {
        var t = W.toastr;
        /* none in Stream mode (the sound alone) */
        if (!t || typeof t.info !== 'function' || !text || setting('streamMode')) return;
        var s = String(text).slice(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var el = null;
        try { el = t.info(s, '', { toastClass: 'toast lm-dl-toast', timeOut: 6000 }); } catch (e) { }
        /* its own toasts are kept (the ones still on the page) to go with the turn-off */
        for (var i = toastEls.length - 1; i >= 0; i--) { var o = toastEls[i][0]; if (!o || !o.parentNode) toastEls.splice(i, 1); }
        if (el && el.length > 0 && el[0]) toastEls.push(el);
        if (toastEls.length > 4) toastEls.shift();
    }
    /* only its own toasts go (toastr.clear with a toast and force never clears the others) */
    function dismissToasts() {
        var t = W.toastr, a = toastEls;
        toastEls = [];
        if (!t || typeof t.clear !== 'function') return;
        for (var i = 0; i < a.length; i++) {
            if (a[i] && a[i].length > 0) { try { t.clear(a[i], { force: true }); } catch (e) { } }
        }
    }

    /* Where a figure goes: a side of the screen and a height where it covers none of the HUD
     * parts or phone controls on the screen (measured at that moment, rare). Its box: the
     * class sizes above. null: no free place (no figure this time). An unknown screen size:
     * the middle height of the side. */
    function place(watcher, side) {
        var vw = +W.innerWidth || 0, vh = +W.innerHeight || 0;
        if (!(vw > 0 && vh > 0)) return { side: side, top: null };
        var m = Math.min(vw, vh) / 100;
        var h = watcher ? Math.min(17 * m, 120) : Math.min(34 * m, 240), w = watcher ? Math.min(7.7 * m, 55) : Math.min(20.4 * m, 144);
        var d = W.document, boxes = [];
        for (var i = 0; i < HUD_IDS.length; i++) {
            var el = typeof d.getElementById === 'function' ? d.getElementById(HUD_IDS[i]) : null, r = null;
            try { r = el && typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : null; } catch (e) { r = null; }
            if (r && r.width > 0 && r.height > 0) boxes.push(r);
        }
        var tops = watcher ? [0.22, 0.36, 0.5, 0.64] : [0.3, 0.44, 0.58, 0.16], sides = [side, side === 'l' ? 'r' : 'l'];
        for (var s = 0; s < 2; s++) {
            for (var t = 0; t < tops.length; t++) {
                var y = Math.round(tops[t] * vh), x0 = sides[s] === 'l' ? (watcher ? vw * 0.03 : 0) : vw - (watcher ? vw * 0.03 + w : w * 0.8), x1 = x0 + w;
                if (y + h > vh) continue;
                var free = true;
                for (var b = 0; b < boxes.length && free; b++) {
                    var r2 = boxes[b];
                    if (r2.left < x1 && r2.right > x0 && r2.top < y + h && r2.bottom > y) free = false;
                }
                if (free) return { side: sides[s], top: y };
            }
        }
        return null;
    }
    /* Its layer: just above the map background canvas (same stacking, the next element), so it
     * stands in the scene, under the grid, the cells, the viruses, their labels and the HUD; with
     * no such canvas, low on the page (z-index 1) as before. */
    function mount(d, el) {
        var dr = W.drawRender, bc = dr && dr.backgroundCanvas, par = bc && bc.parentNode, z = bc && bc.style ? parseInt(bc.style.zIndex, 10) : NaN;
        if (par && typeof par.insertBefore === 'function' && isFinite(z)) {
            el.style.zIndex = String(z);
            par.insertBefore(el, bc.nextSibling || null);
            return;
        }
        el.style.zIndex = '1';
        d.body.appendChild(el);
    }
    /* a figure at the side of the screen (decorative, no clicks); Legend's Reduced motion: it only
     * fades (no movement) */
    function ghost(watcher, E) {
        var d = W.document;
        if (!d || !d.body || typeof d.createElement !== 'function') return;
        hideGhost();
        var at = place(watcher, rnd() < 0.5 ? 'l' : 'r');
        if (!at) return;
        var el = d.createElement('div'), ms = watcher ? 2500 : 400 + Math.round(400 * rnd());
        el.className = 'lm-dl-ghost ' + (watcher ? 'lm-dl-watcher ' : '') + 'lm-dl-ghost-' + at.side + (setting('reducedMotion') ? ' lm-dl-calm' : '');
        el.setAttribute('aria-hidden', 'true');
        el.style.backgroundImage = watcher ? silhouettes().watcher : silhouettes().lurker;
        el.style.animationDuration = ms + 'ms';
        if (at.top != null) el.style.top = at.top + 'px';
        if (watcher) el.style.setProperty('--lm-dl-a', '0.3');
        el.addEventListener('animationend', hideGhost);
        mount(d, el);
        ghostEl = el;
        ghostUntil = E + ms + 500;
    }
    function hideGhost() {
        var el = ghostEl;
        ghostEl = null;
        if (!el) return;
        try { el.removeEventListener('animationend', hideGhost); } catch (e) { }
        if (el.parentNode) el.parentNode.removeChild(el);
    }

    /* -- sounds: the Legend mixer, at most MAX_SOUNDS elements, reused --
     * Not application.setSound (the shared loader of the chat / gameplay sounds): it gives an
     * Audio element at once and sets its source later (IndexedDB, then a fetch and a FileReader),
     * with no sign of when it is ready and no way to call it off, so a load still running after
     * the turn-off would set its source anyway; and it keeps every file as a data URL in
     * LMSkinStorage, the player's persistent cache, where these sounds would stay after the
     * turn-off. Plain elements use the browser's HTTP cache, play again without a new load, and
     * releaseSounds lets them go (no load left running). */
    function userGain() {
        var v = Number(setting('dyingLightVolume'));
        return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
    }
    /* force: a real death / lost connection takes the oldest element when both play */
    function play(id, level, force) {
        var mix = W.LMNotifications;
        if (!on || !mix || typeof mix.play !== 'function' || hidden() || !SOUNDS[id]) return false;
        var base = SOUNDS[id] * level, gain = base * userGain();
        if (!(gain > 0)) return false;
        var a = null;
        for (var i = 0; i < audios.length; i++) if (audios[i].paused || audios[i].ended) { a = audios[i]; break; }
        if (!a && force && audios.length >= MAX_SOUNDS) {
            a = audios[0];
            try { a.pause(); } catch (e) { }
        }
        if (!a) {
            if (audios.length >= MAX_SOUNDS || typeof W.Audio !== 'function') return false;
            a = new W.Audio();
            a.preload = 'auto';
            audios.push(a);
        }
        var url = BASE + 'sounds/dyinglight/' + id + '.mp3';
        if (a._lmUrl !== url) { a.src = url; a._lmUrl = url; }
        /* its level inside the Dying Light sound level, for a volume change while it plays */
        a._lmGain = base;
        mix.play(a, 'gameplay', gain);
        return true;
    }
    /* the mixer's volume of a Gameplay sound of this gain: soundVolume('gameplay') x gain, as
     * LMNotifications.play sets it */
    function mixVolume(g) {
        var mix = W.LMNotifications, v = NaN;
        try { if (mix && typeof mix.soundVolume === 'function') v = Number(mix.soundVolume('gameplay')); } catch (e) { }
        if (!Number.isFinite(v)) return NaN;
        var n = Number(g);
        n = Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 1;
        return Math.max(0, Math.min(1, v * n));
    }
    /* Settings > Sounds (master, Gameplay) or the Dying Light sound level changed while a sound
     * plays: it goes on at the new volume (a slider is announced when it rests) */
    var VOL_KEYS = { volMaster: 1, volGameplay: 1, dyingLightVolume: 1 };
    function onVolume(d) {
        if (!on || !d || VOL_KEYS[d.key] !== 1) return;
        var u = userGain();
        for (var i = 0; i < audios.length; i++) {
            var a = audios[i];
            if (a.paused || a.ended || !(a._lmGain >= 0)) continue;
            var v = mixVolume(a._lmGain * u);
            try { if (v === v && a.volume !== v) a.volume = v; } catch (e) { }
        }
        acLevel();
    }
    function stopSounds() {
        for (var i = 0; i < audios.length; i++) { try { audios[i].pause(); } catch (e) { } }
    }
    function releaseSounds() {
        stopSounds();
        for (var i = 0; i < audios.length; i++) {
            var a = audios[i];
            try { a.removeAttribute('src'); a._lmUrl = null; a._lmGain = null; a.load(); } catch (e) { }
        }
        audios.length = 0;
    }

    /* -- made sounds (Web Audio): the ambience of each phase, the heartbeat and the event sounds
     * are synthesized here (no files, no recordings of others). One AudioContext, made at the
     * first need while on (Immersive / Nightmare) and closed by the turn-off; all of it goes
     * through one output gain at the mixer's Gameplay volume (soundVolume('gameplay'), master
     * included) x the Dying Light sound level, so those sliders and a channel at 0 apply, also
     * while it plays. Suspended (no audio work) while the tab is hidden, in a replay, at volume 0
     * or in Competitive. It is driven by the director's tick (no timer of its own): the beats of
     * the next 1.3 s are handed to the audio clock each second. -- */
    /* levels inside the output (the handoff's ranges: ambience 0.1-0.15, heartbeat 0.1-0.3) */
    var AMB = 0.12, HB_GAIN = [0, 0.16, 0.26], HB_BPM = [72, 82, 124], HB_STEP = 10, HB_AHEAD = 1.3, AMB_FADE = 4;
    /* each phase's bed: wind [band Hz, Q, level, gusts Hz], a low drone [Hz, level], high air */
    var BEDS = {
        day: { wind: [420, 0.8, 0.5, 0.05], drone: null, air: 0.05 },
        dusk: { wind: [330, 0.9, 0.5, 0.07], drone: [49, 0.1], air: 0.04 },
        night: { wind: [250, 1, 0.55, 0.09], drone: [41.2, 0.2], air: 0 },
        deepNight: { wind: [180, 1.2, 0.6, 0.12], drone: [36.7, 0.32], air: 0 },
        dawn: { wind: [480, 0.8, 0.45, 0.05], drone: [55, 0.07], air: 0.05 }
    };
    /* acVol: the output level set last (only a change is handed to the audio clock); held: resting */
    var ac = null, acOut = null, acNoise = null, acVol = -1, held = false, bed = null, oldBeds = [];
    var hb = { lvl: 0, bpm: HB_BPM[0], vol: 0, next: 0, offAt: 0, beats: 0, g: null };

    function acMake() {
        var C = W.AudioContext || W.webkitAudioContext;
        if (typeof C !== 'function') return null;
        /* the browser keeps a context silent until the page was touched: wait for that */
        var ua = W.navigator && W.navigator.userActivation;
        if (ua && ua.hasBeenActive === false) return null;
        try {
            ac = new C();
            acOut = ac.createGain();
            acOut.gain.value = 0;
            acOut.connect(ac.destination);
            /* one second of noise (wind, breath, steps, static), from its own small generator */
            var sr = ac.sampleRate || 44100, n = Math.max(1, Math.floor(sr)), b = ac.createBuffer(1, n, sr), d = b.getChannelData(0), x = 0x9e3779b9;
            for (var i = 0; i < n; i++) { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; d[i] = (x >>> 0) / 2147483648 - 1; }
            acNoise = b;
        } catch (e) { warn('audio', e); acClose(); return null; }
        return ac;
    }
    function acClose() {
        var c = ac;
        ac = acOut = acNoise = bed = fx = null;
        acVol = -1;
        held = false;
        oldBeds.length = 0;
        hb.lvl = 0; hb.bpm = HB_BPM[0]; hb.vol = 0; hb.next = 0; hb.offAt = 0; hb.g = null;
        if (c) { try { var pr = c.close(); if (pr && typeof pr.catch === 'function') pr.catch(function () { }); } catch (e) { } }
    }
    function glide(prm, v, tc) { try { prm.setTargetAtTime(v, ac.currentTime, tc); } catch (e) { try { prm.value = v; } catch (e2) { } } }
    /* the output at the mixer's volume (a change while it plays: onVolume) */
    function acLevel() {
        if (!ac || !acOut) return;
        var v = mixVolume(userGain());
        if (!(v >= 0)) v = 0;
        if (v === acVol) return;
        acVol = v;
        glide(acOut.gain, v, 0.08);
    }
    /* nothing to be heard: the beds and the heartbeat end, the context rests */
    function acHold() {
        if (!ac || held) return;
        held = true;
        fxCut();
        bedCut();
        hbQuiet(true);
        if (ac.state === 'running') { try { var pr = ac.suspend(); if (pr && pr.catch) pr.catch(function () { }); } catch (e) { } }
    }
    function acRun() {
        if (!ac && !acMake()) return null;
        held = false;
        if (ac.state === 'suspended') { try { var pr = ac.resume(); if (pr && pr.catch) pr.catch(function () { }); } catch (e) { } }
        acLevel();
        return ac.state === 'closed' ? null : ac;
    }
    function noiseSrc() {
        var s = ac.createBufferSource();
        s.buffer = acNoise;
        s.loop = true;
        return s;
    }
    function lfo(hz, depth, prm, srcs) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = hz;
        g.gain.value = depth;
        o.connect(g);
        g.connect(prm);
        srcs.push(o);
    }
    /* a bed: a few nodes that run by themselves (no script per sample), faded in over AMB_FADE s.
     * rich (Nightmare): a dissonant high whine and whispers on top */
    function bedMake(id, rich) {
        var c = BEDS[id];
        if (!c) return null;
        var t = ac.currentTime, g = ac.createGain(), srcs = [];
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(AMB, t + AMB_FADE);
        g.connect(acOut);
        var n = noiseSrc(), f = ac.createBiquadFilter(), wg = ac.createGain();
        f.type = 'bandpass'; f.frequency.value = c.wind[0]; f.Q.value = c.wind[1];
        wg.gain.value = c.wind[2];
        n.connect(f); f.connect(wg); wg.connect(g);
        srcs.push(n);
        /* gusts: the level and the band move slowly, at two rates that do not repeat */
        lfo(c.wind[3], c.wind[2] * 0.6, wg.gain, srcs);
        lfo(c.wind[3] * 0.37, c.wind[0] * 0.35, f.frequency, srcs);
        if (c.drone) {
            var lp = ac.createBiquadFilter(), dg = ac.createGain();
            lp.type = 'lowpass'; lp.frequency.value = 160; lp.Q.value = 0.7;
            dg.gain.value = c.drone[1];
            for (var k = 0; k < 2; k++) {
                var o = ac.createOscillator();
                o.type = 'sawtooth';
                o.frequency.value = c.drone[0] * (k ? 1.007 : 1);
                o.connect(lp);
                srcs.push(o);
            }
            lp.connect(dg); dg.connect(g);
            lfo(0.031, 60, lp.frequency, srcs);
        }
        if (c.air) {
            var an = noiseSrc(), hp = ac.createBiquadFilter(), ag = ac.createGain();
            hp.type = 'highpass'; hp.frequency.value = 3200;
            ag.gain.value = c.air;
            an.connect(hp); hp.connect(ag); ag.connect(g);
            srcs.push(an);
            lfo(0.043, c.air * 0.8, ag.gain, srcs);
        }
        if (rich) {
            var wh = ac.createGain();
            wh.gain.value = 0.018;
            [1480, 2093].forEach(function (hz) {
                var o2 = ac.createOscillator();
                o2.frequency.value = hz;
                o2.connect(wh);
                srcs.push(o2);
            });
            lfo(0.2, 0.014, wh.gain, srcs);
            wh.connect(g);
            var sn = noiseSrc(), bp = ac.createBiquadFilter(), sg = ac.createGain();
            bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 3;
            sg.gain.value = 0;
            sn.connect(bp); bp.connect(sg); sg.connect(g);
            srcs.push(sn);
            /* whispers that come and go (noise: the sign of the swell does not matter) */
            lfo(0.23, 0.22, sg.gain, srcs);
            lfo(0.37, 0.16, sg.gain, srcs);
        }
        for (var i = 0; i < srcs.length; i++) srcs[i].start(t);
        return { id: id, rich: rich, g: g, srcs: srcs, end: 0 };
    }
    function bedFade(b, s) {
        var t = ac.currentTime;
        try {
            /* from the level it has now (also in the middle of its fade-in) */
            var gp = b.g.gain;
            if (typeof gp.cancelAndHoldAtTime === 'function') gp.cancelAndHoldAtTime(t);
            else { var v = gp.value; gp.cancelScheduledValues(t); gp.setValueAtTime(v, t); }
            gp.linearRampToValueAtTime(0, t + s);
        } catch (e) { }
        for (var i = 0; i < b.srcs.length; i++) { try { b.srcs[i].stop(t + s + 0.05); } catch (e) { } }
        b.end = t + s + 0.1;
        oldBeds.push(b);
    }
    /* the phase's bed, cross-faded from the one before (no cut) */
    function bedTo(id, rich) {
        if (bed && bed.id === id && bed.rich === rich) return;
        if (bed) bedFade(bed, AMB_FADE);
        bed = id ? bedMake(id, rich) : null;
    }
    function bedCut() {
        if (bed) bedFade(bed, 0.05);
        bed = null;
        sweep(true);
    }
    /* faded beds let go once silent */
    function sweep(all) {
        for (var i = oldBeds.length - 1; i >= 0; i--) {
            var b = oldBeds[i];
            if (!all && ac && ac.currentTime < b.end) continue;
            try { b.g.disconnect(); } catch (e) { }
            if (b.parts) for (var j = 0; j < b.parts.length; j++) { try { b.parts[j].disconnect(); } catch (e) { } }
            oldBeds.splice(i, 1);
        }
    }

    /* The heartbeat: the threat look's level (the snapshot compareCells keeps, with its rise and
     * fall), 0 silent, 1 about 82 BPM, 2 about 124 BPM; the tempo glides at most HB_STEP BPM a
     * second and the volume fades, so a change of level never restarts it. */
    function hbQuiet(cut) {
        hb.lvl = 0;
        hb.vol = 0;
        if (hb.g && ac) glide(hb.g.gain, 0, cut ? 0.05 : 0.7);
        hb.offAt = cut || !ac ? 0 : ac.currentTime + 2.5;
        if (cut) { hb.next = 0; hb.bpm = HB_BPM[0]; }
    }
    function heart(p) {
        var want = p.hb && DL.effect('threat') ? (tLvl >= 2 ? 2 : tLvl === 1 ? 1 : 0) : 0, t = ac.currentTime;
        if (want !== hb.lvl) {
            if (!want) hbQuiet(false);
            else {
                if (!hb.g) { hb.g = ac.createGain(); hb.g.gain.value = 0; hb.g.connect(acOut); }
                hb.lvl = want;
                hb.vol = HB_GAIN[want];
                glide(hb.g.gain, hb.vol, 0.5);
            }
        }
        var d = HB_BPM[want] - hb.bpm;
        hb.bpm += d > HB_STEP ? HB_STEP : d < -HB_STEP ? -HB_STEP : d;
        if (!want && !(t < hb.offAt)) { hb.next = 0; return; }
        var beat = 60 / hb.bpm, at = Math.max(hb.next, t + 0.05);
        for (; at < t + HB_AHEAD; at += beat) {
            /* lub - dub */
            knock(at, 1, hb.g);
            knock(at + Math.min(0.3, beat * 0.36), 0.6, hb.g);
            hb.beats++;
        }
        hb.next = at;
    }
    /* one soft low knock (a triangle: its overtones are heard on small speakers too) */
    function knock(t0, a, dest) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(64, t0);
        o.frequency.exponentialRampToValueAtTime(38, t0 + 0.14);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(a, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
        o.connect(g); g.connect(dest);
        o.start(t0); o.stop(t0 + 0.22);
    }

    /* -- the made event sounds: distant screams, growls, footsteps, breathing, radio static and
     * interrupted broadcasts, impacts. One at a time, through one bus with a short echo (distance)
     * into the same output; Nightmare plays fuller variants (rich: two voices, closer, coming
     * nearer, a garbled voice in the static, a second blow). A spawn, a server change and every
     * rest of the context cut the one playing. Levels inside the output: 0.15-0.35. -- */
    var fx = null, sfxN = {};
    function fxMake() {
        if (fx) return fx;
        var out = ac.createGain(), dry = ac.createGain(), wet = ac.createGain(), dl = ac.createDelay(1), fb = ac.createGain(), lp = ac.createBiquadFilter();
        dry.connect(out);
        wet.connect(dl);
        dl.delayTime.value = 0.32;
        lp.type = 'lowpass'; lp.frequency.value = 1800;
        fb.gain.value = 0.35;
        dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(out);
        out.connect(acOut);
        fx = { out: out, parts: [dry, wet, dl, fb, lp], end: 0 };
        return fx;
    }
    function fxCut() {
        if (!fx) return;
        if (ac) {
            glide(fx.out.gain, 0, 0.03);
            oldBeds.push({ g: fx.out, srcs: [], parts: fx.parts, end: ac.currentTime + 0.3 });
        }
        fx = null;
    }
    /* where one sound enters the bus: its side (-1..1), how much of it is heard near and far */
    function voice(near, far, x) {
        var inp = ac.createGain(), at = inp, dg = ac.createGain(), wg = ac.createGain();
        if (typeof ac.createStereoPanner === 'function') {
            var pn = ac.createStereoPanner();
            pn.pan.value = x;
            inp.connect(pn);
            at = pn;
        }
        dg.gain.value = near; wg.gain.value = far;
        at.connect(dg); at.connect(wg);
        dg.connect(fx.parts[0]); wg.connect(fx.parts[1]);
        return inp;
    }
    function env(prm, t, a, peak, hold, rel) {
        prm.setValueAtTime(0.0001, t);
        prm.exponentialRampToValueAtTime(peak, t + a);
        prm.setValueAtTime(peak, t + a + hold);
        prm.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
    }
    function osc(type, hz, t, end) {
        var o = ac.createOscillator();
        o.type = type;
        o.frequency.setValueAtTime(hz, t);
        o.start(t);
        o.stop(end);
        return o;
    }
    /* noise through one filter, with its own envelope; gives the filter (for a sweep) */
    function burst(t, a, hold, rel, type, hz, q, peak, dest) {
        var s = noiseSrc(), f = ac.createBiquadFilter(), g = ac.createGain();
        f.type = type; f.frequency.setValueAtTime(hz, t); f.Q.value = q;
        s.connect(f); f.connect(g); g.connect(dest);
        env(g.gain, t, a, peak, hold, rel);
        s.start(t, rnd() * 0.9);
        s.stop(t + a + hold + rel + 0.05);
        return f;
    }
    function scream(t, rich) {
        var dur = rich ? 2.2 : 1.5, inp = voice(0.45, 0.9, rnd() * 1.6 - 0.8);
        var bp = ac.createBiquadFilter(), lp = ac.createBiquadFilter(), g = ac.createGain();
        bp.type = 'bandpass'; bp.frequency.value = 1150; bp.Q.value = 2.5;
        /* far away: the top of it is lost */
        lp.type = 'lowpass'; lp.frequency.value = 1900;
        bp.connect(lp); lp.connect(g); g.connect(inp);
        env(g.gain, t, 0.18, 0.34, dur - 0.7, 0.5);
        for (var i = 0; i < (rich ? 2 : 1); i++) {
            var f0 = 520 + 90 * i + 60 * rnd(), o = osc('sawtooth', f0, t, t + dur + 0.1), vib = osc('sine', 5.2 + 1.3 * i, t, t + dur + 0.1), vg = ac.createGain();
            o.frequency.linearRampToValueAtTime(f0 * 1.9, t + 0.32);
            o.frequency.exponentialRampToValueAtTime(f0 * 0.8, t + dur);
            vg.gain.value = 18 + 10 * i;
            vib.connect(vg); vg.connect(o.frequency);
            o.connect(bp);
        }
        return dur + 1.2;
    }
    function growl(t, rich) {
        var dur = rich ? 2.1 : 1.5, inp = voice(rich ? 0.8 : 0.5, rich ? 0.3 : 0.6, rnd() * 1.4 - 0.7), g = ac.createGain();
        g.connect(inp);
        env(g.gain, t, 0.25, rich ? 0.34 : 0.26, dur - 0.65, 0.4);
        /* a rough throat: noise in a low band, shaken about 25 times a second, over a low voice */
        var s = noiseSrc(), f = ac.createBiquadFilter(), am = ac.createGain(), m = osc('sawtooth', 22 + 6 * rnd(), t, t + dur + 0.1), mg = ac.createGain();
        f.type = 'bandpass'; f.frequency.value = 150; f.Q.value = 2.5;
        am.gain.value = 0.6; mg.gain.value = 0.5;
        m.connect(mg); mg.connect(am.gain);
        s.connect(f); f.connect(am); am.connect(g);
        s.start(t, rnd() * 0.9); s.stop(t + dur + 0.1);
        var o = osc('sawtooth', rich ? 52 : 60, t, t + dur + 0.1), lp = ac.createBiquadFilter(), og = ac.createGain();
        o.frequency.linearRampToValueAtTime(rich ? 41 : 48, t + dur);
        lp.type = 'lowpass'; lp.frequency.value = 280;
        og.gain.value = 0.35;
        o.connect(lp); lp.connect(og); og.connect(g);
        return dur + 0.8;
    }
    function footsteps(t, rich) {
        var n = rich ? 7 : 5, gap = rich ? 0.5 : 0.6, x0 = rnd() < 0.5 ? -0.8 : 0.8;
        for (var i = 0; i < n; i++) {
            /* Nightmare: coming nearer (louder, to the middle); else passing by (up and down, across) */
            var k = i / (n - 1), lvl = rich ? 0.08 + 0.22 * k : 0.1 + 0.16 * Math.sin(Math.PI * k);
            var at = t + i * gap + rnd() * 0.04, inp = voice(1, 0.35, rich ? x0 * (1 - 0.8 * k) : x0 * (1 - 2 * k));
            burst(at, 0.005, 0.02, 0.06, 'lowpass', 520, 0.8, lvl, inp);
            /* the grit under the foot */
            burst(at + 0.015, 0.003, 0.01, 0.03, 'bandpass', 1900, 1.2, lvl * 0.35, inp);
            knock(at, lvl * 0.7, inp);
        }
        return n * gap + 0.8;
    }
    function breathing(t, rich) {
        var n = rich ? 3 : 2, cyc = rich ? 2.1 : 2.8, inp = voice(rich ? 0.9 : 0.45, rich ? 0.2 : 0.7, rnd() * 1.2 - 0.6);
        for (var i = 0; i < n; i++) {
            var at = t + i * cyc;
            burst(at, 0.5, 0.2, 0.5, 'bandpass', 1100, 0.9, rich ? 0.22 : 0.14, inp);
            burst(at + 1, 0.3, 0.3, 0.7, 'bandpass', rich ? 600 : 750, 0.7, rich ? 0.26 : 0.17, inp);
            if (rich) {
                /* a rasp in the breath out */
                var o = osc('sawtooth', 85, at + 1, at + 2.4), lp = ac.createBiquadFilter(), g = ac.createGain();
                lp.type = 'lowpass'; lp.frequency.value = 300;
                o.connect(lp); lp.connect(g); g.connect(inp);
                env(g.gain, at + 1, 0.3, 0.05, 0.3, 0.7);
            }
        }
        return n * cyc + 0.6;
    }
    /* radio static, a broadcast tone heard where it drops; rich: a garbled voice in it */
    function crackle(t, rich, len) {
        var dur = len || (rich ? 2.6 : 1.8), end = t + dur, inp = voice(0.9, 0.15, rnd() * 0.6 - 0.3);
        var s = noiseSrc(), hp = ac.createBiquadFilter(), bp = ac.createBiquadFilter(), g = ac.createGain(), cg = ac.createGain();
        hp.type = 'highpass'; hp.frequency.value = 1200;
        bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 0.6;
        s.connect(hp); hp.connect(bp); bp.connect(g); g.connect(inp);
        s.start(t, rnd() * 0.9); s.stop(end + 0.05);
        osc('sine', 1000, t, end + 0.05).connect(cg);
        if (rich) {
            var vo = osc('sawtooth', 135, t, end + 0.05), vf = ac.createBiquadFilter(), vv = osc('sine', 3.1, t, end + 0.05), vg = ac.createGain();
            vf.type = 'bandpass'; vf.frequency.value = 850; vf.Q.value = 6;
            vg.gain.value = 30;
            vv.connect(vg); vg.connect(vo.frequency);
            vo.connect(vf); vf.connect(cg);
        }
        cg.connect(inp);
        g.gain.setValueAtTime(0, t);
        cg.gain.setValueAtTime(0, t);
        for (var at = t; at < end; at += 0.04 + 0.14 * rnd()) {
            var lv = rnd();
            g.gain.setValueAtTime(lv < 0.25 ? 0.02 : 0.08 + 0.14 * lv, at);
            cg.gain.setValueAtTime(lv < 0.25 ? 0.05 : 0, at);
        }
        g.gain.setValueAtTime(0, end);
        cg.gain.setValueAtTime(0, end);
        return dur + 0.3;
    }
    /* a far blow on metal; rich: a second one */
    function impact(t, rich) {
        var inp = voice(0.35, 1, rnd() * 1.6 - 0.8);
        for (var i = 0; i < (rich ? 2 : 1); i++) {
            var at = t + 0.45 * i, lvl = i ? 0.7 : 1;
            burst(at, 0.005, 0, 0.4, 'lowpass', 2600, 0.7, 0.32 * lvl, inp).frequency.exponentialRampToValueAtTime(180, at + 0.35);
            knock(at, 0.5 * lvl, inp);
            var rg = ac.createGain();
            rg.connect(inp);
            env(rg.gain, at, 0.003, 0.05 * lvl, 0, 0.9);
            osc('sine', 310 * (i ? 0.9 : 1), at, at + 1).connect(rg);
            osc('sine', 467 * (i ? 0.9 : 1), at, at + 1).connect(rg);
        }
        return (rich ? 0.45 : 0) + 1.5;
    }
    var SFX = { scream: scream, growl: growl, footsteps: footsteps, breathing: breathing, 'static': crackle, impact: impact };
    /* the made sounds can play now: the context runs, none plays, a free page, no reduced motion */
    function madeOk(constrained) {
        return !!(ac && !held && ac.state === 'running' && !(fx && ac.currentTime < fx.end)) && !constrained && !noMotion();
    }
    function sfx(k, rich, len, as) {
        if (!ac || held || ac.state !== 'running' || typeof SFX[k] !== 'function') return false;
        var t = ac.currentTime;
        if (fx && t < fx.end) return false;
        try { fx = fxMake(); fx.end = t + SFX[k](t + 0.05, !!rich, len); } catch (e) { warn('sound ' + k, e); return false; }
        as = as || k;
        sfxN[as] = (sfxN[as] || 0) + 1;
        return true;
    }
    /* each tick: what is to be heard now */
    function sound() {
        var r = rec(), p = profile(r);
        if (!on || !live || hidden() || r || replay() || !(p.amb || p.hb) || !(mixVolume(userGain()) > 0)) { acHold(); return; }
        if (!acRun()) return;
        sweep(false);
        bedTo(p.amb && phase ? phase.id : null, !!p.rich);
        heart(p);
    }

    /* -- game events -- */
    function onDeath(d) {
        /* a multibox unit lost while another lives is no Game Over (playerDied: the last of your
         * players, also when the main player died first; death: the main player's) */
        if (!on || !live || (d && d.scope === 'unit') || replay()) return;
        var E = clock(now());
        if (E - lastDeathAt < DEATH_GAP_MS) return;
        lastDeathAt = E;
        deathN = deathN % 3 + 1;
        hbQuiet(true);
        play('death-' + deathN, LEVEL.death, true);
    }
    function onSpawn(d) {
        /* a quick respawn ends the last life's sound and figure; a short calm after. playerSpawned:
         * the first of your players alive again (a new game) or the one you control */
        if (d && d.role && !(d.living === 1 || d.active)) return;
        stopSounds();
        hideGhost();
        hbQuiet(true);
        fxCut();
        if (on) quietUntil = clock(now()) + SPAWN_QUIET_MS;
    }
    /* the replay's look changed (a seek, its clock, its end): shown at once, not at the next tick */
    function onReplay() {
        if (!on || !live) return;
        try { step(clock(now()), busy); } catch (e) { warn('director', e); }
    }
    function onDisconnect(d) {
        if (!on || !live || !d || !d.playing || replay()) return;
        var E = clock(now());
        if (E - lastSignalAt < SIGNAL_GAP_MS) return;
        lastSignalAt = E;
        play('signal-lost', LEVEL.death, true);
    }
    function onServer() {
        stopSounds();
        hideGhost();
        hbQuiet(true);
        fxCut();
    }
    function sub(name, fn) {
        var ev = W.LMEvents;
        if (!ev || typeof ev.on !== 'function') return;
        ev.on(name, fn);
        subs.push([name, fn]);
    }

    function reset() {
        clearTimeout(timer);
        timer = 0; acc = 0; runAt = 0; live = false; lastTick = 0; late = 0; okTicks = 0; busy = false;
        phase = null; wasRec = false; nextRollAt = 0; lastEventAt = -Infinity; lastAt = {}; lastMajorAt = -Infinity;
        quietUntil = 0; lastDeathAt = -Infinity; lastSignalAt = -Infinity; deathN = 0; radioN = 0;
        shown = null; look = null; dropPend(); failed = {}; sfxN = {};
    }
    function start(g) {
        var d = W.document;
        /* needs a monotonic clock and a page to listen to */
        if (!(W.performance && typeof W.performance.now === 'function') || !d || typeof d.addEventListener !== 'function') return;
        stop();
        reset();
        gen = g;
        on = true;
        var p = profile();
        if (p.events) nextRollAt = p.rollMs;
        if (typeof d.createElement === 'function' && (d.head || d.documentElement)) {
            styleEl = d.createElement('style');
            styleEl.id = 'lm-dl-director-style';
            styleEl.textContent = CSS;
            (d.head || d.documentElement).appendChild(styleEl);
        }
        onVis = function () { if (hidden()) pause(now()); else resume(now()); };
        d.addEventListener('visibilitychange', onVis);
        /* every player's life (playerDied / playerSpawned); an older core: the main player's */
        var mb = typeof W.lmMbPlayerEvent === 'function';
        sub(mb ? 'playerDied' : 'death', onDeath);
        sub(mb ? 'playerSpawned' : 'spawn', onSpawn);
        sub('disconnect', onDisconnect);
        sub('serverChange', onServer);
        sub('settingsChange', onVolume);
        if (!hidden()) resume(now());
    }
    /* one step of the turn-off: one that throws does not keep the next ones from running */
    function safe(what, fn) {
        try { fn(); } catch (e) { warn('turn-off: ' + what, e); }
    }
    function stop() {
        on = false;
        gen = -1;
        clearTimeout(timer);
        timer = 0;
        live = false;
        var ev = W.LMEvents;
        while (subs.length) {
            var s = subs.pop();
            try { ev.off(s[0], s[1]); } catch (e) { }
        }
        var d = W.document, f = onVis;
        onVis = null;
        safe('visibility listener', function () { if (f && d && typeof d.removeEventListener === 'function') d.removeEventListener('visibilitychange', f); });
        safe('sounds', releaseSounds);
        safe('audio', acClose);
        safe('figure', hideGhost);
        safe('toasts', dismissToasts);
        var st = styleEl;
        styleEl = null;
        safe('style', function () { if (st && st.parentNode) st.parentNode.removeChild(st); });
        shown = null;
        look = null;
        safe('scene', dropPend);
    }

    /* -- the threat look: the edge of the screen turns dark red while a bigger player is near (1)
     * or one can split onto you (2). compareCells judges it in its own pass over the cells only
     * while this asks (needsThreatData), and keeps the level of that frame (window.lmDlThreat);
     * read 4 times a second, shown once it held 250 ms, gone 1.5 s after the danger. Not in
     * Competitive, a replay or the practice arena; nothing while spectating, in the menu or on the
     * Game Over window (no valid level then) or from an old frame; reset at once by a switch of
     * the player you control, a death, a spawn, a server change and a dropped connection.
     * LMDyingLight.setEffect('threat', false) turns it off. In Competitive or suppressed its timer does
 * not run (again at once on a change: the part's changed()); while the page is busy (the
 * director's late ticks) the level is not asked for. Decorative, under the HUD, no clicks;
     * the element is made only when first needed. -- */
    var THR_TICK = 250, THR_RISE = 250, THR_FALL = 1500, THR_STALE = 1000, THR_A = [0, 0.45, 0.85];
    var tOn = false, tTimer = 0, tEl = null, tLvl = 0, tWant = 0, tSince = 0, tUnit = -1, tSubs = [], tVis = null;
    /* the look can show (not Competitive, not suppressed): else its timer does not run; a change
     * of either comes through changed() */
    function tLive() {
        return tOn && DL.effect('threat') && !!profile().threat;
    }
    /* the level is asked for (compareCells judges it): not in a replay or the practice arena, and
     * not while the page is busy (the director's late ticks), so a struggling frame does no extra
     * work; the look then fades as after the danger */
    function tAsk() {
        return tLive() && !replay() && !busy;
    }
    function tShow(l, fast) {
        var prev = tLvl;
        tLvl = l;
        if (!tEl) {
            var d = W.document;
            if (!l || !d || !d.body || typeof d.createElement !== 'function') return;
            tEl = d.createElement('div');
            tEl.className = 'lm-dl-threat';
            tEl.setAttribute('aria-hidden', 'true');
            /* i18n-ok: CSS */
            tEl.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:1;opacity:0;' +
                'background:radial-gradient(ellipse at center,rgba(161,43,48,0) 55%,rgba(161,43,48,.55) 100%)';
            d.body.appendChild(tEl);
        }
        tEl.style.transition = fast || noMotion() ? 'none' : 'opacity ' + (l > prev ? '.25s' : '.9s') + ' ease-out';
        tEl.style.opacity = String(THR_A[l] || 0);
    }
    function tReset() {
        tWant = 0;
        tSince = now();
        if (tLvl || tEl) tShow(0, true);
    }
    /* starting: the activation is not 'on' yet (its parts start first), only the intensity is
     * asked then; the first tick asks the rest */
    function tArm(starting) {
        clearTimeout(tTimer);
        tTimer = (starting === true ? tOn && !!profile().threat : tLive()) && !hidden() ? setTimeout(tTick, THR_TICK) : 0;
    }
    /* the intensity or the effect changed: on again at once, or gone at once */
    function tChanged() {
        if (!tOn) return;
        if (!tLive()) { clearTimeout(tTimer); tTimer = 0; tReset(); }
        else if (!tTimer) tArm();
    }
    function tTick() {
        tTimer = 0;
        if (!tOn) return;
        if (hidden() || !tLive()) { tReset(); return; }
        var t = now(), s = null, want = 0;
        if (tAsk()) {
            try { s = typeof W.lmDlThreat === 'function' ? W.lmDlThreat() : null; } catch (e) { s = null; }
        }
        if (s && s.valid && t - s.t >= 0 && t - s.t <= THR_STALE) {
            /* another player to control: its own level from zero */
            if (s.unit !== tUnit) { tUnit = s.unit; tReset(); }
            want = s.level >= 2 ? 2 : s.level === 1 ? 1 : 0;
        }
        if (want !== tWant) { tWant = want; tSince = t; }
        if (want !== tLvl && t - tSince >= (want > tLvl ? THR_RISE : THR_FALL)) tShow(want, false);
        tArm();
    }
    function tSub(name) {
        var ev = W.LMEvents;
        if (!ev || typeof ev.on !== 'function') return;
        ev.on(name, tReset);
        tSubs.push(name);
    }
    function tStart() {
        var d = W.document;
        if (!(W.performance && typeof W.performance.now === 'function') || !d || typeof d.addEventListener !== 'function') return;
        tStop();
        tOn = true;
        tUnit = -1;
        tVis = function () { if (hidden()) { clearTimeout(tTimer); tTimer = 0; tReset(); } else if (!tTimer) tArm(); };
        d.addEventListener('visibilitychange', tVis);
        tSub('multiboxSwap'); tSub('death'); tSub('spawn'); tSub('serverChange'); tSub('disconnect');
        tArm(true);
    }
    function tStop() {
        tOn = false;
        clearTimeout(tTimer);
        tTimer = 0;
        var ev = W.LMEvents;
        while (tSubs.length) { try { ev.off(tSubs.pop(), tReset); } catch (e) { } }
        var d = W.document;
        if (tVis && d && typeof d.removeEventListener === 'function') d.removeEventListener('visibilitychange', tVis);
        tVis = null;
        if (tEl && tEl.parentNode) tEl.parentNode.removeChild(tEl);
        tEl = null;
        tLvl = tWant = 0;
        tUnit = -1;
    }

    DL.addPart({
        name: 'director',
        start: function (g) { start(g); },
        stop: stop,
        replay: onReplay,
        background: function () { return on ? look : null; }
    });
    /* its colours over the menu / HUD theme, while on (any intensity) */
    DL.addPart({
        name: 'theme',
        /* the colours are part of the look: when they cannot be set the theme does not turn on */
        essential: true,
        start: function () { if (typeof W.lmThemeOverride === 'function') W.lmThemeOverride('dyinglight', COLORS); },
        stop: function () { if (typeof W.lmThemeOverride === 'function') W.lmThemeOverride('dyinglight', null); }
    });
    DL.addPart({ name: 'threat', start: tStart, stop: tStop, threat: tAsk, changed: tChanged });
    /* read-only view for diagnostics and tests */
    W.LMDyingLightDirector = Object.freeze({
        phaseAt: function (ms) { return phaseAt(+ms || 0).id; },
        info: function () {
            return {
                running: on && live, on: on, clock: on ? clock(now()) : 0, phase: phase ? phase.id : null, replay: !!(on && rec()),
                busy: busy, scene: shown ? shown.url : null, loading: pend ? pend.url : null,
                sounds: audios.length, timer: !!timer, listeners: subs.length + (onVis ? 1 : 0), ghost: !!ghostEl, toasts: toastEls.length,
                threat: { on: tOn, level: tLvl, asked: tOn && tAsk(), timer: !!tTimer, listeners: tSubs.length + (tVis ? 1 : 0), shown: !!tEl },
                audio: { ctx: ac ? ac.state : null, bed: bed ? bed.id + (bed.rich ? '+' : '') : null, fading: oldBeds.length,
                    heart: { level: hb.lvl, bpm: Math.round(hb.bpm), vol: hb.vol, beats: hb.beats },
                    fx: !!(fx && ac && ac.currentTime < fx.end), events: Object.assign({}, sfxN) }
            };
        }
    });
})();
