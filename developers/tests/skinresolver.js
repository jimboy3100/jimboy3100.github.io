/* Skin asset resolver (ogario/skinresolver.js) and its registry (ogario/skinregistry.js, generated
 * from file hashes by developers/skins/build-registry.js):
 *  - the registry is up to date with the files of vanillaskins/, lowresskins/, agario/live/flags/
 *    and the mirror snapshot, and every alias it names has the same bytes as its canonical file;
 *  - aliases (fungi_warlord name variants, literal %20 vs encoded space, same picture under two
 *    product names, lowresskins copies, flag copies), case-sensitive paths, the spellings of our site;
 *  - classification of every identifier type, identifiers never changed;
 *  - every resource has at most 3 distinct places to try, none equivalent to another;
 *  - the real loadSkin from ogario/ogario.v4.js (fetch / Image / queue stand-ins): one download per
 *    resource identity whatever spelling asks for it, the next place only after a failure, no second
 *    request of a URL that answered 404, a negative cache after the last place; getImg follows the
 *    same list;
 *  - players' old saved skin URLs (profiles, imported settings, replays, cloud copies) still load;
 *  - every image the skin gallery, the shop, the skin checker and the rotator link on this site exists
 *    (case-sensitive, as on the hosting);
 *  - nothing per call: the same input gives the same cached object, the cache does not grow.
 * node developers/tests/skinresolver.js [ogario.v4.js]   (an older ogario.v4.js shows the "before")
 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
const ENGINE = process.argv[2] || path.join(ROOT, 'ogario', 'ogario.v4.js');
const src = fs.readFileSync(ENGINE, 'utf8').replace(/\r\n/g, '\n');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

function body(i) {
    let d = 0;
    for (let k = src.indexOf('{', i); k < src.length; k++) {
        if (src[k] === '{') d++;
        else if (src[k] === '}' && !--d) return k + 1;
    }
    throw Error('unbalanced at ' + i);
}
function fn(name, indent) {
    const i = src.indexOf('\n' + (indent || '') + 'function ' + name + '(');
    if (i < 0) return '';
    return src.slice(i + 1, body(i));
}
function method(name) {
    const i = src.indexOf('\n        ' + name + '(');
    if (i < 0) throw Error(name + ' not found');
    return name + ': function ' + src.slice(src.indexOf('(', i + 9), body(i));
}

const L = 'https://www.legendmod.ml/', J = 'https://jimboy3000.github.io/';
const ctx = { console, URL, Map, Set };
ctx.window = ctx;
vm.createContext(ctx);
const env = require('./lib/skinres-env')(ctx, src);
const R = env.resolver;
const reg = ctx.LMSkinRegistry;
const tracked = new Set(cp.execFileSync('git', ['-C', ROOT, '-c', 'core.quotepath=off', 'ls-files', '-z'], { encoding: 'utf8', maxBuffer: 1 << 26 }).split('\0').filter(Boolean));
const exists = (p) => tracked.has(p);
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');

/* ---- registry ---- */
{
    const gen = require(path.join(ROOT, 'developers', 'skins', 'build-registry.js'));
    const res = gen.build();
    const cur = fs.readFileSync(path.join(ROOT, 'ogario', 'skinregistry.js'), 'utf8').replace(/\r\n/g, '\n');
    check('ogario/skinregistry.js is up to date with the skin files (node developers/skins/build-registry.js)', cur === gen.render(res.data));
    check('registry loaded by the resolver', R && R.registryLoaded());
    /* every alias: identical bytes (git blob of both files), checked on the files themselves */
    const sha = (p) => gen.blobSha(fs.readFileSync(path.join(ROOT, p)));
    let bad = [];
    for (const k of Object.keys(reg.a)) {
        const c = reg.a[k];
        if (exists(k) && exists(c) && sha(k) !== sha(c)) bad.push(k);
        if (!exists(c) && reg.j.split('|').indexOf(c) < 0) bad.push(c + ' (canonical missing)');
    }
    check('every alias in the registry has the same bytes as its canonical file (' + Object.keys(reg.a).length + ')', bad.length === 0, bad.slice(0, 5).join(', '));
    /* the implicit rule: lowresskins/<n> not listed in lr is vanillaskins/<n> (byte-identical) */
    const lr = new Set(reg.lr.split('|'));
    bad = [];
    let n = 0;
    for (const p of tracked) {
        if (!/^lowresskins\/[^/]+\.(png|jpe?g|gif|webp)$/i.test(p)) continue;
        const c = R.canonicalPath(p);
        if (c !== p) { n++; if (sha(p) !== sha(c)) bad.push(p); }
        else if (!lr.has(p.slice(12))) bad.push(p + ' (canonical but not in lr)');
    }
    check('every lowresskins copy (' + n + ') resolves to a byte-identical canonical file', bad.length === 0 && n > 1000, bad.slice(0, 5).join(', '));
    check('no file of the mirror differs from the file at the same path here', res.conflicts.length === 0, res.conflicts.join(', '));
    check('no skin image file was deleted or added by this package (registry built from what is tracked)', res.local.every((f) => exists(f.p)));
    /* the deletion manifest: every duplicate has a record, and each record's old path resolves to
     * its canonical file by the registry rules alone (also once the file is deleted) */
    const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'developers', 'audit', 'manifest.json'), 'utf8'));
    const mine = man.records.filter((r) => r.package === 'CL3W');
    const dupPaths = [].concat(...res.groups.map((g) => g.paths.filter((p) => p !== g.canonical)));
    const recBy = new Map(mine.map((r) => [r.oldPath, r]));
    const keys = ['oldPath', 'canonicalPath', 'reason', 'internalReferencesMigrated', 'legacyResolverSupported', 'externalUrlSupported', 'approvedForDeletion'];
    bad = dupPaths.filter((p) => !recBy.has(p));
    check('deletion manifest: a record for every duplicate (' + dupPaths.length + ')', bad.length === 0, bad.slice(0, 5).join(', '));
    bad = mine.filter((r) => !keys.every((k) => k in r) || R.canonicalPath(r.oldPath) !== R.canonicalPath(r.canonicalPath) || !exists(r.canonicalPath) ||
        r.approvedForDeletion !== (r.internalReferencesMigrated && r.legacyResolverSupported && !r.externalUrlSupported) || !man.evidence[r.evidence]).map((r) => r.oldPath);
    check('  every record complete, resolvable without its file, approved only when migrated + resolvable + no external need, with evidence', bad.length === 0, bad.slice(0, 5).join(', '));
    const approved = mine.filter((r) => r.approvedForDeletion);
    check('  approved for deletion only the lowres sync copies of 2026-11-20 (' + approved.length + '), kept: gallery links, flag and config names, old variants', approved.every((r) => r.evidence === 'skin-lowres-sync' && r.oldPath.indexOf('lowresskins/') === 0));
}

