#!/usr/bin/env node
// developers/REPOSITORY.md names real files: every path it writes in backticks (a file, a folder ending
// in "/", a pattern with * or ...) is a tracked path, from the root or, in a row of the "What lives
// where" table, inside a folder named in that row's first cell. A wrong path there (a protected file
// named at the wrong place) would let someone delete the real one.
// Usage: node developers/tests/repodoc.js [repo]
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };

const tracked = execSync('git -c core.quotepath=off ls-files', { cwd: repo, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n').filter(Boolean);
const esc = (s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
/* a token as a pattern of tracked paths: "..." and "*" stand for any part of one name */
function matcher(p) {
    const re = new RegExp('^' + p.split('...').map((x) => esc(x).replace(/\*/g, '[^/]*')).join('[^/]*') + (p.endsWith('/') ? '' : '$'));
    return (f) => re.test(f);
}
const exists = (p, files) => files.some(matcher(p));
/* a path-like token: no spaces, has a dot or a slash, not a command or a field name */
const isPath = (t) => !/\s/.test(t) && /[./]/.test(t) && !/^\.\.?$/.test(t);

/* the checker itself, on made-up trees */
const T = ['a/b.js', 'a/c/d.txt', 'root.txt', 'k/lm-en.js'];
[['a/b.js', true], ['a/c/', true], ['b.js', false], ['a/x.js', false], ['k/lm-*.js', true], ['ro...txt', true], ['a/*.css', false]]
    .forEach(([p, want]) => ok(exists(p, T) === want, 'checker self-check: ' + p + ' should ' + (want ? '' : 'not ') + 'be found'));

const doc = fs.readFileSync(path.join(repo, 'developers', 'REPOSITORY.md'), 'utf8');
let checked = 0;
doc.split(/\r?\n/).forEach((line, i) => {
    const cells = line.startsWith('|') ? line.split('|').slice(1, -1) : null;
    if (cells && /^\s*-+\s*$/.test(cells[0] || '')) return;
    const toks = (s) => (s.match(/`[^`]+`/g) || []).map((t) => t.slice(1, -1)).filter(isPath);
    /* the folders a table row is about: its first cell */
    const bases = [''].concat(cells ? toks(cells[0]).filter((t) => t.endsWith('/')) : []);
    toks(line).forEach((t) => {
        checked++;
        ok(bases.some((b) => exists(b + t, tracked)), 'developers/REPOSITORY.md line ' + (i + 1) + ': `' + t + '` is not a tracked path'
            + (bases.length > 1 ? ' (from the root or in ' + bases.slice(1).join(', ') + ')' : ''));
    });
});
ok(checked > 40, 'only ' + checked + ' paths found in developers/REPOSITORY.md');

console.log(checked + ' paths in developers/REPOSITORY.md checked against ' + tracked.length + ' tracked files');
console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
process.exit(fails ? 1 : 0);
