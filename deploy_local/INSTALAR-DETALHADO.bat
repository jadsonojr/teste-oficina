@echo off
chcp 65001 >nul
title INSTALAÇÃO PASSO-A-PASSO - Gestão Oficina

echo =====================================
echo   INSTALAÇÃO DETALHADA COM LOGS
echo =====================================
echo.

:: Criar pasta de logs
if not exist "logs" mkdir logs
set LOG_FILE=logs\instalacao_%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%.log
set LOG_FILE=%LOG_FILE: =0%

echo 📝 Log sendo salvo em: %LOG_FILE%
echo.

echo ⏳ ETAPA 1/4: Verificando requisitos...
echo [%date% %time%] Iniciando verificação de requisitos >> "%LOG_FILE%"

:: Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo [ERROR] Python não encontrado >> "%LOG_FILE%"
    echo.
    echo 🛠️  SOLUÇÃO RÁPIDA:
    echo 1. Baixe Python: https://python.org/downloads/
    echo 2. Durante instalação: MARQUE "Add Python to PATH"
    echo 3. Reinicie e tente novamente
    pause
    exit /b 1
) else (
    python --version >> "%LOG_FILE%" 2>&1
    echo ✅ Python OK
)

:: Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo [ERROR] Node.js não encontrado >> "%LOG_FILE%"
    echo.
    echo 🛠️  SOLUÇÃO RÁPIDA:
    echo 1. Baixe Node.js: https://nodejs.org/
    echo 2. Execute instalador normalmente
    echo 3. Reinicie e tente novamente
    pause
    exit /b 1
) else (
    node --version >> "%LOG_FILE%" 2>&1
    echo ✅ Node.js OK
)

:: Verificar MongoDB
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MongoDB não encontrado, tentando iniciar...
    echo [WARNING] MongoDB service não encontrado >> "%LOG_FILE%"
    
    :: Tentar diferentes comandos do MongoDB
    mongod --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ MongoDB não instalado!
        echo [ERROR] MongoDB não instalado >> "%LOG_FILE%"
        echo.
        echo 🛠️  SOLUÇÃO RÁPIDA:
        echo 1. Baixe MongoDB: https://mongodb.com/download-center/community
        echo 2. Execute como ADMINISTRADOR
        echo 3. Marque "Install as Windows Service"
        pause
        exit /b 1
    ) else (
        echo ✅ MongoDB executável encontrado
        mongod --version >> "%LOG_FILE%" 2>&1
    )
) else (
    echo ✅ MongoDB Service OK
)

echo.
echo ⏳ ETAPA 2/4: Instalando dependências do backend...
echo [%date% %time%] Iniciando instalação backend >> "%LOG_FILE%"

cd backend
if not exist "requirements.txt" (
    echo ❌ Arquivo requirements.txt não encontrado!
    echo [ERROR] requirements.txt missing >> "%LOG_FILE%"
    pause
    exit /b 1
)

echo 📦 Instalando pacotes Python...
pip install -r requirements.txt >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo ❌ Erro na instalação das dependências Python!
    echo [ERROR] pip install failed >> "%LOG_FILE%"
    echo.
    echo 🔍 Verifique o arquivo: %LOG_FILE%
    echo 💡 Possíveis soluções:
    echo • Execute como ADMINISTRADOR
    echo • Verifique conexão com internet
    echo • Atualize o pip: python -m pip install --upgrade pip
    pause
    exit /b 1
)
echo ✅ Backend configurado

echo.
echo ⏳ ETAPA 3/4: Instalando dependências do frontend...
echo [%date% %time%] Iniciando instalação frontend >> "%LOG_FILE%"

cd ..\frontend
if not exist "package.json" (
    echo ❌ Arquivo package.json não encontrado!
    echo [ERROR] package.json missing >> "%LOG_FILE%"
    pause
    exit /b 1
)

echo 📦 Instalando pacotes Node.js...
echo 💡 Isso pode demorar alguns minutos...

npm install >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo ❌ Erro na instalação das dependências Node.js!
    echo [ERROR] npm install failed >> "%LOG_FILE%"
    echo.
    echo 🔍 Verifique o arquivo: %LOG_FILE%
    echo 💡 Possíveis soluções:
    echo • Execute como ADMINISTRADOR  
    echo • Limpe cache: npm cache clean --force
    echo • Verifique conexão com internet
    echo • Tente: npm install --legacy-peer-deps
    pause
    exit /b 1
)
echo ✅ Frontend configurado

cd ..

echo.
echo ⏳ ETAPA 4/4: Testando instalação...
echo [%date% %time%] Testando instalação >> "%LOG_FILE%"

:: Testar imports Python
echo 🧪 Testando backend...
cd backend
python -c "import fastapi, uvicorn, motor; print('Imports OK')" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo ❌ Erro nos imports Python!
    echo [ERROR] Python imports failed >> "%LOG_FILE%"
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✅ Backend testado

:: Testar Node.js
echo 🧪 Testando frontend...
cd frontend  
node -e "console.log('Node.js funcionando')" >> "%LOG_FILE%" 2>&1
if errorlevel 1 (
    echo ❌ Erro no Node.js!
    echo [ERROR] Node.js test failed >> "%LOG_FILE%"
    cd ..
    pause  
    exit /b 1
)
cd ..
echo ✅ Frontend testado

echo [%date% %time%] Instalação concluída com sucesso >> "%LOG_FILE%"

echo.
echo =====================================
echo     ✅ INSTALAÇÃO CONCLUÍDA! ✅
echo =====================================
echo.
echo 🎉 Sistema instalado com sucesso!
echo 📝 Log salvo em: %LOG_FILE%
echo.
echo 🚀 PRÓXIMO PASSO:
echo    Execute: INICIAR.bat
echo.
echo 🌐 Após iniciar, acesse:
echo    http://localhost:3000
echo.
echo 📞 Se houver problemas:
echo    1. Verifique o arquivo de log
echo    2. Execute DIAGNOSTICO.bat
echo.
pause