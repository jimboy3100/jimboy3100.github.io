// Servers window: the button next to the server token box opens it, it fits the screen, every tab
// renders, a server is starred (stored), labelled and unstarred, and x / Escape close it.
(async () => {
  var fail = [], info = {};
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  for (var i = 0; i < 40 && !(window.LMServerManager && window.LMServerManager.open && document.getElementById('lm-sm-btn')); i++) await wait(250);
  if (!window.LMServerManager || !window.LMServerManager.open) return { fail: ['LMServerManager not loaded'] };
  if (!hotkeysCommand['hk-serverManager']) fail.push('hotkey hk-serverManager missing');
  else if (hotkeysCommand['hk-serverManager'].defaultKey !== '') fail.push('hotkey hk-serverManager has a default key');
  if (window.LMCommandCentre && LMCommandCentre.items && !LMCommandCentre.items().some(function (it) { return it.id === 'win:servers'; })) fail.push('Command Centre has no Servers window entry');
  var saved = localStorage.getItem('lmServerFavs');
  localStorage.removeItem('lmServerFavs');
  try {
    var btn = document.getElementById('lm-sm-btn');
    if (!btn) fail.push('no Servers button next to the server token box');
    else {
      var tok = document.getElementById('server-token');
      if (btn.previousElementSibling !== tok) fail.push('the button is not next to the token box');
      btn.click();
    }
    if (!LMServerManager.isOpen()) LMServerManager.open();
    var ov = document.getElementById('lm-sm-overlay');
    if (!ov) return { fail: fail.concat(['window did not open']) };
    var r = ov.querySelector('.lm-sm-win').getBoundingClientRect();
    info.win = Math.round(r.width) + 'x' + Math.round(r.height) + ' in ' + innerWidth + 'x' + innerHeight;
    if (r.left < 0 || r.top < 0 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1) fail.push('window does not fit the screen: ' + info.win);
    var x = ov.querySelector('.lm-sm-x').getBoundingClientRect();
    if (x.width < 32 || x.height < 32) fail.push('close button too small for a finger: ' + Math.round(x.width) + 'x' + Math.round(x.height));
    ['recent', 'arenas', 'private', 'el', 'fav'].forEach(function (t) {
      var tb = ov.querySelector('.lm-sm-tabs [data-id="' + t + '"]');
      if (!tb) { fail.push('tab ' + t + ' missing'); return; }
      tb.click();
      if (!ov.querySelector('.lm-sm-list').children.length) fail.push('tab ' + t + ' is empty');
    });
    info.privateRows = LMServerManager.rows('private').length;
    if (!info.privateRows) fail.push('no private servers listed');
    // star Expanding Land FFA
    ov.querySelector('.lm-sm-tabs [data-id="el"]').click();
    var star = ov.querySelector('.lm-sm-star[data-id="p:5001"]');
    if (!star) fail.push('Expanding Land FFA has no star');
    else {
      star.click();
      var st = JSON.parse(localStorage.getItem('lmServerFavs') || 'null');
      if (!st || !st.favs || !st.favs.some(function (f) { return f.id === 'p:5001' && f.type === 'el'; })) fail.push('starring did not store the favourite: ' + localStorage.getItem('lmServerFavs'));
      if (!ov.querySelector('.lm-sm-star.on[data-id="p:5001"]')) fail.push('star not shown as on');
      ov.querySelector('.lm-sm-tabs [data-id="fav"]').click();
      if (!ov.querySelector('.lm-sm-row[data-row="p:5001"]')) fail.push('favourite not on the Favourites tab');
      // label: markup and control characters are cleaned, the label is shown as text
      var ed = ov.querySelector('[data-act="edit"][data-id="p:5001"]');
      if (!ed) fail.push('no label button on the favourite');
      else {
        ed.click();
        var inp = ov.querySelector('.lm-sm-label');
        if (!inp) fail.push('label box did not open');
        else {
          inp.value = '  <b>My EL</b>  ';
          ov.querySelector('[data-act="save"]').click();
          var lab = (JSON.parse(localStorage.getItem('lmServerFavs')).favs[0] || {}).label;
          if (lab !== 'bMy EL/b') fail.push('label not cleaned: ' + lab);
          if (ov.querySelector('.lm-sm-row[data-row="p:5001"] b')) fail.push('label inserted as HTML');
        }
      }
      var link = LMServerManager.linkOf('p:5001');
      info.link = link ? link.replace(/pass=[^&]*/, 'pass=…') : '(none yet)';
      if (link && !/^https:\/\/agar\.io\/(play)?\?sip=[^&]+&pass=[^&]*&r=Private&m=5001$/.test(link)) fail.push('bad link ' + link);
      ov.querySelector('.lm-sm-star[data-id="p:5001"]').click();
      if (localStorage.getItem('lmServerFavs') !== null) fail.push('unstarring the only favourite left ' + localStorage.getItem('lmServerFavs'));
      if (ov.querySelector('.lm-sm-row[data-row="p:5001"]')) fail.push('unstarred server still on the Favourites tab');
    }
    // the notification option is off by default
    var nb = document.getElementById('lm-sm-notify');
    if (!nb) fail.push('no notification option on the Favourites tab');
    else if (nb.checked) fail.push('notification option on by default');
    ov.querySelector('.lm-sm-x').click();
    if (LMServerManager.isOpen()) fail.push('x did not close the window');
    LMServerManager.open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    if (LMServerManager.isOpen()) fail.push('Escape did not close the window');
    LMServerManager.open();
    var o2 = document.getElementById('lm-sm-overlay');
    o2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (LMServerManager.isOpen()) fail.push('a tap outside the window did not close it');
  } finally {
    LMServerManager.close();
    if (saved === null) localStorage.removeItem('lmServerFavs'); else localStorage.setItem('lmServerFavs', saved);
  }
  return { fail: fail, info: info };
})()
