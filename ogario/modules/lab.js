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

    /* texts: developers/i18n/src (modules.lab.*) */
    var P = 'modules.lab.';
    function tx(k, vars) { return typeof window.lmT === 'function' ? window.lmT(P + k, vars) : k; }

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
    /* the name / description shown: built-ins in the chosen language, plugins as they gave them */
    function nameOf(x) { return x.key ? tx(x.key) : x.name; }
    function descOf(x) { return x.key ? tx(x.key + 'Desc') : x.description; }
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
        /* the shared sizes (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
        if (document.getElementById('lm-lab-style')) return;
        var st = document.createElement('style');
        st.id = 'lm-lab-style';
        st.textContent =
            /* the rows are the menu's own option rows (label padding, Switchery): only the
             * notes and the descriptions are styled here */
            '.lmLabGroup .lm-lab-note{font-size:var(--lm-w-fs-s,11px);opacity:.75;line-height:1.4;padding:0 12px 6px}' +
            '.lmLabGroup .lm-lab-desc{display:block;font-size:var(--lm-w-fs-s,11px);opacity:.7;line-height:1.35;margin-top:2px}' +
            '.lmLabGroup .lm-lab-acts .btn{margin:4px 0 2px}';
        document.head.appendChild(st);
    }
    /* A switch like the other options (Switchery). The menu makes the Switcheries of all
     * .js-switch boxes once (setUI); a row built after that, or rebuilt, makes its own. */
    function switchery(cb) {
        if (typeof window.Switchery !== 'function' || !document.querySelector('#og-options .switchery')) return;
        var mc = '';
        try { mc = window.getComputedStyle(document.documentElement).getPropertyValue('--lm-mc').trim(); } catch (e) { }
        try {
            new window.Switchery(cb, { color: mc || '#01d9cc', size: 'small' });
            var sw = cb.nextElementSibling;
            if (sw && sw.classList.contains('switchery')) { sw.setAttribute('tabindex', '0'); sw.setAttribute('role', 'switch'); }
        } catch (e) { }
    }
    /* builds the section content (again after a registration); the switches are option rows
     * (label + checkbox.js-switch, as addOptions makes them) with ids lmLab-<id>, so the
     * Command Centre lists and toggles them. They were plain checkboxes at the far right of
     * rows without padding, under the list's scroll bar rail: a click hit the rail, which
     * scrolled the list up, and never reached the box. */
    function mount() {
        var box = document.querySelector('#og-options .lmLabGroup');
        if (!box) return false;
        css();
        try { if (window.LMi18n && window.LMi18n.dir) box.setAttribute('dir', window.LMi18n.dir()); } catch (e) { }
        var keep = box.querySelector('h5');
        while (box.lastChild && box.lastChild !== keep) box.removeChild(box.lastChild);
        if (keep && keep !== box.firstChild) box.insertBefore(keep, box.firstChild);
        box.appendChild(el('div', 'lm-lab-note', tx('intro')));
        if (!list.length) box.appendChild(el('div', 'lm-lab-note', tx('none')));
        var made = [];
        list.forEach(function (x) {
            var row = el('label', 'lm-lab-row');
            row.appendChild(document.createTextNode(nameOf(x) + ' '));
            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = 'lmLab-' + x.id;
            cb.className = 'js-switch lm-lab-cb';
            cb.checked = !!active[x.id];
            row.appendChild(cb);
            var desc = descOf(x);
            var d = desc + (x.builtIn ? '' : (desc ? ' \u00b7 ' : '') + tx('fromPlugin'));
            if (d) row.appendChild(el('span', 'lm-lab-desc', d));
            box.appendChild(row);
            made.push(cb);
        });
        made.forEach(switchery);
        var acts = el('div', 'lm-lab-acts');
        var rb = el('button', 'btn btn-xs btn-block btn-danger', tx('reset'));
        rb.type = 'button';
        rb.id = 'lm-lab-reset';
        acts.appendChild(rb);
        /* no User Scripts button here: it is in the Tools tab (one place; the hotkey and the
         * Command Centre open it too) */
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
            });
        }
        return true;
    }
    function sync() {
        list.forEach(function (x) {
            var cb = document.getElementById('lmLab-' + x.id);
            if (!cb || cb.checked === !!active[x.id]) return;
            cb.checked = !!active[x.id];
            /* moves its Switchery (it listens on the box); not bubbling, so set() does not run again */
            try { cb.dispatchEvent(new Event('change')); } catch (e) { }
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
        list: function () { return list.map(function (x) { return { id: x.id, name: nameOf(x), description: descOf(x), enabled: !!active[x.id] }; }); },
        _mount: mount,
        _pure: pure
    };

    /* ---------- built-in experiments ----------
     * none now: "Frame time in the FPS counter" became the stats option showStatsFrameTime
     * (Settings > Stats, next to FPS); ogario.v4.js loadSettings carries a switch left on here */

    /* the section is made by the settings menu: fill it once it is there */
    var tries = 0;
    /* a language change rebuilds the section (it keeps the switch states) */
    if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(function () { mount(); });
    (function wait() {
        if (mount() || ++tries > 120) return;
        setTimeout(wait, 500);
    })();
})();
