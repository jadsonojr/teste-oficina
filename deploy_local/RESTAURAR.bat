@echo off
chcp 65001 >nul
title Restaurar Backup - Gestão Oficina

echo =====================================
echo   RESTAURAR BACKUP GESTÃO OFICINA
echo =====================================
echo.

echo ⚠️  ATENÇÃO: Isso substituirá os dados atuais!
echo.
set /p CONFIRM=Deseja continuar? (S/N): 

if /i not "%CONFIRM%"=="S" (
    echo ❌ Operação cancelada
    pause
    exit /b
)

echo.
echo 📁 Backups disponíveis:
dir /b backup_* 2>nul

if errorlevel 1 (
    echo ❌ Nenhum backup encontrado!
    echo 💡 Execute BACKUP.bat primeiro
    pause
    exit /b 1
)

echo.
set /p BACKUP_DIR=Digite o nome da pasta do backup: 

if not exist "%BACKUP_DIR%" (
    echo ❌ Pasta não encontrada!
    pause
    exit /b 1
)

echo.
echo ⏳ Restaurando banco de dados...

:: Verificar se MongoDB está rodando
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo 🔄 Iniciando MongoDB...
    net start MongoDB >nul 2>&1
    timeout 5 >nul
)

:: Restaurar banco
mongorestore --db oficina_mecanica --drop "%BACKUP_DIR%\oficina_mecanica" 2>nul

if errorlevel 1 (
    echo ❌ Erro na restauração do banco!
    pause
    exit /b 1
)

echo ✅ Banco restaurado
echo ⏳ Restaurando arquivos do sistema...

if exist "%BACKUP_DIR%\sistema" (
    xcopy /s /e /h /y "%BACKUP_DIR%\sistema\*" . >nul 2>&1
    echo ✅ Sistema restaurado
)

echo.
echo =====================================
echo     ✅ RESTAURAÇÃO CONCLUÍDA! ✅
echo =====================================
echo.
echo 🔄 Reinicie o sistema: INICIAR.bat
echo.
pause