/* Death recap checks: step summarising, loss detection and attribution in ogario/modules/deathrecap.js.
 * node developers/tests/deathrecap.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
/* texts of the language packs (English unless code is given) */
const T = (k, v, code) => i18n.t('modules.deathrecap.' + k, v, code);
const cells = (n, code) => (n === 1 ? T('cell', null, code) : T('cells', [n], code));
/* a pack text as a regex: {0} {1} ... match the given patterns */
const esc = (x) => x.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
const tplRe = (k, pats, whole) => new RegExp((whole ? '^' : '') + T(k).split(/(\{\d+\})/).map(p => { const m = /^\{(\d+)\}$/.exec(p); return m ? pats[+m[1]] : esc(p); }).join('') + (whole ? '$' : ''));
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'deathrecap.js'), 'utf8');

let now = 1000000, listeners = {}, intervals = 0;
const store = {};
/* just enough DOM for the kill feed */
class El {
  constructor() { this.children = []; this.style = {}; this.textContent = ''; this.parentNode = null; }
  get childNodes() { return this.children; }
  get firstChild() { return this.children[0] || null; }
  get lastChild() { return this.children[this.children.length - 1] || null; }
  get nextSibling() { const a = this.parentNode ? this.parentNode.children : []; return a[a.indexOf(this) + 1] || null; }
  appendChild(c) { c.parentNode = this; this.children.push(c); return c; }
  removeChild(c) { this.children = this.children.filter(x => x !== c); c.parentNode = null; return c; }
  getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
}
const body = new El(), byId = {};
body.contains = () => false;
const origAppend = body.appendChild.bind(body);
body.appendChild = c => { if (c.id) byId[c.id] = c; return origAppend(c); };
const feedLines = () => (byId['lm-killfeed'] ? byId['lm-killfeed'].children.map(c => c.textContent) : []);
const ctx = {
  window: null, Date: { now: () => now }, Math, Number, String, Array, Float64Array, Int32Array, Uint16Array, Infinity, isFinite,
  localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
  document: { getElementById: id => (byId[id] && byId[id].parentNode ? byId[id] : null), createElement: () => new El(), body },
  setInterval() { intervals++; return intervals; }, clearInterval() {}, setTimeout() { return 1; }, clearTimeout() {},
  innerWidth: 915, innerHeight: 412,
  LMEvents: { on(n, f) { (listeners[n] = listeners[n] || []).push(f); }, off(n, f) { listeners[n] = (listeners[n] || []).filter(x => x !== f); } }
};
ctx.window = ctx;
ctx.legendmod5 = { gameOverStats: false, killFeed: false, massLossAlert: false, massLossPct: 30, recordReplays: true };
ctx.legendmod = { play: false, playerCells: [], cells: [], playerMass: 0, ws: 'wss://x' };
vm.createContext(ctx);
i18n(ctx);
vm.runInContext(src, ctx);

let fail = 0;
const check = (n, c, extra) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || extra === undefined ? '' : '  -> ' + JSON.stringify(extra))); if (!c) fail++; };
const D = ctx.LMDeathRecap, P = D._pure;

// --- everything off: no listeners, no timer
check('off: no listeners, no timer, flag off', !Object.keys(listeners).some(k => listeners[k].length) && intervals === 0 && ctx._lmDROn === false);

// --- pure helpers
check('fmtNum', P.fmtNum(24500) === '24,500' && P.fmtNum(999) === '999' && P.fmtNum(1234567.4) === '1,234,567');
check('lossCheck: 30 % of 10,000 within threshold', P.lossCheck(10000, 7000, 15, 100) === 3000);
check('lossCheck: 10 % below a 15 % threshold', P.lossCheck(10000, 9000, 15, 100) === 0);
check('lossCheck: small absolute drop ignored', P.lossCheck(300, 210, 15, 100) === 0);
check('lossCheck: no peak', P.lossCheck(0, 0, 15, 100) === 0);

const ring = () => P.makeRing(128);
let R = ring();
for (let i = 0; i < 10; i++) P.ringPush(R, 1000 + i * 250, 1000 + i, 1, -1, null, 0);
check('peakSince: window only', P.peakSince(R, 1000 + 8 * 250) === 1009 && P.peakSince(R, 0) === 1009);
check('sampleAt: last sample at or before', R.t[P.sampleAt(R, 1600)] === 1500 && R.t[P.sampleAt(R, 0)] === 1000);
// ring wraps
R = P.makeRing(4);
for (let i = 0; i < 6; i++) P.ringPush(R, i * 100, i, 1, -1, null, 0);
check('ring wraps: oldest kept is #2', R.len === 4 && R.t[P.sampleAt(R, 0)] === 200 && P.peakSince(R, 0) === 5);

