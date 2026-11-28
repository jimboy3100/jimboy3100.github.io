/* Full Map on / off repeatedly: what the renderer holds on the GPU and for the debug viewports
 * must not grow from round to round. The real window.drawRender methods cut out of
 * ogario/ogario.v4.js (glbatch.js rendererFactory) run on a counting stand-in WebGL2 context:
 *   - labels: per round a Full Map scene (1500 new cell objects, 600 nicks never seen before, mass
 *     texts changing) for 60 frames, then the normal view (30 cells) for 150 frames of 100 ms;
 *     after every round the live textures, framebuffers, buffers, atlas banks and layers, the
 *     nick cache and the per-cell mass pool are counted (the mass textures of cells gone are
 *     freed 64 every 30 frames: all of them 12 s after the last round);
 *   - skins: 300 skins on screen while Full Map is on (a new set each round), 10 after: the two
 *     512 px texture arrays at most, every skin key mapped to a layer that holds it;
 *   - "Show viewports": 15 Full Map spectators per round (numbered from the highest number still
 *     there, as spect.js does, with a multibox unit staying), then none: the boxes drawn per round
 *     and the per-connection boxes and grid entries kept stay the same.
 * node developers/tests/fullmapgpu.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { rendererFactory } = require('./glbatch.js');

const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
const F = rendererFactory(src);
const defaults = new Function('return ' + F.defaults)();

/* a WebGL2 stand-in that counts what is alive: every create* adds, every delete* removes */
function countingGL() {
    const live = { texture: new Set(), framebuffer: new Set(), buffer: new Set(), vao: new Set() };
    const layers = new Map();
    let id = 0, bound = null;
    const make = (kind) => { const o = { kind, id: ++id }; live[kind].add(o); return o; };
    const drop = (kind, o) => { if (o) { live[kind].delete(o); layers.delete(o); } };
    const gl = {
        TEXTURE0: 0x84c0, TEXTURE1: 0x84c1, TEXTURE_2D: 0xde1, TEXTURE_2D_ARRAY: 0x8c1a, RGBA: 0x1908, RGBA8: 0x8058, UNSIGNED_BYTE: 0x1401,
        NO_ERROR: 0, MAX_ARRAY_TEXTURE_LAYERS: 0x88ff, MAX_TEXTURE_SIZE: 0xd33, READ_FRAMEBUFFER: 0x8ca8, READ_FRAMEBUFFER_BINDING: 0x8caa,
        COLOR_ATTACHMENT0: 0x8ce0, TRIANGLE_STRIP: 5, LESS: 0x201, LEQUAL: 0x203, DEPTH_TEST: 0xb71, ARRAY_BUFFER: 0x8892, DYNAMIC_DRAW: 0x88e8, FLOAT: 0x1406,
        TEXTURE_MIN_FILTER: 1, TEXTURE_MAG_FILTER: 2, TEXTURE_WRAP_S: 3, TEXTURE_WRAP_T: 4, LINEAR: 5, CLAMP_TO_EDGE: 6, NEAREST: 7, UNPACK_PREMULTIPLY_ALPHA_WEBGL: 8,
        live, layers,
        getError() { return 0; }, isContextLost() { return false; },
        getParameter(p) { return p === this.MAX_ARRAY_TEXTURE_LAYERS ? 2048 : p === this.MAX_TEXTURE_SIZE ? 8192 : null; },
        createTexture() { return make('texture'); }, deleteTexture(t) { drop('texture', t); },
        createFramebuffer() { return make('framebuffer'); }, deleteFramebuffer(f) { drop('framebuffer', f); },
        createBuffer() { return make('buffer'); }, deleteBuffer(b) { drop('buffer', b); },
        createVertexArray() { return make('vao'); }, deleteVertexArray(v) { drop('vao', v); },
        bindTexture(t, x) { if (t === this.TEXTURE_2D_ARRAY) bound = x; },
        texStorage3D(t, l, f, w, h, d) { if (bound) layers.set(bound, d); },
        getAttribLocation() { return 0; }, getUniformLocation() { return {}; }
    };
    for (const n of ['activeTexture', 'texParameteri', 'texImage2D', 'texSubImage2D', 'texSubImage3D', 'copyTexSubImage3D', 'pixelStorei', 'bindFramebuffer',
        'framebufferTexture2D', 'framebufferTextureLayer', 'bindVertexArray', 'bindBuffer', 'bufferData', 'bufferSubData', 'enableVertexAttribArray',
        'vertexAttribPointer', 'vertexAttribDivisor', 'useProgram', 'uniform1f', 'uniform1i', 'uniform2f', 'drawArrays', 'drawArraysInstanced',
        'enable', 'disable', 'depthFunc', 'depthMask']) gl[n] = () => { };
    return gl;
}

