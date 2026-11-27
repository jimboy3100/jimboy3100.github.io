// Settings > Voice > Voice language: choosing "All" takes the language chosen before off the speech
// recognition at once ('' = the page's language, as at start without a language). Until now the
// language chosen before stayed in use until the next load. Choosing a language sets it, the choice
// is stored ('lang') and the prefix goes before the recognised text in chat. The player's voice
// language and prefix are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 60 && !document.getElementById('voice-lang'); w++) await sleep(250);
  var sel = document.getElementById('voice-lang');
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!sel) return { fail: ['Settings > Voice has no language choice'], info: info };
  if (!SR) return { skip: 'no speech recognition in this browser' };
  var d = Object.getOwnPropertyDescriptor(SR.prototype, 'lang');
  if (!d || !d.set) return { skip: 'speech recognition language is not an accessor' };
  var keepLang = null, keepPrefix = null, was = sel.value;
  try { keepLang = localStorage.getItem('lang'); keepPrefix = localStorage.getItem('prefix'); } catch (e) { }
  /* the page's recognition object, found when the menu sets its language */
  var rec = null;
  Object.defineProperty(SR.prototype, 'lang', { configurable: true, get: d.get, set: function (v) { rec = this; d.set.call(this, v); } });
  var choose = function (v) { sel.value = v; sel.dispatchEvent(new Event('change', { bubbles: true })); };
  try {
    choose('ja');
    info.ja = rec ? rec.lang : null;
    if (!rec) return { fail: ['choosing a voice language did not set the recognition language'], info: info };
    if (rec.lang !== 'ja') fail.push('recognition language ' + rec.lang + ' after choosing ja');
    if (localStorage.getItem('lang') !== 'ja') fail.push('voice language not stored: ' + localStorage.getItem('lang'));
    choose('default');
    info.all = rec.lang;
    if (rec.lang !== '') fail.push('"All" keeps the recognition language "' + rec.lang + '"');
    if (localStorage.getItem('lang') !== 'default') fail.push('"All" not stored: ' + localStorage.getItem('lang'));
    /* the prefix of the box goes before the recognised text */
    var box = document.getElementById('voice-prefix'), keepBox = box.value;
    box.value = 'VX';
    $(box).trigger('blur');
    var oscm = application.sendChatMessage, sent = null;
    application.sendChatMessage = function (t, m) { sent = m; };
    try {
      var ev = new Event('result');
      Object.defineProperty(ev, 'results', { value: { item: function () { return { item: function () { return { transcript: 'hello' }; } }; } } });
      rec.dispatchEvent(ev);
    } finally { application.sendChatMessage = oscm; box.value = keepBox; $(box).trigger('blur'); }
    info.sent = sent;
    if (sent !== 'VX hello') fail.push('voice message sent as ' + JSON.stringify(sent));
  } finally {
    choose(was);
    Object.defineProperty(SR.prototype, 'lang', d);
    try {
      if (keepLang === null) localStorage.removeItem('lang'); else localStorage.setItem('lang', keepLang);
      if (keepPrefix === null) localStorage.removeItem('prefix'); else localStorage.setItem('prefix', keepPrefix);
    } catch (e) { }
  }
  return { fail: fail, info: info };
})()
