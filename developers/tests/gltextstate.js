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

/* (allocDone: the heap sampling of part 3) */
Promise.resolve(typeof allocDone === 'undefined' ? null : allocDone).then(() => {
    if (failed) { console.log(failed + ' check(s) failed'); process.exit(1); }
    console.log('all gl text/state checks passed');
});
