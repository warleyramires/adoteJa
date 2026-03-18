import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchFuncionarios, createFuncionario } from '../api'
import type { CreateFuncionarioRequest } from '../../../types'

export function useFuncionarios() {
  return useQuery({
    queryKey: ['funcionarios'],
    queryFn: fetchFuncionarios,
  })
}

export function useCreateFuncionario() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFuncionarioRequest) => createFuncionario(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['funcionarios'] }),
  })
}
