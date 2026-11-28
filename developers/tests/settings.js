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
vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
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
/* removed or merged settings (kill feed, the event countdown's hide option, HUD helper cell panel, the removed 25 FPS menu cap, the
 * automatic Performance mode's own target / message / resolution options, the size symbols in Relative mass) */
const GONE = ['hudMergeCountdown', 'menuFpsCap', 'adaptivePerfTarget', 'adaptivePerfToasts', 'adaptivePerfRes', 'hudCellPanel', 'killFeed', 'a11yIndicators', 'hideEventBanner',
  /* options that tuned a detail: the rainbow border speed (fixed at the original 5), the chat word
   * filter and the Split prediction switch (always part of the cursor line) */
  'rainbowBorderSpeed', 'chatHideWords', 'splitPrediction',
  /* line split: its own delay (the split macros' one is used) and its aim line switch (always drawn) */
  'lineSplitDelay', 'lineSplitGuide',
  /* the stopwatch above the minimap (Settings > Stats "Show stopwatch") */
  'showStopwatch',
  /* Settings > Performance and network: Performance mode and its automatic choice */
  'performanceMode', 'adaptivePerf',
  /* Record replays: every game is recorded (only the latest one is kept in memory) */
  'recordReplays'];
/* restored (owner): the 16 pieces sounds, the triple split range, the leaderboard bot collapse and
 * the chat #id are settings again, off by default, and a saved value is read */
check('x16Sound / non16Sound / tripleSplitRange / lbHideBots / chatShowId: settings again, off by default, true kept', ['x16Sound', 'non16Sound', 'tripleSplitRange', 'lbHideBots', 'chatShowId'].every(k => D[k] === false && V(k, true) === true));
check('removed settings are no settings any more (a saved value is ignored)', GONE.every(k => !(k in D) && !(k in SCH) && V(k, true) === undefined && V(k, 30) === undefined));
check('line split: 2-4 splits per press, a saved 1 is read as 2', V('lineSplitCount', 1) === 2 && V('lineSplitCount', 4) === 4 && V('lineSplitCount', 9) === 4 && SCH.lineSplitCount[0] === 2);
check('gamepadMoveCurve 100 -> 3', V('gamepadMoveCurve', 100) === 3);
check('massFormat 1.7 -> 2 (a mode, not a fraction)', V('massFormat', 1.7) === 2);
check('fractional step values snap to the slider step', V('zoomSpeedValue2', -0.134) === -0.13 && V('volMaster', 0.123) === 0.12 && V('a11yTextScale', 1.12) === 1.1 && V('a11yHudTextScale', 1.12) === 1.1 && V('gamepadTrigger', 0.93) === 0.95);
check('the top of a range that is not a whole number of steps stays reachable (gamepadTrigger 0.95)', V('gamepadTrigger', 0.95) === 0.95 && V('gamepadTrigger', 5) === 0.95);
check('zero where the range allows it', V('lineSplitHold', 0) === 0 && V('zoomSpeedValue2', 0) === 0 && V('volMaster', 0) === 0);
check('NaN, Infinity, -Infinity refused (the default stays)', [NaN, Infinity, -Infinity].every(x => V('animation', x) === undefined && V('volMaster', x) === undefined));
check('numeric strings from old saves converted and fitted, other strings refused', V('fpsLimit', '60') === 60 && V('fpsLimit', ' 65 ') === 70 && V('fpsLimit', '') === undefined && V('fpsLimit', '6O') === undefined && V('fpsLimit', true) === undefined);
/* Scan Trick is only its key: none of its old settings is a setting any more */
const SCAN_OLD = ['scanTrick', 'scanTrickRounded', 'scanTrickOnlyWhileLMB', 'scanTrickDirections', 'scanTrickDistance', 'scanTrickRoundedDistance', 'scanTrickStatus'];
check('no Scan Trick setting is left (default, schema, value)', SCAN_OLD.every(k => !(k in D) && !(k in SCH) && V(k, D[k] === undefined ? 1 : D[k]) === undefined && V(k, true) === undefined) || (console.log('   left: ' + SCAN_OLD.filter(k => k in D || k in SCH).join(', ')), false));
check('the old toast position (positionClass, no menu row) is no setting: the HUD editor places the popups', V('positionClass', 'toast-top-right') === undefined);
check('settings without a slider have a range too (domination rate)', V('dominationRate', 4 / 3) === 4 / 3 && V('dominationRate', 0) === 1 && V('dominationRate', 9) === 4 && V('dominatedRate', 0.6) === 0.6);
check('booleans: "true"/"false" converted, other values refused', V('showMass', 'false') === false && V('showMass', 1) === undefined && V('showMass', true) === true);
check('free text kept, unknown keys refused', V('messageSound', 'a,b') === 'a,b' && V('messageSound', 5) === undefined && V('noSuchSetting', 1) === undefined && V('__proto__', 1) === undefined);
check('the old multibox count 3-4 is still read (ensureMbSlots maps it to 2)', V('multiboxAmount', 4) === 4 && V('multiboxAmount', 9) === 4);

