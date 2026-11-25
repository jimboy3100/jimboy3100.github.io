#!/usr/bin/env node
/*
 * One-off converter (kept for the record): turns the translation tables that existed in 3.603
 * into developers/i18n/src/*.json, the single source of truth since then.
 *
 *   node developers/i18n/convert.js [git-rev]      (default rev: 38e24289 = Version 3.603)
 *
 * It reads the old files from git (not from the working tree) so it gives the same result after
 * the old tables were removed. Sources:
 *   core.json     <- window.lmT's inline table (ogario/ogario.v4.js)
 *   packs.json    <- languages/LanguagePack<Language>.js (every global var, old name in "global")
 *   settings.json <- displayText.en / .pl, _lmLabelI18n (el es bg fr ar zh ru de tr nl) and the
 *                    "textLanguage.x = textLanguage.x || 'English'" fallbacks (ogario/ogario.v4.js)
 *   agario.json   <- LMexpress/i18n.js (agar.io's page strings, English only before)
 * Gaps are left empty here; translations are added with developers/i18n/todo.js + merge.js.
 * Running it again overwrites those four files: do not run it after translations were merged.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');
const I = require('./lib');

const ROOT = path.resolve(__dirname, '..', '..');
const REV = process.argv[2] || '38e24289';
const show = (file) => execSync('git show ' + REV + ':' + file, { cwd: ROOT, maxBuffer: 64 * 1024 * 1024 }).toString('utf8').replace(/\r\n/g, '\n');

const out = {};
const blank = () => { const o = {}; I.CODES.forEach((c) => { o[c] = ''; }); return o; };

/* ---------- core.json: lmT's table ---------- */
const og = show('ogario/ogario.v4.js');
{
    const a = og.indexOf('window.lmT = (function () {');
    const b = og.indexOf('return function (key)', a);
    const src = og.slice(a, b).replace('window.lmT = (function () {', 'this.T = (function () {') + 'return text; })();';
    const c = {};
    vm.createContext(c);
    vm.runInContext(src, c);
    const core = {};
    Object.keys(c.T).forEach((k) => { core[k] = Object.assign(blank(), c.T[k]); });
    out.core = core;
}

