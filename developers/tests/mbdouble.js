// Multibox on agar.io: each own cell is drawn once. agar.io numbers cells per connection, so
// the other connection's copy of an own cell is found by position (lmMultiboxPositionTwin);
// own cells take the profile colour, the copy the server's, and a colour test there drew every
// own cell twice (the main player's and the unit's, skins over each other).
// The real client in headless Chrome (smoke.js), fed a two-socket bench scene
// (lib/bench-scene.js, socketIds: the unit numbers its cells itself) with WebGL on and off:
// each own cell has exactly one drawn copy, the own one, and the frame matches the same world
// with shared ids (copies matched by id). Without Chrome it is skipped.
// Usage: node developers/tests/mbdouble.js
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..', '..');
const out = path.join(__dirname, 'out', 'mbdouble-' + Date.now());
fs.mkdirSync(out, { recursive: true });

const probe = `(async function () {
  var t0 = Date.now();
  while (!(window.legendmod && window.drawRender && window.addBox) && Date.now() - t0 < 20000) await new Promise(function (r) { setTimeout(r, 250); });
  await new Promise(function (res, rej) { var s = document.createElement('script'); s.charset = 'utf-8'; s.src = 'https://www.legendmod.ml/developers/tests/lib/bench-scene.js?x=' + Date.now(); s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  var B = window.LMBenchDense, res = [], prevGL = defaultmapsettings.webgl2Acceleration;
  function drawn(x, y, r) {
    var n = [];
    legendmod.cells.forEach(function (c) { if (c && !c.removed && !c.invisible && !c.isFood && Math.abs(c.size - r) < 10 && Math.hypot(c.x - x, c.y - y) < r) n.push({ own: !!c.isPlayerCell, sp: c.spectator || 0 }); });
    return n;
  }
  try {
    for (var gl = 1; gl >= 0; gl--) {
      defaultmapsettings.webgl2Acceleration = !!gl;
      var r = { gl: gl };
      await B.run(B.scene({ bodies: 6, food: 20, sockets: 2, socketIds: true }), { warmMs: 800, measureMs: 100, countFrames: 2 });
      r.main = drawn(0, 0, 150); r.unit = drawn(700, 120, 130);
      var a = await B.capture({ ticks: 0, frames: 3 });
      r.mainAfterCapture = drawn(0, 0, 150); r.unitAfterCapture = drawn(700, 120, 130);
      await B.run(B.scene({ bodies: 6, food: 20, sockets: 2 }), { warmMs: 800, measureMs: 100, countFrames: 2 });
      var b = await B.capture({ ticks: 0, frames: 3 });
      r.diff = await B.diffImages(a.png, b.png);
      res.push(r);
    }
  } finally { B.stop(); defaultmapsettings.webgl2Acceleration = prevGL; }
  return res;
})()`;
fs.writeFileSync(path.join(out, 'probe.js'), probe);

const r = spawnSync(process.execPath, [path.join(__dirname, 'smoke.js'), repo, out, '14'], { encoding: 'utf8', timeout: 300000 });
if (r.status === 2 || /chrome not found/.test(r.stdout || '')) {
    console.log('skipped: Chrome not found (set CHROME_PATH)');
    process.exit(0);
}
let result = null;
try { result = JSON.parse(fs.readFileSync(path.join(out, 'result.json'), 'utf8')); } catch (e) { }
const runs = result && Array.isArray(result.probe) ? result.probe : null;
if (!runs) {
    console.log('FAIL no probe result\n' + String(r.stdout || '').slice(-2000) + String(r.stderr || '').slice(-1000));
    process.exit(1);
}

let failed = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : ': ' + JSON.stringify(info)));
    if (!ok) failed++;
}
const once = (list) => Array.isArray(list) && list.length === 1 && list[0].own;
for (const run of runs) {
    const tag = run.gl ? 'WebGL' : 'Canvas2D';
    check(tag + ': main player cell drawn once, the own copy', once(run.main) && once(run.mainAfterCapture), run.main);
    check(tag + ': unit cell drawn once, the own copy', once(run.unit) && once(run.unitAfterCapture), run.unit);
    /* the same world with ids shared by both sockets (copies matched by id) looks the same */
    check(tag + ': frame as with shared ids (' + (run.diff && run.diff.differingPct) + '% pixels differ)', run.diff && !run.diff.sizeDiffers && run.diff.differingPct < 0.5, run.diff);
}
if (result.errors && result.errors.length) check('no page errors', false, result.errors.slice(0, 3));
if (failed) {
    console.log(failed + ' check(s) failed');
    process.exit(1);
}
console.log('all multibox own-cell checks passed');
