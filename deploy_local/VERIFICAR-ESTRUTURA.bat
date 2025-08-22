@echo off
title Verificar Estrutura - Gestao Oficina

echo =====================================
echo     VERIFICANDO ESTRUTURA DO SISTEMA
echo =====================================
echo.

echo Pasta atual: %CD%
echo.

echo Verificando arquivos essenciais...
echo.

echo 1. Verificando pasta backend:
if exist "backend" (
    echo    [OK] Pasta backend existe
    if exist "backend\requirements.txt" (
        echo    [OK] requirements.txt existe
    ) else (
        echo    [ERRO] requirements.txt NAO existe
    )
    if exist "backend\server.py" (
        echo    [OK] server.py existe
    ) else (
        echo    [ERRO] server.py NAO existe
    )
) else (
    echo    [ERRO] Pasta backend NAO existe
)

echo.
echo 2. Verificando pasta frontend:
if exist "frontend" (
    echo    [OK] Pasta frontend existe
    if exist "frontend\package.json" (
        echo    [OK] package.json existe
    ) else (
        echo    [ERRO] package.json NAO existe
    )
    if exist "frontend\src" (
        echo    [OK] Pasta src existe
    ) else (
        echo    [ERRO] Pasta src NAO existe
    )
) else (
    echo    [ERRO] Pasta frontend NAO existe
)

echo.
echo 3. Listando arquivos na pasta atual:
dir /b

echo.
echo =====================================
echo         RESUMO DA VERIFICACAO
echo =====================================
echo.

if exist "backend\requirements.txt" if exist "frontend\package.json" (
    echo ESTRUTURA OK! Pode executar INSTALAR-SIMPLES.bat
) else (
    echo ESTRUTURA INCOMPLETA!
    echo.
    echo SOLUCOES:
    echo 1. Baixe novamente o pacote completo
    echo 2. Extraia todos os arquivos
    echo 3. Execute os scripts dentro da pasta extraida
    echo 4. Verifique se nao faltam arquivos
)

echo.
pause