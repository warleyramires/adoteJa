import { useQuery } from '@tanstack/react-query'
import { fetchPets, fetchPetById } from '../api'
import type { PetFilters } from '../../../types'

export function usePets(filters: PetFilters = {}) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: () => fetchPets(filters),
  })
}

export function usePet(id: number) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: () => fetchPetById(id),
    enabled: id > 0,
  })
}
