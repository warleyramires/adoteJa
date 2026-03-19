import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPet, updatePet, deletePet } from '../adminApi'
import type { CreatePetRequest } from '../../../types'

export function useCreatePet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, imagem }: { data: CreatePetRequest; imagem?: File }) =>
      createPet(data, imagem),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] }),
  })
}

export function useUpdatePet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data, imagem }: { id: number; data: Partial<CreatePetRequest>; imagem?: File }) =>
      updatePet(id, data, imagem),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] }),
  })
}

export function useDeletePet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePet(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['pets'] }),
  })
}
