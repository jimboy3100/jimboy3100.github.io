/* Benchmark prototype: Legend Mod's WebGL2 cell renderer against a PixiJS 7 custom mesh on the
 * same frozen bench.js world (developers/bench/pixi-mesh-page.js does the work in the page).
 * Nothing of this is part of the game: play.html loads neither this nor PixiJS.
 *
 *   node developers/bench/pixi-mesh.js [options]
 *     --scenes a,b     bench scene names (default b500-f2000-s1,b1000-f10000-s1,b2000-f10000-s1,
 *                      b1000-f2000-s1-crowd,b1500-f2000-s1-x2.5); any name of
 *                      developers/tests/lib/bench-scene.js matrix('full') or ('default')
 *     --pixi FILE      pixi.min.js of PixiJS 7 (default: PIXI_JS, then a pixi.js package found
 *                      by require, then a sibling checkout ../deltav4/node_modules/pixi.js)
 *     --rounds N       timed block groups lm/pixi/pixi/lm per scene (default 3)
 *     --frames N       frames per block (default 60)
 *     --label NAME     output name (default: date and time)
 *     --no-images      no PNG pictures
 * Writes developers/tests/out/pixi-mesh-<label>.json, .md and pixi-mesh-<label>/<scene>-*.png
 * (the LM and Pixi pictures of bodies and food and their differences). Uses the Chrome driver of
 * bench.js (developers/tests/lib/bench-client.js); Node 22+ and Chrome. */
'use strict';
const fs = require('fs');
const path = require('path');

const repo = path.join(__dirname, '..', '..');
const outRoot = path.join(repo, 'developers', 'tests', 'out');
const DEFAULT_SCENES = 'b500-f2000-s1,b1000-f10000-s1,b2000-f10000-s1,b1000-f2000-s1-crowd,b1500-f2000-s1-x2.5';

function findPixi(arg) {
    const c = [];
    if (arg) c.push(arg);
    if (process.env.PIXI_JS) c.push(process.env.PIXI_JS);
    try { c.push(require.resolve('pixi.js/dist/pixi.min.js')); } catch (e) { }
    c.push(path.join(repo, '..', 'deltav4', 'node_modules', 'pixi.js', 'dist', 'pixi.min.js'));
    return c.find((f) => { try { return fs.statSync(f).isFile(); } catch (e) { return false; } });
}

function stamp() {
    const d = new Date(), p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}

const f2 = (x) => (x == null ? '-' : String(Math.round(x * 100) / 100));
const three = (o, f) => ['lm', 'pixi', 'raw'].map((k) => (o[k] ? f(o[k]) : '-')).join(' / ');
function md(meta, rows) {
    const L = ['# LM WebGL2 vs PixiJS custom mesh ' + meta.label, '',
        '- checkout ' + meta.head + ', Chrome ' + meta.browser + ', GPU ' + meta.gpu + ', PixiJS ' + meta.pixi + ', canvas ' + meta.canvas,
        '- machine speed check CPU ' + meta.calibrationMs + ' ms / GPU ' + meta.calibrationGpuMs + ' ms (other programs make these higher); page errors ' + meta.errors.length, '',
        'Frozen world, every frame from scratch; jelly physics (a shared CPU stage) not included.',
        '- lm: drawWebGLCellBatch (WebGL2) + drawFood (Canvas2D), the game\'s own code',
        '- pixi: pack + PIXI.Renderer.render of one body mesh and one instanced food mesh (custom Shader/Geometry)',
        '- raw: the same packer and shaders on a raw WebGL2 context (no PixiJS)',
        'CPU = submission time on the main thread; iv = frame interval (unthrottled frames); GPU = EXT_disjoint_timer_query_webgl2 (lm: WebGL bodies only, its Canvas2D food is not in it); sync = N frames + 1-pixel readback, per frame (CPU + GPU). Values lm / pixi / raw, p50 unless noted.', '',
        '| scene | bodies / jelly points / food | CPU p50 | CPU p95 | lm food (2D) | pack pixi / raw | lm + text | iv | GPU | sync | draws | GL calls | upload KB | heap B/frame | order | body px diff >64 % / alpha >128 % | food px diff >64 % / alpha >32 % |',
        '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|'];
    rows.forEach((r) => {
        const x = r.extra || {};
        if (!x.timed) { L.push('| ' + r.name + ' | ' + (x.error || 'no result') + ' |'); return; }
        const t = x.timed, c = x.calls, p = x.parity;
        L.push('| ' + [r.name, x.world.drawnBodies + ' / ' + x.world.jellyPoints + ' / ' + x.world.foodDrawn,
            three(t, (o) => f2(o.cpuMs.p50)), three(t, (o) => f2(o.cpuMs.p95)), f2(t.lm.foodMs.p50),
            f2(t.pixi.packMs.p50) + ' / ' + f2(t.raw.packMs.p50), f2(t.lmtext.cpuMs.p50),
            three(t, (o) => f2(o.frameIntervalMs.p50)), three(t, (o) => (o.gpuMs ? f2(o.gpuMs.p50) : 'n/a')), three(x.syncMsPerFrame, (o) => f2(o.p50)),
            c.lm.glDraws + ' (+' + c.lm.foodCtxFills + ' 2D fills) / ' + c.pixi.glDraws + ' / ' + c.raw.glDraws, three(c, (o) => o.glCalls),
            three(c, (o) => Math.round(o.uploadBytes / 1024)), three(t, (o) => o.heapBytesPerFrame),
            x.order.identical ? 'same' : 'DIFFERS',
            p.bodies.colourOver64Pct + ' / ' + p.bodies.alphaOver128Pct, p.food.colourOver64Pct + ' / ' + p.food.alphaOver32Pct].join(' | ') + ' |');
    });
    L.push('', 'Memory: LM jelly typed arrays vs the prototype\'s typed arrays, PixiJS heap after creating its renderer:');
    rows.forEach((r) => { const x = r.extra || {}; if (x.memory) L.push('- ' + r.name + ': LM ' + x.memory.lmJellyArraysMB + ' MB, mesh ' + x.memory.meshArraysMB + ' MB' + (x.pixiInitHeapMB ? ', PixiJS renderer heap ' + x.pixiInitHeapMB + ' MB' : '') + (x.gpuDisjoint ? ', disjoint GPU queries ' + x.gpuDisjoint : '') + (x.unsupported && x.unsupported.skins ? ', skinned cells (not in the prototype) ' + x.unsupported.skins : '')); });
    return L.join('\n') + '\n';
}

