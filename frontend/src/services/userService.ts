import api from './api';
import { UserProfile } from '../types';

export interface User {
  id: number;
  username: string;
  email: string;
  perfil: UserProfile;
  createdAt: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  perfil: UserProfile;
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  password?: string;
  perfil: UserProfile;
}

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async create(user: CreateUserRequest): Promise<User> {
    const response = await api.post('/users', user);
    return response.data;
  },

  async update(id: number, user: UpdateUserRequest): Promise<void> {
    await api.put(`/users/${id}`, user);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  }
};