@echo off
chcp 65001 >nul
title Backup Rápido - Só Dados

echo =====================================
echo       BACKUP RÁPIDO - SÓ DADOS
echo =====================================
echo.

set BACKUP_DIR=backup_dados_%date:~6,4%-%date:~3,2%-%date:~0,2%_%time:~0,2%-%time:~3,2%
set BACKUP_DIR=%BACKUP_DIR: =0%

echo 💾 Fazendo backup APENAS dos dados...
echo 📁 Pasta: %BACKUP_DIR%
echo.

:: Verificar se MongoDB está rodando
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo 🔄 Iniciando MongoDB...
    net start MongoDB >nul 2>&1
    timeout 3 >nul
)

echo ⏳ Exportando banco de dados...
mongodump --db oficina_mecanica --out "%BACKUP_DIR%" >nul 2>&1

if errorlevel 1 (
    echo ❌ Erro no backup!
    echo 💡 Certifique-se que o sistema está rodando
    pause
    exit /b 1
)

echo ✅ Backup dos dados concluído!
echo.
echo 📊 Dados salvos:
echo   • Clientes
echo   • Peças e estoque
echo   • Serviços  
echo   • Vendas
echo   • Configurações
echo.
echo 📁 Localização: %BACKUP_DIR%
echo.
pause