#requires -version 5.1
<# Synthetic fixture tests only. They never read experiment originals/outputs.
   Fixtures are created beneath a fresh GUID directory in the OS temp folder
   and retained for inspection. No engine or Godot process is executed. #>
[CmdletBinding()]
param([string]$HelperPath = (Join-Path $PSScriptRoot 'Install-GoldAstraSetup.ps1'))
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$fixtureRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('gold-astra-helper-tests-' + [Guid]::NewGuid().ToString('N'))
[void](New-Item -ItemType Directory -Path $fixtureRoot)
$encoding = [System.Text.UTF8Encoding]::new($false)
$enginePins = (Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'owner-bundle-manifest.template.v1.json') | ConvertFrom-Json).engine
$results = @()

function Assert-Condition {
    param([bool]$Condition, [string]$Message)
    if (-not $Condition) { throw ('TEST FAILURE: ' + $Message) }
}

function Save-Manifest {
    param([hashtable]$Case)
    [System.IO.File]::WriteAllText($Case.manifestPath, ($Case.manifest | ConvertTo-Json -Depth 20), $encoding)
}

function New-SyntheticCase {
    param([string]$Name)
    $caseRoot = Join-Path $fixtureRoot $Name
    [void](New-Item -ItemType Directory -Path $caseRoot)
    $workbench = Join-Path $caseRoot 'workbench'
    [void](New-Item -ItemType Directory -Path $workbench)
    $sourceDirectory = Join-Path $caseRoot 'maps/C1/candidate'
    [void](New-Item -ItemType Directory -Path $sourceDirectory)
    $sourceFile = Join-Path $sourceDirectory 'setup.json'
    # A deliberately tiny empty synthetic document, not a study map.
    $sourceText = '{"version":2,"extent":[2048,1024],"actors":[],"next_id":1,"selected":0,"edits":[],"response":"LA-SELECTIVE","liquid_policy":[],"normalize":false,"rule_radius":2,"source":[],"material":2,"brush":8,"fire":false}'
    [System.IO.File]::WriteAllText($sourceFile, $sourceText, $encoding)
    $sourceHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $sourceFile).Hash.ToLowerInvariant()
    $manifest = @{
        schema_version = 'gold-astra.owner-bundle.v1'
        programme = 'GOLD-ASTRA-001'
        status = 'READY_FOR_OWNER_EVALUATION'
        output_lock = @{ all_eight_locked = $true; timestamp_utc = '2026-11-22T00:00:00Z' }
        engine = $enginePins
        maps = @(@{ arm = 'C1'; variant = 'candidate'; setup_path = 'maps/C1/candidate/setup.json'; setup_sha256 = $sourceHash })
        test_only = 'SYNTHETIC_FIXTURE_NO_EXPERIMENT_GEOMETRY'
    }
    $case = @{ name = $Name; root = $caseRoot; workbench = $workbench; source = $sourceFile;
        sourceHash = $sourceHash; manifest = $manifest; manifestPath = (Join-Path $caseRoot 'manifest.json');
        label = ('gold-astra-001-test-' + $Name) }
    Save-Manifest $case
    return $case
}

