using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Customer
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(18)] // CNPJ formato: XX.XXX.XXX/XXXX-XX
        public string CNPJ { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string RazaoSocial { get; set; } = string.Empty;
        
        public bool Ativo { get; set; } = true;
        
        [Required]
        public CompanyType Tipo { get; set; }
        
        [Column(TypeName = "decimal(15,2)")]
        public decimal? FaturamentoAnual { get; set; }
        
        [StringLength(100)]
        public string? NomeContato { get; set; } = string.Empty;
        
        [EmailAddress]
        [StringLength(100)]
        public string? EmailContato { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string TelefoneContato { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal? ValorHonorario { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navegação para comentários
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}