/* Settings > Sounds "Sound at 16 pieces" / "back below 16" (x16Sound / non16Sound, off by default)
 * with the real calculatePlayerMassAndPosition of ogario/ogario.v4.js: each plays once when the
 * own cell count crosses 16, and a new life does not count as a merge.
 * node developers/tests/x16sound.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const main = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (info ? '  (' + info + ')' : '')); if (!c) fail++; };

const played = [];
const ctx = { console, Math, Number, Infinity, NaN, isFinite, performance: { now: () => 0 } };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(cut('var LM_MB_CAMERA_NEAR = ', '/* OgVer set above'), ctx);
vm.runInContext('var playersLength = 0, spects = [], defaultmapsettings = { x16Sound: false, non16Sound: false }; function getActiveSpect() { return null; }', ctx);
ctx.LMEvents = { _has: () => false };
ctx.application = { _lmOptSound: (k) => k, playSound: (k) => played.push(k) };
const LM = vm.runInContext('({\n' + cut('        calculatePlayerMassAndPosition() {', '        recalculatePlayerMass() {') + '\n})', ctx);
Object.assign(LM, { recalculatePlayerMass() { }, updateMultiboxUnitPositions() { }, play: true, playerCells: [], serverType: 'agario' });
const cells = (n) => Array.from({ length: n }, (_, i) => ({ id: i + 1, x: i, y: 0, size: 40, targetSize: 40 }));
const frame = (n) => { LM.playerCells = cells(n); LM.calculatePlayerMassAndPosition(); };

[1, 8, 16, 16, 9].forEach(frame);
check('both off: no sound', played.length === 0);
ctx.defaultmapsettings.x16Sound = true; ctx.defaultmapsettings.non16Sound = true;
[1, 8, 16, 16, 15, 15].forEach(frame);
check('on: 16 pieces once on reaching 16, back below 16 once on leaving it', played.join() === 'x16,non16', played.join());
played.length = 0;
[16].forEach(frame);
LM._lmPrevCells = 0; /* death: the core's frame with no own cells */
[4].forEach(frame);
check('a new life after 16 pieces is no merge below 16', played.join() === 'x16', played.join());
const core = cut('LM.calculatePlayerMassAndPosition(); /* includes the units */', 'LM.updateMultiboxUnitPositions();');
check('the core frame with no own cells resets the count', /LM\._lmPrevCells = 0;/.test(core));

console.log(fail ? fail + ' check(s) failed' : 'all 16 pieces sound checks passed');
process.exit(fail ? 1 : 0);
