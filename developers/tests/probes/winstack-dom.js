// Window stacking (ogario/modules/winstack.js) in a real DOM, with real clicks, taps and keys.
// Part 1 loads the module's own source into a clean iframe over the page and builds windows there:
// a window open before the module loaded is stacked; a window hidden with the hidden attribute
// and shown again comes in front; a window and its backdrop move together and the window stays
// usable after real clicks and a resize; an unrelated empty full-screen layer just before a window
// is not taken for its backdrop (it kept its z-index); a z-index the window's own module sets while
// it is stacked is kept (not replaced by the value read when it was stacked); a real Tab into a
// window behind another brings it in front; a hidden window is never raised.
// Part 2 uses the real windows: Performance diagnostics and the room window stack by real
// clicks; a menu page opened over them (the User Scripts route) is in front; a real Esc then
// brings the windows back in front instead of closing the room unseen under the menu; the
// toasts, Command Centre and gamepad window stay above; nothing keeps a raised z-index after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!window.LMWinStack) return { fail: ['LMWinStack missing (ogario/modules/winstack.js not loaded)'] };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'] };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'ws' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 15000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  /* the harness answers once the input is sent, but a busy page can handle a tap only at its next
   * frame (seconds apart at a low frame rate): wait until the page has seen it (its up or click,
   * after the down that raises a window; a cancel when the busy page answered late), at most 10 s;
   * late ones are counted */
  var seen = function (w, types) {
    var o = { got: false };
    o.p = new Promise(function (res) {
      var fin = function () { if (o.got) return; o.got = true; clearTimeout(t); types.forEach(function (ty) { w.removeEventListener(ty, fin, true); }); res(true); };
      var t = setTimeout(function () { types.forEach(function (ty) { w.removeEventListener(ty, fin, true); }); res(false); }, 10000);
      types.forEach(function (ty) { w.addEventListener(ty, fin, true); });
    });
    return o;
  };
  var handled = async function (o) {
    if (!o.got) info.lateInput = (info.lateInput || 0) + 1;
    if (!(await o.p)) info.inputUnseen = (info.inputUnseen || 0) + 1;
  };
  /* a busy machine can be slow to answer: one more try, counted */
  var click = async function (x, y, w) {
    var o = seen(w || window, ['pointerup', 'pointercancel', 'touchend', 'touchcancel', 'mouseup', 'click']);
    var q = function () { return send({ type: mobile ? 'tap' : 'click', x: Math.round(x), y: Math.round(y) }); };
    if (!(await q())) { info.inputRetries = (info.inputRetries || 0) + 1; await q(); }
    await handled(o);
  };
  var key = async function (k, kc, w) {
    var o = seen(w || window, ['keyup']);
    await send({ type: 'key', key: k, code: k, keyCode: kc });
    await handled(o);
  };
  var src = '';
  try { src = await (await fetch('https://www.legendmod.ml/ogario/modules/winstack.js?wsdom=' + Date.now())).text(); } catch (e) { }
  if (src.indexOf('LMWinStack') < 0) return { fail: ['could not read ogario/modules/winstack.js'] };

  /* ── Part 1: a clean document with the module ── */
  var harness = async function () {
    var f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;left:0;top:0;width:800px;height:400px;border:0;z-index:2147483647;background:#fff;';
    document.documentElement.appendChild(f);
    var d = f.contentDocument, W = f.contentWindow;
    d.open();
    d.write('<!doctype html><html><head><style>body{margin:0}.r{position:fixed}.p{position:absolute;left:0;top:0;right:0;bottom:0;background:#468}</style></head><body></body></html>');
    d.close();
    await sleep(30);
    var h = {
      f: f, d: d, W: W,
      load: function () { var s = d.createElement('script'); s.textContent = src; d.head.appendChild(s); },
      win: function (id, z, x, y, w, hh) {
        var r = d.createElement('div');
        r.id = id; r.className = 'r';
        r.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + hh + 'px;z-index:' + z + ';';
        var p = d.createElement('div');
        p.className = 'p lm-modal-container';
        p.innerHTML = '<input id="' + id + '-in" style="margin:4px;width:60px">';
        r.appendChild(p);
        return r;
      },
      add: async function (el) { d.body.appendChild(el); await sleep(40); return el; },
      /* the window drawn at a point */
      at: function (x, y) { var e = d.elementFromPoint(x, y); while (e && e.parentElement && e.parentElement !== d.body) e = e.parentElement; return e ? e.id || e.tagName : null; },
      z: function (el) { return W.getComputedStyle(el).zIndex; },
      done: function () { f.remove(); }
    };
    return h;
  };
  var h = null, A, B, C;
  try {
    /* a window already open when the module loads */
    h = await harness();
    A = h.win('A', 999992, 50, 50, 300, 200);
    h.d.body.appendChild(A);
    h.load();
    B = await h.add(h.win('B', 999990, 150, 100, 300, 200));
    info.before = h.at(200, 150) + ' ' + h.z(A) + '/' + h.z(B);
    if (h.at(200, 150) !== 'B') fail.push('a window opened over one open before the module loaded opened behind it (' + info.before + ')');
    h.done();

    /* hidden with the hidden attribute, shown again: in front */
    h = await harness(); h.load();
    A = await h.add(h.win('A', 999990, 50, 50, 300, 200));
    B = await h.add(h.win('B', 999992, 150, 100, 300, 200));
    A.hidden = true; await sleep(40);
    if (h.z(A) !== '999990' && A.style.zIndex) fail.push('a hidden window kept a changed z-index (' + A.style.zIndex + ')');
    A.hidden = false; await sleep(40);
    if (h.at(200, 150) !== 'A') fail.push('a window shown again (hidden attribute) stayed behind (' + h.at(200, 150) + ')');
    A.style.display = 'none'; await sleep(40); A.style.display = ''; await sleep(40);
    if (h.at(200, 150) !== 'A') fail.push('a window shown again (display) stayed behind (' + h.at(200, 150) + ')');
    h.done();

    /* the window's own module changes its z-index while it is stacked */
    h = await harness(); h.load();
    A = await h.add(h.win('A', 999992, 50, 50, 300, 200));
    B = await h.add(h.win('B', 999990, 150, 100, 300, 200));
    A.style.zIndex = '999970'; await sleep(40);
    B.remove(); await sleep(40);
    info.ownZ = h.z(A);
    if (h.z(A) !== '999970') fail.push('a z-index set by the window\'s module was replaced by an old one (' + h.z(A) + ', wanted 999970)');
    B = await h.add(h.win('B', 999990, 150, 100, 300, 200));
    if (+h.z(A) > 999970) fail.push('the window went above the z-index its module set (' + h.z(A) + ')');
    B.remove(); await sleep(40);
    if (h.z(A) !== '999970') fail.push('the z-index set by the module was not kept after the next window closed (' + h.z(A) + ')');
    h.done();

    /* an empty full-screen layer just before a window, above it: not the window's backdrop */
    h = await harness(); h.load();
    var E = h.d.createElement('div');
    E.id = 'E';
    E.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:999999;pointer-events:none;';
    h.d.body.appendChild(E);
    A = await h.add(h.win('A', 999992, 50, 50, 300, 200));
    B = await h.add(h.win('B', 999990, 150, 100, 300, 200));
    if (h.z(E) !== '999999') fail.push('an unrelated full-screen layer was taken for a window\'s backdrop and moved (' + h.z(E) + ')');
    h.done();

    /* a window with its backdrop, real clicks, a resize */
    h = await harness(); h.load();
    A = await h.add(h.win('A', 999990, 30, 40, 240, 200));
    var BD = h.d.createElement('div');
    BD.id = 'BD';
    BD.style.cssText = 'position:fixed;left:0;top:0;right:0;bottom:0;z-index:999991;background:rgba(0,0,0,.4);';
    h.d.body.appendChild(BD);
    B = await h.add(h.win('B', 999992, 300, 60, 220, 200));
    if (h.at(100, 100) !== 'BD') fail.push('the backdrop does not cover the older window (' + h.at(100, 100) + ')');
    C = await h.add(h.win('C', 999990, 480, 160, 260, 200));
    if (h.at(500, 200) !== 'C') fail.push('a window opened over one with a backdrop opened behind (' + h.at(500, 200) + ')');
    if (h.at(400, 100) !== 'B') fail.push('the window went under its own backdrop (' + h.at(400, 100) + ')');
    await click(400, 100, h.W); await sleep(100);
    info.pair = [h.z(A), h.z(BD), h.z(B), h.z(C)].join('/');
    if (h.at(500, 200) !== 'B') fail.push('a real ' + (mobile ? 'tap' : 'click') + ' did not bring the window with a backdrop in front (' + h.at(500, 200) + ')');
    if (!(+h.z(BD) <= +h.z(B))) fail.push('the backdrop went above its window (' + info.pair + ')');
    /* in front, its backdrop covers the other windows again (a tap there is the backdrop's) */
    if (h.at(700, 300) !== 'BD') fail.push('the window in front no longer has its backdrop over the others (' + h.at(700, 300) + ')');
    h.f.style.width = '760px'; h.f.style.height = '380px'; await sleep(100);
    await click(310, 250, h.W); await sleep(100);
    if (h.at(400, 100) !== 'B') fail.push('after a resize the window went under its backdrop (' + h.at(400, 100) + ')');
    /* closed with its backdrop: the others are back to their own values and usable */
    BD.remove(); B.remove(); await sleep(60);
    await click(700, 300, h.W); await sleep(100);
    info.closedPair = [h.z(A), h.z(C)].join('/');
    if (h.at(700, 300) !== 'C') fail.push('after the window with a backdrop closed a real ' + (mobile ? 'tap' : 'click') + ' did not reach the window (' + h.at(700, 300) + ')');
    if (!(+h.z(C) > +h.z(A)) || +h.z(C) > 999990) fail.push('after the window with a backdrop closed the other two are not in their order (' + info.closedPair + ')');
    C.remove(); await sleep(60);
    if (h.z(A) !== '999990' || A.style.getPropertyPriority('z-index')) fail.push('the last window open is not back to its own value (' + h.z(A) + ')');
    h.done();

    /* keyboard: a real Tab into a window behind another one brings it in front */
    h = await harness(); h.load();
    var S = h.d.createElement('button');
    S.id = 'S'; S.textContent = 's';
    S.style.cssText = 'position:fixed;left:700px;top:360px;';
    h.d.body.appendChild(S);
    A = await h.add(h.win('A', 999992, 50, 50, 300, 200));
    B = await h.add(h.win('B', 999992, 30, 30, 300, 200));
    h.W.focus(); S.focus(); await sleep(30);
    info.tab0 = h.d.activeElement && h.d.activeElement.id;
    await key('Tab', 9, h.W); await sleep(80);
    info.tab = (h.d.activeElement && h.d.activeElement.id) + ' ' + h.at(200, 150);
    if (h.d.activeElement !== h.d.getElementById('A-in')) fail.push('the real Tab did not reach the window (' + info.tab + ')');
    else if (h.at(200, 150) !== 'A') fail.push('a real Tab into a window behind another left it behind (' + info.tab + ')');
    /* a hidden window is never raised (it would catch input unseen) */
    B.style.display = 'none'; await sleep(40);
    if (B.style.zIndex && B.style.getPropertyPriority('z-index')) fail.push('a hidden window kept a raised z-index');
    h.done();
  } catch (e) { fail.push('dom harness: ' + String(e && e.stack || e).slice(0, 300)); try { if (h) h.done(); } catch (e2) { } }

  /* ── Part 2: the real windows ── */
  if (!(window.LMPerf && window.LMPerf.openDiag && typeof window._lmRoomOpen === 'function' && window.LMPlugins && window.application)) return { fail: fail, info: info, skip2: 'windows missing' };
  var ov = document.getElementById('overlays');
  var shown = function (el) { return !!(el && getComputedStyle(el).display !== 'none' && el.getClientRects().length); };
  var menuWas = shown(ov);
  var rootAt = function (x, y) { var e = document.elementFromPoint(x, y); while (e && e.parentElement && e.parentElement !== document.body) e = e.parentElement; return e ? e.id || e.tagName : null; };
  var mid = function (el) { var r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + Math.min(30, r.height / 2)]; };
  var room = function () { return document.getElementById('lm-room-modal'); };
  try {
    application.hideMenu(); await sleep(300);
    LMPerf.openDiag(); await sleep(300);
    _lmRoomOpen('create'); await sleep(400);
    var pd = document.getElementById('lm-perf-diag'), rm = room();
    if (!pd || !rm) fail.push('Performance diagnostics or the room window did not open');
    else {
      /* a real click on Performance diagnostics where the room is not */
      var pr = pd.getBoundingClientRect(), rr = rm.getBoundingClientRect();
      var px = pr.left + 12, py = pr.top + 12;
      if (px > rr.left && px < rr.right && py > rr.top && py < rr.bottom) { px = pr.left + 12; py = pr.bottom - 12; }
      var stackIds = function () { return LMWinStack._stack().map(function (e) { return e.id; }).join(','); };
      info.pdTap = rootAt(px, py) + ' ' + stackIds();
      await click(px, py); await sleep(150);
      if (!/lm-perf-diag$/.test(stackIds())) fail.push('a real ' + (mobile ? 'tap' : 'click') + ' on Performance diagnostics did not bring it in front (' + stackIds() + ')');
      var rp = mid(rm);
      await click(rp[0], rp[1]); await sleep(150);
      if (!/lm-room-modal$/.test(stackIds())) fail.push('a real ' + (mobile ? 'tap' : 'click') + ' on the room window did not bring it in front (' + stackIds() + ')');
      /* a menu page opened over them (User Scripts, as from its hotkey) */
      LMPlugins.open('plugins'); await sleep(500);
      info.menuFront = rootAt(rp[0], rp[1]) + ' ' + getComputedStyle(rm).zIndex;
      if (rootAt(rp[0], rp[1]) !== 'overlays') fail.push('User Scripts opened behind the room window (' + info.menuFront + ')');
      /* a real Esc: the windows come back in front; the room is not closed unseen */
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      await key('Escape', 27); await sleep(300);
      info.afterEsc = (room() ? rootAt(rp[0], rp[1]) + ' ' + getComputedStyle(room()).zIndex : 'room closed') + ' menu=' + shown(ov);
      if (!room()) fail.push('Esc closed the room window unseen under the menu page');
      else if (rootAt(rp[0], rp[1]) !== 'lm-room-modal') fail.push('after Esc the room window stayed under the menu (' + info.afterEsc + ')');
      if (!shown(ov)) fail.push('Esc closed the menu');
      /* the next Esc is the room's own again (it is in front) */
      if (room()) {
        await key('Escape', 27); await sleep(300);
        if (room()) fail.push('Esc did not close the room window in front');
      }
      try { LMPlugins.close(); } catch (e) { }
      application.hideMenu(); await sleep(400);
      _lmRoomOpen('join'); await sleep(400);
      rm = room();
      /* the toasts, the Command Centre and the gamepad window stay above the stacked windows */
      try { toastr.info('winstack probe'); } catch (e) { }
      await sleep(400);
      var tc = document.getElementById('toast-container');
      if (tc && +getComputedStyle(tc).zIndex <= +getComputedStyle(rm).zIndex) fail.push('toasts below a window');
      if (window.LMCommandCentre && LMCommandCentre.open) {
        LMCommandCentre.open(); await sleep(300);
        rp = mid(rm);
        if (rootAt(rp[0], rp[1]) !== 'lm-cc') fail.push('Command Centre below the windows (' + rootAt(rp[0], rp[1]) + ')');
        LMCommandCentre.close(); await sleep(200);
      }
      if (window.LMGamepad && LMGamepad.openWindow) {
        LMGamepad.openWindow();
        for (var i = 0; i < 30 && !document.getElementById('lm-gp-modal'); i++) await sleep(100);
        await sleep(200);
        var gm = document.getElementById('lm-gp-modal');
        if (gm) {
          var g = mid(gm);
          if (rootAt(g[0], g[1]) !== 'lm-gp-modal') fail.push('the gamepad window below the windows (' + rootAt(g[0], g[1]) + ')');
          if (rootAt(rp[0], rp[1]) !== 'lm-gp-modal' && rootAt(rp[0], rp[1]) !== 'lm-gp-backdrop') fail.push('the gamepad backdrop below the windows');
        }
        if (window.LMGamepadUI) LMGamepadUI.close();
        await sleep(200);
      }
    }
  } catch (e) { fail.push('real windows: ' + String(e && e.stack || e).slice(0, 300)); }
  finally {
    try { if (room() && room()._lmClose) room()._lmClose(true); } catch (e) { }
    try { LMPerf.closeDiag(); } catch (e) { }
    try { LMPlugins.close(); } catch (e) { }
    try { if (menuWas) application.showMenu(); else application.hideMenu(); } catch (e) { }
    await sleep(300);
  }
  Array.prototype.forEach.call(document.body.children, function (el) {
    if (el._lmWsZ || (/^99999\d$|^9[0-9]$/.test(el.style.zIndex) && el.style.getPropertyPriority('z-index') === 'important')) fail.push((el.id || el.className) + ' kept a raised z-index after closing (' + el.style.zIndex + ')');
  });
  return { fail: fail, info: info };
})()
