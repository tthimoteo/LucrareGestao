@echo off
title Sistema de Cadastro de Clientes - Lucrare
color 0A

echo ====================================================
echo    SISTEMA DE CADASTRO DE CLIENTES - LUCRARE
echo ====================================================
echo.
echo [1] Instalar dependencias
echo [2] Iniciar aplicacao completa
echo [3] Iniciar apenas Backend (.NET)
echo [4] Iniciar apenas Frontend (React)
echo [5] Limpar cache e reinstalar
echo [6] Sair
echo.
set /p choice="Escolha uma opcao (1-6): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto start_all
if "%choice%"=="3" goto start_backend
if "%choice%"=="4" goto start_frontend
if "%choice%"=="5" goto clean_install
if "%choice%"=="6" goto end

:install
echo.
echo ====================================================
echo             INSTALANDO DEPENDENCIAS
echo ====================================================
echo.
echo [INFO] Instalando dependencias do Backend (.NET)...
cd backend
dotnet restore
if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias do backend
    pause
    goto end
)
echo [OK] Backend configurado com sucesso!
echo.
echo [INFO] Instalando dependencias do Frontend (React)...
cd ..\frontend
npm install
if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias do frontend
    pause
    goto end
)
echo [OK] Frontend configurado com sucesso!
echo.
echo ====================================================
echo        INSTALACAO CONCLUIDA COM SUCESSO!
echo ====================================================
echo.
echo Pressione qualquer tecla para voltar ao menu...
pause > nul
cd ..
goto menu

:start_all
echo.
echo ====================================================
echo           INICIANDO APLICACAO COMPLETA
echo ====================================================
echo.
echo [INFO] Iniciando Backend (.NET) em nova janela...
start "Backend API" cmd /c "cd backend && dotnet run && pause"
timeout /t 3
echo [INFO] Aguardando backend inicializar...
timeout /t 5
echo [INFO] Iniciando Frontend (React) em nova janela...
start "Frontend React" cmd /c "cd frontend && npm start && pause"
echo.
echo ====================================================
echo                APLICACAO INICIADA!
echo ====================================================
echo.
echo Backend:  https://localhost:7259
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para voltar ao menu...
pause > nul
goto menu

:start_backend
echo.
echo ====================================================
echo              INICIANDO BACKEND (.NET)
echo ====================================================
echo.
cd backend
dotnet run
pause
cd ..
goto menu

:start_frontend
echo.
echo ====================================================
echo            INICIANDO FRONTEND (React)
echo ====================================================
echo.
cd frontend
npm start
pause
cd ..
goto menu

:clean_install
echo.
echo ====================================================
echo         LIMPANDO CACHE E REINSTALANDO
echo ====================================================
echo.
echo [INFO] Limpando cache do .NET...
cd backend
dotnet clean
dotnet restore
echo [OK] Cache do backend limpo!
echo.
echo [INFO] Limpando cache do Node.js...
cd ..\frontend
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm cache clean --force
npm install
echo [OK] Cache do frontend limpo!
echo.
echo ====================================================
echo            LIMPEZA CONCLUIDA COM SUCESSO!
echo ====================================================
echo.
echo Pressione qualquer tecla para voltar ao menu...
pause > nul
cd ..
goto menu

:menu
cls
color 0A
echo ====================================================
echo    SISTEMA DE CADASTRO DE CLIENTES - LUCRARE
echo ====================================================
echo.
echo [1] Instalar dependencias
echo [2] Iniciar aplicacao completa
echo [3] Iniciar apenas Backend (.NET)
echo [4] Iniciar apenas Frontend (React)
echo [5] Limpar cache e reinstalar
echo [6] Sair
echo.
set /p choice="Escolha uma opcao (1-6): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto start_all
if "%choice%"=="3" goto start_backend
if "%choice%"=="4" goto start_frontend
if "%choice%"=="5" goto clean_install
if "%choice%"=="6" goto end
goto menu

:end
echo.
echo Obrigado por usar o Sistema de Cadastro de Clientes!
echo.
pause