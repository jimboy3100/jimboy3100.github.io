/* Dying Light effects (extras/dyinglight.js with the real LMEvents and _spawnDeathBurst of
 * ogario/ogario.v4.js): the six zombie designs (one per name, files present), the themed death
 * particle colours inside the existing count and cap, the spawn burst through
 * drawRender.startSpawnBurst, the Game Over card class, each effect suppressible on its own and
 * nothing left after the theme is turned off. node developers/tests/dlfx.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const rd = f => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
const main = rd('ogario/ogario.v4.js'), dl = rd('extras/dyinglight.js');
const cutIn = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return src.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const wait = ms => new Promise(r => setTimeout(r, ms));

/* 1. the death particles: the real _spawnDeathBurst */
function burstHarness(dlApi) {
    const c = { Math, Date, defaultmapsettings: { deathParticles: true, reducedMotion: false }, _elDeathVisual: null,
        _isExpandingLandClient: () => true, LM: {}, _lmDl: !!dlApi, _lmDlApi: dlApi || null };
    vm.createContext(c);
    vm.runInContext('var _DEATH_PARTICLE_COUNT = 10, _DEATH_PARTICLE_SPEED = 350, _DEATH_PARTICLE_DURATION = 350, _DEATH_PARTICLE_SIZE_RATIO = 0.18, _deathParticles = [];' +
        cutIn(main, 'function _spawnDeathBurst(', '\n/* ─── §3.2 defaultmapsettings'), c);
    return c;
}
let h = burstHarness(null);
vm.runInContext('_spawnDeathBurst(0, 0, 100, "#00ff00")', h);
check('particles off: the victim\'s colour, 10 particles', h._deathParticles.length === 10 && h._deathParticles.every(p => p.color === '#00ff00'));
const pal = ['#a12b30', '#6e1a1d', '#3b0d10'];
h = burstHarness({ particlePalette: () => pal });
vm.runInContext('_spawnDeathBurst(0, 0, 100, "#00ff00"); _spawnDeathBurst(0, 0, 100, "#33ff33", true)', h);
check('Dying Light on: its colours, same count; a virus keeps its colour',
    h._deathParticles.length === 20 && h._deathParticles.slice(0, 10).every(p => pal.includes(p.color)) &&
    new Set(h._deathParticles.slice(0, 10).map(p => p.color)).size === 3 && h._deathParticles.slice(10).every(p => p.color === '#33ff33'));
