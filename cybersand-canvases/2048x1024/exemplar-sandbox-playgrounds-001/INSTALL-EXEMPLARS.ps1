$ErrorActionPreference = 'Stop'
$target = Join-Path $env:APPDATA 'Godot\app_userdata\Cyber Sand Reference Sandbox\workbench'
if (-not $env:APPDATA -or -not (Test-Path (Join-Path $PSScriptRoot 'qualification.json'))) { throw 'Invalid installer environment or incomplete map package.' }
$names = @('copperline-switchyard-trials','tidelock-hydraulic-spillway','bloomglass-ruin-conservatory')
$receipt = Get-Content (Join-Path $PSScriptRoot 'qualification.json') -Raw | ConvertFrom-Json
foreach ($name in $names) {
    $source = Join-Path $PSScriptRoot ('setup-' + $name + '.json')
    if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { throw "Missing map file: $source" }
    $expected = @($receipt.maps | Where-Object slug -eq $name)
    if ($expected.Count -ne 1) { throw "Invalid map qualification manifest for $name" }
    $actual = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actual -ne $expected[0].sha256) { throw "Map was corrupted or modified: $name" }
    $data = Get-Content -LiteralPath $source -Raw | ConvertFrom-Json
    if ($data.version -ne 2 -or $data.extent[0] -ne 2048 -or $data.extent[1] -ne 1024) { throw "Not a recognised Setup-v2 map: $name" }
}
New-Item -ItemType Directory -Force -Path $target | Out-Null
foreach ($name in $names) {
    $source = Join-Path $PSScriptRoot ('setup-' + $name + '.json')
    $destination = Join-Path $target ('setup-' + $name + '.json')
    if (Test-Path -LiteralPath $destination) {
        Write-Warning "Preserving existing map $name (not overwriting)."
        continue
    }
    Copy-Item -LiteralPath $source -Destination $destination -ErrorAction Stop
    Write-Host "Installed: $name"
}
Write-Host "Open CyberSand > Development workbench > type a map name > Load start."
Write-Host "Location: $target"