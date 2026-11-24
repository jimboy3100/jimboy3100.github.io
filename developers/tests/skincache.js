/* Skin cache checks: the WebGL skin layer reuse (least recently drawn layer, never one drawn in
 * this or the previous frame), the CPU skin cache eviction (URL count and byte budget, only
 * entries that hold images) and the download queue cap. The helpers are taken from
 * ogario/ogario.v4.js.
 * node developers/tests/skincache.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
function grab(name) {
    const i = src.indexOf('    function ' + name + '(');
    if (i < 0) throw Error(name + ' not found');
    let d = 0, j = src.indexOf('{', i);
    for (let k = j; k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(['lmSkinLayersNew', 'lmSkinLayerPick', 'lmSkinLayerTake', 'lmSkinLayerTouch',
    'lmSkinCachePickEvict', 'lmSkinBytes', 'lmSkinByteBudget', 'lmSkinQueueTrim'].map(grab).join('\n'), ctx);
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
const C = ctx;

/* ---- GPU layers ---- */
let st = C.lmSkinLayersNew(4);
const order = [];
for (let f = 1; f <= 4; f++) {
    const l = C.lmSkinLayerPick(st, f);
    order.push(l);
    C.lmSkinLayerTake(st, l, { keys: ['s' + f] }, f);
}
check('free layers are handed out in order 0..n-1 (as before)', order.join() === '0,1,2,3' && st.next === 4);
/* frame 5: skins 1..4 were drawn in frames 1..4; layer 0 (frame 1) is the oldest */
check('full: the least recently drawn layer is reused', C.lmSkinLayerPick(st, 5) === 0);
C.lmSkinLayerTouch(st, 0, 5);
check('a layer drawn again is no longer the oldest', C.lmSkinLayerPick(st, 6) === 1);
const prev = C.lmSkinLayerTake(st, 1, { keys: ['s5'] }, 6);
check('taking a used layer returns the previous owner (only its keys are forgotten)', prev && prev.keys[0] === 's2' && st.owner[1].keys[0] === 's5');
check('pick does not change anything by itself', C.lmSkinLayerPick(st, 6) === C.lmSkinLayerPick(st, 6));

/* every layer drawn in this or the previous frame: nothing is reused */
st = C.lmSkinLayersNew(3);
for (let i = 0; i < 3; i++) C.lmSkinLayerTake(st, C.lmSkinLayerPick(st, 10), { keys: [] }, 10);
C.lmSkinLayerTouch(st, 0, 11); C.lmSkinLayerTouch(st, 1, 11);
check('layers drawn in the previous frame are kept', C.lmSkinLayerPick(st, 11) === -1);
check('...and in the current frame', C.lmSkinLayerPick(st, 11) === -1);
check('a layer last drawn two frames ago can be reused', C.lmSkinLayerPick(st, 12) === 2);
check('touch never moves a layer back in time', (C.lmSkinLayerTouch(st, 0, 3), st.used[0] === 11));
check('touch ignores -1 and a missing state', (C.lmSkinLayerTouch(st, -1, 20), C.lmSkinLayerTouch(null, 0, 20), true));

/* rotating more skins than layers: one upload per new skin, never a full reset */
st = C.lmSkinLayersNew(128);
let uploads = 0, frame = 0, resets = 0;
const where = {};
for (let round = 0; round < 3; round++) {
    for (let s = 0; s < 200; s++) {
        frame++;
        const key = 'skin' + s;
        if (where[key] === undefined) {
            const l = C.lmSkinLayerPick(st, frame);
            if (l < 0) continue;
            const old = C.lmSkinLayerTake(st, l, { keys: [key] }, frame);
            if (old) old.keys.forEach(k => { if (where[k] === l) delete where[k]; });
            where[key] = l;
            uploads++;
        } else C.lmSkinLayerTouch(st, where[key], frame);
    }
}
const layersInUse = new Set(Object.values(where));
check('200 rotating skins: 128 mapped, each to its own layer', Object.keys(where).length === 128 && layersInUse.size === 128 && resets === 0);
check('200 rotating skins: one upload per skin shown again (600), no mass re-upload', uploads === 600);
/* fewer skins than layers: nothing is ever evicted */
st = C.lmSkinLayersNew(128);
let evicted = 0;
for (let f = 1; f <= 1000; f++) {
    const l = C.lmSkinLayerPick(st, f);
    if (st.next < 100 && C.lmSkinLayerTake(st, l, { keys: ['k' + f] }, f)) evicted++;
    for (let i = 0; i < st.next; i++) C.lmSkinLayerTouch(st, i, f);
}
check('under 128 skins: no layer is ever reused', evicted === 0 && st.next === 100);

