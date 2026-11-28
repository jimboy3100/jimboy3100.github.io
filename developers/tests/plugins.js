/* Plugin manager and Lab checks (ogario/modules/plugins.js, ogario/modules/lab.js): plugin header
 * parsing and validation, Legend Mod version compatibility, stored data checks, the catalogue
 * and its example plugins removed, the Lab storage, the slot of a plugin's experiment and the Lab
 * opening the User Scripts window, the old Lab hotkey moved to User Scripts, and that every new
 * LMEvents emit point is guarded so it costs nothing while nobody listens.
 * node developers/tests/plugins.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..', '..');
const P = require(path.join(root, 'ogario', 'modules', 'plugins.js'));
const L = require(path.join(root, 'ogario', 'modules', 'lab.js'));
const i18n = require('./lib/i18n-env');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* ---- header parsing ---- */
const HEAD = [
    '// ==LMPlugin==',
    '// @name        Kill counter',
    '// @version     1.2.3',
    '// @description Counts things',
    '// @author      Someone',
    '// @minVersion  3.5',
    '// @maxVersion  4',
    '// @permissions reads chat, sends chat; network',
    '// @permission  changes settings',
    '// @homepage    https://example.com',
    '// @run-at      document-start',
    '// ==/LMPlugin==',
    'console.log(1);'
].join('\n');
let r = P.parseMeta(HEAD);
check('valid header parses', r.ok && r.errors.length === 0);
check('fields read', r.meta.name === 'Kill counter' && r.meta.version === '1.2.3' && r.meta.description === 'Counts things' && r.meta.author === 'Someone');
check('id from the name', r.meta.id === 'kill-counter');
check('versions as numbers', r.meta.minVersion === 3.5 && r.meta.maxVersion === 4);
check('permissions: words and repeated lines', JSON.stringify(r.meta.permissions) === JSON.stringify(['chat.read', 'chat.send', 'network', 'settings']) && r.meta.unknownPermissions.length === 0);
check('unknown fields ignored', !('homepage' in r.meta) && !('run-at' in r.meta) && !('runAt' in r.meta));
r = P.parseMeta('/*\n ==LMPlugin==\n name: Colon style\n id: My.Plugin_1\n version: 2\n permissions: game.read, ui, teleport\n ==/LMPlugin==\n*/');
check('"key: value" style and block comment', r.ok && r.meta.name === 'Colon style' && r.meta.version === '2');
check('explicit id kept (lower case)', r.meta.id === 'my.plugin_1');
check('unknown permission listed apart', r.meta.permissions.join() === 'game.read,ui' && r.meta.unknownPermissions.join() === 'teleport');
check('CRLF header', P.parseMeta(HEAD.replace(/\n/g, '\r\n')).ok);
check('no header', !P.parseMeta('console.log(1)').ok && P.parseMeta('console.log(1)').errors[0] === 'noHeader');
check('closing marker before opening', !P.parseMeta('// ==/LMPlugin==\n// ==LMPlugin==\n// @name X').ok);
check('header without a name', !P.parseMeta('// ==LMPlugin==\n// @version 1\n// ==/LMPlugin==').ok && P.parseMeta('// ==LMPlugin==\n// @version 1\n// ==/LMPlugin==').errors[0] === 'noName');
check('not a string', !P.parseMeta(null).ok && !P.parseMeta({}).ok);
check('header after 20000 characters is not read', !P.parseMeta('x'.repeat(20001) + HEAD).ok);
r = P.parseMeta('// ==LMPlugin==\n// @name  <img src=x onerror=alert(1)>‮\u0007 name\n// @description ' + 'd'.repeat(500) + '\n// @author ' + 'a'.repeat(100) + '\n// @version 1.0.0-beta+build.5 extra words here too long\n// ==/LMPlugin==');
check('strings cleaned: control and direction characters gone', r.ok && !/[\u0000-\u001f‮]/.test(r.meta.name));
check('strings cut to their limits', r.meta.description.length === 300 && r.meta.author.length === 60 && r.meta.version.length <= 20);
check('markup kept as text, escaped for HTML', P.escapeHtml(r.meta.name).indexOf('<img') === -1 && P.escapeHtml(r.meta.name).indexOf('&lt;img') === 0);
check('id from a name with markup is safe', /^[a-z0-9][a-z0-9._-]*$/.test(r.meta.id));
r = P.parseMeta('// ==LMPlugin==\n// @name X\n// @id ../../evil\n// ==/LMPlugin==');
check('bad id replaced by the name', r.ok && r.meta.id === 'x');
r = P.parseMeta('// ==LMPlugin==\n// @name X\n// @minVersion latest\n// @maxVersion 3.x\n// ==/LMPlugin==');
check('bad versions dropped with a warning', r.ok && r.meta.minVersion === null && r.meta.maxVersion === null && r.warnings.indexOf('minVersion') !== -1 && r.warnings.indexOf('maxVersion') !== -1);
r = P.parseMeta('// ==LMPlugin==\n// @name X\n// @minVersion 4\n// @maxVersion 3\n// ==/LMPlugin==');
check('max below min: max dropped', r.ok && r.meta.minVersion === 4 && r.meta.maxVersion === null && r.warnings.indexOf('range') !== -1);
check('name only header', P.parseMeta('// ==LMPlugin==\n// @name Only\n// ==/LMPlugin==').ok);
check('slug of a Greek / symbol name falls back', P.cleanMeta({ name: 'Πείραμα !!' }).id === 'plugin');

