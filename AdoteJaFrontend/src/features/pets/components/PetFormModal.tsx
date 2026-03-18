import { useState, useEffect } from 'react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { useCreatePet, useUpdatePet } from '../hooks/useAdminPets'
import { useToast } from '../../../contexts/ToastContext'
import { getApiError } from '../../../lib/api'
import type { Pet, Especie, Porte, Sexo } from '../../../types'

interface PetFormModalProps {
  pet?: Pet
  onClose: () => void
}

export function PetFormModal({ pet, onClose }: PetFormModalProps) {
  const { showToast } = useToast()
  const createMutation = useCreatePet()
  const updateMutation = useUpdatePet()
  const isEditing = Boolean(pet)

  const [nome, setNome]           = useState(pet?.nome ?? '')
  const [descricao, setDescricao] = useState(pet?.descricao ?? '')
  const [disponivel, setDisponivel] = useState(pet?.disponivel ?? true)
  const [especie, setEspecie]     = useState<Especie>(pet?.caracteristica?.especie ?? 'CAO')
  const [porte, setPorte]         = useState<Porte>(pet?.caracteristica?.porte ?? 'MEDIO')
  const [sexo, setSexo]           = useState<Sexo>(pet?.caracteristica?.sexo ?? 'MACHO')
  const [raca, setRaca]           = useState(pet?.caracteristica?.raca ?? '')
  const [vacinado, setVacinado]     = useState(pet?.saude?.vacinado ?? false)
  const [castrado, setCastrado]     = useState(pet?.saude?.castrado ?? false)
  const [vermifugado, setVermifugado] = useState(pet?.saude?.vermifugado ?? false)
  const [imagem, setImagem]       = useState<File | undefined>()

  const isPending = createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      nome,
      descricao: descricao || undefined,
      disponivel,
      caracteristica: { especie, porte, sexo, raca: raca || undefined },
      saude: { vacinado, castrado, vermifugado },
    }
    try {
      if (isEditing && pet) {
        await updateMutation.mutateAsync({ id: pet.id, data, imagem })
        showToast('Pet atualizado!', 'success')
      } else {
        await createMutation.mutateAsync({ data, imagem })
        showToast('Pet cadastrado!', 'success')
      }
      onClose()
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pet-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="pet-modal-title" className="font-display text-3xl font-light text-carbon-800">
            {isEditing ? 'Editar pet' : 'Novo pet'}
          </h2>
          <button aria-label="Fechar" onClick={onClose} className="font-body text-carbon-800/40 hover:text-carbon-800">&#x2715;</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <Input label="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1">
              <span className="font-body text-sm text-carbon-800/70">Espécie</span>
              <select value={especie} onChange={(e) => setEspecie(e.target.value as Especie)}
                className="input-base">
                <option value="CAO">Cão</option>
                <option value="GATO">Gato</option>
                <option value="OUTRO">Outro</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-body text-sm text-carbon-800/70">Porte</span>
              <select value={porte} onChange={(e) => setPorte(e.target.value as Porte)}
                className="input-base">
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="font-body text-sm text-carbon-800/70">Sexo</span>
              <select value={sexo} onChange={(e) => setSexo(e.target.value as Sexo)}
                className="input-base">
                <option value="MACHO">Macho</option>
                <option value="FEMEA">Fêmea</option>
              </select>
            </label>
          </div>

          <Input label="Raça (opcional)" value={raca} onChange={(e) => setRaca(e.target.value)} />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 font-body text-sm text-carbon-800 cursor-pointer">
              <input type="checkbox" checked={vacinado} onChange={(e) => setVacinado(e.target.checked)} />
              Vacinado
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-carbon-800 cursor-pointer">
              <input type="checkbox" checked={castrado} onChange={(e) => setCastrado(e.target.checked)} />
              Castrado
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-carbon-800 cursor-pointer">
              <input type="checkbox" checked={vermifugado} onChange={(e) => setVermifugado(e.target.checked)} />
              Vermifugado
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-carbon-800 cursor-pointer">
              <input type="checkbox" checked={disponivel} onChange={(e) => setDisponivel(e.target.checked)} />
              Disponível
            </label>
          </div>

          <label className="flex flex-col gap-1">
            <span className="font-body text-sm text-carbon-800/70">Foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagem(e.target.files?.[0])}
              className="font-body text-sm text-carbon-800"
            />
          </label>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={isPending} className="flex-1">
              {isEditing ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
