/* Gameplay settings checks with the real code of ogario/ogario.v4.js: the settings schema
 * (LM_SETTINGS_SCHEMA + lmSettingValue: type, range, step, choices), the shared change path
 * (application.saveSettings + lmSettingsCommit: one 'settingsChange' per changed setting) and
 * the live player profile count (_lmFitProfiles + setProfileCount + loadProfiles).
 * node developers/tests/settings.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };
const J = v => JSON.stringify(v);

function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)); }, removeItem: k => { m.delete(k); }, _map: m };
}
const ctx = { console, JSON, Math, Date, Object, Array, Number, String, isFinite, setTimeout() { }, clearTimeout() { } };
ctx.window = ctx;
ctx.localStorage = makeStorage();
/* a minimal LMEvents: the core only calls _has and emit */
const events = [];
ctx.LMEvents = { listen: true, _has(n) { return this.listen && n === 'settingsChange'; }, emit(n, d) { events.push([n, d.key, d.value]); if (ctx._onEmit) ctx._onEmit(d); } };
vm.createContext(ctx);
vm.runInContext(cut('function readLocalStorageJSON(key, fallbackValue) {', '/* ─── Persistent Skin & Audio Storage'), ctx);
vm.runInContext(cut('var chatPositions = {', 'var defaultSettings = {'), ctx);
vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
vm.runInContext('var profiles = [];', ctx);
const D = ctx.LM_SETTINGS_DEFAULTS, SCH = ctx.LM_SETTINGS_SCHEMA, V = ctx.lmSettingValue;

// ── S1 the schema
check('every default is a valid value (nothing a player has by default changes)', Object.keys(D).every(k => V(k, D[k]) === D[k]));
const numKeys = Object.keys(D).filter(k => typeof D[k] === 'number');
check('every number setting has a range or a list of choices (also those without a slider)', numKeys.every(k => Object.prototype.hasOwnProperty.call(SCH, k)) || (console.log('   no rule: ' + numKeys.filter(k => !(k in SCH)).join(', ')), false));
check('the schema names only real settings of the right type', Object.keys(SCH).every(k => k in D && (Array.isArray(SCH[k]) ? typeof D[k] === 'number' && SCH[k][0] <= SCH[k][1] : Array.isArray(SCH[k].choices))));
let offStep = [];
Object.keys(SCH).forEach(k => {
  const r = SCH[k];
  if (!Array.isArray(r) || !(r[2] > 0)) return;
  const n = Math.floor((r[1] - r[0]) / r[2] + 1e-9);
  for (let i = 0; i <= n; i++) { const v = Number((r[0] + i * r[2]).toFixed(6)); if (V(k, v) !== v) offStep.push(k + '=' + v + '->' + V(k, v)); }
});
check('every value a slider can show is kept exactly (no float drift: 0.35, -0.13, 1.45)', offStep.length === 0 || (console.log('   ' + offStep.slice(0, 8).join(', ')), false));
/* the audit's values: before, all of them were stored and used as they were */
check('macroFeeding -100 -> 1 (range)', V('macroFeeding', -100) === 1);
check('profileNumber 1000000 -> 54', V('profileNumber', 1000000) === 54);
check('fpsLimit -1 -> 0 (off), 0 stays 0', V('fpsLimit', -1) === 0 && V('fpsLimit', 0) === 0);
check('adaptivePerfTarget 47 -> 60 (nearest of 30/60/90/120)', V('adaptivePerfTarget', 47) === 60 && V('adaptivePerfTarget', 44) === 30);
check('gamepadMoveCurve 100 -> 3', V('gamepadMoveCurve', 100) === 3);
check('massFormat 1.7 -> 2 (a mode, not a fraction)', V('massFormat', 1.7) === 2);
check('fractional step values snap to the slider step', V('zoomSpeedValue2', -0.134) === -0.13 && V('a11yTextScale', 1.12) === 1.1 && V('gamepadTrigger', 0.93) === 0.95);
check('the top of a range that is not a whole number of steps stays reachable (gamepadTrigger 0.95)', V('gamepadTrigger', 0.95) === 0.95 && V('gamepadTrigger', 5) === 0.95);
check('zero where the range allows it', V('hudBlur', 0) === 0 && V('lineSplitDelay', 0) === 0 && V('zoomSpeedValue2', 0) === 0 && V('volMaster', 0) === 0);
check('NaN, Infinity, -Infinity refused (the default stays)', [NaN, Infinity, -Infinity].every(x => V('animation', x) === undefined && V('volMaster', x) === undefined));
check('numeric strings from old saves converted and fitted, other strings refused', V('fpsLimit', '60') === 60 && V('fpsLimit', ' 65 ') === 70 && V('fpsLimit', '') === undefined && V('fpsLimit', '6O') === undefined && V('fpsLimit', true) === undefined);
check('a setting with choices takes only those (scan directions 8/16/32)', V('scanTrickDirections', 32) === 32 && V('scanTrickDirections', '8') === 8 && V('scanTrickDirections', 12) === undefined && V('scanTrickDirections', 16.5) === undefined);
check('a text setting with choices (toast position) takes only those', V('positionClass', 'toast-top-right') === 'toast-top-right' && V('positionClass', 'toast-middle') === undefined);
check('settings without a slider have a range too (domination rate)', V('dominationRate', 4 / 3) === 4 / 3 && V('dominationRate', 0) === 1 && V('dominationRate', 9) === 4 && V('dominatedRate', 0.6) === 0.6);
check('booleans: "true"/"false" converted, other values refused', V('showMass', 'false') === false && V('showMass', 1) === undefined && V('showMass', true) === true);
check('free text kept, unknown keys refused', V('chatHideWords', 'a,b') === 'a,b' && V('chatHideWords', 5) === undefined && V('noSuchSetting', 1) === undefined && V('__proto__', 1) === undefined);
check('the old multibox count 3-4 is still read (ensureMbSlots maps it to 2)', V('multiboxAmount', 4) === 4 && V('multiboxAmount', 9) === 4);

