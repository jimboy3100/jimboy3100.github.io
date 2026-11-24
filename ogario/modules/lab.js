/* Legend Mod Lab: experimental features with a switch each, in Settings > "Lab (experimental)"
 * (the "Lab" hotkey without a default key opens it, the Command Centre finds it too).
 *
 * Every experiment is off until the player turns it on. The switches are kept in their own
 * localStorage key 'lmLab' ({ v: 1, on: { id: true } }, checked on read), apart from the
 * settings: they are not exported, and "Reset Lab" turns everything off.
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

    var STR = {
        intro: { en: 'Experimental features: they may change or go away. All are off until you turn them on; these switches are kept apart from your settings (not exported).', el: 'Πειραματικές λειτουργίες: μπορεί να αλλάξουν ή να αφαιρεθούν. Όλες είναι ανενεργές μέχρι να τις ενεργοποιήσεις· οι διακόπτες φυλάσσονται χωριστά από τις ρυθμίσεις σου (δεν εξάγονται).' },
        none: { en: 'No experiments right now.', el: 'Δεν υπάρχουν πειράματα αυτή τη στιγμή.' },
        reset: { en: 'Reset Lab', el: 'Επαναφορά Lab' },
        confirmReset: { en: 'Turn every Lab experiment off?', el: 'Απενεργοποίηση όλων των πειραμάτων του Lab;' },
        resetDone: { en: 'Lab reset: every experiment is off.', el: 'Το Lab επαναφέρθηκε: όλα τα πειράματα είναι ανενεργά.' },
        plugins: { en: 'User Scripts (plugins)', el: 'User Scripts (plugins)' },
        fromPlugin: { en: 'added by a plugin', el: 'από plugin' },
        frameTime: { en: 'Frame time in the FPS counter', el: 'Χρόνος καρέ στον μετρητή FPS' },
        frameTimeDesc: { en: 'Shows how long one frame takes next to the FPS in the stats line, e.g. "FPS: 60 (16.7 ms)". Needs "FPS" on in Stats.', el: 'Δείχνει πόσο διαρκεί ένα καρέ δίπλα στα FPS στη γραμμή στατιστικών, π.χ. "FPS: 60 (16.7 ms)". Χρειάζεται το "FPS" ενεργό στα Στατιστικά.' }
    };
    function lang() {
        try { return window.localStorage.getItem('languagemod') === '2' ? 'el' : 'en'; } catch (e) { return 'en'; }
    }
    function tx(k) { var r = STR[k]; return r ? (r[lang()] || r.en) : k; }

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
        byId[x.id] = x;
        list.push(x);
        if (load().on[x.id]) apply(x, true);
        mount();
        return true;
    }
    function set(id, on) {
        var x = byId[id];
        if (!x) return false;
        var st = load();
        if (on) st.on[id] = true; else delete st.on[id];
        save(st);
        apply(x, !!on);
        sync();
        return !!on;
    }
    function isEnabled(id) { return !!active[id]; }
    function reset(skipConfirm) {
        if (!skipConfirm && !window.confirm(tx('confirmReset'))) return false;
        list.forEach(function (x) { apply(x, false); });
        try { window.localStorage.removeItem(STORE_KEY); } catch (e) { }
        sync();
        try { if (window.toastr) window.toastr.info(tx('resetDone')); } catch (e) { }
        return true;
    }

    /* ---------- Settings > Lab (experimental) ---------- */

    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }
    function css() {
        if (document.getElementById('lm-lab-style')) return;
        var st = document.createElement('style');
        st.id = 'lm-lab-style';
        st.textContent =
            '.lmLabGroup .lm-lab-note{font-size:11px;opacity:.75;line-height:1.4;margin:2px 0 6px}' +
            '.lmLabGroup label.lm-lab-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;font-weight:normal;cursor:pointer;padding:3px 0}' +
            '.lmLabGroup label.lm-lab-row input{width:18px;height:18px;margin:2px 0 0;flex:none}' +
            '.lmLabGroup .lm-lab-desc{display:block;font-size:11px;opacity:.7;line-height:1.35}' +
            '.lmLabGroup .lm-lab-acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}' +
            '.lmLabGroup .lm-lab-acts .btn{min-height:28px}';
        document.head.appendChild(st);
    }
    /* builds the section content (again after a registration); the switches are plain
     * checkboxes with ids lmLab-<id>, so the Command Centre lists and toggles them */
    function mount() {
        var box = document.querySelector('#og-options .lmLabGroup');
        if (!box) return false;
        css();
        var keep = box.querySelector('h5');
        while (box.lastChild && box.lastChild !== keep) box.removeChild(box.lastChild);
        if (keep && keep !== box.firstChild) box.insertBefore(keep, box.firstChild);
        box.appendChild(el('div', 'lm-lab-note', tx('intro')));
        if (!list.length) box.appendChild(el('div', 'lm-lab-note', tx('none')));
        list.forEach(function (x) {
            var row = el('label', 'lm-lab-row');
            var txt = el('span', '', x.name);
            var d = x.description + (x.builtIn ? '' : (x.description ? ' · ' : '') + tx('fromPlugin'));
            if (d) txt.appendChild(el('span', 'lm-lab-desc', d));
            row.appendChild(txt);
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = 'lmLab-' + x.id;
            cb.className = 'lm-lab-cb';
            cb.checked = !!active[x.id];
            row.appendChild(cb);
            box.appendChild(row);
        });
        var acts = el('div', 'lm-lab-acts');
        var rb = el('button', 'btn btn-xs btn-danger', tx('reset'));
        rb.type = 'button';
        rb.id = 'lm-lab-reset';
        acts.appendChild(rb);
        var pb = el('button', 'btn btn-xs', tx('plugins'));
        pb.type = 'button';
        pb.id = 'lm-lab-plugins';
        acts.appendChild(pb);
        box.appendChild(acts);
        if (!box._lmLab) {
            box._lmLab = true;
            box.addEventListener('change', function (e) {
                var t = e.target;
                if (t && t.classList && t.classList.contains('lm-lab-cb')) set(t.id.slice(6), t.checked);
            });
            box.addEventListener('click', function (e) {
                var t = e.target;
                if (!t || !t.id) return;
                if (t.id === 'lm-lab-reset') { e.preventDefault(); reset(); }
                else if (t.id === 'lm-lab-plugins') { e.preventDefault(); if (window.LMPlugins) window.LMPlugins.open('plugins'); }
            });
        }
        return true;
    }
    function sync() {
        list.forEach(function (x) {
            var cb = document.getElementById('lmLab-' + x.id);
            if (cb) cb.checked = !!active[x.id];
        });
    }
    /* opens the menu at the Lab section */
    function open() {
        var $ = window.jQuery;
        try { if (window.application && typeof window.application.showMenu === 'function') window.application.showMenu(); } catch (e) { }
        if ($) $('.menu-tabs a[href="#og-settings"]').trigger('click');
        setTimeout(function () {
            var box = document.querySelector('#og-options .lmLabGroup');
            if (!box) return;
            try { box.scrollIntoView({ block: 'start' }); } catch (e) { try { box.scrollIntoView(); } catch (e2) { } }
            try { if ($) $(box).closest('.menu-panel, .submenu-panel').perfectScrollbar('update'); } catch (e) { }
        }, 250);
    }

    window.LMLab = {
        register: register,
        set: set,
        isEnabled: isEnabled,
        reset: reset,
        open: open,
        list: function () { return list.map(function (x) { return { id: x.id, name: x.name, description: x.description, enabled: !!active[x.id] }; }); },
        _mount: mount,
        _pure: pure
    };

    /* ---------- built-in experiments ---------- */

    /* the stats line reads window._lmLabFrameTime (ogario.v4.js, "FPS: ") */
    register({
        id: 'frameTime', name: tx('frameTime'), description: tx('frameTimeDesc'), _builtIn: true,
        onEnable: function () { window._lmLabFrameTime = true; },
        onDisable: function () { window._lmLabFrameTime = false; }
    });

    /* the section is made by the settings menu: fill it once it is there */
    var tries = 0;
    (function wait() {
        if (mount() || ++tries > 120) return;
        setTimeout(wait, 500);
    })();
})();
