/* Line split with the real code of ogario/ogario.v4.js and ogario/spect.js: a multibox unit keeps
 * the locked aim like the main cell (also while Limit position / dance would steer it), the time
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
const sctx = { Math, Number, Date, legendmod: { cursorX: 7069, cursorY: 2356, lineSplitActive: true, dance: false }, window: { followStraight: true, multiboxPlayerEnabled: 1 } };
vm.createContext(sctx);
const U = vm.runInContext('({number:1,playerX:0,playerY:0,' + cut(sp, '    _lmAimTarget() {', '    sendSpectate() {') + '})', sctx);
check('line split on a multibox unit with Limit position held: the locked spot', U._lmAimTarget().join() === '7069,2356');
sctx.window.followStraight = false; sctx.legendmod.dance = true;
check('line split on a multibox unit with dance on: the locked spot', U._lmAimTarget().join() === '7069,2356');
sctx.legendmod.lineSplitActive = false;
check('no line split: dance steers as before', U._lmAimTarget().join() !== '7069,2356');

/* "Keep moving" after a line split: the unit's sent aim (_lmAimSend -> _lmKeepAim) is the offset it
 * runs on by once left alone: the locked spot, also with Limit position on; a crazy split's held
 * position (lockPosition) sends nothing and keeps it */
{
  const spN = sp.replace(/\r\n/g, '\n');
  const aimSrc = ['    _lmAimSend() {', '    _lmKeepAim(rx, ry) {', '    _lmCentreOk() {'].map((m) => cut(spN, m, '\n    }\n') + '\n    },').join('\n');
  const kctx = { Math, Number, Date, legendmod: { cursorX: 7069, cursorY: 2356, lineSplitActive: true, dance: false }, window: { followStraight: true, multiboxPlayerEnabled: 1 }, sent: [] };
  vm.createContext(kctx);
  const K = vm.runInContext('({number:1,player:true,active:true,playerX:1000,playerY:-500,transformReady(){return true;},convertX(x){return x;},convertY(y){return y;},rawToWorldX(x){return x;},rawToWorldY(y){return y;},' +
    'sendPosition(x,y){sent.push(x+","+y);return true;},\n' + aimSrc + '\n' + cut(sp, '    _lmAimTarget() {', '    sendSpectate() {') + '})', kctx);
  K._lmAimSend();
  check('line split with Limit position on: the unit sends the locked spot and keeps its offset (6069, 2856) for Keep moving',
    kctx.sent.join() === '7069,2356' && K.distX === 6069 && K.distY === 2856);
  kctx.legendmod.lineSplitActive = false; kctx.legendmod.cursorY = -400;
  K._lmAimSend();
  check('  ... the line split over, Limit position: the offset of the line it sent (right, +50000), not the cursor', kctx.sent[1] === '51000,-500' && K.distX === 50000 && K.distY === 0);
  kctx.window.lockPosition = true; kctx.legendmod.cursorX = -9000;
  check('  ... a crazy split holds the position: nothing sent, the offset stays', K._lmAimSend() === false && kctx.sent.length === 2 && K.distX === 50000 && K.distY === 0);
}

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
