/* Per-frame and per-second hot paths in ogario.v4.js:
 * - LM.sortCells: budgeted insertion sort with the native sort as fallback must give exactly
 *   the order of the old full insertion sort (size, then id), and be fast on bad input.
 * - lmTop5TempTeammates: a temporary (socket 3) teammate expires 6 s after its last update,
 *   is not added twice, and fresh ones stay listed.
 * - application._lmTop5Write: teamboard DOM writes only when something changed.
 * Usage: node developers/tests/hotpaths.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
function check(name, ok) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name);
    if (!ok) failed++;
}
function slice(from, to) {
    const a = src.indexOf(from);
    const b = src.indexOf(to, a + 1);
    if (a < 0 || b < 0) throw new Error('not found in ogario.v4.js: ' + from);
    return src.slice(a, b);
}

/* ---- sortCells ---- */
const LM = vm.runInNewContext('({\n' + slice('        sortCells() {', '        calculatePlayerMassAndPosition() {') + '})');

/* the insertion sort as it was before the budget */
function oldSort(a) {
    for (var i = 1, len = a.length; i < len; i++) {
        var tmp = a[i];
        if (!tmp) continue;
        var tSize = tmp.size, tId = tmp.id;
        var j = i - 1;
        while (j >= 0 && a[j] && (a[j].size > tSize || (a[j].size === tSize && a[j].id > tId))) {
            a[j + 1] = a[j]; j--;
        }
        a[j + 1] = tmp;
    }
}
function newSort(a) { LM.cells = a; LM.sortCells(); }

let seed = 12345;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
const N = 2500;
function cell(i, size, id) { return { size: size, id: id, tag: i }; }
const cases = {
    reversed: () => Array.from({ length: N }, (_, i) => cell(i, N - i, N - i)),
    random: () => Array.from({ length: N }, (_, i) => cell(i, Math.floor(rnd() * 3000) + 10, Math.floor(rnd() * 1e6))),
    nearlySorted: () => {
        const a = Array.from({ length: N }, (_, i) => cell(i, 10 + i * 0.5 + (rnd() - 0.5) * 2, i));
        for (let k = 0; k < 40; k++) { const i = Math.floor(rnd() * (N - 1)); const t = a[i]; a[i] = a[i + 1]; a[i + 1] = t; }
        return a;
    },
    equalSizes: () => Array.from({ length: N }, (_, i) => cell(i, 50, N - i)),
    equalSizesAndDuplicateIds: () => Array.from({ length: N }, (_, i) => cell(i, 50 + (i % 3), (N - i) % 97)),
    reversedWithHoles: () => { const a = cases.reversed(); for (let i = 7; i < N; i += 131) a[i] = null; return a; },
    appendedBatch: () => {
        const a = Array.from({ length: 1500 }, (_, i) => cell(i, 10 + i, i));
        for (let i = 0; i < 1000; i++) a.push(cell(1500 + i, 5 + rnd() * 2000, 5000 + i));
        return a;
    },
    empty: () => [],
    one: () => [cell(0, 3, 3)]
};
const tagsOf = (a) => a.map((c) => (c ? c.tag : 'x')).join(',');
function time(fn, make, reps) {
    let best = Infinity;
    for (let r = 0; r < reps; r++) {
        const a = make();
        const t0 = process.hrtime.bigint();
        fn(a);
        best = Math.min(best, Number(process.hrtime.bigint() - t0) / 1e6);
    }
    return best;
}
const timings = {};
for (const name of Object.keys(cases)) {
    seed = 777;
    const base = cases[name]();
    const a = base.slice(), b = base.slice();
    oldSort(a);
    newSort(b);
    check('sortCells ' + name + ': same draw order as the full insertion sort', tagsOf(a) === tagsOf(b));
    const again = b.slice();
    newSort(again);
    check('sortCells ' + name + ': sorting a sorted list changes nothing', tagsOf(again) === tagsOf(b));
    if (base.length > 1) {
        seed = 777;
        timings[name] = { old: time(oldSort, cases[name], 3), now: time(newSort, cases[name], 3) };
    }
}
for (const name of Object.keys(timings)) {
    console.log('     ' + name.padEnd(26) + ' old ' + timings[name].old.toFixed(2).padStart(8) + ' ms   new ' + timings[name].now.toFixed(2).padStart(8) + ' ms');
}
check('2500 reversed cells: at least 5x faster than before', timings.reversed.now * 5 < timings.reversed.old);
check('2500 reversed cells: under 20 ms', timings.reversed.now < 20);
check('appended batch of 1000: faster than before', timings.appendedBatch.now < timings.appendedBatch.old);
check('nearly sorted: not slower than before (2x + 0.5 ms margin)', timings.nearlySorted.now <= timings.nearlySorted.old * 2 + 0.5);

