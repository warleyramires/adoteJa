import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Badge } from '../components/ui/Badge'
import { useMinhasSolicitacoes } from '../features/adocao/hooks/useSolicitacoes'
import { especieLabel, formatDate } from '../lib/utils'
import type { StatusSolicitacao } from '../types'

const statusConfig: Record<StatusSolicitacao, { label: string; variant: 'floresta' | 'terracota' | 'neutral' }> = {
  PENDENTE:  { label: 'Pendente',  variant: 'neutral' },
  APROVADA:  { label: 'Aprovada',  variant: 'floresta' },
  RECUSADA:  { label: 'Recusada',  variant: 'terracota' },
}

export function MinhasSolicitacoesPage() {
  const { data: solicitacoes, isLoading, isError } = useMinhasSolicitacoes()

  return (
    <PageLayout>
      <div className="mb-10">
        <p className="section-label mb-2">Sua jornada</p>
        <h1 className="font-display text-5xl font-light text-carbon-800">Minhas solicitações</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-28" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30">
            Erro ao carregar solicitações
          </p>
        </div>
      ) : !solicitacoes?.length ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30 mb-4">
            Você ainda não fez solicitações
          </p>
          <Link
            to="/pets"
            className="font-body text-sm text-terracota-500 hover:underline"
          >
            Ver animais disponíveis →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitacoes.map((s) => {
            const cfg = statusConfig[s.status]
            return (
              <div key={s.id} className="card p-5 flex items-center gap-5">
                {/* Foto */}
                <div className="w-20 h-20 rounded-2xl bg-areia-100 overflow-hidden flex-shrink-0">
                  {s.imagemUrl ? (
                    <img src={s.imagemUrl} alt={s.nomePet} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🐾</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-xl font-medium text-carbon-800">{s.nomePet}</h3>
                    {s.especie && (
                      <Badge variant="areia">{especieLabel[s.especie]}</Badge>
                    )}
                  </div>
                  <p className="font-body text-sm text-carbon-800/50">
                    Solicitado em {formatDate(s.dataSolicitacao)}
                  </p>
                </div>

                {/* Status */}
                <Badge variant={cfg.variant}>{cfg.label}</Badge>
              </div>
            )
          })}
        </div>
      )}
    </PageLayout>
  )
}
