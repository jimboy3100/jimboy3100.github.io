// Leaderboard rows with decorative names (stacked accents, Javanese ornaments, emoji, right-to-left
// text and a direction override): the real row builder (legendmod.handleLeaderboard) and the real
// stylesheet. Each row clips its text at its own top and bottom (it drew into the next rows), keeps
// the row height of a plain name, keeps long names running out at the sides as before, and holds the
// name in a <bdi> so its direction cannot move the rank. The real leaderboard is put back at the end.
(async () => {
  var fail = [], info = {};
  var LM = window.legendmod, pos = document.getElementById('leaderboard-positions');
  if (!LM || typeof LM.handleLeaderboard !== 'function' || !pos) return { skip: 'no leaderboard' };
  var nicks = ['plain', 'G̈̈̈̈O̶̶D͒͒͒', '꧁ꦿ NPulsar ꦿ꧂', '🔥 Fury 💀',
    'مرحبا 7', '‮evil', 'a fairly long plain name for the box'];
  var saved = LM.leaderboard, savedPos = LM.playerPosition, rows = [];
  try {
    LM.leaderboard = nicks.map(function (n, i) { return { nick: n, id: 9000 + i, isFriend: false }; });
    LM.playerPosition = 0;
    LM.handleLeaderboard();
    var spans = Array.prototype.filter.call(pos.children, function (c) { return c.tagName === 'SPAN'; });
    nicks.forEach(function (n, i) {
      var row = spans[i];
      if (!row) { fail.push('row ' + (i + 1) + ' missing'); return; }
      var cs = getComputedStyle(row), b = row.querySelector('bdi');
      rows.push({ h: row.offsetHeight, oy: cs.overflowY, ox: cs.overflowX });
      if (!b || b.textContent !== n) fail.push('row ' + (i + 1) + ': name not in its own <bdi> (' + JSON.stringify(row.innerHTML.slice(0, 60)) + ')');
      if (row.textContent.indexOf((i + 1) + '. ') !== 0 || row.textContent.indexOf(n) < 0) fail.push('row ' + (i + 1) + ': text changed (' + JSON.stringify(row.textContent) + ')');
      if (cs.overflowY !== 'clip' && cs.overflowY !== 'hidden') fail.push('row ' + (i + 1) + ': text not clipped at the row (overflow-y ' + cs.overflowY + ')');
      if (cs.overflowX !== 'visible') fail.push('row ' + (i + 1) + ': long names cut at the sides (overflow-x ' + cs.overflowX + ')');
      if (rows[0] && row.offsetHeight !== rows[0].h) fail.push('row ' + (i + 1) + ': ' + row.offsetHeight + ' px high, a plain name ' + rows[0].h);
    });
  } finally {
    LM.leaderboard = saved;
    LM.playerPosition = savedPos;
    try { LM.handleLeaderboard(); } catch (e) { }
  }
  info.rows = rows;
  return { fail: fail, info: info };
})()
