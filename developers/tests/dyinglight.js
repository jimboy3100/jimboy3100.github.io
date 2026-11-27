// The Dying Light theme (extras/dyinglight.js, loaded by LMexpress.js when it is on) without the removed
// YouTube player: the real file is run in a vm with the theme on, and its "back to Legend defaults"
// (legenddefaultsettings, the link of extras/legendhelper.js) and the Play button work. Up to the
// removal of the player it used the player's defaultMusicUrl and musicPlayer, which are gone: turning
// the theme off threw "defaultMusicUrl is not defined" and stayed on, with its pictures, and on a page
// with the YouTube API its Play button threw "musicPlayer is not defined".
// Usage: node developers/tests/dyinglight.js [file]
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const repo = path.resolve(__dirname, '..', '..');
const file = process.argv[2] || path.join(repo, 'extras', 'dyinglight.js');
let failed = 0;
const ok = (cond, name) => { console.log((cond ? 'ok   ' : 'FAIL ') + name); if (!cond) failed++; };

function run() {
  const store = { dyinglight1load: 'yes' };
  const timers = [];
  const clicks = {};
  const vals = {};
  /* a jQuery stand-in: every call chains; val/click/css on a selector are remembered */
  function $(sel) {
    const q = new Proxy(function () {}, {
      get(_, k) {
        if (k === 'val') return function (v) { if (arguments.length) vals[sel] = v; return arguments.length ? q : (vals[sel] || ''); };
        if (k === 'click') return function (fn) { if (typeof fn === 'function') clicks[sel] = fn; return q; };
        if (k === 'length') return 1;
        return function () { return q; };
      },
      apply() { return q; }
    });
    return q;
  }
  const toastr = new Proxy({}, { get() { return function () { return $('toast'); }; } });
  const el = () => ({ style: {}, value: '', remove() {}, appendChild() {} });
  const ctx = {
    $, jQuery: $, toastr, console,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
    setTimeout: fn => { timers.push(fn); return timers.length; }, clearTimeout() {}, setInterval() { return 0; }, clearInterval() {},
    document: { createElement: el, getElementById: el, body: el(), documentElement: el() },
    window: null, history: { pushState() {} }, location: { pathname: '/' },
    dyinglight1load: 'yes', defaultSettings: {}, core: { disconnect() {} },
    /* the page may have the YouTube iframe API from elsewhere (it is no longer loaded by Legend Mod) */
    YT: {},
    /* functions of LMexpress.js the theme calls */
    btnmgs() {}, launchIntoFullscreen() {}, settrolling() {}
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  /* run the timers it set (twice: one sets the Play button handler) */
  const flush = () => { let n = 0; while (timers.length && n++ < 50) timers.shift()(); };
  flush();
  return { ctx, store, clicks, flush };
}

let r, err = null;
try { r = run(); } catch (e) { err = e; }
ok(!err, 'the theme loads with the theme on' + (err ? ' (' + err.message + ')' : ''));
if (r) {
  let playErr = null;
  const play = r.clicks['*[data-itr="page_play"]'];
  try { if (play) play(); } catch (e) { playErr = e; }
  ok(play && !playErr, 'its Play button works without a YouTube player' + (playErr ? ' (' + playErr.message + ')' : ''));
  let offErr = null;
  try { vm.runInContext('legenddefaultsettings()', r.ctx); r.flush(); } catch (e) { offErr = e; }
  ok(!offErr, 'back to Legend defaults works with the theme on' + (offErr ? ' (' + offErr.message + ')' : ''));
  ok(r.store.dyinglight1load === 'null', 'and turns the theme off (saved dyinglight1load: ' + r.store.dyinglight1load + ')');
  ok(!('musicUrl' in r.store), 'nothing is saved for the removed player (musicUrl)');
}
console.log(failed ? 'FAILED: ' + failed : 'all passed');
process.exit(failed ? 1 : 0);
