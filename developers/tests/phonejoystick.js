/* Phone joystick Sensitivity slider and Response curve (LMmobile/LMmobile.js), with the real code
 * in a vm: the prefs are read from lm-mobile-prefs with their old defaults (300, linear) and
 * ranges, and the joystick's virtual cursor is placed from them (distance x sensitivity, the curve
 * scales the distance and keeps the direction).
 * node developers/tests/phonejoystick.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = process.env.LM_ROOT || path.join(__dirname, '..', '..');
const mob = fs.readFileSync(path.join(root, 'LMmobile', 'LMmobile.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };
const cutIn = (a, b) => { const i = mob.indexOf(a), j = mob.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in LMmobile.js: ' + a); return mob.slice(i, j); };
const store = new Map();
const ctx = { console, JSON, Math, Object, Number, isFinite, setTimeout(f) { f(); },
  localStorage: { getItem: k => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)) } };
ctx.window = ctx;
vm.createContext(ctx);

// ── prefs
vm.runInContext(cutIn("var PREF_KEY = 'lm-mobile-prefs';", '        function savePrefs'), ctx);
const P = () => vm.runInContext('prefs', ctx);
check('defaults: sensitivity 300, linear curve', P().jsSensitivity === 300 && P().jsResponseCurve === 'linear', JSON.stringify(P()));
store.set('lm-mobile-prefs', JSON.stringify({ jsSensitivity: '450', jsResponseCurve: 'ease' }));
vm.runInContext('readPrefs()', ctx);
check('saved values are read again (450, ease)', P().jsSensitivity === 450 && P().jsResponseCurve === 'ease', JSON.stringify(P()));
store.set('lm-mobile-prefs', JSON.stringify({ jsSensitivity: 5000, jsResponseCurve: 'fast' }));
vm.runInContext('readPrefs()', ctx);
check('sensitivity kept within its slider (600), an unknown curve keeps the default', P().jsSensitivity === 600 && P().jsResponseCurve === 'linear', JSON.stringify(P()));
check('phone settings panel has the slider and the curve choice', /id="lm-js" min="100" max="600" step="25"/.test(mob) && /id="lm-jrc"/.test(mob) && /value="aggressive"/.test(mob));

// ── the virtual cursor of the joystick (touchmove), the real lines
const move = cutIn('            var rx0 = t.clientX - org.x', '            mouseAt(cx, cy);');
vm.runInContext('function place(t) {\n' + move + '            return [cx, cy];\n}', ctx);
Object.assign(ctx, { innerWidth: 1000, innerHeight: 800, JR: 55, org: { x: 100, y: 600 } });
const at = (sens, curve, dx, dy) => { const p = P(); p.jsSensitivity = sens; p.jsResponseCurve = curve; return ctx.place({ clientX: 100 + dx, clientY: 600 + dy }); };
let c = at(300, 'linear', 20, 0);
check('linear: 20 px right x 300 = 6000 px right of the centre', c[0] === 500 + 6000 && c[1] === 400, c.join());
c = at(100, 'linear', 20, 0);
check('sensitivity 100: 2000 px', c[0] === 500 + 2000, c.join());
check('inside the 8 px dead zone nothing moves', at(300, 'linear', 5, 0) === undefined);
const lin = at(300, 'linear', 11, 11), ease = at(300, 'ease', 11, 11), agg = at(300, 'aggressive', 11, 11);
const dir = p => Math.atan2(p[1] - 400, p[0] - 500);
check('curves keep the direction', Math.abs(dir(lin) - dir(ease)) < 1e-9 && Math.abs(dir(lin) - dir(agg)) < 1e-9);
const len = p => Math.hypot(p[0] - 500, p[1] - 400);
check('a small push: ease and aggressive put the cursor closer than linear', len(ease) < len(lin) && len(agg) < len(ease), [len(lin), len(ease), len(agg)].map(Math.round).join());
c = at(300, 'ease', 80, 0);
check('beyond the knob travel every curve is at full distance', Math.abs(c[0] - (500 + 80 * 300)) < 1e-6, c.join());

console.log(fail ? fail + ' FAILED' : 'all phone joystick checks passed');
process.exit(fail ? 1 : 0);
