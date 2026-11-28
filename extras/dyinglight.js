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
 *   hasForegroundFx(), needsThreatData(), addPart({ name, start(gen, api), stop(), fx, threat, background() })
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
    /* the six cosmetic zombie designs (pictures of the old icons, same 512 px copies). A player
     * keeps one design by name, so all of its cells and its copies from other connections (Full
     * Map, multibox) look the same and nothing changes with its mass; a design says nothing about
     * how dangerous a player is. */
    var VARIANTS = Object.freeze([
        Object.freeze({ id: 'biter', key: SKIN_KEY }),
        Object.freeze({ id: 'viral', key: IMG + 'dyinglight/skins/zombie5-512.webp' }),
        Object.freeze({ id: 'volatile', key: IMG + 'dyinglight/skins/volatile-512.webp' }),
        Object.freeze({ id: 'demolisher', key: IMG + 'dyinglight/skins/zombiebig-512.webp' }),
        Object.freeze({ id: 'screamer', key: IMG + 'dyinglight/skins/zombie2-512.webp' }),
        Object.freeze({ id: 'nightHunter', key: IMG + 'dyinglight/skins/zombie4-512.webp' })
    ]);
    /* the death particles' colours while on (a fixed few: the particle picture cache stays small) */
    var PARTICLES = Object.freeze(['#a12b30', '#6e1a1d', '#3b0d10']);
    var SPAWN_COLOUR = '#a12b30';
    /* each effect can be suppressed on its own (setEffect); none of them does any work while off */
    var FX = { variants: true, particles: true, spawn: true, gameOver: true };
    var SCENE_URL = IMG + 'dyinglight/backgrounds/back0-1920.webp';
    var MINIMAP_URL = IMG + 'dyinglightbabyteamboard.png';
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
    var assets = {};          /* url -> Image: the fixed small set above, kept for the next enable */
    var bg = null;            /* frozen { url, img, alpha } while on */
    var parts = [];           /* optional parts other files add (addPart) */
    var running = [];         /* the parts started by this activation, stopped in reverse order */
    var styleEl = null, onSettings = null;
    var byNick = new Map();   /* nick -> design key, at most 512 names, emptied on disable */
    var onSpawn = null, spawnTimer = 0, burstAt = 0;

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

    /* The switch, in the gameplay settings. The old flag dyinglight1load is not written again
     * (LMexpress.js moved it into dyingLight at the start). false = the browser refused to keep it:
     * the theme is still on or off for this visit, the storage warning comes from saveSettings. */
    function persist(on) {
        var s = W.defaultmapsettings;
        /* Restore defaults / an import is reloading the page: a save now would put the old
         * settings back */
        if (W._lmSettingsReload) return false;
        if (!s || typeof s !== 'object' || !Object.prototype.hasOwnProperty.call(s, 'dyingLight')) return false;
        if (s.dyingLight !== on) {
            s.dyingLight = on;
            try { W.application.saveSettings(s, 'ogarioSettings'); } catch (e) { return false; }
        }
        /* the old flag goes only once the setting is kept */
        try { W.localStorage.removeItem('dyinglight1load'); } catch (e) { }
        return true;
    }

    /* one wait per picture, shared by every enable that needs it; a failed one is tried again
     * only by a later enable (no retry loop) */
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
                im._lmWait = null;
                im._lmOk = ok;
                if (!ok && assets[url] === im) delete assets[url];
                resolve(ok ? im : null);
            }
            im.onload = function () { end(im.naturalWidth > 0); };
            im.onerror = function () { end(false); };
            im.src = url;
        });
        return im._lmWait;
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
     * the player on a server whose border is not centred). No own cell yet: one try 150 ms later. */
    function spawnBurst(g, again) {
        spawnTimer = 0;
        if (g !== generation || state !== 'on' || !FX.spawn) return;
        var dr = W.drawRender, lm = W.legendmod, ms = W.defaultmapsettings;
        if (!lm || !dr || typeof dr.startSpawnBurst !== 'function') return;
        if (lm.isLegendWorld || lm.serverType === 'expandingland' || (ms && ms.reducedMotion) ||
            (W.LMPractice && W.LMPractice.on) || W._lmEvReplayOn) return;
        var pc = lm.playerCells, n = pc && pc.length > 0 ? pc.length : 0, x = 0, y = 0;
        for (var i = 0; i < n; i++) { x += +pc[i].x; y += +pc[i].y; }
        if (!n || !isFinite(x) || !isFinite(y)) {
            if (!again) spawnTimer = setTimeout(function () { spawnBurst(g, true); }, 150);
            return;
        }
        dr.startSpawnBurst(x / n, y / n, SPAWN_COLOUR);
        burstAt = dr._spawnEffect ? dr._spawnEffect.startTime : 0;
    }
    function startFx(g) {
        syncGameOver();
        if (onSpawn || !W.LMEvents || typeof W.LMEvents.on !== 'function') return;
        onSpawn = function (e) {
            if (spawnTimer) clearTimeout(spawnTimer);
            spawnTimer = 0;
            /* the event's own context (practice / replay); older cores: the flags in spawnBurst */
            if (e && e.context && e.context !== 'live') return;
            spawnBurst(g, false);
        };
        W.LMEvents.on('spawn', onSpawn);
    }
    function stopFx() {
        if (onSpawn && W.LMEvents && typeof W.LMEvents.off === 'function') W.LMEvents.off('spawn', onSpawn);
        onSpawn = null;
        if (spawnTimer) clearTimeout(spawnTimer);
        spawnTimer = 0;
        /* a burst of ours still showing ends with the theme (another one is left alone) */
        var fx = W.drawRender && W.drawRender._spawnEffect;
        if (burstAt && fx && fx.active && fx.startTime === burstAt && fx.color === SPAWN_COLOUR && fx.el === false) fx.active = false;
        burstAt = 0;
        byNick.clear();
    }

    /* a player's design: by name (the same for all of its cells and copies), kept for the
     * activation; a short FNV-1a over the name, once per name */
    function designKey(nick) {
        if (!FX.variants) return SKIN_KEY;
        var k = byNick.get(nick);
        if (k) return k;
        var h = 2166136261;
        for (var i = 0; i < nick.length; i++) h = Math.imul(h ^ nick.charCodeAt(i), 16777619);
        k = VARIANTS[(h >>> 0) % VARIANTS.length].key;
        if (byNick.size >= 512) byNick.clear();
        byNick.set(nick, k);
        return k;
    }

    function startPart(p, g) {
        try {
            if (typeof p.start === 'function') p.start(g, api);
            running.push(p);
        } catch (e) { warn('part ' + (p.name || '?') + ' did not start', e); }
    }
    function stopParts() {
        while (running.length) {
            var p = running.pop();
            try { if (typeof p.stop === 'function') p.stop(); } catch (e) { warn('part ' + (p.name || '?') + ' did not stop', e); }
        }
    }

    function apply(g, zombie, scene) {
        /* the global flag older scripts may read (cleared by teardown); the zombie picture is drawn
         * through getFallbackSkinKey, no global image is left behind after disable */
        W.dyinglight1load = 'yes';
        bg = scene ? Object.freeze({ url: SCENE_URL, img: scene, alpha: 1 }) : null;
        addStyle();
        startFx(g);
        for (var i = 0; i < parts.length; i++) startPart(parts[i], g);
    }
    /* An import (or a script) that turns the switch off, also while the pictures still load: the
     * theme follows (else the end of the loading would save the switch on again) */
    function listen() {
        if (onSettings) return;
        onSettings = function (d) {
            if (d && d.key === 'dyingLight' && d.value === false && state !== 'off') disable();
            else if (d && d.key === 'dyingLightIntensity' && syncIntensity()) emit();
        };
        if (W.LMEvents && typeof W.LMEvents.on === 'function') W.LMEvents.on('settingsChange', onSettings);
    }
    /* everything this file put on the page, and only that */
    function teardown() {
        stopParts();
        stopFx();
        if (onSettings && W.LMEvents && typeof W.LMEvents.off === 'function') W.LMEvents.off('settingsChange', onSettings);
        onSettings = null;
        removeStyle();
        bg = null;
        W.dyinglight1load = null;
    }

    function confirmed() {
        try {
            return !!W.confirm(tx('pkg.dlv3life.confirm'));
        } catch (e) { return false; }
    }

    /* opts.confirm: ask first (a new activation); a start with the switch saved on does not ask.
     * Resolves true when on, false when refused, cancelled or failed (then everything is as before). */
    function enable(opts) {
        if (state === 'on') return Promise.resolve(true);
        if (state === 'loading' && job) return job;
        /* asked from a listener of the turn-off: that one finishes first */
        if (state === 'disabling') return Promise.resolve(false);
        if (opts && opts.confirm && !confirmed()) return Promise.resolve(false);
        /* a change of the setting while it was off (an import) */
        syncIntensity();
        var g = ++generation;
        setState('loading');
        listen();
        var p = job = Promise.all([preload(SKIN_KEY), preload(SCENE_URL)]).then(function (r) {
            /* turned off (or on anew) while the pictures came: this activation is over */
            if (g !== generation) return false;
            try {
                apply(g, r[0], r[1]);
            } catch (e) {
                warn('could not start', e);
                try { teardown(); } catch (e2) { }
                generation++;
                job = null;
                setState('off');
                try { if (W.toastr) W.toastr.warning(tx('pkg.dlv3life.failed')); } catch (e3) { }
                return false;
            }
            persist(true);
            job = null;
            setState('on');
            return true;
        });
        return p;
    }

    /* Safe at any time, also while loading or after a failed start; the switch is saved off. */
    function disable() {
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
        enable: enable,
        disable: disable,
        intensity: function () { return intensityV; },
        setIntensity: function (name) {
            /* the setting as it is now was seen: only a later change of it replaces this choice */
            try { intensityFrom = W.defaultmapsettings && W.defaultmapsettings.dyingLightIntensity; } catch (e) { }
            if (!INTENSITIES[name] || name === intensityV) return false;
            intensityV = name;
            emit();
            return true;
        },
        getFallbackSkinKey: getFallbackSkinKey,
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
        /* an effect is on: variants, particles, spawn, gameOver */
        effect: function (name) { return state === 'on' && FX[name] === true; },
        /* suppress (false) or allow (true) one effect; it applies at once, the theme stays on */
        setEffect: function (name, on) {
            if (!Object.prototype.hasOwnProperty.call(FX, name)) return false;
            FX[name] = !!on;
            if (name === 'variants') byNick.clear();
            if (name === 'gameOver') syncGameOver();
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
 *     call (sound and a short story line), a shadow at the edge of the screen (400-800 ms), a watcher
 *     in a corner; the night falling (once a cycle) and a real death (its signal) or a dropped
 *     connection while playing;
 *   - its sounds through the Legend mixer (LMNotifications.play, Gameplay channel x master x gain),
 *     at most 2 at a time, never added to the page.
 * Intensity: competitive = the fixed scene, only the death / connection signals; immersive = the
 * cycle and rare events; nightmare = the same, more often. Nothing happens while the tab is hidden
 * (paused, no catch-up after), in a replay, in the menu or spectating, while typing or on the Game
 * Over window, just after a spawn; no scares with the system's reduced motion or a busy page (ticks
 * coming late, or under 30 FPS when the FPS counter is on), which also keeps the scene as it is, and
 * only the slow watcher with Legend's Reduced motion. While on, the
 * menu and HUD show its colours over the player's theme (lmThemeOverride, never saved). */
(function () {
    'use strict';
    var W = window, DL = W.LMDyingLight;
    if (!DL || DL._lm !== 1 || typeof DL.addPart !== 'function' || W.LMDyingLightDirector) return;

    var BASE = 'https://www.legendmod.ml/';
    var CYCLE_MS = 600000, TICK_MS = 1000, LATE_MS = 250, PRELOAD_MS = 30000;
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
    var GHOSTS = ['zombie2', 'zombie3', 'zombie4', 'zombiebig', 'volatile'];
    /* the manifest's suggestedGain (levels the files to one loudness) ... */
    var SOUNDS = { 'radio-join': 0.5, 'radio-spectate': 0.39, 'radio-profile': 0.87, chime: 0.24, 'death-1': 0.15, 'death-2': 1, 'death-3': 1, 'signal-lost': 1 };
    var RADIO = ['radio-join', 'radio-spectate', 'radio-profile'];
    /* ... times the level of its kind (inside the Gameplay channel and master volume) */
    var LEVEL = { radio: 0.32, nightfall: 0.38, death: 0.42 };
    var PROFILES = {
        competitive: { cycle: false, events: false, toasts: false },
        immersive: { cycle: true, events: true, toasts: true, rollMs: 30000, chance: 0.35, gapMs: 150000 },
        nightmare: { cycle: true, events: true, toasts: true, rollMs: 20000, chance: 0.6, gapMs: 75000 }
    };
    /* cooldown of each event and its weight in each phase (none = not then); visual = a scare */
    var EVENTS = {
        radio: { cooldownMs: 120000, w: { day: 1, dusk: 2, night: 2, deepNight: 1, dawn: 1 } },
        shadow: { cooldownMs: 120000, visual: true, sudden: true, w: { dusk: 1, night: 2, deepNight: 3 } },
        watcher: { cooldownMs: 180000, visual: true, w: { night: 1, deepNight: 2 } }
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
        '.lm-dl-ghost{position:fixed;bottom:-5vmin;width:30vmin;height:30vmin;background:center/contain no-repeat;filter:brightness(0);' +
        'opacity:0;pointer-events:none;z-index:1;animation:lm-dl-ghost .6s ease-in-out forwards}' +
        '.lm-dl-ghost-l{left:-7vmin}.lm-dl-ghost-r{right:-7vmin}' +
        '.lm-dl-watcher{top:7vh;bottom:auto;width:14vmin;height:14vmin}.lm-dl-watcher.lm-dl-ghost-l{left:1vmin}.lm-dl-watcher.lm-dl-ghost-r{right:1vmin}' +
        '@keyframes lm-dl-ghost{0%{opacity:0}35%{opacity:var(--lm-dl-a,.35)}65%{opacity:var(--lm-dl-a,.35)}100%{opacity:0}}';

    function tx(key) { return typeof W.lmT === 'function' ? W.lmT(key) : key; }
    function warn(what, e) { try { console.warn('[Dying Light] ' + what, e); } catch (e2) { } }
    function rnd() { return Math.random(); }
    function setting(k) { var s = W.defaultmapsettings; return s && typeof s === 'object' ? s[k] : undefined; }
    function phaseAt(ms) {
        var t = ((ms % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
        for (var i = PHASES.length - 1; i > 0; i--) if (t >= PHASES[i].at) return PHASES[i];
        return PHASES[0];
    }
    function profile() {
        var p = null;
        try { p = PROFILES[DL.intensity()]; } catch (e) { }
        return p || PROFILES.immersive;
    }

    /* -- state of one activation (reset by start and stop) -- */
    var on = false, live = false, gen = 0, timer = 0, acc = 0, runAt = 0, lastTick = 0, late = 0, okTicks = 0, busy = false;
    var phase = null, nextRollAt = 0, lastEventAt = -Infinity, lastAt = {}, lastMajorAt = -Infinity;
    var quietUntil = 0, lastDeathAt = -Infinity, lastSignalAt = -Infinity, deathN = 0, radioN = 0;
    var shown = null, pend = null, failed = {};
    var audios = [], subs = [], onVis = null, styleEl = null, ghostEl = null, ghostUntil = 0;

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
        if (on && live) arm();
    }

    function step(E, constrained) {
        var p = profile(), cyc = p.cycle && setting('dyingLightCycle') !== false;
        var ph = cyc ? phaseAt(E) : NIGHT;
        if (ph !== phase) {
            var prev = phase;
            phase = ph;
            if (prev && cyc && ph === NIGHT) nightfall(E, p);
        }
        scenes(E, cyc, ph, constrained);
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
    function dropPend() {
        if (pend) { pend.img.onload = pend.img.onerror = null; pend = null; }
    }
    /* one picture at a time besides the one shown; a failed one is not asked again this activation */
    function load(url) {
        if (failed[url]) return;
        dropPend();
        var g = gen, im = new W.Image(), p = { url: url, img: im, ok: false };
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
    function quiet(E) {
        if (hidden() || E < quietUntil || replay()) return true;
        var lm = W.legendmod;
        if (!lm || !lm.play) return true;
        var d = W.document, a = d && d.activeElement;
        if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.tagName === 'SELECT' || a.isContentEditable)) return true;
        return !!(d && typeof d.getElementById === 'function' && d.getElementById('lm-gameover-modal'));
    }
    function roll(E, p, ph, constrained) {
        if (E - lastEventAt < p.gapMs || quiet(E) || rnd() >= p.chance) return;
        var scares = setting('dyingLightScares') !== false && !constrained && !noMotion();
        /* Legend's Reduced motion (on by default): no sudden figure, only the slow faint watcher */
        var calm = !!setting('reducedMotion');
        var total = 0, k, pick = null;
        for (k in EVENTS) total += weight(k, E, ph, scares, calm);
        if (!(total > 0)) return;
        var r = rnd() * total;
        for (k in EVENTS) {
            var w = weight(k, E, ph, scares, calm);
            if (w > 0) { pick = k; if (r < w) break; r -= w; }
        }
        k = pick;
        lastAt[k] = E;
        lastEventAt = E;
        if (k === 'radio') {
            radioN = radioN % RADIO.length;
            play(RADIO[radioN], LEVEL.radio);
            radioN++;
            if (p.toasts) toast(tx('pkg.dlv3dir.radio' + radioN));
        } else ghost(k === 'watcher', E);
    }
    function weight(k, E, ph, scares, calm) {
        var ev = EVENTS[k], w = ev.w[ph.id] || 0;
        if (!w || (ev.visual && !scares) || (ev.sudden && calm) || (lastAt[k] != null && E - lastAt[k] < ev.cooldownMs)) return 0;
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
        if (!t || typeof t.info !== 'function' || !text) return;
        var s = String(text).slice(0, 200).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        try { t.info(s, '', { toastClass: 'toast lm-dl-toast', timeOut: 6000 }); } catch (e) { }
    }

    /* a dark figure at the edge of the screen (decorative, under the HUD, no clicks) */
    function ghost(watcher, E) {
        var d = W.document;
        if (!d || !d.body || typeof d.createElement !== 'function') return;
        hideGhost();
        var el = d.createElement('div'), ms = watcher ? 2500 : 400 + Math.round(400 * rnd());
        var skin = GHOSTS[Math.floor(rnd() * GHOSTS.length) % GHOSTS.length];
        el.className = 'lm-dl-ghost ' + (watcher ? 'lm-dl-watcher ' : '') + (rnd() < 0.5 ? 'lm-dl-ghost-l' : 'lm-dl-ghost-r');
        el.setAttribute('aria-hidden', 'true');
        el.style.backgroundImage = 'url("' + BASE + 'banners/dyinglight/skins/' + skin + '-256.webp")';
        el.style.animationDuration = ms + 'ms';
        if (watcher) el.style.setProperty('--lm-dl-a', '0.18');
        el.addEventListener('animationend', hideGhost);
        d.body.appendChild(el);
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

    /* -- sounds: the Legend mixer, at most MAX_SOUNDS elements, reused -- */
    function userGain() {
        var v = Number(setting('dyingLightVolume'));
        return Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
    }
    /* force: a real death / lost connection takes the oldest element when both play */
    function play(id, level, force) {
        var mix = W.LMNotifications;
        if (!on || !mix || typeof mix.play !== 'function' || hidden() || !SOUNDS[id]) return false;
        var gain = SOUNDS[id] * level * userGain();
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
        mix.play(a, 'gameplay', gain);
        return true;
    }
    function stopSounds() {
        for (var i = 0; i < audios.length; i++) { try { audios[i].pause(); } catch (e) { } }
    }
    function releaseSounds() {
        stopSounds();
        for (var i = 0; i < audios.length; i++) {
            var a = audios[i];
            try { a.removeAttribute('src'); a._lmUrl = null; a.load(); } catch (e) { }
        }
        audios.length = 0;
    }

    /* -- game events -- */
    function onDeath(d) {
        /* a multibox unit lost while another lives is no Game Over */
        if (!on || !live || (d && d.scope === 'unit') || replay()) return;
        var E = clock(now());
        if (E - lastDeathAt < DEATH_GAP_MS) return;
        lastDeathAt = E;
        deathN = deathN % 3 + 1;
        play('death-' + deathN, LEVEL.death, true);
    }
    function onSpawn() {
        /* a quick respawn ends the last life's sound and figure; a short calm after */
        stopSounds();
        hideGhost();
        if (on) quietUntil = clock(now()) + SPAWN_QUIET_MS;
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
        phase = null; nextRollAt = 0; lastEventAt = -Infinity; lastAt = {}; lastMajorAt = -Infinity;
        quietUntil = 0; lastDeathAt = -Infinity; lastSignalAt = -Infinity; deathN = 0; radioN = 0;
        shown = null; dropPend(); failed = {};
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
        sub('death', onDeath);
        sub('spawn', onSpawn);
        sub('disconnect', onDisconnect);
        sub('serverChange', onServer);
        if (!hidden()) resume(now());
    }
    function stop() {
        on = false;
        gen = -1;
        clearTimeout(timer);
        timer = 0;
        var ev = W.LMEvents;
        while (subs.length) {
            var s = subs.pop();
            try { ev.off(s[0], s[1]); } catch (e) { }
        }
        var d = W.document;
        if (onVis && d && typeof d.removeEventListener === 'function') d.removeEventListener('visibilitychange', onVis);
        onVis = null;
        releaseSounds();
        hideGhost();
        if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        styleEl = null;
        shown = null;
        dropPend();
        live = false;
    }

    DL.addPart({
        name: 'director',
        start: function (g) { start(g); },
        stop: stop,
        background: function () { return on ? shown : null; }
    });
    /* its colours over the menu / HUD theme, while on (any intensity) */
    DL.addPart({
        name: 'theme',
        start: function () { if (typeof W.lmThemeOverride === 'function') W.lmThemeOverride('dyinglight', COLORS); },
        stop: function () { if (typeof W.lmThemeOverride === 'function') W.lmThemeOverride('dyinglight', null); }
    });
    /* read-only view for diagnostics and tests */
    W.LMDyingLightDirector = Object.freeze({
        phaseAt: function (ms) { return phaseAt(+ms || 0).id; },
        info: function () {
            return {
                running: on && live, on: on, clock: on ? clock(now()) : 0, phase: phase ? phase.id : null,
                busy: busy, scene: shown ? shown.url : null, loading: pend ? pend.url : null,
                sounds: audios.length, timer: !!timer, listeners: subs.length + (onVis ? 1 : 0), ghost: !!ghostEl
            };
        }
    });
})();
