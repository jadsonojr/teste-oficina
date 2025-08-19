@echo off
echo ================================
echo  INICIANDO GESTAO OFICINA
echo ================================

echo Verificando MongoDB...
sc query MongoDB >nul 2>&1
if errorlevel 1 (
    echo ERRO: MongoDB nao encontrado!
    echo Execute: install.bat primeiro
    pause
    exit
)

echo Iniciando backend...
start cmd /k "cd backend && python server.py"

echo Aguardando backend iniciar...
timeout 5 >nul

echo Iniciando frontend...
start cmd /k "cd frontend && npm start"

echo ================================
echo  SISTEMA INICIADO!
echo ================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8001
echo.
echo Para parar o sistema: stop.bat
echo.
pause