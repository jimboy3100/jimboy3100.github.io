/* Scan Trick with the real code of ogario/ogario.v4.js: it is only its key (hk-scanTrick), with
 * no settings. While the key is held the aim goes 10,000,000 world units from the cell toward
 * the cursor at the exact angle, snapped to 16 directions while LMB is held too; letting the
 * key go (or the window losing focus) gives the real cursor back at once.
 * node developers/tests/scantrick.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const ctx = { Math, Number, Object, console, defaultmapsettings: {}, window: {} };
vm.createContext(ctx);
const LM = vm.runInContext('({\n' +
  cut('        SCAN_TRICK_DIRECTIONS:', '        getScanTrickDirection() {') +
  cut('        getCursorPosition() {', '        getLineSplitSettings() {') +
  '\n})', ctx);
Object.assign(LM, {
  lineSplitActive: false, scanTrickHeld: false, scanTrickLMB: false, scanTrickActive: false, scanTrickAngle: 0, scanTrickRevision: 0,
  canvasWidth: 1000, canvasHeight: 600, viewScale: 0.5, viewX: 100, viewY: -200,
  play: true, playerCells: [{}], playerX: 150, playerY: -180
});
const at = (cx, cy) => { LM.clientX = cx; LM.clientY = cy; LM.getCursorPosition(); };
const near = (a, b, eps) => Math.abs(a - b) <= (eps || 1e-6);
const D = 10000000;

at(800, 300);
check('key not held: the real cursor', near(LM.cursorX, 300 / 0.5 + 100) && near(LM.cursorY, -200) && !LM.scanTrickActive);

LM.setScanTrickHeld(true);
check('key held: 10,000,000 units from the cell straight toward the cursor (right)', near(LM.cursorX, 150 + D) && near(LM.cursorY, -180) && LM.scanTrickActive && !LM.scanTrickSnapped);
/* screen offset (200, 130) from the centre: about 33.0 degrees, not a multiple of 22.5 */
at(700, 430);
const exact = Math.atan2(130, 200);
check('key held: the exact angle (no snapping without LMB)', near(Math.atan2(LM.cursorY - LM.playerY, LM.cursorX - LM.playerX), exact, 1e-9) &&
  near(Math.hypot(LM.cursorX - LM.playerX, LM.cursorY - LM.playerY), D, 1e-3));
LM.setScanTrickLMB(true);
const step = Math.PI * 2 / 16;
check('key and LMB held: snapped to the nearest of 16 directions (22.5 degrees)', LM.scanTrickSnapped &&
  near(Math.atan2(LM.cursorY - LM.playerY, LM.cursorX - LM.playerX), Math.round(exact / step) * step, 1e-9) &&
  near(Math.hypot(LM.cursorX - LM.playerX, LM.cursorY - LM.playerY), D, 1e-3));
LM.setScanTrickLMB(false);
check('LMB let go: back to the exact angle', !LM.scanTrickSnapped && near(Math.atan2(LM.cursorY - LM.playerY, LM.cursorX - LM.playerX), exact, 1e-9));

/* the packet value (mirrored maps send mapMax + mapMin - x) stays far inside signed Int32
 * for every direction, with the cell at a corner of a map with a large offset */
let worst = 0;
LM.playerX = 50000; LM.playerY = -50000;
for (let i = 0; i < 64; i++) {
  const a = i / 64 * Math.PI * 2;
  at(500 + Math.cos(a) * 200, 300 + Math.sin(a) * 200);
  [LM.cursorX, LM.cursorY, 100000 - LM.cursorX, 100000 - LM.cursorY].forEach(v => { worst = Math.max(worst, Math.abs(v)); });
}
check('packet coordinates fit a signed Int32 with room to spare (' + Math.round(worst) + ')', worst < 2147483647 / 100);
LM.playerX = 150; LM.playerY = -180;

LM.setScanTrickHeld(false);
at(800, 300);
check('key let go: the real cursor at once', near(LM.cursorX, 700) && near(LM.cursorY, -200) && !LM.scanTrickActive);

