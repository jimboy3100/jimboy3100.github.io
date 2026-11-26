// Video skin "too long" warning: the video's src (the address the skin is played with, after
// checkSkinURL) was compared with the raw skin field, so a link typed without https:// never got
// the warning; and the skin preview and the profile box check the same video, so a correct link
// showed it twice. Runs the real checkVideos3 on stand-in videos; the field is put back after.
(async () => {
  var fail = [], info = {};
  if (typeof checkVideos3 !== 'function' || typeof toastr === 'undefined' || !window.application) return { skip: 'no checkVideos3' };
  var skin = $('#skin'), saved = skin.val(), savedWarned = checkVideos3._warned, made = [];
  var count = function (run) {
    var before = $('#toast-container > .toast').toArray();
    run();
    var added = $('#toast-container > .toast').toArray().filter(function (t) { return before.indexOf(t) === -1; });
    made = made.concat(added);
    return added.length;
  };
  var vid = function (src, dur) { return { readyState: 1, src: src, duration: dur, videoWidth: 640 }; };
  try {
    checkVideos3._warned = null;
    skin.val('i.imgur.com/probeLongA.mp4');
    var n = count(function () { checkVideos3(vid('https://i.imgur.com/probeLongA.mp4', 400)); });
    info.noScheme = n;
    if (n !== 1) fail.push('a long video typed without https:// warned ' + n + ' times (expected 1)');
    skin.val('https://i.imgur.com/probeLongB.mp4');
    n = count(function () {
      checkVideos3(vid('https://i.imgur.com/probeLongB.mp4', 400)); /* skin preview */
      checkVideos3(vid('https://i.imgur.com/probeLongB.mp4', 400)); /* profile box */
    });
    info.twoBoxes = n;
    if (n !== 1) fail.push('preview + profile box warned ' + n + ' times (expected 1)');
    n = count(function () { checkVideos3(vid('https://i.imgur.com/probeShort.mp4', 400)); });
    if (n) fail.push('a video that is not the skin in the field warned');
    skin.val('https://i.imgur.com/probeShort.mp4');
    n = count(function () { checkVideos3(vid('https://i.imgur.com/probeShort.mp4', 30)); });
    if (n) fail.push('a short video warned');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    skin.val(saved);
    checkVideos3._warned = savedWarned;
    made.forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
  }
  return { fail: fail, info: info };
})()
