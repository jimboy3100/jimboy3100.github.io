/* Library guard checks: the guard at the top of ogario/ogario.v4.js runs with jQuery but without
 * perfect-scrollbar, Switchery and toastr (as when Chrome refuses document.write scripts on a slow
 * connection). Calls must not throw, the real files must be requested with a normal script tag, and
 * the remembered calls must be replayed once they arrive. node developers/tests/libguard.js */
const fs = require('fs'), path = require('path'), vm = require('vm');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'ogario', 'ogario.v4.js'), 'utf8');
const start = src.indexOf('/* Library guard.');
const end = src.indexOf('/* Suppress noisy ad-SDK console spam');
if (start < 0 || end < 0) { console.log('guard not found'); process.exit(1); }
const guard = src.slice(start, end);

let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

function make(present) {
  const appended = [];
  const fn = {};
  if (present.perfectScrollbar) fn.perfectScrollbar = function () { return this; };
  ['colorpicker', 'rangeslider', 'tooltip', 'popover', 'modal'].forEach(n => { fn[n] = function () { return this; }; });
  const jq = function () { return { length: 0 }; };
  jq.fn = fn;
  const win = { jQuery: jq, OgVer: 3.6, console: { warn() { }, log() { } } };
  if (present.toastr) win.toastr = { info() { }, success() { }, warning() { }, error() { } };
  if (present.Switchery) win.Switchery = function () { };
  const doc = { head: { appendChild(s) { appended.push(s); } }, createElement: () => ({}) };
  const ctx = { window: win, document: doc, console: win.console, Object, Array };
  vm.createContext(ctx);
  vm.runInContext(guard, ctx);
  return { win, jq, appended };
}

/* everything present: nothing is replaced or loaded */
{
  const t = make({ perfectScrollbar: true, toastr: true, Switchery: true });
  check('all libraries present: nothing loaded', t.appended.length === 0 && !t.jq.fn.perfectScrollbar._lmStandIn);
}

/* perfect-scrollbar, toastr and Switchery missing */
{
  const t = make({});
  const el = { id: 'chat-box' };
  let threw = false;
  try {
    t.jq.fn.perfectScrollbar.call(el, { suppressScrollX: true });
    t.jq.fn.perfectScrollbar.call(el, 'update');
    t.win.toastr.info('hello');
    new t.win.Switchery({ id: 'cb' }, { size: 'small' });
  } catch (e) { threw = true; }
  check('missing plugins: calls do not throw', !threw);
  const files = t.appended.map(s => s.src);
  check('real files requested', files.some(f => /perfect-scrollbar\.jquery\.min\.js\?v=3\.6$/.test(f)) && files.some(f => /toastr\.min\.js/.test(f)) && files.some(f => /switchery\.min\.js/.test(f)));
  check('loaded with a normal non-blocking tag, utf-8', t.appended.filter(s => s.src).every(s => s.charset === 'utf-8' && s.async === false));
  /* the real perfect-scrollbar arrives */
  const seen = [];
  t.jq.fn.perfectScrollbar = function (a) { seen.push([this.id, a]); return this; };
  t.appended.find(s => /perfect-scrollbar/.test(s.src)).onload({ type: 'load' });
  check('remembered perfectScrollbar calls replayed in order', seen.length === 2 && seen[0][0] === 'chat-box' && seen[0][1].suppressScrollX === true && seen[1][1] === 'update');
  /* the real toastr arrives */
  const shown = [];
  t.win.toastr = { info(m) { shown.push(m); }, success() { }, warning() { }, error() { }, options: {} };
  t.appended.find(s => /toastr/.test(s.src)).onload({ type: 'load' });
  check('queued toasts shown when toastr arrives', shown.length === 1 && shown[0] === 'hello');
  /* a failed reload leaves the stand-in working */
  t.appended.find(s => /switchery/.test(s.src)).onload({ type: 'error' });
  let threw2 = false;
  try { new t.win.Switchery({ id: 'cb2' }); } catch (e) { threw2 = true; }
  check('failed reload: stand-in keeps working', !threw2);
}

/* perfect-scrollbar missing: the boxes scroll natively until it arrives (classes on the jQuery
 * object, one style element), and lose the native scrollbar when the real plugin runs */
{
  const t = make({ toastr: true, Switchery: true });
  const box = () => { const c = new Set(); return { c, toggleClass(n, on) { if (on) c.add(n); else c.delete(n); return this; }, addClass(n) { n.split(' ').forEach(x => c.add(x)); return this; }, removeClass(n) { n.split(' ').forEach(x => c.delete(x)); return this; } }; };
  const css = t.appended.find(s => s.id === 'lm-ps-native-css');
  check('missing perfect-scrollbar: native scroll rule added once', !!css && /.lm-ps-native{overflow:auto/.test(css.textContent) && /.lm-ps-native-y{overflow-x:hidden}/.test(css.textContent) && t.appended.filter(s => s.id === 'lm-ps-native-css').length === 1);
  const a = box(), b = box();
  t.jq.fn.perfectScrollbar.call(a, { suppressScrollX: true });
  t.jq.fn.perfectScrollbar.call(b);
  t.jq.fn.perfectScrollbar.call(b, 'update');
  check('stand-in: boxes scroll natively (no horizontal scroll with suppressScrollX)', a.c.has('lm-ps-native') && a.c.has('lm-ps-native-y') && b.c.has('lm-ps-native') && !b.c.has('lm-ps-native-y'));
  const d = box();
  t.jq.fn.perfectScrollbar.call(d);
  t.jq.fn.perfectScrollbar.call(d, 'destroy');
  check('stand-in: destroy ends the native scrolling', !d.c.has('lm-ps-native'));
  let order = [];
  t.jq.fn.perfectScrollbar = function () { order.push(this.c.has('lm-ps-native')); return this; };
  t.appended.find(s => /perfect-scrollbar/.test(s.src || '')).onload({ type: 'load' });
  check('real plugin: the native scrollbar goes before the plugin runs (no second scrollbar)', !a.c.has('lm-ps-native') && !a.c.has('lm-ps-native-y') && !b.c.has('lm-ps-native') && order.length === 5 && order.every(x => x === false));
}
{
  const t = make({ toastr: true, Switchery: true });
  const c = new Set(), el = { toggleClass(n, on) { if (on) c.add(n); else c.delete(n); return this; }, addClass(n) { c.add(n); return this; }, removeClass(n) { n.split(' ').forEach(x => c.delete(x)); return this; } };
  t.jq.fn.perfectScrollbar.call(el, { suppressScrollX: true });
  t.appended.find(s => /perfect-scrollbar/.test(s.src || '')).onload({ type: 'error' });
  check('perfect-scrollbar never loads: the box keeps scrolling natively', c.has('lm-ps-native') && c.has('lm-ps-native-y'));
}

console.log(fail ? fail + ' FAILED' : 'all library guard checks passed');
process.exit(fail ? 1 : 0);
