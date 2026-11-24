/* Legacy animated PNG skins (vanillaSkins): the frame scheduler of ogario/ogario.v4.js
 * (animateSkincheck and its helpers, application.setVanillaSkins) runs in a vm with a fake clock
 * and fake timers. Checks: one pending timer, restart and reconnect cancel the old frames,
 * switching off stops everything, a late timer shows only the frame that is due, anualTop
 * follows the current leaderboard, duplicate nicks, replaced definitions, ordinary skins.
 * node developers/tests/animskins.js [ogario.v4.js] */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
function block(start) {
    const i = src.indexOf(start);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        /* braces in // comments (old commented-out code) do not count */
        if (src[k] === '/' && src[k + 1] === '/') { k = src.indexOf('\n', k); continue; }
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
const parts = [];
['lmAnimSkinsState', 'animateSkinsStop', 'animateSkincheck', 'lmAnimSkinsCycle', 'lmAnimSkinsTick', 'lmAnimSkinsShow', 'animateSkin'].forEach(n => {
    const b = block('\nfunction ' + n + '(');
    if (b) parts.push(b.slice(1));
});
const sv = block('        setVanillaSkins() {');
if (!sv || !parts.length) { console.log('FAIL scheduler code not found'); process.exit(1); }

let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };

function boot() {
    const T = { now: 0, seq: 0, timers: new Map(), clearWorks: true };
    const loads = [];
    const ctx = {
        console, Math, Object, Array, Number, String, JSON,
        Date: { now: () => T.now },
        setTimeout(fn, ms) { const id = ++T.seq; T.timers.set(id, { fn, at: T.now + Math.max(0, +ms || 0) }); return id; },
        clearTimeout(id) { if (T.clearWorks) T.timers.delete(id); },
        defaultmapsettings: { vanillaSkins: true },
        legendmod: { leaderboard: [] },
        animatedskins: {},
        flushes: 0
    };
    ctx.window = ctx;
    ctx.application = {
        cacheCustomSkin(nick, color, url) { loads.push({ t: T.now, nick, url }); },
        flushSkinsMap() { ctx.flushes++; }
    };
    vm.createContext(ctx);
    vm.runInContext(parts.join('\n') + '\nvar app = {\n' + sv + '\n};', ctx);
    ctx.application.setVanillaSkins = ctx.app.setVanillaSkins.bind(ctx.application);
    /* runs every timer due up to `to` in time order (a timer may add timers) */
    const advance = (to) => {
        for (;;) {
            let best = null;
            T.timers.forEach((v, id) => { if (v.at <= to && (!best || v.at < best.v.at || (v.at === best.v.at && id < best.id))) best = { id, v }; });
            if (!best) break;
            T.timers.delete(best.id);
            T.now = Math.max(T.now, best.v.at);
            best.v.fn();
        }
        T.now = to;
    };
    /* a stall: the clock moves on, the due timers then run late, all at `to` */
    const stall = (to) => {
        T.now = to;
        const due = [];
        T.timers.forEach((v, id) => { if (v.at <= to) due.push(id); });
        due.sort((a, b) => a - b).forEach(id => { const v = T.timers.get(id); if (v) { T.timers.delete(id); v.fn(); } });
    };
    return { ctx, T, loads, advance, stall };
}
const frames = (n, delay, p) => ({ color: '#ff0000', frames: Array.from({ length: n }, (_, i) => ({ id: (p || 'f') + i, delay })) });

/* one nick, 10 frames of 100 ms */
{
    const b = boot();
    b.ctx.animatedskins.Anim = frames(10, 0.1);
    b.ctx.legendmod.leaderboard = [{ nick: 'Anim' }, { nick: 'Plain' }];
    b.ctx.application.setVanillaSkins();
    check('one pending timer, not one per frame (' + b.T.timers.size + ')', b.T.timers.size === 1);
    b.advance(1000);
    check('all 10 frames shown in order in one cycle', b.loads.length === 10 && b.loads.every((l, i) => l.url === 'https://i.imgur.com/f' + i + '.png' && l.nick === 'Anim'));
    check('frame k after the sum of delays 0..k (look kept)', b.loads[0].t === 100 && b.loads[4].t === 500 && b.loads[9].t === 1000);
    b.advance(3000);
    check('the animation repeats every cycle (3 s: 30 frames)', b.loads.length === 30);
    check('anualTop is the longest animation now (1000 ms)', b.ctx.anualTop === 1000);
}

/* setVanillaSkins twice (option toggled, connect) before the cycle ends */
{
    const b = boot();
    b.ctx.animatedskins.Anim = frames(10, 0.1);
    b.ctx.legendmod.leaderboard = [{ nick: 'Anim' }];
    b.ctx.application.setVanillaSkins();
    b.advance(250);
    b.ctx.application.setVanillaSkins();
    check('duplicate init: still one pending timer (' + b.T.timers.size + ')', b.T.timers.size === 1);
    const before = b.loads.length;
    b.advance(1250);
    check('duplicate init: each frame once per cycle (' + (b.loads.length - before) + ' in the restarted cycle)', b.loads.length - before === 10);
}

