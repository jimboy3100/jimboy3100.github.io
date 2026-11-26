// Game Over card: one Share button (the header share icon; the big "Share match card" button is
// gone): it shares the match card image with the text and the link through the share sheet, the
// text and link alone where files cannot be shared, else opens a tweet; the camera icon still saves
// the image and the clipboard icon still copies the stats. The share API and window.open are
// stand-ins here; everything is put back.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lm = window.legendmod;
  if (!lm || typeof lm.showSessionStats !== 'function') return { fail: ['legendmod.showSessionStats missing'], info: info };
  var nav = window.navigator, saved = {};
  ['share', 'canShare'].forEach(function (k) { saved[k] = Object.getOwnPropertyDescriptor(nav, k); });
  var origOpen = window.open, calls = [], opened = [], canFiles = true;
  var put = function (k, v) { Object.defineProperty(nav, k, { configurable: true, writable: true, value: v }); };
  var u = { finalMass: 9000, highestMass: 24500, topPosition: 2, finalPosition: 5, timeTotal: 95, timeInLeaderboard: 60, massConsumed: 30000, foodEaten: 100, playersEaten: 3, normalCellsEaten: 5, virusesEaten: 1 };
  var card = function () { lm.showSessionStats(u); return sleep(400); };
  /* the card is drawn and encoded first (slow on a busy machine) */
  var waitCalls = async function (n) { for (var i = 0; i < 150 && calls.length + opened.length < n; i++) await sleep(100); };
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
    /* no share sheet at all: a tweet */
    calls = [];
    put('share', undefined);
    await card();
    document.getElementById('lm-go-share').click();
    await waitCalls(1);
    need('without a share sheet: a tweet', calls.length === 0 && opened.length === 1 && opened[0].indexOf('https://twitter.com/intent/tweet?text=') === 0);
  } catch (e) {
    fail.push('threw: ' + e);
  } finally {
    window.open = origOpen;
    ['share', 'canShare'].forEach(function (k) { if (saved[k]) Object.defineProperty(nav, k, saved[k]); else delete nav[k]; });
    var mm = document.getElementById('lm-gameover-modal');
    if (mm && mm.parentNode) mm.parentNode.removeChild(mm);
    if (lm._gameOverDismissTimer) { clearTimeout(lm._gameOverDismissTimer); lm._gameOverDismissTimer = null; }
  }
  return { fail: fail, info: info };
})()
