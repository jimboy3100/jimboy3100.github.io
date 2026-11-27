// Phone run: the chat button opens the game's chat box; a tap on the game dismisses it and keeps the
// typed text; the chat button opens it again with the text and sends nothing; the next tap on the chat
// button sends it once. A dismissed text also comes back when the game hid the box meanwhile.
// (Up to 3.697 the second tap sent the dismissed text: the chat button opened the chat with a synthetic
// Enter, and Enter on a box that is still open sends it.) The game's send is counted, not done.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  /* a touch-only screen: LMmobile.js may still be loading when the probes start */
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, canvas = document.getElementById('canvas');
  if (!H || !app || !canvas) return { fail: ['phone controls, application or canvas missing'] };
  var bChat = H.controls().chat;
  var box = document.getElementById('message-box'), inp = document.getElementById('message');
  if (!bChat || !box || !inp) return { fail: ['chat button or chat box missing'] };
  var tap = function (el, x, y) {
    var r = el.getBoundingClientRect();
    var t = new Touch({ identifier: 41, target: el, clientX: x != null ? x : r.left + r.width / 2, clientY: y != null ? y : r.top + r.height / 2 });
    el.dispatchEvent(new TouchEvent('touchstart', { touches: [t], targetTouches: [t], changedTouches: [t], bubbles: true, cancelable: true }));
    el.dispatchEvent(new TouchEvent('touchend', { touches: [], targetTouches: [], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  var shown = function () { return !!box.getClientRects().length; };
  var sent = [], keep = { send: app.sendChatMessage, soon: app.lmLegendChatTooSoon, last: app.lastMessageSentTime, lmSend: window.legendmod && window.legendmod.sendMessage };
  var menuWas = !!(document.getElementById('overlays') && document.getElementById('overlays').getClientRects().length);
  try {
    app.sendChatMessage = function (op, text) { sent.push(String(text)); return true; };
    app.lmLegendChatTooSoon = function () { return false; };
    app.lastMessageSentTime = 0;
    if (window.legendmod) window.legendmod.sendMessage = function () { };
    if (shown()) { inp.value = ''; app.enterChatMessage(); }
    app.hideMenu();
    await sleep(400);
    tap(bChat);
    await sleep(250);
    if (!shown()) fail.push('chat button did not open the chat box');
    if (document.activeElement !== inp) fail.push('chat box not focused after opening');
    inp.value = 'probe draft';
    tap(canvas, innerWidth * 0.4, innerHeight * 0.5);
    await sleep(150);
    info.afterDismiss = { shown: shown(), value: inp.value, sent: sent.length };
    if (sent.length) fail.push('a tap on the game sent the message');
    if (inp.value !== 'probe draft') fail.push('a tap on the game lost the typed text');
    tap(bChat);
    await sleep(250);
    info.afterReopen = { shown: shown(), value: inp.value, sent: sent.length, focused: document.activeElement === inp };
    if (sent.length) fail.push('opening the chat again sent the dismissed text');
    if (inp.value !== 'probe draft') fail.push('opening the chat again lost the dismissed text');
    if (!shown() || document.activeElement !== inp) fail.push('chat box not open and focused after opening it again');
    tap(bChat);
    await sleep(250);
    info.afterSend = { shown: shown(), value: inp.value, sent: sent.slice() };
    if (sent.length !== 1 || sent[0] !== 'probe draft') fail.push('the chat button sent ' + JSON.stringify(sent) + ' (expected the text once)');
    if (shown()) fail.push('chat box still open after sending');
    // a dismissed text survives the game hiding its box
    tap(bChat);
    await sleep(250);
    inp.value = 'second draft';
    tap(canvas, innerWidth * 0.4, innerHeight * 0.5);
    await sleep(100);
    $('#message-box').hide();
    tap(bChat);
    await sleep(250);
    info.afterHidden = { shown: shown(), value: inp.value, sent: sent.length };
    if (inp.value !== 'second draft') fail.push('a dismissed text was lost when the chat box was hidden: "' + inp.value + '"');
    if (sent.length !== 1) fail.push('reopening a hidden chat box sent something');
  } finally {
    inp.value = '';
    try { tap(canvas, innerWidth * 0.4, innerHeight * 0.5); } catch (e) { }
    try { $('#message-box').hide(); inp.blur(); } catch (e) { }
    app.sendChatMessage = keep.send; app.lmLegendChatTooSoon = keep.soon; app.lastMessageSentTime = keep.last;
    if (window.legendmod) window.legendmod.sendMessage = keep.lmSend;
    if (menuWas) app.showMenu();
  }
  return { fail: fail, info: info };
})()
