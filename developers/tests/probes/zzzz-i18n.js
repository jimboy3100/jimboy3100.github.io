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
  var saved = null;
  try { saved = localStorage.getItem('languagemod'); } catch (e) { }
  info.start = L.lang();
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
  try { if (saved == null) localStorage.removeItem('languagemod'); else localStorage.setItem('languagemod', saved); } catch (e) { }
  window.languagemod = saved;
  return { fail: fail, info: info };
})()
