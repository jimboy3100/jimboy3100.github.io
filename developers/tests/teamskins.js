/* Teammates' custom skins on their cells: a name skin (the "bait" flag) never replaces a skin
 * already set for the name, and a teammate's cell draws the skin its team list row shows even
 * when the nick entry of customSkinsMap is gone or holds a name skin. vanillaskins,
 * getCustomSkin and the team skin helpers are taken from ogario/ogario.v4.js.
 * node developers/tests/teamskins.js */
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
function fn(name) {
    const i = src.indexOf('\nfunction ' + name + '(');
    if (i < 0) throw Error(name + ' not found');
    return src.slice(i + 1, body(i));
}
function method(name, prop) {
    const i = src.indexOf('\n        ' + name + (prop ? ': function (' : '('));
    if (i < 0) throw Error(name + ' not found');
    return name + ': function ' + src.slice(src.indexOf('(', i + 9), body(i));
}
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext([fn('lmLooseNick'), fn('lmTeamSkinMap'), fn('lmTeamSkinFor'), fn('LowerCase'), fn('makeUpperCaseAfterUnderline')].join('\n') +
    '\nvar _RE_CLAN_TAG = /^\\[.*?\\]\\s*|^\\u2104[^\\s]*\\s*/g;' +
    '\nvar drawRender = {};' +
    '\nvar legendflags = ["bait", "2ch"];' +
    '\nvar LM = { gameMode: ":ffa" };' +
    '\nvar core = { registerSkin: function () { } };' +
    '\nvar application = {' + [method('_lmSkinKeys'), method('checkSkinURL', true), method('teamSkinUrl'), method('cacheCustomSkin'),
        method('getCustomSkin')].join(',\n') +
    ', customSkinsMap: {}, customSkinsCache: {}, loadSkin: function () { }, _lmTouchSkin: function () { },' +
    ' getCachedSkin: function (cache, url) { return url; } };' +
    '\nvar legendmod = {' + method('vanillaskins') + '};', ctx);
let failed = 0;
const check = (name, ok) => { console.log((ok ? 'ok   ' : 'FAIL ') + name); if (!ok) failed++; };
const A = ctx.application, V = ctx.legendmod;
const FLAG = 'https://www.legendmod.ml/agario/live/flags/bait.png';
const CUSTOM = 'https://i.imgur.com/AbCdE12.png';
const reset = () => { A.customSkinsMap = {}; A.nickSkinSeen = null; ctx._lmTeamSkins = null; };

/* ---- name skins never replace a skin set for the name ---- */
reset();
A.cacheCustomSkin('bait', '#000000', CUSTOM);          /* teammate data from the relay */
V.vanillaskins('bait', '%doge', '#ff0000');            /* his cell comes with an agar.io skin id */
check('a teammate "bait" keeps his custom skin when his cell carries a skin id', A.customSkinsMap.bait === CUSTOM);
check('...and his cell draws it (not the bait flag)', A.getCustomSkin('bait', '#ff0000', '%doge') === CUSTOM);
V.vanillaskins('bait', null, '#ff0000');
check('...also for a cell without a skin id', A.getCustomSkin('bait', '#ff0000', null) === CUSTOM);
reset();
V.vanillaskins('bait', '%doge', '#ff0000');
check('a player "bait" without a custom skin still gets the bait flag', A.customSkinsMap.bait === FLAG && A.getCustomSkin('bait', '#ff0000', '%doge') === FLAG);
A.cacheCustomSkin('bait', '#000000', CUSTOM);
check('teammate data arriving after the flag replaces it', A.getCustomSkin('bait', '#ff0000', '%doge') === CUSTOM);

