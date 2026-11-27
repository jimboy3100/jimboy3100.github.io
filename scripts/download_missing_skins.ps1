# download_missing_skins.ps1 - Downloads ALL missing skins (accepts any image format)
param(
    [string]$RepoRoot = "C:\Github_repos\jimboy3100.github.io",
    [string]$ConfigId = "10912"
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

# What is already here: vanillaskins/ (the folder the game reads) and the names the skin registry
# resolves to another file (copies that were removed must not come back)
. (Join-Path $RepoRoot "scripts\skin-registry.ps1")
$registry = Read-SkinRegistry $RepoRoot
$state = Get-SkinState $RepoRoot
$targetDir = Join-Path $RepoRoot "vanillaskins"

$missing = $skinFiles.Keys | Where-Object { -not (Test-SkinPresent $state $registry $_) } | Sort-Object
Write-Host "Already have: $($state.Names.Count)" -ForegroundColor Gray
Write-Host "Missing: $($missing.Count)" -ForegroundColor Yellow

if ($missing.Count -eq 0) {
    Write-Host "Nothing to download!" -ForegroundColor Green
    exit 0
}

# Download (into vanillaskins/ only)
$dl = 0; $fail = 0; $copies = 0; $i = 0
foreach ($file in $missing) {
    $i++
    $dest = Join-Path $targetDir $file
    Write-Host "  [$i/$($missing.Count)] vanillaskins/$file... " -NoNewline

    try {
        Invoke-WebRequest -Uri ($cdnBase + $file + "?") -OutFile $dest -Headers $headers -TimeoutSec 15
        $sz = (Get-Item $dest).Length
        if ($sz -lt 50) {
            Remove-Item $dest -Force
            Write-Host "TOO SMALL ($sz bytes)" -ForegroundColor Red
            $fail++
        } else {
            $same = Test-SkinDuplicate $state $RepoRoot "vanillaskins/$file" $dest
            if ($same) {
                Write-Host "same picture as $same (not kept, recorded as an alias)" -ForegroundColor Yellow
                $copies++
            } else {
                $sizeKB = [math]::Round($sz / 1024, 1)
                Write-Host "OK (${sizeKB}KB)" -ForegroundColor Green
                $dl++
                Add-SkinState $state "vanillaskins/$file" $dest
            }
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
Write-Host "  Same picture as a file already here (not kept): $copies" -ForegroundColor Gray
Write-Host "  Failed: $fail" -ForegroundColor $(if ($fail -gt 0) { "Red" } else { "Gray" })
if ($dl -gt 0 -or $copies -gt 0) { Update-SkinRegistry $RepoRoot }
