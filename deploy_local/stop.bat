@echo off
echo ================================
echo  PARANDO GESTAO OFICINA
echo ================================

echo Parando processos...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1

echo Sistema parado com sucesso!
pause