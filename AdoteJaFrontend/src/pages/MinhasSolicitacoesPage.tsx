import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Badge } from '../components/ui/Badge'
import { useMinhasSolicitacoes } from '../features/adocao/hooks/useSolicitacoes'
import { especieLabel, formatDate } from '../lib/utils'
import type { StatusSolicitacao } from '../types'

const statusConfig: Record<StatusSolicitacao, { label: string; variant: 'azul' | 'ambar' | 'neutral'; dot: string }> = {
  PENDENTE:  { label: 'Pendente',  variant: 'neutral', dot: 'bg-outline' },
  APROVADA:  { label: 'Aprovada',  variant: 'azul',    dot: 'bg-secondary' },
  RECUSADA:  { label: 'Recusada',  variant: 'ambar',   dot: 'bg-primary' },
}

export function MinhasSolicitacoesPage() {
  const { data: solicitacoes, isLoading, isError } = useMinhasSolicitacoes()

  const total    = solicitacoes?.length ?? 0
  const pendente = solicitacoes?.filter((s) => s.status === 'PENDENTE').length ?? 0
  const aprovada = solicitacoes?.filter((s) => s.status === 'APROVADA').length ?? 0

  return (
    <PageLayout>
      <section className="mb-12">
        <span className="section-label mb-3 block">Sua jornada</span>
        <h1 className="font-headline text-5xl font-extrabold tracking-tight text-on-surface mb-3">Jornada de Adoção</h1>
        <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
          Acompanhe o progresso das suas solicitações. Cada história começa com um passo.
        </p>
      </section>

      {/* Bento stats */}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-lg shadow-editorial flex flex-col justify-between overflow-hidden relative">
            <div className="z-10">
              <span className="section-label mb-2 block">Total ativas</span>
              <h2 className="font-headline text-6xl font-extrabold text-on-surface">{String(total).padStart(2, '0')}</h2>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-on-surface/5">pets</span>
          </div>
          <div className="bg-primary-fixed p-8 rounded-lg flex flex-col justify-between">
            <span className="font-body text-sm font-bold uppercase tracking-widest text-on-primary-fixed-variant block mb-2">Pendentes</span>
            <h2 className="font-headline text-4xl font-bold text-on-primary-fixed">{String(pendente).padStart(2, '0')}</h2>
          </div>
          <div className="bg-secondary-fixed p-8 rounded-lg flex flex-col justify-between">
            <span className="font-body text-sm font-bold uppercase tracking-widest text-on-secondary-fixed-variant block mb-2">Aprovadas</span>
            <h2 className="font-headline text-4xl font-bold text-on-secondary-fixed">{String(aprovada).padStart(2, '0')}</h2>
          </div>
        </div>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-lg h-28 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-24">
          <p className="font-headline text-3xl font-bold text-on-surface/30">Erro ao carregar solicitações</p>
        </div>
      ) : !solicitacoes?.length ? (
        <div className="text-center py-24">
          <p className="font-headline text-3xl font-bold text-on-surface/30 mb-4">Você ainda não fez solicitações</p>
          <Link to="/pets" className="font-body text-sm text-primary hover:underline">Ver animais disponíveis →</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {solicitacoes.map((s) => {
            const cfg = statusConfig[s.status]
            return (
              <div key={s.id}
                className="group bg-surface-container-lowest hover:bg-white transition-all duration-500 rounded-lg p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-editorial">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                  {s.imagemUrl ? (
                    <img src={s.imagemUrl} alt={s.nomePet} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🐾</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-headline text-xl font-bold text-on-surface">{s.nomePet}</h3>
                    {s.especie && <Badge variant="pedra">{especieLabel[s.especie]}</Badge>}
                  </div>
                  <p className="font-body text-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    Solicitado em {formatDate(s.dataSolicitacao)}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{ backgroundColor: cfg.variant === 'azul' ? '#d4e3ff' : cfg.variant === 'ambar' ? '#ffdcc4' : '#e3e2e1',
                           color: cfg.variant === 'azul' ? '#001c39' : cfg.variant === 'ambar' ? '#703800' : '#1a1c1c' }}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageLayout>
  )
}
