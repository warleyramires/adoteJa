import { api } from '../../lib/api'
import type { Pet, CreatePetRequest } from '../../types'

export async function createPet(data: CreatePetRequest, imagem?: File): Promise<Pet> {
  const form = new FormData()
  form.append('dados', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  if (imagem) form.append('imagem', imagem)
  const response = await api.post<Pet>('/pets', form, {
    headers: { 'Content-Type': undefined },
  })
  return response.data
}

export async function updatePet(id: number, data: Partial<CreatePetRequest>, imagem?: File): Promise<Pet> {
  const form = new FormData()
  form.append('dados', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  if (imagem) form.append('imagem', imagem)
  const response = await api.put<Pet>(`/pets/${id}`, form, {
    headers: { 'Content-Type': undefined },
  })
  return response.data
}

export async function deletePet(id: number): Promise<void> {
  await api.delete(`/pets/${id}`)
}
