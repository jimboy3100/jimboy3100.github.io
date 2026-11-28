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

/* The hotkeys while the main player (P1) is dead or spectating (decision 8): the real key and mouse
 * button handlers (document.onkeydown / onkeyup, window.onmousedown / onmouseup) and the real hotkey
 * commands of ogario/hotkeysCommand.js, on the actions of developers/tests/lib/mbaction.js. A living
 * multibox unit you selected gets from each key or button exactly what P1 gets while it plays; a
 * selected unit that is dead or on a closed socket gets nothing (nor does P1). With P1 spectating, a
 * left click on the game is the unit's (its bound command), not a spectate follow pick. */
{
  const { world } = require('./lib/mbaction.js');
  const W = world({ v4 });
  const kA = v4.indexOf('    var _lmHeldByCode = {};'), kB = v4.indexOf('    /* A window that keeps keyup events', kA);
  const mA = v4.indexOf('    var _lmMouseHeld = {};'), mB = v4.indexOf('    window.onbeforeunload', mA);
  if (W.missing || kA < 0 || kB < 0 || mA < 0 || mB < 0) check('key / mouse handler code found', false);
  else {
    const c = W.ctx;
    vm.runInContext(hkSrc, c);
    Object.assign(c, {
      hotkeysSetup: { inputClassName: 'custom-key-in', getPressedKey: (e) => e.key, mouseKey: (w) => ({ 1: 'MOUSE LEFT', 3: 'MOUSE RIGHT' })[w] || '' },
      drawRender: {}, document: { addEventListener() { } }, addEventListener() { }
    });
    vm.runInContext(v4.slice(kA, kB) + '\n' + v4.slice(mA, mB), c);
    const keys = { split: 'hk-split', doubleSplit: 'hk-doubleSplit', tripleSplit: 'hk-tripleSplit', split16: 'hk-split16', popSplit: 'hk-popSplit',
      crazyDoubleSplit: 'hk-crazyDoubleSplit', feed: 'hk-feed', macroFeed: 'hk-macroFeed', macroFeedPerm: 'hk-macroFeedPerm', lineSplit: 'hk-lineSplit' };
    const canvas = { tagName: 'CANVAS', className: '', closest: () => null };
    const key = (k, up) => c.document[up ? 'onkeyup' : 'onkeydown']({ key: k, keyCode: 75, target: canvas, preventDefault() { } });
    const btn = (w, up) => c[up ? 'onmouseup' : 'onmousedown']({ which: w, button: w - 1, target: canvas, preventDefault() { } });
    /* one press of the input bound to cmd: held commands 100 ms, the toggle pressed again after 100 ms */
    const press = (how, cmd) => {
      c.keyBlind = {}; c.hotkeys = how === 'key' ? { K: cmd } : { 'MOUSE RIGHT': cmd };
      const down = () => (how === 'key' ? key('K') : btn(3)), up = () => (how === 'key' ? key('K', true) : btn(3, true));
      down(); if (cmd === 'hk-macroFeed') W.advance(100); up();
      if (cmd === 'hk-macroFeedPerm') { W.advance(100); down(); up(); }
      W.advance(2000);
    };
    for (const how of ['key', 'mouse']) {
      for (const a of Object.keys(keys)) {
        W.state({ main: 'alive', focus: 0 }); press(how, keys[a]); const ref = W.kinds('main');
        const got = ['dead', 'spectating'].map((m) => { W.state({ main: m, focus: 2 }); press(how, keys[a]); return W.kinds('u2') === ref && W.count('main') === 0; });
        const none = ['dead', 'stale'].map((u) => { W.state({ main: 'dead', unit: u, focus: 2 }); press(how, keys[a]); return W.log.length === 0; });
        check((how === 'key' ? 'key' : 'mouse button') + ' ' + keys[a] + ', P1 dead / spectating, living P2 selected: P2 gets what P1 gets; P2 dead / closed socket: nothing',
          ref.length > 0 && got.every(Boolean) && none.every(Boolean));
      }
    }
    /* the left button while P1 spectates */
    let picks = 0;
    W.state({ main: 'spectating', focus: 2 }); W.lm()._lmSpecCellPick = () => { picks++; };
    c.keyBlind = {}; c.hotkeys = { 'MOUSE LEFT': 'hk-split' }; btn(1); btn(1, true); W.advance(500);
    check('P1 spectating, living P2 selected: a left click splits P2 once and is no spectate follow pick', W.kinds('u2') === 'split' && W.count('main') === 0 && picks === 0);
    picks = 0; W.state({ main: 'spectating', focus: 0 }); W.lm()._lmSpecCellPick = () => { picks++; };
    c.keyBlind = {}; c.hotkeys = { 'MOUSE LEFT': 'hk-split' }; btn(1); btn(1, true); W.advance(500);
    check('P1 spectating, no unit selected: the left click still picks the player to follow (nothing sent)', picks === 1 && W.log.length === 0);
    W.state({ main: 'dead', focus: 2 }); c._menu = true;
    c.keyBlind = {}; c.hotkeys = { 'MOUSE RIGHT': 'hk-split' }; btn(3); btn(3, true); W.advance(500);
    check('the menu open: a mouse button does nothing (also for a living P2)', W.log.length === 0);
  }
}

if (fail) { console.log(fail + ' check(s) failed'); process.exit(1); }
console.log('all removed hotkey checks passed');
