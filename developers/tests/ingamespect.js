/* In-game spectator toggle (hotkey hk-showIngameSpectator, top bar button set-ingameSpectator), with the
 * real code cut out of ogario/ogario.v4.js: application.setShowIngameSpectator / setIngameSpectator,
 * LM.addSpect (the premium gate and the "one spectator" rule), flushSpectatorsOnly,
 * _lmCloseSpectatorUnits, _lmHasSpectatorUnit, flushSpecsData and the start of sendNick (spawn).
 * Cases: toggle on/off, a multibox unit open (it blocked the spectator), spawn closes the
 * spectator with its flag (the flag alone was cleared and the next toggle did nothing), resuming
 * while alive keeps it, the multibox unit survives every spectator toggle and spawn, no premium:
 * no spectator socket. With a unit and a spectator open together: the multibox switch keys go only
 * between the main player and the units, the follow / free mode switch reaches the spectator, and
 * starting multibox turns the spectator switch off with its socket.
 * node developers/tests/ingamespect.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

function block(start, from) {
    const i = src.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
const appMethods = ['        setShowIngameSpectator() {', '        setShowFullSpectator() {', '        setIngameSpectator() {'].map((m) => [m, block(m)]);
const lmMethods = ['        addSpect() {', '        flushSpectatorsOnly() {', '        _lmCloseSpectatorUnits() {', '        _lmHasSpectatorUnit() {', '        flushSpecsData() {'].map((m) => [m, block(m)]);
/* sendNick up to the first server-specific join (everything after it only builds the spawn packet) */
const nickStart = src.indexOf('        sendNick(nick) {'), nickEnd = src.indexOf('            // ===== Garix join', nickStart);
/* the helpers are new: an older file without them still runs (and shows the old failures) */
lmMethods.forEach((m) => { if (!m[1] && m[0].indexOf('_lm') >= 0) m[1] = m[0].trim() + ' }'; });
const missing = appMethods.concat(lmMethods).filter((m) => !m[1]).map((m) => m[0].trim());
if (missing.length || nickStart < 0 || nickEnd < 0) { console.log('FAIL code not found: ' + missing.concat(nickStart < 0 || nickEnd < 0 ? ['sendNick'] : []).join(', ')); process.exit(1); }
const sendNick = src.slice(nickStart, nickEnd) + '        },';

function env(o) {
    o = o || {};
    const created = [];
    const win = { spects: [], fullSpectator: false, ingameSpectator: false, proLicenceUID: o.premium === false ? null : 'test', clanTagLc: 'ZZX' };
    let nextNumber = 1;
    function Spect(opts) {
        this.number = nextNumber++;
        this.player = !!(opts && opts.player);
        this.closed = false;
        created.push(this);
    }
    Spect.prototype.closeConnection = function () { this.closed = true; };
    const ctx = {
        window: win, console,
        $: (sel) => ({ val: () => (sel === '#nick' ? 'player' : ''), show() { return this; }, hide() { return this; } }),
        addSpectator: () => win.spects.push(new Spect()),
        addFullSpectator: () => { for (let i = 0; i < 3; i++) win.spects.push(new Spect()); },
        ogario: { play: !!o.playing },
        /* the page-level setter of the controlled multibox unit (ogario.v4.js lmSetMbUnit) */
        lmSetMbUnit: (u) => { win.multiboxPlayerEnabled = +u || null; }
    };
    vm.createContext(ctx);
    vm.runInContext('var LM = window.legendmod = {' + lmMethods.map((m) => m[1]).join(',\n') + ',\n' + sendNick + '\n};' +
        'var application = window.application = {' + appMethods.map((m) => m[1]).join(',\n') + '};', ctx);
    /* the global spects of the page is window.spects (top-level var in a classic script) */
    Object.defineProperty(ctx, 'spects', { get: () => win.spects, set: (v) => { win.spects = v; } });
    ctx.addUnit = () => { const u = new Spect({ player: true }); win.spects.push(u); return u; };
    return { ctx, win, created, app: ctx.application, LM: ctx.LM };
}
const spectators = (win) => win.spects.filter((s) => !s.player);

