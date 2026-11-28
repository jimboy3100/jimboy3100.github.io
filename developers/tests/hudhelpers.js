/* HUD helpers checks: the pure parts of ogario/modules/hudhelpers.js (direction smoothing, ratio and
 * mass formatting, merge timing for the merge sound, edge arrows), the movement and edge arrows
 * drawn, and the mass text it gives the game.
 * node developers/tests/hudhelpers.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'hudhelpers.js'), 'utf8');
let nowT = 0;
const store = {};
const toasts = [];
const ctx = {
    console, Math, Number, JSON, Map, Array, String, Date, isFinite,
    performance: { now: () => nowT },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
    document: { body: null, getElementById: () => null, createElement: () => ({ style: {} }) },
    toastr: { info: m => toasts.push(m) }
};
ctx.window = ctx;
ctx.legendmod5 = { massFormat: 0, shortMass: false, hudRelativeMass: false };
vm.createContext(ctx);
i18n(ctx);
vm.runInContext(src, ctx);
vm.runInContext(src, ctx); /* loading twice must keep the first copy */
const H = ctx.LMHudHelpers, P = H._pure;
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const near = (a, b, e) => Math.abs(a - b) <= (e || 1e-6);

// direction smoothing
{
    const st = { has: false };
    P.updateDirection(st, 0, 0, 1, 0, 150);
    check('direction: first sample has no speed', st.has && st.vx === 0 && st.vy === 0);
    for (let t = 16; t <= 1600; t += 16) P.updateDirection(st, t * 0.5, 0, 1, t, 150); /* 500 units/s to the right */
    check('direction: steady movement converges to its speed', near(st.vx, 500, 5) && near(st.vy, 0, 1e-9));
    const before = st.vx;
    P.updateDirection(st, st.x + 3000, 0, 2, 1616, 150); /* split: centre jumps, count changes */
    check('direction: count change re-anchors without a speed spike', st.vx === before && st.x > 3000);
    P.updateDirection(st, st.x + 10, 0, 2, 2400, 150); /* 784 ms gap */
    check('direction: long gap starts over', st.vx === 0 && st.vy === 0);
    P.updateDirection(st, st.x, st.y + 5000, 2, 2416, 150);
    check('direction: teleport starts over', st.vx === 0 && st.vy === 0);
    const st2 = { has: false };
    P.updateDirection(st2, 0, 0, 1, 0, 150);
    P.updateDirection(st2, 0, -8, 1, 16, 150);
    check('direction: one step moves only part of the way (smoothed)', st2.vy < 0 && st2.vy > -500);
    P.updateDirection(st2, NaN, 0, 1, 32, 150);
    check('direction: NaN position ignored', Number.isFinite(st2.vx) && Number.isFinite(st2.vy));
}

// edge arrows
{
    const out = {};
    P.edgePoint(500, 400, 3000, 400, 1000, 800, 20, out);
    check('edge: right', near(out.x, 980) && near(out.y, 400) && near(out.a, 0));
    P.edgePoint(500, 400, 500, -5000, 1000, 800, 20, out);
    check('edge: top', near(out.x, 500) && near(out.y, 20));
    P.edgePoint(500, 400, -1000, 1900, 1000, 800, 20, out);
    check('edge: corner direction stays inside', out.x >= 20 - 1e-9 && out.y <= 780 + 1e-9 && near(out.y - 400, -(out.x - 500)));
}

// ratio text
check('ratio 1.75x', P.ratioText(1.75) === '1.75x');
check('ratio 0.40x', P.ratioText(0.4) === '0.40x');
check('ratio = near 1', P.ratioText(1) === '=' && P.ratioText(0.96) === '=' && P.ratioText(1.04) === '=');
check('ratio just outside = band', P.ratioText(1.06) === '1.06x' && P.ratioText(0.94) === '0.94x');
check('ratio 12x whole above 10', P.ratioText(12.4) === '12x' && P.ratioText(9.99) === '9.99x');
check('ratio tiny', P.ratioText(0.004) === '0.00x' || P.ratioText(0.004) === '0.00x');
check('ratio invalid is empty', P.ratioText(0) === '' && P.ratioText(-1) === '' && P.ratioText(NaN) === '' && P.ratioText(Infinity) === '');
check('ratio strings cached (same object)', P.ratioText(1.75) === P.ratioText(1.7501));

