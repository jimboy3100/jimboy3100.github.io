/* Built-in split macros (_lmSplitRun in ogario/ogario.v4.js): the old timing when nothing stalls,
 * no burst after a stall, and they stop on another socket, unit or life.
 * node developers/tests/splitmacros.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
function block(start) {
    const i = src.indexOf(start);
    if (i < 0) throw Error(start + ' not found');
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    throw Error(start + ' not closed');
}
const method = (name) => block('\n        ' + name + '(').slice(1);
const fn = (name) => block('\nfunction ' + name + '(').slice(1);
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
(function () {
    let now = 0;
    const timers = [];
    const ctx = {
        Math, performance: { now: () => now },
        setTimeout: (f, d) => { timers.push({ f, at: now + Math.max(0, d || 0) }); return timers.length; },
        spects: []
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(fn('getActiveSpect') + '\nvar LM = { serverType: "agario" };\nvar app = {\n' +
        ['_lmMacroId', '_lmMacroSame', '_lmSplitRun', 'tripleSplit', 'split16', 'crazyDoubleSplit', 'popSplit'].map(method).join(',\n') +
        ',\nsplit() { window.sent.push(Math.round(performance.now())); }\n};\nwindow.app = app;', ctx);
    ctx._lmSplitDelay = (n) => 40 * n;
    ctx._lmPopSplitDelay = () => 200;
    const reset = () => { now = 0; timers.length = 0; ctx.sent = []; ctx.legendmod = { socket: {}, _connectSeq: 1 }; ctx.multiboxPlayerEnabled = 0; ctx.lockPosition = false; ctx.app._lmLifeStartAt = 5; };
    /* run the timers; stallAt: the main thread is blocked from that time for stallMs */
    const run = (until, stallAt, stallMs) => {
        for (let guard = 0; guard < 1000; guard++) {
            timers.sort((a, b) => a.at - b.at);
            const t = timers.shift();
            if (!t || t.at > until) { if (t) timers.unshift(t); break; }
            now = Math.max(now, t.at);
            if (stallAt != null && now >= stallAt && stallMs) { now += stallMs; stallMs = 0; }
            t.f();
        }
    };
    reset(); ctx.app.split16(); run(1000);
    check('macro: 16 split, no stall: the old timing 0/40/80/120', JSON.stringify(ctx.sent) === '[0,40,80,120]');
    reset(); ctx.app.tripleSplit(); run(1000, 1, 100);
    check('macro: stall of 100 ms -> no burst (splits at least half a gap apart)', ctx.sent.length === 3 && ctx.sent[2] - ctx.sent[1] >= 20);
    reset(); ctx.app.split16(); run(1000, 1, 400);
    check('macro: a long stall ends the macro instead of sending the rest at once', ctx.sent.length === 1);
    reset(); ctx.app.split16(); run(50); ctx.legendmod.socket = {}; run(1000);
    check('macro: another socket (reconnect) ends it', JSON.stringify(ctx.sent) === '[0,40]');
    reset(); ctx.app.tripleSplit(); ctx.app._lmLifeStartAt = 9; run(1000);
    check('macro: a new life ends it', ctx.sent.length === 1);
    reset(); ctx.spects.push({ number: 2, socket: {}, playerCellIDs: [] }); ctx.app.tripleSplit(); ctx.multiboxPlayerEnabled = 2; run(1000);
    check('macro: another unit ends it', ctx.sent.length === 1);
    ctx.spects.length = 0;
    reset(); ctx.app.crazyDoubleSplit(); const locked = ctx.lockPosition; run(1000);
    check('macro: crazy double split locks the aim and unlocks after the second split', locked === true && ctx.lockPosition === false && JSON.stringify(ctx.sent) === '[0,40]');
    reset(); ctx.app.crazyDoubleSplit(); ctx.legendmod.socket = {}; run(1000);
    check('macro: crazy double split ended early still unlocks the aim', ctx.lockPosition === false && ctx.sent.length === 1);
    reset(); ctx.app.popSplit(); run(1000);
    check('macro: pop split 0/200', JSON.stringify(ctx.sent) === '[0,200]');
})();


console.log(failed ? failed + ' FAILED' : 'all split macro checks passed');
process.exit(failed ? 1 : 0);
