import api from './api';
import { Customer, CreateCustomer } from '../types';

export const customerService = {
  async getAll(): Promise<Customer[]> {
    console.log('Buscando todos os clientes...');
    try {
      const response = await api.get('/customers');
      console.log('Clientes carregados:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Customer> {
    console.log('Buscando cliente por ID:', id);
    try {
      const response = await api.get(`/customers/${id}`);
      console.log('Cliente encontrado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  },

  async create(customer: CreateCustomer): Promise<Customer> {
    console.log('Criando cliente:', customer);
    
    // Garantir que os valores estão no formato correto
    const customerData = {
      cnpj: customer.cnpj.trim(),
      razaoSocial: customer.razaoSocial.trim(),
      ativo: customer.ativo,
      tipo: customer.tipo, // Enum será serializado automaticamente
      faturamentoAnual: Number(customer.faturamentoAnual) || 0,
      nomeContato: customer.nomeContato ? customer.nomeContato.trim() : null,
      emailContato: customer.emailContato ? customer.emailContato.trim() : null,
      telefoneContato: customer.telefoneContato ? customer.telefoneContato.trim() : null,
      valorHonorario: Number(customer.valorHonorario) || 0
    };
    
    console.log('Dados processados para envio:', customerData);
    
    try {
      const response = await api.post('/customers', customerData);
      console.log('Cliente criado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  },

  async update(id: number, customer: Partial<CreateCustomer>): Promise<void> {
    console.log('Atualizando cliente:', id, customer);
    
    // Processar os dados da mesma forma que no create
    const customerData = {
      cnpj: customer.cnpj?.trim(),
      razaoSocial: customer.razaoSocial?.trim(),
      ativo: customer.ativo,
      tipo: customer.tipo,
      faturamentoAnual: customer.faturamentoAnual ? Number(customer.faturamentoAnual) : 0,
      nomeContato: customer.nomeContato ? customer.nomeContato.trim() : null,
      emailContato: customer.emailContato ? customer.emailContato.trim() : null,
      telefoneContato: customer.telefoneContato ? customer.telefoneContato.trim() : null,
      valorHonorario: customer.valorHonorario ? Number(customer.valorHonorario) : 0
    };
    
    try {
      await api.put(`/customers/${id}`, customerData);
      console.log('Cliente atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    console.log('Excluindo cliente:', id);
    try {
      await api.delete(`/customers/${id}`);
      console.log('Cliente excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }
};