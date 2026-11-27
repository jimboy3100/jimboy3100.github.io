// Theme > HUD / Minimap images of the leaderboard, team list and minimap boxes (localStorage leadbimg,
// teambimg, minimapbckimg). They came only from the last step of LMexpress.js's start (triggerLMbtns),
// so on some loads the HUD was on screen without them for seconds, for the whole session when anything
// earlier in that start threw, and for the whole session when one fetch of the image failed.
// 1. window.lmHudBg from ogario/ogario.v4.js in Node: restore() applies the saved images, a failed fetch
//    is tried again and the box is shown with the image once it loads (not over a chat command's
//    image), an empty URL gives the box its normal look, the same URL again does not restart the load,
//    and being back online tries again after the last retry.
// 2. play.html loaded several times (desktop and phone; needs Chrome, skipped without it) with the three
//    images saved: each box has its image the moment the HUD is added to the page, still has it after
//    the load, a theme change, a resize and the fields losing focus; and once more with an error thrown
//    in LMexpress.js's start (before the images were restored there): the images are there all the same.
// Usage: node developers/tests/hudbgimage.js [--secs N] [--runs N] [--ref REV] [--node-only]
//   --ref REV: test ogario.v4.js and LMexpress.js of that revision instead (e.g. the one before the fix)
'use strict';
const { spawnSync, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const here = __dirname;
const repo = path.resolve(here, '..', '..');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const secs = Number(opt('--secs', 14));
const runs = Math.max(1, Number(opt('--runs', 2)));
const ref = opt('--ref', null);
const nodeOnly = args.indexOf('--node-only') >= 0;

let failed = 0;
const check = (name, ok, more) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || !more ? '' : ': ' + more)); if (!ok) failed++; };

const out = path.join(here, 'out', 'hudbgimage-' + Date.now());
fs.mkdirSync(out, { recursive: true });
const src = (rel) => ref ? execFileSync('git', ['-C', repo, 'show', ref + ':' + rel], { encoding: 'utf8', maxBuffer: 64 * 1048576 }) : fs.readFileSync(path.join(repo, rel), 'utf8');
const ogSrc = src('ogario/ogario.v4.js');
let lmxSrc = src('LMexpress/LMexpress.js');

