// Saved Tools tab choices on load (needs Chrome, like run.js; skipped without it): with Show Shortcuts,
// Rounded HUD and Show Timer Calc. saved and a leaderboard / teamboard title set in Theme > HUD, the page
// loads without an error, the three buttons show their saved state and the titles are on the HUD.
// LMexpress.js applies the saved buttons while it is still loading: the Rounded HUD theme notice and the
// timer threw there (their variables are set further down the file) and the rest of the load stopped,
// so the timer and the HUD images and titles were not restored.
// With Settings > Stats > Show current time saved on (24-hour format), the clock is on screen after the
// load (it was hidden on every load) and clear of the minimap, the button rows above it (shortcuts and
// timer, both on here) and the leaderboard (its fixed top put it under them on lower windows).
// Usage: node developers/tests/toolsrestore.js [--secs N]
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const here = __dirname;
const repo = path.resolve(here, '..', '..');
const args = process.argv.slice(2);
const secs = Number((args.indexOf('--secs') >= 0 && args[args.indexOf('--secs') + 1]) || 12);

const probe = `(async () => {
  var fail = [], info = {};
  var wait = async function (c, ms) { var t0 = Date.now(); while (!c() && Date.now() - t0 < ms) await new Promise(function (r) { setTimeout(r, 100); }); return c(); };
  await wait(function () { return $('#legendlanguages').length > 0 && $('#TIMEcalBtn').length > 0; }, 20000);
  ['SHOSHOBtn', 'MAINBTBtn', 'TIMEcalBtn'].forEach(function (id) {
    info[id] = $('#' + id).attr('aria-pressed');
    if ($('#' + id).attr('aria-pressed') !== 'true') fail.push(id + ' not restored: ' + $('#' + id).attr('aria-pressed'));
  });
  info.timer = $('#timertools-hud').css('display');
  if (!window.TimerLM || !TimerLM.timerDiv || TimerLM.timerDiv.id !== 'timer') fail.push('timer calculator has no timer field');
  info.radius = getComputedStyle(document.documentElement).getPropertyValue('--lm-radius').trim();
  if (info.radius !== '10px') fail.push('rounded corners not applied: ' + info.radius);
  info.lb = $('#leaderboard-hud > h5').text(); info.tb = $('#top5-hud > h5').text();
  if (info.lb !== 'LB title') fail.push('leaderboard title not restored: ' + info.lb);
  if (info.tb !== 'TB title') fail.push('teamboard title not restored: ' + info.tb);
  if ($('#leadbtext').val() !== 'LB title') fail.push('leaderboard title field shows ' + $('#leadbtext').val());
  /* the clock: shown, updating, clear of the minimap, its rows and the leaderboard (after one 1 s update) */
  await new Promise(function (r) { setTimeout(r, 1500); });
  var clock = document.getElementById('time-hud'), cr = clock.getBoundingClientRect();
  info.clock = [cr.left, cr.top, cr.right, cr.bottom].map(Math.round).join(',') + ' ' + clock.textContent;
  if (getComputedStyle(clock).display === 'none' || !cr.width || !cr.height) fail.push('clock not shown');
  if (!/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(clock.textContent)) fail.push('clock text: ' + clock.textContent);
  if (cr.left < 0 || cr.top < 0 || cr.right > innerWidth || cr.bottom > innerHeight) fail.push('clock off screen');
  var boxes = $('#leaderboard-hud, #minimap-hud, #minimap-hud > *').filter(function () { return this.getClientRects().length && getComputedStyle(this).display !== 'none'; });
  info.boxes = boxes.map(function () { var r = this.getBoundingClientRect(); return (this.id || this.tagName) + ':' + [r.left, r.top, r.right, r.bottom].map(Math.round).join(','); }).get().join(' ');
  boxes.each(function () { var r = this.getBoundingClientRect(); if (r.width && r.height && r.left < cr.right && r.right > cr.left && r.top < cr.bottom && r.bottom > cr.top) fail.push('clock under ' + (this.id || this.tagName)); });
  return JSON.stringify({ fail: fail, info: info });
})()`;

const out = path.join(here, 'out', 'toolsrestore-' + Date.now());
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'probe.js'), probe);
const storage = { ogarioSettings: JSON.stringify({ showTime: true, timeFormat: 2 }), SHOSHOBtn: 'true', MAINBTBtn: 'true', TIMEcalBtn: 'true', leadbtext: 'LB title', teambtext: 'TB title' };
const r = spawnSync(process.execPath, [path.join(here, 'smoke.js'), repo, out, String(secs)], {
  encoding: 'utf8', timeout: (secs + 120) * 1000, env: Object.assign({}, process.env, { SMOKE_STORAGE: JSON.stringify(storage) })
});
const text = (r.stdout || '') + (r.stderr || '');
if (/chrome not found/.test(text)) { console.log('SKIP chrome not found'); process.exit(0); }
const file = path.join(out, 'result.json');
if (!fs.existsSync(file)) { console.log('FAIL smoke run failed: ' + text.slice(0, 800)); process.exit(1); }
const res = JSON.parse(fs.readFileSync(file, 'utf8'));
try { fs.rmSync(path.join(out, 'profile'), { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
let failed = 0;
const check = (name, ok, more) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || !more ? '' : ': ' + more)); if (!ok) failed++; };
check('no page errors', res.errorCount === 0, (res.errors || []).join(' / ').slice(0, 600));
let p = null;
try { p = JSON.parse(res.probe); } catch (e) { }
check('probe ran', !!p, String(res.probe).slice(0, 300));
if (p) {
  console.log('     ' + JSON.stringify(p.info));
  check('saved Tools buttons, HUD titles and clock restored', p.fail.length === 0, p.fail.join(', '));
}
console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
