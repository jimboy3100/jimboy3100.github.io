// The Youtube & Sounds menu tab and its YouTube player are gone: no tab button, no #music panel, no
// player frame, address box or play/pause buttons. The other menu tabs still switch (also after the
// address bar's hash says #music), the sound settings work and are saved in Settings > Sounds, an
// old saved player address and an older settings export with it are ignored without errors, and a
// teammate's [yut] chat invite (or an older version's "open the player" command) causes no error.
// Everything is put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var ms = window.defaultmapsettings;
  var shown = function (el) { return !!el && getComputedStyle(el).display !== 'none'; };
  var stored = function () { try { return JSON.parse(localStorage.getItem('ogarioSettings') || '{}'); } catch (e) { return {}; } };
  var errors = [];
  var onErr = function (e) { errors.push(String(e && (e.message || e.reason) || e)); };
  window.addEventListener('error', onErr);
  window.addEventListener('unhandledrejection', onErr);

  /* 1. nothing of the tab or the player is left */
  ['.music-tab', '.menu-tabs a[href="#music"]', '#music', '#musicFrame', '#musicUrl', '#youtubeplayer', '#afteryoutubeplayer',
    '#playerBtn', '#playerI', '#msgcommand5', '.radio-panel', '.ogario-yt-panel'].forEach(function (s) {
    if (document.querySelector(s)) fail.push(s + ' still in the page');
  });
  ['playYoutube', 'ytFrame', 'YoutubeEmbPlayer', 'getEmbedUrl', 'musicPlayer', 'YoutubebackgroundEnable', 'msgcommand5f'].forEach(function (n) {
    if (typeof window[n] !== 'undefined') fail.push('player function / variable ' + n + ' still defined');
  });
  if ([].some.call(document.querySelectorAll('iframe'), function (f) { return /youtube\.com\/embed\/[^"]*enablejsapi/.test(f.src || ''); })) fail.push('a YouTube player frame is still loaded');
  info.tabs = $('.menu-tabs > li').map(function () { return this.className.split(' ')[0]; }).get();
  if (info.tabs.length !== 6) fail.push('expected 6 menu tabs, got ' + info.tabs.length + ' (' + info.tabs.join(', ') + ')');

  /* 2. the tabs switch (also with #music in the address bar) */
  var activeTab = $('.menu-tabs li.active a').first();
  var hashBefore = location.hash;
  try {
    try { history.replaceState(history.state, '', location.pathname + location.search + '#music'); window.dispatchEvent(new HashChangeEvent('hashchange')); } catch (e) { }
    var links = $('.menu-tabs a[href^="#"]').not('.hotkeys-link').get();
    if (links.length < 4) fail.push('only ' + links.length + ' menu tab links');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href === '#') continue;
      $(links[i]).trigger('click');
      var t0 = Date.now();
      while (!shown(document.querySelector(href)) && Date.now() - t0 < 2000) await sleep(50);
      if (!shown(document.querySelector(href))) fail.push('tab ' + href + ' did not open');
      var others = $('.menu-panel').not(href).filter(function () { return shown(this); }).map(function () { return this.id; }).get();
      if (others.length) fail.push('tab ' + href + ': other panels still shown: ' + others.join(', '));
    }
  } catch (e) {
    fail.push('tabs threw ' + e);
  } finally {
    try { history.replaceState(history.state, '', location.pathname + location.search + hashBefore); } catch (e) { }
  }

  /* 3. Settings > Sounds works and is saved */
  var sBefore = { virusSound: ms.virusSound, volChat: ms.volChat, messageSound: ms.messageSound };
  var rawBefore = localStorage.getItem('ogarioSettings');
  try {
    $('.settings-tab a').first().trigger('click');
    await sleep(300);
    var grp = $('#og-options .options-box.soundsGroup');
    if (!grp.length) throw new Error('no Settings > Sounds section');
    ['virusSound', 'volChat-slider', 'volMaster-slider', 'messageSound', 'commandSound', 'virusSoundurl'].forEach(function (id) {
      if (!$(document.getElementById(id)).closest('.options-box.soundsGroup').length) fail.push('#' + id + ' not in Settings > Sounds');
    });
    var cb = document.getElementById('virusSound');
    cb.checked = !sBefore.virusSound;
    cb.dispatchEvent(new Event('change', { bubbles: true }));
    await sleep(100);
    if (ms.virusSound !== !sBefore.virusSound) fail.push('virus sound switch did not change the setting');
    if (stored().virusSound !== !sBefore.virusSound) fail.push('virus sound switch was not saved');
    var vol = sBefore.volChat === 0.37 ? 0.41 : 0.37;
    $('#volChat-slider').val(vol).trigger('input').trigger('change');
    await sleep(100);
    if (ms.volChat !== vol) fail.push('chat volume slider did not change the setting (' + ms.volChat + ')');
    if (stored().volChat !== vol) fail.push('chat volume was not saved (' + stored().volChat + ')');
    var url = 'https://www.legendmod.ml/sounds/notification_01.mp3';
    $('#messageSound').val(url).trigger('change');
    await sleep(100);
    if (ms.messageSound !== url || stored().messageSound !== url) fail.push('message sound file was not set and saved');
  } catch (e) {
    fail.push('sounds threw ' + e);
  } finally {
    var cb2 = document.getElementById('virusSound');
    if (cb2 && cb2.checked !== !!sBefore.virusSound) { cb2.checked = !!sBefore.virusSound; cb2.dispatchEvent(new Event('change', { bubbles: true })); }
    $('#volChat-slider').val(sBefore.volChat).trigger('input').trigger('change');
    $('#messageSound').val(sBefore.messageSound == null ? '' : String(sBefore.messageSound)).trigger('change');
    await sleep(100);
    try { if (rawBefore == null) localStorage.removeItem('ogarioSettings'); else localStorage.setItem('ogarioSettings', rawBefore); } catch (e) { }
  }

  /* 4. an old saved player address and an older export with it are ignored */
  var musicBefore = localStorage.getItem('musicUrl'), jsonBefore = window.LegendJSON;
  try {
    localStorage.setItem('musicUrl', 'https://www.youtube.com/watch?v=nj33MArNjC8');
    if (typeof window.parseLegendJSONAPI !== 'function' || typeof window.saveLegendJSONAPI !== 'function') throw new Error('settings export / import functions missing');
    var out = window.parseLegendJSONAPI({});
    if (out.legendSettings && 'initialMusicUrl' in out.legendSettings) fail.push('the export still carries the player address');
    window.LegendJSON = { legendSettings: { initialMusicUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' } };
    window.saveLegendJSONAPI();
    if (localStorage.getItem('musicUrl') !== 'https://www.youtube.com/watch?v=nj33MArNjC8') fail.push('importing an older export wrote its player address');
    if (document.getElementById('musicFrame')) fail.push('import made a player frame');
  } catch (e) {
    fail.push('old settings threw ' + e);
  } finally {
    window.LegendJSON = jsonBefore;
    try { if (musicBefore == null) localStorage.removeItem('musicUrl'); else localStorage.setItem('musicUrl', musicBefore); } catch (e) { }
  }

  /* 5. a [yut] invite opens the video on YouTube; an old "open the player" command does nothing */
  var openBefore = window.open, opened = [];
  try {
    if (typeof window.MsgCommands1 !== 'function') throw new Error('MsgCommands1 missing');
    window.open = function (u) { opened.push(String(u)); return null; };
    var nToast = $('#toast-container .toast').length;
    window.MsgCommands1('[yut]https://youtu.be/dQw4w9WgXcQ[/yut]', 'LMProbe', null);
    var toast = $('#toast-container .toast').filter(function () { return $(this).find('#visiturl[href*="dQw4w9WgXcQ"]').length; }).last();
    if (!toast.length) fail.push('no toast for a [yut] invite');
    else {
      if (toast.find('iframe').length) fail.push('the [yut] toast embeds a player');
      toast.find('#acceptURL').trigger('click');
      if (opened[0] !== 'https://www.youtube.com/watch?v=dQw4w9WgXcQ') fail.push('accepting the invite opened ' + (opened[0] || 'nothing'));
      toast.remove();
    }
    var n2 = $('#toast-container .toast').length;
    window.MsgCommands1('Legend.Mod&?player=LMProbe&?com=Youtube&?do=', 'LMProbe', null);
    if ($('#toast-container .toast').length > n2) { fail.push('the old "open the player" command still shows a toast'); $('#toast-container .toast').last().remove(); }
    info.toasts = [nToast, n2];
  } catch (e) {
    fail.push('chat commands threw ' + e);
  } finally {
    window.open = openBefore;
  }

  if (activeTab.length) activeTab.trigger('click');
  await sleep(300);
  window.removeEventListener('error', onErr);
  window.removeEventListener('unhandledrejection', onErr);
  if (errors.length) fail.push('page errors: ' + errors.slice(0, 3).join(' | '));
  return { fail: fail, info: info };
})()
