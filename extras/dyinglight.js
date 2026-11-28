/* Dying Light expansion for Legend Mod (by Jimboy3100), loaded on demand by LMexpress.js
 * (opendyinglight). It only changes how the game looks while it is on and can be turned on and
 * off without a reload: nothing of the player's theme, settings, profiles, hotkeys or chat
 * commands is changed or imported. The one thing kept is the switch itself, the gameplay setting
 * dyingLight (saved with the other settings, exported, reset by Restore defaults).
 *
 * window.LMDyingLight:
 *   state 'off' | 'loading' | 'on' | 'disabling', generation (a new number on every enable/disable)
 *   isEnabled(), enable({ confirm }), disable(), intensity(), setIntensity(name)
 *   getFallbackSkinKey(cell): the skin key for an eligible other player's body, else null
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
     * defaultSettings.commanderImageDyingLight at the 512 px of the WebGL skin layers, one
     * fallback for every eligible body until a stable identity across Full Map / multibox copies
     * is shared; the first scene of the old background chain */
    var SKIN_KEY = IMG + 'dyinglight/skins/zombie-512.webp';
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
            styleEl.textContent = 'html.lm-dl #minimap-sectors{background-image:url("' + MINIMAP_URL + '");background-size:cover;background-position:center;}';
        }
        if (!styleEl.parentNode) (d.head || d.documentElement).appendChild(styleEl);
        d.documentElement.classList.add('lm-dl');
    }
    function removeStyle() {
        var d = W.document;
        if (d && d.documentElement) d.documentElement.classList.remove('lm-dl');
        if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
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
        /* the older readers in ogario.v4.js still look at the global flag and the zombie picture */
        W.dyinglight1load = 'yes';
        if (zombie && !(W.cimgDyingLight && W.cimgDyingLight.naturalWidth > 0)) W.cimgDyingLight = zombie;
        bg = scene ? Object.freeze({ url: SCENE_URL, img: scene, alpha: 1 }) : null;
        addStyle();
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
        return SKIN_KEY;
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
