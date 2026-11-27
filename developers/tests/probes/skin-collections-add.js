// Skin collections window (the skins panel's Collections button), real input: a
// skin link typed without https:// into "Skin URL to keep" (as players paste i.imgur.com/... links)
// is kept as the address the skin field plays it with (https://...), so its card shows the picture
// and the search finds it. Until 3.700 it was kept as typed: the card had no picture, and once used
// the skin was listed twice. The collections and the window are put back after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (typeof window.__lmInput !== 'function') return { fail: ['the harness has no real input (window.__lmInput)'], info: info };
  for (var w = 0; w < 40 && !(window.LMSmallTools && LMSmallTools.open); w++) await sleep(250);
  var ST = window.LMSmallTools, ms = window.defaultmapsettings;
  if (!ST || !ms) return { fail: ['LMSmallTools missing'], info: info };
  var mobile = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var send = function (q) {
    return new Promise(function (res) {
      q.id = 'sca' + Date.now() + Math.random();
      var t = setTimeout(function () { res(false); }, 8000);
      window.__lmInputDone = function (i) { if (i === q.id) { clearTimeout(t); setTimeout(function () { res(true); }, 60); } };
      window.__lmInput(JSON.stringify(q));
    });
  };
  var press = function (el) {
    var r = el.getBoundingClientRect();
    return send({ type: mobile ? 'tap' : 'click', x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
  };
  var CODES = { '.': 190, '/': 191, ':': 186, '-': 189 };
  var typeIn = async function (el, text) {
    el.focus();
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      await send({ type: 'key', key: ch, code: '', keyCode: CODES[ch] || ch.toUpperCase().charCodeAt(0), text: ch });
    }
  };
  var typed = 'i.imgur.com/LmPrb19.png', want = 'https://' + typed;
  var stored = null;
  try { stored = localStorage.getItem('lmSkinCollections'); } catch (e) { }
  var keys = function () { try { return Object.keys((JSON.parse(localStorage.getItem('lmSkinCollections') || '{}').items) || {}); } catch (e) { return []; } };
  try {
    ST.open('skins');
    await sleep(300);
    var win = document.getElementById('lm-st-skins');
    if (!win) throw new Error('the collections window did not open');
    var add = [].filter.call(win.querySelectorAll('input[type=text]'), function (x) { return x.placeholder === lmT('modules.smalltools.addUrl'); })[0];
    if (!add) throw new Error('no "Skin URL to keep" field');
    await typeIn(add, typed);
    info.field = add.value;
    await press(add.parentNode.querySelector('button'));
    await sleep(300);
    info.kept = keys();
    if (info.kept.indexOf(want) < 0) fail.push('kept ' + JSON.stringify(info.kept) + ', expected ' + want);
    var card = [].filter.call(document.querySelectorAll('#lm-st-skins-list .lm-st-skin'), function (c) { return c.textContent.indexOf('LmPrb19') >= 0; });
    info.cards = card.length;
    var img = card[0] && card[0].querySelector('img');
    if (card.length !== 1) fail.push(card.length + ' cards for the kept skin, expected 1');
    if (!img || img.getAttribute('src') !== want) fail.push('the card picture is ' + (img && img.getAttribute('src')) + ', expected ' + want);
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    try { ST.close(); } catch (e) { }
    try { if (stored === null) localStorage.removeItem('lmSkinCollections'); else localStorage.setItem('lmSkinCollections', stored); } catch (e) { }
  }
  return { fail: fail, info: info };
})()
