/* Gives a test's vm context the real translation runtime (window.lmT, window.LMi18n) with the built
 * texts of languages/lm-en.js (+ one other language), so modules loaded in a vm show the same texts
 * as in the game.
 *
 *   const i18n = require('./lib/i18n-env');
 *   i18n(ctx);            English
 *   i18n(ctx, 'el');      Greek (English stays the fallback); ctx.LMi18n.setLang('fr') switches later
 *   i18n.t('modules.x.y') the English text of a key (for assertions), i18n.t(key, vars, 'el')
 *
 * The runtime runs in its own small sandbox (no real DOM needed); only lmT and LMi18n are handed over.
 * Languages loaded later through setLang are read from the checkout synchronously. */
'use strict';
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const LANG_DIR = path.join(__dirname, '..', '..', '..', 'languages');
const read = (f) => fs.readFileSync(path.join(LANG_DIR, f), 'utf8');

function sandbox(code) {
    const store = { languagemod: String(require('../../i18n/lib').CODES.indexOf(code) + 1 || 1) };
    const sb = {
        console,
        localStorage: {
            getItem: (k) => (k in store ? store[k] : null),
            setItem: (k, v) => { store[k] = String(v); },
            removeItem: (k) => { delete store[k]; }
        }
    };
    sb.window = sb;
    /* the runtime also reads a language passed in the address (#lm=) and the browser's language */
    sb.location = { hash: '', search: '', href: 'https://www.legendmod.ml/play.html' };
    sb.navigator = { language: 'en-US' };
    sb.addEventListener = function () { };
    sb.document = {
        currentScript: null,
        readyState: 'complete',
        body: null,
        documentElement: { setAttribute() { } },
        querySelectorAll: () => [],
        /* setLang of a language not loaded yet: run its file from the checkout at once */
        createElement: () => ({ setAttribute() { } }),
        head: {
            appendChild(s) {
                const m = /languages\/(lm-[a-z]+\.js)/.exec(s.src || '');
                if (m && fs.existsSync(path.join(LANG_DIR, m[1]))) vm.runInContext(read(m[1]), sb, { filename: m[1] });
                else if (s.onerror) s.onerror();
            }
        }
    };
    vm.createContext(sb);
    vm.runInContext(read('lm-en.js'), sb, { filename: 'lm-en.js' });
    if (code && code !== 'en') vm.runInContext(read('lm-' + code + '.js'), sb, { filename: 'lm-' + code + '.js' });
    vm.runInContext(read('lm-i18n.js'), sb, { filename: 'lm-i18n.js' });
    return sb;
}

function install(ctx, code) {
    const sb = sandbox(code || 'en');
    ctx.lmT = sb.lmT;
    ctx.LMi18n = sb.LMi18n;
    if (ctx.window && ctx.window !== ctx) { ctx.window.lmT = sb.lmT; ctx.window.LMi18n = sb.LMi18n; }
    return sb.LMi18n;
}

/* text of a key outside any module context */
const cache = {};
install.t = function (key, vars, code) {
    code = code || 'en';
    if (!cache[code]) cache[code] = sandbox(code);
    return cache[code].lmT(key, vars);
};

module.exports = install;
