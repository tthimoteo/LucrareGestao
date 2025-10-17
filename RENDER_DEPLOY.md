# 🚀 Configuração para Deploy no Render

## ⚙️ Configurações necessárias no Render:

### 1. 🔧 Configurações do Serviço Web
- **Build Command**: `chmod +x build.sh && ./build.sh`
- **Start Command**: `dotnet publish/backend.dll`
- **Environment**: `dotnet` (não Production)
- **Auto Deploy**: Yes
- **Plan**: Free

### 2. 🌍 Variáveis de Ambiente
Adicione as seguintes variáveis de ambiente no painel do Render:

```bash
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:10000
```

### 3. 🩺 Health Check
- **Health Check Path**: `/health`
- **Health Check Response**: JSON com status da API

### 4. 🌐 URLs de Teste
- **Página Principal**: `https://lucraregestao.onrender.com/`
- **Health Check**: `https://lucraregestao.onrender.com/health`
- **API Endpoints**: `https://lucraregestao.onrender.com/api/`

### 5. 🗄️ Banco de Dados
O banco PostgreSQL já está configurado no Render. A string de conexão está no arquivo `appsettings.Production.json`.

### 6. 🔧 Troubleshooting

#### Se ainda houver erro 502:
1. ✅ **Verifique os logs do Render** (Deploy > Logs)
2. ✅ **Confirme as variáveis de ambiente**
3. ✅ **Teste o health check**: `/health`
4. ✅ **Verifique se a porta está correta** (10000)
5. ✅ **Confirme o Start Command**: `dotnet publish/backend.dll`

#### Comandos de teste local:
```bash
# Testar build
chmod +x build.sh && ./build.sh

# Testar start
dotnet publish/backend.dll
```

### 7. 📱 Frontend (Próximo Passo)
Para o frontend React, você precisará de um serviço separado ou usar um provedor como Netlify/Vercel.