// Replay Studio: the instant replay length chosen in the Studio (its seconds list, changed with a
// real key press) moves the knob of the Settings > Replays slider too; the knob stayed where it was
// while the number next to it changed. The length is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  if (typeof window.lmReplayStudio !== 'function') return { fail: ['lmReplayStudio loader missing'] };
  var sl = document.getElementById('instantReplaySecs-slider');
  var hd = sl && sl.parentNode.querySelector('.rangeslider__handle');
  if (!sl || !hd) return { skip: 'no rangeslider knob for the instant replay length' };
  var keyPress = function (k, code, kc) {
    return new Promise(function (res) {
      var id = 'rsk' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === id) { clearTimeout(t); setTimeout(function () { res(true); }, 200); } };
      window.__lmInput(JSON.stringify({ id: id, type: 'key', key: k, code: code, keyCode: kc }));
    });
  };
  var was = defaultmapsettings.instantReplaySecs;
  /* the knob is placed only while the slider's tab is shown: show it (the Replays group) for the test */
  var hidden = [];
  $(sl).parents().each(function () { if (this.style && getComputedStyle(this).display === 'none') { hidden.push([this, this.style.display]); this.style.display = 'block'; } });
  try {
    $(sl).val(was).trigger('change');
    window.lmReplayStudio('open');
    for (var w = 0; w < 50 && !(window.LMReplayStudio && window.LMReplayStudio.run); w++) await sleep(100);
    await sleep(300);
    var secs = Array.prototype.filter.call(document.querySelectorAll('#lm-rs select'), function (s) { return s.title === lmT('modules.replaystudio.instant'); })[0];
    if (!secs) return { fail: ['no instant replay length in Replay Studio'] };
    var left0 = hd.getBoundingClientRect().left;
    info.from = [secs.value, Math.round(left0)];
    info.recording = !!(window.LMReplayStudio.state && window.LMReplayStudio.state().n);
    /* with no recording yet the list showed 15 s whatever the setting was (then a key press to
     * 30 s changed nothing: this probe failed when it ran before the page recorded) */
    if (secs.value !== String(was)) fail.push('the Studio shows ' + secs.value + ' s for an instant replay length of ' + was + ' s');
    secs.focus();
    /* 60 is the last choice: go up from it, else down */
    var up = secs.value === '60';
    await keyPress(up ? 'ArrowUp' : 'ArrowDown', up ? 'ArrowUp' : 'ArrowDown', up ? 38 : 40);
    await sleep(200);
    var left1 = hd.getBoundingClientRect().left;
    info.to = [secs.value, defaultmapsettings.instantReplaySecs, sl.value, $('#instantReplaySecs-value').text(), Math.round(left1)];
    if (String(defaultmapsettings.instantReplaySecs) === String(was)) fail.push('the key press did not change the length (' + secs.value + ')');
    else {
      if (String(sl.value) !== String(defaultmapsettings.instantReplaySecs)) fail.push('slider value ' + sl.value + ' != ' + defaultmapsettings.instantReplaySecs);
      if (Math.abs(left1 - left0) < 2) fail.push('the Settings slider knob did not move (' + Math.round(left0) + ' px) for ' + was + ' -> ' + defaultmapsettings.instantReplaySecs + ' s');
      else if ((left1 > left0) !== (+defaultmapsettings.instantReplaySecs > +was)) fail.push('the knob moved the wrong way');
    }
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    try { window.lmReplayStudio('close'); } catch (e) { }
    $(sl).val(was).trigger('change');
    defaultmapsettings.instantReplaySecs = was;
    $('#instantReplaySecs-value').text(was);
    try { application.saveSettings(defaultmapsettings, 'ogarioSettings'); } catch (e) { }
    hidden.forEach(function (h) { h[0].style.display = h[1]; });
  }
  return { fail: fail, info: info };
})()