/* ---------- 1. window.lmHudBg in Node ---------- */
(function nodePart() {
  const a = ogSrc.indexOf('window.lmHudBg = (function () {');
  const b = a >= 0 ? ogSrc.indexOf('\n})();', a) : -1;
  check('window.lmHudBg in ogario.v4.js', a >= 0 && b > a);
  if (!(a >= 0 && b > a)) return;
  const code = ogSrc.slice(a, b + 6);
  const mk = () => {
    const els = {}, timers = [], images = [], listeners = {}, store = {};
    ['#leaderboard-hud', '#top5-hud', '#minimap-hud'].forEach(s => { els[s] = { style: { backgroundImage: '', opacity: '' }, writes: [] }; });
    /* style writes recorded (the image off and on again after a failed fetch) */
    Object.keys(els).forEach(s => { const st = els[s].style, w = els[s].writes; let bi = ''; Object.defineProperty(st, 'backgroundImage', { get: () => bi, set: v => { bi = v; w.push(v); } }); });
    const fail = new Set();
    function Image() { images.push(this); }
    Object.defineProperty(Image.prototype, 'src', { set(v) { this._src = v; const me = this; timers.push({ at: 0, fn: () => (fail.has(v) && fail.size ? (me.onerror && me.onerror()) : (me.onload && me.onload())), img: true }); }, get() { return this._src; } });
    const ctx = {
      Image, Math, Object,
      document: { querySelector: s => els[s] || null },
      getComputedStyle: el => ({ backgroundImage: el.style.backgroundImage }),
      localStorage: { getItem: k => (k in store ? store[k] : null) },
      setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
      clearTimeout: id => { if (timers[id - 1]) timers[id - 1].fn = () => { }; }
    };
    ctx.window = ctx;
    ctx.addEventListener = (t, fn) => { listeners[t] = fn; };
    vm.createContext(ctx);
    vm.runInContext(code, ctx);
    /* runs the pending image loads and timers (in order) until none is left or n steps */
    const flush = (n) => { for (let i = 0; i < (n || 50); i++) { const t = timers.find(x => !x.done); if (!t) return; t.done = true; t.fn(); } };
    return { api: ctx.lmHudBg, els, timers, images, listeners, store, fail, flush };
  };
  const U = 'https://i.example/lb.gif', U2 = 'https://i.example/tb.png';
  let e = mk();
  e.store.leadbimg = U; e.store.teambimg = 'null'; e.store.minimapbckimg = U2;
  e.api.restore(); e.flush();
  check('restore() applies the saved images', e.els['#leaderboard-hud'].style.backgroundImage === 'url("' + U + '")' && e.els['#leaderboard-hud'].style.opacity === '0.8' &&
    e.els['#minimap-hud'].style.backgroundImage === 'url("' + U2 + '")' && e.els['#minimap-hud'].style.opacity === '0.8', JSON.stringify(e.els));
  check('restore() leaves a box without a saved image alone', e.els['#top5-hud'].style.backgroundImage === '' && e.els['#top5-hud'].style.opacity === '');
  const n0 = e.images.length;
  e.api.apply('#leaderboard-hud', U); e.flush();
  check('the same image again does not load it again', e.images.length === n0, e.images.length + ' loads');
  e.api.apply('#leaderboard-hud', '');
  check('an empty URL gives the box its normal look', e.els['#leaderboard-hud'].style.backgroundImage === '' && e.els['#leaderboard-hud'].style.opacity === '');

  /* a fetch that fails twice, then loads */
  e = mk();
  e.fail.add(U);
  e.api.apply('#leaderboard-hud', U);
  e.flush(1); e.flush(1); /* first load fails, retry timer runs */
  e.flush(1); e.flush(1); /* second load fails, retry timer runs */
  e.fail.clear();
  e.flush();
  const w = e.els['#leaderboard-hud'].writes;
  check('a failed image fetch is tried again', e.images.length === 3, e.images.length + ' loads');
  const retryMs = e.timers.filter(t => t.ms).map(t => t.ms);
  check('the retries wait longer each time', retryMs.length === 2 && retryMs[0] >= 1000 && retryMs[1] > retryMs[0], JSON.stringify(retryMs));
  check('the box shows the image again once it loads', w.length === 3 && w[1] === 'none' && w[2] === 'url("' + U + '")', JSON.stringify(w));

  /* a chat command's image shown meanwhile is not replaced by a late load */
  e = mk();
  e.fail.add(U);
  e.api.apply('#top5-hud', U);
  e.flush(1);
  e.els['#top5-hud'].style.backgroundImage = 'url("https://www.legendmod.ml/banners/icogeneral.gif")';
  e.fail.clear(); e.flush();
  check('a late load leaves a chat command\'s image alone', e.els['#top5-hud'].style.backgroundImage.indexOf('icogeneral') >= 0, e.els['#top5-hud'].style.backgroundImage);
  e.api.apply('#top5-hud', U);
  check('the chat command puts the player\'s image back', e.els['#top5-hud'].style.backgroundImage === 'url("' + U + '")');

  /* every retry failed: back online tries again, and so does the field losing focus */
  e = mk();
  e.fail.add(U);
  e.api.apply('#minimap-hud', U); e.flush();
  const nFail = e.images.length;
  check('it stops after a few retries', nFail >= 4 && nFail <= 10 && !e.timers.some(t => !t.done), nFail + ' loads');
  e.fail.clear();
  if (e.listeners.online) e.listeners.online();
  e.flush();
  check('back online it tries again', e.images.length === nFail + 1, (e.images.length - nFail) + ' new loads');
  e = mk(); e.fail.add(U); e.api.apply('#minimap-hud', U); e.flush(); e.fail.clear();
  const nF2 = e.images.length;
  e.api.apply('#minimap-hud', U); e.flush();
  check('after the last retry the field losing focus tries again', e.images.length === nF2 + 1);
})();

