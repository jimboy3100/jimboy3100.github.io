#!/usr/bin/env node
// Runtime network recording: which repository files a real page load asked for. Every headless run of
// developers/tests/smoke.js (and run.js, which uses it) writes the repository paths the page loaded
// into <outDir>/result.json ("servedPaths"). This reads every result.json below a folder (default
// developers/tests/out) and gives each path with the number of runs that loaded it; audit.js uses it
// as runtime evidence next to the static references (a file loaded at run time is used, whatever the
// static scan found). Only what the recorded runs did counts: a file no run loaded may still be used.
// Usage: node developers/audit/network.js [dir] [--repo DIR]
'use strict';
const fs = require('fs');
const path = require('path');

/**
 * @param {string} dir folder searched for result.json files (any depth)
 * @returns {{runs: number, paths: Map<string, number>}}
 */
function runtimeLoaded(dir) {
    const paths = new Map();
    let runs = 0;
    const walk = (d, depth) => {
        let list;
        try { list = fs.readdirSync(d, { withFileTypes: true }); } catch (e) { return; }
        for (const e of list) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) { if (depth < 6) walk(p, depth + 1); continue; }
            if (e.name !== 'result.json') continue;
            let r;
            try { r = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (err) { continue; }
            if (!r || !Array.isArray(r.servedPaths)) continue;
            runs++;
            for (const s of r.servedPaths) if (typeof s === 'string' && s) paths.set(s, (paths.get(s) || 0) + 1);
        }
    };
    walk(dir, 0);
    return { runs, paths };
}

module.exports = { runtimeLoaded };

if (require.main === module) {
    const args = process.argv.slice(2);
    const ri = args.indexOf('--repo');
    const repo = ri >= 0 ? path.resolve(args[ri + 1]) : path.resolve(__dirname, '..', '..');
    const dir = args.find((a, i) => a[0] !== '-' && args[i - 1] !== '--repo') || path.join(repo, 'developers', 'tests', 'out');
    const res = runtimeLoaded(dir);
    console.log(res.runs + ' recorded runs below ' + dir + ', ' + res.paths.size + ' repository files loaded');
    Array.from(res.paths).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).forEach(([p, n]) => console.log(String(n).padStart(5) + '  ' + p));
}
