/* Shared libraries on the Legend pages, in a real browser (smoke.js: every legendmod.ml /
 * jimboy3100.github.io file comes from this checkout). Every page that loads jQuery loads the same
 * copy (lib/jquery-3.7.1.min.js), the Bootstrap pages the same Bootstrap (lib/bootstrap-3.4.1.min.js),
 * and what the pages do with them still works: the skins gallery's lazy loading (a tab switch loads
 * the pictures that come into view, a click puts the skin's address in the box), the themes page's
 * preview window (opens and closes), its animations (loader fade, easing, go-to-top scroll, scroll
 * waypoints), and on LMexpress.html (the old game page) dragging a window (jQuery UI Draggable),
 * tooltips, popovers and modal windows. No page may ask for a file of this site that is not there
 * (a removed library copy still referenced) and no page may throw.
 * With JQMIGRATE=<path to jquery-migrate 3.x> (smoke.js adds it after jQuery) a migrate warning about
 * something jQuery 3.7.1 no longer does fails the page; the "is deprecated" ones (calls 3.7.1 still
 * supports, such as .click(fn) or .bind()) are only listed.
 * node developers/tests/sitelibs.js [name ...]   (needs Chrome, like smoke.js; prints SKIP without it) */
const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');
const here = __dirname, repo = path.resolve(here, '..', '..'), outRoot = path.join(here, 'out');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (!ok && info !== undefined ? '  ' + JSON.stringify(info).slice(0, 700) : '')); if (!ok) failed++; };

const PROBE = `(async () => {
var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
for (var i = 0; i < 150 && (document.readyState !== 'complete' || !window.jQuery); i++) await sleep(100);
await sleep(800);
var $ = window.jQuery, p = location.pathname, r = { jq: $ && $.fn ? $.fn.jquery : null, path: p };
if (!$) return r;
var vis = function (el) { return !!el && el.offsetWidth > 0 && el.offsetHeight > 0 && getComputedStyle(el).visibility !== 'hidden'; };
r.lazyload = typeof $.fn.lazyload;
r.bootstrap = $.fn.modal && $.fn.modal.Constructor ? $.fn.modal.Constructor.VERSION : null;
r.ui = $.ui ? $.ui.version : null;
/* Bootstrap: a modal window opens and closes, a tooltip and a popover show (pages that load it) */
if ($.fn.modal) {
    var m = $('<div class="modal fade" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-body">x</div></div></div></div>').appendTo(document.body);
    m.modal('show'); await sleep(700);
    r.bsModalOpen = vis(m[0]) && m.hasClass('in');
    m.modal('hide'); await sleep(700);
    r.bsModalClosed = !vis(m[0]); m.remove();
    var a = $('<a href="#" title="Tip" style="position:fixed;left:200px;top:200px">t</a>').appendTo(document.body);
    if ($.fn.tooltip) { a.tooltip({ container: 'body', animation: false }).tooltip('show'); r.bsTooltip = $('.tooltip').length > 0 && /Tip/.test($('.tooltip').text()); a.tooltip('destroy'); }
    if ($.fn.popover) { a.popover({ container: 'body', content: 'Pop', animation: false }).popover('show'); r.bsPopover = /Pop/.test($('.popover').text()); a.popover('destroy'); }
    a.remove();
}
if (/\\/skins\\/(index\\.html)?$/.test(p)) {
    /* the gallery: switching to a tab lazy-loads the pictures in view (local files) */
    var tab = document.querySelector('#nav a[href="#lowres"]');
    tab.click(); await sleep(2500);
    var imgs = [].slice.call(document.querySelectorAll('#lowres img.lazy'));
    r.lowresShown = vis(document.getElementById('lowres')) && !vis(document.getElementById('imgur'));
    r.lowresTotal = imgs.length;
    r.lowresLoaded = imgs.filter(function (i) { return i.loaded && i.getAttribute('src') === i.getAttribute('data-original'); }).length;
    r.lowresVisibleUnloaded = imgs.filter(function (i) { var b = i.getBoundingClientRect(); return b.bottom > 0 && b.top < innerHeight && !i.loaded; }).length;
    var first = imgs.filter(function (i) { return i.loaded; })[0];
    if (first) { first.click(); r.copied = document.getElementById('skin-url').value === first.getAttribute('src'); }
}
if (/\\/themes\\//.test(p)) {
    r.plugins = { mfp: typeof $.fn.magnificPopup, countTo: typeof $.fn.countTo, waypoint: typeof window.Waypoint, easing: typeof ($.easing && $.easing.easeInOutExpo) };
    var pm = document.getElementById('myModal2');
    document.getElementById('link1').click(); await sleep(900);
    r.previewOpen = vis(pm) && $(pm).hasClass('in');
    $(pm).find('[data-dismiss="modal"]')[0].click(); await sleep(900);
    r.previewClosed = !vis(pm);
    var ld = document.querySelector('.fh5co-loader');
    r.loaderGone = !ld || !vis(ld);
    var d = $('<div style="width:10px;height:10px"></div>').appendTo(document.body), done = false;
    d.animate({ width: 50 }, 150, 'easeOutExpo', function () { done = true; });
    await sleep(600); r.eased = done && d[0].style.width === '50px'; d.remove();
    /* a long page (the headless window shows it all): scroll down, the go-to-top button shows, then the
     * same eased scroll back as its click handler does */
    var sp = $('<div style="height:3000px"></div>').appendTo(document.body);
    window.scrollTo(0, 1500); $(window).trigger('scroll'); await sleep(800);
    r.waypoints = $('.animate-box.animated-fast').length > 0;
    r.topShown = $('.js-top').hasClass('active');
    $('html, body').animate({ scrollTop: 0 }, 500, 'easeInOutExpo'); await sleep(1100);
    r.backToTop = (window.scrollY || document.documentElement.scrollTop) < 5; sp.remove();
}
if ($.fn.draggable) {
    /* jQuery UI Draggable: drag a window by its header */
    var w = $('<div style="position:fixed;left:100px;top:100px;width:200px;height:120px;background:#333;z-index:99999"><div class="modal-header" style="height:30px">drag</div></div>').appendTo(document.body);
    w.draggable({ handle: '.modal-header' });
    var h = w.find('.modal-header')[0], b0 = w[0].getBoundingClientRect();
    var fire = function (t, el, x, y) { el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, button: 0, buttons: t === 'mouseup' ? 0 : 1 })); };
    fire('mousedown', h, 150, 110); await sleep(20); fire('mousemove', document, 170, 130); await sleep(20);
    fire('mousemove', document, 210, 160); await sleep(20); fire('mouseup', document, 210, 160);
    await sleep(100);
    var b1 = w[0].getBoundingClientRect();
    r.dragged = Math.round(b1.left - b0.left) === 60 && Math.round(b1.top - b0.top) === 50;
    w.remove();
}
return r;
})()`;

