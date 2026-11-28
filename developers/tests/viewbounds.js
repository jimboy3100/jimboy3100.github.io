/* Opponent colours and split range rings are judged against this frame's view: renderFrame
 * computes the view box (LM.camMin/Max) right after the camera moves and before compareCells,
 * which culls the cells by it. The real code runs in a vm: the piece of renderFrame from
 * setView() to the chat lookup, and LM.compareCells from ogario/ogario.v4.js.
 * node developers/tests/viewbounds.js   (LM_SRC=<ogario.v4.js> runs it on another copy) */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(process.env.LM_SRC || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (info ? '  (' + info + ')' : '')); if (!c) fail++; };

/* from a marker to the brace that closes its first block (skips strings and comments) */
function block(from) {
    const a = src.indexOf(from);
    if (a < 0) throw new Error('not found in ogario.v4.js: ' + from);
    let i = src.indexOf('{', a), depth = 0;
    for (; i < src.length; i++) {
        const ch = src[i], nx = src[i + 1];
        if (ch === '/' && nx === '/') { i = src.indexOf('\n', i); continue; }
        if (ch === '/' && nx === '*') { i = src.indexOf('*/', i + 2) + 1; continue; }
        if (ch === '"' || ch === "'" || ch === '`') { for (i++; src[i] !== ch; i++) if (src[i] === '\\') i++; continue; }
        if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) return src.slice(a, i + 1);
    }
    throw new Error('unclosed block: ' + from);
}
/* renderFrame from the camera move to the chat lookup (the cell moves run before it) */
function framePiece() {
    const a = src.indexOf('LM.cells[i].moveCell();');
    const s = src.indexOf('this.setView();', a), e = src.indexOf('/* Build chat/command lookup map once per frame', s);
    if (a < 0 || s < 0 || e < 0) throw new Error('renderFrame piece not found');
    return src.slice(s, e);
}

const g = { console, Math, Number, Infinity, NaN };
g.window = g;
vm.createContext(g);
vm.runInContext([
    'var defaultmapsettings = { oppColors: true, oppRings: true, splitRange: true, dominationRate: 1.33, dominatedRate: 0.75 };',
    'var defaultSettings = { enemyBSTEDColor: "bsted", enemyBSTEColor: "bste", enemyBColor: "b", enemySColor: "s", enemySSTEColor: "sste", enemySSTEDColor: "ssted" };',
    'var ogarcopythelb = { color: "own" };',
    'function getActiveSpect() { return null; }',
    'var LM = {', block('        compareCells() {'), '};',
    'var legendmod = LM; window.legendmod = LM;',
    'this.LM = LM;',
    'this.frame = function () {', framePiece(), '};'
].join('\n'), g);
const LM = g.LM;

/* a world at the camera: the own cell and a bigger enemy next to it */
function world(x, y) {
    const own = { id: 1, x: x, y: y, size: 100, targetX: x, targetY: y, isPlayerCell: true };
    const enemy = { id: 2, x: x + 400, y: y, size: 170, targetX: x + 400, targetY: y, oppColor: null };
    LM.play = true; LM.playerCells = [own]; LM.cells = [own, enemy];
    LM.playerMaxMass = LM.playerMinMass = 100; LM.selectBiggestCell = false;
    return enemy;
}
/* the renderer: setView moves the camera to (x, y) */
function renderer(x, y) {
    return { scale: 1, canvasWidth: 1920, canvasHeight: 1080, camX: 0, camY: 0, setView() { this.camX = x; this.camY = y; } };
}
LM.getCursorPosition = LM.sortCells = function () { };
g.fullSpectator = false; g.multiboxPlayerEnabled = false;

