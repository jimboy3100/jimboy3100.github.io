// Phone compact stats (LMmobile.js compactStats): the ping dot shows the ping the desktop stats line
// shows: the controlled multibox unit's own ping, else drawRender.ping. Before, it read window.pingTime,
// ogario.ping and connection.ping, which nothing sets, so phone players never had a ping.
// The real ping lines of the 500 ms timer are run on their own.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'LMmobile', 'LMmobile.js'), 'utf8');
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
console.log(failed ? failed + ' check(s) failed' : 'all phone ping checks passed');
process.exit(failed ? 1 : 0);
