@echo off
chcp 65001 >nul
title Gestão Oficina - Acesso em Rede

echo =====================================
echo   GESTÃO OFICINA - MODO REDE LOCAL
echo =====================================
echo.
echo 🌐 Outros computadores poderão acessar!
echo.

:: Verificar MongoDB
echo ⏳ Verificando MongoDB...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo 🔄 Iniciando MongoDB...
    net start MongoDB >nul 2>&1
    timeout 3 >nul
)
echo ✅ MongoDB rodando

:: Mostrar IPs da rede
echo 📍 Endereços de acesso na rede:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for %%b in (%%a) do (
        echo    🌐 http://%%b:3000
    )
)
echo.

:: Definir HOST para aceitar conexões externas
set HOST=0.0.0.0
set REACT_APP_BACKEND_URL=http://0.0.0.0:8001

echo ⏳ Iniciando backend para rede...
start /min cmd /c "cd backend && set HOST=0.0.0.0 && echo Backend disponível na rede! && python server.py"
timeout 5 >nul

echo ⏳ Iniciando frontend para rede...
start /min cmd /c "cd frontend && set HOST=0.0.0.0 && echo Frontend disponível na rede! && npm start"
timeout 8 >nul

echo.
echo =====================================
echo   ✅ SISTEMA DISPONÍVEL NA REDE! ✅
echo =====================================
echo.
echo 🔧 Como usar:
echo   • No computador atual: http://localhost:3000
echo   • Em outros computadores: Use os IPs mostrados acima
echo.
echo 📱 Exemplo: http://192.168.1.100:3000
echo.
echo ⚠️  Certifique-se que o firewall permite conexões
echo ⏹️  Para parar: Execute PARAR.bat
echo.

:: Aguardar e abrir navegador
timeout 3 >nul
start http://localhost:3000

echo 🎉 Sistema compartilhado na rede local!
echo.
pause