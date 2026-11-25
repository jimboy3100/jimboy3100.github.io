// Page and phone texts from the language packs (developers/i18n/src/misc.json): the marked texts of
// play.html are filled, and a language change (Greek here) updates them, the profile name included
// only while it is "Guest". Puts English back at the end without saving it.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var L = window.LMi18n;
  if (!L || typeof window.lmT !== 'function') return { fail: ['LMi18n / lmT missing'] };
  var buy = document.getElementById('buy-boost');
  if (!buy || buy.getAttribute('data-i18n') !== 'misc.page.buy') fail.push('BUY button not marked');
  else if (buy.textContent !== lmT('misc.page.buy')) fail.push('BUY text ' + buy.textContent + ', pack ' + lmT('misc.page.buy'));
  var pv = document.querySelector('#region option[value="Private"]');
  if (pv && pv.textContent !== lmT('misc.page.private')) fail.push('Private option text ' + pv.textContent);
  var prev = L.lang();
  var done = false;
  L.setLang('el', { save: false }, function () { done = true; });
  for (var w = 0; w < 50 && !done; w++) await sleep(100);
  if (!done) fail.push('Greek did not load');
  else {
    var el = function (k) { return L.has(k, 'el') ? lmT(k) : null; };
    if (buy && buy.textContent !== el('misc.page.buy')) fail.push('BUY not Greek after the change: ' + buy.textContent);
    var name = document.getElementById('UserProfileName1');
    info.name = name && name.textContent;
    if (name && name.getAttribute('data-i18n') === 'misc.page.guest' && name.textContent !== el('misc.page.guest')) fail.push('Guest not Greek');
    var split = document.querySelector('#lm-mc-r [data-i18n="misc.mobile.split"]');
    if (window.LM_IS_MOBILE) {
      if (!split) fail.push('phone SPLIT label not marked');
      else if (split.textContent !== el('misc.mobile.split')) fail.push('SPLIT not Greek: ' + split.textContent);
      var lab = document.querySelector('#lm-sp [data-i18n="misc.mobile.joystick"]');
      if (!lab || lab.textContent !== el('misc.mobile.joystick')) fail.push('phone settings label not Greek');
    }
  }
  done = false;
  L.setLang(prev || 'en', { save: false }, function () { done = true; });
  for (var w2 = 0; w2 < 50 && !done; w2++) await sleep(100);
  if (buy && buy.textContent !== lmT('misc.page.buy')) fail.push('BUY did not return to ' + (prev || 'en'));
  return { fail: fail, info: info };
})()