// ── S1 the import path of the settings file (the real loop of importSettings)
const impLoop = cut("                    var _impS = importValue.ogarioSettings;", "                if (Object.prototype.hasOwnProperty.call(importValue, 'ogarioThemeSettings')");
const imported = { ogarioSettings: { macroFeeding: -100, fpsLimit: 'x', massFormat: 1.7, showMass: 'false', positionClass: 'toast-middle', scanTrickDirections: 8, scanTrickDistance: 20000, scanTrickRounded: false, nope: 1, profileNumber: 30, animation: Infinity } };
vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(imported);
/* shortMass: the copy that follows Mass format (12.3k = 2) */
check('import: values fitted, unusable ones dropped (their defaults apply)', J(imported.ogarioSettings) === J({ macroFeeding: 1, massFormat: 2, showMass: false, profileNumber: 30, shortMass: true }));
const importedV = { ogarioSettings: { videoSkinSoundLevel: 0.9, volVideo: 0.5 } };
vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(importedV);
check('import: an old export with the second video volume keeps its loudness', J(importedV.ogarioSettings) === J({ videoSkinSoundLevel: 0.45 }));
const importedR = { ogarioSettings: { recordReplays: false, showMass: false } };
vm.runInContext('(function (importValue) {\n' + impLoop.replace(/\}\s*$/, '') + '\n})', ctx)(importedR);
check('import: an old recordReplays false is dropped quietly (every game is recorded)', J(importedR.ogarioSettings) === J({ showMass: false }));

