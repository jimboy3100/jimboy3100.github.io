/* Jelly cadence (LM.jellyStepDue, LM.holdJellyCells, Cell.placeJellyPoints and the hold mode of
 * LM.prepareJellyCells in ogario/ogario.v4.js), run through the jelly block of renderFrame itself:
 * - steps are due 60 times a second at most once per frame: every frame of a 30/50/60 Hz
 *   screen steps (also with frame time jitter and dropped frames), 75/90/120/144/165/240 Hz
 *   screens step 60 times a second; a hidden tab or a clock jump steps on the next frame;
 * - 60 Hz: every frame gives bit-identical points, radii and velocities to the code before the
 *   cadence (from git) on a dense scene with zoom changes, splits, merges, a teleport, overlaps,
 *   coincident cells and viruses;
 * - 120/144/240 Hz: after every step the jelly state is bit-identical to a 60 Hz run whose
 *   frames see the world as it was at those steps, and every frame between steps shows the last
 *   step's shape exactly around the cell's current centre (100-point viruses kept);
 * - a cell born, hidden or teleported on a frame between steps is drawn correctly.
 * Uses developers/tests/bench-dense.js as the loader. Usage: node developers/tests/jellycadence.js */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const B = require('./bench-dense.js');

const root = path.join(__dirname, '..', '..');
/* the code before the jelly cadence */
const BASE = '355b8114';
let failed = 0;
function check(name, ok, extra) {
    console.log((ok ? 'ok   ' : 'FAIL ') + name + (extra ? '  (' + extra + ')' : ''));
    if (!ok) failed++;
}

const src = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
/* The jelly passes of renderFrame, from the step decision to the profiler call. */
const frameBlock = B.sliceBetween(src, '                    var _jellyStep =\n', '                    if (\n                        window\n                            .clientProfiler');
function makeFrameRunner(J) {
    const fn = new Function('LM', '_jellyCells', 'performance', 'console', frameBlock + '\nreturn _jellyStep;');
    return function (scratch, rafTs) {
        J.drawRender._jellyFrameId++;
        J.drawRender._lmRafTs = rafTs;
        return fn.call(J.drawRender, J.LM, scratch, J.env.performance, console);
    };
}
/* The frame sequence before the cadence: prepare, index, move on every frame. */
function oldFrame(J, scratch) {
    J.drawRender._jellyFrameId++;
    const jc = J.LM.prepareJellyCells ? J.LM.prepareJellyCells(J.LM.cells, scratch) : B.prepareInline(J.LM, scratch);
    if (jc.length) J.LM.updateQuadtree(jc); else J.LM.quadtree = null;
    for (const c of jc) c.movePoints();
}

/* ---- the clock alone ---- */
function stepsAt(J, hz, seconds, jitter, rng) {
    J.LM._lmJellyClock = undefined; J.LM._lmJellyAcc = 0;
    const dt = 1000 / hz, n = Math.round(hz * seconds);
    let steps = 0, every = true, maxGap = 0, gap = 0;
    for (let i = 0; i < n; i++) {
        const t = 1000 + i * dt + (jitter ? (rng() - 0.5) * 2 * jitter : 0);
        const s = J.LM.jellyStepDue(t);
        if (s) { steps++; gap = 0; } else { every = false; gap++; if (gap > maxGap) maxGap = gap; }
    }
    return { steps, every, maxGap, frames: n };
}

