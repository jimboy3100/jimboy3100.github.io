// User Scripts window, real input (click on desktop, tap on a phone): Erase script in the editor of
// a slot whose catalogue plugin runs stops the plugin (as turning the slot off does), and the plugin
// installed again runs ONE copy. Until 3.697 the erased plugin kept running until a reload, and
// installed again it ran twice. The copies that run are counted by the toasts of the example
// plugin (Mass milestone toasts) for one event.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 40 && !(window.LMPlugins && document.getElementById('lm-us-bar') && window.LMEvents && window.toastr); w++) await sleep(250);
  if (!window.LMPlugins || !document.getElementById('lm-us-bar')) return { fail: ['the User Scripts window has no plugin list'], info: info };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'per' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 60); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var press = async function (el, tag) {
    if (!el) { fail.push(tag + ': not found'); return false; }
    el.scrollIntoView({ block: 'center' });
    await sleep(50);
    var r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var hit = document.elementFromPoint(x, y);
    if (!hit || !(hit === el || el.contains(hit))) fail.push(tag + ': covered by ' + (hit ? (hit.id || String(hit.className) || hit.nodeName) : 'nothing'));
    return send({ type: mobile ? 'tap' : 'click', x: Math.round(x), y: Math.round(y) });
  };
  var q = function (s) { return document.querySelector(s); };
  var E = window.LMEvents, PID = 'mass-milestones', SKEY = 'lmPluginSettings.' + PID;
  /* the copies that run: each one toasts "Mass 1k!" once for a new life that reaches 1500 */
  var hits = 0, ti0 = toastr.info;
  var copies = function () { hits = 0; E.emit('spawn', {}); E.emit('massUpdate', { mass: 1500 }); return hits; };
  var KEYS = ['Userscript', 'Userscripttexture', 'Userscripttext1', 'UserscriptEnabled'], saved = {};
  for (var n = 1; n <= 5; n++) KEYS.forEach(function (k) { try { saved[k + n] = localStorage.getItem(k + n); } catch (e) { } });
  try { saved[SKEY] = localStorage.getItem(SKEY); localStorage.removeItem(SKEY); } catch (e) { }
  var conf0 = window.confirm, aside = [], wasOpen = LMPlugins.isOpen(), slotN = 0;
  $('.modal.in, .modal[style*="block"]').each(function () { aside.push([this, this.style.display]); this.style.display = 'none'; });
  window.confirm = function () { return true; };
  toastr.info = function (m) { if (/^Mass /.test(String(m))) { hits++; return; } return ti0.apply(this, arguments); };
  try {
    if (LMPlugins.list().every(function (s) { return !s.empty; })) return { skip: 'no free User Scripts slot' };
    LMPlugins.open('catalogue');
    for (w = 0; w < 40 && !q('#lm-us-ext [data-act="install"][data-id="' + PID + '"]'); w++) await sleep(200);
    await press(q('#lm-us-ext [data-act="install"][data-id="' + PID + '"]'), 'Install');
    for (w = 0; w < 40 && !LMPlugins.list().some(function (s) { return s.id === PID && s.registered; }); w++) await sleep(250);
    slotN = (LMPlugins.list().filter(function (s) { return s.id === PID; })[0] || {}).slot || 0;
    if (!slotN) return { fail: fail.concat(['the catalogue plugin was not installed']), info: info };
    info.slot = slotN;
    info.installed = copies();
    if (info.installed !== 1) fail.push('after Install ' + info.installed + ' copies run');
    await press(q('#lm-us-bar button[data-view="plugins"]:not(#lm-us-allslots)'), 'Plugins');
    await sleep(200);
    await press(q('#lm-us-ext [data-act="edit"][data-n="' + slotN + '"]'), 'Edit');
    await sleep(200);
    await press(document.getElementById('EraseScripter'), 'Erase script');
    await sleep(400);
    info.erased = copies();
    info.empty = (LMPlugins.list()[slotN - 1] || {}).empty;
    if (!info.empty) fail.push('Erase script left the slot filled');
    if (info.erased !== 0) fail.push('after Erase script ' + info.erased + ' copies still run');
    /* installed again: one copy */
    await press(q('#lm-us-bar button[data-view="catalogue"]'), 'Catalogue');
    for (w = 0; w < 40 && !q('#lm-us-ext [data-act="install"][data-id="' + PID + '"]:not([disabled])'); w++) await sleep(200);
    await press(q('#lm-us-ext [data-act="install"][data-id="' + PID + '"]'), 'Install again');
    for (w = 0; w < 40 && !LMPlugins.list().some(function (s) { return s.id === PID && s.registered; }); w++) await sleep(250);
    await sleep(400);
    slotN = (LMPlugins.list().filter(function (s) { return s.id === PID; })[0] || {}).slot || slotN;
    info.again = copies();
    if (info.again !== 1) fail.push('installed again after Erase script: ' + info.again + ' copies run');
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    window.confirm = conf0;
    /* the slot erased again (this also stops the plugin), the storage as it was */
    try {
      if (slotN) {
        LMPlugins.setEnabled(slotN, false, true);
        $('#Userscriptpages3').val(String(slotN));
        if (typeof window.userscriptpages === 'function') window.userscriptpages();
        /* a native click: the button's inline handler returns false, so a jQuery trigger skips its listeners */
        var eb = document.getElementById('EraseScripter');
        if (eb) eb.click();
        await sleep(200);
      }
    } catch (e) { }
    toastr.info = ti0;
    for (var k in saved) { try { if (saved[k] == null) localStorage.removeItem(k); else localStorage.setItem(k, saved[k]); } catch (e) { } }
    if (!wasOpen && LMPlugins.isOpen()) LMPlugins.close();
    aside.forEach(function (a) { a[0].style.display = a[1]; });
  }
  return { fail: fail, info: info };
})()
