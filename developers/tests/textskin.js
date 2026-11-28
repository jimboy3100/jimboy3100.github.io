/* WebGL text texture and skin canvas checks: the text cache byte budget and trim (lmTextTexBudget,
 * lmTextCacheEvict), the per-cell mass texture redraw rule and pool (lmMassTexDue, lmMassLag,
 * lmMassPoolTrim), the frame-budgeted skin canvas queue and its cap (lmSkinJobPick, lmSkinJobsRun,
 * lmSkinJobDrop), plus the methods that use them (getOrCreateTextTexture, _lmMassTexture,
 * _lmTextFrameBegin, _lmTextIdle, _lmSkinJobAdd ...) run against stubs, with stress runs of
 * hundreds of fresh / overdue cells and 500 finished skin downloads, and a tab visibility change.
 * The code is taken from ogario/ogario.v4.js.
 * node developers/tests/textskin.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
function block(i) {
    let d = 0, j = src.indexOf('{', i);
    for (let k = j; k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
}
function grab(name) {
    const i = src.indexOf('    function ' + name + '(');
    if (i < 0) throw Error(name + ' not found');
    return block(i);
}
/* an object-literal method (8 spaces in): returned as "name: function (...) {...}" */
function method(name) {
    const i = src.indexOf('\n        ' + name + '(');
    if (i < 0) throw Error(name + ' not found');
    const body = block(i + 9);
    return name + ': function ' + body.slice(name.length);
}
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(['lmTextTexBudget', 'lmTextCacheEvict', 'lmMassTexDue', 'lmMassDue', 'lmMassLag', 'lmMassPoolTrim', 'lmSkinJobPick', 'lmSkinJobsRun', 'lmSkinJobDrop', 'lmSkinSlack'].map(grab).join('\n'), ctx);
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
const C = ctx;
const MB = 1048576;

/* ---- text cache byte budget ---- */
check('budget: 32 MB when the device memory is unknown', C.lmTextTexBudget(undefined) === 32 * MB && C.lmTextTexBudget(NaN) === 32 * MB && C.lmTextTexBudget(0) === 32 * MB);
check('budget: 8 MB per GB, 16..64 MB', C.lmTextTexBudget(4) === 32 * MB && C.lmTextTexBudget(0.5) === 16 * MB && C.lmTextTexBudget(8) === 64 * MB && C.lmTextTexBudget(32) === 64 * MB);

const mk = (list) => { const m = new Map(); let b = 0; for (const [k, bytes, frame] of list) { m.set(k, { bytes, frame }); b += bytes; } return [m, b]; };
let [m, b] = mk([['a', 4 * MB, 1], ['b', 4 * MB, 2], ['c', 1 * MB, 3], ['d', 1 * MB, 9]]);
check('within count and bytes: nothing evicted', C.lmTextCacheEvict(m, b, 500, 32 * MB, 9).length === 0);
check('over the byte budget: the least recently used go first until under it', C.lmTextCacheEvict(m, b, 500, 6 * MB, 9).join() === 'a' && C.lmTextCacheEvict(m, b, 500, 5 * MB, 9).join() === 'a,b');
check('over the count: oldest first until the count fits', C.lmTextCacheEvict(m, b, 2, 64 * MB, 9).join() === 'a,b');
check('entries drawn in the current/previous frame are never evicted', C.lmTextCacheEvict(m, b, 500, 1 * MB, 3).join() === 'a,b');
check('evict does not change the map', m.size === 4);
check('entries without a frame stamp can be evicted', C.lmTextCacheEvict(mk([['x', 5 * MB, undefined], ['y', 1, 5]])[0], 5 * MB + 1, 500, MB, 5).join() === 'x');
/* the old count-only rule kept 500 textures of up to 4 MB: 2 GB */
[m, b] = mk(Array.from({ length: 500 }, (_, i) => ['k' + i, 4 * MB, i]));
const ev = C.lmTextCacheEvict(m, b, 500, 32 * MB, 1000);
check('500 large textures: trimmed to the byte budget (8 x 4 MB kept)', ev.length === 492 && ev[0] === 'k0' && ev[491] === 'k491');
check('limit: at most limit keys per call', C.lmTextCacheEvict(m, b, 500, 32 * MB, 1000, 64).length === 64);

