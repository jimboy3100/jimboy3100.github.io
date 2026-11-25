// Cloud settings (LMexpress.js SNEZOgarUpload / SNEZOgarDownload): the logged-in Google / Facebook
// account is the key (header lm-auth, checked by the settings server). Never asks for a sync code;
// old records (this browser's sync code record, then the plain one) are still read when the
// account has none, and an upload blanks them.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '..', '..', 'LMexpress', 'LMexpress.js'), 'utf8');
const a = src.indexOf('/* Cloud settings belong to the Google / Facebook account');
const b = src.indexOf('function SNEZServers() {');
if (a < 0 || b < 0) { console.log('FAIL: cloud settings code not found'); process.exit(1); }
const code = src.slice(a, b);

let failed = 0;
const check = (name, ok) => { if (!ok) { failed++; console.log('FAIL ' + name); } };

check('no sync code prompt left', !/prompt\(/.test(code));

function b64url(o) { return Buffer.from(JSON.stringify(o)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
const jwt = 'h.' + b64url({ sub: '1122334455', aud: 'x' }) + '.s';

function setup(opts) {
  const reqs = [], toasts = [], posts = [], store = Object.assign({}, opts.store || {});
  let imported = null, clicked = 0, prompted = 0;
  const ctx = {
    console, JSON, String, Object, Array, Math, Date, encodeURIComponent, decodeURIComponent, unescape,
    atob: s => Buffer.from(s, 'base64').toString('binary'),
    Premadeletter123: 'SERVER',
    userid: opts.userid === undefined ? '1122334455' : opts.userid,
    localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
    toastr: { warning: m => toasts.push(['w', m]), info: m => toasts.push(['i', m]), error: m => toasts.push(['e', m]) },
    confirm: () => true,
    prompt: () => { prompted++; return ''; },
    postSNEZ: (url, u, p, body) => posts.push([u, p, body]),
    IdfromLegendmod: () => { },
    _lmCloudSettingsFilter: t => t,
    $: sel => ({
      val: v => { if (v === undefined) return '{"a":1}'; if (sel === '#import-settings') imported = v; },
      click: () => { if (sel === '#import-settings-btn2') clicked++; }
    }),
    XMLHttpRequest: function () {
      const r = { headers: {} };
      this.open = (m, u) => { r.method = m; r.url = u; };
      this.setRequestHeader = (h, v) => { r.headers[h] = v; };
      this.send = body => {
        r.body = body; reqs.push(r);
        const ans = opts.server(r);
        const self = this;
        setImmediate(() => { if (!ans) return self.onerror(); self.status = ans[0]; self.response = ans[1]; self.onload(); });
      };
    }
  };
  ctx.window = ctx;
  ctx.window.master = opts.master === undefined ? { context: 'google', accessToken: jwt } : opts.master;
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  return { ctx, reqs, toasts, posts, get imported() { return imported; }, get clicked() { return clicked; }, get prompted() { return prompted; } };
}
const tick = () => new Promise(r => setTimeout(r, 20));

(async () => {
  // 1. not logged in: no request, a hint, no prompt
  let t = setup({ master: null, server: () => [200, 'x'] });
  t.ctx.SNEZOgarDownload({ shiftKey: true });
  t.ctx.SNEZOgarUpload();
  await tick();
  check('not logged in: no request', t.reqs.length === 0);
  check('not logged in: says to log in', t.toasts.length === 2 && /Log in with Google or Facebook/.test(t.toasts[0][1]));
  check('not logged in: no prompt', t.prompted === 0);

  // 2. upload with Google: lm-auth + the token's account; old records blanked
  t = setup({ store: { lmCloudSyncCode: 'ab'.repeat(12) }, userid: 'someone-else', server: () => [200, 'OK'] });
  t.ctx.SNEZOgarUpload();
  await tick();
  check('upload: one POST', t.reqs.length === 1 && t.reqs[0].method === 'POST');
  check('upload: lm-auth header', t.reqs[0].headers['lm-auth'] === 'google:' + jwt);
  check('upload: username is the token account', t.reqs[0].headers.username === '1122334455');
  check('upload: no password header', !('password' in t.reqs[0].headers));
  check('upload: blanks the plain and the sync code record', t.posts.length === 2 && t.posts[0][1] === 'LMSettings' && t.posts[1][1] === 'LMSettings:' + 'ab'.repeat(12) && t.posts.every(p => p[2] === '{}'));
  check('upload: says saved, no sync code', t.toasts.some(x => x[0] === 'i' && /Google account/.test(x[1]) && !/sync code/i.test(x[1])));

  // 3. upload with an expired login
  t = setup({ server: () => [401, 'Login not verified'] });
  t.ctx.SNEZOgarUpload();
  await tick();
  check('upload 401: expired hint, nothing blanked', t.posts.length === 0 && t.toasts.some(x => /expired/.test(x[1])));

  // 4. download: the account's record
  t = setup({ server: r => r.headers['lm-auth'] ? [200, encodeURIComponent('{"acct":1}')] : [404, ''] });
  t.ctx.SNEZOgarDownload({});
  await tick();
  check('download: account record imported', t.imported === '{"acct":1}' && t.clicked === 1 && t.reqs.length === 1);

  // 5. download: none for the account -> this browser's sync code record -> plain record
  const codeRec = 'cd'.repeat(12);
  t = setup({ store: { lmCloudSyncCode: codeRec }, server: r => r.headers['lm-auth'] ? [404, ''] : r.headers.password === 'LMSettings:' + codeRec ? [200, '{}'] : [200, encodeURIComponent('{"old":1}')] });
  t.ctx.SNEZOgarDownload({});
  await tick(); await tick();
  check('download fallback: account, code, plain', t.reqs.length === 3 && t.reqs[1].headers.password === 'LMSettings:' + codeRec && t.reqs[2].headers.password === 'LMSettings');
  check('download fallback: plain record imported', t.imported === '{"old":1}');
  check('download: never prompts', t.prompted === 0);

  // 6. nothing anywhere
  t = setup({ server: () => [404, ''] });
  t.ctx.SNEZOgarDownload({});
  await tick(); await tick();
  check('download none: says not found', t.imported === null && t.toasts.some(x => /No cloud settings found/.test(x[1])));

  // 7. download with an expired login: no fallback to the readable old records
  t = setup({ server: r => r.headers['lm-auth'] ? [401, ''] : [200, '{"old":1}'] });
  t.ctx.SNEZOgarDownload({});
  await tick();
  check('download 401: expired hint only', t.reqs.length === 1 && t.toasts.some(x => /expired/.test(x[1])) && t.imported === null);

  // 8. Facebook login: provider in lm-auth, username = userid
  t = setup({ master: { context: 'facebook', accessToken: 'EAAB' }, userid: '987', server: () => [200, 'OK'] });
  t.ctx.SNEZOgarUpload();
  await tick();
  check('facebook: lm-auth + userid', t.reqs[0].headers['lm-auth'] === 'facebook:EAAB' && t.reqs[0].headers.username === '987');

  console.log(failed ? failed + ' failed' : 'cloudsettings: all checks pass');
  process.exit(failed ? 1 : 0);
})();
