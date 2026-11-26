// Discover window, real input: a server type chosen with the keyboard in "This server" (Arrow Down
// on the list) shows that type and keeps the focus on the list, and Esc then closes the window;
// after a click (mouse) or tap (phone) on the window's text Esc closes it too. Until 3.695 the
// list was drawn again with a new select and the focus fell to the page (as after a click on
// text), so Esc left the window open and the keys went to the game.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 40 && !(window.LMDiscovery && LMDiscovery.open); w++) await sleep(250);
  var DC = window.LMDiscovery;
  if (!DC || !DC.open) return { fail: ['LMDiscovery missing'], info: info };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'dce' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 200); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var press = function (el) {
    var r = el.getBoundingClientRect();
    return send({ type: mobile ? 'tap' : 'click', x: Math.round(r.left + Math.min(20, r.width / 2)), y: Math.round(r.top + r.height / 2) });
  };
  var esc = function () { return send({ type: 'key', key: 'Escape', code: 'Escape', keyCode: 27 }); };
  var root = function () { return document.getElementById('lm-dc'); };
  var stored = null;
  try { stored = localStorage.getItem('lmDiscover'); } catch (e) { }
  var wasOpen = DC.isOpen();
  try {
    DC.open('server');
    await sleep(200);
    var sel = document.getElementById('lm-dc-type');
    if (!sel) return { fail: ['no server type list'], info: info };
    var v0 = sel.value;
    sel.focus();
    await send({ type: 'key', key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 });
    sel = document.getElementById('lm-dc-type');
    info.type = [v0, sel && sel.value];
    if (!sel || sel.value === v0) fail.push('Arrow Down did not choose another server type');
    var ae = document.activeElement;
    info.focus = ae ? ae.tagName + (ae.id ? '#' + ae.id : '') : 'none';
    if (!(ae && root() && root().contains(ae))) fail.push('the focus left the window after the type was chosen (' + info.focus + ')');
    await esc();
    if (DC.isOpen()) { fail.push('Esc did not close the window after a server type was chosen'); DC.close(); }
    /* a click or tap on the window's text, then Esc */
    DC.open('features');
    await sleep(200);
    var intro = root() && root().querySelector('.lm-dc-intro');
    if (!intro) fail.push('no intro text');
    else {
      await press(intro);
      ae = document.activeElement;
      info.focusText = ae ? ae.tagName + (ae.id ? '#' + ae.id : '') : 'none';
      await esc();
      if (DC.isOpen()) { fail.push('Esc did not close the window after a ' + (mobile ? 'tap' : 'click') + ' on its text (focus ' + info.focusText + ')'); DC.close(); }
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    if (DC.isOpen() && !wasOpen) DC.close();
    try { if (stored == null) localStorage.removeItem('lmDiscover'); else localStorage.setItem('lmDiscover', stored); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
