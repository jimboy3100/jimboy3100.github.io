// Phone run, compact leaderboard (gear panel option): 5 rows (names and mass/sector column alike), your
// own place lower down and the player / bot count stay, and it is not drawn smaller than the 5 rows
// need (up to 3.698 the own rows were hidden and the fit measured all 20 rows first). A tap shows 10,
// then all, then 5 again. The option, the leaderboard text and the phone preferences are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  if (!(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches)) return { fail: fail, info: { skipped: 'not the phone run' } };
  for (var w0 = 0; w0 < 60 && !window._lmMobileHost; w0++) await sleep(250);
  var H = window._lmMobileHost, app = window.application, cb = document.getElementById('lm-lbc');
  var lb = document.getElementById('leaderboard-hud'), pos = document.getElementById('leaderboard-positions'), data = document.getElementById('leaderboard-data');
  if (!H || !app || !cb || !lb || !pos || !data) return { fail: ['phone controls, compact switch or leaderboard missing'] };
  var keepPrefs = null; try { keepPrefs = localStorage.getItem('lm-mobile-prefs'); } catch (e) { }
  var oldP = pos.innerHTML, oldD = data.innerHTML, keepChecked = cb.checked;
  var lbShown = lb.style.getPropertyValue('display'), lbPrio = lb.style.getPropertyPriority('display');
  var P = '', Dt = '';
  for (var i = 1; i <= 20; i++) {
    P += '<span' + (i === 14 ? ' class="me"' : '') + '>' + i + '. Player name ' + i + '</span>';
    Dt += '<span class="lb-data"><span class="top5-mass-color">[' + (5 - i * 0.2).toFixed(1) + 'k]</span><span class="hud-main-color">[C3]</span></span>';
  }
  P += '<span class="me">Players: 3 Bots: 100</span>';
  var set = function (on) { cb.checked = on; cb.dispatchEvent(new Event('change', { bubbles: true })); };
  var shown = function (list) { var n = []; for (var j = 0; j < list.length; j++) if (list[j].getClientRects().length) n.push(j + 1); return n; };
  var tap = function () {
    var r = lb.getBoundingClientRect(), t = new Touch({ identifier: 61, target: lb, clientX: r.left + r.width / 2, clientY: r.top + 20 });
    lb.dispatchEvent(new TouchEvent('touchstart', { touches: [t], targetTouches: [t], changedTouches: [t], bubbles: true, cancelable: true }));
    lb.dispatchEvent(new TouchEvent('touchend', { touches: [], targetTouches: [], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  try {
    lb.style.setProperty('display', 'block', 'important');
    app.displayLeaderboard(P, Dt);
    set(true);
    H.reposition();
    await sleep(50);
    var ps = pos.querySelectorAll(':scope > span'), ds = data.querySelectorAll(':scope > span');
    info.names = shown(ps).join(','); info.data = shown(ds).join(',');
    if (info.names !== '1,2,3,4,5,14,21') fail.push('compact: names shown ' + info.names + ' (want 1-5, your place 14 and the player count)');
    if (info.data !== '1,2,3,4,5,14') fail.push('compact: mass/sector rows shown ' + info.data + ' (want 1-5 and 14)');
    var a = ps[13].getBoundingClientRect(), b = ds[13].getBoundingClientRect();
    if (Math.abs(a.top - b.top) > 1.5) fail.push('your row\'s mass/sector at ' + Math.round(b.top) + ', its name at ' + Math.round(a.top));
    var base = parseFloat(lb.dataset.lmBaseScale) || 0.75, sc = lb.getBoundingClientRect().height / lb.offsetHeight;
    info.scale = Math.round(sc * 1000) / 1000;
    if (sc < base - 0.01) fail.push('compact leaderboard drawn at ' + info.scale + ' although 7 rows fit at ' + base);
    if (getComputedStyle(lb).pointerEvents === 'none') fail.push('compact leaderboard takes no taps');
    tap(); await sleep(30);
    info.ten = shown(ps).length;
    if (info.ten !== 12) fail.push('a tap should show 10 rows + your 2 rows, shows ' + info.ten);
    tap(); await sleep(30);
    if (shown(ps).length !== 21) fail.push('a second tap should show all 21 rows, shows ' + shown(ps).length);
    tap(); await sleep(30);
    if (shown(ps).length !== 7) fail.push('a third tap should go back to 7 rows, shows ' + shown(ps).length);
    set(false);
    await sleep(30);
    if (shown(ps).length !== 21 || shown(ds).length !== 20) fail.push('option off: not every row shown again');
    if (getComputedStyle(lb).pointerEvents !== 'none') fail.push('option off: the leaderboard still takes taps');
  } finally {
    set(keepChecked);
    try { if (keepPrefs === null) localStorage.removeItem('lm-mobile-prefs'); else localStorage.setItem('lm-mobile-prefs', keepPrefs); } catch (e) { }
    if (H.reloadPrefs) H.reloadPrefs();
    if (lbShown) lb.style.setProperty('display', lbShown, lbPrio); else lb.style.removeProperty('display');
    app.displayLeaderboard(oldP, oldD);
    H.reposition();
  }
  return { fail: fail, info: info };
})()
