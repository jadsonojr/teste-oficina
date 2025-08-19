@echo off
echo ================================
echo  INSTALANDO GESTAO OFICINA
echo ================================

echo Instalando dependencias do backend...
cd backend
pip install -r requirements.txt

echo Instalando dependencias do frontend...
cd ..\frontend
call npm install

echo ================================
echo  INSTALACAO CONCLUIDA!
echo ================================
echo.
echo Para iniciar o sistema, execute: start.bat
echo.
pause