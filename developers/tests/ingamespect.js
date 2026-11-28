/* In-game spectator toggle (hotkey hk-showIngameSpectator, top bar button set-ingameSpectator), with the
 * real code cut out of ogario/ogario.v4.js: application.setShowIngameSpectator / setIngameSpectator,
 * LM.addSpect (the premium gate), _lmSpecSetMode, _lmSpecReconcile, flushSpecsData, the start of
 * sendNick (spawn request) and _lmSpawnEndsSpectate (spawned: opcode 32 and the other servers' own cell).
 * Cases: toggle on/off, a multibox unit open (it blocked the spectator), spawn closes the
 * spectator with its flag (the flag alone was cleared and the next toggle did nothing), a spawn only
 * requested or ignored closes nothing, resuming while alive keeps it, the multibox unit survives every
 * spectator toggle and spawn, no premium: no spectator socket. Full Map is played with: on before Play
 * it keeps the same tiles and sockets through spawn, death and respawn, it can be turned on and off
 * while alive without touching the player (section 12 with the real spect.js). With a unit and a spectator open together: the multibox switch keys go only
 * between the main player and the units, the follow / free mode switch reaches the spectator, and
 * starting multibox turns the spectator switch off with its socket. The in-game spectator and Full
 * Map are one exclusive mode (LM._lmSpecSetMode / _lmSpecReconcile); section 11 runs the real spect.js
 * tile lifecycle (failed / refused / captcha slots, lmFullMapHealth, lmFullMapRetry, opcode 18, replay).
 * Sections 9b and 23: multibox with Full Map on (the tiles stay, the unit is controlled by its own
 * number), Full Map off / on while multibox runs, multibox off (LM._lmMbStop), a refused unit.
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
const lmMethods = ['        addSpect() {', '        _lmSpecSetMode(mode) {', '        _lmFullMapModeOff() {', '        _lmFullMapCrowdCheck() {', '        _lmSpecLocal() {', '        _lmSpecReconcile() {', '        flushSpecsData() {', '        _lmSpawnEndsSpectate() {', '        _lmMbStop() {'].map((m) => [m, block(m)]);
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
        toastr: { error() { win.toasts = (win.toasts || 0) + 1; }, warning() { win.warnings = (win.warnings || 0) + 1; } }, lmT: (k) => k,
        ogario: { play: !!o.playing },
        /* the page-level setter of the controlled multibox unit (ogario.v4.js lmSetMbUnit) */
        lmSetMbUnit: (u) => { win.multiboxPlayerEnabled = +u || null; }
    };
    if (o.quiet) ctx.console = { log() { }, warn() { }, error: console.error };
    vm.createContext(ctx);
    /* _lmFullMapCrowd false: a leaderboard of few players arrived (_lmFullMapCrowdCheck) */
    vm.runInContext('var LM = window.legendmod = { integrity: true, mapOffsetFixed: true, _lmFullMapCrowd: false,' + lmMethods.map((m) => m[1]).join(',\n') + ',\n' + (o.nick || sendNick) + '\n};' +
        'var application = window.application = {' + appMethods.map((m) => m[1]).join(',\n') + '};', ctx);
    /* the global spects of the page is window.spects (top-level var in a classic script) */
    Object.defineProperty(ctx, 'spects', { get: () => win.spects, set: (v) => { win.spects = v; } });
    ctx.addUnit = () => { const u = new Spect({ player: true }); win.spects.push(u); return u; };
    return { ctx, win, created, app: ctx.application, LM: ctx.LM };
}
const spectators = (win) => win.spects.filter((s) => !s.player);
/* the server made the player's first cell (opcode 32 and the other servers' own cell): play on, then
 * _lmSpawnEndsSpectate, as the handlers do (ogario is the protocol object LM on the page) */
