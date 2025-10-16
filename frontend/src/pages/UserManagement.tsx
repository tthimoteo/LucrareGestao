import React, { useState, useEffect } from 'react';
import { userService, User } from '../services/userService';
import { UserProfile, CreateUser, UpdateUser } from '../types';
import Header from '../components/Header';
import './Auth.css';
import './Customers.css';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const [formData, setFormData] = useState<CreateUser>({
    username: '',
    email: '',
    password: '',
    perfil: UserProfile.Usuario
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrar usuários quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.perfil.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err: any) {
      setError('Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validações básicas
    if (!formData.username.trim()) {
      setError('Nome de usuário é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return;
    }

    if (!editingUser && !formData.password) {
      setError('Senha é obrigatória');
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      if (editingUser) {
        // Atualizar usuário existente
        const updateData: UpdateUser = {
          username: formData.username,
          email: formData.email,
          perfil: formData.perfil,
          ...(formData.password && { password: formData.password })
        };
        
        await userService.update(editingUser.id, updateData);
        setSuccess('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        await userService.create(formData);
        setSuccess('Usuário criado com sucesso!');
      }

      // Limpar formulário e recarregar lista
      resetForm();
      setIsModalOpen(false);
      await loadUsers();
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      
      if (err.response) {
        const errorMessage = err.response.data;
        if (typeof errorMessage === 'string') {
          setError(errorMessage);
        } else if (errorMessage.message) {
          setError(errorMessage.message);
        } else {
          setError(`Erro ${err.response.status}: ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError('Erro de conexão. Verifique se o servidor está funcionando.');
      } else {
        setError('Erro ao salvar usuário. Tente novamente.');
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      perfil: user.perfil
    });
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${user.username}"?`)) {
      try {
        await userService.delete(user.id);
        setSuccess('Usuário excluído com sucesso!');
        await loadUsers();
      } catch (err: any) {
        console.error('Erro ao excluir usuário:', err);
        if (err.response) {
          setError(err.response.data || 'Erro ao excluir usuário');
        } else {
          setError('Erro ao excluir usuário. Tente novamente.');
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      perfil: UserProfile.Usuario
    });
    setEditingUser(null);
    setError('');
    setSuccess('');
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="customers-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Carregando usuários...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="customers-container">
        <div className="customers-header">
          <h2>Gerenciamento de Usuários</h2>
          <button className="add-btn" onClick={openModal}>
            Adicionar Usuário
          </button>
        </div>

        {/* Campo de Pesquisa */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar por nome, email ou perfil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Limpar
            </button>
          )}
        </div>

        {/* Mensagens */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Tabela de Usuários - Desktop */}
        {filteredUsers.length === 0 ? (
          <div className="no-results">
            {searchTerm ? 'Nenhum usuário encontrado com os critérios de busca.' : 'Nenhum usuário cadastrado.'}
          </div>
        ) : (
          <>
            {/* Visualização Desktop */}
            <div className="customers-table desktop-view">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nome de Usuário</th>
                    <th>Email</th>
                    <th>Perfil</th>
                    <th>Data de Criação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`status ${user.perfil === UserProfile.Administrador ? 'admin' : 'user'}`}>
                          {user.perfil}
                        </span>
                      </td>
                      <td>{user.createdAt ? formatDate(user.createdAt) : '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(user)}
                          >
                            Editar
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(user)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visualização Mobile - Cards */}
            <div className="mobile-view users-cards">
              {filteredUsers.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="card-header">
                    <h4 className="card-title">{user.username}</h4>
                    <span className={`status ${user.perfil === UserProfile.Administrador ? 'admin' : 'user'}`}>
                      {user.perfil}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-field">
                      <label>ID:</label>
                      <span>{user.id}</span>
                    </div>
                    <div className="card-field">
                      <label>Email:</label>
                      <span>{user.email}</span>
                    </div>
                    <div className="card-field">
                      <label>Data de Criação:</label>
                      <span>{user.createdAt ? formatDate(user.createdAt) : '-'}</span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal de Formulário */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Nome de Usuário:</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      clearMessages();
                    }}
                    required
                    placeholder="Digite o nome de usuário"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      clearMessages();
                    }}
                    required
                    placeholder="Digite o email"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">
                    {editingUser ? 'Nova Senha (deixe em branco para manter a atual):' : 'Senha:'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      clearMessages();
                    }}
                    required={!editingUser}
                    placeholder={editingUser ? 'Nova senha (opcional)' : 'Digite a senha (mín. 6 caracteres)'}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="perfil">Perfil:</label>
                  <select
                    id="perfil"
                    value={formData.perfil}
                    onChange={(e) => {
                      setFormData({ ...formData, perfil: e.target.value as UserProfile });
                      clearMessages();
                    }}
                    required
                  >
                    <option value={UserProfile.Usuario}>Usuário</option>
                    <option value={UserProfile.Administrador}>Administrador</option>
                  </select>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="save-btn">
                    {editingUser ? 'Atualizar' : 'Criar'} Usuário
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;