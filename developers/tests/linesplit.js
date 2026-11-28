/* Line split with the real code of ogario/ogario.v4.js and ogario/spect.js: a multibox unit keeps
 * the locked aim like the main cell (also while Limit position would steer it), the time
 * between its splits is the split macros' one (macroSplitDelay), 2-4 splits per press, the status
 * line names the technique without a piece count, and the aim line is drawn while the lock runs.
 * node developers/tests/linesplit.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const sp = fs.readFileSync(path.join(root, 'ogario', 'spect.js'), 'utf8');
const cut = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found: ' + a); return src.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* multibox unit aim */
const sctx = { Math, Number, Date, legendmod: { cursorX: 7069, cursorY: 2356, lineSplitActive: true }, window: { followStraight: true, multiboxPlayerEnabled: 1 } };
vm.createContext(sctx);
const U = vm.runInContext('({number:1,playerX:0,playerY:0,' + cut(sp, '    _lmAimTarget() {', '    sendSpectate() {') + '})', sctx);
check('line split on a multibox unit with Limit position held: the locked spot', U._lmAimTarget().join() === '7069,2356');
sctx.legendmod.lineSplitActive = false;
check('no line split: Limit position steers to the nearest of the 8 directions', U._lmAimTarget().join() === '50000,0');
/* Dance (Alt+R) is removed: an old dance flag no longer steers the unit */
sctx.window.followStraight = false; sctx.legendmod.dance = true;
check('no Limit position: the unit follows the cursor, whatever an old dance flag says', U._lmAimTarget().join() === '7069,2356');

/* settings and status line */
const helper = cut(main, 'window._lmSplitDelay = function (n) {', 'window._lmPopSplitDelay');
const ctx = { Math, Number, window: {}, defaultmapsettings: { macroSplitDelay: 60, lineSplitCount: 1, lineSplitDelay: 0, lineSplitHold: 700 },
  lmT: k => ({ 'settings.hk-lineSplit': 'Line split', 'settings.lineSplitGroup': 'Line Split' })[k] || k };
vm.createContext(ctx);
vm.runInContext(helper, ctx);
const LM = vm.runInContext('({' + cut(main, '        getLineSplitSettings() {', '        /* The unit a split goes to') + '})', ctx);
const st = LM.getLineSplitSettings();
check('time between splits is the split macros\' one (60), a saved lineSplitDelay is ignored', st.delay === 60);
check('a saved 1 split per press is read as 2', st.splits === 2);
ctx.defaultmapsettings.lineSplitCount = 9;
check('more than 4 splits per press is read as 4', LM.getLineSplitSettings().splits === 4);
const status = cut(main, '        updateLineSplitStatus() {', 'if (text === this._lineSplitStatusText)');
check('status line: "Line split", no x8 / x16 count', /lmT\('settings\.hk-lineSplit'\)/.test(status) && !/Math\.pow|' x'/.test(status));
const nc = main.replace(/\/\*[\s\S]*?\*\//g, '');
check('no lineSplitDelay / lineSplitGuide setting left in the core', !/lineSplitDelay|lineSplitGuide/.test(nc));
check('the aim line is drawn whenever the lock runs', /if \(LM\.lineSplitActive\) \{\s*this\.drawLineSplitGuide\(/.test(nc));

console.log(fail ? fail + ' line split check(s) FAILED' : 'all line split checks passed');
process.exit(fail ? 1 : 0);
