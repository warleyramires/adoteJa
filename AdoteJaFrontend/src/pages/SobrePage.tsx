import { Link } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const steps = [
  { num: '01', title: 'Cadastre-se', desc: 'Crie sua conta gratuitamente em menos de 2 minutos.' },
  { num: '02', title: 'Encontre um pet', desc: 'Navegue pelos animais disponíveis e filtre por espécie, porte e sexo.' },
  { num: '03', title: 'Solicite a adoção', desc: 'Envie sua solicitação e aguarde o contato da nossa equipe.' },
]

const values = [
  { title: 'Responsabilidade', desc: 'Cada adoção é acompanhada com cuidado para garantir o bem-estar do animal.' },
  { title: 'Transparência', desc: 'Processo claro e acessível, sem burocracia desnecessária.' },
  { title: 'Amor', desc: 'Acreditamos que todo animal merece um lar cheio de carinho.' },
]

export function SobrePage() {
  return (
    <PageLayout>
      {/* Hero */}
      <div className="text-center mb-16">
        <Badge variant="ambar" className="mb-4">Quem somos</Badge>
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold text-on-surface mb-6">
          Sobre a <em className="text-primary not-italic">AdoteJá</em>
        </h1>
        <p className="font-body text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
          Somos uma plataforma dedicada a conectar animais que precisam de amor com famílias prontas
          para oferecer um novo começo. Desde 2020, já facilitamos mais de 2.400 adoções responsáveis
          em todo o Brasil.
        </p>
      </div>

      {/* Como funciona */}
      <section className="mb-16">
        <p className="section-label text-center mb-2">Simples assim</p>
        <h2 className="font-headline text-3xl font-bold text-on-surface text-center mb-10">
          Como funciona a adoção
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="card p-8 text-center">
              <span className="font-headline text-5xl font-bold text-primary-fixed block mb-4">
                {step.num}
              </span>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{step.title}</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section className="mb-16">
        <p className="section-label text-center mb-2">Nossos pilares</p>
        <h2 className="font-headline text-3xl font-bold text-on-surface text-center mb-10">
          O que nos guia
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="bg-surface-container-low rounded-lg p-8">
              <h3 className="font-headline text-xl font-bold text-on-surface mb-3">{v.title}</h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link to="/pets">
          <Button size="lg">Ver animais disponíveis</Button>
        </Link>
      </div>
    </PageLayout>
  )
}
