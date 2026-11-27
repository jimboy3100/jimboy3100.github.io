/* Legend Mod "My themes": part of the Theme presets (Theme tab, under "Theme preset").
 * The current theme is saved under a name; picking it in the list applies it at once (and saves it,
 * like the preset lists); Update puts the current theme into the chosen one and keeps the replaced
 * version (the last 5); an older version picked in the same list comes back as the theme's
 * current one (the replaced one goes into its versions). Kept in this browser in localStorage
 * 'lmThemeWorkshop' (the key of the old Theme workshop window, so themes saved there stay;
 * Settings > Export / import carries it).
 *
 * A stored theme is data only: { id, name, created, updated, src?, body: { theme, sounds? },
 * history: [{ t, body }] }. Every value is checked against the shipped theme schema
 * (LM_THEME_DEFAULTS, lmThemeValue: ranges, steps, preset / font names, colour format); other
 * strings must be an https URL. Unknown keys are dropped, sizes are capped. A theme stands for the
 * whole look: settings it leaves out get their shipped defaults, except the cursor, the background
 * and the sounds, which stay as they are.
 */
(function () {
    'use strict';
    if (window._lmMyThemesLoaded) return;
    window._lmMyThemesLoaded = true;

    var W = window;
    var KEY_STORE = 'lmThemeWorkshop';
    var MAX_THEMES = 30, MAX_HISTORY = 5;
    /* characters of JSON: the themes never fill the storage the settings themselves need */
    var MAX_STORE_CHARS = 400000;
    var MAX_INPUT_KEYS = 600;
    var NAME_MAX = 40, URL_MAX = 400;

    var own = Object.prototype.hasOwnProperty;
    function has(o, k) { return !!o && own.call(o, k); }
    function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
    function same(a, b) { return a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-9); }
    /* JSON with sorted keys, to compare two themes */
    function stable(v) {
        if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
        if (isObj(v)) return '{' + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ':' + stable(v[k]); }).join(',') + '}';
        return JSON.stringify(v);
    }

    /* ── Texts: the shared language packs (developers/i18n/src) ── */
    var P = 'modules.mythemes.';
    /* tx('key', a, b): the text in the chosen language with {0} = a, {1} = b */
    function tx(key) {
        var vars = Array.prototype.slice.call(arguments, 1);
        return typeof W.lmT === 'function' ? W.lmT(P + key, vars) : key;
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    /* ── Validation ── */
    /* https only; no quotes, brackets, spaces or backslashes (the URLs end up in CSS url(...)
     * and src attributes), no user:password@ part */
    var URL_RE = /^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+(?::\d{1,5})?(?:[\/?#][A-Za-z0-9\-._~%!$&*+,;=:@\/?#]*)?$/i;
    /* not part of a theme: a one-time flag, the marker LMexpress reads, the commander images */
    function excluded(k) { return k === 'checkonetimeLc2' || k === 'lbTeammateColor' || /^commanderImage/.test(k); }
    var URL_KEYS = { menuBg: 1, customBackground: 1, customCursor: 1 };
    /* kept as they are when a theme leaves them out */
    var KEEP_KEYS = { customBackground: 1, customCursor: 1 };
    var SOUND_KEYS = ['messageSound', 'commandSound', 'virusSoundurl'];
    var SOUND_SETTERS = { messageSound: 'setMessageSound', commandSound: 'setCommandSound', virusSoundurl: 'setvirusSound' };

    function schema() { return isObj(W.LM_THEME_DEFAULTS) ? W.LM_THEME_DEFAULTS : null; }
    /* free text: no tags, angle brackets or control / direction characters, at most max characters */
    function cleanText(s, max) {
        if (typeof s !== 'string') return '';
        s = s.slice(0, max * 8).replace(/<[^>]*>/g, ' ')
            .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff<>]/g, ' ')
            .replace(/\s+/g, ' ').trim();
        return Array.from(s).slice(0, max).join('').trim();
    }
    /* '' (none) or a checked https URL; undefined when it cannot be used */
    function cleanUrl(v) {
        if (typeof v !== 'string') return undefined;
        v = v.trim();
        if (v === '') return '';
        return v.length <= URL_MAX && URL_RE.test(v) ? v : undefined;
    }
    /* one theme value, or undefined when it cannot be used */
    function themeValue(k, v) {
        var defs = schema();
        if (!defs || typeof k !== 'string' || !own.call(defs, k) || excluded(k)) return undefined;
        var rules = W.LM_THEME_SCHEMA;
        if (typeof W.lmThemeValue !== 'function' || !rules) return undefined;
        /* the core's theme schema: type, slider range and step, preset / font lists, colour format */
        var t = W.lmThemeValue(k, v);
        if (t === undefined) return undefined;
        var d = defs[k], rule = own.call(rules, k) ? rules[k] : null;
        if (typeof d === 'number') return typeof t === 'number' && isFinite(t) ? t : undefined;
        if (typeof d === 'boolean') return typeof t === 'boolean' ? t : undefined;
        if (typeof d !== 'string' || typeof t !== 'string') return undefined;
        if (rule && rule.choices) return t;
        if (rule && rule.color) return t.length <= 60 ? t : undefined;
        if (own.call(URL_KEYS, k)) return cleanUrl(t);
        /* any other text setting is left out: only values of a known kind are accepted */
        return undefined;
    }
    function soundValue(k, v) {
        if (SOUND_KEYS.indexOf(k) < 0) return undefined;
        var u = cleanUrl(v);
        if (u === undefined) return undefined;
        if (typeof W.lmSettingValue === 'function' && W.lmSettingValue(k, u) === undefined) return undefined;
        return u;
    }
    /* { k: v } of the usable theme values; null when too many keys */
    function cleanThemeMap(o) {
        if (!isObj(o)) return {};
        var keys = Object.keys(o);
        if (keys.length > MAX_INPUT_KEYS) return null;
        var out = {};
        keys.forEach(function (k) {
            var v = themeValue(k, o[k]);
            if (v !== undefined) out[k] = v;
        });
        return out;
    }
    function cleanSounds(o) {
        if (!isObj(o)) return null;
        var out = {}, n = 0;
        Object.keys(o).slice(0, MAX_INPUT_KEYS).forEach(function (k) {
            var v = soundValue(k, o[k]);
            if (v !== undefined) { out[k] = v; n++; }
        });
        return n ? out : null;
    }
    function toTime(v, fallback) {
        var t = typeof v === 'number' ? v : (typeof v === 'string' && v.length < 40 ? Date.parse(v) : NaN);
        var lo = Date.UTC(2015, 0, 1), hi = Date.now() + 86400000;
        return isFinite(t) && t >= lo && t <= hi ? Math.floor(t) : fallback;
    }
    /* the theme part of a stored theme: { theme, sounds? }, or null */
    function cleanBody(b) {
        if (!isObj(b)) return null;
        var theme = cleanThemeMap(b.theme);
        if (!theme || !Object.keys(theme).length) return null;
        var out = { theme: theme };
        var s = cleanSounds(b.sounds);
        if (s) out.sounds = s;
        return out;
    }
    /* only the values that differ from the shipped defaults (a theme stands for the whole look:
     * what it leaves out is the default); the cursor and background are always kept */
    function sparseTheme(theme) {
        var defs = schema() || {}, out = {};
        Object.keys(theme || {}).forEach(function (k) {
            if (own.call(KEEP_KEYS, k) || !own.call(defs, k) || !same(defs[k], theme[k])) out[k] = theme[k];
        });
        return out;
    }
    /* every theme value a body sets when applied over `current` */
    function effectiveTheme(body, current) {
        var defs = schema() || {}, out = {}, t = (body && body.theme) || {};
        Object.keys(defs).forEach(function (k) {
            if (excluded(k)) return;
            if (own.call(t, k)) out[k] = t[k];
            else if (own.call(KEEP_KEYS, k)) { if (has(current, k)) out[k] = current[k]; }
            else out[k] = defs[k];
        });
        return out;
    }
    function sameBody(a, b) { return stable(a) === stable(b); }

    /* ── Versions ── */
    /* the theme gets a new body; the one it had goes to the front of its versions (last 5) */
    function pushHistory(entry, body, t) {
        if (!entry || !body || sameBody(entry.body, body)) return false;
        entry.history = [{ t: entry.updated || entry.created || t, body: entry.body }].concat(entry.history || []).slice(0, MAX_HISTORY);
        entry.body = body;
        entry.updated = t;
        return true;
    }
    /* version i becomes the theme; the replaced body goes into the versions */
    function restoreVersion(entry, i, t) {
        var h = entry && entry.history && entry.history[i];
        if (!h) return false;
        var cur = { t: entry.updated || entry.created || t, body: entry.body };
        entry.history.splice(i, 1);
        if (!sameBody(cur.body, h.body)) entry.history.unshift(cur);
        entry.history = entry.history.slice(0, MAX_HISTORY);
        entry.body = h.body;
        entry.updated = t;
        return true;
    }

    /* ── Storage ── */
    var ID_RE = /^[a-z0-9]{1,24}$/;
    var SRC_RE = /^(g:[a-z0-9-]{1,40}|import|saved)$/;
    /* a stored theme; the author / description / HUD layout of themes from the old window's
     * gallery or import are not used any more and are dropped */
    function cleanEntry(e) {
        if (!isObj(e) || typeof e.id !== 'string' || !ID_RE.test(e.id)) return null;
        var body = cleanBody(e.body);
        if (!body) return null;
        var now = Date.now();
        var out = {
            id: e.id,
            name: cleanText(e.name, NAME_MAX) || tx('defaultName'),
            created: toTime(e.created, now),
            updated: toTime(e.updated, now),
            body: body,
            history: []
        };
        if (typeof e.src === 'string' && SRC_RE.test(e.src)) out.src = e.src;
        if (Array.isArray(e.history)) {
            e.history.slice(0, MAX_HISTORY).forEach(function (h) {
                if (!isObj(h)) return;
                var hb = cleanBody(h.body);
                if (hb) out.history.push({ t: toTime(h.t, out.created), body: hb });
            });
        }
        return out;
    }
    function cleanStore(raw) {
        var list = isObj(raw) && Array.isArray(raw.themes) ? raw.themes : [];
        var out = [], ids = {};
        for (var i = 0; i < list.length && i < MAX_THEMES * 2 && out.length < MAX_THEMES; i++) {
            var e = cleanEntry(list[i]);
            if (!e || own.call(ids, e.id)) continue;
            ids[e.id] = true;
            out.push(e);
        }
        return { v: 1, themes: out };
    }
    /* Drops the oldest versions until the store fits in max characters. */
    function fitStore(st, max) {
        max = max || MAX_STORE_CHARS;
        for (var guard = 0; guard < MAX_THEMES * MAX_HISTORY + 1; guard++) {
            if (JSON.stringify(st).length <= max) return true;
            var oi = -1, oj = -1, ot = Infinity;
            st.themes.forEach(function (e, i) {
                (e.history || []).forEach(function (h, j) { if (h.t < ot) { ot = h.t; oi = i; oj = j; } });
            });
            if (oi < 0) return false;
            st.themes[oi].history.splice(oj, 1);
        }
        return JSON.stringify(st).length <= max;
    }
    function store() { try { return W.localStorage || null; } catch (e) { return null; } }
    function loadStore() {
        var t = null, raw = null;
        try { var s = store(); t = s ? s.getItem(KEY_STORE) : null; } catch (e) { t = null; }
        if (t && t.length <= MAX_STORE_CHARS * 2) { try { raw = JSON.parse(t); } catch (e) { raw = null; } }
        return cleanStore(raw);
    }
    /* '' when saved, else the message key of the reason (nothing is changed then) */
    function saveStore(st) {
        if (!fitStore(st)) return 'tooBigStore';
        try { var s = store(); if (!s) return 'storageFull'; s.setItem(KEY_STORE, JSON.stringify(st)); return ''; } catch (e) { return 'storageFull'; }
    }
    function newId() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
    function uniqueName(name, list) {
        var n = name, i = 2;
        var taken = function (x) { return list.some(function (e) { return e.name === x; }); };
        while (taken(n) && i < 100) n = Array.from(name).slice(0, NAME_MAX - 4).join('') + ' ' + (i++);
        return n;
    }

    var core = {
        themeValue: themeValue, soundValue: soundValue, cleanUrl: cleanUrl, cleanText: cleanText, cleanBody: cleanBody,
        cleanStore: cleanStore, fitStore: fitStore, sparseTheme: sparseTheme, effectiveTheme: effectiveTheme,
        pushHistory: pushHistory, restoreVersion: restoreVersion, saveStore: saveStore, loadStore: loadStore,
        KEY_STORE: KEY_STORE, MAX_HISTORY: MAX_HISTORY, MAX_THEMES: MAX_THEMES, MAX_STORE_CHARS: MAX_STORE_CHARS
    };
    var api = W.LMMyThemes = { core: core };

    var D = W.document;
    if (!D || typeof D.createElement !== 'function') return;

    /* ═══ Live settings ═══ */
    function T() { return isObj(W.defaultSettings) ? W.defaultSettings : null; }
    function S() { return W.legendmod5 || W.defaultmapsettings || null; }
    function jq() { return W.jQuery || W.$ || null; }
    function ready() { return !!(T() && schema() && jq() && W.Settings && typeof W.lmThemeValue === 'function'); }
    function toast(kind, html) {
        var t = W.toastr;
        if (!t) return;
        try { (t[kind] || t.info).call(t, '<b>[' + esc(tx('tag')) + ']:</b> ' + html); } catch (e) { }
    }
    /* the current theme as a body */
    function captureBody() {
        var body = { theme: sparseTheme(cleanThemeMap(Object.assign({}, T())) || {}) };
        var s = S(), sd = W.LM_SETTINGS_DEFAULTS || {}, snd = {}, n = 0;
        if (s) SOUND_KEYS.forEach(function (k) {
            var v = soundValue(k, s[k]);
            if (v !== undefined && v !== sd[k]) { snd[k] = v; n++; }
        });
        if (n) body.sounds = snd;
        return body;
    }
    var SELECT_IDS = { preset: 'themePreset' };
    /* one theme value through its control, as a theme preset sets it (Settings.changePreset) */
    function setThemeOpt(k, v) {
        var $ = jq(), d = T();
        d[k] = v;
        if (W.ogario && has(W.ogario, k)) W.ogario[k] = v;
        try {
            var pk = $('#theme .' + k + '-picker');
            if (pk.length && pk.colorpicker) pk.colorpicker('setValue', v);
        } catch (e) { }
        d[k] = v;
        var sl = $('#' + k + '-slider');
        /* the change moves the slider's knob (rangeslider) to the value */
        if (sl.length && sl.closest('#theme').length) { sl.val(v).trigger('change'); $('#' + k + '-value').text(v); }
        var box = $('#theme input[type=text]#' + k + ', #theme select#' + (SELECT_IDS[k] || k));
        if (box.length) box.val(v);
        if (k === 'customCursor') {
            $('#theme-images .cursor-box a').removeClass('active').filter(function () { return $('img', this).attr('src') === v; }).addClass('active');
        }
    }
    /* Sets a full theme map live; the values are put back once more after the setters (the font
     * setters derive their family / weight values). Returns the changed keys. */
    function setValues(target) {
        var d = T(), St = W.Settings, changed = [];
        Object.keys(target).forEach(function (k) { if (has(d, k) && !same(d[k], target[k])) changed.push(k); });
        if (!changed.length) return changed;
        /* the controls set here fire the Theme tab's change events: they are no input of the player,
         * so they start no auto-save (the theme is saved once below) */
        var quiet = St._lmThemeQuiet;
        St._lmThemeQuiet = true;
        try {
            changed.forEach(function (k) { try { setThemeOpt(k, target[k]); } catch (e) { d[k] = target[k]; } });
            try { if (St.setTheme) St.setTheme(); } catch (e) { }
            ['setFoodColor', 'setIndicatorColor'].forEach(function (f) { try { if (typeof St[f] === 'function') St[f](); } catch (e) { } });
            Object.keys(target).forEach(function (k) {
                if (!has(d, k) || same(d[k], target[k])) return;
                d[k] = target[k];
                if (W.ogario && has(W.ogario, k)) W.ogario[k] = target[k];
            });
        } finally { St._lmThemeQuiet = quiet; }
        return changed;
    }
    function setSounds(map) {
        var s = S(), app = W.application, $ = jq(), changed = [];
        if (!s || !map) return changed;
        SOUND_KEYS.forEach(function (k) {
            if (!has(map, k) || s[k] === map[k]) return;
            s[k] = map[k];
            changed.push(k);
            try { $('#' + k).val(map[k]); } catch (e) { }
            try { if (app && typeof app[SOUND_SETTERS[k]] === 'function') app[SOUND_SETTERS[k]](); } catch (e) { }
        });
        if (changed.length) { try { if (app && app.saveSettings) app.saveSettings(s, 'ogarioSettings'); } catch (e) { } }
        return changed;
    }
    /* a theme applied and saved at once, as the preset lists do */
    function applyBody(body, name) {
        if (!ready() || !body) return false;
        var St = W.Settings;
        setValues(effectiveTheme(body, T()));
        setSounds(body.sounds);
        var ok = true;
        try { St.saveThemeSettings(); } catch (e) { ok = false; }
        toast(ok ? 'success' : 'warning', esc(ok ? tx('applied', name) : tx('saveFailed')));
        return true;
    }

    /* ═══ The list in the Theme tab ═══ */
    var chosen = '';
    function when(t) {
        try { return new Date(t).toLocaleString(W.LMi18n && typeof W.LMi18n.lang === 'function' ? W.LMi18n.lang() : undefined, { dateStyle: 'short', timeStyle: 'short' }); }
        catch (e) { return new Date(t).toISOString().slice(0, 16).replace('T', ' '); }
    }
    function css() {
        if (D.getElementById('lm-mythemes-style')) return;
        var st = D.createElement('style');
        st.id = 'lm-mythemes-style';
        st.textContent = '#lm-mythemes-box .lm-mt-btns{display:flex;gap:4px;margin-top:4px}' +
            '#lm-mythemes-box .lm-mt-btns .btn{flex:1 1 0;min-width:0;padding:4px 2px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}';
        D.head.appendChild(st);
    }
    /* the saved themes, each followed by its older versions */
    function render() {
        var $ = jq(), sel = $ && $('#lm-mythemes');
        if (!sel || !sel.length) return;
        var list = loadStore().themes;
        if (chosen && !list.some(function (e) { return e.id === chosen; })) chosen = '';
        sel.empty();
        $('<option value=""></option>').text('\u2014').appendTo(sel);
        list.forEach(function (e) {
            $('<option></option>').val(e.id).text(e.name).appendTo(sel);
            e.history.forEach(function (h, i) {
                $('<option></option>').val(e.id + ':' + i).text('\u00a0\u00a0\u21b3 ' + tx('versionOf', e.name, when(h.t))).appendTo(sel);
            });
        });
        sel.val(chosen);
        $('#lm-mythemes-box [data-mt=update], #lm-mythemes-box [data-mt=del]').prop('disabled', !chosen);
    }
    function pick(v) {
        var st = loadStore(), parts = String(v || '').split(':');
        var e = st.themes.filter(function (x) { return x.id === parts[0]; })[0];
        if (!e) { chosen = ''; render(); return; }
        chosen = e.id;
        if (parts.length > 1) {
            /* an older version: it is the theme's current one from now on */
            var h = e.history[+parts[1]];
            if (!h) { render(); return; }
            var label = tx('versionOf', e.name, when(h.t));
            restoreVersion(e, +parts[1], Date.now());
            var err = saveStore(st);
            if (err) { toast('error', esc(tx(err))); render(); return; }
            applyBody(e.body, label);
        } else applyBody(e.body, e.name);
        render();
    }
    function act(a) {
        var st = loadStore(), list = st.themes, now = Date.now();
        var e = list.filter(function (x) { return x.id === chosen; })[0] || null;
        var save = function (okMsg) {
            var err = saveStore(st);
            if (err) { toast('error', esc(tx(err))); return false; }
            if (okMsg) toast('success', esc(okMsg));
            return true;
        };
        if (a === 'save') {
            if (list.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return; }
            var nm = cleanText(W.prompt(tx('namePh'), '') || '', NAME_MAX);
            if (!nm) return;
            var n = { id: newId(), name: uniqueName(nm, list), created: now, updated: now, src: 'saved', body: captureBody(), history: [] };
            list.unshift(n);
            if (save(tx('saved', n.name))) chosen = n.id;
        } else if (a === 'update' && e) {
            var nb = captureBody();
            if (sameBody(e.body, nb)) { toast('info', esc(tx('sameTheme', e.name))); return; }
            if (!W.confirm(tx('confirmUpdate', e.name))) return;
            pushHistory(e, nb, now);
            save(tx('updated', e.name));
        } else if (a === 'del' && e) {
            if (!W.confirm(tx('confirmDelete', e.name))) return;
            list.splice(list.indexOf(e), 1);
            if (save()) chosen = '';
        }
        render();
    }
    function relabel() {
        var $ = jq();
        if (!$ || !$('#lm-mythemes-box').length) return;
        $('#lm-mythemes-box .title-box').text(tx('title'));
        $('#lm-mythemes-box [data-mt]').each(function () { $(this).text(tx($(this).attr('data-mt') === 'save' ? 'saveCurrent' : $(this).attr('data-mt'))); });
        render();
    }
    /* the box under the Theme preset list */
    function build() {
        var $ = jq();
        if (!$ || $('#lm-mythemes-box').length) return true;
        var anchor = $('#themePreset').closest('.preset-box');
        if (!anchor.length) return false;
        css();
        var box = $('<div id="lm-mythemes-box" class="preset-box"><span class="title-box"></span><div class="select-wrapper"><select id="lm-mythemes" class="form-control"></select></div>' +
            '<div class="lm-mt-btns"><button type="button" class="btn btn-success" data-mt="save"></button><button type="button" class="btn btn-info" data-mt="update"></button><button type="button" class="btn btn-danger" data-mt="del"></button></div></div>');
        box.insertAfter(anchor);
        /* picking applies and saves the theme itself: the Theme tab's own auto-save is not needed */
        $('#lm-mythemes').on('change', function (ev) { ev.stopPropagation(); pick(this.value); });
        box.on('click', '[data-mt]', function (ev) { ev.preventDefault(); act($(this).attr('data-mt')); });
        relabel();
        return true;
    }
    var tries = 0;
    function boot() {
        if (ready() && build()) {
            if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(function () { try { relabel(); } catch (e) { } });
            /* Export / Import, a settings profile or another tab can change the stored themes: the
             * list is read again when the Theme tab is shown */
            jq()(D).on('click.lmMyThemes', 'a[href="#theme"]', function () { setTimeout(render, 0); });
            return;
        }
        if (++tries < 240) setTimeout(boot, 500);
    }
    setTimeout(boot, 0);

    /* for scripts and the tests */
    api.list = function () { return loadStore().themes.map(function (e) { return { id: e.id, name: e.name, versions: e.history.length }; }); };
    api.apply = function (id) { pick(id); };
    api.refresh = render;
})();
