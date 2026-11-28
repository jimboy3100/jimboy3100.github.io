/* Multibox scene for the Node tests: the main player (source 0) and K - 1 playing spect.js units
 * (player: true, sparse source numbers 1, 2, 18, 5, 9 by default), optionally Full Map tiles
 * (player: false, numbers 3, 4, 20, 21, each with its own raw -> world transform), over the real
 * code cut out of ogario/ogario.v4.js and ogario/spect.js and run in one vm context, as
 * mbtwin.js / mbdeath.js do:
 *   ogario.v4.js: LMEvents .. getActiveSpect / lmSetMbUnit / lmDeathScope; the multibox hide step
 *     (var LM_UNIT_ID_STEP .. lmMultiboxPositionTwin) and drawRender's frame compaction (the same cut
 *     as mbtwin.js); onPlayerDeath's switch to a living unit, lmIdxFilter, lmIdxClear,
 *     LM.flushSpecsData, LM._lmMbStop (LM._lmSpecSetMode only records its calls in LM.calls); with
 *     app: true also application.multiboxchange / multiboxback / _lmMbStart / the player calls (mbEnable,
 *     mbAddPlayer, mbRemovePlayer, mbSelectPlayer, mbSelectAdjacent, _lmMbFocus) / ensureMbSlots /
 *     syncFromMbSlots / selectProfile (six profiles).
 *   spect.js: getOwnPlayerCells, beforecalculation, terminate, respawn,
 *     calculatePlayerMassAndPosition, recalculatePlayerMass; with app: true also addBox (on a stand-in
 *     Spect numbered as spect.js numbers it: the highest number + 1). The units of a scene are in their
 *     player slots (lmMbPlayers: slot = their place + 2), as addBox puts them.
 * The world is a list of entities (physical cells): each has one copy, a cell object as spect.js /
 * updateCells make it (spectator, _lmSrc, _lmGen, _lmRawId, own-cell flags), on every source that
 * sees it, so the hide step's result can be checked against what is really there (audit()).
 * Players have socket and life generations; kill / respawn / reconnect / remove change them and
 * the copies as the client does, step() runs the units' beforecalculation (own mass, focus) and
 * the frame's hide step. Nothing is sent anywhere.
 *   const MB = require('./lib/mbplayers');
 *   const s = MB.scene({ players: 4, fullMap: true }); MB.populate(s); s.step(3);
 *   const r = s.audit(); // r.dup, r.missing, r.hiddenOwn, r.wrongRep, r.mass, r.food, r.ok
 * Options: players 1..6, fullMap, ids (unit numbers), tileIds, v4 / sp (file paths), app. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ROOT = path.join(__dirname, '..', '..', '..');
const PLAYER_IDS = [1, 2, 18, 5, 9];
const TILE_IDS = [3, 4, 20, 21];
const STEP = 4294967296;
const MAX_PLAYERS = 6;
/* Full Map tiles: raw -> world xw = sx * (xr - ox) + dx (Rotate Map / mirrored connections) */
const TILE_TF = [{ sx: 1, sy: 1, ox: 3000, oy: 0, dx: 0, dy: 0 }, { sx: -1, sy: 1, ox: 0, oy: 0, dx: 0, dy: 0 },
    { sx: 1, sy: 1, ox: 0, oy: -2500, dx: 0, dy: 0 }, { sx: 1, sy: -1, ox: 0, oy: 0, dx: 400, dy: 0 }];
const IDENT = { sx: 1, sy: 1, ox: 0, oy: 0, dx: 0, dy: 0 };
const toWorld = (t, xr, yr) => [t.sx * (xr - t.ox) + t.dx, t.sy * (yr - t.oy) + t.dy];
const toRaw = (t, xw, yw) => [(xw - t.dx) / t.sx + t.ox, (yw - t.dy) / t.sy + t.oy];

