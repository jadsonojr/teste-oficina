@echo off
title Parando Sistema - Gestao Oficina

echo =====================================
echo   PARANDO GESTAO OFICINA MECANICA
echo =====================================
echo.

echo Finalizando processos...

:: Parar Node.js (React)
taskkill /f /im node.exe >nul 2>&1
echo Frontend parado

:: Parar Python (FastAPI)  
taskkill /f /im python.exe >nul 2>&1
echo Backend parado

:: Parar Chrome/Edge abertos pelo sistema
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1

echo.
echo =====================================
echo     SISTEMA PARADO
echo =====================================
echo.
echo Seus dados foram salvos automaticamente
echo Para reiniciar: Execute INICIAR-SIMPLES.bat
echo.
pause