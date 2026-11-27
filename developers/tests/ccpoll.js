/* Command Centre without a polling timer: ogario/modules/commandcentre.js runs in a vm with a
 * small fake document. The Tools tab button is added once (at start when the Tools tab is there,
 * else when LMexpress.js calls LMCommandCentre.addMenuButton after building it) and stays; no
 * setInterval runs while the quick bar option is off; turning it on (switch or settingsChange
 * from a profile) starts the one bar timer, turning it off stops it.
 * node developers/tests/ccpoll.js [commandcentre.js] [--old <older commandcentre.js>] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const args = process.argv.slice(2);
const oi = args.indexOf('--old');
const oldPath = oi >= 0 ? args.splice(oi, 2)[1] : null;
const srcPath = args[0] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'commandcentre.js');
const lmxPath = path.join(__dirname, '..', '..', 'LMexpress', 'LMexpress.js');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function makeEl(doc, tag) {
  const el = {
    tagName: String(tag || 'div').toUpperCase(), id: '', className: '', textContent: '', title: '', type: '',
    children: [], parentNode: null, style: { cssText: '', setProperty() {}, removeProperty() {} }, dataset: {}, attrs: {},
    _ls: {},
    get firstChild() { return this.children[0] || null; },
    get nextSibling() { const p = this.parentNode; if (!p) return null; const i = p.children.indexOf(this); return p.children[i + 1] || null; },
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    appendChild(c) { return this.insertBefore(c, null); },
    insertBefore(c, ref) {
      if (c.parentNode) c.parentNode.removeChild(c);
      const i = ref ? this.children.indexOf(ref) : -1;
      if (i >= 0) this.children.splice(i, 0, c); else this.children.push(c);
      c.parentNode = this; return c;
    },
    removeChild(c) { this.children = this.children.filter(x => x !== c); c.parentNode = null; return c; },
    setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'id') this.id = String(v); },
    getAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k) ? this.attrs[k] : null; },
    removeAttribute(k) { delete this.attrs[k]; },
    hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attrs, k); },
    addEventListener(t, f) { (this._ls[t] = this._ls[t] || []).push(f); },
    removeEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    contains(x) { for (; x; x = x.parentNode) if (x === this) return true; return false; },
    closest() { return null; },
    getBoundingClientRect() { return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
    focus() {}, blur() {}
  };
  return el;
}
function makeDoc() {
  const doc = { _ls: {}, hidden: false, readyState: 'complete' };
  doc.createElement = t => makeEl(doc, t);
  doc.createTextNode = t => ({ textContent: String(t), parentNode: null });
  doc.documentElement = makeEl(doc, 'html');
  doc.body = makeEl(doc, 'body');
  doc.head = makeEl(doc, 'head');
  doc.documentElement.appendChild(doc.head);
  doc.documentElement.appendChild(doc.body);
  const find = (el, id) => { if (el.id === id) return el; for (const c of el.children || []) { const r = find(c, id); if (r) return r; } return null; };
  doc.getElementById = id => find(doc.documentElement, id);
  doc.querySelector = () => null;
  doc.querySelectorAll = () => [];
  doc.addEventListener = (t, f) => { (doc._ls[t] = doc._ls[t] || []).push(f); };
  doc.removeEventListener = () => {};
  doc.activeElement = doc.body;
  return doc;
}
/* the Tools tab as LMexpress.js builds it: #legend with the User Scripts button */
function buildTools(doc) {
  const legend = makeEl(doc, 'div'); legend.id = 'legend';
  const us = makeEl(doc, 'button'); us.id = 'OpenuserScripts';
  const after = makeEl(doc, 'button'); after.id = 'SpecialDealsBtn';
  legend.appendChild(us); legend.appendChild(after);
  doc.body.appendChild(legend);
}

function boot(src, opts) {
  const doc = makeDoc();
  if (opts.toolsFirst) buildTools(doc);
  const intervals = new Map(); let nextId = 1, started = 0;
  const timeouts = [];
  const evs = {};
  const ctx = {
    console, Date, Math, JSON,
    document: doc,
    setInterval(f, ms) { const id = nextId++; intervals.set(id, { f, ms }); started++; return id; },
    clearInterval(id) { intervals.delete(id); },
    setTimeout(f) { timeouts.push(f); return nextId++; },
    clearTimeout() {},
    requestAnimationFrame(f) { timeouts.push(f); return nextId++; },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    innerWidth: 1280, innerHeight: 720,
    addEventListener() {}, removeEventListener() {},
    getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
    defaultmapsettings: { commandCentreBar: !!opts.barOn },
    LMEvents: {
      on(n, f) { (evs[n] = evs[n] || []).push(f); },
      off() {},
      emit(n, d) { (evs[n] || []).forEach(f => f(d)); },
      _has(n) { return !!(evs[n] && evs[n].length); }
    }
  };
  ctx.window = ctx;
  ctx.legendmod5 = ctx.defaultmapsettings;
  vm.createContext(ctx);
  i18n(ctx);
  vm.runInContext(src, ctx);
  const flush = () => { for (let n = 0; n < 5 && timeouts.length; n++) timeouts.splice(0).forEach(f => { try { f(); } catch (e) { } }); };
  /* one second of each running interval */
  const tick = () => { Array.from(intervals.values()).forEach(t => { try { t.f(); } catch (e) { } }); };
  return { ctx, doc, intervals, started: () => started, flush, tick, evs };
}

