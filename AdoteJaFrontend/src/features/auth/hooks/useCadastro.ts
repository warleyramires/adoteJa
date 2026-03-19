import { useMutation } from '@tanstack/react-query'
import { api } from '../../../lib/api'
import type { Adotante } from '../../../types'

interface CadastroRequest {
  nome: string
  email: string
  password: string
  telefone1: string
  telefone2?: string
  cpf: string
  dataNascimento: string
  enderecoDTO: {
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
}

async function cadastrarAdotante(data: CadastroRequest): Promise<Adotante> {
  const response = await api.post<Adotante>('/adotantes', data)
  return response.data
}

export function useCadastro() {
  return useMutation({
    mutationFn: cadastrarAdotante,
  })
}