// ── S1 loading (the real loadSettings): a damaged save is fitted, the rest kept
const app = vm.runInContext('({\n' + cut('        loadSettings() {', '        exportSettings() {') + '\n})', ctx);
ctx.ogario = {};
const saved = Object.assign({}, D, { fpsLimit: 145, massFormat: 1.7, macroFeeding: 3, hudBlur: 3, showMass: !D.showMass, positionClass: 'toast-middle', scanTrickDirections: 8, scanTrickDistance: 20000, scanTrickRounded: false, messageSound: 'spam.mp3' });
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(saved));
app.loadSettings();
const S = ctx.defaultmapsettings;
check('load: off-range/off-step values fitted, invalid choice keeps the default, valid values kept', S.fpsLimit === 150 && S.massFormat === 2 && S.macroFeeding === 3 && S.showMass === !D.showMass && S.positionClass === D.positionClass && S.messageSound === 'spam.mp3');
check('HUD background blur: off (0) by default, 0-8 px, a saved value is read again', D.hudBlur === 0 && J(SCH.hudBlur) === J([0, 8, 1]) && S.hudBlur === 3 && V('hudBlur', 9) === 8);
/* applyHudBlur (the real method): a style only while the blur is above 0 */
{
  const hb = { head: { kids: [], appendChild(e) { this.kids.push(e); e.parentNode = this; }, removeChild(e) { this.kids.splice(this.kids.indexOf(e), 1); } } };
  hb.getElementById = id => hb.head.kids.find(e => e.id === id) || null;
  hb.createElement = () => ({ id: '', textContent: '' });
  const hctx = vm.createContext({ Math, document: hb, defaultmapsettings: { hudBlur: 0 } });
  const A = vm.runInContext('({\n' + cut('        applyHudBlur() {', '        displayTime() {') + '\n})', hctx);
  A.applyHudBlur();
  const off = hb.head.kids.length === 0;
  hctx.defaultmapsettings.hudBlur = 4; A.applyHudBlur();
  const on = hb.head.kids.length === 1 && /blur\(4px\)/.test(hb.head.kids[0].textContent);
  hctx.defaultmapsettings.hudBlur = 0; A.applyHudBlur();
  check('HUD background blur: no style at 0, a 4 px backdrop blur at 4, gone again at 0', off && on && hb.head.kids.length === 0);
}
check('load: old saved Scan Trick settings are skipped quietly', SCAN_OLD.every(k => !(k in S)) || (console.log('   kept: ' + SCAN_OLD.filter(k => k in S).join(', ')), false));
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
// ── the virus pop / eat sounds are the virus sound; the leaderboard pass toast is back (off by default)
check('removed sound settings are no settings any more', ['virusPopSound', 'virusEatSound'].every(k => !(k in D) && !(k in SCH) && V(k, true) === undefined));
check('the leaderboard pass toast is a setting again, off by default', D.lbPassToast === false && V('lbPassToast', true) === true);
const lfold = (o) => { ctx._f = o; vm.runInContext('lmFoldLegacySettings(_f)', ctx); return ctx._f; };
check('fold: pop or eat sound on turns the virus sound on', lfold({ virusSound: false, virusPopSound: true }).virusSound === true && lfold({ virusEatSound: true }).virusSound === true);
check('fold: both off keep the virus sound as it was, the old keys go', J(lfold({ virusSound: false, virusPopSound: false, virusEatSound: false })) === J({ virusSound: false }) && J(lfold({ virusSound: true, virusPopSound: false })) === J({ virusSound: true }));
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { virusSound: false, virusPopSound: true, audioDucking: true, volNotifications: 0.2, lbPassToast: true })));
app.loadSettings();
const reSaved2 = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
check('load: an old save with the pop sound on has the virus sound on, the old keys are not loaded, the pass toast is read', S.virusSound === true && !('virusPopSound' in reSaved2) && !('virusPopSound' in S) && S.lbPassToast === true);
S.lbPassToast = D.lbPassToast;
/* the pass toast itself: the real lines of the leaderboard update, a climb of 1-3 places while playing */
{
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
  const a = src.indexOf('            /* optional: toast when you move up 1-3 places while playing'), b = src.indexOf('            application.displayLeaderboard(teamText, text);', a);
  const toasts = [];
  const pctx = { defaultmapsettings: { lbPassToast: true }, window: { toastr: true }, toastr: { info: m => toasts.push(m) }, application: { escapeHTML: s => s } };
  vm.createContext(pctx);
  const step = (pos, play) => { pctx.me.playerPosition = pos; pctx.me.play = play !== false; vm.runInContext('(function () { ' + src.slice(a, b) + ' }).call(me)', pctx); };
  pctx.me = { leaderboard: [{ nick: 'A' }, { nick: 'B' }, { nick: 'C' }, { nick: 'D' }, { nick: 'E' }, { nick: 'F' }, { nick: 'G' }] };
  step(6); step(5); step(5); step(1); step(3, false); step(2);
  check('pass toast: one toast per climb of 1-3 places while playing (not for a jump of 4, not right after not playing)', a > 0 && b > a && toasts.length === 1 && toasts[0] === '\u25B2 #5 (F)');
  pctx.defaultmapsettings.lbPassToast = false; step(6); step(5);
  check('pass toast off: nothing', toasts.length === 1);
}
check('sound mixer: the notification sounds volume (1) and audio ducking (off) are settings again, a saved value is read', D.volNotifications === 1 && D.audioDucking === false && J(SCH.volNotifications) === J([0, 1, 0.01]) && S.audioDucking === true && S.volNotifications === 0.2);
vm.runInContext(cut('/* Settings > Sounds: a volume setting is a number', 'function checkIfPlayerIsInView'), ctx);
S.volMaster = 0.5; S.volChat = 0.4; S.volGameplay = 1;
check('sound volume: own volume x master; other sounds the master only; video level x master', Math.abs(ctx.lmSoundVolume('volChat') - 0.2) < 1e-12 && ctx.lmSoundVolume('volGameplay') === 0.5 && ctx.lmSoundVolume('') === 0.5 && Math.abs(ctx._lmVideoVol(0.8) - 0.4) < 1e-12);
S.volMaster = 'x'; S.volChat = 7;
check('sound volume: a bad value counts as 1, kept inside 0..1', ctx.lmSoundVolume('volChat') === 1 && ctx._lmVideoVol(3) === 1 && ctx._lmVideoVol(NaN) === 0);
{
  /* the real playSound: through the mixer module when it is loaded (its channel, then ducking), else the
   * channel's volume x master; scripts' sounds are the notifications channel */
  const psAt = main.search(/\n {8}playSound\(audio\) \{\r?\n/) + 1, psEnd = main.indexOf('        /* ─── §4.20 Targeting', psAt);
  const P = vm.runInContext('({\n' + main.slice(psAt, psEnd) + '\n})', ctx);
  const au = () => ({ volume: 1, currentTime: 5, pause() { }, play() { this.played = true; return Promise.resolve(); } });
  P.messageSound = au(); P.commandSound = au(); P.virusSoundurl = au(); P._lmOptSoundCache = { x16: au() };
  const chans = [P.messageSound, P.commandSound, P.virusSoundurl, P._lmOptSoundCache.x16, au()].map(x => P._lmSoundChannel(x));
  S.volMaster = 1; S.volChat = 0.5; S.volNotifications = 0.25;
  ctx.LMNotifications = undefined;
  const a1 = au(), a2 = P.messageSound;
  P.playSound(a1); P.playSound(a2);
  const noMod = a1.volume === 0.25 && a2.volume === 0.5 && a1.played && a1.currentTime === 0;
  const asked = [], ducked = [];
  ctx.LMNotifications = { soundVolume(c) { asked.push(c); return 0.7; }, duckPlayback(a, c, pr) { ducked.push([c, !!(pr && pr.then)]); }, videoVolume(v) { return v / 2; } };
  const a3 = P.commandSound; P.playSound(a3);
  const withMod = a3.volume === 0.7 && J(asked) === J(['commands']) && J(ducked) === J([['commands', true]]) && ctx._lmVideoVol(0.8) === 0.4;
  ctx.LMNotifications = undefined; S.volChat = 1; S.volNotifications = 1;
  check('sound mixer: channels chat / commands / gameplay / notifications; without the module the channel volume x master, with it the mixer and ducking', J(chans) === J(['chat', 'commands', 'gameplay', 'gameplay', 'notifications']) && noMod && withMod);
}
/* the clock format option is gone: a saved format is skipped and the clock shows the browser's
 * date and time (its format before the option existed) */
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { timeFormat: 2 })));
app.loadSettings();
check('timeFormat is no setting: refused, and a saved value is skipped on load', !('timeFormat' in D) && V('timeFormat', 2) === undefined && !('timeFormat' in S));
{
  const src = cut('displayTime() {', '/* The clock has a fixed top');
  const cctx = { defaultmapsettings: { showTime: true, timeFormat: 2 }, $() { return { hide() { } }; }, setInterval() { return 1; }, clearInterval() { } };
  cctx.Date = function () { return { toLocaleString: () => 'DATE+TIME', toLocaleTimeString: () => 'TIME', getHours: () => 1, getMinutes: () => 2, getSeconds: () => 3 }; };
  vm.createContext(cctx);
  const clock = vm.runInContext('({' + src.trim().replace(/,\s*$/, '') + '})', cctx);
  clock.timeHUD = {}; clock._lmClockClear = function () { };
  clock.displayTime();
  check('clock: one format, the browser date and time, also with an old saved format', clock.timeHUD.textContent === 'DATE+TIME');
}
/* the all-time personal bests are always on: the old switch is no setting, a saved value of it is skipped */
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { recordReplays: false })));
app.loadSettings();
check('recordReplays is no setting: a saved false is skipped on load', !('recordReplays' in D) && !('recordReplays' in S));
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { personalBests: false })));
app.loadSettings();
check('personalBests is no setting: refused, and a saved value is skipped on load', !('personalBests' in D) && V('personalBests', true) === undefined && !('personalBests' in S));
/* "Zoom glide speed" is gone: a saved value is skipped and the zoom glides as originally
 * ((9*scale + target)/10 per frame at 60 fps, the same speed at other refresh rates) */
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { zoomSmooth: 40 })));
app.loadSettings();
check('zoomSmooth is no setting: refused, and a saved value is skipped on load', !('zoomSmooth' in D) && !('zoomSmooth' in SCH) && V('zoomSmooth', 40) === undefined && !('zoomSmooth' in S));
{
  const src = cut('setScale(size, fit, unitPlaying) {', 'LM.viewScale = this.scale;') + 'LM.viewScale = this.scale; }';
  const zctx = { defaultmapsettings: { zoomSmooth: 40 }, LM: {} };
  vm.createContext(zctx);
  const cam = vm.runInContext('({' + src + '})', zctx);
  cam.getTargetScale = () => 2; cam.scale = 1; cam._lmFrameF = 1;
  cam.setScale(0, 1);
  const at60 = cam.scale;
  cam.scale = 1; cam._lmFrameF = 0.5; cam.setScale(0, 1); cam.setScale(0, 1);
  check('zoom glide: (9*scale + target)/10 per 60 fps frame whatever an old save had, the same over two 120 fps frames', Math.abs(at60 - 1.1) < 1e-12 && Math.abs(cam.scale - 1.1) < 1e-12 && zctx.LM.viewScale === cam.scale);
}
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { a11yIndicators: true, hudRelativeMass: false, menuFpsCap: true, massLossAlert: true, massLossPct: 40, hudMoveDir: true, hudEdgeThreats: true, adaptivePerfTarget: 120, hudCellPanel: true, killFeed: true, hideEventBanner: true, showStopwatch: true })));
app.loadSettings();
const reSaved3 = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
/* the size symbols were removed, not merged: an old saved value changes nothing (Relative mass stays off) */
check('load: an old save with the size symbols on keeps Relative mass off, removed settings ignored', S.hudRelativeMass === false && !('a11yIndicators' in S) && reSaved3.hudRelativeMass !== true && GONE.every(k => !(k in S)));
S.hudRelativeMass = D.hudRelativeMass;
/* the mass-loss alert and the movement / edge arrows are back: off by default, saved values read again */
check('load: the mass-loss alert, its threshold and the HUD arrows are read again (off by default)', S.massLossAlert === true && S.massLossPct === 40 && S.hudMoveDir === true && S.hudEdgeThreats === true &&
  D.massLossAlert === false && D.massLossPct === 30 && D.hudMoveDir === false && D.hudEdgeTeammates === false && D.hudEdgeThreats === false && V('massLossPct', 5) === 10);
