import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useTodasSolicitacoes, useUpdateSolicitacao } from '../../features/adocao/hooks/useSolicitacoes'
import { useToast } from '../../contexts/ToastContext'
import { especieLabel, formatDate } from '../../lib/utils'
import { getApiError } from '../../lib/api'
import type { StatusSolicitacao } from '../../types'

const statusVariant: Record<StatusSolicitacao, 'floresta' | 'terracota' | 'neutral'> = {
  PENDENTE: 'neutral',
  APROVADA: 'floresta',
  RECUSADA: 'terracota',
}

export function AdminSolicitacoesPage() {
  const { data: solicitacoes, isLoading, isError } = useTodasSolicitacoes()
  const updateMutation = useUpdateSolicitacao()
  const { showToast } = useToast()

  async function changeStatus(id: number, status: StatusSolicitacao) {
    try {
      await updateMutation.mutateAsync({ id, data: { status } })
      showToast(
        status === 'APROVADA' ? 'Solicitação aprovada.' : 'Solicitação recusada.',
        'success'
      )
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    }
  }

  return (
    <PageLayout>
      <div className="mb-10">
        <p className="section-label mb-2">Painel</p>
        <h1 className="font-display text-5xl font-light text-carbon-800">Solicitações</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-28" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-24">
          <p className="font-display text-3xl font-light text-carbon-800/30">
            Erro ao carregar solicitações
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(solicitacoes ?? []).map((s) => (
            <div key={s.id} className="card p-5 flex items-center gap-5">
              {/* Foto */}
              <div className="w-16 h-16 rounded-2xl bg-areia-100 overflow-hidden flex-shrink-0">
                {s.pet.imagemUrl
                  ? <img src={s.pet.imagemUrl} alt={s.pet.nome} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg font-medium text-carbon-800">
                  {s.pet.nome}
                  {s.pet.caracteristica?.especie && (
                    <span className="ml-2 font-body text-sm font-normal text-carbon-800/50">
                      {especieLabel[s.pet.caracteristica.especie]}
                    </span>
                  )}
                </p>
                <p className="font-body text-sm text-carbon-800/50">
                  {s.adotante.nome} · {formatDate(s.dataSolicitacao)}
                </p>
              </div>

              {/* Status + Actions */}
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                {s.status === 'PENDENTE' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => changeStatus(s.id, 'APROVADA')}
                      loading={updateMutation.isPending}
                    >
                      Aprovar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => changeStatus(s.id, 'RECUSADA')}
                      loading={updateMutation.isPending}
                    >
                      Recusar
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
