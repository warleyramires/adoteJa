import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../features/auth/hooks/useLogin'
import { useAuth } from '../hooks/useAuth'
import { getApiError } from '../lib/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function LoginPage() {
  const navigate = useNavigate()
  const { saveToken } = useAuth()
  const loginMutation = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const { token } = await loginMutation.mutateAsync({ email, password })
      saveToken(token)
      navigate('/')
    } catch (err) {
      setError(getApiError(err).message)
    }
  }

  return (
    <div className="min-h-screen bg-creme-100 flex">
      {/* Painel esquerdo — decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-floresta-500 flex-col justify-between p-16">
        <Link to="/" className="font-display text-2xl font-medium text-creme-50">
          adote<span className="text-terracota-300">já</span>
        </Link>
        <div>
          <h2 className="font-display text-5xl font-light text-creme-50 leading-tight mb-4">
            Bem-vindo de<br />
            <em className="text-terracota-300 not-italic">volta</em>
          </h2>
          <p className="font-body text-base text-floresta-200 leading-relaxed">
            Entre na sua conta para gerenciar suas solicitações de adoção.
          </p>
        </div>
        <p className="font-body text-sm text-floresta-300">
          © {new Date().getFullYear()} AdoteJá
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden block mb-10 font-display text-2xl font-medium text-carbon-800">
            adote<span className="text-terracota-500">já</span>
          </Link>

          <h1 className="font-display text-4xl font-light text-carbon-800 mb-2">Entrar</h1>
          <p className="font-body text-sm text-carbon-800/50 mb-8">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-terracota-500 hover:underline">
              Cadastre-se
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <p className="font-body text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">
                {error}
              </p>
            )}

            <Button type="submit" loading={loginMutation.isPending} className="mt-2 w-full">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
