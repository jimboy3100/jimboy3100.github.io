/* Dense-world acceptance benchmark: the real client (ogario.v4.js renderFrame, jelly, WebGL and
 * Canvas2D renderers) in headless Chrome, fed seeded synthetic worlds through a stand-in socket
 * (lib/bench-scene.js); no game server is used by the scenes.
 *
 *   node developers/tests/bench.js                    self-check in Node (world, packets,
 *                                                     statistics, the gate); no browser
 *   node developers/tests/bench.js --quick            regression gate: the quick scenes against
 *                                                     developers/tests/bench-baseline.json
 *   node developers/tests/bench.js --quick --update-baseline   measure and store a new baseline
 *   node developers/tests/bench.js --run [options]    the full table (lib/bench-client.js options:
 *                                                     --preset quick|default|full, --scenes a,b,
 *                                                     --compare LABEL, --repeat N, --profile, ...)
 * Results: developers/tests/out/bench-<label>.json and .md (ignored by git).
 *
 * The gate is generous so it does not flake: counts (draw calls, jelly points, frames drawn by
 * WebGL, world size) always count; timings only against a baseline from the same GPU and Chrome
 * major version (otherwise they are printed as information). Without Chrome it is skipped. */
'use strict';
const fs = require('fs');
const path = require('path');
const B = require('./lib/bench-scene.js');

const BASELINE = path.join(__dirname, 'bench-baseline.json');
const QUICK = { warm: 2500, measure: 3000 };

/* Thresholds of the gate (per scene): a failure needs a clear regression, not noise (other
 * programs on the machine easily double a timing; the label upload stall this was made to find
 * was 10x). */
const LIMITS = {
    renderP50: (b) => b * 2.5 + 5,       /* renderFrame CPU ms, median */
    frameP95: (b) => b * 3 + 15,         /* frame interval ms, 95th percentile */
    draws: (b) => b * 1.5 + 6,           /* WebGL draw calls per frame */
    pointsLow: (b) => b * 0.75,          /* jelly points submitted: fewer means lost quality */
    pointsHigh: (b) => b * 1.25 + 50,    /* more means more work for the same scene */
    glShareDrop: 0.2,                    /* share of frames drawn by the WebGL scene */
    cellsTolerance: 0.03,                /* world size against the baseline */
    busy: 1.4                            /* speed check this much slower than the baseline's: timings not judged */
};

/* the numbers the baseline keeps of a scene */
function slim(r) {
    return {
        name: r.name, fps: r.fps, frameMs: r.frameMs, renderMs: r.renderMs, glShare: r.glShare,
        counts: { draws: r.counts.draws, pointsSubmitted: r.counts.pointsSubmitted, pointsIndexed: r.counts.pointsIndexed, uploadMs: r.counts.uploadMs, textRasters: r.counts.textRasters },
        world: { cells: r.world.cells, food: r.world.food }
    };
}

function sameMachine(a, b) {
    const major = (v) => String(v || '').split('.')[0];
    return !!(a && b && a.gpu && a.gpu === b.gpu && major(a.browser) === major(b.browser));
}

