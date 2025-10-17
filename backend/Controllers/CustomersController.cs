using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {
            try
            {
                Console.WriteLine("Iniciando busca de clientes...");
                
                var customers = await _context.Customers
                    .Select(c => new CustomerDto
                    {
                        Id = c.Id,
                        CNPJ = c.CNPJ ?? "",
                        RazaoSocial = c.RazaoSocial ?? "",
                        Ativo = c.Ativo,
                        Tipo = c.Tipo,
                        FaturamentoAnual = c.FaturamentoAnual ?? 0m,
                        NomeContato = c.NomeContato ?? "",
                        EmailContato = c.EmailContato ?? "",
                        TelefoneContato = c.TelefoneContato ?? "",
                        ValorHonorario = c.ValorHonorario ?? 0m,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt
                    })
                    .ToListAsync();

                Console.WriteLine($"Encontrados {customers.Count} clientes");
                return Ok(customers);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar clientes: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Erro interno do servidor", details = ex.Message });
            }
        }

        [HttpPost("test")]
        public IActionResult TestPost([FromBody] CreateCustomerDto dto)
        {
            Console.WriteLine($"Teste POST recebido: {System.Text.Json.JsonSerializer.Serialize(dto)}");
            Console.WriteLine($"ModelState válido: {ModelState.IsValid}");
            
            if (!ModelState.IsValid)
            {
                var errors = ModelState.ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? new string[0]
                );
                return BadRequest(new { errors = errors });
            }
            
            return Ok(new { message = "Dados recebidos com sucesso", data = dto });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDto = new CustomerDto
            {
                Id = customer.Id,
                CNPJ = customer.CNPJ,
                RazaoSocial = customer.RazaoSocial,
                Ativo = customer.Ativo,
                Tipo = customer.Tipo,
                FaturamentoAnual = customer.FaturamentoAnual,
                NomeContato = customer.NomeContato,
                EmailContato = customer.EmailContato,
                TelefoneContato = customer.TelefoneContato,
                ValorHonorario = customer.ValorHonorario,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt
            };

            return Ok(customerDto);
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> CreateCustomer(CreateCustomerDto createCustomerDto)
        {
            Console.WriteLine($"Recebendo requisição POST para criar cliente: {System.Text.Json.JsonSerializer.Serialize(createCustomerDto)}");
            
            // Validar o modelo
            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState inválido:");
                foreach (var error in ModelState)
                {
                    Console.WriteLine($"  {error.Key}: {string.Join(", ", error.Value.Errors.Select(e => e.ErrorMessage))}");
                }
                return BadRequest(ModelState);
            }

            // Verificar se CNPJ já existe
            if (await _context.Customers.AnyAsync(c => c.CNPJ == createCustomerDto.CNPJ))
            {
                Console.WriteLine($"CNPJ {createCustomerDto.CNPJ} já existe");
                return BadRequest("CNPJ já está em uso");
            }

            // Verificar se email já existe
            if (await _context.Customers.AnyAsync(c => c.EmailContato == createCustomerDto.EmailContato))
            {
                Console.WriteLine($"Email {createCustomerDto.EmailContato} já existe");
                return BadRequest("Email de contato já está em uso");
            }

            var customer = new Customer
            {
                CNPJ = createCustomerDto.CNPJ,
                RazaoSocial = createCustomerDto.RazaoSocial,
                Ativo = createCustomerDto.Ativo,
                Tipo = createCustomerDto.Tipo,
                FaturamentoAnual = createCustomerDto.FaturamentoAnual,
                NomeContato = createCustomerDto.NomeContato,
                EmailContato = createCustomerDto.EmailContato,
                TelefoneContato = createCustomerDto.TelefoneContato,
                ValorHonorario = createCustomerDto.ValorHonorario
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            var customerDto = new CustomerDto
            {
                Id = customer.Id,
                CNPJ = customer.CNPJ,
                RazaoSocial = customer.RazaoSocial,
                Ativo = customer.Ativo,
                Tipo = customer.Tipo,
                FaturamentoAnual = customer.FaturamentoAnual,
                NomeContato = customer.NomeContato,
                EmailContato = customer.EmailContato,
                TelefoneContato = customer.TelefoneContato,
                ValorHonorario = customer.ValorHonorario,
                CreatedAt = customer.CreatedAt,
                UpdatedAt = customer.UpdatedAt
            };

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customerDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, UpdateCustomerDto updateCustomerDto)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            if (await _context.Customers.AnyAsync(c => c.CNPJ == updateCustomerDto.CNPJ && c.Id != id))
            {
                return BadRequest("CNPJ já está em uso");
            }

            if (await _context.Customers.AnyAsync(c => c.EmailContato == updateCustomerDto.EmailContato && c.Id != id))
            {
                return BadRequest("Email de contato já está em uso");
            }

            customer.CNPJ = updateCustomerDto.CNPJ;
            customer.RazaoSocial = updateCustomerDto.RazaoSocial;
            customer.Ativo = updateCustomerDto.Ativo;
            customer.Tipo = updateCustomerDto.Tipo;
            customer.FaturamentoAnual = updateCustomerDto.FaturamentoAnual;
            customer.NomeContato = updateCustomerDto.NomeContato;
            customer.EmailContato = updateCustomerDto.EmailContato;
            customer.TelefoneContato = updateCustomerDto.TelefoneContato;
            customer.ValorHonorario = updateCustomerDto.ValorHonorario;
            customer.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            try
            {
                // Debug: Log de todos os claims do usuário
                Console.WriteLine("=== DEBUG DELETE CUSTOMER ===");
                Console.WriteLine($"Claims do usuário:");
                foreach (var claim in User.Claims)
                {
                    Console.WriteLine($"  {claim.Type}: {claim.Value}");
                }

                // Obter o ID do usuário do token JWT
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized("Token inválido");
                }

                Console.WriteLine($"UserId extraído do token: {userId}");

                // Buscar o usuário no banco para verificar o perfil
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return Unauthorized("Usuário não encontrado");
                }

                Console.WriteLine($"Usuário encontrado: {user.Username}, Perfil: {user.Perfil}");

                // Verificar se o usuário é administrador
                bool isAdmin = user.Perfil == UserProfile.Administrador;
                
                if (!isAdmin)
                {
                    Console.WriteLine($"Acesso negado. Perfil '{user.Perfil}' não é Administrador");
                    return StatusCode(403, new { message = "Apenas administradores podem excluir clientes." });
                }

                Console.WriteLine("Usuário é administrador, prosseguindo com exclusão...");

                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    return NotFound();
                }

                // O cascade delete está configurado na migração, então os comentários
                // serão deletados automaticamente pelo banco de dados
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO ao deletar cliente: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Erro ao deletar cliente: {ex.Message}");
            }
        }
    }
}