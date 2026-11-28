/* The multibox ring, with the real code of ogario/ogario.v4.js (lmMultiboxRing with the real
 * lmMultiboxControlledPlayer and getActiveSpect): the ring is only on the cells of the player you
 * control and follows a switch to the unit and back; the WebGL ring pass
 * (buildWebGLMultiboxRingData) takes the same rule; one reused result (no object per cell per
 * frame). node developers/tests/mbring.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
/* a {...} block from its first brace (these functions have no braces in strings) */
function block(at) {
    const i = main.indexOf('{', at);
    for (let j = i, d = 0; j < main.length; j++) {
        if (main[j] === '{') d++;
        else if (main[j] === '}' && --d === 0) return main.slice(at, j + 1);
    }
    throw new Error('unbalanced block');
}
const fn = n => { const i = main.indexOf('\nfunction ' + n + '('); if (i < 0) throw new Error('missing ' + n); return block(i + 1); };
const v = n => { const m = new RegExp('\\nvar ' + n + ' = [^\\n]*').exec(main); if (!m) throw new Error('missing ' + n); return m[0].slice(1); };

const ctx = { window: { legendmod: { multiBoxPlayerExists: true }, multiboxPlayerEnabled: null }, spects: [{ number: 1 }] };
vm.createContext(ctx);
vm.runInContext(['LM_MB_RING_MIN_SCREEN_PX', 'LM_MB_RING_DEFAULT_COLORS', 'LM_MB_RING_SIZE', '_lmMbRingOut'].map(v).join('\n') + '\n' +
    ['getActiveSpect', 'lmMbSlotOf', 'lmMultiboxRingPlayer', 'lmMultiboxControlledPlayer', 'lmMultiboxRing'].map(fn).join('\n'), ctx);
const ring = c => ctx.lmMultiboxRing(c, c.size, 1);

const main1 = { isPlayerCell: true, size: 100 }, main2 = { isPlayerCell: true, size: 50 };
const unit1 = { spectator: 1, isPlayerCellMulti: true, size: 100 }, unit2 = { spectator: 1, isPlayerCellMulti: true, size: 40 };
const enemy = { size: 100 }, seenByUnit = { spectator: 1, size: 100 };
const all = [main1, main2, unit1, unit2, enemy, seenByUnit];
const ringed = () => all.filter(c => ring(c)).map(c => all.indexOf(c)).join();

check('main player controlled: the ring only on its own cells', ringed() === '0,1');
check('  pink, 6% of the radius', ring(main1).color === '#FF2FD6' && ring(main1).width === 6);
ctx.window.multiboxPlayerEnabled = 1;
check('switch to the unit: the ring only on the unit cells', ringed() === '2,3');
check('  cyan', ring(unit1).color === '#00E5FF');
ctx.window.multiboxPlayerEnabled = null;
check('switch back: the ring back on the main player only', ringed() === '0,1');
ctx.window.multiboxPlayerEnabled = 1; ctx.spects.length = 0;
check('the unit is gone: the main player has it', ringed() === '0,1');
ctx.spects.push({ number: 1 }); ctx.window.multiboxPlayerEnabled = null;
check('one reused result object (nothing allocated per cell per frame)', ring(main1) === ring(main2));
check('never thinner than 2 px on screen', ctx.lmMultiboxRing({ isPlayerCell: true }, 10, 0.5).width === 4);
ctx.window.legendmod.multiBoxPlayerExists = false;
check('not multiboxing: no ring', ringed() === '');
ctx.window.legendmod.multiBoxPlayerExists = true;

/* more players: each unit's own cells carry their owner (cell._lmOwner, spect.js _lmAdoptOwn) and so
 * its slot; the ring is only on the controlled unit's cells, in its slot colour */
{
    const u3 = { number: 18, player: true, slotId: 3 }, u4 = { number: 5, player: true, slotId: 4 }, u2 = { number: 1, player: true, slotId: 2 };
    ctx.spects.length = 0; ctx.spects.push(u2, u3, u4);
    const c2 = { spectator: 1, isPlayerCellMulti: true, size: 80, _lmOwner: u2 }, c3 = { spectator: 18, isPlayerCellMulti: true, size: 80, _lmOwner: u3 },
        c4 = { spectator: 5, isPlayerCellMulti: true, size: 80, _lmOwner: u4 };
    const set = [main1, c2, c3, c4];
    const on = () => set.filter(c => ring(c)).map(c => set.indexOf(c)).join();
    check('four players: the cells say their slot (1, 2, 3, 4)', set.map(c => ctx.lmMultiboxRingPlayer(c)).join() === '1,2,3,4');
    ctx.window.multiboxPlayerEnabled = 18;
    check('P3 controlled: the ring only on P3, in its colour (violet)', on() === '2' && ring(c3).color === '#A855F7' && ctx.lmMultiboxControlledPlayer() === 3);
    ctx.window.multiboxPlayerEnabled = 5;
    check('P4 controlled: the ring only on P4 (green)', on() === '3' && ring(c4).color === '#10B981');
    ctx.window.multiboxPlayerEnabled = 1;
    check('P2 controlled: the ring only on P2, cyan as before', on() === '1' && ring(c2).color === '#00E5FF');
    check('one palette for six players', ['#FF2FD6', '#00E5FF', '#A855F7', '#10B981', '#FFB020', '#FF5A36'].every((c, i) => vm.runInContext('LM_MB_RING_DEFAULT_COLORS', ctx)[i + 1] === c));
    ctx.window.multiboxPlayerEnabled = null;
    ctx.spects.length = 0; ctx.spects.push({ number: 1 });
}

