#!/usr/bin/env node
// Repository inventory: every tracked file with its git blob id, size and kind, plus the set of
// paths that exist on the published site (tracked files, without the ones deleted in this working
// tree, plus new files not yet committed and not ignored), with the exact case GitHub Pages uses.
// Usage: node developers/audit/inventory.js [repoDir]   (prints a short summary)
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

/* files read as text for references (anything else is treated as binary) */
const TEXT_EXT = new Set(['html', 'htm', 'js', 'mjs', 'cjs', 'css', 'json', 'jsonld', 'webmanifest', 'map',
    'txt', 'md', 'xml', 'svg', 'rss', 'ttl', 'rdf', 'yml', 'yaml', 'ps1', 'psm1', 'py', 'sh', 'bat', 'cmd',
    'php', 'ts', 'tsx', 'jsx', 'vue', 'ini', 'cfg', 'csv', 'tsv', 'nojekyll', 'gitignore', 'gitattributes',
    'swift', 'plist', 'c', 'h', 'kt', 'java', 'gradle']);
const MAX_TEXT = 12 * 1024 * 1024;

function git(repo, args) {
    /* --no-optional-locks: git status must not rewrite the index of a repository others are working in */
    return cp.execFileSync('git', ['--no-optional-locks', '-c', 'core.quotepath=off'].concat(args),
        { cwd: repo, maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8');
}

function ext(p) {
    const b = p.slice(p.lastIndexOf('/') + 1);
    const i = b.lastIndexOf('.');
    return i < 0 ? '' : b.slice(i + 1).toLowerCase();
}

/* paths from the repository root: '**' any depth ('**' + '/' also none), '*' inside one folder, '?' one character */
function globToRegex(g) {
    let s = '';
    for (let i = 0; i < g.length; i++) {
        const c = g[i];
        if (c === '*' && g[i + 1] === '*') {
            i++;
            if (g[i + 1] === '/') { s += '(?:.*/)?'; i++; } else s += '.*';
        } else if (c === '*') s += '[^/]*';
        else if (c === '?') s += '[^/]';
        else s += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
    return new RegExp('^' + s + '$');
}
function globMatcher(list) {
    const res = (list || []).map((e) => ({ re: globToRegex(typeof e === 'string' ? e : e.glob || e.path), entry: e }));
    return (p) => { for (const r of res) if (r.re.test(p)) return r.entry; return null; };
}

/**
 * @param {string} repo
 * @param {{sizes?: boolean, worktree?: boolean}} [opts]
 * @returns {{repo, files: Array<{path, blob, size, ext, text}>, byPath: Map, exist: Set<string>,
 *            dirs: Set<string>, lower: Map<string,string[]>, sorted: string[]}}
 */
function inventory(repo, opts) {
    opts = opts || {};
    repo = path.resolve(repo);
    const byPath = new Map();
    for (const l of git(repo, ['ls-files', '-s', '-z']).split('\0')) {
        if (!l) continue;
        const tab = l.indexOf('\t');
        const head = l.slice(0, tab).split(' ');
        if (head[0] === '160000') continue; /* submodule */
        const p = l.slice(tab + 1);
        if (head[2] !== '0' && byPath.has(p)) continue; /* merge stages */
        byPath.set(p, { path: p, blob: head[1], size: 0, ext: ext(p), text: false });
    }
    const exist = new Set(byPath.keys());
    /* one git status for the working tree (each git start costs a lot on a busy Windows machine):
       deleted files are gone, new files that are not ignored are there, changed files are read from disk */
    let changed = null;
    if (opts.worktree !== false) {
        changed = new Set();
        const st = git(repo, ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--no-renames']).split('\0');
        for (const e of st) {
            if (e.length < 4) continue;
            const x = e[0], y = e[1], p = e.slice(3);
            if (x === '?' && y === '?') exist.add(p);
            else if (y === 'D' || (x === 'D' && !byPath.has(p))) exist.delete(p);
            else if (y !== ' ') changed.add(p);
        }
    }
    const files = [];
    for (const f of byPath.values()) {
        if (!exist.has(f.path)) continue;
        if (opts.sizes !== false) {
            try { f.size = fs.statSync(path.join(repo, f.path)).size; } catch (e) { f.size = 0; }
        }
        f.text = TEXT_EXT.has(f.ext) && f.size <= MAX_TEXT;
        files.push(f);
    }
    const dirs = new Set();
    const lower = new Map();
    for (const p of exist) {
        let i = p.indexOf('/');
        while (i >= 0) { dirs.add(p.slice(0, i)); i = p.indexOf('/', i + 1); }
        const k = p.toLowerCase();
        if (!lower.has(k)) lower.set(k, []);
        lower.get(k).push(p);
    }
    for (const d of dirs) { const k = d.toLowerCase(); if (!lower.has(k)) lower.set(k, [d]); }
    const sorted = Array.from(exist).sort();
    return { repo, files, byPath, exist, dirs, lower, sorted, changed };
}

/* untracked files are read too (for the integrity test) when they are text */
function textFiles(inv) {
    const out = inv.files.filter((f) => f.text).map((f) => f.path);
    for (const p of inv.exist) {
        if (inv.byPath.has(p)) continue;
        if (!TEXT_EXT.has(ext(p))) continue;
        try { if (fs.statSync(path.join(inv.repo, p)).size <= MAX_TEXT) out.push(p); } catch (e) { /* gone */ }
    }
    return out;
}

/* the text of many files at once: unchanged tracked files come from git's object store in one process
   (opening thousands of files one by one is slow on Windows while a virus scanner checks each one);
   changed and new files from the disk. Line numbers are the same (only line endings may differ). */
function readTexts(inv, rels) {
    const out = new Map();
    const changed = inv.changed;
    const fromGit = [];
    for (const rel of rels) {
        const f = inv.byPath.get(rel);
        if (changed && f && !changed.has(rel)) fromGit.push(f);
        else { try { out.set(rel, fs.readFileSync(path.join(inv.repo, rel), 'utf8')); } catch (e) { /* gone */ } }
    }
    for (let i = 0; i < fromGit.length; i += 2000) {
        const part = fromGit.slice(i, i + 2000);
        const buf = cp.execFileSync('git', ['cat-file', '--batch'], { cwd: inv.repo, input: part.map((f) => f.blob).join('\n') + '\n',
            maxBuffer: 1024 * 1024 * 1024, stdio: ['pipe', 'pipe', 'ignore'] });
        let pos = 0;
        for (const f of part) {
            const nl = buf.indexOf(10, pos);
            const head = buf.toString('latin1', pos, nl).split(' ');
            if (head[1] !== 'blob') { pos = nl + 1; continue; }
            const size = +head[2];
            out.set(f.path, buf.toString('utf8', nl + 1, nl + 1 + size));
            pos = nl + 1 + size + 1;
        }
    }
    return out;
}

/* text files of another repository (read only), for cross-repository references: Map(rel -> text) */
function otherRepoTexts(dir) {
    let inv;
    try { inv = inventory(dir); } catch (e) { return null; }
    return readTexts(inv, textFiles(inv));
}

function readJson(file, fallback) {
    /* \s also matches a byte order mark */
    try { return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\s+/, '')); } catch (e) {
        if (fallback !== undefined) return fallback;
        throw new Error(file + ': ' + e.message);
    }
}

module.exports = { inventory, textFiles, readTexts, otherRepoTexts, globToRegex, globMatcher, readJson, git, ext, TEXT_EXT };

if (require.main === module) {
    const inv = inventory(process.argv[2] || path.resolve(__dirname, '..', '..'));
    const total = inv.files.reduce((a, f) => a + f.size, 0);
    console.log(inv.files.length + ' tracked files, ' + (total / 1048576).toFixed(1) + ' MiB, ' +
        inv.files.filter((f) => f.text).length + ' text files, ' + inv.dirs.size + ' folders');
}
