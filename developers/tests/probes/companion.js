// Stream overlay: off by default (nothing on the channel, nobody listening to LMEvents); turned on,
// a state arrives on BroadcastChannel('legendmod-live') in this page and in companion.html (iframe,
// same origin); stream mode removes the nick; the result image window fits the screen and closes.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var C = window.LMCompanion, app = window.application, s = window.legendmod5, LM = window.legendmod;
  if (!C || !C.core || !C.refresh) return { fail: ['LMCompanion missing (ogario/modules/companion.js not loaded)'] };
  if (!s || s.companionLive !== false || s.companionChat !== false) fail.push('companionLive / companionChat should be off by default');
  if (C.isOn()) fail.push('publishing while the option is off');
  if (!document.getElementById('companionLive') || !document.getElementById('companionChat')) fail.push('option switches missing');
  if (!document.querySelector('#lm-companion-row .lm-companion-open') || !document.querySelector('#lm-companion-row .lm-companion-result')) fail.push('Open companion / Result image buttons missing');
  if (!hotkeysCommand['hk-companionResult'] || hotkeysCommand['hk-companionResult'].defaultKey !== '') fail.push('hk-companionResult missing or has a default key');
  if (['kill', 'personalBest', 'gameStats'].some(function (n) { return LMEvents._has(n); })) fail.push('LMEvents listeners while the option is off');

  var got = [];
  var ch = new BroadcastChannel('legendmod-live');
  ch.onmessage = function (e) { got.push(e.data); };
  var frame = null, oldNick = LM.playerNick, oldStream = s.streamMode;
  try {
    ch.postMessage({ v: 1, kind: 'hello' });
    await sleep(700);
    if (got.length) fail.push('messages on the channel while the option is off: ' + got.length);

    app.setSettings('companionLive', true);
    if (!C.isOn()) fail.push('setSettings did not start publishing');
    LM.playerNick = 'ProbeNick';
    C.publishNow();
    await sleep(600);
    var st = got.filter(function (m) { return m && m.kind === 'state'; });
    info.messages = got.length;
    if (!st.length) fail.push('no state received on the BroadcastChannel');
    else {
      var m = st[st.length - 1];
      if (m.v !== 1 || !m.state || !Array.isArray(m.state.lb) || typeof m.state.mass !== 'number') fail.push('bad state message ' + JSON.stringify(m).slice(0, 200));
      if (m.state.nick !== 'ProbeNick') fail.push('nick not published with stream mode off: ' + JSON.stringify(m.state.nick));
      if ('chat' in m.state) fail.push('chat published while its option is off');
      info.state = JSON.stringify(m.state).slice(0, 160);
    }
    /* the timer posts at most 4 states per second */
    var before = got.length;
    await sleep(1000);
    var perSec = got.length - before;
    info.perSecond = perSec;
    if (perSec > 5) fail.push('more than 4 states per second: ' + perSec);

    s.streamMode = true;
    got.length = 0;
    C.publishNow();
    await sleep(300);
    var hidden = got.filter(function (m) { return m && m.kind === 'state'; }).pop();
    if (!hidden) fail.push('no state in stream mode');
    else if (JSON.stringify(hidden).indexOf('ProbeNick') >= 0 || hidden.state.server !== '') fail.push('stream mode published the nick or the server');
    s.streamMode = oldStream;

    /* companion.html in a frame of this page: same origin, same channel */
    frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;left:-2000px;top:0;width:600px;height:500px;';
    frame.src = location.origin + '/companion.html?w=card,minimap,leaderboard,events,chat&bg=transparent&wm=' + encodeURIComponent('<b>x</b>');
    document.body.appendChild(frame);
    var view = null;
    for (var w = 0; w < 40 && !(view && view.state()); w++) {
      await sleep(150);
      try { view = frame.contentWindow.LMCompanionView; } catch (e) { view = null; }
    }
    if (!view) fail.push('companion.html did not start');
    else if (!view.state()) fail.push('companion.html received no state (its hello got no answer)');
    else {
      var doc = frame.contentDocument;
      ['card', 'minimap', 'leaderboard', 'events', 'chat'].forEach(function (id) { if (!doc.querySelector('.w-' + id)) fail.push('widget ' + id + ' missing'); });
      if (doc.getElementById('setup').hidden !== true) fail.push('setup shown with w=');
      if (!doc.body.classList.contains('bg-transparent')) fail.push('bg=transparent not applied');
      var wm = doc.getElementById('wm');
      if (!wm || wm.hidden || wm.querySelector('b') || wm.textContent !== '<b>x</b>') fail.push('watermark not shown as plain text');
      if (doc.querySelector('.w-card .nick').textContent.indexOf('ProbeNick') < 0) fail.push('card shows no nick');
      info.pageStatus = doc.getElementById('status').className;
    }

    /* result image: needs a life; without one it says so (a toast), with the last Game Over stats it opens */
    var savedStats = LM._lmLastSessionStats, savedAt = LM._lmLastSessionStatsAt;
    LM._lmLastSessionStats = { highestMass: 4321, topPosition: 2, timeTotal: 95, playersEaten: 3 };
    LM._lmLastSessionStatsAt = Date.now();
    var md = C.resultImage();
    LM._lmLastSessionStats = savedStats; LM._lmLastSessionStatsAt = savedAt;
    await sleep(150);
    md = document.getElementById('lm-result-modal');
    if (!md) fail.push('result image window did not open');
    else {
      var cv = md.querySelector('canvas'), r = cv.getBoundingClientRect();
      info.result = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)];
      info.resultBar = Math.round(md.querySelector('.lmr-bar').getBoundingClientRect().height);
      if (cv.width !== 1200 || cv.height !== 630) fail.push('result canvas is not 1200x630');
      if (r.left < 0 || r.top < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fail.push('result image does not fit the screen');
      var btns = md.querySelectorAll('button');
      for (var b = 0; b < btns.length; b++) {
        var br = btns[b].getBoundingClientRect();
        if (br.bottom > innerHeight + 1 || br.right > innerWidth + 1) fail.push('result button off screen: ' + btns[b].textContent + ' ' + JSON.stringify([br.left, br.top, br.right, br.bottom, innerWidth, innerHeight, md.getBoundingClientRect().height]));
        if (br.height < 30) fail.push('result button too small for touch: ' + btns[b].textContent);
      }
      try { if (!/^data:image\/png/.test(cv.toDataURL('image/png'))) fail.push('canvas does not export a PNG'); } catch (e) { fail.push('canvas export failed: ' + e.message); }
      md.querySelector('.lmr-close').click();
      if (document.getElementById('lm-result-modal')) fail.push('result window did not close');
    }
  } finally {
    LM.playerNick = oldNick;
    s.streamMode = oldStream;
    got.length = 0;
    app.setSettings('companionLive', false);
    if (frame && frame.parentNode) frame.parentNode.removeChild(frame);
    ch.close();
  }
  if (C.isOn()) fail.push('still publishing after turning the option off');
  if (['spawn', 'death', 'kill', 'personalBest', 'gameStats', 'chat'].some(function (n) { return LMEvents._has(n); })) fail.push('LMEvents listeners left after turning the option off');
  return { fail: fail, info: info };
})()