/* the WebGL pass: the real buildWebGLMultiboxRingData over both own-cell lists */
const mI = main.indexOf('        buildWebGLMultiboxRingData(lists, data, max) {');
check('WebGL ring pass found', mI > 0);
const R = vm.runInContext('({' + block(mI).trim() + ',\n _lmLabelsOnFg() { return false; },' +
    ' getLegendWorldAttachedRenderPoint(x, y) { return { x: x, y: y }; },' +
    ' parseWebGLOverlayColor(c) { return c === "#FF2FD6" ? [1, 0, 1, 1] : [0, 1, 1, 1]; }, scale: 1 })', ctx);
all.forEach(c => { c._webglRendered = true; });
const data = new Float32Array(9 * 8), lists = [[main1, main2, enemy], [unit1, unit2, seenByUnit]];
check('WebGL, main player controlled: its two cells, pink', R.buildWebGLMultiboxRingData(lists, data, 8) === 2 && data[2] === 100 && data[11] === 50 && data[4] === 1 && data[5] === 0);
ctx.window.multiboxPlayerEnabled = 1;
check('WebGL, after the switch: the two unit cells, cyan', R.buildWebGLMultiboxRingData(lists, data, 8) === 2 && data[2] === 100 && data[11] === 40 && data[4] === 0 && data[5] === 1);
/* three units (P2, P3, P4, their cells together in LM.playerCellsMulti as drawWebGLMultiboxRings
 * passes it): the ring only on the controlled unit's cells; the main player's when it is controlled */
{
    const u2 = { number: 1, player: true, slotId: 2 }, u3 = { number: 18, player: true, slotId: 3 }, u4 = { number: 5, player: true, slotId: 4 };
    ctx.spects.length = 0; ctx.spects.push(u2, u3, u4);
    const mk = (u, size) => ({ spectator: u.number, isPlayerCellMulti: true, size, _lmOwner: u, _webglRendered: true });
    const multi = [mk(u2, 80), mk(u3, 70), mk(u3, 65), mk(u4, 60)];
    const L3 = [[main1, main2], multi], radii = (k) => Array.from({ length: k }, (_, i) => data[i * 9 + 2]).join();
    let k;
    ctx.window.multiboxPlayerEnabled = 18;
    k = R.buildWebGLMultiboxRingData(L3, data, 8);
    check('WebGL, three units, P3 controlled: only P3\'s two cells', k === 2 && radii(k) === '70,65');
    ctx.window.multiboxPlayerEnabled = 5;
    k = R.buildWebGLMultiboxRingData(L3, data, 8);
    check('WebGL, three units, P4 controlled: only P4\'s cell', k === 1 && radii(k) === '60');
    ctx.window.multiboxPlayerEnabled = 1;
    k = R.buildWebGLMultiboxRingData(L3, data, 8);
    check('WebGL, three units, P2 controlled: only P2\'s cell (not every unit cell)', k === 1 && radii(k) === '80');
    ctx.window.multiboxPlayerEnabled = null;
    k = R.buildWebGLMultiboxRingData(L3, data, 8);
    check('WebGL, three units, the main player controlled: its two cells, no unit cell', k === 2 && radii(k) === '100,50');
    check('Canvas and WebGL agree for three units', [18, 5, 1, null].every((n) => {
        ctx.window.multiboxPlayerEnabled = n;
        const cv = [main1, main2].concat(multi).filter((c) => ring(c)).map((c) => c.size).join();
        return cv === radii(R.buildWebGLMultiboxRingData(L3, data, 8));
    }));
    ctx.window.multiboxPlayerEnabled = null;
    ctx.spects.length = 0; ctx.spects.push({ number: 1 });
}

console.log(fail ? fail + ' multibox ring check(s) FAILED' : 'all multibox ring checks passed');
process.exit(fail ? 1 : 0);
