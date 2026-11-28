/*
 * HUD helpers (Legend Mod).
 *
 * Each helper has its own option in the settings, all off by default:
 *   hudMoveDir         arrow from your cells' centre toward where they really move
 *                      (from their position over the last frames, not the mouse); also multibox units
 *   hudMergeSound      short sound when two of your cells can merge again (agar.io only: the
 *                      only place the merge timing is known; it is an estimate)
 *   hudRelativeMass    other players' mass as a ratio to your biggest cell (1.75x, 0.40x, "=")
 *   hudEdgeTeammates   arrows at the screen edges toward teammates (positions the minimap gets)
 *   hudEdgeThreats     arrows toward big cells that just left the screen (last position received,
 *                      fading after a few seconds)
 *   massFormat         1 exact, 2 12.3k, 3 auto (Settings > Mass: "Mass format"; 0 of older
 *                      versions was "as Short mass"); the core draws 1 and 2 itself
 * Hotkey (no default key): hold for precision zoom.
 *
 * ogario.v4.js calls frame() once per rendered frame after the cell overlays; it returns at once
 * while every option is off. Drawing reuses objects and cached strings: no garbage per frame.
 */
(function () {
    'use strict';
    if (window._lmHudHelpersLoaded) return;
    window._lmHudHelpersLoaded = true;

    /* ───────────────────────── pure parts (developers/tests/hudhelpers.js) ───────────────────────── */

    /*
     * Smoothed movement of a group of cells. st keeps the last centre and the velocity
     * (world units per second). A change in the number of cells (split, merge, eaten) moves the
     * centre without the group moving: re-anchor then instead of reading it as a jump. A long gap
     * (hidden tab) or a teleport (respawn, multibox swap) starts over.
     */
    function updateDirection(st, x, y, count, t, tau) {
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(t)) return st;
        var dt = st.has ? t - st.t : 0;
        var dx = x - st.x, dy = y - st.y;
        if (st.has && dt >= 0 && dt <= 500 && count !== st.n) {
            st.x = x; st.y = y; st.t = t; st.n = count;
            return st;
        }
        if (!st.has || dt > 500 || dt < 0 || dx * dx + dy * dy > 4000000) {
            st.x = x; st.y = y; st.t = t; st.n = count;
            st.vx = 0; st.vy = 0; st.has = true;
            return st;
        }
        if (dt < 1) return st;
        var k = 1 - Math.exp(-dt / (tau > 0 ? tau : 150));
        st.vx += (dx * 1000 / dt - st.vx) * k;
        st.vy += (dy * 1000 / dt - st.vy) * k;
        st.x = x; st.y = y; st.t = t;
        return st;
    }

    /* Merge time estimate, the formula of ogario/mergetimer.js (agar.io): 29 s + 8/300 s per mass */
    function mergeDuration(mass) {
        return 29 + (8 / 300) * (mass > 0 ? mass : 0);
    }

    /*
     * Merge time bookkeeping (for the merge sound) for one owner's cells (main player or one multibox unit).
     * A piece that appears while the count grows, and a piece that lost a large part of its mass
     * then (the one that split or popped), start a new countdown. Pieces first seen without such
     * a split (option turned on mid-game) are unknown (-1) and never count as ready.
     * Writes cell._lmHHEnd (ms, same clock as now; 0 = nothing to merge, -1 = unknown) and
     * cell._lmHHDur (s). Returns the number of pieces whose countdown has run out.
     */
    function trackMerge(owner, cells, count, now) {
        var grew = owner.prevCount > 0 && count > owner.prevCount;
        var ready = 0, i, c, s, m;
        for (i = 0; i < count; i++) {
            c = cells[i];
            if (!c) continue;
            s = c.targetSize || c.size || 0;
            m = s * s / 100;
            if (count <= 1) {
                c._lmHHEnd = 0;
            } else if (grew && (c._lmHHPm === undefined || c._lmHHPm > m * 1.4)) {
                c._lmHHDur = mergeDuration(m);
                c._lmHHEnd = now + c._lmHHDur * 1000;
                owner.beep = true;
                /* P1 fix #62: record the earliest time the new cells' merge countdowns
                 * will expire, so we only beep for the NEW split, not for cells from an
                 * older split that are already ready. */
                owner.beepAfter = now + (c._lmHHDur || 0) * 1000;
            } else if (c._lmHHPm === undefined || c._lmHHEnd === undefined) {
                c._lmHHEnd = -1;
            }
            c._lmHHPm = m;
            if (count > 1 && c._lmHHEnd > 0 && c._lmHHEnd <= now) ready++;
        }
        if (count <= 1) owner.beep = false;
        owner.prevCount = count;
        return ready;
    }

    var _ratioTxt = new Map();
    /* other / own mass: "=" within 5 %, two decimals below 10x, whole numbers above */
    function ratioText(r) {
        if (!(r > 0) || !Number.isFinite(r)) return '';
        var key = r < 9.995 ? Math.round(r * 100) : 1000 + Math.round(r);
        var t = _ratioTxt.get(key);
        if (t !== undefined) return t;
        if (key >= 95 && key <= 104) t = '=';
        else if (key < 1000) t = (key / 100).toFixed(2) + 'x';
        else t = (key - 1000) + 'x';
        if (_ratioTxt.size > 4000) _ratioTxt.clear();
        _ratioTxt.set(key, t);
        return t;
    }

    var _massTxt = [new Map(), new Map(), new Map(), new Map()];
    /*
     * Mass as text. mode 0: as before (shortMass: 1000 and more as 1.2k), 1: exact,
     * 2: 12.3k from 1000, 3: auto (exact below 10000, 12.3k below 100k, 123k, then 1.2M).
     */
    function formatMass(mass, mode, shortMass) {
        var m = mass > 0 ? Math.floor(mass) : 0;
        mode = mode === 1 || mode === 2 || mode === 3 ? mode : (shortMass ? 2 : 1);
        var cache = _massTxt[mode];
        var t = cache.get(m);
        if (t !== undefined) return t;
        if (mode === 1 || m < 1000 || (mode === 3 && m < 10000)) t = String(m);
        else if (mode === 2 || m < 100000) t = (Math.round(m / 100) / 10) + 'k';
        else if (m < 1000000) t = Math.round(m / 1000) + 'k';
        else t = (Math.round(m / 100000) / 10) + 'M';
        if (cache.size > 4000) cache.clear();
        cache.set(m, t);
        return t;
    }

    /*
     * Where an off-screen point (tx, ty) shows on the screen edge: the line from the screen centre
     * toward it, cut at a margin inside the edges. out.x/out.y on screen, out.a the angle.
     */
    function edgePoint(cx, cy, tx, ty, w, h, margin, out) {
        var dx = tx - cx, dy = ty - cy;
        out.a = Math.atan2(dy, dx);
        var hw = w / 2 - margin, hh = h / 2 - margin;
        if (hw < 1) hw = 1;
        if (hh < 1) hh = 1;
        var ax = Math.abs(dx), ay = Math.abs(dy);
        var k = (ax * hh > ay * hw) ? hw / (ax || 1) : hh / (ay || 1);
        if (k > 1) k = 1;
        out.x = cx + dx * k;
        out.y = cy + dy * k;
        return out;
    }

    /* ───────────────────────── state ───────────────────────── */

    var MAX_OWNERS = 9; /* main player + up to 8 multibox units */
    var owners = [];
    for (var _oi = 0; _oi < MAX_OWNERS; _oi++) {
        owners.push({
            /* num: whose cells (0 the main player, else the unit number), -1 a free entry */
            num: _oi ? -1 : 0, cells: [], dir: { has: false, x: 0, y: 0, t: 0, n: 0, vx: 0, vy: 0 },
            prevCount: 0, beep: false, beepAfter: 0, maxSize: 0, sx: 0, sy: 0, sw: 0, n: 0
        });
    }
    var refMass = 0;            /* mass of the reference unit's biggest cell (0 when not playing) */
    var refOwner = 0;           /* that unit: 0 the main player, else the multibox unit number */
    var _pA = { x: 0, y: 0 }, _edge = { x: 0, y: 0, a: 0 };
    var _lastBeep = 0;
    var api;

    function S() { return window.legendmod5 || {}; }
    function isOwn(c) { return !!(c && (c.isPlayerCell || c.isPlayerCellMulti)); }

    /* The entry of a multibox unit: units are numbered by connection (with Full Map spectators a
     * unit can be 18), so the number is no index; the entry it has, else a free one (its movement
     * and merge state start again). 0: none free (more than 8 units). */
    function ownerOf(num) {
        var i, free = 0, o;
        for (i = 1; i < MAX_OWNERS; i++) {
            if (owners[i].num === num) return i;
            if (!free && owners[i].num < 0) free = i;
        }
        if (free) {
            o = owners[free];
            o.num = num; o.dir.has = false; o.prevCount = 0; o.beep = false; o.beepAfter = 0;
        }
        return free;
    }

    /* Own cells of every owner into owners[k].cells (arrays reused), with their centre and size. */
    function gatherOwners(LM) {
        var i, o, c, w;
        for (i = 0; i < MAX_OWNERS; i++) owners[i].cells.length = 0;
        var pc = LM.playerCells;
        if (pc && pc.length) for (i = 0; i < pc.length; i++) if (pc[i] && !pc[i].removed) owners[0].cells.push(pc[i]);
        var mc = LM.playerCellsMulti;
        if (mc && mc.length) {
            for (i = 0; i < mc.length; i++) {
                c = mc[i];
                if (!c || c.removed) continue;
                var k = c.spectator | 0;
                if (k > 0 && (k = ownerOf(k))) owners[k].cells.push(c);
            }
        }
        for (i = 0; i < MAX_OWNERS; i++) {
            o = owners[i];
            var sx = 0, sy = 0, sw = 0, ms = 0;
            for (var j = 0; j < o.cells.length; j++) {
                c = o.cells[j];
                w = c.size * c.size;
                sx += c.x * w; sy += c.y * w; sw += w;
                if (c.size > ms) ms = c.size;
            }
            o.n = o.cells.length;
            o.sw = sw;
            o.maxSize = ms;
            if (sw > 0) { o.sx = sx / sw; o.sy = sy / sw; }
            /* a unit without cells gives its entry back */
            if (i && !o.n) o.num = -1;
        }
        /* reference for the relative mass and the threat arrows: the unit you
         * control, as the opponent colours (compareCells) use it: the focused multibox unit, else
         * the main player; when that one has no cells, the main player or the biggest unit */
        var act = window.multiboxPlayerEnabled | 0, ro = 0;
        for (i = 1; act > 0 && i < MAX_OWNERS; i++) if (owners[i].num === act && owners[i].n) { ro = i; break; }
        if (!ro && !owners[0].n) for (i = 1; i < MAX_OWNERS; i++) if (owners[i].maxSize > owners[ro].maxSize) ro = i;
        var ref = owners[ro].maxSize;
        refOwner = ref > 0 ? owners[ro].num : 0;
        refMass = ref > 0 ? ref * ref / 100 : 0;
    }

    /* ───────────────────────── 1. movement direction (hudMoveDir) ───────────────────────── */

    function drawMoveDir(ctx, render, now) {
        var scale = render.scale || 1;
        ctx.save();
        try {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (var i = 0; i < MAX_OWNERS; i++) {
                var o = owners[i];
                if (!o.n) { o.dir.has = false; continue; }
                updateDirection(o.dir, o.sx, o.sy, o.n, now, 160);
                var vx = o.dir.vx, vy = o.dir.vy;
                var speed = Math.sqrt(vx * vx + vy * vy);
                if (speed < 25) continue;
                var ux = vx / speed, uy = vy / speed;
                /* from the centre to past the biggest cell, longer the faster it moves */
                var len = o.maxSize + 30 / scale + Math.min(speed * 0.35, 500);
                var p0 = render.getLegendWorldAttachedRenderPoint ? render.getLegendWorldAttachedRenderPoint(o.sx, o.sy, _pA) : (_pA.x = o.sx, _pA.y = o.sy, _pA);
                var ex = p0.x + ux * len, ey = p0.y + uy * len;
                var head = Math.max(10 / scale, Math.min(o.maxSize * 0.35, 60 / scale));
                ctx.globalAlpha = Math.min(0.85, 0.35 + speed / 1200);
                ctx.strokeStyle = 'rgba(255, 214, 64, 1)';
                ctx.fillStyle = 'rgba(255, 214, 64, 1)';
                ctx.lineWidth = Math.max(2, 3 / scale);
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(ex - ux * head * 0.8, ey - uy * head * 0.8);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(ex, ey);
                ctx.lineTo(ex - ux * head - uy * head * 0.6, ey - uy * head + ux * head * 0.6);
                ctx.lineTo(ex - ux * head + uy * head * 0.6, ey - uy * head - ux * head * 0.6);
                ctx.closePath();
                ctx.fill();
            }
        } finally {
            ctx.restore();
        }
    }

    /* ───────────────────────── 2. merge sound ───────────────────────── */

    function mergeFrame(LM, now) {
        var known = !!(LM.integrity && !LM.isLegendWorld);
        var beepNow = false;
        for (var i = 0; i < MAX_OWNERS; i++) {
            var o = owners[i];
            var ready = trackMerge(o, o.cells, o.n, now);
            if (!known) continue;
            if (o.beep && ready >= 2 && (!o.beepAfter || now >= o.beepAfter)) { o.beep = false; o.beepAfter = 0; beepNow = true; }
        }
        if (beepNow && now - _lastBeep > 1500) {
            _lastBeep = now;
            var app = window.application;
            if (app && app._lmOptSound && app.playSound) app.playSound(app._lmOptSound('mergeReady'));
        }
    }

    /* ───────────────────────── 3. mass text (called by both renderers) ───────────────────────── */

    /* Text for a cell's mass with massFormat / hudRelativeMass; mass already as the game shows it. */
    function massText(mass, cell) {
        var s = S();
        if (s.hudRelativeMass && refMass > 0 && cell && !isOwn(cell) && !cell.isVirus && !cell.isFood && !cell.isEjected) {
            var r = ratioText(mass / refMass);
            if (r) return r;
        }
        return formatMass(mass, +s.massFormat || 0, !!s.shortMass);
    }

    /* ───────────────────────── 4. edge indicators (hudEdgeTeammates, hudEdgeThreats) ───────────────────────── */

    var edgeCv = null, edgeCtx = null, edgeShown = false;
    var THREAT_SLOTS = 8, THREAT_FADE = 4000;
    var threats = [];
    for (var _ti = 0; _ti < THREAT_SLOTS; _ti++) threats.push({ id: -1, x: 0, y: 0, mass: 0, seen: 0 });
    var _threatScanAt = 0;
    var FONT_SMALL = '600 10px Ubuntu, Arial, sans-serif', FONT_NORMAL = '600 12px Ubuntu, Arial, sans-serif';

    function ensureEdgeCanvas(render) {
        if (edgeCv) return edgeCv;
        var parent = (render && render.canvas && render.canvas.parentNode) || document.body;
        if (!parent) return null;
        edgeCv = document.createElement('canvas');
        edgeCv.id = 'lm-hh-edge';
        var z = (render && Number.isFinite(render._renderLayerZ) ? render._renderLayerZ : 1) + 5;
        /* next to the game canvases and above them (the overlay canvas is +4), below the HUD boxes
         * (z-index 100); never takes taps or clicks */
        edgeCv.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;background:transparent;z-index:' + z + ';display:none';
        parent.appendChild(edgeCv);
        edgeCtx = edgeCv.getContext('2d');
        return edgeCv;
    }

    function hideEdges() {
        if (edgeCv && edgeShown) {
            edgeCtx.setTransform(1, 0, 0, 1, 0, 0);
            edgeCtx.clearRect(0, 0, edgeCv.width, edgeCv.height);
            /* P1 fix #65: release the VRAM backing buffer when edges are off.
             * A hidden full-screen canvas still holds width × height × 4 bytes
             * of GPU memory. Setting dimensions to 0 releases it. */
            edgeCv.width = 0; edgeCv.height = 0;
            edgeCv.style.display = 'none';
        }
        edgeShown = false;
    }

    function ownNick(nick) {
        for (var i = 0; i < MAX_OWNERS; i++) {
            var o = owners[i];
            if (o.n && o.cells[0].nick === nick) return true;
        }
        return false;
    }

    function scanThreats(LM, now) {
        var cells = LM.cells;
        if (!cells || !(refMass > 0)) return;
        var min = refMass * 1.3, i, j, c, s, m, slot;
        for (i = 0; i < cells.length; i++) {
            c = cells[i];
            if (!c || c.removed || c.isFood || c.isVirus || c.isEjected || isOwn(c)) continue;
            /* another connection's copy of your own multibox cells is not a threat */
            if (c.nick && ownNick(c.nick)) continue;
            s = c.targetSize || c.size;
            m = s * s / 100;
            if (m < min) continue;
            slot = null;
            for (j = 0; j < THREAT_SLOTS; j++) if (threats[j].id === c.id) { slot = threats[j]; break; }
            if (!slot) {
                /* a free (or the oldest) slot */
                slot = threats[0];
                for (j = 0; j < THREAT_SLOTS; j++) {
                    if (threats[j].id === -1) { slot = threats[j]; break; }
                    if (threats[j].seen < slot.seen) slot = threats[j];
                }
                slot.id = c.id;
            }
            slot.x = c.x; slot.y = c.y; slot.mass = m; slot.seen = now;
        }
    }

    function drawArrow(ctx, x, y, a, size, color, alpha) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size * 0.7, size * 0.75);
        ctx.lineTo(-size * 0.35, 0);
        ctx.lineTo(-size * 0.7, -size * 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(0,0,0,0.6)';
        ctx.stroke();
        ctx.restore();
    }

    function nickOf(tm) {
        var n = typeof tm.nick === 'string' ? tm.nick : '';
        if (tm._lmHHNickSrc !== n) {
            tm._lmHHNickSrc = n;
            tm._lmHHNick = n.length > 12 ? n.slice(0, 11) + '…' : n;
        }
        return tm._lmHHNick;
    }

    function drawEdges(render, LM, now, s) {
        var cv = ensureEdgeCanvas(render);
        if (!cv) return;
        var W = render.canvasWidth || window.innerWidth, H = render.canvasHeight || window.innerHeight;
        var dpr = render.dpr || window.devicePixelRatio || 1;
        var pw = Math.round(W * dpr), ph = Math.round(H * dpr);
        if (cv.width !== pw || cv.height !== ph) {
            cv.width = pw; cv.height = ph;
            cv.style.width = W + 'px'; cv.style.height = H + 'px';
        }
        var ctx = edgeCtx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, pw, ph);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!edgeShown) { cv.style.display = 'block'; edgeShown = true; }
        var camX = render.camX, camY = render.camY, scale = render.scale || 1;
        if (!Number.isFinite(camX) || !Number.isFinite(camY)) return;
        var cx = W / 2, cy = H / 2, small = H < 500, size = small ? 9 : 12, margin = small ? 18 : 26;
        var i, sx, sy;
        ctx.font = small ? FONT_SMALL : FONT_NORMAL;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (s.hudEdgeTeammates) {
            var app = window.application, tp = app && app.teamPlayers;
            if (tp && tp.length) {
                for (i = 0; i < tp.length; i++) {
                    var tm = tp[i];
                    if (!tm || !tm.alive || !Number.isFinite(tm.x) || !Number.isFinite(tm.y)) continue;
                    /* teammates are sent in the minimap's frame: same offsets as the minimap uses */
                    var raw = LM.isLegendWorld && (tm._elRawCoords || tm.x < 0 || tm.y < 0);
                    var off = raw ? 0 : (+LM.mapOffsetX || 0), offY = raw ? 0 : (+LM.mapOffsetY || 0);
                    sx = cx + (tm.x - off - camX) * scale;
                    sy = cy + (tm.y - offY - camY) * scale;
                    if (sx >= 0 && sx <= W && sy >= 0 && sy <= H) continue;
                    edgePoint(cx, cy, sx, sy, W, H, margin, _edge);
                    var col = (typeof tm.color === 'string' && tm.color.charAt(0) === '#') ? tm.color : '#4dd2ff';
                    drawArrow(ctx, _edge.x, _edge.y, _edge.a, size, col, 0.9);
                    var nk = nickOf(tm);
                    if (nk) {
                        var lx = _edge.x - Math.cos(_edge.a) * (size + 14), ly = _edge.y - Math.sin(_edge.a) * (size + 10);
                        ctx.globalAlpha = 0.85;
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
                        ctx.strokeText(nk, lx, ly);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(nk, lx, ly);
                    }
                }
            }
        }

        if (s.hudEdgeThreats) {
            var playing = refMass > 0;
            if (!playing) {
                for (i = 0; i < THREAT_SLOTS; i++) threats[i].id = -1;
            } else {
                if (now - _threatScanAt >= 150) { _threatScanAt = now; scanThreats(LM, now); }
                for (i = 0; i < THREAT_SLOTS; i++) {
                    var t = threats[i];
                    if (t.id === -1) continue;
                    var age = now - t.seen;
                    if (age > THREAT_FADE) { t.id = -1; continue; }
                    sx = cx + (t.x - camX) * scale;
                    sy = cy + (t.y - camY) * scale;
                    if (sx >= 0 && sx <= W && sy >= 0 && sy <= H) continue;
                    edgePoint(cx, cy, sx, sy, W, H, margin, _edge);
                    /* solid while still received, then fades out */
                    var al = age < 300 ? 0.9 : 0.9 * (1 - (age - 300) / (THREAT_FADE - 300));
                    if (al <= 0.02) continue;
                    drawArrow(ctx, _edge.x, _edge.y, _edge.a, size * 1.25, '#ff3b3b', al);
                    var rt = ratioText(t.mass / refMass);
                    if (rt && rt !== '=') {
                        ctx.globalAlpha = al;
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
                        var rx = _edge.x - Math.cos(_edge.a) * (size + 16), ry = _edge.y - Math.sin(_edge.a) * (size + 12);
                        ctx.strokeText(rt, rx, ry);
                        ctx.fillStyle = '#ffb0b0';
                        ctx.fillText(rt, rx, ry);
                    }
                }
            }
        } else {
            for (i = 0; i < THREAT_SLOTS; i++) threats[i].id = -1;
        }
        ctx.globalAlpha = 1;
    }

    /* ───────────────────────── frame ───────────────────────── */

    function anyOn(s) {
        return !!(s.hudMoveDir || s.hudMergeSound || s.hudRelativeMass || s.hudEdgeTeammates || s.hudEdgeThreats);
    }

    /* true when frame() will draw on the world context this frame (ogario.v4.js then uses the
     * overlay canvas above the WebGL cells, like for the cursor lines) */
    function worldActive(LM) {
        var s = S();
        return !!(s.hudMoveDir && LM &&
            (LM.play || (LM.playerCellsMulti && LM.playerCellsMulti.length)));
    }

    var _wasOn = false;
    function frame(render, ctx, LM) {
        if (_precisionSaved !== null) precisionCheck();
        var s = S();
        if (!anyOn(s)) {
            if (_wasOn) {
                _wasOn = false;
                refMass = 0; refOwner = 0;
                hideEdges();
                for (var i = 0; i < MAX_OWNERS; i++) { owners[i].dir.has = false; owners[i].prevCount = 0; owners[i].cells.length = 0; }
            }
            return;
        }
        _wasOn = true;
        if (!LM || !render) return;
        var now = performance.now();
        gatherOwners(LM);
        if (ctx && s.hudMoveDir) drawMoveDir(ctx, render, now);
        if (s.hudMergeSound) mergeFrame(LM, now);
        if (s.hudEdgeTeammates || s.hudEdgeThreats) drawEdges(render, LM, now, s);
        else hideEdges();
    }

    /* ───────────────────────── 5. zoom hotkeys ───────────────────────── */

    /* Precision zoom: while the key is held the zoom is the zoom to return to times
     * _precisionMultiplier. The zoom to return to is always the current zoom divided by it, so a
     * wheel zoom while held is kept on release.
     * Held for one connection and unit: a reconnect, server switch or unit switch releases it. */
    var _precisionSaved = null;     /* not null while held (the zoom when it was pressed) */
    var _precisionMultiplier = 1;
    var _precisionSock = null, _precisionUnit = 0;
    function clampZoom(z) { return Math.min(40, Math.max(0.01, z > 0 && Number.isFinite(z) ? z : 1)); }
    function precisionBase(LM) { return clampZoom(LM.zoomValue / _precisionMultiplier); }
    function precisionZoom(down) {
        var LM = window.legendmod;
        if (!LM) return;
        if (down) {
            if (_precisionSaved !== null || !(LM.zoomValue > 0)) return;
            _precisionSaved = clampZoom(LM.zoomValue);
            _precisionMultiplier = Math.min(_precisionSaved * 2.5, 40) / _precisionSaved;
            _precisionSock = LM.socket || null;
            _precisionUnit = window.multiboxPlayerEnabled | 0;
            LM.zoomValue = _precisionSaved * _precisionMultiplier;
        } else if (_precisionSaved !== null) {
            /* P1 fix #64: preserve any wheel zoom adjustments made during precision mode.
             * Instead of restoring the absolute saved value, divide by the multiplier
             * so manual wheel changes are kept. */
            LM.zoomValue = precisionBase(LM);
            _precisionSaved = null;
            _precisionMultiplier = 1;
            _precisionSock = null;
        }
    }
    /* every frame while held */
    function precisionCheck() {
        var LM = window.legendmod;
        if (!LM || (LM.socket || null) !== _precisionSock || (window.multiboxPlayerEnabled | 0) !== _precisionUnit) {
            if (LM) precisionZoom(false);
            else { _precisionSaved = null; _precisionMultiplier = 1; _precisionSock = null; }
        }
    }

    api = window.LMHudHelpers = {
        frame: frame,
        worldActive: worldActive,
        massText: massText,
        /* mass as text in a Mass format mode (the HUD texts of ogario.v4.js shortMassFormat) */
        formatMass: formatMass,
        /* the unit the relative mass and the threat arrows compare with (0 = main player) */
        refUnit: function () { return refOwner; },
        precisionZoom: precisionZoom,
        /* pure parts, for the tests */
        _pure: {
            updateDirection: updateDirection,
            mergeDuration: mergeDuration,
            trackMerge: trackMerge,
            ratioText: ratioText,
            formatMass: formatMass,
            edgePoint: edgePoint
        }
    };
})();
