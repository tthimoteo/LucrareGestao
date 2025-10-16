@echo off
title Instalacao - Sistema de Clientes
color 0B

echo ====================================================
echo         INSTALANDO SISTEMA DE CLIENTES
echo ====================================================
echo.

REM Verificar se o .NET esta instalado
echo [1/4] Verificando .NET SDK...
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] .NET SDK nao encontrado!
    echo Por favor, instale o .NET 8 SDK em: https://dotnet.microsoft.com/download
    pause
    exit /b 1
)
echo [OK] .NET SDK encontrado!

REM Verificar se o Node.js esta instalado
echo [2/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js em: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado!

REM Instalar dependencias do backend
echo [3/4] Instalando dependencias do Backend...
cd backend
dotnet restore
if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias do backend
    pause
    exit /b 1
)
echo [OK] Backend configurado!

REM Instalar dependencias do frontend
echo [4/4] Instalando dependencias do Frontend...
cd ..\frontend
npm install
if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias do frontend
    pause
    exit /b 1
)
echo [OK] Frontend configurado!

cd ..

echo.
echo ====================================================
echo        INSTALACAO CONCLUIDA COM SUCESSO!
echo ====================================================
echo.
echo Para iniciar o sistema, execute: scripts\start.bat
echo.
pause