/* ---- a world given as a function of time (in 60 Hz frame units) ---- */
function makeWorld(J, nBodies, seed) {
    const cells = B.makeScene(J, nBodies, 200, seed);
    const bodies = cells.filter((c) => !c.isFood);
    const rng = B.makeRng(seed + 1);
    for (const c of bodies) {
        c._x0 = c.x; c._y0 = c.y; c._vx = (rng() - 0.5) * 4; c._vy = (rng() - 0.5) * 4; c._s0 = c.size;
        c._lmJellyCX = c._lmJellyCY = NaN; c._lmJellyHeld = false;
    }
    let nextId = 900000;
    /* every body is in view from the first frame: a cell coming into view for the first
     * time gets its start perimeter (random velocities) on that frame, also between steps,
     * where a 60 Hz run would draw those numbers on its next frame */
    J.LM.camMinX = J.LM.camMinY = -1e6; J.LM.camMaxX = J.LM.camMaxY = 1e6;
    const w = { cells, bodies, born: [], done: {} };
    /* events at whole times; apply(t) applies those due (at most once each) */
    w.apply = function (t) {
        const LM = J.LM;
        J.drawRender.scale = 0.35 + 0.06 * Math.sin(t * 0.23);
        for (const c of w.bodies) {
            if (c.removed) continue;
            c.x = c._x0 + c._vx * t; c.y = c._y0 + c._vy * t;
            c.size = c._s0 * (1 + 0.15 * Math.sin(t * 0.17 + c.id));
        }
        if (t >= 8 && !w.done.split) {
            /* splits: two pieces next to some cells (one of them right on top) */
            w.done.split = true;
            for (let i = 0; i < 40; i++) {
                const p = w.bodies[i * 3];
                const c = new J.Cell();
                c.id = nextId++; c.isFood = false; c.isVirus = false; c.removed = false; c.invisible = false;
                c.points = []; c.pointsVel = []; c.maxPointRad = 0; c._lmJellyCX = c._lmJellyCY = NaN; c._lmJellyHeld = false;
                c._x0 = p._x0 + (i % 2 ? 0 : p._s0 * 0.8); c._y0 = p._y0; c._vx = p._vx; c._vy = p._vy; c._s0 = p._s0 * 0.7;
                c.x = c._x0 + c._vx * t; c.y = c._y0 + c._vy * t; c.size = c._s0;
                w.bodies.push(c); LM.cells.push(c); w.born.push(c);
            }
        }
        if (t >= 16 && !w.done.merge) {
            /* merges: cells eaten / gone */
            w.done.merge = true;
            for (let i = 1; i < 60; i += 4) { const c = w.bodies[i]; c.removed = true; const k = LM.cells.indexOf(c); if (k >= 0) LM.cells.splice(k, 1); }
        }
        if (t >= 21 && !w.done.teleport) {
            w.done.teleport = true;
            const c = w.bodies[5]; c._x0 += 700; c._y0 -= 400;
            c.x = c._x0 + c._vx * t; c.y = c._y0 + c._vy * t;
        }
    };
    return w;
}
function state(cells) {
    const out = [];
    for (const c of cells) {
        out.push(c.points.length, c.maxPointRad);
        for (let i = 0; i < c.points.length; i++) out.push(c.points[i].x, c.points[i].y, c.points[i].rl, c.pointsVel[i]);
    }
    return out;
}
function same(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!(a[i] === b[i] || (a[i] !== a[i] && b[i] !== b[i]))) return false;
    return true;
}
/* every prepared perimeter of a frame between steps: the step's shape around the current centre */
function heldExactly(J, cells, shapes) {
    let bad = 0, n = 0;
    const spikes = 6;
    for (const c of cells) {
        const s = shapes.get(c);
        if (!s) continue;
        if (c._jellyFrameId !== J.drawRender._jellyFrameId || c.points.length !== s.rl.length) { bad++; continue; }
        const len = c.points.length;
        for (let i = 0; i < len; i++) {
            const p = c.points[i];
            let r = s.rl[i];
            if (c.isVirus && (i & 1) === 0) r += spikes;
            const a = 2 * Math.PI * i / len;
            n++;
            if (p.rl !== s.rl[i] || c.pointsVel[i] !== s.vel[i] || p.x !== c.x + Math.cos(a) * r || p.y !== c.y + Math.sin(a) * r) bad++;
        }
    }
    return { bad, n };
}
function shapesOf(cells) {
    const m = new Map();
    for (const c of cells) m.set(c, { rl: c.points.map((p) => p.rl), vel: c.pointsVel.slice() });
    return m;
}

