# Cadastro de Clientes - Instruções do Projeto

Este é um sistema de cadastro de clientes com autenticação, construído com React (frontend) e C# .NET Web API (backend) usando SQLite como banco de dados.

## Estrutura do Projeto
- `backend/`: API C# .NET com autenticação JWT
- `frontend/`: Aplicação React com sistema de login
- `database/`: Configurações e modelos do SQLite

## Tecnologias Utilizadas
- **Frontend**: React, TypeScript, Axios, React Router
- **Backend**: C# .NET 8, Entity Framework Core, JWT Authentication
- **Banco de Dados**: SQLite
- **Autenticação**: JWT Tokens

## Funcionalidades
- Sistema de login e autenticação
- CRUD completo de clientes
- Interface responsiva
- Validação de dados
- Segurança com JWT

## Comandos de Desenvolvimento
- Backend: `dotnet run` no diretório backend/
- Frontend: `npm start` no diretório frontend/