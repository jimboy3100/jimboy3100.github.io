// The Command Centre opened with a real Ctrl+K over another window that closes on Esc (Custom macros,
// the Gamepad window): a real Esc in its search box closes the Command Centre only, the next Esc the
// window under it. Until 3.693 the window under it took the Esc and closed, and the Command Centre
// stayed open. Everything is closed after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (window.matchMedia && matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) return { skip: 'phone' };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  for (var w0 = 0; w0 < 60 && !(window.LMCommandCentre && typeof window.lmMacroEditor === 'function' && window.hotkeysCommand); w0++) await sleep(250);
  var CC = window.LMCommandCentre, hc = window.hotkeysCommand;
  if (!CC || !CC.open || typeof window.lmMacroEditor !== 'function') return { fail: ['Command Centre or macro editor missing'] };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'ce' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var esc = function () { return send({ type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }); };
  var ctrlK = async function () {
    if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
    await send({ type: 'keydown', key: 'Control', code: 'ControlLeft', keyCode: 17, ctrl: true });
    await send({ type: 'key', key: 'k', code: 'KeyK', keyCode: 75, ctrl: true });
    await send({ type: 'keyup', key: 'Control', code: 'ControlLeft', keyCode: 17 });
    await sleep(250);
  };
  var wins = [
    { name: 'Custom macros', open: function () { lmMacroEditor('open'); }, isOpen: function () { return !!(window.LMMacroEditor && LMMacroEditor.isOpen()); }, close: function () { if (window.LMMacroEditor) LMMacroEditor.close(); } },
    { name: 'Gamepad', open: function () { hc['hk-gamepadWindow'].keyDown(); }, isOpen: function () { return !!(window.LMGamepadUI && LMGamepadUI.isOpen && LMGamepadUI.isOpen()); }, close: function () { if (window.LMGamepadUI && LMGamepadUI.close) LMGamepadUI.close(); } }
  ];
  for (var i = 0; i < wins.length; i++) {
    var wn = wins[i], r = {};
    try {
      if (CC.isOpen()) CC.close();
      wn.open();
      for (var w = 0; w < 40 && !wn.isOpen(); w++) await sleep(150);
      if (!wn.isOpen()) { info[wn.name] = 'did not open'; continue; }
      await ctrlK();
      r.cc = CC.isOpen();
      if (!r.cc) { CC.open(); await sleep(150); }
      var q = document.getElementById('lm-cc-q');
      if (q) q.focus();
      await esc();
      await sleep(200);
      r.afterEsc1 = { cc: CC.isOpen(), win: wn.isOpen() };
      if (CC.isOpen() || !wn.isOpen()) fail.push(wn.name + ': Esc in the Command Centre over it: ' + JSON.stringify(r.afterEsc1));
      if (CC.isOpen()) CC.close();
      if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
      await esc();
      await sleep(200);
      r.afterEsc2 = wn.isOpen();
      if (wn.isOpen()) fail.push(wn.name + ': the second Esc did not close it');
    } catch (e) { fail.push(wn.name + ': ' + e); }
    info[wn.name] = r;
    try { if (CC.isOpen()) CC.close(); } catch (e) { }
    try { if (wn.isOpen()) wn.close(); } catch (e) { }
  }
  /* the Esc presses must not leave the menu open over the next probes */
  return { fail: fail, info: info };
})()
