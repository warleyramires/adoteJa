import { useState } from 'react'
import { PageLayout } from '../../components/layout/PageLayout'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useTodasSolicitacoes, useUpdateSolicitacao } from '../../features/adocao/hooks/useSolicitacoes'
import { useToast } from '../../contexts/ToastContext'
import { especieLabel, formatDate } from '../../lib/utils'
import { getApiError } from '../../lib/api'
import type { StatusSolicitacao } from '../../types'

const statusVariant: Record<StatusSolicitacao, 'azul' | 'ambar' | 'neutral'> = {
  PENDENTE: 'neutral',
  APROVADA: 'azul',
  RECUSADA: 'ambar',
}

const statusLabel: Record<StatusSolicitacao, string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  RECUSADA: 'Recusada',
}

export function AdminSolicitacoesPage() {
  const { data: solicitacoes, isLoading, isError } = useTodasSolicitacoes()
  const updateMutation = useUpdateSolicitacao()
  const { showToast } = useToast()
  const [pendingId, setPendingId] = useState<number | null>(null)

  const total   = solicitacoes?.length ?? 0
  const pending = solicitacoes?.filter((s) => s.status === 'PENDENTE').length ?? 0

  async function changeStatus(id: number, status: StatusSolicitacao) {
    setPendingId(id)
    try {
      await updateMutation.mutateAsync({ id, data: { status } })
      showToast(status === 'APROVADA' ? 'Solicitação aprovada.' : 'Solicitação recusada.', 'success')
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <PageLayout>
      {/* Header assimétrico */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-end">
        <div className="lg:col-span-7">
          <span className="section-label mb-3 block">Administração</span>
          <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight leading-tight">
            Gerenciar <br />Solicitações
          </h1>
          <p className="mt-4 text-on-surface-variant font-body text-lg max-w-xl leading-relaxed">
            Revise as solicitações de adoção recebidas e atualize os status.
          </p>
        </div>
        {!isLoading && (
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-editorial">
              <span className="block font-headline text-3xl font-bold text-primary">{pending}</span>
              <span className="font-body text-sm text-on-surface-variant">Aguardando revisão</span>
            </div>
            <div className="bg-primary-fixed p-6 rounded-lg shadow-editorial">
              <span className="block font-headline text-3xl font-bold text-on-primary-fixed">{total}</span>
              <span className="font-body text-sm text-on-primary-fixed-variant">Total de solicitações</span>
            </div>
          </div>
        )}
      </header>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-lg h-24 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-24">
          <p className="font-headline text-3xl font-bold text-on-surface/30">Erro ao carregar solicitações</p>
        </div>
      ) : solicitacoes?.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-headline text-3xl font-bold text-on-surface/30">Nenhuma solicitação encontrada</p>
        </div>
      ) : (
        <div className="space-y-5">
          {(solicitacoes ?? []).map((s) => (
            <div key={s.id}
              className="group bg-surface-container-lowest p-5 rounded-lg shadow-editorial transition-all hover:-translate-y-1 flex flex-col md:flex-row items-center gap-6">
              {/* Pet */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container flex-shrink-0">
                  {s.imagemUrl
                    ? <img src={s.imagemUrl} alt={s.nomePet} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>}
                </div>
                <div>
                  <span className="font-body text-xs font-bold uppercase tracking-widest text-secondary block">{s.nomePet}</span>
                  <p className="font-body text-sm text-on-surface-variant">
                    {s.especie ? especieLabel[s.especie] : '—'}
                  </p>
                </div>
              </div>

              {/* Adotante */}
              <div className="flex-1">
                <p className="font-body font-semibold text-on-surface">{s.nomeAdotante}</p>
                <p className="font-body text-sm text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {formatDate(s.dataSolicitacao)}
                </p>
              </div>

              {/* Status + ações */}
              <div className="flex items-center gap-3">
                <Badge variant={statusVariant[s.status]}>{statusLabel[s.status]}</Badge>
                {s.status === 'PENDENTE' && (
                  <>
                    <Button size="sm" variant="secondary"
                      onClick={() => changeStatus(s.id, 'APROVADA')}
                      loading={updateMutation.isPending && pendingId === s.id}
                      aria-label={`Aprovar ${s.nomeAdotante}`}>
                      Aprovar
                    </Button>
                    <button
                      onClick={() => changeStatus(s.id, 'RECUSADA')}
                      disabled={updateMutation.isPending && pendingId === s.id}
                      className="w-9 h-9 flex items-center justify-center text-error hover:bg-error-container/30 rounded-full transition-all"
                      aria-label={`Recusar ${s.nomeAdotante}`}>
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
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
