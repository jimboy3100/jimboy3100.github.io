/* The skin download scripts (scripts/download_vanilla_skins.ps1, download_missing_skins.ps1) never
 * bring back a copy: their shared helpers (scripts/skin-registry.ps1) run here in PowerShell on a
 * scratch folder with the real registry. A name the registry resolves to another file is present,
 * a name that differs only in case from a file is not downloaded beside it, a download with the
 * same bytes as a file already here is not kept and is recorded as an alias (manifest record that
 * keeps the name resolvable), and both scripts write only to vanillaskins/ (no vanillaskins2..N).
 * Skipped when PowerShell is not installed.
 * node developers/tests/skindownload.js */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const ROOT = path.join(__dirname, '..', '..');
let failed = 0;
const check = (name, ok, info) => { console.log((ok ? 'ok   ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  [' + info + ']')); if (!ok) failed++; };

const ps = ['pwsh', 'powershell'].find((exe) => { try { return cp.spawnSync(exe, ['-NoProfile', '-Command', '1'], { encoding: 'utf8' }).status === 0; } catch (e) { return false; } });
if (!ps) { console.log('skipped: PowerShell not found'); process.exit(0); }

for (const f of ['download_vanilla_skins.ps1', 'download_missing_skins.ps1']) {
    const s = fs.readFileSync(path.join(ROOT, 'scripts', f), 'utf8');
    check(f + ': no numbered vanillaskins folders, uses the registry helpers', !/vanillaskins\$n|MaxPerFolder|MAX_PER_FOLDER/.test(s) && /skin-registry\.ps1/.test(s) && /Test-SkinPresent/.test(s) && /Test-SkinDuplicate/.test(s));
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lm-skindl-'));
try {
    const mk = (rel, buf) => { const f = path.join(tmp, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf); };
    mk('ogario/skinregistry.js', fs.readFileSync(path.join(ROOT, 'ogario', 'skinregistry.js')));
    mk('developers/skins/build-registry.js', fs.readFileSync(path.join(ROOT, 'developers', 'skins', 'build-registry.js')));
    mk('developers/skins/mirror-jimboy3000.txt', '# empty\n');
    mk('scripts/skin-registry.ps1', fs.readFileSync(path.join(ROOT, 'scripts', 'skin-registry.ps1')));
    const pic = fs.readFileSync(path.join(ROOT, 'lowresskins', '1up-custom-skin.png'));
    mk('vanillaskins/Mistik.png', fs.readFileSync(path.join(ROOT, 'vanillaskins', 'Mistik.png')));
    mk('lowresskins/1up-custom-skin.png', pic);
    mk('vanillaskins/brand_new.png', pic);                 /* "downloaded": same bytes as the lowres file */
    mk('vanillaskins/another_new.png', Buffer.concat([pic, Buffer.from([0])]));   /* a new picture */
    const script = [
        '$ErrorActionPreference = "Stop"',
        '$RepoRoot = "' + tmp.replace(/\\/g, '\\\\') + '"',
        '. (Join-Path $RepoRoot "scripts\\skin-registry.ps1")',
        '$reg = Read-SkinRegistry $RepoRoot',
        '$st = Get-SkinState $RepoRoot',
        '$st.Names.Remove("brand_new.png"); $st.Names.Remove("another_new.png")',
        '$out = [ordered]@{}',
        '$out.aliases = $reg.Alias.Count',
        '$out.lowres = $reg.Lowres.Count',
        '$out.variant = Test-SkinPresent $st $reg "fungi_warlord_.png"',
        '$out.space = Test-SkinPresent $st $reg "fungi_warlord .png"',
        '$out.exists = Test-SkinPresent $st $reg "Mistik.png"',
        '$out.case = Test-SkinPresent $st $reg "mistik.png"',
        '$out.fresh = Test-SkinPresent $st $reg "not_here_yet.png"',
        '$out.dup = Test-SkinDuplicate $st $RepoRoot "vanillaskins/brand_new.png" (Join-Path $RepoRoot "vanillaskins\\brand_new.png")',
        '$out.dupGone = -not (Test-Path (Join-Path $RepoRoot "vanillaskins\\brand_new.png"))',
        '$out.newPic = Test-SkinDuplicate $st $RepoRoot "vanillaskins/another_new.png" (Join-Path $RepoRoot "vanillaskins\\another_new.png")',
        '$out.newKept = Test-Path (Join-Path $RepoRoot "vanillaskins\\another_new.png")',
        '$out.sha = Get-SkinBlobSha (Join-Path $RepoRoot "lowresskins\\1up-custom-skin.png")',
        '$out | ConvertTo-Json -Compress'
    ].join('\n');
    const sf = path.join(tmp, 't.ps1');
    fs.writeFileSync(sf, script);
    const r = cp.spawnSync(ps, ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', sf], { encoding: 'utf8', timeout: 240000 });
    let o = {};
    try { o = JSON.parse((r.stdout || '').trim().split(/\r?\n/).pop()); } catch (e) { console.log(r.stdout, r.stderr); }
    const reg = (() => { const w = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'ogario', 'skinregistry.js'), 'utf8'))(w); return w.LMSkinRegistry; })();
    check('PowerShell reads the registry (aliases, own lowres pictures)', o.aliases === Object.keys(reg.a).length && o.lowres === reg.lr.split('|').length, JSON.stringify(o));
    check('fungi_warlord_.png and "fungi_warlord .png" (copies) are present: not downloaded again', /^copy of vanillaskins\/fungi_warlord\.png$/.test(o.variant) && /^copy of /.test(o.space));
    check('Mistik.png present; mistik.png (other case) not downloaded beside it', o.exists === 'exists' && /differs only in case/.test(o.case || ''));
    check('a new name is downloaded', o.fresh === '');
    check('a download with the bytes of lowresskins/1up-custom-skin.png is not kept', o.dup === 'lowresskins/1up-custom-skin.png' && o.dupGone === true);
    check('a new picture is kept', o.newPic === '' && o.newKept === true);
    const blob = (b) => require('crypto').createHash('sha1').update('blob ' + b.length + '\0').update(b).digest('hex');
    check('PowerShell blob hash = git blob sha-1', o.sha === blob(pic));
    let rec = null;
    try { rec = JSON.parse(fs.readFileSync(path.join(tmp, 'developers', 'audit', 'manifest.json'), 'utf8')).records.find((x) => x.oldPath === 'vanillaskins/brand_new.png'); } catch (e) { }
    check('the copy is recorded: alias of the file it equals, approved for deletion (never published)', rec && rec.canonicalPath === 'lowresskins/1up-custom-skin.png' && rec.legacyResolverSupported && rec.approvedForDeletion === true && rec.evidence === 'skin-download-copy', JSON.stringify(rec));
    /* the next registry build keeps the removed name resolvable */
    const gen = require(path.join(tmp, 'developers', 'skins', 'build-registry.js'));
    const res = gen.build();
    check('the next registry build maps the name that was not kept to the file it equals', res.data.a['vanillaskins/brand_new.png'] === 'lowresskins/1up-custom-skin.png');
} finally {
    fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? failed + ' FAILED' : 'skin download scripts ok');
process.exit(failed ? 1 : 0);
