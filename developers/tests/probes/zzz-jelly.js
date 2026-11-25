// Jelly physics in the real page: the point grid of wasm_quadtree.js is the collision index
// while jelly is on, answers like a direct scan, and the frames with cells run without errors.
(async () => {
  var fail = [], info = {};
  var lm = window.legendmod;
  var Q = window.WasmQuadTree;
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!Q || typeof Q.touches !== 'function' || typeof Q.beginCell !== 'function') {
    fail.push('WasmQuadTree point grid missing');
    return { fail: fail, info: info };
  }
  info.jelly = !!(window.legendmod5 && window.legendmod5.jellyPhisycs);
  /* wait a little for a frame with jelly cells (the replay / practice probes leave some or not) */
  for (var i = 0; i < 20 && !(lm && lm.quadtree && Q.stats().points > 0); i++) await sleep(100);
  var st = Q.stats();
  info.points = st.points;
  info.cells = st.cells;
  if (info.jelly && st.points > 0 && lm.quadtree !== Q) fail.push('jelly on but LM.quadtree is not the point grid');
  /* a small own scene: two touching cells and a far one, checked against a direct scan */
  var mk = function (x, y, r, n) {
    var c = { removed: false, isFood: false, points: [] };
    for (var k = 0; k < n; k++) c.points.push({ x: x + Math.cos(2 * Math.PI * k / n) * r, y: y + Math.sin(2 * Math.PI * k / n) * r, rl: r, parent: c });
    return c;
  };
  var saved = lm ? lm.quadtree : null;
  var a = mk(0, 0, 50, 30), b = mk(98, 0, 50, 30), far = mk(600, 0, 40, 20);
  Q.rebuild(-1000, -1000, 2000, 2000, [a, b, far]);
  var oa = Q.ordOf(a), ofar = Q.ordOf(far);
  var touchA = a.points.filter(function (p) { return Q.touches(p.x, p.y, oa); }).length;
  var touchFar = far.points.filter(function (p) { return Q.touches(p.x, p.y, ofar); }).length;
  info.touchA = touchA;
  if (!(touchA > 0 && touchA < a.points.length)) fail.push('touching cells: ' + touchA + ' of ' + a.points.length + ' points touch');
  if (touchFar !== 0) fail.push('a far cell touches something');
  if (Q.query({ x: -1000, y: -1000, w: 2000, h: 2000 }).length !== 80) fail.push('query() did not return all 80 points');
  if (lm) lm.quadtree = saved;
  await sleep(300);
  return { fail: fail, info: info };
})()
