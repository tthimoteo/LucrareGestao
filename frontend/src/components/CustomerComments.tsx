import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from '../types';
import commentService, { Comment, CreateCommentDto } from '../services/commentService';
import './CustomerComments.css';

interface CustomerCommentsProps {
  customerId: number;
  customerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerComments: React.FC<CustomerCommentsProps> = ({ 
  customerId, 
  customerName, 
  isOpen, 
  onClose 
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  
  const { user } = useAuth();
  const isAdmin = user?.perfil === UserProfile.Administrador;

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.getCommentsByCustomer(customerId);
      setComments(data);
    } catch (error) {
      setError('Erro ao carregar comentários');
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (isOpen && customerId) {
      loadComments();
    }
  }, [isOpen, customerId, loadComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const commentData: CreateCommentDto = {
        customerId,
        texto: newComment.trim()
      };
      
      const createdComment = await commentService.createComment(commentData);
      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
    } catch (error) {
      setError('Erro ao adicionar comentário');
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    // Verificar se o usuário pode editar este comentário
    if (!canEditComment(comment)) {
      setError('Você só pode editar seus próprios comentários.');
      return;
    }
    
    setEditingComment(comment.id);
    setEditText(comment.texto);
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editText.trim()) return;

    // Verificar se o usuário pode editar este comentário
    const comment = comments.find(c => c.id === commentId);
    if (!comment || !canEditComment(comment)) {
      setError('Você só pode editar seus próprios comentários.');
      return;
    }

    try {
      await commentService.updateComment(commentId, { texto: editText.trim() });
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, texto: editText.trim() }
          : comment
      ));
      setEditingComment(null);
      setEditText('');
    } catch (error) {
      setError('Erro ao editar comentário');
      console.error('Erro ao editar comentário:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      setError('Erro ao excluir comentário');
      console.error('Erro ao excluir comentário:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canDeleteComment = (comment: Comment) => {
    // Administradores podem excluir qualquer comentário
    if (isAdmin) {
      return true;
    }
    // Usuários comuns só podem excluir seus próprios comentários
    return comment.user && user && comment.user.username === user.username;
  };

  const canEditComment = (comment: Comment) => {
    // Apenas o autor do comentário pode editá-lo
    return comment.user && user && comment.user.username === user.username;
  };

  if (!isOpen) return null;

  return (
    <div className="comments-modal-overlay" onClick={onClose}>
      <div className="comments-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <h3>Comentários - {customerName}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="comments-content">
          {/* Formulário para novo comentário */}
          <form onSubmit={handleSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Adicione um comentário sobre este cliente..."
              rows={3}
              disabled={submitting}
              required
            />
            <div className="comment-form-actions">
              <button 
                type="submit" 
                disabled={submitting || !newComment.trim()}
                className="add-comment-btn"
              >
                {submitting ? 'Adicionando...' : 'Adicionar Comentário'}
              </button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}

          {/* Lista de comentários */}
          <div className="comments-list">
            {loading ? (
              <div className="loading">Carregando comentários...</div>
            ) : comments.length === 0 ? (
              <div className="no-comments">
                Nenhum comentário encontrado para este cliente.
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.criadoPor}</span>
                    <span className="comment-date">{formatDate(comment.dataCriacao)}</span>
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="comment-edit">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                      />
                      <div className="comment-edit-actions">
                        <button 
                          onClick={() => handleSaveEdit(comment.id)}
                          className="save-btn"
                        >
                          Salvar
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="cancel-btn"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="comment-content">
                      <p className="comment-text">{comment.texto}</p>
                      <div className="comment-actions">
                        {canEditComment(comment) && (
                          <button 
                            onClick={() => handleEdit(comment)}
                            className="edit-comment-btn"
                          >
                            Editar
                          </button>
                        )}
                        {canDeleteComment(comment) && (
                          <button 
                            onClick={() => handleDelete(comment.id)}
                            className="delete-comment-btn"
                          >
                            Excluir
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerComments;