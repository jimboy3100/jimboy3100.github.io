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
    /* the aim lock is the last crazy double split's: the first one's end (40 ms) does not unlock
     * the one pressed at 20 ms (its second split at 60 ms) */
    for (const server of ['agario', 'imsolo']) {
        reset(); ctx.LM.serverType = server; ctx.core = server === 'imsolo' ? { doubleSplit() { ctx.sent.push(Math.round(now)); } } : undefined;
        ctx.app.crazyDoubleSplit(); now = 20; ctx.app.crazyDoubleSplit(); run(45);
        const held = ctx.lockPosition; run(1000);
        check('macro (' + server + '): crazy double split pressed again 20 ms after the first: the end of the first leaves the aim lock of the second, which ends with it',
            held === true && ctx.lockPosition === false && ctx.sent.length === (server === 'imsolo' ? 2 : 4));
    }
    ctx.LM.serverType = 'agario'; ctx.core = undefined;
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
    check('dispatch (lmActiveUnit alone, as with an older core without the focus check): a selected number without a unit goes to the main player', ctx.sent.join() === 'main:split');
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
    /* the unit's life list is replaced at its death and its next life fills the same list: the life
     * counter (_lmLife, lmActiveUnit lifeGen) tells the lives apart */
    reset(); ctx.multiboxPlayerEnabled = 2; unit().active = false; unit().playerCellIDs = []; unit()._lmLife = 1;
    ctx.app.split16(); runTimers(50);
    unit().active = true; unit()._lmLife = 2; unit().playerCellIDs.push(11); runTimers(1000);
    check('16 split pressed on the selected unit while it is dead: its respawn meanwhile (same id list, a new life) gets none of the rest', ctx.sent.length === 0, ctx.sent.join());
    reset(); ctx.multiboxPlayerEnabled = 2; unit()._lmLife = 3; bound = ctx.lmActiveUnit(true); unit()._lmLife = 4;
    check('act: bound to a unit, its life counter changed since (a new life in the same id list): refused', bound.lifeGen === 3 && core().act('sendSplit', bound) === false && ctx.sent.length === 0);
    reset(); ctx.app._lmLifeStartAt = 5; ctx.legendmod._lmLife = 1; bound = ctx.lmActiveUnit(true);
    check('lmActiveUnit(true): lifeGen of the main player is its _lmLife', bound.lifeGen === 1 && core().act('sendSplit', bound) === true);
    /* away and back between two splits (P1 -> P2 -> P1 before the next one is due): the identity is
     * the one when each split is sent, so the rest still goes to P1, the player it started on and
     * controlled again; nothing reaches P2. A switch seen at a split's time ends the macro (above). */
    reset(); ctx.app.split16(); runTimers(50); ctx.multiboxPlayerEnabled = 2; ctx.multiboxPlayerEnabled = 0; runTimers(1000);
    check('16 split: away to the unit and back to P1 between two splits: the rest to P1 only, none to the unit', ctx.sent.join() === 'main:split,main:split,main:split,main:split', ctx.sent.join());
    /* the phone's held Feed follows the focus, never to a player the focus does not name */
    reset(); ctx._lmMobileFeedHeld = () => true; ctx.multiboxPlayerEnabled = 2; ctx.app.macroFeed(true); runFrames(100);
    const u2fed = count('u2'); ctx.spects.length = 0; runFrames(300);
    check('phone held Feed: the selected unit gone (its number stale): P1 is not fed in its place, the hold stays', u2fed >= 5 && count('main') === 0 && ctx.app.macroFeedActive, count('main'));
    ctx.multiboxPlayerEnabled = 0; runFrames(500);
    check('    ... the focus on P1 again: it feeds P1', count('main') >= 5);
})();

/* Decision 8 (manual split / feed parity): the main player (P1) dead or spectating does not take the
 * manual controls from a living multibox unit you selected. Each action, from its own entry point
 * (application / LM.lineSplit, as its key, mouse button, pad or phone button runs it), sends the
 * unit exactly what P1 gets for it while P1 plays (agar.io: single splits; Imsolo: the atomic
 * 2/3/4 split opcodes), and P1 nothing. A selected unit that is dead, still connecting, on a closed
 * socket or a spectator (no playing unit) gets nothing, and nothing goes to P1 instead. */
