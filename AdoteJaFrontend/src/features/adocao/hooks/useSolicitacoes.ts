import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarSolicitacao, fetchMinhasSolicitacoes, fetchTodasSolicitacoes, updateSolicitacao } from '../api'
import type { UpdateSolicitacaoRequest } from '../../../types'

export function useMinhasSolicitacoes() {
  return useQuery({
    queryKey: ['solicitacoes', 'minhas'],
    queryFn: fetchMinhasSolicitacoes,
  })
}

export function useCriarSolicitacao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (petId: number) => criarSolicitacao(petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] })
    },
  })
}

export function useTodasSolicitacoes() {
  return useQuery({
    queryKey: ['solicitacoes', 'todas'],
    queryFn: fetchTodasSolicitacoes,
  })
}

export function useUpdateSolicitacao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSolicitacaoRequest }) =>
      updateSolicitacao(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] })
    },
  })
}
