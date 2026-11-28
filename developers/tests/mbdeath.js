/* Multibox with the main player dead or paused, with the real code cut out of ogario/ogario.v4.js
 * (updateCells death handling, onPlayerDeath's switch, multiboxchange / multiboxswap, LM.sendPosition,
 * the main socket's opcode 17, getMultiboxFrame) and ogario/spect.js (respawn).
 * - The main player dies while the unit is dead too: the death menu, no spawn of the dead unit
 *   (multiboxswap hid the menu and spawned it, also with "Background auto-respawn" off).
 * - Pause with the focus on the unit: the main player holds too (it kept its keep-moving offset).
 * - Opcode 17 with no multibox frame (both players dead, spectating, "View on middle of both"):
 *   the camera follows the server's view (it stayed frozen).
 * - A unit that dies and respawns on the same socket while the main player is dead takes the
 *   focus again (terminate, beforecalculation); with the main player alive it does not.
 * node developers/tests/mbdeath.js [ogario.v4.js] [spect.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const v4 = read(process.argv[2] || path.join(root, 'ogario', 'ogario.v4.js'));
const sp = read(process.argv[3] || path.join(root, 'ogario', 'spect.js'));
let failed = 0;
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

/* 1. death of the main player: updateCells (all other servers) after onPlayerDeath's switch */
const a = v4.indexOf('/* LMEvents: hooks'), b = v4.indexOf('window.OgVer', a);
const respawn = block(sp, '    respawn() {');
const appMethods = ['        multiboxchange() {', '        multiboxswap() {'].map((m) => block(v4, m));
const deathSwitch = block(v4, "if (defaultmapsettings.mbSwitchAfterDeath && typeof spects !== 'undefined' && spects && spects.length > 0) {");
const k = v4.indexOf('ALL OTHER SERVERS');
const ucElse = k < 0 ? null : block(v4, 'else {', k);
if (a < 0 || b < 0 || !respawn || appMethods.some((m) => !m) || !deathSwitch || !ucElse) { console.log('FAIL code not found'); process.exit(1); }
function death(o) {
    const ctx = { console: { log: noop, warn: noop }, toastr: {}, Date, menuShown: 0, menuHidden: 0, respawns: 0 };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(v4.slice(a, b), ctx);
    vm.runInContext('window.Unit = class Unit { constructor(n) { this.number = n; this.player = true; this.active = true; }\n' +
        'isSocketOpen() { return true; }\nhandleSendNick() { window.respawns++; }\n' + respawn + '\n}\n' +
        'var defaultmapsettings = window.defaultmapsettings = { mbSwitchAfterDeath: true, mbAutoRespawn: false };\n' +
        'var application = window.application = { hideMenu() { window.menuHidden++; }, showMenu() { window.menuShown++; }, mbSlots: [0, 1], selectedOldProfile: 0,\n' +
        'onPlayerDeath() {\n' + deathSwitch + '\n},\n' + appMethods.join(',\n') + '};\n' +
        'function lmIdxClear(a) { return []; } function lmIdxFilter(a, p, f) { return a.filter(f); }\n' +
        'var legendmod = window.legendmod = { play: true, multiBoxPlayerExists: true, playerCells: [], cells: [], food: [], viruses: [], removedCells: [], indexedCells: {} }, LM = legendmod;\n' +
        'var profiles = [], ogarcopythelb = {}; function play() { legendmod.play = true; }\n' +
        'window.mainDies = function () { legendmod.play = false; ' + ucElse.slice(4) + ' };', ctx);
    const u = new ctx.Unit(1); u.active = o.unitAlive;
    ctx.spects.length = 0; ctx.spects.push(u);
    ctx.multiboxPlayerEnabled = null;
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
}