/* 1. plain toggle: on opens one spectator socket, off closes it */
{
    const e = env();
    e.app.setShowIngameSpectator();
    check('toggle on: one in-game spectator socket', e.win.ingameSpectator === true && spectators(e.win).length === 1);
    const sp = spectators(e.win)[0];
    e.app.setShowIngameSpectator();
    check('toggle off: spectator closed and removed', e.win.ingameSpectator === false && sp.closed && e.win.spects.length === 0);
    e.app.setShowIngameSpectator();
    check('toggle on again: a new spectator', spectators(e.win).length === 1 && e.created.length === 2);
}
/* 2. a multibox unit is open: the spectator must still start, and toggling it off keeps the unit */
{
    const e = env();
    const unit = e.ctx.addUnit();
    e.app.setShowIngameSpectator();
    check('multibox unit open: in-game spectator still starts', spectators(e.win).length === 1, e.win.spects.length);
    e.app.setShowIngameSpectator();
    check('toggle off with a unit: unit kept open, spectator closed', e.win.spects.length === 1 && e.win.spects[0] === unit && !unit.closed);
    e.app.setIngameSpectator();
    check('top bar button: spectator starts beside the unit', spectators(e.win).length === 1 && e.win.spects.includes(unit));
}
/* 3. spawning (Play) ends the spectator: socket closed with the flag, the next toggle starts it again */
for (const withUnit of [false, true]) {
    const e = env();
    const unit = withUnit ? e.ctx.addUnit() : null;
    e.app.setShowIngameSpectator();
    const sp = spectators(e.win)[0];
    e.LM.sendNick('me');
    check('spawn: flag cleared', e.win.ingameSpectator === false);
    const tag = withUnit ? ' (multibox unit open)' : '';
    check('spawn: spectator socket closed (no hidden socket left open)' + tag, !!sp && sp.closed && spectators(e.win).length === 0);
    if (unit) check('spawn: multibox unit kept', e.win.spects.length === 1 && e.win.spects[0] === unit && !unit.closed);
    e.app.setShowIngameSpectator();
    check('first toggle after spawn starts the spectator' + tag, e.win.ingameSpectator === true && spectators(e.win).length === 1 && !spectators(e.win)[0].closed);
}
/* 4. Play while alive only resumes the game: the spectator and its flag stay */
{
    const e = env({ playing: true });
    e.app.setShowIngameSpectator();
    const sp = spectators(e.win)[0];
    e.LM.sendNick('me');
    check('resume while alive keeps the spectator and its flag', e.win.ingameSpectator === true && !sp.closed && spectators(e.win).length === 1);
}
/* 5. the full spectator is closed by spawn as well, and the in-game one does not stack on it */
{
    const e = env();
    e.app.setShowFullSpectator();
    check('full spectator opens its sockets', e.win.fullSpectator === true && spectators(e.win).length === 3);
    e.app.setShowIngameSpectator();
    check('in-game spectator not added while the full spectator runs', spectators(e.win).length === 3);
    e.LM.sendNick('me');
    check('spawn closes the full spectator sockets and flag', e.win.fullSpectator === false && e.win.spects.length === 0 && e.created.every((s) => s.closed));
}
/* 6. the premium gate is kept: without it no socket is opened */
{
    const e = env({ premium: false });
    e.app.setShowIngameSpectator();
    check('no premium: no spectator socket', e.win.spects.length === 0);
}

/* 7-9. a multibox unit and an in-game spectator open together (since the unit no longer blocks the
 * spectator): the multibox switch keys (application.multiboxchange / multiboxback) and the
 * spectator's Follow / Free mode (changeSpectatorMode), cut out of ogario.v4.js */
