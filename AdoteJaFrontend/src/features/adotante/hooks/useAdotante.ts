import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAdotante, updateAdotante } from '../api'
import type { UpdateAdotanteRequest } from '../../../types'

export function useAdotante(id: number) {
  return useQuery({
    queryKey: ['adotante', id],
    queryFn: () => fetchAdotante(id),
    enabled: id > 0,
  })
}

export function useUpdateAdotante(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAdotanteRequest) => updateAdotante(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adotante', id] })
    },
  })
}
