// Game Over card: a language change while the card is open puts its texts (title, stat names, the
// icons' tooltips, the invite link's Copy) into the new language at once (they kept the language
// the card was opened in). Nothing is saved: the language goes back to how the page started.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var L = window.LMi18n, lm = window.legendmod;
  if (!L || !lm || typeof lm.showSessionStats !== 'function') return { fail: ['LMi18n or legendmod.showSessionStats missing'], info: info };
  var start = L.lang(), saved = null;
  try { saved = localStorage.getItem('languagemod'); } catch (e) { }
  var to = async function (code) { L.setLang(code, { save: false }); for (var i = 0; i < 80 && L.lang() !== code; i++) await sleep(100); await sleep(200); };
  var greek = function (s) { return /[\u0370-\u03ff]/.test(String(s || '')); };
  try {
    if (start !== 'en') await to('en');
    lm.showSessionStats({ finalMass: 9000, highestMass: 24500, topPosition: 2, finalPosition: 5, timeTotal: 95, timeInLeaderboard: 60, massConsumed: 30000, foodEaten: 100, playersEaten: 3, normalCellsEaten: 5, virusesEaten: 1 });
    await sleep(400);
    var m = document.getElementById('lm-gameover-modal');
    need('card shown', !!m);
    if (m) {
      await to('el');
      var labels = Array.prototype.map.call(m.querySelectorAll('.lm-go-label'), function (e) { return e.textContent; });
      info.labels = labels.length;
      need('stat names in Greek: ' + labels.filter(function (s) { return !greek(s); }).slice(0, 3).join(', '), labels.length >= 11 && labels.every(greek));
      need('stat names are their own (Final mass first)', labels[0] === lmT('finalMass') || labels[1] === lmT('finalMass'));
      need('title in Greek', greek(m.textContent.slice(0, 400)) && m.textContent.indexOf(lmT('gameOver')) >= 0);
      ['lm-go-copy', 'lm-go-share', 'lm-go-dlcard'].forEach(function (id) {
        var e = document.getElementById(id);
        need(id + ' tooltip in Greek', !!e && greek(e.getAttribute('title')));
      });
      var cp = m.querySelector('#lm-go-reflink [data-i18n]');
      need('invite link Copy in Greek', !cp || greek(cp.textContent));
      /* the stat values are kept */
      need('values kept', m.textContent.indexOf('24') >= 0);
    }
  } catch (e) { fail.push(String(e)); }
  try { var x = document.getElementById('lm-go-close'); if (x) x.click(); } catch (e) { }
  await to(start);
  try { if (saved == null) localStorage.removeItem('languagemod'); else localStorage.setItem('languagemod', saved); } catch (e) { }
  return { fail: fail, info: info };
})()
