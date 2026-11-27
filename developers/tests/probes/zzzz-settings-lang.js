// Choose Language renames the Settings tab at once: every switch, slider and section heading that shows
// its own setting's name in English shows it in Greek after a switch to Greek, and in French after a
// switch from Greek to French (they kept the language they were built in until a reload).
// Runs after zzzz-i18n; switches back to English and restores the saved choice afterwards.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var wait = async function (cond, ms) { var t0 = Date.now(); while (!cond() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return cond(); };
  var L = window.LMi18n;
  if (!L || typeof changeModLanguage !== 'function' || !window.textLanguage) return { fail: ['LMi18n / changeModLanguage / textLanguage'], info: info };
  var saved = null;
  try { saved = localStorage.getItem('languagemod'); } catch (e) { }
  var sel = document.getElementById('legendlanguages');
  var setLang = async function (num, code) {
    if (sel) { $(sel).val(String(num)); changeModLanguage(true); } else L.setLang(num);
    var ok = await wait(function () { return L.lang() === code && textLanguage.showMass === L.prefixed('settings.', code).showMass; }, 10000);
    await new Promise(function (r) { setTimeout(r, 500); });
    return ok;
  };
  var norm = function (s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').replace(/:\s*$/, '').trim(); };
  var firstText = function (el) { for (var n = el.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && /\S/.test(n.nodeValue)) return n.nodeValue; return ''; };
  /* the rows: [element whose first text is the name, setting key] */
  var rows = function () {
    var out = [];
    $('#og-options > .options-box').each(function () {
      var h = this.querySelector('h5');
      if (h) out.push([h, h.getAttribute('data-lm-key') || '']);
      $(this).children('label').each(function () {
        var f = this.querySelector('input[type="checkbox"][id]');
        if (f && !this.hasAttribute('data-i18n')) out.push([this, f.id]);
      });
    });
    $('#og-options .slider-box').each(function () {
      var t = this.querySelector('.value-label'), f = this.querySelector('input[id$="-slider"]');
      if (t && f) out.push([t, f.id.replace(/-slider$/, '')]);
    });
    return out;
  };
  if (L.lang() !== 'en') need('English first', await setLang(1, 'en'));
  /* rows that show their own name in English (a module may name a row its own way: not checked) */
  var own = rows().filter(function (r) { var s = textLanguage[r[1]]; return r[1] && typeof s === 'string' && s && !/</.test(s) && norm(firstText(r[0])) === norm(s); });
  info.rows = own.length;
  info.headings = own.filter(function (r) { return r[0].tagName === 'H5'; }).length;
  need('Settings rows found (' + own.length + ', headings ' + info.headings + ')', own.length > 40 && info.headings > 5);
  var check = function (tag, re) {
    var wrong = own.filter(function (r) { return norm(firstText(r[0])) !== norm(textLanguage[r[1]]); })
      .map(function (r) { return r[1] + ': ' + norm(firstText(r[0])).slice(0, 24); });
    info[tag] = wrong.length + ' wrong' + (wrong.length ? ' (' + wrong.slice(0, 4).join(', ') + ')' : '');
    need(tag + ': every Settings row in the new language (' + info[tag] + ')', wrong.length === 0 && re.test(textLanguage.showMass));
  };
  need('switched to Greek', await setLang(2, 'el'));
  check('el', /[\u0370-\u03ff]/);
  need('switched to French', await setLang(5, 'fr'));
  check('fr', /^[^\u0370-\u03ff]*$/);
  need('back to English', await setLang(1, 'en'));
  check('en', /^[^\u0370-\u03ff]*$/);
  window.languagemod = saved;
  try { if (saved == null) localStorage.removeItem('languagemod'); else localStorage.setItem('languagemod', saved); } catch (e) { }
  return { fail: fail, info: info };
})()