function run(name, url, secs) {
    const out = path.join(outRoot, 'sitelibs-' + name);
    fs.rmSync(out, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(path.join(out, 'probe.js'), PROBE);
    const r = spawnSync(process.execPath, [path.join(here, 'smoke.js'), repo, out, String(secs), url], { encoding: 'utf8', timeout: 180000 });
    const text = (r.stdout || '') + (r.stderr || '');
    if (/chrome not found/.test(text)) { console.log('SKIP: ' + text.trim()); process.exit(0); }
    let res = null;
    try { res = JSON.parse(fs.readFileSync(path.join(out, 'result.json'), 'utf8')); } catch (e) { }
    try { fs.rmSync(path.join(out, 'profile'), { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
    if (!res || !res.probe) { check(name + ': the page ran and the probe answered', false, text.slice(-800)); return null; }
    return res;
}

const L = 'https://www.legendmod.ml/';
/* name, page, seconds before the probe, Bootstrap page, jQuery UI page */
const PAGES = [['home', 'index.html', 4], ['skins', 'skins/index.html', 4], ['clan', 'Lc/Lc.html', 4],
    ['projectx', 'Lc/PROJETOX.HTML/original/lc.html', 4], ['themes', 'themes/index.html', 4, true],
    ['lmexpress', 'LMexpress/LMexpress.html', 14, true, true]];
const pick = process.argv.slice(2);
for (const [name, rel, secs, bs, ui] of PAGES) {
    if (pick.length && pick.indexOf(name) < 0) continue;
    if (!fs.existsSync(path.join(repo, rel))) { console.log('skip ' + name + ': ' + rel + ' is not in this checkout'); continue; }
    const res = run(name, L + rel, secs);
    if (!res) continue;
    const p = res.probe;
    check(name + ': jQuery is the shared lib/jquery-3.7.1.min.js', p.jq === '3.7.1', p.jq);
    check(name + ': every file of this site the page asks for is there', !res.missing.length, res.missing);
    const soft = e => /^MIGRATE JQMIGRATE: /.test(e) && /is deprecated|should use only one argument/.test(e) && !/removed/.test(e);
    const hard = res.errors.filter(e => !soft(e)), info = res.errors.filter(soft);
    if (info.length) console.log('     ' + name + ': still supported, deprecated in jQuery 3: ' + [...new Set(info.map(e => e.replace(/^MIGRATE JQMIGRATE: /, '').replace(/ @.*/, '')))].join('; '));
    check(name + ': no exception, console error or migrate warning about a removed behaviour', !hard.length, hard);
    if (name === 'home' || name === 'skins' || name === 'clan' || name === 'projectx') check(name + ': the lazy loading plugin is there', p.lazyload === 'function', p);
    if (bs) {
        check(name + ': Bootstrap is the shared lib/bootstrap-3.4.1.min.js', p.bootstrap === '3.4.1', p.bootstrap);
        check(name + ': a Bootstrap modal window opens and closes', p.bsModalOpen === true && p.bsModalClosed === true, p);
        check(name + ': Bootstrap tooltips and popovers show', p.bsTooltip === true && p.bsPopover === true, p);
    }
    if (name === 'skins') {
        check('skins: a tab switch shows that tab', p.lowresShown === true, p);
        check('skins: the pictures that come into view are lazy-loaded (' + p.lowresLoaded + ' of ' + p.lowresTotal + ')', p.lowresLoaded >= 5 && p.lowresVisibleUnloaded === 0 && p.lowresLoaded < p.lowresTotal, p);
        check('skins: a click on a picture puts its address in the box', p.copied === true, p);
    }
    if (name === 'themes') {
        check('themes: the page plugins are there (popup, counter, waypoints, easing)', p.plugins && p.plugins.mfp === 'function' && p.plugins.countTo === 'function' && p.plugins.waypoint === 'function' && p.plugins.easing === 'function', p.plugins);
        check('themes: the theme preview window opens and closes', p.previewOpen === true && p.previewClosed === true, p);
        check('themes: the animations run (loader fade, easing, scroll waypoints, go to top)', p.loaderGone === true && p.eased === true && p.waypoints === true && p.topShown === true && p.backToTop === true, p);
    }
    if (ui) {
        check(name + ': jQuery UI is the shared Draggable build 1.13.3', p.ui === '1.13.3', p.ui);
        check(name + ': a window can be dragged by its header', p.dragged === true, p);
    }
}
console.log(failed ? 'RESULT: FAIL (' + failed + ')' : 'RESULT: PASS');
process.exit(failed ? 1 : 0);
