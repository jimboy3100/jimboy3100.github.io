// Hotkeys window header: Restore, Save, then Close as the last (rightmost) button (no Bound keys / Conflicts buttons);
// opening the window again adds nothing twice; on a phone (915x412) Close stays on screen.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var open = async function () {
    if (window.hotkeysCommand && hotkeysCommand['hk-showHotkeys']) { try { hotkeysCommand['hk-showHotkeys'].keyDown(); } catch (e) { } }
    if (!document.getElementById('hotkeys-menu')) { try { $('.hotkeys-link').first().trigger('click'); } catch (e) { } }
    for (var i = 0; i < 30 && !document.getElementById('hotkeys-menu'); i++) await sleep(200);
    await sleep(200);
  };
  var ids = function () {
    var m = document.getElementById('hotkeys-menu');
    return m ? Array.prototype.map.call(m.querySelectorAll('button'), function (b) { return b.id; }) : [];
  };
  var wasOpen = !!document.getElementById('hotkeys') && $('#hotkeys').is(':visible');
  try {
    await open();
    var first = ids();
    info.order = first.join(',');
    if (first[first.length - 1] !== 'close-hotkeys') fail.push('Close is not the last button: ' + info.order);
    ['reset-hotkeys', 'save-hotkeys', 'close-hotkeys'].forEach(function (id) {
      if (first.indexOf(id) < 0) fail.push('missing ' + id);
    });
    ['lm-hk-sheet', 'lm-hk-conflicts'].forEach(function (id) {
      if (first.indexOf(id) >= 0) fail.push('removed button is back: ' + id);
    });
    /* assigning a browser-kept key is refused and keeps the old key; a warned key is allowed */
    var setup = window.hotkeysSetup || (window.legendmod6);
    var input = document.querySelector('#hotkeys-cfg .custom-key-in');
    if (setup && typeof setup.setHotkey === 'function' && input) {
      var hid = input.id, before = null;
      for (var k in hotkeys) { if (hotkeys.hasOwnProperty(k) && k !== 'spec-messageKey' && hotkeys[k] === hid) { before = k; break; } }
      setup.lastPressedKey = null; setup.lastKeyId = null;
      setup.setHotkey('CTRL+W', hid);
      if (hotkeys['CTRL+W'] === hid) fail.push('CTRL+W was accepted');
      var after = null;
      for (var k2 in hotkeys) { if (hotkeys.hasOwnProperty(k2) && k2 !== 'spec-messageKey' && hotkeys[k2] === hid) { after = k2; break; } }
      if (after !== before) fail.push('old key lost after a refused key: ' + before + ' -> ' + after);
      info.refused = 'CTRL+W kept ' + before;
      if (window.LMSmallTools && LMSmallTools.keyCheck) {
        var w = LMSmallTools.keyCheck('F11'), bl = LMSmallTools.keyCheck('ALT+F4'), ok = LMSmallTools.keyCheck('W');
        if (!w || w.level !== 'warn' || !bl || bl.level !== 'block' || ok) fail.push('keyCheck levels wrong');
      }
    } else info.refused = 'setHotkey not reachable';
    var close = document.getElementById('close-hotkeys');
    if (close) {
      var r = close.getBoundingClientRect();
      info.close = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(',');
      if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1 || r.bottom > window.innerHeight + 1)) fail.push('Close is off screen: ' + info.close + ' in ' + window.innerWidth + 'x' + window.innerHeight);
    }
    /* close and open again: no duplicate buttons */
    $('#close-hotkeys').trigger('click');
    await sleep(500);
    await open();
    var second = ids();
    var seen = {};
    second.forEach(function (id) { if (id && seen[id]) fail.push('duplicate ' + id + ' after reopening'); seen[id] = 1; });
    if (second[second.length - 1] !== 'close-hotkeys') fail.push('Close not last after reopening: ' + second.join(','));
  } catch (e) {
    fail.push('error: ' + (e && e.message));
  } finally {
    if (!wasOpen) { try { $('#close-hotkeys').trigger('click'); } catch (e) { } }
  }
  return { fail: fail, info: info };
})()
