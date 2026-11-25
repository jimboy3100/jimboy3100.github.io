/* Legend Mod plugins, inside the User Scripts panel (its 5 slots: a URL or pasted code each).
 * The "User Scripts (plugins)" hotkey without a default key and the Command Centre open it.
 *
 * A user script can start with a header that makes it a plugin:
 *
 *   // ==LMPlugin==
 *   // @name        Mass milestone toasts
 *   // @version     1.0.0
 *   // @description A short message when your mass passes 1k, 5k, 10k...
 *   // @author      Someone
 *   // @minVersion  3.568
 *   // @maxVersion  4
 *   // @permissions reads game state, shows messages
 *   // ==/LMPlugin==
 *
 * Fields can also be written "name: value"; unknown fields are ignored, every value is cleaned
 * and shown as text only. The panel gets: the header of the chosen slot under the slot chooser,
 * a "Plugins" view (all slots with their header, on/off at start, compatibility, settings) and a
 * "Catalogue" view (example plugins, installed into a free slot). The slots keep their storage
 * (Userscript<n>, Userscripttexture<n>, UserscriptEnabled<n>); LMexpress/LMexpress.sniff2.js asks
 * window._lmUsGate before a slot runs: a plugin runs only on the Legend Mod versions it supports,
 * and its declared permissions (or a URL from another site) are confirmed when the user loads it.
 * Scripts without a header run as before.
 *
 * Scripts run in this page with full access to it: a script in the page cannot be isolated, the
 * permissions are what the author declares, not limits. Turning a slot off stops it at the next
 * start (at once when the plugin supports that); its code stays loaded until a reload.
 *
 * A plugin can call LMPlugins.ready({ settings: [...], onSettingsChange, onEnable, onDisable })
 * at its top level (developers/LMEvents.md); its settings are kept in 'lmPluginSettings.<id>'.
 * The pure helpers are tested in developers/tests/plugins.js.
 */
