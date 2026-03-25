import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { PageLayout } from '../components/layout/PageLayout'

export function NotFoundPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-headline text-[8rem] font-extrabold leading-none text-on-surface/10 mb-4">404</p>
        <h1 className="font-headline text-4xl font-bold text-on-surface mb-3">
          Página não encontrada
        </h1>
        <p className="font-body text-base text-on-surface-variant mb-10 max-w-sm">
          O endereço que você acessou não existe ou foi removido.
        </p>
        <Link to="/">
          <Button>Voltar ao início</Button>
        </Link>
      </div>
    </PageLayout>
  )
}
