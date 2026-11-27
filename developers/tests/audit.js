#!/usr/bin/env node
// The repository audit tool (developers/audit/): reference extraction on small inputs, then a whole run
// on a throw-away git repository with known files (entry points, a sitemap page, a dynamic banner
// path, an identical copy, two files that only use each other, an archived page, a JSON-escaped
// address, a missing file), checking the class of every file and the missing-reference list.
// Usage: node developers/tests/audit.js
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
const R = require('../audit/references');
const A = require('../audit/audit');

let fails = 0, checks = 0;
const ok = (c, m) => { checks++; if (!c) { fails++; console.log('FAIL ' + m); } };
const cfg = { own: new Set(['www.legendmod.ml', 'legendmod.ml', 'jimboy3100.github.io']), mirror: new Set(['jimboy3000.github.io']), ownRepo: 'jimboy3100/jimboy3100.github.io', pu: {} };
function fakeInv(paths) {
    const exist = new Set(paths), dirs = new Set(), lower = new Map();
    for (const p of paths) {
        let i = p.indexOf('/');
        while (i >= 0) { dirs.add(p.slice(0, i)); i = p.indexOf('/', i + 1); }
        lower.set(p.toLowerCase(), [p]);
    }
    for (const d of dirs) if (!lower.has(d.toLowerCase())) lower.set(d.toLowerCase(), [d]);
    return { exist, dirs, lower, sorted: Array.from(exist).sort() };
}
const inv = fakeInv(['index.html', 'play.html', 'banners/a.png', 'banners/b.png', 'skins/index.html', 'Lc/Lc.html',
    'lib/x.js', 'css/site.css', 'img/bg.jpg', 'nicks/emoji/DisMojiPicker[1].js', 'ext/manifest.json', 'ext/content.js',
    'ext/_locales/en/messages.json', 'ext/_locales/de/messages.json', 'ext/icon16.png', 'fungi .png']);
const ex = (rel, text) => R.extract(rel, text, { cfg, inv });
const find = (r, raw) => r.refs.find((x) => x.raw === raw);

/* GitHub Pages resolution */
ok(R.resolvePath('', inv).path === 'index.html', 'site root is index.html');
ok(R.resolvePath('skins/', inv).path === 'skins/index.html' && R.resolvePath('skins', inv).path === 'skins/index.html', 'folder index.html');
ok(R.resolvePath('play', inv).path === 'play.html', 'extensionless page');
ok(R.resolvePath('lc/lc.html', inv).status === 'case', 'letter case differs: not found on GitHub Pages');
ok(R.resolvePath('fungi%20.png', inv).path === 'fungi .png', 'encoded space');
ok(R.resolvePath('banners', inv).status === 'dir', 'folder without index.html');

/* absolute addresses, comments, dynamic patterns */
let r = ex('a.js', "var a = 'https://www.legendmod.ml/banners/a.png?v=1';\n// var b = 'https://www.legendmod.ml/gone.png';\n" +
    "img.src = 'https://www.legendmod.ml/banners/' +\n  name +\n  '.png';\nvar c = `https://jimboy3100.github.io/lib/${f}.js`;\n" +
    "var base = 'https://www.legendmod.ml/cursors/cursor_', i = 0;\nvar s = 'https://www.legendmod.ml/missing.js';\n" +
    "var e = 'https://www.legendmod.ml/banners/' + 'b.png';\nvar re = /https:\\/\\/x\\.com/; var q = 'https://www.legendmod.ml/play.html';\n");