(function () {
    const { world, ACTIONS } = require('./lib/mbaction.js');
    const W = world({ v4: src });
    if (W.missing) { check('action code found: ' + W.missing.join(', '), false); return; }
    const run = (s, a) => { W.state(s); ACTIONS[a](W); W.advance(2000); return W; };
    for (const server of ['agario', 'imsolo']) {
        for (const a of Object.keys(ACTIONS)) {
            const ref = run({ main: 'alive', focus: 0, server }, a).kinds('main');
            const dead = run({ main: 'dead', focus: 2, server }, a), deadU = dead.kinds('u2'), deadM = dead.count('main');
            const spec = run({ main: 'spectating', focus: 2, server }, a), specU = spec.kinds('u2'), specM = spec.count('main');
            const refN = ref.split(','), shown = refN.length > 4 ? refN[0] + ' x' + refN.length : ref;
            check('parity (' + server + ') ' + a + ': P1 dead / P1 spectating, P2 selected: P2 gets what P1 gets [' + shown + '], P1 nothing',
                ref.length > 0 && deadU === ref && specU === ref && deadM === 0 && specM === 0);
            const bad = ['dead', 'connecting', 'stale', 'spectator'].filter((u) => run({ main: 'dead', unit: u, focus: 2, server }, a).log.length);
            check('parity (' + server + ') ' + a + ': the selected P2 dead / connecting / closed socket / a spectator: nothing sent to anyone', bad.length === 0);
        }
    }
    /* P1 dies while a macro or a held feed runs on the selected unit: it goes on (the unit's life,
     * socket and connection did not change); the unit's own death still ends it */
    W.state({ main: 'alive', focus: 2 }); W.app().split16(); W.advance(50);
    W.lm().play = false; W.app()._lmLifeStartAt = 0; W.advance(1000);
    check('16 split on P2: P1 dies after the second split: the other two still reach P2', W.kinds('u2') === 'split,split,split,split' && W.count('main') === 0);
    W.state({ main: 'alive', focus: 2 }); W.app().macroFeed(true); W.advance(100);
    const before = W.count('u2'); W.lm().play = false; W.app()._lmLifeStartAt = 0; W.advance(200);
    check('held feed on P2: P1 dies: it goes on feeding P2', before >= 5 && W.count('u2') >= before + 10 && W.count('main') === 0);
    W.unit().active = false; W.unit().playerCellIDs = []; const atDeath = W.count('u2'); W.advance(200);
    check('    ... then P2 dies: it stops, nothing to P1', W.count('u2') === atDeath && W.count('main') === 0 && !W.app().macroFeedActive);
})();

/* Handoff 2026-11-28 section 4 (13.3): focus and action routing agree. The real LMEvents .. registry
 * helpers (lmSetMbUnit, lmMbFocused, lmMbFocusCheck), lmActiveUnit, lmMultiboxControlledPlayer and
 * window.core.act: a focus left on a source that is no unit of ours (a number nobody has, a unit
 * closed for good, a passive Full Map tile) is moved on before anything acts, the action asked for
 * at that moment reaches nobody (never the player the focus fell back to), and from then on every
 * reader names the same player; lmSetMbUnit never takes a tile or a gone unit; a bound action of a
 * unit replaced in its slot under its number is refused; a feed or split of a unit whose
 * orientation is not verified is refused (it holds on its own centre), its bot commands are not. */
