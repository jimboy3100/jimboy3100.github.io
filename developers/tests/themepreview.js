/* Theme Workshop preview against newer changes: ogario/modules/themeworkshop.js runs in a vm with
 * the real theme schema of ogario/ogario.v4.js, a stub DOM / jQuery / Settings, a fake clock and
 * fake timers. A change made during a preview (a manual theme edit that is saved, a settings
 * preset, import or restore through LMThemeWorkshop.settle) ends the preview first, so
 * its 15 s timer can never roll the newer change back, and the rollback never writes an older
 * stored theme over a newer one. The preview's own auto-save is still blocked.
 * node developers/tests/themepreview.js [themeworkshop.js] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const i18n = require('./lib/i18n-env');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8');
const mod = fs.readFileSync(process.argv[2] || path.join(root, 'ogario', 'modules', 'themeworkshop.js'), 'utf8');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function boot() {
  const m = new Map(), toasts = [];
  const clock = { now: 1e6, timers: [] };
  /* a chainable jQuery stand-in: every call gives the same empty selection */
  const el = () => ({ style: {}, appendChild() { }, addEventListener() { }, removeEventListener() { }, setAttribute() { } });
  const $ = new Proxy(function () { }, {
    get: (t, k) => (k === 'length' ? 0 : k === 'jquery' ? 'stub' : k === 'fn' ? {} : /^\d+$/.test(String(k)) ? el() : () => $),
    apply: () => $
  });
  const ctx = {
    console, JSON, Math, Object, Array, Number, String, isFinite,
    Date: Object.assign(function () { }, { now: () => clock.now }),
    setTimeout(f, ms) { clock.timers.push({ f, at: clock.now + (ms || 0) }); return clock.timers.length; },
    clearTimeout() { },
    setInterval(f, ms) { const t = { f, at: clock.now + ms, every: ms }; clock.timers.push(t); return t; },
    clearInterval(t) { if (t) t.dead = true; },
    localStorage: { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) },
    document: { createElement: el, getElementById: () => null, querySelector: () => null, head: el(), body: el(), documentElement: { clientWidth: 1200, clientHeight: 800 } },
    innerWidth: 1200, innerHeight: 800, addEventListener() { }, removeEventListener() { },
    jQuery: $, $: $,
    toastr: { info(m) { toasts.push(m); }, success(m) { toasts.push(m); }, warning(m) { toasts.push(m); }, error(m) { toasts.push(m); } },
    textLanguage: {}
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  i18n(ctx);
  vm.runInContext(cut('var themePresets = {', 'var defaultSettings = {'), ctx);
  vm.runInContext(cut('var defaultSettings = {', 'cimg2 = new Image;'), ctx);
  vm.runInContext(cut('var defaultmapsettings = {', '/* ─── §3.3 profiles'), ctx);
  ctx.legendmod5 = ctx.defaultmapsettings;
  ctx.Settings = { setTheme() { }, saveThemeSettings() { m.set('ogarioThemeSettings', JSON.stringify(ctx.defaultSettings)); } };
  ctx.application = { saveSettings(s, k) { m.set(k, JSON.stringify(s)); }, setMessageSound() { }, setCommandSound() { }, setvirusSound() { } };
  vm.runInContext(mod, ctx);
  /* runs the timers due up to `to` (intervals again and again) */
  const advance = (to) => {
    for (;;) {
      const due = clock.timers.filter(t => !t.dead && t.at <= to).sort((a, b) => a.at - b.at)[0];
      if (!due) break;
      clock.now = due.at;
      if (due.every) due.at += due.every; else due.dead = true;
      due.f();
    }
    clock.now = to;
  };
  return { ctx, m, clock, advance, toasts, TW: ctx.LMThemeWorkshop };
}

