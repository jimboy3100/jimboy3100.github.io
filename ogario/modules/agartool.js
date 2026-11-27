/* AgarTool team (Settings > Chat > "AgarTool team", off by default): Legend Mod also joins
 * AgarTool's team server (wss://minimap.agartool.io), so players of the AgarTool extension with
 * the same clan tag on the same agar.io server are Legend Mod teammates: in the team list, on the
 * minimap, and in the chat both ways. The Legend Mod / Delta team relay is not touched.
 *
 * Protocol (AgarTool's, little-endian, strings are UTF-8 ending in a 0 byte):
 *   out 0x9b u8 version            hello            in 0x9b str id         our id
 *   out 0x9d str tag, str arena    join a room      in 0x82 u16 n, n x player   everyone in the room
 *   out 0xa3                       leave the room   in 0xc9 player         someone joined
 *   out 0xa1 u8 flags, fields      our changes      in 0xca str id         someone left
 *   out 0x42 u8 type, str nick, str text  chat      in 0xc8 u16 n, n x (str id, u8 flags, fields)
 *   out/in 0xc5                    ping / pong      in 0x42 u8 type, str nick, str text
 *   player = str id, str nick, str skin URL, str skin name, bool alive, i32 x, i32 y, u32 mass, str ogIds
 *   flags: 1 nick, 2 skin URL, 4 skin name, 8 alive, 16 x, 32 y, 64 mass, 128 (u8 sub, sub&1: str ogIds)
 * The room ("arena") of a game server is the token of live-arena-<token>.agar.io, else the whole
 * address the game connected to. Positions are centred on the map, in world units (as Legend
 * Mod's own team positions, lmTeamWorldOut). ogIds = JSON {relay: our relay player ID}: a player
 * who is on both servers is shown once (from the Legend Mod relay).
 *
 * No socket, listener or timer while the option is off or the game is not on agar.io. */