/* ---------- packs.json: LanguagePack<Language>.js ---------- */
{
    const packs = {};
    I.CODES.forEach((code) => {
        const ctx = {};
        vm.createContext(ctx);
        const src = show('languages/LanguagePack' + I.PACK_NAMES[code] + '.js');
        vm.runInContext(src, ctx);
        packs[code] = { vals: ctx, src };
    });
    /* English comment after each var: the English meaning, used for vars English never had */
    const comments = {};
    packs.el.src.split('\n').forEach((line) => {
        const m = line.match(/^\s*var\s+([A-Za-z0-9_]+)\s*=.*?\/\/\s*(.+?)\s*"?\s*$/);
        if (m) comments[m[1]] = m[2];
    });
    const order = Object.keys(packs.en.vals);
    I.CODES.forEach((code) => Object.keys(packs[code].vals).forEach((n) => { if (order.indexOf(n) < 0) order.push(n); }));
    const used = {};
    const res = {};
    order.forEach((name) => {
        let en = packs.en.vals[name];
        if (en == null) en = comments[name] || name;
        let key = name === 'translator' ? 'pack.translator' : 'pack.' + I.slug(en, name);
        if (used[key]) { let i = 2; while (used[key + i]) i++; key = key + i; }
        used[key] = 1;
        const row = { global: name };
        I.CODES.forEach((code) => {
            const v = packs[code].vals[name];
            row[code] = typeof v === 'string' ? v : '';
        });
        if (!row.en) row.en = en;
        res[key] = row;
    });
    out.packs = res;
}

/* ---------- settings.json: displayText + label sets + fallbacks ---------- */
{
    const grab = (startMarker, endRe, name) => {
        const a = og.indexOf(startMarker);
        const rest = og.slice(a);
        const m = rest.match(endRe);
        const src = rest.slice(0, m.index + m[0].length);
        const c = {};
        vm.createContext(c);
        vm.runInContext(src + '\n;this.X = ' + name + ';', c);
        return c.X;
    };
    const displayText = grab('var displayText = {', /\n}\n/, 'displayText');
    const labelSets = grab('var _lmLabelI18n = {', /\n};\n/, '_lmLabelI18n');
    /* "textLanguage.k = textLanguage.k || 'English';" lines (some with a comment before the text) */
    const fallbacks = {};
    const re = /textLanguage(?:\.([\w$]+)|\[['"]([^'"]+)['"]\])\s*=\s*textLanguage(?:\.[\w$]+|\[['"][^'"]+['"]\])\s*\|\|\s*(?:\/\*[\s\S]*?\*\/\s*)?'((?:[^'\\]|\\.)*)'/g;
    let m;
    while ((m = re.exec(og))) fallbacks[m[1] || m[2]] = vm.runInNewContext("'" + m[3] + "'");
    const en = displayText.en;
    const keys = Object.keys(en);
    Object.keys(fallbacks).forEach((k) => { if (keys.indexOf(k) < 0) keys.push(k); });
    Object.keys(displayText.pl).forEach((k) => { if (keys.indexOf(k) < 0) keys.push(k); });
    Object.keys(labelSets).forEach((code) => Object.keys(labelSets[code]).forEach((k) => { if (keys.indexOf(k) < 0) keys.push(k); }));
    /* English for keys only a translated set had: the modules' own fallbacks, e.g. L('lmNotifTitle', 'Notifications') */
    const modEn = {};
    const files = ['ogario/hotkeysCommand.js'].concat(execSync('git ls-tree --name-only ' + REV + ' ogario/modules/', { cwd: ROOT }).toString().split('\n').filter((f) => /\.js$/.test(f)));
    const modEn2 = {};
    files.concat(['ogario/ogario.v4.js']).forEach((f) => {
        let s;
        try { s = f === 'ogario/ogario.v4.js' ? og : show(f); } catch (e) { return; }
        let mm;
        if (f !== 'ogario/ogario.v4.js') {
            const r = /['"]([A-Za-z][\w-]*)['"]\s*[,:]\s*'((?:[^'\\\n]|\\.)+)'/g;
            while ((mm = r.exec(s))) if (!modEn[mm[1]]) { try { modEn[mm[1]] = vm.runInNewContext("'" + mm[2] + "'"); } catch (e) { } }
        }
        /* (textLanguage['k']) || 'English' and textLanguage.k || 'English' */
        const r2 = /textLanguage(?:\.([\w$]+)|\[['"]([^'"]+)['"]\])\)?\s*\|\|\s*'((?:[^'\\\n]|\\.)+)'/g;
        while ((mm = r2.exec(s))) { const k = mm[1] || mm[2]; if (!modEn2[k]) { try { modEn2[k] = vm.runInNewContext("'" + mm[3] + "'"); } catch (e) { } } }
    });
    /* page_* keys the Polish set had: agar.io's own English (LMexpress/i18n.js) */
    {
        const c = { window: { navigator: { language: 'en' } }, navigator: {} };
        vm.createContext(c);
        vm.runInContext(show('LMexpress/i18n.js').split('i18n_lang=(window')[0], c);
        Object.keys(c.i18n_dict.en).forEach((k) => { if (!modEn2[k]) modEn2[k] = c.i18n_dict.en[k]; });
    }
    /* labels only the translated sets had (their features use other texts now): English from the Greek */
    Object.assign(modEn2, {
        mbRings: 'Rings around multibox units',
        a11yHighContrast: 'High-contrast HUD (solid background, outlines)',
        a11yNoFlash: 'Less flashing (no animated page elements)',
        a11yPalette: 'Colour-blind palette for opponent colours and rings',
        'hk-bugReport': 'Bug report (diagnostics)',
        a11yPaletteOff: 'Theme colours',
        a11yPaletteDeut: 'Deuteranopia (weak green)',
        a11yPaletteProt: 'Protanopia (weak red)',
        a11yPaletteTrit: 'Tritanopia (weak blue)'
    });
    /* empty on purpose in every language (the HUD shows only the number after them) */
    const EMPTY = ['targetNotSet', 'totalPartyPlayers', 'totalPartyMass'];
    const res = {};
    const noEn = [];
    keys.forEach((k) => {
        const row = blank();
        row.en = en[k] || fallbacks[k] || modEn2[k] || modEn[k] || '';
        if (EMPTY.indexOf(k) >= 0) { I.CODES.forEach((code) => { row[code] = ''; }); row.allowEmpty = true; res['settings.' + k] = row; return; }
        if (!row.en) noEn.push(k);
        const comm = /^comm\d+$/.test(k);
        I.CODES.forEach((code) => {
            if (code === 'en') return;
            let v = '';
            if (code === 'pl') v = displayText.pl[k];
            else if (labelSets[code]) v = labelSets[code][k];
            /* quick chat commands are sent to teammates: they stayed English (except Polish) on purpose */
            if (comm && code !== 'pl') v = row.en;
            /* Polish copied many English labels as they were: leave them for translation */
            if (code === 'pl' && v === row.en && !comm) v = '';
            row[code] = typeof v === 'string' ? v : '';
        });
        if (comm && !row.pl) row.pl = row.en;
        res['settings.' + k] = row;
    });
    if (noEn.length) console.log('settings keys without English (left empty):', noEn.join(', '));
    out.settings = res;
}

/* ---------- agario.json: LMexpress/i18n.js ---------- */
{
    const src = show('LMexpress/i18n.js');
    const c = { window: {}, navigator: {} };
    c.window.navigator = { language: 'en' };
    vm.createContext(c);
    vm.runInContext(src.split('i18n_lang=(window')[0], c);
    const dict = c.i18n_dict.en;
    const res = {};
    Object.keys(dict).forEach((k) => {
        const row = blank();
        row.en = dict[k];
        /* the settings labels translated some of agar.io's page keys (setLang copied Polish over them) */
        const s = out.settings['settings.' + k];
        if (s) I.CODES.forEach((code) => { if (code !== 'en' && s[code] && s[code] !== s.en) row[code] = s[code]; });
        res['agario.' + k] = row;
    });
    out.agario = res;
}

Object.keys(out).forEach((area) => {
    I.writeArea(area, out[area]);
    console.log(area + '.json', Object.keys(out[area]).length, 'keys');
});
