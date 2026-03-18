import { api } from '../../lib/api'
import type { Solicitacao } from '../../types'

export async function fetchMinhasSolicitacoes(): Promise<Solicitacao[]> {
  const response = await api.get<Solicitacao[]>('/solicitacoes/minhas')
  return response.data
}

export async function criarSolicitacao(petId: number): Promise<Solicitacao> {
  const response = await api.post<Solicitacao>('/solicitacoes', { petId })
  return response.data
}
