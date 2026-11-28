/* Settings > Mass > Mass format in every place that shows a mass as text, with the real code: the
 * HUD texts of ogario.v4.js (shortMassFormat: team list and its total, leaderboard mass, target,
 * followed cell, ghost cells) and the Game Over card (and its image). Short (the default) keeps the texts as before; Exact and Auto were shown as 12.3k there.
 * node developers/tests/massformat.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const hh = fs.readFileSync(path.join(root, 'ogario', 'modules', 'hudhelpers.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return main.slice(i, j + b.length); };
let fail = 0;
const check = (n, c, extra) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || extra === undefined ? '' : '  -> ' + JSON.stringify(extra))); if (!c) fail++; };

const ms = { massFormat: 2, shortMass: true };
const ctx = { console, Math, Number, JSON, Map, Array, String, Date, isFinite, performance: { now: () => 0 },
  localStorage: { getItem: () => null, setItem() {} }, document: { body: null, title: 'Legend Mod', getElementById: () => null, createElement: () => ({ style: {} }) },
  defaultmapsettings: ms };
ctx.window = ctx;
ctx.legendmod5 = ms;
vm.createContext(ctx);
vm.runInContext(hh, ctx);
/* the HUD formatter, as a method of the application object */
vm.runInContext('var application = ({' + cut('        shortMassFormat(value) {', '\n        },') + '}); window.application = application;', ctx);
const F = v => String(ctx.application.shortMassFormat(v));
const modes = { 1: ['999', '9999', '12345', '123456', '1234567'], 2: ['999', '10k', '12.3k', '123.5k', '1234.6k'], 3: ['999', '9999', '12.3k', '123k', '1.2M'] };
for (const m of [1, 2, 3]) {
  ms.massFormat = m; ms.shortMass = m === 2;
  const got = [999, 9999, 12345, 123456, 1234567].map(F);
  check('HUD mass texts, mode ' + m, JSON.stringify(got) === JSON.stringify(modes[m]), got);
}
/* the default and an older save without the choice (0: Short mass) are the old text */
ms.massFormat = 2;
check('Short (default): numbers below 1000 stay numbers, as before', ctx.application.shortMassFormat(950) === 950 && ctx.application.shortMassFormat(12345) === '12.3k');
ms.massFormat = 0;
check('older value 0: as before', F(12345) === '12.3k');

/* the Game Over card's mass texts (also the image and the share text) */
{
  const fn = cut('            function fmtMass(m) {', '\n            }');
  const fm = vm.runInContext('(function(){' + fn + '; return fmtMass; })()', ctx);
  ms.massFormat = 2;
  check('card: Short as before (exact below 10000, then 24.5K)', fm(9000) === (9000).toLocaleString() && fm(24500) === '24.5K' && fm(2500000) === '2.5M');
  ms.massFormat = 3;
  check('card: Auto as before', fm(24500) === '24.5K');
  ms.massFormat = 1;
  check('card: Exact shows the whole number', fm(24500) === (24500).toLocaleString() && fm(2500000) === (2500000).toLocaleString());
}

console.log(fail ? 'RESULT: FAIL (' + fail + ')' : 'RESULT: PASS');
process.exit(fail ? 1 : 0);
