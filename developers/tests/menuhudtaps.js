/* Phones, main menu open: the button rows above the minimap (the .hud children LMexpress.js puts
 * into #minimap-hud, with an inline pointer-events:auto) take no taps, as the minimap itself
 * (hudTaps), and take them again once the menu is closed; they stay shown. The real stylesheet
 * of LMmobile/LMmobile.js in headless Chrome (--dump-dom, about 2 s; skipped without Chrome),
 * where elementFromPoint says what a tap would hit.
 * node developers/tests/menuhudtaps.js */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const root = process.env.LM_ROOT || path.join(__dirname, '..', '..');
const mob = fs.readFileSync(path.join(root, 'LMmobile', 'LMmobile.js'), 'utf8').replace(/\r\n/g, '\n');
const { findChrome } = require('./glbatch.js');
let fail = 0;
const check = (n, c, info) => { console.log((c ? 'ok   ' : 'FAIL ') + n + (c || info === undefined ? '' : '  [' + info + ']')); if (!c) fail++; };

/* the stylesheet text: the string expression after css.textContent = up to its closing ';' */
const a = mob.indexOf('css.textContent =') + 'css.textContent ='.length;
const b = mob.indexOf("';\n", a) + 1;
const cssText = new Function('return (' + mob.slice(a, b) + ')')();
check('LMmobile.js stylesheet read', typeof cssText === 'string' && cssText.length > 1000);

const chrome = findChrome();
if (!chrome) { console.log('skip: no Chrome'); process.exit(fail ? 1 : 0); }
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-menuhudtaps-'));
const page = path.join(dir, 'p.html');
/* the menu under the minimap; #minimap-hud with hudTaps' inline none while the menu is open, a
 * row 30 px above its top edge as LMexpress.js makes it, with a button */
fs.writeFileSync(page, '<!doctype html><html><head><style>' + cssText.replace(/<\/style/gi, '') + '</style></head>' +
    '<body class="lm-menu" style="margin:0">' +
    '<div id="menu" style="position:fixed;left:0;top:0;width:800px;height:400px;z-index:1"></div>' +
    '<div id="minimap-hud" style="position:fixed;right:10px;bottom:10px;width:150px;height:150px;z-index:2">' +
    '<div id="shortcuts-hud" class="hud" style="width: 70%; height: 30px; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: -30px; display: block;">' +
    '<button id="row-btn" style="width:100%;height:30px">x</button></div></div>' +
    '<script>' +
    'var mm = document.getElementById("minimap-hud"), out = [];' +
    'function hit() { var r = document.getElementById("row-btn").getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);' +
    ' var m = mm.getBoundingClientRect(), f = document.elementFromPoint(m.left + 5, m.top + m.height / 2); return (e ? e.id : "-") + "/" + (f ? f.id : "-") + "/" + getComputedStyle(document.getElementById("shortcuts-hud")).display; }' +
    'mm.style.setProperty("pointer-events", "none", "important"); out.push(hit());' +
    'document.body.classList.remove("lm-menu"); mm.style.setProperty("pointer-events", "auto", "important"); out.push(hit());' +
    'document.body.setAttribute("data-r", out.join("|"));' +
    '</script></body></html>');
let dom = '';
try {
    dom = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--user-data-dir=' + path.join(dir, 'prof'),
        '--window-size=800,400', '--dump-dom', require('url').pathToFileURL(page).href], { encoding: 'utf8', timeout: 30000, stdio: ['ignore', 'pipe', 'ignore'] });
} catch (e) { dom = String(e.stdout || ''); }
try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { }
const m = /data-r="([^"]*)"/.exec(dom);
const r = m ? m[1].split('|') : [];
check('menu open: a tap on a button row above the minimap reaches the menu, the row stays shown', r[0] === 'menu/menu/block', r[0]);
check('menu closed: the row\'s button takes the tap again, the minimap too', r[1] === 'row-btn/minimap-hud/block', r[1]);
console.log(fail ? fail + ' check(s) failed' : 'all menu HUD tap checks passed');
process.exit(fail ? 1 : 0);
