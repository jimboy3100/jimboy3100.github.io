/* The skin options do what their labels say, in every combination, by the settings switch and by
 * the hotkeys: "Custom skins" = Legend Mod skins (own, teammates', a skin URL sent with the cell),
 * "Vanilla skins" = agar.io skins (skin ids, flag and free name skins), "Own vanilla skin when no
 * custom" = own cells keep their agar.io skin with Vanilla skins off, "No skins" = none. Switching
 * Vanilla skins off never drops a custom skin (the own one included). The skin lookup
 * (customSkinKey, behind getCustomSkin and both WebGL skin paths), vanillaskins, the gate the
 * renderers use (lmSkinsShown), toggleSkins, setVanillaSkins, setShowSkins and syncHotkeyOption
 * are taken from ogario/ogario.v4.js; the virus colour on WebGL is checked by glbatch.js.
 * The skins hotkeys (the real keyDown of hk-toggleSkins from ogario/hotkeysCommand.js) name the mode
 * each press entered in one toast (skinsModeMsg, texts from the built language packs).
 * node developers/tests/skintoggles.js [ogario.v4.js] */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
function body(i) {
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return k + 1;
    }
    throw Error('unbalanced at ' + i);
}
const missing = [];
function fn(name) {
    const i = src.indexOf('\nfunction ' + name + '(');
    if (i < 0) { missing.push(name); return ''; }
    return src.slice(i + 1, body(i));
}
function method(name, prop) {
    const i = src.indexOf('\n        ' + name + (prop ? ': function (' : '('));
    if (i < 0) { missing.push(name); return null; }
    return name + ': function ' + src.slice(src.indexOf('(', i + 9), body(i));
}
const methods = ['_lmSkinKeys', 'teamSkinUrl', 'cacheCustomSkin', '_lmSkinSet', '_lmSkinAt', 'getCustomSkin', '_lmSkinCacheKey', 'customSkinKey',
    'toggleSkins', 'setVanillaSkins', 'setShowSkins', 'syncHotkeyOption', '_lmOptionUi', 'flushSkinsMap', 'skinsModeMsg'].map((m) => method(m)).filter(Boolean);
methods.push(method('checkSkinURL', true));

const ctx = { console, JSON };
ctx.window = ctx;
vm.createContext(ctx);
require('./lib/i18n-env')(ctx);
/* the real skin resolver (vanillaskins asks it for flag, free, custom and level URLs) */
const skinRes = require('./lib/skinres-env')(ctx, src);
/* toastr as the page has it: each toast is a jQuery set; clear(el) removes that one, clear() all */
const toasts = [];
let clearedAll = 0;
ctx.toastr = {
    info: (m) => { const el = { ty: 'info', m: m, length: 1 }; toasts.push(el); return el; },
    error: (m) => { const el = { ty: 'error', m: m, length: 1 }; toasts.push(el); return el; },
    clear: (el) => { if (!el) { clearedAll++; toasts.length = 0; return; } const i = toasts.indexOf(el); if (i >= 0) toasts.splice(i, 1); }
};
vm.runInContext(skinRes.accessor + [fn('lmLooseNick'), fn('lmTeamSkinMap'), fn('lmTeamSkinFor'), fn('LowerCase'), fn('makeUpperCaseAfterUnderline'), fn('lmSkinsShown')].join('\n') +
    '\nvar _RE_CLAN_TAG = /^\\[.*?\\]\\s*|^\\u2104[^\\s]*\\s*/g;' +
    '\nvar drawRender = {};' +
    '\nvar legendflags = ["albania"];' +
    '\nvar LM = { gameMode: ":ffa", showCustomSkins: true };' +
    '\nvar core = { registerSkin: function () { } };' +
    '\nvar ogario = {};' +
    '\nvar defaultmapsettings = { customSkins: true, vanillaSkins: true, ownVanillaSkin: false, noSkins: false };' +
    '\nvar saved = null;' +
    '\nfunction animateSkinsStop() { } function animateSkincheck() { }' +
    '\nvar RecordedArenasSpecifications = {};' +
    /* the settings checkbox: a bubbling change (a click) runs the menu's change handler,
     * setSettings, whose vanillaSkins / noSkins cases are these; setSettings shows the value on
     * the checkbox silently (the real _lmOptionUi: a change that does not bubble) */
    '\nvar boxes = {};' +
    '\nvar document = { getElementById: function (id) { return boxes[id] || (boxes[id] = { type: "checkbox", id: id, checked: false, dispatchEvent: function (ev) { if (ev.bubbles) application.setSettings(id, this.checked); } }); } };' +
    '\nfunction Event(t, o) { this.type = t; this.bubbles = !!(o && o.bubbles); }' +
    '\nvar application = {' + methods.join(',\n') +
    ', customSkinsMap: {}, vanillaSkinKeys: {}, customSkinsCache: {}, loadSkin: function () { }, _lmTouchSkin: function () { },' +
    ' displayChatInfo: function () { }, saveSettings: function () { saved = JSON.stringify(defaultmapsettings); },' +
    ' getCachedSkin: function (cache, url) { return url; },' +
    ' setSettings: function (id, checked) { defaultmapsettings[id] = checked; ogario[id] = checked; saved = JSON.stringify(defaultmapsettings);' +
    '   if (id === "vanillaSkins") this.setVanillaSkins();' +
    '   if (id === "noSkins") { this.noSkins = !!checked; LM.showCustomSkins = !checked; } this._lmOptionUi(id); } };' +
    /* the game state, window.legendmod in the page */
    '\nvar legendmod = Object.assign(LM, {' + method('vanillaskins') + '});', ctx);

