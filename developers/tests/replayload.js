/* Replay files and ?replay= links: size budgets (checked before anything big is allocated),
 * malformed packets, the link check, link downloads that finish out of order or are cancelled,
 * and the source server stored with new recordings (a renamed file is still read as the
 * server it came from; older files guess it from the name).
 * Loads ogario/modules/replaystudio.js without a page and the replay type helpers of
 * ogario/ogario.v4.js. node developers/tests/replayload.js [replaystudio.js] [ogario.v4.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const studioSrc = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'modules', 'replaystudio.js'), 'utf8');
const core = fs.readFileSync(process.argv[3] || path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const attempt = f => { try { return { v: f() }; } catch (e) { return { e }; } };

/* the core's replay type helpers (the list, the guess from a name, the stored type) */
function block(start) {
    const i = core.indexOf(start);
    if (i < 0) return '';
    let d = 0;
    for (let k = core.indexOf('{', i); k < core.length; k++) {
        if (core[k] === '{') d++;
        else if (core[k] === '}' && !--d) return core.slice(i, k + 1);
    }
    return '';
}
const line = re => { const m = re.exec(core); return m ? m[0] : ''; };
const ctx = { console: { log() { }, info() { ctx.infos++; }, warn() { } }, infos: 0, Date, Math, JSON, ArrayBuffer, Uint8Array, Uint32Array, DataView, Error, isFinite,
    Number, String, Array, Object, Promise, URL, TextDecoder, AbortController, setTimeout, parseInt };
ctx.window = ctx;
vm.createContext(ctx);
const coreParts = [line(/\nvar LM_REPLAY_PROTOCOLS = [^\n]+/), line(/\nwindow\.LM_REPLAY_PROTOCOLS = [^\n]+/), line(/\nvar LM_REPLAY_HOSTS = [^;]+;/),
    block('\nfunction lmReplayGuessType('), block('\nfunction lmReplaySourceType(')];
check('core: replay type helpers found', coreParts.every(Boolean));
if (coreParts.every(Boolean)) vm.runInContext(coreParts.join('\n'), ctx);
vm.runInContext(studioSrc, ctx);
const L = ctx.LMReplayStudio.lib;
const has = (...names) => names.every(n => typeof L[n] !== 'undefined');
const LIM = L.LIMITS || {};

/* ---- 1. budgets: documented, above what a recording can reach ---- */
check('limits: exposed', has('LIMITS') && LIM.packets >= 90000 && LIM.bytes >= 100 * 1048576 && LIM.packetBytes > 0 && LIM.fileBytes >= LIM.bytes);
/* the real sample replay (a legacy file, no Studio data) still opens */
const jim = fs.readFileSync(path.join(root, 'extras', 'jim.lm'), 'utf8');
const jp = attempt(() => L.parseLmText(jim));
check('legacy: extras/jim.lm opens (1026 packets, estimated times)', jp.v && jp.v.packets.length === 1026 && jp.v.side.est === true);
/* a clip of it cut from after its last "clear all" (packet 554; a leaderboard every 27 packets, the
 * next one at 575, so the clip has none of its own): the handshake border (with the game type), the
 * newest border and the newest leaderboard from before it go along */
if (jp.v && typeof L.carryKind === 'function') {
  const pk = jp.v.packets, cps = [0], carry = [];
  pk.forEach((d, i) => { if (i && d.getUint8(0) === 18) cps.push(i); const k = L.carryKind(d); if (k) carry.push(i, k); });
  const cut = L.cutInterval(L.estTimes(pk.length), 560, 572, { checkpoints: cps, carry });
  check('legacy clip: starts at the clear all at 554 with borders 1, 26 and leaderboard 545 before it (' + cut.idx.slice(0, 4) + ')',
    same(cps, [0, 25, 554]) && same(cut.idx.slice(0, 4), [1, 26, 545, 554]) && cut.idx[cut.start] === 560 && cut.idx.length === 3 + 572 - 554 &&
    !cut.idx.slice(3).some(i => pk[i].getUint8(0) === 49));
} else check('legacy clip: carry helper present', false);