/* ---- mass texture redraw rule: 0 no, 1 in budget, 2 over budget (counted) ---- */
const e = { txt: '1234', style: 's', at: 1000, due: 1100 };
check('new cell under the budget: drawn', C.lmMassTexDue(null, '1', 's', 0, 0, 2, 0, 6) === 1);
check('same text and style: not drawn again', C.lmMassTexDue(e, '1234', 's', 5000, 0, 2, 0, 6) === 0);
check('new value under the frame budget: drawn', C.lmMassTexDue(e, '1235', 's', 1001, 1.5, 2, 0, 6) === 1);
check('new value over the budget, before its deadline: waits', C.lmMassTexDue(e, '1235', 's', 1050, 2.5, 2, 0, 6) === 0);
check('over the budget: past its deadline, a new cell, a new style are urgent', C.lmMassTexDue(e, '1235', 's', 1100, 9, 2, 0, 6) === 2 &&
    C.lmMassTexDue(null, '1', 's', 0, 9, 2, 5, 6) === 2 && C.lmMassTexDue(e, '1234', 't', 1001, 9, 2, 0, 6) === 2);
check('busy (some deferred last frame): the budget goes to urgent ones only', C.lmMassTexDue(e, '1235', 's', 1050, 0, 2, 0, 6, true) === 0 && C.lmMassTexDue(e, '1235', 's', 1100, 0, 2, 0, 6, true) === 1);
check('over the budget: no more than maxForced urgent redraws per frame', C.lmMassTexDue(e, '1235', 's', 5000, 9, 2, 6, 6) === 0 && C.lmMassTexDue(null, '1', 's', 0, 9, 2, 6, 6) === 0);
check('lag: 100 ms normally; about one round through the waiting cells when busy; at most 2 s', C.lmMassLag(0, 5, 16, 100) === 100 && C.lmMassLag(380, 14, 16, 100) === 380 / 14 * 16 && C.lmMassLag(1e6, 1, 16, 100) === 2000 && C.lmMassLag(50, 0, 16, 100) === 800);
check('deadline: 100-150 ms after the redraw', C.lmMassDue(1000, 100, 0) === 1100 && C.lmMassDue(1000, 100, 1) === 1150);

/* ---- mass pool trim ---- */
{
    const pool = new Map();
    let bytes = 0;
    [['old', 1, 10], ['a', 1, 95], ['b', 1, 98], ['cur', 1, 99], ['cur2', 1, 100]].forEach(([k, by, fr]) => { pool.set(k, { bytes: by, frame: fr }); bytes += by; });
    check('pool trim: only stale ones while under the byte budget', C.lmMassPoolTrim(pool, bytes, 100, 100, 60, 99, 64).join() === 'old');
    check('pool trim: over the budget, least recently drawn next, never the last two frames', C.lmMassPoolTrim(pool, bytes, 1, 100, 60, 99, 64).join() === 'old,a,b');
    check('pool trim: limit', C.lmMassPoolTrim(pool, bytes, 1, 100, 60, 99, 2).length === 2 && pool.size === 5);
}

/* ---- skin job cap ---- */
{
    const J = (id, seen) => ({ id, seen });
    const list = [J('a', 0), J('b', 4500), J('vis', 4900), J('c', 0), J('d', 3000)];
    check('skin cap: under the cap nothing dropped', C.lmSkinJobDrop(list, 5000, 1000, 5).length === 0);
    check('skin cap: least recently asked for first (oldest of equal ones), never on screen', C.lmSkinJobDrop(list, 5000, 1000, 2).map((j) => j.id).join() === 'a,c,d');
    check('skin cap: on-screen jobs are kept even over the cap', C.lmSkinJobDrop([J('v1', 4999), J('v2', 4998)], 5000, 1000, 0).length === 0);
    /* hard ceiling: 2 x the soft cap, then recent ones go too (least recently asked for first),
     * except those asked for in this frame (last 50 ms) */
    const recent = (n, now) => Array.from({ length: n }, (_, i) => J('r' + i, now - 100 - (i % 800)));
    let rj = recent(200, 5000);
    let rd = C.lmSkinJobDrop(rj, 5000, 1000, 96, 192, 50);
    check('hard cap: 200 recent jobs, soft 96 / hard 192: 8 dropped, the least recently asked for', rd.length === 8 && rd.every((j) => j.seen <= 5000 - 100 - 192));
    rj = recent(500, 5000).concat(Array.from({ length: 20 }, (_, i) => J('now' + i, 4990)));
    rd = C.lmSkinJobDrop(rj, 5000, 1000, 96, 192, 50);
    check('hard cap: 500 recent + 20 drawn this frame: back to 192, the 20 kept', rj.length - rd.length === 192 && !rd.some((j) => j.id.startsWith('now')));
    check('hard cap: only jobs drawn this frame over it: kept', C.lmSkinJobDrop(Array.from({ length: 300 }, (_, i) => J('f' + i, 4999)), 5000, 1000, 96, 192, 50).length === 0);
    check('hard cap: old jobs still go first', C.lmSkinJobDrop([J('o', 0)].concat(recent(200, 5000)), 5000, 1000, 96, 192, 50)[0].id === 'o');
}

