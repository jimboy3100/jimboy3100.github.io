/* Multibox with the main player dead or paused, with the real code cut out of ogario/ogario.v4.js
 * (updateCells death handling, onPlayerDeath's switch, multiboxchange / multiboxswap, LM.sendPosition,
 * the main socket's opcode 17, getMultiboxFrame) and ogario/spect.js (respawn).
 * - The main player dies while the unit is dead too: the death menu, no spawn of the dead unit
 *   (multiboxswap hid the menu and spawned it, also with "Background auto-respawn" off).
 * - Pause with the focus on the unit: the main player holds too (it kept its keep-moving offset).
 * - Opcode 17 with no multibox frame (both players dead, spectating, "View on middle of both"):
 *   the camera follows the server's view (it stayed frozen).
 * - A unit that dies and respawns on the same socket while the main player is dead takes the
 *   focus again (terminate, beforecalculation) and hides the death menu shown when it died (not one the player uses or opened
 *   by hand, and the auto-respawn's delayed menu is cancelled); with the main player alive it
 *   does not. A dead unit's score, mass and split / eat numbers are 0, the next life shows its own score.
 * - The whole spect.js: a unit's split / eat numbers equal the main player's (recalculatePlayerMass)
 *   for one mass; the opcode 87 token is sent only on the socket that asked (not after a reconnect).
 * - 1 to 6 playing clients x Full Map off / on (lib/mbplayers.js): deaths, focus, switch keys,
 *   profiles, enabling, Add Player (section 5); the player calls (enable, add, remove, select) against
 *   the Multibox 2.0 cases: six at most with the slot being made, remove / reuse a slot, stale epochs,
 *   the login slot, P1 dying while P4 plays, a reconnect while P5 plays, the last death's menu (5b);
 *   a player chosen while a unit's first spawn is held (spect.js _lmSpawnHold) keeps the focus when
 *   it goes through, with no choice the unit takes it (5b); a hold that ran out unverified gives
 *   no focus until the place is known; an extra player of Add Player never takes it at its spawn.
 * - "Auto-switch focus after death" on: the next living player after the dead one in slot order
 *   (P1 included), off: the death moves no focus; a removed / disconnected one still hands it on;
 *   the death menu only when nothing of ours lives, whatever the setting (sections 1 and 5b).
 *   lmMbPlayers.attach refuses a slot taken, a stale slotEpoch, a source registered; addBox's refusals
 *   (six players, a unit being made, attach refusing the unit made, a server change meanwhile) give
 *   null and leave the registry as it was; a Spect constructor that throws rolls the reservation back.
 * - A spectator with its active flag set is no living player (lmMbAlive): never focused, and the
 *   last unit's death still shows the menu.
 * - The input state at the end of a life (section 9): the controlled unit's death, lost socket,
 *   removal, Multibox off or a server change ends its Pause, permanent feed, aim lock and phone
 *   Feed, nothing reaches the next player; a background player's end leaves them.
 * node developers/tests/mbdeath.js [ogario.v4.js] [spect.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const v4 = read(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'));
const sp = read(process.argv[3] || path.join(root, 'ogario', 'spect.js'));
let failed = 0;
/* the unit chosen that waits to take the focus (lmMbPendingUnit); 'none' in a file without it */
const pendOf = (c) => (typeof c.lmMbPendingUnit === 'function' ? c.lmMbPendingUnit() : 'none');
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
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
const noop = () => { };
/* "Inactive players" (mbInactive): the one rule of the inactive main player and units */
const inactiveRule = block(v4, 'function lmMbInactiveMoves() {');
if (!inactiveRule) { console.log('FAIL lmMbInactiveMoves not found'); process.exit(1); }

/* 1. death of the main player: updateCells (all other servers) after onPlayerDeath's switch */
const a = v4.indexOf('/* LMEvents: hooks'), b = v4.indexOf('window.OgVer', a);
const respawn = ['    respawn() {', '    _lmSpawnReady() {', '    _lmSpawn(kind) {', '    _lmPendBound() {', '    _lmCancelAutoResp() {'].map((m) => block(sp, m)).join('\n');
const appMethods = ['        multiboxchange() {', '        multiboxswap() {'].map((m) => block(v4, m));
const deathSwitch = block(v4, "if ((defaultmapsettings.mbSwitchAfterDeath || (typeof lmMbSteersLiving === 'function' && lmMbSteersLiving())) && typeof spects !== 'undefined' && spects && spects.length > 0) {");
const k = v4.indexOf('ALL OTHER SERVERS');
const ucElse = k < 0 ? null : block(v4, 'else {', k);
const idxFilter = block(v4, '    function lmIdxFilter(');
if (a < 0 || b < 0 || !respawn || appMethods.some((m) => !m) || !deathSwitch || !ucElse || !idxFilter) { console.log('FAIL code not found'); process.exit(1); }
function death(o) {
    const ctx = { console: { log: noop, warn: noop }, toastr: {}, Date, menuShown: 0, menuHidden: 0, respawns: 0 };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(v4.slice(a, b), ctx);
    vm.runInContext('window.Unit = class Unit { constructor(n) { this.number = n; this.player = true; this.active = true; this.connectionOpened = true; }\n' +
        'isSocketOpen() { return true; }\nhandleSendNick() { window.respawns++; }\n' + respawn + '\n}\n' +
        'var defaultmapsettings = window.defaultmapsettings = { mbSwitchAfterDeath: true, mbAutoRespawn: false };\n' +
        'var application = window.application = { hideMenu() { window.menuHidden++; }, showMenu() { window.menuShown++; }, mbSlots: [0, 1], selectedOldProfile: 0,\n' +
        'onPlayerDeath() {\n' + deathSwitch + '\n},\n' + appMethods.join(',\n') + '};\n' +
        'function lmIdxClear(a) { return []; }\n' + idxFilter + '\n' +
        'var legendmod = window.legendmod = { play: true, multiBoxPlayerExists: true, playerCells: [], cells: [], food: [], viruses: [], removedCells: [], indexedCells: {} }, LM = legendmod;\n' +
        'var profiles = [], ogarcopythelb = {}; function play() { legendmod.play = true; }\n' +
        'window.mainDies = function () { legendmod.play = false; ' + ucElse.slice(4) + ' };', ctx);
    const u = new ctx.Unit(1); u.active = o.unitAlive;
    ctx.spects.length = 0; ctx.spects.push(u);
    ctx.multiboxPlayerEnabled = o.focus || null;
    /* o.switchOff: Settings "Auto-switch focus after death" off */
    if (o.switchOff) ctx.defaultmapsettings.mbSwitchAfterDeath = false;
    if (o.removed) { o.removed.forEach((c, i) => { c._removedIdx = i; }); ctx.legendmod.removedCells = o.removed; }
    ctx.mainDies();
    return ctx;
}
{
    const c = death({ unitAlive: false });
    check('main dies, the unit is dead: the death menu, no focus, the dead unit is not spawned',
        c.menuShown === 1 && c.menuHidden === 0 && !c.multiboxPlayerEnabled && c.respawns === 0,
        'menu ' + c.menuShown + '/' + c.menuHidden + ' focus=' + c.multiboxPlayerEnabled + ' spawns=' + c.respawns);
    const r = death({ unitAlive: true });
    check('main dies, the unit lives: the focus goes to it, no menu', r.menuShown === 0 && r.multiboxPlayerEnabled === 1 && r.respawns === 0,
        'menu ' + r.menuShown + ' focus=' + r.multiboxPlayerEnabled);
    /* "Auto-switch focus after death" off: the death alone moves no focus, and the session goes on
     * while the unit lives (the menu opened over it); with nothing alive the menu as before */
    const off = death({ unitAlive: true, switchOff: true });
    check('switch after death off, main dies while the unit lives: the focus stays on the dead main player, no menu (the unit plays on)',
        off.menuShown === 0 && !off.multiboxPlayerEnabled && off.respawns === 0, 'menu ' + off.menuShown + ' focus=' + off.multiboxPlayerEnabled);
    const offDead = death({ unitAlive: false, switchOff: true });
    check('    ... the unit dead too: the death menu, no focus moved', offDead.menuShown === 1 && !offDead.multiboxPlayerEnabled && offDead.respawns === 0,
        'menu ' + offDead.menuShown + ' focus=' + offDead.multiboxPlayerEnabled);
    const offBg = death({ unitAlive: true, switchOff: true, focus: 1 });
    check('    ... main dies in the background (the living unit in focus): the focus stays on the unit, no menu, the dead main view flushed as with the setting on',
        offBg.menuShown === 0 && offBg.multiboxPlayerEnabled === 1 && offBg.mainPlayerDeadMbActive === true,
        'menu ' + offBg.menuShown + ' focus=' + offBg.multiboxPlayerEnabled + ' flushed=' + offBg.mainPlayerDeadMbActive);
    /* fading removed cells: the main connection's go, the unit's stay with their new slots
     * (the frame drops a hidden one only when its slot is right) */
    const rm = [{ spectator: 0 }, { spectator: 1 }, { spectator: 0 }, { spectator: 1 }];
    const d = death({ unitAlive: true, removed: rm.slice() });
    const kept = d.legendmod.removedCells;
    check('main dies, the unit lives: its fading cells stay listed with their slots, the main ones leave the list',
        kept.length === 2 && kept.every((c, i) => c.spectator === 1 && c._removedIdx === i) && rm[0]._removedIdx === -1 && rm[2]._removedIdx === -1,
        kept.map((c) => c._removedIdx).join(',') + ' / ' + rm.map((c) => c._removedIdx).join(','));
    /* the other death checks (Senpa, Garix, Sigmally, Expanding Land): each death menu after
     * onPlayerDeath is gated by lmMbDeathMenuDue (nothing of ours alive), none by the focus or the
     * "Auto-switch focus after death" setting (Garix and Senpa always opened it with the setting off) */
    const calls = [];
    for (let i = v4.indexOf('onPlayerDeath();'); i >= 0; i = v4.indexOf('onPlayerDeath();', i + 1)) {
        const m = v4.indexOf('showMenu(', i);
        if (m > 0 && m - i < 1500 && v4.slice(i, m).indexOf('onPlayerDeath();', 1) < 0) calls.push(v4.slice(i, m));
    }
    const elA = v4.indexOf('Auto-respawn owns the screen when enabled.'), elB = v4.indexOf('SHOW THE LM DEATH SCREEN DIRECTLY', elA);
    check('every death menu after onPlayerDeath (' + calls.length + ' callers + Expanding Land) waits for nothing of ours alive (lmMbDeathMenuDue)',
        calls.length >= 3 && calls.every((c) => c.indexOf('lmMbDeathMenuDue()') >= 0 && c.indexOf('multiboxPlayerEnabled') < 0) &&
        elA > 0 && elB > elA && v4.slice(elA, elB).indexOf('lmMbDeathMenuDue()') >= 0, calls.map((c) => c.indexOf('lmMbDeathMenuDue()') >= 0 ? 1 : 0).join(''));
}

/* 2. Pause: LM.sendPosition with the focus on the main player or on the unit */
{
    const head = '        sendPosition(cell, target2, specialcommand, periodic) {';
    const st = v4.indexOf(head);
    const mm = st < 0 ? null : /\n        [A-Za-z_$][\w$]*\([^)]*\) \{\n/.exec(v4.slice(st + head.length));
    if (!mm) { console.log('FAIL sendPosition not found'); process.exit(1); }
    const m = v4.slice(st, st + head.length + mm.index).trim().replace(/,\s*$/, '');
    const sendFor = (focus, pause, inactive) => {
        const ctx = { console: { log: noop }, Date };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext('var defaultmapsettings = { mbInactive: ' + JSON.stringify(inactive || 'move') + ' };\n' + inactiveRule + '\n' +
            'var sent = window.sent = []; window.userBots = {};\n' +
            'var LM = window.legendmod = { ' + m + ',\n' +
            ' isSocketOpen() { return true; }, connectionOpened: true, clientKey: 1, integrity: false, vector: [[0, 0]], vnr: 0, serverType: "garix", play: true, pause: ' + pause + ',\n' +
            ' createView(n) { return new DataView(new ArrayBuffer(n)); }, sendBuffer(v) { sent.push(v.getInt32(3, true) + "," + v.getInt32(7, true)); },\n' +
            ' playerX: 1000, playerY: 1000, viewXTrue: 1000, viewYTrue: 1000, targetX: 1000, targetY: 1000, cursorX: 4000, cursorY: 1000, distX: 3000, distY: 0 };\n' +
            'var legendmod = LM;', ctx);
        ctx.multiboxPlayerEnabled = focus;
        ctx.legendmod.sendPosition();
        return ctx.sent[0];
    };
    check('Pause, focus on the main player: it holds', sendFor(null, true) === '1000,1000', sendFor(null, true));
    check('Pause, focus on the unit: the main player holds too (kept running)', sendFor(1, true) === '1000,1000', sendFor(1, true));
    check('no Pause, focus on the unit: the main player keeps moving (Inactive players: Keep moving)', sendFor(1, false) === '4000,1000', sendFor(1, false));
    check('no Pause, focus on the unit: the main player holds at the view centre (Inactive players: Stay still)', sendFor(1, false, 'stay') === '1000,1000', sendFor(1, false, 'stay'));
    check('Pause with Keep moving or Stay still: the inactive main player holds', sendFor(1, true, 'move') === '1000,1000' && sendFor(1, true, 'stay') === '1000,1000');
    check('focus on the main player: it follows the cursor with either choice', sendFor(null, false, 'move') === sendFor(null, false, 'stay') && sendFor(null, false, 'stay') !== '1000,1000', sendFor(null, false, 'stay'));
}