const spawned = (e) => { e.ctx.ogario.play = true; e.LM.play = true; e.LM._lmSpawnEndsSpectate(); };

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
    const tag = withUnit ? ' (multibox unit open)' : '';
    e.LM.sendNick('me');
    check('spawn only requested: the spectator and its flag stay (nothing closes before the player is in)' + tag, e.win.ingameSpectator === true && !sp.closed && spectators(e.win).length === 1);
    spawned(e);
    check('spawn: flag cleared, mode off', e.win.ingameSpectator === false && e.win.lmSpecMode === 'off');
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
 * sockets), and a spawn keeps Full Map: the same tiles stay open (owner: play with or without it) */
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
    const grid = spectators(e.win);
    e.LM.sendNick('me'); spawned(e);
    check('spawn keeps Full Map: the same 3 tiles open, mode and flag on, nothing opened again', e.win.fullSpectator === true && e.win.lmSpecMode === 'full' &&
        spectators(e.win).length === 3 && spectators(e.win).every((t, i) => t === grid[i] && !t.closed) && e.created.length === 7, e.created.length);
    e.LM.addSpect();
    check('the border packets after the spawn add nothing', spectators(e.win).length === 3 && e.created.length === 7);
}
/* 5b. Full Map while playing: turned on while alive it opens its tiles, off closes only them; the
 * player (play, focus, a multibox unit) is not touched */