/* Compares a run with the baseline: { fail: [...], info: [...] } */
function gate(base, cur) {
    const fail = [], info = [];
    if (cur.meta.errors && cur.meta.errors.length) fail.push('page errors: ' + cur.meta.errors.slice(0, 3).join(' / '));
    const same = sameMachine(base.meta, cur.meta);
    /* other programs kept the machine busy (the fixed CPU workload ran clearly slower than when
     * the baseline was made): timings would measure them, not the client */
    const slower = (k) => base.meta[k] > 0 && cur.meta[k] > base.meta[k] * LIMITS.busy;
    const busy = same && (slower('calibrationMs') || slower('calibrationGpuMs'));
    const timed = same && !busy;
    if (!same) info.push('baseline from another GPU or Chrome (' + (base.meta.gpu || '?') + ', ' + (base.meta.browser || '?') + '): timings not gated');
    if (busy) info.push('machine busy (speed check CPU ' + cur.meta.calibrationMs + ' / GPU ' + cur.meta.calibrationGpuMs + ' ms, baseline ' + base.meta.calibrationMs + ' / ' + base.meta.calibrationGpuMs + ' ms): timings not gated, re-run when it is idle');
    const byName = {};
    base.results.forEach((r) => (byName[r.name] = r));
    cur.results.forEach((r) => {
        const b = byName[r.name], n = r.name;
        if (r.errors) fail.push(n + ': ' + r.errors + ' packet errors');
        if (r.missingStages && r.missingStages.length) fail.push(n + ': methods not found (stage timing lost): ' + r.missingStages.join(', '));
        if (!b) { info.push(n + ': not in the baseline'); return; }
        const t = (cond, msg) => { if (cond) (timed ? fail : info).push(n + ': ' + msg); };
        const c = (cond, msg) => { if (cond) fail.push(n + ': ' + msg); };
        t(r.renderMs.p50 > LIMITS.renderP50(b.renderMs.p50), 'render p50 ' + r.renderMs.p50 + ' ms, baseline ' + b.renderMs.p50 + ' ms');
        t(r.frameMs.p95 > LIMITS.frameP95(b.frameMs.p95), 'frame p95 ' + r.frameMs.p95 + ' ms, baseline ' + b.frameMs.p95 + ' ms');
        c(r.counts.draws > LIMITS.draws(b.counts.draws), 'GL draws ' + r.counts.draws + ', baseline ' + b.counts.draws);
        c(b.counts.pointsSubmitted > 0 && r.counts.pointsSubmitted < LIMITS.pointsLow(b.counts.pointsSubmitted), 'jelly points ' + r.counts.pointsSubmitted + ', baseline ' + b.counts.pointsSubmitted + ' (fewer points: less jelly detail)');
        c(r.counts.pointsSubmitted > LIMITS.pointsHigh(b.counts.pointsSubmitted), 'jelly points ' + r.counts.pointsSubmitted + ', baseline ' + b.counts.pointsSubmitted);
        c(r.glShare < b.glShare - LIMITS.glShareDrop, 'WebGL frames ' + r.glShare + ', baseline ' + b.glShare + ' (more Canvas2D fallback)');
        c(Math.abs(r.world.cells - b.world.cells) > b.world.cells * LIMITS.cellsTolerance + 2, 'cells in the world ' + r.world.cells + ', baseline ' + b.world.cells);
    });
    return { fail, info };
}

/* ---------------- self-check (Node only) ---------------- */

/* reads an update packet (16) the way the client does for the two layouts the scenes use */
function decodeUpdate(buf, main) {
    const v = new DataView(buf);
    let o = 0;
    const out = { cells: [], removed: [] };
    if (v.getUint8(o++) !== 16) throw new Error('not an update packet');
    const eats = v.getUint16(o, true); o += 2 + eats * 8;
    for (;;) {
        const id = v.getUint32(o, true); o += 4;
        if (!id) break;
        const c = { id, x: v.getInt32(o, true), y: v.getInt32(o + 4, true), size: v.getUint16(o + 8, true) };
        o += 10;
        const flags = v.getUint8(o++);
        c.flags = flags;
        if (flags & 2) { c.color = [v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2)]; o += 3; }
        if (flags & 8) { let s = ''; for (let ch; (ch = v.getUint8(o++));) s += String.fromCharCode(ch); c.name = s; }
        if (main) { c.type = v.getUint16(o, true); o += 3; }
        out.cells.push(c);
    }
    const nr = v.getUint16(o, true); o += 2;
    for (let i = 0; i < nr; i++) { out.removed.push(v.getUint32(o, true)); o += 4; }
    if (o !== buf.byteLength) throw new Error('packet length ' + buf.byteLength + ', read ' + o);
    return out;
}