// ── S1 the import path of the settings file (the real loop of importSettings)
const impLoop = cut("                    var _impS = importValue.ogarioSettings;", "                if (Object.prototype.hasOwnProperty.call(importValue, 'ogarioThemeSettings')");
const imported = { ogarioSettings: { macroFeeding: -100, fpsLimit: 'x', massFormat: 1.7, showMass: 'false', scanTrickDirections: 12, nope: 1, profileNumber: 30, animation: Infinity } };
vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(imported);
/* shortMass: the copy that follows Mass format (12.3k = 2) */
check('import: values fitted, unusable ones dropped (their defaults apply)', J(imported.ogarioSettings) === J({ macroFeeding: 1, massFormat: 2, showMass: false, profileNumber: 30, shortMass: true }));
const importedV = { ogarioSettings: { videoSkinSoundLevel: 0.9, volVideo: 0.5 } };
vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(importedV);
check('import: an old export with the second video volume keeps its loudness', J(importedV.ogarioSettings) === J({ videoSkinSoundLevel: 0.45 }));

// ── S1 loading (the real loadSettings): a damaged save is fitted, the rest kept
const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
ctx.ogario = {};
const saved = Object.assign({}, D, { fpsLimit: 145, massFormat: 1.7, hudBlur: 3, showMass: !D.showMass, scanTrickDirections: 7, chatHideWords: 'spam' });
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(saved));
app.loadSettings();
const S = ctx.defaultmapsettings;
check('load: off-range/off-step values fitted, invalid choice keeps the default, valid values kept', S.fpsLimit === 150 && S.massFormat === 2 && S.hudBlur === 3 && S.showMass === !D.showMass && S.scanTrickDirections === D.scanTrickDirections && S.chatHideWords === 'spam');
// ── one video skin volume: the removed second slider (volVideo) is folded into the level once
check('volVideo is no setting any more (no second video volume)', !('volVideo' in D) && !('volVideo' in SCH) && V('volVideo', 0.5) === undefined);
const fold = (o) => { ctx._f = o; vm.runInContext('lmFoldVideoVolume(_f)', ctx); return ctx._f; };
check('fold: level x old video volume, stepped', J(fold({ videoSkinSoundLevel: 0.8, volVideo: 0.5 })) === J({ videoSkinSoundLevel: 0.4 }));
check('fold: no level stored = the default level x old volume', J(fold({ volVideo: '0.25' })) === J({ videoSkinSoundLevel: 0.25 }));
check('fold: 1, invalid or missing old volume leaves the level', J(fold({ videoSkinSoundLevel: 0.7, volVideo: 1 })) === J({ videoSkinSoundLevel: 0.7 }) && J(fold({ videoSkinSoundLevel: 0.7, volVideo: 'x' })) === J({ videoSkinSoundLevel: 0.7 }) && J(fold({ videoSkinSoundLevel: 0.7 })) === J({ videoSkinSoundLevel: 0.7 }));
check('fold: 0 mutes, as before', J(fold({ videoSkinSoundLevel: 0.7, volVideo: 0 })) === J({ videoSkinSoundLevel: 0 }));
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { videoSkinSoundLevel: 0.6, volVideo: 0.5 })));
app.loadSettings();
const reSaved = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
check('load: the old video volume folded into the level and the save rewritten without it', S.videoSkinSoundLevel === 0.3 && !('volVideo' in S) && reSaved.videoSkinSoundLevel === 0.3 && !('volVideo' in reSaved));
app.loadSettings();
check('load: folded only once (the next load keeps 0.3)', S.videoSkinSoundLevel === 0.3);
/* the old reverse trick (no switch since 2020): a saved or imported "on" took the left and right
 * button on the game with nothing to turn it off; it is no setting any more, so it is skipped */
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { reverseTrick: true })));
app.loadSettings();
check('reverseTrick is no setting: refused, and a saved "on" is skipped on load', !('reverseTrick' in D) && V('reverseTrick', true) === undefined && !('reverseTrick' in S));
/* the loaded values of the checks below */
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(saved));
app.loadSettings();

