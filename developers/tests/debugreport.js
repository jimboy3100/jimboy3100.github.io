/* "Copy debug info": one report for a bug report, with the real lmDebugReport / lmCopyDebugInfo of
 * ogario/ogario.v4.js. Settings > Copy debug info and the Copy button of the Performance diagnostics
 * window (ogario/modules/perf.js) give the same text: the general part, then LMPerf.report(), with
 * private data taken out (LMSmallTools.redactReport) from both parts.
 * node developers/tests/debugreport.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const src = cut('/* "Copy debug info" (Settings): the one report', '\n/*\n * ═');

function page(opts) {
    opts = opts || {};
    const toasts = [], logs = [];
    const ctx = {
        OgVer: '9.999', LMVersion: '2', location: { hostname: 'www.legendmod.ml' }, navigator: { userAgent: 'UA/1' }, innerWidth: 915, innerHeight: 412, devicePixelRatio: 2,
        legendmod: { ws: 'wss://el.example/el-room/SECRET123?t=tok', serverType: 'expandingland' },
        _lmRecentErrors: ['12:00:00 boom'],
        document: {
            querySelector: (s) => ({ '#region': { value: 'EU' }, '#gamemode': { value: ':ffa' } })[s] || null,
            createElement: () => ({ style: {}, select() { } }), body: { appendChild() { }, removeChild() { } }, execCommand: () => !!opts.execOk
        },
        console: { log: (t) => logs.push(t) },
        toastr: { success: (t) => toasts.push(['success', t]), warning: (t) => toasts.push(['warning', t]) },
        lmT: (k) => k
    };
    if (opts.perf !== false) ctx.LMPerf = { report: () => 'Legend Mod 9.999 performance report\nFPS: 60 nick SECRETNICK' };
    if (opts.redact !== false) ctx.LMSmallTools = { redactReport: (t) => t.replace(/SECRET[A-Z0-9]*/g, '[hidden]') };
    if (opts.clip) ctx.navigator.clipboard = { writeText: (t) => { ctx._clip = t; return opts.clip === 'refuse' ? Promise.reject(new Error('no')) : Promise.resolve(); } };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return { ctx, toasts, logs };
}
(async () => {
    let p = page();
    let t = p.ctx.lmDebugReport();
    check('general part: build, page, screen, server, errors', /^Legend Mod build 9\.999, loader 2\n/.test(t) && t.indexOf('Screen: 915x412 @2') >= 0 &&
        t.indexOf('region EU, mode :ffa') >= 0 && t.indexOf('Last errors (1):\n  12:00:00 boom') >= 0);
    check('then the performance report', t.indexOf('\n\nLegend Mod 9.999 performance report\nFPS: 60') > t.indexOf('Last errors'));
    check('private data out of both parts', t.indexOf('SECRET') < 0 && t.indexOf('/el-room/[hidden]') >= 0 && t.indexOf('nick [hidden]') >= 0);
    t = page({ perf: false }).ctx.lmDebugReport();
    check('without the performance module: the general part alone', t.indexOf('performance report') < 0 && /Last errors \(1\):\n  12:00:00 boom$/.test(t));

    p = page({ clip: 'ok' });
    p.ctx.lmCopyDebugInfo();
    await new Promise((r) => setTimeout(r, 0));
    check('copy: the clipboard gets the report, success toast', p.ctx._clip === p.ctx.lmDebugReport() && p.toasts.length === 1 && p.toasts[0][0] === 'success' && p.toasts[0][1] === 'game1.set.debugCopied');
    p = page({ clip: 'refuse', execOk: true });
    p.ctx.lmCopyDebugInfo();
    await new Promise((r) => setTimeout(r, 0));
    check('copy: a refused clipboard falls back to a hidden text box', p.toasts.length === 1 && p.toasts[0][0] === 'success');
    p = page({ execOk: false });
    p.ctx.lmCopyDebugInfo();
    check('copy: nothing works -> warning and the text in the console', p.toasts.length === 1 && p.toasts[0][0] === 'warning' && p.logs.length === 1 && p.logs[0].indexOf('Legend Mod build') === 0);

    check('Settings link and the Performance window use it', /"#lm-copy-debug", function \(ev\) \{\n[^}]*lmCopyDebugInfo\(\);/.test(main) &&
        /btn\('lm-perf-copy', '', function \(\) \{ if \(typeof window\.lmCopyDebugInfo === 'function'\) window\.lmCopyDebugInfo\(\); \}\)/.test(fs.readFileSync(path.join(root, 'ogario', 'modules', 'perf.js'), 'utf8')));
    console.log(fail ? fail + ' FAILED' : 'all debug report checks passed');
    process.exit(fail ? 1 : 0);
})();
