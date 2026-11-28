/* The Tools tab buttons that became settings, with the real code of ogario/ogario.v4.js and
 * LMexpress/LMexpress.js: "Rounded / Square HUD" is the theme option hudRoundedCorners (Theme >
 * HUD, square by default: its corners, the switch, the one-time carry of the old MAINBTBtn key),
 * "Show Timer Calc." (later the stats option showStopwatch) is removed with its stopwatch: old saved
 * values are ignored and the old TIMEcalBtn key is deleted on load.
 * node developers/tests/toolstab.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const lmx = fs.readFileSync(path.join(root, 'LMexpress', 'LMexpress.js'), 'utf8').replace(/\r\n/g, '\n');
const cutIn = (src, a, b) => { const i = src.indexOf(a), j = src.indexOf(b, i + a.length); if (i < 0 || j < 0) throw new Error('not found: ' + a); return src.slice(i, j); };
const cut = (a, b) => cutIn(main, a, b);
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function makeStorage() {
    const m = new Map();
    return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, _map: m };
}
const readJSON = ls => (k, d) => { try { const v = ls.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };

/* ═══ Rounded corners (theme) ═══ */
const themeDefs = vm.runInNewContext('(function(){' + cut('var defaultSettings = {', '\n/* The shipped theme defaults') + '; return defaultSettings; })()', { window: {} });
check('theme default: square corners (hudRoundedCorners false)', themeDefs.hudRoundedCorners === false);
const valueCtx = { LM_THEME_DEFAULTS: themeDefs, LM_THEME_SCHEMA: {}, lmSchemaFit: (r, n) => n, LM_THEME_COLOR: /x/ };
vm.createContext(valueCtx);
vm.runInContext(cut('function lmThemeValue(', '\ncimg2 = new Image;'), valueCtx);
check('theme schema: a boolean (stored, imported, profiles, Theme Workshop)', valueCtx.lmThemeValue('hudRoundedCorners', true) === true &&
    valueCtx.lmThemeValue('hudRoundedCorners', 'false') === false && valueCtx.lmThemeValue('hudRoundedCorners', 1) === undefined);
