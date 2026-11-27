/* Legend Mod accessibility options (Settings > Accessibility, all off by default):
 *   a11yTextScale     larger menu text (1 = unchanged), separate from the HUD scale
 *   a11yHudTextScale  larger HUD text (leaderboard, stats, clock, chat); follows the HUD scale
 *                     (its slider is in Theme > HUD next to the HUD scale; still a gameplay setting)
 *   a11yIndicators    a symbol on opponent cells in addition to the colours: up triangles for
 *                     bigger ones (two: can split on you), down triangles for smaller ones (two:
 *                     you can split on them)
 * While they are off this file adds no style, canvas or loop; it checks the options every
 * 2 s (they can also change through settings profiles or an import).
 * (Colour-blind colours and a high-contrast HUD: the theme preset "Colour-blind safe"; less
 * motion and flashing: the reducedMotion option.)
 */
(function () {
    'use strict';
    var W = window;
    if (W._lmA11yLoaded) return;
    W._lmA11yLoaded = true;
    var D = W.document;

    /* ═══ Pure helpers (developers/tests/smalltools.js) ═══ */

    function cleanScale(v) {
        v = +v;
        return isFinite(v) ? Math.min(1.6, Math.max(1, Math.round(v * 100) / 100)) : 1;
    }
    /* the same classes as the opponent colours (dominationRate / dominatedRate):
     * 'B2' can split on you, 'B' bigger, '' about your size, 'S' smaller, 'S2' you can split on it */
    function classify(mass, myMass, dom, domd) {
        if (!(myMass > 0) || !(mass > 0)) return '';
        dom = +dom || 4 / 3;
        domd = +domd || 3 / 4;
        var r = mass / myMass;
        if (r >= dom * 2) return 'B2';
        if (r >= dom) return 'B';
        if (r >= domd) return '';
        if (r >= domd / 2) return 'S';
        return 'S2';
    }
    /* symbol size in CSS px for a cell of screen radius r */
    function symbolSize(r) { return Math.max(9, Math.min(24, r * 0.32)); }
    /* one CSS rule that scales a text element relative to its parent (ratio = its own size /
     * the parent's, measured without the rule), so later HUD scale changes still apply */
    function scaleRule(sel, ratio, k) {
        if (!(ratio > 0) || !(k > 0)) return '';
        return sel + '{font-size:' + (Math.round(ratio * k * 10000) / 100) + '% !important;}';
    }

    /* The mass the symbols compare with: the unit you control, the way the opponent colours
     * (compareCells) pick it: the focused multibox unit, else the main player while alive; its
     * biggest or smallest cell as the game's "biggest cell" choice says. The game keeps those
     * masses only while an opponent colour / range option is on: otherwise from the unit's cells.
     * 0 (no symbols) while dead, in the menu or watching a replay (its cells are not yours). */
    function refMass(lm, w) {
        if (!lm || !w || w._lmEvReplayOn) return 0;
        var n = w.multiboxPlayerEnabled, big = !!lm.selectBiggestCell;
        var sp = n && typeof w.getActiveSpect === 'function' ? w.getActiveSpect(n) : null;
        var u = sp || (lm.play ? lm : null);
        if (!u) return 0;
        var m = big ? u.playerMaxMass : u.playerMinMass;
        if (m > 0) return m;
        var cells = sp ? lm.playerCellsMulti : lm.playerCells, best = 0;
        if (!cells) return 0;
        for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            if (!c || c.removed || (sp && c.spectator !== n)) continue;
            var cm = ~~(c.size * c.size * 0.01);
            if (cm > 0 && (!best || (big ? cm > best : cm < best))) best = cm;
        }
        return best;
    }

    var core = { cleanScale: cleanScale, classify: classify, symbolSize: symbolSize, scaleRule: scaleRule, refMass: refMass };
    var api = W.LMAccessibility = { _core: core };
    if (!D || !D.createElement) return;

    function settings() { return W.legendmod5 || W.defaultmapsettings || {}; }

    /* ═══ Text scale ═══ */

    var MENU_TEXT = ['#og-options label', '#og-options h5', '#og-options .box-label', '#og-options .title-box', '#theme label', '#theme h5', '#theme .title-box', '#theme .box-label',
        '.menu-tabs a', '.submenu-tabs a', '#hotkeys .key-label', '#hotkeys .default-key', '#hotkeys-inst', '#main-panel label', '#main-panel .btn', '#profile label',
        '#toast-container .toast-message', '#exp-imp label'];
    var HUD_TEXT = ['#leaderboard-hud', '#top5-hud', '#stats-hud', '#time-hud', '#target-hud', '#pause-hud', '#chat-box',
        /* the newer HUD parts on body: they are made when first used, so they are measured once they exist */
        '#lm-killfeed', '#lm-hh-cells', '#lm-hh-edge', '#lm-notif-bell', '#lm-notif-panel', '#lm-cc-bar', '#lm-dir-bc', '#lm-pr-hud', '#lm-radial', '#lm-shot-chip'];
    var textStyle = null, textSig = '', textSeen = '';
    function present(list) { return list.filter(function (sel) { return !!D.querySelector(sel); }).join(); }
    function measure(list, k, out) {
        list.forEach(function (sel) {
            var n = D.querySelector(sel);
            if (!n || !n.parentNode || n.parentNode.nodeType !== 1) return;
            var fs = parseFloat(W.getComputedStyle(n).fontSize), pfs = parseFloat(W.getComputedStyle(n.parentNode).fontSize);
            if (fs > 0 && pfs > 0) out.push(scaleRule(sel, fs / pfs, k));
        });
    }
    function applyText(menuK, hudK, force) {
        var sig = menuK + '|' + hudK;
        /* one set of properties for windows and HUD parts that size their text from it */
        var rs = D.documentElement.style;
        rs.setProperty('--lm-font-scale', String(menuK));
        rs.setProperty('--lm-hud-text-scale', String(hudK));
        var seen = hudK !== 1 ? present(HUD_TEXT) : '';
        if (sig === textSig && seen === textSeen && !force) return;
        textSig = sig;
        textSeen = seen;
        if (menuK === 1 && hudK === 1) {
            if (textStyle && textStyle.parentNode) textStyle.parentNode.removeChild(textStyle);
            textStyle = null;
            return;
        }
        if (!textStyle) { textStyle = D.createElement('style'); textStyle.id = 'lm-a11y-text'; D.head.appendChild(textStyle); }
        /* measure the unscaled sizes */
        textStyle.textContent = '';
        var rules = [];
        if (menuK !== 1) measure(MENU_TEXT, menuK, rules);
        if (hudK !== 1) measure(HUD_TEXT, hudK, rules);
        textStyle.textContent = rules.join('');
    }

    /* ═══ Indicator symbols (own canvas above the game, nothing in the renderer) ═══ */

    var ind = null;
    function drawTri(ctx, x, y, s, up) {
        var h = s * 0.8;
        ctx.beginPath();
        if (up) { ctx.moveTo(x, y - h / 2); ctx.lineTo(x + s / 2, y + h / 2); ctx.lineTo(x - s / 2, y + h / 2); }
        else { ctx.moveTo(x, y + h / 2); ctx.lineTo(x + s / 2, y - h / 2); ctx.lineTo(x - s / 2, y - h / 2); }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    function drawSymbol(ctx, kind, x, y, s) {
        var up = kind.charAt(0) === 'B', two = kind.length === 2;
        if (two) { drawTri(ctx, x - s * 0.55, y, s, up); drawTri(ctx, x + s * 0.55, y, s, up); }
        else drawTri(ctx, x, y, s, up);
    }
    /* Drawn with the game's frames: the core calls api.frame() where it draws the HUD helpers
     * (after its FPS limit, nothing while it does not draw). Until the first such call (an older
     * cached core) a requestAnimationFrame loop stands in; it stops by itself once the core calls.
     * Without frames for a while (menu, paused drawing) the symbols are cleared. */
    function coreFrame() {
        if (!ind) return;
        ind.core = Date.now();
        if (ind.raf) { cancelAnimationFrame(ind.raf); ind.raf = 0; }
        drawInd();
    }
    function rafFrame() {
        if (!ind) return;
        ind.raf = 0;
        if (ind.core) return;
        ind.raf = requestAnimationFrame(rafFrame);
        drawInd();
    }
    function staleCheck() {
        if (ind && ind.core && ind.drawn && Date.now() - ind.core > 500) {
            ind.ctx.setTransform(1, 0, 0, 1, 0, 0);
            ind.ctx.clearRect(0, 0, ind.c.width, ind.c.height);
            ind.drawn = false;
        }
    }
    function drawInd() {
        var c = ind.c, ctx = ind.ctx, lm = W.legendmod, dr = W.drawRender, s = settings();
        var dpr = Math.min(2, W.devicePixelRatio || 1), vw = W.innerWidth, vh = W.innerHeight;
        if (c.width !== Math.round(vw * dpr) || c.height !== Math.round(vh * dpr)) {
            c.width = Math.round(vw * dpr);
            c.height = Math.round(vh * dpr);
            ind.drawn = true;
        }
        if (ind.drawn) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); ind.drawn = false; }
        if (!lm || !dr || !lm.cells || !dr.canvas) return;
        var my = refMass(lm, W);
        if (!(my > 0)) return;
        var base = dr.canvas.getBoundingClientRect();
        var cw = dr.canvasWidth || base.width, ch = dr.canvasHeight || base.height;
        var k = base.width / (cw || 1), sc = (dr.scale || 1) * k;
        var cx = base.left + base.width / 2, cy = base.top + base.height / 2, camX = dr.camX, camY = dr.camY;
        if (typeof camX !== 'number' || typeof camY !== 'number') return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#fff';
        var cells = lm.cells, dom = s.dominationRate, domd = s.dominatedRate, n = 0;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (!cell || cell.isPlayerCell || cell.isPlayerCellMulti || cell.isVirus || cell.invisible || cell.isFood || cell.isEjected) continue;
            var size = cell.size;
            var mass = ~~(size * size * 0.01);
            if (mass <= 14) continue;
            var r = size * sc, x = cx + (cell.x - camX) * sc, y = cy + (cell.y - camY) * sc;
            if (r < 6 || x + r < 0 || y + r < 0 || x - r > vw || y - r > vh) continue;
            var kind = classify(mass, my, dom, domd);
            if (!kind) continue;
            drawSymbol(ctx, kind, x, y - r * 0.5, symbolSize(r));
            if (++n > 400) break;
        }
        ind.drawn = n > 0;
    }
    function setIndicators(on) {
        if (on && !ind) {
            var c = D.createElement('canvas');
            c.id = 'lm-a11y-ind';
            var dr = W.drawRender, last = null, z = 4;
            if (dr) [dr.backgroundCanvas, dr.gridCanvas, dr.canvas, dr.glCanvas, dr.overlayCanvas].forEach(function (g) {
                if (!g || !g.parentNode) return;
                last = g;
                var gz = parseInt(g.style.zIndex, 10);
                if (isFinite(gz) && gz > z) z = gz;
            });
            c.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:' + z + ';';
            if (last && last.parentNode) last.parentNode.insertBefore(c, last.nextSibling); else D.body.appendChild(c);
            ind = { c: c, ctx: c.getContext('2d'), raf: 0, drawn: false, core: 0 };
            ind.raf = requestAnimationFrame(rafFrame);
            ind.stale = setInterval(staleCheck, 500);
        } else if (!on && ind) {
            if (ind.raf) cancelAnimationFrame(ind.raf);
            clearInterval(ind.stale);
            if (ind.c.parentNode) ind.c.parentNode.removeChild(ind.c);
            ind = null;
        }
    }

    /* ═══ Applying the options ═══ */

    function sync(force) {
        var s = settings();
        applyText(cleanScale(s.a11yTextScale), cleanScale(s.a11yHudTextScale), force === true);
        setIndicators(s.a11yIndicators === true);
    }
    api.sync = sync;
    api.remeasure = function () { sync(true); };
    api.drawSymbol = drawSymbol;
    /* called by the core once per drawn frame (does nothing while the symbols are off) */
    api.frame = coreFrame;

    /* the sliders have no callback in the menu: follow their input here */
    D.addEventListener('input', function (e) {
        var id = e.target && e.target.id;
        if (id === 'a11yTextScale-slider' || id === 'a11yHudTextScale-slider') setTimeout(sync, 0);
    }, true);
    /* menus built later (theme, hotkeys): measure again when the menu opens with a text scale on */
    D.addEventListener('click', function (e) {
        if (textSig && textSig !== '1|1' && e.target && e.target.closest && e.target.closest('.menu-tabs a, .hotkeys-link')) setTimeout(function () { sync(true); }, 300);
    }, true);
    if (D.body) sync(); else D.addEventListener('DOMContentLoaded', function () { sync(); });
    setInterval(function () { try { sync(); } catch (e) { } }, 2000);
})();