// ── S5 one change path: saveSettings announces each changed setting once
events.length = 0;
app.saveSettings(S, 'ogarioSettings');
check('a save with nothing changed sends no event', events.length === 0);
S.hudBlur = 4; S.showMass = !S.showMass;
app.saveSettings(S, 'ogarioSettings');
check('one event per changed setting, with its new value', J(events) === J([['settingsChange', 'showMass', S.showMass], ['settingsChange', 'hudBlur', 4]]));
events.length = 0;
app.saveSettings(S, 'ogarioSettings');
app.saveSettings(S, 'ogarioSettings');
check('saving again (a slider released after its debounced save) sends nothing', events.length === 0);
check('the save still writes the settings', JSON.parse(ctx.localStorage.getItem('ogarioSettings')).hudBlur === 4);
app.saveSettings([{ nick: 'x' }], 'ogarioPlayerProfiles');
check('other storage keys are saved as before, without events', events.length === 0 && ctx.localStorage.getItem('ogarioPlayerProfiles') === '[{"nick":"x"}]');
/* a slider dragged 1 -> 2 -> 3 -> 2 (input events) then saved once: one event, the final value */
S.hudBlur = 1; S.hudBlur = 2; S.hudBlur = 3; S.hudBlur = 2;
app.saveSettings(S, 'ogarioSettings');
check('a coalesced slider change is one event with the final value', J(events) === J([['settingsChange', 'hudBlur', 2]]));
events.length = 0;
S.hudBlur = 1; S.hudBlur = 2;
app.saveSettings(S, 'ogarioSettings');
check('a change and back before the save is no change (no event)', events.length === 0);
/* a listener that changes another setting: its save announces that one, no repeat of the first */
events.length = 0;
ctx._onEmit = d => { if (d.key === 'showGrid') { ctx._onEmit = null; S.showTop5 = !S.showTop5; app.saveSettings(S, 'ogarioSettings'); } };
S.showGrid = !S.showGrid;
app.saveSettings(S, 'ogarioSettings');
check('a listener that changes a setting: each change announced once', J(events.map(e => e[1])) === J(['showGrid', 'showTop5']));
/* S09: two settings changed in one save, and the listener of the first changes the second again:
 * the last event of the second is its value now (before, the outer save sent the older one after it) */