/* ---------- 2. play.html in headless Chrome ---------- */
const IMG = { leadbimg: 'https://www.legendmod.ml/banners/icogeneral.gif', teambimg: 'https://www.legendmod.ml/banners/icoeucid.gif', minimapbckimg: 'https://www.legendmod.ml/banners/static/img/pattern.png' };
/* SMOKE_STORAGE is evaluated before the page's scripts: it also watches for the HUD being added and
 * notes each box's image at that moment (a MutationObserver callback runs right after the script
 * that added it) and when each box first gets it */
const hook = `(function () {
  var now = function () { return Math.round(performance.now()); }, t0 = now(), ids = ['leaderboard-hud', 'top5-hud', 'minimap-hud'];
  window.__hbHud = { seen: null, atSeen: null, first: {} };
  try {
    var mo = new MutationObserver(function () {
      var h = window.__hbHud;
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (h.seen == null) { h.seen = now() - t0; h.atSeen = {}; ids.forEach(function (j) { var e2 = document.getElementById(j); h.atSeen[j] = e2 ? e2.style.backgroundImage : null; }); }
        if (h.first[id] == null && /url\\(/.test(el.style.backgroundImage)) h.first[id] = now() - t0 - h.seen;
      });
    });
    mo.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  } catch (e) { }
  return ${JSON.stringify(IMG)};
})()`;

const probe = `(async () => {
  var fail = [], info = {}, IMG = ${JSON.stringify(IMG)};
  var BOX = { 'leaderboard-hud': 'leadbimg', 'top5-hud': 'teambimg', 'minimap-hud': 'minimapbckimg' };
  var wait = async function (c, ms) { var t0 = Date.now(); while (!c() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return c(); };
  /* a loaded machine can take longer than the smoke seconds to build the HUD and start */
  var h = window.__hbHud || {};
  await wait(function () { return h.seen != null && !!window.LMstarted; }, 40000);
  info.seenAt = h.seen; info.atSeen = h.atSeen; info.firstImageAfterHud = h.first;
  if (h.seen == null) fail.push('the HUD was never added');
  Object.keys(BOX).forEach(function (id) {
    if (!h.atSeen || String(h.atSeen[id] || '').indexOf(IMG[BOX[id]]) < 0) fail.push(id + ' had no image when the HUD was added: ' + JSON.stringify(h.atSeen && h.atSeen[id]));
  });
  var check = function (when) {
    Object.keys(BOX).forEach(function (id) {
      var el = document.getElementById(id), cs = el && getComputedStyle(el);
      if (!cs || cs.backgroundImage.indexOf(IMG[BOX[id]]) < 0 || cs.opacity !== '0.8') fail.push(id + ' ' + when + ': ' + (cs ? cs.backgroundImage.slice(0, 80) + ' opacity ' + cs.opacity : 'missing'));
    });
  };
  info.LMstarted = !!window.LMstarted;
  /* the images themselves loaded */
  info.loaded = await Promise.all(Object.keys(BOX).map(function (id) { return new Promise(function (r) { var i = new Image(); i.onload = function () { r(i.naturalWidth > 0); }; i.onerror = function () { r(false); }; i.src = IMG[BOX[id]]; }); }));
  check('after the load');
  try { Settings.setTheme(); } catch (e) { fail.push('setTheme threw: ' + e); }
  check('after a theme change');
  window.dispatchEvent(new Event('resize'));
  await new Promise(function (r) { setTimeout(r, 300); });
  check('after a resize');
  ['#minimapPicture', '#leadbPicture', '#teambPicture'].forEach(function (s) { var f = $(s); if (f.length) { f.trigger('focus'); f.trigger('blur'); } });
  check('after the fields lost focus');
  Object.keys(BOX).forEach(function (id) { if (localStorage.getItem(BOX[id]) !== IMG[BOX[id]]) fail.push(BOX[id] + ' saved value changed: ' + localStorage.getItem(BOX[id])); });
  info.statsBg = getComputedStyle(document.getElementById('stats-hud')).backgroundColor;
  if (info.statsBg !== 'rgba(0, 0, 0, 0.4)') fail.push('stats panel colour ' + info.statsBg);
  return JSON.stringify({ fail: fail, info: info });
})()`;
fs.writeFileSync(path.join(out, 'probe.js'), probe);