const mbMethods = ['        multiboxchange() {', '        multiboxback() {', '        changeSpectatorMode() {'].map((m) => [m, block(m)]);
if (mbMethods.some((m) => !m[1])) { console.log('FAIL code not found: ' + mbMethods.filter((m) => !m[1]).map((m) => m[0].trim()).join(', ')); process.exit(1); }
function mbEnv() {
    const e = env();
    const c = e.ctx;
    Object.assign(c, { profiles: [], ogarcopythelb: {}, core: null, play: () => { c.played = (c.played || 0) + 1; },
        addBox: () => { const u = c.addUnit(); c.legendmod.multiBoxPlayerExists = true; return u; } });
    c.window.addBox = c.addBox;
    c.legendmod = c.LM;
    vm.runInContext('Object.assign(application, {' + mbMethods.map((m) => m[1]).join(',\n') + '}); application.hideMenu = function () {};' +
        'application.cacheCustomSkin = function () {}; application.mbSlots = [0, 1, 2];', c);
    return e;
}
const addSpectatorOf = (e, extra) => { e.ctx.addSpectator(); const s = spectators(e.win).slice(-1)[0]; return Object.assign(s, { staticX: null, isSpectateEnabled: false, isFreeSpectate: false }, extra || {}); };
/* 7. multibox switch with a unit and an in-game spectator: it goes main -> unit -> main, never to the spectator */
{
    const e = mbEnv();
    const unit = e.ctx.addUnit();
    unit.active = true; unit.respawn = () => { unit.respawned = true; };
    e.LM.multiBoxPlayerExists = true;
    e.app.setShowIngameSpectator();
    const sp = spectators(e.win)[0];
    sp.respawn = () => { sp.respawned = true; };
    const seen = [];
    for (let i = 0; i < 4; i++) { e.app.multiboxchange(); seen.push(e.win.multiboxPlayerEnabled || 0); }
    check('multibox switch: only the main player and the unit, never the spectator', seen.join(',') === [unit.number, 0, unit.number, 0].join(','), seen.join(','));
    const back = [];
    for (let i = 0; i < 4; i++) { e.app.multiboxback(); back.push(e.win.multiboxPlayerEnabled || 0); }
    check('multibox switch back: only the main player and the unit, never the spectator', back.join(',') === [unit.number, 0, unit.number, 0].join(','), back.join(','));
    check('the spectator was not told to spawn', !sp.respawned && !sp.closed && e.win.ingameSpectator === true);
}
/* 8. Follow / Free mode reaches the in-game spectator when a unit was opened first */
{
    const e = mbEnv();
    e.ctx.addUnit();
    e.LM.multiBoxPlayerExists = true;
    const sp = addSpectatorOf(e, { isSpectateEnabled: true });
    sp.sendFreeSpectate = () => { sp.isFreeSpectate = !sp.isFreeSpectate; sp.freeCalls = (sp.freeCalls || 0) + 1; };
    e.win.spects[0].sendFreeSpectate = () => { e.win.spects[0].wrong = true; };
    e.app.spectatorFollow = false;
    e.app.changeSpectatorMode();
    check('Follow / Free on: the in-game spectator switches to free spectate', sp.freeCalls === 1 && sp.isFreeSpectate === true, sp.freeCalls);
    e.app.changeSpectatorMode();
    check('Follow / Free off: the in-game spectator leaves free spectate', sp.freeCalls === 2 && sp.isFreeSpectate === false, sp.freeCalls);
    check('the multibox unit is left alone', !e.win.spects[0].wrong);
    /* no spectator open: the first connection (a spectating unit) switches, as before */
    const e2 = mbEnv();
    const u = Object.assign(e2.ctx.addUnit(), { staticX: null, isSpectateEnabled: true, isFreeSpectate: false });
    u.sendFreeSpectate = () => { u.isFreeSpectate = !u.isFreeSpectate; };
    e2.app.spectatorFollow = false;
    e2.app.changeSpectatorMode();
    check('only a spectating unit: it switches to free spectate as before', u.isFreeSpectate === true);
}
/* 8b. no spectator and nothing spectating: the switch does nothing (no throw, the mode is not flipped:
 * a flipped flag made the next press, with a spectator open, do nothing) */
{
    const e = mbEnv();
    e.app.spectatorFollow = false;
    let threw = null;
    try { e.app.changeSpectatorMode(); } catch (err) { threw = err; }
    check('no spectator: no throw and the mode is unchanged', !threw && e.app.spectatorFollow === false, threw);
    const unit = Object.assign(e.ctx.addUnit(), { staticX: null, isSpectateEnabled: false, isFreeSpectate: false });
    unit.sendFreeSpectate = () => { unit.wrong = true; };
    e.app.changeSpectatorMode();
    check('only a playing unit: it is left alone, the mode is unchanged', !unit.wrong && e.app.spectatorFollow === false);
    const sp = addSpectatorOf(e, { isSpectateEnabled: true });
    sp.sendFreeSpectate = () => { sp.isFreeSpectate = !sp.isFreeSpectate; };
    e.app.spectatorFollow = true; /* left on by an earlier spectator */
    e.app.changeSpectatorMode();
    check('a new spectator: the first press switches it to free spectate', sp.isFreeSpectate === true && e.app.spectatorFollow === true);
}
/* 8c. the hotkey (ogario/hotkeysCommand.js): an entry with no default key whose keyDown calls
 * application.changeSpectatorMode() */
{
    const hk = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'hotkeysCommand.js'), 'utf8').replace(/\r\n/g, '\n');
    const re = /\n {12}'(hk-[\w-]+)': \{/g;
    const found = [];
    let m;
    while ((m = re.exec(hk))) {
        const i = m.index + 1;
        let d = 0, body = null;
        for (let k = hk.indexOf('{', i); k < hk.length; k++) {
            if (hk[k] === '{') d++;
            else if (hk[k] === '}' && !--d) { body = hk.slice(i, k + 1); break; }
        }
        if (body && body.indexOf('changeSpectatorMode') >= 0) found.push([m[1], body]);
    }
    check('one hotkey entry calls changeSpectatorMode', found.length === 1, found.map((f) => f[0]).join(','));
    if (found.length === 1) {
        const calls = [];
        const c = vm.createContext({ lmT: (k) => k, application: { changeSpectatorMode() { calls.push('mode'); } } });
        const entry = vm.runInContext('({' + found[0][1] + '})', c)[found[0][0]];
        entry.keyDown();
        check('the hotkey has no default key, a label and calls application.changeSpectatorMode()',
            entry.defaultKey === '' && entry.label === 'settings.' + found[0][0] && entry.type === 'normal' && calls.join() === 'mode', found[0][0] + ' ' + JSON.stringify(entry.defaultKey) + ' ' + calls);
        c.application = null;
        let threw = null;
        try { entry.keyDown(); } catch (err) { threw = err; }
        check('the hotkey without application: no throw', !threw, threw);
    }
}
/* 9. starting multibox ends the in-game spectator: its switch goes off with its socket */
{
    const e = mbEnv();
    e.app.setShowIngameSpectator();
    const sp = spectators(e.win)[0];
    e.app.multiboxchange();
    check('multibox start: spectator socket closed, a unit opened', sp.closed && spectators(e.win).length === 0 && e.win.spects.length === 1 && e.win.spects[0].player);
    check('multibox start: the in-game spectator switch is off with it', e.win.ingameSpectator === false);
    e.app.setShowIngameSpectator();
    check('the first press afterwards starts the spectator again', e.win.ingameSpectator === true && spectators(e.win).length === 1);
}

