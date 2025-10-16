# Comandos para conectar ao GitHub

## Após criar o repositório no GitHub (https://github.com/new):

### 1. Configurar repositório remoto:
```bash
git remote add origin https://github.com/tthimoteo/lucrare-sistema-gestao.git
```

### 2. Fazer push inicial:
```bash
git push -u origin main
```

### 3. Verificar conexão:
```bash
git remote -v
```

## Informações do Repositório:
- **Nome sugerido**: `lucrare-sistema-gestao`
- **Descrição**: "Sistema de gestão de clientes da Lucrare - React + .NET 9"
- **Visibilidade**: Private (recomendado para projeto comercial)
- **Não adicionar**: README, .gitignore, ou LICENSE (já existem)

## Configuração Atual:
- ✅ Git inicializado
- ✅ Usuário: tthimoteo
- ✅ Email: thiago.thimoteo@lucrarecontabilidade.com.br
- ✅ Branch: main
- ✅ Commit inicial feito
- ✅ 85 arquivos prontos para push

## Estrutura do Projeto:
```
📦 lucrare-sistema-gestao/
├── 🔙 backend/          # .NET 9 Web API
├── 🎨 frontend/         # React TypeScript
├── 📁 docs/            # Documentação
├── 🛠️ scripts/         # Scripts de instalação
├── 📋 README.md        # Documentação principal
└── 🔧 .gitignore       # Arquivos ignorados
```