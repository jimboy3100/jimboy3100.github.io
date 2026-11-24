// Core globals exist after the mod has loaded.
(async () => {
  var fail = [], info = {};
  function need(name, ok) { if (!ok) fail.push(name); }
  need('jQuery', typeof window.jQuery === 'function');
  need('window.legendmod', !!window.legendmod && typeof window.legendmod === 'object');
  need('window.application', !!window.application && typeof window.application === 'object');
  need('defaultmapsettings', typeof defaultmapsettings === 'object' && Object.keys(defaultmapsettings).length > 50);
  need('defaultSettings', typeof defaultSettings === 'object' && !!defaultSettings);
  need('textLanguage', typeof textLanguage === 'object' && !!textLanguage);
  need('window.lmT', typeof window.lmT === 'function' && typeof window.lmT('shop') === 'string' && window.lmT('shop').length > 0);
  ['setSettings', 'saveSettings', 'showMenu', 'hideMenu', 'syncHotkeyOption', 'addOptions'].forEach(function (f) {
    need('application.' + f, window.application && typeof window.application[f] === 'function');
  });
  info.settings = typeof defaultmapsettings === 'object' ? Object.keys(defaultmapsettings).length : 0;
  return { fail: fail, info: info };
})()