function selfCheck() {
    const fails = [];
    const ok = (cond, msg) => { if (!cond) fails.push(msg); };
    /* scenes */
    const def = B.matrix('default').map((s) => s.name);
    [100, 500, 1000, 2000].forEach((b) => [2000, 10000].forEach((f) => ok(def.indexOf('b' + b + '-f' + f + '-s1') >= 0, 'default preset lacks b' + b + '-f' + f)));
    ok(def.indexOf('b1000-f10000-s2') >= 0, 'default preset lacks a multibox scene');
    ok(B.matrix('quick').every((s) => s.jelly), 'quick scenes must keep jelly on (the default)');
    ok(new Set(B.matrix('full').map((s) => s.name)).size === B.matrix('full').length, 'scene names are not unique');
    /* the world is the same every time */
    const spec = B.scene({ bodies: 500, food: 2000, sockets: 2 });
    const w1 = B.createWorld(spec), w2 = B.createWorld(spec);
    for (let i = 0; i < 30; i++) { B.step(w1); B.step(w2); }
    ok(JSON.stringify(w1.bodies) === JSON.stringify(w2.bodies) && JSON.stringify(w1.food) === JSON.stringify(w2.food), 'the seeded world differs between two runs');
    ok(w1.bodies.length === 500 && w1.food.length === 2000, 'world size ' + w1.bodies.length + '/' + w1.food.length);
    ok(w1.bodies.some((b) => b.virus) && w1.bodies.some((b) => !b.virus), 'world has no viruses or no players');
    const w0 = B.createWorld(spec);
    ok(w1.bodies.some((b, i) => b.r !== w0.bodies[i].r), 'bodies never change size (mass text would never change)');
    /* packets: the full first update, then a tick with removals */
    const full = decodeUpdate(B.encodeUpdate(w1, 0, true), true);
    ok(full.cells.length === 1 + 1 + 500 + 2000, 'main full update has ' + full.cells.length + ' cells');
    const b0 = w1.bodies[0], d0 = full.cells.find((c) => c.id === b0.id);
    ok(d0 && d0.x === Math.round(b0.x) && d0.y === Math.round(b0.y) && d0.size === b0.r && (d0.flags & 0x80) && (d0.flags & 2), 'body packet fields');
    ok(d0 && d0.type === (b0.virus ? 2 : 0) && (b0.virus || d0.name === b0.name), 'body type / name');
    ok(full.cells.filter((c) => c.type === 1).length === 2000, 'food cells in the main update');
    B.step(w1);
    const tick = decodeUpdate(B.encodeUpdate(w1, 0, false), true);
    ok(tick.removed.length === w1.removedFood.length && tick.removed.length > 0, 'removed food in a tick');
    ok(tick.cells.filter((c) => c.type === 1).length === w1.addedFood.length, 'new food in a tick');
    const unit = decodeUpdate(B.encodeUpdate(w1, 1, true), false);
    ok(unit.cells.length > 0 && unit.cells.every((c) => !(c.flags & 0x80)), 'unit layout (no private-server flag)');
    ok(unit.cells.every((c) => c.x > -301), 'unit sees only its side');
    /* statistics */
    const d = B.dist([5, 1, 4, 2, 3]);
    ok(d.p50 === 3 && d.max === 5 && d.mean === 3 && Math.abs(d.p95 - 4.8) < 1e-9, 'percentiles ' + JSON.stringify(d));
    let tm = 0;
    const sc = B.createScopes(() => tm, ['a', 'b']);
    const da = sc.b('a'); tm += 2; const db = sc.b('b'); tm += 3; sc.e(db); tm += 1; sc.e(da);
    ok(sc.acc[0] === 3 && sc.acc[1] === 3, 'scope self time ' + sc.acc[0] + '/' + sc.acc[1]);
    /* every timed method still exists in the client */
    const root = path.join(__dirname, '..', '..');
    const core = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
    B.WRAPS.forEach((w) => ok(new RegExp('\\n\\s+' + w[1].replace(/\$/g, '\\$') + '(\\s*:\\s*function\\s*)?\\s*\\(').test(core), 'ogario.v4.js has no method ' + w[1] + ' (stage ' + w[2] + ')'));
    ['grid', 'jelly physics', 'text pass', 'rings/HUD pass'].forEach((m) => ok(core.indexOf("_lmScope.b('" + m + "')") >= 0, 'inline timing marker missing: ' + m));
    /* the gate */
    const meta = { gpu: 'G', browser: '150.0.1', errors: [], calibrationMs: 100 };
    const r = { name: 's', errors: 0, missingStages: [], renderMs: { p50: 10 }, frameMs: { p95: 20 }, glShare: 1, counts: { draws: 10, pointsSubmitted: 1000 }, world: { cells: 1001 } };
    const base = { meta, results: [r] };
    const mod = (f) => { const x = JSON.parse(JSON.stringify(r)); f(x); return { meta: Object.assign({}, meta), results: [x] }; };
    ok(gate(base, mod(() => { })).fail.length === 0, 'gate fails an identical run');
    ok(gate(base, mod((x) => (x.renderMs.p50 = 15))).fail.length === 0, 'gate fails a noisy run');
    ok(gate(base, mod((x) => (x.renderMs.p50 = 40))).fail.length === 1, 'gate passes a 4x slower render');
    const other = mod((x) => (x.renderMs.p50 = 40));
    other.meta.gpu = 'H';
    ok(gate(base, other).fail.length === 0 && gate(base, other).info.length >= 2, 'timings gated on another GPU');
    const busy = mod((x) => (x.renderMs.p50 = 40));
    busy.meta.calibrationMs = 200;
    ok(gate(base, busy).fail.length === 0 && gate(base, busy).info.some((m) => /busy/.test(m)), 'timings gated on a busy machine');
    const busyGpu = mod((x) => (x.renderMs.p50 = 40));
    base.meta.calibrationGpuMs = 10;
    busyGpu.meta.calibrationGpuMs = 30;
    ok(gate(base, busyGpu).fail.length === 0, 'timings gated while the GPU is busy');
    const busyCounts = mod((x) => (x.counts.draws = 40));
    busyCounts.meta.calibrationMs = 200;
    ok(gate(base, busyCounts).fail.length === 1, 'counts not gated on a busy machine');
    ok(gate(base, mod((x) => (x.counts.pointsSubmitted = 600))).fail.length === 1, 'gate passes lost jelly points');
    ok(gate(base, mod((x) => (x.counts.draws = 40))).fail.length === 1, 'gate passes 4x draw calls');
    ok(gate(base, mod((x) => (x.glShare = 0.5))).fail.length === 1, 'gate passes more Canvas2D fallback');
    ok(gate(base, mod((x) => (x.missingStages = ['drawRender.drawFood']))).fail.length === 1, 'gate passes a lost stage');
    if (fs.existsSync(BASELINE)) {
        try {
            const bl = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
            const quick = B.matrix('quick').map((s) => s.name);
            ok(bl.meta && bl.meta.gpu && Array.isArray(bl.results), 'bench-baseline.json is not a baseline');
            quick.forEach((q) => ok(bl.results.some((x) => x.name === q), 'bench-baseline.json lacks the quick scene ' + q));
        } catch (e) { fails.push('bench-baseline.json: ' + e.message); }
    }
    if (fails.length) { console.log('bench self-check FAILED:\n  ' + fails.join('\n  ')); return 1; }
    console.log('bench self-check: ok (scenes, seeded world, packets, statistics, timed methods, gate). Browser run: --quick or --run');
    return 0;
}

