@echo off
title Sistema de Cadastro de Clientes - Lucrare
color 0A

echo ====================================================
echo    SISTEMA DE CADASTRO DE CLIENTES - LUCRARE
echo ====================================================
echo.
echo Bem-vindo ao sistema de gerenciamento de clientes!
echo.
echo Este e um script rapido para iniciar o sistema.
echo Para mais opcoes, use: scripts\menu.bat
echo.
echo Pressione qualquer tecla para iniciar...
pause > nul

REM Verificar se as dependencias estao instaladas
if not exist "backend\bin" (
    echo [INFO] Primeira execucao detectada. Instalando dependencias...
    call scripts\install.bat
    if errorlevel 1 (
        echo [ERRO] Falha na instalacao. Verifique os pre-requisitos.
        pause
        exit /b 1
    )
)

if not exist "frontend\node_modules" (
    echo [INFO] Dependencias do frontend nao encontradas. Instalando...
    cd frontend
    npm install
    if errorlevel 1 (
        echo [ERRO] Falha ao instalar dependencias do frontend
        pause
        exit /b 1
    )
    cd ..
)

REM Iniciar o sistema
call scripts\start.bat