/* small budgets for the oversized fixtures: nothing big is ever built */
const withLimits = (o, f) => { const keep = Object.assign({}, LIM); Object.assign(LIM, o); try { return f(); } finally { Object.assign(LIM, keep); } };
/* counts ArrayBuffers the module allocates while f runs */
const countBuffers = f => {
    let n = 0;
    const Real = ArrayBuffer;
    ctx.ArrayBuffer = new Proxy(Real, { construct(T, a) { n++; return new Real(...a); } });
    try { return { r: attempt(f), n }; } finally { ctx.ArrayBuffer = Real; }
};
const fileOf = list => JSON.stringify(list.concat([[1700000000000, ':ffa', 'EU', 'n', '{}']]));
let r = withLimits({ fileBytes: 500 }, () => attempt(() => L.parseLmText(fileOf(['x'.repeat(600)]))));
check('budget: text over fileBytes is refused before it is parsed', !!(r.e && r.e.lmBig));
r = withLimits({ packetBytes: 100 }, () => countBuffers(() => L.parseLmText(fileOf(['ab', 'y'.repeat(101)]))));
check('budget: one giant packet is refused, no packet allocated', !!(r.r.e && r.r.e.lmBig) && r.n === 0);
r = withLimits({ bytes: 1000 }, () => countBuffers(() => L.parseLmText(fileOf(new Array(11).fill('z'.repeat(100))))));
check('budget: all packets together over bytes, refused before any is allocated', !!(r.r.e && r.r.e.lmBig) && r.n === 0);
r = withLimits({ packets: 50 }, () => attempt(() => L.parseLmText(fileOf(new Array(51).fill('a')))));
check('budget: too many packets is refused as too large', !!(r.e && r.e.lmBig));
r = withLimits({ bytes: 1000 }, () => attempt(() => L.parseLmText(fileOf(new Array(10).fill('z'.repeat(100))))));
check('budget: exactly at the budget opens', !!r.v && r.v.packets.length === 10);
const big = [new DataView(new ArrayBuffer(600)), new DataView(new ArrayBuffer(600))];
r = withLimits({ bytes: 1000 }, () => countBuffers(() => L.packPackets(big)));
check('budget: library copy over bytes is refused before its buffer is allocated', !!(r.r.e && r.r.e.lmBig) && r.n === 0);

/* ---- 2. malformed values are refused, not cut ---- */
r = attempt(() => L.parseLmText(fileOf(['\u0010Ā'])));
check('malformed: a character above one byte is refused (was cut to 0x00)', !!r.e && !r.e.lmBig);
r = attempt(() => L.parseLmText(fileOf(['\u0010', 5])));
check('malformed: a packet that is not a string is refused', !!r.e);
r = attempt(() => L.parseLmText('[1]'));
check('malformed: no packets is refused', !!r.e);
const pk2 = L.packPackets([new DataView(new Uint8Array([1, 2]).buffer), new DataView(new Uint8Array([3]).buffer)]);
const lensBad = new Uint32Array([2, 0x7fffffff]).buffer;
r = countBuffers(() => L.unpackPackets(pk2.buf, lensBad));
check('malformed: stored lengths past the bytes, refused before copying', r.r.v === null && r.n === 0);
r = withLimits({ packets: 1 }, () => attempt(() => L.unpackPackets(pk2.buf, pk2.lens)));
check('malformed: more stored packets than the budget is refused', r.v === null);
check('library: a good copy still unpacks', L.unpackPackets(pk2.buf, pk2.lens).length === 2);

