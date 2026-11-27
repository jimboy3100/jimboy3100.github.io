/* Legend Mod HUD layouts: moved, resized, locked or hidden HUD boxes, saved as named layouts
 * (localStorage lmHudLayouts, validated on read). This file is the small part that applies the
 * active layout; the editor itself (frames, snapping, the layouts panel) is in hudeditor-ui.js,
 * loaded the first time the editor opens (Theme > HUD > Edit HUD).
 *
 * With no active layout nothing is applied: no style element, no timer, every box where the game
 * puts it. A layout only lists the boxes the player changed; the others keep their normal place.
 * A box position is kept relative to its nearest screen edge (or the centre), so a layout made on
 * one screen still fits another, and it is clamped into the screen on load, resize and rotation
 * (the saved value is kept: back on the bigger screen the box goes back where it was).
 *
 * The positions are one stylesheet of !important rules: they win over the theme settings (HUD
 * scale, minimap size), the phone stylesheet and the
 * inline styles other code writes, and removing the stylesheet restores all of that unchanged.
 */
(function () {
    'use strict';
    var W = typeof window !== 'undefined' ? window : this;
    if (W._lmHudEditorLoaded) return;
    W._lmHudEditorLoaded = true;

    var KEY = 'lmHudLayouts';
    var MAX_LAYOUTS = 20;
    var NAME_MAX = 30;
    var S_MIN = 0.3, S_MAX = 3;
    var OFF_MAX = 10000;
    var GRIDS = [0, 8, 16, 32];
    var own = Object.prototype.hasOwnProperty;

    /* The HUD boxes the editor knows. sel: the element; extra: parts drawn outside its box that
     * must stay on screen too (the leaderboard mass column, the toolbars above the minimap). */
    var COMPONENTS = [
        { id: 'leaderboard', sel: '#leaderboard-hud', extra: '#leaderboard-hud > *' },
        { id: 'minimap', sel: '#minimap-hud', extra: '#minimap-hud > *' },
        /* phones hide the full stats line with an !important rule until the phone stats are tapped:
         * shownOnTap lets the editor still measure and place it there */
        { id: 'stats', sel: '#stats-hud', shownOnTap: true },
        { id: 'phoneStats', sel: '#lm-stats' },
        { id: 'team', sel: '#top5-hud' },
        { id: 'time', sel: '#time-hud' },
        { id: 'target', sel: '#target-hud' },
        { id: 'targetPanel', sel: '#target-panel-hud' },
        { id: 'chatBox', sel: '#chat-box' },
        { id: 'chatInput', sel: '#message-box' },
        { id: 'popups', sel: '#toast-container' }
    ];
    var BY_ID = {};
    COMPONENTS.forEach(function (c) { BY_ID[c.id] = c; });

    /* ═══ Pure parts (developers/tests/hudeditor.js) ═══ */

    function num(v, min, max, def) {
        v = typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN);
        if (!isFinite(v)) return def;
        return Math.min(max, Math.max(min, v));
    }
    function cleanName(s) {
        if (typeof s !== 'string') return '';
        return s.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX).trim();
    }
    /* { h: 'l'|'r'|'c', x, v: 't'|'b'|'c', y, s, lock, hide }; without h/v the box keeps its normal
     * place (only locked / hidden). x, y: px from that edge, or of the box centre from the screen centre. */
    function cleanEntry(e) {
        if (!e || typeof e !== 'object' || Array.isArray(e)) return null;
        var out = {};
        if ((e.h === 'l' || e.h === 'r' || e.h === 'c') && (e.v === 't' || e.v === 'b' || e.v === 'c')) {
            var x = num(e.x, -OFF_MAX, OFF_MAX, NaN), y = num(e.y, -OFF_MAX, OFF_MAX, NaN);
            if (isFinite(x) && isFinite(y)) {
                out.h = e.h; out.x = Math.round(x);
                out.v = e.v; out.y = Math.round(y);
                out.s = Math.round(num(e.s, S_MIN, S_MAX, 1) * 1000) / 1000;
            }
        }
        if (e.lock === true) out.lock = true;
        if (e.hide === true) out.hide = true;
        return out.h || out.lock || out.hide ? out : null;
    }
    function cleanComps(c) {
        var out = {};
        if (!c || typeof c !== 'object' || Array.isArray(c)) return out;
        for (var id in c) {
            if (!own.call(c, id) || !own.call(BY_ID, id)) continue;
            var e = cleanEntry(c[id]);
            if (e) out[id] = e;
        }
        return out;
    }
    function findIndex(list, name) {
        var n = cleanName(name).toLowerCase();
        if (!n) return -1;
        for (var i = 0; i < list.length; i++) if (list[i].name.toLowerCase() === n) return i;
        return -1;
    }
    /* The stored object, or a raw JSON string of it, to a valid store; anything broken is dropped. */
    function cleanStore(raw) {
        var o = raw;
        if (typeof raw === 'string') { try { o = JSON.parse(raw); } catch (e) { o = null; } }
        var st = { v: 1, active: '', list: [], prefs: { snap: true, grid: 0 }, links: {} };
        if (!o || typeof o !== 'object' || Array.isArray(o)) return st;
        if (Array.isArray(o.list)) {
            for (var i = 0; i < o.list.length && st.list.length < MAX_LAYOUTS; i++) {
                var l = o.list[i];
                if (!l || typeof l !== 'object') continue;
                var name = cleanName(l.name);
                if (!name || findIndex(st.list, name) >= 0) continue;
                st.list.push({ name: name, c: cleanComps(l.c) });
            }
        }
        var a = findIndex(st.list, o.active);
        st.active = a >= 0 ? st.list[a].name : '';
        if (o.prefs && typeof o.prefs === 'object') {
            st.prefs.snap = o.prefs.snap !== false;
            st.prefs.grid = GRIDS.indexOf(o.prefs.grid) >= 0 ? o.prefs.grid : 0;
        }
        if (o.links && typeof o.links === 'object' && !Array.isArray(o.links)) {
            var n = 0;
            for (var pid in o.links) {
                if (!own.call(o.links, pid) || !/^[A-Za-z0-9_-]{1,40}$/.test(pid)) continue;
                var li = findIndex(st.list, o.links[pid]);
                if (li >= 0 && n++ < 100) st.links[pid] = st.list[li].name;
            }
        }
        return st;
    }

    /* visual left / top of a box of visual size w x h placed by an entry */
    function visualPos(e, w, h, view) {
        var left = e.h === 'l' ? e.x : e.h === 'r' ? view.w - e.x - w : view.w / 2 + e.x - w / 2;
        var top = e.v === 't' ? e.y : e.v === 'b' ? view.h - e.y - h : view.h / 2 + e.y - h / 2;
        return { left: left, top: top };
    }
    /* A dropped box (visual rect) to an entry, anchored to the nearest edge: left / right third
     * of the screen to that edge, the middle third to the centre. */
    function entryFromRect(r, view, s) {
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2, e = {};
        if (cx < view.w / 3) { e.h = 'l'; e.x = r.left; }
        else if (cx > view.w * 2 / 3) { e.h = 'r'; e.x = view.w - r.left - r.width; }
        else { e.h = 'c'; e.x = cx - view.w / 2; }
        if (cy < view.h / 3) { e.v = 't'; e.y = r.top; }
        else if (cy > view.h * 2 / 3) { e.v = 'b'; e.y = view.h - r.top - r.height; }
        else { e.v = 'c'; e.y = cy - view.h / 2; }
        e.x = Math.round(e.x); e.y = Math.round(e.y);
        e.s = Math.round(num(s, S_MIN, S_MAX, 1) * 1000) / 1000;
        return e;
    }
    function offsetFor(anchor, pos, size, full) {
        return anchor === 'l' || anchor === 't' ? pos : anchor === 'r' || anchor === 'b' ? full - pos - size : pos + size / 2 - full / 2;
    }
    /* Keeps a positioned entry on screen. box: unscaled size w x h of the element plus the parts
     * outside it (el, er, et, eb, unscaled px). Too big for the screen: scaled down to fit (never
     * below the minimum), then placed against the top / left edge. Returns a new entry. */
    function clampEntry(e, box, view) {
        if (!e || !e.h) return e;
        var bl = box.el || 0, br = box.er || 0, bt = box.et || 0, bb = box.eb || 0;
        var s = e.s || 1;
        var fw = box.w + bl + br, fh = box.h + bt + bb;
        if (fw > 0 && fh > 0) s = Math.max(Math.min(s, S_MIN), Math.min(s, view.w / fw, view.h / fh));
        var w = box.w * s, h = box.h * s;
        var p = visualPos(e, w, h, view);
        var minL = bl * s, maxL = view.w - w - br * s, minT = bt * s, maxT = view.h - h - bb * s;
        var left = maxL < minL ? minL : Math.min(maxL, Math.max(minL, p.left));
        var top = maxT < minT ? minT : Math.min(maxT, Math.max(minT, p.top));
        var out = {};
        for (var k in e) if (own.call(e, k)) out[k] = e[k];
        out.s = Math.round(s * 1000) / 1000;
        out.x = Math.round(offsetFor(e.h, left, w, view.w));
        out.y = Math.round(offsetFor(e.v, top, h, view.h));
        return out;
    }
    function rectIn(r, view, tol) {
        tol = tol || 0;
        return r.left >= -tol && r.top >= -tol && r.left + r.width <= view.w + tol && r.top + r.height <= view.h + tol;
    }
    /* Snaps a moving visual rect {left, top, width, height}: its edges and centre to the screen
     * edges and centre and to the edges / centres of the other boxes (within th px), else to the
     * grid. Returns { left, top, gx, gy } (gx / gy: the line it snapped to, for a guide, or null). */
    function snapRect(r, others, view, opts) {
        opts = opts || {};
        var th = opts.th || 8, grid = opts.grid || 0;
        function axis(pos, size, full, lines) {
            var best = null;
            if (opts.snap !== false) {
                var mine = [0, size / 2, size];
                for (var i = 0; i < lines.length; i++) {
                    for (var j = 0; j < 3; j++) {
                        var d = lines[i] - (pos + mine[j]);
                        if (Math.abs(d) <= th && (!best || Math.abs(d) < Math.abs(best.d))) best = { d: d, line: lines[i] };
                    }
                }
            }
            if (best) return { pos: pos + best.d, line: best.line };
            if (grid > 0) return { pos: Math.round(pos / grid) * grid, line: null };
            return { pos: pos, line: null };
        }
        var xs = [0, view.w / 2, view.w], ys = [0, view.h / 2, view.h];
        (others || []).forEach(function (o) {
            xs.push(o.left, o.left + o.width / 2, o.left + o.width);
            ys.push(o.top, o.top + o.height / 2, o.top + o.height);
        });
        var ax = axis(r.left, r.width, view.w, xs), ay = axis(r.top, r.height, view.h, ys);
        return { left: ax.pos, top: ay.pos, gx: ax.line, gy: ay.line };
    }
    /* Stacking of the editor frames: a smaller box above a bigger one, so a box drawn inside or
     * over another (the stats line under the chat box on a phone) can still be grabbed.
     * rects: [{ width, height }] or null (no frame); returns a z-index per rect (1 = bottom). */
    function frameLayers(rects) {
        var idx = [], out = [];
        for (var i = 0; i < rects.length; i++) {
            out.push(0);
            if (rects[i]) idx.push(i);
        }
        var area = function (r) { return Math.max(0, r.width) * Math.max(0, r.height); };
        /* biggest first; equal sizes keep the list order (the later one on top, as before) */
        idx.sort(function (a, b) { return area(rects[b]) - area(rects[a]) || a - b; });
        for (var j = 0; j < idx.length; j++) out[idx[j]] = j + 1;
        return out;
    }
    /* Where the name label of each frame goes. Boxes that share a corner (the stats line, phone
     * stats, team list and chat box at the top left) all drew their label at the same spot, and
     * a resize handle in a frame's top left corner covered the label there. A label keeps its
     * usual spot (above the frame at its left edge, inside the frame's top when there is no room
     * above) when that is free; otherwise it moves right along the frame's top, then one label
     * line lower, until it overlaps no other label and no handle.
     * items: [{ f: frame rect, w, h: label size }] or null; obstacles: rects (the handles).
     * Returns [{ left, top }] (screen px) or null per item. */
    function labelSpots(items, obstacles, view) {
        var placed = [], out = [];
        var hit = function (a, b) { return a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height; };
        var blocker = function (r) {
            var all = placed.concat(obstacles || []);
            for (var i = 0; i < all.length; i++) if (hit(r, all[i])) return all[i];
            return null;
        };
        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            if (!it || !it.f) { out.push(null); continue; }
            var f = it.f, w = it.w, h = it.h, ys = [];
            if (f.top + 2 - h >= 0) ys.push(f.top + 2 - h);
            for (var y = f.top + 2; y <= f.top + Math.max(2, f.height - h) && ys.length < 8; y += h) ys.push(y);
            ys.push(f.top + f.height);
            /* first over the frame's own width; a small frame: further right if needed */
            var maxXs = [Math.min(view.w - w, Math.max(f.left, f.left + f.width - w)), view.w - w], spot = null;
            for (var p = 0; p < 2 && !spot; p++) {
                for (var k = 0; k < ys.length && !spot; k++) {
                    var r = { left: Math.max(0, Math.min(f.left, view.w - w)), top: Math.max(0, Math.min(ys[k], view.h - h)), width: w, height: h };
                    for (var n = 0; n < 24; n++) {
                        var b = blocker(r);
                        if (!b) { spot = r; break; }
                        r = { left: b.left + b.width + 1, top: r.top, width: w, height: h };
                        if (r.left > maxXs[p]) break;
                    }
                }
            }
            /* nowhere free: the usual spot */
            if (!spot) spot = { left: Math.max(0, Math.min(f.left, view.w - w)), top: Math.max(0, Math.min(ys[0], view.h - h)), width: w, height: h };
            placed.push(spot);
            out.push({ left: spot.left, top: spot.top });
        }
        return out;
    }
    /* the stylesheet rule of one box */
    function cssFor(sel, e, editing) {
        if (!e) return '';
        var p = 'html body ' + sel + '{', imp = '!important;';
        if (e.hide) {
            if (!editing) return p + 'display:none' + imp + '}';
            p += 'opacity:.35' + imp;
        }
        if (e.h) {
            p += 'position:fixed' + imp + 'margin:0' + imp;
            p += e.h === 'l' ? 'left:' + e.x + 'px' + imp + 'right:auto' + imp
                : e.h === 'r' ? 'right:' + e.x + 'px' + imp + 'left:auto' + imp
                    : 'left:calc(50% + ' + e.x + 'px)' + imp + 'right:auto' + imp;
            p += e.v === 't' ? 'top:' + e.y + 'px' + imp + 'bottom:auto' + imp
                : e.v === 'b' ? 'bottom:' + e.y + 'px' + imp + 'top:auto' + imp
                    : 'top:calc(50% + ' + e.y + 'px)' + imp + 'bottom:auto' + imp;
            var tx = e.h === 'c' ? '-50%' : '0', ty = e.v === 'c' ? '-50%' : '0';
            p += 'transform:' + (tx !== '0' || ty !== '0' ? 'translate(' + tx + ',' + ty + ') ' : '') + 'scale(' + (e.s || 1) + ')' + imp;
            p += 'transform-origin:' + (e.h === 'l' ? 'left' : e.h === 'r' ? 'right' : 'center') + ' ' + (e.v === 't' ? 'top' : e.v === 'b' ? 'bottom' : 'center') + imp;
        }
        return p + '}';
    }

    var core = {
        COMPONENTS: COMPONENTS, KEY: KEY, MAX_LAYOUTS: MAX_LAYOUTS, NAME_MAX: NAME_MAX, S_MIN: S_MIN, S_MAX: S_MAX, GRIDS: GRIDS,
        cleanName: cleanName, cleanEntry: cleanEntry, cleanComps: cleanComps, cleanStore: cleanStore, findIndex: findIndex,
        visualPos: visualPos, entryFromRect: entryFromRect, clampEntry: clampEntry, rectIn: rectIn, snapRect: snapRect, cssFor: cssFor,
        frameLayers: frameLayers, labelSpots: labelSpots
    };
    var api = W.LMHudEditor = { core: core, components: COMPONENTS };

    /* ═══ Text (the shared language packs: developers/i18n/src) ═══ */

    var P = 'modules.hudeditor.';
    function tx(k, vars) { return typeof W.lmT === 'function' ? W.lmT(P + k, vars) : k; }
    /* a box name in the chosen language (the editor UI uses it too) */
    api.compLabel = function (c) { return tx('comp.' + c.id); };

    /* ═══ Storage ═══ */

    var store = null;
    function load() {
        if (store) return store;
        var raw = null;
        try { raw = W.localStorage ? W.localStorage.getItem(KEY) : null; } catch (e) { }
        store = cleanStore(raw);
        return store;
    }
    function save() {
        try { W.localStorage.setItem(KEY, JSON.stringify(load())); return true; } catch (e) { return false; }
    }
    function layoutByName(name) {
        var st = load(), i = findIndex(st.list, name);
        return i >= 0 ? st.list[i] : null;
    }
    function clone(o) { return JSON.parse(JSON.stringify(o)); }

    /* ═══ Applying ═══ */

    var D = W.document;
    var preview = null; /* the editor's draft { c, editing } while it is open */
    var boosts = {};    /* temporary size factors (phone minimap tap) */
    var eff = {};       /* the entries as drawn: clamped to the screen */
    var styleEl = null, timer = 0, rafId = 0;

    function comps() {
        if (preview) return preview.c;
        var l = layoutByName(load().active);
        return l ? l.c : null;
    }
    function hasWork(c) { for (var k in c) if (own.call(c, k)) return true; return false; }
    function view() {
        var de = D.documentElement;
        return { w: W.innerWidth || (de && de.clientWidth) || 0, h: W.innerHeight || (de && de.clientHeight) || 0 };
    }
    function withBoost(id, e) {
        if (!e || !e.h || !boosts[id]) return e;
        var o = clone(e);
        o.s = Math.min(S_MAX, (o.s || 1) * boosts[id]);
        return o;
    }
    function writeStyle(c) {
        var css = '', editing = !!(preview && preview.editing);
        for (var i = 0; i < COMPONENTS.length; i++) {
            var id = COMPONENTS[i].id;
            if (!own.call(c, id)) continue;
            css += cssFor(COMPONENTS[i].sel, eff[id] || withBoost(id, c[id]), editing);
        }
        if (!styleEl || !styleEl.parentNode) {
            styleEl = D.getElementById('lm-hud-layout');
            if (!styleEl) {
                styleEl = D.createElement('style');
                styleEl.id = 'lm-hud-layout';
                (D.head || D.documentElement).appendChild(styleEl);
            }
        }
        if (styleEl.textContent !== css) styleEl.textContent = css;
    }
    /* Phone code sets some transforms inline with !important (tablet scale, minimap tap), which
     * would beat the layout: moved boxes get theirs put aside, and back when the layout ends. */
    function stashInline(el, take) {
        if (!el || !el.style || !el.dataset) return;
        if (take) {
            if (el.style.getPropertyPriority('transform') === 'important') {
                el.dataset.lmHeT = el.style.getPropertyValue('transform');
                el.style.removeProperty('transform');
            }
        } else if (el.dataset.lmHeT != null) {
            el.style.setProperty('transform', el.dataset.lmHeT, 'important');
            delete el.dataset.lmHeT;
            return true;
        }
    }
    /* That transform was set aside when the box was taken: the phone leaderboard fit (rows that
     * came or went meanwhile) and the buttons around the minimap are redone at once, not on their
     * next 2.5 s round (a 20-row leaderboard came back at its old size over the buttons). */
    function phoneRefit() {
        var host = W._lmMobileHost;
        if (host && typeof host.reposition === 'function') { try { host.reposition(); } catch (e) { } }
    }
    /* unscaled size of a box and the parts drawn outside it */
    function measureBox(el, c) {
        var r = el.getBoundingClientRect();
        if (!(r.width >= 1 && r.height >= 1)) return null;
        var ow = el.offsetWidth || r.width, oh = el.offsetHeight || r.height;
        var k = r.width / ow || 1;
        var u = { l: r.left, t: r.top, r: r.right, b: r.bottom };
        if (c.extra) {
            var xs = D.querySelectorAll(c.extra);
            for (var i = 0; i < xs.length && i < 40; i++) {
                var q = xs[i].getBoundingClientRect();
                if (!(q.width >= 1 && q.height >= 1)) continue;
                if (q.left < u.l) u.l = q.left;
                if (q.top < u.t) u.t = q.top;
                if (q.right > u.r) u.r = q.right;
                if (q.bottom > u.b) u.b = q.bottom;
            }
        }
        return { w: ow, h: oh, el: (r.left - u.l) / k, er: (u.r - r.right) / k, et: (r.top - u.t) / k, eb: (u.b - r.bottom) / k };
    }
    function same(a, b) { return !!a && !!b && a.x === b.x && a.y === b.y && a.s === b.s && a.h === b.h && a.v === b.v && a.hide === b.hide; }
    /* measure the moved boxes and keep them on screen */
    function check() {
        var c = comps();
        if (!c || !hasWork(c)) return;
        var v = view(), changed = false;
        if (!(v.w > 0 && v.h > 0)) return;
        for (var i = 0; i < COMPONENTS.length; i++) {
            var comp = COMPONENTS[i], e = c[comp.id];
            var el = D.querySelector(comp.sel);
            if (el && e && e.h) stashInline(el, true);
            if (!e || !e.h || !el) continue;
            var box = measureBox(el, comp);
            if (!box) continue;
            var ce = clampEntry(withBoost(comp.id, e), box, v);
            if (!same(ce, eff[comp.id])) { eff[comp.id] = ce; changed = true; }
        }
        if (changed) writeStyle(c);
    }
    /* The long leaderboard fit (application._lmLbFit) leaves the leaderboard alone while a layout
     * moves it or the minimap: when that changes it fits again at once. It ran only when a size
     * changed, so a layout that moved the minimap away kept the leaderboard small. */
    var lbOwned = '';
    function lbRefit(c) {
        var k = (c && c.leaderboard && c.leaderboard.h ? 'l' : '') + (c && c.minimap && c.minimap.h ? 'm' : '');
        if (k === lbOwned) return;
        lbOwned = k;
        var app = W.application;
        if (app && typeof app._lmLbFit === 'function') { try { app._lmLbFit(); } catch (e) { } }
    }
    function render() {
        if (!D || typeof D.createElement !== 'function') return;
        var c = comps();
        if (!c || !hasWork(c)) {
            if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
            styleEl = null;
            if (timer) { clearInterval(timer); timer = 0; }
            eff = {};
            if (restoreAll(null)) phoneRefit();
            lbRefit(null);
            return;
        }
        var back = restoreAll(c);
        /* keep the clamped value only for unchanged entries (it is re-measured right after) */
        var next = {};
        for (var id in eff) if (own.call(eff, id) && c[id] && c[id].h) next[id] = eff[id];
        eff = next;
        writeStyle(c);
        check();
        if (!timer) timer = setInterval(function () { try { if (!D.hidden) check(); } catch (e) { } }, 1000);
        if (back) phoneRefit();
        lbRefit(c);
    }
    /* true when a box got its own transform back */
    function restoreAll(c) {
        var back = false;
        for (var i = 0; i < COMPONENTS.length; i++) {
            var id = COMPONENTS[i].id;
            if (c && c[id] && c[id].h) continue;
            var el = D.querySelector(COMPONENTS[i].sel);
            if (el && stashInline(el, false)) back = true;
        }
        return back;
    }
    function refresh() {
        if (!comps() && !styleEl) return;
        eff = {};
        render();
    }
    function refreshSoon() {
        if ((!comps() && !styleEl) || rafId) return;
        var raf = W.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
        rafId = raf(function () { rafId = 0; try { refresh(); } catch (e) { } });
    }

    /* ═══ API ═══ */

    api.list = function () { return load().list.map(function (l) { return l.name; }); };
    api.active = function () { return load().active; };
    api.get = function (name) { var l = layoutByName(name); return l ? clone(l) : null; };
    api.prefs = function () { return clone(load().prefs); };
    api.setPrefs = function (p) {
        var st = load();
        if (p && typeof p.snap === 'boolean') st.prefs.snap = p.snap;
        if (p && GRIDS.indexOf(p.grid) >= 0) st.prefs.grid = p.grid;
        return save();
    };
    /* Applies a saved layout by name; '' or null: the normal HUD. For scripts and settings profiles.
     * false (nothing changes) when there is no such layout or it cannot be saved. */
    api.applyLayout = function (name, quiet) {
        var st = load(), l = name ? layoutByName(name) : null;
        if (name && !l) return false;
        var prev = st.active, next = l ? l.name : '';
        st.active = next;
        if (prev !== next && !save()) { st.active = prev; return false; }
        boosts = {};
        if (!preview) { eff = {}; render(); }
        syncSelect();
        if (!quiet && W.toastr) { try { W.toastr.info(esc(tx('applied', l ? l.name : tx('defaultHud')))); } catch (e) { } }
        return true;
    };
    /* the stored layouts as text with another active one ('' the normal HUD), or null when there
     * is no such layout; nothing changes (settings profiles write it in their own transaction) */
    api.storeText = function (name) {
        var l = name ? layoutByName(name) : null;
        if (name && !l) return null;
        var o = clone(load());
        o.active = l ? l.name : '';
        return JSON.stringify(o);
    };
    /* Saves (or replaces) a layout; returns its stored name or '' (bad name, full list, storage full). */
    api.saveLayout = function (name, c) {
        var st = load(), n = cleanName(name);
        if (!n) return '';
        var i = findIndex(st.list, n), cc = cleanComps(c);
        var old = i >= 0 ? st.list[i] : null;
        if (old) st.list[i] = { name: old.name, c: cc };
        else if (st.list.length >= MAX_LAYOUTS) return '';
        else st.list.push({ name: n, c: cc });
        if (!save()) {
            if (old) st.list[i] = old; else st.list.pop();
            return '';
        }
        syncSelect();
        return old ? old.name : n;
    };
    api.deleteLayout = function (name) {
        var st = load(), i = findIndex(st.list, name);
        if (i < 0) return false;
        var n = st.list[i].name, before = { list: st.list.slice(), active: st.active, links: clone(st.links) };
        st.list.splice(i, 1);
        if (st.active === n) st.active = '';
        for (var pid in st.links) if (own.call(st.links, pid) && st.links[pid] === n) delete st.links[pid];
        if (!save()) { st.list = before.list; st.active = before.active; st.links = before.links; return false; }
        if (!preview) refresh();
        syncSelect();
        return true;
    };
    /* settings profiles: a profile can bring a layout with it (LMProfiles calls onProfileApplied) */
    api.linkProfile = function (profileId, name) {
        var st = load();
        if (typeof profileId !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(profileId)) return false;
        var l = name ? layoutByName(name) : null;
        var had = own.call(st.links, profileId), old = st.links[profileId];
        if (l) st.links[profileId] = l.name; else delete st.links[profileId];
        if (save()) return true;
        if (had) st.links[profileId] = old; else delete st.links[profileId];
        return false;
    };
    api.links = function () { return clone(load().links); };
    api.profileLayout = function (profileId) { var n = load().links[profileId]; return typeof n === 'string' ? n : ''; };
    api.onProfileApplied = function (profileId) {
        var n = api.profileLayout(profileId);
        if (n && layoutByName(n)) api.applyLayout(n, true);
    };
    /* true when the drawn layout moves this box (runtime code that places it itself then defers) */
    api.owns = function (id) { var c = comps(); return !!(c && c[id] && c[id].h); };
    /* temporary size factor for a moved box (0 or 1: none), clamped to the screen like the rest */
    api.boost = function (id, f) {
        if (!own.call(BY_ID, id)) return;
        if (f && f !== 1 && isFinite(f) && f > 0) boosts[id] = f; else delete boosts[id];
        delete eff[id];
        render();
    };
    api.refresh = refreshSoon;
    api.refreshNow = refresh;
    /* the editor's live draft (hudeditor-ui.js); null ends the preview */
    api.setPreview = function (p) {
        preview = p && p.c ? { c: cleanComps(p.c), editing: !!p.editing } : null;
        eff = {};
        render();
    };
    api.isEditing = function () { return !!(W.LMHudEditorUI && W.LMHudEditorUI.isOpen && W.LMHudEditorUI.isOpen()); };

    /* the editor UI is its own file, loaded on first use */
    var uiLoading = false, uiQueue = [];
    function withUI(cb) {
        if (W.LMHudEditorUI) { cb(W.LMHudEditorUI); return; }
        uiQueue.push(cb);
        if (uiLoading) return;
        uiLoading = true;
        var s = D.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://www.legendmod.ml/ogario/modules/hudeditor-ui.js?v=' + (W.OgVer || '');
        s.charset = 'utf-8';
        s.onload = function () {
            uiLoading = false;
            var q = uiQueue.splice(0);
            if (W.LMHudEditorUI) q.forEach(function (f) { try { f(W.LMHudEditorUI); } catch (e) { console.warn('[LM] HUD editor:', e); } });
        };
        s.onerror = function () {
            uiLoading = false;
            uiQueue.length = 0;
            if (s.parentNode) s.parentNode.removeChild(s);
            if (W.toastr) { try { W.toastr.warning(esc(tx('loading'))); } catch (e) { } }
        };
        (D.body || D.documentElement).appendChild(s);
    }
    api.open = function () { withUI(function (ui) { ui.open(); }); };
    api.close = function () { if (W.LMHudEditorUI) W.LMHudEditorUI.close(false); };
    /* The editor is the one place for HUD positions: the removed position settings (Game stats
     * position, Chat Position) leave a saved place other than their default in lmHudAdopt
     * ({ box: entry }, ogario.v4.js lmHudAdoptOld). It goes once into the active layout (a box that
     * layout already moves keeps its place), or into a new one when none is active, so nothing
     * jumps. true when a layout was saved and drawn. */
    var ADOPT_KEY = 'lmHudAdopt';
    function adoptPending() {
        var raw = null;
        try { raw = W.localStorage ? W.localStorage.getItem(ADOPT_KEY) : null; } catch (e) { return false; }
        if (raw === null) return false;
        try { W.localStorage.removeItem(ADOPT_KEY); } catch (e) { }
        var add = null;
        try { add = cleanComps(JSON.parse(raw)); } catch (e) { return false; }
        var st = load(), cur = layoutByName(st.active), c = cur ? clone(cur.c) : {}, n = 0;
        for (var id in add) {
            if (!own.call(add, id) || !add[id].h || (c[id] && c[id].h)) continue;
            if (c[id] && c[id].lock) add[id].lock = true;
            if (c[id] && c[id].hide) add[id].hide = true;
            c[id] = add[id];
            n++;
        }
        if (!n) return false;
        var name = cur ? cur.name : '';
        if (!name) {
            var base = typeof W.lmT === 'function' ? W.lmT('modules.hudeditorui.custom') : 'Custom';
            base = cleanName(base) || 'Custom';
            name = base;
            for (var k = 2; findIndex(st.list, name) >= 0 && k <= MAX_LAYOUTS + 1; k++) name = cleanName(base.slice(0, NAME_MAX - 4) + ' ' + k);
        }
        var saved = api.saveLayout(name, c);
        if (!saved) return false;
        if (cur) { if (!preview) refresh(); return true; }
        return api.applyLayout(saved, true);
    }
    api.adoptPending = adoptPending;
    api._internal = { load: load, save: save, comps: comps, eff: function () { return eff; }, measureBox: measureBox, view: view, tx: tx, reset: function () { store = null; } };

    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; });
    }

    /* ═══ Theme > HUD: layout picker + Edit HUD button ═══ */

    var selEl = null;
    function syncSelect() {
        if (!selEl) return;
        var st = load(), names = [''].concat(st.list.map(function (l) { return l.name; }));
        while (selEl.firstChild) selEl.removeChild(selEl.firstChild);
        names.forEach(function (n) {
            var o = D.createElement('option');
            o.value = n;
            o.textContent = n || tx('defaultHud');
            selEl.appendChild(o);
        });
        selEl.value = st.active;
    }
    function addSettingsRow() {
        var host = D.getElementById('theme-hud');
        if (!host || D.getElementById('lm-he-settings')) return !!host;
        var row = D.createElement('div');
        row.id = 'lm-he-settings';
        row.style.cssText = 'display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 8px';
        var lab = D.createElement('span');
        lab.textContent = tx('layout') + ':';
        selEl = D.createElement('select');
        selEl.className = 'form-control';
        selEl.style.cssText = 'width:auto;min-width:120px;max-width:180px;display:inline-block;height:30px;padding:2px 6px';
        selEl.addEventListener('change', function () { api.applyLayout(selEl.value); });
        var btn = D.createElement('button');
        btn.type = 'button';
        btn.id = 'lm-he-open';
        btn.className = 'btn btn-sm btn-primary';
        btn.style.cssText = 'min-height:30px';
        btn.textContent = tx('edit');
        btn.title = tx('editTip');
        btn.addEventListener('click', function (e) { e.preventDefault(); api.open(); });
        row.appendChild(lab); row.appendChild(selEl); row.appendChild(btn);
        host.insertBefore(row, host.firstChild);
        syncSelect();
        return true;
    }

    if (!D || typeof D.createElement !== 'function' || typeof D.addEventListener !== 'function') return;

    var tries = 0;
    (function boot() {
        if (addSettingsRow()) return;
        if (++tries < 240) setTimeout(boot, 500);
    })();
    /* a language change: the Theme > HUD row in the new language */
    if (W.LMi18n && typeof W.LMi18n.onChange === 'function') W.LMi18n.onChange(function () {
        var row = D.getElementById('lm-he-settings'), b = D.getElementById('lm-he-open');
        var lab = row && row.querySelector ? row.querySelector('span') : null;
        if (lab) lab.textContent = tx('layout') + ':';
        if (b) { b.textContent = tx('edit'); b.title = tx('editTip'); }
        syncSelect();
    });
    ['resize', 'orientationchange'].forEach(function (n) { W.addEventListener(n, refreshSoon); });
    D.addEventListener('fullscreenchange', refreshSoon);
    D.addEventListener('webkitfullscreenchange', refreshSoon);
    /* the saved layout, only when one is active (an old position setting first goes into it) */
    if (!adoptPending() && load().active) render();
})();
