/* Legend Mod Lab: experimental features with a switch each, shown in the User Scripts window
 * (plugins.js: next to the plugin that added one, the others under "Experiments"; its hotkey,
 * and the Tools tab button open it).
 *
 * Every experiment is off until the player turns it on. The switches are kept in their own
 * localStorage key 'lmLab' ({ v: 1, on: { id: true } }, checked on read), apart from the
 * settings: they are not exported, and "Turn all experiments off" there turns everything off.
 *
 * Modules and plugins add experiments with
 *   LMLab.register({ id, name, description, onEnable, onDisable })
 * onEnable runs when the switch goes on (and at start when it was left on), onDisable when it
 * goes off. A failing callback is logged and does not stop the others.
 *
 * The pure helpers are tested in developers/tests/plugins.js.
 */
(function () {
    'use strict';

    /* ------------------------------------------------------------------------------------
     * Pure logic (no DOM)
     * ------------------------------------------------------------------------------------ */

    var STORE_KEY = 'lmLab';
    var MAX = 100;
    var ID_RE = /^[A-Za-z][A-Za-z0-9_.-]{0,39}$/;

    function hasOwn(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
    function cleanText(v, max) {
        if (v == null) return '';
        var s = String(v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ').replace(/\s+/g, ' ').trim();
        return s.length > max ? s.slice(0, max).trim() : s;
    }
    /* stored switches -> { v: 1, on: { id: true } } (only valid ids that are on) */
    function validateStore(raw) {
        var o = raw, out = { v: 1, on: {} }, n = 0;
        if (typeof raw === 'string') { try { o = JSON.parse(raw); } catch (e) { o = null; } }
        if (!o || typeof o !== 'object' || !o.on || typeof o.on !== 'object' || Array.isArray(o.on)) return out;
        for (var k in o.on) {
            if (!hasOwn(o.on, k) || n >= MAX) continue;
            if (ID_RE.test(k) && o.on[k] === true) { out.on[k] = true; n++; }
        }
        return out;
    }
    /* a registration -> the cleaned experiment, or null */
    function validateExperiment(x) {
        if (!x || typeof x !== 'object') return null;
        var id = typeof x.id === 'string' && ID_RE.test(x.id) ? x.id : '';
        var name = cleanText(x.name, 60);
        if (!id || !name) return null;
        return {
            id: id, name: name, description: cleanText(x.description, 300),
            onEnable: typeof x.onEnable === 'function' ? x.onEnable : null,
            onDisable: typeof x.onDisable === 'function' ? x.onDisable : null
        };
    }

    var pure = { validateStore: validateStore, validateExperiment: validateExperiment, cleanText: cleanText, STORE_KEY: STORE_KEY };

    if (typeof window === 'undefined') {
        if (typeof module === 'object' && module.exports) module.exports = pure;
        return;
    }

    /* ------------------------------------------------------------------------------------
     * In the page
     * ------------------------------------------------------------------------------------ */

    if (window._lmLabLoaded) return;
    window._lmLabLoaded = true;

    /* texts: developers/i18n/src (modules.lab.*, pkg.lb2.*) */
    var P = 'modules.lab.';
    function tx(k, vars) { return typeof window.lmT === 'function' ? window.lmT(P + k, vars) : k; }
    function tx2(k) { return typeof window.lmT === 'function' ? window.lmT(k) : k; }

    function load() { var raw = null; try { raw = window.localStorage.getItem(STORE_KEY); } catch (e) { } return validateStore(raw); }
    function save(st) { try { window.localStorage.setItem(STORE_KEY, JSON.stringify(validateStore(st))); } catch (e) { } }

    var list = [], byId = {}, active = {};
    function call(x, fn) {
        if (!x[fn]) return;
        try { x[fn](); } catch (e) { try { console.warn('[LM Lab] "' + x.id + '" ' + fn + ' failed:', e); } catch (e2) { } }
    }
    function apply(x, on) {
        if (!!active[x.id] === on) return;
        active[x.id] = on;
        call(x, on ? 'onEnable' : 'onDisable');
    }

    function register(def) {
        var x = validateExperiment(def);
        if (!x || hasOwn(byId, x.id)) return false;
        x.builtIn = !!(def && def._builtIn);
        /* a built-in experiment names its texts by key, so they follow a language change */
        if (x.builtIn && typeof def._key === 'string') x.key = def._key;
        x.slot = x.builtIn ? 0 : slotOfCaller();
        byId[x.id] = x;
        list.push(x);
        if (load().on[x.id]) apply(x, true);
        notify();
        return true;
    }
    function set(id, on) {
        var x = byId[id];
        if (!x) return false;
        var st = load();
        if (on) st.on[id] = true; else delete st.on[id];
        save(st);
        apply(x, !!on);
        notify();
        return !!on;
    }
    /* the name / description shown: built-ins in the chosen language, plugins as they gave them */
    function nameOf(x) { return x.key ? tx(x.key) : x.name; }
    function descOf(x) { return x.key ? tx(x.key + 'Desc') : x.description; }
    function isEnabled(id) { return !!active[id]; }
    function reset(skipConfirm) {
        if (!skipConfirm && !window.confirm(tx2('pkg.lb2.confirmReset'))) return false;
        list.forEach(function (x) { apply(x, false); });
        try { window.localStorage.removeItem(STORE_KEY); } catch (e) { }
        notify();
        try { if (window.toastr) window.toastr.info(tx2('pkg.lb2.resetDone')); } catch (e) { }
        return true;
    }

    /* The switches are shown in the User Scripts window (plugins.js): next to the plugin that
     * registered one, the others in its "Experiments" group. It reads list() and asks set() /
     * reset(); a change here redraws it. */
    function notify() {
        var M = window.LMPlugins;
        if (M && typeof M._refresh === 'function') { try { M._refresh(); } catch (e) { } }
    }
    /* the User Scripts slot (1-5) whose script registers it now (its top level), 0 otherwise */
    function slotOfCaller() {
        var cs = document.currentScript, text = cs && typeof cs.text === 'string' ? cs.text : '';
        var ran = window._lmUsRan;
        if (!text || !ran) return 0;
        for (var n = 1; n <= 5; n++) if (ran[n] === text) return n;
        return 0;
    }
    /* opens the User Scripts window at the experiments (the Lab section in Settings is gone) */
    function open() {
        var M = window.LMPlugins;
        if (M && typeof M.open === 'function') M.open('experiments');
    }

    window.LMLab = {
        register: register,
        set: set,
        isEnabled: isEnabled,
        reset: reset,
        open: open,
        /* slot: the User Scripts slot whose plugin registered it (0: none); builtIn: a Legend Mod one */
        list: function () { return list.map(function (x) { return { id: x.id, name: nameOf(x), description: descOf(x), enabled: !!active[x.id], slot: x.slot, builtIn: x.builtIn }; }); },
        /* kept for scripts that called it: the switches are redrawn in the User Scripts window */
        _mount: function () { notify(); return true; },
        _pure: pure
    };

    /* ---------- built-in experiments ----------
     * none now: the old "Frame time in the FPS counter" experiment is gone, the stats line shows
     * the frame time in place of the FPS (a switch left on here is ignored) */

    /* the User Scripts window may be drawn already (the two files load in any order) */
    notify();
})();
