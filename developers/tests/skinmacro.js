/* Custom macro checks (the skin editor moved to skins/skinchecker.html): runs ogario/modules/macroeditor.js in a
 * vm with a stub localStorage, fake timers and a fake application, so macro validation, the timeline limits and the runner (which
 * must only use application.split / feed / sendPosition and never go faster than the existing
 * macros) can be tested without a browser.
 * node developers/tests/skinmacro.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = path.join(__dirname, '..', '..', 'ogario', 'modules');
const macroSrc = fs.readFileSync(path.join(dir, 'macroeditor.js'), 'utf8');
const i18n = require('./lib/i18n-env');

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
  const toasts = [];
  const win = {
    localStorage: opts.storage || makeStorage(),
    toastr: { info(m) { toasts.push(m); }, warning(m) { toasts.push(m); }, success() {}, error() {} },
    application: { split() { sent.push(['split', now]); }, feed() { sent.push(['feed', now]); } },
    legendmod: { play: true, socket: {}, sendPosition() { sent.push(['mouse', now]); } },
    multiboxPlayerEnabled: 0,
    performance: { now: () => now }
  };
  const lis = { win: {}, doc: {} };
  const add = m => (n, f) => { (m[n] = m[n] || []).push(f); };
  const rem = m => (n, f) => { m[n] = (m[n] || []).filter(x => x !== f); };
  win.addEventListener = add(lis.win); win.removeEventListener = rem(lis.win);
  const doc = { hidden: false, createElement: () => ({}), addEventListener: add(lis.doc), removeEventListener: rem(lis.doc) };
  const ctx = {
    window: win, document: doc,
    setTimeout: (f, ms) => { timers.push({ f, at: now + (ms || 0), id: timers.length + 1 }); return timers.length; },
    clearTimeout: id => { const t = timers.find(x => x.id === id); if (t) t.f = null; },
    console, Math, JSON, Date, Number, String, Array, Object, isFinite, RegExp, Error
  };
  vm.createContext(ctx);
  /* the real translation runtime with the built language packs */
  i18n(ctx, opts.lang);
  vm.runInContext(src, ctx);
  const advance = ms => {
    const end = now + ms;
    for (;;) {
      const due = timers.filter(t => t.f && t.at <= end).sort((a, b) => a.at - b.at || a.id - b.id)[0];
      if (!due) break;
      if (due.at > now) now = due.at; /* a late timer runs at the real (later) time */
      const f = due.f; due.f = null; f();
    }
    if (end > now) now = end;
  };
  /* the page is busy for ms: time passes, no timer runs */
  const stall = ms => { now += ms; };
  const fire = m => n => (m[n] || []).slice().forEach(f => f({ type: n }));
  return { win, doc, sent, toasts, advance, stall, timers, fireWin: fire(lis.win), fireDoc: fire(lis.doc) };
}

