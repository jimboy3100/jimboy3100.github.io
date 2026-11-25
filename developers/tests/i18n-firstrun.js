// First visit in headless Chrome (needs Chrome, like run.js; skipped without it):
// 1. fresh profile, Greek browser: the mod starts in Greek without saving it, the one-time language
//    window appears with Greek picked and Greek texts; OK saves languagemod 2 and it never comes again.
// 2. fresh profile, Greek browser, languagemod 1 stored: English, and the window never appears.
// Usage: node developers/tests/i18n-firstrun.js [--secs N]
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const here = __dirname;
const repo = path.resolve(here, '..', '..');
const args = process.argv.slice(2);
const secs = Number((args.indexOf('--secs') >= 0 && args[args.indexOf('--secs') + 1]) || 12);
const el = JSON.parse(fs.readFileSync(path.join(repo, 'developers', 'i18n', 'src', 'core.json'), 'utf8'))['core.langFirstTitle'].el;

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
    return res;
}

const probeFirst = `(async () => {
  var fail = [], info = {};
  function need(n, ok) { if (!ok) fail.push(n); }
  var wait = async function (c, ms) { var t0 = Date.now(); while (!c() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return c(); };
  info.navigator = navigator.language;
  need('mod in Greek (browser language)', window.LMi18n && LMi18n.lang() === 'el');
  need('not saved', localStorage.getItem('languagemod') == null);
  need('Choose Language list shows 2', $('#legendlanguages').val() === '2');
  need('settings labels Greek', /[\\u0370-\\u03ff]/.test(textLanguage.showMass));
  need('window shown', await wait(function () { return !!document.getElementById('lm-lang-first'); }, 15000));
  var box = document.getElementById('lm-lang-first');
  if (!box) return { fail: fail, info: info };
  var sel = box.querySelector('select.lm-lang-select');
  need('Greek picked', sel && sel.value === '2');
  need('focused', document.activeElement === sel);
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

const probeStored = `(async () => {
  var fail = [], info = {};
  function need(n, ok) { if (!ok) fail.push(n); }
  await new Promise(function (r) { setTimeout(r, 3000); });
  info.navigator = navigator.language;
  need('English chosen wins over a Greek browser', window.LMi18n && LMi18n.lang() === 'en' && $('#legendlanguages').val() === '1');
  need('no window with a stored language', !document.getElementById('lm-lang-first'));
  return { fail: fail, info: info };
})()`;

let failed = 0, skipped = false;
[['greek', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'el-GR' }, probeFirst],
    ['stored', { SMOKE_FIRSTRUN: '1', SMOKE_LANG: 'el-GR', SMOKE_STORAGE: '{"languagemod":"1"}' }, probeStored]].forEach(([name, env, probe]) => {
    if (skipped) return;
    const res = run(name, env, probe);
    if (res.skipped) { skipped = true; return; }
    let p = null;
    try { p = typeof res.probe === 'string' ? JSON.parse(res.probe) : res.probe; } catch (e) { }
    const problems = [];
    if (res.err) problems.push(res.err);
    if (!p) problems.push('no probe result: ' + JSON.stringify(res.probe).slice(0, 300));
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
