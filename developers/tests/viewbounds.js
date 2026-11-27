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
    'var defaultmapsettings = { oppColors: true, oppRings: true, splitRange: true, tripleSplitRange: false, dominationRate: 1.33, dominatedRate: 0.75 };',
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

/* 4. World Spectate (full map) still uses the map */
{
    g.fullSpectator = true;
    LM.mapMinX = LM.mapMinY = -7071; LM.mapMaxX = LM.mapMaxY = 7071;
    world(0, 0);
    const far = { id: 3, x: 7000, y: 7000, size: 170, targetX: 7000, targetY: 7000, oppColor: null };
    LM.cells.push(far);
    g.frame.call(renderer(0, 0));
    check('full map spectate: a cell anywhere on the map is judged', far.oppColor === 'bste', String(far.oppColor));
    g.fullSpectator = false;
}

console.log(fail ? fail + ' check(s) failed' : 'all checks passed');
process.exit(fail ? 1 : 0);
