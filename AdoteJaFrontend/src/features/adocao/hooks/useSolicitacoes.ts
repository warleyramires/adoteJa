import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarSolicitacao, fetchMinhasSolicitacoes } from '../api'

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
