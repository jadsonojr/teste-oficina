@echo off
echo ================================
echo  GESTAO OFICINA - REDE LOCAL
echo ================================

echo Iniciando para acesso em rede...
echo Outros computadores poderao acessar!
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    for %%b in (%%a) do (
        echo ACESSO PELA REDE: http://%%b:3000
    )
)

echo.
echo Iniciando backend...
start cmd /k "cd backend && set HOST=0.0.0.0 && python server.py"

echo Aguardando backend...
timeout 5 >nul

echo Iniciando frontend...
start cmd /k "cd frontend && set HOST=0.0.0.0 && npm start"

echo.
echo Sistema disponivel na rede local!
pause