for (const withUnit of [false, true]) {
    const e = env({ playing: true });
    e.LM.play = true;
    const unit = withUnit ? e.ctx.addUnit() : null;
    if (unit) e.win.multiboxPlayerEnabled = unit.number;
    const tag = withUnit ? ' (multibox unit open)' : '';
    e.app.setShowFullSpectator();
    check('Full Map on while alive: 3 tiles open' + tag, e.win.lmSpecMode === 'full' && spectators(e.win).length === 3 && !e.win.toasts);
    const grid = spectators(e.win);
    e.app.setFullSpectator();
    check('Full Map off while alive: its tiles closed, still playing, focus and unit kept' + tag, e.win.lmSpecMode === 'off' && grid.every((t) => t.closed) &&
        spectators(e.win).length === 0 && e.ctx.ogario.play === true && e.LM.play === true && (!unit || (e.win.spects[0] === unit && !unit.closed && e.win.multiboxPlayerEnabled === unit.number)));
    e.app.setShowFullSpectator();
    e.LM.sendNick('me');
    check('Play while alive with Full Map on (resume): the tiles stay' + tag, spectators(e.win).length === 3 && spectators(e.win).every((t) => !t.closed));
}
/* 5c. a spawn that is ignored or never sent (Sigmally before its handshake, Senpa without a socket,
 * whole sendNick) tears nothing down */
{
    const full = block('        sendNick(nick) {');
    for (const [type, extra] of [['sigmally', ''], ['senpa', '_senpaCanSend() { return false; },\n']]) {
        for (const mode of ['ingame', 'full']) {
            const e = env({ nick: extra + full + ',', quiet: true });
            e.LM.serverType = type;
            if (mode === 'full') e.app.setShowFullSpectator(); else e.app.setShowIngameSpectator();
            const before = spectators(e.win);
            e.LM.sendNick('me');
            check(type + ' spawn ignored (' + mode + '): every spectator socket and the mode kept', e.win.lmSpecMode === mode && spectators(e.win).length === before.length &&
                before.length > 0 && before.every((s) => !s.closed) && e.created.length === before.length);
        }
    }
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
const mbMethods = ['        multiboxchange() {', '        multiboxback() {', '        changeSpectatorMode() {', '        _lmMbStart() {'].map((m) => [m, block(m)]);
/* _lmMbStart is new: an older file without it still runs (its multiboxchange does not call it) */
if (!mbMethods[3][1]) mbMethods[3][1] = '_lmMbStart() { }';
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
/* 9b. starting multibox while Full Map runs: the tiles stay (same objects, none closed, Full Map still
 * on) and the focus goes to the unit addBox returned, whatever number it got (here 4: tiles hold 1-3;
 * it was set to 1, a tile) */
{
    const e = mbEnv();
    e.app.setShowFullSpectator();
    const tiles = spectators(e.win);
    e.app.multiboxchange();
    const unit = e.win.spects.filter((s) => s.player)[0];
    check('9b. multibox start with Full Map on: the 3 tiles kept open, Full Map still on', tiles.length === 3 && tiles.every((t) => !t.closed && e.win.spects.includes(t)) &&
        e.win.lmSpecMode === 'full' && e.win.fullSpectator === true);
    check('    ... one unit added, the focus on its own number (not 1, a tile)', !!unit && unit.number === 4 && e.win.multiboxPlayerEnabled === unit.number && e.ctx.played === 1,
        unit && unit.number + ' / ' + e.win.multiboxPlayerEnabled);
    if (unit) unit.active = true;
    const seen = [];
    for (let i = 0; i < 4; i++) { e.app.multiboxchange(); seen.push(e.win.multiboxPlayerEnabled || 0); }
    check('    ... the switch goes main / unit only, never to a tile, no second unit', seen.join() === [0, 4, 0, 4].join() && e.win.spects.filter((s) => s.player).length === 1 &&
        tiles.every((t) => !t.closed), seen.join());
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
    vm.runInContext('var legendmod = window.legendmod = { ws: "wss://test", integrity: true, mapOffsetFixed: true, _lmFullMapCrowd: false, mapMinX: -7071, mapMinY: -7071, mapMaxX: 7071, mapMaxY: 7071,' +
        ' mapOffsetX: 0, mapOffsetY: 0, vector: null, vnr: 0, playerCellsMulti: [], indexedCells: {}, cells: [], foodMulti: [], play: false,' +
        lmMethods.map((m) => m[1]).join(',\n') + ',\n' + sendNick + '}; var LM = legendmod; var ogario = legendmod;' +
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
        const live = (s, now) => { s._lmOri = 'VERIFIED'; const raw = s._lmTileRaw(now); s.viewX = raw[0]; s.viewY = raw[1]; s.scale = 0.4; s._lmCamAt = now; s.time = s._lmWorldAt = now; };
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
        c._lmCamAt = now; c.time = c._lmWorldAt = now; c.viewX = c.viewY = 0;
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
        t.time = t._lmWorldAt = now + 3000;
        check('    ... the next world update, no further 17 (camera 3 s old, on its target): live again' + tag, t._lmCoverageOk(now + 3010) && t._lmTileStateNow(now + 3010) === 'live');
        t.time = t._lmWorldAt = now - 60000; t._lmCamAt = now - 60000; t._openedAt = now - 70000;
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
        t._lmTileTick(now); t._lmCamAt = now + 40; t.time = t._lmWorldAt = now + 40;
        const s0 = t.socket.sent, states = {};
        for (let ms = 100; ms <= 10000; ms += 100) {
            const n = now + ms;
            t.time = t._lmWorldAt = n - 20; /* a whole opcode 16 every tick */
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
    /* (22) at most 180 players on the server (owner), counted as the whole leaderboard: over it no grid,
     * quietly, the mode kept; opened again at 170 or fewer; tiles closed when it rises over 180 (units and
     * the in-game spectator untouched); no count yet after a connect: nothing opened until the first one */
    {
        const e = mk();
        const lb = (n) => { e.LM.leaderboard = Array.from({ length: n }, (_, i) => ({ nick: 'p' + i })); e.LM._lmFullMapCrowdCheck(); };
        e.LM._lmFullMapCrowd = undefined;
        e.app.setShowFullSpectator(); e.LM.addSpect();
        check('(22) no leaderboard yet: Full Map on, nothing opened' + tag, e.ctx.lmSpecMode === 'full' && e.tiles().length === 0 && !e.ctx.toasts && !(e.ctx.warnings || []).length);
        check('    ... lmFullMapHealth: waiting for the player count, not the crowd' + tag, e.ctx.lmFullMapHealth().crowd === false && /player count/.test(e.ctx.lmFullMapHealth().reason));
        lb(0);
        check('    ... an empty leaderboard decides nothing' + tag, e.LM._lmFullMapCrowd === undefined && e.tiles().length === 0);
        lb(181); e.LM.addSpect();
        check('    ... 181 players: no tile, no toast, mode full' + tag, e.tiles().length === 0 && e.ctx.lmSpecMode === 'full' && !e.ctx.toasts && !(e.ctx.warnings || []).length);
        /* lmFullMapHealth said planned 15 with no tile and no reason while the count held the grid closed */
        const h = () => e.ctx.lmFullMapHealth();
        const held = h();
        check('    ... 181 players: lmFullMapHealth says the player limit holds the grid closed (crowd, reason)' + tag,
            held.planned === 15 && held.perTile.length === 0 && held.crowd === true && /180 players/.test(held.reason), JSON.stringify([held.planned, held.crowd, held.reason]));
        lb(175); e.LM.addSpect();
        check('    ... down to 175: still none (opens at 170)' + tag, e.tiles().length === 0 && h().crowd === true);
        lb(170);
        check('    ... down to 170: the 15 tiles open (from the leaderboard update)' + tag, e.tiles().length === 15 && e.unitOk());
        check('    ... open: lmFullMapHealth has no crowd and no reason' + tag, h().crowd === false && h().reason === '' && h().perTile.length === 15);
        const n0 = e.sockets.length;
        lb(178); lb(180); e.LM.addSpect();
        check('    ... 178 and 180: kept open, nothing reopened' + tag, e.tiles().length === 15 && e.sockets.length === n0);
        const grid = e.tiles();
        lb(181);
        check('    ... up to 181: the tiles close, the mode stays, the unit kept, no toast' + tag, e.tiles().length === 0 && grid.every((t) => t.closedByUser) && e.ctx.lmSpecMode === 'full' &&
            e.unitOk() && !(e.ctx.warnings || []).length);
        /* the in-game spectator is not affected by the count */
        const g = mk();
        g.LM.leaderboard = Array.from({ length: 200 }, () => ({ nick: 'x' })); g.LM._lmFullMapCrowdCheck();
        g.app.setShowIngameSpectator();
        const ig = g.ingame()[0];
        g.LM.leaderboard.push({ nick: 'y' }); g.LM._lmFullMapCrowdCheck(); g.LM.addSpect();
        check('    ... 200 players: the in-game spectator opens and stays' + tag, !!ig && !ig.closedByUser && g.ingame().length === 1 && g.unitOk());
    }
}

/* 12. playing with Full Map, the real ogario/spect.js, without and with a live multibox unit: on
 * before Play it keeps the same tiles and sockets (no close, no new socket, no calibration again)
 * through the spawn, the border packets after it, a death and the respawn; the follow / free switch
 * leaves the tiles alone; turned on and off while alive it opens and closes only its tiles; the
 * in-game spectator ends with its socket at the spawn, not at the request; the connection's own
 * flush (server change, lost socket: flushSpecsData) closes everything */
for (const withUnit of [false, true]) {
    const tag = withUnit ? ' (with a live unit)' : ' (no unit)';
    const mk = () => {
        const e = realEnv();
        e.ctx.ogario = e.LM;
        vm.runInContext('Object.assign(application, {' + mbMethods[2][1] + '});', e.ctx);
        let unit = null;
        if (withUnit) {
            e.ctx.addBox(); unit = e.ctx.spects[0]; unit.socket.readyState = 1; unit.active = true;
            e.LM.multiBoxPlayerExists = true;
        }
        const tiles = () => e.ctx.spects.filter((s) => !s.player && s.tile != null);
        const ingame = () => e.ctx.spects.filter((s) => !s.player && s.tile == null);
        const unitOk = () => !unit || (e.ctx.spects.includes(unit) && !unit.socket.closed && !unit.closedByUser);
        const spawn = () => { e.LM.sendNick('me'); e.LM.play = true; e.LM._lmSpawnEndsSpectate(); };
        const die = () => { e.LM.play = false; };
        return Object.assign(e, { unit, tiles, ingame, unitOk, spawn, die });
    };
    {
        const e = mk();
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        e.tiles().forEach((t) => { t._lmOri = 'VERIFIED'; });
        const grid = e.tiles(), socks = grid.map((t) => t.socket), n0 = e.sockets.length;
        const timers0 = grid.map((t) => t.staticPositionController), offs = grid.map((t) => t.mapOffsetX + ',' + t.mapOffsetY);
        const same = () => e.tiles().length === 15 && e.tiles().every((t, i) => t === grid[i] && t.socket === socks[i] && !t.closedByUser && !t.socket.closed &&
            t.staticPositionController === timers0[i] && e.timers.has(timers0[i]) && t._lmOri === 'VERIFIED' && t.mapOffsetX + ',' + t.mapOffsetY === offs[i]) && e.sockets.length === n0;
        e.LM.sendNick('me');
        check('(1) Play pressed with Full Map on: the same 15 tiles, sockets, tile senders and calibration' + tag, same() && e.ctx.lmSpecMode === 'full' && e.unitOk());
        e.LM.play = true; e.LM._lmSpawnEndsSpectate();
        e.LM.addSpect(); e.LM.addSpect();
        check('(2) spawned, then the border packets: still the same tiles, nothing opened or closed' + tag, same() && e.ctx.fullSpectator === true && e.unitOk(), e.sockets.length - n0);
        const sent = grid.map((t) => t.socket.sent), free = grid.map((t) => t.isFreeSpectate);
        e.app.changeSpectatorMode();
        check('(3) the follow / free switch while playing: no tile changed or sent anything' + tag, grid.every((t, i) => t.isFreeSpectate === free[i] && t.socket.sent === sent[i]) && same());
        e.die();
        check('(4) death: the tiles stay' + tag, same());
        e.spawn(); e.LM.addSpect();
        check('(5) respawn: the same tiles again' + tag, same() && e.ctx.lmSpecMode === 'full' && e.unitOk());
        e.LM.flushSpecsData();
        check('(6) server change / lost main socket (flushSpecsData): every socket and timer closed, the unit too' + tag, e.open() === 0 && e.ctx.spects.length === 0 && e.timers.size === 0 &&
            grid.every((t) => t.closedByUser), e.open() + ' / ' + e.timers.size);
        e.LM.addSpect();
        check('    ... the mode stays on: the next server\'s border opens a new grid' + tag, e.ctx.lmSpecMode === 'full' && e.tiles().length === 15 && e.tiles().every((t) => !grid.includes(t)));
    }
    {
        const e = mk();
        e.LM.play = true;
        e.app.setShowFullSpectator();
        check('(7) Full Map turned on while alive: 15 tiles, still playing' + tag, e.tiles().length === 15 && e.LM.play === true && !e.ctx.toasts && e.unitOk());
        const grid = e.tiles();
        e.app.setFullSpectator();
        check('(8) Full Map turned off while alive: only the tiles closed, the player untouched' + tag, e.tiles().length === 0 && grid.every((t) => t.closedByUser) && e.LM.play === true &&
            !e.LM.isSpectateEnabled && e.open() === (withUnit ? 1 : 0) && e.unitOk() && !!e.LM.multiBoxPlayerExists === withUnit);
    }
    {
        const e = mk();
        e.app.setShowIngameSpectator();
        const ig = e.ingame()[0];
        ig.socket.readyState = 1; ig.socket.onopen();
        const igs = ig.socket;
        e.LM.sendNick('me');
        check('(9) in-game spectator, Play pressed: kept until the player is in' + tag, e.ingame()[0] === ig && !ig.closedByUser && e.ctx.lmSpecMode === 'ingame');
        e.LM.play = true; e.LM._lmSpawnEndsSpectate();
        check('(10) spawned: the in-game spectator closed with its socket, mode off' + tag, ig.closedByUser && igs.closed && e.ingame().length === 0 &&
            e.ctx.lmSpecMode === 'off' && !e.ctx.ingameSpectator && e.unitOk());
        e.app.setShowIngameSpectator();
        check('    ... the next toggle opens it again' + tag, e.ingame().length === 1 && e.ingame()[0] !== ig && e.ctx.lmSpecMode === 'ingame');
    }
}
/* the handlers that make the player's first cell all end the spectate modes there (_lmSpawnEndsSpectate,
 * where the in-game spectator ends) */
{
    const sites = src.split('\n').map((l, i, a) => /^\s*(this|self)\.play = true;$/.test(l) ? a[i + 1] : null).filter((l) => l !== null);
    check('every spawn handler (play = true) calls _lmSpawnEndsSpectate next', sites.length >= 4 && sites.every((l) => /_lmSpawnEndsSpectate\(\)/.test(l)), sites.length);
    const death = block('        onPlayerDeath() {'), sp = block('        onPlayerSpawn() {');
    check('onPlayerDeath and onPlayerSpawn close no spectator', !!death && !!sp && ![death, sp].some((b) => /_lmSpecSetMode|flushSpecsData|closeConnection/.test(b)));
}
/* 23. multibox and Full Map together, with the real ogario/spect.js and the real multibox start / switch /
 * stop: starting multibox keeps the tile sockets and controls the new unit by its own number (16 while
 * the tiles hold 1-15); Full Map off / on while multibox runs keeps the unit, its number and the focus;
 * multibox off (LM._lmMbStop) closes the unit only; a unit the server closes or one that cannot be
 * opened leaves the main session as it was. getActiveSpect / lmMultiboxControlledPlayer / lmActiveUnit
 * are the real ones. */
{
    const fns = ['function getActiveSpect(', 'function lmMultiboxControlledPlayer(', 'function lmActiveUnit('].map((m) => block(m));
    if (fns.some((f) => !f)) check('23. getActiveSpect / lmMultiboxControlledPlayer / lmActiveUnit found', false);
    const mk = (o) => {
        o = o || {};
        const e = realEnv();
        const c = e.ctx;
        Object.assign(c, { ogarcopythelb: {}, core: null, played: 0 });
        c.play = () => { c.played++; };
        vm.runInContext('Object.assign(application, {' + mbMethods.map((m) => m[1]).join(',\n') + '}); application.hideMenu = function () {};' +
            'application.cacheCustomSkin = function () {};\n' + fns.filter(Boolean).join('\n'), c);
        e.LM.play = o.mainAlive !== false; e.LM.playerCells = [];
        const tiles = () => c.spects.filter((s) => !s.player && s.tile != null);
        const units = () => c.spects.filter((s) => s.player);
        const sockOf = (list) => list.map((s) => s.socket);
        const same = (list, socks) => list.length === socks.length && tiles().length === list.length && tiles().every((t, i) => t === list[i] && t.socket === socks[i] && !t.closedByUser && !t.socket.closed);
        return Object.assign(e, { tiles, units, sockOf, same, focus: () => c.multiboxPlayerEnabled || 0 });
    };
    for (const mainAlive of [true, false]) {
        const tag = mainAlive ? ' (main player alive)' : ' (main player in the menu)';
        const e = mk({ mainAlive });
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        const grid = e.tiles(), socks = e.sockOf(grid), n0 = e.sockets.length;
        e.app.multiboxchange();
        const unit = e.units()[0];
        check('23. multibox start with Full Map on: the same 15 tile objects and sockets, none closed, Full Map on' + tag, grid.length === 15 && e.same(grid, socks) &&
            e.ctx.lmSpecMode === 'full' && e.ctx.fullSpectator === true);
        check('    ... one unit with one new socket, numbered after the tiles, controlled' + tag, e.units().length === 1 && e.sockets.length === n0 + 1 && !!unit && unit.number === 16 &&
            grid.every((t) => t.number !== unit.number) && e.focus() === unit.number && e.ctx.lmMultiboxControlledPlayer() === 2 &&
            e.ctx.getActiveSpect(unit.number) === unit && e.LM.multiBoxPlayerExists === true, unit && unit.number + ' focus ' + e.focus());
        check('    ... a tile number is never the controlled unit (getActiveSpect)' + tag, grid.every((t) => e.ctx.getActiveSpect(t.number) === null));
        check('    ... the main player is spawned only from the menu' + tag, e.ctx.played === (mainAlive ? 0 : 1), e.ctx.played);
        unit.socket.readyState = 1; unit.active = true;
        const au = e.ctx.lmActiveUnit();
        check('    ... lmActiveUnit is the unit, by its number' + tag, !!au && au.index === 1 && au.number === unit.number, au && JSON.stringify({ index: au.index, number: au.number }));
        /* Full Map off and on while multibox runs */
        e.app.setShowFullSpectator();
        check('    ... Full Map off with multibox running: the tiles close, the unit, its socket, number and focus stay' + tag, e.tiles().length === 0 && grid.every((t) => t.closedByUser) &&
            e.units().length === 1 && e.units()[0] === unit && !unit.socket.closed && !unit.closedByUser && unit.number === 16 && e.focus() === 16 && e.LM.multiBoxPlayerExists === true);
        e.app.setShowFullSpectator(); e.LM.addSpect();
        const grid2 = e.tiles();
        check('    ... Full Map on again: 15 new tiles beside it (the unit not counted as a tile), unit and focus kept' + tag, grid2.length === 15 &&
            e.ctx.spects.filter((s) => !s.player).length === 15 && e.units().length === 1 && e.units()[0] === unit && !unit.socket.closed && unit.number === 16 && e.focus() === 16 &&
            grid2.every((t) => t.number > 16), grid2.length);
        grid2.forEach(e.handshake);
        const socks2 = e.sockOf(grid2);
        /* switch back and forth: the tiles are untouched */
        const seen = [];
        e.app.multiboxchange(); seen.push(e.focus());
        e.app.multiboxchange(); seen.push(e.focus());
        e.app.multiboxback(); seen.push(e.focus());
        e.app.multiboxback(); seen.push(e.focus());
        check('    ... switch / back: main and unit only, the tiles untouched, no second unit' + tag, seen.join() === '0,16,0,16' && e.units().length === 1 && e.same(grid2, socks2), seen.join());
        /* multibox off: the unit only */
        const menus = e.ctx.menuShown || 0;
        const closed = e.LM._lmMbStop();
        check('    ... multibox off: the unit closed and removed, the 15 tiles kept (same sockets), Full Map on, focus on the main player' + tag, closed === 1 && unit.closedByUser &&
            unit.socket === null && e.units().length === 0 && e.same(grid2, socks2) && e.ctx.lmSpecMode === 'full' && e.focus() === 0 && e.LM.multiBoxPlayerExists === false &&
            e.ctx.lmMultiboxControlledPlayer() === 1);
        check('    ... the menu opens only when the main player is not in a game' + tag, (e.ctx.menuShown || 0) - menus === (mainAlive ? 0 : 1), (e.ctx.menuShown || 0) - menus);
        e.LM._lmMbStop();
        check('    ... multibox off again: nothing more closes' + tag, e.same(grid2, socks2));
        /* start again: a new unit, numbered after everything open now */
        e.app.multiboxback();
        const unit2 = e.units()[0];
        const top = Math.max.apply(null, grid2.map((t) => t.number));
        check('    ... multibox started again (back key): a new unit, number max + 1, controlled, the tiles kept' + tag, !!unit2 && unit2 !== unit && unit2.number === top + 1 &&
            e.focus() === unit2.number && e.same(grid2, socks2), unit2 && unit2.number);
    }
    /* unit first, Full Map after: unit 1, tiles 2-16; the unit stays controlled */
    {
        const e = mk();
        e.app.multiboxchange();
        const unit = e.units()[0];
        e.app.setShowFullSpectator(); e.LM.addSpect();
        check('23. unit first, Full Map after: unit 1 controlled, tiles 2-16 (numbering independent of the roles)', !!unit && unit.number === 1 && e.focus() === 1 &&
            e.tiles().map((t) => t.number).sort((a, b) => a - b).join() === Array.from({ length: 15 }, (_, i) => i + 2).join() && e.ctx.lmMultiboxControlledPlayer() === 2);
        e.app.setShowFullSpectator();
        check('    ... Full Map off: only the tiles close, unit 1 and its focus stay', e.tiles().length === 0 && e.units()[0] === unit && !unit.closedByUser && e.focus() === 1);
    }
    /* the in-game spectator ends when multibox starts (a mode change; real spect.js) */
    {
        const e = mk();
        e.app.setShowIngameSpectator();
        const ig = e.ctx.spects.filter((s) => !s.player)[0];
        e.app.multiboxchange();
        const unit = e.units()[0];
        check('23. in-game spectator on, multibox start: the spectator closed, mode off, the unit controlled by its number', !!ig && ig.closedByUser && e.ctx.lmSpecMode === 'off' &&
            !e.ctx.ingameSpectator && e.ctx.spects.length === 1 && !!unit && e.focus() === unit.number);
    }
    /* the unit cannot be opened (the socket throws): nothing changes */
    {
        const e = mk({ mainAlive: false });
        e.app.setShowFullSpectator();
        const grid = e.tiles(), socks = e.sockOf(grid), create = e.ctx.createLegendWebSocket;
        e.ctx.createLegendWebSocket = () => { throw new Error('refused'); };
        const err = e.ctx.console.error;
        e.ctx.console.error = () => { };
        let threw = null;
        try { e.app.multiboxchange(); } catch (x) { threw = x; }
        e.ctx.console.error = err;
        e.ctx.createLegendWebSocket = create;
        check('23. the unit cannot be opened: no throw, no unit, focus and main session unchanged (no spawn), the tiles kept', !threw && e.units().length === 0 && e.focus() === 0 &&
            e.ctx.played === 0 && e.LM.multiBoxPlayerExists !== true && e.same(grid, socks), threw);
    }
    /* the server closes the unit, or asks it for a captcha: the main player keeps playing, the tiles stay */
    for (const how of ['close', 'captcha']) {
        const e = mk();
        e.app.setShowFullSpectator();
        e.tiles().forEach(e.handshake);
        const grid = e.tiles(), socks = e.sockOf(grid);
        e.app.multiboxchange();
        const unit = e.units()[0];
        unit.socket.readyState = 1; unit.socket.onopen();
        if (how === 'close') { unit.socket.readyState = 3; unit.socket.closed = true; unit.socket.onclose(); }
        else unit.handleMessage(new DataView(Uint8Array.of(85).buffer));
        check('23. the server ' + (how === 'close' ? 'closes the new unit' : 'asks the new unit for a captcha') + ': focus back on the main player, it keeps playing, no menu, the tiles untouched',
            e.focus() === 0 && e.LM.play === true && !e.ctx.menuShown && e.same(grid, socks) &&
            (how === 'close' || (e.units().length === 0 && e.LM.multiBoxPlayerExists === false)), [e.focus(), e.ctx.menuShown, e.units().length].join());
    }
}

console.log(failed ? 'FAILED ' + failed : 'all ingamespect checks passed');
process.exit(failed ? 1 : 0);
