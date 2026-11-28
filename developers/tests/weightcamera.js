/* Camera on the centre of mass (Settings > Zoom, centerWeightCamera) with the real code of
 * ogario/ogario.v4.js: the setting (off by default, a boolean, in the Zoom group), the camera
 * (calculatePlayerMassAndPosition + setView: off = plain average of the own cells, on = the
 * mass-weighted centre, reached with the usual glide), the sent cursor (getCursorPosition: the
 * world point under the mouse on the drawn screen, alone and with a multibox unit), spectating.
 * The multibox frame (drawRender.getMultiboxFrame) for 1..6 players: two players give exactly the
 * result of the two-player version (kept below as OLD_FRAME) on 3000 seeded cases; 3..6 players fit
 * with "View on middle of both"; the three view modes; main player dead; Full Map spectators and
 * units without a place left out; no allocation per call; 3..6 players: the same places in other
 * slots give the same frame bit for bit, the controlled player on screen (focused, "when close"),
 * "always" fits all within the 80 % zoom limit, no jump or back and forth, a unit stalled over
 * LM_MB_STALL_MS does not pull the frame (a shorter gap and the controlled one do), Rotate Map flips
 * mirror the frame; wide / tall screens, manual and Auto zoom, split players. setScale: zooming out to a frame that fits
 * several players as fast as the camera centre (a far unit taking the focus is on screen at once).
 * node developers/tests/weightcamera.js [other ogario.v4.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* the setting: default, value check, menu group */
const sctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { } };
sctx.window = sctx;
sctx.localStorage = { getItem: () => null, setItem() { }, removeItem() { } };
vm.createContext(sctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), sctx);
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), sctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), sctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), sctx);
const D = sctx.LM_SETTINGS_DEFAULTS, V = sctx.lmSettingValue;
check('centerWeightCamera is a setting, off by default', D.centerWeightCamera === false);
check('a saved value is read (true / "true" kept, other types refused)', V('centerWeightCamera', true) === true && V('centerWeightCamera', 'true') === true && V('centerWeightCamera', 5) === undefined);
check('its switch is in Settings > Zoom', /this\.addOptions\(\[[^\]]*"centerWeightCamera"[^\]]*\], "zoomGroup"\)/.test(main));

/* the camera and the cursor: the real methods, with the multibox helpers */
const ctx = { console, Math, Number, Infinity, NaN, isFinite, performance: { now: () => t } };
let t = 1000;
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(cut('var LM_MB_CAMERA_NEAR = ', '/* OgVer set above'), ctx);
/* the stall rule of the frame's hide step, which the camera reuses (a unit without _lmWorldStamp never stalls) */
vm.runInContext(cut('var LM_MB_STALL_MS = ', '/* A spectator or Full Map tile') + cut('function _lmMbStalled(sp, now) {', '/* Does this connection'), ctx);
vm.runInContext('var playersLength = 0, spects = [], defaultmapsettings = {}; function getActiveSpect(n) { for (var i = 0; i < spects.length; i++) if (spects[i] && spects[i].number === n && spects[i].player !== false) return spects[i]; return null; }', ctx);
ctx.LMEvents = { _has: () => false };
const LM = vm.runInContext('({\n' + cut('        calculatePlayerMassAndPosition() {', '        recalculatePlayerMass() {') +
  cut('        getCursorPosition() {', '        getLineSplitSettings() {') + '\n})', ctx);
Object.assign(LM, { recalculatePlayerMass() { }, play: true, playerCells: [], canvasWidth: 1920, canvasHeight: 1080, viewScale: 0.5, autoZoom: false, zoomValue: 1, scale: 1, serverType: 'agario' });
const R = vm.runInContext('({\n' + cut('        setView() {', '        renderFrame() {') + '\n})', ctx);
Object.assign(R, { canvasWidth: 1920, canvasHeight: 1080, scale: 0.5 });
ctx.LM = ctx.legendmod = LM; ctx.drawRender = R;
const S = ctx.defaultmapsettings;
Object.assign(S, { cameraSmoothLerp: true, middleMultiView: false, middleMultiViewWhenClose: false });
const frame = () => { t += 16.667; R.setView(); LM.viewScale = R.scale; LM.getCursorPosition(); };
const run = n => { for (let i = 0; i < n; i++) frame(); };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1);

/* after a split: one big cell (size 400) and eight pieces (size 60) 1500 to the right */
const big = { x: 0, y: 0, size: 400, targetSize: 400 };
const pieces = Array.from({ length: 8 }, (_, i) => ({ x: 1500, y: (i - 3.5) * 130, size: 60, targetSize: 60 }));
LM.playerCells = [big].concat(pieces);
const avgX = 8 * 1500 / 9, wX = 8 * 3600 * 1500 / (160000 + 8 * 3600);
LM.clientX = 960 + 100; LM.clientY = 540; /* mouse 100 px right of the screen centre */

S.centerWeightCamera = false;
run(30);
check('off: the camera is on the plain average of the own cells, as before', near(R.camX, avgX) && near(R.camY, 0));
check('off: the sent cursor is the world point under the mouse', near(LM.cursorX, R.camX + 100 / R.scale) && near(LM.cursorY, R.camY));

