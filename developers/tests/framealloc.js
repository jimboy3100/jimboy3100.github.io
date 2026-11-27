/* Per-frame calls of the renderer that must allocate nothing (owner rule: no per-frame
 * allocations in the render loop), measured on the real window.drawRender of ogario.v4.js:
 *   - _lmMarkCtx and _lmGlMarks (the teammate indicator / chat bubble of a WebGL cell in the GL
 *     text pass): two calls per WebGL cell per frame, also when there is nothing to draw;
 *   - drawLegendWorldDeformedCanvasCell (every Canvas2D-drawn cell, every frame): its paths
 *     without the Expanding Land map deformation, and the jelly one with it.
 * A closure anywhere in such a method made every call allocate a context for the variables it
 * captures (about 6 KB per frame with 96 cells on screen, measured in headless Chrome): the
 * closures now live in their own methods (_lmMarkCtxMake, _lmGlChatMoved, _elDeformedCellDraw).
 * Bytes per call are counted with V8's sampling heap profiler (objects freed by any GC
 * included). The paths that do draw must call the same code with the same arguments as the
 * reference version (default 52d7df4b, before this change).
 * node developers/tests/framealloc.js [--ref REV] [--old FILE] */
'use strict';
/* the renderer's callers are not optimized with these methods inlined (renderFrame is too big):
 * measure them as compiled on their own */
require('v8').setFlagsFromString('--no-turbo-inlining');
const fs = require('fs'), path = require('path'), inspector = require('inspector');
const { execFileSync, spawnSync } = require('child_process');
const { rendererFactory } = require('./glbatch.js');

const root = path.join(__dirname, '..', '..');
const ARGS = process.argv.slice(2);
const opt = (n, d) => { const i = ARGS.indexOf(n); return i >= 0 && ARGS[i + 1] ? ARGS[i + 1] : d; };
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