/* ---- temporary teammates on the skin teamboard ---- */
const tempCode = slice('var LM_TEMP_TEAMMATE_TIMEOUT', 'function Socket3updateTeamPlayer(');
const T = vm.runInNewContext(tempCode + '; ({ run: lmTop5TempTeammates, timeout: LM_TEMP_TEAMMATE_TIMEOUT })');
check('temp teammate timeout is 6 s', T.timeout === 6000);
const now = 1000000;
function temp(id, age, extra) { return Object.assign({ id: id, nick: id, lbgpi: -2, mass: 500, alive: true, temp: true, lastUpdatedTime: now - age }, extra || {}); }
{
    const players = [temp('fresh', 500), temp('stale', 6500), temp('edge', 6000), { id: 'normal', lbgpi: 3, mass: 900, alive: true }];
    const top5 = [];
    T.run(players, top5, now);
    check('fresh temp teammate stays alive with its mass', players[0].alive === true && players[0].mass === 500);
    check('temp teammate silent for over 6 s is marked dead (mass 1)', players[1].alive === false && players[1].mass === 1);
    check('exactly 6 s is not yet stale', players[2].alive === true);
    check('normal teammates are left alone', players[3].alive === true && players[3].mass === 900);
    check('fresh ones missing from the list are added once', top5.length === 2 && top5[0] === players[0] && top5[1] === players[2]);
    T.run(players, top5, now);
    check('a second refresh (row limit click) adds no duplicate', top5.length === 2);
}
{
    const p = temp('copy', 100);
    const top5 = [{ id: 'copy', nick: 'copy', mass: 500, lbgpi: -2 }];
    T.run([p], top5, now);
    check('teammate already listed as a copy by updateTeamPlayers is not added again', top5.length === 1);
}
{
    const players = [temp('dead', 100, { alive: false }), temp('nomass', 100, { mass: 1 }), temp('notime', 0, { lastUpdatedTime: 0 })];
    const top5 = [];
    T.run(players, top5, now);
    check('dead or massless temp teammates are not listed; one without a time is', top5.length === 1 && top5[0] === players[2]);
}
check('old reversed test would kill a 0.5 s old update (the bug)', (now - 500) - now < 6000);

/* ---- teamboard DOM writes ---- */
const writeCode = slice('        _lmTop5Write(html, mass, players) {', '\n        },\n') + '\n        }';
const W = vm.runInNewContext('({ shortMassFormat(v) { return v < 1000 ? v : Math.round(v / 100) / 10 + "k"; },\n' + writeCode + '})');
function el() {
    const e = { writes: 0, _v: '' };
    ['innerHTML', 'textContent'].forEach((k) => Object.defineProperty(e, k, { get() { return e._v; }, set(v) { e._v = String(v); e.writes++; } }));
    return e;
}
W.top5pos = el(); W.top5totalMass = el(); W.top5totalPlayers = el();
W._lmTop5Write('<li>a</li>', 1500, 2);
check('first write fills list and totals', W.top5pos.innerHTML === '<li>a</li>' && W.top5totalMass.textContent === '1.5k' && W.top5totalPlayers.textContent === '2');
W._lmTop5Write('<li>a</li>', 1500, 2);
check('unchanged teamboard writes nothing', W.top5pos.writes === 1 && W.top5totalMass.writes === 1 && W.top5totalPlayers.writes === 1);
W.top5totalPlayers.textContent = 40; // the server packet writes the player count too
W._lmTop5Write('<li>a</li>', 1500, 2);
check('player count overwritten elsewhere is written back', W.top5totalPlayers.textContent === '2');
W._lmTop5Write('', 0, 0);
check('an empty team clears the list', W.top5pos.innerHTML === '' && W.top5totalMass.textContent === '0');

/* ---- displayTop5 source checks ---- */
const top5Src = slice('        displayTop5() {\n            if (defaultmapsettings.top5skins', '        _lmTop5Write(');
check('skin rows no longer look up #hudMainColor per row', (top5Src.match(/\$\('#hudMainColor'\)/g) || []).length === 1 && /if \(totalMass === undefined\)/.test(top5Src));
check('reversed time test is gone', !/lastUpdatedTime\) - tempTime < 6000/.test(top5Src));

