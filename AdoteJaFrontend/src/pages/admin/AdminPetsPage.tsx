import { useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Button } from '../../components/ui/Button'
import { usePets } from '../../features/pets/hooks/usePets'
import { useDeletePet } from '../../features/pets/hooks/useAdminPets'
import { useToast } from '../../contexts/ToastContext'
import { getApiError } from '../../lib/api'
import { especieLabel } from '../../lib/utils'
import { PetFormModal } from '../../features/pets/components/PetFormModal'
import type { Pet } from '../../types'

export function AdminPetsPage() {
  const { data, isLoading, isError } = usePets({ size: 50 })
  const deleteMutation = useDeletePet()
  const { showToast } = useToast()
  const [editPet, setEditPet] = useState<Pet | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleDelete(id: number, nome: string) {
    if (!confirm(`Excluir ${nome}?`)) return
    setDeletingId(id)
    try {
      await deleteMutation.mutateAsync(id)
      showToast(`${nome} excluído.`, 'success')
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-label mb-2">Painel</p>
          <h1 className="font-display text-5xl font-light text-carbon-800">Pets</h1>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Novo pet</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-40" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30">Erro ao carregar pets.</p>
        </div>
      ) : (data?.content ?? []).length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30">Nenhum pet cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data?.content ?? []).map((pet) => (
            <div key={pet.id} className="card p-4 flex flex-col gap-3">
              <div className="aspect-[16/9] bg-areia-100 rounded-xl overflow-hidden">
                {pet.imagemUrl
                  ? <img src={pet.imagemUrl} alt={pet.nome} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
                }
              </div>
              <div>
                <p className="font-display text-lg font-medium text-carbon-800">{pet.nome}</p>
                <p className="font-body text-sm text-carbon-800/50">
                  {pet.caracteristica?.especie ? especieLabel[pet.caracteristica.especie] : '—'}
                  {' · '}
                  {pet.disponivel ? 'Disponível' : 'Indisponível'}
                </p>
              </div>
              <div className="flex gap-2 mt-auto">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setEditPet(pet)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50"
                  loading={deleteMutation.isPending && deletingId === pet.id}
                  onClick={() => handleDelete(pet.id, pet.nome)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showCreate || editPet) && (
        <PetFormModal
          pet={editPet ?? undefined}
          onClose={() => { setShowCreate(false); setEditPet(null) }}
        />
      )}
    </PageLayout>
  )
}
