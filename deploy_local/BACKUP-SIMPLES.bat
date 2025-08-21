@echo off
title Backup Completo - Gestao Oficina

echo =====================================
echo     BACKUP GESTAO OFICINA
echo =====================================
echo.

set BACKUP_DIR=backup_%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =0%

echo Criando backup em: %BACKUP_DIR%
echo.

mkdir "%BACKUP_DIR%" 2>nul

echo Fazendo backup do banco de dados...
mongodump --db oficina_mecanica --out "%BACKUP_DIR%" 2>nul

if errorlevel 1 (
    echo Erro no backup! Verifique se o MongoDB esta rodando
    echo Execute: INICIAR-SIMPLES.bat primeiro
    pause
    exit /b 1
)

echo Backup do banco concluido
echo Copiando arquivos do sistema...

xcopy /s /e /h /y "backend" "%BACKUP_DIR%\sistema\backend\" >nul 2>&1
xcopy /s /e /h /y "frontend" "%BACKUP_DIR%\sistema\frontend\" >nul 2>&1
copy "*.bat" "%BACKUP_DIR%\sistema\" >nul 2>&1
copy "*.txt" "%BACKUP_DIR%\sistema\" >nul 2>&1

echo Arquivos do sistema copiados

echo.
echo =====================================
echo       BACKUP CONCLUIDO!
echo =====================================
echo.
echo Pasta: %BACKUP_DIR%
echo Contem: Banco de dados + Sistema
echo.
echo Para restaurar:
echo   1. Execute RESTAURAR-SIMPLES.bat
echo   2. Selecione a pasta do backup
echo.
pause