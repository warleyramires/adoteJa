import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuthContext } from '../../contexts/AuthContext'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/pets', label: 'Adotar' },
]

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isMember, logout } = useAuthContext()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-editorial font-headline antialiased">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-on-surface hover:text-primary transition-colors">
          adote<span className="text-primary">já</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const active =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors ${
                  active
                    ? 'text-primary border-b-2 border-primary pb-0.5'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <span className="font-body text-sm text-on-surface-variant hidden sm:block">
                Olá, <strong className="text-on-surface font-semibold">{user.nome}</strong>
              </span>
              {!isMember && (
                <>
                  <Link to="/minhas-solicitacoes">
                    <Button variant="ghost" size="sm">Minhas adoções</Button>
                  </Link>
                  <Link to="/minha-conta">
                    <Button variant="ghost" size="sm">Minha conta</Button>
                  </Link>
                </>
              )}
              {isMember && (
                <>
                  <Link to="/admin/solicitacoes">
                    <Button variant="ghost" size="sm">Solicitações</Button>
                  </Link>
                  <Link to="/admin/pets">
                    <Button variant="ghost" size="sm">Pets</Button>
                  </Link>
                  <Link to="/admin/funcionarios">
                    <Button variant="ghost" size="sm">Funcionários</Button>
                  </Link>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>Sair</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/cadastro">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
