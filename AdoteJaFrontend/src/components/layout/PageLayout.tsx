import { Header } from './Header'

interface PageLayoutProps {
  children: React.ReactNode
  /** Remove padding lateral (útil para full-width sections) */
  fluid?: boolean
}

export function PageLayout({ children, fluid = false }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 ${fluid ? '' : 'max-w-6xl mx-auto w-full px-6 py-10'}`}>
        {children}
      </main>
      <footer className="border-t border-pedra-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg font-medium text-carbon-800">
            adote<span className="text-ambar-500">já</span>
          </span>
          <p className="font-body text-sm text-pedra-400">
            © {new Date().getFullYear()} AdoteJá — Adoção responsável
          </p>
        </div>
      </footer>
    </div>
  )
}
