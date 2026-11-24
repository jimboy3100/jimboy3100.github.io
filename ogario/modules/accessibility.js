/* Legend Mod accessibility options (Settings > Accessibility, all off by default):
 *   a11yTextScale     larger menu text (1 = unchanged), separate from the HUD scale
 *   a11yHudTextScale  larger HUD text (leaderboard, stats, clock, chat); follows the HUD scale
 *   a11yHighContrast  HUD panels with solid dark backgrounds, outlines and outlined text
 *   a11yIndicators    a symbol on opponent cells in addition to the colours: up triangles for
 *                     bigger ones (two: can split on you), down triangles for smaller ones (two:
 *                     you can split on them)
 *   a11yNoFlash       no blinking or animated page elements (CSS animations and transitions)
 *   a11yPalette       colour-blind palette for opponent colours / rings ('off', 'deuteranopia',
 *                     'protanopia', 'tritanopia'); the theme colours are not changed or saved
 * While everything is off this file adds no style, canvas or loop; it checks the options every
 * 2 s (they can also change through settings profiles or an import).
 * The renderer reads window._lmA11yPal (null = theme colours).
 */
(function () {
    'use strict';
    var W = window;
    if (W._lmA11yLoaded) return;
    W._lmA11yLoaded = true;
    var D = W.document;

    /* ═══ Pure helpers (developers/tests/smalltools.js) ═══ */

    /* Seven opponent classes from much bigger to much smaller (eqColor: about your size). Chosen
     * to stay apart by lightness as well as hue for each kind of colour blindness. */
    var PALETTES = {
        deuteranopia: { enemyBSTEDColor: '#cc79a7', enemyBSTEColor: '#d55e00', enemyBColor: '#e69f00', eqColor: '#f0e442', enemySColor: '#56b4e9', enemySSTEColor: '#0072b2', enemySSTEDColor: '#ffffff' },
        protanopia: { enemyBSTEDColor: '#dc267f', enemyBSTEColor: '#fe6100', enemyBColor: '#ffb000', eqColor: '#ffffff', enemySColor: '#648fff', enemySSTEColor: '#2a3fbf', enemySSTEDColor: '#00e5ff' },
        tritanopia: { enemyBSTEDColor: '#a50026', enemyBSTEColor: '#f03b20', enemyBColor: '#ff9db5', eqColor: '#ffffff', enemySColor: '#7fdbda', enemySSTEColor: '#1c9e9b', enemySSTEDColor: '#bdbdbd' }
    };
    var PALETTE_IDS = ['off', 'deuteranopia', 'protanopia', 'tritanopia'];
    function cleanPalette(v) { return typeof v === 'string' && PALETTES.hasOwnProperty(v) ? v : 'off'; }
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

    var core = { PALETTES: PALETTES, PALETTE_IDS: PALETTE_IDS, cleanPalette: cleanPalette, cleanScale: cleanScale, classify: classify, symbolSize: symbolSize, scaleRule: scaleRule };
    var api = W.LMAccessibility = { _core: core };
    if (!D || !D.createElement) return;

    function settings() { return W.legendmod5 || W.defaultmapsettings || {}; }

    /* ═══ Text scale ═══ */

    var MENU_TEXT = ['#og-options label', '#og-options h5', '#og-options .box-label', '#og-options .title-box', '#theme label', '#theme h5', '#theme .title-box', '#theme .box-label',
        '.menu-tabs a', '.submenu-tabs a', '#hotkeys .key-label', '#hotkeys .default-key', '#hotkeys-inst', '#main-panel label', '#main-panel .btn', '#profile label', '#music label',
        '#toast-container .toast-message', '#exp-imp label'];
    var HUD_TEXT = ['#leaderboard-hud', '#top5-hud', '#stats-hud', '#time-hud', '#target-hud', '#pause-hud', '#chat-box'];
    var textStyle = null, textSig = '';
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
        if (sig === textSig && !force) return;
        textSig = sig;
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

    /* ═══ High contrast HUD + no flashing ═══ */

    var CSS_HC = 'body.lm-a11y-hc .hud,body.lm-a11y-hc .hud-b,body.lm-a11y-hc #leaderboard-hud,body.lm-a11y-hc #top5-hud,body.lm-a11y-hc #stats-hud,' +
        'body.lm-a11y-hc #time-hud,body.lm-a11y-hc #target-hud,body.lm-a11y-hc #minimap-hud,body.lm-a11y-hc #messages li{' +
        'background-color:rgba(0,0,0,0.88) !important;color:#fff !important;outline:2px solid rgba(255,255,255,0.8);outline-offset:0;' +
        'text-shadow:0 0 2px #000,0 0 2px #000,1px 1px 0 #000,-1px -1px 0 #000 !important;}' +
        'body.lm-a11y-hc #leaderboard-hud *,body.lm-a11y-hc #stats-hud *,body.lm-a11y-hc #top5-hud *{text-shadow:0 0 2px #000,1px 1px 0 #000,-1px -1px 0 #000 !important;}' +
        'body.lm-a11y-hc #toast-container .toast{opacity:1 !important;outline:2px solid #fff;}';
    var CSS_NOFLASH = 'body.lm-a11y-noflash *,body.lm-a11y-noflash *::before,body.lm-a11y-noflash *::after{' +
        'animation-duration:0.001s !important;animation-iteration-count:1 !important;animation-delay:0s !important;transition-duration:0s !important;transition-delay:0s !important;}';
    var cssEl = null;
    function applyClasses(hc, nf) {
        if ((hc || nf) && !cssEl) {
            cssEl = D.createElement('style');
            cssEl.id = 'lm-a11y-style';
            cssEl.textContent = CSS_HC + CSS_NOFLASH;
            D.head.appendChild(cssEl);
        }
        D.body.classList.toggle('lm-a11y-hc', !!hc);
        D.body.classList.toggle('lm-a11y-noflash', !!nf);
        if (!hc && !nf && cssEl) { if (cssEl.parentNode) cssEl.parentNode.removeChild(cssEl); cssEl = null; }
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
    function indFrame() {
        if (!ind) return;
        ind.raf = requestAnimationFrame(indFrame);
        var c = ind.c, ctx = ind.ctx, lm = W.legendmod, dr = W.drawRender, s = settings();
        var dpr = Math.min(2, W.devicePixelRatio || 1), vw = W.innerWidth, vh = W.innerHeight;
        if (c.width !== Math.round(vw * dpr) || c.height !== Math.round(vh * dpr)) {
            c.width = Math.round(vw * dpr);
            c.height = Math.round(vh * dpr);
            ind.drawn = true;
        }
        if (ind.drawn) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height); ind.drawn = false; }
        if (!lm || !dr || !lm.play || !lm.cells || !dr.canvas) return;
        var my = lm.selectBiggestCell ? lm.playerMaxMass : lm.playerMinMass;
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
            ind = { c: c, ctx: c.getContext('2d'), raf: 0, drawn: false };
            ind.raf = requestAnimationFrame(indFrame);
        } else if (!on && ind) {
            cancelAnimationFrame(ind.raf);
            if (ind.c.parentNode) ind.c.parentNode.removeChild(ind.c);
            ind = null;
        }
    }

    /* ═══ Applying the options ═══ */

    function sync(force) {
        var s = settings();
        var pal = cleanPalette(s.a11yPalette);
        W._lmA11yPal = pal === 'off' ? null : PALETTES[pal];
        applyText(cleanScale(s.a11yTextScale), cleanScale(s.a11yHudTextScale), force === true);
        if (D.body) applyClasses(s.a11yHighContrast === true, s.a11yNoFlash === true);
        setIndicators(s.a11yIndicators === true);
        var sel = D.getElementById('a11yPalette');
        if (sel && sel.value !== pal) sel.value = pal;
    }
    api.sync = sync;
    api.remeasure = function () { sync(true); };
    api.drawSymbol = drawSymbol;

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
