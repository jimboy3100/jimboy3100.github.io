// HUD box images (Theme > HUD: leaderboard, team list and minimap image URL): an image URL gives the
// box that image at 0.8 opacity (the phone stylesheet may set its own); emptying the URL again gives the box its normal look back (no
// image, full opacity) instead of keeping 0.8 opacity for the rest of the session. The player's
// values are put back afterwards.
(async () => {
  var fail = [], info = {};
  var rows = [['leadbPicture', 'leaderboard-hud', 'setleadbgname', 'leadbimg'],
    ['teambPicture', 'top5-hud', 'setteambgname', 'teambimg'],
    ['minimapPicture', 'minimap-hud', 'setminbgname', 'minimapbckimg']];
  var img = 'https://www.legendmod.ml/banners/icogeneral.gif';
  rows.forEach(function (r) {
    var input = document.getElementById(r[0]), box = document.getElementById(r[1]), fn = window[r[2]];
    if (!input || !box || typeof fn !== 'function') { fail.push(r[0] + ': input, box or ' + r[2] + ' missing'); return; }
    var keepVal = input.value, keepStore = null, keepStyle = box.getAttribute('style');
    try { keepStore = localStorage.getItem(r[3]); } catch (e) { }
    var before = getComputedStyle(box).opacity;
    try {
      input.value = img; fn();
      var on = [box.style.opacity, /icogeneral/.test(getComputedStyle(box).backgroundImage)];
      input.value = ''; fn();
      var off = [getComputedStyle(box).opacity, getComputedStyle(box).backgroundImage, box.style.opacity];
      info[r[1]] = { before: before, image: on, emptied: off };
      if (on[0] !== '0.8' || !on[1]) fail.push(r[1] + ' with an image URL: opacity ' + on[0] + ', image ' + on[1]);
      if (off[0] !== before || off[2] !== '') fail.push(r[1] + ' after emptying the image URL: opacity ' + off[0] + ' (normal look ' + before + ')');
      if (off[1] !== 'none') fail.push(r[1] + ' after emptying the image URL: background-image ' + off[1]);
    } finally {
      input.value = keepVal;
      try { if (keepStore == null) localStorage.removeItem(r[3]); else localStorage.setItem(r[3], keepStore); } catch (e) { }
      window[r[3]] = keepStore || '';
      if (keepStyle == null) box.removeAttribute('style'); else box.setAttribute('style', keepStyle);
    }
  });
  return { fail: fail, info: info };
})()