// mass format
check('mass mode 0 follows Short mass off', P.formatMass(12345, 0, false) === '12345');
check('mass mode 0 follows Short mass on', P.formatMass(12345, 0, true) === '12.3k' && P.formatMass(999, 0, true) === '999');
check('mass exact', P.formatMass(123456, 1, true) === '123456');
check('mass 12.3k', P.formatMass(12345, 2, false) === '12.3k' && P.formatMass(1000, 2) === '1k' && P.formatMass(950, 2) === '950');
check('mass auto: exact below 10000', P.formatMass(9999, 3) === '9999');
check('mass auto: 12.3k', P.formatMass(12345, 3) === '12.3k');
check('mass auto: 123k', P.formatMass(123456, 3) === '123k');
check('mass auto: 1.2M', P.formatMass(1234567, 3) === '1.2M');
check('mass bad values', P.formatMass(-5, 1) === '0' && P.formatMass(NaN, 3) === '0' && P.formatMass(12.9, 1) === '12');

// merge timing (the merge sound); the merge countdown in seconds is removed
check('merge duration (mergetimer.js formula)', near(P.mergeDuration(300), 37) && near(P.mergeDuration(0), 29));
check('the merge countdown in seconds is gone', !('countdownText' in P) && !('mergeLeft' in H));
{
    const owner = { prevCount: 0, beep: false };
    const big = { size: 200, targetSize: 200 }; /* mass 400 */
    let r = P.trackMerge(owner, [big], 1, 0);
    check('merge: one cell has nothing to merge', big._lmHHEnd === 0 && r === 0);
    big.targetSize = big.size = Math.sqrt(20000); /* split: 200 mass each */
    const piece = { size: big.size, targetSize: big.size };
    r = P.trackMerge(owner, [big, piece], 2, 1000);
    const d = P.mergeDuration(200);
    check('merge: split arms both pieces', near(big._lmHHEnd, 1000 + d * 1000) && near(piece._lmHHEnd, 1000 + d * 1000) && owner.beep);
    r = P.trackMerge(owner, [big, piece], 2, 1000 + d * 500);
    check('merge: half way, not ready', r === 0 && near((big._lmHHEnd - (1000 + d * 500)) / 1000, d / 2));
    r = P.trackMerge(owner, [big, piece], 2, 1000 + d * 1000 + 1);
    check('merge: after the time both are ready', r === 2);
    /* option turned on mid-game: pieces without a seen split are unknown */
    const o2 = { prevCount: 0, beep: false };
    const a = { size: 100 }, b = { size: 100 };
    P.trackMerge(o2, [a, b], 2, 0);
    check('merge: pieces from before are unknown', a._lmHHEnd === -1 && b._lmHHEnd === -1 && !o2.beep);
    /* re-split of a counting piece re-arms it */
    const c3 = { size: 100 };
    P.trackMerge(o2, [a, b], 2, 10);
    a.size = Math.sqrt(5000);
    const a2 = { size: a.size };
    P.trackMerge(o2, [a, b, a2], 3, 20000);
    check('merge: re-split re-arms the split piece and the new one, not the others', a._lmHHEnd > 20000 && a2._lmHHEnd > 20000 && b._lmHHEnd === -1);
    void c3;
}

// mass text as the game asks for it
{
    ctx.legendmod5.massFormat = 3;
    check('massText: format applies to own cells', H.massText(12345, { isPlayerCell: true }) === '12.3k');
    ctx.legendmod5.hudRelativeMass = true;
    /* no reference (not playing): plain mass */
    check('massText: no own cell, absolute mass', H.massText(700, { isPlayerCell: false }) === '700');
    /* play: biggest own cell mass 400 */
    ctx.legendmod5.massFormat = 0;
    const LM = { play: true, playerCells: [{ x: 0, y: 0, size: 200, targetSize: 200, isPlayerCell: true }], playerCellsMulti: [] };
    H.frame({ scale: 1, camX: 0, camY: 0, canvasWidth: 100, canvasHeight: 100 }, null, LM);
    check('massText: enemy as ratio', H.massText(700, { isPlayerCell: false }) === '1.75x' && H.massText(160, {}) === '0.40x' && H.massText(400, {}) === '=');
    check('massText: own and multibox cells stay absolute', H.massText(700, { isPlayerCell: true }) === '700' && H.massText(700, { isPlayerCellMulti: true }) === '700');
    check('massText: viruses and food stay absolute', H.massText(100, { isVirus: true }) === '100' && H.massText(100, { isFood: true }) === '100');
    ctx.legendmod5.hudRelativeMass = false;
    check('massText: off, as before', H.massText(700, {}) === '700');
}

