# Configuração para Deploy no Render

## Configurações necessárias no Render:

### 1. Configurações do Serviço Web
- **Build Command**: `chmod +x build.sh && ./build.sh`
- **Start Command**: `dotnet backend/publish/backend.dll`
- **Environment**: Production
- **Auto Deploy**: Yes

### 2. Variáveis de Ambiente
Adicione as seguintes variáveis de ambiente no painel do Render:

```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:10000
```

### 3. Health Check
- **Health Check Path**: `/health`

### 4. Porta
O serviço está configurado para usar a porta fornecida pela variável de ambiente `PORT` do Render (padrão: 10000).

### 5. Banco de Dados
O banco PostgreSQL já está configurado no Render. A string de conexão está no arquivo `appsettings.Production.json`.

### Troubleshooting
Se houver problemas de deploy:
1. Verifique os logs do Render
2. Certifique-se de que todas as variáveis de ambiente estão configuradas
3. Verifique se o health check está respondendo em `/health`
4. Confirme se a porta está configurada corretamente