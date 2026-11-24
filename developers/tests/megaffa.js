/* FFA PowerUp (imsolo.pro:2102) mass total: megaFFAscore of ogario/ogario.v4.js runs in a vm with a
 * fake clock and a counting localStorage. It is called on every world update: the total must not
 * be written on each of them, but at most every 5 s, on flushMegaFFAscore (socket close, connect,
 * pagehide) and at once when the reward is given. Other servers write nothing.
 * node developers/tests/megaffa.js [ogario.v4.js] */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
function block(start) {
    const i = src.indexOf(start);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '/' && src[k + 1] === '/') { k = src.indexOf('\n', k); continue; }
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
const score = block('        megaFFAscore() {'), flush = block('        flushMegaFFAscore() {');
if (!score) { console.log('FAIL megaFFAscore not found'); process.exit(1); }

let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

function boot(ws) {
    const T = { now: 1e6 };
    const data = {}, writes = [];
    const ctx = {
        console, Math, JSON, Object, Number, String, parseInt,
        Date: Object.assign(function () { return new Date(T.now); }, { now: () => T.now }),
        localStorage: {
            getItem: k => (k in data ? data[k] : null),
            setItem: (k, v) => { data[k] = String(v); writes.push(k); }
        },
        toastr: { warning() { return { css() { } }; } },
        Premadeletter123: 'Legend Mod'
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext('var LM = {\n' + score + (flush ? ',\n' + flush : '') + '\n};', ctx);
    const LM = ctx.LM;
    Object.assign(LM, { ws, connectionIntegrity: false, totalPlayerMass: 0, totalPlayerMassBigFFA: 0, playerMass: 0 });
    const close = () => { if (typeof LM.flushMegaFFAscore === 'function') LM.flushMegaFFAscore(); };
    return { ctx, T, LM, data, writes, close };
}
const bigWrites = b => b.writes.filter(k => k === 'totalPlayerMassBigFFA').length;

/* 25 updates per second for 20 s while playing */
{
    const b = boot('wss://imsolo.pro:2102/');
    b.LM.playerMass = 500;
    for (let i = 0; i < 500; i++) { b.LM.megaFFAscore(); b.T.now += 40; }
    const n = bigWrites(b);
    check('not stored on every update: ' + n + ' writes for 500 updates in 20 s (at most 5)', n >= 1 && n <= 5);
    check('the in-memory total counts every update', b.LM.totalPlayerMassBigFFA === 500 * 500);
    b.close();
    check('flush on close stores the exact total', +b.data.totalPlayerMassBigFFA === 500 * 500);
    const m = bigWrites(b);
    b.close();
    check('nothing new: a second flush writes nothing', bigWrites(b) === m);
}

/* not playing (mass 0): the total does not change, nothing to store */
{
    const b = boot('wss://imsolo.pro:2102/');
    b.LM.playerMass = 0;
    for (let i = 0; i < 300; i++) { b.LM.megaFFAscore(); b.T.now += 40; }
    check('unchanged total (spectating / dead): no writes (' + bigWrites(b) + ')', bigWrites(b) === 0);
}

/* other servers */
{
    const b = boot('wss://imsolo.pro:2101/');
    b.LM.playerMass = 500;
    for (let i = 0; i < 100; i++) b.LM.megaFFAscore();
    b.close();
    check('other servers: no total written', bigWrites(b) === 0 && b.LM.totalPlayerMassBigFFA === 0);
}

/* the reward: given once, total back to 0 and stored at once */
{
    const b = boot('wss://imsolo.pro:2102/');
    b.LM.totalPlayerMassBigFFA = 20000 * 25 * 60 * 60 - 100;
    b.LM.playerMass = 500;
    b.LM.megaFFAscore();
    check('reward: licence stored', b.ctx.proLicenceUID === 'MegaFFA' && b.data.proLicenceUID === 'MegaFFA' && !!b.data.PremiumLimitedDateStart);
    check('reward: total reset to 0 and stored at once', b.LM.totalPlayerMassBigFFA === 0 && b.data.totalPlayerMassBigFFA === '0');
    b.LM.totalPlayerMassBigFFA = 20000 * 25 * 60 * 60 + 5;
    b.LM.megaFFAscore();
    check('reward: not given twice', b.LM.totalPlayerMassBigFFA > 20000 * 25 * 60 * 60);
}

console.log(failed ? failed + ' failed' : 'all FFA PowerUp score checks passed');
process.exit(failed ? 1 : 0);
