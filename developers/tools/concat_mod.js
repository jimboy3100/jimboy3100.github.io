#!/usr/bin/env node
/* Source exports: joins the source files of each component into one text file, for reading
 * the whole code in one place (code review, handoffs). Local development tool only: the
 * game never loads it and the exports are not committed.
 *
 * Usage: node developers/tools/concat_mod.js [--out <dir>] [--only client,render,...]
 *        [--repo <dir>] [--legendworld <dir>] [--discord <dir>]
 *   --out          where the exports go. Default: the garbadge folder next to the repository,
 *                  only when it already exists (no folder is created outside a given --out).
 *   --only         comma-separated components (default: all)
 *   --repo         the Legend Mod checkout (default: the one this file is in)
 *   --legendworld  the LegendWorld checkout (default: LegendWorld next to the repository)
 *   --discord      the Discord bot server checkout (default: discord-bot-server next to it)
 * It writes one file per component into --out and nothing anywhere else. A component whose
 * sources are not there is skipped (no empty export). */
'use strict';
const fs = require('fs');
const path = require('path');

/* one export per component; the names are the ones the earlier exports used */
const COMPONENTS = {
    client: { file: 'LegendMod.txt', from: 'repo', list: ['ogario/ogario.v4.js', 'LMexpress/LMexpress.js', 'LMexpress/lm_extended_ui.js', 'LMexpress/skinsAndDeals.js', 'LMexpress/LMexpress.user.js', 'extras/legendhelper.js', 'play.html'] },
    userscript: { file: 'client.js', from: 'repo', list: ['LMexpress/LMexpress.user.js'], raw: true },
    render: { file: 'render.js', from: 'repo', list: ['ogario/ogario.v4.js'], raw: true },
    server: { file: 'LegendWorld.txt', from: 'legendworld', dir: 'src', match: /\.(c|h)$/ },
    discord: { file: 'DiscordBot.txt', from: 'discord', list: ['README.md'], dir: 'src', match: /\.js$/ }
};

function parseArgs(argv) {
    const o = {};
    for (let i = 0; i < argv.length; i++) {
        const m = /^--(out|only|repo|legendworld|discord)$/.exec(argv[i]);
        if (!m || i + 1 >= argv.length) throw new Error('unknown or incomplete option: ' + argv[i]);
        o[m[1]] = argv[++i];
    }
    return o;
}

/* the files of one component, in a fixed order: the listed ones, then the folder's sorted matches */
function sourcesOf(c, root) {
    const files = (c.list || []).map((f) => path.join(root, f));
    if (c.dir) {
        const d = path.join(root, c.dir);
        if (fs.existsSync(d)) fs.readdirSync(d).filter((f) => c.match.test(f)).sort().forEach((f) => files.push(path.join(d, f)));
    }
    return files.filter((f) => fs.existsSync(f) && fs.statSync(f).isFile());
}

function run(opts) {
    const repo = path.resolve(opts.repo || path.join(__dirname, '..', '..'));
    const roots = {
        repo,
        legendworld: path.resolve(opts.legendworld || path.join(repo, '..', 'LegendWorld')),
        discord: path.resolve(opts.discord || path.join(repo, '..', 'discord-bot-server'))
    };
    const names = opts.only ? String(opts.only).split(',').map((s) => s.trim()).filter(Boolean) : Object.keys(COMPONENTS);
    names.forEach((n) => { if (!COMPONENTS[n]) throw new Error('unknown component: ' + n); });
    let out = opts.out;
    if (out) fs.mkdirSync(out, { recursive: true });
    else {
        out = path.join(repo, '..', 'garbadge');
        if (!fs.existsSync(out)) throw new Error('no --out given and ' + out + ' does not exist');
    }
    const written = [];
    names.forEach((n) => {
        const c = COMPONENTS[n];
        const files = sourcesOf(c, roots[c.from]);
        if (!files.length) { console.log('skipped ' + n + ': no sources under ' + roots[c.from]); return; }
        const text = c.raw ? fs.readFileSync(files[0], 'utf8')
            : files.map((f) => '\n/* --- ' + path.relative(roots[c.from], f).replace(/\\/g, '/') + ' --- */\n' + fs.readFileSync(f, 'utf8')).join('');
        const dest = path.join(out, c.file);
        fs.writeFileSync(dest, text, 'utf8');
        written.push(dest);
        console.log(n + ': ' + files.length + ' file(s) -> ' + dest);
    });
    return written;
}

module.exports = { COMPONENTS, run, parseArgs };

if (require.main === module) {
    try { run(parseArgs(process.argv.slice(2))); } catch (e) { console.error(e.message); process.exit(1); }
}
