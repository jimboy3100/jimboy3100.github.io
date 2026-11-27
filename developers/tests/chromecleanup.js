/* Test runs leave no Chrome and no profile behind (smoke.js, run.js, lib/testchrome.js): after a probe
 * timeout, a harness error, a failed start and a killed smoke run no process with its --user-data-dir
 * in the run's profile is alive and the profile folder is gone; the opt-in prune of out/ (and of the
 * test Chromes' temporary profiles) removes only old folders, and never one a running smoke run uses.
 * node developers/tests/chromecleanup.js   (needs Chrome for the first cases; prints SKIP for them without it)
 * SMOKE_JS=<file>: test another smoke.js (e.g. the previous version) */
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const here = __dirname, repo = path.resolve(here, '..', '..');
const T = require('./lib/testchrome');
const smokeJs = process.env.SMOKE_JS || path.join(here, 'smoke.js');
const stamp = Date.now();

let failed = 0;
const check = (name, ok, more) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || !more ? '' : ': ' + more)); if (!ok) failed++; };
const users = profile => T.users(profile) || [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
function newOut(name, probe) {
  const out = path.join(here, 'out', 'chromecleanup-' + name + '-' + stamp);
  fs.mkdirSync(out, { recursive: true });
  if (probe === 'dir') fs.mkdirSync(path.join(out, 'probe.js')); else if (probe) fs.writeFileSync(path.join(out, 'probe.js'), probe);
  return out;
}
/* what a case leaves: Chrome processes using the profile, the profile folder; then it is cleared
 * (a failing version must not leave its Chromes running) */
function left(out) {
  const profile = path.join(out, 'profile');
  const procs = users(profile).length, folder = fs.existsSync(profile);
  T.cleanupProfile(profile, { search: true });
  try { fs.rmSync(out, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (e) { }
  return { procs, folder };
}
const HANG = 'new Promise(function () { })';

(async () => {
  /* a failed start: CHROME_PATH is not a browser (node exits on the Chrome options); a profile
   * folder from an earlier run of the folder goes too */
  {
    const out = newOut('nostart', HANG);
    fs.mkdirSync(path.join(out, 'profile'), { recursive: true });
    fs.writeFileSync(path.join(out, 'profile', 'Local State'), '{}');
    const r = spawnSync(process.execPath, [smokeJs, repo, out, '1', 'about:blank'], { encoding: 'utf8', timeout: 120000, env: Object.assign({}, process.env, { CHROME_PATH: process.execPath }) });
    check('failed start: exit 2 (chrome did not start)', r.status === 2 && /chrome did not start/.test(r.stdout), r.status + ' ' + (r.stdout || '').slice(0, 300));
    const l = left(out);
    check('failed start: no profile folder left', !l.folder);
  }

  /* the probes run out of time (SMOKE_PROBE_LIMIT) */
  const tOut = newOut('timeout', HANG);
  const tRun = spawnSync(process.execPath, [smokeJs, repo, tOut, '1', 'about:blank'], { encoding: 'utf8', timeout: 180000, env: Object.assign({}, process.env, { SMOKE_PROBE_LIMIT: '2' }) });
  if (/chrome not found/.test(tRun.stdout || '')) { left(tOut); console.log('SKIP chrome not found (the Chrome cases)'); }
  else {
    {
      const out = tOut, r = tRun;
      check('probe timeout: exit 4', r.status === 4, r.status + ' ' + (r.stdout || '').slice(0, 300));
      const l = left(out);
      check('probe timeout: no Chrome process left', l.procs === 0, l.procs + ' processes');
      check('probe timeout: no profile folder left', !l.folder);
    }
    /* a harness error (probe.js is a folder: reading it throws) */
    {
      const out = newOut('error', 'dir');
      const r = spawnSync(process.execPath, [smokeJs, repo, out, '1', 'about:blank'], { encoding: 'utf8', timeout: 180000 });
      check('harness error: exit 3', r.status === 3 && /harness error/.test(r.stdout), r.status + ' ' + (r.stdout || '').slice(0, 300));
      const l = left(out);
      check('harness error: no Chrome process left', l.procs === 0, l.procs + ' processes');
      check('harness error: no profile folder left', !l.folder);
    }
    /* --keep (SMOKE_KEEP_PROFILE=1): Chrome ended, the profile kept */
    {
      const out = newOut('keep', '"done"');
      const r = spawnSync(process.execPath, [smokeJs, repo, out, '1', 'about:blank'], { encoding: 'utf8', timeout: 180000, env: Object.assign({}, process.env, { SMOKE_KEEP_PROFILE: '1' }) });
      const procs = users(path.join(out, 'profile')).length, folder = fs.existsSync(path.join(out, 'profile'));
      left(out);
      check('keep: exit 0 and the probe ran', r.status === 0 && /PROBE: "done"/.test(r.stdout), r.status + ' ' + (r.stdout || '').slice(0, 300));
      check('keep: no Chrome process left, the profile kept', procs === 0 && folder, procs + ' processes, folder ' + folder);
    }
    /* the smoke run is killed while its probe runs (run.js out of time): run.js then ends what uses
     * the profile and removes it (cleanupProfile with search, as in run.js runTask) */
    {
      const out = newOut('killed', HANG);
      const profile = path.join(out, 'profile');
      const p = spawn(process.execPath, [smokeJs, repo, out, '1', 'about:blank'], { stdio: 'ignore' });
      let up = false;
      for (let i = 0; i < 90 && !up; i++) { await sleep(1000); up = ((T.listChromes() || []).some(c => c.main && c.dir === T.norm(profile))); }
      await sleep(1500);
      p.kill();
      await new Promise(r => p.exitCode !== null || p.signalCode ? r() : p.on('exit', r));
      check('killed run: its Chrome was running', up);
      T.cleanupProfile(profile, { search: true });
      const l = left(out);
      check('killed run: no Chrome process left after the runner cleanup', l.procs === 0, l.procs + ' processes');
      check('killed run: no profile folder left after the runner cleanup', !l.folder);
    }
  }

  /* prune: old run folders go, new ones stay; never a folder a running smoke run uses; Chromes left
   * by killed runs in old folders are ended */
  {
    const root = path.join(here, 'out', 'chromecleanup-prune-' + stamp);
    const mk = (n, daysOld) => {
      const d = path.join(root, n);
      fs.mkdirSync(path.join(d, 'profile'), { recursive: true });
      fs.writeFileSync(path.join(d, 'result.json'), '{}');
      const t = new Date(Date.now() - daysOld * 86400000);
      [path.join(d, 'profile'), path.join(d, 'result.json'), d].forEach(f => fs.utimesSync(f, t, t));
    };
    const reset = () => { fs.rmSync(root, { recursive: true, force: true }); mk('desktop-old', 10); mk('mobile-old', 4); mk('desktop-new', 0.1); };
    const dirIn = n => T.norm(path.join(root, n, 'profile'));
    const ls = () => fs.readdirSync(root).sort().join(',');

    reset();
    let r = T.prune(root, 3, { list: () => [] });
    check('prune: folders older than 3 days removed, newer kept', ls() === 'desktop-new' && r.removed.length === 2, ls());
    reset();
    r = T.prune(root, 7, { list: () => [] });
    check('prune: 7 days keeps the 4 days old one', ls() === 'desktop-new,mobile-old', ls());

    reset();
    r = T.prune(root, 0.25, { list: () => [] });
    check('prune: 0.25 days (6 hours) keeps a folder changed 2.4 hours ago', ls() === 'desktop-new', ls());
    reset();
    r = T.prune(root, 0.05, { list: () => [] });
    check('prune: 0.05 days (1.2 hours) removes it', ls() === '', ls());
    /* 0 days: a folder changed in the last hour stays (a running test may use it without a Chrome in it:
     * before its Chrome starts, while run.js reads result.json, the extension copy of extensionreal.js) */
    reset();
    mk('desktop-running', 10 / 1440);
    r = T.prune(root, 0, { list: () => [] });
    check('prune: 0 days keeps a folder changed 10 minutes ago, removes the 2.4 hours old one', ls() === 'desktop-running', ls());

    reset();
    const killed = [];
    /* a running smoke run (its runner and browser alive) in a folder that looks old: kept, the others go */
    r = T.prune(root, 3, { list: () => [{ pid: 11, ppid: 10, dir: dirIn('desktop-old'), main: true }, { pid: 12, ppid: 11, dir: dirIn('desktop-old'), main: false }], alive: pid => pid === 10 || pid === 11, kill: p => killed.push(...p) });
    check('prune: a folder a running smoke run uses is kept, also when old', ls() === 'desktop-new,desktop-old' && r.active === 1 && !killed.length, ls() + ' ' + JSON.stringify(r));

    reset();
    r = T.prune(root, 3, { list: () => [{ pid: 21, ppid: 20, dir: dirIn('desktop-old'), main: true }, { pid: 22, ppid: 21, dir: dirIn('desktop-old'), main: false }, { pid: 23, ppid: 1, dir: dirIn('mobile-old'), main: false }, { pid: 24, ppid: 1, dir: dirIn('desktop-new'), main: false }], alive: () => false, kill: p => killed.push(...p) });
    check('prune: Chromes of killed runs in old folders ended (also children without their browser), then pruned; a new folder untouched', killed.sort().join(',') === '21,22,23' && ls() === 'desktop-new', killed + ' ' + ls());

    /* the temporary profiles of the tests with their own Chrome: only the names fs.mkdtempSync gives them */
    {
      const tmp = path.join(root, 'tmp');
      const mkT = (n, daysOld) => { const d = path.join(tmp, n); fs.mkdirSync(d, { recursive: true }); const t = new Date(Date.now() - daysOld * 86400000); fs.utimesSync(d, t, t); };
      fs.rmSync(root, { recursive: true, force: true });
      mkT('lm-glbatch-a1B2c3', 2); mkT('lm-usload-Zz9yX8', 2); mkT('lm-launch-prof-Ab12Cd', 2); mkT('lm-bench-x1y2z3', 2); mkT('lm-glbatch-q9q9q9', 0.01); mkT('lm-glbatch-toolong7', 2); mkT('lm-mine', 2); mkT('other-a1B2c3', 2);
      r = T.pruneDirs([{ dir: tmp, match: T.TEMP_PROFILE }], 1, { list: () => [] });
      check('prune: old temporary test profiles removed, new ones and other folders kept', fs.readdirSync(tmp).sort().join(',') === 'lm-glbatch-q9q9q9,lm-glbatch-toolong7,lm-mine,other-a1B2c3', fs.readdirSync(tmp).sort().join(','));
    }

    reset();
    killed.length = 0;
    r = T.prune(root, 3, { list: () => [{ pid: 31, ppid: 30, dir: T.norm(path.join(here, 'out-other', 'x', 'profile')), main: true }], alive: () => true, kill: p => killed.push(...p) });
    check('prune: a Chrome outside the folder does not stop it', ls() === 'desktop-new' && !r.active && !killed.length, ls());

    reset();
    r = T.prune(root, 3, { list: () => null });
    check('prune: nothing removed when the process list cannot be read', ls() === 'desktop-new,desktop-old,mobile-old' && r.error, ls());
    fs.rmSync(root, { recursive: true, force: true });
  }

  console.log(failed ? failed + ' FAILED' : 'all passed');
  process.exit(failed ? 1 : 0);
})();
