// Menu footer: the session line ("This session: 2 games ..."), the "Match history" link and the
// private room link take a newly chosen language at once. Until 3.689 they kept the language they
// were written in (until the next game ended or room change). Language, option, session numbers,
// room state and the stored list are put back.
(async () => {
  var fail = [], info = {};
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var L = window.LMi18n, s = window.legendmod5;
  if (!L || typeof L.setLang !== 'function' || typeof window._lmSessionStats !== 'function') return { skip: 'LMi18n or the session line missing' };
  var setLang = function (n) { return new Promise(function (r) { L.setLang(n, { save: false }, function () { r(); }); setTimeout(r, 8000); }); };
  var before = L.lang(), keepMh = s.matchHistory, ss = null, mh = null;
  try { ss = sessionStorage.getItem('lmSessionStats'); mh = localStorage.getItem('lmMatchHistory'); } catch (e) { }
  try {
    if (before !== 'en') await setLang(1);
    sessionStorage.setItem('lmSessionStats', JSON.stringify({ g: 2, b: 5000, t: 120000 }));
    _lmSessionStats();
    application.setSettings('matchHistory', true);
    var room = window._lmRoomState && !_lmRoomState.code ? _lmRoomState : null;
    if (room) { room.code = 'ABCDEF'; _lmRoomButton(); }
    await sleep(200);
    var roomLink = document.getElementById('lm-room-btn'), roomEn = roomLink && roomLink.textContent;
    var line = document.getElementById('lm-session-stats'), link = document.getElementById('lm-mh-btn');
    if (!line || !link) return { fail: ['no session line or Match history link under the menu footer'], info: info };
    var en = [line.textContent, link.textContent];
    await setLang(2);
    await sleep(300);
    info.el = [line.textContent, link.textContent];
    if (L.lang() !== 'el') fail.push('Greek was not chosen');
    if (line.textContent === en[0] || line.textContent.indexOf('5,000') === -1) fail.push('the session line stayed "' + line.textContent + '"');
    if (link.textContent.indexOf(lmT('matchHistory')) === -1 || link.textContent === en[1]) fail.push('the Match history link stayed "' + link.textContent + '"');
    if (roomLink && (roomLink.textContent === roomEn || roomLink.textContent.indexOf(lmT('room')) === -1)) fail.push('the private room link stayed "' + roomLink.textContent + '"');
    info.room = roomLink && roomLink.textContent;
  } catch (e) {
    fail.push('threw ' + e);
  } finally {
    await setLang(before === 'en' ? 1 : L.codes.indexOf(before) + 1);
    application.setSettings('matchHistory', keepMh);
    if (room) { room.code = ''; _lmRoomButton(); }
    try { if (ss == null) sessionStorage.removeItem('lmSessionStats'); else sessionStorage.setItem('lmSessionStats', ss); } catch (e) { }
    try { if (mh == null) localStorage.removeItem('lmMatchHistory'); else localStorage.setItem('lmMatchHistory', mh); } catch (e) { }
    if (ss == null) { var l2 = document.getElementById('lm-session-stats'); if (l2 && l2.parentNode) l2.parentNode.removeChild(l2); }
  }
  return { fail: fail, info: info };
})()
