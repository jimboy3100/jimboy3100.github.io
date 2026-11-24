// Video skins in the page: drawing a video cell every frame creates one element and one tick,
// and a video not drawn for a minute is freed with its state; the tick stops when none is left.
(async () => {
  var fail = [], info = {};
  var url = 'https://www.legendmod.ml/probe-missing-video-skin.mp4';
  try {
    if (typeof checkVideos !== 'function' || typeof _lmVideoSkins !== 'object') throw new Error('video skins code missing');
    for (var i = 0; i < 200; i++) checkVideos(url, 'probe nick');
    var v = window.videoSkinPlayer[url];
    if (!v || v.tagName !== 'VIDEO') fail.push('no video element for the URL');
    if (!window.videoSkinSweeper) fail.push('tick not started');
    var st = _lmVideoSkins.state(url);
    if (!st || st.video !== v || !st.nicks.has('probe nick')) fail.push('state not keyed by URL with the nick');
    info.pendingPlay = !!(st && st.pending);
    st.lastDraw = Date.now() - 61000;
    _lmVideoSkins.tick();
    if (window.videoSkinPlayer[url] || _lmVideoSkins.state(url)) fail.push('video not freed after 60 s');
    if ((_lmVideoSkins.size() === 0) !== (window.videoSkinSweeper == null)) fail.push('tick running state wrong');
    info.left = _lmVideoSkins.size();
  } catch (e) {
    fail.push(String(e && e.stack || e).split('\n').slice(0, 3).join(' | '));
  }
  return { fail: fail, info: info };
})()