const realNow = Date.now;
let clock = 1e9;
Date.now = () => clock;
try {
    const LM = { cells: [], mapMinX: -7071, mapMinY: -7071, mapMaxX: 7071, mapMaxY: 7071, foodMulti: [] };
    const win = { legendmod: LM, spects: [] };
    const env = { window: win, LM, application: {}, defaultSettings: Object.assign({}, defaults.defaultSettings),
        defaultmapsettings: Object.assign({}, defaults.defaultmapsettings), ogarcopythelb: {}, ogario: {} };
    const R = new Function('return (' + F.factory + ')')()(env);
    const gl = countingGL();
    R.gl = gl;
    R.glTextProgram = {};
    R.glTextVAO = {};
    R.initWebGLTextAtlas(gl, () => ({}), gl.createBuffer());
    R._lmGlSkinArrayMake(gl);
    /* the text idle timer is not started (a real timer would keep node running); the idle free is
     * checked by renderbatch.js */
    Object.assign(R, { glTextCache: new Map(), glTextCacheMaxSize: 500, _lmTextBytes: 0, _lmMassTex: null, _lmMassBytes: 0, _lmTextFrame: 0, _lmTextIdleTimer: 1,
        _textCanvas: { width: 0, height: 0 }, scale: 1, camX: 0, camY: 0, canvasWidth: 1920, canvasHeight: 1080,
        _textCtx: { font: '', measureText: (t) => ({ width: t.length * 22 }), setTransform() { }, clearRect() { }, scale() { }, strokeText() { }, fillText() { } } });
    const FN = 'bold 40px Ubuntu', FM = 'bold 30px Ubuntu';
    const own = [];
    for (let i = 0; i < 30; i++) own.push({ id: i + 1, nick: 'own' + (i % 20), mass: 100 + i, skin: 'https://skins.test/own' + (i % 10) + '.png' });
    const skinNodes = new Map();
    const skinNode = (url) => skinNodes.get(url) || (skinNodes.set(url, { width: 0, height: 0 }), skinNodes.get(url));
    function frame(cells, dt) {
        clock += dt;
        R._glSkinFrame = (R._glSkinFrame || 0) + 1;
        R._lmTextFrameBegin();
        for (const c of cells) {
            R.getOrCreateTextTexture(c.nick, FN, '#ffffff', '#000000', 4);
            R._lmMassTexture(c, String(c.mass), FM, '#ffffff', '#000000', 3);
            const layer = R.uploadSkinTexture(c.skin, skinNode(c.skin));
            if (layer >= 0) R._lmSkinLayerUsed(layer);
            c.mass++;
        }
    }
    const count = () => {
        const a = R._lmTextAtlas;
        let skinKeys = 0, skinOk = true;
        for (const k in R.glSkinMap) {
            const l = R.glSkinMap[k];
            if (l < 0) continue;
            skinKeys++;
            const o = R._glSkinLayers.owner[l];
            if (!o || o.keys.indexOf(k) < 0) skinOk = false;
        }
        let arrLayers = 0;
        gl.layers.forEach((n) => (arrLayers += n));
        return { tex: gl.live.texture.size, fb: gl.live.framebuffer.size, buf: gl.live.buffer.size, vao: gl.live.vao.size, banks: a ? a.banks.length : 0, pages: a ? a.layers : 0,
            arrLayers, nicks: R.glTextCache.size, mass: R._lmMassTex ? R._lmMassTex.size : 0, skinArrays: (R.glSkinArray ? 1 : 0) + (R.glSkinArray2 ? 1 : 0), skinKeys, skinOk };
    };
    const show = (c) => 'textures ' + c.tex + ', framebuffers ' + c.fb + ', buffers ' + c.buf + ', banks ' + c.banks + ' (' + c.pages + ' pages), array layers ' + c.arrLayers +
        ', nicks ' + c.nicks + ', mass ' + c.mass + ', skin arrays ' + c.skinArrays + ', skin keys ' + c.skinKeys;
    const base = count();
    const on = [], off = [];
    const ROUNDS = 6;
    for (let r = 0; r < ROUNDS; r++) {
        /* Full Map on: other players everywhere, cell objects new for each round */
        const fm = own.slice();
        for (let i = 0; i < 1500; i++) fm.push({ id: 100000 * (r + 1) + i, nick: 'r' + r + 'p' + (i % 600), mass: 50 + i, skin: 'https://skins.test/r' + r + 's' + (i % 300) + '.png' });
        for (let f = 0; f < 60; f++) frame(fm, 16);
        on.push(count());
        /* Full Map off: only the cells around the player, frames 100 ms apart (15 s) */
        for (let f = 0; f < 150; f++) frame(own, 100);
        off.push(count());
    }
    console.log('     before: ' + show(base));
    for (let r = 0; r < ROUNDS; r++) console.log('     round ' + (r + 1) + ' on:  ' + show(on[r]) + '\n     round ' + (r + 1) + ' off: ' + show(off[r]));
    const same = (a, b, keys) => keys.every((k) => a[k] === b[k]);
    const GPU = ['tex', 'fb', 'buf', 'vao', 'banks', 'pages', 'arrLayers', 'skinArrays'];
    check('Full Map off: the GPU objects are the same after every round (textures, framebuffers, buffers, atlas banks and pages, skin arrays)',
        off.every((c) => same(c, off[0], GPU)), off.map(show).join(' / '));
    check('Full Map on: no more GPU objects in a later round than in the first', on.every((c) => GPU.every((k) => c[k] <= on[0][k])), on.map(show).join(' / '));
    check('Full Map off: the per-cell mass textures left over do not grow from round to round', off.every((c) => c.mass <= off[0].mass) && on.every((c) => c.mass <= on[0].mass),
        off.map((c) => c.mass).join());
    check('nick cache: back to its size (500) once Full Map is off, the same in every round', off.every((c) => c.nicks === 500) && on.every((c) => c.nicks === on[0].nicks), off.map((c) => c.nicks).join());
    check('skins: at most the two texture arrays (256 layers) in every round, every skin key on a layer that holds it',
        on.concat(off).every((c) => c.skinArrays <= 2 && c.skinOk && c.skinKeys <= 256) && off.every((c) => c.skinArrays === off[0].skinArrays));
    /* the mass textures of cells gone are freed 64 every 30 frames: all of them within 12 s at 60 fps */
    for (let f = 0; f < 750; f++) frame(own, 16);
    const drained = count();
    console.log('     12 s later: ' + show(drained));
    check('Full Map off for 12 s: only the mass textures of the cells drawn are left, the GPU objects as after every round', drained.mass === own.length && same(drained, off[0], GPU), show(drained));
    check('labels made through the atlas: no label keeps a texture of its own once Full Map is off', off.every((c) => c.tex === off[0].tex) && (() => {
        let own = 0; R.glTextCache.forEach((e) => { if (e.tex) own++; }); R._lmMassTex.forEach((e) => { if (e.tex) own++; }); return own === 0;
    })());

    /* ---- Show viewports over the rounds ---- */
    /* drawViewPorts reads the main client as the global legendmod */
    global.legendmod = LM;
    const drawn = [];
    R.drawViewport = (ctx, name) => drawn.push(name);
    R.ctx = {};
    const unit = { number: 1, player: true, playerCellIDs: [] };
    const VIEW_W = 5200, VIEW_H = 3000;
    function tile(number, k) {
        const cx = -7071 + VIEW_W / 2 + (k % 5) * (VIEW_W - 400), cy = -7071 + VIEW_H / 2 + Math.floor(k / 5) * (VIEW_H - 300);
        return { number, player: false, staticX: cx, staticY: cy, _lmTileArrived: () => true, _lmFeedOk: () => true, _lmFresh: () => true, _lmCoverageOk: () => true,
            _lmServerViewDisplay(rs) { rs[0] = cx - VIEW_W / 2; rs[1] = cy - VIEW_H / 2; rs[2] = cx + VIEW_W / 2; rs[3] = cy + VIEW_H / 2; return rs; } };
    }
    const vp = [];
    win.spects.push(unit);
    for (let r = 0; r < ROUNDS; r++) {
        /* spect.js numbers a new connection after the highest one still there */
        for (let k = 0; k < 15; k++) {
            const n = win.spects.reduce((m, s) => (s && s.number > m ? s.number : m), 0) + 1;
            win.spects.push(tile(n, k));
        }
        LM.foodMulti = [];
        for (const s of win.spects) if (!s.player) for (let i = 0; i < 20; i++) LM.foodMulti.push({ spectator: s.number, targetX: s.staticX + i, targetY: s.staticY - i });
        drawn.length = 0;
        for (let f = 0; f < 30; f++) R.drawViewPorts();
        const onBoxes = drawn.length;
        /* Full Map off: the tiles go, the unit stays */
        win.spects.splice(1);
        LM.foodMulti = [];
        drawn.length = 0;
        for (let f = 0; f < 30; f++) R.drawViewPorts();
        vp.push({ onBoxes, offBoxes: drawn.length, conn: Object.keys(R._lmConnBoxes || {}).length, grid: (R._lmViewGrid || []).length });
    }
    console.log('     viewports: ' + vp.map((v) => v.onBoxes + '/' + v.offBoxes + ' boxes, ' + v.conn + ' connection boxes, ' + v.grid + ' grid').join(' ; '));
    check('Show viewports: the same boxes are drawn in every Full Map round (map + 15 tiles a frame) and only the map once it is off',
        vp.every((v) => v.onBoxes === 30 * 16 && v.offBoxes === 30));
    check('Show viewports: the boxes and grid entries kept for the connections stay the same over the rounds', vp.every((v) => v.conn === vp[0].conn && v.grid === vp[0].grid && v.conn <= 16 && v.grid <= 15),
        vp.map((v) => v.conn + '/' + v.grid).join());
} finally {
    Date.now = realNow;
}
console.log(failed ? 'FAIL: ' + failed + ' failed' : 'all passed');
process.exit(failed ? 1 : 0);
