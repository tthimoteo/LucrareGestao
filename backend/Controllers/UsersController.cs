using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using BCrypt.Net;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserResponseDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Perfil = u.Perfil,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Usuário não encontrado");
            }

            var userResponse = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Perfil = user.Perfil,
                CreatedAt = user.CreatedAt
            };

            return Ok(userResponse);
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Usuário não encontrado");
            }

            // Verificar se o username já existe (exceto para o próprio usuário)
            if (await _context.Users.AnyAsync(u => u.Username == updateUserDto.Username && u.Id != id))
            {
                return BadRequest("Nome de usuário já existe");
            }

            // Verificar se o email já existe (exceto para o próprio usuário)
            if (await _context.Users.AnyAsync(u => u.Email == updateUserDto.Email && u.Id != id))
            {
                return BadRequest("Email já está em uso");
            }

            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.Perfil = updateUserDto.Perfil;

            // Atualizar senha se fornecida
            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                if (updateUserDto.Password.Length < 6)
                {
                    return BadRequest("Senha deve ter pelo menos 6 caracteres");
                }
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Usuário atualizado com sucesso" });
            }
            catch (DbUpdateException)
            {
                return BadRequest("Erro ao atualizar usuário");
            }
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto createUserDto)
        {
            if (await _context.Users.AnyAsync(u => u.Username == createUserDto.Username))
            {
                return BadRequest("Nome de usuário já existe");
            }

            if (await _context.Users.AnyAsync(u => u.Email == createUserDto.Email))
            {
                return BadRequest("Email já está em uso");
            }

            if (createUserDto.Password.Length < 6)
            {
                return BadRequest("Senha deve ter pelo menos 6 caracteres");
            }

            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                Perfil = createUserDto.Perfil,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userResponse = new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Perfil = user.Perfil,
                CreatedAt = user.CreatedAt
            };

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userResponse);
        }

        // DELETE: api/users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Usuário não encontrado");
            }

            // Verificar se o usuário tem comentários associados
            var hasComments = await _context.Comments.AnyAsync(c => c.UserId == id);
            if (hasComments)
            {
                return BadRequest("Não é possível excluir usuário que possui comentários. Exclua os comentários primeiro.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Usuário excluído com sucesso" });
        }
    }
}