/* ---- skin canvas queue ---- */
const jobs = (list) => list.map(([id, seen]) => ({ id, seen }));
check('pick: nothing to do', C.lmSkinJobPick([], 0, 1000) === -1);
check('pick: oldest when none is on screen', C.lmSkinJobPick(jobs([['a', 0], ['b', 0]]), 5000, 1000) === 0);
check('pick: oldest one seen by a draw in the last second first', C.lmSkinJobPick(jobs([['a', 0], ['b', 3000], ['c', 4500], ['d', 4800]]), 5000, 1000) === 2);
check('pick: a stamp older than a second is not on screen', C.lmSkinJobPick(jobs([['a', 0], ['b', 3000]]), 5000, 1000) === 0);

/* fake clock: each job costs its own ms */
function runFrame(q, cost, budget, avg, now) {
    let t = 0;
    const done = [];
    const a = C.lmSkinJobsRun(q, budget, avg, () => t, now, 1000, (j) => { done.push(j.id); t += cost(j); });
    return { done, avg: a };
}
let q = jobs(Array.from({ length: 30 }, (_, i) => ['j' + i, 0]));
let r = runFrame(q, () => 1, 4, 0, 5000);
check('budget: 1 ms jobs, 4 ms per frame (the next runs only when it fits)', r.done.length === 4 && q.length === 26 && r.avg === 1);
r = runFrame(q, () => 1, 4, r.avg, 5000);
check('budget: the rest waits for the next frames, in order', r.done.join() === 'j4,j5,j6,j7');
q = jobs([['big', 0], ['b', 0]]);
r = runFrame(q, (j) => j.id === 'big' ? 30 : 1, 4, 0, 5000);
check('the first job of a frame always runs, even a slow one', r.done.join() === 'big' && q.length === 1);
r = runFrame(q, () => 1, 4, r.avg, 5000);
check('a slow average still lets one job per frame run', r.done.join() === 'b' && q.length === 0);
q = jobs([['off1', 0], ['off2', 0], ['vis', 4990], ['off3', 0]]);
r = runFrame(q, () => 1, 2, 0, 5000);
check('on-screen skins go first, then the oldest', r.done.join() === 'vis,off1');
q = [{ id: 'bad', seen: 0 }, { id: 'ok', seen: 0 }];
let t2 = 0;
const ran = [];
C.lmSkinJobsRun(q, 4, 0, () => t2, 0, 1000, (j) => { ran.push(j.id); if (j.id === 'bad') throw Error('x'); });
check('a throwing job does not stop the queue', ran.join() === 'bad,ok' && q.length === 0);

