// Chat translation (LMexpress.js doMainTranslation): the translation is added after the chat box
// scrolled to the new message, so a reader at the bottom must stay at the bottom (the added line was
// cut off: the "Scroll bug" of the old label), and a reader who scrolled up keeps their place. The
// browser's translator is replaced by a stub for the probe and put back; a test box is used.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var w = 0; w < 30 && typeof window.doMainTranslation !== 'function'; w++) await sleep(200);
  if (typeof window.doMainTranslation !== 'function') return { fail: ['doMainTranslation not found (LMexpress.js)'] };
  var had = { T: Object.prototype.hasOwnProperty.call(self, 'Translator'), D: Object.prototype.hasOwnProperty.call(self, 'LanguageDetector') };
  /* LMexpress keeps the detector and the translators it made: the stub ones must not stay there */
  var old = { T: self.Translator, D: self.LanguageDetector, lang: window.userLanguage, det: window._lmDetector, cache: window._lmTrCache };
  window._lmDetector = null;
  window._lmTrCache = {};
  var long = 'this is the translated text of the message, long enough to take several more lines in the box';
  var box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:100px;overflow:auto;font:12px/14px sans-serif;z-index:1';
  try {
    self.Translator = { create: function () { return Promise.resolve({ translate: function () { return Promise.resolve(long); } }); } };
    self.LanguageDetector = { create: function () { return Promise.resolve({ detect: function () { return Promise.resolve([{ detectedLanguage: 'es', confidence: 0.9 }]); } }); } };
    window.userLanguage = 'en';
    for (var i = 0; i < 30; i++) {
      var m = document.createElement('div');
      m.className = 'message';
      m.innerHTML = '<span class="message-nick">n' + i + ': </span><span class="message-text">hola ' + i + '</span>';
      box.appendChild(m);
    }
    document.body.appendChild(box);
    var gap = function () { return box.scrollHeight - box.scrollTop - box.clientHeight; };
    box.scrollTop = box.scrollHeight;
    var msg = box.lastChild;
    window.doMainTranslation(box, 'hola amigo', msg);
    for (var k = 0; k < 20 && msg.lastChild.childNodes.length < 2; k++) await sleep(25);
    info.added = msg.lastChild.childNodes.length > 1;
    info.gapAtBottom = gap();
    if (!info.added) fail.push('the stub translation was not added');
    else if (gap() > 2) fail.push('reader at the bottom: the translation is cut off (' + gap() + ' px below the box)');
    /* scrolled up: the place stays */
    box.scrollTop = 0;
    var msg2 = box.children[box.children.length - 2];
    window.doMainTranslation(box, 'hola otra vez', msg2);
    for (var k2 = 0; k2 < 20 && msg2.lastChild.childNodes.length < 2; k2++) await sleep(25);
    info.topAfter = box.scrollTop;
    if (box.scrollTop !== 0) fail.push('reader scrolled up was moved to ' + box.scrollTop);
  } finally {
    if (box.parentNode) box.parentNode.removeChild(box);
    if (had.T) self.Translator = old.T; else delete self.Translator;
    if (had.D) self.LanguageDetector = old.D; else delete self.LanguageDetector;
    window.userLanguage = old.lang;
    window._lmDetector = old.det;
    window._lmTrCache = old.cache;
  }
  return { fail: fail, info: info };
})()
