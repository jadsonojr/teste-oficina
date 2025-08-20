@echo off
chcp 65001 >nul
title Backup Automático Diário - Gestão Oficina

echo =====================================
echo      CONFIGURAR BACKUP AUTOMÁTICO
echo =====================================
echo.

set BACKUP_HOUR=18
set BACKUP_MIN=00

echo 🕐 Configurando backup automático diário às %BACKUP_HOUR%:%BACKUP_MIN%
echo.

:: Criar script de backup
echo @echo off > backup_task.bat
echo chcp 65001 ^>nul >> backup_task.bat
echo cd /d "%CD%" >> backup_task.bat
echo call BACKUP.bat >> backup_task.bat

:: Criar tarefa no Windows
schtasks /create /tn "Backup Oficina Mecânica" /tr "%CD%\backup_task.bat" /sc daily /st %BACKUP_HOUR%:%BACKUP_MIN% /ru SYSTEM /f >nul 2>&1

if errorlevel 1 (
    echo ❌ Erro ao criar tarefa automática
    echo 💡 Execute este arquivo como ADMINISTRADOR
    echo.
    echo 📝 ALTERNATIVA MANUAL:
    echo 1. Abra "Agendador de Tarefas" do Windows
    echo 2. Criar Tarefa Básica
    echo 3. Nome: Backup Oficina Mecânica  
    echo 4. Executar: %CD%\backup_task.bat
    echo 5. Horário: Diariamente às %BACKUP_HOUR%:%BACKUP_MIN%
) else (
    echo ✅ Backup automático configurado!
    echo.
    echo ⏰ Será executado diariamente às %BACKUP_HOUR%:%BACKUP_MIN%
    echo 📁 Backups salvos automaticamente
    echo.
    echo 🔧 Para alterar horário:
    echo    Execute este script novamente
    echo.
    echo 🗑️  Para remover:
    echo    schtasks /delete /tn "Backup Oficina Mecânica"
)

echo.
pause