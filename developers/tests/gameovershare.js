/* Game Over card Share / Download match card / invite link and the ?ref= pages, with the real code:
 * the match card drawing (_lmRenderMatchCard, 1200x630 PNG with the game's numbers), the card's
 * buttons and invite line in the card HTML, the invite link built from the nick, and the ?ref=
 * scripts of index.html and play.html (only a valid name is stored).
 * node developers/tests/gameovershare.js */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..', '..');
const main = fs.readFileSync(path.join(root, 'ogario', 'ogario.v4.js'), 'utf8').replace(/\r\n/g, '\n');
const cut = (a, b) => { const i = main.indexOf(a), j = main.indexOf(b, i); if (i < 0 || j < 0) throw new Error('not found in ogario.v4.js: ' + a); return main.slice(i, j); };
let fail = 0;
const check = (n, c) => { console.log((c ? 'ok   ' : 'FAIL ') + n); if (!c) fail++; };

/* 1. the match card: drawn on a 1200x630 canvas with the game's numbers, handed over as a PNG */
{
  const texts = [];
  const grad = { addColorStop() { } };
  const ctx2d = new Proxy({ fillText(t) { texts.push(String(t)); }, createLinearGradient() { return grad; } }, {
    get(t, k) { return k in t ? t[k] : function () { }; }, set(t, k, v) { t[k] = v; return true; }
  });
  let canvas = null, type = '';
  const doc = { createElement() { canvas = { getContext: () => ctx2d, toBlob(cb, ty) { type = ty; cb({ size: 1 }); } }; return canvas; } };
  const lmT = k => k;
  const ctx = vm.createContext({ document: doc, window: { lmT }, lmT, Math, String, mc: '#01d9cc',
    u: { highestMass: 1234, topPosition: 2, timeTotal: 65, playersEaten: 7, foodEaten: 50, massConsumed: 900, virusesEaten: 1 },
    fmtMass: m => 'M' + m, fmtTime: s => 'T' + s });
  vm.runInContext(cut('            function _lmRenderMatchCard(callback) {', '            /* Download card button'), ctx);
  let got = null;
  ctx.cb = (b, c) => { got = [b, c]; };
  vm.runInContext('_lmRenderMatchCard(cb)', ctx);
  check('match card: 1200 x 630, a PNG blob to the callback', got && got[0] && got[0].size === 1 && canvas.width === 1200 && canvas.height === 630 && type === 'image/png');
  check('match card: highest mass, best rank, survival time and eliminations drawn', ['M1234', '#2', 'T65', '7'].every(v => texts.includes(v)) || (console.log('   ' + texts.join(' | ')), false));
  check('match card: the site address at the bottom', texts.includes('www.legendmod.ml'));
}

/* 2. the card HTML: Share and Download buttons in the header, the invite line, and their wiring */
{
  const card = cut("'<div id=\"lm-go-share\"", "/* Dismiss helper */");
  check('card: Share (lm-go-share) and Download match card (lm-go-dlcard) buttons with their tooltips', /id="lm-go-share" data-i18n-title="shareStats"/.test(card) && /id="lm-go-dlcard" data-i18n-title="game2.downloadCard"/.test(card));
  check('card: the invite link line (lm-go-reflink, lm-go-refurl) with its Copy label', /id="lm-go-reflink"/.test(card) && /id="lm-go-refurl"/.test(card) && /data-i18n="game2.copy"/.test(card));
  const wire = cut("            var shareBtn = document.getElementById('lm-go-share');", '            /* Auto-dismiss after 12 seconds.');
  check('card: Share, Download and invite handlers present', /shareBtn\.addEventListener\('click'/.test(wire) && /dlCardBtn\.addEventListener\('click'/.test(wire) && /refLinkEl\.addEventListener\('click'/.test(wire));
}

/* 3. the invite link: https://www.legendmod.ml/?ref=<nick>, the nick cleaned to letters, digits, _ and - */
{
  const src = cut('            /* Referral / invite link: populate and wire up */', '                refLinkEl.addEventListener(');
  const els = { 'lm-go-reflink': {}, 'lm-go-refurl': { value: '' } };
  const run = nick => {
    const c = vm.createContext({ document: { getElementById: id => els[id] }, $: () => ({ val: () => nick }), String, Math });
    vm.runInContext(src + '}', c); /* the cut ends inside "if (refLinkEl && refUrlEl) {" */
    return els['lm-go-refurl'].value;
  };
  check('invite link from the nick', run(' Ab<c>_d-1 ') === 'https://www.legendmod.ml/?ref=Abc_d-1');
  check('invite link without a nick: a generated player name', /^https:\/\/www\.legendmod\.ml\/\?ref=player\d{5}$/.test(run('')));
}

/* 4. the ?ref= scripts of the home and play pages: a valid name is stored with its time, anything else is not */
['index.html', 'play.html'].forEach(f => {
  const html = fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
  const i = html.indexOf('<!-- ═══ Referral System ═══ -->');
  check(f + ': the referral script is there', i >= 0);
  if (i < 0) return;
  const js = html.slice(html.indexOf('<script>', i) + 8, html.indexOf('</script>', i));
  const run = search => {
    const store = {}, body = [];
    const c = vm.createContext({ window: { location: { search } }, URLSearchParams, Date, setTimeout() { },
      localStorage: { setItem(k, v) { store[k] = String(v); } }, lmT: (k, o) => k + (o ? ':' + o.name : ''),
      document: { createElement: () => ({ style: {}, remove() { } }), body: { appendChild(e) { body.push(e); } }, getElementById: () => null, head: { appendChild() { } } } });
    vm.runInContext(js, c);
    return { store, body };
  };
  const ok = run('?ref=Bob_1');
  check(f + ': ?ref=Bob_1 stores the inviter and the time', ok.store.lm_referrer === 'Bob_1' && /^\d+$/.test(ok.store.lm_ref_time));
  check(f + ': an invalid or missing ref stores nothing', Object.keys(run('?ref=<x>').store).length === 0 && Object.keys(run('').store).length === 0);
  if (f === 'index.html') check('index.html: the "Invited by" banner is shown', ok.body.length === 1 && /site\.index\.invitedBy:<strong>Bob_1<\/strong>/.test(ok.body[0].innerHTML));
});
check('the stored inviter is no longer deleted at start', main.indexOf("['lm_referrer', 'lm_ref_time'].forEach(function (k) { localStorage.removeItem(k); })") < 0);

/* one stats screen after a death: agar.io's own stats panel (same game stats) only with the card off
 * and its "Skip stats after death" box off; both callers (showMenu, the Expanding Land death) use it */
{
  const src = cut('        agarStatsAfterDeath() {', '        toggleAutoResp() {');
  const want = (skip, card) => vm.runInNewContext('var o = {' + src + '}; o.skipStats = ' + skip + '; o.agarStatsAfterDeath();', { defaultmapsettings: { gameOverStats: card } });
  check('agar.io stats panel: shown only with the card off and Skip stats off', want(false, false) === true && want(false, true) === false && want(true, false) === false && want(true, true) === false);
  check('agar.io stats panel: both death paths ask the same rule', (main.match(/\.agarStatsAfterDeath\(\)/g) || []).length === 2 && !/!\s*(this|application)\s*\.skipStats\s*\)/.test(main));
}

console.log(fail ? fail + ' failed' : 'all game over share checks passed');
process.exit(fail ? 1 : 0);
