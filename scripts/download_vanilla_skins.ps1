# download_vanilla_skins.ps1
# Downloads ALL vanilla agar.io skins from the Miniclip CDN
# Usage: .\download_vanilla_skins.ps1 [-ConfigId 10912]
# New pictures go to vanillaskins/; names the skin registry resolves (copies) are not downloaded again.

param(
    [string]$ConfigId = "",
    [string]$RepoRoot = "c:\Github_repos\jimboy3100.github.io"
)

$ErrorActionPreference = "Continue"
$outPath = Join-Path $RepoRoot "vanillaskins"
if (-not (Test-Path $outPath)) {
    New-Item -ItemType Directory -Path $outPath -Force | Out-Null
}

Write-Host "`n=== Vanilla Skin Downloader ===" -ForegroundColor Cyan

# Step 1: Find the latest config ID
if (-not $ConfigId) {
    Write-Host "`n[1/4] Finding latest config ID..." -ForegroundColor Yellow
    foreach ($tryId in @("10912", "10920", "10930", "10890", "10880")) {
        try {
            $testUrl = "https://configs-web.agario.miniclippt.com/live/v15/$tryId/GameConfiguration.json"
            $testResp = Invoke-WebRequest -Uri $testUrl -Method Head -TimeoutSec 5 -Headers @{
                "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
            if ($testResp.StatusCode -eq 200) {
                $ConfigId = $tryId
                Write-Host "  Found working config ID: $ConfigId" -ForegroundColor Green
                break
            }
        } catch {
            # Try next
        }
    }
}

if (-not $ConfigId) {
    Write-Host "  ERROR: Could not determine config ID. Use -ConfigId parameter." -ForegroundColor Red
    exit 1
}

$cdnBase = "https://configs-web.agario.miniclippt.com/live/v15/$ConfigId/"

# Step 2: Fetch game configuration
Write-Host "`n[2/4] Fetching GameConfiguration.json..." -ForegroundColor Yellow
$configUrl = "${cdnBase}GameConfiguration.json"
try {
    $headers = @{
        "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    $config = Invoke-RestMethod -Uri $configUrl -Headers $headers -TimeoutSec 30
    Write-Host "  Config fetched successfully" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Failed to fetch config: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  URL: $configUrl" -ForegroundColor Gray
    exit 1
}

# Step 3: Extract all skin filenames
Write-Host "`n[3/4] Extracting skin filenames..." -ForegroundColor Yellow

$skinFiles = @{}  # filename -> source

# Equippable Skins
$equippable = $config.gameConfig.'Gameplay - Equippable Skins'
if ($equippable) {
    foreach ($skin in $equippable) {
        if ($skin.image -and $skin.image -ne "uses_spine") {
            $skinFiles[$skin.image] = "equippable:$($skin.productId)"
        }
    }
    Write-Host "  Equippable skins: $($equippable.Count) entries" -ForegroundColor Gray
}

# Free Skins
$free = $config.gameConfig.'Gameplay - Free Skins'
if ($free) {
    foreach ($skin in $free) {
        if ($skin.image) {
            $skinFiles[$skin.image] = "free:$($skin.id)"
        }
    }
    Write-Host "  Free skins: $($free.Count) entries" -ForegroundColor Gray
}

# Spine Skins (animated skins that have PNG atlases)
$spine = $config.gameConfig.'Visual - Prod. Spine Animations'
if ($spine) {
    foreach ($skin in $spine) {
        if ($skin.spineFileName -and $skin.spineFileName -ne "SkinEffects") {
            $pngFile = "$($skin.spineFileName).png"
            $skinFiles[$pngFile] = "spine:$($skin.productId)"
        }
    }
    Write-Host "  Spine skins: $($spine.Count) entries" -ForegroundColor Gray
}

# Deduplicate and report
$uniqueFiles = $skinFiles.Keys | Sort-Object -Unique
Write-Host "  Total unique skin files: $($uniqueFiles.Count)" -ForegroundColor Green

# Check what we already have: vanillaskins/ (the folder the game reads) and the names the skin
# registry resolves to another file (copies that were removed must not come back)
. (Join-Path $RepoRoot "scripts\skin-registry.ps1")
$registry = Read-SkinRegistry $RepoRoot
$state = Get-SkinState $RepoRoot
$targetDir = Join-Path $RepoRoot "vanillaskins"
Write-Host "  vanillaskins/: $($state.Names.Count) files, registry aliases: $($registry.Alias.Count)" -ForegroundColor Gray

# Step 4: Download missing skins
Write-Host "`n[4/4] Downloading skins into vanillaskins/..." -ForegroundColor Yellow

$downloaded = 0
$failed = 0
$skipped = 0
$copies = 0
$total = $uniqueFiles.Count

$counter = 0
foreach ($file in $uniqueFiles) {
    $counter++

    # Skip if already here (or a copy of a file that is here)
    $why = Test-SkinPresent $state $registry $file
    if ($why) {
        if ($why -ne "exists") { Write-Host "  skip $file ($why)" -ForegroundColor DarkGray }
        $skipped++
        continue
    }

    $destFile = Join-Path $targetDir $file
    $skinUrl = "${cdnBase}${file}?"
    $pct = [math]::Round(($counter / $total) * 100)
    Write-Host "  [$counter/$total] ($pct%) vanillaskins/$file... " -NoNewline

    try {
        $headers = @{
            "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        Invoke-WebRequest -Uri $skinUrl -OutFile $destFile -Headers $headers -TimeoutSec 15

        # Verify it's actually a PNG (not an error page)
        $bytes = [System.IO.File]::ReadAllBytes($destFile)
        if ($bytes.Length -lt 100 -or $bytes[0] -ne 0x89 -or $bytes[1] -ne 0x50) {
            Remove-Item $destFile -Force
            Write-Host "INVALID (not PNG)" -ForegroundColor Red
            $failed++
        } else {
            $same = Test-SkinDuplicate $state $RepoRoot "vanillaskins/$file" $destFile
            if ($same) {
                Write-Host "same picture as $same (not kept, recorded as an alias)" -ForegroundColor Yellow
                $copies++
            } else {
                $sizeKB = [math]::Round($bytes.Length / 1024, 1)
                Write-Host "OK (${sizeKB}KB)" -ForegroundColor Green
                $downloaded++
                Add-SkinState $state "vanillaskins/$file" $destFile
            }
        }
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        if (Test-Path $destFile) { Remove-Item $destFile -Force }
        $failed++
    }

    # Brief pause to avoid rate limiting
    Start-Sleep -Milliseconds 100
}

# Summary
Write-Host "`n=== Download Summary ===" -ForegroundColor Cyan
Write-Host "  Downloaded: $downloaded" -ForegroundColor Green
Write-Host "  Skipped (already here): $skipped" -ForegroundColor Gray
Write-Host "  Same picture as a file already here (not kept): $copies" -ForegroundColor Gray
Write-Host "  Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Gray" })

if ($downloaded -gt 0 -or $copies -gt 0) {
    Update-SkinRegistry $RepoRoot
    Write-Host "`n  Next: cd $RepoRoot ; git add vanillaskins ogario/skinregistry.js developers/audit/manifest.json ; git commit -m 'add $downloaded vanilla skins' ; git push" -ForegroundColor Yellow
}