(async function main() {
    /* ---- 1. step cadence ---- */
    {
        const J = B.loadJelly();
        const rng = B.makeRng(5);
        for (const hz of [30, 50, 60]) {
            const r = stepsAt(J, hz, 10, 0);
            check(hz + ' Hz: a jelly step on every frame (as before)', r.every, r.steps + ' steps in ' + r.frames + ' frames');
        }
        const j60 = stepsAt(J, 60, 20, 1.5, rng);
        check('60 Hz with +-1.5 ms frame time jitter: a step on every frame', j60.every, j60.steps + ' of ' + j60.frames);
        const j59 = stepsAt(J, 59.94, 20, 0);
        check('59.94 Hz: a step on every frame', j59.every);
        for (const hz of [75, 90, 120, 144, 165, 240]) {
            const r = stepsAt(J, hz, 10, 0);
            check(hz + ' Hz: 60 steps a second (+-1), none skipped longer than needed', Math.abs(r.steps - 600) <= 1 && r.maxGap <= Math.ceil(hz / 60), r.steps + ' steps in 10 s, longest run without a step ' + r.maxGap + ' frames');
        }
        const r144 = stepsAt(J, 144, 10, 0.8, rng);
        check('144 Hz with frame time jitter: 60 steps a second', Math.abs(r144.steps - 600) <= 2, r144.steps + ' steps in 10 s');
        /* a dropped frame at 60 Hz, a hidden tab, a clock that jumps back */
        J.LM._lmJellyClock = undefined; J.LM._lmJellyAcc = 0;
        let ok = true, t = 0;
        for (let i = 0; i < 30; i++) { t += (i === 10 ? 33.33 : 16.667); ok = J.LM.jellyStepDue(t) && ok; }
        check('60 Hz with a dropped frame: still one step on every frame (no catch-up)', ok);
        J.LM._lmJellyClock = undefined; J.LM._lmJellyAcc = 0;
        t = 0; for (let i = 0; i < 20; i++) { t += 6.944; J.LM.jellyStepDue(t); }
        const afterHidden = J.LM.jellyStepDue(t + 30000);
        let next = 0; for (let i = 1; i <= 6; i++) if (J.LM.jellyStepDue(t + 30000 + i * 6.944)) next++;
        check('hidden tab (30 s without frames): the first frame back steps once, then 60 a second again', afterHidden === true && next >= 2 && next <= 3, next + ' steps in the next 6 frames at 144 Hz');
        check('clock going back or not a number: steps', J.LM.jellyStepDue(5) === true && J.LM.jellyStepDue(NaN) === true && J.LM.jellyStepDue(10) === true);
    }

    /* ---- 2. 60 Hz: identical to the code before the cadence, frame by frame ---- */
    let oldSrc = null, oldQt = null;
    try {
        oldSrc = cp.execFileSync('git', ['-C', root, 'show', BASE + ':ogario/ogario.v4.js'], { maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
        oldQt = cp.execFileSync('git', ['-C', root, 'show', BASE + ':ogario/wasm_quadtree.js'], { maxBuffer: 8 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (e) { oldSrc = null; }
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-jellycad-'));
    const loadRef = () => {
        if (!oldSrc) return null;
        const fo = path.join(dir, 'ogario.v4.js'), fq = path.join(dir, 'wasm_quadtree.js');
        if (!fs.existsSync(fo)) { fs.writeFileSync(fo, oldSrc); fs.writeFileSync(fq, oldQt); }
        return B.loadJelly({ src: fo, qt: fq });
    };
    /* the reference when git is not available: the new code with a step on every frame */
    const refOrNew = () => loadRef() || B.loadJelly();
    try {
        const FR = 34, seed = 6060;
        const Jn = B.loadJelly(); Jn.setRandomSeed(3);
        const Jo = refOrNew(); Jo.setRandomSeed(3);
        const wn = makeWorld(Jn, 400, seed), wo = makeWorld(Jo, 400, seed);
        const run = makeFrameRunner(Jn);
        const sn = [], so = [];
        const rng = B.makeRng(77);
        let allSteps = true, bad = -1;
        for (let f = 0; f < FR; f++) {
            wn.apply(f); wo.apply(f);
            const ts = 5000 + f * 16.667 + (rng() - 0.5) * 2.4;
            allSteps = run(sn, ts) && allSteps;
            oldFrame(Jo, so);
            if (bad < 0 && !same(state(Jn.LM.cells), state(Jo.LM.cells))) bad = f;
        }
        let virus100 = Jn.LM.cells.filter((c) => c.isVirus && !c.removed).every((c) => c.points.length === 100);
        check('60 Hz (jittered frame times): renderFrame steps on every frame', allSteps);
        check('60 Hz: points, radii and velocities identical to ' + (oldSrc ? 'the code of ' + BASE : 'a step on every frame') + ' on every frame (zoom, splits, merges, teleport, overlaps)', bad < 0, bad < 0 ? FR + ' frames, ' + state(Jn.LM.cells).length + ' values' : 'first different at frame ' + bad);
        check('  viruses keep 100 points', virus100 && Jn.LM.cells.some((c) => c.isVirus));
    } catch (e) { check('60 Hz comparison ran', false, e.stack); }

    /* ---- 3. high refresh rates: same steps as 60 Hz, exact hold frames between them ---- */
    for (const hz of [120, 144, 240]) {
        try {
            const seed = 1440 + hz;
            const Jn = B.loadJelly(); Jn.setRandomSeed(9);
            const wn = makeWorld(Jn, 400, seed);
            const run = makeFrameRunner(Jn);
            const sn = [];
            /* world time in 60 Hz frame units at each frame; events only on step frames so the
             * reference sees them on the same step */
            const frames = Math.round(hz * 0.6);
            const stepTimes = [], stepStates = [];
            let holdBad = 0, holdN = 0, holdFrames = 0, shapes = null, held = 0;
            for (let f = 0; f < frames; f++) {
                const t = f * 60 / hz;
                const ts = 8000 + f * 1000 / hz;
                /* events (splits/merges/teleport) wait for a step frame */
                const due = Jn.LM._lmJellyClock === undefined || Jn.LM._lmJellyAcc + (ts - Jn.LM._lmJellyClock) >= 1000 / 60 * 0.75;
                if (due) wn.apply(t);
                else {
                    const keep = wn.done; wn.done = new Proxy(keep, { get: (o, k) => (k in o ? o[k] : true) });
                    wn.apply(t); wn.done = keep;
                }
                const step = run(sn, ts);
                if (step !== due) { holdBad++; break; }
                if (step) { stepTimes.push(t); stepStates.push(state(Jn.LM.cells)); shapes = shapesOf(sn); }
                else {
                    holdFrames++;
                    const h = heldExactly(Jn, sn, shapes);
                    holdBad += h.bad; holdN += h.n;
                    held += sn.filter((c) => c._lmJellyHeld).length;
                }
            }
            /* the 60 Hz reference: one frame per step, the world at that step's time */
            const Jo = refOrNew(); Jo.setRandomSeed(9);
            const wo = makeWorld(Jo, 400, seed);
            const so = [];
            let bad = -1;
            for (let k = 0; k < stepTimes.length; k++) {
                wo.apply(stepTimes[k]);
                oldFrame(Jo, so);
                if (bad < 0 && !same(stepStates[k], state(Jo.LM.cells))) bad = k;
            }
            check(hz + ' Hz: after every step the jelly is identical to 60 Hz frames at the same world times', bad < 0 && stepTimes.length > 20, stepTimes.length + ' steps in ' + frames + ' frames' + (bad >= 0 ? ', first different at step ' + bad : ''));
            check(hz + ' Hz: frames between steps show the last step exactly around the current centres', holdBad === 0 && holdN > 0 && held > 0, holdFrames + ' frames, ' + holdN + ' points');
        } catch (e) { check(hz + ' Hz comparison ran', false, e.stack); }
    }

    /* ---- 4. things happening on a frame between two steps ---- */
    try {
        const J = B.loadJelly(); J.setRandomSeed(4);
        const w = makeWorld(J, 150, 4242);
        const run = makeFrameRunner(J);
        const sn = [];
        let ts = 1000;
        /* 120 Hz: every other frame steps; stop right after a step */
        let last = false;
        for (let f = 0; f < 20 && !(f >= 9 && last); f++) { w.apply(f / 2); last = run(sn, ts); ts += 1000 / 120; }
        check('scene stopped right after a step', last === true);
        const virus = J.LM.cells.find((c) => c.isVirus && sn.indexOf(c) >= 0);
        const born = new J.Cell();
        born.id = 777777; born.x = 100; born.y = 50; born.size = 90; born.isFood = false; born.isVirus = false; born.removed = false; born.invisible = false;
        born.points = []; born.pointsVel = []; born.maxPointRad = 0; born._lmJellyCX = born._lmJellyCY = NaN; born._lmJellyHeld = false;
        J.LM.cells.push(born);
        const hide = sn.find((c) => c !== virus && !c.isVirus);
        hide.invisible = true;
        const tele = sn.find((c) => c !== virus && c !== hide && !c.isVirus);
        const teleShape = shapesOf([tele]);
        tele.x += 1500; tele.y += 300;
        const vShape = shapesOf([virus]);
        const step = run(sn, ts); ts += 1000 / 120;
        check('frame between steps', step === false);
        check('a cell born between steps gets a round perimeter at once and is drawn with it', born.points.length >= 5 && born._jellyFrameId === J.drawRender._jellyFrameId &&
            born.points.every((p, i) => Math.abs(Math.hypot(p.x - born.x, p.y - born.y) - born.size) < 1e-9 && p.rl === born.size), born.points.length + ' points');
        check('  and is not put back to an old place on the next step', born._lmJellyHeld === false);
        check('a cell hidden between steps drops its points (no physics, no collider)', hide.points.length === 0 && sn.indexOf(hide) < 0);
        const th = heldExactly(J, [tele], teleShape);
        check('a cell teleported between steps: its perimeter goes with it, same shape', th.bad === 0 && th.n > 0);
        const vh = heldExactly(J, [virus], vShape);
        check('a virus between steps keeps its 100 spiked points', virus.points.length === 100 && vh.bad === 0);
        /* the next step: the teleported cell's step starts from the perimeter its last step left */
        const s2 = run(sn, ts);
        check('next frame steps', s2 === true);
        check('  every point finite and around its cell after the step', sn.every((c) => c.points.every((p) => isFinite(p.x) && isFinite(p.y) && Math.hypot(p.x - c.x, p.y - c.y) < c.size * 2 + 20)));
        check('  born cell simulated normally', born._jellyFrameId === J.drawRender._jellyFrameId && born._lmJellyCX === born.x);
    } catch (e) { check('frames between steps ran', false, e.stack); }

    try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { }
    if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
    console.log('all jelly cadence checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
