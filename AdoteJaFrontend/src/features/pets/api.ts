import { api } from '../../lib/api'
import type { Pet, PetFilters, Page } from '../../types'

export async function fetchPets(filters: PetFilters = {}): Promise<Page<Pet>> {
  const response = await api.get<Page<Pet>>('/pets', { params: filters })
  return response.data
}

export async function fetchPetById(id: number): Promise<Pet> {
  const response = await api.get<Pet>(`/pets/${id}`)
  return response.data
}
