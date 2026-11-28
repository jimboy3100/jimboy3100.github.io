/* Legend Mod theme workshop.
 * My themes (save the current theme, rename, copy, delete, the last 5 saved versions of each),
 * live preview (Keep / Revert, back by itself after 15 s), comparison of any two themes and a gallery
 * of themes shipped in the repo (ogario/themes/catalogue.json). No import / export tab of its own
 * (it confused players next to Settings > Export / Import, which also carries the theme);
 * importText stays for the tests. Opened from its button in the Theme tab (no hotkey) or the
 * Command Centre. Nothing runs until the window is opened.
 *
 * A theme package is data only:
 *   { format: "lm-theme", version: 1, name, author, description, created,
 *     theme: { theme settings }, sounds: { messageSound, commandSound, virusSoundurl },
 *     cursor: url, background: url, hudLayout: "name" }
 * Every value is checked against the shipped theme schema (LM_THEME_SCHEMA, lmThemeValue: ranges,
 * steps, preset / font names, colour format); other strings must be an https URL. Unknown keys
 * are dropped, sizes are capped. URLs are shown to the player before a theme that uses them is
 * applied.
 * A theme stands for the whole look: settings it leaves out get their shipped defaults, except
 * the cursor, the background and the sounds, which stay as they are.
 */