/* ---- Performance diagnostics off: the message handler of a multibox / spectator unit
 * (spect.js onmessage) reads one global, window._lmNetRec, and handles the message as before;
 * per message it costs about the same as without that check (printed, not judged: timings
 * flake on a busy machine) ---- */
{
    const spect = fs.readFileSync(path.join(root, 'ogario', 'spect.js'), 'utf8').replace(/\r\n/g, '\n');
    const om = spect.slice(spect.indexOf('\n    onmessage(message) {'), spect.indexOf('\n    onerror(socket, generation) {'));
    const reads = [];
    const win = new Proxy({}, { get(t, k) { reads.push(String(k)); return undefined; } });
    const ctx = vm.createContext({ window: win, DataView, RangeError, console });
    const U = vm.runInContext('(class {' + om + '\n})', ctx);
    let handled = null;
    U.prototype.handleMessage = function (v) { handled = v; };
    const buf = new ArrayBuffer(8);
    new U().onmessage({ data: buf });
    check('diagnostics off: a unit message reads window._lmNetRec once and is handled as before', om.length > 0 && reads.join() === '_lmNetRec' && handled instanceof DataView && handled.buffer === buf);
    U.prototype.handleMessage = function () { throw new RangeError('short'); };
    let thrown = false;
    try { new U().onmessage({ data: buf }); } catch (e) { thrown = true; }
    check('diagnostics off: a truncated unit message is still swallowed', !thrown);
    /* the same handler without the check, as before it */
    const plain = om.replace(/\n\s*\/\* Performance diagnostics[\s\S]*?\*\/\n\s*const nr = [^\n]*\n\s*try \{/, '\n        {').replace(/\} finally \{\n\s*if \(nk >= 0\) nr\.e\(nk\);\n\s*\}/, '}');
    /* timed in this realm (a vm context makes every global read slow, a page does not) */
    const mk = (s) => new Function('window', 'console', 'return (class {' + s + '\n});')({ _lmNetRec: null }, console);
    const A = mk(om), Bp = mk(plain);
    A.prototype.handleMessage = Bp.prototype.handleMessage = function () { };
    const a = new A(), b = new Bp(), msg = { data: buf }, N = 200000, ta = [], tb = [];
    for (let k = 0; k < 6; k++) {
        let t0 = process.hrtime.bigint(); for (let i = 0; i < N; i++) a.onmessage(msg); ta.push(Number(process.hrtime.bigint() - t0) / N);
        t0 = process.hrtime.bigint(); for (let i = 0; i < N; i++) b.onmessage(msg); tb.push(Number(process.hrtime.bigint() - t0) / N);
    }
    const med = (x) => x.slice().sort((p, q) => p - q)[x.length >> 1];
    check('the handler without the check still builds (for the timing)', plain !== om && !/_lmNetRec/.test(plain));
    console.log('     unit message, diagnostics off: ' + med(ta).toFixed(1) + ' ns with the check, ' + med(tb).toFixed(1) + ' ns without (median of 6 alternating runs of ' + N + ')');
}

/* ---- Performance diagnostics off: the jelly index occupancy (a loop over its buckets) and the
 * skin queue times cost nothing. ogario/modules/perf.js in a page: with only the frame hook on
 * (Adaptive performance) a freeze reads no index and the skin queue methods are not wrapped;
 * while recording the index is read once per freeze, not on the slow frames under 250 ms ---- */
{
    const perfSrc = fs.readFileSync(path.join(root, 'ogario', 'modules', 'perf.js'), 'utf8');
    let reads = 0, t = 1000;
    const jobAdd = function () { }, jobRun = function () { }, upQ = function () { return true; }, upRun = function () { };
    const ctx = {
        performance: { now: () => t }, setInterval: () => 0, clearInterval() { }, setTimeout: () => 0, addEventListener() { }, devicePixelRatio: 1, innerWidth: 900, innerHeight: 500, navigator: {},
        document: { hidden: false, addEventListener() { }, removeEventListener() { }, getElementById: () => null, createElement: () => ({ style: {} }), body: { appendChild() { } } },
        localStorage: { getItem: () => null, setItem() { }, removeItem() { } },
        legendmod5: { adaptivePerf: true, adaptivePerfTarget: 60, netHistory: false, fpsLimit: 0 },
        legendmod: { cells: [], isSocketOpen: () => false, quadtree: { occupancy() { reads++; return { points: 10, cells: 1, step: 10, used: 1, fullest: 10, perQuery: 10, mostRead: 10 }; } } },
        application: { saveSettings() { }, setAnimatedRainbowColor() { }, applyHudBlur() { }, _lmSkinJobAdd: jobAdd, _lmSkinJobRun: jobRun },
        drawRender: { dpr: 1, resizeCanvas() { }, _lmQueueSkinUpload: upQ, _lmUploadSkinJob: upRun }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(perfSrc, ctx);
    ctx.LMPerf.configChanged();
    const frame = (dt) => { t += dt; ctx._lmPerfFrame.raf(t); ctx._lmPerfFrame(t, t + 2); t += 2; };
    for (let i = 0; i < 20; i++) frame(16.7);
    frame(400); frame(16.7);
    const sameSkin = () => ctx.application._lmSkinJobAdd === jobAdd && ctx.application._lmSkinJobRun === jobRun && ctx.drawRender._lmQueueSkinUpload === upQ && ctx.drawRender._lmUploadSkinJob === upRun;
    check('diagnostics not recording: a freeze reads no jelly index, skin queue methods not wrapped', typeof ctx._lmPerfFrame === 'function' && reads === 0 && sameSkin());
    ctx.LMPerf.keepRecording(true);
    for (let i = 0; i < 5; i++) frame(120);
    const slow = reads;
    frame(400); frame(16.7);
    check('recording: the jelly index is read at a freeze only (not on slow frames)', slow === 0 && reads === 1);
    ctx.LMPerf.keepRecording(false);
    frame(400); frame(16.7);
    check('recording stopped: no index read, skin queue methods put back', reads === 1 && sameSkin());
}

console.log(failed ? 'FAILED: ' + failed : 'all hotpaths checks passed');
process.exit(failed ? 1 : 0);