/* 1. the player edits the theme during a preview (the Theme tab saves it) */
{
  const b = boot(), d = b.ctx.defaultSettings;
  b.ctx.Settings.saveThemeSettings();
  const base = d.bgColor, baseMain = d.mainColor, stored = b.m.get('ogarioThemeSettings');
  check('preview starts', b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe') === true && d.bgColor === '#010203');
  b.ctx.Settings.saveThemeSettings();
  check('the preview\'s own auto-save is still not saved', b.m.get('ogarioThemeSettings') === stored && b.TW.previewing());
  b.advance(b.clock.now + 3000);
  d.mainColor = '#abcdef';
  b.ctx.Settings.saveThemeSettings();
  check('a newer change ends the preview first', !b.TW.previewing());
  const saved = JSON.parse(b.m.get('ogarioThemeSettings') || '{}');
  check('saved: the newer change, the preview colour gone', saved.mainColor === '#abcdef' && saved.bgColor === base);
  b.advance(b.clock.now + 20000);
  check('the 15 s timer does not roll the newer change back', d.mainColor === '#abcdef' && d.bgColor === base && JSON.parse(b.m.get('ogarioThemeSettings')).mainColor === '#abcdef');
  check('(baseline differs from the edit)', baseMain !== '#abcdef');
}

/* 2. a newer stored revision written during the preview is never overwritten by the rollback */
{
  const b = boot();
  b.ctx.Settings.saveThemeSettings();
  b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
  b.m.set('ogarioThemeSettings', '{"newer":1}');
  b.advance(b.clock.now + 16000);
  check('timeout: preview ended', !b.TW.previewing());
  check('timeout: the newer stored theme stays', b.m.get('ogarioThemeSettings') === '{"newer":1}');
}

/* 3. settle: a preset / import / restore ends the preview before they change anything */
{
  const b = boot(), d = b.ctx.defaultSettings, base = d.bgColor;
  check('settle exists', typeof b.TW.settle === 'function');
  if (typeof b.TW.settle === 'function') {
    check('settle without a preview does nothing', b.TW.settle() === false);
    b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
    check('settle ends a preview, theme back', b.TW.settle() === true && !b.TW.previewing() && d.bgColor === base);
    /* what a preset does next: set its values and save */
    d.bgColor = '#0a0b0c';
    b.ctx.Settings.saveThemeSettings();
    b.advance(b.clock.now + 20000);
    check('settle: the newer theme is never rolled back later', d.bgColor === '#0a0b0c' && JSON.parse(b.m.get('ogarioThemeSettings')).bgColor === '#0a0b0c');
  }
}

/* 4. sounds: a sound changed during the preview stays */
{
  const b = boot(), s = b.ctx.defaultmapsettings, before = s.messageSound;
  b.TW.preview({ theme: { bgColor: '#010203' }, sounds: { messageSound: 'https://www.legendmod.ml/sounds/a.mp3', commandSound: 'https://www.legendmod.ml/sounds/b.mp3' } }, 'probe');
  s.commandSound = 'https://www.legendmod.ml/sounds/mine.mp3';
  b.advance(b.clock.now + 16000);
  check('sounds: the preview sound goes back', s.messageSound === before);
  check('sounds: a sound changed during the preview stays', s.commandSound === 'https://www.legendmod.ml/sounds/mine.mp3');
}

/* 5. Keep, then the timer: nothing rolled back */
{
  const b = boot(), d = b.ctx.defaultSettings;
  b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
  b.TW.keep();
  b.advance(b.clock.now + 20000);
  check('Keep: the message from the packs', b.toasts.some(t => t.includes(i18n.t('modules.themeworkshop.kept', 'probe'))));
  b.ctx.LMi18n.setLang('el');
  b.TW.preview({ theme: { bgColor: '#020304' } }, 'probe2');
  b.TW.keep();
  check('Keep after switching to Greek: the message is Greek', b.toasts.some(t => t.includes(i18n.t('modules.themeworkshop.kept', 'probe2', 'el'))));
  b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
  b.TW.keep();
  b.advance(b.clock.now + 20000);
  check('Keep: kept and saved, the timer does nothing', d.bgColor === '#010203' && JSON.parse(b.m.get('ogarioThemeSettings')).bgColor === '#010203');
}

/* 6. callers: the import, the restores and the settings presets end a preview first */
{
  const core = main.replace(/\r\n/g, '\n');
  ['        importSettings() {', '        restoreSettings() {', '        restoreThemeSettings() {', "row.on('click', '.lm-preset-btn'", "undoBtn.on('click'"].forEach(a => {
    const x = core.indexOf(a), y = core.indexOf('LMThemeWorkshop.settle()', x);
    check('core settles a preview in ' + a.trim().slice(0, 32), x >= 0 && y > x && y - x < 8000);
  });
}

/* 7. the Theme tab auto-save (its real handler from ogario.v4.js; the colour pickers the preview
 * sets fire it, here from Settings.setTheme): a preview and its Revert never write the stored
 * theme, a player's change just before the preview is still saved, later input saves again */
{
  const b = boot(), d = b.ctx.defaultSettings, St = b.ctx.Settings;
  const core = main.replace(/\r\n/g, '\n');
  const i = core.indexOf('            var _lmThemeSaveT = null;'), j = core.indexOf("$('#theme').append('<div class=\\\"restore-settings", i);
  check('Theme tab auto-save found in ogario.v4.js', i > 0 && j > i);
  let input = null;
  const st = (f, ms) => { const t = { f, at: b.clock.now + ms }; b.clock.timers.push(t); return t; };
  const ct = t => { if (t && typeof t === 'object') t.dead = true; };
  vm.runInContext('(function ($, document, Settings, setTimeout, clearTimeout) {\n' + core.slice(i, j) + '\n})', b.ctx)(
    () => ({ on(ev, sel, f) { if (/changeColor/.test(ev)) input = f; } }), {}, St, st, ct);
  check('handler and flush installed', typeof input === 'function' && typeof St.lmFlushThemeSave === 'function');
  const quietSeen = [];
  St.setTheme = function () { quietSeen.push(!!St._lmThemeQuiet); input(); };
  /* a player who never saved a theme (nothing stored) */
  b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
  b.advance(b.clock.now + 1000);
  check('preview: nothing stored', b.m.get('ogarioThemeSettings') === undefined && b.TW.previewing());
  b.TW.revert();
  b.advance(b.clock.now + 1000);
  check('Revert: still nothing stored (no auto-save of the reverted theme)', b.m.get('ogarioThemeSettings') === undefined && !b.TW.previewing());
  check('the preview and Revert set the controls quietly, the flag is cleared after', quietSeen.length === 2 && quietSeen.every(Boolean) && !St._lmThemeQuiet);
  /* the player changes a colour, then previews within 600 ms */
  d.mainColor = '#abcdef';
  input();
  b.advance(b.clock.now + 200);
  b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
  check('a pending player change is saved before the preview', JSON.parse(b.m.get('ogarioThemeSettings') || '{}').mainColor === '#abcdef');
  b.TW.revert();
  b.advance(b.clock.now + 1000);
  const kept = JSON.parse(b.m.get('ogarioThemeSettings'));
  check('after Revert the player change is what is stored and shown', kept.mainColor === '#abcdef' && d.mainColor === '#abcdef' && kept.bgColor !== '#010203');
  d.mainColor = '#123123';
  input();
  b.advance(b.clock.now + 700);
  check('player input after a preview saves again', JSON.parse(b.m.get('ogarioThemeSettings')).mainColor === '#123123');
}

/* 8. a short preview on a slow device: applying the theme takes longer than the preview time;
 * it is still shown for that time from when it is applied */
{
  const b = boot(), d = b.ctx.defaultSettings, base = d.bgColor;
  b.ctx.Settings.setTheme = function () { b.clock.now += 1000; };
  check('slow apply: preview applied', b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe', 400) === true && d.bgColor === '#010203');
  check('slow apply: still previewing right after', b.TW.previewing());
  b.ctx.Settings.setTheme = function () { };
  b.advance(b.clock.now + 300);
  check('slow apply: still previewing 300 ms later', b.TW.previewing() && d.bgColor === '#010203');
  b.advance(b.clock.now + 400);
  check('slow apply: reverted by itself after its time', !b.TW.previewing() && d.bgColor === base);
}

/* 5. a preview started without the window (a script, Discover): its bar's resize listener goes with it */
{
  const b = boot(), on = new Set();
  b.ctx.addEventListener = (t, f) => { if (t === 'resize') on.add(f); };
  b.ctx.removeEventListener = (t, f) => { if (t === 'resize') on.delete(f); };
  b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
  const during = on.size;
  b.advance(b.clock.now + 16000);
  check('preview without the window: resize listened to while the bar shows, removed when it ends', during === 1 && !b.TW.previewing() && on.size === 0);
  b.TW.preview({ theme: { bgColor: '#010203' } }, 'probe');
  b.TW.settle();
  check('ended by settle: no resize listener left', on.size === 0);
}

console.log(fail ? fail + ' failed' : 'all theme preview checks passed');
process.exit(fail ? 1 : 0);
