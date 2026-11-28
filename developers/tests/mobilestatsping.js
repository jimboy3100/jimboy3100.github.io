// Phone compact stats (LMmobile.js compactStats): the ping dot shows the ping the desktop stats line
// shows: the controlled multibox unit's own ping, else drawRender.ping. Before, it read window.pingTime,
// ogario.ping and connection.ping, which nothing sets, so phone players never had a ping.
// The real ping lines of the 500 ms timer are run on their own. Also its mass line: the mass and
// cells of the player you control (a multibox unit's while you steer it).
// LM_ROOT=<other checkout> runs it on another version.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = process.env.LM_ROOT || path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'LMmobile', 'LMmobile.js'), 'utf8');
const a = src.indexOf('/* Ping: the value'), b = src.indexOf('if (dot.textContent !== dotText)', a);
if (a < 0 || b < 0) { console.log('FAIL ping lines not found'); process.exit(1); }
const body = src.slice(a, b);
let failed = 0;
const ok = (cond, name) => { console.log((cond ? 'ok   ' : 'FAIL ') + name); if (!cond) failed++; };
function dot(win) {
  const ctx = { window: win, getActiveSpect: n => (win.spects || []).find(s => s.number === n) || null };
  vm.runInNewContext(body + '; out = dotText;', ctx);
  return ctx.out;
}
ok(dot({ drawRender: { ping: 42 } }) === '🟢 42ms', 'main connection ping 42 shows a green 42ms');
ok(dot({ drawRender: { ping: 150 } }) === '🟡 150ms', 'ping 150 shows yellow');
ok(dot({ drawRender: { ping: 260 } }) === '🔴 260ms', 'ping 260 shows red');
ok(dot({ drawRender: {} }) === '', 'no ping measured yet: no dot');
ok(dot({}) === '', 'no drawRender (core not loaded): no dot');
ok(dot({ drawRender: { ping: 42 }, multiboxPlayerEnabled: 2, spects: [{ number: 2, ping: 77 }] }) === '🟢 77ms', 'controlled multibox unit: its own ping');
ok(dot({ drawRender: { ping: 42 }, multiboxPlayerEnabled: 2, spects: [{ number: 2 }] }) === '🟢 42ms', 'unit without a ping yet: main ping');
ok(dot({ drawRender: { ping: 42 }, legendmod: { ws: 'wss://imsolo.pro.replay:2000' } }) === '', 'replay playing: no ping dot (the old live ping is not shown)');
ok(dot({ drawRender: { ping: 42 }, legendmod: { ws: 'wss://live-arena-1.agar.io:443' } }) === '🟢 42ms', 'live server: the ping dot is shown');
/* the mass line of the same timer: the player you control (a multibox unit: its mass and cells
 * from lmActiveUnit, the real one of ogario.v4.js), not the main player's (0 after it died) */
const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const fnSrc = (text, head) => { const i = text.indexOf(head); if (i < 0) return ''; let d = 0, k = text.indexOf('{', i); for (; k < text.length; k++) { if (text[k] === '{') d++; else if (text[k] === '}' && --d === 0) break; } return text.slice(i, k + 1); };
const ma = src.indexOf('// Mass + cells'), mb = src.indexOf('/* write only on change', ma);
if (ma < 0 || mb < 0) { console.log('FAIL mass lines not found'); process.exit(1); }
const massBody = src.slice(ma, mb);
function massLine(lm, enabled, spects) {
  const ctx = { spects: spects || [], ogario: lm, legendmod: lm, LM: lm };
  ctx.window = ctx; ctx.window.legendmod = lm; ctx.multiboxPlayerEnabled = enabled || null;
  vm.runInNewContext(fnSrc(v4, 'function getActiveSpect(') + '\n' + fnSrc(v4, 'function lmActiveUnit() {') + '\nwindow.lmActiveUnit = lmActiveUnit;\n' + massBody + '; out = mass + "/" + cells;', ctx);
  return ctx.out;
}
const unitCells = [{ size: 100 }, { size: 120 }, { size: 80 }];
const unit = { number: 3, player: true, playerMass: 500, getOwnPlayerCells: () => unitCells };
ok(massLine({ play: true, playerMass: 900, playerCells: [{}, {}] }) === '900/2', 'no multibox: the main player\'s mass and cells');
ok(massLine({ play: false, playerMass: 0, playerCells: [] }, 3, [{ number: 1, player: false }, unit]) === '500/3', 'steering a unit (main dead): the unit\'s mass and cells');
ok(massLine({ play: true, playerMass: 900, playerCells: [{}, {}] }, 3, [unit]) === '500/3', 'steering a unit (main alive): the unit\'s, not the main player\'s');
ok(massLine({ play: true, playerMass: 900, playerCells: [{}, {}] }, null, [unit]) === '900/2', 'main controlled while a unit plays: the main player\'s');
console.log(failed ? failed + ' check(s) failed' : 'all phone ping checks passed');
process.exit(failed ? 1 : 0);
