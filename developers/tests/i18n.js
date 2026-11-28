// Translations: the language packs (developers/i18n/src), the generated files, the runtime
// (languages/lm-i18n.js, lib/lm-i18n.js), the old globals and the hard-coded text scanner.
// Usage: node developers/tests/i18n.js   (--require-complete is accepted for old scripts and ignored)
// New and changed texts are written in English only: a text another language does not have yet passes
// (the player sees the English one) and is only counted; node developers/i18n/todo.js lists them.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const repo = path.resolve(__dirname, '..', '..');
const I = require(path.join(repo, 'developers', 'i18n', 'lib'));
const build = require(path.join(repo, 'developers', 'i18n', 'build'));
const scan = require(path.join(repo, 'developers', 'i18n', 'scan'));

let failed = 0;
const ok = (cond, msg) => { if (!cond) { failed++; console.log('FAIL ' + msg); } };

/* ---------- 1. the source files ---------- */
const all = I.readAll();
const seen = {};
let keys = 0;
const untranslated = {};
/* the text a player in language c sees: its own, else English (the runtime's fallback) */
const tx = (e, c) => (e[c] || e.en);
Object.keys(all).forEach((area) => {
    Object.keys(all[area]).forEach((k) => {
        keys++;
        const e = all[area][k];
        ok(!seen[k], k + ': in ' + seen[k] + '.json and ' + area + '.json');
        seen[k] = area;
        /* key names: "<area>." (dashes as dots); core.json also has lmT's old bare keys */
        ok(k.indexOf(I.areaPrefix(area)) === 0 || (area === 'core' && /^[A-Za-z][A-Za-z0-9_]*$/.test(k)), k + ': key must start with ' + I.areaPrefix(area));
        /* English is required; another language may be missing or empty (English is shown) */
        ok(typeof e.en === 'string', k + ': en missing');
        if (!e.allowEmpty) ok(typeof e.en === 'string' && e.en.trim() !== '', k + ': en empty');
        I.CODES.forEach((c) => {
            if (c === 'en' || e.allowEmpty) return;
            ok(e[c] == null || typeof e[c] === 'string', k + ': ' + c + ' is not a string');
            /* only spaces is not "not translated": the build keeps it and the player sees a blank text */
            ok(typeof e[c] !== 'string' || e[c] === '' || e[c].trim() !== '', k + ': ' + c + ' is only spaces (leave it out or empty, then English is shown)');
            if (typeof e[c] !== 'string' || e[c] === '') untranslated[c] = (untranslated[c] || 0) + 1;
        });
        const p = I.placeholders(e.en).join('|');
        I.CODES.forEach((c) => {
            if (c !== 'en' && e[c]) ok(I.placeholders(e[c]).join('|') === p, k + ': ' + c + ' placeholders/tags differ from English (' + I.placeholders(e[c]).join(' ') + ' vs ' + p.split('|').join(' ') + ')');
        });
        Object.keys(e).forEach((f) => ok(I.isLang(f) || ['global', 'note', 'allowEmpty'].indexOf(f) >= 0, k + ': unknown field ' + f));
    });
});
console.log('packs: ' + Object.keys(all).length + ' areas, ' + keys + ' keys x ' + I.CODES.length + ' languages');
const nUntr = Object.keys(untranslated).reduce((n, c) => n + untranslated[c], 0);
console.log('not translated yet (English shown, informational): ' + (nUntr ? I.CODES.filter((c) => untranslated[c]).map((c) => c + ' ' + untranslated[c]).join(', ') + ' (list: node developers/i18n/todo.js --lang <code>)' : 'none'));

/* ---------- 2. generated files up to date ---------- */
const { files, stale } = build.run(true);
ok(stale.length === 0, 'generated files are stale (run node developers/i18n/build.js): ' + stale.join(', '));
console.log('generated: ' + Object.keys(files).length + ' files' + (stale.length ? ', ' + stale.length + ' stale' : ', up to date'));
/* a text not translated yet is left out of that language's file, so the runtime falls back to English
 * (an empty string there would show nothing) */
