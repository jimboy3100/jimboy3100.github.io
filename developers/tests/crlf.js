// Normalize modified files back to the line ending their HEAD version uses.
// Usage: node crlf.js <repoDir>
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const repo = process.argv[2];
const changed = execSync('git -c core.quotepath=off diff --name-only', { cwd: repo }).toString().split('\n').filter(Boolean);
const TEXT = /.(js|html|htm|css|json|md|txt|xml|svg)$/i;
for (const rel of changed) {
  if (!TEXT.test(rel)) continue; // never touch binary files
  const file = path.join(repo, rel);
  if (!fs.existsSync(file)) continue;
  let head;
  try { head = execSync('git show HEAD:"' + rel + '"', { cwd: repo, maxBuffer: 64 * 1024 * 1024 }); } catch (e) { continue; }
  const hs = head.toString('latin1');
  const headCrlf = (hs.match(/\r\n/g) || []).length;
  const headLf = (hs.match(/\n/g) || []).length;
  if (!headLf) continue;
  const wantCrlf = headCrlf / headLf > 0.9;
  const buf = fs.readFileSync(file).toString('latin1');
  const out = wantCrlf ? buf.replace(/\r?\n/g, '\r\n') : buf.replace(/\r\n/g, '\n');
  if (out !== buf) { fs.writeFileSync(file, Buffer.from(out, 'latin1')); console.log('normalized', rel, wantCrlf ? 'CRLF' : 'LF'); }
}
