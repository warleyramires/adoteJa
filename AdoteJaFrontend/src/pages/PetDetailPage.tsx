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
          <p className="font-display text-3xl font-normal text-carbon-800/30 mb-4">Pet não encontrado</p>
          <Link to="/pets">
            <Button variant="ghost">← Voltar para listagem</Button>
          </Link>
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
          <div className="h-96 bg-pedra-200 rounded-3xl" />
          <div className="h-8 bg-pedra-200 rounded w-1/3" />
          <div className="h-4 bg-pedra-100 rounded w-2/3" />
        </div>
      </PageLayout>
    )
  }

  if (isError || !pet) {
    return (
      <PageLayout>
        <div className="text-center py-24">
          <p className="font-display text-3xl font-normal text-carbon-800/30 mb-4">Pet não encontrado</p>
          <Link to="/pets">
            <Button variant="ghost">← Voltar para listagem</Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  const c = pet.caracteristica
  const s = pet.saude

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <Link
        to="/pets"
        className="inline-flex items-center gap-1 font-body text-sm text-carbon-800/50 hover:text-ambar-500 mb-8 transition-colors"
      >
        ← Voltar para listagem
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Foto */}
        <div className="aspect-[4/3] bg-pedra-100 rounded-3xl overflow-hidden">
          {pet.imagemUrl ? (
            <img src={pet.imagemUrl} alt={pet.nome} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
          )}
        </div>

        {/* Informações */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display text-5xl font-normal text-carbon-800">{pet.nome}</h1>
              {pet.disponivel
                ? <Badge variant="azul">Disponível</Badge>
                : <Badge variant="neutral">Indisponível</Badge>
              }
            </div>

            {/* Características */}
            {c && (
              <div className="flex flex-wrap gap-2 mt-3">
                {c.especie && <Badge variant="pedra">{especieLabel[c.especie]}</Badge>}
                {c.porte   && <Badge variant="pedra">{porteLabel[c.porte]}</Badge>}
                {c.sexo    && <Badge variant="pedra">{sexoLabel[c.sexo]}</Badge>}
                {c.raca    && <Badge variant="neutral">{c.raca}</Badge>}
                {c.cor     && <Badge variant="neutral">{c.cor}</Badge>}
              </div>
            )}
          </div>

          {/* Descrição */}
          {pet.descricao && (
            <p className="font-body text-base text-carbon-800/70 leading-relaxed">{pet.descricao}</p>
          )}

          {/* Saúde */}
          {s && (
            <div>
              <p className="section-label mb-3">Saúde</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Vacinado',    value: s.vacinado },
                  { label: 'Castrado',    value: s.castrado },
                  { label: 'Vermifugado', value: s.vermifugado },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-creme-50 rounded-2xl p-3 text-center border border-pedra-200">
                    <span className="block text-2xl mb-1">{value === true ? '✓' : value === false ? '✗' : '—'}</span>
                    <span className={`font-body text-xs font-medium ${
                      value === true ? 'text-azul-600' : value === false ? 'text-red-500' : 'text-carbon-800/40'
                    }`}>{label}</span>
                  </div>
                ))}
              </div>
              {s.historicoSaude && (
                <p className="font-body text-sm text-carbon-800/60 mt-3 bg-pedra-100 rounded-2xl px-4 py-3">
                  {s.historicoSaude}
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          {pet.disponivel && (
            <div className="mt-auto pt-4 border-t border-pedra-200">
              {isAuthenticated ? (
                <Button
                  className="w-full"
                  size="lg"
                  loading={solicitarMutation.isPending}
                  disabled={solicitarMutation.isSuccess}
                  onClick={handleSolicitar}
                >
                  {solicitarMutation.isSuccess ? 'Solicitação enviada ✓' : 'Solicitar adoção'}
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="font-body text-sm text-carbon-800/50 text-center">
                    Você precisa estar logado para solicitar adoção
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login"><Button variant="secondary" className="w-full">Entrar</Button></Link>
                    <Link to="/cadastro"><Button className="w-full">Criar conta</Button></Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