const evs = [
  { type: 'eaten', t: 5000, t2: 5400, a: 3000, nick: 'Bob', v: false },
  { type: 'eaten', t: 5100, t2: 5200, a: 4000, nick: 'Ann', v: false },
  { type: 'eaten', t: 5300, t2: 5300, a: 1500, nick: 'Bob', v: false }
];
const at = P.attribute(evs, 4000, 6000);
check('attribute: most mass eaten wins (Bob 4,500 > Ann 4,000)', at && at.nick === 'Bob' && at.a === 4500, at);
check('attribute: none in window', P.attribute(evs, 7000, 9000) === null);

// --- summarise a typical life: big, split, lost mass to an exact eater, then eaten
const t0 = 100000, death = t0 + 30000;
R = ring();
for (let t = t0; t <= death; t += 250) {
  let m = 24500, c = 4;
  if (t >= death - 12000) c = 8;                       // split at -12 s
  if (t >= death - 7000) m = 15300;                    // lost 9,200 at -7 s
  if (t >= death - 2000) { m = 2000; c = 2; }
  P.ringPush(R, t, m, c, -1, t >= death - 9000 ? 'PlayerX' : null, 30000);
}
const ev = [
  { type: 'split', t: death - 12000, t2: death - 12000, a: 0, peak: 0, nick: null, near: null, v: false },
  { type: 'merge', t: death - 15000, t2: death - 15000, a: 0, peak: 0, nick: null, near: null, v: false },
  { type: 'eaten', t: death - 7100, t2: death - 6900, a: 9200, peak: 0, nick: 'PlayerX', near: null, v: false },
  { type: 'loss', t: death - 6900, t2: death - 6900, a: 9200, peak: 24500, nick: null, near: 'PlayerX', v: false },
  { type: 'eaten', t: death - 200, t2: death, a: 2000, peak: 0, nick: 'PlayerX', near: null, v: false }
];
let steps = P.summarise(R, ev, death, { nick: 'PlayerX', virus: false, exact: true });
let texts = steps.map(s => P.stepLabel(s) + ': ' + P.stepText(s));
console.log('     ' + texts.join(' | '));
check('3-6 steps', steps.length >= 3 && steps.length <= 6, texts);
check('starts 20 s before with mass and cells', texts[0] === '-20 s: ' + T('mass', ['24,500', cells(4)]), texts[0]);
check('split step with the cell count after it', texts.includes('-12 s: ' + T('split', [cells(8)])), texts);
check('loss with exact attribution (eat events)', texts.includes('-7 s: ' + T('lossTo', ['9,200', 'PlayerX'])), texts);
check('the eat inside the loss is not listed twice', steps.filter(s => s.kind === 'eaten').length === 0, texts);
check('ends with the killer', texts[texts.length - 1] === '\u2620: ' + T('eatenBy', ['PlayerX']), texts);
check('chronological', steps.every((s, i) => !i || s.t >= steps[i - 1].t));

// --- no eat events: only "near"
const ev2 = ev.filter(e => e.type !== 'eaten');
steps = P.summarise(R, ev2, death, { nick: 'PlayerX', virus: false, exact: false });
texts = steps.map(s => P.stepText(s));
check('loss without eat data says near', texts.includes(T('lossNear', ['9,200', 'PlayerX'])), texts);
check('death without exact data says near', texts[texts.length - 1] === T('eatenNear', ['PlayerX']), texts);
steps = P.summarise(R, ev2.map(e => Object.assign({}, e, { near: null })), death, null);
texts = steps.map(s => P.stepText(s));
check('nobody known: no name at all', texts.includes(T('loss', ['9,200'])) && texts[texts.length - 1] === T('eatenNone'), texts);

// --- many events: capped at 6 steps, the biggest loss is kept
const many = [];
for (let i = 0; i < 12; i++) many.push({ type: i % 2 ? 'split' : 'merge', t: death - 19000 + i * 1000, t2: death - 19000 + i * 1000, a: 0, peak: 0, nick: null, near: null, v: false });
many.push({ type: 'loss', t: death - 4000, t2: death - 3800, a: 5000, peak: 20000, nick: null, near: 'Z', v: false });
steps = P.summarise(R, many, death, null);
check('at most 6 steps', steps.length === 6, steps.length);
check('loss kept over merges', steps.some(s => s.kind === 'loss') && steps.filter(s => s.kind === 'merge').length <= 1);

