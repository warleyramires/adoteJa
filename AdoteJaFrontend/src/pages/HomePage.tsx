import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAuthContext } from '../contexts/AuthContext'

import img1 from '../assets/andrew-s-ouo1hbizWwo-unsplash.jpg'
import img2 from '../assets/veronika-jorjobert-27w3ULIIJfI-unsplash.jpg'
import img3 from '../assets/alvan-nee-T-0EW-SEbsE-unsplash.jpg'
import img4 from '../assets/mia-anderson-2k6v10Y2dIg-unsplash.jpg'
import img5 from '../assets/sebastian-coman-travel-Kt5tyYM_uas-unsplash.jpg'

const carouselImages = [img1, img2, img3, img4, img5]

const species = [
  { label: 'Cães', emoji: '🐕', href: '/pets?especie=CAO', color: 'bg-terracota-100' },
  { label: 'Gatos', emoji: '🐈', href: '/pets?especie=GATO', color: 'bg-floresta-100' },
  { label: 'Outros', emoji: '🐾', href: '/pets?especie=OUTRO', color: 'bg-areia-200' },
]

export function HomePage() {
  const { isAuthenticated } = useAuthContext()
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const hoveredRef = useRef(false)
  const total = carouselImages.length

  function goTo(index: number) {
    setVisible(false)
    setTimeout(() => {
      setCurrent((index + total) % total)
      setVisible(true)
    }, 300)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hoveredRef.current) goTo(current + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [current])

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

          {/* Carousel */}
          <div
            className="animate-fade-up relative aspect-[4/3] rounded-3xl overflow-hidden"
            style={{ animationDelay: '150ms' }}
            onMouseEnter={() => { hoveredRef.current = true }}
            onMouseLeave={() => { hoveredRef.current = false }}
          >
            <img
              src={carouselImages[current]}
              alt={`Pet ${current + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Left arrow */}
            <button
              onClick={() => goTo(current - 1)}
              aria-label="Imagem anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center text-carbon-800 transition-colors"
            >
              ←
            </button>

            {/* Right arrow */}
            <button
              onClick={() => goTo(current + 1)}
              aria-label="Próxima imagem"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full w-9 h-9 flex items-center justify-center text-carbon-800 transition-colors"
            >
              →
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {carouselImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Ir para imagem ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === current ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
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
