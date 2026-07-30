# download_missing_skins.ps1 - Downloads ALL missing skins (accepts any image format)
param(
    [string]$RepoRoot = "C:\Github_repos\jimboy3100.github.io",
    [string]$ConfigId = "10912",
    [int]$MaxPerFolder = 999
)

$cdnBase = "https://configs-web.agario.miniclippt.com/live/v15/$ConfigId/"
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }

Write-Host "`n=== Downloading ALL missing skins (any format) ===" -ForegroundColor Cyan

# Fetch config
Write-Host "Fetching GameConfiguration.json..." -ForegroundColor Yellow
$config = Invoke-RestMethod -Uri ($cdnBase + "GameConfiguration.json") -Headers $headers -TimeoutSec 30

# Extract skin filenames
$skinFiles = @{}
foreach ($s in $config.gameConfig.'Gameplay - Equippable Skins') {
    if ($s.image -and $s.image -ne "uses_spine") { $skinFiles[$s.image] = 1 }
}
foreach ($s in $config.gameConfig.'Gameplay - Free Skins') {
    if ($s.image) { $skinFiles[$s.image] = 1 }
}
foreach ($s in $config.gameConfig.'Visual - Prod. Spine Animations') {
    if ($s.spineFileName -and $s.spineFileName -ne "SkinEffects") {
        $skinFiles[$s.spineFileName + ".png"] = 1
    }
}
Write-Host "Total skins in config: $($skinFiles.Count)" -ForegroundColor Gray

# Find existing files across all folders
$existing = @{}
for ($n = 1; $n -le 20; $n++) {
    $dirName = if ($n -eq 1) { "vanillaskins" } else { "vanillaskins$n" }
    $dirPath = Join-Path $RepoRoot $dirName
    if (Test-Path $dirPath) {
        foreach ($f in (Get-ChildItem $dirPath -Filter "*.png" -ErrorAction SilentlyContinue)) {
            $existing[$f.Name] = $dirPath
        }
    }
}
$lrPath = Join-Path $RepoRoot "lowresskins"
if (Test-Path $lrPath) {
    foreach ($f in (Get-ChildItem $lrPath -Filter "*.png" -ErrorAction SilentlyContinue)) {
        $existing[$f.Name] = $lrPath
    }
}

$missing = $skinFiles.Keys | Where-Object { -not $existing.ContainsKey($_) } | Sort-Object
Write-Host "Already have: $($existing.Count)" -ForegroundColor Gray
Write-Host "Missing: $($missing.Count)" -ForegroundColor Yellow

if ($missing.Count -eq 0) {
    Write-Host "Nothing to download!" -ForegroundColor Green
    exit 0
}

# Track folder counts
$folderCounts = @{}
function Get-NextFolder {
    for ($n = 1; $n -le 20; $n++) {
        $dirName = if ($n -eq 1) { "vanillaskins" } else { "vanillaskins$n" }
        $dirPath = Join-Path $RepoRoot $dirName
        if (-not $folderCounts.ContainsKey($dirName)) {
            if (Test-Path $dirPath) {
                $folderCounts[$dirName] = (Get-ChildItem $dirPath -Filter "*.png" -ErrorAction SilentlyContinue).Count
            } else {
                $folderCounts[$dirName] = 0
            }
        }
        if ($folderCounts[$dirName] -lt $MaxPerFolder) {
            if (-not (Test-Path $dirPath)) {
                New-Item -ItemType Directory -Path $dirPath -Force | Out-Null
                Write-Host "  Created: $dirName/" -ForegroundColor Cyan
            }
            return @{ Path = $dirPath; Name = $dirName }
        }
    }
    return $null
}

# Download
$dl = 0; $fail = 0; $i = 0
foreach ($file in $missing) {
    $i++
    $target = Get-NextFolder
    if (-not $target) { Write-Host "All folders full!" -ForegroundColor Red; break }

    $dest = Join-Path $target.Path $file
    Write-Host "  [$i/$($missing.Count)] $($target.Name)/$file... " -NoNewline

    try {
        Invoke-WebRequest -Uri ($cdnBase + $file + "?") -OutFile $dest -Headers $headers -TimeoutSec 15
        $sz = (Get-Item $dest).Length
        if ($sz -lt 50) {
            Remove-Item $dest -Force
            Write-Host "TOO SMALL ($sz bytes)" -ForegroundColor Red
            $fail++
        } else {
            $sizeKB = [math]::Round($sz / 1024, 1)
            Write-Host "OK (${sizeKB}KB)" -ForegroundColor Green
            $dl++
            $folderCounts[$target.Name]++
        }
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        if (Test-Path $dest) { Remove-Item $dest -Force }
        $fail++
    }
    Start-Sleep -Milliseconds 50
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
Write-Host "  Downloaded: $dl" -ForegroundColor Green
Write-Host "  Failed: $fail" -ForegroundColor $(if ($fail -gt 0) { "Red" } else { "Gray" })

for ($n = 1; $n -le 20; $n++) {
    $dirName = if ($n -eq 1) { "vanillaskins" } else { "vanillaskins$n" }
    $dirPath = Join-Path $RepoRoot $dirName
    if (Test-Path $dirPath) {
        $cnt = (Get-ChildItem $dirPath -Filter "*.png" -ErrorAction SilentlyContinue).Count
        Write-Host "  $dirName/: $cnt files" -ForegroundColor Green
    }
}
