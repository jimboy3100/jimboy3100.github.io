/* HUD editor checks: runs ogario/modules/hudeditor.js in a vm with a stub localStorage and a tiny
 * fake document (a few boxes with fixed sizes), so layout validation, clamping, snapping, the
 * stylesheet and the layouts API can be tested without a browser.
 * node developers/tests/hudeditor.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'hudeditor.js'), 'utf8');

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

/* fake elements: fixed unscaled size, the rect follows the scale of the drawn layout */
function makeDoc(boxes) {
  const head = { children: [], appendChild(e) { e.parentNode = head; this.children.push(e); return e; }, removeChild(e) { this.children = this.children.filter(x => x !== e); e.parentNode = null; } };
  const els = {};
  Object.keys(boxes).forEach(sel => {
    const b = boxes[sel];
    const inline = {};
    els[sel] = {
      offsetWidth: b.w, offsetHeight: b.h, dataset: {},
      style: {
        getPropertyPriority: p => (inline[p] ? inline[p].pr : ''),
        getPropertyValue: p => (inline[p] ? inline[p].v : ''),
        setProperty: (p, v, pr) => { inline[p] = { v, pr: pr || '' }; },
        removeProperty: p => { delete inline[p]; }
      },
      _inline: inline,
      getBoundingClientRect() { const s = b.s || 1; return { left: 0, top: 0, right: b.w * s, bottom: b.h * s, width: b.w * s, height: b.h * s }; }
    };
  });
  const doc = {
    head, documentElement: { clientWidth: 0, clientHeight: 0 }, hidden: false,
    createElement: () => ({ textContent: '', parentNode: null, style: {} }),
    getElementById: id => (id === 'lm-hud-layout' ? head.children.find(e => e.id === id) || null : null),
    querySelector: sel => els[sel] || null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  return { doc, els, head };
}

function boot(opts) {
  opts = opts || {};
  const storage = opts.storage || makeStorage();
  if (opts.stored) storage.setItem('lmHudLayouts', typeof opts.stored === 'string' ? opts.stored : JSON.stringify(opts.stored));
  const fake = makeDoc(opts.boxes || {});
  const intervals = [];
  const ctx = {
    localStorage: storage,
    innerWidth: opts.w || 1280, innerHeight: opts.h || 720,
    document: opts.noDom ? undefined : fake.doc,
    setTimeout: () => 0, clearTimeout() {},
    setInterval: f => { intervals.push(f); return intervals.length; }, clearInterval() {},
    requestAnimationFrame: f => { f(); return 1; },
    addEventListener() {},
    console, Date, Math, Number, JSON, String, Array, Object
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  i18n(ctx);
  vm.runInContext(src, ctx);
  const css = () => { const s = fake.head.children.find(e => e.id === 'lm-hud-layout'); return s ? s.textContent : null; };
  return { ctx, api: ctx.LMHudEditor, core: ctx.LMHudEditor.core, storage, css, els: fake.els, intervals };
}
const J = o => JSON.parse(JSON.stringify(o));

/* ── validation ── */
{
  const { core } = boot({ noDom: true });
  const empty = J(core.cleanStore(null));
  check('missing store: defaults', empty.active === '' && empty.list.length === 0 && empty.prefs.snap === true && empty.prefs.grid === 0);
  check('broken JSON: defaults', J(core.cleanStore('{nope')).list.length === 0);
  check('array: defaults', J(core.cleanStore([1, 2])).list.length === 0);

  const st = J(core.cleanStore({
    active: 'competitive',
    list: [
      { name: '  Competitive  ', c: { leaderboard: { h: 'r', x: 10, v: 't', y: 12.6, s: 0.8 }, bogus: { h: 'l', x: 1, v: 't', y: 1 } } },
      { name: 'COMPETITIVE', c: {} },
      { name: '', c: {} },
      { name: 7, c: {} },
      { name: '<b>Stream</b>', c: { minimap: { h: 'x', x: 1, v: 't', y: 1 }, chatBox: { h: 'l', x: 'a', v: 't', y: 3 }, time: { h: 'l', x: 1e9, v: 'b', y: -1e9, s: 99 } } },
      null,
      { name: 'Flags', c: { stats: { lock: true }, team: { hide: true, lock: 'yes' }, target: { lock: 1 } } }
    ],
    prefs: { snap: false, grid: 13 },
    links: { p1: 'bstream/b', 'bad id!': 'Flags', p2: 'missing', p3: 'flags' }
  }));
  check('names trimmed, duplicates (any case) and empty names dropped', st.list.map(l => l.name).join('|') === 'Competitive|bStream/b|Flags');
  check('active matched without case', st.active === 'Competitive');
  check('unknown component dropped', !('bogus' in st.list[0].c));
  check('offsets rounded, scale kept', JSON.stringify(st.list[0].c.leaderboard) === JSON.stringify({ h: 'r', x: 10, v: 't', y: 13, s: 0.8 }));
  check('bad anchor dropped', !('minimap' in st.list[1].c));
  check('non-number offset dropped', !('chatBox' in st.list[1].c));
  const tm = st.list[1].c.time;
  check('offsets and scale clamped to their ranges', tm.x === 10000 && tm.y === -10000 && tm.s === core.S_MAX);
  check('lock / hide only entries kept, only true counts', JSON.stringify(st.list[2].c) === JSON.stringify({ stats: { lock: true }, team: { hide: true } }));
  check('bad grid falls back to off, snap off kept', st.prefs.grid === 0 && st.prefs.snap === false);
  check('links: only valid ids to saved layouts', JSON.stringify(st.links) === JSON.stringify({ p1: 'bStream/b', p3: 'Flags' }));

  const many = { list: [] };
  for (let i = 0; i < 30; i++) many.list.push({ name: 'L' + i, c: {} });
  check('at most 20 layouts', core.cleanStore(many).list.length === core.MAX_LAYOUTS);
  check('active pointing to a missing layout is cleared', core.cleanStore({ active: 'Nope', list: [{ name: 'A', c: {} }] }).active === '');
  check('long names cut', core.cleanName('x'.repeat(80)).length === core.NAME_MAX);
  check('scale missing: 1', core.cleanEntry({ h: 'l', x: 0, v: 't', y: 0 }).s === 1);
}

/* ── anchoring, clamping ── */
{
  const { core } = boot({ noDom: true });
  const v = { w: 1000, h: 600 };
  let e = J(core.entryFromRect({ left: 20, top: 30, width: 100, height: 50 }, v, 1));
  check('top left third: left / top anchors', e.h === 'l' && e.x === 20 && e.v === 't' && e.y === 30);
  e = J(core.entryFromRect({ left: 870, top: 520, width: 100, height: 50 }, v, 0.5));
  check('bottom right third: right / bottom anchors', e.h === 'r' && e.x === 30 && e.v === 'b' && e.y === 30 && e.s === 0.5);
  e = J(core.entryFromRect({ left: 450, top: 275, width: 100, height: 50 }, v, 1));
  check('middle: centre anchors', e.h === 'c' && e.x === 0 && e.v === 'c' && e.y === 0);
  const p = core.visualPos(core.entryFromRect({ left: 870, top: 300, width: 100, height: 50 }, v, 1), 100, 50, v);
  check('visualPos round trip', p.left === 870 && p.top === 300);

  let c = core.clampEntry({ h: 'l', x: 5000, v: 't', y: 5000, s: 1 }, { w: 200, h: 100 }, v);
  check('off screen right / bottom: pulled in', c.x === 800 && c.y === 500);
  c = core.clampEntry({ h: 'r', x: -50, v: 'b', y: -20, s: 1 }, { w: 200, h: 100 }, v);
  check('negative edge offsets: back on screen', c.x === 0 && c.y === 0);
  c = core.clampEntry({ h: 'c', x: 900, v: 'c', y: -900, s: 1 }, { w: 200, h: 100 }, v);
  check('centre anchor clamped', c.x === 400 && c.y === -250);
  const orig = { h: 'l', x: 5000, v: 't', y: 0, s: 1, lock: true };
  c = core.clampEntry(orig, { w: 200, h: 100 }, v);
  check('clamping returns a copy, saved value kept, flags kept', orig.x === 5000 && c.lock === true);
  c = core.clampEntry({ h: 'l', x: 0, v: 't', y: 0, s: 1 }, { w: 200, h: 100, el: 60 }, v);
  check('part outside the box (mass column) stays on screen', c.x === 60);
  c = core.clampEntry({ h: 'l', x: 0, v: 't', y: 0, s: 2 }, { w: 800, h: 100 }, v);
  check('too wide: scaled down to fit', Math.abs(c.s - 1.25) < 0.001 && c.x === 0);
  c = core.clampEntry({ h: 'l', x: 10, v: 't', y: 10, s: 1 }, { w: 200, h: 100 }, v);
  check('inside: unchanged', c.x === 10 && c.y === 10 && c.s === 1);
  c = core.clampEntry({ h: 'r', x: 10, v: 'b', y: 10, s: 0.5 }, { w: 200, h: 100 }, { w: 915, h: 412 });
  check('phone size: inside', c.x === 10 && c.y === 10);
  c = core.clampEntry({ h: 'l', x: 700, v: 't', y: 0, s: 1 }, { w: 200, h: 100 }, { w: 1000, h: 600 });
  const c2 = core.clampEntry({ h: 'l', x: 700, v: 't', y: 0, s: 1 }, { w: 200, h: 100 }, { w: 800, h: 600 });
  check('rotation / smaller screen: clamped, bigger screen: as saved', c.x === 700 && c2.x === 600);
  check('rectIn', core.rectIn({ left: 0, top: 0, width: 10, height: 10 }, v) && !core.rectIn({ left: -2, top: 0, width: 10, height: 10 }, v) && core.rectIn({ left: -0.5, top: 0, width: 10, height: 10 }, v, 1));
}

/* ── snapping ── */
{
  const { core } = boot({ noDom: true });
  const v = { w: 1000, h: 600 };
  let s = core.snapRect({ left: 5, top: 300, width: 100, height: 50 }, [], v, { th: 8 });
  check('snaps to the left edge', s.left === 0 && s.gx === 0);
  s = core.snapRect({ left: 893, top: 100, width: 100, height: 50 }, [], v, { th: 8 });
  check('snaps to the right edge', s.left === 900 && s.gx === 1000);
  s = core.snapRect({ left: 445, top: 100, width: 100, height: 50 }, [], v, { th: 8 });
  check('snaps its centre to the screen centre', s.left === 450 && s.gx === 500);
  s = core.snapRect({ left: 30, top: 100, width: 100, height: 50 }, [], v, { th: 8 });
  check('no snap beyond the threshold', s.left === 30 && s.gx === null);
  s = core.snapRect({ left: 300, top: 213, width: 100, height: 50 }, [{ left: 300, top: 100, width: 120, height: 110 }], v, { th: 8 });
  check('snaps under another box', s.top === 210 && s.gy === 210);
  s = core.snapRect({ left: 423, top: 300, width: 100, height: 50 }, [{ left: 300, top: 100, width: 120, height: 110 }], v, { th: 8 });
  check('snaps next to another box', s.left === 420);
  s = core.snapRect({ left: 37, top: 101, width: 100, height: 50 }, [], v, { th: 8, grid: 16 });
  check('grid when nothing is near', s.left === 32 && s.top === 96);
  s = core.snapRect({ left: 5, top: 101, width: 100, height: 50 }, [], v, { th: 8, grid: 16, snap: false });
  check('snap off: grid only', s.left === 0 && s.top === 96 && s.gx === null);
  s = core.snapRect({ left: 5, top: 101, width: 100, height: 50 }, [], v, { snap: false });
  check('snap and grid off: free', s.left === 5 && s.top === 101);
}

/* ── stylesheet ── */
{
  const { core } = boot({ noDom: true });
  const css = core.cssFor('#leaderboard-hud', { h: 'r', x: 10, v: 't', y: 5, s: 0.75 }, false);
  check('right / top anchored rule', /^html body #leaderboard-hud\{/.test(css) && css.includes('right:10px!important') && css.includes('left:auto!important') &&
    css.includes('top:5px!important') && css.includes('bottom:auto!important') && css.includes('transform:scale(0.75)!important') && css.includes('transform-origin:right top!important'));
  const cc = core.cssFor('#x', { h: 'c', x: -20, v: 'c', y: 4, s: 1 }, false);
  check('centre anchored rule', cc.includes('left:calc(50% + -20px)') && cc.includes('top:calc(50% + 4px)') && cc.includes('translate(-50%,-50%) scale(1)') && cc.includes('transform-origin:center center'));
  check('hidden: display none', core.cssFor('#x', { hide: true }, false) === 'html body #x{display:none!important;}');
  check('hidden while editing: faded, still there', !core.cssFor('#x', { hide: true }, true).includes('display') && core.cssFor('#x', { hide: true }, true).includes('opacity:.35'));
  check('lock only: no position', !core.cssFor('#x', { lock: true }, false).includes('left'));
}

/* ── no active layout: nothing applied ── */
{
  const b = boot({ boxes: { '#leaderboard-hud': { w: 200, h: 300 } } });
  check('no layout: no stylesheet, no timer', b.css() === null && b.intervals.length === 0 && b.api.active() === '');
  check('no layout: owns nothing', !b.api.owns('leaderboard'));
  b.api.refresh();
  check('refresh without a layout does nothing', b.css() === null);
}

/* ── active layout from storage: applied and clamped on load ── */
{
  const b = boot({
    w: 915, h: 412,
    boxes: { '#leaderboard-hud': { w: 200, h: 300 }, '#minimap-hud': { w: 240, h: 264, s: 0.5 } },
    stored: { active: 'Mobile', list: [{ name: 'Mobile', c: { leaderboard: { h: 'l', x: 4000, v: 't', y: 0, s: 1 }, minimap: { h: 'l', x: 4, v: 'b', y: 4, s: 0.5 } } }] }
  });
  const css = b.css() || '';
  check('active layout applied at start', css.includes('#leaderboard-hud') && css.includes('#minimap-hud') && b.intervals.length === 1);
  check('clamped on load (915 wide)', css.includes('html body #leaderboard-hud{') && css.includes('left:715px!important'));
  check('saved value not changed by the clamp', JSON.parse(b.storage.getItem('lmHudLayouts')).list[0].c.leaderboard.x === 4000);
  check('owns moved boxes only', b.api.owns('leaderboard') && b.api.owns('minimap') && !b.api.owns('stats'));
  /* phone code put an !important inline transform: set aside while moved, back afterwards */
  b.els['#minimap-hud'].style.setProperty('transform', 'scale(0.65)', 'important');
  b.intervals[0]();
  check('inline !important transform set aside', !b.els['#minimap-hud']._inline.transform && b.els['#minimap-hud'].dataset.lmHeT === 'scale(0.65)');
  b.api.boost('minimap', 2);
  check('boost doubles the layout scale', (b.css() || '').includes('scale(1)'));
  b.api.boost('minimap', 0);
  check('boost off', (b.css() || '').includes('scale(0.5)'));
  b.api.applyLayout('', true);
  check('default HUD: stylesheet removed', b.css() === null);
  check('inline transform restored', b.els['#minimap-hud']._inline.transform && b.els['#minimap-hud']._inline.transform.v === 'scale(0.65)' && b.els['#minimap-hud']._inline.transform.pr === 'important');
  check('active cleared in storage', JSON.parse(b.storage.getItem('lmHudLayouts')).active === '');
}

/* ── layouts API ── */
{
  const b = boot({ boxes: { '#leaderboard-hud': { w: 200, h: 300 } } });
  const api = b.api;
  check('save a layout', api.saveLayout('Competitive', { leaderboard: { h: 'l', x: 10, v: 't', y: 10, s: 1 }, nope: { h: 'l' } }) === 'Competitive');
  check('saved validated', JSON.stringify(api.get('competitive').c) === JSON.stringify({ leaderboard: { h: 'l', x: 10, v: 't', y: 10, s: 1 } }));
  check('saving does not activate', api.active() === '' && b.css() === null);
  check('apply by name (any case)', api.applyLayout('COMPETITIVE', true) && api.active() === 'Competitive' && (b.css() || '').includes('left:10px'));
  check('apply a missing name: refused, nothing changes', api.applyLayout('Nope', true) === false && api.active() === 'Competitive');
  check('replace keeps the first spelling', api.saveLayout('competitive', { leaderboard: { h: 'l', x: 50, v: 't', y: 10, s: 1 } }) === 'Competitive' && api.list().length === 1);
  api.refreshNow();
  check('re-applied after replace', (b.css() || '').includes('left:50px'));
  check('bad name refused', api.saveLayout('  ', {}) === '');
  check('preview wins while editing', (api.setPreview({ c: { leaderboard: { h: 'r', x: 0, v: 'b', y: 0, s: 1, hide: true } }, editing: true }), (b.css() || '').includes('right:0px') && (b.css() || '').includes('opacity:.35')));
  api.setPreview(null);
  check('preview ended: active layout back', (b.css() || '').includes('left:50px'));
  check('link a settings profile', api.linkProfile('pAbc', 'Competitive') && api.profileLayout('pAbc') === 'Competitive');
  check('bad profile id refused', api.linkProfile('bad id', 'Competitive') === false);
  api.applyLayout('', true);
  api.onProfileApplied('pAbc');
  check('profile applied: its layout comes with it', api.active() === 'Competitive');
  api.onProfileApplied('pOther');
  check('profile without a layout: nothing changes', api.active() === 'Competitive');
  check('delete', api.deleteLayout('Competitive') && api.list().length === 0 && api.active() === '' && b.css() === null);
  check('links to a deleted layout dropped', api.profileLayout('pAbc') === '');
  for (let i = 0; i < 20; i++) api.saveLayout('L' + i, {});
  check('21st layout refused', api.saveLayout('One more', {}) === '' && api.list().length === 20);
  check('prefs saved', api.setPrefs({ grid: 16, snap: false }) && api.prefs().grid === 16 && api.prefs().snap === false && api.setPrefs({ grid: 5 }) && api.prefs().grid === 16);
}

/* ── storage full ── */
{
  const storage = makeStorage(60);
  const b = boot({ storage, boxes: {} });
  check('storage full: save refused, nothing kept', b.api.saveLayout('Streaming', { leaderboard: { h: 'l', x: 1, v: 't', y: 1, s: 1 } }) === '' && b.api.list().length === 0);
  check('blocked storage: no throw', (() => {
    const bad = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { } };
    const bb = boot({ storage: bad, noDom: true });
    return bb.api.list().length === 0 && bb.api.saveLayout('X', {}) === '';
  })());
}

/* ── storage blocked after layouts were saved: nothing changes unless it is saved ── */
{
  const storage = makeStorage();
  const b = boot({ storage, boxes: { '#leaderboard-hud': { w: 200, h: 300 } } });
  const api = b.api;
  api.saveLayout('A', { leaderboard: { h: 'l', x: 11, v: 't', y: 10, s: 1 } });
  api.saveLayout('B', { leaderboard: { h: 'l', x: 22, v: 't', y: 10, s: 1 } });
  api.applyLayout('A', true);
  api.linkProfile('p1', 'A');
  const disk = storage.getItem('lmHudLayouts');
  const setItem = storage.setItem;
  storage.setItem = () => { const e = new Error('blocked'); e.name = 'SecurityError'; throw e; };
  check('blocked: apply refused, the active layout stays', api.applyLayout('B', true) === false && api.active() === 'A' && (b.css() || '').includes('left:11px'));
  check('blocked: delete refused, list, active and links unchanged', api.deleteLayout('A') === false && api.list().join('|') === 'A|B' && api.active() === 'A' && api.profileLayout('p1') === 'A');
  check('blocked: link refused, links unchanged', api.linkProfile('p2', 'B') === false && !('p2' in api.links()) && api.linkProfile('p1', '') === false && api.profileLayout('p1') === 'A');
  check('blocked: the saved layouts are as before', storage.getItem('lmHudLayouts') === disk);
  storage.setItem = setItem;
  check('storage back: apply works again', api.applyLayout('B', true) === true && api.active() === 'B');
  const txt = typeof api.storeText === 'function' ? api.storeText('a') : undefined;
  check('storeText: the stored layouts with another active one, nothing changed', typeof txt === 'string' && JSON.parse(txt).active === 'A' && api.active() === 'B' && api.storeText('Nope') === null && JSON.parse(api.storeText('')).active === '');
}

/* ── frame stacking: a smaller box above a bigger one, so a box inside another can be grabbed ── */
{
  const { core } = boot();
  const f = core.frameLayers;
  check('frameLayers exists', typeof f === 'function');
  if (typeof f === 'function') {
    /* the phone case: the stats line (346x22) lies on the chat box (400x200), which comes later in the list */
    const z = f([{ width: 346, height: 22 }, null, { width: 400, height: 200 }, { width: 16, height: 16 }]);
    check('smaller box above the bigger one it lies on', z[0] > z[2] && z[3] > z[0]);
    check('no frame: no layer', z[1] === 0 && z.filter(Boolean).length === 3 && Math.min.apply(null, z.filter(Boolean)) === 1);
    const e = f([{ width: 10, height: 10 }, { width: 10, height: 10 }]);
    check('equal sizes: the later one on top (as before)', e[1] > e[0]);
  }
  /* frame names: boxes that share the top left corner (phone) no longer draw their labels at one spot */
  const ls = core.labelSpots;
  check('labelSpots exists', typeof ls === 'function');
  if (typeof ls === 'function') {
    const view = { w: 915, h: 412 };
    const R = (l, t, w, h) => ({ left: l, top: t, width: w, height: h });
    const frames = [R(4, 17, 353, 22), R(4, 4, 16, 16), R(4, 30, 165, 56), R(4, 14, 280, 306), null, R(600, 200, 100, 50)];
    const sizes = [[165, 15], [72, 15], [57, 15], [57, 15], [10, 15], [60, 15]];
    const items = frames.map((f, i) => (f ? { f, w: sizes[i][0], h: sizes[i][1] } : null));
    const handles = [R(4, 4, 28, 28), R(341, 23, 28, 28)];
    const s = ls(items, handles, view);
    const box = i => R(s[i].left, s[i].top, items[i].w, items[i].h);
    const hit = (a, b) => a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height;
    let clash = 0, off = 0;
    s.forEach((p, i) => {
      if (!p) return;
      const a = box(i);
      if (a.left < 0 || a.top < 0 || a.left + a.width > view.w || a.top + a.height > view.h) off++;
      handles.forEach(h => { if (hit(a, h)) clash++; });
      s.forEach((q, j) => { if (q && j > i && hit(a, box(j))) clash++; });
    });
    check('labels of boxes sharing a corner: none on another label or a handle', clash === 0);
    check('labels stay on screen, no frame: no label', off === 0 && s[4] === null);
    check('a lone box keeps the usual spot (above it at its left edge)', s[5].left === 600 && s[5].top === 200 + 2 - 15);
    const top = ls([{ f: R(50, 0, 200, 40), w: 60, h: 15 }], [], view)[0];
    check('a box at the top edge: label inside its top', top.left === 50 && top.top === 2);
  }
  const st = core.COMPONENTS.filter(c => c.id === 'stats')[0];
  check('stats line can be placed while the phone keeps it folded', !!(st && st.shownOnTap) && core.COMPONENTS.filter(c => c.shownOnTap).length === 1);
}

/* ── texts: the box names come from the language packs and follow a language change ── */
{
  const b = boot();
  const lb = b.core.COMPONENTS.filter(c => c.id === 'leaderboard')[0];
  check('box names from the packs, every box has one', b.api.compLabel(lb) === i18n.t('modules.hudeditor.comp.leaderboard') && b.core.COMPONENTS.every(c => b.api.compLabel(c) !== 'modules.hudeditor.comp.' + c.id));
  b.ctx.LMi18n.setLang('el');
  check('box names in Greek after a language change', b.api.compLabel(lb) === i18n.t('modules.hudeditor.comp.leaderboard', null, 'el') && b.api.compLabel(lb) !== i18n.t('modules.hudeditor.comp.leaderboard'));
}

console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