let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
if (missing.length) console.log('     not in this version: ' + missing.join(', '));
const A = ctx.application, V = ctx.legendmod, MS = () => ctx.defaultmapsettings;
const C_OWN = 'https://i.imgur.com/OwnSkin1.png', C_MATE = 'https://i.imgur.com/MateSkn.png', C_URL = 'https://i.imgur.com/UrlSkin.png';
const V_DOGE = 'https://configs.test/live/Doge.png', V_SPIDER = 'https://configs.test/live/Spider.png';
const FLAG = 'https://www.legendmod.ml/agario/live/flags/albania.png';
ctx.VanillaSkinUrlMap = { '%doge': V_DOGE, '%spider': V_SPIDER };
ctx.LM_CUSTOM_SKINS_CDN = 'https://custom.test';

/* the cells of the screenshot and the player: what the game stores for them */
function world() {
    A.customSkinsMap = {}; A.vanillaSkinKeys = {}; A.nickSkinSeen = null; ctx._lmTeamSkins = null;
    A.cacheCustomSkin('Me', '#00ff00', C_OWN);              /* own custom skin (onPlayerSpawn) */
    A.cacheCustomSkin('Mate', '#000000', C_MATE);           /* teammate data from the relay */
    V.vanillaskins('Me', '%doge', '#00ff00');               /* own cell: its equipped agar.io skin */
    V.vanillaskins('Me2', '%doge', '#00ff00');              /* own cell of a player without a custom skin */
    V.vanillaskins('Albania', null, '#ff0000');             /* flag name skin */
    V.vanillaskins('Spider', '%spider', '#ff0000');         /* agar.io skin id */
    V.vanillaskins('Mate', '%spider', '#ff0000');           /* the teammate's cell comes with an agar.io skin id */
    V.vanillaskins('Url', C_URL, '#ff0000');                /* a skin URL sent with the cell (private servers) */
    V.vanillaskins('t', null, '#ff8800');                   /* no skin at all */
}
/* what a renderer draws for a cell: its gate, then the one lookup */
const gate = () => (typeof ctx.lmSkinsShown === 'function' ? ctx.lmSkinsShown() : !!(MS().customSkins && ctx.LM.showCustomSkins));
const draw = (nick, color, skin, own) => (gate() ? A.getCustomSkin(nick, color, skin, false, own) : null);
const CELLS = [
    ['own cell with a custom skin', 'Me', '#00ff00', '%doge', true],
    ['own cell without a custom skin', 'Me2', '#00ff00', '%doge', true],
    ['teammate with a custom skin', 'Mate', '#ff0000', '%spider', false],
    ['flag name "Albania"', 'Albania', '#ff0000', null, false],
    ['agar.io skin id', 'Spider', '#ff0000', '%spider', false],
    ['skin URL sent with the cell', 'Url', '#ff0000', C_URL, false],
    ['another player named like me (not own)', 'Me2', '#ff0000', '%spider', false],
    ['player "t" without a skin', 't', '#ff8800', null, false]
];
function expected(i, s) {
    if (s.noSkins) return null;
    const vOwn = s.vanillaSkins || s.ownVanillaSkin;
    switch (i) {
        case 0: return s.customSkins ? C_OWN : vOwn ? V_DOGE : null;
        case 1: return vOwn ? V_DOGE : null;
        case 2: return s.customSkins ? C_MATE : s.vanillaSkins ? V_SPIDER : null;
        case 3: return s.vanillaSkins ? FLAG : null;
        case 4: return s.vanillaSkins ? V_SPIDER : null;
        case 5: return s.customSkins ? C_URL : null;
        case 6: return s.vanillaSkins ? V_SPIDER : null;
        default: return null;
    }
}
function apply(s) {
    Object.assign(MS(), { customSkins: s.customSkins, vanillaSkins: s.vanillaSkins, ownVanillaSkin: s.ownVanillaSkin, noSkins: s.noSkins });
    ctx.LM.showCustomSkins = !s.noSkins;
}
function verify(label, s) {
    const bad = [];
    CELLS.forEach((c, i) => {
        const got = draw(c[1], c[2], c[3], c[4]), want = expected(i, s);
        if (got !== want) bad.push(c[0] + ': ' + (got || 'no skin') + ', expected ' + (want || 'no skin'));
    });
    check(label + (bad.length ? ' -- ' + bad.join('; ') : ''), !bad.length);
}
const name = (s) => 'custom ' + (s.customSkins ? 'on' : 'off') + ', vanilla ' + (s.vanillaSkins ? 'on' : 'off') +
    ', own vanilla ' + (s.ownVanillaSkin ? 'on' : 'off') + (s.noSkins ? ', No skins on' : '');