/* ---- the application skin job methods (stubs) ---- */
const tick = () => new Promise((r) => setImmediate(r));
async function skinMethods() {
    const raf = [], timers = [], listeners = {};
    let dnow = 10000;
    const app = {};
    const sb = { app, Map, Date: { now: () => dnow }, performance: { now: () => 0 },
        document: { hidden: false, addEventListener: (t, f) => { listeners[t] = f; } },
        requestAnimationFrame: (f) => { raf.push(f); return raf.length; }, cancelAnimationFrame: (id) => { raf[id - 1] = null; },
        setTimeout: (f) => { timers.push(f); return 1000 + timers.length; },
        lmSkinJobsRun: C.lmSkinJobsRun, lmSkinJobPick: C.lmSkinJobPick, lmSkinJobDrop: C.lmSkinJobDrop, lmSkinSlack: C.lmSkinSlack };
    vm.createContext(sb);
    /* the skin queues' clock (lmClockMs), on this sandbox's performance.now */
    vm.runInContext(grab('lmClockMs'), sb);
    vm.runInContext('Object.assign(app, {' + ['_lmSkinJobAdd', '_lmSkinJobTrim', '_lmSkinJobDropOne', '_lmSkinDecodeNext', '_lmSkinJobsSchedule', '_lmSkinJobRun', '_lmSkinCanvases'].map(method).join(',\n') + '});', sb);
    const made = [];
    Object.assign(app, {
        _lmSkinJobMax: 96, _lmSkinDecodeMax: 6,
        customSkinsCache: {}, cacheQueue: [], cacheQueue2: [], cacheQueue3: [], cacheQueue4: [], cacheQueueSkinAnimated: [],
        _pendingSkinLoads: new Set(), touched: [], trims: 0,
        _lmTouchSkin(u) { this.touched.push(u); }, _lmTrimSkinCache() { this.trims++; },
        cacheSkin() { while (this.cacheQueue.length) made.push('c:' + this.cacheQueue.shift()); },
        cacheSkin2() { while (this.cacheQueue2.length) made.push('c2:' + this.cacheQueue2.shift()); },
        cacheSkin3() { while (this.cacheQueue3.length) made.push('c3:' + this.cacheQueue3.shift()); },
        cacheSkin4() { while (this.cacheQueue4.length) made.push('c4:' + this.cacheQueue4.shift()); },
        cacheSkinAnimated() { while (this.cacheQueueSkinAnimated.length) made.push('ca:' + this.cacheQueueSkinAnimated.shift()); },
    });
    const runRaf = () => { const f = raf.shift(); if (f) f(); };
    const img1 = { id: 1 }, img2 = { id: 2 };
    app._pendingSkinLoads.add('u1');
    app._lmSkinJobAdd(app.customSkinsCache, 'u1', img1, undefined, true);
    app._lmSkinJobAdd(app.customSkinsCache, 'u1', img2, undefined, true);
    check('job: nothing is published or made inside the load callback', !app.customSkinsCache.u1 && made.length === 0 && app._pendingSkinLoads.has('u1'));
    check('job: one rAF scheduled, one job per URL', raf.length === 1 && app._lmSkinJobs.length === 1);
    runRaf();
    check('job: published from the frame, first image wins, then stamped and trimmed', app.customSkinsCache.u1 === img1 && app.touched.join() === 'u1' && app.trims === 1);
    check('job: canvases of a plain skin (512 + 64 px) and no longer pending', made.join() === 'c:u1,c2:u1' && !app._pendingSkinLoads.has('u1') && !app._lmSkinJobMap.has('u1'));
    made.length = 0;
    app._lmSkinJobAdd(app.customSkinsCache, 'u2', {}, true, false);
    app._lmSkinJobAdd(app.customSkinsCache, 'u3', {}, 'fbSkin', false);
    app._lmSkinJobAdd(app.customSkinsCache, 'u4', {}, 'animatedSkins', false);
    check('jobs added in one burst share one rAF', raf.length === 1);
    runRaf();
    check('2-frame sheet: both frames + thumbnail; fbSkin; animatedSkins (as before)', made.join() === 'c:u2,c2:u2,c3:u2,c4:u3,ca:u4,c2:u4');

    /* image.decode(): queued only after it settles */
    let resolve;
    app._lmSkinJobAdd(app.customSkinsCache, 'u5', { decode: () => new Promise((r) => { resolve = r; }) }, undefined, false);
    check('decode: not queued before decode() settles', raf.length === 0 && !app._lmSkinJobs.length && app._lmSkinDecoding === 1);
    resolve();
    await tick();
    check('decode: queued after decode() resolves', raf.length === 1 && app._lmSkinJobs.length === 1 && app._lmSkinDecoding === 0);
    runRaf();
    app._lmSkinJobAdd(app.customSkinsCache, 'u6', { decode: () => Promise.reject(Error('bad')) }, undefined, false);
    await tick();
    check('decode: a rejected decode() still makes the canvases', raf.length === 1);
    runRaf();
    check('decode: published', !!app.customSkinsCache.u6);

    /* decode concurrency and the job cap */
    const res = [];
    app._lmSkinDecodeMax = 2;
    app._lmSkinJobMax = 5;
    for (let i = 0; i < 8; i++) {
        app._pendingSkinLoads.add('d' + i);
        app._lmSkinJobAdd(app.customSkinsCache, 'd' + i, { decode: () => new Promise((r) => res.push(r)) }, undefined, i === 6);
    }
    check('decodes: at most _lmSkinDecodeMax at once', app._lmSkinDecoding === 2 && res.length === 2);
    check('cap: waiting jobs beyond the cap dropped, least recently asked for first, on-screen kept',
        app._lmSkinDecodeWait.length === 5 && app._lmSkinJobMap.size === 7 && app._lmSkinJobMap.has('d6') && !app._lmSkinJobMap.has('d2') && app._lmSkinJobMap.has('d3'));
    check('cap: a dropped skin is no longer pending (asked for again later: from _skinMemoryCache)', !app._pendingSkinLoads.has('d2') && app._pendingSkinLoads.has('d6'));
    res.shift()();
    await tick();
    check('decodes: the next starts when one settles, on-screen first', app._lmSkinDecoding === 2 && res.length === 2 && !app._lmSkinDecodeWait.some((j) => j.url === 'd6'));
    while (res.length) { res.shift()(); await tick(); }
    for (let f = 0; f < 10 && raf.length; f++) runRaf();
    /* 7 decoded jobs reach the queue frame together: it trims them to the cap (5) first,
     * dropping the least recently asked-for ones, never the on-screen d6 */
    const madeD = ['d0', 'd1', 'd3', 'd4', 'd5', 'd6', 'd7'].filter((u) => app.customSkinsCache[u]);
    check('decodes: the queue frame trims to the cap, then every kept job is made', madeD.length === 5 && madeD.includes('d6') && !app._lmSkinJobMap.size && app._lmSkinDecoding === 0);
    app._lmSkinDecodeMax = 6;
    app._lmSkinJobMax = 96;

    /* stress: 500 finished downloads in one burst */
    for (let i = 0; i < 500; i++) app._lmSkinJobAdd(app.customSkinsCache, 's' + i, {}, undefined, i % 50 === 0);
    check('burst: queued jobs held at the cap (+ on-screen ones)', app._lmSkinJobs.length <= 96 + 10 && app._lmSkinJobMap.size === app._lmSkinJobs.length);
    check('burst: on-screen ones kept', [0, 50, 100, 450].every((i) => app._lmSkinJobMap.has('s' + i)));
    for (let f = 0; f < 200 && raf.length; f++) runRaf();
    /* 300 jobs all asked for by draws (recent: the soft cap keeps them), added in one go */
    const asked = [];
    for (let i = 0; i < 300; i++) { app._lmSkinJobAdd(app.customSkinsCache, 'h' + i, {}, undefined, true); asked.push('h' + i); dnow += 1; }
    check('hard cap: 300 recent jobs held at 2 x 96 while they arrive', app._lmSkinJobs.length === 192);
    /* they age in the queue without new arrivals: the next queue frame trims again */
    dnow += 2000;
    raf.length = 0;
    app._lmSkinJobRaf = 0;
    app._lmSkinJobsSchedule();
    runRaf();
    check('aged jobs: trimmed back to the soft cap on the next queue frame (no new job needed)', asked.filter((u) => app.customSkinsCache[u]).length === 96 && !app._lmSkinJobMap.size);

    /* visibility: a frame asked for before the tab hid is swapped for a timer */
    for (let f = 0; f < 200 && raf.length; f++) runRaf();
    app._lmSkinJobAdd(app.customSkinsCache, 'v1', {}, undefined, false);
    check('visible: an animation frame is asked for', raf.length === 1 && app._lmSkinJobRafKind === 'raf');
    sb.document.hidden = true;
    listeners.visibilitychange();
    check('hidden: the frame is cancelled and a timer runs instead', raf[0] === null && app._lmSkinJobRafKind === 'timer' && timers.length === 1);
    timers.shift()();
    check('hidden: the skin is made by the timer', !!app.customSkinsCache.v1);
    app._lmSkinJobAdd(app.customSkinsCache, 'v2', {}, undefined, false);
    check('hidden: new jobs use a timer too', app._lmSkinJobRafKind === 'timer' && timers.length === 1);
    sb.document.hidden = false;
    listeners.visibilitychange();
    timers.shift()();
    check('visible again: nothing stuck', !!app.customSkinsCache.v2 && !app._lmSkinJobMap.size);
}