events.length = 0;
ctx._onEmit = d => { if (d.key === 'showMass') { ctx._onEmit = null; S.hudBlur = 3; app.saveSettings(S, 'ogarioSettings'); } };
S.showMass = !S.showMass; S.hudBlur = 1;
app.saveSettings(S, 'ogarioSettings');
check('nested change of a setting the same save changed: its last event is its value now', J(events.map(e => e[1] + '=' + e[2])) === J(['showMass=' + S.showMass, 'hudBlur=3']) || (console.log('   ' + J(events)), false));
events.length = 0;
app.saveSettings(S, 'ogarioSettings');
check('...and nothing left to announce afterwards', events.length === 0);
events.length = 0;
ctx.LMEvents.listen = false;
S.hudBlur = 5;
app.saveSettings(S, 'ogarioSettings');
ctx.LMEvents.listen = true;
app.saveSettings(S, 'ogarioSettings');
check('without listeners nothing is sent, and the change is not sent later either', events.length === 0);
/* the adaptive performance copy: toJSON gives the player's values; a lowered value is no change */
Object.defineProperty(S, 'toJSON', { value: function () { const c = Object.assign({}, this); c.animation = 80; return c; }, configurable: true, writable: true, enumerable: false });
S.animation = 80; app.saveSettings(S, 'ogarioSettings'); events.length = 0;
S.animation = 20;
app.saveSettings(S, 'ogarioSettings');
check('a value only lowered by Adaptive performance (not the player) is not announced', events.length === 0 && JSON.parse(ctx.localStorage.getItem('ogarioSettings')).animation === 80);
delete S.toJSON;
S.animation = 80;
/* a full storage: the change is in effect, so it is announced; the error reaches the caller as before.
 * S09: the player is told once that it is not saved, and the next save stores everything */
const realSet = ctx.localStorage.setItem, toasts = [];
ctx.toastr = { warning(t) { toasts.push(t); } };
ctx.lmT = k => k;
ctx.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
S.hudBlur = 6;
let threw = false;
try { app.saveSettings(S, 'ogarioSettings'); } catch (e) { threw = true; }
check('a full storage: the error is thrown as before and the change still announced', threw && events.length === 1 && events[0][1] === 'hudBlur' && events[0][2] === 6);
check('a full storage: the player is warned that it is not saved', toasts.length === 1 && ctx._lmSettingsUnsaved === true);
S.showGrid = !S.showGrid;
try { app.saveSettings(S, 'ogarioSettings'); } catch (e) { }
check('still full: no second warning for the next save', toasts.length === 1);
ctx.localStorage.setItem = realSet;
S.hudBlur = 5;
app.saveSettings(S, 'ogarioSettings');
const reS = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
check('storage works again: the next save stores every change, no longer unsaved', reS.hudBlur === 5 && reS.showGrid === S.showGrid && ctx._lmSettingsUnsaved === false);
ctx.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
S.hudBlur = 6;
try { app.saveSettings(S, 'ogarioSettings'); } catch (e) { }
ctx.localStorage.setItem = realSet;
check('full again later: warned again', toasts.length === 2);
delete ctx.toastr; delete ctx.lmT;
events.length = 0;
const long = 'x'.repeat(800);
S.chatHideWords = long;
app.saveSettings(S, 'ogarioSettings');
check('text values in events are cut at 500 characters, the save keeps the whole text', events.length === 1 && events[0][2].length === 500 && JSON.parse(ctx.localStorage.getItem('ogarioSettings')).chatHideWords === long);