S.centerWeightCamera = true;
const steps = [];
let last = R.camX;
for (let i = 0; i < 12; i++) { frame(); steps.push(last - R.camX); last = R.camX; }
check('on: the camera glides to the mass-weighted centre (no jump, every step smaller)', steps[0] < (avgX - wX) * 0.7 && steps.every((s, i) => s > 0 && (i === 0 || s < steps[i - 1])));
run(30);
check('on: the camera is on the mass-weighted centre (not the plain average: ' + Math.round(wX) + ' vs ' + Math.round(avgX) + ')', near(R.camX, wX) && near(R.camY, 0) && !near(wX, avgX, 500));
check('on: viewX keeps the plain average (minimap, sectors and multibox read it)', near(LM.viewX, avgX));
check('on: the sent cursor is the world point under the mouse', near(LM.cursorX, R.camX + 100 / R.scale) && near(LM.cursorY, R.camY));
LM.clientX = 960; LM.clientY = 540; frame();
check('on: the mouse at the screen centre sends the screen centre', near(LM.cursorX, R.camX) && near(LM.cursorY, R.camY));
LM.clientX = 1060;

/* a multibox unit alive far away, the main player controlled: the multibox frame keeps the camera */
const unitCells = [{ x: 9000, y: 9000, size: 200 }];
const unit = { number: 1, player: true, playerCellIDs: [1], playerX: 9000, playerY: 9000, playerSize: 200, getOwnPlayerCells: () => unitCells, calculatePlayerMassAndPosition() { } };
ctx.spects.push(unit); LM.multiBoxPlayerExists = true; ctx.multiboxPlayerEnabled = 0;
run(40);
check('multibox, main controlled: the multibox frame keeps the camera (on the main player)', near(R.camX, avgX) && near(R.camY, 0));
check('multibox, main controlled: the sent cursor is the world point under the mouse', near(LM.cursorX, R.camX + 100 / R.scale) && near(LM.cursorY, R.camY));
ctx.multiboxPlayerEnabled = 1;
run(60);
check('multibox, unit controlled: the camera is on the unit and the cursor under the mouse', near(R.camX, 9000) && near(LM.cursorX, R.camX + 100 / R.scale));
check('multibox frame: setView writes no window.middleMultiViewFlag (nothing read it)', !('middleMultiViewFlag' in ctx));
ctx.spects.length = 0; LM.multiBoxPlayerExists = false; ctx.multiboxPlayerEnabled = 0;

/* ---- the multibox frame for 1..6 players ---- */
/* the two-player getMultiboxFrame as it was (6c4605621), the reference for two players */
const OLD_FRAME = `({ getMultiboxFrame(mainSize) {
            if (!LM.multiBoxPlayerExists || typeof spects === 'undefined' || !spects || !spects.length) return null;
            var focus = window.multiboxPlayerEnabled ? getActiveSpect(window.multiboxPlayerEnabled) : null;
            var unit = null, unitCells = null;
            var candidates = focus ? [focus].concat(spects) : spects;
            for (var i = 0; i < candidates.length && !unit; i++) {
                var sp = candidates[i];
                if (!sp || !sp.player || !sp.playerCellIDs || !sp.playerCellIDs.length || !Number.isFinite(sp.playerX) ||
                    (typeof sp.transformReady === 'function' && !sp.transformReady())) continue;
                var cells = sp.getOwnPlayerCells();
                if (cells.length) {
                    unit = sp;
                    unitCells = cells;
                }
            }
            if (!unit) return null;
            var p2 = lmMultiboxPlayerBox(unitCells, unit.playerX, unit.playerY, unit.playerSize);
            var mainAlive = LM.playerCells && LM.playerCells.length && Number.isFinite(LM.viewXTrue);
            if (!mainAlive) {
                return { x: p2.x, y: p2.y, zoom: 1, both: 0, size: p2.size };
            }
            var p1 = lmMultiboxPlayerBox(LM.playerCells, LM.viewXTrue, LM.viewYTrue, mainSize);
            var controlled = focus === unit ? p2 : p1;
            var minX = Math.min(p1.minX, p2.minX), maxX = Math.max(p1.maxX, p2.maxX);
            var minY = Math.min(p1.minY, p2.minY), maxY = Math.max(p1.maxY, p2.maxY);
            var baseScale = this.getTargetScale(controlled.size, true);
            var fit = Math.min(
                (this.canvasWidth || 1) * 0.9 / Math.max(1, maxX - minX),
                (this.canvasHeight || 1) * 0.9 / Math.max(1, maxY - minY)
            ) / (baseScale > 0 ? baseScale : 1);
            var both;
            if (defaultmapsettings.middleMultiView) {
                both = 1;
            } else if (defaultmapsettings.middleMultiViewWhenClose) {
                both = lmSmoothstep(LM_MB_CAMERA_FAR, LM_MB_CAMERA_NEAR, fit);
            } else {
                both = 0;
            }
            var boxX = (minX + maxX) / 2, boxY = (minY + maxY) / 2;
            var zoomBoth = Math.min(1, Math.max(LM_MB_CAMERA_NEAR, fit));
            return {
                x: controlled.x + (boxX - controlled.x) * both,
                y: controlled.y + (boxY - controlled.y) * both,
                zoom: 1 + (zoomBoth - 1) * both,
                both: both,
                size: controlled.size
            };
        } })`;
