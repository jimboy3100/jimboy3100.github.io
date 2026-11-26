// Copy leaderboard (hotkey and the leaderboard menu's copy button) and "TK & ALL" (server link,
// leaderboard and teamboard): each row is on its own line. Until 3.682 the rows were copied run
// together ("1. Alice2. Bob3. bot"). Rows built by the real legendmod.handleLeaderboard; the copy
// is caught at document.execCommand('copy'); the real leaderboard is put back after.
(async () => {
  var fail = [], info = {};
  var LM = window.legendmod, app = window.application;
  if (!LM || !app || typeof LM.handleLeaderboard !== 'function' || typeof app.copyLb !== 'function') return { skip: 'no leaderboard' };
  var copied = [], oExec = document.execCommand;
  var saved = { lb: LM.leaderboard, gc: LM.ghostCells, pp: LM.playerPosition, top5: $('#top5-pos').html(), last5: app._lastTop5Html };
  try {
    document.execCommand = function (c) {
      if (c !== 'copy') return oExec.apply(document, arguments);
      var a = document.activeElement;
      copied.push(a && 'value' in a ? String(a.value) : '');
      return true;
    };
    LM.leaderboard = ['Alice', 'Bob  Two', 'Carl'].map(function (n, i) { return { nick: n, id: 9100 + i, isFriend: false }; });
    LM.ghostCells = LM.leaderboard.map(function (r, i) { return { x: 100 * i, y: 50 * i, size: 100, mass: 1000 - i * 100 }; });
    LM.playerPosition = 0;
    LM.handleLeaderboard();
    app.copyLb();
    var lines = String(copied[0] || '').split('\n');
    info.hotkey = lines.slice(0, 4);
    if (lines[0] !== '1. Alice' || lines[1] !== '2. Bob  Two' || lines[2] !== '3. Carl') fail.push('hotkey copy: rows not one per line: ' + JSON.stringify(copied[0]));
    /* the menu's copy button copies the same text */
    var btn = document.querySelector('#dropDown > #copyLBBtn');
    if (btn) {
      copied.length = 0;
      $(btn).trigger('click');
      if (String(copied[0] || '').split('\n')[1] !== '2. Bob  Two') fail.push('copy button: rows not one per line: ' + JSON.stringify(copied[0]));
    }
    /* TK & ALL: the teamboard rows (with and without the skin layout) on their own lines too */
    $('#top5-pos').html('<li><span>1. </span><span class="hud-main-color">[C3]</span><span class="top5-mass-color">[1.2k]</span> Mate</li>' +
      '<li><a href="#"><span><img alt=""></span></a><div><span class="hud-main-color">[B2]</span><span class="top5-mass-color">\n   [900]\n   <div>Pal</div>\n</span></div></li>');
    if (typeof window.copyToClipboardAll === 'function') {
      copied.length = 0;
      window.CopyTkPwLb2 = 'https://agar.io/?sip=test';
      window.copyToClipboardAll();
      var all = String(copied[0] || '');
      info.all = all.split('\n');
      if (all.indexOf('\n1. Alice\n2. Bob  Two\n3. Carl') === -1) fail.push('TK & ALL: leaderboard rows not one per line: ' + JSON.stringify(all));
      if (all.indexOf('\n1. [C3][1.2k] Mate\n[B2] [900] Pal') === -1) fail.push('TK & ALL: teamboard rows not one per line: ' + JSON.stringify(all));
      $('#CopyTkPwLb').remove();
    }
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    document.execCommand = oExec;
    LM.leaderboard = saved.lb; LM.ghostCells = saved.gc; LM.playerPosition = saved.pp;
    $('#top5-pos').html(saved.top5); app._lastTop5Html = saved.last5;
    try { LM.handleLeaderboard(); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