// ── S5 the real setSettings: validates script values, no event for the same value
const ss = cut('        setSettings(id, checked) {', '        profiling() {');
const app2 = vm.runInContext('({\n' + ss + cut('        _lmChoiceSync(name) {', '        addSliderBox(id, name') + '\n})', ctx);
app2.saveSettings = app.saveSettings;
app2._lmLoadOptSounds = function () { };
ctx.hotkeys = {};
ctx.$ = () => ({ length: 0, prop() { }, val() { }, text() { }, css() { }, show() { }, hide() { }, toggle() { }, toggleClass() { }, addClass() { }, removeClass() { }, attr() { }, on() { }, off() { }, find() { return this; }, closest() { return this; }, each() { } });
ctx.toastr = { info() { }, warning() { }, success() { } };
ctx.legendmod = {};
ctx.lmT = k => k;
ctx._lmG1tag = () => '';
if (!ctx.document) ctx.document = { getElementById: () => null };
events.length = 0;
let setThrew = null;
try { app2.setSettings('massFormat', 1.7); app2.setSettings('macroFeeding', -100); app2.setSettings('scanTrickDirections', 12); } catch (e) { setThrew = e; }
check('setSettings from a script: a number put on its range and step, an invalid choice ignored', !setThrew && S.massFormat === 2 && S.macroFeeding === 1 && S.scanTrickDirections === D.scanTrickDirections || (console.log('   ' + (setThrew && setThrew.message)), false));
const evKeys = events.map(e => e[1]);
check('setSettings: events for the values that changed only', evKeys.indexOf('scanTrickDirections') < 0 && evKeys.indexOf('macroFeeding') >= 0);
events.length = 0;
const before = S.showGrid;
app2.setSettings('showGrid', before);
check('setSettings with the current value: no event', events.length === 0);
app2.setSettings('showGrid', !before);
app2.setSettings('showGrid', before);
check('setSettings on and off: two events, the new value each time', J(events) === J([['settingsChange', 'showGrid', !before], ['settingsChange', 'showGrid', before]]));

// ── S6 what a setting really does now (real setSettings, onPlay, onSpectate, setShowFood, key handler)
const sToasts = [];
ctx.toastr = { info: t => sToasts.push(['info', t]), warning: t => sToasts.push(['warning', t]), success() { } };
/* Anti-aliasing: a reload only while it differs from what the WebGL context was made with */
ctx.drawRender = { gl: {}, _lmGlAA: true };
S.glAntialias = true;
app2.setSettings('glAntialias', false); app2.setSettings('glAntialias', true);
check('anti-aliasing off then on again: "reload" once (the context has it on), not twice', J(sToasts) === J([['info', 'game1.perf.aaReload']]));
check('anti-aliasing: a reload is pending while it differs from the context, or before any context', typeof ctx.lmGlAAPending === 'function' && ctx.lmGlAAPending() === false && (S.glAntialias = false, ctx.lmGlAAPending()) && (ctx.drawRender = { gl: null }, ctx.lmGlAAPending()));
S.glAntialias = true;
/* Mention notifications: the browser is asked only right after the player's click or key */
let asked = 0, rejectHandled = false;
ctx.Notification = { permission: 'default', requestPermission() { asked++; return { then(ok, bad) { rejectHandled = typeof bad === 'function'; ok('denied'); } }; } };
ctx.navigator = { userActivation: { isActive: false } };
S.mentionNotify = false; sToasts.length = 0;
app2.setSettings('mentionNotify', true);
check('mention notifications switched on without a click (profile auto rule, script): the browser is not asked', asked === 0 && sToasts.length === 0);
S.mentionNotify = false; ctx.navigator.userActivation.isActive = true;
app2.setSettings('mentionNotify', true);
check('switched on by the player: asked once, a refusal is told, a failed request is handled', asked === 1 && rejectHandled && J(sToasts) === J([['warning', 'game1.notif.blocked']]));
/* Auto hide food: only the food it hid comes back; food the player hid stays hidden */
ctx.legendmod = ctx.ogario = { showFood: true, _lmFoodAutoHid: false, play: true };
const F = vm.runInContext('({\n' + cut('        setShowFood() {', '        /* Show/hide HUD (Alt+H)') + cut('        onPlay() {', '        join() {') + '\n})', ctx);
F.play = F.hideMenu = F.onJoin = F.sendPlayerJoin = function () { };
S.autoHideFood = true;
F.setShowFood(); F.onPlay();
check('auto hide food on, food hidden by the player, Play: it stays hidden', ctx.ogario.showFood === false);
F.onSpectate(); app2.setSettings('autoHideFood', false);
check('then spectating and auto hide food off: still hidden', ctx.ogario.showFood === false);
S.autoHideFood = true; F.setShowFood(); F.onSpectate();
check('shown by the player, spectating hides it, Play shows it again', ctx.ogario.showFood === false && (F.onPlay(), ctx.ogario.showFood === true));
S.autoHideFood = false;
/* Held hotkeys (Scan Trick): the keyup releases what the keydown started, also when the key
 * was unbound or bound to something else while held */