// --- quiet life: a middle mass step keeps 3 steps
R = ring();
for (let t = t0; t <= t0 + 15000; t += 250) P.ringPush(R, t, 500 + (t - t0) / 100, 1, -1, null, 0);
steps = P.summarise(R, [], t0 + 15000, null);
check('quiet short life: 3 steps from spawn', steps.length === 3 && steps[0].s === -15 && steps[1].kind === 'mass', steps.map(s => s.s + ' ' + s.kind));
check('1 cell wording', P.stepText(steps[0]) === T('mass', ['500', T('cell')]), P.stepText(steps[0]));
check('English pack texts reach the steps', P.stepText({ kind: 'split', c: 8 }) === 'split into 8 cells');
/* the language follows the runtime live: no reload */
ctx.LMi18n.setLang('el', { save: false });
check('Greek text after a language change', P.stepText({ kind: 'split', c: 8 }) === 'έκανες split σε 8 κύτταρα' &&
  P.stepText({ kind: 'split', c: 8 }) === T('split', [cells(8, 'el')], 'el'));
ctx.LMi18n.setLang('en', { save: false });
check('back to English', P.stepText({ kind: 'split', c: 8 }) === T('split', [cells(8)]));
check('unnamed and virus wording', P.stepText({ kind: 'death', nick: '', exact: true }) === T('eatenBy', [T('unnamed')]) &&
  P.stepText({ kind: 'loss', a: 100, virus: true, exact: true }) === T('lossTo', ['100', T('virusCell')]));
check('long nicks are cut', P.stepText({ kind: 'death', nick: 'x'.repeat(80), exact: true }) === T('eatenBy', ['x'.repeat(40)]));

// --- live: options on, sampling, eat hooks, loss detection, recap
ctx.legendmod5.gameOverStats = true;
ctx.legendmod5.massLossAlert = true;
D.sync();
check('on: spawn/death listeners and flag', (listeners.spawn || []).length === 1 && (listeners.death || []).length === 1 && ctx._lmDROn === true);
const lm = ctx.legendmod;
const own = (x, size) => ({ x, y: 0, size, isPlayerCell: true });
lm.play = true;
lm.playerCells = [own(0, 1500)];
lm.playerMass = 22500;
const enemy = { x: 2500, y: 0, size: 2000, targetNick: 'Eater' };
const far = { x: 90000, y: 0, size: 3000, targetNick: 'FarAway' };
const tiny = { x: 1600, y: 0, size: 100, targetNick: 'Tiny' };
lm.cells = [lm.playerCells[0], enemy, far, tiny, { x: 100, y: 0, size: 200, isVirus: true }];
listeners.spawn[0]({ time: now });
for (let i = 0; i < 20; i++) { now += 250; D._test.tick(); }
// split: 1 -> 2 cells
lm.playerCells = [own(0, 1060), own(300, 1060)]; now += 250; D._test.tick();
// virus: own cell eats a virus, then 2 -> 6 cells
now += 100; D.eat(lm.playerCells[0], { isVirus: true, size: 140 }, true, false, 140);
lm.playerCells = [1, 2, 3, 4, 5, 6].map(i => own(i * 100, 600)); now += 150; D._test.tick();
for (let i = 0; i < 8; i++) { now += 250; D._test.tick(); }
// I ate a player's cell
D.eat(lm.playerCells[0], { size: 300, targetNick: 'Snack' }, true, false, 300);
// the enemy eats 3 of my 6 cells (each 3,600 mass): exact
for (let i = 0; i < 3; i++) { now += 80; D.eat(enemy, lm.playerCells[5 - i], false, true, 600); }
lm.playerCells = lm.playerCells.slice(0, 3); lm.playerMass = 10800; now += 10; D._test.tick();
for (let i = 0; i < 6; i++) { now += 250; D._test.tick(); }
// merge: two own cells merge
D.eat(lm.playerCells[0], lm.playerCells[2], true, true, 600);
lm.playerCells = lm.playerCells.slice(0, 2); now += 250; D._test.tick();
for (let i = 0; i < 8; i++) { now += 250; D._test.tick(); }
// eaten: the enemy takes the rest
now += 100; D.eat(enemy, lm.playerCells[0], false, true, 600); D.eat(enemy, lm.playerCells[1], false, true, 600);
lm.playerCells = []; lm.play = false;
listeners.death[0]({ time: now });
const rc = D.last();
texts = rc ? rc.steps.map(s => P.stepLabel(s) + ': ' + P.stepText(s)) : [];
console.log('     ' + texts.join(' | '));
check('live recap built on death', !!rc && rc.steps.length >= 3 && rc.steps.length <= 6, texts);
check('live: virus step', texts.some(t => t.endsWith(': ' + T('virus', [cells(6)]))), texts);
check('live: split step', texts.some(t => t.endsWith(': ' + T('split', [cells(2)]))), texts);
check('live: loss attributed exactly to Eater', texts.some(t => t.endsWith(': ' + T('lossTo', ['11,700', 'Eater']))), texts);
check('live: killer from the eat events', texts[texts.length - 1].endsWith(': ' + T('eatenBy', ['Eater'])), texts);
check('live: sparkline samples', rc && rc.spark.length > 20);
check('live: no replay links when not recording', rc && rc.slot === null);
check('mass-loss alert line (30 %), exact eater', feedLines().some(t => tplRe('alertTo', ['\\d+', '[\\d,]+', 'Eater'], true).test(t)), feedLines());
check('kill feed off: no eat or death lines', !feedLines().some(t => tplRe('feedAte', ['.*', '.*']).test(t) || tplRe('feedDied', ['.*']).test(t) || t === T('feedDiedNone')), feedLines());

