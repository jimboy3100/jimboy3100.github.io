/* Hotkeys removed because nothing worked behind them: "Switch server [public/private]" (its
 * private relay never had an address) and "Show/hide quest" (its HUD box was never filled). A key
 * saved on them is dropped quietly (lmRenameOldHotkeys, for the stored hotkeys and the settings
 * profiles), so the default '-' of the server switch is free again. The functions are taken
 * from ogario/ogario.v4.js and run in a vm. The texts of these and of two commands that no longer
 * exist (Multibox toggle back, Show developer console) are not shipped.
 * node developers/tests/deadhotkeys.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

const hkSrc = read('ogario/hotkeysCommand.js').replace(/\r\n/g, '\n');
const v4 = read('ogario/ogario.v4.js').replace(/\r\n/g, '\n');
const gone = ['hk-switchServerMode', 'hk-showQuest', 'hk-multiboxback'];
gone.forEach(c => check(c + ': no hotkey command', hkSrc.indexOf("'" + c + "'") < 0));
/* texts of commands that do not exist are not shipped */
{
  const en = read('languages/lm-en.js');
  ['settings.hk-switchServerMode', 'settings.hk-showQuest', 'settings.hk-multiboxback', 'settings.hk-showDevConsole', 'game1.ps.toPrivate']
    .forEach(k => check(k + ': no text', en.indexOf('"' + k + '"') < 0));
}

/* a key saved on a removed hotkey is free again, the other keys stay */
{
  const a = v4.indexOf('function lmRenameOldHotkeys(map) {'), b = v4.indexOf('\n}', a);
  const hk = { '-': 'hk-switchServerMode', 'ALT+Q': 'hk-showQuest', 'ALT+R': 'hk-dance', W: 'hk-feed' };
  const ctx = { hotkeys: hk };
  let err = null;
  try { vm.runInNewContext(v4.slice(a, b + 2) + '\nchanged = lmRenameOldHotkeys(hotkeys);', ctx); } catch (e) { err = e; }
  check('stored keys on the removed hotkeys dropped', !err && ctx.changed === true && !('-' in hk) && !('ALT+Q' in hk) && hk.W === 'hk-feed');
  /* Dance is back: a saved Alt+R on it stays */
  check('stored Alt+R on Dance kept', hk['ALT+R'] === 'hk-dance');
}

/* the public relay is the only one: connect() opens it, whatever an old page state says */
{
  const a = v4.indexOf('        connect() {\n'), b = v4.indexOf('\n        Socket3connect(srv) {', a);
  const opened = [];
  function WS(url) { this.url = url; this.readyState = 0; opened.push(url); }
  WS.CONNECTING = 0; WS.OPEN = 1;
  const app = vm.runInNewContext('({ publicIP: "wss://relay", privateIP: "wss://other", privateMode: true, socket: null, flushData() {}, flushPartyData() {}, setParty() {}, closeConnection() {},' +
    v4.slice(a, b) + '})', { WebSocket: WS, clearTimeout() {}, console });
  let err = null;
  try { app.connect(); } catch (e) { err = e; }
  check('connect opens the public relay', !err && opened.length === 1 && opened[0] === 'wss://relay' && typeof app.socket.onopen === 'function');
  check('no server switch method left', !/\n        switchServerMode\(\) \{/.test(v4));
}

/* the quest box (never filled) is gone from the page and the styles, the Battle Royale HUD next to it stays */
{
  check('no quest HUD element', v4.indexOf('quest-hud') < 0 && v4.indexOf('<div id="btl-hud" class="hud"></div>') > 0);
  check('no quest HUD styles', ['css/legend.css', 'css/ogario.v3.css'].every(f => read(f).indexOf('quest-hud') < 0));
  check('no quest show/hide methods', !/\n        set(Show)?Quest\(\) \{/.test(v4));
  /* nor the Settings > Extras row that moved agar.io's #showQuest box in under its label (skipStats stays) */
  check('no Show quest row in Extras', v4.indexOf('#showQuest') < 0 && v4.indexOf('$("#skipStats").appendTo($(".skipStats"));') > 0);
  check('settings.showQuest: no text', read('languages/lm-en.js').indexOf('"settings.showQuest"') < 0);
}

if (fail) { console.log(fail + ' check(s) failed'); process.exit(1); }
console.log('all removed hotkey checks passed');