/* ---- versions ---- */
check('lmVersion', P.lmVersion('3.568') === 3.568 && P.lmVersion('3.6') === 3.6 && P.lmVersion('4') === 4 && P.lmVersion(3.5) === 3.5);
check('lmVersion rejects others', P.lmVersion('3.5.1') === null && P.lmVersion('v3') === null && P.lmVersion('') === null && P.lmVersion(NaN) === null && P.lmVersion('-1') === null);
const meta = (min, max) => ({ minVersion: min, maxVersion: max });
check('no limits: ok', P.compat(meta(null, null), 3.568).ok);
check('at the minimum: ok', P.compat(meta(3.568, null), 3.568).ok);
check('below the minimum: old', P.compat(meta(3.569, null), 3.568).reason === 'old' && !P.compat(meta(3.569, null), 3.568).ok && P.compat(meta(3.569, null), 3.568).need === 3.569);
check('decimal compare: 3.57 is newer than 3.568', P.compat(meta(3.57, null), 3.568).reason === 'old' && P.compat(meta(3.568, null), 3.57).ok);
check('above the maximum: new', P.compat(meta(null, 3.5), 3.568).reason === 'new');
check('at the maximum: ok', P.compat(meta(null, 3.568), 3.568).ok);
check('unknown Legend Mod version: allowed', P.compat(meta(9, null), undefined).ok && P.compat(meta(9, null), undefined).reason === 'unknown');
check('no meta: not ok', !P.compat(null, 3.5).ok);

/* ---- URLs ---- */
check('safeUrl accepts https', P.safeUrl('https://raw.githubusercontent.com/a/b/main/x.js') === 'https://raw.githubusercontent.com/a/b/main/x.js');
check('safeUrl rejects other schemes and junk', !P.safeUrl('javascript:alert(1)') && !P.safeUrl('data:text/javascript,1') && !P.safeUrl('https://a b') && !P.safeUrl('https://x/"onload=') && !P.safeUrl('https://user:pw@x.com/a.js') && !P.safeUrl('https://x/' + 'a'.repeat(700)) && !P.safeUrl(5));
check('official URLs', P.isOfficialUrl('https://www.legendmod.ml/extras/plugins/a.js') && P.isOfficialUrl('https://jimboy3100.github.io/x.js'));
check('third-party URLs', !P.isOfficialUrl('https://www.legendmod.ml.evil.com/a.js') && !P.isOfficialUrl('http://www.legendmod.ml/a.js') && !P.isOfficialUrl('https://evil.com/www.legendmod.ml/a.js'));