vm.runInContext('for (var k = 0; k < 40; k++) _spawnDeathBurst(0, 0, 100, "#00ff00")', h);
check('the cap stays 300', h._deathParticles.length === 300);
h = burstHarness({ particlePalette: () => null });
vm.runInContext('_spawnDeathBurst(0, 0, 100, "#00ff00")', h);
check('suppressed (palette null): the victim\'s colour', h._deathParticles.every(p => p.color === '#00ff00'));
h = burstHarness({ particlePalette: () => { throw new Error('x'); } });
vm.runInContext('_spawnDeathBurst(0, 0, 100, "#00ff00")', h);
check('a throwing palette: the victim\'s colour, no error', h._deathParticles.length === 10 && h._deathParticles[0].color === '#00ff00');
h = burstHarness({ particlePalette: () => pal });
h.defaultmapsettings.deathParticles = false;
vm.runInContext('_spawnDeathBurst(0, 0, 100, "#00ff00")', h);
check('Death particles setting off: none, also with Dying Light', h._deathParticles.length === 0);
h = burstHarness({ particlePalette: () => pal });
h.defaultmapsettings.reducedMotion = true;
vm.runInContext('_spawnDeathBurst(0, 0, 100, "#00ff00")', h);
check('Reduced motion: none, also with Dying Light', h._deathParticles.length === 0);
/* the two callers (eat events, removal fallback) keep a virus's colour and the colour of our own
 * cells and multibox units' cells: only the other players get the themed colours */
{
    const calls = main.split('_spawnDeathBurst(').slice(1).filter(c => /^\s*_(victim|remove)StartX/.test(c)).map(c => c.slice(0, c.indexOf(');')));
    /* the eat caller's keepColour, run: the unit lookup only while Dying Light is on */
    const keepSrc = calls[0] && calls[0].slice(calls[0].indexOf("'#808080',") + 10).replace(/\/\*[\s\S]*?\*\//g, '').trim();
    let looks = 0;
    const keep = (dlOn, v, was, unit) => new Function('_lmDl', 'victimID', 'victimRawID', '_victimWasPlayer', 'lmMbOwnUnitCell', 'return ' + keepSrc)(
        dlOn, v, 7, was, () => { looks++; return unit; });
    check('burst callers: viruses, own cells and multibox unit cells keep their colour', calls.length === 2 &&
        keep(true, { isVirus: true }, false, false) === true && keep(true, {}, true, false) === true && keep(true, { isPlayerCellMulti: true }, false, false) === true &&
        keep(true, {}, false, true) === true && keep(true, {}, false, false) === false &&
        /cell\.isVirus \|\| !!cell\.isPlayerCell \|\| !!cell\.isPlayerCellMulti/.test(calls[1]));
    looks = 0;
    check('...without Dying Light no unit lookup per burst (a virus still says so, as before)', keep(false, {}, true, true) === false &&
        keep(false, { isVirus: true }, false, true) === true && looks === 0);
}

/* 2. the theme: dyinglight.js with the real LMEvents */
async function theme() {
    const pics = [];
    class Img { set src(u) { this._src = u; pics.push(this); } get src() { return this._src; } }
    const flush = () => { while (pics.length) { const im = pics.shift(); im.naturalWidth = 64; im.onload && im.onload(); } };
    const cls = new Set(), head = { kids: [], appendChild(n) { n.parentNode = head; this.kids.push(n); return n; }, removeChild(n) { this.kids.splice(this.kids.indexOf(n), 1); n.parentNode = null; } };
    const document = { head, documentElement: { classList: { add: c => cls.add(c), remove: c => cls.delete(c) } }, createElement: t => ({ tag: t }) };
    const fx = { active: false, startTime: 0, x: 0, y: 0, color: '#00ccff', el: false };
    let T = 1000;
    const drawRender = { _spawnEffect: fx, startSpawnBurst(x, y, c) { fx.active = true; fx.startTime = ++T; fx.x = x; fx.y = y; fx.color = c; fx.el = false; } };
    /* the own cells (their own coordinates, the frame the burst is drawn in); getPlayerX() adds
     * the border's offset (mapOffsetX), so it is not the point to draw at */
    const pos = { x: 500, y: -300 }, own = [];
    const setPos = (x, y) => { pos.x = x; pos.y = y; own.length = 0; if (x || y) own.push({ x: x - 40, y: y + 10 }, { x: x + 40, y: y - 10 }); };
    setPos(500, -300);
    const ctx = { document, Image: Img, console: { warn() { } }, Promise, setTimeout, clearTimeout, Object, Map, Math, String, isFinite,
        lmT: k => k, confirm: () => true, drawRender, legendmod: { serverType: 'agario', gameMode: ':ffa', playerCells: own, mapOffsetX: -6000, mapOffsetY: 2500 },
        defaultmapsettings: { dyingLight: false, reducedMotion: false },
        application: { saveSettings() { }, getPlayerX: () => pos.x - 6000, getPlayerY: () => pos.y + 2500 }, localStorage: { removeItem() { } } };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(cutIn(main, '(function () {\n    if (window.LMEvents && window.LMEvents._lm === 1) return;', '\nwindow.spects'), ctx);
    vm.runInContext(dl, ctx);
    const L = ctx.LMDyingLight, E = ctx.LMEvents;

    check('six designs, their files exist, distinct keys', L.variants.length === 6 &&
        L.variants.map(v => v.id).join() === 'biter,viral,volatile,demolisher,screamer,nightHunter' &&
        new Set(L.variants.map(v => v.key)).size === 6 &&
        L.variants.every(v => fs.existsSync(path.join(root, v.key.replace('https://www.legendmod.ml/', '')))));
    E.emit('spawn', { time: 1 });
    check('off: no palette, no effect, no burst, no class, no spawn listener',
        L.particlePalette() === null && !L.effect('spawn') && !fx.active && !cls.has('lm-dl-go') && !E._has('spawn') && L.virusTexture() === null);

    const p = L.enable({ confirm: false });
    flush();
    check('on', (await p) === true && L.isEnabled());

    /* designs: one per name, the same for every cell and copy of it; several names use several */
    const cell = (nick, extra) => Object.assign({ size: 80, targetNick: nick }, extra || {});
    const keys = L.variants.map(v => v.key);
    const a1 = L.getFallbackSkinKey(cell('alpha')), a2 = L.getFallbackSkinKey(cell('alpha', { size: 300, id: 9 }));
    const many = new Set(); for (let i = 0; i < 60; i++) many.add(L.getFallbackSkinKey(cell('player' + i)));
    check('designs: stable per name (any size or copy), every design used, only design keys', a1 === a2 && keys.includes(a1) && many.size === 6 && [...many].every(k => keys.includes(k)));
    check('designs: still none for own / food / virus / small / nameless cells',
        [cell('me', { isPlayerCell: true }), cell('u', { isPlayerCellMulti: true }), cell('f', { isFood: true }), cell('v', { isVirus: true }), cell('s', { size: 30 }), cell('')]
            .every(c => L.getFallbackSkinKey(c) === null));
    check('designs suppressed: the one zombie for everyone', L.setEffect('variants', false) && many.size === 6 &&
        [...Array(20)].every((_, i) => L.getFallbackSkinKey(cell('player' + i)) === keys[0]));
    L.setEffect('variants', true);
    check('designs back: the same design per name as before', L.getFallbackSkinKey(cell('alpha')) === a1);

    /* particles */
    check('palette while on: three colours, frozen', Array.isArray(L.particlePalette()) && L.particlePalette().length === 3 && Object.isFrozen(L.particlePalette()));
    L.setEffect('particles', false);
    check('particles suppressed: palette null, the rest stays on', L.particlePalette() === null && L.isEnabled() && L.effect('spawn'));
    L.setEffect('particles', true);
    ctx.legendmod.gameMode = ':teams';
    check('Teams: no themed colours (the team colours tell the sides apart)', L.particlePalette() === null && L.isEnabled());
    ctx.legendmod.gameMode = ':ffa';
    check('...back in FFA: the themed colours', L.particlePalette() !== null);

    /* the infected virus picture (drawn by the renderers inside every virus) */
    const VT = 'https://www.legendmod.ml/banners/dyinglight/effects/virus-150.webp';
    check('virus picture while on: the virus effect of the manifest, the file exists', L.virusTexture() === VT && L.effect('virus') &&
        fs.existsSync(path.join(root, 'banners/dyinglight/effects/virus-150.webp')));
    L.setIntensity('competitive');
    check('  also in Competitive (a still look, like the skins and the scene)', L.virusTexture() === VT);
    L.setIntensity('immersive');
    L.setEffect('virus', false);
    check('virus picture suppressed: none, the rest stays on', L.virusTexture() === null && L.isEnabled() && L.particlePalette() !== null);
    L.setEffect('virus', true);
    check('...and back', L.virusTexture() === VT);

    /* Game Over card */
    const css = head.kids.find(n => n.id === 'lm-dl-style');
    check('Game Over card: class on, scoped style for the existing modal (no new modal)',
        cls.has('lm-dl-go') && /html\.lm-dl-go #lm-gameover-modal \.lm-go-card\{/.test(css.textContent) && !/lm-go-value/.test(css.textContent));
    L.setEffect('gameOver', false);
    check('Game Over card suppressed: class off at once', !cls.has('lm-dl-go') && cls.has('lm-dl'));
    L.setEffect('gameOver', true);
    check('...and back', cls.has('lm-dl-go'));
    check('unknown effect: refused', L.setEffect('nope', false) === false);

    /* spawn burst */
    E.emit('spawn', { time: 2 });
    check('spawn: the existing burst at the own cells centre (not getPlayerX with the border offset), theme colour', fx.active && fx.x === 500 && fx.y === -300 && fx.color === '#a12b30');
    fx.active = false;
    setPos(0, 0);
    E.emit('spawn', { time: 3 });
    check('spawn without an own cell yet: nothing yet', !fx.active);
    setPos(10, 20);
    await wait(170);
    check('...one try later', fx.active && fx.x === 10 && fx.y === 20);
    fx.active = false;
    for (const [name, set, unset] of [
        ['Expanding Land', () => { ctx.legendmod.serverType = 'expandingland'; }, () => { ctx.legendmod.serverType = 'agario'; }],
        ['Legend World', () => { ctx.legendmod.isLegendWorld = true; }, () => { ctx.legendmod.isLegendWorld = false; }],
        ['Reduced motion', () => { ctx.defaultmapsettings.reducedMotion = true; }, () => { ctx.defaultmapsettings.reducedMotion = false; }],
        ['a replay', () => { ctx._lmEvReplayOn = true; }, () => { ctx._lmEvReplayOn = false; }],
        ['the practice arena', () => { ctx.LMPractice = { on: true }; }, () => { ctx.LMPractice = null; }],
        ['spawn suppressed', () => L.setEffect('spawn', false), () => L.setEffect('spawn', true)]]) {
        set(); E.emit('spawn', { time: 4 }); unset();
        check('spawn: no burst with ' + name, !fx.active);
    }

    E.emit('spawn', { time: 4, context: 'practice' });
    check('spawn: no burst for an event of the practice arena (its context)', !fx.active);

    /* off: nothing left */
    E.emit('spawn', { time: 5 });
    const ours = fx.active;
    setPos(0, 0);
    E.emit('spawn', { time: 6 }); /* a later try pending */
    fx.active = true;
    await L.disable();
    setPos(7, 7);
    await wait(170);
    check('off: our burst ended, the pending try cancelled, no listener, no class, no palette, no design',
        ours && !fx.active && !E._has('spawn') && !cls.has('lm-dl-go') && L.particlePalette() === null && L.getFallbackSkinKey(cell('alpha')) === null &&
        L.virusTexture() === null);
    fx.active = true; fx.color = '#00ccff'; fx.startTime = 99;
    E.emit('spawn', { time: 7 });
    check('off: another burst is left alone, a spawn does nothing', fx.active && fx.color === '#00ccff' && fx.startTime === 99);

    /* on again: same designs per name, listener once */
    const q = L.enable({ confirm: false });
    flush();
    await q;
    fx.active = false; setPos(1, 1);
    let n = 0; const orig = drawRender.startSpawnBurst; drawRender.startSpawnBurst = function () { n++; return orig.apply(this, arguments); };
    E.emit('spawn', { time: 8 });
    check('on again: one burst per spawn (one listener), same design per name', n === 1 && L.getFallbackSkinKey(cell('alpha')) === a1);
    await L.disable();
    drawRender.startSpawnBurst = orig;

    /* with the multibox players' events (lmMbPlayerEvent: playerSpawned for every player of ours,
     * its connection number in source): the burst at the cells of the player that spawned */
    ctx.lmMbPlayerEvent = function () { };
    const u17 = { player: true, number: 17, cells: [], ready: true, getOwnPlayerCells() { return this.cells; }, transformReady() { return this.ready; } };
    ctx.lmMbPlayers = { getBySource: k => k === 17 ? u17 : null };
    const q2 = L.enable({ confirm: false });
    flush();
    await q2;
    check('players events: one playerSpawned listener, none on spawn', E._has('playerSpawned') && !E._has('spawn'));
    fx.active = false; setPos(500, -300);
    u17.cells.push({ x: 9000, y: 100 }, { x: 9100, y: 300 }, { x: 0, y: 0, removed: true });
    E.emit('playerSpawned', { slot: 2, source: 17, role: 'unit', life: 1 });
    check('a unit spawning while the main player lives: at the unit\'s own cells, not the main player\'s', fx.active && fx.x === 9050 && fx.y === 200 && fx.color === '#a12b30');
    fx.active = false;
    E.emit('playerSpawned', { slot: 1, source: 0, role: 'main', life: 2 });
    check('the main player spawning: at its own cells', fx.active && fx.x === 500 && fx.y === -300);
    fx.active = false;
    u17.ready = false;
    E.emit('playerSpawned', { slot: 2, source: 17, role: 'unit', life: 2 });
    check('a unit whose cells are not on this map yet: nothing yet', !fx.active);
    u17.ready = true;
    await wait(170);
    check('...one try later at its cells', fx.active && fx.x === 9050 && fx.y === 200);
    fx.active = false;
    E.emit('playerSpawned', { slot: 3, source: 23, role: 'unit', life: 1 });
    await wait(170);
    check('a player that is not in the registry: no burst (never at the main player)', !fx.active);
    E.emit('playerSpawned', { slot: 2, source: 17, role: 'unit', life: 3, context: 'practice' });
    check('a unit in the practice arena (its context): no burst', !fx.active);
    await L.disable();
    check('off: no playerSpawned listener left', !E._has('playerSpawned') && !E._has('spawn'));
    delete ctx.lmMbPlayerEvent; delete ctx.lmMbPlayers;
}

theme().catch(e => check('theme ran: ' + (e && e.stack), false)).then(() => {
    console.log(fail ? fail + ' failed' : 'all Dying Light effect checks passed');
    process.exit(fail ? 1 : 0);
});
