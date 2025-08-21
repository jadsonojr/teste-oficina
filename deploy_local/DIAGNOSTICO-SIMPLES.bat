@echo off
title Diagnostico - Gestao Oficina Mecanica

echo =====================================
echo     DIAGNOSTICO DE INSTALACAO
echo =====================================
echo.

echo Verificando requisitos do sistema...
echo.

echo 1. Verificando Python...
python --version 2>nul
if errorlevel 1 (
    echo PYTHON NAO ENCONTRADO!
    echo.
    echo SOLUCAO:
    echo 1. Baixe: https://python.org/downloads/
    echo 2. Durante instalacao, MARQUE: "Add Python to PATH"
    echo 3. Reinicie o computador apos instalacao
    echo.
    set PYTHON_OK=0
) else (
    echo Python instalado corretamente
    set PYTHON_OK=1
)

echo.
echo 2. Verificando Node.js...
node --version 2>nul
if errorlevel 1 (
    echo NODE.JS NAO ENCONTRADO!
    echo.
    echo SOLUCAO:
    echo 1. Baixe: https://nodejs.org/
    echo 2. Execute o instalador com configuracoes padrao
    echo 3. Reinicie o computador apos instalacao
    echo.
    set NODEJS_OK=0
) else (
    echo Node.js instalado corretamente
    set NODEJS_OK=1
)

echo.
echo 3. Verificando MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo MONGODB NAO ENCONTRADO!
    echo.
    echo SOLUCAO:
    echo 1. Baixe: https://www.mongodb.com/try/download/community
    echo 2. Execute instalador como ADMINISTRADOR
    echo 3. Escolha "Install as Windows Service"
    echo 4. Reinicie o computador apos instalacao
    echo.
    set MONGODB_OK=0
) else (
    echo MongoDB instalado corretamente
    set MONGODB_OK=1
)

echo.
echo 4. Verificando pip (gerenciador Python)...
pip --version >nul 2>&1
if errorlevel 1 (
    echo PIP NAO ENCONTRADO!
    echo Reinstale o Python marcando "Add to PATH"
    set PIP_OK=0
) else (
    echo pip funcionando
    set PIP_OK=1
)

echo.
echo 5. Verificando npm (gerenciador Node.js)...
npm --version >nul 2>&1
if errorlevel 1 (
    echo NPM NAO ENCONTRADO!
    echo Reinstale o Node.js
    set NPM_OK=0
) else (
    echo npm funcionando
    set NPM_OK=1
)

echo.
echo 6. Verificando permissoes de administrador...
net session >nul 2>&1
if errorlevel 1 (
    echo Execute como ADMINISTRADOR
    echo Clique direito no arquivo - "Executar como administrador"
    set ADMIN_OK=0
) else (
    echo Executando como administrador
    set ADMIN_OK=1
)

echo.
echo =====================================
echo         RESUMO DO DIAGNOSTICO
echo =====================================
echo.

if "%PYTHON_OK%"=="1" if "%NODEJS_OK%"=="1" if "%MONGODB_OK%"=="1" (
    echo TODOS OS REQUISITOS OK!
    echo.
    echo Voce pode executar a instalacao:
    echo    Execute: INSTALAR-SIMPLES.bat como ADMINISTRADOR
    echo.
) else (
    echo PROBLEMAS ENCONTRADOS:
    echo.
    if "%PYTHON_OK%"=="0" echo    - Instalar Python
    if "%NODEJS_OK%"=="0" echo    - Instalar Node.js
    if "%MONGODB_OK%"=="0" echo    - Instalar MongoDB
    if "%ADMIN_OK%"=="0" echo    - Executar como administrador
    echo.
    echo PROXIMOS PASSOS:
    echo 1. Instale os programas faltantes
    echo 2. Reinicie o computador
    echo 3. Execute este diagnostico novamente
    echo 4. Se tudo estiver OK, execute INSTALAR-SIMPLES.bat
)

echo.
echo OUTROS PROBLEMAS POSSIVEIS:
echo - Antivirus bloqueando - Desative temporariamente
echo - Firewall bloqueando - Permita acesso
echo - Falta de espaco em disco - Libere pelo menos 2GB
echo.

pause