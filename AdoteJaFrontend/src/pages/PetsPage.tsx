import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Badge } from '../components/ui/Badge'
import { usePets } from '../features/pets/hooks/usePets'
import { especieLabel, porteLabel, sexoLabel } from '../lib/utils'
import type { Especie, Porte, Sexo, PetFilters } from '../types'

const especieOptions: { value: Especie | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'CAO', label: 'Cães' },
  { value: 'GATO', label: 'Gatos' },
  { value: 'OUTRO', label: 'Outros' },
]

const porteOptions: { value: Porte | ''; label: string }[] = [
  { value: '', label: 'Qualquer porte' },
  { value: 'PEQUENO', label: 'Pequeno' },
  { value: 'MEDIO', label: 'Médio' },
  { value: 'GRANDE', label: 'Grande' },
]

const sexoOptions: { value: Sexo | ''; label: string }[] = [
  { value: '', label: 'Qualquer sexo' },
  { value: 'MACHO', label: 'Macho' },
  { value: 'FEMEA', label: 'Fêmea' },
]

function FilterPill<T extends string>({
  options, value, onChange,
}: {
  options: { value: T | ''; label: string }[]
  value: T | undefined
  onChange: (v: T | '') => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = (value ?? '') === opt.value
        return (
          <button key={opt.value} onClick={() => onChange(opt.value as T | '')}
            className={`font-body text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 ${
              active
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-highest text-on-surface hover:bg-surface-variant'
            }`}>
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export function PetsPage() {
  const [filters, setFilters] = useState<PetFilters>({ disponivel: true, size: 12 })
  const { data, isLoading } = usePets(filters)
  const pets = data?.content ?? []

  function set<K extends keyof PetFilters>(key: K, value: PetFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 0 }))
  }

  return (
    <PageLayout>
      {/* Hero */}
      <div className="max-w-3xl mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-4">
          Encontre seu novo <span className="text-primary italic">Companheiro</span>.
        </h1>
        <p className="text-lg text-on-surface-variant font-body leading-relaxed max-w-xl">
          Nossa seleção de animais esperando por um lar. Cada um tem uma história e um coração pronto para amar.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-surface-container-low rounded-lg p-6 md:p-8 flex flex-col gap-6 shadow-sm mb-12">
        <div className="space-y-2">
          <label className="font-body text-sm font-semibold uppercase tracking-wider text-on-surface-variant ml-1">Espécie</label>
          <FilterPill options={especieOptions} value={filters.especie} onChange={(v) => set('especie', v as Especie)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-body text-sm font-semibold uppercase tracking-wider text-on-surface-variant ml-1">Porte</label>
            <FilterPill options={porteOptions} value={filters.porte} onChange={(v) => set('porte', v as Porte)} />
          </div>
          <div className="space-y-2">
            <label className="font-body text-sm font-semibold uppercase tracking-wider text-on-surface-variant ml-1">Sexo</label>
            <FilterPill options={sexoOptions} value={filters.sexo} onChange={(v) => set('sexo', v as Sexo)} />
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-lg animate-pulse">
              <div className="bg-surface-container aspect-[4/5] rounded-lg" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-surface-container rounded w-2/3" />
                <div className="h-3 bg-surface-container-low rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-headline text-3xl font-bold text-on-surface/30 mb-2">Nenhum pet encontrado</p>
          <p className="font-body text-sm text-on-surface-variant">Tente ajustar os filtros</p>
        </div>
      ) : (
        <>
          <div className="flex items-end mb-10">
            <h2 className="font-headline text-2xl font-bold text-on-surface">
              Companheiros disponíveis
              <span className="text-outline text-lg font-normal ml-3">({data?.totalElements ?? pets.length})</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {pets.map((pet) => (
              <Link key={pet.id} to={`/pets/${pet.id}`}
                className="group relative bg-surface-container-lowest rounded-lg p-4 transition-all duration-300 hover:shadow-editorial-lg block">
                <div className="aspect-[4/5] rounded-lg overflow-hidden mb-5 relative bg-surface-container">
                  {pet.imagemUrl ? (
                    <img src={pet.imagemUrl} alt={pet.nome}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
                  )}
                  {pet.disponivel && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-primary">
                      Disponível
                    </div>
                  )}
                </div>
                <div className="px-1">
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-1">{pet.nome}</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pet.caracteristica?.especie && (
                      <Badge variant="azul">{especieLabel[pet.caracteristica.especie]}</Badge>
                    )}
                    {pet.caracteristica?.porte && (
                      <Badge variant="pedra">{porteLabel[pet.caracteristica.porte]}</Badge>
                    )}
                    {pet.caracteristica?.sexo && (
                      <Badge variant="neutral">{sexoLabel[pet.caracteristica.sexo]}</Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Paginação */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-16">
          {Array.from({ length: data.totalPages }).map((_, i) => (
            <button key={i} onClick={() => setFilters((f) => ({ ...f, page: i }))}
              className={`w-10 h-10 rounded-full font-body text-sm font-semibold transition-all ${
                data.number === i
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
