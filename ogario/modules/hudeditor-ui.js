/* Legend Mod HUD editor (loaded by hudeditor.js the first time the editor opens).
 * A frame over every HUD box: drag to move, drag the corner (or the wheel, or - / + in the
 * list) to resize, lock, hide (only when chosen: a hidden box stays in the list to show it
 * again), reset one box or all. Boxes snap to the screen edges and centre, to the other boxes
 * and, when chosen, to a grid. Changes show live; Done saves them as the named layout, Cancel
 * (or Esc) puts back the layout that was active before.
 */
(function () {
    'use strict';
    var W = window, D = document;
    var HE = W.LMHudEditor;
    if (W.LMHudEditorUI || !HE || !HE.core) return;
    var core = HE.core;
    var own = Object.prototype.hasOwnProperty;

    var STR = {
        title: ['Edit HUD', 'Επεξεργασία HUD'],
        done: ['Done', 'Τέλος'],
        cancel: ['Cancel', 'Άκυρο'],
        collapse: ['Collapse', 'Σύμπτυξη'],
        expand: ['Expand', 'Ανάπτυξη'],
        layout: ['Layout', 'Διάταξη'],
        defaultHud: ['Default HUD', 'Προεπιλεγμένο HUD'],
        namePh: ['Layout name', 'Όνομα διάταξης'],
        save: ['Save', 'Αποθήκευση'],
        del: ['Delete', 'Διαγραφή'],
        delSure: ['Delete? Tap again', 'Διαγραφή; Πάτα ξανά'],
        snap: ['Snap to edges and boxes', 'Κούμπωμα σε άκρες και πλαίσια'],
        grid: ['Grid', 'Πλέγμα'],
        off: ['Off', 'Όχι'],
        profile: ['Apply with settings profile', 'Εφαρμογή με προφίλ ρυθμίσεων'],
        none: ['None', 'Κανένα'],
        resetAll: ['Reset all', 'Επαναφορά όλων'],
        reset: ['Reset (normal place and size)', 'Επαναφορά (κανονική θέση και μέγεθος)'],
        lock: ['Lock (cannot be moved)', 'Κλείδωμα (δεν μετακινείται)'],
        unlock: ['Unlock', 'Ξεκλείδωμα'],
        hide: ['Hide this box (it stays in this list)', 'Απόκρυψη του πλαισίου (μένει στη λίστα)'],
        show: ['Show this box again', 'Εμφάνιση του πλαισίου ξανά'],
        smaller: ['Smaller', 'Μικρότερο'],
        bigger: ['Bigger', 'Μεγαλύτερο'],
        notShown: ['not on screen now', 'δεν φαίνεται τώρα'],
        hidden: ['hidden', 'κρυμμένο'],
        moved: ['moved', 'μετακινήθηκε'],
        locked: ['locked', 'κλειδωμένο'],
        hint: ['Edit HUD: drag a box to move it, its corner to resize it. Done saves the layout.', 'Επεξεργασία HUD: σύρε ένα πλαίσιο για να το μετακινήσεις, τη γωνία του για το μέγεθος. Το Τέλος αποθηκεύει τη διάταξη.'],
        saved: ['HUD layout saved: ', 'Η διάταξη HUD αποθηκεύτηκε: '],
        saveFail: ['The layout could not be saved (storage full, or already 20 layouts).', 'Η διάταξη δεν αποθηκεύτηκε (γεμάτος χώρος ή ήδη 20 διατάξεις).'],
        unsaved: ['Changes not saved: press Esc again to discard them, or Done to save.', 'Οι αλλαγές δεν αποθηκεύτηκαν: πάτα ξανά Esc για απόρριψη ή Τέλος για αποθήκευση.'],
        note: ['Moved boxes keep their place and size from the layout (theme position and HUD scale settings no longer move them).', 'Τα μετακινημένα πλαίσια κρατούν θέση και μέγεθος από τη διάταξη (οι ρυθμίσεις θέσης και κλίμακας HUD δεν τα μετακινούν πια).'],
        custom: ['Custom', 'Προσαρμοσμένη']
    };
    var SUGGEST = ['Competitive', 'Streaming', 'Mobile', 'Spectating', 'Multibox'];
    function t(k) { var r = STR[k]; return r ? (r[HE.lang()] || r[0]) : k; }

    function mk(tag, cls, text) {
        var e = D.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    }
    function btn(text, title, fn, cls) {
        var b = mk('button', 'lm-he-b' + (cls ? ' ' + cls : ''), text);
        b.type = 'button';
        if (title) { b.title = title; b.setAttribute('aria-label', title); }
        b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); });
        return b;
    }
    function toast(kind, text, opts) {
        try { return W.toastr ? W.toastr[kind](String(text).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }), '', opts) : null; } catch (e) { return null; }
    }
    function view() { return HE._internal.view(); }
    function clone(o) { return JSON.parse(JSON.stringify(o)); }

    function injectStyle() {
        if (D.getElementById('lm-he-css')) return;
        var s = D.createElement('style');
        s.id = 'lm-he-css';
        s.textContent =
            '#lm-he{position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147481000;touch-action:none;user-select:none;-webkit-user-select:none;background:rgba(0,0,0,.12);font:13px/1.35 Ubuntu,Roboto,sans-serif;color:#eee}' +
            '#lm-he.lm-he-grid{background-image:linear-gradient(rgba(255,255,255,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.09) 1px,transparent 1px)}' +
            '.lm-he-f{position:absolute;box-sizing:border-box;border:2px solid #01d9cc;background:rgba(1,217,204,.10);cursor:move;touch-action:none;min-width:16px;min-height:16px}' +
            '.lm-he-f.sel{border-color:#ffd200;background:rgba(255,210,0,.14);z-index:2}' +
            '.lm-he-f.ghost{border-style:dashed}' +
            '.lm-he-f.locked{border-color:#999;cursor:not-allowed}' +
            '.lm-he-f.hid{border-color:#e0605c;background:rgba(224,96,92,.12)}' +
            '.lm-he-l{position:absolute;left:-2px;bottom:100%;font:600 11px/1.4 Ubuntu,Roboto,sans-serif;color:#fff;background:rgba(0,0,0,.75);padding:0 5px;white-space:nowrap;pointer-events:none}' +
            '.lm-he-f.low .lm-he-l{bottom:auto;top:0}' +
            '.lm-he-rs{position:absolute;right:-9px;bottom:-9px;width:18px;height:18px;box-sizing:border-box;border:2px solid #000;background:#01d9cc;border-radius:3px;cursor:nwse-resize;touch-action:none}' +
            '.lm-he-f.rs-in .lm-he-rs{right:auto;bottom:auto;left:-2px;top:-2px}' +
            '.lm-he-f.sel .lm-he-rs{background:#ffd200}.lm-he-f.locked .lm-he-rs{display:none}' +
            '.lm-he-gd{position:absolute;background:#ffd200;pointer-events:none;display:none;z-index:3}' +
            '#lm-he-p{position:fixed;z-index:4;left:50%;top:8px;transform:translateX(-50%);width:390px;max-width:calc(100vw - 16px);max-height:calc(100vh - 16px);box-sizing:border-box;display:flex;flex-direction:column;background:rgba(8,16,24,.94);border:1px solid rgba(1,217,204,.45);border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.6);cursor:default;touch-action:auto}' +
            '#lm-he-p .lm-he-h{display:flex;align-items:center;gap:4px;padding:4px 6px;border-bottom:1px solid rgba(255,255,255,.12);cursor:grab;touch-action:none}' +
            '#lm-he-p .lm-he-t{flex:1;font-weight:700;color:#01d9cc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
            '#lm-he-p .lm-he-body{overflow-y:auto;padding:6px;-webkit-overflow-scrolling:touch;touch-action:pan-y}' +
            '#lm-he-p.min .lm-he-body{display:none}' +
            '#lm-he-p .lm-he-row{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:0 0 6px}' +
            '#lm-he-p select,#lm-he-p input[type=text]{background:#111b24;color:#eee;border:1px solid rgba(255,255,255,.25);border-radius:3px;height:30px;padding:0 6px;font:inherit;min-width:0}' +
            '#lm-he-p input[type=text]{flex:1;min-width:110px}' +
            '#lm-he-p .lm-he-b{background:rgba(127,127,127,.2);color:#eee;border:1px solid rgba(127,127,127,.45);border-radius:3px;min-width:30px;min-height:30px;padding:0 7px;font:inherit;cursor:pointer;touch-action:manipulation}' +
            '#lm-he-p .lm-he-b:hover{background:rgba(127,127,127,.35)}' +
            '#lm-he-p .lm-he-b.go{border-color:#3c9e5a;background:rgba(60,158,90,.35)}' +
            '#lm-he-p .lm-he-b.warn{border-color:#c0504d}' +
            '#lm-he-p .lm-he-b.on{border-color:#ffd200;color:#ffd200}' +
            '#lm-he-p .lm-he-c{display:flex;align-items:center;gap:3px;padding:2px 3px;border-radius:3px}' +
            '#lm-he-p .lm-he-c.sel{background:rgba(255,210,0,.13)}' +
            '#lm-he-p .lm-he-c .lm-he-b{width:30px;padding:0;flex:none}' +
            '#lm-he-p .lm-he-c .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}' +
            '#lm-he-p .lm-he-c .st{font-size:11px;opacity:.7}' +
            '#lm-he-p .lm-he-c.off .nm{opacity:.55}' +
            '#lm-he-p .lm-he-note{font-size:11px;opacity:.65;margin:4px 0 0}' +
            '#lm-he-p label{display:inline-flex;align-items:center;gap:4px;margin:0;font-weight:400;cursor:pointer}' +
            '@media (pointer:coarse){.lm-he-rs{width:28px;height:28px;right:-14px;bottom:-14px}#lm-he-p .lm-he-b{min-width:36px;min-height:36px}#lm-he-p .lm-he-c .lm-he-b{width:36px}}';
        (D.head || D.documentElement).appendChild(s);
    }

    /* ═══ State ═══ */

    var root = null, panel = null, frames = {}, guideX = null, guideY = null;
    var draft = {}, curName = '', baseSig = '', selected = '', drag = null, pdrag = null;
    var menuWasOpen = false, hint = null, escAt = 0, delArm = 0, userMoved = false;
    var listEl = null, layoutSel = null, nameIn = null, profSel = null, snapCb = null, gridSel = null, delBtn = null;

    function isOpen() { return !!(root && root.parentNode); }
    function sig() { return JSON.stringify(core.cleanComps(draft)); }
    function dirty() { return sig() !== baseSig; }
    function prefs() { return HE.prefs(); }
    function menuOpen() {
        var ov = D.getElementById('overlays');
        if (!ov || ov.style.display === 'none') return false;
        return ov.offsetParent !== null || ov.offsetHeight > 0;
    }

    /* Rect of a box and of the parts outside it. A box hidden by the game (option off, chat input
     * closed) is shown invisibly for the measurement, so it can still be placed; a box hidden by an
     * !important rule (phone stylesheet) stays hidden and is "not on screen now". */
    function measure(comp) {
        var el = D.querySelector(comp.sel);
        if (!el) return null;
        var r = el.getBoundingClientRect(), ghost = false, st = null;
        if (!(r.width >= 1 && r.height >= 1)) {
            var cs = W.getComputedStyle(el);
            if (cs.display !== 'none') return null;
            st = {
                d: el.style.getPropertyValue('display'), dp: el.style.getPropertyPriority('display'),
                v: el.style.getPropertyValue('visibility'), vp: el.style.getPropertyPriority('visibility')
            };
            el.style.setProperty('display', 'block');
            el.style.setProperty('visibility', 'hidden', 'important');
            r = el.getBoundingClientRect();
            ghost = true;
        }
        var out = null;
        if (r.width >= 1 && r.height >= 1) {
            var u = { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
            if (comp.extra) {
                var xs = D.querySelectorAll(comp.extra);
                for (var i = 0; i < xs.length && i < 40; i++) {
                    var q = xs[i].getBoundingClientRect();
                    if (!(q.width >= 1 && q.height >= 1)) continue;
                    u.left = Math.min(u.left, q.left); u.top = Math.min(u.top, q.top);
                    u.right = Math.max(u.right, q.right); u.bottom = Math.max(u.bottom, q.bottom);
                }
            }
            var ow = el.offsetWidth || r.width;
            out = {
                main: { left: r.left, top: r.top, width: r.width, height: r.height },
                union: { left: u.left, top: u.top, width: u.right - u.left, height: u.bottom - u.top },
                scale: Math.round(r.width / ow * 1000) / 1000 || 1,
                ghost: ghost
            };
        }
        if (st) {
            if (st.d) el.style.setProperty('display', st.d, st.dp); else el.style.removeProperty('display');
            if (st.v) el.style.setProperty('visibility', st.v, st.vp); else el.style.removeProperty('visibility');
        }
        return out;
    }

    /* ═══ Draft ═══ */

    function entry(id) { return draft[id] || null; }
    function setEntry(id, e) {
        if (e && (e.h || e.lock || e.hide)) draft[id] = e; else delete draft[id];
    }
    function pushPreview() {
        HE.setPreview({ c: draft, editing: true });
        draft = core.cleanComps(draft);
    }
    function update() {
        pushPreview();
        placeFrames();
        renderList();
    }
    /* a moved box keeps its lock / hide flags */
    function positioned(id, mainRect, s) {
        var old = entry(id) || {}, e = core.entryFromRect(mainRect, view(), s);
        if (old.lock) e.lock = true;
        if (old.hide) e.hide = true;
        return e;
    }
    function scaleBy(id, f) {
        var comp = byId(id), m = comp && measure(comp);
        if (!m) return;
        var e = entry(id);
        if (e && e.lock) return;
        var s0 = e && e.h ? e.s : m.scale;
        var s = Math.min(core.S_MAX, Math.max(core.S_MIN, Math.round(s0 * f * 100) / 100));
        var k = s / (m.scale || 1);
        /* keep the centre where it is */
        var cx = m.main.left + m.main.width / 2, cy = m.main.top + m.main.height / 2;
        var w = m.main.width * k, h = m.main.height * k;
        setEntry(id, positioned(id, { left: cx - w / 2, top: cy - h / 2, width: w, height: h }, s));
        update();
    }
    function nudge(id, dx, dy) {
        var comp = byId(id), m = comp && measure(comp), e = entry(id);
        if (!m || (e && e.lock)) return;
        var v = view(), r = m.main;
        var left = Math.min(Math.max(r.left + dx, 0), Math.max(0, v.w - r.width));
        var top = Math.min(Math.max(r.top + dy, 0), Math.max(0, v.h - r.height));
        setEntry(id, positioned(id, { left: left, top: top, width: r.width, height: r.height }, e && e.h ? e.s : m.scale));
        update();
    }
    function toggleFlag(id, flag) {
        var e = clone(entry(id) || {});
        if (e[flag]) delete e[flag]; else e[flag] = true;
        setEntry(id, e);
        update();
    }
    function resetOne(id) { delete draft[id]; update(); }
    function byId(id) {
        for (var i = 0; i < core.COMPONENTS.length; i++) if (core.COMPONENTS[i].id === id) return core.COMPONENTS[i];
        return null;
    }

    /* ═══ Frames ═══ */

    function frameFor(comp) {
        var f = frames[comp.id];
        if (f) return f;
        f = mk('div', 'lm-he-f');
        f.setAttribute('data-id', comp.id);
        f.appendChild(mk('span', 'lm-he-l', HE.compLabel(comp)));
        var rs = mk('div', 'lm-he-rs');
        rs.title = t('bigger') + ' / ' + t('smaller');
        f.appendChild(rs);
        f.addEventListener('pointerdown', function (ev) { startDrag(ev, comp, ev.target === rs ? 'size' : 'move'); });
        f.addEventListener('wheel', function (ev) {
            ev.preventDefault();
            select(comp.id);
            scaleBy(comp.id, ev.deltaY < 0 ? 1.05 : 1 / 1.05);
        }, { passive: false });
        root.insertBefore(f, panel);
        frames[comp.id] = f;
        return f;
    }
    function placeFrame(comp, m) {
        var f = frameFor(comp), e = entry(comp.id) || {};
        if (!m) { f.style.display = 'none'; return; }
        var u = m.union, v = view();
        f.style.display = '';
        f.style.left = Math.round(u.left) + 'px';
        f.style.top = Math.round(u.top) + 'px';
        f.style.width = Math.max(16, Math.round(u.width)) + 'px';
        f.style.height = Math.max(16, Math.round(u.height)) + 'px';
        f.classList.toggle('ghost', !!m.ghost);
        f.classList.toggle('locked', !!e.lock);
        f.classList.toggle('hid', !!e.hide);
        f.classList.toggle('sel', selected === comp.id);
        f.classList.toggle('low', u.top < 16);
        f.classList.toggle('rs-in', u.left + u.width > v.w - 16 || u.top + u.height > v.h - 16);
    }
    function placeFrames() {
        core.COMPONENTS.forEach(function (c) { placeFrame(c, measure(c)); });
    }
    function otherRects(id) {
        var out = [];
        core.COMPONENTS.forEach(function (c) {
            if (c.id === id) return;
            var f = frames[c.id];
            if (!f || f.style.display === 'none') return;
            out.push({ left: f.offsetLeft, top: f.offsetTop, width: f.offsetWidth, height: f.offsetHeight });
        });
        return out;
    }
    function guides(gx, gy) {
        guideX.style.display = gx == null ? 'none' : '';
        guideY.style.display = gy == null ? 'none' : '';
        if (gx != null) guideX.style.left = Math.round(gx) + 'px';
        if (gy != null) guideY.style.top = Math.round(gy) + 'px';
    }
    function startDrag(ev, comp, mode) {
        if (ev.button > 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        select(comp.id);
        var e = entry(comp.id);
        if (e && e.lock) return;
        var m = measure(comp);
        if (!m) return;
        try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch (x) { }
        /* the corner handle inside the frame (box at the screen edge) grows towards the top left */
        var inside = ev.currentTarget.classList.contains('rs-in');
        drag = { comp: comp, mode: mode, id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, m: m, s0: e && e.h ? e.s : m.scale, others: otherRects(comp.id), dir: inside ? -1 : 1 };
        panel.style.opacity = '.55';
    }
    function moveDrag(ev) {
        if (!drag || ev.pointerId !== drag.id) return;
        ev.preventDefault();
        var dx = ev.clientX - drag.x0, dy = ev.clientY - drag.y0, v = view(), m = drag.m, p = prefs();
        var offL = m.main.left - m.union.left, offT = m.main.top - m.union.top;
        if (drag.mode === 'move') {
            var u = { left: m.union.left + dx, top: m.union.top + dy, width: m.union.width, height: m.union.height };
            var sn = core.snapRect(u, drag.others, v, { snap: p.snap, grid: p.grid, th: 8 });
            u.left = Math.min(Math.max(sn.left, 0), Math.max(0, v.w - u.width));
            u.top = Math.min(Math.max(sn.top, 0), Math.max(0, v.h - u.height));
            guides(sn.gx, sn.gy);
            setEntry(drag.comp.id, positioned(drag.comp.id, { left: u.left + offL, top: u.top + offT, width: m.main.width, height: m.main.height }, drag.s0));
        } else {
            var d = (dx + dy) * drag.dir;
            var k = Math.max(0.1, 1 + d / Math.max(20, m.union.width + m.union.height));
            var s = Math.min(core.S_MAX, Math.max(core.S_MIN, Math.round(drag.s0 * k * 100) / 100));
            var ratio = s / (m.scale || 1);
            var w = m.main.width * ratio, h = m.main.height * ratio;
            /* the opposite corner stays put */
            var left = drag.dir > 0 ? m.main.left : m.main.left + m.main.width - w;
            var top = drag.dir > 0 ? m.main.top : m.main.top + m.main.height - h;
            setEntry(drag.comp.id, positioned(drag.comp.id, { left: left, top: top, width: w, height: h }, s));
        }
        pushPreview();
        placeFrame(drag.comp, measure(drag.comp));
    }
    function endDrag(ev) {
        if (!drag || (ev && ev.pointerId !== drag.id)) return;
        var f = frames[drag.comp.id];
        drag = null;
        guides(null, null);
        panel.style.opacity = '';
        update();
        if (f) dockPanel(frameRect(f));
    }

    /* ═══ Panel ═══ */

    function select(id) {
        selected = id;
        core.COMPONENTS.forEach(function (c) { var f = frames[c.id]; if (f) f.classList.toggle('sel', c.id === id); });
        if (listEl) {
            var rows = listEl.children;
            for (var i = 0; i < rows.length; i++) rows[i].classList.toggle('sel', rows[i].getAttribute('data-id') === id);
        }
        var f = id && frames[id];
        if (f && f.style.display !== 'none') dockPanel(frameRect(f));
    }
    function frameRect(f) { return { left: f.offsetLeft, top: f.offsetTop, width: f.offsetWidth, height: f.offsetHeight }; }
    function overlap(a, b) {
        var w = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
        var h = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
        return w > 0 && h > 0 ? w * h : 0;
    }
    /* The panel goes where it covers the fewest boxes (top centre, left or right), and away from
     * the box being edited; once the player moves it, it stays where they put it. */
    function dockPanel(avoid) {
        if (!panel || userMoved || drag) return;
        var v = view(), pw = panel.offsetWidth, ph = panel.offsetHeight;
        if (avoid && !overlap(frameRect(panel), avoid)) return;
        var rects = [];
        core.COMPONENTS.forEach(function (c) { var f = frames[c.id]; if (f && f.style.display !== 'none') rects.push(frameRect(f)); });
        var best = null, bestA = Infinity;
        [(v.w - pw) / 2, 8, v.w - pw - 8].forEach(function (x) {
            x = Math.max(0, Math.round(x));
            var pr = { left: x, top: 8, width: pw, height: ph }, a = 0;
            rects.forEach(function (r) { a += overlap(pr, r); });
            if (avoid) a += overlap(pr, avoid) * 10;
            if (a < bestA - 1) { bestA = a; best = x; }
        });
        if (best == null) return;
        panel.style.transform = 'none';
        panel.style.left = best + 'px';
        panel.style.top = '8px';
    }
    function fillLayouts() {
        while (layoutSel.firstChild) layoutSel.removeChild(layoutSel.firstChild);
        [''].concat(HE.list()).forEach(function (n) {
            var o = mk('option', null, n || t('defaultHud'));
            o.value = n;
            layoutSel.appendChild(o);
        });
        layoutSel.value = curName && HE.get(curName) ? HE.get(curName).name : '';
        delBtn.disabled = !layoutSel.value;
        fillProfiles();
    }
    function fillProfiles() {
        if (!profSel) return;
        var list = [];
        try { list = W.LMProfiles && W.LMProfiles.list ? W.LMProfiles.list() : []; } catch (e) { }
        var row = profSel.parentNode;
        row.style.display = list.length && layoutSel.value ? '' : 'none';
        while (profSel.firstChild) profSel.removeChild(profSel.firstChild);
        var o = mk('option', null, t('none'));
        o.value = '';
        profSel.appendChild(o);
        var links = HE.links(), cur = '';
        list.forEach(function (p) {
            var q = mk('option', null, p.name);
            q.value = p.id;
            profSel.appendChild(q);
            if (!cur && links[p.id] && links[p.id] === layoutSel.value) cur = p.id;
        });
        profSel.value = cur;
    }
    function renderList() {
        if (!listEl) return;
        while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
        core.COMPONENTS.forEach(function (c) {
            var e = entry(c.id) || {}, f = frames[c.id];
            var onScreen = !!(f && f.style.display !== 'none');
            var row = mk('div', 'lm-he-c' + (onScreen ? '' : ' off') + (selected === c.id ? ' sel' : ''));
            row.setAttribute('data-id', c.id);
            var nm = mk('span', 'nm', HE.compLabel(c));
            var st = [];
            if (e.h) st.push(t('moved'));
            if (e.hide) st.push(t('hidden'));
            if (e.lock) st.push(t('locked'));
            if (!onScreen) st.push(t('notShown'));
            if (st.length) { nm.appendChild(D.createTextNode(' ')); nm.appendChild(mk('span', 'st', '(' + st.join(', ') + ')')); }
            nm.addEventListener('click', function () { select(c.id); });
            row.appendChild(nm);
            row.appendChild(btn('−', t('smaller'), function () { select(c.id); scaleBy(c.id, 1 / 1.1); }));
            row.appendChild(btn('+', t('bigger'), function () { select(c.id); scaleBy(c.id, 1.1); }));
            row.appendChild(btn(e.lock ? '🔒' : '🔓', e.lock ? t('unlock') : t('lock'), function () { select(c.id); toggleFlag(c.id, 'lock'); }, e.lock ? 'on' : ''));
            row.appendChild(btn(e.hide ? '🚫' : '👁', e.hide ? t('show') : t('hide'), function () { select(c.id); toggleFlag(c.id, 'hide'); }, e.hide ? 'on warn' : ''));
            var rb = btn('↺', t('reset'), function () { select(c.id); resetOne(c.id); });
            rb.disabled = !draft[c.id];
            row.appendChild(rb);
            listEl.appendChild(row);
        });
    }
    function loadLayout(name) {
        var l = name ? HE.get(name) : null;
        draft = l ? clone(l.c) : {};
        curName = l ? l.name : '';
        nameIn.value = curName;
        baseSig = sig();
        delArm = 0;
        delBtn.textContent = t('del');
        update();
        fillLayouts();
    }
    function saveDraft() {
        var n = core.cleanName(nameIn.value) || curName || t('custom');
        var r = HE.saveLayout(n, draft);
        if (!r) { toast('warning', t('saveFail')); return false; }
        if (!HE.applyLayout(r, true)) { fillLayouts(); toast('warning', t('saveFail')); return false; }
        curName = r;
        nameIn.value = r;
        baseSig = sig();
        fillLayouts();
        toast('success', t('saved') + r);
        return true;
    }
    function done() {
        /* nothing changed: keep what was active, or the chosen saved layout */
        if (!dirty() && (!core.cleanName(nameIn.value) || core.cleanName(nameIn.value) === curName)) {
            if (!HE.applyLayout(curName, true)) toast('warning', t('saveFail'));
            close(true);
            return;
        }
        if (!Object.keys(core.cleanComps(draft)).length && !core.cleanName(nameIn.value) && !curName) {
            if (!HE.applyLayout('', true)) toast('warning', t('saveFail'));
            close(true);
            return;
        }
        if (saveDraft()) close(true);
    }

    function buildPanel() {
        panel = mk('div');
        panel.id = 'lm-he-p';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', t('title'));
        var head = mk('div', 'lm-he-h');
        head.appendChild(mk('span', 'lm-he-t', t('title')));
        var minB = btn('▾', t('collapse'), function () {
            var min = !panel.classList.contains('min');
            panel.classList.toggle('min', min);
            minB.textContent = min ? '▸' : '▾';
            minB.title = min ? t('expand') : t('collapse');
            clampPanel();
        });
        head.appendChild(minB);
        head.appendChild(btn(t('done'), t('done'), done, 'go lm-he-done'));
        head.appendChild(btn('×', t('cancel'), function () { close(false); }, 'warn lm-he-x'));
        head.addEventListener('pointerdown', function (ev) {
            if (ev.target.closest && ev.target.closest('button')) return;
            pdrag = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, l: panel.offsetLeft, t: panel.offsetTop };
            userMoved = true;
            try { head.setPointerCapture(ev.pointerId); } catch (x) { }
        });
        head.addEventListener('pointermove', function (ev) {
            if (!pdrag || ev.pointerId !== pdrag.id) return;
            panel.style.transform = 'none';
            panel.style.left = (pdrag.l + ev.clientX - pdrag.x0) + 'px';
            panel.style.top = (pdrag.t + ev.clientY - pdrag.y0) + 'px';
            clampPanel();
        });
        var endP = function () { pdrag = null; };
        head.addEventListener('pointerup', endP);
        head.addEventListener('pointercancel', endP);
        panel.appendChild(head);

        var body = mk('div', 'lm-he-body');
        var r1 = mk('div', 'lm-he-row');
        r1.appendChild(mk('span', null, t('layout') + ':'));
        layoutSel = mk('select', 'lm-he-layout');
        layoutSel.addEventListener('change', function () { loadLayout(layoutSel.value); });
        r1.appendChild(layoutSel);
        delBtn = btn(t('del'), t('del'), function () {
            if (!layoutSel.value) return;
            if (Date.now() - delArm > 4000) { delArm = Date.now(); delBtn.textContent = t('delSure'); return; }
            if (!HE.deleteLayout(layoutSel.value)) { toast('warning', t('saveFail')); return; }
            loadLayout('');
        }, 'warn lm-he-del');
        r1.appendChild(delBtn);
        body.appendChild(r1);

        var r2 = mk('div', 'lm-he-row');
        nameIn = mk('input', 'lm-he-name');
        nameIn.type = 'text';
        nameIn.maxLength = core.NAME_MAX;
        nameIn.placeholder = t('namePh');
        nameIn.setAttribute('list', 'lm-he-names');
        var dl = mk('datalist');
        dl.id = 'lm-he-names';
        SUGGEST.forEach(function (n) { var o = mk('option'); o.value = n; dl.appendChild(o); });
        r2.appendChild(nameIn);
        r2.appendChild(dl);
        r2.appendChild(btn(t('save'), t('save'), saveDraft, 'go lm-he-save'));
        body.appendChild(r2);

        var r3 = mk('div', 'lm-he-row');
        var lab = mk('label');
        snapCb = mk('input');
        snapCb.type = 'checkbox';
        snapCb.checked = prefs().snap;
        snapCb.addEventListener('change', function () { HE.setPrefs({ snap: snapCb.checked }); });
        lab.appendChild(snapCb);
        lab.appendChild(D.createTextNode(t('snap')));
        r3.appendChild(lab);
        r3.appendChild(mk('span', null, t('grid') + ':'));
        gridSel = mk('select', 'lm-he-gridsel');
        core.GRIDS.forEach(function (g) { var o = mk('option', null, g ? g + ' px' : t('off')); o.value = String(g); gridSel.appendChild(o); });
        gridSel.value = String(prefs().grid);
        gridSel.addEventListener('change', function () { HE.setPrefs({ grid: Number(gridSel.value) }); showGrid(); });
        r3.appendChild(gridSel);
        body.appendChild(r3);

        var r4 = mk('div', 'lm-he-row');
        r4.appendChild(mk('span', null, t('profile') + ':'));
        profSel = mk('select', 'lm-he-prof');
        profSel.addEventListener('change', function () {
            var name = layoutSel.value, links = HE.links();
            if (!name) return;
            var ok = true;
            for (var pid in links) if (own.call(links, pid) && links[pid] === name) ok = HE.linkProfile(pid, '') && ok;
            if (profSel.value) ok = HE.linkProfile(profSel.value, name) && ok;
            if (!ok) { fillProfiles(); toast('warning', t('saveFail')); }
        });
        r4.appendChild(profSel);
        body.appendChild(r4);

        listEl = mk('div', 'lm-he-list');
        body.appendChild(listEl);
        var r5 = mk('div', 'lm-he-row');
        r5.style.marginTop = '6px';
        r5.appendChild(btn(t('resetAll'), t('resetAll'), function () { draft = {}; update(); }, 'warn lm-he-resetall'));
        body.appendChild(r5);
        body.appendChild(mk('div', 'lm-he-note', t('note')));
        panel.appendChild(body);
        /* the panel takes its own clicks and scrolling (the overlay blocks the game) */
        panel.addEventListener('pointerdown', function (ev) { ev.stopPropagation(); });
        return panel;
    }
    function clampPanel() {
        if (!panel || panel.style.transform !== 'none') return;
        var v = view();
        var l = Math.min(Math.max(0, panel.offsetLeft), Math.max(0, v.w - panel.offsetWidth));
        var tp = Math.min(Math.max(0, panel.offsetTop), Math.max(0, v.h - panel.offsetHeight));
        panel.style.left = l + 'px';
        panel.style.top = tp + 'px';
    }
    function showGrid() {
        var g = prefs().grid;
        root.classList.toggle('lm-he-grid', g > 0);
        root.style.backgroundSize = g > 0 ? g + 'px ' + g + 'px' : '';
    }

    /* ═══ Open / close ═══ */

    function stopGame(e) { e.stopPropagation(); }
    function onKey(e) {
        if (!isOpen()) return;
        var tag = e.target && e.target.tagName, typing = (tag === 'INPUT' && e.target.type === 'text') || tag === 'SELECT' || tag === 'TEXTAREA';
        /* key releases go through: a key held when the editor opened is released in the game too */
        if (e.type !== 'keydown') return;
        e.stopPropagation();
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            if (dirty() && Date.now() - escAt > 3000) { escAt = Date.now(); toast('info', t('unsaved')); return; }
            close(false);
            return;
        }
        if (typing) return;
        if (e.key === 'Enter') { e.preventDefault(); done(); return; }
        var step = e.shiftKey ? 10 : 1;
        var mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
        if (mv && selected) { e.preventDefault(); nudge(selected, mv[0], mv[1]); return; }
        if ((e.key === '+' || e.key === '=' || e.key === '-') && selected) { e.preventDefault(); scaleBy(selected, e.key === '-' ? 1 / 1.05 : 1.05); }
    }
    function onResize() { if (isOpen()) { HE.refreshNow(); placeFrames(); renderList(); clampPanel(); dockPanel(); } }

    function open() {
        if (isOpen()) return;
        injectStyle();
        menuWasOpen = menuOpen();
        if (menuWasOpen && W.application && typeof W.application.hideMenu === 'function') { try { W.application.hideMenu(); } catch (e) { } }
        root = mk('div');
        root.id = 'lm-he';
        guideX = mk('div', 'lm-he-gd');
        guideX.style.cssText = 'top:0;bottom:0;width:1px;display:none';
        guideY = mk('div', 'lm-he-gd');
        guideY.style.cssText = 'left:0;right:0;height:1px;display:none';
        root.appendChild(guideX);
        root.appendChild(guideY);
        root.appendChild(buildPanel());
        frames = {};
        ['mousedown', 'mouseup', 'mousemove', 'click', 'dblclick', 'contextmenu', 'wheel', 'pointerdown', 'pointerup', 'pointermove', 'touchstart', 'touchmove', 'touchend'].forEach(function (n) {
            root.addEventListener(n, n === 'pointermove' ? function (e) { moveDrag(e); stopGame(e); } : n === 'pointerup' ? function (e) { endDrag(e); stopGame(e); } : stopGame, n.indexOf('touch') === 0 || n === 'wheel' ? { passive: true } : false);
        });
        root.addEventListener('pointercancel', function (e) { endDrag(e); });
        /* a tap on empty space deselects */
        root.addEventListener('pointerdown', function (e) { if (e.target === root) select(''); });
        D.body.appendChild(root);
        W.addEventListener('keydown', onKey, true);
        W.addEventListener('resize', onResize);
        W.addEventListener('orientationchange', onResize);
        showGrid();
        /* a hint that stays until the editor closes; it also gives the popups box something to frame */
        hint = toast('info', t('hint'), { timeOut: 0, extendedTimeOut: 0, tapToDismiss: false, closeButton: false });
        selected = '';
        userMoved = false;
        loadLayout(HE.active());
        dockPanel();
        /* the popups box appears with the hint a moment later */
        setTimeout(function () { if (isOpen() && !drag) { placeFrames(); renderList(); dockPanel(); } }, 400);
    }
    function close(kept) {
        if (!isOpen()) return;
        drag = null;
        W.removeEventListener('keydown', onKey, true);
        W.removeEventListener('resize', onResize);
        W.removeEventListener('orientationchange', onResize);
        if (root.parentNode) root.parentNode.removeChild(root);
        root = null; panel = null; frames = {}; listEl = null;
        /* Cancel: the layout that was active stays (the draft is dropped) */
        HE.setPreview(null);
        try { if (hint && W.toastr) W.toastr.clear(hint); } catch (e) { }
        hint = null;
        if (menuWasOpen && W.application && typeof W.application.showMenu === 'function') { try { W.application.showMenu(); } catch (e) { } }
        menuWasOpen = false;
        return kept;
    }

    W.LMHudEditorUI = {
        open: open,
        close: close,
        isOpen: isOpen,
        /* for the smoke probe */
        _draft: function () { return clone(draft); },
        _select: select,
        _measure: function (id) { var c = byId(id); return c ? measure(c) : null; }
    };
})();