async function main(argv) {
    const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && i + 1 < argv.length ? argv[i + 1] : d; };
    const pixiFile = findPixi(opt('--pixi', ''));
    if (!pixiFile) { console.log('pixi-mesh: pixi.min.js of PixiJS 7 not found; give --pixi FILE (npm pack pixi.js@7.4.3 into a temporary folder)'); return 2; }
    const label = opt('--label', stamp());
    const images = argv.indexOf('--no-images') < 0;
    const scenes = opt('--scenes', DEFAULT_SCENES);
    const cmpOpts = { rounds: +opt('--rounds', 3), frames: +opt('--frames', 60), images };
    fs.mkdirSync(outRoot, { recursive: true });
    /* the expression bench-client evaluates after each scene: PixiJS (once), the page part, the run */
    const pixiSrc = fs.readFileSync(pixiFile, 'utf8').replace(/\/\/# sourceMappingURL=\S+\s*$/, '');
    const pageSrc = fs.readFileSync(path.join(__dirname, 'pixi-mesh-page.js'), 'utf8');
    const evalFile = path.join(outRoot, 'pixi-mesh-eval-' + label + '.js');
    fs.writeFileSync(evalFile, '(function () { if (window.PIXI && window.PIXI.Renderer) return; ' + pixiSrc + '\n;window.PIXI = PIXI; })();\n' +
        'if (!window.LMPixiBench) {\n' + pageSrc + '\n}\nLMPixiBench.compare(' + JSON.stringify(cmpOpts) + ').catch(function (e) { return { error: String(e && e.stack || e).slice(0, 500) }; })');
    const client = require('../tests/lib/bench-client.js');
    const benchLabel = 'pixi-mesh-' + label + '-run';
    const code = await client.main(['--preset', 'full', '--scenes', scenes, '--label', benchLabel, '--no-capture', '--warm', opt('--warm', '2500'), '--measure', opt('--measure', '1500'), '--eval', evalFile]);
    try { fs.unlinkSync(evalFile); } catch (e) { }
    if (code) return code;
    const runFile = path.join(outRoot, 'bench-' + benchLabel + '.json');
    const run = JSON.parse(fs.readFileSync(runFile, 'utf8'));
    const imgDir = path.join(outRoot, 'pixi-mesh-' + label);
    const rows = run.results.map((r) => {
        const x = r.extra || {};
        if (x.images) {
            fs.mkdirSync(imgDir, { recursive: true });
            Object.keys(x.images).forEach((k) => fs.writeFileSync(path.join(imgDir, r.name + '-' + k + '.png'), Buffer.from(x.images[k].split(',')[1], 'base64')));
            delete x.images;
        }
        return { name: r.name, extra: x, lmBench: { fps: r.fps, renderMs: r.renderMs, stages: r.stages, counts: r.counts } };
    });
    let head = '';
    try { head = require('child_process').execSync('git -C "' + repo + '" rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch (e) { }
    const m = run.meta;
    const meta = { label, head, browser: m.browser, gpu: m.gpu, canvas: m.canvas, pixi: (rows.find((r) => r.extra.pixi) || { extra: {} }).extra.pixi || '?', pixiFile,
        calibrationMs: m.calibrationMs, calibrationGpuMs: m.calibrationGpuMs, errors: m.errors, options: cmpOpts };
    const out = path.join(outRoot, 'pixi-mesh-' + label);
    fs.writeFileSync(out + '.json', JSON.stringify({ meta, results: rows }, null, 1));
    fs.writeFileSync(out + '.md', md(meta, rows));
    try { fs.unlinkSync(runFile); fs.unlinkSync(runFile.replace(/\.json$/, '.md')); } catch (e) { }
    console.log(md(meta, rows));
    console.log('pixi-mesh: wrote ' + out + '.json and .md' + (images ? ' (pictures in ' + imgDir + ')' : ''));
    if (m.errors.length) { console.log('page errors:'); m.errors.slice(0, 10).forEach((e) => console.log('  ' + e)); }
    return 0;
}

module.exports = { main, findPixi, md };
if (require.main === module) main(process.argv.slice(2)).then((c) => process.exit(c || 0), (e) => { console.error(e); process.exit(1); });