ok(find(r, 'https://www.legendmod.ml/banners/a.png?v=1').target === 'banners/a.png', 'absolute URL with a query');
ok(find(r, 'https://www.legendmod.ml/gone.png').comment === true, 'reference in a comment is marked');
ok(r.patterns.some((p) => p.prefix === 'banners/' && p.suffix === '.png'), "'dir/' + name + '.png' is a pattern: " + JSON.stringify(r.patterns));
ok(r.patterns.some((p) => p.prefix === 'lib/' && p.suffix === '.js'), 'template literal is a pattern');
ok(r.patterns.some((p) => p.prefix === 'cursors/cursor_' && p.how === 'base'), 'a base address completed later is a pattern, not a missing file');
ok(find(r, 'https://www.legendmod.ml/missing.js').status === 'missing', 'missing file found');
ok(r.refs.some((x) => x.target === 'banners/b.png' && x.status === 'ok'), 'static concatenation is one address');
ok(find(r, 'https://www.legendmod.ml/play.html').comment === false, 'a regex literal does not start a comment');
r = ex('b.json', '{"skin":"https:\\/\\/jimboy3100.github.io\\/banners\\/a.png","gone":"https:\\/\\/www.legendmod.ml\\/x\\/y.png"}');
ok(r.refs.some((x) => x.target === 'banners/a.png'), 'JSON-escaped address');
ok(r.refs.some((x) => x.path === 'x/y.png' && x.status === 'missing'), 'JSON-escaped missing address');
r = ex('c.md', 'See https://jimboy3100.github.io/skins/]. and [x](https://www.legendmod.ml/nicks/emoji/DisMojiPicker[1].js) or https://www.legendmod.ml/play.html.');
ok(r.refs.every((x) => x.status === 'ok'), 'markdown and prose punctuation: ' + JSON.stringify(r.refs.map((x) => x.raw + ' ' + x.status)));
r = ex('d.js', "throw 'at https://www.legendmod.ml/play.html:120:5'; x('https://www.legendmod.ml:8443/x');");
ok(r.refs.length === 1 && r.refs[0].status === 'ok', 'stack position and other ports: ' + JSON.stringify(r.refs));

/* HTML, CSS, manifests */
r = ex('Lc/page.html', '<!doctype html><html><head><link rel="stylesheet" href="../css/site.css"><link rel="preconnect" href="https://fonts.gstatic.com">' +
    '<style>body{background:url(/img/bg.jpg)}</style></head><body><img srcset="../banners/a.png 1x, ../banners/b.png 2x">' +
    '<a href="Lc.html">x</a><a href="#top">t</a><a href="mailto:a@b.c">m</a><img src="nothere.png"><!-- <img src="old.png"> -->' +
    "<script>var u = 'img/' + n; if (i<n) { x = '<img src=\"y\">'; }</script></body></html>");
ok(find(r, '../css/site.css').target === 'css/site.css', 'relative href');
ok(find(r, '/img/bg.jpg') && find(r, '/img/bg.jpg').target === 'img/bg.jpg', 'url() in a style block');
ok(find(r, '../banners/b.png').target === 'banners/b.png', 'srcset');
ok(find(r, 'Lc.html').target === 'Lc/Lc.html', 'link to a page');
ok(find(r, 'nothere.png').status === 'missing' && find(r, 'nothere.png').strict, 'missing image');
ok(find(r, 'old.png').comment === true, 'HTML comment');
ok(!r.refs.some((x) => x.raw === '#top' || x.raw.startsWith('mailto')), 'anchors and mail links are not files');
r = ex('css/site.css', '@import "fonts.css"; .a{background:url("../img/bg.jpg")} .b{background:url(data:image/png;base64,AA)}');
ok(find(r, '../img/bg.jpg').target === 'img/bg.jpg' && find(r, 'fonts.css').status === 'missing', 'style sheet url() and @import');
r = ex('ext/manifest.json', JSON.stringify({ manifest_version: 3, default_locale: 'en', icons: { 16: 'icon16.png' }, content_scripts: [{ js: ['content.js', 'gone.js'] }] }));
ok(r.refs.some((x) => x.target === 'ext/content.js') && r.refs.some((x) => x.target === 'ext/_locales/de/messages.json'), 'extension manifest and every locale');
ok(r.refs.some((x) => x.raw === 'gone.js' && x.status === 'missing'), 'missing extension script');