const THROW = 'hudbgimage probe: an error in the start';
function smoke(name, mobile, swap) {
  const dir = path.join(out, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(path.join(out, 'probe.js'), path.join(dir, 'probe.js'));
  const env = Object.assign({}, process.env, { SMOKE_STORAGE: hook });
  const sw = [];
  if (ref) {
    fs.writeFileSync(path.join(out, 'og-ref.js'), ogSrc);
    sw.push('ogario/ogario.v4.js=' + path.join(out, 'og-ref.js'));
  }
  if (swap || ref) {
    fs.writeFileSync(path.join(out, name + '-lmx.js'), swap || lmxSrc);
    sw.push('LMexpress/LMexpress.js=' + path.join(out, name + '-lmx.js'));
  }
  if (sw.length) env.SMOKE_SWAP = sw.join(';');
  const argv = [path.join(here, 'smoke.js'), repo, dir, String(secs)];
  if (mobile) argv.push('https://www.legendmod.ml/play.html', 'mobile');
  const r = spawnSync(process.execPath, argv, { encoding: 'utf8', timeout: (secs + 150) * 1000, env });
  const text = (r.stdout || '') + (r.stderr || '');
  if (/chrome not found/.test(text)) return 'skip';
  const file = path.join(dir, 'result.json');
  try { fs.rmSync(path.join(dir, 'profile'), { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
  if (!fs.existsSync(file)) { check(name + ': smoke run', false, text.slice(0, 800)); return null; }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function judge(name, res, allow) {
  if (!res) return;
  const errs = (res.errors || []).filter(x => !(allow && x.indexOf(allow) >= 0));
  check(name + ': no page errors', errs.length === 0, errs.join(' / ').slice(0, 600));
  if (allow) check(name + ': the start-up error was thrown', (res.errors || []).some(x => x.indexOf(allow) >= 0), 'the patch did not take');
  let p = null;
  try { p = JSON.parse(res.probe); } catch (e) { }
  check(name + ': probe ran', !!p, String(res.probe).slice(0, 300));
  if (!p) return;
  console.log('     ' + JSON.stringify(p.info));
  check(name + ': HUD images there from the start and kept', p.fail.length === 0, p.fail.join(', '));
}

if (!nodeOnly) {
  const plan = [];
  for (let i = 0; i < runs; i++) plan.push(['desktop-' + (i + 1), false]);
  plan.push(['phone', true]);
  let skipped = false;
  for (const [name, mobile] of plan) {
    const res = smoke(name, mobile);
    if (res === 'skip') { console.log('SKIP chrome not found'); skipped = true; break; }
    judge(name, res);
  }
  if (!skipped) {
    /* an error in LMexpress.js's start before it restored the images (as the Rounded HUD notice and
     * the stopwatch threw on 26.11) */
    const at = 'function triggerLMbtns() {';
    check('LMexpress.js has triggerLMbtns', lmxSrc.indexOf(at) >= 0);
    if (lmxSrc.indexOf(at) >= 0) {
      const res = smoke('start-error', false, lmxSrc.replace(at, at + ' throw new Error(' + JSON.stringify(THROW) + ');'));
      judge('start-error', res, THROW);
    }
  }
}
try { if (!failed) fs.rmSync(out, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