/* 2b. the same feed / split with the same settings: the selected unit (spect.js sendEject, sendSplit,
 *     the atomic double / triple / quad split) aims as the main player (LM.sendEject / sendSplit /
 *     sendDoubleSplit... through LM.sendPosition): Limit position (followStraight), dance, a crazy
 *     split's held position (lockPosition). The unit's feed and atomic splits sent the raw cursor.
 *     And the inactive player with "Freeze inactive" and "Keep moving" both off: the unit holds at
 *     its centre like the main player (it sent nothing and ran on to the last target). */
{
    const lmMethod = (head) => {
        const st = v4.indexOf(head);
        const mm = st < 0 ? null : /\n        [A-Za-z_$][\w$]*\([^)]*\) \{\n/.exec(v4.slice(st + head.length));
        return mm ? v4.slice(st, st + head.length + mm.index).trim().replace(/,\s*$/, '') : null;
    };
    const mainM = ['        sendPosition(cell, target2, specialcommand, periodic) {', '        sendEject() {', '        sendSplit() {', '        sendDoubleSplit() {',
        '        sendTripleSplit() {', '        sendQuadSplit() {'].map(lmMethod);
    const unitM = ['    sendCursor() {', '    _lmAimSend() {', '    _lmKeepAim(rx, ry) {', '    _lmCentreOk() {', '    _lmEmitSplit(count) {', '    _lmAimTarget() {', '    sendEject() {', '    sendSplit() {', '    _usesMultiSplitOpcodes() {',
        '    sendDoubleSplit() {', '    sendTripleSplit() {', '    sendQuadSplit() {'].map((m) => block(sp, m));
    if (mainM.concat(unitM).some((m) => !m)) check('feed / split aim code found', false);
    else {
        const env = (o) => {
            const ctx = { console: { log: noop }, Date: { now: () => 1000 }, Math, Number };
            ctx.window = ctx;
            vm.createContext(ctx);
            vm.runInContext('var defaultmapsettings = { mbInactive: ' + JSON.stringify(o.keep === false ? 'stay' : 'move') + ' };\n' + inactiveRule + '\n' +
                'var sent = window.sent = []; window.userBots = {}; window.LMEvents = { _has() { return false; } };\n' +
                'var LM = window.legendmod = { ' + mainM.join(',\n') + ',\n' +
                ' isSocketOpen() { return true; }, connectionOpened: true, clientKey: 1, integrity: false, vector: [[0, 0]], vnr: 0, serverType: "' + o.server + '", play: true, pause: false,\n' +
                ' createView(n) { return new DataView(new ArrayBuffer(n)); }, sendBuffer(v) { sent.push(v.getInt32(3, true) + "," + v.getInt32(7, true)); }, sendAction(a) { sent.push("op" + a); },\n' +
                ' sendMessage(v) { sent.push(v.getInt32(1, true) + "," + v.getInt32(5, true)); }, protocolKey: 0,\n' +
                ' playerX: 1000, playerY: 1000, viewXTrue: 1000, viewYTrue: 1000, targetX: 1000, targetY: 1000, cursorX: 4000, cursorY: 1300, distX: 0, distY: 0, dance: false };\n' +
                'var legendmod = LM;\n' +
                'window.Unit = class Unit { constructor() { this.number = 2; this.player = true; this.active = true; this.playerX = 1000; this.playerY = 1000; }\n' +
                'convertX(x) { return x; } convertY(y) { return y; } rawToWorldX(x) { return x; } rawToWorldY(y) { return y; } worldToRawX(x) { return x; } worldToRawY(y) { return y; }\n' +
                'sendPosition(x, y) { sent.push(Math.round(x) + "," + Math.round(y)); return true; } sendAction(a) { sent.push("op" + a); } getOwnPlayerCells() { return []; }\n' +
                unitM.join('\n') + '\n};', ctx);
            ctx.followStraight = !!o.straight; ctx.legendmod.dance = !!o.dance; ctx.lockPosition = !!o.lock;
            return ctx;
        };
        const mainSeq = (o, m) => { const ctx = env(o); ctx.multiboxPlayerEnabled = null; ctx.legendmod[m](); return ctx.sent.join(' '); };
        const unitSeq = (o, m) => { const ctx = env(o); ctx.multiboxPlayerEnabled = 2; new ctx.Unit()[m](); return ctx.sent.join(' '); };
        const cases = [['plain', {}], ['Limit position', { straight: true }], ['dance', { dance: true }], ['crazy split hold', { lock: true }]];
        for (const [name, o] of cases) {
            for (const [m, server] of [['sendEject', 'garix'], ['sendSplit', 'garix'], ['sendDoubleSplit', 'imsolo'], ['sendTripleSplit', 'agar2'], ['sendQuadSplit', 'private']]) {
                const so = Object.assign({ server }, o), mm = mainSeq(so, m), uu = unitSeq(so, m);
                check('unit ' + m + ' (' + server + ', ' + name + '): same aim and opcode as the main player [' + mm + ']', mm === uu && mm.length > 0, 'main ' + mm + ' / unit ' + uu);
            }
        }
        /* a unit's split sends LMEvents 'split' with its number */
        {
            const ctx = env({ server: 'garix' }), got = [];
            ctx.LMEvents = { _has: () => true, emit: (n, d) => got.push(n + ':' + d.count + ':' + d.unit) };
            ctx.multiboxPlayerEnabled = 2;
            const u = new ctx.Unit();
            u.sendSplit(); u.sendQuadSplit();
            check('unit split: LMEvents split with unit (one per split, one for an atomic quad split)', got.join() === 'split:1:2,split:4:2', got.join());
        }
        /* "Inactive players" Stay still: the inactive unit holds its centre (the inactive main player holds the view centre) */
        {
            const ctx = env({ server: 'garix', keep: false });
            let tick = null;
            ctx.setInterval = (f) => { tick = f; return 1; };
            ctx.clearInterval = noop;
            ctx.multiboxPlayerEnabled = null;
            const u = new ctx.Unit();
            u.sendCursor(); tick();
            check('inactive unit, Inactive players: Stay still: holds at its centre', ctx.sent.join() === '1000,1000', ctx.sent.join());
            ctx.sent.length = 0;
            ctx.multiboxPlayerEnabled = 2;
            ctx.legendmod.sendPosition();
            check('inactive main player, Stay still: holds at the view centre (unchanged)', ctx.sent.join() === '1000,1000', ctx.sent.join());
        }
        /* each choice for the unit: controlled it learns its offset to the cursor (+3000, +300); left
         * alone it runs on by it (Keep moving) or holds (Stay still); a change applies at the next tick */
        {
            const ctx = env({ server: 'garix', keep: true });
            let tick = null;
            ctx.setInterval = (f) => { tick = f; return 1; };
            ctx.clearInterval = noop;
            const u = new ctx.Unit();
            ctx.multiboxPlayerEnabled = 2;
            u.sendCursor(); tick();
            ctx.multiboxPlayerEnabled = null;
            ctx.sent.length = 0; tick();
            check('inactive unit, Inactive players: Keep moving: runs on toward where the cursor was', ctx.sent.join() === '4000,1300', ctx.sent.join());
            ctx.defaultmapsettings.mbInactive = 'stay';
            ctx.sent.length = 0; tick();
            check('    ... switched to Stay still: holds at its centre at the next tick (live)', ctx.sent.join() === '1000,1000', ctx.sent.join());
            ctx.defaultmapsettings.mbInactive = 'move';
            ctx.sent.length = 0; tick();
            check('    ... back to Keep moving: runs on again by the same offset', ctx.sent.join() === '4000,1300', ctx.sent.join());
            u.playerX = NaN;
            ctx.defaultmapsettings.mbInactive = 'stay';
            ctx.sent.length = 0; tick();
            check('    ... Stay still before the unit has a centre: nothing is sent', ctx.sent.length === 0, ctx.sent.join());
            ctx.defaultmapsettings.mbInactive = 'move';
            ctx.sent.length = 0; tick();
            check('    ... Keep moving before the unit has a centre: nothing is sent either (no NaN / (0, 0) target)', ctx.sent.length === 0, ctx.sent.join());
        }
        /* Keep moving runs on where the player was going: the aim that went out while controlled
         * (Limit position: right, +50000; dance at Date.now 1000: up-right), not the raw cursor
         * (+3000, +300); a crazy split's held position sends nothing and leaves the offset; a unit
         * never controlled (no offset yet) holds at its centre. Main player and unit alike. */
        {
            const unitKeep = (o, between) => {
                const ctx = env(Object.assign({ server: 'garix', keep: true }, o));
                let tick = null;
                ctx.setInterval = (f) => { tick = f; return 1; };
                ctx.clearInterval = noop;
                const u = new ctx.Unit();
                ctx.multiboxPlayerEnabled = 2;
                u.sendCursor(); tick();
                if (between) between(ctx, u, tick);
                const active = ctx.sent.join(' ');
                ctx.multiboxPlayerEnabled = null;
                ctx.sent.length = 0; tick();
                return [active, ctx.sent.join(' ')];
            };
            const ls = unitKeep({ straight: true }), dn = unitKeep({ dance: true });
            check('inactive unit, Keep moving after Limit position: runs on along the line it sent (51000,1000), not toward the cursor (4000,1300)',
                ls[0] === '51000,1000' && ls[1] === '51000,1000', ls.join(' | '));
            check('inactive unit, Keep moving after dance: runs on in the last direction it sent (51000,-49000)', dn[0] === '51000,-49000' && dn[1] === '51000,-49000', dn.join(' | '));
            /* controlled with a plain cursor (+3000, +300), then a crazy split holds the position while the cursor moves */
            const lk = unitKeep({}, (ctx, u, tick) => { ctx.lockPosition = true; ctx.legendmod.cursorX = 1000; ctx.legendmod.cursorY = 5000; tick(); ctx.lockPosition = false; });
            check('inactive unit, Keep moving after a held position (lockPosition): nothing sent while held, the offset from the last sent aim stays (4000,1300, not 1000,5000)',
                lk[0] === '4000,1300' && lk[1] === '4000,1300', lk.join(' | '));
            /* a unit that never was controlled: no offset yet */
            const ctx = env({ server: 'garix', keep: true });
            let tick = null;
            ctx.setInterval = (f) => { tick = f; return 1; };
            ctx.clearInterval = noop;
            ctx.multiboxPlayerEnabled = null;
            new ctx.Unit().sendCursor(); tick();
            check('inactive unit never controlled, Keep moving: holds at its centre (sent nothing: a NaN target)', ctx.sent.join() === '1000,1000', ctx.sent.join());

            const mainKeep = (o, between) => {
                const ctx = env(Object.assign({ server: 'garix', keep: true }, o));
                ctx.multiboxPlayerEnabled = null;
                ctx.legendmod.sendPosition();
                if (between) between(ctx);
                const active = ctx.sent.join(' ');
                ctx.multiboxPlayerEnabled = 2;
                ctx.followStraight = false; ctx.legendmod.dance = false;
                ctx.sent.length = 0; ctx.legendmod.sendPosition();
                return [active, ctx.sent.join(' ')];
            };
            const mls = mainKeep({ straight: true }), mdn = mainKeep({ dance: true });
            check('inactive main player, Keep moving after Limit position: runs on along the line it sent (51000,1000; kept the offset from before, 1000,1000)',
                mls[0] === '51000,1000' && mls[1] === '51000,1000', mls.join(' | '));
            check('inactive main player, Keep moving after dance: the last direction it sent', mdn[0] === '51000,-49000' && mdn[1] === '51000,-49000', mdn.join(' | '));
            const mlk = mainKeep({}, (ctx) => { ctx.lockPosition = true; ctx.legendmod.cursorX = 1000; ctx.legendmod.cursorY = 5000; ctx.legendmod.sendPosition(); ctx.lockPosition = false; });
            check('inactive main player after a held position: nothing sent while held, the offset from the last sent aim stays', mlk[0] === '4000,1300' && mlk[1] === '4000,1300', mlk.join(' | '));
            const mps = mainKeep({}, (ctx) => { ctx.legendmod.pause = true; ctx.legendmod.sendPosition(); ctx.legendmod.pause = false; });
            check('inactive main player after Pause (its hold 1000,1000 went out): runs on by the direction from before the pause, as a unit does',
                mps[0] === '4000,1300 1000,1000' && mps[1] === '4000,1300', mps.join(' | '));
            const nv = env({ server: 'garix', keep: true });
            nv.legendmod.viewXTrue = undefined; nv.legendmod.viewYTrue = undefined;
            nv.multiboxPlayerEnabled = 2;
            const nvRet = nv.legendmod.sendPosition();
            check('inactive main player with no view centre yet: nothing is sent (NaN went out as 0,0)', nv.sent.length === 0 && nvRet === false, nv.sent.join());
        }
    }
}

/* 3. the main socket's opcode 17 while no multibox frame drives the camera */
{
    const i0 = v4.indexOf('window.testobjectsOpcode17 = data;');
    const caseStart = v4.lastIndexOf('case 17:', i0), caseEnd = v4.indexOf('break;', v4.indexOf('this.scale = data.getFloat32(s, true);', i0));
    const frame = block(v4, '        getMultiboxFrame(mainSize) {');
    /* the camera helpers the frame uses (lmMbEachPlayer, lmMbCameraBox, ...) */
    const camA = v4.indexOf('var LM_MB_CAMERA_NEAR = '), camHelpers = v4.slice(camA, v4.indexOf('/* OgVer set above', camA));
    if (i0 < 0 || caseStart < 0 || caseEnd < 0 || !frame) { console.log('FAIL opcode 17 not found'); process.exit(1); }
    const body = 'do {' + v4.slice(v4.indexOf(':', caseStart) + 1, caseEnd) + '} while (0);';
    const view = (middle, focus, framed) => {
        const ctx = { console: { log: noop, warn: noop }, Date };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext('var defaultmapsettings = { middleMultiView: ' + middle + ' };\n' +
            'var legendmod = window.legendmod = { multiBoxPlayerExists: true, vector: [[0, 0]], vnr: 0, playerCells: [], viewX: 100, viewY: 100 }, LM = legendmod;\n' +
            'var spects = window.spects = [{ number: 1, player: true, playerCellIDs: [], getOwnPlayerCells() { return []; } }];\n' +
            'function getActiveSpect() { return null; }\n' + camHelpers + '\nvar drawRender = { ' + frame + ' };\n' +
            'window.op17 = function (x, y) { var data = new DataView(new ArrayBuffer(13)); data.setFloat32(1, x, true); data.setFloat32(5, y, true); data.setFloat32(9, 0.4, true); var s = 1;\n' +
            body + '\n}.bind(legendmod);', ctx);
        ctx.multiboxPlayerEnabled = focus;
        /* what drawRender.setView stores for the frame it computed */
        ctx.legendmod._lmMbFramed = framed === undefined ? !!vm.runInContext('drawRender.getMultiboxFrame(32)', ctx) : framed;
        ctx.op17(5000, -3000);
        return ctx.legendmod.viewX + ',' + ctx.legendmod.viewY;
    };
    check('both dead, spectating: the camera follows the server', view(false, null) === '5000,-3000', view(false, null));
    check('both dead, spectating, "View on middle of both": the camera follows the server (was frozen)', view(true, null) === '5000,-3000', view(true, null));
    check('focus on a respawning unit, main dead: the camera follows the server (was frozen)', view(false, 1) === '5000,-3000', view(false, 1));
    check('a multibox frame drives the camera: opcode 17 leaves the view centre to it', view(true, 1, true) === '100,100', view(true, 1, true));
}

/* 4. a unit that dies and respawns on the same socket (spect.js terminate, beforecalculation,
 * calculatePlayerMassAndPosition, recalculatePlayerMass) */
{
    const term = block(sp, '    terminate(reason) {'), before = block(sp, '    beforecalculation() {');
    const calc = block(sp, '    calculatePlayerMassAndPosition(ownCells) {'), recalc = block(sp, '    recalculatePlayerMass(ownCells) {');
    if (!term || !before || !calc || !recalc) { console.log('FAIL terminate / beforecalculation / calculatePlayerMassAndPosition / recalculatePlayerMass not found'); process.exit(1); }
    /* o.use: the player uses the death menu (a key in the nick field) before the respawn; o.typing: the nick
     * field has the focus; o.esc: the unit died with the main player alive (no death menu), then the main
     * player died and the menu was opened by hand (Esc) */
    const life = (mainAlive, o) => {
        o = o || {};
        const listeners = [], cleared = [];
        const el = (inMenu) => ({ closest: (sel) => (inMenu && sel.indexOf('#overlays') >= 0 ? {} : null) });
        const doc = { activeElement: el(false), addEventListener: (type, fn) => listeners.push([type, fn]) };
        const ctx = { console: { log: noop, warn: noop }, toastr: {}, Date, Math, menuShown: 0, menuHidden: 0, document: doc, clearTimeout: (t) => cleared.push(t) };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext(v4.slice(a, b), ctx);
        vm.runInContext('window.Unit = class Unit { constructor(n) { this.number = n; this.player = true; this.active = true; this.cells = []; this.openSecond = false; this.playerScore = 0; }\n' +
            'getOwnPlayerCells() { return this.cells.slice(); }\n' + term + '\n' + before + '\n' + calc + '\n' + recalc + '\n}\n' +
            'var application = window.application = { showMenu() { window.menuShown++; }, hideMenu() { window.menuHidden++; } };\n' +
            'var defaultmapsettings = window.defaultmapsettings = { showStatsSTE: true, dominationRate: 4 / 3, dominatedRate: 3 / 4 };\n' +
            'var legendmod = window.legendmod = { play: ' + mainAlive + ', selectBiggestCell: false }, LM = legendmod;', ctx);
        const u = new ctx.Unit(1);
        const cells = (size, n) => Array.from({ length: n }, () => ({ size: size, targetSize: size, x: 0, y: 0 }));
        ctx.spects.length = 0; ctx.spects.push(u);
        ctx.multiboxPlayerEnabled = null;
        u.cells = cells(300, 3); u.beforecalculation();          /* first life: focus, 2700 mass */
        const first = +ctx.multiboxPlayerEnabled || 0, score1 = u.playerScore;
        if (o.esc) ctx.legendmod.play = true;
        u.cells = []; u.terminate();                             /* dies */
        if (o.esc) { ctx.legendmod.play = false; ctx.application.showMenu(); }
        const dead = +ctx.multiboxPlayerEnabled || 0, menuAtDeath = ctx.menuShown;
        const stats = [u.playerScore, u.playerMass, u.playerSize, u.playerMinMass, u.playerMaxMass, u.playerSplitCells, u.STE, u.MTE, u.BMTE, u.BSTE, u.TTE, u.PTE];
        const hiddenBefore = ctx.menuHidden;
        if (o.use) listeners.filter((l) => l[0] === 'keydown').forEach((l) => l[1]({ target: el(true) }));
        if (o.typing) doc.activeElement = el(true);
        /* the auto-respawn's delayed showMenu (application.showMenu) is pending */
        ctx.application._lmAutoRespMenuT = 77;
        u.active = true; u.cells = cells(40, 1); u.beforecalculation();  /* background auto-respawn, same socket: 16 mass */
        return {
            focus: [first, dead, +ctx.multiboxPlayerEnabled || 0].join(','), score1: score1, stats: stats.join(','), score2: u.playerScore,
            menu: [menuAtDeath, hiddenBefore, ctx.menuHidden].join(','),
            timer: (ctx.application._lmAutoRespMenuT === null && cleared.indexOf(77) >= 0) ? 'cleared' : 'pending'
        };
    };
    const dead = life(false), alive = life(true);
    check('main dead: a unit that respawns on its socket takes the focus again (mouse and keys went to the dead main)', dead.focus === '1,0,1', dead.focus);
    check('main alive: a background respawn of the unit does not take the focus', alive.focus === '1,0,0', alive.focus);
    check('a unit that dies: score, mass, sizes, cell count and split / eat numbers are 0 (kept the dead life\'s)',
        dead.score1 === 2700 && dead.stats === '0,0,0,0,0,0,0,0,0,0,0,0', dead.score1 + ' / ' + dead.stats);
    check('the next life shows only its own score (showed the best score of every life)', dead.score2 === 16 && alive.score2 === 16, dead.score2 + ',' + alive.score2);
    check('main dead: the death menu shown when the last unit died is hidden when the unit respawns and takes the focus',
        dead.menu === '1,0,1', 'shown at death, hidden before, hidden after the respawn = ' + dead.menu);
    check('main dead: hiding it also cancels the auto-respawn\'s delayed menu (it came back over the unit)', dead.timer === 'cleared', dead.timer);
    check('main alive: a background respawn does not touch the menu', alive.menu === '0,0,0' && alive.timer === 'pending', alive.menu + ' ' + alive.timer);
    const used = life(false, { use: true }), typing = life(false, { typing: true }), esc = life(false, { esc: true });
    check('main dead: the player used the death menu (a key in it) before the respawn: it stays up', used.menu === '1,0,0' && used.timer === 'pending', used.menu + ' ' + used.timer);
    check('main dead: the nick field has the focus at the respawn: the menu stays up', typing.menu === '1,0,0', typing.menu);
    check('main dead: a menu opened by hand (no death menu of the unit): the respawn leaves it up', esc.menu === '1,0,0' && esc.focus === '1,0,1', esc.menu + ' focus ' + esc.focus);
}

