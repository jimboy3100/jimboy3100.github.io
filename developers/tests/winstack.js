/* Window stacking order (ogario/modules/winstack.js), run in a vm with a tiny document stub.
 * node developers/tests/winstack.js [winstack.js] [ogario.v4.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'winstack.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const listeners = [];
const doc = { body: { children: [] }, addEventListener: (t, f, c) => listeners.push([t, c]) };
const winListeners = [];
const ctx = { document: doc, MutationObserver: function () { this.observe = () => {}; }, addEventListener: (t, f, c) => winListeners.push([t, c]) };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const WS = ctx.LMWinStack;
check('LMWinStack loaded once', !!WS && typeof WS.front === 'function' && ctx._lmWinStackLoaded === true);
vm.runInContext(src, ctx);
check('a second load adds no listener', listeners.filter(l => l[0] === 'pointerdown').length === 1 && listeners[0][1] === true &&
  listeners.filter(l => l[0] === 'focusin').length === 1 && winListeners.filter(l => l[0] === 'keydown' && l[1] === true).length === 1);

const order = WS._core.order;
const eq = (a, b) => JSON.stringify(Array.from(a)) === JSON.stringify(b);
/* oldest first */
check('newer window with a lower tier goes on top, the older one just below', eq(order([999992, 999990]), [999991, 999992]));
check('already in order: values unchanged', eq(order([999990, 999992]), [999990, 999992]));
check('menu (100) opened over Custom Macros: the menu keeps its value, macros just under it', eq(order([999992, 100], true), [99, 100]));
check('under the menu: never below 1', order([999990, 999992, 1], true).every(z => z >= 1));
check('a panel (100000) under a newer window keeps its own value', eq(order([100000, 999990]), [100000, 999990]));
check('equal tiers: the newer one higher', eq(order([999990, 999990, 999990]), [999988, 999989, 999990]));
check('never above the stacking tier (full-screen editors, toasts stay above)', Math.max.apply(null, order([999992, 999990, 100])) === 999992);
check('empty list', order([]).length === 0);

/* Esc keydown with a menu page in front of a window: an event whose target is not a Node (window,
 * from window.dispatchEvent, or none) must not throw; Esc on the page still brings the windows back */
{
  const D2 = { nodeType: 9, children: [], addEventListener: () => {} };
  const body = { nodeType: 1, children: [], parentElement: null };
  D2.body = body; D2.documentElement = { nodeType: 1 };
  const mk = (id, z, modal) => {
    const st = {};
    return { id, nodeType: 1, parentElement: body, isConnected: true, children: [], _z: z, previousElementSibling: null,
      classList: { contains: c => modal && c === 'lm-modal-container' }, querySelector: () => null, getClientRects: () => [1],
      style: { getPropertyValue: k => (st[k] || [''])[0], getPropertyPriority: k => (st[k] || ['', ''])[1], setProperty: (k, v, p) => { st[k] = [v, p || '']; }, removeProperty: k => { delete st[k]; } },
      /* like the DOM: contains() takes a Node only */
      contains(n) { if (!n || typeof n !== 'object' || !n.nodeType) throw new TypeError("Failed to execute 'contains' on 'Node': parameter 1 is not of type 'Node'."); return n === this; } };
  };
  const win = mk('macros', 999992, true), menu = mk('overlays', 100, false);
  body.children.push(win, menu);
  let keydown = null;
  const c2 = { document: D2, MutationObserver: function () { this.observe = () => {}; },
    getComputedStyle: el => ({ display: 'block', visibility: 'visible', position: 'fixed', pointerEvents: 'auto', zIndex: String(el._z) }),
    addEventListener: (t, fn) => { if (t === 'keydown') keydown = fn; } };
  c2.window = c2;
  vm.createContext(c2);
  vm.runInContext(src, c2);
  const WS2 = c2.LMWinStack;
  WS2.front(menu);
  const esc = target => { const e = { key: 'Escape', keyCode: 27, target, prevented: false, preventDefault() { this.prevented = true; }, stopImmediatePropagation() { } };
    let err = null; try { keydown(e); } catch (x) { err = x; } return { e, err }; };
  check('menu page in front of a window', WS2._stack().length === 2 && WS2._stack()[1] === menu);
  let r = esc(c2);
  check('Esc dispatched on window: no error, left to the other handlers, the menu stays in front', !r.err && !r.e.prevented && WS2._stack()[1] === menu);
  r = esc(null);
  check('Esc without a target: no error, nothing changes', !r.err && !r.e.prevented && WS2._stack()[1] === menu);
  r = esc(body);
  check('Esc on the page: the window comes back in front', !r.err && r.e.prevented && WS2._stack().length === 1 && WS2._stack()[0] === win);
}