/* ---- the user script slots as stored ---- */
const HDR = ['// ==LMPlugin==', '// @id my-plug', '// @name My plug', '// @permissions reads chat', '// ==/LMPlugin==', 'x();'].join('\n');
let se = P.slotEntry(2, { url: 'https://evil.example/a.js', code: HDR, name: 'Name' + String.fromCharCode(7) + '<b>', enabled: true });
check('slot with a URL and a header', !se.empty && se.n === 2 && se.url === 'https://evil.example/a.js' && !se.official && !se.pasted && se.enabled && se.meta && se.meta.id === 'my-plug' && se.meta.permissions.join() === 'chat.read');
check('slot name cleaned', se.name === 'Name <b>');
se = P.slotEntry(1, { url: 'null', code: 'null', name: 'null', enabled: 'true' });
check('"null" strings are empty slots; enabled only when true', se.empty && se.name === '' && se.enabled === false && se.meta === null);
se = P.slotEntry(3, { url: '', code: 'alert(1)' });
check('pasted code without a header: a plain user script', !se.empty && se.pasted && se.meta === null && se.url === '');
se = P.slotEntry(4, { url: 'javascript:alert(1)', code: '' });
check('bad URL kept out but the slot is not empty', !se.empty && se.url === '' && se.badUrl);
check('official slot URL', P.slotEntry(5, { url: 'https://www.legendmod.ml/extras/plugins/split-counter.js' }).official);
check('slotEntry of junk', P.slotEntry(1, null).empty && P.slotEntry(1, 5).empty && P.slotEntry(1, { code: 5 }).empty);

/* ---- plugin settings ---- */
const schema = P.validateSchema([
    { key: 'words', type: 'text', label: 'Words', default: 'a', maxLength: 10 },
    { key: 'n', type: 'number', min: 1, max: 5, default: 9 },
    { key: 'on', type: 'checkbox', default: true },
    { key: 'words', type: 'text' }, { key: '1bad' }, { key: '__proto__' }, { key: 'odd', type: 'evil' }, null
]);
check('settings schema checked', schema.map(s => s.key + ':' + s.type).join() === 'words:text,n:number,on:checkbox,odd:text');
check('number default clamped', schema[1]['default'] === 5);
const vals = P.cleanValues(schema, { words: 'abcdefghijklmnop', n: '3', on: 'true', extra: 1 });
check('values typed and clamped', vals.words === 'abcdefghij' && vals.n === 3 && vals.on === true && !('extra' in vals));
check('values from broken JSON fall back to defaults', JSON.stringify(P.cleanValues(schema, '{')) === JSON.stringify({ words: 'a', n: 5, on: true, odd: '' }));
check('number out of range clamped', P.cleanValues(schema, { n: 100 }).n === 5 && P.cleanValues(schema, { n: -4 }).n === 1);

/* ---- the catalogue and its example plugins are removed: no view, no file, no API ---- */
(function () {
    const src = fs.readFileSync(path.join(root, 'ogario', 'modules', 'plugins.js'), 'utf8');
    check('catalogue: no example plugin files', !fs.existsSync(path.join(root, 'extras', 'plugins')));
    check('catalogue: no view, loader or install in the module', src.toLowerCase().indexOf('catalogue') < 0 && src.indexOf('function install(') < 0 && !('validateCatalogue' in P) && !('firstEmptySlot' in P));
})();

/* ---- the confirm text of a plugin comes from the language pack and follows a language change ---- */
(function () {
    const store = {};
    let asked = '';
    const ctx = {
        console, setTimeout: () => 0, clearTimeout: () => { }, JSON, URL,
        localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
        document: { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], currentScript: null },
        confirm: t => { asked = t; return false; }
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    i18n(ctx);
    vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'modules', 'plugins.js'), 'utf8'), ctx);
    const ok = ctx._lmUsGate(1, HEAD, true);
    check('plugins: a refused confirm does not run the plugin', ok === false);
    check('plugins: confirm text from the language pack', asked.indexOf(i18n.t('modules.plugins.confirmRun', ['Kill counter'])) === 0 && asked.indexOf('- ' + i18n.t('modules.plugins.permChatRead')) !== -1 && asked.indexOf(i18n.t('modules.plugins.confirmFull')) !== -1);
    ctx.LMi18n.setLang('el', { save: false });
    ctx._lmUsGate(1, HEAD, true);
    check('plugins: confirm text follows a language change', asked.indexOf(i18n.t('modules.plugins.confirmRun', ['Kill counter'], 'el')) === 0 && asked.indexOf(i18n.t('modules.plugins.permChatRead', null, 'el')) !== -1 && asked.indexOf(i18n.t('modules.plugins.confirmFull')) === -1);
})();

