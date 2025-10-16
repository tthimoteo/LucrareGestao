using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DataCheckController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DataCheckController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("status")]
        public async Task<ActionResult> GetDataStatus()
        {
            try
            {
                var usersCount = await _context.Users.CountAsync();
                var customersCount = await _context.Customers.CountAsync();
                var commentsCount = await _context.Comments.CountAsync();

                var sampleUsers = await _context.Users.Take(3).Select(u => new {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.Perfil
                }).ToListAsync();

                var sampleCustomers = await _context.Customers.Take(3).Select(c => new {
                    c.Id,
                    c.CNPJ,
                    c.RazaoSocial,
                    c.EmailContato
                }).ToListAsync();

                return Ok(new
                {
                    Database = "PostgreSQL",
                    ConnectionStatus = "Connected",
                    DataCounts = new
                    {
                        Users = usersCount,
                        Customers = customersCount,
                        Comments = commentsCount,
                        Total = usersCount + customersCount + commentsCount
                    },
                    SampleData = new
                    {
                        Users = sampleUsers,
                        Customers = sampleCustomers
                    },
                    MigrationStatus = new
                    {
                        HasData = (usersCount + customersCount + commentsCount) > 0,
                        IsEmpty = (usersCount + customersCount + commentsCount) == 0,
                        Message = (usersCount + customersCount + commentsCount) == 0 
                            ? "Database is empty - structure migrated but no data transferred"
                            : $"Database contains {usersCount + customersCount + commentsCount} total records"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}