/* stale callbacks: timers already queued when the scheduler restarts (clearTimeout too late) */
{
    const b = boot();
    b.T.clearWorks = false;
    b.ctx.animatedskins.Anim = frames(10, 0.1);
    b.ctx.legendmod.leaderboard = [{ nick: 'Anim' }];
    b.ctx.application.setVanillaSkins();
    b.ctx.application.setVanillaSkins();
    b.ctx.application.setVanillaSkins();
    b.advance(1000);
    check('older generations do nothing: 10 loads, not 30 (' + b.loads.length + ')', b.loads.length === 10);
}

/* switched off */
{
    const b = boot();
    b.ctx.animatedskins.Anim = frames(10, 0.1);
    b.ctx.legendmod.leaderboard = [{ nick: 'Anim' }];
    b.ctx.application.setVanillaSkins();
    b.advance(250);
    const n = b.loads.length;
    b.ctx.defaultmapsettings.vanillaSkins = false;
    b.ctx.application.setVanillaSkins();
    b.advance(10000);
    check('off: no frame loads after switching off (' + (b.loads.length - n) + ')', b.loads.length === n);
    check('off: no pending timers (' + b.T.timers.size + ')', b.T.timers.size === 0);
    check('off: the skin map is flushed (ordinary behaviour)', b.ctx.flushes === 1);
    b.T.clearWorks = false;
    b.ctx.defaultmapsettings.vanillaSkins = true;
    b.ctx.application.setVanillaSkins();
    b.advance(100);
    b.ctx.defaultmapsettings.vanillaSkins = false;
    b.ctx.application.setVanillaSkins();
    const m = b.loads.length;
    b.advance(10000);
    check('off: queued callbacks of the old run do nothing (' + (b.loads.length - m) + ')', b.loads.length === m);
}

/* server switch: another leaderboard, connect calls setVanillaSkins */
{
    const b = boot();
    b.ctx.animatedskins.A = frames(10, 0.1, 'a');
    b.ctx.animatedskins.B = frames(4, 0.25, 'b');
    b.ctx.legendmod.leaderboard = [{ nick: 'A' }];
    b.ctx.application.setVanillaSkins();
    b.advance(300);
    b.ctx.legendmod.leaderboard = [{ nick: 'B' }];
    b.ctx.application.setVanillaSkins();
    const n = b.loads.length;
    b.advance(1300);
    const after = b.loads.slice(n);
    check('server switch: no frame of the old server after the switch', after.length === 4 && after.every(l => l.nick === 'B'));
}

/* a late timer after a stall shows the frame that is due, not every missed one */
{
    const b = boot();
    b.ctx.animatedskins.Anim = frames(10, 0.1);
    b.ctx.legendmod.leaderboard = [{ nick: 'Anim' }];
    b.ctx.application.setVanillaSkins();
    b.advance(150);
    const n = b.loads.length;
    b.stall(950);
    const late = b.loads.slice(n);
    check('delayed callback: one load of the current frame (' + late.length + ')', late.length === 1 && late[0].url === 'https://i.imgur.com/f8.png');
    check('delayed callback: one pending timer afterwards', b.T.timers.size === 1);
    b.stall(7000);
    check('long stall: no catch-up burst', b.loads.length - n <= 3 && b.T.timers.size === 1);
}

/* anualTop resets with the leaderboard */
{
    const b = boot();
    b.ctx.animatedskins.Long = frames(5, 1);
    b.ctx.animatedskins.Short = frames(2, 0.5);
    b.ctx.legendmod.leaderboard = [{ nick: 'Long' }, { nick: 'Short' }];
    b.ctx.application.setVanillaSkins();
    check('anualTop: longest of this cycle (5000)', b.ctx.anualTop === 5000);
    b.ctx.legendmod.leaderboard = [{ nick: 'Short' }];
    b.advance(5000);
    check('anualTop: back to 1000 once the long one left the leaderboard (' + b.ctx.anualTop + ')', b.ctx.anualTop === 1000);
}

/* duplicate nick, replaced definition, nothing animated */
{
    const b = boot();
    b.ctx.animatedskins.Dup = frames(4, 0.25);
    b.ctx.legendmod.leaderboard = [{ nick: 'Dup' }, { nick: 'Dup' }, { nick: 'Dup' }];
    b.ctx.application.setVanillaSkins();
    b.advance(1000);
    check('duplicate nick: each frame once (' + b.loads.length + ')', b.loads.length === 4);
    b.ctx.animatedskins.Dup = frames(2, 0.5, 'n');
    b.advance(2999);
    check('replaced definition: only the new frames from the next cycle', b.loads.slice(4).every(l => /\/n\d\.png$/.test(l.url)) && b.loads.length > 4);
    const c = boot();
    c.ctx.legendmod.leaderboard = [{ nick: 'Plain' }, { nick: 'toString' }];
    c.ctx.application.setVanillaSkins();
    c.advance(10000);
    check('ordinary skins: nothing loaded, one slow check timer, no flush', c.loads.length === 0 && c.T.timers.size === 1 && c.ctx.flushes === 0);
}

console.log(failed ? failed + ' failed' : 'all animated skin checks passed');
process.exit(failed ? 1 : 0);
