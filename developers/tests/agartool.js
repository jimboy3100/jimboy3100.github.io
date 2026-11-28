/* AgarTool team (ogario/modules/agartool.js), the real module in a fake page, no network:
 * - option off: no socket, no timer; on: one socket to minimap.agartool.io, only on agar.io
 * - strings are UTF-8 ending in a 0 byte: the server's real hello answer 9b "4-1991" 00 gives our id,
 *   then the room join 9d tag arena (the token of live-arena-<token>.agar.io, else the address)
 * - our state 0xa1 carries only what changed; positions in world units (lmTeamScale)
 * - AgarTool players become teammates (team list, minimap): position / scale, a player standing
 *   still stays alive, one who is also on the Legend Mod relay (ogIds) is shown once, a left one goes
 * - chat both ways: typed lines go out (not Legend Mod codes), AgarTool lines are shown, our own
 *   echo is dropped when the relay already showed the line, muted players stay hidden
 * node developers/tests/agartool.js */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repo = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(process.argv[2] || path.join(repo, 'ogario', 'modules', 'agartool.js'), 'utf8');
let fail = 0;
function check(name, ok, info) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : ' -> ' + JSON.stringify(info)));
    if (!ok) fail++;
}
const nul = (s) => Array.from(Buffer.from(s, 'utf8')).concat(0);
const u32 = (n) => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255];
const buf = (arr) => new Uint8Array(arr).buffer;

