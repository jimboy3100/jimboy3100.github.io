# Expanding Land Bot Installer — www.expanding.land
# Usage: paste this in PowerShell:
#   irm https://www.legendmod.ml/ogario/protocols/install-bots.ps1 | iex

$ErrorActionPreference = "Stop"
Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║     Expanding Land — 50 Bot Installer         ║" -ForegroundColor Cyan
Write-Host "  ║     www.expanding.land                        ║" -ForegroundColor Cyan
Write-Host "  ╚═══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check authorization
Write-Host "  Checking authorization..." -ForegroundColor Yellow
try {
    $allowed = (Invoke-WebRequest -Uri "https://www.legendmod.ml/ogario/protocols/botsAllowed.txt" -UseBasicParsing -TimeoutSec 10).Content.Trim()
    if ($allowed -ne "true") {
        Write-Host "  ❌ Bots are not currently allowed. Beta testing may have ended." -ForegroundColor Red
        Write-Host "  Visit www.expanding.land for more information." -ForegroundColor Red
        Read-Host "  Press Enter to exit"
        exit
    }
} catch {
    Write-Host "  ❌ Could not verify authorization. Check your internet connection." -ForegroundColor Red
    Read-Host "  Press Enter to exit"
    exit
}
Write-Host "  ✅ Authorized!" -ForegroundColor Green

# Check if Node.js is installed
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host ""
    Write-Host "  ⚠ Node.js is required but not installed." -ForegroundColor Yellow
    Write-Host "  Installing Node.js automatically..." -ForegroundColor Yellow
    
    $nodeInstaller = "$env:TEMP\node-setup.msi"
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v20.11.0/node-v20.11.0-x64.msi" -OutFile $nodeInstaller -UseBasicParsing
    Start-Process msiexec.exe -ArgumentList "/i `"$nodeInstaller`" /qn" -Wait
    $env:PATH = [Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [Environment]::GetEnvironmentVariable("PATH", "User")
    
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) {
        Write-Host "  ❌ Node.js installation failed. Install manually from https://nodejs.org" -ForegroundColor Red
        Read-Host "  Press Enter to exit"
        exit
    }
    Write-Host "  ✅ Node.js installed!" -ForegroundColor Green
}

# Download bot files
$botDir = "$env:LOCALAPPDATA\ExpandingLand-Bots"
Write-Host ""
Write-Host "  Downloading bot files..." -ForegroundColor Yellow

if (-not (Test-Path $botDir)) { New-Item -Path $botDir -ItemType Directory -Force | Out-Null }

$repo = "https://raw.githubusercontent.com/kyriakidisdimitrios/legendworld/main/bots"
$files = @(
    "index.js", "bot-exe.js", "brain.js", "survival.js", "protocol.js", 
    "world.js", "personality.js", "intelligence.js", "emotions.js",
    "motion.js", "trust.js", "antiteam.js", "social.js", "skins.json",
    "hunting.js", "farming.js", "formation.js", "communication.js",
    "contraction.js", "contraction-zone.js", "labels.js", "package.json"
)

foreach ($f in $files) {
    try {
        Invoke-WebRequest -Uri "$repo/$f" -OutFile "$botDir\$f" -UseBasicParsing -TimeoutSec 15
        Write-Host "    ✓ $f" -ForegroundColor DarkGray
    } catch {
        Write-Host "    ✗ $f (skipped)" -ForegroundColor DarkYellow
    }
}

# Install dependencies
Write-Host ""
Write-Host "  Installing dependencies..." -ForegroundColor Yellow
Push-Location $botDir
npm install --production 2>&1 | Out-Null
Pop-Location
Write-Host "  ✅ Ready!" -ForegroundColor Green

# Run
Write-Host ""
Write-Host "  ╔═══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║  Starting 50 bots on Expanding Land...        ║" -ForegroundColor Green
Write-Host "  ║  Press Ctrl+C to stop.                        ║" -ForegroundColor Green
Write-Host "  ║  Close this window to kill all bots.          ║" -ForegroundColor Green
Write-Host "  ╚═══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

node "$botDir\bot-exe.js"