/* ═══ Custom macros ═══ */
{
  const { win, sent, toasts, advance } = boot(macroSrc);
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
  check('macro: data validated', d.slots.length === 3 && d.slots[0].name === 'bPop/b' && d.slots[0].steps.length === 1 && d.slots[1].name === i18n.t('modules.macroeditor.defaultName', 2) && d.slots[1].name === 'Macro 2' && d.slots[2].steps.length === 0);
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
  check('macro: empty slot message from the language pack', toasts[toasts.length - 1] === i18n.t('modules.macroeditor.noSteps', 1));
  win.LMi18n.setLang('el', { save: false });
  ME.runSlot(1);
  check('macro: the message follows a language change', toasts[toasts.length - 1] === i18n.t('modules.macroeditor.noSteps', 1, 'el') && toasts[toasts.length - 1] !== i18n.t('modules.macroeditor.noSteps', 1));
  win.LMi18n.setLang('en', { save: false });
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

/* ═══ A running macro belongs to one unit, connection and life (audit A5) ═══ */
{
  const three = { steps: [{ a: 'split' }, { a: 'wait', ms: 100 }, { a: 'split' }, { a: 'wait', ms: 100 }, { a: 'split' }] };
  const fresh = () => {
    const b = boot(macroSrc);
    b.win.legendmod.play = true;
    b.win.legendmod.socket = { id: 1 };
    b.win.LMMacroEditor.setMacro(1, three);
    return b;
  };
  let b = fresh();
  b.win.LMMacroEditor.runSlot(1); b.advance(50);
  b.win.legendmod.socket = { id: 2 }; /* reconnect / server switch, same unit number */
  b.advance(1000);
  check('macro: a socket change stops the rest (same unit number)', b.sent.length === 1 && !b.win.LMMacroEditor.isRunning());

  b = fresh();
  b.win.application._lmLifeStartAt = 1000;
  b.win.LMMacroEditor.runSlot(1); b.advance(50);
  /* died and spawned again between two actions (what ogario.v4.js does to legendmod.play and
   * application._lmLifeStartAt) */
  b.win.legendmod.play = false; b.win.application._lmLifeStartAt = 0; b.advance(30);
  b.win.legendmod.play = true; b.win.application._lmLifeStartAt = 1080;
  b.advance(1000);
  check('macro: a death stops the rest', b.sent.length === 1);

  b = fresh();
  b.win.legendmod.play = false;
  check('macro: does not start while dead / in the menu', b.win.LMMacroEditor.runSlot(1) === false && b.sent.length === 0);

  b = fresh();
  b.win.LMMacroEditor.runSlot(1); b.advance(50);
  b.win.LMPractice = { on: true };
  b.advance(1000);
  check('macro: entering practice stops the rest', b.sent.length === 1);

  b = fresh();
  b.win._lmEvReplayOn = true;
  check('macro: does not start during a replay', b.win.LMMacroEditor.runSlot(1) === false);
  b.win._lmEvReplayOn = false;
  b.win.LMMacroEditor.runSlot(1); b.advance(50); b.win._lmEvReplayOn = true; b.advance(1000);
  check('macro: a replay starting stops the rest', b.sent.length === 1);

  b = fresh();
  b.doc.hidden = true;
  check('macro: does not start in a hidden tab', b.win.LMMacroEditor.runSlot(1) === false);
  b.doc.hidden = false;
  b.win.LMMacroEditor.runSlot(1); b.advance(50);
  b.doc.hidden = true; b.fireDoc('visibilitychange');
  b.advance(1000);
  check('macro: the tab going to the background stops the rest', b.sent.length === 1 && !b.win.LMMacroEditor.isRunning());
  b.doc.hidden = false;
  b.win.LMMacroEditor.runSlot(1); b.advance(50); b.fireWin('blur'); b.advance(1000);
  check('macro: the window losing focus stops the rest', b.sent.length === 2);

  /* multibox: the unit's own socket and life */
  b = fresh();
  const unit = { number: 2, active: true, socket: { id: 9 }, sendPosition() {} };
  b.win.multiboxPlayerEnabled = 2;
  b.win.getActiveSpect = n => (n === 2 ? unit : null);
  b.win.LMMacroEditor.runSlot(1); b.advance(50);
  unit.socket = { id: 10 };
  b.advance(1000);
  check('macro: the multibox unit reconnecting stops the rest', b.sent.length === 1);
  unit.socket = { id: 11 };
  b.sent.length = 0;
  b.win.legendmod.play = false; /* main dead, the unit keeps playing */
  b.win.LMMacroEditor.runSlot(1); b.advance(1000);
  check('macro: runs for a living unit while the main player is dead', b.sent.length === 3);
  b.sent.length = 0;
  b.win.LMMacroEditor.runSlot(1); b.advance(50); unit.active = false; b.advance(1000);
  check('macro: the controlled unit dying stops the rest', b.sent.length === 1);

  /* a main-thread stall: overdue actions keep their gaps instead of firing together */
  b = fresh();
  b.win.LMMacroEditor.setMacro(2, { steps: [{ a: 'split' }, { a: 'split' }, { a: 'split' }] });
  b.win.LMMacroEditor.runSlot(2);
  b.stall(300); /* every timer becomes due at once, 300 ms late */
  b.advance(1000);
  const ts = b.sent.map(s => s[1]);
  let gapsOk = ts.length === 3;
  for (let i = 1; i < ts.length; i++) if (ts[i] - ts[i - 1] < 20) gapsOk = false;
  check('macro: after a stall the overdue splits stay 20 ms apart (' + JSON.stringify(ts) + ')', gapsOk);
  check('macro: one timer pending at a time (sequential)', (() => {
    const c2 = fresh(); c2.win.LMMacroEditor.runSlot(1);
    return c2.timers.filter(x => x.f).length === 1;
  })());

  /* LMEvents death / server change stop it at once */
  b = fresh();
  const L = {};
  b.win.LMEvents = { on(n, f) { (L[n] = L[n] || []).push(f); }, off(n, f) { L[n] = (L[n] || []).filter(x => x !== f); } };
  b.win.LMMacroEditor.runSlot(1); b.advance(50);
  (L.serverChange || []).slice().forEach(f => f({ host: 'x' }));
  b.advance(1000);
  check('macro: LMEvents serverChange stops the rest', b.sent.length === 1 && !(L.serverChange || []).length);
}

console.log(fail ? fail + ' FAILED' : 'all custom macro checks passed');
process.exit(fail ? 1 : 0);
