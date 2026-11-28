/* Frame time on the stats line: it replaces the FPS (e.g. 16.7 ms), shown by the stats switch
 * showStatsFPS; the old option "Frame time in the FPS counter" (showStatsFrameTime) is gone and
 * a saved value of it is ignored; the Lab's key lmLab is left as it is. Uses the
 * real code of ogario/ogario.v4.js.
 * node developers/tests/frametime.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* the shipped gameplay defaults */
const defs = vm.runInNewContext('(function(){' + cut('var defaultmapsettings = {', '\nvar ') + '; return defaultmapsettings; })()', { window: {}, navigator: { userAgent: '' } });
check('the stats item is on by default', defs.showStatsFPS === true);
check('the old frame time option is gone', !('showStatsFrameTime' in defs) && main.indexOf('showStatsFrameTime') < 0);

function makeStorage() {
    const m = new Map();
    return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, _map: m };
}
function load(stored, lab) {
    const ls = makeStorage();
    if (stored) ls.setItem('ogarioSettings', JSON.stringify(stored));
    if (lab !== undefined) ls.setItem('lmLab', JSON.stringify(lab));
    const ms = Object.assign({}, defs);
    const ctx = {
        window: { localStorage: ls }, JSON, Object,
        defaultmapsettings: ms, defaultSettings: {}, ogario: {},
        readLocalStorageJSON: (k, d) => { try { const v = ls.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
        lmSettingValue: (k, v) => (typeof v === typeof defs[k] ? v : undefined),
        lmFoldVideoVolume: () => false, lmFoldLegacySettings: () => false, lmHudAdoptOld: () => false, lmEndPerfMode: () => false, lmSettingsUserView: () => ms, lmSettingsCommit: () => { }, _lmSettingsSeen: null
    };
    vm.createContext(ctx);
    const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
    app.loadSettings();
    return { ms, ls };
}
let r = load({ showStatsFrameTime: true, showStatsFPS: false }, { v: 1, on: { frameTime: true } });
check('old saved frame time value ignored, other values load', !('showStatsFrameTime' in r.ms) && r.ms.showStatsFPS === false);
check('the Lab key is left as it is (the Lab is back)', r.ls.getItem('lmLab') === JSON.stringify({ v: 1, on: { frameTime: true } }));

/* the stats line text where the FPS was (the real line) */
const line = cut("                    t += drawRender.fps > 0", '                    var activeSpect');
const stats = fps => vm.runInNewContext('var t = ""; ' + line + '; t', { drawRender: { fps } });
check('60 frames a second: 16.7 ms', stats(60) === '16.7 ms');
check('144 frames a second: 6.9 ms', stats(144) === '6.9 ms');
check('30 frames a second: 33.3 ms', stats(30) === '33.3 ms');
check('before the first second is counted: -- ms', stats(0) === '-- ms');
check('no FPS text left on the stats line', !/t \+= 'FPS: '/.test(main));

/* the removed ping jitter option: the ping after the FPS is the plain value, an old saved
 * showStatsJitter is ignored, and the pong handler keeps no ping history any more */
const pingLine = cut('                    var activeSpect', '                    /* [MB slot/players]');
const ping = (ms, p, ws) => vm.runInNewContext('var t = "FPS: 60"; ' + pingLine + '; t', { defaultmapsettings: ms, drawRender: { ping: p, _lmPingHist: [10, 90, 10, 90] }, window: {}, getActiveSpect: () => null, LM: { ws: ws || 'wss://live-arena-1.agar.io:443' } });
check('stats line: PING after the FPS, no +/- even with an old saved showStatsJitter', ping({ showStatsJitter: true }, 45) === 'FPS: 60 | PING: 45');
check('stats line: no PING before the first pong', ping({}, 0) === 'FPS: 60');
check('ping jitter: no default and no Settings > Stats switch', !('showStatsJitter' in defs) && !/showStatsJitter/.test(main));
r = load({ showStatsJitter: true, showMass: true });
check('ping jitter: an old saved value loads quietly and is not kept', !('showStatsJitter' in r.ms) && r.ms.showMass === true);
const pong = cut("                case 31:\n                    /* a replay's recorded pong", '                    break;');
const dr = {};
vm.runInNewContext(pong.replace('case 31:', ''), { window: { agarpingstarted: Date.now() - 40 }, drawRender: dr, Date, LM: { ws: 'wss://live-arena-1.agar.io:443' } });
check('pong: sets the ping, keeps no history', dr.ping >= 40 && dr.ping < 1000 && !('_lmPingHist' in dr));
/* replay playback (the replay socket, Replay Studio): the recorded pongs answer pings sent long
 * before (the stats line read PING: 31349), so it shows no ping, and a recorded pong leaves the
 * live ping as it was */
check('replay playing: no PING on the stats line', ping({}, 31349, 'wss://imsolo.pro.replay:2000') === 'FPS: 60');
check('live server again: the PING is back', ping({}, 45, 'wss://live-arena-1.agar.io:443') === 'FPS: 60 | PING: 45');
const dr2 = { ping: 45 };
vm.runInNewContext(pong.replace('case 31:', ''), { window: { agarpingstarted: Date.now() - 31349 }, drawRender: dr2, Date, LM: { ws: 'wss://imsolo.pro.replay:2000' } });
check('replay playing: a recorded pong keeps the live ping', dr2.ping === 45);

console.log(fail ? fail + ' FAILED' : 'all frame time checks passed');
process.exit(fail ? 1 : 0);
