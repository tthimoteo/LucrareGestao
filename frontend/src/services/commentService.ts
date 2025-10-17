import api from './api';

export interface Comment {
  id: number;
  customerId: number;
  userId: number;
  texto: string;
  criadoPor: string;
  dataCriacao: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  customer?: {
    id: number;
    razaoSocial: string;
  };
}

export interface CreateCommentDto {
  customerId: number;
  texto: string;
}

export interface UpdateCommentDto {
  texto: string;
}

class CommentService {
  // Buscar comentários por cliente
  async getCommentsByCustomer(customerId: number): Promise<Comment[]> {
    try {
      const response = await api.get(`/comments/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      throw error;
    }
  }

  // Buscar comentário por ID
  async getComment(id: number): Promise<Comment> {
    try {
      const response = await api.get(`/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comentário:', error);
      throw error;
    }
  }

  // Criar novo comentário
  async createComment(commentData: CreateCommentDto): Promise<Comment> {
    try {
      const response = await api.post('/comments', commentData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
      throw error;
    }
  }

  // Atualizar comentário
  async updateComment(id: number, commentData: UpdateCommentDto): Promise<void> {
    try {
      await api.put(`/comments/${id}`, commentData);
    } catch (error) {
      console.error('Erro ao atualizar comentário:', error);
      throw error;
    }
  }

  // Deletar comentário
  async deleteComment(id: number): Promise<void> {
    try {
      await api.delete(`/comments/${id}`);
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      throw error;
    }
  }
}

const commentService = new CommentService();
export default commentService;