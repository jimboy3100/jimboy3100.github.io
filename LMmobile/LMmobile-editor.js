/**
 * LM Mobile control editor: move, resize, fade or hide the touch controls of LMmobile.js.
 *
 * Opened with "Edit controls" in the gear panel. LMmobile.js loads this file on that tap, or at
 * start when a saved layout exists (localStorage 'lm-mobile-layouts'); without one this file is
 * not loaded and the controls stay where LMmobile.js puts them (next to the minimap).
 *
 * Storage ('lm-mobile-layouts', checked on every read):
 *   { v: 1, current: { landscape: Layout|null, portrait: Layout|null },
 *     named: { "<name>": { landscape: Layout|null, portrait: Layout|null } }, active: "<name>"|null,
 *     snap: true, barBottom: false }
 *   Layout = { controls: { <id>: { cx, cy, s, o?, hide? } , joystick: { cx, cy, w, h } } }
 *   cx / cy: centre as a fraction of the screen; s: size factor of the button; o: its opacity
 *   (missing = the gear panel's opacity); w / h: joystick zone size as a fraction of the screen.
 *   A control missing from a layout stays in its usual place.
 */
(function () {
    'use strict';
    var W = typeof window !== 'undefined' ? window : this;
    if (W._lmMobileEditorLoaded) return;
    W._lmMobileEditorLoaded = true;

    var KEY = 'lm-mobile-layouts';
    var ORIENTS = ['landscape', 'portrait'];
    /* hide: the player may hide it in the editor (the menu button stays: without it the game menu
     * cannot be reached; the joystick zone is not a button). act: game action, no taps while the
     * main menu is open (as in LMmobile.js). */
    /* lk: the name's key in the language packs (developers/i18n/src/misc.json), lv: its {0} */
    var CONTROLS = [
        { id: 'joystick', lk: 'misc.editor.ctlJoystick', zone: true },
        { id: 'split', lk: 'misc.editor.ctlSplit', icon: '⚔', hide: true, act: true },
        { id: 'feed', lk: 'misc.editor.ctlFeed', icon: '⬤', hide: true, act: true },
        { id: 'x4', lk: 'misc.editor.ctlX4', icon: '4×', hide: true, act: true },
        { id: 'x16', lk: 'misc.editor.ctlX16', icon: '16×', hide: true, act: true },
        { id: 'multibox', lk: 'misc.editor.ctlMultibox', icon: '⇄', hide: true },
        { id: 'q1', lk: 'misc.editor.ctlQuick', lv: [1], icon: '1', hide: true },
        { id: 'q2', lk: 'misc.editor.ctlQuick', lv: [2], icon: '2', hide: true },
        { id: 'q3', lk: 'misc.editor.ctlQuick', lv: [3], icon: '3', hide: true },
        { id: 'q4', lk: 'misc.editor.ctlQuick', lv: [4], icon: '4', hide: true },
        { id: 'menu', lk: 'misc.editor.ctlMenu', icon: '☰' }
    ];
    var CTL = {};
    CONTROLS.forEach(function (c) { CTL[c.id] = c; });
    var LIM = { s: [0.4, 2.5], o: [0.15, 1], zw: [0.1, 1], zh: [0.15, 1] };
    var MAX_NAMED = 12, NAME_MAX = 24;
    var GRID = 16, EDGE = 12, MARGIN = 4;

    /* ═══ Pure parts (unit tested in developers/tests/mobileeditor.js) ═══ */

    function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
    function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
    function num(v, min, max) {
        v = typeof v === 'string' && v.trim() !== '' ? Number(v) : v;
        return typeof v === 'number' && isFinite(v) ? Math.min(max, Math.max(min, v)) : null;
    }
    function cleanEntry(id, e) {
        var c = own(CTL, id) ? CTL[id] : null;
        if (!c || !isObj(e)) return null;
        var cx = num(e.cx, 0, 1), cy = num(e.cy, 0, 1);
        if (cx === null || cy === null) return null;
        var out = { cx: cx, cy: cy };
        if (c.zone) {
            var w = num(e.w, LIM.zw[0], LIM.zw[1]), h = num(e.h, LIM.zh[0], LIM.zh[1]);
            if (w === null || h === null) return null;
            out.w = w; out.h = h;
            return out;
        }
        var s = num(e.s, LIM.s[0], LIM.s[1]);
        out.s = s === null ? 1 : s;
        var o = e.o === undefined || e.o === null ? null : num(e.o, LIM.o[0], LIM.o[1]);
        if (o !== null) out.o = o;
        /* only an explicit choice hides a control, and only one that may be hidden */
        if (c.hide && e.hide === true) out.hide = true;
        return out;
    }
    function cleanLayout(l) {
        if (!isObj(l) || !isObj(l.controls)) return null;
        var out = { controls: {} }, n = 0;
        CONTROLS.forEach(function (c) {
            if (!own(l.controls, c.id)) return;
            var e = cleanEntry(c.id, l.controls[c.id]);
            if (e) { out.controls[c.id] = e; n++; }
        });
        return n ? out : null;
    }
    function cleanName(n) {
        if (typeof n !== 'string') return null;
        n = n.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim();
        /* P2 fix #103: also block 'constructor' and 'prototype' to prevent prototype pollution */
        if (!n || n.length > NAME_MAX || n === '__proto__' || n === 'constructor' || n === 'prototype') return null;
        return n;
    }
    function cleanPair(p) {
        if (!isObj(p)) return { landscape: null, portrait: null };
        return { landscape: cleanLayout(p.landscape), portrait: cleanLayout(p.portrait) };
    }
    function emptyStore() {
        return { v: 1, current: { landscape: null, portrait: null }, named: {}, active: null, snap: true, barBottom: false };
    }
    function cleanStore(raw) {
        var st = emptyStore();
        if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { return st; } }
        if (!isObj(raw)) return st;
        st.current = cleanPair(raw.current);
        if (isObj(raw.named)) {
            var n = 0;
            Object.keys(raw.named).forEach(function (k) {
                if (n >= MAX_NAMED) return;
                var nm = cleanName(k);
                if (!nm || own(st.named, nm) || !isObj(raw.named[k])) return;
                st.named[nm] = cleanPair(raw.named[k]);
                n++;
            });
        }
        var a = cleanName(raw.active);
        st.active = a && own(st.named, a) ? a : null;
        if (typeof raw.snap === 'boolean') st.snap = raw.snap;
        if (typeof raw.barBottom === 'boolean') st.barBottom = raw.barBottom;
        return st;
    }
    function hasLayout(st) {
        return !!(st && st.current && (st.current.landscape || st.current.portrait));
    }
    function copy(v) { return v == null ? null : JSON.parse(JSON.stringify(v)); }
    function orientOf(vw, vh) { return vw >= vh ? 'landscape' : 'portrait'; }

    /* rectangles: { x, y, w, h } in px, x / y = left / top */
    function clampRect(r, vw, vh, m) {
        m = m || 0;
        var w = Math.max(0, Math.min(r.w, vw - 2 * m)), h = Math.max(0, Math.min(r.h, vh - 2 * m));
        var x = isFinite(r.x) ? r.x : m, y = isFinite(r.y) ? r.y : m;
        x = Math.min(Math.max(x, m), vw - m - w);
        y = Math.min(Math.max(y, m), vh - m - h);
        return { x: x, y: y, w: w, h: h };
    }
    /* grid first, then the screen edges win: a control dropped near an edge sits at the edge margin */
    function snapRect(r, vw, vh, grid, edge, m) {
        var x = r.x, y = r.y;
        if (grid > 0) { x = Math.round(x / grid) * grid; y = Math.round(y / grid) * grid; }
        if (edge > 0) {
            if (Math.abs(r.x - m) <= edge) x = m;
            else if (Math.abs(vw - m - (r.x + r.w)) <= edge) x = vw - m - r.w;
            if (Math.abs(r.y - m) <= edge) y = m;
            else if (Math.abs(vh - m - (r.y + r.h)) <= edge) y = vh - m - r.h;
        }
        return clampRect({ x: x, y: y, w: r.w, h: r.h }, vw, vh, 0);
    }
    /* round buttons are tested as circles, anything else as rectangles; touching is no overlap */
    function overlaps(a, b, pad) {
        pad = pad || 0;
        if (a.round && b.round) {
            var dx = (a.x + a.w / 2) - (b.x + b.w / 2), dy = (a.y + a.h / 2) - (b.y + b.h / 2);
            var rr = Math.min(a.w, a.h) / 2 + Math.min(b.w, b.h) / 2 - pad;
            return rr > 0 && dx * dx + dy * dy < rr * rr;
        }
        return a.x < b.x + b.w - pad && b.x < a.x + a.w - pad && a.y < b.y + b.h - pad && b.y < a.y + a.h - pad;
    }
    /* items: [{ id, x, y, w, h, round?, fixed? }]; two fixed items (things the editor does not move) are not compared */
    function findOverlaps(items, pad) {
        var out = [];
        for (var i = 0; i < items.length; i++) {
            for (var j = i + 1; j < items.length; j++) {
                if (items[i].fixed && items[j].fixed) continue;
                if (overlaps(items[i], items[j], pad)) out.push([items[i].id, items[j].id]);
            }
        }
        return out;
    }
    /* a button no larger than the screen */
    function fitScale(s, nat, vw, vh) {
        if (!nat || !nat.w || !nat.h) return s;
        return Math.max(0.05, Math.min(s, vw / nat.w, vh / nat.h));
    }
    /* layout entry -> on-screen rectangle (always fully on the screen) */
    function entryRect(e, nat, vw, vh) {
        var w, h;
        if (e.w !== undefined) { w = e.w * vw; h = e.h * vh; }
        else { var s = fitScale(e.s, nat, vw, vh); w = nat.w * s; h = nat.h * s; }
        return clampRect({ x: e.cx * vw - w / 2, y: e.cy * vh - h / 2, w: w, h: h }, vw, vh, 0);
    }
    /* on-screen rectangle -> layout entry (keeps the size factor, opacity and hide of base) */
    function rectEntry(id, r, vw, vh, base) {
        var e = { cx: (r.x + r.w / 2) / vw, cy: (r.y + r.h / 2) / vh };
        if (CTL[id] && CTL[id].zone) { e.w = r.w / vw; e.h = r.h / vh; }
        else {
            e.s = base && base.s !== undefined ? base.s : 1;
            if (base && base.o !== undefined) e.o = base.o;
            if (base && base.hide) e.hide = true;
        }
        return cleanEntry(id, e);
    }

    var api = W.LMMobileEditor = {
        KEY: KEY,
        CONTROLS: CONTROLS,
        _pure: {
            cleanEntry: cleanEntry, cleanLayout: cleanLayout, cleanStore: cleanStore, cleanName: cleanName,
            emptyStore: emptyStore, hasLayout: hasLayout, orientOf: orientOf, clampRect: clampRect,
            snapRect: snapRect, overlaps: overlaps, findOverlaps: findOverlaps, fitScale: fitScale,
            entryRect: entryRect, rectEntry: rectEntry, LIM: LIM
        },
        ready: false
    };

    var H = W._lmMobileHost, D = W.document;
    if (!H || !D || typeof D.createElement !== 'function') return;

    /* ═══ Storage ═══ */

    function load() {
        var raw = null;
        try { raw = W.localStorage.getItem(KEY); } catch (e) { }
        return cleanStore(raw);
    }
    var store = load();
    function save() {
        try { W.localStorage.setItem(KEY, JSON.stringify(store)); return true; }
        catch (e) { toast('error', T('misc.editor.saveFailed')); return false; }
    }
    function toast(kind, text) {
        try { if (W.toastr && typeof W.toastr[kind] === 'function') W.toastr[kind](esc(text)); } catch (e) { }
    }
    /* the texts, in the language chosen in Legend Mod (lmT falls back to English) */
    function T(key, vars) { return W.lmT ? W.lmT(key, vars) : key; }
    /* the shown name of a control or of a fixed part of the screen */
    function lab(o) { return o ? (o.lk ? T(o.lk, o.lv) : o.id) : ''; }
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    }
    function vwh() { return { w: W.innerWidth || 1, h: W.innerHeight || 1 }; }

    /* ═══ CSS ═══ */

    var css = D.createElement('style');
    css.id = 'lm-ed-css';
    css.textContent =
        '.lm-ed-slot{position:fixed;z-index:100000;pointer-events:none;transform-origin:center center;' + /* i18n-ok: CSS */
        'display:flex;align-items:center;justify-content:center;margin:0;padding:0}' +
        /* game actions take no taps while the main menu is open (as their usual groups) */
        '.lm-menu .lm-ed-act,.lm-menu .lm-ed-act *{pointer-events:none!important}' +
        '#lm-ed{position:fixed;left:0;top:0;width:100%;height:100%;z-index:200001;touch-action:none;' +
        'background:rgba(0,12,24,.55);user-select:none;-webkit-user-select:none;font:600 12px/1.2 Ubuntu,Roboto,sans-serif;color:#fff}' +
        '#lm-ed.grid{background-image:linear-gradient(rgba(1,217,204,.07) 1px,transparent 1px),' + /* i18n-ok: CSS */
        'linear-gradient(90deg,rgba(1,217,204,.07) 1px,transparent 1px);background-size:' + GRID + 'px ' + GRID + 'px}' + /* i18n-ok: CSS */
        '.lm-ed-px{position:absolute;z-index:3;box-sizing:border-box;border-radius:50%;display:flex;align-items:center;' +
        'justify-content:center;background:rgba(0,36,62,.85);border:2px solid rgba(1,217,204,.7);color:#fff;' +
        'font:700 18px/1 Ubuntu,Roboto,sans-serif;touch-action:none}' +
        '.lm-ed-px.sel{border-color:#fff;box-shadow:0 0 0 2px rgba(255,255,255,.35)}' +
        '.lm-ed-px.bad{border-color:#ff4d4d;box-shadow:0 0 10px rgba(255,77,77,.7)}' +
        '.lm-ed-px.hid{border-style:dashed;background:rgba(0,36,62,.35);color:rgba(255,255,255,.45)}' +
        '.lm-ed-px.hid:after{content:attr(data-hid);position:absolute;bottom:-15px;font:600 10px Ubuntu,sans-serif;color:#ffb347}' +
        '.lm-ed-zone{position:absolute;z-index:1;box-sizing:border-box;border:2px dashed rgba(255,213,79,.65);' +
        'background:rgba(255,213,79,.05);pointer-events:none}' +
        '.lm-ed-zone.sel{border-color:#ffd54f;background:rgba(255,213,79,.10)}' +
        '.lm-ed-ztab{position:absolute;z-index:2;transform:translate(-50%,-50%);padding:9px 12px;border-radius:16px;' +
        'background:rgba(60,48,0,.85);border:1.5px solid #ffd54f;color:#ffd54f;white-space:nowrap;touch-action:none}' +
        '.lm-ed-zh{position:absolute;z-index:2;width:30px;height:30px;border-radius:6px;background:#ffd54f;color:#3c3000;' +
        'display:flex;align-items:center;justify-content:center;font:700 16px/1 sans-serif;touch-action:none}' +
        '.lm-ed-fix{position:absolute;z-index:0;box-sizing:border-box;border:1px dashed rgba(255,255,255,.3);pointer-events:none}' +
        '#lm-ed-bar{position:absolute;z-index:5;left:50%;transform:translateX(-50%);top:4px;max-width:calc(100% - 16px);' +
        'box-sizing:border-box;background:rgba(0,36,62,.95);border:1px solid rgba(1,217,204,.45);border-radius:10px;' +
        'padding:4px 6px;display:flex;flex-direction:column;gap:4px;transition:opacity .15s}' +
        '#lm-ed-bar.bottom{top:auto;bottom:4px}' +
        '#lm-ed.drag #lm-ed-bar{opacity:.25;pointer-events:none}' +
        '#lm-ed-bar .row{display:flex;flex-wrap:wrap;align-items:center;gap:4px}' +
        '#lm-ed button,#lm-ed select{min-height:36px;min-width:36px;padding:0 9px;border-radius:7px;box-sizing:border-box;' +
        'border:1px solid rgba(1,217,204,.45);background:rgba(1,217,204,.12);color:#fff;font:700 12px/1 Ubuntu,Roboto,sans-serif}' +
        '#lm-ed select{max-width:130px}#lm-ed select option{color:#000}' +
        '#lm-ed button.pri{background:rgba(1,217,204,.4)}' +
        '#lm-ed button:disabled{opacity:.35}' +
        '#lm-ed input[type=range]{width:90px;accent-color:#01d9cc}' +
        '#lm-ed-warn{color:#ff8080;max-width:420px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
        '#lm-ed-o{color:#01d9cc;opacity:.8}' +
        '#lm-ed-lay{position:absolute;z-index:6;left:50%;top:50%;transform:translate(-50%,-50%);width:300px;max-width:calc(100% - 16px);' +
        'max-height:calc(100% - 16px);overflow-y:auto;box-sizing:border-box;background:rgba(0,36,62,.97);border:1px solid rgba(1,217,204,.5);' +
        'border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:6px}' +
        '#lm-ed-lay .hd{display:flex;justify-content:space-between;align-items:center;font-size:14px;color:#01d9cc}' +
        '#lm-ed-lay .it{display:flex;align-items:center;gap:4px}#lm-ed-lay .it span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
        '#lm-ed-lay input[type=text]{flex:1;min-width:0;min-height:36px;font-size:16px;border-radius:7px;border:1px solid rgba(1,217,204,.45);' +
        'background:rgba(0,0,0,.3);color:#fff;padding:0 8px;box-sizing:border-box}';
    D.head.appendChild(css);

    /* ═══ Applying a layout to the real controls ═══ */

    var slots = {};     /* id -> wrapper on body holding a moved control */
    var natCache = {};  /* id -> { w, h } layout size of the control (without any scale) */
    var editing = false;

    /* the used size without any transform (offsetWidth is rounded: a button sized in vmin is
     * 82.4 px, and a 2.5x one then reached 1 px over the screen edge) */
    function boxSize(el) {
        if (!el || !el.offsetWidth) return { w: 0, h: 0 };
        var cs = W.getComputedStyle(el), f = function (p) { return parseFloat(cs[p]) || 0; };
        var w = f('width'), h = f('height');
        if (cs.boxSizing !== 'border-box') {
            w += f('paddingLeft') + f('paddingRight') + f('borderLeftWidth') + f('borderRightWidth');
            h += f('paddingTop') + f('paddingBottom') + f('borderTopWidth') + f('borderBottomWidth');
        }
        return w > 0 && h > 0 ? { w: w, h: h } : { w: el.offsetWidth, h: el.offsetHeight };
    }
    function natSize(id, el) {
        var b = boxSize(el), w = b.w, h = b.h;
        if (w > 0 && h > 0) natCache[id] = { w: w, h: h };
        return natCache[id] || { w: 52, h: 52 };
    }
    function layoutNow() {
        var v = vwh();
        return editing ? null : store.current[orientOf(v.w, v.h)];
    }
    function setStyle(el, prop, val) { if (el.style[prop] !== val) el.style[prop] = val; }

    function apply() {
        var v = vwh(), lay = layoutNow(), els = H.controls();
        CONTROLS.forEach(function (c) {
            if (c.zone) return;
            var el = els[c.id], e = lay && lay.controls[c.id], slot = slots[c.id];
            if (!el || !e) {
                if (slot) {
                    if (el && el.parentNode === slot) H.home(c.id, el);
                    if (slot.parentNode) slot.parentNode.removeChild(slot);
                    delete slots[c.id];
                }
                return;
            }
            if (!slot) {
                slot = slots[c.id] = D.createElement('div');
                slot.className = 'lm-ed-slot' + (c.act ? ' lm-ed-act' : '');
                slot.setAttribute('data-lm-ctl', c.id);
                D.body.appendChild(slot);
            }
            if (el.parentNode !== slot) {
                /* measured where it was (a hidden slot has no size) */
                natSize(c.id, el);
                while (slot.firstChild) slot.removeChild(slot.firstChild);
                slot.appendChild(el);
            }
            /* shown first: a hidden slot has no size to measure */
            setStyle(slot, 'display', e.hide ? 'none' : 'flex');
            var nat = e.hide ? (natCache[c.id] || { w: 52, h: 52 }) : natSize(c.id, el);
            var r = entryRect(e, nat, v.w, v.h), s = r.w / nat.w;
            setStyle(slot, 'width', nat.w + 'px');
            setStyle(slot, 'height', nat.h + 'px');
            setStyle(slot, 'left', (r.x + r.w / 2 - nat.w / 2).toFixed(1) + 'px');
            setStyle(slot, 'top', (r.y + r.h / 2 - nat.h / 2).toFixed(1) + 'px');
            setStyle(slot, 'transform', 'scale(' + s.toFixed(3) + ')');
            setStyle(slot, 'opacity', String(e.o !== undefined ? e.o : H.prefs.btnOpacity));
        });
        var z = lay && lay.controls.joystick;
        if (z) {
            var zr = entryRect(z, null, v.w, v.h);
            H.setJoyZone({ l: zr.x, t: zr.y, r: zr.x + zr.w, b: zr.y + zr.h });
        } else H.setJoyZone(null);
    }
    /* the hook runs on every LMmobile.js button placement (resize, rotation, every 2.5 s) and
     * only while there is something to place: with no layout everything is back home */
    function syncHook() {
        apply();
        H.setHook(hasLayout(store) || Object.keys(slots).length ? apply : null);
    }

    /* ═══ Editor ═══ */

    var ov = null, bar = null, layDlg = null;
    var work = null;      /* { landscape, portrait } being edited */
    var orient = 'landscape';
    var defs = {};        /* id -> default rectangle (where LMmobile.js puts it) in this orientation */
    var fixedRects = [];  /* things that stay: minimap, the other left-row buttons */
    var px = {};          /* id -> proxy element */
    var sel = null;
    var drag = null;

    function present() {
        var els = H.controls(), out = [];
        CONTROLS.forEach(function (c) { if (c.zone || els[c.id]) out.push(c); });
        return out;
    }
    function rectOf(el) {
        var r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    function measure() {
        var v = vwh(), els = H.controls();
        defs = {};
        fixedRects = [];
        CONTROLS.forEach(function (c) {
            if (c.zone) { defs[c.id] = { x: 0, y: 0, w: v.w, h: v.h }; return; }
            var el = els[c.id];
            if (!el) return;
            natSize(c.id, el);
            var r = rectOf(el);
            defs[c.id] = r.w > 0 ? clampRect(r, v.w, v.h, 0) : { x: v.w / 2 - 26, y: v.h / 2 - 26, w: 52, h: 52 };
        });
        var mm = D.getElementById('minimap-hud');
        if (mm) {
            var mr = rectOf(mm);
            if (mr.w >= 10 && mr.h >= 10 && mr.x < v.w && mr.y < v.h) fixedRects.push({ id: 'minimap', lk: 'misc.editor.ctlMinimap', x: mr.x, y: mr.y, w: mr.w, h: mr.h, fixed: true });
        }
        var mine = [];
        for (var k in els) if (els[k]) mine.push(els[k]);
        var left = H.root && H.root.drawer ? H.root.drawer.children : [];
        for (var i = 0; i < left.length; i++) {
            var b = left[i];
            if (mine.indexOf(b) >= 0 || !/\blm-b\b/.test(b.className)) continue;
            var br = rectOf(b);
            if (br.w > 0 && br.h > 0) fixedRects.push({ id: 'left' + i, lk: 'misc.editor.ctlLeft', x: br.x, y: br.y, w: br.w, h: br.h, round: true, fixed: true });
        }
    }
    function layoutOf(o) { return work[o] || (work[o] = { controls: {} }); }
    function entryOf(id) { var l = work[orient]; return l && l.controls[id] ? l.controls[id] : null; }
    function rectFor(id) {
        var v = vwh(), e = entryOf(id);
        if (!e) return defs[id];
        return entryRect(e, CTL[id].zone ? null : natCache[id] || { w: 52, h: 52 }, v.w, v.h);
    }
    /* a control the player has not touched yet gets an entry where it is now, at its current size */
    function ensureEntry(id) {
        var e = entryOf(id);
        if (e) return e;
        var v = vwh(), r = defs[id];
        /* P1 fix #80: guard against missing default rectangle — a control not yet
         * in the DOM (or measure() not called) would crash on r.w */
        if (!r || !r.w) r = { x: v.w / 2 - 26, y: v.h / 2 - 26, w: 52, h: 52 };
        var nat = natCache[id] || { w: r.w, h: r.h };
        e = rectEntry(id, r, v.w, v.h, CTL[id].zone ? null : { s: r.w / nat.w });
        layoutOf(orient).controls[id] = e;
        return e;
    }
    function setRect(id, r) {
        var v = vwh(), base = ensureEntry(id);
        layoutOf(orient).controls[id] = rectEntry(id, clampRect(r, v.w, v.h, 0), v.w, v.h, base);
    }

    function el(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text !== undefined) e.textContent = text;
        return e;
    }
    /* text: a pack key ("misc.editor.save") or a symbol; title: a pack key. The data-i18n marks
     * let a language change while the editor is open update them (LMi18n.apply). */
    function btn(text, title, fn, cls, vars) {
        var isKey = /^misc\./.test(text);
        var b = el('button', cls, isKey ? T(text, vars) : text);
        b.type = 'button';
        if (isKey) b.setAttribute('data-i18n', text);
        if (title) { b.title = T(title, vars); b.setAttribute('data-i18n-title', title); }
        if (vars) b.setAttribute('data-i18n-vars', JSON.stringify(vars));
        b.addEventListener('click', function (ev) { ev.stopPropagation(); fn(); });
        return b;
    }

    function open() {
        if (editing) return;
        try { H.pauseInput(); } catch (e) { }
        editing = true;
        try {
            apply();             /* everything back home, so the usual places can be measured */
            try { H.reposition(); } catch (e) { }
            var v = vwh();
            orient = orientOf(v.w, v.h);
            measure();
            work = { landscape: copy(store.current.landscape), portrait: copy(store.current.portrait) };
            /* the handles stand in for the real controls while editing */
            var els = H.controls();
            for (var k in els) if (els[k]) els[k].style.visibility = 'hidden';
            D.body.classList.add('lm-ed-on');
            buildUI();
            render();
            W.addEventListener('resize', onResize);
        } catch (err) {
            /* never leave the controls invisible behind a broken editor */
            close(false);
            toast('error', T('misc.editor.openFailed'));
        }
    }
    function close(keep) {
        if (!editing) return;
        if (keep && work) {
            /* P1 fix #75: clone the work layouts into a temporary object first;
             * only commit them to store.current after save() succeeds, so a
             * failed write (storage full) does not leave corrupted state. */
            var pending = {};
            ORIENTS.forEach(function (o) { pending[o] = cleanLayout(work[o]); });
            var prev = { landscape: store.current.landscape, portrait: store.current.portrait };
            ORIENTS.forEach(function (o) { store.current[o] = pending[o]; });
            if (save()) {
                toast('success', T(orient === 'portrait' ? 'misc.editor.savedPortrait' : 'misc.editor.savedLandscape'));
            } else {
                store.current.landscape = prev.landscape;
                store.current.portrait = prev.portrait;
            }
        }
        W.removeEventListener('resize', onResize);
        if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
        ov = bar = layDlg = null;
        px = {};
        sel = null; drag = null; work = null;
        editing = false;
        D.body.classList.remove('lm-ed-on');
        var els = H.controls();
        for (var k in els) if (els[k]) els[k].style.visibility = '';
        syncHook();
        try { H.reposition(); } catch (e) { }
    }
    var resizeT = 0;
    function onResize() {
        clearTimeout(resizeT);
        /* after LMmobile.js has placed its groups for the new size */
        resizeT = setTimeout(function () {
            if (!ov) return;
            /* P1 fix #79: cancel any active drag — the starting coordinates
             * (drag.r0) are from the old viewport and would desync. */
            if (drag) { drag = null; ov.classList.remove('drag'); }
            var v = vwh();
            orient = orientOf(v.w, v.h);
            try { H.reposition(); } catch (e) { }
            measure();
            render();
        }, 250);
    }

    var ui = {};
    function buildUI() {
        ov = el('div');
        ov.id = 'lm-ed';
        if (store.snap) ov.classList.add('grid');
        bar = el('div');
        bar.id = 'lm-ed-bar';
        if (store.barBottom) bar.classList.add('bottom');
        var r1 = el('div', 'row'), r2 = el('div', 'row');
        r1.appendChild(btn('misc.editor.save', 'misc.editor.saveTitle', function () { close(true); }, 'pri'));
        r1.appendChild(btn('misc.editor.cancel', 'misc.editor.cancelTitle', function () { close(false); }));
        r1.appendChild(btn('misc.editor.reset', 'misc.editor.resetTitle', function () {
            work[orient] = null;
            render();
        }));
        ui.snap = btn('', 'misc.editor.snapTitle', function () {
            store.snap = !store.snap;
            ov.classList.toggle('grid', store.snap);
            render();
        }, '', [GRID]);
        r1.appendChild(ui.snap);
        r1.appendChild(btn('misc.editor.layouts', 'misc.editor.layoutsTitle', function () { showLayouts(); }));
        r1.appendChild(btn('⇅', 'misc.editor.barEdge', function () {
            store.barBottom = !store.barBottom;
            bar.classList.toggle('bottom', store.barBottom);
        }));
        ui.orient = el('span');
        ui.orient.id = 'lm-ed-o';
        r1.appendChild(ui.orient);

        ui.sel = el('select');
        ui.sel.id = 'lm-ed-sel';
        ui.sel.addEventListener('change', function () { select(ui.sel.value || null); });
        r2.appendChild(ui.sel);
        ui.minus = btn('−', 'misc.editor.smaller', function () { resizeSel(1 / 1.1); });
        ui.plus = btn('+', 'misc.editor.bigger', function () { resizeSel(1.1); });
        r2.appendChild(ui.minus);
        r2.appendChild(ui.plus);
        ui.op = el('input');
        ui.op.type = 'range'; ui.op.min = '15'; ui.op.max = '100'; ui.op.step = '5';
        ui.op.title = T('misc.editor.opacityTitle');
        ui.op.setAttribute('data-i18n-title', 'misc.editor.opacityTitle');
        ui.op.addEventListener('input', function () {
            if (!sel || CTL[sel].zone) return;
            ensureEntry(sel).o = Math.min(1, Math.max(LIM.o[0], Number(ui.op.value) / 100));
            render();
        });
        r2.appendChild(ui.op);
        ui.hide = btn('', 'misc.editor.hideTitle', function () {
            if (!sel || !CTL[sel].hide) return;
            var e = ensureEntry(sel);
            if (e.hide) delete e.hide; else e.hide = true;
            render();
        });
        r2.appendChild(ui.hide);
        ui.def = btn('misc.editor.def', 'misc.editor.defTitle', function () {
            if (!sel || !work[orient]) return;
            delete work[orient].controls[sel];
            render();
        });
        r2.appendChild(ui.def);
        ui.warn = el('span');
        ui.warn.id = 'lm-ed-warn';
        r2.appendChild(ui.warn);
        bar.appendChild(r1);
        bar.appendChild(r2);
        ov.appendChild(bar);
        ov.addEventListener('touchstart', onStart, { passive: false });
        ov.addEventListener('touchmove', onMove, { passive: false });
        ov.addEventListener('touchend', onEnd, { passive: false });
        ov.addEventListener('touchcancel', onEnd, { passive: false });
        D.body.appendChild(ov);
    }

    function render() {
        if (!ov) return;
        var v = vwh(), list = present();
        /* drop proxies of controls that went away */
        for (var k in px) {
            if (!list.some(function (c) { return c.id === k; })) {
                if (px[k].parentNode) px[k].parentNode.removeChild(px[k]);
                if (px[k]._tab && px[k]._tab.parentNode) px[k]._tab.parentNode.removeChild(px[k]._tab);
                if (px[k]._h && px[k]._h.parentNode) px[k]._h.parentNode.removeChild(px[k]._h);
                delete px[k];
            }
        }
        var old = ov.querySelectorAll('.lm-ed-fix');
        for (var i = 0; i < old.length; i++) old[i].parentNode.removeChild(old[i]);
        fixedRects.forEach(function (f) {
            var d = el('div', 'lm-ed-fix');
            place(d, f);
            if (f.round) d.style.borderRadius = '50%';
            ov.insertBefore(d, ov.firstChild);
        });
        var items = [];
        list.forEach(function (c) {
            var r = rectFor(c.id), e = entryOf(c.id), p = px[c.id];
            if (!r) return;
            if (!p) {
                if (c.zone) {
                    p = px[c.id] = el('div', 'lm-ed-zone');
                    p._tab = el('div', 'lm-ed-ztab', lab(c));
                    p._tab.setAttribute('data-i18n', c.lk);
                    p._tab.setAttribute('data-ed', c.id);
                    p._tab.setAttribute('data-ed-act', 'move');
                    p._h = el('div', 'lm-ed-zh', '⇲');
                    p._h.setAttribute('data-ed', c.id);
                    p._h.setAttribute('data-ed-act', 'size');
                    ov.insertBefore(p, bar);
                    ov.insertBefore(p._tab, bar);
                    ov.insertBefore(p._h, bar);
                } else {
                    p = px[c.id] = el('div', 'lm-ed-px', c.icon);
                    p.setAttribute('data-ed', c.id);
                    p.setAttribute('data-ed-act', 'move');
                    ov.insertBefore(p, bar);
                }
            }
            /* names in the chosen language (render runs again after a language change) */
            if (!c.zone) { p.title = lab(c); p.setAttribute('data-hid', T('misc.editor.hidden')); }
            place(p, r);
            p.classList.toggle('sel', sel === c.id);
            if (c.zone) {
                p._tab.style.left = (r.x + r.w / 2) + 'px';
                p._tab.style.top = (r.y + r.h / 2) + 'px';
                p._h.style.left = (r.x + r.w - 30) + 'px';
                p._h.style.top = (r.y + r.h - 30) + 'px';
                return;
            }
            p.style.fontSize = Math.max(11, Math.round(r.h * 0.36)) + 'px';
            var o = e && e.o !== undefined ? e.o : H.prefs.btnOpacity;
            p.style.opacity = String(Math.max(0.45, o));
            p.classList.toggle('hid', !!(e && e.hide));
            if (!(e && e.hide)) items.push({ id: c.id, lk: c.lk, lv: c.lv, x: r.x, y: r.y, w: r.w, h: r.h, round: true });
        });
        var pairs = findOverlaps(items.concat(fixedRects), 2);
        var bad = {};
        pairs.forEach(function (pr) { bad[pr[0]] = 1; bad[pr[1]] = 1; });
        list.forEach(function (c) { if (px[c.id] && !c.zone) px[c.id].classList.toggle('bad', !!bad[c.id]); });
        var names = function (id) { return CTL[id] ? lab(CTL[id]) : lab(fixedRects.filter(function (f) { return f.id === id; })[0] || { id: id }); };
        ui.warn.textContent = pairs.length ? '⚠ ' + pairs.slice(0, 2).map(function (pr) { return T('misc.editor.overlaps', [names(pr[0]), names(pr[1])]); }).join(', ') +
            (pairs.length > 2 ? ' (+' + (pairs.length - 2) + ')' : '') : '';
        ui.warn.title = ui.warn.textContent;
        api._overlaps = pairs;
        ui.snap.textContent = T(store.snap ? 'misc.editor.snapOn' : 'misc.editor.snapOff');
        ui.orient.textContent = T(orient === 'landscape' ? 'misc.editor.landscape' : 'misc.editor.portrait');
        /* control choice */
        var want = [''].concat(list.map(function (c) { return c.id; })).join(',');
        if (ui.sel._ids !== want) {
            while (ui.sel.firstChild) ui.sel.removeChild(ui.sel.firstChild);
            var o0 = el('option', '', T('misc.editor.choose'));
            o0.value = '';
            ui.sel.appendChild(o0);
            list.forEach(function (c) { var op = el('option', '', lab(c)); op.value = c.id; ui.sel.appendChild(op); });
            ui.sel._ids = want;
        }
        ui.sel.value = sel || '';
        var se = sel ? entryOf(sel) : null, isZone = sel && CTL[sel].zone;
        ui.minus.disabled = ui.plus.disabled = !sel;
        ui.op.disabled = !sel || isZone;
        ui.op.value = String(Math.round(100 * (se && se.o !== undefined ? se.o : H.prefs.btnOpacity)));
        ui.hide.disabled = !sel || !CTL[sel].hide;
        ui.hide.textContent = T(se && se.hide ? 'misc.editor.show' : 'misc.editor.hide');
        ui.def.disabled = !se;
    }
    function place(d, r) {
        d.style.left = r.x + 'px'; d.style.top = r.y + 'px';
        d.style.width = r.w + 'px'; d.style.height = r.h + 'px';
    }
    function select(id) {
        sel = id && CTL[id] ? id : null;
        render();
    }
    function resizeSel(f) {
        if (!sel) return;
        var e = ensureEntry(sel), v = vwh();
        if (CTL[sel].zone) {
            var r = rectFor(sel), w = Math.min(v.w, Math.max(LIM.zw[0] * v.w, r.w * f)), h = Math.min(v.h, Math.max(LIM.zh[0] * v.h, r.h * f));
            setRect(sel, { x: r.x + r.w / 2 - w / 2, y: r.y + r.h / 2 - h / 2, w: w, h: h });
        } else {
            e.s = Math.min(LIM.s[1], Math.max(LIM.s[0], fitScale(e.s * f, natCache[sel], v.w, v.h)));
            /* keep it on the screen at the new size */
            setRect(sel, rectFor(sel));
        }
        render();
    }

    /* ── touch: one finger drags, a second finger pinches the dragged control ── */
    function target(e) {
        var t = e.target;
        while (t && t !== ov) {
            if (t.getAttribute && t.getAttribute('data-ed')) return t;
            t = t.parentNode;
        }
        return null;
    }
    function inUi(e) {
        var t = e.target;
        return (bar && bar.contains(t)) || (layDlg && layDlg.contains(t));
    }
    function tDist(a, b) { var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY; return Math.sqrt(dx * dx + dy * dy); }
    function touchById(list, id) {
        for (var i = 0; i < list.length; i++) if (list[i].identifier === id) return list[i];
        return null;
    }
    function onStart(e) {
        if (inUi(e)) return;   /* the bar's buttons get their click */
        e.preventDefault();
        var t = e.changedTouches[0];
        if (drag && !drag.pinch && e.touches.length >= 2) {
            var a = touchById(e.touches, drag.tid), b = t.identifier === drag.tid ? null : t;
            if (a && b) {
                var r0 = rectFor(drag.id), en = ensureEntry(drag.id);
                drag.pinch = { tid2: b.identifier, d0: Math.max(10, tDist(a, b)), s0: en.s, r0: r0 };
            }
            return;
        }
        /* P2 fix #104: when two fingers touch down simultaneously (no existing drag),
         * check if both fingers hit the same control. The first becomes drag, the
         * second immediately starts a pinch. */
        if (!drag && e.touches.length >= 2) {
            var t0 = e.touches[0], t1 = e.touches[1];
            var hit0 = target({ target: document.elementFromPoint(t0.clientX, t0.clientY) || e.target });
            var hit1 = target({ target: document.elementFromPoint(t1.clientX, t1.clientY) || e.target });
            if (hit0 && hit1 && hit0.getAttribute('data-ed') === hit1.getAttribute('data-ed')) {
                var id = hit0.getAttribute('data-ed');
                sel = id;
                drag = { id: id, act: hit0.getAttribute('data-ed-act'), tid: t0.identifier, sx: t0.clientX, sy: t0.clientY, r0: rectFor(id), pinch: null, moved: false };
                var en2 = ensureEntry(id);
                drag.pinch = { tid2: t1.identifier, d0: Math.max(10, tDist(t0, t1)), s0: en2.s, r0: rectFor(id) };
                ov.classList.add('drag');
                render();
                return;
            }
        }
        if (drag) return;
        var hit = target(e);
        if (!hit) { select(null); return; }
        var id = hit.getAttribute('data-ed');
        sel = id;
        drag = { id: id, act: hit.getAttribute('data-ed-act'), tid: t.identifier, sx: t.clientX, sy: t.clientY, r0: rectFor(id), pinch: null, moved: false };
        ov.classList.add('drag');
        render();
    }
    function onMove(e) {
        if (!drag) return;
        e.preventDefault();
        var v = vwh(), c = CTL[drag.id];
        var a = touchById(e.touches, drag.tid);
        if (drag.pinch) {
            var b = touchById(e.touches, drag.pinch.tid2);
            if (!a || !b) return;
            var f = tDist(a, b) / drag.pinch.d0, r0 = drag.pinch.r0, nr;
            if (c.zone) {
                var w = Math.min(v.w, Math.max(LIM.zw[0] * v.w, r0.w * f)), h = Math.min(v.h, Math.max(LIM.zh[0] * v.h, r0.h * f));
                nr = { x: r0.x + r0.w / 2 - w / 2, y: r0.y + r0.h / 2 - h / 2, w: w, h: h };
            } else {
                var en = ensureEntry(drag.id);
                en.s = Math.min(LIM.s[1], Math.max(LIM.s[0], fitScale(drag.pinch.s0 * f, natCache[drag.id], v.w, v.h)));
                var k = en.s / drag.pinch.s0;
                nr = { x: r0.x + r0.w / 2 - r0.w * k / 2, y: r0.y + r0.h / 2 - r0.h * k / 2, w: r0.w * k, h: r0.h * k };
            }
            setRect(drag.id, nr);
            drag.moved = true;
            render();
            return;
        }
        if (!a) return;
        var dx = a.clientX - drag.sx, dy = a.clientY - drag.sy;
        if (!drag.moved && dx * dx + dy * dy < 16) return;
        drag.moved = true;
        var r = drag.r0, out;
        if (drag.act === 'size') {
            out = { x: r.x, y: r.y, w: Math.max(LIM.zw[0] * v.w, Math.min(v.w - r.x, r.w + dx)), h: Math.max(LIM.zh[0] * v.h, Math.min(v.h - r.y, r.h + dy)) };
            if (store.snap) {
                if (v.w - (out.x + out.w) <= EDGE) out.w = v.w - out.x;
                if (v.h - (out.y + out.h) <= EDGE) out.h = v.h - out.y;
            }
        } else {
            out = { x: r.x + dx, y: r.y + dy, w: r.w, h: r.h };
            /* the joystick zone snaps flush to the edges, buttons keep a small margin */
            if (store.snap) out = snapRect(out, v.w, v.h, GRID, EDGE, c.zone ? 0 : MARGIN);
        }
        setRect(drag.id, out);
        render();
    }
    function onEnd(e) {
        if (!drag) return;
        if (drag.pinch && touchById(e.changedTouches, drag.pinch.tid2)) {
            /* second finger up: the first one drags on from here */
            var a = touchById(e.touches, drag.tid);
            drag.pinch = null;
            /* P0 fix: if both fingers lifted simultaneously, a is null —
             * clear drag entirely instead of leaving it stuck */
            if (!a) {
                e.preventDefault();
                drag = null;
                ov.classList.remove('drag');
                render();
                return;
            }
            drag.sx = a.clientX; drag.sy = a.clientY; drag.r0 = rectFor(drag.id);
            return;
        }
        if (!touchById(e.changedTouches, drag.tid)) return;
        e.preventDefault();
        drag = null;
        ov.classList.remove('drag');
        render();
    }

    /* ── named layouts ── */
    function showLayouts() {
        if (layDlg) { layDlg.parentNode.removeChild(layDlg); layDlg = null; return; }
        layDlg = el('div');
        layDlg.id = 'lm-ed-lay';
        var hd = el('div', 'hd');
        hd.appendChild(el('span', '', T('misc.editor.named')));
        hd.appendChild(btn('✕', 'misc.close', function () { showLayouts(); }));
        layDlg.appendChild(hd);
        var names = Object.keys(store.named);
        if (!names.length) layDlg.appendChild(el('div', '', T('misc.editor.none')));
        names.forEach(function (n) {
            var it = el('div', 'it');
            var lb = el('span', '', n + (store.active === n ? ' ✓' : ''));
            lb.title = n;
            it.appendChild(lb);
            it.appendChild(btn('misc.editor.load', 'misc.editor.loadTitle', function () {
                var p = store.named[n];
                if (!p) return;
                work = { landscape: copy(p.landscape), portrait: copy(p.portrait) };
                /* P1 fix #77: do not set store.active here — it desynchronizes with
                 * store.current if the user cancels without saving. The active layout
                 * will be recorded when Save/saveNamed is called. */
                showLayouts();
                render();
            }));
            it.appendChild(btn('✕', 'misc.editor.del', function () {
                delete store.named[n];
                if (store.active === n) store.active = null;
                save();
                showLayouts();
            }));
            layDlg.appendChild(it);
        });
        var row = el('div', 'it');
        var inp = el('input');
        inp.type = 'text';
        inp.maxLength = NAME_MAX;
        inp.placeholder = T('misc.editor.namePlaceholder');
        inp.id = 'lm-ed-name';
        if (store.active) inp.value = store.active;
        row.appendChild(inp);
        row.appendChild(btn('misc.editor.saveAs', 'misc.editor.saveAsTitle', function () {
            var n = saveNamed(inp.value);
            if (n) { showLayouts(); }
        }));
        layDlg.appendChild(row);
        ov.appendChild(layDlg);
    }
    function saveNamed(name) {
        var n = cleanName(name);
        if (!n) { toast('warning', T('misc.editor.nameNeeded', [NAME_MAX])); return null; }
        if (!own(store.named, n) && Object.keys(store.named).length >= MAX_NAMED) {
            toast('warning', T('misc.editor.maxNamed', [MAX_NAMED]));
            return null;
        }
        /* P1 fix #76: save previous state so a failed persist can be rolled back */
        var prevNamed = own(store.named, n) ? store.named[n] : undefined;
        var prevActive = store.active;
        store.named[n] = { landscape: cleanLayout(work.landscape), portrait: cleanLayout(work.portrait) };
        store.active = n;
        if (!save()) {
            if (prevNamed === undefined) delete store.named[n]; else store.named[n] = prevNamed;
            store.active = prevActive;
            return null;
        }
        toast('success', T('misc.editor.namedSaved', [n]));
        return n;
    }

    api.open = open;
    /* a language change while the editor is open: the bar's marked texts follow (LMi18n.apply), the
     * texts render() writes (names, warnings, Snap, Show/Hide, the control list) are written again */
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(function () {
        if (!ov) return;
        if (ui.sel) ui.sel._ids = null;
        for (var k in px) if (px[k] && px[k]._tab) px[k]._tab.textContent = lab(CTL[k]);
        if (layDlg) { showLayouts(); showLayouts(); }
        render();
    });
    api.close = close;
    api.isOpen = function () { return !!ov; };
    /* read the saved layouts again (an import, a probe) and place the controls */
    api.reload = function () {
        store = load();
        if (!editing) syncHook();
        return store;
    };
    api.store = function () { return copy(store); };
    api.select = select;
    api.saveNamed = function (n) { return work ? saveNamed(n) : null; };
    api.ready = true;

    syncHook();
})();