ctx.keyBlind = {}; ctx.hotkeys = { Q: 'hk-scanTrick' };
const holds = [];
ctx.hotkeysCommand = { 'hk-scanTrick': { keyDown() { holds.push('down'); }, keyUp() { holds.push('up'); } }, 'hk-other': { keyDown() { }, keyUp() { holds.push('other up'); } } };
ctx.hotkeysSetup = { inputClassName: 'custom-key-in', getPressedKey: e => e.k };
ctx.application = { showMenu() { } };
ctx.addEventListener = function () { };
ctx.document.addEventListener = function () { };
vm.runInContext(cut('    var _lmHeldByCode = {};', '    var _lmMouseHeld = {};'), ctx);
const kev = k => ({ k, keyCode: k.charCodeAt(0), target: { tagName: 'CANVAS', className: '' }, preventDefault() { } });
ctx.document.onkeydown(kev('Q')); ctx.hotkeys.Q = ''; ctx.document.onkeyup(kev('Q'));
ctx.hotkeys.Q = 'hk-scanTrick'; ctx.document.onkeydown(kev('Q')); ctx.hotkeys.Q = 'hk-other'; ctx.document.onkeyup(kev('Q'));
check('scan trick key unbound or rebound while held: its keyup still ends the scan trick (not the new command)', J(holds) === J(['down', 'up', 'down', 'up']));

// ── S4 the profile count, live
const dom = { nick: true, skins: [] };
const box = sel => {
  const o = { length: 0, append() { }, remove() { }, closest() { return o; }, val() { }, addClass() { }, removeClass() { }, colorpicker() { }, css() { } };
  if (sel === '#nick') o.length = dom.nick ? 1 : 0;
  if (sel === '#skins') { o.length = 1; o.append = h => { const m = /id="(profile-\d+)"/.exec(h); if (m) dom.skins.push(m[1]); }; }
  const pm = /^#(profile-\d+)$/.exec(sel);
  if (pm) { o.length = dom.skins.indexOf(pm[1]) >= 0 ? 1 : 0; o.closest = () => ({ remove() { const i = dom.skins.indexOf(pm[1]); if (i >= 0) dom.skins.splice(i, 1); } }); }
  return o;
};
ctx.$ = box;
ctx.ogarcopythelb = {};
const P = vm.runInContext('({\n' + cut('        loadProfiles() {', '        marqueeSkins(t) {') + '\n})', ctx);
P.saveSettings = app.saveSettings;
ctx.application = P;
P.setSkinPreview = function () { };
P.profiling = function () { };
P.setProfileboxShadow = function () { };
P._lmProfileTools = function () { };
P.setProfile = function () { this.setProfileCalls = (this.setProfileCalls || 0) + 1; };
P.saveProfileFields = function () { this.savedFields = (this.savedFields || 0) + 1; };
const named = n => Array.from({ length: n }, (_, i) => ({ nick: 'P' + i, clanTag: 'T', skinURL: 'https://i.imgur.com/s' + i + '.png', color: '#00ff00' }));
const nicks = () => vm.runInContext('profiles', ctx).map(p => p.nick);
const extraNicks = () => (JSON.parse(ctx.localStorage.getItem('ogarioPlayerProfilesExtra') || '[]')).map(p => p.nick);
const range = (a, b) => Array.from({ length: b - a }, (_, i) => 'P' + (a + i));
ctx.localStorage.removeItem('ogarioPlayerProfilesExtra');
ctx.localStorage.setItem('ogarioPlayerProfiles', JSON.stringify(named(15)));
ctx.localStorage.setItem('ogarioSelectedProfile', '12');
ctx.localStorage.setItem('ogarioSelectedOldProfile', '3');
S.profileNumber = 15;
P.loadProfiles();
dom.skins = nicks().map((_, i) => 'profile-' + i);
check('load: 15 profiles, profile 12 selected', nicks().length === 15 && P.selectedProfile === 12 && P.selectedOldProfile === 3);
const setCount = n => { S.profileNumber = n; P.setProfileCount(); };
setCount(30);
check('15 -> 30: 15 new default profiles, the list shows 30, the selection stays', nicks().length === 30 && J(nicks().slice(0, 15)) === J(range(0, 15)) && nicks()[29] === 'Profile #30' && dom.skins.length === 30 && P.selectedProfile === 12);
check('the typed nick/skin were kept before the change', P.savedFields >= 1);
vm.runInContext('profiles', ctx).forEach((p, i) => { if (i >= 15) { p.nick = 'P' + i; p.skinURL = 'https://i.imgur.com/s' + i + '.png'; } });
P.selectedProfile = 25; P.selectedOldProfile = 3;
setCount(10);
check('30 -> 10: 10 profiles, the other 20 kept in order (not deleted)', J(nicks()) === J(range(0, 10)) && J(extraNicks()) === J(range(10, 30)) && dom.skins.length === 10);
check('the selected profile 25 is cut off: profile 0 is used meanwhile, player 2 (3) stays', P.selectedProfile === 0 && P.selectedOldProfile === 3);
check('the exported list has all 30 (profiles + kept ones, as exportSettings writes it)', J(nicks().concat(extraNicks())) === J(range(0, 30)));
setCount(30);
check('10 -> 30: the 20 come back in order with their skins, profile 25 selected again', J(nicks()) === J(range(0, 30)) && vm.runInContext('profiles', ctx)[25].skinURL.indexOf('s25') > 0 && extraNicks().length === 0 && P.selectedProfile === 25 && P.selectedOldProfile === 3 && dom.skins.length === 30);
check('the list in storage follows', JSON.parse(ctx.localStorage.getItem('ogarioPlayerProfiles')).length === 30);
setCount(10);
P.selectProfile = null;
P.selectedProfile = 5; /* the player picks another profile while 25 is hidden */
setCount(30);
check('a profile the player picked meanwhile stays selected', P.selectedProfile === 5);
setCount(54);
check('30 -> 54: new default profiles after the kept ones', nicks().length === 54 && nicks()[30] === 'Profile #31' && J(nicks().slice(0, 30)) === J(range(0, 30)));
const calls = P.setProfileCalls;
setCount(54);
S.profileNumber = 7; P.setProfileCount();
S.profileNumber = 12.5; P.setProfileCount();
check('same count or an impossible count: nothing happens', nicks().length === 54 && P.setProfileCalls === calls);
/* export at 10 then import: the import writes the whole list and drops the kept ones; the load
 * cuts it to the count again and a higher count brings them all back */