Object.keys(files).forEach((rel) => {
    const m = /^languages\/lm-(?:site(?:-[a-z0-9-]+)?-)?([a-z]{2})\.js$/.exec(rel);
    if (!m || m[1] === 'en' || I.CODES.indexOf(m[1]) < 0) return;
    ok(!/^"[^"]+": ""(,|\r?$)/m.test(files[rel]), rel + ': has an empty text (it must be left out for the English fallback)');
});
/* the extension and the userscript loader: an untranslated text is the English one */
{
    const ext = require(path.join(repo, 'developers', 'i18n', 'extension')).build();
    const c = { navigator: { language: 'el-GR' } };
    vm.createContext(c);
    vm.runInContext(ext['LMexpress/extension/texts.js'], c);
    ok(Object.keys(c.LMX_EXT_TEXTS).every((x) => c.LMX_EXT_TEXTS[x].every((v) => v !== '')), 'extension: no empty text (the generator fills English)');
    const k = Object.keys(c.LMX_EXT_TEXTS)[0];
    c.LMX_EXT_TEXTS[k][1] = '';
    ok(c.lmxExtText(k, 2) === c.LMX_EXT_TEXTS[k][0] && c.LMX_EXT_TEXTS[k][0] !== '', 'extension: an untranslated text falls back to English');
}

/* ---------- a page in a vm: just enough DOM for the runtime ---------- */
function makeEl(tag, attrs, text) {
    const el = {
        tagName: tag.toUpperCase(), attrs: Object.assign({}, attrs || {}), children: [], textContent: text || '', innerHTML: text || '', value: '',
        getAttribute(n) { return Object.prototype.hasOwnProperty.call(this.attrs, n) ? this.attrs[n] : null; },
        setAttribute(n, v) { this.attrs[n] = String(v); },
        hasAttribute(n) { return Object.prototype.hasOwnProperty.call(this.attrs, n); },
        appendChild(c) { this.children.push(c); c.parentNode = this; if (this._onAppend) this._onAppend(c); return c; },
        removeChild(c) { this.children = this.children.filter((x) => x !== c); },
        addEventListener() { },
        querySelector(sel) { return this.querySelectorAll(sel)[0] || null; },
        querySelectorAll(sel) {
            const out = [];
            const walk = (n) => n.children.forEach((c) => { if (c.matches(sel)) out.push(c); walk(c); });
            walk(this);
            return out;
        },
        matches(sel) {
            return sel.split(',').some((s) => {
                s = s.trim();
                let m = /^\[([\w-]+)\]$/.exec(s);
                if (m) return this.hasAttribute(m[1]);
                m = /^(\w+)\.([\w-]+)$/.exec(s);
                if (m) return this.tagName === m[1].toUpperCase() && (this.attrs.class || this.className || '') === m[2];
                return false;
            });
        }
    };
    return el;
}
function page(opts) {
    const store = Object.assign({}, opts.storage || {});
    const written = [];
    const html = makeEl('html');
    const head = makeEl('head');
    const body = makeEl('body');
    html.appendChild(head);
    html.appendChild(body);
    (opts.body || []).forEach((e) => body.appendChild(e));
    const ctx = {
        console, setTimeout, clearTimeout, JSON, Object, Array, String, parseInt, Promise,
        atob: (s) => Buffer.from(s, 'base64').toString('binary'),
        btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
        localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
        navigator: { language: opts.navLang || 'en-US' },
        location: { hash: opts.hash || '', search: '', hostname: 'www.legendmod.ml' },
        addEventListener: (t, fn) => { if (t === 'message') ctx._onMessage = fn; }
    };
    ctx.window = ctx;
    /* a script element added at run time: run the local copy of its file */
    const runUrl = (src) => {
        const m = /^https:\/\/(www\.legendmod\.ml|jimboy3100\.github\.io)\/([^?#]+)/.exec(src);
        const file = m && path.join(repo, m[2]);
        if (!file || !fs.existsSync(file) || (opts.failUrl && opts.failUrl(src))) return false;
        if (opts.emptyUrl && opts.emptyUrl(src)) return true;
        vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: m[2] });
        return true;
    };
    ctx.document = {
        readyState: opts.readyState || 'loading',
        documentElement: html, head, body,
        currentScript: null,
        getElementById: (id) => html.querySelectorAll('[id]').find((e) => e.attrs.id === id) || null,
        querySelectorAll: (s) => html.querySelectorAll(s),
        querySelector: (s) => html.querySelector(s),
        matches: () => false,
        createElement: (t) => makeEl(t),
        addEventListener: (t, fn) => { if (t === 'DOMContentLoaded') ctx._onReady = fn; },
        /* the parser runs a written script tag at once */
        write: (s) => { written.push(s); const m = /src="([^"]+)"/.exec(s); if (m) runUrl(m[1]); }
    };
    head._onAppend = (c) => { if (c.tagName === 'SCRIPT' && c.src) setTimeout(() => { if (runUrl(c.src)) { if (c.onload) c.onload(); } else if (c.onerror) c.onerror(); }, 0); };
    vm.createContext(ctx);
    ctx.run = (rel, attrs) => {
        ctx.document.currentScript = { src: 'https://www.legendmod.ml/' + rel + '?v=1', async: false, defer: false, getAttribute: (n) => (attrs || {})[n] || null };
        vm.runInContext(fs.readFileSync(path.join(repo, rel), 'utf8'), ctx, { filename: rel });
        ctx.document.currentScript = null;
    };
    ctx.ready = () => { ctx.document.readyState = 'complete'; if (ctx._onReady) ctx._onReady(); };
    ctx.store = store;
    ctx.written = written;
    return ctx;
}
const tick = () => new Promise((r) => setTimeout(r, 5));

