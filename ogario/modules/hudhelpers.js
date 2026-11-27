/*
 * HUD helpers (Legend Mod).
 *
 * Each helper has its own option in the settings, all off by default:
 *   hudMergeCountdown  seconds until each own cell can merge (agar.io only: the only place the
 *                      timing is known; it is an estimate, like the merge ring)
 *   hudMergeSound      short sound when two of your cells can merge again
 *   hudRelativeMass    other players' mass as a ratio to your biggest cell (1.75x, 0.40x, "=")
 *   massFormat         1 exact, 2 12.3k, 3 auto (Settings > Mass: "Mass format"; 0 of older
 *                      versions was "as Short mass"); the core draws 1 and 2 itself
 *
 * ogario.v4.js calls frame() once per rendered frame after the cell overlays; it returns at once
 * while every option is off. Drawing reuses objects and cached strings: no garbage per frame.
 */
(function () {
    'use strict';
    if (window._lmHudHelpersLoaded) return;
    window._lmHudHelpersLoaded = true;

    /* ───────────────────────── pure parts (developers/tests/hudhelpers.js) ───────────────────────── */

    /* Merge time estimate, the formula of ogario/mergetimer.js (agar.io): 29 s + 8/300 s per mass */
    function mergeDuration(mass) {
        return 29 + (8 / 300) * (mass > 0 ? mass : 0);
    }

    /*
     * Merge countdown bookkeeping for one owner's cells (main player or one multibox unit).
     * A piece that appears while the count grows, and a piece that lost a large part of its mass
     * then (the one that split or popped), start a new countdown. Pieces first seen without such
     * a split (option turned on mid-game) are unknown (-1) and get no number.
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

    var _secTxt = [];
    /* whole seconds left as text ("" when none), cached */
    function countdownText(sec) {
        if (!(sec > 0)) return '';
        var n = Math.ceil(sec);
        if (n > 999) n = 999;
        return _secTxt[n] || (_secTxt[n] = String(n));
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

    /* ───────────────────────── state ───────────────────────── */

    var MAX_OWNERS = 9; /* main player + up to 8 multibox units */
    var owners = [];
    for (var _oi = 0; _oi < MAX_OWNERS; _oi++) {
        owners.push({
            cells: [], prevCount: 0, beep: false, beepAfter: 0, maxSize: 0, n: 0
        });
    }
    var refMass = 0;            /* mass of the reference unit's biggest cell (0 when not playing) */
    var refOwner = 0;           /* that unit: 0 the main player, else the multibox unit number */
    var _pB = { x: 0, y: 0 };
    var _fonts = [];
    var _lastBeep = 0;
    var api;

    function S() { return window.legendmod5 || {}; }
    function fontPx(px) {
        px = Math.max(6, Math.min(2000, Math.round(px)));
        return _fonts[px] || (_fonts[px] = '700 ' + px + 'px Ubuntu, Arial, sans-serif');
    }
    function isOwn(c) { return !!(c && (c.isPlayerCell || c.isPlayerCellMulti)); }

    /* Own cells of every owner into owners[k].cells (arrays reused), with their biggest size. */
    function gatherOwners(LM) {
        var i, o, c;
        for (i = 0; i < MAX_OWNERS; i++) owners[i].cells.length = 0;
        var pc = LM.playerCells;
        if (pc && pc.length) for (i = 0; i < pc.length; i++) if (pc[i] && !pc[i].removed) owners[0].cells.push(pc[i]);
        var mc = LM.playerCellsMulti;
        if (mc && mc.length) {
            for (i = 0; i < mc.length; i++) {
                c = mc[i];
                if (!c || c.removed) continue;
                var k = c.spectator | 0;
                if (k > 0 && k < MAX_OWNERS) owners[k].cells.push(c);
            }
        }
        for (i = 0; i < MAX_OWNERS; i++) {
            o = owners[i];
            var ms = 0;
            for (var j = 0; j < o.cells.length; j++) {
                c = o.cells[j];
                if (c.size > ms) ms = c.size;
            }
            o.n = o.cells.length;
            o.maxSize = ms;
        }
        /* reference for the relative mass: the unit you
         * control, as the opponent colours (compareCells) use it: the focused multibox unit, else
         * the main player; when that one has no cells, the main player or the biggest unit */
        var act = window.multiboxPlayerEnabled | 0, ro = 0;
        if (act > 0 && act < MAX_OWNERS && owners[act].n) ro = act;
        else if (!owners[0].n) for (i = 1; i < MAX_OWNERS; i++) if (owners[i].maxSize > owners[ro].maxSize) ro = i;
        var ref = owners[ro].maxSize;
        refOwner = ref > 0 ? ro : 0;
        refMass = ref > 0 ? ref * ref / 100 : 0;
    }

    /* ───────────────────────── 1. merge countdown ───────────────────────── */

    /* seconds left for a cell: mergetimer.js's deadline while it counts the main player's cell
     * (the merge ring uses the same one), else this module's estimate; -1 unknown, 0 ready */
    function mergeLeft(c, isMain, now) {
        if (isMain && window.MergeTimerController && window.playerCellsId &&
            typeof window.MergeTimerController.isActive === 'function' && window.MergeTimerController.isActive()) {
            var md = window.playerCellsId[c.id];
            if (md && md._mergeState === 'counting' && Number.isFinite(md._mergeDeadline)) {
                return Math.max(0, (md._mergeDeadline - now) / 1000);
            }
        }
        if (c._lmHHEnd > 0) return Math.max(0, (c._lmHHEnd - now) / 1000);
        return c._lmHHEnd === 0 ? 0 : -1;
    }

    function mergeFrame(ctx, render, LM, now, s) {
        var known = !!(LM.integrity && !LM.isLegendWorld);
        var draw = known && s.hudMergeCountdown;
        var scale = render.scale || 1;
        var beepNow = false;
        if (draw) {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
        }
        try {
            for (var i = 0; i < MAX_OWNERS; i++) {
                var o = owners[i];
                var ready = trackMerge(o, o.cells, o.n, now);
                if (!known) continue;
                if (o.beep && ready >= 2 && (!o.beepAfter || now >= o.beepAfter)) { o.beep = false; o.beepAfter = 0; beepNow = true; }
                if (!draw || o.n < 2) continue;
                for (var j = 0; j < o.n; j++) {
                    var c = o.cells[j];
                    if (c.isInView && !c.isInView()) continue;
                    var left = mergeLeft(c, i === 0, now);
                    var txt = countdownText(left);
                    if (!txt) continue;
                    var px = Math.max(c.size * 0.34, 13 / scale);
                    var p = render.getLegendWorldAttachedRenderPoint ? render.getLegendWorldAttachedRenderPoint(c.x, c.y, _pB) : (_pB.x = c.x, _pB.y = c.y, _pB);
                    var y = p.y + c.size * 0.58;
                    ctx.font = fontPx(px);
                    ctx.lineWidth = Math.max(1, px * 0.16);
                    ctx.fillStyle = left < 5 ? '#00ff66' : (left < 15 ? '#ffcc00' : '#ffffff');
                    ctx.strokeText(txt, p.x, y);
                    ctx.fillText(txt, p.x, y);
                }
            }
        } finally {
            if (draw) ctx.restore();
        }
        if (beepNow && s.hudMergeSound && now - _lastBeep > 1500) {
            _lastBeep = now;
            var app = window.application;
            if (app && app._lmOptSound && app.playSound) app.playSound(app._lmOptSound('mergeReady'));
        }
    }

    /* ───────────────────────── 2. mass text (called by both renderers) ───────────────────────── */

    /* Text for a cell's mass with massFormat / hudRelativeMass; mass already as the game shows it. */
    function massText(mass, cell) {
        var s = S();
        if (s.hudRelativeMass && refMass > 0 && cell && !isOwn(cell) && !cell.isVirus && !cell.isFood && !cell.isEjected) {
            var r = ratioText(mass / refMass);
            if (r) return r;
        }
        return formatMass(mass, +s.massFormat || 0, !!s.shortMass);
    }

    /* ───────────────────────── frame ───────────────────────── */

    function anyOn(s) {
        return !!(s.hudMergeCountdown || s.hudMergeSound || s.hudRelativeMass);
    }

    /* true when frame() will draw on the world context this frame (ogario.v4.js then uses the
     * overlay canvas above the WebGL cells, like for the cursor lines) */
    function worldActive(LM) {
        var s = S();
        return !!(s.hudMergeCountdown && LM &&
            (LM.play || (LM.playerCellsMulti && LM.playerCellsMulti.length)));
    }

    var _wasOn = false;
    function frame(render, ctx, LM) {
        var s = S();
        if (!anyOn(s)) {
            if (_wasOn) {
                _wasOn = false;
                refMass = 0; refOwner = 0;
                for (var i = 0; i < MAX_OWNERS; i++) { owners[i].prevCount = 0; owners[i].cells.length = 0; }
            }
            return;
        }
        _wasOn = true;
        if (!LM || !render) return;
        var now = performance.now();
        gatherOwners(LM);
        if (ctx && (s.hudMergeCountdown || s.hudMergeSound)) mergeFrame(ctx, render, LM, now, s);
    }

    api = window.LMHudHelpers = {
        frame: frame,
        worldActive: worldActive,
        massText: massText,
        /* mass as text in a Mass format mode (the HUD texts of ogario.v4.js shortMassFormat) */
        formatMass: formatMass,
        /* the unit the relative mass compares with (0 = main player) */
        refUnit: function () { return refOwner; },
        mergeLeft: mergeLeft,
        /* pure parts, for the tests */
        _pure: {
            mergeDuration: mergeDuration,
            trackMerge: trackMerge,
            countdownText: countdownText,
            ratioText: ratioText,
            formatMass: formatMass
        }
    };
})();
