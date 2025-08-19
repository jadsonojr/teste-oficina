@echo off
chcp 65001 >nul
title Instalação - Gestão Oficina Mecânica

echo =====================================
echo   INSTALAÇÃO GESTÃO OFICINA MECÂNICA
echo =====================================
echo.
echo 🏠 Sistema 100%% OFFLINE - Sem internet!
echo.

echo ⏳ Verificando requisitos...

:: Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Python não encontrado!
    echo 📥 Instale Python em: https://python.org
    echo ⚠️  MARQUE "Add Python to PATH"
    pause
    exit /b 1
)
echo ✅ Python encontrado

:: Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Node.js não encontrado!
    echo 📥 Instale Node.js em: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

:: Verificar MongoDB
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: MongoDB não encontrado!
    echo 📥 Instale MongoDB em: https://mongodb.com/download-center/community
    pause
    exit /b 1
)
echo ✅ MongoDB encontrado

echo.
echo 📦 Instalando dependências do sistema...

:: Instalar backend
echo ⏳ Configurando backend...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Erro na instalação do backend
    pause
    exit /b 1
)
echo ✅ Backend configurado

:: Instalar frontend
echo ⏳ Configurando frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ❌ Erro na instalação do frontend
    pause
    exit /b 1
)
echo ✅ Frontend configurado

cd ..

echo.
echo =====================================
echo    ✅ INSTALAÇÃO CONCLUÍDA! ✅
echo =====================================
echo.
echo 🚀 Para iniciar: Execute INICIAR.bat
echo 🌐 Acesso local: http://localhost:3000
echo 🏢 Acesso rede: Execute INICIAR-REDE.bat
echo.
echo 📞 Sistema funciona 100%% offline!
echo 💾 Dados salvos localmente
echo 💰 Zero mensalidades
echo.
pause