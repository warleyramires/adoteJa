import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuthContext } from '../../contexts/AuthContext'

const navLinks = [
  { to: '/pets', label: 'Adotar' },
  { to: '/sobre', label: 'Sobre' },
]

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthContext()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-creme-100/90 backdrop-blur-md border-b border-areia-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl font-medium text-carbon-800 tracking-tight group-hover:text-terracota-500 transition-colors">
            adote<span className="text-terracota-500">já</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-body text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                location.pathname === link.to
                  ? 'text-terracota-500 bg-terracota-50'
                  : 'text-carbon-800 hover:text-terracota-500 hover:bg-areia-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="font-body text-sm text-carbon-800/70 hidden sm:block">
                Olá, <strong className="text-carbon-800 font-medium">{user.email}</strong>
              </span>
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