/* ---- every combination of the four switches ---- */
for (let m = 0; m < 16; m++) {
    const s = { customSkins: !!(m & 1), vanillaSkins: !!(m & 2), ownVanillaSkin: !!(m & 4), noSkins: !!(m & 8) };
    world();
    apply(s);
    verify(name(s), s);
}

/* ---- the report: Settings switch Vanilla skins off (custom on) ---- */
world();
apply({ customSkins: true, vanillaSkins: true, ownVanillaSkin: false, noSkins: false });
ctx.document.getElementById('vanillaSkins').checked = false;
ctx.document.getElementById('vanillaSkins').dispatchEvent(new ctx.Event('change', { bubbles: true }));
V.vanillaskins('Albania', null, '#ff0000');                 /* the next cell updates */
V.vanillaskins('Spider', '%spider', '#ff0000');
verify('Settings: Vanilla skins off -> agar.io skins gone (also after the next cell update), custom skins incl. the own one stay',
    { customSkins: true, vanillaSkins: false, ownVanillaSkin: false, noSkins: false });
check('...the own custom skin is still in the skins map', A.customSkinsMap.Me === C_OWN && A.customSkinsMap.Mate === C_MATE);
check('...and it is saved (reload keeps it)', JSON.parse(ctx.saved).vanillaSkins === false);
/* reload: the stored settings, the skins arrive again */
const stored = JSON.parse(ctx.saved);
world();
apply(stored);
verify('after a reload with the stored settings: the same skins', stored);

/* ---- the hotkey "Toggle skins (custom/default)": both -> custom only -> vanilla only -> both ---- */
world();
apply({ customSkins: true, vanillaSkins: true, ownVanillaSkin: false, noSkins: false });
const cycle = [{ customSkins: true, vanillaSkins: false }, { customSkins: false, vanillaSkins: true }, { customSkins: true, vanillaSkins: true }];
cycle.forEach((want, i) => {
    A.toggleSkins();
    const s = Object.assign({ ownVanillaSkin: false, noSkins: false }, want);
    const states = MS().customSkins === want.customSkins && MS().vanillaSkins === want.vanillaSkins &&
        ctx.document.getElementById('customSkins').checked === want.customSkins && ctx.document.getElementById('vanillaSkins').checked === want.vanillaSkins;
    check('hotkey press ' + (i + 1) + ': ' + name(s) + ', checkboxes follow', states);
    V.vanillaskins('Albania', null, '#ff0000');
    verify('hotkey press ' + (i + 1) + ': the skins of ' + name(s), s);
    check('hotkey press ' + (i + 1) + ': the own and the teammate custom skins are kept', A.customSkinsMap.Me === C_OWN && A.customSkinsMap.Mate === C_MATE);
    check('hotkey press ' + (i + 1) + ': saved', JSON.parse(ctx.saved).vanillaSkins === want.vanillaSkins && JSON.parse(ctx.saved).customSkins === want.customSkins);
});

