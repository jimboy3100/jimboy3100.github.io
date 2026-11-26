// LMexpress texts follow Choose Language: switch to Greek, the user scripts panel, the voice settings and
// the profile buttons show the Greek pack texts, no lmx.* key is missing, and English comes back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var L = window.LMi18n;
  if (!L) return { fail: ['LMi18n is missing'], info: info };
  var setLang = function (n) { return new Promise(function (r) { L.setLang(n, { save: false }, function () { r(); }); setTimeout(r, 8000); }); };
  var checks = [
    ['#userscripts h5[data-i18n]', 'lmx.sn.title'],
    ['#voice-config h5[data-i18n]', 'lmx.vo.title'],
    ['[data-i18n^="lmx.ui."]', null],
    ['[data-i18n^="lmx.ex."]', null]
  ];
  var before = L.lang();
  try {
    await setLang(2);
    await sleep(300);
    info.lang = L.lang();
    if (L.lang() !== 'el') fail.push('language did not switch to Greek');
    checks.forEach(function (c) {
      var el = document.querySelector(c[0]);
      if (!el) { info[c[0]] = 'absent'; return; }
      var key = c[1] || el.getAttribute('data-i18n');
      var want = window.lmT(key);
      if (el.textContent !== want) fail.push(c[0] + ': "' + el.textContent + '" is not the Greek "' + want + '"');
      info[key] = el.textContent;
    });
    if (window.lmT('lmx.lg.playFirst') === 'Play a game first to use this feature') fail.push('lmx.lg.playFirst has no Greek text');
    var missing = Object.keys(L.missing()).filter(function (k) { return k.indexOf('lmx.') === 0; });
    if (missing.length) fail.push('missing lmx keys: ' + missing.join(', '));
  } finally {
    await setLang(before === 'en' ? 1 : L.codes.indexOf(before) + 1);
  }
  var t = document.querySelector('#userscripts h5[data-i18n]');
  if (t && t.textContent !== window.lmT('lmx.sn.title')) fail.push('user scripts title did not switch back');
  return { fail: fail, info: info };
})()