function block(src, start, from) {
    const i = src.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
const cache = new Map();
/* the real code for one pair of files, cut once */
function load(o) {
    o = o || {};
    const v4p = o.v4 || path.join(ROOT, 'ogario', 'ogario.v4.js'), spp = o.sp || path.join(ROOT, 'ogario', 'spect.js');
    const key = v4p + '|' + spp;
    if (cache.has(key)) return cache.get(key);
    const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    const v4 = read(v4p), sp = read(spp);
    const need = (v, what) => { if (!v) throw new Error('mbplayers: ' + what + ' not found'); return v; };
    const ea = v4.indexOf('/* LMEvents: hooks'), eb = v4.indexOf('window.OgVer', ea);
    const ta = v4.indexOf('var LM_UNIT_ID_STEP'), tm = v4.indexOf('function lmMultiboxPositionTwin('), tb = v4.indexOf('\n}\n', tm);
    const ca = v4.indexOf('var _cW = 0;'), cb = v4.indexOf('* JELLY PHYSICS\n                 * CURRENT-FRAME PREPARATION', ca);
    need(ea >= 0 && eb >= 0, 'LMEvents .. window.OgVer');
    need(ta >= 0 && tm >= 0 && tb >= 0, 'multibox hide step');
    need(ca >= 0 && cb >= 0, 'frame compaction');
    const compact = v4.slice(ca, cb).slice(0, v4.slice(ca, cb).lastIndexOf('/*'));
    const methods = ['getOwnPlayerCells() {', 'beforecalculation() {', 'terminate(reason) {', 'respawn() {',
        'calculatePlayerMassAndPosition(ownCells) {', 'recalculatePlayerMass(ownCells) {'].map((m) => need(block(sp, '    ' + m), 'spect.js ' + m));
    const deathSwitch = need(block(v4, "if (defaultmapsettings.mbSwitchAfterDeath && typeof spects !== 'undefined' && spects && spects.length > 0) {"), 'onPlayerDeath switch');
    const idx = ['    function lmIdxFilter(', '    function lmIdxClear('].map((m) => need(block(v4, m), m.trim()));
    const app = ['        multiboxchange() {', '        multiboxback() {', '        _lmMbStart() {', '        mbEnable() {', '        mbDisable() {', '        mbAddPlayer() {',
        '        mbRemovePlayer(slot) {', '        mbSelectPlayer(slot) {', '        mbSelectAdjacent(dir) {', '        _lmMbFocus(sp) {',
        '        ensureMbSlots() {', '        syncFromMbSlots() {', '        selectProfile(value) {'].map((m) => need(block(v4, m), m.trim()));
    const addBox = need(block(sp, 'function addBox() {'), 'spect.js addBox');
    const flush = need(block(v4, '        flushSpecsData() {'), 'flushSpecsData') + ',\n' + need(block(v4, '        _lmMbStop() {'), '_lmMbStop');
    const r = {
        events: v4.slice(ea, eb), twin: v4.slice(ta, tb + 3),
        frame: 'function _lmFrame() { var LM = window.legendmod, i, cell;\nlmMbFrameHide();\n' + compact + '\n}',
        methods: methods.join('\n'), deathSwitch, idx: idx.join('\n'), app: app.join(',\n'), addBox, flush
    };
    cache.set(key, r);
    return r;
}

const noop = () => { };
function scene(o) {
    o = o || {};
    const K = o.players || 2;
    if (!(K >= 1 && K <= MAX_PLAYERS)) throw new Error('mbplayers: players 1..' + MAX_PLAYERS);
    const C = load(o);
    const ids = (o.ids || PLAYER_IDS).slice(0, K - 1), tileIds = o.fullMap ? (o.tileIds || TILE_IDS) : [];
    /* document: the death menu's listeners (terminate), so a test can use the menu (s.useMenu) */
    const listeners = [];
    const ctx = { console: { log: noop, warn: noop, error: noop }, Date, toastr: {}, setTimeout: () => 1, clearTimeout: noop, clearInterval: noop,
        document: { activeElement: null, addEventListener: (type, fn) => listeners.push({ type, fn }) } };
    ctx.window = ctx;
    vm.createContext(ctx);
    /* compiled once per pair of files (and app), run in a new context per scene */
    const sk = o.app ? 'scriptApp' : 'script';
    C[sk] = C[sk] || new vm.Script(C.events + '\n' + C.twin + '\n' + C.frame + '\n' + C.idx + '\n' +
        'var defaultmapsettings = window.defaultmapsettings = { mbSwitchAfterDeath: true, mbAutoRespawn: false, showStatsSTE: true, dominationRate: 4 / 3, dominatedRate: 3 / 4, multiboxAmount: 2 };\n' +
        'var legendmod = window.legendmod = { play: true, multiBoxPlayerExists: false, cells: [], playerCells: [], playerCellsMulti: [], food: [], foodMulti: [],\n' +
        ' viruses: [], removedCells: [], indexedCells: {}, time: 0, selectBiggestCell: false, calls: [],\n' +
        ' _lmSpecSetMode(m) { this.calls.push("specMode:" + m); },\n' + C.flush + ' }, LM = legendmod;\n' +
        /* six profiles, each with its own nick and skin; the main player plays profile 0, the first unit profile 1 */
        'var profiles = [0, 1, 2, 3, 4, 5].map(function (i) { return { nick: "prof" + i, color: "#00000" + i, skinURL: "skin" + i }; }), ogarcopythelb = {};\n' +
        'function play() { legendmod.play = true; }\n' +
        'var application = window.application = { menuShown: 0, menuHidden: 0, autoResps: 0, mbSlots: [0, 1], selectedProfile: 0, selectedOldProfile: 1, skins: [], preloaded: [],\n' +
        ' showMenu() { this.menuShown++; }, hideMenu() { this.menuHidden++; }, autoResp() { this.autoResps++; }, cacheCustomSkin(nick) { this.skins.push(nick); },\n' +
        ' setPlayerSettings() { }, setProfile() { this.ensureMbSlots(); }, setProfileboxShadow() { }, eraseProfileboxShadow() { },\n' +
        ' onPlayerDeath() {\n' + C.deathSwitch + '\nthis.autoResp();\n}' + (o.app ? ',\n' + C.app : '') + ' };\n' +
        'window.Unit = class Unit { constructor(n, player, op) { this.number = n; this.player = player === true; this.active = null; this.playerCellIDs = [];\n' +
        ' this.slotId = this.player && op && op.slotId >= 2 ? op.slotId : 0; this.slotEpoch = this.slotId ? op.slotEpoch : 0;\n' +
        ' this.connectionGeneration = 1; this.openSecond = false; this.playerScore = 0; this.open = true; this.spawnRequests = 0; this.connects = 0; this.socket = {}; this.connectionOpened = true; }\n' +
        ' isSocketOpen() { return this.open; } handleSendNick() { this.spawnRequests++; } connect() { this.connects++; } closeConnection() { this.open = false; this.closed = true; this.closedByUser = true; this.socket = null; }\n' + C.methods + '\n};\n' +
        /* spect.js numbers a new connection as the highest number + 1; window.spectThrows / spectHook: the
         * next one fails / runs a function while it is made (a reentrant addBox) */
        'window.Spect = class Spect extends Unit { constructor(op) { if (window.spectThrows) { window.spectThrows = false; throw new Error("socket refused"); }\n' +
        ' super(spects.reduce(function (m, s) { return s && s.number > m ? s.number : m; }, 0) + 1, !!(op && op.player === true), op);\n' +
        ' if (window.spectHook) { var h = window.spectHook; window.spectHook = null; h(this); } } };\n' +
        /* spect.js lmPreloadUnitSkin: a unit's skin is only loaded by its link */
        'function lmPreloadUnitSkin(url) { application.preloaded.push(url); }\n' +
        C.addBox, { filename: 'mbplayers-scene.js' });
    C[sk].runInContext(ctx);
    ctx.defaultmapsettings.multiboxAmount = K;
    const LM = ctx.legendmod;
    const s = { ctx, LM, K, fullMap: !!o.fullMap, players: [], tiles: [], sources: new Map(), ents: [] };
    let nextKey = 1;
    const addSource = (src, unit, slot, tf) => {
        const so = { src, unit, slot, tf, socketGeneration: 1, lifeGeneration: 0, nextRaw: 1000 + src * 100, observing: true };
        s.sources.set(src, so);
        return so;
    };
    s.players.push(Object.assign(addSource(0, null, 1, IDENT), { alive: true, lifeGeneration: 1 }));
    ids.forEach((id, i) => {
        const r = ctx.lmMbPlayers.reserve();
        const u = new ctx.Unit(id, true, r);
        ctx.spects.push(u);
        ctx.lmMbPlayers.attach(u);
        s.players.push(Object.assign(addSource(id, u, i + 2, IDENT), { alive: true, lifeGeneration: 1 }));
    });
    tileIds.forEach((id, i) => {
        const u = new ctx.Unit(id, false);
        ctx.spects.push(u);
        s.tiles.push(addSource(id, u, null, TILE_TF[i % TILE_TF.length]));
    });
    LM.multiBoxPlayerExists = K > 1;
    s.player = (slot) => s.players.find((p) => p && p.slot === slot) || null;
    s.playingSources = () => s.players.filter(Boolean).map((p) => p.src);
    s.allSources = () => s.playingSources().concat(s.tiles.map((t) => t.src));

    /* one source's copy of an entity, made as spect.js (units, tiles) or updateCells (main) make it */
    function observe(ent, src) {
        const so = s.sources.get(src);
        if (!so || !so.observing || ent.gone || ent.copies.has(src)) return null;
        const own = ent.owner === src;
        const raw = so.nextRaw++;
        const j = ((ent.key * 7 + src * 3) % 5) - 2; /* each connection sees it up to 2 off */
        const r = toRaw(so.tf, ent.x + j, ent.y - j), w = toWorld(so.tf, r[0], r[1]);
        const srvColor = '#' + ((0x123456 + src * 0x0a0b0c + ent.key * 0x010203) & 0xffffff).toString(16).padStart(6, '0');
        const c = {
            id: src ? raw + src * STEP : raw, _lmRawId: raw, _lmSrc: src, _lmGen: so.socketGeneration, _lmLife: own ? so.lifeGeneration : 0,
            spectator: src ? src : false, x: w[0], y: w[1], targetX: w[0], targetY: w[1], _lmRawX: r[0], _lmRawY: r[1],
            size: ent.size, targetSize: ent.size, color: own ? '#01d9cc' : srvColor, _lmRawColor: srvColor,
            _lmSrvName: ent.name || undefined, targetNick: own ? 'Prof' + so.slot : (ent.name || ''),
            isFood: ent.kind === 'food', isVirus: ent.kind === 'virus', isEjected: ent.kind === 'ejected',
            isPlayerCell: own, isPlayerCellMulti: own && src > 0, removed: false, invisible: false, _ent: ent
        };
        ent.copies.set(src, c);
        if (c.isFood) { (src ? LM.foodMulti : LM.food).push(c); return c; }
        LM.cells.push(c);
        LM.indexedCells[c.id] = c;
        if (own && !src) LM.playerCells.push(c);
        else if (own) {
            so.unit.playerCellIDs.push(c.id);
            so.unit.getOwnPlayerCells().push(c); /* spect.js: the unit's own-cell index (_lmAdoptOwn) */
            LM.playerCellsMulti.push(c);
            if (!so.unit.active) so.unit.active = true; /* spect.js: its first own cell */
        }
        return c;
    }
    /* a copy leaves (removeCell: removed, out of the lists; the frame drops it from LM.cells) */
    function unobserve(ent, src) {
        const c = ent.copies.get(src);
        if (!c) return;
        ent.copies.delete(src);
        c.removed = true;
        delete LM.indexedCells[c.id];
        const drop = (k) => { const a = LM[k], i = a.indexOf(c); if (i >= 0) a.splice(i, 1); };
        if (c.isFood) drop(src ? 'foodMulti' : 'food');
        else if (c.isPlayerCellMulti) {
            drop('playerCellsMulti');
            const u = (ctx.spects || []).find((x) => x && x.number === src), own = u && u._lmOwn, i = own ? own.indexOf(c) : -1;
            if (i >= 0) own.splice(i, 1);
        }
        else if (c.isPlayerCell) drop('playerCells');
    }
    function entity(kind, o2, owner) {
        const ent = { key: nextKey++, kind, owner: owner === undefined ? null : owner, x: o2.x || 0, y: o2.y || 0, size: o2.size || 50,
            name: o2.name || '', seenBy: (o2.seenBy || s.playingSources()).slice(), copies: new Map(), gone: false };
        if (owner != null && ent.seenBy.indexOf(owner) < 0) ent.seenBy.unshift(owner);
        s.ents.push(ent);
        for (const src of ent.seenBy) observe(ent, src);
        return ent;
    }
    /* an own cell of the player in this slot (seen by its owner and seenBy) */
    s.own = (slot, o2) => {
        const p = s.player(slot);
        if (!p) throw new Error('mbplayers: no player in slot ' + slot);
        o2 = Object.assign({ name: 'P' + slot, seenBy: [] }, o2);
        return entity('own', o2, p.src);
    };
    s.enemy = (o2) => entity((o2 && o2.kind) || 'enemy', o2 || {});
    s.food = (o2) => entity('food', Object.assign({ size: 10 }, o2));
    s.gone = (ent) => { for (const src of [...ent.copies.keys()]) unobserve(ent, src); ent.gone = true; };
    s.unobserve = unobserve;
    /* a source sees again what it should see (new raw ids: after a reconnect or a respawn) */
    s.reobserve = (src) => { for (const e of s.ents) if (!e.gone && e.owner !== src && e.seenBy.indexOf(src) >= 0) observe(e, src); };
    const ownOf = (p) => s.ents.filter((e) => !e.gone && e.owner === p.src);

    /* the player dies: its cells go on every source; a unit runs spect.js terminate(), the main
     * player application.onPlayerDeath (switch to a living unit, the main socket's cells dropped) */
    s.kill = (slot) => {
        const p = s.player(slot);
        if (!p || !p.alive) return;
        for (const e of ownOf(p)) s.gone(e);
        p.alive = false;
        if (p.unit) { p.unit.playerCellIDs = []; if (p.unit._lmOwn) p.unit._lmOwn.length = 0; p.unit.terminate(); return; }
        LM.play = false;
        ctx.application.onPlayerDeath();
        /* the switch dropped the main socket's cells (it keeps adding none while a unit plays) */
        if (ctx.mainPlayerDeadMbActive) {
            p.observing = false;
            for (const e of s.ents) { const c = e.copies.get(0); if (c && LM.cells.indexOf(c) < 0) { e.copies.delete(0); delete LM.indexedCells[c.id]; } }
        }
    };
    /* a new life on the same socket: lifeGeneration + 1, new own cells (new raw ids); o.background:
     * the server spawned it on its own (auto-respawn after a death or reconnect), not respawn() */
    s.respawn = (slot, cells, o3) => {
        const p = s.player(slot);
        if (!p || p.alive) return;
        p.lifeGeneration++;
        p.alive = true;
        if (p.unit) { if (!(o3 && o3.background)) p.unit.respawn(); }
        else { LM.play = true; ctx.mainPlayerDeadMbActive = false; p.observing = true; s.reobserve(0); }
        (cells || [{}]).forEach((c, i) => s.own(slot, Object.assign({ x: slot * 900 + i * 150, y: 0, size: 60, seenBy: p.lastSeenBy || [] }, c)));
    };
    /* a new socket for a unit: socketGeneration + 1, its observations go (resetConnectionState
     * terminates a living unit), then it sees the world again; respawn: false leaves it dead */
    s.reconnect = (slot, o2) => {
        const p = s.player(slot);
        if (!p || !p.unit) throw new Error('mbplayers: only a unit reconnects (main socket loss is a server change)');
        const own = ownOf(p).map((e) => ({ x: e.x, y: e.y, size: e.size }));
        for (const e of s.ents) if (e.copies.has(p.src)) { if (e.owner === p.src) s.gone(e); else unobserve(e, p.src); }
        p.socketGeneration++;
        p.unit.connectionGeneration++;
        p.unit.playerCellIDs = [];
        if (p.unit._lmOwn) p.unit._lmOwn.length = 0;
        /* spect.js onclose: a dropped socket ends the life, no death */
        if (p.unit.active) p.unit.terminate('disconnect');
        p.alive = false;
        s.reobserve(p.src);
        if (!o2 || o2.respawn !== false) s.respawn(slot, own.length ? own : undefined, { background: true });
    };
    /* a unit closed for good: its observations and cells go, it leaves window.spects, the slot
     * stays empty (no renumbering) */
    s.remove = (slot) => {
        const p = s.player(slot);
        if (!p || !p.unit) throw new Error('mbplayers: only a unit is removed');
        for (const e of s.ents) if (e.copies.has(p.src)) { if (e.owner === p.src) s.gone(e); else unobserve(e, p.src); }
        for (const e of s.ents) { const i = e.seenBy.indexOf(p.src); if (i >= 0) e.seenBy.splice(i, 1); }
        if (p.unit.active) p.unit.terminate();
        const i = ctx.spects.indexOf(p.unit);
        if (i >= 0) ctx.spects.splice(i, 1);
        s.sources.delete(p.src);
        s.players[s.players.indexOf(p)] = null;
    };
    /* frames through the real code: each unit's beforecalculation, then the frame's hide step */
    s.step = (n) => {
        for (let f = 0; f < (n || 1); f++) {
            LM.time += 40;
            for (const u of ctx.spects.slice()) if (u && u.player) u.beforecalculation();
            ctx._lmFrame();
        }
        return s;
    };
    s.focus = () => +ctx.multiboxPlayerEnabled || 0;
    /* the player clicks into the menu (the death menu's capture listeners, spect.js terminate) */
    s.useMenu = () => { for (const l of listeners) if (l.type === 'mousedown') l.fn({ target: { closest: () => true } }); };
    /* the slot of the player in focus (1 = the main player) */
    s.focusSlot = () => ctx.lmMbPlayers.activeSlot;

    /* What the frame shows against what is there.
     * dup: entities drawn more than once; missing: entities with a listed copy on a feeding source
     * but drawn by none; hiddenOwn: own cells not drawn; wrongRep: drawn by another copy than the
     * rule (own cell: its owner's copy; else the main socket's; else the lowest source number; the
     * copy drawn last frame stays drawn, so this holds for a scene built before its first frame);
     * mass: per player own mass (main: LM.playerCells, units: spect.js playerMass from
     * calculatePlayerMassAndPosition and getOwnPlayerCells) against sum r^2 / 100 of its cells;
     * doubleOwned: a cell in two players' own lists or in the wrong one's; food: copies listed per
     * source and pellets the hide step touched. */
    s.audit = () => {
        const listed = new Set(LM.cells.filter((c) => c && !c.removed));
        const r = { dup: [], missing: [], hiddenOwn: [], wrongRep: [], mass: [], massErr: [], doubleOwned: [], food: [], drawn: 0 };
        for (const e of s.ents) {
            if (e.gone || e.kind === 'food') continue;
            const copies = [...e.copies.values()].filter((c) => listed.has(c));
            const vis = copies.filter((c) => !c.invisible);
            r.drawn += vis.length;
            if (vis.length > 1) r.dup.push(e.kind + e.key + ' x' + vis.length + ' (' + vis.map((c) => c._lmSrc).join(',') + ')');
            if (!vis.length && copies.length) r.missing.push(e.kind + e.key + ' (' + copies.map((c) => c._lmSrc).join(',') + ')');
            if (e.owner != null) for (const c of copies) if (c._lmSrc === e.owner && c.invisible) r.hiddenOwn.push(e.kind + e.key + '@' + c._lmSrc);
            if (vis.length === 1 && copies.length > 1) {
                let want;
                if (e.owner != null && copies.some((c) => c._lmSrc === e.owner)) want = e.owner;
                else if (copies.some((c) => c._lmSrc === 0)) want = 0;
                else want = Math.min(...copies.map((c) => c._lmSrc));
                if (vis[0]._lmSrc !== want) r.wrongRep.push(e.kind + e.key + ' drawn by ' + vis[0]._lmSrc + ', rule ' + want);
            }
        }
        const owners = new Map();
        for (const p of s.players) {
            if (!p) continue;
            const want = ownOf(p).reduce((m, e) => m + e.size * e.size, 0);
            let list, got;
            if (p.unit) { list = p.unit.getOwnPlayerCells(); got = p.unit.playerMass || 0; }
            else { list = LM.playerCells.filter((c) => c && !c.removed); got = ~~(list.reduce((m, c) => m + c.targetSize * c.targetSize, 0) / 100); }
            for (const c of list) {
                if (owners.has(c) || c._lmSrc !== p.src || c._ent.owner !== p.src) r.doubleOwned.push('cell ' + c.id + ' in P' + p.slot + (owners.has(c) ? ' and P' + owners.get(c) : ''));
                owners.set(c, p.slot);
            }
            const m = { slot: p.slot, src: p.src, got, want: ~~(want / 100), cells: list.length };
            r.mass.push(m);
            if (m.got !== m.want) r.massErr.push('P' + p.slot + ' (source ' + p.src + ') mass ' + m.got + ', its cells ' + m.want);
        }
        for (const so of s.sources.values()) {
            const lst = so.src ? LM.foodMulti.filter((c) => c._lmSrc === so.src) : LM.food;
            const want = s.ents.filter((e) => !e.gone && e.kind === 'food' && e.copies.has(so.src)).length;
            if (lst.length !== want || lst.some((c) => c.invisible || c._lmMbPosDup)) r.food.push('source ' + so.src + ': ' + lst.length + ' pellets listed, ' + want + ' seen');
        }
        r.ok = !r.dup.length && !r.missing.length && !r.hiddenOwn.length && !r.wrongRep.length && !r.massErr.length && !r.doubleOwned.length && !r.food.length;
        r.text = ['dup', 'missing', 'hiddenOwn', 'wrongRep', 'massErr', 'doubleOwned', 'food'].filter((k) => r[k].length).map((k) => k + ': ' + r[k].join('; ')).join(' | ');
        return r;
    };
    return s;
}

/* The standard layout: per player two own cells (the first seen by every source, the second by
 * the main socket, the next player and the first tile), six shared enemies (named and unnamed) seen by every source, a shared virus, an
 * ejected blob seen by two, an enemy only the last unit sees, one only the Full Map tiles see,
 * and four pellets every source sees. */
function populate(s) {
    const play = s.playingSources(), all = s.allSources(), tiles = s.tiles.map((t) => t.src);
    for (const p of s.players) {
        const next = play[(play.indexOf(p.src) + 1) % play.length];
        const seen = [0, next].filter((src, i, a) => src !== p.src && a.indexOf(src) === i).concat(tiles.slice(0, 1));
        p.lastSeenBy = seen;
        s.own(p.slot, { x: p.slot * 900, y: 0, size: 60, seenBy: all });
        s.own(p.slot, { x: p.slot * 900 + 150, y: 0, size: 45, seenBy: seen });
    }
    for (let i = 0; i < 6; i++) s.enemy({ x: i * 700, y: 1500, size: 50 + i * 10, name: i % 2 ? 'e' + i : '', seenBy: all });
    s.enemy({ kind: 'virus', x: 0, y: 2500, size: 100, seenBy: all });
    s.enemy({ kind: 'ejected', x: 700, y: 2500, size: 38, seenBy: all.slice(0, 2) });
    s.enemy({ x: 1400, y: 2500, size: 80, name: 'far', seenBy: [play[play.length - 1]] });
    if (tiles.length) s.enemy({ x: 2100, y: 2500, size: 90, seenBy: tiles });
    for (let i = 0; i < 4; i++) s.food({ x: 3000 + i * 40, y: 3000, seenBy: all });
    return s;
}

/* A check that today's code is known to fail (known: 'KNOWN N>2: what fails, why, file:line'):
 * printed as known, not counted; once it passes it fails, so the label is taken off. */
function verdict(check, name, ok, info, known) {
    if (!known) return check(name, ok, info);
    if (ok) return check(name + ' (listed as known, passes now: take it off the list)', false, known);
    console.log('known ' + name + '  [' + known + ']' + (info === undefined || info === '' ? '' : '  [' + info + ']'));
}

module.exports = { verdict, load, scene, populate, block, PLAYER_IDS, TILE_IDS, MAX_PLAYERS, toWorld, toRaw };
