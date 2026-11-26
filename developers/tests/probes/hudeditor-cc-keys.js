// The Command Centre opened with a real Ctrl+K over the open HUD editor takes its own keys: real
// typing finds "Show grid", the arrow keys move the selection, Enter switches the option and keeps
// both open, Esc closes only the Command Centre. Until 3.693 the editor took every key first: the
// arrows did nothing, Enter closed the editor instead and Esc closed the editor. All put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  for (var w0 = 0; w0 < 60 && !(window.LMHudEditor && window.LMCommandCentre); w0++) await sleep(250);
  var HE = window.LMHudEditor, CC = window.LMCommandCentre, ds = window.defaultmapsettings;
  if (!HE || !CC || !ds || !window.application) return { fail: ['HUD editor, Command Centre or settings missing'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'hc' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var type = async function (txt) {
    for (var i = 0; i < txt.length; i++) {
      var c = txt.charAt(i), up = c.toUpperCase();
      await send(c === ' ' ? { type: 'key', key: ' ', code: 'Space', keyCode: 32, text: ' ' } : { type: 'key', key: c, code: 'Key' + up, keyCode: up.charCodeAt(0), text: c });
    }
  };
  var key = function (k, code, kc) { return send({ type: 'key', key: k, code: code, keyCode: kc }); };
  var selIndex = function () { var r = document.querySelector('#lm-cc .lm-cc-row.sel'); return r ? r.getAttribute('data-i') : ''; };
  var raw = null, grid = ds.showGrid, menuWas = (document.getElementById('overlays') || {}).style;
  menuWas = menuWas && menuWas.display !== 'none';
  try { raw = localStorage.getItem('lmHudLayouts'); } catch (e) { }
  var UI = null;
  try {
    if (CC.isOpen()) CC.close();
    application.hideMenu();
    await sleep(300);
    HE.open();
    for (var w = 0; w < 40 && !(window.LMHudEditorUI && LMHudEditorUI.isOpen()); w++) await sleep(250);
    UI = window.LMHudEditorUI;
    if (!UI || !UI.isOpen()) return { fail: ['the HUD editor did not open'] };
    await sleep(300);
    if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
    await send({ type: 'keydown', key: 'Control', code: 'ControlLeft', keyCode: 17, ctrl: true });
    await send({ type: 'key', key: 'k', code: 'KeyK', keyCode: 75, ctrl: true });
    await send({ type: 'keyup', key: 'Control', code: 'ControlLeft', keyCode: 17 });
    await sleep(300);
    info.ccByCtrlK = CC.isOpen();
    if (!CC.isOpen()) fail.push('Ctrl+K over the HUD editor did not open the Command Centre');
    else {
      await type('show grid');
      await sleep(300);
      var first = document.querySelector('#lm-cc .lm-cc-row[data-i="0"]');
      info.first = first ? first.getAttribute('data-id') : '';
      info.rows = document.querySelectorAll('#lm-cc .lm-cc-row').length;
      if (info.first !== 'opt:showGrid') fail.push('typing "show grid" did not list the Show grid switch first: ' + info.first);
      await key('ArrowDown', 'ArrowDown', 40);
      await sleep(100);
      info.afterDown = selIndex();
      if (info.rows > 1 && info.afterDown !== '1') fail.push('ArrowDown in the Command Centre over the HUD editor did not move the selection (' + info.afterDown + ')');
      await key('ArrowUp', 'ArrowUp', 38);
      await sleep(100);
      await key('Enter', 'Enter', 13);
      await sleep(400);
      info.gridSwitched = ds.showGrid !== grid;
      info.editorAfterEnter = UI.isOpen();
      if (info.first === 'opt:showGrid' && !info.gridSwitched) fail.push('Enter on Show grid did not switch it');
      if (!UI.isOpen()) fail.push('Enter in the Command Centre closed the HUD editor');
      await key('Escape', 'Escape', 27);
      await sleep(300);
      info.ccAfterEsc = CC.isOpen();
      info.editorAfterEsc = UI.isOpen();
      if (CC.isOpen()) fail.push('Esc did not close the Command Centre');
      if (!UI.isOpen()) fail.push('Esc in the Command Centre closed the HUD editor too');
    }
  } catch (e) { fail.push('keys: ' + e); }
  try { if (CC.isOpen()) CC.close(); } catch (e) { }
  try { if (UI && UI.isOpen()) UI.close(false); } catch (e) { }
  if (ds.showGrid !== grid) { var cb = document.getElementById('showGrid'); if (cb && cb.type === 'checkbox') { cb.checked = grid; cb.dispatchEvent(new Event('change', { bubbles: true })); } }
  try { if (raw == null) localStorage.removeItem('lmHudLayouts'); else localStorage.setItem('lmHudLayouts', raw); } catch (e) { }
  if (HE._internal && HE._internal.reset) HE._internal.reset();
  if (menuWas) try { application.showMenu(); } catch (e) { }
  return { fail: fail, info: info };
})()
