// Players named like members of Object / Array ("constructor", "__proto__", "map", "length"...):
// a practice session with bots of these names (skins and video skins as by default) draws them
// with no cell draw error, gives them string colours and changes no prototype.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lm = window.legendmod;
  /* the module loads with its window */
  if (!(window.LMPractice && window.LMPractice.start) && typeof window.lmPractice === 'function') {
    window.lmPractice('open');
    for (var w = 0; w < 60 && !(window.LMPractice && window.LMPractice.start); w++) await sleep(100);
  }
  var P = window.LMPractice;
  if (!lm || !P || !P.start || typeof window.lmT !== 'function') return { fail: ['practice module missing'] };
  if (P.isOpen && P.isOpen()) P.close();
  var NICKS = ['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__', 'at', 'map', 'length'];
  var protoKeys = Object.getOwnPropertyNames(Object.prototype).join();
  var drawErr = [], realErr = console.error, realT = window.lmT;
  console.error = function () {
    var s = String(arguments[0]);
    if (s.indexOf('CELL DRAW ERROR') >= 0 && drawErr.length < 5) drawErr.push(s.slice(0, 160) + ' ' + String(arguments[1] && arguments[1].message));
    return realErr.apply(console, arguments);
  };
  /* the bots take their names from the language packs */
  window.lmT = function (k, v) { return k === 'modules.practicesim.bot' && v && v[0] ? NICKS[(v[0] - 1) % NICKS.length] : realT.apply(this, arguments); };
  var C = window.drawRender && drawRender._lmGlWhyN, G = window.drawRender && drawRender.GLW || {};
  var gl0 = C ? C[G.WEBGL] : 0, all0 = C ? Array.prototype.reduce.call(C, function (a, b) { return a + b; }, 0) : 0;
  try {
    P.start({ exercise: 'free', seed: 7, bots: 3 * NICKS.length, startMass: 4000, duration: 120 }, { confirm: true });
    if (!P.state().on) fail.push('session did not start');
    await sleep(2500);
    var named = (lm.cells || []).filter(function (c) { return NICKS.indexOf(c.targetNick) >= 0; });
    info.named = named.map(function (c) { return c.targetNick; }).filter(function (n, i, a) { return a.indexOf(n) === i; }).join(' ');
    if (!named.length) fail.push('no cell with these names on screen');
    /* frames drawn with WebGL / all frames of the session */
    if (C) info.frames = (C[G.WEBGL] - gl0) + '/' + (Array.prototype.reduce.call(C, function (a, b) { return a + b; }, 0) - all0);
    var badColor = named.filter(function (c) { return typeof c.color !== 'string'; }).map(function (c) { return c.targetNick + ':' + typeof c.color; });
    if (badColor.length) fail.push('colours that are not text: ' + badColor.join(', '));
    if (P.state().errors) fail.push('packet errors: ' + P.state().errors);
  } finally {
    window.lmT = realT;
    console.error = realErr;
    try { P.stop(false); } catch (e) { }
  }
  await sleep(200);
  if (drawErr.length) fail.push('cell draw errors: ' + drawErr.join(' | '));
  if (Object.getOwnPropertyNames(Object.prototype).join() !== protoKeys || ({}).polluted !== undefined) fail.push('Object.prototype changed');
  if (lm.socket && lm.socket._lmPractice) fail.push('stand-in socket left behind');
  return { fail: fail, info: info };
})()
