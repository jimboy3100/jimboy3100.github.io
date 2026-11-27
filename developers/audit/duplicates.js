#!/usr/bin/env node
// Identical files: groups of tracked files with the same git blob id (same bytes as committed), the
// bytes the extra copies take, and which folder pairs hold the same file under the same name.
// Usage: node developers/audit/duplicates.js [repoDir] [--top N]
'use strict';
const path = require('path');

/**
 * @param {{files: Array<{path, blob, size}>}} inv
 * @returns {Array<{blob, size, count, redundant, paths: string[]}>} biggest waste first
 */
function duplicateGroups(inv) {
    const by = new Map();
    for (const f of inv.files) {
        if (!f.blob || !f.size) continue;
        if (!by.has(f.blob)) by.set(f.blob, { blob: f.blob, size: f.size, paths: [] });
        by.get(f.blob).paths.push(f.path);
    }
    const groups = [];
    for (const g of by.values()) {
        if (g.paths.length < 2) continue;
        g.paths.sort();
        g.count = g.paths.length;
        g.redundant = g.size * (g.count - 1);
        groups.push(g);
    }
    return groups.sort((a, b) => b.redundant - a.redundant || a.paths[0].localeCompare(b.paths[0]));
}

/* same file, same name below two different folders (e.g. vanillaskins/x.png = lowresskins/x.png) */
function folderPairs(groups) {
    const pairs = new Map();
    for (const g of groups) {
        for (let i = 0; i < g.paths.length; i++) {
            for (let j = i + 1; j < g.paths.length; j++) {
                const a = g.paths[i], b = g.paths[j];
                const ra = a.split('/'), rb = b.split('/');
                const da = ra.length > 1 ? ra[0] : '.', db = rb.length > 1 ? rb[0] : '.';
                const sameName = ra.slice(1).join('/') === rb.slice(1).join('/');
                const key = (da < db ? da + ' = ' + db : db + ' = ' + da) + (sameName ? ' (same path)' : '');
                if (!pairs.has(key)) pairs.set(key, { pair: key, count: 0, bytes: 0 });
                const p = pairs.get(key);
                p.count++; p.bytes += g.size;
            }
        }
    }
    return Array.from(pairs.values()).sort((a, b) => b.bytes - a.bytes);
}

module.exports = { duplicateGroups, folderPairs };

if (require.main === module) {
    const { inventory } = require('./inventory');
    const args = process.argv.slice(2);
    const ti = args.indexOf('--top');
    const top = ti >= 0 ? +args[ti + 1] : 20;
    const repo = args.find((a, i) => a[0] !== '-' && args[i - 1] !== '--top') || path.resolve(__dirname, '..', '..');
    const groups = duplicateGroups(inventory(repo));
    const waste = groups.reduce((a, g) => a + g.redundant, 0);
    console.log(groups.length + ' groups of identical files, ' + groups.reduce((a, g) => a + g.count - 1, 0) +
        ' extra copies, ' + (waste / 1048576).toFixed(2) + ' MiB');
    groups.slice(0, top).forEach((g) => console.log((g.redundant / 1048576).toFixed(2).padStart(7) + ' MiB  ' + g.paths.join('  =  ')));
}
