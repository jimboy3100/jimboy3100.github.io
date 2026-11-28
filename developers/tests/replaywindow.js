/* The Replays window frame (ogario/modules/replaystudio.js): no minimise button, and the window is
 * moved by its title bar (mouse or touch), kept on screen and opened again where it was left.
 * The real window is built in a vm with the small fake document (developers/tests/lib/fakedom.js).
 * node developers/tests/replaywindow.js [replaystudio.js] */
const fs = require('fs'), path = require('path');
const i18n = require('./lib/i18n-env');
const { makeEnv } = require('./lib/fakedom');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'modules', 'replaystudio.js'), 'utf8');

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const resize = [];
const env = () => {
    const e = makeEnv({}, { toastr: { info() {}, success() {}, warning() {}, error() {} }, navigator: {}, performance: { now: () => Date.now() },
        addEventListener(t, f) { if (t === 'resize') resize.push(f); } });
    i18n(e.ctx);
    return e;
};
const e = env();
e.run(src);
e.ctx.LMReplayStudio.run('open');
const W = e.doc.getElementById('lm-rs');
/* a 600 x 300 window, bottom centre until it is moved (as the stylesheet places it) */
const SZ = { w: 600, h: 300 };
const rectIn = ctx => function () {
    const l = this.style.left ? parseFloat(this.style.left) : (ctx.innerWidth - SZ.w) / 2;
    const t = this.style.top ? parseFloat(this.style.top) : ctx.innerHeight - 30 - SZ.h;
    return { left: l, top: t, width: SZ.w, height: SZ.h, right: l + SZ.w, bottom: t + SZ.h };
};
W.getBoundingClientRect = rectIn(e.ctx);
const all = [];
(function walk(n) { (n.children || []).forEach(c => { all.push(c); walk(c); }); })(W);
const head = all.find(n => n.attrs && n.attrs.class === 'lm-rs-hd');
const title = head && head.children[0];
const buttons = all.filter(n => head && head.contains(n) && n.tagName === 'BUTTON');
const T = k => e.ctx.lmT(k);
check('header: no minimise button, the close button stays', buttons.every(b => b.textContent !== '▁') && buttons.some(b => b.textContent === '✕'));
check('no minimise text left', T('modules.replaystudio.minimize') === 'modules.replaystudio.minimize');

const fire = (t, ev) => (head._ls[t] || []).forEach(f => f(Object.assign({ pointerId: 1, button: 0, pointerType: 'mouse', preventDefault() {}, stopPropagation() {} }, ev)));
/* mouse drag on the title: the window follows the pointer */
fire('pointerdown', { target: title, clientX: 400, clientY: 400 });
fire('pointermove', { target: title, clientX: 300, clientY: 200 });
check('mouse drag by the title: moved by the pointer (left 240, top 190)', W.style.left === '240px' && W.style.top === '190px' && W.style.transform === 'none' && W.style.bottom === 'auto');
/* dragged past the edges: stays on screen */
fire('pointermove', { target: title, clientX: -500, clientY: 5000 });
check('dragged off screen: kept inside (left 0, top 420)', W.style.left === '0px' && W.style.top === '420px');
fire('pointerup', { target: title });
const saved = JSON.parse(e.ctx.localStorage.getItem('lmReplayStudioPos') || 'null');
check('place remembered on release', saved && saved.x === 0 && saved.y === 420);
fire('pointermove', { target: title, clientX: 300, clientY: 200 });
check('after release the window no longer follows', W.style.left === '0px');
/* buttons are not handles: the close button and the tabs click as before */
const closeB = buttons.find(b => b.textContent === '✕');
fire('pointerdown', { target: closeB, clientX: 10, clientY: 430 });
fire('pointermove', { target: closeB, clientX: 300, clientY: 100 });
fire('pointerup', { target: closeB });
check('pressing a header button does not move the window', W.style.left === '0px' && W.style.top === '420px');
/* touch on the tab strip scrolls it; touch on the title moves the window */
const tabs = head.children[1];
fire('pointerdown', { target: tabs, pointerType: 'touch', clientX: 200, clientY: 430 });
fire('pointermove', { target: tabs, pointerType: 'touch', clientX: 500, clientY: 100 });
check('touch on the tab strip: the window stays (the strip scrolls)', W.style.left === '0px' && W.style.top === '420px');
fire('pointerdown', { target: title, pointerType: 'touch', pointerId: 7, clientX: 20, clientY: 430 });
fire('pointermove', { target: title, pointerType: 'touch', pointerId: 7, clientX: 120, clientY: 130 });
fire('pointerup', { target: title, pointerId: 7 });
check('touch drag by the title moves it', W.style.left === '100px' && W.style.top === '120px');
/* the screen got smaller (phone turned): back on screen */
e.ctx.innerWidth = 640; e.ctx.innerHeight = 360;
resize.forEach(f => f());
check('smaller screen: the moved window is kept inside (left 40, top 60)', W.style.left === '40px' && W.style.top === '60px');

/* a new page: opened where it was left, kept on that screen */
resize.length = 0;
const e2 = env();
e2.ctx.innerWidth = 1280; e2.ctx.innerHeight = 720;
e2.ctx.localStorage.setItem('lmReplayStudioPos', JSON.stringify({ x: 900, y: 50 }));
e2.run(src);
const origCreate = e2.doc.createElement;
e2.doc.createElement = function (t) { const n = origCreate.call(this, t); n.getBoundingClientRect = rectIn(e2.ctx); return n; };
e2.ctx.LMReplayStudio.run('open');
const W2 = e2.doc.getElementById('lm-rs');
check('next page: opened where it was left, inside the screen (left 680, top 50)', W2 && W2.style.left === '680px' && W2.style.top === '50px');
const e3 = env();
e3.ctx.localStorage.setItem('lmReplayStudioPos', 'garbage');
e3.run(src);
e3.ctx.LMReplayStudio.run('open');
const W3 = e3.doc.getElementById('lm-rs');
check('nothing or a broken saved place: bottom centre as before', W3 && !W3.style.top && !W3.style.left);

console.log(fail ? fail + ' FAILED' : 'all passed');
process.exit(fail ? 1 : 0);
