// Home tab skin field: a skin link typed without https:// (as players paste i.imgur.com/... links)
// is saved and played as https://... (checkSkinURL), and the previews show that image too. Until
// 3.682 the previews loaded the typed text as a path on this site and stayed empty. Typed through
// the browser's own text input into the focused field; the field and profile are put back after.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var app = window.application, skin = document.getElementById('skin');
  if (!app || !skin || typeof profiles === 'undefined') return { skip: 'no skin field' };
  var sel = app.selectedProfile, savedVal = skin.value, savedUrl = profiles[sel] && profiles[sel].skinURL;
  var typed = 'www.legendmod.ml/banners/icon32croped.ico.gif', want = 'https://' + typed;
  var loaded = function (box) {
    var img = $(box).find('img').filter(function () { return this.src === want; })[0];
    return !!(img && img.complete && img.naturalWidth > 0);
  };
  try {
    skin.focus();
    skin.select();
    if (!document.execCommand('insertText', false, typed)) { skin.value = typed; $(skin).trigger('input'); }
    for (var w = 0; w < 40 && !(loaded('#skin-preview') && loaded('#profile-' + sel)); w++) await sleep(250);
    info.saved = profiles[sel] && profiles[sel].skinURL;
    if (info.saved !== want) fail.push('profile skin is ' + info.saved + ', expected ' + want);
    if (!loaded('#skin-preview')) fail.push('the skin preview does not show ' + want + ' (' + ($('#skin-preview img').attr('src') || 'no image') + ')');
    if (!loaded('#profile-' + sel)) fail.push('the profile box does not show ' + want + ' (' + ($('#profile-' + sel + ' img').attr('src') || 'no image') + ')');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    skin.value = savedVal;
    $(skin).trigger('input');
    if (profiles[sel]) profiles[sel].skinURL = savedUrl;
    try { app.saveSettings(profiles, 'ogarioPlayerProfiles'); } catch (e) { }
    skin.blur();
  }
  return { fail: fail, info: info };
})()
