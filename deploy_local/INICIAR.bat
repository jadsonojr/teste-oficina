@echo off
chcp 65001 >nul
title Gestão Oficina Mecânica - Sistema Offline

echo =====================================
echo    INICIANDO GESTÃO OFICINA
echo =====================================
echo.
echo 🏠 Sistema 100%% OFFLINE
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

:: Iniciar backend
echo ⏳ Iniciando backend...
start /min cmd /c "cd backend && echo Backend iniciado! && python server.py"
timeout 5 >nul
echo ✅ Backend iniciado

:: Iniciar frontend  
echo ⏳ Iniciando frontend...
start /min cmd /c "cd frontend && echo Frontend iniciado! && npm start"
timeout 8 >nul

echo.
echo =====================================
echo       ✅ SISTEMA FUNCIONANDO! ✅
echo =====================================
echo.
echo 🌐 Acesse: http://localhost:3000
echo 🖥️  Backend: http://localhost:8001
echo.
echo 🔧 Funcionalidades:
echo   • Vendas e recibos
echo   • Controle de estoque  
echo   • Cadastro de clientes
echo   • Relatórios completos
echo.
echo ⏹️  Para parar: Execute PARAR.bat
echo.

:: Abrir navegador automaticamente
timeout 3 >nul
start http://localhost:3000

echo 🎉 Sistema aberto no navegador!
echo.
echo Pressione qualquer tecla para minimizar...
pause >nul