// precision zoom (the zoom bookmarks / saved zoom levels and camera lock were removed)
{
    ctx.legendmod = { zoomValue: 0.25, play: false, playerCellsMulti: [] };
    check('the saved zoom levels are gone', !('zoomSave' in H) && !('zoomRecall' in H));
    H.precisionZoom(true); H.precisionZoom(true); /* key repeat must not stack */
    check('precision zoom zooms in once', near(ctx.legendmod.zoomValue, 0.625));
    H.precisionZoom(false);
    check('precision zoom release restores', ctx.legendmod.zoomValue === 0.25);
    check('camera lock is gone', !('toggleCamLock' in H) && !('camLockTarget' in H) && !('camLocked' in H));
}

// precision zoom while it is held (audit A6)
{
    ctx.legendmod = { zoomValue: 1, play: true, socket: { id: 1 }, playerCellsMulti: [] };
    H.precisionZoom(true);
    check('precision: held zoom 2.5x', near(ctx.legendmod.zoomValue, 2.5));
    H.precisionZoom(false);
    check('precision: release goes back (1)', near(ctx.legendmod.zoomValue, 1));
    ctx.legendmod.zoomValue = 1;
    H.precisionZoom(true);
    ctx.legendmod.zoomValue = 5; /* wheel while held: returns to 2 */
    H.precisionZoom(false);
    check('precision: wheel change kept on release', near(ctx.legendmod.zoomValue, 2));
    ctx.legendmod.zoomValue = 30;
    H.precisionZoom(true);
    ctx.legendmod.zoomValue = 1e6; /* a broken value while held */
    H.precisionZoom(false);
    check('precision: release clamped to the zoom range', ctx.legendmod.zoomValue <= 40 && ctx.legendmod.zoomValue >= 0.01);
    ctx.legendmod.zoomValue = 1;
    H.precisionZoom(true);
    /* the connection changes while the key is held: the zoom goes back at once */
    ctx.legendmod.socket = { id: 2 };
    H.frame({}, null, ctx.legendmod);
    check('precision: released on a socket change', near(ctx.legendmod.zoomValue, 1));
    ctx.legendmod.zoomValue = 1.5;
    H.precisionZoom(false); /* the key comes up later: nothing more */
    check('precision: the late key up changes nothing', ctx.legendmod.zoomValue === 1.5);
    H.precisionZoom(true);
    ctx.multiboxPlayerEnabled = 2;
    H.frame({}, null, ctx.legendmod);
    check('precision: released on a multibox unit switch', near(ctx.legendmod.zoomValue, 1.5));
    ctx.multiboxPlayerEnabled = null;
}

// the reference unit is the one you control, as compareCells uses it (audit A15)
{
    const s = ctx.legendmod5;
    s.hudRelativeMass = true; s.massFormat = 0;
    const unit = { number: 2, playerMaxMass: 100 };
    ctx.getActiveSpect = n => (n === 2 ? unit : null);
    /* main: one 1000-mass cell, unit 2 (controlled): one 100-mass cell */
    const LM = {
        play: true, playerCells: [{ x: 0, y: 0, size: Math.sqrt(100000), isPlayerCell: true }],
        playerCellsMulti: [{ x: 50, y: 0, size: 100, spectator: 2, isPlayerCellMulti: true }]
    };
    ctx.multiboxPlayerEnabled = 2;
    H.frame({ scale: 1, camX: 0, camY: 0, canvasWidth: 100, canvasHeight: 100 }, null, LM);
    check('A15: relative mass against the controlled unit (200 vs 100 = 2.00x)', H.massText(200, {}) === '2.00x');
    check('A15: reference unit reported', typeof H.refUnit === 'function' && H.refUnit() === 2);
    ctx.multiboxPlayerEnabled = null;
    H.frame({ scale: 1, camX: 0, camY: 0, canvasWidth: 100, canvasHeight: 100 }, null, LM);
    check('A15: main player again without a focused unit (200 vs 1000)', H.massText(200, {}) === '0.20x' && typeof H.refUnit === 'function' && H.refUnit() === 0);
    /* the focused unit has no cells (just died): the main player */
    ctx.multiboxPlayerEnabled = 2;
    LM.playerCellsMulti = [];
    H.frame({ scale: 1, camX: 0, camY: 0, canvasWidth: 100, canvasHeight: 100 }, null, LM);
    check('A15: focused unit without cells -> main player', H.massText(200, {}) === '0.20x');
    ctx.multiboxPlayerEnabled = null;
    delete ctx.getActiveSpect;
    s.hudRelativeMass = false;
}

