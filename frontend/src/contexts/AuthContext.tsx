import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

interface User {
  username: string;
  email: string;
  perfil: UserProfile;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, perfil: UserProfile) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getUser();
    
    if (token && savedUser) {
      // Verificar se o usuário salvo tem o campo perfil (compatibilidade)
      const userWithProfile = {
        ...savedUser,
        perfil: savedUser.perfil || UserProfile.Usuario // Default para usuarios antigos
      };
      setIsAuthenticated(true);
      setUser(userWithProfile);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        email: response.email,
        perfil: response.perfil
      }));
      setIsAuthenticated(true);
      setUser({ 
        username: response.username, 
        email: response.email,
        perfil: response.perfil 
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, perfil: UserProfile) => {
    try {
      const response = await authService.register({ username, email, password, perfil });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.username,
        email: response.email,
        perfil: response.perfil
      }));
      setIsAuthenticated(true);
      setUser({ 
        username: response.username, 
        email: response.email,
        perfil: response.perfil 
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};