#requires -version 5.1
[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)][string]$HelperPath,
    [Parameter(Mandatory=$true)][string]$TestsPath,
    [Parameter(Mandatory=$true)][string]$OutputPath
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$parsed = @()
foreach ($path in @($HelperPath, $TestsPath)) {
    $tokens = $null
    $errors = $null
    [void][System.Management.Automation.Language.Parser]::ParseFile($path, [ref]$tokens, [ref]$errors)
    $parsed += [pscustomobject]@{ path=$path; parse_error_count=@($errors).Count }
    if (@($errors).Count -ne 0) { throw ($errors | Out-String) }
}
$text = (& $TestsPath -HelperPath $HelperPath | Out-String)
$suite = ConvertFrom-Json -InputObject $text -ErrorAction Stop
$tests = @($suite.tests)
$failures = @($tests | Where-Object { -not $_.result.StartsWith('PASS_') })
$report = [pscustomobject]@{
    platform=$env:OS
    powershell_version=$PSVersionTable.PSVersion.ToString()
    effective_module_path=$env:PSModulePath
    get_file_hash_source=(Get-Command Get-FileHash -ErrorAction Stop).Source
    parser=$parsed
    suite=$suite
    case_count=$tests.Count
    passing_cases=($tests.Count - $failures.Count)
    unexecuted_or_failed=$failures
    pass=($env:OS -eq 'Windows_NT' -and $tests.Count -eq 21 -and $failures.Count -eq 0)
}
[System.IO.File]::WriteAllText($OutputPath, ($report | ConvertTo-Json -Depth 14), [System.Text.UTF8Encoding]::new($false))
Write-Output ('GOLD_WINDOWS_HELPER_TESTS ' + ($report | ConvertTo-Json -Depth 14 -Compress))
if (-not $report.pass) { throw 'Windows helper suite did not execute and pass all 21 cases.' }
