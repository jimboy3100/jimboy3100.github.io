# verify_skins.ps1 - Check for missing skins
$RepoRoot = "C:\Github_repos\jimboy3000.github.io"
$cdnBase = "https://configs-web.agario.miniclippt.com/live/v15/10912/"
$headers = @{ "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
$config = Invoke-RestMethod -Uri ($cdnBase + "GameConfiguration.json") -Headers $headers -TimeoutSec 30

$skinFiles = @{}
foreach ($s in $config.gameConfig.'Gameplay - Equippable Skins') {
    if ($s.image -and $s.image -ne "uses_spine") { $skinFiles[$s.image] = "equippable" }
}
foreach ($s in $config.gameConfig.'Gameplay - Free Skins') {
    if ($s.image) { $skinFiles[$s.image] = "free" }
}
foreach ($s in $config.gameConfig.'Visual - Prod. Spine Animations') {
    if ($s.spineFileName -and $s.spineFileName -ne "SkinEffects") {
        $skinFiles[$s.spineFileName + ".png"] = "spine"
    }
}

$onDisk = @{}
Get-ChildItem $RepoRoot -Directory -Filter "vanillaskins*" | ForEach-Object {
    Get-ChildItem $_.FullName -Filter "*.png" | ForEach-Object { $onDisk[$_.Name] = $_.Directory.Name }
}
$lrPath = Join-Path $RepoRoot "lowresskins"
if (Test-Path $lrPath) {
    Get-ChildItem $lrPath -Filter "*.png" | ForEach-Object { $onDisk[$_.Name] = "lowresskins" }
}

$missing = $skinFiles.Keys | Where-Object { -not $onDisk.ContainsKey($_) } | Sort-Object
Write-Host "Config total: $($skinFiles.Count)"
Write-Host "On disk total: $($onDisk.Count)"
Write-Host "Missing: $($missing.Count)"
if ($missing.Count -gt 0) {
    foreach ($m in $missing) { Write-Host "  MISSING: $m ($($skinFiles[$m]))" -ForegroundColor Red }
}

$extra = ($onDisk.Keys | Where-Object { -not $skinFiles.ContainsKey($_) }).Count
Write-Host "Extra on disk (not in config): $extra"
