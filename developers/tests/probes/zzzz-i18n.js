// Translations: switching Choose Language to Greek updates the menus at once (lmT, textLanguage, the old
// language-pack globals, the language pack handler, agar.io's texts), few keys are missing; Arabic is rtl.
// Runs last: it switches back to English and forgets the choice afterwards.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var wait = async function (cond, ms) { var t0 = Date.now(); while (!cond() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return cond(); };
  var L = window.LMi18n;
  need('LMi18n', !!L && typeof L.setLang === 'function');
  if (!L) return { fail: fail, info: info };
  /* the one-time language window: the smoke test marks it as asked (developers/tests/i18n-firstrun.js
   * tests a real first visit), so it must not be there; opened here on purpose to check it */
  need('first-run chooser stays away once asked', !document.getElementById('lm-lang-first') && localStorage.getItem('lmLangAsked') === '1');
  need('chooser functions', typeof _lmShowLanguageChooser === 'function' && typeof _lmFirstLanguageChooser === 'function');
  if (typeof _lmShowLanguageChooser === 'function') _lmShowLanguageChooser();
  var first = document.getElementById('lm-lang-first');
  need('chooser opens', !!first);
  if (first) {
    var fsel = first.querySelector('select.lm-lang-select');
    need('chooser: supported languages, current one picked', !!fsel && fsel.options.length === L.codes.length && fsel.value === L.num());
    var r = first.querySelector('.modal-content').getBoundingClientRect();
    info.chooser = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
    need('chooser fits the screen', r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight);
    var hb = first.querySelector('.modal-header').getBoundingClientRect(), cb = first.querySelector('.lm-lang-first-close').getBoundingClientRect();
    need('chooser: close button on the right', cb.left > hb.left + hb.width / 2);
    need('chooser: coloured OK button', /btn-success/.test(first.querySelector('.lm-lang-first-ok').className));
    /* Esc: keeps the browser's language, not saved, never asked again */
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    need('chooser: Esc closes it', !document.getElementById('lm-lang-first'));
    need('chooser: nothing saved, asked once', localStorage.getItem('languagemod') == null && localStorage.getItem('lmLangAsked') === '1');
    if (typeof _lmFirstLanguageChooser === 'function') _lmFirstLanguageChooser();
    await new Promise(function (r2) { setTimeout(r2, 1500); });
    need('chooser: not again', !document.getElementById('lm-lang-first'));
  }
  var saved = null;
  try { saved = localStorage.getItem('languagemod'); } catch (e) { }
  info.start = L.lang();
  /* the smoke test can start the mod in another browser language (SMOKE_LANG): English first, as the baseline */
  var selEn = document.getElementById('legendlanguages');
  if (info.start !== 'en') {
    if (selEn) { $(selEn).val('1'); changeModLanguage(false); } else L.setLang(1);
    need('English baseline', await wait(function () { return L.lang() === 'en'; }, 10000));
    await new Promise(function (r) { setTimeout(r, 500); });
  }
  var english = { leagues: lmT('leagues'), showMass: textLanguage.showMass, cog: window.Languageletter2 };
  /* the player's way: the Choose Language list */
  var sel = document.getElementById('legendlanguages');
  need('#legendlanguages', !!sel);
  if (sel) { $(sel).val('2'); changeModLanguage(true); }
  else L.setLang(2);
  need('switched to Greek', await wait(function () { return L.lang() === 'el' && typeof window.lmApplyLanguagePack === 'function'; }, 10000));
  await new Promise(function (r) { setTimeout(r, 500); });
  need('lmT Greek', lmT('leagues') !== english.leagues && /[\u0370-\u03ff]/.test(lmT('leagues')));
  need('textLanguage Greek (in place)', textLanguage.showMass !== english.showMass && /[\u0370-\u03ff]/.test(textLanguage.showMass) && window.textLanguage === textLanguage);
  need('old global Languageletter2 Greek', /[\u0370-\u03ff]/.test(String(window.Languageletter2)));
  /* every Theme tab row and hotkey row has its own setting's name (the language pack handler named
   * them by row position: from the first added row on they had the names of other settings) */
  var norm = function (s) { return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').replace(/:\s*$/, '').trim(); };
  var wrong = [];
  $('#theme .color-box, #theme .font-box, #theme .preset-box, #theme .input-box, #theme .slider-box').each(function () {
    var f = $(this).find('input[id], select[id]')[0], t = $(this).find('.title-box, .value-label')[0];
    if (!f || !t || t.hasAttribute('data-i18n')) return;
    var want = textLanguage[f.id.replace(/-slider$/, '')];
    if (typeof want !== 'string' || !want) return;
    var got = norm(t.textContent);
    if (got.indexOf(norm(want)) !== 0) wrong.push(f.id + ': ' + got.slice(0, 30));
  });
  $('#hotkeys-cfg .custom-key-in').each(function () {
    var c = hotkeysCommand[this.id];
    if (!c || c.type === 'command') return;
    var got = norm($(this).closest('.row').find('.key-label').text());
    if (got !== norm(c.label)) wrong.push(this.id + ': ' + got.slice(0, 30));
  });
  info.wrongNames = wrong.length;
  need('Theme and hotkey rows named by their own setting in Greek' + (wrong.length ? ': ' + wrong.slice(0, 4).join(', ') : ''), !wrong.length);
  var cog = $('.ogicon-cog').first();
  need('settings tab tooltip Greek', !cog.length || cog.attr('data-original-title') === window.Languageletter2);
  var play = $('[data-itr="page_play"]').first();
  if (play.length) need('agar.io text Greek', /[\u0370-\u03ff]/.test(play.text()));
  need('languagemod saved', localStorage.getItem('languagemod') === '2');
  var miss = L.missing();
  info.missing = Object.keys(miss).length;
  info.missingKeys = Object.keys(miss).slice(0, 8).join(',');
  /* keys the code asks for that no pack has yet (stage 2 moves their English into the packs) */
  need('few missing keys (' + info.missing + ')', info.missing <= 40);
  /* Arabic: right to left */
  L.setLang(6);
  need('Arabic', await wait(function () { return L.lang() === 'ar'; }, 8000));
  need('Arabic dir rtl', L.dir() === 'rtl' && document.documentElement.getAttribute('lang') === 'ar');
  need('Arabic text', /[\u0600-\u06ff]/.test(lmT('leagues')));
  /* back to how the page started */
  if (sel) { $(sel).val('1'); changeModLanguage(false); } else L.setLang(1);
  await wait(function () { return L.lang() === 'en'; }, 5000);
  need('back to English', lmT('leagues') === english.leagues && textLanguage.showMass === english.showMass);
  /* a run in another browser language goes back to it (not saved, as before the probe) */
  if (info.start !== 'en') { L.setLang(info.start); await wait(function () { return L.lang() === info.start; }, 5000); }
  try { if (saved == null) localStorage.removeItem('languagemod'); else localStorage.setItem('languagemod', saved); } catch (e) { }
  window.languagemod = saved;
  return { fail: fail, info: info };
})()