async function main(argv) {
    const has = (n) => argv.indexOf(n) >= 0;
    if (!has('--quick') && !has('--run')) return selfCheck();
    const client = require('./lib/bench-client.js');
    if (!client.findChrome()) { console.log('bench: Chrome not found (set CHROME_PATH): skipped'); return 0; }
    const args = argv.filter((a) => a !== '--quick' && a !== '--run' && a !== '--update-baseline');
    const label = (() => { const i = args.indexOf('--label'); return i >= 0 ? args[i + 1] : null; })() || (has('--quick') ? 'quick-' : 'run-') + Date.now();
    if (args.indexOf('--label') < 0) args.push('--label', label);
    if (has('--quick')) {
        if (args.indexOf('--preset') < 0) args.push('--preset', 'quick');
        if (args.indexOf('--warm') < 0) args.push('--warm', String(QUICK.warm));
        if (args.indexOf('--measure') < 0) args.push('--measure', String(QUICK.measure));
    }
    const code = await client.main(args);
    if (code) return code;
    const cur = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'bench-' + label + '.json'), 'utf8'));
    /* measures the scenes once more; per scene the better run counts (lower render p50 + frame
     * p95): one stall of another program on the machine must not decide the result */
    const again = async (names) => {
        console.log('bench: measuring again: ' + names.join(', '));
        const args2 = args.slice();
        args2[args2.indexOf('--label') + 1] = label + '-again';
        args2.push('--scenes', names.join(','), '--no-capture');
        if (await client.main(args2)) return;
        const cur2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'out', 'bench-' + label + '-again.json'), 'utf8'));
        cur.results = cur.results.map((r) => {
            const r2 = cur2.results.find((x) => x.name === r.name);
            return r2 && r2.renderMs.p50 + r2.frameMs.p95 < r.renderMs.p50 + r.frameMs.p95 ? r2 : r;
        });
        cur.meta.errors = [...new Set(cur.meta.errors.concat(cur2.meta.errors))];
        for (const k of ['calibrationMs', 'calibrationGpuMs']) {
            cur.meta[k] = Math.min(cur.meta[k] || Infinity, cur2.meta[k] || Infinity);
            if (!isFinite(cur.meta[k])) delete cur.meta[k];
        }
    };
    if (has('--update-baseline')) {
        await again(cur.results.map((r) => r.name));
        if (cur.meta.errors.length) { console.log('bench: page errors, baseline not written: ' + cur.meta.errors.slice(0, 5).join(' / ')); return 1; }
        const m = cur.meta;
        const bl = { meta: { gpu: m.gpu, browser: m.browser, head: m.head, date: m.date, canvas: m.canvas, dpr: m.dpr, warm: m.warm, measure: m.measure, calibrationMs: m.calibrationMs, calibrationGpuMs: m.calibrationGpuMs, errors: [] }, results: cur.results.map(slim) };
        fs.writeFileSync(BASELINE, JSON.stringify(bl, null, 1) + '\n');
        console.log('bench: baseline written to ' + BASELINE + ' (the better of two runs per scene)');
        return 0;
    }
    if (!has('--quick')) return 0;
    if (!fs.existsSync(BASELINE)) { console.log('bench: no baseline (' + BASELINE + '); store one with --quick --update-baseline'); return 0; }
    const base = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
    let g = gate(base, cur);
    const failed = [...new Set(g.fail.map((x) => x.split(':')[0]).filter((n) => cur.results.some((r) => r.name === n)))];
    if (failed.length) {
        await again(failed);
        g = gate(base, cur);
    }
    g.info.forEach((m) => console.log('  info: ' + m));
    g.fail.forEach((m) => console.log('  FAIL: ' + m));
    console.log('bench gate: ' + (g.fail.length ? 'FAILED (' + g.fail.length + ')' : 'PASS'));
    return g.fail.length ? 1 : 0;
}

module.exports = { gate, slim, decodeUpdate, LIMITS };
if (require.main === module) main(process.argv.slice(2)).then((c) => process.exit(c || 0), (e) => { console.error(e); process.exit(1); });