/* ---- Lab storage ---- */
check('lab store: only valid ids that are on', JSON.stringify(L.validateStore('{"v":1,"on":{"a":true,"b":false,"c":"true","bad id":true,"__proto__":true,"x.y-z_1":true}}').on) === JSON.stringify({ a: true, 'x.y-z_1': true }));
check('lab store: broken values give an empty store', Object.keys(L.validateStore('{').on).length === 0 && Object.keys(L.validateStore({ on: [] }).on).length === 0 && Object.keys(L.validateStore(null).on).length === 0);
check('lab experiment checked', L.validateExperiment({ id: 'a', name: ' A\u0000 ', onEnable: 5 }).name === 'A' && L.validateExperiment({ id: 'a', name: 'A' }).onEnable === null);
check('lab experiment needs an id and a name', !L.validateExperiment({ id: '1a', name: 'A' }) && !L.validateExperiment({ id: 'a' }) && !L.validateExperiment(null));

/* ---- Lab in a page stub: off by default, on/off calls, stored apart, reset ---- */
(function () {
    const store = {};
    const ctx = {
        console, setTimeout: () => 0, JSON,
        localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } },
        document: { querySelector: () => null, getElementById: () => null },
        confirm: () => true
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    i18n(ctx);
    vm.runInContext(fs.readFileSync(path.join(root, 'ogario', 'modules', 'lab.js'), 'utf8'), ctx);
    const Lab = ctx.LMLab;
    /* the frame time experiment is the stats option showStatsFrameTime now (developers/tests/frametime.js) */
    check('lab: no built-in experiment left', Lab.list().length === 0 && !Lab.isEnabled('frameTime'));
    let on = 0, off = 0;
    check('lab: register', Lab.register({ id: 'demo', name: 'Demo', onEnable: () => on++, onDisable: () => off++ }) === true);
    check('lab: same id twice is refused', Lab.register({ id: 'demo', name: 'Again' }) === false);
    Lab.set('demo', true);
    check('lab: on calls onEnable and is stored in its own key', on === 1 && JSON.parse(store.lmLab).on.demo === true && !('ogarioSettings' in store));
    check('lab: an unknown id is not switched', Lab.set('frameTime', true) === false && !Lab.isEnabled('frameTime'));
    Lab.set('demo', false);
    check('lab: off calls onDisable', off === 1 && !JSON.parse(store.lmLab).on.demo);
    Lab.register({ id: 'thrower', name: 'T', onEnable: () => { throw new Error('x'); } });
    const ow = console.warn; console.warn = () => { };
    Lab.set('thrower', true);
    console.warn = ow;
    check('lab: a throwing onEnable does not break it', Lab.isEnabled('thrower'));
    Lab.reset(true);
    check('lab: reset turns all off and clears the key', !Lab.isEnabled('demo') && !Lab.isEnabled('thrower') && !('lmLab' in store));
    store.lmLab = JSON.stringify({ v: 1, on: { later: true } });
    let late = 0;
    Lab.register({ id: 'later', name: 'Later', onEnable: () => late++ });
    check('lab: left on -> onEnable at registration', late === 1 && Lab.isEnabled('later'));
    /* shown in the User Scripts window: under the plugin whose slot registered it at its top level */
    const code = '/* slot 2 plugin */ LMLab.register(...)';
    ctx._lmUsRan = { 2: code };
    ctx.document.currentScript = { text: code };
    let redraws = 0, opened = null;
    ctx.LMPlugins = { _refresh: () => { redraws++; }, open: v => { opened = v; } };
    Lab.register({ id: 'fromSlot', name: 'From slot 2' });
    ctx.document.currentScript = { text: 'another script' };
    Lab.register({ id: 'outside', name: 'Outside' });
    ctx.document.currentScript = null;
    const byId = {}; Lab.list().forEach(x => { byId[x.id] = x; });
    check('lab: an experiment knows the slot of the plugin that added it', byId.fromSlot.slot === 2 && byId.outside.slot === 0 && byId.demo.slot === 0);
    check('lab: a registration redraws the User Scripts window', redraws === 2);
    Lab.set('outside', true);
    check('lab: a switch redraws it', redraws === 3);
    Lab.open();
    check('lab: open() opens the User Scripts window at the experiments', opened === 'experiments');
    check('lab: _mount kept for old scripts', Lab._mount() === true);
    Lab.reset(true);
})();

/* ---- the old "Open the Lab" hotkey and the removed User Scripts hotkey: their keys are free again
 * (ogario.v4.js lmRenameOldHotkeys, which loadHotkeys uses) ---- */
