// Hotkeys window header: Restore, Save, Bound keys, Conflicts, then Close as the last (rightmost) button;
// opening the window again adds nothing twice; on a phone (915x412) Close stays on screen.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var open = async function () {
    if (window.hotkeysCommand && hotkeysCommand['hk-showHotkeys']) { try { hotkeysCommand['hk-showHotkeys'].keyDown(); } catch (e) { } }
    if (!document.getElementById('hotkeys-menu')) { try { $('.hotkeys-link').first().trigger('click'); } catch (e) { } }
    for (var i = 0; i < 30 && !document.getElementById('lm-hk-conflicts'); i++) await sleep(200);
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
    ['reset-hotkeys', 'save-hotkeys', 'lm-hk-sheet', 'close-hotkeys'].forEach(function (id) {
      if (first.indexOf(id) < 0) fail.push('missing ' + id);
    });
    if (window.LMSmallTools && first.indexOf('lm-hk-conflicts') < 0) fail.push('missing lm-hk-conflicts');
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