function Workbench-Snapshot {
    param([string]$Directory)
    return (@(Get-ChildItem -LiteralPath $Directory -File -Force | Sort-Object Name | ForEach-Object {
        $_.Name + ':' + (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
    }) -join '|')
}

function Invoke-RefusalTest {
    param([hashtable]$Case, [hashtable]$Extra = @{})
    Save-Manifest $Case
    $before = Workbench-Snapshot $Case.workbench
    $parameters = @{ ManifestPath = $Case.manifestPath; Arm = 'C1'; Variant = 'candidate';
        WorkbenchDir = $Case.workbench; Label = $Case.label }
    foreach ($key in $Extra.Keys) { $parameters[$key] = $Extra[$key] }
    $caughtMessage = $null
    try { & $HelperPath @parameters | Out-Null } catch { $caughtMessage = $_.Exception.Message }
    Assert-Condition ($null -ne $caughtMessage) ($Case.name + ' should refuse')
    Assert-Condition ((Workbench-Snapshot $Case.workbench) -ceq $before) ($Case.name + ' changed destination files')
    $script:results += [pscustomobject]@{ test = $Case.name; result = 'PASS_REFUSAL_NO_WRITE'; message = $caughtMessage }
}

$case = New-SyntheticCase 'valid'
$manifestHashBefore = (Get-FileHash -Algorithm SHA256 -LiteralPath $case.manifestPath).Hash
& $HelperPath -ManifestPath $case.manifestPath -Arm C1 -Variant candidate -WorkbenchDir $case.workbench -Label $case.label | Out-Null
$destination = Join-Path $case.workbench ('setup-' + $case.label + '.json')
Assert-Condition ((Get-FileHash -Algorithm SHA256 -LiteralPath $destination).Hash.ToLowerInvariant() -ceq $case.sourceHash) 'installed exact bytes'
Assert-Condition (@(Get-ChildItem -LiteralPath $case.workbench -File).Count -eq 1) 'valid install wrote extra files'
Assert-Condition ((Get-FileHash -Algorithm SHA256 -LiteralPath $case.source).Hash.ToLowerInvariant() -ceq $case.sourceHash) 'source changed'
Assert-Condition ((Get-FileHash -Algorithm SHA256 -LiteralPath $case.manifestPath).Hash -ceq $manifestHashBefore) 'manifest changed'
$results += [pscustomobject]@{ test = 'valid'; result = 'PASS_EXACT_NEW_FILE_ONLY' }

$case = New-SyntheticCase 'validate_only'
& $HelperPath -ManifestPath $case.manifestPath -Arm C1 -Variant candidate -WorkbenchDir $case.workbench -Label $case.label -ValidateOnly | Out-Null
Assert-Condition (@(Get-ChildItem -LiteralPath $case.workbench -File).Count -eq 0) 'ValidateOnly wrote files'
$results += [pscustomobject]@{ test = 'validate_only'; result = 'PASS_NO_WRITE' }

$case = New-SyntheticCase 'hash_mismatch'
$case.manifest.maps[0].setup_sha256 = ('0' * 64)
Invoke-RefusalTest $case

$case = New-SyntheticCase 'existing_label'
[System.IO.File]::WriteAllText((Join-Path $case.workbench ('setup-' + $case.label + '.json')), 'DO NOT OVERWRITE', $encoding)
Invoke-RefusalTest $case

$case = New-SyntheticCase 'traversal'
$case.manifest.maps[0].setup_path = '../outside.json'
Invoke-RefusalTest $case

$case = New-SyntheticCase 'absolute_path'
$case.manifest.maps[0].setup_path = $case.source
Invoke-RefusalTest $case

$case = New-SyntheticCase 'alternate_stream'
$case.manifest.maps[0].setup_path = 'maps/C1/candidate/setup.json:payload'
Invoke-RefusalTest $case

$case = New-SyntheticCase 'invalid_label'
Invoke-RefusalTest $case @{ Label = '../outside' }

$case = New-SyntheticCase 'long_label'
Invoke-RefusalTest $case @{ Label = ('gold-astra-001-' + ('x' * 40)) }

$case = New-SyntheticCase 'duplicate_map'
$case.manifest.maps = @($case.manifest.maps[0], $case.manifest.maps[0])
Invoke-RefusalTest $case

$case = New-SyntheticCase 'pending_template'
$case.manifest.status = 'TEMPLATE_PENDING_OUTPUT_LOCK'
Invoke-RefusalTest $case

$case = New-SyntheticCase 'unlocked'
$case.manifest.output_lock.all_eight_locked = $false
Invoke-RefusalTest $case

$case = New-SyntheticCase 'nonbool_lock'
$case.manifest.output_lock.all_eight_locked = 1
Invoke-RefusalTest $case

$case = New-SyntheticCase 'wrong_engine'
$case.manifest.engine = ($enginePins | ConvertTo-Json -Depth 10 | ConvertFrom-Json)
$case.manifest.engine.accepted_head = ('0' * 40)
Invoke-RefusalTest $case

$case = New-SyntheticCase 'invalid_setup'
[System.IO.File]::WriteAllText($case.source, '{invalid json}', $encoding)
$case.manifest.maps[0].setup_sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $case.source).Hash.ToLowerInvariant()
Invoke-RefusalTest $case

$case = New-SyntheticCase 'old_setup'
[System.IO.File]::WriteAllText($case.source, '{"version":1}', $encoding)
$case.manifest.maps[0].setup_sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $case.source).Hash.ToLowerInvariant()
Invoke-RefusalTest $case

$case = New-SyntheticCase 'string_version'
[System.IO.File]::WriteAllText($case.source, '{"version":"2"}', $encoding)
$case.manifest.maps[0].setup_sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $case.source).Hash.ToLowerInvariant()
Invoke-RefusalTest $case

$case = New-SyntheticCase 'oversize'
[System.IO.File]::WriteAllBytes($case.source, (New-Object byte[] 1048577))
$case.manifest.maps[0].setup_sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $case.source).Hash.ToLowerInvariant()
Invoke-RefusalTest $case

$case = New-SyntheticCase 'fake_dll'
$dummyProject = Join-Path $case.root 'dummy-engine'
[void](New-Item -ItemType Directory -Path (Join-Path $dummyProject 'addons/cybersand_native/bin'))
[System.IO.File]::WriteAllText((Join-Path $dummyProject 'project.godot'), '; synthetic fixture', $encoding)
[System.IO.File]::WriteAllText((Join-Path $dummyProject 'addons/cybersand_native/bin/cybersand_native.windows.x86_64.dll'), 'not a runtime', $encoding)
Invoke-RefusalTest $case @{ EngineRoot = $dummyProject }

$case = New-SyntheticCase 'fake_godot'
$dummyExe = Join-Path $case.root 'not-godot.exe'
[System.IO.File]::WriteAllText($dummyExe, 'not an executable', $encoding)
Invoke-RefusalTest $case @{ GodotExe = $dummyExe }

$case = New-SyntheticCase 'symlink_source'
$linkPath = Join-Path $case.root 'linked'
$canCreateLink = $true
try { [void](New-Item -ItemType SymbolicLink -Path $linkPath -Target (Split-Path -Parent $case.source) -ErrorAction Stop) }
catch { $canCreateLink = $false }
if ($canCreateLink) {
    $case.manifest.maps[0].setup_path = 'linked/setup.json'
    Invoke-RefusalTest $case
} else {
    $results += [pscustomobject]@{ test = 'symlink_source'; result = 'SKIP_OS_LINK_PERMISSION' }
}

[pscustomobject]@{ fixture_root = $fixtureRoot; tests = $results; windows_execution = ($env:OS -eq 'Windows_NT') } |
    ConvertTo-Json -Depth 8
