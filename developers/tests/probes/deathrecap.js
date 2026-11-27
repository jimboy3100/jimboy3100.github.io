// Death recap (ogario/modules/deathrecap.js): off by default with no listeners; the recap panel fits the
// screen (915x412 phone too) and stays off the card; the kill feed is removed (no setting, switch or line); state restored.
// The Game Over card is one switch (gameOverStats): with it on, the card shows who ate you, the mass graph
// and the recap without a switch per part (massGraph / showKiller / deathRecap are gone).
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !window.LMDeathRecap; i++) await sleep(250);
  var D = window.LMDeathRecap, s = window.legendmod5, lm = window.legendmod;
  need('module loaded', !!D);
  if (!D || !s || !lm) return { fail: fail, info: info };
  need('option off by default', s.gameOverStats === false);
  /* also no mass-loss alert (removed) */
  need('no switch per card part', ['massGraph', 'showKiller', 'deathRecap', 'massLossAlert', 'massLossPct'].every(function (k) { return !document.getElementById(k) && !(k in LM_SETTINGS_DEFAULTS); }));
  need('nothing runs while off', window._lmDROn === false && !window.LMEvents._has('death') && !window.LMEvents._has('spawn'));
  need('menu switch', !!document.getElementById('gameOverStats') && !document.getElementById('massLossPct-slider'));
  need('no kill feed setting or switch', !('killFeed' in s) && !('killFeed' in LM_SETTINGS_DEFAULTS) && !document.getElementById('killFeed'));
  var keep = { gameOverStats: s.gameOverStats }, keepK = lm._lmKiller, keepH = window.application && application._lmMassHist;
  var inBox = function (r) { return r.width > 0 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; };
  var overlap = function (a, b) { return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; };
  var u = { finalMass: 9000, highestMass: 24500, topPosition: 2, finalPosition: 5, timeTotal: 95, timeInLeaderboard: 60, massConsumed: 30000, foodEaten: 100, playersEaten: 3, normalCellsEaten: 5, virusesEaten: 1 };
  try {
    s.gameOverStats = true; D.sync();
    need('on: listeners and flag', window._lmDROn === true && window.LMEvents._has('death'));
    var T = D._test, t0 = Date.now() - 25000;
    T.reset();
    for (var t = t0; t <= t0 + 25000; t += 250) T.sample(t, t < t0 + 18000 ? 24500 : 9000, t < t0 + 13000 ? 4 : 8, 'Probe<b>X</b>');
    T.event('split', t0 + 13000);
    T.event('eaten', t0 + 18000, 15500, 'Probe<b>X</b>');
    T.event('loss', t0 + 18000, 15500, null, 24500);
    T.event('eaten', t0 + 25000, 9000, 'Probe<b>X</b>');
    lm._lmKiller = { at: Date.now(), nick: 'Probe<b>X</b>', mass: 24500 };
    if (window.application) application._lmMassHist = [1000, 5000, 24500, 9000];
    lm.showSessionStats(u);
    await sleep(500);
    var modal = document.getElementById('lm-gameover-modal'), panel = document.getElementById('lm-go-recap');
    need('recap panel on the card', !!modal && !!panel);
    need('card shows who ate you', !!modal && modal.textContent.indexOf(lmT('eatenBy')) !== -1 && modal.textContent.indexOf('Probe<b>X</b>') !== -1);
    need('card shows the mass graph', !!document.getElementById('lm-go-graph'));
    if (panel) {
      var rows = panel.querySelectorAll('div'), txt = panel.textContent;
      info.recap = txt.slice(0, 160);
      need('3-6 steps', rows.length >= 4 && rows.length <= 7);
      need('nick shown as text, not HTML', txt.indexOf('Probe<b>X</b>') !== -1 && !panel.querySelector('b'));
      var pr = panel.getBoundingClientRect(), mr = modal.getBoundingClientRect();
      info.recapRect = [Math.round(pr.left), Math.round(pr.top), Math.round(pr.right), Math.round(pr.bottom)];
      info.cardRect = [Math.round(mr.left), Math.round(mr.top), Math.round(mr.right), Math.round(mr.bottom)];
      need('recap on screen', inBox(pr));
      need('card on screen', inBox(mr));
      /* seen, not cut off by a scrolling box around it */
      var hit = document.elementFromPoint((pr.left + pr.right) / 2, pr.top + Math.min(20, pr.height / 2));
      need('recap visible (not clipped)', !!hit && panel.contains(hit));
      var card = modal.querySelector('.lm-go-card');
      if (card && panel.parentNode === modal) need('recap beside the card, not over it', !overlap(card.getBoundingClientRect(), panel.getBoundingClientRect()));
      info.wide = panel.parentNode === modal;
    }
    need('no kill feed line after the death', !document.getElementById('lm-killfeed') && typeof T.feed === 'undefined');
  } finally {
    var m = document.getElementById('lm-gameover-modal');
    if (m && m.parentNode) m.parentNode.removeChild(m);
    if (lm._gameOverDismissTimer) { clearTimeout(lm._gameOverDismissTimer); lm._gameOverDismissTimer = null; }
    s.gameOverStats = keep.gameOverStats;
    lm._lmKiller = keepK; if (window.application) application._lmMassHist = keepH;
    D._test.reset(); D.sync();
  }
  need('off again: nothing listens', window._lmDROn === false && !window.LMEvents._has('death') && !document.getElementById('lm-killfeed'));
  return { fail: fail, info: info };
})()
