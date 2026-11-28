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
 *   hasForegroundFx(), needsThreatData(), addPart({ name, start(gen, api), stop(), fx, threat })
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

    var state = 'off', generation = 0, intensityV = 'immersive';
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
                'html.lm-dl-go #lm-gameover-modal .lm-go-card{background:#090c0d!important;border-color:#171d20!important;border-top-color:#a12b30!important;' +
                'box-shadow:0 8px 32px rgba(0,0,0,.75),inset 0 0 48px rgba(161,43,48,.14)!important;}' +
                'html.lm-dl-go #lm-gameover-modal .lm-go-card>div:first-child{background:linear-gradient(180deg,#171d20 0%,#090c0d 100%)!important;border-bottom-color:#3b1215!important;}' +
                'html.lm-dl-go #lm-gameover-modal .lm-go-card>div:first-child>div:last-child{color:#a12b30!important;text-shadow:0 0 8px rgba(161,43,48,.5);}' +
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
     * arena or with Reduced motion. The position can be 0 in the first frame: one try 150 ms later. */
    function spawnBurst(g, again) {
        spawnTimer = 0;
        if (g !== generation || state !== 'on' || !FX.spawn) return;
        var app = W.application, dr = W.drawRender, lm = W.legendmod, ms = W.defaultmapsettings;
        if (!app || !dr || typeof dr.startSpawnBurst !== 'function' || typeof app.getPlayerX !== 'function') return;
        if ((lm && (lm.isLegendWorld || lm.serverType === 'expandingland')) || (ms && ms.reducedMotion) ||
            (W.LMPractice && W.LMPractice.on) || W._lmEvReplayOn) return;
        var x = +app.getPlayerX(), y = +app.getPlayerY();
        if (!isFinite(x) || !isFinite(y)) return;
        if (!x && !y) {
            if (!again) spawnTimer = setTimeout(function () { spawnBurst(g, true); }, 150);
            return;
        }
        dr.startSpawnBurst(x, y, SPAWN_COLOUR);
        burstAt = dr._spawnEffect ? dr._spawnEffect.startTime : 0;
    }
    function startFx(g) {
        syncGameOver();
        if (onSpawn || !W.LMEvents || typeof W.LMEvents.on !== 'function') return;
        onSpawn = function () {
            if (spawnTimer) clearTimeout(spawnTimer);
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
            if (!INTENSITIES[name] || name === intensityV) return false;
            intensityV = name;
            emit();
            return true;
        },
        getFallbackSkinKey: getFallbackSkinKey,
        getBackground: function () { return state === 'on' ? bg : null; },
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
