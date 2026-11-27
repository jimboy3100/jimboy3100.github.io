# skin-registry.ps1 - shared by download_vanilla_skins.ps1 and download_missing_skins.ps1 (dot-sourced).
# The skin registry (ogario/skinregistry.js, built by developers/skins/build-registry.js from file
# hashes) says which file names are copies of another file. The download scripts use it so they
# never bring back a copy that was removed: a name the registry resolves is present, a download
# with the same bytes as a file already here is not kept (its name is recorded as an alias instead),
# and every new picture goes to vanillaskins/ (the folder the game reads; no vanillaskins2, 3, ...).
# File names are compared case-sensitively, as on the hosting.

function New-OrdinalTable { return New-Object System.Collections.Hashtable ([System.StringComparer]::Ordinal) }

function Read-SkinRegistry([string]$RepoRoot) {
    $reg = @{ Alias = (New-OrdinalTable); Lowres = (New-OrdinalTable) }
    $file = Join-Path $RepoRoot "ogario\skinregistry.js"
    if (-not (Test-Path $file)) { return $reg }
    $txt = [System.IO.File]::ReadAllText($file)
    $start = $txt.IndexOf('})(')
    $end = $txt.LastIndexOf(');')
    if ($start -lt 0 -or $end -le $start) { return $reg }
    $data = $txt.Substring($start + 3, $end - $start - 3) | ConvertFrom-Json
    foreach ($p in $data.a.PSObject.Properties) { $reg.Alias[$p.Name] = $p.Value }
    foreach ($n in ($data.lr -split '\|')) { if ($n) { $reg.Lowres[$n] = 1 } }
    return $reg
}

# git blob sha-1 of a file (the hash the registry is built from)
function Get-SkinBlobSha([string]$File) {
    $bytes = [System.IO.File]::ReadAllBytes($File)
    $head = [System.Text.Encoding]::ASCII.GetBytes("blob $($bytes.Length)`0")
    $all = New-Object byte[] ($head.Length + $bytes.Length)
    [Array]::Copy($head, $all, $head.Length)
    [Array]::Copy($bytes, 0, $all, $head.Length, $bytes.Length)
    $sha = [System.Security.Cryptography.SHA1]::Create()
    return (($sha.ComputeHash($all) | ForEach-Object { $_.ToString('x2') }) -join '')
}

# names in vanillaskins/ (exact and lower-case) and every skin file by size, for the duplicate check
function Get-SkinState([string]$RepoRoot) {
    $state = @{ Names = (New-OrdinalTable); Lower = @{}; BySize = @{} }
    foreach ($dir in @("vanillaskins", "lowresskins", "agario\live\flags")) {
        $dirPath = Join-Path $RepoRoot $dir
        if (-not (Test-Path $dirPath)) { continue }
        foreach ($f in (Get-ChildItem -Path $dirPath -File)) {
            $rel = ($dir -replace '\\', '/') + "/" + $f.Name
            if ($dir -eq "vanillaskins") { $state.Names[$f.Name] = 1; $state.Lower[$f.Name.ToLowerInvariant()] = $f.Name }
            if (-not $state.BySize.ContainsKey($f.Length)) { $state.BySize[$f.Length] = New-Object System.Collections.ArrayList }
            [void]$state.BySize[$f.Length].Add($rel)
        }
    }
    return $state
}

# why vanillaskins/<file> needs no download ('' when it does)
function Test-SkinPresent($State, $Registry, [string]$File) {
    if ($State.Names.ContainsKey($File)) { return "exists" }
    if ($Registry.Alias.ContainsKey("vanillaskins/$File")) { return "copy of $($Registry.Alias["vanillaskins/$File"])" }
    $other = $State.Lower[$File.ToLowerInvariant()]
    if ($other) { return "differs only in case from vanillaskins/$other (cannot be kept side by side on Windows)" }
    return ""
}

# after a download: same bytes as a file already here? Then it is not kept; its name is recorded
# as an alias of that file (developers/audit/manifest.json) and the registry is rebuilt later.
function Test-SkinDuplicate($State, [string]$RepoRoot, [string]$Rel, [string]$Dest) {
    $len = (Get-Item $Dest).Length
    if (-not $State.BySize.ContainsKey($len)) { return "" }
    $sha = Get-SkinBlobSha $Dest
    foreach ($cand in $State.BySize[$len]) {
        if ($cand -eq $Rel) { continue }
        if ((Get-SkinBlobSha (Join-Path $RepoRoot $cand)) -eq $sha) {
            Remove-Item $Dest -Force
            & node (Join-Path $RepoRoot "developers\skins\build-registry.js") --alias "$Rel=$cand@$sha" | Out-Null
            return $cand
        }
    }
    return ""
}

# a file kept: known to the duplicate check of the next downloads
function Add-SkinState($State, [string]$Rel, [string]$Dest) {
    $len = (Get-Item $Dest).Length
    if (-not $State.BySize.ContainsKey($len)) { $State.BySize[$len] = New-Object System.Collections.ArrayList }
    [void]$State.BySize[$len].Add($Rel)
    $name = Split-Path $Rel -Leaf
    $State.Names[$name] = 1
    $State.Lower[$name.ToLowerInvariant()] = $name
}

function Update-SkinRegistry([string]$RepoRoot) {
    Write-Host "`n  Rebuilding the skin registry (ogario/skinregistry.js) and the duplicate records..." -ForegroundColor Gray
    & node (Join-Path $RepoRoot "developers\skins\build-registry.js") --manifest
}
