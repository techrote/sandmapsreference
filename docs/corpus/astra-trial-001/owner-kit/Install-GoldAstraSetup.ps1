#requires -version 5.1
<#
.SYNOPSIS
Stages one SHA-pinned Setup-v2 from a completed GOLD-ASTRA-001 bundle.
.DESCRIPTION
Reads only the manifest, selected Setup and optional runtime files. The sole
write is a new setup-gold-astra-001-*.json in the explicitly supplied existing
Workbench directory. It never overwrites, launches Godot, plays, saves a live
world, modifies engine files or grants acceptance.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$ManifestPath,

    [Parameter(Mandatory = $true)]
    [ValidateSet('C1', 'C2', 'C3', 'B1', 'B2', 'B3', 'D1', 'D2')]
    [string]$Arm,

    [Parameter(Mandatory = $true)]
    [ValidateSet('original', 'candidate', 'reference')]
    [string]$Variant,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$WorkbenchDir,

    [string]$Label,
    [string]$EngineRoot,
    [string]$GodotExe,
    [switch]$ValidateOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$acceptedEngineHead = '662df51cd8409a52332fa7ef15d06d8ab8945aed'
$maximumSetupBytes = 1048576
$knownWindowsBinaries = @(
    @{
        path = 'godot/addons/cybersand_native/bin/cybersand_native.windows.x86_64.dll'
        sha256 = '668f2dd094fca611a97c2b6aa38c4cd072179fe9cf591e53578ef57c7db1625e'
        bytes = 5820416
    },
    @{
        path = 'godot/addons/godot-rapier2d/bin/libgodot_rapier.windows.x86_64-pc-windows-msvc.dll'
        sha256 = 'b54e54bd1a03ae9094b788bf869212b5405b4a04793792d5a7cd81632cb10dd7'
        bytes = 9987072
    }
)
$knownGodotExecutables = @(
    @{
        file_name = 'Godot_v4.7-stable_win64.exe'
        sha256 = 'b2ca888d5115a6cedee564764a2ee494a625f2ec2edbabd010fe33c9a88a6bf8'
    },
    @{
        file_name = 'Godot_v4.7-stable_win64_console.exe'
        sha256 = 'd8055fb8c7e7f5010d7439ec69be051554055dae55a265f8647bd7301c34161c'
    }
)

function Get-RequiredProperty {
    param([object]$Object, [string]$Name, [string]$Context)
    if ($null -eq $Object) { throw "$Context is missing." }
    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property -or $null -eq $property.Value) {
        throw "$Context.$Name is required. Complete the final bundle manifest first."
    }
    return $property.Value
}

function Assert-NoReparseAncestors {
    param([string]$ExistingPath)
    $cursor = Get-Item -LiteralPath $ExistingPath -Force
    if ($cursor.PSProvider.Name -ne 'FileSystem') {
        throw 'Only ordinary filesystem paths are supported.'
    }
    while ($null -ne $cursor) {
        if (($cursor.Attributes -band [System.IO.FileAttributes]::ReparsePoint) -ne 0) {
            throw "Symlink/junction/reparse paths are refused: $($cursor.FullName)"
        }
        if ($cursor -is [System.IO.FileInfo]) {
            $cursor = $cursor.Directory
        } elseif ($cursor -is [System.IO.DirectoryInfo]) {
            $cursor = $cursor.Parent
        } else {
            throw 'Only ordinary files and directories are supported.'
        }
    }
}

function Resolve-OrdinaryFile {
    param([string]$Path)
    $item = Get-Item -LiteralPath $Path -Force
    if ($item.PSProvider.Name -ne 'FileSystem' -or $item.PSIsContainer) {
        throw "Expected an ordinary file: $Path"
    }
    Assert-NoReparseAncestors -ExistingPath $item.FullName
    return $item.FullName
}

function Resolve-OrdinaryDirectory {
    param([string]$Path)
    $item = Get-Item -LiteralPath $Path -Force
    if ($item.PSProvider.Name -ne 'FileSystem' -or -not $item.PSIsContainer) {
        throw "Expected an existing ordinary directory: $Path"
    }
    Assert-NoReparseAncestors -ExistingPath $item.FullName
    return $item.FullName
}