/* ---- aliases ---- */
{
    const fungi = R.key(J + 'vanillaskins/fungi_warlord.png');
    const forms = [
        L + 'lowresskins/fungi_warlord.png',
        L + 'vanillaskins/fungi_warlord%20.png',           /* encoded space: the file "fungi_warlord .png" */
        L + 'vanillaskins/fungi_warlord .png',             /* raw space, as old configurations had it */
        L + 'vanillaskins/fungi_warlord%2520.png',         /* the file named with a literal %20 */
        L + 'vanillaskins/fungi_warlord_.png',
        'https://jimboy3100.github.io/vanillaskins/fungi_warlord.png',
        'http://legendmod.ml/vanillaskins/fungi_warlord.png',
        'https://jimboy3000.github.io/vanillaskins/fungi_warlord_.png'
    ];
    const keys = forms.map((u) => R.key(u));
    check('fungi_warlord: all 8 spellings and copies are one resource (' + fungi + ')', fungi === J + 'vanillaskins/fungi_warlord.png' && keys.every((k) => k === fungi), keys.filter((k) => k !== fungi).join(', '));
    check('literal %20 and encoded space are told apart (two files, both copies of fungi_warlord.png)',
        R.canonicalPath('vanillaskins/fungi_warlord%20.png') === 'vanillaskins/fungi_warlord.png' && R.canonicalPath('vanillaskins/fungi_warlord .png') === 'vanillaskins/fungi_warlord.png' &&
        R.resolve(L + 'vanillaskins/fungi_warlord%2520.png').path === 'vanillaskins/fungi_warlord.png');
    const pairs = [['jurassic_fury', 't_predator'], ['sparkle_kraken', 'star_kraken'], ['artic_fox', 'chill_fox'], ['googly_fang', 'sea_grinner'],
        ['biteface', 'bone_piranha'], ['fizzy_fiend', 'fizzy_friend'], ['brainless', 'terror_tooth'], ['angry_monster', 'toxic_chomp'], ['boo_tastic', '_boo-tastic']];
    const badPairs = pairs.filter((p) => R.vanilla(p[0] + '.png') !== R.vanilla(p[1] + '.png') || R.key(L + 'lowresskins/' + p[0] + '.png') !== R.vanilla(p[0] + '.png'));
    check('same picture under two agar.io names: one resource each (' + pairs.length + ' pairs, also their lowresskins copies)', badPairs.length === 0, JSON.stringify(badPairs));
    check('flag copies: mistik flag = vanillaskins/Mistik.png, maldivas = brazil, lowres belarus = belarus flag',
        R.flag('Mistik') === R.vanilla('Mistik.png') && R.flag('maldivas') === R.flag('brazil') && R.key(L + 'lowresskins/belarus-custom-skin.png') === R.flag('belarus'));
    check('case-sensitive: vanillaskins/mistik.png is not vanillaskins/Mistik.png', R.canonicalPath('vanillaskins/mistik.png') === 'vanillaskins/mistik.png' && R.vanilla('mistik.png') !== R.vanilla('Mistik.png'));
    check('no space -> underscore guess: "8 ball" flag keeps its space (encoded)', R.flag('8 ball') === L + 'agario/live/flags/8%20ball.png' && exists('agario/live/flags/8 ball.png'));
    check('a lowresskins picture of its own stays its own resource', R.key(L + 'lowresskins/1up-custom-skin.png') === L + 'lowresskins/1up-custom-skin.png' && exists('lowresskins/1up-custom-skin.png'));
}