['massLossAlert', 'massLossPct', 'hudMoveDir', 'hudEdgeThreats'].forEach(k => { S[k] = D[k]; });
/* "Optimized mass (+/-2%) OR Merge timer (BETA)" is back (the original seconds merge timer, ogario/mergetimer.js):
 * on by default, and a saved off is read again; the agent-made Merge countdown stays removed */
check('optimizedMass is a setting again, on by default', D.optimizedMass === true && V('optimizedMass', false) === false);
check('fold: optimizedMass is kept as saved, Merge countdown is not turned on', J(lfold({ optimizedMass: false, mergeRings: false })) === J({ optimizedMass: false, mergeRings: false }));
/* an older set with the timer and the rings both on keeps the timer (one or the other) */
check('fold: optimizedMass off with the merge rings on (or not saved) turns the rings off; timer off leaves them',
  J(lfold({ optimizedMass: false, mergeRings: true })) === J({ optimizedMass: false, mergeRings: false }) &&
  J(lfold({ optimizedMass: false })) === J({ optimizedMass: false, mergeRings: false }) &&
  J(lfold({ optimizedMass: true, mergeRings: true })) === J({ optimizedMass: true, mergeRings: true }) &&
  J(lfold({ mergeRings: true })) === J({ mergeRings: true }));
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(Object.assign({}, saved, { optimizedMass: false, mergeRings: true, hudMergeCountdown: true })));
app.loadSettings();
check('load: a saved optimizedMass off is read again (the rings saved on go off), hudMergeCountdown ignored', S.optimizedMass === false && S.mergeRings === false && !('hudMergeCountdown' in S));
S.optimizedMass = D.optimizedMass; S.mergeRings = D.mergeRings;
/* the loaded values of the checks below */
ctx.localStorage.setItem('ogarioSettings', JSON.stringify(saved));
app.loadSettings();

// ── S5 one change path: saveSettings announces each changed setting once
events.length = 0;
app.saveSettings(S, 'ogarioSettings');
check('a save with nothing changed sends no event', events.length === 0);
S.macroFeeding = 4; S.showMass = !S.showMass;
app.saveSettings(S, 'ogarioSettings');
check('one event per changed setting, with its new value', J(events) === J([['settingsChange', 'showMass', S.showMass], ['settingsChange', 'macroFeeding', 4]]));
events.length = 0;
app.saveSettings(S, 'ogarioSettings');
app.saveSettings(S, 'ogarioSettings');
check('saving again (a slider released after its debounced save) sends nothing', events.length === 0);
check('the save still writes the settings', JSON.parse(ctx.localStorage.getItem('ogarioSettings')).macroFeeding === 4);
app.saveSettings([{ nick: 'x' }], 'ogarioPlayerProfiles');
check('other storage keys are saved as before, without events', events.length === 0 && ctx.localStorage.getItem('ogarioPlayerProfiles') === '[{"nick":"x"}]');
/* a slider dragged 1 -> 2 -> 3 -> 2 (input events) then saved once: one event, the final value */
S.macroFeeding = 1; S.macroFeeding = 2; S.macroFeeding = 3; S.macroFeeding = 2;
app.saveSettings(S, 'ogarioSettings');
check('a coalesced slider change is one event with the final value', J(events) === J([['settingsChange', 'macroFeeding', 2]]));
events.length = 0;
S.macroFeeding = 1; S.macroFeeding = 2;
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
ctx._onEmit = d => { if (d.key === 'showMass') { ctx._onEmit = null; S.macroFeeding = 3; app.saveSettings(S, 'ogarioSettings'); } };
S.showMass = !S.showMass; S.macroFeeding = 1;
app.saveSettings(S, 'ogarioSettings');
check('nested change of a setting the same save changed: its last event is its value now', J(events.map(e => e[1] + '=' + e[2])) === J(['showMass=' + S.showMass, 'macroFeeding=3']) || (console.log('   ' + J(events)), false));
events.length = 0;
app.saveSettings(S, 'ogarioSettings');
check('...and nothing left to announce afterwards', events.length === 0);
events.length = 0;
ctx.LMEvents.listen = false;
S.macroFeeding = 5;
app.saveSettings(S, 'ogarioSettings');
ctx.LMEvents.listen = true;
app.saveSettings(S, 'ogarioSettings');
check('without listeners nothing is sent, and the change is not sent later either', events.length === 0);
/* a full storage: the change is in effect, so it is announced; the error reaches the caller as before.
 * S09: the player is told once that it is not saved, and the next save stores everything */
