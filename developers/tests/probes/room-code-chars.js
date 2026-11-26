// Room code field: codes never contain I, O, 0 or 1 (none of the four is in the code alphabet,
// so a look-alike cannot be mapped to another). Until 3.688 a code typed with one of them got
// "Enter the 6-character room code", which reads as if the code were too short. The real join
// window is opened and its Join button clicked with codes that never reach the network.
(async () => {
  var fail = [], info = {};
  if (typeof window._lmRoomOpen !== 'function') return { skip: 'no room window' };
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var lt = function (k, en) { var s = window.lmT && window.lmT(k); return s && s !== k ? s : en; };
  var generic = lt('roomErrCode', 'Enter the 6-character room code.');
  var hint = lt('pkg.r10.roomCodeChars', 'Room codes never contain I, O, 0 or 1: check the code again.');
  var md;
  var tryCode = function (v) {
    var input = document.getElementById('lm-room-code');
    input.value = v;
    input.dispatchEvent(new Event('input'));
    document.getElementById('lm-room-join').click();
    return String(document.getElementById('lm-room-msg').textContent || '');
  };
  try {
    window._lmRoomOpen('join'); await sleep(300);
    md = document.getElementById('lm-room-modal');
    if (!md || !document.getElementById('lm-room-code')) { fail.push('the join window did not open'); return { fail: fail, info: info }; }
    ['ABC0DE', 'abcode', 'AB1CDE', 'ABICDE'].forEach(function (v) {
      var t = tryCode(v);
      info[v] = t;
      if (t !== hint) fail.push(v + ': no hint about I, O, 0 and 1 (' + t + ')');
    });
    var t = tryCode('ABC');
    info.short = t;
    if (t !== generic) fail.push('a short code lost the 6-character message (' + t + ')');
  } catch (e) {
    fail.push('threw ' + (e && e.stack || e));
  } finally {
    md = document.getElementById('lm-room-modal');
    if (md && md._lmClose) md._lmClose(true);
  }
  return { fail: fail, info: info };
})()