/* 5. the whole ogario/spect.js: the unit's split / eat numbers against the main player's
 * recalculatePlayerMass, and the opcode 87 (reCAPTCHA v3) answer after a reconnect */
{
    const rec = block(v4, '        recalculatePlayerMass() {');
    if (!rec) { console.log('FAIL recalculatePlayerMass not found'); process.exit(1); }
    const ctx = {
        console: { log: noop, warn: noop, error: noop }, Date, Math, JSON, Object, Array, Map, Set, Number, String, Boolean, Infinity, NaN, isFinite,
        setInterval: () => 1, clearInterval: noop, setTimeout: () => 1, clearTimeout: noop, toastr: { warning: noop, error: noop },
        WebSocket: { CONNECTING: 0, OPEN: 1 }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(v4.slice(a, b), ctx);
    vm.runInContext('var legendmod = window.legendmod = { play: false, multiBoxPlayerExists: true, playerCellsMulti: [], cells: [], foodMulti: [], viruses: [], indexedCells: {}, removedCells: [], selectBiggestCell: false };\n' +
        'var defaultmapsettings = window.defaultmapsettings = { dominationRate: 4 / 3, dominatedRate: 3 / 4, showStatsSTE: true };\n' +
        'var application = window.application = { showMenu() { }, hideMenu() { }, mbSlots: [0, 1], selectedOldProfile: 0 };\n' +
        'var profiles = [];\nfunction lmUnitCellId(id, n) { return id + n * 4294967296; }\n' + sp + '\nwindow.Spect = Spect;', ctx);
    const u = Object.create(ctx.Spect.prototype);
    u.number = 1; u.player = true; u.socket = null; u.connectionGeneration = 1; u.integrity = true;
    u.resetConnectionState();
    ctx.spects.push(u);
    const diffs = [];
    for (const mass of [100, 1000, 7777, 22500]) {
        const size = Math.sqrt(mass * 100);
        u.active = true; u.playerScore = 0;
        u.calculatePlayerMassAndPosition([{ size: size, targetSize: size, x: 0, y: 0, spectator: 1, removed: false }]);
        const m = vm.runInContext('(function(){ var o = { playerScore: 0, playerMass: ' + mass + ', _playerMinSize: ' + size + ', _playerMaxSize: ' + size + ', selectBiggestCell: false, playerCells: [1],\n' +
            rec.trim().replace(/^recalculatePlayerMass\(\)/, 'recalc: function ()') + '}; window.multiboxPlayerEnabled = null; o.recalc(); return o; })()', ctx);
        for (const k of ['STE', 'MTE', 'BMTE', 'BSTE', 'TTE', 'PTE']) if (u[k] !== m[k]) diffs.push(mass + ' ' + k + ' unit ' + u[k] + ' main ' + m[k]);
    }
    check('the unit\'s split / eat numbers equal the main player\'s for the same mass (STE, MTE used other rates)', !diffs.length, diffs.join('; '));

    /* Triple split range alone: the unit's smallest / biggest cell mass is kept up to date, as the
     * main player's (its guard had every setting but tripleSplitRange) */
    const dms = ctx.defaultmapsettings, keepDms = Object.assign({}, dms);
    dms.showStatsSTE = false; dms.tripleSplitRange = true;
    u.playerMinMass = u.playerMaxMass = 0;
    u.calculatePlayerMassAndPosition([{ size: 100, targetSize: 100, x: 0, y: 0, spectator: 1, removed: false },
        { size: 300, targetSize: 300, x: 10, y: 0, spectator: 1, removed: false }]);
    check('Triple split range alone: the unit\'s smallest and biggest cell mass are updated (stayed 0)',
        u.playerMinMass === 100 && u.playerMaxMass === 900 && u.playerSplitCells === 2, u.playerMinMass + ',' + u.playerMaxMass + ',' + u.playerSplitCells);
    delete dms.tripleSplitRange;
    Object.assign(dms, keepDms);

    /* a unit with no own cell any more (before terminate): its numbers are 0, not the last cells' */
    const nums = () => [u.playerMass, u.playerSize, u.playerMinMass, u.playerMaxMass, u.playerSplitCells, u.STE, u.MTE, u.BMTE, u.BSTE, u.TTE, u.PTE].join(',');
    const one = () => [{ size: 300, targetSize: 300, x: 0, y: 0, spectator: 1, removed: false }];
    u.calculatePlayerMassAndPosition(one());
    const had = u.playerMass;
    u.calculatePlayerMassAndPosition([]);
    const z1 = nums();
    u.calculatePlayerMassAndPosition(one());
    ctx.legendmod.playerCellsMulti = [];
    ctx.multiboxPlayerEnabled = null;
    u.beforecalculation();                                 /* a packet with no own cell in it */
    const z2 = nums();
    check('no own cell: mass, size, smallest / biggest, cell count and split / eat numbers are 0 (kept the last cells\')',
        had === 900 && z1 === '0,0,0,0,0,0,0,0,0,0,0' && z2 === z1, had + ' / ' + z1 + ' / ' + z2);

    /* opcode 87: the token answers the socket that asked, never a newer one */
    const sent = [];
    let answer = null;
    ctx.agarCaptcha = { requestCaptchaV3(action, cb) { answer = cb; } };
    u.sendMessage = () => sent.push(u.socket);
    const ask = () => { const v = new DataView(new ArrayBuffer(1)); v.setUint8(0, 87); u.handleMessage(v); };
    const s1 = { id: 1 }, s2 = { id: 2 };
    u.socket = s1; u.connectionGeneration = 5; ask(); answer('tok');
    const same = sent.length === 1 && sent[0] === s1;
    sent.length = 0;
    u.socket = s1; u.connectionGeneration = 5; ask();
    u.socket = s2; u.connectionGeneration = 6;            /* dropped and reconnected before reCAPTCHA answered */
    answer('tok');
    check('opcode 87: the token goes to the socket that asked', same, sent.length + ' sent');
    check('opcode 87: after a reconnect the late token is not sent on the new socket', sent.length === 0, sent.length + ' sent');
}

/* 6. 1 to 6 playing clients x Full Map off / on (lib/mbplayers.js: the main player and units 1, 2,
 * 18, 5, 9; Full Map tiles 3, 4, 20, 21), with the real onPlayerDeath switch, terminate,
 * beforecalculation, respawn, lmDeathScope, multiboxchange / multiboxback / ensureMbSlots:
 * - deaths one by one, the main player first, then always the controlled unit: the focus goes to a
 *   living player (never a Full Map tile), the death scope is 'unit' while another one lives, the
 *   death menu comes once, at the last death; the last unit's respawn takes the focus and hides
 *   that menu; after each, every cell is drawn once and each player's own mass is right.
 * - the switch keys visit every player once, in order, both ways; each unit plays its own profile.
 * - enabling multibox opens one controlled unit and keeps Full Map; K playing clients can be opened
 *   (Add Player), each in its own slot.
 * A configuration the code fails would be marked KNOWN with the reason (lib/mbplayers.js verdict); none is. */
{
    const MB = require('./lib/mbplayers');
    const opt = { v4: process.argv[2], sp: process.argv[3], app: true };
    const t0 = Date.now();
    for (let K = 1; K <= 6; K++) for (const fm of [false, true]) {
        const tag = 'K=' + K + ' (Full Map ' + (fm ? 'on' : 'off') + ')';
        const tiles = fm ? MB.TILE_IDS.length : 0;
        {
            const s = MB.scene(Object.assign({ players: K, fullMap: fm }, opt));
            MB.populate(s);
            s.step(2);
            const app = s.ctx.application, scope = s.ctx.lmDeathScope, bad = [];
            const note = (what, ok) => { if (!ok) bad.push(what); };
            const audit = (what) => { const r = s.audit(); note(what + ': ' + r.text, r.ok); };
            const living = () => s.players.filter((p) => p && p.alive && p.unit).map((p) => p.src);
            s.kill(1); s.step(1);
            if (K > 1) note('main died: focus ' + s.focus() + ', menu ' + app.menuShown + ', scope ' + scope(0),
                living().includes(s.focus()) && app.menuShown === 0 && app.autoResps === 0 && scope(0) === 'unit');
            else note('main died alone: ' + app.autoResps + ' auto-respawn, scope ' + scope(0), app.autoResps === 1 && s.focus() === 0 && scope(0) === 'all');
            audit('main died');
            let lastSlot = 0;
            while (living().length) {
                const src = s.focus(), p = s.players.find((q) => q && q.src === src && q.alive);
                if (!p) { note('focus ' + src + ' is on no living player', false); break; }
                s.kill(p.slot); s.step(1);
                lastSlot = p.slot;
                const left = living().length;
                note('P' + p.slot + ' died (' + left + ' left): focus ' + s.focus() + ', menu ' + app.menuShown + ', scope ' + scope(src), left
                    ? living().includes(s.focus()) && app.menuShown === 0 && scope(src) === 'unit'
                    : s.focus() === 0 && app.menuShown === 1 && scope(src) === 'all');
                audit('P' + p.slot + ' died');
            }
            if (lastSlot) {
                const hidden = app.menuHidden;
                s.respawn(lastSlot); s.step(1);
                note('P' + lastSlot + ' respawned: focus ' + s.focus() + ', menu hidden ' + (app.menuHidden - hidden),
                    s.focus() === s.player(lastSlot).src && app.menuHidden === hidden + 1 && app.menuShown === 1);
                audit('P' + lastSlot + ' respawned');
            }
            MB.verdict(check, tag + ': deaths one by one: the focus to a living player, one death menu at the last, the respawn takes the focus, cells and mass right',
                !bad.length, bad.join(' / '));
        }
        if (K < 2) continue;
        {
            const s = MB.scene(Object.assign({ players: K, fullMap: fm }, opt));
            MB.populate(s);
            s.step(1);
            const app = s.ctx.application;
            app.ensureMbSlots();
            s.ctx.lmSetMbUnit(0); /* each unit took the focus at its first spawn: start on the main player */
            const units = s.players.slice(1).map((p) => p.src), fwd = [], back = [];
            for (let i = 0; i < K; i++) { app.multiboxchange(); fwd.push(s.focus()); }
            const skins = app.preloaded.slice();
            for (let i = 0; i < K; i++) { app.multiboxback(); back.push(s.focus()); }
            check(tag + ': the switch keys visit every player once, in order, both ways',
                fwd.join() === units.concat([0]).join() && back.join() === units.slice().reverse().concat([0]).join(), fwd + ' / ' + back);
            /* the unit's skin is loaded by its link only, never stored under its nick (that replaced the
             * main player's skin when both have the nick) */
            check(tag + ': each unit plays its own profile (its slot\'s), its skin loaded by its link only', skins.length === K - 1 && new Set(skins).size === skins.length &&
                !skins.includes('skin0') && skins.every((u, i) => u === 'skin' + (i + 1)) && !app.skins.length, skins.join(',') + ' / nick ' + app.skins.join(','));
        }
        {
            const s = MB.scene(Object.assign({ players: 1, fullMap: fm }, opt));
            const app = s.ctx.application, units = () => s.ctx.spects.filter((u) => u && u.player);
            s.ctx.defaultmapsettings.multiboxAmount = K; /* Settings "Maximum Multibox players" */
            app.multiboxchange();
            const u = units(), open = s.ctx.spects.filter((x) => x && !x.player && !x.closed).length;
            /* it takes the focus at its first spawn (spect.js beforecalculation, once it has a place on the map) */
            MB.verdict(check, tag + ': enabling multibox opens one unit (controlled from its first spawn) and keeps Full Map',
                u.length === 1 && s.focus() === 0 && open === tiles, u.length + ' unit, focus ' + s.focus() + ', tiles ' + open + ' of ' + tiles);
            app.multiboxchange();
            check(tag + ': the switch key again: no second unit (it switches)', units().length === 1);
            if (K > 2) {
                /* Add Player opens one more each time, in the next slot */
                for (let i = 2; i < K; i++) app.mbAddPlayer();
                check(tag + ': ' + K + ' playing clients can be opened (Add Player), slots 2..' + K, units().length === K - 1 &&
                    units().map((x) => x.slotId).join() === Array.from({ length: K - 1 }, (_, i) => i + 2).join() && s.ctx.lmMbPlayers.count() === K, (units().length + 1) + ' playing');
                const tilesBefore = s.ctx.spects.filter((x) => x && !x.player).length;
                app.mbDisable();
                check(tag + ': multibox off: every unit closed, the slots free, focus on P1, ' + (fm ? 'the tiles stay' : 'nothing else closed'), units().length === 0 &&
                    s.ctx.lmMbPlayers.count() === 1 && s.focus() === 0 && s.ctx.spects.filter((x) => x && !x.player).length === tilesBefore && s.LM.multiBoxPlayerExists === false);
            }
        }
    }
    console.log('info 1 to 6 players x Full Map off / on: ' + (Date.now() - t0) + ' ms');
}
/* 5b. the player calls (application.mbEnable / mbAddPlayer / mbRemovePlayer / mbSelectPlayer, lmMbPlayers)
 * against the cases of the Multibox 2.0 specification (section 13) */
{
    const MB = require('./lib/mbplayers');
    const opt = { v4: process.argv[2], sp: process.argv[3], app: true };
    const fresh = (cap) => {
        const s = MB.scene(Object.assign({ players: 1 }, opt));
        s.ctx.defaultmapsettings.multiboxAmount = cap || 6;
        return { s, app: s.ctx.application, reg: s.ctx.lmMbPlayers, units: () => s.ctx.spects.filter((x) => x && x.player) };
    };
    {
        const { s, app, units } = fresh(3);
        app.mbEnable(); app.mbEnable();
        check('repeated enable: one unit (P2), the main player controlled until its first spawn', units().length === 1 && units()[0].slotId === 2 && s.focus() === 0);
        /* its first own cell (spect.js beforecalculation): it takes the focus */
        const p2 = units()[0];
        p2._lmOwn = [{ x: 0, y: 0, size: 60, targetSize: 60, spectator: p2.number }]; p2.active = true;
        p2.beforecalculation();
        check('    ... its first spawn: P2 controlled', s.focus() === p2.number, s.focus());
        const u3 = app.mbAddPlayer();
        check('add one: P3 opens in slot 3 and the focus stays where it was (also at its first spawn)', !!u3 && u3.slotId === 3 && units().length === 2 && s.focus() === units()[0].number);
        check('Settings "Maximum Multibox players" 3 (an old saved value): no fourth player', app.mbAddPlayer() === null && units().length === 2);
    }
    {
        /* the shipped maximum, 2: P1 + P2 only */
        const { app, units } = fresh(2);
        app.mbEnable();
        check('the shipped maximum 2 (P1 + P2): enable opens P2, Add Player no third player', units().length === 1 && units()[0].slotId === 2 && app.mbAddPlayer() === null && units().length === 1);
    }
    /* a choice made while a unit's first spawn waits for its place on the map (spect.js _lmSpawnHold,
     * up to 3 s; here a stand-in that holds while `held`): the player chosen keeps the focus when that
     * spawn goes through (it took the focus back: P1 controlled, rings on the unit, the roster and the
     * phone indicator on P2); with no choice the unit still takes it at its first spawn */
    {
        const pending = (o) => {
            const { s, app, units } = fresh(o.cap || 3);
            app.mbEnable();
            const u = units()[units().length - 1];
            u._lmHeld = true;
            u._lmSpawnHold = function () { return this._lmHeld; };
            u._lmOwn = [{ x: 0, y: 0, size: 60, targetSize: 60, spectator: u.number }]; u.active = true;
            u.beforecalculation();
            return { s, app, units, u, held: s.focus(), go() { u._lmHeld = false; u.beforecalculation(); return s.focus(); } };
        };
        let t = pending({});
        check('first spawn held (orientation not verified): P1 controlled meanwhile', t.held === 0 && !t.u._lmSpawnedOnce, t.held);
        check('    ... no choice made: the unit takes the focus when its spawn goes through (start of multibox)', t.go() === t.u.number);
        t = pending({});
        t.app.mbSelectPlayer(1);
        check('P1 chosen (roster / mbSelectPlayer(1)) while the first spawn of P2 is held: P1 stays controlled when it goes through', t.go() === 0 && t.u._lmSpawnedOnce === true &&
            t.s.ctx.lmMbPlayers.activeSlot === 1, t.s.focus());
        t.app.mbSelectPlayer(2);
        check('    ... P2 chosen afterwards: P2 controlled, its life unchanged (no respawn)', t.s.focus() === t.u.number && t.u.spawnRequests === 0, t.s.focus() + ' / ' + t.u.spawnRequests);
        t.app.mbSelectPlayer(1);
        t.u.openSecond = false; t.u.beforecalculation();
        check('    ... a later background spawn of P2 does not take the focus from the living P1', t.s.focus() === 0, t.s.focus());
        t = pending({});
        t.app.mbSelectPlayer(2);
        check('P2 itself chosen before its first spawn: it is controlled, and stays so when the spawn goes through', t.s.focus() === t.u.number && t.go() === t.u.number, t.s.focus());
        t = pending({});
        t.app.mbSelectPlayer(2); t.app.mbSelectPlayer(1);
        check('P1 -> P2 -> P1 before the first spawn of P2: the last choice (P1) stays controlled', t.go() === 0, t.s.focus());
        t = pending({});
        t.app.multiboxchange(); t.app.multiboxchange();
        check('the switch key twice (P2, back to P1) before the first spawn of P2: P1 stays controlled', t.go() === 0, t.s.focus());
        t = pending({});
        t.app.mbSelectPlayer(1);
        t.s.LM.play = false; /* the main player chosen is not alive (dead, or still in the menu) */
        check('P1 chosen but not alive when the first spawn of P2 goes through: P2 takes the focus', t.go() === t.u.number, t.s.focus());
        /* a third player: P3 added while P2 is controlled; the player chooses P1 before P3 spawns */
        {
            const { s, app, units } = fresh(3);
            app.mbEnable();
            const p2 = units()[0];
            p2._lmOwn = [{ x: 0, y: 0, size: 60, targetSize: 60, spectator: p2.number }]; p2.active = true;
            p2.beforecalculation();
            const p3 = app.mbAddPlayer();
            p3._lmHeld = true; p3._lmSpawnHold = function () { return this._lmHeld; };
            p3._lmOwn = [{ x: 9, y: 9, size: 60, targetSize: 60, spectator: p3.number }]; p3.active = true;
            p3.beforecalculation();
            app.mbSelectPlayer(1);
            p3._lmHeld = false; p3.beforecalculation();
            check('three players: P1 chosen while the first spawn of P3 is held: P1 stays controlled', s.focus() === 0 && p3._lmSpawnedOnce === true, s.focus());
            const p4 = (s.ctx.defaultmapsettings.multiboxAmount = 4, app.mbAddPlayer());
            p4._lmOwn = [{ x: 5, y: 5, size: 60, targetSize: 60, spectator: p4.number }]; p4.active = true;
            p4.beforecalculation();
            check('    ... an extra player added afterwards (Add Player): its first spawn does not take the focus from living P1', s.focus() === 0 && p4._lmSpawnedOnce === true, s.focus());
            app.mbSelectPlayer(4);
            check('    ... chosen by the player: P4 controlled', s.focus() === p4.number, s.focus());
        }
        /* decision 1: P2 of the switch key / mbEnable takes the focus at its first spawn, an optional P3
         * of Add Player does not (the player you control keeps it); a hold that ran out unverified
         * gives no focus until the place is known, and the latest choice wins over it */
        {
            const { s, app, units } = fresh(4);
            app.mbEnable();
            const p2 = units()[0];
            p2._lmOwn = [{ x: 0, y: 0, size: 60, targetSize: 60, spectator: p2.number }]; p2.active = true;
            p2.beforecalculation();
            const p3 = app.mbAddPlayer();
            p3._lmOwn = [{ x: 9, y: 9, size: 60, targetSize: 60, spectator: p3.number }]; p3.active = true;
            p3.beforecalculation();
            check('P2 controlled from its first spawn; P3 added (Add Player): its verified first spawn leaves P2 controlled', s.focus() === p2.number && p3._lmSpawnedOnce === true,
                s.focus() + ' / ' + p2.number);
            const p4 = app.mbAddPlayer();
            app.mbSelectPlayer(4);
            p4._lmOwn = [{ x: 7, y: 7, size: 60, targetSize: 60, spectator: p4.number }]; p4.active = true;
            p4.beforecalculation();
            check('    ... P4 added and chosen before its first spawn: controlled, and stays so when it spawns', s.focus() === p4.number, s.focus());
            const q = fresh(4);
            q.app.mbEnable();
            const u = q.units()[0];
            u.transformReady = function () { return !!this._lmPlaced; };
            u._lmOwn = [{ x: 0, y: 0, size: 60, targetSize: 60, spectator: u.number }]; u.active = true;
            u.beforecalculation();
            check('P2\'s first spawn after a hold that ran out unverified: P1 stays controlled, the focus waits', q.s.focus() === 0 && u._lmFocusWait === 1, q.s.focus());
            const u3 = q.app.mbAddPlayer();
            q.app.mbSelectPlayer(3);
            u._lmPlaced = true; u.beforecalculation();
            /* P3 is not spawned yet: the choice waits (handoff 2026-11-28 section 2), P1 keeps the control */
            check('    ... P3 (not spawned yet) chosen meanwhile, the latest choice: P1 keeps the control while it spawns, P2 verified later does not take it',
                q.s.focus() === 0 && !u._lmFocusWait && pendOf(q.s.ctx) === u3 && u3.spawnRequests === 1, q.s.focus());
            u3._lmOwn = [{ x: 3, y: 3, size: 60, targetSize: 60, spectator: u3.number }]; u3.active = true;
            u3.beforecalculation();
            check('    ... P3 spawns: it takes the control, once', q.s.focus() === u3.number && !pendOf(q.s.ctx), q.s.focus());
        }
    }
    {
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        const held = reg.reserve(); /* a slot held while its unit is being made */
        for (let i = 0; i < 6; i++) app.mbAddPlayer();
        check('max six players, the slot being made included: 4 more open, then none', units().length === 4 && reg.count() === 6 && held.slotId === 3 &&
            units().map((x) => x.slotId).join() === '2,4,5,6', units().map((x) => x.slotId).join());
        check('    ... addBox at six gives nothing (no extra socket)', s.ctx.addBox() === null && units().length === 4);
        reg.release(held.slotId, held.slotEpoch);
        s.ctx.spectHook = () => { s.ctx.inner = s.ctx.addBox(); };
        const u = s.ctx.addBox();
        check('    ... no unit is made while another one is (no reentrant creation)', !!u && u.slotId === 3 && s.ctx.inner === null && units().length === 5);
    }
    /* the maximum lowered while more players are open (Settings "Maximum Multibox players"): nobody
     * is closed and nobody loses a profile; Add Player only refuses until the open players are within it */
    {
        const { s, app, reg, units } = fresh(4);
        app.mbEnable();
        const p3 = app.mbAddPlayer(), p4 = app.mbAddPlayer();
        app.ensureMbSlots();
        const before = units().map((u) => s.ctx.lmMbProfileIdx(u)).join();
        s.ctx.defaultmapsettings.multiboxAmount = 2;
        app.ensureMbSlots(); /* as setProfile runs it (a profile chosen, a load, an import) */
        app.selectProfile(5); /* P1 controlled: P1 takes profile 5, the cascade of two players moves P2 only */
        check('maximum 4 -> 2 with P2, P3, P4 open: none closed, P3 / P4 keep their profiles (' + before + ' -> ' + units().map((u) => s.ctx.lmMbProfileIdx(u)).join() + ')',
            units().length === 3 && units().every((u) => !u.closed) && reg.count() === 4 && before === '1,2,3' && s.ctx.lmMbProfileIdx(p3) === 2 && s.ctx.lmMbProfileIdx(p4) === 3);
        check('    ... Add Player refuses (no new socket)', app.mbAddPlayer() === null && units().length === 3 && reg.count() === 4);
        s.ctx.defaultmapsettings.multiboxAmount = 3;
        check('    ... raised to 3, four still open: it still refuses', app.mbAddPlayer() === null && units().length === 3);
        app.mbRemovePlayer(4);
        check('    ... P4 removed (three open, the maximum): still refuses; P3 keeps its profile', app.mbAddPlayer() === null && units().length === 2 && s.ctx.lmMbProfileIdx(p3) === 2);
        app.mbRemovePlayer(3);
        const n3 = app.mbAddPlayer();
        check('    ... P3 removed too (within the maximum): Add Player opens P3 again, with the profile it had', !!n3 && n3.slotId === 3 && units().length === 2 && s.ctx.lmMbProfileIdx(n3) === 2);
    }
    {
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        s.ctx.spectThrows = true;
        let threw = false;
        try { s.ctx.addBox(); } catch (e) { threw = true; }
        check('making a unit fails: its slot is freed again (rollback)', threw && reg.count() === 2 && reg.reserve().slotId === 3);
    }
    /* the registry's refusals and addBox's: what is refused leaves lmMbPlayers as it was (slots,
     * reservations, sources, the slot order, the login slot, busy, revision) */
    const regSnap = (reg) => JSON.stringify({ slots: reg.slots.map((u) => (u ? u.number + '@' + u.slotEpoch : null)), reserved: reg.reserved.slice(),
        src: Array.from(reg.bySource, (e) => e[0] + '>' + e[1].slotId + '@' + e[1].slotEpoch), ord: reg.ordered.map((u) => u.slotId + ':' + u.number),
        tok: reg.tokenSlot, busy: reg._busy, count: reg.count() });
    /* Settings "Maximum Multibox players" at the public entry (spect.js addBox, which scripts and
     * older code call directly, not only Add Player): refused before a slot is held or a unit (its
     * socket) made; P1 and the slots taken or being opened count, Full Map tiles never */
    for (const fm of [false, true]) {
        const tag = 'addBox and the maximum (Full Map ' + (fm ? 'on' : 'off') + ')';
        const s = MB.scene(Object.assign({ players: 1, fullMap: fm }, opt));
        const reg = s.ctx.lmMbPlayers, app = s.ctx.application, units = () => s.ctx.spects.filter((x) => x && x.player);
        const tiles = () => s.ctx.spects.filter((x) => x && !x.player && !x.closed).length, t0n = tiles();
        let made = 0;
        const counting = () => { made++; };
        s.ctx.defaultmapsettings.multiboxAmount = 2;
        const p2 = s.ctx.addBox();
        check(tag + ': maximum 2, P2 by a direct addBox (the tiles do not count)', !!p2 && p2.slotId === 2 && reg.count() === 2 && units().length === 1 && tiles() === t0n && (!fm || t0n > 0),
            reg.count() + ' / ' + t0n + ' tiles');
        let before = regSnap(reg), ep = reg._epoch, n = s.ctx.spects.length;
        s.ctx.spectHook = counting;
        const p3 = s.ctx.addBox();
        check(tag + ': maximum 2: a second direct addBox gives null, no unit (socket) made, no slot held, the registry as it was',
            p3 === null && made === 0 && s.ctx.spectHook === counting && regSnap(reg) === before && reg._epoch === ep && s.ctx.spects.length === n && tiles() === t0n, regSnap(reg));
        s.ctx.spectHook = null;
        s.ctx.defaultmapsettings.multiboxAmount = 6;
        const more = [];
        for (let i = 0; i < 6; i++) more.push(s.ctx.addBox());
        check(tag + ': maximum 6: five units at most (P2..P6), then null', more.filter(Boolean).length === 4 && more.slice(4).every((x) => x === null) && units().length === 5 &&
            reg.count() === 6 && units().map((x) => x.slotId).join() === '2,3,4,5,6' && tiles() === t0n, units().map((x) => x.slotId).join());
        /* lowered with six open: nobody closes, direct creation refused until they are within it */
        s.ctx.defaultmapsettings.multiboxAmount = 3;
        before = regSnap(reg); ep = reg._epoch; n = s.ctx.spects.length; made = 0;
        s.ctx.spectHook = counting;
        const low = s.ctx.addBox();
        s.ctx.spectHook = null;
        check(tag + ': maximum lowered 6 -> 3: the five units stay open, addBox refuses (no socket, no reservation)',
            low === null && made === 0 && units().length === 5 && units().every((x) => !x.closed) && regSnap(reg) === before && reg._epoch === ep && s.ctx.spects.length === n);
        app.mbRemovePlayer(3); app.mbRemovePlayer(4); app.mbRemovePlayer(5);
        check(tag + ': ... three removed (P1, P2, P6 open = 3): still refused', s.ctx.addBox() === null && reg.count() === 3 && reg.get(6) && reg.get(2));
        app.mbRemovePlayer(6);
        const back = s.ctx.addBox();
        check(tag + ': ... within it again: the lowest free slot (3) opens, then the maximum holds', !!back && back.slotId === 3 && reg.count() === 3 && s.ctx.addBox() === null);
        /* a unit whose making fails: its reservation is released, the maximum counts it no more */
        s.ctx.defaultmapsettings.multiboxAmount = 4;
        before = regSnap(reg);
        s.ctx.spectThrows = true;
        let threw = false;
        try { s.ctx.addBox(); } catch (e) { threw = /socket refused/.test(e.message); }
        const rolled = regSnap(reg) === before && reg.count() === 3;
        const again = s.ctx.addBox();
        check(tag + ': maximum 4, the unit\'s making fails: the slot held for it is released (count 3, not busy), the next addBox gets that slot (4), then null',
            threw && rolled && !reg._busy && !!again && again.slotId === 4 && reg.count() === 4 && s.ctx.addBox() === null && tiles() === t0n, before + ' -> ' + regSnap(reg));
    }
    {
        const { s, app, reg } = fresh(6);
        app.mbEnable(); app.mbAddPlayer();
        const p2 = reg.get(2), p3 = reg.get(3), fake = (o) => Object.assign({ player: true, number: 90 }, o);
        let before = regSnap(reg), rev = reg.revision;
        const taken = [fake({ slotId: 2, slotEpoch: p2.slotEpoch }), fake({ slotId: 3, slotEpoch: p3.slotEpoch, number: 91 }), fake({ slotId: 2, slotEpoch: reg._epoch + 1 })];
        check('attach: a slot already taken is refused (also with its occupant\'s slotEpoch), the registry as it was',
            taken.every((u) => reg.attach(u) === false) && regSnap(reg) === before && reg.revision === rev && reg.get(2) === p2 && reg.get(3) === p3, regSnap(reg));
        /* the slot test on its own: a reservation for the taken slot (only possible by hand) still leaves the occupant there */
        reg.reserved[2] = 77;
        const forced = reg.attach(fake({ slotId: 2, slotEpoch: 77 }));
        reg.reserved[2] = 0;
        check('    ... also with a matching reservation for that slot: the occupant stays', forced === false && regSnap(reg) === before && reg.get(2) === p2 && reg.getBySource(p2.number) === p2);
        /* P3 goes, its slot is held for the next unit: the old P3 (a late callback) has a stale slotEpoch */
        const e3 = p3.slotEpoch;
        app.mbRemovePlayer(3);
        const r = reg.reserve();
        before = regSnap(reg); rev = reg.revision;
        const stale = [p3, fake({ slotId: 3, slotEpoch: e3 }), fake({ slotId: 3, slotEpoch: r.slotEpoch - 1 }), fake({ slotId: 3, slotEpoch: r.slotEpoch + 1 }), fake({ slotId: 3, slotEpoch: 0 })];
        check('attach: a stale slotEpoch (the removed unit\'s, an older or unknown one, none) is refused, the slot stays held for its unit',
            r.slotId === 3 && stale.every((u) => reg.attach(u) === false) && regSnap(reg) === before && reg.revision === rev && reg.reserved[3] === r.slotEpoch && !reg.isCurrent(p3), regSnap(reg));
        /* a source already registered: another object under P2's number, or P2 itself in a second slot */
        const dup = fake({ number: p2.number, slotId: 3, slotEpoch: r.slotEpoch });
        const slot2 = p2.slotId, ep2 = p2.slotEpoch;
        p2.slotId = 3; p2.slotEpoch = r.slotEpoch;
        const twice = reg.attach(p2);
        p2.slotId = slot2; p2.slotEpoch = ep2;
        check('attach: a source already registered is refused (another unit under its number, the same unit in a second slot), the registry as it was',
            reg.attach(dup) === false && twice === false && regSnap(reg) === before && reg.revision === rev && reg.getBySource(p2.number) === p2 && reg.get(2) === p2, regSnap(reg));
        const ok3 = fake({ number: 92, slotId: 3, slotEpoch: r.slotEpoch });
        check('    ... after the refusals the unit holding the reservation attaches', reg.attach(ok3) === true && reg.get(3) === ok3 && reg.reserved[3] === 0 && reg.getBySource(92) === ok3);
    }
    {
        /* reserve() refuses (spect.js addBox: null before anything is made): six players, or a unit being made */
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        for (let i = 0; i < 4; i++) app.mbAddPlayer();
        const before = regSnap(reg), rev = reg.revision, ep = reg._epoch, n = s.ctx.spects.length;
        let made = 0;
        const hook = () => { made++; };
        s.ctx.spectHook = hook;
        const got = [s.ctx.addBox(), app.mbAddPlayer()];
        check('addBox / Add Player with six players: null, no unit made, no reservation, the registry as it was',
            got[0] === null && got[1] === null && made === 0 && s.ctx.spectHook === hook && regSnap(reg) === before && reg.revision === rev && reg._epoch === ep && s.ctx.spects.length === n && units().length === 5,
            regSnap(reg));
        s.ctx.spectHook = null;
    }
    {
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        let inside = null;
        s.ctx.spectHook = () => {
            const b = regSnap(reg), rv = reg.revision, ep = reg._epoch, n = s.ctx.spects.length;
            const x = s.ctx.addBox(), y = app.mbAddPlayer();
            inside = { ok: x === null && y === null && regSnap(reg) === b && reg.revision === rv && reg._epoch === ep && s.ctx.spects.length === n, held: reg.reserved[3] > 0 && reg._busy };
        };
        const u = s.ctx.addBox();
        check('addBox / Add Player while a unit is being made: null, the registry as it was (the slot being made stays held), then that unit is attached',
            !!inside && inside.ok && inside.held && !!u && u.slotId === 3 && reg.get(3) === u && !reg._busy && reg.reserved[3] === 0 && units().length === 2, JSON.stringify(inside));
    }
    {
        /* attach refuses the unit just made (spect.js addBox: a slot or source taken twice): it is
         * closed and left out of spects, its reservation freed, null, no playerAdded */
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        const r = reg.reserve(), next = s.ctx.spects.reduce((m, x) => (x && x.number > m ? x.number : m), 0) + 1;
        /* a unit a script registered under the number the next connection gets, never put in spects */
        const ghost = { player: true, number: next, slotId: r.slotId, slotEpoch: r.slotEpoch };
        reg.attach(ghost);
        const before = regSnap(reg), n = s.ctx.spects.length, added = [];
        s.ctx.LMEvents.on('playerAdded', (d) => added.push(d.slot));
        let made = null;
        s.ctx.spectHook = (sp) => { made = sp; };
        const got = s.ctx.addBox();
        check('addBox: a unit attach refuses (its source registered already) is closed and left out of spects, null, the registry as it was, no playerAdded',
            got === null && !!made && made.number === next && made.slotId === 4 && made.closed === true && made._lmRemoved === true && !s.ctx.spects.includes(made) &&
            s.ctx.spects.length === n && regSnap(reg) === before && reg.getBySource(next) === ghost && !added.length && !reg._busy, regSnap(reg));
        reg.release(ghost.slotId, ghost.slotEpoch);
        const u = s.ctx.addBox();
        check('    ... the refused slot (4) was freed: with the ghost gone the next unit gets slot 3 under that number, slot 4 is free', !!u && u.slotId === 3 && u.number === next &&
            reg.getBySource(next) === u && reg.reserved[4] === 0 && reg.count() === 3 && added.join() === '3', added.join());
    }
    {
        /* a server change while the unit is being made (LM.flushSpecsData from inside its constructor) */
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        const p2 = reg.get(2);
        let made = null;
        s.ctx.spectHook = (sp) => { made = sp; s.LM.flushSpecsData(); };
        const got = s.ctx.addBox();
        check('addBox: a server change while the unit is made: null, that unit closed and not in spects, every slot free',
            got === null && !!made && made.closed === true && !s.ctx.spects.length && p2.closed && reg.count() === 1 && reg.reserved.every((x) => !x) && !reg.bySource.size && !reg._busy, regSnap(reg));
    }
    {
        /* the Spect constructor throws: the reservation is rolled back */
        const { s, app, reg, units } = fresh(6);
        app.mbEnable(); app.mbAddPlayer();
        const before = regSnap(reg), n = s.ctx.spects.length, added = [];
        s.ctx.LMEvents.on('playerAdded', (d) => added.push(d.slot));
        s.ctx.spectThrows = true;
        let err = null;
        try { s.ctx.addBox(); } catch (e) { err = e; }
        const viaAddBox = !!err && /socket refused/.test(err.message) && regSnap(reg) === before && s.ctx.spects.length === n && !reg._busy && reg.reserved[4] === 0;
        s.ctx.spectThrows = true;
        const viaApp = app.mbAddPlayer();
        const appOk = viaApp === null && regSnap(reg) === before && s.ctx.spects.length === n && !reg._busy;
        const u = app.mbAddPlayer();
        check('the Spect constructor throws: addBox throws on, the slot held for it is released, registry and spects as before, not busy',
            viaAddBox, regSnap(reg) + ' ' + (err && err.message));
        check('    ... Add Player catches it and gives null, same rollback; the next Add Player gets that slot (4)', appOk && !!u && u.slotId === 4 && reg.get(4) === u && added.join() === '4' && units().length === 3,
            added.join() + ' ' + regSnap(reg));
    }
    {
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        for (let i = 0; i < 4; i++) app.mbAddPlayer();
        const p6 = reg.get(6), n6 = p6.number;
        units().forEach((x) => { x.active = true; });
        check('remove P3 while P6 stays: P6 keeps slot 6 and its number, nobody is renumbered', app.mbRemovePlayer(3) === true && reg.get(6) === p6 && p6.number === n6 &&
            units().map((x) => x.slotId).join() === '2,4,5,6' && reg.get(3) === null);
        app.mbSelectPlayer(4);
        const p4 = reg.get(4);
        app.mbRemovePlayer(4);
        check('remove the selected P4: the focus goes to a living player (the main one)', s.focus() === 0 && p4.closed && !reg.isCurrent(p4) && s.ctx.lmMbPlayers.activeSlot === 1);
        s.LM.play = false;
        app.mbSelectPlayer(5);
        app.mbRemovePlayer(5);
        check('    ... main player dead: the next living unit in slot order (P6)', s.focus() === p6.number, s.focus());
        check('P1 cannot be removed', app.mbRemovePlayer(1) === false);
        const seen = [];
        const each = block(v4, 'function lmMbEachPlayer(');
        if (each) {
            vm.runInContext(each, s.ctx);
            s.ctx.lmMbEachPlayer((p, slot) => { seen.push(slot + (p === s.LM ? 'm' : ':' + p.slotId)); });
            check('lmMbEachPlayer (camera, minimap, leaderboard): the players in their slots, P6 stays P6 with P3-P5 gone', seen.join() === '1m,2:2,6:6', seen.join());
        }
    }
    {
        const { s, app, reg, units } = fresh(6);
        app.mbEnable();
        const old = app.mbAddPlayer(), oldEpoch = old.slotEpoch;
        check('a unit still connecting (no life yet) can be removed', old.active === null && app.mbRemovePlayer(3) === true && old.closed && reg.get(3) === null);
        const neu = app.mbAddPlayer();
        check('    ... its slot is used again, with a new slotEpoch', !!neu && neu.slotId === 3 && neu.slotEpoch > oldEpoch && reg.get(3) === neu);
        check('stale callbacks: the old unit is no longer current, its epoch frees nothing, removing it again does nothing',
            !reg.isCurrent(old) && reg.release(3, oldEpoch) === false && reg.get(3) === neu && s.ctx.lmMbRemoveUnit(old) === false && units().includes(neu));
        check('    ... the login slot: a removed unit never holds it', s.ctx.lmMbTokenSlot(old) === false && s.ctx.lmMbTokenSlot(neu) === true && reg.tokenSlot === 3);
        const p2 = reg.get(2);
        check('    ... one unit at a time logs in with the other account: P2 plays as guest while P3 holds it', s.ctx.lmMbTokenSlot(p2) === false);
        app.mbRemovePlayer(3);
        check('    ... the holder removed: the next unit asking gets it', reg.tokenSlot === 0 && s.ctx.lmMbTokenSlot(p2) === true && reg.tokenSlot === 2);
    }
    {
        const { s, app } = fresh(4);
        const ev = [];
        ['playerAdded', 'playerRemoved'].forEach((t) => s.ctx.LMEvents.on(t, (d) => ev.push(t.slice(6) + d.slot + (d.reason ? ':' + d.reason : ''))));
        app.mbEnable(); app.mbAddPlayer(); app.mbAddPlayer();
        app.mbRemovePlayer(3); app.mbRemovePlayer(3);
        app.mbDisable();
        check('LMEvents playerAdded / playerRemoved: once per slot occupancy, with the reason', ev.join() === 'Added2,Added3,Added4,Removed3:removed,Removed2:disabled,Removed4:disabled', ev.join());
    }
    /* deaths and spawns in a scene of five players (the units in slots 2-5) */
    {
        const s = MB.scene(Object.assign({ players: 5 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application, p4 = s.player(4);
        app.mbSelectPlayer(4);
        s.kill(1); s.step(1);
        check('P1 dies while P4 (controlled) lives: the focus stays on P4', s.focus() === p4.src && s.ctx.mainPlayerDeadMbActive === true && app.menuShown === 0, s.focus());
        const s2 = MB.scene(Object.assign({ players: 5 }, opt));
        MB.populate(s2); s2.step(2);
        s2.ctx.lmSetMbUnit(0);
        s2.kill(1); s2.step(1);
        check('P1 dies while P1 is controlled: the first living unit in slot order (P2)', s2.focus() === s2.player(2).src, s2.focus());
        /* P5 controlled; P2 loses its socket and comes back on its own: P5 keeps the focus */
        app.mbSelectPlayer(5);
        s.reconnect(2); s.step(1);
        check('P2 reconnects and respawns while P5 is controlled: no focus taken, no menu', s.focus() === s.player(5).src && app.menuShown === 0, s.focus());
        /* P5 dies: the focus goes on to a living player; P3's background respawn does not take it */
        s.kill(3); s.step(1);
        s.kill(5); s.step(1);
        check('controlled P5 dies, main dead: the next living unit after it in slot order (P2)', s.focus() === s.player(2).src, s.focus());
        s.respawn(3, undefined, { background: true }); s.step(1);
        check('    ... P3 respawning in the background does not take it from living P2', s.focus() === s.player(2).src);
        const ev = [];
        s.ctx.LMEvents.on('playerDied', (d) => ev.push('died' + d.slot + ':' + d.living));
        s.ctx.LMEvents.on('playerDisconnected', (d) => ev.push('disc' + d.slot));
        s.kill(2); s.step(1);
        s.player(2).unit.terminate();
        check('LMEvents playerDied: once per life, with the slot and how many still live', ev.join() === 'died2:2', ev.join());
    }
    /* decision 6: "Auto-switch focus after death" on: the next living player after the dead one in
     * slot order (P1 included, wrapping round), not P1 first; two players unchanged */
    {
        const s = MB.scene(Object.assign({ players: 4 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application;
        app.mbSelectPlayer(2);
        s.kill(2); s.step(1);
        check('switch after death on, controlled P2 dies (P1, P3, P4 alive): the next living player in slot order, P3 (not P1)', s.focus() === s.player(3).src, s.focus());
        app.mbSelectPlayer(4);
        s.kill(4); s.step(1);
        check('    ... controlled P4 dies: round to P1', s.focus() === 0 && app.menuShown === 0, s.focus());
        app.mbSelectPlayer(3);
        s.kill(1); s.step(1);
        check('    ... P1 dies in the background: P3 keeps the focus', s.focus() === s.player(3).src, s.focus());
        s.kill(3); s.step(1);
        check('    ... controlled P3 dies, nobody else alive: no spectator, focus on P1\'s view', s.focus() === 0, s.focus());
        const w = MB.scene(Object.assign({ players: 4 }, opt));
        MB.populate(w); w.step(2);
        w.ctx.application.mbSelectPlayer(3);
        w.kill(4); w.step(1); w.kill(1); w.step(1);
        w.kill(3); w.step(1);
        check('    ... controlled P3 dies, P4 and P1 dead: round to living P2', w.focus() === w.player(2).src, w.focus());
        const t = MB.scene(Object.assign({ players: 2 }, opt));
        MB.populate(t); t.step(2);
        t.ctx.application.mbSelectPlayer(2);
        t.kill(2); t.step(1);
        check('    ... two players: controlled P2 dies, P1 alive: P1 (unchanged)', t.focus() === 0, t.focus());
    }
    /* "Auto-switch focus after death" off: a death alone moves no focus; the session goes on while
     * any player lives; a removed or disconnected player in focus still hands it on */
    {
        const off = (K) => {
            const s = MB.scene(Object.assign({ players: K || 4 }, opt));
            s.ctx.defaultmapsettings.mbSwitchAfterDeath = false;
            MB.populate(s); s.step(2);
            return { s, app: s.ctx.application };
        };
        let { s, app } = off();
        app.mbSelectPlayer(2);
        s.kill(2); s.step(3);
        check('switch after death off, controlled P2 dies (others alive): the focus stays on dead P2, also over the next updates, no menu',
            s.focus() === s.player(2).src && app.menuShown === 0, s.focus() + ' menu ' + app.menuShown);
        s.kill(3); s.step(1);
        check('    ... P3 dies in the background: nothing moves', s.focus() === s.player(2).src, s.focus());
        app.mbSelectPlayer(4);
        check('    ... the player chooses living P4: controlled', s.focus() === s.player(4).src, s.focus());
        ({ s, app } = off());
        s.ctx.lmSetMbUnit(0);
        s.kill(2); s.step(1);
        s.kill(1); s.step(1);
        check('    ... controlled P1 dies (P3, P4 alive): the focus stays on P1', s.focus() === 0, s.focus());
        s.respawn(2, undefined, { background: true }); s.step(1);
        check('    ... P2 respawning in the background does not take it from dead P1', s.focus() === 0, s.focus());
        app.mbSelectPlayer(1);
        check('    ... P1 chosen (roster / its key): it spawns again (Play)', s.LM.play === true && s.focus() === 0);
        ({ s, app } = off());
        app.mbSelectPlayer(3);
        app.mbRemovePlayer(3);
        check('    ... controlled P3 removed: the focus goes to a living player (P1)', s.focus() === 0, s.focus());
        s.LM.play = false;
        app.mbSelectPlayer(2);
        s.reconnect(2, { respawn: false }); s.step(1);
        check('    ... controlled P2 loses its socket, P1 dead: the next living unit (P4)', s.focus() === s.player(4).src, s.focus());
        ({ s, app } = off(3));
        app.mbSelectPlayer(2);
        s.kill(1); s.step(1); s.kill(3); s.step(1);
        check('    ... P1 and P3 die in the background: no menu while controlled P2 lives, no respawn of P1 behind it, its dead view flushed',
            app.menuShown === 0 && s.focus() === s.player(2).src && app.autoResps === 0 && s.ctx.mainPlayerDeadMbActive === true, app.menuShown + ' resp ' + app.autoResps);
        s.kill(2); s.step(1);
        check('    ... the last one (controlled P2) dies: the death menu once, the focus stays', app.menuShown === 1 && s.focus() === s.player(2).src, app.menuShown + ' focus ' + s.focus());
        const hidden = app.menuHidden;
        s.respawn(2); s.step(1);
        check('    ... its respawn (the player asked: Tab / roster) hides it, P2 controlled', app.menuHidden - hidden === 1 && s.focus() === s.player(2).src, app.menuHidden - hidden);
    }
    /* the last death: the menu once; a unit's spawn hides it, unless the player used it or it is old */
    for (const how of ['spawn', 'used', 'old']) {
        const s = MB.scene(Object.assign({ players: 3 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application;
        s.kill(1); s.step(1); s.kill(2); s.step(1); s.kill(3); s.step(1);
        const shown = app.menuShown, hidden = app.menuHidden;
        if (how === 'used') s.useMenu();
        if (how === 'old') s.ctx._lmMbDeathMenuAt = Date.now() - 31000;
        s.respawn(3, undefined, { background: true }); s.step(1);
        check('last death: one menu; ' + (how === 'spawn' ? 'the unit spawning again hides it and takes the focus' : how === 'used' ? 'the player clicked into it: it stays' : 'older than 30 s: it stays'),
            shown === 1 && s.focus() === s.player(3).src && app.menuHidden - hidden === (how === 'spawn' ? 1 : 0), shown + ' / ' + (app.menuHidden - hidden));
    }
    /* the game over (session): the main player dies first, then the units; only the last death has
     * scope 'all', once, and each death says whether it was the player you controlled (sent before
     * the focus moves on); a background unit's death is 'unit' and not active */
    {
        const s = MB.scene(Object.assign({ players: 4 }, opt));
        MB.populate(s); s.step(2);
        const ev = [];
        s.ctx.LMEvents.on('playerDied', (d) => ev.push(d.slot + ':' + d.scope + ':' + (d.active ? 'a' : '-') + ':' + d.living));
        s.ctx.lmSetMbUnit(0);
        s.kill(1); s.step(1);
        s.kill(4); s.step(1);
        s.kill(2); s.step(1);
        s.kill(3); s.step(1);
        s.player(3).unit.terminate();
        check('game over after the main player died first: the last unit\'s death is the one scope all, the controlled ones are active',
            ev.join() === '4:unit:-:2,2:unit:a:1,3:all:a:0', ev.join());
    }
    /* a lost socket is no death: no menu while another player lives, the others' scores stay */
    {
        const s = MB.scene(Object.assign({ players: 3 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application;
        s.kill(1); s.step(1);
        const other = s.player(2).unit;
        other.playerScore = 77;
        s.reconnect(3, { respawn: false }); s.step(1);
        check('a unit\'s socket drops while another one lives: no menu, the other unit\'s score kept', app.menuShown === 0 && other.playerScore === 77 && !s.ctx._lmMbDeathMenuAt);
    }
    /* the last living player's socket drops: the menu (there was none at all, also when it never
     * reconnected), and its spawn after the reconnect hides it as after a death */
    {
        const s = MB.scene(Object.assign({ players: 3 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application;
        s.kill(1); s.step(1); s.kill(2); s.step(1);
        const other = s.player(2).unit;
        other.playerScore = 77;
        s.reconnect(3, { respawn: false }); s.step(1);
        const shown = app.menuShown, latch = !!s.ctx._lmMbDeathMenuAt, hidden = app.menuHidden;
        check('the last living unit\'s socket drops: the menu once, its latch set, the other unit\'s score kept', shown === 1 && latch && other.playerScore === 77, shown + ' latch ' + latch);
        s.respawn(3, undefined, { background: true }); s.step(1);
        check('    ... its spawn after the reconnect hides it and takes the focus', app.menuHidden - hidden === 1 && s.focus() === s.player(3).src && app.menuShown === 1,
            (app.menuHidden - hidden) + ' focus ' + s.focus());
    }
    /* the switch key with nothing alive: the death menu stays until the dead unit it chose spawns;
     * a captcha on that spawn (opcode 85: lmMbRemoveUnit) left no menu at all */
    for (const how of ['spawn', 'captcha']) {
        const s = MB.scene(Object.assign({ players: 3 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application;
        s.kill(1); s.step(1); s.kill(2); s.step(1); s.kill(3); s.step(1);
        const shown = app.menuShown, hidden = app.menuHidden;
        app.multiboxchange(); s.step(1);
        const p2 = s.player(2);
        check('switch key, nothing alive (' + how + '): the dead unit chosen keeps the death menu (its latch set)',
            shown === 1 && app.menuHidden === hidden && s.focus() === p2.src && !!s.ctx._lmMbDeathMenuAt, shown + ' / ' + (app.menuHidden - hidden) + ' focus ' + s.focus());
        if (how === 'spawn') {
            s.respawn(2, undefined, { background: true }); s.step(1);
            check('    ... its spawn hides it', app.menuHidden - hidden === 1 && app.menuShown === 1 && s.focus() === p2.src, (app.menuHidden - hidden) + ' / ' + app.menuShown);
        } else {
            s.ctx.lmMbRemoveUnit(p2.unit, 'removed'); s.step(1);
            check('    ... a captcha removes it: the menu is shown again, nothing hidden', app.menuShown === 2 && app.menuHidden === hidden && s.focus() !== p2.src,
                app.menuShown + ' / ' + (app.menuHidden - hidden) + ' focus ' + s.focus());
        }
    }
    /* a dead unit removed while another player lives: no menu; with multibox off ('disabled') none either */
    {
        const s = MB.scene(Object.assign({ players: 3 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application;
        s.kill(2); s.step(1);
        s.ctx.lmMbRemoveUnit(s.player(2).unit, 'removed');
        s.kill(1); s.step(1); s.kill(3); s.step(1);
        const shown = app.menuShown;
        const t = MB.scene(Object.assign({ players: 2 }, opt));
        MB.populate(t); t.step(2);
        t.kill(2); t.step(1); t.ctx.legendmod.play = false;
        t.ctx.lmMbRemoveUnit(t.player(2).unit, 'disabled');
        check('a dead unit removed while another player lives: no menu (the last death shows it once); \'disabled\': none',
            shown === 1 && t.ctx.application.menuShown === 0, shown + ' / ' + t.ctx.application.menuShown);
    }
    /* the switch key with a player alive: the menu goes as before (a dead target spawns again) */
    {
        const s = MB.scene(Object.assign({ players: 2 }, opt));
        MB.populate(s); s.step(2);
        const app = s.ctx.application;
        s.kill(2); s.step(1);
        const hidden = app.menuHidden;
        app.multiboxchange();
        check('switch key to a dead unit while the main player lives: the menu goes, no latch', app.menuHidden - hidden === 1 && !s.ctx._lmMbDeathMenuAt);
    }
}
/* 5c. the roster in the stats HUD (application._lmMbRosterHtml / _lmMbRosterBind): a chip per open player
 * in slot order with its state and mass, the controlled one outlined, '+' until the capacity, 'x' on
 * P3 on; a click controls / adds / removes and never reaches the game */
{
    const rh = block(v4, '        _lmMbRosterHtml() {'), rb = block(v4, '        _lmMbRosterBind() {'), g1e = block(v4, 'function _lmG1e(s) {');
    if (!rh || !rb || !g1e) check('roster code found', false);
    else {
        const lst = [], calls = [];
        const ctx = { console: { log: noop, warn: noop }, Date, toastr: {} };
        ctx.window = ctx;
        ctx.document = { head: { appendChild: (el) => { ctx.css = el.textContent; } }, createElement: () => ({}), addEventListener: (type, fn, o) => lst.push({ type, fn, capture: o === true || !!(o && o.capture) }) };
        vm.createContext(ctx);
        vm.runInContext(v4.slice(a, b) + '\n' + g1e + '\nfunction lmT(k) { return k; }\n' + v4.slice(v4.indexOf('var LM_MB_RING_DEFAULT_COLORS'), v4.indexOf('\n', v4.indexOf('var LM_MB_RING_DEFAULT_COLORS'))) + '\n' +
            ['function lmMultiboxControlledPlayer('].map((m) => block(v4, m)).join('\n') + '\n' +
            'var defaultmapsettings = window.defaultmapsettings = { multiboxAmount: 4 };\n' +
            'var legendmod = window.legendmod = { play: true, playerMass: 1234.4, multiBoxPlayerExists: true };\n' +
            'var application = window.application = {' + rh + ',\n' + rb + ',\n mbSelectPlayer(s) { calls.push("sel" + s); }, mbAddPlayer() { calls.push("add"); }, mbRemovePlayer(s) { calls.push("rm" + s); } };', Object.assign(ctx, { calls }));
        const reg = ctx.lmMbPlayers, mk = (n, active) => { const r = reg.reserve(); const u = { number: n, player: true, slotId: r.slotId, slotEpoch: r.slotEpoch, active, playerMass: 500, socket: {}, connectionOpened: true, _lmSpawnedOnce: active !== null }; reg.attach(u); ctx.spects.push(u); return u; };
        mk(16, true); mk(3, false);
        ctx.lmSetMbUnit(16);
        const h = ctx.application._lmMbRosterHtml();
        const chips = [...h.matchAll(/data-lm-mb-slot="(\d)"/g)].map((m) => m[1]).join();
        check('roster: P1 P2 P3 in slot order, P2 (controlled) outlined, its mass, P3 dead', chips === '1,2,3' && /lm-mb-alive lm-mb-sel" data-lm-mb-slot="2"/.test(h) && /P2<\/b> 500/.test(h) &&
            /lm-mb-dead" data-lm-mb-slot="3"/.test(h) && /P1<\/b> 1234/.test(h), chips);
        check('    ... the slot colours (one palette), x only on P3, + below the capacity (4)', /border-color:#00E5FF/.test(h) && /border-color:#A855F7/.test(h) &&
            (h.match(/data-lm-mb-rm/g) || []).length === 1 && /data-lm-mb-rm="3"/.test(h) && /data-lm-mb-add/.test(h));
        mk(9, null);
        const h2 = ctx.application._lmMbRosterHtml();
        check('    ... a unit still connecting; at the capacity no +', /lm-mb-connecting" data-lm-mb-slot="4"/.test(h2) && !/data-lm-mb-add/.test(h2));
        ctx.defaultmapsettings.multiboxAmount = 2;
        const hLow = ctx.application._lmMbRosterHtml();
        ctx.defaultmapsettings.multiboxAmount = 4;
        check('    ... the maximum lowered below the players open: every player keeps its chip, no +', (hLow.match(/data-lm-mb-slot=/g) || []).length === 4 && !/data-lm-mb-add/.test(hLow));
        check('    ... texts from the packs (state and Remove / Add titles)', /game1\.hud\.mbAlive/.test(h) && /game1\.hud\.mbDead/.test(h) && /game1\.hud\.mbRemove/.test(h) && /game1\.hud\.mbAdd/.test(h));
        const at = (attrs) => ({ closest: (sel) => { const m = /^\[([\w-]+)\]$/.exec(sel); return sel === '.lm-mb-chip' || (m && m[1] in attrs) ? { getAttribute: (k) => attrs[k], hasAttribute: (k) => k in attrs } : null; } });
        const fire = (type, attrs) => { let stopped = false; lst.filter((l) => l.type === type).forEach((l) => l.fn({ target: at(attrs), stopPropagation() { stopped = true; } })); return stopped; };
        const stop = fire('mousedown', { 'data-lm-mb-slot': '3' }) && fire('touchstart', { 'data-lm-mb-slot': '3' });
        fire('click', { 'data-lm-mb-slot': '3' }); fire('click', { 'data-lm-mb-add': '1' }); fire('click', { 'data-lm-mb-slot': '3', 'data-lm-mb-rm': '3' });
        check('roster click: select / add / remove, the press stopped before the game (mouse and touch), one style', stop && calls.join() === 'sel3,add,rm3' &&
            lst.every((l) => l.capture) && /pointer-events:auto/.test(ctx.css || ''), calls.join());
        ctx.application._lmMbRosterHtml();
        check('    ... the listeners are added once', lst.filter((l) => l.type === 'click').length === 1);
        /* a choice that waits (handoff 2026-11-28 section 2): the chip of the player chosen is marked
         * apart from the one controlled */
        ctx.lmSetMbUnit(0);
        const pu = ctx.lmMbPlayers.get(3);
        pu._lmWantFocusAt = Date.now(); pu._lmFocusOnSpawn = true;
        const hp = ctx.application._lmMbRosterHtml();
        pu._lmWantFocusAt = 0; pu._lmFocusOnSpawn = false;
        const hq = ctx.application._lmMbRosterHtml();
        check('roster: the dead P3 chosen while P1 plays (the choice waits): P1 outlined as controlled, P3 marked pending; none once it ends',
            /lm-mb-sel" data-lm-mb-slot="1"/.test(hp) && /lm-mb-pend" data-lm-mb-slot="3"/.test(hp) && !/lm-mb-pend"/.test(hq) && /lm-mb-pend\{/.test(ctx.css || ''), hp);
        ctx.lmSetMbUnit(16);
        /* the stats HUD's [MB n/m]: n the slot of the player you control (not its connection number + 1),
         * m the players open, in that slot's colour */
        const lbl = block(v4, 'if (window.multiboxPlayerEnabled || legendmod.multiBoxPlayerExists) {', v4.indexOf('/* [MB slot/players]'));
        if (!lbl) check('[MB n/m] label code found', false);
        else {
            const label = () => vm.runInContext('(function () { var t = "";\n' + lbl + '\nreturn t; })()', ctx).replace(/<[^>]+>/g, '').replace(' | ', '');
            const colour = () => /color:(#[0-9A-F]+)/i.exec(vm.runInContext('(function () { var t = "";\n' + lbl + '\nreturn t; })()', ctx))[1];
            ctx.lmSetMbUnit(9);
            const l4 = label(), c4 = colour();
            ctx.lmSetMbUnit(3);
            const l3 = label();
            ctx.lmSetMbUnit(0);
            const l1 = label(), c1 = colour();
            check('[MB n/m]: the slot you control / the players open (unit 9 in slot 4: MB 4/4, unit 3: MB 3/4, P1: MB 1/4), in the slot colour',
                l4 === '[MB 4/4]' && l3 === '[MB 3/4]' && l1 === '[MB 1/4]' && c4 === '#10B981' && c1 === '#FF2FD6', [l4, l3, l1, c4, c1].join());
        }
        /* the 'x' on P2 once it is the only other player: multibox off (mbDisable), not Remove */
        ctx.application.mbDisable = () => calls.push('off');
        calls.length = 0;
        ctx.application.mbRemovePlayer = (s) => calls.push('rm' + s);
        [...ctx.lmMbPlayers.ordered].filter((u) => u.slotId >= 3).forEach((u) => { ctx.lmMbPlayers.release(u.slotId, u.slotEpoch); ctx.spects.splice(ctx.spects.indexOf(u), 1); });
        const h3 = ctx.application._lmMbRosterHtml();
        check('roster, P2 the only other player: its x is multibox off (title from the packs), no Remove x', /data-lm-mb-slot="2"[^]*data-lm-mb-off="1"/.test(h3) &&
            /game1\.hud\.mbOff/.test(h3) && !/data-lm-mb-rm/.test(h3) && (h3.match(/lm-mb-x/g) || []).length === 1, h3);
        check('    ... with P3 open P2 has no x (as before)', !/data-lm-mb-off/.test(h) && !/data-lm-mb-off/.test(h2));
        fire('click', { 'data-lm-mb-slot': '2', 'data-lm-mb-off': '1' });
        check('    ... its click turns multibox off (nothing selected or removed)', calls.join() === 'off', calls.join());
    }
}
/* 5d. multibox off from the hotkey command (hk-multiboxOff, no default key) on the real scene: the
 * units close, the Full Map tiles stay as they are, the focus is back on P1, no menu while P1
 * plays (the menu when P1 is not in a game, as after the last death) */
{
    const MB = require('./lib/mbplayers');
    const hkSrc = read(path.join(root, 'ogario', 'hotkeysCommand.js'));
    const hk = block(hkSrc, "'hk-multiboxOff': {");
    if (!hk) check('hk-multiboxOff found', false);
    else {
        for (const p1Alive of [true, false]) {
            const s = MB.scene({ players: 4, fullMap: true, app: true, v4: process.argv[2], sp: process.argv[3] });
            MB.populate(s);
            s.step(1);
            const app = s.ctx.application, cmd = vm.runInContext('({' + hk + '})', s.ctx)['hk-multiboxOff'];
            const tiles = s.ctx.spects.filter((x) => x && !x.player);
            s.ctx.lmSetMbUnit(s.player(3).src);
            if (!p1Alive) s.ctx.legendmod.play = false;
            const menu = app.menuShown;
            cmd.keyDown();
            const after = s.ctx.spects;
            check('hotkey Multibox off (P1 ' + (p1Alive ? 'playing' : 'not in a game') + '): the units close, the tiles stay (the same, open), focus on P1, ' + (p1Alive ? 'no menu' : 'the menu'),
                cmd.defaultKey === '' && cmd.keyUp === null && after.filter((x) => x && x.player).length === 0 && tiles.length === 4 &&
                tiles.every((t) => after.includes(t) && !t.closed) && after.length === 4 && s.focus() === 0 && s.ctx.lmMbPlayers.count() === 1 &&
                s.LM.multiBoxPlayerExists === false && app.menuShown === menu + (p1Alive ? 0 : 1), 'focus ' + s.focus() + ', menu ' + (app.menuShown - menu) + ', spects ' + after.length);
            cmd.keyDown();
            check('    ... again: nothing more closes, no second menu', s.ctx.spects.length === 4 && app.menuShown === menu + (p1Alive ? 0 : 1));
        }
    }
}
/* 5e. same nick, different skins: P1, P2 and P3 play profiles with one nick and three skins. The
 * switch keys and the roster's select (both ways, twice) write nothing under the nick (no
 * cacheCustomSkin, no customSkinsMap entry, no core.registerSkin: the main player's skin stays its
 * own), each unit's skin is only loaded by its link, and the real lookup (application.customSkinKey)
 * gives each player's cells its own skin: the units' cells carry their profile's URL (spect.js
 * cell.skin), the main player's cells get the nick's skin */
{
    const MB = require('./lib/mbplayers');
    const ms = ['        customSkinKey(nick, color, skinKey, nameOnly, own) {', '        _lmSkinAt(key, custom, vanilla) {', '        _lmSkinKeys(nick, color, hexColor) {',
        '        _lmSkinCacheKey(skinUrl) {'].map((m) => block(v4, m));
    const clan = /\nvar _RE_CLAN_TAG = [^\n]*/.exec(v4);
    if (ms.some((m) => !m) || !clan) check('skin lookup code found', false);
    else {
        const url = (i) => 'https://skins.test/same' + i + '.png';
        const s = MB.scene({ players: 3, app: true, v4: process.argv[2], sp: process.argv[3] });
        MB.populate(s);
        s.step(1);
        const ctx = s.ctx, app = ctx.application;
        vm.runInContext('profiles = [0, 1, 2, 3, 4, 5].map(function (i) { return { nick: "Same", color: "#00000" + i, skinURL: "' + url('') + '".replace(".png", i + ".png") }; });' +
            'ogarcopythelb = { nick: "Same", skinURL: profiles[0].skinURL };', ctx);
        let writes = 0, registered = 0;
        const map = { Same: url(0) };
        app.customSkinsMap = new Proxy(map, { set(t, k, v) { writes++; t[k] = v; return true; } });
        ctx.core = { registerSkin() { registered++; } };
        app.ensureMbSlots();
        ctx.lmSetMbUnit(0);
        app.preloaded.length = 0;
        for (let r = 0; r < 2; r++) {
            for (let i = 0; i < 3; i++) app.multiboxchange();
            for (let i = 0; i < 3; i++) app.multiboxback();
            [2, 3, 1, 3, 2, 1].forEach((sl) => app.mbSelectPlayer(sl));
        }
        const units = [s.player(2).unit, s.player(3).unit], skinOf = (u) => ctx.profiles[ctx.lmMbProfileIdx(u)].skinURL;
        check('same nick: switching writes nothing under the nick (main skin kept, no register, no nick cache)', writes === 0 && registered === 0 && !app.skins.length && map.Same === url(0),
            'writes ' + writes + ', registered ' + registered + ', nick cache ' + app.skins.join());
        check('    ... each unit plays its own skin (P2 ' + url(1).slice(-9) + ', P3 ' + url(2).slice(-9) + '), loaded by its link only', skinOf(units[0]) === url(1) && skinOf(units[1]) === url(2) &&
            app.preloaded.length > 0 && app.preloaded.every((u) => u === url(1) || u === url(2)), app.preloaded.join());
        /* the real lookup over the cells as the renderers ask it */
        const lk = { console: { log: noop } };
        vm.createContext(lk);
        vm.runInContext(clan[0] + '\nvar defaultmapsettings = { customSkins: true, vanillaSkins: false };\nvar LM = { gameMode: ":ffa" };\n' +
            'var app = ({' + ms.join(',\n') + ',\n customSkinsCache: {}, loaded: [], customSkinsMap: ' + JSON.stringify(map) + ',\n' +
            ' teamSkinUrl() { return null; }, checkSkinURL(u) { return u; }, loadSkin(c, u) { this.loaded.push(u); } });', lk);
        const key = (cell) => lk.app.customSkinKey(cell.targetNick, cell.color, cell.skin, false, true);
        const mainCell = { targetNick: 'Same', color: '#000000', skin: '' };
        const unitCells = units.map((u) => ({ targetNick: 'Same', color: '#000000', skin: skinOf(u) }));
        const got = [mainCell].concat(unitCells).map(key);
        check('    ... the lookup: P1 its nick\'s skin, P2 and P3 the skins their cells carry (one nick, three skins)', got.join() === [url(0), url(1), url(2)].join(), got.join());
    }
}
/* 5f. Handoff 2026-11-28, sections 2 to 4, on the scene with the real code (Full Map off and on):
 * - the manual choice follows the spawn focus (lmMbCanSteer): a unit whose orientation is not
 *   verified, or a dead one spawning again, is a choice that waits (lmMbPendingUnit); the player in
 *   control keeps the mouse, keys and camera until the unit can take them, once (one multiboxSwap);
 *   no time makes a provisional orientation a verified one; a newer choice ends the earlier one; a
 *   socket closing, a removal or a new unit in the slot end it (13.1);
 * - spect.js onclose: a unit in focus that loses its socket, dead or alive, hands the focus on
 *   (lmMbFallbackUnit 'disconnect'), with both "Auto-switch focus after death" settings and after
 *   the last retry; a late close of an old socket changes nothing; a background reconnect does not
 *   take the focus from a newer choice (13.2), including the exact reproduction of the handoff;
 * - multiboxPlayerEnabled, lmMbPlayers.activeSlot, lmMbFocused, lmActiveUnit and
 *   lmMultiboxControlledPlayer agree after every transition, also with a multiboxSwap listener that
 *   removes or switches players while it runs (13.3; the actions themselves: splitmacros.js). */
{
    const MB = require('./lib/mbplayers');
    const onclose = block(sp, '    onclose(socket, generation) {');
    const extra = ['function lmActiveUnit(', 'function lmMultiboxControlledPlayer('].map((m) => block(v4, m));
    if (!onclose || extra.some((x) => !x)) check('spect.js onclose / lmActiveUnit found', false);
    else {
        const mk = (o) => {
            o = o || {};
            const s = MB.scene({ players: o.players || 4, fullMap: !!o.fullMap, ids: o.ids, v4: process.argv[2], sp: process.argv[3], app: true });
            MB.populate(s);
            const c = s.ctx, app = c.application;
            vm.runInContext(extra.join('\n') + '\nUnit.prototype.onclose = (class { ' + onclose + ' }).prototype.onclose;\n' +
                'Unit.prototype.flushCellsData = function () { }; Unit.prototype._lmDropLooks = function () { };\n' +
                'Unit.prototype.resetConnectionState = function () { this.openSecond = false; this.connectionOpened = false; };', c);
            s.step(2);
            app.mbSelectPlayer(1); /* every first spawn took the focus in turn: P1 controlled */
            const got = [];
            c.LMEvents.on('multiboxSwap', (d) => got.push(d.unit + '<' + d.previous));
            const u = (slot) => s.player(slot).unit;
            /* the unit's orientation: verified while _lmPlaced */
            const unverify = (slot) => { const x = u(slot); x._lmPlaced = false; x.transformReady = function () { return !!this._lmPlaced; }; return x; };
            /* every reader names the same player */
            const agree = () => {
                const n = +c.multiboxPlayerEnabled || 0, f = c.lmMbFocused(), a = c.lmActiveUnit(true), slot = c.lmMbPlayers.activeSlot;
                return (n ? !!f && +f.number === n && f.player === true : f === s.LM) && a.target === f && slot === c.lmMultiboxControlledPlayer() &&
                    slot === c.lmMbSlotOf(f) && (+c.multiboxPlayerEnabled || 0) === n;
            };
            return { s, c, app, got, u, unverify, agree, f: () => s.focus() };
        };
        for (const fullMap of [false, true]) {
            const tag = fullMap ? ' (Full Map on)' : ' (Full Map off)';
            /* 13.1 the handoff's case: P1 usable, P2 not verified */
            {
                const t = mk({ fullMap }), p2 = t.unverify(2);
                check('5f. P1 controlled, P2 alive but its orientation not verified: chosen, the choice waits, P1 keeps the control (no swap)' + tag,
                    t.app.mbSelectPlayer(2) === true && t.f() === 0 && t.got.length === 0 && pendOf(t.c) === p2 && p2._lmFocusWait === 1 && t.agree(), t.f());
                const now = Date.now;
                t.c.Date = { now: () => now() + 60000 };
                t.s.step(5);
                t.c.Date = Date;
                check('    ... a minute later, still not verified: P1 still controlled (no timeout makes it verified)' + tag, t.f() === 0 && t.got.length === 0 && t.agree(), t.f());
                p2._lmPlaced = true; t.s.step(3);
                check('    ... verified: P2 takes the control once (one swap; camera, cursor, actions, slot agree)' + tag,
                    t.f() === p2.number && t.got.join() === p2.number + '<0' && t.c.lmMbPlayers.activeSlot === 2 && !pendOf(t.c) && t.agree(), t.got.join());
                /* a newer choice ends the earlier one */
                t.app.mbSelectPlayer(1); p2._lmPlaced = false;
                const p3 = t.unverify(3);
                t.app.mbSelectPlayer(2); t.app.mbSelectPlayer(3);
                p2._lmPlaced = true; t.s.step(2);
                check('    ... P2 then P3 chosen (both not verified): P2 verified first does not take the control, P3 waits' + tag,
                    t.f() === 0 && !p2._lmFocusWait && pendOf(t.c) === p3 && t.agree(), t.f());
                t.got.length = 0;
                p3._lmPlaced = true; t.s.step(2);
                check('    ... P3 verified: it takes the control, once' + tag, t.f() === p3.number && t.got.join() === p3.number + '<0' && t.agree(), t.got.join());
                /* the switch keys go on from the choice that waits: P4 chosen (waiting), back: P3 */
                const p4 = t.unverify(4);
                t.app.mbSelectPlayer(4);
                const w = pendOf(t.c) === p4 && t.f() === p3.number;
                t.app.multiboxback();
                check('    ... P4 chosen (waiting), the back key: from P4 to P3 (the choice ends, P3 kept)' + tag, w && t.f() === p3.number && !pendOf(t.c) && !p4._lmFocusWait, t.f());
            }
            /* 13.1 stale claims: removal and a new unit in the slot, a socket that closes */
            {
                const t = mk({ fullMap }), p4 = t.unverify(4), n4 = p4.number;
                t.app.mbSelectPlayer(4);
                t.app.mbRemovePlayer(4);
                const added = t.app.mbAddPlayer();
                p4._lmPlaced = true; p4._lmFocusWait = 1; p4.openSecond = true; p4.active = true; p4._lmOwn = [{ x: 1, y: 1, size: 60, targetSize: 60, spectator: n4 }];
                p4.beforecalculation(); /* a late call of the removed unit */
                check('5f. P4 chosen (waiting), removed, a new unit in slot 4: the old unit\'s late spawn takes nothing, P1 controlled' + tag,
                    !!added && added.slotId === 4 && t.f() === 0 && t.got.length === 0 && !pendOf(t.c) && t.agree(),
                    t.f() + ' new ' + (added && added.number) + ' old ' + n4);
                t.c.lmSetMbUnit(n4, p4);
                check('    ... lmSetMbUnit with the old object (its number reused or not): refused, the focus stays' + tag, t.f() === 0 && t.agree(), t.f());
                const p3 = t.unverify(3);
                t.app.mbSelectPlayer(3);
                const sock = p3.socket = {};
                p3.onclose(sock, p3.connectionGeneration);
                check('    ... P3 chosen (waiting), its socket closes: the choice ends with it' + tag, t.f() === 0 && !pendOf(t.c) && !p3._lmFocusWait && !p3._lmFocusOnSpawn && t.agree(), t.f());
                t.s.reconnect(3); p3._lmPlaced = true; t.s.step(3);
                check('    ... its reconnect and background spawn, verified: P1 keeps the control' + tag, t.f() === 0 && t.got.length === 0 && t.agree(), t.f());
            }
            /* dead players: chosen while another plays (it spawns again, then takes the control), with
             * "Auto-switch focus after death" on and off; nothing of ours alive: controlled at once */
            for (const off of [false, true]) {
                const t = mk({ fullMap }), p2 = t.u(2), sw = off ? ' (auto-switch off)' : ' (auto-switch on)';
                if (off) t.c.defaultmapsettings.mbSwitchAfterDeath = false;
                t.s.kill(2);
                const req = p2.spawnRequests;
                t.app.mbSelectPlayer(2);
                check('5f. P1 plays, the dead P2 chosen' + sw + ': it spawns again, P1 keeps the control meanwhile' + tag,
                    t.f() === 0 && p2.spawnRequests === req + 1 && pendOf(t.c) === p2 && t.agree(), t.f());
                t.s.respawn(2, null, { background: true }); t.s.step(2);
                check('    ... its spawn: P2 controlled, once' + sw + tag, t.f() === p2.number && t.got.join() === p2.number + '<0' && t.agree(), t.got.join());
                for (let k = 1; k <= 4; k++) t.s.kill(k);
                t.app.mbSelectPlayer(3);
                check('    ... nothing of ours alive: the dead P3 chosen is controlled at once and spawns again' + sw + tag,
                    t.f() === t.u(3).number && t.u(3)._lmFocusOnSpawn === true && t.agree(), t.f());
            }
            /* the death fallback passes a unit not verified: P2 dies (P1 dead), P3 not verified, P4 plays */
            {
                const t = mk({ fullMap }), p3 = t.unverify(3);
                t.s.kill(1);
                t.app.mbSelectPlayer(2);
                t.s.kill(2);
                check('5f. P1 dead, the controlled P2 dies, P3 not verified, P4 plays: the focus to P4' + tag, t.f() === t.u(4).number && t.agree(), t.f());
                t.s.kill(4);
                check('    ... P4 dies too: no unit to steer, the focus on the dead P1, P3 takes it once verified' + tag, t.f() === 0 && p3._lmFocusWait === 2 && t.agree(), t.f());
                p3._lmPlaced = true; t.s.step(2);
                check('    ... P3 verified: P3 controlled' + tag, t.f() === p3.number && t.agree(), t.f());
            }
            /* 13.2 the exact reproduction (handoff section 3): selected source 17, P1 dead, 17 inactive,
             * socket generation 2 matching the current socket, closedByUser false, 8 reconnects made;
             * another surviving unit (16) */
            for (const off of [false, true]) {
                const t = mk({ fullMap, players: 4, ids: [16, 17, 5] }), u17 = t.u(3), sw = off ? ' (auto-switch off)' : ' (auto-switch on)';
                if (off) t.c.defaultmapsettings.mbSwitchAfterDeath = false;
                t.s.kill(4); t.s.kill(1); t.s.kill(3);
                t.c.lmSetMbUnit(17);
                const sock = {};
                Object.assign(u17, { socket: sock, connectionGeneration: 2, closedByUser: false, _reconnectAttempts: 8, reconnectTimer: null, _openedAt: 0 });
                t.got.length = 0;
                u17.onclose(sock, 2);
                check('5f. reproduction: the selected dead 17 loses its socket on its last retry, P1 dead, 16 alive: the focus to 16' + sw + tag,
                    t.f() === 16 && u17.socket === null && u17._reconnectAttempts === 9 && !u17.reconnectTimer && t.got.join() === '16<17' && t.agree(),
                    t.f() + ' attempts ' + u17._reconnectAttempts);
                t.got.length = 0;
                u17.onclose(sock, 1);
                const old = {}; u17.socket = {}; u17.connectionGeneration = 3;
                u17.onclose(old, 3);
                check('    ... a late close of an old socket or generation: nothing changes' + sw + tag, t.f() === 16 && t.got.length === 0 && u17.socket !== null, t.f());
                /* a newer choice (P1: Play, the scene spawns it at once), then the background reconnect +
                 * spawn of 17 */
                t.app.mbSelectPlayer(1);
                t.s.reconnect(3); t.s.step(2);
                check('    ... P1 chosen (Play), then 17 reconnects and spawns in the background: P1 keeps the control' + sw + tag, t.f() === 0 && t.got.join() === '0<16' && t.agree(), t.got.join());
                t.s.LM.play = false; t.s.kill(2); t.s.kill(3);
                t.app.mbSelectPlayer(2); /* the dead 16 chosen (nothing alive): controlled at once, spawning */
                t.s.respawn(3, null, { background: true }); t.s.step(2);
                check('    ... the dead 16 chosen and spawning, 17 spawns in the background meanwhile: 16 keeps the focus' + sw + tag, t.f() === 16 && t.agree(), t.f());
            }
            {
                const t = mk({ fullMap, players: 3 }), p2 = t.u(2), p3 = t.u(3);
                t.c.defaultmapsettings.mbSwitchAfterDeath = false;
                t.app.mbSelectPlayer(3); t.s.kill(3);
                const kept = t.f() === p3.number;
                const sock = p3.socket = {};
                p3.onclose(sock, p3.connectionGeneration);
                check('5f. P1 alive, the selected P3 dies (auto-switch off: it keeps the focus), then loses its socket: P1 controlled' + tag, kept && t.f() === 0 && t.agree(), t.f());
                for (let k = 1; k <= 3; k++) t.s.kill(k);
                t.s.respawn(2, null, { background: true }); t.s.step(1);
                t.app.mbSelectPlayer(2);
                const menus = t.app.menuShown, s2 = p2.socket = {};
                p2.onclose(s2, p2.connectionGeneration);
                check('    ... the last living player (P2, controlled) loses its socket: the menu once, its latch, the focus on the dead P1' + tag,
                    t.app.menuShown === menus + 1 && !!t.c._lmMbDeathMenuAt && t.f() === 0 && t.agree(), (t.app.menuShown - menus) + ' focus ' + t.f());
                p2.socket = {}; p2.onclose(p2.socket, p2.connectionGeneration);
                check('    ... its reconnects fail: no second menu, the focus stays' + tag, t.app.menuShown === menus + 1 && t.f() === 0, t.app.menuShown - menus);
            }
            /* 13.3 a multiboxSwap listener that removes the unit taking the focus, or switches back */
            {
                const t = mk({ fullMap }), p3 = t.u(3);
                let once = true;
                t.c.LMEvents.on('multiboxSwap', (d) => { if (once && d.unit === p3.number) { once = false; t.app.mbRemovePlayer(3); } });
                t.app.mbSelectPlayer(3);
                check('5f. a swap listener removes the unit just chosen: the focus moves on, every reader agrees' + tag, t.f() === 0 && p3._lmRemoved === true && t.agree(), t.f());
                const p2 = t.u(2);
                t.s.kill(1); t.s.kill(2); t.s.kill(4);
                let back = true;
                t.c.LMEvents.on('multiboxSwap', (d) => { if (back && d.unit === p2.number) { back = false; t.app.mbSelectPlayer(1); } });
                t.app.mbSelectPlayer(2);
                t.s.respawn(2, null, { background: true }); t.s.step(2);
                check('    ... a listener switches back to P1 while the dead P2 is chosen: P1 kept, P2\'s spawn takes nothing' + tag, t.f() === 0 && !p2._lmFocusOnSpawn && t.agree(), t.f());
                t.c.lmSetMbUnit(p3.number);
                check('    ... lmSetMbUnit with the removed unit\'s number: refused, the focus stays' + tag, t.f() === 0 && t.agree(), t.f());
                const tile = t.s.tiles.length ? t.s.tiles[0].unit : null;
                if (tile) {
                    t.c.lmSetMbUnit(tile.number);
                    check('    ... lmSetMbUnit with a Full Map tile\'s number (a passive spectator): refused, the focus stays' + tag, t.f() === 0 && t.agree(), t.f());
                }
            }
        }
    }
}
/* 6. a spectator (Full Map tile, in-game spectator) with its active flag set is never a living
 * player (lmMbAlive): terminate and beforecalculation skip it for the focus and the last-death menu */
{
    const term = block(sp, '    terminate(reason) {'), before = block(sp, '    beforecalculation() {');
    const env = () => {
        const ctx = { console: { log: noop, warn: noop }, toastr: {}, Date, Math, menuShown: 0, document: { addEventListener: noop } };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext(v4.slice(a, b), ctx);
        vm.runInContext('window.Unit = class Unit { constructor(n, player) { this.number = n; this.player = player; this.active = true; this.cells = []; }\n' +
            'getOwnPlayerCells() { return this.cells; }\ncalculatePlayerMassAndPosition() { }\n' + term + '\n' + before + '\n}\n' +
            'var application = window.application = { showMenu() { window.menuShown++; }, hideMenu() { } };\n' +
            'var defaultmapsettings = window.defaultmapsettings = {};\n' +
            'var legendmod = window.legendmod = { play: false }, LM = legendmod;', ctx);
        ctx.spects.length = 0;
        return ctx;
    };
    {
        const ctx = env(), tile = new ctx.Unit(1, false), u = new ctx.Unit(2, true), w = new ctx.Unit(3, true);
        ctx.spects.push(tile, u, w);
        ctx.multiboxPlayerEnabled = 2;
        u.terminate();
        check('focused unit dies, main dead: the focus skips the spectator listed first and goes to the living unit',
            ctx.multiboxPlayerEnabled === 3 && ctx.menuShown === 0, 'focus ' + ctx.multiboxPlayerEnabled + ' menu ' + ctx.menuShown);
        ctx.multiboxPlayerEnabled = 3; w.active = true; w._lmWantFocusAt = 0;
        u.active = false;
        w.beforecalculation();
        check('focused unit without cells (beforecalculation): never to the spectator', ctx.multiboxPlayerEnabled === null, 'focus ' + ctx.multiboxPlayerEnabled);
    }
    {
        const ctx = env(), tile = new ctx.Unit(1, false), u = new ctx.Unit(2, true);
        ctx.spects.push(tile, u);
        ctx.multiboxPlayerEnabled = 2;
        u.terminate();
        check('the last unit dies, only a spectator left: no focus on it and the death menu shows',
            !ctx.multiboxPlayerEnabled && ctx.menuShown === 1, 'focus ' + ctx.multiboxPlayerEnabled + ' menu ' + ctx.menuShown);
    }
}

/* 8. Decision 8: no death menu over the living multibox unit you control. The menu (#overlays)
 * blocks the mouse buttons, the pad and the phone buttons, so the main player's (P1) death on Garix
 * ("Auto-switch focus after death" off), Senpa and the Imsolo / Agar2 death notification put it over
 * the unit you play (updateCells and Sigmally did not), and so did a failed captcha check. With P1
 * selected, a selected dead unit or no unit the menu shows as before. */
{
    const capt = read(path.join(root, 'ogario', 'captcha.js'));
    const gi = v4.indexOf('application.switchToNextLivingUnit never existed');
    const garix = gi < 0 ? null : block(v4, 'if (this.removePlayerCell && !this.playerCells.length) {', v4.lastIndexOf('// Death check', gi));
    const si = v4.indexOf('// Death check (as the Sigmally parser)');
    const senpa = si < 0 ? null : block(v4, 'if (self.removePlayerCell && !self.playerCells.length) {', si);
    const ii = v4.indexOf('case 21: // 0x15');
    const imsolo = ii < 0 ? null : block(v4, "if (this.serverType === 'imsolo' || this.serverType === 'agar2') {", ii);
    const reopen = block(capt, '    function lmReopenMenu() {');
    if (!garix || !senpa || !imsolo || !reopen || garix.indexOf('switchToNextLivingUnit') < 0) check('death menu code found', false);
    else {
        const paths = {
            garix: '(function () {' + garix + '}).call(legendmod);',
            senpa: 'var self = legendmod;\n' + senpa,
            'imsolo death notification': '(function () {' + imsolo + '}).call(legendmod);',
            'captcha failed': reopen + '\nlmReopenMenu();'
        };
        const run = (code, o) => {
            const ctx = { console: { log: noop, warn: noop }, toastr: {}, Date, menuShown: 0 };
            ctx.window = ctx;
            vm.createContext(ctx);
            vm.runInContext(v4.slice(a, b), ctx);
            vm.runInContext('var defaultmapsettings = window.defaultmapsettings = { mbSwitchAfterDeath: ' + !!o.autoSwitch + ' };\n' +
                'var application = window.application = { onPlayerDeath() { }, showMenu() { window.menuShown++; } };\n' +
                'var legendmod = window.legendmod = { play: true, serverType: "imsolo", removePlayerCell: true, playerCells: [], playerCellsMulti: [], multiBoxPlayerExists: true }, LM = legendmod;\n' +
                'window.userBots = { isAlive: true, startedBots: false };', ctx);
            if (o.captcha) ctx.legendmod.play = false;
            ctx.spects.length = 0;
            if (o.unit) ctx.spects.push({ number: 2, slotId: 2, player: true, active: o.unit === 'alive' });
            ctx.multiboxPlayerEnabled = o.focus || null;
            try { vm.runInContext(code, ctx); } catch (e) { return 'error ' + e.message; }
            return ctx.menuShown;
        };
        for (const p of Object.keys(paths)) {
            const o = { captcha: p === 'captcha failed' };
            const live = run(paths[p], Object.assign({ unit: 'alive', focus: 2 }, o));
            check(p + ': P1 dead, the living P2 selected: no death menu over it', live === 0, live);
            const rest = [run(paths[p], Object.assign({ unit: 'dead', focus: 2 }, o)), run(paths[p], Object.assign({ unit: 'alive', focus: 0 }, o)), run(paths[p], o)];
            /* decision 6: a death menu only when nothing of ours lives (lmMbDeathMenuDue), so not with
             * P1 selected while P2 plays on; the captcha's "press Play again" menu is no death menu
             * and still only spares the living unit you control */
            const want = o.captcha ? '1,1,1' : '1,0,1';
            check(p + ': P2 selected but dead, P1 selected (P2 alive), no unit: ' + (o.captcha ? 'the menu as before' : 'the menu, none while P2 lives, the menu'),
                rest.join() === want, rest.join());
        }
    }
}

/* 9. the input state at the end of a life (lib/mbplayers.js scene, P1 + P2 + P3, with the real
 * lmActiveUnit, window.core.act, application._lmLifeInputEnd, feed / permanent feed / held feed,
 * 16 split and crazy double split, on a virtual clock): the life of the player you control (P2)
 * ends by death, lost socket (spect.js terminate 'disconnect'), removal (lmMbRemoveUnit), Multibox
 * off (LM._lmMbStop) or a server change (LM.flushSpecsData) while Pause, permanent feed, a 16 split
 * and a crazy double split's aim lock run: Pause, the permanent feed and the lock end, and nothing
 * more is sent to anyone (none of it reaches the player the focus moves to). A background player's
 * (P3's) death, lost socket or removal leaves the inputs of P2 as they were; the phone's held Feed
 * ends with P2's lost socket and goes on at P3's. */
{
    const MB = require('./lib/mbplayers');
    const opt = { v4: process.argv[2], sp: process.argv[3], app: true };
    const ca = v4.indexOf('\n        act(m, bound) {'), cb = v4.indexOf('\n        specialOn() {', ca);
    const ms = ['_lmLifeInputEnd(', 'feed(', '_lmFeedTick(', 'macroFeedPerm(', 'macroFeed(', '_lmMacroId(', '_lmMacroSame(', '_lmSplitRun(', 'split(', 'split16(', 'crazyDoubleSplit(']
        .map((m) => block(v4, '\n        ' + m));
    const au = block(v4, 'function lmActiveUnit(');
    if (ca < 0 || cb < 0 || !au || ms.some((m) => !m)) check('input code found (lmActiveUnit, window.core.act, _lmLifeInputEnd, feeds, split macros)', false);
    else {
        const code = au + '\nwindow.core = {' + v4.slice(ca, cb) + '\n};\nObject.assign(application, {\n' + ms.map((m) => m.trim()).join(',\n') + '\n});\n' +
            'window._lmSplitDelay = function (n) { return 40 * n; };';
        const make = () => {
            const s = MB.scene(Object.assign({ players: 3 }, opt));
            MB.populate(s); s.step(2);
            const ctx = s.ctx, LM = s.LM, log = [], timers = [];
            let now = 0, frames = [], tid = 0;
            ctx.performance = { now: () => now };
            ctx.setTimeout = (f, d) => { timers.push({ id: ++tid, f, at: now + Math.max(0, +d || 0) }); return tid; };
            ctx.clearTimeout = (id) => { const i = timers.findIndex((t) => t.id === id); if (i >= 0) timers.splice(i, 1); };
            ctx.requestAnimationFrame = (f) => { frames.push(f); return frames.length; };
            ctx.cancelAnimationFrame = () => { frames = []; };
            ctx.$ = () => ({ hide: noop, show: noop });
            ctx.ogario = LM; ctx.resetonkeydown = noop; ctx.defaultmapsettings.macroFeeding = 10;
            vm.runInContext(code, ctx);
            const units = ctx.spects.filter((u) => u && u.player);
            const name = (p) => p === LM ? 'P1' : 'P' + p.slotId;
            for (const p of [LM].concat(units)) {
                p.sendEject = function () { log.push(name(this) + ':eject'); };
                p.sendSplit = function () { log.push(name(this) + ':split'); };
                p._lmLife = 1;
            }
            LM.socket = {}; LM._connectSeq = 1; LM.serverType = 'agario';
            ctx.application._lmLifeStartAt = 5;
            const advance = (ms2) => {
                const end = now + ms2;
                for (let g = 0; g < 100000 && now < end; g++) {
                    timers.sort((x, y) => x.at - y.at);
                    const nf = (Math.floor(now / 16) + 1) * 16, nt = timers.length ? timers[0].at : Infinity;
                    now = Math.max(now, Math.min(nt, nf, end));
                    if (timers.length && timers[0].at <= now) { timers.shift().f(); continue; }
                    if (now === nf) { const f = frames; frames = []; f.forEach((cb2) => cb2(now)); }
                }
            };
            const W = { s, ctx, LM, app: ctx.application, log, advance, unit: (slot) => s.player(slot).unit, n: (who, from) => log.slice(from || 0).filter((x) => x.indexOf(who + ':') === 0).length };
            /* the player in slot `slot` controlled: Pause on, permanent feed, a 16 split at 0 ms and a
             * crazy double split at 30 ms (its second split and its aim unlock due at 70 ms); at 50 ms */
            W.busy = (slot) => {
                ctx.lmSetMbUnit(slot === 1 ? 0 : W.unit(slot).number);
                W.app.pause = true; LM.pause = true;
                W.app.macroFeedPerm(true);
                W.app.split16();
                advance(30); W.app.crazyDoubleSplit(); advance(20);
            };
            return W;
        };
        const ends = {
            death: (W) => W.s.kill(2),
            'lost socket': (W) => W.s.reconnect(2, { respawn: false }),
            removal: (W) => W.ctx.lmMbRemoveUnit(W.unit(2), 'removed'),
            'Multibox off': (W) => W.app.mbDisable(),
            /* the main connection's flushCellsData: the focus to P1, P1's life over, then flushSpecsData */
            'server change': (W) => { W.ctx.lmSetMbUnit(0); W.app._lmLifeStartAt = 0; W.LM.flushSpecsData(); }
        };
        for (const what of Object.keys(ends)) {
            const W = make();
            W.busy(2);
            const fedP2 = W.n('P2');
            ends[what](W);
            const lockNow = W.ctx.lockPosition, next = W.ctx.multiboxPlayerEnabled ? 'P' + W.ctx.getActiveSpect(W.ctx.multiboxPlayerEnabled).slotId : 'P1';
            const at = W.log.length;
            W.advance(1000);
            check('P2 controlled, its life ends (' + what + ') during Pause, permanent feed, a 16 split and a crazy double split: Pause, permanent feed and the aim lock end, nothing more sent (focus now ' + next + ')',
                fedP2 >= 5 && !W.app.pause && !W.LM.pause && W.app.feedIntervalPerm === null && lockNow === false && W.ctx.lockPosition === false && W.log.length === at,
                'P2 fed ' + fedP2 + ', pause ' + W.app.pause + ', perm ' + !!W.app.feedIntervalPerm + ', lock ' + lockNow + ', after: ' + W.log.slice(at).join());
            const before = W.log.length;
            W.ctx.core.split();
            check('    ... the player the focus went to (' + next + ') takes a new split', W.log.slice(before).join() === next + ':split', W.log.slice(before).join());
        }
        const bg = {
            death: (W) => W.s.kill(3),
            'lost socket': (W) => W.s.reconnect(3, { respawn: false }),
            removal: (W) => W.ctx.lmMbRemoveUnit(W.unit(3), 'removed')
        };
        for (const what of Object.keys(bg)) {
            const W = make();
            W.busy(2);
            W.app.macroFeed(true); /* a held E too */
            W.advance(5);
            const at = W.log.length;
            bg[what](W);
            const lockNow = W.ctx.lockPosition, focus = W.ctx.multiboxPlayerEnabled === W.unit(2).number;
            W.advance(300);
            check('P2 controlled, the background P3\'s ' + what + ': its Pause, permanent feed, held feed, 16 split and aim lock go on, nothing to anyone else',
                focus && W.app.pause && W.LM.pause && !!W.app.feedIntervalPerm && W.app.macroFeedActive && lockNow === true && W.n('P2', at) >= 20 &&
                W.log.filter((x) => x === 'P2:split').length === 6 && W.n('P1') === 0 && W.n('P3') === 0,
                'focus ' + W.ctx.multiboxPlayerEnabled + ', pause ' + W.app.pause + ', perm ' + !!W.app.feedIntervalPerm + ', held ' + W.app.macroFeedActive + ', lock ' + lockNow +
                ', P2 ' + W.n('P2', at) + ' / splits ' + W.log.filter((x) => x === 'P2:split').length + ', P1 ' + W.n('P1') + ', P3 ' + W.n('P3'));
        }
        {
            /* P1 controlled: Multibox off closes only background units */
            const W = make();
            W.busy(1);
            const at = W.log.length;
            W.app.mbDisable();
            W.advance(300);
            check('P1 controlled, Multibox off (the units were in the background): P1 keeps its Pause, permanent feed and split', W.app.pause && !!W.app.feedIntervalPerm &&
                W.n('P1', at) >= 10 && W.log.filter((x) => x === 'P1:split').length === 6 && W.n('P2') === 0 && W.n('P3') === 0,
                'pause ' + W.app.pause + ', perm ' + !!W.app.feedIntervalPerm + ', P1 ' + W.n('P1', at));
        }
        /* the phone's held Feed (LMmobile.js: _lmMobileFeedHeld, _lmMobileFeedStop = feedStop) */
        const phone = (W) => {
            let held = true;
            W.ctx._lmMobileFeedHeld = () => held;
            W.ctx._lmMobileFeedStop = () => { held = false; W.app.macroFeed(false); };
            W.ctx.lmSetMbUnit(W.unit(2).number);
            W.app.macroFeed(true);
            W.advance(100);
            return () => held;
        };
        {
            const W = make(), held = phone(W), fed = W.n('P2');
            W.s.reconnect(2, { respawn: false });
            const at = W.log.length;
            W.advance(300);
            check('phone Feed held on P2, P2\'s socket closes (the focus to P1): the held Feed ends, P1 is not fed', fed >= 5 && !held() && !W.app.macroFeedActive && W.log.length === at,
                'P2 ' + fed + ', held ' + held() + ', after: ' + W.log.slice(at).join());
        }
        {
            const W = make(), held = phone(W);
            W.s.reconnect(3, { respawn: false });
            const at = W.log.length;
            W.advance(300);
            check('phone Feed held on P2, the background P3\'s socket closes: it goes on feeding P2', held() && W.app.macroFeedActive && W.n('P2', at) >= 10 && W.n('P1') === 0 && W.n('P3') === 0,
                'held ' + held() + ', P2 ' + W.n('P2', at));
        }
        {
            /* a switch by hand keeps the phone Feed's old behaviour: it feeds the player switched to */
            const W = make(), held = phone(W);
            W.ctx.lmSetMbUnit(W.unit(3).number);
            const at = W.log.length;
            W.advance(300);
            check('phone Feed held on P2, switched to P3 by hand: it feeds P3 (its old behaviour)', held() && W.n('P3', at) >= 10 && W.n('P2', at) === 0, 'P3 ' + W.n('P3', at));
        }
    }
}

console.log(failed ? failed + ' failed' : 'all multibox death checks passed');
process.exit(failed ? 1 : 0);
