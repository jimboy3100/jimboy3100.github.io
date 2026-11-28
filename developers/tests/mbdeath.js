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
 *   profiles, enabling; what today's code can not do yet is listed as known (section 6).
 * - A spectator with its active flag set is no living player (lmMbAlive): never focused, and the
 *   last unit's death still shows the menu.
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
const idxFilter = block(v4, '    function lmIdxFilter(');
if (a < 0 || b < 0 || !respawn || appMethods.some((m) => !m) || !deathSwitch || !ucElse || !idxFilter) { console.log('FAIL code not found'); process.exit(1); }
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
        'function lmIdxClear(a) { return []; }\n' + idxFilter + '\n' +
        'var legendmod = window.legendmod = { play: true, multiBoxPlayerExists: true, playerCells: [], cells: [], food: [], viruses: [], removedCells: [], indexedCells: {} }, LM = legendmod;\n' +
        'var profiles = [], ogarcopythelb = {}; function play() { legendmod.play = true; }\n' +
        'window.mainDies = function () { legendmod.play = false; ' + ucElse.slice(4) + ' };', ctx);
    const u = new ctx.Unit(1); u.active = o.unitAlive;
    ctx.spects.length = 0; ctx.spects.push(u);
    ctx.multiboxPlayerEnabled = null;
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
    /* fading removed cells: the main connection's go, the unit's stay with their new slots
     * (the frame drops a hidden one only when its slot is right) */
    const rm = [{ spectator: 0 }, { spectator: 1 }, { spectator: 0 }, { spectator: 1 }];
    const d = death({ unitAlive: true, removed: rm.slice() });
    const kept = d.legendmod.removedCells;
    check('main dies, the unit lives: its fading cells stay listed with their slots, the main ones leave the list',
        kept.length === 2 && kept.every((c, i) => c.spectator === 1 && c._removedIdx === i) && rm[0]._removedIdx === -1 && rm[2]._removedIdx === -1,
        kept.map((c) => c._removedIdx).join(',') + ' / ' + rm.map((c) => c._removedIdx).join(','));
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

/* 4. a unit that dies and respawns on the same socket (spect.js terminate, beforecalculation,
 * calculatePlayerMassAndPosition, recalculatePlayerMass) */
{
    const term = block(sp, '    terminate() {'), before = block(sp, '    beforecalculation() {');
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
 * - enabling multibox opens one controlled unit and keeps Full Map; K playing clients can be opened.
 * Configurations today's code fails are marked KNOWN with the reason (lib/mbplayers.js verdict). */
{
    const MB = require('./lib/mbplayers');
    const opt = { v4: process.argv[2], sp: process.argv[3], app: true };
    const PROFILES = 'KNOWN N>2: the third and later units play the second profile: ensureMbSlots keeps 2 slots (ogario.v4.js:26538 ' +
        'Math.min(multiboxAmount, 2)) and the slot is looked up by unit number with selectedOldProfile as fallback (ogario.v4.js:24585 / 24640, spect.js:2080 / 3032)';
    const ADD = 'KNOWN N>2: no Add Player: spect.js:391 addBox() runs only from multiboxchange / multiboxback while no unit exists ' +
        '(ogario.v4.js:24543 / 24599), so a third to sixth player can not be opened';
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
            const skins = app.skins.slice();
            for (let i = 0; i < K; i++) { app.multiboxback(); back.push(s.focus()); }
            check(tag + ': the switch keys visit every player once, in order, both ways',
                fwd.join() === units.concat([0]).join() && back.join() === units.slice().reverse().concat([0]).join(), fwd + ' / ' + back);
            MB.verdict(check, tag + ': each unit plays its own profile', skins.length === K - 1 && new Set(skins).size === skins.length && !skins.includes('prof0'),
                skins.join(','), K > 2 ? PROFILES : undefined);
        }
        {
            const s = MB.scene(Object.assign({ players: 1, fullMap: fm }, opt));
            const app = s.ctx.application, units = () => s.ctx.spects.filter((u) => u && u.player);
            app.multiboxchange();
            const u = units(), open = s.ctx.spects.filter((x) => x && !x.player && !x.closed).length;
            MB.verdict(check, tag + ': enabling multibox opens one unit, controlled, and keeps Full Map',
                u.length === 1 && s.focus() === u[0].number && open === tiles, u.length + ' unit, focus ' + s.focus() + ', tiles ' + open + ' of ' + tiles);
            if (K > 2) {
                /* the switch key is the only control that opens a unit */
                for (let i = 2; i < K; i++) app.multiboxchange();
                MB.verdict(check, tag + ': ' + K + ' playing clients can be opened', units().length === K - 1, (units().length + 1) + ' playing', ADD);
            }
        }
    }
    console.log('info 1 to 6 players x Full Map off / on: ' + (Date.now() - t0) + ' ms');
}
/* 6. a spectator (Full Map tile, in-game spectator) with its active flag set is never a living
 * player (lmMbAlive): terminate and beforecalculation skip it for the focus and the last-death menu */
{
    const term = block(sp, '    terminate() {'), before = block(sp, '    beforecalculation() {');
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

console.log(failed ? failed + ' failed' : 'all multibox death checks passed');
process.exit(failed ? 1 : 0);
