import axios from 'axios';

// Detecta automaticamente o ambiente
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://lucraregestao.onrender.com/api'  // URL da sua API no Render
  : 'http://localhost:5129/api';              // URL local para desenvolvimento

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  console.log('Fazendo requisição para:', `${config.baseURL || ''}${config.url || ''}`);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Erro na requisição:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;