// --- "near" nick comes only from a close, bigger, visible enemy
listeners.spawn[0]({ time: now });
lm.play = true; lm.playerCells = [own(0, 1500)]; lm.playerMass = 22500; lm.cells = [lm.playerCells[0], far, tiny];
for (let i = 0; i < 12; i++) { now += 250; D._test.tick(); }
lm.playerCells = []; lm.play = false; listeners.death[0]({ time: now });
const last = D.last().steps[D.last().steps.length - 1];
check('far and small cells are not "near"', last.nick == null, last);

// --- practice arena / replay lives (LMEvents context) are not recorded (audit A16)
{
  const liveRecap = D.last();
  lm.play = true; lm.playerCells = [own(0, 1500)]; lm.playerMass = 22500; lm.cells = [lm.playerCells[0], enemy];
  const before = intervals;
  listeners.spawn[0]({ time: now, context: 'practice' });
  for (let i = 0; i < 12; i++) { now += 250; D._test.tick(); }
  lm.playerCells = []; lm.play = false; listeners.death[0]({ time: now, context: 'practice' });
  check('practice life: no recap built, the last live one stays', D.last() === liveRecap);
  check('practice life: no sampling timer started', intervals === before);
  listeners.spawn[0]({ time: now, context: 'replay' });
  lm.play = true; lm.playerCells = [own(0, 1500)];
  for (let i = 0; i < 12; i++) { now += 250; D._test.tick(); }
  lm.playerCells = []; lm.play = false; listeners.death[0]({ time: now, context: 'replay' });
  check('replay life: no recap built', D.last() === liveRecap);
}

// --- off again: everything stops
ctx.legendmod5.gameOverStats = false; ctx.legendmod5.massLossAlert = false; D.sync();
check('off again: listeners removed, flag off', !(listeners.spawn || []).length && !(listeners.death || []).length && ctx._lmDROn === false);

/* kill feed: the eats of one player's cells add up while they go on, also when a split (or another
 * event) came between them; the line went back to the last eat alone once that split was over 2 s old */
{
  ctx.legendmod5.killFeed = true; D.sync(); D._test.reset();
  lm.play = true; lm.playerCells = [own(0, 1500)]; lm.playerMass = 22500; lm.cells = [lm.playerCells[0]];
  listeners.spawn[0]({ time: now });
  now += 250; D._test.tick();
  D.eat(lm.playerCells[0], { size: 300, targetNick: 'Chain' }, true, false, 300);
  now += 1000; lm.playerCells = [own(0, 1060), own(300, 1060)]; D._test.tick();
  now += 500; D.eat(lm.playerCells[0], { size: 300, targetNick: 'Chain' }, true, false, 300);
  now += 1700; D.eat(lm.playerCells[1], { size: 300, targetNick: 'Chain' }, true, false, 300);
  const fl = feedLines();
  check('kill feed: three eats of one player across a split add up', fl[fl.length - 1] === T('feedAte', ['Chain', '2,700']), fl);
  lm.playerCells = []; lm.play = false; listeners.death[0]({ time: now });
  ctx.legendmod5.killFeed = false; D.sync();
}

