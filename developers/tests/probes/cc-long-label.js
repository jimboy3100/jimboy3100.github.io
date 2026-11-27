// Command Centre in German: a name too long for its row is cut with "..." on one line; its tooltip has
// the whole name (Edit HUD and its explanation could not be read in German, Russian, Bulgarian, Greek).
// The language goes back to how the page started, nothing is saved.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var L = window.LMi18n, CC = window.LMCommandCentre;
  for (var w = 0; w < 100 && !(CC = window.LMCommandCentre); w++) await sleep(150);
  if (!L || !CC || typeof CC.open !== 'function') return { fail: ['LMi18n or LMCommandCentre missing'], info: info };
  var start = L.lang(), saved = null;
  try { saved = localStorage.getItem('languagemod'); } catch (e) { }
  var to = async function (code) { L.setLang(code, { save: false }); for (var i = 0; i < 80 && L.lang() !== code; i++) await sleep(100); await sleep(300); };
  try {
    await to('de');
    CC.open();
    await sleep(400);
    var labels = Array.prototype.slice.call(document.querySelectorAll('#lm-cc-list .lm-cc-label'));
    info.rows = labels.length;
    if (!labels.length) fail.push('no rows listed');
    var cut = labels.filter(function (e) { return e.scrollWidth > e.clientWidth + 1; });
    info.cut = cut.length;
    var bad = labels.filter(function (e) { return e.textContent && e.title !== e.textContent; });
    if (bad.length) fail.push(bad.length + ' names without their whole text as tooltip, e.g. ' + bad[0].textContent.slice(0, 40));
  } catch (e) { fail.push(String(e)); }
  try { if (CC.isOpen()) CC.close(); } catch (e) { }
  await to(start);
  try { if (saved == null) localStorage.removeItem('languagemod'); else localStorage.setItem('languagemod', saved); } catch (e) { }
  return { fail: fail, info: info };
})()
