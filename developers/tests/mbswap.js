/* LMEvents 'multiboxSwap' for every change of the multibox unit you control, with the real code cut
 * out of ogario/ogario.v4.js (LMEvents, lmSetMbUnit, application.multiboxchange / multiboxback) and
 * ogario/spect.js (terminate, beforecalculation). The event came only from the swap / back hotkeys and
 * the switch after the main player died, so the phone P1/P2 indicator kept the old unit when the
 * controlled unit died or a unit took the focus at its spawn.
 * Cases: a focused unit dies while the main player lives (back to 0) or is dead (to the next living
 * unit, one event, not 0 and then the unit), the first spawn of a unit takes the focus, a unit dying
 * without the focus and a respawn of the focused unit send nothing, swap / back send one event each,
 * a Full Map tile (player false) is never taken for a surviving unit.
 * node developers/tests/mbswap.js [ogario.v4.js] [spect.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const v4 = read(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'));
const sp = read(process.argv[3] || path.join(root, 'ogario', 'spect.js'));
let failed = 0;
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
const spectMethods = ['    terminate() {', '    beforecalculation() {'].map((m) => block(sp, m));
const appMethods = ['        multiboxchange() {', '        multiboxback() {', '        _lmEvMbSwap(prev) {'].map((m) => block(v4, m)).filter(Boolean);
if (a < 0 || b < 0 || spectMethods.some((m) => !m) || appMethods.length < 2) { console.log('FAIL code not found'); process.exit(1); }

function env(o) {
    o = o || {};
    const ctx = { console, toastr: {}, Date, menuShown: 0 };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(v4.slice(a, b), ctx);
    vm.runInContext('window.Unit = class Unit { constructor(n) { this.number = n; this.player = true; this.active = true; this.cells = 0; }\n' +
        'getOwnPlayerCells() { return new Array(this.cells); }\ncalculatePlayerMassAndPosition() { }\n' +
        spectMethods.join('\n') + '\n}\n' +
        'var application = window.application = { hideMenu() { }, showMenu() { window.menuShown++; }, cacheCustomSkin() { }, mbSlots: [0, 1, 2], selectedOldProfile: 0,\n' +
        appMethods.join(',\n') + '};\n' +
        'var legendmod = window.legendmod = { play: true, multiBoxPlayerExists: true }, LM = legendmod;\n' +
        'var profiles = [], ogarcopythelb = {}; function play() { legendmod.play = true; }', ctx);
    ctx.legendmod.play = o.mainAlive !== false;
    ctx.spects.length = 0;
    for (let n = 1; n <= (o.units || 2); n++) ctx.spects.push(new ctx.Unit(n));
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
/* the event data is the documented one */
{
    const e = env({ focus: 2, mainAlive: true });
    let data = null;
    e.ctx.LMEvents.on('multiboxSwap', (d) => { data = d; });
    e.unit(2).terminate();
    check('event data: { unit, previous, context }', data && Object.keys(data).sort().join() === 'context,previous,unit' && data.context === 'live', data && JSON.stringify(data));
}
/* Q free spectate (spectateBlind) while the main player is dead and a unit has the focus: Q
 * double splits the unit and must not also toggle free spectate on the main connection */
{
    const fns = ['function getActiveSpect(', 'function lmMultiboxControlledPlayer(', '    function spectateBlind() {'].map((m) => block(v4, m));
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

console.log(failed ? failed + ' failed' : 'all multiboxSwap checks passed');
process.exit(failed ? 1 : 0);