/* 2. Pause: LM.sendPosition with the focus on the main player or on the unit */
{
    const head = '        sendPosition(cell, target2, specialcommand, periodic) {';
    const st = v4.indexOf(head);
    const mm = st < 0 ? null : /\n        [A-Za-z_$][\w$]*\([^)]*\) \{\n/.exec(v4.slice(st + head.length));
    if (!mm) { console.log('FAIL sendPosition not found'); process.exit(1); }
    const m = v4.slice(st, st + head.length + mm.index).trim().replace(/,\s*$/, '');
    const sendFor = (focus, pause) => {
        const ctx = { console: { log: noop }, Date };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext('var defaultmapsettings = { multiKeepMoving: true, mbFreeze: false };\n' +
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
    check('no Pause, focus on the unit: the main player keeps moving (Keep moving on)', sendFor(1, false) === '4000,1000', sendFor(1, false));
}

/* 3. the main socket's opcode 17 while no multibox frame drives the camera */
{
    const i0 = v4.indexOf('window.testobjectsOpcode17 = data;');
    const caseStart = v4.lastIndexOf('case 17:', i0), caseEnd = v4.indexOf('break;', v4.indexOf('this.scale = data.getFloat32(s, true);', i0));
    const frame = block(v4, '        getMultiboxFrame(mainSize) {');
    if (i0 < 0 || caseStart < 0 || caseEnd < 0 || !frame) { console.log('FAIL opcode 17 not found'); process.exit(1); }
    const body = 'do {' + v4.slice(v4.indexOf(':', caseStart) + 1, caseEnd) + '} while (0);';
    const view = (middle, focus, framed) => {
        const ctx = { console: { log: noop, warn: noop }, Date };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext('var defaultmapsettings = { middleMultiView: ' + middle + ' };\n' +
            'var legendmod = window.legendmod = { multiBoxPlayerExists: true, vector: [[0, 0]], vnr: 0, playerCells: [], viewX: 100, viewY: 100 }, LM = legendmod;\n' +
            'var spects = window.spects = [{ number: 1, player: true, playerCellIDs: [], getOwnPlayerCells() { return []; } }];\n' +
            'function getActiveSpect() { return null; }\nvar drawRender = { ' + frame + ' };\n' +
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

/* 4. a unit that dies and respawns on the same socket (spect.js terminate, beforecalculation) */
{
    const term = block(sp, '    terminate() {'), before = block(sp, '    beforecalculation() {');
    if (!term || !before) { console.log('FAIL terminate / beforecalculation not found'); process.exit(1); }
    const life = (mainAlive) => {
        const ctx = { console: { log: noop, warn: noop }, toastr: {}, Date, menuShown: 0 };
        ctx.window = ctx;
        vm.createContext(ctx);
        vm.runInContext(v4.slice(a, b), ctx);
        vm.runInContext('window.Unit = class Unit { constructor(n) { this.number = n; this.player = true; this.active = true; this.cells = 0; this.openSecond = false; }\n' +
            'getOwnPlayerCells() { return new Array(this.cells); }\ncalculatePlayerMassAndPosition() { }\n' + term + '\n' + before + '\n}\n' +
            'var application = window.application = { showMenu() { window.menuShown++; } };\n' +
            'var legendmod = window.legendmod = { play: ' + mainAlive + ' }, LM = legendmod;', ctx);
        const u = new ctx.Unit(1);
        ctx.spects.length = 0; ctx.spects.push(u);
        ctx.multiboxPlayerEnabled = null;
        u.cells = 3; u.beforecalculation();          /* first life: focus */
        const first = +ctx.multiboxPlayerEnabled || 0;
        u.cells = 0; u.terminate();                  /* dies */
        const dead = +ctx.multiboxPlayerEnabled || 0;
        u.active = true; u.cells = 3; u.beforecalculation();  /* background auto-respawn, same socket */
        return [first, dead, +ctx.multiboxPlayerEnabled || 0].join(',');
    };
    check('main dead: a unit that respawns on its socket takes the focus again (mouse and keys went to the dead main)', life(false) === '1,0,1', life(false));
    check('main alive: a background respawn of the unit does not take the focus', life(true) === '1,0,0', life(true));
}

console.log(failed ? failed + ' failed' : 'all multibox death checks passed');
process.exit(failed ? 1 : 0);