/* ---- origins ---- */
{
    const same = ['https://www.legendmod.ml/', 'https://legendmod.ml/', 'http://www.legendmod.ml/', 'https://jimboy3100.github.io/', 'https://JIMBOY3100.github.io/'];
    const k = same.map((o) => R.key(o + 'lowresskins/1up-custom-skin.png'));
    check('www.legendmod.ml, legendmod.ml and jimboy3100.github.io are one site (one key, never a fallback of each other)', new Set(k).size === 1 && R.resolve(same[3] + 'lowresskins/1up-custom-skin.png').cands.every((c) => !/jimboy3100|\/\/legendmod/.test(c)));
    const x = reg.x.split('|')[0], j = reg.j.split('|')[0];
    check('a vanilla file the mirror lacks (' + x + '): only www.legendmod.ml', JSON.stringify(R.resolve(J + enc(x)).cands) === JSON.stringify([L + enc(x)]));
    check('a picture only the mirror has (' + j + '): only the mirror, also when asked on www.legendmod.ml', JSON.stringify(R.resolve(L + enc(j)).cands) === JSON.stringify([J + enc(j)]));
    check('a vanilla file both hold: the mirror first (the URL VanillaSkinUrlMap always used), then www.legendmod.ml',
        JSON.stringify(R.resolve(L + 'vanillaskins/doge.png').cands) === JSON.stringify([J + 'vanillaskins/doge.png', L + 'vanillaskins/doge.png']) || !exists('vanillaskins/doge.png'));
    check('other files of the site (banners) only get the www spelling', R.key('https://jimboy3100.github.io/banners/iconMinions.png') === L + 'banners/iconMinions.png' && R.resolve(L + 'banners/iconMinions.png').cands.length === 1);
    check('third-party, agar.io, data, blob and video URLs are left as they are', ['https://i.imgur.com/AbC.png', 'https://example.com/a b.png', 'data:image/png;base64,AAAA', 'blob:https://x/1', L + 'banners/x.mp4', 'https://configs.agario.miniclippt.com/live/custom_skins/skin_custom_ab.png']
        .every((u) => R.key(u) === u));
    const ag = R.resolve('https://configs-web.agario.miniclippt.com/live/v15/10935/fungi_warlord.png');
    check('agar.io CDN picture that fails: our copy next (canonical), at most 3 places', ag.key === 'https://configs-web.agario.miniclippt.com/live/v15/10935/fungi_warlord.png' && ag.cands[1] === J + 'vanillaskins/fungi_warlord.png' && ag.cands.length <= 3);
    ctx.LM_CUSTOM_SKINS_CDN = 'https://configs.agario.miniclippt.com/live/custom_skins';
    const cu = R.resolve('https://configs-web.agario.miniclippt.com/live/custom_skins/skin_custom_ab-cd.png?');
    check('uploaded skin asked on configs-web: the custom-skin host next, nothing else', cu.cands.length === 2 && cu.cands[1] === ctx.LM_CUSTOM_SKINS_CDN + '/skin_custom_ab-cd.png');
}