/* this repository's rules: build scripts, their outputs and files a probe reads are not "unused"
   (nothing links them, so without a rule they were UNREACHABLE: deletion candidates) */
{
    const { globMatcher, readJson } = require('../audit/inventory');
    const root = path.resolve(__dirname, '..', '..');
    const exr = readJson(path.join(root, 'developers', 'audit', 'exceptions.json'));
    const pu = readJson(path.join(root, 'developers', 'audit', 'public-urls.json'));
    const rule = globMatcher(exr.rules), compat = globMatcher(pu.compatibility.map((e) => e.path));
    const want = { 'developers/extension-zip.js': 'DEVELOPMENT', 'developers/bots-zip.js': 'DEVELOPMENT', 'developers/bench/pixi-mesh.js': 'DEVELOPMENT',
        'LMexpress/LegendExpressExtension-firefox.zip': 'GENERATED', 'ExampleScripts/agario-bots2/agario-bots.zip': 'GENERATED',
        'agario/bundle_start.js': 'DEVELOPMENT', 'ogario/protocols/Legendworld.md': 'DEVELOPMENT' };
    for (const p of Object.keys(want)) {
        ok(fs.existsSync(path.join(root, p)), p + ' is in the repository');
        ok((rule(p) || {}).class === want[p], p + ' is ' + want[p] + ' by exceptions.json (got ' + JSON.stringify(rule(p)) + ')');
    }
    ok((rule('agario/bundle_end.js') || {}).class === 'HISTORICAL', 'the other agar.io client copies stay historical');
    ok(!rule('LMexpress/LegendExpressExtension.zip'), 'the Chrome extension download keeps its class from its links');
    ok(!!compat('LMexpress/privacy.html'), 'the old extension privacy address is a compatibility address');
}