function suite(label, src) {
  const res = {};
  /* LMexpress.js built the Tools tab before the module loaded */
  let b = boot(src, { toolsFirst: true });
  b.flush();
  const btn1 = b.doc.getElementById('lm-cc-open');
  res.addedAtStart = !!btn1 && btn1.parentNode === b.doc.getElementById('legend') &&
    btn1.parentNode.children.indexOf(btn1) === 1;
  res.noIntervalOff = b.intervals.size === 0 && b.started() === 0;
  for (let i = 0; i < 5; i++) b.tick();
  res.staysOnce = b.doc.getElementById('lm-cc-open') === btn1 && b.doc.getElementById('legend').children.filter(c => c.id === 'lm-cc-open').length === 1;

  /* the module loaded first: LMexpress.js adds the button through the hook it calls */
  b = boot(src, { toolsFirst: false });
  b.flush();
  const none = !b.doc.getElementById('lm-cc-open');
  buildTools(b.doc);
  const CC = b.ctx.LMCommandCentre;
  if (CC && typeof CC.addMenuButton === 'function') CC.addMenuButton();
  else b.tick(); /* the older module re-adds it from its timer */
  const btn2 = b.doc.getElementById('lm-cc-open');
  res.hookAdds = none && !!btn2 && !!(CC && typeof CC.addMenuButton === 'function');
  if (CC && CC.addMenuButton) { CC.addMenuButton(); CC.addMenuButton(); }
  res.hookOnce = b.doc.getElementById('legend').children.filter(c => c.id === 'lm-cc-open').length === 1;
  res.noIntervalLate = b.started() === 0;

  /* quick bar option on at start: one timer; settingsChange off stops it, on starts one again */
  b = boot(src, { toolsFirst: true, barOn: true });
  b.flush();
  res.barOnOne = b.intervals.size === 1;
  b.ctx.defaultmapsettings.commandCentreBar = false;
  b.ctx.LMEvents.emit('settingsChange', { key: 'commandCentreBar', value: false });
  b.flush();
  res.barOffStops = b.intervals.size === 0;
  b.ctx.defaultmapsettings.commandCentreBar = true;
  b.ctx.LMEvents.emit('settingsChange', { key: 'commandCentreBar', value: true });
  b.flush();
  res.barOnAgain = b.intervals.size === 1;
  /* the switch's own change event */
  b.ctx.defaultmapsettings.commandCentreBar = false;
  (b.doc._ls.change || []).forEach(f => f({ target: { id: 'commandCentreBar', type: 'checkbox', checked: false } }));
  b.flush();
  res.switchOffStops = b.intervals.size === 0;
  (b.doc._ls.change || []).forEach(f => f({ target: { id: 'other', type: 'checkbox' } }));
  b.flush();
  res.otherSwitchNoTimer = b.intervals.size === 0;
  console.log('  ' + label + ': ' + JSON.stringify(res));
  return res;
}

const src = fs.readFileSync(srcPath, 'utf8');
const r = suite('current', src);
check('button added once at start when the Tools tab is there, right under User Scripts', r.addedAtStart);
check('quick bar off: no setInterval at all', r.noIntervalOff && r.noIntervalLate);
check('button stays (one, same element) after 5 s', r.staysOnce);
check('module loaded before the Tools tab: LMCommandCentre.addMenuButton adds it', r.hookAdds);
check('addMenuButton called again: still one button', r.hookOnce);
check('quick bar on at start: one timer', r.barOnOne);
check('settingsChange commandCentreBar off: timer stopped; on: one again', r.barOffStops && r.barOnAgain);
check('the switch turned off: timer stopped; another switch starts none', r.switchOffStops && r.otherSwitchNoTimer);

/* LMexpress.js calls the hook right after it builds the Tools tab (and after #OpenuserScripts) */
const lmx = fs.readFileSync(lmxPath, 'utf8');
const iUs = lmx.indexOf('id="OpenuserScripts"'), iHook = lmx.indexOf('LMCommandCentre.addMenuButton()');
check('LMexpress.js calls LMCommandCentre.addMenuButton after building the Tools tab', iUs > 0 && iHook > iUs);

if (oldPath) {
  const o = suite('older', fs.readFileSync(oldPath, 'utf8'));
  check('older version had the 1 s timer with the option off (comparison is real)', !o.noIntervalOff);
}
console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
