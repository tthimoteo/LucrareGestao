using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("/")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var html = @"
<!DOCTYPE html>
<html>
<head>
    <title>Lucrare Gestão API</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        .status { color: #27ae60; font-weight: bold; }
        .endpoint { background: #ecf0f1; padding: 10px; margin: 10px 0; border-radius: 4px; font-family: monospace; }
        .method { color: #3498db; font-weight: bold; }
    </style>
</head>
<body>
    <div class='container'>
        <h1>🚀 Lucrare Gestão API</h1>
        <p class='status'>✅ Serviço Online e Funcionando</p>
        
        <h3>📋 Endpoints Disponíveis:</h3>
        
        <div class='endpoint'>
            <span class='method'>GET</span> /health - Status da API
        </div>
        
        <div class='endpoint'>
            <span class='method'>POST</span> /api/auth/login - Login de usuário
        </div>
        
        <div class='endpoint'>
            <span class='method'>POST</span> /api/auth/register - Registro de usuário
        </div>
        
        <div class='endpoint'>
            <span class='method'>GET</span> /api/customers - Listar clientes
        </div>
        
        <div class='endpoint'>
            <span class='method'>POST</span> /api/customers - Criar cliente
        </div>
        
        <div class='endpoint'>
            <span class='method'>GET</span> /api/comments/customer/{id} - Comentários do cliente
        </div>
        
        <h3>🔗 Links Úteis:</h3>
        <p>
            • <a href='/health'>Health Check</a><br>
            • <a href='https://github.com/tthimoteo/LucrareGestao'>Código Fonte</a>
        </p>
        
        <hr>
        <small>
            Ambiente: " + (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development") + @" | 
            Versão: 1.0.0 | 
            Deploy: " + DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm") + @" UTC
        </small>
    </div>
</body>
</html>";

            return Content(html, "text/html");
        }
    }
}