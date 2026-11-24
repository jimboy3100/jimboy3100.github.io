/* WebGL text texture and skin canvas checks: the text cache byte budget (lmTextTexBudget,
 * lmTextCacheEvict), the per-cell mass texture redraw rule (lmMassTexDue) and the frame-budgeted
 * skin canvas queue (lmSkinJobPick, lmSkinJobsRun), plus the methods that use them
 * (getOrCreateTextTexture, _lmMassTexture, _lmSkinJobAdd ...) run against stubs.
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
vm.runInContext(['lmTextTexBudget', 'lmTextCacheEvict', 'lmMassTexDue', 'lmSkinJobPick', 'lmSkinJobsRun'].map(grab).join('\n'), ctx);
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

/* ---- mass texture redraw rule ---- */
const e = { txt: '1234', style: 's', at: 1000 };
check('new cell: drawn', C.lmMassTexDue(null, '1', 's', 0, 99, 2, 100) === true);
check('same text and style: not drawn again', C.lmMassTexDue(e, '1234', 's', 5000, 0, 2, 100) === false);
check('new style (font/colour setting): drawn even over the budget', C.lmMassTexDue(e, '1234', 't', 1001, 99, 2, 100) === true);
check('new value under the frame budget: drawn', C.lmMassTexDue(e, '1235', 's', 1001, 1.5, 2, 100) === true);
check('new value over the frame budget: waits', C.lmMassTexDue(e, '1235', 's', 1050, 2.5, 2, 100) === false);
check('...but never longer than maxLag', C.lmMassTexDue(e, '1235', 's', 1100, 50, 2, 100) === true);

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
{
    const raf = [];
    const app = {};
    const sb = { app, raf, Map, Date, performance: { now: () => 0 }, document: { hidden: false },
        requestAnimationFrame: (f) => { raf.push(f); return raf.length; }, setTimeout: (f) => { raf.push(f); return 99; },
        lmSkinJobsRun: C.lmSkinJobsRun, lmSkinJobPick: C.lmSkinJobPick };
    vm.createContext(sb);
    vm.runInContext('Object.assign(app, {' + ['_lmSkinJobAdd', '_lmSkinJobsSchedule', '_lmSkinJobRun', '_lmSkinCanvases'].map(method).join(',\n') + '});', sb);
    const made = [];
    Object.assign(app, {
        customSkinsCache: {}, cacheQueue: [], cacheQueue2: [], cacheQueue3: [], cacheQueue4: [], cacheQueueSkinAnimated: [],
        _pendingSkinLoads: new Set(), touched: [], trims: 0,
        _lmTouchSkin(u) { this.touched.push(u); }, _lmTrimSkinCache() { this.trims++; },
        cacheSkin() { while (this.cacheQueue.length) made.push('c:' + this.cacheQueue.shift()); },
        cacheSkin2() { while (this.cacheQueue2.length) made.push('c2:' + this.cacheQueue2.shift()); },
        cacheSkin3() { while (this.cacheQueue3.length) made.push('c3:' + this.cacheQueue3.shift()); },
        cacheSkin4() { while (this.cacheQueue4.length) made.push('c4:' + this.cacheQueue4.shift()); },
        cacheSkinAnimated() { while (this.cacheQueueSkinAnimated.length) made.push('ca:' + this.cacheQueueSkinAnimated.shift()); },
    });
    const img1 = { id: 1 }, img2 = { id: 2 };
    app._pendingSkinLoads.add('u1');
    app._lmSkinJobAdd(app.customSkinsCache, 'u1', img1, undefined, true);
    app._lmSkinJobAdd(app.customSkinsCache, 'u1', img2, undefined, true);
    check('job: nothing is published or made inside the load callback', !app.customSkinsCache.u1 && made.length === 0 && app._pendingSkinLoads.has('u1'));
    check('job: one rAF scheduled, one job per URL', raf.length === 1 && app._lmSkinJobs.length === 1);
    raf.shift()();
    check('job: published from the frame, first image wins, then stamped and trimmed', app.customSkinsCache.u1 === img1 && app.touched.join() === 'u1' && app.trims === 1);
    check('job: canvases of a plain skin (512 + 64 px) and no longer pending', made.join() === 'c:u1,c2:u1' && !app._pendingSkinLoads.has('u1') && !app._lmSkinJobMap.has('u1'));
    made.length = 0;
    app._lmSkinJobAdd(app.customSkinsCache, 'u2', {}, true, false);
    app._lmSkinJobAdd(app.customSkinsCache, 'u3', {}, 'fbSkin', false);
    app._lmSkinJobAdd(app.customSkinsCache, 'u4', {}, 'animatedSkins', false);
    check('jobs added in one burst share one rAF', raf.length === 1);
    raf.shift()();
    check('2-frame sheet: both frames + thumbnail; fbSkin; animatedSkins (as before)', made.join() === 'c:u2,c2:u2,c3:u2,c4:u3,ca:u4,c2:u4');
    /* image.decode(): queued only after it settles */
    let resolve;
    const dimg = { decode: () => new Promise((r) => { resolve = r; }) };
    app._lmSkinJobAdd(app.customSkinsCache, 'u5', dimg, undefined, false);
    check('decode: not queued before decode() settles', raf.length === 0 && !app._lmSkinJobs.length);
    resolve();
    Promise.resolve().then(() => Promise.resolve()).then(() => {
        check('decode: queued after decode() resolves', raf.length === 1 && app._lmSkinJobs.length === 1);
        raf.shift()();
        app._lmSkinJobAdd(app.customSkinsCache, 'u6', { decode: () => Promise.reject(Error('bad')) }, undefined, false);
        return new Promise((r) => setImmediate(r));
    }).then(() => {
        check('decode: a rejected decode() still makes the canvases', raf.length === 1);
        raf.shift()();
        check('decode: published', !!app.customSkinsCache.u6);
        sb.document.hidden = true;
        app._lmSkinJobAdd(app.customSkinsCache, 'u7', {}, undefined, false);
        check('hidden tab: a timer instead of an animation frame', app._lmSkinJobRaf === 99);
        raf.shift()();
        check('hidden tab: still published', !!app.customSkinsCache.u7);
        textMethods();
    });
}

