using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("Comments")]
    public class Comment
    {
        [Key]
        [Column("ID")]
        public int Id { get; set; }

        [Required]
        [Column("CustomerID")]
        public int CustomerId { get; set; }

        [Required]
        [Column("UserID")]
        public int UserId { get; set; }

        [Required]
        [Column("Comment")]
        public string Texto { get; set; } = string.Empty;

        [Column("CriadoPor")]
        public string CriadoPor { get; set; } = string.Empty;

        [Column("DataCriacao")]
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        // Propriedades de navegação opcionais (não mapeadas para foreign keys)
        [NotMapped]
        public User? User { get; set; }
        
        [NotMapped]
        public Customer? Customer { get; set; }
    }
}