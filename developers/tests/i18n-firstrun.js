// First visit in headless Chrome (needs Chrome, like run.js; skipped without it):
// 1. fresh profile, Greek browser: the mod starts in Greek without saving it, the one-time language
//    window appears with Greek picked and Greek texts; OK saves languagemod 2 and it never comes again.
// 2. fresh profile, Greek browser, languagemod 1 stored: English, and the window never appears.
// 3. fresh profile, pt-BR / id / ja / it browser: that language everywhere (loading screen, mod, window,
//    website), the 16 languages listed without Beta, OK saves it.
// Usage: node developers/tests/i18n-firstrun.js [--secs N]
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const here = __dirname;
const repo = path.resolve(here, '..', '..');
const args = process.argv.slice(2);
const secs = Number((args.indexOf('--secs') >= 0 && args[args.indexOf('--secs') + 1]) || 12);
const I = require(path.join(repo, 'developers', 'i18n', 'lib'));
const src = I.readAll();
const el = src.core['core.langFirstTitle'].el;

function run(name, env, probe) {
    const out = path.join(here, 'out', 'firstrun-' + name + '-' + Date.now());
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'probe.js'), probe);
    const r = spawnSync(process.execPath, [path.join(here, 'smoke.js'), repo, out, String(secs)], {
        encoding: 'utf8', timeout: (secs + 120) * 1000, env: Object.assign({}, process.env, env)
    });
    const text = (r.stdout || '') + (r.stderr || '');
    if (/chrome not found/.test(text)) return { skipped: true };
    const file = path.join(out, 'result.json');
    if (!fs.existsSync(file)) return { err: 'smoke run failed: ' + text.slice(0, 800) };
    const res = JSON.parse(fs.readFileSync(file, 'utf8'));
    try { fs.rmSync(path.join(out, 'profile'), { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
    res.text = text;
    return res;
}

const probeFirst = `(async () => {
  var fail = [], info = {};
  function need(n, ok) { if (!ok) fail.push(n); }
  var wait = async function (c, ms) { var t0 = Date.now(); while (!c() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return c(); };
  info.navigator = navigator.language;
  /* the probe starts after a fixed time and a slow boot may not have built the settings yet: wait for the
   * Choose Language list (triggerLMbtns builds it, languagemodfun then picks the language in the same call) */
  info.listWaitMs = Date.now();
  await wait(function () { return $('#legendlanguages').length > 0; }, 20000);
  info.listWaitMs = Date.now() - info.listWaitMs;
  need('mod in Greek (browser language)', window.LMi18n && LMi18n.lang() === 'el');
  need('not saved', localStorage.getItem('languagemod') == null);
  need('Choose Language list shows 2', $('#legendlanguages').val() === '2');
  need('settings labels Greek', /[\\u0370-\\u03ff]/.test(textLanguage.showMass));
  need('window shown', await wait(function () { return !!document.getElementById('lm-lang-first'); }, 15000));
  var box = document.getElementById('lm-lang-first');
  if (!box) return { fail: fail, info: info };
  var sel = box.querySelector('select.lm-lang-select');
  need('Greek picked', sel && sel.value === '2');
  /* the window focuses its list just after it is added (a timer), and the poll above can see it first */
  need('focused', await wait(function () { return document.activeElement === sel; }, 2000));
  need('Greek title', box.querySelector('.modal-title').textContent === ${JSON.stringify(el)});
  box.querySelector('.lm-lang-first-ok').click();
  need('closed by OK', !document.getElementById('lm-lang-first'));
  need('saved 2, asked', localStorage.getItem('languagemod') === '2' && localStorage.getItem('lmLangAsked') === '1');
  localStorage.removeItem('lmLangAsked');
  _lmFirstLanguageChooser();
  await new Promise(function (r) { setTimeout(r, 1500); });
  need('never again after a pick', !document.getElementById('lm-lang-first'));
  return { fail: fail, info: info };
})()`;

/* 3. fresh profile, a pt-BR / Indonesian / Japanese / Italian browser (languages 13-16): the loading screen,
 * the mod and the one-time window are in that language, the window lists the 16 languages under their own
 * names (no Beta), and the website (index.html in a same-origin frame, before anything is saved) follows
 * the same browser language. OK saves the number. */
function probeNew(code) {
    const n = I.CODES.indexOf(code) + 1;
    const exp = {
        n: String(n), code, htmlLang: code === 'pt' ? 'pt-BR' : code, name: I.NAMES[code],
        names: I.CODES.map((c) => I.NAMES[c]),
        title: src.core['core.langFirstTitle'][code], showMass: src.settings['settings.showMass'][code],
        features: src.site['site.features'][code], about: src['site-index']['site.index.about'][code]
    };
    return `(async () => {
  var fail = [], info = {}, E = ${JSON.stringify(exp)};
  function need(n, ok) { if (!ok) fail.push(n); }
  var wait = async function (c, ms) { var t0 = Date.now(); while (!c() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return c(); };
  info.navigator = navigator.language;
  await wait(function () { return $('#legendlanguages').length > 0; }, 20000);
  need('loading screen in the browser language', window._lmBootLang === +E.n);
  need('mod in the browser language', window.LMi18n && LMi18n.lang() === E.code && LMi18n.num() === E.n);
  need('not saved', localStorage.getItem('languagemod') == null);
  need('Choose Language list shows ' + E.n, $('#legendlanguages').val() === E.n);
  need('Choose Language list: own name, no Beta', $('#legendlanguages option[value="' + E.n + '"]').text() === E.name && !/Beta/.test($('#legendlanguages').text()));
  need('settings labels translated', textLanguage.showMass === E.showMass);
  need('window shown', await wait(function () { return !!document.getElementById('lm-lang-first'); }, 15000));
  var box = document.getElementById('lm-lang-first');
  /* what held the window back (it waits for the boot screen to go, the menu and no game) */
  if (!box) { info.why = { boot: !!document.getElementById('lm-boot'), menu: !!(window.jQuery && $('#main-menu').is(':visible')), overlays: !!(window.jQuery && $('#overlays').is(':visible')), play: !!(window.legendmod && legendmod.play), asked: localStorage.getItem('lmLangAsked'), saved: localStorage.getItem('languagemod') }; return { fail: fail, info: info }; }
  var sel = box.querySelector('select.lm-lang-select');
  need('browser language picked', sel && sel.value === E.n);
  var names = sel ? Array.prototype.map.call(sel.options, function (o) { return o.textContent; }) : [];
  need('16 languages under their own names, no Beta', names.join('|') === E.names.join('|'));
  need('title translated', box.querySelector('.modal-title').textContent === E.title);
  /* the website with the same browser, nothing saved yet */
  var fr = document.createElement('iframe');
  fr.style.cssText = 'position:fixed;left:0;top:0;width:800px;height:600px;opacity:0;pointer-events:none';
  fr.src = 'https://www.legendmod.ml/index.html';
  document.body.appendChild(fr);
  var site = function () { try { return fr.contentWindow.LMi18n && fr.contentDocument.querySelector('[data-i18n="site.index.about"]'); } catch (e) { return null; } };
  /* the page loads while the mod is still starting: on a busy machine that can take well over 20 s */
  var shown = await wait(function () { var a = site(); return a && a.textContent === E.about; }, 45000);
  try {
    var d = fr.contentDocument, L = fr.contentWindow.LMi18n;
    info.site = L ? L.lang() + ' ' + d.documentElement.getAttribute('lang') : 'no runtime';
    /* not loaded in time: say so instead of failing on a missing element below */
    if (!shown && !d.querySelector('[data-i18n="site.features"]')) throw new Error('index.html did not load in the frame within 45 s (' + d.readyState + ' ' + d.URL + ')');
    need('website in the browser language', L && L.lang() === E.code && d.documentElement.getAttribute('lang') === E.htmlLang);
    need('website texts translated', d.querySelector('[data-i18n="site.features"]').textContent === E.features && d.querySelector('[data-i18n="site.index.about"]').textContent === E.about);
    var ps = d.querySelector('[data-lm-lang-picker] select');
    need('website picker: 16 own names, browser language picked', ps && ps.value === E.n && Array.prototype.map.call(ps.options, function (o) { return o.textContent; }).join('|') === E.names.join('|'));
    need('website did not save the browser language', localStorage.getItem('languagemod') == null);
  } catch (e) { fail.push('website: ' + e.message); }
  fr.remove();
  box.querySelector('.lm-lang-first-ok').click();
  need('saved ' + E.n + ' by OK', localStorage.getItem('languagemod') === E.n && localStorage.getItem('lmLangAsked') === '1');
  return { fail: fail, info: info };
})()`;
}

const probeStored = `(async () => {
  var fail = [], info = {};
  function need(n, ok) { if (!ok) fail.push(n); }
  var wait = async function (c, ms) { var t0 = Date.now(); while (!c() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return c(); };
  /* after the boot (see probeFirst), then long enough for the window's 500 ms menu check to have shown it */
  await wait(function () { return $('#legendlanguages').length > 0; }, 20000);
  await new Promise(function (r) { setTimeout(r, 3000); });
  info.navigator = navigator.language;
  need('English chosen wins over a Greek browser', window.LMi18n && LMi18n.lang() === 'en' && $('#legendlanguages').val() === '1');
  need('no window with a stored language', !document.getElementById('lm-lang-first'));
  return { fail: fail, info: info };
})()`;

let failed = 0, skipped = false;
[['greek', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'el-GR' }, probeFirst],
    ['pt-BR', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'pt-BR' }, probeNew('pt')],
    ['id', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'id-ID' }, probeNew('id')],
    ['ja', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'ja-JP' }, probeNew('ja')],
    ['it', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'it-IT' }, probeNew('it')],
    ['stored', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'el-GR', SMOKE_STORAGE: '{"languagemod":"1"}' }, probeStored]].forEach(([name, env, probe]) => {
    if (skipped) return;
    /* FIRSTRUN_ONLY=ja,it runs only those cases */
    if (process.env.FIRSTRUN_ONLY && process.env.FIRSTRUN_ONLY.split(',').indexOf(name) < 0) return;
    const res = run(name, env, probe);
    if (res.skipped) { skipped = true; return; }
    let p = null;
    try { p = typeof res.probe === 'string' ? JSON.parse(res.probe) : res.probe; } catch (e) { }
    const problems = [];
    if (res.err) problems.push(res.err);
    /* an empty result (the probe threw or the page went away) is not a pass */
    if (!p || !Array.isArray(p.fail)) problems.push('no probe result: ' + JSON.stringify(res.probe).slice(0, 300) + ' | ' + String(res.text || '').replace(/\s+/g, ' ').slice(-400));
    else (p.fail || []).forEach((f) => problems.push(f));
    if (res.errorCount) problems.push('page errors: ' + res.errors.slice(0, 3).join(' / '));
    console.log(name + ': ' + (problems.length ? 'FAIL ' + problems.join('; ') : 'ok') + (p && p.info ? ' ' + JSON.stringify(p.info) : ''));
    failed += problems.length;
});
if (skipped) console.log('i18n-firstrun: skipped (no Chrome), pass');
else {
    console.log(failed ? 'i18n-firstrun: FAIL' : 'i18n-firstrun: all checks pass');
    process.exit(failed ? 1 : 0);
}