/* ---- 3. link check ---- */
const page = 'https://agar.io/';
const u = s => L.replayUrl ? L.replayUrl(s, page) : undefined;
check('link: a .lm file on another site loads (CORS decides)', !!u('https://example.com/replays/match.lm') && u('https://example.com/replays/match.lm').name === 'match.lm');
check('link: jimboy3100.github.io goes to www.legendmod.ml', (u('https://jimboy3100.github.io/extras/jim.lm') || {}).url === 'https://www.legendmod.ml/extras/jim.lm');
check('link: a download address naming the file in its query', (u('https://files.example.com/get?id=7&file=final%20fight.lm') || {}).name === 'final fight.lm');
check('link: javascript:, data:, blob:, ftp: are refused', [ 'javascript:alert(1)//x.lm', 'data:text/plain,x.lm', 'blob:https://agar.io/x.lm', 'ftp://h/x.lm'].every(s => u(s) === null));
check('link: http from an https page is refused, allowed from an http page', u('http://example.com/x.lm') === null && !!(L.replayUrl && L.replayUrl('http://example.com/x.lm', 'http://localhost/play.html')));
check('link: a user name or password in it is refused', u('https://user:pw@example.com/x.lm') === null);
check('link: .lm only in the host name is refused', u('https://evil.lm.example.com/page') === null && u('https://x.lmfoo.com/a') === null);
check('link: not a .lm file is refused', u('https://example.com/x.lmx') === null && u('') === null && u(null) === null);

