/* The headless Chromes of the test runs (smoke.js, run.js): end a run's Chrome with all its child
 * processes and remove its profile folder, and prune old run folders under developers/tests/out/.
 * On Windows killing the browser process alone leaves its GPU, network, renderer and crashpad
 * processes running (they keep the profile locked), so the whole tree is ended with taskkill /T.
 * Every Chrome process carries --user-data-dir, which is how a run's processes are found again
 * when the runner that started them was killed.
 * CLI: node developers/tests/lib/testchrome.js prune <days> [outDir]   (default outDir: developers/tests/out; also
 * removes the old temporary profiles of the tests that start their own Chrome) */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const win = process.platform === 'win32';
/* a path as compared with the --user-data-dir of a process (Windows paths ignore case and slash style) */
const norm = p => { const r = path.resolve(String(p || '')).replace(/[\\/]+$/, ''); return win ? r.replace(/\//g, '\\').toLowerCase() : r; };
const dirOf = cmd => { const m = /"--user-data-dir=([^"]*)"|--user-data-dir="([^"]*)"|--user-data-dir=(\S+)/.exec(cmd || ''); return m ? (m[1] || m[2] || m[3]) : ''; };

/* the processes started with a --user-data-dir: [{ pid, ppid, dir, main }] (main: the browser
 * process itself, not one of its --type= children); null when the list could not be read */
function listChromes() {
  let text = '';
  if (win) {
    const r = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      "Get-CimInstance Win32_Process -Filter \"CommandLine LIKE '%--user-data-dir=%'\" | Where-Object { $_.ProcessId -ne $PID } | ForEach-Object { '' + $_.ProcessId + [char]9 + $_.ParentProcessId + [char]9 + $_.CommandLine }"],
      { encoding: 'utf8', timeout: 60000, windowsHide: true });
    if (r.status !== 0 || r.error) return null;
    text = r.stdout || '';
  } else {
    const r = spawnSync('ps', ['-eo', 'pid=,ppid=,args='], { encoding: 'utf8', timeout: 30000 });
    if (r.status !== 0 || r.error) return null;
    text = (r.stdout || '').split('\n').map(l => l.trim().replace(/^(\d+)\s+(\d+)\s+/, '$1\t$2\t')).join('\n');
  }
  const res = [];
  text.split(/\r?\n/).forEach(l => {
    const f = l.split('\t');
    if (f.length < 3) return;
    const cmd = f.slice(2).join('\t'), dir = dirOf(cmd);
    if (!dir || Number(f[0]) === process.pid) return;
    res.push({ pid: Number(f[0]), ppid: Number(f[1]), dir: norm(dir), main: !/\s--type=/.test(cmd) });
  });
  return res;
}

const isAlive = pid => { try { process.kill(pid, 0); return true; } catch (e) { return e.code === 'EPERM'; } };
const pause = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/* ends these processes and their children, and waits (up to 20 s) until they are gone: taskkill
 * returns before a busy machine has ended them, and some children it cannot end at once (they are
 * already exiting), so the ones still alive are ended again */
function killTree(pids) {
  pids = [...new Set([].concat(pids).map(Number).filter(p => p > 0))];
  if (!pids.length) return;
  if (win) {
    const a = ['/T', '/F'];
    pids.forEach(p => a.push('/PID', String(p)));
    const r = spawnSync('taskkill', a, { encoding: 'utf8', timeout: 30000, windowsHide: true });
    /* the processes it found: the first number of each line ("PID 5 (child process of PID 4)"; the
     * second one is the parent, for the browser process this runner itself) */
    ((r.stdout || '') + '\n' + (r.stderr || '')).split(/\r?\n/).forEach(l => { const m = /\d+/.exec(l); if (m) pids.push(Number(m[0])); });
    pids = [...new Set(pids)].filter(p => p > 0 && p !== process.pid && p !== process.ppid);
  } else pids.forEach(p => { try { process.kill(p, 'SIGKILL'); } catch (e) { } });
  for (let i = 0, t0 = Date.now(); Date.now() - t0 < 20000; i++) {
    pids = pids.filter(isAlive);
    if (!pids.length) return;
    pause(250);
    if (win && i % 4 === 3) { const a = ['/F']; pids.forEach(p => a.push('/PID', String(p))); spawnSync('taskkill', a, { stdio: 'ignore', timeout: 30000, windowsHide: true }); }
  }
}

function removeDir(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true, maxRetries: 20, retryDelay: 300 }); } catch (e) { }
  return !fs.existsSync(dir);
}

/* the live processes using this profile (null: the process list could not be read). A process
 * Windows has ended can stay in the list for a few seconds; it is not alive any more. */
function users(profile) {
  const l = listChromes();
  return l && l.filter(c => c.dir === norm(profile) && isAlive(c.pid)).map(c => c.pid);
}
function endUsers(profile) {
  for (let i = 0; i < 3; i++) { const u = users(profile); if (!u || !u.length) return; killTree(u); }
}

