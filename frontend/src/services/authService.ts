import api from './api';
import { AuthResponse, LoginData, RegisterData } from '../types';

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    console.log('Tentando fazer login:', { username: data.username });
    try {
      const response = await api.post('/auth/login', data);
      console.log('Login bem-sucedido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('Tentando fazer registro:', { username: data.username, email: data.email });
    try {
      const response = await api.post('/auth/register', data);
      console.log('Registro bem-sucedido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};