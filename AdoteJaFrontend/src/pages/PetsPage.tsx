import { useState } from 'react'
import { PageLayout } from '../components/layout/PageLayout'
import { Badge } from '../components/ui/Badge'
import { usePets } from '../features/pets/hooks/usePets'
import { especieLabel, porteLabel } from '../lib/utils'
import type { Especie, Porte, PetFilters } from '../types'

const especieOptions: { value: Especie | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'CAO', label: 'Cães' },
  { value: 'GATO', label: 'Gatos' },
  { value: 'OUTRO', label: 'Outros' },
]

export function PetsPage() {
  const [filters, setFilters] = useState<PetFilters>({ disponivel: true, size: 12 })
  const { data, isLoading } = usePets(filters)

  const pets = data?.content ?? []

  function setEspecie(especie: Especie | '') {
    setFilters((f) => ({ ...f, especie: especie || undefined, page: 0 }))
  }

  return (
    <PageLayout>
      {/* Header da página */}
      <div className="mb-10">
        <p className="section-label mb-2">Disponíveis agora</p>
        <h1 className="font-display text-5xl font-light text-carbon-800">
          Encontre seu pet
        </h1>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-8">
        {especieOptions.map((opt) => {
          const active = (filters.especie ?? '') === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setEspecie(opt.value as Especie | '')}
              className={`font-body text-sm font-medium px-4 py-2 rounded-full border transition-all duration-150 ${
                active
                  ? 'bg-terracota-500 text-creme-50 border-terracota-500'
                  : 'bg-white text-carbon-800 border-areia-300 hover:border-terracota-300'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="bg-areia-200 aspect-[4/3]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-areia-200 rounded w-2/3" />
                <div className="h-3 bg-areia-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30 mb-2">Nenhum pet encontrado</p>
          <p className="font-body text-sm text-carbon-800/40">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div key={pet.id} className="card group hover:-translate-y-1 transition-all duration-200">
              {/* Imagem */}
              <div className="aspect-[4/3] bg-areia-100 overflow-hidden">
                {pet.imagemUrl ? (
                  <img
                    src={pet.imagemUrl}
                    alt={pet.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display text-xl font-medium text-carbon-800">{pet.nome}</h3>
                  {pet.disponivel && <Badge variant="floresta">Disponível</Badge>}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {pet.caracteristica?.especie && (
                    <Badge variant="areia">{especieLabel[pet.caracteristica.especie]}</Badge>
                  )}
                  {pet.caracteristica?.porte && (
                    <Badge variant="areia">{porteLabel[pet.caracteristica.porte]}</Badge>
                  )}
                </div>
                {pet.descricao && (
                  <p className="font-body text-sm text-carbon-800/50 line-clamp-2">{pet.descricao}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: data.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setFilters((f) => ({ ...f, page: i }))}
              className={`w-9 h-9 rounded-full font-body text-sm font-medium transition-all ${
                data.number === i
                  ? 'bg-terracota-500 text-creme-50'
                  : 'bg-white border border-areia-300 text-carbon-800 hover:border-terracota-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
