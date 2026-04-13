Param(
  [string]$SourcePath
)

if (-not $SourcePath) {
  $default = Join-Path -Path $PSScriptRoot -ChildPath "..\hero.jpg"
  $SourcePath = Resolve-Path -LiteralPath $default -ErrorAction SilentlyContinue
  if (-not $SourcePath) {
    Write-Error "No source path provided and default 'gmu/hero.jpg' not found. Provide -SourcePath or place the image at 'gmu/hero.jpg'."
    exit 1
  }
}

$sourceFull = Resolve-Path -LiteralPath $SourcePath -ErrorAction Stop
$publicDir = Join-Path -Path $PSScriptRoot -ChildPath "..\public"
if (-not (Test-Path -Path $publicDir)) {
  New-Item -ItemType Directory -Path $publicDir | Out-Null
}
$dest = Join-Path -Path $publicDir -ChildPath "background.jpg"
Copy-Item -Path $sourceFull -Destination $dest -Force
Write-Output "Copied '$($sourceFull)' to 'gmu/public/background.jpg'"
