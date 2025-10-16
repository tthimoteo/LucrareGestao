using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações específicas para User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();
            });

            // Configurações específicas para Customer
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasIndex(c => c.CNPJ).IsUnique();
                entity.HasIndex(c => c.EmailContato).IsUnique();
            });

            // Configuração básica para Comment (sem foreign keys para evitar conflitos)
            modelBuilder.Entity<Comment>(entity =>
            {
                // Apenas configurações básicas
                entity.HasIndex(c => c.CustomerId);
                entity.HasIndex(c => c.UserId);
                entity.HasIndex(c => c.DataCriacao);
            });
        }
    }
}