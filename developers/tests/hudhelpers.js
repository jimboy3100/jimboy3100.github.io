/* HUD helpers checks: the pure parts of ogario/modules/hudhelpers.js (direction smoothing, ratio and
 * mass formatting, merge countdown, edge arrows) and the mass text / camera lock it gives the game.
 * node developers/tests/hudhelpers.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'hudhelpers.js'), 'utf8');
const store = {};
const ctx = {
    console, Math, Number, JSON, Map, Array, String, Date, isFinite,
    performance: { now: () => 0 },
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
    document: { body: null, getElementById: () => null, createElement: () => ({ style: {} }) }
};
ctx.window = ctx;
ctx.legendmod5 = { massFormat: 0, shortMass: false, hudRelativeMass: false };
vm.createContext(ctx);
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

// merge countdown
check('merge duration (mergetimer.js formula)', near(P.mergeDuration(300), 37) && near(P.mergeDuration(0), 29));
check('countdown text', P.countdownText(12.2) === '13' && P.countdownText(0.01) === '1' && P.countdownText(0) === '' && P.countdownText(-1) === '' && P.countdownText(5000) === '999');
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

// zoom bookmarks, precision zoom, camera lock
{
    ctx.legendmod = { zoomValue: 0.5, play: false, playerCellsMulti: [] };
    H.zoomSave(2);
    ctx.legendmod.zoomValue = 1;
    H.zoomRecall(2);
    check('zoom bookmark saved and recalled', ctx.legendmod.zoomValue === 0.5);
    store['lm-zoom-bookmarks'] = '[1e9, "x", 0.25]';
    H.zoomRecall(1);
    check('zoom bookmark: bad stored value ignored', ctx.legendmod.zoomValue === 0.5);
    H.zoomRecall(3);
    check('zoom bookmark: valid stored value used', ctx.legendmod.zoomValue === 0.25);
    store['lm-zoom-bookmarks'] = '{not json';
    H.zoomRecall(3);
    check('zoom bookmark: broken storage ignored', ctx.legendmod.zoomValue === 0.25);
    H.precisionZoom(true); H.precisionZoom(true); /* key repeat must not stack */
    check('precision zoom zooms in once', near(ctx.legendmod.zoomValue, 0.625));
    H.precisionZoom(false);
    check('precision zoom release restores', ctx.legendmod.zoomValue === 0.25);
    ctx.drawRender = { camX: 100, camY: 200 };
    H.toggleCamLock();
    const pt = {};
    check('camera lock while spectating', H.camLocked && H.camLockTarget(ctx.legendmod, pt) && pt.x === 100 && pt.y === 200);
    ctx.legendmod.play = true;
    check('camera lock ends when you play', !H.camLockTarget(ctx.legendmod, pt) && !H.camLocked);
    H.toggleCamLock();
    check('camera lock refused while playing', !H.camLocked);
}

// all off: frame does nothing
{
    const s = ctx.legendmod5;
    Object.keys(s).forEach(k => { if (typeof s[k] === 'boolean') s[k] = false; });
    s.massFormat = 0;
    let touched = false;
    const LM = new Proxy({}, { get() { touched = true; return undefined; } });
    H.frame({}, null, LM);
    check('all options off: frame reads no game state', !touched);
}

console.log(fail ? fail + ' failed' : 'all HUD helper checks passed');
process.exit(fail ? 1 : 0);
