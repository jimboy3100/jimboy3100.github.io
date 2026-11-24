// WebGL skin layers are reused one at a time (no full texture-array rebuild), the reused layer's
// old keys are forgotten, and the skin cache trim / download queue helpers run in the page.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var R = window.drawRender, A = window.application;
  need('drawRender', !!R);
  if (!R) return { fail: fail, info: info };
  need('no full skin array rebuild left', typeof R._resetWebGLSkinTextureArray === 'undefined' && typeof R._skinArrayResetAllowed === 'undefined');
  ['_lmSkinLayers', '_lmSkinLayerFree', '_lmSkinLayerUsed', '_lmSkinLayerStore', '_lmSkinLayerKey'].forEach(function (f) { need(f, typeof R[f] === 'function'); });
  info.webgl = !!R.gl;
  info.frame = R._glSkinFrame || 0;
  /* layer bookkeeping on a 2-layer stand-in (live state put back right after, synchronously) */
  var saved = [R._glSkinLayers, R.glSkinMap, R.glSkinNodeMap, R._glSkinFrame, R.glSkinMaxLayers];
  try {
    R.glSkinMaxLayers = 2; R._glSkinLayers = null; R.glSkinMap = {}; R.glSkinNodeMap = new WeakMap(); R._glSkinFrame = 10;
    var a = {}, b = {}, c = {};
    var la = R._lmSkinLayerFree(); R._lmSkinLayerStore(la, a, ['a']); R.glSkinNodeMap.set(a, la); R.glSkinMap.a = la;
    var lb = R._lmSkinLayerFree(); R._lmSkinLayerStore(lb, b, ['b']); R.glSkinNodeMap.set(b, lb); R.glSkinMap.b = lb;
    R._lmSkinLayerKey(la, 'a2'); R.glSkinMap.a2 = la;
    need('layers 0 and 1 handed out in order', la === 0 && lb === 1);
    need('full and both drawn recently: nothing reused', R._lmSkinLayerFree() === -1);
    R._glSkinFrame = 12; R._lmSkinLayerUsed(lb);
    var lc = R._lmSkinLayerFree();
    need('the layer not drawn for two frames is reused', lc === 0);
    R._lmSkinLayerStore(lc, c, ['c']);
    need('reused layer: its old keys and node are forgotten', R.glSkinMap.a === undefined && R.glSkinMap.a2 === undefined && R.glSkinNodeMap.get(a) === undefined);
    need('other skins keep their layer', R.glSkinMap.b === 1 && R.glSkinNodeMap.get(b) === 1);
  } catch (e) {
    fail.push('layer bookkeeping threw: ' + e.message);
  } finally {
    R._glSkinLayers = saved[0]; R.glSkinMap = saved[1]; R.glSkinNodeMap = saved[2]; R._glSkinFrame = saved[3]; R.glSkinMaxLayers = saved[4];
  }
  try { A._lmTrimSkinCache(); } catch (e) { fail.push('_lmTrimSkinCache threw: ' + e.message); }
  info.skinUrls = A._lmSkinUse ? A._lmSkinUse.size : 0;
  var Q = window._skinLoadQueue;
  if (Q) {
    need('download queue has a cap', Q.maxQueued > 0 && typeof Q.dropQueued === 'function');
    info.queued = Q.queue.length;
  }
  return { fail: fail, info: info };
})()
