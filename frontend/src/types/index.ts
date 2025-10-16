export interface User {
  id: number;
  username: string;
  email: string;
  perfil: UserProfile;
  createdAt?: string;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  perfil: UserProfile;
}

export interface UpdateUser {
  username: string;
  email: string;
  password?: string;
  perfil: UserProfile;
}

export enum UserProfile {
  Usuario = 'Usuario',
  Administrador = 'Administrador'
}

export enum CompanyType {
  MEI = 'MEI',
  Simples = 'Simples',
  LucroPresumido = 'LucroPresumido',
  LucroReal = 'LucroReal'
}

export interface Customer {
  id: number;
  cnpj: string;
  razaoSocial: string;
  ativo: boolean;
  tipo: CompanyType;
  faturamentoAnual: number;
  nomeContato: string;
  emailContato: string;
  telefoneContato: string;
  valorHonorario: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomer {
  cnpj: string;
  razaoSocial: string;
  ativo: boolean;
  tipo: CompanyType;
  faturamentoAnual: number;
  nomeContato: string;
  emailContato: string;
  telefoneContato: string;
  valorHonorario: number;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  perfil: UserProfile;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  perfil: UserProfile;
}