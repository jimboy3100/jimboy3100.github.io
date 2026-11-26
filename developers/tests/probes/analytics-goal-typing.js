// Analytics > Objectives: a language change while an objective is being typed keeps the type, the
// number and the focus in the field (the tab is drawn again in the new language; until 3.693 the
// number and the focus were lost). Adding an objective still empties the field. Puts the language
// and the stored objectives back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !window.LMAnalytics; w++) await sleep(250);
  var A = window.LMAnalytics, L = window.LMi18n;
  if (!A) return { skip: 'LMAnalytics missing' };
  if (!L) return { fail: ['LMi18n missing'], info: info };
  var setLang = function (n) { return new Promise(function (r) { L.setLang(n, { save: false }, function () { r(); }); setTimeout(r, 8000); }); };
  var prev = L.lang(), saved = null;
  try { saved = localStorage.getItem('lmAnalyticsGoals'); } catch (e) { }
  var $id = function (i) { return document.getElementById(i); };
  try {
    A.open('goals');
    await sleep(300);
    var type = $id('lm-analytics-goal-type'), inp = $id('lm-analytics-goal-target');
    if (!type || !inp) return { fail: ['no objective form'], info: info };
    type.value = 'survive';
    type.dispatchEvent(new Event('change', { bubbles: true }));
    inp.focus();
    inp.value = '42';
    var addText = $id('lm-analytics-goal-add').textContent;
    await setLang(prev === 'el' ? 'en' : 'el');
    await sleep(200);
    type = $id('lm-analytics-goal-type'); inp = $id('lm-analytics-goal-target');
    info.after = [type && type.value, inp && inp.value, document.activeElement && document.activeElement.id, $id('lm-analytics-goal-add') && $id('lm-analytics-goal-add').textContent];
    if (!type || !inp) fail.push('no objective form after the language change');
    else {
      if ($id('lm-analytics-goal-add').textContent === addText) fail.push('the tab was not drawn in the new language');
      if (type.value !== 'survive') fail.push('the objective type went back to ' + type.value);
      if (inp.value !== '42') fail.push('the typed number was lost (' + JSON.stringify(inp.value) + ')');
      if (document.activeElement !== inp) fail.push('the focus left the number field');
      if (inp.style.display === 'none') fail.push('the number field is hidden');
      /* Add: the objective goes in and the field is empty again */
      $id('lm-analytics-goal-add').click();
      await sleep(300);
      var g = null;
      try { g = JSON.parse(localStorage.getItem('lmAnalyticsGoals') || 'null'); } catch (e) { }
      var c = g && g.custom || [];
      info.added = c.length && c[c.length - 1];
      if (!c.length || c[c.length - 1].type !== 'survive') fail.push('Add did not add the objective');
      if ($id('lm-analytics-goal-target') && $id('lm-analytics-goal-target').value !== '') fail.push('after Add the field kept the number');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { A.close(); } catch (e) { }
    await setLang(prev || 'en');
    try { if (saved == null) localStorage.removeItem('lmAnalyticsGoals'); else localStorage.setItem('lmAnalyticsGoals', saved); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
