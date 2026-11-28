/* LMEvents 'multiboxSwap' for every change of the multibox unit you control, with the real code cut
 * out of ogario/ogario.v4.js (LMEvents, lmSetMbUnit, application.multiboxchange / multiboxback) and
 * ogario/spect.js (terminate, beforecalculation). The event came only from the swap / back hotkeys and
 * the switch after the main player died, so the phone P1/P2 indicator kept the old unit when the
 * controlled unit died or a unit took the focus at its spawn.
 * Cases: a focused unit dies while the main player lives (back to 0) or is dead (to the next living
 * unit, one event, not 0 and then the unit), the first spawn of a unit takes the focus, a unit dying
 * without the focus and a respawn of the focused unit send nothing, swap / back send one event each,
 * a Full Map tile (player false) is never taken for a surviving unit, a switch made while a unit's
 * first spawn is held (spect.js _lmSpawnHold) is not undone when that spawn goes through.
 * node developers/tests/mbswap.js [ogario.v4.js] [spect.js] */
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

function block(src, start) {
    const i = src.indexOf(start);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
/* LMEvents and (when present) lmSetMbUnit: from the LMEvents comment up to the version line */
const a = v4.indexOf('/* LMEvents: hooks'), b = v4.indexOf('window.OgVer', a);
const spectMethods = ['    terminate(reason) {', '    beforecalculation() {'].map((m) => block(sp, m));
const appMethods = ['        multiboxchange() {', '        multiboxback() {', '        mbSelectAdjacent(dir) {', '        mbSelectPlayer(slot) {', '        _lmMbFocus(sp) {'].map((m) => block(v4, m)).filter(Boolean);
if (a < 0 || b < 0 || spectMethods.some((m) => !m) || appMethods.length < 5) { console.log('FAIL code not found'); process.exit(1); }

function env(o) {
    o = o || {};
    const ctx = { console, toastr: {}, Date, menuShown: 0 };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(v4.slice(a, b), ctx);
    vm.runInContext('window.Unit = class Unit { constructor(n) { this.number = n; this.player = true; this.active = true; this.cells = 0; this.respawns = 0; }\n' +
        'getOwnPlayerCells() { return new Array(this.cells); }\ncalculatePlayerMassAndPosition() { }\nrespawn() { this.respawns++; }\n' +
        spectMethods.join('\n') + '\n}\n' +
        'var application = window.application = { hideMenu() { }, showMenu() { window.menuShown++; }, cacheCustomSkin() { }, mbSlots: [0, 1, 2], selectedOldProfile: 0,\n' +
        appMethods.join(',\n') + '};\n' +
        'var legendmod = window.legendmod = { play: true, multiBoxPlayerExists: true }, LM = legendmod;\n' +
        'var profiles = [], ogarcopythelb = {}; function play() { legendmod.play = true; }', ctx);
    ctx.legendmod.play = o.mainAlive !== false;
    ctx.spects.length = 0;
    for (let n = 1; n <= (o.units || 2); n++) {
        const u = new ctx.Unit(n);
        /* o.slots: each unit in a player slot, as addBox makes them (slot = number + 1) */
        if (o.slots) { const r = ctx.lmMbPlayers.reserve(); u.slotId = r.slotId; u.slotEpoch = r.slotEpoch; ctx.lmMbPlayers.attach(u); }
        ctx.spects.push(u);
    }
    ctx.multiboxPlayerEnabled = o.focus || null;
    const got = [];
    ctx.LMEvents.on('multiboxSwap', (d) => got.push(d.unit + '<' + d.previous));
    return { ctx, got, unit: (n) => ctx.spects[n - 1] };
}

/* a focused unit dies while the main player lives: the focus goes back to the main player */
{
    const e = env({ focus: 2, mainAlive: true });
    e.unit(2).terminate();
    check('focused unit dies, main alive: one event back to the main player', e.got.join() === '0<2' && !e.ctx.multiboxPlayerEnabled, e.got.join() + ' focus=' + e.ctx.multiboxPlayerEnabled);
}
/* main player dead: the focus goes to the next living unit, in one event */
{
    const e = env({ focus: 1, mainAlive: false });
    e.unit(1).terminate();
    check('focused unit dies, main dead: one event to the next living unit', e.got.join() === '2<1' && e.ctx.multiboxPlayerEnabled === 2, e.got.join() + ' focus=' + e.ctx.multiboxPlayerEnabled);
}
/* a Full Map tile / in-game spectator (player false) is never a surviving unit: with the main player
 * dead, the only unit dying (focused, or found without cells) leaves the focus on the main player and
 * opens the menu, even with a spectator flagged active in spects before it */
for (const how of ['terminate', 'beforecalculation']) {
    const e = env({ focus: 16, mainAlive: false });
    const tile = new e.ctx.Unit(1); tile.player = false; tile.tile = 0;
    const unit = new e.ctx.Unit(16);
    e.ctx.spects.length = 0;
    e.ctx.spects.push(tile, unit);
    if (how === 'terminate') unit.terminate();
    else { unit.active = false; unit.beforecalculation(); }
    check('only unit (16, after tile 1) dies via ' + how + ', main dead: focus back to the main player, never the tile' + (how === 'terminate' ? ', menu shown' : ''),
        e.got.join() === '0<16' && !e.ctx.multiboxPlayerEnabled && (how !== 'terminate' || e.ctx.menuShown === 1), e.got.join() + ' menu=' + e.ctx.menuShown);
}
/* a unit without the focus dies: nothing changes, no event */
{
    const e = env({ focus: 2, mainAlive: true });
    e.unit(1).terminate();
    check('unit without the focus dies: no event', e.got.length === 0 && e.ctx.multiboxPlayerEnabled === 2, e.got.join());
}
/* "Auto-switch focus after death" on, three players: the focused unit dies while the main player
 * and the other unit live: the next living player after it in slot order (the other unit), in one
 * event; it used to be the main player whenever that one played */
{
    const e = env({ focus: 1, mainAlive: true, units: 2, slots: true });
    e.unit(1).terminate();
    check('three players, focused P2 dies, P1 and P3 alive: one event to P3 (next in slot order, not P1 first)', e.got.join() === '2<1' && e.ctx.multiboxPlayerEnabled === 2,
        e.got.join() + ' focus=' + e.ctx.multiboxPlayerEnabled);
}
/* "Auto-switch focus after death" off: the death alone moves nothing (no event), also over the
 * next updates without own cells; a lost socket still hands the focus on */
{
    const e = env({ focus: 1, mainAlive: true, units: 2, slots: true });
    e.ctx.defaultmapsettings = { mbSwitchAfterDeath: false };
    e.unit(1).socket = {};
    e.unit(1).terminate();
    e.unit(1).cells = 0;
    e.unit(1).beforecalculation(); e.unit(1).beforecalculation();
    check('switch after death off: the focused unit dies, others alive: no event, it keeps the focus', e.got.length === 0 && e.ctx.multiboxPlayerEnabled === 1, e.got.join());
    e.unit(1).active = true;
    e.unit(1).terminate('disconnect');
    check('    ... its socket drops then: the focus goes on to a living player (P1), one event', e.got.join() === '0<1' && !e.ctx.multiboxPlayerEnabled, e.got.join());
}
/* focused unit lost its cells (beforecalculation) while the main is dead: next living unit */
{
    const e = env({ focus: 1, mainAlive: false });
    e.unit(1).cells = 0;
    e.unit(1).beforecalculation();
    check('focused unit without cells hands the focus on: one event', e.got.join() === '2<1', e.got.join());
}
/* first spawn of a unit: it takes the focus */
{
    const e = env({ focus: null, mainAlive: true });
    e.unit(2).cells = 3;
    e.unit(2).beforecalculation();
    check('first spawn of a unit takes the focus: one event', e.got.join() === '2<0' && e.ctx.multiboxPlayerEnabled === 2, e.got.join());
    e.unit(2).openSecond = false;
    e.unit(2).beforecalculation();
    check('spawn of the already focused unit: no second event', e.got.length === 1, e.got.join());
}
/* the first spawn waits for the unit's place on the map (spect.js _lmSpawnHold, up to 3 s; a
 * stand-in here): the switch key (the phone P1/P2 indicator) pressed meanwhile is not undone when
 * it goes through; the indicator ended on P2 while P1 was controlled */
{
    const held = (u) => { u.cells = 3; u._lmHeld = true; u._lmSpawnHold = function () { return this._lmHeld; }; u.beforecalculation(); };
    const go = (u) => { u._lmHeld = false; u.beforecalculation(); };
    let e = env({ focus: null, mainAlive: true, units: 1, slots: true });
    held(e.unit(1));
    check('first spawn held: no event, P1 controlled', e.got.length === 0 && !e.ctx.multiboxPlayerEnabled, e.got.join());
    go(e.unit(1));
    check('    ... no choice meanwhile: the unit takes the focus when it goes through, one event', e.got.join() === '1<0' && e.ctx.multiboxPlayerEnabled === 1, e.got.join());
    e = env({ focus: null, mainAlive: true, units: 1, slots: true });
    held(e.unit(1));
    e.ctx.application.multiboxchange(); e.ctx.application.multiboxchange();
    go(e.unit(1));
    check('switch key P2 then P1 while the first spawn is held: P1 stays controlled, no event after the last switch', e.got.join() === '1<0,0<1' && !e.ctx.multiboxPlayerEnabled &&
        e.ctx.lmMbPlayers.activeSlot === 1, e.got.join() + ' focus=' + e.ctx.multiboxPlayerEnabled);
    e = env({ focus: null, mainAlive: true, units: 1, slots: true });
    held(e.unit(1));
    e.ctx.application.multiboxchange();
    go(e.unit(1));
    check('switch key to P2 while its first spawn is held: P2 controlled, no second event at the spawn', e.got.join() === '1<0' && e.ctx.multiboxPlayerEnabled === 1, e.got.join());
}
/* swap / back hotkeys: one event each */
{
    const e = env({ focus: null, mainAlive: true, units: 2 });
    e.ctx.application.multiboxchange();
    e.ctx.application.multiboxchange();
    e.ctx.application.multiboxchange();
    check('swap hotkey: one event per swap (0 -> 1 -> 2 -> 0)', e.got.join() === '1<0,2<1,0<2', e.got.join());
    e.got.length = 0;
    e.ctx.application.multiboxback();
    check('back hotkey: one event', e.got.join() === '2<0', e.got.join());
}
/* "Inactive players" (mbInactive, lmMbInactiveMoves) around the swap hotkey: the player the key
 * leaves runs on toward where its cursor was (Keep moving, the shipped choice) or holds where it is
 * (Stay still), for the main player (LM.sendPosition) and a unit (spect.js sendCursor) alike */
{
    const head = '        sendPosition(cell, target2, specialcommand, periodic) {';
    const st = v4.indexOf(head);
    const mm = st < 0 ? null : /\n        [A-Za-z_$][\w$]*\([^)]*\) \{\n/.exec(v4.slice(st + head.length));
    const sendPos = mm ? v4.slice(st, st + head.length + mm.index).trim().replace(/,\s*$/, '') : null;
    const cursorM = block(sp, '    sendCursor() {'), rule = block(v4, 'function lmMbInactiveMoves() {');
    /* the unit's real aim (_lmAimSend, _lmKeepAim, _lmAimTarget): Keep moving runs on by the aim it sent */
    const aimM = ['    _lmAimSend() {', '    _lmKeepAim(rx, ry) {', '    _lmCentreOk() {', '    _lmAimTarget() {'].map((m) => block(sp, m));
    if (!sendPos || !cursorM || !rule || aimM.some((m) => !m)) check('sendPosition / sendCursor / _lmAimSend / lmMbInactiveMoves found', false);
    else {
        const run = (choice, straight) => {
            const e = env({ focus: null, mainAlive: true, units: 1 }), c = e.ctx, sent = [];
            c.defaultmapsettings = choice === undefined ? {} : { mbInactive: choice };
            c.sent = sent;
            let tick = null;
            c.setInterval = (f) => { tick = f; return 1; };
            c.clearInterval = () => { };
            vm.runInContext(rule + '\nObject.assign(legendmod, { ' + sendPos + ',\n' +
                ' isSocketOpen() { return true; }, connectionOpened: true, clientKey: 1, integrity: false, vector: [[0, 0]], vnr: 0, serverType: "garix", pause: false,\n' +
                ' createView(n) { return new DataView(new ArrayBuffer(n)); }, sendBuffer(v) { sent.push("P1 " + v.getInt32(3, true) + "," + v.getInt32(7, true)); },\n' +
                ' playerX: 1000, playerY: 1000, viewXTrue: 1000, viewYTrue: 1000, cursorX: 4000, cursorY: 1000, distX: 0, distY: 0 });\n' +
                'window.userBots = {};\n' +
                'var _lmC = (class { ' + cursorM + '\n' + aimM.join('\n') + ' }).prototype; Unit.prototype.sendCursor = _lmC.sendCursor;\n' +
                'Unit.prototype._lmAimSend = _lmC._lmAimSend; Unit.prototype._lmKeepAim = _lmC._lmKeepAim; Unit.prototype._lmAimTarget = _lmC._lmAimTarget; Unit.prototype._lmCentreOk = _lmC._lmCentreOk;\n' +
                'Object.assign(Unit.prototype, { convertX(x) { return x; }, convertY(y) { return y; }, rawToWorldX(x) { return x; }, rawToWorldY(y) { return y; },\n' +
                ' worldToRawX(x) { return x; }, worldToRawY(y) { return y; }, sendPosition(x, y) { sent.push("P2 " + Math.round(x) + "," + Math.round(y)); return true; } });', c);
            const u = e.unit(1);
            u.playerX = 2000; u.playerY = 2000;
            /* P1 controlled: its offset to the cursor (+3000, 0); P2 controlled: its own (+500, +300) */
            c.legendmod.distX = 3000; c.legendmod.distY = 0;
            u.sendCursor();
            c.application.multiboxchange();
            c.legendmod.cursorX = 2500; c.legendmod.cursorY = 2300;
            /* straight: P2 steered with Limit position (down-right of it: +50000, +50000) */
            c.followStraight = !!straight;
            sent.length = 0;
            tick();
            const p2 = sent.join();
            sent.length = 0;
            c.legendmod.sendPosition();
            const main = sent.join();
            c.application.multiboxchange();
            sent.length = 0;
            tick();
            return [main, sent.join(), e.got.join(), p2];
        };
        const mv = run('move'), st = run('stay'), def = run(undefined), ls = run('move', true);
        check('Keep moving: after the swap to P2, P1 runs on toward its cursor point (+3000, 0)', mv[0] === 'P1 4000,1000' && mv[2] === '1<0,0<1', mv.join(' | '));
        check('Keep moving: after the swap back, P2 runs on by its offset (+500, +300)', mv[1] === 'P2 2500,2300', mv[1]);
        check('Stay still: after the swap to P2, P1 holds at its centre', st[0] === 'P1 1000,1000', st[0]);
        check('Stay still: after the swap back, P2 holds at its centre', st[1] === 'P2 2000,2000', st[1]);
        check('no saved choice: Keep moving (the shipped behaviour)', def[0] === mv[0] && def[1] === mv[1], def.join(' | '));
        check('Keep moving: P2 steered with Limit position runs on along the line it sent after the swap back (52000,52000), not toward the cursor (2500,2300)',
            ls[3] === 'P2 52000,52000' && ls[1] === 'P2 52000,52000' && ls[0] === mv[0], ls.join(' | '));
    }
}
/* the event data is the documented one */
{
    const e = env({ focus: 2, mainAlive: true });
    let data = null;
    e.ctx.LMEvents.on('multiboxSwap', (d) => { data = d; });
    e.unit(2).terminate();
    check('event data: { unit, previous, slot, previousSlot, context }', data && Object.keys(data).sort().join() === 'context,previous,previousSlot,slot,unit' && data.context === 'live', data && JSON.stringify(data));
}
/* slots: the event and lmMbPlayers.activeSlot carry the player slot (P1 the main player); a unit
 * without one is slot 2, as the single unit always was */
{
    const e = env({ focus: null, mainAlive: true, units: 3, slots: true });
    const got = [];
    e.ctx.LMEvents.on('multiboxSwap', (d) => got.push(d.slot + '<' + d.previousSlot));
    e.ctx.application.multiboxchange();
    e.ctx.application.multiboxchange();
    e.ctx.application.multiboxback();
    check('slots: the swap event says slot and previous slot (P1 -> P2 -> P3 -> P2)', got.join() === '2<1,3<2,2<3' && e.ctx.lmMbPlayers.activeSlot === 2, got.join());
    const l = env({ focus: 2, mainAlive: true, units: 2 });
    let d = null;
    l.ctx.LMEvents.on('multiboxSwap', (x) => { d = x; });
    l.ctx.lmSetMbUnit(1);
    check('a unit without a slot is P2, as before', d && d.slot === 2 && d.unit === 1, d && JSON.stringify(d));
}
/* two players (main + one unit): the switch keys go P1 <-> P2 whatever their state, a dead target
 * spawns again (respawn(), or play() for the main player). A dead unit chosen while P1 plays is a
 * choice that waits (handoff 2026-11-28 section 2): P1 keeps the control until the unit spawns, then
 * the unit takes it once; the switch key again ends that choice. */
{
    const e = env({ focus: null, mainAlive: true, units: 1, slots: true });
    const u = e.unit(1);
    u.active = false;
    e.ctx.application.multiboxchange();
    check('two players, P1 alive: the swap to the dead unit spawns it, P1 keeps the control meanwhile (no swap event)', !e.ctx.multiboxPlayerEnabled && u.respawns === 1 &&
        pendOf(e.ctx) === u && e.got.length === 0, e.ctx.multiboxPlayerEnabled + ' ' + u.respawns);
    u.active = true; u.cells = 2; u.openSecond = false; u.beforecalculation();
    check('    ... its spawn: the unit controlled, one event', e.ctx.multiboxPlayerEnabled === 1 && e.got.join() === '1<0' && !pendOf(e.ctx), e.got.join());
    {
        const t = env({ focus: null, mainAlive: true, units: 1, slots: true }), w = t.unit(1);
        w.active = false;
        t.ctx.application.multiboxchange(); t.ctx.application.multiboxchange();
        w.active = true; w.cells = 2; w.openSecond = false; w.beforecalculation();
        check('    ... the swap twice while it is dead (P2 then back to P1): the choice ended, its spawn takes nothing', !t.ctx.multiboxPlayerEnabled && t.got.length === 0 && !pendOf(t.ctx), t.got.join());
    }
    e.ctx.legendmod.play = false;
    e.ctx.application.multiboxback();
    check('two players: back to the dead main player spawns it (play)', !e.ctx.multiboxPlayerEnabled && e.ctx.legendmod.play === true);
}
/* more players: the switch keys pass the dead (and connecting) ones; choosing a dead slot itself
 * spawns it; with nobody else alive the next one is taken and spawned, as with two */
{
    const e = env({ focus: null, mainAlive: true, units: 4, slots: true });
    e.unit(2).active = false; e.unit(3).active = null;
    const seen = [];
    for (let i = 0; i < 4; i++) { e.ctx.application.multiboxchange(); seen.push(e.ctx.multiboxPlayerEnabled || 0); }
    check('five players, P3 dead and P4 connecting: next goes P1 -> P2 -> P5 -> P1 -> P2', seen.join() === '1,4,0,1' && e.unit(2).respawns === 0 && e.unit(3).respawns === 0, seen.join());
    const back = [];
    for (let i = 0; i < 3; i++) { e.ctx.application.multiboxback(); back.push(e.ctx.multiboxPlayerEnabled || 0); }
    check('    ... back the same players the other way (P2 -> P1 -> P5 -> P2)', back.join() === '0,4,1', back.join());
    check('    ... choosing the dead P3 itself (P2 plays): it spawns again, P2 keeps the control until it spawns', e.ctx.application.mbSelectPlayer(3) === true && e.ctx.multiboxPlayerEnabled === 1 &&
        e.unit(2).respawns === 1 && pendOf(e.ctx) === e.unit(2));
    check('    ... an empty slot cannot be chosen', e.ctx.application.mbSelectPlayer(6) === false && e.ctx.multiboxPlayerEnabled === 1 && pendOf(e.ctx) === e.unit(2));
    for (let n = 1; n <= 4; n++) e.unit(n).active = false;
    e.ctx.legendmod.play = false;
    e.ctx.application.mbSelectPlayer(1);
    e.ctx.legendmod.play = false;
    e.ctx.application.multiboxchange();
    check('    ... nobody alive: the next player (P2) is taken and spawned, as with two', e.ctx.multiboxPlayerEnabled === 1 && e.unit(1).respawns === 1, e.ctx.multiboxPlayerEnabled);
}
/* the switch keys with nothing alive: the death menu stays over the dead unit they choose (its spawn
 * hides it, the latch), and a captcha on that spawn (lmMbRemoveUnit) shows the menu again; the
 * switch hid the menu first and the removal of a dead unit showed none, so there was no menu */
{
    for (const key of ['multiboxchange', 'multiboxback']) {
        const e = env({ focus: null, mainAlive: false, units: 2, slots: true });
        let hidden = 0;
        e.ctx.application.hideMenu = () => { hidden++; };
        e.unit(1).active = false; e.unit(2).active = false;
        e.ctx._lmMbDeathMenuAt = 0;
        e.ctx.application[key]();
        const t = e.ctx.lmMbFocused();
        check(key + ', nothing alive: the dead unit chosen, the menu stays, its latch set', hidden === 0 && t && t.player && t.respawns === 1 && !!e.ctx._lmMbDeathMenuAt,
            hidden + ' hidden, focus ' + e.ctx.multiboxPlayerEnabled);
        const shown = e.ctx.menuShown;
        e.ctx.lmMbRemoveUnit(t, 'removed');
        check('    ... it meets a captcha and is removed: the menu is shown, the focus back on P1', e.ctx.menuShown === shown + 1 && !e.ctx.multiboxPlayerEnabled, e.ctx.menuShown - shown);
    }
    const e = env({ focus: null, mainAlive: true, units: 2, slots: true });
    let hidden = 0;
    e.ctx.application.hideMenu = () => { hidden++; };
    e.unit(1).active = false;
    e.ctx.application.multiboxchange();
    const shown = e.ctx.menuShown;
    e.ctx.lmMbRemoveUnit(e.unit(1), 'removed');
    check('switch key to a dead unit while the main player lives: the menu goes; its removal shows none', hidden === 1 && e.ctx.menuShown === shown, hidden + ' / ' + (e.ctx.menuShown - shown));
}
/* Q free spectate (spectateBlind) while the main player is dead and a unit has the focus: Q
 * double splits the unit and must not also toggle free spectate on the main connection */
{
    const fns = ['function getActiveSpect(', 'function lmMbSlotOf(', 'function lmMultiboxControlledPlayer(', '    function spectateBlind() {'].map((m) => block(v4, m));
    if (fns.some((f) => !f)) check('Q free spectate code found', false);
    else {
        const sent = [];
        const ctx = { console };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext('var spects = window.spects = [{ number: 1 }];\n' + fns.join('\n') + '\nspectateBlind();', ctx);
        ctx.legendmod = { play: false };
        ctx.core = { specialOn() { sent.push('spectate'); } };
        const q = { keyCode: 81, target: { tagName: 'CANVAS' } };
        ctx.multiboxPlayerEnabled = 1;
        ctx.onkeydown(q);
        check('main dead, unit 1 has the focus: Q sends no free spectate', sent.length === 0, sent.join());
        ctx.multiboxPlayerEnabled = null;
        ctx.onkeydown(q);
        check('main spectating, no unit: Q still toggles free spectate', sent.length === 1, sent.join());
    }
}

/* quick respawn (Y, the pad's Y and the phone button: application.quickResp) with multibox units
 * open: only the player you control spawns again (a dead unit: its respawn(); the dead main
 * player: Play), the units stay. It reconnected the main socket, a connection-level flush that
 * closed every unit. Without units it reconnects as before. */
{
    const fns = ['function getActiveSpect(', 'function lmActiveUnit('].map((m) => block(v4, m));
    const meths = ['        quickResp() {', '        tryResp() {'].map((m) => block(v4, m));
    if (fns.concat(meths).some((f) => !f)) check('quick respawn code found', false);
    else {
        const run = (o) => {
            const log = [];
            const ctx = { console, clicks: 0 };
            ctx.window = ctx;
            vm.createContext(ctx);
            vm.runInContext('var spects = window.spects = [];\n' + fns.join('\n') +
                '\nvar defaultmapsettings = { quickResp: true };\nvar ogario, legendmod;\n' +
                'var $ = function (s) { return { is() { return false; }, click() { window.clicks++; } }; };\n' +
                'var application = window.application = { ws: "wss://x", hideMenu() { }, gameServerConnect(u) { window.log.push("reconnect " + u); },\n' + meths.join(',\n') + '};', ctx);
            ctx.log = log;
            ctx.setTimeout = (f) => { log.push('tryResp'); return 1; };
            ctx.clearTimeout = () => { };
            ctx.legendmod = { play: o.mainAlive, socket: {} };
            vm.runInContext('ogario = legendmod = window.legendmod;', ctx);
            (o.units || []).forEach((u) => ctx.spects.push(Object.assign({ player: true, active: true, socket: {}, playerCellIDs: [], respawn() { log.push('respawn ' + this.number); } }, u)));
            ctx.multiboxPlayerEnabled = o.focus || null;
            ctx.application.quickResp();
            return { log: log.join(), units: ctx.spects.length, play: ctx.legendmod.play };
        };
        let r = run({ mainAlive: true, focus: 2, units: [{ number: 2, active: false }, { number: 3 }] });
        check('quick respawn, a dead unit selected: only that unit respawns, no reconnect, the units stay', r.log === 'respawn 2' && r.units === 2 && r.play === true, r.log);
        r = run({ mainAlive: false, focus: null, units: [{ number: 2 }] });
        check('quick respawn, the dead main player selected: Play (tryResp), no reconnect, the unit stays', r.log === 'tryResp' && r.units === 1, r.log);
        r = run({ mainAlive: true, focus: 2, units: [{ number: 2 }] });
        check('quick respawn, the selected unit alive: nothing (no reconnect of everything)', r.log === '', r.log);
        r = run({ mainAlive: true, focus: null, units: [{ number: 2, player: false }] });
        check('quick respawn without units (a spectator only): reconnects as before', r.log === 'reconnect wss://x,tryResp' && r.play === false, r.log);
    }
}
/* decision 8: lmMbSteersLiving, the one test the death menus and the spectate click / tap ask (the
 * player you control is a living multibox unit, whatever the main player does) */
{
    const e = env({ focus: 2, mainAlive: false, units: 2 });
    const f = e.ctx.lmMbSteersLiving;
    if (typeof f !== 'function') check('lmMbSteersLiving found', false);
    else {
        const r = [];
        r.push(f());
        e.ctx.legendmod.isSpectateEnabled = true; r.push(f());
        e.ctx.legendmod.play = true; e.ctx.legendmod.isSpectateEnabled = false; r.push(f());
        check('steering a living unit: P1 dead, P1 spectating, P1 alive: yes', r.join() === 'true,true,true', r.join());
        const no = [];
        e.ctx.multiboxPlayerEnabled = null; no.push(f());
        e.ctx.multiboxPlayerEnabled = 2; e.unit(2).active = false; no.push(f());
        e.unit(2).active = null; no.push(f());
        e.unit(2).active = true; e.unit(2).player = false; no.push(f());
        e.ctx.multiboxPlayerEnabled = 9; no.push(f());
        check('    ... P1 selected, the selected unit dead / connecting / a spectator, a number without a unit: no', no.join() === 'false,false,false,false,false', no.join());
    }
    /* P1 dead with the death menu up, or spectating: the switch key to the living P2 hides the menu
     * (its mouse buttons, pad and phone buttons work again) and spawns nothing */
    for (const spec of [false, true]) {
        const s = env({ focus: null, mainAlive: false, units: 2 });
        let hidden = 0;
        s.ctx.application.hideMenu = () => { hidden++; };
        s.ctx.legendmod.isSpectateEnabled = spec;
        s.unit(1).active = false;
        s.ctx.application.multiboxchange();
        check('P1 ' + (spec ? 'spectating' : 'dead') + ', the switch key: the living P2 controlled, the menu hidden, nothing spawned',
            s.ctx.multiboxPlayerEnabled === 2 && hidden === 1 && s.unit(2).respawns === 0 && s.unit(1).respawns === 0 && s.ctx.legendmod.play === false,
            s.ctx.multiboxPlayerEnabled + ' / ' + hidden);
    }
}

/* Handoff 2026-11-28 section 2, the exact reproduction: application._lmMbFocus from production with
 * lmMbUnits() giving one unit, lmSetMbUnit() recording the source chosen, legendmod.play true, no
 * profiles; the target { number: 16, active: true, transformReady: () => false } (a unit of ours: in
 * spects), the focus on P1. The focus went to 16 with its orientation not verified. */
{
    const focus = block(v4, '        _lmMbFocus(sp) {');
    const ctx = { console, toastr: {}, Date };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(v4.slice(a, b), ctx);
    vm.runInContext('var legendmod = window.legendmod = { play: true }, LM = legendmod, profiles = [];\nfunction play() { }\n' +
        'var application = window.application = { ' + focus + ' };', ctx);
    const target = { number: 16, active: true, player: true, transformReady: () => false, respawn() { this.respawns = (this.respawns || 0) + 1; } };
    ctx.spects.length = 0; ctx.spects.push(target);
    const set = [];
    ctx.lmMbUnits = (out) => { out = out || []; out.length = 0; out.push(target); return out; };
    ctx.lmSetMbUnit = (n) => { set.push(+n || 0); ctx.multiboxPlayerEnabled = +n || null; };
    ctx.multiboxPlayerEnabled = null;
    ctx.application._lmMbFocus(target);
    check('reproduction (handoff section 2): _lmMbFocus on a unit not verified while P1 plays: no focus change, the choice waits for its verification',
        set.indexOf(16) < 0 && !ctx.multiboxPlayerEnabled && target._lmFocusWait === 1 && !!target._lmWantFocusAt && !target.respawns, set.join() + ' / ' + ctx.multiboxPlayerEnabled);
}

console.log(failed ? failed + ' failed' : 'all multiboxSwap checks passed');
process.exit(failed ? 1 : 0);
