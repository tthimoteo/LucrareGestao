@echo off
title Sistema de Clientes - Iniciando...
color 0A

echo ====================================================
echo       INICIANDO SISTEMA DE CADASTRO DE CLIENTES
echo ====================================================
echo.

echo [INFO] Iniciando Backend (.NET API)...
start "Backend API - Cadastro Clientes" cmd /c "cd backend && echo Iniciando Backend... && dotnet run && echo Backend encerrado. && pause"

echo [INFO] Aguardando backend inicializar...
timeout /t 5 /nobreak

echo [INFO] Iniciando Frontend (React)...
start "Frontend React - Cadastro Clientes" cmd /c "cd frontend && echo Iniciando Frontend... && npm start && echo Frontend encerrado. && pause"

echo.
echo ====================================================
echo              SISTEMA INICIADO COM SUCESSO!
echo ====================================================
echo.
echo  Backend API:  https://localhost:7259
echo  Frontend:     http://localhost:3000
echo.
echo  O sistema esta sendo executado em duas janelas separadas.
echo  Feche esta janela quando terminar de usar o sistema.
echo.
echo ====================================================
pause