const realSet = ctx.localStorage.setItem, toasts = [];
ctx.toastr = { warning(t) { toasts.push(t); } };
ctx.lmT = k => k;
ctx.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
S.macroFeeding = 6;
let threw = false;
try { app.saveSettings(S, 'ogarioSettings'); } catch (e) { threw = true; }
check('a full storage: the error is thrown as before and the change still announced', threw && events.length === 1 && events[0][1] === 'macroFeeding' && events[0][2] === 6);
check('a full storage: the player is warned that it is not saved', toasts.length === 1 && ctx._lmSettingsUnsaved === true);
S.showGrid = !S.showGrid;
try { app.saveSettings(S, 'ogarioSettings'); } catch (e) { }
check('still full: no second warning for the next save', toasts.length === 1);
ctx.localStorage.setItem = realSet;
S.macroFeeding = 5;
app.saveSettings(S, 'ogarioSettings');
const reS = JSON.parse(ctx.localStorage.getItem('ogarioSettings'));
check('storage works again: the next save stores every change, no longer unsaved', reS.macroFeeding === 5 && reS.showGrid === S.showGrid && ctx._lmSettingsUnsaved === false);
ctx.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
S.macroFeeding = 6;
try { app.saveSettings(S, 'ogarioSettings'); } catch (e) { }
ctx.localStorage.setItem = realSet;
check('full again later: warned again', toasts.length === 2);
delete ctx.toastr; delete ctx.lmT;
events.length = 0;
const long = 'x'.repeat(800);
S.messageSound = long;
app.saveSettings(S, 'ogarioSettings');
check('text values in events are cut at 500 characters, the save keeps the whole text', events.length === 1 && events[0][2].length === 500 && JSON.parse(ctx.localStorage.getItem('ogarioSettings')).messageSound === long);
S.messageSound = D.messageSound;

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
try { app2.setSettings('massFormat', 1.7); app2.setSettings('macroFeeding', -100); app2.setSettings('positionClass', 'toast-middle'); } catch (e) { setThrew = e; }
check('setSettings from a script: a number put on its range and step, an invalid choice ignored', !setThrew && S.massFormat === 2 && S.macroFeeding === 1 && S.positionClass === D.positionClass || (console.log('   ' + (setThrew && setThrew.message)), false));
const evKeys = events.map(e => e[1]);
check('setSettings: events for the values that changed only', evKeys.indexOf('positionClass') < 0 && evKeys.indexOf('macroFeeding') >= 0);
events.length = 0;
const before = S.showGrid;
app2.setSettings('showGrid', before);
check('setSettings with the current value: no event', events.length === 0);
app2.setSettings('showGrid', !before);
app2.setSettings('showGrid', before);
check('setSettings on and off: two events, the new value each time', J(events) === J([['settingsChange', 'showGrid', !before], ['settingsChange', 'showGrid', before]]));
/* the seconds merge timer (optimizedMass off) and the merge rings are one or the other; a switch
 * press first sends its old value, which changes nothing */
{
  const om = S.optimizedMass, mr = S.mergeRings;
  S.optimizedMass = true; S.mergeRings = true;
  app2.setSettings('optimizedMass', true);
  app2.setSettings('optimizedMass', false);
  const a = [S.optimizedMass, S.mergeRings];
  app2.setSettings('mergeRings', false);
  app2.setSettings('mergeRings', true);
  const b = [S.optimizedMass, S.mergeRings];
  app2.setSettings('optimizedMass', true);
  app2.setSettings('mergeRings', false);
  const c = [S.optimizedMass, S.mergeRings];
  check('merge timer on turns the merge rings off, the rings on turn the timer off, off leaves the other', J(a) === J([false, false]) && J(b) === J([true, true]) && J(c) === J([true, false]));
  S.optimizedMass = om; S.mergeRings = mr;
}

