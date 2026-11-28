/* Dying Light's threat level, judged by the real compareCells of ogario/ogario.v4.js in its own
 * pass over the cells while LMDyingLight asks for it (lmDlSync, needsThreatData): nothing while
 * nobody asks (no other setting on: the pass does not even run), 2 for a player that can split
 * onto one of the own cells within its split reach, 1 for a bigger one near, 0 far or smaller; no
 * own cell of any unit, hidden copy, food or ejected mass counts; the selected multibox unit's
 * cells are the reference; not playing = not valid. node developers/tests/dlthreat.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, d) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || d === undefined ? '' : ' (' + d + ')')); if (!c) fail++; };
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return src.slice(i, j); };

let T = 1000;
const ctx = vm.createContext({ Math, Number, Infinity,
    defaultmapsettings: { dominationRate: 4 / 3, dominatedRate: 3 / 4 },
    defaultSettings: {} });
ctx.window = ctx;
ctx.performance = { now: () => T };
vm.runInContext(cut('var _lmDl = false, _lmDlApi = null;', '/* The cells that may get the Dying Light skin') +
    cut('function lmUnitCellsInto(', '\n}\n') + '\n}\n' +
    'var _cmp = ({\n' + cut('        compareCells() {', '        setCellOppColor(isPlayer, mass) {') + '});', ctx);
let asked = false;
ctx.LMDyingLight = { isEnabled: () => true, needsThreatData: () => asked };
const units = {};
ctx.getActiveSpect = (n) => units[n] || null;
const L = ctx.legendmod = ctx.LM = Object.assign(ctx._cmp, { play: true, selectBiggestCell: false, camMinX: -1e5, camMinY: -1e5, camMaxX: 1e5, camMaxY: 1e5 });
/* own cell: mass 100 (size 100) at 0,0 */
const own = { x: 0, y: 0, size: 100 };
L.playerCells = [own];
L.playerMinMass = L.playerMaxMass = 100;
const cell = (mass, x, o) => Object.assign({ x, y: 0, size: Math.sqrt(mass * 100), isPlayerCell: false }, o || {});
const snap = () => ctx.lmDlThreat();
const frame = (cells) => { L.cells = cells; ctx.lmDlSync(); L.compareCells(); return snap(); };

/* nobody asks: no pass (no setting is on), no snapshot */
let s = frame([cell(400, 500)]);
check('not asked: no level, not valid, no other work', s.valid === false && s.level === 0 && !L.biggerSTECellsCache);
asked = true;
/* mass 400 = 4x: can split onto the 100 cell; its size 200, reach 200 + 760 from the own edge */
s = frame([cell(400, 100 + 900)]);
check('asked: a split-eater within its reach is level 2', s.valid === true && s.level === 2 && s.unit === 0 && s.t === T, JSON.stringify(s));
s = frame([cell(400, 100 + 1000)]);
check('the same just out of its split reach, within twice it: level 1', s.level === 1, s.level);
s = frame([cell(400, 100 + 2000)]);
check('far away: level 0', s.level === 0 && s.valid, s.level);
/* 16x: double split reach 2 x 400 + 760 */
s = frame([cell(1600, 100 + 1500)]);
check('a double split reach (16x) counts', s.level === 2, s.level);
/* only bigger (1.5x): never split, near = 1 */
s = frame([cell(150, 300)]);
check('bigger but cannot split: near is 1, not 2', s.level === 1, s.level);
s = frame([cell(90, 200), cell(50, 150)]);
check('smaller players: 0', s.level === 0, s.level);
s = frame([cell(400, 500, { isPlayerCell: true }), cell(400, 500, { isPlayerCellMulti: true }), cell(400, 500, { _lmMbPosDup: true }),
    cell(400, 500, { isEjected: true }), cell(400, 500, { isFood: true }), cell(400, 500, { isVirus: true }), cell(400, 500, { invisible: true })]);
check('own cells of any unit, hidden copies, ejected mass, food and viruses: no threat', s.level === 0, s.level);
/* several own cells: the smallest one decides what can eat it */
L.playerCells = [own, { x: 5000, y: 0, size: 50 }];
s = frame([cell(100, 5000 + 50 + 500)]);
check('a split-eater of the small own cell (4x of 25) near it: 2', s.level === 2, s.level);
L.playerCells = [own];
/* the selected multibox unit's cells are the reference, its number in the snapshot */
units[3] = { playerMinMass: 100, playerMaxMass: 100 };
ctx.multiboxPlayerEnabled = 3;
L.playerCellsMulti = [{ x: 10000, y: 0, size: 100, spectator: 3 }];
s = frame([cell(400, 500), cell(400, 10000 + 100 + 500)]);
check('a selected unit: judged by its own cells', s.level === 2 && s.unit === 3, JSON.stringify(s));
s = frame([cell(400, 500)]);
check('...a danger to the main player only is not its threat', s.level === 0 && s.unit === 3, JSON.stringify(s));
ctx.multiboxPlayerEnabled = 0;
L.play = false;
s = frame([cell(400, 500)]);
check('not playing (menu, spectating, dead): not valid', s.valid === false && s.level === 0);
L.play = true;
frame([cell(400, 500)]);
asked = false;
s = frame([cell(400, 500)]);
check('no longer asked: not valid at once', s.valid === false && s.level === 0);

if (fail) { console.log(fail + ' failure(s)'); process.exit(1); }
console.log('all Dying Light threat checks passed');
