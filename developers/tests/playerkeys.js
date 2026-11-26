/* Player names used as keys: a nick, skin name or effect sender such as "constructor",
 * "toString", "valueOf", "hasOwnProperty", "__proto__", "at", "map" or "length" finds
 * nothing it was not given, never throws and never changes a prototype. The maps are built
 * as ogario/ogario.v4.js builds them (their initial values and resets are evaluated from the
 * source) and go through the real functions: the application's skin lookups
 * (cacheCustomSkin, customSkinKey, getCustomSkin, checkSkinsMap, clearOwnCustomSkin),
 * legendmod.vanillaskins, the special effect relay (Socket3updateTeamPlayerSpfc) and
 * animateCustomSkin. The cell colours by nick go through the real packet handler in
 * practice.js; the cell drawing in the page is checked by probes/zzz-practice-nicks.js.
 * node developers/tests/playerkeys.js [ogario.v4.js] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(process.argv[2] || path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };
const NICKS = ['constructor', 'toString', 'valueOf', 'hasOwnProperty', '__proto__', 'at', 'map', 'length', 'isPrototypeOf', 'join'];

function body(i) {
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return k + 1;
    }
    throw Error('unbalanced at ' + i);
}
/* optional: helpers that older versions do not have */
function fn(name, optional) {
    const i = src.indexOf('\nfunction ' + name + '(');
    if (i < 0 && optional) return '';
    if (i < 0) throw Error(name + ' not found');
    return src.slice(i + 1, body(i));
}
function method(name, prop, optional) {
    const i = src.indexOf('\n        ' + name + (prop ? ': function (' : '('));
    if (i < 0 && optional) return null;
    if (i < 0) throw Error(name + ' not found');
    return name + ': function ' + src.slice(src.indexOf('(', i + 9), body(i));
}
/* the expression a map starts with (or is reset to) in the source */
function init(re) {
    const m = re.exec(src);
    if (!m) throw Error('initial value not found: ' + re);
    return m[1];
}
const INIT = {
    customSkinsMap: init(/\n {8}customSkinsMap: ([^\n]+),\n/),
    flushSkinsMap: init(/\n {8}flushSkinsMap\(\) \{[^]*?this\.customSkinsMap = ([^;\n]+);/),
    cellcolors: init(/\n {8}cellcolors: ([^\n]+),\n/),
    cellcolorsReplay: init(/\n {4}legendmod\.cellcolors = ([^\n;]+)\n/),
    cellcolorsPlay: init(/\n {8}legendmod\.cellcolors=([^\n;]+)\n/),
    SpecialEffectPlayers: init(/\nSpecialEffectPlayers = ([^;\n]+);/),
    VanillaSkinUrlMap: init(/\n {4}window\.VanillaSkinUrlMap = ([^;\n]+);/),
    VanillaSkinUrlMapCdn: init(/\n {28}window\.VanillaSkinUrlMap = ([^;\n]+);/)
};
if (src.indexOf('\n        vanillaSkinKeys: ') >= 0) {
    INIT.vanillaSkinKeys = init(/\n {8}vanillaSkinKeys: ([^\n]+),\n/);
    INIT.flushVanillaSkinKeys = init(/\n {8}flushSkinsMap\(\) \{[^]*?this\.vanillaSkinKeys = ([^;\n]+);/);
}
const make = (k) => new Function('return ' + INIT[k])();
/* a nick key of the map finds nothing before anything was stored under it */
const clean = (m) => NICKS.every((n) => m[n] === undefined || (n === '__proto__' && m[n] === null));
for (const k of Object.keys(INIT)) check(k + ': a nick key finds nothing in a new map (' + INIT[k] + ')', clean(make(k)));

/* ---- the application's skin lookups ---- */
const ctx = { console, escape, unescape, decodeURIComponent };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext([fn('lmLooseNick'), fn('lmTeamSkinMap'), fn('lmTeamSkinFor'), fn('LowerCase'), fn('makeUpperCaseAfterUnderline'),
    fn('Socket3updateTeamPlayerSpfc'), fn('animateCustomSkin'), fn('lmSkinsShown', true)].join('\n') +
    '\nvar _RE_CLAN_TAG = /^\\[.*?\\]\\s*|^\\u2104[^\\s]*\\s*/g;' +
    '\nvar drawRender = {};' +
    '\nvar legendflags = ["bait"];' +
    '\nvar LM = { gameMode: ":ffa", showCustomSkins: true };' +
    '\nvar defaultmapsettings = { customSkins: true, vanillaSkins: true, ownVanillaSkin: false, noSkins: false };' +
    '\nvar ogario = {}, RecordedArenasSpecifications = {};' +
    '\nvar core = { registerSkin: function () { } };' +
    '\nvar SpecialEffectPlayers = ' + INIT.SpecialEffectPlayers + ';' +
    '\nvar animatedskins = { legend_clan: { id: "legend_clan", frames: [{ id: "abc", delay: 0.1 }] } };' +
    '\nwindow.VanillaSkinUrlMap = ' + INIT.VanillaSkinUrlMap + ';' +
    '\nwindow.VanillaSkinUrlMap["%doge"] = "https://jimboy3000.github.io/vanillaskins/doge.png";' +
    '\nvar application = {' + [method('_lmSkinKeys'), method('checkSkinURL', true), method('teamSkinUrl'), method('cacheCustomSkin'),
        method('getCustomSkin'), method('customSkinKey'), method('checkSkinsMap'), method('clearOwnCustomSkin'), method('flushSkinsMap'),
        method('_lmSkinSet', false, true), method('_lmSkinAt', false, true)].filter(Boolean).join(',\n') +
    ', customSkinsMap: ' + INIT.customSkinsMap + ', vanillaSkinKeys: ' + (INIT.vanillaSkinKeys || '{}') + ', customSkinsCache: {}, loads: [], loadSkin: function (c, u) { this.loads.push(u); }, _lmTouchSkin: function () { },' +
    ' getCachedSkin: function (cache, url) { return url; } };' +
    '\nvar legendmod = {' + method('vanillaskins') + '};', ctx);
const A = ctx.application, V = ctx.legendmod;
const OP = Object.getOwnPropertyNames(Object.prototype).sort().join();
const AP = Object.getOwnPropertyNames(Array.prototype).sort().join();
const protoIntact = () => Object.getOwnPropertyNames(Object.prototype).sort().join() === OP && Object.getOwnPropertyNames(Array.prototype).sort().join() === AP &&
    ({}).polluted === undefined && Object.getPrototypeOf({}) === Object.prototype &&
    vm.runInContext('Object.getOwnPropertyNames(Object.prototype).length === ' + Object.getOwnPropertyNames(Object.prototype).length + ' && ({}).polluted === undefined', ctx);
const url = (n) => 'https://i.imgur.com/' + Buffer.from(n).toString('hex') + '.png';
const errOf = (f) => { try { f(); return ''; } catch (e) { return String(e && e.message || e); } };
{
    A.cacheCustomSkin('bob', '#ff0000', url('bob'));
    let bad = [];
    for (const n of NICKS) {
        const e = errOf(() => {
            const k = A.customSkinKey(n, '#ff0000', '');
            const g = A.getCustomSkin(n, '#ff0000', '');
            const h = A.checkSkinsMap(n, '#ff0000');
            const s = A.customSkinKey('someone', '#ff0000', n);
            if (k !== null || g !== null || h !== false || s !== null) bad.push(n + ' -> ' + [typeof k, typeof g, h, typeof s].join('/'));
        });
        if (e) bad.push(n + ' threw ' + e);
    }
    check('no skin for these nicks (or skin names) until one is set for them', bad.length === 0, bad.join('; '));
    check('  a normal nick keeps its skin', A.getCustomSkin('bob', '#ff0000', '') === url('bob') && A.checkSkinsMap('bob', '#ff0000') === true);

    bad = [];
    for (const n of NICKS) {
        const e = errOf(() => A.cacheCustomSkin(n, '#00ff00', url(n)));
        if (e) bad.push(n + ' threw ' + e);
    }
    for (const n of NICKS) {
        const e = errOf(() => {
            if (A.getCustomSkin(n, '#00ff00', '') !== url(n) || A.customSkinKey(n, '#00ff00', '') !== url(n) || A.checkSkinsMap(n, '#00ff00') !== true) bad.push(n + ' -> ' + A.getCustomSkin(n, '#00ff00', ''));
        });
        if (e) bad.push(n + ' threw ' + e);
    }
    check('a skin set for each of these nicks is found under it', bad.length === 0, bad.join('; '));
    let e2 = errOf(() => { if (A.checkSkinsMap('nobody', '#00ff00') !== false) bad.push('nobody found'); });
    check('  with "hasOwnProperty" stored as a nick, other nicks are still looked up', !e2 && bad.length === 0, e2 || bad.join('; '));
    check('  a normal nick keeps its skin', A.getCustomSkin('bob', '#ff0000', '') === url('bob'));
    check('  no prototype changed', protoIntact());

    bad = [];
    for (const n of NICKS) {
        const e = errOf(() => { A.clearOwnCustomSkin(n, '#00ff00'); if (A.checkSkinsMap(n, '#00ff00') !== false || A.getCustomSkin(n, '#00ff00', '') !== null) bad.push(n); });
        if (e) bad.push(n + ' threw ' + e);
    }
    check('clearing the own skin of these nicks removes it', bad.length === 0, bad.join('; '));
    A.flushSkinsMap && errOf(() => A.flushSkinsMap());
    check('  the map after a flush: these nicks find nothing', clean(A.customSkinsMap) && A.getCustomSkin('constructor', '', '') === null);
}

/* ---- legendmod.vanillaskins: skin names and nicks from the server ---- */
{
    ctx.FreeSkins = [{ id: 'free1', image: 'free1.png' }];
    const bad = [];
    for (const n of NICKS) {
        const e = errOf(() => { V.vanillaskins(n, n, '#123456'); V.vanillaskins(n, '', '#123456'); V.vanillaskins('someone', '%' + n, '#123456'); });
        if (e) bad.push(n + ' threw ' + e);
        const seen = A.nickSkinSeen && A.nickSkinSeen[n];
        if (seen !== undefined && typeof seen !== 'string') bad.push(n + ' seen ' + typeof seen);
        if (A.customSkinsMap[n] !== undefined && typeof A.customSkinsMap[n] !== 'string') bad.push(n + ' mapped ' + typeof A.customSkinsMap[n]);
    }
    for (const u of A.loads) if (typeof u !== 'string' || !/^https?:\/\//.test(u)) bad.push('loads ' + String(u).slice(0, 40));
    check('vanillaskins with these nicks and skin names: no throw, nothing but URLs stored and loaded', bad.length === 0, bad.join('; '));
    V.vanillaskins('dog', '%doge', '#123456');
    check('  a real skin name still resolves', A.customSkinKey('dog', '#123456', '%doge') === 'https://jimboy3000.github.io/vanillaskins/doge.png');
    check('  no prototype changed', protoIntact());
}

/* ---- special effects from teammates, animated skins ---- */
{
    const bad = [];
    for (const n of NICKS) {
        const e = errOf(() => ctx.Socket3updateTeamPlayerSpfc({ id: n, x: 'Hat;' + n }));
        if (e) bad.push(n + ' threw ' + e);
        else if (vm.runInContext('SpecialEffectPlayers', ctx)[n] !== 'Hat;' + n) bad.push(n + ' not stored');
    }
    check('special effects relayed for these nicks: stored under the nick, no throw', bad.length === 0, bad.join('; '));
    const e3 = errOf(() => ctx.Socket3updateTeamPlayerSpfc({ id: '__proto__', x: 'legend_clan' }));
    check('  an effect naming an animated skin for "__proto__": the animated skin list keeps its prototype', !e3 &&
        vm.runInContext('Object.getPrototypeOf(animatedskins) === Object.prototype && !Object.prototype.hasOwnProperty.call(animatedskins, "id")', ctx), e3);
    const e4 = errOf(() => { for (const n of NICKS) ctx.animateCustomSkin('eve', n); });
    check('  an animated skin id such as "constructor" names no animated skin', !e4 && vm.runInContext('animatedskins.eve === undefined', ctx), e4);
    ctx.animateCustomSkin('eve', 'legend_clan');
    check('  a real animated skin id still applies', vm.runInContext('animatedskins.eve === animatedskins.legend_clan', ctx));
    check('  no prototype changed', protoIntact());
}

console.log(failed ? failed + ' player key check(s) FAILED' : 'playerkeys ok');
process.exit(failed ? 1 : 0);
