// Browser bots: the bot core runs in a real Web Worker (blob URL) and answers the control protocol.
// A start for a game server that is not agar.io's: 13, then 2, and the worker ends (no game connection).
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  need('LMBotsWorkerSocket', typeof window.LMBotsWorkerSocket === 'function');
  need('connectionBots.isBrowserHost', window.connectionBots && window.connectionBots.isBrowserHost('browser') && window.connectionBots.isBrowserHost('') && !window.connectionBots.isBrowserHost('ws://localhost:1337'));
  if (fail.length) return { fail: fail, info: info };
  var got = [], t0 = Date.now();
  var s = new window.LMBotsWorkerSocket('https://www.legendmod.ml/ExampleScripts/agario-bots2/botcore.js?v=probe');
  s.onmessage = function (e) { got.push(Array.prototype.join.call(new Uint8Array(e.data), ',')); };
  while (s.readyState === 0 && Date.now() - t0 < 15000) await new Promise(function (r) { setTimeout(r, 50); });
  info.openMs = Date.now() - t0;
  need("opens (readyState " + s.readyState + ")", s.readyState === 1);
  var url = 'wss://imsolo.pro:2102', name = 'b';
  var buf = new Uint8Array(13 + url.length + name.length), p = 0;
  buf[p++] = 0;
  for (var i = 0; i < url.length; i++) buf[p++] = url.charCodeAt(i);
  p++; p += 8; buf[p++] = 1;
  for (i = 0; i < name.length; i++) buf[p++] = name.charCodeAt(i);
  p++; buf[p] = 3;
  s.send(buf.buffer);
  need('worker started', !!s._worker);
  t0 = Date.now();
  while (got.indexOf('2') < 0 && Date.now() - t0 < 5000) await new Promise(function (r) { setTimeout(r, 50); });
  info.ms = Date.now() - t0;
  info.got = got.join(' ');
  need('13 then 2 from the worker', got.indexOf('13') > -1 && got.indexOf('2') > got.indexOf('13'));
  need('worker ended after 2', !s._worker);
  s.close();
  need('closed', s.readyState === 3);
  return { fail: fail, info: info };
})()
