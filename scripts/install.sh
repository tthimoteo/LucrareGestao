#!/bin/bash

# Script de instalação para Linux/Mac
echo "======================================================"
echo "     INSTALANDO SISTEMA DE CADASTRO DE CLIENTES"
echo "======================================================"
echo

# Verificar se o .NET está instalado
echo "[1/4] Verificando .NET SDK..."
if ! command -v dotnet &> /dev/null; then
    echo "[ERRO] .NET SDK não encontrado!"
    echo "Por favor, instale o .NET 8 SDK em: https://dotnet.microsoft.com/download"
    exit 1
fi
echo "[OK] .NET SDK encontrado!"

# Verificar se o Node.js está instalado
echo "[2/4] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado!"
    echo "Por favor, instale o Node.js em: https://nodejs.org/"
    exit 1
fi
echo "[OK] Node.js encontrado!"

# Instalar dependências do backend
echo "[3/4] Instalando dependências do Backend..."
cd backend
dotnet restore
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências do backend"
    exit 1
fi
echo "[OK] Backend configurado!"

# Instalar dependências do frontend
echo "[4/4] Instalando dependências do Frontend..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências do frontend"
    exit 1
fi
echo "[OK] Frontend configurado!"

cd ..

echo
echo "======================================================"
echo "       INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "======================================================"
echo
echo "Para iniciar o sistema, execute: ./scripts/start.sh"
echo
read -p "Pressione Enter para continuar..."