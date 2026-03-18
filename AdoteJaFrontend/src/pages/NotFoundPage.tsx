import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PageLayout } from '../components/layout/PageLayout'

export function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-[8rem] font-light leading-none text-areia-300 mb-4">404</p>
        <h1 className="font-display text-4xl font-light text-carbon-800 mb-3">
          Página não encontrada
        </h1>
        <p className="font-body text-base text-carbon-800/50 mb-10 max-w-sm">
          O endereço que você acessou não existe ou foi removido.
        </p>
        <Link to="/">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    </PageLayout>
  )
}
