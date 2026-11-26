// Custom macros window with real clicks and typing: a macro is built (+ split, + wait, + feed), the
// split count is typed, the macro is renamed, and the step change right after the rename (deleting the
// wait step, then moving a step) is kept in the window and in storage, and is there again when the
// window opens again. Until 3.692 the first step change after a rename was made on an old copy of the
// macro and lost. Stored macros are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  if (typeof window.lmMacroEditor !== 'function') return { fail: ['lmMacroEditor missing'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'me' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var click = async function (el, what) {
    if (!el) { fail.push(what + ': not found'); return; }
    var r = el.getBoundingClientRect();
    await send({ type: 'click', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
    await sleep(150);
  };
  var type = async function (txt) {
    for (var i = 0; i < txt.length; i++) {
      var c = txt.charAt(i), up = c.toUpperCase();
      await send({ type: 'key', key: c, code: /[0-9]/.test(c) ? 'Digit' + c : 'Key' + up, keyCode: up.charCodeAt(0), text: c });
    }
  };
  var q = function (s) { return document.querySelector('#lm-me-p ' + s); };
  var stored = function () { try { var o = JSON.parse(localStorage.getItem('lmCustomMacros') || 'null'); return o && o.slots && o.slots[2]; } catch (e) { return null; } };
  var raw = null;
  try { raw = localStorage.getItem('lmCustomMacros'); } catch (e) { }
  try {
    lmMacroEditor('load');
    for (var w = 0; w < 40 && !window.LMMacroEditor; w++) await sleep(250);
    var ME = window.LMMacroEditor;
    if (!ME) return { fail: ['macro editor did not load'] };
    /* slot 3, empty for the test */
    ME.setMacro(3, { name: '', steps: [] });
    ME.open(3);
    await sleep(200);
    await click(q('.lm-me-add-split'), '+ split');
    await click(q('.lm-me-add-wait'), '+ wait');
    await click(q('.lm-me-add-feed'), '+ feed');
    var num = q('.lm-me-s[data-i="0"] input[type=number]');
    await click(num, 'split count');
    if (num) num.select();
    await type('3');
    /* the rename: typed, then the click on the wait step's delete button ends it */
    var nm = document.getElementById('lm-me-name');
    await click(nm, 'name field');
    if (nm) nm.select();
    await type('combo');
    await click(q('.lm-me-s[data-i="1"] .lm-me-b.warn'), 'delete of step 2');
    var s1 = stored();
    info.afterDelete = JSON.stringify(s1);
    var rows = document.querySelectorAll('#lm-me-p .lm-me-s').length;
    if (!s1 || s1.name !== 'combo') fail.push('the new name is not stored: ' + JSON.stringify(s1));
    if (!s1 || JSON.stringify(s1.steps) !== JSON.stringify([{ a: 'split', n: 3 }, { a: 'feed', n: 1 }])) fail.push('deleting a step right after a rename was lost: ' + JSON.stringify(s1 && s1.steps));
    if (rows !== 2) fail.push('the window shows ' + rows + ' steps after the delete');
    /* a second rename, then a move */
    await click(nm, 'name field');
    if (nm) nm.select();
    await type('combo2');
    await click(q('.lm-me-s[data-i="1"] .lm-me-b[aria-label]:not(.warn)'), 'up of step 2');
    var s2 = stored();
    info.afterMove = JSON.stringify(s2);
    if (!s2 || s2.name !== 'combo2' || JSON.stringify(s2.steps) !== JSON.stringify([{ a: 'feed', n: 1 }, { a: 'split', n: 3 }])) fail.push('moving a step right after a rename was lost: ' + JSON.stringify(s2));
    /* opened again: what was stored */
    ME.close();
    ME.open(3);
    await sleep(150);
    info.reopened = [document.getElementById('lm-me-name').value, document.querySelectorAll('#lm-me-p .lm-me-s').length];
    if (info.reopened[0] !== 'combo2' || info.reopened[1] !== 2) fail.push('opened again: ' + JSON.stringify(info.reopened));
  } catch (e) { fail.push('macro editor: ' + e); }
  try { if (window.LMMacroEditor) LMMacroEditor.close(); } catch (e) { }
  try { if (raw == null) localStorage.removeItem('lmCustomMacros'); else localStorage.setItem('lmCustomMacros', raw); } catch (e) { }
  /* the module's copy too (it reads storage when the window opens) */
  try { if (window.LMMacroEditor) { LMMacroEditor.open(); LMMacroEditor.close(); } } catch (e) { }
  return { fail: fail, info: info };
})()
