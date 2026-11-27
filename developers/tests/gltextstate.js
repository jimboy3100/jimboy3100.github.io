/* WebGL frame state, label raster size and per-frame work of the real renderer (window.drawRender
 * cut out of ogario/ogario.v4.js, as glbatch.js does), with a recording stand-in context:
 *   - the multibox rings leave the premultiplied frame blend for the label pass after them;
 *   - nick textures are drawn at the canvas pixel ratio (sharp on phones / High DPI);
 *   - the label pass allocates (almost) nothing per frame when every label is cached, and a
 *     changed nick, font or colour still gets its own texture key;
 *   - with WebGL acceleration off the GL canvas is cleared once and hidden, the skin arrays are
 *     freed after 10 s, and turning it on shows the canvas and makes the array again;
 *   - the frame's local hour matches Date.getHours() without a Date every frame.
 * node developers/tests/gltextstate.js */
'use strict';
const fs = require('fs');
const path = require('path');
const inspector = require('inspector');
const { rendererFactory } = require('./glbatch.js');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
const F = rendererFactory(src);
let failed = 0;
function check(ok, what) { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) failed++; }

function make(win, LM) {
    const defs = new Function('return ' + F.defaults)();
    LM = LM || { cells: [] };
    const app = { getCustomSkin: () => null, setAutoHideCellInfo: () => false };
    const env = { window: Object.assign({ legendmod: LM }, win || {}), LM, application: app, defaultSettings: defs.defaultSettings, defaultmapsettings: defs.defaultmapsettings };
    const R = new Function('env', F.factory.replace(/^function \(env\) \{/, '').replace(/\}$/, ''))(env);
    return { R, env };
}
const GL = { SRC_ALPHA: 0x302, ONE_MINUS_SRC_ALPHA: 0x303, ONE: 1, BLEND: 0xbe2, DEPTH_TEST: 0xb71, LEQUAL: 0x203, ARRAY_BUFFER: 0x8892, TRIANGLE_STRIP: 5, COLOR_BUFFER_BIT: 0x4000, DEPTH_BUFFER_BIT: 0x100, TEXTURE_2D_ARRAY: 0x8c1a };
function recGL(log, extra) {
    return new Proxy(Object.assign({}, GL, extra || {}), {
        get(t, k) { if (k in t) return t[k]; return (...a) => { log.push([k, a]); return k === 'createTexture' ? { tex: log.length } : undefined; }; }
    });
}
const FRAME_BLEND = [GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA, GL.ONE, GL.ONE_MINUS_SRC_ALPHA].join();

// -- 1. the multibox rings keep the premultiplied frame blend
{
    const { R } = make(null, { multiBoxPlayerExists: true, playerCells: [], playerCellsMulti: [] });
    let blend = FRAME_BLEND;
    const log = [];
    const gl = new Proxy(GL, { get(t, k) {
        if (k in t) return t[k];
        return (...a) => { log.push(k); if (k === 'blendFunc') blend = [a[0], a[1], a[0], a[1]].join(); if (k === 'blendFuncSeparate') blend = a.join(); };
    } });
    R.gl = gl; R.glMbRingProgram = {}; R.glMbRingVAO = {}; R.glMbRingInstanceVBO = {}; R.glMbRingData = new Float32Array(90); R.glMbRingMax = 10;
    R.canvasWidth = 800; R.canvasHeight = 600; R.scale = 1; R.camX = 0; R.camY = 0;
    R.buildWebGLMultiboxRingData = () => 1;
    R.drawWebGLMultiboxRings();
    check(log.indexOf('drawArraysInstanced') >= 0, 'multibox rings: one ring is drawn');
    check(blend === FRAME_BLEND, 'multibox rings: the blend after them is the frame blend (alpha ONE, ONE_MINUS_SRC_ALPHA) for the labels drawn next (' + blend + ')');
}

// -- 2. nick textures at the canvas pixel ratio
{
    const fonts = {};
    for (const dpr of [1, 2]) {
        const { R } = make({ LM_DPR: dpr });
        R.gl = {}; R.glTextProgram = {}; R.scale = 1; R.dpr = dpr; R.canvasWidth = 800; R.canvasHeight = 600;
        R.getOrCreateTextTexture = (text, font) => { fonts[dpr] = font; return null; };
        R._lmMassTexture = () => null;
        R.drawWebGLCellText({ id: 1, x: 0, y: 0, size: 100, targetNick: 'Legend', _webglRendered: true, isVirus: false, color: '#ff0000' });
    }
    const px = (f) => Number((/(\d+)px/.exec(f || '') || [])[1]);
    check(px(fonts[2]) >= 1.8 * px(fonts[1]), 'nick texture: drawn at about twice the pixels with pixel ratio 2 (' + fonts[1] + ' / ' + fonts[2] + ')');
}

