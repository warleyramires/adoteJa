import { Header } from './Header'

interface PageLayoutProps {
  children: React.ReactNode
  fluid?: boolean
}

export function PageLayout({ children, fluid = false }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 pt-20 ${fluid ? '' : 'max-w-7xl mx-auto w-full px-8 py-10'}`}>
        {children}
      </main>
      <footer className="w-full rounded-t-xl mt-20 bg-surface-container">
        <div className="max-w-7xl mx-auto px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-headline text-lg font-bold text-on-surface">
              adote<span className="text-primary">já</span>
            </span>
            <p className="font-body text-sm text-on-surface-variant mt-1">
              Adoção responsável de animais
            </p>
          </div>
          <div className="flex gap-8 font-body text-sm text-on-surface-variant">
            <a href="/sobre" className="hover:text-primary transition-colors">Sobre</a>
            <a href="#" className="hover:text-primary transition-colors">Política de privacidade</a>
          </div>
          <p className="font-body text-sm text-on-surface-variant">
            © {new Date().getFullYear()} AdoteJá. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
