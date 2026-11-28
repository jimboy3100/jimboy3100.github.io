/* In-game spectator toggle (hotkey hk-showIngameSpectator, top bar button set-ingameSpectator), with the
 * real code cut out of ogario/ogario.v4.js: application.setShowIngameSpectator / setIngameSpectator,
 * LM.addSpect (the premium gate), _lmSpecSetMode, _lmSpecReconcile, flushSpecsData and the start of
 * sendNick (spawn).
 * Cases: toggle on/off, a multibox unit open (it blocked the spectator), spawn closes the
 * spectator with its flag (the flag alone was cleared and the next toggle did nothing), resuming
 * while alive keeps it, the multibox unit survives every spectator toggle and spawn, no premium:
 * no spectator socket. With a unit and a spectator open together: the multibox switch keys go only
 * between the main player and the units, the follow / free mode switch reaches the spectator, and
 * starting multibox turns the spectator switch off with its socket. The in-game spectator and Full
 * Map are one exclusive mode (LM._lmSpecSetMode / _lmSpecReconcile); section 11 runs the real spect.js
 * tile lifecycle (failed / refused / captcha slots, lmFullMapHealth, lmFullMapRetry, opcode 18, replay).
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
const appMethods = ['        setShowIngameSpectator() {', '        setShowFullSpectator() {', '        setIngameSpectator() {', '        setFullSpectator() {'].map((m) => [m, block(m)]);
const lmMethods = ['        addSpect() {', '        _lmSpecSetMode(mode) {', '        _lmFullMapModeOff() {', '        _lmSpecLocal() {', '        _lmSpecReconcile() {', '        flushSpecsData() {'].map((m) => [m, block(m)]);
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
        this.tile = opts && opts.tile != null ? opts.tile : null;
        this.closed = false;
        created.push(this);
    }
    Spect.prototype.closeConnection = function () { this.closed = true; };
    const ctx = {
        window: win, console,
        $: (sel) => ({ val: () => (sel === '#nick' ? 'player' : ''), show() { return this; }, hide() { return this; } }),
        addSpectator: () => win.spects.push(new Spect()),
        /* spect.js: a plan of 3 tiles here, addFullSpectator(i) opens tile i */
        lmFullMapTilePlan: () => ({ tiles: [0, 1, 2].map((index) => ({ index })) }),
        addFullSpectator: (i) => win.spects.push(new Spect({ tile: i })),
        toastr: { error() { win.toasts = (win.toasts || 0) + 1; } }, lmT: (k) => k,
        ogario: { play: !!o.playing },
        /* the page-level setter of the controlled multibox unit (ogario.v4.js lmSetMbUnit) */
        lmSetMbUnit: (u) => { win.multiboxPlayerEnabled = +u || null; }
    };
    vm.createContext(ctx);
    vm.runInContext('var LM = window.legendmod = { integrity: true, mapOffsetFixed: true,' + lmMethods.map((m) => m[1]).join(',\n') + ',\n' + sendNick + '\n};' +
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
/* 5. the modes are exclusive: the other mode's key switches to it (closing only the other role's
 * sockets), and the full spectator is closed by spawn as well */
{
    const e = env();
    e.app.setShowFullSpectator();
    check('full spectator opens its sockets', e.win.fullSpectator === true && spectators(e.win).length === 3);
    const tiles = spectators(e.win);
    e.app.setShowIngameSpectator();
    check('in-game key while Full Map runs: switches (tiles closed, one in-game spectator, only its flag on)', e.win.lmSpecMode === 'ingame' && e.win.ingameSpectator === true &&
        e.win.fullSpectator === false && tiles.every((t) => t.closed) && spectators(e.win).length === 1 && spectators(e.win)[0].tile === null);
    const ing = spectators(e.win)[0];
    e.app.setFullSpectator();
    check('Full Map button while in-game runs: switches back (in-game closed, 3 tiles)', e.win.lmSpecMode === 'full' && ing.closed && spectators(e.win).length === 3 &&
        spectators(e.win).every((t) => t.tile != null && !t.closed));
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

/* the real ogario/spect.js under the core toggles: sockets and timers are counted */
function realEnv() {
    const spectSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'spect.js'), 'utf8');
    const sockets = [], timers = new Map();
    let timerId = 0;
    const ctx = {
        console: { log() { }, warn() { }, error: console.error }, Date, Math, Number, Object, JSON, Set, Map, Array, DataView, ArrayBuffer, Uint8Array, String, parseInt,
        setInterval: (fn, ms) => { timers.set(++timerId, { fn, ms, repeat: true }); return timerId; },
        setTimeout: (fn, ms) => { timers.set(++timerId, { fn, ms }); return timerId; },
        clearInterval: (id) => { timers.delete(id); }, clearTimeout: (id) => { timers.delete(id); },
        toastr: { error() { ctx.toasts = (ctx.toasts || 0) + 1; }, warning(t) { (ctx.warnings = ctx.warnings || []).push(t); } }, lmT: (k) => k, Premadeletter123: 'LM',
        $: (sel) => ({ val: () => (sel === '#nick' ? 'player' : ''), show() { return this; }, hide() { return this; } }),
        lmSetMbUnit: (u) => { ctx.multiboxPlayerEnabled = +u || null; },
        WebSocket: { CONNECTING: 0, OPEN: 1 },
        defaultmapsettings: {}, profiles: [], master: { clientVersion: 1, protocolVersion: 1 },
        application: { mbSlots: [0, 1, 2], writeUint32() { }, showMenu() { ctx.menuShown = (ctx.menuShown || 0) + 1; } },
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
    return { ctx, sockets, timers, app, LM, open, fullOf, handshake };
}
/* 10. Full Map with the real ogario/spect.js (Spect, addFullSpectator, addBox) under the same core
 * toggles: sockets and timers are counted. Toggled on and off repeatedly: never more than one
 * grid of sockets, none and no timer left after off (also with a reconnect pending), the main
 * border packets calling LM.addSpect again add nothing, nothing opens before the border is fixed,
 * and a multibox unit keeps its socket through every Full Map toggle. */
{
    const { ctx, sockets, timers, app, LM, open, fullOf, handshake } = realEnv();
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

/* 11. spectator modes and the Full Map tile lifecycle, with the real ogario/spect.js, each without
 * and with a live multibox unit: the modes are exclusive (one LM._lmSpecSetMode), a mode change closes
 * only the other role's spectators and never a unit nor the main spectate state, LM._lmSpecReconcile
 * opens only the missing tiles, a tile that gave up / was refused (114) / got a captcha (85) keeps its
 * slot with its state (lmFullMapHealth), lmFullMapRetry reconnects only the failed ones on the same
 * objects, opcode 18 keeps a spectator spectating and makes its coverage wait, and a replay or
 * Practice (no integrity) keeps Full Map on quietly */
for (const withUnit of [false, true]) {
    const tag = withUnit ? ' (with a live unit)' : ' (no unit)';
    const mk = () => {
        const e = realEnv();
        let unit = null;
        if (withUnit) {
            e.ctx.addBox(); unit = e.ctx.spects[0]; unit.socket.readyState = 1; unit.active = true;
            e.LM.multiBoxPlayerExists = true; e.ctx.multiboxPlayerEnabled = unit.number;
        }
        const tiles = () => e.ctx.spects.filter((s) => !s.player && s.tile != null);
        const ingame = () => e.ctx.spects.filter((s) => !s.player && s.tile == null);
        const unitOk = () => !unit || (e.ctx.spects.includes(unit) && !unit.socket.closed && !unit.closedByUser);
        const live = (s, now) => { s._lmOri = 'VERIFIED'; const raw = s._lmTileRaw(now); s.viewX = raw[0]; s.viewY = raw[1]; s.scale = 0.4; s._lmCamAt = now; s.time = now; };
        const drop = (s) => { s.socket.readyState = 3; s.socket.closed = true; s.socket.onclose(); };
        const op = (code) => new DataView(Uint8Array.of(code).buffer);
        return Object.assign(e, { unit, tiles, ingame, unitOk, live, drop, op });
    };
    /* (1) in-game on, then Full Map on: switches at once (it opened no grid, also after border packets) */
    {
        const e = mk();
        e.app.setShowIngameSpectator();
        const ig = e.ingame()[0];
        e.app.setShowFullSpectator();
        e.LM.addSpect(); e.LM.addSpect();
        check('(1) in-game on, Full Map on: one mode (full), in-game closed, 15 tiles' + tag, e.ctx.lmSpecMode === 'full' && e.ctx.fullSpectator === true && e.ctx.ingameSpectator === false &&
            ig.closedByUser && e.ingame().length === 0 && e.tiles().length === 15 && e.unitOk(), e.tiles().length);
    }
    /* (2) Full Map on, top bar in-game on, then off: in-game off closed the grid while Full Map stayed on */
    {
        const e = mk();
        e.app.setShowFullSpectator();
        const grid = e.tiles();
        e.app.setIngameSpectator();
        check('(2) Full Map on, top bar in-game on: switches (15 tiles closed, one in-game spectator)' + tag, e.ctx.lmSpecMode === 'ingame' && e.ctx.fullSpectator === false &&
            grid.every((t) => t.closedByUser) && e.tiles().length === 0 && e.ingame().length === 1 && e.unitOk());
        e.app.setIngameSpectator();
        check('(3) the active mode pressed again: off, nothing left open, no flag on' + tag, e.ctx.lmSpecMode === 'off' && !e.ctx.fullSpectator && !e.ctx.ingameSpectator &&
            e.ingame().length === 0 && e.tiles().length === 0 && e.open() === (withUnit ? 1 : 0) && e.unitOk(), e.open());
        e.app.setShowFullSpectator(); e.app.setFullSpectator();
        check('(4) hotkey on, top bar button off: the same mode (the button turns it off)' + tag, e.ctx.lmSpecMode === 'off' && e.tiles().length === 0);
    }
    /* (5) Full Map on / off while the main client spectates: its spectate and world pan state stay */
    {
        const e = mk();
        Object.assign(e.LM, { isSpectateEnabled: true, isFreeSpectate: true, _isWorldSpectating: true, _worldSpecPanX: 120, _worldSpecPanY: -40 });
        e.app.setShowFullSpectator(); e.app.setShowFullSpectator();
        check('(5) Full Map on / off while spectating: the main spectate and world pan state kept' + tag, e.LM.isSpectateEnabled && e.LM.isFreeSpectate && e.LM._isWorldSpectating && e.LM._worldSpecPanX === 120 &&
            e.unitOk() && !!e.LM.multiBoxPlayerExists === withUnit, [e.LM.isSpectateEnabled, e.LM._worldSpecPanX, e.LM.multiBoxPlayerExists].join());
    }
    /* (6) every toggle sequence: the unit keeps its socket; (7) no unit left: a stale multiBoxPlayerExists goes */
    {
        const e = mk();
        const seq = ['setShowIngameSpectator', 'setShowFullSpectator', 'setShowIngameSpectator', 'setShowFullSpectator', 'setIngameSpectator', 'setFullSpectator', 'setIngameSpectator', 'setFullSpectator'];
        let lost = '';
        for (const m of seq) { e.app[m](); e.LM.addSpect(); if (!e.unitOk()) { lost = m; break; } }
        check('(6) eight mode changes: the unit keeps its socket, one role at a time' + tag, !lost && e.tiles().length === 15 && e.ingame().length === 0, lost);
        e.app.setFullSpectator();
        if (!withUnit) {
            e.LM.multiBoxPlayerExists = true;
            e.app.setShowIngameSpectator();
            check('(7) a mode change with no unit left clears a stale multiBoxPlayerExists', e.LM.multiBoxPlayerExists === false && e.ingame().length === 1);
        } else check('(7) a mode change with a unit keeps multiBoxPlayerExists', e.LM.multiBoxPlayerExists === true && e.unitOk());
    }
    /* (8) a tile that keeps dropping: failed after 8 reconnects, kept with its reason, its slot not refilled */
    {
        const e = mk();
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        const t = e.tiles()[4], before = e.sockets.length;
        let attempts = 0;
        for (let k = 0; k < 12 && t.socket; k++) {
            e.drop(t);
            const rt = t.reconnectTimer && e.timers.get(t.reconnectTimer);
            if (!rt) break;
            e.timers.delete(t.reconnectTimer); rt.fn(); attempts++;
        }
        e.LM.addSpect(); e.LM.addSpect();
        const h = e.ctx.lmFullMapHealth();
        check('(8) tile dropped repeatedly: failed after 8 reconnects, kept in its slot with the reason, not opened again' + tag, attempts === 8 && t._lmTileState === 'failed' && /8/.test(t._lmTileReason) &&
            e.ctx.spects.includes(t) && !t.socket && e.tiles().length === 15 && e.tiles().filter((s) => s.tile === t.tile).length === 1 && e.sockets.length === before + 8 && e.unitOk(), [attempts, t._lmTileState, e.tiles().length].join());
        check('(9) lmFullMapHealth: 15 planned, 1 failed, 14 connecting, the failed tile listed with its reason' + tag, h.planned === 15 && h.failed === 1 && h.connecting === 14 && h.perTile.length === 15 &&
            h.perTile[t.tile].state === 'failed' && h.perTile[t.tile].reason === t._lmTileReason, JSON.stringify(Object.assign({}, h, { perTile: h.perTile.length })));
        const n0 = e.sockets.length;
        const n = e.ctx.lmFullMapRetry();
        check('(10) lmFullMapRetry: only the failed tile reconnects, on the same object (one new socket, no new tile)' + tag, n === 1 && e.sockets.length === n0 + 1 && !!t.socket && !t.socket.closed &&
            t._lmTileState === 'connecting' && e.tiles().length === 15 && e.ctx.spects.includes(t) && e.ctx.lmFullMapRetry() === 0, [n, e.sockets.length - n0].join());
        e.app.setShowFullSpectator();
        check('    ... Full Map off: no tile socket, no tile timer, no tile state left' + tag, e.tiles().length === 0 && e.open() === (withUnit ? 1 : 0) && e.ctx.lmFullMapHealth().perTile.length === 0 &&
            [...e.timers.values()].every((x) => x.ms !== 100));
    }
    /* (11) opcode 114 (spectate mode full): refused only if no fresh view follows within LM_TILE_STALE_MS
     * (whether agar.io still serves it is not known); then closed with no retry, kept, one toast for the grid */
    {
        const e = mk();
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        const a = e.tiles()[2], b = e.tiles()[3], c = e.tiles()[4], n0 = e.sockets.length;
        a.handleMessage(e.op(114)); b.handleMessage(e.op(114)); c.handleMessage(e.op(114)); a.handleMessage(e.op(114));
        check('(11) opcode 114: only marked at first (socket open, no toast, one pending check per tile)' + tag, a._lmTileState !== 'refused' && a.isSocketOpen() && !(e.ctx.warnings || []).length &&
            e.timers.has(a._lmRefuseTimer) && e.timers.get(a._lmRefuseTimer).ms === 3000 && [...e.timers.values()].filter((x) => x.ms === 3000 && !x.repeat).length === 3);
        /* c is served anyway: a fresh camera and world before the check */
        const now = Date.now();
        c._lmCamAt = now; c.time = now; c.viewX = c.viewY = 0;
        [a, b, c].forEach((s) => { const id = s._lmRefuseTimer, t = e.timers.get(id); e.timers.delete(id); t.fn(); });
        e.LM.addSpect();
        check('    ... no fresh view 3 s later: refused, sockets closed, no reconnect or tile sender, kept in their slots, one toast' + tag, a._lmTileState === 'refused' && b._lmTileState === 'refused' &&
            a.socket === null && b.socket === null && !a.reconnectTimer && !a.staticPositionController && e.tiles().length === 15 && e.sockets.length === n0 &&
            (e.ctx.warnings || []).length === 1 && /spRefused/.test(e.ctx.warnings[0]) && e.ctx.lmFullMapHealth().refused === 2 && e.ctx.lmFullMapRetry() === 0 && e.unitOk(), (e.ctx.warnings || []).join());
        check('    ... a tile served after its 114 (fresh view): the mark cleared, it stays open' + tag, c._lmTileState !== 'refused' && c.isSocketOpen() && !c._lmRefuseTimer && !c.closedByUser);
        const d = e.tiles()[5];
        d.handleMessage(e.op(114));
        const id = d._lmRefuseTimer;
        e.app.setShowFullSpectator();
        check('    ... Full Map off with a 114 pending: its check goes with the socket' + tag, !e.timers.has(id) && !d._lmRefuseTimer);
    }
    /* (12) opcode 85 (captcha) on a tile: kept (it was spliced out and opened again on the next border packet), no menu, units untouched */
    {
        const e = mk();
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        const t = e.tiles()[7], n0 = e.sockets.length;
        t.handleMessage(e.op(85));
        e.LM.addSpect(); e.LM.addSpect();
        check('(12) opcode 85 on a tile: captcha state, closed, kept in its slot, not reopened, no menu, one toast' + tag, t._lmTileState === 'captcha' && !t.socket && e.ctx.spects.includes(t) &&
            e.tiles().length === 15 && e.sockets.length === n0 && !e.ctx.menuShown && (e.ctx.warnings || []).length === 1 && /spCaptcha/.test(e.ctx.warnings[0]) &&
            e.ctx.lmFullMapRetry() === 0 && e.unitOk() && (!withUnit || e.ctx.multiboxPlayerEnabled === e.unit.number), [t._lmTileState, e.tiles().length, e.ctx.menuShown].join());
        e.app.setShowFullSpectator(); e.app.setShowFullSpectator();
        check('    ... Full Map off / on: a new grid of 15, every tile connecting again' + tag, e.tiles().length === 15 && !e.tiles().includes(t) && e.tiles().every((s) => s._lmTileState === 'connecting'));
    }
    /* (13) opcode 18 on a settled tile: still spectating, camera kept, coverage waits for the next world
     * update (no new 17 needed), the target goes out again as a refresh */
    {
        const e = mk();
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        const t = e.tiles()[0], now = Date.now();
        e.live(t, now);
        t._lmTileTick(now); t._lmCamAt = now + 40; t._lmTileTick(now + 50);
        const sent = t.socket.sent, cam = [t.viewX, t.viewY];
        check('    a settled tile with a fresh camera and world: live, coverage' + tag, t._lmCoverageOk(now + 50) && t._lmTileStateNow(now + 50) === 'live');
        t.handleMessage(e.op(18));
        check('(13) opcode 18 on a tile: spectate / free spectate and the camera kept, no coverage until the next world update' + tag, t.isSpectateEnabled && t.isFreeSpectate &&
            t._lmCamAt === now + 40 && t.viewX === cam[0] && t.viewY === cam[1] && !t._lmCoverageOk(now + 60) && e.timers.has(t.staticPositionController));
        t._lmTileTick(now + 60);
        check('    ... the tile target is sent again at once' + tag, t.socket.sent === sent + 1, t.socket.sent - sent);
        t.time = now + 3000;
        check('    ... the next world update, no further 17 (camera 3 s old, on its target): live again' + tag, t._lmCoverageOk(now + 3010) && t._lmTileStateNow(now + 3010) === 'live');
        t.time = now - 60000; t._lmCamAt = now - 60000; t._openedAt = now - 70000;
        check('    camera and world updates a minute old: not arrived, no server view, no coverage, stalled' + tag, !t._lmTileArrived(null, now) && !t._lmServerViewWorld() && !t._lmCoverageOk(now) &&
            t._lmTileStateNow(now) === 'stalled');
    }
    /* (17) whatever agar.io's opcode 17 cadence: 17 every tick or only on change (world updates flowing)
     * keep a settled tile live at the settled send cadence; world updates stopping make it stalled */
    for (const every of [true, false]) {
        const e = mk();
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        const t = e.tiles()[0], now = 1e12;
        e.live(t, now); t._openedAt = now - 20000;
        t._lmTileTick(now); t._lmCamAt = now + 40; t.time = now + 40;
        const s0 = t.socket.sent, states = {};
        for (let ms = 100; ms <= 10000; ms += 100) {
            const n = now + ms;
            t.time = n - 20; /* opcode 16 every tick */
            if (every) t._lmCamAt = n - 20;
            t._lmTileTick(n);
            const st = t._lmTileStateNow(n); states[st] = (states[st] || 0) + 1;
        }
        const sends = t.socket.sent - s0;
        check('(17) opcode 17 ' + (every ? 'every tick' : 'only on change') + ': live for 10 s, coverage, refreshed once a second (not every 500 ms)' + tag,
            states.live === 100 && t._lmCoverageOk(now + 10000) && sends >= 9 && sends <= 11, JSON.stringify(states) + ' sends ' + sends);
        let n = now + 10000;
        for (let k = 0; k < 40; k++) { n += 100; if (every) t._lmCamAt = n; t._lmTileTick(n); }
        check('    ... world updates stop for 4 s: stalled, no coverage' + tag, t._lmTileStateNow(n) === (every ? 'stalled' : 'stalled') && !t._lmCoverageOk(n), t._lmTileStateNow(n));
    }
    /* (14) opcode 18 on the in-game spectator in free mode: it keeps following the cursor */
    {
        const e = mk();
        e.app.setShowIngameSpectator();
        const s = e.ingame()[0];
        s.socket.readyState = 1; s.socket.onopen(); s.protocolKey = 5; s.clientKey = 7; s.sendSpectate(); s.sendFreeSpectate();
        const pc = s.positionController;
        s.handleMessage(e.op(18));
        check('(14) opcode 18 on the in-game spectator in free spectate: still free, its cursor sender kept' + tag, s.isFreeSpectate === true && s.isSpectateEnabled === true && !!pc && e.timers.has(pc));
    }
    /* (15) a duplicate tile and a tile index outside the plan are closed by the next border packet */
    {
        const e = mk();
        e.app.setShowFullSpectator();
        const dup = e.ctx.addFullSpectator(3), out = e.ctx.addFullSpectator(0);
        out.tile = 99;
        e.LM.addSpect();
        check('(15) a duplicate tile and one outside the plan: closed, the grid is 15 again, at most LM_FULLMAP_MAX spectator sockets' + tag, dup.closedByUser && out.closedByUser &&
            e.tiles().length === 15 && new Set(e.tiles().map((s) => s.tile)).size === 15 && e.ctx.spects.filter((s) => !s.player).length <= 15 && e.unitOk());
    }
    /* (16) a replay or Practice (integrity off): Full Map stays on quietly; back on agar.io the grid opens */
    {
        const e = mk();
        e.app.setShowFullSpectator();
        e.LM.flushSpecsData();
        Object.assign(e.LM, { ws: 'wss://imsolo.pro.replay:2000', integrity: false });
        e.LM.addSpect();
        check('(16) replay border: no "private server" toast, Full Map kept on, no tile', !e.ctx.toasts && e.ctx.lmSpecMode === 'full' && e.ctx.fullSpectator === true && e.tiles().length === 0);
        e.LM.ws = 'lm-practice://local'; e.LM.addSpect();
        check('    ... Practice: the same', !e.ctx.toasts && e.ctx.lmSpecMode === 'full');
        Object.assign(e.LM, { ws: 'wss://test', integrity: true });
        e.LM.addSpect();
        check('    ... back on agar.io: the 15 tiles open', e.tiles().length === 15);
        Object.assign(e.LM, { ws: 'wss://private:443', integrity: false });
        e.app.setShowFullSpectator(); e.app.setShowFullSpectator();
        check('    ... a real private server: the toast, Full Map off', e.ctx.toasts === 1 && e.ctx.lmSpecMode === 'off');
    }
    /* (18) Full Map refused is checked before anything closes: the in-game spectator stays */
    {
        const e = mk();
        e.app.setShowIngameSpectator();
        const ig = e.ingame()[0];
        Object.assign(e.LM, { ws: 'wss://private:443', integrity: false });
        e.app.setShowFullSpectator();
        check('(18) private server, in-game on, Full Map pressed: refused with the toast, in-game kept, mode in-game' + tag, e.ctx.toasts === 1 && e.ctx.lmSpecMode === 'ingame' &&
            e.ctx.ingameSpectator === true && !e.ctx.fullSpectator && !ig.closedByUser && e.ingame()[0] === ig && e.tiles().length === 0 && e.unitOk());
        Object.assign(e.LM, { ws: 'wss://imsolo.pro.replay:2000' });
        e.app.setFullSpectator();
        check('    ... a replay: refused quietly, in-game kept' + tag, e.ctx.toasts === 1 && e.ctx.lmSpecMode === 'ingame' && !ig.closedByUser);
    }
    /* (19) an in-game spectator that gave up: lmFullMapRetry reconnects it on the same object */
    {
        const e = mk();
        e.app.setShowIngameSpectator();
        const s = e.ingame()[0];
        s.socket.readyState = 1; s.socket.onopen();
        s._reconnectAttempts = 8; e.drop(s);
        e.LM.addSpect();
        check('(19) in-game spectator gave up: failed, kept, no second one opened' + tag, s._lmTileState === 'failed' && !s.socket && e.ingame().length === 1 && e.ingame()[0] === s);
        const n0 = e.sockets.length;
        check('    ... lmFullMapRetry reconnects it on the same object' + tag, e.ctx.lmFullMapRetry() === 1 && e.sockets.length === n0 + 1 && !!s.socket && s._lmTileState === 'connecting' &&
            e.ingame().length === 1 && e.unitOk());
    }
    /* (20) in-game mode in Practice or a replay: nothing opened (new WebSocket('lm-practice://local') threw
     * on every Practice border; a replay got a socket to the replay URL), the mode kept quietly */
    {
        const e = mk();
        Object.assign(e.LM, { ws: 'lm-practice://local', integrity: false });
        const n0 = e.sockets.length;
        e.app.setShowIngameSpectator(); e.LM.addSpect();
        check('(20) Practice, in-game pressed: mode in-game, no socket opened' + tag, e.ctx.lmSpecMode === 'ingame' && e.sockets.length === n0 && e.ingame().length === 0);
        e.LM.ws = 'wss://imsolo.pro.replay:2000'; e.LM.addSpect();
        check('    ... a replay: still nothing opened' + tag, e.sockets.length === n0 && !e.ctx.toasts);
        Object.assign(e.LM, { ws: 'wss://test', integrity: true }); e.LM.addSpect();
        check('    ... back on a game server: the in-game spectator opens' + tag, e.ingame().length === 1);
    }
    /* (21) Teams and Battle Royale: no Full Map grid (owner, until a recording shows it works there) */
    for (const gm of [':teams', ':battleroyale']) {
        const e = mk();
        e.LM.gameMode = gm;
        e.app.setShowIngameSpectator();
        const ig = e.ingame()[0];
        e.app.setShowFullSpectator(); e.LM.addSpect();
        check('(21) ' + gm + ': Full Map pressed: no tile, one toast, in-game kept, mode in-game' + tag, e.tiles().length === 0 && (e.ctx.warnings || []).length === 1 &&
            /fullMapModeOff/.test(e.ctx.warnings[0]) && e.ctx.lmSpecMode === 'ingame' && !ig.closedByUser && e.unitOk());
        /* Full Map on in FFA, then the player moves to this mode (reconnect: border packets again) */
        const f = mk();
        f.app.setShowFullSpectator();
        check('    ... FFA: Full Map on, 15 tiles' + tag, f.tiles().length === 15);
        f.LM.gameMode = gm; f.LM.addSpect();
        check('    ... moved to ' + gm + ': the tiles close, the mode stays full quietly' + tag, f.tiles().length === 0 && f.ctx.lmSpecMode === 'full' && !(f.ctx.warnings || []).length && f.unitOk());
        f.LM.gameMode = ':ffa'; f.LM.addSpect();
        check('    ... back in FFA: the 15 tiles open again' + tag, f.tiles().length === 15 && f.unitOk());
    }
}

console.log(failed ? 'FAILED ' + failed : 'all ingamespect checks passed');
process.exit(failed ? 1 : 0);
