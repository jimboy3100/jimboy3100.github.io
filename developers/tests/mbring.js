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
    ['getActiveSpect', 'lmMultiboxRingPlayer', 'lmMultiboxControlledPlayer', 'lmMultiboxRing'].map(fn).join('\n'), ctx);
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

console.log(fail ? fail + ' multibox ring check(s) FAILED' : 'all multibox ring checks passed');
process.exit(fail ? 1 : 0);
