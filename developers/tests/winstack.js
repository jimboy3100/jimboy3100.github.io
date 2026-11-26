/* Window stacking order (ogario/modules/winstack.js), run in a vm with a tiny document stub.
 * node developers/tests/winstack.js */
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

console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