setCount(10);
const exported = nicks().concat(extraNicks());
ctx.localStorage.setItem('ogarioPlayerProfiles', JSON.stringify(vm.runInContext('profiles', ctx).concat(JSON.parse(ctx.localStorage.getItem('ogarioPlayerProfilesExtra')))));
ctx.localStorage.removeItem('ogarioPlayerProfilesExtra');
vm.runInContext('profiles = []', ctx);
P.loadProfiles();
dom.skins = nicks().map((_, i) => 'profile-' + i);
check('import + load at 10: 10 shown, the others kept', exported.length === 54 && nicks().length === 10 && extraNicks().length === 44);
setCount(54);
check('raised again after the import: every profile back in its place', J(nicks()) === J(exported));
/* the old Skin collections window's links move into the profiles on the load, once */
setCount(10);
ctx.localStorage.setItem('lmSkinCollections', J({ v: 1, folders: ['Fun'], items: { 'https://i.imgur.com/s3.png': { f: '', t: [], s: true }, 'https://k.example/new.png': { f: 'Fun', t: [], s: false } } }));
vm.runInContext('profiles = []', ctx);
P.loadProfiles();
const allP = () => vm.runInContext('profiles', ctx).concat(JSON.parse(ctx.localStorage.getItem('ogarioPlayerProfilesExtra') || '[]'));
const stored = JSON.parse(ctx.localStorage.getItem('ogarioPlayerProfiles'));
check('skin collections on load: the new link is a hidden profile, the kept favourite stars its profile, the old key is gone',
  ctx.localStorage.getItem('lmSkinCollections') === null && allP().filter(p => p.skinURL === 'https://k.example/new.png' && p.nick === 'Fun').length === 1 &&
  stored[3].fav === true && allP().length === 55);
