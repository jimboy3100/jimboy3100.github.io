// Custom macros window, desktop: the key note of a slot shows its key, or "not set" with a button
// that opens the Hotkeys window at that slot's "Custom macro N" row (scrolled into view, in front,
// blinking, through the Command Centre reveal); closing the Hotkeys window brings the editor back
// at the same slot. A key bound for the test only is taken out again.
(async () => {
  var fail = [], info = {};
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return { fail: fail, info: { skipped: 'desktop only' } };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var wait = async function (fn, n) { for (var i = 0; i < (n || 50) && !fn(); i++) await sleep(100); return !!fn(); };
  var N = 2, ID = 'hk-customMacro' + N, TESTKEY = 'ALT+9', added = false;
  var hkVisible = function () { return $('#hotkeys').is(':visible'); };
  /* the Discover window opens by itself on a later visit with new features: not this test's window */
  var noDiscover = function () { var DC = window.LMDiscovery; if (DC && DC.isOpen && DC.isOpen()) { DC.close(); info.discoverClosed = true; } };
  var bound = function () { for (var k in window.hotkeys) if (window.hotkeys[k] === ID) return k; return ''; };
  try {
    noDiscover();
    if (hkVisible()) { $('#close-hotkeys').trigger('click'); await sleep(700); }
    if (typeof window.lmMacroEditor !== 'function') throw new Error('lmMacroEditor missing');
    if (!document.getElementById(ID)) throw new Error('no Hotkeys window row #' + ID);
    var key = bound();
    info.boundAtStart = key;

    window.lmMacroEditor('open', N);
    if (!(await wait(function () { return window.LMMacroEditor && LMMacroEditor.isOpen(); }))) throw new Error('macro editor did not open');
    await sleep(100);
    var note = function () { var b = document.querySelector('#lm-me-p .lm-me-hk'); return b && b.parentNode; };
    var btn = document.querySelector('#lm-me-p .lm-me-hk');
    if (!btn) throw new Error('no Hotkeys button in the key note');
    info.note = note().textContent;
    if (!key) {
      if (note().textContent.indexOf(lmT('modules.macroeditor.noKey')) !== 0) fail.push('unset key note: ' + note().textContent);
      if (btn.textContent !== lmT('pkg.tx.setKey')) fail.push('unset key button: ' + btn.textContent);
      if (/Settings|>/.test(note().textContent)) fail.push('note still names a path: ' + note().textContent);
      /* a key set: shown, and the button says change */
      window.hotkeys[TESTKEY] = ID; added = true;
      window.lmMacroEditor('open', N);
      await sleep(50);
      btn = document.querySelector('#lm-me-p .lm-me-hk');
      info.noteSet = note().textContent;
      if (note().textContent.indexOf(lmT('modules.macroeditor.key', [TESTKEY])) !== 0) fail.push('set key not shown: ' + note().textContent);
      if (btn.textContent !== lmT('pkg.tx.changeKey')) fail.push('set key button: ' + btn.textContent);
      delete window.hotkeys[TESTKEY]; added = false;
      window.lmMacroEditor('open', N);
      await sleep(50);
      btn = document.querySelector('#lm-me-p .lm-me-hk');
    }
    if (btn.getAttribute('data-slot') !== String(N)) fail.push('button for slot ' + btn.getAttribute('data-slot'));

    btn.click();
    if (!(await wait(function () { return hkVisible(); }, 30))) fail.push('Hotkeys window did not open');
    await sleep(900);
    if (LMMacroEditor.isOpen()) fail.push('the editor still covers the Hotkeys window');
    noDiscover();
    var row = $('#' + ID).closest('.row')[0], cfg = document.getElementById('hotkeys-cfg');
    if (!row) throw new Error('no row');
    var rr = row.getBoundingClientRect(), cr = cfg.getBoundingClientRect();
    info.row = [Math.round(rr.top), Math.round(rr.bottom)]; info.cfg = [Math.round(cr.top), Math.round(cr.bottom)];
    if (rr.top < cr.top - 1 || rr.bottom > cr.bottom + 1 || !rr.height) fail.push('row not scrolled into view');
    var hit = document.elementFromPoint(rr.left + rr.width / 2, rr.top + rr.height / 2);
    if (!hit || !row.contains(hit)) fail.push('row covered by ' + (hit ? hit.tagName + '#' + hit.id + '.' + hit.className : 'nothing'));
    if (!row.classList.contains('lm-cc-flash')) fail.push('row not highlighted');

    $('#close-hotkeys').trigger('click');
    if (!(await wait(function () { return window.LMMacroEditor && LMMacroEditor.isOpen(); }, 20))) fail.push('editor did not come back after the Hotkeys window closed');
    else {
      var on = document.querySelector('#lm-me-p .lm-me-slot.on');
      var slots = Array.prototype.slice.call(document.querySelectorAll('#lm-me-p .lm-me-slot'));
      if (slots.indexOf(on) !== N - 1) fail.push('editor came back at slot ' + (slots.indexOf(on) + 1));
    }
    await sleep(700);
    /* the next close of the Hotkeys window opens nothing */
    LMMacroEditor.close();
    $('.hotkeys-link').first().trigger('click');
    await sleep(600);
    $('#close-hotkeys').trigger('click');
    await sleep(300);
    if (LMMacroEditor.isOpen()) fail.push('editor opened again on a later Hotkeys window close');
  } catch (e) {
    fail.push(String(e && e.message || e));
  } finally {
    if (added) delete window.hotkeys[TESTKEY];
    try { if (window.LMMacroEditor) LMMacroEditor.close(); } catch (e) { }
    if (hkVisible()) { $('#close-hotkeys').trigger('click'); await sleep(600); }
  }
  return { fail: fail, info: info };
})()