/* ---- the hotkey "Show/hide skins" (No skins) ---- */
world();
apply({ customSkins: true, vanillaSkins: false, ownVanillaSkin: false, noSkins: false });
A.setShowSkins();
verify('hotkey Show/hide skins: no skins at all', { customSkins: true, vanillaSkins: false, ownVanillaSkin: false, noSkins: true });
check('...the No skins checkbox follows and is saved', ctx.document.getElementById('noSkins').checked === true && JSON.parse(ctx.saved).noSkins === true);
A.setShowSkins();
verify('hotkey Show/hide skins again: custom skins back, agar.io skins still off', { customSkins: true, vanillaSkins: false, ownVanillaSkin: false, noSkins: false });

/* ---- the message each press of a skins hotkey shows ---- */
const hkSrc = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'hotkeysCommand.js'), 'utf8').replace(/\r\n/g, '\n');
const hkAt = hkSrc.indexOf("'hk-toggleSkins'"), kdAt = hkSrc.indexOf('keyDown()', hkAt);
let kd = 0, kdEnd = -1;
for (let k = hkSrc.indexOf('{', kdAt); k < hkSrc.length; k++) { if (hkSrc[k] === '{') kd++; else if (hkSrc[k] === '}' && !--kd) { kdEnd = k + 1; break; } }
const pressToggle = vm.runInContext('(function () ' + hkSrc.slice(hkSrc.indexOf('{', kdAt), kdEnd) + ')', ctx);
const T = (k) => ctx.lmT('pkg.q4.' + k);
const onScreen = () => toasts.map((t) => t.ty + ': ' + t.m).join(' | ');
check('the mode texts are in the language packs', ['skinsBoth', 'skinsCustom', 'skinsVanilla', 'skinsOff', 'skinsHidden'].every((k) => T(k) && T(k) !== 'pkg.q4.' + k));
world();
apply({ customSkins: true, vanillaSkins: true, ownVanillaSkin: false, noSkins: false });
A.noSkins = false; toasts.length = 0; clearedAll = 0;
[['skinsCustom', 'Skins: custom only'], ['skinsVanilla', 'Skins: agar.io only'], ['skinsBoth', 'Skins: custom + agar.io'], ['skinsCustom', 'Skins: custom only']].forEach((w, i) => {
    pressToggle();
    check('Toggle skins press ' + (i + 1) + ': one toast "' + w[1] + '" (' + onScreen() + ')', toasts.length === 1 && toasts[0].ty === 'info' && toasts[0].m === T(w[0]) && T(w[0]) === w[1]);
});
check('...a press replaces the previous toast, never clears the others', clearedAll === 0);
const other = ctx.toastr.info('someone else');
A.toggleSkins(); A.toggleSkins(); A.toggleSkins();
check('the timed skin toggle (LMexpress, toggleSkins alone) shows no toast', toasts.length === 2 && toasts[1] === other);
toasts.length = 0;
apply({ customSkins: true, vanillaSkins: false, ownVanillaSkin: false, noSkins: false });
A.setShowSkins();
check('Show/hide skins off: "Skins: off" (' + onScreen() + ')', toasts.length === 1 && toasts[0].ty === 'error' && toasts[0].m === T('skinsOff') && T('skinsOff') === 'Skins: off');
pressToggle();
check('Toggle skins while hidden: the mode entered and that skins are hidden (' + onScreen() + ')', toasts.length === 1 && toasts[0].m === T('skinsVanilla') + ' (' + T('skinsHidden') + ')');
A.setShowSkins();
check('Show/hide skins on: the mode now shown (' + onScreen() + ')', toasts.length === 1 && toasts[0].ty === 'info' && toasts[0].m === T('skinsVanilla'));
ctx.LMi18n.setLang('el');
pressToggle();
check('Greek: the mode text in Greek (' + onScreen() + ')', toasts.length === 1 && toasts[0].m === T('skinsBoth') && /\u03b4\u03b9\u03ba\u03ac/.test(toasts[0].m));
ctx.LMi18n.setLang('en');

/* ---- a custom skin stored later under a name that had an agar.io skin is custom ---- */
world();
apply({ customSkins: true, vanillaSkins: false, ownVanillaSkin: false, noSkins: false });
A.cacheCustomSkin('Albania', '#000000', C_MATE);
check('a teammate "Albania" (custom skin over the flag) shows his skin with Vanilla skins off', draw('Albania', '#ff0000', null, false) === C_MATE);

console.log(failed ? 'FAILED ' + failed : 'all ok');
process.exit(failed ? 1 : 0);