function readOld() {
    const file = opt('--old', null);
    if (file) return fs.readFileSync(file, 'utf8');
    try {
        return execFileSync('git', ['-C', root, 'show', opt('--ref', '52d7df4b') + ':ogario/ogario.v4.js'], { encoding: 'utf8', maxBuffer: 64 * 1048576, stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (e) {
        return null;
    }
}

globalThis._EAT_PULSE_MAGNITUDE = 0.08;
globalThis._EAT_PULSE_DURATION = 150;

/* a renderer from one version of ogario.v4.js, with a call log */
function make(src) {
    const F = rendererFactory(src);
    const D = new Function('return ' + F.defaults)();
    const env = { window: { teammatenicks: [], LM_DPR: 1 }, LM: { time: 100000 }, application: {}, defaultSettings: D.defaultSettings, defaultmapsettings: D.defaultmapsettings, ogarcopythelb: {}, ogario: {} };
    const R = new Function('env', F.factory.replace(/^function \(env\) \{/, '').replace(/\}$/, ''))(env);
    const log = [];
    R.log = log;
    R.env = env;
    R._glSkinFrame = 7;
    R.ctx = { globalAlpha: 1 };
    R._deform = false;
    R.isLegendWorldMapDeformationVisible = function () { return this._deform; };
    R.getLegendWorldMapRenderPoint = function (x, y, out) { out = out || {}; out.x = x + this._shift; out.y = y; return out; };
    R._shift = 0;
    R._elMapPointA = { x: 0, y: 0 };
    R.withLegendWorldDeformedCellRenderState = function (cell, fn) { log.push('deformed state ' + cell.id); var r = fn(); log.push('restored ' + cell.id); return r; };
    R.drawTeammatesInd = function (c, x, y, size) { log.push('ind ' + [x, y, size, c.dx, c.dy, c.z, c.globalAlpha].join(',')); };
    return R;
}
function cell(R, id) {
    const log = R.log;
    return {
        id: id, x: 100, y: 200, size: 50, targetNick: 'mate', isPlayerCell: false, _webglZ: 0.25, chat: null,
        lmChatLine() { return this.chat; },
        setDrawing() { }, setDrawingScale() { },
        lmChatBubble(c, ce, ready, nickDone) { log.push('bubble ' + [this.id, ce.message, ready, nickDone, c.dx, c.dy, c.z, c.globalAlpha].join(',')); },
        /* cell.draw(style, cellMoved) reads no other argument */
        draw(ctx, cellMoved) { log.push('draw ' + [this.id, ctx.name, cellMoved].join(',')); }
    };
}

/* bytes allocated per call of fn (the loop itself allocates nothing) */
const session = new inspector.Session();
session.connect();
const post = (m, p) => new Promise((res, rej) => session.post(m, p || {}, (e, r) => (e ? rej(e) : res(r))));
async function bytesPerCall(fn, n) {
    for (let i = 0; i < 30000; i++) fn();
    await post('HeapProfiler.enable');
    await post('HeapProfiler.collectGarbage');
    await post('HeapProfiler.startSampling', { samplingInterval: 32, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
    for (let i = 0; i < n; i++) fn();
    const prof = (await post('HeapProfiler.stopSampling')).profile;
    let total = 0;
    (function walk(node) {
        const f = node.callFrame;
        /* only what the renderer code allocates (not the inspector's own messages) */
        if (node.selfSize && !/^(node:|internal)/.test(f.url || '') && f.url !== 'node:inspector') total += node.selfSize;
        (node.children || []).forEach(walk);
    })(prof.head);
    return total / n;
}

/* the per-frame calls with nothing to draw (the common case) */
function hotCalls(R) {
    const ms = R.env.defaultmapsettings;
    ms.teammatesInd = false;
    ms.jellyPhisycs = false;
    const c = cell(R, 1);
    const plain = cell(R, 2);
    const ctxA = { name: 'main' };
    plain.draw = function () { };
    return {
        '_lmMarkCtx': () => R._lmMarkCtx(),
        '_lmGlMarks indicator (option off)': () => R._lmGlMarks(c, 1),
        '_lmGlMarks chat bubble (no chat line)': () => R._lmGlMarks(c, 2),
        'drawLegendWorldDeformedCanvasCell, no map deformation': () => R.drawLegendWorldDeformedCanvasCell(plain, ctxA, false),
        'drawLegendWorldDeformedCanvasCell, deformation + jelly, cell not moved': () => { R._deform = true; ms.jellyPhisycs = true; R.drawLegendWorldDeformedCanvasCell(plain, ctxA, false); R._deform = false; ms.jellyPhisycs = false; }
    };
}

/* the paths that draw: the same calls with the same arguments in both versions */
function drawCalls(R) {
    const ms = R.env.defaultmapsettings, log = R.log;
    log.length = 0;
    const ctxA = { name: 'main', save() { log.push('save'); }, restore() { log.push('restore'); }, translate(x, y) { log.push('translate ' + x + ',' + y); } };
    const c = cell(R, 3);
    window_team(R, true);
    ms.teammatesInd = true;
    R._lmGlMarks(c, 1);
    ms.teammatesInd = false;
    window_team(R, false);
    c.chat = { message: 'hi', time: 0 };
    R.ctx.globalAlpha = 0.5;
    ms.jellyPhisycs = false;
    R._lmGlMarks(c, 2);
    R._deform = true;
    R._shift = 30;
    R._lmGlMarks(c, 2);
    R._lmGlMarks(c, 1);
    ms.jellyPhisycs = true;
    R._lmGlMarks(c, 2);
    R.drawLegendWorldDeformedCanvasCell(c, ctxA, false);
    ms.jellyPhisycs = false;
    R.drawLegendWorldDeformedCanvasCell(c, ctxA, false);
    R.drawLegendWorldDeformedCanvasCell(c, ctxA);
    R._deform = false;
    R.drawLegendWorldDeformedCanvasCell(c, ctxA, true);
    R._shift = 0;
    R.ctx.globalAlpha = 1;
    log.push('marked ' + R._lmGlMarked(c));
    return log.slice();
}
function window_team(R, on) {
    const w = R.env.window;
    w.teammatenicks = on ? ['mate'] : [];
    w._lmTeammateNickSet = on ? new Set(['mate']) : undefined;
}

/* the measured calls in this process: { name: [bytes per call now, reference or null] } */
async function measure(NEW, OLD) {
    const N = 100000, out = {};
    const hotNew = hotCalls(NEW), hotOld = OLD && hotCalls(OLD);
    for (const name of Object.keys(hotNew)) out[name] = [await bytesPerCall(hotNew[name], N), hotOld ? await bytesPerCall(hotOld[name], N) : null];
    return out;
}
const fmt = (r) => r[0].toFixed(2) + ' B/call' + (r[1] === null ? '' : ', reference ' + r[1].toFixed(2) + ' B/call');

(async function main() {
    const NEW = make(fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8'));
    const oldSrc = readOld();
    const OLD = oldSrc ? make(oldSrc) : null;
    if (ARGS.indexOf('--child') >= 0) {
        console.log('RESULT ' + JSON.stringify(await measure(NEW, OLD)));
        process.exit(0);
    }
    /* optimized code (TurboFan): nothing at all */
    const top = await measure(NEW, OLD);
    for (const name of Object.keys(top)) check('optimized: ' + name + ': no allocation per call', top[name][0] < 1, fmt(top[name]));
    /* the faster-compiling tier the browser runs a method in first (Maglev; Sparkplug and the
     * interpreter allocate the same): a closure or arguments in these methods allocated there
     * too. _lmGlMarks keeps one number (its depth, stored per cell: 16 bytes in that tier). */
    const ch = spawnSync(process.execPath, ['--max-opt=2', __filename, '--child'].concat(ARGS), { encoding: 'utf8', maxBuffer: 16 * 1048576 });
    const m = /RESULT (.*)/.exec(ch.stdout || '');
    if (!m) check('Maglev run', false, (ch.stderr || ch.stdout || '').slice(0, 400));
    else {
        const mid = JSON.parse(m[1]);
        for (const name of Object.keys(mid)) {
            const max = /^_lmGlMarks/.test(name) ? 17 : 1;
            check('Maglev: ' + name + ': ' + (max > 1 ? 'at most one number per call' : 'no allocation per call'), mid[name][0] < max, fmt(mid[name]));
        }
    }
    if (OLD) {
        const a = drawCalls(OLD), b = drawCalls(NEW);
        check('drawing paths: the same calls with the same arguments as the reference (' + b.length + ' calls)', JSON.stringify(a) === JSON.stringify(b),
            JSON.stringify(a) === JSON.stringify(b) ? undefined : 'reference ' + JSON.stringify(a) + ' / now ' + JSON.stringify(b));
    } else {
        console.log('skip reference comparison (no git or --old file)');
    }
    const b = drawCalls(NEW);
    check('indicator, bubbles and moved draws are made', b.some((s) => /^ind /.test(s)) && b.filter((s) => /^bubble /.test(s)).length === 3 &&
        b.indexOf('deformed state 3') >= 0 && b.some((s) => s === 'draw 3,main,false') && b.some((s) => s === 'translate 30,0'), JSON.stringify(b));
    session.disconnect();
    console.log(failed ? 'FAILED: ' + failed : 'all ok');
    process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