const R0 = vm.runInContext(OLD_FRAME, ctx);
['getTargetScale', 'getZoom'].forEach((k) => { R0[k] = R[k]; });
const NEAR = vm.runInContext('LM_MB_CAMERA_NEAR', ctx);
let seed = 20261128;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const blob = (cx, cy, k, smax) => Array.from({ length: k }, () => { const s = 20 + rnd() * smax; return { x: cx + (rnd() - 0.5) * 900, y: cy + (rnd() - 0.5) * 900, size: s, targetSize: s }; });
/* a playing unit: its own cells, position and size as spect.js keeps them */
const mkUnit = (num, cells, o) => Object.assign({
    number: num, player: true, playerCellIDs: cells.map((_, i) => i + 1),
    playerX: cells.reduce((a, c) => a + c.x / cells.length, 0), playerY: cells.reduce((a, c) => a + c.y / cells.length, 0),
    playerSize: cells.reduce((a, c) => a + c.size, 0), transformReady: () => true, getOwnPlayerCells() { return cells; }
}, o || {});
const setMain = (cells, vx, vy) => { LM.playerCells = cells; LM.viewXTrue = vx; LM.viewYTrue = vy; LM.play = cells.length > 0; };
const sizeOf = (cells) => cells.reduce((a, c) => a + c.size, 0);
const same = (a, b) => (a === null && b === null) || (!!a && !!b && ['x', 'y', 'zoom', 'both', 'size'].every((k) => Object.is(a[k], b[k])));
LM.multiBoxPlayerExists = true;

/* two players (main + one unit; sometimes a second unit without a place yet or a Full Map
 * spectator): the new frame is the old one bit for bit, every mode, both focuses, main dead,
 * Auto zoom, other screen sizes */
{
    let diff = 0, cases = 0, blended = 0, firstDiff = '';
    for (let k = 0; k < 3000; k++) {
        const d = rnd() < 0.3 ? rnd() * 1500 : rnd() * 9000, ang = rnd() * Math.PI * 2;
        const mc = blob(rnd() * 4000, rnd() * 4000, 1 + Math.floor(rnd() * 8), 500);
        const uc = blob(mc[0].x + Math.cos(ang) * d, mc[0].y + Math.sin(ang) * d, 1 + Math.floor(rnd() * 8), 500);
        setMain(rnd() < 0.15 ? [] : mc, mc[0].x + (rnd() - 0.5) * 200, mc[0].y + (rnd() - 0.5) * 200);
        ctx.spects.length = 0;
        ctx.spects.push(mkUnit(1, uc));
        if (rnd() < 0.2) ctx.spects.push(mkUnit(2, blob(0, 0, 2, 300), { transformReady: () => false }));
        if (rnd() < 0.1) ctx.spects.unshift({ number: 3, player: false, playerCellIDs: [1], playerX: 0, playerY: 0, getOwnPlayerCells: () => mc });
        ctx.multiboxPlayerEnabled = rnd() < 0.5 ? 1 : (rnd() < 0.3 ? 2 : 0);
        S.middleMultiView = rnd() < 0.3; S.middleMultiViewWhenClose = rnd() < 0.6;
        LM.autoZoom = rnd() < 0.5; LM.zoomValue = 0.3 + rnd(); LM.scale = 0.2 + rnd() * 0.5;
        R.canvasWidth = R0.canvasWidth = [1920, 1280, 2560, 800][k % 4]; R.canvasHeight = R0.canvasHeight = [1080, 720, 1440, 1280][k % 4];
        const a = R0.getMultiboxFrame(sizeOf(LM.playerCells)), b = R.getMultiboxFrame(sizeOf(LM.playerCells));
        cases++;
        if (a && a.both > 0 && a.both < 1) blended++;
        if (!same(a, b)) { diff++; if (!firstDiff) firstDiff = k + ': ' + JSON.stringify(a) + ' vs ' + JSON.stringify(b); }
    }
    check('two players: the frame is the two-player version\'s, bit for bit (' + cases + ' cases, ' + blended + ' blended)' + (firstDiff ? ' ' + firstDiff : ''), diff === 0 && blended > 50);
}
R.canvasWidth = R0.canvasWidth = 1920; R.canvasHeight = R0.canvasHeight = 1080;
/* zoomed out (about 3400 x 1900 world units on screen) */
LM.autoZoom = false; LM.zoomValue = 0.5; LM.scale = 1; ctx.multiboxPlayerEnabled = 0;