/* 10. Full Map with the real ogario/spect.js (Spect, addFullSpectator, addBox) under the same core
 * toggles: sockets and timers are counted. Toggled on and off repeatedly: never more than one
 * grid of sockets, none and no timer left after off (also with a reconnect pending), the main
 * border packets calling LM.addSpect again add nothing, nothing opens before the border is fixed,
 * and a multibox unit keeps its socket through every Full Map toggle. */
{
    const spectSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'spect.js'), 'utf8');
    const sockets = [], timers = new Map();
    let timerId = 0;
    const ctx = {
        console: { log() { }, warn() { }, error: console.error }, Date, Math, Number, Object, JSON, Set, DataView, ArrayBuffer, Uint8Array, String, parseInt,
        setInterval: (fn, ms) => { timers.set(++timerId, { fn, ms, repeat: true }); return timerId; },
        setTimeout: (fn, ms) => { timers.set(++timerId, { fn, ms }); return timerId; },
        clearInterval: (id) => { timers.delete(id); }, clearTimeout: (id) => { timers.delete(id); },
        toastr: { error() { ctx.toasts = (ctx.toasts || 0) + 1; } }, lmT: (k) => k,
        $: (sel) => ({ val: () => (sel === '#nick' ? 'player' : ''), show() { return this; }, hide() { return this; } }),
        lmSetMbUnit: (u) => { ctx.multiboxPlayerEnabled = +u || null; },
        WebSocket: { CONNECTING: 0, OPEN: 1 },
        defaultmapsettings: {}, profiles: [], master: { clientVersion: 1, protocolVersion: 1 },
        application: { mbSlots: [0, 1, 2], writeUint32() { } },
        proLicenceUID: 'test', clanTagLc: 'ZZX'
    };
    ctx.window = ctx;
    ctx.createLegendWebSocket = (url) => {
        const s = { url, readyState: 0, OPEN: 1, CONNECTING: 0, sent: 0, send() { this.sent++; }, close() { this.readyState = 3; this.closed = true; } };
        sockets.push(s);
        return s;
    };
    vm.createContext(ctx);
    vm.runInContext('var legendmod = window.legendmod = { ws: "wss://test", integrity: true, mapOffsetFixed: true, mapMinX: -7071, mapMinY: -7071, mapMaxX: 7071, mapMaxY: 7071,' +
        ' mapOffsetX: 0, mapOffsetY: 0, vector: null, vnr: 0, playerCellsMulti: [], indexedCells: {}, cells: [], foodMulti: [],' +
        lmMethods.map((m) => m[1]).join(',\n') + '}; var LM = legendmod;' +
        'var application = Object.assign(window.application, {' + appMethods.map((m) => m[1]).join(',\n') + '});', ctx);
    vm.runInContext(spectSrc, ctx);
    const app = ctx.application, LM = ctx.legendmod;
    const open = () => sockets.filter((s) => !s.closed).length;
    const fullOf = () => ctx.spects.filter((s) => !s.player);
    /* the socket handshake as far as the tile sender: open, keys, opcode 242 (spectate, tile sender, free spectate), border */
    const handshake = (s, i) => {
        s.socket.readyState = 1; s.socket.onopen();
        s.protocolKey = 5; s.clientKey = 7;
        s.pingInterval = ctx.setInterval(() => s.sendPing(), 3000);
        s.sendSpectate(); s.startStaticPositionController(); s.sendFreeSpectate();
        s.mapOffsetFixed = true; s.mapOffsetX = 300 * i; s.mapOffsetY = -200 * i;
    };
    let grid = 0;
    for (let round = 0; round < 4; round++) {
        app.setShowFullSpectator();
        const sp = fullOf();
        if (!round) grid = sp.length;
        sp.forEach(handshake);
        LM.addSpect(); LM.addSpect(); /* the next main border packets */
        if (round === 1) { const ds = sp[3].socket; ds.readyState = 3; ds.closed = true; ds.onclose(); } /* a server-dropped spectator: reconnect pending */
        const tick = [...timers.values()].filter((t) => t.ms === 100); /* the tile sender (_lmTileTick) */
        tick.forEach((t) => t.fn());
        if (round === 0) {
            check('Full Map on: 15 spectators, one socket each', grid === 15 && open() === 15 && sockets.length === 15, grid + ' / ' + open());
            check('the border packets afterwards add no second grid', fullOf().length === 15 && open() === 15);
            check('each tile sender sent its target once its border was known', sp.every((s) => s.socket.sent >= 4) && tick.length === 15, tick.length);
        }
        if (round === 1) check('a dropped spectator has its reconnect timer', [...timers.values()].some((t) => t.ms === 1000 && !t.repeat));
        app.setShowFullSpectator();
        check('Full Map off (round ' + (round + 1) + '): no socket and no timer left', ctx.fullSpectator === false && open() === 0 && timers.size === 0 && ctx.spects.length === 0,
            open() + ' sockets, ' + timers.size + ' timers, ' + ctx.spects.length + ' spects');
    }
    check('4 rounds opened 4 grids, no more', sockets.length === 4 * 15, sockets.length); /* the reconnect of round 2 never ran */
    /* not before the main border is fixed: the grid waits for it */
    LM.mapOffsetFixed = false;
    app.setShowFullSpectator();
    check('provisional border: nothing opens yet, the switch stays on', ctx.fullSpectator === true && ctx.spects.length === 0 && !ctx.toasts);
    LM.mapOffsetFixed = true; LM.addSpect();
    check('border fixed: the next border packet opens the grid', fullOf().length === 15);
    app.setShowFullSpectator();
    /* Full Map and a multibox unit together */
    const before = sockets.length;
    ctx.addBox();
    const unit = ctx.spects[0];
    unit.socket.readyState = 1;
    const unitTimer = ctx.setInterval(() => { }, 40); unit.positionController = unitTimer;
    for (let i = 0; i < 2; i++) {
        app.setShowFullSpectator();
        check('multibox unit open: Full Map still opens its 15 spectators (' + (i + 1) + ')', fullOf().length === 15 && ctx.spects.includes(unit));
        app.setShowFullSpectator();
        check('Full Map off: the unit keeps its socket and timer (' + (i + 1) + ')', ctx.spects.length === 1 && ctx.spects[0] === unit && !unit.socket.closed && timers.has(unitTimer) &&
            open() === 1, open());
    }
    check('unit + 2 grids opened, no more', sockets.length === before + 1 + 30, sockets.length - before);
    /* not agar.io: refused with the message, the switch goes off */
    LM.integrity = false;
    ctx.spects.length = 0;
    app.setShowFullSpectator();
    check('private server: no spectator, message shown, switch off', ctx.spects.length === 0 && ctx.toasts === 1 && ctx.fullSpectator === false);
    /* the follow / free camera switch on a real in-game spectator: free spectate starts its cursor
     * timer, the second press stops it; closed again, the switch does nothing */
    LM.integrity = true;
    ctx.ogario = ctx.ogario || {};
    vm.runInContext('Object.assign(application, {' + mbMethods[2][1] + '});', ctx);
    app.spectatorFollow = false;
    app.setShowIngameSpectator();
    const isp = ctx.spects.filter((s) => !s.player)[0];
    check('in-game spectator open (real spect.js)', ctx.ingameSpectator === true && !!isp && isp.staticX == null);
    if (isp) {
        isp.socket.readyState = 1; isp.socket.onopen(); isp.protocolKey = 5; isp.clientKey = 7;
        isp.sendSpectate();
        const sentBefore = isp.socket.sent;
        app.changeSpectatorMode();
        const cursor = isp.positionController && timers.get(isp.positionController);
        check('switch: free spectate with its cursor timer', isp.isFreeSpectate === true && !!cursor && cursor.repeat === true && app.spectatorFollow === true && isp.socket.sent > sentBefore,
            isp.isFreeSpectate + ' ' + !!cursor);
        const cursorId = isp.positionController;
        app.changeSpectatorMode();
        check('switch again: back to following, cursor timer stopped', isp.isFreeSpectate === false && isp.positionController == null && !timers.has(cursorId) && app.spectatorFollow === false);
        app.setShowIngameSpectator();
        check('in-game spectator closed', ctx.ingameSpectator === false && ctx.spects.length === 0);
        const t1 = timers.size;
        let threw = null;
        try { app.changeSpectatorMode(); } catch (err) { threw = err; }
        check('no spectator: the switch does nothing and does not throw', !threw && app.spectatorFollow === false && timers.size === t1, threw);
    }
}

console.log(failed ? 'FAILED ' + failed : 'all ingamespect checks passed');
process.exit(failed ? 1 : 0);
