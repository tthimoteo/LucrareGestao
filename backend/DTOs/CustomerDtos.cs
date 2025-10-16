using backend.Models;
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string CNPJ { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public CompanyType Tipo { get; set; }
        public decimal FaturamentoAnual { get; set; }
        public string NomeContato { get; set; } = string.Empty;
        public string EmailContato { get; set; } = string.Empty;
        public string TelefoneContato { get; set; } = string.Empty;
        public decimal ValorHonorario { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateCustomerDto
    {
        [Required(ErrorMessage = "CNPJ é obrigatório")]
        [StringLength(18, ErrorMessage = "CNPJ deve ter no máximo 18 caracteres")]
        public string CNPJ { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Razão Social é obrigatória")]
        [StringLength(200, ErrorMessage = "Razão Social deve ter no máximo 200 caracteres")]
        public string RazaoSocial { get; set; } = string.Empty;
        
        public bool Ativo { get; set; } = true;
        
        [Required(ErrorMessage = "Tipo da empresa é obrigatório")]
        public CompanyType Tipo { get; set; }
        
        [Range(0, double.MaxValue, ErrorMessage = "Faturamento Anual deve ser maior ou igual a 0")]
        public decimal FaturamentoAnual { get; set; }
        
        [Required(ErrorMessage = "Nome do contato é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome do contato deve ter no máximo 100 caracteres")]
        public string NomeContato { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email do contato é obrigatório")]
        [EmailAddress(ErrorMessage = "Email do contato deve ter um formato válido")]
        [StringLength(100, ErrorMessage = "Email do contato deve ter no máximo 100 caracteres")]
        public string EmailContato { get; set; } = string.Empty;
        
        [StringLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string TelefoneContato { get; set; } = string.Empty;
        
        [Range(0, double.MaxValue, ErrorMessage = "Valor Honorário deve ser maior ou igual a 0")]
        public decimal ValorHonorario { get; set; }
    }

    public class UpdateCustomerDto
    {
        public string CNPJ { get; set; } = string.Empty;
        public string RazaoSocial { get; set; } = string.Empty;
        public bool Ativo { get; set; }
        public CompanyType Tipo { get; set; }
        public decimal FaturamentoAnual { get; set; }
        public string NomeContato { get; set; } = string.Empty;
        public string EmailContato { get; set; } = string.Empty;
        public string TelefoneContato { get; set; } = string.Empty;
        public decimal ValorHonorario { get; set; }
    }
}