/* 1. the last frame looked at (0, 0), and the server's view was there too; the camera jumps
 * to (6000, 6000) (respawn, spectating another player): the enemy at the new place gets its
 * colour and its split ring in this frame */
{
    LM.camMinX = -960; LM.camMaxX = 960; LM.camMinY = -540; LM.camMaxY = 540;
    LM.srvViewMinX = -1200; LM.srvViewMaxX = 1200; LM.srvViewMinY = -700; LM.srvViewMaxY = 700;
    const enemy = world(6000, 6000);
    g.frame.call(renderer(6000, 6000));
    check('camera jump: the view box is the new one when compareCells runs', LM.camMinX === 6000 - 960 && LM.camMaxY === 6000 + 540, LM.camMinX + '..' + LM.camMaxX);
    check('camera jump: the enemy on screen gets its opponent colour in the first frame', enemy.oppColor === 'bste', String(enemy.oppColor));
    check('camera jump: and its split ring (ring list of bigger cells)', LM.biggerSTECellsCache.length === 1 && LM.biggerSTECellsCache[0].x === 6400, 'listed ' + LM.biggerSTECellsCache.length);
}

/* 2. cells inside the server's view but off the camera (zoomed in) are judged as before
 * (the last frame's calMinMax left the camera box grown by the server's view) */
{
    LM.srvViewMinX = -5000; LM.srvViewMaxX = 5000; LM.srvViewMinY = -5000; LM.srvViewMaxY = 5000;
    LM.camMinX = LM.camMinY = -5000; LM.camMaxX = LM.camMaxY = 5000;
    world(0, 0);
    const far = { id: 3, x: 4000, y: -4000, size: 170, targetX: 4000, targetY: -4000, oppColor: null };
    LM.cells.push(far);
    g.frame.call(renderer(0, 0));
    check('a cell in the server\'s view off the camera keeps its opponent colour', far.oppColor === 'bste', String(far.oppColor));
}

/* 3. without a server view (no food: NaN) only the camera box counts; a cell far away is skipped */
{
    LM.srvViewMinX = LM.srvViewMinY = LM.srvViewMaxX = LM.srvViewMaxY = NaN;
    world(0, 0);
    const far = { id: 3, x: 9000, y: 0, size: 170, targetX: 9000, targetY: 0, oppColor: null };
    LM.cells.push(far);
    g.frame.call(renderer(0, 0));
    check('no server view: a cell far off screen is skipped (no work for it)', far.oppColor === null && LM.biggerSTECellsCache.length === 1, String(far.oppColor));
}

/* 4. Full Map: the spectators bring the cells of the whole map, but only the view (and the ring
 * margin) is judged, as without it (every cell of the map was judged each frame, for colours
 * and rings nobody sees); a cell whose ring can reach the screen is judged */
{
    g.fullSpectator = true;
    LM.mapMinX = LM.mapMinY = -7071; LM.mapMaxX = LM.mapMaxY = 7071;
    LM.srvViewMinX = LM.srvViewMinY = LM.srvViewMaxX = LM.srvViewMaxY = NaN;
    world(0, 0);
    const far = { id: 3, x: 7000, y: 7000, size: 170, targetX: 7000, targetY: 7000, oppColor: null };
    const near = { id: 4, x: 960 + 700, y: 0, size: 170, targetX: 960 + 700, targetY: 0, oppColor: null };
    LM.cells.push(far, near);
    g.frame.call(renderer(0, 0));
    check('full map: a cell far off screen is skipped, as without Full Map', far.oppColor === null, String(far.oppColor));
    check('full map: a cell off screen whose ring reaches it is judged', near.oppColor === 'bste', String(near.oppColor));
    g.fullSpectator = false;
}

