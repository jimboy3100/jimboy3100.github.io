/* A small fake document for running a module in a vm (developers/tests/ccpoll.js and the other
 * *poll.js tests): elements with children, ids, attributes and listeners; getElementById searches
 * the tree, querySelector finds '#id' selectors only. */
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
    getContext() { return new Proxy({}, { get: (o, k) => (k in o ? o[k] : () => {}), set: (o, k, v) => { o[k] = v; return true; } }); },
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
  doc.documentElement.style.setProperty = (k, v) => { doc.documentElement.style[k] = v; };
  doc.body = makeEl(doc, 'body');
  doc.head = makeEl(doc, 'head');
  doc.documentElement.appendChild(doc.head);
  doc.documentElement.appendChild(doc.body);
  const find = (el, id) => { if (el.id === id) return el; for (const c of el.children || []) { const r = find(c, id); if (r) return r; } return null; };
  doc.getElementById = id => find(doc.documentElement, id);
  doc.querySelector = sel => (/^#[\w-]+$/.test(sel) ? doc.getElementById(sel.slice(1)) : null);
  doc.querySelectorAll = () => [];
  doc.addEventListener = (t, f) => { (doc._ls[t] = doc._ls[t] || []).push(f); };
  doc.removeEventListener = () => {};
  doc.activeElement = doc.body;
  return doc;
}
/* a window for one module: counted setInterval / clearInterval, setTimeout run by flush(),
 * an LMEvents with on / off / emit, settings in legendmod5 (= defaultmapsettings) */
function makeEnv(settings, extra) {
  const vm = require('vm');
  const doc = makeDoc();
  const intervals = new Map(); let nextId = 1, started = 0;
  const timeouts = [];
  const evs = {};
  const ctx = Object.assign({
    console, Date, Math, JSON,
    document: doc,
    setInterval(f, ms) { const id = nextId++; intervals.set(id, { f, ms }); started++; return id; },
    clearInterval(id) { intervals.delete(id); },
    setTimeout(f) { timeouts.push(f); return nextId++; },
    clearTimeout() {},
    requestAnimationFrame(f) { return nextId++; },
    cancelAnimationFrame() {},
    localStorage: (() => { const d = {}; return { getItem: k => (k in d ? d[k] : null), setItem: (k, v) => { d[k] = String(v); }, removeItem: k => { delete d[k]; } }; })(),
    innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
    addEventListener() {}, removeEventListener() {},
    getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1', fontSize: '12px' }),
    defaultmapsettings: Object.assign({}, settings || {}),
    LMEvents: {
      on(n, f) { (evs[n] = evs[n] || []).push(f); },
      off(n, f) { evs[n] = (evs[n] || []).filter(x => x !== f); },
      emit(n, d) { (evs[n] || []).slice().forEach(f => f(d)); },
      _has(n) { return !!(evs[n] && evs[n].length); }
    }
  }, extra || {});
  ctx.window = ctx;
  ctx.legendmod5 = ctx.defaultmapsettings;
  vm.createContext(ctx);
  const flush = () => { for (let n = 0; n < 5 && timeouts.length; n++) timeouts.splice(0).forEach(f => { try { f(); } catch (e) { } }); };
  /* one period of each running interval */
  const tick = () => { Array.from(intervals.values()).forEach(t => { try { t.f(); } catch (e) { } }); };
  const run = src => vm.runInContext(src, ctx);
  return { ctx, doc, intervals, started: () => started, flush, tick, evs, run };
}
module.exports = { makeEl, makeDoc, makeEnv };
