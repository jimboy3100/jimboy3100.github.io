// Scan Trick and line split status lines show by themselves while the technique is in use: no switch
// of their own in Settings, and an old saved "off" (scanTrickStatus / lineSplitStatus false) no longer hides them.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  var lm = window.legendmod, s = window.defaultmapsettings || window.legendmod5;
  if (!lm || !s || typeof lm.updateScanTrickStatus !== 'function' || typeof lm.updateLineSplitStatus !== 'function') { fail.push('status functions missing'); return { fail: fail, info: info }; }
  need('no status switches in Settings', !document.getElementById('scanTrickStatus') && !document.getElementById('lineSplitStatus'));
  need('no status settings', !('scanTrickStatus' in LM_SETTINGS_DEFAULTS) && !('lineSplitStatus' in LM_SETTINGS_DEFAULTS));
  var keep = { st: s.scanTrick, sts: s.scanTrickStatus, lss: s.lineSplitStatus, a: lm.scanTrickActive, la: lm.lineSplitActive, ls: lm.lineSplitSplits };
  var shown = function (id) { var el = document.getElementById(id); return !!el && el.style.display !== 'none' && !!el.textContent; };
  try {
    /* an old saved "off" of the retired switches */
    s.scanTrickStatus = false; s.lineSplitStatus = false;
    s.scanTrick = true; lm.scanTrickActive = true;
    lm.updateScanTrickStatus();
    need('Scan Trick status shown while held', shown('scan-trick-status'));
    lm.scanTrickActive = false; lm.updateScanTrickStatus();
    need('Scan Trick status gone when let go', !shown('scan-trick-status'));
    lm.lineSplitActive = true; lm.lineSplitSplits = 3; lm.updateLineSplitStatus();
    need('line split status shown while the aim is locked', shown('line-split-status'));
    info.line = (document.getElementById('line-split-status') || {}).textContent;
    lm.lineSplitActive = false; lm.updateLineSplitStatus();
    need('line split status gone after', !shown('line-split-status'));
  } finally {
    s.scanTrick = keep.st; lm.scanTrickActive = keep.a; lm.lineSplitActive = keep.la; lm.lineSplitSplits = keep.ls;
    if (keep.sts === undefined) delete s.scanTrickStatus; else s.scanTrickStatus = keep.sts;
    if (keep.lss === undefined) delete s.lineSplitStatus; else s.lineSplitStatus = keep.lss;
    lm.updateScanTrickStatus(); lm.updateLineSplitStatus();
  }
  return { fail: fail, info: info };
})()