/* ── Esc with the Private room window (the real room code of ogario/ogario.v4.js, argv[3]) and another
 * window that closes on Esc as the module windows do (root._lmEsc + escFor): only the one in front
 * closes. The room window had no _lmEsc and closed on every Esc: under a newer window it closed
 * unseen (and that window too), over an older one the older one closed instead ── */
{
  const main = fs.readFileSync(process.argv[3] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
  const chk = (n, c, info) => check(n + (c || info === undefined ? '' : '  [' + info + ']'), c);

  const a = main.indexOf('\nvar _lmRoomApi = '), b = main.indexOf('\nwindow._lmRoomOpen = _lmRoomOpen;');
  if (a < 0 || b < 0) { console.log('FAIL room code not found'); process.exit(1); }
  const roomSrc = main.slice(a, b + 35);

  function run(order) {
      let observer = null;
      const listeners = [];
      const W = {};
      const mkStyle = () => {
          const st = {}, s = { cssText: '' };
          s.setProperty = (k, v, p) => { st[k] = [String(v), p || '']; };
          s.getPropertyValue = k => (st[k] || [''])[0];
          s.getPropertyPriority = k => (st[k] || ['', ''])[1];
          s.removeProperty = k => { delete st[k]; };
          return s;
      };
      const D = { nodeType: 9 };
      const mkEl = tag => {
          const el = {
              nodeType: 1, tagName: String(tag).toUpperCase(), id: '', className: '', textContent: '', children: [], parentElement: null, style: mkStyle(), _ls: [],
              get parentNode() { return this.parentElement; },
              get isConnected() { let e = this; while (e.parentElement) e = e.parentElement; return e === D.body; },
              get previousElementSibling() { const p = this.parentElement; if (!p) return null; return p.children[p.children.indexOf(this) - 1] || null; },
              get firstElementChild() { return this.children[0] || null; },
              classList: { add() { }, remove() { }, toggle() { }, contains: c => (' ' + el.className + ' ').indexOf(' ' + c + ' ') >= 0 },
              appendChild(c) { if (c.parentElement) c.parentElement.removeChild(c); this.children.push(c); c.parentElement = this; if (this === D.body && observer) observer([{ type: 'childList', addedNodes: [c], removedNodes: [] }]); return c; },
              insertBefore(c) { return this.appendChild(c); },
              removeChild(c) { this.children = this.children.filter(x => x !== c); c.parentElement = null; if (this === D.body && observer) observer([{ type: 'childList', addedNodes: [], removedNodes: [c] }]); return c; },
              addEventListener(t, f) { this._ls.push([t, f]); }, removeEventListener() { },
              setAttribute(k, v) { this[k] = v; }, getAttribute() { return null; },
              querySelector() { return null; }, querySelectorAll() { return []; },
              contains(n) { for (; n; n = n.parentElement) if (n === this) return true; return false; },
              getClientRects() { return this.style.display === 'none' ? [] : [1]; },
              getBoundingClientRect() { return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 }; },
              focus() { }, select() { }
          };
          return el;
      };
      D.createElement = mkEl;
      D.body = mkEl('body');
      D.documentElement = mkEl('html');
      D.addEventListener = () => { };
      D.getElementById = id => { const f = e => { if (e.id === id) return e; for (const c of e.children) { const r = f(c); if (r) return r; } return null; }; return f(D.body); };
      const css = (el, k) => { const m = new RegExp('(?:^|;)\\s*' + k + '\\s*:\\s*([^;]+)').exec(el.style.cssText || ''); return m ? m[1].trim() : ''; };
      Object.assign(W, {
          document: D, console, JSON, Math, Date, Array, Object, String, Number, RegExp, encodeURIComponent,
          navigator: {}, location: { href: 'https://www.legendmod.ml/play.html', search: '' },
          localStorage: { getItem: () => null, setItem() { }, removeItem() { } },
          setTimeout: () => 0, clearTimeout() { }, fetch: () => new Promise(() => { }),
          innerWidth: 1600, innerHeight: 900,
          MutationObserver: function (cb) { this.observe = t => { if (t === D.body) observer = cb; }; this.disconnect = () => { }; },
          getComputedStyle: el => ({ display: el.style.display || 'block', visibility: 'visible', pointerEvents: 'auto',
              position: css(el, 'position') || 'static', zIndex: el.style.getPropertyValue('z-index') || css(el, 'z-index') || 'auto' }),
          addEventListener: (t, f, c) => listeners.push({ t, f, c: !!c }),
          removeEventListener: (t, f, c) => { const i = listeners.findIndex(l => l.t === t && l.f === f && l.c === !!c); if (i >= 0) listeners.splice(i, 1); }
      });
      W.window = W;
      vm.createContext(W);
      vm.runInContext(src, W);
      vm.runInContext('function _lmMhT(k, en) { return en; }\n' + roomSrc, W);

      /* a window that closes on Esc as the module windows do (practice.js) */
      const macros = mkEl('div');
      macros.id = 'macros';
      macros.className = 'lm-modal-container';
      macros.style.cssText = 'position:fixed;z-index:999992;';
      macros._lmEsc = true;
      const openMacros = () => {
          D.body.appendChild(macros);
          W.addEventListener('keydown', function (e) {
              if (!macros.isConnected || e.key !== 'Escape') return;
              if (W.LMWinStack && !W.LMWinStack.escFor(macros, e)) return;
              e.preventDefault(); e.stopImmediatePropagation(); D.body.removeChild(macros);
          }, true);
      };
      for (const w of order) w === 'room' ? W._lmRoomOpen('rejoin') : openMacros();
      const esc = () => {
          const e = { type: 'keydown', key: 'Escape', keyCode: 27, target: D.body, _stop: false,
              preventDefault() { }, stopPropagation() { }, stopImmediatePropagation() { this._stop = true; } };
          for (const l of listeners.slice()) { if (l.t !== 'keydown' || !l.c || !listeners.includes(l)) continue; l.f(e); if (e._stop) break; }
      };
      const state = () => ({ macros: macros.isConnected, room: !!D.getElementById('lm-room-modal') });
      const before = state();
      esc();
      const one = state();
      esc();
      return { before, one, two: state(), keyListeners: listeners.filter(l => l.t === 'keydown').length };
  }

  let r = run(['macros', 'room']);
  chk('Custom Macros, then the room window over it (a dropped room connection opens it): both open', r.before.macros && r.before.room);
  chk('one Esc closes the room window in front, Custom Macros under it stays', !r.one.room && r.one.macros, JSON.stringify(r.one));
  chk('a second Esc closes Custom Macros', !r.two.room && !r.two.macros, JSON.stringify(r.two));

  r = run(['room', 'macros']);
  chk('the room window, then Custom Macros over it: both open', r.before.macros && r.before.room);
  chk('one Esc closes Custom Macros in front, the room window under it stays', r.one.room && !r.one.macros, JSON.stringify(r.one));
  chk('a second Esc closes the room window, and its Esc listener is gone', !r.two.room && !r.two.macros && r.keyListeners === 2, JSON.stringify(r.two) + ' listeners ' + r.keyListeners);

  r = run(['room']);
  chk('the room window alone still closes on Esc', r.before.room && !r.one.room);
}

console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
