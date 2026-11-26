// Hotkeys window: the x next to each key field can be clicked or tapped (the list's scroll bar
// rail lay over it, so a real click scrolled the list and the key stayed bound). A real click on
// one x clears that key; Close puts it back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var keyOf = function (cmd) { for (var k in hotkeys) if (k !== 'spec-messageKey' && hotkeys[k] === cmd) return k; return ''; };
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'hkx' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 5000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); res(true); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  /* wait until the page has seen the click (a busy page handles it late; a tap ends in a click too) */
  var seen = function () {
    return new Promise(function (res) {
      var types = ['click'];
      var fin = function () { clearTimeout(t); types.forEach(function (ty) { window.removeEventListener(ty, fin, true); }); setTimeout(function () { res(true); }, 50); };
      var t = setTimeout(function () { types.forEach(function (ty) { window.removeEventListener(ty, fin, true); }); res(false); }, 10000);
      types.forEach(function (ty) { window.addEventListener(ty, fin, true); });
    });
  };
  var wasOpen = $('#hotkeys').is(':visible');
  if (!wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(700); }
  var cfg = document.getElementById('hotkeys-cfg');
  if (!cfg || !$('#hotkeys').is(':visible')) return { fail: ['hotkeys window did not open'] };
  var cmd = 'hk-feed', bound = keyOf(cmd);
  try {
    var field = document.getElementById(cmd), x = field && $(field).closest('.custom-key').find('.lm-hk-clear')[0];
    if (!x) return { fail: ['no clear button next to ' + cmd] };
    cfg.scrollTop += field.getBoundingClientRect().top - cfg.getBoundingClientRect().top - 60;
    try { $(cfg).perfectScrollbar('update'); } catch (e) { }
    await sleep(150);
    /* every x on screen is the element under its own centre */
    var box = cfg.getBoundingClientRect(), n = 0, covered = [];
    /* the list ends above the instructions and starts below the buttons (the instructions grew
     * past the list's fixed bottom and covered its last rows) */
    var inst = document.getElementById('hotkeys-inst'), menu = document.getElementById('hotkeys-menu');
    if (inst && box.bottom > inst.getBoundingClientRect().top + 1) fail.push('the key list runs ' + Math.round(box.bottom - inst.getBoundingClientRect().top) + 'px under the instructions');
    if (menu && box.top < menu.getBoundingClientRect().bottom - 1) fail.push('the key list starts ' + Math.round(menu.getBoundingClientRect().bottom - box.top) + 'px under the buttons');
    $('#hotkeys-cfg .lm-hk-clear').each(function () {
      var r = this.getBoundingClientRect();
      if (!r.width || r.top < box.top || r.bottom > box.bottom) return;
      n++;
      var hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (hit !== this && covered.length < 3) covered.push(this.getAttribute('data-hk') + ' under ' + (hit ? hit.tagName + '.' + String(hit.className).split(' ')[0] : 'nothing'));
      if (r.right > box.right) fail.push('x of ' + this.getAttribute('data-hk') + ' goes past the window');
    });
    info.onScreen = n;
    if (!n) fail.push('no x on screen');
    if (covered.length) fail.push('x covered: ' + covered.join(', '));
    /* a real click or tap clears the key */
    if (bound && typeof window.__lmInput === 'function') {
      var r = x.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (hit === x) {
        var s = seen();
        await send({ type: mobile ? 'tap' : 'click', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
        await s;
        await sleep(100);
        info.after = keyOf(cmd) + '/' + field.value;
        if (keyOf(cmd) !== '' || field.value !== '') fail.push('a real click on the x did not clear ' + bound + ': ' + info.after);
      } else info.realClick = 'skipped (x under ' + (hit && hit.id) + ')';
    }
  } finally {
    $('#close-hotkeys').trigger('click'); /* Close reverts the change */
    await sleep(700);
    if (keyOf(cmd) !== bound) fail.push('Close did not put ' + bound + ' back: ' + keyOf(cmd));
    if (wasOpen) { $('.hotkeys-link').first().trigger('click'); await sleep(600); }
  }
  return { fail: fail, info: info };
})()
