// window.LMEvents (user script hooks): on/off/once, listener isolation, frozen data.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var E = window.LMEvents;
  need('LMEvents', !!E && typeof E.on === 'function' && typeof E.off === 'function' && typeof E.once === 'function' && !!E.api);
  if (!E) return { fail: fail, info: info };
  ['getMass', 'getPosition', 'isPlaying', 'getServerType', 'sendChat', 'toast'].forEach(function (f) { need('api.' + f, typeof E.api[f] === 'function'); });
  need('nobody listens at start', ['spawn', 'death', 'chat', 'serverChange', 'massUpdate', 'leaderboard'].every(function (n) { return !E._has(n); }));
  var name = '_probe', got = [], ow = console.warn, warns = 0;
  console.warn = function () { warns++; };
  var bad = function (d) { d.v = 99; throw new Error('probe'); };
  var good = function (d) { got.push(d.v); };
  E.on(name, bad); E.on(name, good);
  E.emit(name, { v: 1 }); E.emit(name, { v: 2 });
  console.warn = ow;
  need('a throwing listener does not stop the next one', got.join() === '1,2');
  need('a failing listener is logged once', warns === 1);
  E.off(name, bad); E.off(name, good);
  need('off', !E._has(name));
  var n = 0; E.once(name, function () { n++; }); E.emit(name, {}); E.emit(name, {});
  need('once', n === 1 && !E._has(name));
  need('getPosition shape', typeof E.api.getPosition().x === 'number');
  info.serverType = E.api.getServerType();
  return { fail: fail, info: info };
})()
