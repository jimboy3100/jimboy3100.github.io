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
    vm.runInContext(fn('getActiveSpect') + '\n' + fn('lmActiveUnit') + '\nvar LM = { serverType: "agario" };\nvar app = {\n' +
        ['_lmMacroId', '_lmMacroSame', '_lmSplitRun', 'tripleSplit', 'split16', 'crazyDoubleSplit', 'popSplit'].map(method).join(',\n') +
        ',\nsplit() { window.sent.push(Math.round(performance.now())); }\n};\nwindow.app = window.application = app;', ctx);
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

/* One dispatch point (window.core.act) with the real window.core actions, the application's feed
 * loops and macros and lmActiveUnit: one send per action to the player you control, nothing to a
 * dead or closed one, and a held feed, a permanent feed, a bot feed or the rest of a macro stays
 * with the player it started on (a switch, death or reconnect ends it). */
(function () {
    const a = src.indexOf('\n        act(m, bound) {'), b = src.indexOf('\n        specialOn() {', a);
    if (a < 0 || b < 0) { check('window.core.act found', false); return; }
    let now = 0, frames = [];
    const timers = [];
    const ctx = {
        Math, Number, performance: { now: () => now }, defaultmapsettings: { macroFeeding: 10 },
        setTimeout: (f, d) => { timers.push({ f, at: now + Math.max(0, d || 0) }); return timers.length; },
        clearTimeout: () => { }, requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame: () => { frames = []; },
        spects: []
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(fn('getActiveSpect') + '\n' + fn('lmActiveUnit') + '\nvar LM = { serverType: "agario" };\nwindow.core = {' + src.slice(a, b) + '\n};\nvar app = {\n' +
        ['feed', '_lmFeedTick', 'macroFeedPerm', 'macrobotFeed', 'macroFeed', 'Botsplit', 'Botseject', '_lmMacroId', '_lmMacroSame', '_lmSplitRun',
            'doubleBotSplit', 'popBotSplit', 'splitBot16', 'split', 'split16'].map(method).join(',\n') + '\n};\nwindow.app = window.application = app;', ctx);
    ctx._lmSplitDelay = (n) => 40 * n;
    ctx._lmPopSplitDelay = () => 200;
    const open = () => ({ readyState: 1, OPEN: 1 });
    const player = (name, o) => Object.assign({
        socket: open(), isSocketOpen() { return !!this.socket && this.socket.readyState === this.socket.OPEN; },
        sendEject() { ctx.sent.push(name + ':eject'); }, sendSplit() { ctx.sent.push(name + ':split'); }, sendDoubleSplit() { ctx.sent.push(name + ':double'); },
        sendTripleSplit() { ctx.sent.push(name + ':triple'); }, sendQuadSplit() { ctx.sent.push(name + ':quad'); },
        sendBotEject() { ctx.sent.push(name + ':botEject'); }, sendBotSplit() { ctx.sent.push(name + ':botSplit'); }
    }, o);
    const reset = () => {
        now = 0; frames = []; timers.length = 0; ctx.sent = [];
        ctx.legendmod = player('main', { play: true, _connectSeq: 1 });
        ctx.spects.length = 0;
        ctx.spects.push(player('u2', { number: 2, player: true, active: true, connectionGeneration: 1, playerCellIDs: [7] }));
        ctx.multiboxPlayerEnabled = 0; ctx.app._lmLifeStartAt = 5;
        ctx.app.macroFeedActive = ctx.app.macrobotFeedActive = false; ctx.app.feedIntervalPerm = null;
        ctx._lmMobileFeedHeld = undefined; ctx._lmMacroFeedHeld = undefined;
    };
    const unit = () => ctx.spects[0];
    /* run animation frames every 16 ms up to t */
    const runFrames = (t) => { while (now < t) { now += 16; const f = frames; frames = []; f.forEach((cb) => cb(now)); } };
    const runTimers = (until) => {
        for (let g = 0; g < 1000; g++) {
            timers.sort((x, y) => x.at - y.at);
            const t = timers.shift();
            if (!t || t.at > until) { if (t) timers.unshift(t); break; }
            now = Math.max(now, t.at); t.f();
        }
    };
    const core = () => ctx.core;
    const count = (name) => ctx.sent.filter((s) => s.indexOf(name + ':') === 0).length;

    reset(); core().eject();
    check('dispatch: feed with the main player selected: exactly one send, to the main player', ctx.sent.join() === 'main:eject');
    reset(); ctx.multiboxPlayerEnabled = 2; core().split(); core().eject(); core().quadSplit();
    check('dispatch: unit selected: one send per action, all to the unit', ctx.sent.join() === 'u2:split,u2:eject,u2:quad');
    reset(); ctx.multiboxPlayerEnabled = 9; core().split();
    check('dispatch: a selected number without a unit goes to the main player', ctx.sent.join() === 'main:split');
    reset(); ctx.multiboxPlayerEnabled = 2; unit().active = false;
    check('dispatch: the selected unit is dead: refused, nothing sent (no fallback to the main player)', core().split() === false && ctx.sent.length === 0);
    reset(); ctx.multiboxPlayerEnabled = 2; unit().socket.readyState = 3;
    check('dispatch: the selected unit\'s socket is closed: refused', core().eject() === false && ctx.sent.length === 0);
    reset(); ctx.legendmod.play = false;
    check('dispatch: main player dead: split refused, bot split still sent (the bots play on)', core().split() === false && core().Botsplit() === true && ctx.sent.join() === 'main:botSplit');

    /* stale bound: lmActiveUnit(true) taken before, something changed since */
    reset(); let bound = ctx.lmActiveUnit(true);
    ctx.multiboxPlayerEnabled = 2;
    check('act: bound to the main player, a unit selected since: refused, nothing sent', core().act('sendSplit', bound) === false && ctx.sent.length === 0);
    reset(); ctx.multiboxPlayerEnabled = 2; bound = ctx.lmActiveUnit(true);
    unit().connectionGeneration++;
    const genRefused = core().act('sendSplit', bound) === false;
    reset(); ctx.multiboxPlayerEnabled = 2; bound = ctx.lmActiveUnit(true);
    unit().socket = open();
    const sockRefused = core().act('sendSplit', bound) === false;
    reset(); ctx.multiboxPlayerEnabled = 2; bound = ctx.lmActiveUnit(true);
    unit().playerCellIDs = [8];
    const lifeRefused = core().act('sendSplit', bound) === false;
    check('act: bound to a unit, then its connection / socket / life changed: refused', genRefused && sockRefused && lifeRefused && ctx.sent.length === 0);
    reset(); bound = ctx.lmActiveUnit(true);
    check('act: the same player, connection and life: sent once', core().act('sendSplit', bound) === true && ctx.sent.join() === 'main:split');
    reset(); bound = ctx.lmActiveUnit(true);
    check('lmActiveUnit(true): main player { target, transport lm, slotId 1, sourceId 0, alive }', bound.target === ctx.legendmod && bound.transport === 'lm' && bound.slotId === 1 && bound.sourceId === 0 && bound.alive === true && bound.life === 5 && !('cells' in bound));
    ctx.multiboxPlayerEnabled = 2; bound = ctx.lmActiveUnit(true);
    check('lmActiveUnit(true): unit { target, transport spect, slotId = unit number without a slot, sock, gen, life }', bound.target === unit() && bound.transport === 'spect' && bound.slotId === 2 && bound.sourceId === 2 &&
        bound.sock === unit().socket && bound.gen === 1 && bound.life === unit().playerCellIDs);
    unit().slotId = 3;
    check('lmActiveUnit(true): the unit\'s slotId when it has one', ctx.lmActiveUnit(true).slotId === 3);

    /* held macro feed */
    reset(); ctx.app.macroFeed(true); runFrames(100);
    const fedMain = count('main');
    ctx.multiboxPlayerEnabled = 2; runFrames(300);
    check('held feed: feeds the main player, then the switch to the unit ends it (nothing fed to the unit)', fedMain >= 5 && count('u2') === 0 && count('main') === fedMain && !ctx.app.macroFeedActive);
    reset(); ctx.app.macroFeed(true); runFrames(100);
    ctx.legendmod.play = false; ctx.app._lmLifeStartAt = 0; const atDeath = count('main'); runFrames(300);
    check('held feed: the main player dies: it stops', count('main') === atDeath && !ctx.app.macroFeedActive);
    reset(); ctx.multiboxPlayerEnabled = 2; ctx.app.macroFeed(true); runFrames(100);
    unit().connectionGeneration++; const atRe = count('u2'); runFrames(300);
    check('held feed on a unit: the unit reconnects: it stops', atRe >= 5 && count('u2') === atRe && !ctx.app.macroFeedActive);
    reset(); ctx.multiboxPlayerEnabled = 2; ctx.app.macroFeed(true); runFrames(100);
    unit().active = false; unit().playerCellIDs = []; ctx.multiboxPlayerEnabled = 0; const atUDeath = count('u2'); runFrames(300);
    check('held feed on a unit: the unit dies (focus back to the main player): it stops, the main player is not fed', count('u2') === atUDeath && count('main') === 0 && !ctx.app.macroFeedActive);
    reset(); ctx.app.macroFeed(true); runFrames(100); ctx.multiboxPlayerEnabled = 2; runFrames(150);
    ctx.app.macroFeed(true); runFrames(300);
    check('held feed: a new press after the switch feeds the unit', count('u2') >= 5);
    reset(); ctx._lmMobileFeedHeld = () => true; ctx.app.macroFeed(true); runFrames(100);
    ctx.multiboxPlayerEnabled = 2; runFrames(300);
    check('phone held Feed: keeps its switch behaviour (follows the player you control)', count('main') >= 5 && count('u2') >= 5 && ctx.app.macroFeedActive);

    /* permanent feed (toggle) */
    reset(); ctx.app.macroFeedPerm(true); runTimers(100);
    const permMain = count('main');
    ctx.multiboxPlayerEnabled = 2; runTimers(400);
    check('permanent feed: a switch ends it (not fed to the unit)', permMain >= 5 && count('u2') === 0 && count('main') === permMain && ctx.app.feedIntervalPerm === null);
    reset(); ctx.multiboxPlayerEnabled = 2; ctx.app.macroFeedPerm(true); runTimers(100);
    unit().active = false; unit().playerCellIDs = []; ctx.multiboxPlayerEnabled = 0; const permU = count('u2'); runTimers(400);
    check('permanent feed on a unit: the unit dies: it stops (it went on feeding the main player)', permU >= 5 && count('main') === 0 && ctx.app.feedIntervalPerm === null);

    /* bot feed and bot macros */
    reset(); ctx.app.macrobotFeed(true); runFrames(100);
    const botMain = count('main');
    ctx.multiboxPlayerEnabled = 2; runFrames(300);
    check('bot macro feed: a switch ends it (not sent from the unit)', botMain >= 5 && count('u2') === 0 && !ctx.app.macrobotFeedActive);
    reset(); ctx.app.splitBot16(); ctx.multiboxPlayerEnabled = 2; runTimers(1000);
    check('bot 16 split: switched after the first split: the rest is not sent (to anyone)', ctx.sent.join() === 'main:botSplit');
    reset(); ctx.app.doubleBotSplit(); runTimers(1000);
    check('bot double split: both splits without a change', ctx.sent.join() === 'main:botSplit,main:botSplit');
    reset(); ctx.app.popBotSplit(); ctx.legendmod._connectSeq++; runTimers(1000);
    check('bot pop split: a reconnect after the first ends it', ctx.sent.join() === 'main:botSplit');

    /* delayed split steps */
    reset(); ctx.app.split16(); runTimers(50); ctx.multiboxPlayerEnabled = 2; runTimers(1000);
    check('16 split: switched after two splits: the other two are not sent to the unit', ctx.sent.join() === 'main:split,main:split');
    reset(); ctx.multiboxPlayerEnabled = 2; ctx.app.split16(); runTimers(50); unit().playerCellIDs = [9]; runTimers(1000);
    check('16 split on a unit: a new life of the unit ends it', ctx.sent.join() === 'u2:split,u2:split');
})();


console.log(failed ? failed + ' FAILED' : 'all split macro checks passed');
process.exit(failed ? 1 : 0);
