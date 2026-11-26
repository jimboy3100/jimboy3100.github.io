// Game Over card: one Share button (the header share icon; the big "Share match card" button is
// gone): it shares the match card image with the text and the link through the share sheet, the
// text and link alone where files cannot be shared, else opens a tweet; the camera icon still saves
// the image and the clipboard icon still copies the stats. The share API and window.open are
// stand-ins here; everything is put back. Rapid taps on the camera icon save the image once (until
// 3.693 each tap while the image was encoded saved it again).
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lm = window.legendmod;
  if (!lm || typeof lm.showSessionStats !== 'function') return { fail: ['legendmod.showSessionStats missing'], info: info };
  var nav = window.navigator, saved = {};
  ['share', 'canShare'].forEach(function (k) { saved[k] = Object.getOwnPropertyDescriptor(nav, k); });
  var origOpen = window.open, calls = [], opened = [], canFiles = true;
  var origAClick = HTMLAnchorElement.prototype.click, saves = [];
  var put = function (k, v) { Object.defineProperty(nav, k, { configurable: true, writable: true, value: v }); };
  var u = { finalMass: 9000, highestMass: 24500, topPosition: 2, finalPosition: 5, timeTotal: 95, timeInLeaderboard: 60, massConsumed: 30000, foodEaten: 100, playersEaten: 3, normalCellsEaten: 5, virusesEaten: 1 };
  var card = function () { lm.showSessionStats(u); return sleep(400); };
  /* the card is drawn and encoded first (slow on a busy machine) */
  var waitCalls = async function (n) { for (var i = 0; i < 150 && calls.length + opened.length < n; i++) await sleep(100); };
  /* the card image is drawn while the card is shown: wait for it to be ready (no fixed delay) */
  var waitReady = async function (what) {
    var b = document.getElementById('lm-go-share');
    for (var i = 0; i < 200 && !(b && b._lmCardReady); i++) { await sleep(100); b = document.getElementById('lm-go-share'); }
    need(what + ': the card image got ready', !!(b && b._lmCardReady));
  };
  try {
    window.open = function (url) { opened.push(String(url)); return null; };
    put('share', function (d) { calls.push(d); return Promise.resolve(); });
    put('canShare', function (d) { return canFiles && !!(d && d.files); });
    await card();
    var m = document.getElementById('lm-gameover-modal');
    need('card shown', !!m);
    if (!m) return { fail: fail, info: info };
    need('one share button: no "Share match card" button', !document.getElementById('lm-go-sharecard') && !!document.getElementById('lm-go-share'));
    need('camera (save image) and clipboard icons kept', !!document.getElementById('lm-go-dlcard') && !!document.getElementById('lm-go-copy'));
    document.getElementById('lm-go-share').click();
    await waitCalls(1);
    var d = calls[0];
    info.withFile = d ? { files: d.files && d.files.length, type: d.files && d.files[0] && d.files[0].type, text: String(d.text).slice(0, 60) } : null;
    need('shares the card image', !!d && d.files && d.files.length === 1 && d.files[0].type === 'image/png' && d.files[0].size > 1000);
    need('with the text (mass) and the link', !!d && /24[.,]?5/.test(String(d.text)) && /^https:\/\/www\.legendmod\.ml\//.test(String(d.url)));
    need('no auto-dismiss while sharing', !lm._gameOverDismissTimer);
    /* files cannot be shared: the text and the link */
    calls = []; canFiles = false;
    await card();
    document.getElementById('lm-go-share').click();
    await waitCalls(1);
    need('without file sharing: text and link', calls.length === 1 && !calls[0].files && /^https:\/\/www\.legendmod\.ml\//.test(String(calls[0].url)) && opened.length === 0);
    /* rapid taps: one sheet at a time (the button waits until the sheet is closed) */
    canFiles = true; calls = []; opened = [];
    var settle = null;
    put('share', function (d) { calls.push(d); return new Promise(function (res, rej) { settle = { res: res, rej: rej }; }); });
    await card();
    await waitReady('rapid taps');
    var sb = document.getElementById('lm-go-share');
    sb.click(); sb.click(); sb.click();
    await sleep(50);
    need('rapid taps: one share sheet', calls.length === 1 && !!calls[0].files);
    need('the card image was ready: shared at the tap', calls.length === 1);
    if (settle) settle.res();
    await sleep(50);
    sb.click();
    await sleep(50);
    need('after the sheet closed: Share works again', calls.length === 2);
    if (settle) settle.res();
    await sleep(50);
    /* the sheet refuses the image (not a cancel): nothing opens by itself; the next tap shares
     * the text and link, a refusal of that one leads to a tweet on the next tap */
    calls = []; opened = [];
    var refuse = function () { var e = new Error('refused'); e.name = 'NotAllowedError'; return e; };
    put('share', function (d) { calls.push(d); return Promise.reject(refuse()); });
    await card();
    await waitReady('refused');
    sb = document.getElementById('lm-go-share');
    sb.click();
    await sleep(100);
    need('refused image: no second sheet and no tweet without a tap', calls.length === 1 && !!calls[0].files && opened.length === 0);
    sb.click();
    await sleep(100);
    need('next tap: the text and the link', calls.length === 2 && !calls[1].files && opened.length === 0);
    sb.click();
    await sleep(100);
    need('next tap after that: a tweet', calls.length === 2 && opened.length === 1);
    /* cancelled by the player: nothing else, the next tap offers the image again */
    calls = []; opened = [];
    put('share', function (d) { calls.push(d); var e = new Error('cancel'); e.name = 'AbortError'; return Promise.reject(e); });
    await card();
    await waitReady('cancel');
    sb = document.getElementById('lm-go-share');
    sb.click();
    await sleep(100);
    sb.click();
    await sleep(100);
    need('cancel: nothing else opens, the image again on the next tap', calls.length === 2 && !!calls[1].files && opened.length === 0);
    put('share', function (d) { calls.push(d); return Promise.resolve(); });
    /* no share sheet at all: a tweet */
    calls = [];
    put('share', undefined);
    await card();
    document.getElementById('lm-go-share').click();
    await waitCalls(1);
    need('without a share sheet: a tweet', calls.length === 0 && opened.length === 1 && opened[0].indexOf('https://twitter.com/intent/tweet?text=') === 0);
    /* camera icon: rapid taps save the image once; a later tap saves it again (the download link's
     * click is a stand-in, nothing is saved) */
    HTMLAnchorElement.prototype.click = function () { if (this.download) saves.push(this.download); else return origAClick.apply(this, arguments); };
    await card();
    var dl = document.getElementById('lm-go-dlcard');
    dl.click(); dl.click(); dl.click();
    for (var si = 0; si < 100 && !saves.length; si++) await sleep(100);
    await sleep(300);
    info.saves = saves.length;
    need('camera icon: rapid taps save the image once', saves.length === 1 && /\.png$/.test(saves[0]));
    dl.click();
    for (si = 0; si < 100 && saves.length < 2; si++) await sleep(100);
    need('camera icon: a later tap saves it again', saves.length === 2);
  } catch (e) {
    fail.push('threw: ' + e);
  } finally {
    window.open = origOpen;
    HTMLAnchorElement.prototype.click = origAClick;
    ['share', 'canShare'].forEach(function (k) { if (saved[k]) Object.defineProperty(nav, k, saved[k]); else delete nav[k]; });
    var mm = document.getElementById('lm-gameover-modal');
    if (mm && mm.parentNode) mm.parentNode.removeChild(mm);
    if (lm._gameOverDismissTimer) { clearTimeout(lm._gameOverDismissTimer); lm._gameOverDismissTimer = null; }
  }
  return { fail: fail, info: info };
})()