(function (root) {
    'use strict';
    if (root.LMAgarTool) return;

    var SERVER = 'wss://minimap.agartool.io:443';
    var VERSION = 5;
    var TICK_MS = 1000;
    var RELAY_KEY = 'wss://chat.delt.io/ws';
    var KEY = 'at:';          /* teamPlayers ids of AgarTool players: strings, never equal to a relay id */
    var MAX_MEMBERS = 250;
    var enc = new TextEncoder(), dec = new TextDecoder();

    var S = {
        ws: null, open: false, ready: false, id: '', joined: '',
        tries: 0, retry: 0, tick: 0,
        last: {}, members: new Map(), lastOwn: null, listening: false
    };

    /* ---------- packets ---------- */
    function Writer(op) { this.b = [op & 255]; }
    Writer.prototype.u8 = function (n) { this.b.push(n & 255); return this; };
    Writer.prototype.u32 = function (n) { n = n >>> 0; this.b.push(n & 255, (n >>> 8) & 255, (n >>> 16) & 255, n >>> 24); return this; };
    Writer.prototype.i32 = function (n) { return this.u32(n | 0); };
    Writer.prototype.str = function (s) {
        var bytes = enc.encode(String(s == null ? '' : s).replace(/\0/g, ''));
        for (var i = 0; i < bytes.length; i++) this.b.push(bytes[i]);
        this.b.push(0);
        return this;
    };
    Writer.prototype.buffer = function () { return new Uint8Array(this.b).buffer; };

    function Reader(buf) { this.v = new DataView(buf); this.u = new Uint8Array(buf); this.o = 1; }
    Reader.prototype.u8 = function () { return this.v.getUint8(this.o++); };
    Reader.prototype.u16 = function () { var n = this.v.getUint16(this.o, true); this.o += 2; return n; };
    Reader.prototype.i32 = function () { var n = this.v.getInt32(this.o, true); this.o += 4; return n; };
    Reader.prototype.u32 = function () { var n = this.v.getUint32(this.o, true); this.o += 4; return n; };
    Reader.prototype.str = function () {
        var start = this.o, end = this.u.length;
        while (this.o < end && this.u[this.o] !== 0) this.o++;
        if (this.o >= end) throw new RangeError('string without its 0 byte');
        var s = dec.decode(this.u.subarray(start, this.o));
        this.o++;
        return s;
    };

    /* ---------- game state ---------- */
    function app() { return root.application || null; }
    function game() { return root.legendmod || null; }
    function enabled() { return !!(root.defaultmapsettings && root.defaultmapsettings.agarToolTeam); }
    /* AgarTool players are on agar.io only (LM.integrity: an agar.io / Miniclip game address) */
    function arena() {
        var lm = game();
        if (!lm || !lm.integrity || !lm.ws) return '';
        var ws = String(lm.ws);
        var m = /live-arena-(.*)\.agar\.io/i.exec(ws);
        return m ? m[1] : ws;
    }
    function tag() {
        var el = root.document && root.document.getElementById('clantag');
        return String(el && el.value || '').trim().slice(0, 30);
    }
    function nick() {
        var n = root.ogarcopythelb && root.ogarcopythelb.nick;
        if (!n) { var el = root.document && root.document.getElementById('nick'); n = el && el.value; }
        return String(n || '').slice(0, 30);
    }
    function skinUrl() {
        var el = root.document && root.document.getElementById('skin');
        return String(el && el.value || '').slice(0, 500);
    }
    function scale(axis) {
        var a = app();
        var k = a && typeof a.lmTeamScale === 'function' ? a.lmTeamScale(axis) : 1;
        return Number.isFinite(k) && k > 0 ? k : 1;
    }

    /* ---------- socket ---------- */
    function send(w, beforeReady) {
        var ws = S.ws;
        if (!ws || !S.open || ws.readyState !== 1 || (!S.ready && !beforeReady)) return false;
        try { ws.send(w.buffer()); return true; } catch (e) { return false; }
    }
    function close() {
        clearTimeout(S.retry); S.retry = 0;
        var ws = S.ws;
        S.ws = null; S.open = S.ready = false; S.id = ''; S.joined = ''; S.last = {};
        if (ws) {
            ws.onopen = ws.onmessage = ws.onclose = ws.onerror = null;
            try { ws.close(); } catch (e) { }
        }
        S.members.clear();
        syncTeam();
    }
    function scheduleRetry() {
        clearTimeout(S.retry);
        var delay = Math.min(30000, 2000 * Math.pow(2, Math.min(S.tries, 4)));
        S.tries++;
        S.retry = setTimeout(function () { S.retry = 0; if (S.tick && arena()) connect(); }, delay);
    }
    function connect() {
        close();
        var ws;
        try { ws = new WebSocket(SERVER); } catch (e) { scheduleRetry(); return; }
        ws.binaryType = 'arraybuffer';
        S.ws = ws;
        ws.onopen = function () {
            if (S.ws !== ws) return;
            S.open = true; S.tries = 0;
            send(new Writer(0x9b).u8(VERSION), true);
        };
        ws.onmessage = function (e) { if (S.ws === ws) onMessage(e.data); };
        ws.onclose = function () {
            if (S.ws !== ws) return;
            S.ws = null; S.open = S.ready = false; S.id = ''; S.joined = ''; S.last = {};
            S.members.clear();
            syncTeam();
            if (S.tick) scheduleRetry();
        };
        ws.onerror = function () { };
    }

    /* join the room of the current server and tag; leave the old room when the server changed */
    function syncRoom() {
        if (!S.ready) return;
        var ar = arena(), t = tag();
        var want = ar ? t + '\n' + ar : '';
        if (want === S.joined) return;
        var oldArena = S.joined ? S.joined.split('\n')[1] : '';
        if (S.joined && oldArena !== ar) {
            send(new Writer(0xa3));
            S.members.clear();
            syncTeam();
        }
        if (ar) send(new Writer(0x9d).str(t).str(ar));
        S.joined = want;
        S.last = {};
    }

    /* our state (0xa1): only the fields that changed since the last one */
    function sendState() {
        if (!S.ready || !S.joined) return;
        var g = root.ogario, a = app();
        var alive = !!(g && g.play);
        var next = { nick: nick(), skin: skinUrl(), skinName: '', alive: alive, mass: 0, og: '{}' };
        if (alive && a && typeof a.getPlayerX === 'function') {
            next.x = Math.round(a.getPlayerX() * scale(0));
            next.y = Math.round(a.getPlayerY() * scale(1));
            next.mass = Math.max(0, Math.round(Number(g.playerMass) || 0));
        }
        if (a && a.playerID) { var o = {}; o[RELAY_KEY] = a.playerID >>> 0; next.og = JSON.stringify(o); }
        var L = S.last, f = 0;
        if (next.nick !== L.nick) f |= 1;
        if (next.skin !== L.skin) f |= 2;
        if (next.skinName !== L.skinName) f |= 4;
        if (next.alive !== L.alive) f |= 8;
        if (next.x !== undefined && next.x !== L.x) f |= 16;
        if (next.y !== undefined && next.y !== L.y) f |= 32;
        if (next.mass !== L.mass) f |= 64;
        if (next.og !== L.og) f |= 128;
        if (!f) return;
        var w = new Writer(0xa1).u8(f);
        if (f & 1) w.str(next.nick);
        if (f & 2) w.str(next.skin);
        if (f & 4) w.str(next.skinName);
        if (f & 8) w.u8(next.alive ? 1 : 0);
        if (f & 16) w.i32(next.x);
        if (f & 32) w.i32(next.y);
        if (f & 64) w.u32(next.mass);
        if (f & 128) w.u8(1).str(next.og);
        if (send(w)) {
            var keys = [[1, 'nick'], [2, 'skin'], [4, 'skinName'], [8, 'alive'], [16, 'x'], [32, 'y'], [64, 'mass'], [128, 'og']];
            for (var i = 0; i < keys.length; i++) if (f & keys[i][0]) L[keys[i][1]] = next[keys[i][1]];
        }
    }

    function parseOg(text) {
        try {
            var o = JSON.parse(text);
            if (!o || typeof o !== 'object') return null;
            var ids = [];
            for (var k in o) { var n = Number(o[k]); if (Number.isFinite(n) && n > 0) ids.push(n >>> 0); }
            return ids.length ? ids.slice(0, 8) : null;
        } catch (e) { return null; }
    }
    function member(id) {
        if (!id || id === S.id) return null;
        var m = S.members.get(id);
        if (!m && S.members.size < MAX_MEMBERS) {
            m = { id: id, nick: '', skin: '', alive: false, x: 0, y: 0, mass: 0, og: null, hasPos: false };
            S.members.set(id, m);
        }
        return m || null;
    }
    function readPlayer(r) {
        var id = r.str(), name = r.str(), skin = r.str();
        r.str(); /* agar.io skin name */
        var alive = r.u8() !== 0, x = r.i32(), y = r.i32(), mass = r.u32(), og = r.str();
        var m = member(id);
        if (!m) return;
        m.nick = name; m.skin = skin; m.alive = alive; m.x = x; m.y = y; m.mass = mass; m.og = parseOg(og);
        m.hasPos = alive;
    }
    function readUpdate(r) {
        var id = r.str(), f = r.u8();
        var m = member(id), t = m || {}; /* every field is read, also our own, so the offset stays right */
        if (f & 1) t.nick = r.str();
        if (f & 2) t.skin = r.str();
        if (f & 4) r.str();
        if (f & 8) t.alive = r.u8() !== 0;
        if (f & 16) { t.x = r.i32(); t.hasPos = true; }
        if (f & 32) { t.y = r.i32(); t.hasPos = true; }
        if (f & 64) t.mass = r.u32();
        if (f & 128) { if (r.u8() & 1) t.og = parseOg(r.str()); }
    }
    function readChat(r) {
        var type = r.u8(), name = r.str(), text = r.str();
        if (!text || type !== 0) return;
        var own = S.lastOwn;
        if (own && Date.now() - own.t < 4000 && own.text === text && own.nick === name) return; /* our own, echoed */
        var a = app();
        if (!a || typeof a.displayChatMessage !== 'function') return;
        var plId = KEY + name;
        S.members.forEach(function (m) { if (m.nick === name) plId = KEY + m.id; });
        if (typeof a.isChatUserMuted === 'function' && a.isChatUserMuted(plId)) return;
        var time = new Date().toTimeString().replace(/^(\d{2}:\d{2}).*/, '$1');
        try { a.displayChatMessage(time, 101, plId, (name || 'Unnamed') + ': ' + text); } catch (e) { }
    }
    function onMessage(data) {
        if (Object.prototype.toString.call(data) !== '[object ArrayBuffer]' || !data.byteLength) return;
        var r = new Reader(data);
        try {
            switch (r.v.getUint8(0)) {
                case 0x9b: S.id = r.str(); S.ready = true; S.joined = ''; syncRoom(); sendState(); break;
                case 0xc5: send(new Writer(0xc5)); break;
                case 0x82: S.members.clear(); for (var n = r.u16(); n > 0; n--) readPlayer(r); syncTeam(); break;
                case 0xc9: readPlayer(r); syncTeam(); break;
                case 0xca: S.members.delete(r.str()); syncTeam(); break;
                case 0xc8: for (var k = r.u16(); k > 0; k--) readUpdate(r); break;
                case 0x42: readChat(r); break;
            }
        } catch (e) {
            if (!(e instanceof RangeError) && root.console) console.warn('[LM AgarTool] message failed', e);
        }
    }

    /* ---------- AgarTool players as Legend Mod teammates ---------- */
    function syncTeam() {
        var a = app();
        if (!a || !Array.isArray(a.teamPlayers)) return;
        var list = a.teamPlayers, relay = {}, i;
        for (i = 0; i < list.length; i++) if (typeof list[i].id === 'number') relay[list[i].id >>> 0] = true;
        var want = {}, now = Date.now(), kx = scale(0), ky = scale(1);
        S.members.forEach(function (m) {
            if (m.og && m.og.some(function (id) { return relay[id]; })) return; /* on the relay too: shown from there */
            var key = KEY + m.id;
            want[key] = true;
            var idx = typeof a.checkPlayerID === 'function' ? a.checkPlayerID(key) : null;
            var p = idx !== null ? list[idx] : null;
            if (!p) {
                if (list.length >= 250 || typeof root.minimapCell !== 'function') return;
                p = new root.minimapCell(key, m.nick, m.nick, '');
                p._lmAgarTool = true;
                p.setColor('', '');
                list.push(p);
            }
            if (p.nick !== m.nick) { p.nick = m.nick; p.skinID = m.nick; }
            var url = m.skin && typeof a.checkSkinURL === 'function' ? a.checkSkinURL(m.skin) : '';
            if (url && url !== p.skinURL) {
                p.skinURL = url;
                if (m.nick && typeof a.cacheCustomSkin === 'function') { try { a.cacheCustomSkin(m.nick, p.color || '#000000', url); } catch (e) { } }
            }
            if (m.alive && m.hasPos) {
                p.setPosition(m.x / kx, m.y / ky);
                p.mass = m.mass > 0 ? m.mass : 1; /* the team list drops mass 0 */
                p.alive = true;
                p.updateTime = now; /* AgarTool sends changes only: a player standing still stays shown */
            } else {
                p.alive = false;
            }
        });
        for (i = list.length - 1; i >= 0; i--) {
            var id = list[i].id;
            if (typeof id === 'string' && id.indexOf(KEY) === 0 && !want[id]) list.splice(i, 1);
        }
    }

    /* ---------- lifecycle ---------- */
    function tick() {
        if (!enabled()) { stop(); return; }
        if (!arena()) { if (S.ws || S.retry) close(); return; }
        if (!S.ws && !S.retry) { connect(); return; }
        syncRoom();
        sendState();
        syncTeam();
    }
    function start() {
        if (S.tick) return;
        S.tick = setInterval(tick, TICK_MS);
        tick();
    }
    function stop() {
        if (S.tick) { clearInterval(S.tick); S.tick = 0; }
        S.tries = 0;
        close();
    }
    function sync() { if (enabled()) start(); else stop(); }

    /* Typed team chat goes to AgarTool too (called by enterChatMessage). echoed: the relay also
     * shows our line, so AgarTool's copy of it is dropped. Lines with Legend Mod's own codes are
     * not sent: AgarTool players would see the raw codes. */
    function sendChat(text, echoed) {
        text = String(text || '').trim();
        if (!text || !S.ready || !S.joined) return false;
        if (/\[(url|yut|img|skype|discord|srv|tag|Dos\w*)\]/i.test(text)) return false;
        var n = nick();
        if (!send(new Writer(0x42).u8(0).str(n).str(text.slice(0, 200)))) return false;
        S.lastOwn = echoed ? { t: Date.now(), nick: n, text: text.slice(0, 200) } : null;
        return true;
    }

    root.LMAgarTool = {
        sync: sync,
        sendChat: sendChat,
        status: function () {
            return { on: !!S.tick, open: S.open, ready: S.ready, id: S.id, room: S.joined.replace('\n', ' @ '), members: S.members.size };
        },
        _test: { Writer: Writer, Reader: Reader, arena: arena, state: S, onMessage: onMessage, syncTeam: syncTeam, readChat: readChat }
    };

    if (root.LMEvents && typeof root.LMEvents.on === 'function') {
        root.LMEvents.on('settingsChange', function (d) { if (d && d.key === 'agarToolTeam') setTimeout(sync, 0); });
    }
    sync();
})(typeof window !== 'undefined' ? window : this);
