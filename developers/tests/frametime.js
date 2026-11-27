/* Frame time on the stats line: the stats option showStatsFrameTime (it was the Lab experiment
 * "frameTime"), with the real code of ogario/ogario.v4.js: the default, the Settings > Stats
 * switch, the one-time carry of a switch left on in the removed Lab (loadSettings; its key lmLab
 * is removed then) and the stats line text.
 * node developers/tests/frametime.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* the shipped gameplay defaults */
const defs = vm.runInNewContext('(function(){' + cut('var defaultmapsettings = {', '\nvar ') + '; return defaultmapsettings; })()', { window: {}, navigator: { userAgent: '' } });
check('default: off', defs.showStatsFrameTime === false);
check('Settings > Stats: a switch next to FPS', /"showStatsFPS", "showStatsFrameTime"[^\]]*\], "statsGroup"\)/.test(main));
check('dimmed while FPS is off', /showStatsFPS: \['showStatsFrameTime'[,\]]/.test(main));

function makeStorage() {
    const m = new Map();
    return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, _map: m };
}
function load(stored, lab) {
    const ls = makeStorage();
    if (stored) ls.setItem('ogarioSettings', JSON.stringify(stored));
    if (lab !== undefined) ls.setItem('lmLab', typeof lab === 'string' ? lab : JSON.stringify(lab));
    const ms = Object.assign({}, defs);
    const ctx = {
        window: { localStorage: ls }, JSON, Object,
        defaultmapsettings: ms, defaultSettings: {}, ogario: {},
        readLocalStorageJSON: (k, d) => { try { const v = ls.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
        lmSettingValue: (k, v) => (typeof v === typeof defs[k] ? v : undefined),
        lmFoldVideoVolume: () => false, lmFoldLegacySettings: () => false, lmHudAdoptOld: () => false, lmSettingsUserView: () => ms, lmSettingsCommit: () => { }, _lmSettingsSeen: null
    };
    vm.createContext(ctx);
    const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
    app.loadSettings();
    return { ms, ls, saved: JSON.parse(ls.getItem('ogarioSettings') || 'null'), lab: (() => { try { return JSON.parse(ls.getItem('lmLab') || 'null'); } catch (e) { return 'unparsed'; } })() };
}
let r = load({ showMass: true }, { v: 1, on: { frameTime: true, other: true } });
check('carry: a Lab switch left on turns the option on', r.ms.showStatsFrameTime === true);
check('carry: saved with the settings', r.saved && r.saved.showStatsFrameTime === true && r.saved.showMass === true);
check('carry: the key of the removed Lab is gone afterwards', r.ls.getItem('lmLab') === null);
r = load({ showStatsFrameTime: false }, { v: 1, on: { frameTime: true } });
check('carry: a saved choice wins over the old Lab switch', r.ms.showStatsFrameTime === false && r.ls.getItem('lmLab') === null);
r = load(null, { v: 1, on: { frameTime: true } });
check('carry: also without saved settings (first start after the update)', r.ms.showStatsFrameTime === true && r.saved && r.saved.showStatsFrameTime === true);
r = load({ showStatsFrameTime: true }, undefined);
check('no Lab key: the saved value loads, nothing written to lmLab', r.ms.showStatsFrameTime === true && r.lab === null);
r = load({}, '{broken');
check('broken Lab key: ignored and removed, option stays off', r.ms.showStatsFrameTime === false && r.ls.getItem('lmLab') === null);
r = load({}, { v: 1, on: { other: true } });
check('Lab key without frameTime: removed, option off', r.ms.showStatsFrameTime === false && r.ls.getItem('lmLab') === null);

/* the stats line text (the real lines after "FPS: ") */
const fpsLine = cut("                    t += 'FPS: ' + drawRender.fps;", '                    var activeSpect');
const stats = (on, fps) => vm.runInNewContext('var t = ""; ' + fpsLine + '; t', { defaultmapsettings: { showStatsFrameTime: on }, drawRender: { fps } });
check('stats line: FPS: 60 (16.7 ms) with the option on', stats(true, 60) === 'FPS: 60 (16.7 ms)');
check('stats line: unchanged with it off', stats(false, 60) === 'FPS: 60');
check('stats line: no frame time before the first FPS value', stats(true, 0) === 'FPS: 0');
check('the Lab is removed', !fs.existsSync(path.join(root, 'ogario', 'modules', 'lab.js')));

console.log(fail ? fail + ' FAILED' : 'all frame time checks passed');
process.exit(fail ? 1 : 0);
