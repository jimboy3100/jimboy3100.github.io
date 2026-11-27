/* Copy tools panel (the scissors button #Cutnames, LMexpress StartEditGameNames): the real function
 * run in a fake page. It added a raw keydown listener on X that toggled the panel while typing in
 * chat or any text box and together with the X hotkey (Toggle death); the scissors button is the
 * one toggle. Checks: no key listener is added, X keydowns leave the panel as it is, the panel is
 * still built.
 * node developers/tests/copytools.js [LMexpress.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
const a = src.indexOf('function inject(type, code) {'), b = src.indexOf('function StopEditGameNames() {');
if (a < 0 || b < 0) { console.log('FAIL code not found'); process.exit(1); }

const listeners = [];
const panel = { style: { display: 'block' }, addEventListener() { } };
const el = () => ({ insertAdjacentHTML(pos, html) { if (/id="tcm"/.test(html)) built = true; }, appendChild() { } });
let built = false;
const head = el(), body = el();
const ctx = {
    console, CanvasRenderingContext2D: function () { },
    _lmxT: (k) => k, _lmxE: (k) => k,
    document: {
        getElementsByTagName: (t) => [t === 'head' ? head : body], head, documentElement: head,
        getElementById: (id) => (id === 'tcm' ? panel : null),
        createElement: () => ({ appendChild() { } }), createTextNode: () => ({})
    }
};
ctx.CanvasRenderingContext2D.prototype = { fillText() { } };
ctx.window = ctx;
ctx.addEventListener = (type, fn) => listeners.push([type, fn]);
ctx.setTimeout = () => { };
vm.createContext(ctx);
vm.runInContext(src.slice(a, b) + '\nStartEditGameNames();', ctx);
check('the panel is built', built);
check('no keydown listener of its own', !listeners.some((l) => l[0] === 'keydown'), listeners.map((l) => l[0]).join());
for (const l of listeners) if (l[0] === 'keydown') ['B', 'O', 'X'].forEach((c) => l[1]({ keyCode: c.charCodeAt(0), target: { tagName: 'INPUT', id: 'message' } }));
check('typing "box" in the chat box leaves the panel shown', panel.style.display === 'block', panel.style.display);
check('fillText still collects names (its override is installed)', ctx.CanvasRenderingContext2D.prototype.fillText.toString().indexOf('apply') >= 0);
console.log(failed ? failed + ' failed' : 'all copy tools checks passed');
process.exit(failed ? 1 : 0);