(function () {
    const evA = src.indexOf('/* LMEvents: hooks'), evB = src.indexOf('window.OgVer', evA);
    const a = src.indexOf('\n        act(m, bound) {'), b = src.indexOf('\n        specialOn() {', a);
    if (evA < 0 || evB < 0 || a < 0 || b < 0 || src.slice(evA, evB).indexOf('function lmMbFocusCheck(') < 0) { check('focus / action routing code found', false); return; }
    const ctx = { console: { log() { }, warn() { } }, Math, Number, Date, toastr: {} };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(src.slice(evA, evB) + '\n' + fn('lmActiveUnit') + '\n' + fn('lmMultiboxControlledPlayer') + '\nwindow.core = {' + src.slice(a, b) + '\n};\n' +
        'var application = window.application = { _lmLifeStartAt: 5 };', ctx);
    const open = () => ({ readyState: 1, OPEN: 1 });
    const player = (name, o) => Object.assign({
        socket: open(), isSocketOpen() { return !!this.socket && this.socket.readyState === this.socket.OPEN; },
        sendEject() { ctx.sent.push(name + ':eject'); }, sendSplit() { ctx.sent.push(name + ':split'); }, sendDoubleSplit() { ctx.sent.push(name + ':double'); },
        sendBotEject() { ctx.sent.push(name + ':botEject'); }, sendBotSplit() { ctx.sent.push(name + ':botSplit'); }
    }, o);
    const reg = ctx.lmMbPlayers;
    const unit = (name, n) => { const r = reg.reserve(); const u = player(name, { number: n, player: true, active: true, slotId: r.slotId, slotEpoch: r.slotEpoch, connectionGeneration: 1, playerCellIDs: [n] }); reg.attach(u); ctx.spects.push(u); return u; };
    ctx.sent = [];
    ctx.legendmod = player('main', { play: true, _connectSeq: 1 });
    const u2 = unit('u2', 2), tile = player('tile', { number: 3, player: false, active: true }), u5 = unit('u5', 5);
    ctx.spects.push(tile);
    const agree = () => {
        const f = ctx.lmMbFocused(), n = +ctx.multiboxPlayerEnabled || 0, au = ctx.lmActiveUnit(true);
        return au.target === f && (n ? f && f.number === n && f.player === true : f === ctx.legendmod) && ctx.lmMbPlayers.activeSlot === ctx.lmMultiboxControlledPlayer();
    };
    const core = ctx.core;
    /* a number nobody has, written past the transition (an older script): refused once, then P1 */
    ctx.multiboxPlayerEnabled = 9; ctx.sent = [];
    const r9 = core.split();
    check('section 4: a selected number without a unit: the split goes to nobody (not P1), the focus is moved on to P1, every reader agrees',
        r9 === false && ctx.sent.length === 0 && !ctx.multiboxPlayerEnabled && ctx.lmMbPlayers.activeSlot === 1 && agree());
    check('    ... the next split goes to P1, now the player in focus everywhere', core.split() === true && ctx.sent.join() === 'main:split');
    /* the passive spectator (a Full Map tile) */
    ctx.lmSetMbUnit(2); ctx.sent = [];
    ctx.lmSetMbUnit(tile.number);
    check('    ... lmSetMbUnit with a Full Map tile\'s number: refused, the focus stays on P2', ctx.multiboxPlayerEnabled === 2 && ctx.lmMbPlayers.activeSlot === 2 && agree());
    ctx.multiboxPlayerEnabled = tile.number;
    const rt = core.eject();
    check('    ... a tile\'s number written past the transition: the feed reaches nobody (not the tile, not P1), the focus is moved on',
        rt === false && ctx.sent.length === 0 && ctx.multiboxPlayerEnabled !== tile.number && agree(), ctx.sent.join());
    /* a unit closed for good (still registered while it is removed) */
    ctx.lmSetMbUnit(5); ctx.sent = [];
    u5._lmRemoved = true;
    const rr = core.split();
    check('    ... the selected unit removed: the split reaches nobody, the focus moves to P1 (alive), readers agree', rr === false && ctx.sent.length === 0 && !ctx.multiboxPlayerEnabled && agree());
    u5._lmRemoved = false;
    /* a unit replaced in its slot under the same number: a bound action of the old one is refused */
    ctx.lmSetMbUnit(5); ctx.sent = [];
    const bound = ctx.lmActiveUnit(true);
    reg.release(u5.slotId, u5.slotEpoch); ctx.spects.splice(ctx.spects.indexOf(u5), 1);
    const nu = unit('new5', 5);
    check('    ... P3 replaced in its slot under its number: the old unit\'s bound split is refused, nothing sent', core.act('sendSplit', bound) === false && ctx.sent.length === 0 && nu.slotId === 3);
    check('    ... lmSetMbUnit(5, the old object): refused; the new unit is the one in focus by its number', (ctx.lmSetMbUnit(5, u5), ctx.lmMbFocused() === nu && agree()));
    /* the orientation not verified: aimed actions refused, bot commands sent */
    ctx.lmSetMbUnit(2); ctx.sent = [];
    u2.transformReady = () => false;
    const aimed = [core.split(), core.eject(), core.doubleSplit()], bots = [core.Botsplit(), core.Botseject()];
    check('    ... the unit in focus not verified (it holds on its centre): split / feed / double split refused, nothing to anyone; the bot commands still sent',
        aimed.every((x) => x === false) && bots.every((x) => x === true) && ctx.sent.join() === 'u2:botSplit,u2:botEject', ctx.sent.join());
    u2.transformReady = () => true; ctx.sent = [];
    check('    ... verified (or CONFLICTED after verified: transformReady): the split reaches it', core.split() === true && ctx.sent.join() === 'u2:split');
})();


console.log(failed ? failed + ' FAILED' : 'all split macro checks passed');
process.exit(failed ? 1 : 0);