function Resolve-BundleFile {
    param([string]$Root, [string]$RelativePath)
    if ([string]::IsNullOrWhiteSpace($RelativePath) -or
        [System.IO.Path]::IsPathRooted($RelativePath) -or
        $RelativePath -match '[:\x00-\x1f*?\[\]]') {
        throw 'Bundle paths must be ordinary relative paths without drive, stream or wildcard syntax.'
    }
    $parts = @($RelativePath -split '[/\\]')
    foreach ($part in $parts) {
        if ([string]::IsNullOrWhiteSpace($part) -or $part -eq '.' -or $part -eq '..' -or
            $part.EndsWith(' ') -or $part.EndsWith('.')) {
            throw "Unsafe bundle path component in: $RelativePath"
        }
    }
    $candidate = $Root
    foreach ($part in $parts) { $candidate = [System.IO.Path]::Combine($candidate, $part) }
    $candidate = [System.IO.Path]::GetFullPath($candidate)
    $prefix = $Root.TrimEnd([char[]]@('/', '\')) + [System.IO.Path]::DirectorySeparatorChar
    if (-not $candidate.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Bundle path escapes its manifest directory.'
    }
    return Resolve-OrdinaryFile -Path $candidate
}

function Get-BytesSha256 {
    param([byte[]]$Bytes)
    $algorithm = [System.Security.Cryptography.SHA256]::Create()
    try {
        return [System.BitConverter]::ToString($algorithm.ComputeHash($Bytes)).Replace('-', '').ToLowerInvariant()
    } finally {
        $algorithm.Dispose()
    }
}

function Assert-Sha256 {
    param([string]$Value, [string]$Context)
    if ($Value -cnotmatch '^[0-9a-fA-F]{64}$') {
        throw "$Context must be a complete 64-character SHA-256."
    }
}

$manifestFile = Resolve-OrdinaryFile -Path $ManifestPath
$manifestDirectory = [System.IO.Path]::GetDirectoryName($manifestFile)
$workbenchDirectory = Resolve-OrdinaryDirectory -Path $WorkbenchDir
$strictUtf8 = [System.Text.UTF8Encoding]::new($false, $true)
$manifestBytes = [System.IO.File]::ReadAllBytes($manifestFile)
if ($manifestBytes.Length -gt 4194304) { throw 'Manifest exceeds the 4 MiB helper limit.' }
$manifestText = $strictUtf8.GetString($manifestBytes).TrimStart([char]0xFEFF)
$bundle = ConvertFrom-Json -InputObject $manifestText -ErrorAction Stop
if ((Get-RequiredProperty $bundle 'schema_version' 'manifest') -cne 'gold-astra.owner-bundle.v1' -or
    (Get-RequiredProperty $bundle 'programme' 'manifest') -cne 'GOLD-ASTRA-001') {
    throw 'This is not a GOLD-ASTRA-001 owner-bundle v1 manifest.'
}
if ((Get-RequiredProperty $bundle 'status' 'manifest') -cne 'READY_FOR_OWNER_EVALUATION') {
    throw 'The manifest is a template or otherwise not ready. The coordinator must complete it after output lock.'
}
$lock = Get-RequiredProperty $bundle 'output_lock' 'manifest'
$lockedValue = Get-RequiredProperty $lock 'all_eight_locked' 'output_lock'
if ($lockedValue -isnot [bool] -or $lockedValue -ne $true) {
    throw 'The manifest does not record the all-eight output lock.'
}
$lockTimestamp = [string](Get-RequiredProperty $lock 'timestamp_utc' 'output_lock')
$parsedTimestamp = [DateTimeOffset]::MinValue
if ($lockTimestamp -notmatch '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|\+00:00)$' -or
    -not [DateTimeOffset]::TryParse($lockTimestamp, [ref]$parsedTimestamp)) {
    throw 'output_lock.timestamp_utc is not a valid timestamp.'
}

$engine = Get-RequiredProperty $bundle 'engine' 'manifest'
if ((Get-RequiredProperty $engine 'accepted_head' 'engine') -cne $acceptedEngineHead) {
    throw 'This helper is pinned to accepted engine 662df51; use a separately reviewed helper for a different engine.'
}
$declaredBinaries = @(Get-RequiredProperty $engine 'windows_binaries' 'engine')
if ($declaredBinaries.Count -ne 2) { throw 'Exactly the two accepted Windows DLL identities are required.' }
foreach ($known in $knownWindowsBinaries) {
    $matchesForBinary = @($declaredBinaries | Where-Object {
        (Get-RequiredProperty $_ 'path' 'windows_binaries item') -ceq $known.path
    })
    if ($matchesForBinary.Count -ne 1) { throw "Missing or duplicate accepted runtime identity: $($known.path)" }
    $declared = $matchesForBinary[0]
    $declaredHash = [string](Get-RequiredProperty $declared 'sha256' 'windows_binaries item')
    Assert-Sha256 -Value $declaredHash -Context 'runtime sha256'
    if ($declaredHash.ToLowerInvariant() -cne $known.sha256 -or
        [long](Get-RequiredProperty $declared 'bytes' 'windows_binaries item') -ne $known.bytes) {
        throw "Manifest runtime identity differs from accepted 662 metadata: $($known.path)"
    }
}
$godotMetadata = Get-RequiredProperty $engine 'godot_windows' 'engine'
$godotDeclarations = @(Get-RequiredProperty $godotMetadata 'executables' 'engine.godot_windows')
if ($godotDeclarations.Count -ne 2) { throw 'The two pinned Godot 4.7 executable identities are required.' }
foreach ($known in $knownGodotExecutables) {
    $matchingDeclarations = @($godotDeclarations | Where-Object {
        (Get-RequiredProperty $_ 'file_name' 'Godot executable item') -ceq $known.file_name
    })
    if ($matchingDeclarations.Count -ne 1) { throw 'Missing or duplicate Godot executable identity.' }
    $declaredHash = [string](Get-RequiredProperty $matchingDeclarations[0] 'sha256' 'Godot executable item')
    Assert-Sha256 -Value $declaredHash -Context 'Godot sha256'
    if ($declaredHash.ToLowerInvariant() -cne $known.sha256) { throw 'Godot executable pin differs from the reviewed owner-pack identity.' }
}
$godotVerification = 'NOT_CHECKED_GODOT_EXE_NOT_SUPPLIED'
if (-not [string]::IsNullOrWhiteSpace($GodotExe)) {
    $godotFile = Resolve-OrdinaryFile -Path $GodotExe
    $godotHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $godotFile).Hash.ToLowerInvariant()
    $matchingGodot = @($knownGodotExecutables | Where-Object { $_.sha256 -ceq $godotHash })
    if ($matchingGodot.Count -ne 1) { throw 'Godot executable SHA-256 does not match either pinned Windows 4.7 executable.' }
    $godotVerification = 'WINDOWS_GODOT_HASH_MATCHES_' + $matchingGodot[0].file_name
}

$engineVerification = 'NOT_CHECKED_ENGINE_ROOT_NOT_SUPPLIED'
if (-not [string]::IsNullOrWhiteSpace($EngineRoot)) {
    $engineDirectory = Resolve-OrdinaryDirectory -Path $EngineRoot
    $repositoryProject = [System.IO.Path]::Combine($engineDirectory, 'godot', 'project.godot')
    $directProject = [System.IO.Path]::Combine($engineDirectory, 'project.godot')
    $hasRepositoryProject = Test-Path -LiteralPath $repositoryProject -PathType Leaf
    $hasDirectProject = Test-Path -LiteralPath $directProject -PathType Leaf
    if ($hasRepositoryProject -and $hasDirectProject) {
        throw 'EngineRoot is ambiguous: both root and godot/project.godot exist. Supply the actual project directory.'
    }
    if ($hasRepositoryProject) {
        $engineProjectDirectory = Resolve-OrdinaryDirectory -Path ([System.IO.Path]::Combine($engineDirectory, 'godot'))
    } elseif ($hasDirectProject) {
        $engineProjectDirectory = $engineDirectory
    } else {
        throw 'EngineRoot must contain project.godot or godot/project.godot.'
    }
    foreach ($known in $knownWindowsBinaries) {
        $binaryFile = Resolve-BundleFile -Root $engineProjectDirectory -RelativePath ($known.path.Substring(6))
        $binaryItem = Get-Item -LiteralPath $binaryFile -Force
        if ($binaryItem.Length -ne $known.bytes) { throw "Runtime size mismatch: $binaryFile" }
        $actualHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $binaryFile).Hash.ToLowerInvariant()
        if ($actualHash -cne $known.sha256) { throw "Runtime SHA-256 mismatch: $binaryFile" }
    }
    $engineVerification = 'BOTH_WINDOWS_DLL_HASHES_MATCH_ACCEPTED_662_METADATA'
}