/* who ate me: the eats of one player go on in one event across my split; the death line still names
 * that player (the killer search stopped at the newer split that was over and found no eater) */
{
  ctx.legendmod5.killFeed = true; D.sync(); D._test.reset();
  const hunter = { x: 2500, y: 0, size: 2500, targetNick: 'Hunter' };
  lm.play = true; lm.playerCells = [own(0, 1500)]; lm.playerMass = 22500; lm.cells = [lm.playerCells[0]];
  listeners.spawn[0]({ time: now });
  now += 250; D._test.tick();
  D.eat(hunter, own(0, 600), false, true, 600);
  now += 500; lm.playerCells = [own(0, 1000), own(300, 1000)]; D._test.tick();
  now += 1000; D.eat(hunter, own(0, 600), false, true, 600);
  now += 1100; D.eat(hunter, lm.playerCells[0], false, true, 1000); D.eat(hunter, lm.playerCells[1], false, true, 1000);
  lm.playerCells = []; lm.play = false; listeners.death[0]({ time: now });
  const fl = feedLines();
  check('kill feed: the death line names the player whose eats went on across my split', fl[fl.length - 1] === T('feedDied', ['Hunter']), fl);
  ctx.legendmod5.killFeed = false; D.sync();
}

/* who ate me (ogario.v4.js lmKillerWanted): one rule for the server's report, the remove packets
 * and the guard against naming my own multibox unit; the Game Over card (which shows Eaten by and
 * the death recap: one switch, no switch per part), the match history and the kill feed each need it */
{
  const core = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
  const a = core.indexOf('\nfunction lmKillerWanted(');
  check('lmKillerWanted in the core', a >= 0);
  if (a >= 0) {
    const b = core.indexOf('\n}\n', a);
    const kc = { defaultmapsettings: { gameOverStats: false, matchHistory: false, killFeed: false } };
    vm.createContext(kc);
    vm.runInContext(core.slice(a, b + 3), kc);
    const W = (o) => kc.lmKillerWanted(Object.assign({ gameOverStats: false, matchHistory: false, killFeed: false }, o));
    check('killer: not kept with all three off', W({}) === false && kc.lmKillerWanted() === false);
    check('killer: kept for each of the Game Over card, Match history, Kill feed alone', W({ gameOverStats: true }) && W({ matchHistory: true }) && W({ killFeed: true }));
    /* the retired part switches of old saved settings no longer keep it */
    check('killer: old showKiller / deathRecap values alone do not keep it', W({ showKiller: true }) === false && W({ deathRecap: true }) === false);
    kc.defaultmapsettings.gameOverStats = true;
    check('killer: reads the live settings by default', kc.lmKillerWanted() === true);
    /* every place that keeps the killer or the multibox guard uses the one rule */
    const sites = (core.match(/lmKillerWanted\(\)/g) || []).length;
    check('killer: the server report, the remove-packet killer and the multibox guard use it (' + sites + ')', sites >= 3 && !/\(defaultmapsettings\.showKiller \|\| defaultmapsettings\.matchHistory\)/.test(core));
  }
}