// ── S08b / S15a the real preset row: one save per preset and per Undo; an import's copy is the one Undo uses
{
  const mk = (html) => {
    const o = { html, handlers: [], shown: null };
    ['append', 'appendTo', 'text', 'attr'].forEach(f => { o[f] = function (a) { return f === 'attr' && typeof a === 'string' && arguments.length === 1 ? undefined : o; }; });
    o.toggle = v => { o.shown = !!v; return o; }; o.show = () => { o.shown = true; return o; }; o.hide = () => { o.shown = false; return o; };
    o.on = function () { o.handlers.push(arguments[arguments.length - 1]); return o; };
    return o;
  };
  const made = [];
  const old$ = ctx.$, oldDoc = ctx.document;
  ctx.$ = x => { if (x && x._preset) return { attr: () => x._preset }; const o = mk(String(x)); made.push(o); return o; };
  ctx.document = { getElementById: () => ({}) };
  ctx.textLanguage = {};
  ctx.confirm = () => true;
  ctx.application = app2;
  ctx.box = mk('box');
  const pre = cut('                var _lmTx = function (k, en) {', '                /* the NEW badges');
  vm.runInContext('(function () {\n' + pre + '\n})();', ctx);
  const row = made.find(o => o.html.indexOf('lm-presets-row') >= 0), undo = made.find(o => o.html.indexOf('lm-preset-undo') >= 0);
  const g0 = S.showGrid, m0 = S.macroFeeding;
  app2.lmPresets.t = { key: 't', en: 'T', set: { showGrid: !g0, macroFeeding: m0 === 4 ? 5 : 4, massFormat: S.massFormat } };
  let saves = 0;
  const realSave = app2.saveSettings;
  app2.saveSettings = function () { saves++; return realSave.apply(this, arguments); };
  ctx.localStorage.removeItem('lmPresetUndo');
  realSave.call(app2, S, 'ogarioSettings');
  events.length = 0;
  row.handlers[0].call({ _preset: 't' });
  check('preset: one save for all its keys, each changed key announced once', saves === 1 && J(events.map(e => e[1]).sort()) === J(['macroFeeding', 'showGrid']) && S.showGrid === !g0 && undo.shown === true);
  saves = 0; events.length = 0;
  undo.handlers[0].call({});
  check('Undo preset: one save, the old values back, the copy and the button gone', saves === 1 && S.showGrid === g0 && S.macroFeeding === m0 && events.length === 2 && ctx.localStorage.getItem('lmPresetUndo') === null && undo.shown === false);
  /* an import applied without a reload replaced the stored copy, then removed it */
  row.handlers[0].call({ _preset: 't' });
  ctx.localStorage.setItem('lmPresetUndo', JSON.stringify({ showGrid: !g0 }));
  app2._lmPresetUndoSync();
  const mAfter = S.macroFeeding;
  undo.handlers[0].call({});
  check('Undo after an import: the imported copy is used (the values from before the import are not written)', S.showGrid === !g0 && S.macroFeeding === mAfter && undo.shown === false);
  ctx.localStorage.removeItem('lmPresetUndo');
  S.showGrid = g0; S.macroFeeding = m0; app2.saveSettings(S, 'ogarioSettings');
  row.handlers[0].call({ _preset: 't' });
  ctx.localStorage.removeItem('lmPresetUndo');
  app2._lmPresetUndoSync();
  const gNow = S.showGrid;
  undo.handlers[0].call({});
  check('an import without a copy: the Undo button hides and Undo changes nothing', undo.shown === false && S.showGrid === gNow);
  S.showGrid = g0; S.macroFeeding = m0; app2.saveSettings = realSave; realSave.call(app2, S, 'ogarioSettings');
  ctx.$ = old$; ctx.document = oldDoc; delete app2.lmPresets.t;
}

