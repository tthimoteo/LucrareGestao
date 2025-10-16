using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Comments/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByCustomer(int customerId)
        {
            try
            {
                // Usar SQL bruto para buscar comentários
                var sql = "SELECT * FROM Comments WHERE UserID = @CustomerId ORDER BY DataCriacao DESC";
                var parameter = new Microsoft.Data.Sqlite.SqliteParameter("@CustomerId", customerId);
                
                var connection = _context.Database.GetDbConnection();
                await _context.Database.OpenConnectionAsync();
                
                var command = connection.CreateCommand();
                command.CommandText = sql;
                command.Parameters.Add(parameter);
                
                var reader = await command.ExecuteReaderAsync();
                var comments = new List<Comment>();
                
                while (reader.Read())
                {
                    var comment = new Comment
                    {
                        Id = Convert.ToInt32(reader["ID"]),
                        CustomerId = Convert.ToInt32(reader["CustomerID"]), // Usuário que criou
                        UserId = Convert.ToInt32(reader["UserID"]), // Cliente sobre o qual é o comentário
                        Texto = reader["Comment"].ToString() ?? "",
                        CriadoPor = reader["CriadoPor"].ToString() ?? "",
                        DataCriacao = DateTime.Parse(reader["DataCriacao"].ToString() ?? DateTime.UtcNow.ToString())
                    };
                    
                    // Carregar dados do usuário que criou o comentário
                    var user = await _context.Users.FindAsync(comment.CustomerId);
                    comment.User = user;
                    
                    // Carregar dados do cliente sobre o qual é o comentário
                    var customer = await _context.Customers.FindAsync(comment.UserId);
                    comment.Customer = customer;
                    
                    comments.Add(comment);
                }
                
                reader.Close();
                await _context.Database.CloseConnectionAsync();
                
                return Ok(comments);
            }
            catch (Exception ex)
            {
                await _context.Database.CloseConnectionAsync();
                Console.WriteLine($"ERRO SQL SELECT: {ex.Message}");
                return StatusCode(500, $"Erro ao buscar comentários: {ex.Message}");
            }
        }

        // GET: api/Comments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Customer)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (comment == null)
            {
                return NotFound();
            }

            return Ok(comment);
        }

        // POST: api/Comments
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(CreateCommentDto createCommentDto)
        {
            // Log de debug para verificar claims
            Console.WriteLine("=== DEBUG POST COMMENT ===");
            Console.WriteLine($"Claims do usuário:");
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"  {claim.Type}: {claim.Value}");
            }

            // Obter o ID do usuário do token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            Console.WriteLine($"UserIdClaim encontrado: {userIdClaim?.Value ?? "NULL"}");
            
            if (userIdClaim == null)
            {
                Console.WriteLine("ERRO: Token inválido - userIdClaim é null");
                return Unauthorized("Token inválido");
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                Console.WriteLine($"ERRO: ID do usuário inválido - não foi possível converter '{userIdClaim.Value}' para int");
                return Unauthorized("ID do usuário inválido");
            }

            Console.WriteLine($"UserId extraído do token: {userId}");
            Console.WriteLine($"CustomerId recebido: {createCommentDto.CustomerId}");

            // Verificar se o cliente existe
            var customer = await _context.Customers.FindAsync(createCommentDto.CustomerId);
            if (customer == null)
            {
                return BadRequest("Cliente não encontrado");
            }

            // Obter informações do usuário
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Unauthorized("Usuário não encontrado");
            }

            var comment = new Comment
            {
                // IMPORTANTE: Na sua tabela, as foreign keys estão invertidas:
                // CustomerID referencia Users, então colocamos o userId aqui
                CustomerId = userId,
                // UserID referencia Customers, então colocamos o customerId aqui  
                UserId = createCommentDto.CustomerId,
                Texto = createCommentDto.Texto,
                CriadoPor = user.Username,
                DataCriacao = DateTime.UtcNow
            };

            // Log para debug
            Console.WriteLine($"Tentando inserir comment: CustomerID={comment.CustomerId} (userId), UserID={comment.UserId} (customerId)");
            Console.WriteLine($"User encontrado: ID={user.Id}, Username={user.Username}");
            Console.WriteLine($"Customer encontrado: ID={customer.Id}, RazaoSocial={customer.RazaoSocial}");

            // Usar SQL bruto para inserir e evitar problemas de foreign key
            try
            {
                var sql = @"
                    INSERT INTO Comments (CustomerID, UserID, Comment, CriadoPor, DataCriacao) 
                    VALUES (@CustomerId, @UserId, @Comment, @CriadoPor, @DataCriacao)";
                
                var parameters = new[]
                {
                    new Microsoft.Data.Sqlite.SqliteParameter("@CustomerId", userId),
                    new Microsoft.Data.Sqlite.SqliteParameter("@UserId", createCommentDto.CustomerId),
                    new Microsoft.Data.Sqlite.SqliteParameter("@Comment", createCommentDto.Texto),
                    new Microsoft.Data.Sqlite.SqliteParameter("@CriadoPor", user.Username),
                    new Microsoft.Data.Sqlite.SqliteParameter("@DataCriacao", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"))
                };

                await _context.Database.ExecuteSqlRawAsync(sql, parameters);

                // Retornar sucesso simples sem buscar o ID
                return Ok(new { 
                    message = "Comentário criado com sucesso",
                    customerId = createCommentDto.CustomerId,
                    texto = createCommentDto.Texto,
                    criadoPor = user.Username,
                    dataCriacao = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO SQL: {ex.Message}");
                return StatusCode(500, $"Erro ao inserir comentário: {ex.Message}");
            }
        }

        // PUT: api/Comments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, UpdateCommentDto updateCommentDto)
        {
            // Verificar se o usuário está autenticado
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            try
            {
                // Usar SQL bruto para buscar o comentário
                var sql = "SELECT * FROM Comments WHERE ID = @Id";
                var parameter = new Microsoft.Data.Sqlite.SqliteParameter("@Id", id);
                
                var connection = _context.Database.GetDbConnection();
                await _context.Database.OpenConnectionAsync();
                
                var command = connection.CreateCommand();
                command.CommandText = sql;
                command.Parameters.Add(parameter);
                
                var reader = await command.ExecuteReaderAsync();
                
                if (!reader.Read())
                {
                    await _context.Database.CloseConnectionAsync();
                    return NotFound();
                }
                
                var commentUserId = Convert.ToInt32(reader["CustomerID"]); // CustomerID referencia Users
                reader.Close();
                
                // Verificar se o usuário pode editar este comentário
                if (commentUserId != userId)
                {
                    await _context.Database.CloseConnectionAsync();
                    return StatusCode(403, new { message = "Você só pode editar seus próprios comentários" });
                }

                // Atualizar usando SQL bruto
                var updateSql = "UPDATE Comments SET Comment = @Texto WHERE ID = @Id";
                var updateCommand = connection.CreateCommand();
                updateCommand.CommandText = updateSql;
                updateCommand.Parameters.Add(new Microsoft.Data.Sqlite.SqliteParameter("@Texto", updateCommentDto.Texto));
                updateCommand.Parameters.Add(new Microsoft.Data.Sqlite.SqliteParameter("@Id", id));
                
                await updateCommand.ExecuteNonQueryAsync();
                await _context.Database.CloseConnectionAsync();

                return Ok(new { message = "Comentário atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                await _context.Database.CloseConnectionAsync();
                Console.WriteLine($"ERRO SQL UPDATE: {ex.Message}");
                return StatusCode(500, $"Erro ao atualizar comentário: {ex.Message}");
            }
        }

        // DELETE: api/Comments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            // Verificar se o usuário está autenticado
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            try
            {
                // Buscar o perfil do usuário atual
                var currentUserSql = "SELECT Perfil FROM Users WHERE Id = @UserId";
                var userParameter = new Microsoft.Data.Sqlite.SqliteParameter("@UserId", userId);
                
                var connection = _context.Database.GetDbConnection();
                await _context.Database.OpenConnectionAsync();
                
                var userCommand = connection.CreateCommand();
                userCommand.CommandText = currentUserSql;
                userCommand.Parameters.Add(userParameter);
                
                var userReader = await userCommand.ExecuteReaderAsync();
                
                if (!userReader.Read())
                {
                    await _context.Database.CloseConnectionAsync();
                    return Unauthorized("Usuário não encontrado");
                }
                
                var userProfile = Convert.ToInt32(userReader["Perfil"]);
                bool isAdmin = userProfile == 1; // 1 = Administrador
                userReader.Close();

                // Usar SQL bruto para buscar o comentário
                var sql = "SELECT * FROM Comments WHERE ID = @Id";
                var parameter = new Microsoft.Data.Sqlite.SqliteParameter("@Id", id);
                
                var command = connection.CreateCommand();
                command.CommandText = sql;
                command.Parameters.Add(parameter);
                
                var reader = await command.ExecuteReaderAsync();
                
                if (!reader.Read())
                {
                    await _context.Database.CloseConnectionAsync();
                    return NotFound();
                }
                
                var commentUserId = Convert.ToInt32(reader["CustomerID"]); // CustomerID referencia Users
                reader.Close();
                
                // Verificar se o usuário pode deletar este comentário
                // Administradores podem deletar qualquer comentário, usuários só podem deletar os próprios
                if (!isAdmin && commentUserId != userId)
                {
                    await _context.Database.CloseConnectionAsync();
                    return StatusCode(403, new { message = "Apenas administradores podem deletar comentários de outros usuários" });
                }

                // Deletar usando SQL bruto
                var deleteSql = "DELETE FROM Comments WHERE ID = @Id";
                var deleteCommand = connection.CreateCommand();
                deleteCommand.CommandText = deleteSql;
                deleteCommand.Parameters.Add(new Microsoft.Data.Sqlite.SqliteParameter("@Id", id));
                
                var rowsAffected = await deleteCommand.ExecuteNonQueryAsync();
                await _context.Database.CloseConnectionAsync();

                if (rowsAffected > 0)
                {
                    return Ok(new { message = "Comentário deletado com sucesso" });
                }
                else
                {
                    return NotFound("Comentário não encontrado");
                }
            }
            catch (Exception ex)
            {
                await _context.Database.CloseConnectionAsync();
                Console.WriteLine($"ERRO SQL DELETE: {ex.Message}");
                return StatusCode(500, $"Erro ao deletar comentário: {ex.Message}");
            }
        }

        private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.Id == id);
        }
    }

    // DTOs para transferência de dados
    public class CreateCommentDto
    {
        public int CustomerId { get; set; }
        public string Texto { get; set; } = string.Empty;
    }

    public class UpdateCommentDto
    {
        public string Texto { get; set; } = string.Empty;
    }
}