/* ---- the team list's skins for teammates' cells ---- */
const fancy = ['\uA7A6\u03C3\u0432\u03B9\u0274c\u03B9\u0442\u03C3 \u2726', '\u0126ell\u2661', '\u2726 \uA7A6\u03C3\u0432\u03B9\u0274\u043D\u03C3', 'bait'];
const top5 = [
    { nick: fancy[0], skin: 'https://i.imgur.com/Aaaaaaa.png' },
    { nick: fancy[1], skin: 'i.imgur.com/Bbbbbbb.png' },          /* raw relay value: checkSkinURL makes it https */
    { nick: fancy[2], skinURL: 'https://i.imgur.com/Ccccccc.png', skin: '' }, /* a temporary (socket 3) teammate */
    { nick: 'bait', skin: CUSTOM },
    { nick: 'blank one', skin: 'https://i.imgur.com/Ddddddd.png' },
    { nick: 'no skin', skin: '' },
    { nick: '', skin: 'https://i.imgur.com/Eeeeeee.png' }
];
const blank = { 'https://i.imgur.com/Ddddddd.png': 1 };
reset();
ctx._lmTeamSkins = ctx.lmTeamSkinMap(top5, (u) => A.checkSkinURL(u), blank);
check('the map flushed: teammates\' cells still draw their team list skins',
    A.getCustomSkin(fancy[0], '#00ff00', null) === 'https://i.imgur.com/Aaaaaaa.png' &&
    A.getCustomSkin(fancy[1], '#00ff00', '%huncho') === 'https://i.imgur.com/Bbbbbbb.png' &&
    A.getCustomSkin(fancy[2], '#00ff00', '') === 'https://i.imgur.com/Ccccccc.png');
A.customSkinsMap.bait = FLAG;
check('a teammate\'s team list skin wins over a name skin under his nick', A.getCustomSkin('bait', '#00ff00', '%doge') === CUSTOM);
check('a blank (transparent or black) team skin is not used', A.getCustomSkin('blank one', '#00ff00', null) === null);
check('teammates without a skin or a name add nothing', !ctx._lmTeamSkins.exact.has('no skin') && !ctx._lmTeamSkins.exact.has(''));
check('a cell without a name gets no team skin', A.getCustomSkin('', '#00ff00', null) === null && A.teamSkinUrl('') === null);
check('other players are not affected', A.getCustomSkin('Huncho', '#00ff00', null) === null);
/* nick on the cell without the decoration the team list has */
check('cell nick without the team list symbols: the teammate\'s skin (loose match)',
    A.getCustomSkin('\uA7A6\u03C3\u0432\u03B9\u0274c\u03B9\u0442\u03C3', '#00ff00', null) === 'https://i.imgur.com/Aaaaaaa.png' &&
    A.getCustomSkin('\uA7A6\u03C3\u0432\u03B9\u0274\u043D\u03C3', '#00ff00', null) === 'https://i.imgur.com/Ccccccc.png');
A.customSkinsMap['\uA7A6\u03C3\u0432\u03B9\u0274c\u03B9\u0442\u03C3'] = 'https://i.imgur.com/Own1234.png';
check('a loose match never replaces a skin set for the exact nick', A.getCustomSkin('\uA7A6\u03C3\u0432\u03B9\u0274c\u03B9\u0442\u03C3', '#00ff00', null) === 'https://i.imgur.com/Own1234.png');
const amb = ctx.lmTeamSkinMap([{ nick: 'Rob \u2726', skin: 'https://i.imgur.com/Rob1111.png' }, { nick: '\u2726Rob', skin: 'https://i.imgur.com/Rob2222.png' }]);
check('two teammates with the same loose nick: no loose match', ctx.lmTeamSkinFor(amb, 'Rob', true, null) === null && ctx.lmTeamSkinFor(amb, 'Rob \u2726', false, null) === 'https://i.imgur.com/Rob1111.png');
check('no team list: nothing changes', ctx.lmTeamSkinFor(null, 'bait', false, null) === null && ctx.lmTeamSkinMap(null).exact.size === 0);

/* ---- every renderer asks the team list the same way ---- */
const uses = src.split('teamSkinUrl(cell.targetNick)').length - 1, usesLoose = src.split('teamSkinUrl(cell.targetNick, true)').length - 1;
check('both WebGL skin lookups use the team list skins (exact and loose)', uses === 2 && usesLoose === 2);
check('the team skins are rebuilt with the teammate nick set', /_lmTeammateNickSet = new Set\(window\.teammatenicks\);\n\s*\/\*[^\n]*\*\/\n\s*window\._lmTeamSkins = lmTeamSkinMap\(application\.top5/.test(src));

console.log(failed ? 'FAILED ' + failed : 'all ok');
process.exit(failed ? 1 : 0);