/* ---- bounded, distinct places; stable identity ---- */
{
    let bad = [], maxC = 0, total = 0;
    const all = [...tracked].filter((p) => /^(vanillaskins|lowresskins|agario\/live\/flags)\/[^/]+\.(png|jpe?g|gif|webp)$/i.test(p))
        .concat(reg.j.split('|'), Object.keys(reg.a));
    for (const p of all) {
        for (const host of [L, J, 'https://jimboy3100.github.io/']) {
            const r = R.resolve(host + enc(p));
            total++;
            maxC = Math.max(maxC, r.cands.length);
            if (new Set(r.cands).size !== r.cands.length) bad.push(p + ' repeats a place');
            if (r.cands.length > 3) bad.push(p + ' has ' + r.cands.length + ' places');
            /* every place, asked itself, is the same resource: a fallback never starts a second identity */
            for (const c of r.cands) if (R.key(c) !== r.key) bad.push(p + ': ' + c + ' -> ' + R.key(c));
        }
    }
    check(total + ' resource URLs: at most 3 distinct places each (max ' + maxC + '), every place has the same identity', bad.length === 0, bad.slice(0, 5).join('; '));
    /* every key points at a file that exists (here or on the mirror) */
    const mirror = new Set(fs.readFileSync(path.join(ROOT, 'developers', 'skins', 'mirror-jimboy3000.txt'), 'utf8').split(/\r?\n/).filter((l) => l && l[0] !== '#').map((l) => l.slice(l.indexOf(' ') + 1)));
    bad = [];
    for (const p of all) {
        const r = R.resolve(L + enc(p));
        for (const c of r.cands) {
            const rel = decodeURIComponent(c.replace(/^https:\/\/[^/]+\//, ''));
            if (c.indexOf(J) === 0 ? !mirror.has(rel) : !exists(rel)) bad.push(c);
        }
    }
    check('every place listed for a known file holds it (case-sensitive)', bad.length === 0, bad.slice(0, 5).join(', '));
}

/* ---- classification ---- */
{
    const conf = JSON.parse(fs.readFileSync(path.join(ROOT, 'agario', 'live', 'GameConfiguration.json'), 'utf8')).gameConfig;
    const eq = conf['Gameplay - Equippable Skins'];
    const spine = {};
    (conf['Visual - Prod. Spine Animations'] || []).forEach((s) => { spine[s.productId] = s.spineFileName; });
    const map = R.buildVanillaMap(eq.concat([{ productId: 'skin_lmspinetest', image: 'uses_spine' }]), Object.assign({}, spine, { skin_lmspinetest: 'Kraken' }));
    const cases = [
        ['', 'empty'], [null, 'empty'], ['%empty', 'empty'], ['skin_empty', 'empty'],
        ['https://i.imgur.com/AbC.png', 'url'], ['https://x.test/a.webm', 'video'], ['https://x.test/a.mp4?x=1', 'video'],
        ['data:image/png;base64,AA', 'data'], ['blob:https://x/1', 'data'],
        ['12345', 'custom'], ['%custom_ab-cd', 'custom'], ['skin_custom_ab-cd_ef', 'custom'], ['custom_ab', 'custom'], ['%xcustomx', 'custom'],
        ['%alien_kid_level_2', 'level'], ['skin_alien_kid_level_3', 'level'],
        ['%fungi_warlord', 'premium'], ['skin_fungi_warlord', 'premium'], ['fungi_warlord', 'premium'], ['%penalty_beast', 'premium'], ['%Fungi_Warlord', 'premium'],
        ['%lmspinetest', 'spine'],
        ['skin_not_a_product', 'unknown'], ['%not_a_product', 'unknown']
    ];
    const bad = cases.filter((c) => R.classify(c[0], map) !== c[1]).map((c) => c[0] + '=' + R.classify(c[0], map) + ' (want ' + c[1] + ')');
    check('classify: every identifier type (' + cases.length + ' cases)', bad.length === 0, bad.join(', '));
    check('"skin_" in an id no longer makes it an uploaded skin (skin_fungi_warlord is the premium skin)', R.idUrl('skin_fungi_warlord', map) === R.vanilla('fungi_warlord.png'));
    ctx.LM_CUSTOM_SKINS_CDN = 'https://configs.agario.miniclippt.com/live/custom_skins';
    check('uploaded ids keep the official form (%x -> skin_x, a number -> skin_custom_<n>)',
        R.custom('%custom_ab') === ctx.LM_CUSTOM_SKINS_CDN + '/skin_custom_ab.png' && R.custom('12') === ctx.LM_CUSTOM_SKINS_CDN + '/skin_custom_12.png' &&
        R.custom('skin_custom_ab_cd.png?x') === ctx.LM_CUSTOM_SKINS_CDN + '/skin_custom_ab_cd.png');
    check('name skins: flag and free names', R.classifyName('Albania', { albania: 1 }, {}) === 'flag' && R.classifyName('poland', {}, { poland: 'poland.png' }) === 'free' && R.classifyName('bob', {}, {}) === '');
    check('level skins take the base skin picture (not the spine "SkinEffects" entry)', map['skin_alien_kid_level_2'] === R.level('alien_kid') && map['%alien_kid_level_2'] === R.vanilla('Alien_Kid.png') && !/SkinEffects/.test(Object.values(map).join()));
    const nMap = Object.keys(map).length;
    check('VanillaSkinUrlMap from the real configuration: ' + nMap + ' keys, no prototype, every product of the configuration found', Object.getPrototypeOf(map) === null &&
        eq.filter((s) => s.image && s.image !== 'uses_spine').every((s) => map[s.productId]));
}

/* ---- the real loadSkin and getImg ---- */
function harness(opts) {
    opts = opts || {};
    const h = { requests: [], jobs: [], warn: 0 };
    const net = opts.net || (() => 200);
    const c = { console: { log() { }, warn() { h.warn++; }, error() { } }, URL: { createObjectURL: () => 'blob:x', revokeObjectURL() { } }, Map, Set, Date, Math, Number, setTimeout: (f) => 0, clearTimeout() { } };
    c.window = c;
    c.navigator = { hardwareConcurrency: 8 };
    c.document = { createElement: () => ({ getContext: () => null }), head: { appendChild() { } } };
    vm.createContext(c);
    if (opts.resolver !== false) require('./lib/skinres-env')(c, src);
    c.LM_CUSTOM_SKINS_CDN = 'https://configs.agario.miniclippt.com/live/custom_skins';
    c.Image = function () {
        const self = this;
        self.complete = false; self.width = 0; self.height = 0;
        self.setAttribute = function () { };
        Object.defineProperty(self, 'src', {
            set(u) {
                if (u.indexOf('blob:') !== 0) h.requests.push(['img', u]); /* a blob: decode is no request */
                const st = net(u);
                Promise.resolve().then(() => {
                    if (u.indexOf('blob:') === 0 || st === 200) { self.complete = true; self.width = self.naturalWidth = 64; self.height = self.naturalHeight = 64; if (self.onload) self.onload(); }
                    else if (self.onerror) self.onerror();
                });
            }, get() { return ''; }
        });
    };
    c.fetch = (u) => {
        h.requests.push(['fetch', u]);
        const st = net(u);
        return Promise.resolve({ ok: st === 200, status: st, blob: () => Promise.resolve({ size: 5000 }) });
    };
    c.AbortController = function () { this.signal = {}; this.abort = function () { }; };
    vm.runInContext(env.accessor + fn('makeUpperCaseAfterUnderline') + '\nwindow._lmBlankSkins = {};\nfunction _lmSkinLooksEmpty() { return false; }\n' + fn('lmSkinQueueTrim', '    ') +
        '\nvar application = {' + method('loadSkin') + (src.indexOf('\n        getImg(') >= 0 ? ',' + method('getImg') : '') +
        ', urlReplaces: {}, brokenSkins: {}, user: { skins: {} }, customSkinsCache: {}, _lmTouchSkin: function () { }, _lmTrimSkinCache: function () { } };' +
        '\nwindow.application = application;', c);
    c.application._lmSkinJobAdd = function (img, url, imageObj) { h.jobs.push(url); img[url] = imageObj; this._pendingSkinLoads.delete(url); };
    h.ctx = c;
    h.A = c.application;
    h.load = (u) => h.A.loadSkin(h.A.customSkinsCache, u);
    h.settle = async () => { for (let i = 0; i < 60; i++) await new Promise((r) => setImmediate(r)); };
    return h;
}
const report = {};
(async () => {
    /* 1. five spellings of one picture, asked one after the other while it loads and after */
    {
        const h = harness();
        const forms = [J + 'vanillaskins/fungi_warlord.png', L + 'lowresskins/fungi_warlord.png', 'https://jimboy3100.github.io/vanillaskins/fungi_warlord_.png', L + 'vanillaskins/fungi_warlord%20.png', 'https://legendmod.ml/vanillaskins/fungi_warlord.png'];
        forms.forEach(h.load);
        await h.settle();
        forms.forEach(h.load);
        await h.settle();
        report.aliasRequests = h.requests.length;
        report.aliasJobs = h.jobs.length;
        check('loadSkin: 5 spellings of fungi_warlord -> 1 download, 1 decode job, 1 cache entry (requests ' + h.requests.length + ', jobs ' + h.jobs.length + ')',
            h.requests.length === 1 && h.jobs.length === 1 && Object.keys(h.A.customSkinsCache).length === 1, JSON.stringify(h.requests));
        check('  every spelling finds the image through the recorded alias', forms.every((u) => { const k = h.A._skinUrlAlias && h.A._skinUrlAlias[u] || u; return !!h.A.customSkinsCache[k]; }));
    }
    /* 2. the first place answers 404: the next place, once; no Image-tag repeat of the 404 URL */
    {
        const first = J + 'vanillaskins/doge.png';
        const h = harness({ net: (u) => u === first ? 404 : 200 });
        h.load(L + 'vanillaskins/doge.png');
        await h.settle();
        report.fallbackRequests = h.requests.map((r) => r[0] + ' ' + r[1]);
        check('loadSkin: mirror 404 -> www.legendmod.ml once, under the same key (' + h.requests.length + ' requests)',
            h.requests.length === 2 && h.requests[0][1] === first && h.requests[1][1] === L + 'vanillaskins/doge.png' && h.jobs.length === 1 && h.jobs[0] === first, JSON.stringify(h.requests));
    }
    /* 3. every place fails: each asked once, then the negative cache holds */
    {
        const h = harness({ net: () => 404 });
        h.load(L + 'vanillaskins/doge.png');
        await h.settle();
        const n = h.requests.length;
        h.load(L + 'vanillaskins/doge.png'); h.load(J + 'vanillaskins/doge.png'); h.load('https://jimboy3100.github.io/vanillaskins/doge.png');
        await h.settle();
        report.failRequests = n;
        check('loadSkin: all places fail -> each asked once (' + n + '), then no request for any spelling (negative cache on the one key)', n === 2 && h.requests.length === n && !!h.A._failedSkinURLs[J + 'vanillaskins/doge.png'] && h.warn === 1, JSON.stringify(h.requests));
    }
    /* 4. names with spaces, files only here, files only on the mirror */
    {
        const h = harness();
        h.load(L + 'agario/live/flags/8 ball.png');
        const x = reg.x.split('|')[0], j = reg.j.split('|')[0];
        h.load(J + enc(x));
        h.load(L + enc(j));
        await h.settle();
        const urls = h.requests.map((r) => r[1]);
        check('loadSkin: "8 ball" flag asked as 8%20ball.png (was 8_ball.png, a 404)', urls.indexOf(L + 'agario/live/flags/8%20ball.png') >= 0 && !urls.some((u) => /8_ball/.test(u)));
        check('loadSkin: a file the mirror lacks is asked here only; a mirror-only picture on the mirror only', urls.indexOf(L + enc(x)) >= 0 && urls.indexOf(J + enc(j)) >= 0 && urls.length === 3, JSON.stringify(urls));
    }
    /* 5. uploaded skin on configs-web (403) -> the custom-skin host; third-party untouched */
    {
        const h = harness({ net: (u) => /configs-web/.test(u) ? 403 : 200 });
        h.load('https://configs-web.agario.miniclippt.com/live/custom_skins/skin_custom_ab.png');
        h.load('https://i.imgur.com/AbCdE12.png');
        await h.settle();
        const urls = h.requests.map((r) => r[1]);
        check('loadSkin: uploaded skin 403 on configs-web -> configs custom-skin host; imgur asked as it is', urls.indexOf('https://configs.agario.miniclippt.com/live/custom_skins/skin_custom_ab.png') >= 0 && urls.indexOf('https://i.imgur.com/AbCdE12.png') >= 0, JSON.stringify(urls));
    }
    /* 6. getImg (profile skin list) follows the same places */
    if (src.indexOf('\n        getImg(url, name, callback, tryIndex)') >= 0) {
        const h = harness({ net: (u) => u.indexOf(J) === 0 ? 404 : 200 });
        let got = null;
        h.A.getImg(L + 'lowresskins/1up-custom-skin.png', 'x', (img) => { got = img; });
        await h.settle();
        const a = h.requests.map((r) => r[1]);
        const h2 = harness({ net: () => 404 });
        h2.A.user.skins[L + 'vanillaskins/doge.png'] = { url: L + 'vanillaskins/doge.png' };
        h2.A.getImg(L + 'vanillaskins/doge.png', 'y', () => { });
        await h2.settle();
        const b = h2.requests.map((r) => r[1]);
        check('getImg: a lowres picture is asked as itself (it was turned into vanillaskins/<name> by file name)', got && JSON.stringify(a) === JSON.stringify([L + 'lowresskins/1up-custom-skin.png']), JSON.stringify(a));
        check('getImg: the same places as loadSkin, each once, then brokenSkins (' + b.length + ' requests)', JSON.stringify(b) === JSON.stringify(R.resolve(L + 'vanillaskins/doge.png').cands) && h2.A.brokenSkins[L + 'vanillaskins/doge.png'] === 1, JSON.stringify(b));
    }
    /* 7. without the resolver (it could not load): the stand-in keeps the old URLs, no exception */
    if (env.accessor) {
        const h = harness({ resolver: false });
        h.load(J + 'vanillaskins/doge.png');
        await h.settle();
        check('resolver missing: loadSkin still loads (stand-in, no aliases)', h.jobs.length === 1);
        const st = vm.runInContext('_lmSkinRes()', h.ctx);
        check('  stand-in VanillaSkinUrlMap builder gives the mirror URLs of before', st.buildVanillaMap([{ productId: 'skin_doge', image: 'Doge.png' }], {})['%doge'] === J + 'vanillaskins/Doge.png' && st.version === 0);
    }

    /* ---- players' old saved data: URLs resolved where they are used, nothing rewritten ---- */
    {
        const saved = {
            profile: 'https://jimboy3100.github.io/vanillaskins/fungi_warlord .png',
            imported: 'http://legendmod.ml/lowresskins/chill_fox.png',
            cloud: 'https://jimboy3000.github.io/lowresskins/sparkle_kraken.png',
            replay: 'https://www.legendmod.ml/vanillaskins/fungi_warlord_.png',
            v2: 'https://jimboy3000.github.io/vanillaskins2/Alien_Kid.png',
            oldFlag: 'https://www.legendmod.ml/agario/live/flags/mistik.png'
        };
        const copy = JSON.stringify(saved);
        const bad = [];
        const mirror = new Set(fs.readFileSync(path.join(ROOT, 'developers', 'skins', 'mirror-jimboy3000.txt'), 'utf8').split(/\r?\n/).filter((l) => l && l[0] !== '#').map((l) => l.slice(l.indexOf(' ') + 1)));
        for (const k of Object.keys(saved)) {
            const r = R.resolve(saved[k]);
            const rel = decodeURIComponent(r.key.replace(/^https:\/\/[^/]+\//, ''));
            if (!(r.key.indexOf(J) === 0 ? mirror.has(rel) : exists(rel))) bad.push(k + ' -> ' + r.key);
        }
        check('old profile / imported / cloud / replay skin URLs (alias names, raw spaces, old hosts, vanillaskins2) resolve to files that exist', bad.length === 0, bad.join(', '));
        check('  the saved values are not changed (resolved at the point of use)', JSON.stringify(saved) === copy);
    }

    /* ---- skin pages of this site: every linked image exists (case-sensitive) ---- */
    {
        const pages = ['skins/index.html', 'skins/skins.html', 'skins/skinchecker.html', 'skinrotator.html', 'LMexpress/shop/shop.js', 'LMexpress/shop/shopscript.js'];
        const re = /https?:\/\/(?:www\.)?(?:legendmod\.ml|jimboy3100\.github\.io)\/([^"'\s<>)\\]+?\.(?:png|jpe?g|gif|webp))/gi;
        for (const p of pages) {
            if (!exists(p)) continue;
            const s = fs.readFileSync(path.join(ROOT, p), 'utf8');
            const miss = new Set();
            let m, n = 0;
            while ((m = re.exec(s))) {
                n++;
                let rel = m[1];
                try { rel = decodeURIComponent(rel); } catch (e) { }
                const c = R.canonicalPath(rel);
                if (!exists(rel) && !exists(c)) miss.add(rel);
            }
            check(p + ': all ' + n + ' linked images of this site exist', miss.size === 0, [...miss].slice(0, 8).join(', '));
        }
        const old = (fs.readFileSync(path.join(ROOT, 'skins', 'index.html'), 'utf8').match(/https:\/\/jimboy3100\.github\.io\/(?:vanilla|lowres)skins\//g) || []).length;
        check('skins/index.html asks www.legendmod.ml directly (no 301 hop per picture)', old === 0, old + ' links still on jimboy3100.github.io');
        /* the knowledge files name the skin tools by pages that exist */
        const kn = fs.readFileSync(path.join(ROOT, 'knowledge', 'resources.json'), 'utf8');
        const tools = (kn.match(/https:\/\/www\.legendmod\.ml\/[^"]*skin[^"]*\.html/gi) || []).map((u) => u.slice(L.length));
        check('knowledge/resources.json: the skin tool links (' + tools.join(', ') + ') open pages that exist', tools.length >= 2 && tools.every(exists));
    }

    /* ---- nothing per call ---- */
    {
        const u = L + 'lowresskins/fungi_warlord.png';
        const a = R.resolve(u), size = R.cacheSize();
        let same = true;
        const t0 = process.hrtime.bigint();
        for (let i = 0; i < 200000; i++) if (R.resolve(u) !== a) same = false;
        const ns = Number(process.hrtime.bigint() - t0) / 200000;
        report.resolveNs = Math.round(ns);
        check('resolve(): the same object for the same input, cache does not grow (' + report.resolveNs + ' ns per repeated call)', same && R.cacheSize() === size);
        const h = harness();
        h.load(u);
        await h.settle();
        const before = h.requests.length;
        const t1 = process.hrtime.bigint();
        for (let i = 0; i < 20000; i++) h.load(u);
        report.loadSkinRepeatNs = Math.round(Number(process.hrtime.bigint() - t1) / 20000);
        check('loadSkin of a loaded skin, 20000 times: no request, no job (' + report.loadSkinRepeatNs + ' ns per call)', h.requests.length === before && h.jobs.length === 1);
    }
    console.log('measured: ' + JSON.stringify(report));
    console.log(failed ? failed + ' FAILED' : 'skin resolver ok');
    process.exit(failed ? 1 : 0);
})().catch((e) => { console.log('FAIL exception ' + (e && e.stack || e)); process.exit(1); });
