// Hotkey commands are defined and the hotkeys table is populated.
(async () => {
  var fail = [], info = {};
  if (typeof hotkeysCommand !== 'object' || !hotkeysCommand) return { fail: ['hotkeysCommand missing'] };
  if (typeof hotkeys !== 'object' || !hotkeys) return { fail: ['hotkeys missing'] };
  var ids = Object.keys(hotkeysCommand);
  info.commands = ids.length;
  info.bound = Object.keys(hotkeys).length;
  if (ids.length < 50) fail.push('only ' + ids.length + ' hotkey commands');
  if (info.bound < 20) fail.push('only ' + info.bound + ' bound hotkeys');
  ids.forEach(function (id) {
    var c = hotkeysCommand[id];
    var label;
    try { label = c.label; } catch (e) { fail.push(id + ': label throws ' + e); return; }
    if (typeof label !== 'string' || !label) fail.push(id + ': no label');
    if (typeof c.defaultKey !== 'string') fail.push(id + ': defaultKey not a string');
    if (c.keyDown != null && typeof c.keyDown !== 'function') fail.push(id + ': keyDown not a function');
    if (c.keyUp != null && typeof c.keyUp !== 'function') fail.push(id + ': keyUp not a function');
  });
  Object.keys(hotkeys).forEach(function (k) {
    if (k !== 'spec-messageKey' && k !== '' && !(hotkeys[k] in hotkeysCommand)) fail.push('key ' + k + ' bound to unknown ' + hotkeys[k]);
  });
  info.rows = $('#hotkeys-cfg').find('input').length;
  if (fail.length > 20) fail = fail.slice(0, 20).concat(['...']);
  return { fail: fail, info: info };
})()
