import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAuthContext } from '../contexts/AuthContext'

const stats = [
  { value: '2.4k', label: 'animais adotados' },
  { value: '180+', label: 'parceiros ativos' },
  { value: '98%', label: 'satisfação' },
]

const species = [
  { label: 'Cães', emoji: '🐕', href: '/pets?especie=CAO', color: 'bg-terracota-100' },
  { label: 'Gatos', emoji: '🐈', href: '/pets?especie=GATO', color: 'bg-floresta-100' },
  { label: 'Outros', emoji: '🐾', href: '/pets?especie=OUTRO', color: 'bg-areia-200' },
]

export function HomePage() {
  const { isAuthenticated } = useAuthContext()

  return (
    <PageLayout fluid>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-creme-100">
        {/* Decorative blob */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #C4613A 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl mx-auto px-6 py-24 md:py-36 grid md:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div className="animate-fade-up">
            <Badge variant="terracota" className="mb-6">
              Adoção responsável
            </Badge>
            <h1 className="font-display text-6xl md:text-7xl font-light leading-[1.05] text-carbon-800 mb-6">
              Um lar para<br />
              <em className="text-terracota-500 not-italic">cada animal</em>
            </h1>
            <p className="font-body text-lg text-carbon-800/60 leading-relaxed mb-10 max-w-md">
              Conectamos animais que precisam de amor com famílias prontas para oferecer um novo começo.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/pets">
                <Button size="lg">Ver animais disponíveis</Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/cadastro">
                  <Button variant="secondary" size="lg">Quero adotar</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Stats card */}
          <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="card p-8 bg-white">
              <p className="section-label mb-6">Nosso impacto</p>
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-display text-4xl font-medium text-terracota-500 mb-1">
                      {stat.value}
                    </p>
                    <p className="font-body text-xs text-carbon-800/50 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Espécies ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-2">Quem está esperando</p>
            <h2 className="font-display text-4xl font-light text-carbon-800">
              Encontre seu companheiro
            </h2>
          </div>
          <Link to="/pets" className="font-body text-sm text-terracota-500 hover:underline hidden md:block">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {species.map((s) => (
            <Link
              key={s.label}
              to={s.href}
              className={`${s.color} rounded-3xl p-8 flex flex-col items-center gap-3 group hover:shadow-card transition-all duration-200 hover:-translate-y-1`}
            >
              <span className="text-5xl">{s.emoji}</span>
              <span className="font-display text-xl font-medium text-carbon-800 group-hover:text-terracota-500 transition-colors">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-floresta-500 text-creme-50">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="section-label text-floresta-200 mb-4">Pronto para o próximo passo?</p>
          <h2 className="font-display text-5xl font-light text-creme-50 mb-6">
            Mude uma vida hoje
          </h2>
          <p className="font-body text-base text-floresta-200 mb-10 max-w-lg mx-auto">
            Cadastre-se gratuitamente e comece o processo de adoção. É simples, rápido e transforma vidas.
          </p>
          {!isAuthenticated && (
            <Link to="/cadastro">
              <Button className="bg-creme-50 !text-floresta-500 hover:bg-creme-100 hover:!text-floresta-600" size="lg">
                Criar minha conta
              </Button>
            </Link>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