(function () {
    'use strict';
    if (window._lmThemeWorkshopLoaded) return;
    window._lmThemeWorkshopLoaded = true;

    var W = window;
    var KEY_STORE = 'lmThemeWorkshop';
    var FORMAT = 'lm-theme', VERSION = 1;
    var MAX_THEMES = 30, MAX_HISTORY = 5;
    /* characters of JSON: the themes never fill the storage the settings themselves need */
    var MAX_STORE_CHARS = 400000;
    var MAX_PACKAGE_CHARS = 64 * 1024;
    var MAX_INPUT_KEYS = 600;
    var MAX_CATALOGUE_CHARS = 256 * 1024, MAX_CATALOGUE_THEMES = 50;
    var PREVIEW_MS = 15000;
    var NAME_MAX = 40, AUTHOR_MAX = 40, DESC_MAX = 200, LAYOUT_MAX = 40, URL_MAX = 400;
    var CATALOGUE_URL = 'https://www.legendmod.ml/ogario/themes/catalogue.json';

    var own = Object.prototype.hasOwnProperty;
    function has(o, k) { return !!o && own.call(o, k); }
    function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
    function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
    function same(a, b) { return a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-9); }
    /* JSON with sorted keys, to compare two themes */
    function stable(v) {
        if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
        if (isObj(v)) return '{' + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ':' + stable(v[k]); }).join(',') + '}';
        return JSON.stringify(v);
    }

    /* ── Texts: the shared language packs (developers/i18n/src) ── */
    var P = 'modules.themeworkshop.';
    /* tx('key', a, b): the text in the chosen language with {0} = a, {1} = b */
    function tx(key) {
        var vars = Array.prototype.slice.call(arguments, 1);
        return typeof W.lmT === 'function' ? W.lmT(P + key, vars) : key;
    }
    function lang() { return W.LMi18n && typeof W.LMi18n.lang === 'function' ? W.LMi18n.lang() : ''; }
    function dir() { return W.LMi18n && typeof W.LMi18n.dir === 'function' ? W.LMi18n.dir() : 'ltr'; }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }

    /* ── Validation ── */
    var COLOR_DEFAULT = /^(#|rgba?\()/i;
    var COLOR_VALUE = /^(#[0-9a-f]{3,8}|rgba?\([0-9.,%\s]+\)|[a-z]+)$/i;
    /* https only; no quotes, brackets, spaces or backslashes (the URLs end up in CSS url(...)
     * and src attributes), no user:password@ part */
    var URL_RE = /^https:\/\/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+(?::\d{1,5})?(?:[\/?#][A-Za-z0-9\-._~%!$&*+,;=:@\/?#]*)?$/i;
    /* not part of a theme: a one-time flag, the marker LMexpress reads, the commander images */
    function excluded(k) { return k === 'checkonetimeLc2' || k === 'lbTeammateColor' || /^commanderImage/.test(k); }
    var URL_KEYS = { menuBg: 1, customBackground: 1, customCursor: 1 };
    /* kept as they are when a theme leaves them out (optional parts of a package) */
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
    function cleanLayout(v) {
        var s = cleanText(v, LAYOUT_MAX);
        return s && /^[A-Za-z0-9 _.\-]+$/.test(s) ? s : undefined;
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
    /* { k: v } of the usable theme values; dropped keys go to info.dropped; null when too many keys */
    function cleanThemeMap(o, info) {
        info = info || { dropped: [] };
        if (!isObj(o)) return {};
        var keys = Object.keys(o);
        if (keys.length > MAX_INPUT_KEYS) { info.tooMany = true; return null; }
        var out = {};
        keys.forEach(function (k) {
            var v = themeValue(k, o[k]);
            if (v === undefined) info.dropped.push(k);
            else out[k] = v;
        });
        return out;
    }
    function cleanSounds(o, info) {
        if (!isObj(o)) return null;
        var out = {}, n = 0;
        Object.keys(o).slice(0, MAX_INPUT_KEYS).forEach(function (k) {
            var v = soundValue(k, o[k]);
            if (v === undefined) { if (info) info.dropped.push('sounds.' + k); return; }
            out[k] = v; n++;
        });
        return n ? out : null;
    }
    function toTime(v, fallback) {
        var t = typeof v === 'number' ? v : (typeof v === 'string' && v.length < 40 ? Date.parse(v) : NaN);
        var lo = Date.UTC(2015, 0, 1), hi = Date.now() + 86400000;
        return isFinite(t) && t >= lo && t <= hi ? Math.floor(t) : fallback;
    }
    /* the theme part of a stored theme: { theme, sounds?, hudLayout? }, or null */
    function cleanBody(b, info) {
        if (!isObj(b)) return null;
        var theme = cleanThemeMap(b.theme, info);
        if (!theme || !Object.keys(theme).length) return null;
        var out = { theme: theme };
        var s = cleanSounds(b.sounds, info);
        if (s) out.sounds = s;
        var l = b.hudLayout != null ? cleanLayout(b.hudLayout) : undefined;
        if (l) out.hudLayout = l;
        return out;
    }
    var TOP_KEYS = { format: 1, version: 1, name: 1, author: 1, description: 1, created: 1, theme: 1, sounds: 1, cursor: 1, background: 1, hudLayout: 1 };
    /* Checks a package (text or parsed). { ok: true, pkg: { name, author, description, created,
     * body }, dropped: [keys], urls: [{ key, url }] } or { ok: false, error: code }. */
    function parsePackage(input) {
        var raw = input;
        if (typeof input === 'string') {
            if (input.length > MAX_PACKAGE_CHARS) return { ok: false, error: 'tooBig' };
            try { raw = JSON.parse(input); } catch (e) { return { ok: false, error: 'notJson' }; }
        }
        if (!isObj(raw) || raw.format !== FORMAT) return { ok: false, error: 'notTheme' };
        if (raw.version !== VERSION) return { ok: false, error: typeof raw.version === 'number' && raw.version > VERSION ? 'newer' : 'notTheme' };
        var info = { dropped: [] };
        Object.keys(raw).forEach(function (k) { if (!own.call(TOP_KEYS, k)) info.dropped.push(k); });
        if (info.dropped.length > MAX_INPUT_KEYS) return { ok: false, error: 'tooBig' };
        var theme = cleanThemeMap(raw.theme, info);
        if (!theme) return { ok: false, error: 'tooBig' };
        /* the optional cursor / background of the package are its theme's cursor / background */
        [['cursor', 'customCursor'], ['background', 'customBackground']].forEach(function (p) {
            if (!own.call(raw, p[0])) return;
            var u = cleanUrl(raw[p[0]]);
            if (u === undefined) info.dropped.push(p[0]);
            else theme[p[1]] = u;
        });
        if (!Object.keys(theme).length) return { ok: false, error: 'empty' };
        var body = { theme: theme };
        if (own.call(raw, 'sounds')) {
            var s = cleanSounds(raw.sounds, info);
            if (s) body.sounds = s;
            else if (!isObj(raw.sounds)) info.dropped.push('sounds');
        }
        if (own.call(raw, 'hudLayout')) {
            var l = cleanLayout(raw.hudLayout);
            if (l) body.hudLayout = l;
            else info.dropped.push('hudLayout');
        }
        var pkg = {
            name: cleanText(raw.name, NAME_MAX) || tx('defaultName'),
            author: cleanText(raw.author, AUTHOR_MAX),
            description: cleanText(raw.description, DESC_MAX),
            created: toTime(raw.created, Date.now()),
            body: body
        };
        return { ok: true, pkg: pkg, dropped: info.dropped, urls: bodyUrls(body) };
    }
    /* the URLs a theme sets itself (not the defaults it falls back to) */
    function bodyUrls(body) {
        var out = [];
        if (!body) return out;
        Object.keys(URL_KEYS).forEach(function (k) {
            if (has(body.theme, k) && body.theme[k]) out.push({ key: k, url: body.theme[k] });
        });
        SOUND_KEYS.forEach(function (k) {
            if (has(body.sounds, k) && body.sounds[k]) out.push({ key: k, url: body.sounds[k] });
        });
        return out;
    }
    function hostOf(url) { var m = /^https:\/\/([^\/?#:]+)/i.exec(url || ''); return m ? m[1].toLowerCase() : ''; }
    /* the package of a theme, for a file */
    function toPackage(entry) {
        var b = entry.body || {}, theme = {};
        Object.keys(b.theme || {}).forEach(function (k) { if (k !== 'customCursor' && k !== 'customBackground') theme[k] = b.theme[k]; });
        // i18n-ok: file data (the exported package), not shown text
        var out = { format: FORMAT, version: VERSION, name: entry.name || 'Theme', author: entry.author || '', description: entry.description || '' };
        try { out.created = new Date(entry.created || Date.now()).toISOString(); } catch (e) { out.created = new Date().toISOString(); }
        out.theme = theme;
        if (b.theme && has(b.theme, 'customCursor')) out.cursor = b.theme.customCursor;
        if (b.theme && has(b.theme, 'customBackground')) out.background = b.theme.customBackground;
        if (b.sounds) out.sounds = clone(b.sounds);
        if (b.hudLayout) out.hudLayout = b.hudLayout;
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

    /* ── Comparison ── */
    function humanize(k) {
        var s = String(k).replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/_/g, ' ').toLowerCase();
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
    function label(key) {
        if (key === 'hudLayout') return tx('hudLayout');
        var tl = W.textLanguage || {};
        var l = typeof tl[key] === 'string' ? stripTags(tl[key]) : '';
        return l || humanize(key);
    }
    /* differences between two bodies, as applied over `current`:
     * [{ key, part: 'theme' | 'sound' | 'layout', label, a, b }] sorted by label */
    function diffBodies(a, b, current, labelFn) {
        labelFn = typeof labelFn === 'function' ? labelFn : label;
        var ea = effectiveTheme(a, current), eb = effectiveTheme(b, current), rows = [];
        Object.keys(ea).forEach(function (k) {
            if (!same(ea[k], eb[k])) rows.push({ key: k, part: 'theme', label: labelFn(k), a: ea[k], b: eb[k] });
        });
        Object.keys(eb).forEach(function (k) {
            if (!own.call(ea, k)) rows.push({ key: k, part: 'theme', label: labelFn(k), a: undefined, b: eb[k] });
        });
        var sa = (a && a.sounds) || {}, sb = (b && b.sounds) || {};
        SOUND_KEYS.forEach(function (k) {
            if ((has(sa, k) || has(sb, k)) && sa[k] !== sb[k]) rows.push({ key: k, part: 'sound', label: labelFn(k), a: sa[k], b: sb[k] });
        });
        var la = (a && a.hudLayout) || '', lb = (b && b.hudLayout) || '';
        if (la !== lb) rows.push({ key: 'hudLayout', part: 'layout', label: labelFn('hudLayout'), a: la || undefined, b: lb || undefined });
        rows.sort(function (x, y) { return String(x.label).localeCompare(String(y.label)); });
        return rows;
    }

    /* ── Version history ── */
    /* the theme gets a new body; the one it had goes to the front of its history (last 5) */
    function pushHistory(entry, body, t) {
        if (!entry || !body || sameBody(entry.body, body)) return false;
        entry.history = [{ t: entry.updated || entry.created || t, body: entry.body }].concat(entry.history || []).slice(0, MAX_HISTORY);
        entry.body = body;
        entry.updated = t;
        return true;
    }
    /* version i of the history becomes the theme; the replaced body goes into the history */
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
    function cleanEntry(e) {
        if (!isObj(e) || typeof e.id !== 'string' || !ID_RE.test(e.id)) return null;
        var body = cleanBody(e.body);
        if (!body) return null;
        var now = Date.now();
        var out = {
            id: e.id,
            name: cleanText(e.name, NAME_MAX) || tx('defaultName'),
            author: cleanText(e.author, AUTHOR_MAX),
            description: cleanText(e.description, DESC_MAX),
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
    /* Drops the oldest history versions until the store fits in max characters. */
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
    function readText(key) { try { var s = store(); return s ? s.getItem(key) : null; } catch (e) { return null; } }
    function writeText(key, text) {
        try { var s = store(); if (!s) return false; if (text === null) s.removeItem(key); else s.setItem(key, text); return true; } catch (e) { return false; }
    }
    function loadStore() {
        var t = readText(KEY_STORE), raw = null;
        if (t && t.length <= MAX_STORE_CHARS * 2) { try { raw = JSON.parse(t); } catch (e) { raw = null; } }
        return cleanStore(raw);
    }
    /* '' when saved, else the message key of the reason (nothing is changed then) */
    function saveStore(st) {
        if (!fitStore(st)) return 'tooBigStore';
        return writeText(KEY_STORE, JSON.stringify(st)) ? '' : 'storageFull';
    }
    function newId() { return 't' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
    function uniqueName(name, list) {
        var n = name, i = 2;
        var taken = function (x) { return list.some(function (e) { return e.name === x; }); };
        while (taken(n) && i < 100) n = Array.from(name).slice(0, NAME_MAX - 4).join('') + ' ' + (i++);
        return n;
    }

    /* ── Placement: the largest part of the screen that covers none of the given rectangles ── */
    function fitRect(view, avoid, gap, minW, minH) {
        gap = gap == null ? 6 : gap;
        minW = minW || 0; minH = minH || 0;
        var R = { left: 8, top: 8, right: view.w - 8, bottom: view.h - 8 }, overlap = false;
        (avoid || []).forEach(function (a) {
            if (!a) return;
            var A = { left: a.left - gap, top: a.top - gap, right: a.right + gap, bottom: a.bottom + gap };
            if (A.right <= R.left || A.left >= R.right || A.bottom <= R.top || A.top >= R.bottom) return;
            var c = [
                { left: R.left, top: A.bottom, right: R.right, bottom: R.bottom },
                { left: R.left, top: R.top, right: R.right, bottom: A.top },
                { left: A.right, top: R.top, right: R.right, bottom: R.bottom },
                { left: R.left, top: R.top, right: A.left, bottom: R.bottom }
            ].filter(function (r) { return r.right - r.left >= minW && r.bottom - r.top >= minH; });
            if (!c.length) { overlap = true; return; }
            c.sort(function (x, y) { return (y.right - y.left) * (y.bottom - y.top) - (x.right - x.left) * (x.bottom - x.top); });
            R = c[0];
        });
        return { left: R.left, top: R.top, width: Math.max(0, R.right - R.left), height: Math.max(0, R.bottom - R.top), overlap: overlap };
    }

    /* ── Gallery ── */
    function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'theme'; }
    /* the catalogue's themes, each checked like an imported package */
    function cleanCatalogue(raw) {
        if (!isObj(raw) || raw.format !== 'lm-theme-catalogue' || !Array.isArray(raw.themes)) return null;
        var out = [], ids = {};
        raw.themes.slice(0, MAX_CATALOGUE_THEMES).forEach(function (t) {
            var r = parsePackage(t);
            if (!r.ok) return;
            var gid = slug(r.pkg.name), n = 2;
            while (own.call(ids, gid)) gid = slug(r.pkg.name) + '-' + (n++);
            ids[gid] = true;
            out.push({ gid: gid, pkg: r.pkg, urls: r.urls });
        });
        return out;
    }

    /* ═══ Built-in presets ═══
     * The shipped game presets (themePresets) and menu presets (themeMenus); this window is the one
     * place for them (the Theme tab's Theme preset and Menu theme lists are gone). A preset only
     * names some settings and is put over the current theme, so everything it does not name stays
     * as it is, as the lists did. Values go through the same checks as an imported theme. */
    var BUILTIN_SETS = [['game', 'themePresets'], ['menu', 'themeMenus']];
    function builtins() {
        var out = [];
        BUILTIN_SETS.forEach(function (set) {
            var src = W[set[1]];
            if (!isObj(src)) return;
            Object.keys(src).forEach(function (key) {
                if (!isObj(src[key]) || !/^[a-z0-9]+$/i.test(key)) return;
                out.push({ bid: set[0] + '-' + key.toLowerCase(), kind: set[0], key: key, name: cleanText(src[key].name, NAME_MAX) || key });
            });
        });
        return out;
    }
    /* the checked values one preset sets */
    function presetMap(b) {
        var set = BUILTIN_SETS.filter(function (x) { return x[0] === b.kind; })[0];
        var src = set && W[set[1]], p = isObj(src) && own.call(src, b.key) ? src[b.key] : null;
        if (!isObj(p)) return null;
        var defs = schema() || {}, raw = {};
        Object.keys(p).forEach(function (k) { if (k !== 'name' && own.call(defs, k)) raw[k] = p[k]; });
        return cleanThemeMap(raw) || null;
    }
    /* the preset over a theme body (shown in the gallery and in Compare) */
    function builtinBody(b, base) {
        var m = presetMap(b);
        if (!m || !base) return null;
        var body = clone(base);
        body.theme = Object.assign({}, body.theme || {}, m);
        return body;
    }

    var core = {
        builtins: builtins, presetMap: presetMap, builtinBody: builtinBody,
        parsePackage: parsePackage, themeValue: themeValue, soundValue: soundValue, cleanUrl: cleanUrl, cleanText: cleanText,
        cleanBody: cleanBody, cleanStore: cleanStore, fitStore: fitStore, toPackage: toPackage, sparseTheme: sparseTheme,
        effectiveTheme: effectiveTheme, diffBodies: diffBodies, pushHistory: pushHistory, restoreVersion: restoreVersion,
        bodyUrls: bodyUrls, fitRect: fitRect, cleanCatalogue: cleanCatalogue, saveStore: saveStore, loadStore: loadStore,
        KEY_STORE: KEY_STORE, MAX_HISTORY: MAX_HISTORY, MAX_THEMES: MAX_THEMES, MAX_PACKAGE_CHARS: MAX_PACKAGE_CHARS, MAX_STORE_CHARS: MAX_STORE_CHARS
    };
    var api = W.LMThemeWorkshop = { core: core };

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
        var theme = sparseTheme(cleanThemeMap(Object.assign({}, T())) || {});
        var body = { theme: theme };
        var s = S(), sd = W.LM_SETTINGS_DEFAULTS || {}, snd = {}, n = 0;
        if (s) SOUND_KEYS.forEach(function (k) {
            var v = soundValue(k, s[k]);
            if (v !== undefined && v !== sd[k]) { snd[k] = v; n++; }
        });
        if (n) body.sounds = snd;
        return body;
    }
    /* the current theme with one preset put over it: only the keys the preset names change */
    function builtinTarget(b) {
        var m = presetMap(b), d = T();
        if (!m || !d) return null;
        var t = Object.assign(Object.assign({}, d), m);
        /* lbTeammateColor is no theme value (a marker LMexpress passes on), but the old lists set
         * it with the preset: applied the same way here */
        var set = BUILTIN_SETS.filter(function (x) { return x[0] === b.kind; })[0], p = W[set[1]][b.key];
        if (own.call(p, 'lbTeammateColor') && has(d, 'lbTeammateColor')) {
            var lv = W.lmThemeValue('lbTeammateColor', p.lbTeammateColor);
            if (lv !== undefined) t.lbTeammateColor = lv;
        }
        return t;
    }
    function findBuiltin(bid) { return builtins().filter(function (x) { return x.bid === bid; })[0] || null; }
    /* a preset applied and saved at once, as the old lists did */
    function applyBuiltin(b) {
        var target = b && builtinTarget(b), St = W.Settings;
        if (!ready() || !target) return false;
        if (preview) endPreview(false, true);
        setValues(target, false);
        var ok = true;
        try { St.saveThemeSettings(); } catch (e) { ok = false; }
        toast(ok ? 'success' : 'warning', esc(ok ? tx('kept', b.name) : tx('saveFailed')));
        return true;
    }
    /* one theme value through its control (colour picker, slider, text box, list) */
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
        /* the change moves the slider's knob (rangeslider) to the value: with val() alone the knob
         * stayed where it was (the Theme tab's auto-save skips it, St._lmThemeQuiet) */
        if (sl.length && sl.closest('#theme').length) { sl.val(v).trigger('change'); $('#' + k + '-value').text(v); }
        var box = $('#theme input[type=text]#' + k + ', #theme select#' + k);
        if (box.length) box.val(v);
        if (k === 'customCursor') {
            $('#theme-images .cursor-box a').removeClass('active').filter(function () { return $('img', this).attr('src') === v; }).addClass('active');
        }
    }
    /* Sets a full theme map live; with exact the values are put back once more after the setters
     * (the font setters derive their family / weight values). Returns the changed keys. */
    function setValues(target, exact) {
        var d = T(), St = W.Settings, changed = [];
        Object.keys(target).forEach(function (k) { if (has(d, k) && !same(d[k], target[k])) changed.push(k); });
        if (!changed.length) return changed;
        /* the colour pickers set here fire the Theme tab's change events: they are not the
         * player's input, so they start no auto-save (a preview and its Revert never save) */
        var quiet = St._lmThemeQuiet;
        St._lmThemeQuiet = true;
        try { setValuesNow(target, exact, d, St, changed); } finally { St._lmThemeQuiet = quiet; }
        return changed;
    }
    function setValuesNow(target, exact, d, St, changed) {
        changed.forEach(function (k) { try { setThemeOpt(k, target[k]); } catch (e) { d[k] = target[k]; } });
        var put = function (keys) {
            keys.forEach(function (k) {
                if (!has(d, k) || same(d[k], target[k])) return;
                d[k] = target[k];
                if (W.ogario && has(W.ogario, k)) W.ogario[k] = target[k];
            });
        };
        put(changed);
        try { if (St.setTheme) St.setTheme(); } catch (e) { }
        ['setFoodColor', 'setIndicatorColor'].forEach(function (f) { try { if (typeof St[f] === 'function') St[f](); } catch (e) { } });
        if (exact) put(Object.keys(target));
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
        return changed;
    }
    function saveSounds() {
        var app = W.application;
        try { if (app && app.saveSettings) app.saveSettings(S(), 'ogarioSettings'); } catch (e) { }
    }

    /* ═══ Preview ═══ */
    var preview = null;
    function previewing() { return !!preview; }
    function snapshot() {
        var s = S(), snd = {};
        if (s) SOUND_KEYS.forEach(function (k) { snd[k] = s[k]; });
        return { t: Object.assign({}, T()), s: snd, stored: readText('ogarioThemeSettings') };
    }
    /* Shows a body for ms (default 15 s); Keep saves it, Revert or the timer put the theme back. */
    function startPreview(body, name, ms, target) {
        if (!ready() || !body) return false;
        if (preview) endPreview(false, true);
        guardSave();
        var St = W.Settings;
        /* a Theme tab change the player made just before is saved now: the preview's own control
         * changes do not save, so its pending auto-save would otherwise be lost */
        if (typeof St.lmFlushThemeSave === 'function') { try { St.lmFlushThemeSave(); } catch (e) { } }
        var snap = snapshot();
        preview = { snap: snap, name: name || '', deadline: 0, timer: null, sounds: [] };
        setValues(target || effectiveTheme(body, T()), false);
        preview.sounds = setSounds(body.sounds);
        /* the time runs from when the preview is shown: applying a whole theme can take longer than
         * a short preview (a slow device), which then ended before it was ever seen */
        preview.deadline = Date.now() + (ms > 0 ? ms : PREVIEW_MS);
        /* what the preview set: a value that differs from it later is a newer change (it is kept) */
        preview.applied = Object.assign({}, T());
        preview.appliedS = snapshot().s;
        preview.timer = setInterval(tick, 250);
        showFrame(false);
        renderBar();
        return true;
    }
    function tick() {
        if (!preview) return;
        if (Date.now() >= preview.deadline) { endPreview(false, false, true); return; }
        var el = D.querySelector('#lm-tw-pv .lm-tw-pv-left');
        if (el) el.textContent = tx('revertsIn', Math.max(0, Math.ceil((preview.deadline - Date.now()) / 1000)));
    }
    /* the theme changed after the preview set it (the player, the settings import, another tool) */
    function changedSince(p) {
        var d = T();
        for (var k in p.applied) if (own.call(p.applied, k) && !same(d[k], p.applied[k])) return true;
        return false;
    }
    /* Keep: save the previewed theme. Otherwise put the snapshot back exactly, except values that
     * changed after the preview set them: those are newer than the preview and stay. Nothing
     * stored is written back either: the preview never saves, so a changed stored theme is newer. */
    function endPreview(keep, quiet, auto, newer) {
        var p = preview;
        if (!p) return;
        preview = null;
        clearInterval(p.timer);
        var bar = D.getElementById('lm-tw-pv');
        if (bar) bar.parentNode.removeChild(bar);
        /* the bar's resize listener; the window keeps its own while it is open */
        if (!frame()) W.removeEventListener('resize', onResize);
        var St = W.Settings;
        if (keep) {
            var ok = true;
            try { St.saveThemeSettings(); } catch (e) { ok = false; }
            if (p.sounds.length) saveSounds();
            if (!quiet) toast(ok ? 'success' : 'warning', esc(ok ? tx('kept', p.name) : tx('saveFailed')));
        } else {
            var d = T(), back = {}, s = S(), sback = {}, k;
            for (k in p.snap.t) if (own.call(p.snap.t, k) && (!has(p.applied, k) || same(d[k], p.applied[k]))) back[k] = p.snap.t[k];
            setValues(back, true);
            if (p.sounds.length && s) {
                p.sounds.forEach(function (sk) { if (s[sk] === p.appliedS[sk]) sback[sk] = p.snap.s[sk]; });
                if (setSounds(sback).length) saveSounds();
            }
            if (!quiet) toast('info', esc(tx(newer ? 'revertedNewer' : auto ? 'revertedAuto' : 'reverted')));
        }
        if (!quiet) showFrame(true);
    }
    /* the theme is not saved while it is previewed (the Theme tab saves on every control change) */
    var guarded = false;
    function guardSave() {
        var St = W.Settings, orig = St && St.saveThemeSettings;
        if (guarded || typeof orig !== 'function') return;
        guarded = true;
        var w = function () {
            if (preview) {
                /* the preview's own values (the Theme tab saves 600 ms after the preview set its
                 * controls): not saved */
                if (!changedSince(preview)) return;
                /* a newer change during the preview (the player, the settings import): the preview ends
                 * first, so its timer can never roll this change back, then the save goes through */
                endPreview(false, false, false, true);
            }
            return orig.apply(this, arguments);
        };
        St.saveThemeSettings = w;
    }

    /* ═══ Window ═══ */
    var TABS = { mine: 'tabMine', gallery: 'tabGallery', compare: 'tabCompare' };
    var tab = 'mine', openHist = {}, pending = null, gallery = null, galleryState = '', cmpA = 'cur', cmpB = '';
    function frame() { return D.getElementById('lm-tw'); }
    function isOpen() { return !!frame(); }
    function css() {
        /* the shared window look (LMexpress.js) */
        if (typeof W.lmUiKit === 'function') W.lmUiKit();
        if (D.getElementById('lm-tw-style')) return;
        var st = D.createElement('style');
        st.id = 'lm-tw-style';
        st.textContent =
            '#lm-tw{position:fixed;z-index:999990;display:flex;align-items:center;justify-content:center;pointer-events:none;font-family:inherit}' +
            '#lm-tw .lm-tw-win{pointer-events:auto;background:var(--lm-w-bg,var(--lm-pc,#1b1f2a));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,transparent);border-top:3px solid var(--lm-mc,transparent);border-radius:var(--lm-radius,6px);width:760px;max-width:100%;max-height:100%;display:flex;flex-direction:column;font-size:var(--lm-w-fs,12px);box-shadow:0 8px 32px rgba(0,0,0,.5);overflow:hidden}' +
            '#lm-tw .lm-tw-head{display:flex;align-items:center;justify-content:space-between;padding:var(--lm-w-hpad,2px 4px 2px 12px);border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.1));background:var(--lm-w-head,linear-gradient(180deg,var(--lm-pc2,transparent) 0%,var(--lm-pc,transparent) 100%))}' +
            '#lm-tw .lm-tw-head b{font-size:var(--lm-w-title,14px);color:var(--lm-mc,inherit);text-transform:uppercase;letter-spacing:1px}' +
            '#lm-tw .lm-tw-x{background:var(--lm-w-btn,rgba(255,255,255,.05));border:0;border-radius:var(--lm-radius-s,4px);color:var(--lm-tc2,#bbb);font-size:18px;line-height:1;min-width:var(--lm-w-x,44px);min-height:var(--lm-w-x,36px);cursor:pointer}' +
            '#lm-tw .lm-tw-tabs{display:flex;gap:2px;padding:4px 8px 0;flex-wrap:wrap}' +
            '#lm-tw .lm-tw-tabs button{background:var(--lm-w-btn,rgba(255,255,255,.06));border:1px solid var(--lm-pc2,rgba(255,255,255,.12));border-bottom:0;color:var(--lm-tc2,#ccc);font-family:inherit;padding:4px 10px;border-radius:var(--lm-radius-s,4px) var(--lm-radius-s,4px) 0 0;min-height:var(--lm-w-ctl,30px);font-size:var(--lm-w-fs,12px);cursor:pointer}' +
            '#lm-tw .lm-tw-tabs button.active{background:var(--lm-pc2,rgba(255,255,255,.16));color:var(--lm-w-acc,var(--lm-mc,#fff))}' +
            '#lm-tw .lm-tw-body{overflow:auto;-webkit-overflow-scrolling:touch;padding:var(--lm-w-pad,8px 10px 10px);flex:1;min-height:0;touch-action:pan-y;overscroll-behavior:contain;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.12))}' +
            '#lm-tw .lm-tw-row{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:6px}' +
            '#lm-tw .lm-tw-btn,#lm-tw-pv .lm-tw-btn{background:var(--lm-w-btn,rgba(255,255,255,.05));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(127,127,127,.45));border-radius:var(--lm-radius-s,4px);padding:3px 8px;min-height:var(--lm-w-ctl,28px);font-size:var(--lm-w-fs,12px);font-family:inherit;cursor:pointer}' +
            '#lm-tw .lm-tw-btn:hover,#lm-tw-pv .lm-tw-btn:hover{background:var(--lm-w-btn-h,rgba(255,255,255,.14))}' +
            '#lm-tw .lm-tw-go,#lm-tw-pv .lm-tw-go{border-color:#3c9e5a;background:rgba(60,158,90,.35)}' +
            '#lm-tw .lm-tw-warn{border-color:#c0504d}' +
            '#lm-tw input[type=text],#lm-tw select,#lm-tw textarea{background:var(--lm-w-field,var(--lm-pc2,#11141c));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(255,255,255,.2));border-radius:var(--lm-radius-s,3px);padding:3px 6px;min-height:var(--lm-w-ctl,28px);font-size:var(--lm-w-fs,12px);max-width:100%}' +
            '#lm-tw textarea{width:100%;height:90px;font-family:monospace;resize:vertical}' +
            '#lm-tw .lm-tw-note{opacity:.7;font-size:var(--lm-w-fs-s,11px);margin:2px 0 6px}' +
            '#lm-tw .lm-tw-item{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 0;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.08))}' +
            '#lm-tw .lm-tw-name{min-width:140px;flex:1;word-break:break-word}' +
            '#lm-tw .lm-tw-name small{opacity:.65;margin-left:4px}' +
            '#lm-tw .lm-tw-desc{opacity:.75;font-size:var(--lm-w-fs-s,11px)}' +
            '#lm-tw .lm-tw-acts{display:flex;flex-wrap:wrap;gap:3px}' +
            '#lm-tw .lm-tw-hist{flex-basis:100%;padding:2px 0 2px 104px}' +
            '#lm-tw .lm-tw-hist div{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:2px 0}' +
            '#lm-tw .lm-tw-prev{position:relative;flex:0 0 96px;width:96px;height:48px;border-radius:var(--lm-radius-s,4px);border:2px solid;overflow:hidden}' +
            '#lm-tw .lm-tw-prev span{position:absolute;border-radius:50%}' +
            '#lm-tw .lm-tw-prev .c{left:8px;top:9px;width:26px;height:26px;font:700 9px Ubuntu,Arial,sans-serif;line-height:26px;text-align:center}' +
            '#lm-tw .lm-tw-prev .f{width:6px;height:6px}' +
            '#lm-tw .lm-tw-prev .v{left:44px;top:20px;width:18px;height:18px;border:2px solid}' +
            '#lm-tw .lm-tw-prev .m{right:4px;top:6px;width:22px;height:32px;border-radius:2px;border-bottom:4px solid}' +
            '#lm-tw .lm-tw-urls{border:1px solid #e6a23c;border-radius:var(--lm-radius-s,4px);padding:6px 8px;margin-bottom:8px;background:rgba(230,162,60,.1)}' +
            '#lm-tw .lm-tw-urls code{word-break:break-all;color:#ffd58a;background:none}' +
            '#lm-tw table{width:100%;border-collapse:collapse}' +
            '#lm-tw td,#lm-tw th{padding:3px 4px;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.08));text-align:left;vertical-align:top;word-break:break-word}' +
            '#lm-tw th{opacity:.75;font-weight:600}' +
            '#lm-tw .lm-tw-chip{display:inline-block;width:12px;height:12px;border-radius:2px;border:1px solid rgba(255,255,255,.4);vertical-align:-2px;margin-right:4px}' +
            '#lm-tw h6{margin:8px 0 4px;font-size:12px;opacity:.85}' +
            '#lm-tw-pv{position:fixed;z-index:999996;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:6px 8px;background:var(--lm-pc,rgba(20,24,34,.94));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(255,255,255,.25));border-top:3px solid var(--lm-mc,rgba(255,255,255,.25));border-radius:var(--lm-radius,6px);font-family:inherit;font-size:12px;box-shadow:0 4px 18px rgba(0,0,0,.5)}' +
            '#lm-tw-pv .lm-tw-pv-name{font-weight:600;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
            '#lm-tw-pv .lm-tw-pv-left{opacity:.75}' +
            '@media (pointer:coarse){#lm-tw .lm-tw-btn,#lm-tw-pv .lm-tw-btn{min-height:36px;padding:3px 10px}#lm-tw .lm-tw-tabs button{min-height:36px}}' +
            '@media (max-width:600px){#lm-tw .lm-tw-hist{padding-left:0}}';
        D.head.appendChild(st);
    }
    function viewSize() { return { w: W.innerWidth || D.documentElement.clientWidth, h: W.innerHeight || D.documentElement.clientHeight }; }
    function place() {
        var f = frame();
        if (!f) return;
        var r = fitRect(viewSize(), [], 6, 300, 220);
        f.style.left = r.left + 'px';
        f.style.top = r.top + 'px';
        f.style.width = r.width + 'px';
        f.style.height = r.height + 'px';
    }
    function placeBar() {
        var b = D.getElementById('lm-tw-pv');
        if (!b) return;
        var r = fitRect(viewSize(), [], 6, 240, 60);
        b.style.maxWidth = r.width + 'px';
        var w = b.offsetWidth, h = b.offsetHeight;
        b.style.left = Math.round(r.left + Math.max(0, (r.width - w) / 2)) + 'px';
        b.style.top = Math.round(r.top + Math.max(0, r.height - h - 40)) + 'px';
    }
    function onResize() { place(); placeBar(); }
    /* touches, clicks, wheel and keys in the window do not reach the game */
    function shield(el) {
        ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'wheel', 'keydown', 'keyup', 'contextmenu'].forEach(function (n) {
            el.addEventListener(n, function (e) { e.stopPropagation(); }, false);
        });
    }
    function open() {
        if (!ready()) { toast('info', esc(tx('loadingMod'))); return; }
        if (preview) return;
        if (isOpen()) { showFrame(true); render(); return; }
        css();
        var $ = jq();
        var f = $('<div id="lm-tw"></div>');
        var win = $('<div class="lm-tw-win lm-w lm-modal-container" role="dialog" aria-modal="false"></div>').attr('aria-label', tx('title')).attr('dir', dir()).appendTo(f);
        var head = $('<div class="lm-tw-head"></div>').appendTo(win);
        $('<b></b>').text(tx('title')).appendTo(head);
        $('<button type="button" class="lm-tw-x">&times;</button>').attr('aria-label', tx('close')).attr('title', tx('close')).appendTo(head);
        var tabs = $('<div class="lm-tw-tabs"></div>').appendTo(win);
        Object.keys(TABS).forEach(function (t) {
            $('<button type="button"></button>').attr('data-tab', t).text(tx(TABS[t])).appendTo(tabs);
        });
        $('<div class="lm-tw-body"></div>').appendTo(win);
        win.on('click', '.lm-tw-x', function (e) { e.preventDefault(); close(); });
        tabs.on('click', 'button', function () { tab = $(this).attr('data-tab'); pending = null; render(); return false; });
        win.on('click', '[data-act]', function (e) {
            e.preventDefault();
            act($(this).attr('data-act'), $(this).attr('data-id'));
        }).on('change', 'select[data-field]', function () {
            var fld = $(this).attr('data-field');
            if (fld === 'cmpA') cmpA = this.value;
            else if (fld === 'cmpB') cmpB = this.value;
            if (fld === 'cmpA' || fld === 'cmpB') render();
        });
        /* Esc closes it wherever the focus is (onEsc) */
        f[0]._lmEsc = true;
        W.addEventListener('keydown', onEsc, true);
        shield(f[0]);
        $('body').append(f);
        place();
        W.addEventListener('resize', onResize);
        render();
    }
    /* Esc closes the window wherever the focus is, as Analytics and Custom macros do: it closed only with
     * the focus inside, so after a click on the game Esc opened the game menu instead. A window in front
     * that closes on Esc takes it first (winstack.js); hidden during a preview it stays. */
    function onEsc(e) {
        if (!(e.key === 'Escape' || e.keyCode === 27) || e.ctrlKey || e.altKey || e.metaKey) return;
        var f = frame();
        if (!f || f.style.display === 'none') return;
        if (W.LMWinStack && typeof W.LMWinStack.escFor === 'function' && !W.LMWinStack.escFor(f, e)) return;
        e.preventDefault();
        e.stopPropagation();
        close();
    }
    function close() {
        var f = frame();
        W.removeEventListener('keydown', onEsc, true);
        if (f) f.parentNode.removeChild(f);
        pending = null;
        if (!preview) W.removeEventListener('resize', onResize);
    }
    /* a language change: the open window (title, tabs, the open tab) and the preview bar again;
     * the Theme tab button has data-i18n (LMi18n.apply updates it) */
    function relabel() {
        var $ = jq();
        if (!$) return;
        var f = $('#lm-tw');
        if (f.length) {
            f.find('.lm-tw-win').attr('aria-label', tx('title')).attr('dir', dir());
            f.find('.lm-tw-head b').text(tx('title'));
            f.find('.lm-tw-x').attr('aria-label', tx('close')).attr('title', tx('close'));
            f.find('.lm-tw-tabs button').each(function () { $(this).text(tx(TABS[$(this).attr('data-tab')])); });
            render();
        }
        if (preview) renderBar();
    }
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(relabel);
    function toggle() { if (preview) return; if (isOpen()) close(); else open(); }
    function showFrame(on) {
        var f = frame();
        if (!f) return;
        f.style.display = on ? '' : 'none';
        if (on) { place(); render(); }
    }
    function renderBar() {
        var $ = jq();
        if (!preview) return;
        css();
        $('#lm-tw-pv').remove();
        var b = $('<div id="lm-tw-pv" role="status"></div>').attr('dir', dir());
        $('<span class="lm-tw-pv-name"></span>').text(tx('previewing', preview.name)).appendTo(b);
        $('<span class="lm-tw-pv-left"></span>').text(tx('revertsIn', Math.ceil(PREVIEW_MS / 1000))).appendTo(b);
        $('<button type="button" class="lm-tw-btn lm-tw-go" data-pv="keep"></button>').text(tx('keep')).appendTo(b);
        $('<button type="button" class="lm-tw-btn" data-pv="revert"></button>').text(tx('revert')).appendTo(b);
        b.on('click', '[data-pv]', function (e) {
            e.preventDefault();
            endPreview($(this).attr('data-pv') === 'keep');
        });
        shield(b[0]);
        $('body').append(b);
        W.addEventListener('resize', onResize);
        placeBar();
        tick();
    }
    function btn(text, a, id, cls) {
        var $ = jq();
        var b = $('<button type="button" class="lm-tw-btn"></button>').text(text).attr('data-act', a);
        if (id != null) b.attr('data-id', id);
        if (cls) b.addClass(cls);
        return b;
    }
    function when(t) {
        if (!t) return '';
        try { var c = lang(); return new Date(t).toLocaleString(c === 'zh' ? 'zh-TW' : c || undefined); } catch (e) { return String(t); }
    }
    /* a small picture of the theme: field, border, a cell with its name, food, a virus, a menu panel */
    function previewPic(body) {
        var $ = jq(), e = effectiveTheme(body, T());
        var p = $('<div class="lm-tw-prev" aria-hidden="true"></div>').css({ background: e.bgColor, borderColor: e.bordersColor });
        // i18n-ok: sample letters on the cell of the small theme picture (aria-hidden)
        $('<span class="c">Aa</span>').css({ background: e.mainColor, color: e.namesColor }).appendTo(p);
        [[38, 8], [70, 38], [30, 38]].forEach(function (xy) { $('<span class="f"></span>').css({ left: xy[0] + 'px', top: xy[1] + 'px', background: e.foodColor }).appendTo(p); });
        $('<span class="v"></span>').css({ background: e.virusColor, borderColor: e.virusStrokeColor }).appendTo(p);
        $('<span class="m"></span>').css({ background: e.menuPanelColor, borderBottomColor: e.menuMainColor }).appendTo(p);
        return p;
    }
    function render() {
        var $ = jq(), f = $('#lm-tw');
        if (!f.length) return;
        f.find('.lm-tw-tabs button').each(function () { $(this).toggleClass('active', $(this).attr('data-tab') === tab); });
        var body = f.find('.lm-tw-body').empty();
        if (pending) renderPending(body);
        if (tab === 'gallery') renderGallery(body);
        else if (tab === 'compare') renderCompare(body);
        else renderMine(body);
    }
    function renderPending(body) {
        var $ = jq();
        var box = $('<div class="lm-tw-urls"></div>').appendTo(body);
        $('<div></div>').text(tx('urlsTitle')).appendTo(box);
        var ul = $('<ul style="margin:4px 0 6px 16px;padding:0"></ul>').appendTo(box);
        pending.urls.forEach(function (u) {
            var li = $('<li></li>').appendTo(ul);
            $('<span></span>').text(label(u.key) + ': ').appendTo(li);
            $('<code></code>').text(u.url).appendTo(li);
        });
        var row = $('<div class="lm-tw-row"></div>').appendTo(box);
        btn(tx('go'), 'pv-go', null, 'lm-tw-go').appendTo(row);
        btn(tx('cancel'), 'pv-cancel').appendTo(row);
    }
    function renderMine(body) {
        var $ = jq(), list = loadStore().themes;
        var row = $('<div class="lm-tw-row"></div>').appendTo(body);
        $('<input type="text" id="lm-tw-name" maxlength="40">').attr('placeholder', tx('namePh')).appendTo(row);
        btn(tx('saveCurrent'), 'save', null, 'lm-tw-go').appendTo(row);
        $('<div class="lm-tw-note"></div>').text(tx('mineNote')).appendTo(body);
        if (!list.length) { $('<div class="lm-tw-note"></div>').text(tx('empty')).appendTo(body); return; }
        list.forEach(function (e) {
            var it = $('<div class="lm-tw-item"></div>').appendTo(body);
            previewPic(e.body).appendTo(it);
            var nm = $('<div class="lm-tw-name"></div>').appendTo(it);
            $('<span></span>').text(e.name).appendTo(nm);
            $('<small></small>').text((e.author ? tx('by', e.author) + ' \u00b7 ' : '') + when(e.updated)).appendTo(nm);
            if (e.description) $('<div class="lm-tw-desc"></div>').text(e.description).appendTo(nm);
            var acts = $('<div class="lm-tw-acts"></div>').appendTo(it);
            btn(tx('preview'), 'pv', e.id, 'lm-tw-go').appendTo(acts);
            btn(tx('update'), 'update', e.id).appendTo(acts);
            btn(tx('rename'), 'rename', e.id).appendTo(acts);
            btn(tx('duplicate'), 'dup', e.id).appendTo(acts);
            btn(tx('compare'), 'cmp', 'm:' + e.id).appendTo(acts);
            btn(tx('history', e.history.length), 'hist', e.id).appendTo(acts);
            btn(tx('del'), 'del', e.id, 'lm-tw-warn').appendTo(acts);
            if (openHist[e.id]) {
                var h = $('<div class="lm-tw-hist"></div>').appendTo(it);
                if (!e.history.length) $('<div class="lm-tw-note"></div>').text(tx('noHistory')).appendTo(h);
                e.history.forEach(function (v, i) {
                    var r = $('<div></div>').appendTo(h);
                    $('<span></span>').text(when(v.t)).appendTo(r);
                    btn(tx('preview'), 'hpv', e.id + ':' + i).appendTo(r);
                    btn(tx('compare'), 'cmp', 'h:' + e.id + ':' + i).appendTo(r);
                    btn(tx('restore'), 'hrestore', e.id + ':' + i).appendTo(r);
                });
            }
        });
    }
    function renderBuiltins(body) {
        var $ = jq(), list = builtins(), base = captureBody();
        if (!list.length) return;
        $('<h6></h6>').text(tx('builtinTitle')).appendTo(body);
        $('<div class="lm-tw-note"></div>').text(tx('builtinNote')).appendTo(body);
        list.forEach(function (b) {
            var bb = builtinBody(b, base);
            if (!bb) return;
            var it = $('<div class="lm-tw-item lm-tw-bitem"></div>').attr('data-bid', b.bid).appendTo(body);
            previewPic(bb).appendTo(it);
            var nm = $('<div class="lm-tw-name"></div>').appendTo(it);
            $('<span></span>').text(b.name).appendTo(nm);
            $('<small></small>').text(tx(b.kind === 'menu' ? 'kindMenu' : 'kindGame')).appendTo(nm);
            var acts = $('<div class="lm-tw-acts"></div>').appendTo(it);
            btn(tx('preview'), 'bpv', b.bid, 'lm-tw-go').appendTo(acts);
            btn(tx('apply'), 'bapply', b.bid).appendTo(acts);
            btn(tx('compare'), 'cmp', 'b:' + b.bid).appendTo(acts);
        });
        $('<h6></h6>').text(tx('galleryTitle')).appendTo(body);
    }
    function renderGallery(body) {
        var $ = jq();
        renderBuiltins(body);
        $('<div class="lm-tw-note"></div>').text(tx('galleryNote')).appendTo(body);
        $('<div class="lm-tw-note"></div>').text(tx('publishNote')).appendTo(body);
        if (!gallery) {
            if (!galleryState) loadGallery();
            if (galleryState === 'fail') {
                var r = $('<div class="lm-tw-row"></div>').appendTo(body);
                $('<span></span>').text(tx('galleryFail')).appendTo(r);
                btn(tx('retry'), 'gretry').appendTo(r);
            } else $('<div class="lm-tw-note lm-tw-loading"></div>').text(tx('galleryLoading')).appendTo(body);
            return;
        }
        var mine = loadStore().themes;
        gallery.forEach(function (g) {
            var it = $('<div class="lm-tw-item lm-tw-gitem"></div>').attr('data-gid', g.gid).appendTo(body);
            previewPic(g.pkg.body).appendTo(it);
            var nm = $('<div class="lm-tw-name"></div>').appendTo(it);
            $('<span></span>').text(g.pkg.name).appendTo(nm);
            if (g.pkg.author) $('<small></small>').text(tx('by', g.pkg.author)).appendTo(nm);
            if (g.pkg.description) $('<div class="lm-tw-desc"></div>').text(g.pkg.description).appendTo(nm);
            var acts = $('<div class="lm-tw-acts"></div>').appendTo(it);
            btn(tx('preview'), 'gpv', g.gid, 'lm-tw-go').appendTo(acts);
            var inst = mine.some(function (e) { return e.src === 'g:' + g.gid; });
            btn(inst ? tx('installed') : tx('install'), 'ginstall', g.gid).prop('disabled', inst).appendTo(acts);
            btn(tx('compare'), 'cmp', 'g:' + g.gid).appendTo(acts);
        });
    }
    function sources() {
        var out = [{ v: 'cur', name: tx('currentTheme') }];
        loadStore().themes.forEach(function (e) {
            out.push({ v: 'm:' + e.id, name: e.name });
            e.history.forEach(function (h, i) { out.push({ v: 'h:' + e.id + ':' + i, name: tx('versionOf', e.name, when(h.t)) }); });
        });
        builtins().forEach(function (b) { out.push({ v: 'b:' + b.bid, name: tx('builtinTitle') + ': ' + b.name + ' (' + tx(b.kind === 'menu' ? 'kindMenu' : 'kindGame') + ')' }); });
        (gallery || []).forEach(function (g) { out.push({ v: 'g:' + g.gid, name: tx('tabGallery') + ': ' + g.pkg.name }); });
        return out;
    }
    /* a source id ('cur', 'm:id', 'h:id:i', 'g:gid') as { name, body } */
    function resolve(v) {
        if (v === 'cur') return { name: tx('currentTheme'), body: captureBody() };
        var m = /^(m|h|g|b):([a-z0-9-]+)(?::(\d+))?$/.exec(v || '');
        if (!m) return null;
        if (m[1] === 'b') {
            var bi = findBuiltin(m[2]), bb = bi && builtinBody(bi, captureBody());
            return bb ? { name: bi.name, body: bb } : null;
        }
        if (m[1] === 'g') {
            var g = (gallery || []).filter(function (x) { return x.gid === m[2]; })[0];
            return g ? { name: g.pkg.name, body: g.pkg.body } : null;
        }
        var e = loadStore().themes.filter(function (x) { return x.id === m[2]; })[0];
        if (!e) return null;
        if (m[1] === 'm') return { name: e.name, body: e.body };
        var h = e.history[+m[3]];
        return h ? { name: tx('versionOf', e.name, when(h.t)), body: h.body } : null;
    }
    function fmt(v) {
        if (v === undefined || v === '') return tx('notSet');
        if (v === true) return tx('on');
        if (v === false) return tx('off');
        var s = String(v);
        return s.length > 80 ? s.slice(0, 77) + '...' : s;
    }
    function valueCell(td, v, key) {
        var $ = jq(), defs = schema() || {};
        if (typeof v === 'string' && typeof defs[key] === 'string' && COLOR_DEFAULT.test(defs[key]) && COLOR_VALUE.test(v)) {
            $('<span class="lm-tw-chip"></span>').css('background', v).appendTo(td);
        }
        $('<span></span>').text(fmt(v)).appendTo(td);
    }
    function renderCompare(body) {
        var $ = jq(), src = sources();
        if (!src.some(function (s) { return s.v === cmpA; })) cmpA = 'cur';
        if (!cmpB || !src.some(function (s) { return s.v === cmpB; })) cmpB = (src[1] && src[1].v) || 'cur';
        var row = $('<div class="lm-tw-row"></div>').appendTo(body);
        [['cmpA', cmpA], ['cmpB', cmpB]].forEach(function (p) {
            $('<span></span>').text(tx(p[0]) + ':').appendTo(row);
            var sel = $('<select></select>').attr('data-field', p[0]).appendTo(row);
            src.forEach(function (s) { $('<option></option>').val(s.v).text(s.name).appendTo(sel); });
            sel.val(p[1]);
        });
        var a = resolve(cmpA), b = resolve(cmpB);
        if (!a || !b) return;
        var rows = diffBodies(a.body, b.body, T(), label);
        $('<div class="lm-tw-note lm-tw-diffcount"></div>').text(rows.length ? tx('diffCount', rows.length) : tx('diffNone')).appendTo(body);
        if (!rows.length) return;
        var table = $('<table></table>').appendTo(body);
        var hr = $('<tr></tr>').appendTo(table);
        $('<th></th>').text(tx('colSetting')).appendTo(hr);
        $('<th></th>').text(tx('cmpA')).appendTo(hr);
        $('<th></th>').text(tx('cmpB')).appendTo(hr);
        rows.forEach(function (r) {
            var tr = $('<tr></tr>').appendTo(table);
            $('<td></td>').text(r.label).appendTo(tr);
            valueCell($('<td></td>').appendTo(tr), r.a, r.key);
            valueCell($('<td></td>').appendTo(tr), r.b, r.key);
        });
    }

    /* ═══ Gallery ═══ */
    function loadGallery() {
        galleryState = 'loading';
        var done = function (list) {
            gallery = list && list.length ? list : null;
            galleryState = gallery ? 'ok' : 'fail';
            if (isOpen() && (tab === 'gallery' || tab === 'compare')) render();
        };
        if (typeof W.fetch !== 'function') { done(null); return; }
        W.fetch(CATALOGUE_URL + '?v=' + encodeURIComponent(W.OgVer || ''), { cache: 'no-cache', credentials: 'omit' })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
            .then(function (t) {
                if (t.length > MAX_CATALOGUE_CHARS) throw new Error('too big');
                done(cleanCatalogue(JSON.parse(t)));
            })
            .catch(function () { done(null); });
    }

    /* ═══ Import / export ═══ */
    function importText(text) {
        var r = parsePackage(text);
        if (!r.ok) { toast('error', esc(tx('e_' + r.error))); return null; }
        var st = loadStore();
        if (st.themes.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return null; }
        var now = Date.now();
        var e = { id: newId(), name: uniqueName(r.pkg.name, st.themes), author: r.pkg.author, description: r.pkg.description, created: r.pkg.created, updated: now, src: 'import', body: r.pkg.body, history: [] };
        st.themes.unshift(e);
        var err = saveStore(st);
        if (err) { toast('error', esc(tx(err))); return null; }
        var msg = tx('imported', e.name, Object.keys(e.body.theme).length + (e.body.sounds ? Object.keys(e.body.sounds).length : 0));
        if (r.dropped.length) msg += tx('importedDropped', r.dropped.length);
        if (r.urls.length) msg += tx('importedUrls', r.urls.map(function (u) { return hostOf(u.url); }).filter(function (h, i, a) { return a.indexOf(h) === i; }).join(', '));
        toast('success', esc(msg));
        tab = 'mine';
        render();
        return e;
    }
    function exportEntry(v) {
        if (v === 'cur') return { name: tx('currentTheme'), author: '', description: '', created: Date.now(), body: captureBody() };
        var m = /^m:([a-z0-9]+)$/.exec(v || '');
        return m ? loadStore().themes.filter(function (x) { return x.id === m[1]; })[0] || null : null;
    }
    function exportText(e) { return JSON.stringify(toPackage(e), null, 2); }
    /* ═══ Actions ═══ */
    function cleanName(n) { return cleanText(n, NAME_MAX); }
    function requestPreview(body, name) {
        var cur = T(), urls = bodyUrls(body).filter(function (u) {
            var now = SOUND_KEYS.indexOf(u.key) >= 0 ? (S() || {})[u.key] : cur[u.key];
            return now !== u.url;
        });
        if (urls.length) { pending = { body: body, name: name, urls: urls }; render(); return; }
        startPreview(body, name);
    }
    function act(a, id) {
        var $ = jq(), st = loadStore(), list = st.themes, now = Date.now();
        var key = String(id || '').split(':'), i = -1;
        for (var j = 0; j < list.length; j++) if (list[j].id === key[0]) { i = j; break; }
        var e = i >= 0 ? list[i] : null;
        var save = function (okMsg) {
            var err = saveStore(st);
            if (err) { toast('error', esc(tx(err))); return false; }
            if (okMsg) toast('success', esc(okMsg));
            return true;
        };
        if (a === 'pv-go') { var p = pending; pending = null; if (p) startPreview(p.body, p.name); return; }
        if (a === 'pv-cancel') { pending = null; render(); return; }
        pending = null;
        if (a === 'save') {
            var nm = cleanName($('#lm-tw-name').val());
            if (!nm) { toast('info', esc(tx('needName'))); $('#lm-tw-name').focus(); return; }
            if (list.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return; }
            list.unshift({ id: newId(), name: uniqueName(nm, list), author: '', description: '', created: now, updated: now, src: 'saved', body: captureBody(), history: [] });
            save(tx('saved', list[0].name));
        } else if (a === 'pv' && e) {
            requestPreview(e.body, e.name);
            return;
        } else if (a === 'update' && e) {
            var nb = captureBody();
            if (sameBody(e.body, nb)) { toast('info', esc(tx('sameTheme', e.name))); return; }
            if (!W.confirm(tx('confirmUpdate', e.name))) return;
            pushHistory(e, nb, now);
            save(tx('updated', e.name));
        } else if (a === 'rename' && e) {
            var nn = cleanName(W.prompt(tx('renamePrompt'), e.name));
            if (!nn || nn === e.name) return;
            e.name = uniqueName(nn, list.filter(function (x) { return x !== e; }));
            e.updated = now;
            save();
        } else if (a === 'dup' && e) {
            if (list.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return; }
            var base = Array.from(e.name).slice(0, NAME_MAX - 12).join('') + tx('copySuffix');
            list.splice(i + 1, 0, { id: newId(), name: uniqueName(cleanName(base), list), author: e.author, description: e.description, created: now, updated: now, src: 'saved', body: clone(e.body), history: [] });
            save();
        } else if (a === 'del' && e) {
            if (!W.confirm(tx('confirmDelete', e.name))) return;
            list.splice(i, 1);
            save();
        } else if (a === 'hist' && e) {
            openHist[e.id] = !openHist[e.id];
        } else if (a === 'hpv' && e) {
            var hv = e.history[+key[1]];
            if (hv) requestPreview(hv.body, tx('versionOf', e.name, when(hv.t)));
            return;
        } else if (a === 'hrestore' && e) {
            var t0 = e.history[+key[1]] && e.history[+key[1]].t;
            if (restoreVersion(e, +key[1], now)) save(tx('restored', e.name, when(t0)));
        } else if (a === 'cmp') {
            cmpA = 'cur';
            cmpB = id;
            tab = 'compare';
        } else if (a === 'gretry') {
            gallery = null;
            galleryState = '';
        } else if (a === 'bpv' || a === 'bapply') {
            /* shipped presets: their addresses (the menu pattern) need no review */
            var bi = findBuiltin(id);
            if (!bi) return;
            if (a === 'bpv') { var bt = builtinTarget(bi); if (bt) startPreview(builtinBody(bi, captureBody()), bi.name, 0, bt); return; }
            applyBuiltin(bi);
        } else if (a === 'gpv' || a === 'ginstall') {
            var g = (gallery || []).filter(function (x) { return x.gid === id; })[0];
            if (!g) return;
            if (a === 'gpv') { requestPreview(g.pkg.body, g.pkg.name); return; }
            if (list.some(function (x) { return x.src === 'g:' + g.gid; })) { toast('info', esc(tx('already', g.pkg.name))); return; }
            if (list.length >= MAX_THEMES) { toast('error', esc(tx('tooMany'))); return; }
            list.unshift({ id: newId(), name: uniqueName(g.pkg.name, list), author: g.pkg.author, description: g.pkg.description, created: g.pkg.created, updated: now, src: 'g:' + g.gid, body: clone(g.pkg.body), history: [] });
            save(tx('installedMsg', g.pkg.name));
        }
        render();
    }

    /* ═══ Start ═══ */
    var started = false;
    /* the window's button: at the top of the Theme tab, where the Theme preset list was (the
     * shipped presets are in this window now) */
    function addButton() {
        var $ = jq();
        if (!$ || $('#theme .lm-tw-open').length) return !!$;
        var anchor = $('#theme-main');
        if (!anchor.length) return false;
        $('<button type="button" class="btn btn-block btn-info lm-tw-open"></button>').attr('data-i18n', P + 'title').text(tx('title')).prependTo(anchor.first()).on('click', function (e) {
            e.preventDefault();
            open();
        });
        return true;
    }
    function init() {
        if (started) return;
        started = true;
        guardSave();
        addButton();
    }
    var tries = 0;
    function boot() {
        if (ready() && jq()('#theme-main').length) { init(); return; }
        if (++tries < 240) setTimeout(boot, 500);
    }
    setTimeout(boot, 0);

    api.open = open;
    api.close = close;
    api.toggle = toggle;
    api.isOpen = isOpen;
    /* for scripts and the smoke test */
    api.previewing = previewing;
    api.preview = function (body, name, ms) { return startPreview(cleanBody(body), cleanName(name) || tx('script'), ms); };
    api.keep = function () { endPreview(true); };
    api.revert = function () { endPreview(false); };
    /* Before something else changes the settings (a settings preset, import, restore):
     * ends a running preview (back to the theme from before it), so its timer never rolls the
     * newer change back. Returns whether a preview was running. */
    api.settle = function () { if (!preview) return false; endPreview(false); return true; };
    api.list = function () { return loadStore().themes.map(function (e) { return { id: e.id, name: e.name, src: e.src || '' }; }); };
    api.importText = importText;
    api.exportPackage = function (id) { var e = exportEntry(id ? 'm:' + id : 'cur'); return e ? toPackage(e) : null; };
})();
