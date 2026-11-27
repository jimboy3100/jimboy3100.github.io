#!/usr/bin/env node
// play.html's lm-sw-retire script: after the page has loaded it unregisters the old Legend Mod
// service workers that browsers keep after their file is gone (this site's sw.js at the root or in
// lib/) and deletes their two caches; other service workers and caches are left alone, and a
// browser without service workers or with blocked storage gets no error.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };

const html = fs.readFileSync(path.join(repo, 'play.html'), 'utf8');
const m = /<script id="lm-sw-retire">([\s\S]*?)<\/script>/.exec(html);
ok(m, 'play.html has no lm-sw-retire script');
const ORIGIN = 'https://www.legendmod.ml';

/* runs the real script in a fake page; returns what it did */
function page(opts) {
    const log = { unregistered: [], deleted: [], listeners: {}, timers: [] };
    const reg = (url, slot) => ({ [slot || 'active']: { scriptURL: url }, unregister() { log.unregistered.push(url); return Promise.resolve(true); } });
    const regs = (opts.regs || []).map((r) => (typeof r === 'string' ? reg(r) : reg(r.url, r.slot)));
    const nav = opts.noSw ? {} : { serviceWorker: { getRegistrations: () => Promise.resolve(regs) } };
    const w = {
        navigator: nav,
        location: { origin: opts.origin || ORIGIN },
        addEventListener(type, fn) { (log.listeners[type] = log.listeners[type] || []).push(fn); },
        setTimeout(fn, ms) { log.timers.push({ fn, ms }); }
    };
    Object.defineProperty(w, 'caches', {
        get() {
            if (opts.blockedStorage) throw new Error('SecurityError');
            return { delete(n) { log.deleted.push(n); return Promise.resolve(true); } };
        }
    });
    vm.runInNewContext(m[1], { window: w, setTimeout: w.setTimeout, Promise, Error });
    log.load = async () => {
        (log.listeners.load || []).forEach((fn) => fn());
        log.timers.forEach((t) => t.fn());
        await new Promise((r) => setImmediate(r));
        await new Promise((r) => setImmediate(r));
    };
    return log;
}

(async () => {
    if (!m) return;
    /* the old workers of this site go, everything else stays */
    const all = [ORIGIN + '/sw.js', ORIGIN + '/lib/sw.js?v=1', { url: ORIGIN + '/sw.js#x', slot: 'waiting' },
        ORIGIN + '/skins/sw.js', ORIGIN + '/lib/sw.js.bak', ORIGIN + '/lib/other-sw.js', 'https://expanding.land/sw.js'];
    let p = page({ regs: all });
    ok(p.unregistered.length === 0 && p.deleted.length === 0, 'nothing may happen before the page has loaded');
    ok(p.timers.length === 0 && (p.listeners.load || []).length === 1, 'it waits for the load event');
    await p.load();
    ok(p.timers.length === 1 && p.timers[0].ms >= 1000, 'it runs a while after load, not during start-up: ' + JSON.stringify(p.timers.map((t) => t.ms)));
    ok(JSON.stringify(p.unregistered) === JSON.stringify([ORIGIN + '/sw.js', ORIGIN + '/lib/sw.js?v=1', ORIGIN + '/sw.js#x']), 'unregistered: ' + JSON.stringify(p.unregistered));
    ok(JSON.stringify(p.deleted.sort()) === JSON.stringify(['legendmod-v1', 'lm-static-v1']), 'deleted caches: ' + JSON.stringify(p.deleted));

    /* the same page served from the old github.io address only touches that origin's workers */
    p = page({ origin: 'https://jimboy3100.github.io', regs: [ORIGIN + '/sw.js', 'https://jimboy3100.github.io/lib/sw.js'] });
    await p.load();
    ok(JSON.stringify(p.unregistered) === JSON.stringify(['https://jimboy3100.github.io/lib/sw.js']), 'other origin: ' + JSON.stringify(p.unregistered));

    /* no service workers in this browser, or storage blocked: no error, nothing done */
    let threw = null;
    try { p = page({ noSw: true }); await p.load(); } catch (e) { threw = e; }
    ok(!threw && p.unregistered.length === 0 && p.deleted.length === 0, 'no serviceWorker: ' + threw);
    threw = null;
    try { p = page({ regs: [ORIGIN + '/sw.js'], blockedStorage: true }); await p.load(); } catch (e) { threw = e; }
    ok(!threw, 'blocked storage must not throw: ' + threw);

    /* the retired worker file is gone and no live page registers a service worker again */
    ok(!fs.existsSync(path.join(repo, 'lib', 'sw.js')), 'lib/sw.js is back');
    ['play.html', 'index.html', 'LMmobile/LMmobile.js', 'LMexpress/LMexpress.js', 'ogario/ogario.v4.js'].forEach((f) => {
        const src = fs.readFileSync(path.join(repo, f), 'utf8');
        ok(!/serviceWorker\s*\.\s*register\s*\(/.test(src), f + ' registers a service worker');
    });
})().then(() => {
    console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
    process.exit(fails ? 1 : 0);
});
