@echo off
chcp 65001 >nul
title Parando Sistema - Gestão Oficina

echo =====================================
echo   PARANDO GESTÃO OFICINA MECÂNICA
echo =====================================
echo.

echo ⏳ Finalizando processos...

:: Parar Node.js (React)
taskkill /f /im node.exe >nul 2>&1
echo ✅ Frontend parado

:: Parar Python (FastAPI)  
taskkill /f /im python.exe >nul 2>&1
echo ✅ Backend parado

:: Parar Chrome/Edge abertos pelo sistema
taskkill /f /im chrome.exe >nul 2>&1
taskkill /f /im msedge.exe >nul 2>&1

echo.
echo =====================================
echo     ✅ SISTEMA PARADO ✅
echo =====================================
echo.
echo 💾 Seus dados foram salvos automaticamente
echo 🔄 Para reiniciar: Execute INICIAR.bat
echo.
pause