/* ---- getOrCreateTextTexture / _lmMassTexture with a stub GL ---- */
function textMethods() {
    let texId = 0;
    const calls = [];
    const gl = {
        TEXTURE_2D: 1, RGBA: 2, UNSIGNED_BYTE: 3, TEXTURE_MIN_FILTER: 4, TEXTURE_MAG_FILTER: 5, LINEAR: 6, TEXTURE_WRAP_S: 7, TEXTURE_WRAP_T: 8, CLAMP_TO_EDGE: 9,
        createTexture: () => ({ id: ++texId }), deleteTexture: (t) => calls.push('del' + t.id), bindTexture: () => { },
        texImage2D: () => calls.push('img'), texSubImage2D: () => calls.push('sub'), texParameteri: () => { },
    };
    const canvas = { width: 0, height: 0 };
    const tctx = { font: '', measureText: (t) => ({ width: t.length * 50 }), setTransform() { }, clearRect() { }, scale() { }, strokeText() { }, fillText() { } };
    let now = 0;
    const sb = { r: null, Map, Date, Math, parseInt, Infinity, window: { navigator: {} }, performance: { now: () => now } };
    vm.createContext(sb);
    vm.runInContext(['lmTextTexBudget', 'lmTextCacheEvict', 'lmMassTexDue'].map(grab).join('\n'), sb);
    vm.runInContext('r = {' + ['getOrCreateTextTexture', '_lmRasterText', '_lmMassTexture', '_lmTextFrameBegin'].map(method).join(',\n') + '};', sb);
    const r = sb.r;
    Object.assign(r, { gl, glTextProgram: {}, glTextCache: new Map(), glTextCacheMaxSize: 500, _lmTextBytes: 0, _textCanvas: canvas, _textCtx: tctx });

    r._lmTextFrameBegin();
    const a = r.getOrCreateTextTexture('nick', 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('text: one texture, bytes counted (w x h x 4)', a && a.w === 220 && a.h === 140 && r._lmTextBytes === 220 * 140 * 4 && calls.join() === 'img');
    check('text: a hit uploads nothing', r.getOrCreateTextTexture('nick', 'bold 100px Ubuntu', '#fff', '#000', 10) === a && calls.length === 1);
    r._lmTextBudget = 220 * 140 * 4 * 3;
    for (let f = 0; f < 6; f++) {
        r._lmTextFrameBegin();
        r.getOrCreateTextTexture('n' + f + 'xx', 'bold 100px Ubuntu', '#fff', '#000', 10);
    }
    check('text: byte budget holds (3 textures), oldest deleted, bytes match the cache', r.glTextCache.size === 3 && r._lmTextBytes === 3 * 220 * 140 * 4 && calls.includes('del1'));
    r._lmTextFrameBegin();
    for (let i = 0; i < 6; i++) r.getOrCreateTextTexture('same' + i, 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('text: textures drawn in this frame are kept over the budget (no thrash)', r.glTextCache.size >= 6);
    let sum = 0;
    r.glTextCache.forEach((v) => { sum += v.bytes; });
    check('text: byte total always equals the cache contents', sum === r._lmTextBytes);

    /* mass */
    calls.length = 0;
    const cell = {}, cell2 = {};
    r._lmTextFrameBegin();
    const m1 = r._lmMassTexture(cell, '1234', 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('mass: new cell gets its own texture', m1 && calls.join() === 'img' && m1.txt === '1234');
    const cacheSize = r.glTextCache.size;
    r._lmTextFrameBegin();
    const m2 = r._lmMassTexture(cell, '1235', 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('mass: new value of the same width rewrites the same texture (no new one)', m2 === m1 && calls.join() === 'img,sub' && m2.txt === '1235' && texId === m1.tex.id);
    r._lmMassTexture(cell, '12345', 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('mass: a wider value re-specifies the same texture', calls.join() === 'img,sub,img' && m1.w === 270);
    check('mass: the text cache is not touched by mass values', r.glTextCache.size === cacheSize);
    r._lmTextFrameBegin();
    r._lmMassSpent = 5;
    now = m1.at + 10;
    r._lmMassTexture(cell, '12346', 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('mass: over the frame budget the previous value stays', m1.txt === '12345' && calls.length === 3);
    now = m1.at + 100;
    r._lmMassTexture(cell, '12346', 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('mass: ...until it is 100 ms old', m1.txt === '12346');
    r._lmMassTexture(cell2, '99', 'bold 100px Ubuntu', '#fff', '#000', 10);
    check('mass: a new cell is drawn even over the budget', r._lmMassTex.get(cell2).txt === '99');
    calls.length = 0;
    for (let f = 0; f < 130; f++) {
        r._lmTextFrameBegin();
        r._lmMassTexture(cell2, '99', 'bold 100px Ubuntu', '#fff', '#000', 10);
    }
    check('mass: textures of cells no longer drawn are deleted, drawn ones kept', !r._lmMassTex.has(cell) && r._lmMassTex.has(cell2) && calls.join() === 'del' + m1.tex.id);

    console.log(failed ? failed + ' check(s) failed' : 'all text/skin canvas checks passed');
    process.exit(failed ? 1 : 0);
}
