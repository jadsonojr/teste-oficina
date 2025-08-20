@echo off
chcp 65001 >nul
title DIAGNÓSTICO - Gestão Oficina Mecânica

echo =====================================
echo     DIAGNÓSTICO DE INSTALAÇÃO
echo =====================================
echo.

echo 🔍 Verificando requisitos do sistema...
echo.

echo ⏳ 1. Verificando Python...
python --version 2>nul
if errorlevel 1 (
    echo ❌ PYTHON NÃO ENCONTRADO!
    echo.
    echo 📥 SOLUÇÃO:
    echo 1. Baixe: https://python.org/downloads/
    echo 2. Durante instalação, MARQUE: "Add Python to PATH"
    echo 3. Reinicie o computador após instalação
    echo.
    set PYTHON_OK=0
) else (
    echo ✅ Python instalado corretamente
    set PYTHON_OK=1
)

echo.
echo ⏳ 2. Verificando Node.js...
node --version 2>nul
if errorlevel 1 (
    echo ❌ NODE.JS NÃO ENCONTRADO!
    echo.
    echo 📥 SOLUÇÃO:
    echo 1. Baixe: https://nodejs.org/
    echo 2. Execute o instalador com configurações padrão
    echo 3. Reinicie o computador após instalação
    echo.
    set NODEJS_OK=0
) else (
    echo ✅ Node.js instalado corretamente
    set NODEJS_OK=1
)

echo.
echo ⏳ 3. Verificando MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ❌ MONGODB NÃO ENCONTRADO!
    echo.
    echo 📥 SOLUÇÃO:
    echo 1. Baixe: https://www.mongodb.com/try/download/community
    echo 2. Execute instalador como ADMINISTRADOR
    echo 3. Escolha "Install as Windows Service"
    echo 4. Reinicie o computador após instalação
    echo.
    set MONGODB_OK=0
) else (
    echo ✅ MongoDB instalado corretamente
    set MONGODB_OK=1
)

echo.
echo ⏳ 4. Verificando pip (gerenciador Python)...
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ PIP NÃO ENCONTRADO!
    echo 💡 Reinstale o Python marcando "Add to PATH"
    set PIP_OK=0
) else (
    echo ✅ pip funcionando
    set PIP_OK=1
)

echo.
echo ⏳ 5. Verificando npm (gerenciador Node.js)...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ NPM NÃO ENCONTRADO!
    echo 💡 Reinstale o Node.js
    set NPM_OK=0
) else (
    echo ✅ npm funcionando
    set NPM_OK=1
)

echo.
echo ⏳ 6. Verificando permissões de administrador...
net session >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Execute como ADMINISTRADOR
    echo 💡 Clique direito no arquivo → "Executar como administrador"
    set ADMIN_OK=0
) else (
    echo ✅ Executando como administrador
    set ADMIN_OK=1
)

echo.
echo =====================================
echo         RESUMO DO DIAGNÓSTICO
echo =====================================
echo.

if "%PYTHON_OK%"=="1" if "%NODEJS_OK%"=="1" if "%MONGODB_OK%"=="1" (
    echo ✅ TODOS OS REQUISITOS OK!
    echo.
    echo 🚀 Você pode executar a instalação:
    echo    Execute: INSTALAR.bat como ADMINISTRADOR
    echo.
) else (
    echo ❌ PROBLEMAS ENCONTRADOS:
    echo.
    if "%PYTHON_OK%"=="0" echo    • Instalar Python
    if "%NODEJS_OK%"=="0" echo    • Instalar Node.js
    if "%MONGODB_OK%"=="0" echo    • Instalar MongoDB
    if "%ADMIN_OK%"=="0" echo    • Executar como administrador
    echo.
    echo 📋 PRÓXIMOS PASSOS:
    echo 1. Instale os programas faltantes
    echo 2. Reinicie o computador
    echo 3. Execute este diagnóstico novamente
    echo 4. Se tudo estiver OK, execute INSTALAR.bat
)

echo.
echo 🔧 OUTROS PROBLEMAS POSSÍVEIS:
echo • Antivírus bloqueando → Desative temporariamente
echo • Firewall bloqueando → Permita acesso
echo • Falta de espaço em disco → Libere pelo menos 2GB
echo.

pause