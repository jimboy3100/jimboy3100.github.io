/* Manual actions of the player you control, with the real code of ogario/ogario.v4.js in a vm
 * (getActiveSpect, lmActiveUnit, lmMbAlive, lmMbSteersLiving when there, window.core.act and its
 * actions, the application's feed / macro feed / split macros, LM.lineSplit, LM._lmSpecClickAt),
 * for the input tests (keys, mouse buttons, pad, phone buttons): the main player (P1) alive, dead
 * or spectating, a multibox unit (P2, number 2) selected or not, alive, dead, on a closed socket or a
 * spectator. Every send of a player is logged as 'main:split', 'u2:eject' ... on a virtual clock
 * (advance(ms) runs the timers and a frame every 16 ms). Nothing is sent anywhere.
 * const W = require('./lib/mbaction.js').world(); W.state({ main: 'dead', unit: 'alive', focus: 2 }); */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = process.env.LM_ROOT || path.join(__dirname, '..', '..', '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8').replace(/\r\n/g, '\n');
/* a function or method from `head` to its closing brace (braces in comments and strings skipped) */
function body(src, head) {
    const i = src.indexOf(head);
    if (i < 0) return null;
    let d = 0, k = src.indexOf('{', i + head.length - 1);
    for (; k < src.length; k++) {
        const ch = src[k], nx = src[k + 1];
        if (ch === '/' && nx === '/') { k = src.indexOf('\n', k); continue; }
        if (ch === '/' && nx === '*') { k = src.indexOf('*/', k + 2) + 1; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { for (k++; k < src.length && src[k] !== ch; k++) if (src[k] === '\\') k++; continue; }
        if (ch === '{') d++; else if (ch === '}' && !--d) break;
    }
    return src.slice(i, k + 1);
}
const APP = ['feed', '_lmFeedTick', 'macroFeedPerm', 'macroFeed', '_lmMacroId', '_lmMacroSame', '_lmSplitRun',
    'split', 'doubleSplit', 'crazyDoubleSplit', 'popSplit', 'tripleSplit', 'split16'];
const LMM = ['getLineSplitUnitNumber', 'getLineSplitCell', 'lineSplitStillValid', 'lineSplit', 'stopLineSplit', 'getLineSplitSettings', '_lmSpecClickAt'];
const SENDS = { sendSplit: 'split', sendEject: 'eject', sendDoubleSplit: 'double', sendTripleSplit: 'triple', sendQuadSplit: 'quad', sendBotEject: 'botEject', sendBotSplit: 'botSplit' };

function world(opt) {
    opt = opt || {};
    const v4 = opt.v4 || read('ogario/ogario.v4.js');
    const missing = [];
    const pick = (h) => { const b = body(v4, h); if (!b) missing.push(h.trim()); return b || ''; };
    const fns = ['function getActiveSpect(', 'function lmActiveUnit(', 'function lmMbAlive(', 'function lmMultiboxControlledPlayer('].map(pick);
    /* the helper this change adds: absent in an older core (its checks then fail there) */
    const steer = body(v4, 'function lmMbSteersLiving(') || '';
    const ca = v4.indexOf('\n        act(m, bound) {'), cb = v4.indexOf('\n        specialOn() {', ca);
    if (ca < 0 || cb < 0) missing.push('window.core.act');
    const app = APP.map((m) => pick('\n        ' + m + '(').trim());
    const lm = LMM.map((m) => pick('\n        ' + m + '(').trim());
    let now = 0;
    const timers = [], log = [];
    let frames = [];
    const ctx = {
        Math, Number, Object, Array, JSON, Date, console: { log() { }, warn() { } }, performance: { now: () => now },
        setTimeout: (f, d) => { timers.push({ f, at: now + Math.max(0, +d || 0) }); return timers.length; }, clearTimeout() { },
        requestAnimationFrame: (f) => { frames.push(f); return frames.length; }, cancelAnimationFrame: () => { frames = []; },
        defaultmapsettings: { macroFeeding: 10, lineSplitCount: 2, lineSplitHold: 300 }, spects: [], $: () => ({ is: () => !!ctx._menu, show() { }, hide() { } })
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    if (missing.length) return { missing };
    vm.runInContext(fns.join('\n') + '\n' + steer + '\nwindow._lmSplitDelay = function (n) { return 40 * n; };\nwindow._lmPopSplitDelay = function () { return 200; };\n' +
        'window.core = {' + v4.slice(ca, cb) + '\n};\nvar application = window.application = {\n' + app.join(',\n') + '\n};\n' +
        'var LMproto = {\n' + lm.join(',\n') + '\n};', ctx);
    const open = () => ({ readyState: 1, OPEN: 1 });
    const player = (name, o) => {
        const p = Object.assign({ socket: open(), isSocketOpen() { return !!this.socket && this.socket.readyState === this.socket.OPEN; } }, o);
        Object.keys(SENDS).forEach((m) => { p[m] = function () { log.push(name + ':' + SENDS[m]); }; });
        return p;
    };
    const cell = () => ({ x: 100, y: 100, size: 120, targetSize: 120 });
    const W = {
        ctx, log, missing: null,
        get now() { return now; },
        app: () => ctx.application,
        core: () => ctx.core,
        lm: () => ctx.legendmod,
        unit: () => ctx.spects[0],
        /* main: 'alive' | 'dead' | 'spectating'; unit: 'alive' | 'dead' | 'stale' (socket closed) |
         * 'connecting' | 'spectator' | 'none'; focus: the unit number selected (0 = P1);
         * server: LM.serverType ('agario' default; 'imsolo' has the atomic 2/3/4 split opcodes) */
        state(s) {
            s = Object.assign({ main: 'alive', unit: 'alive', focus: 0, server: 'agario' }, s);
            /* frames are kept: a loop that ended sees its flag off; the pad's loop goes on */
            now = 0; timers.length = 0; log.length = 0; ctx._menu = false;
            const L = Object.create(ctx.LMproto);
            Object.assign(L, player('main', {}), {
                play: s.main === 'alive', isSpectateEnabled: s.main === 'spectating', isFreeSpectate: false, _isWorldSpectating: false,
                _connectSeq: 1, serverType: s.server, playerCells: s.main === 'alive' ? [cell()] : [], cursorX: 900, cursorY: 100, clientX: 0, clientY: 0,
                lineSplitActive: false, lineSplitSeq: 0, lineSplitTarget: null, pause: false,
                getCursorPosition() { this._cursorCalls = (this._cursorCalls || 0) + 1; }, updateLineSplitStatus() { }, sendPosition() { },
                getLineSplitAimPoint(c, x, y) { return { x, y }; }
            });
            ctx.legendmod = ctx.LM = L;
            ctx.spects.length = 0;
            if (s.unit !== 'none') {
                const u = player('u2', {
                    number: 2, slotId: 2, player: s.unit !== 'spectator', active: s.unit === 'alive' || s.unit === 'stale' ? true : s.unit === 'connecting' ? null : false,
                    connectionGeneration: 1, playerCellIDs: s.unit === 'alive' || s.unit === 'stale' ? [7] : [],
                    getOwnPlayerCells() { return this.active ? [cell()] : []; }
                });
                if (s.unit === 'stale') u.socket.readyState = 3;
                ctx.spects.push(u);
            }
            ctx.multiboxPlayerEnabled = s.focus || null;
            const a = ctx.application;
            a._lmLifeStartAt = s.main === 'alive' ? 5 : 0;
            a.macroFeedActive = a.macrobotFeedActive = false; a.feedIntervalPerm = null; a.pause = false;
            ctx.lockPosition = false; ctx.autoPlay = false;
            delete ctx._lmMobileFeedHeld; delete ctx._lmMacroFeedHeld;
            return W;
        },
        /* runs the timers due and a frame every 16 ms for ms */
        advance(ms) {
            const end = now + ms;
            for (let g = 0; g < 100000 && now < end; g++) {
                timers.sort((x, y) => x.at - y.at);
                const nextT = timers.length ? timers[0].at : Infinity, nextF = (Math.floor(now / 16) + 1) * 16;
                const t = Math.min(nextT, nextF, end);
                now = Math.max(now, t);
                if (timers.length && timers[0].at <= now) { timers.shift().f(); continue; }
                if (now === nextF) { const f = frames; frames = []; f.forEach((cb) => cb(now)); }
            }
            return W;
        },
        count(who) { return log.filter((s) => s.indexOf(who + ':') === 0).length; },
        /* the log without the player names, for a parity check (the same sends as P1's) */
        kinds(who) { return log.filter((s) => s.indexOf(who + ':') === 0).map((s) => s.slice(who.length + 1)).join(); }
    };
    return W;
}
/* the manual actions, each from its own entry point (as its key / button runs it); held ones are
 * held for 100 ms; the toggle (permanent feed) is turned off after 100 ms */
const ACTIONS = {
    split: (W) => W.app().split(),
    doubleSplit: (W) => W.app().doubleSplit(),
    tripleSplit: (W) => W.app().tripleSplit(),
    split16: (W) => W.app().split16(),
    popSplit: (W) => W.app().popSplit(),
    crazyDoubleSplit: (W) => W.app().crazyDoubleSplit(),
    feed: (W) => W.app().feed(),
    macroFeed: (W) => { W.app().macroFeed(true); W.advance(100); W.app().macroFeed(false); },
    macroFeedPerm: (W) => { W.app().macroFeedPerm(true); W.advance(100); W.app().macroFeedPerm(true); },
    lineSplit: (W) => W.lm().lineSplit()
};
module.exports = { world, body, ACTIONS };
