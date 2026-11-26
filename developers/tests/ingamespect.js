/* In-game spectator toggle (hotkey hk-showIngameSpectator, top bar button set-ingameSpectator), with the
 * real code cut out of ogario/ogario.v4.js: application.setShowIngameSpectator / setIngameSpectator,
 * LM.addSpect (the premium gate and the "one spectator" rule), flushSpectatorsOnly,
 * _lmCloseSpectatorUnits, _lmHasSpectatorUnit, flushSpecsData and the start of sendNick (spawn).
 * Cases: toggle on/off, a multibox unit open (it blocked the spectator), spawn closes the
 * spectator with its flag (the flag alone was cleared and the next toggle did nothing), resuming
 * while alive keeps it, the multibox unit survives every spectator toggle and spawn, no premium:
 * no spectator socket.
 * node developers/tests/ingamespect.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

function block(start, from) {
    const i = src.indexOf(start, from || 0);
    if (i < 0) return null;
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return src.slice(i, k + 1);
    }
    return null;
}
const appMethods = ['        setShowIngameSpectator() {', '        setShowFullSpectator() {', '        setIngameSpectator() {'].map((m) => [m, block(m)]);
const lmMethods = ['        addSpect() {', '        flushSpectatorsOnly() {', '        _lmCloseSpectatorUnits() {', '        _lmHasSpectatorUnit() {', '        flushSpecsData() {'].map((m) => [m, block(m)]);
/* sendNick up to the first server-specific join (everything after it only builds the spawn packet) */
const nickStart = src.indexOf('        sendNick(nick) {'), nickEnd = src.indexOf('            // ===== Garix join', nickStart);
/* the helpers are new: an older file without them still runs (and shows the old failures) */
lmMethods.forEach((m) => { if (!m[1] && m[0].indexOf('_lm') >= 0) m[1] = m[0].trim() + ' }'; });
const missing = appMethods.concat(lmMethods).filter((m) => !m[1]).map((m) => m[0].trim());
if (missing.length || nickStart < 0 || nickEnd < 0) { console.log('FAIL code not found: ' + missing.concat(nickStart < 0 || nickEnd < 0 ? ['sendNick'] : []).join(', ')); process.exit(1); }
const sendNick = src.slice(nickStart, nickEnd) + '        },';

function env(o) {
    o = o || {};
    const created = [];
    const win = { spects: [], fullSpectator: false, ingameSpectator: false, proLicenceUID: o.premium === false ? null : 'test', clanTagLc: 'ZZX' };
    let nextNumber = 1;
    function Spect(opts) {
        this.number = nextNumber++;
        this.player = !!(opts && opts.player);
        this.closed = false;
        created.push(this);
    }
    Spect.prototype.closeConnection = function () { this.closed = true; };
    const ctx = {
        window: win, console,
        $: (sel) => ({ val: () => (sel === '#nick' ? 'player' : ''), show() { return this; }, hide() { return this; } }),
        addSpectator: () => win.spects.push(new Spect()),
        addFullSpectator: () => { for (let i = 0; i < 3; i++) win.spects.push(new Spect()); },
        ogario: { play: !!o.playing }
    };
    vm.createContext(ctx);
    vm.runInContext('var LM = window.legendmod = {' + lmMethods.map((m) => m[1]).join(',\n') + ',\n' + sendNick + '\n};' +
        'var application = window.application = {' + appMethods.map((m) => m[1]).join(',\n') + '};', ctx);
    /* the global spects of the page is window.spects (top-level var in a classic script) */
    Object.defineProperty(ctx, 'spects', { get: () => win.spects, set: (v) => { win.spects = v; } });
    ctx.addUnit = () => { const u = new Spect({ player: true }); win.spects.push(u); return u; };
    return { ctx, win, created, app: ctx.application, LM: ctx.LM };
}
const spectators = (win) => win.spects.filter((s) => !s.player);

/* 1. plain toggle: on opens one spectator socket, off closes it */
{
    const e = env();
    e.app.setShowIngameSpectator();
    check('toggle on: one in-game spectator socket', e.win.ingameSpectator === true && spectators(e.win).length === 1);
    const sp = spectators(e.win)[0];
    e.app.setShowIngameSpectator();
    check('toggle off: spectator closed and removed', e.win.ingameSpectator === false && sp.closed && e.win.spects.length === 0);
    e.app.setShowIngameSpectator();
    check('toggle on again: a new spectator', spectators(e.win).length === 1 && e.created.length === 2);
}
/* 2. a multibox unit is open: the spectator must still start, and toggling it off keeps the unit */
{
    const e = env();
    const unit = e.ctx.addUnit();
    e.app.setShowIngameSpectator();
    check('multibox unit open: in-game spectator still starts', spectators(e.win).length === 1, e.win.spects.length);
    e.app.setShowIngameSpectator();
    check('toggle off with a unit: unit kept open, spectator closed', e.win.spects.length === 1 && e.win.spects[0] === unit && !unit.closed);
    e.app.setIngameSpectator();
    check('top bar button: spectator starts beside the unit', spectators(e.win).length === 1 && e.win.spects.includes(unit));
}
/* 3. spawning (Play) ends the spectator: socket closed with the flag, the next toggle starts it again */
for (const withUnit of [false, true]) {
    const e = env();
    const unit = withUnit ? e.ctx.addUnit() : null;
    e.app.setShowIngameSpectator();
    const sp = spectators(e.win)[0];
    e.LM.sendNick('me');
    check('spawn: flag cleared', e.win.ingameSpectator === false);
    const tag = withUnit ? ' (multibox unit open)' : '';
    check('spawn: spectator socket closed (no hidden socket left open)' + tag, !!sp && sp.closed && spectators(e.win).length === 0);
    if (unit) check('spawn: multibox unit kept', e.win.spects.length === 1 && e.win.spects[0] === unit && !unit.closed);
    e.app.setShowIngameSpectator();
    check('first toggle after spawn starts the spectator' + tag, e.win.ingameSpectator === true && spectators(e.win).length === 1 && !spectators(e.win)[0].closed);
}
/* 4. Play while alive only resumes the game: the spectator and its flag stay */
{
    const e = env({ playing: true });
    e.app.setShowIngameSpectator();
    const sp = spectators(e.win)[0];
    e.LM.sendNick('me');
    check('resume while alive keeps the spectator and its flag', e.win.ingameSpectator === true && !sp.closed && spectators(e.win).length === 1);
}
/* 5. the full spectator is closed by spawn as well, and the in-game one does not stack on it */
{
    const e = env();
    e.app.setShowFullSpectator();
    check('full spectator opens its sockets', e.win.fullSpectator === true && spectators(e.win).length === 3);
    e.app.setShowIngameSpectator();
    check('in-game spectator not added while the full spectator runs', spectators(e.win).length === 3);
    e.LM.sendNick('me');
    check('spawn closes the full spectator sockets and flag', e.win.fullSpectator === false && e.win.spects.length === 0 && e.created.every((s) => s.closed));
}
/* 6. the premium gate is kept: without it no socket is opened */
{
    const e = env({ premium: false });
    e.app.setShowIngameSpectator();
    check('no premium: no spectator socket', e.win.spects.length === 0);
}

console.log(failed ? 'FAILED ' + failed : 'all ingamespect checks passed');
process.exit(failed ? 1 : 0);