/* a whole run on a small git repository */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-audit-test-'));
try {
    const w = (p, s) => { fs.mkdirSync(path.dirname(path.join(tmp, p)), { recursive: true }); fs.writeFileSync(path.join(tmp, p), s); };
    const png = (n) => Buffer.from('PNG' + n);
    w('developers/audit/public-urls.json', JSON.stringify({ hosts: { own: ['www.legendmod.ml', 'jimboy3100.github.io'], mirror: [], ownRepo: 'jimboy3100/jimboy3100.github.io' },
        sitemaps: ['sitemap.xml'], entryPoints: [{ path: 'play.html', why: 'game' }, { path: 'index.html', why: 'home' }],
        compatibility: [{ path: 'old/redirect.html', why: 'old address' }], dataDrivenCollections: [{ glob: 'skins/**', why: 'names from data' }], crossRepos: [] }));
    w('developers/audit/exceptions.json', JSON.stringify({ rules: [{ glob: 'developers/**', class: 'DEVELOPMENT', why: 'tools' }, { glob: 'gen/*.js', class: 'GENERATED', why: 'build' }],
        historicalRoots: [], missingAllowed: [{ from: 'old/redirect.html', paths: ['old/gone.png'], why: 'kept' }], integrityIgnoreSources: [] }));
    w('developers/i18n/scan-config.json', JSON.stringify({ archived: { 'extras/promo.html': 'no link' } }));
    w('sitemap.xml', '<urlset><url><loc>https://www.legendmod.ml/</loc></url><url><loc>https://www.legendmod.ml/faq.html</loc></url></urlset>');
    w('index.html', '<a href="faq.html">faq</a><script src="https://www.legendmod.ml/js/main.js"></script>');
    w('faq.html', '<img src="banners/faq.png">');
    w('play.html', '<script src="js/game.js"></script><script src="gen/lang.js"></script>');
    w('js/main.js', "loadIcon('iconStar'); function loadIcon(v) { img.src = 'https://www.legendmod.ml/banners/' + v + '.png'; }\n" +
        "var s = 'https://www.legendmod.ml/skins/' + name + '.png';\nvar c = '{\"bg\":\"https:\\\\/\\\\/www.legendmod.ml\\\\/banners\\\\/saved.png\"}';\n");
    w('js/game.js', "var x = 'https://www.legendmod.ml/banners/missing.png'; // see banners/note.png\n");
    w('gen/lang.js', 'x');
    w('banners/iconStar.png', png(1)); w('banners/iconOther.png', png(2)); w('banners/faq.png', png(3));
    w('banners/saved.png', png(4)); w('banners/copy.png', png(1)); w('banners/note.png', png(5));
    w('skins/Zebra.png', png(6));
    w('old/redirect.html', '<img src="gone.png"><script src="../js/oldlib.js"></script>');
    w('js/oldlib.js', 'x()');
    w('extras/promo.html', '<img src="../banners/promo.png">'); w('banners/promo.png', png(7));
    w('abandoned/a.html', '<a href="b.html">b</a><img src="pic.png">'); w('abandoned/b.html', '<a href="a.html">a</a>'); w('abandoned/pic.png', png(8));
    w('lonely.txt', 'nothing');
    w('developers/tool.js', 'tool()');
    const g = (args) => cp.execFileSync('git', args, { cwd: tmp, stdio: ['ignore', 'pipe', 'ignore'] });
    g(['init', '-q']); g(['add', '.']);
    g(['-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 't']);
    w('untracked.html', '<img src="banners/faq.png"><img src="banners/nope.png">');

    const ctx = A.load(tmp, { cross: false });
    const res = A.classify(ctx);
    const cls = (p) => (res.byPath.get(p) || {}).class;
    const expect = {
        'index.html': 'ACTIVE', 'play.html': 'ACTIVE', 'faq.html': 'ACTIVE', 'js/main.js': 'ACTIVE', 'js/game.js': 'ACTIVE',
        'banners/faq.png': 'ACTIVE', 'banners/iconStar.png': 'ACTIVE', 'banners/saved.png': 'ACTIVE', 'skins/Zebra.png': 'ACTIVE',
        'gen/lang.js': 'GENERATED', 'developers/tool.js': 'DEVELOPMENT', 'old/redirect.html': 'COMPATIBILITY', 'js/oldlib.js': 'COMPATIBILITY',
        'extras/promo.html': 'HISTORICAL', 'banners/promo.png': 'HISTORICAL', 'banners/copy.png': 'DUPLICATE',
        'banners/iconOther.png': 'UNKNOWN', 'banners/note.png': 'UNKNOWN', 'abandoned/a.html': 'UNREACHABLE', 'lonely.txt': 'UNREACHABLE'
    };
    for (const p of Object.keys(expect)) ok(cls(p) === expect[p], p + ' is ' + expect[p] + ' (got ' + cls(p) + ', ' + ((res.byPath.get(p) || {}).why || '') + ')');
    ok(!res.byPath.has('untracked.html'), 'only tracked files are classified');
    ok(res.orphans.some((o) => o.files.join() === 'abandoned/a.html,abandoned/b.html,abandoned/pic.png'), 'files that only use each other form one group: ' + JSON.stringify(res.orphans));
    ok(res.groups.length === 1 && res.groups[0].paths.join() === 'banners/copy.png,banners/iconStar.png', 'identical files');
    const missing = A.missingRefs(ctx).filter((m) => !m.comment);
    const al = A.allowedMatcher(ctx.ex.missingAllowed);
    const bad = missing.filter((m) => !al.find(m)).map((m) => m.from + ' ' + m.path).sort();
    ok(bad.join('|') === 'js/game.js banners/missing.png|untracked.html banners/nope.png', 'missing references (new untracked file included, listed one allowed): ' + bad.join('|'));
    ok(al.stale().length === 0, 'allowed entry is still needed');
    fs.rmSync(path.join(tmp, 'banners', 'faq.png'));
    const ctx2 = A.load(tmp, { cross: false });
    ok(A.missingRefs(ctx2).some((m) => m.from === 'faq.html' && m.path === 'banners/faq.png'), 'a file deleted in the working tree is reported where it is used');
} finally {
    fs.rmSync(tmp, { recursive: true, force: true });
}

console.log(checks + ' checks, ' + fails + ' failed');
process.exit(fails ? 1 : 0);