function page(opts) {
    const sockets = [], timers = [], intervals = [], shown = [], listeners = {};
    function FakeWS(url) { this.url = url; this.readyState = 0; this.sent = []; sockets.push(this); }
    FakeWS.prototype.send = function (b) { this.sent.push(Array.from(new Uint8Array(b))); };
    FakeWS.prototype.close = function () { this.readyState = 3; this.closed = true; };
    function minimapCell(id, nick, skinID, skinURL) {
        this.id = id; this.nick = nick; this.skinID = skinID; this.skinURL = skinURL;
        this.alive = false; this.mass = 0; this.updateTime = null; this.color = null;
        this.setColor = function () { this.color = '#ffffff'; };
        this.setPosition = function (x, y) { this.x = x; this.y = y; };
    }
    const els = { clantag: { value: opts.tag == null ? 'ΛΜ' : opts.tag }, nick: { value: 'Me' }, skin: { value: '' } };
    const w = {
        WebSocket: FakeWS, TextEncoder, TextDecoder, JSON, Math, Number, Date, Array, Object, String, Map, RangeError, DataView, Uint8Array,
        console: { warn: (...a) => shown.push(['warn', a.join(' ')]) },
        setInterval: (f, ms) => { intervals.push(f); return intervals.length; },
        clearInterval: (id) => { intervals[id - 1] = null; },
        setTimeout: (f) => { timers.push(f); return timers.length; },
        clearTimeout: (id) => { if (id) timers[id - 1] = null; },
        document: { getElementById: (id) => els[id] || null },
        defaultmapsettings: { agarToolTeam: !!opts.on },
        legendmod: { integrity: opts.integrity !== false, ws: opts.ws || 'wss://live-arena-1q2w3e.agar.io:443' },
        ogarcopythelb: { nick: 'Me' },
        ogario: { play: true, playerMass: 123 },
        minimapCell: minimapCell,
        LMEvents: { on: (name, f) => { listeners[name] = f; } },
        application: {
            teamPlayers: [], playerID: 77, muted: {},
            lmTeamScale: (axis) => (axis ? 1.01 : 0.99),
            getPlayerX: () => 100, getPlayerY: () => -200,
            checkPlayerID(id) { for (let i = 0; i < this.teamPlayers.length; i++) if (this.teamPlayers[i].id === id) return i; return null; },
            checkSkinURL: (u) => (/^https:\/\//.test(u) ? u : ''),
            cacheCustomSkin() { },
            isChatUserMuted(id) { return !!this.muted[id]; },
            displayChatMessage(time, type, id, msg) { shown.push([type, id, msg]); }
        }
    };
    w.window = w;
    vm.createContext(w);
    vm.runInContext(src, w);
    return { w, sockets, timers, intervals, shown, listeners, els, at: w.LMAgarTool };
}
const live = (p) => p.intervals.filter(Boolean).length;
function open(p) { const ws = p.sockets[p.sockets.length - 1]; ws.readyState = 1; ws.onopen(); return ws; }

/* option off */
let p = page({ on: false });
check('off: no socket', p.sockets.length === 0);
check('off: no timer', live(p) === 0);
check('off: listens for its option', typeof p.listeners.settingsChange === 'function');

/* option on, not agar.io */
p = page({ on: true, integrity: false, ws: 'wss://ffa.legendmod.ml:8080' });
check('not agar.io: no socket', p.sockets.length === 0);

/* option on, agar.io */
p = page({ on: true });
check('on: one socket to AgarTool', p.sockets.length === 1 && p.sockets[0].url === 'wss://minimap.agartool.io:443', p.sockets.map((s) => s.url));
check('on: one timer', live(p) === 1);
let ws = open(p);
check('hello 9b 05', JSON.stringify(ws.sent[0]) === JSON.stringify([0x9b, 5]), ws.sent[0]);
ws.onmessage({ data: buf([0x9b, 0x34, 0x2d, 0x31, 0x39, 0x39, 0x31, 0x00]) });
check('hello answer gives our id', p.at.status().id === '4-1991', p.at.status());
check('room join: tag + live-arena token', JSON.stringify(ws.sent[1]) === JSON.stringify([0x9d].concat(nul('ΛΜ'), nul('1q2w3e'))), ws.sent[1]);
const st = ws.sent[2];
check('state: every field the first time', st && st[0] === 0xa1 && st[1] === (1 | 2 | 4 | 8 | 16 | 32 | 64 | 128), st);
const xAt = 2 + nul('Me').length + 1 + 1 + 1;
const dv = new DataView(new Uint8Array(st).buffer);
check('state: position in world units', dv.getInt32(xAt, true) === 99 && dv.getInt32(xAt + 4, true) === -202, [dv.getInt32(xAt, true), dv.getInt32(xAt + 4, true)]);
const n0 = ws.sent.length;
p.intervals[0]();
check('state: nothing sent when nothing changed', ws.sent.length === n0, ws.sent.slice(n0));
p.w.ogario.playerMass = 150;
p.intervals[0]();
check('state: only the mass when only the mass changed', JSON.stringify(ws.sent[n0]) === JSON.stringify([0xa1, 64].concat(u32(150))), ws.sent[n0]);
/* the position is where you are (the core's lmMyPosition, the player you control), not the camera
 * (getPlayerX: 100, -200 here) */
{
    const v4 = fs.readFileSync(path.join(repo, 'ogario', 'ogario.v4.js'), 'utf8');
    const fnSrc = (head) => { const i = v4.indexOf(head); if (i < 0) return ''; let d = 0, k = v4.indexOf('{', i); for (; k < v4.length; k++) { if (v4[k] === '{') d++; else if (v4[k] === '}' && --d === 0) break; } return v4.slice(i, k + 1); };
    vm.runInContext(fnSrc('function getActiveSpect(') + '\n' + fnSrc('function lmMyPosition() {') + '\nif (typeof lmMyPosition === "function") window.lmMyPosition = lmMyPosition;', p.w);
    /* x, y (and the mass when it changed) of the last state: only those fields may be in it */
    const xy = (withMass) => { const s = ws.sent[ws.sent.length - 1]; const v = new DataView(new Uint8Array(s).buffer); return s[1] === (withMass ? 112 : 48) ? [v.getInt32(2, true), v.getInt32(6, true)].concat(withMass ? [v.getUint32(10, true)] : []) : s; };
    /* legendmod and ogario are one object in the page: the main player's mass is on both */
    Object.assign(p.w.legendmod, { play: true, playerCells: [{}], viewXTrue: 300, viewYTrue: -400, playerX: 100, playerY: -200, playerMass: p.w.ogario.playerMass });
    p.intervals[0]();
    check('state: the main player\'s own cells, not the camera', JSON.stringify(xy()) === JSON.stringify([297, -404]), xy());
    p.w.spects = [{ number: 1, player: false }, { number: 4, player: true, playerCellIDs: [9], playerX: 500, playerY: 600, playerMass: 321.6 }];
    p.w.multiboxPlayerEnabled = 4;
    p.intervals[0]();
    check('state: the multibox unit you control, with its mass', JSON.stringify(xy(true)) === JSON.stringify([495, 606, 322]), xy(true));
    p.w.multiboxPlayerEnabled = null; delete p.w.spects;
    Object.assign(p.w.legendmod, { play: false, playerCells: [] });
    p.intervals[0]();
    check('state: nothing of ours alive in the core (ogario.play still set): the camera and the main player\'s mass, as before', JSON.stringify(xy(true)) === JSON.stringify([99, -202, 150]), xy(true));
    /* the main player dead, the multibox unit you control alive (lmActiveUnit): still alive, with
     * the unit's place and mass (only while the main player played it was sent) */
    vm.runInContext(fnSrc('function lmActiveUnit(lite) {') + '\nwindow.lmActiveUnit = lmActiveUnit;', p.w);
    p.w.spects = [{ number: 4, player: true, active: true, playerCellIDs: [9], playerX: 700, playerY: 800, playerMass: 444 }];
    p.w.multiboxPlayerEnabled = 4;
    p.w.ogario.play = false;
    p.intervals[0]();
    check('state: main player dead, the unit you control alive: alive, its position and mass', JSON.stringify(xy(true)) === JSON.stringify([693, 808, 444]), xy(true));
    p.w.spects[0].active = false; p.w.spects[0].playerCellIDs = [];
    p.intervals[0]();
    const dead = ws.sent[ws.sent.length - 1];
    check('state: the unit you control dead too: not alive', dead[0] === 0xa1 && (dead[1] & 8) === 8, dead);
    p.w.multiboxPlayerEnabled = null; delete p.w.spects; p.w.ogario.play = true;
}

/* teammates */
const player = (id, nick, alive, x, y, mass, og) => nul(id).concat(nul(nick), nul(''), nul(''), [alive ? 1 : 0], u32(x), u32(y), u32(mass), nul(og || ''));
ws.onmessage({ data: buf([0x82, 3, 0].concat(player('4-1991', 'Me', true, 0, 0, 1), player('7-1', 'Ally', true, 990, -1010, 500), player('8-2', 'Both', true, 5, 5, 50, '{"wss://chat.delt.io/ws":4242}'))) });
const team = p.w.application.teamPlayers;
let ally = team.find((t) => t.id === 'at:7-1');
check('room list: AgarTool player becomes a teammate', !!ally && ally.nick === 'Ally' && ally.alive && ally.mass === 500, team.map((t) => t.id));
check('room list: position divided by our scale', ally && Math.round(ally.x) === 1000 && Math.round(ally.y) === -1000, ally && [ally.x, ally.y]);
check('room list: not ourselves', !team.some((t) => t.id === 'at:4-1991'));
check('relay ids never clash (string ids)', team.every((t) => typeof t.id === 'string'));
team.push({ id: 4242, nick: 'Both', alive: true });
p.intervals[0]();
check('also on the relay: shown once (from the relay)', !team.some((t) => t.id === 'at:8-2') && team.some((t) => t.id === 4242), team.map((t) => t.id));
ally.updateTime = 0;
p.intervals[0]();
check('standing still: kept alive (AgarTool sends changes only)', ally.updateTime > 0 && ally.alive);
team.length = 0; /* a game connect empties the team list */
p.intervals[0]();
check('team list emptied by a connect: AgarTool players come back', team.some((t) => t.id === 'at:7-1'));
ws.onmessage({ data: buf([0xc8, 1, 0].concat(nul('7-1'), [8 | 16], [0], u32(1))) });
p.intervals[0]();
ally = team.find((t) => t.id === 'at:7-1');
check('update: dead player is not alive', ally && !ally.alive);
ws.onmessage({ data: buf([0xca].concat(nul('7-1'))) });
check('left: removed', !team.some((t) => t.id === 'at:7-1'));
ws.onmessage({ data: buf([0x82, 1, 0]) }); /* a cut packet */
check('a cut packet is ignored', p.shown.every((s) => s[0] !== 'warn'), p.shown);

/* chat */
check('typed line goes out', p.at.sendChat('hi team', true) && JSON.stringify(ws.sent[ws.sent.length - 1]) === JSON.stringify([0x42, 0].concat(nul('Me'), nul('hi team'))));
const before = ws.sent.length;
check('Legend Mod codes are not sent', !p.at.sendChat('[url]https://x[/url]', true) && ws.sent.length === before);
ws.onmessage({ data: buf([0x42, 0].concat(nul('Me'), nul('hi team'))) });
check('own echo dropped when the relay showed it', !p.shown.some((s) => s[2] === 'Me: hi team'));
ws.onmessage({ data: buf([0x42, 0].concat(nul('Pal'), nul('hello'))) });
check('AgarTool line shown as team chat', p.shown.some((s) => s[0] === 101 && s[2] === 'Pal: hello'), p.shown);
p.w.application.muted['at:Pal'] = true;
ws.onmessage({ data: buf([0x42, 0].concat(nul('Pal'), nul('again'))) });
check('muted AgarTool player stays hidden', !p.shown.some((s) => s[2] === 'Pal: again'));
p.at.sendChat('only here', false);
ws.onmessage({ data: buf([0x42, 0].concat(nul('Me'), nul('only here'))) });
check('own echo shown when the relay did not send the line', p.shown.some((s) => s[2] === 'Me: only here'));

/* server switch, tag change, option off */
const k = ws.sent.length;
p.w.legendmod.ws = 'wss://web-arenas-live-v25-0.agario.miniclippt.com/eu/1-2-3-4:1501';
p.intervals[0]();
check('server switch: leave a3, join the new room', JSON.stringify(ws.sent.slice(k, k + 2)) === JSON.stringify([[0xa3], [0x9d].concat(nul('ΛΜ'), nul('wss://web-arenas-live-v25-0.agario.miniclippt.com/eu/1-2-3-4:1501'))]), ws.sent.slice(k, k + 2));
const k2 = ws.sent.length;
p.els.clantag.value = 'XY';
p.intervals[0]();
check('tag change: join again without leaving', ws.sent[k2] && ws.sent[k2][0] === 0x9d && JSON.stringify(ws.sent[k2]).indexOf(JSON.stringify(nul('XY')).slice(1, -1)) > 0, ws.sent[k2]);
ws.onmessage({ data: buf([0x82, 1, 0].concat(player('9-9', 'Pal', true, 0, 0, 10))) });
p.w.defaultmapsettings.agarToolTeam = false;
p.listeners.settingsChange({ key: 'agarToolTeam', value: false });
p.timers.filter(Boolean).forEach((f) => f());
check('off again: socket closed, timer stopped, AgarTool teammates removed', ws.closed && live(p) === 0 && !team.some((t) => String(t.id).indexOf('at:') === 0), { closed: ws.closed, timers: live(p), team: team.map((t) => t.id) });

console.log(fail ? fail + ' failed' : 'all agartool checks passed');
process.exit(fail ? 1 : 0);
