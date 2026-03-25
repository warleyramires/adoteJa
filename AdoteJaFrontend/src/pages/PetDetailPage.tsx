import { useParams, Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { usePet } from '../features/pets/hooks/usePets'
import { useCriarSolicitacao } from '../features/adocao/hooks/useSolicitacoes'
import { useAuthContext } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { especieLabel, porteLabel, sexoLabel } from '../lib/utils'
import { getApiError } from '../lib/api'

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuthContext()
  const { showToast } = useToast()

  const petId = Number(id)
  const { data: pet, isLoading, isError } = usePet(petId)
  const solicitarMutation = useCriarSolicitacao()

  if (!id || isNaN(petId)) {
    return (
      <PageLayout>
        <div className="text-center py-24">
          <p className="font-headline text-3xl font-bold text-on-surface/30 mb-4">Pet não encontrado</p>
          <Link to="/pets"><Button variant="ghost">← Voltar para listagem</Button></Link>
        </div>
      </PageLayout>
    )
  }

  async function handleSolicitar() {
    try {
      await solicitarMutation.mutateAsync(petId)
      showToast('Solicitação enviada com sucesso! Aguarde o contato da ONG.', 'success')
    } catch (err) {
      showToast(getApiError(err).message, 'error')
    }
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-[500px] bg-surface-container rounded-lg" />
          <div className="h-8 bg-surface-container rounded w-1/3" />
        </div>
      </PageLayout>
    )
  }

  if (isError || !pet) {
    return (
      <PageLayout>
        <div className="text-center py-24">
          <p className="font-headline text-3xl font-bold text-on-surface/30 mb-4">Pet não encontrado</p>
          <Link to="/pets"><Button variant="ghost">← Voltar para listagem</Button></Link>
        </div>
      </PageLayout>
    )
  }

  const c = pet.caracteristica
  const s = pet.saude

  return (
    <PageLayout>
      <Link to="/pets" className="inline-flex items-center gap-1 font-body text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors">
        ← Voltar para listagem
      </Link>

      {/* Hero gallery + sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="relative h-[480px] rounded-lg overflow-hidden shadow-editorial-lg bg-surface-container">
            {pet.imagemUrl ? (
              <img src={pet.imagemUrl} alt={pet.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
            )}
            {pet.disponivel && (
              <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                Disponível para adoção
              </span>
            )}
          </div>
        </div>

        {/* Info sidebar */}
        <div className="lg:col-span-5 bg-surface-container-low p-8 rounded-lg sticky top-28 space-y-6">
          <div>
            {pet.disponivel && (
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-secondary text-base">verified</span>
                <span className="font-body text-sm font-semibold text-secondary uppercase tracking-widest">Disponível para adoção</span>
              </div>
            )}
            <h1 className="font-headline text-5xl font-extrabold text-on-surface tracking-tight mb-2">{pet.nome}</h1>
            {c && (
              <p className="font-body text-xl text-on-surface-variant font-medium">
                {c.especie && especieLabel[c.especie]}
                {c.sexo && ` · ${sexoLabel[c.sexo]}`}
                {c.raca && ` · ${c.raca}`}
              </p>
            )}
          </div>

          {c && (
            <div className="flex flex-wrap gap-2">
              {c.porte && <Badge variant="pedra">{porteLabel[c.porte]}</Badge>}
              {c.cor && <Badge variant="neutral">{c.cor}</Badge>}
            </div>
          )}

          {pet.descricao && (
            <p className="font-body text-base text-on-surface-variant leading-relaxed">{pet.descricao}</p>
          )}

          {/* Saúde quick stats */}
          {s && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Vacinado', value: s.vacinado },
                { label: 'Castrado', value: s.castrado },
                { label: 'Vermifugado', value: s.vermifugado },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-container-lowest p-3 rounded text-center shadow-editorial">
                  <span className="block text-lg mb-0.5">{value === true ? '✓' : value === false ? '✗' : '—'}</span>
                  <span className={`font-body text-xs font-semibold ${
                    value === true ? 'text-secondary' : value === false ? 'text-error' : 'text-on-surface-variant'
                  }`}>{label}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          {pet.disponivel && (
            <div className="pt-2 space-y-3">
              {isAuthenticated ? (
                <Button className="w-full justify-center" size="lg"
                  loading={solicitarMutation.isPending}
                  disabled={solicitarMutation.isSuccess}
                  onClick={handleSolicitar}>
                  {solicitarMutation.isSuccess
                    ? <><span className="material-symbols-outlined text-sm">check</span> Solicitação enviada</>
                    : <><span className="material-symbols-outlined text-sm">favorite</span> Solicitar adoção</>}
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="font-body text-sm text-on-surface-variant text-center">
                    Você precisa estar logado para solicitar adoção
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login"><Button variant="secondary" className="w-full justify-center">Entrar</Button></Link>
                    <Link to="/cadastro"><Button className="w-full justify-center">Criar conta</Button></Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Detalhe de saúde */}
      {s?.historicoSaude && (
        <section className="max-w-2xl">
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-4">Histórico de saúde</h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed bg-primary-fixed/30 px-6 py-5 rounded-lg border border-primary-fixed">
            {s.historicoSaude}
          </p>
        </section>
      )}
    </PageLayout>
  )
}
