// Stream overlay: off by default (nothing on the channel, nobody listening to LMEvents); turned on,
// a state arrives on BroadcastChannel('legendmod-live') in this page and in companion.html (iframe,
// same origin); stream mode removes the nick.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var C = window.LMCompanion, app = window.application, s = window.legendmod5, LM = window.legendmod;
  if (!C || !C.core || !C.refresh) return { fail: ['LMCompanion missing (ogario/modules/companion.js not loaded)'] };
  if (!s || s.companionLive !== false || s.companionChat !== false) fail.push('companionLive / companionChat should be off by default');
  if (C.isOn()) fail.push('publishing while the option is off');
  if (!document.getElementById('companionLive') || !document.getElementById('companionChat')) fail.push('option switches missing');
  if (!document.querySelector('#lm-companion-row .lm-companion-open')) fail.push('Open companion button missing');
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