/* ---- 4. downloads: out of order, cancelled, live game started meanwhile ---- */
function deferred() { let res, rej; const p = new Promise((a, b) => { res = a; rej = b; }); return { p, res, rej }; }
const resp = text => ({ ok: true, status: 200, headers: { get: () => null }, text: () => Promise.resolve(text) });
function harness() {
    const h = { calls: [], done: [], failed: [] };
    h.loader = L.urlLoader ? L.urlLoader({
        fetch: (url, opt) => { const d = deferred(); h.calls.push({ url, opt, d }); return d.p; },
        limit: () => 1e6,
        done: (text, job) => h.done.push(job.name + ':' + text),
        fail: (e, job) => h.failed.push(job.name)
    }) : null;
    return h;
}
const tick = () => new Promise(res => setTimeout(res, 5));
async function downloads() {
    let h = harness();
    if (!h.loader) { check('downloads: loader exists', false); return; }
    let p1 = h.loader.load({ url: 'https://a/1.lm', name: 'one' });
    let p2 = h.loader.load({ url: 'https://a/2.lm', name: 'two' });
    await tick();
    h.calls[1].d.res(resp('B'));
    h.calls[0].d.res(resp('A'));
    await Promise.all([p1, p2]);
    check('downloads: two links, the newer finishes first: only it opens', same(h.done, ['two:B']) && !h.failed.length);
    check('downloads: the older request was aborted', h.calls[0].opt.signal && h.calls[0].opt.signal.aborted === true && !h.calls[1].opt.signal.aborted);

    h = harness();
    p1 = h.loader.load({ url: 'https://a/1.lm', name: 'one' });
    p2 = h.loader.load({ url: 'https://a/2.lm', name: 'two' });
    await tick();
    h.calls[0].d.res(resp('A'));
    await tick();
    h.calls[1].d.res(resp('B'));
    await Promise.all([p1, p2]);
    check('downloads: the older finishes first: it is dropped, the newer opens', same(h.done, ['two:B']));

    h = harness();
    p1 = h.loader.load({ url: 'https://a/1.lm', name: 'one' });
    check('downloads: pending while it runs', h.loader.pending() === true);
    h.loader.cancel();
    await tick();
    h.calls[0].d.res(resp('A'));
    await p1;
    check('downloads: closing the Studio cancels it: aborted, nothing opens, no error shown', !h.done.length && !h.failed.length && h.calls[0].opt.signal.aborted && !h.loader.pending());

    h = harness();
    p1 = h.loader.load({ url: 'https://a/1.lm', name: 'one' });
    h.loader.cancel();
    await tick();
    const ab = new Error('aborted'); ab.name = 'AbortError';
    h.calls[0].d.rej(ab);
    await p1;
    check('downloads: the aborted request rejecting is silent', !h.failed.length);

    h = harness();
    p1 = h.loader.load({ url: 'https://a/1.lm', name: 'one' });
    await tick();
    h.calls[0].d.res({ ok: false, status: 404, headers: { get: () => null } });
    await p1;
    check('downloads: a failed download is reported once', same(h.failed, ['one']) && !h.done.length);

    /* a live game started while the link downloads: when it arrives it does not leave the game */
    const l = { play: false };
    let plan = '';
    const hl = L.urlLoader({ fetch: () => Promise.resolve(resp('X')), limit: () => 1e6, done: () => { plan = L.urlPlan(l, false); }, fail() { } });
    const pl = hl.load({ url: 'https://a/x.lm', name: 'x' });
    l.play = true;
    await pl;
    check('downloads: live game joined while pending: the Studio asks instead of leaving', plan === 'ask');
    check('downloads: opened from the menu or another replay: plays at once (deep links unchanged)', L.urlPlan({ play: false }, false) === 'watch' && L.urlPlan({ play: true }, true) === 'watch' && L.urlPlan(null, false) === 'watch');

    /* streamed size guard */
    let rr = await L.readCapped({ headers: { get: k => k === 'content-length' ? '5000' : null }, body: { getReader() { throw Error('read'); } } }, 1000, () => true).then(() => 'ok', e => e);
    check('stream: Content-Length over the budget is refused before reading', rr && rr.lmBig === true);
    let reads = 0, cancelled = false;
    const chunk = new Uint8Array(1024).fill(65);
    const body = { getReader: () => ({ read: () => { reads++; return Promise.resolve(reads > 100 ? { done: true } : { done: false, value: chunk }); }, cancel: () => { cancelled = true; } }) };
    rr = await L.readCapped({ headers: { get: () => null }, body }, 3000, () => true).then(() => 'ok', e => e);
    check('stream: no length given, stopped as soon as it passes the budget', rr && rr.lmBig === true && reads === 3 && cancelled);
    const euro = Buffer.from('["éx"]', 'utf8');
    let i = 0;
    const parts = [euro.subarray(0, 3), euro.subarray(3)];
    rr = await L.readCapped({ headers: { get: () => null }, body: { getReader: () => ({ read: () => Promise.resolve(i < parts.length ? { done: false, value: new Uint8Array(parts[i++]) } : { done: true }), cancel() { } }) } }, 1000, () => true);
    check('stream: text split inside a character decodes whole', rr === '["éx"]');
    let live = true; reads = 0; cancelled = false;
    rr = await L.readCapped({ headers: { get: () => null }, body: { getReader: () => ({ read: () => { reads++; if (reads === 2) live = false; return Promise.resolve({ done: false, value: chunk }); }, cancel: () => { cancelled = true; } }) } }, 1e6, () => live).then(() => 'ok', e => e);
    check('stream: a replaced download stops reading', rr && rr.lmStale === true && cancelled && reads === 2);
    rr = await L.readCapped({ headers: { get: () => null }, text: () => Promise.resolve('x'.repeat(2000)) }, 1000, () => true).then(() => 'ok', e => e);
    check('stream: without a body stream the text is still checked', rr && rr.lmBig === true);

}
function servers() {
    /* ---- 5. source server ---- */
    const G = ctx.lmReplayGuessType, S = ctx.lmReplaySourceType, P = ctx.LM_REPLAY_PROTOCOLS || [];
    check('protocols: the servers Legend Mod reads', same(Array.from(P), ['agario', 'imsolo', 'agar2', 'garix', 'sigmally', 'senpa', 'deltio', 'expandingland', 'private']));
    /* legacy names guess as before */
    const names = { 'wss://live-arena-1abc.agar.io:443': 'agario', 'wss://eu.imsolo.pro:2102/': 'imsolo', 'wss://agar2.com:7000': 'agar2', 'wss://garix.io/s1': 'garix',
        'wss://eu.sigmally.com/ws/': 'sigmally', 'wss://senpa.io:9000': 'senpa', 'wss://eu.delt.io/ffa': 'deltio', 'wss://eu.expanding.land/ws.lm': 'expandingland',
        'wss://www.legendmod.ml:8443': 'expandingland', '1.2.3.4:443.lm': 'private', 'match.lm': 'agario' };
    check('legacy: names guess the server as before', typeof G === 'function' && Object.keys(names).every(k => G(k) === names[k]));
    const inf1 = {}, inf2 = {};
    G('match.lm', inf1); G('wss://eu.expanding.land/x', inf2);
    check('legacy: a name that shows no server is reported as unsure', inf1.unsure === true && !inf2.unsure);
    /* every server: a new recording's file, renamed, still reads as its server */
    const spec = [1700000000000, ':ffa', 'EU', 'nick', '{}'];
    const pk = [new DataView(new Uint8Array([16, 0, 1]).buffer), new DataView(new Uint8Array([18]).buffer)];
    const perServer = P.every(p => {
        const side = L.makeSidecar({ t: [0, 40], s: [], e: [], c: [], p }, 2);
        const text = L.lmFileParts(pk, spec, side).join('');
        const back = L.parseLmText(text);
        const rec = pk.slice(); rec._lmSide = back.side;
        /* the same file under a misleading name (match.lm guesses agario, the other guesses Imsolo) */
        return back.side.p === p && S('match.lm', rec) === p && S('wss://eu.imsolo.pro:2102.lm', rec) === p;
    });
    check('new files: every server survives a renamed file', P.length === 9 && perServer);
    const lib = L.sideOut ? L.sideOut(L.readSidecar({ lmrs: 1, s: [], e: [], c: [], p: 'garix' }, 2), 2) : {};
    check('new files: kept in library entries and exports (stored form)', lib.p === 'garix' && lib.lmrs === 1);
    const est = L.sideOut ? L.sideOut(L.readSidecar({ lmrs: 1, p: 'senpa' }, 2), 2) : {};
    check('new files: kept even without packet times', est.p === 'senpa' && !('t' in est));
    const liveRec = pk.slice(); liveRec._lm = { v: 1, t: [], s: [], e: [], c: [], p: 'expandingland' };
    check('recording in memory: its stored type is used', S && S('wss://10.0.0.5:8080', liveRec) === 'expandingland');
    check('recording in memory: written into its file', L.makeSidecar(liveRec._lm, 2).p === 'expandingland');
    /* metadata absent or invalid: ignored, the name decides */
    const bad = ['EXPANDINGLAND', 'constructor', '__proto__', 'toString', 5, {}, ['agario'], null, ''];
    check('metadata invalid: ignored', bad.every(p => L.readSidecar({ lmrs: 1, p }, 2).p === '' && !('p' in L.makeSidecar({ t: [0, 1], p }, 2))));
    const noMeta = pk.slice(); noMeta._lmSide = L.readSidecar({ lmrs: 1, p: 'nope' }, 2);
    check('metadata invalid: the name decides', S('wss://eu.sigmally.com/ws', noMeta) === 'sigmally' && S('match.lm', noMeta) === 'agario');
    check('metadata absent (old file): the name decides', S('wss://eu.delt.io/x.lm', pk.slice()) === 'deltio' && L.parseLmText(fileOf(['\u0010'])).side.p === '');
    /* the Studio alone (no list from the core) stores nothing it cannot check */
    const keep = ctx.LM_REPLAY_PROTOCOLS;
    ctx.LM_REPLAY_PROTOCOLS = undefined;
    check('metadata: not stored without the core list', L.readSidecar({ lmrs: 1, p: 'agario' }, 2).p === '');
    ctx.LM_REPLAY_PROTOCOLS = keep;
}
const guard = f => Promise.resolve().then(f).catch(e => { console.log('FAIL exception ' + (e && e.stack || e)); fail++; });
guard(downloads).then(() => guard(servers)).then(() => {
    console.log(fail ? fail + ' failed' : 'all replay load checks passed');
    process.exit(fail ? 1 : 0);
});