P.loadProfiles();
check('skin collections on load: a second load adds nothing', allP().length === 55);
ctx.localStorage.setItem('lmSkinCollections', '{broken');
P.loadProfiles();
check('skin collections on load: a broken value is just removed', ctx.localStorage.getItem('lmSkinCollections') === null && allP().length === 55);

/* ── Settings dimmed while they have no effect (the real refresh of the menu's dependency list):
 * every row is a fake element; a dimmed one gets lm-dep-off and names the switch it needs */
const depSrc = cut('var DEPS = {', 'app._lmDepRefresh = refresh;');
const rows = {};
const row = k => rows[k] || (rows[k] = { cls: new Set(), at: {} });
const wrap = it => ({ length: 1, hasClass: c => it.cls.has(c), addClass(c) { it.cls.add(c); return this; }, removeClass(c) { it.cls.delete(c); return this; },
  attr(k, v) { if (v === undefined) return it.at[k]; it.at[k] = v; return this; }, removeAttr(k) { delete it.at[k]; return this; } });
const fake$ = x => (x && x._row ? { closest: s => (s === '#og-options' ? { length: 1 } : wrap(x._row)) } : { on() { }, length: 0 });
const fakeDoc = { getElementById: id => (id === 'lm-dep-style' ? {} : { _row: row(id.replace(/-slider$/, '')) }), createElement: () => ({}), head: { appendChild() { } } };
const depRefresh = vm.runInContext('(function (app, $, document, lmT) {' + depSrc + 'return refresh; })', ctx)(
  { _lmMenuText: k => (k === 'lmDepNeeds' ? 'Needs' : '<b>' + k + '</b>') }, fake$, fakeDoc, k => k);
const dmsDep = vm.runInContext('defaultmapsettings', ctx);
const depWhy = k => (rows[k] && rows[k].cls.has('lm-dep-off') ? rows[k].at['data-lm-why'] : '');
const depRun = set => { Object.assign(dmsDep, D, set); depRefresh(); };
depRun({ scanTrick: false });
check('Scan trick off: its rounding, LMB-only and both distances are dimmed and need Scan trick',
  ['scanTrickRounded', 'scanTrickOnlyWhileLMB', 'scanTrickDistance', 'scanTrickRoundedDistance'].every(k => depWhy(k) === 'Needs: scanTrick') || (console.log('   ' + J(['scanTrickRounded', 'scanTrickOnlyWhileLMB', 'scanTrickDistance', 'scanTrickRoundedDistance'].map(depWhy))), false));
depRun({ scanTrickRounded: false });
check('Scan trick on, rounding off: LMB-only and the rounded distance need the rounding, the other distance works',
  depWhy('scanTrickOnlyWhileLMB') === 'Needs: scanTrickRounded' && depWhy('scanTrickRoundedDistance') === 'Needs: scanTrickRounded' && depWhy('scanTrickDistance') === '' && depWhy('scanTrickRounded') === '');
depRun({ showMapBorders: false, rainbowMapBorders: true });
check('Map borders off: rainbow borders and their speed are dimmed (only the border uses them)',
  depWhy('rainbowMapBorders') === 'Needs: showMapBorders' && depWhy('rainbowBorderSpeed') === 'Needs: showMapBorders');
depRun({ rainbowMapBorders: false });
check('rainbow borders off: only their speed is dimmed', depWhy('rainbowMapBorders') === '' && depWhy('rainbowBorderSpeed') === 'Needs: rainbowMapBorders');
depRun({ mbRingsP1: false, mbRingsP2: true });
check('multibox ring of player 1 off: its size dimmed, player 2 size not', depWhy('mbRingSizeP1') === 'Needs: mbRingsP1' && depWhy('mbRingSizeP2') === '');
depRun({});
check('defaults: none of these dimmed, and every switch of the list is a real setting',
  ['scanTrickRounded', 'scanTrickOnlyWhileLMB', 'scanTrickDistance', 'scanTrickRoundedDistance', 'rainbowMapBorders', 'mbRingSizeP2'].every(k => depWhy(k) === '') &&
  Object.keys(rows).every(k => k in D) || (console.log('   not settings: ' + Object.keys(rows).filter(k => !(k in D)).join(', ')), false));

console.log(fail ? fail + ' settings check(s) FAILED' : 'all settings checks passed');
process.exit(fail ? 1 : 0);
