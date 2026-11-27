/* Legend Mod settings profiles.
 * Named sets of the gameplay settings, the theme, the hotkeys and (optionally) the phone controls,
 * new ones from the Settings presets, gamepad-only sets (buttons and tuning: the named profiles the
 * Gamepad window had), optional automatic switching per server type / game mode / input
 * device (off by default), a comparison of any two sets, and the last 5 automatic settings backups.
 * Opened from Settings (next to Presets) or a hotkey (no default keys).
 * These are not the player profiles (ogarioPlayerProfiles: nick and skin).
 *
 * A profile is applied through the real controls, like the presets: a checkbox gets a bubbling
 * change (setSettings runs its side effects), a slider gets input + change, a text box a change.
 * The theme is applied like a theme preset (pickers, sliders, Settings.setTheme), the hotkeys
 * live. The game connection is never touched. The storage is written first as one transaction:
 * when it is full nothing changes at all.
 */
(function () {
    'use strict';
    if (window._lmProfilesLoaded) return;
    window._lmProfilesLoaded = true;

    var KEY_PROFILES = 'lmSettingsProfiles';
    var KEY_RULES = 'lmSettingsProfilesRules';
    var KEY_BACKUPS = 'lmSettingsBackups';
    var KEY_UNDO = 'lmSettingsProfilesUndo';
    var KEY_LAST = 'lmSettingsProfilesLast';
    /* the Gamepad window's old named setups that are not profiles yet (no room, or the storage
     * was full): kept apart from the buttons, so applying or undoing a set never removes them */
    var KEY_GP_PENDING = 'lmGamepadPending';
    /* 30 own sets + the up to 20 named profiles moved over from the Gamepad window */
    var MAX_PROFILES = 50;
    var MAX_BACKUPS = 5;
    /* characters of JSON (about bytes x2 in the browser): profiles and backups never fill the
     * storage the settings themselves need */
    var MAX_PROFILES_CHARS = 1200000;
    var MAX_BACKUPS_CHARS = 600000;
    var MAX_ENTRY_CHARS = 200000;
    /* an automatic backup on a settings change at most this often */
    var BACKUP_THROTTLE = 10 * 60 * 1000;
    var NAME_MAX = 40;

    var own = Object.prototype.hasOwnProperty;
    function has(o, k) { return !!o && own.call(o, k); }
    function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
    function num(v) { return typeof v === 'number' && isFinite(v) && v > 0 ? Math.floor(v) : 0; }
    function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

    /* ── Texts: the shared language packs (developers/i18n/src) ── */
    var P = 'modules.profiles.';
    /* tx('key', a, b): the text in the chosen language with {0} = a, {1} = b */
    function tx(key) {
        var vars = Array.prototype.slice.call(arguments, 1);
        return typeof window.lmT === 'function' ? window.lmT(P + key, vars) : key;
    }
    /* dates in the chosen language (zh is Traditional Chinese) */
    function locale() {
        var c = window.LMi18n && typeof window.LMi18n.lang === 'function' ? window.LMi18n.lang() : '';
        return c === 'zh' ? 'zh-TW' : c || undefined;
    }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }

    /* ── Validation (the same schema checks as the settings import) ── */
    function settingValue(k, v) {
        return typeof window.lmSettingValue === 'function' ? window.lmSettingValue(k, v) : undefined;
    }
    /* the theme schema of the core (LM_THEME_SCHEMA: ranges, steps, choices, colour format) */
    function themeValue(k, v) {
        return typeof window.lmThemeValue === 'function' ? window.lmThemeValue(k, v) : undefined;
    }
    /* LMmobile's phone controls and their slider ranges (LMmobile checks them again on load) */
    var MOBILE_SCHEMA = {
        jsSensitivity: [100, 600], btnOpacity: [0.2, 1], btnScale: [0.5, 1.5], hudFade: [0, 1],
        targetMode: 0, swipeSplit: 0, muteVibration: 0, tapHaptic: 0, quickCmds: 0, mbButton: 0,
        stopOnRelease: 0, pingBtn: 0, netGraph: 0, fixedJoystick: 0, joystickDeadZone: [0, 40],
        lbCompact: 0, jsResponseCurve: ['linear', 'ease', 'aggressive'], zoomBtns: 0, freeSpecBtn: 0
    };
    function mobileValue(k, v) {
        if (!has(MOBILE_SCHEMA, k)) return undefined;
        var r = MOBILE_SCHEMA[k];
        if (Array.isArray(r)) {
            /* string enum: an array of strings is a whitelist of accepted values */
            if (r.length > 0 && typeof r[0] === 'string') {
                return typeof v === 'string' && r.indexOf(v) >= 0 ? v : undefined;
            }
            v = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
            return typeof v === 'number' && isFinite(v) ? Math.min(r[1], Math.max(r[0], v)) : undefined;
        }
        return typeof v === 'boolean' ? v : undefined;
    }
    function hotkeyValue(k, v) {
        if (typeof k !== 'string' || k.length > 40 || typeof v !== 'string' || v.length > 60) return undefined;
        if (k === 'spec-messageKey') return v;
        var cmds = window.hotkeysCommand;
        if (isObj(cmds) && !own.call(cmds, v)) return undefined;
        return v;
    }
    function cleanMap(obj, fn, max) {
        if (!isObj(obj)) return null;
        var out = {}, n = 0;
        for (var k in obj) {
            if (!own.call(obj, k)) continue;
            /* P1 fix #22: a malformed value could throw in the validator (e.g. unexpected
             * type in a nested property). Skip the entry instead of crashing profile loading. */
            try {
                var v = fn(k, obj[k]);
                if (v === undefined) continue;
                out[k] = v;
            } catch (e) { continue; }
            if (++n >= (max || 5000)) break;
        }
        return n ? out : null;
    }
    function cleanSettings(o) { return cleanMap(o, settingValue); }
    function cleanTheme(o) { return cleanMap(o, themeValue); }
    function cleanHotkeys(o) { return cleanMap(o, hotkeyValue, 600); }
    function cleanMobile(o) { return cleanMap(o, mobileValue); }
    /* the saved zoom levels of hudhelpers.js: 3 (the former zoom bookmarks) to 5 zoom levels, 0 = not
     * saved (its own range check); anything else and the part is dropped as a whole. All 0 =
     * explicitly none (the Undo and the backups of a state without them: restoring it removes them) */
    function cleanZoomMarks(a) {
        if (!Array.isArray(a) || a.length < 3 || a.length > 5) return null;
        var out = [], any = false;
        for (var i = 0; i < a.length; i++) {
            var v = a[i];
            if (typeof v !== 'number' || !isFinite(v) || (v !== 0 && (v < 0.01 || v > 40))) return null;
            out.push(v);
        }
        return out;
    }
    function noZoomMarks(v) { return Array.isArray(v) && v.length >= 3 && v.length <= 5 && v.every(function (z) { return !z; }); }
    /* A part that did not exist (no gamepad buttons / phone control layout saved yet). Only the
     * Undo and the backups hold it: restoring them removes what was added since, where a missing
     * part would leave it (a profile without the part still leaves it as it is). */
    function absentPart() { return { _lmAbsent: 1 }; }
    function isAbsent(v) { return isObj(v) && v._lmAbsent === 1; }
    /* the explicit "none" of the parts that are missing in a state captured for the Undo or a backup */
    function markMissing(data, withM, withG) {
        if (withG === undefined) withG = withM;
        if (withM) {
            if (!isObj(data.m)) data.m = absentPart();
            if (!isObj(data.ml)) data.ml = absentPart();
        }
        if (withG && !isObj(data.gp)) data.gp = absentPart();
        if (!cleanZoomMarks(data.zb)) data.zb = [0, 0, 0];
        return data;
    }
    /* sorted keys: the same map written in another order is the same */
    function stableJSON(v) {
        if (!isObj(v)) return JSON.stringify(v === undefined ? null : v);
        return '{' + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ':' + stableJSON(v[k]); }).join(',') + '}';
    }
    /* the name of a HUD layout (hudeditor.js), '' for the normal HUD */
    function cleanLayoutName(v) {
        return typeof v === 'string' && v.length <= 30 && !/[\u0000-\u001f\u007f<>]/.test(v) ? v : undefined;
    }
    function cleanKnown(a) {
        if (!Array.isArray(a)) return null;
        var out = a.filter(function (x) { return typeof x === 'string' && x.length <= 60; }).slice(0, 2000);
        return out.length ? out : null;
    }
    /* A set of settings: s gameplay, t theme, h hotkeys (k: the hotkey commands that existed when
     * it was saved), m phone controls. A part that is missing (or has nothing valid) is not applied. */
    var PART_FNS = { s: cleanSettings, t: cleanTheme, h: cleanHotkeys, m: cleanMobile };
    /* The multibox ring colours are theme settings now (Theme > Basic theming); the gameplay
     * settings only keep a copy of them. A set saved before has them in its gameplay part: a theme
     * part without them takes them from there, so the set keeps its colours; a set without a theme
     * part (gameplay only) gets a theme part of just these colours. The copy itself is left out (it
     * would show as a second change and be put back by the theme). A set captured now never has
     * the copy without its theme (captureCurrent leaves it out). Returns true when the gameplay
     * part had nothing else (it is then dropped). */
    var RING_KEYS = ['mbRingColorP1', 'mbRingColorP2'];
    function moveRingColors(out) {
        if (!out.s) return false;
        RING_KEYS.forEach(function (k) {
            if (!own.call(out.s, k)) return;
            var v = themeValue(k, out.s[k]);
            delete out.s[k];
            if (v === undefined) return;
            if (!out.t) out.t = {};
            if (!own.call(out.t, k)) out.t[k] = v;
        });
        if (Object.keys(out.s).length) return false;
        delete out.s;
        return true;
    }
    /* only ring colours: the theme part an old gameplay-only set gets (moveRingColors) */
    function ringPatch(t) {
        if (!isObj(t)) return false;
        var k = Object.keys(t);
        return k.length > 0 && k.every(function (x) { return RING_KEYS.indexOf(x) >= 0; });
    }
    /* A set saved while "Video skins volume" (volVideo) existed, or with settings that became one
     * choice since ("Short mass" + "Mass format", the two stats position switches): the core's own migration (lmFoldLegacySettings)
     * folds them (on a copy) before the check drops or refits the old values, so an old set with
     * the video skins muted stays muted and one with Short mass keeps its mass text. */
    var LEGACY_KEYS = ['volVideo', 'massFormat', 'shortMass', 'statsPosition', 'fpsAtTop', 'statsAtCenter'];
    function foldLegacySettings(s) {
        if (!isObj(s) || !LEGACY_KEYS.some(function (k) { return own.call(s, k); })) return s;
        var fold = typeof window.lmFoldLegacySettings === 'function' ? window.lmFoldLegacySettings : null;
        if (!fold && own.call(s, 'volVideo') && typeof window.lmFoldVideoVolume === 'function') fold = window.lmFoldVideoVolume;
        if (!fold) return s;
        var c = Object.assign({}, s);
        try { fold(c); } catch (e) { return s; }
        return c;
    }
    function cleanBundle(b) {
        if (!isObj(b)) return null;
        var out = {}, any = false;
        for (var p in PART_FNS) {
            if (!own.call(PART_FNS, p)) continue;
            var c = PART_FNS[p](p === 's' ? foldLegacySettings(b[p]) : b[p]);
            if (c) { out[p] = c; any = true; }
        }
        if (moveRingColors(out) || out.t) any = !!(out.s || out.t || out.h || out.m);
        if (out.h) { var k = cleanKnown(b.k); if (k) out.k = k; }
        /* phone preferences that did not exist (Undo / backups): restoring them removes the store */
        if (isAbsent(b.m)) { out.m = absentPart(); any = true; }
        /* P0 fix: pass through mobile layouts (ml) and gamepad config (gp) without
         * a validator — they are opaque blobs validated by their own modules on load.
         * cleanBundle used to silently strip them because PART_FNS only knew s/t/h/m. */
        if (isObj(b.ml)) { out.ml = b.ml; any = true; }
        if (isObj(b.gp)) { out.gp = b.gp; any = true; }
        var zb = cleanZoomMarks(b.zb);
        if (zb) { out.zb = zb; any = true; }
        /* hl: the active HUD layout; pb: Performance mode's copy of the effect settings it
         * turned off (only with gameplay settings that have the mode on) */
        var hl = cleanLayoutName(b.hl);
        if (hl !== undefined) { out.hl = hl; any = true; }
        if (out.s) { var pb = cleanMap(b.pb, settingValue, 40); if (pb) out.pb = pb; }
        return any ? out : null;
    }
    function cleanName(n) {
        return typeof n === 'string' ? n.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX) : '';
    }
    function cleanProfile(p) {
        if (!isObj(p)) return null;
        var id = typeof p.id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(p.id) ? p.id : null;
        var name = cleanName(p.name);
        var data = cleanBundle(p.data);
        if (!id || !name || !data) return null;
        var out = { id: id, name: name, created: num(p.created), updated: num(p.updated), data: data };
        /* only: 'gp' a set of the gamepad buttons and tuning alone (Update keeps it that way) */
        if (p.only === 'gp') out.only = 'gp';
        /* src: the old Gamepad window setup it was made from (the move is not done twice) */
        if (typeof p.src === 'string' && /^g[0-9a-f]{16}$/.test(p.src)) out.src = p.src;
        /* the preset it was made from (the old built-in templates are presets now) */
        var tpl = typeof p.tpl === 'string' && has(TPL_OLD, p.tpl) ? TPL_OLD[p.tpl] : p.tpl;
        if (typeof tpl === 'string' && /^[A-Za-z][A-Za-z0-9]{0,30}$/.test(tpl)) out.tpl = tpl;
        return out;
    }
    function cleanProfiles(raw) {
        if (!Array.isArray(raw)) return [];
        var seen = Object.create(null), out = [];
        for (var i = 0; i < raw.length && out.length < MAX_PROFILES; i++) {
            var p = cleanProfile(raw[i]);
            if (!p || seen[p.id]) continue;
            seen[p.id] = true;
            out.push(p);
        }
        return out;
    }
    var REASONS = { change: 1, profile: 1, import: 1, reset: 1, restore: 1, undo: 1, manual: 1 };
    function cleanBackup(b) {
        if (!isObj(b)) return null;
        var t = num(b.t), data = cleanBundle(b.data);
        if (!t || !data) return null;
        var out = { t: t, reason: has(REASONS, b.reason) ? b.reason : 'change', data: data };
        var label = cleanName(b.label);
        if (label) out.label = label;
        return out;
    }
    function cleanBackups(raw) {
        if (!Array.isArray(raw)) return [];
        var out = [];
        for (var i = 0; i < raw.length && i < 50; i++) {
            var b = cleanBackup(raw[i]);
            if (b) out.push(b);
        }
        out.sort(function (a, b) { return b.t - a.t; });
        return out.slice(0, MAX_BACKUPS);
    }
    /* The new list after adding a backup: newest first, at most `max`, at most `maxChars` of JSON
     * (the oldest go first). A backup identical to the newest one is not added again; one that is
     * too large on its own is not kept. */
    function pushBackup(list, entry, max, maxChars) {
        list = (list || []).slice();
        if (!entry || !entry.data) return list;
        var text = JSON.stringify(entry.data);
        if (text.length > MAX_ENTRY_CHARS) return list;
        if (list.length && JSON.stringify(list[0].data) === text) return list;
        list.unshift(entry);
        if (list.length > (max || MAX_BACKUPS)) list.length = max || MAX_BACKUPS;
        while (list.length > 1 && JSON.stringify(list).length > (maxChars || MAX_BACKUPS_CHARS)) list.pop();
        return list;
    }
    /* Hotkey commands added after a profile was saved get their default key when it is free (as
     * addMissingDefaultHotkeys does on load); commands the profile knew stay as it has them. */
    function fillNewDefaults(h, known, commands) {
        var out = clone(h) || {};
        if (!Array.isArray(known) || !isObj(commands)) return out;
        var knownSet = {}, bound = {};
        known.forEach(function (c) { knownSet[c] = true; });
        for (var key in out) if (own.call(out, key) && key !== '' && key !== 'spec-messageKey') bound[out[key]] = true;
        for (var c in commands) {
            if (!own.call(commands, c) || knownSet[c] || bound[c]) continue;
            var dk = commands[c] && commands[c].defaultKey;
            if (typeof dk === 'string' && dk && !own.call(out, dk)) out[dk] = c;
        }
        return out;
    }

    /* ── Comparison ── */
    function hotkeysByCommand(h) {
        var out = {};
        for (var k in h) {
            if (!own.call(h, k) || k === '') continue;
            var c = k === 'spec-messageKey' ? 'spec-messageKey' : h[k];
            var v = k === 'spec-messageKey' ? h[k] : k;
            (out[c] || (out[c] = [])).push(v);
        }
        for (var c2 in out) if (own.call(out, c2)) out[c2].sort();
        return out;
    }
    function same(a, b) { return a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-9); }
    /* Every setting that differs between two sets, as { part, key, label, a, b }. A part is compared
     * only when both sets have it, a key only when both have it (a missing key is not applied, so it
     * changes nothing). Hotkeys are compared per command (its keys, '' when unbound). */
    function diffBundles(a, b, labelFn) {
        var rows = [];
        if (!a || !b) return rows;
        labelFn = typeof labelFn === 'function' ? labelFn : function (p, k) { return k; };
        ['s', 't', 'm'].forEach(function (p) {
            if (p === 'm' && isAbsent(b.m)) {
                /* back to "no phone preferences saved": a change only when some are saved now */
                if (isObj(a.m) && !isAbsent(a.m) && Object.keys(a.m).length) rows.push({ part: 'm', key: 'm', label: labelFn('m', 'm'), a: a.m, b: null });
                return;
            }
            /* phone preferences never saved on this device yet: every value of the set is new */
            var ap = p === 'm' && (!isObj(a.m) || isAbsent(a.m)) ? {} : a[p];
            if (!isObj(ap) || !isObj(b[p])) return;
            var part = [];
            for (var k in b[p]) {
                if (!own.call(b[p], k)) continue;
                /* P1 fix: include keys that exist in the profile but not in current settings —
                 * new profile options should be applied, not silently skipped */
                var av = own.call(ap, k) ? ap[k] : undefined;
                if (!same(av, b[p][k])) part.push({ part: p, key: k, label: labelFn(p, k), a: av, b: b[p][k] });
            }
            part.sort(function (x, y) { return String(x.label).localeCompare(String(y.label)); });
            rows = rows.concat(part);
        });
        if (isObj(a.h) && isObj(b.h)) {
            var ha = hotkeysByCommand(a.h), hb = hotkeysByCommand(b.h), seen = Object.create(null), part = [];
            Object.keys(ha).concat(Object.keys(hb)).forEach(function (c) {
                if (seen[c]) return;
                seen[c] = true;
                var ka = (ha[c] || []).join(', '), kb = (hb[c] || []).join(', ');
                if (ka !== kb) part.push({ part: 'h', key: c, label: labelFn('h', c), a: ka, b: kb });
            });
            part.sort(function (x, y) { return String(x.label).localeCompare(String(y.label)); });
            rows = rows.concat(part);
        }
        /* the parts applied as a whole (their own modules check them): compared when the set
         * being applied has one, also when the other side has none yet */
        EXTRA_PARTS.forEach(function (p) {
            if (!has(b, p)) return;
            var ha = has(a, p);
            if (!ha || JSON.stringify(a[p]) !== JSON.stringify(b[p])) rows.push({ part: p, key: p, label: labelFn(p, p), a: ha ? a[p] : null, b: b[p] });
        });
        /* Performance mode's copy of the effect settings it turned off: with the mode on in both,
         * the same settings with another copy are still a change (turning the mode off later puts
         * the copy back); a set without a copy removes the current one */
        if (isObj(a.s) && isObj(b.s) && a.s.performanceMode === true && b.s.performanceMode === true) {
            var pa = isObj(a.pb) ? a.pb : null, pbb = isObj(b.pb) ? b.pb : null;
            if (stableJSON(pa) !== stableJSON(pbb)) rows.push({ part: 'pb', key: 'pb', label: labelFn('pb', 'pb'), a: pa, b: pbb });
        }
        return rows;
    }
    var EXTRA_PARTS = ['hl', 'zb', 'ml', 'gp'];
    /* a set as it is applied: hotkey commands newer than the set get their default key */
    function effective(b, commands) {
        if (!b || !isObj(b.h)) return b;
        var out = Object.assign({}, b);
        out.h = fillNewDefaults(b.h, b.k, commands === undefined ? window.hotkeysCommand : commands);
        return out;
    }
    function countParts(rows) {
        var c = { s: 0, t: 0, h: 0, m: 0, hl: 0, zb: 0, ml: 0, gp: 0, pb: 0 };
        rows.forEach(function (r) { c[r.part] = (c[r.part] || 0) + 1; });
        return c;
    }

    /* ── Starter setups: the presets of Settings (the Presets row; application.lmPresets in
     * ogario.v4.js), one list for both. A profile from a preset is the current settings with that
     * preset's changes. Only keys that exist in the shipped gameplay defaults are used (checked
     * again when the profile is applied). ── */
    function presets() {
        var a = window.application;
        return a && isObj(a.lmPresets) ? a.lmPresets : {};
    }
    /* the old built-in templates that a preset replaced (the others kept their id) */
    var TPL_OLD = { streaming: 'streamer', mobile: 'battery' };
    /* a text of the shared packs that is not under modules.profiles. ('' when missing) */
    function gt(key) {
        var s = typeof window.lmT === 'function' ? window.lmT(key) : '';
        return s && s !== key ? s : '';
    }
    function templateName(id) {
        var p = presets();
        return has(p, id) && isObj(p[id]) ? gt(p[id].key) || p[id].en || id : id;
    }
    /* the label of a setting that has no menu label, from a preset that sets it */
    function presetLabel(key) {
        var p = presets();
        for (var id in p) {
            if (has(p, id) && isObj(p[id]) && isObj(p[id].lbl) && has(p[id].lbl, key)) return gt(p[id].lbl[key]);
        }
        return '';
    }
    /* a set based on `base` with the preset's gameplay changes on top: { data, keys } */
    function applyTemplate(base, id) {
        var all = presets();
        var t = has(all, id) && isObj(all[id]) && isObj(all[id].set) ? all[id] : null;
        var data = clone(base) || {};
        if (!t) return { data: cleanBundle(data), keys: [] };
        data.s = isObj(data.s) ? data.s : {};
        var keys = [];
        for (var k in t.set) {
            if (!own.call(t.set, k)) continue;
            var v = settingValue(k, t.set[k]);
            if (v === undefined) continue;
            data.s[k] = v;
            keys.push(k);
        }
        return { data: cleanBundle(data), keys: keys };
    }

    /* ── Automatic switching rules ── */
    var SERVER_TYPES = [['agario', 'Agar.io'], ['expandingland', 'Expanding Land'], ['deltio', 'Delt.io'], ['agar2', 'Agar2'], ['imsolo', 'Imsolo'], ['garix', 'Garix'], ['sigmally', 'Sigmally'], ['senpa', 'Senpa'], ['private', 'serverPrivate', 1]];
    var GAME_MODES = [[':ffa', 'mode.ffa', 1], [':teams', 'mode.teams', 1], [':experimental', 'mode.experimental', 1], [':party', 'mode.party', 1], [':battleroyale', 'mode.battleroyale', 1], [':expandingland', 'Expanding Land']];
    var DEVICES = [['gamepad', 'devGamepad', 1], ['touch', 'devTouch', 1], ['desktop', 'devDesktop', 1]];
    /* [value, label, 1 when the label is a text key] (server names are proper names) */
    function ruleLabel(v) { return v[2] ? tx(v[1]) : v[1]; }
    var RULE_GROUPS = [['server', SERVER_TYPES], ['mode', GAME_MODES], ['device', DEVICES]];
    function cleanRules(raw, profiles) {
        var out = { enabled: false, server: {}, mode: {}, device: {} };
        if (!isObj(raw)) return out;
        var ids = null;
        if (Array.isArray(profiles)) { ids = {}; profiles.forEach(function (p) { ids[p.id] = true; }); }
        out.enabled = raw.enabled === true;
        RULE_GROUPS.forEach(function (g) {
            var src = isObj(raw[g[0]]) ? raw[g[0]] : {};
            g[1].forEach(function (v) {
                var id = src[v[0]];
                if (typeof id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(id) && (!ids || ids[id])) out[g[0]][v[0]] = id;
            });
        });
        return out;
    }
    /* The rule that applies in ctx { serverType, gameMode, touch, gamepad }: the server type first,
     * then the game mode, then the input device (a connected gamepad before touch / desktop). */
    function pickRule(rules, ctx) {
        if (!rules || !rules.enabled || !ctx) return null;
        if (ctx.serverType && has(rules.server, ctx.serverType)) return { id: rules.server[ctx.serverType], group: 'server', value: ctx.serverType };
        if (ctx.gameMode && has(rules.mode, ctx.gameMode)) return { id: rules.mode[ctx.gameMode], group: 'mode', value: ctx.gameMode };
        if (ctx.gamepad && has(rules.device, 'gamepad')) return { id: rules.device.gamepad, group: 'device', value: 'gamepad' };
        var dev = ctx.touch ? 'touch' : 'desktop';
        if (has(rules.device, dev)) return { id: rules.device[dev], group: 'device', value: dev };
        return null;
    }

    /* ── Storage ── */
    function store() { try { return window.localStorage || null; } catch (e) { return null; } }
    function readJSON(key) {
        try {
            var s = store();
            var t = s && s.getItem(key);
            return t ? JSON.parse(t) : null;
        } catch (e) { return null; }
    }
    function writeText(key, text) {
        try { var s = store(); if (!s) return false; s.setItem(key, text); return true; } catch (e) { return false; }
    }
    function removeKey(key) { try { var s = store(); if (s) s.removeItem(key); } catch (e) { } }
    /* Writes [{ key, text }] (text null removes) all or nothing, like the settings import: on a
     * failure (storage full) what was written goes first, then the old values are put back. */
    function writeTransaction(entries, storage) {
        var s = storage || store();
        if (!s) return false;
        var backup = {}, touched = [];
        try {
            entries.forEach(function (e) {
                if (!own.call(backup, e.key)) { backup[e.key] = s.getItem(e.key); touched.push(e.key); }
                if (e.text === null) s.removeItem(e.key);
                else s.setItem(e.key, e.text);
            });
            return true;
        } catch (err) {
            touched.forEach(function (k) { try { s.removeItem(k); } catch (e2) { } });
            touched.forEach(function (k) {
                if (backup[k] === null) return;
                try { s.setItem(k, backup[k]); } catch (e3) { }
            });
            return false;
        }
    }
    function loadProfiles() { return cleanProfiles(readJSON(KEY_PROFILES)); }
    function saveProfiles(list) {
        var text = JSON.stringify(list);
        if (text.length > MAX_PROFILES_CHARS) { toast('error', tx('tooBig')); return false; }
        if (!writeText(KEY_PROFILES, text)) { toast('error', tx('storageFull')); return false; }
        return true;
    }
    function loadRules() { return cleanRules(readJSON(KEY_RULES), loadProfiles()); }
    function loadBackups() { return cleanBackups(readJSON(KEY_BACKUPS)); }
    /* storage-full safe: drops the oldest backups until the list fits; never throws */
    function saveBackups(list, storage) {
        list = list.slice();
        for (; ;) {
            var ok;
            try { (storage || store()).setItem(KEY_BACKUPS, JSON.stringify(list)); ok = true; } catch (e) { ok = false; }
            if (ok) return list;
            if (!list.length) return null;
            list.pop();
        }
    }
    function addBackup(reason, data, label) {
        data = cleanBundle(data);
        if (!data) return false;
        var before = loadBackups();
        var entry = { t: Date.now(), reason: has(REASONS, reason) ? reason : 'change', data: data };
        if (label) entry.label = cleanName(label);
        var list = pushBackup(before, entry, MAX_BACKUPS, MAX_BACKUPS_CHARS);
        if (list.length === before.length && list[0] === before[0]) return false;
        return !!saveBackups(list);
    }
    function newId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

    /* ── Gamepad-only sets: the buttons (lmGamepad) and the gamepad tuning settings, nothing
     * else. They replace the named profiles the Gamepad window had (lmGamepad.profiles). ── */
    /* the tuning settings of ogario/gamepad.js (the gamepad* gameplay settings but the on switch) */
    function gpKeys() {
        var d = window.LM_SETTINGS_DEFAULTS || {};
        return Object.keys(d).filter(function (k) { return /^gamepad[A-Z]/.test(k) && k !== 'gamepadEnabled'; });
    }
    /* lmGamepad without the old named-profile list (that list lives here now); a store that only
     * held the list (kept while the list could not be moved) has no buttons: none */
    function readGamepad() {
        var g = readJSON('lmGamepad');
        if (isObj(g) && has(g, 'profiles')) {
            g = Object.assign({}, g);
            delete g.profiles;
            if (!has(g, 'map')) return null;
        }
        return g;
    }
    /* a button map as stored: index -> action name (ogario/gamepad.js checks it again on load) */
    function cleanPadMap(m) {
        var out = {};
        if (!isObj(m)) return out;
        for (var i = 0; i < 16; i++) {
            var v = m[String(i)];
            if (typeof v === 'string' && /^(?:[A-Za-z0-9]{1,30}|hk-[A-Za-z0-9_-]{1,40})$/.test(v)) out[i] = v;
        }
        return out;
    }
    /* a gamepad-only set from a button map and tuning values ({ gamepadDeadzone: 0.2, ... }) */
    function gamepadSet(map, opts) {
        var s = {};
        gpKeys().forEach(function (k) {
            if (!isObj(opts) || !has(opts, k)) return;
            var v = settingValue(k, opts[k]);
            if (v !== undefined) s[k] = v;
        });
        var d = { gp: { v: 1, map: cleanPadMap(map) } };
        if (Object.keys(s).length) d.s = s;
        return cleanBundle(d);
    }
    /* the current gamepad buttons and tuning. The buttons in use come from ogario/gamepad.js (a
     * button changed while the storage was full is only there), else from the storage, checked
     * by the gamepad file's own validator when it is loaded. */
    function captureGamepad() {
        var live = S(), G = window.LMGamepad, map = null, o = {};
        if (live && typeof live.toJSON === 'function') live = live.toJSON();
        gpKeys().forEach(function (k) { if (live && has(live, k)) o[k] = live[k]; });
        try { if (G && typeof G.getMap === 'function') map = G.getMap(); } catch (e) { map = null; }
        if (!isObj(map)) {
            var g = readGamepad();
            map = isObj(g) ? g.map : null;
            try { if (map && G && typeof G._cleanConfig === 'function') map = G._cleanConfig({ map: map }).map; } catch (e) { }
        }
        return gamepadSet(map, o);
    }

    /* ── The old named setups of the Gamepad window ({ name, map, opts }) ── */
    /* FNV-1a over a text: two seeds make the 64-bit identity of an old setup */
    function hash32(t, h) {
        for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
        return ('0000000' + (h >>> 0).toString(16)).slice(-8);
    }
    /* an old setup as kept until it is a profile: its name, buttons and tuning values, and an id
     * made of them (the same setup found again has the same id). null when it has no name. */
    function legacyItem(g) {
        if (!isObj(g)) return null;
        var name = cleanName(typeof g.name === 'string' ? g.name.replace(/[<>]/g, '') : '');
        if (!name) return null;
        var map = cleanPadMap(g.map), opts = {};
        if (isObj(g.opts)) Object.keys(g.opts).sort().forEach(function (k) {
            var v = g.opts[k];
            if (/^gamepad[A-Z][A-Za-z0-9]{0,40}$/.test(k) && (typeof v === 'boolean' || (typeof v === 'number' && isFinite(v)))) opts[k] = v;
        });
        var t = JSON.stringify([name, map, opts]);
        return { sid: 'g' + hash32(t, 2166136261) + hash32(t, 3735928559), name: name, map: map, opts: opts };
    }
    function readPending() {
        var raw = readJSON(KEY_GP_PENDING), out = [], seen = Object.create(null);
        var list = isObj(raw) && Array.isArray(raw.items) ? raw.items : [];
        for (var i = 0; i < list.length && out.length < 200; i++) {
            var it = legacyItem(list[i]);
            if (!it || seen[it.sid]) continue;
            seen[it.sid] = true;
            out.push(it);
        }
        return out;
    }
    function writePending(items) {
        if (!items.length) { removeKey(KEY_GP_PENDING); return readJSON(KEY_GP_PENDING) === null; }
        return writeText(KEY_GP_PENDING, JSON.stringify({ v: 1, items: items.map(function (it) { return { name: it.name, map: it.map, opts: it.opts }; }) }));
    }
    /* Takes the old list out of lmGamepad into the pending store (nothing leaves lmGamepad
     * before the store has it). Returns the pending setups, or null when the store could not be
     * written (the list then stays in lmGamepad and the next try moves it). */
    function stashLegacyGamepad() {
        var pend = readPending(), raw = readJSON('lmGamepad');
        if (!isObj(raw) || !has(raw, 'profiles')) return pend;
        var seen = Object.create(null), add = 0;
        pend.forEach(function (it) { seen[it.sid] = true; });
        (Array.isArray(raw.profiles) ? raw.profiles : []).forEach(function (g) {
            var it = legacyItem(g);
            if (!it || seen[it.sid]) return;
            seen[it.sid] = true;
            pend.push(it);
            add++;
        });
        if (add && !writePending(pend)) return null;
        /* the gamepad file drops its copy of the list and saves the buttons in use; without it
         * the stored buttons are written back without the list and read again */
        var G = window.LMGamepad;
        try {
            if (G && typeof G._dropLegacy === 'function') G._dropLegacy();
            else {
                var rest = Object.assign({}, raw);
                delete rest.profiles;
                if (writeText('lmGamepad', JSON.stringify(rest)) && G && typeof G._reload === 'function') G._reload();
            }
        } catch (e) { }
        return pend;
    }
    /* Makes gamepad-only Settings profiles of the old named setups. Each keeps its name (a taken
     * name gets a number); a setup is left out only when it is a profile already: one made from
     * it (src), or one of the same name (or that name numbered) with the same buttons and tuning.
     * What does not fit (50 profiles) waits in the pending store for a free place. Nothing is
     * removed before the profiles are saved, so a full storage loses nothing: the next try goes
     * on where this one stopped. Returns how many moved. */
    function migrateGamepadProfiles() {
        var pend = stashLegacyGamepad();
        /* the tuning values are checked by the core's schema: without it they would be dropped */
        if (!pend || !pend.length || typeof window.lmSettingValue !== 'function') return 0;
        var list = loadProfiles(), now = Date.now(), added = 0, left = [], src = Object.create(null);
        list.forEach(function (p) { if (p.src) src[p.src] = true; });
        pend.forEach(function (it) {
            if (src[it.sid]) return;
            var data = gamepadSet(it.map, it.opts);
            if (!data) return;
            var dj = JSON.stringify(data), ln = it.name.toLowerCase();
            if (list.some(function (p) {
                var pn = p.name.toLowerCase();
                return p.only === 'gp' && (pn === ln || (pn.indexOf(ln) === 0 && /^ \d{1,2}$/.test(pn.slice(ln.length)))) && JSON.stringify(p.data) === dj;
            })) return;
            if (list.length >= MAX_PROFILES) { left.push(it); return; }
            list.push({ id: newId(), name: uniqueName(it.name, list), created: now, updated: now, data: data, only: 'gp', src: it.sid });
            src[it.sid] = true;
            added++;
        });
        if (added && !saveProfiles(list)) return 0;
        /* when this write fails they stay pending, and the next try finds them by src */
        if (left.length !== pend.length) writePending(left);
        return added;
    }
    /* how many old setups wait for a free place */
    function pendingGamepadCount() { return readPending().length; }
    /* The text lmGamepad gets when a set is applied: an old list that could not be moved yet
     * (storage full) stays with the new buttons (it is not part of the set). */
    function gamepadText(gp) {
        var raw = readJSON('lmGamepad'), v = isAbsent(gp) ? null : gp;
        var keep = isObj(raw) && Array.isArray(raw.profiles) && raw.profiles.length ? raw.profiles : null;
        if (!keep) return v ? JSON.stringify(v) : null;
        var out = Object.assign({ v: 1 }, v || {});
        out.profiles = (Array.isArray(out.profiles) ? out.profiles : []).concat(keep);
        return JSON.stringify(out);
    }
    /* the settings export: old setups that are still waiting travel in the old list, so an import
     * (here or on another device) brings them back to the pending store */
    function exportGamepad(v) {
        var pend = readPending();
        if (!pend.length) return v;
        var out = Object.assign({ v: 1 }, isObj(v) ? v : {}), have = Object.create(null);
        out.profiles = Array.isArray(out.profiles) ? out.profiles.slice() : [];
        out.profiles.forEach(function (g) { var it = legacyItem(g); if (it) have[it.sid] = true; });
        pend.forEach(function (it) { if (!have[it.sid]) out.profiles.push({ name: it.name, map: it.map, opts: it.opts }); });
        return out;
    }

    /* ── The live settings ── */
    function S() { return window.legendmod5 || window.defaultmapsettings || null; }
    function T() { return window.defaultSettings || null; }
    function jq() { return window.jQuery || window.$ || null; }
    function ready() { return !!(window.application && S() && T() && jq() && typeof window.lmSettingValue === 'function'); }
    /* the current settings (in memory); parts { t, h, m } false leave a part out */
    function captureCurrent(parts) {
        parts = parts || {};
        /* P0 fix: when adaptive performance has lowered settings, use the player's
         * original values instead of the temporarily reduced ones. perf.js exposes
         * overrides.userView() for this, but profiles.js reads properties directly
         * from the live object. Use the toJSON() that perf.js installs, or fall
         * back to a plain copy if adaptive perf is not active. */
        var liveS = S();
        var sData;
        if (liveS && typeof liveS.toJSON === 'function') {
            sData = liveS.toJSON();
        } else {
            sData = liveS;
        }
        /* without the theme the gameplay copy of the ring colours stays out (it would be taken
         * for the colours of a set saved before they moved to the theme) */
        if ((parts.t === false || !T()) && isObj(sData) && RING_KEYS.some(function (k) { return own.call(sData, k); })) {
            sData = Object.assign({}, sData);
            RING_KEYS.forEach(function (k) { delete sData[k]; });
        }
        var data = { s: sData };
        if (parts.t !== false && T()) {
            var t = Object.assign({}, T());
            /* the enlarged minimap (hotkey) is temporary: its normal width, as the export does */
            var orig = window.Settings && window.Settings._lmMiniBigOrig;
            if (orig) { t.miniMapWidth = orig; t.miniMapTop = Math.round(20 * orig / 200); }
            data.t = t;
        }
        if (parts.h !== false && isObj(window.hotkeys)) {
            data.h = window.hotkeys;
            if (isObj(window.hotkeysCommand)) data.k = Object.keys(window.hotkeysCommand);
        }
        if (parts.m !== false) data.m = readJSON('lm-mobile-prefs');
        if (parts.m !== false) data.ml = readJSON('lm-mobile-layouts');
        if (parts.g !== false) data.gp = readGamepad();
        /* P2 fix #97: include zoom bookmarks in the profile snapshot */
        data.zb = readJSON('lm-zoom-bookmarks');
        /* the active HUD layout (backups and Undo; a profile brings one only through its link) */
        if (parts.hl !== false) {
            var HE = window.LMHudEditor;
            try { if (HE && typeof HE.active === 'function') data.hl = HE.active() || ''; } catch (e) { }
        }
        if (sData && sData.performanceMode === true) data.pb = readJSON('lmPerfBackup');
        if (parts.explicit) markMissing(data, parts.m !== false, parts.g !== false);
        else if (noZoomMarks(cleanZoomMarks(data.zb))) delete data.zb;
        return cleanBundle(data);
    }
    /* Update: the current settings in the parts the set has. The theme part of an old
     * gameplay-only set is just its ring colours (moveRingColors): only those colours are
     * updated, the set never gets the whole theme. */
    function updatedSet(d) {
        var patch = ringPatch(d.t);
        var data = captureCurrent({ t: !!d.t && !patch, h: !!d.h, m: !!(d.m || d.ml), g: !!d.gp, hl: false });
        if (data && patch) {
            var live = T(), t = {};
            Object.keys(d.t).forEach(function (k) {
                var v = themeValue(k, live && own.call(live, k) ? live[k] : d.t[k]);
                if (v !== undefined) t[k] = v;
            });
            if (Object.keys(t).length) data.t = t;
        }
        return data;
    }
    /* the saved settings (what a reload would load): the state before a change that is being saved */
    function snapshotFromStorage() {
        /* P2 fix #82: guard against empty {} in storage bypassing defaults.
         * readJSON can return {} which is truthy but has no keys. */
        var s = readJSON('ogarioSettings');
        if (!s || !Object.keys(s).length) s = window.LM_SETTINGS_DEFAULTS;
        var t = readJSON('ogarioThemeSettings');
        if (!t || !Object.keys(t).length) t = window.LM_THEME_DEFAULTS;
        var hud = readJSON('lmHudLayouts');
        return cleanBundle(markMissing({
            s: s,
            t: t,
            h: readJSON('ogarioHotkeys'),
            k: readJSON('ogarioHotkeysKnown'),
            m: readJSON('lm-mobile-prefs'),
            ml: readJSON('lm-mobile-layouts'),
            gp: readGamepad(),
            /* P2 fix #97: include zoom bookmarks in storage snapshot */
            zb: readJSON('lm-zoom-bookmarks'),
            hl: window.LMHudEditor ? (isObj(hud) && typeof hud.active === 'string' ? hud.active : '') : undefined,
            pb: s && s.performanceMode === true ? readJSON('lmPerfBackup') : null
        }, true));
    }
    function label(part, key) {
        if (EXTRA_PARTS.indexOf(part) >= 0 || part === 'pb') return tx(PART_NAMES[part]);
        var tl = window.textLanguage || {};
        /* gamepad tuning: the labels of the Gamepad window */
        if (part === 's' || part === 't') return stripTags(tl[key]) || (part === 's' && (presetLabel(key) || gt('modules.gamepadui.' + key))) || key;
        if (part === 'm') {
            if (!has(MOBILE_SCHEMA, key)) return key;
            /* the later phone preferences are named in the phone controls' own texts (pkg.agm.m_<key>) */
            var I18 = window.LMi18n, pk = 'pkg.agm.m_' + key; /* i18n-ok: a text key */
            if (I18 && typeof I18.has === 'function' && !I18.has(P + 'm_' + key) && I18.has(pk)) return window.lmT(pk);
            return tx('m_' + key);
        }
        if (key === 'spec-messageKey') return tx('chatKey');
        var c = window.hotkeysCommand && window.hotkeysCommand[key], l = '';
        try { l = c && c.label; } catch (e) { }
        if (c && c.type === 'command' && window.chatCommand) {
            var t = window.chatCommand[String(key).replace('hk-', '')];
            if (t) l = t;
        }
        return stripTags(l) || key;
    }
    function fmt(v, part) {
        if (v === true) return tx('on');
        if (v === false) return tx('off');
        if (part === 'h' && v === '') return tx('none');
        if (part === 'hl') return v ? String(v) : tx('defaultHud');
        if (v == null || isAbsent(v) || noZoomMarks(v)) return tx('none');
        var s = Array.isArray(v) ? v.join(', ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
        return s.length > 60 ? s.slice(0, 57) + '...' : s;
    }
    function toast(kind, html) {
        var t = window.toastr;
        if (!t) return;
        try { (t[kind] || t.info).call(t, '<b>[' + esc(tx('tag')) + ']:</b> ' + html); } catch (e) { }
    }
    /* "3 settings (Opponent colours, Split range, Show mass), 1 hotkeys" */
    function summary(c, rows) {
        var parts = [];
        if (c.s) {
            var names = (rows || []).filter(function (r) { return r.part === 's'; }).map(function (r) { return r.label; });
            parts.push(tx('cntS', c.s) + (names.length ? ' (' + names.slice(0, 4).join(', ') + (names.length > 4 ? ', ...' : '') + ')' : ''));
        }
        if (c.t) parts.push(tx('cntT', c.t));
        if (c.h) parts.push(tx('cntH', c.h));
        if (c.m) parts.push(tx('cntM', c.m));
        var hl = (rows || []).filter(function (r) { return r.part === 'hl'; })[0];
        if (hl) parts.push(tx('cntHL', fmt(hl.b, 'hl')));
        if (c.zb) parts.push(tx('cntZB'));
        if (c.ml) parts.push(tx('cntML'));
        if (c.gp) parts.push(tx('cntGP'));
        if (c.pb) parts.push(tx('cntPB'));
        return parts.join(', ');
    }

    /* these switches call their own updater */
    var AFTER = { streamMode: 'setStreamMode', hideSkinUrl: 'setHideSkinUrl' };
    /* settings that take effect on the next load (their own options say so) */
    var RELOAD_KEYS = { glAntialias: 1, webgl2Acceleration: 1 };
    /* One gameplay setting through its control, as the presets do. */
    function setOpt(k, v) {
        var $ = jq(), s = S(), app = window.application;
        var el = document.getElementById(k);
        if (el && el.type === 'checkbox' && $(el).closest('#og-options').length) {
            v = !!v;
            if (el.checked !== v) {
                el.checked = v;
                /* the bubbling change runs setSettings (side effects, save) and moves the Switchery */
                try { el.dispatchEvent(new Event('change', { bubbles: true })); return; } catch (e) { }
            }
            if (s[k] !== v && app && app.setSettings) app.setSettings(k, v);
            return;
        }
        /* a dropdown of Settings (Mass format): setSettings applies it, saves and shows it */
        if (el && el.tagName === 'SELECT' && $(el).closest('#og-options').length && app && app.setSettings) { app.setSettings(k, v); return; }
        var sl = $('#' + k + '-slider');
        /* also a gameplay slider shown in the Theme tab (HUD text size, Theme > HUD) */
        if (sl.length && sl.closest('#og-options, #theme').length) { sl.val(v).trigger('input').trigger('change'); return; }
        /* a text box (chat filter, sound URLs): its change handler applies and saves */
        if (el && el.tagName === 'INPUT' && typeof v === 'string' && el.parentNode && $(el.parentNode).hasClass('input-box')) {
            el.value = v;
            $(el).trigger('change');
            return;
        }
        s[k] = v;
        if (window.ogario && has(window.ogario, k)) window.ogario[k] = v;
        if (AFTER[k] && app && typeof app[AFTER[k]] === 'function') { try { app[AFTER[k]](); } catch (e) { } }
    }
    /* One theme value, as a theme preset sets it (Settings.changePreset); setTheme runs after all. */
    function setThemeOpt(k, v) {
        var $ = jq(), d = T();
        d[k] = v;
        if (window.ogario && has(window.ogario, k)) window.ogario[k] = v;
        try {
            var pk = $('#theme .' + k + '-picker');
            if (pk.length && pk.colorpicker) pk.colorpicker('setValue', v);
        } catch (e) { }
        d[k] = v;
        var sl = $('#' + k + '-slider');
        if (sl.length && sl.closest('#theme').length) { sl.val(v).change(); $('#' + k + '-value').text(v); }
        var box = $('#theme input[type=text]#' + k + ', #theme select#' + k);
        if (box.length) box.val(v);
    }
    function applyHotkeysLive(h) {
        var hs = window.legendmod6;
        window.hotkeys = clone(h);
        try { if (hs && hs.migrateBrowserSpecificHotkeys) hs.migrateBrowserSpecificHotkeys(); } catch (e) { }
        try { if (hs && hs.syncMessageKey) hs.syncMessageKey(); } catch (e) { }
        try {
            if (hs && hs.openSnapshot) hs.openSnapshot = JSON.stringify(window.hotkeys);
            if (hs && hs.refreshHotkeysMenu) hs.refreshHotkeysMenu();
        } catch (e) { }
        writeText('ogarioHotkeys', JSON.stringify(window.hotkeys));
        if (isObj(window.hotkeysCommand)) writeText('ogarioHotkeysKnown', JSON.stringify(Object.keys(window.hotkeysCommand)));
    }

    var applying = false;
    var undoMem = null;
    /* Applies a set. opts: { name, reason ('profile' | 'restore' | 'undo'), auto, quiet, id }.
     * Returns the differences that were applied, or null when nothing could be applied. */
    function applyBundle(raw, opts) {
        opts = opts || {};
        if (!ready()) { toast('info', esc(tx('loading'))); return null; }
        var data = effective(cleanBundle(raw));
        if (!data) return null;
        /* a HUD layout only with the HUD editor, and only one that still exists */
        var HE = window.LMHudEditor;
        if (has(data, 'hl') && !(HE && typeof HE.storeText === 'function' && HE.storeText(data.hl) !== null)) delete data.hl;
        /* a Theme Workshop preview ends first (its theme back): otherwise the preview's theme would
         * be captured as the current one, and its timer would later roll this profile's theme back */
        try { if (window.LMThemeWorkshop && typeof window.LMThemeWorkshop.settle === 'function') window.LMThemeWorkshop.settle(); } catch (e) { }
        var cur = captureCurrent({ explicit: true });
        var rows = diffBundles(cur, data, label);
        var c = countParts(rows);
        var name = opts.name || '';
        if (!rows.length) {
            if (!opts.quiet) toast('info', esc(tx('same', name)));
            if (opts.id) writeText(KEY_LAST, opts.id);
            return rows;
        }
        var app = window.application;
        /* the old Gamepad window setups leave lmGamepad before its buttons are replaced */
        if (c.gp) stashLegacyGamepad();
        /* 1. the target state in storage, all or nothing (a full storage changes nothing) */
        var entries = [];
        /* P1 fix #26: for restore/undo operations, do not merge current settings
         * underneath the backup. Settings added after the backup was taken should
         * revert to their built-in defaults, not persist from the current state.
         * Profile-apply still merges, so switching profiles preserves new settings. */
        var isRestore = opts.reason === 'restore' || opts.reason === 'undo';
        if (c.s) entries.push({ key: 'ogarioSettings', text: JSON.stringify(isRestore ? Object.assign({}, data.s) : Object.assign({}, cur.s, data.s)) });
        /* the ring colours of an old gameplay set are a patch, never a whole theme */
        if (c.t) entries.push({ key: 'ogarioThemeSettings', text: JSON.stringify(isRestore && !ringPatch(data.t) ? Object.assign({}, data.t) : Object.assign({}, cur.t, data.t)) });
        if (c.h) entries.push({ key: 'ogarioHotkeys', text: JSON.stringify(data.h) });
        var curM = isObj(cur.m) && !isAbsent(cur.m) ? cur.m : {};
        if (c.m) entries.push({ key: 'lm-mobile-prefs', text: isAbsent(data.m) ? null : JSON.stringify(isRestore ? Object.assign({}, data.m) : Object.assign({}, curM, data.m)) });
        /* P0 fix: write mobile layouts and gamepad config when present in the profile */
        if (c.ml) entries.push({ key: 'lm-mobile-layouts', text: isAbsent(data.ml) ? null : JSON.stringify(data.ml) });
        if (c.gp) entries.push({ key: 'lmGamepad', text: gamepadText(data.gp) });
        /* P2 fix #97: restore zoom bookmarks when present in the profile */
        if (c.zb) entries.push({ key: 'lm-zoom-bookmarks', text: noZoomMarks(data.zb) ? null : JSON.stringify(data.zb) });
        /* the HUD layout is part of the same transaction (and so of the backup and the Undo) */
        if (c.hl) entries.push({ key: 'lmHudLayouts', text: HE.storeText(data.hl) });
        /* Performance mode keeps a copy of the effect settings it turned off: a set with the mode
         * on brings its own copy, and without one the copy of the replaced settings goes, so
         * turning the mode off later never puts another profile's values back */
        var curPm = !!(S() && S().performanceMode === true);
        var pbEntry = data.s && has(data.s, 'performanceMode') && data.s.performanceMode === true ?
            { key: 'lmPerfBackup', text: data.pb ? JSON.stringify(data.pb) : null } : null;
        if (pbEntry) entries.push(pbEntry);
        /* 2. a backup of the current state, and the Undo.
         * P1 fix: backup is written as part of the transaction so a failed write
         * does not leave an orphaned backup in storage. */
        var backupData = cleanBundle(cur);
        if (backupData) {
            var backupList = loadBackups();
            var backupReason = opts.reason === 'undo' ? 'undo' : opts.reason === 'restore' ? 'restore' : 'profile';
            var backupEntry = { t: Date.now(), reason: has(REASONS, backupReason) ? backupReason : 'change', data: backupData };
            if (name) backupEntry.label = cleanName(name);
            var newBackupList = pushBackup(backupList, backupEntry, MAX_BACKUPS, MAX_BACKUPS_CHARS);
            entries.push({ key: KEY_BACKUPS, text: JSON.stringify(newBackupList) });
        }
        var undoEntry = opts.reason !== 'undo' ? { t: Date.now(), name: name, data: cur } : null;
        if (undoEntry) entries.push({ key: KEY_UNDO, text: JSON.stringify(undoEntry) });
        if (!writeTransaction(entries)) {
            toast('error', esc(tx('storageFull')));
            return null;
        }
        if (undoEntry) undoMem = undoEntry;
        /* the copy Performance mode keeps in memory when the storage is full is the replaced one */
        if (pbEntry) window._lmPerfBackupMem = null;
        /* 3. live, through the controls (they save again, to the same values) */
        applying = true;
        var reload = false;
        try {
            if (app) { clearTimeout(app._lmSettingsSaveT); app._lmSettingsSaveT = null; }
            if (c.s) {
                var s = S();
                var keys = Object.keys(data.s);
                /* Performance mode first: it switches other settings, which the profile then sets */
                var pi = keys.indexOf('performanceMode');
                if (pi > 0) { keys.splice(pi, 1); keys.unshift('performanceMode'); }
                keys.forEach(function (k) {
                    var v = data.s[k];
                    /* P0 fix: when adaptive perf has lowered s[k] to the same value the
                     * profile wants, same() returns true and setOpt is skipped. Then when
                     * perf.js recovers, it restores the original, clobbering the profile.
                     * Notify perf.js via onSetting so it drops its saved override. */
                    if (!has(s, k)) return;
                    if (same(s[k], v)) {
                        if (window.LMPerf && typeof window.LMPerf.onSetting === 'function') window.LMPerf.onSetting(k);
                        return;
                    }
                    if (RELOAD_KEYS[k]) reload = true;
                    try {
                        /* one message for the whole profile, not one per option */
                        if (app && k !== 'performanceMode') app._lmPerfApplying = true;
                        setOpt(k, v);
                    } catch (e) {
                        s[k] = v;
                    } finally {
                        if (app && k !== 'performanceMode') app._lmPerfApplying = false;
                    }
                });
                try { app.saveSettings(s, 'ogarioSettings'); } catch (e) { }
            }
            if (c.t) {
                var St = window.Settings;
                /* the enlarged minimap ends: its normal width comes from the profile */
                if (St && St._lmMiniBigOrig) St._lmMiniBigOrig = 0;
                var d = T();
                for (var tk in data.t) {
                    if (own.call(data.t, tk) && has(d, tk) && !same(d[tk], data.t[tk])) {
                        try { setThemeOpt(tk, data.t[tk]); } catch (e) { d[tk] = data.t[tk]; }
                    }
                }
                try { if (St && St.setTheme) St.setTheme(); } catch (e) { reload = true; }
                try { if (St && St.saveThemeSettings) St.saveThemeSettings(); } catch (e) { }
            }
            if (c.h) applyHotkeysLive(data.h);
            /* a set from before mouse buttons were hotkeys: its mouse switches become them */
            if (c.s || c.h) {
                try {
                    var hs = window.legendmod6;
                    if (hs && typeof hs.migrateMouseControls === 'function' && hs.migrateMouseControls() && hs.refreshHotkeysMenu) hs.refreshHotkeysMenu();
                } catch (e) { }
            }
            /* gamepad buttons: what is held goes up first, then the new buttons are read */
            if (c.gp && window.LMGamepad) {
                var G = window.LMGamepad;
                try { if (typeof G.release === 'function') G.release(); if (typeof G._reload === 'function') G._reload(); else reload = true; } catch (e) { reload = true; }
            }
            /* phone preferences: the phone controls read them again and apply them now (an older
             * cached LMmobile.js without that call: from the next load) */
            if (c.m) {
                var MH = window._lmMobileHost;
                if (MH && typeof MH.reloadPrefs === 'function') { try { MH.reloadPrefs(); } catch (e) { reload = true; } }
                else if (MH) reload = true;
            }
            /* phone control layout: placed again by the control editor; without it loaded (no
             * layout before) it is used from the next load */
            if (c.ml) {
                var ME = window.LMMobileEditor;
                if (ME && typeof ME.reload === 'function') { try { ME.reload(); } catch (e) { reload = true; } }
                else if (window._lmMobileHost) reload = true;
            }
            if (c.hl) { try { if (!HE.applyLayout(data.hl, true)) reload = true; } catch (e) { reload = true; } }
            /* the mode was off: switching it on just made a copy of the replaced settings */
            if (pbEntry && !curPm) {
                var pbOk = true;
                if (pbEntry.text === null) removeKey(pbEntry.key);
                else pbOk = writeText(pbEntry.key, pbEntry.text);
                window._lmPerfBackupMem = pbOk ? null : data.pb || null;
                if (!pbOk) toast('error', esc(tx('perfBackupFail')));
            }
        } finally {
            applying = false;
            /* P1 fix #18: slider input events re-arm app._lmSettingsSaveT during the
             * apply loop. The deferred saveSettings() fires after applying = false,
             * so noteChange() creates a false 'change' backup. Cancel it again here. */
            if (app && app._lmSettingsSaveT) { clearTimeout(app._lmSettingsSaveT); app._lmSettingsSaveT = null; }
        }
        if (opts.id) writeText(KEY_LAST, opts.id);
        else if (opts.reason !== 'profile') removeKey(KEY_LAST);
        var msg;
        if (opts.reason === 'undo') msg = tx('undone', summary(c, rows));
        else if (opts.auto) msg = tx('autoApplied', opts.auto, name, summary(c, rows));
        else msg = tx('applied', name, summary(c, rows));
        var html = esc(msg) + (reload ? ' ' + esc(tx('reloadSome')) : '');
        /* the toast's own text colour on a light veil: readable on every toast colour (it was black) */
        if (opts.reason !== 'undo') html += ' <button type="button" class="btn btn-xs lm-sp-undo-btn" style="margin-left:4px;padding:0 6px;color:inherit;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.6)">' + esc(tx('undo')) + '</button>';
        toast(opts.reason === 'undo' ? 'info' : 'success', html);
        /* a set saved before the gamepad profiles moved here can bring the old list back */
        if (c.gp) migrateGamepadProfiles();
        if (isOpen()) render();
        return rows;
    }
    function findProfile(id) {
        var list = loadProfiles();
        for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
        return null;
    }
    /* a profile as it is applied: the HUD layout linked to it in the HUD editor
     * (ogario/modules/hudeditor.js) comes with it; without a link the HUD stays as it is */
    function profileData(p) {
        var d = clone(p.data) || {};
        delete d.hl;
        var HE = window.LMHudEditor;
        try { var n = HE && typeof HE.profileLayout === 'function' ? HE.profileLayout(p.id) : ''; if (n) d.hl = n; } catch (e) { }
        return d;
    }
    function applyProfile(p, opts) {
        opts = opts || {};
        return applyBundle(profileData(p), { name: p.name, reason: 'profile', id: p.id, auto: opts.auto, quiet: opts.quiet });
    }
    function loadUndo() {
        if (undoMem) return undoMem;
        var u = readJSON(KEY_UNDO);
        if (!isObj(u)) return null;
        var data = cleanBundle(u.data);
        return data ? { t: num(u.t), name: cleanName(u.name), data: data } : null;
    }
    function undo() {
        var u = loadUndo();
        if (!u) { toast('info', esc(tx('nothingUndo'))); return false; }
        var r = applyBundle(u.data, { name: u.name, reason: 'undo' });
        if (r) { undoMem = null; removeKey(KEY_UNDO); }
        if (isOpen()) render();
        return !!r;
    }
    /* hotkeys: apply the next / previous profile in the list (no confirmation; Undo in the message) */
    function applyNext(dir) {
        var list = loadProfiles();
        if (!list.length) { toast('info', esc(tx('noProfiles'))); return; }
        var last = null;
        try { last = window.localStorage.getItem(KEY_LAST); } catch (e) { }
        var i = -1;
        for (var j = 0; j < list.length; j++) if (list[j].id === last) i = j;
        var n = list.length;
        i = i < 0 ? (dir < 0 ? n - 1 : 0) : (i + (dir < 0 ? -1 : 1) + n) % n;
        applyProfile(list[i]);
    }

    /* ── Automatic backups ── */
    var lastChangeBackup = 0;
    function noteChange() {
        if (applying) return;
        var now = Date.now();
        if (now - lastChangeBackup < BACKUP_THROTTLE) return;
        lastChangeBackup = now;
        /* the saved state is still the one from before this change */
        addBackup('change', snapshotFromStorage());
    }
    function backupNow(reason) {
        if (applying) return false;
        return addBackup(reason, reason === 'manual' ? captureCurrent() : snapshotFromStorage());
    }
    function wrap(obj, name, before) {
        var orig = obj && obj[name];
        if (typeof orig !== 'function' || orig._lmSp) return;
        var w = function () {
            try { before.apply(this, arguments); } catch (e) { }
            return orig.apply(this, arguments);
        };
        w._lmSp = true;
        obj[name] = w;
    }
    function installHooks() {
        var app = window.application, St = window.Settings, hs = window.legendmod6, $ = jq();
        loadBackups().forEach(function (b) { if (b.reason === 'change' && b.t > lastChangeBackup) lastChangeBackup = b.t; });
        wrap(app, 'saveSettings', function (o, name) { if (name === 'ogarioSettings') noteChange(); });
        wrap(St, 'saveThemeSettings', noteChange);
        wrap(hs, 'saveHotkeys', noteChange);
        /* before an import or a reset: what is saved now (they replace it and reload) */
        wrap(app, 'importSettings', function () { if ($ && $('#import-settings').val()) backupNow('import'); });
        wrap(app, 'restoreSettings', function () { backupNow('reset'); });
        wrap(St, 'restoreThemeSettings', function () { backupNow('reset'); });
        /* a switch that waits for the end of a life: the menu counts too */
        wrap(app, 'showMenu', function () { if (deferredKey) evaluateSoon(300); });
    }

    /* ── Automatic switching ── */
    var lastAutoKey = null;
    function deviceCtx() {
        var touch = typeof window.isMobile === 'boolean' ? window.isMobile :
            !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(any-pointer: fine)').matches);
        var pad = false;
        try {
            var g = navigator.getGamepads ? navigator.getGamepads() : [];
            for (var i = 0; g && i < g.length; i++) if (g[i] && g[i].connected !== false) pad = true;
        } catch (e) { }
        return { touch: touch, gamepad: pad };
    }
    function ruleName(pick) {
        var list = pick.group === 'server' ? SERVER_TYPES : pick.group === 'mode' ? GAME_MODES : DEVICES;
        for (var i = 0; i < list.length; i++) if (list[i][0] === pick.value) return ruleLabel(list[i]);
        return pick.value;
    }
    /* alive in a game (the main player or a multibox unit) */
    function playingNow() {
        var L = window.legendmod;
        return !!(L && (L.play || (L.playerCellsMulti && L.playerCellsMulti.length)));
    }
    /* a switch found while playing waits for the end of that life (death, or the menu), unless
     * the player taps Apply now */
    var deferredKey = null;
    function defer(on) {
        var E = window.LMEvents;
        if (E && typeof E.on === 'function') { E.off('death', onLifeEnd); if (on) E.on('death', onLifeEnd); }
        if (!on) deferredKey = null;
    }
    function onLifeEnd() { evaluateSoon(300); }
    /* a replay or the practice arena runs with the recorded / practice server's type and mode, not
     * the server played on: no switch for them (checked again when the replay ends or the mode
     * of the server played on comes back) */
    function notLive() { return !!(window._lmEvReplayOn || (window.LMPractice && window.LMPractice.on)); }
    function evaluateRules(now) {
        if (!ready() || notLive()) return;
        var rules = loadRules();
        if (!rules.enabled) { lastAutoKey = null; defer(false); return; }
        var L = window.legendmod || {};
        var ctx = deviceCtx();
        ctx.serverType = String(L.serverType || '');
        ctx.gameMode = String(L.gameMode || '');
        var pick = pickRule(rules, ctx);
        if (!pick) { lastAutoKey = null; defer(false); return; }
        var key = pick.id + '|' + pick.group + '|' + pick.value;
        /* the same rule again (another server of the same type): already applied, and any change
         * the player made since then stays */
        if (key === lastAutoKey) { defer(false); return; }
        var p = findProfile(pick.id);
        if (p && now !== true && playingNow()) {
            if (deferredKey !== key) toast('info', esc(tx('autoLater', ruleName(pick), p.name)) + ' <button type="button" class="btn btn-xs lm-sp-auto-now" style="margin-left:4px;padding:0 6px;color:inherit;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.6)">' + esc(tx('applyNow')) + '</button>');
            defer(true);
            deferredKey = key;
            return;
        }
        defer(false);
        if (p) {
            var result = applyProfile(p, { auto: ruleName(pick), quiet: true });
            /* P0 fix: update lastAutoKey only after successful application,
             * so a failed apply can be retried on the next evaluation */
            if (result !== null) lastAutoKey = key;
        }
    }
    var evalT = null;
    function evaluateSoon(ms) {
        clearTimeout(evalT);
        evalT = setTimeout(evaluateRules, ms || 600);
    }
    /* listens to the server changes and gamepads only while the switching is on (nothing runs
     * while it is off, and LMEvents has no listener of ours) */
    var listening = false;
    /* P1 fix #19: increased from 600ms to 1500ms. The server handshake (which provides
     * server type and game mode info needed by auto-switch rules) typically takes
     * 700-1500ms. At 600ms the rules evaluated before the info was available. */
    function onServerChange() { evaluateSoon(1500); }
    function onPad() { evaluateSoon(400); }
    /* the mode can change on the same server (it is compared once per frame while listened to) */
    function onModeChange() { evaluateSoon(800); }
    function onReplayStop() { evaluateSoon(1500); }
    function listen(on) {
        if (on === listening) return;
        listening = on;
        /* P2 fix #84: cancel any pending evaluateSoon timer when auto-switch
         * is turned off, so a queued evaluation does not fire after disabling. */
        if (!on) { clearTimeout(evalT); evalT = null; defer(false); }
        var E = window.LMEvents;
        if (E && typeof E.on === 'function') {
            if (on) { E.on('serverChange', onServerChange); E.on('gameModeChange', onModeChange); E.on('replayStop', onReplayStop); }
            else { E.off('serverChange', onServerChange); E.off('gameModeChange', onModeChange); E.off('replayStop', onReplayStop); }
        }
        var f = on ? 'addEventListener' : 'removeEventListener';
        window[f]('gamepadconnected', onPad);
        window[f]('gamepaddisconnected', onPad);
    }

    /* ── Window ── */
    var tab = 'profiles';
    var gpView = false;
    var TABS = { profiles: 'tabProfiles', compare: 'tabCompare', auto: 'tabAuto', backups: 'tabBackups' };
    var cmpA = 'cur', cmpB = '';
    function isOpen() { return !!document.getElementById('lm-sp-overlay'); }
    function css() {
        /* the shared window look (LMexpress.js) */
        if (typeof window.lmUiKit === 'function') window.lmUiKit();
        if (document.getElementById('lm-sp-style')) return;
        var st = document.createElement('style');
        st.id = 'lm-sp-style';
        st.textContent =
            '#lm-sp-overlay{position:fixed;inset:0;z-index:999990;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);font-family:inherit}' +
            '#lm-sp-overlay .lm-sp-win{background:var(--lm-w-bg,var(--lm-pc,#1b1f2a));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,transparent);border-top:3px solid var(--lm-mc,transparent);border-radius:var(--lm-radius,6px);overflow:hidden;width:min(720px,calc(100vw - 16px));max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);display:flex;flex-direction:column;font-size:var(--lm-w-fs,12px);box-shadow:0 8px 32px rgba(0,0,0,.5)}' +
            '#lm-sp-overlay .lm-sp-head{display:flex;align-items:center;justify-content:space-between;padding:var(--lm-w-hpad,4px 6px 4px 12px);border-bottom:1px solid var(--lm-pc2,rgba(255,255,255,.1));background:var(--lm-w-head,linear-gradient(180deg,var(--lm-pc2,transparent) 0%,var(--lm-pc,transparent) 100%))}' +
            '#lm-sp-overlay .lm-sp-head b{font-size:var(--lm-w-title,14px);color:var(--lm-mc,inherit);text-transform:uppercase;letter-spacing:1px}' +
            '#lm-sp-overlay .lm-sp-x{background:var(--lm-w-btn,rgba(255,255,255,.05));border:0;border-radius:var(--lm-radius-s,4px);color:var(--lm-tc2,#bbb);font-size:18px;line-height:1;min-width:var(--lm-w-x,40px);min-height:var(--lm-w-x,36px);cursor:pointer}' +
            '#lm-sp-overlay .lm-sp-tabs{display:flex;gap:2px;padding:4px 8px 0;flex-wrap:wrap}' +
            '#lm-sp-overlay .lm-sp-tabs button{background:var(--lm-w-btn,rgba(255,255,255,.06));border:1px solid var(--lm-pc2,rgba(255,255,255,.12));border-bottom:0;color:var(--lm-tc2,#ccc);padding:4px 10px;border-radius:var(--lm-radius-s,4px) var(--lm-radius-s,4px) 0 0;min-height:var(--lm-w-ctl,28px);font-size:var(--lm-w-fs,12px);cursor:pointer}' +
            '#lm-sp-overlay .lm-sp-tabs button.active{background:var(--lm-pc2,rgba(255,255,255,.16));color:var(--lm-mc,#fff)}' +
            '#lm-sp-overlay .lm-sp-body{overflow:auto;-webkit-overflow-scrolling:touch;padding:var(--lm-w-pad,8px 10px 10px);flex:1;min-height:0;touch-action:pan-y;overscroll-behavior:contain;border-top:1px solid var(--lm-pc2,rgba(255,255,255,.12))}' +
            '#lm-sp-overlay .lm-sp-row{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:6px}' +
            '#lm-sp-overlay .lm-sp-btn{background:var(--lm-w-btn,rgba(255,255,255,.05));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(127,127,127,.45));border-radius:var(--lm-radius-s,3px);padding:3px 8px;min-height:var(--lm-w-ctl,26px);font-size:var(--lm-w-fs,12px);cursor:pointer}' +
            '#lm-sp-overlay .lm-sp-btn:hover{background:var(--lm-w-btn-h,rgba(255,255,255,.12))}' +
            '#lm-sp-overlay .lm-sp-btn.lm-sp-go{border-color:#3c9e5a;background:rgba(60,158,90,.3)}' +
            '#lm-sp-overlay .lm-sp-btn.lm-sp-warn{border-color:#c0504d}' +
            '#lm-sp-overlay .lm-sp-btn.lm-sp-undo{border-color:#e6a23c}' +
            '#lm-sp-overlay input[type=text],#lm-sp-overlay select{background:var(--lm-w-field,rgba(0,0,0,.25));color:var(--lm-tc,#eee);border:1px solid var(--lm-pc2,rgba(255,255,255,.2));border-radius:var(--lm-radius-s,3px);padding:3px 6px;min-height:var(--lm-w-ctl,26px);font-size:var(--lm-w-fs,12px);max-width:100%}' +
            '#lm-sp-overlay label{font-weight:normal;margin:0 6px 0 0;display:inline-flex;align-items:center;gap:3px;cursor:pointer}' +
            '#lm-sp-overlay .lm-sp-note{color:var(--lm-tc2,rgba(238,238,238,.7));font-size:var(--lm-w-fs-s,11px);margin:2px 0 6px}' +
            '#lm-sp-overlay .lm-sp-item{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px;padding:5px 0;border-top:1px solid var(--lm-w-sep,rgba(255,255,255,.08))}' +
            '#lm-sp-overlay .lm-sp-item .lm-sp-name{min-width:140px;flex:1;word-break:break-word}' +
            '#lm-sp-overlay .lm-sp-item small{opacity:.65;margin-left:4px}' +
            '#lm-sp-overlay .lm-sp-acts{display:flex;flex-wrap:wrap;gap:3px}' +
            '#lm-sp-overlay table{width:100%;border-collapse:collapse}' +
            '#lm-sp-overlay td,#lm-sp-overlay th{padding:3px 4px;border-top:1px solid var(--lm-w-sep,rgba(255,255,255,.08));text-align:left;vertical-align:top;word-break:break-word}' +
            '#lm-sp-overlay th{opacity:.75;font-weight:600}' +
            '#lm-sp-overlay h6{margin:8px 0 4px;font-size:12px;opacity:.85}' +
            '#lm-sp-overlay .lm-sp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:4px 10px}' +
            '#lm-sp-overlay .lm-sp-grid > div{display:flex;align-items:center;justify-content:space-between;gap:6px}';
        document.head.appendChild(st);
    }
    /* o.only 'gp': at the gamepad profiles (the Gamepad window's shortcut) */
    function open(o) {
        if (!ready()) { toast('info', esc(tx('loading'))); return; }
        /* the Gamepad window's shortcut opens the gamepad profiles, the Settings button all of them */
        if (!isOpen() || isObj(o)) gpView = !!(isObj(o) && o.only === 'gp');
        if (gpView) tab = 'profiles';
        if (isOpen()) { render(); return; }
        css();
        var $ = jq();
        var ov = $('<div id="lm-sp-overlay"></div>');
        var win = $('<div class="lm-sp-win lm-w lm-modal-container" role="dialog" aria-modal="true"></div>').attr('aria-label', tx('title')).attr('dir', dir()).appendTo(ov);
        var head = $('<div class="lm-sp-head"></div>').appendTo(win);
        $('<b></b>').text(tx('title')).appendTo(head);
        $('<button type="button" class="lm-sp-x">&times;</button>').attr('aria-label', tx('close')).attr('title', tx('close')).appendTo(head);
        var tabs = $('<div class="lm-sp-tabs"></div>').appendTo(win);
        Object.keys(TABS).forEach(function (t) {
            $('<button type="button"></button>').attr('data-tab', t).text(tx(TABS[t])).appendTo(tabs);
        });
        $('<div class="lm-sp-body"></div>').appendTo(win);
        /* a tap outside the window or on x closes it */
        ov.on('click', function (e) {
            if (e.target === this || $(e.target).closest('.lm-sp-x').length) { e.preventDefault(); close(); }
        });
        tabs.on('click', 'button', function () { tab = $(this).attr('data-tab'); render(); return false; });
        win.find('.lm-sp-body').on('click', '[data-act]', function (e) {
            e.preventDefault();
            act($(this).attr('data-act'), $(this).attr('data-id'));
        }).on('change', 'select, input[type=checkbox]', function () { onField(this); });
        /* Esc closes it, like the other windows (only the one in front, winstack.js); it went to the
         * game and the menu behind instead */
        ov[0]._lmEsc = true;
        window.addEventListener('keydown', onEsc, true);
        $('body').append(ov);
        render();
    }
    function onEsc(e) {
        if (!(e.key === 'Escape' || e.keyCode === 27)) return;
        var el = document.getElementById('lm-sp-overlay');
        if (!el) { window.removeEventListener('keydown', onEsc, true); return; }
        if (window.LMWinStack && typeof window.LMWinStack.escFor === 'function' && !window.LMWinStack.escFor(el, e)) return;
        e.preventDefault();
        e.stopPropagation();
        close();
    }
    function dir() { return window.LMi18n && typeof window.LMi18n.dir === 'function' ? window.LMi18n.dir() : 'ltr'; }
    /* a language change while the window is open: its title, tabs and the open tab again */
    function relabel() {
        if (!isOpen()) return;
        var $ = jq(), ov = $('#lm-sp-overlay');
        ov.find('.lm-sp-win').attr('aria-label', tx('title')).attr('dir', dir());
        ov.find('.lm-sp-head b').text(tx('title'));
        ov.find('.lm-sp-x').attr('aria-label', tx('close')).attr('title', tx('close'));
        ov.find('.lm-sp-tabs button').each(function () { $(this).text(tx(TABS[$(this).attr('data-tab')])); });
        render();
    }
    if (window.LMi18n && typeof window.LMi18n.onChange === 'function') window.LMi18n.onChange(relabel);
    function close() { var el = document.getElementById('lm-sp-overlay'); if (el) el.parentNode.removeChild(el); window.removeEventListener('keydown', onEsc, true); }
    function toggle() { if (isOpen()) close(); else open(); }
    function partsBadge(d, only) {
        if (only === 'gp') return gt('pkg.pt.gpBadge') || tx('partGP');
        var p = [];
        /* the ring colour patch of an old gameplay-only set is part of its gameplay settings */
        var rp = ringPatch(d.t);
        if (d.s || rp) p.push(tx('partS'));
        if (d.t && !rp) p.push(tx('partT'));
        if (d.h) p.push(tx('partH'));
        /* every part the set brings: a set with only a phone control layout, gamepad buttons or
         * saved zoom levels said nothing about them (the "none" of an Undo or backup is no part) */
        var got = function (v) { return isObj(v) && !isAbsent(v); };
        if (got(d.m) || got(d.ml)) p.push(tx('partM'));
        if (got(d.gp)) p.push(tx('partGP'));
        var zb = cleanZoomMarks(d.zb);
        if (zb && !noZoomMarks(zb)) p.push(tx('partZB'));
        return p.join(' + ');
    }
    function when(t) {
        if (!t) return '';
        try { return new Date(t).toLocaleString(locale()); } catch (e) { return String(t); }
    }
    var includeOpts = null;
    function includes() {
        if (!includeOpts) includeOpts = { t: true, h: true, m: !!(readJSON('lm-mobile-prefs') || readJSON('lm-mobile-layouts')), g: !!readJSON('lmGamepad') };
        return includeOpts;
    }
    function render() {
        var $ = jq();
        var ov = $('#lm-sp-overlay');
        if (!ov.length) return;
        ov.find('.lm-sp-tabs button').each(function () { $(this).toggleClass('active', $(this).attr('data-tab') === tab); });
        var body = ov.find('.lm-sp-body').empty();
        if (tab === 'compare') renderCompare(body);
        else if (tab === 'auto') renderAuto(body);
        else if (tab === 'backups') renderBackups(body);
        else renderProfiles(body);
    }
    function btn(text, act, id, cls) {
        var $ = jq();
        var b = $('<button type="button" class="lm-sp-btn"></button>').text(text).attr('data-act', act);
        if (id != null) b.attr('data-id', id);
        if (cls) b.addClass(cls);
        return b;
    }
    function renderProfiles(body) {
        var $ = jq(), inc = includes();
        /* the gamepad profiles (buttons and tuning only): their own view, also opened from the
         * Gamepad window */
        if (gpView) $('<div class="lm-sp-note"></div>').text(gt('pkg.pt.gpNote')).appendTo(body);
        var r1 = $('<div class="lm-sp-row"></div>').appendTo(body);
        $('<input type="text" id="lm-sp-name" maxlength="40" autocomplete="off">').attr('placeholder', tx('namePh')).appendTo(r1);
        if (gpView) btn(gt('pkg.pt.saveGp') || tx('saveCurrent'), 'savegp', null, 'lm-sp-go').appendTo(r1);
        else btn(tx('saveCurrent'), 'save', null, 'lm-sp-go').appendTo(r1);
        btn(gpView ? gt('pkg.pt.allView') : gt('pkg.pt.gpView'), 'gpview', null, 'lm-sp-gpview').appendTo(r1);
        if (!gpView) renderProfileSetup(body, inc);
        var u = loadUndo();
        if (u) {
            var r4 = $('<div class="lm-sp-row"></div>').appendTo(body);
            btn(tx('undoLast') + (u.name ? ' (' + u.name + ')' : ''), 'undo', null, 'lm-sp-undo').appendTo(r4);
        }
        /* old Gamepad window setups that wait for a free place */
        var waiting = pendingGamepadCount();
        if (waiting && typeof window.lmT === 'function') $('<div class="lm-sp-note"></div>').text(window.lmT('pkg.n34.gpPending', [waiting])).appendTo(body);
        var list = loadProfiles().filter(function (p) { return !gpView || p.only === 'gp'; });
        if (!list.length) { $('<div class="lm-sp-note"></div>').text(gt(gpView ? 'pkg.pt.gpEmpty' : 'pkg.pt.empty')).appendTo(body); return; }
        var last = null;
        try { last = window.localStorage.getItem(KEY_LAST); } catch (e) { }
        list.forEach(function (p) {
            var it = $('<div class="lm-sp-item"></div>').appendTo(body);
            var nm = $('<div class="lm-sp-name"></div>').appendTo(it);
            $('<b></b>').text(p.name).appendTo(nm);
            $('<small></small>').text(partsBadge(p.data, p.only) + (p.updated ? ' \u00b7 ' + when(p.updated) : '') + (p.id === last ? ' \u00b7 ' + tx('lastApplied') : '')).appendTo(nm);
            var acts = $('<div class="lm-sp-acts"></div>').appendTo(it);
            btn(tx('apply'), 'apply', p.id, 'lm-sp-go').appendTo(acts);
            btn(tx('update'), 'update', p.id).appendTo(acts);
            btn(tx('rename'), 'rename', p.id).appendTo(acts);
            btn(tx('duplicate'), 'dup', p.id).appendTo(acts);
            btn(tx('compare'), 'cmp', 'p:' + p.id).appendTo(acts);
            btn(tx('del'), 'del', p.id, 'lm-sp-warn').appendTo(acts);
        });
    }
    /* what a full profile takes, and a new one from a preset */
    function renderProfileSetup(body, inc) {
        var $ = jq();
        var r2 = $('<div class="lm-sp-row"></div>').appendTo(body);
        $('<span></span>').text(tx('include')).appendTo(r2);
        [['t', 'partT'], ['h', 'partH'], ['m', 'partM'], ['g', 'partGP']].forEach(function (p) {
            var l = $('<label></label>').appendTo(r2);
            $('<input type="checkbox">').attr('data-inc', p[0]).prop('checked', !!inc[p[0]]).appendTo(l);
            l.append(document.createTextNode(tx(p[1])));
        });
        /* a new profile from one of the Settings presets (the menu builds the list) */
        var pids = Object.keys(presets());
        if (pids.length) {
            var r3 = $('<div class="lm-sp-row"></div>').appendTo(body);
            $('<span></span>').text(gt('pkg.pt.fromPreset')).appendTo(r3);
            var sel = $('<select id="lm-sp-tpl"></select>').appendTo(r3);
            pids.forEach(function (id) { $('<option></option>').val(id).text(templateName(id)).appendTo(sel); });
            btn(tx('create'), 'tpl').appendTo(r3);
            $('<div class="lm-sp-note"></div>').text(gt('pkg.pt.fromPresetNote')).appendTo(body);
        }
    }
    function sourceOptions(sel, value) {
        var $ = jq();
        $('<option value="cur"></option>').text(tx('current')).appendTo(sel);
        loadProfiles().forEach(function (p) { $('<option></option>').val('p:' + p.id).text(p.name).appendTo(sel); });
        loadBackups().forEach(function (b, i) { $('<option></option>').val('b:' + b.t).text(tx('backupOf', when(b.t))).appendTo(sel); });
        sel.val(value);
        if (sel.val() == null) sel.val('cur');
    }
    function resolveSource(v) {
        if (v === 'cur') return { name: tx('current'), data: captureCurrent() };
        var m = /^([pb]):(.+)$/.exec(String(v || ''));
        if (!m) return null;
        if (m[1] === 'p') { var p = findProfile(m[2]); return p ? { name: p.name, data: p.data } : null; }
        var b = loadBackups().filter(function (x) { return String(x.t) === m[2]; })[0];
        return b ? { name: tx('backupOf', when(b.t)), data: b.data } : null;
    }
    var PART_NAMES = { s: 'partS', t: 'partT', h: 'partH', m: 'partM', hl: 'partHL', zb: 'partZB', ml: 'partML', gp: 'partGP', pb: 'partPB' };
    function renderCompare(body) {
        var $ = jq();
        var r = $('<div class="lm-sp-row"></div>').appendTo(body);
        $('<span>A:</span>').appendTo(r);
        var a = $('<select data-cmp="a"></select>').appendTo(r);
        $('<span>B:</span>').appendTo(r);
        var b = $('<select data-cmp="b"></select>').appendTo(r);
        if (!cmpB) { var first = loadProfiles()[0]; cmpB = first ? 'p:' + first.id : 'cur'; }
        sourceOptions(a, cmpA);
        sourceOptions(b, cmpB);
        cmpA = a.val(); cmpB = b.val();
        var A = resolveSource(cmpA), B = resolveSource(cmpB);
        var rows = A && B ? diffBundles(effective(A.data), effective(B.data), label) : [];
        $('<div class="lm-sp-note"></div>').text(rows.length ? tx('diffCount', rows.length) : tx('diffNone')).appendTo(body);
        if (!rows.length) return;
        var tbl = $('<table></table>').appendTo(body);
        var hr = $('<tr></tr>').appendTo(tbl);
        $('<th></th>').text(tx('colPart')).appendTo(hr);
        $('<th></th>').text(tx('colSetting')).appendTo(hr);
        $('<th></th>').text('A').appendTo(hr);
        $('<th></th>').text('B').appendTo(hr);
        rows.forEach(function (row) {
            var tr = $('<tr></tr>').appendTo(tbl);
            $('<td></td>').text(tx(PART_NAMES[row.part])).appendTo(tr);
            $('<td></td>').text(row.label).attr('title', row.key).appendTo(tr);
            $('<td></td>').text(fmt(row.a, row.part)).appendTo(tr);
            $('<td></td>').text(fmt(row.b, row.part)).appendTo(tr);
        });
    }
    function renderAuto(body) {
        var $ = jq();
        var rules = loadRules(), list = loadProfiles();
        var r = $('<div class="lm-sp-row"></div>').appendTo(body);
        var l = $('<label></label>').appendTo(r);
        $('<input type="checkbox" data-rule-on="1">').prop('checked', rules.enabled).appendTo(l);
        l.append(document.createTextNode(tx('autoEnable')));
        $('<div class="lm-sp-note"></div>').text(tx('autoNote')).appendTo(body);
        [['server', SERVER_TYPES, 'autoServer'], ['mode', GAME_MODES, 'autoMode'], ['device', DEVICES, 'autoDevice']].forEach(function (g) {
            $('<h6></h6>').text(tx(g[2])).appendTo(body);
            var grid = $('<div class="lm-sp-grid"></div>').appendTo(body);
            g[1].forEach(function (v) {
                var cell = $('<div></div>').appendTo(grid);
                $('<span></span>').text(ruleLabel(v)).appendTo(cell);
                var sel = $('<select></select>').attr('data-rule', g[0]).attr('data-value', v[0]).appendTo(cell);
                $('<option value=""></option>').text(tx('none')).appendTo(sel);
                list.forEach(function (p) { $('<option></option>').val(p.id).text(p.name).appendTo(sel); });
                sel.val(rules[g[0]][v[0]] || '');
            });
        });
    }
    function renderBackups(body) {
        var $ = jq();
        var r = $('<div class="lm-sp-row"></div>').appendTo(body);
        btn(tx('backupNow'), 'backup', null, 'lm-sp-go').appendTo(r);
        $('<div class="lm-sp-note"></div>').text(tx('backupNote')).appendTo(body);
        var list = loadBackups();
        if (!list.length) { $('<div class="lm-sp-note"></div>').text(tx('noBackups')).appendTo(body); return; }
        list.forEach(function (b) {
            var it = $('<div class="lm-sp-item"></div>').appendTo(body);
            var nm = $('<div class="lm-sp-name"></div>').appendTo(it);
            $('<b></b>').text(when(b.t)).appendTo(nm);
            $('<small></small>').text(tx('r_' + b.reason) + (b.label ? ' (' + b.label + ')' : '') + ' \u00b7 ' + partsBadge(b.data)).appendTo(nm);
            var acts = $('<div class="lm-sp-acts"></div>').appendTo(it);
            btn(tx('restore'), 'restore', String(b.t), 'lm-sp-go').appendTo(acts);
            btn(tx('compare'), 'cmp', 'b:' + b.t).appendTo(acts);
        });
    }
    function onField(el) {
        var $ = jq(), j = $(el);
        if (j.attr('data-inc')) { includes()[j.attr('data-inc')] = el.checked; return; }
        if (j.attr('data-cmp')) {
            if (j.attr('data-cmp') === 'a') cmpA = j.val(); else cmpB = j.val();
            render();
            return;
        }
        if (j.attr('data-rule-on') || j.attr('data-rule')) {
            var rules = loadRules();
            if (j.attr('data-rule-on')) rules.enabled = el.checked;
            else {
                var g = j.attr('data-rule'), v = j.attr('data-value');
                if (j.val()) rules[g][v] = j.val(); else delete rules[g][v];
            }
            if (!writeText(KEY_RULES, JSON.stringify(rules))) toast('error', esc(tx('storageFull')));
            lastAutoKey = null;
            listen(rules.enabled);
            if (rules.enabled) evaluateSoon(300);
        }
    }
    function uniqueName(name, list) {
        /* no prototype: names like "constructor" are names too */
        var taken = Object.create(null);
        list.forEach(function (p) { taken[p.name.toLowerCase()] = true; });
        if (!taken[name.toLowerCase()]) return name;
        for (var i = 2; i < 100; i++) {
            var n = (name.slice(0, NAME_MAX - 4) + ' ' + i);
            if (!taken[n.toLowerCase()]) return n;
        }
        return name;
    }
    function act(a, id) {
        var $ = jq(), list = loadProfiles(), p = null, i;
        for (i = 0; i < list.length; i++) if (list[i].id === id) { p = list[i]; break; }
        var now = Date.now();
        if (a === 'gpview') { gpView = !gpView; render(); return; }
        if (a === 'save' || a === 'savegp' || a === 'tpl' || a === 'dup') {
            if (list.length >= MAX_PROFILES) { toast('warning', esc(tx('tooMany'))); return; }
        }
        if (a === 'save') {
            var name = cleanName($('#lm-sp-name').val());
            if (!name) { toast('info', esc(tx('needName'))); $('#lm-sp-name').focus(); return; }
            var inc = includes();
            var data = captureCurrent({ t: inc.t, h: inc.h, m: inc.m, g: inc.g, hl: false });
            if (!data) return;
            var np = { id: newId(), name: uniqueName(name, list), created: now, updated: now, data: data };
            list.push(np);
            if (saveProfiles(list)) toast('success', esc(tx('saved', np.name)));
        } else if (a === 'savegp') {
            var gname = cleanName($('#lm-sp-name').val());
            if (!gname) { toast('info', esc(tx('needName'))); $('#lm-sp-name').focus(); return; }
            var gdata = captureGamepad();
            if (!gdata) return;
            var gpp = { id: newId(), name: uniqueName(gname, list), created: now, updated: now, data: gdata, only: 'gp' };
            list.push(gpp);
            if (saveProfiles(list)) toast('success', esc(tx('saved', gpp.name)));
        } else if (a === 'tpl') {
            var tid = $('#lm-sp-tpl').val();
            if (!has(presets(), tid)) return;
            var inc2 = includes();
            var cur = captureCurrent({ t: inc2.t, h: inc2.h, m: inc2.m, g: inc2.g, hl: false });
            var res = applyTemplate(cur, tid);
            if (!res.data) return;
            var changed = diffBundles(cur, res.data).length;
            var tp = { id: newId(), name: uniqueName(templateName(tid), list), created: now, updated: now, data: res.data, tpl: tid };
            list.push(tp);
            if (saveProfiles(list)) toast('success', esc(tx('created', tp.name, changed)));
        } else if (a === 'apply' && p) {
            var rows = diffBundles(captureCurrent(), effective(cleanBundle(profileData(p))), label);
            if (!rows.length) { toast('info', esc(tx('same', p.name))); return; }
            if (!window.confirm(tx('confirmApply', p.name, rows.length))) return;
            applyProfile(p);
        } else if (a === 'update' && p) {
            if (!window.confirm(tx('confirmUpdate', p.name))) return;
            p.data = (p.only === 'gp' ? captureGamepad() : updatedSet(p.data)) || p.data;
            p.updated = now;
            if (saveProfiles(list)) toast('success', esc(tx('saved', p.name)));
        } else if (a === 'rename' && p) {
            var nn = cleanName(window.prompt(tx('renamePrompt'), p.name));
            if (!nn || nn === p.name) return;
            /* the name of another profile gets a number, as a new profile does (two "Alpha" could
             * not be told apart in the lists, the compare and the automatic switching) */
            p.name = uniqueName(nn, list.filter(function (x) { return x !== p; }));
            p.updated = now;
            saveProfiles(list);
        } else if (a === 'dup' && p) {
            var dp = { id: newId(), name: uniqueName(cleanName(p.name.slice(0, NAME_MAX - 12) + tx('copySuffix')), list), created: now, updated: now, data: clone(p.data) };
            if (p.tpl) dp.tpl = p.tpl;
            if (p.only) dp.only = p.only;
            list.splice(i + 1, 0, dp);
            saveProfiles(list);
        } else if (a === 'del' && p) {
            if (!window.confirm(tx('confirmDelete', p.name))) return;
            list.splice(i, 1);
            if (saveProfiles(list)) {
                /* rules that pointed at it go (cleanRules drops unknown ids) */
                writeText(KEY_RULES, JSON.stringify(cleanRules(readJSON(KEY_RULES), list)));
                /* its link to a HUD layout goes too (the layout itself stays, others may use it) */
                try { var HE = window.LMHudEditor; if (HE && typeof HE.linkProfile === 'function' && HE.profileLayout(p.id)) HE.linkProfile(p.id, ''); } catch (e) { }
                /* the place is free for an old gamepad setup that was waiting */
                migrateGamepadProfiles();
            }
        } else if (a === 'cmp') {
            cmpA = 'cur';
            cmpB = id;
            tab = 'compare';
        } else if (a === 'undo') {
            undo();
            return;
        } else if (a === 'backup') {
            toast('info', esc(backupNow('manual') ? tx('backupDone') : tx('backupSame')));
        } else if (a === 'restore') {
            var b = loadBackups().filter(function (x) { return String(x.t) === id; })[0];
            if (!b) return;
            var n = diffBundles(captureCurrent(), effective(b.data), label).length;
            if (!n) { toast('info', esc(tx('same', when(b.t)))); return; }
            if (!window.confirm(tx('confirmRestore', when(b.t), n))) return;
            applyBundle(b.data, { name: tx('backupOf', when(b.t)), reason: 'restore' });
        }
        render();
    }

    /* ── Start ── */
    var started = false;
    function init() {
        if (started) return;
        started = true;
        installHooks();
        migrateGamepadProfiles();
        var $ = jq();
        $(document).on('click', '.lm-sp-undo-btn', function (e) { e.preventDefault(); e.stopPropagation(); undo(); });
        $(document).on('click', '.lm-sp-auto-now', function (e) { e.preventDefault(); e.stopPropagation(); if (deferredKey) evaluateRules(true); });
        if (loadRules().enabled) {
            listen(true);
            /* device rules on start (the server rules wait for the first server) */
            evaluateSoon(2500);
        }
    }
    var tries = 0;
    function boot() {
        if (ready() && document.getElementById('og-options')) { init(); return; }
        if (++tries < 240) setTimeout(boot, 500);
    }
    setTimeout(boot, 0);

    window.LMProfiles = {
        open: open,
        close: close,
        toggle: toggle,
        applyNext: applyNext,
        undo: undo,
        list: function () { return loadProfiles().map(function (p) { return { id: p.id, name: p.name }; }); },
        applyById: function (id) { var p = findProfile(id); return p ? applyProfile(p) : null; },
        /* applies a set { s, t, h, m } like a profile (with backup and Undo); for scripts and the smoke test */
        applySet: function (data, name) { return applyBundle(data, { name: cleanName(name) || tx('script'), reason: 'profile' }); },
        /* the settings export: lmGamepad with the old setups still waiting (ogario.v4.js) */
        exportGamepad: exportGamepad,
        /* pure parts, used by developers/tests/profiles.js */
        core: {
            readPending: readPending, uniqueName: uniqueName,
            cleanBundle: cleanBundle, cleanProfiles: cleanProfiles, cleanBackups: cleanBackups, cleanRules: cleanRules,
            diffBundles: diffBundles, effective: effective, applyTemplate: applyTemplate, pushBackup: pushBackup, saveBackups: saveBackups,
            writeTransaction: writeTransaction, fillNewDefaults: fillNewDefaults, pickRule: pickRule,
            captureCurrent: captureCurrent, presets: presets, TPL_OLD: TPL_OLD, gamepadSet: gamepadSet, captureGamepad: captureGamepad, migrateGamepadProfiles: migrateGamepadProfiles, loadProfiles: loadProfiles, MAX_PROFILES: MAX_PROFILES, MAX_BACKUPS: MAX_BACKUPS, KEY_BACKUPS: KEY_BACKUPS,
            listen: listen, evaluateRules: evaluateRules, act: act, partsBadge: partsBadge
        }
    };
})();
