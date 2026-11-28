/* Spawn burst (ogario.v4.js drawRender): startSpawnBurst is the presentation-only primitive (any
 * server, no death screen or game state), triggerSpawnEffect keeps Expanding Land / Legend World's
 * guard and death screen reset around it. Real methods extracted from the source.
 * node developers/tests/spawnburst.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const v4 = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : ' ' + info)); if (!c) fail++; };
function block(head) {
    const i = v4.indexOf(head);
    if (i < 0) return null;
    for (let k = v4.indexOf('{', i + head.length - 1), d = 0; k < v4.length; k++) {
        if (v4[k] === '{') d++;
        else if (v4[k] === '}' && !--d) return v4.slice(i, k + 1);
    }
    return null;
}
const src = ['        _spawnEffect: {', '        triggerSpawnEffect(worldX, worldY, color) {', '        startSpawnBurst(worldX, worldY, color) {', '        drawSpawnEffect(ctx) {'].map(block);
if (src.some(s => !s)) { console.log('FAIL code not found'); process.exit(1); }
let T = 5000;
const ctx = { Date: { now: () => T }, Math, resets: 0 };
ctx.window = ctx;
ctx.LM = { isLegendWorld: false, serverType: 'agario' };
vm.createContext(ctx);
const R = vm.runInContext('({' + src.join(',\n') + ', resetDeathScreen() { window.resets++; } })', ctx);
const draws = [];
const grad = { addColorStop() { } };
const c2d = new Proxy({}, { get: (t, k) => (k in t ? t[k] : () => { draws.push(k); return grad; }), set: (t, k, v) => { t[k] = v; return true; } });
const fx = R._spawnEffect;

/* 1. the old entry point: only on Expanding Land / Legend World */
R.triggerSpawnEffect(10, 20, '#f00');
check('trigger: agar.io does nothing (guard kept)', !fx.active && ctx.resets === 0);
ctx.LM.serverType = 'expandingland';
R.triggerSpawnEffect(10, 20, '#f00');
check('trigger: Expanding Land starts the burst and resets the death screen',
    fx.active && fx.x === 10 && fx.y === 20 && fx.color === '#f00' && fx.startTime === 5000 && ctx.resets === 1 && fx.el === true);
ctx._elDeathVisual = { active: true };
T += 10; R.drawSpawnEffect(c2d);
check('trigger: its first frame ends the Expanding Land death cinematic', ctx._elDeathVisual === null && draws.length > 0);
ctx.LM = { isLegendWorld: true, serverType: 'private' };
fx.active = false;
R.triggerSpawnEffect(1, 2);
check('trigger: Legend World too, default colour', fx.active && fx.color === '#00ccff' && ctx.resets === 2);

/* 2. the primitive: any server, presentation only */
ctx.LM = { isLegendWorld: false, serverType: 'agario' };
fx.active = false;
R.startSpawnBurst(300, -40, '#a12b30');
check('primitive: starts on any server', fx.active && fx.x === 300 && fx.y === -40 && fx.color === '#a12b30' && fx.el === false);
check('primitive: no death screen reset', ctx.resets === 2);
ctx._elDeathVisual = { active: true };
draws.length = 0;
T += 5; R.drawSpawnEffect(c2d);
check('primitive: draws, leaves another state alone (death cinematic kept)', draws.length > 0 && ctx._elDeathVisual && ctx._elDeathVisual.active === true);
T += fx.duration + 1; R.drawSpawnEffect(c2d);
check('primitive: ends after its duration', fx.active === false);

console.log(fail ? fail + ' failed' : 'all spawn burst checks passed');
process.exit(fail ? 1 : 0);
