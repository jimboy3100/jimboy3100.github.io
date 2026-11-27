#!/usr/bin/env node
// developers/tools/concat_mod.js (source exports): one file per component, written only into
// the output folder, paths taken from the options, nothing created outside a given --out.
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

const repo = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
const tool = require(path.join(repo, 'developers', 'tools', 'concat_mod.js'));
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL ' + m); } };

/* a throwaway workspace: <base>/lm (repo), <base>/LegendWorld, no garbadge, no discord-bot-server */
const base = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-concat-'));
const put = (rel, text) => { const f = path.join(base, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
put('lm/ogario/ogario.v4.js', 'OGARIO');
put('lm/LMexpress/LMexpress.js', 'LMX');
put('lm/LMexpress/LMexpress.user.js', 'USER');
put('lm/play.html', '<html>');
put('LegendWorld/src/b.h', 'BH');
put('LegendWorld/src/a.c', 'AC');
put('LegendWorld/src/notes.txt', 'NOTES');
const tree = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? tree(path.join(d, e.name)).map((x) => e.name + '/' + x) : [e.name]).sort();
const before = tree(base).join('|');
const quiet = (fn) => { const log = console.log; console.log = () => {}; try { return fn(); } finally { console.log = log; } };

try {
    /* no --out and no garbadge next to the repository: refuses, creates nothing */
    let err = null;
    try { quiet(() => tool.run({ repo: path.join(base, 'lm') })); } catch (e) { err = e; }
    ok(err && /does not exist/.test(err.message), 'no --out without garbadge should fail: ' + (err && err.message));
    ok(tree(base).join('|') === before, 'a refused run must not create anything');

    /* unknown component and unknown option are refused before anything is written */
    err = null;
    try { quiet(() => tool.run({ repo: path.join(base, 'lm'), out: path.join(base, 'x1'), only: 'nope' })); } catch (e) { err = e; }
    ok(err && !fs.existsSync(path.join(base, 'x1')), 'unknown component must be refused before writing');
    err = null;
    try { tool.parseArgs(['--target', 'x']); } catch (e) { err = e; }
    ok(err, 'unknown option must be refused');
    ok(tool.parseArgs(['--out', 'o', '--only', 'render']).only === 'render', 'parseArgs reads --only');

    /* a full run: one export per component that has sources, nothing written outside --out */
    const out = path.join(base, 'exports');
    const written = quiet(() => tool.run({ repo: path.join(base, 'lm'), out }));
    const files = fs.readdirSync(out).sort();
    ok(files.join(',') === 'LegendMod.txt,LegendWorld.txt,client.js,render.js', 'exports: ' + files.join(','));
    ok(written.length === files.length, 'run() returns what it wrote');
    const after = tree(base).filter((f) => !/^exports\//.test(f)).join('|');
    ok(after === before, 'files outside --out changed');
    const client = fs.readFileSync(path.join(out, 'LegendMod.txt'), 'utf8');
    ok(/\/\* --- ogario\/ogario\.v4\.js --- \*\/\nOGARIO/.test(client) && client.indexOf('play.html --- */\n<html>') > 0, 'client export joins the listed files in order');
    ok(client.indexOf('C:/') < 0 && client.indexOf(base) < 0, 'client export headers are repository-relative');
    ok(fs.readFileSync(path.join(out, 'client.js'), 'utf8') === 'USER', 'userscript export is the userscript itself');
    ok(fs.readFileSync(path.join(out, 'render.js'), 'utf8') === 'OGARIO', 'render export is ogario.v4.js itself');
    const server = fs.readFileSync(path.join(out, 'LegendWorld.txt'), 'utf8');
    ok(server.indexOf('src/a.c --- */\nAC') >= 0 && server.indexOf('src/a.c') < server.indexOf('src/b.h') && server.indexOf('NOTES') < 0, 'server export: sorted .c/.h only');

    /* --only writes just that component; a component without sources is skipped, not written empty */
    const out2 = path.join(base, 'only');
    quiet(() => tool.run({ repo: path.join(base, 'lm'), out: out2, only: 'render,discord' }));
    ok(fs.readdirSync(out2).join(',') === 'render.js', '--only render,discord: ' + fs.readdirSync(out2).join(','));

    /* the real repository: defaults resolve to it and every client source it lists exists */
    tool.COMPONENTS.client.list.forEach((f) => ok(fs.existsSync(path.join(repo, f)), 'client export lists a missing file: ' + f));
    ok(!fs.existsSync(path.join(repo, 'concat_mod.js')) && !fs.existsSync(path.join(repo, 'AllFilesNew.txt')), 'old root export tool / export is back');
} finally {
    fs.rmSync(base, { recursive: true, force: true });
}

console.log(fails ? 'RESULT: FAIL (' + fails + ')' : 'RESULT: PASS');
process.exit(fails ? 1 : 0);