/* one killer on the Game Over card (ogario.v4.js lmKillerShown): the "Eaten by" row and the match
 * history name the player the recap's death step and the kill feed name (the most mass taken in the
 * last 2 s), not the last eater of the remove packets; the server's report wins in both */
{
  const core = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
  const a = core.indexOf('\nfunction lmKillerShown(');
  check('lmKillerShown in the core', a >= 0);
  if (a >= 0) {
    vm.runInContext(core.slice(a, core.indexOf('\n}\n', a) + 3), ctx);
    const S = () => ctx.lmKillerShown(now);
    const life = (eats) => {
      D._test.reset(); lm._lmKiller = null;
      lm.play = true; lm.playerCells = [own(0, 1500)]; lm.playerMass = 22500; lm.cells = [lm.playerCells[0]];
      listeners.spawn[0]({ time: now });
      for (let i = 0; i < 8; i++) { now += 250; D._test.tick(); }
      /* each eat as the core records it: _lmKiller = the last eater, then the recap's eat count */
      eats.forEach(([dt, eater, size, eaterMass]) => {
        now += dt;
        lm._lmKiller = { nick: eater.targetNick, mass: eaterMass, virus: false, at: now };
        D.eat(eater, own(0, size), false, true, size);
      });
      lm.playerCells = []; lm.play = false; listeners.death[0]({ time: now });
    };
    const bigA = { x: 0, y: 0, size: 1100, targetNick: 'BigA' }, tinyB = { x: 0, y: 0, size: 300, targetNick: 'TinyB' };
    ctx.legendmod5.gameOverStats = true; ctx.legendmod5.killFeed = true; D.sync();
    /* BigA takes 2,000 mass 1.5 s before the death, TinyB eats the last 50 */
    life([[500, bigA, Math.sqrt(200000), 12100], [1500, tinyB, Math.sqrt(5000), 900]]);
    const rc = D.last(), dstep = rc && rc.steps[rc.steps.length - 1], fl = feedLines(), k1 = S();
    check('one killer: the core\'s last eater is TinyB (the old card row)', lm._lmKiller.nick === 'TinyB');
    check('one killer: the recap death step names BigA', !!dstep && dstep.kind === 'death' && dstep.nick === 'BigA', dstep);
    check('one killer: the kill feed died line names BigA', fl[fl.length - 1] === T('feedDied', ['BigA']), fl);
    check('one killer: the card row / match history name BigA too, without TinyB\'s mass', !!k1 && k1.nick === 'BigA' && !k1.virus && k1.mass === null, k1);
    /* the two rules agree: the mass of the eater is kept */
    life([[500, bigA, Math.sqrt(200000), 12100]]);
    const k2 = S();
    check('one killer: same player in both rules keeps the eater\'s mass', !!k2 && k2.nick === 'BigA' && k2.mass === 12100, k2);
    /* the server's report wins (Expanding Land), with its mass */
    life([[500, bigA, Math.sqrt(200000), 12100], [1500, tinyB, Math.sqrt(5000), 900]]);
    lm._lmKiller = { nick: 'Srv', mass: 4321, virus: false, server: true, at: now, cellId: 7 };
    const k3 = S();
    check('one killer: the server report wins with its mass', !!k3 && k3.nick === 'Srv' && k3.mass === 4321, k3);
    /* recap, kill feed and alert all off: the core's own killer as before */
    ctx.legendmod5.gameOverStats = false; ctx.legendmod5.killFeed = false; D.sync();
    lm._lmKiller = { nick: 'TinyB', mass: 900, virus: false, at: now };
    const k4 = S();
    check('one killer: with the recap off the core\'s killer stays', !!k4 && k4.nick === 'TinyB' && k4.mass === 900, k4);
    lm._lmKiller = { nick: 'Old', mass: 1, virus: false, at: now - 16000 };
    check('one killer: an old killer (over 15 s) is not shown', S() === null);
    lm._lmKiller = null;
  }
  /* the core's eat loop feeds the recap: my multibox unit eating my cell is no killer (else the card
   * and the match history said "Eaten by" my own unit, which _lmKiller never names) */
  const b0 = core.indexOf('if (window._lmDROn && eaterID) {');
  check('recap feed block in the core', b0 >= 0);
  if (b0 >= 0) {
    const b1 = core.indexOf('\n                }\n', b0) + 18;
    const fed = [];
    const g = { window: null, legendmod: { indexedCells: { 50001: { isPlayerCellMulti: true } } }, lmUnitCellId: (id, n) => id + n * 50000 };
    g.window = { _lmDROn: true, spects: [{ player: true, number: 1 }], LMDeathRecap: { eat: (e) => fed.push(e.targetNick) } };
    vm.createContext(g);
    const run = vm.runInContext('(function (eaterID, eaterRawID, victimID, _victimWasPlayer, _victimStartSize) {' + core.slice(b0, b1) + '})', g);
    const self = { _playerCellIDSet: new Set([9]) };
    run.call(self, { targetNick: 'Twin', size: 500 }, 1, { size: 200 }, true, 200);
    run.call(self, { targetNick: 'TwinCopy', size: 500, isPlayerCellMulti: true }, 2, { size: 200 }, true, 200);
    run.call(self, { targetNick: 'Enemy', size: 500 }, 3, { size: 200 }, true, 200);
    run.call(self, { targetNick: 'Me', size: 500 }, 9, { targetNick: 'Prey', size: 200 }, false, 200);
    check('recap feed: my multibox unit eating me is skipped, an enemy and my own eats are fed', JSON.stringify(fed) === '["Enemy","Me"]', fed);
  }
}

console.log(fail ? fail + ' failed' : 'all death recap checks passed');
process.exit(fail ? 1 : 0);
