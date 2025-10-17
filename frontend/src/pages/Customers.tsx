import React, { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';
import { Customer, CreateCustomer, CompanyType, UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import CustomerComments from '../components/CustomerComments';
import './Customers.css';
import './Auth.css';

const Customers: React.FC = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CreateCustomer>({
    cnpj: '',
    razaoSocial: '',
    ativo: true,
    tipo: CompanyType.MEI,
    faturamentoAnual: 0,
    nomeContato: '',
    emailContato: '',
    telefoneContato: '',
    valorHonorario: 0
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  // Filtrar clientes quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.nomeContato.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.cnpj.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Funções de formatação
  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const displayCNPJ = (cnpj: string | null) => {
    if (!cnpj) return '';
    return cnpj.length === 14 ? formatCNPJ(cnpj) : cnpj;
  };

  const displayPhone = (phone: string | null) => {
    if (!phone) return '';
    return phone.length >= 10 ? formatPhone(phone) : phone;
  };

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(''); // Limpar erro anterior
      const data = await customerService.getAll();
      setCustomers(data);
      setFilteredCustomers(data); // Inicializar lista filtrada
    } catch (err: any) {
      console.error('Erro ao carregar clientes:', err);
      
      let errorMessage = 'Erro ao carregar clientes';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.title) {
          errorMessage = err.response.data.title;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.cnpj.trim()) {
      setError('CNPJ é obrigatório');
      return;
    }
    
    // Validação do CNPJ - deve ter exatamente 14 dígitos
    const cnpjDigitsOnly = formData.cnpj.replace(/\D/g, '');
    if (cnpjDigitsOnly.length !== 14) {
      setError('CNPJ deve conter exatamente 14 dígitos');
      return;
    }
    
    if (!formData.razaoSocial.trim()) {
      setError('Razão Social é obrigatória');
      return;
    }
    
    // Validação do email apenas se preenchido
    if (formData.emailContato && formData.emailContato.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailContato.trim())) {
        setError('Email do contato deve ter um formato válido');
        return;
      }
    }
    
    // Validação do telefone - deve ter exatamente 11 dígitos se preenchido
    if (formData.telefoneContato && formData.telefoneContato.trim()) {
      const phoneDigitsOnly = formData.telefoneContato.replace(/\D/g, '');
      if (phoneDigitsOnly.length !== 11) {
        setError('Telefone deve conter exatamente 11 dígitos (incluindo DDD)');
        return;
      }
    }
    
    setError(''); // Limpar erros anteriores
    setSuccessMessage(''); // Limpar mensagem de sucesso anterior
    
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, formData);
        setSuccessMessage('Cliente atualizado com sucesso!');
      } else {
        await customerService.create(formData);
        setSuccessMessage('Cliente cadastrado com sucesso!');
      }
      
      // Recarregar a lista de clientes
      await loadCustomers();
      
      // Fechar o modal
      closeModal();
      
      // Limpar a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err: any) {
      console.error('Erro ao salvar cliente:', err);
      
      // Tratamento seguro de erro
      let errorMessage = 'Erro ao salvar cliente';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.title) {
          errorMessage = err.response.data.title;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
          // Se há erros de validação, combine-os
          const validationErrors = Object.values(err.response.data.errors).flat();
          errorMessage = validationErrors.join('. ');
        }
      }
      
      setError(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    // Verificar se o usuário é administrador
    if (user?.perfil !== UserProfile.Administrador) {
      setError('Apenas administradores podem excluir clientes.');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await customerService.delete(id);
        await loadCustomers();
      } catch (err: any) {
        console.error('Erro ao excluir cliente:', err);
        
        let errorMessage = 'Erro ao excluir cliente';
        if (err.response?.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.title) {
            errorMessage = err.response.data.title;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
        
        setError(errorMessage);
      }
    }
  };

  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        cnpj: customer.cnpj,
        razaoSocial: customer.razaoSocial,
        ativo: customer.ativo,
        tipo: customer.tipo,
        faturamentoAnual: customer.faturamentoAnual,
        nomeContato: customer.nomeContato,
        emailContato: customer.emailContato,
        telefoneContato: customer.telefoneContato,
        valorHonorario: customer.valorHonorario
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        cnpj: '',
        razaoSocial: '',
        ativo: true,
        tipo: CompanyType.MEI,
        faturamentoAnual: 0,
        nomeContato: '',
        emailContato: '',
        telefoneContato: '',
        valorHonorario: 0
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setError('');
    setSuccessMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;

    // Aplicar validações específicas por campo
    if (name === 'cnpj') {
      // Permitir apenas números e limitar a 14 dígitos
      processedValue = value.replace(/\D/g, '').slice(0, 14);
    } else if (name === 'telefoneContato') {
      // Permitir apenas números e limitar a 11 dígitos
      processedValue = value.replace(/\D/g, '').slice(0, 11);
    } else if (name === 'emailContato') {
      // Validação básica de email: verificar se contém @ e não permitir espaços
      if (value.includes(' ')) {
        return; // Não permitir espaços no email
      }
      processedValue = value.trim();
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : type === 'number' 
          ? parseFloat(processedValue) || 0
          : name === 'tipo'
            ? processedValue as CompanyType
            : ['nomeContato', 'emailContato', 'telefoneContato'].includes(name) && processedValue.trim() === ''
              ? null
              : processedValue
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCompanyTypeLabel = (type: CompanyType) => {
    switch (type) {
      case CompanyType.MEI: return 'MEI';
      case CompanyType.Simples: return 'Simples Nacional';
      case CompanyType.LucroPresumido: return 'Lucro Presumido';
      case CompanyType.LucroReal: return 'Lucro Real';
      default: return type;
    }
  };

  const clearFilter = () => {
    setSearchTerm('');
  };

  const openCommentsModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
    setSelectedCustomer(null);
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <Header />
      <div className="customers-container">
        <div className="customers-header">
          <h2>Clientes</h2>
          <button className="add-btn" onClick={() => openModal()}>
            Adicionar Cliente
          </button>
        </div>

        {/* Campo de Pesquisa */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nome da empresa, contato ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={clearFilter} className="clear-search-btn">
              Limpar
            </button>
          )}
        </div>

        {error && <div className="error-message">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {filteredCustomers.length === 0 && !loading && (
          <div className="no-results">
            {searchTerm ? 
              `Nenhum cliente encontrado para "${searchTerm}"` : 
              'Nenhum cliente cadastrado'
            }
          </div>
        )}

        {/* Visualização Desktop - Tabela */}
        {filteredCustomers.length > 0 && (
          <div className="customers-table desktop-view">
            <table>
              <thead>
                <tr>
                  <th>CNPJ</th>
                  <th>Razão Social</th>
                  <th>Tipo</th>
                  <th>Contato</th>
                  <th>Faturamento Anual</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.cnpj}</td>
                  <td>{customer.razaoSocial}</td>
                  <td>{getCompanyTypeLabel(customer.tipo)}</td>
                  <td>
                    <div>
                      <strong>{customer.nomeContato}</strong><br />
                      <small>{customer.emailContato}</small><br />
                      <small>{customer.telefoneContato}</small>
                    </div>
                  </td>
                  <td>{customer.faturamentoAnual ? formatCurrency(customer.faturamentoAnual) : 'R$ 0,00'}</td>
                  <td>
                    <span className={`status ${customer.ativo ? 'active' : 'inactive'}`}>
                      {customer.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="comments-btn"
                        onClick={() => openCommentsModal(customer)}
                      >
                        Comentários
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => openModal(customer)}
                      >
                        Editar
                      </button>
                      {user?.perfil === UserProfile.Administrador && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(customer.id)}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}

        {/* Visualização Mobile - Cards */}
        {filteredCustomers.length > 0 && (
          <div className="customers-cards mobile-view">
            {filteredCustomers.map((customer) => (
            <div key={customer.id} className="customer-card">
              <div className="card-header">
                <h3 className="card-title">{customer.razaoSocial}</h3>
                <span className={`status ${customer.ativo ? 'active' : 'inactive'}`}>
                  {customer.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              
              <div className="card-content">
                <div className="card-field">
                  <label>CNPJ:</label>
                  <span>{customer.cnpj}</span>
                </div>
                
                <div className="card-field">
                  <label>Tipo:</label>
                  <span>{getCompanyTypeLabel(customer.tipo)}</span>
                </div>
                
                <div className="card-field">
                  <label>Contato:</label>
                  <div className="contact-info">
                    <strong>{customer.nomeContato}</strong>
                    <span>{customer.emailContato}</span>
                    <span>{customer.telefoneContato}</span>
                  </div>
                </div>
                
                <div className="card-field">
                  <label>Faturamento Anual:</label>
                  <span className="faturamento">{customer.faturamentoAnual ? formatCurrency(customer.faturamentoAnual) : 'R$ 0,00'}</span>
                </div>
              </div>
              
              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => openModal(customer)}
                >
                  Editar
                </button>
                <button
                  className="comments-btn"
                  onClick={() => openCommentsModal(customer)}
                >
                  Comentários
                </button>
                {user?.perfil === UserProfile.Administrador && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal large-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                <button className="close-btn" onClick={closeModal}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>CNPJ:</label>
                    <input
                      type="text"
                      name="cnpj"
                      value={displayCNPJ(formData.cnpj)}
                      onChange={handleInputChange}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Razão Social:</label>
                    <input
                      type="text"
                      name="razaoSocial"
                      value={formData.razaoSocial}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo:</label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value={CompanyType.MEI}>MEI</option>
                      <option value={CompanyType.Simples}>Simples Nacional</option>
                      <option value={CompanyType.LucroPresumido}>Lucro Presumido</option>
                      <option value={CompanyType.LucroReal}>Lucro Real</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="ativo"
                        checked={formData.ativo}
                        onChange={handleInputChange}
                      />
                      Cliente Ativo
                    </label>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Faturamento Anual (R$):</label>
                    <input
                      type="number"
                      name="faturamentoAnual"
                      value={formData.faturamentoAnual || 0}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Valor Honorário (R$):</label>
                    <input
                      type="number"
                      name="valorHonorario"
                      value={formData.valorHonorario || 0}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Nome do Contato:</label>
                    <input
                      type="text"
                      name="nomeContato"
                      value={formData.nomeContato || ''}
                      onChange={handleInputChange}
                      placeholder="Nome do responsável (opcional)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email do Contato:</label>
                    <input
                      type="email"
                      name="emailContato"
                      value={formData.emailContato || ''}
                      onChange={handleInputChange}
                      placeholder="exemplo@email.com (opcional)"
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      title="Digite um email válido"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone do Contato:</label>
                    <input
                      type="text"
                      name="telefoneContato"
                      value={displayPhone(formData.telefoneContato)}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="save-btn">
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Comentários */}
        {selectedCustomer && (
          <CustomerComments
            customerId={selectedCustomer.id}
            customerName={selectedCustomer.razaoSocial}
            isOpen={isCommentsModalOpen}
            onClose={closeCommentsModal}
          />
        )}
      </div>
    </div>
  );
};

export default Customers;