// Game Over card with Death recap off: the one-time "Turn on Death recap" hint is in view without
// scrolling the card (it is shown only once). On a 915x412 phone the card is taller than the screen and
// scrolls; up to 3.698 the hint was at its end, below the bottom of the screen.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !window.LMDeathRecap; i++) await sleep(250);
  var s = window.legendmod5, lm = window.legendmod;
  if (!window.LMDeathRecap || !s || !lm || typeof lm.showSessionStats !== 'function') return { fail: ['death recap module or showSessionStats missing'] };
  var keep = s.deathRecap, hintKey = null;
  try { hintKey = localStorage.getItem('lmDeathRecapHint'); localStorage.removeItem('lmDeathRecapHint'); } catch (e) { }
  var u = { finalMass: 9000, highestMass: 24500, topPosition: 2, finalPosition: 5, timeTotal: 95, timeInLeaderboard: 60, massConsumed: 30000, foodEaten: 100, playersEaten: 3, normalCellsEaten: 5, virusesEaten: 1 };
  try {
    s.deathRecap = false; window.LMDeathRecap.sync();
    lm.showSessionStats(u);
    await sleep(700);
    var modal = document.getElementById('lm-gameover-modal'), row = document.getElementById('lm-go-recap-hint');
    if (!modal) return { fail: ['Game Over card not shown'], info: info };
    if (!row) return { fail: ['Death recap hint not shown on the card'], info: info };
    var mr = modal.getBoundingClientRect(), r = row.getBoundingClientRect();
    var bottom = Math.min(mr.bottom, innerHeight), top = Math.max(mr.top, 0);
    info.card = [Math.round(mr.top), Math.round(mr.bottom), modal.scrollHeight, modal.clientHeight];
    info.hint = [Math.round(r.top), Math.round(r.bottom)];
    info.screen = [innerWidth, innerHeight];
    if (r.top < top - 1 || r.bottom > bottom + 1) fail.push('hint out of view: ' + info.hint.join('-') + ' in a card shown at ' + Math.round(top) + '-' + Math.round(bottom));
  } finally {
    var m = document.getElementById('lm-gameover-modal');
    if (m && m.parentNode) m.parentNode.removeChild(m);
    if (lm._gameOverDismissTimer) { clearTimeout(lm._gameOverDismissTimer); lm._gameOverDismissTimer = null; }
    s.deathRecap = keep; window.LMDeathRecap.sync();
    try { if (hintKey == null) localStorage.removeItem('lmDeathRecapHint'); else localStorage.setItem('lmDeathRecapHint', hintKey); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