(function () {
    const v4src = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
    const a = v4src.indexOf('function lmRenameOldHotkeys(map) {'), b = v4src.indexOf('\n}', a);
    check('loadHotkeys drops the Lab hotkey', a > 0 && b > a && v4src.indexOf('lmRenameOldHotkeys(hotkeys);') > 0);
    if (!(a > 0 && b > a)) return;
    const run = hk => { vm.runInNewContext(v4src.slice(a, b + 2) + '\nlmRenameOldHotkeys(hotkeys);', { hotkeys: hk }); return hk; };
    const one = run({ L: 'hk-lmLab', '': 'hk-lmPlugins', W: 'hk-moveUp' });
    check('Lab key and User Scripts entry freed, other keys stay', JSON.stringify(one) === JSON.stringify({ W: 'hk-moveUp' }));
    const two = run({ L: 'hk-lmLab', U: 'hk-lmPlugins' });
    check('Lab key and User Scripts key freed', JSON.stringify(two) === '{}');
    const three = run({ '': 'hk-lmLab' });
    check('no key: nothing bound', !('' in three));
})();

/* ---- LMEvents: nothing is built or frozen while nobody listens ---- */
const v4 = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
(function () {
    const a = v4.indexOf('/* LMEvents: hooks for user scripts');
    const b = v4.indexOf('window.spects = window.spects');
    const ctx = { console };
    ctx.window = ctx;
    vm.runInNewContext(v4.slice(a, b), ctx);
    const E = ctx.LMEvents;
    const data = { a: { b: 1 } };
    E.emit('split', data);
    check('emit without listeners leaves the data untouched (not frozen)', !Object.isFrozen(data) && !Object.isFrozen(data.a));
    check('_has is false without listeners', ['split', 'merge', 'gameModeChange', 'multiboxSwap', 'replayStart', 'replayStop', 'settingsChange'].every(n => !E._has(n)));
    let got = null; const f = d => { got = d; };
    E.on('settingsChange', f);
    E.emit('settingsChange', { key: 'showGrid', value: true });
    check('a listener gets frozen data', got && got.key === 'showGrid' && Object.isFrozen(got));
    E.off('settingsChange', f);
    check('_has false again after off', !E._has('settingsChange'));
    /* every event says where it comes from (audit A16) */
    const seen = []; const g = d => seen.push(d.context);
    E.on('spawn', g);
    E.emit('spawn', { time: 1 });
    ctx.LMPractice = { on: true }; E.emit('spawn', { time: 2 });
    ctx.LMPractice = null; ctx._lmEvReplayOn = true; E.emit('spawn', { time: 3 });
    ctx._lmEvReplayOn = false;
    E.off('spawn', g);
    check('events carry their context: live, practice, replay', seen.join() === 'live,practice,replay');
    check('api.getContext', typeof E.api.getContext === 'function' && E.api.getContext() === 'live');
})();