LM.setScanTrickHeld(true); LM.setScanTrickLMB(true);
LM.releaseScanTrickInput();
check('window loses focus: key and LMB released, real cursor back', !LM.scanTrickHeld && !LM.scanTrickLMB && !LM.scanTrickActive && near(LM.cursorX, 700));

/* a death or a multibox switch with the key held: the hold is the key, so it stays until the key
 * is let go (no new press needed after the respawn); the far aim goes from the view meanwhile */
LM.setScanTrickHeld(true); at(800, 300);
LM.play = false; LM.playerCells = [];
at(800, 300);
check('died with the key held: the hold stays, the far aim goes from the view centre', LM.scanTrickHeld && LM.scanTrickActive && near(LM.cursorX, 100 + D) && near(LM.cursorY, -200));
LM.play = true; LM.playerCells = [{}];
at(800, 300);
check('respawned with the key still held: from the cell again, no second press', LM.scanTrickHeld && near(LM.cursorX, 150 + D) && near(LM.cursorY, -180));
LM.setScanTrickHeld(false);
at(800, 300);
check('then let go: the real cursor', !LM.scanTrickActive && near(LM.cursorX, 700));

/* line split (the real lineSplitStillValid / stopLineSplit): the lock ends at once when its unit
 * dies or the multibox unit is switched, and the real cursor is sent */
{
  const ls = vm.runInContext('({\n' + cut('        lineSplitStillValid() {', '        /* Hotkey action (hk-lineSplit). */') + cut('        stopLineSplit() {', '        /* Line split status') + '\n})', ctx);
  Object.assign(LM, ls);
  let sent = 0;
  LM.lineSplitSeq = 0; LM._unit = 0; LM._cells = { 0: {}, 1: {} };
  LM.getLineSplitUnitNumber = () => LM._unit; LM.getLineSplitCell = n => LM._cells[n] || null;
  LM.sendPosition = () => { sent++; }; LM.updateLineSplitStatus = () => { };
  const lock = () => { LM.lineSplitActive = true; LM.lineSplitTarget = { x: 5, y: 6 }; LM.lineSplitUnit = 0; LM._unit = 0; LM._cells = { 0: {}, 1: {} }; sent = 0; };
  lock(); at(800, 300);
  check('line split: the locked spot while its unit lives', LM.cursorX === 5 && LM.cursorY === 6);
  LM._unit = 1; at(800, 300);
  check('line split: switched to the other multibox unit, the lock ends and the real cursor is sent', !LM.lineSplitActive && LM.lineSplitTarget === null && near(LM.cursorX, 700) && sent === 1);
  lock(); delete LM._cells[0]; at(800, 300);
  check('line split: its unit died, the lock ends and the real cursor is sent', !LM.lineSplitActive && near(LM.cursorX, 700) && sent === 1);
  lock(); LM.stopLineSplit(); LM.stopLineSplit();
  check('line split: stopped twice (blur after the end) sends once', sent === 1);
  LM.lineSplitActive = false;
}

/* no settings: the movement code reads none, the defaults, schema and Settings tab have none */
const engine = cut('        SCAN_TRICK_DIRECTIONS:', '        getScanTrickDirection() {') + cut('        getCursorPosition() {', '        getLineSplitSettings() {');
check('the Scan Trick code reads no setting', !/defaultmapsettings\s*\.\s*scanTrick|defaultmapsettings\s*\[\s*['"]scanTrick/.test(engine));
check('no Scan Trick setting, section, control, help or notice in the core',
  !/\bscanTrick(Rounded|OnlyWhileLMB|Directions|Distance|RoundedDistance|Status|Group)\b|addScanTrickControls|scan-trick-(help|status|direction)|game1\.scan\.|'scanTrick'/.test(main.replace(/\/\*[\s\S]*?\*\//g, '')));

console.log(fail ? fail + ' scan trick check(s) FAILED' : 'all scan trick checks passed');
process.exit(fail ? 1 : 0);
