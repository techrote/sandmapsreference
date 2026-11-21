@echo off
setlocal
PowerShell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0INSTALL-EXEMPLARS.ps1"
if errorlevel 1 pause