/* 3..6 players */
const visible = (f, all) => {
    const scale = R.getTargetScale(f.size, true) * f.zoom, hw = R.canvasWidth / 2 / scale, hh = R.canvasHeight / 2 / scale;
    return all.every((c) => c.x - c.size >= f.x - hw && c.x + c.size <= f.x + hw && c.y - c.size >= f.y - hh && c.y + c.size <= f.y + hh);
};
const cluster = (n, spread) => {
    const groups = Array.from({ length: n }, (_, i) => blob(Math.cos(i * 1.3) * spread, Math.sin(i * 1.3) * spread * 0.5, 1 + (i % 3), 120));
    setMain(groups[0], groups[0][0].x, groups[0][0].y);
    ctx.spects.length = 0;
    /* sparse unit numbers, not in spects order: the slot order is by number */
    [5, 2, 18, 9, 3].slice(0, n - 1).forEach((num, i) => ctx.spects.push(mkUnit(num, groups[i + 1])));
    return groups;
};
S.middleMultiView = true; S.middleMultiViewWhenClose = false;
{
    let fits = true;
    for (let n = 3; n <= 6; n++) {
        const g = cluster(n, 700), f = R.getMultiboxFrame(sizeOf(LM.playerCells));
        fits = fits && !!f && f.both === 1 && f.zoom > NEAR && visible(f, [].concat(...g));
    }
    check('3..6 players close together, "View on middle of both": every player is on screen', fits);
    const g = cluster(6, 700), f = R.getMultiboxFrame(sizeOf(LM.playerCells)), all = [].concat(...g);
    const x0 = Math.min(...all.map((c) => c.x - c.size)), x1 = Math.max(...all.map((c) => c.x + c.size));
    const y0 = Math.min(...all.map((c) => c.y - c.size)), y1 = Math.max(...all.map((c) => c.y + c.size));
    check('6 players: centred on the box around all their cells (radius included)', near(f.x, (x0 + x1) / 2, 1e-6) && near(f.y, (y0 + y1) / 2, 1e-6));
    const far = cluster(6, 9000), ff = R.getMultiboxFrame(sizeOf(LM.playerCells));
    check('6 players far apart: the zoom still stops at 80 % of the normal zoom', ff.zoom === NEAR && !visible(ff, [].concat(...far)));
}
{
    /* main + P2 close, P3 far */
    const m = blob(0, 0, 2, 150), u2 = blob(600, 0, 2, 150), u3 = blob(20000, 0, 1, 150);
    setMain(m, m[0].x, m[0].y);
    ctx.spects.length = 0; ctx.spects.push(mkUnit(3, u3), mkUnit(2, u2));
    S.middleMultiView = false; S.middleMultiViewWhenClose = true;
    const f3 = Object.assign({}, R.getMultiboxFrame(sizeOf(m)));
    ctx.spects.length = 0; ctx.spects.push(mkUnit(2, u2));
    const f2 = Object.assign({}, R0.getMultiboxFrame(sizeOf(m)));
    check('"when close": a far third player is left out, the close two are framed exactly as before', same(f2, f3) && f3.both > 0.99);
    ctx.spects.length = 0; ctx.spects.push(mkUnit(3, u3), mkUnit(2, u2));
    S.middleMultiView = false; S.middleMultiViewWhenClose = false;
    const off = R.getMultiboxFrame(sizeOf(m));
    check('neither view: only the player you control (main)', off.x === LM.viewXTrue && off.y === LM.viewYTrue && off.zoom === 1 && off.both === 0);
    ctx.multiboxPlayerEnabled = 3;
    const off3 = R.getMultiboxFrame(sizeOf(m)), u3s = ctx.spects[0];
    check('neither view, P3 controlled: on P3 with its size', off3.x === u3s.playerX && off3.y === u3s.playerY && off3.size === u3s.playerSize && off3.zoom === 1);
    S.middleMultiView = true;
    const on = R.getMultiboxFrame(sizeOf(m));
    check('"View on middle of both": all three, zoomed out at most to 80 %', on.both === 1 && on.zoom === NEAR && on.x > 5000);
    ctx.multiboxPlayerEnabled = 0;
}
{
    /* main dead: every living unit is framed, not only one */
    const g = cluster(4, 600);
    setMain([], NaN, NaN);
    ctx.multiboxPlayerEnabled = 9;
    S.middleMultiView = true;
    const f = R.getMultiboxFrame(32);
    check('main dead: the living units are all framed', !!f && f.both === 1 && visible(f, [].concat(g[1], g[2], g[3])));
    S.middleMultiView = false; S.middleMultiViewWhenClose = false;
    const f1 = R.getMultiboxFrame(32), p2 = ctx.spects[1];
    check('main dead, the focused unit has no place: on the first placed unit in slot order (number 2)', p2.number === 2 && f1.x === p2.playerX && f1.size === p2.playerSize);
    ctx.multiboxPlayerEnabled = 0;
}
{
    /* passive spectators and units without a place never take part */
    const m = blob(0, 0, 1, 100), u2 = blob(800, 0, 1, 100), spec = blob(-900, -400, 3, 100), unready = blob(0, 900, 1, 100);
    setMain(m, m[0].x, m[0].y);
    ctx.spects.length = 0;
    ctx.spects.push({ number: 1, player: false, active: true, playerCellIDs: [1, 2, 3], playerX: -900, playerY: -400, playerSize: 300, getOwnPlayerCells: () => spec },
        mkUnit(4, unready, { transformReady: () => false }), mkUnit(2, u2));
    S.middleMultiView = true;
    const f = Object.assign({}, R.getMultiboxFrame(sizeOf(m)));
    ctx.spects.length = 0; ctx.spects.push(mkUnit(2, u2));
    const ref = R0.getMultiboxFrame(sizeOf(m));
    check('a Full Map spectator and a unit not placed yet are left out of the frame', same(f, ref));
}
{
    /* no allocation per call: one reused result, and the heap does not grow. Measured in a plain
     * function scope (the globals of a vm context are read through interceptors that allocate) */
    cluster(6, 700);
    S.middleMultiView = false; S.middleMultiViewWhenClose = true;
    const a = R.getMultiboxFrame(32), b = R.getMultiboxFrame(32);
    check('one reused result object', a === b);
    const camBlock = cut('var LM_MB_CAMERA_NEAR = ', '/* OgVer set above');
    const methods = cut('        getTargetScale(size, unitPlaying) {', '        /* fit (0..1)') + cut('        getZoom() {', '        renderFrame() {');
    const frameNow = cut('        getMultiboxFrame(mainSize) {', '        getZoom() {');
    /* the same scene in plain objects of this script (as the page's own objects) */
    const copy = (cells) => cells.map((c) => ({ x: c.x, y: c.y, size: c.size, targetSize: c.targetSize }));
    const pLM = { multiBoxPlayerExists: true, playerCells: copy(LM.playerCells), viewXTrue: LM.viewXTrue, viewYTrue: LM.viewYTrue, play: true, autoZoom: false, zoomValue: LM.zoomValue, scale: 1, serverType: 'agario' };
    const pSpects = ctx.spects.map((u) => mkUnit(u.number, copy(u.getOwnPlayerCells())));
    const plain = (frameSrc) => new Function('window', 'spects', 'defaultmapsettings', 'LM',
        cut('function getActiveSpect(unitNumber) {', '/* The one place') + camBlock + '\nvar R = ({\n' + methods + frameSrc + '\n});\nR.canvasWidth = 1920; R.canvasHeight = 1080; return R;')(
        { legendmod: pLM, multiboxPlayerEnabled: 0 }, pSpects, { middleMultiView: false, middleMultiViewWhenClose: true }, pLM);
    const Rn = plain(frameNow), Ro = plain(OLD_FRAME.slice(OLD_FRAME.indexOf('getMultiboxFrame'), OLD_FRAME.lastIndexOf(' })')));
    check('the plain copy gives the same frame', same(Rn.getMultiboxFrame(32), R.getMultiboxFrame(32)));
    /* a full collection before each measure, so the measured calls fit in the young heap without one */
    require('v8').setFlagsFromString('--expose-gc');
    const gc = vm.runInNewContext('gc');
    const grow = (Rx) => { for (let i = 0; i < 20000; i++) Rx.getMultiboxFrame(32); gc(); const h0 = process.memoryUsage().heapUsed; for (let i = 0; i < 3000; i++) Rx.getMultiboxFrame(32); return process.memoryUsage().heapUsed - h0; };
    let gNew = -Infinity, gOld = Infinity;
    for (let r = 0; r < 3; r++) { gNew = Math.max(gNew, grow(Rn)); gOld = Math.min(gOld, grow(Ro)); }
    /* what may remain is a number V8 boxes on its own (a call it did not inline), never a list or a box */
    check('no list or object per call (3000 calls with 6 players: ' + gNew + ' B, ' + (gNew / 3000).toFixed(1) + ' B a call; the two-player version ' + gOld + ' B)', gNew < 3000 * 40 && gOld > 3000 * 150);
    const body = frameNow.split('\n').filter((ln) => ln.indexOf('this._lmMbCam = {') < 0).join('\n');
    check('the frame builds no candidate list (no concat / new arrays per frame)', !/concat\(|= \[\]|new Array|\.filter\(|\.map\(/.test(body));
}
/* 3..6 players: the same places in other slots give the same frame (bit for bit), the player you
 * control stays on screen, the frame moves smoothly, a stalled unit does not pull it, Rotate Map
 * flips mirror it. Wide and tall screens, manual zoom, Auto zoom, split players (several cells,
 * radius in the box). */
const NUMS = [5, 2, 18, 9, 3];
{
    const screens = [[1920, 1080], [1080, 1920], [2560, 1080], [800, 1280], [1280, 720]];
    const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const STALL = { _lmWorldStamp: () => Date.now() - 5000 }, SHORT = { _lmWorldStamp: () => Date.now() - 500 };
    /* a scene: groups[0] is the main player's (none: dead), the others go to the unit numbers in nums;
     * ctrl = the group you control; stall[k]: group k's unit is stalled (5 s) / short (0.5 s) */
    const place = (groups, nums, ctrl, stall, mainDead) => {
        setMain(mainDead ? [] : groups[0], groups[0][0].x, groups[0][0].y);
        ctx.spects.length = 0;
        for (let k = 1; k < groups.length; k++) ctx.spects.push(mkUnit(nums[k - 1], groups[k], stall[k] === 2 ? STALL : stall[k] === 1 ? SHORT : {}));
        shuffle(ctx.spects);
        ctx.multiboxPlayerEnabled = ctrl === 0 ? 0 : nums[ctrl - 1];
        const f = R.getMultiboxFrame(sizeOf(LM.playerCells));
        return f && Object.assign({}, f);
    };
    let perm = 0, permDiff = 0, blendedP = 0, firstP = '', vis = 0, offN = 0, firstOff = '', fitAll = 0, fitBad = 0;
    for (let k = 0; k < 1500; k++) {
        const n = 3 + (k % 4), spread = [400, 900, 1600, 2600, 4000][Math.floor(rnd() * 5)];
        const groups = Array.from({ length: n }, () => blob((rnd() - 0.5) * spread * 2, (rnd() - 0.5) * spread * 2, 1 + Math.floor(rnd() * 6), 20 + rnd() * 300));
        const mainDead = rnd() < 0.15, ctrl = mainDead ? 1 + Math.floor(rnd() * (n - 1)) : Math.floor(rnd() * n);
        const stall = groups.map((_, i) => (i === 0 ? 0 : rnd() < 0.15 ? 2 : rnd() < 0.15 ? 1 : 0));
        const scr = screens[k % screens.length];
        R.canvasWidth = scr[0]; R.canvasHeight = scr[1];
        LM.autoZoom = rnd() < 0.5; LM.zoomValue = 0.3 + rnd() * 1.2;
        const mode = k % 3;
        S.middleMultiView = mode === 2; S.middleMultiViewWhenClose = mode >= 1;
        const nums = NUMS.slice(0, n - 1);
        const f = place(groups, nums, ctrl, stall, mainDead);
        /* the same groups in other slots: the controlled group keeps the focus */
        for (let r = 0; r < 3; r++) {
            const order = shuffle(nums.slice()), g2 = [groups[0]], st2 = [0], map = {};
            const others = shuffle(groups.slice(1).map((g, i) => i + 1));
            others.forEach((gi, j) => { g2[j + 1] = groups[gi]; st2[j + 1] = stall[gi]; map[gi] = j + 1; });
            const f2 = place(g2, order, ctrl === 0 ? 0 : map[ctrl], st2, mainDead);
            perm++;
            if (!same(f, f2)) { permDiff++; if (!firstP) firstP = k + ': ' + JSON.stringify(f) + ' vs ' + JSON.stringify(f2); }
        }
        if (f && f.both > 0 && f.both < 1) blendedP++;
        /* the controlled player's centre on screen at the frame's zoom (focused view and "when close") */
        place(groups, nums, ctrl, stall, mainDead);
        const scale = R.getTargetScale(f.size, true) * f.zoom, hw = R.canvasWidth / 2 / scale, hh = R.canvasHeight / 2 / scale;
        const cu = ctrl === 0 ? { x: LM.viewXTrue, y: LM.viewYTrue } : ctx.spects.find((u) => u.number === nums[ctrl - 1]);
        if (mode < 2) {
            vis++;
            if (Math.abs(cu.playerX !== undefined ? cu.playerX - f.x : cu.x - f.x) > hw || Math.abs((cu.playerY !== undefined ? cu.playerY : cu.y) - f.y) > hh) {
                offN++; if (!firstOff) firstOff = k + ' mode ' + mode;
            }
        }
        /* every placed, not stalled player at weight 1 ("when close" all close, or "always"): when
         * the box around all of them fits at 80 % or more, every cell of them is on screen */
        if (mode >= 1 && f.both === 1 && f.zoom > NEAR) {
            const cells = [].concat(...groups.filter((g, i) => (i === 0 ? !mainDead : stall[i] !== 2 || i === ctrl)));
            const x0 = Math.min(...cells.map((c) => c.x - c.size)), x1 = Math.max(...cells.map((c) => c.x + c.size));
            const y0 = Math.min(...cells.map((c) => c.y - c.size)), y1 = Math.max(...cells.map((c) => c.y + c.size));
            const allFit = Math.min(R.canvasWidth * 0.9 / (x1 - x0), R.canvasHeight * 0.9 / (y1 - y0)) / R.getTargetScale(f.size, true) >= NEAR;
            if (allFit && mode === 2) { fitAll++; if (!visible(f, cells)) fitBad++; }
        }
    }
    check('3..6 players: the same places in other slots give the same frame, bit for bit (' + perm + ' permutations, ' + blendedP + ' blended scenes)' + (firstP ? ' ' + firstP : ''), permDiff === 0 && blendedP > 50);
    check('3..6 players, focused view and "when close": the controlled player is on screen (' + vis + ' scenes, wide / tall screens, manual / Auto zoom)' + (firstOff ? ' first off: ' + firstOff : ''), offN === 0 && vis > 900);
    check('"View on middle of all players": when all fit within 80 % of the zoom, every cell is on screen (' + fitAll + ' scenes)', fitAll > 50 && fitBad === 0);
    R.canvasWidth = 1920; R.canvasHeight = 1080; LM.autoZoom = false; LM.zoomValue = 0.5;
}
{
    /* the frame moves smoothly: P2 and P3 on both sides of the main player cross the point where
     * they are as far from it (an order by distance would jump there), and drift apart / together */
    S.middleMultiView = false; S.middleMultiViewWhenClose = true; ctx.multiboxPlayerEnabled = 0;
    const m = [{ x: 0, y: 0, size: 80, targetSize: 80 }];
    let maxStep = 0, blendedS = 0, prev = null;
    for (const D of [1600, 2000, 2400]) {
        prev = null;
        for (let t = -300; t <= 300; t += 2) {
            setMain(m, 0, 0);
            ctx.spects.length = 0;
            ctx.spects.push(mkUnit(2, [{ x: D + t, y: 100, size: 90, targetSize: 90 }]), mkUnit(3, [{ x: -(D - t), y: -100, size: 90, targetSize: 90 }]));
            const f = Object.assign({}, R.getMultiboxFrame(80));
            if (f.both > 0 && f.both < 1) blendedS++;
            if (prev) maxStep = Math.max(maxStep, Math.abs(f.x - prev.x) / 2, Math.abs(f.y - prev.y) / 2, Math.abs(f.zoom - prev.zoom) * 1000);
            prev = f;
        }
    }
    check('"when close": no jump when two players cross the same distance (' + blendedS + ' blended, at most ' + maxStep.toFixed(2) + ' per unit moved)', blendedS > 100 && maxStep < 3);
    /* the camera with its glide: units drift apart and together at a combat speed, no back and forth */
    const u2 = [{ x: 600, y: 0, size: 90, targetSize: 90 }], u3 = [{ x: 0, y: 500, size: 90, targetSize: 90 }];
    setMain(m, 0, 0);
    ctx.spects.length = 0;
    const U2 = mkUnit(2, u2, { calculatePlayerMassAndPosition() { } }), U3 = mkUnit(3, u3, { calculatePlayerMassAndPosition() { } });
    ctx.spects.push(U2, U3);
    run(120);
    /* the frame follows the middle while they are close and goes back to the main player as they part
     * (and the other way back): the camera turns only where its target turns, never back and forth */
    const turns = () => ({ n: 0, dir: 0, last: NaN, at: -1, gap: Infinity });
    const turn = (o, v, i) => {
        const d = v - o.last, dir = !(Math.abs(d) > 1e-3) ? o.dir : Math.sign(d);
        if (o.dir && dir !== o.dir) { o.n++; if (o.at >= 0) o.gap = Math.min(o.gap, i - o.at); o.at = i; }
        o.dir = dir; o.last = v;
    };
    const cam = turns(), tgt = turns();
    let worst = 0, lastX = R.camX;
    for (let i = 0; i < 600; i++) {
        const d = 600 + 2400 * (0.5 - 0.5 * Math.cos(i / 600 * 2 * Math.PI));
        u2[0].x = U2.playerX = d; u3[0].y = U3.playerY = d * 0.8;
        frame();
        turn(cam, R.camX, i); turn(tgt, R.getMultiboxFrame(80).x, i);
        worst = Math.max(worst, Math.abs(R.camX - lastX)); lastX = R.camX;
    }
    check('"when close", players drifting apart and back: the camera turns ' + cam.n + ' times as its target (' + tgt.n + '), ' + cam.gap + '+ frames apart, at most ' + worst.toFixed(1) + ' a frame',
        cam.n === tgt.n && cam.n <= 4 && cam.gap >= 30 && worst < 30);
}
{
    /* a stalled unit (no world update for more than 1 s) does not pull the frame; a short gap does */
    const m = blob(0, 0, 2, 150), u2 = blob(700, 0, 2, 150), u3 = blob(-900, 400, 2, 150);
    const STALE = () => Date.now() - 1500, SHORT = () => Date.now() - 600, FRESH = () => Date.now() - 20;
    const scene = (s3, focus, mainDead, s2) => {
        setMain(mainDead ? [] : m, m[0].x, m[0].y);
        ctx.spects.length = 0;
        ctx.spects.push(mkUnit(2, u2, { _lmWorldStamp: s2 || FRESH }), mkUnit(3, u3, { _lmWorldStamp: s3 }));
        ctx.multiboxPlayerEnabled = focus;
        const f = R.getMultiboxFrame(sizeOf(LM.playerCells));
        return f && Object.assign({}, f);
    };
    for (const mode of [1, 2]) {
        S.middleMultiView = mode === 2; S.middleMultiViewWhenClose = true;
        const fresh = scene(FRESH, 0), short = scene(SHORT, 0), stale = scene(STALE, 0);
        setMain(m, m[0].x, m[0].y); ctx.spects.length = 0; ctx.spects.push(mkUnit(2, u2)); ctx.multiboxPlayerEnabled = 0;
        const without = Object.assign({}, R.getMultiboxFrame(sizeOf(m)));
        const ref2 = R0.getMultiboxFrame(sizeOf(m));
        check((mode === 2 ? '"always"' : '"when close"') + ': a unit stalled 1.5 s is left out of the frame (main + P2 as the two-player frame), one 0.6 s late still counts',
            same(stale, without) && same(without, ref2) && same(short, fresh) && !same(fresh, stale));
    }
    S.middleMultiView = false; S.middleMultiViewWhenClose = true;
    const own = scene(STALE, 3), u3s = ctx.spects[1], ownFresh = scene(FRESH, 3);
    check('the stalled unit you control: the camera stays on it (its last place) with the others framed as when it is fresh', !!own && own.size === u3s.playerSize && own.both > 0 && same(own, ownFresh));
    const dead = scene(FRESH, 0, true, STALE), u3d = ctx.spects[1];
    check('main dead, the focus not placed: the camera starts on the first unit that is not stalled (P3, not the stalled P2)', !!dead && dead.size === u3d.playerSize && dead.both === 0);
    const only = scene(STALE, 0, true, STALE), u2o = ctx.spects[0];
    check('main dead, every unit stalled: the camera keeps the first placed one (no jump to the map)', !!only && only.x === u2o.playerX && only.size === u2o.playerSize);
    ctx.multiboxPlayerEnabled = 0;
}
{
    /* Rotate Map flips the world on an axis (the camera works in the flipped frame): the frame of a
     * flipped scene is the flipped frame, every mode, 3..6 players */
    let bad = 0, cases = 0;
    for (let k = 0; k < 300; k++) {
        const n = 3 + (k % 4), groups = Array.from({ length: n }, () => blob((rnd() - 0.5) * 5000, (rnd() - 0.5) * 3000, 1 + Math.floor(rnd() * 4), 200));
        const fx = k % 4 !== 1 ? -1 : 1, fy = k % 4 >= 1 ? -1 : 1, cx = 7071, cy = -3000;
        const flip = (g) => g.map((c) => ({ x: fx < 0 ? 2 * cx - c.x : c.x, y: fy < 0 ? 2 * cy - c.y : c.y, size: c.size, targetSize: c.size }));
        S.middleMultiView = k % 3 === 2; S.middleMultiViewWhenClose = k % 3 >= 1;
        const ctrl = k % n, put = (gs) => {
            setMain(gs[0], gs[0][0].x, gs[0][0].y);
            ctx.spects.length = 0; gs.slice(1).forEach((g, i) => ctx.spects.push(mkUnit(NUMS[i], g)));
            ctx.multiboxPlayerEnabled = ctrl ? NUMS[ctrl - 1] : 0;
            return Object.assign({}, R.getMultiboxFrame(sizeOf(gs[0])));
        };
        const a = put(groups), b = put(groups.map(flip));
        const ex = fx < 0 ? 2 * cx - a.x : a.x, ey = fy < 0 ? 2 * cy - a.y : a.y;
        cases++;
        if (!(near(b.x, ex, 1e-6) && near(b.y, ey, 1e-6) && near(b.zoom, a.zoom, 1e-12) && near(b.both, a.both, 1e-12))) bad++;
    }
    check('Rotate Map: a flipped scene gives the flipped frame (' + cases + ' scenes, x / y / both flips)', bad === 0);
    ctx.multiboxPlayerEnabled = 0;
}
/* a far unit takes the focus with "View on middle of both (when close)": the frame moves to the
 * middle of both players and zooms out. The camera centre glides 2/3 a frame; the zoom glided 10 % a
 * frame zooming out too, so the unit stayed off screen after the centre had arrived. Zooming out to a
 * frame with fit < 1 now goes as fast as the centre; zooming in, and zooming out without such a frame,
 * glide as before; the frame target is unchanged (the two-player reference above). */
{
    const offRun = (mainSize, unitSize, dist, auto, zv) => {
        const mc = [{ x: 0, y: 0, size: mainSize, targetSize: mainSize }], uc = [{ x: dist, y: dist * 0.3, size: unitSize, targetSize: unitSize }];
        setMain(mc, 0, 0);
        ctx.spects.length = 0; LM.multiBoxPlayerExists = true; ctx.multiboxPlayerEnabled = 0;
        S.middleMultiView = false; S.middleMultiViewWhenClose = true; LM.autoZoom = auto; LM.zoomValue = zv;
        run(240);
        ctx.spects.push(mkUnit(2, uc, { calculatePlayerMassAndPosition() { } })); ctx.multiboxPlayerEnabled = 2;
        let off = 0, cur = 0, max = 0;
        for (let i = 0; i < 120; i++) {
            frame();
            const o = Math.abs(uc[0].x - R.camX) > R.canvasWidth / 2 / R.scale || Math.abs(uc[0].y - R.camY) > R.canvasHeight / 2 / R.scale;
            if (o) { off++; cur++; if (cur > max) max = cur; } else cur = 0;
        }
        return { off, max };
    };
    let off = 0, max = 0, cases = 0;
    for (const ms of [32, 60, 120, 250, 500]) for (const us of [32, 60, 130, 250, 500]) for (let d = 600; d <= 4000; d += 200) for (const zv of [0.6, 1, 1.5]) {
        const r = offRun(ms, us, d, true, zv);
        cases++; off += r.off; if (r.max > max) max = r.max;
    }
    /* with the 10 % zoom-out: 13 frames in a row at most, 710 in all (now 7 and 228) */
    check('a far unit taking the focus ("when close", ' + cases + ' cases): off screen at most ' + max + ' frames in a row, ' + off + ' frames in all', max <= 8 && off <= 400);
    /* one frame of setScale (60 fps): the frame's zoom out at 2/3, its zoom in and a zoom out without a frame at 10 % */
    const step = (from, fit) => { R.scale = from; R._lmFrameF = 1; const t = R.getTargetScale(100, true) * (fit > 0 && fit < 1 ? fit : 1); R.setScale(100, fit, true); return (R.scale - from) / (t - from); };
    LM.autoZoom = true; LM.zoomValue = 1;
    check('setScale: zooming out to a multibox frame (fit < 1) goes 2/3 of the way a frame', near(step(3, 0.8), 2 / 3, 1e-9));
    check('setScale: zooming in to it, and zooming out with fit 1 (no frame), glide 10 % a frame as before', near(step(0.1, 0.8), 0.1, 1e-9) && near(step(3, 1), 0.1, 1e-9));
}
ctx.spects.length = 0; LM.multiBoxPlayerExists = false; ctx.multiboxPlayerEnabled = 0;
S.middleMultiView = false; S.middleMultiViewWhenClose = false; LM.zoomValue = 1;
setMain([big].concat(pieces), 0, 0);

/* spectating (not playing): the server's view centre, the option changes nothing */
run(30);
LM.play = false; LM.playerCells = []; LM.viewX = 3000; LM.viewY = -2000;
run(400);
check('spectating: the camera follows the view centre as before', near(R.camX, 3000, 5) && near(R.camY, -2000, 5));

console.log(fail ? 'FAILED ' + fail : 'all ok');
process.exit(fail ? 1 : 0);
