#!/bin/bash
set -e

echo "🚀 Iniciando build para Render..."

# Navegar para o diretório backend
cd backend

# Restaurar pacotes NuGet
echo "📦 Restaurando pacotes..."
dotnet restore

# Fazer build da aplicação
echo "🔨 Fazendo build..."
dotnet build -c Release

# Publicar aplicação
echo "📋 Publicando aplicação..."
dotnet publish -c Release -o ../publish

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos publicados em: ../publish"