$maps = @(Get-RequiredProperty $bundle 'maps' 'manifest')
$armKey = $Arm.ToUpperInvariant()
$variantKey = $Variant.ToLowerInvariant()
$selectedMaps = @($maps | Where-Object {
    ([string](Get-RequiredProperty $_ 'arm' 'maps item')).ToUpperInvariant() -ceq $armKey -and
    ([string](Get-RequiredProperty $_ 'variant' 'maps item')).ToLowerInvariant() -ceq $variantKey
})
if ($selectedMaps.Count -ne 1) {
    throw 'Expected exactly one matching arm/variant entry; missing or duplicate entries are refused.'
}
$selectedMap = $selectedMaps[0]
$setupRelative = [string](Get-RequiredProperty $selectedMap 'setup_path' 'selected map')
if ([System.IO.Path]::GetExtension($setupRelative) -ine '.json') { throw 'Selected Setup path must end in .json.' }
$expectedSetupHash = [string](Get-RequiredProperty $selectedMap 'setup_sha256' 'selected map')
Assert-Sha256 -Value $expectedSetupHash -Context 'setup_sha256'
$expectedSetupHash = $expectedSetupHash.ToLowerInvariant()
$sourceSetup = Resolve-BundleFile -Root $manifestDirectory -RelativePath $setupRelative
$sourceItem = Get-Item -LiteralPath $sourceSetup -Force
if ($sourceItem.Length -le 0 -or $sourceItem.Length -gt $maximumSetupBytes) {
    throw 'Setup must contain 1 byte through 1 MiB, matching the accepted Setup file budget.'
}
$setupBytes = [System.IO.File]::ReadAllBytes($sourceSetup)
if ($setupBytes.Length -le 0 -or $setupBytes.Length -gt $maximumSetupBytes) { throw 'Setup size changed outside the accepted budget.' }
$actualSetupHash = Get-BytesSha256 -Bytes $setupBytes
if ($actualSetupHash -cne $expectedSetupHash) { throw 'Setup SHA-256 mismatch; nothing was installed.' }
$setupText = $strictUtf8.GetString($setupBytes).TrimStart([char]0xFEFF)
$setupDocument = ConvertFrom-Json -InputObject $setupText -ErrorAction Stop
$setupVersion = Get-RequiredProperty $setupDocument 'version' 'Setup'
if (($setupVersion -isnot [int] -and $setupVersion -isnot [long] -and $setupVersion -isnot [double]) -or $setupVersion -ne 2) {
    throw 'The selected file is not Setup-v2. Full engine/schema qualification remains a separate gate.'
}

