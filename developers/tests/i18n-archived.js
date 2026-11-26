#!/usr/bin/env node
// The scanner leaves "archived" pages (developers/i18n/scan-config.json "archived") out of its counts.
// This checks that each of them really is unreachable: no live script or page links to it outside
// comments, except from a function that nothing calls.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
const config = JSON.parse(fs.readFileSync(path.join(repo, 'developers', 'i18n', 'scan-config.json'), 'utf8'));
const archived = Object.keys(config.archived || {});
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };

/* a link that sits inside a function no live code calls (the call is commented out) */
const DEAD_FN = {
    'extras/banneranimated2applyingskins.html': 'BeforeChangingSkins',
    'extras/nobots.html': 'LMnoBotsPromo'
};
/* old copies kept for the record: an archived page linked only from them stays archived */
const NOT_LIVE = /^(languages\/|developers\/(?!videoskins\.html)|extras\/website\/|agarscripts\/goodoldlegendmod\.user\.js$|LMexpress\/LMImplementsStart\.js$)/;

const strip = (src, file) => (/\.html?$/i.test(file) ? src.replace(/<!--[\s\S]*?-->/g, ' ') : src)
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:\\'"])\/\/[^\n]*/g, '$1');

const files = execSync('git ls-files', { cwd: repo, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n')
    .filter((f) => /\.(js|html?)$/i.test(f) && !/\.min\.js$/.test(f) && !NOT_LIVE.test(f) && archived.indexOf(f) < 0);
const live = files.map((f) => {
    let src = '';
    try { src = fs.readFileSync(path.join(repo, f), 'utf8'); } catch (e) { }
    return { f, src: strip(src, f) };
});

archived.forEach((a) => {
    ok(fs.existsSync(path.join(repo, a)), 'archived file is missing: ' + a);
    const base = path.basename(a);
    /* a folder's index.html is linked as the folder (dir/ or dir/index.html); dir/style.css is not a link to it */
    const dirRe = base === 'index.html' ? new RegExp(path.dirname(a).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/(index\\.html)?(["\'#?\\s<)`]|$)', 'm') : null;
    /* the file name on its own, not inside a longer word (loader.html is not $.preloader.html()) */
    const baseRe = new RegExp('(^|[^\\w.-])' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const hits = live.filter((x) => (dirRe ? dirRe.test(x.src) : baseRe.test(x.src)));
    const fn = DEAD_FN[a];
    if (!fn) { ok(hits.length === 0, a + ' is linked from live code: ' + hits.map((h) => h.f).join(', ')); return; }
    /* every link sits in that function, and no live code calls it */
    const callRe = new RegExp('(^|[^\\w$.])' + fn + '\\s*\\(', 'g');
    const defRe = new RegExp('function\\s+' + fn + '\\s*\\(', 'g');
    const calls = live.reduce((n, x) => n + (x.src.match(callRe) || []).length - (x.src.match(defRe) || []).length, 0);
    ok(calls === 0, a + ': ' + fn + '() is called ' + calls + ' time(s)');
    hits.forEach((h) => {
        const at = h.src.indexOf(base);
        const d = h.src.lastIndexOf('function ', at);
        ok(d >= 0 && h.src.slice(d, d + 9 + fn.length) === 'function ' + fn, a + ' is linked from ' + h.f + ' outside ' + fn + '()');
    });
});
/* the loader of the archived Implements banner is not loaded by anything */
ok(!live.some((x) => x.src.indexOf('LMImplementsStart') >= 0), 'LMImplementsStart.js is loaded by live code');

console.log(archived.length + ' archived pages checked');
console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
process.exit(fails ? 1 : 0);
