import { api } from '../../lib/api'
import type { Funcionario, CreateFuncionarioRequest } from '../../types'

export async function fetchFuncionarios(): Promise<Funcionario[]> {
  const response = await api.get<Funcionario[]>('/funcionarios')
  return response.data
}

export async function createFuncionario(data: CreateFuncionarioRequest): Promise<Funcionario> {
  const response = await api.post<Funcionario>('/funcionarios', data)
  return response.data
}
