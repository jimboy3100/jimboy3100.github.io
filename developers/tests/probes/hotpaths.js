// Teamboard with skins (temporary teammates, cached DOM writes) and the budgeted cell sort run
// in the real page without throwing.
(async () => {
  var fail = [], info = {};
  var app = window.application, lm = window.legendmod;
  try {
    var s = { skins: defaultmapsettings.top5skins, show: defaultmapsettings.showTop5, players: app.teamPlayers, top5: app.top5, last: app._lastTop5Html };
    try {
      defaultmapsettings.top5skins = true;
      defaultmapsettings.showTop5 = true;
      var now = Date.now();
      app.teamPlayers = [
        { id: 'probeFresh', nick: 'probeFresh', lbgpi: -2, mass: 800, alive: true, temp: true, x: 0, y: 0, color: '#ff0000', skinURL: '', lastUpdatedTime: now - 500 },
        { id: 'probeStale', nick: 'probeStale', lbgpi: -2, mass: 900, alive: true, temp: true, x: 0, y: 0, color: '#00ff00', skinURL: '', lastUpdatedTime: now - 9000 }
      ];
      app.top5 = [];
      app.displayTop5();
      app.displayTop5();
      var html = document.getElementById('top5-pos').innerHTML;
      info.rows = app.top5.length;
      if (app.top5.length !== 1 || app.top5[0].id !== 'probeFresh') throw new Error('expected only the fresh temp teammate, got ' + app.top5.map(function (p) { return p.id; }).join(','));
      if (app.teamPlayers[1].alive !== false || app.teamPlayers[1].mass !== 1) throw new Error('stale temp teammate not marked dead');
      if (html.indexOf('probeFresh') < 0) throw new Error('fresh teammate not drawn');
      if (html.indexOf('top5-mass-bar') < 0) throw new Error('mass bar missing');
    } finally {
      defaultmapsettings.top5skins = s.skins; defaultmapsettings.showTop5 = s.show;
      app.teamPlayers = s.players; app.top5 = s.top5;
      app._lastTop5Html = null;
      app.displayTop5();
    }
  } catch (e) { fail.push('teamboard: ' + String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')); }
  try {
    var saved = lm.cells;
    try {
      var cells = [];
      for (var i = 0; i < 2500; i++) cells.push({ size: 2500 - i, id: 2500 - i });
      lm.cells = cells;
      var t0 = performance.now();
      lm.sortCells();
      info.sortMs = Math.round((performance.now() - t0) * 100) / 100;
      for (var k = 1; k < cells.length; k++) if (cells[k - 1].size > cells[k].size) throw new Error('not sorted at ' + k);
    } finally { lm.cells = saved; }
  } catch (e) { fail.push('sortCells: ' + String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')); }
  return { fail: fail, info: info };
})()