/* ends a run's Chrome (opts.pid: its browser process, ended with its children) and removes its
 * profile folder unless opts.keep. After the tree is ended (or with opts.search: the runner was
 * killed, so its Chrome was never ended) any process still using the profile is looked up and
 * ended too: a child started while taskkill ran is not in its tree. Returns true when no folder is
 * left (or it is kept). */
function cleanupProfile(profile, opts) {
  opts = opts || {};
  if (opts.pid) killTree(opts.pid);
  if (opts.pid || (opts.search && fs.existsSync(profile))) endUsers(profile);
  if (opts.keep || removeDir(profile)) return true;
  endUsers(profile);
  return removeDir(profile);
}

/* newest change in a run folder: the folder or one of its direct entries */
function newest(dir) {
  let t = 0;
  try { t = fs.statSync(dir).mtimeMs; } catch (e) { return Date.now(); }
  try { fs.readdirSync(dir).forEach(n => { try { t = Math.max(t, fs.statSync(path.join(dir, n)).mtimeMs); } catch (e) { } }); } catch (e) { }
  return t;
}

/* the test Chromes' own temporary profiles in the system temp folder (fs.mkdtempSync names: the
 * prefix of the test and 6 random characters). The tests that start their own Chrome remove them
 * after proc.kill(), which fails while Chrome's child processes still hold the folder. */
const TEMP_PROFILE = /^lm-(agarloader|bench|cellcolors|cellshadows|ext|extreal|glbatch|lmxupdate|skinbanks|skinqueue|trace|usload)-[A-Za-z0-9]{6}$/;

/* removes the folders of `roots` not changed for `days` days (fractions work: 0.25 = 6 hours).
 * roots: [{ dir, match }] (match: a RegExp the folder name must fit; none: every folder).
 * A folder some live test Chrome uses (its browser process runs and the runner that started it does:
 * a smoke run of this or another agent) is kept, whatever its age; nothing is removed when the
 * process list cannot be read. The Chromes still using an old folder whose runner is gone (it was
 * killed before it could end its Chrome) are ended first; Chromes in newer folders are left alone.
 * opts.list / opts.kill / opts.alive / opts.now replace the process list, killTree, the parent check
 * and the clock (tests). Returns { removed, kept, active, orphans }. */
function pruneDirs(roots, days, opts) {
  opts = opts || {};
  const list = opts.list ? opts.list() : listChromes();
  if (!list) return { removed: [], kept: [], active: 0, orphans: [], error: 'the process list could not be read' };
  const alive = opts.alive || isAlive;
  const sep = win ? '\\' : '/';
  const limit = (opts.now || Date.now()) - Number(days) * 86400000;
  const removed = [], kept = [], orphans = [];
  let active = 0;
  roots.forEach(root => {
    let names = [];
    try { names = fs.readdirSync(root.dir, { withFileTypes: true }).filter(d => d.isDirectory() && (!root.match || root.match.test(d.name))).map(d => d.name); } catch (e) { }
    names.forEach(n => {
      const d = path.join(root.dir, n), nd = norm(d);
      const procs = list.filter(c => c.dir === nd || c.dir.startsWith(nd + sep));
      if (procs.some(c => c.main && alive(c.ppid))) { active++; kept.push(d); return; }
      if (newest(d) >= limit) { kept.push(d); return; }
      if (procs.length) { (opts.kill || killTree)(procs.map(c => c.pid)); orphans.push(...procs.map(c => c.pid)); }
      if (removeDir(d)) removed.push(d); else kept.push(d);
    });
  });
  return { removed, kept, active, orphans };
}

/* the run folders of developers/tests/out (or outRoot) */
function prune(outRoot, days, opts) { return pruneDirs([{ dir: outRoot }], days, opts); }

/* prune of out/ and, with temp, of the test Chromes' temporary profiles; prints what it did
 * (run.js --prune and the CLI) */
function pruneReport(outRoot, days, temp) {
  const roots = [{ dir: outRoot }];
  if (temp) roots.push({ dir: os.tmpdir(), match: TEMP_PROFILE });
  const r = pruneDirs(roots, days);
  if (r.error) return 'prune: skipped, ' + r.error;
  return 'prune: removed ' + r.removed.length + ' folders not changed for ' + days + ' days (' + roots.map(x => x.dir).join(', ') + '), kept ' + r.kept.length +
    (r.active ? ' (' + r.active + ' in use by a running test)' : '') + (r.orphans.length ? ', ended ' + r.orphans.length + ' Chrome processes left by killed runs' : '');
}

module.exports = { listChromes, users, killTree, cleanupProfile, prune, pruneDirs, pruneReport, norm, TEMP_PROFILE };

if (require.main === module) {
  const a = process.argv.slice(2);
  if (a[0] !== 'prune' || a[1] === undefined || !(Number(a[1]) >= 0)) { console.log('usage: node developers/tests/lib/testchrome.js prune <days> [outDir]   (also removes old temporary test Chrome profiles)'); process.exit(1); }
  console.log(pruneReport(a[2] || path.join(__dirname, '..', 'out'), Number(a[1]), true));
}