/* ---- CPU skin cache ---- */
const MB = 1048576;
const ent = (n, t0, bytes) => Array.from({ length: n }, (_, i) => ['u' + i, t0 + i, bytes]);
check('within both limits: nothing dropped', C.lmSkinCachePickEvict(ent(400, 0, MB), 100000, 400, 1024 * MB, 1000).length === 0);
let drop = C.lmSkinCachePickEvict(ent(450, 0, MB), 100000, 400, 1024 * MB, 1000);
check('over the URL limit: oldest dropped down to 90% (360 left)', drop.length === 90 && drop[0] === 'u0' && drop[89] === 'u89');
drop = C.lmSkinCachePickEvict(ent(450, 99500, MB), 100000, 400, 1024 * MB, 1000);
check('entries used in the last second (on screen) are never dropped', drop.length === 0);
drop = C.lmSkinCachePickEvict(ent(450, 98940, MB), 100000, 400, 1024 * MB, 1000);
check('...only the ones idle longer than that', drop.length === 61 && drop.every(u => +u.slice(1) <= 60));
drop = C.lmSkinCachePickEvict(ent(200, 0, 3 * MB), 100000, 400, 384 * MB, 1000);
check('over the byte budget with fewer URLs: dropped until under 90% of it', drop.length === 85 && (200 - 85) * 3 * MB <= 384 * MB * 0.9);
const mixed = [['old', 10, MB], ['new', 900, MB], ['mid', 500, MB]];
check('least recently used first, whatever the input order', C.lmSkinCachePickEvict(mixed, 100000, 2, 1e12, 1000).join() === 'old,mid');
const shared = { width: 512, height: 512 };
check('byte estimate: an object stored under two keys counts once', C.lmSkinBytes([shared, shared, { naturalWidth: 256, naturalHeight: 256 }, null]) === (512 * 512 + 256 * 256) * 4);
check('byte estimate: an image not decoded yet counts 0', C.lmSkinBytes([{ width: 0, height: 0 }]) === 0);
check('budget from deviceMemory, clamped', C.lmSkinByteBudget(4) === 384 * MB && C.lmSkinByteBudget(0.5) === 256 * MB && C.lmSkinByteBudget(32) === 768 * MB);
check('budget without deviceMemory: 384 MB', C.lmSkinByteBudget(undefined) === 384 * MB && C.lmSkinByteBudget(NaN) === 384 * MB);

/* ---- download queue ---- */
const q = [];
for (let i = 0; i < 5; i++) q.push({ id: 'p' + i, prio: true });
for (let i = 0; i < 300; i++) q.push({ id: 'n' + i, prio: false });
const dropped = C.lmSkinQueueTrim(q, 200);
check('queue cap: trimmed to the cap', q.length === 200 && dropped.length === 105);
check('queue cap: oldest normal tasks dropped first, priority kept', dropped[0].id === 'n0' && dropped[104].id === 'n104' && q.filter(t => t.prio).length === 5);
check('queue cap: newest tasks kept in order', q[q.length - 1].id === 'n299' && q[5].id === 'n105');
const all = C.lmSkinQueueTrim(q, 0);
check('server change: every waiting normal task dropped, priority ones kept', all.length === 195 && q.length === 5 && q.every(t => t.prio));
check('under the cap: nothing dropped', C.lmSkinQueueTrim([{ prio: false }], 200).length === 0);

console.log(failed ? failed + ' check(s) failed' : 'all skin cache checks passed');
process.exit(failed ? 1 : 0);
