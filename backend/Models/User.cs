using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public UserProfile Perfil { get; set; } = UserProfile.Usuario;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navegação para comentários
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}