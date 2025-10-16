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
                // Definir o timezone brasileiro uma vez
                var brazilianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");
                
                var comments = await _context.Comments
                    .Where(c => c.CustomerId == customerId)
                    .OrderByDescending(c => c.DataCriacao)
                    .Select(c => new
                    {
                        id = c.Id,
                        customerId = c.CustomerId,
                        userId = c.UserId,
                        texto = c.Texto,
                        criadoPor = c.CriadoPor,
                        dataCriacao = c.DataCriacao, // Buscar sem conversão
                        user = new
                        {
                            id = c.UserId,
                            username = c.CriadoPor
                        }
                    })
                    .ToListAsync();

                // Converter timezone após buscar os dados
                var commentsWithLocalTime = comments.Select(c => new
                {
                    c.id,
                    c.customerId,
                    c.userId,
                    c.texto,
                    c.criadoPor,
                    dataCriacao = TimeZoneInfo.ConvertTime(c.dataCriacao, brazilianTimeZone).ToString("yyyy-MM-dd HH:mm:ss"),
                    c.user
                });

                return Ok(commentsWithLocalTime);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO ao buscar comentários: {ex.Message}");
                return StatusCode(500, $"Erro ao buscar comentários: {ex.Message}");
            }
        }

        // POST: api/Comments
        [HttpPost]
        public async Task<ActionResult<Comment>> PostComment(CreateCommentDto createCommentDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized("Token inválido");
                }

                var customer = await _context.Customers.FindAsync(createCommentDto.CustomerId);
                if (customer == null)
                {
                    return BadRequest("Cliente não encontrado");
                }

                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return Unauthorized("Usuário não encontrado");
                }

                // Definir o timezone brasileiro uma vez
                var brazilianTimeZone = TimeZoneInfo.FindSystemTimeZoneById("E. South America Standard Time");

                var comment = new Comment
                {
                    CustomerId = createCommentDto.CustomerId,
                    UserId = userId,
                    Texto = createCommentDto.Texto,
                    CriadoPor = user.Username,
                    DataCriacao = DateTime.UtcNow // Salvar sempre em UTC
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                // Retornar o comentário criado com conversão de timezone
                var commentResult = new
                {
                    id = comment.Id,
                    customerId = comment.CustomerId,
                    userId = comment.UserId,
                    texto = comment.Texto,
                    criadoPor = comment.CriadoPor,
                    dataCriacao = TimeZoneInfo.ConvertTime(comment.DataCriacao, brazilianTimeZone).ToString("yyyy-MM-dd HH:mm:ss"),
                    user = new
                    {
                        id = comment.UserId,
                        username = comment.CriadoPor
                    }
                };

                return Ok(commentResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO ao criar comentário: {ex.Message}");
                return StatusCode(500, $"Erro ao criar comentário: {ex.Message}");
            }
        }

        // PUT: api/Comments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(int id, UpdateCommentDto updateCommentDto)
        {
            try
            {
                // Obter o ID do usuário do token JWT
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized("Token inválido");
                }

                // Buscar o comentário
                var comment = await _context.Comments.FindAsync(id);
                if (comment == null)
                {
                    return NotFound();
                }

                // Verificar se o usuário pode editar este comentário
                if (comment.UserId != userId)
                {
                    return StatusCode(403, new { message = "Você só pode editar seus próprios comentários" });
                }

                // Atualizar o comentário
                comment.Texto = updateCommentDto.Texto;
                _context.Entry(comment).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Comentário atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO ao atualizar comentário: {ex.Message}");
                return StatusCode(500, $"Erro ao atualizar comentário: {ex.Message}");
            }
        }

        // DELETE: api/Comments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                // Obter o ID do usuário do token JWT
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized("Token inválido");
                }

                // Buscar o perfil do usuário atual
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return Unauthorized("Usuário não encontrado");
                }

                bool isAdmin = user.Perfil == UserProfile.Administrador;

                // Buscar o comentário
                var comment = await _context.Comments.FindAsync(id);
                if (comment == null)
                {
                    return NotFound();
                }

                // Verificar se o usuário pode deletar este comentário
                // Administradores podem deletar qualquer comentário, usuários só podem deletar os próprios
                if (!isAdmin && comment.UserId != userId)
                {
                    return StatusCode(403, new { message = "Apenas administradores podem deletar comentários de outros usuários" });
                }

                // Deletar o comentário
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Comentário deletado com sucesso" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO ao deletar comentário: {ex.Message}");
                return StatusCode(500, $"Erro ao deletar comentário: {ex.Message}");
            }
        }
    }

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