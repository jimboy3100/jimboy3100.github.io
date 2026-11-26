/* Window stacking order (ogario/modules/winstack.js), run in a vm with a tiny document stub.
 * node developers/tests/winstack.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'winstack.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const listeners = [];
const doc = { body: {}, addEventListener: (t, f, c) => listeners.push([t, c]) };
const ctx = { document: doc, MutationObserver: function () { this.observe = () => {}; } };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const WS = ctx.LMWinStack;
check('LMWinStack loaded once', !!WS && typeof WS.front === 'function' && ctx._lmWinStackLoaded === true);
vm.runInContext(src, ctx);
check('a second load adds no listener', listeners.filter(l => l[0] === 'pointerdown').length === 1 && listeners[0][1] === true);

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

console.log(fail ? fail + ' FAILED' : 'all ok');
process.exit(fail ? 1 : 0);
