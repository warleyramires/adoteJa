import { api } from '../../lib/api'
import type { Adotante, UpdateAdotanteRequest } from '../../types'

export async function fetchAdotante(id: number): Promise<Adotante> {
  const response = await api.get<Adotante>(`/adotantes/${id}`)
  return response.data
}

export async function updateAdotante(id: number, data: UpdateAdotanteRequest): Promise<Adotante> {
  const response = await api.put<Adotante>(`/adotantes/${id}`, data)
  return response.data
}