(async () => {
    /* ---------- 3. the mod: Greek chosen ---------- */
    {
        const w = page({ storage: { languagemod: '2' } });
        w.run('languages/lm-i18n.js');
        ok(w.written.length === 1 && /lm-el\.js\?v=1/.test(w.written[0]) && /charset="utf-8"/.test(w.written[0]), 'mod: writes the Greek file right after itself: ' + w.written.join(' '));
        w.run('languages/lm-en.js');
        const L = w.LMi18n;
        ok(L.lang() === 'el' && L.num() === '2' && L.dir() === 'ltr', 'mod: language el');
        ok(w.lmT('leagues') === tx(all.core.leagues, 'el'), 'lmT: Greek text');
        ok(w.lmT('core.langChanged') === tx(all.core['core.langChanged'], 'el'), 'lmT: core.* key');
        ok(w.Languageletter0 === tx(all.packs['pack.home'], 'el'), 'old global Languageletter0 in Greek: ' + w.Languageletter0);
        ok(w.translator === tx(all.packs['pack.translator'], 'el'), 'old global translator');
        ok(L.prefixed('settings.').showMass === tx(all.settings['settings.showMass'], 'el'), 'prefixed: settings labels (textLanguage)');
        ok(L.prefixed('settings.', 'en').showMass === tx(all.settings['settings.showMass'], 'en'), 'prefixed: English labels');
        /* fallbacks */
        L.add('en', { 'test.onlyEnglish': 'Only English {0} and {name}' });
        ok(w.lmT('test.onlyEnglish', [5]) === 'Only English 5 and {name}', 'lmT: English fallback with {0}');
        ok(w.lmT('test.onlyEnglish', { name: 'Bob' }) === 'Only English {0} and Bob', 'lmT: {name}');
        ok(w.lmT('test.onlyEnglish', 7) === 'Only English 7 and {name}', 'lmT: single value');
        ok(w.lmT('test.nowhere') === 'test.nowhere', 'lmT: the key itself as a last resort');
        ok(w.lmT('test.nowhere') === 'test.nowhere' && L.missing()['test.nowhere'] === 2, 'missing(): counted ' + JSON.stringify(L.missing()));
        ok(!L.missing()['test.onlyEnglish'], 'missing(): an English fallback is not a miss');
        L.table({ 'test.table': { en: 'Hello', el: 'Γεια' }, 'test.arr': ['One', 'Ένα'] });
        ok(w.lmT('test.table') === 'Γεια' && w.lmT('test.arr') === 'Ένα', 'table(): a module\'s own texts');
        /* every old global of 3.603's English pack is still defined (same names) */
        let names = null;
        try { names = Object.keys((() => { const c = {}; vm.createContext(c); vm.runInContext(execSync('git show 38e24289:languages/LanguagePackEnglish.js', { cwd: repo }).toString('utf8'), c); return c; })()); } catch (e) { names = null; }
        if (names) {
            const miss = names.filter((n) => typeof w[n] !== 'string' || !w[n]);
            ok(miss.length === 0, 'old globals missing: ' + miss.join(', '));
            console.log('old globals: ' + names.length + ' of 3.603\'s English pack defined');
        } else console.log('old globals: git history not available, checked the packs.json names only');
        Object.keys(all.packs).forEach((k) => { const g = all.packs[k].global; if (g) ok(typeof w[g] === 'string', 'old global ' + g + ' not defined'); });

        /* switching: French arrives asynchronously, listeners and apply run, globals follow */
        const label = makeEl('span', { 'data-i18n': 'leagues' }, 'Leagues');
        const input = makeEl('input', { 'data-i18n-placeholder': 'pack.home', placeholder: 'Home', 'data-i18n-title': 'leagues', 'data-original-title': 'x' });
        const html = makeEl('div', { 'data-i18n-html': 'test.html' }, '');
        const vars = makeEl('b', { 'data-i18n': 'test.onlyEnglish', 'data-i18n-vars': '{"0":"9","name":"Al"}' });
        const keep = makeEl('i', { 'data-i18n': 'test.unknownKey' }, 'English stays');
        [label, input, html, vars, keep].forEach((e) => w.document.body.appendChild(e));
        L.add('en', { 'test.html': '<b>Bold</b> text' });
        let changed = null;
        const off = L.onChange((code, prev) => { changed = prev + '>' + code; });
        let done = false;
        L.setLang('fr', () => { done = true; });
        for (let i = 0; i < 50 && !done; i++) await tick();
        ok(done && L.lang() === 'fr' && changed === 'el>fr', 'setLang: French loaded and onChange ran (' + changed + ')');
        ok(w.store.languagemod === '5', 'setLang: saved languagemod 5');
        ok(w.Languageletter0 === tx(all.packs['pack.home'], 'fr'), 'old globals follow the switch');
        ok(label.textContent === tx(all.core.leagues, 'fr'), 'apply: data-i18n');
        ok(input.attrs.placeholder === tx(all.packs['pack.home'], 'fr') && input.attrs.title === tx(all.core.leagues, 'fr') && input.attrs['data-original-title'] === tx(all.core.leagues, 'fr'), 'apply: attributes + Bootstrap copy');
        ok(html.innerHTML === '<b>Bold</b> text', 'apply: data-i18n-html');
        ok(vars.textContent === 'Only English 9 and Al', 'apply: data-i18n-vars');
        ok(keep.textContent === 'English stays', 'apply: an unknown key leaves the element');
        off();
        L.setLang(1);
        for (let i = 0; i < 20 && L.lang() !== 'en'; i++) await tick();
        ok(L.lang() === 'en' && changed === 'el>fr', 'onChange: unsubscribed; back to English');
        /* quick switches: the last one wins whichever file arrives first */
        L.setLang('de'); L.setLang('ru');
        for (let i = 0; i < 50 && L.lang() !== 'ru'; i++) await tick();
        await tick(); await tick();
        ok(L.lang() === 'ru', 'two quick switches: the last one wins (' + L.lang() + ')');

        /* the old address of a pack switches the old globals (another page or script loads it) */
        const before = w.store.languagemod;
        w.run('languages/LanguagePackGreek.js');
        for (let i = 0; i < 20 && L.lang() !== 'el'; i++) await tick();
        ok(w.Languageletter0 === tx(all.packs['pack.home'], 'el') && w.store.languagemod === before, 'LanguagePackGreek.js: Greek globals, languagemod not changed');
        /* agar.io's page texts (LMexpress/i18n.js) follow the language */
        w.run('LMexpress/i18n.js');
        ok(w.i18n('page_play') === tx(all.agario['agario.page_play'], 'el'), 'i18n.js: agar.io texts in Greek');
        ok(w.parseString('page_fb_matchresults_subtitle', '%@', [1, 2, 3]).indexOf('%@') < 0, 'i18n.js: parseString');
    }
    /* A failed or non-registering script must not poison the loaded cache. */
    {
        let offline = true;
        const w = page({ failUrl: src => offline && /lm-el\.js/.test(src) });
        w.run('languages/lm-i18n.js');
        w.run('languages/lm-en.js');
        const L = w.LMi18n;
        const label = makeEl('span', { 'data-i18n': 'discord.post' });
        w.document.body.appendChild(label);
        await new Promise(resolve => L.setLang('el', resolve));
        ok(!L.loaded('el') && label.textContent === tx(all.discord['discord.post'], 'en'), 'failed pack is not cached as loaded');
        offline = false;
        let changes = 0;
        L.onChange(() => changes++);
        await new Promise(resolve => L.setLang('el', resolve));
        ok(L.loaded('el') && label.textContent === tx(all.discord['discord.post'], 'el') && changes === 1, 'same-language retry refreshes labels and listeners');
        const w2 = page({ emptyUrl: src => /www\.legendmod\.ml.*lm-fr\.js/.test(src) });
        w2.run('languages/lm-i18n.js');
        w2.run('languages/lm-en.js');
        await new Promise(resolve => w2.LMi18n.setLang('fr', resolve));
        ok(w2.LMi18n.loaded('fr') && w2.lmT('leagues') === tx(all.core.leagues, 'fr'), 'non-registering primary script retries alternate host');
    }
    /* Discover cards must match the feature titles, and all mod packs must actually register. */
    {
        const w = page({});
        w.run('languages/lm-i18n.js');
        w.run('languages/lm-en.js');
        for (const code of I.CODES) {
            await new Promise(resolve => w.LMi18n.setLang(code, resolve));
            ok(w.LMi18n.loaded(code) && w.LMi18n.lang() === code, code + ': mod pack registered');
            ok(w.lmT('discord.post') === tx(all.discord['discord.post'], code), code + ': Discord button');
            ok(w.lmT('modules.discovery.card.plugins') === w.lmT('lmx.sn.title'), code + ': Discover User Scripts title');
            ok(w.lmT('modules.discovery.card.replayStudio') === w.lmT('modules.replaystudio.title'), code + ': Discover Replay Studio title');
        }
    }
    /* Locale IDs are append-only. The four added last (13-16) are released like the first twelve:
     * picked from the browser, listed under their own name only, saved and kept on reload. */
    {
        ok(I.CODES.slice(0, 12).join(',') === 'en,el,es,bg,fr,ar,zh,ru,de,tr,pl,nl', 'existing saved IDs unchanged');
        ok(I.CODES.slice(12).join(',') === 'pt,id,ja,it', 'new locale IDs 13-16');
        for (const code of I.CODES.slice(12)) {
            const w = page({ navLang: (code === 'pt' ? 'pt-BR' : code + '-XX') });
            w.run('languages/lm-i18n.js');
            w.run('languages/lm-en.js');
            ok(w.LMi18n.lang() === code && w.LMi18n.num() === String(I.CODES.indexOf(code) + 1) && !('languagemod' in w.store), code + ': the browser language is used (not saved)');
            ok(w.Languageletter0 === tx(all.packs['pack.home'], code), code + ': old globals follow the browser language');
            await new Promise(resolve => w.LMi18n.setLang(code, resolve));
            ok(w.LMi18n.lang() === code && w.store.languagemod === String(I.CODES.indexOf(code) + 1), code + ': selection persists');
            ok(w.lmT('boot.loading') === tx(all.boot['boot.loading'], code), code + ': translated loading text');
            ok(w.LMi18n.names[I.CODES.indexOf(code)] === I.NAMES[code], code + ': listed under its own name, no Beta label');
            const reload = page({ storage: w.store });
            reload.run('languages/lm-i18n.js');
            reload.run('languages/lm-en.js');
            ok(reload.LMi18n.lang() === code && reload.lmT('boot.loading') === tx(all.boot['boot.loading'], code), code + ': persisted selection works on reload');
            const theme = Buffer.from(JSON.stringify({ lang: I.CODES.indexOf(code) + 1 })).toString('base64');
            const label = makeEl('span', { 'data-i18n': 'site.home' }, 'Home');
            const site = page({ hash: '#lm=' + theme, body: [label] });
            site.run('lib/lm-i18n.js');
            site.ready();
            for (let i = 0; i < 20 && label.textContent === 'Home'; i++) await tick();
            ok(site.LMi18n.lang() === code && label.textContent === tx(all.site['site.home'], code) && site.document.documentElement.attrs.lang === (code === 'pt' ? 'pt-BR' : code), code + ': website receives language from game link');
        }
        /* the website without a chosen language: a browser in one of the four gets it */
        for (const code of I.CODES.slice(12)) {
            const label = makeEl('span', { 'data-i18n': 'site.home' }, 'Home');
            const site = page({ navLang: code === 'pt' ? 'pt-BR' : code + '-XX', body: [label] });
            site.run('lib/lm-i18n.js');
            site.ready();
            for (let i = 0; i < 20 && label.textContent === 'Home'; i++) await tick();
            ok(site.LMi18n.lang() === code && label.textContent === tx(all.site['site.home'], code) && !('languagemod' in site.store), code + ': website follows the browser language');
        }
        /* old Android WebViews report Indonesian as "in"; pt-PT still gets the Portuguese pack */
        const wi = page({ navLang: 'in-ID' });
        wi.run('languages/lm-i18n.js');
        ok(wi.LMi18n.lang() === 'id', 'in-ID browser -> Indonesian');
        const wp = page({ navLang: 'pt-PT' });
        wp.run('languages/lm-i18n.js');
        ok(wp.LMi18n.lang() === 'pt', 'pt-PT browser -> Portuguese');
        /* the twelve keep their browser detection */
        for (const code of I.CODES.slice(0, 12)) {
            const wb = page({ navLang: code + '-XX' });
            wb.run('languages/lm-i18n.js');
            ok(wb.LMi18n.lang() === code, code + ': browser language still detected');
        }
    }
    /* ---------- 4. the mod without a stored language: English, nothing written ---------- */
    {
        const w = page({});
        w.run('languages/lm-i18n.js');
        w.run('languages/lm-en.js');
        ok(w.written.length === 0 && w.LMi18n.lang() === 'en' && w.Languageletter0 === 'Home', 'mod: English for an English browser');
        /* a first-time player (nothing chosen): the browser's language, not saved (the Choose Language
         * list shows LMi18n.num(): LMexpress.js languagemodfun) */
        const wg = page({ navLang: 'el-GR' });
        wg.run('languages/lm-i18n.js');
        wg.run('languages/lm-en.js');
        ok(wg.LMi18n.lang() === 'el' && wg.LMi18n.num() === '2' && wg.LMi18n.prefixed('settings.').showMass === tx(all.settings['settings.showMass'], 'el') && wg.Languageletter0 === tx(all.packs['pack.home'], 'el'),
            'mod: nothing chosen + Greek browser -> Greek labels, list value 2');
        ok(!('languagemod' in wg.store), 'mod: the browser language is not saved');
        const we = page({ navLang: 'el-GR', storage: { languagemod: '1' } });
        we.run('languages/lm-i18n.js');
        we.run('languages/lm-en.js');
        ok(we.LMi18n.lang() === 'en' && we.written.length === 0 && we.Languageletter0 === 'Home', 'mod: English chosen + Greek browser -> English');
        const wn = page({ navLang: 'el-GR', storage: { languagemod: 'null' } });
        wn.run('languages/lm-i18n.js');
        ok(wn.LMi18n.lang() === 'el', 'mod: "null" stored by old versions counts as nothing chosen');
        /* a language file that arrives before the runtime (queue) */
        const w2 = page({ storage: { languagemod: '6' } });
        w2.run('languages/lm-ar.js');
        w2.run('languages/lm-i18n.js');
        ok(w2.LMi18n.loaded('ar') && w2.LMi18n.lang() === 'ar' && w2.LMi18n.dir() === 'rtl', 'queue: a file loaded before the runtime is used; Arabic is rtl');
    }
    /* ---------- 5. web pages (lib/lm-i18n.js) ---------- */
    {
        const theme = Buffer.from(JSON.stringify({ pc: '#000', lang: '6' }), 'binary').toString('base64');
        const h1 = makeEl('h1', { 'data-i18n': 'site.features' }, 'Features');
        const picker = makeEl('span', { 'data-lm-lang-picker': '' });
        const w = page({ hash: '#lm=' + theme, body: [h1, picker] });
        w.run('lib/lm-i18n.js', { 'data-areas': 'site-faq' });
        ok(w.written.some((s) => /lm-site-en\.js/.test(s)) && w.written.some((s) => /lm-site-ar\.js/.test(s)) && w.written.some((s) => /lm-site-faq-ar\.js/.test(s)), 'page: writes site + page area files, English and Arabic: ' + w.written.length);
        ok(w.store.languagemod === '6', 'page: the language from the Theme Bridge hash is saved');
        w.ready();
        for (let i = 0; i < 20 && h1.textContent === 'Features'; i++) await tick();
        ok(h1.textContent === tx(all.site['site.features'], 'ar'), 'page: data-i18n in Arabic');
        ok(w.document.documentElement.attrs.dir === 'rtl' && w.document.documentElement.attrs.lang === 'ar', 'page: <html dir=rtl lang=ar>');
        const sel = picker.children[0];
        ok(sel && sel.tagName === 'SELECT' && sel.children.length === I.CODES.length && sel.value === '6', 'page: language picker with all supported languages');
        ok(typeof w.lmT === 'function' && w.lmT('site.faq.' + Object.keys(all['site-faq'])[0].split('.').pop()) !== undefined, 'page: lmT');
        /* postMessage from the mod (iframe) */
        w._onMessage({ data: { type: 'lm-theme', theme: { lang: '2' } } });
        for (let i = 0; i < 20 && w.LMi18n.lang() !== 'el'; i++) await tick();
        ok(w.LMi18n.lang() === 'el' && h1.textContent === tx(all.site['site.features'], 'el') && w.document.documentElement.attrs.dir === 'ltr', 'page: postMessage lang switches to Greek');
        /* no bridge, no storage: the browser language */
        const w2 = page({ navLang: 'de-DE' });
        w2.run('lib/lm-i18n.js');
        ok(w2.LMi18n.lang() === 'de', 'page: browser language when nothing was chosen');
        const w3 = page({ navLang: 'ja-JP', storage: { languagemod: '12' } });
        w3.run('lib/lm-i18n.js');
        ok(w3.LMi18n.lang() === 'nl', 'page: localStorage languagemod wins over the browser');
    }
    /* Delayed modules must translate on insertion and during a live language change. */
    {
        const w = page({ navLang: 'en-US' });
        w.run('languages/lm-i18n.js');
        w.run('languages/lm-en.js');
        /* Run the real optional Discord script without any WebSocket or webhook calls. */
        const menu = makeEl('div', {id:'agario-main-buttons'});
        w.document.body.appendChild(menu);
        let button, toast, delayed;
        menu.append = menu.appendChild;
        w.messageone = '1';
        w.$ = function (selector, attrs) {
            if (selector !== '<button/>') throw Error('unexpected Discord selector: ' + selector);
            button = makeEl('button', attrs, attrs.text);
            return [button];
        };
        w.$.find = selector => selector === '#agario-main-buttons' ? [menu] : [];
        w.toastr = {info: value => { toast = value; return {css() {}}; }};
        await new Promise(resolve => w.LMi18n.setLang(2, resolve));
        const realTimer = w.setTimeout;
        w.setTimeout = fn => { delayed = fn; };
        try { w.run('agarscripts/DiscordSIP.user.js'); delayed(); }
        finally { w.setTimeout = realTimer; }
        ok(menu.children.length === 1 && button.attrs.id === 'lm-discord-post-server', 'real Discord button inserted once');
        w.displayDiscordNotification();
        ok(toast === tx(all.discord['discord.sent'], 'el'), 'real Discord confirmation Greek');

        const tab = makeEl('a', {'data-i18n':'shop.animatedFree'}, 'Animated-Free');
        const close = makeEl('button', {'data-i18n-title':'shop.close'}, '');
        await new Promise(resolve => w.LMi18n.setLang(2, resolve));
        w.document.body.appendChild(tab);
        w.document.body.appendChild(close);
        w.LMi18n.apply(button);
        w.LMi18n.apply(tab);
        w.LMi18n.apply(close);
        ok(button.textContent === tx(all.discord['discord.post'], 'el'), 'late Discord button Greek');
        ok(tab.textContent === tx(all.shop['shop.animatedFree'], 'el'), 'late shop tab Greek');
        ok(close.getAttribute('title') === tx(all.shop['shop.close'], 'el'), 'late shop tooltip Greek');
        await new Promise(resolve => w.LMi18n.setLang(6, resolve));
        ok(button.textContent === tx(all.discord['discord.post'], 'ar'), 'existing Discord button Arabic');
        w.displayDiscordNotification();
        ok(toast === tx(all.discord['discord.sent'], 'ar'), 'real Discord confirmation Arabic');
        ok(tab.textContent === tx(all.shop['shop.animatedFree'], 'ar'), 'existing shop tab Arabic');
        ok(close.getAttribute('title') === tx(all.shop['shop.close'], 'ar'), 'existing shop tooltip Arabic');
        await new Promise(resolve => w.LMi18n.setLang(1, resolve));
        ok(button.textContent === tx(all.discord['discord.post'], 'en'), 'existing Discord button English');
        ok(w.lmT('shop.activated', ['Example']) === tx(all.shop['shop.activated'], 'en').replace('{0}', 'Example'), 'shop notification substitution');
    }
    /* ---------- 6. the scanner ---------- */
    {
        const tmp = path.join(repo, 'developers', 'tests', 'out');
        fs.mkdirSync(tmp, { recursive: true });
        const f = path.join(tmp, 'i18n-scan-sample.js');
        fs.writeFileSync(f, [
            "toastr.info('Hello there');",
            "toastr.info(lmT('leagues'));",
            "toastr.info(_lmTH('core.noSuchKey', 'Fallback English'));",
            "el.innerHTML = '<b>Title</b> two words <span data-i18n=\"leagues\">Leagues</span>';",
            "$('#x').attr('title', 'Tooltip text');",
            "console.log('Not for players');",
            "var css = '.a{color:red;}';",
            "var id = 'some-id';",
            "alert('Shown text'); // i18n-ok: test",
            "var o = { label: 'Menu label' };",
            "var button = $('<button/>', {\ntext: 'Post Server IP to Discord'\n});",
            "Premadeletter39 = 'English override';"
        ].join('\n'));
        const res = scan.scanFile(path.relative(repo, f));
        const got = res.map((r) => r.kind + ':' + r.text).join(' | ');
        const want = ['text:Hello there', 'key:core.noSuchKey', 'html:Title', 'html:two words', 'text:Tooltip text', 'text:Menu label', 'text:Post Server IP to Discord', 'text:Premadeletter39 = English override'];
        ok(want.every((x) => got.indexOf(x) >= 0) && res.length === want.length, 'scanner sample: ' + got);
        fs.unlinkSync(f);
        /* strict files: nothing hard-coded left */
        (scan.config.strict || []).forEach((file) => {
            const r = scan.scanFile(file);
            ok(r.length === 0, 'strict file ' + file + ' has hard-coded text: ' + r.slice(0, 5).map((x) => x.line + ' ' + x.text).join('; '));
        });
        /* report only: the work list of stage 2 */
        const groups = scan.groups();
        const summary = Object.keys(groups).map((g) => g.split(':')[0] + ' ' + groups[g].reduce((n, file) => n + scan.scanFile(file).length, 0));
        console.log('scanner: strict ' + (scan.config.strict || []).length + ' files clean; still hard-coded per group: ' + summary.join(', '));
    }
    console.log(failed ? failed + ' check(s) failed' : 'i18n: all checks pass');
    process.exit(failed ? 1 : 0);
})().catch((e) => { console.log('FAIL ' + (e && e.stack || e)); process.exit(1); });