/* 5. The Canvas2D cell pass leaves out a cell (the GL batch did not draw) whose body, rings,
 * teammate indicator and nick are all off screen. Each cell had 600 screen pixels more on
 * top (1500 units at zoom 0.4), so with Full Map ~250 cells of the map were drawn in Canvas2D
 * every frame for nothing; now only a nick never laid out (or changed since) gets that margin,
 * and a laid out one its own half width, grown with the cell, the zoom out and the names scale
 * since. The nick drawn is targetNick: cell.nick is only set where a nick is laid out, so a
 * cell never drawn yet has none (it must still get the margin), and none is drawn while names
 * are hidden for the cell (No names, auto hidden small cells). */
{
    const a = src.indexOf('var _dcNames = '), b = src.indexOf('/* EXPANDING LAND', a);
    if (a < 0 || b < 0) throw new Error('Canvas2D cell pass cull not found');
    vm.runInContext('var ogario = { viewScale: 0.4 }; var application = {' + block('        setAutoHideCellInfo(t) {') + '};', g);
    const dms = g.defaultmapsettings, ds = g.defaultSettings;
    dms.noNames = false; dms.autoHideNames = false; ds.namesScale = 1;
    const pass = vm.runInContext('(function (LM) { var out = []; ' + src.slice(a, b) + ' out.push(drawCell); } return out; })', g);
    /* zoom 0.4, screen 1600x900: the view is -2000..2000 x -1125..1125 */
    const cam = { cells: [], camMinX: -2000, camMaxX: 2000, camMinY: -1125, camMaxY: 1125, hideSmallBots: false };
    const cell = (o) => Object.assign({ x: 0, y: 0, size: 100, nick: '', targetNick: '', redrawed: 0, lmChatLine() { return null; } }, o);
    const drawn = (c, scale) => { cam.cells = [c]; return pass.call({ scale: scale || 0.4 }, cam).length === 1; };
    check('a cell without nick 500 past the screen (4 radii 400) is left out', !drawn(cell({ x: 2500 })));
    check('a cell without nick 350 past the screen is drawn', drawn(cell({ x: 2350 })));
    /* as a cell arrives: its packets set targetNick, nick stays '' until the text pass ran */
    check('a nick never laid out: 600 screen px kept (1500 at zoom 0.4)', drawn(cell({ x: 3000, targetNick: 'abc' })) && !drawn(cell({ x: 4000, targetNick: 'abc' })));
    const laid = { nick: 'a long nick', targetNick: 'a long nick', size: 30, _lmNickW: 1200, _lmNickT: 'a long nick', _lmNickR: 30, _lmNickS: 0.4, _lmNickQ: 1 };
    check('a laid out nick: its half width (600)', drawn(cell(Object.assign({}, laid, { x: 2550 }))) && !drawn(cell(Object.assign({}, laid, { x: 2650 }))));
    check('the cell grew since its nick was laid out: the width grows with it', drawn(cell(Object.assign({}, laid, { x: 3150, size: 60 }))));
    check('zoomed out since the nick was laid out: the width grows with it', drawn(cell(Object.assign({}, laid, { x: 3150, _lmNickS: 0.8 }))));
    check('the nick changed since (new targetNick, the old one laid out): 600 screen px kept', drawn(cell(Object.assign({}, laid, { x: 3150, targetNick: 'another' }))));
    ds.namesScale = 2;
    check('names scale raised since the nick was laid out: the width grows with it', drawn(cell(Object.assign({}, laid, { x: 3150 }))));
    ds.namesScale = 1;
    dms.noNames = true;
    check('No names: no nick margin', !drawn(cell({ x: 3000, targetNick: 'abc' })) && !drawn(cell(Object.assign({}, laid, { x: 2550 }))));
    dms.noNames = false; dms.autoHideNames = true;
    check('a small cell whose nick is auto hidden: no nick margin, an own cell keeps it', !drawn(cell({ x: 2250, size: 30, targetNick: 'abc' })) &&
        drawn(cell({ x: 2250, size: 30, targetNick: 'abc', isPlayerCell: true })) && drawn(cell({ x: 3000, size: 100, targetNick: 'abc' })));
    dms.autoHideNames = false;
    check('a small cell below the screen whose teammate indicator reaches it is drawn', drawn(cell({ y: 1125 + 170, size: 20 })) && !drawn(cell({ y: 1125 + 190, size: 20 })));
    check('a cell with a chat line far off screen is drawn', drawn(cell({ x: 6000, lmChatLine() { return 'hi'; } })));
    check('a cell left out still counts as drawn (its removal fades)', (() => { const c = cell({ x: 9000 }); drawn(c); return c.redrawed === 1; })());
}

console.log(fail ? fail + ' check(s) failed' : 'all checks passed');
process.exit(fail ? 1 : 0);