// ── S5b sliders (the real addSliderBox): one way with setSettings, the callback once, the save when the slider rests
{
  const els = {};
  const fakeQ = (x) => {
    const el = typeof x === 'string' && x.charAt(0) === '#' ? els[x.slice(1)] : (x && typeof x === 'object' ? x : null);
    const w = {
      length: el ? 1 : 0,
      append(html) { String(html).replace(/id=\"([^\"]+)\"/g, (m, id) => { els[id] = { id, value: '', text: '', h: {} }; }); return w; },
      val(v) { if (v === undefined) return el ? el.value : undefined; if (el) el.value = String(v); return w; },
      text(v) { if (el && v !== undefined) el.text = String(v); return w; },
      on(ev, fn) { if (el) el.h[ev] = fn; return w; },
      trigger(ev) { if (el && el.h[ev]) el.h[ev].call(el); return w; },
      closest() { return { length: el ? 1 : 0 }; }
    };
    return w;
  };
  const slSrc = main.slice(main.lastIndexOf('        addSliderBox(', main.indexOf('/* the range and step come from the settings schema, not from the call */')), main.indexOf('        setLang() {'));
  const A3 = vm.runInContext('({\n' + ss + slSrc + '\n})', ctx);
  let saves = 0, feeds = 0, counts = 0, timer = null;
  A3.saveSettings = function (o, n) { saves++; return app.saveSettings(o, n); };
  A3._lmTestFeedCb = () => { feeds++; };
  A3.setProfileCount = () => { counts++; };
  A3._lmLoadOptSounds = function () { };
  if (!ctx.textLanguage) ctx.textLanguage = {};
  const q0 = ctx.$, st0 = ctx.setTimeout;
  ctx.$ = fakeQ; ctx.setTimeout = (f) => { timer = f; return 1; };
  try {
    S.macroFeeding = 5; S.profileNumber = 15;
    A3.addSliderBox('.macroGroup', 'macroFeeding', 1, 160, 1, '_lmTestFeedCb');
    A3.addSliderBox('.profiles', 'profileNumber', 10, 54, 1, 'setProfileCount');
    const sl = fakeQ('#macroFeeding-slider');
    saves = 0;
    sl.val(4).trigger('input');
    check('slider moved: value and label 4, its callback once, no save while it moves', S.macroFeeding === 4 && els['macroFeeding-value'].text === '4' && feeds === 1 && saves === 0 && typeof timer === 'function');
    sl.trigger('change');
    check('slider let go: saved once', saves === 1 && JSON.parse(ctx.localStorage.getItem('ogarioSettings')).macroFeeding === 4);
    /* a script, a preset or a profile without the slider: the slider and its callback follow */
    feeds = 0;
    A3.setSettings('macroFeeding', 6);
    A3.setSettings('profileNumber', 30);
    check('setSettings of a slider setting: the slider and its value show it, its callback runs once', els['macroFeeding-slider'].value === '6' && els['macroFeeding-value'].text === '6' && feeds === 1 &&
      els['profileNumber-slider'].value === '30' && els['profileNumber-value'].text === '30' && counts === 1);
    A3.setSettings('profileNumber', 15);
  } finally {
    ctx.$ = q0; ctx.setTimeout = st0;
    S.macroFeeding = D.macroFeeding; S.profileNumber = D.profileNumber;
  }
}

// ── S5c one path for a value (real setSettings, hotkey toggles, the presets' setOpt):
// effects run once and only for a real change, the switch follows without running anything
{
  const H = vm.runInContext('({\n' + ss + cut('        toggleSkins() {', '        /* a board (leaderboard-positions') + '\n})', ctx);
  H.saveSettings = app.saveSettings;
  H._lmChoiceSync = app2._lmChoiceSync;
  const fx = [];
  ['setTop5', 'displayStats', 'setAutoResp', 'displayChatInfo', 'skinsModeMsg', '_lmLoadOptSounds'].forEach(n => { H[n] = function () { fx.push(n); return ''; }; });
  const els = {}, moved = [], getWas = ctx.document.getElementById, evWas = ctx.Event;
  ctx.Event = function (t, o) { this.type = t; this.bubbles = !!(o && o.bubbles); };
  ctx.document.getElementById = id => els[id] || null;
  /* a switch of the menu: a bubbling change (a click) runs setSettings, as the menu's handler does */
  const box = id => (els[id] = { type: 'checkbox', checked: !!S[id], dispatchEvent(ev) { moved.push(id); if (ev.bubbles) H.setSettings(id, this.checked); } });
  try {
    ['showTop5', 'showStats', 'autoResp'].forEach(box);
    H.setShowTop5(); H.setShowStats(); H.toggleAutoResp();
    check('hotkeys: each effect once (was twice), the switches follow silently', J(fx) === J(['setTop5', 'displayStats', 'setAutoResp', 'displayChatInfo']) &&
      ['showTop5', 'showStats', 'autoResp'].every(k => els[k].checked === S[k]) && J(moved) === J(['showTop5', 'showStats', 'autoResp']) || (console.log('   ' + J(fx) + ' ' + J(moved)), false));
    /* a value without the menu: through setSettings (its effect, the copy in ogario) */
    let rs = 0;
    ctx.drawRender = { resizeCanvas() { rs++; } };
    ctx.ogario.highDPI = true; S.highDPI = true;
    H.setSettings('highDPI', false);
    check('High DPI off without its switch: canvas resized and the copy in ogario follows', rs === 1 && S.highDPI === false && ctx.ogario.highDPI === false);
    H.setSettings('highDPI', true);
    H.setSettings('highDPI', true);
    check('the same High DPI value again: no second canvas resize', S.highDPI === true && rs === 2);
    /* the removed Performance mode: a script setting it changes nothing */
    const jellyWas = S.jellyPhisycs;
    H.setSettings('performanceMode', true);
    check('setSettings("performanceMode") of an old script: no setting, the effects unchanged', !('performanceMode' in S) && S.highDPI === true && S.jellyPhisycs === jellyWas && rs === 2);
    /* the presets' setOpt, without the menu */
    const presetSet = vm.runInContext('(function (application) {' + cut('                var setOpt = function (k, v) {', '                /* The values from before the first of consecutive presets') + 'return setOpt; })', ctx)(H);
    presetSet('highDPI', false);
    check('a preset without the menu: High DPI through setSettings (canvas resized, copy in ogario)', S.highDPI === false && ctx.ogario.highDPI === false && rs === 3);
    /* values checked before their effects */
    fx.length = 0; S.hudMergeSound = false;
    H.setSettings('hudMergeSound', 'true');
    check('an optional sound switched on with "true" (a script): stored as true and loaded', S.hudMergeSound === true && fx.indexOf('_lmLoadOptSounds') >= 0);
    S.massFormat = 3;
    [false, ' ', [], [0]].forEach(v => H.setSettings('massFormat', v));
    check('mass format: false, " ", [] and [0] are refused (auto stays), not read as the old 0', S.massFormat === 3);
    H.setSettings('massFormat', 0);
    const mf0 = S.massFormat;
    S.massFormat = 1; H.setSettings('massFormat', '0');
    check('mass format 0 and "0" of older scripts still mean 12.3k or exact', mf0 === 2 && S.massFormat === 1);
  } finally {
    ctx.document.getElementById = getWas; ctx.Event = evWas;
    S.highDPI = D.highDPI; S.massFormat = D.massFormat; S.hudMergeSound = D.hudMergeSound; S.jellyPhisycs = D.jellyPhisycs;
    ['showTop5', 'showStats', 'autoResp'].forEach(k => { S[k] = D[k]; });
    delete ctx.drawRender;
  }
}

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
check('mention notification: off by default', D.mentionNotify === false);
{
  /* the real check on a chat line (ogario.v4.js chat handler): only with the switch on, the tab hidden,
   * the permission granted, and at most one every 5 s */
  const src = cut('                        /* optional desktop notification while the tab is in the background */', "                        if (_lmMention && !document.getElementById('lm-mention-css'))");
  const shown = [];
  const nctx = vm.createContext({ Date, String, window: {}, document: { hidden: true }, defaultmapsettings: { mentionNotify: true } });
  nctx.Notification = function (t, o) { shown.push([t, o.body, o.tag]); };
  nctx.Notification.permission = 'granted';
  const line = vm.runInContext('(function (_lmMention, rawNick, rawText) {\n' + src + '\n})', nctx);
  const self = {};
  line.call(self, true, 'Bob', 'hi Alice');
  line.call(self, true, 'Bob', 'again');
  const one = shown.length === 1 && J(shown[0]) === J(['Bob', 'hi Alice', 'lm-mention']);
  self._lmMentionNotifAt = 0; nctx.document.hidden = false; line.call(self, true, 'Bob', 'x');
  nctx.document.hidden = true; nctx.defaultmapsettings.mentionNotify = false; line.call(self, true, 'Bob', 'x');
  nctx.defaultmapsettings.mentionNotify = true; line.call(self, false, 'Bob', 'x');
  check('mention notification: shown for a mention in a hidden tab, once per 5 s, not with the tab shown, the switch off or no mention', one && shown.length === 1);
}
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
/* the modifier let go before the key while the key auto-repeats: no bare-key command, and the
 * next press of the combo works (CTRL+E permanent feed could not be turned off) */
const combo = [];
ctx.keyBlind = {}; ctx.hotkeys = { Q: 'hk-doubleSplit', 'ALT+Q': 'hk-popSplit' };
ctx.hotkeysCommand = { 'hk-doubleSplit': { keyDown() { combo.push('double'); } }, 'hk-popSplit': { keyDown() { combo.push('pop'); } } };
const kc = (k, code, rep) => ({ k, keyCode: code, repeat: !!rep, target: { tagName: 'CANVAS', className: '' }, preventDefault() { } });
const altQ = () => { ctx.document.onkeydown(kc('ALT', 18)); ctx.document.onkeydown(kc('ALT+Q', 81)); };
altQ(); ctx.document.onkeydown(kc('ALT+Q', 81, true)); ctx.document.onkeyup(kc('ALT', 18));
ctx.document.onkeydown(kc('Q', 81, true)); ctx.document.onkeyup(kc('Q', 81));
check('Alt let go before Q (Q auto-repeats): no double split, nothing left held', J(combo) === J(['pop']) && !Object.keys(ctx.keyBlind).some(k => ctx.keyBlind[k]));
altQ(); ctx.document.onkeyup(kc('ALT+Q', 81)); ctx.document.onkeyup(kc('ALT', 18));
check('and the next Alt+Q pops again', J(combo) === J(['pop', 'pop']));

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
check('skin collections on load: the new link is a hidden profile, no fav field, the old key is gone',
  ctx.localStorage.getItem('lmSkinCollections') === null && allP().filter(p => p.skinURL === 'https://k.example/new.png' && p.nick === 'Fun').length === 1 &&
  stored.every(p => !('fav' in p)) && allP().length === 55);
P.loadProfiles();
check('skin collections on load: a second load adds nothing', allP().length === 55);
ctx.localStorage.setItem('lmSkinCollections', '{broken');
P.loadProfiles();
check('skin collections on load: a broken value is just removed', ctx.localStorage.getItem('lmSkinCollections') === null && allP().length === 55);
/* profiles saved or imported with the removed favourite star load as before; the load's save drops the field */
{
  const old = JSON.parse(ctx.localStorage.getItem('ogarioPlayerProfiles'));
  old[0].fav = true; old[2].fav = 'x';
  ctx.localStorage.setItem('ogarioPlayerProfiles', J(old));
  vm.runInContext('profiles = []', ctx);
  let err = null;
  try { P.loadProfiles(); } catch (e) { err = e; }
  const again = JSON.parse(ctx.localStorage.getItem('ogarioPlayerProfiles'));
  check('old fav field: loads without error, same profiles, field dropped on the save', !err && again.length === old.length && again.every(p => !('fav' in p)) &&
    J(again.map(p => p.skinURL)) === J(old.map(p => p.skinURL)) && J(again.map(p => p.nick)) === J(old.map(p => p.nick)));
}

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
depRun({ showMapBorders: false, rainbowMapBorders: true });
check('Map borders off: rainbow borders are dimmed (only the border uses them)', depWhy('rainbowMapBorders') === 'Needs: showMapBorders');
depRun({ showMapBorders: true, rainbowMapBorders: false });
check('Map borders on: rainbow borders not dimmed', depWhy('rainbowMapBorders') === '');
depRun({ showMass: false });
/* Mass format also sets the HUD mass texts (team list, leaderboard), shown without cell mass */
check('Show mass off: the cell mass options are dimmed, Mass format is not (it still sets the HUD mass texts)',
  depWhy('autoHideMass') === 'Needs: showMass' && depWhy('massFormat') === '');
check('Multibox rings category removed: no ring setting left (the ring on the player you control has none)', !Object.keys(D).some(k => /^mbRing/.test(k)));
/* a key saved on the removed hotkey Show/hide multibox rings is free again, the other keys stay */
{
  const fn = main.replace(/\r/g, ''), a = fn.indexOf('function lmRenameOldHotkeys(map) {'), b = fn.indexOf('\n}', a);
  const hk = { R: 'hk-mbRings', '': 'hk-mbRings', W: 'hk-feed' };
  vm.runInNewContext(fn.slice(a, b + 2) + '\nlmRenameOldHotkeys(hotkeys);', { hotkeys: hk });
  check('stored key on the removed multibox rings hotkey dropped', !('R' in hk) && !('' in hk) && hk.W === 'hk-feed');
}
depRun({});
check('defaults: none of these dimmed, and every switch of the list is a real setting',
  ['rainbowMapBorders'].every(k => depWhy(k) === '') &&
  Object.keys(rows).every(k => k in D) || (console.log('   not settings: ' + Object.keys(rows).filter(k => !(k in D)).join(', ')), false));

console.log(fail ? fail + ' settings check(s) FAILED' : 'all settings checks passed');
process.exit(fail ? 1 : 0);
