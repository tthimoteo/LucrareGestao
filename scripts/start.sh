#!/bin/bash

# Script de inicialização para Linux/Mac
echo "======================================================"
echo "      INICIANDO SISTEMA DE CADASTRO DE CLIENTES"
echo "======================================================"
echo

echo "[INFO] Iniciando Backend (.NET API)..."
gnome-terminal --title="Backend API - Cadastro Clientes" -- bash -c "cd backend && echo 'Iniciando Backend...' && dotnet run; echo 'Backend encerrado.'; read -p 'Pressione Enter para fechar...'"

echo "[INFO] Aguardando backend inicializar..."
sleep 5

echo "[INFO] Iniciando Frontend (React)..."
gnome-terminal --title="Frontend React - Cadastro Clientes" -- bash -c "cd frontend && echo 'Iniciando Frontend...' && npm start; echo 'Frontend encerrado.'; read -p 'Pressione Enter para fechar...'"

echo
echo "======================================================"
echo "             SISTEMA INICIADO COM SUCESSO!"
echo "======================================================"
echo
echo "  Backend API:  https://localhost:7259"
echo "  Frontend:     http://localhost:3000"
echo
echo "  O sistema está sendo executado em dois terminais separados."
echo "  Feche este terminal quando terminar de usar o sistema."
echo
echo "======================================================"
read -p "Pressione Enter para continuar..."