if ([string]::IsNullOrWhiteSpace($Label)) {
    $suffix = [DateTime]::UtcNow.ToString('yyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0, 4)
    $Label = 'gold-astra-001-' + $armKey + '-' + $variantKey + '-' + $suffix
}
if ($Label.Length -gt 48 -or $Label -cnotmatch '^gold-astra-001-[A-Za-z0-9_-]+$') {
    throw 'Label must begin gold-astra-001-, contain only ASCII letters/digits/_/-, and be at most 48 characters.'
}
$destination = [System.IO.Path]::Combine($workbenchDirectory, 'setup-' + $Label + '.json')
if (Test-Path -LiteralPath $destination) { throw "Refusing an existing label or destination: $destination" }
if ($ValidateOnly) {
    Write-Output ('VALIDATED_NOT_INSTALLED: {0}/{1}; SHA-256 {2}' -f $armKey, $variantKey, $actualSetupHash)
    Write-Output ('Proposed new label: ' + $Label)
    Write-Output ('Proposed destination: ' + $destination)
    Write-Output ('Runtime binary check: ' + $engineVerification)
    Write-Output ('Godot executable check: ' + $godotVerification)
    Write-Output 'Native execution and owner qualification are not established by byte staging or hash checks.'
    return
}

# CreateNew is the final atomic overwrite guard, including a race after Test-Path.
# The exact in-memory bytes that passed SHA-256 are written; the source is not reopened.
$destinationStream = $null
try {
    $destinationStream = [System.IO.File]::Open($destination, [System.IO.FileMode]::CreateNew,
        [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
    $destinationStream.Write($setupBytes, 0, $setupBytes.Length)
    $destinationStream.Flush($true)
} finally {
    if ($null -ne $destinationStream) { $destinationStream.Dispose() }
}
$installedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $destination).Hash.ToLowerInvariant()
if ($installedHash -cne $expectedSetupHash) {
    throw "New destination failed verification: $destination. It was not overwritten or deleted; inspect it before using another label."
}

Write-Output ('INSTALLED_NEW_SETUP: ' + $destination)
Write-Output ('SHA-256: ' + $installedHash)
Write-Output ('Runtime binary check: ' + $engineVerification)
Write-Output ('Godot executable check: ' + $godotVerification)
Write-Output 'Native execution and owner qualification are not established by byte staging or hash checks.'
Write-Output 'Load steps:'
Write-Output '1. Start the verified CyberSand project yourself.'
Write-Output ('2. Choose Development workbench ' + [char]0x2014 + ' blank canvas, flyer fleet, materials and solver controls.')
Write-Output ('3. In the starting-map name field, enter exactly: ' + $Label)
Write-Output '4. Click Load start. Wait for completion and record any refusal or error.'
Write-Output 'This helper stages bytes only. Pilot, Play, Save start, fresh-process reopen and acceptance remain explicit owner actions.'