/* every emit of the new events sits inside a _has() check of the same event */
['split', 'merge', 'gameModeChange', 'multiboxSwap', 'replayStart', 'replayStop', 'settingsChange'].forEach(function (name) {
    const re = new RegExp("LMEvents\\.emit\\('" + name + "'", 'g');
    const literal = []; let m;
    while ((m = re.exec(v4))) literal.push(m.index);
    /* the replay events are emitted through one helper by variable name */
    const viaHelper = (name === 'replayStart' || name === 'replayStop') && /if \(!window\.LMEvents\._has\(name\)\) return;[\s\S]{0,400}window\.LMEvents\.emit\(name,/.test(v4) && v4.indexOf("'" + name + "'") !== -1;
    check(name + ': emitted', literal.length > 0 || viaHelper);
    const guarded = literal.every(function (i) {
        const before = v4.slice(Math.max(0, i - 900), i);
        const lastHas = before.lastIndexOf("_has('" + name + "')");
        return lastHas !== -1 && !/\n {8}[a-zA-Z_]+\([^)]*\) \{/.test(before.slice(lastHas));
    });
    check(name + ': every emit is guarded by _has(\'' + name + '\')', guarded);
});
check('disconnect: every emit is guarded by _has(\'disconnect\')', (function () {
    const i = v4.indexOf("LMEvents.emit('disconnect'");
    return i > 0 && v4.slice(i - 300, i).indexOf("_has('disconnect')") !== -1;
})());
/* death scope (unit / scope) and the disconnect event, with the real code */
(function () {
    const a = v4.indexOf('/* LMEvents: hooks for user scripts');
    const b = v4.indexOf('window.spects = window.spects');
    const s = v4.indexOf('function lmDeathScope(unit) {'), e = v4.indexOf('window.lmDeathScope = lmDeathScope;', s);
    const c0 = v4.indexOf('var _lmClosedAlive = !!this.play;'), c1 = v4.indexOf('this.isLegendWorld = false;', c0);
    if (a < 0 || b < 0 || s < 0 || e < 0 || c0 < 0 || c1 < 0) { check('death scope / disconnect code found', false); return; }
    const ctx = { console, menus: 0 };
    ctx.window = ctx;
    vm.runInNewContext(v4.slice(a, b) + '\n' + v4.slice(s, e) +
        '\nfunction _lmHostOnly(u) { return String(u || "").replace(/^wss?:\\/\\//, "").split(/[/?]/)[0]; }' +
        '\nvar application = { showMenu: function () { window.menus++; } };' +
        '\nwindow.onCloseTail = function (t) {\n' + v4.slice(c0, c1) + '\n};', ctx);
    const scope = ctx.lmDeathScope;
    const unit = (n, active, player) => ({ number: n, active: active, player: player !== false });
    ctx.legendmod = { play: false };
    ctx.spects = [];
    check('death scope: main player, no units: all', scope(0) === 'all');
    ctx.spects = [unit(1, true), unit(2, false)];
    check('death scope: main player, a unit alive: unit (no Game Over)', scope(0) === 'unit');
    ctx.spects = [unit(1, false), unit(2, false)];
    check('death scope: main player, every unit dead: all', scope(0) === 'all');
    ctx.spects = [unit(1, true, false), unit(2, true, false)];
    check('death scope: Full Map / in-game spectators are no units', scope(0) === 'all');
    ctx.spects = [unit(1, true), unit(2, false)];
    check('death scope: unit 1 itself does not count for its own death', scope(1) === 'all');
    ctx.legendmod.play = true;
    check('death scope: a unit dies, the main player lives: unit', scope(2) === 'unit');
    /* disconnect */
    const got = []; const f = d => got.push(d);
    ctx.LMEvents.on('disconnect', f);
    const main = ctx.legendmod = { play: true, ws: 'wss://live-arena-abc.agar.io:443/?token=x' };
    ctx.onCloseTail.call(main, { code: 1006, wasClean: false, reason: 'secret' });
    const d = got[0];
    check('disconnect: sent for the main connection with host, code, clean, playing',
        got.length === 1 && d.server === 'live-arena-abc.agar.io:443' && d.code === 1006 && d.clean === false && d.playing === true && d.context === 'live' && !('reason' in d) && Object.isFrozen(d));
    check('disconnect: the life still ends (menu)', main.play === false && ctx.menus === 1);
    ctx.onCloseTail.call({ play: true, ws: 'wss://x' }, { code: 1000, wasClean: true });
    check('disconnect: not for another connection (units, spectators)', got.length === 1);
    ctx.onCloseTail.call(main, undefined);
    check('disconnect: no close event object: code 0, not clean, not playing', got.length === 2 && got[1].code === 0 && got[1].clean === false && got[1].playing === false);
    ctx._lmReplayQuiet = true;
    ctx.onCloseTail.call(main, { code: 1000 });
    ctx._lmReplayQuiet = false;
    check('disconnect: none while Replay Studio rebuilds', got.length === 2);
    ctx.LMPractice = { on: true };
    ctx.onCloseTail.call(main, { code: 1000, wasClean: true });
    ctx.LMPractice = null;
    check('disconnect: practice arena context is reported', got.length === 3 && got[2].context === 'practice');
    ctx.LMEvents.off('disconnect', f);
})();
/* the data of 'split' and 'merge' is only collected while someone listens */
check('merges are only counted while someone listens', /window\.LMEvents\._has\('merge'\) && \(eaterID\.isPlayerCell/.test(v4));
check('one split emitter: every split emit carries the cell count before it', (v4.match(/LMEvents\.emit\('split'/g) || []).length === 4 && (v4.match(/LMEvents\.emit\('split', \{ time: Date\.now\(\), count: \d, before: this\.playerCells \? this\.playerCells\.length : 0 \}\)/g) || []).length === 4);

console.log(fail ? fail + ' failed' : 'all plugin and lab checks passed');
process.exit(fail ? 1 : 0);