// merge sound without the removed countdown: a saved hudMergeCountdown draws nothing, the sound still plays
{
    const s = ctx.legendmod5;
    s.hudMergeSound = true; s.hudMergeCountdown = true;
    const sounds = [];
    ctx.application = { _lmOptSound: k => k, playSound: k => sounds.push(k) };
    let drawn = 0;
    const g = new Proxy({}, { get(t, k) { drawn++; return () => {}; }, set() { drawn++; return true; } });
    const cell = { x: 0, y: 0, size: 200, targetSize: 200, isPlayerCell: true, isInView: () => true };
    const LM = { play: true, integrity: true, isLegendWorld: false, playerCells: [cell], playerCellsMulti: [] };
    const R = { scale: 1, getLegendWorldAttachedRenderPoint: (x, y, o) => { o.x = x; o.y = y; return o; } };
    nowT = 100000;
    H.frame(R, g, LM);
    cell.size = cell.targetSize = Math.sqrt(20000);
    LM.playerCells = [cell, { x: 50, y: 0, size: cell.size, targetSize: cell.size, isPlayerCell: true, isInView: () => true }];
    nowT += 16; H.frame(R, g, LM);
    nowT += 5000; H.frame(R, g, LM);
    check('merge sound: not before the merge time', sounds.length === 0);
    nowT += P.mergeDuration(200) * 1000; H.frame(R, g, LM);
    check('merge sound: plays once the cells can merge', sounds.length === 1 && sounds[0] === 'mergeReady');
    check('merge sound: no seconds drawn on the cells (old hudMergeCountdown value ignored)', drawn === 0);
    s.hudMergeSound = false; delete s.hudMergeCountdown; delete ctx.application;
    nowT = 0;
}

// the movement arrow on the world context, the edge arrows on their own canvas
{
    const s = ctx.legendmod5;
    const ops = [];
    const g = { save() {}, restore() {}, beginPath() {}, closePath() {}, moveTo(x, y) { ops.push(['m', x, y]); }, lineTo(x, y) { ops.push(['l', x, y]); },
        stroke() { ops.push(['s']); }, fill() { ops.push(['f']); }, translate() {}, rotate(a) { ops.push(['r', a]); }, setTransform() {}, clearRect() {},
        strokeText() {}, fillText(t) { ops.push(['t', t]); } };
    const edgeCv = { style: {}, width: 0, height: 0, getContext: () => g };
    let made = 0;
    ctx.document = { body: { appendChild() {} }, getElementById: () => null, createElement: () => { made++; return edgeCv; } };
    const R = { scale: 1, camX: 0, camY: 0, canvasWidth: 1000, canvasHeight: 800, dpr: 1, canvas: { parentNode: { appendChild() {} } } };
    const LM = { play: true, playerCells: [{ x: 0, y: 0, size: 100 }], playerCellsMulti: [], cells: [], mapOffsetX: 0, mapOffsetY: 0 };
    s.hudMoveDir = true;
    check('movement arrow: the overlay canvas is asked for while playing (worldActive)', H.worldActive(LM) === true && H.worldActive({ play: false, playerCellsMulti: [] }) === false);
    for (let i = 0; i <= 30; i++) { nowT = 1000 + i * 16; LM.playerCells[0].x = i * 16; H.frame(R, g, LM); } /* 1000 units/s to the right */
    const strokes = ops.filter(o => o[0] === 's').length, last = ops.filter(o => o[0] === 'm').pop();
    check('movement arrow: drawn from the cells\' centre toward the movement', strokes > 0 && !!last && last[1] > LM.playerCells[0].x + 100 && Math.abs(last[2]) < 1e-6);
    ops.length = 0; s.hudMoveDir = false;
    s.hudEdgeThreats = true;
    LM.cells = [{ id: 7, x: 3000, y: 0, size: 200, nick: 'Big' }];
    H.frame(R, g, LM);
    check('threat arrow: a big cell off the screen gets an arrow on the edge canvas', made === 1 && edgeCv.style.display === 'block' && ops.some(o => o[0] === 'f') && ops.some(o => o[0] === 't' && o[1] === '4.00x'));
    s.hudEdgeThreats = false;
    H.frame(R, g, LM);
    check('edge arrows off: the canvas is hidden and its memory freed', edgeCv.style.display === 'none' && edgeCv.width === 0);
    ctx.document = { body: null, getElementById: () => null, createElement: () => ({ style: {} }) };
    nowT = 0;
}

// all off: frame does nothing
{
    const s = ctx.legendmod5;
    Object.keys(s).forEach(k => { if (typeof s[k] === 'boolean') s[k] = false; });
    s.massFormat = 0;
    /* a saved value of the removed cell panel (an older script may still set it) does nothing */
    s.hudCellPanel = true;
    let touched = false;
    const LM = new Proxy({}, { get() { touched = true; return undefined; } });
    H.frame({}, null, LM);
    check('all options off (removed cell panel set): frame reads no game state', !touched);
}

console.log(fail ? fail + ' failed' : 'all HUD helper checks passed');
process.exit(fail ? 1 : 0);