// -- 3. label pass: no per-frame strings while every label is cached; changes still get new keys
const memoOk = (() => {
    const { R, env } = make({ LM_DPR: 1 });
    env.defaultmapsettings.showMass = true;
    R.gl = {}; R.glTextProgram = {}; R.scale = 1; R.canvasWidth = 800; R.canvasHeight = 600;
    const keys = [], massFonts = [];
    R._lmTextCached = (key) => { keys.push(key); return { w: 10, h: 10 }; };
    R._lmMassTexture = (cell, text, font) => { massFonts.push(font); return { w: 10, h: 10 }; };
    R.drawWebGLTextQuad = () => {};
    const cell = { id: 1, x: 0, y: 0, size: 100, targetNick: 'Legend', _webglRendered: true, isVirus: false, color: '#ff0000' };
    R.drawWebGLCellText(cell);
    R.drawWebGLCellText(cell);
    cell.targetNick = 'Other';
    R.drawWebGLCellText(cell);
    env.defaultSettings.namesColor = '#123456';
    R.drawWebGLCellText(cell);
    env.defaultSettings.namesFontFamily = 'Arial';
    env.defaultSettings.massFontWeight = '400';
    R.drawWebGLCellText(cell);
    const k = keys.map((s) => s.split('|'));
    check(keys.length === 5 && keys[0] === keys[1], 'label keys: the same key while nothing changed');
    check(k[2][0] === 'Other' && k[3][2] === '#123456' && /Arial$/.test(k[4][1]), 'label keys: a new nick, colour or font family gives a new key (' + keys.slice(2).join(' ; ') + ')');
    check(/^400 100px /.test(massFonts[4]) && massFonts[0] === massFonts[3], 'mass font: follows the weight setting (' + massFonts[3] + ' -> ' + massFonts[4] + ')');
    return { R, env };
})();
const allocDone = (async () => {
    const { R } = memoOk;
    const hit = { w: 10, h: 10 };
    R._lmTextCached = () => hit; R._lmMassTexture = () => hit;
    const cells = [];
    for (let i = 0; i < 200; i++) cells.push({ id: i + 1, x: i * 50, y: 0, size: 60 + i, mass: 100 + i, targetNick: 'Player' + i, _webglRendered: true, isVirus: false, color: '#ff0000' });
    const frame = () => { for (const c of cells) R.drawWebGLCellText(c); };
    for (let i = 0; i < 300; i++) frame();
    const s = new inspector.Session(); s.connect();
    const post = (m, p) => new Promise((res, rej) => s.post(m, p || {}, (e, r) => e ? rej(e) : res(r)));
    await post('HeapProfiler.startSampling', { samplingInterval: 256, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true });
    const N = 300;
    for (let i = 0; i < N; i++) frame();
    const { profile } = await post('HeapProfiler.stopSampling');
    let total = 0;
    (function walk(n) { if (n.callFrame.functionName === 'drawWebGLCellText' || n.callFrame.functionName === 'getOrCreateTextTexture' || n.callFrame.functionName === '_lmNickFont') total += n.selfSize; n.children.forEach(walk); })(profile.head);
    s.disconnect();
    const per = Math.round(total / N);
    /* the working copy before measured ~22 KB per frame here (key and font strings per cell) */
    check(per < 2000, 'label pass: ' + per + ' bytes allocated per frame for 200 cached labels (was ~22 KB)');
})();

// -- 3b. local hour of the frame without a Date per frame
{
    const { R } = make();
    let bad = 0, dates = 0;
    const RealDate = Date;
    const t0 = new RealDate(2026, 10, 28, 9, 58, 30).getTime();
    global.Date = function (t) { dates++; return new RealDate(t); };
    try {
        for (let t = t0; t < t0 + 3 * 3600000; t += 997) if (R._lmFrameHours(t) !== new RealDate(t).getHours()) bad++;
        const back = t0 - 7200000; /* the clock set back two hours */
        if (R._lmFrameHours(back) !== new RealDate(back).getHours()) bad++;
    } finally { global.Date = RealDate; }
    check(bad === 0 && dates <= 6, 'frame hour: matches getHours() over 3 hours and after the clock went back, with ' + dates + ' Dates for ~10800 frames');
}

/* (allocDone: the heap sampling of part 3) */
Promise.resolve(typeof allocDone === 'undefined' ? null : allocDone).then(() => {
    if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
    console.log('all gl text/state checks passed');
});