/* ---- getOrCreateTextTexture / _lmMassTexture with a stub GL ---- */
function textMethods() {
    let texId = 0;
    const calls = [];
    const gl = {
        TEXTURE_2D: 1, RGBA: 2, UNSIGNED_BYTE: 3, TEXTURE_MIN_FILTER: 4, TEXTURE_MAG_FILTER: 5, LINEAR: 6, TEXTURE_WRAP_S: 7, TEXTURE_WRAP_T: 8, CLAMP_TO_EDGE: 9,
        createTexture: () => ({ id: ++texId }), deleteTexture: (t) => calls.push('del' + t.id), bindTexture: () => { },
        texImage2D: () => calls.push('img'), texSubImage2D: () => calls.push('sub'), texParameteri: () => { }, isContextLost: () => false,
    };
    const canvas = { width: 0, height: 0 };
    let now = 0, rasterCost = 0, rnd = 0;
    const tctx = { font: '', measureText: (t) => { now += rasterCost; return { width: t.length * 50 }; }, setTransform() { }, clearRect() { }, scale() { }, strokeText() { }, fillText() { } };
    const timers = [];
    let dnow = 100000;
    /* the text pass hold times run on performance.now (lmClockMs), not on Date.now */
    const later = (ms) => { dnow += ms; now += ms; };
    const fakeMath = Object.create(Math);
    fakeMath.random = () => rnd;
    const sb = { r: null, Map, Date: { now: () => dnow }, Math: fakeMath, parseInt, Infinity, window: { navigator: {} }, performance: { now: () => now },
        setTimeout: (f) => { const t = () => { if (!t.dead) f(); }; timers.push(t); return t; }, clearTimeout: (t) => { if (t) t.dead = true; } };
    vm.createContext(sb);
    vm.runInContext(['lmClockMs', 'lmTextTexBudget', 'lmTextCacheEvict', 'lmMassTexDue', 'lmMassDue', 'lmMassLag', 'lmMassPoolTrim', 'lmTextAtlasNew', 'lmTextAtlasAlloc', 'lmTextAtlasFree', 'lmTextAtlasLayers', 'lmTextAtlasStep', 'lmTextAtlasMaxPages'].map(grab).join('\n'), sb);
    vm.runInContext('r = {' + ['getOrCreateTextTexture', '_lmTextCached', '_lmRasterImage', '_lmRasterText', '_lmMassTexture', '_lmTextFrameBegin', '_lmTextIdle', '_lmTextStore', '_lmTextRelease', '_lmTextAtlasGet', '_lmTextAtlasSlot', '_lmTextAtlasReclaim', '_lmTextAdopt'].map(method).join(',\n') + '};', sb);
    const r = sb.r;
    const reset = () => Object.assign(r, { gl, glTextProgram: {}, glTextCache: new Map(), glTextCacheMaxSize: 500, _lmTextBytes: 0, _lmMassTex: null, _lmMassBytes: 0,
        _textCanvas: canvas, _textCtx: tctx, _lmTextBudget: 0, _lmTextFrame: 0, _lmTextIdleTimer: 0 });
    reset();
    const F = 'bold 100px Ubuntu';
    const T = 220 * 140 * 4; /* one 4-character text texture */

    r._lmTextFrameBegin();
    const a = r.getOrCreateTextTexture('nick', F, '#fff', '#000', 10);
    check('text: one texture, bytes counted (w x h x 4)', a && a.w === 220 && a.h === 140 && r._lmTextBytes === T && calls.join() === 'img');
    check('text: a hit uploads nothing', r.getOrCreateTextTexture('nick', F, '#fff', '#000', 10) === a && calls.length === 1);
    r._lmTextBudget = T * 3;
    for (let f = 0; f < 6; f++) {
        r._lmTextFrameBegin();
        r.getOrCreateTextTexture('n' + f + 'xx', F, '#fff', '#000', 10);
    }
    check('text: byte budget holds (3 textures), oldest deleted, bytes match the cache', r.glTextCache.size === 3 && r._lmTextBytes === 3 * T && calls.includes('del1'));
    /* burst over the budget (all drawn in one frame), then only hits on two of them */
    r._lmTextFrameBegin();
    for (let i = 0; i < 10; i++) r.getOrCreateTextTexture('b' + i + 'xx', F, '#fff', '#000', 10);
    check('text: textures drawn in this frame are kept over the budget (no thrash)', r.glTextCache.size >= 10);
    let frames = 0;
    for (; frames < 5 && r._lmTextBytes > r._lmTextBudget; frames++) {
        r._lmTextFrameBegin();
        r.getOrCreateTextTexture('b8xx', F, '#fff', '#000', 10);
        r.getOrCreateTextTexture('b9xx', F, '#fff', '#000', 10);
    }
    check('text: after the burst, with hits only, back under the budget within 2 frames', r._lmTextBytes <= r._lmTextBudget && frames <= 2 && r.glTextCache.has('b9xx|' + F + '|#fff|#000|10'));
    let sum = 0;
    r.glTextCache.forEach((v) => { sum += v.bytes; });
    check('text: byte total always equals the cache contents', sum === r._lmTextBytes);

    /* mass */
    reset();
    calls.length = 0;
    const cell = {}, cell2 = {};
    r._lmTextFrameBegin();
    const m1 = r._lmMassTexture(cell, '1234', F, '#fff', '#000', 10);
    const m1Tex = m1 && m1.tex; /* released entries drop their texture reference */
    check('mass: new cell gets its own texture, its bytes counted in _lmMassBytes', m1 && calls.join() === 'img' && m1.txt === '1234' && r._lmMassBytes === T);
    r._lmTextFrameBegin();
    const m2 = r._lmMassTexture(cell, '1235', F, '#fff', '#000', 10);
    check('mass: new value of the same width rewrites the same texture (no new one)', m2 === m1 && calls.join() === 'img,sub' && m2.txt === '1235' && texId === m1.tex.id);
    r._lmMassTexture(cell, '12345', F, '#fff', '#000', 10);
    check('mass: a wider value re-specifies the same texture, bytes follow', calls.join() === 'img,sub,img' && m1.w === 270 && r._lmMassBytes === 270 * 140 * 4);
    check('mass: the text cache is not touched by mass values', r.glTextCache.size === 0 && r._lmTextBytes === 0);
    r._lmTextFrameBegin();
    r._lmMassSpent = 5;
    now = m1.at + 10;
    r._lmMassTexture(cell, '12346', F, '#fff', '#000', 10);
    check('mass: over the frame budget the previous value stays', m1.txt === '12345' && calls.length === 3);
    now = m1.due;
    r._lmMassTexture(cell, '12346', F, '#fff', '#000', 10);
    check('mass: ...until its deadline', m1.txt === '12346' && r._lmMassForced === 1);
    r._lmMassTexture(cell2, '99', F, '#fff', '#000', 10);
    check('mass: a new cell is drawn over the budget while the per-frame cap allows', r._lmMassTex.get(cell2).txt === '99' && r._lmMassForced === 2);
    calls.length = 0;
    for (let f = 0; f < 100; f++) {
        r._lmTextFrameBegin();
        r._lmMassTexture(cell2, '99', F, '#fff', '#000', 10);
    }
    check('mass: textures of cells no longer drawn are deleted, drawn ones kept, bytes follow', !r._lmMassTex.has(cell) && r._lmMassTex.has(cell2) && calls.join() === 'del' + m1Tex.id && r._lmMassBytes === 120 * 140 * 4);

    /* stress: 400 fresh cells at once (spawn, zoom out, reconnect), 0.25 ms per raster */
    reset();
    rasterCost = 0.25;
    const cells = Array.from({ length: 400 }, () => ({}));
    const perFrame = [];
    let shown = 0;
    for (let f = 0; f < 60 && shown < 400; f++) {
        r._lmTextFrameBegin();
        const n0 = calls.length;
        shown = 0;
        for (const c of cells) if (r._lmMassTexture(c, '1000', F, '#fff', '#000', 10)) shown++;
        perFrame.push(calls.length - n0);
        now += 16;
    }
    const maxPer = Math.max.apply(null, perFrame);
    /* 2 ms / 0.25 ms = 8 in the budget (the 8th may end just past it) + 6 urgent */
    check('stress fresh: at most ~14 redraws per frame (was 400 in one frame)', maxPer <= 15);
    check('stress fresh: every cell has its mass within ' + perFrame.length + ' frames', shown === 400 && perFrame.length <= 30);

    /* stress: 400 cells throttled together, then every value changes every frame */
    rnd = 0;
    const sync = [];
    let dues = new Set();
    for (let f = 0; f < 40; f++) {
        r._lmTextFrameBegin();
        rnd = (f * 0.137) % 1;
        const n0 = calls.length;
        cells.forEach((c, i) => r._lmMassTexture(c, String(2000 + f), F, '#fff', '#000', 10));
        sync.push(calls.length - n0);
        now += 16;
    }
    r._lmMassTex.forEach((e) => dues.add(Math.round(e.due)));
    check('stress overdue: never more than ~14 redraws per frame', Math.max.apply(null, sync) <= 15);
    check('stress overdue: deadlines are spread (jitter), not all in one frame', dues.size > 10);
    const ages = [];
    r._lmMassTex.forEach((e) => ages.push(now - e.at));
    check('stress overdue: every cell still updates (oldest shown value ' + Math.round(Math.max.apply(null, ages)) + ' ms old)', Math.max.apply(null, ages) < 800);

    /* mass pool over its own byte budget: cells not drawn in the last two frames go first */
    reset();
    rasterCost = 0;
    r._lmTextBudget = T * 8; /* pool budget: 4 textures */
    const pc = Array.from({ length: 10 }, () => ({}));
    r._lmTextFrameBegin();
    pc.forEach((c) => r._lmMassTexture(c, '1000', F, '#fff', '#000', 10));
    r._lmTextFrameBegin();
    r._lmTextFrameBegin();
    r._lmMassTexture(pc[0], '1000', F, '#fff', '#000', 10);
    r._lmTextFrameBegin();
    check('pool budget: trimmed back to it at once, the recently drawn cell kept', r._lmMassBytes <= T * 4 && r._lmMassTex.has(pc[0]));

    /* the WebGL text pass stops (Canvas2D renderer, WebGL off): everything is freed */
    reset();
    timers.length = 0;
    calls.length = 0;
    r._lmTextFrameBegin();
    r.getOrCreateTextTexture('nick', F, '#fff', '#000', 10);
    r._lmMassTexture(cell, '1234', F, '#fff', '#000', 10);
    r._lmTextFrameBegin();
    check('idle: a check is scheduled while text textures exist', timers.length === 1);
    later(1000);
    r._lmTextFrameBegin();
    later(1500);
    timers.shift()();
    check('idle: still in use (a pass 1.5 s ago): kept, checked again', r.glTextCache.size === 1 && r._lmMassTex.size === 1 && timers.length === 1);
    later(2500);
    timers.shift()();
    check('idle: no pass for 2 s: every text texture deleted', r.glTextCache.size === 0 && r._lmMassTex.size === 0 && r._lmTextBytes === 0 && r._lmMassBytes === 0 && calls.filter((c) => c.startsWith('del')).length === 2);
    check('idle: no more checks while nothing is held', timers.length === 0);
    r._lmTextFrameBegin();
    check('idle: textures come back when the pass runs again', !!r._lmMassTexture(cell, '1234', F, '#fff', '#000', 10));

    /* idle freeing is incremental (64 per tick) and stops when the pass comes back */
    reset();
    timers.length = 0;
    calls.length = 0;
    r._lmTextFrameBegin();
    for (let i = 0; i < 100; i++) r.getOrCreateTextTexture('t' + i, F, '#fff', '#000', 10);
    const ic = Array.from({ length: 50 }, () => ({}));
    ic.forEach((c) => r._lmMassTexture(c, '1000', F, '#fff', '#000', 10));
    r._lmTextFrameBegin();
    later(2500);
    timers.shift()();
    const dels = () => calls.filter((c) => c.startsWith('del')).length;
    check('idle: at most 64 textures deleted per tick, then the next tick is scheduled', dels() === 64 && r._lmMassTex.size === 0 && r.glTextCache.size === 86 && timers.length === 1 && r._lmTextIdleDraining);
    timers.shift()();
    timers.shift()();
    check('idle: ...until none is left; bytes back to 0', dels() === 150 && !r.glTextCache.size && r._lmTextBytes === 0 && r._lmMassBytes === 0 && timers.length === 0 && !r._lmTextIdleDraining);
    reset();
    timers.length = 0;
    calls.length = 0;
    r._lmTextFrameBegin();
    for (let i = 0; i < 150; i++) r.getOrCreateTextTexture('t' + i, F, '#fff', '#000', 10);
    r._lmTextFrameBegin();
    later(2500);
    timers.shift()();
    check('idle: freeing started', dels() === 64 && r._lmTextIdleDraining);
    const pending = timers[0];
    r._lmTextFrameBegin();
    pending();
    check('idle: the pass runs again: freeing stops, the rest is kept, a normal 2 s check follows', dels() === 64 && r.glTextCache.size === 86 && !r._lmTextIdleDraining && pending.dead && timers.length === 2);

    /* trim backoff: everything over the budget is drawn in every frame -> no scan in every frame */
    class CountMap extends Map {
        constructor() { super(); this.scans = 0; }
        forEach(f, t) { this.scans++; return super.forEach(f, t); }
        entries() { this.scans++; return super.entries(); }
    }
    reset();
    r._lmTextBudget = T * 8; /* text cache 8 textures, mass pool 4 */
    r.glTextCache = new CountMap();
    r._lmMassTex = new CountMap();
    const vc = Array.from({ length: 10 }, () => ({}));
    for (let f = 0; f < 61; f++) {
        r._lmTextFrameBegin();
        for (let i = 0; i < 12; i++) r.getOrCreateTextTexture('v' + i + 'xx', F, '#fff', '#000', 10);
        vc.forEach((c) => r._lmMassTexture(c, '1000', F, '#fff', '#000', 10));
    }
    check('backoff: over budget but all on screen: nothing evicted', r.glTextCache.size === 12 && r._lmMassTex.size === 10);
    check('backoff: text cache scanned ' + r.glTextCache.scans + 'x in 61 frames (once per 30 at most after the first)', r.glTextCache.scans <= 13 + 3);
    check('backoff: mass pool scanned ' + r._lmMassTex.scans + 'x in 61 frames', r._lmMassTex.scans <= 5);
    r.glTextCache.scans = 0;
    r._lmTextFrameBegin();
    r.getOrCreateTextTexture('new1', F, '#fff', '#000', 10);
    r._lmTextFrameBegin();
    check('backoff: a new texture (the set changed) is trimmed at once', r.glTextCache.scans >= 1);
}

skinMethods().then(() => {
    textMethods();
    console.log(failed ? failed + ' check(s) failed' : 'all text/skin canvas checks passed');
    process.exit(failed ? 1 : 0);
}, (e) => { console.error(e); process.exit(1); });
