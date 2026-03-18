import { api } from '../../lib/api'
import type { Solicitacao, UpdateSolicitacaoRequest } from '../../types'

export async function fetchMinhasSolicitacoes(): Promise<Solicitacao[]> {
  const response = await api.get<Solicitacao[]>('/solicitacoes/minhas')
  return response.data
}

export async function criarSolicitacao(petId: number): Promise<Solicitacao> {
  const response = await api.post<Solicitacao>('/solicitacoes', { petId })
  return response.data
}

export async function fetchTodasSolicitacoes(): Promise<Solicitacao[]> {
  const response = await api.get<Solicitacao[]>('/solicitacoes')
  return response.data
}

export async function updateSolicitacao(id: number, data: UpdateSolicitacaoRequest): Promise<Solicitacao> {
  const response = await api.put<Solicitacao>(`/solicitacoes/${id}`, data)
  return response.data
}
