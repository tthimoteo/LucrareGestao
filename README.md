# 📋 Sistema de Cadastro de Clientes

Sistema completo de gerenciamento de clientes empresariais com autenticação JWT, desenvolvido com **React + TypeScript** (frontend) e **C# .NET 9** (backend).

## 🚀 Funcionalidades Principais

### ✅ **Autenticação e Segurança**
- Sistema de login/registro com JWT
- Autenticação com BCrypt
- Proteção de rotas
- Logout seguro

### ✅ **Gestão de Clientes**
- **CRUD Completo**: Criar, Visualizar, Editar e Excluir clientes
- **Campos Empresariais**: CNPJ, Razão Social, Tipo de Empresa
- **Informações de Contato**: Nome, Email, Telefone
- **Dados Financeiros**: Valor do Honorário
- **Status**: Ativo/Inativo

### ✅ **Sistema de Comentários**
- **Comentários por Cliente**: Histórico de interações e observações
- **Autoria Identificada**: Cada comentário registra o usuário autor
- **Timezone Brasileiro**: Horários convertidos automaticamente para UTC-3
- **CRUD Completo**: Criar, Editar e Excluir comentários
- **Interface Modal**: Visualização organizada em modal dedicado

### ✅ **Interface Responsiva**
- **Desktop**: Visualização em tabela completa
- **Mobile**: Cards otimizados para touch
- **Design Responsivo**: Breakpoints automáticos
- **Tema Personalizado**: Cores da marca Lucrare

### ✅ **Busca e Filtros**
- Pesquisa em tempo real
- Filtro por: Razão Social, Nome do Contato, CNPJ
- Busca case-insensitive
- Botão de limpar filtros

## �️ Tecnologias Utilizadas

### Backend
- **C# .NET 9** - Framework principal
- **Entity Framework Core** - ORM para acesso ao banco
- **PostgreSQL** - Banco de dados
- **JWT Bearer Authentication** - Autenticação segura
- **BCrypt** - Hash de senhas

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Axios** - Cliente HTTP
- **React Router** - Roteamento
- **CSS Modules** - Estilização

## 📁 Estrutura do Projeto

```
CadastroCliente/
├── backend/                 # API C# .NET
│   ├── Controllers/         # Controladores da API
│   ├── Models/             # Modelos de dados
│   ├── DTOs/               # Data Transfer Objects
│   ├── Services/           # Serviços da aplicação
│   ├── Data/               # Contexto do banco de dados
│   └── Program.cs          # Configuração da aplicação
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── contexts/       # Contextos React
│   │   └── types/          # Definições de tipos TypeScript
└── README.md
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Visual Studio Code](https://code.visualstudio.com/)

### 1. Configuração do Backend

```bash
# Navegue até o diretório do backend
cd backend

# Restaure as dependências
dotnet restore

# Execute o projeto
dotnet run
```

O backend estará disponível em: `https://localhost:7148`

### 2. Configuração do Frontend

```bash
# Em uma nova janela do terminal, navegue até o frontend
cd frontend

# Instale as dependências
npm install

# Execute o projeto
npm start
```

O frontend estará disponível em: `http://localhost:3000`

## 🔐 Funcionalidades

### Autenticação
- ✅ Registro de novos usuários
- ✅ Login com username/senha
- ✅ Autenticação JWT
- ✅ Proteção de rotas
- ✅ Logout seguro

### Gestão de Clientes
- ✅ Listar todos os clientes
- ✅ Adicionar novo cliente com campos empresariais
- ✅ Editar cliente existente
- ✅ Excluir cliente
- ✅ Validação de CNPJ único
- ✅ Controle de status ativo/inativo
- ✅ Categorização por tipo de empresa
- ✅ Gestão de valores financeiros

## 📊 Banco de Dados

O projeto utiliza **PostgreSQL** com as seguintes tabelas:

### Users
- Id (int, PK)
- Username (string, unique)
- Email (string, unique)
- PasswordHash (string)
- CreatedAt (datetime)

### Customers
- Id (int, PK)
- CNPJ (string, unique)
- RazaoSocial (string)
- Ativo (boolean)
- Tipo (enum: MEI, Simples, LucroPresumido, LucroReal)
- FaturamentoAnual (decimal)
- NomeContato (string)
- EmailContato (string, unique)
- TelefoneContato (string)
- ValorHonorario (decimal)
- CreatedAt (datetime)
- UpdatedAt (datetime)

### Comments
- Id (int, PK)
- CustomerId (int, FK para Customers)
- UserId (int, FK para Users)
- Texto (string)
- CriadoPor (string)
- DataCriacao (datetime)

**Relacionamentos:**
- Um Cliente pode ter múltiplos Comentários (1:N)
- Um Usuário pode criar múltiplos Comentários (1:N)
- Timezone: Todos os comentários são salvos em UTC e convertidos para horário brasileiro (UTC-3) na exibição

## 🔧 Configuração de Desenvolvimento

### VS Code Extensions Recomendadas
- C# Dev Kit
- Prettier - Code formatter
- Tailwind CSS IntelliSense

### Configuração da API
As configurações principais estão em `backend/appsettings.json`:
- String de conexão do PostgreSQL
- Configurações JWT (chave, issuer, audience)

### Configuração do Frontend
O frontend está configurado para se comunicar com a API em `https://localhost:7148`

## 🚀 Deploy

### Backend
```bash
cd backend
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd frontend
npm run build
```

## 🧪 Teste da Aplicação

1. **Inicie o backend** (`dotnet run` no diretório backend)
2. **Inicie o frontend** (`npm start` no diretório frontend)
3. **Acesse** `http://localhost:3000`
4. **Crie uma conta** ou faça login
5. **Gerencie clientes** através da interface

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login

### Clientes (Requer autenticação)
- `GET /api/customers` - Listar clientes
- `GET /api/customers/{id}` - Obter cliente por ID
- `POST /api/customers` - Criar cliente
- `PUT /api/customers/{id}` - Atualizar cliente
- `DELETE /api/customers/{id}` - Excluir cliente

## 🔒 Segurança

- Senhas são hasheadas com BCrypt
- Autenticação via JWT tokens
- Validação de dados no frontend e backend
- Proteção contra ataques CORS configurada
- Validação de unicidade de email e CNPJ

### 🎯 **Validações de Formulário**
- **CNPJ**: Limitado a 14 dígitos numéricos com máscara visual (00.000.000/0000-00)
- **Telefone**: Limitado a 11 dígitos numéricos com formatação automática
- **Email**: Validação de formato e bloqueio de caracteres inválidos
- **Campos Obrigatórios**: Validação em tempo real e no submit

## 🌟 Próximas Melhorias

- [ ] Paginação na lista de clientes
- [x] ~~Busca e filtros~~ ✅ **Implementado**
- [x] ~~Sistema de comentários~~ ✅ **Implementado**
- [x] ~~Validações robustas de formulário~~ ✅ **Implementado**
- [x] ~~Migração para PostgreSQL~~ ✅ **Implementado**
- [ ] Upload de foto de perfil
- [ ] Relatórios em PDF
- [ ] Testes automatizados
- [ ] Docker containerização

## 📞 Suporte

Para dúvidas ou sugestões, utilize as issues do GitHub ou contate o desenvolvedor.

---

**Desenvolvido com ❤️ usando .NET e React**