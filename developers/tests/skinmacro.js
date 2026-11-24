/* Custom macro checks (the skin editor moved to skins/skinchecker.html): runs ogario/modules/macroeditor.js in a
 * vm with a stub localStorage, fake timers and a fake application, so macro validation, the timeline limits and the runner (which
 * must only use application.split / feed / sendPosition and never go faster than the existing
 * macros) can be tested without a browser.
 * node developers/tests/skinmacro.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = path.join(__dirname, '..', '..', 'ogario', 'modules');
const macroSrc = fs.readFileSync(path.join(dir, 'macroeditor.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function makeStorage(limit) {
  const data = {};
  return {
    data,
    getItem: k => (Object.prototype.hasOwnProperty.call(data, k) ? data[k] : null),
    setItem: (k, v) => {
      v = String(v);
      if (limit && v.length > limit) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
      data[k] = v;
    },
    removeItem: k => { delete data[k]; }
  };
}

function boot(src, opts) {
  opts = opts || {};
  const timers = [];
  let now = 0;
  const sent = [];
  const win = {
    localStorage: opts.storage || makeStorage(),
    toastr: { info() {}, warning() {}, success() {}, error() {} },
    application: { split() { sent.push(['split', now]); }, feed() { sent.push(['feed', now]); } },
    legendmod: { sendPosition() { sent.push(['mouse', now]); } },
    multiboxPlayerEnabled: 0,
    performance: { now: () => now }
  };
  const ctx = {
    window: win, document: { createElement: () => ({}), addEventListener() {} },
    setTimeout: (f, ms) => { timers.push({ f, at: now + (ms || 0), id: timers.length + 1 }); return timers.length; },
    clearTimeout: id => { const t = timers.find(x => x.id === id); if (t) t.f = null; },
    console, Math, JSON, Date, Number, String, Array, Object, isFinite, RegExp, Error
  };
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  const advance = ms => {
    const end = now + ms;
    for (;;) {
      const due = timers.filter(t => t.f && t.at <= end).sort((a, b) => a.at - b.at || a.id - b.id)[0];
      if (!due) break;
      now = due.at;
      const f = due.f; due.f = null; f();
    }
    now = end;
  };
  return { win, sent, advance, timers };
}

/* ═══ Custom macros ═══ */
{
  const { win, sent, advance } = boot(macroSrc);
  const ME = win.LMMacroEditor;
  check('macro: LMMacroEditor defined', !!(ME && ME.core && typeof ME.runSlot === 'function'));
  const c = ME.core, L = c.LIMITS;
  check('macro: limits match the existing macros', L.gapSplit === 20 && L.gapFeed === 10 && L.slots === 3);

  check('macro: step validation', JSON.stringify([
    c.cleanStep({ a: 'split', n: 99 }), c.cleanStep({ a: 'feed' }), c.cleanStep({ a: 'wait', ms: 1 }),
    c.cleanStep({ a: 'wait', ms: 99999 }), c.cleanStep({ a: 'mouse', n: 5 }), c.cleanStep({ a: 'eval' }), c.cleanStep(null)
  ]) === JSON.stringify([{ a: 'split', n: L.maxRepeat }, { a: 'feed', n: 1 }, { a: 'wait', ms: L.gapFeed }, { a: 'wait', ms: L.maxWait }, { a: 'mouse' }, null, null]));
  const many = []; for (let i = 0; i < 40; i++) many.push({ a: 'feed' });
  check('macro: at most ' + L.maxSteps + ' steps', c.cleanMacro({ steps: many }).steps.length === L.maxSteps);
  const d = c.cleanData('{"slots":[{"name":"<b>Pop</b>\\u0000","steps":[{"a":"split"},{"a":"x"}]},5]}');
  check('macro: data validated', d.slots.length === 3 && d.slots[0].name === 'bPop/b' && d.slots[0].steps.length === 1 && d.slots[1].name === 'Macro 2' && d.slots[2].steps.length === 0);
  check('macro: broken JSON -> empty slots', c.cleanData('{x').slots.every(m => m.steps.length === 0));

  /* timeline */
  const p1 = c.compile([{ a: 'split' }, { a: 'split' }, { a: 'wait', ms: 200 }, { a: 'split' }]);
  check('macro: back-to-back splits moved to 20 ms', JSON.stringify(p1.events.map(e => e.t)) === '[0,20,220]' && p1.moved === 1);
  const p2 = c.compile([{ a: 'feed', n: 3 }, { a: 'split' }]);
  check('macro: feed gap 10 ms, split after feed 20 ms', JSON.stringify(p2.events.map(e => [e.a, e.t])) === '[["feed",0],["feed",10],["feed",20],["split",40]]');
  check('macro: repeats are not counted as moved', p2.moved === 1);
  const p3 = c.compile([{ a: 'split' }, { a: 'wait', ms: 5 }, { a: 'split' }]);
  check('macro: a 5 ms wait cannot beat the split gap', p3.events[1].t === 20);
  const p4 = c.compile([{ a: 'wait', ms: 2000 }, { a: 'wait', ms: 2000 }, { a: 'wait', ms: 2000 }, { a: 'split' }]);
  check('macro: actions after 5 s are dropped', p4.events.length === 0 && p4.dropped === 1 && p4.total <= L.maxTotal);
  const big = []; for (let i = 0; i < 24; i++) big.push({ a: 'feed', n: 8 });
  const p5 = c.compile(big);
  check('macro: at most ' + L.maxEvents + ' actions per run', p5.events.length === L.maxEvents && p5.dropped === 24 * 8 - L.maxEvents);
  let okGaps = true;
  [p1, p2, p3, p5].forEach(p => { for (let i = 1; i < p.events.length; i++) if (p.events[i].t - p.events[i - 1].t < c.minGap(p.events[i - 1].a, p.events[i].a)) okGaps = false; });
  check('macro: no two actions closer than the minimum gap', okGaps);
  check('macro: compile does not change its input', (() => { const st = [{ a: 'split', n: 2 }]; c.compile(st); return st[0].n === 2 && st.length === 1; })());

  /* runner */
  check('macro: empty slot does not run', ME.runSlot(1) === false && sent.length === 0);
  ME.setMacro(1, { name: 'Pop', steps: [{ a: 'mouse' }, { a: 'split' }, { a: 'wait', ms: 100 }, { a: 'split' }, { a: 'feed', n: 2 }] });
  check('macro: saved to storage', JSON.parse(win.localStorage.getItem(c.KEY)).slots[0].name === 'Pop');
  check('macro: run starts', ME.runSlot(1) === true && ME.isRunning());
  check('macro: first action sent at once', sent.length === 1 && sent[0][0] === 'mouse');
  check('macro: a second press while running is ignored', ME.runSlot(1) === false);
  advance(1000);
  check('macro: actions sent through the game functions in order', JSON.stringify(sent.map(s => s[0])) === '["mouse","split","split","feed","feed"]');
  check('macro: sent at the planned times', JSON.stringify(sent.map(s => s[1])) === '[0,20,120,140,150]');
  check('macro: finished', !ME.isRunning());

  sent.length = 0;
  ME.setMacro(2, { steps: [{ a: 'split' }, { a: 'wait', ms: 100 }, { a: 'split' }, { a: 'wait', ms: 100 }, { a: 'split' }] });
  ME.runSlot(2);
  advance(50);
  win.multiboxPlayerEnabled = 2;
  advance(1000);
  check('macro: stops when the multibox unit switches', sent.length === 1 && !ME.isRunning());
  win.multiboxPlayerEnabled = 0;

  sent.length = 0;
  ME.runSlot(2); ME.stop(); advance(1000);
  check('macro: stop cancels the rest', sent.length === 1 && !ME.isRunning());

  check('macro: run("run", n) runs a slot', (() => { sent.length = 0; const r = ME.run('run', 1); advance(1000); return r === true && sent.length === 5; })());
  check('macro: slot numbers clamped', (() => { sent.length = 0; ME.runSlot(99); advance(1000); return sent.length === 0; })());

  /* storage full / blocked */
  const st = makeStorage(10);
  const b2 = boot(macroSrc, { storage: st });
  check('macro: storage full -> setMacro reports false, no throw', b2.win.LMMacroEditor.setMacro(1, { steps: [{ a: 'split' }] }) === false);
  const b3 = boot(macroSrc, { storage: { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() {} } });
  check('macro: blocked storage at load -> empty slots', b3.win.LMMacroEditor.macros().slots.length === 3);
  /* existing saved macros load */
  const st2 = makeStorage();
  st2.setItem('lmCustomMacros', JSON.stringify({ v: 1, slots: [{ name: 'A', steps: [{ a: 'feed', n: 2 }] }] }));
  check('macro: saved macros load', boot(macroSrc, { storage: st2 }).win.LMMacroEditor.macros().slots[0].steps[0].n === 2);
  /* clearing every slot removes the key */
  ME.setMacro(1, null); ME.setMacro(2, null);
  check('macro: no macros -> storage key removed', win.localStorage.getItem(c.KEY) === null);
}

console.log(fail ? fail + ' FAILED' : 'all custom macro checks passed');
process.exit(fail ? 1 : 0);