/* right after the HUD scale */
check('Theme > HUD: a switch after the HUD scale', /addSliderBox\('#theme-hud', 'hudScale'[^\n]*\n(?:[^\n]*\n){0,4}?\s*this\.addThemeCheckBox\('#theme-hud', 'hudRoundedCorners', 'setHudCorners'\);/.test(main));
check('setHud applies the corners (setTheme: start, profiles, theme packages, presets)', /setHud\(\) \{[^}]*this\.setHudCorners\(\);/.test(main));

function loadTheme(storedTheme, oldKey, full) {
    const ls = makeStorage();
    if (storedTheme) ls.setItem('ogarioThemeSettings', JSON.stringify(storedTheme));
    if (oldKey !== undefined) ls.setItem('MAINBTBtn', oldKey);
    if (full) { const set = ls.setItem; ls.setItem = (k, v) => { if (k === 'ogarioThemeSettings') throw new Error('QuotaExceededError'); set(k, v); }; }
    const d = Object.assign({}, themeDefs);
    const ctx = {
        window: { localStorage: ls }, JSON, Object, $: { extend: Object.assign },
        defaultSettings: d, ogario: {}, defaultmapsettings: undefined,
        readLocalStorageJSON: readJSON(ls), lmThemeValue: valueCtx.lmThemeValue,
        /* the old Chat Position move into the HUD layout (settingsmerge.js tests it): nothing to move here */
        lmHudAdoptOld: () => false
    };
    vm.createContext(ctx);
    const St = vm.runInContext('({\n' + cut('        loadThemeSettings() {', '        restoreThemeSettings() {') + '\n})', ctx);
    St.loadThemeSettings();
    return { d, ls, saved: JSON.parse(ls.getItem('ogarioThemeSettings') || 'null') };
}
let t = loadTheme({ hudColor: 'rgba(0,0,0,0.4)' }, 'true');
check('carry: a player who chose Rounded HUD keeps rounded', t.d.hudRoundedCorners === true);
check('carry: saved in the theme, the old key gone', t.saved && t.saved.hudRoundedCorners === true && t.ls.getItem('MAINBTBtn') === null);
t = loadTheme(null, 'true');
check('carry: also without a saved theme', t.d.hudRoundedCorners === true && t.saved && t.saved.hudRoundedCorners === true);
t = loadTheme({}, 'false');
check('carry: Square HUD stays square, the old key gone', t.d.hudRoundedCorners === false && t.ls.getItem('MAINBTBtn') === null);
t = loadTheme({ hudRoundedCorners: false }, 'true');
check('carry: once: a saved theme choice wins over the old key', t.d.hudRoundedCorners === false && t.ls.getItem('MAINBTBtn') === null);
t = loadTheme({ hudRoundedCorners: true });
check('no old key: the saved choice loads', t.d.hudRoundedCorners === true);
t = loadTheme({}, 'true', true);
check('full storage: the old key stays for the next start', t.d.hudRoundedCorners === true && t.ls.getItem('MAINBTBtn') === 'true');

function corners(rounded, opt) {
    opt = opt || {};
    const props = {}, appended = [], events = [];
    let notified = 0;
    const cb = opt.cb ? { checked: opt.cb.checked, dispatchEvent: e => { events.push(e); } } : null;
    let rncn = !!opt.rncn;
    const doc = {
        documentElement: { style: { setProperty: (k, v) => { props[k] = v; } } },
        getElementById: id => (id === 'hudRoundedCorners' ? cb : id === 'RNCN' && rncn ? {} : null)
    };
    const $ = sel => {
        if (sel === 'head') return { append: el => { appended.push(el); rncn = true; } };
        const o = { id: (/id="([^"]+)"/.exec(sel) || [])[1], css: '', text: function (s) { this.css = s; return this; } };
        return o;
    };
    const ctx = { document: doc, $, Event: function (type, init) { this.type = type; this.bubbles = !!(init && init.bubbles); }, defaultSettings: { hudRoundedCorners: rounded }, window: { lmThemeChanged: () => { notified++; } } };
    vm.createContext(ctx);
    const St = vm.runInContext('({\n' + cut('        setHudCorners() {', '        setHudColors() {') + '\n})', ctx);
    St.setHudCorners();
    return { props, appended, events, cb, notified };
}
let c = corners(false);
check('square: --lm-radius 0px, --lm-radius-s 0px', c.props['--lm-radius'] === '0px' && c.props['--lm-radius-s'] === '0px');
check('the corner stylesheet everywhere the old button reached (menu, buttons, fields, HUD boxes, minimap)', c.appended.length === 1 && c.appended[0].id === 'RNCN' &&
    ['.agario-panel', '#main-menu', '.btn', '.form-control', '#chat-box', '#stats-hud', '#time-hud', '.menu-tabs', '#leaderboard-hud', '#top5-hud', '#minimap-hud', '#menu-footer', '.agario-profile-picture']
        .every(s => c.appended[0].css.indexOf(s) >= 0) && /border-radius:var\(--lm-radius\)!important/.test(c.appended[0].css));
check('open Legend pages are told (theme bridge)', c.notified === 1);
c = corners(true);
check('rounded: --lm-radius 10px, --lm-radius-s 6px', c.props['--lm-radius'] === '10px' && c.props['--lm-radius-s'] === '6px');
c = corners(true, { rncn: true });
check('the stylesheet is added once', c.appended.length === 0 && c.props['--lm-radius'] === '10px');
c = corners(true, { cb: { checked: false } });
check('a value set elsewhere moves the switch with a change that does not bubble (no save, no setSettings)', c.cb.checked === true && c.events.length === 1 && c.events[0].type === 'change' && c.events[0].bubbles === false);
c = corners(false, { cb: { checked: false } });
check('the switch already right: no event', c.events.length === 0);

/* ═══ Stopwatch: removed (owner) ═══ */
const defs = vm.runInNewContext('(function(){' + cut('var defaultmapsettings = {', '\nvar ') + '; return defaultmapsettings; })()', { window: {}, navigator: { userAgent: '' } });
check('no showStopwatch setting', !('showStopwatch' in defs) && !/"showStopwatch"|case 'showStopwatch'/.test(main));

function load(stored, oldKey) {
    const ls = makeStorage();
    if (stored) ls.setItem('ogarioSettings', JSON.stringify(stored));
    if (oldKey !== undefined) ls.setItem('TIMEcalBtn', oldKey);
    const ms = Object.assign({}, defs);
    const ctx = {
        window: { localStorage: ls }, JSON, Object,
        defaultmapsettings: ms, defaultSettings: {}, ogario: {},
        readLocalStorageJSON: readJSON(ls),
        lmSettingValue: (k, v) => (typeof v === typeof defs[k] ? v : undefined),
        lmFoldVideoVolume: () => false, lmFoldLegacySettings: () => false, lmHudAdoptOld: () => false, lmEndPerfMode: () => false, lmSettingsUserView: () => ms, lmSettingsCommit: () => { }, _lmSettingsSeen: null
    };
    vm.createContext(ctx);
    const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
    app.loadSettings();
    return { ms, ls };
}
let r = load({ showMass: true, showStopwatch: true }, 'true');
check('load: an old saved stopwatch is ignored, the old TIMEcalBtn key deleted, other settings load', !('showStopwatch' in r.ms) && r.ms.showMass === true && r.ls.getItem('TIMEcalBtn') === null);
r = load(null, 'false');
check('load: the old key is deleted also without saved settings', !('showStopwatch' in r.ms) && r.ls.getItem('TIMEcalBtn') === null);
check('LMexpress: no stopwatch panel, timer functions or TimerLM state', !/timertools-hud|lmShowStopwatch|TimerLM|function (startTimer|stopTimer|clearTimer|displayTimer)\(|lmx\.ex\.(start|pause|stop)Timer|"TIMEcalBtn"/.test(lmx));

/* ═══ Tools tab: the buttons are gone, Hide Everything is right of Hide Shortcuts ═══ */
const tools = cutIn(lmx, "'<button id=\"SHOSHOBtn\"", "'<button id=\"OpenuserScripts\"");
check('no Rounded / Square HUD or Show Timer Calc. button', !/id="(MAINBTBtn|TIMEcalBtn)"|#(MAINBTBtn|TIMEcalBtn)/.test(lmx));
const ids = (tools.match(/<button id="([^"]+)"/g) || []).map(s => s.slice(12, -1));
check('row 1: Hide Shortcuts | Hide Everything', ids.join(',') === 'SHOSHOBtn,HideAllBthn' && /id="HideAllBthn"[^>]*class="btn btn-sm btn-danger"[^>]*width: 49\.5%[^>]*margin-left: 0\.5%/.test(tools));

console.log(fail ? 'RESULT: FAIL (' + fail + ')' : 'RESULT: PASS');
process.exit(fail ? 1 : 0);