(function () {
    'use strict';

    /* ------------------------------------------------------------------------------------
     * Pure logic (no DOM): also loaded by developers/tests/plugins.js
     * ------------------------------------------------------------------------------------ */

    var SET_KEY = 'lmPluginSettings.';
    var SLOTS = 5;
    var MAX_CODE = 200000;      /* characters of a script that is read for its header */
    var MAX_URL = 600;
    var MAX_SETTINGS = 20;
    var ID_RE = /^[a-z0-9][a-z0-9._-]{0,47}$/;
    /* the Legend Mod sites: plugins from there are not "third-party" */
    var OFFICIAL_HOSTS = ['www.legendmod.ml', 'legendmod.ml', 'jimboy3100.github.io'];

    /* a header may use a permission id or one of the plain words */
    /* known permissions -> the key of their label (modules.plugins.<key>) */
    var PERMS = {
        'game.read': 'permGameRead',
        'chat.read': 'permChatRead',
        'chat.send': 'permChatSend',
        'settings': 'permSettings',
        'network': 'permNetwork',
        'ui': 'permUi',
        'storage': 'permStorage',
        'controls': 'permControls'
    };
    var PERM_WORDS = {
        'reads game': 'game.read', 'reads game state': 'game.read', 'reads the game': 'game.read', 'game': 'game.read',
        'reads chat': 'chat.read', 'read chat': 'chat.read', 'chat': 'chat.read',
        'sends chat': 'chat.send', 'send chat': 'chat.send', 'sends chat messages': 'chat.send',
        'changes settings': 'settings', 'change settings': 'settings',
        'net': 'network', 'internet': 'network',
        'shows messages': 'ui', 'adds to the screen': 'ui', 'screen': 'ui', 'toasts': 'ui',
        'stores data': 'storage', 'localstorage': 'storage',
        'presses keys': 'controls', 'game keys': 'controls', 'input': 'controls'
    };

    function hasOwn(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }

    /* one line of plain text: no control or direction-changing characters, single spaces */
    function cleanText(v, max) {
        if (v == null) return '';
        var s = String(v).replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, ' ');
        s = s.replace(/\s+/g, ' ').trim();
        return max && s.length > max ? s.slice(0, max).trim() : s;
    }
    function escapeHtml(s) {
        return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    /* "Chat word highlighter!" -> "chat-word-highlighter" */
    function slug(s) {
        s = cleanText(s, 80).toLowerCase();
        try { s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) { }
        s = s.replace(/[^a-z0-9._-]+/g, '-').replace(/^[-._]+|[-._]+$/g, '').replace(/-{2,}/g, '-').slice(0, 48).replace(/[-._]+$/, '');
        return ID_RE.test(s) ? s : '';
    }
    function cleanId(v) {
        var s = typeof v === 'string' ? v.trim().toLowerCase() : '';
        return ID_RE.test(s) ? s : '';
    }
    /* Legend Mod versions are decimal numbers (3.568): "3.6" means 3.600. Anything else is no
     * version (null). */
    function lmVersion(v) {
        if (typeof v === 'number') return isFinite(v) && v >= 0 && v < 1000 ? v : null;
        var s = typeof v === 'string' ? v.trim() : '';
        if (!/^\d{1,3}(\.\d{1,6})?$/.test(s)) return null;
        return parseFloat(s);
    }
    function safeUrl(u) {
        if (typeof u !== 'string') return '';
        u = u.trim();
        if (!u || u.length > MAX_URL || !/^https?:\/\/[^\s"'<>`\\]+$/i.test(u)) return '';
        try {
            var p = new URL(u);
            if (p.protocol !== 'https:' && p.protocol !== 'http:') return '';
            if (p.username || p.password) return '';
            return p.href.length <= MAX_URL ? p.href : '';
        } catch (e) { return ''; }
    }
    function hostOf(u) {
        try { return new URL(u).hostname.toLowerCase(); } catch (e) { return ''; }
    }
    function isOfficialUrl(u) {
        u = safeUrl(u);
        if (!u || u.indexOf('https:') !== 0) return false;
        return OFFICIAL_HOSTS.indexOf(hostOf(u)) !== -1;
    }

    /* "reads chat, sends chat; network" -> known ids + the words that are no known permission */
    function parsePermissions(list) {
        var known = [], unknown = [];
        var parts = [];
        (Array.isArray(list) ? list : [list]).forEach(function (x) {
            if (typeof x === 'string') parts = parts.concat(x.split(/[,;|]/));
        });
        parts.forEach(function (p) {
            var w = cleanText(p, 60).toLowerCase();
            if (!w) return;
            var id = hasOwn(PERMS, w) ? w : (hasOwn(PERM_WORDS, w) ? PERM_WORDS[w] : '');
            if (!id && hasOwn(PERMS, w.replace(/\s+/g, '.'))) id = w.replace(/\s+/g, '.');
            if (id) { if (known.indexOf(id) === -1) known.push(id); }
            else if (unknown.length < 10 && unknown.indexOf(w) === -1) unknown.push(w.slice(0, 40));
        });
        return { known: known, unknown: unknown };
    }

    /* the fields of a header (or a stored copy of one), cleaned; null without a name */
    function cleanMeta(m) {
        if (!m || typeof m !== 'object') return null;
        var name = cleanText(m.name, 60);
        if (!name) return null;
        var perms = parsePermissions([].concat(m.permissions || [], m.unknownPermissions || []));
        var min = lmVersion(m.minVersion), max = lmVersion(m.maxVersion);
        if (min != null && max != null && max < min) max = null;
        return {
            id: cleanId(m.id) || slug(name) || 'plugin',
            name: name,
            version: cleanText(m.version, 20),
            description: cleanText(m.description, 300),
            author: cleanText(m.author, 60),
            minVersion: min,
            maxVersion: max,
            permissions: perms.known,
            unknownPermissions: perms.unknown
        };
    }

    var FIELD_MAP = {
        name: 'name', id: 'id', version: 'version', description: 'description', desc: 'description',
        author: 'author', minversion: 'minVersion', 'min-version': 'minVersion', maxversion: 'maxVersion',
        'max-version': 'maxVersion', permissions: 'permissions', permission: 'permissions'
    };
    /* Reads the ==LMPlugin== header of a script.
     * -> { ok, meta, errors: ['noHeader' | 'noName'], warnings: ['minVersion' | 'maxVersion' | 'range' | 'tooLong'] } */
    function parseMeta(src) {
        var res = { ok: false, meta: null, errors: [], warnings: [] };
        if (typeof src !== 'string') { res.errors.push('noHeader'); return res; }
        if (src.length > MAX_CODE) res.warnings.push('tooLong');
        var head = src.slice(0, 20000);
        var a = head.indexOf('==LMPlugin=='), b = head.indexOf('==/LMPlugin==');
        if (a === -1 || b === -1 || b < a) { res.errors.push('noHeader'); return res; }
        var raw = { permissions: [] };
        head.slice(a + 12, b).split(/\r\n|\r|\n/).forEach(function (line) {
            var m = /^\s*(?:\/\/+|\/?\*+|#)?\s*@([A-Za-z][A-Za-z0-9_-]{0,30})(?:\s+(.*))?$/.exec(line) ||
                /^\s*(?:\/\/+|\/?\*+|#)?\s*([A-Za-z][A-Za-z0-9_-]{0,30})\s*:\s*(.*)$/.exec(line);
            if (!m) return;
            var k = m[1].toLowerCase();
            if (!hasOwn(FIELD_MAP, k)) return; /* unknown fields are ignored */
            var f = FIELD_MAP[k], v = (m[2] || '').replace(/\s*\*\/\s*$/, '');
            if (f === 'permissions') raw.permissions.push(v);
            else if (!hasOwn(raw, f)) raw[f] = v;
        });
        if (hasOwn(raw, 'minVersion') && cleanText(raw.minVersion) && lmVersion(raw.minVersion) == null) res.warnings.push('minVersion');
        if (hasOwn(raw, 'maxVersion') && cleanText(raw.maxVersion) && lmVersion(raw.maxVersion) == null) res.warnings.push('maxVersion');
        var lo = lmVersion(raw.minVersion), hi = lmVersion(raw.maxVersion);
        if (lo != null && hi != null && hi < lo) res.warnings.push('range');
        var meta = cleanMeta(raw);
        if (!meta) { res.errors.push('noName'); return res; }
        res.meta = meta;
        res.ok = true;
        return res;
    }

    /* Can it run on this Legend Mod version? -> { ok, reason: 'ok' | 'old' | 'new' | 'unknown', need } */
    function compat(meta, ogVer) {
        var v = +ogVer;
        if (!meta) return { ok: false, reason: 'unknown', need: null };
        if (!isFinite(v) || v <= 0) return { ok: true, reason: 'unknown', need: null };
        var eps = 1e-9;
        if (meta.minVersion != null && v < meta.minVersion - eps) return { ok: false, reason: 'old', need: meta.minVersion };
        if (meta.maxVersion != null && v > meta.maxVersion + eps) return { ok: false, reason: 'new', need: meta.maxVersion };
        return { ok: true, reason: 'ok', need: null };
    }

    /* the catalogue file -> entries with absolute script URLs (only http/https) */
    function validateCatalogue(json, base) {
        var o = json;
        if (typeof json === 'string') { try { o = JSON.parse(json); } catch (e) { o = null; } }
        var out = [];
        if (!o || typeof o !== 'object' || !Array.isArray(o.plugins)) return out;
        var seen = {};
        for (var i = 0; i < o.plugins.length && out.length < 50; i++) {
            var e = o.plugins[i];
            if (!e || typeof e !== 'object') continue;
            var meta = cleanMeta(e);
            if (!meta || hasOwn(seen, meta.id)) continue;
            var file = typeof e.url === 'string' ? e.url : typeof e.file === 'string' ? e.file : '';
            var url = '';
            if (!file.trim()) continue;
            try { url = safeUrl(new URL(file.trim(), base).href); } catch (er) { url = ''; }
            if (!url) continue;
            seen[meta.id] = 1;
            meta.url = url;
            out.push(meta);
        }
        return out;
    }

    /* a plugin's own settings: [{ key, type: 'checkbox' | 'number' | 'text', label, default, min, max }] */
    function validateSchema(list) {
        var out = [], seen = {};
        if (!Array.isArray(list)) return out;
        for (var i = 0; i < list.length && out.length < MAX_SETTINGS; i++) {
            var s = list[i];
            if (!s || typeof s !== 'object') continue;
            var key = typeof s.key === 'string' && /^[A-Za-z][A-Za-z0-9_-]{0,30}$/.test(s.key) ? s.key : '';
            if (!key || hasOwn(seen, key)) continue;
            var type = s.type === 'checkbox' || s.type === 'number' ? s.type : 'text';
            var item = { key: key, type: type, label: cleanText(s.label, 80) || key };
            if (type === 'checkbox') item['default'] = s['default'] === true;
            else if (type === 'number') {
                item.min = typeof s.min === 'number' && isFinite(s.min) ? s.min : -1e9;
                item.max = typeof s.max === 'number' && isFinite(s.max) && s.max >= item.min ? s.max : 1e9;
                var d = typeof s['default'] === 'number' && isFinite(s['default']) ? s['default'] : 0;
                item['default'] = Math.min(item.max, Math.max(item.min, d));
            } else {
                item.maxLength = typeof s.maxLength === 'number' && s.maxLength > 0 ? Math.min(500, Math.floor(s.maxLength)) : 200;
                item['default'] = cleanText(s['default'], item.maxLength);
            }
            seen[key] = 1;
            out.push(item);
        }
        return out;
    }
    /* stored or typed values -> one value of the right type per setting */
    function cleanValues(schema, values) {
        var out = {};
        var o = values;
        if (typeof values === 'string') { try { o = JSON.parse(values); } catch (e) { o = null; } }
        if (!o || typeof o !== 'object') o = {};
        schema.forEach(function (s) {
            var v = hasOwn(o, s.key) ? o[s.key] : undefined;
            if (s.type === 'checkbox') out[s.key] = typeof v === 'boolean' ? v : s['default'];
            else if (s.type === 'number') {
                var n = typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' ? +v : NaN);
                out[s.key] = isFinite(n) ? Math.min(s.max, Math.max(s.min, n)) : s['default'];
            } else out[s.key] = typeof v === 'string' ? cleanText(v, s.maxLength) : s['default'];
        });
        return out;
    }

    /* One user script slot as stored ({ url, code, name, enabled } from localStorage, any of them
     * missing or "null") -> a checked entry with the header of its code. */
    function slotEntry(n, raw) {
        raw = raw && typeof raw === 'object' ? raw : {};
        var str = function (v) { return typeof v === 'string' && v !== 'null' && v !== 'undefined' ? v : ''; };
        var rawUrl = str(raw.url).trim(), code = str(raw.code);
        var url = safeUrl(rawUrl);
        var pm = code ? parseMeta(code.length > MAX_CODE ? code.slice(0, MAX_CODE) : code) : { ok: false };
        return {
            n: n,
            empty: !rawUrl && !code.trim(),
            url: url,
            badUrl: !!rawUrl && !url,
            official: !!url && isOfficialUrl(url),
            pasted: !rawUrl && !!code.trim(),
            name: cleanText(str(raw.name), 60),
            enabled: raw.enabled === true,
            meta: pm.ok ? pm.meta : null
        };
    }
    /* the first slot without a URL or code (0 = all in use) */
    function firstEmptySlot(entries) {
        for (var i = 0; i < entries.length; i++) if (entries[i] && entries[i].empty) return entries[i].n;
        return 0;
    }

    var pure = {
        cleanText: cleanText, escapeHtml: escapeHtml, slug: slug, lmVersion: lmVersion, safeUrl: safeUrl,
        isOfficialUrl: isOfficialUrl, parsePermissions: parsePermissions, cleanMeta: cleanMeta, parseMeta: parseMeta,
        compat: compat, validateCatalogue: validateCatalogue, validateSchema: validateSchema, cleanValues: cleanValues,
        slotEntry: slotEntry, firstEmptySlot: firstEmptySlot, PERMS: PERMS, MAX_CODE: MAX_CODE
    };

    if (typeof window === 'undefined') {
        if (typeof module === 'object' && module.exports) module.exports = pure;
        return;
    }
    /* ------------------------------------------------------------------------------------
     * In the page
     * ------------------------------------------------------------------------------------ */

    if (window._lmPluginsLoaded) return;
    window._lmPluginsLoaded = true;

    var CATALOGUE_URL = 'https://www.legendmod.ml/extras/plugins/catalogue.json';
    var LETTERS = ['', 'A', 'B', 'C', 'D', 'E'];

    /* texts: developers/i18n/src (modules.plugins.*); tx('key', a, b) fills {0} {1} */
    var P = 'modules.plugins.';
    function tx(k) {
        var v = Array.prototype.slice.call(arguments, 1);
        return typeof window.lmT === 'function' ? window.lmT(P + k, v.length ? v : undefined) : k;
    }
    function permLabel(id) { return hasOwn(PERMS, id) ? tx(PERMS[id]) : id; }
    /* the label of the panel's own Erase button (language pack) */
    function eraseLabel() { return typeof window.lmT === 'function' ? window.lmT('pack.eraseScript') : 'pack.eraseScript'; }
    function setDir(e) {
        try { if (e && window.LMi18n && window.LMi18n.dir) e.setAttribute('dir', window.LMi18n.dir()); } catch (er) { }
    }
    function toast(type, text) {
        try { if (window.toastr) window.toastr[type](escapeHtml(text)); } catch (e) { }
    }
    function ogVer() { return +window.OgVer || 0; }
    function jq() { return window.jQuery || null; }

    function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
    function lsSet(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }

    /* ---------- the slots (LMexpress/LMexpress.sniff2.js) ---------- */

    function slotEnabled(n) {
        try { return typeof window._lmUserscriptEnabled === 'function' ? !!window._lmUserscriptEnabled(n) : lsGet('UserscriptEnabled' + n) === '1'; } catch (e) { return false; }
    }
    function slotCode(n) {
        var ta = document.getElementById('Userscripttexture' + n);
        var v = ta && typeof ta.value === 'string' ? ta.value : '';
        return v || lsGet('Userscripttexture' + n) || '';
    }
    function slot(n) {
        // i18n-ok: localStorage key
        return slotEntry(n, { url: lsGet('Userscript' + n), code: slotCode(n), name: lsGet('Userscripttext1' + n), enabled: slotEnabled(n) });
    }
    function slots() { var out = []; for (var n = 1; n <= SLOTS; n++) out.push(slot(n)); return out; }
    function ranCode(n) { var r = window._lmUsRan; return r && typeof r[n] === 'string' ? r[n] : null; }

    var rt = {};        /* slot -> { opts, schema, id, status } for this page */
    var confirmed = {}; /* slot -> code the user confirmed in this page */
    function R(n) { return rt[n] || (rt[n] = { opts: null, schema: [], id: '', status: '' }); }
    function callOpt(n, name, arg) {
        var o = rt[n] && rt[n].opts;
        if (!o || typeof o[name] !== 'function') return false;
        try { o[name](arg); } catch (e) { try { console.warn('[LM plugins] slot ' + n + ' ' + name + ' failed:', e); } catch (e2) { } }
        return true;
    }

    function confirmText(meta, url) {
        var lines = [meta ? tx('confirmRun', meta.name) : tx('confirmScript'), ''];
        if (meta) {
            var perms = meta.permissions.map(permLabel).concat(meta.unknownPermissions.map(function (w) { return w + ' (' + tx('unknownPerm') + ')'; }));
            if (perms.length) { lines.push(tx('confirmPerms')); perms.forEach(function (l) { lines.push('- ' + l); }); }
            else lines.push(tx('confirmNoPerms'));
            lines.push('');
        }
        lines.push(tx('confirmFull'));
        if (url && !isOfficialUrl(url)) lines.push('', tx('confirmThird', hostOf(url) || url));
        return lines.join('\n');
    }
    function needText(c) { return c.reason === 'old' ? tx('needOld', c.need) : tx('needNew', c.need); }

    /* Asked by the slots before a script runs (sniff2 _lmUsGateRun). ask = the user loads it now
     * (Load button, a URL typed in, a switch here); otherwise it is the run at start. */
    function gate(n, code, ask) {
        n = +n;
        if (!(n >= 1 && n <= SLOTS)) return true;
        code = typeof code === 'string' ? code : '';
        var pm = parseMeta(code), url = safeUrl(lsGet('Userscript' + n) || '');
        var r = R(n);
        if (pm.ok) {
            var c = compat(pm.meta, ogVer());
            if (!c.ok) {
                r.status = c.reason;
                toast('warning', tx('notCompat', pm.meta.name, needText(c)));
                refresh();
                return false;
            }
        }
        if (ask && confirmed[n] !== code && (pm.ok || (url && !isOfficialUrl(url)))) {
            if (!window.confirm(confirmText(pm.ok ? pm.meta : null, url))) { refresh(); return false; }
        }
        confirmed[n] = code;
        r.status = 'running';
        r.opts = null;
        r.schema = [];
        r.id = pm.ok ? pm.meta.id : '';
        refresh();
        return true;
    }
    window._lmUsGate = gate;

    /* ---------- the plugin side: LMPlugins.ready() ---------- */

    function ready(opts) {
        opts = opts && typeof opts === 'object' ? opts : {};
        var cs = document.currentScript, text = cs && typeof cs.text === 'string' ? cs.text : '';
        var n = 0;
        for (var i = 1; i <= SLOTS && !n; i++) if (text && ranCode(i) === text) n = i;
        var schema = validateSchema(opts.settings);
        var pm = parseMeta(text);
        var id = pm.ok ? pm.meta.id : '';
        if (!n || !id) {
            /* the console or a script without a header: only the defaults */
            return { id: null, get: function (k) { return cleanValues(schema, {})[k]; }, values: function () { return cleanValues(schema, {}); } };
        }
        var r = R(n);
        r.opts = opts;
        r.schema = schema;
        r.id = id;
        r.status = 'running';
        refresh();
        var read = function () { return cleanValues(schema, lsGet(SET_KEY + id)); };
        return { id: id, get: function (k) { return read()[k]; }, values: read };
    }

    /* ---------- fetching ---------- */

    function fetchText(url) {
        return new Promise(function (resolve, reject) {
            var done = false;
            var timer = setTimeout(function () { if (!done) { done = true; reject(new Error('timeout')); } }, 15000);
            var ok = function (t) { if (done) return; done = true; clearTimeout(timer); resolve(String(t || '')); };
            var bad = function (e) { if (done) return; done = true; clearTimeout(timer); reject(e || new Error('failed')); };
            try {
                fetch(url, { cache: 'no-store', credentials: 'omit' }).then(function (r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.text();
                }).then(ok, bad);
            } catch (e) { bad(e); }
        });
    }
    var catalogue = null, catalogueState = '';
    function loadCatalogue() {
        if (catalogue) return Promise.resolve(catalogue);
        catalogueState = 'loading';
        return fetchText(CATALOGUE_URL + '?v=' + encodeURIComponent(String(window.OgVer || ''))).then(function (t) {
            catalogue = validateCatalogue(t, CATALOGUE_URL);
            catalogueState = '';
            return catalogue;
        }, function (e) {
            catalogueState = 'fail';
            throw e;
        });
    }

    /* ---------- turning slots on and off, installing ---------- */

    function runNow(n) {
        var $ = jq();
        if (!$) return;
        var s = slot(n);
        var go = function (code) {
            var ta = document.getElementById('Userscripttexture' + n);
            if (ta && code) ta.value = code;
            /* already confirmed here: the triggered Load is not asked again */
            confirmed[n] = code || (ta ? ta.value : '');
            $('#userscriptBtn' + n).trigger('click');
        };
        if (s.url) fetchText(s.url).then(go, function () { toast('error', tx('readFail')); });
        else go(slotCode(n));
    }
    function setSlotEnabled(n, on, skipConfirm) {
        n = +n;
        if (!(n >= 1 && n <= SLOTS)) return false;
        var s = slot(n), r = R(n);
        if (s.empty) { refresh(); return false; }
        if (on) {
            if (s.meta) {
                var c = compat(s.meta, ogVer());
                if (!c.ok) { toast('warning', tx('notCompat', s.meta.name, needText(c))); refresh(); return false; }
            }
            if (!skipConfirm && !window.confirm(confirmText(s.meta, s.url))) { refresh(); return false; }
            if (typeof window._lmUserscriptSetEnabled === 'function') window._lmUserscriptSetEnabled(n, true);
            else lsSet('UserscriptEnabled' + n, '1');
            if (ranCode(n) !== null) {
                /* ran earlier in this page: back at once if it supports that */
                if (callOpt(n, 'onEnable')) r.status = 'running';
                else r.status = r.opts && typeof r.opts.onDisable === 'function' ? 'reloadOn' : 'running';
            } else runNow(n);
        } else {
            if (typeof window._lmUserscriptSetEnabled === 'function') window._lmUserscriptSetEnabled(n, false);
            else lsSet('UserscriptEnabled' + n, '0');
            if (ranCode(n) !== null) {
                callOpt(n, 'onDisable');
                r.status = 'stopped';
                toast('info', tx('offToast', n));
            } else r.status = '';
        }
        refresh();
        return on;
    }
    /* catalogue plugin -> the first empty slot, through the slot's own URL field */
    function install(id, skipConfirm) {
        var m = (catalogue || []).filter(function (x) { return x.id === id; })[0];
        var $ = jq();
        if (!m || !$) return 0;
        var n = firstEmptySlot(slots());
        if (!n) { toast('warning', tx('noSlot', tx('editor'), eraseLabel())); return 0; }
        var c = compat(m, ogVer());
        if (!c.ok) { toast('warning', tx('notCompat', m.name, needText(c))); return 0; }
        if (!skipConfirm && !window.confirm(confirmText(m, m.url))) return 0;
        var L = LETTERS[n];
        $('#Userscripttext' + L).val(m.name);
        try { if (typeof window['Userscripttext1' + n] === 'function') window['Userscripttext1' + n](); else lsSet('Userscripttext1' + n, m.name); } catch (e) { }
        if (typeof window._lmUserscriptSetEnabled === 'function') window._lmUserscriptSetEnabled(n, true);
        /* the slot fetches the URL and loads it (asked here already) */
        $('#Userscript' + L).val(m.url).trigger('blur');
        refresh();
        return n;
    }

    /* ---------- the panel ---------- */

    /* the list of the 5 slots is the main view; the editor of one slot opens from its Edit button
     * (a separate Editor tab showed the same slots a second way) */
    var view = 'plugins', settingsFor = 0, opening = false;
    function el(tag, cls, text) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }
    function btn(text, act, n, cls) {
        var b = el('button', 'btn btn-xs lm-us-btn' + (cls ? ' ' + cls : ''), text);
        b.type = 'button';
        b.setAttribute('data-act', act);
        if (n != null) b.setAttribute('data-n', String(n));
        return b;
    }
    function css() {
        /* the shared window look (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
        if (document.getElementById('lm-us-style')) return;
        var st = document.createElement('style');
        st.id = 'lm-us-style';
        st.textContent =
            /* the panel had a fixed 600px height: its background now grows with the content */
            '#userscripts{height:auto !important;min-height:600px;padding-bottom:8px}' +
            /* a menu panel: it had the menu colours and background of the moment it was made (inline), a
             * black border and white text; now the current menu theme (the menu opacity is on #helloContainer) */
            '#userscripts{background-color:var(--lm-pc,#00243e) !important;background-image:var(--lm-menu-bg,none) !important;background-size:cover !important;background-position:center !important;' + // i18n-ok: CSS
            'border:1px solid var(--lm-pc2,#002f52) !important;border-top:3px solid var(--lm-mc,#01d9cc) !important;border-radius:var(--lm-radius,6px);max-width:calc(100vw - 16px);box-sizing:border-box;color:var(--lm-tc,#fff);font-size:var(--lm-w-fs,12px)}' +
            '#userscripter1,#userscripter2,#Userscriptshud2>.input-box{color:var(--lm-tc2,#fff) !important;font-size:var(--lm-w-fs,12px) !important}' +
            '#Userscriptshud2>h5{font-size:var(--lm-w-title,14px);font-weight:700;letter-spacing:1px;text-transform:uppercase}' +
            '#Userscriptshud2.lm-us-alt > :not(h5):not(#lm-us-bar):not(#lm-us-ext){display:none !important}' +
            '#lm-us-bar{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:0 0 6px}' +
            '#lm-us-bar button{min-height:var(--lm-w-ctl,28px);padding:3px 12px;font-size:var(--lm-w-fs,12px);font-family:inherit;color:var(--lm-tc,#fff);background:var(--lm-w-btn,rgba(255,255,255,.05));border:1px solid var(--lm-pc2,rgba(255,255,255,.25));border-radius:var(--lm-radius-s,4px)}' +
            '#lm-us-bar button.active{background:var(--lm-w-btn-h,rgba(255,255,255,.12));border-color:var(--lm-mc,rgba(255,255,255,.25));color:var(--lm-mc,#fff)}' +
            '#lm-us-ext{display:none;text-align:left;color:var(--lm-tc,#fff);font-size:12px;max-height:440px;overflow:auto;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain;padding:0 2px}' +
            '#Userscriptshud2.lm-us-alt #lm-us-ext{display:block}' +
            '#lm-us-info{text-align:left;color:var(--lm-tc,#fff);font-size:11px;line-height:1.4;margin:4px 0 2px;padding:4px 6px;background:rgba(0,0,0,.25);border-radius:var(--lm-radius-s,3px)}' +
            '.lm-us-warn{border-left:3px solid #e6a23c;background:rgba(230,162,60,.15);padding:4px 7px;margin:0 0 6px;font-size:11px;line-height:1.4}' +
            '.lm-us-note{opacity:.75;font-size:11px;margin:2px 0 6px}' +
            '.lm-us-item{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 8px;padding:6px 4px;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.15))}' +
            '.lm-us-main{flex:1;min-width:180px;word-break:break-word}' +
            '.lm-us-name{font-weight:600;font-size:12px}' +
            '.lm-us-name small{font-weight:normal;opacity:.7;margin-left:4px}' +
            '.lm-us-desc{opacity:.85}' +
            '.lm-us-meta{font-size:11px;opacity:.75}' +
            '.lm-us-perm{display:inline-block;font-size:10px;padding:0 5px;margin:1px 3px 1px 0;border-radius:8px;background:rgba(255,255,255,.15)}' +
            '.lm-us-perm.lm-us-unk{background:rgba(192,80,77,.5)}' +
            '.lm-us-bad{color:#ff9d94}' +
            '.lm-us-good{color:#9be3ad}' +
            '.lm-us-acts{display:flex;flex-wrap:wrap;align-items:center;gap:4px}' +
            /* the menu theme draws plain buttons white on white here */
            '.lm-us-btn{min-height:var(--lm-w-ctl,28px);padding:3px 10px !important;color:var(--lm-tc,#fff) !important;background:var(--lm-w-btn,rgba(255,255,255,.08)) !important;border:1px solid var(--lm-pc2,rgba(255,255,255,.35)) !important;border-radius:var(--lm-radius-s,4px)}' +
            /* the player's button colour 2 (success), not a fixed green */
            '.lm-us-btn.btn-success{background:rgba(60,158,90,.55) !important;background:color-mix(in srgb,var(--lm-btn2,#3c9e5a) 55%,transparent) !important;border-color:var(--lm-btn2,#3c9e5a) !important}' +
            '.lm-us-btn:disabled{opacity:.5}' +
            'label.lm-us-tg{display:inline-flex;align-items:center;gap:4px;margin:0;font-weight:normal;cursor:pointer;min-height:28px;color:var(--lm-tc,#fff)}' +
            'label.lm-us-tg input{width:18px;height:18px;margin:0}' +
            '#lm-us-ext input[type=text],#lm-us-ext input[type=number]{width:100%;box-sizing:border-box;min-height:var(--lm-w-ctl,28px);color:var(--lm-tc,#fff);background:var(--lm-w-field,rgba(0,0,0,.25));border:1px solid var(--lm-pc2,#002f52);border-radius:var(--lm-radius-s,4px);padding:3px 5px;font-family:inherit}' +
            '.lm-us-field{margin:6px 0}';
        document.head.appendChild(st);
    }
    function statusOf(s) {
        var r = rt[s.n];
        if (s.meta) {
            var c = compat(s.meta, ogVer());
            if (!c.ok) return { t: c.reason === 'old' ? tx('stOld', c.need) : tx('stNew', c.need), bad: true };
        }
        var st = r ? r.status : '';
        if (st === 'stopped') return { t: tx('stStopped') };
        if (!s.enabled) return { t: tx('stOff') };
        if (st === 'reloadOn') return { t: tx('stReloadOn') };
        if (st === 'running' || ranCode(s.n) !== null) return { t: tx('stRunning'), good: true };
        return { t: tx('stNotRun') };
    }
    function chips(box, meta) {
        box.appendChild(document.createTextNode(tx('perms') + ': '));
        if (!meta.permissions.length && !meta.unknownPermissions.length) { box.appendChild(el('span', 'lm-us-perm', tx('noPerms'))); return; }
        meta.permissions.forEach(function (id) { box.appendChild(el('span', 'lm-us-perm', permLabel(id))); });
        meta.unknownPermissions.forEach(function (w) {
            var c = el('span', 'lm-us-perm lm-us-unk', w);
            c.title = tx('unknownPerm');
            box.appendChild(c);
        });
    }
    function versionLine(meta) {
        if (meta.minVersion == null && meta.maxVersion == null) return tx('compatAny');
        var r = [];
        if (meta.minVersion != null) r.push('\u2265 ' + meta.minVersion);
        if (meta.maxVersion != null) r.push('\u2264 ' + meta.maxVersion);
        return 'Legend Mod ' + r.join(', ');
    }
    function sourceText(s) {
        if (s.pasted) return tx('pasted');
        if (!s.url) return '';
        return s.official ? tx('official') : tx('thirdParty', hostOf(s.url));
    }
    /* the header of a slot: name, version, author, description, permissions, compatibility, source */
    function describe(box, s, withName) {
        var m = s.meta;
        if (withName) {
            var name = el('div', 'lm-us-name', (s.n ? s.n + '. ' : '') + (m ? m.name : (s.name || tx('slot', s.n))));
            if (m && m.version) name.appendChild(el('small', '', 'v' + m.version));
            if (m && m.author) name.appendChild(el('small', '', tx('by', m.author)));
            box.appendChild(name);
        }
        if (s.empty) { box.appendChild(el('div', 'lm-us-meta', tx('empty'))); return; }
        if (m && m.description) box.appendChild(el('div', 'lm-us-desc', m.description));
        if (m) { var p = el('div', 'lm-us-meta'); chips(p, m); box.appendChild(p); }
        var st = statusOf(s), info = el('div', 'lm-us-meta');
        info.appendChild(el('span', st.bad ? 'lm-us-bad' : st.good ? 'lm-us-good' : '', st.t));
        var rest = [m ? versionLine(m) : tx('noHeader'), sourceText(s)].filter(Boolean).join(' \u00b7 ');
        info.appendChild(document.createTextNode(' \u00b7 ' + rest));
        box.appendChild(info);
    }

    function renderInfo() {
        var box = document.getElementById('lm-us-info');
        if (!box) return;
        var sel = document.getElementById('Userscriptpages3');
        var n = sel ? (+sel.value || 1) : 1;
        var s = slot(n);
        box.textContent = '';
        if (s.empty) { box.style.display = 'none'; return; }
        box.style.display = '';
        /* one short row here (the panel has a fixed height); the Plugins view shows the rest */
        var m = s.meta, st = statusOf(s);
        var acts = el('div', 'lm-us-acts');
        var line = el('span', 'lm-us-main');
        if (m) {
            line.appendChild(el('b', '', m.name + (m.version ? ' v' + m.version : '')));
            var np = m.permissions.length + m.unknownPermissions.length;
            line.appendChild(document.createTextNode(' \u00b7 ' + tx('perms') + ': ' + (np ? m.permissions.map(permLabel).concat(m.unknownPermissions).join(', ') : tx('noPerms')) + ' \u00b7 '));
        } else line.appendChild(document.createTextNode(tx('noHeader') + ' \u00b7 '));
        line.appendChild(el('span', st.bad ? 'lm-us-bad' : st.good ? 'lm-us-good' : '', st.t));
        acts.appendChild(line);
        acts.appendChild(toggleFor(s));
        if (rt[n] && rt[n].schema.length && s.enabled) acts.appendChild(btn(tx('settings'), 'settings', n));
        box.appendChild(acts);
    }
    function toggleFor(s) {
        var tg = el('label', 'lm-us-tg'), cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = s.enabled;
        cb.disabled = s.empty;
        cb.setAttribute('data-slot-toggle', String(s.n));
        tg.appendChild(cb);
        tg.appendChild(document.createTextNode(tx('atStart')));
        return tg;
    }

    function renderPlugins(body) {
        body.appendChild(el('div', 'lm-us-warn', tx('warn')));
        body.appendChild(el('div', 'lm-us-note', tx('offNote')));
        slots().forEach(function (s) {
            var row = el('div', 'lm-us-item'), main = el('div', 'lm-us-main');
            row.setAttribute('data-slot', String(s.n));
            describe(main, s, true);
            row.appendChild(main);
            var acts = el('div', 'lm-us-acts');
            if (!s.empty) acts.appendChild(toggleFor(s));
            if (rt[s.n] && rt[s.n].schema.length && s.enabled) acts.appendChild(btn(tx('settings'), 'settings', s.n));
            acts.appendChild(btn(tx('edit'), 'edit', s.n));
            row.appendChild(acts);
            body.appendChild(row);
        });
    }
    function renderCatalogue(body) {
        body.appendChild(el('div', 'lm-us-warn', tx('warn')));
        body.appendChild(el('div', 'lm-us-note', tx('catNote')));
        if (!catalogue) {
            body.appendChild(el('div', 'lm-us-note', catalogueState === 'fail' ? tx('catFail') : tx('catLoading')));
            if (catalogueState !== 'loading') loadCatalogue().then(refresh, refresh);
            return;
        }
        var have = {};
        slots().forEach(function (s) { if (s.meta) have[s.meta.id] = s.n; });
        catalogue.forEach(function (m) {
            var row = el('div', 'lm-us-item'), main = el('div', 'lm-us-main');
            row.setAttribute('data-cat', m.id);
            var name = el('div', 'lm-us-name', m.name);
            if (m.version) name.appendChild(el('small', '', 'v' + m.version));
            if (m.author) name.appendChild(el('small', '', tx('by', m.author)));
            main.appendChild(name);
            if (m.description) main.appendChild(el('div', 'lm-us-desc', m.description));
            var p = el('div', 'lm-us-meta');
            chips(p, m);
            main.appendChild(p);
            var c = compat(m, ogVer());
            main.appendChild(el('div', 'lm-us-meta' + (c.ok ? '' : ' lm-us-bad'), c.ok ? versionLine(m) : (c.reason === 'old' ? tx('stOld', c.need) : tx('stNew', c.need))));
            row.appendChild(main);
            var acts = el('div', 'lm-us-acts');
            var b = btn(have[m.id] ? tx('installed', have[m.id]) : tx('install'), 'install', null, have[m.id] ? '' : 'btn-success');
            b.setAttribute('data-id', m.id);
            b.disabled = !!have[m.id] || !c.ok;
            acts.appendChild(b);
            row.appendChild(acts);
            body.appendChild(row);
        });
    }
    function renderSettings(body) {
        var n = settingsFor, r = rt[n], s = slot(n);
        if (!r || !r.schema.length || !r.id) { settingsFor = 0; render(); return; }
        body.appendChild(el('div', 'lm-us-name', (s.meta ? s.meta.name : tx('slot', n)) + ' \u00b7 ' + tx('settings')));
        var vals = cleanValues(r.schema, lsGet(SET_KEY + r.id));
        r.schema.forEach(function (f) {
            var box = el('div', 'lm-us-field');
            if (f.type === 'checkbox') {
                var lb = el('label', 'lm-us-tg'), cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = !!vals[f.key];
                cb.setAttribute('data-key', f.key);
                lb.appendChild(cb);
                lb.appendChild(document.createTextNode(f.label));
                box.appendChild(lb);
            } else {
                box.appendChild(el('div', '', f.label));
                var i = document.createElement('input');
                i.type = f.type === 'number' ? 'number' : 'text';
                if (f.type === 'number') { i.min = String(f.min); i.max = String(f.max); } else i.maxLength = f.maxLength;
                i.value = String(vals[f.key]);
                i.setAttribute('data-key', f.key);
                box.appendChild(i);
            }
            body.appendChild(box);
        });
        var acts = el('div', 'lm-us-acts');
        acts.appendChild(btn(tx('save'), 'saveSettings', n, 'btn-success'));
        acts.appendChild(btn(tx('back'), 'back'));
        body.appendChild(acts);
    }

    function render() {
        var hud = document.getElementById('Userscriptshud2'), ext = document.getElementById('lm-us-ext');
        if (!hud || !ext) return;
        if (settingsFor && view === 'editor') view = 'plugins';
        hud.classList.toggle('lm-us-alt', view !== 'editor');
        var bs = document.querySelectorAll('#lm-us-bar button');
        for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('active', bs[i].getAttribute('data-view') === view);
        /* "All slots" only while a slot is edited */
        var ab = document.getElementById('lm-us-allslots');
        if (ab) ab.style.display = view === 'editor' ? '' : 'none';
        renderInfo();
        if (view === 'editor') return;
        var top = ext.scrollTop;
        ext.textContent = '';
        if (settingsFor) renderSettings(ext);
        else if (view === 'catalogue') renderCatalogue(ext);
        else renderPlugins(ext);
        ext.scrollTop = top;
    }
    var refreshTimer = 0;
    function refresh() {
        if (refreshTimer) return;
        /* several changes can come at once (a script's ready(), the gate, a toggle) */
        refreshTimer = setTimeout(function () { refreshTimer = 0; if (!settingsFor) render(); }, 0);
    }

    function onAct(act, n, id) {
        var $ = jq();
        if (act === 'edit') {
            settingsFor = 0;
            view = 'editor';
            if ($ && $('#Userscriptpages3').length) {
                $('#Userscriptpages3').val(String(n || 1));
                try { if (typeof window.userscriptpages === 'function') window.userscriptpages(); } catch (e) { }
            }
            render();
        } else if (act === 'settings') {
            if (rt[n] && rt[n].schema.length) { settingsFor = n; view = 'plugins'; render(); }
        } else if (act === 'back') { settingsFor = 0; render(); }
        else if (act === 'saveSettings') {
            var r = rt[n];
            if (!r || !r.id) return;
            var raw = {}, inputs = document.querySelectorAll('#lm-us-ext [data-key]');
            for (var i = 0; i < inputs.length; i++) {
                var k = inputs[i].getAttribute('data-key');
                raw[k] = inputs[i].type === 'checkbox' ? inputs[i].checked : inputs[i].value;
            }
            var vals = cleanValues(r.schema, raw);
            if (!lsSet(SET_KEY + r.id, JSON.stringify(vals))) { toast('error', tx('storeFail')); return; }
            callOpt(n, 'onSettingsChange', vals);
            toast('success', tx('saved'));
            settingsFor = 0;
            render();
        } else if (act === 'install') install(id);
    }

    /* adds the view switch, the header line and the Plugins / Catalogue area to the panel */
    function mount() {
        var hud = document.getElementById('Userscriptshud2');
        if (!hud) return false;
        if (document.getElementById('lm-us-bar')) return true;
        css();
        var h5 = hud.querySelector('h5');
        var bar = el('div');
        bar.id = 'lm-us-bar';
        [['plugins', 'plugins'], ['catalogue', 'catalogue']].forEach(function (v) {
            var b = el('button', '', tx(v[1]));
            b.type = 'button';
            b.setAttribute('data-view', v[0]);
            bar.appendChild(b);
        });
        /* back from the editor of one slot to the list (the slot's Edit button opens the editor) */
        var all = el('button', '', tx('allSlots'));
        all.type = 'button';
        all.id = 'lm-us-allslots';
        all.setAttribute('data-view', 'plugins');
        all.style.display = 'none';
        bar.insertBefore(all, bar.firstChild);
        var ext = el('div');
        ext.id = 'lm-us-ext';
        setDir(bar);
        setDir(ext);
        if (h5 && h5.nextSibling) { hud.insertBefore(bar, h5.nextSibling); hud.insertBefore(ext, bar.nextSibling); }
        else { hud.appendChild(bar); hud.appendChild(ext); }
        var info = el('div');
        info.id = 'lm-us-info';
        setDir(info);
        var sel = document.getElementById('Userscriptpages3');
        var box = sel && sel.closest ? sel.closest('.input-box') : null;
        if (box && box.parentNode) box.parentNode.insertBefore(info, box.nextSibling);
        else hud.appendChild(info);
        var panel = document.getElementById('userscripts') || hud;
        panel.addEventListener('click', function (e) {
            var t = e.target;
            var vb = t.closest ? t.closest('#lm-us-bar button') : null;
            if (vb) { e.preventDefault(); view = vb.getAttribute('data-view'); settingsFor = 0; render(); return; }
            var a = t.closest ? t.closest('#lm-us-ext [data-act], #lm-us-info [data-act]') : null;
            if (a && !a.disabled) { e.preventDefault(); onAct(a.getAttribute('data-act'), +a.getAttribute('data-n') || 0, a.getAttribute('data-id')); }
        });
        panel.addEventListener('change', function (e) {
            var t = e.target;
            if (t && t.hasAttribute && t.hasAttribute('data-slot-toggle')) setSlotEnabled(+t.getAttribute('data-slot-toggle'), t.checked);
            else if (t && (t.id === 'Userscriptpages3' || /^Userscript/.test(t.id || ''))) refresh();
        });
        /* the header line follows what is typed or erased in the editor */
        panel.addEventListener('focusout', function (e) { if (e.target && /^Userscript/.test(e.target.id || '')) setTimeout(refresh, 50); });
        /* the menu's User Scripts button opens the list of slots again (not the last slot edited) */
        var ob = document.getElementById('OpenuserScripts');
        if (ob) ob.addEventListener('click', function () { if (!opening && view === 'editor') { view = 'plugins'; settingsFor = 0; render(); } });
        /* a language change: the views and the header line again in the new language */
        if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(function () {
            setDir(bar); setDir(ext); setDir(info);
            for (var i = 0; i < bar.children.length; i++) bar.children[i].textContent = bar.children[i].id === 'lm-us-allslots' ? tx('allSlots') : tx(bar.children[i].getAttribute('data-view'));
            render();
        });
        var eb = document.getElementById('EraseScripter');
        if (eb) eb.addEventListener('click', function () { setTimeout(refresh, 50); });
        render();
        return true;
    }

    /* opens the User Scripts panel (from the hotkey, the Command Centre, the Lab) */
    function open(v) {
        var $ = jq();
        /* the list of slots unless a view is asked for */
        view = v === 'catalogue' || v === 'editor' ? v : 'plugins';
        settingsFor = 0;
        try { if (window.application && typeof window.application.showMenu === 'function') window.application.showMenu(); } catch (e) { }
        /* the click below is this call's own: it keeps the view asked for */
        opening = true;
        try {
            if ($ && $('#OpenuserScripts').length) $('#OpenuserScripts').trigger('click');
            else if ($) { $('#main-menu, #skins-panel, #quick-menu, #exp-bar').hide(); $('#userscripts').show(); }
        } finally { opening = false; }
        mount();
        render();
    }
    function isOpen() {
        var u = document.getElementById('userscripts');
        return !!(u && u.offsetParent !== null && u.style.display !== 'none');
    }
    function close() {
        if (typeof window.closeuserscripts === 'function') { try { window.closeuserscripts(); } catch (e) { } }
    }

    window.LMPlugins = {
        ready: ready,
        open: open,
        close: close,
        toggle: function (v) { if (isOpen()) close(); else open(v); },
        isOpen: isOpen,
        /* the 5 slots with their header and state */
        list: function () {
            return slots().map(function (s) {
                var r = rt[s.n];
                return { slot: s.n, id: s.meta ? s.meta.id : '', name: s.meta ? s.meta.name : s.name, version: s.meta ? s.meta.version : '', empty: s.empty, enabled: s.enabled, status: r ? r.status : '', registered: !!(r && r.opts), compatible: s.meta ? compat(s.meta, ogVer()).ok : true };
            });
        },
        setEnabled: function (n, on, skipConfirm) { return setSlotEnabled(n, !!on, !!skipConfirm); },
        install: function (id, skipConfirm) { return loadCatalogue().then(function () { return install(String(id), !!skipConfirm); }); },
        catalogue: loadCatalogue,
        _pure: pure
    };

    /* the panel is built by LMexpress/LMexpress.sniff2.js once the menu exists */
    var tries = 0;
    (function wait() {
        if (mount() || ++tries > 240) return;
        setTimeout(wait, 500);
    })();
})();
